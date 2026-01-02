---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 33
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 33 of 552)

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

---[FILE: extensions/emmet/src/bufferStream.ts]---
Location: vscode-main/extensions/emmet/src/bufferStream.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Based on @sergeche's work in his emmet plugin */

import { TextDocument } from 'vscode';

/**
 * A stream reader for VSCode's `TextDocument`
 * Based on @emmetio/stream-reader and @emmetio/atom-plugin
 */
export class DocumentStreamReader {
	private document: TextDocument;
	private start: number;
	private _eof: number;
	private _sof: number;
	public pos: number;

	constructor(document: TextDocument, pos?: number, limit?: [number, number]) {
		this.document = document;
		this.start = this.pos = pos ? pos : 0;
		this._sof = limit ? limit[0] : 0;
		this._eof = limit ? limit[1] : document.getText().length;
	}

	/**
	 * Returns true only if the stream is at the start of the file.
	 */
	sof(): boolean {
		return this.pos <= this._sof;
	}

	/**
	 * Returns true only if the stream is at the end of the file.
	 */
	eof(): boolean {
		return this.pos >= this._eof;
	}

	/**
	 * Creates a new stream instance which is limited to given range for given document
	 */
	limit(start: number, end: number): DocumentStreamReader {
		return new DocumentStreamReader(this.document, start, [start, end]);
	}

	/**
	 * Returns the next character code in the stream without advancing it.
	 * Will return NaN at the end of the file.
	 */
	peek(): number {
		if (this.eof()) {
			return NaN;
		}
		return this.document.getText().charCodeAt(this.pos);
	}

	/**
	 * Returns the next character in the stream and advances it.
	 * Also returns NaN when no more characters are available.
	 */
	next(): number {
		if (this.eof()) {
			return NaN;
		}

		const code = this.document.getText().charCodeAt(this.pos);
		this.pos++;

		if (this.eof()) {
			// restrict pos to eof, if in case it got moved beyond eof
			this.pos = this._eof;
		}

		return code;
	}

	/**
	 * Backs up the stream n characters. Backing it up further than the
	 * start of the current token will cause things to break, so be careful.
	 */
	backUp(n: number): number {
		this.pos -= n;
		if (this.pos < 0) {
			this.pos = 0;
		}
		return this.peek();
	}

	/**
	 * Get the string between the start of the current token and the
	 * current stream position.
	 */
	current(): string {
		return this.substring(this.start, this.pos);
	}

	/**
	 * Returns contents for given range
	 */
	substring(from: number, to: number): string {
		return this.document.getText().substring(from, to);
	}

	/**
	 * Creates error object with current stream state
	 */
	error(message: string): Error {
		const err = new Error(`${message} at offset ${this.pos}`);
		return err;
	}

	/**
	 * `match` can be a character code or a function that takes a character code
	 * and returns a boolean. If the next character in the stream 'matches'
	 * the given argument, it is consumed and returned.
	 * Otherwise, `false` is returned.
	 */
	eat(match: number | Function): boolean {
		const ch = this.peek();
		const ok = typeof match === 'function' ? match(ch) : ch === match;

		if (ok) {
			this.next();
		}

		return ok;
	}

	/**
	 * Repeatedly calls <code>eat</code> with the given argument, until it
	 * fails. Returns <code>true</code> if any characters were eaten.
	 */
	eatWhile(match: number | Function): boolean {
		const start = this.pos;
		while (!this.eof() && this.eat(match)) { }
		return this.pos !== start;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/defaultCompletionProvider.ts]---
Location: vscode-main/extensions/emmet/src/defaultCompletionProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Node, Stylesheet } from 'EmmetFlatNode';
import { isValidLocationForEmmetAbbreviation, getSyntaxFromArgs } from './abbreviationActions';
import { getEmmetHelper, getMappingForIncludedLanguages, parsePartialStylesheet, getEmmetConfiguration, getEmmetMode, isStyleSheet, getFlatNode, allowedMimeTypesInScriptTag, toLSTextDocument, getHtmlFlatNode, getEmbeddedCssNodeIfAny } from './util';
import { Range as LSRange } from 'vscode-languageserver-textdocument';
import { getRootNode } from './parseDocument';

export class DefaultCompletionItemProvider implements vscode.CompletionItemProvider {

	private lastCompletionType: string | undefined;

	public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, _: vscode.CancellationToken, context: vscode.CompletionContext): Thenable<vscode.CompletionList | undefined> | undefined {
		const completionResult = this.provideCompletionItemsInternal(document, position, context);
		if (!completionResult) {
			this.lastCompletionType = undefined;
			return;
		}

		return completionResult.then(completionList => {
			if (!completionList || !completionList.items.length) {
				this.lastCompletionType = undefined;
				return completionList;
			}
			const item = completionList.items[0];
			const expandedText = item.documentation ? item.documentation.toString() : '';

			if (expandedText.startsWith('<')) {
				this.lastCompletionType = 'html';
			} else if (expandedText.indexOf(':') > 0 && expandedText.endsWith(';')) {
				this.lastCompletionType = 'css';
			} else {
				this.lastCompletionType = undefined;
			}
			return completionList;
		});
	}

	private provideCompletionItemsInternal(document: vscode.TextDocument, position: vscode.Position, context: vscode.CompletionContext): Thenable<vscode.CompletionList | undefined> | undefined {
		const emmetConfig = vscode.workspace.getConfiguration('emmet');
		const excludedLanguages = emmetConfig['excludeLanguages'] ? emmetConfig['excludeLanguages'] : [];
		if (excludedLanguages.includes(document.languageId)) {
			return;
		}

		const mappedLanguages = getMappingForIncludedLanguages();
		const isSyntaxMapped = mappedLanguages[document.languageId] ? true : false;
		const emmetMode = getEmmetMode((isSyntaxMapped ? mappedLanguages[document.languageId] : document.languageId), mappedLanguages, excludedLanguages);

		if (!emmetMode
			|| emmetConfig['showExpandedAbbreviation'] === 'never'
			|| ((isSyntaxMapped || emmetMode === 'jsx') && emmetConfig['showExpandedAbbreviation'] !== 'always')) {
			return;
		}

		let syntax = emmetMode;

		let validateLocation = syntax === 'html' || syntax === 'jsx' || syntax === 'xml';
		let rootNode: Node | undefined;
		let currentNode: Node | undefined;

		const lsDoc = toLSTextDocument(document);
		position = document.validatePosition(position);

		// Don't show completions if there's a comment at the beginning of the line
		const lineRange = new vscode.Range(position.line, 0, position.line, position.character);
		if (document.getText(lineRange).trimStart().startsWith('//')) {
			return;
		}

		const helper = getEmmetHelper();
		if (syntax === 'html') {
			if (context.triggerKind === vscode.CompletionTriggerKind.TriggerForIncompleteCompletions) {
				switch (this.lastCompletionType) {
					case 'html':
						validateLocation = false;
						break;
					case 'css':
						validateLocation = false;
						syntax = 'css';
						break;
					default:
						break;
				}
			}
			if (validateLocation) {
				const positionOffset = document.offsetAt(position);
				const emmetRootNode = getRootNode(document, true);
				const foundNode = getHtmlFlatNode(document.getText(), emmetRootNode, positionOffset, false);
				if (foundNode) {
					if (foundNode.name === 'script') {
						const typeNode = foundNode.attributes.find(attr => attr.name.toString() === 'type');
						if (typeNode) {
							const typeAttrValue = typeNode.value.toString();
							if (typeAttrValue === 'application/javascript' || typeAttrValue === 'text/javascript') {
								if (!getSyntaxFromArgs({ language: 'javascript' })) {
									return;
								} else {
									validateLocation = false;
								}
							}
							else if (allowedMimeTypesInScriptTag.includes(typeAttrValue)) {
								validateLocation = false;
							}
						} else {
							return;
						}
					}
					else if (foundNode.name === 'style') {
						syntax = 'css';
						validateLocation = false;
					} else {
						const styleNode = foundNode.attributes.find(attr => attr.name.toString() === 'style');
						if (styleNode && styleNode.value.start <= positionOffset && positionOffset <= styleNode.value.end) {
							syntax = 'css';
							validateLocation = false;
						}
					}
				}
			}
		}

		const expandOptions = isStyleSheet(syntax) ?
			{ lookAhead: false, syntax: 'stylesheet' } :
			{ lookAhead: true, syntax: 'markup' };
		const extractAbbreviationResults = helper.extractAbbreviation(lsDoc, position, expandOptions);
		if (!extractAbbreviationResults || !helper.isAbbreviationValid(syntax, extractAbbreviationResults.abbreviation)) {
			return;
		}

		const offset = document.offsetAt(position);
		if (isStyleSheet(document.languageId) && context.triggerKind !== vscode.CompletionTriggerKind.TriggerForIncompleteCompletions) {
			validateLocation = true;
			const usePartialParsing = vscode.workspace.getConfiguration('emmet')['optimizeStylesheetParsing'] === true;
			rootNode = usePartialParsing && document.lineCount > 1000 ? parsePartialStylesheet(document, position) : <Stylesheet>getRootNode(document, true);
			if (!rootNode) {
				return;
			}
			currentNode = getFlatNode(rootNode, offset, true);
		}

		// Fix for https://github.com/microsoft/vscode/issues/107578
		// Validate location if syntax is of styleSheet type to ensure that location is valid for emmet abbreviation.
		// For an html document containing a <style> node, compute the embeddedCssNode and fetch the flattened node as currentNode.
		if (!isStyleSheet(document.languageId) && isStyleSheet(syntax) && context.triggerKind !== vscode.CompletionTriggerKind.TriggerForIncompleteCompletions) {
			validateLocation = true;
			rootNode = getRootNode(document, true);
			if (!rootNode) {
				return;
			}
			const flatNode = getFlatNode(rootNode, offset, true);
			const embeddedCssNode = getEmbeddedCssNodeIfAny(document, flatNode, position);
			currentNode = getFlatNode(embeddedCssNode, offset, true);
		}

		if (validateLocation && !isValidLocationForEmmetAbbreviation(document, rootNode, currentNode, syntax, offset, toRange(extractAbbreviationResults.abbreviationRange))) {
			return;
		}

		let isNoisePromise: Thenable<boolean> = Promise.resolve(false);

		// Fix for https://github.com/microsoft/vscode/issues/32647
		// Check for document symbols in js/ts/jsx/tsx and avoid triggering emmet for abbreviations of the form symbolName.sometext
		// Presence of > or * or + in the abbreviation denotes valid abbreviation that should trigger emmet
		if (!isStyleSheet(syntax) && (document.languageId === 'javascript' || document.languageId === 'javascriptreact' || document.languageId === 'typescript' || document.languageId === 'typescriptreact')) {
			const abbreviation: string = extractAbbreviationResults.abbreviation;
			// For the second condition, we don't want abbreviations that have [] characters but not ='s in them to expand
			// In turn, users must explicitly expand abbreviations of the form Component[attr1 attr2], but it means we don't try to expand a[i].
			if (abbreviation.startsWith('this.') || /\[[^\]=]*\]/.test(abbreviation)) {
				isNoisePromise = Promise.resolve(true);
			} else {
				isNoisePromise = vscode.commands.executeCommand<vscode.SymbolInformation[] | undefined>('vscode.executeDocumentSymbolProvider', document.uri).then(symbols => {
					return !!symbols && symbols.some(x => abbreviation === x.name || (abbreviation.startsWith(x.name + '.') && !/>|\*|\+/.test(abbreviation)));
				});
			}
		}

		return isNoisePromise.then((isNoise): vscode.CompletionList | undefined => {
			if (isNoise) {
				return undefined;
			}

			const config = getEmmetConfiguration(syntax!);
			const result = helper.doComplete(toLSTextDocument(document), position, syntax, config);

			const newItems: vscode.CompletionItem[] = [];
			if (result && result.items) {
				result.items.forEach((item: any) => {
					const newItem = new vscode.CompletionItem(item.label);
					newItem.documentation = item.documentation;
					newItem.detail = item.detail;
					newItem.insertText = new vscode.SnippetString(item.textEdit.newText);
					const oldrange = item.textEdit.range;
					newItem.range = new vscode.Range(oldrange.start.line, oldrange.start.character, oldrange.end.line, oldrange.end.character);

					newItem.filterText = item.filterText;
					newItem.sortText = item.sortText;

					if (emmetConfig['showSuggestionsAsSnippets'] === true) {
						newItem.kind = vscode.CompletionItemKind.Snippet;
					}
					newItems.push(newItem);
				});
			}

			return new vscode.CompletionList(newItems, true);
		});
	}
}

function toRange(lsRange: LSRange) {
	return new vscode.Range(lsRange.start.line, lsRange.start.character, lsRange.end.line, lsRange.end.character);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/editPoint.ts]---
Location: vscode-main/extensions/emmet/src/editPoint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { validate } from './util';

export function fetchEditPoint(direction: string): void {
	if (!validate() || !vscode.window.activeTextEditor) {
		return;
	}
	const editor = vscode.window.activeTextEditor;

	const newSelections: vscode.Selection[] = [];
	editor.selections.forEach(selection => {
		const updatedSelection = direction === 'next' ? nextEditPoint(selection, editor) : prevEditPoint(selection, editor);
		newSelections.push(updatedSelection);
	});
	editor.selections = newSelections;
	editor.revealRange(editor.selections[editor.selections.length - 1]);
}

function nextEditPoint(selection: vscode.Selection, editor: vscode.TextEditor): vscode.Selection {
	for (let lineNum = selection.anchor.line; lineNum < editor.document.lineCount; lineNum++) {
		const updatedSelection = findEditPoint(lineNum, editor, selection.anchor, 'next');
		if (updatedSelection) {
			return updatedSelection;
		}
	}
	return selection;
}

function prevEditPoint(selection: vscode.Selection, editor: vscode.TextEditor): vscode.Selection {
	for (let lineNum = selection.anchor.line; lineNum >= 0; lineNum--) {
		const updatedSelection = findEditPoint(lineNum, editor, selection.anchor, 'prev');
		if (updatedSelection) {
			return updatedSelection;
		}
	}
	return selection;
}


function findEditPoint(lineNum: number, editor: vscode.TextEditor, position: vscode.Position, direction: string): vscode.Selection | undefined {
	const line = editor.document.lineAt(lineNum);
	let lineContent = line.text;

	if (lineNum !== position.line && line.isEmptyOrWhitespace && lineContent.length) {
		return new vscode.Selection(lineNum, lineContent.length, lineNum, lineContent.length);
	}

	if (lineNum === position.line && direction === 'prev') {
		lineContent = lineContent.substr(0, position.character);
	}
	const emptyAttrIndex = direction === 'next' ? lineContent.indexOf('""', lineNum === position.line ? position.character : 0) : lineContent.lastIndexOf('""');
	const emptyTagIndex = direction === 'next' ? lineContent.indexOf('><', lineNum === position.line ? position.character : 0) : lineContent.lastIndexOf('><');

	let winner = -1;

	if (emptyAttrIndex > -1 && emptyTagIndex > -1) {
		winner = direction === 'next' ? Math.min(emptyAttrIndex, emptyTagIndex) : Math.max(emptyAttrIndex, emptyTagIndex);
	} else if (emptyAttrIndex > -1) {
		winner = emptyAttrIndex;
	} else {
		winner = emptyTagIndex;
	}

	if (winner > -1) {
		return new vscode.Selection(lineNum, winner + 1, lineNum, winner + 1);
	}
	return;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/emmetCommon.ts]---
Location: vscode-main/extensions/emmet/src/emmetCommon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DefaultCompletionItemProvider } from './defaultCompletionProvider';
import { expandEmmetAbbreviation, wrapWithAbbreviation } from './abbreviationActions';
import { removeTag } from './removeTag';
import { updateTag } from './updateTag';
import { matchTag } from './matchTag';
import { balanceOut, balanceIn } from './balance';
import { splitJoinTag } from './splitJoinTag';
import { mergeLines } from './mergeLines';
import { toggleComment } from './toggleComment';
import { fetchEditPoint } from './editPoint';
import { fetchSelectItem } from './selectItem';
import { evaluateMathExpression } from './evaluateMathExpression';
import { incrementDecrement } from './incrementDecrement';
import { LANGUAGE_MODES, getMappingForIncludedLanguages, updateEmmetExtensionsPath, migrateEmmetExtensionsPath, getPathBaseName, getSyntaxes, getEmmetMode } from './util';
import { reflectCssValue } from './reflectCssValue';
import { addFileToParseCache, clearParseCache, removeFileFromParseCache } from './parseDocument';

export function activateEmmetExtension(context: vscode.ExtensionContext) {
	migrateEmmetExtensionsPath();
	refreshCompletionProviders(context);
	updateEmmetExtensionsPath();

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.wrapWithAbbreviation', (args) => {
		wrapWithAbbreviation(args);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('emmet.expandAbbreviation', (args) => {
		expandEmmetAbbreviation(args);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.removeTag', () => {
		return removeTag();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.updateTag', (inputTag) => {
		if (inputTag && typeof inputTag === 'string') {
			return updateTag(inputTag);
		}
		return updateTag(undefined);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.matchTag', () => {
		matchTag();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.balanceOut', () => {
		balanceOut();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.balanceIn', () => {
		balanceIn();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.splitJoinTag', () => {
		return splitJoinTag();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.mergeLines', () => {
		mergeLines();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.toggleComment', () => {
		toggleComment();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.nextEditPoint', () => {
		fetchEditPoint('next');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.prevEditPoint', () => {
		fetchEditPoint('prev');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.selectNextItem', () => {
		fetchSelectItem('next');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.selectPrevItem', () => {
		fetchSelectItem('prev');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.evaluateMathExpression', () => {
		evaluateMathExpression();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.incrementNumberByOneTenth', () => {
		return incrementDecrement(0.1);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.incrementNumberByOne', () => {
		return incrementDecrement(1);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.incrementNumberByTen', () => {
		return incrementDecrement(10);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.decrementNumberByOneTenth', () => {
		return incrementDecrement(-0.1);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.decrementNumberByOne', () => {
		return incrementDecrement(-1);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.decrementNumberByTen', () => {
		return incrementDecrement(-10);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.reflectCSSValue', () => {
		return reflectCssValue();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('workbench.action.showEmmetCommands', () => {
		vscode.commands.executeCommand('workbench.action.quickOpen', '>Emmet: ');
	}));

	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
		if (e.affectsConfiguration('emmet.includeLanguages') || e.affectsConfiguration('emmet.useInlineCompletions')) {
			refreshCompletionProviders(context);
		}
		if (e.affectsConfiguration('emmet.extensionsPath')) {
			updateEmmetExtensionsPath();
		}
	}));

	context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((e) => {
		const basefileName: string = getPathBaseName(e.fileName);
		if (basefileName.startsWith('snippets') && basefileName.endsWith('.json')) {
			updateEmmetExtensionsPath(true);
		}
	}));

	context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((e) => {
		const emmetMode = getEmmetMode(e.languageId, {}, []) ?? '';
		const syntaxes = getSyntaxes();
		if (syntaxes.markup.includes(emmetMode) || syntaxes.stylesheet.includes(emmetMode)) {
			addFileToParseCache(e);
		}
	}));

	context.subscriptions.push(vscode.workspace.onDidCloseTextDocument((e) => {
		const emmetMode = getEmmetMode(e.languageId, {}, []) ?? '';
		const syntaxes = getSyntaxes();
		if (syntaxes.markup.includes(emmetMode) || syntaxes.stylesheet.includes(emmetMode)) {
			removeFileFromParseCache(e);
		}
	}));
}

/**
 * Holds any registered completion providers by their language strings
 */
const languageMappingForCompletionProviders: Map<string, string> = new Map<string, string>();
const completionProviderDisposables: vscode.Disposable[] = [];

function refreshCompletionProviders(_: vscode.ExtensionContext) {
	clearCompletionProviderInfo();

	const completionProvider = new DefaultCompletionItemProvider();
	const inlineCompletionProvider: vscode.InlineCompletionItemProvider = {
		async provideInlineCompletionItems(document: vscode.TextDocument, position: vscode.Position, _: vscode.InlineCompletionContext, token: vscode.CancellationToken) {
			const items = await completionProvider.provideCompletionItems(document, position, token, { triggerCharacter: undefined, triggerKind: vscode.CompletionTriggerKind.Invoke });
			if (!items) {
				return undefined;
			}
			const item = items.items[0];
			if (!item || !item.insertText) {
				return undefined;
			}
			const range = item.range as vscode.Range;

			if (document.getText(range) !== item.label) {
				// We only want to show an inline completion if we are really sure the user meant emmet.
				// If the user types `d`, we don't want to suggest `<div></div>`.
				return undefined;
			}

			return [
				{
					insertText: item.insertText,
					filterText: item.label,
					range
				}
			];
		}
	};

	const useInlineCompletionProvider = vscode.workspace.getConfiguration('emmet').get<boolean>('useInlineCompletions');
	const includedLanguages = getMappingForIncludedLanguages();
	Object.keys(includedLanguages).forEach(language => {
		if (languageMappingForCompletionProviders.has(language) && languageMappingForCompletionProviders.get(language) === includedLanguages[language]) {
			return;
		}

		if (useInlineCompletionProvider) {
			const inlineCompletionsProvider = vscode.languages.registerInlineCompletionItemProvider({ language, scheme: '*' }, inlineCompletionProvider);
			completionProviderDisposables.push(inlineCompletionsProvider);
		}

		const explicitProvider = vscode.languages.registerCompletionItemProvider({ language, scheme: '*' }, completionProvider, ...LANGUAGE_MODES[includedLanguages[language]]);
		completionProviderDisposables.push(explicitProvider);

		languageMappingForCompletionProviders.set(language, includedLanguages[language]);
	});

	Object.keys(LANGUAGE_MODES).forEach(language => {
		if (!languageMappingForCompletionProviders.has(language)) {
			if (useInlineCompletionProvider) {
				const inlineCompletionsProvider = vscode.languages.registerInlineCompletionItemProvider({ language, scheme: '*' }, inlineCompletionProvider);
				completionProviderDisposables.push(inlineCompletionsProvider);
			}

			const explicitProvider = vscode.languages.registerCompletionItemProvider({ language, scheme: '*' }, completionProvider, ...LANGUAGE_MODES[language]);
			completionProviderDisposables.push(explicitProvider);

			languageMappingForCompletionProviders.set(language, language);
		}
	});
}

function clearCompletionProviderInfo() {
	languageMappingForCompletionProviders.clear();
	let disposable: vscode.Disposable | undefined;
	while (disposable = completionProviderDisposables.pop()) {
		disposable.dispose();
	}
}

export function deactivate() {
	clearCompletionProviderInfo();
	clearParseCache();
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/evaluateMathExpression.ts]---
Location: vscode-main/extensions/emmet/src/evaluateMathExpression.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Based on @sergeche's work in his emmet plugin */

import * as vscode from 'vscode';
import evaluate, { extract } from '@emmetio/math-expression';

export function evaluateMathExpression(): Thenable<boolean> {
	if (!vscode.window.activeTextEditor) {
		vscode.window.showInformationMessage('No editor is active');
		return Promise.resolve(false);
	}
	const editor = vscode.window.activeTextEditor;
	return editor.edit(editBuilder => {
		editor.selections.forEach(selection => {
			// startpos always comes before endpos
			const startpos = selection.isReversed ? selection.active : selection.anchor;
			const endpos = selection.isReversed ? selection.anchor : selection.active;
			const selectionText = editor.document.getText(new vscode.Range(startpos, endpos));

			try {
				if (selectionText) {
					// respect selections
					const result = String(evaluate(selectionText));
					editBuilder.replace(new vscode.Range(startpos, endpos), result);
				} else {
					// no selection made, extract expression from line
					const lineToSelectionEnd = editor.document.getText(new vscode.Range(new vscode.Position(selection.end.line, 0), endpos));
					const extractedIndices = extract(lineToSelectionEnd);
					if (!extractedIndices) {
						throw new Error('Invalid extracted indices');
					}
					const result = String(evaluate(lineToSelectionEnd.substr(extractedIndices[0], extractedIndices[1])));
					const rangeToReplace = new vscode.Range(
						new vscode.Position(selection.end.line, extractedIndices[0]),
						new vscode.Position(selection.end.line, extractedIndices[1])
					);
					editBuilder.replace(rangeToReplace, result);
				}
			} catch (err) {
				vscode.window.showErrorMessage('Could not evaluate expression');
				// Ignore error since most likely it's because of non-math expression
				console.warn('Math evaluation error', err);
			}
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/imageSizeHelper.ts]---
Location: vscode-main/extensions/emmet/src/imageSizeHelper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Based on @sergeche's work on the emmet plugin for atom

import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';
import { imageSize } from 'image-size';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';

const reUrl = /^https?:/;
export type ImageInfoWithScale = {
	realWidth: number;
	realHeight: number;
	width: number;
	height: number;
};

/**
 * Get size of given image file. Supports files from local filesystem,
 * as well as URLs
 */
export function getImageSize(file: string): Promise<ImageInfoWithScale | undefined> {
	file = file.replace(/^file:\/\//, '');
	return reUrl.test(file) ? getImageSizeFromURL(file) : getImageSizeFromFile(file);
}

/**
 * Get image size from file on local file system
 */
function getImageSizeFromFile(file: string): Promise<ImageInfoWithScale | undefined> {
	return new Promise((resolve, reject) => {
		const isDataUrl = file.match(/^data:.+?;base64,/);

		if (isDataUrl) {
			// NB should use sync version of `sizeOf()` for buffers
			try {
				const data = Buffer.from(file.slice(isDataUrl[0].length), 'base64');
				return resolve(sizeForFileName('', imageSize(data)));
			} catch (err) {
				return reject(err);
			}
		}

		imageSize(file, (err: Error | null, size?: ISizeCalculationResult) => {
			if (err) {
				reject(err);
			} else {
				resolve(sizeForFileName(path.basename(file), size));
			}
		});
	});
}

/**
 * Get image size from given remove URL
 */
function getImageSizeFromURL(urlStr: string): Promise<ImageInfoWithScale | undefined> {
	return new Promise((resolve, reject) => {
		const url = new URL(urlStr);
		const getTransport = url.protocol === 'https:' ? https.get : http.get;

		if (!url.pathname) {
			return reject('Given url doesnt have pathname property');
		}
		const urlPath: string = url.pathname;

		getTransport(url, resp => {
			const chunks: Buffer[] = [];
			let bufSize = 0;

			const trySize = (chunks: Buffer[]) => {
				try {
					const size: ISizeCalculationResult = imageSize(Buffer.concat(chunks, bufSize));
					resp.removeListener('data', onData);
					resp.destroy(); // no need to read further
					resolve(sizeForFileName(path.basename(urlPath), size));
				} catch (err) {
					// might not have enough data, skip error
				}
			};

			const onData = (chunk: Buffer) => {
				bufSize += chunk.length;
				chunks.push(chunk);
				trySize(chunks);
			};

			resp
				.on('data', onData)
				.on('end', () => trySize(chunks))
				.once('error', err => {
					resp.removeListener('data', onData);
					reject(err);
				});
		}).once('error', reject);
	});
}

/**
 * Returns size object for given file name. If file name contains `@Nx` token,
 * the final dimentions will be downscaled by N
 */
function sizeForFileName(fileName: string, size?: ISizeCalculationResult): ImageInfoWithScale | undefined {
	const m = fileName.match(/@(\d+)x\./);
	const scale = m ? +m[1] : 1;

	if (!size || !size.width || !size.height) {
		return;
	}

	return {
		realWidth: size.width,
		realHeight: size.height,
		width: Math.floor(size.width / scale),
		height: Math.floor(size.height / scale)
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/incrementDecrement.ts]---
Location: vscode-main/extensions/emmet/src/incrementDecrement.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Based on @sergeche's work in his emmet plugin */

import * as vscode from 'vscode';

const reNumber = /[0-9]/;

/**
 * Incerement number under caret of given editor
 */
export function incrementDecrement(delta: number): Thenable<boolean> | undefined {
	if (!vscode.window.activeTextEditor) {
		vscode.window.showInformationMessage('No editor is active');
		return;
	}
	const editor = vscode.window.activeTextEditor;

	return editor.edit(editBuilder => {
		editor.selections.forEach(selection => {
			const rangeToReplace = locate(editor.document, selection.isReversed ? selection.anchor : selection.active);
			if (!rangeToReplace) {
				return;
			}

			const text = editor.document.getText(rangeToReplace);
			if (isValidNumber(text)) {
				editBuilder.replace(rangeToReplace, update(text, delta));
			}
		});
	});
}

/**
 * Updates given number with `delta` and returns string formatted according
 * to original string format
 */
export function update(numString: string, delta: number): string {
	let m: RegExpMatchArray | null;
	const decimals = (m = numString.match(/\.(\d+)$/)) ? m[1].length : 1;
	let output = String((parseFloat(numString) + delta).toFixed(decimals)).replace(/\.0+$/, '');

	if (m = numString.match(/^\-?(0\d+)/)) {
		// padded number: preserve padding
		output = output.replace(/^(\-?)(\d+)/, (_, minus, prefix) =>
			minus + '0'.repeat(Math.max(0, (m ? m[1].length : 0) - prefix.length)) + prefix);
	}

	if (/^\-?\./.test(numString)) {
		// omit integer part
		output = output.replace(/^(\-?)0+/, '$1');
	}

	return output;
}

/**
 * Locates number from given position in the document
 *
 * @return Range of number or `undefined` if not found
 */
export function locate(document: vscode.TextDocument, pos: vscode.Position): vscode.Range | undefined {

	const line = document.lineAt(pos.line).text;
	let start = pos.character;
	let end = pos.character;
	let hadDot = false, hadMinus = false;
	let ch;

	while (start > 0) {
		ch = line[--start];
		if (ch === '-') {
			hadMinus = true;
			break;
		} else if (ch === '.' && !hadDot) {
			hadDot = true;
		} else if (!reNumber.test(ch)) {
			start++;
			break;
		}
	}

	if (line[end] === '-' && !hadMinus) {
		end++;
	}

	while (end < line.length) {
		ch = line[end++];
		if (ch === '.' && !hadDot && reNumber.test(line[end])) {
			// A dot must be followed by a number. Otherwise stop parsing
			hadDot = true;
		} else if (!reNumber.test(ch)) {
			end--;
			break;
		}
	}

	// ensure that found range contains valid number
	if (start !== end && isValidNumber(line.slice(start, end))) {
		return new vscode.Range(pos.line, start, pos.line, end);
	}

	return;
}

/**
 * Check if given string contains valid number
 */
function isValidNumber(str: string): boolean {
	return str ? !isNaN(parseFloat(str)) : false;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/locateFile.ts]---
Location: vscode-main/extensions/emmet/src/locateFile.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Based on @sergeche's work on the emmet plugin for atom
// TODO: Move to https://github.com/emmetio/file-utils



import * as path from 'path';
import * as fs from 'fs';

const reAbsolutePosix = /^\/+/;
const reAbsoluteWin32 = /^\\+/;
const reAbsolute = path.sep === '/' ? reAbsolutePosix : reAbsoluteWin32;

/**
 * Locates given `filePath` on user's file system and returns absolute path to it.
 * This method expects either URL, or relative/absolute path to resource
 * @param basePath Base path to use if filePath is not absoulte
 * @param filePath File to locate.
 */
export function locateFile(base: string, filePath: string): Promise<string> {
	if (/^\w+:/.test(filePath)) {
		// path with protocol, already absolute
		return Promise.resolve(filePath);
	}

	filePath = path.normalize(filePath);

	return reAbsolute.test(filePath)
		? resolveAbsolute(base, filePath)
		: resolveRelative(base, filePath);
}

/**
 * Resolves relative file path
 */
function resolveRelative(basePath: string, filePath: string): Promise<string> {
	return tryFile(path.resolve(basePath, filePath));
}

/**
 * Resolves absolute file path agaist given editor: tries to find file in every
 * parent of editor's file
 */
function resolveAbsolute(basePath: string, filePath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		filePath = filePath.replace(reAbsolute, '');

		const next = (ctx: string) => {
			tryFile(path.resolve(ctx, filePath))
				.then(resolve, () => {
					const dir = path.dirname(ctx);
					if (!dir || dir === ctx) {
						return reject(`Unable to locate absolute file ${filePath}`);
					}

					next(dir);
				});
		};

		next(basePath);
	});
}

/**
 * Check if given file exists and it's a file, not directory
 */
function tryFile(file: string): Promise<string> {
	return new Promise((resolve, reject) => {
		fs.stat(file, (err, stat) => {
			if (err) {
				return reject(err);
			}

			if (!stat.isFile()) {
				return reject(new Error(`${file} is not a file`));
			}

			resolve(file);
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/matchTag.ts]---
Location: vscode-main/extensions/emmet/src/matchTag.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { validate, getHtmlFlatNode, offsetRangeToSelection } from './util';
import { getRootNode } from './parseDocument';
import { HtmlNode as HtmlFlatNode } from 'EmmetFlatNode';

export function matchTag() {
	if (!validate(false) || !vscode.window.activeTextEditor) {
		return;
	}

	const editor = vscode.window.activeTextEditor;
	const document = editor.document;
	const rootNode = <HtmlFlatNode>getRootNode(document, true);
	if (!rootNode) {
		return;
	}

	const updatedSelections: vscode.Selection[] = [];
	editor.selections.forEach(selection => {
		const updatedSelection = getUpdatedSelections(document, rootNode, selection.start);
		if (updatedSelection) {
			updatedSelections.push(updatedSelection);
		}
	});
	if (updatedSelections.length) {
		editor.selections = updatedSelections;
		editor.revealRange(editor.selections[updatedSelections.length - 1]);
	}
}

function getUpdatedSelections(document: vscode.TextDocument, rootNode: HtmlFlatNode, position: vscode.Position): vscode.Selection | undefined {
	const offset = document.offsetAt(position);
	const currentNode = getHtmlFlatNode(document.getText(), rootNode, offset, true);
	if (!currentNode) {
		return;
	}

	// If no opening/closing tag or cursor is between open and close tag, then no-op
	if (!currentNode.open
		|| !currentNode.close
		|| (offset > currentNode.open.end && offset < currentNode.close.start)) {
		return;
	}

	// Place cursor inside the close tag if cursor is inside the open tag, else place it inside the open tag
	const finalOffset = (offset <= currentNode.open.end) ? currentNode.close.start + 2 : currentNode.start + 1;
	return offsetRangeToSelection(document, finalOffset, finalOffset);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/mergeLines.ts]---
Location: vscode-main/extensions/emmet/src/mergeLines.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Node } from 'EmmetFlatNode';
import { getFlatNode, offsetRangeToVsRange, validate } from './util';
import { getRootNode } from './parseDocument';

export function mergeLines() {
	if (!validate(false) || !vscode.window.activeTextEditor) {
		return;
	}

	const editor = vscode.window.activeTextEditor;

	const rootNode = getRootNode(editor.document, true);
	if (!rootNode) {
		return;
	}

	return editor.edit(editBuilder => {
		Array.from(editor.selections).reverse().forEach(selection => {
			const textEdit = getRangesToReplace(editor.document, selection, rootNode);
			if (textEdit) {
				editBuilder.replace(textEdit.range, textEdit.newText);
			}
		});
	});
}

function getRangesToReplace(document: vscode.TextDocument, selection: vscode.Selection, rootNode: Node): vscode.TextEdit | undefined {
	let startNodeToUpdate: Node | undefined;
	let endNodeToUpdate: Node | undefined;

	const selectionStart = document.offsetAt(selection.start);
	const selectionEnd = document.offsetAt(selection.end);
	if (selection.isEmpty) {
		startNodeToUpdate = endNodeToUpdate = getFlatNode(rootNode, selectionStart, true);
	} else {
		startNodeToUpdate = getFlatNode(rootNode, selectionStart, true);
		endNodeToUpdate = getFlatNode(rootNode, selectionEnd, true);
	}

	if (!startNodeToUpdate || !endNodeToUpdate) {
		return;
	}

	const startPos = document.positionAt(startNodeToUpdate.start);
	const startLine = startPos.line;
	const startChar = startPos.character;
	const endPos = document.positionAt(endNodeToUpdate.end);
	const endLine = endPos.line;
	if (startLine === endLine) {
		return;
	}

	const rangeToReplace = offsetRangeToVsRange(document, startNodeToUpdate.start, endNodeToUpdate.end);
	let textToReplaceWith = document.lineAt(startLine).text.substr(startChar);
	for (let i = startLine + 1; i <= endLine; i++) {
		textToReplaceWith += document.lineAt(i).text.trim();
	}

	return new vscode.TextEdit(rangeToReplace, textToReplaceWith);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/parseDocument.ts]---
Location: vscode-main/extensions/emmet/src/parseDocument.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TextDocument } from 'vscode';
import { Node as FlatNode } from 'EmmetFlatNode';
import parse from '@emmetio/html-matcher';
import parseStylesheet from '@emmetio/css-parser';
import { isStyleSheet } from './util';

type Pair<K, V> = {
	key: K;
	value: V;
};

// Map(filename, Pair(fileVersion, rootNodeOfParsedContent))
const _parseCache = new Map<string, Pair<number, FlatNode> | undefined>();

export function getRootNode(document: TextDocument, useCache: boolean): FlatNode {
	const key = document.uri.toString();
	const result = _parseCache.get(key);
	const documentVersion = document.version;
	if (useCache && result) {
		if (documentVersion === result.key) {
			return result.value;
		}
	}

	const parseContent = isStyleSheet(document.languageId) ? parseStylesheet : parse;
	const rootNode = parseContent(document.getText());
	if (useCache) {
		_parseCache.set(key, { key: documentVersion, value: rootNode });
	}
	return rootNode;
}

export function addFileToParseCache(document: TextDocument) {
	const filename = document.uri.toString();
	_parseCache.set(filename, undefined);
}

export function removeFileFromParseCache(document: TextDocument) {
	const filename = document.uri.toString();
	_parseCache.delete(filename);
}

export function clearParseCache() {
	_parseCache.clear();
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/reflectCssValue.ts]---
Location: vscode-main/extensions/emmet/src/reflectCssValue.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { window, TextEditor } from 'vscode';
import { getCssPropertyFromRule, getCssPropertyFromDocument, offsetRangeToVsRange } from './util';
import { Property, Rule } from 'EmmetFlatNode';

const vendorPrefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''];

export function reflectCssValue(): Thenable<boolean> | undefined {
	const editor = window.activeTextEditor;
	if (!editor) {
		window.showInformationMessage('No editor is active.');
		return;
	}

	const node = getCssPropertyFromDocument(editor, editor.selection.active);
	if (!node) {
		return;
	}

	return updateCSSNode(editor, node);
}

function updateCSSNode(editor: TextEditor, property: Property): Thenable<boolean> {
	const rule: Rule = property.parent;
	let currentPrefix = '';

	// Find vendor prefix of given property node
	for (const prefix of vendorPrefixes) {
		if (property.name.startsWith(prefix)) {
			currentPrefix = prefix;
			break;
		}
	}

	const propertyName = property.name.substr(currentPrefix.length);
	const propertyValue = property.value;

	return editor.edit(builder => {
		// Find properties with vendor prefixes, update each
		vendorPrefixes.forEach(prefix => {
			if (prefix === currentPrefix) {
				return;
			}
			const vendorProperty = getCssPropertyFromRule(rule, prefix + propertyName);
			if (vendorProperty) {
				const rangeToReplace = offsetRangeToVsRange(editor.document, vendorProperty.valueToken.start, vendorProperty.valueToken.end);
				builder.replace(rangeToReplace, propertyValue);
			}
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/removeTag.ts]---
Location: vscode-main/extensions/emmet/src/removeTag.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { getRootNode } from './parseDocument';
import { validate, getHtmlFlatNode, offsetRangeToVsRange } from './util';
import { HtmlNode as HtmlFlatNode } from 'EmmetFlatNode';

export function removeTag() {
	if (!validate(false) || !vscode.window.activeTextEditor) {
		return;
	}
	const editor = vscode.window.activeTextEditor;
	const document = editor.document;
	const rootNode = <HtmlFlatNode>getRootNode(document, true);
	if (!rootNode) {
		return;
	}

	const finalRangesToRemove = Array.from(editor.selections).reverse()
		.reduce<vscode.Range[]>((prev, selection) =>
			prev.concat(getRangesToRemove(editor.document, rootNode, selection)), []);

	return editor.edit(editBuilder => {
		finalRangesToRemove.forEach(range => {
			editBuilder.delete(range);
		});
	});
}

/**
 * Calculates the ranges to remove, along with what to replace those ranges with.
 * It finds the node to remove based on the selection's start position
 * and then removes that node, reindenting the content in between.
 */
function getRangesToRemove(document: vscode.TextDocument, rootNode: HtmlFlatNode, selection: vscode.Selection): vscode.Range[] {
	const offset = document.offsetAt(selection.start);
	const nodeToUpdate = getHtmlFlatNode(document.getText(), rootNode, offset, true);
	if (!nodeToUpdate) {
		return [];
	}

	let openTagRange: vscode.Range | undefined;
	if (nodeToUpdate.open) {
		openTagRange = offsetRangeToVsRange(document, nodeToUpdate.open.start, nodeToUpdate.open.end);
	}
	let closeTagRange: vscode.Range | undefined;
	if (nodeToUpdate.close) {
		closeTagRange = offsetRangeToVsRange(document, nodeToUpdate.close.start, nodeToUpdate.close.end);
	}

	if (openTagRange && closeTagRange) {
		const innerCombinedRange = new vscode.Range(
			openTagRange.end.line,
			openTagRange.end.character,
			closeTagRange.start.line,
			closeTagRange.start.character);
		const outerCombinedRange = new vscode.Range(
			openTagRange.start.line,
			openTagRange.start.character,
			closeTagRange.end.line,
			closeTagRange.end.character);
		// Special case: there is only whitespace in between.
		if (document.getText(innerCombinedRange).trim() === '' && nodeToUpdate.name !== 'pre') {
			return [outerCombinedRange];
		}
	}

	const rangesToRemove = [];
	if (openTagRange) {
		rangesToRemove.push(openTagRange);
		if (closeTagRange) {
			const indentAmountToRemove = calculateIndentAmountToRemove(document, openTagRange, closeTagRange);
			let firstInnerNonEmptyLine: number | undefined;
			let lastInnerNonEmptyLine: number | undefined;
			for (let i = openTagRange.start.line + 1; i < closeTagRange.start.line; i++) {
				if (!document.lineAt(i).isEmptyOrWhitespace) {
					rangesToRemove.push(new vscode.Range(i, 0, i, indentAmountToRemove));
					if (firstInnerNonEmptyLine === undefined) {
						// We found the first non-empty inner line.
						firstInnerNonEmptyLine = i;
					}
					lastInnerNonEmptyLine = i;
				}
			}

			// Remove the entire last line + empty lines preceding it
			// if it is just the tag, otherwise remove just the tag.
			if (entireLineIsTag(document, closeTagRange) && lastInnerNonEmptyLine) {
				rangesToRemove.push(new vscode.Range(
					lastInnerNonEmptyLine,
					document.lineAt(lastInnerNonEmptyLine).range.end.character,
					closeTagRange.end.line,
					closeTagRange.end.character));
			} else {
				rangesToRemove.push(closeTagRange);
			}

			// Remove the entire first line + empty lines proceding it
			// if it is just the tag, otherwise keep on removing just the tag.
			if (entireLineIsTag(document, openTagRange) && firstInnerNonEmptyLine) {
				rangesToRemove[1] = new vscode.Range(
					openTagRange.start.line,
					openTagRange.start.character,
					firstInnerNonEmptyLine,
					document.lineAt(firstInnerNonEmptyLine).firstNonWhitespaceCharacterIndex);
				rangesToRemove.shift();
			}
		}
	}
	return rangesToRemove;
}

function entireLineIsTag(document: vscode.TextDocument, range: vscode.Range): boolean {
	if (range.start.line === range.end.line) {
		const lineText = document.lineAt(range.start).text;
		const tagText = document.getText(range);
		if (lineText.trim() === tagText) {
			return true;
		}
	}
	return false;
}

/**
 * Calculates the amount of indent to remove for getRangesToRemove.
 */
function calculateIndentAmountToRemove(document: vscode.TextDocument, openRange: vscode.Range, closeRange: vscode.Range): number {
	const startLine = openRange.start.line;
	const endLine = closeRange.start.line;

	const startLineIndent = document.lineAt(startLine).firstNonWhitespaceCharacterIndex;
	const endLineIndent = document.lineAt(endLine).firstNonWhitespaceCharacterIndex;

	let contentIndent: number | undefined;
	for (let i = startLine + 1; i < endLine; i++) {
		const line = document.lineAt(i);
		if (!line.isEmptyOrWhitespace) {
			const lineIndent = line.firstNonWhitespaceCharacterIndex;
			contentIndent = !contentIndent ? lineIndent : Math.min(contentIndent, lineIndent);
		}
	}

	let indentAmount = 0;
	if (contentIndent) {
		if (contentIndent < startLineIndent || contentIndent < endLineIndent) {
			indentAmount = 0;
		}
		else {
			indentAmount = Math.min(contentIndent - startLineIndent, contentIndent - endLineIndent);
		}
	}
	return indentAmount;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/selectItem.ts]---
Location: vscode-main/extensions/emmet/src/selectItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { validate, isStyleSheet } from './util';
import { nextItemHTML, prevItemHTML } from './selectItemHTML';
import { nextItemStylesheet, prevItemStylesheet } from './selectItemStylesheet';
import { HtmlNode, CssNode } from 'EmmetFlatNode';
import { getRootNode } from './parseDocument';

export function fetchSelectItem(direction: string): void {
	if (!validate() || !vscode.window.activeTextEditor) {
		return;
	}
	const editor = vscode.window.activeTextEditor;
	const document = editor.document;
	const rootNode = getRootNode(document, true);
	if (!rootNode) {
		return;
	}

	const newSelections: vscode.Selection[] = [];
	editor.selections.forEach(selection => {
		const selectionStart = selection.isReversed ? selection.active : selection.anchor;
		const selectionEnd = selection.isReversed ? selection.anchor : selection.active;

		let updatedSelection;
		if (isStyleSheet(editor.document.languageId)) {
			updatedSelection = direction === 'next' ?
				nextItemStylesheet(document, selectionStart, selectionEnd, <CssNode>rootNode) :
				prevItemStylesheet(document, selectionStart, selectionEnd, <CssNode>rootNode);
		} else {
			updatedSelection = direction === 'next' ?
				nextItemHTML(document, selectionStart, selectionEnd, <HtmlNode>rootNode) :
				prevItemHTML(document, selectionStart, selectionEnd, <HtmlNode>rootNode);
		}
		newSelections.push(updatedSelection ? updatedSelection : selection);
	});
	editor.selections = newSelections;
	editor.revealRange(editor.selections[editor.selections.length - 1]);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/selectItemHTML.ts]---
Location: vscode-main/extensions/emmet/src/selectItemHTML.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { getDeepestFlatNode, findNextWord, findPrevWord, getHtmlFlatNode, offsetRangeToSelection } from './util';
import { HtmlNode } from 'EmmetFlatNode';

export function nextItemHTML(document: vscode.TextDocument, selectionStart: vscode.Position, selectionEnd: vscode.Position, rootNode: HtmlNode): vscode.Selection | undefined {
	const selectionEndOffset = document.offsetAt(selectionEnd);
	let currentNode = getHtmlFlatNode(document.getText(), rootNode, selectionEndOffset, false);
	let nextNode: HtmlNode | undefined = undefined;

	if (!currentNode) {
		return;
	}

	if (currentNode.type !== 'comment') {
		// If cursor is in the tag name, select tag
		if (currentNode.open &&
			selectionEndOffset <= currentNode.open.start + currentNode.name.length) {
			return getSelectionFromNode(document, currentNode);
		}

		// If cursor is in the open tag, look for attributes
		if (currentNode.open &&
			selectionEndOffset < currentNode.open.end) {
			const selectionStartOffset = document.offsetAt(selectionStart);
			const attrSelection = getNextAttribute(document, selectionStartOffset, selectionEndOffset, currentNode);
			if (attrSelection) {
				return attrSelection;
			}
		}

		// Get the first child of current node which is right after the cursor and is not a comment
		nextNode = currentNode.firstChild;
		while (nextNode && (selectionEndOffset >= nextNode.end || nextNode.type === 'comment')) {
			nextNode = nextNode.nextSibling;
		}
	}

	// Get next sibling of current node which is not a comment. If none is found try the same on the parent
	while (!nextNode && currentNode) {
		if (currentNode.nextSibling) {
			if (currentNode.nextSibling.type !== 'comment') {
				nextNode = currentNode.nextSibling;
			} else {
				currentNode = currentNode.nextSibling;
			}
		} else {
			currentNode = currentNode.parent;
		}
	}

	return nextNode && getSelectionFromNode(document, nextNode);
}

export function prevItemHTML(document: vscode.TextDocument, selectionStart: vscode.Position, selectionEnd: vscode.Position, rootNode: HtmlNode): vscode.Selection | undefined {
	const selectionStartOffset = document.offsetAt(selectionStart);
	let currentNode = getHtmlFlatNode(document.getText(), rootNode, selectionStartOffset, false);
	let prevNode: HtmlNode | undefined = undefined;

	if (!currentNode) {
		return;
	}

	const selectionEndOffset = document.offsetAt(selectionEnd);
	if (currentNode.open &&
		currentNode.type !== 'comment' &&
		selectionStartOffset - 1 > currentNode.open.start) {
		if (selectionStartOffset < currentNode.open.end || !currentNode.firstChild || selectionEndOffset <= currentNode.firstChild.start) {
			prevNode = currentNode;
		} else {
			// Select the child that appears just before the cursor and is not a comment
			prevNode = currentNode.firstChild;
			let oldOption: HtmlNode | undefined = undefined;
			while (prevNode.nextSibling && selectionStartOffset >= prevNode.nextSibling.end) {
				if (prevNode && prevNode.type !== 'comment') {
					oldOption = prevNode;
				}
				prevNode = prevNode.nextSibling;
			}

			prevNode = <HtmlNode>getDeepestFlatNode((prevNode && prevNode.type !== 'comment') ? prevNode : oldOption);
		}
	}

	// Select previous sibling which is not a comment. If none found, then select parent
	while (!prevNode && currentNode) {
		if (currentNode.previousSibling) {
			if (currentNode.previousSibling.type !== 'comment') {
				prevNode = <HtmlNode>getDeepestFlatNode(currentNode.previousSibling);
			} else {
				currentNode = currentNode.previousSibling;
			}
		} else {
			prevNode = currentNode.parent;
		}

	}

	if (!prevNode) {
		return undefined;
	}

	const attrSelection = getPrevAttribute(document, selectionStartOffset, selectionEndOffset, prevNode);
	return attrSelection ? attrSelection : getSelectionFromNode(document, prevNode);
}

function getSelectionFromNode(document: vscode.TextDocument, node: HtmlNode): vscode.Selection | undefined {
	if (node && node.open) {
		const selectionStart = node.open.start + 1;
		const selectionEnd = selectionStart + node.name.length;
		return offsetRangeToSelection(document, selectionStart, selectionEnd);
	}
	return undefined;
}

function getNextAttribute(document: vscode.TextDocument, selectionStart: number, selectionEnd: number, node: HtmlNode): vscode.Selection | undefined {
	if (!node.attributes || node.attributes.length === 0 || node.type === 'comment') {
		return;
	}

	for (const attr of node.attributes) {
		if (selectionEnd < attr.start) {
			// select full attr
			return offsetRangeToSelection(document, attr.start, attr.end);
		}

		if (!attr.value || attr.value.start === attr.value.end) {
			// No attr value to select
			continue;
		}

		if ((selectionStart === attr.start && selectionEnd === attr.end) ||
			selectionEnd < attr.value.start) {
			// cursor is in attr name,  so select full attr value
			return offsetRangeToSelection(document, attr.value.start, attr.value.end);
		}

		// Fetch the next word in the attr value
		if (!attr.value.toString().includes(' ')) {
			// attr value does not have space, so no next word to find
			continue;
		}

		let pos: number | undefined = undefined;
		if (selectionStart === attr.value.start && selectionEnd === attr.value.end) {
			pos = -1;
		}
		if (pos === undefined && selectionEnd < attr.end) {
			const selectionEndCharacter = document.positionAt(selectionEnd).character;
			const attrValueStartCharacter = document.positionAt(attr.value.start).character;
			pos = selectionEndCharacter - attrValueStartCharacter - 1;
		}

		if (pos !== undefined) {
			const [newSelectionStartOffset, newSelectionEndOffset] = findNextWord(attr.value.toString(), pos);
			if (newSelectionStartOffset === undefined || newSelectionEndOffset === undefined) {
				return;
			}
			if (newSelectionStartOffset >= 0 && newSelectionEndOffset >= 0) {
				const newSelectionStart = attr.value.start + newSelectionStartOffset;
				const newSelectionEnd = attr.value.start + newSelectionEndOffset;
				return offsetRangeToSelection(document, newSelectionStart, newSelectionEnd);
			}
		}

	}

	return;
}

function getPrevAttribute(document: vscode.TextDocument, selectionStart: number, selectionEnd: number, node: HtmlNode): vscode.Selection | undefined {
	if (!node.attributes || node.attributes.length === 0 || node.type === 'comment') {
		return;
	}

	for (let i = node.attributes.length - 1; i >= 0; i--) {
		const attr = node.attributes[i];
		if (selectionStart <= attr.start) {
			continue;
		}

		if (!attr.value || attr.value.start === attr.value.end || selectionStart < attr.value.start) {
			// select full attr
			return offsetRangeToSelection(document, attr.start, attr.end);
		}

		if (selectionStart === attr.value.start) {
			if (selectionEnd >= attr.value.end) {
				// select full attr
				return offsetRangeToSelection(document, attr.start, attr.end);
			}
			// select attr value
			return offsetRangeToSelection(document, attr.value.start, attr.value.end);
		}

		// Fetch the prev word in the attr value
		const selectionStartCharacter = document.positionAt(selectionStart).character;
		const attrValueStartCharacter = document.positionAt(attr.value.start).character;
		const pos = selectionStart > attr.value.end ? attr.value.toString().length :
			selectionStartCharacter - attrValueStartCharacter;
		const [newSelectionStartOffset, newSelectionEndOffset] = findPrevWord(attr.value.toString(), pos);
		if (newSelectionStartOffset === undefined || newSelectionEndOffset === undefined) {
			return;
		}
		if (newSelectionStartOffset >= 0 && newSelectionEndOffset >= 0) {
			const newSelectionStart = attr.value.start + newSelectionStartOffset;
			const newSelectionEnd = attr.value.start + newSelectionEndOffset;
			return offsetRangeToSelection(document, newSelectionStart, newSelectionEnd);
		}
	}

	return;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/selectItemStylesheet.ts]---
Location: vscode-main/extensions/emmet/src/selectItemStylesheet.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { getDeepestFlatNode, findNextWord, findPrevWord, getFlatNode, offsetRangeToSelection } from './util';
import { Node, CssNode, Rule, Property } from 'EmmetFlatNode';

export function nextItemStylesheet(document: vscode.TextDocument, startPosition: vscode.Position, endPosition: vscode.Position, rootNode: Node): vscode.Selection | undefined {
	const startOffset = document.offsetAt(startPosition);
	const endOffset = document.offsetAt(endPosition);
	let currentNode: CssNode | undefined = <CssNode>getFlatNode(rootNode, endOffset, true);
	if (!currentNode) {
		currentNode = <CssNode>rootNode;
	}
	if (!currentNode) {
		return;
	}
	// Full property is selected, so select full property value next
	if (currentNode.type === 'property' &&
		startOffset === currentNode.start &&
		endOffset === currentNode.end) {
		return getSelectionFromProperty(document, currentNode, startOffset, endOffset, true, 'next');
	}

	// Part or whole of propertyValue is selected, so select the next word in the propertyValue
	if (currentNode.type === 'property' &&
		startOffset >= (<Property>currentNode).valueToken.start &&
		endOffset <= (<Property>currentNode).valueToken.end) {
		const singlePropertyValue = getSelectionFromProperty(document, currentNode, startOffset, endOffset, false, 'next');
		if (singlePropertyValue) {
			return singlePropertyValue;
		}
	}

	// Cursor is in the selector or in a property
	if ((currentNode.type === 'rule' && endOffset < (<Rule>currentNode).selectorToken.end)
		|| (currentNode.type === 'property' && endOffset < (<Property>currentNode).valueToken.end)) {
		return getSelectionFromNode(document, currentNode);
	}

	// Get the first child of current node which is right after the cursor
	let nextNode = currentNode.firstChild;
	while (nextNode && endOffset >= nextNode.end) {
		nextNode = nextNode.nextSibling;
	}

	// Get next sibling of current node or the parent
	while (!nextNode && currentNode) {
		nextNode = currentNode.nextSibling;
		currentNode = currentNode.parent;
	}

	return nextNode ? getSelectionFromNode(document, nextNode) : undefined;
}

export function prevItemStylesheet(document: vscode.TextDocument, startPosition: vscode.Position, endPosition: vscode.Position, rootNode: CssNode): vscode.Selection | undefined {
	const startOffset = document.offsetAt(startPosition);
	const endOffset = document.offsetAt(endPosition);
	let currentNode = <CssNode>getFlatNode(rootNode, startOffset, false);
	if (!currentNode) {
		currentNode = rootNode;
	}
	if (!currentNode) {
		return;
	}

	// Full property value is selected, so select the whole property next
	if (currentNode.type === 'property' &&
		startOffset === (<Property>currentNode).valueToken.start &&
		endOffset === (<Property>currentNode).valueToken.end) {
		return getSelectionFromNode(document, currentNode);
	}

	// Part of propertyValue is selected, so select the prev word in the propertyValue
	if (currentNode.type === 'property' &&
		startOffset >= (<Property>currentNode).valueToken.start &&
		endOffset <= (<Property>currentNode).valueToken.end) {
		const singlePropertyValue = getSelectionFromProperty(document, currentNode, startOffset, endOffset, false, 'prev');
		if (singlePropertyValue) {
			return singlePropertyValue;
		}
	}

	if (currentNode.type === 'property' || !currentNode.firstChild ||
		(currentNode.type === 'rule' && startOffset <= currentNode.firstChild.start)) {
		return getSelectionFromNode(document, currentNode);
	}

	// Select the child that appears just before the cursor
	let prevNode: CssNode | undefined = currentNode.firstChild;
	while (prevNode.nextSibling && startOffset >= prevNode.nextSibling.end) {
		prevNode = prevNode.nextSibling;
	}
	prevNode = <CssNode | undefined>getDeepestFlatNode(prevNode);

	return getSelectionFromProperty(document, prevNode, startOffset, endOffset, false, 'prev');
}


function getSelectionFromNode(document: vscode.TextDocument, node: Node | undefined): vscode.Selection | undefined {
	if (!node) {
		return;
	}

	const nodeToSelect = node.type === 'rule' ? (<Rule>node).selectorToken : node;
	return offsetRangeToSelection(document, nodeToSelect.start, nodeToSelect.end);
}


function getSelectionFromProperty(document: vscode.TextDocument, node: Node | undefined, selectionStart: number, selectionEnd: number, selectFullValue: boolean, direction: string): vscode.Selection | undefined {
	if (!node || node.type !== 'property') {
		return;
	}
	const propertyNode = <Property>node;

	const propertyValue = propertyNode.valueToken.stream.substring(propertyNode.valueToken.start, propertyNode.valueToken.end);
	selectFullValue = selectFullValue ||
		(direction === 'prev' && selectionStart === propertyNode.valueToken.start && selectionEnd < propertyNode.valueToken.end);

	if (selectFullValue) {
		return offsetRangeToSelection(document, propertyNode.valueToken.start, propertyNode.valueToken.end);
	}

	let pos: number = -1;
	if (direction === 'prev') {
		if (selectionStart === propertyNode.valueToken.start) {
			return;
		}
		const selectionStartChar = document.positionAt(selectionStart).character;
		const tokenStartChar = document.positionAt(propertyNode.valueToken.start).character;
		pos = selectionStart > propertyNode.valueToken.end ? propertyValue.length :
			selectionStartChar - tokenStartChar;
	} else if (direction === 'next') {
		if (selectionEnd === propertyNode.valueToken.end &&
			(selectionStart > propertyNode.valueToken.start || !propertyValue.includes(' '))) {
			return;
		}
		const selectionEndChar = document.positionAt(selectionEnd).character;
		const tokenStartChar = document.positionAt(propertyNode.valueToken.start).character;
		pos = selectionEnd === propertyNode.valueToken.end ? -1 :
			selectionEndChar - tokenStartChar - 1;
	}


	const [newSelectionStartOffset, newSelectionEndOffset] = direction === 'prev' ? findPrevWord(propertyValue, pos) : findNextWord(propertyValue, pos);
	if (!newSelectionStartOffset && !newSelectionEndOffset) {
		return;
	}

	const tokenStart = document.positionAt(propertyNode.valueToken.start);
	const newSelectionStart = tokenStart.translate(0, newSelectionStartOffset);
	const newSelectionEnd = tokenStart.translate(0, newSelectionEndOffset);

	return new vscode.Selection(newSelectionStart, newSelectionEnd);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/splitJoinTag.ts]---
Location: vscode-main/extensions/emmet/src/splitJoinTag.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { validate, getEmmetMode, getEmmetConfiguration, getHtmlFlatNode, offsetRangeToVsRange } from './util';
import { HtmlNode as HtmlFlatNode } from 'EmmetFlatNode';
import { getRootNode } from './parseDocument';

export function splitJoinTag() {
	if (!validate(false) || !vscode.window.activeTextEditor) {
		return;
	}

	const editor = vscode.window.activeTextEditor;
	const document = editor.document;
	const rootNode = <HtmlFlatNode>getRootNode(editor.document, true);
	if (!rootNode) {
		return;
	}

	return editor.edit(editBuilder => {
		Array.from(editor.selections).reverse().forEach(selection => {
			const documentText = document.getText();
			const offset = document.offsetAt(selection.start);
			const nodeToUpdate = getHtmlFlatNode(documentText, rootNode, offset, true);
			if (nodeToUpdate) {
				const textEdit = getRangesToReplace(document, nodeToUpdate);
				editBuilder.replace(textEdit.range, textEdit.newText);
			}
		});
	});
}

function getRangesToReplace(document: vscode.TextDocument, nodeToUpdate: HtmlFlatNode): vscode.TextEdit {
	let rangeToReplace: vscode.Range;
	let textToReplaceWith: string;

	if (!nodeToUpdate.open || !nodeToUpdate.close) {
		// Split Tag
		const nodeText = document.getText().substring(nodeToUpdate.start, nodeToUpdate.end);
		const m = nodeText.match(/(\s*\/)?>$/);
		const end = nodeToUpdate.end;
		const start = m ? end - m[0].length : end;

		rangeToReplace = offsetRangeToVsRange(document, start, end);
		textToReplaceWith = `></${nodeToUpdate.name}>`;
	} else {
		// Join Tag
		const start = nodeToUpdate.open.end - 1;
		const end = nodeToUpdate.end;
		rangeToReplace = offsetRangeToVsRange(document, start, end);
		textToReplaceWith = '/>';

		const emmetMode = getEmmetMode(document.languageId, {}, []) ?? '';
		const emmetConfig = getEmmetConfiguration(emmetMode);
		if (emmetMode && emmetConfig.syntaxProfiles[emmetMode] &&
			(emmetConfig.syntaxProfiles[emmetMode]['selfClosingStyle'] === 'xhtml' || emmetConfig.syntaxProfiles[emmetMode]['self_closing_tag'] === 'xhtml')) {
			textToReplaceWith = ' ' + textToReplaceWith;
		}
	}

	return new vscode.TextEdit(rangeToReplace, textToReplaceWith);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/toggleComment.ts]---
Location: vscode-main/extensions/emmet/src/toggleComment.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { getNodesInBetween, getFlatNode, getHtmlFlatNode, sameNodes, isStyleSheet, validate, offsetRangeToVsRange, offsetRangeToSelection } from './util';
import { Node, Stylesheet, Rule } from 'EmmetFlatNode';
import parseStylesheet from '@emmetio/css-parser';
import { getRootNode } from './parseDocument';

let startCommentStylesheet: string;
let endCommentStylesheet: string;
let startCommentHTML: string;
let endCommentHTML: string;

export function toggleComment(): Thenable<boolean> | undefined {
	if (!validate() || !vscode.window.activeTextEditor) {
		return;
	}
	setupCommentSpacing();

	const editor = vscode.window.activeTextEditor;
	const rootNode = getRootNode(editor.document, true);
	if (!rootNode) {
		return;
	}

	return editor.edit(editBuilder => {
		const allEdits: vscode.TextEdit[][] = [];
		Array.from(editor.selections).reverse().forEach(selection => {
			const edits = isStyleSheet(editor.document.languageId) ? toggleCommentStylesheet(editor.document, selection, <Stylesheet>rootNode) : toggleCommentHTML(editor.document, selection, rootNode!);
			if (edits.length > 0) {
				allEdits.push(edits);
			}
		});

		// Apply edits in order so we can skip nested ones.
		allEdits.sort((arr1, arr2) => {
			const result = arr1[0].range.start.line - arr2[0].range.start.line;
			return result === 0 ? arr1[0].range.start.character - arr2[0].range.start.character : result;
		});
		let lastEditPosition = new vscode.Position(0, 0);
		for (const edits of allEdits) {
			if (edits[0].range.end.isAfterOrEqual(lastEditPosition)) {
				edits.forEach(x => {
					editBuilder.replace(x.range, x.newText);
					lastEditPosition = x.range.end;
				});
			}
		}
	});
}

function toggleCommentHTML(document: vscode.TextDocument, selection: vscode.Selection, rootNode: Node): vscode.TextEdit[] {
	const selectionStart = selection.isReversed ? selection.active : selection.anchor;
	const selectionEnd = selection.isReversed ? selection.anchor : selection.active;
	const selectionStartOffset = document.offsetAt(selectionStart);
	const selectionEndOffset = document.offsetAt(selectionEnd);
	const documentText = document.getText();

	const startNode = getHtmlFlatNode(documentText, rootNode, selectionStartOffset, true);
	const endNode = getHtmlFlatNode(documentText, rootNode, selectionEndOffset, true);

	if (!startNode || !endNode) {
		return [];
	}

	if (sameNodes(startNode, endNode) && startNode.name === 'style'
		&& startNode.open && startNode.close
		&& startNode.open.end < selectionStartOffset
		&& startNode.close.start > selectionEndOffset) {
		const buffer = ' '.repeat(startNode.open.end) +
			documentText.substring(startNode.open.end, startNode.close.start);
		const cssRootNode = parseStylesheet(buffer);
		return toggleCommentStylesheet(document, selection, cssRootNode);
	}

	const allNodes: Node[] = getNodesInBetween(startNode, endNode);
	let edits: vscode.TextEdit[] = [];

	allNodes.forEach(node => {
		edits = edits.concat(getRangesToUnCommentHTML(node, document));
	});

	if (startNode.type === 'comment') {
		return edits;
	}


	edits.push(new vscode.TextEdit(offsetRangeToVsRange(document, allNodes[0].start, allNodes[0].start), startCommentHTML));
	edits.push(new vscode.TextEdit(offsetRangeToVsRange(document, allNodes[allNodes.length - 1].end, allNodes[allNodes.length - 1].end), endCommentHTML));

	return edits;
}

function getRangesToUnCommentHTML(node: Node, document: vscode.TextDocument): vscode.TextEdit[] {
	let unCommentTextEdits: vscode.TextEdit[] = [];

	// If current node is commented, then uncomment and return
	if (node.type === 'comment') {
		unCommentTextEdits.push(new vscode.TextEdit(offsetRangeToVsRange(document, node.start, node.start + startCommentHTML.length), ''));
		unCommentTextEdits.push(new vscode.TextEdit(offsetRangeToVsRange(document, node.end - endCommentHTML.length, node.end), ''));
		return unCommentTextEdits;
	}

	// All children of current node should be uncommented
	node.children.forEach(childNode => {
		unCommentTextEdits = unCommentTextEdits.concat(getRangesToUnCommentHTML(childNode, document));
	});

	return unCommentTextEdits;
}

function toggleCommentStylesheet(document: vscode.TextDocument, selection: vscode.Selection, rootNode: Stylesheet): vscode.TextEdit[] {
	const selectionStart = selection.isReversed ? selection.active : selection.anchor;
	const selectionEnd = selection.isReversed ? selection.anchor : selection.active;
	let selectionStartOffset = document.offsetAt(selectionStart);
	let selectionEndOffset = document.offsetAt(selectionEnd);

	const startNode = getFlatNode(rootNode, selectionStartOffset, true);
	const endNode = getFlatNode(rootNode, selectionEndOffset, true);

	if (!selection.isEmpty) {
		selectionStartOffset = adjustStartNodeCss(startNode, selectionStartOffset, rootNode);
		selectionEndOffset = adjustEndNodeCss(endNode, selectionEndOffset, rootNode);
		selection = offsetRangeToSelection(document, selectionStartOffset, selectionEndOffset);
	} else if (startNode) {
		selectionStartOffset = startNode.start;
		selectionEndOffset = startNode.end;
		selection = offsetRangeToSelection(document, selectionStartOffset, selectionEndOffset);
	}

	// Uncomment the comments that intersect with the selection.
	const rangesToUnComment: vscode.Range[] = [];
	const edits: vscode.TextEdit[] = [];
	rootNode.comments.forEach(comment => {
		const commentRange = offsetRangeToVsRange(document, comment.start, comment.end);
		if (selection.intersection(commentRange)) {
			rangesToUnComment.push(commentRange);
			edits.push(new vscode.TextEdit(offsetRangeToVsRange(document, comment.start, comment.start + startCommentStylesheet.length), ''));
			edits.push(new vscode.TextEdit(offsetRangeToVsRange(document, comment.end - endCommentStylesheet.length, comment.end), ''));
		}
	});

	if (edits.length > 0) {
		return edits;
	}

	return [
		new vscode.TextEdit(new vscode.Range(selection.start, selection.start), startCommentStylesheet),
		new vscode.TextEdit(new vscode.Range(selection.end, selection.end), endCommentStylesheet)
	];
}

function setupCommentSpacing() {
	const config: boolean | undefined = vscode.workspace.getConfiguration('editor.comments').get('insertSpace');
	if (config) {
		startCommentStylesheet = '/* ';
		endCommentStylesheet = ' */';
		startCommentHTML = '<!-- ';
		endCommentHTML = ' -->';
	} else {
		startCommentStylesheet = '/*';
		endCommentStylesheet = '*/';
		startCommentHTML = '<!--';
		endCommentHTML = '-->';
	}
}

function adjustStartNodeCss(node: Node | undefined, offset: number, rootNode: Stylesheet): number {
	for (const comment of rootNode.comments) {
		if (comment.start <= offset && offset <= comment.end) {
			return offset;
		}
	}

	if (!node) {
		return offset;
	}

	if (node.type === 'property') {
		return node.start;
	}

	const rule = <Rule>node;
	if (offset < rule.contentStartToken.end || !rule.firstChild) {
		return rule.start;
	}

	if (offset < rule.firstChild.start) {
		return offset;
	}

	let newStartNode = rule.firstChild;
	while (newStartNode.nextSibling && offset > newStartNode.end) {
		newStartNode = newStartNode.nextSibling;
	}

	return newStartNode.start;
}

function adjustEndNodeCss(node: Node | undefined, offset: number, rootNode: Stylesheet): number {
	for (const comment of rootNode.comments) {
		if (comment.start <= offset && offset <= comment.end) {
			return offset;
		}
	}

	if (!node) {
		return offset;
	}

	if (node.type === 'property') {
		return node.end;
	}

	const rule = <Rule>node;
	if (offset === rule.contentEndToken.end || !rule.firstChild) {
		return rule.end;
	}

	if (offset > rule.children[rule.children.length - 1].end) {
		return offset;
	}

	let newEndNode = rule.children[rule.children.length - 1];
	while (newEndNode.previousSibling && offset < newEndNode.start) {
		newEndNode = newEndNode.previousSibling;
	}

	return newEndNode.end;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/updateImageSize.ts]---
Location: vscode-main/extensions/emmet/src/updateImageSize.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Based on @sergeche's work on the emmet plugin for atom

import { TextEditor, Position, window, TextEdit } from 'vscode';
import * as path from 'path';
import { getImageSize, ImageInfoWithScale } from './imageSizeHelper';
import { getFlatNode, iterateCSSToken, getCssPropertyFromRule, isStyleSheet, validate, offsetRangeToVsRange } from './util';
import { HtmlNode, CssToken, HtmlToken, Attribute, Property } from 'EmmetFlatNode';
import { locateFile } from './locateFile';
import parseStylesheet from '@emmetio/css-parser';
import { getRootNode } from './parseDocument';

/**
 * Updates size of context image in given editor
 */
export function updateImageSize(): Promise<boolean> | undefined {
	if (!validate() || !window.activeTextEditor) {
		return;
	}
	const editor = window.activeTextEditor;

	const allUpdatesPromise = Array.from(editor.selections).reverse().map(selection => {
		const position = selection.isReversed ? selection.active : selection.anchor;
		if (!isStyleSheet(editor.document.languageId)) {
			return updateImageSizeHTML(editor, position);
		} else {
			return updateImageSizeCSSFile(editor, position);
		}
	});

	return Promise.all(allUpdatesPromise).then((updates) => {
		return editor.edit(builder => {
			updates.forEach(update => {
				update.forEach((textEdit: TextEdit) => {
					builder.replace(textEdit.range, textEdit.newText);
				});
			});
		});
	});
}

/**
 * Updates image size of context tag of HTML model
 */
function updateImageSizeHTML(editor: TextEditor, position: Position): Promise<TextEdit[]> {
	const imageNode = getImageHTMLNode(editor, position);

	const src = imageNode && getImageSrcHTML(imageNode);

	if (!src) {
		return updateImageSizeStyleTag(editor, position);
	}

	return locateFile(path.dirname(editor.document.fileName), src)
		.then(getImageSize)
		.then((size: any) => {
			// since this action is asynchronous, we have to ensure that editor wasn't
			// changed and user didn't moved caret outside <img> node
			const img = getImageHTMLNode(editor, position);
			if (img && getImageSrcHTML(img) === src) {
				return updateHTMLTag(editor, img, size.width, size.height);
			}
			return [];
		})
		.catch(err => { console.warn('Error while updating image size:', err); return []; });
}

function updateImageSizeStyleTag(editor: TextEditor, position: Position): Promise<TextEdit[]> {
	const getPropertyInsiderStyleTag = (editor: TextEditor): Property | null => {
		const document = editor.document;
		const rootNode = getRootNode(document, true);
		const offset = document.offsetAt(position);
		const currentNode = <HtmlNode>getFlatNode(rootNode, offset, true);
		if (currentNode && currentNode.name === 'style'
			&& currentNode.open && currentNode.close
			&& currentNode.open.end < offset
			&& currentNode.close.start > offset) {
			const buffer = ' '.repeat(currentNode.open.end) +
				document.getText().substring(currentNode.open.end, currentNode.close.start);
			const innerRootNode = parseStylesheet(buffer);
			const innerNode = getFlatNode(innerRootNode, offset, true);
			return (innerNode && innerNode.type === 'property') ? <Property>innerNode : null;
		}
		return null;
	};

	return updateImageSizeCSS(editor, position, getPropertyInsiderStyleTag);
}

function updateImageSizeCSSFile(editor: TextEditor, position: Position): Promise<TextEdit[]> {
	return updateImageSizeCSS(editor, position, getImageCSSNode);
}

/**
 * Updates image size of context rule of stylesheet model
 */
function updateImageSizeCSS(editor: TextEditor, position: Position, fetchNode: (editor: TextEditor, position: Position) => Property | null): Promise<TextEdit[]> {
	const node = fetchNode(editor, position);
	const src = node && getImageSrcCSS(editor, node, position);

	if (!src) {
		return Promise.reject(new Error('No valid image source'));
	}

	return locateFile(path.dirname(editor.document.fileName), src)
		.then(getImageSize)
		.then((size: ImageInfoWithScale | undefined): TextEdit[] => {
			// since this action is asynchronous, we have to ensure that editor wasn't
			// changed and user didn't moved caret outside <img> node
			const prop = fetchNode(editor, position);
			if (size && prop && getImageSrcCSS(editor, prop, position) === src) {
				return updateCSSNode(editor, prop, size.width, size.height);
			}
			return [];
		})
		.catch(err => { console.warn('Error while updating image size:', err); return []; });
}

/**
 * Returns <img> node under caret in given editor or `null` if such node cannot
 * be found
 */
function getImageHTMLNode(editor: TextEditor, position: Position): HtmlNode | null {
	const document = editor.document;
	const rootNode = getRootNode(document, true);
	const offset = document.offsetAt(position);
	const node = <HtmlNode>getFlatNode(rootNode, offset, true);

	return node && node.name.toLowerCase() === 'img' ? node : null;
}

/**
 * Returns css property under caret in given editor or `null` if such node cannot
 * be found
 */
function getImageCSSNode(editor: TextEditor, position: Position): Property | null {
	const document = editor.document;
	const rootNode = getRootNode(document, true);
	const offset = document.offsetAt(position);
	const node = getFlatNode(rootNode, offset, true);
	return node && node.type === 'property' ? <Property>node : null;
}

/**
 * Returns image source from given <img> node
 */
function getImageSrcHTML(node: HtmlNode): string | undefined {
	const srcAttr = getAttribute(node, 'src');
	if (!srcAttr) {
		return;
	}

	return (<HtmlToken>srcAttr.value).value;
}

/**
 * Returns image source from given `url()` token
 */
function getImageSrcCSS(editor: TextEditor, node: Property | undefined, position: Position): string | undefined {
	if (!node) {
		return;
	}
	const urlToken = findUrlToken(editor, node, position);
	if (!urlToken) {
		return;
	}

	// A stylesheet token may contain either quoted ('string') or unquoted URL
	let urlValue = urlToken.item(0);
	if (urlValue && urlValue.type === 'string') {
		urlValue = urlValue.item(0);
	}

	return urlValue && urlValue.valueOf();
}

/**
 * Updates size of given HTML node
 */
function updateHTMLTag(editor: TextEditor, node: HtmlNode, width: number, height: number): TextEdit[] {
	const document = editor.document;
	const srcAttr = getAttribute(node, 'src');
	if (!srcAttr) {
		return [];
	}

	const widthAttr = getAttribute(node, 'width');
	const heightAttr = getAttribute(node, 'height');
	const quote = getAttributeQuote(editor, srcAttr);
	const endOfAttributes = node.attributes[node.attributes.length - 1].end;

	const edits: TextEdit[] = [];
	let textToAdd = '';

	if (!widthAttr) {
		textToAdd += ` width=${quote}${width}${quote}`;
	} else {
		edits.push(new TextEdit(offsetRangeToVsRange(document, widthAttr.value.start, widthAttr.value.end), String(width)));
	}
	if (!heightAttr) {
		textToAdd += ` height=${quote}${height}${quote}`;
	} else {
		edits.push(new TextEdit(offsetRangeToVsRange(document, heightAttr.value.start, heightAttr.value.end), String(height)));
	}
	if (textToAdd) {
		edits.push(new TextEdit(offsetRangeToVsRange(document, endOfAttributes, endOfAttributes), textToAdd));
	}

	return edits;
}

/**
 * Updates size of given CSS rule
 */
function updateCSSNode(editor: TextEditor, srcProp: Property, width: number, height: number): TextEdit[] {
	const document = editor.document;
	const rule = srcProp.parent;
	const widthProp = getCssPropertyFromRule(rule, 'width');
	const heightProp = getCssPropertyFromRule(rule, 'height');

	// Detect formatting
	const separator = srcProp.separator || ': ';
	const before = getPropertyDelimitor(editor, srcProp);

	const edits: TextEdit[] = [];
	if (!srcProp.terminatorToken) {
		edits.push(new TextEdit(offsetRangeToVsRange(document, srcProp.end, srcProp.end), ';'));
	}

	let textToAdd = '';
	if (!widthProp) {
		textToAdd += `${before}width${separator}${width}px;`;
	} else {
		edits.push(new TextEdit(offsetRangeToVsRange(document, widthProp.valueToken.start, widthProp.valueToken.end), `${width}px`));
	}
	if (!heightProp) {
		textToAdd += `${before}height${separator}${height}px;`;
	} else {
		edits.push(new TextEdit(offsetRangeToVsRange(document, heightProp.valueToken.start, heightProp.valueToken.end), `${height}px`));
	}
	if (textToAdd) {
		edits.push(new TextEdit(offsetRangeToVsRange(document, srcProp.end, srcProp.end), textToAdd));
	}

	return edits;
}

/**
 * Returns attribute object with `attrName` name from given HTML node
 */
function getAttribute(node: HtmlNode, attrName: string): Attribute | undefined {
	attrName = attrName.toLowerCase();
	return node && node.attributes.find(attr => attr.name.toString().toLowerCase() === attrName);
}

/**
 * Returns quote character, used for value of given attribute. May return empty
 * string if attribute wasn't quoted

 */
function getAttributeQuote(editor: TextEditor, attr: Attribute): string {
	const begin = attr.value ? attr.value.end : attr.end;
	const end = attr.end;
	return begin === end ? '' : editor.document.getText().substring(begin, end);
}

/**
 * Finds 'url' token for given `pos` point in given CSS property `node`
 */
function findUrlToken(editor: TextEditor, node: Property, pos: Position): CssToken | undefined {
	const offset = editor.document.offsetAt(pos);
	if (!('parsedValue' in node) || !Array.isArray(node.parsedValue)) {
		return undefined;
	}

	for (let i = 0, il = node.parsedValue.length, url; i < il; i++) {
		iterateCSSToken(node.parsedValue[i], (token: CssToken) => {
			if (token.type === 'url' && token.start <= offset && token.end >= offset) {
				url = token;
				return false;
			}
			return true;
		});

		if (url) {
			return url;
		}
	}
	return undefined;
}

/**
 * Returns a string that is used to delimit properties in current node's rule
 */
function getPropertyDelimitor(editor: TextEditor, node: Property): string {
	let anchor;
	if (anchor = (node.previousSibling || node.parent.contentStartToken)) {
		return editor.document.getText().substring(anchor.end, node.start);
	} else if (anchor = (node.nextSibling || node.parent.contentEndToken)) {
		return editor.document.getText().substring(node.end, anchor.start);
	}

	return '';
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/updateTag.ts]---
Location: vscode-main/extensions/emmet/src/updateTag.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { getHtmlFlatNode, validate } from './util';
import { HtmlNode as HtmlFlatNode } from 'EmmetFlatNode';
import { getRootNode } from './parseDocument';

interface TagRange {
	name: string;
	range: vscode.Range;
}

export async function updateTag(tagName: string | undefined): Promise<boolean | undefined> {
	if (!validate(false) || !vscode.window.activeTextEditor) {
		return;
	}

	const editor = vscode.window.activeTextEditor;
	const document = editor.document;
	const rootNode = <HtmlFlatNode>getRootNode(document, true);
	if (!rootNode) {
		return;
	}

	const rangesToUpdate = editor.selections
		.reduceRight<TagRange[]>((prev, selection) =>
			prev.concat(getRangesToUpdate(document, selection, rootNode)), []);
	if (!rangesToUpdate.length) {
		return;
	}
	const firstTagName = rangesToUpdate[0].name;
	const tagNamesAreEqual = rangesToUpdate.every(range => range.name === firstTagName);

	if (tagName === undefined) {
		tagName = await vscode.window.showInputBox({
			prompt: 'Enter Tag',
			value: tagNamesAreEqual ? firstTagName : undefined
		});

		// TODO: Accept fragments for JSX and TSX
		if (!tagName) {
			return false;
		}
	}

	return editor.edit(editBuilder => {
		rangesToUpdate.forEach(tagRange => {
			editBuilder.replace(tagRange.range, tagName!);
		});
	});
}

function getRangesFromNode(node: HtmlFlatNode, document: vscode.TextDocument): TagRange[] {
	const ranges: TagRange[] = [];
	if (node.open) {
		const start = document.positionAt(node.open.start);
		ranges.push({
			name: node.name,
			range: new vscode.Range(start.translate(0, 1), start.translate(0, 1).translate(0, node.name.length))
		});
	}
	if (node.close) {
		const endTagStart = document.positionAt(node.close.start);
		const end = document.positionAt(node.close.end);
		ranges.push({
			name: node.name,
			range: new vscode.Range(endTagStart.translate(0, 2), end.translate(0, -1))
		});
	}
	return ranges;
}

function getRangesToUpdate(document: vscode.TextDocument, selection: vscode.Selection, rootNode: HtmlFlatNode): TagRange[] {
	const documentText = document.getText();
	const offset = document.offsetAt(selection.start);
	const nodeToUpdate = getHtmlFlatNode(documentText, rootNode, offset, true);
	if (!nodeToUpdate) {
		return [];
	}
	return getRangesFromNode(nodeToUpdate, document);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/util.ts]---
Location: vscode-main/extensions/emmet/src/util.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import parse from '@emmetio/html-matcher';
import parseStylesheet from '@emmetio/css-parser';
import { Node as FlatNode, HtmlNode as HtmlFlatNode, Property as FlatProperty, Rule as FlatRule, CssToken as FlatCssToken, Stylesheet as FlatStylesheet } from 'EmmetFlatNode';
import { DocumentStreamReader } from './bufferStream';
import * as EmmetHelper from '@vscode/emmet-helper';
import { TextDocument as LSTextDocument } from 'vscode-languageserver-textdocument';
import { getRootNode } from './parseDocument';

let _emmetHelper: typeof EmmetHelper;
let _currentExtensionsPath: string[] | undefined;

let _homeDir: vscode.Uri | undefined;


export function setHomeDir(homeDir: vscode.Uri) {
	_homeDir = homeDir;
}

export function getEmmetHelper() {
	// Lazy load vscode-emmet-helper instead of importing it
	// directly to reduce the start-up time of the extension
	if (!_emmetHelper) {
		_emmetHelper = require('@vscode/emmet-helper');
	}
	return _emmetHelper;
}

/**
 * Update Emmet Helper to use user snippets from the extensionsPath setting
 */
export function updateEmmetExtensionsPath(forceRefresh: boolean = false) {
	const helper = getEmmetHelper();
	let extensionsPath = vscode.workspace.getConfiguration('emmet').get<string[]>('extensionsPath');
	if (!extensionsPath) {
		extensionsPath = [];
	}
	if (forceRefresh || _currentExtensionsPath !== extensionsPath) {
		_currentExtensionsPath = extensionsPath;
		const rootPaths = vscode.workspace.workspaceFolders?.length ? vscode.workspace.workspaceFolders.map(f => f.uri) : undefined;
		const fileSystem = vscode.workspace.fs;
		helper.updateExtensionsPath(extensionsPath, fileSystem, rootPaths, _homeDir).catch(err => {
			if (Array.isArray(extensionsPath) && extensionsPath.length) {
				vscode.window.showErrorMessage(err.message);
			}
		});
	}
}

/**
 * Migrate old configuration(string) for extensionsPath to new type(string[])
 * https://github.com/microsoft/vscode/issues/117517
 */
export function migrateEmmetExtensionsPath() {
	// Get the detail info of emmet.extensionsPath setting
	const config = vscode.workspace.getConfiguration().inspect('emmet.extensionsPath');

	// Update Global setting if the value type is string or the value is null
	if (typeof config?.globalValue === 'string') {
		vscode.workspace.getConfiguration().update('emmet.extensionsPath', [config.globalValue], true);
	} else if (config?.globalValue === null) {
		vscode.workspace.getConfiguration().update('emmet.extensionsPath', [], true);
	}
	// Update Workspace setting if the value type is string or the value is null
	if (typeof config?.workspaceValue === 'string') {
		vscode.workspace.getConfiguration().update('emmet.extensionsPath', [config.workspaceValue], false);
	} else if (config?.workspaceValue === null) {
		vscode.workspace.getConfiguration().update('emmet.extensionsPath', [], false);
	}
	// Update WorkspaceFolder setting if the value type is string or the value is null
	if (typeof config?.workspaceFolderValue === 'string') {
		vscode.workspace.getConfiguration().update('emmet.extensionsPath', [config.workspaceFolderValue]);
	} else if (config?.workspaceFolderValue === null) {
		vscode.workspace.getConfiguration().update('emmet.extensionsPath', []);
	}
}

/**
 * Mapping between languages that support Emmet and completion trigger characters
 */
export const LANGUAGE_MODES: { [id: string]: string[] } = {
	'html': ['!', '.', '}', ':', '*', '$', ']', '/', '>', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	'jade': ['!', '.', '}', ':', '*', '$', ']', '/', '>', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	'slim': ['!', '.', '}', ':', '*', '$', ']', '/', '>', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	'haml': ['!', '.', '}', ':', '*', '$', ']', '/', '>', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	'xml': ['.', '}', '*', '$', ']', '/', '>', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	'xsl': ['!', '.', '}', '*', '$', '/', ']', '>', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	'css': [':', '!', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	'scss': [':', '!', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	'sass': [':', '!', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	'less': [':', '!', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	'stylus': [':', '!', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	'javascriptreact': ['!', '.', '}', '*', '$', ']', '/', '>', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	'typescriptreact': ['!', '.', '}', '*', '$', ']', '/', '>', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
};

export function isStyleSheet(syntax: string): boolean {
	const stylesheetSyntaxes = ['css', 'scss', 'sass', 'less', 'stylus'];
	return stylesheetSyntaxes.includes(syntax);
}

export function validate(allowStylesheet: boolean = true): boolean {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showInformationMessage('No editor is active');
		return false;
	}
	if (!allowStylesheet && isStyleSheet(editor.document.languageId)) {
		return false;
	}
	return true;
}

export function getMappingForIncludedLanguages(): Record<string, string> {
	// Explicitly map languages that have built-in grammar in VS Code to their parent language
	// to get emmet completion support
	// For other languages, users will have to use `emmet.includeLanguages` or
	// language specific extensions can provide emmet completion support
	const MAPPED_MODES: Record<string, string> = {
		'handlebars': 'html',
		'php': 'html'
	};

	const finalMappedModes: Record<string, string> = {};
	const includeLanguagesConfig = vscode.workspace.getConfiguration('emmet').get<Record<string, string>>('includeLanguages');
	const includeLanguages = Object.assign({}, MAPPED_MODES, includeLanguagesConfig ?? {});
	Object.keys(includeLanguages).forEach(syntax => {
		if (typeof includeLanguages[syntax] === 'string' && LANGUAGE_MODES[includeLanguages[syntax]]) {
			finalMappedModes[syntax] = includeLanguages[syntax];
		}
	});
	return finalMappedModes;
}

/**
* Get the corresponding emmet mode for given vscode language mode
* E.g.: jsx for typescriptreact/javascriptreact or pug for jade
* If the language is not supported by emmet or has been excluded via `excludeLanguages` setting,
* then nothing is returned
*
* @param excludedLanguages Array of language ids that user has chosen to exclude for emmet
*/
export function getEmmetMode(language: string, mappedModes: Record<string, string>, excludedLanguages: string[]): string | undefined {
	if (!language || excludedLanguages.includes(language)) {
		return;
	}

	if (language === 'jsx-tags') {
		language = 'javascriptreact';
	}

	if (mappedModes[language]) {
		language = mappedModes[language];
	}

	if (/\b(typescriptreact|javascriptreact|jsx-tags)\b/.test(language)) { // treat tsx like jsx
		language = 'jsx';
	}
	else if (language === 'sass-indented') { // map sass-indented to sass
		language = 'sass';
	}
	else if (language === 'jade' || language === 'pug') {
		language = 'pug';
	}

	const syntaxes = getSyntaxes();
	if (syntaxes.markup.includes(language) || syntaxes.stylesheet.includes(language)) {
		return language;
	}
	return;
}

const closeBrace = 125;
const openBrace = 123;
const slash = 47;
const star = 42;

/**
 * Traverse the given document backward & forward from given position
 * to find a complete ruleset, then parse just that to return a Stylesheet
 * @param document vscode.TextDocument
 * @param position vscode.Position
 */
export function parsePartialStylesheet(document: vscode.TextDocument, position: vscode.Position): FlatStylesheet | undefined {
	const isCSS = document.languageId === 'css';
	const positionOffset = document.offsetAt(position);
	let startOffset = 0;
	let endOffset = document.getText().length;
	const limitCharacter = positionOffset - 5000;
	const limitOffset = limitCharacter > 0 ? limitCharacter : startOffset;
	const stream = new DocumentStreamReader(document, positionOffset);

	function findOpeningCommentBeforePosition(pos: number): number | undefined {
		const text = document.getText().substring(0, pos);
		const offset = text.lastIndexOf('/*');
		if (offset === -1) {
			return;
		}
		return offset;
	}

	function findClosingCommentAfterPosition(pos: number): number | undefined {
		const text = document.getText().substring(pos);
		let offset = text.indexOf('*/');
		if (offset === -1) {
			return;
		}
		offset += 2 + pos;
		return offset;
	}

	function consumeLineCommentBackwards() {
		const posLineNumber = document.positionAt(stream.pos).line;
		if (!isCSS && currentLine !== posLineNumber) {
			currentLine = posLineNumber;
			const startLineComment = document.lineAt(currentLine).text.indexOf('//');
			if (startLineComment > -1) {
				stream.pos = document.offsetAt(new vscode.Position(currentLine, startLineComment));
			}
		}
	}

	function consumeBlockCommentBackwards() {
		if (!stream.sof() && stream.peek() === slash) {
			if (stream.backUp(1) === star) {
				stream.pos = findOpeningCommentBeforePosition(stream.pos) ?? startOffset;
			} else {
				stream.next();
			}
		}
	}

	function consumeCommentForwards() {
		if (stream.eat(slash)) {
			if (stream.eat(slash) && !isCSS) {
				const posLineNumber = document.positionAt(stream.pos).line;
				stream.pos = document.offsetAt(new vscode.Position(posLineNumber + 1, 0));
			} else if (stream.eat(star)) {
				stream.pos = findClosingCommentAfterPosition(stream.pos) ?? endOffset;
			}
		}
	}

	// Go forward until we find a closing brace.
	while (!stream.eof() && !stream.eat(closeBrace)) {
		if (stream.peek() === slash) {
			consumeCommentForwards();
		} else {
			stream.next();
		}
	}

	if (!stream.eof()) {
		endOffset = stream.pos;
	}

	stream.pos = positionOffset;
	let openBracesToFind = 1;
	let currentLine = position.line;
	let exit = false;

	// Go back until we found an opening brace. If we find a closing one, consume its pair and continue.
	while (!exit && openBracesToFind > 0 && !stream.sof()) {
		consumeLineCommentBackwards();

		switch (stream.backUp(1)) {
			case openBrace:
				openBracesToFind--;
				break;
			case closeBrace:
				if (isCSS) {
					stream.next();
					startOffset = stream.pos;
					exit = true;
				} else {
					openBracesToFind++;
				}
				break;
			case slash:
				consumeBlockCommentBackwards();
				break;
			default:
				break;
		}

		if (position.line - document.positionAt(stream.pos).line > 100
			|| stream.pos <= limitOffset) {
			exit = true;
		}
	}

	// We are at an opening brace. We need to include its selector.
	currentLine = document.positionAt(stream.pos).line;
	openBracesToFind = 0;
	let foundSelector = false;
	while (!exit && !stream.sof() && !foundSelector && openBracesToFind >= 0) {
		consumeLineCommentBackwards();

		const ch = stream.backUp(1);
		if (/\s/.test(String.fromCharCode(ch))) {
			continue;
		}

		switch (ch) {
			case slash:
				consumeBlockCommentBackwards();
				break;
			case closeBrace:
				openBracesToFind++;
				break;
			case openBrace:
				openBracesToFind--;
				break;
			default:
				if (!openBracesToFind) {
					foundSelector = true;
				}
				break;
		}

		if (!stream.sof() && foundSelector) {
			startOffset = stream.pos;
		}
	}

	try {
		const buffer = ' '.repeat(startOffset) + document.getText().substring(startOffset, endOffset);
		return parseStylesheet(buffer);
	} catch (e) {
		return;
	}
}

/**
 * Returns node corresponding to given position in the given root node
 */
export function getFlatNode(root: FlatNode | undefined, offset: number, includeNodeBoundary: boolean): FlatNode | undefined {
	if (!root) {
		return;
	}

	function getFlatNodeChild(child: FlatNode | undefined): FlatNode | undefined {
		if (!child) {
			return;
		}
		const nodeStart = child.start;
		const nodeEnd = child.end;
		if ((nodeStart < offset && nodeEnd > offset)
			|| (includeNodeBoundary && nodeStart <= offset && nodeEnd >= offset)) {
			return getFlatNodeChildren(child.children) ?? child;
		}
		else if ('close' in child) {
			// We have an HTML node in this case.
			// In case this node is an invalid unpaired HTML node,
			// we still want to search its children
			const htmlChild = <HtmlFlatNode>child;
			if (htmlChild.open && !htmlChild.close) {
				return getFlatNodeChildren(htmlChild.children);
			}
		}
		return;
	}

	function getFlatNodeChildren(children: FlatNode[]): FlatNode | undefined {
		for (let i = 0; i < children.length; i++) {
			const foundChild = getFlatNodeChild(children[i]);
			if (foundChild) {
				return foundChild;
			}
		}
		return;
	}

	return getFlatNodeChildren(root.children);
}

export const allowedMimeTypesInScriptTag = ['text/html', 'text/plain', 'text/x-template', 'text/template', 'text/ng-template'];

/**
 * Finds the HTML node within an HTML document at a given position
 * If position is inside a script tag of type template, then it will be parsed to find the inner HTML node as well
 */
export function getHtmlFlatNode(documentText: string, root: FlatNode | undefined, offset: number, includeNodeBoundary: boolean): HtmlFlatNode | undefined {
	let currentNode: HtmlFlatNode | undefined = <HtmlFlatNode | undefined>getFlatNode(root, offset, includeNodeBoundary);
	if (!currentNode) { return; }

	// If the currentNode is a script one, first set up its subtree and then find HTML node.
	if (currentNode.name === 'script' && currentNode.children.length === 0) {
		const scriptNodeBody = setupScriptNodeSubtree(documentText, currentNode);
		if (scriptNodeBody) {
			currentNode = getHtmlFlatNode(scriptNodeBody, currentNode, offset, includeNodeBoundary) ?? currentNode;
		}
	}
	else if (currentNode.type === 'cdata') {
		const cdataBody = setupCdataNodeSubtree(documentText, currentNode);
		currentNode = getHtmlFlatNode(cdataBody, currentNode, offset, includeNodeBoundary) ?? currentNode;
	}
	return currentNode;
}

export function setupScriptNodeSubtree(documentText: string, scriptNode: HtmlFlatNode): string {
	const isTemplateScript = scriptNode.name === 'script' &&
		(scriptNode.attributes &&
			scriptNode.attributes.some(x => x.name.toString() === 'type'
				&& allowedMimeTypesInScriptTag.includes(x.value.toString())));
	if (isTemplateScript
		&& scriptNode.open) {
		// blank out the rest of the document and generate the subtree.
		const beforePadding = ' '.repeat(scriptNode.open.end);
		const endToUse = scriptNode.close ? scriptNode.close.start : scriptNode.end;
		const scriptBodyText = beforePadding + documentText.substring(scriptNode.open.end, endToUse);
		const innerRoot: HtmlFlatNode = parse(scriptBodyText);
		innerRoot.children.forEach(child => {
			scriptNode.children.push(child);
			child.parent = scriptNode;
		});
		return scriptBodyText;
	}
	return '';
}

export function setupCdataNodeSubtree(documentText: string, cdataNode: HtmlFlatNode): string {
	// blank out the rest of the document and generate the subtree.
	const cdataStart = '<![CDATA[';
	const cdataEnd = ']]>';
	const startToUse = cdataNode.start + cdataStart.length;
	const endToUse = cdataNode.end - cdataEnd.length;
	const beforePadding = ' '.repeat(startToUse);
	const cdataBody = beforePadding + documentText.substring(startToUse, endToUse);
	const innerRoot: HtmlFlatNode = parse(cdataBody);
	innerRoot.children.forEach(child => {
		cdataNode.children.push(child);
		child.parent = cdataNode;
	});
	return cdataBody;
}

export function isOffsetInsideOpenOrCloseTag(node: FlatNode, offset: number): boolean {
	const htmlNode = node as HtmlFlatNode;
	if ((htmlNode.open && offset > htmlNode.open.start && offset < htmlNode.open.end)
		|| (htmlNode.close && offset > htmlNode.close.start && offset < htmlNode.close.end)) {
		return true;
	}

	return false;
}

export function offsetRangeToSelection(document: vscode.TextDocument, start: number, end: number): vscode.Selection {
	const startPos = document.positionAt(start);
	const endPos = document.positionAt(end);
	return new vscode.Selection(startPos, endPos);
}

export function offsetRangeToVsRange(document: vscode.TextDocument, start: number, end: number): vscode.Range {
	const startPos = document.positionAt(start);
	const endPos = document.positionAt(end);
	return new vscode.Range(startPos, endPos);
}

/**
 * Returns the deepest non comment node under given node
 */
export function getDeepestFlatNode(node: FlatNode | undefined): FlatNode | undefined {
	if (!node || !node.children || node.children.length === 0 || !node.children.find(x => x.type !== 'comment')) {
		return node;
	}
	for (let i = node.children.length - 1; i >= 0; i--) {
		if (node.children[i].type !== 'comment') {
			return getDeepestFlatNode(node.children[i]);
		}
	}
	return undefined;
}

export function findNextWord(propertyValue: string, pos: number): [number | undefined, number | undefined] {

	let foundSpace = pos === -1;
	let foundStart = false;
	let foundEnd = false;

	let newSelectionStart;
	let newSelectionEnd;
	while (pos < propertyValue.length - 1) {
		pos++;
		if (!foundSpace) {
			if (propertyValue[pos] === ' ') {
				foundSpace = true;
			}
			continue;
		}
		if (foundSpace && !foundStart && propertyValue[pos] === ' ') {
			continue;
		}
		if (!foundStart) {
			newSelectionStart = pos;
			foundStart = true;
			continue;
		}
		if (propertyValue[pos] === ' ') {
			newSelectionEnd = pos;
			foundEnd = true;
			break;
		}
	}

	if (foundStart && !foundEnd) {
		newSelectionEnd = propertyValue.length;
	}

	return [newSelectionStart, newSelectionEnd];
}

export function findPrevWord(propertyValue: string, pos: number): [number | undefined, number | undefined] {

	let foundSpace = pos === propertyValue.length;
	let foundStart = false;
	let foundEnd = false;

	let newSelectionStart;
	let newSelectionEnd;
	while (pos > -1) {
		pos--;
		if (!foundSpace) {
			if (propertyValue[pos] === ' ') {
				foundSpace = true;
			}
			continue;
		}
		if (foundSpace && !foundEnd && propertyValue[pos] === ' ') {
			continue;
		}
		if (!foundEnd) {
			newSelectionEnd = pos + 1;
			foundEnd = true;
			continue;
		}
		if (propertyValue[pos] === ' ') {
			newSelectionStart = pos + 1;
			foundStart = true;
			break;
		}
	}

	if (foundEnd && !foundStart) {
		newSelectionStart = 0;
	}

	return [newSelectionStart, newSelectionEnd];
}

export function getNodesInBetween(node1: FlatNode, node2: FlatNode): FlatNode[] {
	// Same node
	if (sameNodes(node1, node2)) {
		return [node1];
	}

	// Not siblings
	if (!sameNodes(node1.parent, node2.parent)) {
		// node2 is ancestor of node1
		if (node2.start < node1.start) {
			return [node2];
		}

		// node1 is ancestor of node2
		if (node2.start < node1.end) {
			return [node1];
		}

		// Get the highest ancestor of node1 that should be commented
		while (node1.parent && node1.parent.end < node2.start) {
			node1 = node1.parent;
		}

		// Get the highest ancestor of node2 that should be commented
		while (node2.parent && node2.parent.start > node1.start) {
			node2 = node2.parent;
		}
	}

	const siblings: FlatNode[] = [];
	let currentNode: FlatNode | undefined = node1;
	const position = node2.end;
	while (currentNode && position > currentNode.start) {
		siblings.push(currentNode);
		currentNode = currentNode.nextSibling;
	}
	return siblings;
}

export function sameNodes(node1: FlatNode | undefined, node2: FlatNode | undefined): boolean {
	// return true if they're both undefined
	if (!node1 && !node2) {
		return true;
	}
	// return false if only one of them is undefined
	if (!node1 || !node2) {
		return false;
	}
	return node1.start === node2.start && node1.end === node2.end;
}

export function getEmmetConfiguration(syntax: string) {
	const emmetConfig = vscode.workspace.getConfiguration('emmet');
	const syntaxProfiles = Object.assign({}, emmetConfig['syntaxProfiles'] || {});
	const preferences = Object.assign({}, emmetConfig['preferences'] || {});
	// jsx, xml and xsl syntaxes need to have self closing tags unless otherwise configured by user
	if (syntax === 'jsx' || syntax === 'xml' || syntax === 'xsl') {
		syntaxProfiles[syntax] = syntaxProfiles[syntax] || {};
		if (typeof syntaxProfiles[syntax] === 'object'
			&& !syntaxProfiles[syntax].hasOwnProperty('self_closing_tag') // Old Emmet format
			&& !syntaxProfiles[syntax].hasOwnProperty('selfClosingStyle') // Emmet 2.0 format
		) {
			syntaxProfiles[syntax] = {
				...syntaxProfiles[syntax],
				selfClosingStyle: syntax === 'jsx' ? 'xhtml' : 'xml'
			};
		}
	}

	return {
		preferences,
		showExpandedAbbreviation: emmetConfig['showExpandedAbbreviation'],
		showAbbreviationSuggestions: emmetConfig['showAbbreviationSuggestions'],
		syntaxProfiles,
		variables: emmetConfig['variables'],
		excludeLanguages: emmetConfig['excludeLanguages'],
		showSuggestionsAsSnippets: emmetConfig['showSuggestionsAsSnippets']
	};
}

/**
 * Itereates by each child, as well as nested child's children, in their order
 * and invokes `fn` for each. If `fn` function returns `false`, iteration stops
 */
export function iterateCSSToken(token: FlatCssToken, fn: (x: any) => any): boolean {
	for (let i = 0, il = token.size; i < il; i++) {
		if (fn(token.item(i)) === false || iterateCSSToken(token.item(i), fn) === false) {
			return false;
		}
	}
	return true;
}

/**
 * Returns `name` CSS property from given `rule`
 */
export function getCssPropertyFromRule(rule: FlatRule, name: string): FlatProperty | undefined {
	return rule.children.find(node => node.type === 'property' && node.name === name) as FlatProperty;
}

/**
 * Returns css property under caret in given editor or `null` if such node cannot
 * be found
 */
export function getCssPropertyFromDocument(editor: vscode.TextEditor, position: vscode.Position): FlatProperty | null {
	const document = editor.document;
	const rootNode = getRootNode(document, true);
	const offset = document.offsetAt(position);
	const node = getFlatNode(rootNode, offset, true);

	if (isStyleSheet(editor.document.languageId)) {
		return node && node.type === 'property' ? <FlatProperty>node : null;
	}

	const htmlNode = <HtmlFlatNode>node;
	if (htmlNode
		&& htmlNode.name === 'style'
		&& htmlNode.open && htmlNode.close
		&& htmlNode.open.end < offset
		&& htmlNode.close.start > offset) {
		const buffer = ' '.repeat(htmlNode.start) +
			document.getText().substring(htmlNode.start, htmlNode.end);
		const innerRootNode = parseStylesheet(buffer);
		const innerNode = getFlatNode(innerRootNode, offset, true);
		return (innerNode && innerNode.type === 'property') ? <FlatProperty>innerNode : null;
	}

	return null;
}


export function getEmbeddedCssNodeIfAny(document: vscode.TextDocument, currentNode: FlatNode | undefined, position: vscode.Position): FlatNode | undefined {
	if (!currentNode) {
		return;
	}
	const currentHtmlNode = <HtmlFlatNode>currentNode;
	if (currentHtmlNode && currentHtmlNode.open && currentHtmlNode.close) {
		const offset = document.offsetAt(position);
		if (currentHtmlNode.open.end < offset && offset <= currentHtmlNode.close.start) {
			if (currentHtmlNode.name === 'style') {
				const buffer = ' '.repeat(currentHtmlNode.open.end) + document.getText().substring(currentHtmlNode.open.end, currentHtmlNode.close.start);
				return parseStylesheet(buffer);
			}
		}
	}
	return;
}

export function isStyleAttribute(currentNode: FlatNode | undefined, offset: number): boolean {
	if (!currentNode) {
		return false;
	}
	const currentHtmlNode = <HtmlFlatNode>currentNode;
	const index = (currentHtmlNode.attributes || []).findIndex(x => x.name.toString() === 'style');
	if (index === -1) {
		return false;
	}
	const styleAttribute = currentHtmlNode.attributes[index];
	return offset >= styleAttribute.value.start && offset <= styleAttribute.value.end;
}

export function isNumber(obj: any): obj is number {
	return typeof obj === 'number';
}

export function toLSTextDocument(doc: vscode.TextDocument): LSTextDocument {
	return LSTextDocument.create(doc.uri.toString(), doc.languageId, doc.version, doc.getText());
}

export function getPathBaseName(path: string): string {
	const pathAfterSlashSplit = path.split('/').pop();
	const pathAfterBackslashSplit = pathAfterSlashSplit ? pathAfterSlashSplit.split('\\').pop() : '';
	return pathAfterBackslashSplit ?? '';
}

export function getSyntaxes() {
	/**
	 * List of all known syntaxes, from emmetio/emmet
	 */
	return {
		markup: ['html', 'xml', 'xsl', 'jsx', 'js', 'pug', 'slim', 'haml'],
		stylesheet: ['css', 'sass', 'scss', 'less', 'sss', 'stylus']
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/browser/emmetBrowserMain.ts]---
Location: vscode-main/extensions/emmet/src/browser/emmetBrowserMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { activateEmmetExtension } from '../emmetCommon';

export function activate(context: vscode.ExtensionContext) {
	activateEmmetExtension(context);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/node/emmetNodeMain.ts]---
Location: vscode-main/extensions/emmet/src/node/emmetNodeMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { homedir } from 'os';

import { activateEmmetExtension } from '../emmetCommon';
import { setHomeDir } from '../util';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.updateImageSize', () => {
		return import('../updateImageSize').then(uis => uis.updateImageSize());
	}));

	setHomeDir(vscode.Uri.file(homedir()));
	activateEmmetExtension(context);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/test/abbreviationAction.test.ts]---
Location: vscode-main/extensions/emmet/src/test/abbreviationAction.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { Selection, workspace, CancellationTokenSource, CompletionTriggerKind, ConfigurationTarget, CompletionContext } from 'vscode';
import { withRandomFileEditor, closeAllEditors } from './testUtils';
import { expandEmmetAbbreviation } from '../abbreviationActions';
import { DefaultCompletionItemProvider } from '../defaultCompletionProvider';

const completionProvider = new DefaultCompletionItemProvider();

const htmlContents = `
<body class="header">
	<ul class="nav main">
		<li class="item1">img</li>
		<li class="item2">hithere</li>
		ul>li
		ul>li*2
		ul>li.item$*2
		ul>li.item$@44*2
		<div i
	</ul>
	<style>
		.boo {
			display: dn; m10
		}
	</style>
	<span></span>
	(ul>li.item$)*2
	(ul>li.item$)*2+span
	(div>dl>(dt+dd)*2)
	<script type="text/html">
		span.hello
	</script>
	<script type="text/javascript">
		span.bye
	</script>
</body>
`;

const invokeCompletionContext: CompletionContext = {
	triggerKind: CompletionTriggerKind.Invoke,
	triggerCharacter: undefined,
};

suite('Tests for Expand Abbreviations (HTML)', () => {
	teardown(closeAllEditors);

	test('Expand snippets (HTML)', () => {
		return testExpandAbbreviation('html', new Selection(3, 23, 3, 23), 'img', '<img src=\"\" alt=\"\">');
	});

	test('Expand snippets in completion list (HTML)', () => {
		return testHtmlCompletionProvider(new Selection(3, 23, 3, 23), 'img', '<img src=\"\" alt=\"\">');
	});

	test('Expand snippets when no parent node (HTML)', () => {
		return withRandomFileEditor('img', 'html', async (editor, _doc) => {
			editor.selection = new Selection(0, 3, 0, 3);
			await expandEmmetAbbreviation(null);
			assert.strictEqual(editor.document.getText(), '<img src=\"\" alt=\"\">');
			return Promise.resolve();
		});
	});

	test('Expand snippets when no parent node in completion list (HTML)', () => {
		return withRandomFileEditor('img', 'html', async (editor, _doc) => {
			editor.selection = new Selection(0, 3, 0, 3);
			const cancelSrc = new CancellationTokenSource();
			const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, invokeCompletionContext);
			if (!completionPromise) {
				assert.strictEqual(!completionPromise, false, `Got unexpected undefined instead of a completion promise`);
				return Promise.resolve();
			}
			const completionList = await completionPromise;
			assert.strictEqual(completionList && completionList.items && completionList.items.length > 0, true);
			if (completionList) {
				assert.strictEqual(completionList.items[0].label, 'img');
				assert.strictEqual(((<string>completionList.items[0].documentation) || '').replace(/\|/g, ''), '<img src=\"\" alt=\"\">');
			}
			return Promise.resolve();
		});
	});

	test('Expand abbreviation (HTML)', () => {
		return testExpandAbbreviation('html', new Selection(5, 25, 5, 25), 'ul>li', '<ul>\n\t\t\t<li></li>\n\t\t</ul>');
	});

	test('Expand abbreviation in completion list (HTML)', () => {
		return testHtmlCompletionProvider(new Selection(5, 25, 5, 25), 'ul>li', '<ul>\n\t<li></li>\n</ul>');
	});

	test('Expand text that is neither an abbreviation nor a snippet to tags (HTML)', () => {
		return testExpandAbbreviation('html', new Selection(4, 20, 4, 27), 'hithere', '<hithere></hithere>');
	});

	test('Do not Expand text that is neither an abbreviation nor a snippet to tags in completion list (HTML)', () => {
		return testHtmlCompletionProvider(new Selection(4, 20, 4, 27), 'hithere', '<hithere></hithere>', true);
	});

	test('Expand abbreviation with repeaters (HTML)', () => {
		return testExpandAbbreviation('html', new Selection(6, 27, 6, 27), 'ul>li*2', '<ul>\n\t\t\t<li></li>\n\t\t\t<li></li>\n\t\t</ul>');
	});

	test('Expand abbreviation with repeaters in completion list (HTML)', () => {
		return testHtmlCompletionProvider(new Selection(6, 27, 6, 27), 'ul>li*2', '<ul>\n\t<li></li>\n\t<li></li>\n</ul>');
	});

	test('Expand abbreviation with numbered repeaters (HTML)', () => {
		return testExpandAbbreviation('html', new Selection(7, 33, 7, 33), 'ul>li.item$*2', '<ul>\n\t\t\t<li class="item1"></li>\n\t\t\t<li class="item2"></li>\n\t\t</ul>');
	});

	test('Expand abbreviation with numbered repeaters in completion list (HTML)', () => {
		return testHtmlCompletionProvider(new Selection(7, 33, 7, 33), 'ul>li.item$*2', '<ul>\n\t<li class="item1"></li>\n\t<li class="item2"></li>\n</ul>');
	});

	test('Expand abbreviation with numbered repeaters with offset (HTML)', () => {
		return testExpandAbbreviation('html', new Selection(8, 36, 8, 36), 'ul>li.item$@44*2', '<ul>\n\t\t\t<li class="item44"></li>\n\t\t\t<li class="item45"></li>\n\t\t</ul>');
	});

	test('Expand abbreviation with numbered repeaters with offset in completion list (HTML)', () => {
		return testHtmlCompletionProvider(new Selection(8, 36, 8, 36), 'ul>li.item$@44*2', '<ul>\n\t<li class="item44"></li>\n\t<li class="item45"></li>\n</ul>');
	});

	test('Expand abbreviation with numbered repeaters in groups (HTML)', () => {
		return testExpandAbbreviation('html', new Selection(17, 16, 17, 16), '(ul>li.item$)*2', '<ul>\n\t\t<li class="item1"></li>\n\t</ul>\n\t<ul>\n\t\t<li class="item2"></li>\n\t</ul>');
	});

	test('Expand abbreviation with numbered repeaters in groups in completion list (HTML)', () => {
		return testHtmlCompletionProvider(new Selection(17, 16, 17, 16), '(ul>li.item$)*2', '<ul>\n\t<li class="item1"></li>\n</ul>\n<ul>\n\t<li class="item2"></li>\n</ul>');
	});

	test('Expand abbreviation with numbered repeaters in groups with sibling in the end (HTML)', () => {
		return testExpandAbbreviation('html', new Selection(18, 21, 18, 21), '(ul>li.item$)*2+span', '<ul>\n\t\t<li class="item1"></li>\n\t</ul>\n\t<ul>\n\t\t<li class="item2"></li>\n\t</ul>\n\t<span></span>');
	});

	test('Expand abbreviation with numbered repeaters in groups with sibling in the end in completion list (HTML)', () => {
		return testHtmlCompletionProvider(new Selection(18, 21, 18, 21), '(ul>li.item$)*2+span', '<ul>\n\t<li class="item1"></li>\n</ul>\n<ul>\n\t<li class="item2"></li>\n</ul>\n<span></span>');
	});

	test('Expand abbreviation with nested groups (HTML)', () => {
		return testExpandAbbreviation('html', new Selection(19, 19, 19, 19), '(div>dl>(dt+dd)*2)', '<div>\n\t\t<dl>\n\t\t\t<dt></dt>\n\t\t\t<dd></dd>\n\t\t\t<dt></dt>\n\t\t\t<dd></dd>\n\t\t</dl>\n\t</div>');
	});

	test('Expand abbreviation with nested groups in completion list (HTML)', () => {
		return testHtmlCompletionProvider(new Selection(19, 19, 19, 19), '(div>dl>(dt+dd)*2)', '<div>\n\t<dl>\n\t\t<dt></dt>\n\t\t<dd></dd>\n\t\t<dt></dt>\n\t\t<dd></dd>\n\t</dl>\n</div>');
	});

	test('Expand tag that is opened, but not closed (HTML)', () => {
		return testExpandAbbreviation('html', new Selection(9, 6, 9, 6), '<div', '<div></div>');
	});

	test('Do not Expand tag that is opened, but not closed in completion list (HTML)', () => {
		return testHtmlCompletionProvider(new Selection(9, 6, 9, 6), '<div', '<div></div>', true);
	});

	test('No expanding text inside open tag (HTML)', () => {
		return withRandomFileEditor(htmlContents, 'html', async (editor, _doc) => {
			editor.selection = new Selection(2, 4, 2, 4);
			await expandEmmetAbbreviation(null);
			assert.strictEqual(editor.document.getText(), htmlContents);
			return Promise.resolve();
		});
	});

	test('No expanding text inside open tag in completion list (HTML)', () => {
		return withRandomFileEditor(htmlContents, 'html', (editor, _doc) => {
			editor.selection = new Selection(2, 4, 2, 4);
			const cancelSrc = new CancellationTokenSource();
			const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, invokeCompletionContext);
			assert.strictEqual(!completionPromise, true, `Got unexpected comapletion promise instead of undefined`);
			return Promise.resolve();
		});
	});

	test('No expanding text inside open tag when there is no closing tag (HTML)', () => {
		return withRandomFileEditor(htmlContents, 'html', async (editor, _doc) => {
			editor.selection = new Selection(9, 8, 9, 8);
			await expandEmmetAbbreviation(null);
			assert.strictEqual(editor.document.getText(), htmlContents);
			return Promise.resolve();
		});
	});

	test('No expanding text inside open tag when there is no closing tag in completion list (HTML)', () => {
		return withRandomFileEditor(htmlContents, 'html', (editor, _doc) => {
			editor.selection = new Selection(9, 8, 9, 8);
			const cancelSrc = new CancellationTokenSource();
			const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, invokeCompletionContext);
			assert.strictEqual(!completionPromise, true, `Got unexpected comapletion promise instead of undefined`);
			return Promise.resolve();
		});
	});

	test('No expanding text inside open tag when there is no closing tag when there is no parent node (HTML)', () => {
		const fileContents = '<img s';
		return withRandomFileEditor(fileContents, 'html', async (editor, _doc) => {
			editor.selection = new Selection(0, 6, 0, 6);
			await expandEmmetAbbreviation(null);
			assert.strictEqual(editor.document.getText(), fileContents);
			return Promise.resolve();
		});
	});

	test('No expanding text in completion list inside open tag when there is no closing tag when there is no parent node (HTML)', () => {
		const fileContents = '<img s';
		return withRandomFileEditor(fileContents, 'html', (editor, _doc) => {
			editor.selection = new Selection(0, 6, 0, 6);
			const cancelSrc = new CancellationTokenSource();
			const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, invokeCompletionContext);
			assert.strictEqual(!completionPromise, true, `Got unexpected comapletion promise instead of undefined`);
			return Promise.resolve();
		});
	});

	test('Expand css when inside style tag (HTML)', () => {
		return withRandomFileEditor(htmlContents, 'html', async (editor, _doc) => {
			editor.selection = new Selection(13, 16, 13, 19);
			const expandPromise = expandEmmetAbbreviation({ language: 'css' });
			if (!expandPromise) {
				return Promise.resolve();
			}
			await expandPromise;
			assert.strictEqual(editor.document.getText(), htmlContents.replace('m10', 'margin: 10px;'));
			return Promise.resolve();
		});
	});

	test('Expand css when inside style tag in completion list (HTML)', () => {
		const abbreviation = 'm10';
		const expandedText = 'margin: 10px;';

		return withRandomFileEditor(htmlContents, 'html', async (editor, _doc) => {
			editor.selection = new Selection(13, 16, 13, 19);
			const cancelSrc = new CancellationTokenSource();
			const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, invokeCompletionContext);
			if (!completionPromise) {
				assert.strictEqual(1, 2, `Problem with expanding m10`);
				return Promise.resolve();
			}

			const completionList = await completionPromise;
			if (!completionList || !completionList.items || !completionList.items.length) {
				assert.strictEqual(1, 2, `Problem with expanding m10`);
				return Promise.resolve();
			}
			const emmetCompletionItem = completionList.items[0];
			assert.strictEqual(emmetCompletionItem.label, expandedText, `Label of completion item doesnt match.`);
			assert.strictEqual(((<string>emmetCompletionItem.documentation) || '').replace(/\|/g, ''), expandedText, `Docs of completion item doesnt match.`);
			assert.strictEqual(emmetCompletionItem.filterText, abbreviation, `FilterText of completion item doesnt match.`);
			return Promise.resolve();
		});
	});

	test('No expanding text inside style tag if position is not for property name (HTML)', () => {
		return withRandomFileEditor(htmlContents, 'html', async (editor, _doc) => {
			editor.selection = new Selection(13, 14, 13, 14);
			await expandEmmetAbbreviation(null);
			assert.strictEqual(editor.document.getText(), htmlContents);
			return Promise.resolve();
		});
	});

	test('Expand css when inside style attribute (HTML)', () => {
		const styleAttributeContent = '<div style="m10" class="hello"></div>';
		return withRandomFileEditor(styleAttributeContent, 'html', async (editor, _doc) => {
			editor.selection = new Selection(0, 15, 0, 15);
			const expandPromise = expandEmmetAbbreviation(null);
			if (!expandPromise) {
				return Promise.resolve();
			}
			await expandPromise;
			assert.strictEqual(editor.document.getText(), styleAttributeContent.replace('m10', 'margin: 10px;'));
			return Promise.resolve();
		});
	});

	test('Expand css when inside style attribute in completion list (HTML)', () => {
		const abbreviation = 'm10';
		const expandedText = 'margin: 10px;';

		return withRandomFileEditor('<div style="m10" class="hello"></div>', 'html', async (editor, _doc) => {
			editor.selection = new Selection(0, 15, 0, 15);
			const cancelSrc = new CancellationTokenSource();
			const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, invokeCompletionContext);
			if (!completionPromise) {
				assert.strictEqual(1, 2, `Problem with expanding m10`);
				return Promise.resolve();
			}

			const completionList = await completionPromise;
			if (!completionList || !completionList.items || !completionList.items.length) {
				assert.strictEqual(1, 2, `Problem with expanding m10`);
				return Promise.resolve();
			}
			const emmetCompletionItem = completionList.items[0];
			assert.strictEqual(emmetCompletionItem.label, expandedText, `Label of completion item doesnt match.`);
			assert.strictEqual(((<string>emmetCompletionItem.documentation) || '').replace(/\|/g, ''), expandedText, `Docs of completion item doesnt match.`);
			assert.strictEqual(emmetCompletionItem.filterText, abbreviation, `FilterText of completion item doesnt match.`);
			return Promise.resolve();
		});
	});

	test('Expand html when inside script tag with html type (HTML)', () => {
		return withRandomFileEditor(htmlContents, 'html', async (editor, _doc) => {
			editor.selection = new Selection(21, 12, 21, 12);
			const expandPromise = expandEmmetAbbreviation(null);
			if (!expandPromise) {
				return Promise.resolve();
			}
			await expandPromise;
			assert.strictEqual(editor.document.getText(), htmlContents.replace('span.hello', '<span class="hello"></span>'));
			return Promise.resolve();
		});
	});

	test('Expand html in completion list when inside script tag with html type (HTML)', () => {
		const abbreviation = 'span.hello';
		const expandedText = '<span class="hello"></span>';

		return withRandomFileEditor(htmlContents, 'html', async (editor, _doc) => {
			editor.selection = new Selection(21, 12, 21, 12);
			const cancelSrc = new CancellationTokenSource();
			const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, invokeCompletionContext);
			if (!completionPromise) {
				assert.strictEqual(1, 2, `Problem with expanding span.hello`);
				return Promise.resolve();
			}

			const completionList = await completionPromise;
			if (!completionList || !completionList.items || !completionList.items.length) {
				assert.strictEqual(1, 2, `Problem with expanding span.hello`);
				return Promise.resolve();
			}
			const emmetCompletionItem = completionList.items[0];
			assert.strictEqual(emmetCompletionItem.label, abbreviation, `Label of completion item doesnt match.`);
			assert.strictEqual(((<string>emmetCompletionItem.documentation) || '').replace(/\|/g, ''), expandedText, `Docs of completion item doesnt match.`);
			return Promise.resolve();
		});
	});

	test('No expanding text inside script tag with javascript type (HTML)', () => {
		return withRandomFileEditor(htmlContents, 'html', async (editor, _doc) => {
			editor.selection = new Selection(24, 12, 24, 12);
			await expandEmmetAbbreviation(null);
			assert.strictEqual(editor.document.getText(), htmlContents);
			return Promise.resolve();
		});
	});

	test('No expanding text in completion list inside script tag with javascript type (HTML)', () => {
		return withRandomFileEditor(htmlContents, 'html', (editor, _doc) => {
			editor.selection = new Selection(24, 12, 24, 12);
			const cancelSrc = new CancellationTokenSource();
			const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, invokeCompletionContext);
			assert.strictEqual(!completionPromise, true, `Got unexpected comapletion promise instead of undefined`);
			return Promise.resolve();
		});
	});

	test('Expand html when inside script tag with javascript type if js is mapped to html (HTML)', async () => {
		const oldConfig = workspace.getConfiguration('emmet').inspect('includeLanguages')?.globalValue;
		await workspace.getConfiguration('emmet').update('includeLanguages', { 'javascript': 'html' }, ConfigurationTarget.Global);
		await withRandomFileEditor(htmlContents, 'html', async (editor, _doc) => {
			editor.selection = new Selection(24, 10, 24, 10);
			const expandPromise = expandEmmetAbbreviation(null);
			if (!expandPromise) {
				return Promise.resolve();
			}
			await expandPromise;
			assert.strictEqual(editor.document.getText(), htmlContents.replace('span.bye', '<span class="bye"></span>'));
		});
		await workspace.getConfiguration('emmet').update('includeLanguages', oldConfig, ConfigurationTarget.Global);
	});

	test('Expand html in completion list when inside script tag with javascript type if js is mapped to html (HTML)', async () => {
		const abbreviation = 'span.bye';
		const expandedText = '<span class="bye"></span>';
		const oldConfig = workspace.getConfiguration('emmet').inspect('includeLanguages')?.globalValue;
		await workspace.getConfiguration('emmet').update('includeLanguages', { 'javascript': 'html' }, ConfigurationTarget.Global);
		await withRandomFileEditor(htmlContents, 'html', async (editor, _doc) => {
			editor.selection = new Selection(24, 10, 24, 10);
			const cancelSrc = new CancellationTokenSource();
			const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, invokeCompletionContext);
			if (!completionPromise) {
				assert.strictEqual(1, 2, `Problem with expanding span.bye`);
				return Promise.resolve();
			}
			const completionList = await completionPromise;
			if (!completionList || !completionList.items || !completionList.items.length) {
				assert.strictEqual(1, 2, `Problem with expanding span.bye`);
				return Promise.resolve();
			}
			const emmetCompletionItem = completionList.items[0];
			assert.strictEqual(emmetCompletionItem.label, abbreviation, `Label of completion item (${emmetCompletionItem.label}) doesnt match.`);
			assert.strictEqual(((<string>emmetCompletionItem.documentation) || '').replace(/\|/g, ''), expandedText, `Docs of completion item doesnt match.`);
			return Promise.resolve();
		});
		await workspace.getConfiguration('emmet').update('includeLanguages', oldConfig, ConfigurationTarget.Global);
	});

	// test('No expanding when html is excluded in the settings', () => {
	// 	return workspace.getConfiguration('emmet').update('excludeLanguages', ['html'], ConfigurationTarget.Global).then(() => {
	// 		return testExpandAbbreviation('html', new Selection(9, 6, 9, 6), '', '', true).then(() => {
	// 			return workspace.getConfiguration('emmet').update('excludeLanguages', oldValueForExcludeLanguages ? oldValueForExcludeLanguages.globalValue : undefined, ConfigurationTarget.Global);
	// 		});
	// 	});
	// });

	test('No expanding when html is excluded in the settings in completion list', async () => {
		const oldConfig = workspace.getConfiguration('emmet').inspect('excludeLanguages')?.globalValue;
		await workspace.getConfiguration('emmet').update('excludeLanguages', ['html'], ConfigurationTarget.Global);
		await testHtmlCompletionProvider(new Selection(9, 6, 9, 6), '', '', true);
		await workspace.getConfiguration('emmet').update('excludeLanguages', oldConfig, ConfigurationTarget.Global);
	});

	// test('No expanding when php (mapped syntax) is excluded in the settings', () => {
	// 	return workspace.getConfiguration('emmet').update('excludeLanguages', ['php'], ConfigurationTarget.Global).then(() => {
	// 		return testExpandAbbreviation('php', new Selection(9, 6, 9, 6), '', '', true).then(() => {
	// 			return workspace.getConfiguration('emmet').update('excludeLanguages', oldValueForExcludeLanguages ? oldValueForExcludeLanguages.globalValue : undefined, ConfigurationTarget.Global);
	// 		});
	// 	});
	// });


});

suite('Tests for jsx, xml and xsl', () => {
	const oldValueForSyntaxProfiles = workspace.getConfiguration('emmet').inspect('syntaxProfiles');
	teardown(closeAllEditors);

	test('Expand abbreviation with className instead of class in jsx', () => {
		return withRandomFileEditor('ul.nav', 'javascriptreact', async (editor, _doc) => {
			editor.selection = new Selection(0, 6, 0, 6);
			await expandEmmetAbbreviation({ language: 'javascriptreact' });
			assert.strictEqual(editor.document.getText(), '<ul className="nav"></ul>');
			return Promise.resolve();
		});
	});

	test('Expand abbreviation with self closing tags for jsx', () => {
		return withRandomFileEditor('img', 'javascriptreact', async (editor, _doc) => {
			editor.selection = new Selection(0, 6, 0, 6);
			await expandEmmetAbbreviation({ language: 'javascriptreact' });
			assert.strictEqual(editor.document.getText(), '<img src="" alt="" />');
			return Promise.resolve();
		});
	});

	test('Expand abbreviation with single quotes for jsx', async () => {
		await workspace.getConfiguration('emmet').update('syntaxProfiles', { jsx: { 'attr_quotes': 'single' } }, ConfigurationTarget.Global);
		return withRandomFileEditor('img', 'javascriptreact', async (editor, _doc) => {
			editor.selection = new Selection(0, 6, 0, 6);
			await expandEmmetAbbreviation({ language: 'javascriptreact' });
			assert.strictEqual(editor.document.getText(), '<img src=\'\' alt=\'\' />');
			return workspace.getConfiguration('emmet').update('syntaxProfiles', oldValueForSyntaxProfiles ? oldValueForSyntaxProfiles.globalValue : undefined, ConfigurationTarget.Global);
		});
	});

	test('Expand abbreviation with self closing tags for xml', () => {
		return withRandomFileEditor('img', 'xml', async (editor, _doc) => {
			editor.selection = new Selection(0, 6, 0, 6);
			await expandEmmetAbbreviation({ language: 'xml' });
			assert.strictEqual(editor.document.getText(), '<img src="" alt=""/>');
			return Promise.resolve();
		});
	});

	test('Expand abbreviation with no self closing tags for html', () => {
		return withRandomFileEditor('img', 'html', async (editor, _doc) => {
			editor.selection = new Selection(0, 6, 0, 6);
			await expandEmmetAbbreviation({ language: 'html' });
			assert.strictEqual(editor.document.getText(), '<img src="" alt="">');
			return Promise.resolve();
		});
	});

	test('Expand abbreviation with condition containing less than sign for jsx', () => {
		return withRandomFileEditor('if (foo < 10) { span.bar', 'javascriptreact', async (editor, _doc) => {
			editor.selection = new Selection(0, 27, 0, 27);
			await expandEmmetAbbreviation({ language: 'javascriptreact' });
			assert.strictEqual(editor.document.getText(), 'if (foo < 10) { <span className="bar"></span>');
			return Promise.resolve();
		});
	});

	test('No expanding text inside open tag in completion list (jsx)', () => {
		return testNoCompletion('jsx', htmlContents, new Selection(2, 4, 2, 4));
	});

	test('No expanding tag that is opened, but not closed in completion list (jsx)', () => {
		return testNoCompletion('jsx', htmlContents, new Selection(9, 6, 9, 6));
	});

	test('No expanding text inside open tag when there is no closing tag in completion list (jsx)', () => {
		return testNoCompletion('jsx', htmlContents, new Selection(9, 8, 9, 8));
	});

	test('No expanding text in completion list inside open tag when there is no closing tag when there is no parent node (jsx)', () => {
		return testNoCompletion('jsx', '<img s', new Selection(0, 6, 0, 6));
	});

});

function testExpandAbbreviation(syntax: string, selection: Selection, abbreviation: string, expandedText: string, shouldFail?: boolean): Thenable<any> {
	return withRandomFileEditor(htmlContents, syntax, async (editor, _doc) => {
		editor.selection = selection;
		const expandPromise = expandEmmetAbbreviation(null);
		if (!expandPromise) {
			if (!shouldFail) {
				assert.strictEqual(1, 2, `Problem with expanding ${abbreviation} to ${expandedText}`);
			}
			return Promise.resolve();
		}
		await expandPromise;
		assert.strictEqual(editor.document.getText(), htmlContents.replace(abbreviation, expandedText));
		return Promise.resolve();
	});
}

function testHtmlCompletionProvider(selection: Selection, abbreviation: string, expandedText: string, shouldFail?: boolean): Thenable<any> {
	return withRandomFileEditor(htmlContents, 'html', async (editor, _doc) => {
		editor.selection = selection;
		const cancelSrc = new CancellationTokenSource();
		const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, invokeCompletionContext);
		if (!completionPromise) {
			if (!shouldFail) {
				assert.strictEqual(1, 2, `Problem with expanding ${abbreviation} to ${expandedText}`);
			}
			return Promise.resolve();
		}

		const completionList = await completionPromise;
		if (!completionList || !completionList.items || !completionList.items.length) {
			if (!shouldFail) {
				assert.strictEqual(1, 2, `Problem with expanding ${abbreviation} to ${expandedText}`);
			}
			return Promise.resolve();
		}
		const emmetCompletionItem = completionList.items[0];
		assert.strictEqual(emmetCompletionItem.label, abbreviation, `Label of completion item doesnt match.`);
		assert.strictEqual(((<string>emmetCompletionItem.documentation) || '').replace(/\|/g, ''), expandedText, `Docs of completion item doesnt match.`);
		return Promise.resolve();
	});
}

function testNoCompletion(syntax: string, fileContents: string, selection: Selection): Thenable<any> {
	return withRandomFileEditor(fileContents, syntax, (editor, _doc) => {
		editor.selection = selection;
		const cancelSrc = new CancellationTokenSource();
		const completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, invokeCompletionContext);
		assert.strictEqual(!completionPromise, true, `Got unexpected comapletion promise instead of undefined`);
		return Promise.resolve();
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/test/completion.test.ts]---
Location: vscode-main/extensions/emmet/src/test/completion.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import { CancellationTokenSource, CompletionTriggerKind, Selection } from 'vscode';
import { DefaultCompletionItemProvider } from '../defaultCompletionProvider';
import { closeAllEditors, withRandomFileEditor } from './testUtils';

const completionProvider = new DefaultCompletionItemProvider();

suite('Tests for completion in CSS embedded in HTML', () => {
	teardown(closeAllEditors);

	test('style attribute & attribute value in html', async () => {
		await testCompletionProvider('html', '<div style="|"', [{ label: 'padding: ;' }]);
		await testCompletionProvider('html', `<div style='|'`, [{ label: 'padding: ;' }]);
		await testCompletionProvider('html', `<div style='p|'`, [{ label: 'padding: ;' }]);
		await testCompletionProvider('html', `<div style='color: #0|'`, [{ label: '#000000' }]);
	});

	// https://github.com/microsoft/vscode/issues/79766
	test('microsoft/vscode#79766, correct region determination', async () => {
		await testCompletionProvider('html', `<div style="color: #000">di|</div>`, [
			{ label: 'div', documentation: `<div>|</div>` }
		]);
	});

	// https://github.com/microsoft/vscode/issues/86941
	test('microsoft/vscode#86941, widows should be completed after width', async () => {
		await testCompletionProvider('css', `.foo { wi| }`, [
			{ label: 'width: ;', documentation: `width: |;` }
		]);
		await testCompletionProvider('css', `.foo { wid| }`, [
			{ label: 'width: ;', documentation: `width: |;` }
		]);
		try {
			await testCompletionProvider('css', `.foo { wi| }`, [
				{ label: 'widows: ;', documentation: `widows: |;` }
			]);
		} catch (e) {
			assert.strictEqual(e.message, `Didn't find completion item with label widows: ;`);
		}
		try {
			await testCompletionProvider('css', `.foo { wid| }`, [
				{ label: 'widows: ;', documentation: `widows: |;` }
			]);
		} catch (e) {
			assert.strictEqual(e.message, `Didn't find completion item with label widows: ;`);
		}
		await testCompletionProvider('css', `.foo { wido| }`, [
			{ label: 'widows: ;', documentation: `widows: |;` }
		]);
	});

	// https://github.com/microsoft/vscode/issues/117020
	test('microsoft/vscode#117020, ! at end of abbreviation should have completion', async () => {
		await testCompletionProvider('css', `.foo { bdbn!| }`, [
			{ label: 'border-bottom: none !important;', documentation: `border-bottom: none !important;` }
		]);
	});

	// https://github.com/microsoft/vscode/issues/138461
	test('microsoft/vscode#138461, JSX array noise', async () => {
		await testCompletionProvider('jsx', 'a[i]', undefined);
		await testCompletionProvider('jsx', 'Component[a b]', undefined);
		await testCompletionProvider('jsx', '[a, b]', undefined);
		await testCompletionProvider('jsx', '[a=b]', [
			{ label: '<div a="b"></div>', documentation: '<div a="b">|</div>' }
		]);
	});

	// https://github.com/microsoft/vscode-emmet-helper/pull/90
	test('microsoft/vscode-emmet-helper#90', async () => {
		await testCompletionProvider('html', 'dialog', [
			{ label: '<dialog></dialog>', documentation: '<dialog>|</dialog>' }
		]);
	});
});

interface TestCompletionItem {
	label: string;

	documentation?: string;
}

function testCompletionProvider(fileExtension: string, contents: string, expectedItems: TestCompletionItem[] | undefined): Thenable<boolean> {
	const cursorPos = contents.indexOf('|');
	const slicedContents = contents.slice(0, cursorPos) + contents.slice(cursorPos + 1);

	return withRandomFileEditor(slicedContents, fileExtension, async (editor, _doc) => {
		const selection = new Selection(editor.document.positionAt(cursorPos), editor.document.positionAt(cursorPos));
		editor.selection = selection;
		const cancelSrc = new CancellationTokenSource();
		const completionPromise = completionProvider.provideCompletionItems(
			editor.document,
			editor.selection.active,
			cancelSrc.token,
			{ triggerKind: CompletionTriggerKind.Invoke, triggerCharacter: undefined }
		);
		if (!completionPromise) {
			return Promise.resolve();
		}

		const completionList = await completionPromise;
		if (!completionList || !completionList.items || !completionList.items.length) {
			if (completionList === undefined) {
				assert.strictEqual(expectedItems, completionList);
			}
			return Promise.resolve();
		}

		assert.strictEqual(expectedItems === undefined, false);
		expectedItems!.forEach(eItem => {
			const matches = completionList.items.filter(i => i.label === eItem.label);
			const match = matches && matches.length > 0 ? matches[0] : undefined;
			assert.ok(match, `Didn't find completion item with label ${eItem.label}`);

			if (match) {
				assert.strictEqual(match.detail, 'Emmet Abbreviation', `Match needs to come from Emmet`);

				if (eItem.documentation) {
					assert.strictEqual(match.documentation, eItem.documentation, `Emmet completion Documentation doesn't match`);
				}
			}
		});

		return Promise.resolve();
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/test/cssAbbreviationAction.test.ts]---
Location: vscode-main/extensions/emmet/src/test/cssAbbreviationAction.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { Selection, CompletionList, CancellationTokenSource, Position, CompletionTriggerKind, CompletionContext } from 'vscode';
import { withRandomFileEditor, closeAllEditors } from './testUtils';
import { expandEmmetAbbreviation } from '../abbreviationActions';
import { DefaultCompletionItemProvider } from '../defaultCompletionProvider';

const completionProvider = new DefaultCompletionItemProvider();
const cssContents = `
.boo {
	margin: 20px 10px;
	pos:f
	background-image: url('tryme.png');
	pos:f
}

.boo .hoo {
	margin: 10px;
	ind
}
`;

const scssContents = `
.boo {
	margin: 10px;
	p10
	.hoo {
		p20
	}
}
@include b(alert) {

	margin: 10px;
	p30

	@include b(alert) {
		p40
	}
}
.foo {
	margin: 10px;
	margin: a
	.hoo {
		color: #000;
	}
}
`;

const invokeCompletionContext: CompletionContext = {
	triggerKind: CompletionTriggerKind.Invoke,
	triggerCharacter: undefined,
};

suite('Tests for Expand Abbreviations (CSS)', () => {
	teardown(closeAllEditors);

	test('Expand abbreviation (CSS)', () => {
		return withRandomFileEditor(cssContents, 'css', (editor, _) => {
			editor.selections = [new Selection(3, 1, 3, 6), new Selection(5, 1, 5, 6)];
			return expandEmmetAbbreviation(null).then(() => {
				assert.strictEqual(editor.document.getText(), cssContents.replace(/pos:f/g, 'position: fixed;'));
				return Promise.resolve();
			});
		});
	});

	test('No emmet when cursor inside comment (CSS)', () => {
		const testContent = `
.foo {
	/*margin: 10px;
	m10
	padding: 10px;*/
	display: auto;
}
`;

		return withRandomFileEditor(testContent, 'css', (editor, _) => {
			editor.selection = new Selection(3, 4, 3, 4);
			return expandEmmetAbbreviation(null).then(() => {
				assert.strictEqual(editor.document.getText(), testContent);
				const cancelSrc = new CancellationTokenSource();
				const completionPromise = completionProvider.provideCompletionItems(editor.document, new Position(2, 10), cancelSrc.token, invokeCompletionContext);
				if (completionPromise) {
					assert.strictEqual(1, 2, `Invalid completion at property value`);
				}
				return Promise.resolve();
			});
		});
	});

	test('No emmet when cursor in selector of a rule (CSS)', () => {
		const testContent = `
.foo {
	margin: 10px;
}

nav#
		`;

		return withRandomFileEditor(testContent, 'css', (editor, _) => {
			editor.selection = new Selection(5, 4, 5, 4);
			return expandEmmetAbbreviation(null).then(() => {
				assert.strictEqual(editor.document.getText(), testContent);
				const cancelSrc = new CancellationTokenSource();
				const completionPromise = completionProvider.provideCompletionItems(editor.document, new Position(2, 10), cancelSrc.token, invokeCompletionContext);
				if (completionPromise) {
					assert.strictEqual(1, 2, `Invalid completion at property value`);
				}
				return Promise.resolve();
			});
		});
	});

	test('Skip when typing property values when there is a property in the next line (CSS)', () => {
		const testContent = `
.foo {
	margin: a
	margin: 10px;
}
		`;

		return withRandomFileEditor(testContent, 'css', (editor, _) => {
			editor.selection = new Selection(2, 10, 2, 10);
			return expandEmmetAbbreviation(null).then(() => {
				assert.strictEqual(editor.document.getText(), testContent);
				const cancelSrc = new CancellationTokenSource();
				const completionPromise = completionProvider.provideCompletionItems(editor.document, new Position(2, 10), cancelSrc.token, invokeCompletionContext);
				if (completionPromise) {
					assert.strictEqual(1, 2, `Invalid completion at property value`);
				}
				return Promise.resolve();
			});
		});
	});

	test('Skip when typing the last property value in single line rules (CSS)', () => {
		const testContent = `.foo {padding: 10px; margin: a}`;

		return withRandomFileEditor(testContent, 'css', (editor, _) => {
			editor.selection = new Selection(0, 30, 0, 30);
			return expandEmmetAbbreviation(null).then(() => {
				assert.strictEqual(editor.document.getText(), testContent);
				const cancelSrc = new CancellationTokenSource();
				const completionPromise = completionProvider.provideCompletionItems(editor.document, new Position(0, 30), cancelSrc.token, invokeCompletionContext);
				if (completionPromise) {
					assert.strictEqual(1, 2, `Invalid completion at property value`);
				}
				return Promise.resolve();
			});
		});
	});

	test('Allow hex color or !important when typing property values when there is a property in the next line (CSS)', () => {
		const testContent = `
.foo {
	margin: #12 !
	margin: 10px;
}
		`;

		return withRandomFileEditor(testContent, 'css', (editor, _) => {
			const cancelSrc = new CancellationTokenSource();
			const completionPromise1 = completionProvider.provideCompletionItems(editor.document, new Position(2, 12), cancelSrc.token, invokeCompletionContext);
			const completionPromise2 = completionProvider.provideCompletionItems(editor.document, new Position(2, 14), cancelSrc.token, invokeCompletionContext);

			if (!completionPromise1 || !completionPromise2) {
				assert.strictEqual(1, 2, `Completion promise wasnt returned`);
				return Promise.resolve();
			}

			const callBack = (completionList: CompletionList, expandedText: string) => {
				if (!completionList.items || !completionList.items.length) {
					assert.strictEqual(1, 2, `Empty Completions`);
					return;
				}
				const emmetCompletionItem = completionList.items[0];
				assert.strictEqual(emmetCompletionItem.label, expandedText, `Label of completion item doesnt match.`);
				assert.strictEqual((<string>emmetCompletionItem.documentation || '').replace(/\|/g, ''), expandedText, `Docs of completion item doesnt match.`);
			};

			return Promise.all([completionPromise1, completionPromise2]).then(([result1, result2]) => {
				assert.ok(result1);
				assert.ok(result2);
				callBack(result1, '#121212');
				callBack(result2, '!important');
				editor.selections = [new Selection(2, 12, 2, 12), new Selection(2, 14, 2, 14)];
				return expandEmmetAbbreviation(null).then(() => {
					assert.strictEqual(editor.document.getText(), testContent.replace('#12', '#121212').replace('!', '!important'));
				});
			});
		});
	});

	test('Skip when typing property values when there is a property in the previous line (CSS)', () => {
		const testContent = `
.foo {
	margin: 10px;
	margin: a
}
		`;

		return withRandomFileEditor(testContent, 'css', (editor, _) => {
			editor.selection = new Selection(3, 10, 3, 10);
			return expandEmmetAbbreviation(null).then(() => {
				assert.strictEqual(editor.document.getText(), testContent);
				const cancelSrc = new CancellationTokenSource();
				const completionPromise = completionProvider.provideCompletionItems(editor.document, new Position(3, 10), cancelSrc.token, invokeCompletionContext);
				if (completionPromise) {
					assert.strictEqual(1, 2, `Invalid completion at property value`);
				}
				return Promise.resolve();
			});
		});
	});

	test('Allow hex color or !important when typing property values when there is a property in the previous line (CSS)', () => {
		const testContent = `
.foo {
	margin: 10px;
	margin: #12 !
}
		`;

		return withRandomFileEditor(testContent, 'css', (editor, _) => {
			const cancelSrc = new CancellationTokenSource();
			const completionPromise1 = completionProvider.provideCompletionItems(editor.document, new Position(3, 12), cancelSrc.token, invokeCompletionContext);
			const completionPromise2 = completionProvider.provideCompletionItems(editor.document, new Position(3, 14), cancelSrc.token, invokeCompletionContext);

			if (!completionPromise1 || !completionPromise2) {
				assert.strictEqual(1, 2, `Completion promise wasnt returned`);
				return Promise.resolve();
			}

			const callBack = (completionList: CompletionList, expandedText: string) => {
				if (!completionList.items || !completionList.items.length) {
					assert.strictEqual(1, 2, `Empty Completions`);
					return;
				}
				const emmetCompletionItem = completionList.items[0];
				assert.strictEqual(emmetCompletionItem.label, expandedText, `Label of completion item doesnt match.`);
				assert.strictEqual((<string>emmetCompletionItem.documentation || '').replace(/\|/g, ''), expandedText, `Docs of completion item doesnt match.`);
			};

			return Promise.all([completionPromise1, completionPromise2]).then(([result1, result2]) => {
				assert.ok(result1);
				assert.ok(result2);
				callBack(result1, '#121212');
				callBack(result2, '!important');
				editor.selections = [new Selection(3, 12, 3, 12), new Selection(3, 14, 3, 14)];
				return expandEmmetAbbreviation(null).then(() => {
					assert.strictEqual(editor.document.getText(), testContent.replace('#12', '#121212').replace('!', '!important'));
				});
			});
		});
	});

	test('Skip when typing property values when it is the only property in the rule (CSS)', () => {
		const testContent = `
.foo {
	margin: a
}
		`;

		return withRandomFileEditor(testContent, 'css', (editor, _) => {
			editor.selection = new Selection(2, 10, 2, 10);
			return expandEmmetAbbreviation(null).then(() => {
				assert.strictEqual(editor.document.getText(), testContent);
				const cancelSrc = new CancellationTokenSource();
				const completionPromise = completionProvider.provideCompletionItems(editor.document, new Position(2, 10), cancelSrc.token, invokeCompletionContext);
				if (completionPromise) {
					assert.strictEqual(1, 2, `Invalid completion at property value`);
				}
				return Promise.resolve();
			});
		});
	});

	test('Allow hex colors or !important when typing property values when it is the only property in the rule (CSS)', () => {
		const testContent = `
.foo {
	margin: #12 !
}
		`;

		return withRandomFileEditor(testContent, 'css', (editor, _) => {
			const cancelSrc = new CancellationTokenSource();
			const completionPromise1 = completionProvider.provideCompletionItems(editor.document, new Position(2, 12), cancelSrc.token, invokeCompletionContext);
			const completionPromise2 = completionProvider.provideCompletionItems(editor.document, new Position(2, 14), cancelSrc.token, invokeCompletionContext);

			if (!completionPromise1 || !completionPromise2) {
				assert.strictEqual(1, 2, `Completion promise wasnt returned`);
				return Promise.resolve();
			}

			const callBack = (completionList: CompletionList, expandedText: string) => {
				if (!completionList.items || !completionList.items.length) {
					assert.strictEqual(1, 2, `Empty Completions`);
					return;
				}
				const emmetCompletionItem = completionList.items[0];
				assert.strictEqual(emmetCompletionItem.label, expandedText, `Label of completion item doesnt match.`);
				assert.strictEqual((<string>emmetCompletionItem.documentation || '').replace(/\|/g, ''), expandedText, `Docs of completion item doesnt match.`);
			};

			return Promise.all([completionPromise1, completionPromise2]).then(([result1, result2]) => {
				assert.ok(result1);
				assert.ok(result2);
				callBack(result1, '#121212');
				callBack(result2, '!important');
				editor.selections = [new Selection(2, 12, 2, 12), new Selection(2, 14, 2, 14)];
				return expandEmmetAbbreviation(null).then(() => {
					assert.strictEqual(editor.document.getText(), testContent.replace('#12', '#121212').replace('!', '!important'));
				});
			});
		});
	});

	test('# shouldnt expand to hex color when in selector (CSS)', () => {
		const testContent = `
.foo {
	#
}
		`;

		return withRandomFileEditor(testContent, 'css', (editor, _) => {
			editor.selection = new Selection(2, 2, 2, 2);
			return expandEmmetAbbreviation(null).then(() => {
				assert.strictEqual(editor.document.getText(), testContent);
				const cancelSrc = new CancellationTokenSource();
				const completionPromise = completionProvider.provideCompletionItems(editor.document, new Position(2, 2), cancelSrc.token, invokeCompletionContext);
				if (completionPromise) {
					assert.strictEqual(1, 2, `Invalid completion of hex color at property name`);
				}
				return Promise.resolve();
			});
		});
	});


	test('Expand abbreviation in completion list (CSS)', () => {
		const abbreviation = 'pos:f';
		const expandedText = 'position: fixed;';

		return withRandomFileEditor(cssContents, 'css', (editor, _) => {
			editor.selection = new Selection(3, 1, 3, 6);
			const cancelSrc = new CancellationTokenSource();
			const completionPromise1 = completionProvider.provideCompletionItems(editor.document, new Position(3, 6), cancelSrc.token, invokeCompletionContext);
			const completionPromise2 = completionProvider.provideCompletionItems(editor.document, new Position(5, 6), cancelSrc.token, invokeCompletionContext);
			if (!completionPromise1 || !completionPromise2) {
				assert.strictEqual(1, 2, `Problem with expanding pos:f`);
				return Promise.resolve();
			}

			const callBack = (completionList: CompletionList) => {
				if (!completionList.items || !completionList.items.length) {
					assert.strictEqual(1, 2, `Problem with expanding pos:f`);
					return;
				}
				const emmetCompletionItem = completionList.items[0];
				assert.strictEqual(emmetCompletionItem.label, expandedText, `Label of completion item doesnt match.`);
				assert.strictEqual((<string>emmetCompletionItem.documentation || '').replace(/\|/g, ''), expandedText, `Docs of completion item doesnt match.`);
				assert.strictEqual(emmetCompletionItem.filterText, abbreviation, `FilterText of completion item doesnt match.`);
			};

			return Promise.all([completionPromise1, completionPromise2]).then(([result1, result2]) => {
				assert.ok(result1);
				assert.ok(result2);
				callBack(result1);
				callBack(result2);
				return Promise.resolve();
			});
		});
	});

	test('Expand abbreviation (SCSS)', () => {
		return withRandomFileEditor(scssContents, 'scss', (editor, _) => {
			editor.selections = [
				new Selection(3, 4, 3, 4),
				new Selection(5, 5, 5, 5),
				new Selection(11, 4, 11, 4),
				new Selection(14, 5, 14, 5)
			];
			return expandEmmetAbbreviation(null).then(() => {
				assert.strictEqual(editor.document.getText(), scssContents.replace(/p(\d\d)/g, 'padding: $1px;'));
				return Promise.resolve();
			});
		});
	});

	test('Expand abbreviation in completion list (SCSS)', () => {

		return withRandomFileEditor(scssContents, 'scss', (editor, _) => {
			editor.selection = new Selection(3, 4, 3, 4);
			const cancelSrc = new CancellationTokenSource();
			const completionPromise1 = completionProvider.provideCompletionItems(editor.document, new Position(3, 4), cancelSrc.token, invokeCompletionContext);
			const completionPromise2 = completionProvider.provideCompletionItems(editor.document, new Position(5, 5), cancelSrc.token, invokeCompletionContext);
			const completionPromise3 = completionProvider.provideCompletionItems(editor.document, new Position(11, 4), cancelSrc.token, invokeCompletionContext);
			const completionPromise4 = completionProvider.provideCompletionItems(editor.document, new Position(14, 5), cancelSrc.token, invokeCompletionContext);
			if (!completionPromise1) {
				assert.strictEqual(1, 2, `Problem with expanding padding abbreviations at line 3 col 4`);
			}
			if (!completionPromise2) {
				assert.strictEqual(1, 2, `Problem with expanding padding abbreviations at line 5 col 5`);
			}
			if (!completionPromise3) {
				assert.strictEqual(1, 2, `Problem with expanding padding abbreviations at line 11 col 4`);
			}
			if (!completionPromise4) {
				assert.strictEqual(1, 2, `Problem with expanding padding abbreviations at line 14 col 5`);
			}

			if (!completionPromise1 || !completionPromise2 || !completionPromise3 || !completionPromise4) {
				return Promise.resolve();
			}

			const callBack = (completionList: CompletionList, abbreviation: string, expandedText: string) => {
				if (!completionList.items || !completionList.items.length) {
					assert.strictEqual(1, 2, `Problem with expanding m10`);
					return;
				}
				const emmetCompletionItem = completionList.items[0];
				assert.strictEqual(emmetCompletionItem.label, expandedText, `Label of completion item doesnt match.`);
				assert.strictEqual((<string>emmetCompletionItem.documentation || '').replace(/\|/g, ''), expandedText, `Docs of completion item doesnt match.`);
				assert.strictEqual(emmetCompletionItem.filterText, abbreviation, `FilterText of completion item doesnt match.`);
			};

			return Promise.all([completionPromise1, completionPromise2, completionPromise3, completionPromise4]).then(([result1, result2, result3, result4]) => {
				assert.ok(result1);
				assert.ok(result2);
				assert.ok(result3);
				assert.ok(result4);
				callBack(result1, 'p10', 'padding: 10px;');
				callBack(result2, 'p20', 'padding: 20px;');
				callBack(result3, 'p30', 'padding: 30px;');
				callBack(result4, 'p40', 'padding: 40px;');
				return Promise.resolve();
			});
		});
	});


	test('Invalid locations for abbreviations in scss', () => {
		const scssContentsNoExpand = `
m10
		.boo {
			margin: 10px;
			.hoo {
				background:
			}
		}
		`;

		return withRandomFileEditor(scssContentsNoExpand, 'scss', (editor, _) => {
			editor.selections = [
				new Selection(1, 3, 1, 3), // outside rule
				new Selection(5, 15, 5, 15) // in the value part of property value
			];
			return expandEmmetAbbreviation(null).then(() => {
				assert.strictEqual(editor.document.getText(), scssContentsNoExpand);
				return Promise.resolve();
			});
		});
	});

	test('Invalid locations for abbreviations in scss in completion list', () => {
		const scssContentsNoExpand = `
m10
		.boo {
			margin: 10px;
			.hoo {
				background:
			}
		}
		`;

		return withRandomFileEditor(scssContentsNoExpand, 'scss', (editor, _) => {
			editor.selection = new Selection(1, 3, 1, 3); // outside rule
			const cancelSrc = new CancellationTokenSource();
			let completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, invokeCompletionContext);
			if (completionPromise) {
				assert.strictEqual(1, 2, `m10 gets expanded in invalid location (outside rule)`);
			}

			editor.selection = new Selection(5, 15, 5, 15); // in the value part of property value
			completionPromise = completionProvider.provideCompletionItems(editor.document, editor.selection.active, cancelSrc.token, invokeCompletionContext);
			if (completionPromise) {
				return completionPromise.then((completionList: CompletionList | undefined) => {
					if (completionList && completionList.items && completionList.items.length > 0) {
						assert.strictEqual(1, 2, `m10 gets expanded in invalid location (n the value part of property value)`);
					}
					return Promise.resolve();
				});
			}
			return Promise.resolve();
		});
	});

	test('Skip when typing property values when there is a nested rule in the next line (SCSS)', () => {
		return withRandomFileEditor(scssContents, 'scss', (editor, _) => {
			editor.selection = new Selection(19, 10, 19, 10);
			return expandEmmetAbbreviation(null).then(() => {
				assert.strictEqual(editor.document.getText(), scssContents);
				const cancelSrc = new CancellationTokenSource();
				const completionPromise = completionProvider.provideCompletionItems(editor.document, new Position(19, 10), cancelSrc.token, invokeCompletionContext);
				if (completionPromise) {
					assert.strictEqual(1, 2, `Invalid completion at property value`);
				}
				return Promise.resolve();
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/test/editPointSelectItemBalance.test.ts]---
Location: vscode-main/extensions/emmet/src/test/editPointSelectItemBalance.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { Selection } from 'vscode';
import { withRandomFileEditor, closeAllEditors } from './testUtils';
import { fetchEditPoint } from '../editPoint';
import { fetchSelectItem } from '../selectItem';
import { balanceOut, balanceIn } from '../balance';

suite('Tests for Next/Previous Select/Edit point and Balance actions', () => {
	teardown(closeAllEditors);

	const cssContents = `
.boo {
	margin: 20px 10px;
	background-image: url('tryme.png');
}

.boo .hoo {
	margin: 10px;
}
`;

	const scssContents = `
.boo {
	margin: 20px 10px;
	background-image: url('tryme.png');

	.boo .hoo {
		margin: 10px;
	}
}
`;

	const htmlContents = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title></title>
</head>
<body>
	<div>
\t\t
	</div>
	<div class="header">
		<ul class="nav main">
			<li class="item1">Item 1</li>
			<li class="item2">Item 2</li>
		</ul>
	</div>
</body>
</html>
`;

	test('Emmet Next/Prev Edit point in html file', function (): any {
		return withRandomFileEditor(htmlContents, '.html', (editor, _) => {
			editor.selections = [new Selection(1, 5, 1, 5)];

			const expectedNextEditPoints: [number, number][] = [[4, 16], [6, 8], [10, 2], [10, 2]];
			expectedNextEditPoints.forEach(([line, col]) => {
				fetchEditPoint('next');
				testSelection(editor.selection, col, line);
			});

			const expectedPrevEditPoints = [[6, 8], [4, 16], [4, 16]];
			expectedPrevEditPoints.forEach(([line, col]) => {
				fetchEditPoint('prev');
				testSelection(editor.selection, col, line);
			});

			return Promise.resolve();
		});
	});

	test('Emmet Select Next/Prev Item in html file', function (): any {
		return withRandomFileEditor(htmlContents, '.html', (editor, _) => {
			editor.selections = [new Selection(2, 2, 2, 2)];

			const expectedNextItemPoints: [number, number, number][] = [
				[2, 1, 5],   // html
				[2, 6, 15],  // lang="en"
				[2, 12, 14], // en
				[3, 1, 5],   // head
				[4, 2, 6],   // meta
				[4, 7, 17], // charset=""
				[5, 2, 6],   // meta
				[5, 7, 22], // name="viewport"
				[5, 13, 21], // viewport
				[5, 23, 70], // content="width=device-width, initial-scale=1.0"
				[5, 32, 69], // width=device-width, initial-scale=1.0
				[5, 32, 51], // width=device-width,
				[5, 52, 69], // initial-scale=1.0
				[6, 2, 7]   // title
			];
			expectedNextItemPoints.forEach(([line, colstart, colend]) => {
				fetchSelectItem('next');
				testSelection(editor.selection, colstart, line, colend);
			});

			editor.selections = [new Selection(6, 15, 6, 15)];
			expectedNextItemPoints.reverse().forEach(([line, colstart, colend]) => {
				fetchSelectItem('prev');
				testSelection(editor.selection, colstart, line, colend);
			});

			return Promise.resolve();
		});
	});

	test('Emmet Select Next/Prev item at boundary', function (): any {
		return withRandomFileEditor(htmlContents, '.html', (editor, _) => {
			editor.selections = [new Selection(4, 1, 4, 1)];

			fetchSelectItem('next');
			testSelection(editor.selection, 2, 4, 6);

			editor.selections = [new Selection(4, 1, 4, 1)];

			fetchSelectItem('prev');
			testSelection(editor.selection, 1, 3, 5);

			return Promise.resolve();
		});
	});

	test('Emmet Next/Prev Item in html template', function (): any {
		const templateContents = `
<script type="text/template">
	<div class="header">
		<ul class="nav main">
		</ul>
	</div>
</script>
`;
		return withRandomFileEditor(templateContents, '.html', (editor, _) => {
			editor.selections = [new Selection(2, 2, 2, 2)];

			const expectedNextItemPoints: [number, number, number][] = [
				[2, 2, 5],  // div
				[2, 6, 20], // class="header"
				[2, 13, 19], // header
				[3, 3, 5],   // ul
				[3, 6, 22],   // class="nav main"
				[3, 13, 21], // nav main
				[3, 13, 16],   // nav
				[3, 17, 21], // main
			];
			expectedNextItemPoints.forEach(([line, colstart, colend]) => {
				fetchSelectItem('next');
				testSelection(editor.selection, colstart, line, colend);
			});

			editor.selections = [new Selection(4, 1, 4, 1)];
			expectedNextItemPoints.reverse().forEach(([line, colstart, colend]) => {
				fetchSelectItem('prev');
				testSelection(editor.selection, colstart, line, colend);
			});

			return Promise.resolve();
		});
	});

	test('Emmet Select Next/Prev Item in css file', function (): any {
		return withRandomFileEditor(cssContents, '.css', (editor, _) => {
			editor.selections = [new Selection(0, 0, 0, 0)];

			const expectedNextItemPoints: [number, number, number][] = [
				[1, 0, 4],   // .boo
				[2, 1, 19],  // margin: 20px 10px;
				[2, 9, 18],   // 20px 10px
				[2, 9, 13],   // 20px
				[2, 14, 18], // 10px
				[3, 1, 36],   // background-image: url('tryme.png');
				[3, 19, 35], // url('tryme.png')
				[6, 0, 9], // .boo .hoo
				[7, 1, 14], // margin: 10px;
				[7, 9, 13], // 10px
			];
			expectedNextItemPoints.forEach(([line, colstart, colend]) => {
				fetchSelectItem('next');
				testSelection(editor.selection, colstart, line, colend);
			});

			editor.selections = [new Selection(9, 0, 9, 0)];
			expectedNextItemPoints.reverse().forEach(([line, colstart, colend]) => {
				fetchSelectItem('prev');
				testSelection(editor.selection, colstart, line, colend);
			});

			return Promise.resolve();
		});
	});

	test('Emmet Select Next/Prev Item in scss file with nested rules', function (): any {
		return withRandomFileEditor(scssContents, '.scss', (editor, _) => {
			editor.selections = [new Selection(0, 0, 0, 0)];

			const expectedNextItemPoints: [number, number, number][] = [
				[1, 0, 4],   // .boo
				[2, 1, 19],  // margin: 20px 10px;
				[2, 9, 18],   // 20px 10px
				[2, 9, 13],   // 20px
				[2, 14, 18], // 10px
				[3, 1, 36],   // background-image: url('tryme.png');
				[3, 19, 35], // url('tryme.png')
				[5, 1, 10], // .boo .hoo
				[6, 2, 15], // margin: 10px;
				[6, 10, 14], // 10px
			];
			expectedNextItemPoints.forEach(([line, colstart, colend]) => {
				fetchSelectItem('next');
				testSelection(editor.selection, colstart, line, colend);
			});

			editor.selections = [new Selection(8, 0, 8, 0)];
			expectedNextItemPoints.reverse().forEach(([line, colstart, colend]) => {
				fetchSelectItem('prev');
				testSelection(editor.selection, colstart, line, colend);
			});

			return Promise.resolve();
		});
	});

	test('Emmet Balance Out in html file', function (): any {
		return withRandomFileEditor(htmlContents, 'html', (editor, _) => {

			editor.selections = [new Selection(14, 6, 14, 10)];
			const expectedBalanceOutRanges: [number, number, number, number][] = [
				[14, 3, 14, 32],   // <li class="item1">Item 1</li>
				[13, 23, 16, 2],  // inner contents of <ul class="nav main">
				[13, 2, 16, 7],		// outer contents of <ul class="nav main">
				[12, 21, 17, 1], // inner contents of <div class="header">
				[12, 1, 17, 7], // outer contents of <div class="header">
				[8, 6, 18, 0],	// inner contents of <body>
				[8, 0, 18, 7], // outer contents of <body>
				[2, 16, 19, 0],   // inner contents of <html>
				[2, 0, 19, 7],   // outer contents of <html>
			];
			expectedBalanceOutRanges.forEach(([linestart, colstart, lineend, colend]) => {
				balanceOut();
				testSelection(editor.selection, colstart, linestart, colend, lineend);
			});

			editor.selections = [new Selection(12, 7, 12, 7)];
			const expectedBalanceInRanges: [number, number, number, number][] = [
				[12, 21, 17, 1],   // inner contents of <div class="header">
				[13, 2, 16, 7],		// outer contents of <ul class="nav main">
				[13, 23, 16, 2],  // inner contents of <ul class="nav main">
				[14, 3, 14, 32],   // <li class="item1">Item 1</li>
				[14, 21, 14, 27]   // Item 1
			];
			expectedBalanceInRanges.forEach(([linestart, colstart, lineend, colend]) => {
				balanceIn();
				testSelection(editor.selection, colstart, linestart, colend, lineend);
			});

			return Promise.resolve();
		});
	});

	test('Emmet Balance In using the same stack as Balance out in html file', function (): any {
		return withRandomFileEditor(htmlContents, 'html', (editor, _) => {

			editor.selections = [new Selection(15, 6, 15, 10)];
			const expectedBalanceOutRanges: [number, number, number, number][] = [
				[15, 3, 15, 32],   // <li class="item1">Item 2</li>
				[13, 23, 16, 2],  // inner contents of <ul class="nav main">
				[13, 2, 16, 7],		// outer contents of <ul class="nav main">
				[12, 21, 17, 1], // inner contents of <div class="header">
				[12, 1, 17, 7], // outer contents of <div class="header">
				[8, 6, 18, 0],	// inner contents of <body>
				[8, 0, 18, 7], // outer contents of <body>
				[2, 16, 19, 0],   // inner contents of <html>
				[2, 0, 19, 7],   // outer contents of <html>
			];
			expectedBalanceOutRanges.forEach(([linestart, colstart, lineend, colend]) => {
				balanceOut();
				testSelection(editor.selection, colstart, linestart, colend, lineend);
			});

			expectedBalanceOutRanges.reverse().forEach(([linestart, colstart, lineend, colend]) => {
				testSelection(editor.selection, colstart, linestart, colend, lineend);
				balanceIn();
			});

			return Promise.resolve();
		});
	});

	test('Emmet Balance In when selection doesnt span entire node or its inner contents', function (): any {
		return withRandomFileEditor(htmlContents, 'html', (editor, _) => {

			editor.selection = new Selection(13, 7, 13, 10); // Inside the open tag of <ul class="nav main">
			balanceIn();
			testSelection(editor.selection, 23, 13, 2, 16); // inner contents of <ul class="nav main">

			editor.selection = new Selection(16, 4, 16, 5); // Inside the open close of <ul class="nav main">
			balanceIn();
			testSelection(editor.selection, 23, 13, 2, 16); // inner contents of <ul class="nav main">

			editor.selection = new Selection(13, 7, 14, 2); // Inside the open tag of <ul class="nav main"> and the next line
			balanceIn();
			testSelection(editor.selection, 23, 13, 2, 16); // inner contents of <ul class="nav main">

			return Promise.resolve();
		});
	});

	test('Emmet Balance In/Out in html template', function (): any {
		const htmlTemplate = `
<script type="text/html">
<div class="header">
	<ul class="nav main">
		<li class="item1">Item 1</li>
		<li class="item2">Item 2</li>
	</ul>
</div>
</script>`;

		return withRandomFileEditor(htmlTemplate, 'html', (editor, _) => {

			editor.selections = [new Selection(5, 24, 5, 24)];
			const expectedBalanceOutRanges: [number, number, number, number][] = [
				[5, 20, 5, 26],	// <li class="item1">``Item 2''</li>
				[5, 2, 5, 31],	// ``<li class="item1">Item 2</li>''
				[3, 22, 6, 1],	// inner contents of ul
				[3, 1, 6, 6],	// outer contents of ul
				[2, 20, 7, 0],	// inner contents of div
				[2, 0, 7, 6],	// outer contents of div
			];
			expectedBalanceOutRanges.forEach(([linestart, colstart, lineend, colend]) => {
				balanceOut();
				testSelection(editor.selection, colstart, linestart, colend, lineend);
			});

			expectedBalanceOutRanges.pop();
			expectedBalanceOutRanges.reverse().forEach(([linestart, colstart, lineend, colend]) => {
				balanceIn();
				testSelection(editor.selection, colstart, linestart, colend, lineend);
			});

			return Promise.resolve();
		});
	});
});

function testSelection(selection: Selection, startChar: number, startline: number, endChar?: number, endLine?: number) {
	assert.strictEqual(selection.anchor.line, startline);
	assert.strictEqual(selection.anchor.character, startChar);
	if (!endLine && endLine !== 0) {
		assert.strictEqual(selection.isSingleLine, true);
	} else {
		assert.strictEqual(selection.active.line, endLine);
	}
	if (!endChar && endChar !== 0) {
		assert.strictEqual(selection.isEmpty, true);
	} else {
		assert.strictEqual(selection.active.character, endChar);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/test/evaluateMathExpression.test.ts]---
Location: vscode-main/extensions/emmet/src/test/evaluateMathExpression.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { Position, Selection } from 'vscode';
import { withRandomFileEditor, closeAllEditors } from './testUtils';
import { evaluateMathExpression } from '../evaluateMathExpression';

suite('Tests for Evaluate Math Expression', () => {
	teardown(closeAllEditors);

	function testEvaluateMathExpression(fileContents: string, selection: [number, number] | number, expectedFileContents: string): Thenable<boolean> {
		return withRandomFileEditor(fileContents, 'html', async (editor, _doc) => {
			const selectionToUse = typeof selection === 'number' ?
				new Selection(new Position(0, selection), new Position(0, selection)) :
				new Selection(new Position(0, selection[0]), new Position(0, selection[1]));
			editor.selection = selectionToUse;

			await evaluateMathExpression();

			assert.strictEqual(editor.document.getText(), expectedFileContents);
			return Promise.resolve();
		});
	}

	test('Selected sanity check', () => {
		return testEvaluateMathExpression('1 + 2', [0, 5], '3');
	});

	test('Selected with surrounding text', () => {
		return testEvaluateMathExpression('test1 + 2test', [4, 9], 'test3test');
	});

	test('Selected with number not part of selection', () => {
		return testEvaluateMathExpression('test3 1+2', [6, 9], 'test3 3');
	});

	test('Non-selected sanity check', () => {
		return testEvaluateMathExpression('1 + 2', 5, '3');
	});

	test('Non-selected midway', () => {
		return testEvaluateMathExpression('1 + 2', 1, '1 + 2');
	});

	test('Non-selected with surrounding text', () => {
		return testEvaluateMathExpression('test1 + 3test', 9, 'test4test');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/test/incrementDecrement.test.ts]---
Location: vscode-main/extensions/emmet/src/test/incrementDecrement.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { Selection } from 'vscode';
import { withRandomFileEditor, closeAllEditors } from './testUtils';
import { incrementDecrement as incrementDecrementImpl } from '../incrementDecrement';

function incrementDecrement(delta: number): Thenable<boolean> {
	const result = incrementDecrementImpl(delta);
	assert.ok(result);
	return result!;
}

suite('Tests for Increment/Decrement Emmet Commands', () => {
	teardown(closeAllEditors);

	const contents = `
	hello 123.43 there
	hello 999.9 there
	hello 100 there
	`;

	test('incrementNumberByOne', function (): any {
		return withRandomFileEditor(contents, 'txt', async (editor, doc) => {
			editor.selections = [new Selection(1, 7, 1, 10), new Selection(2, 7, 2, 10)];
			await incrementDecrement(1);
			assert.strictEqual(doc.getText(), contents.replace('123', '124').replace('999', '1000'));
			return Promise.resolve();
		});
	});

	test('incrementNumberByTen', function (): any {
		return withRandomFileEditor(contents, 'txt', async (editor, doc) => {
			editor.selections = [new Selection(1, 7, 1, 10), new Selection(2, 7, 2, 10)];
			await incrementDecrement(10);
			assert.strictEqual(doc.getText(), contents.replace('123', '133').replace('999', '1009'));
			return Promise.resolve();
		});
	});

	test('incrementNumberByOneTenth', function (): any {
		return withRandomFileEditor(contents, 'txt', async (editor, doc) => {
			editor.selections = [new Selection(1, 7, 1, 13), new Selection(2, 7, 2, 12)];
			await incrementDecrement(0.1);
			assert.strictEqual(doc.getText(), contents.replace('123.43', '123.53').replace('999.9', '1000'));
			return Promise.resolve();
		});
	});

	test('decrementNumberByOne', function (): any {
		return withRandomFileEditor(contents, 'txt', async (editor, doc) => {
			editor.selections = [new Selection(1, 7, 1, 10), new Selection(3, 7, 3, 10)];
			await incrementDecrement(-1);
			assert.strictEqual(doc.getText(), contents.replace('123', '122').replace('100', '99'));
			return Promise.resolve();
		});
	});

	test('decrementNumberByTen', function (): any {
		return withRandomFileEditor(contents, 'txt', async (editor, doc) => {
			editor.selections = [new Selection(1, 7, 1, 10), new Selection(3, 7, 3, 10)];
			await incrementDecrement(-10);
			assert.strictEqual(doc.getText(), contents.replace('123', '113').replace('100', '90'));
			return Promise.resolve();
		});
	});

	test('decrementNumberByOneTenth', function (): any {
		return withRandomFileEditor(contents, 'txt', async (editor, doc) => {
			editor.selections = [new Selection(1, 7, 1, 13), new Selection(3, 7, 3, 10)];
			await incrementDecrement(-0.1);
			assert.strictEqual(doc.getText(), contents.replace('123.43', '123.33').replace('100', '99.9'));
			return Promise.resolve();
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/test/index.ts]---
Location: vscode-main/extensions/emmet/src/test/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as testRunner from '../../../../test/integration/electron/testrunner';

const options: import('mocha').MochaOptions = {
	ui: 'tdd',
	color: true,
	timeout: 60000
};

// These integration tests is being run in multiple environments (electron, web, remote)
// so we need to set the suite name based on the environment as the suite name is used
// for the test results file name
let suite = '';
if (process.env.VSCODE_BROWSER) {
	suite = `${process.env.VSCODE_BROWSER} Browser Integration Emmet Tests`;
} else if (process.env.REMOTE_VSCODE) {
	suite = 'Remote Integration Emmet Tests';
} else {
	suite = 'Integration Emmet Tests';
}

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

testRunner.configure(options);

export = testRunner;
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 228
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 228 of 552)

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

---[FILE: src/vs/editor/contrib/indentation/common/indentation.ts]---
Location: vscode-main/src/vs/editor/contrib/indentation/common/indentation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from '../../../../base/common/strings.js';
import { ShiftCommand } from '../../../common/commands/shiftCommand.js';
import { EditOperation, ISingleEditOperation } from '../../../common/core/editOperation.js';
import { normalizeIndentation } from '../../../common/core/misc/indentation.js';
import { Selection } from '../../../common/core/selection.js';
import { StandardTokenType } from '../../../common/encodedTokenAttributes.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { ProcessedIndentRulesSupport } from '../../../common/languages/supports/indentationLineProcessor.js';
import { ITextModel } from '../../../common/model.js';

export function getReindentEditOperations(model: ITextModel, languageConfigurationService: ILanguageConfigurationService, startLineNumber: number, endLineNumber: number): ISingleEditOperation[] {
	if (model.getLineCount() === 1 && model.getLineMaxColumn(1) === 1) {
		// Model is empty
		return [];
	}

	const indentationRulesSupport = languageConfigurationService.getLanguageConfiguration(model.getLanguageId()).indentRulesSupport;
	if (!indentationRulesSupport) {
		return [];
	}

	const processedIndentRulesSupport = new ProcessedIndentRulesSupport(model, indentationRulesSupport, languageConfigurationService);
	endLineNumber = Math.min(endLineNumber, model.getLineCount());

	// Skip `unIndentedLinePattern` lines
	while (startLineNumber <= endLineNumber) {
		if (!processedIndentRulesSupport.shouldIgnore(startLineNumber)) {
			break;
		}

		startLineNumber++;
	}

	if (startLineNumber > endLineNumber - 1) {
		return [];
	}

	const { tabSize, indentSize, insertSpaces } = model.getOptions();
	const shiftIndent = (indentation: string, count?: number) => {
		count = count || 1;
		return ShiftCommand.shiftIndent(indentation, indentation.length + count, tabSize, indentSize, insertSpaces);
	};
	const unshiftIndent = (indentation: string, count?: number) => {
		count = count || 1;
		return ShiftCommand.unshiftIndent(indentation, indentation.length + count, tabSize, indentSize, insertSpaces);
	};
	const indentEdits: ISingleEditOperation[] = [];

	// indentation being passed to lines below

	// Calculate indentation for the first line
	// If there is no passed-in indentation, we use the indentation of the first line as base.
	const currentLineText = model.getLineContent(startLineNumber);
	let globalIndent = strings.getLeadingWhitespace(currentLineText);
	// idealIndentForNextLine doesn't equal globalIndent when there is a line matching `indentNextLinePattern`.
	let idealIndentForNextLine: string = globalIndent;

	if (processedIndentRulesSupport.shouldIncrease(startLineNumber)) {
		idealIndentForNextLine = shiftIndent(idealIndentForNextLine);
		globalIndent = shiftIndent(globalIndent);
	}
	else if (processedIndentRulesSupport.shouldIndentNextLine(startLineNumber)) {
		idealIndentForNextLine = shiftIndent(idealIndentForNextLine);
	}

	startLineNumber++;

	// Calculate indentation adjustment for all following lines
	for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
		if (doesLineStartWithString(model, lineNumber)) {
			continue;
		}
		const text = model.getLineContent(lineNumber);
		const oldIndentation = strings.getLeadingWhitespace(text);
		const currentIdealIndent = idealIndentForNextLine;

		if (processedIndentRulesSupport.shouldDecrease(lineNumber, currentIdealIndent)) {
			idealIndentForNextLine = unshiftIndent(idealIndentForNextLine);
			globalIndent = unshiftIndent(globalIndent);
		}

		if (oldIndentation !== idealIndentForNextLine) {
			indentEdits.push(EditOperation.replaceMove(new Selection(lineNumber, 1, lineNumber, oldIndentation.length + 1), normalizeIndentation(idealIndentForNextLine, indentSize, insertSpaces)));
		}

		// calculate idealIndentForNextLine
		if (processedIndentRulesSupport.shouldIgnore(lineNumber)) {
			// In reindent phase, if the line matches `unIndentedLinePattern` we inherit indentation from above lines
			// but don't change globalIndent and idealIndentForNextLine.
			continue;
		} else if (processedIndentRulesSupport.shouldIncrease(lineNumber, currentIdealIndent)) {
			globalIndent = shiftIndent(globalIndent);
			idealIndentForNextLine = globalIndent;
		} else if (processedIndentRulesSupport.shouldIndentNextLine(lineNumber, currentIdealIndent)) {
			idealIndentForNextLine = shiftIndent(idealIndentForNextLine);
		} else {
			idealIndentForNextLine = globalIndent;
		}
	}

	return indentEdits;
}

function doesLineStartWithString(model: ITextModel, lineNumber: number): boolean {
	if (!model.tokenization.isCheapToTokenize(lineNumber)) {
		return false;
	}
	const lineTokens = model.tokenization.getLineTokens(lineNumber);
	return lineTokens.getStandardTokenType(0) === StandardTokenType.String;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/indentation/common/indentUtils.ts]---
Location: vscode-main/src/vs/editor/contrib/indentation/common/indentUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function getSpaceCnt(str: string, tabSize: number) {
	let spacesCnt = 0;

	for (let i = 0; i < str.length; i++) {
		if (str.charAt(i) === '\t') {
			spacesCnt += tabSize;
		} else {
			spacesCnt++;
		}
	}

	return spacesCnt;
}

export function generateIndent(spacesCnt: number, tabSize: number, insertSpaces: boolean) {
	spacesCnt = spacesCnt < 0 ? 0 : spacesCnt;

	let result = '';
	if (!insertSpaces) {
		const tabsCnt = Math.floor(spacesCnt / tabSize);
		spacesCnt = spacesCnt % tabSize;
		for (let i = 0; i < tabsCnt; i++) {
			result += '\t';
		}
	}

	for (let i = 0; i < spacesCnt; i++) {
		result += ' ';
	}

	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/indentation/test/browser/indentation.test.ts]---
Location: vscode-main/src/vs/editor/contrib/indentation/test/browser/indentation.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { Range } from '../../../../common/core/range.js';
import { Selection } from '../../../../common/core/selection.js';
import { MetadataConsts, StandardTokenType } from '../../../../common/encodedTokenAttributes.js';
import { EncodedTokenizationResult, IState, ITokenizationSupport, TokenizationRegistry } from '../../../../common/languages.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { NullState } from '../../../../common/languages/nullTokenize.js';
import { AutoIndentOnPaste, IndentationToSpacesCommand, IndentationToTabsCommand } from '../../browser/indentation.js';
import { withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { testCommand } from '../../../../test/browser/testCommand.js';
import { goIndentationRules, htmlIndentationRules, javascriptIndentationRules, latexIndentationRules, luaIndentationRules, phpIndentationRules, rubyIndentationRules } from '../../../../test/common/modes/supports/indentationRules.js';
import { cppOnEnterRules, htmlOnEnterRules, javascriptOnEnterRules, phpOnEnterRules } from '../../../../test/common/modes/supports/onEnterRules.js';
import { TypeOperations } from '../../../../common/cursor/cursorTypeOperations.js';
import { cppBracketRules, goBracketRules, htmlBracketRules, latexBracketRules, luaBracketRules, phpBracketRules, rubyBracketRules, typescriptBracketRules, vbBracketRules } from '../../../../test/common/modes/supports/bracketRules.js';
import { javascriptAutoClosingPairsRules, latexAutoClosingPairsRules } from '../../../../test/common/modes/supports/autoClosingPairsRules.js';
import { LanguageService } from '../../../../common/services/languageService.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { TestLanguageConfigurationService } from '../../../../test/common/modes/testLanguageConfigurationService.js';

export enum Language {
	TypeScript = 'ts-test',
	Ruby = 'ruby-test',
	PHP = 'php-test',
	Go = 'go-test',
	CPP = 'cpp-test',
	HTML = 'html-test',
	VB = 'vb-test',
	Latex = 'latex-test',
	Lua = 'lua-test'
}

function testIndentationToSpacesCommand(lines: string[], selection: Selection, tabSize: number, expectedLines: string[], expectedSelection: Selection): void {
	testCommand(lines, null, selection, (accessor, sel) => new IndentationToSpacesCommand(sel, tabSize), expectedLines, expectedSelection);
}

function testIndentationToTabsCommand(lines: string[], selection: Selection, tabSize: number, expectedLines: string[], expectedSelection: Selection): void {
	testCommand(lines, null, selection, (accessor, sel) => new IndentationToTabsCommand(sel, tabSize), expectedLines, expectedSelection);
}

export function registerLanguage(languageService: ILanguageService, language: Language): IDisposable {
	return languageService.registerLanguage({ id: language });
}

export function registerLanguageConfiguration(languageConfigurationService: ILanguageConfigurationService, language: Language): IDisposable {
	switch (language) {
		case Language.TypeScript:
			return languageConfigurationService.register(language, {
				brackets: typescriptBracketRules,
				comments: {
					lineComment: '//',
					blockComment: ['/*', '*/']
				},
				autoClosingPairs: javascriptAutoClosingPairsRules,
				indentationRules: javascriptIndentationRules,
				onEnterRules: javascriptOnEnterRules
			});
		case Language.Ruby:
			return languageConfigurationService.register(language, {
				brackets: rubyBracketRules,
				indentationRules: rubyIndentationRules,
			});
		case Language.PHP:
			return languageConfigurationService.register(language, {
				brackets: phpBracketRules,
				indentationRules: phpIndentationRules,
				onEnterRules: phpOnEnterRules
			});
		case Language.Go:
			return languageConfigurationService.register(language, {
				brackets: goBracketRules,
				indentationRules: goIndentationRules
			});
		case Language.CPP:
			return languageConfigurationService.register(language, {
				brackets: cppBracketRules,
				onEnterRules: cppOnEnterRules
			});
		case Language.HTML:
			return languageConfigurationService.register(language, {
				brackets: htmlBracketRules,
				indentationRules: htmlIndentationRules,
				onEnterRules: htmlOnEnterRules
			});
		case Language.VB:
			return languageConfigurationService.register(language, {
				brackets: vbBracketRules,
			});
		case Language.Latex:
			return languageConfigurationService.register(language, {
				brackets: latexBracketRules,
				autoClosingPairs: latexAutoClosingPairsRules,
				indentationRules: latexIndentationRules
			});
		case Language.Lua:
			return languageConfigurationService.register(language, {
				brackets: luaBracketRules,
				indentationRules: luaIndentationRules
			});
	}
}

export interface StandardTokenTypeData {
	startIndex: number;
	standardTokenType: StandardTokenType;
}

export function registerTokenizationSupport(instantiationService: TestInstantiationService, tokens: StandardTokenTypeData[][], languageId: Language): IDisposable {
	let lineIndex = 0;
	const languageService = instantiationService.get(ILanguageService);
	const tokenizationSupport: ITokenizationSupport = {
		getInitialState: () => NullState,
		tokenize: undefined!,
		tokenizeEncoded: (line: string, hasEOL: boolean, state: IState): EncodedTokenizationResult => {
			const tokensOnLine = tokens[lineIndex++];
			const encodedLanguageId = languageService.languageIdCodec.encodeLanguageId(languageId);
			const result = new Uint32Array(2 * tokensOnLine.length);
			for (let i = 0; i < tokensOnLine.length; i++) {
				result[2 * i] = tokensOnLine[i].startIndex;
				result[2 * i + 1] =
					(
						(encodedLanguageId << MetadataConsts.LANGUAGEID_OFFSET)
						| (tokensOnLine[i].standardTokenType << MetadataConsts.TOKEN_TYPE_OFFSET)
					);
			}
			return new EncodedTokenizationResult(result, [], state);
		}
	};
	return TokenizationRegistry.register(languageId, tokenizationSupport);
}

suite('Change Indentation to Spaces - TypeScript/Javascript', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('single tabs only at start of line', function () {
		testIndentationToSpacesCommand(
			[
				'first',
				'second line',
				'third line',
				'\tfourth line',
				'\tfifth'
			],
			new Selection(2, 3, 2, 3),
			4,
			[
				'first',
				'second line',
				'third line',
				'    fourth line',
				'    fifth'
			],
			new Selection(2, 3, 2, 3)
		);
	});

	test('multiple tabs at start of line', function () {
		testIndentationToSpacesCommand(
			[
				'\t\tfirst',
				'\tsecond line',
				'\t\t\t third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 5, 1, 5),
			3,
			[
				'      first',
				'   second line',
				'          third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 9, 1, 9)
		);
	});

	test('multiple tabs', function () {
		testIndentationToSpacesCommand(
			[
				'\t\tfirst\t',
				'\tsecond  \t line \t',
				'\t\t\t third line',
				' \tfourth line',
				'fifth'
			],
			new Selection(1, 5, 1, 5),
			2,
			[
				'    first\t',
				'  second  \t line \t',
				'       third line',
				'   fourth line',
				'fifth'
			],
			new Selection(1, 7, 1, 7)
		);
	});

	test('empty lines', function () {
		testIndentationToSpacesCommand(
			[
				'\t\t\t',
				'\t',
				'\t\t'
			],
			new Selection(1, 4, 1, 4),
			2,
			[
				'      ',
				'  ',
				'    '
			],
			new Selection(1, 4, 1, 4)
		);
	});
});

suite('Change Indentation to Tabs -  TypeScript/Javascript', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('spaces only at start of line', function () {
		testIndentationToTabsCommand(
			[
				'    first',
				'second line',
				'    third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 3, 2, 3),
			4,
			[
				'\tfirst',
				'second line',
				'\tthird line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 3, 2, 3)
		);
	});

	test('multiple spaces at start of line', function () {
		testIndentationToTabsCommand(
			[
				'first',
				'   second line',
				'          third line',
				'fourth line',
				'     fifth'
			],
			new Selection(1, 5, 1, 5),
			3,
			[
				'first',
				'\tsecond line',
				'\t\t\t third line',
				'fourth line',
				'\t  fifth'
			],
			new Selection(1, 5, 1, 5)
		);
	});

	test('multiple spaces', function () {
		testIndentationToTabsCommand(
			[
				'      first   ',
				'  second     line \t',
				'       third line',
				'   fourth line',
				'fifth'
			],
			new Selection(1, 8, 1, 8),
			2,
			[
				'\t\t\tfirst   ',
				'\tsecond     line \t',
				'\t\t\t third line',
				'\t fourth line',
				'fifth'
			],
			new Selection(1, 5, 1, 5)
		);
	});

	test('issue #45996', function () {
		testIndentationToSpacesCommand(
			[
				'\tabc',
			],
			new Selection(1, 3, 1, 3),
			4,
			[
				'    abc',
			],
			new Selection(1, 6, 1, 6)
		);
	});
});

suite('Indent With Tab - TypeScript/JavaScript', () => {

	const languageId = Language.TypeScript;
	let disposables: DisposableStore;
	let serviceCollection: ServiceCollection;

	setup(() => {
		disposables = new DisposableStore();
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		disposables.add(languageService);
		disposables.add(languageConfigurationService);
		disposables.add(registerLanguage(languageService, languageId));
		disposables.add(registerLanguageConfiguration(languageConfigurationService, languageId));
		serviceCollection = new ServiceCollection(
			[ILanguageService, languageService],
			[ILanguageConfigurationService, languageConfigurationService]
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('temp issue because there should be at least one passing test in a suite', () => {
		assert.ok(true);
	});

	test.skip('issue #63388: perserve correct indentation on tab 1', () => {

		// https://github.com/microsoft/vscode/issues/63388

		const model = createTextModel([
			'/*',
			' * Comment',
			' * /',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			editor.setSelection(new Selection(1, 1, 3, 5));
			editor.executeCommands('editor.action.indentLines', TypeOperations.indent(viewModel.cursorConfig, editor.getModel(), editor.getSelections()));
			assert.strictEqual(model.getValue(), [
				'    /*',
				'     * Comment',
				'     * /',
			].join('\n'));
		});
	});

	test.skip('issue #63388: perserve correct indentation on tab 2', () => {

		// https://github.com/microsoft/vscode/issues/63388

		const model = createTextModel([
			'switch (something) {',
			'  case 1:',
			'    whatever();',
			'    break;',
			'}',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			editor.setSelection(new Selection(1, 1, 5, 2));
			editor.executeCommands('editor.action.indentLines', TypeOperations.indent(viewModel.cursorConfig, editor.getModel(), editor.getSelections()));
			assert.strictEqual(model.getValue(), [
				'    switch (something) {',
				'        case 1:',
				'            whatever();',
				'            break;',
				'    }',
			].join('\n'));
		});
	});
});

suite('Auto Indent On Paste - TypeScript/JavaScript', () => {

	const languageId = Language.TypeScript;
	let disposables: DisposableStore;
	let serviceCollection: ServiceCollection;

	setup(() => {
		disposables = new DisposableStore();
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		disposables.add(languageService);
		disposables.add(languageConfigurationService);
		disposables.add(registerLanguage(languageService, languageId));
		disposables.add(registerLanguageConfiguration(languageConfigurationService, languageId));
		serviceCollection = new ServiceCollection(
			[ILanguageService, languageService],
			[ILanguageConfigurationService, languageConfigurationService]
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #119225: Do not add extra leading space when pasting JSDoc', () => {

		const model = createTextModel('', languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			const pasteText = [
				'/**',
				' * JSDoc',
				' */',
				'function a() {}'
			].join('\n');
			const tokens: StandardTokenTypeData[][] = [
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 3, standardTokenType: StandardTokenType.Comment },
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 2, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 8, standardTokenType: StandardTokenType.Comment },
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 1, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 3, standardTokenType: StandardTokenType.Other },
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other },
					{ startIndex: 8, standardTokenType: StandardTokenType.Other },
					{ startIndex: 9, standardTokenType: StandardTokenType.Other },
					{ startIndex: 10, standardTokenType: StandardTokenType.Other },
					{ startIndex: 11, standardTokenType: StandardTokenType.Other },
					{ startIndex: 12, standardTokenType: StandardTokenType.Other },
					{ startIndex: 13, standardTokenType: StandardTokenType.Other },
					{ startIndex: 14, standardTokenType: StandardTokenType.Other },
					{ startIndex: 15, standardTokenType: StandardTokenType.Other },
				]
			];
			disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));
			const autoIndentOnPasteController = editor.registerAndInstantiateContribution(AutoIndentOnPaste.ID, AutoIndentOnPaste);
			viewModel.paste(pasteText, true, undefined, 'keyboard');
			autoIndentOnPasteController.trigger(new Range(1, 1, 4, 16));
			assert.strictEqual(model.getValue(), pasteText);
		});
	});

	test('issue #167299: Blank line removes indent', () => {

		const model = createTextModel('', languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {

			// no need for tokenization because there are no comments
			const pasteText = [
				'',
				'export type IncludeReference =',
				'	| BaseReference',
				'	| SelfReference',
				'	| RelativeReference;',
				'',
				'export const enum IncludeReferenceKind {',
				'	Base,',
				'	Self,',
				'	RelativeReference,',
				'}'
			].join('\n');

			const autoIndentOnPasteController = editor.registerAndInstantiateContribution(AutoIndentOnPaste.ID, AutoIndentOnPaste);
			viewModel.paste(pasteText, true, undefined, 'keyboard');
			autoIndentOnPasteController.trigger(new Range(1, 1, 11, 2));
			assert.strictEqual(model.getValue(), pasteText);
		});
	});

	test('issue #29803: do not indent when pasting text with only one line', () => {

		// https://github.com/microsoft/vscode/issues/29803

		const model = createTextModel([
			'const linkHandler = new Class(a, b, c,',
			'    d)'
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			editor.setSelection(new Selection(2, 6, 2, 6));
			const text = ', null';
			viewModel.paste(text, true, undefined, 'keyboard');
			const autoIndentOnPasteController = editor.registerAndInstantiateContribution(AutoIndentOnPaste.ID, AutoIndentOnPaste);
			autoIndentOnPasteController.trigger(new Range(2, 6, 2, 11));
			assert.strictEqual(model.getValue(), [
				'const linkHandler = new Class(a, b, c,',
				'    d, null)'
			].join('\n'));
		});
	});

	test('issue #29753: incorrect indentation after comment', () => {

		// https://github.com/microsoft/vscode/issues/29753

		const model = createTextModel([
			'class A {',
			'    /**',
			'     * used only for debug purposes.',
			'     */',
			'    private _codeInfo: KeyMapping[];',
			'}',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			editor.setSelection(new Selection(5, 24, 5, 34));
			const text = 'IMacLinuxKeyMapping';
			viewModel.paste(text, true, undefined, 'keyboard');
			const autoIndentOnPasteController = editor.registerAndInstantiateContribution(AutoIndentOnPaste.ID, AutoIndentOnPaste);
			autoIndentOnPasteController.trigger(new Range(5, 24, 5, 43));
			assert.strictEqual(model.getValue(), [
				'class A {',
				'    /**',
				'     * used only for debug purposes.',
				'     */',
				'    private _codeInfo: IMacLinuxKeyMapping[];',
				'}',
			].join('\n'));
		});
	});

	test('issue #29753: incorrect indentation of header comment', () => {

		// https://github.com/microsoft/vscode/issues/29753

		const model = createTextModel('', languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			const text = [
				'/*----------------',
				' *  Copyright (c) ',
				' *  Licensed under ...',
				' *-----------------*/',
			].join('\n');
			viewModel.paste(text, true, undefined, 'keyboard');
			const autoIndentOnPasteController = editor.registerAndInstantiateContribution(AutoIndentOnPaste.ID, AutoIndentOnPaste);
			autoIndentOnPasteController.trigger(new Range(1, 1, 4, 22));
			assert.strictEqual(model.getValue(), text);
		});
	});

	test('issue #209859: do not do change indentation when pasted inside of a string', () => {

		// issue: https://github.com/microsoft/vscode/issues/209859
		// issue: https://github.com/microsoft/vscode/issues/209418

		const initialText = [
			'const foo = "some text',
			'         which is strangely',
			'    indented"'
		].join('\n');
		const model = createTextModel(initialText, languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			const tokens: StandardTokenTypeData[][] = [
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other },
					{ startIndex: 12, standardTokenType: StandardTokenType.String },
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.String },
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.String },
				]
			];
			disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));

			editor.setSelection(new Selection(2, 10, 2, 15));
			viewModel.paste('which', true, undefined, 'keyboard');
			const autoIndentOnPasteController = editor.registerAndInstantiateContribution(AutoIndentOnPaste.ID, AutoIndentOnPaste);
			autoIndentOnPasteController.trigger(new Range(2, 1, 2, 28));
			assert.strictEqual(model.getValue(), initialText);
		});
	});

	// Failing tests found in issues...

	test.skip('issue #181065: Incorrect paste of object within comment', () => {

		// https://github.com/microsoft/vscode/issues/181065

		const model = createTextModel('', languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			const text = [
				'/**',
				' * @typedef {',
				' * }',
				' */'
			].join('\n');
			const tokens: StandardTokenTypeData[][] = [
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 3, standardTokenType: StandardTokenType.Comment },
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 2, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 3, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 11, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 12, standardTokenType: StandardTokenType.Other },
					{ startIndex: 13, standardTokenType: StandardTokenType.Other },
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 2, standardTokenType: StandardTokenType.Other },
					{ startIndex: 3, standardTokenType: StandardTokenType.Other },
					{ startIndex: 4, standardTokenType: StandardTokenType.Other },
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 1, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 3, standardTokenType: StandardTokenType.Other },
				]
			];
			disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));
			const autoIndentOnPasteController = editor.registerAndInstantiateContribution(AutoIndentOnPaste.ID, AutoIndentOnPaste);
			viewModel.paste(text, true, undefined, 'keyboard');
			autoIndentOnPasteController.trigger(new Range(1, 1, 4, 4));
			assert.strictEqual(model.getValue(), text);
		});
	});

	test.skip('issue #86301: preserve cursor at inserted indentation level', () => {

		// https://github.com/microsoft/vscode/issues/86301

		const model = createTextModel([
			'() => {',
			'',
			'}',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			editor.setSelection(new Selection(2, 1, 2, 1));
			const text = [
				'() => {',
				'',
				'}',
				''
			].join('\n');
			const autoIndentOnPasteController = editor.registerAndInstantiateContribution(AutoIndentOnPaste.ID, AutoIndentOnPaste);
			viewModel.paste(text, true, undefined, 'keyboard');
			autoIndentOnPasteController.trigger(new Range(2, 1, 5, 1));

			// notes:
			// why is line 3 not indented to the same level as line 2?
			// looks like the indentation is inserted correctly at line 5, but the cursor does not appear at the maximum indentation level?
			assert.strictEqual(model.getValue(), [
				'() => {',
				'    () => {',
				'    ', // <- should also be indented
				'    }',
				'    ', // <- cursor should be at the end of the indentation
				'}',
			].join('\n'));

			const selection = viewModel.getSelection();
			assert.deepStrictEqual(selection, new Selection(5, 5, 5, 5));
		});
	});

	test.skip('issue #85781: indent line with extra white space', () => {

		// https://github.com/microsoft/vscode/issues/85781
		// note: still to determine whether this is a bug or not

		const model = createTextModel([
			'() => {',
			'    console.log("a");',
			'}',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			editor.setSelection(new Selection(2, 5, 2, 5));
			const text = [
				'() => {',
				'    console.log("b")',
				'}',
				' '
			].join('\n');
			const autoIndentOnPasteController = editor.registerAndInstantiateContribution(AutoIndentOnPaste.ID, AutoIndentOnPaste);
			viewModel.paste(text, true, undefined, 'keyboard');
			// todo@aiday-mar, make sure range is correct, and make test work as in real life
			autoIndentOnPasteController.trigger(new Range(2, 5, 5, 6));
			assert.strictEqual(model.getValue(), [
				'() => {',
				'    () => {',
				'        console.log("b")',
				'    }',
				'    console.log("a");',
				'}',
			].join('\n'));
		});
	});

	test.skip('issue #29589: incorrect indentation of closing brace on paste', () => {

		// https://github.com/microsoft/vscode/issues/29589

		const model = createTextModel('', languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			editor.setSelection(new Selection(2, 5, 2, 5));
			const text = [
				'function makeSub(a,b) {',
				'subsent = sent.substring(a,b);',
				'return subsent;',
				'}',
			].join('\n');
			const autoIndentOnPasteController = editor.registerAndInstantiateContribution(AutoIndentOnPaste.ID, AutoIndentOnPaste);
			viewModel.paste(text, true, undefined, 'keyboard');
			// todo@aiday-mar, make sure range is correct, and make test work as in real life
			autoIndentOnPasteController.trigger(new Range(1, 1, 4, 2));
			assert.strictEqual(model.getValue(), [
				'function makeSub(a,b) {',
				'subsent = sent.substring(a,b);',
				'return subsent;',
				'}',
			].join('\n'));
		});
	});

	test.skip('issue #201420: incorrect indentation when first line is comment', () => {

		// https://github.com/microsoft/vscode/issues/201420

		const model = createTextModel([
			'function bar() {',
			'',
			'}',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			const tokens: StandardTokenTypeData[][] = [
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other },
					{ startIndex: 8, standardTokenType: StandardTokenType.Other },
					{ startIndex: 9, standardTokenType: StandardTokenType.Other },
					{ startIndex: 12, standardTokenType: StandardTokenType.Other },
					{ startIndex: 13, standardTokenType: StandardTokenType.Other },
					{ startIndex: 14, standardTokenType: StandardTokenType.Other },
					{ startIndex: 15, standardTokenType: StandardTokenType.Other },
					{ startIndex: 16, standardTokenType: StandardTokenType.Other }
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 2, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 3, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 10, standardTokenType: StandardTokenType.Comment }
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other },
					{ startIndex: 5, standardTokenType: StandardTokenType.Other },
					{ startIndex: 6, standardTokenType: StandardTokenType.Other },
					{ startIndex: 9, standardTokenType: StandardTokenType.Other },
					{ startIndex: 10, standardTokenType: StandardTokenType.Other },
					{ startIndex: 11, standardTokenType: StandardTokenType.Other },
					{ startIndex: 12, standardTokenType: StandardTokenType.Other },
					{ startIndex: 14, standardTokenType: StandardTokenType.Other }],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other },
					{ startIndex: 1, standardTokenType: StandardTokenType.Other }]
			];
			disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));

			editor.setSelection(new Selection(2, 1, 2, 1));
			const text = [
				'// comment',
				'const foo = 42',
			].join('\n');
			const autoIndentOnPasteController = editor.registerAndInstantiateContribution(AutoIndentOnPaste.ID, AutoIndentOnPaste);
			viewModel.paste(text, true, undefined, 'keyboard');
			autoIndentOnPasteController.trigger(new Range(2, 1, 3, 15));
			assert.strictEqual(model.getValue(), [
				'function bar() {',
				'    // comment',
				'    const foo = 42',
				'}',
			].join('\n'));
		});
	});
});

suite('Auto Indent On Type - TypeScript/JavaScript', () => {

	const languageId = Language.TypeScript;
	let disposables: DisposableStore;
	let serviceCollection: ServiceCollection;

	setup(() => {
		disposables = new DisposableStore();
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		disposables.add(languageService);
		disposables.add(languageConfigurationService);
		disposables.add(registerLanguage(languageService, languageId));
		disposables.add(registerLanguageConfiguration(languageConfigurationService, languageId));
		serviceCollection = new ServiceCollection(
			[ILanguageService, languageService],
			[ILanguageConfigurationService, languageConfigurationService]
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	// Failing tests from issues...

	test('issue #208215: indent after arrow function', () => {

		// https://github.com/microsoft/vscode/issues/208215

		const model = createTextModel('', languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			viewModel.type('const add1 = (n) =>');
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'const add1 = (n) =>',
				'    ',
			].join('\n'));
		});
	});

	test('issue #208215: indent after arrow function 2', () => {

		// https://github.com/microsoft/vscode/issues/208215

		const model = createTextModel([
			'const array = [1, 2, 3, 4, 5];',
			'array.map(',
			'    v =>',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(3, 9, 3, 9));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'const array = [1, 2, 3, 4, 5];',
				'array.map(',
				'    v =>',
				'        '
			].join('\n'));
		});
	});

	test('issue #116843: indent after arrow function', () => {

		// https://github.com/microsoft/vscode/issues/116843

		const model = createTextModel('', languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			viewModel.type([
				'const add1 = (n) =>',
				'    n + 1;',
			].join('\n'));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'const add1 = (n) =>',
				'    n + 1;',
				'',
			].join('\n'));
		});
	});

	test('issue #29755: do not add indentation on enter if indentation is already valid', () => {

		//https://github.com/microsoft/vscode/issues/29755

		const model = createTextModel([
			'function f() {',
			'    const one = 1;',
			'    const two = 2;',
			'}',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(3, 1, 3, 1));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'function f() {',
				'    const one = 1;',
				'',
				'    const two = 2;',
				'}',
			].join('\n'));
		});
	});

	test('issue #36090', () => {

		// https://github.com/microsoft/vscode/issues/36090

		const model = createTextModel([
			'class ItemCtrl {',
			'    getPropertiesByItemId(id) {',
			'        return this.fetchItem(id)',
			'            .then(item => {',
			'                return this.getPropertiesOfItem(item);',
			'            });',
			'    }',
			'}',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'advanced', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(7, 6, 7, 6));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(),
				[
					'class ItemCtrl {',
					'    getPropertiesByItemId(id) {',
					'        return this.fetchItem(id)',
					'            .then(item => {',
					'                return this.getPropertiesOfItem(item);',
					'            });',
					'    }',
					'    ',
					'}',
				].join('\n')
			);
			assert.deepStrictEqual(editor.getSelection(), new Selection(8, 5, 8, 5));
		});
	});

	test('issue #115304: indent block comment onEnter', () => {

		// https://github.com/microsoft/vscode/issues/115304

		const model = createTextModel([
			'/** */',
			'function f() {}',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'advanced', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(1, 4, 1, 4));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(),
				[
					'/**',
					' * ',
					' */',
					'function f() {}',
				].join('\n')
			);
			assert.deepStrictEqual(editor.getSelection(), new Selection(2, 4, 2, 4));
		});
	});

	test('issue #43244: indent when lambda arrow function is detected, outdent when end is reached', () => {

		// https://github.com/microsoft/vscode/issues/43244

		const model = createTextModel([
			'const array = [1, 2, 3, 4, 5];',
			'array.map(_)'
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(2, 12, 2, 12));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'const array = [1, 2, 3, 4, 5];',
				'array.map(_',
				'    ',
				')'
			].join('\n'));
		});
	});

	test('issue #43244: incorrect indentation after if/for/while without braces', () => {

		// https://github.com/microsoft/vscode/issues/43244

		const model = createTextModel([
			'function f() {',
			'    if (condition)',
			'}'
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(2, 19, 2, 19));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'function f() {',
				'    if (condition)',
				'        ',
				'}',
			].join('\n'));

			viewModel.type('return;');
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'function f() {',
				'    if (condition)',
				'        return;',
				'    ',
				'}',
			].join('\n'));
		});
	});

	test('issue #208232: incorrect indentation inside of comments', () => {

		// https://github.com/microsoft/vscode/issues/208232

		const model = createTextModel([
			'/**',
			'indentation done for {',
			'*/'
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			const tokens: StandardTokenTypeData[][] = [
				[{ startIndex: 0, standardTokenType: StandardTokenType.Comment }],
				[{ startIndex: 0, standardTokenType: StandardTokenType.Comment }],
				[{ startIndex: 0, standardTokenType: StandardTokenType.Comment }]
			];
			disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));
			editor.setSelection(new Selection(2, 23, 2, 23));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'/**',
				'indentation done for {',
				'',
				'*/'
			].join('\n'));
		});
	});

	test('issue #209802: allman style braces in JavaScript', () => {

		// https://github.com/microsoft/vscode/issues/209802

		const model = createTextModel([
			'if (/*condition*/)',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(1, 19, 1, 19));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'if (/*condition*/)',
				'    '
			].join('\n'));
			viewModel.type('{', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'if (/*condition*/)',
				'{}'
			].join('\n'));
			editor.setSelection(new Selection(2, 2, 2, 2));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'if (/*condition*/)',
				'{',
				'    ',
				'}'
			].join('\n'));
		});
	});

	// Failing tests...

	test.skip('issue #43244: indent after equal sign is detected', () => {

		// https://github.com/microsoft/vscode/issues/43244
		// issue: Should indent after an equal sign is detected followed by whitespace characters.
		// This should be outdented when a semi-colon is detected indicating the end of the assignment.

		// TODO: requires exploring indent/outdent pairs instead

		const model = createTextModel([
			'const array ='
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(1, 14, 1, 14));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'const array =',
				'    '
			].join('\n'));
		});
	});

	test.skip('issue #43244: indent after dot detected after object/array signifying a method call', () => {

		// https://github.com/microsoft/vscode/issues/43244
		// issue: When a dot is written, we should detect that this is a method call and indent accordingly

		// TODO: requires exploring indent/outdent pairs instead

		const model = createTextModel([
			'const array = [1, 2, 3];',
			'array.'
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(2, 7, 2, 7));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'const array = [1, 2, 3];',
				'array.',
				'    '
			].join('\n'));
		});
	});

	test.skip('issue #43244: indent after dot detected on a subsequent line after object/array signifying a method call', () => {

		// https://github.com/microsoft/vscode/issues/43244
		// issue: When a dot is written, we should detect that this is a method call and indent accordingly

		// TODO: requires exploring indent/outdent pairs instead

		const model = createTextModel([
			'const array = [1, 2, 3]',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(2, 7, 2, 7));
			viewModel.type('\n', 'keyboard');
			viewModel.type('.');
			assert.strictEqual(model.getValue(), [
				'const array = [1, 2, 3]',
				'    .'
			].join('\n'));
		});
	});

	test.skip('issue #43244: keep indentation when methods called on object/array', () => {

		// https://github.com/microsoft/vscode/issues/43244
		// Currently passes, but should pass with all the tests above too

		// TODO: requires exploring indent/outdent pairs instead

		const model = createTextModel([
			'const array = [1, 2, 3]',
			'    .filter(() => true)'
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(2, 24, 2, 24));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'const array = [1, 2, 3]',
				'    .filter(() => true)',
				'    '
			].join('\n'));
		});
	});

	test.skip('issue #43244: keep indentation when chained methods called on object/array', () => {

		// https://github.com/microsoft/vscode/issues/43244
		// When the call chain is not finished yet, and we type a dot, we do not want to change the indentation

		// TODO: requires exploring indent/outdent pairs instead

		const model = createTextModel([
			'const array = [1, 2, 3]',
			'    .filter(() => true)',
			'    '
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(3, 5, 3, 5));
			viewModel.type('.');
			assert.strictEqual(model.getValue(), [
				'const array = [1, 2, 3]',
				'    .filter(() => true)',
				'    .' // here we don't want to increase the indentation because we have chained methods
			].join('\n'));
		});
	});

	test.skip('issue #43244: outdent when a semi-color is detected indicating the end of the assignment', () => {

		// https://github.com/microsoft/vscode/issues/43244

		// TODO: requires exploring indent/outdent pairs instead

		const model = createTextModel([
			'const array = [1, 2, 3]',
			'    .filter(() => true);'
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(2, 25, 2, 25));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'const array = [1, 2, 3]',
				'    .filter(() => true);',
				''
			].join('\n'));
		});
	});


	test.skip('issue #40115: keep indentation when added', () => {

		// https://github.com/microsoft/vscode/issues/40115

		const model = createTextModel('function foo() {}', languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(1, 17, 1, 17));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'function foo() {',
				'    ',
				'}',
			].join('\n'));
			editor.setSelection(new Selection(2, 5, 2, 5));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'function foo() {',
				'    ',
				'    ',
				'}',
			].join('\n'));
		});
	});

	test.skip('issue #193875: incorrect indentation on enter', () => {

		// https://github.com/microsoft/vscode/issues/193875

		const model = createTextModel([
			'{',
			'    for(;;)',
			'    for(;;) {}',
			'}',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(3, 14, 3, 14));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'{',
				'    for(;;)',
				'    for(;;) {',
				'        ',
				'    }',
				'}',
			].join('\n'));
		});
	});

	test.skip('issue #67678: indent on typing curly brace', () => {

		// https://github.com/microsoft/vscode/issues/67678

		const model = createTextModel([
			'if (true) {',
			'console.log("a")',
			'console.log("b")',
			'',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(4, 1, 4, 1));
			viewModel.type('}', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'if (true) {',
				'    console.log("a")',
				'    console.log("b")',
				'}',
			].join('\n'));
		});
	});

	test.skip('issue #46401: outdent when encountering bracket on line - allman style indentation', () => {

		// https://github.com/microsoft/vscode/issues/46401

		const model = createTextModel([
			'if (true)',
			'    ',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(2, 5, 2, 5));
			viewModel.type('{}', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'if (true)',
				'{}',
			].join('\n'));
			editor.setSelection(new Selection(2, 2, 2, 2));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'if (true)',
				'{',
				'    ',
				'}'
			].join('\n'));
		});
	});

	test.skip('issue #125261: typing closing brace does not keep the current indentation', () => {

		// https://github.com/microsoft/vscode/issues/125261

		const model = createTextModel([
			'foo {',
			'    ',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'keep', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(2, 5, 2, 5));
			viewModel.type('}', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'foo {',
				'}',
			].join('\n'));
		});
	});
});

suite('Auto Indent On Type - Ruby', () => {

	const languageId = Language.Ruby;
	let disposables: DisposableStore;
	let serviceCollection: ServiceCollection;

	setup(() => {
		disposables = new DisposableStore();
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		disposables.add(languageService);
		disposables.add(languageConfigurationService);
		disposables.add(registerLanguage(languageService, languageId));
		disposables.add(registerLanguageConfiguration(languageConfigurationService, languageId));
		serviceCollection = new ServiceCollection(
			[ILanguageService, languageService],
			[ILanguageConfigurationService, languageConfigurationService]
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #198350: in or when incorrectly match non keywords for Ruby', () => {

		// https://github.com/microsoft/vscode/issues/198350

		const model = createTextModel('', languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			viewModel.type('def foo\n        i');
			viewModel.type('n', 'keyboard');
			assert.strictEqual(model.getValue(), 'def foo\n        in');
			viewModel.type(' ', 'keyboard');
			assert.strictEqual(model.getValue(), 'def foo\nin ');

			viewModel.model.setValue('');
			viewModel.type('  # in');
			assert.strictEqual(model.getValue(), '  # in');
			viewModel.type(' ', 'keyboard');
			assert.strictEqual(model.getValue(), '  # in ');
		});
	});

	// Failing tests...

	test.skip('issue #199846: in or when incorrectly match non keywords for Ruby', () => {

		// https://github.com/microsoft/vscode/issues/199846
		// explanation: happening because the # is detected probably as a comment

		const model = createTextModel('', languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			viewModel.type(`method('#foo') do`);
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				`method('#foo') do`,
				'    '
			].join('\n'));
		});
	});
});

suite('Auto Indent On Type - PHP', () => {

	const languageId = Language.PHP;
	let disposables: DisposableStore;
	let serviceCollection: ServiceCollection;

	setup(() => {
		disposables = new DisposableStore();
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		disposables.add(languageService);
		disposables.add(languageConfigurationService);
		disposables.add(registerLanguage(languageService, languageId));
		disposables.add(registerLanguageConfiguration(languageConfigurationService, languageId));
		serviceCollection = new ServiceCollection(
			[ILanguageService, languageService],
			[ILanguageConfigurationService, languageConfigurationService]
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #199050: should not indent after { detected in a string', () => {

		// https://github.com/microsoft/vscode/issues/199050

		const model = createTextModel(`preg_replace('{');`, languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			const tokens: StandardTokenTypeData[][] = [
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other },
					{ startIndex: 13, standardTokenType: StandardTokenType.String },
					{ startIndex: 16, standardTokenType: StandardTokenType.Other },
				]
			];
			disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));
			editor.setSelection(new Selection(1, 54, 1, 54));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				`preg_replace('{');`,
				''
			].join('\n'));
		});
	});
});

suite('Auto Indent On Paste - Go', () => {

	const languageId = Language.Go;
	let disposables: DisposableStore;
	let serviceCollection: ServiceCollection;

	setup(() => {
		disposables = new DisposableStore();
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		disposables.add(languageService);
		disposables.add(languageConfigurationService);
		disposables.add(registerLanguage(languageService, languageId));
		disposables.add(registerLanguageConfiguration(languageConfigurationService, languageId));
		serviceCollection = new ServiceCollection(
			[ILanguageService, languageService],
			[ILanguageConfigurationService, languageConfigurationService]
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('temp issue because there should be at least one passing test in a suite', () => {
		assert.ok(true);
	});

	test.skip('issue #199050: should not indent after { detected in a string', () => {

		// https://github.com/microsoft/vscode/issues/199050

		const model = createTextModel([
			'var s = `',
			'quick  brown',
			'fox',
			'`',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(3, 1, 3, 1));
			const text = '  ';
			const autoIndentOnPasteController = editor.registerAndInstantiateContribution(AutoIndentOnPaste.ID, AutoIndentOnPaste);
			viewModel.paste(text, true, undefined, 'keyboard');
			autoIndentOnPasteController.trigger(new Range(3, 1, 3, 3));
			assert.strictEqual(model.getValue(), [
				'var s = `',
				'quick  brown',
				'  fox',
				'`',
			].join('\n'));
		});
	});
});

suite('Auto Indent On Type - CPP', () => {

	const languageId = Language.CPP;
	let disposables: DisposableStore;
	let serviceCollection: ServiceCollection;

	setup(() => {
		disposables = new DisposableStore();
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		disposables.add(languageService);
		disposables.add(languageConfigurationService);
		disposables.add(registerLanguage(languageService, languageId));
		disposables.add(registerLanguageConfiguration(languageConfigurationService, languageId));
		serviceCollection = new ServiceCollection(
			[ILanguageService, languageService],
			[ILanguageConfigurationService, languageConfigurationService]
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('temp issue because there should be at least one passing test in a suite', () => {
		assert.ok(true);
	});

	test.skip('issue #178334: incorrect outdent of } when signature spans multiple lines', () => {

		// https://github.com/microsoft/vscode/issues/178334

		const model = createTextModel([
			'int WINAPI WinMain(bool instance,',
			'    int nshowcmd) {}',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(2, 20, 2, 20));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'int WINAPI WinMain(bool instance,',
				'    int nshowcmd) {',
				'    ',
				'}'
			].join('\n'));
		});
	});

	test.skip('issue #118929: incorrect indent when // follows curly brace', () => {

		// https://github.com/microsoft/vscode/issues/118929

		const model = createTextModel([
			'if (true) { // jaja',
			'}',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(1, 20, 1, 20));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'if (true) { // jaja',
				'    ',
				'}',
			].join('\n'));
		});
	});

	test.skip('issue #111265: auto indentation set to "none" still changes the indentation', () => {

		// https://github.com/microsoft/vscode/issues/111265

		const model = createTextModel([
			'int func() {',
			'		',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'none', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(2, 3, 2, 3));
			viewModel.type('}', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'int func() {',
				'		}',
			].join('\n'));
		});
	});

});

suite('Auto Indent On Type - HTML', () => {

	const languageId = Language.HTML;
	let disposables: DisposableStore;
	let serviceCollection: ServiceCollection;

	setup(() => {
		disposables = new DisposableStore();
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		disposables.add(languageService);
		disposables.add(languageConfigurationService);
		disposables.add(registerLanguage(languageService, languageId));
		disposables.add(registerLanguageConfiguration(languageConfigurationService, languageId));
		serviceCollection = new ServiceCollection(
			[ILanguageService, languageService],
			[ILanguageConfigurationService, languageConfigurationService]
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('temp issue because there should be at least one passing test in a suite', () => {
		assert.ok(true);
	});

	test.skip('issue #61510: incorrect indentation after // in html file', () => {

		// https://github.com/microsoft/vscode/issues/178334

		const model = createTextModel([
			'<pre>',
			'  foo //I press <Enter> at the end of this line',
			'</pre>',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(2, 48, 2, 48));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'<pre>',
				'  foo //I press <Enter> at the end of this line',
				'  ',
				'</pre>',
			].join('\n'));
		});
	});
});

suite('Auto Indent On Type - Visual Basic', () => {

	const languageId = Language.VB;
	let disposables: DisposableStore;
	let serviceCollection: ServiceCollection;

	setup(() => {
		disposables = new DisposableStore();
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		disposables.add(languageService);
		disposables.add(languageConfigurationService);
		disposables.add(registerLanguage(languageService, languageId));
		disposables.add(registerLanguageConfiguration(languageConfigurationService, languageId));
		serviceCollection = new ServiceCollection(
			[ILanguageService, languageService],
			[ILanguageConfigurationService, languageConfigurationService]
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('temp issue because there should be at least one passing test in a suite', () => {
		assert.ok(true);
	});

	test.skip('issue #118932: no indentation in visual basic files', () => {

		// https://github.com/microsoft/vscode/issues/118932

		const model = createTextModel([
			'if True then',
			'    Some code',
			'    end i',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			editor.setSelection(new Selection(3, 10, 3, 10));
			viewModel.type('f', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'if True then',
				'    Some code',
				'end if',
			].join('\n'));
		});
	});
});


suite('Auto Indent On Type - Latex', () => {

	const languageId = Language.Latex;
	let disposables: DisposableStore;
	let serviceCollection: ServiceCollection;

	setup(() => {
		disposables = new DisposableStore();
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		disposables.add(languageService);
		disposables.add(languageConfigurationService);
		disposables.add(registerLanguage(languageService, languageId));
		disposables.add(registerLanguageConfiguration(languageConfigurationService, languageId));
		serviceCollection = new ServiceCollection(
			[ILanguageService, languageService],
			[ILanguageConfigurationService, languageConfigurationService]
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('temp issue because there should be at least one passing test in a suite', () => {
		assert.ok(true);
	});

	test.skip('issue #178075: no auto closing pair when indentation done', () => {

		// https://github.com/microsoft/vscode/issues/178075

		const model = createTextModel([
			'\\begin{theorem}',
			'    \\end',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(2, 9, 2, 9));
			viewModel.type('{', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'\\begin{theorem}',
				'\\end{}',
			].join('\n'));
		});
	});
});

suite('Auto Indent On Type - Lua', () => {

	const languageId = Language.Lua;
	let disposables: DisposableStore;
	let serviceCollection: ServiceCollection;

	setup(() => {
		disposables = new DisposableStore();
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		disposables.add(languageService);
		disposables.add(languageConfigurationService);
		disposables.add(registerLanguage(languageService, languageId));
		disposables.add(registerLanguageConfiguration(languageConfigurationService, languageId));
		serviceCollection = new ServiceCollection(
			[ILanguageService, languageService],
			[ILanguageConfigurationService, languageConfigurationService]
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('temp issue because there should be at least one passing test in a suite', () => {
		assert.ok(true);
	});

	test.skip('issue #178075: no auto closing pair when indentation done', () => {

		// https://github.com/microsoft/vscode/issues/178075

		const model = createTextModel([
			'print("asdf function asdf")',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel) => {
			editor.setSelection(new Selection(1, 28, 1, 28));
			viewModel.type('\n', 'keyboard');
			assert.strictEqual(model.getValue(), [
				'print("asdf function asdf")',
				''
			].join('\n'));
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/indentation/test/browser/indentationLineProcessor.test.ts]---
Location: vscode-main/src/vs/editor/contrib/indentation/test/browser/indentationLineProcessor.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { StandardTokenType } from '../../../../common/encodedTokenAttributes.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { IndentationContextProcessor, ProcessedIndentRulesSupport } from '../../../../common/languages/supports/indentationLineProcessor.js';
import { Language, registerLanguage, registerLanguageConfiguration, registerTokenizationSupport, StandardTokenTypeData } from './indentation.test.js';
import { withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { Range } from '../../../../common/core/range.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { LanguageService } from '../../../../common/services/languageService.js';
import { TestLanguageConfigurationService } from '../../../../test/common/modes/testLanguageConfigurationService.js';
import { ILanguageService } from '../../../../common/languages/language.js';

suite('Indentation Context Processor - TypeScript/JavaScript', () => {

	const languageId = Language.TypeScript;
	let disposables: DisposableStore;
	let serviceCollection: ServiceCollection;

	setup(() => {
		disposables = new DisposableStore();
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		disposables.add(languageService);
		disposables.add(languageConfigurationService);
		disposables.add(registerLanguage(languageService, languageId));
		disposables.add(registerLanguageConfiguration(languageConfigurationService, languageId));
		serviceCollection = new ServiceCollection(
			[ILanguageService, languageService],
			[ILanguageConfigurationService, languageConfigurationService]
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('brackets inside of string', () => {

		const model = createTextModel([
			'const someVar = "{some text}"',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			const tokens: StandardTokenTypeData[][] = [[
				{ startIndex: 0, standardTokenType: StandardTokenType.Other },
				{ startIndex: 16, standardTokenType: StandardTokenType.String },
				{ startIndex: 28, standardTokenType: StandardTokenType.String }
			]];
			disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));
			const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
			const indentationContextProcessor = new IndentationContextProcessor(model, languageConfigurationService);
			const processedContext = indentationContextProcessor.getProcessedTokenContextAroundRange(new Range(1, 23, 1, 23));
			assert.strictEqual(processedContext.beforeRangeProcessedTokens.getLineContent(), 'const someVar = "some');
			assert.strictEqual(processedContext.afterRangeProcessedTokens.getLineContent(), ' text"');
			assert.strictEqual(processedContext.previousLineProcessedTokens.getLineContent(), '');
		});
	});

	test('brackets inside of comment', () => {

		const model = createTextModel([
			'const someVar2 = /*(a])*/',
			'const someVar = /* [()] some other t{e}xt() */ "some text"',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			const tokens: StandardTokenTypeData[][] = [
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other },
					{ startIndex: 17, standardTokenType: StandardTokenType.Comment },
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other },
					{ startIndex: 16, standardTokenType: StandardTokenType.Comment },
					{ startIndex: 46, standardTokenType: StandardTokenType.Other },
					{ startIndex: 47, standardTokenType: StandardTokenType.String }
				]];
			disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));
			const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
			const indentationContextProcessor = new IndentationContextProcessor(model, languageConfigurationService);
			const processedContext = indentationContextProcessor.getProcessedTokenContextAroundRange(new Range(2, 29, 2, 35));
			assert.strictEqual(processedContext.beforeRangeProcessedTokens.getLineContent(), 'const someVar = /*  some');
			assert.strictEqual(processedContext.afterRangeProcessedTokens.getLineContent(), ' text */ "some text"');
			assert.strictEqual(processedContext.previousLineProcessedTokens.getLineContent(), 'const someVar2 = /*a*/');
		});
	});

	test('brackets inside of regex', () => {

		const model = createTextModel([
			'const someRegex2 = /(()))]/;',
			'const someRegex = /()a{h}{s}[(a}87(9a9()))]/;',
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			const tokens: StandardTokenTypeData[][] = [
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other },
					{ startIndex: 19, standardTokenType: StandardTokenType.RegEx },
					{ startIndex: 27, standardTokenType: StandardTokenType.Other },
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other },
					{ startIndex: 18, standardTokenType: StandardTokenType.RegEx },
					{ startIndex: 44, standardTokenType: StandardTokenType.Other },
				]
			];
			disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));
			const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
			const indentationContextProcessor = new IndentationContextProcessor(model, languageConfigurationService);
			const processedContext = indentationContextProcessor.getProcessedTokenContextAroundRange(new Range(1, 25, 2, 33));
			assert.strictEqual(processedContext.beforeRangeProcessedTokens.getLineContent(), 'const someRegex2 = /');
			assert.strictEqual(processedContext.afterRangeProcessedTokens.getLineContent(), '879a9/;');
			assert.strictEqual(processedContext.previousLineProcessedTokens.getLineContent(), '');
		});
	});
});

suite('Processed Indent Rules Support - TypeScript/JavaScript', () => {

	const languageId = Language.TypeScript;
	let disposables: DisposableStore;
	let serviceCollection: ServiceCollection;

	setup(() => {
		disposables = new DisposableStore();
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		disposables.add(languageService);
		disposables.add(languageConfigurationService);
		disposables.add(registerLanguage(languageService, languageId));
		disposables.add(registerLanguageConfiguration(languageConfigurationService, languageId));
		serviceCollection = new ServiceCollection(
			[ILanguageService, languageService],
			[ILanguageConfigurationService, languageConfigurationService]
		);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('should increase', () => {

		const model = createTextModel([
			'const someVar = {',
			'const someVar2 = "{"',
			'const someVar3 = /*{*/'
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			const tokens: StandardTokenTypeData[][] = [
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other }
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other },
					{ startIndex: 17, standardTokenType: StandardTokenType.String },
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other },
					{ startIndex: 17, standardTokenType: StandardTokenType.Comment },
				]
			];
			disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));
			const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
			const indentationRulesSupport = languageConfigurationService.getLanguageConfiguration(languageId).indentRulesSupport;
			if (!indentationRulesSupport) {
				assert.fail('indentationRulesSupport should be defined');
			}
			const processedIndentRulesSupport = new ProcessedIndentRulesSupport(model, indentationRulesSupport, languageConfigurationService);
			assert.strictEqual(processedIndentRulesSupport.shouldIncrease(1), true);
			assert.strictEqual(processedIndentRulesSupport.shouldIncrease(2), false);
			assert.strictEqual(processedIndentRulesSupport.shouldIncrease(3), false);
		});
	});

	test('should decrease', () => {

		const model = createTextModel([
			'}',
			'"])some text}"',
			'])*/'
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			const tokens: StandardTokenTypeData[][] = [
				[{ startIndex: 0, standardTokenType: StandardTokenType.Other }],
				[{ startIndex: 0, standardTokenType: StandardTokenType.String }],
				[{ startIndex: 0, standardTokenType: StandardTokenType.Comment }]
			];
			disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));
			const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
			const indentationRulesSupport = languageConfigurationService.getLanguageConfiguration(languageId).indentRulesSupport;
			if (!indentationRulesSupport) {
				assert.fail('indentationRulesSupport should be defined');
			}
			const processedIndentRulesSupport = new ProcessedIndentRulesSupport(model, indentationRulesSupport, languageConfigurationService);
			assert.strictEqual(processedIndentRulesSupport.shouldDecrease(1), true);
			assert.strictEqual(processedIndentRulesSupport.shouldDecrease(2), false);
			assert.strictEqual(processedIndentRulesSupport.shouldDecrease(3), false);
		});
	});

	test('should increase next line', () => {

		const model = createTextModel([
			'if()',
			'const someString = "if()"',
			'const someRegex = /if()/'
		].join('\n'), languageId, {});
		disposables.add(model);

		withTestCodeEditor(model, { autoIndent: 'full', serviceCollection }, (editor, viewModel, instantiationService) => {
			const tokens: StandardTokenTypeData[][] = [
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other }
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other },
					{ startIndex: 19, standardTokenType: StandardTokenType.String }
				],
				[
					{ startIndex: 0, standardTokenType: StandardTokenType.Other },
					{ startIndex: 18, standardTokenType: StandardTokenType.RegEx }
				]
			];
			disposables.add(registerTokenizationSupport(instantiationService, tokens, languageId));
			const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
			const indentationRulesSupport = languageConfigurationService.getLanguageConfiguration(languageId).indentRulesSupport;
			if (!indentationRulesSupport) {
				assert.fail('indentationRulesSupport should be defined');
			}
			const processedIndentRulesSupport = new ProcessedIndentRulesSupport(model, indentationRulesSupport, languageConfigurationService);
			assert.strictEqual(processedIndentRulesSupport.shouldIndentNextLine(1), true);
			assert.strictEqual(processedIndentRulesSupport.shouldIndentNextLine(2), false);
			assert.strictEqual(processedIndentRulesSupport.shouldIndentNextLine(3), false);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlayHints/browser/inlayHints.ts]---
Location: vscode-main/src/vs/editor/contrib/inlayHints/browser/inlayHints.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { CancellationError, onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { InlayHint, InlayHintList, InlayHintsProvider, Command } from '../../../common/languages.js';
import { ITextModel } from '../../../common/model.js';
import { createCommandUri } from '../../../../base/common/htmlContent.js';

export class InlayHintAnchor {
	constructor(readonly range: Range, readonly direction: 'before' | 'after') { }
}

export class InlayHintItem {

	private _isResolved: boolean = false;
	private _currentResolve?: Promise<void>;

	constructor(readonly hint: InlayHint, readonly anchor: InlayHintAnchor, readonly provider: InlayHintsProvider) { }

	with(delta: { anchor: InlayHintAnchor }): InlayHintItem {
		const result = new InlayHintItem(this.hint, delta.anchor, this.provider);
		result._isResolved = this._isResolved;
		result._currentResolve = this._currentResolve;
		return result;
	}

	async resolve(token: CancellationToken): Promise<void> {
		if (typeof this.provider.resolveInlayHint !== 'function') {
			return;
		}
		if (this._currentResolve) {
			// wait for an active resolve operation and try again
			// when that's done.
			await this._currentResolve;
			if (token.isCancellationRequested) {
				return;
			}
			return this.resolve(token);
		}
		if (!this._isResolved) {
			this._currentResolve = this._doResolve(token)
				.finally(() => this._currentResolve = undefined);
		}
		await this._currentResolve;
	}

	private async _doResolve(token: CancellationToken) {
		try {
			const newHint = await Promise.resolve(this.provider.resolveInlayHint!(this.hint, token));
			this.hint.tooltip = newHint?.tooltip ?? this.hint.tooltip;
			this.hint.label = newHint?.label ?? this.hint.label;
			this.hint.textEdits = newHint?.textEdits ?? this.hint.textEdits;
			this._isResolved = true;
		} catch (err) {
			onUnexpectedExternalError(err);
			this._isResolved = false;
		}
	}
}

export class InlayHintsFragments {

	private static _emptyInlayHintList: InlayHintList = Object.freeze({ dispose() { }, hints: [] });

	static async create(registry: LanguageFeatureRegistry<InlayHintsProvider>, model: ITextModel, ranges: Range[], token: CancellationToken): Promise<InlayHintsFragments> {

		const data: [InlayHintList, InlayHintsProvider][] = [];

		const promises = registry.ordered(model).reverse().map(provider => ranges.map(async range => {
			try {
				const result = await provider.provideInlayHints(model, range, token);
				if (result?.hints.length || provider.onDidChangeInlayHints) {
					data.push([result ?? InlayHintsFragments._emptyInlayHintList, provider]);
				}
			} catch (err) {
				onUnexpectedExternalError(err);
			}
		}));

		await Promise.all(promises.flat());

		if (token.isCancellationRequested || model.isDisposed()) {
			throw new CancellationError();
		}

		return new InlayHintsFragments(ranges, data, model);
	}

	private readonly _disposables = new DisposableStore();

	readonly items: readonly InlayHintItem[];
	readonly ranges: readonly Range[];
	readonly provider: Set<InlayHintsProvider>;

	private constructor(ranges: Range[], data: [InlayHintList, InlayHintsProvider][], model: ITextModel) {
		this.ranges = ranges;
		this.provider = new Set();
		const items: InlayHintItem[] = [];
		for (const [list, provider] of data) {
			this._disposables.add(list);
			this.provider.add(provider);

			for (const hint of list.hints) {
				// compute the range to which the item should be attached to
				const position = model.validatePosition(hint.position);
				let direction: 'before' | 'after' = 'before';

				const wordRange = InlayHintsFragments._getRangeAtPosition(model, position);
				let range: Range;

				if (wordRange.getStartPosition().isBefore(position)) {
					range = Range.fromPositions(wordRange.getStartPosition(), position);
					direction = 'after';
				} else {
					range = Range.fromPositions(position, wordRange.getEndPosition());
					direction = 'before';
				}

				items.push(new InlayHintItem(hint, new InlayHintAnchor(range, direction), provider));
			}
		}
		this.items = items.sort((a, b) => Position.compare(a.hint.position, b.hint.position));
	}

	dispose(): void {
		this._disposables.dispose();
	}

	private static _getRangeAtPosition(model: ITextModel, position: IPosition): Range {
		const line = position.lineNumber;
		const word = model.getWordAtPosition(position);
		if (word) {
			// always prefer the word range
			return new Range(line, word.startColumn, line, word.endColumn);
		}

		model.tokenization.tokenizeIfCheap(line);
		const tokens = model.tokenization.getLineTokens(line);
		const offset = position.column - 1;
		const idx = tokens.findTokenIndexAtOffset(offset);

		let start = tokens.getStartOffset(idx);
		let end = tokens.getEndOffset(idx);

		if (end - start === 1) {
			// single character token, when at its end try leading/trailing token instead
			if (start === offset && idx > 1) {
				// leading token
				start = tokens.getStartOffset(idx - 1);
				end = tokens.getEndOffset(idx - 1);
			} else if (end === offset && idx < tokens.getCount() - 1) {
				// trailing token
				start = tokens.getStartOffset(idx + 1);
				end = tokens.getEndOffset(idx + 1);
			}
		}

		return new Range(line, start + 1, line, end + 1);
	}
}

export function asCommandLink(command: Command): string {
	return createCommandUri(command.id, ...(command.arguments ?? [])).toString();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlayHints/browser/inlayHintsContribution.ts]---
Location: vscode-main/src/vs/editor/contrib/inlayHints/browser/inlayHintsContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorContributionInstantiation, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { HoverParticipantRegistry } from '../../hover/browser/hoverTypes.js';
import { InlayHintsController } from './inlayHintsController.js';
import { InlayHintsHover } from './inlayHintsHover.js';

registerEditorContribution(InlayHintsController.ID, InlayHintsController, EditorContributionInstantiation.AfterFirstRender);
HoverParticipantRegistry.register(InlayHintsHover);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlayHints/browser/inlayHintsController.ts]---
Location: vscode-main/src/vs/editor/contrib/inlayHints/browser/inlayHintsController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isHTMLElement, ModifierKeyEmitter } from '../../../../base/browser/dom.js';
import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { disposableTimeout, RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { DisposableStore, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { LRUCache } from '../../../../base/common/map.js';
import { IRange } from '../../../../base/common/range.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { IActiveCodeEditor, ICodeEditor, IEditorMouseEvent, MouseTargetType } from '../../../browser/editorBrowser.js';
import { ClassNameReference, CssProperties, DynamicCssRules } from '../../../browser/editorDom.js';
import { StableEditorScrollState } from '../../../browser/stableEditorScroll.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { EDITOR_FONT_DEFAULTS } from '../../../common/config/fontInfo.js';
import { EditOperation } from '../../../common/core/editOperation.js';
import { Range } from '../../../common/core/range.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import * as languages from '../../../common/languages.js';
import { IModelDeltaDecoration, InjectedTextCursorStops, InjectedTextOptions, ITextModel, TrackedRangeStickiness } from '../../../common/model.js';
import { ModelDecorationInjectedTextOptions } from '../../../common/model/textModel.js';
import { IFeatureDebounceInformation, ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { ITextModelService } from '../../../common/services/resolverService.js';
import { ClickLinkGesture, ClickLinkMouseEvent } from '../../gotoSymbol/browser/link/clickLinkGesture.js';
import { InlayHintAnchor, InlayHintItem, InlayHintsFragments } from './inlayHints.js';
import { goToDefinitionWithLocation, showGoToContextMenu } from './inlayHintsLocations.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import * as colors from '../../../../platform/theme/common/colorRegistry.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { Position } from '../../../common/core/position.js';

// --- hint caching service (per session)

class InlayHintsCache {

	declare readonly _serviceBrand: undefined;

	private readonly _entries = new LRUCache<string, InlayHintItem[]>(50);

	get(model: ITextModel): InlayHintItem[] | undefined {
		const key = InlayHintsCache._key(model);
		return this._entries.get(key);
	}

	set(model: ITextModel, value: InlayHintItem[]): void {
		const key = InlayHintsCache._key(model);
		this._entries.set(key, value);
	}

	private static _key(model: ITextModel): string {
		return `${model.uri.toString()}/${model.getVersionId()}`;
	}
}

interface IInlayHintsCache extends InlayHintsCache { }
const IInlayHintsCache = createDecorator<IInlayHintsCache>('IInlayHintsCache');
registerSingleton(IInlayHintsCache, InlayHintsCache, InstantiationType.Delayed);

// --- rendered label

export class RenderedInlayHintLabelPart {
	constructor(readonly item: InlayHintItem, readonly index: number) { }

	get part() {
		const label = this.item.hint.label;
		if (typeof label === 'string') {
			return { label };
		} else {
			return label[this.index];
		}
	}
}

class ActiveInlayHintInfo {
	constructor(readonly part: RenderedInlayHintLabelPart, readonly hasTriggerModifier: boolean) { }
}

type InlayHintDecorationRenderInfo = {
	item: InlayHintItem;
	decoration: IModelDeltaDecoration;
	classNameRef: ClassNameReference;
};

const enum RenderMode {
	Normal,
	Invisible
}



/**
 *  Mix of CancellationTokenSource, DisposableStore and MutableDisposable
 */
class CancellationStore implements IDisposable {

	private readonly _store = new MutableDisposable<DisposableStore>();
	private _tokenSource = new CancellationTokenSource();

	dispose() {
		this._store.dispose();
		this._tokenSource.dispose(true);
	}

	reset() {
		this._tokenSource.dispose(true);
		this._tokenSource = new CancellationTokenSource();
		this._store.value = new DisposableStore();

		return {
			store: this._store.value,
			token: this._tokenSource.token
		};
	}
}


// --- controller


export class InlayHintsController implements IEditorContribution {

	static readonly ID: string = 'editor.contrib.InlayHints';

	private static readonly _MAX_DECORATORS = 1500;
	private static readonly _whitespaceData = {};

	static get(editor: ICodeEditor): InlayHintsController | undefined {
		return editor.getContribution<InlayHintsController>(InlayHintsController.ID) ?? undefined;
	}

	private readonly _disposables = new DisposableStore();
	private readonly _sessionDisposables = new DisposableStore();
	private readonly _decorationsMetadata = new Map<string, InlayHintDecorationRenderInfo>();
	private readonly _debounceInfo: IFeatureDebounceInformation;
	private readonly _ruleFactory: DynamicCssRules;

	private _cursorInfo?: { position: Position; notEarlierThan: number };
	private _activeRenderMode = RenderMode.Normal;
	private _activeInlayHintPart?: ActiveInlayHintInfo;

	constructor(
		private readonly _editor: ICodeEditor,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@ILanguageFeatureDebounceService _featureDebounce: ILanguageFeatureDebounceService,
		@IInlayHintsCache private readonly _inlayHintsCache: IInlayHintsCache,
		@ICommandService private readonly _commandService: ICommandService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IInstantiationService private readonly _instaService: IInstantiationService,
	) {
		this._ruleFactory = this._disposables.add(new DynamicCssRules(this._editor));
		this._debounceInfo = _featureDebounce.for(_languageFeaturesService.inlayHintsProvider, 'InlayHint', { min: 25 });
		this._disposables.add(_languageFeaturesService.inlayHintsProvider.onDidChange(() => this._update()));
		this._disposables.add(_editor.onDidChangeModel(() => this._update()));
		this._disposables.add(_editor.onDidChangeModelLanguage(() => this._update()));
		this._disposables.add(_editor.onDidChangeConfiguration(e => {
			if (e.hasChanged(EditorOption.inlayHints)) {
				this._update();
			}
		}));
		this._update();

	}

	dispose(): void {
		this._sessionDisposables.dispose();
		this._removeAllDecorations();
		this._disposables.dispose();
	}

	private _update(): void {
		this._sessionDisposables.clear();
		this._removeAllDecorations();

		const options = this._editor.getOption(EditorOption.inlayHints);
		if (options.enabled === 'off') {
			return;
		}

		const model = this._editor.getModel();
		if (!model || !this._languageFeaturesService.inlayHintsProvider.has(model)) {
			return;
		}

		if (options.enabled === 'on') {
			// different "on" modes: always
			this._activeRenderMode = RenderMode.Normal;
		} else {
			// different "on" modes: offUnlessPressed, or onUnlessPressed
			let defaultMode: RenderMode;
			let altMode: RenderMode;
			if (options.enabled === 'onUnlessPressed') {
				defaultMode = RenderMode.Normal;
				altMode = RenderMode.Invisible;
			} else {
				defaultMode = RenderMode.Invisible;
				altMode = RenderMode.Normal;
			}
			this._activeRenderMode = defaultMode;

			this._sessionDisposables.add(ModifierKeyEmitter.getInstance().event(e => {
				if (!this._editor.hasModel()) {
					return;
				}
				const newRenderMode = e.altKey && e.ctrlKey && !(e.shiftKey || e.metaKey) ? altMode : defaultMode;
				if (newRenderMode !== this._activeRenderMode) {
					this._activeRenderMode = newRenderMode;
					const model = this._editor.getModel();
					const copies = this._copyInlayHintsWithCurrentAnchor(model);
					this._updateHintsDecorators([model.getFullModelRange()], copies);
					scheduler.schedule(0);
				}
			}));
		}

		// iff possible, quickly update from cache
		const cached = this._inlayHintsCache.get(model);
		if (cached) {
			this._updateHintsDecorators([model.getFullModelRange()], cached);
		}
		this._sessionDisposables.add(toDisposable(() => {
			// cache items when switching files etc
			if (!model.isDisposed()) {
				this._cacheHintsForFastRestore(model);
			}
		}));

		let cts: CancellationTokenSource | undefined;
		const watchedProviders = new Set<languages.InlayHintsProvider>();

		this._sessionDisposables.add(model.onWillDispose(() => cts?.cancel()));

		const cancellationStore = this._sessionDisposables.add(new CancellationStore());

		const scheduler = new RunOnceScheduler(async () => {
			const t1 = Date.now();

			const { store, token } = cancellationStore.reset();

			try {
				const inlayHints = await InlayHintsFragments.create(this._languageFeaturesService.inlayHintsProvider, model, this._getHintsRanges(), token);
				scheduler.delay = this._debounceInfo.update(model, Date.now() - t1);
				if (token.isCancellationRequested) {
					inlayHints.dispose();
					return;
				}

				// listen to provider changes
				for (const provider of inlayHints.provider) {
					if (typeof provider.onDidChangeInlayHints === 'function' && !watchedProviders.has(provider)) {
						watchedProviders.add(provider);
						store.add(provider.onDidChangeInlayHints(() => {
							if (!scheduler.isScheduled()) { // ignore event when request is already scheduled
								scheduler.schedule();
							}
						}));
					}
				}

				store.add(inlayHints);
				store.add(toDisposable(() => watchedProviders.clear()));
				this._updateHintsDecorators(inlayHints.ranges, inlayHints.items);
				this._cacheHintsForFastRestore(model);

			} catch (err) {
				onUnexpectedError(err);
			}
		}, this._debounceInfo.get(model));

		this._sessionDisposables.add(scheduler);
		scheduler.schedule(0);

		this._sessionDisposables.add(this._editor.onDidScrollChange((e) => {
			// update when scroll position changes
			// uses scrollTopChanged has weak heuristic to differenatiate between scrolling due to
			// typing or due to "actual" scrolling
			if (e.scrollTopChanged || !scheduler.isScheduled()) {
				scheduler.schedule();
			}
		}));

		const cursor = this._sessionDisposables.add(new MutableDisposable());
		this._sessionDisposables.add(this._editor.onDidChangeModelContent((e) => {
			cts?.cancel();

			// mark current cursor position and time after which the whole can be updated/redrawn
			const delay = Math.max(scheduler.delay, 800);
			this._cursorInfo = { position: this._editor.getPosition()!, notEarlierThan: Date.now() + delay };
			cursor.value = disposableTimeout(() => scheduler.schedule(0), delay);

			scheduler.schedule();
		}));

		this._sessionDisposables.add(this._editor.onDidChangeConfiguration(e => {
			if (e.hasChanged(EditorOption.inlayHints)) {
				scheduler.schedule();
			}
		}));

		// mouse gestures
		this._sessionDisposables.add(this._installDblClickGesture(() => scheduler.schedule(0)));
		this._sessionDisposables.add(this._installLinkGesture());
		this._sessionDisposables.add(this._installContextMenu());
	}

	private _installLinkGesture(): IDisposable {

		const store = new DisposableStore();
		const gesture = store.add(new ClickLinkGesture(this._editor));

		// let removeHighlight = () => { };

		const sessionStore = new DisposableStore();
		store.add(sessionStore);

		store.add(gesture.onMouseMoveOrRelevantKeyDown(e => {
			const [mouseEvent] = e;
			const labelPart = this._getInlayHintLabelPart(mouseEvent);
			const model = this._editor.getModel();

			if (!labelPart || !model) {
				sessionStore.clear();
				return;
			}

			// resolve the item
			const cts = new CancellationTokenSource();
			sessionStore.add(toDisposable(() => cts.dispose(true)));
			labelPart.item.resolve(cts.token);

			// render link => when the modifier is pressed and when there is a command or location
			this._activeInlayHintPart = labelPart.part.command || labelPart.part.location
				? new ActiveInlayHintInfo(labelPart, mouseEvent.hasTriggerModifier)
				: undefined;

			const lineNumber = model.validatePosition(labelPart.item.hint.position).lineNumber;
			const range = new Range(lineNumber, 1, lineNumber, model.getLineMaxColumn(lineNumber));
			const lineHints = this._getInlineHintsForRange(range);
			this._updateHintsDecorators([range], lineHints);
			sessionStore.add(toDisposable(() => {
				this._activeInlayHintPart = undefined;
				this._updateHintsDecorators([range], lineHints);
			}));
		}));
		store.add(gesture.onCancel(() => sessionStore.clear()));
		store.add(gesture.onExecute(async e => {
			const label = this._getInlayHintLabelPart(e);
			if (label) {
				const part = label.part;
				if (part.location) {
					// location -> execute go to def
					this._instaService.invokeFunction(goToDefinitionWithLocation, e, this._editor as IActiveCodeEditor, part.location);
				} else if (languages.Command.is(part.command)) {
					// command -> execute it
					await this._invokeCommand(part.command, label.item);
				}
			}
		}));
		return store;
	}

	private _getInlineHintsForRange(range: Range) {
		const lineHints = new Set<InlayHintItem>();
		for (const data of this._decorationsMetadata.values()) {
			if (range.containsRange(data.item.anchor.range)) {
				lineHints.add(data.item);
			}
		}
		return Array.from(lineHints);
	}

	private _installDblClickGesture(updateInlayHints: Function): IDisposable {
		return this._editor.onMouseUp(async e => {
			if (e.event.detail !== 2) {
				return;
			}
			const part = this._getInlayHintLabelPart(e);
			if (!part) {
				return;
			}
			e.event.preventDefault();
			await part.item.resolve(CancellationToken.None);
			if (isNonEmptyArray(part.item.hint.textEdits)) {
				const edits = part.item.hint.textEdits.map(edit => EditOperation.replace(Range.lift(edit.range), edit.text));
				this._editor.executeEdits('inlayHint.default', edits);
				updateInlayHints();
			}
		});
	}

	private _installContextMenu(): IDisposable {
		return this._editor.onContextMenu(async e => {
			if (!(isHTMLElement(e.event.target))) {
				return;
			}
			const part = this._getInlayHintLabelPart(e);
			if (part) {
				await this._instaService.invokeFunction(showGoToContextMenu, this._editor, e.event.target, part);
			}
		});
	}

	private _getInlayHintLabelPart(e: IEditorMouseEvent | ClickLinkMouseEvent): RenderedInlayHintLabelPart | undefined {
		if (e.target.type !== MouseTargetType.CONTENT_TEXT) {
			return undefined;
		}
		const options = e.target.detail.injectedText?.options;
		if (options instanceof ModelDecorationInjectedTextOptions && options?.attachedData instanceof RenderedInlayHintLabelPart) {
			return options.attachedData;
		}
		return undefined;
	}

	private async _invokeCommand(command: languages.Command, item: InlayHintItem) {
		try {
			await this._commandService.executeCommand(command.id, ...(command.arguments ?? []));
		} catch (err) {
			this._notificationService.notify({
				severity: Severity.Error,
				source: item.provider.displayName,
				message: err
			});
		}
	}

	private _cacheHintsForFastRestore(model: ITextModel): void {
		const hints = this._copyInlayHintsWithCurrentAnchor(model);
		this._inlayHintsCache.set(model, hints);
	}

	// return inlay hints but with an anchor that reflects "updates"
	// that happened after receiving them, e.g adding new lines before a hint
	private _copyInlayHintsWithCurrentAnchor(model: ITextModel): InlayHintItem[] {
		const items = new Map<InlayHintItem, InlayHintItem>();
		for (const [id, obj] of this._decorationsMetadata) {
			if (items.has(obj.item)) {
				// an inlay item can be rendered as multiple decorations
				// but they will all uses the same range
				continue;
			}
			const range = model.getDecorationRange(id);
			if (range) {
				// update range with whatever the editor has tweaked it to
				const anchor = new InlayHintAnchor(range, obj.item.anchor.direction);
				const copy = obj.item.with({ anchor });
				items.set(obj.item, copy);
			}
		}
		return Array.from(items.values());
	}

	private _getHintsRanges(): Range[] {
		const extra = 30;
		const model = this._editor.getModel()!;
		const visibleRanges = this._editor.getVisibleRangesPlusViewportAboveBelow();
		const result: Range[] = [];
		for (const range of visibleRanges.sort(Range.compareRangesUsingStarts)) {
			const extendedRange = model.validateRange(new Range(range.startLineNumber - extra, range.startColumn, range.endLineNumber + extra, range.endColumn));
			if (result.length === 0 || !Range.areIntersectingOrTouching(result[result.length - 1], extendedRange)) {
				result.push(extendedRange);
			} else {
				result[result.length - 1] = Range.plusRange(result[result.length - 1], extendedRange);
			}
		}
		return result;
	}

	private _updateHintsDecorators(ranges: readonly Range[], items: readonly InlayHintItem[]): void {

		const itemFixedLengths = new Map<InlayHintItem, number>();

		if (this._cursorInfo
			&& this._cursorInfo.notEarlierThan > Date.now()
			&& ranges.some(range => range.containsPosition(this._cursorInfo!.position))
		) {
			// collect inlay hints that are on the same line and before the cursor. Those "old" hints
			// define fixed lengths so that the cursor does not jump back and worth while typing.
			const { position } = this._cursorInfo;
			this._cursorInfo = undefined;

			const lengths = new Map<InlayHintItem, number>();

			for (const deco of this._editor.getLineDecorations(position.lineNumber) ?? []) {

				const data = this._decorationsMetadata.get(deco.id);
				if (deco.range.startColumn > position.column) {
					continue;
				}
				const opts = data?.decoration.options[data.item.anchor.direction];
				if (opts && opts.attachedData !== InlayHintsController._whitespaceData) {
					const len = lengths.get(data.item) ?? 0;
					lengths.set(data.item, len + opts.content.length);
				}
			}


			// on the cursor line and before the cursor-column
			const newItemsWithFixedLength = items.filter(item => item.anchor.range.startLineNumber === position.lineNumber && item.anchor.range.endColumn <= position.column);
			const fixedLengths = Array.from(lengths.values());

			// match up fixed lengths with items and distribute the remaining lengths to the last item
			let lastItem: InlayHintItem | undefined;
			while (true) {
				const targetItem = newItemsWithFixedLength.shift();
				const fixedLength = fixedLengths.shift();

				if (!fixedLength && !targetItem) {
					break; // DONE
				}

				if (targetItem) {
					itemFixedLengths.set(targetItem, fixedLength ?? 0);
					lastItem = targetItem;

				} else if (lastItem && fixedLength) {
					// still lengths but no more item. give it all to the last
					let len = itemFixedLengths.get(lastItem)!;
					len += fixedLength;
					len += fixedLengths.reduce((p, c) => p + c, 0);
					fixedLengths.length = 0;
					break; // DONE
				}
			}
		}

		// utils to collect/create injected text decorations
		const newDecorationsData: InlayHintDecorationRenderInfo[] = [];
		const addInjectedText = (item: InlayHintItem, ref: ClassNameReference, content: string, cursorStops: InjectedTextCursorStops, attachedData?: RenderedInlayHintLabelPart | object): void => {
			const opts: InjectedTextOptions = {
				content,
				inlineClassNameAffectsLetterSpacing: true,
				inlineClassName: ref.className,
				cursorStops,
				attachedData
			};
			newDecorationsData.push({
				item,
				classNameRef: ref,
				decoration: {
					range: item.anchor.range,
					options: {
						// className: "rangeHighlight", // DEBUG highlight to see to what range a hint is attached
						description: 'InlayHint',
						showIfCollapsed: item.anchor.range.isEmpty(), // "original" range is empty
						collapseOnReplaceEdit: !item.anchor.range.isEmpty(),
						stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges,
						[item.anchor.direction]: this._activeRenderMode === RenderMode.Normal ? opts : undefined
					}
				}
			});
		};

		const addInjectedWhitespace = (item: InlayHintItem, isLast: boolean): void => {
			const marginRule = this._ruleFactory.createClassNameRef({
				width: `${(fontSize / 3) | 0}px`,
				display: 'inline-block'
			});
			addInjectedText(item, marginRule, '\u200a', isLast ? InjectedTextCursorStops.Right : InjectedTextCursorStops.None, InlayHintsController._whitespaceData);
		};


		//
		const { fontSize, fontFamily, padding, isUniform } = this._getLayoutInfo();
		const maxLength = this._editor.getOption(EditorOption.inlayHints).maximumLength;
		const fontFamilyVar = '--code-editorInlayHintsFontFamily';
		this._editor.getContainerDomNode().style.setProperty(fontFamilyVar, fontFamily);


		type ILineInfo = { line: number; totalLen: number };
		let currentLineInfo: ILineInfo = { line: 0, totalLen: 0 };

		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			if (currentLineInfo.line !== item.anchor.range.startLineNumber) {
				currentLineInfo = { line: item.anchor.range.startLineNumber, totalLen: 0 };
			}

			if (maxLength && currentLineInfo.totalLen > maxLength) {
				continue;
			}

			// whitespace leading the actual label
			if (item.hint.paddingLeft) {
				addInjectedWhitespace(item, false);
			}

			// the label with its parts
			const parts: languages.InlayHintLabelPart[] = typeof item.hint.label === 'string'
				? [{ label: item.hint.label }]
				: item.hint.label;

			const itemFixedLength = itemFixedLengths.get(item);
			let itemActualLength = 0;

			for (let i = 0; i < parts.length; i++) {
				const part = parts[i];

				const isFirst = i === 0;
				const isLast = i === parts.length - 1;

				const cssProperties: CssProperties = {
					fontSize: `${fontSize}px`,
					fontFamily: `var(${fontFamilyVar}), ${EDITOR_FONT_DEFAULTS.fontFamily}`,
					verticalAlign: isUniform ? 'baseline' : 'middle',
					unicodeBidi: 'isolate'
				};

				if (isNonEmptyArray(item.hint.textEdits)) {
					cssProperties.cursor = 'default';
				}

				this._fillInColors(cssProperties, item.hint);

				if ((part.command || part.location) && this._activeInlayHintPart?.part.item === item && this._activeInlayHintPart.part.index === i) {
					// active link!
					cssProperties.textDecoration = 'underline';
					if (this._activeInlayHintPart.hasTriggerModifier) {
						cssProperties.color = themeColorFromId(colors.editorActiveLinkForeground);
						cssProperties.cursor = 'pointer';
					}
				}

				let textlabel = part.label;
				currentLineInfo.totalLen += textlabel.length;
				let tooLong = false;
				const over = maxLength !== 0 ? (currentLineInfo.totalLen - maxLength) : 0;
				if (over > 0) {
					textlabel = textlabel.slice(0, -over) + '…';
					tooLong = true;
				}

				itemActualLength += textlabel.length;

				if (itemFixedLength !== undefined) {
					const overFixedLength = itemActualLength - itemFixedLength;
					if (overFixedLength >= 0) {
						// longer than fixed length, trim
						itemActualLength -= overFixedLength;
						textlabel = textlabel.slice(0, -(1 + overFixedLength)) + '…';
						tooLong = true;
					}
				}

				if (padding) {
					if (isFirst && (isLast || tooLong)) {
						// only element
						cssProperties.padding = `1px ${Math.max(1, fontSize / 4) | 0}px`;
						cssProperties.borderRadius = `${(fontSize / 4) | 0}px`;
					} else if (isFirst) {
						// first element
						cssProperties.padding = `1px 0 1px ${Math.max(1, fontSize / 4) | 0}px`;
						cssProperties.borderRadius = `${(fontSize / 4) | 0}px 0 0 ${(fontSize / 4) | 0}px`;
					} else if ((isLast || tooLong)) {
						// last element
						cssProperties.padding = `1px ${Math.max(1, fontSize / 4) | 0}px 1px 0`;
						cssProperties.borderRadius = `0 ${(fontSize / 4) | 0}px ${(fontSize / 4) | 0}px 0`;
					} else {
						cssProperties.padding = `1px 0 1px 0`;
					}
				}

				addInjectedText(
					item,
					this._ruleFactory.createClassNameRef(cssProperties),
					fixSpace(textlabel),
					isLast && !item.hint.paddingRight ? InjectedTextCursorStops.Right : InjectedTextCursorStops.None,
					new RenderedInlayHintLabelPart(item, i)
				);

				if (tooLong) {
					break;
				}
			}

			if (itemFixedLength !== undefined && itemActualLength < itemFixedLength) {
				// shorter than fixed length, pad
				const pad = (itemFixedLength - itemActualLength);
				addInjectedText(
					item,
					this._ruleFactory.createClassNameRef({}),
					'\u200a'.repeat(pad),
					InjectedTextCursorStops.None
				);
			}

			// whitespace trailing the actual label
			if (item.hint.paddingRight) {
				addInjectedWhitespace(item, true);
			}

			if (newDecorationsData.length > InlayHintsController._MAX_DECORATORS) {
				break;
			}
		}

		// collect all decoration ids that are affected by the ranges
		// and only update those decorations
		const decorationIdsToReplace: string[] = [];
		for (const [id, metadata] of this._decorationsMetadata) {
			const range = this._editor.getModel()?.getDecorationRange(id);
			if (range && ranges.some(r => r.containsRange(range))) {
				decorationIdsToReplace.push(id);
				metadata.classNameRef.dispose();
				this._decorationsMetadata.delete(id);
			}
		}

		const scrollState = StableEditorScrollState.capture(this._editor);

		this._editor.changeDecorations(accessor => {
			const newDecorationIds = accessor.deltaDecorations(decorationIdsToReplace, newDecorationsData.map(d => d.decoration));
			for (let i = 0; i < newDecorationIds.length; i++) {
				const data = newDecorationsData[i];
				this._decorationsMetadata.set(newDecorationIds[i], data);
			}
		});

		scrollState.restore(this._editor);
	}

	private _fillInColors(props: CssProperties, hint: languages.InlayHint): void {
		if (hint.kind === languages.InlayHintKind.Parameter) {
			props.backgroundColor = themeColorFromId(colors.editorInlayHintParameterBackground);
			props.color = themeColorFromId(colors.editorInlayHintParameterForeground);
		} else if (hint.kind === languages.InlayHintKind.Type) {
			props.backgroundColor = themeColorFromId(colors.editorInlayHintTypeBackground);
			props.color = themeColorFromId(colors.editorInlayHintTypeForeground);
		} else {
			props.backgroundColor = themeColorFromId(colors.editorInlayHintBackground);
			props.color = themeColorFromId(colors.editorInlayHintForeground);
		}
	}

	private _getLayoutInfo() {
		const options = this._editor.getOption(EditorOption.inlayHints);
		const padding = options.padding;

		const editorFontSize = this._editor.getOption(EditorOption.fontSize);
		const editorFontFamily = this._editor.getOption(EditorOption.fontFamily);

		let fontSize = options.fontSize;
		if (!fontSize || fontSize < 5 || fontSize > editorFontSize) {
			fontSize = editorFontSize;
		}

		const fontFamily = options.fontFamily || editorFontFamily;

		const isUniform = !padding
			&& fontFamily === editorFontFamily
			&& fontSize === editorFontSize;

		return { fontSize, fontFamily, padding, isUniform };
	}

	private _removeAllDecorations(): void {
		this._editor.removeDecorations(Array.from(this._decorationsMetadata.keys()));
		for (const obj of this._decorationsMetadata.values()) {
			obj.classNameRef.dispose();
		}
		this._decorationsMetadata.clear();
	}


	// --- accessibility

	getInlayHintsForLine(line: number): InlayHintItem[] {
		if (!this._editor.hasModel()) {
			return [];
		}
		const set = new Set<languages.InlayHint>();
		const result: InlayHintItem[] = [];
		for (const deco of this._editor.getLineDecorations(line)) {
			const data = this._decorationsMetadata.get(deco.id);
			if (data && !set.has(data.item.hint)) {
				set.add(data.item.hint);
				result.push(data.item);
			}
		}
		return result;
	}
}


// Prevents the view from potentially visible whitespace
function fixSpace(str: string): string {
	const noBreakWhitespace = '\xa0';
	return str.replace(/[ \t]/g, noBreakWhitespace);
}

CommandsRegistry.registerCommand('_executeInlayHintProvider', async (accessor, ...args: [URI, IRange]): Promise<languages.InlayHint[]> => {

	const [uri, range] = args;
	assertType(URI.isUri(uri));
	assertType(Range.isIRange(range));

	const { inlayHintsProvider } = accessor.get(ILanguageFeaturesService);
	const ref = await accessor.get(ITextModelService).createModelReference(uri);
	try {
		const model = await InlayHintsFragments.create(inlayHintsProvider, ref.object.textEditorModel, [Range.lift(range)], CancellationToken.None);
		const result = model.items.map(i => i.hint);
		setTimeout(() => model.dispose(), 0); // dispose after sending to ext host
		return result;
	} finally {
		ref.dispose();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlayHints/browser/inlayHintsHover.ts]---
Location: vscode-main/src/vs/editor/contrib/inlayHints/browser/inlayHintsHover.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AsyncIterableProducer } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IMarkdownString, isEmptyMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { ICodeEditor, IEditorMouseEvent, MouseTargetType } from '../../../browser/editorBrowser.js';
import { Position } from '../../../common/core/position.js';
import { IModelDecoration } from '../../../common/model.js';
import { ModelDecorationInjectedTextOptions } from '../../../common/model/textModel.js';
import { HoverAnchor, HoverForeignElementAnchor, IEditorHoverParticipant } from '../../hover/browser/hoverTypes.js';
import { ITextModelService } from '../../../common/services/resolverService.js';
import { getHoverProviderResultsAsAsyncIterable } from '../../hover/browser/getHover.js';
import { MarkdownHover, MarkdownHoverParticipant } from '../../hover/browser/markdownHoverParticipant.js';
import { RenderedInlayHintLabelPart, InlayHintsController } from './inlayHintsController.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { localize } from '../../../../nls.js';
import * as platform from '../../../../base/common/platform.js';
import { asCommandLink } from './inlayHints.js';
import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { HoverStartSource } from '../../hover/browser/hoverOperation.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';

class InlayHintsHoverAnchor extends HoverForeignElementAnchor {
	constructor(
		readonly part: RenderedInlayHintLabelPart,
		owner: InlayHintsHover,
		initialMousePosX: number | undefined,
		initialMousePosY: number | undefined
	) {
		super(10, owner, part.item.anchor.range, initialMousePosX, initialMousePosY, true);
	}
}

export class InlayHintsHover extends MarkdownHoverParticipant implements IEditorHoverParticipant<MarkdownHover> {

	public override readonly hoverOrdinal: number = 6;

	constructor(
		editor: ICodeEditor,
		@IMarkdownRendererService markdownRendererService: IMarkdownRendererService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IHoverService hoverService: IHoverService,
		@IConfigurationService configurationService: IConfigurationService,
		@ITextModelService private readonly _resolverService: ITextModelService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@ICommandService commandService: ICommandService,
	) {
		super(editor, markdownRendererService, configurationService, languageFeaturesService, keybindingService, hoverService, commandService);
	}

	suggestHoverAnchor(mouseEvent: IEditorMouseEvent): HoverAnchor | null {
		const controller = InlayHintsController.get(this._editor);
		if (!controller) {
			return null;
		}
		if (mouseEvent.target.type !== MouseTargetType.CONTENT_TEXT) {
			return null;
		}
		const options = mouseEvent.target.detail.injectedText?.options;
		if (!(options instanceof ModelDecorationInjectedTextOptions && options.attachedData instanceof RenderedInlayHintLabelPart)) {
			return null;
		}
		return new InlayHintsHoverAnchor(options.attachedData, this, mouseEvent.event.posx, mouseEvent.event.posy);
	}

	override computeSync(): MarkdownHover[] {
		return [];
	}

	override computeAsync(anchor: HoverAnchor, _lineDecorations: IModelDecoration[], source: HoverStartSource, token: CancellationToken): AsyncIterableProducer<MarkdownHover> {
		if (!(anchor instanceof InlayHintsHoverAnchor)) {
			return AsyncIterableProducer.EMPTY;
		}

		return new AsyncIterableProducer<MarkdownHover>(async executor => {

			const { part } = anchor;
			await part.item.resolve(token);

			if (token.isCancellationRequested) {
				return;
			}

			// (1) Inlay Tooltip
			let itemTooltip: IMarkdownString | undefined;
			if (typeof part.item.hint.tooltip === 'string') {
				itemTooltip = new MarkdownString().appendText(part.item.hint.tooltip);
			} else if (part.item.hint.tooltip) {
				itemTooltip = part.item.hint.tooltip;
			}
			if (itemTooltip) {
				executor.emitOne(new MarkdownHover(this, anchor.range, [itemTooltip], false, 0));
			}
			// (1.2) Inlay dbl-click gesture
			if (isNonEmptyArray(part.item.hint.textEdits)) {
				executor.emitOne(new MarkdownHover(this, anchor.range, [new MarkdownString().appendText(localize('hint.dbl', "Double-click to insert"))], false, 10001));
			}

			// (2) Inlay Label Part Tooltip
			let partTooltip: IMarkdownString | undefined;
			if (typeof part.part.tooltip === 'string') {
				partTooltip = new MarkdownString().appendText(part.part.tooltip);
			} else if (part.part.tooltip) {
				partTooltip = part.part.tooltip;
			}
			if (partTooltip) {
				executor.emitOne(new MarkdownHover(this, anchor.range, [partTooltip], false, 1));
			}

			// (2.2) Inlay Label Part Help Hover
			if (part.part.location || part.part.command) {
				let linkHint: MarkdownString | undefined;
				const useMetaKey = this._editor.getOption(EditorOption.multiCursorModifier) === 'altKey';
				const kb = useMetaKey
					? platform.isMacintosh
						? localize('links.navigate.kb.meta.mac', "cmd + click")
						: localize('links.navigate.kb.meta', "ctrl + click")
					: platform.isMacintosh
						? localize('links.navigate.kb.alt.mac', "option + click")
						: localize('links.navigate.kb.alt', "alt + click");

				if (part.part.location && part.part.command) {
					linkHint = new MarkdownString().appendText(localize('hint.defAndCommand', 'Go to Definition ({0}), right click for more', kb));
				} else if (part.part.location) {
					linkHint = new MarkdownString().appendText(localize('hint.def', 'Go to Definition ({0})', kb));
				} else if (part.part.command) {
					linkHint = new MarkdownString(`[${localize('hint.cmd', "Execute Command")}](${asCommandLink(part.part.command)} "${part.part.command.title}") (${kb})`, { isTrusted: true });
				}
				if (linkHint) {
					executor.emitOne(new MarkdownHover(this, anchor.range, [linkHint], false, 10000));
				}
			}


			// (3) Inlay Label Part Location tooltip
			const iterable = this._resolveInlayHintLabelPartHover(part, token);
			for await (const item of iterable) {
				executor.emitOne(item);
			}
		});
	}

	private async *_resolveInlayHintLabelPartHover(part: RenderedInlayHintLabelPart, token: CancellationToken): AsyncIterable<MarkdownHover> {
		if (!part.part.location) {
			return;
		}

		const { uri, range } = part.part.location;
		const ref = await this._resolverService.createModelReference(uri);
		try {
			const model = ref.object.textEditorModel;
			if (!this._languageFeaturesService.hoverProvider.has(model)) {
				return;
			}

			for await (const item of getHoverProviderResultsAsAsyncIterable(this._languageFeaturesService.hoverProvider, model, new Position(range.startLineNumber, range.startColumn), token)) {
				if (!isEmptyMarkdownString(item.hover.contents)) {
					yield new MarkdownHover(this, part.item.anchor.range, item.hover.contents, false, 2 + item.ordinal);
				}
			}
		} finally {
			ref.dispose();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlayHints/browser/inlayHintsLocations.ts]---
Location: vscode-main/src/vs/editor/contrib/inlayHints/browser/inlayHintsLocations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { Action, IAction, Separator } from '../../../../base/common/actions.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IActiveCodeEditor, ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import { Location } from '../../../common/languages.js';
import { ITextModelService } from '../../../common/services/resolverService.js';
import { DefinitionAction, SymbolNavigationAction, SymbolNavigationAnchor } from '../../gotoSymbol/browser/goToCommands.js';
import { ClickLinkMouseEvent } from '../../gotoSymbol/browser/link/clickLinkGesture.js';
import { RenderedInlayHintLabelPart } from './inlayHintsController.js';
import { PeekContext } from '../../peekView/browser/peekView.js';
import { isIMenuItem, MenuId, MenuItemAction, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';

export async function showGoToContextMenu(accessor: ServicesAccessor, editor: ICodeEditor, anchor: HTMLElement, part: RenderedInlayHintLabelPart) {

	const resolverService = accessor.get(ITextModelService);
	const contextMenuService = accessor.get(IContextMenuService);
	const commandService = accessor.get(ICommandService);
	const instaService = accessor.get(IInstantiationService);
	const notificationService = accessor.get(INotificationService);

	await part.item.resolve(CancellationToken.None);

	if (!part.part.location) {
		return;
	}

	const location: Location = part.part.location;
	const menuActions: IAction[] = [];

	// from all registered (not active) context menu actions select those
	// that are a symbol navigation actions
	const filter = new Set(MenuRegistry.getMenuItems(MenuId.EditorContext)
		.map(item => isIMenuItem(item) ? item.command.id : generateUuid()));

	for (const delegate of SymbolNavigationAction.all()) {
		if (filter.has(delegate.desc.id)) {
			menuActions.push(new Action(delegate.desc.id, MenuItemAction.label(delegate.desc, { renderShortTitle: true }), undefined, true, async () => {
				const ref = await resolverService.createModelReference(location.uri);
				try {
					const symbolAnchor = new SymbolNavigationAnchor(ref.object.textEditorModel, Range.getStartPosition(location.range));
					const range = part.item.anchor.range;
					await instaService.invokeFunction(delegate.runEditorCommand.bind(delegate), editor, symbolAnchor, range);
				} finally {
					ref.dispose();

				}
			}));
		}
	}

	if (part.part.command) {
		const { command } = part.part;
		menuActions.push(new Separator());
		menuActions.push(new Action(command.id, command.title, undefined, true, async () => {
			try {
				await commandService.executeCommand(command.id, ...(command.arguments ?? []));
			} catch (err) {
				notificationService.notify({
					severity: Severity.Error,
					source: part.item.provider.displayName,
					message: err
				});
			}
		}));
	}

	// show context menu
	const useShadowDOM = editor.getOption(EditorOption.useShadowDOM);
	contextMenuService.showContextMenu({
		domForShadowRoot: useShadowDOM ? editor.getDomNode() ?? undefined : undefined,
		getAnchor: () => {
			const box = dom.getDomNodePagePosition(anchor);
			return { x: box.left, y: box.top + box.height + 8 };
		},
		getActions: () => menuActions,
		onHide: () => {
			editor.focus();
		},
		autoSelectFirstItem: true,
	});

}

export async function goToDefinitionWithLocation(accessor: ServicesAccessor, event: ClickLinkMouseEvent, editor: IActiveCodeEditor, location: Location) {

	const resolverService = accessor.get(ITextModelService);
	const ref = await resolverService.createModelReference(location.uri);

	await editor.invokeWithinContext(async (accessor) => {

		const openToSide = event.hasSideBySideModifier;
		const contextKeyService = accessor.get(IContextKeyService);

		const isInPeek = PeekContext.inPeekEditor.getValue(contextKeyService);
		const canPeek = !openToSide && editor.getOption(EditorOption.definitionLinkOpensInPeek) && !isInPeek;

		const action = new DefinitionAction({ openToSide, openInPeek: canPeek, muteMessage: true }, { title: { value: '', original: '' }, id: '', precondition: undefined });
		return action.run(accessor, new SymbolNavigationAnchor(ref.object.textEditorModel, Range.getStartPosition(location.range)), Range.lift(location.range));
	});

	ref.dispose();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/inlineCompletions.contribution.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/inlineCompletions.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AccessibleViewRegistry } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { wrapInHotClass1 } from '../../../../platform/observable/common/wrapInHotClass.js';
import { EditorContributionInstantiation, registerEditorAction, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { HoverParticipantRegistry } from '../../hover/browser/hoverTypes.js';
import { AcceptInlineCompletion, AcceptNextLineOfInlineCompletion, AcceptNextWordOfInlineCompletion, DevExtractReproSample, HideInlineCompletion, JumpToNextInlineEdit, ShowNextInlineSuggestionAction, ShowPreviousInlineSuggestionAction, ToggleAlwaysShowInlineSuggestionToolbar, TriggerInlineSuggestionAction, ToggleInlineCompletionShowCollapsed, AcceptInlineCompletionAlternativeAction } from './controller/commands.js';
import { InlineCompletionsController } from './controller/inlineCompletionsController.js';
import { InlineCompletionsHoverParticipant } from './hintsWidget/hoverParticipant.js';
import { InlineCompletionsAccessibleView } from './inlineCompletionsAccessibleView.js';
import { CancelSnoozeInlineCompletion, SnoozeInlineCompletion } from '../../../browser/services/inlineCompletionsService.js';

registerEditorContribution(InlineCompletionsController.ID, wrapInHotClass1(InlineCompletionsController.hot), EditorContributionInstantiation.Eventually);

registerEditorAction(TriggerInlineSuggestionAction);
registerEditorAction(ShowNextInlineSuggestionAction);
registerEditorAction(ShowPreviousInlineSuggestionAction);
registerEditorAction(AcceptNextWordOfInlineCompletion);
registerEditorAction(AcceptNextLineOfInlineCompletion);
registerEditorAction(AcceptInlineCompletion);
registerEditorAction(AcceptInlineCompletionAlternativeAction);
registerEditorAction(ToggleInlineCompletionShowCollapsed);
registerEditorAction(HideInlineCompletion);
registerEditorAction(JumpToNextInlineEdit);
registerAction2(ToggleAlwaysShowInlineSuggestionToolbar);
registerEditorAction(DevExtractReproSample);
registerAction2(SnoozeInlineCompletion);
registerAction2(CancelSnoozeInlineCompletion);

HoverParticipantRegistry.register(InlineCompletionsHoverParticipant);
AccessibleViewRegistry.register(new InlineCompletionsAccessibleView());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/inlineCompletionsAccessibleView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/inlineCompletionsAccessibleView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { InlineCompletionContextKeys } from './controller/inlineCompletionContextKeys.js';
import { InlineCompletionsController } from './controller/inlineCompletionsController.js';
import { AccessibleViewType, AccessibleViewProviderId, IAccessibleViewContentProvider } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { InlineCompletionsModel } from './model/inlineCompletionsModel.js';
import { TextEdit } from '../../../common/core/edits/textEdit.js';
import { LineEdit } from '../../../common/core/edits/lineEdit.js';
import { TextModelText } from '../../../common/model/textModelText.js';

export class InlineCompletionsAccessibleView implements IAccessibleViewImplementation {
	readonly type = AccessibleViewType.View;
	readonly priority = 95;
	readonly name = 'inline-completions';
	readonly when = ContextKeyExpr.or(InlineCompletionContextKeys.inlineSuggestionVisible, InlineCompletionContextKeys.inlineEditVisible);
	getProvider(accessor: ServicesAccessor) {
		const codeEditorService = accessor.get(ICodeEditorService);
		const editor = codeEditorService.getActiveCodeEditor() || codeEditorService.getFocusedCodeEditor();
		if (!editor) {
			return;
		}

		const model = InlineCompletionsController.get(editor)?.model.get();
		if (!model?.state.get()) {
			return;
		}

		return new InlineCompletionsAccessibleViewContentProvider(editor, model);
	}
}

class InlineCompletionsAccessibleViewContentProvider extends Disposable implements IAccessibleViewContentProvider {
	private readonly _onDidChangeContent: Emitter<void> = this._register(new Emitter<void>());
	public readonly onDidChangeContent: Event<void> = this._onDidChangeContent.event;
	public readonly options: { language: string | undefined; type: AccessibleViewType.View };
	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _model: InlineCompletionsModel,
	) {
		super();
		this.options = { language: this._editor.getModel()?.getLanguageId() ?? undefined, type: AccessibleViewType.View };
	}

	public readonly id = AccessibleViewProviderId.InlineCompletions;
	public readonly verbositySettingKey = 'accessibility.verbosity.inlineCompletions';

	public provideContent(): string {
		const state = this._model.state.get();
		if (!state) {
			throw new Error('Inline completion is visible but state is not available');
		}
		if (state.kind === 'ghostText') {

			const lineText = this._model.textModel.getLineContent(state.primaryGhostText.lineNumber);
			const ghostText = state.primaryGhostText.renderForScreenReader(lineText);
			if (!ghostText) {
				throw new Error('Inline completion is visible but ghost text is not available');
			}
			return lineText + ghostText;
		} else {
			const text = new TextModelText(this._model.textModel);
			const lineEdit = LineEdit.fromTextEdit(new TextEdit(state.edits), text);
			return lineEdit.humanReadablePatch(text.getLines());
		}
	}
	public provideNextContent(): string | undefined {
		// asynchronously update the model and fire the event
		this._model.next().then((() => this._onDidChangeContent.fire()));
		return;
	}
	public providePreviousContent(): string | undefined {
		// asynchronously update the model and fire the event
		this._model.previous().then((() => this._onDidChangeContent.fire()));
		return;
	}
	public onClose(): void {
		this._model.stop();
		this._editor.focus();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/structuredLogger.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/structuredLogger.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IObservable, observableFromEvent } from '../../../../base/common/observable.js';
import { URI } from '../../../../base/common/uri.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IDataChannelService } from '../../../../platform/dataChannel/common/dataChannel.js';

export interface IRecordableLogEntry {
	sourceId: string;
	time: number;
}

export interface IRecordableEditorLogEntry extends IRecordableLogEntry {
	modelUri: URI; // This has to be a URI, so that it gets translated automatically in remote scenarios
	modelVersion: number;
}

export type EditorLogEntryData = IDocumentEventDataSetChangeReason | IDocumentEventFetchStart;
export type LogEntryData = IEventFetchEnd;

export interface IDocumentEventDataSetChangeReason {
	sourceId: 'TextModel.setChangeReason';
	source: 'inlineSuggestion.accept' | 'snippet' | string;
}

interface IDocumentEventFetchStart {
	sourceId: 'InlineCompletions.fetch';
	kind: 'start';
	requestId: number;
}

export interface IEventFetchEnd {
	sourceId: 'InlineCompletions.fetch';
	kind: 'end';
	requestId: number;
	error: string | undefined;
	result: IFetchResult[];
}

interface IFetchResult {
	range: string;
	text: string;
	isInlineEdit: boolean;
	source: string;
}


/**
 * The sourceLabel must not contain '@'!
*/
export function formatRecordableLogEntry<T extends IRecordableLogEntry>(entry: T): string {
	// eslint-disable-next-line local/code-no-any-casts
	return entry.sourceId + ' @@ ' + JSON.stringify({ ...entry, modelUri: (entry as any).modelUri?.toString(), sourceId: undefined });
}

export class StructuredLogger<T extends IRecordableLogEntry> extends Disposable {
	public static cast<T extends IRecordableLogEntry>(): typeof StructuredLogger<T> {
		return this as typeof StructuredLogger<T>;
	}

	public readonly isEnabled;
	private readonly _isEnabledContextKeyValue;

	constructor(
		private readonly _key: string,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IDataChannelService private readonly _dataChannelService: IDataChannelService,
	) {
		super();
		this._isEnabledContextKeyValue = observableContextKey<boolean>('structuredLogger.enabled:' + this._key, this._contextKeyService).recomputeInitiallyAndOnChange(this._store);
		this.isEnabled = this._isEnabledContextKeyValue.map(v => v !== undefined);
	}

	public log(data: T): boolean {
		const enabled = this._isEnabledContextKeyValue.get();
		if (!enabled) {
			return false;
		}
		this._dataChannelService.getDataChannel<T>('structuredLogger:' + this._key).sendData(data);
		return true;
	}
}

function observableContextKey<T>(key: string, contextKeyService: IContextKeyService): IObservable<T | undefined> {
	return observableFromEvent(contextKeyService.onDidChangeContext, () => contextKeyService.getContextKeyValue<T>(key));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/telemetry.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/telemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DataChannelForwardingTelemetryService } from '../../../../platform/dataChannel/browser/forwardingTelemetryService.js';

export function sendInlineCompletionsEndOfLifeTelemetry(dataChannel: DataChannelForwardingTelemetryService, endOfLifeSummary: InlineCompletionEndOfLifeEvent) {
	dataChannel.publicLog2<InlineCompletionEndOfLifeEvent, InlineCompletionsEndOfLifeClassification>('inlineCompletion.endOfLife', endOfLifeSummary);
}

export type InlineCompletionEndOfLifeEvent = {
	// request
	opportunityId: string;
	requestReason: string;
	editorType: string;
	languageId: string;
	typingInterval: number;
	typingIntervalCharacterCount: number;
	selectedSuggestionInfo: boolean;
	availableProviders: string;
	skuPlan: string | undefined;
	skuType: string | undefined;
	// response
	correlationId: string | undefined;
	extensionId: string;
	extensionVersion: string;
	groupId: string | undefined;
	// behavior
	shown: boolean;
	shownDuration: number | undefined;
	shownDurationUncollapsed: number | undefined;
	timeUntilShown: number | undefined;
	timeUntilProviderRequest: number | undefined;
	timeUntilProviderResponse: number | undefined;
	reason: 'accepted' | 'rejected' | 'ignored' | undefined;
	acceptedAlternativeAction: boolean | undefined;
	partiallyAccepted: number | undefined;
	partiallyAcceptedCountSinceOriginal: number | undefined;
	partiallyAcceptedRatioSinceOriginal: number | undefined;
	partiallyAcceptedCharactersSinceOriginal: number | undefined;
	preceeded: boolean | undefined;
	superseded: boolean | undefined;
	notShownReason: string | undefined;
	renameCreated: boolean | undefined;
	renameDuration: number | undefined;
	renameTimedOut: boolean | undefined;
	renameDroppedOtherEdits: number | undefined;
	renameDroppedRenameEdits: number | undefined;
	performanceMarkers: string | undefined;
	// rendering
	viewKind: string | undefined;
	cursorColumnDistance: number | undefined;
	cursorLineDistance: number | undefined;
	lineCountOriginal: number | undefined;
	lineCountModified: number | undefined;
	characterCountOriginal: number | undefined;
	characterCountModified: number | undefined;
	disjointReplacements: number | undefined;
	sameShapeReplacements: boolean | undefined;
	longDistanceHintVisible: boolean | undefined;
	longDistanceHintDistance: number | undefined;
	// empty
	noSuggestionReason: string | undefined;
	// shape
	editKind: string | undefined;
};

type InlineCompletionsEndOfLifeClassification = {
	owner: 'benibenj';
	comment: 'Inline completions ended. @sentToGitHub';
	opportunityId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Unique identifier for an opportunity to show an inline completion or NES' };
	correlationId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The correlation identifier for the inline completion' };
	extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The identifier for the extension that contributed the inline completion' };
	extensionVersion: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The version of the extension that contributed the inline completion' };
	groupId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The group ID of the extension that contributed the inline completion' };
	availableProviders: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The list of available inline completion providers at the time of the request' };
	skuPlan: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The the plan the user is subscribed to' };
	skuType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The sku type of the user' };
	shown: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the inline completion was shown to the user' };
	shownDuration: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The duration for which the inline completion was shown' };
	shownDurationUncollapsed: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The duration for which the inline completion was shown without collapsing' };
	timeUntilShown: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The time it took for the inline completion to be shown after the request' };
	timeUntilProviderRequest: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The time it took for the inline completion to be requested from the provider' };
	timeUntilProviderResponse: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The time it took for the inline completion to be shown after the request' };
	reason: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The reason for the inline completion ending' };
	acceptedAlternativeAction: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the user performed an alternative action when accepting the inline completion' };
	selectedSuggestionInfo: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the inline completion was requested with a selected suggestion' };
	partiallyAccepted: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'How often the inline completion was partially accepted by the user' };
	partiallyAcceptedCountSinceOriginal: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'How often the inline completion was partially accepted since the original request' };
	partiallyAcceptedRatioSinceOriginal: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The percentage of characters accepted since the original request' };
	partiallyAcceptedCharactersSinceOriginal: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The character count accepted since the original request' };
	preceeded: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the inline completion was preceeded by another one' };
	languageId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The language ID of the document where the inline completion was shown' };
	requestReason: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The reason for the inline completion request' };
	typingInterval: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The average typing interval of the user at the moment the inline completion was requested' };
	typingIntervalCharacterCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The character count involved in the typing interval calculation' };
	renameCreated: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether a rename operation was created' };
	renameDuration: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The duration of the rename processor' };
	renameTimedOut: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the rename prepare operation timed out' };
	renameDroppedOtherEdits: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of non-rename edits dropped due to rename processing' };
	renameDroppedRenameEdits: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of rename edits dropped due to rename processing' };
	superseded: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the inline completion was superseded by another one' };
	editorType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The type of the editor where the inline completion was shown' };
	viewKind: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The kind of the view where the inline completion was shown' };
	cursorColumnDistance: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The distance in columns from the cursor to the inline suggestion' };
	cursorLineDistance: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The distance in lines from the cursor to the inline suggestion' };
	lineCountOriginal: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of lines in the original text' };
	lineCountModified: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of lines in the modified text' };
	characterCountOriginal: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of characters in the original text' };
	characterCountModified: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of characters in the modified text' };
	disjointReplacements: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of inner replacements made by the inline completion' };
	sameShapeReplacements: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether all inner replacements are the same shape' };
	longDistanceHintVisible: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether a long distance hint was rendered' };
	longDistanceHintDistance: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The distance in lines between the long distance hint and the inline edit' };
	noSuggestionReason: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The reason why no inline completion was provided' };
	notShownReason: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The reason why the inline completion was not shown' };
	performanceMarkers: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Performance markers for the inline completion lifecycle' };
	editKind: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The kind of edit made by the inline completion' };
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/utils.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Permutation, compareBy } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable, observableValue, ISettableObservable, autorun, transaction, IReader } from '../../../../base/common/observable.js';
import { ContextKeyValue, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { bindContextKey } from '../../../../platform/observable/common/platformObservableUtils.js';
import { Position } from '../../../common/core/position.js';
import { PositionOffsetTransformer } from '../../../common/core/text/positionToOffset.js';
import { Range } from '../../../common/core/range.js';
import { TextReplacement, TextEdit } from '../../../common/core/edits/textEdit.js';
import { getPositionOffsetTransformerFromTextModel } from '../../../common/core/text/getPositionOffsetTransformerFromTextModel.js';
import { ITextModel } from '../../../common/model.js';

const array: ReadonlyArray<any> = [];
export function getReadonlyEmptyArray<T>(): readonly T[] {
	return array;
}

export function addPositions(pos1: Position, pos2: Position): Position {
	return new Position(pos1.lineNumber + pos2.lineNumber - 1, pos2.lineNumber === 1 ? pos1.column + pos2.column - 1 : pos2.column);
}

export function subtractPositions(pos1: Position, pos2: Position): Position {
	return new Position(pos1.lineNumber - pos2.lineNumber + 1, pos1.lineNumber - pos2.lineNumber === 0 ? pos1.column - pos2.column + 1 : pos1.column);
}

export function substringPos(text: string, pos: Position): string {
	const transformer = new PositionOffsetTransformer(text);
	const offset = transformer.getOffset(pos);
	return text.substring(offset);
}

export function getEndPositionsAfterApplying(edits: readonly TextReplacement[]): Position[] {
	const newRanges = getModifiedRangesAfterApplying(edits);
	return newRanges.map(range => range.getEndPosition());
}

export function getModifiedRangesAfterApplying(edits: readonly TextReplacement[]): Range[] {
	const sortPerm = Permutation.createSortPermutation(edits, compareBy(e => e.range, Range.compareRangesUsingStarts));
	const edit = new TextEdit(sortPerm.apply(edits));
	const sortedNewRanges = edit.getNewRanges();
	return sortPerm.inverse().apply(sortedNewRanges);
}

export function removeTextReplacementCommonSuffixPrefix(edits: readonly TextReplacement[], textModel: ITextModel): TextReplacement[] {
	const transformer = getPositionOffsetTransformerFromTextModel(textModel);
	const text = textModel.getValue();
	const stringReplacements = edits.map(edit => transformer.getStringReplacement(edit));
	const minimalStringReplacements = stringReplacements.map(replacement => replacement.removeCommonSuffixPrefix(text));
	return minimalStringReplacements.map(replacement => transformer.getTextReplacement(replacement));
}

export function convertItemsToStableObservables<T>(items: IObservable<readonly T[]>, store: DisposableStore): IObservable<IObservable<T>[]> {
	const result = observableValue<IObservable<T>[]>('result', []);
	const innerObservables: ISettableObservable<T>[] = [];

	store.add(autorun(reader => {
		const itemsValue = items.read(reader);

		transaction(tx => {
			if (itemsValue.length !== innerObservables.length) {
				innerObservables.length = itemsValue.length;
				for (let i = 0; i < innerObservables.length; i++) {
					if (!innerObservables[i]) {
						innerObservables[i] = observableValue<T>('item', itemsValue[i]);
					}
				}
				result.set([...innerObservables], tx);
			}
			innerObservables.forEach((o, i) => o.set(itemsValue[i], tx));
		});
	}));

	return result;
}

export class ObservableContextKeyService {
	constructor(
		private readonly _contextKeyService: IContextKeyService,
	) {
	}

	bind<T extends ContextKeyValue>(key: RawContextKey<T>, obs: IObservable<T>): IDisposable;
	bind<T extends ContextKeyValue>(key: RawContextKey<T>, fn: (reader: IReader) => T): IDisposable;
	bind<T extends ContextKeyValue>(key: RawContextKey<T>, obs: IObservable<T> | ((reader: IReader) => T)): IDisposable {
		return bindContextKey(key, this._contextKeyService, obs instanceof Function ? obs : reader => obs.read(reader));
	}
}

export function wait(ms: number, cancellationToken?: CancellationToken): Promise<void> {
	return new Promise(resolve => {
		let d: IDisposable | undefined = undefined;
		const handle = setTimeout(() => {
			if (d) { d.dispose(); }
			resolve();
		}, ms);
		if (cancellationToken) {
			d = cancellationToken.onCancellationRequested(() => {
				clearTimeout(handle);
				if (d) { d.dispose(); }
				resolve();
			});
		}
	});
}

export class ErrorResult<T = void> {
	public static message(message: string): ErrorResult {
		return new ErrorResult(undefined, message);
	}

	constructor(public readonly error: T, public readonly message: string | undefined = undefined) { }

	public static is<TOther>(obj: TOther | ErrorResult): obj is ErrorResult {
		return obj instanceof ErrorResult;
	}

	public logError(): void {
		if (this.message) {
			console.error(`ErrorResult: ${this.message}`, this.error);
		} else {
			console.error(`ErrorResult: An unexpected error-case occurred, usually caused by invalid input.`, this.error);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/controller/commandIds.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/controller/commandIds.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const inlineSuggestCommitId = 'editor.action.inlineSuggest.commit';

export const inlineSuggestCommitAlternativeActionId = 'editor.action.inlineSuggest.commitAlternativeAction';

export const showPreviousInlineSuggestionActionId = 'editor.action.inlineSuggest.showPrevious';

export const showNextInlineSuggestionActionId = 'editor.action.inlineSuggest.showNext';

export const jumpToNextInlineEditId = 'editor.action.inlineSuggest.jump';

export const hideInlineCompletionId = 'editor.action.inlineSuggest.hide';

export const toggleShowCollapsedId = 'editor.action.inlineSuggest.toggleShowCollapsed';

export const renameSymbolCommandId = 'editor.action.inlineSuggest.renameSymbol';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/controller/commands.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/controller/commands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { asyncTransaction, transaction } from '../../../../../base/common/observable.js';
import { splitLines } from '../../../../../base/common/strings.js';
import { vBoolean, vObj, vOptionalProp, vString, vUndefined, vUnion, vWithJsonSchemaRef } from '../../../../../base/common/validation.js';
import * as nls from '../../../../../nls.js';
import { CONTEXT_ACCESSIBILITY_MODE_ENABLED } from '../../../../../platform/accessibility/common/accessibility.js';
import { Action2, MenuId } from '../../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { INotificationService, Severity } from '../../../../../platform/notification/common/notification.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { EditorAction, ServicesAccessor } from '../../../../browser/editorExtensions.js';
import { EditorContextKeys } from '../../../../common/editorContextKeys.js';
import { InlineCompletionsProvider } from '../../../../common/languages.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { Context as SuggestContext } from '../../../suggest/browser/suggest.js';
import { hideInlineCompletionId, inlineSuggestCommitAlternativeActionId, inlineSuggestCommitId, jumpToNextInlineEditId, showNextInlineSuggestionActionId, showPreviousInlineSuggestionActionId, toggleShowCollapsedId } from './commandIds.js';
import { InlineCompletionContextKeys } from './inlineCompletionContextKeys.js';
import { InlineCompletionsController } from './inlineCompletionsController.js';

export class ShowNextInlineSuggestionAction extends EditorAction {
	public static ID = showNextInlineSuggestionActionId;
	constructor() {
		super({
			id: ShowNextInlineSuggestionAction.ID,
			label: nls.localize2('action.inlineSuggest.showNext', "Show Next Inline Suggestion"),
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, InlineCompletionContextKeys.inlineSuggestionVisible),
			kbOpts: {
				weight: 100,
				primary: KeyMod.Alt | KeyCode.BracketRight,
			},
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const controller = InlineCompletionsController.get(editor);
		controller?.model.get()?.next();
	}
}

export class ShowPreviousInlineSuggestionAction extends EditorAction {
	public static ID = showPreviousInlineSuggestionActionId;
	constructor() {
		super({
			id: ShowPreviousInlineSuggestionAction.ID,
			label: nls.localize2('action.inlineSuggest.showPrevious', "Show Previous Inline Suggestion"),
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, InlineCompletionContextKeys.inlineSuggestionVisible),
			kbOpts: {
				weight: 100,
				primary: KeyMod.Alt | KeyCode.BracketLeft,
			},
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const controller = InlineCompletionsController.get(editor);
		controller?.model.get()?.previous();
	}
}

export const providerIdSchemaUri = 'vscode://schemas/inlineCompletionProviderIdArgs';

export function inlineCompletionProviderGetMatcher(provider: InlineCompletionsProvider): string[] {
	const result: string[] = [];
	if (provider.providerId) {
		result.push(provider.providerId.toStringWithoutVersion());
		result.push(provider.providerId.extensionId + ':*');
	}
	return result;
}

const argsValidator = vUnion(vObj({
	showNoResultNotification: vOptionalProp(vBoolean()),
	providerId: vOptionalProp(vWithJsonSchemaRef(providerIdSchemaUri, vString())),
	explicit: vOptionalProp(vBoolean()),
}), vUndefined());

export class TriggerInlineSuggestionAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.inlineSuggest.trigger',
			label: nls.localize2('action.inlineSuggest.trigger', "Trigger Inline Suggestion"),
			precondition: EditorContextKeys.writable,
			metadata: {
				description: nls.localize('inlineSuggest.trigger.description', "Triggers an inline suggestion in the editor."),
				args: [{
					name: 'args',
					description: nls.localize('inlineSuggest.trigger.args', "Options for triggering inline suggestions."),
					isOptional: true,
					schema: argsValidator.getJSONSchema(),
				}]
			}
		});
	}

	public override async run(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): Promise<void> {
		const notificationService = accessor.get(INotificationService);
		const languageFeaturesService = accessor.get(ILanguageFeaturesService);

		const controller = InlineCompletionsController.get(editor);

		const validatedArgs = argsValidator.validateOrThrow(args);

		const provider = validatedArgs?.providerId ?
			languageFeaturesService.inlineCompletionsProvider.all(editor.getModel()!)
				.find(p => inlineCompletionProviderGetMatcher(p).some(m => m === validatedArgs.providerId))
			: undefined;

		await asyncTransaction(async tx => {
			/** @description triggerExplicitly from command */
			await controller?.model.get()?.trigger(tx, {
				provider: provider,
				explicit: validatedArgs?.explicit ?? true,
			});
			controller?.playAccessibilitySignal(tx);
		});

		if (validatedArgs?.showNoResultNotification) {
			if (!controller?.model.get()?.state.get()) {
				notificationService.notify({
					severity: Severity.Info,
					message: nls.localize('noInlineSuggestionAvailable', "No inline suggestion is available.")
				});
			}
		}
	}
}

export class AcceptNextWordOfInlineCompletion extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.inlineSuggest.acceptNextWord',
			label: nls.localize2('action.inlineSuggest.acceptNextWord', "Accept Next Word Of Inline Suggestion"),
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, InlineCompletionContextKeys.inlineSuggestionVisible),
			kbOpts: {
				weight: KeybindingWeight.EditorContrib + 1,
				primary: KeyMod.CtrlCmd | KeyCode.RightArrow,
				kbExpr: ContextKeyExpr.and(EditorContextKeys.writable, InlineCompletionContextKeys.inlineSuggestionVisible, InlineCompletionContextKeys.cursorBeforeGhostText, CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate()),
			},
			menuOpts: [{
				menuId: MenuId.InlineSuggestionToolbar,
				title: nls.localize('acceptWord', 'Accept Word'),
				group: 'primary',
				order: 2,
			}],
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const controller = InlineCompletionsController.get(editor);
		await controller?.model.get()?.acceptNextWord();
	}
}

export class AcceptNextLineOfInlineCompletion extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.inlineSuggest.acceptNextLine',
			label: nls.localize2('action.inlineSuggest.acceptNextLine', "Accept Next Line Of Inline Suggestion"),
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, InlineCompletionContextKeys.inlineSuggestionVisible),
			kbOpts: {
				weight: KeybindingWeight.EditorContrib + 1,
			},
			menuOpts: [{
				menuId: MenuId.InlineSuggestionToolbar,
				title: nls.localize('acceptLine', 'Accept Line'),
				group: 'secondary',
				order: 2,
			}],
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const controller = InlineCompletionsController.get(editor);
		await controller?.model.get()?.acceptNextLine();
	}
}

export class AcceptInlineCompletion extends EditorAction {
	constructor() {
		super({
			id: inlineSuggestCommitId,
			label: nls.localize2('action.inlineSuggest.accept', "Accept Inline Suggestion"),
			precondition: ContextKeyExpr.or(InlineCompletionContextKeys.inlineSuggestionVisible, InlineCompletionContextKeys.inlineEditVisible),
			menuOpts: [{
				menuId: MenuId.InlineSuggestionToolbar,
				title: nls.localize('accept', "Accept"),
				group: 'primary',
				order: 2,
			}, {
				menuId: MenuId.InlineEditsActions,
				title: nls.localize('accept', "Accept"),
				group: 'primary',
				order: 2,
			}],
			kbOpts: [
				{
					primary: KeyCode.Tab,
					weight: 200,
					kbExpr: ContextKeyExpr.or(
						ContextKeyExpr.and(
							InlineCompletionContextKeys.inlineSuggestionVisible,
							EditorContextKeys.tabMovesFocus.toNegated(),
							SuggestContext.Visible.toNegated(),
							EditorContextKeys.hoverFocused.toNegated(),
							InlineCompletionContextKeys.hasSelection.toNegated(),

							InlineCompletionContextKeys.inlineSuggestionHasIndentationLessThanTabSize,
						),
						ContextKeyExpr.and(
							InlineCompletionContextKeys.inlineEditVisible,
							EditorContextKeys.tabMovesFocus.toNegated(),
							SuggestContext.Visible.toNegated(),
							EditorContextKeys.hoverFocused.toNegated(),

							InlineCompletionContextKeys.tabShouldAcceptInlineEdit,
						)
					),
				}
			],
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const controller = InlineCompletionsController.getInFocusedEditorOrParent(accessor);
		if (controller) {
			controller.model.get()?.accept(controller.editor);
			controller.editor.focus();
		}
	}
}
KeybindingsRegistry.registerKeybindingRule({
	id: inlineSuggestCommitId,
	weight: 202, // greater than jump
	primary: KeyCode.Tab,
	when: ContextKeyExpr.and(InlineCompletionContextKeys.inInlineEditsPreviewEditor)
});

export class AcceptInlineCompletionAlternativeAction extends EditorAction {
	constructor() {
		super({
			id: inlineSuggestCommitAlternativeActionId,
			label: nls.localize2('action.inlineSuggest.acceptAlternativeAction', "Accept Inline Suggestion Alternative Action"),
			precondition: ContextKeyExpr.and(InlineCompletionContextKeys.inlineSuggestionAlternativeActionVisible, InlineCompletionContextKeys.inlineEditVisible),
			menuOpts: [],
			kbOpts: [
				{
					primary: KeyMod.Shift | KeyCode.Tab,
					weight: 203,
				}
			],
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const controller = InlineCompletionsController.getInFocusedEditorOrParent(accessor);
		if (controller) {
			controller.model.get()?.accept(controller.editor, true);
			controller.editor.focus();
		}
	}
}
KeybindingsRegistry.registerKeybindingRule({
	id: inlineSuggestCommitAlternativeActionId,
	weight: 203,
	primary: KeyMod.Shift | KeyCode.Tab,
	when: ContextKeyExpr.and(InlineCompletionContextKeys.inInlineEditsPreviewEditor)
});

export class JumpToNextInlineEdit extends EditorAction {
	constructor() {
		super({
			id: jumpToNextInlineEditId,
			label: nls.localize2('action.inlineSuggest.jump', "Jump to next inline edit"),
			precondition: InlineCompletionContextKeys.inlineEditVisible,
			menuOpts: [{
				menuId: MenuId.InlineEditsActions,
				title: nls.localize('jump', "Jump"),
				group: 'primary',
				order: 1,
				when: InlineCompletionContextKeys.cursorAtInlineEdit.toNegated(),
			}],
			kbOpts: {
				primary: KeyCode.Tab,
				weight: 201,
				kbExpr: ContextKeyExpr.and(
					InlineCompletionContextKeys.inlineEditVisible,
					EditorContextKeys.tabMovesFocus.toNegated(),
					SuggestContext.Visible.toNegated(),
					EditorContextKeys.hoverFocused.toNegated(),
					InlineCompletionContextKeys.tabShouldJumpToInlineEdit,
				),
			}
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const controller = InlineCompletionsController.get(editor);
		if (controller) {
			controller.jump();
		}
	}
}

export class HideInlineCompletion extends EditorAction {
	public static ID = hideInlineCompletionId;

	constructor() {
		super({
			id: HideInlineCompletion.ID,
			label: nls.localize2('action.inlineSuggest.hide', "Hide Inline Suggestion"),
			precondition: ContextKeyExpr.or(InlineCompletionContextKeys.inlineSuggestionVisible, InlineCompletionContextKeys.inlineEditVisible),
			kbOpts: {
				weight: KeybindingWeight.EditorContrib + 90, // same as hiding the suggest widget
				primary: KeyCode.Escape,
			},
			menuOpts: [{
				menuId: MenuId.InlineEditsActions,
				title: nls.localize('reject', "Reject"),
				group: 'primary',
				order: 3,
			}]
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const controller = InlineCompletionsController.getInFocusedEditorOrParent(accessor);
		transaction(tx => {
			controller?.model.get()?.stop('explicitCancel', tx);
		});
		controller?.editor.focus();
	}
}

export class ToggleInlineCompletionShowCollapsed extends EditorAction {
	public static ID = toggleShowCollapsedId;

	constructor() {
		super({
			id: ToggleInlineCompletionShowCollapsed.ID,
			label: nls.localize2('action.inlineSuggest.toggleShowCollapsed', "Toggle Inline Suggestions Show Collapsed"),
			precondition: ContextKeyExpr.true(),
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		const showCollapsed = configurationService.getValue<boolean>('editor.inlineSuggest.edits.showCollapsed');
		configurationService.updateValue('editor.inlineSuggest.edits.showCollapsed', !showCollapsed);
	}
}

KeybindingsRegistry.registerKeybindingRule({
	id: HideInlineCompletion.ID,
	weight: -1, // very weak
	primary: KeyCode.Escape,
	secondary: [KeyMod.Shift | KeyCode.Escape],
	when: ContextKeyExpr.and(InlineCompletionContextKeys.inInlineEditsPreviewEditor)
});

export class ToggleAlwaysShowInlineSuggestionToolbar extends Action2 {
	public static ID = 'editor.action.inlineSuggest.toggleAlwaysShowToolbar';

	constructor() {
		super({
			id: ToggleAlwaysShowInlineSuggestionToolbar.ID,
			title: nls.localize('action.inlineSuggest.alwaysShowToolbar', "Always Show Toolbar"),
			f1: false,
			precondition: undefined,
			menu: [{
				id: MenuId.InlineSuggestionToolbar,
				group: 'secondary',
				order: 10,
			}],
			toggled: ContextKeyExpr.equals('config.editor.inlineSuggest.showToolbar', 'always')
		});
	}

	public async run(accessor: ServicesAccessor): Promise<void> {
		const configService = accessor.get(IConfigurationService);
		const currentValue = configService.getValue<'always' | 'onHover'>('editor.inlineSuggest.showToolbar');
		const newValue = currentValue === 'always' ? 'onHover' : 'always';
		configService.updateValue('editor.inlineSuggest.showToolbar', newValue);
	}
}

export class DevExtractReproSample extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.inlineSuggest.dev.extractRepro',
			label: nls.localize('action.inlineSuggest.dev.extractRepro', "Developer: Extract Inline Suggest State"),
			alias: 'Developer: Inline Suggest Extract Repro',
			precondition: ContextKeyExpr.or(InlineCompletionContextKeys.inlineEditVisible, InlineCompletionContextKeys.inlineSuggestionVisible),
		});
	}

	public override async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<any> {
		const clipboardService = accessor.get(IClipboardService);

		const controller = InlineCompletionsController.get(editor);
		const m = controller?.model.get();
		if (!m) { return; }
		const repro = m.extractReproSample();

		const inlineCompletionLines = splitLines(JSON.stringify({ inlineCompletion: repro.inlineCompletion }, null, 4));

		const json = inlineCompletionLines.map(l => '// ' + l).join('\n');

		const reproStr = `${repro.documentValue}\n\n// <json>\n${json}\n// </json>\n`;

		await clipboardService.writeText(reproStr);

		return { reproCase: reproStr };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/controller/inlineCompletionContextKeys.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/controller/inlineCompletionContextKeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RawContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { localize } from '../../../../../nls.js';
import * as nls from '../../../../../nls.js';

export abstract class InlineCompletionContextKeys {

	public static readonly inlineSuggestionVisible = new RawContextKey<boolean>('inlineSuggestionVisible', false, localize('inlineSuggestionVisible', "Whether an inline suggestion is visible"));
	public static readonly inlineSuggestionAlternativeActionVisible = new RawContextKey<boolean>('inlineSuggestionAlternativeActionVisible', false, localize('inlineSuggestionAlternativeActionVisible', "Whether an alternative action for the inline suggestion is visible."));
	public static readonly inlineSuggestionHasIndentation = new RawContextKey<boolean>('inlineSuggestionHasIndentation', false, localize('inlineSuggestionHasIndentation', "Whether the inline suggestion starts with whitespace"));
	public static readonly inlineSuggestionHasIndentationLessThanTabSize = new RawContextKey<boolean>('inlineSuggestionHasIndentationLessThanTabSize', true, localize('inlineSuggestionHasIndentationLessThanTabSize', "Whether the inline suggestion starts with whitespace that is less than what would be inserted by tab"));
	public static readonly suppressSuggestions = new RawContextKey<boolean | undefined>('inlineSuggestionSuppressSuggestions', undefined, localize('suppressSuggestions', "Whether suggestions should be suppressed for the current suggestion"));

	public static readonly cursorBeforeGhostText = new RawContextKey<boolean | undefined>('cursorBeforeGhostText', false, localize('cursorBeforeGhostText', "Whether the cursor is at ghost text"));

	public static readonly cursorInIndentation = new RawContextKey<boolean | undefined>('cursorInIndentation', false, localize('cursorInIndentation', "Whether the cursor is in indentation"));
	public static readonly hasSelection = new RawContextKey<boolean | undefined>('editor.hasSelection', false, localize('editor.hasSelection', "Whether the editor has a selection"));
	public static readonly cursorAtInlineEdit = new RawContextKey<boolean | undefined>('cursorAtInlineEdit', false, localize('cursorAtInlineEdit', "Whether the cursor is at an inline edit"));
	public static readonly inlineEditVisible = new RawContextKey<boolean>('inlineEditIsVisible', false, localize('inlineEditVisible', "Whether an inline edit is visible"));
	public static readonly tabShouldJumpToInlineEdit = new RawContextKey<boolean | undefined>('tabShouldJumpToInlineEdit', false, localize('tabShouldJumpToInlineEdit', "Whether tab should jump to an inline edit."));
	public static readonly tabShouldAcceptInlineEdit = new RawContextKey<boolean | undefined>('tabShouldAcceptInlineEdit', false, localize('tabShouldAcceptInlineEdit', "Whether tab should accept the inline edit."));

	public static readonly inInlineEditsPreviewEditor = new RawContextKey<boolean>('inInlineEditsPreviewEditor', true, nls.localize('inInlineEditsPreviewEditor', "Whether the current code editor is showing an inline edits preview"));
}
```

--------------------------------------------------------------------------------

````

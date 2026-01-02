---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 249
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 249 of 552)

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

---[FILE: src/vs/editor/test/common/model/model.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/model.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Disposable, DisposableStore, dispose } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { EditOperation } from '../../../common/core/editOperation.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { MetadataConsts } from '../../../common/encodedTokenAttributes.js';
import { EncodedTokenizationResult, IState, TokenizationRegistry } from '../../../common/languages.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { NullState } from '../../../common/languages/nullTokenize.js';
import { TextModel } from '../../../common/model/textModel.js';
import { InternalModelContentChangeEvent, ModelRawContentChangedEvent, ModelRawFlush, ModelRawLineChanged, ModelRawLinesDeleted, ModelRawLinesInserted } from '../../../common/textModelEvents.js';
import { createModelServices, createTextModel, instantiateTextModel } from '../testTextModel.js';

// --------- utils

const LINE1 = 'My First Line';
const LINE2 = '\t\tMy Second Line';
const LINE3 = '    Third Line';
const LINE4 = '';
const LINE5 = '1';

suite('Editor Model - Model', () => {

	let thisModel: TextModel;

	setup(() => {
		const text =
			LINE1 + '\r\n' +
			LINE2 + '\n' +
			LINE3 + '\n' +
			LINE4 + '\r\n' +
			LINE5;
		thisModel = createTextModel(text);
	});

	teardown(() => {
		thisModel.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	// --------- insert text

	test('model getValue', () => {
		assert.strictEqual(thisModel.getValue(), 'My First Line\n\t\tMy Second Line\n    Third Line\n\n1');
	});

	test('model insert empty text', () => {
		thisModel.applyEdits([EditOperation.insert(new Position(1, 1), '')]);
		assert.strictEqual(thisModel.getLineCount(), 5);
		assert.strictEqual(thisModel.getLineContent(1), 'My First Line');
	});

	test('model insert text without newline 1', () => {
		thisModel.applyEdits([EditOperation.insert(new Position(1, 1), 'foo ')]);
		assert.strictEqual(thisModel.getLineCount(), 5);
		assert.strictEqual(thisModel.getLineContent(1), 'foo My First Line');
	});

	test('model insert text without newline 2', () => {
		thisModel.applyEdits([EditOperation.insert(new Position(1, 3), ' foo')]);
		assert.strictEqual(thisModel.getLineCount(), 5);
		assert.strictEqual(thisModel.getLineContent(1), 'My foo First Line');
	});

	test('model insert text with one newline', () => {
		thisModel.applyEdits([EditOperation.insert(new Position(1, 3), ' new line\nNo longer')]);
		assert.strictEqual(thisModel.getLineCount(), 6);
		assert.strictEqual(thisModel.getLineContent(1), 'My new line');
		assert.strictEqual(thisModel.getLineContent(2), 'No longer First Line');
	});

	test('model insert text with two newlines', () => {
		thisModel.applyEdits([EditOperation.insert(new Position(1, 3), ' new line\nOne more line in the middle\nNo longer')]);
		assert.strictEqual(thisModel.getLineCount(), 7);
		assert.strictEqual(thisModel.getLineContent(1), 'My new line');
		assert.strictEqual(thisModel.getLineContent(2), 'One more line in the middle');
		assert.strictEqual(thisModel.getLineContent(3), 'No longer First Line');
	});

	test('model insert text with many newlines', () => {
		thisModel.applyEdits([EditOperation.insert(new Position(1, 3), '\n\n\n\n')]);
		assert.strictEqual(thisModel.getLineCount(), 9);
		assert.strictEqual(thisModel.getLineContent(1), 'My');
		assert.strictEqual(thisModel.getLineContent(2), '');
		assert.strictEqual(thisModel.getLineContent(3), '');
		assert.strictEqual(thisModel.getLineContent(4), '');
		assert.strictEqual(thisModel.getLineContent(5), ' First Line');
	});


	// --------- insert text eventing

	test('model insert empty text does not trigger eventing', () => {
		const disposable = thisModel.onDidChangeContentOrInjectedText((e) => {
			assert.ok(false, 'was not expecting event');
		});
		thisModel.applyEdits([EditOperation.insert(new Position(1, 1), '')]);
		disposable.dispose();
	});

	test('model insert text without newline eventing', () => {
		let e: ModelRawContentChangedEvent | null = null;
		const disposable = thisModel.onDidChangeContentOrInjectedText((_e) => {
			if (e !== null || !(_e instanceof InternalModelContentChangeEvent)) {
				assert.fail('Unexpected assertion error');
			}
			e = _e.rawContentChangedEvent;
		});
		thisModel.applyEdits([EditOperation.insert(new Position(1, 1), 'foo ')]);
		assert.deepStrictEqual(e, new ModelRawContentChangedEvent(
			[
				new ModelRawLineChanged(1, 'foo My First Line', null)
			],
			2,
			false,
			false
		));
		disposable.dispose();
	});

	test('model insert text with one newline eventing', () => {
		let e: ModelRawContentChangedEvent | null = null;
		const disposable = thisModel.onDidChangeContentOrInjectedText((_e) => {
			if (e !== null || !(_e instanceof InternalModelContentChangeEvent)) {
				assert.fail('Unexpected assertion error');
			}
			e = _e.rawContentChangedEvent;
		});
		thisModel.applyEdits([EditOperation.insert(new Position(1, 3), ' new line\nNo longer')]);
		assert.deepStrictEqual(e, new ModelRawContentChangedEvent(
			[
				new ModelRawLineChanged(1, 'My new line', null),
				new ModelRawLinesInserted(2, 2, ['No longer First Line'], [null]),
			],
			2,
			false,
			false
		));
		disposable.dispose();
	});


	// --------- delete text

	test('model delete empty text', () => {
		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 1, 1))]);
		assert.strictEqual(thisModel.getLineCount(), 5);
		assert.strictEqual(thisModel.getLineContent(1), 'My First Line');
	});

	test('model delete text from one line', () => {
		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 1, 2))]);
		assert.strictEqual(thisModel.getLineCount(), 5);
		assert.strictEqual(thisModel.getLineContent(1), 'y First Line');
	});

	test('model delete text from one line 2', () => {
		thisModel.applyEdits([EditOperation.insert(new Position(1, 1), 'a')]);
		assert.strictEqual(thisModel.getLineContent(1), 'aMy First Line');

		thisModel.applyEdits([EditOperation.delete(new Range(1, 2, 1, 4))]);
		assert.strictEqual(thisModel.getLineCount(), 5);
		assert.strictEqual(thisModel.getLineContent(1), 'a First Line');
	});

	test('model delete all text from a line', () => {
		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 1, 14))]);
		assert.strictEqual(thisModel.getLineCount(), 5);
		assert.strictEqual(thisModel.getLineContent(1), '');
	});

	test('model delete text from two lines', () => {
		thisModel.applyEdits([EditOperation.delete(new Range(1, 4, 2, 6))]);
		assert.strictEqual(thisModel.getLineCount(), 4);
		assert.strictEqual(thisModel.getLineContent(1), 'My Second Line');
	});

	test('model delete text from many lines', () => {
		thisModel.applyEdits([EditOperation.delete(new Range(1, 4, 3, 5))]);
		assert.strictEqual(thisModel.getLineCount(), 3);
		assert.strictEqual(thisModel.getLineContent(1), 'My Third Line');
	});

	test('model delete everything', () => {
		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 5, 2))]);
		assert.strictEqual(thisModel.getLineCount(), 1);
		assert.strictEqual(thisModel.getLineContent(1), '');
	});

	// --------- delete text eventing

	test('model delete empty text does not trigger eventing', () => {
		const disposable = thisModel.onDidChangeContentOrInjectedText((e) => {
			assert.ok(false, 'was not expecting event');
		});
		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 1, 1))]);
		disposable.dispose();
	});

	test('model delete text from one line eventing', () => {
		let e: ModelRawContentChangedEvent | null = null;
		const disposable = thisModel.onDidChangeContentOrInjectedText((_e) => {
			if (e !== null || !(_e instanceof InternalModelContentChangeEvent)) {
				assert.fail('Unexpected assertion error');
			}
			e = _e.rawContentChangedEvent;
		});
		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 1, 2))]);
		assert.deepStrictEqual(e, new ModelRawContentChangedEvent(
			[
				new ModelRawLineChanged(1, 'y First Line', null),
			],
			2,
			false,
			false
		));
		disposable.dispose();
	});

	test('model delete all text from a line eventing', () => {
		let e: ModelRawContentChangedEvent | null = null;
		const disposable = thisModel.onDidChangeContentOrInjectedText((_e) => {
			if (e !== null || !(_e instanceof InternalModelContentChangeEvent)) {
				assert.fail('Unexpected assertion error');
			}
			e = _e.rawContentChangedEvent;
		});
		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 1, 14))]);
		assert.deepStrictEqual(e, new ModelRawContentChangedEvent(
			[
				new ModelRawLineChanged(1, '', null),
			],
			2,
			false,
			false
		));
		disposable.dispose();
	});

	test('model delete text from two lines eventing', () => {
		let e: ModelRawContentChangedEvent | null = null;
		const disposable = thisModel.onDidChangeContentOrInjectedText((_e) => {
			if (e !== null || !(_e instanceof InternalModelContentChangeEvent)) {
				assert.fail('Unexpected assertion error');
			}
			e = _e.rawContentChangedEvent;
		});
		thisModel.applyEdits([EditOperation.delete(new Range(1, 4, 2, 6))]);
		assert.deepStrictEqual(e, new ModelRawContentChangedEvent(
			[
				new ModelRawLineChanged(1, 'My Second Line', null),
				new ModelRawLinesDeleted(2, 2),
			],
			2,
			false,
			false
		));
		disposable.dispose();
	});

	test('model delete text from many lines eventing', () => {
		let e: ModelRawContentChangedEvent | null = null;
		const disposable = thisModel.onDidChangeContentOrInjectedText((_e) => {
			if (e !== null || !(_e instanceof InternalModelContentChangeEvent)) {
				assert.fail('Unexpected assertion error');
			}
			e = _e.rawContentChangedEvent;
		});
		thisModel.applyEdits([EditOperation.delete(new Range(1, 4, 3, 5))]);
		assert.deepStrictEqual(e, new ModelRawContentChangedEvent(
			[
				new ModelRawLineChanged(1, 'My Third Line', null),
				new ModelRawLinesDeleted(2, 3),
			],
			2,
			false,
			false
		));
		disposable.dispose();
	});

	// --------- getValueInRange

	test('getValueInRange', () => {
		assert.strictEqual(thisModel.getValueInRange(new Range(1, 1, 1, 1)), '');
		assert.strictEqual(thisModel.getValueInRange(new Range(1, 1, 1, 2)), 'M');
		assert.strictEqual(thisModel.getValueInRange(new Range(1, 2, 1, 3)), 'y');
		assert.strictEqual(thisModel.getValueInRange(new Range(1, 1, 1, 14)), 'My First Line');
		assert.strictEqual(thisModel.getValueInRange(new Range(1, 1, 2, 1)), 'My First Line\n');
		assert.strictEqual(thisModel.getValueInRange(new Range(1, 1, 2, 2)), 'My First Line\n\t');
		assert.strictEqual(thisModel.getValueInRange(new Range(1, 1, 2, 3)), 'My First Line\n\t\t');
		assert.strictEqual(thisModel.getValueInRange(new Range(1, 1, 2, 17)), 'My First Line\n\t\tMy Second Line');
		assert.strictEqual(thisModel.getValueInRange(new Range(1, 1, 3, 1)), 'My First Line\n\t\tMy Second Line\n');
		assert.strictEqual(thisModel.getValueInRange(new Range(1, 1, 4, 1)), 'My First Line\n\t\tMy Second Line\n    Third Line\n');
	});

	// --------- getValueLengthInRange

	test('getValueLengthInRange', () => {
		assert.strictEqual(thisModel.getValueLengthInRange(new Range(1, 1, 1, 1)), ''.length);
		assert.strictEqual(thisModel.getValueLengthInRange(new Range(1, 1, 1, 2)), 'M'.length);
		assert.strictEqual(thisModel.getValueLengthInRange(new Range(1, 2, 1, 3)), 'y'.length);
		assert.strictEqual(thisModel.getValueLengthInRange(new Range(1, 1, 1, 14)), 'My First Line'.length);
		assert.strictEqual(thisModel.getValueLengthInRange(new Range(1, 1, 2, 1)), 'My First Line\n'.length);
		assert.strictEqual(thisModel.getValueLengthInRange(new Range(1, 1, 2, 2)), 'My First Line\n\t'.length);
		assert.strictEqual(thisModel.getValueLengthInRange(new Range(1, 1, 2, 3)), 'My First Line\n\t\t'.length);
		assert.strictEqual(thisModel.getValueLengthInRange(new Range(1, 1, 2, 17)), 'My First Line\n\t\tMy Second Line'.length);
		assert.strictEqual(thisModel.getValueLengthInRange(new Range(1, 1, 3, 1)), 'My First Line\n\t\tMy Second Line\n'.length);
		assert.strictEqual(thisModel.getValueLengthInRange(new Range(1, 1, 4, 1)), 'My First Line\n\t\tMy Second Line\n    Third Line\n'.length);
	});

	// --------- setValue
	test('setValue eventing', () => {
		let e: ModelRawContentChangedEvent | null = null;
		const disposable = thisModel.onDidChangeContentOrInjectedText((_e) => {
			if (e !== null || !(_e instanceof InternalModelContentChangeEvent)) {
				assert.fail('Unexpected assertion error');
			}
			e = _e.rawContentChangedEvent;
		});
		thisModel.setValue('new value');
		assert.deepStrictEqual(e, new ModelRawContentChangedEvent(
			[
				new ModelRawFlush()
			],
			2,
			false,
			false
		));
		disposable.dispose();
	});

	test('issue #46342: Maintain edit operation order in applyEdits', () => {
		const res = thisModel.applyEdits([
			{ range: new Range(2, 1, 2, 1), text: 'a' },
			{ range: new Range(1, 1, 1, 1), text: 'b' },
		], true);

		assert.deepStrictEqual(res[0].range, new Range(2, 1, 2, 2));
		assert.deepStrictEqual(res[1].range, new Range(1, 1, 1, 2));
	});
});


// --------- Special Unicode LINE SEPARATOR character
suite('Editor Model - Model Line Separators', () => {

	let thisModel: TextModel;

	setup(() => {
		const text =
			LINE1 + '\u2028' +
			LINE2 + '\n' +
			LINE3 + '\u2028' +
			LINE4 + '\r\n' +
			LINE5;
		thisModel = createTextModel(text);
	});

	teardown(() => {
		thisModel.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('model getValue', () => {
		assert.strictEqual(thisModel.getValue(), 'My First Line\u2028\t\tMy Second Line\n    Third Line\u2028\n1');
	});

	test('model lines', () => {
		assert.strictEqual(thisModel.getLineCount(), 3);
	});

	test('Bug 13333:Model should line break on lonely CR too', () => {
		const model = createTextModel('Hello\rWorld!\r\nAnother line');
		assert.strictEqual(model.getLineCount(), 3);
		assert.strictEqual(model.getValue(), 'Hello\r\nWorld!\r\nAnother line');
		model.dispose();
	});
});


// --------- Words

suite('Editor Model - Words', () => {

	const OUTER_LANGUAGE_ID = 'outerMode';
	const INNER_LANGUAGE_ID = 'innerMode';

	class OuterMode extends Disposable {

		public readonly languageId = OUTER_LANGUAGE_ID;

		constructor(
			@ILanguageService languageService: ILanguageService,
			@ILanguageConfigurationService languageConfigurationService: ILanguageConfigurationService
		) {
			super();
			this._register(languageService.registerLanguage({ id: this.languageId }));
			this._register(languageConfigurationService.register(this.languageId, {}));

			const languageIdCodec = languageService.languageIdCodec;
			this._register(TokenizationRegistry.register(this.languageId, {
				getInitialState: (): IState => NullState,
				tokenize: undefined!,
				tokenizeEncoded: (line: string, hasEOL: boolean, state: IState): EncodedTokenizationResult => {
					const tokensArr: number[] = [];
					let prevLanguageId: string | undefined = undefined;
					for (let i = 0; i < line.length; i++) {
						const languageId = (line.charAt(i) === 'x' ? INNER_LANGUAGE_ID : OUTER_LANGUAGE_ID);
						const encodedLanguageId = languageIdCodec.encodeLanguageId(languageId);
						if (prevLanguageId !== languageId) {
							tokensArr.push(i);
							tokensArr.push((encodedLanguageId << MetadataConsts.LANGUAGEID_OFFSET));
						}
						prevLanguageId = languageId;
					}

					const tokens = new Uint32Array(tokensArr.length);
					for (let i = 0; i < tokens.length; i++) {
						tokens[i] = tokensArr[i];
					}
					return new EncodedTokenizationResult(tokens, [], state);
				}
			}));
		}
	}

	class InnerMode extends Disposable {

		public readonly languageId = INNER_LANGUAGE_ID;

		constructor(
			@ILanguageService languageService: ILanguageService,
			@ILanguageConfigurationService languageConfigurationService: ILanguageConfigurationService
		) {
			super();
			this._register(languageService.registerLanguage({ id: this.languageId }));
			this._register(languageConfigurationService.register(this.languageId, {}));
		}
	}

	let disposables: Disposable[] = [];

	setup(() => {
		disposables = [];
	});

	teardown(() => {
		dispose(disposables);
		disposables = [];
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Get word at position', () => {
		const text = ['This text has some  words. '];
		const thisModel = createTextModel(text.join('\n'));
		disposables.push(thisModel);

		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 1)), { word: 'This', startColumn: 1, endColumn: 5 });
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 2)), { word: 'This', startColumn: 1, endColumn: 5 });
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 4)), { word: 'This', startColumn: 1, endColumn: 5 });
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 5)), { word: 'This', startColumn: 1, endColumn: 5 });
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 6)), { word: 'text', startColumn: 6, endColumn: 10 });
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 19)), { word: 'some', startColumn: 15, endColumn: 19 });
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 20)), null);
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 21)), { word: 'words', startColumn: 21, endColumn: 26 });
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 26)), { word: 'words', startColumn: 21, endColumn: 26 });
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 27)), null);
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 28)), null);
	});

	test('getWordAtPosition at embedded language boundaries', () => {
		const disposables = new DisposableStore();
		const instantiationService = createModelServices(disposables);
		const outerMode = disposables.add(instantiationService.createInstance(OuterMode));
		disposables.add(instantiationService.createInstance(InnerMode));

		const model = disposables.add(instantiateTextModel(instantiationService, 'ab<xx>ab<x>', outerMode.languageId));

		assert.deepStrictEqual(model.getWordAtPosition(new Position(1, 1)), { word: 'ab', startColumn: 1, endColumn: 3 });
		assert.deepStrictEqual(model.getWordAtPosition(new Position(1, 2)), { word: 'ab', startColumn: 1, endColumn: 3 });
		assert.deepStrictEqual(model.getWordAtPosition(new Position(1, 3)), { word: 'ab', startColumn: 1, endColumn: 3 });
		assert.deepStrictEqual(model.getWordAtPosition(new Position(1, 4)), { word: 'xx', startColumn: 4, endColumn: 6 });
		assert.deepStrictEqual(model.getWordAtPosition(new Position(1, 5)), { word: 'xx', startColumn: 4, endColumn: 6 });
		assert.deepStrictEqual(model.getWordAtPosition(new Position(1, 6)), { word: 'xx', startColumn: 4, endColumn: 6 });
		assert.deepStrictEqual(model.getWordAtPosition(new Position(1, 7)), { word: 'ab', startColumn: 7, endColumn: 9 });

		disposables.dispose();
	});

	test('issue #61296: VS code freezes when editing CSS file with emoji', () => {
		const MODE_ID = 'testMode';
		const disposables = new DisposableStore();
		const instantiationService = createModelServices(disposables);
		const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
		const languageService = instantiationService.get(ILanguageService);

		disposables.add(languageService.registerLanguage({ id: MODE_ID }));
		disposables.add(languageConfigurationService.register(MODE_ID, {
			wordPattern: /(#?-?\d*\.\d\w*%?)|(::?[\w-]*(?=[^,{;]*[,{]))|(([@#.!])?[\w-?]+%?|[@#!.])/g
		}));

		const thisModel = disposables.add(instantiateTextModel(instantiationService, '.🐷-a-b', MODE_ID));

		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 1)), { word: '.', startColumn: 1, endColumn: 2 });
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 2)), { word: '.', startColumn: 1, endColumn: 2 });
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 3)), null);
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 4)), { word: '-a-b', startColumn: 4, endColumn: 8 });
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 5)), { word: '-a-b', startColumn: 4, endColumn: 8 });
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 6)), { word: '-a-b', startColumn: 4, endColumn: 8 });
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 7)), { word: '-a-b', startColumn: 4, endColumn: 8 });
		assert.deepStrictEqual(thisModel.getWordAtPosition(new Position(1, 8)), { word: '-a-b', startColumn: 4, endColumn: 8 });

		disposables.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/modelDecorations.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/modelDecorations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { EditOperation } from '../../../common/core/editOperation.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { EndOfLineSequence, IModelDeltaDecoration, TrackedRangeStickiness } from '../../../common/model.js';
import { TextModel } from '../../../common/model/textModel.js';
import { createTextModel } from '../testTextModel.js';

// --------- utils

interface ILightWeightDecoration2 {
	range: Range;
	className: string | null | undefined;
}

function modelHasDecorations(model: TextModel, decorations: ILightWeightDecoration2[]) {
	const modelDecorations: ILightWeightDecoration2[] = [];
	const actualDecorations = model.getAllDecorations();
	for (let i = 0, len = actualDecorations.length; i < len; i++) {
		modelDecorations.push({
			range: actualDecorations[i].range,
			className: actualDecorations[i].options.className
		});
	}
	modelDecorations.sort((a, b) => Range.compareRangesUsingStarts(a.range, b.range));
	assert.deepStrictEqual(modelDecorations, decorations);
}

function modelHasDecoration(model: TextModel, startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number, className: string) {
	modelHasDecorations(model, [{
		range: new Range(startLineNumber, startColumn, endLineNumber, endColumn),
		className: className
	}]);
}

function modelHasNoDecorations(model: TextModel) {
	assert.strictEqual(model.getAllDecorations().length, 0, 'Model has no decoration');
}

function addDecoration(model: TextModel, startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number, className: string): string {
	return model.changeDecorations((changeAccessor) => {
		return changeAccessor.addDecoration(new Range(startLineNumber, startColumn, endLineNumber, endColumn), {
			description: 'test',
			className: className
		});
	})!;
}

function lineHasDecorations(model: TextModel, lineNumber: number, decorations: { start: number; end: number; className: string }[]) {
	const lineDecorations: Array<{ start: number; end: number; className: string | null | undefined }> = [];
	const decs = model.getLineDecorations(lineNumber);
	for (let i = 0, len = decs.length; i < len; i++) {
		lineDecorations.push({
			start: decs[i].range.startColumn,
			end: decs[i].range.endColumn,
			className: decs[i].options.className
		});
	}
	assert.deepStrictEqual(lineDecorations, decorations, 'Line decorations');
}

function lineHasNoDecorations(model: TextModel, lineNumber: number) {
	lineHasDecorations(model, lineNumber, []);
}

function lineHasDecoration(model: TextModel, lineNumber: number, start: number, end: number, className: string) {
	lineHasDecorations(model, lineNumber, [{
		start: start,
		end: end,
		className: className
	}]);
}

suite('Editor Model - Model Decorations', () => {
	const LINE1 = 'My First Line';
	const LINE2 = '\t\tMy Second Line';
	const LINE3 = '    Third Line';
	const LINE4 = '';
	const LINE5 = '1';

	// --------- Model Decorations

	let thisModel: TextModel;

	setup(() => {
		const text =
			LINE1 + '\r\n' +
			LINE2 + '\n' +
			LINE3 + '\n' +
			LINE4 + '\r\n' +
			LINE5;
		thisModel = createTextModel(text);
	});

	teardown(() => {
		thisModel.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('single character decoration', () => {
		addDecoration(thisModel, 1, 1, 1, 2, 'myType');
		lineHasDecoration(thisModel, 1, 1, 2, 'myType');
		lineHasNoDecorations(thisModel, 2);
		lineHasNoDecorations(thisModel, 3);
		lineHasNoDecorations(thisModel, 4);
		lineHasNoDecorations(thisModel, 5);
	});

	test('line decoration', () => {
		addDecoration(thisModel, 1, 1, 1, 14, 'myType');
		lineHasDecoration(thisModel, 1, 1, 14, 'myType');
		lineHasNoDecorations(thisModel, 2);
		lineHasNoDecorations(thisModel, 3);
		lineHasNoDecorations(thisModel, 4);
		lineHasNoDecorations(thisModel, 5);
	});

	test('full line decoration', () => {
		addDecoration(thisModel, 1, 1, 2, 1, 'myType');

		const line1Decorations = thisModel.getLineDecorations(1);
		assert.strictEqual(line1Decorations.length, 1);
		assert.strictEqual(line1Decorations[0].options.className, 'myType');

		const line2Decorations = thisModel.getLineDecorations(1);
		assert.strictEqual(line2Decorations.length, 1);
		assert.strictEqual(line2Decorations[0].options.className, 'myType');

		lineHasNoDecorations(thisModel, 3);
		lineHasNoDecorations(thisModel, 4);
		lineHasNoDecorations(thisModel, 5);
	});

	test('multiple line decoration', () => {
		addDecoration(thisModel, 1, 2, 3, 2, 'myType');

		const line1Decorations = thisModel.getLineDecorations(1);
		assert.strictEqual(line1Decorations.length, 1);
		assert.strictEqual(line1Decorations[0].options.className, 'myType');

		const line2Decorations = thisModel.getLineDecorations(1);
		assert.strictEqual(line2Decorations.length, 1);
		assert.strictEqual(line2Decorations[0].options.className, 'myType');

		const line3Decorations = thisModel.getLineDecorations(1);
		assert.strictEqual(line3Decorations.length, 1);
		assert.strictEqual(line3Decorations[0].options.className, 'myType');

		lineHasNoDecorations(thisModel, 4);
		lineHasNoDecorations(thisModel, 5);
	});

	// --------- removing, changing decorations

	test('decoration gets removed', () => {
		const decId = addDecoration(thisModel, 1, 2, 3, 2, 'myType');
		modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
		thisModel.changeDecorations((changeAccessor) => {
			changeAccessor.removeDecoration(decId);
		});
		modelHasNoDecorations(thisModel);
	});

	test('decorations get removed', () => {
		const decId1 = addDecoration(thisModel, 1, 2, 3, 2, 'myType1');
		const decId2 = addDecoration(thisModel, 1, 2, 3, 1, 'myType2');
		modelHasDecorations(thisModel, [
			{
				range: new Range(1, 2, 3, 1),
				className: 'myType2'
			},
			{
				range: new Range(1, 2, 3, 2),
				className: 'myType1'
			}
		]);
		thisModel.changeDecorations((changeAccessor) => {
			changeAccessor.removeDecoration(decId1);
		});
		modelHasDecorations(thisModel, [
			{
				range: new Range(1, 2, 3, 1),
				className: 'myType2'
			}
		]);
		thisModel.changeDecorations((changeAccessor) => {
			changeAccessor.removeDecoration(decId2);
		});
		modelHasNoDecorations(thisModel);
	});

	test('decoration range can be changed', () => {
		const decId = addDecoration(thisModel, 1, 2, 3, 2, 'myType');
		modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
		thisModel.changeDecorations((changeAccessor) => {
			changeAccessor.changeDecoration(decId, new Range(1, 1, 1, 2));
		});
		modelHasDecoration(thisModel, 1, 1, 1, 2, 'myType');
	});

	// --------- eventing

	test('decorations emit event on add', () => {
		let listenerCalled = 0;
		const disposable = thisModel.onDidChangeDecorations((e) => {
			listenerCalled++;
		});
		addDecoration(thisModel, 1, 2, 3, 2, 'myType');
		assert.strictEqual(listenerCalled, 1, 'listener called');
		disposable.dispose();
	});

	test('decorations emit event on change', () => {
		let listenerCalled = 0;
		const decId = addDecoration(thisModel, 1, 2, 3, 2, 'myType');
		const disposable = thisModel.onDidChangeDecorations((e) => {
			listenerCalled++;
		});
		thisModel.changeDecorations((changeAccessor) => {
			changeAccessor.changeDecoration(decId, new Range(1, 1, 1, 2));
		});
		assert.strictEqual(listenerCalled, 1, 'listener called');
		disposable.dispose();
	});

	test('decorations emit event on remove', () => {
		let listenerCalled = 0;
		const decId = addDecoration(thisModel, 1, 2, 3, 2, 'myType');
		const disposable = thisModel.onDidChangeDecorations((e) => {
			listenerCalled++;
		});
		thisModel.changeDecorations((changeAccessor) => {
			changeAccessor.removeDecoration(decId);
		});
		assert.strictEqual(listenerCalled, 1, 'listener called');
		disposable.dispose();
	});

	test('decorations emit event when inserting one line text before it', () => {
		let listenerCalled = 0;
		addDecoration(thisModel, 1, 2, 3, 2, 'myType');

		const disposable = thisModel.onDidChangeDecorations((e) => {
			listenerCalled++;
		});

		thisModel.applyEdits([EditOperation.insert(new Position(1, 1), 'Hallo ')]);
		assert.strictEqual(listenerCalled, 1, 'listener called');
		disposable.dispose();
	});

	test('decorations do not emit event on no-op deltaDecorations', () => {
		let listenerCalled = 0;

		const disposable = thisModel.onDidChangeDecorations((e) => {
			listenerCalled++;
		});

		thisModel.deltaDecorations([], []);
		thisModel.changeDecorations((accessor) => {
			accessor.deltaDecorations([], []);
		});

		assert.strictEqual(listenerCalled, 0, 'listener not called');
		disposable.dispose();
	});

	// --------- editing text & effects on decorations

	test('decorations are updated when inserting one line text before it', () => {
		addDecoration(thisModel, 1, 2, 3, 2, 'myType');
		modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
		thisModel.applyEdits([EditOperation.insert(new Position(1, 1), 'Hallo ')]);
		modelHasDecoration(thisModel, 1, 8, 3, 2, 'myType');
	});

	test('decorations are updated when inserting one line text before it 2', () => {
		addDecoration(thisModel, 1, 1, 3, 2, 'myType');
		modelHasDecoration(thisModel, 1, 1, 3, 2, 'myType');
		thisModel.applyEdits([EditOperation.replace(new Range(1, 1, 1, 1), 'Hallo ')]);
		modelHasDecoration(thisModel, 1, 1, 3, 2, 'myType');
	});

	test('decorations are updated when inserting multiple lines text before it', () => {
		addDecoration(thisModel, 1, 2, 3, 2, 'myType');
		modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
		thisModel.applyEdits([EditOperation.insert(new Position(1, 1), 'Hallo\nI\'m inserting multiple\nlines')]);
		modelHasDecoration(thisModel, 3, 7, 5, 2, 'myType');
	});

	test('decorations change when inserting text after them', () => {
		addDecoration(thisModel, 1, 2, 3, 2, 'myType');
		modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
		thisModel.applyEdits([EditOperation.insert(new Position(3, 2), 'Hallo')]);
		modelHasDecoration(thisModel, 1, 2, 3, 7, 'myType');
	});

	test('decorations are updated when inserting text inside', () => {
		addDecoration(thisModel, 1, 2, 3, 2, 'myType');
		modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
		thisModel.applyEdits([EditOperation.insert(new Position(1, 3), 'Hallo ')]);
		modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
	});

	test('decorations are updated when inserting text inside 2', () => {
		addDecoration(thisModel, 1, 2, 3, 2, 'myType');
		modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
		thisModel.applyEdits([EditOperation.insert(new Position(3, 1), 'Hallo ')]);
		modelHasDecoration(thisModel, 1, 2, 3, 8, 'myType');
	});

	test('decorations are updated when inserting text inside 3', () => {
		addDecoration(thisModel, 1, 1, 2, 16, 'myType');
		modelHasDecoration(thisModel, 1, 1, 2, 16, 'myType');
		thisModel.applyEdits([EditOperation.insert(new Position(2, 2), '\n')]);
		modelHasDecoration(thisModel, 1, 1, 3, 15, 'myType');
	});

	test('decorations are updated when inserting multiple lines text inside', () => {
		addDecoration(thisModel, 1, 2, 3, 2, 'myType');
		modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
		thisModel.applyEdits([EditOperation.insert(new Position(1, 3), 'Hallo\nI\'m inserting multiple\nlines')]);
		modelHasDecoration(thisModel, 1, 2, 5, 2, 'myType');
	});

	test('decorations are updated when deleting one line text before it', () => {
		addDecoration(thisModel, 1, 2, 3, 2, 'myType');
		modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 1, 2))]);
		modelHasDecoration(thisModel, 1, 1, 3, 2, 'myType');
	});

	test('decorations are updated when deleting multiple lines text before it', () => {
		addDecoration(thisModel, 2, 2, 3, 2, 'myType');
		modelHasDecoration(thisModel, 2, 2, 3, 2, 'myType');
		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 2, 1))]);
		modelHasDecoration(thisModel, 1, 2, 2, 2, 'myType');
	});

	test('decorations are updated when deleting multiple lines text before it 2', () => {
		addDecoration(thisModel, 2, 3, 3, 2, 'myType');
		modelHasDecoration(thisModel, 2, 3, 3, 2, 'myType');
		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 2, 2))]);
		modelHasDecoration(thisModel, 1, 2, 2, 2, 'myType');
	});

	test('decorations are updated when deleting text inside', () => {
		addDecoration(thisModel, 1, 2, 4, 1, 'myType');
		modelHasDecoration(thisModel, 1, 2, 4, 1, 'myType');
		thisModel.applyEdits([EditOperation.delete(new Range(1, 3, 2, 1))]);
		modelHasDecoration(thisModel, 1, 2, 3, 1, 'myType');
	});

	test('decorations are updated when deleting text inside 2', () => {
		addDecoration(thisModel, 1, 2, 4, 1, 'myType');
		modelHasDecoration(thisModel, 1, 2, 4, 1, 'myType');
		thisModel.applyEdits([
			EditOperation.delete(new Range(1, 1, 1, 2)),
			EditOperation.delete(new Range(4, 1, 4, 1))
		]);
		modelHasDecoration(thisModel, 1, 1, 4, 1, 'myType');
	});

	test('decorations are updated when deleting multiple lines text', () => {
		addDecoration(thisModel, 1, 2, 4, 1, 'myType');
		modelHasDecoration(thisModel, 1, 2, 4, 1, 'myType');
		thisModel.applyEdits([EditOperation.delete(new Range(1, 1, 3, 1))]);
		modelHasDecoration(thisModel, 1, 1, 2, 1, 'myType');
	});

	test('decorations are updated when changing EOL', () => {
		addDecoration(thisModel, 1, 2, 4, 1, 'myType1');
		addDecoration(thisModel, 1, 3, 4, 1, 'myType2');
		addDecoration(thisModel, 1, 4, 4, 1, 'myType3');
		addDecoration(thisModel, 1, 5, 4, 1, 'myType4');
		addDecoration(thisModel, 1, 6, 4, 1, 'myType5');
		addDecoration(thisModel, 1, 7, 4, 1, 'myType6');
		addDecoration(thisModel, 1, 8, 4, 1, 'myType7');
		addDecoration(thisModel, 1, 9, 4, 1, 'myType8');
		addDecoration(thisModel, 1, 10, 4, 1, 'myType9');
		thisModel.applyEdits([EditOperation.insert(new Position(1, 1), 'x')]);
		thisModel.setEOL(EndOfLineSequence.CRLF);
		thisModel.applyEdits([EditOperation.insert(new Position(1, 1), 'x')]);
		modelHasDecorations(thisModel, [
			{ range: new Range(1, 4, 4, 1), className: 'myType1' },
			{ range: new Range(1, 5, 4, 1), className: 'myType2' },
			{ range: new Range(1, 6, 4, 1), className: 'myType3' },
			{ range: new Range(1, 7, 4, 1), className: 'myType4' },
			{ range: new Range(1, 8, 4, 1), className: 'myType5' },
			{ range: new Range(1, 9, 4, 1), className: 'myType6' },
			{ range: new Range(1, 10, 4, 1), className: 'myType7' },
			{ range: new Range(1, 11, 4, 1), className: 'myType8' },
			{ range: new Range(1, 12, 4, 1), className: 'myType9' },
		]);
	});

	test('an apparently simple edit', () => {
		addDecoration(thisModel, 1, 2, 4, 1, 'myType1');
		thisModel.applyEdits([EditOperation.replace(new Range(1, 14, 2, 1), 'x')]);
		modelHasDecorations(thisModel, [
			{ range: new Range(1, 2, 3, 1), className: 'myType1' },
		]);
	});

	test('removeAllDecorationsWithOwnerId can be called after model dispose', () => {
		const model = createTextModel('asd');
		model.dispose();
		model.removeAllDecorationsWithOwnerId(1);
	});

	test('removeAllDecorationsWithOwnerId works', () => {
		thisModel.deltaDecorations([], [{ range: new Range(1, 2, 4, 1), options: { description: 'test', className: 'myType1' } }], 1);
		thisModel.removeAllDecorationsWithOwnerId(1);
		modelHasNoDecorations(thisModel);
	});
});

suite('Decorations and editing', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function _runTest(decRange: Range, stickiness: TrackedRangeStickiness, editRange: Range, editText: string, editForceMoveMarkers: boolean, expectedDecRange: Range, msg: string): void {
		const model = createTextModel([
			'My First Line',
			'My Second Line',
			'Third Line'
		].join('\n'));

		const id = model.deltaDecorations([], [{ range: decRange, options: { description: 'test', stickiness: stickiness } }])[0];
		model.applyEdits([{
			range: editRange,
			text: editText,
			forceMoveMarkers: editForceMoveMarkers
		}]);
		const actual = model.getDecorationRange(id);
		assert.deepStrictEqual(actual, expectedDecRange, msg);

		model.dispose();
	}

	function runTest(decRange: Range, editRange: Range, editText: string, expectedDecRange: Range[][]): void {
		_runTest(decRange, 0, editRange, editText, false, expectedDecRange[0][0], 'no-0-AlwaysGrowsWhenTypingAtEdges');
		_runTest(decRange, 1, editRange, editText, false, expectedDecRange[0][1], 'no-1-NeverGrowsWhenTypingAtEdges');
		_runTest(decRange, 2, editRange, editText, false, expectedDecRange[0][2], 'no-2-GrowsOnlyWhenTypingBefore');
		_runTest(decRange, 3, editRange, editText, false, expectedDecRange[0][3], 'no-3-GrowsOnlyWhenTypingAfter');

		_runTest(decRange, 0, editRange, editText, true, expectedDecRange[1][0], 'force-0-AlwaysGrowsWhenTypingAtEdges');
		_runTest(decRange, 1, editRange, editText, true, expectedDecRange[1][1], 'force-1-NeverGrowsWhenTypingAtEdges');
		_runTest(decRange, 2, editRange, editText, true, expectedDecRange[1][2], 'force-2-GrowsOnlyWhenTypingBefore');
		_runTest(decRange, 3, editRange, editText, true, expectedDecRange[1][3], 'force-3-GrowsOnlyWhenTypingAfter');
	}

	suite('insert', () => {
		suite('collapsed dec', () => {
			test('before', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 3, 1, 3), 'xx',
					[
						[new Range(1, 6, 1, 6), new Range(1, 6, 1, 6), new Range(1, 6, 1, 6), new Range(1, 6, 1, 6)],
						[new Range(1, 6, 1, 6), new Range(1, 6, 1, 6), new Range(1, 6, 1, 6), new Range(1, 6, 1, 6)],
					]
				);
			});
			test('equal', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 4, 1, 4), 'xx',
					[
						[new Range(1, 4, 1, 6), new Range(1, 6, 1, 6), new Range(1, 4, 1, 4), new Range(1, 6, 1, 6)],
						[new Range(1, 6, 1, 6), new Range(1, 6, 1, 6), new Range(1, 6, 1, 6), new Range(1, 6, 1, 6)],
					]
				);
			});
			test('after', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 5, 1, 5), 'xx',
					[
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
					]
				);
			});
		});
		suite('non-collapsed dec', () => {
			test('before', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 3), 'xx',
					[
						[new Range(1, 6, 1, 11), new Range(1, 6, 1, 11), new Range(1, 6, 1, 11), new Range(1, 6, 1, 11)],
						[new Range(1, 6, 1, 11), new Range(1, 6, 1, 11), new Range(1, 6, 1, 11), new Range(1, 6, 1, 11)],
					]
				);
			});
			test('start', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 4), 'xx',
					[
						[new Range(1, 4, 1, 11), new Range(1, 6, 1, 11), new Range(1, 4, 1, 11), new Range(1, 6, 1, 11)],
						[new Range(1, 6, 1, 11), new Range(1, 6, 1, 11), new Range(1, 6, 1, 11), new Range(1, 6, 1, 11)],
					]
				);
			});
			test('inside', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 5), 'xx',
					[
						[new Range(1, 4, 1, 11), new Range(1, 4, 1, 11), new Range(1, 4, 1, 11), new Range(1, 4, 1, 11)],
						[new Range(1, 4, 1, 11), new Range(1, 4, 1, 11), new Range(1, 4, 1, 11), new Range(1, 4, 1, 11)],
					]
				);
			});
			test('end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 9, 1, 9), 'xx',
					[
						[new Range(1, 4, 1, 11), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 11)],
						[new Range(1, 4, 1, 11), new Range(1, 4, 1, 11), new Range(1, 4, 1, 11), new Range(1, 4, 1, 11)],
					]
				);
			});
			test('after', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 10, 1, 10), 'xx',
					[
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
					]
				);
			});
		});
	});

	suite('delete', () => {
		suite('collapsed dec', () => {
			test('edit.end < range.start', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 1, 1, 3), '',
					[
						[new Range(1, 2, 1, 2), new Range(1, 2, 1, 2), new Range(1, 2, 1, 2), new Range(1, 2, 1, 2)],
						[new Range(1, 2, 1, 2), new Range(1, 2, 1, 2), new Range(1, 2, 1, 2), new Range(1, 2, 1, 2)],
					]
				);
			});
			test('edit.end <= range.start', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 2, 1, 4), '',
					[
						[new Range(1, 2, 1, 2), new Range(1, 2, 1, 2), new Range(1, 2, 1, 2), new Range(1, 2, 1, 2)],
						[new Range(1, 2, 1, 2), new Range(1, 2, 1, 2), new Range(1, 2, 1, 2), new Range(1, 2, 1, 2)],
					]
				);
			});
			test('edit.start < range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 3, 1, 5), '',
					[
						[new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3)],
						[new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3)],
					]
				);
			});
			test('edit.start >= range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 4, 1, 6), '',
					[
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
					]
				);
			});
			test('edit.start > range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 5, 1, 7), '',
					[
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
					]
				);
			});
		});
		suite('non-collapsed dec', () => {
			test('edit.end < range.start', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 1, 1, 3), '',
					[
						[new Range(1, 2, 1, 7), new Range(1, 2, 1, 7), new Range(1, 2, 1, 7), new Range(1, 2, 1, 7)],
						[new Range(1, 2, 1, 7), new Range(1, 2, 1, 7), new Range(1, 2, 1, 7), new Range(1, 2, 1, 7)],
					]
				);
			});
			test('edit.end <= range.start', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 2, 1, 4), '',
					[
						[new Range(1, 2, 1, 7), new Range(1, 2, 1, 7), new Range(1, 2, 1, 7), new Range(1, 2, 1, 7)],
						[new Range(1, 2, 1, 7), new Range(1, 2, 1, 7), new Range(1, 2, 1, 7), new Range(1, 2, 1, 7)],
					]
				);
			});
			test('edit.start < range.start && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 5), '',
					[
						[new Range(1, 3, 1, 7), new Range(1, 3, 1, 7), new Range(1, 3, 1, 7), new Range(1, 3, 1, 7)],
						[new Range(1, 3, 1, 7), new Range(1, 3, 1, 7), new Range(1, 3, 1, 7), new Range(1, 3, 1, 7)],
					]
				);
			});

			test('edit.start < range.start && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 9), '',
					[
						[new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3)],
						[new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3)],
					]
				);
			});

			test('edit.start < range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 10), '',
					[
						[new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3)],
						[new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3)],
					]
				);
			});

			test('edit.start == range.start && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 6), '',
					[
						[new Range(1, 4, 1, 7), new Range(1, 4, 1, 7), new Range(1, 4, 1, 7), new Range(1, 4, 1, 7)],
						[new Range(1, 4, 1, 7), new Range(1, 4, 1, 7), new Range(1, 4, 1, 7), new Range(1, 4, 1, 7)],
					]
				);
			});

			test('edit.start == range.start && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 9), '',
					[
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
					]
				);
			});

			test('edit.start == range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 10), '',
					[
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
					]
				);
			});

			test('edit.start > range.start && edit.start < range.end && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 7), '',
					[
						[new Range(1, 4, 1, 7), new Range(1, 4, 1, 7), new Range(1, 4, 1, 7), new Range(1, 4, 1, 7)],
						[new Range(1, 4, 1, 7), new Range(1, 4, 1, 7), new Range(1, 4, 1, 7), new Range(1, 4, 1, 7)],
					]
				);
			});

			test('edit.start > range.start && edit.start < range.end && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 9), '',
					[
						[new Range(1, 4, 1, 5), new Range(1, 4, 1, 5), new Range(1, 4, 1, 5), new Range(1, 4, 1, 5)],
						[new Range(1, 4, 1, 5), new Range(1, 4, 1, 5), new Range(1, 4, 1, 5), new Range(1, 4, 1, 5)],
					]
				);
			});

			test('edit.start > range.start && edit.start < range.end && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 10), '',
					[
						[new Range(1, 4, 1, 5), new Range(1, 4, 1, 5), new Range(1, 4, 1, 5), new Range(1, 4, 1, 5)],
						[new Range(1, 4, 1, 5), new Range(1, 4, 1, 5), new Range(1, 4, 1, 5), new Range(1, 4, 1, 5)],
					]
				);
			});

			test('edit.start == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 9, 1, 11), '',
					[
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
					]
				);
			});

			test('edit.start > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 10, 1, 11), '',
					[
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
					]
				);
			});
		});
	});

	suite('replace short', () => {
		suite('collapsed dec', () => {
			test('edit.end < range.start', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 1, 1, 3), 'c',
					[
						[new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3)],
						[new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3)],
					]
				);
			});
			test('edit.end <= range.start', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 2, 1, 4), 'c',
					[
						[new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3)],
						[new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3), new Range(1, 3, 1, 3)],
					]
				);
			});
			test('edit.start < range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 3, 1, 5), 'c',
					[
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
					]
				);
			});
			test('edit.start >= range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 4, 1, 6), 'c',
					[
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
						[new Range(1, 5, 1, 5), new Range(1, 5, 1, 5), new Range(1, 5, 1, 5), new Range(1, 5, 1, 5)],
					]
				);
			});
			test('edit.start > range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 5, 1, 7), 'c',
					[
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
					]
				);
			});
		});
		suite('non-collapsed dec', () => {
			test('edit.end < range.start', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 1, 1, 3), 'c',
					[
						[new Range(1, 3, 1, 8), new Range(1, 3, 1, 8), new Range(1, 3, 1, 8), new Range(1, 3, 1, 8)],
						[new Range(1, 3, 1, 8), new Range(1, 3, 1, 8), new Range(1, 3, 1, 8), new Range(1, 3, 1, 8)],
					]
				);
			});
			test('edit.end <= range.start', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 2, 1, 4), 'c',
					[
						[new Range(1, 3, 1, 8), new Range(1, 3, 1, 8), new Range(1, 3, 1, 8), new Range(1, 3, 1, 8)],
						[new Range(1, 3, 1, 8), new Range(1, 3, 1, 8), new Range(1, 3, 1, 8), new Range(1, 3, 1, 8)],
					]
				);
			});
			test('edit.start < range.start && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 5), 'c',
					[
						[new Range(1, 4, 1, 8), new Range(1, 4, 1, 8), new Range(1, 4, 1, 8), new Range(1, 4, 1, 8)],
						[new Range(1, 4, 1, 8), new Range(1, 4, 1, 8), new Range(1, 4, 1, 8), new Range(1, 4, 1, 8)],
					]
				);
			});
			test('edit.start < range.start && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 9), 'c',
					[
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
					]
				);
			});
			test('edit.start < range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 10), 'c',
					[
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
					]
				);
			});
			test('edit.start == range.start && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 6), 'c',
					[
						[new Range(1, 4, 1, 8), new Range(1, 4, 1, 8), new Range(1, 4, 1, 8), new Range(1, 4, 1, 8)],
						[new Range(1, 5, 1, 8), new Range(1, 5, 1, 8), new Range(1, 5, 1, 8), new Range(1, 5, 1, 8)],
					]
				);
			});
			test('edit.start == range.start && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 9), 'c',
					[
						[new Range(1, 4, 1, 5), new Range(1, 4, 1, 5), new Range(1, 4, 1, 5), new Range(1, 4, 1, 5)],
						[new Range(1, 5, 1, 5), new Range(1, 5, 1, 5), new Range(1, 5, 1, 5), new Range(1, 5, 1, 5)],
					]
				);
			});
			test('edit.start == range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 10), 'c',
					[
						[new Range(1, 4, 1, 5), new Range(1, 4, 1, 5), new Range(1, 4, 1, 5), new Range(1, 4, 1, 5)],
						[new Range(1, 5, 1, 5), new Range(1, 5, 1, 5), new Range(1, 5, 1, 5), new Range(1, 5, 1, 5)],
					]
				);
			});
			test('edit.start > range.start && edit.start < range.end && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 7), 'c',
					[
						[new Range(1, 4, 1, 8), new Range(1, 4, 1, 8), new Range(1, 4, 1, 8), new Range(1, 4, 1, 8)],
						[new Range(1, 4, 1, 8), new Range(1, 4, 1, 8), new Range(1, 4, 1, 8), new Range(1, 4, 1, 8)],
					]
				);
			});
			test('edit.start > range.start && edit.start < range.end && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 9), 'c',
					[
						[new Range(1, 4, 1, 6), new Range(1, 4, 1, 6), new Range(1, 4, 1, 6), new Range(1, 4, 1, 6)],
						[new Range(1, 4, 1, 6), new Range(1, 4, 1, 6), new Range(1, 4, 1, 6), new Range(1, 4, 1, 6)],
					]
				);
			});
			test('edit.start > range.start && edit.start < range.end && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 10), 'c',
					[
						[new Range(1, 4, 1, 6), new Range(1, 4, 1, 6), new Range(1, 4, 1, 6), new Range(1, 4, 1, 6)],
						[new Range(1, 4, 1, 6), new Range(1, 4, 1, 6), new Range(1, 4, 1, 6), new Range(1, 4, 1, 6)],
					]
				);
			});
			test('edit.start == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 9, 1, 11), 'c',
					[
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
						[new Range(1, 4, 1, 10), new Range(1, 4, 1, 10), new Range(1, 4, 1, 10), new Range(1, 4, 1, 10)],
					]
				);
			});
			test('edit.start > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 10, 1, 11), 'c',
					[
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
					]
				);
			});
		});
	});

	suite('replace long', () => {
		suite('collapsed dec', () => {
			test('edit.end < range.start', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 1, 1, 3), 'cccc',
					[
						[new Range(1, 6, 1, 6), new Range(1, 6, 1, 6), new Range(1, 6, 1, 6), new Range(1, 6, 1, 6)],
						[new Range(1, 6, 1, 6), new Range(1, 6, 1, 6), new Range(1, 6, 1, 6), new Range(1, 6, 1, 6)],
					]
				);
			});
			test('edit.end <= range.start', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 2, 1, 4), 'cccc',
					[
						[new Range(1, 4, 1, 6), new Range(1, 6, 1, 6), new Range(1, 4, 1, 4), new Range(1, 6, 1, 6)],
						[new Range(1, 6, 1, 6), new Range(1, 6, 1, 6), new Range(1, 6, 1, 6), new Range(1, 6, 1, 6)],
					]
				);
			});
			test('edit.start < range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 3, 1, 5), 'cccc',
					[
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
						[new Range(1, 7, 1, 7), new Range(1, 7, 1, 7), new Range(1, 7, 1, 7), new Range(1, 7, 1, 7)],
					]
				);
			});
			test('edit.start >= range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 4, 1, 6), 'cccc',
					[
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
						[new Range(1, 8, 1, 8), new Range(1, 8, 1, 8), new Range(1, 8, 1, 8), new Range(1, 8, 1, 8)],
					]
				);
			});
			test('edit.start > range.end', () => {
				runTest(
					new Range(1, 4, 1, 4),
					new Range(1, 5, 1, 7), 'cccc',
					[
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
						[new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4), new Range(1, 4, 1, 4)],
					]
				);
			});
		});
		suite('non-collapsed dec', () => {
			test('edit.end < range.start', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 1, 1, 3), 'cccc',
					[
						[new Range(1, 6, 1, 11), new Range(1, 6, 1, 11), new Range(1, 6, 1, 11), new Range(1, 6, 1, 11)],
						[new Range(1, 6, 1, 11), new Range(1, 6, 1, 11), new Range(1, 6, 1, 11), new Range(1, 6, 1, 11)],
					]
				);
			});
			test('edit.end <= range.start', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 2, 1, 4), 'cccc',
					[
						[new Range(1, 4, 1, 11), new Range(1, 6, 1, 11), new Range(1, 4, 1, 11), new Range(1, 6, 1, 11)],
						[new Range(1, 6, 1, 11), new Range(1, 6, 1, 11), new Range(1, 6, 1, 11), new Range(1, 6, 1, 11)],
					]
				);
			});
			test('edit.start < range.start && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 5), 'cccc',
					[
						[new Range(1, 4, 1, 11), new Range(1, 4, 1, 11), new Range(1, 4, 1, 11), new Range(1, 4, 1, 11)],
						[new Range(1, 7, 1, 11), new Range(1, 7, 1, 11), new Range(1, 7, 1, 11), new Range(1, 7, 1, 11)],
					]
				);
			});
			test('edit.start < range.start && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 9), 'cccc',
					[
						[new Range(1, 4, 1, 7), new Range(1, 4, 1, 7), new Range(1, 4, 1, 7), new Range(1, 4, 1, 7)],
						[new Range(1, 7, 1, 7), new Range(1, 7, 1, 7), new Range(1, 7, 1, 7), new Range(1, 7, 1, 7)],
					]
				);
			});
			test('edit.start < range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 3, 1, 10), 'cccc',
					[
						[new Range(1, 4, 1, 7), new Range(1, 4, 1, 7), new Range(1, 4, 1, 7), new Range(1, 4, 1, 7)],
						[new Range(1, 7, 1, 7), new Range(1, 7, 1, 7), new Range(1, 7, 1, 7), new Range(1, 7, 1, 7)],
					]
				);
			});
			test('edit.start == range.start && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 6), 'cccc',
					[
						[new Range(1, 4, 1, 11), new Range(1, 4, 1, 11), new Range(1, 4, 1, 11), new Range(1, 4, 1, 11)],
						[new Range(1, 8, 1, 11), new Range(1, 8, 1, 11), new Range(1, 8, 1, 11), new Range(1, 8, 1, 11)],
					]
				);
			});
			test('edit.start == range.start && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 9), 'cccc',
					[
						[new Range(1, 4, 1, 8), new Range(1, 4, 1, 8), new Range(1, 4, 1, 8), new Range(1, 4, 1, 8)],
						[new Range(1, 8, 1, 8), new Range(1, 8, 1, 8), new Range(1, 8, 1, 8), new Range(1, 8, 1, 8)],
					]
				);
			});
			test('edit.start == range.start && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 4, 1, 10), 'cccc',
					[
						[new Range(1, 4, 1, 8), new Range(1, 4, 1, 8), new Range(1, 4, 1, 8), new Range(1, 4, 1, 8)],
						[new Range(1, 8, 1, 8), new Range(1, 8, 1, 8), new Range(1, 8, 1, 8), new Range(1, 8, 1, 8)],
					]
				);
			});
			test('edit.start > range.start && edit.start < range.end && edit.end < range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 7), 'cccc',
					[
						[new Range(1, 4, 1, 11), new Range(1, 4, 1, 11), new Range(1, 4, 1, 11), new Range(1, 4, 1, 11)],
						[new Range(1, 4, 1, 11), new Range(1, 4, 1, 11), new Range(1, 4, 1, 11), new Range(1, 4, 1, 11)],
					]
				);
			});
			test('edit.start > range.start && edit.start < range.end && edit.end == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 9), 'cccc',
					[
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
					]
				);
			});
			test('edit.start > range.start && edit.start < range.end && edit.end > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 5, 1, 10), 'cccc',
					[
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
					]
				);
			});
			test('edit.start == range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 9, 1, 11), 'cccc',
					[
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
						[new Range(1, 4, 1, 13), new Range(1, 4, 1, 13), new Range(1, 4, 1, 13), new Range(1, 4, 1, 13)],
					]
				);
			});
			test('edit.start > range.end', () => {
				runTest(
					new Range(1, 4, 1, 9),
					new Range(1, 10, 1, 11), 'cccc',
					[
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
						[new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9), new Range(1, 4, 1, 9)],
					]
				);
			});
		});
	});
});

interface ILightWeightDecoration {
	id: string;
	range: Range;
}

suite('deltaDecorations', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function decoration(id: string, startLineNumber: number, startColumn: number, endLineNumber: number, endColum: number): ILightWeightDecoration {
		return {
			id: id,
			range: new Range(startLineNumber, startColumn, endLineNumber, endColum)
		};
	}

	function toModelDeltaDecoration(dec: ILightWeightDecoration): IModelDeltaDecoration {
		return {
			range: dec.range,
			options: {
				description: 'test',
				className: dec.id
			}
		};
	}

	function strcmp(a: string, b: string): number {
		if (a === b) {
			return 0;
		}
		if (a < b) {
			return -1;
		}
		return 1;
	}

	function readModelDecorations(model: TextModel, ids: string[]): ILightWeightDecoration[] {
		return ids.map((id) => {
			return {
				range: model.getDecorationRange(id)!,
				id: model.getDecorationOptions(id)!.className!
			};
		});
	}

	function testDeltaDecorations(text: string[], decorations: ILightWeightDecoration[], newDecorations: ILightWeightDecoration[]): void {

		const model = createTextModel(text.join('\n'));

		// Add initial decorations & assert they are added
		const initialIds = model.deltaDecorations([], decorations.map(toModelDeltaDecoration));
		const actualDecorations = readModelDecorations(model, initialIds);

		assert.strictEqual(initialIds.length, decorations.length, 'returns expected cnt of ids');
		assert.strictEqual(initialIds.length, model.getAllDecorations().length, 'does not leak decorations');
		actualDecorations.sort((a, b) => strcmp(a.id, b.id));
		decorations.sort((a, b) => strcmp(a.id, b.id));
		assert.deepStrictEqual(actualDecorations, decorations);

		const newIds = model.deltaDecorations(initialIds, newDecorations.map(toModelDeltaDecoration));
		const actualNewDecorations = readModelDecorations(model, newIds);

		assert.strictEqual(newIds.length, newDecorations.length, 'returns expected cnt of ids');
		assert.strictEqual(newIds.length, model.getAllDecorations().length, 'does not leak decorations');
		actualNewDecorations.sort((a, b) => strcmp(a.id, b.id));
		newDecorations.sort((a, b) => strcmp(a.id, b.id));
		assert.deepStrictEqual(actualDecorations, decorations);

		model.dispose();
	}

	function range(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number): Range {
		return new Range(startLineNumber, startColumn, endLineNumber, endColumn);
	}

	test('result respects input', () => {
		const model = createTextModel([
			'Hello world,',
			'How are you?'
		].join('\n'));

		const ids = model.deltaDecorations([], [
			toModelDeltaDecoration(decoration('a', 1, 1, 1, 12)),
			toModelDeltaDecoration(decoration('b', 2, 1, 2, 13))
		]);

		assert.deepStrictEqual(model.getDecorationRange(ids[0]), range(1, 1, 1, 12));
		assert.deepStrictEqual(model.getDecorationRange(ids[1]), range(2, 1, 2, 13));

		model.dispose();
	});

	test('deltaDecorations 1', () => {
		testDeltaDecorations(
			[
				'This is a text',
				'That has multiple lines',
				'And is very friendly',
				'Towards testing'
			],
			[
				decoration('a', 1, 1, 1, 2),
				decoration('b', 1, 1, 1, 15),
				decoration('c', 1, 1, 2, 1),
				decoration('d', 1, 1, 2, 24),
				decoration('e', 2, 1, 2, 24),
				decoration('f', 2, 1, 4, 16)
			],
			[
				decoration('x', 1, 1, 1, 2),
				decoration('b', 1, 1, 1, 15),
				decoration('c', 1, 1, 2, 1),
				decoration('d', 1, 1, 2, 24),
				decoration('e', 2, 1, 2, 21),
				decoration('f', 2, 17, 4, 16)
			]
		);
	});

	test('deltaDecorations 2', () => {
		testDeltaDecorations(
			[
				'This is a text',
				'That has multiple lines',
				'And is very friendly',
				'Towards testing'
			],
			[
				decoration('a', 1, 1, 1, 2),
				decoration('b', 1, 2, 1, 3),
				decoration('c', 1, 3, 1, 4),
				decoration('d', 1, 4, 1, 5),
				decoration('e', 1, 5, 1, 6)
			],
			[
				decoration('a', 1, 2, 1, 3),
				decoration('b', 1, 3, 1, 4),
				decoration('c', 1, 4, 1, 5),
				decoration('d', 1, 5, 1, 6)
			]
		);
	});

	test('deltaDecorations 3', () => {
		testDeltaDecorations(
			[
				'This is a text',
				'That has multiple lines',
				'And is very friendly',
				'Towards testing'
			],
			[
				decoration('a', 1, 1, 1, 2),
				decoration('b', 1, 2, 1, 3),
				decoration('c', 1, 3, 1, 4),
				decoration('d', 1, 4, 1, 5),
				decoration('e', 1, 5, 1, 6)
			],
			[]
		);
	});

	test('issue #4317: editor.setDecorations doesn\'t update the hover message', () => {

		const model = createTextModel('Hello world!');

		let ids = model.deltaDecorations([], [{
			range: {
				startLineNumber: 1,
				startColumn: 1,
				endLineNumber: 100,
				endColumn: 1
			},
			options: {
				description: 'test',
				hoverMessage: { value: 'hello1' }
			}
		}]);

		ids = model.deltaDecorations(ids, [{
			range: {
				startLineNumber: 1,
				startColumn: 1,
				endLineNumber: 100,
				endColumn: 1
			},
			options: {
				description: 'test',
				hoverMessage: { value: 'hello2' }
			}
		}]);

		const actualDecoration = model.getDecorationOptions(ids[0]);

		assert.deepStrictEqual(actualDecoration!.hoverMessage, { value: 'hello2' });

		model.dispose();
	});

	test('model doesn\'t get confused with individual tracked ranges', () => {
		const model = createTextModel([
			'Hello world,',
			'How are you?'
		].join('\n'));

		const trackedRangeId = model.changeDecorations((changeAcessor) => {
			return changeAcessor.addDecoration(
				{
					startLineNumber: 1,
					startColumn: 1,
					endLineNumber: 1,
					endColumn: 1
				},
				{
					description: 'test',
					stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
				}
			);
		});
		model.changeDecorations((changeAccessor) => {
			changeAccessor.removeDecoration(trackedRangeId!);
		});

		let ids = model.deltaDecorations([], [
			toModelDeltaDecoration(decoration('a', 1, 1, 1, 12)),
			toModelDeltaDecoration(decoration('b', 2, 1, 2, 13))
		]);

		assert.deepStrictEqual(model.getDecorationRange(ids[0]), range(1, 1, 1, 12));
		assert.deepStrictEqual(model.getDecorationRange(ids[1]), range(2, 1, 2, 13));

		ids = model.deltaDecorations(ids, [
			toModelDeltaDecoration(decoration('a', 1, 1, 1, 12)),
			toModelDeltaDecoration(decoration('b', 2, 1, 2, 13))
		]);

		assert.deepStrictEqual(model.getDecorationRange(ids[0]), range(1, 1, 1, 12));
		assert.deepStrictEqual(model.getDecorationRange(ids[1]), range(2, 1, 2, 13));

		model.dispose();
	});

	test('issue #16922: Clicking on link doesn\'t seem to do anything', () => {
		const model = createTextModel([
			'Hello world,',
			'How are you?',
			'Fine.',
			'Good.',
		].join('\n'));

		model.deltaDecorations([], [
			{ range: new Range(1, 1, 1, 1), options: { description: 'test', className: '1' } },
			{ range: new Range(1, 13, 1, 13), options: { description: 'test', className: '2' } },
			{ range: new Range(2, 1, 2, 1), options: { description: 'test', className: '3' } },
			{ range: new Range(2, 1, 2, 4), options: { description: 'test', className: '4' } },
			{ range: new Range(2, 8, 2, 13), options: { description: 'test', className: '5' } },
			{ range: new Range(3, 1, 4, 6), options: { description: 'test', className: '6' } },
			{ range: new Range(1, 1, 3, 6), options: { description: 'test', className: 'x1' } },
			{ range: new Range(2, 5, 2, 8), options: { description: 'test', className: 'x2' } },
			{ range: new Range(1, 1, 2, 8), options: { description: 'test', className: 'x3' } },
			{ range: new Range(2, 5, 3, 1), options: { description: 'test', className: 'x4' } },
		]);

		const inRange = model.getDecorationsInRange(new Range(2, 6, 2, 6));

		const inRangeClassNames = inRange.map(d => d.options.className);
		inRangeClassNames.sort();
		assert.deepStrictEqual(inRangeClassNames, ['x1', 'x2', 'x3', 'x4']);

		model.dispose();
	});

	test('issue #41492: URL highlighting persists after pasting over url', () => {

		const model = createTextModel([
			'My First Line'
		].join('\n'));

		const id = model.deltaDecorations([], [{ range: new Range(1, 2, 1, 14), options: { description: 'test', stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, collapseOnReplaceEdit: true } }])[0];
		model.applyEdits([{
			range: new Range(1, 1, 1, 14),
			text: 'Some new text that is longer than the previous one',
			forceMoveMarkers: false
		}]);
		const actual = model.getDecorationRange(id);
		assert.deepStrictEqual(actual, new Range(1, 1, 1, 1));

		model.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/modelEditOperation.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/modelEditOperation.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Range } from '../../../common/core/range.js';
import { TextModel } from '../../../common/model/textModel.js';
import { createTextModel } from '../testTextModel.js';

suite('Editor Model - Model Edit Operation', () => {
	const LINE1 = 'My First Line';
	const LINE2 = '\t\tMy Second Line';
	const LINE3 = '    Third Line';
	const LINE4 = '';
	const LINE5 = '1';

	let model: TextModel;

	setup(() => {
		const text =
			LINE1 + '\r\n' +
			LINE2 + '\n' +
			LINE3 + '\n' +
			LINE4 + '\r\n' +
			LINE5;
		model = createTextModel(text);
	});

	teardown(() => {
		model.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function createSingleEditOp(text: string, positionLineNumber: number, positionColumn: number, selectionLineNumber: number = positionLineNumber, selectionColumn: number = positionColumn): ISingleEditOperation {
		const range = new Range(
			selectionLineNumber,
			selectionColumn,
			positionLineNumber,
			positionColumn
		);

		return {
			range: range,
			text: text,
			forceMoveMarkers: false
		};
	}

	function assertSingleEditOp(singleEditOp: ISingleEditOperation, editedLines: string[]) {
		const editOp = [singleEditOp];

		const inverseEditOp = model.applyEdits(editOp, true);

		assert.strictEqual(model.getLineCount(), editedLines.length);
		for (let i = 0; i < editedLines.length; i++) {
			assert.strictEqual(model.getLineContent(i + 1), editedLines[i]);
		}

		const originalOp = model.applyEdits(inverseEditOp, true);

		assert.strictEqual(model.getLineCount(), 5);
		assert.strictEqual(model.getLineContent(1), LINE1);
		assert.strictEqual(model.getLineContent(2), LINE2);
		assert.strictEqual(model.getLineContent(3), LINE3);
		assert.strictEqual(model.getLineContent(4), LINE4);
		assert.strictEqual(model.getLineContent(5), LINE5);

		const simplifyEdit = (edit: ISingleEditOperation) => {
			return {
				range: edit.range,
				text: edit.text,
				forceMoveMarkers: edit.forceMoveMarkers || false
			};
		};
		assert.deepStrictEqual(originalOp.map(simplifyEdit), editOp.map(simplifyEdit));
	}

	test('Insert inline', () => {
		assertSingleEditOp(
			createSingleEditOp('a', 1, 1),
			[
				'aMy First Line',
				LINE2,
				LINE3,
				LINE4,
				LINE5
			]
		);
	});

	test('Replace inline/inline 1', () => {
		assertSingleEditOp(
			createSingleEditOp(' incredibly awesome', 1, 3),
			[
				'My incredibly awesome First Line',
				LINE2,
				LINE3,
				LINE4,
				LINE5
			]
		);
	});

	test('Replace inline/inline 2', () => {
		assertSingleEditOp(
			createSingleEditOp(' with text at the end.', 1, 14),
			[
				'My First Line with text at the end.',
				LINE2,
				LINE3,
				LINE4,
				LINE5
			]
		);
	});

	test('Replace inline/inline 3', () => {
		assertSingleEditOp(
			createSingleEditOp('My new First Line.', 1, 1, 1, 14),
			[
				'My new First Line.',
				LINE2,
				LINE3,
				LINE4,
				LINE5
			]
		);
	});

	test('Replace inline/multi line 1', () => {
		assertSingleEditOp(
			createSingleEditOp('My new First Line.', 1, 1, 3, 15),
			[
				'My new First Line.',
				LINE4,
				LINE5
			]
		);
	});

	test('Replace inline/multi line 2', () => {
		assertSingleEditOp(
			createSingleEditOp('My new First Line.', 1, 2, 3, 15),
			[
				'MMy new First Line.',
				LINE4,
				LINE5
			]
		);
	});

	test('Replace inline/multi line 3', () => {
		assertSingleEditOp(
			createSingleEditOp('My new First Line.', 1, 2, 3, 2),
			[
				'MMy new First Line.   Third Line',
				LINE4,
				LINE5
			]
		);
	});

	test('Replace muli line/multi line', () => {
		assertSingleEditOp(
			createSingleEditOp('1\n2\n3\n4\n', 1, 1),
			[
				'1',
				'2',
				'3',
				'4',
				LINE1,
				LINE2,
				LINE3,
				LINE4,
				LINE5
			]
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/modelInjectedText.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/modelInjectedText.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { EditOperation } from '../../../common/core/editOperation.js';
import { Range } from '../../../common/core/range.js';
import { InternalModelContentChangeEvent, LineInjectedText, ModelRawChange, RawContentChangedType } from '../../../common/textModelEvents.js';
import { createTextModel } from '../testTextModel.js';

suite('Editor Model - Injected Text Events', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('Basic', () => {
		const thisModel = store.add(createTextModel('First Line\nSecond Line'));

		const recordedChanges = new Array<unknown>();

		store.add(thisModel.onDidChangeContentOrInjectedText((e) => {
			const changes = (e instanceof InternalModelContentChangeEvent ? e.rawContentChangedEvent.changes : e.changes);
			for (const change of changes) {
				recordedChanges.push(mapChange(change));
			}
		}));

		// Initial decoration
		let decorations = thisModel.deltaDecorations([], [{
			options: {
				after: { content: 'injected1' },
				description: 'test1',
				showIfCollapsed: true
			},
			range: new Range(1, 1, 1, 1),
		}]);
		assert.deepStrictEqual(recordedChanges.splice(0), [
			{
				kind: 'lineChanged',
				line: '[injected1]First Line',
				lineNumber: 1,
			}
		]);

		// Decoration change
		decorations = thisModel.deltaDecorations(decorations, [{
			options: {
				after: { content: 'injected1' },
				description: 'test1',
				showIfCollapsed: true
			},
			range: new Range(2, 1, 2, 1),
		}, {
			options: {
				after: { content: 'injected2' },
				description: 'test2',
				showIfCollapsed: true
			},
			range: new Range(2, 2, 2, 2),
		}]);
		assert.deepStrictEqual(recordedChanges.splice(0), [
			{
				kind: 'lineChanged',
				line: 'First Line',
				lineNumber: 1,
			},
			{
				kind: 'lineChanged',
				line: '[injected1]S[injected2]econd Line',
				lineNumber: 2,
			}
		]);

		// Simple Insert
		thisModel.applyEdits([EditOperation.replace(new Range(2, 2, 2, 2), 'Hello')]);
		assert.deepStrictEqual(recordedChanges.splice(0), [
			{
				kind: 'lineChanged',
				line: '[injected1]SHello[injected2]econd Line',
				lineNumber: 2,
			}
		]);

		// Multi-Line Insert
		thisModel.pushEditOperations(null, [EditOperation.replace(new Range(2, 2, 2, 2), '\n\n\n')], null);
		assert.deepStrictEqual(thisModel.getAllDecorations(undefined).map(d => ({ description: d.options.description, range: d.range.toString() })), [{
			'description': 'test1',
			'range': '[2,1 -> 2,1]'
		},
		{
			'description': 'test2',
			'range': '[2,2 -> 5,6]'
		}]);
		assert.deepStrictEqual(recordedChanges.splice(0), [
			{
				kind: 'lineChanged',
				line: '[injected1]S',
				lineNumber: 2,
			},
			{
				fromLineNumber: 3,
				kind: 'linesInserted',
				lines: [
					'',
					'',
					'Hello[injected2]econd Line',
				]
			}
		]);


		// Multi-Line Replace
		thisModel.pushEditOperations(null, [EditOperation.replace(new Range(3, 1, 5, 1), '\n\n\n\n\n\n\n\n\n\n\n\n\n')], null);
		assert.deepStrictEqual(recordedChanges.splice(0), [
			{
				'kind': 'lineChanged',
				'line': '',
				'lineNumber': 5,
			},
			{
				'kind': 'lineChanged',
				'line': '',
				'lineNumber': 4,
			},
			{
				'kind': 'lineChanged',
				'line': '',
				'lineNumber': 3,
			},
			{
				'fromLineNumber': 6,
				'kind': 'linesInserted',
				'lines': [
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'Hello[injected2]econd Line',
				]
			}
		]);

		// Multi-Line Replace undo
		assert.strictEqual(thisModel.undo(), undefined);
		assert.deepStrictEqual(recordedChanges.splice(0), [
			{
				kind: 'lineChanged',
				line: '[injected1]SHello[injected2]econd Line',
				lineNumber: 2,
			},
			{
				kind: 'linesDeleted',
			}
		]);
	});
});

function mapChange(change: ModelRawChange): unknown {
	if (change.changeType === RawContentChangedType.LineChanged) {
		(change.injectedText || []).every(e => {
			assert.deepStrictEqual(e.lineNumber, change.lineNumber);
		});

		return {
			kind: 'lineChanged',
			line: getDetail(change.detail, change.injectedText),
			lineNumber: change.lineNumber,
		};
	} else if (change.changeType === RawContentChangedType.LinesInserted) {
		return {
			kind: 'linesInserted',
			lines: change.detail.map((e, idx) => getDetail(e, change.injectedTexts[idx])),
			fromLineNumber: change.fromLineNumber
		};
	} else if (change.changeType === RawContentChangedType.LinesDeleted) {
		return {
			kind: 'linesDeleted',
		};
	} else if (change.changeType === RawContentChangedType.EOLChanged) {
		return {
			kind: 'eolChanged'
		};
	} else if (change.changeType === RawContentChangedType.Flush) {
		return {
			kind: 'flush'
		};
	}
	return { kind: 'unknown' };
}

function getDetail(line: string, injectedTexts: LineInjectedText[] | null): string {
	return LineInjectedText.applyInjectedText(line, (injectedTexts || []).map(t => t.withText(`[${t.options.content}]`)));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/textChange.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/textChange.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { compressConsecutiveTextChanges, TextChange } from '../../../common/core/textChange.js';

const GENERATE_TESTS = false;

interface IGeneratedEdit {
	offset: number;
	length: number;
	text: string;
}

suite('TextChangeCompressor', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function getResultingContent(initialContent: string, edits: IGeneratedEdit[]): string {
		let content = initialContent;
		for (let i = edits.length - 1; i >= 0; i--) {
			content = (
				content.substring(0, edits[i].offset) +
				edits[i].text +
				content.substring(edits[i].offset + edits[i].length)
			);
		}
		return content;
	}

	function getTextChanges(initialContent: string, edits: IGeneratedEdit[]): TextChange[] {
		let content = initialContent;
		const changes: TextChange[] = new Array<TextChange>(edits.length);
		let deltaOffset = 0;

		for (let i = 0; i < edits.length; i++) {
			const edit = edits[i];

			const position = edit.offset + deltaOffset;
			const length = edit.length;
			const text = edit.text;

			const oldText = content.substr(position, length);

			content = (
				content.substr(0, position) +
				text +
				content.substr(position + length)
			);

			changes[i] = new TextChange(edit.offset, oldText, position, text);

			deltaOffset += text.length - length;
		}

		return changes;
	}

	function assertCompression(initialText: string, edit1: IGeneratedEdit[], edit2: IGeneratedEdit[]): void {

		const tmpText = getResultingContent(initialText, edit1);
		const chg1 = getTextChanges(initialText, edit1);

		const finalText = getResultingContent(tmpText, edit2);
		const chg2 = getTextChanges(tmpText, edit2);

		const compressedTextChanges = compressConsecutiveTextChanges(chg1, chg2);

		// Check that the compression was correct
		const compressedDoTextEdits: IGeneratedEdit[] = compressedTextChanges.map((change) => {
			return {
				offset: change.oldPosition,
				length: change.oldLength,
				text: change.newText
			};
		});
		const actualDoResult = getResultingContent(initialText, compressedDoTextEdits);
		assert.strictEqual(actualDoResult, finalText);

		const compressedUndoTextEdits: IGeneratedEdit[] = compressedTextChanges.map((change) => {
			return {
				offset: change.newPosition,
				length: change.newLength,
				text: change.oldText
			};
		});
		const actualUndoResult = getResultingContent(finalText, compressedUndoTextEdits);
		assert.strictEqual(actualUndoResult, initialText);
	}

	test('simple 1', () => {
		assertCompression(
			'',
			[{ offset: 0, length: 0, text: 'h' }],
			[{ offset: 1, length: 0, text: 'e' }]
		);
	});

	test('simple 2', () => {
		assertCompression(
			'|',
			[{ offset: 0, length: 0, text: 'h' }],
			[{ offset: 2, length: 0, text: 'e' }]
		);
	});

	test('complex1', () => {
		assertCompression(
			'abcdefghij',
			[
				{ offset: 0, length: 3, text: 'qh' },
				{ offset: 5, length: 0, text: '1' },
				{ offset: 8, length: 2, text: 'X' }
			],
			[
				{ offset: 1, length: 0, text: 'Z' },
				{ offset: 3, length: 3, text: 'Y' },
			]
		);
	});

	// test('issue #118041', () => {
	// 	assertCompression(
	// 		'﻿',
	// 		[
	// 			{ offset: 0, length: 1, text: '' },
	// 		],
	// 		[
	// 			{ offset: 1, length: 0, text: 'Z' },
	// 			{ offset: 3, length: 3, text: 'Y' },
	// 		]
	// 	);
	// })

	test('gen1', () => {
		assertCompression(
			'kxm',
			[{ offset: 0, length: 1, text: 'tod_neu' }],
			[{ offset: 1, length: 2, text: 'sag_e' }]
		);
	});

	test('gen2', () => {
		assertCompression(
			'kpb_r_v',
			[{ offset: 5, length: 2, text: 'a_jvf_l' }],
			[{ offset: 10, length: 2, text: 'w' }]
		);
	});

	test('gen3', () => {
		assertCompression(
			'slu_w',
			[{ offset: 4, length: 1, text: '_wfw' }],
			[{ offset: 3, length: 5, text: '' }]
		);
	});

	test('gen4', () => {
		assertCompression(
			'_e',
			[{ offset: 2, length: 0, text: 'zo_b' }],
			[{ offset: 1, length: 3, text: 'tra' }]
		);
	});

	test('gen5', () => {
		assertCompression(
			'ssn_',
			[{ offset: 0, length: 2, text: 'tat_nwe' }],
			[{ offset: 2, length: 6, text: 'jm' }]
		);
	});

	test('gen6', () => {
		assertCompression(
			'kl_nru',
			[{ offset: 4, length: 1, text: '' }],
			[{ offset: 1, length: 4, text: '__ut' }]
		);
	});

	const _a = 'a'.charCodeAt(0);
	const _z = 'z'.charCodeAt(0);

	function getRandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getRandomString(minLength: number, maxLength: number): string {
		const length = getRandomInt(minLength, maxLength);
		let r = '';
		for (let i = 0; i < length; i++) {
			r += String.fromCharCode(getRandomInt(_a, _z));
		}
		return r;
	}

	function getRandomEOL(): string {
		switch (getRandomInt(1, 3)) {
			case 1: return '\r';
			case 2: return '\n';
			case 3: return '\r\n';
		}
		throw new Error(`not possible`);
	}

	function getRandomBuffer(small: boolean): string {
		const lineCount = getRandomInt(1, small ? 3 : 10);
		const lines: string[] = [];
		for (let i = 0; i < lineCount; i++) {
			lines.push(getRandomString(0, small ? 3 : 10) + getRandomEOL());
		}
		return lines.join('');
	}

	function getRandomEdits(content: string, min: number = 1, max: number = 5): IGeneratedEdit[] {

		const result: IGeneratedEdit[] = [];
		let cnt = getRandomInt(min, max);

		let maxOffset = content.length;

		while (cnt > 0 && maxOffset > 0) {

			const offset = getRandomInt(0, maxOffset);
			const length = getRandomInt(0, maxOffset - offset);
			const text = getRandomBuffer(true);

			result.push({
				offset: offset,
				length: length,
				text: text
			});

			maxOffset = offset;
			cnt--;
		}

		result.reverse();

		return result;
	}

	class GeneratedTest {

		private readonly _content: string;
		private readonly _edits1: IGeneratedEdit[];
		private readonly _edits2: IGeneratedEdit[];

		constructor() {
			this._content = getRandomBuffer(false).replace(/\n/g, '_');
			this._edits1 = getRandomEdits(this._content, 1, 5).map((e) => { return { offset: e.offset, length: e.length, text: e.text.replace(/\n/g, '_') }; });
			const tmp = getResultingContent(this._content, this._edits1);
			this._edits2 = getRandomEdits(tmp, 1, 5).map((e) => { return { offset: e.offset, length: e.length, text: e.text.replace(/\n/g, '_') }; });
		}

		public print(): void {
			console.log(`assertCompression(${JSON.stringify(this._content)}, ${JSON.stringify(this._edits1)}, ${JSON.stringify(this._edits2)});`);
		}

		public assert(): void {
			assertCompression(this._content, this._edits1, this._edits2);
		}
	}

	if (GENERATE_TESTS) {
		let testNumber = 0;
		while (true) {
			testNumber++;
			console.log(`------RUNNING TextChangeCompressor TEST ${testNumber}`);
			const test = new GeneratedTest();
			try {
				test.assert();
			} catch (err) {
				console.log(err);
				test.print();
				break;
			}
		}
	}
});

suite('TextChange', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #118041: unicode character undo bug', () => {
		const textChange = new TextChange(428, '﻿', 428, '');
		const buff = new Uint8Array(textChange.writeSize());
		textChange.write(buff, 0);
		const actual: TextChange[] = [];
		TextChange.read(buff, 0, actual);
		assert.deepStrictEqual(actual[0], textChange);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/textModel.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/textModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { UTF8_BOM_CHARACTER } from '../../../../base/common/strings.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../common/languages/modesRegistry.js';
import { EndOfLinePreference } from '../../../common/model.js';
import { TextModel, createTextBuffer } from '../../../common/model/textModel.js';
import { createModelServices, createTextModel } from '../testTextModel.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';

function testGuessIndentation(defaultInsertSpaces: boolean, defaultTabSize: number, expectedInsertSpaces: boolean, expectedTabSize: number, text: string[], msg?: string): void {
	const m = createTextModel(
		text.join('\n'),
		undefined,
		{
			tabSize: defaultTabSize,
			insertSpaces: defaultInsertSpaces,
			detectIndentation: true
		}
	);
	const r = m.getOptions();
	m.dispose();

	assert.strictEqual(r.insertSpaces, expectedInsertSpaces, msg);
	assert.strictEqual(r.tabSize, expectedTabSize, msg);
}

function assertGuess(expectedInsertSpaces: boolean | undefined, expectedTabSize: number | undefined | [number], text: string[], msg?: string): void {
	if (typeof expectedInsertSpaces === 'undefined') {
		// cannot guess insertSpaces
		if (typeof expectedTabSize === 'undefined') {
			// cannot guess tabSize
			testGuessIndentation(true, 13370, true, 13370, text, msg);
			testGuessIndentation(false, 13371, false, 13371, text, msg);
		} else if (typeof expectedTabSize === 'number') {
			// can guess tabSize
			testGuessIndentation(true, 13370, true, expectedTabSize, text, msg);
			testGuessIndentation(false, 13371, false, expectedTabSize, text, msg);
		} else {
			// can only guess tabSize when insertSpaces is true
			testGuessIndentation(true, 13370, true, expectedTabSize[0], text, msg);
			testGuessIndentation(false, 13371, false, 13371, text, msg);
		}
	} else {
		// can guess insertSpaces
		if (typeof expectedTabSize === 'undefined') {
			// cannot guess tabSize
			testGuessIndentation(true, 13370, expectedInsertSpaces, 13370, text, msg);
			testGuessIndentation(false, 13371, expectedInsertSpaces, 13371, text, msg);
		} else if (typeof expectedTabSize === 'number') {
			// can guess tabSize
			testGuessIndentation(true, 13370, expectedInsertSpaces, expectedTabSize, text, msg);
			testGuessIndentation(false, 13371, expectedInsertSpaces, expectedTabSize, text, msg);
		} else {
			// can only guess tabSize when insertSpaces is true
			if (expectedInsertSpaces === true) {
				testGuessIndentation(true, 13370, expectedInsertSpaces, expectedTabSize[0], text, msg);
				testGuessIndentation(false, 13371, expectedInsertSpaces, expectedTabSize[0], text, msg);
			} else {
				testGuessIndentation(true, 13370, expectedInsertSpaces, 13370, text, msg);
				testGuessIndentation(false, 13371, expectedInsertSpaces, 13371, text, msg);
			}
		}
	}
}

suite('TextModelData.fromString', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	interface ITextBufferData {
		EOL: string;
		lines: string[];
		containsRTL: boolean;
		isBasicASCII: boolean;
	}

	function testTextModelDataFromString(text: string, expected: ITextBufferData): void {
		const { textBuffer, disposable } = createTextBuffer(text, TextModel.DEFAULT_CREATION_OPTIONS.defaultEOL);
		const actual: ITextBufferData = {
			EOL: textBuffer.getEOL(),
			lines: textBuffer.getLinesContent(),
			containsRTL: textBuffer.mightContainRTL(),
			isBasicASCII: !textBuffer.mightContainNonBasicASCII()
		};
		assert.deepStrictEqual(actual, expected);
		disposable.dispose();
	}

	test('one line text', () => {
		testTextModelDataFromString('Hello world!',
			{
				EOL: '\n',
				lines: [
					'Hello world!'
				],
				containsRTL: false,
				isBasicASCII: true
			}
		);
	});

	test('multiline text', () => {
		testTextModelDataFromString('Hello,\r\ndear friend\nHow\rare\r\nyou?',
			{
				EOL: '\r\n',
				lines: [
					'Hello,',
					'dear friend',
					'How',
					'are',
					'you?'
				],
				containsRTL: false,
				isBasicASCII: true
			}
		);
	});

	test('Non Basic ASCII 1', () => {
		testTextModelDataFromString('Hello,\nZürich',
			{
				EOL: '\n',
				lines: [
					'Hello,',
					'Zürich'
				],
				containsRTL: false,
				isBasicASCII: false
			}
		);
	});

	test('containsRTL 1', () => {
		testTextModelDataFromString('Hello,\nזוהי עובדה מבוססת שדעתו',
			{
				EOL: '\n',
				lines: [
					'Hello,',
					'זוהי עובדה מבוססת שדעתו'
				],
				containsRTL: true,
				isBasicASCII: false
			}
		);
	});

	test('containsRTL 2', () => {
		testTextModelDataFromString('Hello,\nهناك حقيقة مثبتة منذ زمن طويل',
			{
				EOL: '\n',
				lines: [
					'Hello,',
					'هناك حقيقة مثبتة منذ زمن طويل'
				],
				containsRTL: true,
				isBasicASCII: false
			}
		);
	});

});

suite('Editor Model - TextModel', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('TextModel does not use events internally', () => {
		// Make sure that all model parts receive text model events explicitly
		// to avoid that by any chance an outside listener receives events before
		// the parts and thus are able to access the text model in an inconsistent state.
		//
		// We simply check that there are no listeners attached to text model
		// after instantiation
		const disposables = new DisposableStore();
		const instantiationService: IInstantiationService = createModelServices(disposables);
		const textModel = disposables.add(instantiationService.createInstance(TextModel, '', PLAINTEXT_LANGUAGE_ID, TextModel.DEFAULT_CREATION_OPTIONS, null));
		assert.strictEqual(textModel._hasListeners(), false);
		disposables.dispose();
	});

	test('getValueLengthInRange', () => {

		let m = createTextModel('My First Line\r\nMy Second Line\r\nMy Third Line');
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 1, 1)), ''.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 1, 2)), 'M'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 2, 1, 3)), 'y'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 1, 14)), 'My First Line'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 2, 1)), 'My First Line\r\n'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 2, 2, 1)), 'y First Line\r\n'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 2, 2, 2)), 'y First Line\r\nM'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 2, 2, 1000)), 'y First Line\r\nMy Second Line'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 2, 3, 1)), 'y First Line\r\nMy Second Line\r\n'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 2, 3, 1000)), 'y First Line\r\nMy Second Line\r\nMy Third Line'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 1000, 1000)), 'My First Line\r\nMy Second Line\r\nMy Third Line'.length);
		m.dispose();

		m = createTextModel('My First Line\nMy Second Line\nMy Third Line');
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 1, 1)), ''.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 1, 2)), 'M'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 2, 1, 3)), 'y'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 1, 14)), 'My First Line'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 2, 1)), 'My First Line\n'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 2, 2, 1)), 'y First Line\n'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 2, 2, 2)), 'y First Line\nM'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 2, 2, 1000)), 'y First Line\nMy Second Line'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 2, 3, 1)), 'y First Line\nMy Second Line\n'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 2, 3, 1000)), 'y First Line\nMy Second Line\nMy Third Line'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 1000, 1000)), 'My First Line\nMy Second Line\nMy Third Line'.length);
		m.dispose();
	});

	test('getValueLengthInRange different EOL', () => {

		let m = createTextModel('My First Line\r\nMy Second Line\r\nMy Third Line');
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 2, 1), EndOfLinePreference.TextDefined), 'My First Line\r\n'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 2, 1), EndOfLinePreference.CRLF), 'My First Line\r\n'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 2, 1), EndOfLinePreference.LF), 'My First Line\n'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 1000, 1000), EndOfLinePreference.TextDefined), 'My First Line\r\nMy Second Line\r\nMy Third Line'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 1000, 1000), EndOfLinePreference.CRLF), 'My First Line\r\nMy Second Line\r\nMy Third Line'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 1000, 1000), EndOfLinePreference.LF), 'My First Line\nMy Second Line\nMy Third Line'.length);
		m.dispose();

		m = createTextModel('My First Line\nMy Second Line\nMy Third Line');
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 2, 1), EndOfLinePreference.TextDefined), 'My First Line\n'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 2, 1), EndOfLinePreference.LF), 'My First Line\n'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 2, 1), EndOfLinePreference.CRLF), 'My First Line\r\n'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 1000, 1000), EndOfLinePreference.TextDefined), 'My First Line\nMy Second Line\nMy Third Line'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 1000, 1000), EndOfLinePreference.LF), 'My First Line\nMy Second Line\nMy Third Line'.length);
		assert.strictEqual(m.getValueLengthInRange(new Range(1, 1, 1000, 1000), EndOfLinePreference.CRLF), 'My First Line\r\nMy Second Line\r\nMy Third Line'.length);
		m.dispose();
	});

	test('guess indentation 1', () => {

		assertGuess(undefined, undefined, [
			'x',
			'x',
			'x',
			'x',
			'x',
			'x',
			'x'
		], 'no clues');

		assertGuess(false, undefined, [
			'\tx',
			'x',
			'x',
			'x',
			'x',
			'x',
			'x'
		], 'no spaces, 1xTAB');

		assertGuess(true, 2, [
			'  x',
			'x',
			'x',
			'x',
			'x',
			'x',
			'x'
		], '1x2');

		assertGuess(false, undefined, [
			'\tx',
			'\tx',
			'\tx',
			'\tx',
			'\tx',
			'\tx',
			'\tx'
		], '7xTAB');

		assertGuess(undefined, [2], [
			'\tx',
			'  x',
			'\tx',
			'  x',
			'\tx',
			'  x',
			'\tx',
			'  x',
		], '4x2, 4xTAB');
		assertGuess(false, undefined, [
			'\tx',
			' x',
			'\tx',
			' x',
			'\tx',
			' x',
			'\tx',
			' x'
		], '4x1, 4xTAB');
		assertGuess(false, undefined, [
			'\tx',
			'\tx',
			'  x',
			'\tx',
			'  x',
			'\tx',
			'  x',
			'\tx',
			'  x',
		], '4x2, 5xTAB');
		assertGuess(false, undefined, [
			'\tx',
			'\tx',
			'x',
			'\tx',
			'x',
			'\tx',
			'x',
			'\tx',
			'  x',
		], '1x2, 5xTAB');
		assertGuess(false, undefined, [
			'\tx',
			'\tx',
			'x',
			'\tx',
			'x',
			'\tx',
			'x',
			'\tx',
			'    x',
		], '1x4, 5xTAB');
		assertGuess(false, undefined, [
			'\tx',
			'\tx',
			'x',
			'\tx',
			'x',
			'\tx',
			'  x',
			'\tx',
			'    x',
		], '1x2, 1x4, 5xTAB');

		assertGuess(undefined, undefined, [
			'x',
			' x',
			' x',
			' x',
			' x',
			' x',
			' x',
			' x'
		], '7x1 - 1 space is never guessed as an indentation');
		assertGuess(true, undefined, [
			'x',
			'          x',
			' x',
			' x',
			' x',
			' x',
			' x',
			' x'
		], '1x10, 6x1');
		assertGuess(undefined, undefined, [
			'',
			'  ',
			'    ',
			'      ',
			'        ',
			'          ',
			'            ',
			'              ',
		], 'whitespace lines don\'t count');
		assertGuess(true, 3, [
			'x',
			'   x',
			'   x',
			'    x',
			'x',
			'   x',
			'   x',
			'    x',
			'x',
			'   x',
			'   x',
			'    x',
		], '6x3, 3x4');
		assertGuess(true, 5, [
			'x',
			'     x',
			'     x',
			'    x',
			'x',
			'     x',
			'     x',
			'    x',
			'x',
			'     x',
			'     x',
			'    x',
		], '6x5, 3x4');
		assertGuess(true, 7, [
			'x',
			'       x',
			'       x',
			'     x',
			'x',
			'       x',
			'       x',
			'    x',
			'x',
			'       x',
			'       x',
			'    x',
		], '6x7, 1x5, 2x4');
		assertGuess(true, 2, [
			'x',
			'  x',
			'  x',
			'  x',
			'  x',
			'x',
			'  x',
			'  x',
			'  x',
			'  x',
		], '8x2');

		assertGuess(true, 2, [
			'x',
			'  x',
			'  x',
			'x',
			'  x',
			'  x',
			'x',
			'  x',
			'  x',
			'x',
			'  x',
			'  x',
		], '8x2');
		assertGuess(true, 2, [
			'x',
			'  x',
			'    x',
			'x',
			'  x',
			'    x',
			'x',
			'  x',
			'    x',
			'x',
			'  x',
			'    x',
		], '4x2, 4x4');
		assertGuess(true, 2, [
			'x',
			'  x',
			'  x',
			'    x',
			'x',
			'  x',
			'  x',
			'    x',
			'x',
			'  x',
			'  x',
			'    x',
		], '6x2, 3x4');
		assertGuess(true, 2, [
			'x',
			'  x',
			'  x',
			'    x',
			'    x',
			'x',
			'  x',
			'  x',
			'    x',
			'    x',
		], '4x2, 4x4');
		assertGuess(true, 2, [
			'x',
			'  x',
			'    x',
			'    x',
			'x',
			'  x',
			'    x',
			'    x',
		], '2x2, 4x4');
		assertGuess(true, 4, [
			'x',
			'    x',
			'    x',
			'x',
			'    x',
			'    x',
			'x',
			'    x',
			'    x',
			'x',
			'    x',
			'    x',
		], '8x4');
		assertGuess(true, 2, [
			'x',
			'  x',
			'    x',
			'    x',
			'      x',
			'x',
			'  x',
			'    x',
			'    x',
			'      x',
		], '2x2, 4x4, 2x6');
		assertGuess(true, 2, [
			'x',
			'  x',
			'    x',
			'    x',
			'      x',
			'      x',
			'        x',
		], '1x2, 2x4, 2x6, 1x8');
		assertGuess(true, 4, [
			'x',
			'    x',
			'    x',
			'    x',
			'     x',
			'        x',
			'x',
			'    x',
			'    x',
			'    x',
			'     x',
			'        x',
		], '6x4, 2x5, 2x8');
		assertGuess(true, 4, [
			'x',
			'    x',
			'    x',
			'    x',
			'     x',
			'        x',
			'        x',
		], '3x4, 1x5, 2x8');
		assertGuess(true, 4, [
			'x',
			'x',
			'    x',
			'    x',
			'     x',
			'        x',
			'        x',
			'x',
			'x',
			'    x',
			'    x',
			'     x',
			'        x',
			'        x',
		], '6x4, 2x5, 4x8');
		assertGuess(true, 3, [
			'x',
			' x',
			' x',
			' x',
			' x',
			' x',
			'x',
			'   x',
			'    x',
			'    x',
		], '5x1, 2x0, 1x3, 2x4');
		assertGuess(false, undefined, [
			'\t x',
			' \t x',
			'\tx'
		], 'mixed whitespace 1');
		assertGuess(false, undefined, [
			'\tx',
			'\t    x'
		], 'mixed whitespace 2');
	});

	test('issue #44991: Wrong indentation size auto-detection', () => {
		assertGuess(true, 4, [
			'a = 10             # 0 space indent',
			'b = 5              # 0 space indent',
			'if a > 10:         # 0 space indent',
			'    a += 1         # 4 space indent      delta 4 spaces',
			'    if b > 5:      # 4 space indent',
			'        b += 1     # 8 space indent      delta 4 spaces',
			'        b += 1     # 8 space indent',
			'        b += 1     # 8 space indent',
			'# comment line 1   # 0 space indent      delta 8 spaces',
			'# comment line 2   # 0 space indent',
			'# comment line 3   # 0 space indent',
			'        b += 1     # 8 space indent      delta 8 spaces',
			'        b += 1     # 8 space indent',
			'        b += 1     # 8 space indent',
		]);
	});

	test('issue #55818: Broken indentation detection', () => {
		assertGuess(true, 2, [
			'',
			'/* REQUIRE */',
			'',
			'const foo = require ( \'foo\' ),',
			'      bar = require ( \'bar\' );',
			'',
			'/* MY FN */',
			'',
			'function myFn () {',
			'',
			'  const asd = 1,',
			'        dsa = 2;',
			'',
			'  return bar ( foo ( asd ) );',
			'',
			'}',
			'',
			'/* EXPORT */',
			'',
			'module.exports = myFn;',
			'',
		]);
	});

	test('issue #70832: Broken indentation detection', () => {
		assertGuess(false, undefined, [
			'x',
			'x',
			'x',
			'x',
			'	x',
			'		x',
			'    x',
			'		x',
			'	x',
			'		x',
			'	x',
			'	x',
			'	x',
			'	x',
			'x',
		]);
	});

	test('issue #62143: Broken indentation detection', () => {
		// works before the fix
		assertGuess(true, 2, [
			'x',
			'x',
			'  x',
			'  x'
		]);

		// works before the fix
		assertGuess(true, 2, [
			'x',
			'  - item2',
			'  - item3'
		]);

		// works before the fix
		testGuessIndentation(true, 2, true, 2, [
			'x x',
			'  x',
			'  x',
		]);

		// fails before the fix
		// empty space inline breaks the indentation guess
		testGuessIndentation(true, 2, true, 2, [
			'x x',
			'  x',
			'  x',
			'    x'
		]);

		testGuessIndentation(true, 2, true, 2, [
			'<!--test1.md -->',
			'- item1',
			'  - item2',
			'    - item3'
		]);
	});

	test('issue #84217: Broken indentation detection', () => {
		assertGuess(true, 4, [
			'def main():',
			'    print(\'hello\')',
		]);
		assertGuess(true, 4, [
			'def main():',
			'    with open(\'foo\') as fp:',
			'        print(fp.read())',
		]);
	});

	test('validatePosition', () => {

		const m = createTextModel('line one\nline two');

		assert.deepStrictEqual(m.validatePosition(new Position(0, 0)), new Position(1, 1));
		assert.deepStrictEqual(m.validatePosition(new Position(0, 1)), new Position(1, 1));

		assert.deepStrictEqual(m.validatePosition(new Position(1, 1)), new Position(1, 1));
		assert.deepStrictEqual(m.validatePosition(new Position(1, 2)), new Position(1, 2));
		assert.deepStrictEqual(m.validatePosition(new Position(1, 30)), new Position(1, 9));

		assert.deepStrictEqual(m.validatePosition(new Position(2, 0)), new Position(2, 1));
		assert.deepStrictEqual(m.validatePosition(new Position(2, 1)), new Position(2, 1));
		assert.deepStrictEqual(m.validatePosition(new Position(2, 2)), new Position(2, 2));
		assert.deepStrictEqual(m.validatePosition(new Position(2, 30)), new Position(2, 9));

		assert.deepStrictEqual(m.validatePosition(new Position(3, 0)), new Position(2, 9));
		assert.deepStrictEqual(m.validatePosition(new Position(3, 1)), new Position(2, 9));
		assert.deepStrictEqual(m.validatePosition(new Position(3, 30)), new Position(2, 9));

		assert.deepStrictEqual(m.validatePosition(new Position(30, 30)), new Position(2, 9));

		assert.deepStrictEqual(m.validatePosition(new Position(-123.123, -0.5)), new Position(1, 1));
		assert.deepStrictEqual(m.validatePosition(new Position(Number.MIN_VALUE, Number.MIN_VALUE)), new Position(1, 1));

		assert.deepStrictEqual(m.validatePosition(new Position(Number.MAX_VALUE, Number.MAX_VALUE)), new Position(2, 9));
		assert.deepStrictEqual(m.validatePosition(new Position(123.23, 47.5)), new Position(2, 9));

		m.dispose();
	});

	test('validatePosition around high-low surrogate pairs 1', () => {

		const m = createTextModel('a📚b');

		assert.deepStrictEqual(m.validatePosition(new Position(0, 0)), new Position(1, 1));
		assert.deepStrictEqual(m.validatePosition(new Position(0, 1)), new Position(1, 1));
		assert.deepStrictEqual(m.validatePosition(new Position(0, 7)), new Position(1, 1));

		assert.deepStrictEqual(m.validatePosition(new Position(1, 1)), new Position(1, 1));
		assert.deepStrictEqual(m.validatePosition(new Position(1, 2)), new Position(1, 2));
		assert.deepStrictEqual(m.validatePosition(new Position(1, 3)), new Position(1, 2));
		assert.deepStrictEqual(m.validatePosition(new Position(1, 4)), new Position(1, 4));
		assert.deepStrictEqual(m.validatePosition(new Position(1, 5)), new Position(1, 5));
		assert.deepStrictEqual(m.validatePosition(new Position(1, 30)), new Position(1, 5));

		assert.deepStrictEqual(m.validatePosition(new Position(2, 0)), new Position(1, 5));
		assert.deepStrictEqual(m.validatePosition(new Position(2, 1)), new Position(1, 5));
		assert.deepStrictEqual(m.validatePosition(new Position(2, 2)), new Position(1, 5));
		assert.deepStrictEqual(m.validatePosition(new Position(2, 30)), new Position(1, 5));

		assert.deepStrictEqual(m.validatePosition(new Position(-123.123, -0.5)), new Position(1, 1));
		assert.deepStrictEqual(m.validatePosition(new Position(Number.MIN_VALUE, Number.MIN_VALUE)), new Position(1, 1));

		assert.deepStrictEqual(m.validatePosition(new Position(Number.MAX_VALUE, Number.MAX_VALUE)), new Position(1, 5));
		assert.deepStrictEqual(m.validatePosition(new Position(123.23, 47.5)), new Position(1, 5));

		m.dispose();
	});

	test('validatePosition around high-low surrogate pairs 2', () => {

		const m = createTextModel('a📚📚b');

		assert.deepStrictEqual(m.validatePosition(new Position(1, 1)), new Position(1, 1));
		assert.deepStrictEqual(m.validatePosition(new Position(1, 2)), new Position(1, 2));
		assert.deepStrictEqual(m.validatePosition(new Position(1, 3)), new Position(1, 2));
		assert.deepStrictEqual(m.validatePosition(new Position(1, 4)), new Position(1, 4));
		assert.deepStrictEqual(m.validatePosition(new Position(1, 5)), new Position(1, 4));
		assert.deepStrictEqual(m.validatePosition(new Position(1, 6)), new Position(1, 6));
		assert.deepStrictEqual(m.validatePosition(new Position(1, 7)), new Position(1, 7));

		m.dispose();

	});

	test('validatePosition handle NaN.', () => {

		const m = createTextModel('line one\nline two');

		assert.deepStrictEqual(m.validatePosition(new Position(NaN, 1)), new Position(1, 1));
		assert.deepStrictEqual(m.validatePosition(new Position(1, NaN)), new Position(1, 1));

		assert.deepStrictEqual(m.validatePosition(new Position(NaN, NaN)), new Position(1, 1));
		assert.deepStrictEqual(m.validatePosition(new Position(2, NaN)), new Position(2, 1));
		assert.deepStrictEqual(m.validatePosition(new Position(NaN, 3)), new Position(1, 3));

		m.dispose();
	});

	test('issue #71480: validatePosition handle floats', () => {
		const m = createTextModel('line one\nline two');

		assert.deepStrictEqual(m.validatePosition(new Position(0.2, 1)), new Position(1, 1), 'a');
		assert.deepStrictEqual(m.validatePosition(new Position(1.2, 1)), new Position(1, 1), 'b');
		assert.deepStrictEqual(m.validatePosition(new Position(1.5, 2)), new Position(1, 2), 'c');
		assert.deepStrictEqual(m.validatePosition(new Position(1.8, 3)), new Position(1, 3), 'd');
		assert.deepStrictEqual(m.validatePosition(new Position(1, 0.3)), new Position(1, 1), 'e');
		assert.deepStrictEqual(m.validatePosition(new Position(2, 0.8)), new Position(2, 1), 'f');
		assert.deepStrictEqual(m.validatePosition(new Position(1, 1.2)), new Position(1, 1), 'g');
		assert.deepStrictEqual(m.validatePosition(new Position(2, 1.5)), new Position(2, 1), 'h');

		m.dispose();
	});

	test('issue #71480: validateRange handle floats', () => {
		const m = createTextModel('line one\nline two');

		assert.deepStrictEqual(m.validateRange(new Range(0.2, 1.5, 0.8, 2.5)), new Range(1, 1, 1, 1));
		assert.deepStrictEqual(m.validateRange(new Range(1.2, 1.7, 1.8, 2.2)), new Range(1, 1, 1, 2));

		m.dispose();
	});

	test('validateRange around high-low surrogate pairs 1', () => {

		const m = createTextModel('a📚b');

		assert.deepStrictEqual(m.validateRange(new Range(0, 0, 0, 1)), new Range(1, 1, 1, 1));
		assert.deepStrictEqual(m.validateRange(new Range(0, 0, 0, 7)), new Range(1, 1, 1, 1));

		assert.deepStrictEqual(m.validateRange(new Range(1, 1, 1, 1)), new Range(1, 1, 1, 1));
		assert.deepStrictEqual(m.validateRange(new Range(1, 1, 1, 2)), new Range(1, 1, 1, 2));
		assert.deepStrictEqual(m.validateRange(new Range(1, 1, 1, 3)), new Range(1, 1, 1, 4));
		assert.deepStrictEqual(m.validateRange(new Range(1, 1, 1, 4)), new Range(1, 1, 1, 4));
		assert.deepStrictEqual(m.validateRange(new Range(1, 1, 1, 5)), new Range(1, 1, 1, 5));

		assert.deepStrictEqual(m.validateRange(new Range(1, 2, 1, 2)), new Range(1, 2, 1, 2));
		assert.deepStrictEqual(m.validateRange(new Range(1, 2, 1, 3)), new Range(1, 2, 1, 4));
		assert.deepStrictEqual(m.validateRange(new Range(1, 2, 1, 4)), new Range(1, 2, 1, 4));
		assert.deepStrictEqual(m.validateRange(new Range(1, 2, 1, 5)), new Range(1, 2, 1, 5));

		assert.deepStrictEqual(m.validateRange(new Range(1, 3, 1, 3)), new Range(1, 2, 1, 2));
		assert.deepStrictEqual(m.validateRange(new Range(1, 3, 1, 4)), new Range(1, 2, 1, 4));
		assert.deepStrictEqual(m.validateRange(new Range(1, 3, 1, 5)), new Range(1, 2, 1, 5));

		assert.deepStrictEqual(m.validateRange(new Range(1, 4, 1, 4)), new Range(1, 4, 1, 4));
		assert.deepStrictEqual(m.validateRange(new Range(1, 4, 1, 5)), new Range(1, 4, 1, 5));

		assert.deepStrictEqual(m.validateRange(new Range(1, 5, 1, 5)), new Range(1, 5, 1, 5));

		m.dispose();
	});

	test('validateRange around high-low surrogate pairs 2', () => {

		const m = createTextModel('a📚📚b');

		assert.deepStrictEqual(m.validateRange(new Range(0, 0, 0, 1)), new Range(1, 1, 1, 1));
		assert.deepStrictEqual(m.validateRange(new Range(0, 0, 0, 7)), new Range(1, 1, 1, 1));

		assert.deepStrictEqual(m.validateRange(new Range(1, 1, 1, 1)), new Range(1, 1, 1, 1));
		assert.deepStrictEqual(m.validateRange(new Range(1, 1, 1, 2)), new Range(1, 1, 1, 2));
		assert.deepStrictEqual(m.validateRange(new Range(1, 1, 1, 3)), new Range(1, 1, 1, 4));
		assert.deepStrictEqual(m.validateRange(new Range(1, 1, 1, 4)), new Range(1, 1, 1, 4));
		assert.deepStrictEqual(m.validateRange(new Range(1, 1, 1, 5)), new Range(1, 1, 1, 6));
		assert.deepStrictEqual(m.validateRange(new Range(1, 1, 1, 6)), new Range(1, 1, 1, 6));
		assert.deepStrictEqual(m.validateRange(new Range(1, 1, 1, 7)), new Range(1, 1, 1, 7));

		assert.deepStrictEqual(m.validateRange(new Range(1, 2, 1, 2)), new Range(1, 2, 1, 2));
		assert.deepStrictEqual(m.validateRange(new Range(1, 2, 1, 3)), new Range(1, 2, 1, 4));
		assert.deepStrictEqual(m.validateRange(new Range(1, 2, 1, 4)), new Range(1, 2, 1, 4));
		assert.deepStrictEqual(m.validateRange(new Range(1, 2, 1, 5)), new Range(1, 2, 1, 6));
		assert.deepStrictEqual(m.validateRange(new Range(1, 2, 1, 6)), new Range(1, 2, 1, 6));
		assert.deepStrictEqual(m.validateRange(new Range(1, 2, 1, 7)), new Range(1, 2, 1, 7));

		assert.deepStrictEqual(m.validateRange(new Range(1, 3, 1, 3)), new Range(1, 2, 1, 2));
		assert.deepStrictEqual(m.validateRange(new Range(1, 3, 1, 4)), new Range(1, 2, 1, 4));
		assert.deepStrictEqual(m.validateRange(new Range(1, 3, 1, 5)), new Range(1, 2, 1, 6));
		assert.deepStrictEqual(m.validateRange(new Range(1, 3, 1, 6)), new Range(1, 2, 1, 6));
		assert.deepStrictEqual(m.validateRange(new Range(1, 3, 1, 7)), new Range(1, 2, 1, 7));

		assert.deepStrictEqual(m.validateRange(new Range(1, 4, 1, 4)), new Range(1, 4, 1, 4));
		assert.deepStrictEqual(m.validateRange(new Range(1, 4, 1, 5)), new Range(1, 4, 1, 6));
		assert.deepStrictEqual(m.validateRange(new Range(1, 4, 1, 6)), new Range(1, 4, 1, 6));
		assert.deepStrictEqual(m.validateRange(new Range(1, 4, 1, 7)), new Range(1, 4, 1, 7));

		assert.deepStrictEqual(m.validateRange(new Range(1, 5, 1, 5)), new Range(1, 4, 1, 4));
		assert.deepStrictEqual(m.validateRange(new Range(1, 5, 1, 6)), new Range(1, 4, 1, 6));
		assert.deepStrictEqual(m.validateRange(new Range(1, 5, 1, 7)), new Range(1, 4, 1, 7));

		assert.deepStrictEqual(m.validateRange(new Range(1, 6, 1, 6)), new Range(1, 6, 1, 6));
		assert.deepStrictEqual(m.validateRange(new Range(1, 6, 1, 7)), new Range(1, 6, 1, 7));

		assert.deepStrictEqual(m.validateRange(new Range(1, 7, 1, 7)), new Range(1, 7, 1, 7));

		m.dispose();
	});

	test('modifyPosition', () => {

		const m = createTextModel('line one\nline two');
		assert.deepStrictEqual(m.modifyPosition(new Position(1, 1), 0), new Position(1, 1));
		assert.deepStrictEqual(m.modifyPosition(new Position(0, 0), 0), new Position(1, 1));
		assert.deepStrictEqual(m.modifyPosition(new Position(30, 1), 0), new Position(2, 9));

		assert.deepStrictEqual(m.modifyPosition(new Position(1, 1), 17), new Position(2, 9));
		assert.deepStrictEqual(m.modifyPosition(new Position(1, 1), 1), new Position(1, 2));
		assert.deepStrictEqual(m.modifyPosition(new Position(1, 1), 3), new Position(1, 4));
		assert.deepStrictEqual(m.modifyPosition(new Position(1, 2), 10), new Position(2, 3));
		assert.deepStrictEqual(m.modifyPosition(new Position(1, 5), 13), new Position(2, 9));
		assert.deepStrictEqual(m.modifyPosition(new Position(1, 2), 16), new Position(2, 9));

		assert.deepStrictEqual(m.modifyPosition(new Position(2, 9), -17), new Position(1, 1));
		assert.deepStrictEqual(m.modifyPosition(new Position(1, 2), -1), new Position(1, 1));
		assert.deepStrictEqual(m.modifyPosition(new Position(1, 4), -3), new Position(1, 1));
		assert.deepStrictEqual(m.modifyPosition(new Position(2, 3), -10), new Position(1, 2));
		assert.deepStrictEqual(m.modifyPosition(new Position(2, 9), -13), new Position(1, 5));
		assert.deepStrictEqual(m.modifyPosition(new Position(2, 9), -16), new Position(1, 2));

		assert.deepStrictEqual(m.modifyPosition(new Position(1, 2), 17), new Position(2, 9));
		assert.deepStrictEqual(m.modifyPosition(new Position(1, 2), 100), new Position(2, 9));

		assert.deepStrictEqual(m.modifyPosition(new Position(1, 2), -2), new Position(1, 1));
		assert.deepStrictEqual(m.modifyPosition(new Position(1, 2), -100), new Position(1, 1));
		assert.deepStrictEqual(m.modifyPosition(new Position(2, 2), -100), new Position(1, 1));
		assert.deepStrictEqual(m.modifyPosition(new Position(2, 9), -18), new Position(1, 1));

		m.dispose();
	});

	test('normalizeIndentation 1', () => {
		const model = createTextModel('',
			undefined,
			{
				insertSpaces: false
			}
		);

		assert.strictEqual(model.normalizeIndentation('\t'), '\t');
		assert.strictEqual(model.normalizeIndentation('    '), '\t');
		assert.strictEqual(model.normalizeIndentation('   '), '   ');
		assert.strictEqual(model.normalizeIndentation('  '), '  ');
		assert.strictEqual(model.normalizeIndentation(' '), ' ');
		assert.strictEqual(model.normalizeIndentation(''), '');
		assert.strictEqual(model.normalizeIndentation(' \t    '), '\t\t');
		assert.strictEqual(model.normalizeIndentation(' \t   '), '\t   ');
		assert.strictEqual(model.normalizeIndentation(' \t  '), '\t  ');
		assert.strictEqual(model.normalizeIndentation(' \t '), '\t ');
		assert.strictEqual(model.normalizeIndentation(' \t'), '\t');

		assert.strictEqual(model.normalizeIndentation('\ta'), '\ta');
		assert.strictEqual(model.normalizeIndentation('    a'), '\ta');
		assert.strictEqual(model.normalizeIndentation('   a'), '   a');
		assert.strictEqual(model.normalizeIndentation('  a'), '  a');
		assert.strictEqual(model.normalizeIndentation(' a'), ' a');
		assert.strictEqual(model.normalizeIndentation('a'), 'a');
		assert.strictEqual(model.normalizeIndentation(' \t    a'), '\t\ta');
		assert.strictEqual(model.normalizeIndentation(' \t   a'), '\t   a');
		assert.strictEqual(model.normalizeIndentation(' \t  a'), '\t  a');
		assert.strictEqual(model.normalizeIndentation(' \t a'), '\t a');
		assert.strictEqual(model.normalizeIndentation(' \ta'), '\ta');

		model.dispose();
	});

	test('normalizeIndentation 2', () => {
		const model = createTextModel('');

		assert.strictEqual(model.normalizeIndentation('\ta'), '    a');
		assert.strictEqual(model.normalizeIndentation('    a'), '    a');
		assert.strictEqual(model.normalizeIndentation('   a'), '   a');
		assert.strictEqual(model.normalizeIndentation('  a'), '  a');
		assert.strictEqual(model.normalizeIndentation(' a'), ' a');
		assert.strictEqual(model.normalizeIndentation('a'), 'a');
		assert.strictEqual(model.normalizeIndentation(' \t    a'), '        a');
		assert.strictEqual(model.normalizeIndentation(' \t   a'), '       a');
		assert.strictEqual(model.normalizeIndentation(' \t  a'), '      a');
		assert.strictEqual(model.normalizeIndentation(' \t a'), '     a');
		assert.strictEqual(model.normalizeIndentation(' \ta'), '    a');

		model.dispose();
	});

	test('getLineFirstNonWhitespaceColumn', () => {
		const model = createTextModel([
			'asd',
			' asd',
			'\tasd',
			'  asd',
			'\t\tasd',
			' ',
			'  ',
			'\t',
			'\t\t',
			'  \tasd',
			'',
			''
		].join('\n'));

		assert.strictEqual(model.getLineFirstNonWhitespaceColumn(1), 1, '1');
		assert.strictEqual(model.getLineFirstNonWhitespaceColumn(2), 2, '2');
		assert.strictEqual(model.getLineFirstNonWhitespaceColumn(3), 2, '3');
		assert.strictEqual(model.getLineFirstNonWhitespaceColumn(4), 3, '4');
		assert.strictEqual(model.getLineFirstNonWhitespaceColumn(5), 3, '5');
		assert.strictEqual(model.getLineFirstNonWhitespaceColumn(6), 0, '6');
		assert.strictEqual(model.getLineFirstNonWhitespaceColumn(7), 0, '7');
		assert.strictEqual(model.getLineFirstNonWhitespaceColumn(8), 0, '8');
		assert.strictEqual(model.getLineFirstNonWhitespaceColumn(9), 0, '9');
		assert.strictEqual(model.getLineFirstNonWhitespaceColumn(10), 4, '10');
		assert.strictEqual(model.getLineFirstNonWhitespaceColumn(11), 0, '11');
		assert.strictEqual(model.getLineFirstNonWhitespaceColumn(12), 0, '12');

		model.dispose();
	});

	test('getLineLastNonWhitespaceColumn', () => {
		const model = createTextModel([
			'asd',
			'asd ',
			'asd\t',
			'asd  ',
			'asd\t\t',
			' ',
			'  ',
			'\t',
			'\t\t',
			'asd  \t',
			'',
			''
		].join('\n'));

		assert.strictEqual(model.getLineLastNonWhitespaceColumn(1), 4, '1');
		assert.strictEqual(model.getLineLastNonWhitespaceColumn(2), 4, '2');
		assert.strictEqual(model.getLineLastNonWhitespaceColumn(3), 4, '3');
		assert.strictEqual(model.getLineLastNonWhitespaceColumn(4), 4, '4');
		assert.strictEqual(model.getLineLastNonWhitespaceColumn(5), 4, '5');
		assert.strictEqual(model.getLineLastNonWhitespaceColumn(6), 0, '6');
		assert.strictEqual(model.getLineLastNonWhitespaceColumn(7), 0, '7');
		assert.strictEqual(model.getLineLastNonWhitespaceColumn(8), 0, '8');
		assert.strictEqual(model.getLineLastNonWhitespaceColumn(9), 0, '9');
		assert.strictEqual(model.getLineLastNonWhitespaceColumn(10), 4, '10');
		assert.strictEqual(model.getLineLastNonWhitespaceColumn(11), 0, '11');
		assert.strictEqual(model.getLineLastNonWhitespaceColumn(12), 0, '12');

		model.dispose();
	});

	test('#50471. getValueInRange with invalid range', () => {
		const m = createTextModel('My First Line\r\nMy Second Line\r\nMy Third Line');
		assert.strictEqual(m.getValueInRange(new Range(1, NaN, 1, 3)), 'My');
		assert.strictEqual(m.getValueInRange(new Range(NaN, NaN, NaN, NaN)), '');
		m.dispose();
	});

	test('issue #168836: updating tabSize should also update indentSize when indentSize is set to "tabSize"', () => {
		const m = createTextModel('some text', null, {
			tabSize: 2,
			indentSize: 'tabSize'
		});
		assert.strictEqual(m.getOptions().tabSize, 2);
		assert.strictEqual(m.getOptions().indentSize, 2);
		assert.strictEqual(m.getOptions().originalIndentSize, 'tabSize');
		m.updateOptions({
			tabSize: 4
		});
		assert.strictEqual(m.getOptions().tabSize, 4);
		assert.strictEqual(m.getOptions().indentSize, 4);
		assert.strictEqual(m.getOptions().originalIndentSize, 'tabSize');
		m.dispose();
	});
});

suite('TextModel.mightContainRTL', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('nope', () => {
		const model = createTextModel('hello world!');
		assert.strictEqual(model.mightContainRTL(), false);
		model.dispose();
	});

	test('yes', () => {
		const model = createTextModel('Hello,\nזוהי עובדה מבוססת שדעתו');
		assert.strictEqual(model.mightContainRTL(), true);
		model.dispose();
	});

	test('setValue resets 1', () => {
		const model = createTextModel('hello world!');
		assert.strictEqual(model.mightContainRTL(), false);
		model.setValue('Hello,\nזוהי עובדה מבוססת שדעתו');
		assert.strictEqual(model.mightContainRTL(), true);
		model.dispose();
	});

	test('setValue resets 2', () => {
		const model = createTextModel('Hello,\nهناك حقيقة مثبتة منذ زمن طويل');
		assert.strictEqual(model.mightContainRTL(), true);
		model.setValue('hello world!');
		assert.strictEqual(model.mightContainRTL(), false);
		model.dispose();
	});

});

suite('TextModel.createSnapshot', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('empty file', () => {
		const model = createTextModel('');
		const snapshot = model.createSnapshot();
		assert.strictEqual(snapshot.read(), null);
		model.dispose();
	});

	test('file with BOM', () => {
		const model = createTextModel(UTF8_BOM_CHARACTER + 'Hello');
		assert.strictEqual(model.getLineContent(1), 'Hello');
		const snapshot = model.createSnapshot(true);
		assert.strictEqual(snapshot.read(), UTF8_BOM_CHARACTER + 'Hello');
		assert.strictEqual(snapshot.read(), null);
		model.dispose();
	});

	test('regular file', () => {
		const model = createTextModel('My First Line\n\t\tMy Second Line\n    Third Line\n\n1');
		const snapshot = model.createSnapshot();
		assert.strictEqual(snapshot.read(), 'My First Line\n\t\tMy Second Line\n    Third Line\n\n1');
		assert.strictEqual(snapshot.read(), null);
		model.dispose();
	});

	test('large file', () => {
		const lines: string[] = [];
		for (let i = 0; i < 1000; i++) {
			lines[i] = 'Just some text that is a bit long such that it can consume some memory';
		}
		const text = lines.join('\n');

		const model = createTextModel(text);
		const snapshot = model.createSnapshot();
		let actual = '';

		// 70999 length => at most 2 read calls are necessary
		const tmp1 = snapshot.read();
		assert.ok(tmp1);
		actual += tmp1;

		const tmp2 = snapshot.read();
		if (tmp2 === null) {
			// all good
		} else {
			actual += tmp2;
			assert.strictEqual(snapshot.read(), null);
		}

		assert.strictEqual(actual, text);

		model.dispose();
	});

	test('issue #119632: invalid range', () => {
		const model = createTextModel('hello world!');
		// eslint-disable-next-line local/code-no-any-casts
		const actual = model._validateRangeRelaxedNoAllocations(new Range(<any>undefined, 0, <any>undefined, 1));
		assert.deepStrictEqual(actual, new Range(1, 1, 1, 1));
		model.dispose();
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/textModelSearch.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/textModelSearch.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { getMapForWordSeparators } from '../../../common/core/wordCharacterClassifier.js';
import { USUAL_WORD_SEPARATORS } from '../../../common/core/wordHelper.js';
import { EndOfLineSequence, FindMatch, SearchData } from '../../../common/model.js';
import { TextModel } from '../../../common/model/textModel.js';
import { SearchParams, TextModelSearch, isMultilineRegexSource } from '../../../common/model/textModelSearch.js';
import { createTextModel } from '../testTextModel.js';

// --------- Find
suite('TextModelSearch', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const usualWordSeparators = getMapForWordSeparators(USUAL_WORD_SEPARATORS, []);

	function assertFindMatch(actual: FindMatch | null, expectedRange: Range, expectedMatches: string[] | null = null): void {
		assert.deepStrictEqual(actual, new FindMatch(expectedRange, expectedMatches));
	}

	function _assertFindMatches(model: TextModel, searchParams: SearchParams, expectedMatches: FindMatch[]): void {
		const actual = TextModelSearch.findMatches(model, searchParams, model.getFullModelRange(), false, 1000);
		assert.deepStrictEqual(actual, expectedMatches, 'findMatches OK');

		// test `findNextMatch`
		let startPos = new Position(1, 1);
		let match = TextModelSearch.findNextMatch(model, searchParams, startPos, false);
		assert.deepStrictEqual(match, expectedMatches[0], `findNextMatch ${startPos}`);
		for (const expectedMatch of expectedMatches) {
			startPos = expectedMatch.range.getStartPosition();
			match = TextModelSearch.findNextMatch(model, searchParams, startPos, false);
			assert.deepStrictEqual(match, expectedMatch, `findNextMatch ${startPos}`);
		}

		// test `findPrevMatch`
		startPos = new Position(model.getLineCount(), model.getLineMaxColumn(model.getLineCount()));
		match = TextModelSearch.findPreviousMatch(model, searchParams, startPos, false);
		assert.deepStrictEqual(match, expectedMatches[expectedMatches.length - 1], `findPrevMatch ${startPos}`);
		for (const expectedMatch of expectedMatches) {
			startPos = expectedMatch.range.getEndPosition();
			match = TextModelSearch.findPreviousMatch(model, searchParams, startPos, false);
			assert.deepStrictEqual(match, expectedMatch, `findPrevMatch ${startPos}`);
		}
	}

	function assertFindMatches(text: string, searchString: string, isRegex: boolean, matchCase: boolean, wordSeparators: string | null, _expected: [number, number, number, number][]): void {
		const expectedRanges = _expected.map(entry => new Range(entry[0], entry[1], entry[2], entry[3]));
		const expectedMatches = expectedRanges.map(entry => new FindMatch(entry, null));
		const searchParams = new SearchParams(searchString, isRegex, matchCase, wordSeparators);

		const model = createTextModel(text);
		_assertFindMatches(model, searchParams, expectedMatches);
		model.dispose();


		const model2 = createTextModel(text);
		model2.setEOL(EndOfLineSequence.CRLF);
		_assertFindMatches(model2, searchParams, expectedMatches);
		model2.dispose();
	}

	const regularText = [
		'This is some foo - bar text which contains foo and bar - as in Barcelona.',
		'Now it begins a word fooBar and now it is caps Foo-isn\'t this great?',
		'And here\'s a dull line with nothing interesting in it',
		'It is also interesting if it\'s part of a word like amazingFooBar',
		'Again nothing interesting here'
	];

	test('Simple find', () => {
		assertFindMatches(
			regularText.join('\n'),
			'foo', false, false, null,
			[
				[1, 14, 1, 17],
				[1, 44, 1, 47],
				[2, 22, 2, 25],
				[2, 48, 2, 51],
				[4, 59, 4, 62]
			]
		);
	});

	test('Case sensitive find', () => {
		assertFindMatches(
			regularText.join('\n'),
			'foo', false, true, null,
			[
				[1, 14, 1, 17],
				[1, 44, 1, 47],
				[2, 22, 2, 25]
			]
		);
	});

	test('Whole words find', () => {
		assertFindMatches(
			regularText.join('\n'),
			'foo', false, false, USUAL_WORD_SEPARATORS,
			[
				[1, 14, 1, 17],
				[1, 44, 1, 47],
				[2, 48, 2, 51]
			]
		);
	});

	test('/^/ find', () => {
		assertFindMatches(
			regularText.join('\n'),
			'^', true, false, null,
			[
				[1, 1, 1, 1],
				[2, 1, 2, 1],
				[3, 1, 3, 1],
				[4, 1, 4, 1],
				[5, 1, 5, 1]
			]
		);
	});

	test('/$/ find', () => {
		assertFindMatches(
			regularText.join('\n'),
			'$', true, false, null,
			[
				[1, 74, 1, 74],
				[2, 69, 2, 69],
				[3, 54, 3, 54],
				[4, 65, 4, 65],
				[5, 31, 5, 31]
			]
		);
	});

	test('/.*/ find', () => {
		assertFindMatches(
			regularText.join('\n'),
			'.*', true, false, null,
			[
				[1, 1, 1, 74],
				[2, 1, 2, 69],
				[3, 1, 3, 54],
				[4, 1, 4, 65],
				[5, 1, 5, 31]
			]
		);
	});

	test('/^$/ find', () => {
		assertFindMatches(
			[
				'This is some foo - bar text which contains foo and bar - as in Barcelona.',
				'',
				'And here\'s a dull line with nothing interesting in it',
				'',
				'Again nothing interesting here'
			].join('\n'),
			'^$', true, false, null,
			[
				[2, 1, 2, 1],
				[4, 1, 4, 1]
			]
		);
	});

	test('multiline find 1', () => {
		assertFindMatches(
			[
				'Just some text text',
				'Just some text text',
				'some text again',
				'again some text'
			].join('\n'),
			'text\\n', true, false, null,
			[
				[1, 16, 2, 1],
				[2, 16, 3, 1],
			]
		);
	});

	test('multiline find 2', () => {
		assertFindMatches(
			[
				'Just some text text',
				'Just some text text',
				'some text again',
				'again some text'
			].join('\n'),
			'text\\nJust', true, false, null,
			[
				[1, 16, 2, 5]
			]
		);
	});

	test('multiline find 3', () => {
		assertFindMatches(
			[
				'Just some text text',
				'Just some text text',
				'some text again',
				'again some text'
			].join('\n'),
			'\\nagain', true, false, null,
			[
				[3, 16, 4, 6]
			]
		);
	});

	test('multiline find 4', () => {
		assertFindMatches(
			[
				'Just some text text',
				'Just some text text',
				'some text again',
				'again some text'
			].join('\n'),
			'.*\\nJust.*\\n', true, false, null,
			[
				[1, 1, 3, 1]
			]
		);
	});

	test('multiline find with line beginning regex', () => {
		assertFindMatches(
			[
				'if',
				'else',
				'',
				'if',
				'else'
			].join('\n'),
			'^if\\nelse', true, false, null,
			[
				[1, 1, 2, 5],
				[4, 1, 5, 5]
			]
		);
	});

	test('matching empty lines using boundary expression', () => {
		assertFindMatches(
			[
				'if',
				'',
				'else',
				'  ',
				'if',
				' ',
				'else'
			].join('\n'),
			'^\\s*$\\n', true, false, null,
			[
				[2, 1, 3, 1],
				[4, 1, 5, 1],
				[6, 1, 7, 1]
			]
		);
	});

	test('matching lines starting with A and ending with B', () => {
		assertFindMatches(
			[
				'a if b',
				'a',
				'ab',
				'eb'
			].join('\n'),
			'^a.*b$', true, false, null,
			[
				[1, 1, 1, 7],
				[3, 1, 3, 3]
			]
		);
	});

	test('multiline find with line ending regex', () => {
		assertFindMatches(
			[
				'if',
				'else',
				'',
				'if',
				'elseif',
				'else'
			].join('\n'),
			'if\\nelse$', true, false, null,
			[
				[1, 1, 2, 5],
				[5, 5, 6, 5]
			]
		);
	});

	test('issue #4836 - ^.*$', () => {
		assertFindMatches(
			[
				'Just some text text',
				'',
				'some text again',
				'',
				'again some text'
			].join('\n'),
			'^.*$', true, false, null,
			[
				[1, 1, 1, 20],
				[2, 1, 2, 1],
				[3, 1, 3, 16],
				[4, 1, 4, 1],
				[5, 1, 5, 16],
			]
		);
	});

	test('multiline find for non-regex string', () => {
		assertFindMatches(
			[
				'Just some text text',
				'some text text',
				'some text again',
				'again some text',
				'but not some'
			].join('\n'),
			'text\nsome', false, false, null,
			[
				[1, 16, 2, 5],
				[2, 11, 3, 5],
			]
		);
	});

	test('issue #3623: Match whole word does not work for not latin characters', () => {
		assertFindMatches(
			[
				'я',
				'компилятор',
				'обфускация',
				':я-я'
			].join('\n'),
			'я', false, false, USUAL_WORD_SEPARATORS,
			[
				[1, 1, 1, 2],
				[4, 2, 4, 3],
				[4, 4, 4, 5],
			]
		);
	});

	test('issue #27459: Match whole words regression', () => {
		assertFindMatches(
			[
				'this._register(this._textAreaInput.onKeyDown((e: IKeyboardEvent) => {',
				'	this._viewController.emitKeyDown(e);',
				'}));',
			].join('\n'),
			'((e: ', false, false, USUAL_WORD_SEPARATORS,
			[
				[1, 45, 1, 50]
			]
		);
	});

	test('issue #27594: Search results disappear', () => {
		assertFindMatches(
			[
				'this.server.listen(0);',
			].join('\n'),
			'listen(', false, false, USUAL_WORD_SEPARATORS,
			[
				[1, 13, 1, 20]
			]
		);
	});

	test('findNextMatch without regex', () => {
		const model = createTextModel('line line one\nline two\nthree');

		const searchParams = new SearchParams('line', false, false, null);

		let actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 1), false);
		assertFindMatch(actual, new Range(1, 1, 1, 5));

		actual = TextModelSearch.findNextMatch(model, searchParams, actual!.range.getEndPosition(), false);
		assertFindMatch(actual, new Range(1, 6, 1, 10));

		actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 3), false);
		assertFindMatch(actual, new Range(1, 6, 1, 10));

		actual = TextModelSearch.findNextMatch(model, searchParams, actual!.range.getEndPosition(), false);
		assertFindMatch(actual, new Range(2, 1, 2, 5));

		actual = TextModelSearch.findNextMatch(model, searchParams, actual!.range.getEndPosition(), false);
		assertFindMatch(actual, new Range(1, 1, 1, 5));

		model.dispose();
	});

	test('findNextMatch with beginning boundary regex', () => {
		const model = createTextModel('line one\nline two\nthree');

		const searchParams = new SearchParams('^line', true, false, null);

		let actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 1), false);
		assertFindMatch(actual, new Range(1, 1, 1, 5));

		actual = TextModelSearch.findNextMatch(model, searchParams, actual!.range.getEndPosition(), false);
		assertFindMatch(actual, new Range(2, 1, 2, 5));

		actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 3), false);
		assertFindMatch(actual, new Range(2, 1, 2, 5));

		actual = TextModelSearch.findNextMatch(model, searchParams, actual!.range.getEndPosition(), false);
		assertFindMatch(actual, new Range(1, 1, 1, 5));

		model.dispose();
	});

	test('findNextMatch with beginning boundary regex and line has repetitive beginnings', () => {
		const model = createTextModel('line line one\nline two\nthree');

		const searchParams = new SearchParams('^line', true, false, null);

		let actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 1), false);
		assertFindMatch(actual, new Range(1, 1, 1, 5));

		actual = TextModelSearch.findNextMatch(model, searchParams, actual!.range.getEndPosition(), false);
		assertFindMatch(actual, new Range(2, 1, 2, 5));

		actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 3), false);
		assertFindMatch(actual, new Range(2, 1, 2, 5));

		actual = TextModelSearch.findNextMatch(model, searchParams, actual!.range.getEndPosition(), false);
		assertFindMatch(actual, new Range(1, 1, 1, 5));

		model.dispose();
	});

	test('findNextMatch with beginning boundary multiline regex and line has repetitive beginnings', () => {
		const model = createTextModel('line line one\nline two\nline three\nline four');

		const searchParams = new SearchParams('^line.*\\nline', true, false, null);

		let actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 1), false);
		assertFindMatch(actual, new Range(1, 1, 2, 5));

		actual = TextModelSearch.findNextMatch(model, searchParams, actual!.range.getEndPosition(), false);
		assertFindMatch(actual, new Range(3, 1, 4, 5));

		actual = TextModelSearch.findNextMatch(model, searchParams, new Position(2, 1), false);
		assertFindMatch(actual, new Range(2, 1, 3, 5));

		model.dispose();
	});

	test('findNextMatch with ending boundary regex', () => {
		const model = createTextModel('one line line\ntwo line\nthree');

		const searchParams = new SearchParams('line$', true, false, null);

		let actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 1), false);
		assertFindMatch(actual, new Range(1, 10, 1, 14));

		actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 4), false);
		assertFindMatch(actual, new Range(1, 10, 1, 14));

		actual = TextModelSearch.findNextMatch(model, searchParams, actual!.range.getEndPosition(), false);
		assertFindMatch(actual, new Range(2, 5, 2, 9));

		actual = TextModelSearch.findNextMatch(model, searchParams, actual!.range.getEndPosition(), false);
		assertFindMatch(actual, new Range(1, 10, 1, 14));

		model.dispose();
	});

	test('findMatches with capturing matches', () => {
		const model = createTextModel('one line line\ntwo line\nthree');

		const searchParams = new SearchParams('(l(in)e)', true, false, null);

		const actual = TextModelSearch.findMatches(model, searchParams, model.getFullModelRange(), true, 100);
		assert.deepStrictEqual(actual, [
			new FindMatch(new Range(1, 5, 1, 9), ['line', 'line', 'in']),
			new FindMatch(new Range(1, 10, 1, 14), ['line', 'line', 'in']),
			new FindMatch(new Range(2, 5, 2, 9), ['line', 'line', 'in']),
		]);

		model.dispose();
	});

	test('findMatches multiline with capturing matches', () => {
		const model = createTextModel('one line line\ntwo line\nthree');

		const searchParams = new SearchParams('(l(in)e)\\n', true, false, null);

		const actual = TextModelSearch.findMatches(model, searchParams, model.getFullModelRange(), true, 100);
		assert.deepStrictEqual(actual, [
			new FindMatch(new Range(1, 10, 2, 1), ['line\n', 'line', 'in']),
			new FindMatch(new Range(2, 5, 3, 1), ['line\n', 'line', 'in']),
		]);

		model.dispose();
	});

	test('findNextMatch with capturing matches', () => {
		const model = createTextModel('one line line\ntwo line\nthree');

		const searchParams = new SearchParams('(l(in)e)', true, false, null);

		const actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 1), true);
		assertFindMatch(actual, new Range(1, 5, 1, 9), ['line', 'line', 'in']);

		model.dispose();
	});

	test('findNextMatch multiline with capturing matches', () => {
		const model = createTextModel('one line line\ntwo line\nthree');

		const searchParams = new SearchParams('(l(in)e)\\n', true, false, null);

		const actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 1), true);
		assertFindMatch(actual, new Range(1, 10, 2, 1), ['line\n', 'line', 'in']);

		model.dispose();
	});

	test('findPreviousMatch with capturing matches', () => {
		const model = createTextModel('one line line\ntwo line\nthree');

		const searchParams = new SearchParams('(l(in)e)', true, false, null);

		const actual = TextModelSearch.findPreviousMatch(model, searchParams, new Position(1, 1), true);
		assertFindMatch(actual, new Range(2, 5, 2, 9), ['line', 'line', 'in']);

		model.dispose();
	});

	test('findPreviousMatch multiline with capturing matches', () => {
		const model = createTextModel('one line line\ntwo line\nthree');

		const searchParams = new SearchParams('(l(in)e)\\n', true, false, null);

		const actual = TextModelSearch.findPreviousMatch(model, searchParams, new Position(1, 1), true);
		assertFindMatch(actual, new Range(2, 5, 3, 1), ['line\n', 'line', 'in']);

		model.dispose();
	});

	test('\\n matches \\r\\n', () => {
		const model = createTextModel('a\r\nb\r\nc\r\nd\r\ne\r\nf\r\ng\r\nh\r\ni');

		assert.strictEqual(model.getEOL(), '\r\n');

		let searchParams = new SearchParams('h\\n', true, false, null);
		let actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 1), true);
		actual = TextModelSearch.findMatches(model, searchParams, model.getFullModelRange(), true, 1000)[0];
		assertFindMatch(actual, new Range(8, 1, 9, 1), ['h\n']);

		searchParams = new SearchParams('g\\nh\\n', true, false, null);
		actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 1), true);
		actual = TextModelSearch.findMatches(model, searchParams, model.getFullModelRange(), true, 1000)[0];
		assertFindMatch(actual, new Range(7, 1, 9, 1), ['g\nh\n']);

		searchParams = new SearchParams('\\ni', true, false, null);
		actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 1), true);
		actual = TextModelSearch.findMatches(model, searchParams, model.getFullModelRange(), true, 1000)[0];
		assertFindMatch(actual, new Range(8, 2, 9, 2), ['\ni']);

		model.dispose();
	});

	test('\\r can never be found', () => {
		const model = createTextModel('a\r\nb\r\nc\r\nd\r\ne\r\nf\r\ng\r\nh\r\ni');

		assert.strictEqual(model.getEOL(), '\r\n');

		const searchParams = new SearchParams('\\r\\n', true, false, null);
		const actual = TextModelSearch.findNextMatch(model, searchParams, new Position(1, 1), true);
		assert.strictEqual(actual, null);
		assert.deepStrictEqual(TextModelSearch.findMatches(model, searchParams, model.getFullModelRange(), true, 1000), []);

		model.dispose();
	});

	function assertParseSearchResult(searchString: string, isRegex: boolean, matchCase: boolean, wordSeparators: string | null, expected: SearchData | null): void {
		const searchParams = new SearchParams(searchString, isRegex, matchCase, wordSeparators);
		const actual = searchParams.parseSearchRequest();

		if (expected === null) {
			assert.ok(actual === null);
		} else {
			assert.deepStrictEqual(actual!.regex, expected.regex);
			assert.deepStrictEqual(actual!.simpleSearch, expected.simpleSearch);
			if (wordSeparators) {
				assert.ok(actual!.wordSeparators !== null);
			} else {
				assert.ok(actual!.wordSeparators === null);
			}
		}
	}

	test('parseSearchRequest invalid', () => {
		assertParseSearchResult('', true, true, USUAL_WORD_SEPARATORS, null);
		assertParseSearchResult('(', true, false, null, null);
	});

	test('parseSearchRequest non regex', () => {
		assertParseSearchResult('foo', false, false, null, new SearchData(/foo/giu, null, null));
		assertParseSearchResult('foo', false, false, USUAL_WORD_SEPARATORS, new SearchData(/foo/giu, usualWordSeparators, null));
		assertParseSearchResult('foo', false, true, null, new SearchData(/foo/gu, null, 'foo'));
		assertParseSearchResult('foo', false, true, USUAL_WORD_SEPARATORS, new SearchData(/foo/gu, usualWordSeparators, 'foo'));
		assertParseSearchResult('foo\\n', false, false, null, new SearchData(/foo\\n/giu, null, null));
		assertParseSearchResult('foo\\\\n', false, false, null, new SearchData(/foo\\\\n/giu, null, null));
		assertParseSearchResult('foo\\r', false, false, null, new SearchData(/foo\\r/giu, null, null));
		assertParseSearchResult('foo\\\\r', false, false, null, new SearchData(/foo\\\\r/giu, null, null));
	});

	test('parseSearchRequest regex', () => {
		assertParseSearchResult('foo', true, false, null, new SearchData(/foo/giu, null, null));
		assertParseSearchResult('foo', true, false, USUAL_WORD_SEPARATORS, new SearchData(/foo/giu, usualWordSeparators, null));
		assertParseSearchResult('foo', true, true, null, new SearchData(/foo/gu, null, null));
		assertParseSearchResult('foo', true, true, USUAL_WORD_SEPARATORS, new SearchData(/foo/gu, usualWordSeparators, null));
		assertParseSearchResult('foo\\n', true, false, null, new SearchData(/foo\n/gimu, null, null));
		assertParseSearchResult('foo\\\\n', true, false, null, new SearchData(/foo\\n/giu, null, null));
		assertParseSearchResult('foo\\r', true, false, null, new SearchData(/foo\r/gimu, null, null));
		assertParseSearchResult('foo\\\\r', true, false, null, new SearchData(/foo\\r/giu, null, null));
	});

	test('issue #53415. \W should match line break.', () => {
		assertFindMatches(
			[
				'text',
				'180702-',
				'180703-180704'
			].join('\n'),
			'\\d{6}-\\W', true, false, null,
			[
				[2, 1, 3, 1]
			]
		);

		assertFindMatches(
			[
				'Just some text',
				'',
				'Just'
			].join('\n'),
			'\\W', true, false, null,
			[
				[1, 5, 1, 6],
				[1, 10, 1, 11],
				[1, 15, 2, 1],
				[2, 1, 3, 1]
			]
		);

		// Line break doesn't affect the result as we always use \n as line break when doing search
		assertFindMatches(
			[
				'Just some text',
				'',
				'Just'
			].join('\r\n'),
			'\\W', true, false, null,
			[
				[1, 5, 1, 6],
				[1, 10, 1, 11],
				[1, 15, 2, 1],
				[2, 1, 3, 1]
			]
		);

		assertFindMatches(
			[
				'Just some text',
				'\tJust',
				'Just'
			].join('\n'),
			'\\W', true, false, null,
			[
				[1, 5, 1, 6],
				[1, 10, 1, 11],
				[1, 15, 2, 1],
				[2, 1, 2, 2],
				[2, 6, 3, 1],
			]
		);

		// line break is seen as one non-word character
		assertFindMatches(
			[
				'Just  some text',
				'',
				'Just'
			].join('\n'),
			'\\W{2}', true, false, null,
			[
				[1, 5, 1, 7],
				[1, 16, 3, 1]
			]
		);

		// even if it's \r\n
		assertFindMatches(
			[
				'Just  some text',
				'',
				'Just'
			].join('\r\n'),
			'\\W{2}', true, false, null,
			[
				[1, 5, 1, 7],
				[1, 16, 3, 1]
			]
		);
	});

	test('Simple find using unicode escape sequences', () => {
		assertFindMatches(
			regularText.join('\n'),
			'\\u{0066}\\u006f\\u006F', true, false, null,
			[
				[1, 14, 1, 17],
				[1, 44, 1, 47],
				[2, 22, 2, 25],
				[2, 48, 2, 51],
				[4, 59, 4, 62]
			]
		);
	});

	test('isMultilineRegexSource', () => {
		assert(!isMultilineRegexSource('foo'));
		assert(!isMultilineRegexSource(''));
		assert(!isMultilineRegexSource('foo\\sbar'));
		assert(!isMultilineRegexSource('\\\\notnewline'));

		assert(isMultilineRegexSource('foo\\nbar'));
		assert(isMultilineRegexSource('foo\\nbar\\s'));
		assert(isMultilineRegexSource('foo\\r\\n'));
		assert(isMultilineRegexSource('\\n'));
		assert(isMultilineRegexSource('foo\\W'));
		assert(isMultilineRegexSource('foo\n'));
		assert(isMultilineRegexSource('foo\r\n'));
	});

	test('isMultilineRegexSource correctly identifies multiline patterns', () => {
		const singleLinePatterns = [
			'MARK:\\s*(?<label>.*)$',
			'^// Header$',
			'\\s*[-=]+\\s*',
		];

		const multiLinePatterns = [
			'^\/\/ =+\\n^\/\/ (?<label>[^\\n]+?)\\n^\/\/ =+$',
			'header\\r\\nfooter',
			'start\\r|\\nend',
			'top\nmiddle\r\nbottom'
		];

		for (const pattern of singleLinePatterns) {
			assert.strictEqual(isMultilineRegexSource(pattern), false, `Pattern should not be multiline: ${pattern}`);
		}

		for (const pattern of multiLinePatterns) {
			assert.strictEqual(isMultilineRegexSource(pattern), true, `Pattern should be multiline: ${pattern}`);
		}
	});

	test('issue #74715. \\d* finds empty string and stops searching.', () => {
		const model = createTextModel('10.243.30.10');

		const searchParams = new SearchParams('\\d*', true, false, null);

		const actual = TextModelSearch.findMatches(model, searchParams, model.getFullModelRange(), true, 100);
		assert.deepStrictEqual(actual, [
			new FindMatch(new Range(1, 1, 1, 3), ['10']),
			new FindMatch(new Range(1, 3, 1, 3), ['']),
			new FindMatch(new Range(1, 4, 1, 7), ['243']),
			new FindMatch(new Range(1, 7, 1, 7), ['']),
			new FindMatch(new Range(1, 8, 1, 10), ['30']),
			new FindMatch(new Range(1, 10, 1, 10), ['']),
			new FindMatch(new Range(1, 11, 1, 13), ['10'])
		]);

		model.dispose();
	});

	test('issue #100134. Zero-length matches should properly step over surrogate pairs', () => {
		// 1[Laptop]1 - there shoud be no matches inside of [Laptop] emoji
		assertFindMatches('1\uD83D\uDCBB1', '()', true, false, null,
			[
				[1, 1, 1, 1],
				[1, 2, 1, 2],
				[1, 4, 1, 4],
				[1, 5, 1, 5],

			]
		);
		// 1[Hacker Cat]1 = 1[Cat Face][ZWJ][Laptop]1 - there shoud be matches between emoji and ZWJ
		// there shoud be no matches inside of [Cat Face] and [Laptop] emoji
		assertFindMatches('1\uD83D\uDC31\u200D\uD83D\uDCBB1', '()', true, false, null,
			[
				[1, 1, 1, 1],
				[1, 2, 1, 2],
				[1, 4, 1, 4],
				[1, 5, 1, 5],
				[1, 7, 1, 7],
				[1, 8, 1, 8]
			]
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/textModelTokens.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/textModelTokens.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { OffsetRange } from '../../../common/core/ranges/offsetRange.js';
import { RangePriorityQueueImpl } from '../../../common/model/textModelTokens.js';

suite('RangePriorityQueueImpl', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('addRange', () => {
		const ranges: OffsetRange[] = [];

		OffsetRange.addRange(new OffsetRange(0, 2), ranges);
		OffsetRange.addRange(new OffsetRange(10, 13), ranges);
		OffsetRange.addRange(new OffsetRange(20, 24), ranges);

		assert.deepStrictEqual(
			ranges.map(r => r.toString()),
			(['[0, 2)', '[10, 13)', '[20, 24)'])
		);

		OffsetRange.addRange(new OffsetRange(2, 10), ranges);

		assert.deepStrictEqual(
			ranges.map(r => r.toString()),
			(['[0, 13)', '[20, 24)'])
		);

		OffsetRange.addRange(new OffsetRange(14, 19), ranges);

		assert.deepStrictEqual(
			ranges.map(r => r.toString()),
			(['[0, 13)', '[14, 19)', '[20, 24)'])
		);

		OffsetRange.addRange(new OffsetRange(10, 22), ranges);

		assert.deepStrictEqual(
			ranges.map(r => r.toString()),
			(['[0, 24)'])
		);

		OffsetRange.addRange(new OffsetRange(-1, 29), ranges);

		assert.deepStrictEqual(
			ranges.map(r => r.toString()),
			(['[-1, 29)'])
		);

		OffsetRange.addRange(new OffsetRange(-10, -5), ranges);

		assert.deepStrictEqual(
			ranges.map(r => r.toString()),
			(['[-10, -5)', '[-1, 29)'])
		);
	});

	test('addRangeAndResize', () => {
		const queue = new RangePriorityQueueImpl();

		queue.addRange(new OffsetRange(0, 20));
		queue.addRange(new OffsetRange(100, 120));
		queue.addRange(new OffsetRange(200, 220));

		// disjoint
		queue.addRangeAndResize(new OffsetRange(25, 27), 0);

		assert.deepStrictEqual(
			queue.getRanges().map(r => r.toString()),
			(['[0, 20)', '[98, 118)', '[198, 218)'])
		);

		queue.addRangeAndResize(new OffsetRange(19, 20), 0);

		assert.deepStrictEqual(
			queue.getRanges().map(r => r.toString()),
			(['[0, 19)', '[97, 117)', '[197, 217)'])
		);

		queue.addRangeAndResize(new OffsetRange(19, 97), 0);

		assert.deepStrictEqual(
			queue.getRanges().map(r => r.toString()),
			(['[0, 39)', '[119, 139)'])
		);

		queue.addRangeAndResize(new OffsetRange(-1000, 1000), 0);

		assert.deepStrictEqual(
			queue.getRanges().map(r => r.toString()),
			([])
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/common/model/textModelWithTokens.test.ts]---
Location: vscode-main/src/vs/editor/test/common/model/textModelWithTokens.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { IFoundBracket } from '../../../common/textModelBracketPairs.js';
import { TextModel } from '../../../common/model/textModel.js';
import { ITokenizationSupport, TokenizationRegistry, EncodedTokenizationResult } from '../../../common/languages.js';
import { StandardTokenType, MetadataConsts } from '../../../common/encodedTokenAttributes.js';
import { CharacterPair } from '../../../common/languages/languageConfiguration.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { NullState } from '../../../common/languages/nullTokenize.js';
import { ILanguageService } from '../../../common/languages/language.js';
import { TestLineToken } from '../core/testLineToken.js';
import { createModelServices, createTextModel, instantiateTextModel } from '../testTextModel.js';
import { TestInstantiationService } from '../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

function createTextModelWithBrackets(disposables: DisposableStore, text: string, brackets: CharacterPair[]): TextModel {
	const languageId = 'bracketMode2';
	const instantiationService = createModelServices(disposables);
	const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
	const languageService = instantiationService.get(ILanguageService);

	disposables.add(languageService.registerLanguage({ id: languageId }));
	disposables.add(languageConfigurationService.register(languageId, { brackets }));

	return disposables.add(instantiateTextModel(instantiationService, text, languageId));
}

suite('TextModelWithTokens', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function testBrackets(contents: string[], brackets: CharacterPair[]): void {
		const languageId = 'testMode';
		const disposables = new DisposableStore();
		const instantiationService = createModelServices(disposables);
		const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
		const languageService = instantiationService.get(ILanguageService);
		disposables.add(languageService.registerLanguage({ id: languageId }));
		disposables.add(languageConfigurationService.register(languageId, {
			brackets: brackets
		}));


		function toRelaxedFoundBracket(a: IFoundBracket | null) {
			if (!a) {
				return null;
			}
			return {
				range: a.range.toString(),
				info: a.bracketInfo,
			};
		}

		const charIsBracket: { [char: string]: boolean } = {};
		const charIsOpenBracket: { [char: string]: boolean } = {};
		const openForChar: { [char: string]: string } = {};
		const closeForChar: { [char: string]: string } = {};
		brackets.forEach((b) => {
			charIsBracket[b[0]] = true;
			charIsBracket[b[1]] = true;

			charIsOpenBracket[b[0]] = true;
			charIsOpenBracket[b[1]] = false;

			openForChar[b[0]] = b[0];
			closeForChar[b[0]] = b[1];

			openForChar[b[1]] = b[0];
			closeForChar[b[1]] = b[1];
		});

		const expectedBrackets: IFoundBracket[] = [];
		for (let lineIndex = 0; lineIndex < contents.length; lineIndex++) {
			const lineText = contents[lineIndex];

			for (let charIndex = 0; charIndex < lineText.length; charIndex++) {
				const ch = lineText.charAt(charIndex);
				if (charIsBracket[ch]) {
					expectedBrackets.push({
						bracketInfo: languageConfigurationService.getLanguageConfiguration(languageId).bracketsNew.getBracketInfo(ch)!,
						range: new Range(lineIndex + 1, charIndex + 1, lineIndex + 1, charIndex + 2)
					});
				}
			}
		}

		const model = disposables.add(instantiateTextModel(instantiationService, contents.join('\n'), languageId));

		// findPrevBracket
		{
			let expectedBracketIndex = expectedBrackets.length - 1;
			let currentExpectedBracket = expectedBracketIndex >= 0 ? expectedBrackets[expectedBracketIndex] : null;
			for (let lineNumber = contents.length; lineNumber >= 1; lineNumber--) {
				const lineText = contents[lineNumber - 1];

				for (let column = lineText.length + 1; column >= 1; column--) {

					if (currentExpectedBracket) {
						if (lineNumber === currentExpectedBracket.range.startLineNumber && column < currentExpectedBracket.range.endColumn) {
							expectedBracketIndex--;
							currentExpectedBracket = expectedBracketIndex >= 0 ? expectedBrackets[expectedBracketIndex] : null;
						}
					}

					const actual = model.bracketPairs.findPrevBracket({
						lineNumber: lineNumber,
						column: column
					});

					assert.deepStrictEqual(toRelaxedFoundBracket(actual), toRelaxedFoundBracket(currentExpectedBracket), 'findPrevBracket of ' + lineNumber + ', ' + column);
				}
			}
		}

		// findNextBracket
		{
			let expectedBracketIndex = 0;
			let currentExpectedBracket = expectedBracketIndex < expectedBrackets.length ? expectedBrackets[expectedBracketIndex] : null;
			for (let lineNumber = 1; lineNumber <= contents.length; lineNumber++) {
				const lineText = contents[lineNumber - 1];

				for (let column = 1; column <= lineText.length + 1; column++) {

					if (currentExpectedBracket) {
						if (lineNumber === currentExpectedBracket.range.startLineNumber && column > currentExpectedBracket.range.startColumn) {
							expectedBracketIndex++;
							currentExpectedBracket = expectedBracketIndex < expectedBrackets.length ? expectedBrackets[expectedBracketIndex] : null;
						}
					}

					const actual = model.bracketPairs.findNextBracket({
						lineNumber: lineNumber,
						column: column
					});

					assert.deepStrictEqual(toRelaxedFoundBracket(actual), toRelaxedFoundBracket(currentExpectedBracket), 'findNextBracket of ' + lineNumber + ', ' + column);
				}
			}
		}

		disposables.dispose();
	}

	test('brackets1', () => {
		testBrackets([
			'if (a == 3) { return (7 * (a + 5)); }'
		], [
			['{', '}'],
			['[', ']'],
			['(', ')']
		]);
	});
});

function assertIsNotBracket(model: TextModel, lineNumber: number, column: number) {
	const match = model.bracketPairs.matchBracket(new Position(lineNumber, column));
	assert.strictEqual(match, null, 'is not matching brackets at ' + lineNumber + ', ' + column);
}

function assertIsBracket(model: TextModel, testPosition: Position, expected: [Range, Range]): void {
	expected.sort(Range.compareRangesUsingStarts);
	const actual = model.bracketPairs.matchBracket(testPosition);
	actual?.sort(Range.compareRangesUsingStarts);
	assert.deepStrictEqual(actual, expected, 'matches brackets at ' + testPosition);
}

suite('TextModelWithTokens - bracket matching', () => {

	const languageId = 'bracketMode1';
	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let languageConfigurationService: ILanguageConfigurationService;
	let languageService: ILanguageService;

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = createModelServices(disposables);
		languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
		languageService = instantiationService.get(ILanguageService);
		disposables.add(languageService.registerLanguage({ id: languageId }));
		disposables.add(languageConfigurationService.register(languageId, {
			brackets: [
				['{', '}'],
				['[', ']'],
				['(', ')'],
			]
		}));
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('bracket matching 1', () => {
		const text =
			')]}{[(' + '\n' +
			')]}{[(';
		const model = disposables.add(instantiateTextModel(instantiationService, text, languageId));

		assertIsNotBracket(model, 1, 1);
		assertIsNotBracket(model, 1, 2);
		assertIsNotBracket(model, 1, 3);
		assertIsBracket(model, new Position(1, 4), [new Range(1, 4, 1, 5), new Range(2, 3, 2, 4)]);
		assertIsBracket(model, new Position(1, 5), [new Range(1, 5, 1, 6), new Range(2, 2, 2, 3)]);
		assertIsBracket(model, new Position(1, 6), [new Range(1, 6, 1, 7), new Range(2, 1, 2, 2)]);
		assertIsBracket(model, new Position(1, 7), [new Range(1, 6, 1, 7), new Range(2, 1, 2, 2)]);

		assertIsBracket(model, new Position(2, 1), [new Range(2, 1, 2, 2), new Range(1, 6, 1, 7)]);
		assertIsBracket(model, new Position(2, 2), [new Range(2, 2, 2, 3), new Range(1, 5, 1, 6)]);
		assertIsBracket(model, new Position(2, 3), [new Range(2, 3, 2, 4), new Range(1, 4, 1, 5)]);
		assertIsBracket(model, new Position(2, 4), [new Range(2, 3, 2, 4), new Range(1, 4, 1, 5)]);
		assertIsNotBracket(model, 2, 5);
		assertIsNotBracket(model, 2, 6);
		assertIsNotBracket(model, 2, 7);
	});

	test('bracket matching 2', () => {
		const text =
			'var bar = {' + '\n' +
			'foo: {' + '\n' +
			'}, bar: {hallo: [{' + '\n' +
			'}, {' + '\n' +
			'}]}}';
		const model = disposables.add(instantiateTextModel(instantiationService, text, languageId));

		const brackets: [Position, Range, Range][] = [
			[new Position(1, 11), new Range(1, 11, 1, 12), new Range(5, 4, 5, 5)],
			[new Position(1, 12), new Range(1, 11, 1, 12), new Range(5, 4, 5, 5)],

			[new Position(2, 6), new Range(2, 6, 2, 7), new Range(3, 1, 3, 2)],
			[new Position(2, 7), new Range(2, 6, 2, 7), new Range(3, 1, 3, 2)],

			[new Position(3, 1), new Range(3, 1, 3, 2), new Range(2, 6, 2, 7)],
			[new Position(3, 2), new Range(3, 1, 3, 2), new Range(2, 6, 2, 7)],
			[new Position(3, 9), new Range(3, 9, 3, 10), new Range(5, 3, 5, 4)],
			[new Position(3, 10), new Range(3, 9, 3, 10), new Range(5, 3, 5, 4)],
			[new Position(3, 17), new Range(3, 17, 3, 18), new Range(5, 2, 5, 3)],
			[new Position(3, 18), new Range(3, 18, 3, 19), new Range(4, 1, 4, 2)],
			[new Position(3, 19), new Range(3, 18, 3, 19), new Range(4, 1, 4, 2)],

			[new Position(4, 1), new Range(4, 1, 4, 2), new Range(3, 18, 3, 19)],
			[new Position(4, 2), new Range(4, 1, 4, 2), new Range(3, 18, 3, 19)],
			[new Position(4, 4), new Range(4, 4, 4, 5), new Range(5, 1, 5, 2)],
			[new Position(4, 5), new Range(4, 4, 4, 5), new Range(5, 1, 5, 2)],

			[new Position(5, 1), new Range(5, 1, 5, 2), new Range(4, 4, 4, 5)],
			[new Position(5, 2), new Range(5, 2, 5, 3), new Range(3, 17, 3, 18)],
			[new Position(5, 3), new Range(5, 3, 5, 4), new Range(3, 9, 3, 10)],
			[new Position(5, 4), new Range(5, 4, 5, 5), new Range(1, 11, 1, 12)],
			[new Position(5, 5), new Range(5, 4, 5, 5), new Range(1, 11, 1, 12)],
		];

		const isABracket: { [lineNumber: number]: { [col: number]: boolean } } = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
		for (let i = 0, len = brackets.length; i < len; i++) {
			const [testPos, b1, b2] = brackets[i];
			assertIsBracket(model, testPos, [b1, b2]);
			isABracket[testPos.lineNumber][testPos.column] = true;
		}

		for (let i = 1, len = model.getLineCount(); i <= len; i++) {
			const line = model.getLineContent(i);
			for (let j = 1, lenJ = line.length + 1; j <= lenJ; j++) {
				// eslint-disable-next-line local/code-no-any-casts
				if (!isABracket[i].hasOwnProperty(<any>j)) {
					assertIsNotBracket(model, i, j);
				}
			}
		}
	});
});

suite('TextModelWithTokens 2', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('bracket matching 3', () => {
		const text = [
			'begin',
			'    loop',
			'        if then',
			'        end if;',
			'    end loop;',
			'end;',
			'',
			'begin',
			'    loop',
			'        if then',
			'        end ifa;',
			'    end loop;',
			'end;',
		].join('\n');

		const disposables = new DisposableStore();
		const model = createTextModelWithBrackets(disposables, text, [
			['if', 'end if'],
			['loop', 'end loop'],
			['begin', 'end']
		]);

		// <if> ... <end ifa> is not matched
		assertIsNotBracket(model, 10, 9);

		// <if> ... <end if> is matched
		assertIsBracket(model, new Position(3, 9), [new Range(3, 9, 3, 11), new Range(4, 9, 4, 15)]);
		assertIsBracket(model, new Position(4, 9), [new Range(4, 9, 4, 15), new Range(3, 9, 3, 11)]);

		// <loop> ... <end loop> is matched
		assertIsBracket(model, new Position(2, 5), [new Range(2, 5, 2, 9), new Range(5, 5, 5, 13)]);
		assertIsBracket(model, new Position(5, 5), [new Range(5, 5, 5, 13), new Range(2, 5, 2, 9)]);

		// <begin> ... <end> is matched
		assertIsBracket(model, new Position(1, 1), [new Range(1, 1, 1, 6), new Range(6, 1, 6, 4)]);
		assertIsBracket(model, new Position(6, 1), [new Range(6, 1, 6, 4), new Range(1, 1, 1, 6)]);

		disposables.dispose();
	});

	test('bracket matching 4', () => {
		const text = [
			'recordbegin',
			'  simplerecordbegin',
			'  endrecord',
			'endrecord',
		].join('\n');

		const disposables = new DisposableStore();
		const model = createTextModelWithBrackets(disposables, text, [
			['recordbegin', 'endrecord'],
			['simplerecordbegin', 'endrecord'],
		]);

		// <recordbegin> ... <endrecord> is matched
		assertIsBracket(model, new Position(1, 1), [new Range(1, 1, 1, 12), new Range(4, 1, 4, 10)]);
		assertIsBracket(model, new Position(4, 1), [new Range(4, 1, 4, 10), new Range(1, 1, 1, 12)]);

		// <simplerecordbegin> ... <endrecord> is matched
		assertIsBracket(model, new Position(2, 3), [new Range(2, 3, 2, 20), new Range(3, 3, 3, 12)]);
		assertIsBracket(model, new Position(3, 3), [new Range(3, 3, 3, 12), new Range(2, 3, 2, 20)]);

		disposables.dispose();
	});

	test('issue #95843: Highlighting of closing braces is indicating wrong brace when cursor is behind opening brace', () => {
		const disposables = new DisposableStore();
		const instantiationService = createModelServices(disposables);
		const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
		const languageService = instantiationService.get(ILanguageService);
		const mode1 = 'testMode1';
		const mode2 = 'testMode2';

		const languageIdCodec = languageService.languageIdCodec;

		disposables.add(languageService.registerLanguage({ id: mode1 }));
		disposables.add(languageService.registerLanguage({ id: mode2 }));
		const encodedMode1 = languageIdCodec.encodeLanguageId(mode1);
		const encodedMode2 = languageIdCodec.encodeLanguageId(mode2);

		const otherMetadata1 = (
			(encodedMode1 << MetadataConsts.LANGUAGEID_OFFSET)
			| (StandardTokenType.Other << MetadataConsts.TOKEN_TYPE_OFFSET)
			| (MetadataConsts.BALANCED_BRACKETS_MASK)
		) >>> 0;
		const otherMetadata2 = (
			(encodedMode2 << MetadataConsts.LANGUAGEID_OFFSET)
			| (StandardTokenType.Other << MetadataConsts.TOKEN_TYPE_OFFSET)
			| (MetadataConsts.BALANCED_BRACKETS_MASK)
		) >>> 0;

		const tokenizationSupport: ITokenizationSupport = {
			getInitialState: () => NullState,
			tokenize: undefined!,
			tokenizeEncoded: (line, hasEOL, state) => {
				switch (line) {
					case 'function f() {': {
						const tokens = new Uint32Array([
							0, otherMetadata1,
							8, otherMetadata1,
							9, otherMetadata1,
							10, otherMetadata1,
							11, otherMetadata1,
							12, otherMetadata1,
							13, otherMetadata1,
						]);
						return new EncodedTokenizationResult(tokens, [], state);
					}
					case '  return <p>{true}</p>;': {
						const tokens = new Uint32Array([
							0, otherMetadata1,
							2, otherMetadata1,
							8, otherMetadata1,
							9, otherMetadata2,
							10, otherMetadata2,
							11, otherMetadata2,
							12, otherMetadata2,
							13, otherMetadata1,
							17, otherMetadata2,
							18, otherMetadata2,
							20, otherMetadata2,
							21, otherMetadata2,
							22, otherMetadata2,
						]);
						return new EncodedTokenizationResult(tokens, [], state);
					}
					case '}': {
						const tokens = new Uint32Array([
							0, otherMetadata1
						]);
						return new EncodedTokenizationResult(tokens, [], state);
					}
				}
				throw new Error(`Unexpected`);
			}
		};

		disposables.add(TokenizationRegistry.register(mode1, tokenizationSupport));
		disposables.add(languageConfigurationService.register(mode1, {
			brackets: [
				['{', '}'],
				['[', ']'],
				['(', ')']
			],
		}));
		disposables.add(languageConfigurationService.register(mode2, {
			brackets: [
				['{', '}'],
				['[', ']'],
				['(', ')']
			],
		}));

		const model = disposables.add(instantiateTextModel(
			instantiationService,
			[
				'function f() {',
				'  return <p>{true}</p>;',
				'}',
			].join('\n'),
			mode1
		));

		model.tokenization.forceTokenization(1);
		model.tokenization.forceTokenization(2);
		model.tokenization.forceTokenization(3);

		assert.deepStrictEqual(
			model.bracketPairs.matchBracket(new Position(2, 14)),
			[new Range(2, 13, 2, 14), new Range(2, 18, 2, 19)]
		);

		disposables.dispose();
	});

	test('issue #88075: TypeScript brace matching is incorrect in `${}` strings', () => {
		const disposables = new DisposableStore();
		const instantiationService = createModelServices(disposables);
		const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
		const mode = 'testMode';

		const languageIdCodec = instantiationService.get(ILanguageService).languageIdCodec;

		const encodedMode = languageIdCodec.encodeLanguageId(mode);

		const otherMetadata = (
			(encodedMode << MetadataConsts.LANGUAGEID_OFFSET)
			| (StandardTokenType.Other << MetadataConsts.TOKEN_TYPE_OFFSET)
		) >>> 0;
		const stringMetadata = (
			(encodedMode << MetadataConsts.LANGUAGEID_OFFSET)
			| (StandardTokenType.String << MetadataConsts.TOKEN_TYPE_OFFSET)
		) >>> 0;

		const tokenizationSupport: ITokenizationSupport = {
			getInitialState: () => NullState,
			tokenize: undefined!,
			tokenizeEncoded: (line, hasEOL, state) => {
				switch (line) {
					case 'function hello() {': {
						const tokens = new Uint32Array([
							0, otherMetadata
						]);
						return new EncodedTokenizationResult(tokens, [], state);
					}
					case '    console.log(`${100}`);': {
						const tokens = new Uint32Array([
							0, otherMetadata,
							16, stringMetadata,
							19, otherMetadata,
							22, stringMetadata,
							24, otherMetadata,
						]);
						return new EncodedTokenizationResult(tokens, [], state);
					}
					case '}': {
						const tokens = new Uint32Array([
							0, otherMetadata
						]);
						return new EncodedTokenizationResult(tokens, [], state);
					}
				}
				throw new Error(`Unexpected`);
			}
		};

		disposables.add(TokenizationRegistry.register(mode, tokenizationSupport));
		disposables.add(languageConfigurationService.register(mode, {
			brackets: [
				['{', '}'],
				['[', ']'],
				['(', ')']
			],
		}));

		const model = disposables.add(instantiateTextModel(
			instantiationService,
			[
				'function hello() {',
				'    console.log(`${100}`);',
				'}'
			].join('\n'),
			mode
		));

		model.tokenization.forceTokenization(1);
		model.tokenization.forceTokenization(2);
		model.tokenization.forceTokenization(3);

		assert.deepStrictEqual(model.bracketPairs.matchBracket(new Position(2, 23)), null);
		assert.deepStrictEqual(model.bracketPairs.matchBracket(new Position(2, 20)), null);

		disposables.dispose();
	});
});


suite('TextModelWithTokens regression tests', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('microsoft/monaco-editor#122: Unhandled Exception: TypeError: Unable to get property \'replace\' of undefined or null reference', () => {
		function assertViewLineTokens(model: TextModel, lineNumber: number, forceTokenization: boolean, expected: TestLineToken[]): void {
			if (forceTokenization) {
				model.tokenization.forceTokenization(lineNumber);
			}
			const _actual = model.tokenization.getLineTokens(lineNumber).inflate();
			interface ISimpleViewToken {
				endIndex: number;
				foreground: number;
			}
			const actual: ISimpleViewToken[] = [];
			for (let i = 0, len = _actual.getCount(); i < len; i++) {
				actual[i] = {
					endIndex: _actual.getEndOffset(i),
					foreground: _actual.getForeground(i)
				};
			}
			const decode = (token: TestLineToken) => {
				return {
					endIndex: token.endIndex,
					foreground: token.getForeground()
				};
			};
			assert.deepStrictEqual(actual, expected.map(decode));
		}

		let _tokenId = 10;
		const LANG_ID1 = 'indicisiveMode1';
		const LANG_ID2 = 'indicisiveMode2';

		const tokenizationSupport: ITokenizationSupport = {
			getInitialState: () => NullState,
			tokenize: undefined!,
			tokenizeEncoded: (line, hasEOL, state) => {
				const myId = ++_tokenId;
				const tokens = new Uint32Array(2);
				tokens[0] = 0;
				tokens[1] = (
					myId << MetadataConsts.FOREGROUND_OFFSET
				) >>> 0;
				return new EncodedTokenizationResult(tokens, [], state);
			}
		};

		const registration1 = TokenizationRegistry.register(LANG_ID1, tokenizationSupport);
		const registration2 = TokenizationRegistry.register(LANG_ID2, tokenizationSupport);

		const model = createTextModel('A model with\ntwo lines');

		assertViewLineTokens(model, 1, true, [createViewLineToken(12, 1)]);
		assertViewLineTokens(model, 2, true, [createViewLineToken(9, 1)]);

		model.setLanguage(LANG_ID1);

		assertViewLineTokens(model, 1, true, [createViewLineToken(12, 11)]);
		assertViewLineTokens(model, 2, true, [createViewLineToken(9, 12)]);

		model.setLanguage(LANG_ID2);

		assertViewLineTokens(model, 1, false, [createViewLineToken(12, 1)]);
		assertViewLineTokens(model, 2, false, [createViewLineToken(9, 1)]);

		model.dispose();
		registration1.dispose();
		registration2.dispose();

		function createViewLineToken(endIndex: number, foreground: number): TestLineToken {
			const metadata = (
				(foreground << MetadataConsts.FOREGROUND_OFFSET)
			) >>> 0;
			return new TestLineToken(endIndex, metadata);
		}
	});


	test('microsoft/monaco-editor#133: Error: Cannot read property \'modeId\' of undefined', () => {

		const disposables = new DisposableStore();
		const model = createTextModelWithBrackets(
			disposables,
			[
				'Imports System',
				'Imports System.Collections.Generic',
				'',
				'Module m1',
				'',
				'\tSub Main()',
				'\tEnd Sub',
				'',
				'End Module',
			].join('\n'),
			[
				['module', 'end module'],
				['sub', 'end sub']
			]
		);

		const actual = model.bracketPairs.matchBracket(new Position(4, 1));
		assert.deepStrictEqual(actual, [new Range(4, 1, 4, 7), new Range(9, 1, 9, 11)]);

		disposables.dispose();
	});

	test('issue #11856: Bracket matching does not work as expected if the opening brace symbol is contained in the closing brace symbol', () => {

		const disposables = new DisposableStore();
		const model = createTextModelWithBrackets(
			disposables,
			[
				'sequence "outer"',
				'     sequence "inner"',
				'     endsequence',
				'endsequence',
			].join('\n'),
			[
				['sequence', 'endsequence'],
				['feature', 'endfeature']
			]
		);

		const actual = model.bracketPairs.matchBracket(new Position(3, 9));
		assert.deepStrictEqual(actual, [new Range(2, 6, 2, 14), new Range(3, 6, 3, 17)]);

		disposables.dispose();
	});

	test('issue #63822: Wrong embedded language detected for empty lines', () => {
		const disposables = new DisposableStore();
		const instantiationService = createModelServices(disposables);
		const languageService = instantiationService.get(ILanguageService);

		const outerMode = 'outerMode';
		const innerMode = 'innerMode';

		disposables.add(languageService.registerLanguage({ id: outerMode }));
		disposables.add(languageService.registerLanguage({ id: innerMode }));

		const languageIdCodec = instantiationService.get(ILanguageService).languageIdCodec;
		const encodedInnerMode = languageIdCodec.encodeLanguageId(innerMode);

		const tokenizationSupport: ITokenizationSupport = {
			getInitialState: () => NullState,
			tokenize: undefined!,
			tokenizeEncoded: (line, hasEOL, state) => {
				const tokens = new Uint32Array(2);
				tokens[0] = 0;
				tokens[1] = (
					encodedInnerMode << MetadataConsts.LANGUAGEID_OFFSET
				) >>> 0;
				return new EncodedTokenizationResult(tokens, [], state);
			}
		};

		disposables.add(TokenizationRegistry.register(outerMode, tokenizationSupport));

		const model = disposables.add(instantiateTextModel(instantiationService, 'A model with one line', outerMode));

		model.tokenization.forceTokenization(1);
		assert.strictEqual(model.getLanguageIdAtPosition(1, 1), innerMode);

		disposables.dispose();
	});
});

suite('TextModel.getLineIndentGuide', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function assertIndentGuides(lines: [number, number, number, number, string][], indentSize: number): void {
		const languageId = 'testLang';
		const disposables = new DisposableStore();
		const instantiationService = createModelServices(disposables);
		const languageService = instantiationService.get(ILanguageService);
		disposables.add(languageService.registerLanguage({ id: languageId }));

		const text = lines.map(l => l[4]).join('\n');
		const model = disposables.add(instantiateTextModel(instantiationService, text, languageId));
		model.updateOptions({ indentSize: indentSize });

		const actualIndents = model.guides.getLinesIndentGuides(1, model.getLineCount());

		const actual: [number, number, number, number, string][] = [];
		for (let line = 1; line <= model.getLineCount(); line++) {
			const activeIndentGuide = model.guides.getActiveIndentGuide(line, 1, model.getLineCount());
			actual[line - 1] = [actualIndents[line - 1], activeIndentGuide.startLineNumber, activeIndentGuide.endLineNumber, activeIndentGuide.indent, model.getLineContent(line)];
		}

		assert.deepStrictEqual(actual, lines);

		disposables.dispose();
	}

	test('getLineIndentGuide one level 2', () => {
		assertIndentGuides([
			[0, 2, 4, 1, 'A'],
			[1, 2, 4, 1, '  A'],
			[1, 2, 4, 1, '  A'],
			[1, 2, 4, 1, '  A'],
		], 2);
	});

	test('getLineIndentGuide two levels', () => {
		assertIndentGuides([
			[0, 2, 5, 1, 'A'],
			[1, 2, 5, 1, '  A'],
			[1, 4, 5, 2, '  A'],
			[2, 4, 5, 2, '    A'],
			[2, 4, 5, 2, '    A'],
		], 2);
	});

	test('getLineIndentGuide three levels', () => {
		assertIndentGuides([
			[0, 2, 4, 1, 'A'],
			[1, 3, 4, 2, '  A'],
			[2, 4, 4, 3, '    A'],
			[3, 4, 4, 3, '      A'],
			[0, 5, 5, 0, 'A'],
		], 2);
	});

	test('getLineIndentGuide decreasing indent', () => {
		assertIndentGuides([
			[2, 1, 1, 2, '    A'],
			[1, 1, 1, 2, '  A'],
			[0, 1, 2, 1, 'A'],
		], 2);
	});

	test('getLineIndentGuide Java', () => {
		assertIndentGuides([
			/* 1*/[0, 2, 9, 1, 'class A {'],
			/* 2*/[1, 3, 4, 2, '  void foo() {'],
			/* 3*/[2, 3, 4, 2, '    console.log(1);'],
			/* 4*/[2, 3, 4, 2, '    console.log(2);'],
			/* 5*/[1, 3, 4, 2, '  }'],
			/* 6*/[1, 2, 9, 1, ''],
			/* 7*/[1, 8, 8, 2, '  void bar() {'],
			/* 8*/[2, 8, 8, 2, '    console.log(3);'],
			/* 9*/[1, 8, 8, 2, '  }'],
			/*10*/[0, 2, 9, 1, '}'],
			/*11*/[0, 12, 12, 1, 'interface B {'],
			/*12*/[1, 12, 12, 1, '  void bar();'],
			/*13*/[0, 12, 12, 1, '}'],
		], 2);
	});

	test('getLineIndentGuide Javadoc', () => {
		assertIndentGuides([
			[0, 2, 3, 1, '/**'],
			[1, 2, 3, 1, ' * Comment'],
			[1, 2, 3, 1, ' */'],
			[0, 5, 6, 1, 'class A {'],
			[1, 5, 6, 1, '  void foo() {'],
			[1, 5, 6, 1, '  }'],
			[0, 5, 6, 1, '}'],
		], 2);
	});

	test('getLineIndentGuide Whitespace', () => {
		assertIndentGuides([
			[0, 2, 7, 1, 'class A {'],
			[1, 2, 7, 1, ''],
			[1, 4, 5, 2, '  void foo() {'],
			[2, 4, 5, 2, '    '],
			[2, 4, 5, 2, '    return 1;'],
			[1, 4, 5, 2, '  }'],
			[1, 2, 7, 1, '      '],
			[0, 2, 7, 1, '}']
		], 2);
	});

	test('getLineIndentGuide Tabs', () => {
		assertIndentGuides([
			[0, 2, 7, 1, 'class A {'],
			[1, 2, 7, 1, '\t\t'],
			[1, 4, 5, 2, '\tvoid foo() {'],
			[2, 4, 5, 2, '\t \t//hello'],
			[2, 4, 5, 2, '\t    return 2;'],
			[1, 4, 5, 2, '  \t}'],
			[1, 2, 7, 1, '      '],
			[0, 2, 7, 1, '}']
		], 4);
	});

	test('getLineIndentGuide checker.ts', () => {
		assertIndentGuides([
			/* 1*/[0, 1, 1, 0, '/// <reference path="binder.ts"/>'],
			/* 2*/[0, 2, 2, 0, ''],
			/* 3*/[0, 3, 3, 0, '/* @internal */'],
			/* 4*/[0, 5, 16, 1, 'namespace ts {'],
			/* 5*/[1, 5, 16, 1, '    let nextSymbolId = 1;'],
			/* 6*/[1, 5, 16, 1, '    let nextNodeId = 1;'],
			/* 7*/[1, 5, 16, 1, '    let nextMergeId = 1;'],
			/* 8*/[1, 5, 16, 1, '    let nextFlowId = 1;'],
			/* 9*/[1, 5, 16, 1, ''],
			/*10*/[1, 11, 15, 2, '    export function getNodeId(node: Node): number {'],
			/*11*/[2, 12, 13, 3, '        if (!node.id) {'],
			/*12*/[3, 12, 13, 3, '            node.id = nextNodeId;'],
			/*13*/[3, 12, 13, 3, '            nextNodeId++;'],
			/*14*/[2, 12, 13, 3, '        }'],
			/*15*/[2, 11, 15, 2, '        return node.id;'],
			/*16*/[1, 11, 15, 2, '    }'],
			/*17*/[0, 5, 16, 1, '}']
		], 4);
	});

	test('issue #8425 - Missing indentation lines for first level indentation', () => {
		assertIndentGuides([
			[1, 2, 3, 2, '\tindent1'],
			[2, 2, 3, 2, '\t\tindent2'],
			[2, 2, 3, 2, '\t\tindent2'],
			[1, 2, 3, 2, '\tindent1']
		], 4);
	});

	test('issue #8952 - Indentation guide lines going through text on .yml file', () => {
		assertIndentGuides([
			[0, 2, 5, 1, 'properties:'],
			[1, 3, 5, 2, '    emailAddress:'],
			[2, 3, 5, 2, '        - bla'],
			[2, 5, 5, 3, '        - length:'],
			[3, 5, 5, 3, '            max: 255'],
			[0, 6, 6, 0, 'getters:']
		], 4);
	});

	test('issue #11892 - Indent guides look funny', () => {
		assertIndentGuides([
			[0, 2, 7, 1, 'function test(base) {'],
			[1, 3, 6, 2, '\tswitch (base) {'],
			[2, 4, 4, 3, '\t\tcase 1:'],
			[3, 4, 4, 3, '\t\t\treturn 1;'],
			[2, 6, 6, 3, '\t\tcase 2:'],
			[3, 6, 6, 3, '\t\t\treturn 2;'],
			[1, 2, 7, 1, '\t}'],
			[0, 2, 7, 1, '}']
		], 4);
	});

	test('issue #12398 - Problem in indent guidelines', () => {
		assertIndentGuides([
			[2, 2, 2, 3, '\t\t.bla'],
			[3, 2, 2, 3, '\t\t\tlabel(for)'],
			[0, 3, 3, 0, 'include script']
		], 4);
	});

	test('issue #49173', () => {
		const model = createTextModel([
			'class A {',
			'	public m1(): void {',
			'	}',
			'	public m2(): void {',
			'	}',
			'	public m3(): void {',
			'	}',
			'	public m4(): void {',
			'	}',
			'	public m5(): void {',
			'	}',
			'}',
		].join('\n'));

		const actual = model.guides.getActiveIndentGuide(2, 4, 9);
		assert.deepStrictEqual(actual, { startLineNumber: 2, endLineNumber: 9, indent: 1 });
		model.dispose();
	});

	test('tweaks - no active', () => {
		assertIndentGuides([
			[0, 1, 1, 0, 'A'],
			[0, 2, 2, 0, 'A']
		], 2);
	});

	test('tweaks - inside scope', () => {
		assertIndentGuides([
			[0, 2, 2, 1, 'A'],
			[1, 2, 2, 1, '  A']
		], 2);
	});

	test('tweaks - scope start', () => {
		assertIndentGuides([
			[0, 2, 2, 1, 'A'],
			[1, 2, 2, 1, '  A'],
			[0, 2, 2, 1, 'A']
		], 2);
	});

	test('tweaks - empty line', () => {
		assertIndentGuides([
			[0, 2, 4, 1, 'A'],
			[1, 2, 4, 1, '  A'],
			[1, 2, 4, 1, ''],
			[1, 2, 4, 1, '  A'],
			[0, 2, 4, 1, 'A']
		], 2);
	});
});
```

--------------------------------------------------------------------------------

````

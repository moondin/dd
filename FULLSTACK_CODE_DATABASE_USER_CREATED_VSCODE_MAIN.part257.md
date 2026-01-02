---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 257
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 257 of 552)

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

---[FILE: src/vs/editor/test/node/diffing/fixtures/method-splitting/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/method-splitting/legacy.expected.diff.json

```json
{
	"original": {
		"content": "class Test {\n    public getDecorationsViewportData(viewRange: Range): IDecorationsViewportData {\n\t\treturn null!;\n\t}\n\n\tpublic getInlineDecorationsOnLine(lineNumber: number): InlineDecoration[] {\n\t\tconst range = new Range(lineNumber, this._linesCollection.getViewLineMinColumn(lineNumber), lineNumber, this._linesCollection.getViewLineMaxColumn(lineNumber));\n\t\treturn this._getDecorationsInRange(range).inlineDecorations[0];\n\t}\n\n\tprivate _getDecorationsInRange(viewRange: Range): IDecorationsViewportData {\n\t\tconst modelDecorations = this._linesCollection.getDecorationsInRange(viewRange, this.editorId, filterValidationDecorations(this.configuration.options));\n\t\tconst startLineNumber = viewRange.startLineNumber;\n\t\tconst endLineNumber = viewRange.endLineNumber;\n\n\t\tconst decorationsInViewport: ViewModelDecoration[] = [];\n\t\tlet decorationsInViewportLen = 0;\n\t\tconst inlineDecorations: InlineDecoration[][] = [];\n\t\tfor (let j = startLineNumber; j <= endLineNumber; j++) {\n\t\t\tinlineDecorations[j - startLineNumber] = [];\n\t\t}\n\n\t\tfor (let i = 0, len = modelDecorations.length; i < len; i++) {\n\t\t\tconst modelDecoration = modelDecorations[i];\n\t\t\tconst decorationOptions = modelDecoration.options;\n\n\t\t\tif (!isModelDecorationVisible(this.model, modelDecoration)) {\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\tconst viewModelDecoration = this._getOrCreateViewModelDecoration(modelDecoration);\n\t\t\tconst viewRange = viewModelDecoration.range;\n\n\t\t\tdecorationsInViewport[decorationsInViewportLen++] = viewModelDecoration;\n\n\t\t\tif (decorationOptions.inlineClassName) {\n\t\t\t\tconst inlineDecoration = new InlineDecoration(viewRange, decorationOptions.inlineClassName, decorationOptions.inlineClassNameAffectsLetterSpacing ? InlineDecorationType.RegularAffectingLetterSpacing : InlineDecorationType.Regular);\n\t\t\t\tconst intersectedStartLineNumber = Math.max(startLineNumber, viewRange.startLineNumber);\n\t\t\t\tconst intersectedEndLineNumber = Math.min(endLineNumber, viewRange.endLineNumber);\n\t\t\t\tfor (let j = intersectedStartLineNumber; j <= intersectedEndLineNumber; j++) {\n\t\t\t\t\tinlineDecorations[j - startLineNumber].push(inlineDecoration);\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (decorationOptions.beforeContentClassName) {\n\t\t\t\tif (startLineNumber <= viewRange.startLineNumber && viewRange.startLineNumber <= endLineNumber) {\n\t\t\t\t\tconst inlineDecoration = new InlineDecoration(\n\t\t\t\t\t\tnew Range(viewRange.startLineNumber, viewRange.startColumn, viewRange.startLineNumber, viewRange.startColumn),\n\t\t\t\t\t\tdecorationOptions.beforeContentClassName,\n\t\t\t\t\t\tInlineDecorationType.Before\n\t\t\t\t\t);\n\t\t\t\t\tinlineDecorations[viewRange.startLineNumber - startLineNumber].push(inlineDecoration);\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (decorationOptions.afterContentClassName) {\n\t\t\t\tif (startLineNumber <= viewRange.endLineNumber && viewRange.endLineNumber <= endLineNumber) {\n\t\t\t\t\tconst inlineDecoration = new InlineDecoration(\n\t\t\t\t\t\tnew Range(viewRange.endLineNumber, viewRange.endColumn, viewRange.endLineNumber, viewRange.endColumn),\n\t\t\t\t\t\tdecorationOptions.afterContentClassName,\n\t\t\t\t\t\tInlineDecorationType.After\n\t\t\t\t\t);\n\t\t\t\t\tinlineDecorations[viewRange.endLineNumber - startLineNumber].push(inlineDecoration);\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn {\n\t\t\tdecorations: decorationsInViewport,\n\t\t\tinlineDecorations: inlineDecorations\n\t\t};\n\t}\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "class Test {\n    public getDecorationsViewportData(viewRange: Range): IDecorationsViewportData {\n\t\treturn null!;\n\t}\n\n\tprivate _getDecorationsViewportData(viewportRange: Range, onlyMinimapDecorations: boolean): IDecorationsViewportData {\n\t\tconst modelDecorations = this._linesCollection.getDecorationsInRange(viewportRange, this.editorId, filterValidationDecorations(this.configuration.options), onlyMinimapDecorations);\n\n\t\tconst startLineNumber = viewportRange.startLineNumber;\n\t\tconst endLineNumber = viewportRange.endLineNumber;\n\n\t\tconst decorationsInViewport: ViewModelDecoration[] = [];\n\t\tlet decorationsInViewportLen = 0;\n\t\tconst inlineDecorations: InlineDecoration[][] = [];\n\t\tfor (let j = startLineNumber; j <= endLineNumber; j++) {\n\t\t\tinlineDecorations[j - startLineNumber] = [];\n\t\t}\n\n\t\tfor (let i = 0, len = modelDecorations.length; i < len; i++) {\n\t\t\tconst modelDecoration = modelDecorations[i];\n\t\t\tconst decorationOptions = modelDecoration.options;\n\n\t\t\tif (!isModelDecorationVisible(this.model, modelDecoration)) {\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\tconst viewModelDecoration = this._getOrCreateViewModelDecoration(modelDecoration);\n\t\t\tconst viewRange = viewModelDecoration.range;\n\n\t\t\tdecorationsInViewport[decorationsInViewportLen++] = viewModelDecoration;\n\n\t\t\tif (decorationOptions.inlineClassName) {\n\t\t\t\tconst inlineDecoration = new InlineDecoration(viewRange, decorationOptions.inlineClassName, decorationOptions.inlineClassNameAffectsLetterSpacing ? InlineDecorationType.RegularAffectingLetterSpacing : InlineDecorationType.Regular);\n\t\t\t\tconst intersectedStartLineNumber = Math.max(startLineNumber, viewRange.startLineNumber);\n\t\t\t\tconst intersectedEndLineNumber = Math.min(endLineNumber, viewRange.endLineNumber);\n\t\t\t\tfor (let j = intersectedStartLineNumber; j <= intersectedEndLineNumber; j++) {\n\t\t\t\t\tinlineDecorations[j - startLineNumber].push(inlineDecoration);\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (decorationOptions.beforeContentClassName) {\n\t\t\t\tif (startLineNumber <= viewRange.startLineNumber && viewRange.startLineNumber <= endLineNumber) {\n\t\t\t\t\tconst inlineDecoration = new InlineDecoration(\n\t\t\t\t\t\tnew Range(viewRange.startLineNumber, viewRange.startColumn, viewRange.startLineNumber, viewRange.startColumn),\n\t\t\t\t\t\tdecorationOptions.beforeContentClassName,\n\t\t\t\t\t\tInlineDecorationType.Before\n\t\t\t\t\t);\n\t\t\t\t\tinlineDecorations[viewRange.startLineNumber - startLineNumber].push(inlineDecoration);\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (decorationOptions.afterContentClassName) {\n\t\t\t\tif (startLineNumber <= viewRange.endLineNumber && viewRange.endLineNumber <= endLineNumber) {\n\t\t\t\t\tconst inlineDecoration = new InlineDecoration(\n\t\t\t\t\t\tnew Range(viewRange.endLineNumber, viewRange.endColumn, viewRange.endLineNumber, viewRange.endColumn),\n\t\t\t\t\t\tdecorationOptions.afterContentClassName,\n\t\t\t\t\t\tInlineDecorationType.After\n\t\t\t\t\t);\n\t\t\t\t\tinlineDecorations[viewRange.endLineNumber - startLineNumber].push(inlineDecoration);\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn {\n\t\t\tdecorations: decorationsInViewport,\n\t\t\tinlineDecorations: inlineDecorations\n\t\t};\n\t}\n}",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[6,10)",
			"modifiedRange": "[6,8)",
			"innerChanges": [
				{
					"originalRange": "[6,3 -> 6,9]",
					"modifiedRange": "[6,3 -> 6,11]"
				},
				{
					"originalRange": "[6,12 -> 6,18]",
					"modifiedRange": "[6,14 -> 6,14]"
				},
				{
					"originalRange": "[6,29 -> 6,54]",
					"modifiedRange": "[6,25 -> 6,91]"
				},
				{
					"originalRange": "[6,58 -> 6,63]",
					"modifiedRange": "[6,95 -> 6,95]"
				},
				{
					"originalRange": "[6,73 -> 6,75]",
					"modifiedRange": "[6,105 -> 6,118]"
				},
				{
					"originalRange": "[7,9 -> 7,38]",
					"modifiedRange": "[7,9 -> 7,27]"
				},
				{
					"originalRange": "[7,64 -> 7,105]",
					"modifiedRange": "[7,53 -> 7,85]"
				},
				{
					"originalRange": "[7,112 -> 7,124]",
					"modifiedRange": "[7,92 -> 7,114]"
				},
				{
					"originalRange": "[7,128 -> 8,10]",
					"modifiedRange": "[7,118 -> 7,130]"
				},
				{
					"originalRange": "[8,15 -> 8,23]",
					"modifiedRange": "[7,135 -> 7,142]"
				},
				{
					"originalRange": "[8,29 -> 8,51]",
					"modifiedRange": "[7,148 -> 7,170]"
				},
				{
					"originalRange": "[8,62 -> 9,3 EOL]",
					"modifiedRange": "[7,181 -> 7,183 EOL]"
				}
			]
		},
		{
			"originalRange": "[11,15)",
			"modifiedRange": "[9,11)",
			"innerChanges": [
				{
					"originalRange": "[11,1 -> 13,1]",
					"modifiedRange": "[9,1 -> 9,1]"
				},
				{
					"originalRange": "[13,31 -> 13,31]",
					"modifiedRange": "[9,31 -> 9,35]"
				},
				{
					"originalRange": "[14,29 -> 14,29]",
					"modifiedRange": "[10,29 -> 10,33]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/minimal-diff-character/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/minimal-diff-character/1.tst

```text
import * as path from 'path';
import { Command } from 'vscode';
import * as nls from 'vscode-nls';

"()()()()()()()()()()()()()"
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/minimal-diff-character/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/minimal-diff-character/2.tst

```text
import * as path from 'path';
import { Command, commands } from 'vscode';
import * as nls from 'vscode-nls';

"Gallicum()est()divisa()in()partres()tres()quarum()unam()est()()()()()()()()()()()()"
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/minimal-diff-character/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/minimal-diff-character/advanced.expected.diff.json

```json
{
	"original": {
		"content": "import * as path from 'path';\nimport { Command } from 'vscode';\nimport * as nls from 'vscode-nls';\n\n\"()()()()()()()()()()()()()\"",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import * as path from 'path';\nimport { Command, commands } from 'vscode';\nimport * as nls from 'vscode-nls';\n\n\"Gallicum()est()divisa()in()partres()tres()quarum()unam()est()()()()()()()()()()()()\"",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,3)",
			"modifiedRange": "[2,3)",
			"innerChanges": [
				{
					"originalRange": "[2,17 -> 2,17]",
					"modifiedRange": "[2,17 -> 2,27]"
				}
			]
		},
		{
			"originalRange": "[5,6)",
			"modifiedRange": "[5,6)",
			"innerChanges": [
				{
					"originalRange": "[5,2 -> 5,4]",
					"modifiedRange": "[5,2 -> 5,61]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/minimal-diff-character/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/minimal-diff-character/legacy.expected.diff.json

```json
{
	"original": {
		"content": "import * as path from 'path';\nimport { Command } from 'vscode';\nimport * as nls from 'vscode-nls';\n\n\"()()()()()()()()()()()()()\"",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "import * as path from 'path';\nimport { Command, commands } from 'vscode';\nimport * as nls from 'vscode-nls';\n\n\"Gallicum()est()divisa()in()partres()tres()quarum()unam()est()()()()()()()()()()()()\"",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,3)",
			"modifiedRange": "[2,3)",
			"innerChanges": [
				{
					"originalRange": "[2,17 -> 2,17]",
					"modifiedRange": "[2,17 -> 2,27]"
				}
			]
		},
		{
			"originalRange": "[5,6)",
			"modifiedRange": "[5,6)",
			"innerChanges": [
				{
					"originalRange": "[5,2 -> 5,4]",
					"modifiedRange": "[5,2 -> 5,61]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/move-1/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/move-1/1.tst

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from 'vs/base/common/arrays';
import { IdleDeadline, runWhenIdle } from 'vs/base/common/async';
import { BugIndicatingError, onUnexpectedError } from 'vs/base/common/errors';
import { Disposable, MutableDisposable } from 'vs/base/common/lifecycle';
import { setTimeout0 } from 'vs/base/common/platform';
import { StopWatch } from 'vs/base/common/stopwatch';
import { countEOL } from 'vs/editor/common/core/eolCounter';
import { Position } from 'vs/editor/common/core/position';
import { IRange } from 'vs/editor/common/core/range';
import { StandardTokenType } from 'vs/editor/common/encodedTokenAttributes';
import { EncodedTokenizationResult, IBackgroundTokenizationStore, IBackgroundTokenizer, ILanguageIdCodec, IState, ITokenizationSupport, TokenizationRegistry } from 'vs/editor/common/languages';
import { nullTokenizeEncoded } from 'vs/editor/common/languages/nullTokenize';
import { ITextModel } from 'vs/editor/common/model';
import { TextModel } from 'vs/editor/common/model/textModel';
import { TokenizationTextModelPart } from 'vs/editor/common/model/tokenizationTextModelPart';
import { IModelContentChangedEvent, IModelLanguageChangedEvent } from 'vs/editor/common/textModelEvents';
import { ContiguousMultilineTokensBuilder } from 'vs/editor/common/tokens/contiguousMultilineTokensBuilder';
import { LineTokens } from 'vs/editor/common/tokens/lineTokens';

const enum Constants {
	CHEAP_TOKENIZATION_LENGTH_LIMIT = 2048
}

/**
 * An array that avoids being sparse by always
 * filling up unused indices with a default value.
 */
export class ContiguousGrowingArray<T> {

	private _store: T[] = [];

	constructor(
		private readonly _default: T
	) { }

	public get(index: number): T {
		if (index < this._store.length) {
			return this._store[index];
		}
		return this._default;
	}

	public set(index: number, value: T): void {
		while (index >= this._store.length) {
			this._store[this._store.length] = this._default;
		}
		this._store[index] = value;
	}

	// TODO have `replace` instead of `delete` and `insert`
	public delete(deleteIndex: number, deleteCount: number): void {
		if (deleteCount === 0 || deleteIndex >= this._store.length) {
			return;
		}
		this._store.splice(deleteIndex, deleteCount);
	}

	public insert(insertIndex: number, insertCount: number): void {
		if (insertCount === 0 || insertIndex >= this._store.length) {
			return;
		}
		const arr: T[] = [];
		for (let i = 0; i < insertCount; i++) {
			arr[i] = this._default;
		}
		this._store = arrays.arrayInsert(this._store, insertIndex, arr);
	}
}

/**
 * Stores the states at the start of each line and keeps track of which lines
 * must be re-tokenized. Also uses state equality to quickly validate lines
 * that don't need to be re-tokenized.
 *
 * For example, when typing on a line, the line gets marked as needing to be tokenized.
 * Once the line is tokenized, the end state is checked for equality against the begin
 * state of the next line. If the states are equal, tokenization doesn't need to run
 * again over the rest of the file. If the states are not equal, the next line gets marked
 * as needing to be tokenized.
 */
export class TokenizationStateStore {
	requestTokens(startLineNumber: number, endLineNumberExclusive: number): void {
		for (let lineNumber = startLineNumber; lineNumber < endLineNumberExclusive; lineNumber++) {
			this._stateStore.markMustBeTokenized(lineNumber - 1);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/move-1/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/move-1/2.tst

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from 'vs/base/common/arrays';
import { IdleDeadline, runWhenIdle } from 'vs/base/common/async';
import { BugIndicatingError, onUnexpectedError } from 'vs/base/common/errors';
import { Disposable, MutableDisposable } from 'vs/base/common/lifecycle';
import { setTimeout0 } from 'vs/base/common/platform';
import { StopWatch } from 'vs/base/common/stopwatch';
import { countEOL } from 'vs/editor/common/core/eolCounter';
import { Position } from 'vs/editor/common/core/position';
import { IRange } from 'vs/editor/common/core/range';
import { StandardTokenType } from 'vs/editor/common/encodedTokenAttributes';
import { EncodedTokenizationResult, IBackgroundTokenizationStore, IBackgroundTokenizer, ILanguageIdCodec, IState, ITokenizationSupport, TokenizationRegistry } from 'vs/editor/common/languages';
import { nullTokenizeEncoded } from 'vs/editor/common/languages/nullTokenize';
import { ITextModel } from 'vs/editor/common/model';
import { TextModel } from 'vs/editor/common/model/textModel';
import { TokenizationTextModelPart } from 'vs/editor/common/model/tokenizationTextModelPart';
import { IModelContentChangedEvent, IModelLanguageChangedEvent } from 'vs/editor/common/textModelEvents';
import { ContiguousMultilineTokensBuilder } from 'vs/editor/common/tokens/contiguousMultilineTokensBuilder';
import { LineTokens } from 'vs/editor/common/tokens/lineTokens';

/**
 * An array that avoids being sparse by always
 * filling up unused indices with a default value.
 */
export class ContiguousGrowingArray<T> {

	private _store: T[] = [];

	constructor(
		private readonly _default: T
	) { }

	public get(index: number): T {
		if (index < this._store.length) {
			return this._store[index];
		}
		return this._default;
	}

	public set(index: number, value: T): void {
		while (index >= this._store.length) {
			this._store[this._store.length] = this._default;
		}
		this._store[index] = value;
	}

	// TODO have `replace` instead of `delete` and `insert`
	public delete(deleteIndex: number, deleteCount: number): void {
		if (deleteCount === 0 || deleteIndex >= this._store.length) {
			return;
		}
		this._store.splice(deleteIndex, deleteCount);
	}

	public insert(insertIndex: number, insertCount: number): void {
		if (insertCount === 0 || insertIndex >= this._store.length) {
			return;
		}
		const arr: T[] = [];
		for (let i = 0; i < insertCount; i++) {
			arr[i] = this._default;
		}
		this._store = arrays.arrayInsert(this._store, insertIndex, arr);
	}
}

const enum Constants {
	CHEAP_TOKENIZATION_LENGTH_LIMIT = 1024
}

/**
 * Stores the states at the start of each line and keeps track of which lines
 * must be re-tokenized. Also uses state equality to quickly validate lines
 * that don't need to be re-tokenized.
 *
 * For example, when typing on a line, the line gets marked as needing to be tokenized.
 * Once the line is tokenized, the end state is checked for equality against the begin
 * state of the next line. If the states are equal, tokenization doesn't need to run
 * again over the rest of the file. If the states are not equal, the next line gets marked
 * as needing to be tokenized.
 */
export class TokenizationStateStore {
	requestTokens(startLineNumber: number, endLineNumberExclusive: number): void {
		for (let lineNumber = startLineNumber; lineNumber < endLineNumberExclusive; lineNumber++) {
			this._stateStore.markMustBeTokenized(lineNumber - 1);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/move-1/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/move-1/advanced.expected.diff.json

```json
{
	"original": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport * as arrays from 'vs/base/common/arrays';\nimport { IdleDeadline, runWhenIdle } from 'vs/base/common/async';\nimport { BugIndicatingError, onUnexpectedError } from 'vs/base/common/errors';\nimport { Disposable, MutableDisposable } from 'vs/base/common/lifecycle';\nimport { setTimeout0 } from 'vs/base/common/platform';\nimport { StopWatch } from 'vs/base/common/stopwatch';\nimport { countEOL } from 'vs/editor/common/core/eolCounter';\nimport { Position } from 'vs/editor/common/core/position';\nimport { IRange } from 'vs/editor/common/core/range';\nimport { StandardTokenType } from 'vs/editor/common/encodedTokenAttributes';\nimport { EncodedTokenizationResult, IBackgroundTokenizationStore, IBackgroundTokenizer, ILanguageIdCodec, IState, ITokenizationSupport, TokenizationRegistry } from 'vs/editor/common/languages';\nimport { nullTokenizeEncoded } from 'vs/editor/common/languages/nullTokenize';\nimport { ITextModel } from 'vs/editor/common/model';\nimport { TextModel } from 'vs/editor/common/model/textModel';\nimport { TokenizationTextModelPart } from 'vs/editor/common/model/tokenizationTextModelPart';\nimport { IModelContentChangedEvent, IModelLanguageChangedEvent } from 'vs/editor/common/textModelEvents';\nimport { ContiguousMultilineTokensBuilder } from 'vs/editor/common/tokens/contiguousMultilineTokensBuilder';\nimport { LineTokens } from 'vs/editor/common/tokens/lineTokens';\n\nconst enum Constants {\n\tCHEAP_TOKENIZATION_LENGTH_LIMIT = 2048\n}\n\n/**\n * An array that avoids being sparse by always\n * filling up unused indices with a default value.\n */\nexport class ContiguousGrowingArray<T> {\n\n\tprivate _store: T[] = [];\n\n\tconstructor(\n\t\tprivate readonly _default: T\n\t) { }\n\n\tpublic get(index: number): T {\n\t\tif (index < this._store.length) {\n\t\t\treturn this._store[index];\n\t\t}\n\t\treturn this._default;\n\t}\n\n\tpublic set(index: number, value: T): void {\n\t\twhile (index >= this._store.length) {\n\t\t\tthis._store[this._store.length] = this._default;\n\t\t}\n\t\tthis._store[index] = value;\n\t}\n\n\t// TODO have `replace` instead of `delete` and `insert`\n\tpublic delete(deleteIndex: number, deleteCount: number): void {\n\t\tif (deleteCount === 0 || deleteIndex >= this._store.length) {\n\t\t\treturn;\n\t\t}\n\t\tthis._store.splice(deleteIndex, deleteCount);\n\t}\n\n\tpublic insert(insertIndex: number, insertCount: number): void {\n\t\tif (insertCount === 0 || insertIndex >= this._store.length) {\n\t\t\treturn;\n\t\t}\n\t\tconst arr: T[] = [];\n\t\tfor (let i = 0; i < insertCount; i++) {\n\t\t\tarr[i] = this._default;\n\t\t}\n\t\tthis._store = arrays.arrayInsert(this._store, insertIndex, arr);\n\t}\n}\n\n/**\n * Stores the states at the start of each line and keeps track of which lines\n * must be re-tokenized. Also uses state equality to quickly validate lines\n * that don't need to be re-tokenized.\n *\n * For example, when typing on a line, the line gets marked as needing to be tokenized.\n * Once the line is tokenized, the end state is checked for equality against the begin\n * state of the next line. If the states are equal, tokenization doesn't need to run\n * again over the rest of the file. If the states are not equal, the next line gets marked\n * as needing to be tokenized.\n */\nexport class TokenizationStateStore {\n\trequestTokens(startLineNumber: number, endLineNumberExclusive: number): void {\n\t\tfor (let lineNumber = startLineNumber; lineNumber < endLineNumberExclusive; lineNumber++) {\n\t\t\tthis._stateStore.markMustBeTokenized(lineNumber - 1);\n\t\t}\n\t}\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport * as arrays from 'vs/base/common/arrays';\nimport { IdleDeadline, runWhenIdle } from 'vs/base/common/async';\nimport { BugIndicatingError, onUnexpectedError } from 'vs/base/common/errors';\nimport { Disposable, MutableDisposable } from 'vs/base/common/lifecycle';\nimport { setTimeout0 } from 'vs/base/common/platform';\nimport { StopWatch } from 'vs/base/common/stopwatch';\nimport { countEOL } from 'vs/editor/common/core/eolCounter';\nimport { Position } from 'vs/editor/common/core/position';\nimport { IRange } from 'vs/editor/common/core/range';\nimport { StandardTokenType } from 'vs/editor/common/encodedTokenAttributes';\nimport { EncodedTokenizationResult, IBackgroundTokenizationStore, IBackgroundTokenizer, ILanguageIdCodec, IState, ITokenizationSupport, TokenizationRegistry } from 'vs/editor/common/languages';\nimport { nullTokenizeEncoded } from 'vs/editor/common/languages/nullTokenize';\nimport { ITextModel } from 'vs/editor/common/model';\nimport { TextModel } from 'vs/editor/common/model/textModel';\nimport { TokenizationTextModelPart } from 'vs/editor/common/model/tokenizationTextModelPart';\nimport { IModelContentChangedEvent, IModelLanguageChangedEvent } from 'vs/editor/common/textModelEvents';\nimport { ContiguousMultilineTokensBuilder } from 'vs/editor/common/tokens/contiguousMultilineTokensBuilder';\nimport { LineTokens } from 'vs/editor/common/tokens/lineTokens';\n\n/**\n * An array that avoids being sparse by always\n * filling up unused indices with a default value.\n */\nexport class ContiguousGrowingArray<T> {\n\n\tprivate _store: T[] = [];\n\n\tconstructor(\n\t\tprivate readonly _default: T\n\t) { }\n\n\tpublic get(index: number): T {\n\t\tif (index < this._store.length) {\n\t\t\treturn this._store[index];\n\t\t}\n\t\treturn this._default;\n\t}\n\n\tpublic set(index: number, value: T): void {\n\t\twhile (index >= this._store.length) {\n\t\t\tthis._store[this._store.length] = this._default;\n\t\t}\n\t\tthis._store[index] = value;\n\t}\n\n\t// TODO have `replace` instead of `delete` and `insert`\n\tpublic delete(deleteIndex: number, deleteCount: number): void {\n\t\tif (deleteCount === 0 || deleteIndex >= this._store.length) {\n\t\t\treturn;\n\t\t}\n\t\tthis._store.splice(deleteIndex, deleteCount);\n\t}\n\n\tpublic insert(insertIndex: number, insertCount: number): void {\n\t\tif (insertCount === 0 || insertIndex >= this._store.length) {\n\t\t\treturn;\n\t\t}\n\t\tconst arr: T[] = [];\n\t\tfor (let i = 0; i < insertCount; i++) {\n\t\t\tarr[i] = this._default;\n\t\t}\n\t\tthis._store = arrays.arrayInsert(this._store, insertIndex, arr);\n\t}\n}\n\nconst enum Constants {\n\tCHEAP_TOKENIZATION_LENGTH_LIMIT = 1024\n}\n\n/**\n * Stores the states at the start of each line and keeps track of which lines\n * must be re-tokenized. Also uses state equality to quickly validate lines\n * that don't need to be re-tokenized.\n *\n * For example, when typing on a line, the line gets marked as needing to be tokenized.\n * Once the line is tokenized, the end state is checked for equality against the begin\n * state of the next line. If the states are equal, tokenization doesn't need to run\n * again over the rest of the file. If the states are not equal, the next line gets marked\n * as needing to be tokenized.\n */\nexport class TokenizationStateStore {\n\trequestTokens(startLineNumber: number, endLineNumberExclusive: number): void {\n\t\tfor (let lineNumber = startLineNumber; lineNumber < endLineNumberExclusive; lineNumber++) {\n\t\t\tthis._stateStore.markMustBeTokenized(lineNumber - 1);\n\t\t}\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[24,28)",
			"modifiedRange": "[24,24)",
			"innerChanges": [
				{
					"originalRange": "[24,1 -> 28,1 EOL]",
					"modifiedRange": "[24,1 -> 24,1 EOL]"
				}
			]
		},
		{
			"originalRange": "[74,74)",
			"modifiedRange": "[70,74)",
			"innerChanges": [
				{
					"originalRange": "[74,1 -> 74,1 EOL]",
					"modifiedRange": "[70,1 -> 74,1 EOL]"
				}
			]
		}
	],
	"moves": [
		{
			"originalRange": "[24,28)",
			"modifiedRange": "[70,74)",
			"changes": [
				{
					"originalRange": "[26,27)",
					"modifiedRange": "[72,73)",
					"innerChanges": [
						{
							"originalRange": "[26,36 -> 26,40 EOL]",
							"modifiedRange": "[72,36 -> 72,40 EOL]"
						}
					]
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/move-1/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/move-1/legacy.expected.diff.json

```json
{
	"original": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport * as arrays from 'vs/base/common/arrays';\nimport { IdleDeadline, runWhenIdle } from 'vs/base/common/async';\nimport { BugIndicatingError, onUnexpectedError } from 'vs/base/common/errors';\nimport { Disposable, MutableDisposable } from 'vs/base/common/lifecycle';\nimport { setTimeout0 } from 'vs/base/common/platform';\nimport { StopWatch } from 'vs/base/common/stopwatch';\nimport { countEOL } from 'vs/editor/common/core/eolCounter';\nimport { Position } from 'vs/editor/common/core/position';\nimport { IRange } from 'vs/editor/common/core/range';\nimport { StandardTokenType } from 'vs/editor/common/encodedTokenAttributes';\nimport { EncodedTokenizationResult, IBackgroundTokenizationStore, IBackgroundTokenizer, ILanguageIdCodec, IState, ITokenizationSupport, TokenizationRegistry } from 'vs/editor/common/languages';\nimport { nullTokenizeEncoded } from 'vs/editor/common/languages/nullTokenize';\nimport { ITextModel } from 'vs/editor/common/model';\nimport { TextModel } from 'vs/editor/common/model/textModel';\nimport { TokenizationTextModelPart } from 'vs/editor/common/model/tokenizationTextModelPart';\nimport { IModelContentChangedEvent, IModelLanguageChangedEvent } from 'vs/editor/common/textModelEvents';\nimport { ContiguousMultilineTokensBuilder } from 'vs/editor/common/tokens/contiguousMultilineTokensBuilder';\nimport { LineTokens } from 'vs/editor/common/tokens/lineTokens';\n\nconst enum Constants {\n\tCHEAP_TOKENIZATION_LENGTH_LIMIT = 2048\n}\n\n/**\n * An array that avoids being sparse by always\n * filling up unused indices with a default value.\n */\nexport class ContiguousGrowingArray<T> {\n\n\tprivate _store: T[] = [];\n\n\tconstructor(\n\t\tprivate readonly _default: T\n\t) { }\n\n\tpublic get(index: number): T {\n\t\tif (index < this._store.length) {\n\t\t\treturn this._store[index];\n\t\t}\n\t\treturn this._default;\n\t}\n\n\tpublic set(index: number, value: T): void {\n\t\twhile (index >= this._store.length) {\n\t\t\tthis._store[this._store.length] = this._default;\n\t\t}\n\t\tthis._store[index] = value;\n\t}\n\n\t// TODO have `replace` instead of `delete` and `insert`\n\tpublic delete(deleteIndex: number, deleteCount: number): void {\n\t\tif (deleteCount === 0 || deleteIndex >= this._store.length) {\n\t\t\treturn;\n\t\t}\n\t\tthis._store.splice(deleteIndex, deleteCount);\n\t}\n\n\tpublic insert(insertIndex: number, insertCount: number): void {\n\t\tif (insertCount === 0 || insertIndex >= this._store.length) {\n\t\t\treturn;\n\t\t}\n\t\tconst arr: T[] = [];\n\t\tfor (let i = 0; i < insertCount; i++) {\n\t\t\tarr[i] = this._default;\n\t\t}\n\t\tthis._store = arrays.arrayInsert(this._store, insertIndex, arr);\n\t}\n}\n\n/**\n * Stores the states at the start of each line and keeps track of which lines\n * must be re-tokenized. Also uses state equality to quickly validate lines\n * that don't need to be re-tokenized.\n *\n * For example, when typing on a line, the line gets marked as needing to be tokenized.\n * Once the line is tokenized, the end state is checked for equality against the begin\n * state of the next line. If the states are equal, tokenization doesn't need to run\n * again over the rest of the file. If the states are not equal, the next line gets marked\n * as needing to be tokenized.\n */\nexport class TokenizationStateStore {\n\trequestTokens(startLineNumber: number, endLineNumberExclusive: number): void {\n\t\tfor (let lineNumber = startLineNumber; lineNumber < endLineNumberExclusive; lineNumber++) {\n\t\t\tthis._stateStore.markMustBeTokenized(lineNumber - 1);\n\t\t}\n\t}\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport * as arrays from 'vs/base/common/arrays';\nimport { IdleDeadline, runWhenIdle } from 'vs/base/common/async';\nimport { BugIndicatingError, onUnexpectedError } from 'vs/base/common/errors';\nimport { Disposable, MutableDisposable } from 'vs/base/common/lifecycle';\nimport { setTimeout0 } from 'vs/base/common/platform';\nimport { StopWatch } from 'vs/base/common/stopwatch';\nimport { countEOL } from 'vs/editor/common/core/eolCounter';\nimport { Position } from 'vs/editor/common/core/position';\nimport { IRange } from 'vs/editor/common/core/range';\nimport { StandardTokenType } from 'vs/editor/common/encodedTokenAttributes';\nimport { EncodedTokenizationResult, IBackgroundTokenizationStore, IBackgroundTokenizer, ILanguageIdCodec, IState, ITokenizationSupport, TokenizationRegistry } from 'vs/editor/common/languages';\nimport { nullTokenizeEncoded } from 'vs/editor/common/languages/nullTokenize';\nimport { ITextModel } from 'vs/editor/common/model';\nimport { TextModel } from 'vs/editor/common/model/textModel';\nimport { TokenizationTextModelPart } from 'vs/editor/common/model/tokenizationTextModelPart';\nimport { IModelContentChangedEvent, IModelLanguageChangedEvent } from 'vs/editor/common/textModelEvents';\nimport { ContiguousMultilineTokensBuilder } from 'vs/editor/common/tokens/contiguousMultilineTokensBuilder';\nimport { LineTokens } from 'vs/editor/common/tokens/lineTokens';\n\n/**\n * An array that avoids being sparse by always\n * filling up unused indices with a default value.\n */\nexport class ContiguousGrowingArray<T> {\n\n\tprivate _store: T[] = [];\n\n\tconstructor(\n\t\tprivate readonly _default: T\n\t) { }\n\n\tpublic get(index: number): T {\n\t\tif (index < this._store.length) {\n\t\t\treturn this._store[index];\n\t\t}\n\t\treturn this._default;\n\t}\n\n\tpublic set(index: number, value: T): void {\n\t\twhile (index >= this._store.length) {\n\t\t\tthis._store[this._store.length] = this._default;\n\t\t}\n\t\tthis._store[index] = value;\n\t}\n\n\t// TODO have `replace` instead of `delete` and `insert`\n\tpublic delete(deleteIndex: number, deleteCount: number): void {\n\t\tif (deleteCount === 0 || deleteIndex >= this._store.length) {\n\t\t\treturn;\n\t\t}\n\t\tthis._store.splice(deleteIndex, deleteCount);\n\t}\n\n\tpublic insert(insertIndex: number, insertCount: number): void {\n\t\tif (insertCount === 0 || insertIndex >= this._store.length) {\n\t\t\treturn;\n\t\t}\n\t\tconst arr: T[] = [];\n\t\tfor (let i = 0; i < insertCount; i++) {\n\t\t\tarr[i] = this._default;\n\t\t}\n\t\tthis._store = arrays.arrayInsert(this._store, insertIndex, arr);\n\t}\n}\n\nconst enum Constants {\n\tCHEAP_TOKENIZATION_LENGTH_LIMIT = 1024\n}\n\n/**\n * Stores the states at the start of each line and keeps track of which lines\n * must be re-tokenized. Also uses state equality to quickly validate lines\n * that don't need to be re-tokenized.\n *\n * For example, when typing on a line, the line gets marked as needing to be tokenized.\n * Once the line is tokenized, the end state is checked for equality against the begin\n * state of the next line. If the states are equal, tokenization doesn't need to run\n * again over the rest of the file. If the states are not equal, the next line gets marked\n * as needing to be tokenized.\n */\nexport class TokenizationStateStore {\n\trequestTokens(startLineNumber: number, endLineNumberExclusive: number): void {\n\t\tfor (let lineNumber = startLineNumber; lineNumber < endLineNumberExclusive; lineNumber++) {\n\t\t\tthis._stateStore.markMustBeTokenized(lineNumber - 1);\n\t\t}\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[25,29)",
			"modifiedRange": "[25,25)",
			"innerChanges": null
		},
		{
			"originalRange": "[75,75)",
			"modifiedRange": "[71,75)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/noise-1/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/noise-1/1.tst

```text
this._sash = derivedWithStore('sash', (reader, store) => {
	const showSash = this._options.renderSideBySide.read(reader);
	this.elements.root.classList.toggle('side-by-side', showSash);
	if (!showSash) { return undefined; }
	const result = store.add(new DiffEditorSash(
		this._options,
		this.elements.root,
		{
			height: this._rootSizeObserver.height,
			width: this._rootSizeObserver.width.map((w, reader) => w - (this._options.renderOverviewRuler.read(reader) ? OverviewRulerPart.ENTIRE_DIFF_OVERVIEW_WIDTH : 0)),
		}
	));
	store.add(autorun('setBoundarySashes', reader => {
		const boundarySashes = this._boundarySashes.read(reader);
		if (boundarySashes) {
			result.setBoundarySashes(boundarySashes);
		}
	}));
	return result;
});
this._register(keepAlive(this._sash, true));

this._register(autorunWithStore2('UnchangedRangesFeature', (reader, store) => {
	this.unchangedRangesFeature = store.add(new (readHotReloadableExport(UnchangedRangesFeature, reader))(this._editors, this._diffModel, this._options));
}));

this._register(autorunWithStore2('DiffEditorDecorations', (reader, store) => {
	store.add(new (readHotReloadableExport(DiffEditorDecorations, reader))(this._editors, this._diffModel, this._options));
}));
this._register(autorunWithStore2('ViewZoneManager', (reader, store) => {
	store.add(this._instantiationService.createInstance(
		readHotReloadableExport(ViewZoneManager, reader),
		this._editors,
		this._diffModel,
		this._options,
		this,
		() => this.unchangedRangesFeature.isUpdatingViewZones,
	));
}));

this._register(autorunWithStore2('OverviewRulerPart', (reader, store) => {
	store.add(this._instantiationService.createInstance(readHotReloadableExport(OverviewRulerPart, reader), this._editors,
		this.elements.root,
		this._diffModel,
		this._rootSizeObserver.width,
		this._rootSizeObserver.height,
		this._layoutInfo.map(i => i.modifiedEditor),
		this._options,
	));
}));

this._reviewPane = this._register(this._instantiationService.createInstance(DiffReview2, this));
this.elements.root.appendChild(this._reviewPane.domNode.domNode);
this.elements.root.appendChild(this._reviewPane.actionBarContainer.domNode);
reviewPaneObservable.set(this._reviewPane, undefined);

this._createDiffEditorContributions();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/noise-1/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/noise-1/2.tst

```text
this._sash = derivedWithStore('sash', (reader, store) => {
	const showSash = this._options.renderSideBySide.read(reader);
	this.elements.root.classList.toggle('side-by-side', showSash);
	if (!showSash) { return undefined; }
	const result = store.add(new DiffEditorSash(
		this._options,
		this.elements.root,
		{
			height: this._rootSizeObserver.height,
			width: this._rootSizeObserver.width.map((w, reader) => w - (this._options.renderOverviewRuler.read(reader) ? OverviewRulerPart.ENTIRE_DIFF_OVERVIEW_WIDTH : 0)),
		}
	));
	store.add(autorun('setBoundarySashes', reader => {
		const boundarySashes = this._boundarySashes.read(reader);
		if (boundarySashes) {
			result.setBoundarySashes(boundarySashes);
		}
	}));
	return result;
});
this._register(keepAlive(this._sash, true));

this._register(autorunWithStore2('UnchangedRangesFeature', (reader, store) => {
	this.unchangedRangesFeature = store.add(new (readHotReloadableExport(UnchangedRangesFeature, reader))(this._editors, this._diffModel, this._options));
}));

this._register(autorunWithStore2('DiffEditorDecorations', (reader, store) => {
	store.add(new (readHotReloadableExport(DiffEditorDecorations, reader))(this._editors, this._diffModel, this._options));
}));
this._register(autorunWithStore2('ViewZoneManager', (reader, store) => {
	store.add(this._instantiationService.createInstance(
		readHotReloadableExport(ViewZoneManager, reader),
		this._editors,
		this._diffModel,
		this._options,
		this,
		() => this.unchangedRangesFeature.isUpdatingViewZones,
	));
}));

this._register(autorunWithStore2('OverviewRulerPart', (reader, store) => {
	store.add(this._instantiationService.createInstance(readHotReloadableExport(OverviewRulerPart, reader), this._editors,
		this.elements.root,
		this._diffModel,
		this._rootSizeObserver.width,
		this._rootSizeObserver.height,
		this._layoutInfo.map(i => i.modifiedEditor),
		this._options,
	));
}));

this._register(autorunWithStore2('_accessibleDiffViewer', (reader, store) => {
	this._accessibleDiffViewer = store.add(this._register(this._instantiationService.createInstance(
		readHotReloadableExport(AccessibleDiffViewer, reader),
		this.elements.accessibleDiffViewer,
		this._accessibleDiffViewerVisible,
		this._rootSizeObserver.width,
		this._rootSizeObserver.height,
		this._diffModel.map((m, r) => m?.diff.read(r)?.mappings.map(m => m.lineRangeMapping)),
		this._editors,
	)));
}));
const visibility = this._accessibleDiffViewerVisible.map<CSSStyle['visibility']>(v => v ? 'hidden' : 'visible');
this._register(applyStyle(this.elements.modified, { visibility }));
this._register(applyStyle(this.elements.original, { visibility }));

this._createDiffEditorContributions();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/noise-1/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/noise-1/advanced.expected.diff.json

```json
{
	"original": {
		"content": "this._sash = derivedWithStore('sash', (reader, store) => {\n\tconst showSash = this._options.renderSideBySide.read(reader);\n\tthis.elements.root.classList.toggle('side-by-side', showSash);\n\tif (!showSash) { return undefined; }\n\tconst result = store.add(new DiffEditorSash(\n\t\tthis._options,\n\t\tthis.elements.root,\n\t\t{\n\t\t\theight: this._rootSizeObserver.height,\n\t\t\twidth: this._rootSizeObserver.width.map((w, reader) => w - (this._options.renderOverviewRuler.read(reader) ? OverviewRulerPart.ENTIRE_DIFF_OVERVIEW_WIDTH : 0)),\n\t\t}\n\t));\n\tstore.add(autorun('setBoundarySashes', reader => {\n\t\tconst boundarySashes = this._boundarySashes.read(reader);\n\t\tif (boundarySashes) {\n\t\t\tresult.setBoundarySashes(boundarySashes);\n\t\t}\n\t}));\n\treturn result;\n});\nthis._register(keepAlive(this._sash, true));\n\nthis._register(autorunWithStore2('UnchangedRangesFeature', (reader, store) => {\n\tthis.unchangedRangesFeature = store.add(new (readHotReloadableExport(UnchangedRangesFeature, reader))(this._editors, this._diffModel, this._options));\n}));\n\nthis._register(autorunWithStore2('DiffEditorDecorations', (reader, store) => {\n\tstore.add(new (readHotReloadableExport(DiffEditorDecorations, reader))(this._editors, this._diffModel, this._options));\n}));\nthis._register(autorunWithStore2('ViewZoneManager', (reader, store) => {\n\tstore.add(this._instantiationService.createInstance(\n\t\treadHotReloadableExport(ViewZoneManager, reader),\n\t\tthis._editors,\n\t\tthis._diffModel,\n\t\tthis._options,\n\t\tthis,\n\t\t() => this.unchangedRangesFeature.isUpdatingViewZones,\n\t));\n}));\n\nthis._register(autorunWithStore2('OverviewRulerPart', (reader, store) => {\n\tstore.add(this._instantiationService.createInstance(readHotReloadableExport(OverviewRulerPart, reader), this._editors,\n\t\tthis.elements.root,\n\t\tthis._diffModel,\n\t\tthis._rootSizeObserver.width,\n\t\tthis._rootSizeObserver.height,\n\t\tthis._layoutInfo.map(i => i.modifiedEditor),\n\t\tthis._options,\n\t));\n}));\n\nthis._reviewPane = this._register(this._instantiationService.createInstance(DiffReview2, this));\nthis.elements.root.appendChild(this._reviewPane.domNode.domNode);\nthis.elements.root.appendChild(this._reviewPane.actionBarContainer.domNode);\nreviewPaneObservable.set(this._reviewPane, undefined);\n\nthis._createDiffEditorContributions();\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "this._sash = derivedWithStore('sash', (reader, store) => {\n\tconst showSash = this._options.renderSideBySide.read(reader);\n\tthis.elements.root.classList.toggle('side-by-side', showSash);\n\tif (!showSash) { return undefined; }\n\tconst result = store.add(new DiffEditorSash(\n\t\tthis._options,\n\t\tthis.elements.root,\n\t\t{\n\t\t\theight: this._rootSizeObserver.height,\n\t\t\twidth: this._rootSizeObserver.width.map((w, reader) => w - (this._options.renderOverviewRuler.read(reader) ? OverviewRulerPart.ENTIRE_DIFF_OVERVIEW_WIDTH : 0)),\n\t\t}\n\t));\n\tstore.add(autorun('setBoundarySashes', reader => {\n\t\tconst boundarySashes = this._boundarySashes.read(reader);\n\t\tif (boundarySashes) {\n\t\t\tresult.setBoundarySashes(boundarySashes);\n\t\t}\n\t}));\n\treturn result;\n});\nthis._register(keepAlive(this._sash, true));\n\nthis._register(autorunWithStore2('UnchangedRangesFeature', (reader, store) => {\n\tthis.unchangedRangesFeature = store.add(new (readHotReloadableExport(UnchangedRangesFeature, reader))(this._editors, this._diffModel, this._options));\n}));\n\nthis._register(autorunWithStore2('DiffEditorDecorations', (reader, store) => {\n\tstore.add(new (readHotReloadableExport(DiffEditorDecorations, reader))(this._editors, this._diffModel, this._options));\n}));\nthis._register(autorunWithStore2('ViewZoneManager', (reader, store) => {\n\tstore.add(this._instantiationService.createInstance(\n\t\treadHotReloadableExport(ViewZoneManager, reader),\n\t\tthis._editors,\n\t\tthis._diffModel,\n\t\tthis._options,\n\t\tthis,\n\t\t() => this.unchangedRangesFeature.isUpdatingViewZones,\n\t));\n}));\n\nthis._register(autorunWithStore2('OverviewRulerPart', (reader, store) => {\n\tstore.add(this._instantiationService.createInstance(readHotReloadableExport(OverviewRulerPart, reader), this._editors,\n\t\tthis.elements.root,\n\t\tthis._diffModel,\n\t\tthis._rootSizeObserver.width,\n\t\tthis._rootSizeObserver.height,\n\t\tthis._layoutInfo.map(i => i.modifiedEditor),\n\t\tthis._options,\n\t));\n}));\n\nthis._register(autorunWithStore2('_accessibleDiffViewer', (reader, store) => {\n\tthis._accessibleDiffViewer = store.add(this._register(this._instantiationService.createInstance(\n\t\treadHotReloadableExport(AccessibleDiffViewer, reader),\n\t\tthis.elements.accessibleDiffViewer,\n\t\tthis._accessibleDiffViewerVisible,\n\t\tthis._rootSizeObserver.width,\n\t\tthis._rootSizeObserver.height,\n\t\tthis._diffModel.map((m, r) => m?.diff.read(r)?.mappings.map(m => m.lineRangeMapping)),\n\t\tthis._editors,\n\t)));\n}));\nconst visibility = this._accessibleDiffViewerVisible.map<CSSStyle['visibility']>(v => v ? 'hidden' : 'visible');\nthis._register(applyStyle(this.elements.modified, { visibility }));\nthis._register(applyStyle(this.elements.original, { visibility }));\n\nthis._createDiffEditorContributions();\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[52,56)",
			"modifiedRange": "[52,66)",
			"innerChanges": [
				{
					"originalRange": "[52,7 -> 52,20]",
					"modifiedRange": "[52,7 -> 53,41]"
				},
				{
					"originalRange": "[52,77 -> 56,1 EOL]",
					"modifiedRange": "[53,98 -> 66,1 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/noise-1/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/noise-1/legacy.expected.diff.json

```json
{
	"original": {
		"content": "this._sash = derivedWithStore('sash', (reader, store) => {\n\tconst showSash = this._options.renderSideBySide.read(reader);\n\tthis.elements.root.classList.toggle('side-by-side', showSash);\n\tif (!showSash) { return undefined; }\n\tconst result = store.add(new DiffEditorSash(\n\t\tthis._options,\n\t\tthis.elements.root,\n\t\t{\n\t\t\theight: this._rootSizeObserver.height,\n\t\t\twidth: this._rootSizeObserver.width.map((w, reader) => w - (this._options.renderOverviewRuler.read(reader) ? OverviewRulerPart.ENTIRE_DIFF_OVERVIEW_WIDTH : 0)),\n\t\t}\n\t));\n\tstore.add(autorun('setBoundarySashes', reader => {\n\t\tconst boundarySashes = this._boundarySashes.read(reader);\n\t\tif (boundarySashes) {\n\t\t\tresult.setBoundarySashes(boundarySashes);\n\t\t}\n\t}));\n\treturn result;\n});\nthis._register(keepAlive(this._sash, true));\n\nthis._register(autorunWithStore2('UnchangedRangesFeature', (reader, store) => {\n\tthis.unchangedRangesFeature = store.add(new (readHotReloadableExport(UnchangedRangesFeature, reader))(this._editors, this._diffModel, this._options));\n}));\n\nthis._register(autorunWithStore2('DiffEditorDecorations', (reader, store) => {\n\tstore.add(new (readHotReloadableExport(DiffEditorDecorations, reader))(this._editors, this._diffModel, this._options));\n}));\nthis._register(autorunWithStore2('ViewZoneManager', (reader, store) => {\n\tstore.add(this._instantiationService.createInstance(\n\t\treadHotReloadableExport(ViewZoneManager, reader),\n\t\tthis._editors,\n\t\tthis._diffModel,\n\t\tthis._options,\n\t\tthis,\n\t\t() => this.unchangedRangesFeature.isUpdatingViewZones,\n\t));\n}));\n\nthis._register(autorunWithStore2('OverviewRulerPart', (reader, store) => {\n\tstore.add(this._instantiationService.createInstance(readHotReloadableExport(OverviewRulerPart, reader), this._editors,\n\t\tthis.elements.root,\n\t\tthis._diffModel,\n\t\tthis._rootSizeObserver.width,\n\t\tthis._rootSizeObserver.height,\n\t\tthis._layoutInfo.map(i => i.modifiedEditor),\n\t\tthis._options,\n\t));\n}));\n\nthis._reviewPane = this._register(this._instantiationService.createInstance(DiffReview2, this));\nthis.elements.root.appendChild(this._reviewPane.domNode.domNode);\nthis.elements.root.appendChild(this._reviewPane.actionBarContainer.domNode);\nreviewPaneObservable.set(this._reviewPane, undefined);\n\nthis._createDiffEditorContributions();\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "this._sash = derivedWithStore('sash', (reader, store) => {\n\tconst showSash = this._options.renderSideBySide.read(reader);\n\tthis.elements.root.classList.toggle('side-by-side', showSash);\n\tif (!showSash) { return undefined; }\n\tconst result = store.add(new DiffEditorSash(\n\t\tthis._options,\n\t\tthis.elements.root,\n\t\t{\n\t\t\theight: this._rootSizeObserver.height,\n\t\t\twidth: this._rootSizeObserver.width.map((w, reader) => w - (this._options.renderOverviewRuler.read(reader) ? OverviewRulerPart.ENTIRE_DIFF_OVERVIEW_WIDTH : 0)),\n\t\t}\n\t));\n\tstore.add(autorun('setBoundarySashes', reader => {\n\t\tconst boundarySashes = this._boundarySashes.read(reader);\n\t\tif (boundarySashes) {\n\t\t\tresult.setBoundarySashes(boundarySashes);\n\t\t}\n\t}));\n\treturn result;\n});\nthis._register(keepAlive(this._sash, true));\n\nthis._register(autorunWithStore2('UnchangedRangesFeature', (reader, store) => {\n\tthis.unchangedRangesFeature = store.add(new (readHotReloadableExport(UnchangedRangesFeature, reader))(this._editors, this._diffModel, this._options));\n}));\n\nthis._register(autorunWithStore2('DiffEditorDecorations', (reader, store) => {\n\tstore.add(new (readHotReloadableExport(DiffEditorDecorations, reader))(this._editors, this._diffModel, this._options));\n}));\nthis._register(autorunWithStore2('ViewZoneManager', (reader, store) => {\n\tstore.add(this._instantiationService.createInstance(\n\t\treadHotReloadableExport(ViewZoneManager, reader),\n\t\tthis._editors,\n\t\tthis._diffModel,\n\t\tthis._options,\n\t\tthis,\n\t\t() => this.unchangedRangesFeature.isUpdatingViewZones,\n\t));\n}));\n\nthis._register(autorunWithStore2('OverviewRulerPart', (reader, store) => {\n\tstore.add(this._instantiationService.createInstance(readHotReloadableExport(OverviewRulerPart, reader), this._editors,\n\t\tthis.elements.root,\n\t\tthis._diffModel,\n\t\tthis._rootSizeObserver.width,\n\t\tthis._rootSizeObserver.height,\n\t\tthis._layoutInfo.map(i => i.modifiedEditor),\n\t\tthis._options,\n\t));\n}));\n\nthis._register(autorunWithStore2('_accessibleDiffViewer', (reader, store) => {\n\tthis._accessibleDiffViewer = store.add(this._register(this._instantiationService.createInstance(\n\t\treadHotReloadableExport(AccessibleDiffViewer, reader),\n\t\tthis.elements.accessibleDiffViewer,\n\t\tthis._accessibleDiffViewerVisible,\n\t\tthis._rootSizeObserver.width,\n\t\tthis._rootSizeObserver.height,\n\t\tthis._diffModel.map((m, r) => m?.diff.read(r)?.mappings.map(m => m.lineRangeMapping)),\n\t\tthis._editors,\n\t)));\n}));\nconst visibility = this._accessibleDiffViewerVisible.map<CSSStyle['visibility']>(v => v ? 'hidden' : 'visible');\nthis._register(applyStyle(this.elements.modified, { visibility }));\nthis._register(applyStyle(this.elements.original, { visibility }));\n\nthis._createDiffEditorContributions();\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[52,56)",
			"modifiedRange": "[52,66)",
			"innerChanges": [
				{
					"originalRange": "[52,9 -> 52,20]",
					"modifiedRange": "[52,9 -> 53,41]"
				},
				{
					"originalRange": "[52,77 -> 52,77]",
					"modifiedRange": "[53,98 -> 54,37]"
				},
				{
					"originalRange": "[52,81 -> 52,84]",
					"modifiedRange": "[54,41 -> 54,42]"
				},
				{
					"originalRange": "[52,87 -> 53,1]",
					"modifiedRange": "[54,45 -> 55,3]"
				},
				{
					"originalRange": "[53,15 -> 53,32]",
					"modifiedRange": "[55,17 -> 56,3]"
				},
				{
					"originalRange": "[53,38 -> 53,41]",
					"modifiedRange": "[56,9 -> 56,24]"
				},
				{
					"originalRange": "[53,44 -> 54,1]",
					"modifiedRange": "[56,27 -> 59,3]"
				},
				{
					"originalRange": "[54,6 -> 54,20]",
					"modifiedRange": "[59,8 -> 59,80]"
				},
				{
					"originalRange": "[54,23 -> 54,32]",
					"modifiedRange": "[59,83 -> 63,20]"
				},
				{
					"originalRange": "[54,38 -> 54,41]",
					"modifiedRange": "[63,26 -> 63,41]"
				},
				{
					"originalRange": "[54,44 -> 54,75]",
					"modifiedRange": "[63,44 -> 63,111]"
				},
				{
					"originalRange": "[55,1 -> 55,26]",
					"modifiedRange": "[64,1 -> 65,1]"
				},
				{
					"originalRange": "[55,34 -> 55,53]",
					"modifiedRange": "[65,9 -> 65,66]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/noise-2/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/noise-2/1.tst

```text

const maxPersistedSessions = 25;

export class ChatService extends Disposable implements IChatService {

	private async _sendRequestAsync(model: ChatModel, provider: IChatProvider, message: string | IChatReplyFollowup, usedSlashCommand?: ISlashCommand): Promise<void> {
		const request = model.addRequest(message);

		const resolvedCommand = typeof message === 'string' && message.startsWith('/') ? await this.handleSlashCommand(model.sessionId, message) : message;

		let gotProgress = false;
		const requestType = typeof message === 'string' ?
			(message.startsWith('/') ? 'slashCommand' : 'string') :
			'followup';

		const rawResponsePromise = createCancelablePromise<void>(async token => {
			const progressCallback = (progress: IChatProgress) => {
				if (token.isCancellationRequested) {
					return;
				}

				gotProgress = true;
				if ('content' in progress) {
					this.trace('sendRequest', `Provider returned progress for session ${model.sessionId}, ${progress.content.length} chars`);
				} else {
					this.trace('sendRequest', `Provider returned id for session ${model.sessionId}, ${progress.requestId}`);
				}

				model.acceptResponseProgress(request, progress);
			};

			const stopWatch = new StopWatch(false);
			token.onCancellationRequested(() => {
				this.trace('sendRequest', `Request for session ${model.sessionId} was cancelled`);
				this.telemetryService.publicLog2<ChatProviderInvokedEvent, ChatProviderInvokedClassification>('interactiveSessionProviderInvoked', {
					providerId: provider.id,
					timeToFirstProgress: -1,
					// Normally timings happen inside the EH around the actual provider. For cancellation we can measure how long the user waited before cancelling
					totalTime: stopWatch.elapsed(),
					result: 'cancelled',
					requestType,
					slashCommand: usedSlashCommand?.command
				});

				model.cancelRequest(request);
			});
			if (usedSlashCommand?.command) {
				this._onDidSubmitSlashCommand.fire({ slashCommand: usedSlashCommand.command, sessionId: model.sessionId });
			}
			let rawResponse = await provider.provideReply({ session: model.session!, message: resolvedCommand }, progressCallback, token);
			if (token.isCancellationRequested) {
				return;
			} else {
				if (!rawResponse) {
					this.trace('sendRequest', `Provider returned no response for session ${model.sessionId}`);
					rawResponse = { session: model.session!, errorDetails: { message: localize('emptyResponse', "Provider returned null response") } };
				}

				const result = rawResponse.errorDetails?.responseIsFiltered ? 'filtered' :
					rawResponse.errorDetails && gotProgress ? 'errorWithOutput' :
						rawResponse.errorDetails ? 'error' :
							'success';
				this.telemetryService.publicLog2<ChatProviderInvokedEvent, ChatProviderInvokedClassification>('interactiveSessionProviderInvoked', {
					providerId: provider.id,
					timeToFirstProgress: rawResponse.timings?.firstProgress ?? 0,
					totalTime: rawResponse.timings?.totalElapsed ?? 0,
					result,
					requestType,
					slashCommand: usedSlashCommand?.command
				});
				model.setResponse(request, rawResponse);
				this.trace('sendRequest', `Provider returned response for session ${model.sessionId}`);

				// TODO refactor this or rethink the API https://github.com/microsoft/vscode-copilot/issues/593
				if (provider.provideFollowups) {
					Promise.resolve(provider.provideFollowups(model.session!, CancellationToken.None)).then(followups => {
						model.setFollowups(request, withNullAsUndefined(followups));
						model.completeResponse(request);
					});
				} else {
					model.completeResponse(request);
				}
			}
		});
		this._pendingRequests.set(model.sessionId, rawResponsePromise);
		rawResponsePromise.finally(() => {
			this._pendingRequests.delete(model.sessionId);
		});
		return rawResponsePromise;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/noise-2/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/noise-2/2.tst

```text

const maxPersistedSessions = 25;

export class ChatService extends Disposable implements IChatService {

	private async _sendRequestAsync(model: ChatModel, provider: IChatProvider, message: string | IChatReplyFollowup, usedSlashCommand?: ISlashCommand): Promise<void> {
		const request = model.addRequest(message);

		const resolvedCommand = typeof message === 'string' && message.startsWith('/') ? await this.handleSlashCommand(model.sessionId, message) : message;

		let gotProgress = false;
		const requestType = typeof message === 'string' ?
			(message.startsWith('/') ? 'slashCommand' : 'string') :
			'followup';

		const rawResponsePromise = createCancelablePromise<void>(async token => {
			const progressCallback = (progress: IChatProgress) => {
				if (token.isCancellationRequested) {
					return;
				}

				gotProgress = true;
				if ('content' in progress) {
					this.trace('sendRequest', `Provider returned progress for session ${model.sessionId}, ${progress.content.length} chars`);
				} else {
					this.trace('sendRequest', `Provider returned id for session ${model.sessionId}, ${progress.requestId}`);
				}

				model.acceptResponseProgress(request, progress);
			};

			const stopWatch = new StopWatch(false);
			token.onCancellationRequested(() => {
				this.trace('sendRequest', `Request for session ${model.sessionId} was cancelled`);
				this.telemetryService.publicLog2<ChatProviderInvokedEvent, ChatProviderInvokedClassification>('interactiveSessionProviderInvoked', {
					providerId: provider.id,
					timeToFirstProgress: -1,
					// Normally timings happen inside the EH around the actual provider. For cancellation we can measure how long the user waited before cancelling
					totalTime: stopWatch.elapsed(),
					result: 'cancelled',
					requestType,
					slashCommand: usedSlashCommand?.command
				});

				model.cancelRequest(request);
			});
			if (usedSlashCommand?.command) {
				this._onDidSubmitSlashCommand.fire({ slashCommand: usedSlashCommand.command, sessionId: model.sessionId });
			}

			let rawResponse: IChatResponse | null | undefined;

			if ((typeof resolvedCommand === 'string' && typeof message === 'string' && this.chatSlashCommandService.hasCommand(resolvedCommand))) {
				// contributed slash commands
				// TODO: spell this out in the UI
				const history: IChatMessage[] = [];
				for (const request of model.getRequests()) {
					if (typeof request.message !== 'string' || !request.response) {
						continue;
					}
					history.push({ role: ChatMessageRole.User, content: request.message });
					history.push({ role: ChatMessageRole.Assistant, content: request.response?.response.value });
				}
				await this.chatSlashCommandService.executeCommand(resolvedCommand, message.substring(resolvedCommand.length + 1).trimStart(), new Progress<IChatSlashFragment>(p => progressCallback(p)), history, token);
				rawResponse = { session: model.session! };

			} else {
				rawResponse = await provider.provideReply({ session: model.session!, message: resolvedCommand }, progressCallback, token);
			}

			if (token.isCancellationRequested) {
				return;
			} else {
				if (!rawResponse) {
					this.trace('sendRequest', `Provider returned no response for session ${model.sessionId}`);
					rawResponse = { session: model.session!, errorDetails: { message: localize('emptyResponse', "Provider returned null response") } };
				}

				const result = rawResponse.errorDetails?.responseIsFiltered ? 'filtered' :
					rawResponse.errorDetails && gotProgress ? 'errorWithOutput' :
						rawResponse.errorDetails ? 'error' :
							'success';
				this.telemetryService.publicLog2<ChatProviderInvokedEvent, ChatProviderInvokedClassification>('interactiveSessionProviderInvoked', {
					providerId: provider.id,
					timeToFirstProgress: rawResponse.timings?.firstProgress ?? 0,
					totalTime: rawResponse.timings?.totalElapsed ?? 0,
					result,
					requestType,
					slashCommand: usedSlashCommand?.command
				});
				model.setResponse(request, rawResponse);
				this.trace('sendRequest', `Provider returned response for session ${model.sessionId}`);

				// TODO refactor this or rethink the API https://github.com/microsoft/vscode-copilot/issues/593
				if (provider.provideFollowups) {
					Promise.resolve(provider.provideFollowups(model.session!, CancellationToken.None)).then(followups => {
						model.setFollowups(request, withNullAsUndefined(followups));
						model.completeResponse(request);
					});
				} else {
					model.completeResponse(request);
				}
			}
		});
		this._pendingRequests.set(model.sessionId, rawResponsePromise);
		rawResponsePromise.finally(() => {
			this._pendingRequests.delete(model.sessionId);
		});
		return rawResponsePromise;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/noise-2/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/noise-2/advanced.expected.diff.json

```json
{
	"original": {
		"content": "\nconst maxPersistedSessions = 25;\n\nexport class ChatService extends Disposable implements IChatService {\n\n\tprivate async _sendRequestAsync(model: ChatModel, provider: IChatProvider, message: string | IChatReplyFollowup, usedSlashCommand?: ISlashCommand): Promise<void> {\n\t\tconst request = model.addRequest(message);\n\n\t\tconst resolvedCommand = typeof message === 'string' && message.startsWith('/') ? await this.handleSlashCommand(model.sessionId, message) : message;\n\n\t\tlet gotProgress = false;\n\t\tconst requestType = typeof message === 'string' ?\n\t\t\t(message.startsWith('/') ? 'slashCommand' : 'string') :\n\t\t\t'followup';\n\n\t\tconst rawResponsePromise = createCancelablePromise<void>(async token => {\n\t\t\tconst progressCallback = (progress: IChatProgress) => {\n\t\t\t\tif (token.isCancellationRequested) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tgotProgress = true;\n\t\t\t\tif ('content' in progress) {\n\t\t\t\t\tthis.trace('sendRequest', `Provider returned progress for session ${model.sessionId}, ${progress.content.length} chars`);\n\t\t\t\t} else {\n\t\t\t\t\tthis.trace('sendRequest', `Provider returned id for session ${model.sessionId}, ${progress.requestId}`);\n\t\t\t\t}\n\n\t\t\t\tmodel.acceptResponseProgress(request, progress);\n\t\t\t};\n\n\t\t\tconst stopWatch = new StopWatch(false);\n\t\t\ttoken.onCancellationRequested(() => {\n\t\t\t\tthis.trace('sendRequest', `Request for session ${model.sessionId} was cancelled`);\n\t\t\t\tthis.telemetryService.publicLog2<ChatProviderInvokedEvent, ChatProviderInvokedClassification>('interactiveSessionProviderInvoked', {\n\t\t\t\t\tproviderId: provider.id,\n\t\t\t\t\ttimeToFirstProgress: -1,\n\t\t\t\t\t// Normally timings happen inside the EH around the actual provider. For cancellation we can measure how long the user waited before cancelling\n\t\t\t\t\ttotalTime: stopWatch.elapsed(),\n\t\t\t\t\tresult: 'cancelled',\n\t\t\t\t\trequestType,\n\t\t\t\t\tslashCommand: usedSlashCommand?.command\n\t\t\t\t});\n\n\t\t\t\tmodel.cancelRequest(request);\n\t\t\t});\n\t\t\tif (usedSlashCommand?.command) {\n\t\t\t\tthis._onDidSubmitSlashCommand.fire({ slashCommand: usedSlashCommand.command, sessionId: model.sessionId });\n\t\t\t}\n\t\t\tlet rawResponse = await provider.provideReply({ session: model.session!, message: resolvedCommand }, progressCallback, token);\n\t\t\tif (token.isCancellationRequested) {\n\t\t\t\treturn;\n\t\t\t} else {\n\t\t\t\tif (!rawResponse) {\n\t\t\t\t\tthis.trace('sendRequest', `Provider returned no response for session ${model.sessionId}`);\n\t\t\t\t\trawResponse = { session: model.session!, errorDetails: { message: localize('emptyResponse', \"Provider returned null response\") } };\n\t\t\t\t}\n\n\t\t\t\tconst result = rawResponse.errorDetails?.responseIsFiltered ? 'filtered' :\n\t\t\t\t\trawResponse.errorDetails && gotProgress ? 'errorWithOutput' :\n\t\t\t\t\t\trawResponse.errorDetails ? 'error' :\n\t\t\t\t\t\t\t'success';\n\t\t\t\tthis.telemetryService.publicLog2<ChatProviderInvokedEvent, ChatProviderInvokedClassification>('interactiveSessionProviderInvoked', {\n\t\t\t\t\tproviderId: provider.id,\n\t\t\t\t\ttimeToFirstProgress: rawResponse.timings?.firstProgress ?? 0,\n\t\t\t\t\ttotalTime: rawResponse.timings?.totalElapsed ?? 0,\n\t\t\t\t\tresult,\n\t\t\t\t\trequestType,\n\t\t\t\t\tslashCommand: usedSlashCommand?.command\n\t\t\t\t});\n\t\t\t\tmodel.setResponse(request, rawResponse);\n\t\t\t\tthis.trace('sendRequest', `Provider returned response for session ${model.sessionId}`);\n\n\t\t\t\t// TODO refactor this or rethink the API https://github.com/microsoft/vscode-copilot/issues/593\n\t\t\t\tif (provider.provideFollowups) {\n\t\t\t\t\tPromise.resolve(provider.provideFollowups(model.session!, CancellationToken.None)).then(followups => {\n\t\t\t\t\t\tmodel.setFollowups(request, withNullAsUndefined(followups));\n\t\t\t\t\t\tmodel.completeResponse(request);\n\t\t\t\t\t});\n\t\t\t\t} else {\n\t\t\t\t\tmodel.completeResponse(request);\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\t\tthis._pendingRequests.set(model.sessionId, rawResponsePromise);\n\t\trawResponsePromise.finally(() => {\n\t\t\tthis._pendingRequests.delete(model.sessionId);\n\t\t});\n\t\treturn rawResponsePromise;\n\t}\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "\nconst maxPersistedSessions = 25;\n\nexport class ChatService extends Disposable implements IChatService {\n\n\tprivate async _sendRequestAsync(model: ChatModel, provider: IChatProvider, message: string | IChatReplyFollowup, usedSlashCommand?: ISlashCommand): Promise<void> {\n\t\tconst request = model.addRequest(message);\n\n\t\tconst resolvedCommand = typeof message === 'string' && message.startsWith('/') ? await this.handleSlashCommand(model.sessionId, message) : message;\n\n\t\tlet gotProgress = false;\n\t\tconst requestType = typeof message === 'string' ?\n\t\t\t(message.startsWith('/') ? 'slashCommand' : 'string') :\n\t\t\t'followup';\n\n\t\tconst rawResponsePromise = createCancelablePromise<void>(async token => {\n\t\t\tconst progressCallback = (progress: IChatProgress) => {\n\t\t\t\tif (token.isCancellationRequested) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tgotProgress = true;\n\t\t\t\tif ('content' in progress) {\n\t\t\t\t\tthis.trace('sendRequest', `Provider returned progress for session ${model.sessionId}, ${progress.content.length} chars`);\n\t\t\t\t} else {\n\t\t\t\t\tthis.trace('sendRequest', `Provider returned id for session ${model.sessionId}, ${progress.requestId}`);\n\t\t\t\t}\n\n\t\t\t\tmodel.acceptResponseProgress(request, progress);\n\t\t\t};\n\n\t\t\tconst stopWatch = new StopWatch(false);\n\t\t\ttoken.onCancellationRequested(() => {\n\t\t\t\tthis.trace('sendRequest', `Request for session ${model.sessionId} was cancelled`);\n\t\t\t\tthis.telemetryService.publicLog2<ChatProviderInvokedEvent, ChatProviderInvokedClassification>('interactiveSessionProviderInvoked', {\n\t\t\t\t\tproviderId: provider.id,\n\t\t\t\t\ttimeToFirstProgress: -1,\n\t\t\t\t\t// Normally timings happen inside the EH around the actual provider. For cancellation we can measure how long the user waited before cancelling\n\t\t\t\t\ttotalTime: stopWatch.elapsed(),\n\t\t\t\t\tresult: 'cancelled',\n\t\t\t\t\trequestType,\n\t\t\t\t\tslashCommand: usedSlashCommand?.command\n\t\t\t\t});\n\n\t\t\t\tmodel.cancelRequest(request);\n\t\t\t});\n\t\t\tif (usedSlashCommand?.command) {\n\t\t\t\tthis._onDidSubmitSlashCommand.fire({ slashCommand: usedSlashCommand.command, sessionId: model.sessionId });\n\t\t\t}\n\n\t\t\tlet rawResponse: IChatResponse | null | undefined;\n\n\t\t\tif ((typeof resolvedCommand === 'string' && typeof message === 'string' && this.chatSlashCommandService.hasCommand(resolvedCommand))) {\n\t\t\t\t// contributed slash commands\n\t\t\t\t// TODO: spell this out in the UI\n\t\t\t\tconst history: IChatMessage[] = [];\n\t\t\t\tfor (const request of model.getRequests()) {\n\t\t\t\t\tif (typeof request.message !== 'string' || !request.response) {\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\t}\n\t\t\t\t\thistory.push({ role: ChatMessageRole.User, content: request.message });\n\t\t\t\t\thistory.push({ role: ChatMessageRole.Assistant, content: request.response?.response.value });\n\t\t\t\t}\n\t\t\t\tawait this.chatSlashCommandService.executeCommand(resolvedCommand, message.substring(resolvedCommand.length + 1).trimStart(), new Progress<IChatSlashFragment>(p => progressCallback(p)), history, token);\n\t\t\t\trawResponse = { session: model.session! };\n\n\t\t\t} else {\n\t\t\t\trawResponse = await provider.provideReply({ session: model.session!, message: resolvedCommand }, progressCallback, token);\n\t\t\t}\n\n\t\t\tif (token.isCancellationRequested) {\n\t\t\t\treturn;\n\t\t\t} else {\n\t\t\t\tif (!rawResponse) {\n\t\t\t\t\tthis.trace('sendRequest', `Provider returned no response for session ${model.sessionId}`);\n\t\t\t\t\trawResponse = { session: model.session!, errorDetails: { message: localize('emptyResponse', \"Provider returned null response\") } };\n\t\t\t\t}\n\n\t\t\t\tconst result = rawResponse.errorDetails?.responseIsFiltered ? 'filtered' :\n\t\t\t\t\trawResponse.errorDetails && gotProgress ? 'errorWithOutput' :\n\t\t\t\t\t\trawResponse.errorDetails ? 'error' :\n\t\t\t\t\t\t\t'success';\n\t\t\t\tthis.telemetryService.publicLog2<ChatProviderInvokedEvent, ChatProviderInvokedClassification>('interactiveSessionProviderInvoked', {\n\t\t\t\t\tproviderId: provider.id,\n\t\t\t\t\ttimeToFirstProgress: rawResponse.timings?.firstProgress ?? 0,\n\t\t\t\t\ttotalTime: rawResponse.timings?.totalElapsed ?? 0,\n\t\t\t\t\tresult,\n\t\t\t\t\trequestType,\n\t\t\t\t\tslashCommand: usedSlashCommand?.command\n\t\t\t\t});\n\t\t\t\tmodel.setResponse(request, rawResponse);\n\t\t\t\tthis.trace('sendRequest', `Provider returned response for session ${model.sessionId}`);\n\n\t\t\t\t// TODO refactor this or rethink the API https://github.com/microsoft/vscode-copilot/issues/593\n\t\t\t\tif (provider.provideFollowups) {\n\t\t\t\t\tPromise.resolve(provider.provideFollowups(model.session!, CancellationToken.None)).then(followups => {\n\t\t\t\t\t\tmodel.setFollowups(request, withNullAsUndefined(followups));\n\t\t\t\t\t\tmodel.completeResponse(request);\n\t\t\t\t\t});\n\t\t\t\t} else {\n\t\t\t\t\tmodel.completeResponse(request);\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\t\tthis._pendingRequests.set(model.sessionId, rawResponsePromise);\n\t\trawResponsePromise.finally(() => {\n\t\t\tthis._pendingRequests.delete(model.sessionId);\n\t\t});\n\t\treturn rawResponsePromise;\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[50,51)",
			"modifiedRange": "[50,71)",
			"innerChanges": [
				{
					"originalRange": "[50,1 -> 50,1]",
					"modifiedRange": "[50,1 -> 51,1]"
				},
				{
					"originalRange": "[50,19 -> 50,21]",
					"modifiedRange": "[51,19 -> 68,18]"
				},
				{
					"originalRange": "[51,1 -> 51,1]",
					"modifiedRange": "[69,1 -> 71,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/noise-2/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/noise-2/legacy.expected.diff.json

```json
{
	"original": {
		"content": "\nconst maxPersistedSessions = 25;\n\nexport class ChatService extends Disposable implements IChatService {\n\n\tprivate async _sendRequestAsync(model: ChatModel, provider: IChatProvider, message: string | IChatReplyFollowup, usedSlashCommand?: ISlashCommand): Promise<void> {\n\t\tconst request = model.addRequest(message);\n\n\t\tconst resolvedCommand = typeof message === 'string' && message.startsWith('/') ? await this.handleSlashCommand(model.sessionId, message) : message;\n\n\t\tlet gotProgress = false;\n\t\tconst requestType = typeof message === 'string' ?\n\t\t\t(message.startsWith('/') ? 'slashCommand' : 'string') :\n\t\t\t'followup';\n\n\t\tconst rawResponsePromise = createCancelablePromise<void>(async token => {\n\t\t\tconst progressCallback = (progress: IChatProgress) => {\n\t\t\t\tif (token.isCancellationRequested) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tgotProgress = true;\n\t\t\t\tif ('content' in progress) {\n\t\t\t\t\tthis.trace('sendRequest', `Provider returned progress for session ${model.sessionId}, ${progress.content.length} chars`);\n\t\t\t\t} else {\n\t\t\t\t\tthis.trace('sendRequest', `Provider returned id for session ${model.sessionId}, ${progress.requestId}`);\n\t\t\t\t}\n\n\t\t\t\tmodel.acceptResponseProgress(request, progress);\n\t\t\t};\n\n\t\t\tconst stopWatch = new StopWatch(false);\n\t\t\ttoken.onCancellationRequested(() => {\n\t\t\t\tthis.trace('sendRequest', `Request for session ${model.sessionId} was cancelled`);\n\t\t\t\tthis.telemetryService.publicLog2<ChatProviderInvokedEvent, ChatProviderInvokedClassification>('interactiveSessionProviderInvoked', {\n\t\t\t\t\tproviderId: provider.id,\n\t\t\t\t\ttimeToFirstProgress: -1,\n\t\t\t\t\t// Normally timings happen inside the EH around the actual provider. For cancellation we can measure how long the user waited before cancelling\n\t\t\t\t\ttotalTime: stopWatch.elapsed(),\n\t\t\t\t\tresult: 'cancelled',\n\t\t\t\t\trequestType,\n\t\t\t\t\tslashCommand: usedSlashCommand?.command\n\t\t\t\t});\n\n\t\t\t\tmodel.cancelRequest(request);\n\t\t\t});\n\t\t\tif (usedSlashCommand?.command) {\n\t\t\t\tthis._onDidSubmitSlashCommand.fire({ slashCommand: usedSlashCommand.command, sessionId: model.sessionId });\n\t\t\t}\n\t\t\tlet rawResponse = await provider.provideReply({ session: model.session!, message: resolvedCommand }, progressCallback, token);\n\t\t\tif (token.isCancellationRequested) {\n\t\t\t\treturn;\n\t\t\t} else {\n\t\t\t\tif (!rawResponse) {\n\t\t\t\t\tthis.trace('sendRequest', `Provider returned no response for session ${model.sessionId}`);\n\t\t\t\t\trawResponse = { session: model.session!, errorDetails: { message: localize('emptyResponse', \"Provider returned null response\") } };\n\t\t\t\t}\n\n\t\t\t\tconst result = rawResponse.errorDetails?.responseIsFiltered ? 'filtered' :\n\t\t\t\t\trawResponse.errorDetails && gotProgress ? 'errorWithOutput' :\n\t\t\t\t\t\trawResponse.errorDetails ? 'error' :\n\t\t\t\t\t\t\t'success';\n\t\t\t\tthis.telemetryService.publicLog2<ChatProviderInvokedEvent, ChatProviderInvokedClassification>('interactiveSessionProviderInvoked', {\n\t\t\t\t\tproviderId: provider.id,\n\t\t\t\t\ttimeToFirstProgress: rawResponse.timings?.firstProgress ?? 0,\n\t\t\t\t\ttotalTime: rawResponse.timings?.totalElapsed ?? 0,\n\t\t\t\t\tresult,\n\t\t\t\t\trequestType,\n\t\t\t\t\tslashCommand: usedSlashCommand?.command\n\t\t\t\t});\n\t\t\t\tmodel.setResponse(request, rawResponse);\n\t\t\t\tthis.trace('sendRequest', `Provider returned response for session ${model.sessionId}`);\n\n\t\t\t\t// TODO refactor this or rethink the API https://github.com/microsoft/vscode-copilot/issues/593\n\t\t\t\tif (provider.provideFollowups) {\n\t\t\t\t\tPromise.resolve(provider.provideFollowups(model.session!, CancellationToken.None)).then(followups => {\n\t\t\t\t\t\tmodel.setFollowups(request, withNullAsUndefined(followups));\n\t\t\t\t\t\tmodel.completeResponse(request);\n\t\t\t\t\t});\n\t\t\t\t} else {\n\t\t\t\t\tmodel.completeResponse(request);\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\t\tthis._pendingRequests.set(model.sessionId, rawResponsePromise);\n\t\trawResponsePromise.finally(() => {\n\t\t\tthis._pendingRequests.delete(model.sessionId);\n\t\t});\n\t\treturn rawResponsePromise;\n\t}\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "\nconst maxPersistedSessions = 25;\n\nexport class ChatService extends Disposable implements IChatService {\n\n\tprivate async _sendRequestAsync(model: ChatModel, provider: IChatProvider, message: string | IChatReplyFollowup, usedSlashCommand?: ISlashCommand): Promise<void> {\n\t\tconst request = model.addRequest(message);\n\n\t\tconst resolvedCommand = typeof message === 'string' && message.startsWith('/') ? await this.handleSlashCommand(model.sessionId, message) : message;\n\n\t\tlet gotProgress = false;\n\t\tconst requestType = typeof message === 'string' ?\n\t\t\t(message.startsWith('/') ? 'slashCommand' : 'string') :\n\t\t\t'followup';\n\n\t\tconst rawResponsePromise = createCancelablePromise<void>(async token => {\n\t\t\tconst progressCallback = (progress: IChatProgress) => {\n\t\t\t\tif (token.isCancellationRequested) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tgotProgress = true;\n\t\t\t\tif ('content' in progress) {\n\t\t\t\t\tthis.trace('sendRequest', `Provider returned progress for session ${model.sessionId}, ${progress.content.length} chars`);\n\t\t\t\t} else {\n\t\t\t\t\tthis.trace('sendRequest', `Provider returned id for session ${model.sessionId}, ${progress.requestId}`);\n\t\t\t\t}\n\n\t\t\t\tmodel.acceptResponseProgress(request, progress);\n\t\t\t};\n\n\t\t\tconst stopWatch = new StopWatch(false);\n\t\t\ttoken.onCancellationRequested(() => {\n\t\t\t\tthis.trace('sendRequest', `Request for session ${model.sessionId} was cancelled`);\n\t\t\t\tthis.telemetryService.publicLog2<ChatProviderInvokedEvent, ChatProviderInvokedClassification>('interactiveSessionProviderInvoked', {\n\t\t\t\t\tproviderId: provider.id,\n\t\t\t\t\ttimeToFirstProgress: -1,\n\t\t\t\t\t// Normally timings happen inside the EH around the actual provider. For cancellation we can measure how long the user waited before cancelling\n\t\t\t\t\ttotalTime: stopWatch.elapsed(),\n\t\t\t\t\tresult: 'cancelled',\n\t\t\t\t\trequestType,\n\t\t\t\t\tslashCommand: usedSlashCommand?.command\n\t\t\t\t});\n\n\t\t\t\tmodel.cancelRequest(request);\n\t\t\t});\n\t\t\tif (usedSlashCommand?.command) {\n\t\t\t\tthis._onDidSubmitSlashCommand.fire({ slashCommand: usedSlashCommand.command, sessionId: model.sessionId });\n\t\t\t}\n\n\t\t\tlet rawResponse: IChatResponse | null | undefined;\n\n\t\t\tif ((typeof resolvedCommand === 'string' && typeof message === 'string' && this.chatSlashCommandService.hasCommand(resolvedCommand))) {\n\t\t\t\t// contributed slash commands\n\t\t\t\t// TODO: spell this out in the UI\n\t\t\t\tconst history: IChatMessage[] = [];\n\t\t\t\tfor (const request of model.getRequests()) {\n\t\t\t\t\tif (typeof request.message !== 'string' || !request.response) {\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\t}\n\t\t\t\t\thistory.push({ role: ChatMessageRole.User, content: request.message });\n\t\t\t\t\thistory.push({ role: ChatMessageRole.Assistant, content: request.response?.response.value });\n\t\t\t\t}\n\t\t\t\tawait this.chatSlashCommandService.executeCommand(resolvedCommand, message.substring(resolvedCommand.length + 1).trimStart(), new Progress<IChatSlashFragment>(p => progressCallback(p)), history, token);\n\t\t\t\trawResponse = { session: model.session! };\n\n\t\t\t} else {\n\t\t\t\trawResponse = await provider.provideReply({ session: model.session!, message: resolvedCommand }, progressCallback, token);\n\t\t\t}\n\n\t\t\tif (token.isCancellationRequested) {\n\t\t\t\treturn;\n\t\t\t} else {\n\t\t\t\tif (!rawResponse) {\n\t\t\t\t\tthis.trace('sendRequest', `Provider returned no response for session ${model.sessionId}`);\n\t\t\t\t\trawResponse = { session: model.session!, errorDetails: { message: localize('emptyResponse', \"Provider returned null response\") } };\n\t\t\t\t}\n\n\t\t\t\tconst result = rawResponse.errorDetails?.responseIsFiltered ? 'filtered' :\n\t\t\t\t\trawResponse.errorDetails && gotProgress ? 'errorWithOutput' :\n\t\t\t\t\t\trawResponse.errorDetails ? 'error' :\n\t\t\t\t\t\t\t'success';\n\t\t\t\tthis.telemetryService.publicLog2<ChatProviderInvokedEvent, ChatProviderInvokedClassification>('interactiveSessionProviderInvoked', {\n\t\t\t\t\tproviderId: provider.id,\n\t\t\t\t\ttimeToFirstProgress: rawResponse.timings?.firstProgress ?? 0,\n\t\t\t\t\ttotalTime: rawResponse.timings?.totalElapsed ?? 0,\n\t\t\t\t\tresult,\n\t\t\t\t\trequestType,\n\t\t\t\t\tslashCommand: usedSlashCommand?.command\n\t\t\t\t});\n\t\t\t\tmodel.setResponse(request, rawResponse);\n\t\t\t\tthis.trace('sendRequest', `Provider returned response for session ${model.sessionId}`);\n\n\t\t\t\t// TODO refactor this or rethink the API https://github.com/microsoft/vscode-copilot/issues/593\n\t\t\t\tif (provider.provideFollowups) {\n\t\t\t\t\tPromise.resolve(provider.provideFollowups(model.session!, CancellationToken.None)).then(followups => {\n\t\t\t\t\t\tmodel.setFollowups(request, withNullAsUndefined(followups));\n\t\t\t\t\t\tmodel.completeResponse(request);\n\t\t\t\t\t});\n\t\t\t\t} else {\n\t\t\t\t\tmodel.completeResponse(request);\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\t\tthis._pendingRequests.set(model.sessionId, rawResponsePromise);\n\t\trawResponsePromise.finally(() => {\n\t\t\tthis._pendingRequests.delete(model.sessionId);\n\t\t});\n\t\treturn rawResponsePromise;\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[50,51)",
			"modifiedRange": "[50,71)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/noisy-move1/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/noisy-move1/1.tst

```text
	contextKeyService.onDidChangeContext(this.onDidChangeContext, this, this.disposables);
		this.disposables.add(Event.filter(viewsRegistry.onDidChangeViewWelcomeContent, id => id === this.id)(this.onDidChangeViewWelcomeContent, this, this.disposables));
		this.onDidChangeViewWelcomeContent();
	}

	private onDidChangeViewWelcomeContent(): void {
		const descriptors = viewsRegistry.getViewWelcomeContent(this.id);

		this.items = [];

		for (const descriptor of descriptors) {
			if (descriptor.when === 'default') {
				this.defaultItem = { descriptor, visible: true };
			} else {
				const visible = descriptor.when ? this.contextKeyService.contextMatchesRules(descriptor.when) : true;
				this.items.push({ descriptor, visible });
			}
		}

		this._onDidChange.fire();
	}

	private onDidChangeContext(): void {
		let didChange = false;

		for (const item of this.items) {
			if (!item.descriptor.when || item.descriptor.when === 'default') {
				continue;
			}

			const visible = this.contextKeyService.contextMatchesRules(item.descriptor.when);

			if (item.visible === visible) {
				continue;
			}

			item.visible = visible;
			didChange = true;
		}

		if (didChange) {
			this._onDidChange.fire();
		}
	}

	dispose(): void {
		this.disposables.dispose();
	}
}

export abstract class ViewPane extends Pane implements IView {

	private static readonly AlwaysShowActionsConfig = 'workbench.view.alwaysShowHeaderActions';

	private _onDidFocus = this._register(new Emitter<void>());
	readonly onDidFocus: Event<void> = this._onDidFocus.event;

	private _onDidBlur = this._register(new Emitter<void>());
	readonly onDidBlur: Event<void> = this._onDidBlur.event;

	private _onDidChangeBodyVisibility = this._register(new Emitter<boolean>());
	readonly onDidChangeBodyVisibility: Event<boolean> = this._onDidChangeBodyVisibility.event;

	protected _onDidChangeTitleArea = this._register(new Emitter<void>());
	readonly onDidChangeTitleArea: Event<void> = this._onDidChangeTitleArea.event;

	protected _onDidChangeViewWelcomeState = this._register(new Emitter<void>());
	readonly onDidChangeViewWelcomeState: Event<void> = this._onDidChangeViewWelcomeState.event;

	private _isVisible: boolean = false;
	readonly id: string;

	private _title: string;
	public get title(): string {
		return this._title;
	}

	private _titleDescription: string | undefined;
	public get titleDescription(): string | undefined {
		return this._titleDescription;
	}

	readonly menuActions: CompositeMenuActions;

	private progressBar!: ProgressBar;
	private progressIndicator!: IProgressIndicator;

	private toolbar?: WorkbenchToolBar;
	private readonly showActions: ViewPaneShowActions;
	private headerContainer?: HTMLElement;
	private titleContainer?: HTMLElement;
	private titleDescriptionContainer?: HTMLElement;
	private iconContainer?: HTMLElement;
	protected twistiesContainer?: HTMLElement;

	private bodyContainer!: HTMLElement;
	private viewWelcomeContainer!: HTMLElement;
	private viewWelcomeDisposable: IDisposable = Disposable.None;
	private viewWelcomeController: ViewWelcomeController;

	protected readonly scopedContextKeyService: IContextKeyService;

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService protected keybindingService: IKeybindingService,
		@IContextMenuService protected contextMenuService: IContextMenuService,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
		@IContextKeyService protected contextKeyService: IContextKeyService,
		@IViewDescriptorService protected viewDescriptorService: IViewDescriptorService,
		@IInstantiationService protected instantiationService: IInstantiationService,
		@IOpenerService protected openerService: IOpenerService,
		@IThemeService protected themeService: IThemeService,
		@ITelemetryService protected telemetryService: ITelemetryService,
	) {
		super({ ...options, ...{ orientation: viewDescriptorService.getViewLocationById(options.id) === ViewContainerLocation.Panel ? Orientation.HORIZONTAL : Orientation.VERTICAL } });

		this.id = options.id;
		this._title = options.title;
		this._titleDescription = options.titleDescription;
		this.showActions = options.showActions ?? ViewPaneShowActions.Default;

		this.scopedContextKeyService = this._register(contextKeyService.createScoped(this.element));
		this.scopedContextKeyService.createKey('view', this.id);
		const viewLocationKey = this.scopedContextKeyService.createKey('viewLocation', ViewContainerLocationToString(viewDescriptorService.getViewLocationById(this.id)!));
		this._register(Event.filter(viewDescriptorService.onDidChangeLocation, e => e.views.some(view => view.id === this.id))(() => viewLocationKey.set(ViewContainerLocationToString(viewDescriptorService.getViewLocationById(this.id)!))));

		this.menuActions = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService])).createInstance(CompositeMenuActions, options.titleMenuId ?? MenuId.ViewTitle, MenuId.ViewTitleContext, { shouldForwardArgs: !options.donotForwardArgs }));
		this._register(this.menuActions.onDidChange(() => this.updateActions()));

		this.viewWelcomeController = this._register(new ViewWelcomeController(this.id, contextKeyService));
	}

	override get headerVisible(): boolean {
		return super.headerVisible;
	}

	override set headerVisible(visible: boolean) {
		super.headerVisible = visible;
		this.element.classList.toggle('merged-header', !visible);
	}

	setVisible(visible: boolean): void {
		if (this._isVisible !== visible) {
			this._isVisible = visible;

			if (this.isExpanded()) {
				this._onDidChangeBodyVisibility.fire(visible);
			}
		}
	}

	isVisible(): boolean {
		return this._isVisible;
	}

	isBodyVisible(): boolean {
		return this._isVisible && this.isExpanded();
	}

	override setExpanded(expanded: boolean): boolean {
		const changed = super.setExpanded(expanded);
		if (changed) {
			this._onDidChangeBodyVisibility.fire(expanded);
		}
		if (this.twistiesContainer) {
			this.twistiesContainer.classList.remove(...ThemeIcon.asClassNameArray(this.getTwistyIcon(!expanded)));
			this.twistiesContainer.classList.add(...ThemeIcon.asClassNameArray(this.getTwistyIcon(expanded)));
		}
		return changed;
	}

	override render(): void {
		super.render();

		const focusTracker = trackFocus(this.element);
		this._register(focusTracker);
		this._register(focusTracker.onDidFocus(() => this._onDidFocus.fire()));
		this._register(focusTracker.onDidBlur(() => this._onDidBlur.fire()));
	}

	protected renderHeader(container: HTMLElement): void {
		this.headerContainer = container;

		this.twistiesContainer = append(container, $(ThemeIcon.asCSSSelector(this.getTwistyIcon(this.isExpanded()))));

		this.renderHeaderTitle(container, this.title);

		const actions = append(container, $('.actions'));
		actions.classList.toggle('show-always', this.showActions === ViewPaneShowActions.Always);
		actions.classList.toggle('show-expanded', this.showActions === ViewPaneShowActions.WhenExpanded);
		this.toolbar = this.instantiationService.createInstance(WorkbenchToolBar, actions, {
			orientation: ActionsOrientation.HORIZONTAL,
			actionViewItemProvider: action => this.getActionViewItem(action),
			ariaLabel: nls.localize('viewToolbarAriaLabel', "{0} actions", this.title),
			getKeyBinding: action => this.keybindingService.lookupKeybinding(action.id),
			renderDropdownAsChildElement: true,
			actionRunner: this.getActionRunner(),
			resetMenu: this.menuActions.menuId
		});

		this._register(this.toolbar);
		this.setActions();

		this._register(addDisposableListener(actions, EventType.CLICK, e => e.preventDefault()));

		const viewContainerModel = this.viewDescriptorService.getViewContainerByViewId(this.id);
		if (viewContainerModel) {
			this._register(this.viewDescriptorService.getViewContainerModel(viewContainerModel).onDidChangeContainerInfo(({ title }) => this.updateTitle(this.title)));
		} else {
			console.error(`View container model not found for view ${this.id}`);
		}

		const onDidRelevantConfigurationChange = Event.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration(ViewPane.AlwaysShowActionsConfig));
		this._register(onDidRelevantConfigurationChange(this.updateActionsVisibility, this));
		this.updateActionsVisibility();
	}

	protected getTwistyIcon(expanded: boolean): ThemeIcon {
		return expanded ? viewPaneContainerExpandedIcon : viewPaneContainerCollapsedIcon;
	}

	override style(styles: IPaneStyles): void {
		super.style(styles);

		const icon = this.getIcon();
		if (this.iconContainer) {
			const fgColor = asCssValueWithDefault(styles.headerForeground, asCssVariable(foreground));
			if (URI.isUri(icon)) {
				// Apply background color to activity bar item provided with iconUrls
				this.iconContainer.style.backgroundColor = fgColor;
				this.iconContainer.style.color = '';
			} else {
				// Apply foreground color to activity bar items provided with codicons
				this.iconContainer.style.color = fgColor;
				this.iconContainer.style.backgroundColor = '';
			}
		}
	}

	private getIcon(): ThemeIcon | URI {
		return this.viewDescriptorService.getViewDescriptorById(this.id)?.containerIcon || defaultViewIcon;
	}

	protected renderHeaderTitle(container: HTMLElement, title: string): void {
		this.iconContainer = append(container, $('.icon', undefined));
		const icon = this.getIcon();

		let cssClass: string | undefined = undefined;
		if (URI.isUri(icon)) {
			cssClass = `view-${this.id.replace(/[\.\:]/g, '-')}`;
			const iconClass = `.pane-header .icon.${cssClass}`;

			createCSSRule(iconClass, `
				mask: ${asCSSUrl(icon)} no-repeat 50% 50%;
				mask-size: 24px;
				-webkit-mask: ${asCSSUrl(icon)} no-repeat 50% 50%;
				-webkit-mask-size: 16px;
			`);
		} else if (ThemeIcon.isThemeIcon(icon)) {
			cssClass = ThemeIcon.asClassName(icon);
		}

		if (cssClass) {
			this.iconContainer.classList.add(...cssClass.split(' '));
		}

		const calculatedTitle = this.calculateTitle(title);
		this.titleContainer = append(container, $('h3.title', { title: calculatedTitle }, calculatedTitle));

		if (this._titleDescription) {
			this.setTitleDescription(this._titleDescription);
		}

		this.iconContainer.title = calculatedTitle;
		this.iconContainer.setAttribute('aria-label', calculatedTitle);
	}

	protected updateTitle(title: string): void {
		const calculatedTitle = this.calculateTitle(title);
		if (this.titleContainer) {
			this.titleContainer.textContent = calculatedTitle;
			this.titleContainer.setAttribute('title', calculatedTitle);
		}

		if (this.iconContainer) {
			this.iconContainer.title = calculatedTitle;
			this.iconContainer.setAttribute('aria-label', calculatedTitle);
		}

		this._title = title;
		this._onDidChangeTitleArea.fire();
	}

	private setTitleDescription(description: string | undefined) {
		if (this.titleDescriptionContainer) {
			this.titleDescriptionContainer.textContent = description ?? '';
			this.titleDescriptionContainer.setAttribute('title', description ?? '');
		}
		else if (description && this.titleContainer) {
			this.titleDescriptionContainer = after(this.titleContainer, $('span.description', { title: description }, description));
		}
	}

	protected updateTitleDescription(description?: string | undefined): void {
		this.setTitleDescription(description);

		this._titleDescription = description;
		this._onDidChangeTitleArea.fire();
	}

	private calculateTitle(title: string): string {
		const viewContainer = this.viewDescriptorService.getViewContainerByViewId(this.id)!;
		const model = this.viewDescriptorService.getViewContainerModel(viewContainer);
		const viewDescriptor = this.viewDescriptorService.getViewDescriptorById(this.id);
		const isDefault = this.viewDescriptorService.getDefaultContainerById(this.id) === viewContainer;

		if (!isDefault && viewDescriptor?.containerTitle && model.title !== viewDescriptor.containerTitle) {
			return `${viewDescriptor.containerTitle}: ${title}`;
		}

		return title;
	}

	private scrollableElement!: DomScrollableElement;

	protected renderBody(container: HTMLElement): void {
		this.bodyContainer = container;

		const viewWelcomeContainer = append(container, $('.welcome-view'));
		this.viewWelcomeContainer = $('.welcome-view-content', { tabIndex: 0 });
		this.scrollableElement = this._register(new DomScrollableElement(this.viewWelcomeContainer, {
			alwaysConsumeMouseWheel: true,
			horizontal: ScrollbarVisibility.Hidden,
			vertical: ScrollbarVisibility.Visible,
		}));

		append(viewWelcomeContainer, this.scrollableElement.getDomNode());

		const onViewWelcomeChange = Event.any(this.viewWelcomeController.onDidChange, this.onDidChangeViewWelcomeState);
		this._register(onViewWelcomeChange(this.updateViewWelcome, this));
		this.updateViewWelcome();
	}

	protected layoutBody(height: number, width: number): void {
		if (this.shouldShowWelcome()) {
			this.viewWelcomeContainer.style.height = `${height}px`;
			this.viewWelcomeContainer.style.width = `${width}px`;
			this.viewWelcomeContainer.classList.toggle('wide', width > 640);
			this.scrollableElement.scanDomNode();
		}
	}

	onDidScrollRoot() {
		// noop
	}

	getProgressIndicator() {
		if (this.progressBar === undefined) {
			// Progress bar
			this.progressBar = this._register(new ProgressBar(this.element, defaultProgressBarStyles));
			this.progressBar.hide();
		}

		if (this.progressIndicator === undefined) {
			const that = this;
			this.progressIndicator = new ScopedProgressIndicator(assertIsDefined(this.progressBar), new class extends AbstractProgressScope {
				constructor() {
					super(that.id, that.isBodyVisible());
					this._register(that.onDidChangeBodyVisibility(isVisible => isVisible ? this.onScopeOpened(that.id) : this.onScopeClosed(that.id)));
				}
			}());
		}
		return this.progressIndicator;
	}

	protected getProgressLocation(): string {
		return this.viewDescriptorService.getViewContainerByViewId(this.id)!.id;
	}

	protected getBackgroundColor(): string {
		switch (this.viewDescriptorService.getViewLocationById(this.id)) {
			case ViewContainerLocation.Panel:
				return PANEL_BACKGROUND;
			case ViewContainerLocation.Sidebar:
			case ViewContainerLocation.AuxiliaryBar:
				return SIDE_BAR_BACKGROUND;
		}

		return SIDE_BAR_BACKGROUND;
	}

	focus(): void {
		if (this.shouldShowWelcome()) {
			this.viewWelcomeContainer.focus();
		} else if (this.element) {
			this.element.focus();
			this._onDidFocus.fire();
		}
	}

	private setActions(): void {
		if (this.toolbar) {
			const primaryActions = [...this.menuActions.getPrimaryActions()];
			if (this.shouldShowFilterInHeader()) {
				primaryActions.unshift(VIEWPANE_FILTER_ACTION);
			}
			this.toolbar.setActions(prepareActions(primaryActions), prepareActions(this.menuActions.getSecondaryActions()));
			this.toolbar.context = this.getActionsContext();
		}
	}

	private updateActionsVisibility(): void {
		if (!this.headerContainer) {
			return;
		}
		const shouldAlwaysShowActions = this.configurationService.getValue<boolean>('workbench.view.alwaysShowHeaderActions');
		this.headerContainer.classList.toggle('actions-always-visible', shouldAlwaysShowActions);
	}

	protected updateActions(): void {
		this.setActions();
		this._onDidChangeTitleArea.fire();
	}

	getActionViewItem(action: IAction, options?: IDropdownMenuActionViewItemOptions): IActionViewItem | undefined {
		if (action.id === VIEWPANE_FILTER_ACTION.id) {
			const that = this;
			return new class extends BaseActionViewItem {
				constructor() { super(null, action); }
				override setFocusable(): void { /* noop input elements are focusable by default */ }
				override get trapsArrowNavigation(): boolean { return true; }
				override render(container: HTMLElement): void {
					container.classList.add('viewpane-filter-container');
					append(container, that.getFilterWidget()!.element);
				}
			};
		}
		return createActionViewItem(this.instantiationService, action, { ...options, ...{ menuAsChild: action instanceof SubmenuItemAction } });
	}

	getActionsContext(): unknown {
		return undefined;
	}

	getActionRunner(): IActionRunner | undefined {
		return undefined;
	}

	getOptimalWidth(): number {
		return 0;
	}

	saveState(): void {
		// Subclasses to implement for saving state
	}

	private updateViewWelcome(): void {
		this.viewWelcomeDisposable.dispose();

		if (!this.shouldShowWelcome()) {
			this.bodyContainer.classList.remove('welcome');
			this.viewWelcomeContainer.innerText = '';
			this.scrollableElement.scanDomNode();
			return;
		}

		const contents = this.viewWelcomeController.contents;

		if (contents.length === 0) {
			this.bodyContainer.classList.remove('welcome');
			this.viewWelcomeContainer.innerText = '';
			this.scrollableElement.scanDomNode();
			return;
		}

		const disposables = new DisposableStore();
		this.bodyContainer.classList.add('welcome');
		this.viewWelcomeContainer.innerText = '';

		for (const { content, precondition } of contents) {
			const lines = content.split('\n');

			for (let line of lines) {
				line = line.trim();

				if (!line) {
					continue;
				}

				const linkedText = parseLinkedText(line);

				if (linkedText.nodes.length === 1 && typeof linkedText.nodes[0] !== 'string') {
					const node = linkedText.nodes[0];
					const buttonContainer = append(this.viewWelcomeContainer, $('.button-container'));
					const button = new Button(buttonContainer, { title: node.title, supportIcons: true, ...defaultButtonStyles });
					button.label = node.label;
					button.onDidClick(_ => {
						this.telemetryService.publicLog2<{ viewId: string; uri: string }, WelcomeActionClassification>('views.welcomeAction', { viewId: this.id, uri: node.href });
						this.openerService.open(node.href, { allowCommands: true });
					}, null, disposables);
					disposables.add(button);

					if (precondition) {
						const updateEnablement = () => button.enabled = this.contextKeyService.contextMatchesRules(precondition);
						updateEnablement();

						const keys = new Set();
						precondition.keys().forEach(key => keys.add(key));
						const onDidChangeContext = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(keys));
						onDidChangeContext(updateEnablement, null, disposables);
					}
				} else {
					const p = append(this.viewWelcomeContainer, $('p'));

					for (const node of linkedText.nodes) {
						if (typeof node === 'string') {
							append(p, document.createTextNode(node));
						} else {
							const link = disposables.add(this.instantiationService.createInstance(Link, p, node, {}));

							if (precondition && node.href.startsWith('command:')) {
								const updateEnablement = () => link.enabled = this.contextKeyService.contextMatchesRules(precondition);
								updateEnablement();

								const keys = new Set();
								precondition.keys().forEach(key => keys.add(key));
								const onDidChangeContext = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(keys));
								onDidChangeContext(updateEnablement, null, disposables);
							}
						}
					}
				}
			}
		}

		this.scrollableElement.scanDomNode();
		this.viewWelcomeDisposable = disposables;
	}

	shouldShowWelcome(): boolean {
		return false;
	}

	getFilterWidget()
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/noisy-move1/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/noisy-move1/2.tst

```text

	layout(height: number, width: number) {
		if (!this.enabled) {
			return;
		}

		this.element!.style.height = `${height}px`;
		this.element!.style.width = `${width}px`;
		this.element!.classList.toggle('wide', width > 640);
		this.scrollableElement!.scanDomNode();
	}

	focus() {
		if (!this.enabled) {
			return;
		}

		this.element!.focus();
	}

	private onDidChangeViewWelcomeState(): void {
		const enabled = this.delegate.shouldShowWelcome();

		if (this.enabled === enabled) {
			return;
		}

		this.enabled = enabled;

		if (!enabled) {
			this.enabledDisposables.clear();
			return;
		}

		this.container.classList.add('welcome');
		const viewWelcomeContainer = append(this.container, $('.welcome-view'));
		this.element = $('.welcome-view-content', { tabIndex: 0 });
		this.scrollableElement = new DomScrollableElement(this.element, { alwaysConsumeMouseWheel: true, horizontal: ScrollbarVisibility.Hidden, vertical: ScrollbarVisibility.Visible, });
		append(viewWelcomeContainer, this.scrollableElement.getDomNode());

		this.enabledDisposables.add(toDisposable(() => {
			this.container.classList.remove('welcome');
			this.scrollableElement!.dispose();
			viewWelcomeContainer.remove();
			this.scrollableElement = undefined;
			this.element = undefined;
		}));

		this.contextKeyService.onDidChangeContext(this.onDidChangeContext, this, this.enabledDisposables);
		Event.chain(viewsRegistry.onDidChangeViewWelcomeContent, $ => $.filter(id => id === this.delegate.id))
			(this.onDidChangeViewWelcomeContent, this, this.enabledDisposables);
		this.onDidChangeViewWelcomeContent();
	}

	private onDidChangeViewWelcomeContent(): void {
		const descriptors = viewsRegistry.getViewWelcomeContent(this.delegate.id);

		this.items = [];

		for (const descriptor of descriptors) {
			if (descriptor.when === 'default') {
				this.defaultItem = { descriptor, visible: true };
			} else {
				const visible = descriptor.when ? this.contextKeyService.contextMatchesRules(descriptor.when) : true;
				this.items.push({ descriptor, visible });
			}
		}

		this.render();
	}

	private onDidChangeContext(): void {
		let didChange = false;

		for (const item of this.items) {
			if (!item.descriptor.when || item.descriptor.when === 'default') {
				continue;
			}

			const visible = this.contextKeyService.contextMatchesRules(item.descriptor.when);

			if (item.visible === visible) {
				continue;
			}

			item.visible = visible;
			didChange = true;
		}

		if (didChange) {
			this.render();
		}
	}

	private render(): void {
		this.renderDisposables.clear();

		const contents = this.getContentDescriptors();

		if (contents.length === 0) {
			this.container.classList.remove('welcome');
			this.element!.innerText = '';
			this.scrollableElement!.scanDomNode();
			return;
		}

		this.container.classList.add('welcome');
		this.element!.innerText = '';

		for (const { content, precondition } of contents) {
			const lines = content.split('\n');

			for (let line of lines) {
				line = line.trim();

				if (!line) {
					continue;
				}

				const linkedText = parseLinkedText(line);

				if (linkedText.nodes.length === 1 && typeof linkedText.nodes[0] !== 'string') {
					const node = linkedText.nodes[0];
					const buttonContainer = append(this.element!, $('.button-container'));
					const button = new Button(buttonContainer, { title: node.title, supportIcons: true, ...defaultButtonStyles });
					button.label = node.label;
					button.onDidClick(_ => {
						this.telemetryService.publicLog2<{ viewId: string; uri: string }, WelcomeActionClassification>('views.welcomeAction', { viewId: this.delegate.id, uri: node.href });
						this.openerService.open(node.href, { allowCommands: true });
					}, null, this.renderDisposables);
					this.renderDisposables.add(button);

					if (precondition) {
						const updateEnablement = () => button.enabled = this.contextKeyService.contextMatchesRules(precondition);
						updateEnablement();

						const keys = new Set(precondition.keys());
						const onDidChangeContext = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(keys));
						onDidChangeContext(updateEnablement, null, this.renderDisposables);
					}
				} else {
					const p = append(this.element!, $('p'));

					for (const node of linkedText.nodes) {
						if (typeof node === 'string') {
							append(p, document.createTextNode(node));
						} else {
							const link = this.renderDisposables.add(this.instantiationService.createInstance(Link, p, node, {}));

							if (precondition && node.href.startsWith('command:')) {
								const updateEnablement = () => link.enabled = this.contextKeyService.contextMatchesRules(precondition);
								updateEnablement();

								const keys = new Set(precondition.keys());
								const onDidChangeContext = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(keys));
								onDidChangeContext(updateEnablement, null, this.renderDisposables);
							}
						}
					}
				}
			}
		}

		this.scrollableElement!.scanDomNode();
	}

	private getContentDescriptors(): IViewContentDescriptor[] {
		const visibleItems = this.items.filter(v => v.visible);

		if (visibleItems.length === 0 && this.defaultItem) {
			return [this.defaultItem.descriptor];
		}

		return visibleItems.map(v => v.descriptor);
	}

	dispose(): void {
		this.disposables.dispose();
	}
	}

	export abstract class ViewPane extends Pane implements IView {

	private static readonly AlwaysShowActionsConfig = 'workbench.view.alwaysShowHeaderActions';

	private _onDidFocus = this._register(new Emitter<void>());
	readonly onDidFocus: Event<void> = this._onDidFocus.event;

	private _onDidBlur = this._register(new Emitter<void>());
	readonly onDidBlur: Event<void> = this._onDidBlur.event;

	private _onDidChangeBodyVisibility = this._register(new Emitter<boolean>());
	readonly onDidChangeBodyVisibility: Event<boolean> = this._onDidChangeBodyVisibility.event;

	protected _onDidChangeTitleArea = this._register(new Emitter<void>());
	readonly onDidChangeTitleArea: Event<void> = this._onDidChangeTitleArea.event;

	protected _onDidChangeViewWelcomeState = this._register(new Emitter<void>());
	readonly onDidChangeViewWelcomeState: Event<void> = this._onDidChangeViewWelcomeState.event;

	private _isVisible: boolean = false;
	readonly id: string;

	private _title: string;
	public get title(): string {
		return this._title;
	}

	private _titleDescription: string | undefined;
	public get titleDescription(): string | undefined {
		return this._titleDescription;
	}

	readonly menuActions: CompositeMenuActions;

	private progressBar!: ProgressBar;
	private progressIndicator!: IProgressIndicator;

	private toolbar?: WorkbenchToolBar;
	private readonly showActions: ViewPaneShowActions;
	private headerContainer?: HTMLElement;
	private titleContainer?: HTMLElement;
	private titleDescriptionContainer?: HTMLElement;
	private iconContainer?: HTMLElement;
	protected twistiesContainer?: HTMLElement;
	private viewWelcomeController!: ViewWelcomeController;

	protected readonly scopedContextKeyService: IContextKeyService;

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService protected keybindingService: IKeybindingService,
		@IContextMenuService protected contextMenuService: IContextMenuService,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
		@IContextKeyService protected contextKeyService: IContextKeyService,
		@IViewDescriptorService protected viewDescriptorService: IViewDescriptorService,
		@IInstantiationService protected instantiationService: IInstantiationService,
		@IOpenerService protected openerService: IOpenerService,
		@IThemeService protected themeService: IThemeService,
		@ITelemetryService protected telemetryService: ITelemetryService,
	) {
		super({ ...options, ...{ orientation: viewDescriptorService.getViewLocationById(options.id) === ViewContainerLocation.Panel ? Orientation.HORIZONTAL : Orientation.VERTICAL } });

		this.id = options.id;
		this._title = options.title;
		this._titleDescription = options.titleDescription;
		this.showActions = options.showActions ?? ViewPaneShowActions.Default;

		this.scopedContextKeyService = this._register(contextKeyService.createScoped(this.element));
		this.scopedContextKeyService.createKey('view', this.id);
		const viewLocationKey = this.scopedContextKeyService.createKey('viewLocation', ViewContainerLocationToString(viewDescriptorService.getViewLocationById(this.id)!));
		this._register(Event.filter(viewDescriptorService.onDidChangeLocation, e => e.views.some(view => view.id === this.id))(() => viewLocationKey.set(ViewContainerLocationToString(viewDescriptorService.getViewLocationById(this.id)!))));

		this.menuActions = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService])).createInstance(CompositeMenuActions, options.titleMenuId ?? MenuId.ViewTitle, MenuId.ViewTitleContext, { shouldForwardArgs: !options.donotForwardArgs }));
		this._register(this.menuActions.onDidChange(() => this.updateActions()));
	}

	override get headerVisible(): boolean {
		return super.headerVisible;
	}

	override set headerVisible(visible: boolean) {
		super.headerVisible = visible;
		this.element.classList.toggle('merged-header', !visible);
	}

	setVisible(visible: boolean): void {
		if (this._isVisible !== visible) {
			this._isVisible = visible;

			if (this.isExpanded()) {
				this._onDidChangeBodyVisibility.fire(visible);
			}
		}
	}

	isVisible(): boolean {
		return this._isVisible;
	}

	isBodyVisible(): boolean {
		return this._isVisible && this.isExpanded();
	}

	override setExpanded(expanded: boolean): boolean {
		const changed = super.setExpanded(expanded);
		if (changed) {
			this._onDidChangeBodyVisibility.fire(expanded);
		}
		if (this.twistiesContainer) {
			this.twistiesContainer.classList.remove(...ThemeIcon.asClassNameArray(this.getTwistyIcon(!expanded)));
			this.twistiesContainer.classList.add(...ThemeIcon.asClassNameArray(this.getTwistyIcon(expanded)));
		}
		return changed;
	}

	override render(): void {
		super.render();

		const focusTracker = trackFocus(this.element);
		this._register(focusTracker);
		this._register(focusTracker.onDidFocus(() => this._onDidFocus.fire()));
		this._register(focusTracker.onDidBlur(() => this._onDidBlur.fire()));
	}

	protected renderHeader(container: HTMLElement): void {
		this.headerContainer = container;

		this.twistiesContainer = append(container, $(ThemeIcon.asCSSSelector(this.getTwistyIcon(this.isExpanded()))));

		this.renderHeaderTitle(container, this.title);

		const actions = append(container, $('.actions'));
		actions.classList.toggle('show-always', this.showActions === ViewPaneShowActions.Always);
		actions.classList.toggle('show-expanded', this.showActions === ViewPaneShowActions.WhenExpanded);
		this.toolbar = this.instantiationService.createInstance(WorkbenchToolBar, actions, {
			orientation: ActionsOrientation.HORIZONTAL,
			actionViewItemProvider: action => this.getActionViewItem(action),
			ariaLabel: nls.localize('viewToolbarAriaLabel', "{0} actions", this.title),
			getKeyBinding: action => this.keybindingService.lookupKeybinding(action.id),
			renderDropdownAsChildElement: true,
			actionRunner: this.getActionRunner(),
			resetMenu: this.menuActions.menuId
		});

		this._register(this.toolbar);
		this.setActions();

		this._register(addDisposableListener(actions, EventType.CLICK, e => e.preventDefault()));

		const viewContainerModel = this.viewDescriptorService.getViewContainerByViewId(this.id);
		if (viewContainerModel) {
			this._register(this.viewDescriptorService.getViewContainerModel(viewContainerModel).onDidChangeContainerInfo(({ title }) => this.updateTitle(this.title)));
		} else {
			console.error(`View container model not found for view ${this.id}`);
		}

		const onDidRelevantConfigurationChange = Event.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration(ViewPane.AlwaysShowActionsConfig));
		this._register(onDidRelevantConfigurationChange(this.updateActionsVisibility, this));
		this.updateActionsVisibility();
	}

	protected getTwistyIcon(expanded: boolean): ThemeIcon {
		return expanded ? viewPaneContainerExpandedIcon : viewPaneContainerCollapsedIcon;
	}

	override style(styles: IPaneStyles): void {
		super.style(styles);

		const icon = this.getIcon();
		if (this.iconContainer) {
			const fgColor = asCssValueWithDefault(styles.headerForeground, asCssVariable(foreground));
			if (URI.isUri(icon)) {
				// Apply background color to activity bar item provided with iconUrls
				this.iconContainer.style.backgroundColor = fgColor;
				this.iconContainer.style.color = '';
			} else {
				// Apply foreground color to activity bar items provided with codicons
				this.iconContainer.style.color = fgColor;
				this.iconContainer.style.backgroundColor = '';
			}
		}
	}

	private getIcon(): ThemeIcon | URI {
		return this.viewDescriptorService.getViewDescriptorById(this.id)?.containerIcon || defaultViewIcon;
	}

	protected renderHeaderTitle(container: HTMLElement, title: string): void {
		this.iconContainer = append(container, $('.icon', undefined));
		const icon = this.getIcon();

		let cssClass: string | undefined = undefined;
		if (URI.isUri(icon)) {
			cssClass = `view-${this.id.replace(/[\.\:]/g, '-')}`;
			const iconClass = `.pane-header .icon.${cssClass}`;

			createCSSRule(iconClass, `
				mask: ${asCSSUrl(icon)} no-repeat 50% 50%;
				mask-size: 24px;
				-webkit-mask: ${asCSSUrl(icon)} no-repeat 50% 50%;
				-webkit-mask-size: 16px;
			`);
		} else if (ThemeIcon.isThemeIcon(icon)) {
			cssClass = ThemeIcon.asClassName(icon);
		}

		if (cssClass) {
			this.iconContainer.classList.add(...cssClass.split(' '));
		}

		const calculatedTitle = this.calculateTitle(title);
		this.titleContainer = append(container, $('h3.title', { title: calculatedTitle }, calculatedTitle));

		if (this._titleDescription) {
			this.setTitleDescription(this._titleDescription);
		}

		this.iconContainer.title = calculatedTitle;
		this.iconContainer.setAttribute('aria-label', calculatedTitle);
	}

	protected updateTitle(title: string): void {
		const calculatedTitle = this.calculateTitle(title);
		if (this.titleContainer) {
			this.titleContainer.textContent = calculatedTitle;
			this.titleContainer.setAttribute('title', calculatedTitle);
		}

		if (this.iconContainer) {
			this.iconContainer.title = calculatedTitle;
			this.iconContainer.setAttribute('aria-label', calculatedTitle);
		}

		this._title = title;
		this._onDidChangeTitleArea.fire();
	}

	private setTitleDescription(description: string | undefined) {
		if (this.titleDescriptionContainer) {
			this.titleDescriptionContainer.textContent = description ?? '';
			this.titleDescriptionContainer.setAttribute('title', description ?? '');
		}
		else if (description && this.titleContainer) {
			this.titleDescriptionContainer = after(this.titleContainer, $('span.description', { title: description }, description));
		}
	}

	protected updateTitleDescription(description?: string | undefined): void {
		this.setTitleDescription(description);

		this._titleDescription = description;
		this._onDidChangeTitleArea.fire();
	}

	private calculateTitle(title: string): string {
		const viewContainer = this.viewDescriptorService.getViewContainerByViewId(this.id)!;
		const model = this.viewDescriptorService.getViewContainerModel(viewContainer);
		const viewDescriptor = this.viewDescriptorService.getViewDescriptorById(this.id);
		const isDefault = this.viewDescriptorService.getDefaultContainerById(this.id) === viewContainer;

		if (!isDefault && viewDescriptor?.containerTitle && model.title !== viewDescriptor.containerTitle) {
			return `${viewDescriptor.containerTitle}: ${title}`;
		}

		return title;
	}

	protected renderBody(container: HTMLElement): void {
		this.viewWelcomeController = this._register(new ViewWelcomeController(container, this, this.instantiationService, this.openerService, this.telemetryService, this.contextKeyService));
	}

	protected layoutBody(height: number, width: number): void {
		this.viewWelcomeController.layout(height, width);
	}

	onDidScrollRoot() {
		// noop
	}

	getProgressIndicator() {
		if (this.progressBar === undefined) {
			// Progress bar
			this.progressBar = this._register(new ProgressBar(this.element, defaultProgressBarStyles));
			this.progressBar.hide();
		}

		if (this.progressIndicator === undefined) {
			const that = this;
			this.progressIndicator = new ScopedProgressIndicator(assertIsDefined(this.progressBar), new class extends AbstractProgressScope {
				constructor() {
					super(that.id, that.isBodyVisible());
					this._register(that.onDidChangeBodyVisibility(isVisible => isVisible ? this.onScopeOpened(that.id) : this.onScopeClosed(that.id)));
				}
			}());
		}
		return this.progressIndicator;
	}

	protected getProgressLocation(): string {
		return this.viewDescriptorService.getViewContainerByViewId(this.id)!.id;
	}

	protected getBackgroundColor(): string {
		switch (this.viewDescriptorService.getViewLocationById(this.id)) {
			case ViewContainerLocation.Panel:
				return PANEL_BACKGROUND;
			case ViewContainerLocation.Sidebar:
			case ViewContainerLocation.AuxiliaryBar:
				return SIDE_BAR_BACKGROUND;
		}

		return SIDE_BAR_BACKGROUND;
	}

	focus(): void {
		if (this.shouldShowWelcome()) {
			this.viewWelcomeController.focus();
		} else if (this.element) {
			this.element.focus();
			this._onDidFocus.fire();
		}
	}

	private setActions(): void {
		if (this.toolbar) {
			const primaryActions = [...this.menuActions.getPrimaryActions()];
			if (this.shouldShowFilterInHeader()) {
				primaryActions.unshift(VIEWPANE_FILTER_ACTION);
			}
			this.toolbar.setActions(prepareActions(primaryActions), prepareActions(this.menuActions.getSecondaryActions()));
			this.toolbar.context = this.getActionsContext();
		}
	}

	private updateActionsVisibility(): void {
		if (!this.headerContainer) {
			return;
		}
		const shouldAlwaysShowActions = this.configurationService.getValue<boolean>('workbench.view.alwaysShowHeaderActions');
		this.headerContainer.classList.toggle('actions-always-visible', shouldAlwaysShowActions);
	}

	protected updateActions(): void {
		this.setActions();
		this._onDidChangeTitleArea.fire();
	}

	getActionViewItem(action: IAction, options?: IDropdownMenuActionViewItemOptions): IActionViewItem | undefined {
		if (action.id === VIEWPANE_FILTER_ACTION.id) {
			const that = this;
			return new class extends BaseActionViewItem {
				constructor() { super(null, action); }
				override setFocusable(): void { /* noop input elements are focusable by default */ }
				override get trapsArrowNavigation(): boolean { return true; }
				override render(container: HTMLElement): void {
					container.classList.add('viewpane-filter-container');
					append(container, that.getFilterWidget()!.element);
				}
			};
		}
		return createActionViewItem(this.instantiationService, action, { ...options, ...{ menuAsChild: action instanceof SubmenuItemAction } });
	}

	getActionsContext(): unknown {
		return undefined;
	}

	getActionRunner(): IActionRunner | undefined {
		return undefined;
	}

	getOptimalWidth(): number {
		return 0;
	}

	saveState(): void {
		// Subclasses to implement for saving state
	}

	shouldShowWelcome(): boolean {
		return false;
	}

	getFilterWidget()
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/noisy-move1/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/noisy-move1/advanced.expected.diff.json

```json
{
	"original": {
		"content": "\tcontextKeyService.onDidChangeContext(this.onDidChangeContext, this, this.disposables);\n\t\tthis.disposables.add(Event.filter(viewsRegistry.onDidChangeViewWelcomeContent, id => id === this.id)(this.onDidChangeViewWelcomeContent, this, this.disposables));\n\t\tthis.onDidChangeViewWelcomeContent();\n\t}\n\n\tprivate onDidChangeViewWelcomeContent(): void {\n\t\tconst descriptors = viewsRegistry.getViewWelcomeContent(this.id);\n\n\t\tthis.items = [];\n\n\t\tfor (const descriptor of descriptors) {\n\t\t\tif (descriptor.when === 'default') {\n\t\t\t\tthis.defaultItem = { descriptor, visible: true };\n\t\t\t} else {\n\t\t\t\tconst visible = descriptor.when ? this.contextKeyService.contextMatchesRules(descriptor.when) : true;\n\t\t\t\tthis.items.push({ descriptor, visible });\n\t\t\t}\n\t\t}\n\n\t\tthis._onDidChange.fire();\n\t}\n\n\tprivate onDidChangeContext(): void {\n\t\tlet didChange = false;\n\n\t\tfor (const item of this.items) {\n\t\t\tif (!item.descriptor.when || item.descriptor.when === 'default') {\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\tconst visible = this.contextKeyService.contextMatchesRules(item.descriptor.when);\n\n\t\t\tif (item.visible === visible) {\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\titem.visible = visible;\n\t\t\tdidChange = true;\n\t\t}\n\n\t\tif (didChange) {\n\t\t\tthis._onDidChange.fire();\n\t\t}\n\t}\n\n\tdispose(): void {\n\t\tthis.disposables.dispose();\n\t}\n}\n\nexport abstract class ViewPane extends Pane implements IView {\n\n\tprivate static readonly AlwaysShowActionsConfig = 'workbench.view.alwaysShowHeaderActions';\n\n\tprivate _onDidFocus = this._register(new Emitter<void>());\n\treadonly onDidFocus: Event<void> = this._onDidFocus.event;\n\n\tprivate _onDidBlur = this._register(new Emitter<void>());\n\treadonly onDidBlur: Event<void> = this._onDidBlur.event;\n\n\tprivate _onDidChangeBodyVisibility = this._register(new Emitter<boolean>());\n\treadonly onDidChangeBodyVisibility: Event<boolean> = this._onDidChangeBodyVisibility.event;\n\n\tprotected _onDidChangeTitleArea = this._register(new Emitter<void>());\n\treadonly onDidChangeTitleArea: Event<void> = this._onDidChangeTitleArea.event;\n\n\tprotected _onDidChangeViewWelcomeState = this._register(new Emitter<void>());\n\treadonly onDidChangeViewWelcomeState: Event<void> = this._onDidChangeViewWelcomeState.event;\n\n\tprivate _isVisible: boolean = false;\n\treadonly id: string;\n\n\tprivate _title: string;\n\tpublic get title(): string {\n\t\treturn this._title;\n\t}\n\n\tprivate _titleDescription: string | undefined;\n\tpublic get titleDescription(): string | undefined {\n\t\treturn this._titleDescription;\n\t}\n\n\treadonly menuActions: CompositeMenuActions;\n\n\tprivate progressBar!: ProgressBar;\n\tprivate progressIndicator!: IProgressIndicator;\n\n\tprivate toolbar?: WorkbenchToolBar;\n\tprivate readonly showActions: ViewPaneShowActions;\n\tprivate headerContainer?: HTMLElement;\n\tprivate titleContainer?: HTMLElement;\n\tprivate titleDescriptionContainer?: HTMLElement;\n\tprivate iconContainer?: HTMLElement;\n\tprotected twistiesContainer?: HTMLElement;\n\n\tprivate bodyContainer!: HTMLElement;\n\tprivate viewWelcomeContainer!: HTMLElement;\n\tprivate viewWelcomeDisposable: IDisposable = Disposable.None;\n\tprivate viewWelcomeController: ViewWelcomeController;\n\n\tprotected readonly scopedContextKeyService: IContextKeyService;\n\n\tconstructor(\n\t\toptions: IViewPaneOptions,\n\t\t@IKeybindingService protected keybindingService: IKeybindingService,\n\t\t@IContextMenuService protected contextMenuService: IContextMenuService,\n\t\t@IConfigurationService protected readonly configurationService: IConfigurationService,\n\t\t@IContextKeyService protected contextKeyService: IContextKeyService,\n\t\t@IViewDescriptorService protected viewDescriptorService: IViewDescriptorService,\n\t\t@IInstantiationService protected instantiationService: IInstantiationService,\n\t\t@IOpenerService protected openerService: IOpenerService,\n\t\t@IThemeService protected themeService: IThemeService,\n\t\t@ITelemetryService protected telemetryService: ITelemetryService,\n\t) {\n\t\tsuper({ ...options, ...{ orientation: viewDescriptorService.getViewLocationById(options.id) === ViewContainerLocation.Panel ? Orientation.HORIZONTAL : Orientation.VERTICAL } });\n\n\t\tthis.id = options.id;\n\t\tthis._title = options.title;\n\t\tthis._titleDescription = options.titleDescription;\n\t\tthis.showActions = options.showActions ?? ViewPaneShowActions.Default;\n\n\t\tthis.scopedContextKeyService = this._register(contextKeyService.createScoped(this.element));\n\t\tthis.scopedContextKeyService.createKey('view', this.id);\n\t\tconst viewLocationKey = this.scopedContextKeyService.createKey('viewLocation', ViewContainerLocationToString(viewDescriptorService.getViewLocationById(this.id)!));\n\t\tthis._register(Event.filter(viewDescriptorService.onDidChangeLocation, e => e.views.some(view => view.id === this.id))(() => viewLocationKey.set(ViewContainerLocationToString(viewDescriptorService.getViewLocationById(this.id)!))));\n\n\t\tthis.menuActions = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService])).createInstance(CompositeMenuActions, options.titleMenuId ?? MenuId.ViewTitle, MenuId.ViewTitleContext, { shouldForwardArgs: !options.donotForwardArgs }));\n\t\tthis._register(this.menuActions.onDidChange(() => this.updateActions()));\n\n\t\tthis.viewWelcomeController = this._register(new ViewWelcomeController(this.id, contextKeyService));\n\t}\n\n\toverride get headerVisible(): boolean {\n\t\treturn super.headerVisible;\n\t}\n\n\toverride set headerVisible(visible: boolean) {\n\t\tsuper.headerVisible = visible;\n\t\tthis.element.classList.toggle('merged-header', !visible);\n\t}\n\n\tsetVisible(visible: boolean): void {\n\t\tif (this._isVisible !== visible) {\n\t\t\tthis._isVisible = visible;\n\n\t\t\tif (this.isExpanded()) {\n\t\t\t\tthis._onDidChangeBodyVisibility.fire(visible);\n\t\t\t}\n\t\t}\n\t}\n\n\tisVisible(): boolean {\n\t\treturn this._isVisible;\n\t}\n\n\tisBodyVisible(): boolean {\n\t\treturn this._isVisible && this.isExpanded();\n\t}\n\n\toverride setExpanded(expanded: boolean): boolean {\n\t\tconst changed = super.setExpanded(expanded);\n\t\tif (changed) {\n\t\t\tthis._onDidChangeBodyVisibility.fire(expanded);\n\t\t}\n\t\tif (this.twistiesContainer) {\n\t\t\tthis.twistiesContainer.classList.remove(...ThemeIcon.asClassNameArray(this.getTwistyIcon(!expanded)));\n\t\t\tthis.twistiesContainer.classList.add(...ThemeIcon.asClassNameArray(this.getTwistyIcon(expanded)));\n\t\t}\n\t\treturn changed;\n\t}\n\n\toverride render(): void {\n\t\tsuper.render();\n\n\t\tconst focusTracker = trackFocus(this.element);\n\t\tthis._register(focusTracker);\n\t\tthis._register(focusTracker.onDidFocus(() => this._onDidFocus.fire()));\n\t\tthis._register(focusTracker.onDidBlur(() => this._onDidBlur.fire()));\n\t}\n\n\tprotected renderHeader(container: HTMLElement): void {\n\t\tthis.headerContainer = container;\n\n\t\tthis.twistiesContainer = append(container, $(ThemeIcon.asCSSSelector(this.getTwistyIcon(this.isExpanded()))));\n\n\t\tthis.renderHeaderTitle(container, this.title);\n\n\t\tconst actions = append(container, $('.actions'));\n\t\tactions.classList.toggle('show-always', this.showActions === ViewPaneShowActions.Always);\n\t\tactions.classList.toggle('show-expanded', this.showActions === ViewPaneShowActions.WhenExpanded);\n\t\tthis.toolbar = this.instantiationService.createInstance(WorkbenchToolBar, actions, {\n\t\t\torientation: ActionsOrientation.HORIZONTAL,\n\t\t\tactionViewItemProvider: action => this.getActionViewItem(action),\n\t\t\tariaLabel: nls.localize('viewToolbarAriaLabel', \"{0} actions\", this.title),\n\t\t\tgetKeyBinding: action => this.keybindingService.lookupKeybinding(action.id),\n\t\t\trenderDropdownAsChildElement: true,\n\t\t\tactionRunner: this.getActionRunner(),\n\t\t\tresetMenu: this.menuActions.menuId\n\t\t});\n\n\t\tthis._register(this.toolbar);\n\t\tthis.setActions();\n\n\t\tthis._register(addDisposableListener(actions, EventType.CLICK, e => e.preventDefault()));\n\n\t\tconst viewContainerModel = this.viewDescriptorService.getViewContainerByViewId(this.id);\n\t\tif (viewContainerModel) {\n\t\t\tthis._register(this.viewDescriptorService.getViewContainerModel(viewContainerModel).onDidChangeContainerInfo(({ title }) => this.updateTitle(this.title)));\n\t\t} else {\n\t\t\tconsole.error(`View container model not found for view ${this.id}`);\n\t\t}\n\n\t\tconst onDidRelevantConfigurationChange = Event.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration(ViewPane.AlwaysShowActionsConfig));\n\t\tthis._register(onDidRelevantConfigurationChange(this.updateActionsVisibility, this));\n\t\tthis.updateActionsVisibility();\n\t}\n\n\tprotected getTwistyIcon(expanded: boolean): ThemeIcon {\n\t\treturn expanded ? viewPaneContainerExpandedIcon : viewPaneContainerCollapsedIcon;\n\t}\n\n\toverride style(styles: IPaneStyles): void {\n\t\tsuper.style(styles);\n\n\t\tconst icon = this.getIcon();\n\t\tif (this.iconContainer) {\n\t\t\tconst fgColor = asCssValueWithDefault(styles.headerForeground, asCssVariable(foreground));\n\t\t\tif (URI.isUri(icon)) {\n\t\t\t\t// Apply background color to activity bar item provided with iconUrls\n\t\t\t\tthis.iconContainer.style.backgroundColor = fgColor;\n\t\t\t\tthis.iconContainer.style.color = '';\n\t\t\t} else {\n\t\t\t\t// Apply foreground color to activity bar items provided with codicons\n\t\t\t\tthis.iconContainer.style.color = fgColor;\n\t\t\t\tthis.iconContainer.style.backgroundColor = '';\n\t\t\t}\n\t\t}\n\t}\n\n\tprivate getIcon(): ThemeIcon | URI {\n\t\treturn this.viewDescriptorService.getViewDescriptorById(this.id)?.containerIcon || defaultViewIcon;\n\t}\n\n\tprotected renderHeaderTitle(container: HTMLElement, title: string): void {\n\t\tthis.iconContainer = append(container, $('.icon', undefined));\n\t\tconst icon = this.getIcon();\n\n\t\tlet cssClass: string | undefined = undefined;\n\t\tif (URI.isUri(icon)) {\n\t\t\tcssClass = `view-${this.id.replace(/[\\.\\:]/g, '-')}`;\n\t\t\tconst iconClass = `.pane-header .icon.${cssClass}`;\n\n\t\t\tcreateCSSRule(iconClass, `\n\t\t\t\tmask: ${asCSSUrl(icon)} no-repeat 50% 50%;\n\t\t\t\tmask-size: 24px;\n\t\t\t\t-webkit-mask: ${asCSSUrl(icon)} no-repeat 50% 50%;\n\t\t\t\t-webkit-mask-size: 16px;\n\t\t\t`);\n\t\t} else if (ThemeIcon.isThemeIcon(icon)) {\n\t\t\tcssClass = ThemeIcon.asClassName(icon);\n\t\t}\n\n\t\tif (cssClass) {\n\t\t\tthis.iconContainer.classList.add(...cssClass.split(' '));\n\t\t}\n\n\t\tconst calculatedTitle = this.calculateTitle(title);\n\t\tthis.titleContainer = append(container, $('h3.title', { title: calculatedTitle }, calculatedTitle));\n\n\t\tif (this._titleDescription) {\n\t\t\tthis.setTitleDescription(this._titleDescription);\n\t\t}\n\n\t\tthis.iconContainer.title = calculatedTitle;\n\t\tthis.iconContainer.setAttribute('aria-label', calculatedTitle);\n\t}\n\n\tprotected updateTitle(title: string): void {\n\t\tconst calculatedTitle = this.calculateTitle(title);\n\t\tif (this.titleContainer) {\n\t\t\tthis.titleContainer.textContent = calculatedTitle;\n\t\t\tthis.titleContainer.setAttribute('title', calculatedTitle);\n\t\t}\n\n\t\tif (this.iconContainer) {\n\t\t\tthis.iconContainer.title = calculatedTitle;\n\t\t\tthis.iconContainer.setAttribute('aria-label', calculatedTitle);\n\t\t}\n\n\t\tthis._title = title;\n\t\tthis._onDidChangeTitleArea.fire();\n\t}\n\n\tprivate setTitleDescription(description: string | undefined) {\n\t\tif (this.titleDescriptionContainer) {\n\t\t\tthis.titleDescriptionContainer.textContent = description ?? '';\n\t\t\tthis.titleDescriptionContainer.setAttribute('title', description ?? '');\n\t\t}\n\t\telse if (description && this.titleContainer) {\n\t\t\tthis.titleDescriptionContainer = after(this.titleContainer, $('span.description', { title: description }, description));\n\t\t}\n\t}\n\n\tprotected updateTitleDescription(description?: string | undefined): void {\n\t\tthis.setTitleDescription(description);\n\n\t\tthis._titleDescription = description;\n\t\tthis._onDidChangeTitleArea.fire();\n\t}\n\n\tprivate calculateTitle(title: string): string {\n\t\tconst viewContainer = this.viewDescriptorService.getViewContainerByViewId(this.id)!;\n\t\tconst model = this.viewDescriptorService.getViewContainerModel(viewContainer);\n\t\tconst viewDescriptor = this.viewDescriptorService.getViewDescriptorById(this.id);\n\t\tconst isDefault = this.viewDescriptorService.getDefaultContainerById(this.id) === viewContainer;\n\n\t\tif (!isDefault && viewDescriptor?.containerTitle && model.title !== viewDescriptor.containerTitle) {\n\t\t\treturn `${viewDescriptor.containerTitle}: ${title}`;\n\t\t}\n\n\t\treturn title;\n\t}\n\n\tprivate scrollableElement!: DomScrollableElement;\n\n\tprotected renderBody(container: HTMLElement): void {\n\t\tthis.bodyContainer = container;\n\n\t\tconst viewWelcomeContainer = append(container, $('.welcome-view'));\n\t\tthis.viewWelcomeContainer = $('.welcome-view-content', { tabIndex: 0 });\n\t\tthis.scrollableElement = this._register(new DomScrollableElement(this.viewWelcomeContainer, {\n\t\t\talwaysConsumeMouseWheel: true,\n\t\t\thorizontal: ScrollbarVisibility.Hidden,\n\t\t\tvertical: ScrollbarVisibility.Visible,\n\t\t}));\n\n\t\tappend(viewWelcomeContainer, this.scrollableElement.getDomNode());\n\n\t\tconst onViewWelcomeChange = Event.any(this.viewWelcomeController.onDidChange, this.onDidChangeViewWelcomeState);\n\t\tthis._register(onViewWelcomeChange(this.updateViewWelcome, this));\n\t\tthis.updateViewWelcome();\n\t}\n\n\tprotected layoutBody(height: number, width: number): void {\n\t\tif (this.shouldShowWelcome()) {\n\t\t\tthis.viewWelcomeContainer.style.height = `${height}px`;\n\t\t\tthis.viewWelcomeContainer.style.width = `${width}px`;\n\t\t\tthis.viewWelcomeContainer.classList.toggle('wide', width > 640);\n\t\t\tthis.scrollableElement.scanDomNode();\n\t\t}\n\t}\n\n\tonDidScrollRoot() {\n\t\t// noop\n\t}\n\n\tgetProgressIndicator() {\n\t\tif (this.progressBar === undefined) {\n\t\t\t// Progress bar\n\t\t\tthis.progressBar = this._register(new ProgressBar(this.element, defaultProgressBarStyles));\n\t\t\tthis.progressBar.hide();\n\t\t}\n\n\t\tif (this.progressIndicator === undefined) {\n\t\t\tconst that = this;\n\t\t\tthis.progressIndicator = new ScopedProgressIndicator(assertIsDefined(this.progressBar), new class extends AbstractProgressScope {\n\t\t\t\tconstructor() {\n\t\t\t\t\tsuper(that.id, that.isBodyVisible());\n\t\t\t\t\tthis._register(that.onDidChangeBodyVisibility(isVisible => isVisible ? this.onScopeOpened(that.id) : this.onScopeClosed(that.id)));\n\t\t\t\t}\n\t\t\t}());\n\t\t}\n\t\treturn this.progressIndicator;\n\t}\n\n\tprotected getProgressLocation(): string {\n\t\treturn this.viewDescriptorService.getViewContainerByViewId(this.id)!.id;\n\t}\n\n\tprotected getBackgroundColor(): string {\n\t\tswitch (this.viewDescriptorService.getViewLocationById(this.id)) {\n\t\t\tcase ViewContainerLocation.Panel:\n\t\t\t\treturn PANEL_BACKGROUND;\n\t\t\tcase ViewContainerLocation.Sidebar:\n\t\t\tcase ViewContainerLocation.AuxiliaryBar:\n\t\t\t\treturn SIDE_BAR_BACKGROUND;\n\t\t}\n\n\t\treturn SIDE_BAR_BACKGROUND;\n\t}\n\n\tfocus(): void {\n\t\tif (this.shouldShowWelcome()) {\n\t\t\tthis.viewWelcomeContainer.focus();\n\t\t} else if (this.element) {\n\t\t\tthis.element.focus();\n\t\t\tthis._onDidFocus.fire();\n\t\t}\n\t}\n\n\tprivate setActions(): void {\n\t\tif (this.toolbar) {\n\t\t\tconst primaryActions = [...this.menuActions.getPrimaryActions()];\n\t\t\tif (this.shouldShowFilterInHeader()) {\n\t\t\t\tprimaryActions.unshift(VIEWPANE_FILTER_ACTION);\n\t\t\t}\n\t\t\tthis.toolbar.setActions(prepareActions(primaryActions), prepareActions(this.menuActions.getSecondaryActions()));\n\t\t\tthis.toolbar.context = this.getActionsContext();\n\t\t}\n\t}\n\n\tprivate updateActionsVisibility(): void {\n\t\tif (!this.headerContainer) {\n\t\t\treturn;\n\t\t}\n\t\tconst shouldAlwaysShowActions = this.configurationService.getValue<boolean>('workbench.view.alwaysShowHeaderActions');\n\t\tthis.headerContainer.classList.toggle('actions-always-visible', shouldAlwaysShowActions);\n\t}\n\n\tprotected updateActions(): void {\n\t\tthis.setActions();\n\t\tthis._onDidChangeTitleArea.fire();\n\t}\n\n\tgetActionViewItem(action: IAction, options?: IDropdownMenuActionViewItemOptions): IActionViewItem | undefined {\n\t\tif (action.id === VIEWPANE_FILTER_ACTION.id) {\n\t\t\tconst that = this;\n\t\t\treturn new class extends BaseActionViewItem {\n\t\t\t\tconstructor() { super(null, action); }\n\t\t\t\toverride setFocusable(): void { /* noop input elements are focusable by default */ }\n\t\t\t\toverride get trapsArrowNavigation(): boolean { return true; }\n\t\t\t\toverride render(container: HTMLElement): void {\n\t\t\t\t\tcontainer.classList.add('viewpane-filter-container');\n\t\t\t\t\tappend(container, that.getFilterWidget()!.element);\n\t\t\t\t}\n\t\t\t};\n\t\t}\n\t\treturn createActionViewItem(this.instantiationService, action, { ...options, ...{ menuAsChild: action instanceof SubmenuItemAction } });\n\t}\n\n\tgetActionsContext(): unknown {\n\t\treturn undefined;\n\t}\n\n\tgetActionRunner(): IActionRunner | undefined {\n\t\treturn undefined;\n\t}\n\n\tgetOptimalWidth(): number {\n\t\treturn 0;\n\t}\n\n\tsaveState(): void {\n\t\t// Subclasses to implement for saving state\n\t}\n\n\tprivate updateViewWelcome(): void {\n\t\tthis.viewWelcomeDisposable.dispose();\n\n\t\tif (!this.shouldShowWelcome()) {\n\t\t\tthis.bodyContainer.classList.remove('welcome');\n\t\t\tthis.viewWelcomeContainer.innerText = '';\n\t\t\tthis.scrollableElement.scanDomNode();\n\t\t\treturn;\n\t\t}\n\n\t\tconst contents = this.viewWelcomeController.contents;\n\n\t\tif (contents.length === 0) {\n\t\t\tthis.bodyContainer.classList.remove('welcome');\n\t\t\tthis.viewWelcomeContainer.innerText = '';\n\t\t\tthis.scrollableElement.scanDomNode();\n\t\t\treturn;\n\t\t}\n\n\t\tconst disposables = new DisposableStore();\n\t\tthis.bodyContainer.classList.add('welcome');\n\t\tthis.viewWelcomeContainer.innerText = '';\n\n\t\tfor (const { content, precondition } of contents) {\n\t\t\tconst lines = content.split('\\n');\n\n\t\t\tfor (let line of lines) {\n\t\t\t\tline = line.trim();\n\n\t\t\t\tif (!line) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tconst linkedText = parseLinkedText(line);\n\n\t\t\t\tif (linkedText.nodes.length === 1 && typeof linkedText.nodes[0] !== 'string') {\n\t\t\t\t\tconst node = linkedText.nodes[0];\n\t\t\t\t\tconst buttonContainer = append(this.viewWelcomeContainer, $('.button-container'));\n\t\t\t\t\tconst button = new Button(buttonContainer, { title: node.title, supportIcons: true, ...defaultButtonStyles });\n\t\t\t\t\tbutton.label = node.label;\n\t\t\t\t\tbutton.onDidClick(_ => {\n\t\t\t\t\t\tthis.telemetryService.publicLog2<{ viewId: string; uri: string }, WelcomeActionClassification>('views.welcomeAction', { viewId: this.id, uri: node.href });\n\t\t\t\t\t\tthis.openerService.open(node.href, { allowCommands: true });\n\t\t\t\t\t}, null, disposables);\n\t\t\t\t\tdisposables.add(button);\n\n\t\t\t\t\tif (precondition) {\n\t\t\t\t\t\tconst updateEnablement = () => button.enabled = this.contextKeyService.contextMatchesRules(precondition);\n\t\t\t\t\t\tupdateEnablement();\n\n\t\t\t\t\t\tconst keys = new Set();\n\t\t\t\t\t\tprecondition.keys().forEach(key => keys.add(key));\n\t\t\t\t\t\tconst onDidChangeContext = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(keys));\n\t\t\t\t\t\tonDidChangeContext(updateEnablement, null, disposables);\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\tconst p = append(this.viewWelcomeContainer, $('p'));\n\n\t\t\t\t\tfor (const node of linkedText.nodes) {\n\t\t\t\t\t\tif (typeof node === 'string') {\n\t\t\t\t\t\t\tappend(p, document.createTextNode(node));\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tconst link = disposables.add(this.instantiationService.createInstance(Link, p, node, {}));\n\n\t\t\t\t\t\t\tif (precondition && node.href.startsWith('command:')) {\n\t\t\t\t\t\t\t\tconst updateEnablement = () => link.enabled = this.contextKeyService.contextMatchesRules(precondition);\n\t\t\t\t\t\t\t\tupdateEnablement();\n\n\t\t\t\t\t\t\t\tconst keys = new Set();\n\t\t\t\t\t\t\t\tprecondition.keys().forEach(key => keys.add(key));\n\t\t\t\t\t\t\t\tconst onDidChangeContext = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(keys));\n\t\t\t\t\t\t\t\tonDidChangeContext(updateEnablement, null, disposables);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tthis.scrollableElement.scanDomNode();\n\t\tthis.viewWelcomeDisposable = disposables;\n\t}\n\n\tshouldShowWelcome(): boolean {\n\t\treturn false;\n\t}\n\n\tgetFilterWidget()",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "\n\tlayout(height: number, width: number) {\n\t\tif (!this.enabled) {\n\t\t\treturn;\n\t\t}\n\n\t\tthis.element!.style.height = `${height}px`;\n\t\tthis.element!.style.width = `${width}px`;\n\t\tthis.element!.classList.toggle('wide', width > 640);\n\t\tthis.scrollableElement!.scanDomNode();\n\t}\n\n\tfocus() {\n\t\tif (!this.enabled) {\n\t\t\treturn;\n\t\t}\n\n\t\tthis.element!.focus();\n\t}\n\n\tprivate onDidChangeViewWelcomeState(): void {\n\t\tconst enabled = this.delegate.shouldShowWelcome();\n\n\t\tif (this.enabled === enabled) {\n\t\t\treturn;\n\t\t}\n\n\t\tthis.enabled = enabled;\n\n\t\tif (!enabled) {\n\t\t\tthis.enabledDisposables.clear();\n\t\t\treturn;\n\t\t}\n\n\t\tthis.container.classList.add('welcome');\n\t\tconst viewWelcomeContainer = append(this.container, $('.welcome-view'));\n\t\tthis.element = $('.welcome-view-content', { tabIndex: 0 });\n\t\tthis.scrollableElement = new DomScrollableElement(this.element, { alwaysConsumeMouseWheel: true, horizontal: ScrollbarVisibility.Hidden, vertical: ScrollbarVisibility.Visible, });\n\t\tappend(viewWelcomeContainer, this.scrollableElement.getDomNode());\n\n\t\tthis.enabledDisposables.add(toDisposable(() => {\n\t\t\tthis.container.classList.remove('welcome');\n\t\t\tthis.scrollableElement!.dispose();\n\t\t\tviewWelcomeContainer.remove();\n\t\t\tthis.scrollableElement = undefined;\n\t\t\tthis.element = undefined;\n\t\t}));\n\n\t\tthis.contextKeyService.onDidChangeContext(this.onDidChangeContext, this, this.enabledDisposables);\n\t\tEvent.chain(viewsRegistry.onDidChangeViewWelcomeContent, $ => $.filter(id => id === this.delegate.id))\n\t\t\t(this.onDidChangeViewWelcomeContent, this, this.enabledDisposables);\n\t\tthis.onDidChangeViewWelcomeContent();\n\t}\n\n\tprivate onDidChangeViewWelcomeContent(): void {\n\t\tconst descriptors = viewsRegistry.getViewWelcomeContent(this.delegate.id);\n\n\t\tthis.items = [];\n\n\t\tfor (const descriptor of descriptors) {\n\t\t\tif (descriptor.when === 'default') {\n\t\t\t\tthis.defaultItem = { descriptor, visible: true };\n\t\t\t} else {\n\t\t\t\tconst visible = descriptor.when ? this.contextKeyService.contextMatchesRules(descriptor.when) : true;\n\t\t\t\tthis.items.push({ descriptor, visible });\n\t\t\t}\n\t\t}\n\n\t\tthis.render();\n\t}\n\n\tprivate onDidChangeContext(): void {\n\t\tlet didChange = false;\n\n\t\tfor (const item of this.items) {\n\t\t\tif (!item.descriptor.when || item.descriptor.when === 'default') {\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\tconst visible = this.contextKeyService.contextMatchesRules(item.descriptor.when);\n\n\t\t\tif (item.visible === visible) {\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\titem.visible = visible;\n\t\t\tdidChange = true;\n\t\t}\n\n\t\tif (didChange) {\n\t\t\tthis.render();\n\t\t}\n\t}\n\n\tprivate render(): void {\n\t\tthis.renderDisposables.clear();\n\n\t\tconst contents = this.getContentDescriptors();\n\n\t\tif (contents.length === 0) {\n\t\t\tthis.container.classList.remove('welcome');\n\t\t\tthis.element!.innerText = '';\n\t\t\tthis.scrollableElement!.scanDomNode();\n\t\t\treturn;\n\t\t}\n\n\t\tthis.container.classList.add('welcome');\n\t\tthis.element!.innerText = '';\n\n\t\tfor (const { content, precondition } of contents) {\n\t\t\tconst lines = content.split('\\n');\n\n\t\t\tfor (let line of lines) {\n\t\t\t\tline = line.trim();\n\n\t\t\t\tif (!line) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tconst linkedText = parseLinkedText(line);\n\n\t\t\t\tif (linkedText.nodes.length === 1 && typeof linkedText.nodes[0] !== 'string') {\n\t\t\t\t\tconst node = linkedText.nodes[0];\n\t\t\t\t\tconst buttonContainer = append(this.element!, $('.button-container'));\n\t\t\t\t\tconst button = new Button(buttonContainer, { title: node.title, supportIcons: true, ...defaultButtonStyles });\n\t\t\t\t\tbutton.label = node.label;\n\t\t\t\t\tbutton.onDidClick(_ => {\n\t\t\t\t\t\tthis.telemetryService.publicLog2<{ viewId: string; uri: string }, WelcomeActionClassification>('views.welcomeAction', { viewId: this.delegate.id, uri: node.href });\n\t\t\t\t\t\tthis.openerService.open(node.href, { allowCommands: true });\n\t\t\t\t\t}, null, this.renderDisposables);\n\t\t\t\t\tthis.renderDisposables.add(button);\n\n\t\t\t\t\tif (precondition) {\n\t\t\t\t\t\tconst updateEnablement = () => button.enabled = this.contextKeyService.contextMatchesRules(precondition);\n\t\t\t\t\t\tupdateEnablement();\n\n\t\t\t\t\t\tconst keys = new Set(precondition.keys());\n\t\t\t\t\t\tconst onDidChangeContext = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(keys));\n\t\t\t\t\t\tonDidChangeContext(updateEnablement, null, this.renderDisposables);\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\tconst p = append(this.element!, $('p'));\n\n\t\t\t\t\tfor (const node of linkedText.nodes) {\n\t\t\t\t\t\tif (typeof node === 'string') {\n\t\t\t\t\t\t\tappend(p, document.createTextNode(node));\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tconst link = this.renderDisposables.add(this.instantiationService.createInstance(Link, p, node, {}));\n\n\t\t\t\t\t\t\tif (precondition && node.href.startsWith('command:')) {\n\t\t\t\t\t\t\t\tconst updateEnablement = () => link.enabled = this.contextKeyService.contextMatchesRules(precondition);\n\t\t\t\t\t\t\t\tupdateEnablement();\n\n\t\t\t\t\t\t\t\tconst keys = new Set(precondition.keys());\n\t\t\t\t\t\t\t\tconst onDidChangeContext = Event.filter(this.contextKeyService.onDidChangeContext, e => e.affectsSome(keys));\n\t\t\t\t\t\t\t\tonDidChangeContext(updateEnablement, null, this.renderDisposables);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tthis.scrollableElement!.scanDomNode();\n\t}\n\n\tprivate getContentDescriptors(): IViewContentDescriptor[] {\n\t\tconst visibleItems = this.items.filter(v => v.visible);\n\n\t\tif (visibleItems.length === 0 && this.defaultItem) {\n\t\t\treturn [this.defaultItem.descriptor];\n\t\t}\n\n\t\treturn visibleItems.map(v => v.descriptor);\n\t}\n\n\tdispose(): void {\n\t\tthis.disposables.dispose();\n\t}\n\t}\n\n\texport abstract class ViewPane extends Pane implements IView {\n\n\tprivate static readonly AlwaysShowActionsConfig = 'workbench.view.alwaysShowHeaderActions';\n\n\tprivate _onDidFocus = this._register(new Emitter<void>());\n\treadonly onDidFocus: Event<void> = this._onDidFocus.event;\n\n\tprivate _onDidBlur = this._register(new Emitter<void>());\n\treadonly onDidBlur: Event<void> = this._onDidBlur.event;\n\n\tprivate _onDidChangeBodyVisibility = this._register(new Emitter<boolean>());\n\treadonly onDidChangeBodyVisibility: Event<boolean> = this._onDidChangeBodyVisibility.event;\n\n\tprotected _onDidChangeTitleArea = this._register(new Emitter<void>());\n\treadonly onDidChangeTitleArea: Event<void> = this._onDidChangeTitleArea.event;\n\n\tprotected _onDidChangeViewWelcomeState = this._register(new Emitter<void>());\n\treadonly onDidChangeViewWelcomeState: Event<void> = this._onDidChangeViewWelcomeState.event;\n\n\tprivate _isVisible: boolean = false;\n\treadonly id: string;\n\n\tprivate _title: string;\n\tpublic get title(): string {\n\t\treturn this._title;\n\t}\n\n\tprivate _titleDescription: string | undefined;\n\tpublic get titleDescription(): string | undefined {\n\t\treturn this._titleDescription;\n\t}\n\n\treadonly menuActions: CompositeMenuActions;\n\n\tprivate progressBar!: ProgressBar;\n\tprivate progressIndicator!: IProgressIndicator;\n\n\tprivate toolbar?: WorkbenchToolBar;\n\tprivate readonly showActions: ViewPaneShowActions;\n\tprivate headerContainer?: HTMLElement;\n\tprivate titleContainer?: HTMLElement;\n\tprivate titleDescriptionContainer?: HTMLElement;\n\tprivate iconContainer?: HTMLElement;\n\tprotected twistiesContainer?: HTMLElement;\n\tprivate viewWelcomeController!: ViewWelcomeController;\n\n\tprotected readonly scopedContextKeyService: IContextKeyService;\n\n\tconstructor(\n\t\toptions: IViewPaneOptions,\n\t\t@IKeybindingService protected keybindingService: IKeybindingService,\n\t\t@IContextMenuService protected contextMenuService: IContextMenuService,\n\t\t@IConfigurationService protected readonly configurationService: IConfigurationService,\n\t\t@IContextKeyService protected contextKeyService: IContextKeyService,\n\t\t@IViewDescriptorService protected viewDescriptorService: IViewDescriptorService,\n\t\t@IInstantiationService protected instantiationService: IInstantiationService,\n\t\t@IOpenerService protected openerService: IOpenerService,\n\t\t@IThemeService protected themeService: IThemeService,\n\t\t@ITelemetryService protected telemetryService: ITelemetryService,\n\t) {\n\t\tsuper({ ...options, ...{ orientation: viewDescriptorService.getViewLocationById(options.id) === ViewContainerLocation.Panel ? Orientation.HORIZONTAL : Orientation.VERTICAL } });\n\n\t\tthis.id = options.id;\n\t\tthis._title = options.title;\n\t\tthis._titleDescription = options.titleDescription;\n\t\tthis.showActions = options.showActions ?? ViewPaneShowActions.Default;\n\n\t\tthis.scopedContextKeyService = this._register(contextKeyService.createScoped(this.element));\n\t\tthis.scopedContextKeyService.createKey('view', this.id);\n\t\tconst viewLocationKey = this.scopedContextKeyService.createKey('viewLocation', ViewContainerLocationToString(viewDescriptorService.getViewLocationById(this.id)!));\n\t\tthis._register(Event.filter(viewDescriptorService.onDidChangeLocation, e => e.views.some(view => view.id === this.id))(() => viewLocationKey.set(ViewContainerLocationToString(viewDescriptorService.getViewLocationById(this.id)!))));\n\n\t\tthis.menuActions = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService])).createInstance(CompositeMenuActions, options.titleMenuId ?? MenuId.ViewTitle, MenuId.ViewTitleContext, { shouldForwardArgs: !options.donotForwardArgs }));\n\t\tthis._register(this.menuActions.onDidChange(() => this.updateActions()));\n\t}\n\n\toverride get headerVisible(): boolean {\n\t\treturn super.headerVisible;\n\t}\n\n\toverride set headerVisible(visible: boolean) {\n\t\tsuper.headerVisible = visible;\n\t\tthis.element.classList.toggle('merged-header', !visible);\n\t}\n\n\tsetVisible(visible: boolean): void {\n\t\tif (this._isVisible !== visible) {\n\t\t\tthis._isVisible = visible;\n\n\t\t\tif (this.isExpanded()) {\n\t\t\t\tthis._onDidChangeBodyVisibility.fire(visible);\n\t\t\t}\n\t\t}\n\t}\n\n\tisVisible(): boolean {\n\t\treturn this._isVisible;\n\t}\n\n\tisBodyVisible(): boolean {\n\t\treturn this._isVisible && this.isExpanded();\n\t}\n\n\toverride setExpanded(expanded: boolean): boolean {\n\t\tconst changed = super.setExpanded(expanded);\n\t\tif (changed) {\n\t\t\tthis._onDidChangeBodyVisibility.fire(expanded);\n\t\t}\n\t\tif (this.twistiesContainer) {\n\t\t\tthis.twistiesContainer.classList.remove(...ThemeIcon.asClassNameArray(this.getTwistyIcon(!expanded)));\n\t\t\tthis.twistiesContainer.classList.add(...ThemeIcon.asClassNameArray(this.getTwistyIcon(expanded)));\n\t\t}\n\t\treturn changed;\n\t}\n\n\toverride render(): void {\n\t\tsuper.render();\n\n\t\tconst focusTracker = trackFocus(this.element);\n\t\tthis._register(focusTracker);\n\t\tthis._register(focusTracker.onDidFocus(() => this._onDidFocus.fire()));\n\t\tthis._register(focusTracker.onDidBlur(() => this._onDidBlur.fire()));\n\t}\n\n\tprotected renderHeader(container: HTMLElement): void {\n\t\tthis.headerContainer = container;\n\n\t\tthis.twistiesContainer = append(container, $(ThemeIcon.asCSSSelector(this.getTwistyIcon(this.isExpanded()))));\n\n\t\tthis.renderHeaderTitle(container, this.title);\n\n\t\tconst actions = append(container, $('.actions'));\n\t\tactions.classList.toggle('show-always', this.showActions === ViewPaneShowActions.Always);\n\t\tactions.classList.toggle('show-expanded', this.showActions === ViewPaneShowActions.WhenExpanded);\n\t\tthis.toolbar = this.instantiationService.createInstance(WorkbenchToolBar, actions, {\n\t\t\torientation: ActionsOrientation.HORIZONTAL,\n\t\t\tactionViewItemProvider: action => this.getActionViewItem(action),\n\t\t\tariaLabel: nls.localize('viewToolbarAriaLabel', \"{0} actions\", this.title),\n\t\t\tgetKeyBinding: action => this.keybindingService.lookupKeybinding(action.id),\n\t\t\trenderDropdownAsChildElement: true,\n\t\t\tactionRunner: this.getActionRunner(),\n\t\t\tresetMenu: this.menuActions.menuId\n\t\t});\n\n\t\tthis._register(this.toolbar);\n\t\tthis.setActions();\n\n\t\tthis._register(addDisposableListener(actions, EventType.CLICK, e => e.preventDefault()));\n\n\t\tconst viewContainerModel = this.viewDescriptorService.getViewContainerByViewId(this.id);\n\t\tif (viewContainerModel) {\n\t\t\tthis._register(this.viewDescriptorService.getViewContainerModel(viewContainerModel).onDidChangeContainerInfo(({ title }) => this.updateTitle(this.title)));\n\t\t} else {\n\t\t\tconsole.error(`View container model not found for view ${this.id}`);\n\t\t}\n\n\t\tconst onDidRelevantConfigurationChange = Event.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration(ViewPane.AlwaysShowActionsConfig));\n\t\tthis._register(onDidRelevantConfigurationChange(this.updateActionsVisibility, this));\n\t\tthis.updateActionsVisibility();\n\t}\n\n\tprotected getTwistyIcon(expanded: boolean): ThemeIcon {\n\t\treturn expanded ? viewPaneContainerExpandedIcon : viewPaneContainerCollapsedIcon;\n\t}\n\n\toverride style(styles: IPaneStyles): void {\n\t\tsuper.style(styles);\n\n\t\tconst icon = this.getIcon();\n\t\tif (this.iconContainer) {\n\t\t\tconst fgColor = asCssValueWithDefault(styles.headerForeground, asCssVariable(foreground));\n\t\t\tif (URI.isUri(icon)) {\n\t\t\t\t// Apply background color to activity bar item provided with iconUrls\n\t\t\t\tthis.iconContainer.style.backgroundColor = fgColor;\n\t\t\t\tthis.iconContainer.style.color = '';\n\t\t\t} else {\n\t\t\t\t// Apply foreground color to activity bar items provided with codicons\n\t\t\t\tthis.iconContainer.style.color = fgColor;\n\t\t\t\tthis.iconContainer.style.backgroundColor = '';\n\t\t\t}\n\t\t}\n\t}\n\n\tprivate getIcon(): ThemeIcon | URI {\n\t\treturn this.viewDescriptorService.getViewDescriptorById(this.id)?.containerIcon || defaultViewIcon;\n\t}\n\n\tprotected renderHeaderTitle(container: HTMLElement, title: string): void {\n\t\tthis.iconContainer = append(container, $('.icon', undefined));\n\t\tconst icon = this.getIcon();\n\n\t\tlet cssClass: string | undefined = undefined;\n\t\tif (URI.isUri(icon)) {\n\t\t\tcssClass = `view-${this.id.replace(/[\\.\\:]/g, '-')}`;\n\t\t\tconst iconClass = `.pane-header .icon.${cssClass}`;\n\n\t\t\tcreateCSSRule(iconClass, `\n\t\t\t\tmask: ${asCSSUrl(icon)} no-repeat 50% 50%;\n\t\t\t\tmask-size: 24px;\n\t\t\t\t-webkit-mask: ${asCSSUrl(icon)} no-repeat 50% 50%;\n\t\t\t\t-webkit-mask-size: 16px;\n\t\t\t`);\n\t\t} else if (ThemeIcon.isThemeIcon(icon)) {\n\t\t\tcssClass = ThemeIcon.asClassName(icon);\n\t\t}\n\n\t\tif (cssClass) {\n\t\t\tthis.iconContainer.classList.add(...cssClass.split(' '));\n\t\t}\n\n\t\tconst calculatedTitle = this.calculateTitle(title);\n\t\tthis.titleContainer = append(container, $('h3.title', { title: calculatedTitle }, calculatedTitle));\n\n\t\tif (this._titleDescription) {\n\t\t\tthis.setTitleDescription(this._titleDescription);\n\t\t}\n\n\t\tthis.iconContainer.title = calculatedTitle;\n\t\tthis.iconContainer.setAttribute('aria-label', calculatedTitle);\n\t}\n\n\tprotected updateTitle(title: string): void {\n\t\tconst calculatedTitle = this.calculateTitle(title);\n\t\tif (this.titleContainer) {\n\t\t\tthis.titleContainer.textContent = calculatedTitle;\n\t\t\tthis.titleContainer.setAttribute('title', calculatedTitle);\n\t\t}\n\n\t\tif (this.iconContainer) {\n\t\t\tthis.iconContainer.title = calculatedTitle;\n\t\t\tthis.iconContainer.setAttribute('aria-label', calculatedTitle);\n\t\t}\n\n\t\tthis._title = title;\n\t\tthis._onDidChangeTitleArea.fire();\n\t}\n\n\tprivate setTitleDescription(description: string | undefined) {\n\t\tif (this.titleDescriptionContainer) {\n\t\t\tthis.titleDescriptionContainer.textContent = description ?? '';\n\t\t\tthis.titleDescriptionContainer.setAttribute('title', description ?? '');\n\t\t}\n\t\telse if (description && this.titleContainer) {\n\t\t\tthis.titleDescriptionContainer = after(this.titleContainer, $('span.description', { title: description }, description));\n\t\t}\n\t}\n\n\tprotected updateTitleDescription(description?: string | undefined): void {\n\t\tthis.setTitleDescription(description);\n\n\t\tthis._titleDescription = description;\n\t\tthis._onDidChangeTitleArea.fire();\n\t}\n\n\tprivate calculateTitle(title: string): string {\n\t\tconst viewContainer = this.viewDescriptorService.getViewContainerByViewId(this.id)!;\n\t\tconst model = this.viewDescriptorService.getViewContainerModel(viewContainer);\n\t\tconst viewDescriptor = this.viewDescriptorService.getViewDescriptorById(this.id);\n\t\tconst isDefault = this.viewDescriptorService.getDefaultContainerById(this.id) === viewContainer;\n\n\t\tif (!isDefault && viewDescriptor?.containerTitle && model.title !== viewDescriptor.containerTitle) {\n\t\t\treturn `${viewDescriptor.containerTitle}: ${title}`;\n\t\t}\n\n\t\treturn title;\n\t}\n\n\tprotected renderBody(container: HTMLElement): void {\n\t\tthis.viewWelcomeController = this._register(new ViewWelcomeController(container, this, this.instantiationService, this.openerService, this.telemetryService, this.contextKeyService));\n\t}\n\n\tprotected layoutBody(height: number, width: number): void {\n\t\tthis.viewWelcomeController.layout(height, width);\n\t}\n\n\tonDidScrollRoot() {\n\t\t// noop\n\t}\n\n\tgetProgressIndicator() {\n\t\tif (this.progressBar === undefined) {\n\t\t\t// Progress bar\n\t\t\tthis.progressBar = this._register(new ProgressBar(this.element, defaultProgressBarStyles));\n\t\t\tthis.progressBar.hide();\n\t\t}\n\n\t\tif (this.progressIndicator === undefined) {\n\t\t\tconst that = this;\n\t\t\tthis.progressIndicator = new ScopedProgressIndicator(assertIsDefined(this.progressBar), new class extends AbstractProgressScope {\n\t\t\t\tconstructor() {\n\t\t\t\t\tsuper(that.id, that.isBodyVisible());\n\t\t\t\t\tthis._register(that.onDidChangeBodyVisibility(isVisible => isVisible ? this.onScopeOpened(that.id) : this.onScopeClosed(that.id)));\n\t\t\t\t}\n\t\t\t}());\n\t\t}\n\t\treturn this.progressIndicator;\n\t}\n\n\tprotected getProgressLocation(): string {\n\t\treturn this.viewDescriptorService.getViewContainerByViewId(this.id)!.id;\n\t}\n\n\tprotected getBackgroundColor(): string {\n\t\tswitch (this.viewDescriptorService.getViewLocationById(this.id)) {\n\t\t\tcase ViewContainerLocation.Panel:\n\t\t\t\treturn PANEL_BACKGROUND;\n\t\t\tcase ViewContainerLocation.Sidebar:\n\t\t\tcase ViewContainerLocation.AuxiliaryBar:\n\t\t\t\treturn SIDE_BAR_BACKGROUND;\n\t\t}\n\n\t\treturn SIDE_BAR_BACKGROUND;\n\t}\n\n\tfocus(): void {\n\t\tif (this.shouldShowWelcome()) {\n\t\t\tthis.viewWelcomeController.focus();\n\t\t} else if (this.element) {\n\t\t\tthis.element.focus();\n\t\t\tthis._onDidFocus.fire();\n\t\t}\n\t}\n\n\tprivate setActions(): void {\n\t\tif (this.toolbar) {\n\t\t\tconst primaryActions = [...this.menuActions.getPrimaryActions()];\n\t\t\tif (this.shouldShowFilterInHeader()) {\n\t\t\t\tprimaryActions.unshift(VIEWPANE_FILTER_ACTION);\n\t\t\t}\n\t\t\tthis.toolbar.setActions(prepareActions(primaryActions), prepareActions(this.menuActions.getSecondaryActions()));\n\t\t\tthis.toolbar.context = this.getActionsContext();\n\t\t}\n\t}\n\n\tprivate updateActionsVisibility(): void {\n\t\tif (!this.headerContainer) {\n\t\t\treturn;\n\t\t}\n\t\tconst shouldAlwaysShowActions = this.configurationService.getValue<boolean>('workbench.view.alwaysShowHeaderActions');\n\t\tthis.headerContainer.classList.toggle('actions-always-visible', shouldAlwaysShowActions);\n\t}\n\n\tprotected updateActions(): void {\n\t\tthis.setActions();\n\t\tthis._onDidChangeTitleArea.fire();\n\t}\n\n\tgetActionViewItem(action: IAction, options?: IDropdownMenuActionViewItemOptions): IActionViewItem | undefined {\n\t\tif (action.id === VIEWPANE_FILTER_ACTION.id) {\n\t\t\tconst that = this;\n\t\t\treturn new class extends BaseActionViewItem {\n\t\t\t\tconstructor() { super(null, action); }\n\t\t\t\toverride setFocusable(): void { /* noop input elements are focusable by default */ }\n\t\t\t\toverride get trapsArrowNavigation(): boolean { return true; }\n\t\t\t\toverride render(container: HTMLElement): void {\n\t\t\t\t\tcontainer.classList.add('viewpane-filter-container');\n\t\t\t\t\tappend(container, that.getFilterWidget()!.element);\n\t\t\t\t}\n\t\t\t};\n\t\t}\n\t\treturn createActionViewItem(this.instantiationService, action, { ...options, ...{ menuAsChild: action instanceof SubmenuItemAction } });\n\t}\n\n\tgetActionsContext(): unknown {\n\t\treturn undefined;\n\t}\n\n\tgetActionRunner(): IActionRunner | undefined {\n\t\treturn undefined;\n\t}\n\n\tgetOptimalWidth(): number {\n\t\treturn 0;\n\t}\n\n\tsaveState(): void {\n\t\t// Subclasses to implement for saving state\n\t}\n\n\tshouldShowWelcome(): boolean {\n\t\treturn false;\n\t}\n\n\tgetFilterWidget()",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,3)",
			"modifiedRange": "[1,52)",
			"innerChanges": [
				{
					"originalRange": "[1,1 -> 2,37]",
					"modifiedRange": "[1,1 -> 50,15]"
				},
				{
					"originalRange": "[2,82 -> 2,82]",
					"modifiedRange": "[50,60 -> 50,74]"
				},
				{
					"originalRange": "[2,99 -> 2,99]",
					"modifiedRange": "[50,91 -> 50,100]"
				},
				{
					"originalRange": "[2,103 -> 2,103]",
					"modifiedRange": "[50,104 -> 51,4]"
				},
				{
					"originalRange": "[2,151 -> 2,152]",
					"modifiedRange": "[51,52 -> 51,60]"
				},
				{
					"originalRange": "[2,163 -> 2,164]",
					"modifiedRange": "[51,71 -> 51,71]"
				}
			]
		},
		{
			"originalRange": "[7,8)",
			"modifiedRange": "[56,57)",
			"innerChanges": [
				{
					"originalRange": "[7,63 -> 7,63]",
					"modifiedRange": "[56,63 -> 56,72]"
				}
			]
		},
		{
			"originalRange": "[20,21)",
			"modifiedRange": "[69,70)",
			"innerChanges": [
				{
					"originalRange": "[20,8 -> 20,25]",
					"modifiedRange": "[69,8 -> 69,14]"
				}
			]
		},
		{
			"originalRange": "[42,44)",
			"modifiedRange": "[91,175)",
			"innerChanges": [
				{
					"originalRange": "[42,9 -> 44,1]",
					"modifiedRange": "[91,9 -> 175,1]"
				}
			]
		},
		{
			"originalRange": "[49,50)",
			"modifiedRange": "[180,181)",
			"innerChanges": [
				{
					"originalRange": "[49,1 -> 49,1]",
					"modifiedRange": "[180,1 -> 180,2]"
				}
			]
		},
		{
			"originalRange": "[51,52)",
			"modifiedRange": "[182,183)",
			"innerChanges": [
				{
					"originalRange": "[51,1 -> 51,1]",
					"modifiedRange": "[182,1 -> 182,2]"
				}
			]
		},
		{
			"originalRange": "[95,100)",
			"modifiedRange": "[226,227)",
			"innerChanges": [
				{
					"originalRange": "[95,1 -> 99,1]",
					"modifiedRange": "[226,1 -> 226,1]"
				},
				{
					"originalRange": "[99,31 -> 99,31]",
					"modifiedRange": "[226,31 -> 226,32]"
				}
			]
		},
		{
			"originalRange": "[129,131)",
			"modifiedRange": "[256,256)",
			"innerChanges": [
				{
					"originalRange": "[129,1 -> 131,1]",
					"modifiedRange": "[256,1 -> 256,1]"
				}
			]
		},
		{
			"originalRange": "[323,325)",
			"modifiedRange": "[448,448)",
			"innerChanges": [
				{
					"originalRange": "[323,1 -> 325,1 EOL]",
					"modifiedRange": "[448,1 -> 448,1 EOL]"
				}
			]
		},
		{
			"originalRange": "[327,342)",
			"modifiedRange": "[450,451)",
			"innerChanges": [
				{
					"originalRange": "[327,8 -> 342,1]",
					"modifiedRange": "[450,8 -> 451,1]"
				}
			]
		},
		{
			"originalRange": "[345,351)",
			"modifiedRange": "[454,455)",
			"innerChanges": [
				{
					"originalRange": "[345,1 -> 346,2]",
					"modifiedRange": "[454,1 -> 454,1]"
				},
				{
					"originalRange": "[346,24 -> 346,27]",
					"modifiedRange": "[454,23 -> 454,27]"
				},
				{
					"originalRange": "[346,30 -> 346,48]",
					"modifiedRange": "[454,30 -> 454,37]"
				},
				{
					"originalRange": "[346,54 -> 351,1]",
					"modifiedRange": "[454,43 -> 455,1]"
				}
			]
		},
		{
			"originalRange": "[394,395)",
			"modifiedRange": "[498,499)",
			"innerChanges": [
				{
					"originalRange": "[394,24 -> 394,27]",
					"modifiedRange": "[498,24 -> 498,28]"
				}
			]
		},
		{
			"originalRange": "[456,539)",
			"modifiedRange": "[560,560)",
			"innerChanges": [
				{
					"originalRange": "[456,1 -> 539,1 EOL]",
					"modifiedRange": "[560,1 -> 560,1 EOL]"
				}
			]
		}
	],
	"moves": [
		{
			"originalRange": "[477,537)",
			"modifiedRange": "[107,165)",
			"changes": [
				{
					"originalRange": "[477,479)",
					"modifiedRange": "[107,109)",
					"innerChanges": [
						{
							"originalRange": "[477,8 -> 477,13]",
							"modifiedRange": "[107,8 -> 107,9]"
						},
						{
							"originalRange": "[478,8 -> 478,28]",
							"modifiedRange": "[108,8 -> 108,16]"
						}
					]
				},
				{
					"originalRange": "[494,495)",
					"modifiedRange": "[124,125)",
					"innerChanges": [
						{
							"originalRange": "[494,42 -> 494,62]",
							"modifiedRange": "[124,42 -> 124,50]"
						}
					]
				},
				{
					"originalRange": "[498,499)",
					"modifiedRange": "[128,129)",
					"innerChanges": [
						{
							"originalRange": "[498,139 -> 498,139]",
							"modifiedRange": "[128,139 -> 128,148]"
						}
					]
				},
				{
					"originalRange": "[500,502)",
					"modifiedRange": "[130,132)",
					"innerChanges": [
						{
							"originalRange": "[500,15 -> 500,16]",
							"modifiedRange": "[130,15 -> 130,27]"
						},
						{
							"originalRange": "[501,6 -> 501,7]",
							"modifiedRange": "[131,6 -> 131,18]"
						}
					]
				},
				{
					"originalRange": "[507,509)",
					"modifiedRange": "[137,138)",
					"innerChanges": [
						{
							"originalRange": "[507,28 -> 508,7]",
							"modifiedRange": "[137,28 -> 137,28]"
						},
						{
							"originalRange": "[508,25 -> 508,54]",
							"modifiedRange": "[137,46 -> 137,46]"
						}
					]
				},
				{
					"originalRange": "[510,511)",
					"modifiedRange": "[139,140)",
					"innerChanges": [
						{
							"originalRange": "[510,50 -> 510,51]",
							"modifiedRange": "[139,50 -> 139,62]"
						}
					]
				},
				{
					"originalRange": "[513,514)",
					"modifiedRange": "[142,143)",
					"innerChanges": [
						{
							"originalRange": "[513,28 -> 513,48]",
							"modifiedRange": "[142,28 -> 142,36]"
						}
					]
				},
				{
					"originalRange": "[519,520)",
					"modifiedRange": "[148,149)",
					"innerChanges": [
						{
							"originalRange": "[519,21 -> 519,22]",
							"modifiedRange": "[148,21 -> 148,33]"
						}
					]
				},
				{
					"originalRange": "[525,527)",
					"modifiedRange": "[154,155)",
					"innerChanges": [
						{
							"originalRange": "[525,30 -> 526,9]",
							"modifiedRange": "[154,30 -> 154,30]"
						},
						{
							"originalRange": "[526,27 -> 526,56]",
							"modifiedRange": "[154,48 -> 154,48]"
						}
					]
				},
				{
					"originalRange": "[528,529)",
					"modifiedRange": "[156,157)",
					"innerChanges": [
						{
							"originalRange": "[528,52 -> 528,53]",
							"modifiedRange": "[156,52 -> 156,64]"
						}
					]
				},
				{
					"originalRange": "[536,537)",
					"modifiedRange": "[164,165)",
					"innerChanges": [
						{
							"originalRange": "[536,25 -> 536,25]",
							"modifiedRange": "[164,25 -> 164,26]"
						}
					]
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 254
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 254 of 552)

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

---[FILE: src/vs/editor/test/node/diffing/fixtures.test.ts]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { join, resolve } from '../../../../base/common/path.js';
import { setUnexpectedErrorHandler } from '../../../../base/common/errors.js';
import { FileAccess } from '../../../../base/common/network.js';
import { DetailedLineRangeMapping, RangeMapping } from '../../../common/diff/rangeMapping.js';
import { LegacyLinesDiffComputer } from '../../../common/diff/legacyLinesDiffComputer.js';
import { DefaultLinesDiffComputer } from '../../../common/diff/defaultLinesDiffComputer/defaultLinesDiffComputer.js';
import { Range } from '../../../common/core/range.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { TextReplacement, TextEdit } from '../../../common/core/edits/textEdit.js';
import { AbstractText, ArrayText } from '../../../common/core/text/abstractText.js';
import { LinesDiff } from '../../../common/diff/linesDiffComputer.js';

suite('diffing fixtures', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		setUnexpectedErrorHandler(e => {
			throw e;
		});
	});


	const fixturesOutDir = FileAccess.asFileUri('vs/editor/test/node/diffing/fixtures').fsPath;
	// We want the dir in src, so we can directly update the source files if they disagree and create invalid files to capture the previous state.
	// This makes it very easy to update the fixtures.
	const fixturesSrcDir = resolve(fixturesOutDir).replaceAll('\\', '/').replace('/out/vs/editor/', '/src/vs/editor/');
	const folders = readdirSync(fixturesSrcDir);

	function runTest(folder: string, diffingAlgoName: 'legacy' | 'advanced') {
		const folderPath = join(fixturesSrcDir, folder);
		const files = readdirSync(folderPath);

		const firstFileName = files.find(f => f.startsWith('1.'))!;
		const secondFileName = files.find(f => f.startsWith('2.'))!;

		const firstContent = readFileSync(join(folderPath, firstFileName), 'utf8').replaceAll('\r\n', '\n').replaceAll('\r', '\n');
		const firstContentLines = firstContent.split(/\n/);
		const secondContent = readFileSync(join(folderPath, secondFileName), 'utf8').replaceAll('\r\n', '\n').replaceAll('\r', '\n');
		const secondContentLines = secondContent.split(/\n/);

		const diffingAlgo = diffingAlgoName === 'legacy' ? new LegacyLinesDiffComputer() : new DefaultLinesDiffComputer();

		const ignoreTrimWhitespace = folder.indexOf('trimws') >= 0;
		const diff = diffingAlgo.computeDiff(firstContentLines, secondContentLines, { ignoreTrimWhitespace, maxComputationTimeMs: Number.MAX_SAFE_INTEGER, computeMoves: true });

		if (diffingAlgoName === 'advanced' && !ignoreTrimWhitespace) {
			assertDiffCorrectness(diff, firstContentLines, secondContentLines);
		}

		function getDiffs(changes: readonly DetailedLineRangeMapping[]): IDetailedDiff[] {
			for (const c of changes) {
				RangeMapping.assertSorted(c.innerChanges ?? []);
			}

			return changes.map<IDetailedDiff>(c => ({
				originalRange: c.original.toString(),
				modifiedRange: c.modified.toString(),
				innerChanges: c.innerChanges?.map<IDiff>(c => ({
					originalRange: formatRange(c.originalRange, firstContentLines),
					modifiedRange: formatRange(c.modifiedRange, secondContentLines),
				})) || null
			}));
		}

		function formatRange(range: Range, lines: string[]): string {
			const toLastChar = range.endColumn === lines[range.endLineNumber - 1].length + 1;

			return '[' + range.startLineNumber + ',' + range.startColumn + ' -> ' + range.endLineNumber + ',' + range.endColumn + (toLastChar ? ' EOL' : '') + ']';
		}

		const actualDiffingResult: DiffingResult = {
			original: { content: firstContent, fileName: `./${firstFileName}` },
			modified: { content: secondContent, fileName: `./${secondFileName}` },
			diffs: getDiffs(diff.changes),
			moves: diff.moves.map(v => ({
				originalRange: v.lineRangeMapping.original.toString(),
				modifiedRange: v.lineRangeMapping.modified.toString(),
				changes: getDiffs(v.changes),
			}))
		};
		if (actualDiffingResult.moves?.length === 0) {
			delete actualDiffingResult.moves;
		}

		const expectedFilePath = join(folderPath, `${diffingAlgoName}.expected.diff.json`);
		const invalidFilePath = join(folderPath, `${diffingAlgoName}.invalid.diff.json`);

		const actualJsonStr = JSON.stringify(actualDiffingResult, null, '\t');

		if (!existsSync(expectedFilePath)) {
			// New test, create expected file
			writeFileSync(expectedFilePath, actualJsonStr);
			// Create invalid file so that this test fails on a re-run
			writeFileSync(invalidFilePath, '');
			throw new Error('No expected file! Expected and invalid files were written. Delete the invalid file to make the test pass.');
		} if (existsSync(invalidFilePath)) {
			const invalidJsonStr = readFileSync(invalidFilePath, 'utf8');
			if (invalidJsonStr === '') {
				// Update expected file
				writeFileSync(expectedFilePath, actualJsonStr);
				throw new Error(`Delete the invalid ${invalidFilePath} file to make the test pass.`);
			} else {
				const expectedFileDiffResult: DiffingResult = JSON.parse(invalidJsonStr);
				try {
					assert.deepStrictEqual(actualDiffingResult, expectedFileDiffResult);
				} catch (e) {
					writeFileSync(expectedFilePath, actualJsonStr);
					throw e;
				}
				// Test succeeded with the invalid file, restore expected file from invalid
				writeFileSync(expectedFilePath, invalidJsonStr);
				rmSync(invalidFilePath);
			}
		} else {
			const expectedJsonStr = readFileSync(expectedFilePath, 'utf8');
			const expectedFileDiffResult: DiffingResult = JSON.parse(expectedJsonStr);
			try {
				assert.deepStrictEqual(actualDiffingResult, expectedFileDiffResult);
			} catch (e) {
				// Backup expected file
				writeFileSync(invalidFilePath, expectedJsonStr);
				// Update expected file
				writeFileSync(expectedFilePath, actualJsonStr);
				throw e;
			}
		}
	}

	test(`test`, () => {
		runTest('invalid-diff-trimws', 'advanced');
	});

	for (const folder of folders) {
		for (const diffingAlgoName of ['legacy', 'advanced'] as const) {
			test(`${folder}-${diffingAlgoName}`, () => {
				runTest(folder, diffingAlgoName);
			});
		}
	}
});

interface DiffingResult {
	original: { content: string; fileName: string };
	modified: { content: string; fileName: string };

	diffs: IDetailedDiff[];
	moves?: IMoveInfo[];
}

interface IDetailedDiff {
	originalRange: string; // [startLineNumber, endLineNumberExclusive)
	modifiedRange: string; // [startLineNumber, endLineNumberExclusive)
	innerChanges: IDiff[] | null;
}

interface IDiff {
	originalRange: string; // [1,18 -> 1,19]
	modifiedRange: string; // [1,18 -> 1,19]
}

interface IMoveInfo {
	originalRange: string; // [startLineNumber, endLineNumberExclusive)
	modifiedRange: string; // [startLineNumber, endLineNumberExclusive)

	changes: IDetailedDiff[];
}

function assertDiffCorrectness(diff: LinesDiff, original: string[], modified: string[]) {
	const allInnerChanges = diff.changes.flatMap(c => c.innerChanges!);
	const edit = rangeMappingsToTextEdit(allInnerChanges, new ArrayText(modified));
	const result = edit.normalize().apply(new ArrayText(original));

	assert.deepStrictEqual(result, modified.join('\n'));
}

function rangeMappingsToTextEdit(rangeMappings: readonly RangeMapping[], modified: AbstractText): TextEdit {
	return new TextEdit(rangeMappings.map(m => {
		return new TextReplacement(
			m.originalRange,
			modified.getValueOfRange(m.modifiedRange)
		);
	}));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/README.md]---
Location: vscode-main/src/vs/editor/test/node/diffing/README.md

```markdown
# Diffing Fixture Tests

Every folder in `fixtures` represents a test.
The file that starts with `1.` is diffed against the file that starts with `2.`. Use `tst` instead of `ts` to avoid compiler/linter errors for typescript diff files.

* Missing `*.expected.diff.json` are created automatically (as well as an `*.invalid.diff.json` file).
* If the actual diff does not equal the expected diff, the expected file is updated automatically. The previous value of the expected file is written to `*.invalid.diff.json`.
* The test will fail if there are any `*.invalid.diff.json` files. This makes sure that the test keeps failing even if it is run a second time.

When changing the diffing algorithm, run the fixture tests, review the diff of the `*.expected.diff.json` files and delete all `*.invalid.diff.json` files.
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/bracket-aligning/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/bracket-aligning/1.tst

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CompareResult } from 'vs/base/common/arrays';
import { autorun, derived } from 'vs/base/common/observable';
import { IModelDeltaDecoration, MinimapPosition, OverviewRulerLane } from 'vs/editor/common/model';
import { localize } from 'vs/nls';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { LineRange } from 'vs/workbench/contrib/mergeEditor/browser/model/lineRange';
import { applyObservableDecorations, join } from 'vs/workbench/contrib/mergeEditor/browser/utils';
import { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from 'vs/workbench/contrib/mergeEditor/browser/view/colors';
import { CodeEditorView } from './codeEditorView';

export class ResultCodeEditorView extends CodeEditorView {
	private readonly decorations = derived('result.decorations', reader => {
		const viewModel = this.viewModel.read(reader);
		if (!viewModel) {
			return [];
		}
		const model = viewModel.model;
		const result = new Array<IModelDeltaDecoration>();

		const baseRangeWithStoreAndTouchingDiffs = join(
			model.modifiedBaseRanges.read(reader),
			model.resultDiffs.read(reader),
			(baseRange, diff) => baseRange.baseRange.touches(diff.inputRange)
				? CompareResult.neitherLessOrGreaterThan
				: LineRange.compareByStart(
					baseRange.baseRange,
					diff.inputRange
				)
		);

		const activeModifiedBaseRange = viewModel.activeModifiedBaseRange.read(reader);

		for (const m of baseRangeWithStoreAndTouchingDiffs) {
			const modifiedBaseRange = m.left;

			if (modifiedBaseRange) {
				const range = model.getRangeInResult(modifiedBaseRange.baseRange, reader).toInclusiveRange();
				if (range) {
					const blockClassNames = ['merge-editor-block'];
					const isHandled = model.isHandled(modifiedBaseRange).read(reader);
					if (isHandled) {
						blockClassNames.push('handled');
					}
					if (modifiedBaseRange === activeModifiedBaseRange) {
						blockClassNames.push('focused');
					}
					blockClassNames.push('result');

					result.push({
						range,
						options: {
							isWholeLine: true,
							blockClassName: blockClassNames.join(' '),
							description: 'Result Diff',
							minimap: {
								position: MinimapPosition.Gutter,
								color: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },
							},
							overviewRuler: {
								position: OverviewRulerLane.Center,
								color: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },
							}
						}
					});
				}
			}

			for (const diff of m.rights) {
				const range = diff.outputRange.toInclusiveRange();
				if (range) {
					result.push({
						range,
						options: {
							className: `merge-editor-diff result`,
							description: 'Merge Editor',
							isWholeLine: true,
						}
					});
				}

				if (diff.rangeMappings) {
					for (const d of diff.rangeMappings) {
						result.push({
							range: d.outputRange,
							options: {
								className: `merge-editor-diff-word result`,
								description: 'Merge Editor'
							}
						});
					}
				}
			}
		}
		return result;
	});

	constructor(
		@IInstantiationService instantiationService: IInstantiationService
	) {
		super(instantiationService);

		this._register(applyObservableDecorations(this.editor, this.decorations));


		this._register(autorun('update remainingConflicts label', reader => {
			const model = this.model.read(reader);
			if (!model) {
				return;
			}
			const count = model.unhandledConflictsCount.read(reader);

			this.htmlElements.detail.innerText = count === 1
				? localize(
					'mergeEditor.remainingConflicts',
					'{0} Conflict Remaining',
					count
				)
				: localize(
					'mergeEditor.remainingConflict',
					'{0} Conflicts Remaining ',
					count
				);

		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/bracket-aligning/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/bracket-aligning/2.tst

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CompareResult } from 'vs/base/common/arrays';
import { autorun, derived } from 'vs/base/common/observable';
import { IModelDeltaDecoration, MinimapPosition, OverviewRulerLane } from 'vs/editor/common/model';
import { localize } from 'vs/nls';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { LineRange } from 'vs/workbench/contrib/mergeEditor/browser/model/lineRange';
import { applyObservableDecorations, join } from 'vs/workbench/contrib/mergeEditor/browser/utils';
import { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from 'vs/workbench/contrib/mergeEditor/browser/view/colors';
import { CodeEditorView } from './codeEditorView';

export class ResultCodeEditorView extends CodeEditorView {
	private readonly decorations = derived('result.decorations', reader => {
		const viewModel = this.viewModel.read(reader);
		if (!viewModel) {
			return [];
		}
		const model = viewModel.model;
		const result = new Array<IModelDeltaDecoration>();

		const baseRangeWithStoreAndTouchingDiffs = join(
			model.modifiedBaseRanges.read(reader),
			model.resultDiffs.read(reader),
			(baseRange, diff) => baseRange.baseRange.touches(diff.inputRange)
				? CompareResult.neitherLessOrGreaterThan
				: LineRange.compareByStart(
					baseRange.baseRange,
					diff.inputRange
				)
		);

		const activeModifiedBaseRange = viewModel.activeModifiedBaseRange.read(reader);

		for (const m of baseRangeWithStoreAndTouchingDiffs) {
			const modifiedBaseRange = m.left;

			if (modifiedBaseRange) {
				const range = model.getRangeInResult(modifiedBaseRange.baseRange, reader).toInclusiveRange();
				if (range) {
					const blockClassNames = ['merge-editor-block'];
					const isHandled = model.isHandled(modifiedBaseRange).read(reader);
					if (isHandled) {
						blockClassNames.push('handled');
					}
					if (modifiedBaseRange === activeModifiedBaseRange) {
						blockClassNames.push('focused');
					}
					blockClassNames.push('result');

					result.push({
						range,
						options: {
							isWholeLine: true,
							blockClassName: blockClassNames.join(' '),
							description: 'Result Diff',
							minimap: {
								position: MinimapPosition.Gutter,
								color: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },
							},
							overviewRuler: {
								position: OverviewRulerLane.Center,
								color: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },
							}
						}
					});
				}
			}


			if (!modifiedBaseRange || modifiedBaseRange.isConflicting) {
				for (const diff of m.rights) {
					const range = diff.outputRange.toInclusiveRange();
					if (range) {
						result.push({
							range,
							options: {
								className: `merge-editor-diff result`,
								description: 'Merge Editor',
								isWholeLine: true,
							}
						});
					}

					if (diff.rangeMappings) {
						for (const d of diff.rangeMappings) {
							result.push({
								range: d.outputRange,
								options: {
									className: `merge-editor-diff-word result`,
									description: 'Merge Editor'
								}
							});
						}
					}
				}
			}
		}
		return result;
	});

	constructor(
		@IInstantiationService instantiationService: IInstantiationService
	) {
		super(instantiationService);

		this._register(applyObservableDecorations(this.editor, this.decorations));


		this._register(autorun('update remainingConflicts label', reader => {
			const model = this.model.read(reader);
			if (!model) {
				return;
			}
			const count = model.unhandledConflictsCount.read(reader);

			this.htmlElements.detail.innerText = count === 1
				? localize(
					'mergeEditor.remainingConflicts',
					'{0} Conflict Remaining',
					count
				)
				: localize(
					'mergeEditor.remainingConflict',
					'{0} Conflicts Remaining ',
					count
				);

		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/bracket-aligning/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/bracket-aligning/advanced.expected.diff.json

```json
{
	"original": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { CompareResult } from 'vs/base/common/arrays';\nimport { autorun, derived } from 'vs/base/common/observable';\nimport { IModelDeltaDecoration, MinimapPosition, OverviewRulerLane } from 'vs/editor/common/model';\nimport { localize } from 'vs/nls';\nimport { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';\nimport { LineRange } from 'vs/workbench/contrib/mergeEditor/browser/model/lineRange';\nimport { applyObservableDecorations, join } from 'vs/workbench/contrib/mergeEditor/browser/utils';\nimport { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from 'vs/workbench/contrib/mergeEditor/browser/view/colors';\nimport { CodeEditorView } from './codeEditorView';\n\nexport class ResultCodeEditorView extends CodeEditorView {\n\tprivate readonly decorations = derived('result.decorations', reader => {\n\t\tconst viewModel = this.viewModel.read(reader);\n\t\tif (!viewModel) {\n\t\t\treturn [];\n\t\t}\n\t\tconst model = viewModel.model;\n\t\tconst result = new Array<IModelDeltaDecoration>();\n\n\t\tconst baseRangeWithStoreAndTouchingDiffs = join(\n\t\t\tmodel.modifiedBaseRanges.read(reader),\n\t\t\tmodel.resultDiffs.read(reader),\n\t\t\t(baseRange, diff) => baseRange.baseRange.touches(diff.inputRange)\n\t\t\t\t? CompareResult.neitherLessOrGreaterThan\n\t\t\t\t: LineRange.compareByStart(\n\t\t\t\t\tbaseRange.baseRange,\n\t\t\t\t\tdiff.inputRange\n\t\t\t\t)\n\t\t);\n\n\t\tconst activeModifiedBaseRange = viewModel.activeModifiedBaseRange.read(reader);\n\n\t\tfor (const m of baseRangeWithStoreAndTouchingDiffs) {\n\t\t\tconst modifiedBaseRange = m.left;\n\n\t\t\tif (modifiedBaseRange) {\n\t\t\t\tconst range = model.getRangeInResult(modifiedBaseRange.baseRange, reader).toInclusiveRange();\n\t\t\t\tif (range) {\n\t\t\t\t\tconst blockClassNames = ['merge-editor-block'];\n\t\t\t\t\tconst isHandled = model.isHandled(modifiedBaseRange).read(reader);\n\t\t\t\t\tif (isHandled) {\n\t\t\t\t\t\tblockClassNames.push('handled');\n\t\t\t\t\t}\n\t\t\t\t\tif (modifiedBaseRange === activeModifiedBaseRange) {\n\t\t\t\t\t\tblockClassNames.push('focused');\n\t\t\t\t\t}\n\t\t\t\t\tblockClassNames.push('result');\n\n\t\t\t\t\tresult.push({\n\t\t\t\t\t\trange,\n\t\t\t\t\t\toptions: {\n\t\t\t\t\t\t\tisWholeLine: true,\n\t\t\t\t\t\t\tblockClassName: blockClassNames.join(' '),\n\t\t\t\t\t\t\tdescription: 'Result Diff',\n\t\t\t\t\t\t\tminimap: {\n\t\t\t\t\t\t\t\tposition: MinimapPosition.Gutter,\n\t\t\t\t\t\t\t\tcolor: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\toverviewRuler: {\n\t\t\t\t\t\t\t\tposition: OverviewRulerLane.Center,\n\t\t\t\t\t\t\t\tcolor: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tfor (const diff of m.rights) {\n\t\t\t\tconst range = diff.outputRange.toInclusiveRange();\n\t\t\t\tif (range) {\n\t\t\t\t\tresult.push({\n\t\t\t\t\t\trange,\n\t\t\t\t\t\toptions: {\n\t\t\t\t\t\t\tclassName: `merge-editor-diff result`,\n\t\t\t\t\t\t\tdescription: 'Merge Editor',\n\t\t\t\t\t\t\tisWholeLine: true,\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t}\n\n\t\t\t\tif (diff.rangeMappings) {\n\t\t\t\t\tfor (const d of diff.rangeMappings) {\n\t\t\t\t\t\tresult.push({\n\t\t\t\t\t\t\trange: d.outputRange,\n\t\t\t\t\t\t\toptions: {\n\t\t\t\t\t\t\t\tclassName: `merge-editor-diff-word result`,\n\t\t\t\t\t\t\t\tdescription: 'Merge Editor'\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\treturn result;\n\t});\n\n\tconstructor(\n\t\t@IInstantiationService instantiationService: IInstantiationService\n\t) {\n\t\tsuper(instantiationService);\n\n\t\tthis._register(applyObservableDecorations(this.editor, this.decorations));\n\n\n\t\tthis._register(autorun('update remainingConflicts label', reader => {\n\t\t\tconst model = this.model.read(reader);\n\t\t\tif (!model) {\n\t\t\t\treturn;\n\t\t\t}\n\t\t\tconst count = model.unhandledConflictsCount.read(reader);\n\n\t\t\tthis.htmlElements.detail.innerText = count === 1\n\t\t\t\t? localize(\n\t\t\t\t\t'mergeEditor.remainingConflicts',\n\t\t\t\t\t'{0} Conflict Remaining',\n\t\t\t\t\tcount\n\t\t\t\t)\n\t\t\t\t: localize(\n\t\t\t\t\t'mergeEditor.remainingConflict',\n\t\t\t\t\t'{0} Conflicts Remaining ',\n\t\t\t\t\tcount\n\t\t\t\t);\n\n\t\t}));\n\t}\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { CompareResult } from 'vs/base/common/arrays';\nimport { autorun, derived } from 'vs/base/common/observable';\nimport { IModelDeltaDecoration, MinimapPosition, OverviewRulerLane } from 'vs/editor/common/model';\nimport { localize } from 'vs/nls';\nimport { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';\nimport { LineRange } from 'vs/workbench/contrib/mergeEditor/browser/model/lineRange';\nimport { applyObservableDecorations, join } from 'vs/workbench/contrib/mergeEditor/browser/utils';\nimport { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from 'vs/workbench/contrib/mergeEditor/browser/view/colors';\nimport { CodeEditorView } from './codeEditorView';\n\nexport class ResultCodeEditorView extends CodeEditorView {\n\tprivate readonly decorations = derived('result.decorations', reader => {\n\t\tconst viewModel = this.viewModel.read(reader);\n\t\tif (!viewModel) {\n\t\t\treturn [];\n\t\t}\n\t\tconst model = viewModel.model;\n\t\tconst result = new Array<IModelDeltaDecoration>();\n\n\t\tconst baseRangeWithStoreAndTouchingDiffs = join(\n\t\t\tmodel.modifiedBaseRanges.read(reader),\n\t\t\tmodel.resultDiffs.read(reader),\n\t\t\t(baseRange, diff) => baseRange.baseRange.touches(diff.inputRange)\n\t\t\t\t? CompareResult.neitherLessOrGreaterThan\n\t\t\t\t: LineRange.compareByStart(\n\t\t\t\t\tbaseRange.baseRange,\n\t\t\t\t\tdiff.inputRange\n\t\t\t\t)\n\t\t);\n\n\t\tconst activeModifiedBaseRange = viewModel.activeModifiedBaseRange.read(reader);\n\n\t\tfor (const m of baseRangeWithStoreAndTouchingDiffs) {\n\t\t\tconst modifiedBaseRange = m.left;\n\n\t\t\tif (modifiedBaseRange) {\n\t\t\t\tconst range = model.getRangeInResult(modifiedBaseRange.baseRange, reader).toInclusiveRange();\n\t\t\t\tif (range) {\n\t\t\t\t\tconst blockClassNames = ['merge-editor-block'];\n\t\t\t\t\tconst isHandled = model.isHandled(modifiedBaseRange).read(reader);\n\t\t\t\t\tif (isHandled) {\n\t\t\t\t\t\tblockClassNames.push('handled');\n\t\t\t\t\t}\n\t\t\t\t\tif (modifiedBaseRange === activeModifiedBaseRange) {\n\t\t\t\t\t\tblockClassNames.push('focused');\n\t\t\t\t\t}\n\t\t\t\t\tblockClassNames.push('result');\n\n\t\t\t\t\tresult.push({\n\t\t\t\t\t\trange,\n\t\t\t\t\t\toptions: {\n\t\t\t\t\t\t\tisWholeLine: true,\n\t\t\t\t\t\t\tblockClassName: blockClassNames.join(' '),\n\t\t\t\t\t\t\tdescription: 'Result Diff',\n\t\t\t\t\t\t\tminimap: {\n\t\t\t\t\t\t\t\tposition: MinimapPosition.Gutter,\n\t\t\t\t\t\t\t\tcolor: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\toverviewRuler: {\n\t\t\t\t\t\t\t\tposition: OverviewRulerLane.Center,\n\t\t\t\t\t\t\t\tcolor: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t}\n\n\n\t\t\tif (!modifiedBaseRange || modifiedBaseRange.isConflicting) {\n\t\t\t\tfor (const diff of m.rights) {\n\t\t\t\t\tconst range = diff.outputRange.toInclusiveRange();\n\t\t\t\t\tif (range) {\n\t\t\t\t\t\tresult.push({\n\t\t\t\t\t\t\trange,\n\t\t\t\t\t\t\toptions: {\n\t\t\t\t\t\t\t\tclassName: `merge-editor-diff result`,\n\t\t\t\t\t\t\t\tdescription: 'Merge Editor',\n\t\t\t\t\t\t\t\tisWholeLine: true,\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\n\t\t\t\t\tif (diff.rangeMappings) {\n\t\t\t\t\t\tfor (const d of diff.rangeMappings) {\n\t\t\t\t\t\t\tresult.push({\n\t\t\t\t\t\t\t\trange: d.outputRange,\n\t\t\t\t\t\t\t\toptions: {\n\t\t\t\t\t\t\t\t\tclassName: `merge-editor-diff-word result`,\n\t\t\t\t\t\t\t\t\tdescription: 'Merge Editor'\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\treturn result;\n\t});\n\n\tconstructor(\n\t\t@IInstantiationService instantiationService: IInstantiationService\n\t) {\n\t\tsuper(instantiationService);\n\n\t\tthis._register(applyObservableDecorations(this.editor, this.decorations));\n\n\n\t\tthis._register(autorun('update remainingConflicts label', reader => {\n\t\t\tconst model = this.model.read(reader);\n\t\t\tif (!model) {\n\t\t\t\treturn;\n\t\t\t}\n\t\t\tconst count = model.unhandledConflictsCount.read(reader);\n\n\t\t\tthis.htmlElements.detail.innerText = count === 1\n\t\t\t\t? localize(\n\t\t\t\t\t'mergeEditor.remainingConflicts',\n\t\t\t\t\t'{0} Conflict Remaining',\n\t\t\t\t\tcount\n\t\t\t\t)\n\t\t\t\t: localize(\n\t\t\t\t\t'mergeEditor.remainingConflict',\n\t\t\t\t\t'{0} Conflicts Remaining ',\n\t\t\t\t\tcount\n\t\t\t\t);\n\n\t\t}));\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[73,85)",
			"modifiedRange": "[73,87)",
			"innerChanges": [
				{
					"originalRange": "[73,1 -> 73,1]",
					"modifiedRange": "[73,1 -> 75,1]"
				},
				{
					"originalRange": "[73,1 -> 73,1]",
					"modifiedRange": "[75,1 -> 75,2]"
				},
				{
					"originalRange": "[74,1 -> 74,1]",
					"modifiedRange": "[76,1 -> 76,2]"
				},
				{
					"originalRange": "[75,1 -> 75,1]",
					"modifiedRange": "[77,1 -> 77,2]"
				},
				{
					"originalRange": "[76,1 -> 76,1]",
					"modifiedRange": "[78,1 -> 78,2]"
				},
				{
					"originalRange": "[77,1 -> 77,1]",
					"modifiedRange": "[79,1 -> 79,2]"
				},
				{
					"originalRange": "[78,1 -> 78,1]",
					"modifiedRange": "[80,1 -> 80,2]"
				},
				{
					"originalRange": "[79,1 -> 79,1]",
					"modifiedRange": "[81,1 -> 81,2]"
				},
				{
					"originalRange": "[80,1 -> 80,1]",
					"modifiedRange": "[82,1 -> 82,2]"
				},
				{
					"originalRange": "[81,1 -> 81,1]",
					"modifiedRange": "[83,1 -> 83,2]"
				},
				{
					"originalRange": "[82,1 -> 82,1]",
					"modifiedRange": "[84,1 -> 84,2]"
				},
				{
					"originalRange": "[83,1 -> 83,1]",
					"modifiedRange": "[85,1 -> 85,2]"
				},
				{
					"originalRange": "[84,1 -> 84,1]",
					"modifiedRange": "[86,1 -> 86,2]"
				}
			]
		},
		{
			"originalRange": "[86,95)",
			"modifiedRange": "[88,98)",
			"innerChanges": [
				{
					"originalRange": "[86,1 -> 86,1]",
					"modifiedRange": "[88,1 -> 88,2]"
				},
				{
					"originalRange": "[87,1 -> 87,1]",
					"modifiedRange": "[89,1 -> 89,2]"
				},
				{
					"originalRange": "[88,1 -> 88,1]",
					"modifiedRange": "[90,1 -> 90,2]"
				},
				{
					"originalRange": "[89,1 -> 89,1]",
					"modifiedRange": "[91,1 -> 91,2]"
				},
				{
					"originalRange": "[90,1 -> 90,1]",
					"modifiedRange": "[92,1 -> 92,2]"
				},
				{
					"originalRange": "[91,1 -> 91,1]",
					"modifiedRange": "[93,1 -> 93,2]"
				},
				{
					"originalRange": "[92,1 -> 92,1]",
					"modifiedRange": "[94,1 -> 94,2]"
				},
				{
					"originalRange": "[93,1 -> 93,1]",
					"modifiedRange": "[95,1 -> 95,2]"
				},
				{
					"originalRange": "[94,1 -> 94,1]",
					"modifiedRange": "[96,1 -> 96,2]"
				},
				{
					"originalRange": "[95,1 -> 95,1]",
					"modifiedRange": "[97,1 -> 98,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/bracket-aligning/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/bracket-aligning/legacy.expected.diff.json

```json
{
	"original": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { CompareResult } from 'vs/base/common/arrays';\nimport { autorun, derived } from 'vs/base/common/observable';\nimport { IModelDeltaDecoration, MinimapPosition, OverviewRulerLane } from 'vs/editor/common/model';\nimport { localize } from 'vs/nls';\nimport { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';\nimport { LineRange } from 'vs/workbench/contrib/mergeEditor/browser/model/lineRange';\nimport { applyObservableDecorations, join } from 'vs/workbench/contrib/mergeEditor/browser/utils';\nimport { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from 'vs/workbench/contrib/mergeEditor/browser/view/colors';\nimport { CodeEditorView } from './codeEditorView';\n\nexport class ResultCodeEditorView extends CodeEditorView {\n\tprivate readonly decorations = derived('result.decorations', reader => {\n\t\tconst viewModel = this.viewModel.read(reader);\n\t\tif (!viewModel) {\n\t\t\treturn [];\n\t\t}\n\t\tconst model = viewModel.model;\n\t\tconst result = new Array<IModelDeltaDecoration>();\n\n\t\tconst baseRangeWithStoreAndTouchingDiffs = join(\n\t\t\tmodel.modifiedBaseRanges.read(reader),\n\t\t\tmodel.resultDiffs.read(reader),\n\t\t\t(baseRange, diff) => baseRange.baseRange.touches(diff.inputRange)\n\t\t\t\t? CompareResult.neitherLessOrGreaterThan\n\t\t\t\t: LineRange.compareByStart(\n\t\t\t\t\tbaseRange.baseRange,\n\t\t\t\t\tdiff.inputRange\n\t\t\t\t)\n\t\t);\n\n\t\tconst activeModifiedBaseRange = viewModel.activeModifiedBaseRange.read(reader);\n\n\t\tfor (const m of baseRangeWithStoreAndTouchingDiffs) {\n\t\t\tconst modifiedBaseRange = m.left;\n\n\t\t\tif (modifiedBaseRange) {\n\t\t\t\tconst range = model.getRangeInResult(modifiedBaseRange.baseRange, reader).toInclusiveRange();\n\t\t\t\tif (range) {\n\t\t\t\t\tconst blockClassNames = ['merge-editor-block'];\n\t\t\t\t\tconst isHandled = model.isHandled(modifiedBaseRange).read(reader);\n\t\t\t\t\tif (isHandled) {\n\t\t\t\t\t\tblockClassNames.push('handled');\n\t\t\t\t\t}\n\t\t\t\t\tif (modifiedBaseRange === activeModifiedBaseRange) {\n\t\t\t\t\t\tblockClassNames.push('focused');\n\t\t\t\t\t}\n\t\t\t\t\tblockClassNames.push('result');\n\n\t\t\t\t\tresult.push({\n\t\t\t\t\t\trange,\n\t\t\t\t\t\toptions: {\n\t\t\t\t\t\t\tisWholeLine: true,\n\t\t\t\t\t\t\tblockClassName: blockClassNames.join(' '),\n\t\t\t\t\t\t\tdescription: 'Result Diff',\n\t\t\t\t\t\t\tminimap: {\n\t\t\t\t\t\t\t\tposition: MinimapPosition.Gutter,\n\t\t\t\t\t\t\t\tcolor: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\toverviewRuler: {\n\t\t\t\t\t\t\t\tposition: OverviewRulerLane.Center,\n\t\t\t\t\t\t\t\tcolor: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tfor (const diff of m.rights) {\n\t\t\t\tconst range = diff.outputRange.toInclusiveRange();\n\t\t\t\tif (range) {\n\t\t\t\t\tresult.push({\n\t\t\t\t\t\trange,\n\t\t\t\t\t\toptions: {\n\t\t\t\t\t\t\tclassName: `merge-editor-diff result`,\n\t\t\t\t\t\t\tdescription: 'Merge Editor',\n\t\t\t\t\t\t\tisWholeLine: true,\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t}\n\n\t\t\t\tif (diff.rangeMappings) {\n\t\t\t\t\tfor (const d of diff.rangeMappings) {\n\t\t\t\t\t\tresult.push({\n\t\t\t\t\t\t\trange: d.outputRange,\n\t\t\t\t\t\t\toptions: {\n\t\t\t\t\t\t\t\tclassName: `merge-editor-diff-word result`,\n\t\t\t\t\t\t\t\tdescription: 'Merge Editor'\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\treturn result;\n\t});\n\n\tconstructor(\n\t\t@IInstantiationService instantiationService: IInstantiationService\n\t) {\n\t\tsuper(instantiationService);\n\n\t\tthis._register(applyObservableDecorations(this.editor, this.decorations));\n\n\n\t\tthis._register(autorun('update remainingConflicts label', reader => {\n\t\t\tconst model = this.model.read(reader);\n\t\t\tif (!model) {\n\t\t\t\treturn;\n\t\t\t}\n\t\t\tconst count = model.unhandledConflictsCount.read(reader);\n\n\t\t\tthis.htmlElements.detail.innerText = count === 1\n\t\t\t\t? localize(\n\t\t\t\t\t'mergeEditor.remainingConflicts',\n\t\t\t\t\t'{0} Conflict Remaining',\n\t\t\t\t\tcount\n\t\t\t\t)\n\t\t\t\t: localize(\n\t\t\t\t\t'mergeEditor.remainingConflict',\n\t\t\t\t\t'{0} Conflicts Remaining ',\n\t\t\t\t\tcount\n\t\t\t\t);\n\n\t\t}));\n\t}\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { CompareResult } from 'vs/base/common/arrays';\nimport { autorun, derived } from 'vs/base/common/observable';\nimport { IModelDeltaDecoration, MinimapPosition, OverviewRulerLane } from 'vs/editor/common/model';\nimport { localize } from 'vs/nls';\nimport { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';\nimport { LineRange } from 'vs/workbench/contrib/mergeEditor/browser/model/lineRange';\nimport { applyObservableDecorations, join } from 'vs/workbench/contrib/mergeEditor/browser/utils';\nimport { handledConflictMinimapOverViewRulerColor, unhandledConflictMinimapOverViewRulerColor } from 'vs/workbench/contrib/mergeEditor/browser/view/colors';\nimport { CodeEditorView } from './codeEditorView';\n\nexport class ResultCodeEditorView extends CodeEditorView {\n\tprivate readonly decorations = derived('result.decorations', reader => {\n\t\tconst viewModel = this.viewModel.read(reader);\n\t\tif (!viewModel) {\n\t\t\treturn [];\n\t\t}\n\t\tconst model = viewModel.model;\n\t\tconst result = new Array<IModelDeltaDecoration>();\n\n\t\tconst baseRangeWithStoreAndTouchingDiffs = join(\n\t\t\tmodel.modifiedBaseRanges.read(reader),\n\t\t\tmodel.resultDiffs.read(reader),\n\t\t\t(baseRange, diff) => baseRange.baseRange.touches(diff.inputRange)\n\t\t\t\t? CompareResult.neitherLessOrGreaterThan\n\t\t\t\t: LineRange.compareByStart(\n\t\t\t\t\tbaseRange.baseRange,\n\t\t\t\t\tdiff.inputRange\n\t\t\t\t)\n\t\t);\n\n\t\tconst activeModifiedBaseRange = viewModel.activeModifiedBaseRange.read(reader);\n\n\t\tfor (const m of baseRangeWithStoreAndTouchingDiffs) {\n\t\t\tconst modifiedBaseRange = m.left;\n\n\t\t\tif (modifiedBaseRange) {\n\t\t\t\tconst range = model.getRangeInResult(modifiedBaseRange.baseRange, reader).toInclusiveRange();\n\t\t\t\tif (range) {\n\t\t\t\t\tconst blockClassNames = ['merge-editor-block'];\n\t\t\t\t\tconst isHandled = model.isHandled(modifiedBaseRange).read(reader);\n\t\t\t\t\tif (isHandled) {\n\t\t\t\t\t\tblockClassNames.push('handled');\n\t\t\t\t\t}\n\t\t\t\t\tif (modifiedBaseRange === activeModifiedBaseRange) {\n\t\t\t\t\t\tblockClassNames.push('focused');\n\t\t\t\t\t}\n\t\t\t\t\tblockClassNames.push('result');\n\n\t\t\t\t\tresult.push({\n\t\t\t\t\t\trange,\n\t\t\t\t\t\toptions: {\n\t\t\t\t\t\t\tisWholeLine: true,\n\t\t\t\t\t\t\tblockClassName: blockClassNames.join(' '),\n\t\t\t\t\t\t\tdescription: 'Result Diff',\n\t\t\t\t\t\t\tminimap: {\n\t\t\t\t\t\t\t\tposition: MinimapPosition.Gutter,\n\t\t\t\t\t\t\t\tcolor: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\toverviewRuler: {\n\t\t\t\t\t\t\t\tposition: OverviewRulerLane.Center,\n\t\t\t\t\t\t\t\tcolor: { id: isHandled ? handledConflictMinimapOverViewRulerColor : unhandledConflictMinimapOverViewRulerColor },\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t}\n\n\n\t\t\tif (!modifiedBaseRange || modifiedBaseRange.isConflicting) {\n\t\t\t\tfor (const diff of m.rights) {\n\t\t\t\t\tconst range = diff.outputRange.toInclusiveRange();\n\t\t\t\t\tif (range) {\n\t\t\t\t\t\tresult.push({\n\t\t\t\t\t\t\trange,\n\t\t\t\t\t\t\toptions: {\n\t\t\t\t\t\t\t\tclassName: `merge-editor-diff result`,\n\t\t\t\t\t\t\t\tdescription: 'Merge Editor',\n\t\t\t\t\t\t\t\tisWholeLine: true,\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\n\t\t\t\t\tif (diff.rangeMappings) {\n\t\t\t\t\t\tfor (const d of diff.rangeMappings) {\n\t\t\t\t\t\t\tresult.push({\n\t\t\t\t\t\t\t\trange: d.outputRange,\n\t\t\t\t\t\t\t\toptions: {\n\t\t\t\t\t\t\t\t\tclassName: `merge-editor-diff-word result`,\n\t\t\t\t\t\t\t\t\tdescription: 'Merge Editor'\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\treturn result;\n\t});\n\n\tconstructor(\n\t\t@IInstantiationService instantiationService: IInstantiationService\n\t) {\n\t\tsuper(instantiationService);\n\n\t\tthis._register(applyObservableDecorations(this.editor, this.decorations));\n\n\n\t\tthis._register(autorun('update remainingConflicts label', reader => {\n\t\t\tconst model = this.model.read(reader);\n\t\t\tif (!model) {\n\t\t\t\treturn;\n\t\t\t}\n\t\t\tconst count = model.unhandledConflictsCount.read(reader);\n\n\t\t\tthis.htmlElements.detail.innerText = count === 1\n\t\t\t\t? localize(\n\t\t\t\t\t'mergeEditor.remainingConflicts',\n\t\t\t\t\t'{0} Conflict Remaining',\n\t\t\t\t\tcount\n\t\t\t\t)\n\t\t\t\t: localize(\n\t\t\t\t\t'mergeEditor.remainingConflict',\n\t\t\t\t\t'{0} Conflicts Remaining ',\n\t\t\t\t\tcount\n\t\t\t\t);\n\n\t\t}));\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[73,85)",
			"modifiedRange": "[73,87)",
			"innerChanges": null
		},
		{
			"originalRange": "[86,95)",
			"modifiedRange": "[88,98)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/class-replacement/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/class-replacement/1.tst

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

---[FILE: src/vs/editor/test/node/diffing/fixtures/class-replacement/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/class-replacement/2.tst

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

export class TokenizationStateStore2 {
	public invalidateEndState(lineNumber: number): void;

	public getEndState(lineNumber: number): IState;

	public setEndState(lineNumber: number, state: IState): boolean { }

	public getFirstInvalidEndStateLineNumber(): number | undefined {
	}

	public applyEdits(range: IRange, eolCount: number): void {
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

---[FILE: src/vs/editor/test/node/diffing/fixtures/class-replacement/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/class-replacement/advanced.expected.diff.json

```json
{
	"original": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport * as arrays from 'vs/base/common/arrays';\nimport { IdleDeadline, runWhenIdle } from 'vs/base/common/async';\nimport { BugIndicatingError, onUnexpectedError } from 'vs/base/common/errors';\nimport { Disposable, MutableDisposable } from 'vs/base/common/lifecycle';\nimport { setTimeout0 } from 'vs/base/common/platform';\nimport { StopWatch } from 'vs/base/common/stopwatch';\nimport { countEOL } from 'vs/editor/common/core/eolCounter';\nimport { Position } from 'vs/editor/common/core/position';\nimport { IRange } from 'vs/editor/common/core/range';\nimport { StandardTokenType } from 'vs/editor/common/encodedTokenAttributes';\nimport { EncodedTokenizationResult, IBackgroundTokenizationStore, IBackgroundTokenizer, ILanguageIdCodec, IState, ITokenizationSupport, TokenizationRegistry } from 'vs/editor/common/languages';\nimport { nullTokenizeEncoded } from 'vs/editor/common/languages/nullTokenize';\nimport { ITextModel } from 'vs/editor/common/model';\nimport { TextModel } from 'vs/editor/common/model/textModel';\nimport { TokenizationTextModelPart } from 'vs/editor/common/model/tokenizationTextModelPart';\nimport { IModelContentChangedEvent, IModelLanguageChangedEvent } from 'vs/editor/common/textModelEvents';\nimport { ContiguousMultilineTokensBuilder } from 'vs/editor/common/tokens/contiguousMultilineTokensBuilder';\nimport { LineTokens } from 'vs/editor/common/tokens/lineTokens';\n\nconst enum Constants {\n\tCHEAP_TOKENIZATION_LENGTH_LIMIT = 2048\n}\n\n/**\n * An array that avoids being sparse by always\n * filling up unused indices with a default value.\n */\nexport class ContiguousGrowingArray<T> {\n\n\tprivate _store: T[] = [];\n\n\tconstructor(\n\t\tprivate readonly _default: T\n\t) { }\n\n\tpublic get(index: number): T {\n\t\tif (index < this._store.length) {\n\t\t\treturn this._store[index];\n\t\t}\n\t\treturn this._default;\n\t}\n\n\tpublic set(index: number, value: T): void {\n\t\twhile (index >= this._store.length) {\n\t\t\tthis._store[this._store.length] = this._default;\n\t\t}\n\t\tthis._store[index] = value;\n\t}\n\n\t// TODO have `replace` instead of `delete` and `insert`\n\tpublic delete(deleteIndex: number, deleteCount: number): void {\n\t\tif (deleteCount === 0 || deleteIndex >= this._store.length) {\n\t\t\treturn;\n\t\t}\n\t\tthis._store.splice(deleteIndex, deleteCount);\n\t}\n\n\tpublic insert(insertIndex: number, insertCount: number): void {\n\t\tif (insertCount === 0 || insertIndex >= this._store.length) {\n\t\t\treturn;\n\t\t}\n\t\tconst arr: T[] = [];\n\t\tfor (let i = 0; i < insertCount; i++) {\n\t\t\tarr[i] = this._default;\n\t\t}\n\t\tthis._store = arrays.arrayInsert(this._store, insertIndex, arr);\n\t}\n}\n\n/**\n * Stores the states at the start of each line and keeps track of which lines\n * must be re-tokenized. Also uses state equality to quickly validate lines\n * that don't need to be re-tokenized.\n *\n * For example, when typing on a line, the line gets marked as needing to be tokenized.\n * Once the line is tokenized, the end state is checked for equality against the begin\n * state of the next line. If the states are equal, tokenization doesn't need to run\n * again over the rest of the file. If the states are not equal, the next line gets marked\n * as needing to be tokenized.\n */\nexport class TokenizationStateStore {\n\trequestTokens(startLineNumber: number, endLineNumberExclusive: number): void {\n\t\tfor (let lineNumber = startLineNumber; lineNumber < endLineNumberExclusive; lineNumber++) {\n\t\t\tthis._stateStore.markMustBeTokenized(lineNumber - 1);\n\t\t}\n\t}\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport * as arrays from 'vs/base/common/arrays';\nimport { IdleDeadline, runWhenIdle } from 'vs/base/common/async';\nimport { BugIndicatingError, onUnexpectedError } from 'vs/base/common/errors';\nimport { Disposable, MutableDisposable } from 'vs/base/common/lifecycle';\nimport { setTimeout0 } from 'vs/base/common/platform';\nimport { StopWatch } from 'vs/base/common/stopwatch';\nimport { countEOL } from 'vs/editor/common/core/eolCounter';\nimport { Position } from 'vs/editor/common/core/position';\nimport { IRange } from 'vs/editor/common/core/range';\nimport { StandardTokenType } from 'vs/editor/common/encodedTokenAttributes';\nimport { EncodedTokenizationResult, IBackgroundTokenizationStore, IBackgroundTokenizer, ILanguageIdCodec, IState, ITokenizationSupport, TokenizationRegistry } from 'vs/editor/common/languages';\nimport { nullTokenizeEncoded } from 'vs/editor/common/languages/nullTokenize';\nimport { ITextModel } from 'vs/editor/common/model';\nimport { TextModel } from 'vs/editor/common/model/textModel';\nimport { TokenizationTextModelPart } from 'vs/editor/common/model/tokenizationTextModelPart';\nimport { IModelContentChangedEvent, IModelLanguageChangedEvent } from 'vs/editor/common/textModelEvents';\nimport { ContiguousMultilineTokensBuilder } from 'vs/editor/common/tokens/contiguousMultilineTokensBuilder';\nimport { LineTokens } from 'vs/editor/common/tokens/lineTokens';\n\nconst enum Constants {\n\tCHEAP_TOKENIZATION_LENGTH_LIMIT = 2048\n}\n\nexport class TokenizationStateStore2 {\n\tpublic invalidateEndState(lineNumber: number): void;\n\n\tpublic getEndState(lineNumber: number): IState;\n\n\tpublic setEndState(lineNumber: number, state: IState): boolean { }\n\n\tpublic getFirstInvalidEndStateLineNumber(): number | undefined {\n\t}\n\n\tpublic applyEdits(range: IRange, eolCount: number): void {\n\t}\n}\n\n/**\n * Stores the states at the start of each line and keeps track of which lines\n * must be re-tokenized. Also uses state equality to quickly validate lines\n * that don't need to be re-tokenized.\n *\n * For example, when typing on a line, the line gets marked as needing to be tokenized.\n * Once the line is tokenized, the end state is checked for equality against the begin\n * state of the next line. If the states are equal, tokenization doesn't need to run\n * again over the rest of the file. If the states are not equal, the next line gets marked\n * as needing to be tokenized.\n */\nexport class TokenizationStateStore {\n\trequestTokens(startLineNumber: number, endLineNumberExclusive: number): void {\n\t\tfor (let lineNumber = startLineNumber; lineNumber < endLineNumberExclusive; lineNumber++) {\n\t\t\tthis._stateStore.markMustBeTokenized(lineNumber - 1);\n\t\t}\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[29,61)",
			"modifiedRange": "[29,37)",
			"innerChanges": [
				{
					"originalRange": "[29,1 -> 61,1]",
					"modifiedRange": "[29,1 -> 37,1]"
				}
			]
		},
		{
			"originalRange": "[63,72)",
			"modifiedRange": "[39,40)",
			"innerChanges": [
				{
					"originalRange": "[63,9 -> 63,48]",
					"modifiedRange": "[39,9 -> 39,43]"
				},
				{
					"originalRange": "[64,1 -> 72,1]",
					"modifiedRange": "[40,1 -> 40,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/class-replacement/advanced.human.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/class-replacement/advanced.human.diff.json

```json
{
	"originalFileName": "./1.tst",
	"modifiedFileName": "./2.tst",
	"diffs": [
		{
			"originalRange": "[29,74)",
			"modifiedRange": "[29,42)",
			"innerChanges": [
				{
					"originalRange": "[29,1 -> 74,1]",
					"modifiedRange": "[29,1 -> 42,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/class-replacement/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/class-replacement/legacy.expected.diff.json

```json
{
	"original": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport * as arrays from 'vs/base/common/arrays';\nimport { IdleDeadline, runWhenIdle } from 'vs/base/common/async';\nimport { BugIndicatingError, onUnexpectedError } from 'vs/base/common/errors';\nimport { Disposable, MutableDisposable } from 'vs/base/common/lifecycle';\nimport { setTimeout0 } from 'vs/base/common/platform';\nimport { StopWatch } from 'vs/base/common/stopwatch';\nimport { countEOL } from 'vs/editor/common/core/eolCounter';\nimport { Position } from 'vs/editor/common/core/position';\nimport { IRange } from 'vs/editor/common/core/range';\nimport { StandardTokenType } from 'vs/editor/common/encodedTokenAttributes';\nimport { EncodedTokenizationResult, IBackgroundTokenizationStore, IBackgroundTokenizer, ILanguageIdCodec, IState, ITokenizationSupport, TokenizationRegistry } from 'vs/editor/common/languages';\nimport { nullTokenizeEncoded } from 'vs/editor/common/languages/nullTokenize';\nimport { ITextModel } from 'vs/editor/common/model';\nimport { TextModel } from 'vs/editor/common/model/textModel';\nimport { TokenizationTextModelPart } from 'vs/editor/common/model/tokenizationTextModelPart';\nimport { IModelContentChangedEvent, IModelLanguageChangedEvent } from 'vs/editor/common/textModelEvents';\nimport { ContiguousMultilineTokensBuilder } from 'vs/editor/common/tokens/contiguousMultilineTokensBuilder';\nimport { LineTokens } from 'vs/editor/common/tokens/lineTokens';\n\nconst enum Constants {\n\tCHEAP_TOKENIZATION_LENGTH_LIMIT = 2048\n}\n\n/**\n * An array that avoids being sparse by always\n * filling up unused indices with a default value.\n */\nexport class ContiguousGrowingArray<T> {\n\n\tprivate _store: T[] = [];\n\n\tconstructor(\n\t\tprivate readonly _default: T\n\t) { }\n\n\tpublic get(index: number): T {\n\t\tif (index < this._store.length) {\n\t\t\treturn this._store[index];\n\t\t}\n\t\treturn this._default;\n\t}\n\n\tpublic set(index: number, value: T): void {\n\t\twhile (index >= this._store.length) {\n\t\t\tthis._store[this._store.length] = this._default;\n\t\t}\n\t\tthis._store[index] = value;\n\t}\n\n\t// TODO have `replace` instead of `delete` and `insert`\n\tpublic delete(deleteIndex: number, deleteCount: number): void {\n\t\tif (deleteCount === 0 || deleteIndex >= this._store.length) {\n\t\t\treturn;\n\t\t}\n\t\tthis._store.splice(deleteIndex, deleteCount);\n\t}\n\n\tpublic insert(insertIndex: number, insertCount: number): void {\n\t\tif (insertCount === 0 || insertIndex >= this._store.length) {\n\t\t\treturn;\n\t\t}\n\t\tconst arr: T[] = [];\n\t\tfor (let i = 0; i < insertCount; i++) {\n\t\t\tarr[i] = this._default;\n\t\t}\n\t\tthis._store = arrays.arrayInsert(this._store, insertIndex, arr);\n\t}\n}\n\n/**\n * Stores the states at the start of each line and keeps track of which lines\n * must be re-tokenized. Also uses state equality to quickly validate lines\n * that don't need to be re-tokenized.\n *\n * For example, when typing on a line, the line gets marked as needing to be tokenized.\n * Once the line is tokenized, the end state is checked for equality against the begin\n * state of the next line. If the states are equal, tokenization doesn't need to run\n * again over the rest of the file. If the states are not equal, the next line gets marked\n * as needing to be tokenized.\n */\nexport class TokenizationStateStore {\n\trequestTokens(startLineNumber: number, endLineNumberExclusive: number): void {\n\t\tfor (let lineNumber = startLineNumber; lineNumber < endLineNumberExclusive; lineNumber++) {\n\t\t\tthis._stateStore.markMustBeTokenized(lineNumber - 1);\n\t\t}\n\t}\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport * as arrays from 'vs/base/common/arrays';\nimport { IdleDeadline, runWhenIdle } from 'vs/base/common/async';\nimport { BugIndicatingError, onUnexpectedError } from 'vs/base/common/errors';\nimport { Disposable, MutableDisposable } from 'vs/base/common/lifecycle';\nimport { setTimeout0 } from 'vs/base/common/platform';\nimport { StopWatch } from 'vs/base/common/stopwatch';\nimport { countEOL } from 'vs/editor/common/core/eolCounter';\nimport { Position } from 'vs/editor/common/core/position';\nimport { IRange } from 'vs/editor/common/core/range';\nimport { StandardTokenType } from 'vs/editor/common/encodedTokenAttributes';\nimport { EncodedTokenizationResult, IBackgroundTokenizationStore, IBackgroundTokenizer, ILanguageIdCodec, IState, ITokenizationSupport, TokenizationRegistry } from 'vs/editor/common/languages';\nimport { nullTokenizeEncoded } from 'vs/editor/common/languages/nullTokenize';\nimport { ITextModel } from 'vs/editor/common/model';\nimport { TextModel } from 'vs/editor/common/model/textModel';\nimport { TokenizationTextModelPart } from 'vs/editor/common/model/tokenizationTextModelPart';\nimport { IModelContentChangedEvent, IModelLanguageChangedEvent } from 'vs/editor/common/textModelEvents';\nimport { ContiguousMultilineTokensBuilder } from 'vs/editor/common/tokens/contiguousMultilineTokensBuilder';\nimport { LineTokens } from 'vs/editor/common/tokens/lineTokens';\n\nconst enum Constants {\n\tCHEAP_TOKENIZATION_LENGTH_LIMIT = 2048\n}\n\nexport class TokenizationStateStore2 {\n\tpublic invalidateEndState(lineNumber: number): void;\n\n\tpublic getEndState(lineNumber: number): IState;\n\n\tpublic setEndState(lineNumber: number, state: IState): boolean { }\n\n\tpublic getFirstInvalidEndStateLineNumber(): number | undefined {\n\t}\n\n\tpublic applyEdits(range: IRange, eolCount: number): void {\n\t}\n}\n\n/**\n * Stores the states at the start of each line and keeps track of which lines\n * must be re-tokenized. Also uses state equality to quickly validate lines\n * that don't need to be re-tokenized.\n *\n * For example, when typing on a line, the line gets marked as needing to be tokenized.\n * Once the line is tokenized, the end state is checked for equality against the begin\n * state of the next line. If the states are equal, tokenization doesn't need to run\n * again over the rest of the file. If the states are not equal, the next line gets marked\n * as needing to be tokenized.\n */\nexport class TokenizationStateStore {\n\trequestTokens(startLineNumber: number, endLineNumberExclusive: number): void {\n\t\tfor (let lineNumber = startLineNumber; lineNumber < endLineNumberExclusive; lineNumber++) {\n\t\t\tthis._stateStore.markMustBeTokenized(lineNumber - 1);\n\t\t}\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[29,34)",
			"modifiedRange": "[29,31)",
			"innerChanges": [
				{
					"originalRange": "[29,1 -> 33,41 EOL]",
					"modifiedRange": "[29,1 -> 30,54 EOL]"
				}
			]
		},
		{
			"originalRange": "[35,36)",
			"modifiedRange": "[32,33)",
			"innerChanges": [
				{
					"originalRange": "[35,3 -> 35,6]",
					"modifiedRange": "[32,3 -> 32,17]"
				},
				{
					"originalRange": "[35,9 -> 35,26]",
					"modifiedRange": "[32,20 -> 32,48]"
				}
			]
		},
		{
			"originalRange": "[37,40)",
			"modifiedRange": "[34,35)",
			"innerChanges": [
				{
					"originalRange": "[37,2 -> 38,7]",
					"modifiedRange": "[34,2 -> 34,43]"
				},
				{
					"originalRange": "[38,10 -> 39,3]",
					"modifiedRange": "[34,46 -> 34,64]"
				}
			]
		},
		{
			"originalRange": "[41,46)",
			"modifiedRange": "[36,37)",
			"innerChanges": [
				{
					"originalRange": "[41,12 -> 41,21]",
					"modifiedRange": "[36,12 -> 36,37]"
				},
				{
					"originalRange": "[41,26 -> 41,26]",
					"modifiedRange": "[36,42 -> 36,43]"
				},
				{
					"originalRange": "[41,29 -> 45,24 EOL]",
					"modifiedRange": "[36,46 -> 36,66 EOL]"
				}
			]
		},
		{
			"originalRange": "[48,72)",
			"modifiedRange": "[39,40)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/deletion/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/deletion/1.tst

```text
import { Link, List, Separator, Stack } from '@fluentui/react';
import { View } from '../../layout/layout';

export const OtherToolsView = () => {
	return (
		<View title='Other Tools'>
			<Stack grow={true} verticalFill={true}>
				<Stack.Item>
					<List
						items={[
							{ name: 'VS Code Standup (Redomond)', href: 'https://vscode-standup.azurewebsites.net' },
							{ name: 'VS Code Standup (Zurich)', href: 'http://stand.azurewebsites.net/' },
							{},
							{ name: 'VS Code Errors', href: 'https://vscode-errors.azurewebsites.net' },
							{ name: 'VS Code GDPR', href: 'https://github.com/microsoft/vscode-gdpr-tooling' },
						]}
						onRenderCell={(item) => {
							if (!item?.name) {
								return <Separator></Separator>
							}
							return <div style={{ marginBottom: 12 }}><Link href={item!.href} target='_blank'>{item!.name}</Link></div>
						}}
					>
					</List>
				</Stack.Item>
			</Stack>
		</View>
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/deletion/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/deletion/advanced.expected.diff.json

```json
{
	"original": {
		"content": "import { Link, List, Separator, Stack } from '@fluentui/react';\nimport { View } from '../../layout/layout';\n\nexport const OtherToolsView = () => {\n\treturn (\n\t\t<View title='Other Tools'>\n\t\t\t<Stack grow={true} verticalFill={true}>\n\t\t\t\t<Stack.Item>\n\t\t\t\t\t<List\n\t\t\t\t\t\titems={[\n\t\t\t\t\t\t\t{ name: 'VS Code Standup (Redomond)', href: 'https://vscode-standup.azurewebsites.net' },\n\t\t\t\t\t\t\t{ name: 'VS Code Standup (Zurich)', href: 'http://stand.azurewebsites.net/' },\n\t\t\t\t\t\t\t{},\n\t\t\t\t\t\t\t{ name: 'VS Code Errors', href: 'https://vscode-errors.azurewebsites.net' },\n\t\t\t\t\t\t\t{ name: 'VS Code GDPR', href: 'https://github.com/microsoft/vscode-gdpr-tooling' },\n\t\t\t\t\t\t]}\n\t\t\t\t\t\tonRenderCell={(item) => {\n\t\t\t\t\t\t\tif (!item?.name) {\n\t\t\t\t\t\t\t\treturn <Separator></Separator>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\treturn <div style={{ marginBottom: 12 }}><Link href={item!.href} target='_blank'>{item!.name}</Link></div>\n\t\t\t\t\t\t}}\n\t\t\t\t\t>\n\t\t\t\t\t</List>\n\t\t\t\t</Stack.Item>\n\t\t\t</Stack>\n\t\t</View>\n\t);\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,30)",
			"modifiedRange": "[1,2)",
			"innerChanges": [
				{
					"originalRange": "[1,1 -> 29,2 EOL]",
					"modifiedRange": "[1,1 -> 1,1 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/deletion/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/deletion/legacy.expected.diff.json

```json
{
	"original": {
		"content": "import { Link, List, Separator, Stack } from '@fluentui/react';\nimport { View } from '../../layout/layout';\n\nexport const OtherToolsView = () => {\n\treturn (\n\t\t<View title='Other Tools'>\n\t\t\t<Stack grow={true} verticalFill={true}>\n\t\t\t\t<Stack.Item>\n\t\t\t\t\t<List\n\t\t\t\t\t\titems={[\n\t\t\t\t\t\t\t{ name: 'VS Code Standup (Redomond)', href: 'https://vscode-standup.azurewebsites.net' },\n\t\t\t\t\t\t\t{ name: 'VS Code Standup (Zurich)', href: 'http://stand.azurewebsites.net/' },\n\t\t\t\t\t\t\t{},\n\t\t\t\t\t\t\t{ name: 'VS Code Errors', href: 'https://vscode-errors.azurewebsites.net' },\n\t\t\t\t\t\t\t{ name: 'VS Code GDPR', href: 'https://github.com/microsoft/vscode-gdpr-tooling' },\n\t\t\t\t\t\t]}\n\t\t\t\t\t\tonRenderCell={(item) => {\n\t\t\t\t\t\t\tif (!item?.name) {\n\t\t\t\t\t\t\t\treturn <Separator></Separator>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\treturn <div style={{ marginBottom: 12 }}><Link href={item!.href} target='_blank'>{item!.name}</Link></div>\n\t\t\t\t\t\t}}\n\t\t\t\t\t>\n\t\t\t\t\t</List>\n\t\t\t\t</Stack.Item>\n\t\t\t</Stack>\n\t\t</View>\n\t);\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,30)",
			"modifiedRange": "[1,2)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/difficult-move/1.js]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/difficult-move/1.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const gulp = require('gulp');
const path = require('path');
const es = require('event-stream');
const util = require('./lib/util');
const { getVersion } = require('./lib/getVersion');
const task = require('./lib/task');
const optimize = require('./lib/optimize');
const product = require('../product.json');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const filter = require('gulp-filter');
const { getProductionDependencies } = require('./lib/dependencies');
const vfs = require('vinyl-fs');
const packageJson = require('../package.json');
const flatmap = require('gulp-flatmap');
const gunzip = require('gulp-gunzip');
const File = require('vinyl');
const fs = require('fs');
const glob = require('glob');
const { compileBuildTask } = require('./gulpfile.compile');
const { compileExtensionsBuildTask, compileExtensionMediaBuildTask } = require('./gulpfile.extensions');
const { vscodeWebEntryPoints, vscodeWebResourceIncludes, createVSCodeWebFileContentMapper } = require('./gulpfile.vscode.web');
const cp = require('child_process');
const log = require('fancy-log');

const REPO_ROOT = path.dirname(__dirname);
const commit = getVersion(REPO_ROOT);
const BUILD_ROOT = path.dirname(REPO_ROOT);
const REMOTE_FOLDER = path.join(REPO_ROOT, 'remote');

// Targets

const BUILD_TARGETS = [
	{ platform: 'win32', arch: 'ia32' },
	{ platform: 'win32', arch: 'x64' },
	{ platform: 'darwin', arch: 'x64' },
	{ platform: 'darwin', arch: 'arm64' },
	{ platform: 'linux', arch: 'x64' },
	{ platform: 'linux', arch: 'armhf' },
	{ platform: 'linux', arch: 'arm64' },
	{ platform: 'alpine', arch: 'arm64' },
	// legacy: we use to ship only one alpine so it was put in the arch, but now we ship
	// multiple alpine images and moved to a better model (alpine as the platform)
	{ platform: 'linux', arch: 'alpine' },
];

const serverResources = [

	// Bootstrap
	'out-build/bootstrap.js',
	'out-build/bootstrap-fork.js',
	'out-build/bootstrap-amd.js',
	'out-build/bootstrap-node.js',

	// Performance
	'out-build/vs/base/common/performance.js',

	// Watcher
	'out-build/vs/platform/files/**/*.exe',
	'out-build/vs/platform/files/**/*.md',

	// Process monitor
	'out-build/vs/base/node/cpuUsage.sh',
	'out-build/vs/base/node/ps.sh',

	// Terminal shell integration
	'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration.ps1',
	'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-bash.sh',
	'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-env.zsh',
	'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-profile.zsh',
	'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-rc.zsh',
	'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-login.zsh',
	'out-build/vs/workbench/contrib/terminal/browser/media/fish_xdg_data/fish/vendor_conf.d/shellIntegration.fish',

	'!**/test/**'
];

const serverWithWebResources = [

	// Include all of server...
	...serverResources,

	// ...and all of web
	...vscodeWebResourceIncludes
];

const serverEntryPoints = [
	{
		name: 'vs/server/node/server.main',
		exclude: ['vs/css', 'vs/nls']
	},
	{
		name: 'vs/server/node/server.cli',
		exclude: ['vs/css', 'vs/nls']
	},
	{
		name: 'vs/workbench/api/node/extensionHostProcess',
		exclude: ['vs/css', 'vs/nls']
	},
	{
		name: 'vs/platform/files/node/watcher/watcherMain',
		exclude: ['vs/css', 'vs/nls']
	},
	{
		name: 'vs/platform/terminal/node/ptyHostMain',
		exclude: ['vs/css', 'vs/nls']
	}
];

const serverWithWebEntryPoints = [

	// Include all of server
	...serverEntryPoints,

	// Include workbench web
	...vscodeWebEntryPoints
];

function getNodeVersion() {
	const yarnrc = fs.readFileSync(path.join(REPO_ROOT, 'remote', '.yarnrc'), 'utf8');
	const nodeVersion = /^target "(.*)"$/m.exec(yarnrc)[1];
	const internalNodeVersion = /^ms_build_id "(.*)"$/m.exec(yarnrc)[1];
	return { nodeVersion, internalNodeVersion };
}

function getNodeChecksum(nodeVersion, platform, arch) {
	let expectedName;
	switch (platform) {
		case 'win32':
			expectedName = `win-${arch}/node.exe`;
			break;

		case 'darwin':
		case 'linux':
			expectedName = `node-v${nodeVersion}-${platform}-${arch}.tar.gz`;
			break;

		case 'alpine':
			expectedName = `${platform}-${arch}/node`;
			break;
	}

	const nodeJsChecksums = fs.readFileSync(path.join(REPO_ROOT, 'build', 'checksums', 'nodejs.txt'), 'utf8');
	for (const line of nodeJsChecksums.split('\n')) {
		const [checksum, name] = line.split(/\s+/);
		if (name === expectedName) {
			return checksum;
		}
	}
	return undefined;
}

const { nodeVersion, internalNodeVersion } = getNodeVersion();

BUILD_TARGETS.forEach(({ platform, arch }) => {
	gulp.task(task.define(`node-${platform}-${arch}`, () => {
		const nodePath = path.join('.build', 'node', `v${nodeVersion}`, `${platform}-${arch}`);

		if (!fs.existsSync(nodePath)) {
			util.rimraf(nodePath);

			return nodejs(platform, arch)
				.pipe(vfs.dest(nodePath));
		}

		return Promise.resolve(null);
	}));
});

const defaultNodeTask = gulp.task(`node-${process.platform}-${process.arch}`);

if (defaultNodeTask) {
	gulp.task(task.define('node', defaultNodeTask));
}

function nodejs(platform, arch) {
	const { fetchUrls, fetchGithub } = require('./lib/fetch');
	const untar = require('gulp-untar');
	const crypto = require('crypto');

	if (arch === 'ia32') {
		arch = 'x86';
	} else if (arch === 'armhf') {
		arch = 'armv7l';
	} else if (arch === 'alpine') {
		platform = 'alpine';
		arch = 'x64';
	}

	log(`Downloading node.js ${nodeVersion} ${platform} ${arch} from ${product.nodejsRepository}...`);

	const checksumSha256 = getNodeChecksum(nodeVersion, platform, arch);

	if (checksumSha256) {
		log(`Using SHA256 checksum for checking integrity: ${checksumSha256}`);
	} else {
		log.warn(`Unable to verify integrity of downloaded node.js binary because no SHA256 checksum was found!`);
	}

	switch (platform) {
		case 'win32':
			return (product.nodejsRepository !== 'https://nodejs.org' ?
				fetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `win-${arch}-node.exe`, checksumSha256 }) :
				fetchUrls(`/dist/v${nodeVersion}/win-${arch}/node.exe`, { base: 'https://nodejs.org', checksumSha256 }))
				.pipe(rename('node.exe'));
		case 'darwin':
		case 'linux':
			return (product.nodejsRepository !== 'https://nodejs.org' ?
				fetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `node-v${nodeVersion}-${platform}-${arch}.tar.gz`, checksumSha256 }) :
				fetchUrls(`/dist/v${nodeVersion}/node-v${nodeVersion}-${platform}-${arch}.tar.gz`, { base: 'https://nodejs.org', checksumSha256 })
			).pipe(flatmap(stream => stream.pipe(gunzip()).pipe(untar())))
				.pipe(filter('**/node'))
				.pipe(util.setExecutableBit('**'))
				.pipe(rename('node'));
		case 'alpine': {
			const imageName = arch === 'arm64' ? 'arm64v8/node' : 'node';
			log(`Downloading node.js ${nodeVersion} ${platform} ${arch} from docker image ${imageName}`);
			const contents = cp.execSync(`docker run --rm ${imageName}:${nodeVersion}-alpine /bin/sh -c 'cat \`which node\`'`, { maxBuffer: 100 * 1024 * 1024, encoding: 'buffer' });
			if (checksumSha256) {
				const actualSHA256Checksum = crypto.createHash('sha256').update(contents).digest('hex');
				if (actualSHA256Checksum !== checksumSha256) {
					throw new Error(`Checksum mismatch for node.js from docker image (expected ${options.checksumSha256}, actual ${actualSHA256Checksum}))`);
				}
			}
			return es.readArray([new File({ path: 'node', contents, stat: { mode: parseInt('755', 8) } })]);
		}
	}
}

function packageTask(type, platform, arch, sourceFolderName, destinationFolderName) {
	const destination = path.join(BUILD_ROOT, destinationFolderName);

	return () => {
		const json = require('gulp-json-editor');

		const src = gulp.src(sourceFolderName + '/**', { base: '.' })
			.pipe(rename(function (path) { path.dirname = path.dirname.replace(new RegExp('^' + sourceFolderName), 'out'); }))
			.pipe(util.setExecutableBit(['**/*.sh']))
			.pipe(filter(['**', '!**/*.js.map']));

		const workspaceExtensionPoints = ['debuggers', 'jsonValidation'];
		const isUIExtension = (manifest) => {
			switch (manifest.extensionKind) {
				case 'ui': return true;
				case 'workspace': return false;
				default: {
					if (manifest.main) {
						return false;
					}
					if (manifest.contributes && Object.keys(manifest.contributes).some(key => workspaceExtensionPoints.indexOf(key) !== -1)) {
						return false;
					}
					// Default is UI Extension
					return true;
				}
			}
		};
		const localWorkspaceExtensions = glob.sync('extensions/*/package.json')
			.filter((extensionPath) => {
				if (type === 'reh-web') {
					return true; // web: ship all extensions for now
				}

				// Skip shipping UI extensions because the client side will have them anyways
				// and they'd just increase the download without being used
				const manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, extensionPath)).toString());
				return !isUIExtension(manifest);
			}).map((extensionPath) => path.basename(path.dirname(extensionPath)))
			.filter(name => name !== 'vscode-api-tests' && name !== 'vscode-test-resolver'); // Do not ship the test extensions
		const marketplaceExtensions = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'product.json'), 'utf8')).builtInExtensions
			.filter(entry => !entry.platforms || new Set(entry.platforms).has(platform))
			.filter(entry => !entry.clientOnly)
			.map(entry => entry.name);
		const extensionPaths = [...localWorkspaceExtensions, ...marketplaceExtensions]
			.map(name => `.build/extensions/${name}/**`);

		const extensions = gulp.src(extensionPaths, { base: '.build', dot: true });
		const extensionsCommonDependencies = gulp.src('.build/extensions/node_modules/**', { base: '.build', dot: true });
		const sources = es.merge(src, extensions, extensionsCommonDependencies)
			.pipe(filter(['**', '!**/*.js.map'], { dot: true }));

		let version = packageJson.version;
		const quality = product.quality;

		if (quality && quality !== 'stable') {
			version += '-' + quality;
		}

		const name = product.nameShort;
		const packageJsonStream = gulp.src(['remote/package.json'], { base: 'remote' })
			.pipe(json({ name, version, dependencies: undefined, optionalDependencies: undefined }));

		const date = new Date().toISOString();

		const productJsonStream = gulp.src(['product.json'], { base: '.' })
			.pipe(json({ commit, date, version }));

		const license = gulp.src(['remote/LICENSE'], { base: 'remote', allowEmpty: true });

		const jsFilter = util.filter(data => !data.isDirectory() && /\.js$/.test(data.path));

		const productionDependencies = getProductionDependencies(REMOTE_FOLDER);
		const dependenciesSrc = productionDependencies.map(d => path.relative(REPO_ROOT, d.path)).map(d => [`${d}/**`, `!${d}/**/{test,tests}/**`, `!${d}/.bin/**`]).flat();
		const deps = gulp.src(dependenciesSrc, { base: 'remote', dot: true })
			// filter out unnecessary files, no source maps in server build
			.pipe(filter(['**', '!**/package-lock.json', '!**/yarn.lock', '!**/*.js.map']))
			.pipe(util.cleanNodeModules(path.join(__dirname, '.moduleignore')))
			.pipe(util.cleanNodeModules(path.join(__dirname, `.moduleignore.${process.platform}`)))
			.pipe(jsFilter)
			.pipe(util.stripSourceMappingURL())
			.pipe(jsFilter.restore);

		const nodePath = `.build/node/v${nodeVersion}/${platform}-${arch}`;
		const node = gulp.src(`${nodePath}/**`, { base: nodePath, dot: true });

		let web = [];
		if (type === 'reh-web') {
			web = [
				'resources/server/favicon.ico',
				'resources/server/code-192.png',
				'resources/server/code-512.png',
				'resources/server/manifest.json'
			].map(resource => gulp.src(resource, { base: '.' }).pipe(rename(resource)));
		}

		const all = es.merge(
			packageJsonStream,
			productJsonStream,
			license,
			sources,
			deps,
			node,
			...web
		);

		let result = all
			.pipe(util.skipDirectories())
			.pipe(util.fixWin32DirectoryPermissions());

		if (platform === 'win32') {
			result = es.merge(result,
				gulp.src('resources/server/bin/remote-cli/code.cmd', { base: '.' })
					.pipe(replace('@@VERSION@@', version))
					.pipe(replace('@@COMMIT@@', commit))
					.pipe(replace('@@APPNAME@@', product.applicationName))
					.pipe(rename(`bin/remote-cli/${product.applicationName}.cmd`)),
				gulp.src('resources/server/bin/helpers/browser.cmd', { base: '.' })
					.pipe(replace('@@VERSION@@', version))
					.pipe(replace('@@COMMIT@@', commit))
					.pipe(replace('@@APPNAME@@', product.applicationName))
					.pipe(rename(`bin/helpers/browser.cmd`)),
				gulp.src('resources/server/bin/code-server.cmd', { base: '.' })
					.pipe(rename(`bin/${product.serverApplicationName}.cmd`)),
			);
		} else if (platform === 'linux' || platform === 'alpine' || platform === 'darwin') {
			result = es.merge(result,
				gulp.src(`resources/server/bin/remote-cli/${platform === 'darwin' ? 'code-darwin.sh' : 'code-linux.sh'}`, { base: '.' })
					.pipe(replace('@@VERSION@@', version))
					.pipe(replace('@@COMMIT@@', commit))
					.pipe(replace('@@APPNAME@@', product.applicationName))
					.pipe(rename(`bin/remote-cli/${product.applicationName}`))
					.pipe(util.setExecutableBit()),
				gulp.src(`resources/server/bin/helpers/${platform === 'darwin' ? 'browser-darwin.sh' : 'browser-linux.sh'}`, { base: '.' })
					.pipe(replace('@@VERSION@@', version))
					.pipe(replace('@@COMMIT@@', commit))
					.pipe(replace('@@APPNAME@@', product.applicationName))
					.pipe(rename(`bin/helpers/browser.sh`))
					.pipe(util.setExecutableBit()),
				gulp.src(`resources/server/bin/${platform === 'darwin' ? 'code-server-darwin.sh' : 'code-server-linux.sh'}`, { base: '.' })
					.pipe(rename(`bin/${product.serverApplicationName}`))
					.pipe(util.setExecutableBit())
			);
		}

		return result.pipe(vfs.dest(destination));
	};
}

/**
 * @param {object} product The parsed product.json file contents
 */
function tweakProductForServerWeb(product) {
	const result = { ...product };
	delete result.webEndpointUrlTemplate;
	return result;
}

['reh', 'reh-web'].forEach(type => {
	const optimizeTask = task.define(`optimize-vscode-${type}`, task.series(
		util.rimraf(`out-vscode-${type}`),
		optimize.optimizeTask(
			{
				out: `out-vscode-${type}`,
				amd: {
					src: 'out-build',
					entryPoints: (type === 'reh' ? serverEntryPoints : serverWithWebEntryPoints).flat(),
					otherSources: [],
					resources: type === 'reh' ? serverResources : serverWithWebResources,
					loaderConfig: optimize.loaderConfig(),
					inlineAmdImages: true,
					bundleInfo: undefined,
					fileContentMapper: createVSCodeWebFileContentMapper('.build/extensions', type === 'reh-web' ? tweakProductForServerWeb(product) : product)
				},
				commonJS: {
					src: 'out-build',
					entryPoints: [
						'out-build/server-main.js',
						'out-build/server-cli.js'
					],
					platform: 'node',
					external: [
						'minimist',
						// TODO: we cannot inline `product.json` because
						// it is being changed during build time at a later
						// point in time (such as `checksums`)
						'../product.json',
						'../package.json'
					]
				}
			}
		)
	));

	const minifyTask = task.define(`minify-vscode-${type}`, task.series(
		optimizeTask,
		util.rimraf(`out-vscode-${type}-min`),
		optimize.minifyTask(`out-vscode-${type}`, `https://ticino.blob.core.windows.net/sourcemaps/${commit}/core`)
	));
	gulp.task(minifyTask);

	BUILD_TARGETS.forEach(buildTarget => {
		const dashed = (str) => (str ? `-${str}` : ``);
		const platform = buildTarget.platform;
		const arch = buildTarget.arch;

		['', 'min'].forEach(minified => {
			const sourceFolderName = `out-vscode-${type}${dashed(minified)}`;
			const destinationFolderName = `vscode-${type}${dashed(platform)}${dashed(arch)}`;

			const serverTaskCI = task.define(`vscode-${type}${dashed(platform)}${dashed(arch)}${dashed(minified)}-ci`, task.series(
				gulp.task(`node-${platform}-${arch}`),
				util.rimraf(path.join(BUILD_ROOT, destinationFolderName)),
				packageTask(type, platform, arch, sourceFolderName, destinationFolderName)
			));
			gulp.task(serverTaskCI);

			const serverTask = task.define(`vscode-${type}${dashed(platform)}${dashed(arch)}${dashed(minified)}`, task.series(
				compileBuildTask,
				compileExtensionsBuildTask,
				compileExtensionMediaBuildTask,
				minified ? minifyTask : optimizeTask,
				serverTaskCI
			));
			gulp.task(serverTask);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/difficult-move/2.js]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/difficult-move/2.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const gulp = require('gulp');
const path = require('path');
const es = require('event-stream');
const util = require('./lib/util');
const { getVersion } = require('./lib/getVersion');
const task = require('./lib/task');
const optimize = require('./lib/optimize');
const product = require('../product.json');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const filter = require('gulp-filter');
const { getProductionDependencies } = require('./lib/dependencies');
const vfs = require('vinyl-fs');
const packageJson = require('../package.json');
const flatmap = require('gulp-flatmap');
const gunzip = require('gulp-gunzip');
const File = require('vinyl');
const fs = require('fs');
const glob = require('glob');
const { compileBuildTask } = require('./gulpfile.compile');
const { compileExtensionsBuildTask, compileExtensionMediaBuildTask } = require('./gulpfile.extensions');
const { vscodeWebEntryPoints, vscodeWebResourceIncludes, createVSCodeWebFileContentMapper } = require('./gulpfile.vscode.web');
const cp = require('child_process');
const log = require('fancy-log');

const REPO_ROOT = path.dirname(__dirname);
const commit = getVersion(REPO_ROOT);
const BUILD_ROOT = path.dirname(REPO_ROOT);
const REMOTE_FOLDER = path.join(REPO_ROOT, 'remote');

// Targets

const BUILD_TARGETS = [
	{ platform: 'win32', arch: 'ia32' },
	{ platform: 'win32', arch: 'x64' },
	{ platform: 'darwin', arch: 'x64' },
	{ platform: 'darwin', arch: 'arm64' },
	{ platform: 'linux', arch: 'x64' },
	{ platform: 'linux', arch: 'armhf' },
	{ platform: 'linux', arch: 'arm64' },
	{ platform: 'alpine', arch: 'arm64' },
	// legacy: we use to ship only one alpine so it was put in the arch, but now we ship
	// multiple alpine images and moved to a better model (alpine as the platform)
	{ platform: 'linux', arch: 'alpine' },
];

const serverResources = [

	// Bootstrap
	'out-build/bootstrap.js',
	'out-build/bootstrap-fork.js',
	'out-build/bootstrap-amd.js',
	'out-build/bootstrap-node.js',

	// Performance
	'out-build/vs/base/common/performance.js',

	// Watcher
	'out-build/vs/platform/files/**/*.exe',
	'out-build/vs/platform/files/**/*.md',

	// Process monitor
	'out-build/vs/base/node/cpuUsage.sh',
	'out-build/vs/base/node/ps.sh',

	// Terminal shell integration
	'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration.ps1',
	'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-bash.sh',
	'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-env.zsh',
	'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-profile.zsh',
	'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-rc.zsh',
	'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-login.zsh',
	'out-build/vs/workbench/contrib/terminal/browser/media/fish_xdg_data/fish/vendor_conf.d/shellIntegration.fish',

	'!**/test/**'
];

const serverWithWebResources = [

	// Include all of server...
	...serverResources,

	// ...and all of web
	...vscodeWebResourceIncludes
];

const serverEntryPoints = [
	{
		name: 'vs/server/node/server.main',
		exclude: ['vs/css', 'vs/nls']
	},
	{
		name: 'vs/server/node/server.cli',
		exclude: ['vs/css', 'vs/nls']
	},
	{
		name: 'vs/workbench/api/node/extensionHostProcess',
		exclude: ['vs/css', 'vs/nls']
	},
	{
		name: 'vs/platform/files/node/watcher/watcherMain',
		exclude: ['vs/css', 'vs/nls']
	},
	{
		name: 'vs/platform/terminal/node/ptyHostMain',
		exclude: ['vs/css', 'vs/nls']
	}
];

const serverWithWebEntryPoints = [

	// Include all of server
	...serverEntryPoints,

	// Include workbench web
	...vscodeWebEntryPoints
];

function getNodeVersion() {
	const yarnrc = fs.readFileSync(path.join(REPO_ROOT, 'remote', '.yarnrc'), 'utf8');
	const nodeVersion = /^target "(.*)"$/m.exec(yarnrc)[1];
	const internalNodeVersion = /^ms_build_id "(.*)"$/m.exec(yarnrc)[1];
	return { nodeVersion, internalNodeVersion };
}

function getNodeChecksum(nodeVersion, platform, arch) {
	let expectedName;
	switch (platform) {
		case 'win32':
			expectedName = `win-${arch}/node.exe`;
			break;

		case 'darwin':
		case 'alpine':
		case 'linux':
			expectedName = `node-v${nodeVersion}-${platform}-${arch}.tar.gz`;
			break;
	}

	const nodeJsChecksums = fs.readFileSync(path.join(REPO_ROOT, 'build', 'checksums', 'nodejs.txt'), 'utf8');
	for (const line of nodeJsChecksums.split('\n')) {
		const [checksum, name] = line.split(/\s+/);
		if (name === expectedName) {
			return checksum;
		}
	}
	return undefined;
}

function extractAlpinefromDocker(nodeVersion, platform, arch) {
	const imageName = arch === 'arm64' ? 'arm64v8/node' : 'node';
	log(`Downloading node.js ${nodeVersion} ${platform} ${arch} from docker image ${imageName}`);
	const contents = cp.execSync(`docker run --rm ${imageName}:${nodeVersion}-alpine /bin/sh -c 'cat \`which node\`'`, { maxBuffer: 100 * 1024 * 1024, encoding: 'buffer' });
	return es.readArray([new File({ path: 'node', contents, stat: { mode: parseInt('755', 8) } })]);
}

const { nodeVersion, internalNodeVersion } = getNodeVersion();

BUILD_TARGETS.forEach(({ platform, arch }) => {
	gulp.task(task.define(`node-${platform}-${arch}`, () => {
		const nodePath = path.join('.build', 'node', `v${nodeVersion}`, `${platform}-${arch}`);

		if (!fs.existsSync(nodePath)) {
			util.rimraf(nodePath);

			return nodejs(platform, arch)
				.pipe(vfs.dest(nodePath));
		}

		return Promise.resolve(null);
	}));
});

const defaultNodeTask = gulp.task(`node-${process.platform}-${process.arch}`);

if (defaultNodeTask) {
	gulp.task(task.define('node', defaultNodeTask));
}

function nodejs(platform, arch) {
	const { fetchUrls, fetchGithub } = require('./lib/fetch');
	const untar = require('gulp-untar');
	const crypto = require('crypto');

	if (arch === 'ia32') {
		arch = 'x86';
	} else if (arch === 'armhf') {
		arch = 'armv7l';
	} else if (arch === 'alpine') {
		platform = 'alpine';
		arch = 'x64';
	}

	log(`Downloading node.js ${nodeVersion} ${platform} ${arch} from ${product.nodejsRepository}...`);

	const checksumSha256 = getNodeChecksum(nodeVersion, platform, arch);

	if (checksumSha256) {
		log(`Using SHA256 checksum for checking integrity: ${checksumSha256}`);
	} else {
		log.warn(`Unable to verify integrity of downloaded node.js binary because no SHA256 checksum was found!`);
	}

	switch (platform) {
		case 'win32':
			return (product.nodejsRepository !== 'https://nodejs.org' ?
				fetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `win-${arch}-node.exe`, checksumSha256 }) :
				fetchUrls(`/dist/v${nodeVersion}/win-${arch}/node.exe`, { base: 'https://nodejs.org', checksumSha256 }))
				.pipe(rename('node.exe'));
		case 'darwin':
		case 'linux':
			return (product.nodejsRepository !== 'https://nodejs.org' ?
				fetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `node-v${nodeVersion}-${platform}-${arch}.tar.gz`, checksumSha256 }) :
				fetchUrls(`/dist/v${nodeVersion}/node-v${nodeVersion}-${platform}-${arch}.tar.gz`, { base: 'https://nodejs.org', checksumSha256 })
			).pipe(flatmap(stream => stream.pipe(gunzip()).pipe(untar())))
				.pipe(filter('**/node'))
				.pipe(util.setExecutableBit('**'))
				.pipe(rename('node'));
		case 'alpine':
			return product.nodejsRepository !== 'https://nodejs.org' ?
				fetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `node-v${nodeVersion}-${platform}-${arch}.tar.gz`, checksumSha256 })
					.pipe(flatmap(stream => stream.pipe(gunzip()).pipe(untar())))
					.pipe(filter('**/node'))
					.pipe(util.setExecutableBit('**'))
					.pipe(rename('node'))
				: extractAlpinefromDocker(nodeVersion, platform, arch);
	}
}

function packageTask(type, platform, arch, sourceFolderName, destinationFolderName) {
	const destination = path.join(BUILD_ROOT, destinationFolderName);

	return () => {
		const json = require('gulp-json-editor');

		const src = gulp.src(sourceFolderName + '/**', { base: '.' })
			.pipe(rename(function (path) { path.dirname = path.dirname.replace(new RegExp('^' + sourceFolderName), 'out'); }))
			.pipe(util.setExecutableBit(['**/*.sh']))
			.pipe(filter(['**', '!**/*.js.map']));

		const workspaceExtensionPoints = ['debuggers', 'jsonValidation'];
		const isUIExtension = (manifest) => {
			switch (manifest.extensionKind) {
				case 'ui': return true;
				case 'workspace': return false;
				default: {
					if (manifest.main) {
						return false;
					}
					if (manifest.contributes && Object.keys(manifest.contributes).some(key => workspaceExtensionPoints.indexOf(key) !== -1)) {
						return false;
					}
					// Default is UI Extension
					return true;
				}
			}
		};
		const localWorkspaceExtensions = glob.sync('extensions/*/package.json')
			.filter((extensionPath) => {
				if (type === 'reh-web') {
					return true; // web: ship all extensions for now
				}

				// Skip shipping UI extensions because the client side will have them anyways
				// and they'd just increase the download without being used
				const manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, extensionPath)).toString());
				return !isUIExtension(manifest);
			}).map((extensionPath) => path.basename(path.dirname(extensionPath)))
			.filter(name => name !== 'vscode-api-tests' && name !== 'vscode-test-resolver'); // Do not ship the test extensions
		const marketplaceExtensions = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'product.json'), 'utf8')).builtInExtensions
			.filter(entry => !entry.platforms || new Set(entry.platforms).has(platform))
			.filter(entry => !entry.clientOnly)
			.map(entry => entry.name);
		const extensionPaths = [...localWorkspaceExtensions, ...marketplaceExtensions]
			.map(name => `.build/extensions/${name}/**`);

		const extensions = gulp.src(extensionPaths, { base: '.build', dot: true });
		const extensionsCommonDependencies = gulp.src('.build/extensions/node_modules/**', { base: '.build', dot: true });
		const sources = es.merge(src, extensions, extensionsCommonDependencies)
			.pipe(filter(['**', '!**/*.js.map'], { dot: true }));

		let version = packageJson.version;
		const quality = product.quality;

		if (quality && quality !== 'stable') {
			version += '-' + quality;
		}

		const name = product.nameShort;
		const packageJsonStream = gulp.src(['remote/package.json'], { base: 'remote' })
			.pipe(json({ name, version, dependencies: undefined, optionalDependencies: undefined }));

		const date = new Date().toISOString();

		const productJsonStream = gulp.src(['product.json'], { base: '.' })
			.pipe(json({ commit, date, version }));

		const license = gulp.src(['remote/LICENSE'], { base: 'remote', allowEmpty: true });

		const jsFilter = util.filter(data => !data.isDirectory() && /\.js$/.test(data.path));

		const productionDependencies = getProductionDependencies(REMOTE_FOLDER);
		const dependenciesSrc = productionDependencies.map(d => path.relative(REPO_ROOT, d.path)).map(d => [`${d}/**`, `!${d}/**/{test,tests}/**`, `!${d}/.bin/**`]).flat();
		const deps = gulp.src(dependenciesSrc, { base: 'remote', dot: true })
			// filter out unnecessary files, no source maps in server build
			.pipe(filter(['**', '!**/package-lock.json', '!**/yarn.lock', '!**/*.js.map']))
			.pipe(util.cleanNodeModules(path.join(__dirname, '.moduleignore')))
			.pipe(util.cleanNodeModules(path.join(__dirname, `.moduleignore.${process.platform}`)))
			.pipe(jsFilter)
			.pipe(util.stripSourceMappingURL())
			.pipe(jsFilter.restore);

		const nodePath = `.build/node/v${nodeVersion}/${platform}-${arch}`;
		const node = gulp.src(`${nodePath}/**`, { base: nodePath, dot: true });

		let web = [];
		if (type === 'reh-web') {
			web = [
				'resources/server/favicon.ico',
				'resources/server/code-192.png',
				'resources/server/code-512.png',
				'resources/server/manifest.json'
			].map(resource => gulp.src(resource, { base: '.' }).pipe(rename(resource)));
		}

		const all = es.merge(
			packageJsonStream,
			productJsonStream,
			license,
			sources,
			deps,
			node,
			...web
		);

		let result = all
			.pipe(util.skipDirectories())
			.pipe(util.fixWin32DirectoryPermissions());

		if (platform === 'win32') {
			result = es.merge(result,
				gulp.src('resources/server/bin/remote-cli/code.cmd', { base: '.' })
					.pipe(replace('@@VERSION@@', version))
					.pipe(replace('@@COMMIT@@', commit))
					.pipe(replace('@@APPNAME@@', product.applicationName))
					.pipe(rename(`bin/remote-cli/${product.applicationName}.cmd`)),
				gulp.src('resources/server/bin/helpers/browser.cmd', { base: '.' })
					.pipe(replace('@@VERSION@@', version))
					.pipe(replace('@@COMMIT@@', commit))
					.pipe(replace('@@APPNAME@@', product.applicationName))
					.pipe(rename(`bin/helpers/browser.cmd`)),
				gulp.src('resources/server/bin/code-server.cmd', { base: '.' })
					.pipe(rename(`bin/${product.serverApplicationName}.cmd`)),
			);
		} else if (platform === 'linux' || platform === 'alpine' || platform === 'darwin') {
			result = es.merge(result,
				gulp.src(`resources/server/bin/remote-cli/${platform === 'darwin' ? 'code-darwin.sh' : 'code-linux.sh'}`, { base: '.' })
					.pipe(replace('@@VERSION@@', version))
					.pipe(replace('@@COMMIT@@', commit))
					.pipe(replace('@@APPNAME@@', product.applicationName))
					.pipe(rename(`bin/remote-cli/${product.applicationName}`))
					.pipe(util.setExecutableBit()),
				gulp.src(`resources/server/bin/helpers/${platform === 'darwin' ? 'browser-darwin.sh' : 'browser-linux.sh'}`, { base: '.' })
					.pipe(replace('@@VERSION@@', version))
					.pipe(replace('@@COMMIT@@', commit))
					.pipe(replace('@@APPNAME@@', product.applicationName))
					.pipe(rename(`bin/helpers/browser.sh`))
					.pipe(util.setExecutableBit()),
				gulp.src(`resources/server/bin/${platform === 'darwin' ? 'code-server-darwin.sh' : 'code-server-linux.sh'}`, { base: '.' })
					.pipe(rename(`bin/${product.serverApplicationName}`))
					.pipe(util.setExecutableBit())
			);
		}

		return result.pipe(vfs.dest(destination));
	};
}

/**
 * @param {object} product The parsed product.json file contents
 */
function tweakProductForServerWeb(product) {
	const result = { ...product };
	delete result.webEndpointUrlTemplate;
	return result;
}

['reh', 'reh-web'].forEach(type => {
	const optimizeTask = task.define(`optimize-vscode-${type}`, task.series(
		util.rimraf(`out-vscode-${type}`),
		optimize.optimizeTask(
			{
				out: `out-vscode-${type}`,
				amd: {
					src: 'out-build',
					entryPoints: (type === 'reh' ? serverEntryPoints : serverWithWebEntryPoints).flat(),
					otherSources: [],
					resources: type === 'reh' ? serverResources : serverWithWebResources,
					loaderConfig: optimize.loaderConfig(),
					inlineAmdImages: true,
					bundleInfo: undefined,
					fileContentMapper: createVSCodeWebFileContentMapper('.build/extensions', type === 'reh-web' ? tweakProductForServerWeb(product) : product)
				},
				commonJS: {
					src: 'out-build',
					entryPoints: [
						'out-build/server-main.js',
						'out-build/server-cli.js'
					],
					platform: 'node',
					external: [
						'minimist',
						// TODO: we cannot inline `product.json` because
						// it is being changed during build time at a later
						// point in time (such as `checksums`)
						'../product.json',
						'../package.json'
					]
				}
			}
		)
	));

	const minifyTask = task.define(`minify-vscode-${type}`, task.series(
		optimizeTask,
		util.rimraf(`out-vscode-${type}-min`),
		optimize.minifyTask(`out-vscode-${type}`, `https://ticino.blob.core.windows.net/sourcemaps/${commit}/core`)
	));
	gulp.task(minifyTask);

	BUILD_TARGETS.forEach(buildTarget => {
		const dashed = (str) => (str ? `-${str}` : ``);
		const platform = buildTarget.platform;
		const arch = buildTarget.arch;

		['', 'min'].forEach(minified => {
			const sourceFolderName = `out-vscode-${type}${dashed(minified)}`;
			const destinationFolderName = `vscode-${type}${dashed(platform)}${dashed(arch)}`;

			const serverTaskCI = task.define(`vscode-${type}${dashed(platform)}${dashed(arch)}${dashed(minified)}-ci`, task.series(
				gulp.task(`node-${platform}-${arch}`),
				util.rimraf(path.join(BUILD_ROOT, destinationFolderName)),
				packageTask(type, platform, arch, sourceFolderName, destinationFolderName)
			));
			gulp.task(serverTaskCI);

			const serverTask = task.define(`vscode-${type}${dashed(platform)}${dashed(arch)}${dashed(minified)}`, task.series(
				compileBuildTask,
				compileExtensionsBuildTask,
				compileExtensionMediaBuildTask,
				minified ? minifyTask : optimizeTask,
				serverTaskCI
			));
			gulp.task(serverTask);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/difficult-move/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/difficult-move/advanced.expected.diff.json

```json
{
	"original": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\n'use strict';\n\nconst gulp = require('gulp');\nconst path = require('path');\nconst es = require('event-stream');\nconst util = require('./lib/util');\nconst { getVersion } = require('./lib/getVersion');\nconst task = require('./lib/task');\nconst optimize = require('./lib/optimize');\nconst product = require('../product.json');\nconst rename = require('gulp-rename');\nconst replace = require('gulp-replace');\nconst filter = require('gulp-filter');\nconst { getProductionDependencies } = require('./lib/dependencies');\nconst vfs = require('vinyl-fs');\nconst packageJson = require('../package.json');\nconst flatmap = require('gulp-flatmap');\nconst gunzip = require('gulp-gunzip');\nconst File = require('vinyl');\nconst fs = require('fs');\nconst glob = require('glob');\nconst { compileBuildTask } = require('./gulpfile.compile');\nconst { compileExtensionsBuildTask, compileExtensionMediaBuildTask } = require('./gulpfile.extensions');\nconst { vscodeWebEntryPoints, vscodeWebResourceIncludes, createVSCodeWebFileContentMapper } = require('./gulpfile.vscode.web');\nconst cp = require('child_process');\nconst log = require('fancy-log');\n\nconst REPO_ROOT = path.dirname(__dirname);\nconst commit = getVersion(REPO_ROOT);\nconst BUILD_ROOT = path.dirname(REPO_ROOT);\nconst REMOTE_FOLDER = path.join(REPO_ROOT, 'remote');\n\n// Targets\n\nconst BUILD_TARGETS = [\n\t{ platform: 'win32', arch: 'ia32' },\n\t{ platform: 'win32', arch: 'x64' },\n\t{ platform: 'darwin', arch: 'x64' },\n\t{ platform: 'darwin', arch: 'arm64' },\n\t{ platform: 'linux', arch: 'x64' },\n\t{ platform: 'linux', arch: 'armhf' },\n\t{ platform: 'linux', arch: 'arm64' },\n\t{ platform: 'alpine', arch: 'arm64' },\n\t// legacy: we use to ship only one alpine so it was put in the arch, but now we ship\n\t// multiple alpine images and moved to a better model (alpine as the platform)\n\t{ platform: 'linux', arch: 'alpine' },\n];\n\nconst serverResources = [\n\n\t// Bootstrap\n\t'out-build/bootstrap.js',\n\t'out-build/bootstrap-fork.js',\n\t'out-build/bootstrap-amd.js',\n\t'out-build/bootstrap-node.js',\n\n\t// Performance\n\t'out-build/vs/base/common/performance.js',\n\n\t// Watcher\n\t'out-build/vs/platform/files/**/*.exe',\n\t'out-build/vs/platform/files/**/*.md',\n\n\t// Process monitor\n\t'out-build/vs/base/node/cpuUsage.sh',\n\t'out-build/vs/base/node/ps.sh',\n\n\t// Terminal shell integration\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration.ps1',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-bash.sh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-env.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-profile.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-rc.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-login.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/fish_xdg_data/fish/vendor_conf.d/shellIntegration.fish',\n\n\t'!**/test/**'\n];\n\nconst serverWithWebResources = [\n\n\t// Include all of server...\n\t...serverResources,\n\n\t// ...and all of web\n\t...vscodeWebResourceIncludes\n];\n\nconst serverEntryPoints = [\n\t{\n\t\tname: 'vs/server/node/server.main',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/server/node/server.cli',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/workbench/api/node/extensionHostProcess',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/platform/files/node/watcher/watcherMain',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/platform/terminal/node/ptyHostMain',\n\t\texclude: ['vs/css', 'vs/nls']\n\t}\n];\n\nconst serverWithWebEntryPoints = [\n\n\t// Include all of server\n\t...serverEntryPoints,\n\n\t// Include workbench web\n\t...vscodeWebEntryPoints\n];\n\nfunction getNodeVersion() {\n\tconst yarnrc = fs.readFileSync(path.join(REPO_ROOT, 'remote', '.yarnrc'), 'utf8');\n\tconst nodeVersion = /^target \"(.*)\"$/m.exec(yarnrc)[1];\n\tconst internalNodeVersion = /^ms_build_id \"(.*)\"$/m.exec(yarnrc)[1];\n\treturn { nodeVersion, internalNodeVersion };\n}\n\nfunction getNodeChecksum(nodeVersion, platform, arch) {\n\tlet expectedName;\n\tswitch (platform) {\n\t\tcase 'win32':\n\t\t\texpectedName = `win-${arch}/node.exe`;\n\t\t\tbreak;\n\n\t\tcase 'darwin':\n\t\tcase 'linux':\n\t\t\texpectedName = `node-v${nodeVersion}-${platform}-${arch}.tar.gz`;\n\t\t\tbreak;\n\n\t\tcase 'alpine':\n\t\t\texpectedName = `${platform}-${arch}/node`;\n\t\t\tbreak;\n\t}\n\n\tconst nodeJsChecksums = fs.readFileSync(path.join(REPO_ROOT, 'build', 'checksums', 'nodejs.txt'), 'utf8');\n\tfor (const line of nodeJsChecksums.split('\\n')) {\n\t\tconst [checksum, name] = line.split(/\\s+/);\n\t\tif (name === expectedName) {\n\t\t\treturn checksum;\n\t\t}\n\t}\n\treturn undefined;\n}\n\nconst { nodeVersion, internalNodeVersion } = getNodeVersion();\n\nBUILD_TARGETS.forEach(({ platform, arch }) => {\n\tgulp.task(task.define(`node-${platform}-${arch}`, () => {\n\t\tconst nodePath = path.join('.build', 'node', `v${nodeVersion}`, `${platform}-${arch}`);\n\n\t\tif (!fs.existsSync(nodePath)) {\n\t\t\tutil.rimraf(nodePath);\n\n\t\t\treturn nodejs(platform, arch)\n\t\t\t\t.pipe(vfs.dest(nodePath));\n\t\t}\n\n\t\treturn Promise.resolve(null);\n\t}));\n});\n\nconst defaultNodeTask = gulp.task(`node-${process.platform}-${process.arch}`);\n\nif (defaultNodeTask) {\n\tgulp.task(task.define('node', defaultNodeTask));\n}\n\nfunction nodejs(platform, arch) {\n\tconst { fetchUrls, fetchGithub } = require('./lib/fetch');\n\tconst untar = require('gulp-untar');\n\tconst crypto = require('crypto');\n\n\tif (arch === 'ia32') {\n\t\tarch = 'x86';\n\t} else if (arch === 'armhf') {\n\t\tarch = 'armv7l';\n\t} else if (arch === 'alpine') {\n\t\tplatform = 'alpine';\n\t\tarch = 'x64';\n\t}\n\n\tlog(`Downloading node.js ${nodeVersion} ${platform} ${arch} from ${product.nodejsRepository}...`);\n\n\tconst checksumSha256 = getNodeChecksum(nodeVersion, platform, arch);\n\n\tif (checksumSha256) {\n\t\tlog(`Using SHA256 checksum for checking integrity: ${checksumSha256}`);\n\t} else {\n\t\tlog.warn(`Unable to verify integrity of downloaded node.js binary because no SHA256 checksum was found!`);\n\t}\n\n\tswitch (platform) {\n\t\tcase 'win32':\n\t\t\treturn (product.nodejsRepository !== 'https://nodejs.org' ?\n\t\t\t\tfetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `win-${arch}-node.exe`, checksumSha256 }) :\n\t\t\t\tfetchUrls(`/dist/v${nodeVersion}/win-${arch}/node.exe`, { base: 'https://nodejs.org', checksumSha256 }))\n\t\t\t\t.pipe(rename('node.exe'));\n\t\tcase 'darwin':\n\t\tcase 'linux':\n\t\t\treturn (product.nodejsRepository !== 'https://nodejs.org' ?\n\t\t\t\tfetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `node-v${nodeVersion}-${platform}-${arch}.tar.gz`, checksumSha256 }) :\n\t\t\t\tfetchUrls(`/dist/v${nodeVersion}/node-v${nodeVersion}-${platform}-${arch}.tar.gz`, { base: 'https://nodejs.org', checksumSha256 })\n\t\t\t).pipe(flatmap(stream => stream.pipe(gunzip()).pipe(untar())))\n\t\t\t\t.pipe(filter('**/node'))\n\t\t\t\t.pipe(util.setExecutableBit('**'))\n\t\t\t\t.pipe(rename('node'));\n\t\tcase 'alpine': {\n\t\t\tconst imageName = arch === 'arm64' ? 'arm64v8/node' : 'node';\n\t\t\tlog(`Downloading node.js ${nodeVersion} ${platform} ${arch} from docker image ${imageName}`);\n\t\t\tconst contents = cp.execSync(`docker run --rm ${imageName}:${nodeVersion}-alpine /bin/sh -c 'cat \\`which node\\`'`, { maxBuffer: 100 * 1024 * 1024, encoding: 'buffer' });\n\t\t\tif (checksumSha256) {\n\t\t\t\tconst actualSHA256Checksum = crypto.createHash('sha256').update(contents).digest('hex');\n\t\t\t\tif (actualSHA256Checksum !== checksumSha256) {\n\t\t\t\t\tthrow new Error(`Checksum mismatch for node.js from docker image (expected ${options.checksumSha256}, actual ${actualSHA256Checksum}))`);\n\t\t\t\t}\n\t\t\t}\n\t\t\treturn es.readArray([new File({ path: 'node', contents, stat: { mode: parseInt('755', 8) } })]);\n\t\t}\n\t}\n}\n\nfunction packageTask(type, platform, arch, sourceFolderName, destinationFolderName) {\n\tconst destination = path.join(BUILD_ROOT, destinationFolderName);\n\n\treturn () => {\n\t\tconst json = require('gulp-json-editor');\n\n\t\tconst src = gulp.src(sourceFolderName + '/**', { base: '.' })\n\t\t\t.pipe(rename(function (path) { path.dirname = path.dirname.replace(new RegExp('^' + sourceFolderName), 'out'); }))\n\t\t\t.pipe(util.setExecutableBit(['**/*.sh']))\n\t\t\t.pipe(filter(['**', '!**/*.js.map']));\n\n\t\tconst workspaceExtensionPoints = ['debuggers', 'jsonValidation'];\n\t\tconst isUIExtension = (manifest) => {\n\t\t\tswitch (manifest.extensionKind) {\n\t\t\t\tcase 'ui': return true;\n\t\t\t\tcase 'workspace': return false;\n\t\t\t\tdefault: {\n\t\t\t\t\tif (manifest.main) {\n\t\t\t\t\t\treturn false;\n\t\t\t\t\t}\n\t\t\t\t\tif (manifest.contributes && Object.keys(manifest.contributes).some(key => workspaceExtensionPoints.indexOf(key) !== -1)) {\n\t\t\t\t\t\treturn false;\n\t\t\t\t\t}\n\t\t\t\t\t// Default is UI Extension\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\t\t\t}\n\t\t};\n\t\tconst localWorkspaceExtensions = glob.sync('extensions/*/package.json')\n\t\t\t.filter((extensionPath) => {\n\t\t\t\tif (type === 'reh-web') {\n\t\t\t\t\treturn true; // web: ship all extensions for now\n\t\t\t\t}\n\n\t\t\t\t// Skip shipping UI extensions because the client side will have them anyways\n\t\t\t\t// and they'd just increase the download without being used\n\t\t\t\tconst manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, extensionPath)).toString());\n\t\t\t\treturn !isUIExtension(manifest);\n\t\t\t}).map((extensionPath) => path.basename(path.dirname(extensionPath)))\n\t\t\t.filter(name => name !== 'vscode-api-tests' && name !== 'vscode-test-resolver'); // Do not ship the test extensions\n\t\tconst marketplaceExtensions = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'product.json'), 'utf8')).builtInExtensions\n\t\t\t.filter(entry => !entry.platforms || new Set(entry.platforms).has(platform))\n\t\t\t.filter(entry => !entry.clientOnly)\n\t\t\t.map(entry => entry.name);\n\t\tconst extensionPaths = [...localWorkspaceExtensions, ...marketplaceExtensions]\n\t\t\t.map(name => `.build/extensions/${name}/**`);\n\n\t\tconst extensions = gulp.src(extensionPaths, { base: '.build', dot: true });\n\t\tconst extensionsCommonDependencies = gulp.src('.build/extensions/node_modules/**', { base: '.build', dot: true });\n\t\tconst sources = es.merge(src, extensions, extensionsCommonDependencies)\n\t\t\t.pipe(filter(['**', '!**/*.js.map'], { dot: true }));\n\n\t\tlet version = packageJson.version;\n\t\tconst quality = product.quality;\n\n\t\tif (quality && quality !== 'stable') {\n\t\t\tversion += '-' + quality;\n\t\t}\n\n\t\tconst name = product.nameShort;\n\t\tconst packageJsonStream = gulp.src(['remote/package.json'], { base: 'remote' })\n\t\t\t.pipe(json({ name, version, dependencies: undefined, optionalDependencies: undefined }));\n\n\t\tconst date = new Date().toISOString();\n\n\t\tconst productJsonStream = gulp.src(['product.json'], { base: '.' })\n\t\t\t.pipe(json({ commit, date, version }));\n\n\t\tconst license = gulp.src(['remote/LICENSE'], { base: 'remote', allowEmpty: true });\n\n\t\tconst jsFilter = util.filter(data => !data.isDirectory() && /\\.js$/.test(data.path));\n\n\t\tconst productionDependencies = getProductionDependencies(REMOTE_FOLDER);\n\t\tconst dependenciesSrc = productionDependencies.map(d => path.relative(REPO_ROOT, d.path)).map(d => [`${d}/**`, `!${d}/**/{test,tests}/**`, `!${d}/.bin/**`]).flat();\n\t\tconst deps = gulp.src(dependenciesSrc, { base: 'remote', dot: true })\n\t\t\t// filter out unnecessary files, no source maps in server build\n\t\t\t.pipe(filter(['**', '!**/package-lock.json', '!**/yarn.lock', '!**/*.js.map']))\n\t\t\t.pipe(util.cleanNodeModules(path.join(__dirname, '.moduleignore')))\n\t\t\t.pipe(util.cleanNodeModules(path.join(__dirname, `.moduleignore.${process.platform}`)))\n\t\t\t.pipe(jsFilter)\n\t\t\t.pipe(util.stripSourceMappingURL())\n\t\t\t.pipe(jsFilter.restore);\n\n\t\tconst nodePath = `.build/node/v${nodeVersion}/${platform}-${arch}`;\n\t\tconst node = gulp.src(`${nodePath}/**`, { base: nodePath, dot: true });\n\n\t\tlet web = [];\n\t\tif (type === 'reh-web') {\n\t\t\tweb = [\n\t\t\t\t'resources/server/favicon.ico',\n\t\t\t\t'resources/server/code-192.png',\n\t\t\t\t'resources/server/code-512.png',\n\t\t\t\t'resources/server/manifest.json'\n\t\t\t].map(resource => gulp.src(resource, { base: '.' }).pipe(rename(resource)));\n\t\t}\n\n\t\tconst all = es.merge(\n\t\t\tpackageJsonStream,\n\t\t\tproductJsonStream,\n\t\t\tlicense,\n\t\t\tsources,\n\t\t\tdeps,\n\t\t\tnode,\n\t\t\t...web\n\t\t);\n\n\t\tlet result = all\n\t\t\t.pipe(util.skipDirectories())\n\t\t\t.pipe(util.fixWin32DirectoryPermissions());\n\n\t\tif (platform === 'win32') {\n\t\t\tresult = es.merge(result,\n\t\t\t\tgulp.src('resources/server/bin/remote-cli/code.cmd', { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/remote-cli/${product.applicationName}.cmd`)),\n\t\t\t\tgulp.src('resources/server/bin/helpers/browser.cmd', { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/helpers/browser.cmd`)),\n\t\t\t\tgulp.src('resources/server/bin/code-server.cmd', { base: '.' })\n\t\t\t\t\t.pipe(rename(`bin/${product.serverApplicationName}.cmd`)),\n\t\t\t);\n\t\t} else if (platform === 'linux' || platform === 'alpine' || platform === 'darwin') {\n\t\t\tresult = es.merge(result,\n\t\t\t\tgulp.src(`resources/server/bin/remote-cli/${platform === 'darwin' ? 'code-darwin.sh' : 'code-linux.sh'}`, { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/remote-cli/${product.applicationName}`))\n\t\t\t\t\t.pipe(util.setExecutableBit()),\n\t\t\t\tgulp.src(`resources/server/bin/helpers/${platform === 'darwin' ? 'browser-darwin.sh' : 'browser-linux.sh'}`, { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/helpers/browser.sh`))\n\t\t\t\t\t.pipe(util.setExecutableBit()),\n\t\t\t\tgulp.src(`resources/server/bin/${platform === 'darwin' ? 'code-server-darwin.sh' : 'code-server-linux.sh'}`, { base: '.' })\n\t\t\t\t\t.pipe(rename(`bin/${product.serverApplicationName}`))\n\t\t\t\t\t.pipe(util.setExecutableBit())\n\t\t\t);\n\t\t}\n\n\t\treturn result.pipe(vfs.dest(destination));\n\t};\n}\n\n/**\n * @param {object} product The parsed product.json file contents\n */\nfunction tweakProductForServerWeb(product) {\n\tconst result = { ...product };\n\tdelete result.webEndpointUrlTemplate;\n\treturn result;\n}\n\n['reh', 'reh-web'].forEach(type => {\n\tconst optimizeTask = task.define(`optimize-vscode-${type}`, task.series(\n\t\tutil.rimraf(`out-vscode-${type}`),\n\t\toptimize.optimizeTask(\n\t\t\t{\n\t\t\t\tout: `out-vscode-${type}`,\n\t\t\t\tamd: {\n\t\t\t\t\tsrc: 'out-build',\n\t\t\t\t\tentryPoints: (type === 'reh' ? serverEntryPoints : serverWithWebEntryPoints).flat(),\n\t\t\t\t\totherSources: [],\n\t\t\t\t\tresources: type === 'reh' ? serverResources : serverWithWebResources,\n\t\t\t\t\tloaderConfig: optimize.loaderConfig(),\n\t\t\t\t\tinlineAmdImages: true,\n\t\t\t\t\tbundleInfo: undefined,\n\t\t\t\t\tfileContentMapper: createVSCodeWebFileContentMapper('.build/extensions', type === 'reh-web' ? tweakProductForServerWeb(product) : product)\n\t\t\t\t},\n\t\t\t\tcommonJS: {\n\t\t\t\t\tsrc: 'out-build',\n\t\t\t\t\tentryPoints: [\n\t\t\t\t\t\t'out-build/server-main.js',\n\t\t\t\t\t\t'out-build/server-cli.js'\n\t\t\t\t\t],\n\t\t\t\t\tplatform: 'node',\n\t\t\t\t\texternal: [\n\t\t\t\t\t\t'minimist',\n\t\t\t\t\t\t// TODO: we cannot inline `product.json` because\n\t\t\t\t\t\t// it is being changed during build time at a later\n\t\t\t\t\t\t// point in time (such as `checksums`)\n\t\t\t\t\t\t'../product.json',\n\t\t\t\t\t\t'../package.json'\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t)\n\t));\n\n\tconst minifyTask = task.define(`minify-vscode-${type}`, task.series(\n\t\toptimizeTask,\n\t\tutil.rimraf(`out-vscode-${type}-min`),\n\t\toptimize.minifyTask(`out-vscode-${type}`, `https://ticino.blob.core.windows.net/sourcemaps/${commit}/core`)\n\t));\n\tgulp.task(minifyTask);\n\n\tBUILD_TARGETS.forEach(buildTarget => {\n\t\tconst dashed = (str) => (str ? `-${str}` : ``);\n\t\tconst platform = buildTarget.platform;\n\t\tconst arch = buildTarget.arch;\n\n\t\t['', 'min'].forEach(minified => {\n\t\t\tconst sourceFolderName = `out-vscode-${type}${dashed(minified)}`;\n\t\t\tconst destinationFolderName = `vscode-${type}${dashed(platform)}${dashed(arch)}`;\n\n\t\t\tconst serverTaskCI = task.define(`vscode-${type}${dashed(platform)}${dashed(arch)}${dashed(minified)}-ci`, task.series(\n\t\t\t\tgulp.task(`node-${platform}-${arch}`),\n\t\t\t\tutil.rimraf(path.join(BUILD_ROOT, destinationFolderName)),\n\t\t\t\tpackageTask(type, platform, arch, sourceFolderName, destinationFolderName)\n\t\t\t));\n\t\t\tgulp.task(serverTaskCI);\n\n\t\t\tconst serverTask = task.define(`vscode-${type}${dashed(platform)}${dashed(arch)}${dashed(minified)}`, task.series(\n\t\t\t\tcompileBuildTask,\n\t\t\t\tcompileExtensionsBuildTask,\n\t\t\t\tcompileExtensionMediaBuildTask,\n\t\t\t\tminified ? minifyTask : optimizeTask,\n\t\t\t\tserverTaskCI\n\t\t\t));\n\t\t\tgulp.task(serverTask);\n\t\t});\n\t});\n});\n",
		"fileName": "./1.js"
	},
	"modified": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\n'use strict';\n\nconst gulp = require('gulp');\nconst path = require('path');\nconst es = require('event-stream');\nconst util = require('./lib/util');\nconst { getVersion } = require('./lib/getVersion');\nconst task = require('./lib/task');\nconst optimize = require('./lib/optimize');\nconst product = require('../product.json');\nconst rename = require('gulp-rename');\nconst replace = require('gulp-replace');\nconst filter = require('gulp-filter');\nconst { getProductionDependencies } = require('./lib/dependencies');\nconst vfs = require('vinyl-fs');\nconst packageJson = require('../package.json');\nconst flatmap = require('gulp-flatmap');\nconst gunzip = require('gulp-gunzip');\nconst File = require('vinyl');\nconst fs = require('fs');\nconst glob = require('glob');\nconst { compileBuildTask } = require('./gulpfile.compile');\nconst { compileExtensionsBuildTask, compileExtensionMediaBuildTask } = require('./gulpfile.extensions');\nconst { vscodeWebEntryPoints, vscodeWebResourceIncludes, createVSCodeWebFileContentMapper } = require('./gulpfile.vscode.web');\nconst cp = require('child_process');\nconst log = require('fancy-log');\n\nconst REPO_ROOT = path.dirname(__dirname);\nconst commit = getVersion(REPO_ROOT);\nconst BUILD_ROOT = path.dirname(REPO_ROOT);\nconst REMOTE_FOLDER = path.join(REPO_ROOT, 'remote');\n\n// Targets\n\nconst BUILD_TARGETS = [\n\t{ platform: 'win32', arch: 'ia32' },\n\t{ platform: 'win32', arch: 'x64' },\n\t{ platform: 'darwin', arch: 'x64' },\n\t{ platform: 'darwin', arch: 'arm64' },\n\t{ platform: 'linux', arch: 'x64' },\n\t{ platform: 'linux', arch: 'armhf' },\n\t{ platform: 'linux', arch: 'arm64' },\n\t{ platform: 'alpine', arch: 'arm64' },\n\t// legacy: we use to ship only one alpine so it was put in the arch, but now we ship\n\t// multiple alpine images and moved to a better model (alpine as the platform)\n\t{ platform: 'linux', arch: 'alpine' },\n];\n\nconst serverResources = [\n\n\t// Bootstrap\n\t'out-build/bootstrap.js',\n\t'out-build/bootstrap-fork.js',\n\t'out-build/bootstrap-amd.js',\n\t'out-build/bootstrap-node.js',\n\n\t// Performance\n\t'out-build/vs/base/common/performance.js',\n\n\t// Watcher\n\t'out-build/vs/platform/files/**/*.exe',\n\t'out-build/vs/platform/files/**/*.md',\n\n\t// Process monitor\n\t'out-build/vs/base/node/cpuUsage.sh',\n\t'out-build/vs/base/node/ps.sh',\n\n\t// Terminal shell integration\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration.ps1',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-bash.sh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-env.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-profile.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-rc.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-login.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/fish_xdg_data/fish/vendor_conf.d/shellIntegration.fish',\n\n\t'!**/test/**'\n];\n\nconst serverWithWebResources = [\n\n\t// Include all of server...\n\t...serverResources,\n\n\t// ...and all of web\n\t...vscodeWebResourceIncludes\n];\n\nconst serverEntryPoints = [\n\t{\n\t\tname: 'vs/server/node/server.main',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/server/node/server.cli',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/workbench/api/node/extensionHostProcess',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/platform/files/node/watcher/watcherMain',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/platform/terminal/node/ptyHostMain',\n\t\texclude: ['vs/css', 'vs/nls']\n\t}\n];\n\nconst serverWithWebEntryPoints = [\n\n\t// Include all of server\n\t...serverEntryPoints,\n\n\t// Include workbench web\n\t...vscodeWebEntryPoints\n];\n\nfunction getNodeVersion() {\n\tconst yarnrc = fs.readFileSync(path.join(REPO_ROOT, 'remote', '.yarnrc'), 'utf8');\n\tconst nodeVersion = /^target \"(.*)\"$/m.exec(yarnrc)[1];\n\tconst internalNodeVersion = /^ms_build_id \"(.*)\"$/m.exec(yarnrc)[1];\n\treturn { nodeVersion, internalNodeVersion };\n}\n\nfunction getNodeChecksum(nodeVersion, platform, arch) {\n\tlet expectedName;\n\tswitch (platform) {\n\t\tcase 'win32':\n\t\t\texpectedName = `win-${arch}/node.exe`;\n\t\t\tbreak;\n\n\t\tcase 'darwin':\n\t\tcase 'alpine':\n\t\tcase 'linux':\n\t\t\texpectedName = `node-v${nodeVersion}-${platform}-${arch}.tar.gz`;\n\t\t\tbreak;\n\t}\n\n\tconst nodeJsChecksums = fs.readFileSync(path.join(REPO_ROOT, 'build', 'checksums', 'nodejs.txt'), 'utf8');\n\tfor (const line of nodeJsChecksums.split('\\n')) {\n\t\tconst [checksum, name] = line.split(/\\s+/);\n\t\tif (name === expectedName) {\n\t\t\treturn checksum;\n\t\t}\n\t}\n\treturn undefined;\n}\n\nfunction extractAlpinefromDocker(nodeVersion, platform, arch) {\n\tconst imageName = arch === 'arm64' ? 'arm64v8/node' : 'node';\n\tlog(`Downloading node.js ${nodeVersion} ${platform} ${arch} from docker image ${imageName}`);\n\tconst contents = cp.execSync(`docker run --rm ${imageName}:${nodeVersion}-alpine /bin/sh -c 'cat \\`which node\\`'`, { maxBuffer: 100 * 1024 * 1024, encoding: 'buffer' });\n\treturn es.readArray([new File({ path: 'node', contents, stat: { mode: parseInt('755', 8) } })]);\n}\n\nconst { nodeVersion, internalNodeVersion } = getNodeVersion();\n\nBUILD_TARGETS.forEach(({ platform, arch }) => {\n\tgulp.task(task.define(`node-${platform}-${arch}`, () => {\n\t\tconst nodePath = path.join('.build', 'node', `v${nodeVersion}`, `${platform}-${arch}`);\n\n\t\tif (!fs.existsSync(nodePath)) {\n\t\t\tutil.rimraf(nodePath);\n\n\t\t\treturn nodejs(platform, arch)\n\t\t\t\t.pipe(vfs.dest(nodePath));\n\t\t}\n\n\t\treturn Promise.resolve(null);\n\t}));\n});\n\nconst defaultNodeTask = gulp.task(`node-${process.platform}-${process.arch}`);\n\nif (defaultNodeTask) {\n\tgulp.task(task.define('node', defaultNodeTask));\n}\n\nfunction nodejs(platform, arch) {\n\tconst { fetchUrls, fetchGithub } = require('./lib/fetch');\n\tconst untar = require('gulp-untar');\n\tconst crypto = require('crypto');\n\n\tif (arch === 'ia32') {\n\t\tarch = 'x86';\n\t} else if (arch === 'armhf') {\n\t\tarch = 'armv7l';\n\t} else if (arch === 'alpine') {\n\t\tplatform = 'alpine';\n\t\tarch = 'x64';\n\t}\n\n\tlog(`Downloading node.js ${nodeVersion} ${platform} ${arch} from ${product.nodejsRepository}...`);\n\n\tconst checksumSha256 = getNodeChecksum(nodeVersion, platform, arch);\n\n\tif (checksumSha256) {\n\t\tlog(`Using SHA256 checksum for checking integrity: ${checksumSha256}`);\n\t} else {\n\t\tlog.warn(`Unable to verify integrity of downloaded node.js binary because no SHA256 checksum was found!`);\n\t}\n\n\tswitch (platform) {\n\t\tcase 'win32':\n\t\t\treturn (product.nodejsRepository !== 'https://nodejs.org' ?\n\t\t\t\tfetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `win-${arch}-node.exe`, checksumSha256 }) :\n\t\t\t\tfetchUrls(`/dist/v${nodeVersion}/win-${arch}/node.exe`, { base: 'https://nodejs.org', checksumSha256 }))\n\t\t\t\t.pipe(rename('node.exe'));\n\t\tcase 'darwin':\n\t\tcase 'linux':\n\t\t\treturn (product.nodejsRepository !== 'https://nodejs.org' ?\n\t\t\t\tfetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `node-v${nodeVersion}-${platform}-${arch}.tar.gz`, checksumSha256 }) :\n\t\t\t\tfetchUrls(`/dist/v${nodeVersion}/node-v${nodeVersion}-${platform}-${arch}.tar.gz`, { base: 'https://nodejs.org', checksumSha256 })\n\t\t\t).pipe(flatmap(stream => stream.pipe(gunzip()).pipe(untar())))\n\t\t\t\t.pipe(filter('**/node'))\n\t\t\t\t.pipe(util.setExecutableBit('**'))\n\t\t\t\t.pipe(rename('node'));\n\t\tcase 'alpine':\n\t\t\treturn product.nodejsRepository !== 'https://nodejs.org' ?\n\t\t\t\tfetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `node-v${nodeVersion}-${platform}-${arch}.tar.gz`, checksumSha256 })\n\t\t\t\t\t.pipe(flatmap(stream => stream.pipe(gunzip()).pipe(untar())))\n\t\t\t\t\t.pipe(filter('**/node'))\n\t\t\t\t\t.pipe(util.setExecutableBit('**'))\n\t\t\t\t\t.pipe(rename('node'))\n\t\t\t\t: extractAlpinefromDocker(nodeVersion, platform, arch);\n\t}\n}\n\nfunction packageTask(type, platform, arch, sourceFolderName, destinationFolderName) {\n\tconst destination = path.join(BUILD_ROOT, destinationFolderName);\n\n\treturn () => {\n\t\tconst json = require('gulp-json-editor');\n\n\t\tconst src = gulp.src(sourceFolderName + '/**', { base: '.' })\n\t\t\t.pipe(rename(function (path) { path.dirname = path.dirname.replace(new RegExp('^' + sourceFolderName), 'out'); }))\n\t\t\t.pipe(util.setExecutableBit(['**/*.sh']))\n\t\t\t.pipe(filter(['**', '!**/*.js.map']));\n\n\t\tconst workspaceExtensionPoints = ['debuggers', 'jsonValidation'];\n\t\tconst isUIExtension = (manifest) => {\n\t\t\tswitch (manifest.extensionKind) {\n\t\t\t\tcase 'ui': return true;\n\t\t\t\tcase 'workspace': return false;\n\t\t\t\tdefault: {\n\t\t\t\t\tif (manifest.main) {\n\t\t\t\t\t\treturn false;\n\t\t\t\t\t}\n\t\t\t\t\tif (manifest.contributes && Object.keys(manifest.contributes).some(key => workspaceExtensionPoints.indexOf(key) !== -1)) {\n\t\t\t\t\t\treturn false;\n\t\t\t\t\t}\n\t\t\t\t\t// Default is UI Extension\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\t\t\t}\n\t\t};\n\t\tconst localWorkspaceExtensions = glob.sync('extensions/*/package.json')\n\t\t\t.filter((extensionPath) => {\n\t\t\t\tif (type === 'reh-web') {\n\t\t\t\t\treturn true; // web: ship all extensions for now\n\t\t\t\t}\n\n\t\t\t\t// Skip shipping UI extensions because the client side will have them anyways\n\t\t\t\t// and they'd just increase the download without being used\n\t\t\t\tconst manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, extensionPath)).toString());\n\t\t\t\treturn !isUIExtension(manifest);\n\t\t\t}).map((extensionPath) => path.basename(path.dirname(extensionPath)))\n\t\t\t.filter(name => name !== 'vscode-api-tests' && name !== 'vscode-test-resolver'); // Do not ship the test extensions\n\t\tconst marketplaceExtensions = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'product.json'), 'utf8')).builtInExtensions\n\t\t\t.filter(entry => !entry.platforms || new Set(entry.platforms).has(platform))\n\t\t\t.filter(entry => !entry.clientOnly)\n\t\t\t.map(entry => entry.name);\n\t\tconst extensionPaths = [...localWorkspaceExtensions, ...marketplaceExtensions]\n\t\t\t.map(name => `.build/extensions/${name}/**`);\n\n\t\tconst extensions = gulp.src(extensionPaths, { base: '.build', dot: true });\n\t\tconst extensionsCommonDependencies = gulp.src('.build/extensions/node_modules/**', { base: '.build', dot: true });\n\t\tconst sources = es.merge(src, extensions, extensionsCommonDependencies)\n\t\t\t.pipe(filter(['**', '!**/*.js.map'], { dot: true }));\n\n\t\tlet version = packageJson.version;\n\t\tconst quality = product.quality;\n\n\t\tif (quality && quality !== 'stable') {\n\t\t\tversion += '-' + quality;\n\t\t}\n\n\t\tconst name = product.nameShort;\n\t\tconst packageJsonStream = gulp.src(['remote/package.json'], { base: 'remote' })\n\t\t\t.pipe(json({ name, version, dependencies: undefined, optionalDependencies: undefined }));\n\n\t\tconst date = new Date().toISOString();\n\n\t\tconst productJsonStream = gulp.src(['product.json'], { base: '.' })\n\t\t\t.pipe(json({ commit, date, version }));\n\n\t\tconst license = gulp.src(['remote/LICENSE'], { base: 'remote', allowEmpty: true });\n\n\t\tconst jsFilter = util.filter(data => !data.isDirectory() && /\\.js$/.test(data.path));\n\n\t\tconst productionDependencies = getProductionDependencies(REMOTE_FOLDER);\n\t\tconst dependenciesSrc = productionDependencies.map(d => path.relative(REPO_ROOT, d.path)).map(d => [`${d}/**`, `!${d}/**/{test,tests}/**`, `!${d}/.bin/**`]).flat();\n\t\tconst deps = gulp.src(dependenciesSrc, { base: 'remote', dot: true })\n\t\t\t// filter out unnecessary files, no source maps in server build\n\t\t\t.pipe(filter(['**', '!**/package-lock.json', '!**/yarn.lock', '!**/*.js.map']))\n\t\t\t.pipe(util.cleanNodeModules(path.join(__dirname, '.moduleignore')))\n\t\t\t.pipe(util.cleanNodeModules(path.join(__dirname, `.moduleignore.${process.platform}`)))\n\t\t\t.pipe(jsFilter)\n\t\t\t.pipe(util.stripSourceMappingURL())\n\t\t\t.pipe(jsFilter.restore);\n\n\t\tconst nodePath = `.build/node/v${nodeVersion}/${platform}-${arch}`;\n\t\tconst node = gulp.src(`${nodePath}/**`, { base: nodePath, dot: true });\n\n\t\tlet web = [];\n\t\tif (type === 'reh-web') {\n\t\t\tweb = [\n\t\t\t\t'resources/server/favicon.ico',\n\t\t\t\t'resources/server/code-192.png',\n\t\t\t\t'resources/server/code-512.png',\n\t\t\t\t'resources/server/manifest.json'\n\t\t\t].map(resource => gulp.src(resource, { base: '.' }).pipe(rename(resource)));\n\t\t}\n\n\t\tconst all = es.merge(\n\t\t\tpackageJsonStream,\n\t\t\tproductJsonStream,\n\t\t\tlicense,\n\t\t\tsources,\n\t\t\tdeps,\n\t\t\tnode,\n\t\t\t...web\n\t\t);\n\n\t\tlet result = all\n\t\t\t.pipe(util.skipDirectories())\n\t\t\t.pipe(util.fixWin32DirectoryPermissions());\n\n\t\tif (platform === 'win32') {\n\t\t\tresult = es.merge(result,\n\t\t\t\tgulp.src('resources/server/bin/remote-cli/code.cmd', { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/remote-cli/${product.applicationName}.cmd`)),\n\t\t\t\tgulp.src('resources/server/bin/helpers/browser.cmd', { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/helpers/browser.cmd`)),\n\t\t\t\tgulp.src('resources/server/bin/code-server.cmd', { base: '.' })\n\t\t\t\t\t.pipe(rename(`bin/${product.serverApplicationName}.cmd`)),\n\t\t\t);\n\t\t} else if (platform === 'linux' || platform === 'alpine' || platform === 'darwin') {\n\t\t\tresult = es.merge(result,\n\t\t\t\tgulp.src(`resources/server/bin/remote-cli/${platform === 'darwin' ? 'code-darwin.sh' : 'code-linux.sh'}`, { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/remote-cli/${product.applicationName}`))\n\t\t\t\t\t.pipe(util.setExecutableBit()),\n\t\t\t\tgulp.src(`resources/server/bin/helpers/${platform === 'darwin' ? 'browser-darwin.sh' : 'browser-linux.sh'}`, { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/helpers/browser.sh`))\n\t\t\t\t\t.pipe(util.setExecutableBit()),\n\t\t\t\tgulp.src(`resources/server/bin/${platform === 'darwin' ? 'code-server-darwin.sh' : 'code-server-linux.sh'}`, { base: '.' })\n\t\t\t\t\t.pipe(rename(`bin/${product.serverApplicationName}`))\n\t\t\t\t\t.pipe(util.setExecutableBit())\n\t\t\t);\n\t\t}\n\n\t\treturn result.pipe(vfs.dest(destination));\n\t};\n}\n\n/**\n * @param {object} product The parsed product.json file contents\n */\nfunction tweakProductForServerWeb(product) {\n\tconst result = { ...product };\n\tdelete result.webEndpointUrlTemplate;\n\treturn result;\n}\n\n['reh', 'reh-web'].forEach(type => {\n\tconst optimizeTask = task.define(`optimize-vscode-${type}`, task.series(\n\t\tutil.rimraf(`out-vscode-${type}`),\n\t\toptimize.optimizeTask(\n\t\t\t{\n\t\t\t\tout: `out-vscode-${type}`,\n\t\t\t\tamd: {\n\t\t\t\t\tsrc: 'out-build',\n\t\t\t\t\tentryPoints: (type === 'reh' ? serverEntryPoints : serverWithWebEntryPoints).flat(),\n\t\t\t\t\totherSources: [],\n\t\t\t\t\tresources: type === 'reh' ? serverResources : serverWithWebResources,\n\t\t\t\t\tloaderConfig: optimize.loaderConfig(),\n\t\t\t\t\tinlineAmdImages: true,\n\t\t\t\t\tbundleInfo: undefined,\n\t\t\t\t\tfileContentMapper: createVSCodeWebFileContentMapper('.build/extensions', type === 'reh-web' ? tweakProductForServerWeb(product) : product)\n\t\t\t\t},\n\t\t\t\tcommonJS: {\n\t\t\t\t\tsrc: 'out-build',\n\t\t\t\t\tentryPoints: [\n\t\t\t\t\t\t'out-build/server-main.js',\n\t\t\t\t\t\t'out-build/server-cli.js'\n\t\t\t\t\t],\n\t\t\t\t\tplatform: 'node',\n\t\t\t\t\texternal: [\n\t\t\t\t\t\t'minimist',\n\t\t\t\t\t\t// TODO: we cannot inline `product.json` because\n\t\t\t\t\t\t// it is being changed during build time at a later\n\t\t\t\t\t\t// point in time (such as `checksums`)\n\t\t\t\t\t\t'../product.json',\n\t\t\t\t\t\t'../package.json'\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t)\n\t));\n\n\tconst minifyTask = task.define(`minify-vscode-${type}`, task.series(\n\t\toptimizeTask,\n\t\tutil.rimraf(`out-vscode-${type}-min`),\n\t\toptimize.minifyTask(`out-vscode-${type}`, `https://ticino.blob.core.windows.net/sourcemaps/${commit}/core`)\n\t));\n\tgulp.task(minifyTask);\n\n\tBUILD_TARGETS.forEach(buildTarget => {\n\t\tconst dashed = (str) => (str ? `-${str}` : ``);\n\t\tconst platform = buildTarget.platform;\n\t\tconst arch = buildTarget.arch;\n\n\t\t['', 'min'].forEach(minified => {\n\t\t\tconst sourceFolderName = `out-vscode-${type}${dashed(minified)}`;\n\t\t\tconst destinationFolderName = `vscode-${type}${dashed(platform)}${dashed(arch)}`;\n\n\t\t\tconst serverTaskCI = task.define(`vscode-${type}${dashed(platform)}${dashed(arch)}${dashed(minified)}-ci`, task.series(\n\t\t\t\tgulp.task(`node-${platform}-${arch}`),\n\t\t\t\tutil.rimraf(path.join(BUILD_ROOT, destinationFolderName)),\n\t\t\t\tpackageTask(type, platform, arch, sourceFolderName, destinationFolderName)\n\t\t\t));\n\t\t\tgulp.task(serverTaskCI);\n\n\t\t\tconst serverTask = task.define(`vscode-${type}${dashed(platform)}${dashed(arch)}${dashed(minified)}`, task.series(\n\t\t\t\tcompileBuildTask,\n\t\t\t\tcompileExtensionsBuildTask,\n\t\t\t\tcompileExtensionMediaBuildTask,\n\t\t\t\tminified ? minifyTask : optimizeTask,\n\t\t\t\tserverTaskCI\n\t\t\t));\n\t\t\tgulp.task(serverTask);\n\t\t});\n\t});\n});\n",
		"fileName": "./2.js"
	},
	"diffs": [
		{
			"originalRange": "[141,141)",
			"modifiedRange": "[141,142)",
			"innerChanges": [
				{
					"originalRange": "[141,1 -> 141,1]",
					"modifiedRange": "[141,1 -> 142,1]"
				}
			]
		},
		{
			"originalRange": "[144,148)",
			"modifiedRange": "[145,145)",
			"innerChanges": [
				{
					"originalRange": "[144,1 -> 148,1]",
					"modifiedRange": "[145,1 -> 145,1]"
				}
			]
		},
		{
			"originalRange": "[159,159)",
			"modifiedRange": "[156,163)",
			"innerChanges": [
				{
					"originalRange": "[159,1 -> 159,1 EOL]",
					"modifiedRange": "[156,1 -> 163,1 EOL]"
				}
			]
		},
		{
			"originalRange": "[222,234)",
			"modifiedRange": "[226,234)",
			"innerChanges": [
				{
					"originalRange": "[222,17 -> 234,1]",
					"modifiedRange": "[226,17 -> 234,1]"
				}
			]
		}
	],
	"moves": [
		{
			"originalRange": "[223,226)",
			"modifiedRange": "[158,161)",
			"changes": [
				{
					"originalRange": "[223,226)",
					"modifiedRange": "[158,161)",
					"innerChanges": [
						{
							"originalRange": "[223,1 -> 223,3]",
							"modifiedRange": "[158,1 -> 158,1]"
						},
						{
							"originalRange": "[224,1 -> 224,3]",
							"modifiedRange": "[159,1 -> 159,1]"
						},
						{
							"originalRange": "[225,1 -> 225,3]",
							"modifiedRange": "[160,1 -> 160,1]"
						}
					]
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/difficult-move/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/difficult-move/legacy.expected.diff.json

```json
{
	"original": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\n'use strict';\n\nconst gulp = require('gulp');\nconst path = require('path');\nconst es = require('event-stream');\nconst util = require('./lib/util');\nconst { getVersion } = require('./lib/getVersion');\nconst task = require('./lib/task');\nconst optimize = require('./lib/optimize');\nconst product = require('../product.json');\nconst rename = require('gulp-rename');\nconst replace = require('gulp-replace');\nconst filter = require('gulp-filter');\nconst { getProductionDependencies } = require('./lib/dependencies');\nconst vfs = require('vinyl-fs');\nconst packageJson = require('../package.json');\nconst flatmap = require('gulp-flatmap');\nconst gunzip = require('gulp-gunzip');\nconst File = require('vinyl');\nconst fs = require('fs');\nconst glob = require('glob');\nconst { compileBuildTask } = require('./gulpfile.compile');\nconst { compileExtensionsBuildTask, compileExtensionMediaBuildTask } = require('./gulpfile.extensions');\nconst { vscodeWebEntryPoints, vscodeWebResourceIncludes, createVSCodeWebFileContentMapper } = require('./gulpfile.vscode.web');\nconst cp = require('child_process');\nconst log = require('fancy-log');\n\nconst REPO_ROOT = path.dirname(__dirname);\nconst commit = getVersion(REPO_ROOT);\nconst BUILD_ROOT = path.dirname(REPO_ROOT);\nconst REMOTE_FOLDER = path.join(REPO_ROOT, 'remote');\n\n// Targets\n\nconst BUILD_TARGETS = [\n\t{ platform: 'win32', arch: 'ia32' },\n\t{ platform: 'win32', arch: 'x64' },\n\t{ platform: 'darwin', arch: 'x64' },\n\t{ platform: 'darwin', arch: 'arm64' },\n\t{ platform: 'linux', arch: 'x64' },\n\t{ platform: 'linux', arch: 'armhf' },\n\t{ platform: 'linux', arch: 'arm64' },\n\t{ platform: 'alpine', arch: 'arm64' },\n\t// legacy: we use to ship only one alpine so it was put in the arch, but now we ship\n\t// multiple alpine images and moved to a better model (alpine as the platform)\n\t{ platform: 'linux', arch: 'alpine' },\n];\n\nconst serverResources = [\n\n\t// Bootstrap\n\t'out-build/bootstrap.js',\n\t'out-build/bootstrap-fork.js',\n\t'out-build/bootstrap-amd.js',\n\t'out-build/bootstrap-node.js',\n\n\t// Performance\n\t'out-build/vs/base/common/performance.js',\n\n\t// Watcher\n\t'out-build/vs/platform/files/**/*.exe',\n\t'out-build/vs/platform/files/**/*.md',\n\n\t// Process monitor\n\t'out-build/vs/base/node/cpuUsage.sh',\n\t'out-build/vs/base/node/ps.sh',\n\n\t// Terminal shell integration\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration.ps1',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-bash.sh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-env.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-profile.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-rc.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-login.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/fish_xdg_data/fish/vendor_conf.d/shellIntegration.fish',\n\n\t'!**/test/**'\n];\n\nconst serverWithWebResources = [\n\n\t// Include all of server...\n\t...serverResources,\n\n\t// ...and all of web\n\t...vscodeWebResourceIncludes\n];\n\nconst serverEntryPoints = [\n\t{\n\t\tname: 'vs/server/node/server.main',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/server/node/server.cli',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/workbench/api/node/extensionHostProcess',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/platform/files/node/watcher/watcherMain',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/platform/terminal/node/ptyHostMain',\n\t\texclude: ['vs/css', 'vs/nls']\n\t}\n];\n\nconst serverWithWebEntryPoints = [\n\n\t// Include all of server\n\t...serverEntryPoints,\n\n\t// Include workbench web\n\t...vscodeWebEntryPoints\n];\n\nfunction getNodeVersion() {\n\tconst yarnrc = fs.readFileSync(path.join(REPO_ROOT, 'remote', '.yarnrc'), 'utf8');\n\tconst nodeVersion = /^target \"(.*)\"$/m.exec(yarnrc)[1];\n\tconst internalNodeVersion = /^ms_build_id \"(.*)\"$/m.exec(yarnrc)[1];\n\treturn { nodeVersion, internalNodeVersion };\n}\n\nfunction getNodeChecksum(nodeVersion, platform, arch) {\n\tlet expectedName;\n\tswitch (platform) {\n\t\tcase 'win32':\n\t\t\texpectedName = `win-${arch}/node.exe`;\n\t\t\tbreak;\n\n\t\tcase 'darwin':\n\t\tcase 'linux':\n\t\t\texpectedName = `node-v${nodeVersion}-${platform}-${arch}.tar.gz`;\n\t\t\tbreak;\n\n\t\tcase 'alpine':\n\t\t\texpectedName = `${platform}-${arch}/node`;\n\t\t\tbreak;\n\t}\n\n\tconst nodeJsChecksums = fs.readFileSync(path.join(REPO_ROOT, 'build', 'checksums', 'nodejs.txt'), 'utf8');\n\tfor (const line of nodeJsChecksums.split('\\n')) {\n\t\tconst [checksum, name] = line.split(/\\s+/);\n\t\tif (name === expectedName) {\n\t\t\treturn checksum;\n\t\t}\n\t}\n\treturn undefined;\n}\n\nconst { nodeVersion, internalNodeVersion } = getNodeVersion();\n\nBUILD_TARGETS.forEach(({ platform, arch }) => {\n\tgulp.task(task.define(`node-${platform}-${arch}`, () => {\n\t\tconst nodePath = path.join('.build', 'node', `v${nodeVersion}`, `${platform}-${arch}`);\n\n\t\tif (!fs.existsSync(nodePath)) {\n\t\t\tutil.rimraf(nodePath);\n\n\t\t\treturn nodejs(platform, arch)\n\t\t\t\t.pipe(vfs.dest(nodePath));\n\t\t}\n\n\t\treturn Promise.resolve(null);\n\t}));\n});\n\nconst defaultNodeTask = gulp.task(`node-${process.platform}-${process.arch}`);\n\nif (defaultNodeTask) {\n\tgulp.task(task.define('node', defaultNodeTask));\n}\n\nfunction nodejs(platform, arch) {\n\tconst { fetchUrls, fetchGithub } = require('./lib/fetch');\n\tconst untar = require('gulp-untar');\n\tconst crypto = require('crypto');\n\n\tif (arch === 'ia32') {\n\t\tarch = 'x86';\n\t} else if (arch === 'armhf') {\n\t\tarch = 'armv7l';\n\t} else if (arch === 'alpine') {\n\t\tplatform = 'alpine';\n\t\tarch = 'x64';\n\t}\n\n\tlog(`Downloading node.js ${nodeVersion} ${platform} ${arch} from ${product.nodejsRepository}...`);\n\n\tconst checksumSha256 = getNodeChecksum(nodeVersion, platform, arch);\n\n\tif (checksumSha256) {\n\t\tlog(`Using SHA256 checksum for checking integrity: ${checksumSha256}`);\n\t} else {\n\t\tlog.warn(`Unable to verify integrity of downloaded node.js binary because no SHA256 checksum was found!`);\n\t}\n\n\tswitch (platform) {\n\t\tcase 'win32':\n\t\t\treturn (product.nodejsRepository !== 'https://nodejs.org' ?\n\t\t\t\tfetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `win-${arch}-node.exe`, checksumSha256 }) :\n\t\t\t\tfetchUrls(`/dist/v${nodeVersion}/win-${arch}/node.exe`, { base: 'https://nodejs.org', checksumSha256 }))\n\t\t\t\t.pipe(rename('node.exe'));\n\t\tcase 'darwin':\n\t\tcase 'linux':\n\t\t\treturn (product.nodejsRepository !== 'https://nodejs.org' ?\n\t\t\t\tfetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `node-v${nodeVersion}-${platform}-${arch}.tar.gz`, checksumSha256 }) :\n\t\t\t\tfetchUrls(`/dist/v${nodeVersion}/node-v${nodeVersion}-${platform}-${arch}.tar.gz`, { base: 'https://nodejs.org', checksumSha256 })\n\t\t\t).pipe(flatmap(stream => stream.pipe(gunzip()).pipe(untar())))\n\t\t\t\t.pipe(filter('**/node'))\n\t\t\t\t.pipe(util.setExecutableBit('**'))\n\t\t\t\t.pipe(rename('node'));\n\t\tcase 'alpine': {\n\t\t\tconst imageName = arch === 'arm64' ? 'arm64v8/node' : 'node';\n\t\t\tlog(`Downloading node.js ${nodeVersion} ${platform} ${arch} from docker image ${imageName}`);\n\t\t\tconst contents = cp.execSync(`docker run --rm ${imageName}:${nodeVersion}-alpine /bin/sh -c 'cat \\`which node\\`'`, { maxBuffer: 100 * 1024 * 1024, encoding: 'buffer' });\n\t\t\tif (checksumSha256) {\n\t\t\t\tconst actualSHA256Checksum = crypto.createHash('sha256').update(contents).digest('hex');\n\t\t\t\tif (actualSHA256Checksum !== checksumSha256) {\n\t\t\t\t\tthrow new Error(`Checksum mismatch for node.js from docker image (expected ${options.checksumSha256}, actual ${actualSHA256Checksum}))`);\n\t\t\t\t}\n\t\t\t}\n\t\t\treturn es.readArray([new File({ path: 'node', contents, stat: { mode: parseInt('755', 8) } })]);\n\t\t}\n\t}\n}\n\nfunction packageTask(type, platform, arch, sourceFolderName, destinationFolderName) {\n\tconst destination = path.join(BUILD_ROOT, destinationFolderName);\n\n\treturn () => {\n\t\tconst json = require('gulp-json-editor');\n\n\t\tconst src = gulp.src(sourceFolderName + '/**', { base: '.' })\n\t\t\t.pipe(rename(function (path) { path.dirname = path.dirname.replace(new RegExp('^' + sourceFolderName), 'out'); }))\n\t\t\t.pipe(util.setExecutableBit(['**/*.sh']))\n\t\t\t.pipe(filter(['**', '!**/*.js.map']));\n\n\t\tconst workspaceExtensionPoints = ['debuggers', 'jsonValidation'];\n\t\tconst isUIExtension = (manifest) => {\n\t\t\tswitch (manifest.extensionKind) {\n\t\t\t\tcase 'ui': return true;\n\t\t\t\tcase 'workspace': return false;\n\t\t\t\tdefault: {\n\t\t\t\t\tif (manifest.main) {\n\t\t\t\t\t\treturn false;\n\t\t\t\t\t}\n\t\t\t\t\tif (manifest.contributes && Object.keys(manifest.contributes).some(key => workspaceExtensionPoints.indexOf(key) !== -1)) {\n\t\t\t\t\t\treturn false;\n\t\t\t\t\t}\n\t\t\t\t\t// Default is UI Extension\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\t\t\t}\n\t\t};\n\t\tconst localWorkspaceExtensions = glob.sync('extensions/*/package.json')\n\t\t\t.filter((extensionPath) => {\n\t\t\t\tif (type === 'reh-web') {\n\t\t\t\t\treturn true; // web: ship all extensions for now\n\t\t\t\t}\n\n\t\t\t\t// Skip shipping UI extensions because the client side will have them anyways\n\t\t\t\t// and they'd just increase the download without being used\n\t\t\t\tconst manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, extensionPath)).toString());\n\t\t\t\treturn !isUIExtension(manifest);\n\t\t\t}).map((extensionPath) => path.basename(path.dirname(extensionPath)))\n\t\t\t.filter(name => name !== 'vscode-api-tests' && name !== 'vscode-test-resolver'); // Do not ship the test extensions\n\t\tconst marketplaceExtensions = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'product.json'), 'utf8')).builtInExtensions\n\t\t\t.filter(entry => !entry.platforms || new Set(entry.platforms).has(platform))\n\t\t\t.filter(entry => !entry.clientOnly)\n\t\t\t.map(entry => entry.name);\n\t\tconst extensionPaths = [...localWorkspaceExtensions, ...marketplaceExtensions]\n\t\t\t.map(name => `.build/extensions/${name}/**`);\n\n\t\tconst extensions = gulp.src(extensionPaths, { base: '.build', dot: true });\n\t\tconst extensionsCommonDependencies = gulp.src('.build/extensions/node_modules/**', { base: '.build', dot: true });\n\t\tconst sources = es.merge(src, extensions, extensionsCommonDependencies)\n\t\t\t.pipe(filter(['**', '!**/*.js.map'], { dot: true }));\n\n\t\tlet version = packageJson.version;\n\t\tconst quality = product.quality;\n\n\t\tif (quality && quality !== 'stable') {\n\t\t\tversion += '-' + quality;\n\t\t}\n\n\t\tconst name = product.nameShort;\n\t\tconst packageJsonStream = gulp.src(['remote/package.json'], { base: 'remote' })\n\t\t\t.pipe(json({ name, version, dependencies: undefined, optionalDependencies: undefined }));\n\n\t\tconst date = new Date().toISOString();\n\n\t\tconst productJsonStream = gulp.src(['product.json'], { base: '.' })\n\t\t\t.pipe(json({ commit, date, version }));\n\n\t\tconst license = gulp.src(['remote/LICENSE'], { base: 'remote', allowEmpty: true });\n\n\t\tconst jsFilter = util.filter(data => !data.isDirectory() && /\\.js$/.test(data.path));\n\n\t\tconst productionDependencies = getProductionDependencies(REMOTE_FOLDER);\n\t\tconst dependenciesSrc = productionDependencies.map(d => path.relative(REPO_ROOT, d.path)).map(d => [`${d}/**`, `!${d}/**/{test,tests}/**`, `!${d}/.bin/**`]).flat();\n\t\tconst deps = gulp.src(dependenciesSrc, { base: 'remote', dot: true })\n\t\t\t// filter out unnecessary files, no source maps in server build\n\t\t\t.pipe(filter(['**', '!**/package-lock.json', '!**/yarn.lock', '!**/*.js.map']))\n\t\t\t.pipe(util.cleanNodeModules(path.join(__dirname, '.moduleignore')))\n\t\t\t.pipe(util.cleanNodeModules(path.join(__dirname, `.moduleignore.${process.platform}`)))\n\t\t\t.pipe(jsFilter)\n\t\t\t.pipe(util.stripSourceMappingURL())\n\t\t\t.pipe(jsFilter.restore);\n\n\t\tconst nodePath = `.build/node/v${nodeVersion}/${platform}-${arch}`;\n\t\tconst node = gulp.src(`${nodePath}/**`, { base: nodePath, dot: true });\n\n\t\tlet web = [];\n\t\tif (type === 'reh-web') {\n\t\t\tweb = [\n\t\t\t\t'resources/server/favicon.ico',\n\t\t\t\t'resources/server/code-192.png',\n\t\t\t\t'resources/server/code-512.png',\n\t\t\t\t'resources/server/manifest.json'\n\t\t\t].map(resource => gulp.src(resource, { base: '.' }).pipe(rename(resource)));\n\t\t}\n\n\t\tconst all = es.merge(\n\t\t\tpackageJsonStream,\n\t\t\tproductJsonStream,\n\t\t\tlicense,\n\t\t\tsources,\n\t\t\tdeps,\n\t\t\tnode,\n\t\t\t...web\n\t\t);\n\n\t\tlet result = all\n\t\t\t.pipe(util.skipDirectories())\n\t\t\t.pipe(util.fixWin32DirectoryPermissions());\n\n\t\tif (platform === 'win32') {\n\t\t\tresult = es.merge(result,\n\t\t\t\tgulp.src('resources/server/bin/remote-cli/code.cmd', { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/remote-cli/${product.applicationName}.cmd`)),\n\t\t\t\tgulp.src('resources/server/bin/helpers/browser.cmd', { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/helpers/browser.cmd`)),\n\t\t\t\tgulp.src('resources/server/bin/code-server.cmd', { base: '.' })\n\t\t\t\t\t.pipe(rename(`bin/${product.serverApplicationName}.cmd`)),\n\t\t\t);\n\t\t} else if (platform === 'linux' || platform === 'alpine' || platform === 'darwin') {\n\t\t\tresult = es.merge(result,\n\t\t\t\tgulp.src(`resources/server/bin/remote-cli/${platform === 'darwin' ? 'code-darwin.sh' : 'code-linux.sh'}`, { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/remote-cli/${product.applicationName}`))\n\t\t\t\t\t.pipe(util.setExecutableBit()),\n\t\t\t\tgulp.src(`resources/server/bin/helpers/${platform === 'darwin' ? 'browser-darwin.sh' : 'browser-linux.sh'}`, { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/helpers/browser.sh`))\n\t\t\t\t\t.pipe(util.setExecutableBit()),\n\t\t\t\tgulp.src(`resources/server/bin/${platform === 'darwin' ? 'code-server-darwin.sh' : 'code-server-linux.sh'}`, { base: '.' })\n\t\t\t\t\t.pipe(rename(`bin/${product.serverApplicationName}`))\n\t\t\t\t\t.pipe(util.setExecutableBit())\n\t\t\t);\n\t\t}\n\n\t\treturn result.pipe(vfs.dest(destination));\n\t};\n}\n\n/**\n * @param {object} product The parsed product.json file contents\n */\nfunction tweakProductForServerWeb(product) {\n\tconst result = { ...product };\n\tdelete result.webEndpointUrlTemplate;\n\treturn result;\n}\n\n['reh', 'reh-web'].forEach(type => {\n\tconst optimizeTask = task.define(`optimize-vscode-${type}`, task.series(\n\t\tutil.rimraf(`out-vscode-${type}`),\n\t\toptimize.optimizeTask(\n\t\t\t{\n\t\t\t\tout: `out-vscode-${type}`,\n\t\t\t\tamd: {\n\t\t\t\t\tsrc: 'out-build',\n\t\t\t\t\tentryPoints: (type === 'reh' ? serverEntryPoints : serverWithWebEntryPoints).flat(),\n\t\t\t\t\totherSources: [],\n\t\t\t\t\tresources: type === 'reh' ? serverResources : serverWithWebResources,\n\t\t\t\t\tloaderConfig: optimize.loaderConfig(),\n\t\t\t\t\tinlineAmdImages: true,\n\t\t\t\t\tbundleInfo: undefined,\n\t\t\t\t\tfileContentMapper: createVSCodeWebFileContentMapper('.build/extensions', type === 'reh-web' ? tweakProductForServerWeb(product) : product)\n\t\t\t\t},\n\t\t\t\tcommonJS: {\n\t\t\t\t\tsrc: 'out-build',\n\t\t\t\t\tentryPoints: [\n\t\t\t\t\t\t'out-build/server-main.js',\n\t\t\t\t\t\t'out-build/server-cli.js'\n\t\t\t\t\t],\n\t\t\t\t\tplatform: 'node',\n\t\t\t\t\texternal: [\n\t\t\t\t\t\t'minimist',\n\t\t\t\t\t\t// TODO: we cannot inline `product.json` because\n\t\t\t\t\t\t// it is being changed during build time at a later\n\t\t\t\t\t\t// point in time (such as `checksums`)\n\t\t\t\t\t\t'../product.json',\n\t\t\t\t\t\t'../package.json'\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t)\n\t));\n\n\tconst minifyTask = task.define(`minify-vscode-${type}`, task.series(\n\t\toptimizeTask,\n\t\tutil.rimraf(`out-vscode-${type}-min`),\n\t\toptimize.minifyTask(`out-vscode-${type}`, `https://ticino.blob.core.windows.net/sourcemaps/${commit}/core`)\n\t));\n\tgulp.task(minifyTask);\n\n\tBUILD_TARGETS.forEach(buildTarget => {\n\t\tconst dashed = (str) => (str ? `-${str}` : ``);\n\t\tconst platform = buildTarget.platform;\n\t\tconst arch = buildTarget.arch;\n\n\t\t['', 'min'].forEach(minified => {\n\t\t\tconst sourceFolderName = `out-vscode-${type}${dashed(minified)}`;\n\t\t\tconst destinationFolderName = `vscode-${type}${dashed(platform)}${dashed(arch)}`;\n\n\t\t\tconst serverTaskCI = task.define(`vscode-${type}${dashed(platform)}${dashed(arch)}${dashed(minified)}-ci`, task.series(\n\t\t\t\tgulp.task(`node-${platform}-${arch}`),\n\t\t\t\tutil.rimraf(path.join(BUILD_ROOT, destinationFolderName)),\n\t\t\t\tpackageTask(type, platform, arch, sourceFolderName, destinationFolderName)\n\t\t\t));\n\t\t\tgulp.task(serverTaskCI);\n\n\t\t\tconst serverTask = task.define(`vscode-${type}${dashed(platform)}${dashed(arch)}${dashed(minified)}`, task.series(\n\t\t\t\tcompileBuildTask,\n\t\t\t\tcompileExtensionsBuildTask,\n\t\t\t\tcompileExtensionMediaBuildTask,\n\t\t\t\tminified ? minifyTask : optimizeTask,\n\t\t\t\tserverTaskCI\n\t\t\t));\n\t\t\tgulp.task(serverTask);\n\t\t});\n\t});\n});\n",
		"fileName": "./1.js"
	},
	"modified": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\n'use strict';\n\nconst gulp = require('gulp');\nconst path = require('path');\nconst es = require('event-stream');\nconst util = require('./lib/util');\nconst { getVersion } = require('./lib/getVersion');\nconst task = require('./lib/task');\nconst optimize = require('./lib/optimize');\nconst product = require('../product.json');\nconst rename = require('gulp-rename');\nconst replace = require('gulp-replace');\nconst filter = require('gulp-filter');\nconst { getProductionDependencies } = require('./lib/dependencies');\nconst vfs = require('vinyl-fs');\nconst packageJson = require('../package.json');\nconst flatmap = require('gulp-flatmap');\nconst gunzip = require('gulp-gunzip');\nconst File = require('vinyl');\nconst fs = require('fs');\nconst glob = require('glob');\nconst { compileBuildTask } = require('./gulpfile.compile');\nconst { compileExtensionsBuildTask, compileExtensionMediaBuildTask } = require('./gulpfile.extensions');\nconst { vscodeWebEntryPoints, vscodeWebResourceIncludes, createVSCodeWebFileContentMapper } = require('./gulpfile.vscode.web');\nconst cp = require('child_process');\nconst log = require('fancy-log');\n\nconst REPO_ROOT = path.dirname(__dirname);\nconst commit = getVersion(REPO_ROOT);\nconst BUILD_ROOT = path.dirname(REPO_ROOT);\nconst REMOTE_FOLDER = path.join(REPO_ROOT, 'remote');\n\n// Targets\n\nconst BUILD_TARGETS = [\n\t{ platform: 'win32', arch: 'ia32' },\n\t{ platform: 'win32', arch: 'x64' },\n\t{ platform: 'darwin', arch: 'x64' },\n\t{ platform: 'darwin', arch: 'arm64' },\n\t{ platform: 'linux', arch: 'x64' },\n\t{ platform: 'linux', arch: 'armhf' },\n\t{ platform: 'linux', arch: 'arm64' },\n\t{ platform: 'alpine', arch: 'arm64' },\n\t// legacy: we use to ship only one alpine so it was put in the arch, but now we ship\n\t// multiple alpine images and moved to a better model (alpine as the platform)\n\t{ platform: 'linux', arch: 'alpine' },\n];\n\nconst serverResources = [\n\n\t// Bootstrap\n\t'out-build/bootstrap.js',\n\t'out-build/bootstrap-fork.js',\n\t'out-build/bootstrap-amd.js',\n\t'out-build/bootstrap-node.js',\n\n\t// Performance\n\t'out-build/vs/base/common/performance.js',\n\n\t// Watcher\n\t'out-build/vs/platform/files/**/*.exe',\n\t'out-build/vs/platform/files/**/*.md',\n\n\t// Process monitor\n\t'out-build/vs/base/node/cpuUsage.sh',\n\t'out-build/vs/base/node/ps.sh',\n\n\t// Terminal shell integration\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration.ps1',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-bash.sh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-env.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-profile.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-rc.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/shellIntegration-login.zsh',\n\t'out-build/vs/workbench/contrib/terminal/browser/media/fish_xdg_data/fish/vendor_conf.d/shellIntegration.fish',\n\n\t'!**/test/**'\n];\n\nconst serverWithWebResources = [\n\n\t// Include all of server...\n\t...serverResources,\n\n\t// ...and all of web\n\t...vscodeWebResourceIncludes\n];\n\nconst serverEntryPoints = [\n\t{\n\t\tname: 'vs/server/node/server.main',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/server/node/server.cli',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/workbench/api/node/extensionHostProcess',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/platform/files/node/watcher/watcherMain',\n\t\texclude: ['vs/css', 'vs/nls']\n\t},\n\t{\n\t\tname: 'vs/platform/terminal/node/ptyHostMain',\n\t\texclude: ['vs/css', 'vs/nls']\n\t}\n];\n\nconst serverWithWebEntryPoints = [\n\n\t// Include all of server\n\t...serverEntryPoints,\n\n\t// Include workbench web\n\t...vscodeWebEntryPoints\n];\n\nfunction getNodeVersion() {\n\tconst yarnrc = fs.readFileSync(path.join(REPO_ROOT, 'remote', '.yarnrc'), 'utf8');\n\tconst nodeVersion = /^target \"(.*)\"$/m.exec(yarnrc)[1];\n\tconst internalNodeVersion = /^ms_build_id \"(.*)\"$/m.exec(yarnrc)[1];\n\treturn { nodeVersion, internalNodeVersion };\n}\n\nfunction getNodeChecksum(nodeVersion, platform, arch) {\n\tlet expectedName;\n\tswitch (platform) {\n\t\tcase 'win32':\n\t\t\texpectedName = `win-${arch}/node.exe`;\n\t\t\tbreak;\n\n\t\tcase 'darwin':\n\t\tcase 'alpine':\n\t\tcase 'linux':\n\t\t\texpectedName = `node-v${nodeVersion}-${platform}-${arch}.tar.gz`;\n\t\t\tbreak;\n\t}\n\n\tconst nodeJsChecksums = fs.readFileSync(path.join(REPO_ROOT, 'build', 'checksums', 'nodejs.txt'), 'utf8');\n\tfor (const line of nodeJsChecksums.split('\\n')) {\n\t\tconst [checksum, name] = line.split(/\\s+/);\n\t\tif (name === expectedName) {\n\t\t\treturn checksum;\n\t\t}\n\t}\n\treturn undefined;\n}\n\nfunction extractAlpinefromDocker(nodeVersion, platform, arch) {\n\tconst imageName = arch === 'arm64' ? 'arm64v8/node' : 'node';\n\tlog(`Downloading node.js ${nodeVersion} ${platform} ${arch} from docker image ${imageName}`);\n\tconst contents = cp.execSync(`docker run --rm ${imageName}:${nodeVersion}-alpine /bin/sh -c 'cat \\`which node\\`'`, { maxBuffer: 100 * 1024 * 1024, encoding: 'buffer' });\n\treturn es.readArray([new File({ path: 'node', contents, stat: { mode: parseInt('755', 8) } })]);\n}\n\nconst { nodeVersion, internalNodeVersion } = getNodeVersion();\n\nBUILD_TARGETS.forEach(({ platform, arch }) => {\n\tgulp.task(task.define(`node-${platform}-${arch}`, () => {\n\t\tconst nodePath = path.join('.build', 'node', `v${nodeVersion}`, `${platform}-${arch}`);\n\n\t\tif (!fs.existsSync(nodePath)) {\n\t\t\tutil.rimraf(nodePath);\n\n\t\t\treturn nodejs(platform, arch)\n\t\t\t\t.pipe(vfs.dest(nodePath));\n\t\t}\n\n\t\treturn Promise.resolve(null);\n\t}));\n});\n\nconst defaultNodeTask = gulp.task(`node-${process.platform}-${process.arch}`);\n\nif (defaultNodeTask) {\n\tgulp.task(task.define('node', defaultNodeTask));\n}\n\nfunction nodejs(platform, arch) {\n\tconst { fetchUrls, fetchGithub } = require('./lib/fetch');\n\tconst untar = require('gulp-untar');\n\tconst crypto = require('crypto');\n\n\tif (arch === 'ia32') {\n\t\tarch = 'x86';\n\t} else if (arch === 'armhf') {\n\t\tarch = 'armv7l';\n\t} else if (arch === 'alpine') {\n\t\tplatform = 'alpine';\n\t\tarch = 'x64';\n\t}\n\n\tlog(`Downloading node.js ${nodeVersion} ${platform} ${arch} from ${product.nodejsRepository}...`);\n\n\tconst checksumSha256 = getNodeChecksum(nodeVersion, platform, arch);\n\n\tif (checksumSha256) {\n\t\tlog(`Using SHA256 checksum for checking integrity: ${checksumSha256}`);\n\t} else {\n\t\tlog.warn(`Unable to verify integrity of downloaded node.js binary because no SHA256 checksum was found!`);\n\t}\n\n\tswitch (platform) {\n\t\tcase 'win32':\n\t\t\treturn (product.nodejsRepository !== 'https://nodejs.org' ?\n\t\t\t\tfetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `win-${arch}-node.exe`, checksumSha256 }) :\n\t\t\t\tfetchUrls(`/dist/v${nodeVersion}/win-${arch}/node.exe`, { base: 'https://nodejs.org', checksumSha256 }))\n\t\t\t\t.pipe(rename('node.exe'));\n\t\tcase 'darwin':\n\t\tcase 'linux':\n\t\t\treturn (product.nodejsRepository !== 'https://nodejs.org' ?\n\t\t\t\tfetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `node-v${nodeVersion}-${platform}-${arch}.tar.gz`, checksumSha256 }) :\n\t\t\t\tfetchUrls(`/dist/v${nodeVersion}/node-v${nodeVersion}-${platform}-${arch}.tar.gz`, { base: 'https://nodejs.org', checksumSha256 })\n\t\t\t).pipe(flatmap(stream => stream.pipe(gunzip()).pipe(untar())))\n\t\t\t\t.pipe(filter('**/node'))\n\t\t\t\t.pipe(util.setExecutableBit('**'))\n\t\t\t\t.pipe(rename('node'));\n\t\tcase 'alpine':\n\t\t\treturn product.nodejsRepository !== 'https://nodejs.org' ?\n\t\t\t\tfetchGithub(product.nodejsRepository, { version: `${nodeVersion}-${internalNodeVersion}`, name: `node-v${nodeVersion}-${platform}-${arch}.tar.gz`, checksumSha256 })\n\t\t\t\t\t.pipe(flatmap(stream => stream.pipe(gunzip()).pipe(untar())))\n\t\t\t\t\t.pipe(filter('**/node'))\n\t\t\t\t\t.pipe(util.setExecutableBit('**'))\n\t\t\t\t\t.pipe(rename('node'))\n\t\t\t\t: extractAlpinefromDocker(nodeVersion, platform, arch);\n\t}\n}\n\nfunction packageTask(type, platform, arch, sourceFolderName, destinationFolderName) {\n\tconst destination = path.join(BUILD_ROOT, destinationFolderName);\n\n\treturn () => {\n\t\tconst json = require('gulp-json-editor');\n\n\t\tconst src = gulp.src(sourceFolderName + '/**', { base: '.' })\n\t\t\t.pipe(rename(function (path) { path.dirname = path.dirname.replace(new RegExp('^' + sourceFolderName), 'out'); }))\n\t\t\t.pipe(util.setExecutableBit(['**/*.sh']))\n\t\t\t.pipe(filter(['**', '!**/*.js.map']));\n\n\t\tconst workspaceExtensionPoints = ['debuggers', 'jsonValidation'];\n\t\tconst isUIExtension = (manifest) => {\n\t\t\tswitch (manifest.extensionKind) {\n\t\t\t\tcase 'ui': return true;\n\t\t\t\tcase 'workspace': return false;\n\t\t\t\tdefault: {\n\t\t\t\t\tif (manifest.main) {\n\t\t\t\t\t\treturn false;\n\t\t\t\t\t}\n\t\t\t\t\tif (manifest.contributes && Object.keys(manifest.contributes).some(key => workspaceExtensionPoints.indexOf(key) !== -1)) {\n\t\t\t\t\t\treturn false;\n\t\t\t\t\t}\n\t\t\t\t\t// Default is UI Extension\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\t\t\t}\n\t\t};\n\t\tconst localWorkspaceExtensions = glob.sync('extensions/*/package.json')\n\t\t\t.filter((extensionPath) => {\n\t\t\t\tif (type === 'reh-web') {\n\t\t\t\t\treturn true; // web: ship all extensions for now\n\t\t\t\t}\n\n\t\t\t\t// Skip shipping UI extensions because the client side will have them anyways\n\t\t\t\t// and they'd just increase the download without being used\n\t\t\t\tconst manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, extensionPath)).toString());\n\t\t\t\treturn !isUIExtension(manifest);\n\t\t\t}).map((extensionPath) => path.basename(path.dirname(extensionPath)))\n\t\t\t.filter(name => name !== 'vscode-api-tests' && name !== 'vscode-test-resolver'); // Do not ship the test extensions\n\t\tconst marketplaceExtensions = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'product.json'), 'utf8')).builtInExtensions\n\t\t\t.filter(entry => !entry.platforms || new Set(entry.platforms).has(platform))\n\t\t\t.filter(entry => !entry.clientOnly)\n\t\t\t.map(entry => entry.name);\n\t\tconst extensionPaths = [...localWorkspaceExtensions, ...marketplaceExtensions]\n\t\t\t.map(name => `.build/extensions/${name}/**`);\n\n\t\tconst extensions = gulp.src(extensionPaths, { base: '.build', dot: true });\n\t\tconst extensionsCommonDependencies = gulp.src('.build/extensions/node_modules/**', { base: '.build', dot: true });\n\t\tconst sources = es.merge(src, extensions, extensionsCommonDependencies)\n\t\t\t.pipe(filter(['**', '!**/*.js.map'], { dot: true }));\n\n\t\tlet version = packageJson.version;\n\t\tconst quality = product.quality;\n\n\t\tif (quality && quality !== 'stable') {\n\t\t\tversion += '-' + quality;\n\t\t}\n\n\t\tconst name = product.nameShort;\n\t\tconst packageJsonStream = gulp.src(['remote/package.json'], { base: 'remote' })\n\t\t\t.pipe(json({ name, version, dependencies: undefined, optionalDependencies: undefined }));\n\n\t\tconst date = new Date().toISOString();\n\n\t\tconst productJsonStream = gulp.src(['product.json'], { base: '.' })\n\t\t\t.pipe(json({ commit, date, version }));\n\n\t\tconst license = gulp.src(['remote/LICENSE'], { base: 'remote', allowEmpty: true });\n\n\t\tconst jsFilter = util.filter(data => !data.isDirectory() && /\\.js$/.test(data.path));\n\n\t\tconst productionDependencies = getProductionDependencies(REMOTE_FOLDER);\n\t\tconst dependenciesSrc = productionDependencies.map(d => path.relative(REPO_ROOT, d.path)).map(d => [`${d}/**`, `!${d}/**/{test,tests}/**`, `!${d}/.bin/**`]).flat();\n\t\tconst deps = gulp.src(dependenciesSrc, { base: 'remote', dot: true })\n\t\t\t// filter out unnecessary files, no source maps in server build\n\t\t\t.pipe(filter(['**', '!**/package-lock.json', '!**/yarn.lock', '!**/*.js.map']))\n\t\t\t.pipe(util.cleanNodeModules(path.join(__dirname, '.moduleignore')))\n\t\t\t.pipe(util.cleanNodeModules(path.join(__dirname, `.moduleignore.${process.platform}`)))\n\t\t\t.pipe(jsFilter)\n\t\t\t.pipe(util.stripSourceMappingURL())\n\t\t\t.pipe(jsFilter.restore);\n\n\t\tconst nodePath = `.build/node/v${nodeVersion}/${platform}-${arch}`;\n\t\tconst node = gulp.src(`${nodePath}/**`, { base: nodePath, dot: true });\n\n\t\tlet web = [];\n\t\tif (type === 'reh-web') {\n\t\t\tweb = [\n\t\t\t\t'resources/server/favicon.ico',\n\t\t\t\t'resources/server/code-192.png',\n\t\t\t\t'resources/server/code-512.png',\n\t\t\t\t'resources/server/manifest.json'\n\t\t\t].map(resource => gulp.src(resource, { base: '.' }).pipe(rename(resource)));\n\t\t}\n\n\t\tconst all = es.merge(\n\t\t\tpackageJsonStream,\n\t\t\tproductJsonStream,\n\t\t\tlicense,\n\t\t\tsources,\n\t\t\tdeps,\n\t\t\tnode,\n\t\t\t...web\n\t\t);\n\n\t\tlet result = all\n\t\t\t.pipe(util.skipDirectories())\n\t\t\t.pipe(util.fixWin32DirectoryPermissions());\n\n\t\tif (platform === 'win32') {\n\t\t\tresult = es.merge(result,\n\t\t\t\tgulp.src('resources/server/bin/remote-cli/code.cmd', { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/remote-cli/${product.applicationName}.cmd`)),\n\t\t\t\tgulp.src('resources/server/bin/helpers/browser.cmd', { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/helpers/browser.cmd`)),\n\t\t\t\tgulp.src('resources/server/bin/code-server.cmd', { base: '.' })\n\t\t\t\t\t.pipe(rename(`bin/${product.serverApplicationName}.cmd`)),\n\t\t\t);\n\t\t} else if (platform === 'linux' || platform === 'alpine' || platform === 'darwin') {\n\t\t\tresult = es.merge(result,\n\t\t\t\tgulp.src(`resources/server/bin/remote-cli/${platform === 'darwin' ? 'code-darwin.sh' : 'code-linux.sh'}`, { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/remote-cli/${product.applicationName}`))\n\t\t\t\t\t.pipe(util.setExecutableBit()),\n\t\t\t\tgulp.src(`resources/server/bin/helpers/${platform === 'darwin' ? 'browser-darwin.sh' : 'browser-linux.sh'}`, { base: '.' })\n\t\t\t\t\t.pipe(replace('@@VERSION@@', version))\n\t\t\t\t\t.pipe(replace('@@COMMIT@@', commit))\n\t\t\t\t\t.pipe(replace('@@APPNAME@@', product.applicationName))\n\t\t\t\t\t.pipe(rename(`bin/helpers/browser.sh`))\n\t\t\t\t\t.pipe(util.setExecutableBit()),\n\t\t\t\tgulp.src(`resources/server/bin/${platform === 'darwin' ? 'code-server-darwin.sh' : 'code-server-linux.sh'}`, { base: '.' })\n\t\t\t\t\t.pipe(rename(`bin/${product.serverApplicationName}`))\n\t\t\t\t\t.pipe(util.setExecutableBit())\n\t\t\t);\n\t\t}\n\n\t\treturn result.pipe(vfs.dest(destination));\n\t};\n}\n\n/**\n * @param {object} product The parsed product.json file contents\n */\nfunction tweakProductForServerWeb(product) {\n\tconst result = { ...product };\n\tdelete result.webEndpointUrlTemplate;\n\treturn result;\n}\n\n['reh', 'reh-web'].forEach(type => {\n\tconst optimizeTask = task.define(`optimize-vscode-${type}`, task.series(\n\t\tutil.rimraf(`out-vscode-${type}`),\n\t\toptimize.optimizeTask(\n\t\t\t{\n\t\t\t\tout: `out-vscode-${type}`,\n\t\t\t\tamd: {\n\t\t\t\t\tsrc: 'out-build',\n\t\t\t\t\tentryPoints: (type === 'reh' ? serverEntryPoints : serverWithWebEntryPoints).flat(),\n\t\t\t\t\totherSources: [],\n\t\t\t\t\tresources: type === 'reh' ? serverResources : serverWithWebResources,\n\t\t\t\t\tloaderConfig: optimize.loaderConfig(),\n\t\t\t\t\tinlineAmdImages: true,\n\t\t\t\t\tbundleInfo: undefined,\n\t\t\t\t\tfileContentMapper: createVSCodeWebFileContentMapper('.build/extensions', type === 'reh-web' ? tweakProductForServerWeb(product) : product)\n\t\t\t\t},\n\t\t\t\tcommonJS: {\n\t\t\t\t\tsrc: 'out-build',\n\t\t\t\t\tentryPoints: [\n\t\t\t\t\t\t'out-build/server-main.js',\n\t\t\t\t\t\t'out-build/server-cli.js'\n\t\t\t\t\t],\n\t\t\t\t\tplatform: 'node',\n\t\t\t\t\texternal: [\n\t\t\t\t\t\t'minimist',\n\t\t\t\t\t\t// TODO: we cannot inline `product.json` because\n\t\t\t\t\t\t// it is being changed during build time at a later\n\t\t\t\t\t\t// point in time (such as `checksums`)\n\t\t\t\t\t\t'../product.json',\n\t\t\t\t\t\t'../package.json'\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t}\n\t\t)\n\t));\n\n\tconst minifyTask = task.define(`minify-vscode-${type}`, task.series(\n\t\toptimizeTask,\n\t\tutil.rimraf(`out-vscode-${type}-min`),\n\t\toptimize.minifyTask(`out-vscode-${type}`, `https://ticino.blob.core.windows.net/sourcemaps/${commit}/core`)\n\t));\n\tgulp.task(minifyTask);\n\n\tBUILD_TARGETS.forEach(buildTarget => {\n\t\tconst dashed = (str) => (str ? `-${str}` : ``);\n\t\tconst platform = buildTarget.platform;\n\t\tconst arch = buildTarget.arch;\n\n\t\t['', 'min'].forEach(minified => {\n\t\t\tconst sourceFolderName = `out-vscode-${type}${dashed(minified)}`;\n\t\t\tconst destinationFolderName = `vscode-${type}${dashed(platform)}${dashed(arch)}`;\n\n\t\t\tconst serverTaskCI = task.define(`vscode-${type}${dashed(platform)}${dashed(arch)}${dashed(minified)}-ci`, task.series(\n\t\t\t\tgulp.task(`node-${platform}-${arch}`),\n\t\t\t\tutil.rimraf(path.join(BUILD_ROOT, destinationFolderName)),\n\t\t\t\tpackageTask(type, platform, arch, sourceFolderName, destinationFolderName)\n\t\t\t));\n\t\t\tgulp.task(serverTaskCI);\n\n\t\t\tconst serverTask = task.define(`vscode-${type}${dashed(platform)}${dashed(arch)}${dashed(minified)}`, task.series(\n\t\t\t\tcompileBuildTask,\n\t\t\t\tcompileExtensionsBuildTask,\n\t\t\t\tcompileExtensionMediaBuildTask,\n\t\t\t\tminified ? minifyTask : optimizeTask,\n\t\t\t\tserverTaskCI\n\t\t\t));\n\t\t\tgulp.task(serverTask);\n\t\t});\n\t});\n});\n",
		"fileName": "./2.js"
	},
	"diffs": [
		{
			"originalRange": "[141,141)",
			"modifiedRange": "[141,142)",
			"innerChanges": null
		},
		{
			"originalRange": "[144,148)",
			"modifiedRange": "[145,145)",
			"innerChanges": null
		},
		{
			"originalRange": "[160,160)",
			"modifiedRange": "[157,164)",
			"innerChanges": null
		},
		{
			"originalRange": "[222,234)",
			"modifiedRange": "[226,234)",
			"innerChanges": [
				{
					"originalRange": "[222,17 -> 222,19 EOL]",
					"modifiedRange": "[226,17 -> 226,17 EOL]"
				},
				{
					"originalRange": "[223,4 -> 223,28]",
					"modifiedRange": "[227,4 -> 227,37]"
				},
				{
					"originalRange": "[223,32 -> 223,49]",
					"modifiedRange": "[227,41 -> 227,48]"
				},
				{
					"originalRange": "[223,54 -> 223,65 EOL]",
					"modifiedRange": "[227,53 -> 227,62 EOL]"
				},
				{
					"originalRange": "[224,4 -> 224,21]",
					"modifiedRange": "[228,4 -> 228,25]"
				},
				{
					"originalRange": "[224,25 -> 224,29]",
					"modifiedRange": "[228,29 -> 228,55]"
				},
				{
					"originalRange": "[224,43 -> 225,63]",
					"modifiedRange": "[228,69 -> 228,108]"
				},
				{
					"originalRange": "[225,78 -> 226,8]",
					"modifiedRange": "[228,123 -> 228,152]"
				},
				{
					"originalRange": "[226,22 -> 226,25 EOL]",
					"modifiedRange": "[228,166 -> 228,169 EOL]"
				},
				{
					"originalRange": "[227,5 -> 227,30]",
					"modifiedRange": "[229,5 -> 229,25]"
				},
				{
					"originalRange": "[227,33 -> 227,42]",
					"modifiedRange": "[229,28 -> 229,32]"
				},
				{
					"originalRange": "[227,45 -> 227,93 EOL]",
					"modifiedRange": "[229,35 -> 229,67 EOL]"
				},
				{
					"originalRange": "[228,5 -> 228,51 EOL]",
					"modifiedRange": "[230,5 -> 230,30 EOL]"
				},
				{
					"originalRange": "[229,6 -> 230,6 EOL]",
					"modifiedRange": "[231,6 -> 231,40 EOL]"
				},
				{
					"originalRange": "[231,4 -> 232,42]",
					"modifiedRange": "[232,4 -> 232,19]"
				},
				{
					"originalRange": "[232,48 -> 232,69]",
					"modifiedRange": "[232,25 -> 233,32]"
				},
				{
					"originalRange": "[232,72 -> 233,4 EOL]",
					"modifiedRange": "[233,35 -> 233,60 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/equals/1.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/equals/1.txt

```text
hello
world
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/equals/2.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/equals/2.txt

```text
hello
world
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/equals/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/equals/advanced.expected.diff.json

```json
{
	"original": {
		"content": "hello\nworld",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "hello\nworld",
		"fileName": "./2.txt"
	},
	"diffs": []
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/equals/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/equals/legacy.expected.diff.json

```json
{
	"original": {
		"content": "hello\nworld",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "hello\nworld",
		"fileName": "./2.txt"
	},
	"diffs": []
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/false-positive-move/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/false-positive-move/1.tst

```text
includeIssuesWithoutMilestone: boolean = false,
): Promise<ItemsResponseResult<MilestoneModel>> {
	const milestones: ItemsResponseResult<MilestoneModel> = await this.fetchPagedData<MilestoneModel>(
		options,
		'milestoneIssuesKey',
		PagedDataType.Milestones,
		PRType.All
	);
	if (includeIssuesWithoutMilestone) {
		const additionalIssues: ItemsResponseResult<Issue> = await this.fetchPagedData<Issue>(
			options,
			'noMilestoneIssuesKey',
			PagedDataType.IssuesWithoutMilestone,
			PRType.All
		);
		milestones.items.push({
			milestone: {
				createdAt: new Date(0).toDateString(),
				id: '',
				title: NO_MILESTONE,
			},
			issues: await Promise.all(additionalIssues.items.map(async (issue) => {
				const githubRepository = await this.getRepoForIssue(issue);
				return new IssueModel(githubRepository, githubRepository.remote, issue);
			})),
		});
	}
	return milestones;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/false-positive-move/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/false-positive-move/2.tst

```text
includeIssuesWithoutMilestone: boolean = false,
): Promise<ItemsResponseResult<MilestoneModel>> {
	try {
		const milestones: ItemsResponseResult<MilestoneModel> = await this.fetchPagedData<MilestoneModel>(
			options,
			'milestoneIssuesKey',
			PagedDataType.Milestones,
			PRType.All
		);
		if (includeIssuesWithoutMilestone) {
			const additionalIssues: ItemsResponseResult<Issue> = await this.fetchPagedData<Issue>(
				options,
				'noMilestoneIssuesKey',
				PagedDataType.IssuesWithoutMilestone,
				PRType.All
			);
			milestones.items.push({
				milestone: {
					createdAt: new Date(0).toDateString(),
					id: '',
					title: NO_MILESTONE,
				},
				issues: await Promise.all(additionalIssues.items.map(async (issue) => {
					const githubRepository = await this.getRepoForIssue(issue);
					return new IssueModel(githubRepository, githubRepository.remote, issue);
				})),
			});
		}
		return milestones;
	} catch (e) {
		Logger.error(`Error fetching milestone issues: ${e instanceof Error ? e.message : e}`, FolderRepositoryManager.ID);
		return { hasMorePages: false, hasUnsearchedRepositories: false, items: [] };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/false-positive-move/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/false-positive-move/advanced.expected.diff.json

```json
{
	"original": {
		"content": "includeIssuesWithoutMilestone: boolean = false,\n): Promise<ItemsResponseResult<MilestoneModel>> {\n\tconst milestones: ItemsResponseResult<MilestoneModel> = await this.fetchPagedData<MilestoneModel>(\n\t\toptions,\n\t\t'milestoneIssuesKey',\n\t\tPagedDataType.Milestones,\n\t\tPRType.All\n\t);\n\tif (includeIssuesWithoutMilestone) {\n\t\tconst additionalIssues: ItemsResponseResult<Issue> = await this.fetchPagedData<Issue>(\n\t\t\toptions,\n\t\t\t'noMilestoneIssuesKey',\n\t\t\tPagedDataType.IssuesWithoutMilestone,\n\t\t\tPRType.All\n\t\t);\n\t\tmilestones.items.push({\n\t\t\tmilestone: {\n\t\t\t\tcreatedAt: new Date(0).toDateString(),\n\t\t\t\tid: '',\n\t\t\t\ttitle: NO_MILESTONE,\n\t\t\t},\n\t\t\tissues: await Promise.all(additionalIssues.items.map(async (issue) => {\n\t\t\t\tconst githubRepository = await this.getRepoForIssue(issue);\n\t\t\t\treturn new IssueModel(githubRepository, githubRepository.remote, issue);\n\t\t\t})),\n\t\t});\n\t}\n\treturn milestones;\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "includeIssuesWithoutMilestone: boolean = false,\n): Promise<ItemsResponseResult<MilestoneModel>> {\n\ttry {\n\t\tconst milestones: ItemsResponseResult<MilestoneModel> = await this.fetchPagedData<MilestoneModel>(\n\t\t\toptions,\n\t\t\t'milestoneIssuesKey',\n\t\t\tPagedDataType.Milestones,\n\t\t\tPRType.All\n\t\t);\n\t\tif (includeIssuesWithoutMilestone) {\n\t\t\tconst additionalIssues: ItemsResponseResult<Issue> = await this.fetchPagedData<Issue>(\n\t\t\t\toptions,\n\t\t\t\t'noMilestoneIssuesKey',\n\t\t\t\tPagedDataType.IssuesWithoutMilestone,\n\t\t\t\tPRType.All\n\t\t\t);\n\t\t\tmilestones.items.push({\n\t\t\t\tmilestone: {\n\t\t\t\t\tcreatedAt: new Date(0).toDateString(),\n\t\t\t\t\tid: '',\n\t\t\t\t\ttitle: NO_MILESTONE,\n\t\t\t\t},\n\t\t\t\tissues: await Promise.all(additionalIssues.items.map(async (issue) => {\n\t\t\t\t\tconst githubRepository = await this.getRepoForIssue(issue);\n\t\t\t\t\treturn new IssueModel(githubRepository, githubRepository.remote, issue);\n\t\t\t\t})),\n\t\t\t});\n\t\t}\n\t\treturn milestones;\n\t} catch (e) {\n\t\tLogger.error(`Error fetching milestone issues: ${e instanceof Error ? e.message : e}`, FolderRepositoryManager.ID);\n\t\treturn { hasMorePages: false, hasUnsearchedRepositories: false, items: [] };\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,29)",
			"modifiedRange": "[3,34)",
			"innerChanges": [
				{
					"originalRange": "[3,1 -> 3,1]",
					"modifiedRange": "[3,1 -> 4,1]"
				},
				{
					"originalRange": "[3,1 -> 3,1]",
					"modifiedRange": "[4,1 -> 4,2]"
				},
				{
					"originalRange": "[4,1 -> 4,1]",
					"modifiedRange": "[5,1 -> 5,2]"
				},
				{
					"originalRange": "[5,1 -> 5,1]",
					"modifiedRange": "[6,1 -> 6,2]"
				},
				{
					"originalRange": "[6,1 -> 6,1]",
					"modifiedRange": "[7,1 -> 7,2]"
				},
				{
					"originalRange": "[7,1 -> 7,1]",
					"modifiedRange": "[8,1 -> 8,2]"
				},
				{
					"originalRange": "[8,1 -> 8,1]",
					"modifiedRange": "[9,1 -> 9,2]"
				},
				{
					"originalRange": "[9,1 -> 9,1]",
					"modifiedRange": "[10,1 -> 10,2]"
				},
				{
					"originalRange": "[10,1 -> 10,1]",
					"modifiedRange": "[11,1 -> 11,2]"
				},
				{
					"originalRange": "[11,1 -> 11,1]",
					"modifiedRange": "[12,1 -> 12,2]"
				},
				{
					"originalRange": "[12,1 -> 12,1]",
					"modifiedRange": "[13,1 -> 13,2]"
				},
				{
					"originalRange": "[13,1 -> 13,1]",
					"modifiedRange": "[14,1 -> 14,2]"
				},
				{
					"originalRange": "[14,1 -> 14,1]",
					"modifiedRange": "[15,1 -> 15,2]"
				},
				{
					"originalRange": "[15,1 -> 15,1]",
					"modifiedRange": "[16,1 -> 16,2]"
				},
				{
					"originalRange": "[16,1 -> 16,1]",
					"modifiedRange": "[17,1 -> 17,2]"
				},
				{
					"originalRange": "[17,1 -> 17,1]",
					"modifiedRange": "[18,1 -> 18,2]"
				},
				{
					"originalRange": "[18,1 -> 18,1]",
					"modifiedRange": "[19,1 -> 19,2]"
				},
				{
					"originalRange": "[19,1 -> 19,1]",
					"modifiedRange": "[20,1 -> 20,2]"
				},
				{
					"originalRange": "[20,1 -> 20,1]",
					"modifiedRange": "[21,1 -> 21,2]"
				},
				{
					"originalRange": "[21,1 -> 21,1]",
					"modifiedRange": "[22,1 -> 22,2]"
				},
				{
					"originalRange": "[22,1 -> 22,1]",
					"modifiedRange": "[23,1 -> 23,2]"
				},
				{
					"originalRange": "[23,1 -> 23,1]",
					"modifiedRange": "[24,1 -> 24,2]"
				},
				{
					"originalRange": "[24,1 -> 24,1]",
					"modifiedRange": "[25,1 -> 25,2]"
				},
				{
					"originalRange": "[25,1 -> 25,1]",
					"modifiedRange": "[26,1 -> 26,2]"
				},
				{
					"originalRange": "[26,1 -> 26,1]",
					"modifiedRange": "[27,1 -> 27,2]"
				},
				{
					"originalRange": "[27,1 -> 27,1]",
					"modifiedRange": "[28,1 -> 28,2]"
				},
				{
					"originalRange": "[28,1 -> 28,1]",
					"modifiedRange": "[29,1 -> 29,2]"
				},
				{
					"originalRange": "[29,1 -> 29,1]",
					"modifiedRange": "[30,1 -> 34,1]"
				}
			]
		},
		{
			"originalRange": "[30,30)",
			"modifiedRange": "[35,36)",
			"innerChanges": [
				{
					"originalRange": "[29,2 -> 29,2 EOL]",
					"modifiedRange": "[34,2 -> 35,1 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/false-positive-move/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/false-positive-move/legacy.expected.diff.json

```json
{
	"original": {
		"content": "includeIssuesWithoutMilestone: boolean = false,\n): Promise<ItemsResponseResult<MilestoneModel>> {\n\tconst milestones: ItemsResponseResult<MilestoneModel> = await this.fetchPagedData<MilestoneModel>(\n\t\toptions,\n\t\t'milestoneIssuesKey',\n\t\tPagedDataType.Milestones,\n\t\tPRType.All\n\t);\n\tif (includeIssuesWithoutMilestone) {\n\t\tconst additionalIssues: ItemsResponseResult<Issue> = await this.fetchPagedData<Issue>(\n\t\t\toptions,\n\t\t\t'noMilestoneIssuesKey',\n\t\t\tPagedDataType.IssuesWithoutMilestone,\n\t\t\tPRType.All\n\t\t);\n\t\tmilestones.items.push({\n\t\t\tmilestone: {\n\t\t\t\tcreatedAt: new Date(0).toDateString(),\n\t\t\t\tid: '',\n\t\t\t\ttitle: NO_MILESTONE,\n\t\t\t},\n\t\t\tissues: await Promise.all(additionalIssues.items.map(async (issue) => {\n\t\t\t\tconst githubRepository = await this.getRepoForIssue(issue);\n\t\t\t\treturn new IssueModel(githubRepository, githubRepository.remote, issue);\n\t\t\t})),\n\t\t});\n\t}\n\treturn milestones;\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "includeIssuesWithoutMilestone: boolean = false,\n): Promise<ItemsResponseResult<MilestoneModel>> {\n\ttry {\n\t\tconst milestones: ItemsResponseResult<MilestoneModel> = await this.fetchPagedData<MilestoneModel>(\n\t\t\toptions,\n\t\t\t'milestoneIssuesKey',\n\t\t\tPagedDataType.Milestones,\n\t\t\tPRType.All\n\t\t);\n\t\tif (includeIssuesWithoutMilestone) {\n\t\t\tconst additionalIssues: ItemsResponseResult<Issue> = await this.fetchPagedData<Issue>(\n\t\t\t\toptions,\n\t\t\t\t'noMilestoneIssuesKey',\n\t\t\t\tPagedDataType.IssuesWithoutMilestone,\n\t\t\t\tPRType.All\n\t\t\t);\n\t\t\tmilestones.items.push({\n\t\t\t\tmilestone: {\n\t\t\t\t\tcreatedAt: new Date(0).toDateString(),\n\t\t\t\t\tid: '',\n\t\t\t\t\ttitle: NO_MILESTONE,\n\t\t\t\t},\n\t\t\t\tissues: await Promise.all(additionalIssues.items.map(async (issue) => {\n\t\t\t\t\tconst githubRepository = await this.getRepoForIssue(issue);\n\t\t\t\t\treturn new IssueModel(githubRepository, githubRepository.remote, issue);\n\t\t\t\t})),\n\t\t\t});\n\t\t}\n\t\treturn milestones;\n\t} catch (e) {\n\t\tLogger.error(`Error fetching milestone issues: ${e instanceof Error ? e.message : e}`, FolderRepositoryManager.ID);\n\t\treturn { hasMorePages: false, hasUnsearchedRepositories: false, items: [] };\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,30)",
			"modifiedRange": "[3,36)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/fuzzy-matching/1.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/fuzzy-matching/1.txt

```text

console.log(1)
console.log(2)
console.log(3)
console.log(4)
console.log(5)
console.log(6)
console.log(7)
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/fuzzy-matching/2.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/fuzzy-matching/2.txt

```text
console.log(1);
console.log(2);
console.log(3);
console.log(4);

console.log(5);
console.log(6);
console.log(7);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/fuzzy-matching/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/fuzzy-matching/advanced.expected.diff.json

```json
{
	"original": {
		"content": "\nconsole.log(1)\nconsole.log(2)\nconsole.log(3)\nconsole.log(4)\nconsole.log(5)\nconsole.log(6)\nconsole.log(7)\n",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "console.log(1);\nconsole.log(2);\nconsole.log(3);\nconsole.log(4);\n\nconsole.log(5);\nconsole.log(6);\nconsole.log(7);\n\n",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[1,9)",
			"modifiedRange": "[1,10)",
			"innerChanges": [
				{
					"originalRange": "[1,1 -> 2,1]",
					"modifiedRange": "[1,1 -> 1,1]"
				},
				{
					"originalRange": "[2,15 -> 2,15 EOL]",
					"modifiedRange": "[1,15 -> 1,16 EOL]"
				},
				{
					"originalRange": "[3,15 -> 3,15 EOL]",
					"modifiedRange": "[2,15 -> 2,16 EOL]"
				},
				{
					"originalRange": "[4,15 -> 4,15 EOL]",
					"modifiedRange": "[3,15 -> 3,16 EOL]"
				},
				{
					"originalRange": "[5,15 -> 5,15 EOL]",
					"modifiedRange": "[4,15 -> 5,1 EOL]"
				},
				{
					"originalRange": "[6,15 -> 6,15 EOL]",
					"modifiedRange": "[6,15 -> 6,16 EOL]"
				},
				{
					"originalRange": "[7,15 -> 7,15 EOL]",
					"modifiedRange": "[7,15 -> 7,16 EOL]"
				},
				{
					"originalRange": "[8,15 -> 8,15 EOL]",
					"modifiedRange": "[8,15 -> 9,1 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

````

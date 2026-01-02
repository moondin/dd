---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 220
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 220 of 552)

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

---[FILE: src/vs/editor/contrib/bracketMatching/browser/bracketMatching.ts]---
Location: vscode-main/src/vs/editor/contrib/bracketMatching/browser/bracketMatching.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../base/common/async.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import './bracketMatching.css';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, registerEditorAction, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { IEditorContribution, IEditorDecorationsCollection } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { IModelDeltaDecoration, OverviewRulerLane, TrackedRangeStickiness } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import * as nls from '../../../../nls.js';
import { MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant, themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { editorBracketMatchForeground } from '../../../common/core/editorColorRegistry.js';

const overviewRulerBracketMatchForeground = registerColor('editorOverviewRuler.bracketMatchForeground', '#A0A0A0', nls.localize('overviewRulerBracketMatchForeground', 'Overview ruler marker color for matching brackets.'));

class JumpToBracketAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.jumpToBracket',
			label: nls.localize2('smartSelect.jumpBracket', "Go to Bracket"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Backslash,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		BracketMatchingController.get(editor)?.jumpToBracket();
	}
}

class SelectToBracketAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.selectToBracket',
			label: nls.localize2('smartSelect.selectToBracket', "Select to Bracket"),
			precondition: undefined,
			metadata: {
				description: nls.localize2('smartSelect.selectToBracketDescription', "Select the text inside and including the brackets or curly braces"),
				args: [{
					name: 'args',
					schema: {
						type: 'object',
						properties: {
							'selectBrackets': {
								type: 'boolean',
								default: true
							}
						},
					}
				}]
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor, args: any): void {
		let selectBrackets = true;
		if (args && args.selectBrackets === false) {
			selectBrackets = false;
		}
		BracketMatchingController.get(editor)?.selectToBracket(selectBrackets);
	}
}

class RemoveBracketsAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.removeBrackets',
			label: nls.localize2('smartSelect.removeBrackets', "Remove Brackets"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Backspace,
				weight: KeybindingWeight.EditorContrib
			},
			canTriggerInlineEdits: true,
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		BracketMatchingController.get(editor)?.removeBrackets(this.id);
	}
}

type Brackets = [Range, Range];

class BracketsData {
	public readonly position: Position;
	public readonly brackets: Brackets | null;
	public readonly options: ModelDecorationOptions;

	constructor(position: Position, brackets: Brackets | null, options: ModelDecorationOptions) {
		this.position = position;
		this.brackets = brackets;
		this.options = options;
	}
}

export class BracketMatchingController extends Disposable implements IEditorContribution {
	public static readonly ID = 'editor.contrib.bracketMatchingController';

	public static get(editor: ICodeEditor): BracketMatchingController | null {
		return editor.getContribution<BracketMatchingController>(BracketMatchingController.ID);
	}

	private readonly _editor: ICodeEditor;

	private _lastBracketsData: BracketsData[];
	private _lastVersionId: number;
	private readonly _decorations: IEditorDecorationsCollection;
	private readonly _updateBracketsSoon: RunOnceScheduler;
	private _matchBrackets: 'never' | 'near' | 'always';

	constructor(
		editor: ICodeEditor
	) {
		super();
		this._editor = editor;
		this._lastBracketsData = [];
		this._lastVersionId = 0;
		this._decorations = this._editor.createDecorationsCollection();
		this._updateBracketsSoon = this._register(new RunOnceScheduler(() => this._updateBrackets(), 50));
		this._matchBrackets = this._editor.getOption(EditorOption.matchBrackets);

		this._updateBracketsSoon.schedule();
		this._register(editor.onDidChangeCursorPosition((e) => {

			if (this._matchBrackets === 'never') {
				// Early exit if nothing needs to be done!
				// Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
				return;
			}

			this._updateBracketsSoon.schedule();
		}));
		this._register(editor.onDidChangeModelContent((e) => {
			this._updateBracketsSoon.schedule();
		}));
		this._register(editor.onDidChangeModel((e) => {
			this._lastBracketsData = [];
			this._updateBracketsSoon.schedule();
		}));
		this._register(editor.onDidChangeModelLanguageConfiguration((e) => {
			this._lastBracketsData = [];
			this._updateBracketsSoon.schedule();
		}));
		this._register(editor.onDidChangeConfiguration((e) => {
			if (e.hasChanged(EditorOption.matchBrackets)) {
				this._matchBrackets = this._editor.getOption(EditorOption.matchBrackets);
				this._decorations.clear();
				this._lastBracketsData = [];
				this._lastVersionId = 0;
				this._updateBracketsSoon.schedule();
			}
		}));

		this._register(editor.onDidBlurEditorWidget(() => {
			this._updateBracketsSoon.schedule();
		}));

		this._register(editor.onDidFocusEditorWidget(() => {
			this._updateBracketsSoon.schedule();
		}));
	}

	public jumpToBracket(): void {
		if (!this._editor.hasModel()) {
			return;
		}

		const model = this._editor.getModel();
		const newSelections = this._editor.getSelections().map(selection => {
			const position = selection.getStartPosition();

			// find matching brackets if position is on a bracket
			const brackets = model.bracketPairs.matchBracket(position);
			let newCursorPosition: Position | null = null;
			if (brackets) {
				if (brackets[0].containsPosition(position) && !brackets[1].containsPosition(position)) {
					newCursorPosition = brackets[1].getStartPosition();
				} else if (brackets[1].containsPosition(position)) {
					newCursorPosition = brackets[0].getStartPosition();
				}
			} else {
				// find the enclosing brackets if the position isn't on a matching bracket
				const enclosingBrackets = model.bracketPairs.findEnclosingBrackets(position);
				if (enclosingBrackets) {
					newCursorPosition = enclosingBrackets[1].getStartPosition();
				} else {
					// no enclosing brackets, try the very first next bracket
					const nextBracket = model.bracketPairs.findNextBracket(position);
					if (nextBracket && nextBracket.range) {
						newCursorPosition = nextBracket.range.getStartPosition();
					}
				}
			}

			if (newCursorPosition) {
				return new Selection(newCursorPosition.lineNumber, newCursorPosition.column, newCursorPosition.lineNumber, newCursorPosition.column);
			}
			return new Selection(position.lineNumber, position.column, position.lineNumber, position.column);
		});

		this._editor.setSelections(newSelections);
		this._editor.revealRange(newSelections[0]);
	}

	public selectToBracket(selectBrackets: boolean): void {
		if (!this._editor.hasModel()) {
			return;
		}

		const model = this._editor.getModel();
		const newSelections: Selection[] = [];

		this._editor.getSelections().forEach(selection => {
			const position = selection.getStartPosition();
			let brackets = model.bracketPairs.matchBracket(position);

			if (!brackets) {
				brackets = model.bracketPairs.findEnclosingBrackets(position);
				if (!brackets) {
					const nextBracket = model.bracketPairs.findNextBracket(position);
					if (nextBracket && nextBracket.range) {
						brackets = model.bracketPairs.matchBracket(nextBracket.range.getStartPosition());
					}
				}
			}

			let selectFrom: Position | null = null;
			let selectTo: Position | null = null;

			if (brackets) {
				brackets.sort(Range.compareRangesUsingStarts);
				const [open, close] = brackets;
				selectFrom = selectBrackets ? open.getStartPosition() : open.getEndPosition();
				selectTo = selectBrackets ? close.getEndPosition() : close.getStartPosition();

				if (close.containsPosition(position)) {
					// select backwards if the cursor was on the closing bracket
					const tmp = selectFrom;
					selectFrom = selectTo;
					selectTo = tmp;
				}
			}

			if (selectFrom && selectTo) {
				newSelections.push(new Selection(selectFrom.lineNumber, selectFrom.column, selectTo.lineNumber, selectTo.column));
			}
		});

		if (newSelections.length > 0) {
			this._editor.setSelections(newSelections);
			this._editor.revealRange(newSelections[0]);
		}
	}
	public removeBrackets(editSource?: string): void {
		if (!this._editor.hasModel()) {
			return;
		}

		const model = this._editor.getModel();
		this._editor.getSelections().forEach((selection) => {
			const position = selection.getPosition();

			let brackets = model.bracketPairs.matchBracket(position);
			if (!brackets) {
				brackets = model.bracketPairs.findEnclosingBrackets(position);
			}
			if (brackets) {
				this._editor.pushUndoStop();
				this._editor.executeEdits(
					editSource,
					[
						{ range: brackets[0], text: '' },
						{ range: brackets[1], text: '' }
					]
				);
				this._editor.pushUndoStop();
			}
		});
	}

	private static readonly _DECORATION_OPTIONS_WITH_OVERVIEW_RULER = ModelDecorationOptions.register({
		description: 'bracket-match-overview',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		inlineClassName: 'bracket-match',
		overviewRuler: {
			color: themeColorFromId(overviewRulerBracketMatchForeground),
			position: OverviewRulerLane.Center
		}
	});

	private static readonly _DECORATION_OPTIONS_WITHOUT_OVERVIEW_RULER = ModelDecorationOptions.register({
		description: 'bracket-match-no-overview',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		inlineClassName: 'bracket-match'
	});

	private _updateBrackets(): void {
		if (this._matchBrackets === 'never') {
			return;
		}
		this._recomputeBrackets();

		const newDecorations: IModelDeltaDecoration[] = [];
		let newDecorationsLen = 0;
		for (const bracketData of this._lastBracketsData) {
			const brackets = bracketData.brackets;
			if (brackets) {
				newDecorations[newDecorationsLen++] = { range: brackets[0], options: bracketData.options };
				newDecorations[newDecorationsLen++] = { range: brackets[1], options: bracketData.options };
			}
		}

		this._decorations.set(newDecorations);
	}

	private _recomputeBrackets(): void {
		if (!this._editor.hasModel() || !this._editor.hasWidgetFocus()) {
			// no model or no focus => no brackets!
			this._lastBracketsData = [];
			this._lastVersionId = 0;
			return;
		}

		const selections = this._editor.getSelections();
		if (selections.length > 100) {
			// no bracket matching for high numbers of selections
			this._lastBracketsData = [];
			this._lastVersionId = 0;
			return;
		}

		const model = this._editor.getModel();
		const versionId = model.getVersionId();
		let previousData: BracketsData[] = [];
		if (this._lastVersionId === versionId) {
			// use the previous data only if the model is at the same version id
			previousData = this._lastBracketsData;
		}

		const positions: Position[] = [];
		let positionsLen = 0;
		for (let i = 0, len = selections.length; i < len; i++) {
			const selection = selections[i];

			if (selection.isEmpty()) {
				// will bracket match a cursor only if the selection is collapsed
				positions[positionsLen++] = selection.getStartPosition();
			}
		}

		// sort positions for `previousData` cache hits
		if (positions.length > 1) {
			positions.sort(Position.compare);
		}

		const newData: BracketsData[] = [];
		let newDataLen = 0;
		let previousIndex = 0;
		const previousLen = previousData.length;
		for (let i = 0, len = positions.length; i < len; i++) {
			const position = positions[i];

			while (previousIndex < previousLen && previousData[previousIndex].position.isBefore(position)) {
				previousIndex++;
			}

			if (previousIndex < previousLen && previousData[previousIndex].position.equals(position)) {
				newData[newDataLen++] = previousData[previousIndex];
			} else {
				let brackets = model.bracketPairs.matchBracket(position, 20 /* give at most 20ms to compute */);
				let options = BracketMatchingController._DECORATION_OPTIONS_WITH_OVERVIEW_RULER;
				if (!brackets && this._matchBrackets === 'always') {
					brackets = model.bracketPairs.findEnclosingBrackets(position, 20 /* give at most 20ms to compute */);
					options = BracketMatchingController._DECORATION_OPTIONS_WITHOUT_OVERVIEW_RULER;
				}
				newData[newDataLen++] = new BracketsData(position, brackets, options);
			}
		}

		this._lastBracketsData = newData;
		this._lastVersionId = versionId;
	}
}

registerEditorContribution(BracketMatchingController.ID, BracketMatchingController, EditorContributionInstantiation.AfterFirstRender);
registerEditorAction(SelectToBracketAction);
registerEditorAction(JumpToBracketAction);
registerEditorAction(RemoveBracketsAction);

// Go to menu
MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
	group: '5_infile_nav',
	command: {
		id: 'editor.action.jumpToBracket',
		title: nls.localize({ key: 'miGoToBracket', comment: ['&& denotes a mnemonic'] }, "Go to &&Bracket")
	},
	order: 2
});

// Theming participant to ensure bracket-match color overrides bracket pair colorization
registerThemingParticipant((theme, collector) => {
	const bracketMatchForeground = theme.getColor(editorBracketMatchForeground);
	if (bracketMatchForeground) {
		// Use higher specificity to override bracket pair colorization
		collector.addRule(`.monaco-editor .bracket-match { color: ${bracketMatchForeground} !important; }`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/bracketMatching/test/browser/bracketMatching.test.ts]---
Location: vscode-main/src/vs/editor/contrib/bracketMatching/test/browser/bracketMatching.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { Position } from '../../../../common/core/position.js';
import { Selection } from '../../../../common/core/selection.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { BracketMatchingController } from '../../browser/bracketMatching.js';
import { createCodeEditorServices, instantiateTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { instantiateTextModel } from '../../../../test/common/testTextModel.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('bracket matching', () => {
	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let languageConfigurationService: ILanguageConfigurationService;
	let languageService: ILanguageService;

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = createCodeEditorServices(disposables);
		languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
		languageService = instantiationService.get(ILanguageService);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function createTextModelWithBrackets(text: string) {
		const languageId = 'bracketMode';
		disposables.add(languageService.registerLanguage({ id: languageId }));
		disposables.add(languageConfigurationService.register(languageId, {
			brackets: [
				['{', '}'],
				['[', ']'],
				['(', ')'],
			]
		}));
		return disposables.add(instantiateTextModel(instantiationService, text, languageId));
	}

	function createCodeEditorWithBrackets(text: string) {
		return disposables.add(instantiateTestCodeEditor(instantiationService, createTextModelWithBrackets(text)));
	}

	test('issue #183: jump to matching bracket position', () => {
		const editor = createCodeEditorWithBrackets('var x = (3 + (5-7)) + ((5+3)+5);');
		const bracketMatchingController = disposables.add(editor.registerAndInstantiateContribution(BracketMatchingController.ID, BracketMatchingController));

		// start on closing bracket
		editor.setPosition(new Position(1, 20));
		bracketMatchingController.jumpToBracket();
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 9));
		bracketMatchingController.jumpToBracket();
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 19));
		bracketMatchingController.jumpToBracket();
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 9));

		// start on opening bracket
		editor.setPosition(new Position(1, 23));
		bracketMatchingController.jumpToBracket();
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 31));
		bracketMatchingController.jumpToBracket();
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 23));
		bracketMatchingController.jumpToBracket();
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 31));
	});

	test('Jump to next bracket', () => {
		const editor = createCodeEditorWithBrackets('var x = (3 + (5-7)); y();');
		const bracketMatchingController = disposables.add(editor.registerAndInstantiateContribution(BracketMatchingController.ID, BracketMatchingController));

		// start position between brackets
		editor.setPosition(new Position(1, 16));
		bracketMatchingController.jumpToBracket();
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 18));
		bracketMatchingController.jumpToBracket();
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 14));
		bracketMatchingController.jumpToBracket();
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 18));

		// skip brackets in comments
		editor.setPosition(new Position(1, 21));
		bracketMatchingController.jumpToBracket();
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 23));
		bracketMatchingController.jumpToBracket();
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 24));
		bracketMatchingController.jumpToBracket();
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 23));

		// do not break if no brackets are available
		editor.setPosition(new Position(1, 26));
		bracketMatchingController.jumpToBracket();
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 26));
	});

	test('Select to next bracket', () => {
		const editor = createCodeEditorWithBrackets('var x = (3 + (5-7)); y();');
		const bracketMatchingController = disposables.add(editor.registerAndInstantiateContribution(BracketMatchingController.ID, BracketMatchingController));

		// start position in open brackets
		editor.setPosition(new Position(1, 9));
		bracketMatchingController.selectToBracket(true);
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 20));
		assert.deepStrictEqual(editor.getSelection(), new Selection(1, 9, 1, 20));

		// start position in close brackets (should select backwards)
		editor.setPosition(new Position(1, 20));
		bracketMatchingController.selectToBracket(true);
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 9));
		assert.deepStrictEqual(editor.getSelection(), new Selection(1, 20, 1, 9));

		// start position between brackets
		editor.setPosition(new Position(1, 16));
		bracketMatchingController.selectToBracket(true);
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 19));
		assert.deepStrictEqual(editor.getSelection(), new Selection(1, 14, 1, 19));

		// start position outside brackets
		editor.setPosition(new Position(1, 21));
		bracketMatchingController.selectToBracket(true);
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 25));
		assert.deepStrictEqual(editor.getSelection(), new Selection(1, 23, 1, 25));

		// do not break if no brackets are available
		editor.setPosition(new Position(1, 26));
		bracketMatchingController.selectToBracket(true);
		assert.deepStrictEqual(editor.getPosition(), new Position(1, 26));
		assert.deepStrictEqual(editor.getSelection(), new Selection(1, 26, 1, 26));
	});

	test('issue #1772: jump to enclosing brackets', () => {
		const text = [
			'const x = {',
			'    something: [0, 1, 2],',
			'    another: true,',
			'    somethingmore: [0, 2, 4]',
			'};',
		].join('\n');
		const editor = createCodeEditorWithBrackets(text);
		const bracketMatchingController = disposables.add(editor.registerAndInstantiateContribution(BracketMatchingController.ID, BracketMatchingController));

		editor.setPosition(new Position(3, 5));
		bracketMatchingController.jumpToBracket();
		assert.deepStrictEqual(editor.getSelection(), new Selection(5, 1, 5, 1));
	});

	test('issue #43371: argument to not select brackets', () => {
		const text = [
			'const x = {',
			'    something: [0, 1, 2],',
			'    another: true,',
			'    somethingmore: [0, 2, 4]',
			'};',
		].join('\n');
		const editor = createCodeEditorWithBrackets(text);
		const bracketMatchingController = disposables.add(editor.registerAndInstantiateContribution(BracketMatchingController.ID, BracketMatchingController));

		editor.setPosition(new Position(3, 5));
		bracketMatchingController.selectToBracket(false);
		assert.deepStrictEqual(editor.getSelection(), new Selection(1, 12, 5, 1));
	});

	test('issue #45369: Select to Bracket with multicursor', () => {
		const editor = createCodeEditorWithBrackets('{  }   {   }   { }');
		const bracketMatchingController = disposables.add(editor.registerAndInstantiateContribution(BracketMatchingController.ID, BracketMatchingController));

		// cursors inside brackets become selections of the entire bracket contents
		editor.setSelections([
			new Selection(1, 3, 1, 3),
			new Selection(1, 10, 1, 10),
			new Selection(1, 17, 1, 17)
		]);
		bracketMatchingController.selectToBracket(true);
		assert.deepStrictEqual(editor.getSelections(), [
			new Selection(1, 1, 1, 5),
			new Selection(1, 8, 1, 13),
			new Selection(1, 16, 1, 19)
		]);

		// cursors to the left of bracket pairs become selections of the entire pair
		editor.setSelections([
			new Selection(1, 1, 1, 1),
			new Selection(1, 6, 1, 6),
			new Selection(1, 14, 1, 14)
		]);
		bracketMatchingController.selectToBracket(true);
		assert.deepStrictEqual(editor.getSelections(), [
			new Selection(1, 1, 1, 5),
			new Selection(1, 8, 1, 13),
			new Selection(1, 16, 1, 19)
		]);

		// cursors just right of a bracket pair become selections of the entire pair
		editor.setSelections([
			new Selection(1, 5, 1, 5),
			new Selection(1, 13, 1, 13),
			new Selection(1, 19, 1, 19)
		]);
		bracketMatchingController.selectToBracket(true);
		assert.deepStrictEqual(editor.getSelections(), [
			new Selection(1, 5, 1, 1),
			new Selection(1, 13, 1, 8),
			new Selection(1, 19, 1, 16)
		]);
	});

	test('Removes brackets', () => {
		const editor = createCodeEditorWithBrackets('var x = (3 + (5-7)); y();');
		const bracketMatchingController = disposables.add(editor.registerAndInstantiateContribution(BracketMatchingController.ID, BracketMatchingController));
		function removeBrackets() {
			bracketMatchingController.removeBrackets();
		}

		// position before the bracket
		editor.setPosition(new Position(1, 9));
		removeBrackets();
		assert.deepStrictEqual(editor.getModel().getValue(), 'var x = 3 + (5-7); y();');
		editor.getModel().setValue('var x = (3 + (5-7)); y();');

		// position between brackets
		editor.setPosition(new Position(1, 16));
		removeBrackets();
		assert.deepStrictEqual(editor.getModel().getValue(), 'var x = (3 + 5-7); y();');
		removeBrackets();
		assert.deepStrictEqual(editor.getModel().getValue(), 'var x = 3 + 5-7; y();');
		removeBrackets();
		assert.deepStrictEqual(editor.getModel().getValue(), 'var x = 3 + 5-7; y();');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/caretOperations/browser/caretOperations.ts]---
Location: vscode-main/src/vs/editor/contrib/caretOperations/browser/caretOperations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, IActionOptions, registerEditorAction, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { ICommand } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { MoveCaretCommand } from './moveCaretCommand.js';
import * as nls from '../../../../nls.js';

class MoveCaretAction extends EditorAction {

	private readonly left: boolean;

	constructor(left: boolean, opts: IActionOptions) {
		super(opts);

		this.left = left;
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		if (!editor.hasModel()) {
			return;
		}

		const commands: ICommand[] = [];
		const selections = editor.getSelections();

		for (const selection of selections) {
			commands.push(new MoveCaretCommand(selection, this.left));
		}

		editor.pushUndoStop();
		editor.executeCommands(this.id, commands);
		editor.pushUndoStop();
	}
}

class MoveCaretLeftAction extends MoveCaretAction {
	constructor() {
		super(true, {
			id: 'editor.action.moveCarretLeftAction',
			label: nls.localize2('caret.moveLeft', "Move Selected Text Left"),
			precondition: EditorContextKeys.writable
		});
	}
}

class MoveCaretRightAction extends MoveCaretAction {
	constructor() {
		super(false, {
			id: 'editor.action.moveCarretRightAction',
			label: nls.localize2('caret.moveRight', "Move Selected Text Right"),
			precondition: EditorContextKeys.writable
		});
	}
}

registerEditorAction(MoveCaretLeftAction);
registerEditorAction(MoveCaretRightAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/caretOperations/browser/moveCaretCommand.ts]---
Location: vscode-main/src/vs/editor/contrib/caretOperations/browser/moveCaretCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';

export class MoveCaretCommand implements ICommand {

	private readonly _selection: Selection;
	private readonly _isMovingLeft: boolean;

	constructor(selection: Selection, isMovingLeft: boolean) {
		this._selection = selection;
		this._isMovingLeft = isMovingLeft;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		if (this._selection.startLineNumber !== this._selection.endLineNumber || this._selection.isEmpty()) {
			return;
		}
		const lineNumber = this._selection.startLineNumber;
		const startColumn = this._selection.startColumn;
		const endColumn = this._selection.endColumn;
		if (this._isMovingLeft && startColumn === 1) {
			return;
		}
		if (!this._isMovingLeft && endColumn === model.getLineMaxColumn(lineNumber)) {
			return;
		}

		if (this._isMovingLeft) {
			const rangeBefore = new Range(lineNumber, startColumn - 1, lineNumber, startColumn);
			const charBefore = model.getValueInRange(rangeBefore);
			builder.addEditOperation(rangeBefore, null);
			builder.addEditOperation(new Range(lineNumber, endColumn, lineNumber, endColumn), charBefore);
		} else {
			const rangeAfter = new Range(lineNumber, endColumn, lineNumber, endColumn + 1);
			const charAfter = model.getValueInRange(rangeAfter);
			builder.addEditOperation(rangeAfter, null);
			builder.addEditOperation(new Range(lineNumber, startColumn, lineNumber, startColumn), charAfter);
		}
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		if (this._isMovingLeft) {
			return new Selection(this._selection.startLineNumber, this._selection.startColumn - 1, this._selection.endLineNumber, this._selection.endColumn - 1);
		} else {
			return new Selection(this._selection.startLineNumber, this._selection.startColumn + 1, this._selection.endLineNumber, this._selection.endColumn + 1);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/caretOperations/browser/transpose.ts]---
Location: vscode-main/src/vs/editor/contrib/caretOperations/browser/transpose.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, registerEditorAction, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { ReplaceCommand } from '../../../common/commands/replaceCommand.js';
import { MoveOperations } from '../../../common/cursor/cursorMoveOperations.js';
import { Range } from '../../../common/core/range.js';
import { ICommand } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import * as nls from '../../../../nls.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';

class TransposeLettersAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.transposeLetters',
			label: nls.localize2('transposeLetters.label', "Transpose Letters"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: 0,
				mac: {
					primary: KeyMod.WinCtrl | KeyCode.KeyT
				},
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		if (!editor.hasModel()) {
			return;
		}

		const model = editor.getModel();
		const commands: ICommand[] = [];
		const selections = editor.getSelections();

		for (const selection of selections) {
			if (!selection.isEmpty()) {
				continue;
			}

			const lineNumber = selection.startLineNumber;
			const column = selection.startColumn;

			const lastColumn = model.getLineMaxColumn(lineNumber);

			if (lineNumber === 1 && (column === 1 || (column === 2 && lastColumn === 2))) {
				// at beginning of file, nothing to do
				continue;
			}

			// handle special case: when at end of line, transpose left two chars
			// otherwise, transpose left and right chars
			const endPosition = (column === lastColumn) ?
				selection.getPosition() :
				MoveOperations.rightPosition(model, selection.getPosition().lineNumber, selection.getPosition().column);

			const middlePosition = MoveOperations.leftPosition(model, endPosition);
			const beginPosition = MoveOperations.leftPosition(model, middlePosition);

			const leftChar = model.getValueInRange(Range.fromPositions(beginPosition, middlePosition));
			const rightChar = model.getValueInRange(Range.fromPositions(middlePosition, endPosition));

			const replaceRange = Range.fromPositions(beginPosition, endPosition);
			commands.push(new ReplaceCommand(replaceRange, rightChar + leftChar));
		}

		if (commands.length > 0) {
			editor.pushUndoStop();
			editor.executeCommands(this.id, commands);
			editor.pushUndoStop();
		}
	}
}

registerEditorAction(TransposeLettersAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/caretOperations/test/browser/moveCarretCommand.test.ts]---
Location: vscode-main/src/vs/editor/contrib/caretOperations/test/browser/moveCarretCommand.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Selection } from '../../../../common/core/selection.js';
import { MoveCaretCommand } from '../../browser/moveCaretCommand.js';
import { testCommand } from '../../../../test/browser/testCommand.js';


function testMoveCaretLeftCommand(lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection): void {
	testCommand(lines, null, selection, (accessor, sel) => new MoveCaretCommand(sel, true), expectedLines, expectedSelection);
}

function testMoveCaretRightCommand(lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection): void {
	testCommand(lines, null, selection, (accessor, sel) => new MoveCaretCommand(sel, false), expectedLines, expectedSelection);
}

suite('Editor Contrib - Move Caret Command', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('move selection to left', function () {
		testMoveCaretLeftCommand(
			[
				'012345'
			],
			new Selection(1, 3, 1, 5),
			[
				'023145'
			],
			new Selection(1, 2, 1, 4)
		);
	});
	test('move selection to right', function () {
		testMoveCaretRightCommand(
			[
				'012345'
			],
			new Selection(1, 3, 1, 5),
			[
				'014235'
			],
			new Selection(1, 4, 1, 6)
		);
	});
	test('move selection to left - from first column - no change', function () {
		testMoveCaretLeftCommand(
			[
				'012345'
			],
			new Selection(1, 1, 1, 1),
			[
				'012345'
			],
			new Selection(1, 1, 1, 1)
		);
	});
	test('move selection to right - from last column - no change', function () {
		testMoveCaretRightCommand(
			[
				'012345'
			],
			new Selection(1, 5, 1, 7),
			[
				'012345'
			],
			new Selection(1, 5, 1, 7)
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/clipboard/browser/clipboard.ts]---
Location: vscode-main/src/vs/editor/contrib/clipboard/browser/clipboard.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as browser from '../../../../base/browser/browser.js';
import { getActiveDocument, getActiveWindow } from '../../../../base/browser/dom.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import * as platform from '../../../../base/common/platform.js';
import * as nls from '../../../../nls.js';
import { MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { CopyOptions, generateDataToCopyAndStoreInMemory, InMemoryClipboardMetadataManager, PasteOptions } from '../../../browser/controller/editContext/clipboardUtils.js';
import { NativeEditContextRegistry } from '../../../browser/controller/editContext/native/nativeEditContextRegistry.js';
import { IActiveCodeEditor, ICodeEditor } from '../../../browser/editorBrowser.js';
import { Command, EditorAction, MultiCommand, registerEditorAction } from '../../../browser/editorExtensions.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Handler } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { CopyPasteController } from '../../dropOrPasteInto/browser/copyPasteController.js';

const CLIPBOARD_CONTEXT_MENU_GROUP = '9_cutcopypaste';

const supportsCut = (platform.isNative || document.queryCommandSupported('cut'));
const supportsCopy = (platform.isNative || document.queryCommandSupported('copy'));
// Firefox only supports navigator.clipboard.readText() in browser extensions.
// See https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText#Browser_compatibility
// When loading over http, navigator.clipboard can be undefined. See https://github.com/microsoft/monaco-editor/issues/2313
const supportsPaste = (typeof navigator.clipboard === 'undefined' || browser.isFirefox) ? document.queryCommandSupported('paste') : true;

function registerCommand<T extends Command>(command: T): T {
	command.register();
	return command;
}

export const CutAction = supportsCut ? registerCommand(new MultiCommand({
	id: 'editor.action.clipboardCutAction',
	precondition: undefined,
	kbOpts: (
		// Do not bind cut keybindings in the browser,
		// since browsers do that for us and it avoids security prompts
		platform.isNative ? {
			primary: KeyMod.CtrlCmd | KeyCode.KeyX,
			win: { primary: KeyMod.CtrlCmd | KeyCode.KeyX, secondary: [KeyMod.Shift | KeyCode.Delete] },
			weight: KeybindingWeight.EditorContrib
		} : undefined
	),
	menuOpts: [{
		menuId: MenuId.MenubarEditMenu,
		group: '2_ccp',
		title: nls.localize({ key: 'miCut', comment: ['&& denotes a mnemonic'] }, "Cu&&t"),
		order: 1
	}, {
		menuId: MenuId.EditorContext,
		group: CLIPBOARD_CONTEXT_MENU_GROUP,
		title: nls.localize('actions.clipboard.cutLabel', "Cut"),
		when: EditorContextKeys.writable,
		order: 1,
	}, {
		menuId: MenuId.CommandPalette,
		group: '',
		title: nls.localize('actions.clipboard.cutLabel', "Cut"),
		order: 1
	}, {
		menuId: MenuId.SimpleEditorContext,
		group: CLIPBOARD_CONTEXT_MENU_GROUP,
		title: nls.localize('actions.clipboard.cutLabel', "Cut"),
		when: EditorContextKeys.writable,
		order: 1,
	}]
})) : undefined;

export const CopyAction = supportsCopy ? registerCommand(new MultiCommand({
	id: 'editor.action.clipboardCopyAction',
	precondition: undefined,
	kbOpts: (
		// Do not bind copy keybindings in the browser,
		// since browsers do that for us and it avoids security prompts
		platform.isNative ? {
			primary: KeyMod.CtrlCmd | KeyCode.KeyC,
			win: { primary: KeyMod.CtrlCmd | KeyCode.KeyC, secondary: [KeyMod.CtrlCmd | KeyCode.Insert] },
			weight: KeybindingWeight.EditorContrib
		} : undefined
	),
	menuOpts: [{
		menuId: MenuId.MenubarEditMenu,
		group: '2_ccp',
		title: nls.localize({ key: 'miCopy', comment: ['&& denotes a mnemonic'] }, "&&Copy"),
		order: 2
	}, {
		menuId: MenuId.EditorContext,
		group: CLIPBOARD_CONTEXT_MENU_GROUP,
		title: nls.localize('actions.clipboard.copyLabel', "Copy"),
		order: 2,
	}, {
		menuId: MenuId.CommandPalette,
		group: '',
		title: nls.localize('actions.clipboard.copyLabel', "Copy"),
		order: 1
	}, {
		menuId: MenuId.SimpleEditorContext,
		group: CLIPBOARD_CONTEXT_MENU_GROUP,
		title: nls.localize('actions.clipboard.copyLabel', "Copy"),
		order: 2,
	}]
})) : undefined;

MenuRegistry.appendMenuItem(MenuId.MenubarEditMenu, { submenu: MenuId.MenubarCopy, title: nls.localize2('copy as', "Copy As"), group: '2_ccp', order: 3 });
MenuRegistry.appendMenuItem(MenuId.EditorContext, { submenu: MenuId.EditorContextCopy, title: nls.localize2('copy as', "Copy As"), group: CLIPBOARD_CONTEXT_MENU_GROUP, order: 3 });
MenuRegistry.appendMenuItem(MenuId.EditorContext, { submenu: MenuId.EditorContextShare, title: nls.localize2('share', "Share"), group: '11_share', order: -1, when: ContextKeyExpr.and(ContextKeyExpr.notEquals('resourceScheme', 'output'), EditorContextKeys.editorTextFocus) });
MenuRegistry.appendMenuItem(MenuId.ExplorerContext, { submenu: MenuId.ExplorerContextShare, title: nls.localize2('share', "Share"), group: '11_share', order: -1 });

export const PasteAction = supportsPaste ? registerCommand(new MultiCommand({
	id: 'editor.action.clipboardPasteAction',
	precondition: undefined,
	kbOpts: (
		// Do not bind paste keybindings in the browser,
		// since browsers do that for us and it avoids security prompts
		platform.isNative ? {
			primary: KeyMod.CtrlCmd | KeyCode.KeyV,
			win: { primary: KeyMod.CtrlCmd | KeyCode.KeyV, secondary: [KeyMod.Shift | KeyCode.Insert] },
			linux: { primary: KeyMod.CtrlCmd | KeyCode.KeyV, secondary: [KeyMod.Shift | KeyCode.Insert] },
			weight: KeybindingWeight.EditorContrib
		} : undefined
	),
	menuOpts: [{
		menuId: MenuId.MenubarEditMenu,
		group: '2_ccp',
		title: nls.localize({ key: 'miPaste', comment: ['&& denotes a mnemonic'] }, "&&Paste"),
		order: 4
	}, {
		menuId: MenuId.EditorContext,
		group: CLIPBOARD_CONTEXT_MENU_GROUP,
		title: nls.localize('actions.clipboard.pasteLabel', "Paste"),
		when: EditorContextKeys.writable,
		order: 4,
	}, {
		menuId: MenuId.CommandPalette,
		group: '',
		title: nls.localize('actions.clipboard.pasteLabel', "Paste"),
		order: 1
	}, {
		menuId: MenuId.SimpleEditorContext,
		group: CLIPBOARD_CONTEXT_MENU_GROUP,
		title: nls.localize('actions.clipboard.pasteLabel', "Paste"),
		when: EditorContextKeys.writable,
		order: 4,
	}]
})) : undefined;

class ExecCommandCopyWithSyntaxHighlightingAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.clipboardCopyWithSyntaxHighlightingAction',
			label: nls.localize2('actions.clipboard.copyWithSyntaxHighlightingLabel', "Copy with Syntax Highlighting"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: 0,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const logService = accessor.get(ILogService);
		const clipboardService = accessor.get(IClipboardService);
		logService.trace('ExecCommandCopyWithSyntaxHighlightingAction#run');
		if (!editor.hasModel()) {
			return;
		}

		const emptySelectionClipboard = editor.getOption(EditorOption.emptySelectionClipboard);

		if (!emptySelectionClipboard && editor.getSelection().isEmpty()) {
			return;
		}

		CopyOptions.forceCopyWithSyntaxHighlighting = true;
		editor.focus();
		logService.trace('ExecCommandCopyWithSyntaxHighlightingAction (before execCommand copy)');
		executeClipboardCopyWithWorkaround(editor, clipboardService);
		logService.trace('ExecCommandCopyWithSyntaxHighlightingAction (after execCommand copy)');
		CopyOptions.forceCopyWithSyntaxHighlighting = false;
	}
}

function executeClipboardCopyWithWorkaround(editor: IActiveCodeEditor, clipboardService: IClipboardService) {
	// !!!!!
	// This is a workaround for what we think is an Electron bug where
	// execCommand('copy') does not always work (it does not fire a clipboard event)
	// We will use this as a signal that we have executed a copy command
	// !!!!!
	CopyOptions.electronBugWorkaroundCopyEventHasFired = false;
	editor.getContainerDomNode().ownerDocument.execCommand('copy');
	if (platform.isNative && CopyOptions.electronBugWorkaroundCopyEventHasFired === false) {
		// We have encountered the Electron bug!
		// As a workaround, we will write (only the plaintext data) to the clipboard in a different way
		// We will use the clipboard service (which in the native case will go to electron's clipboard API)
		const { dataToCopy } = generateDataToCopyAndStoreInMemory(editor._getViewModel(), editor.getOptions(), undefined, browser.isFirefox);
		clipboardService.writeText(dataToCopy.text);
	}
}

async function pasteWithNavigatorAPI(editor: IActiveCodeEditor, clipboardService: IClipboardService, logService: ILogService): Promise<void> {
	const clipboardText = await clipboardService.readText();
	if (clipboardText !== '') {
		const metadata = InMemoryClipboardMetadataManager.INSTANCE.get(clipboardText);
		let pasteOnNewLine = false;
		let multicursorText: string[] | null = null;
		let mode: string | null = null;
		if (metadata) {
			pasteOnNewLine = (editor.getOption(EditorOption.emptySelectionClipboard) && !!metadata.isFromEmptySelection);
			multicursorText = (typeof metadata.multicursorText !== 'undefined' ? metadata.multicursorText : null);
			mode = metadata.mode;
		}
		logService.trace('pasteWithNavigatorAPI with id : ', metadata?.id, ', clipboardText.length : ', clipboardText.length);
		editor.trigger('keyboard', Handler.Paste, {
			text: clipboardText,
			pasteOnNewLine,
			multicursorText,
			mode
		});
	}
}

function registerExecCommandImpl(target: MultiCommand | undefined, browserCommand: 'cut' | 'copy'): void {
	if (!target) {
		return;
	}

	// 1. handle case when focus is in editor.
	target.addImplementation(10000, 'code-editor', (accessor: ServicesAccessor, args: unknown) => {
		const logService = accessor.get(ILogService);
		const clipboardService = accessor.get(IClipboardService);
		logService.trace('registerExecCommandImpl (addImplementation code-editor for : ', browserCommand, ')');
		// Only if editor text focus (i.e. not if editor has widget focus).
		const focusedEditor = accessor.get(ICodeEditorService).getFocusedCodeEditor();
		if (focusedEditor && focusedEditor.hasTextFocus() && focusedEditor.hasModel()) {
			// Do not execute if there is no selection and empty selection clipboard is off
			const emptySelectionClipboard = focusedEditor.getOption(EditorOption.emptySelectionClipboard);
			const selection = focusedEditor.getSelection();
			if (selection && selection.isEmpty() && !emptySelectionClipboard) {
				return true;
			}
			// TODO this is very ugly. The entire copy/paste/cut system needs a complete refactoring.
			if (focusedEditor.getOption(EditorOption.effectiveEditContext) && browserCommand === 'cut') {
				logCopyCommand(focusedEditor);
				// execCommand(copy) works for edit context, but not execCommand(cut).
				logService.trace('registerExecCommandImpl (before execCommand copy)');
				executeClipboardCopyWithWorkaround(focusedEditor, clipboardService);
				focusedEditor.trigger(undefined, Handler.Cut, undefined);
				logService.trace('registerExecCommandImpl (after execCommand copy)');
			} else {
				logCopyCommand(focusedEditor);
				logService.trace('registerExecCommandImpl (before execCommand ' + browserCommand + ')');
				if (browserCommand === 'copy') {
					executeClipboardCopyWithWorkaround(focusedEditor, clipboardService);
				} else {
					focusedEditor.getContainerDomNode().ownerDocument.execCommand(browserCommand);
				}
				logService.trace('registerExecCommandImpl (after execCommand ' + browserCommand + ')');
			}
			return true;
		}
		return false;
	});

	// 2. (default) handle case when focus is somewhere else.
	target.addImplementation(0, 'generic-dom', (accessor: ServicesAccessor, args: unknown) => {
		const logService = accessor.get(ILogService);
		logService.trace('registerExecCommandImpl (addImplementation generic-dom for : ', browserCommand, ')');
		logService.trace('registerExecCommandImpl (before execCommand ' + browserCommand + ')');
		getActiveDocument().execCommand(browserCommand);
		logService.trace('registerExecCommandImpl (after execCommand ' + browserCommand + ')');
		return true;
	});
}

function logCopyCommand(editor: ICodeEditor) {
	const editContextEnabled = editor.getOption(EditorOption.effectiveEditContext);
	if (editContextEnabled) {
		const nativeEditContext = NativeEditContextRegistry.get(editor.getId());
		if (nativeEditContext) {
			nativeEditContext.onWillCopy();
		}
	}
}

registerExecCommandImpl(CutAction, 'cut');
registerExecCommandImpl(CopyAction, 'copy');

if (PasteAction) {
	// 1. Paste: handle case when focus is in editor.
	PasteAction.addImplementation(10000, 'code-editor', (accessor: ServicesAccessor, args: unknown) => {
		const logService = accessor.get(ILogService);
		logService.trace('registerExecCommandImpl (addImplementation code-editor for : paste)');
		const codeEditorService = accessor.get(ICodeEditorService);
		const clipboardService = accessor.get(IClipboardService);

		// Only if editor text focus (i.e. not if editor has widget focus).
		const focusedEditor = codeEditorService.getFocusedCodeEditor();
		if (focusedEditor && focusedEditor.hasModel() && focusedEditor.hasTextFocus()) {
			// execCommand(paste) does not work with edit context
			const editContextEnabled = focusedEditor.getOption(EditorOption.effectiveEditContext);
			if (editContextEnabled) {
				const nativeEditContext = NativeEditContextRegistry.get(focusedEditor.getId());
				if (nativeEditContext) {
					nativeEditContext.onWillPaste();
				}
			}

			logService.trace('registerExecCommandImpl (before triggerPaste)');
			PasteOptions.electronBugWorkaroundPasteEventHasFired = false;
			const triggerPaste = clipboardService.triggerPaste(getActiveWindow().vscodeWindowId);
			if (triggerPaste) {
				logService.trace('registerExecCommandImpl (triggerPaste defined)');
				return triggerPaste.then(async () => {
					if (PasteOptions.electronBugWorkaroundPasteEventHasFired === false) {
						return pasteWithNavigatorAPI(focusedEditor, clipboardService, logService);
					}
					logService.trace('registerExecCommandImpl (after triggerPaste)');
					return CopyPasteController.get(focusedEditor)?.finishedPaste() ?? Promise.resolve();
				});
			} else {
				logService.trace('registerExecCommandImpl (triggerPaste undefined)');
			}
			if (platform.isWeb) {
				logService.trace('registerExecCommandImpl (Paste handling on web)');
				// Use the clipboard service if document.execCommand('paste') was not successful
				return pasteWithNavigatorAPI(focusedEditor, clipboardService, logService);
			}
			return true;
		}
		return false;
	});

	// 2. Paste: (default) handle case when focus is somewhere else.
	PasteAction.addImplementation(0, 'generic-dom', (accessor: ServicesAccessor, args: unknown) => {
		const logService = accessor.get(ILogService);
		logService.trace('registerExecCommandImpl (addImplementation generic-dom for : paste)');
		const triggerPaste = accessor.get(IClipboardService).triggerPaste(getActiveWindow().vscodeWindowId);
		return triggerPaste ?? false;
	});
}

if (supportsCopy) {
	registerEditorAction(ExecCommandCopyWithSyntaxHighlightingAction);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codeAction/browser/codeAction.ts]---
Location: vscode-main/src/vs/editor/contrib/codeAction/browser/codeAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce, equals, isNonEmptyArray } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { illegalArgument, isCancellationError, onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IProgress, Progress } from '../../../../platform/progress/common/progress.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { IBulkEditService } from '../../../browser/services/bulkEditService.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import * as languages from '../../../common/languages.js';
import { ITextModel } from '../../../common/model.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { IModelService } from '../../../common/services/model.js';
import { EditSources } from '../../../common/textModelEditSource.js';
import { TextModelCancellationTokenSource } from '../../editorState/browser/editorState.js';
import { CodeActionFilter, CodeActionItem, CodeActionKind, CodeActionSet, CodeActionTrigger, CodeActionTriggerSource, filtersAction, mayIncludeActionsOfKind } from '../common/types.js';

export const codeActionCommandId = 'editor.action.codeAction';
export const quickFixCommandId = 'editor.action.quickFix';
export const autoFixCommandId = 'editor.action.autoFix';
export const refactorCommandId = 'editor.action.refactor';
export const refactorPreviewCommandId = 'editor.action.refactor.preview';
export const sourceActionCommandId = 'editor.action.sourceAction';
export const organizeImportsCommandId = 'editor.action.organizeImports';
export const fixAllCommandId = 'editor.action.fixAll';
const CODE_ACTION_SOUND_APPLIED_DURATION = 1000;

class ManagedCodeActionSet extends Disposable implements CodeActionSet {

	private static codeActionsPreferredComparator(a: languages.CodeAction, b: languages.CodeAction): number {
		if (a.isPreferred && !b.isPreferred) {
			return -1;
		} else if (!a.isPreferred && b.isPreferred) {
			return 1;
		} else {
			return 0;
		}
	}

	private static codeActionsComparator({ action: a }: CodeActionItem, { action: b }: CodeActionItem): number {
		if (a.isAI && !b.isAI) {
			return 1;
		} else if (!a.isAI && b.isAI) {
			return -1;
		}
		if (isNonEmptyArray(a.diagnostics)) {
			return isNonEmptyArray(b.diagnostics) ? ManagedCodeActionSet.codeActionsPreferredComparator(a, b) : -1;
		} else if (isNonEmptyArray(b.diagnostics)) {
			return 1;
		} else {
			return ManagedCodeActionSet.codeActionsPreferredComparator(a, b); // both have no diagnostics
		}
	}

	public readonly validActions: readonly CodeActionItem[];
	public readonly allActions: readonly CodeActionItem[];

	public constructor(
		actions: readonly CodeActionItem[],
		public readonly documentation: readonly languages.Command[],
		disposables: DisposableStore,
	) {
		super();

		this._register(disposables);

		this.allActions = [...actions].sort(ManagedCodeActionSet.codeActionsComparator);
		this.validActions = this.allActions.filter(({ action }) => !action.disabled);
	}

	public get hasAutoFix() {
		return this.validActions.some(({ action: fix }) => !!fix.kind && CodeActionKind.QuickFix.contains(new HierarchicalKind(fix.kind)) && !!fix.isPreferred);
	}

	public get hasAIFix() {
		return this.validActions.some(({ action: fix }) => !!fix.isAI);
	}

	public get allAIFixes() {
		return this.validActions.every(({ action: fix }) => !!fix.isAI);
	}
}

const emptyCodeActionsResponse = { actions: [] as CodeActionItem[], documentation: undefined };

export async function getCodeActions(
	registry: LanguageFeatureRegistry<languages.CodeActionProvider>,
	model: ITextModel,
	rangeOrSelection: Range | Selection,
	trigger: CodeActionTrigger,
	progress: IProgress<languages.CodeActionProvider>,
	token: CancellationToken,
): Promise<CodeActionSet> {
	const filter = trigger.filter || {};
	const notebookFilter: CodeActionFilter = {
		...filter,
		excludes: [...(filter.excludes || []), CodeActionKind.Notebook],
	};

	const codeActionContext: languages.CodeActionContext = {
		only: filter.include?.value,
		trigger: trigger.type,
	};

	const cts = new TextModelCancellationTokenSource(model, token);
	// if the trigger is auto (autosave, lightbulb, etc), we should exclude notebook codeActions
	const excludeNotebookCodeActions = (trigger.type === languages.CodeActionTriggerType.Auto);
	const providers = getCodeActionProviders(registry, model, (excludeNotebookCodeActions) ? notebookFilter : filter);

	const disposables = new DisposableStore();
	const promises = providers.map(async provider => {
		const handle = setTimeout(() => progress.report(provider), 1250);
		try {
			const providedCodeActions = await provider.provideCodeActions(model, rangeOrSelection, codeActionContext, cts.token);
			if (cts.token.isCancellationRequested) {
				providedCodeActions?.dispose();
				return emptyCodeActionsResponse;
			}

			if (providedCodeActions) {
				disposables.add(providedCodeActions);
			}

			const filteredActions = (providedCodeActions?.actions || []).filter(action => action && filtersAction(filter, action));
			const documentation = getDocumentationFromProvider(provider, filteredActions, filter.include);
			return {
				actions: filteredActions.map(action => new CodeActionItem(action, provider)),
				documentation
			};
		} catch (err) {
			if (isCancellationError(err)) {
				throw err;
			}
			onUnexpectedExternalError(err);
			return emptyCodeActionsResponse;
		} finally {
			clearTimeout(handle);
		}
	});

	const listener = registry.onDidChange(() => {
		const newProviders = registry.all(model);
		if (!equals(newProviders, providers)) {
			cts.cancel();
		}
	});

	try {
		const actions = await Promise.all(promises);
		const allActions = actions.map(x => x.actions).flat();
		const allDocumentation = [
			...coalesce(actions.map(x => x.documentation)),
			...getAdditionalDocumentationForShowingActions(registry, model, trigger, allActions)
		];
		const managedCodeActionSet = new ManagedCodeActionSet(allActions, allDocumentation, disposables);
		disposables.add(managedCodeActionSet);
		return managedCodeActionSet;
	} catch (err) {
		disposables.dispose();
		throw err;
	} finally {
		listener.dispose();
		cts.dispose();
	}
}

function getCodeActionProviders(
	registry: LanguageFeatureRegistry<languages.CodeActionProvider>,
	model: ITextModel,
	filter: CodeActionFilter
) {
	return registry.all(model)
		// Don't include providers that we know will not return code actions of interest
		.filter(provider => {
			if (!provider.providedCodeActionKinds) {
				// We don't know what type of actions this provider will return.
				return true;
			}
			return provider.providedCodeActionKinds.some(kind => mayIncludeActionsOfKind(filter, new HierarchicalKind(kind)));
		});
}

function* getAdditionalDocumentationForShowingActions(
	registry: LanguageFeatureRegistry<languages.CodeActionProvider>,
	model: ITextModel,
	trigger: CodeActionTrigger,
	actionsToShow: readonly CodeActionItem[],
): Iterable<languages.Command> {
	if (model && actionsToShow.length) {
		for (const provider of registry.all(model)) {
			if (provider._getAdditionalMenuItems) {
				yield* provider._getAdditionalMenuItems?.({ trigger: trigger.type, only: trigger.filter?.include?.value }, actionsToShow.map(item => item.action));
			}
		}
	}
}

function getDocumentationFromProvider(
	provider: languages.CodeActionProvider,
	providedCodeActions: readonly languages.CodeAction[],
	only?: HierarchicalKind
): languages.Command | undefined {
	if (!provider.documentation) {
		return undefined;
	}

	const documentation = provider.documentation.map(entry => ({ kind: new HierarchicalKind(entry.kind), command: entry.command }));

	if (only) {
		let currentBest: { readonly kind: HierarchicalKind; readonly command: languages.Command } | undefined;
		for (const entry of documentation) {
			if (entry.kind.contains(only)) {
				if (!currentBest) {
					currentBest = entry;
				} else {
					// Take best match
					if (currentBest.kind.contains(entry.kind)) {
						currentBest = entry;
					}
				}
			}
		}
		if (currentBest) {
			return currentBest?.command;
		}
	}

	// Otherwise, check to see if any of the provided actions match.
	for (const action of providedCodeActions) {
		if (!action.kind) {
			continue;
		}

		for (const entry of documentation) {
			if (entry.kind.contains(new HierarchicalKind(action.kind))) {
				return entry.command;
			}
		}
	}
	return undefined;
}

export enum ApplyCodeActionReason {
	OnSave = 'onSave',
	FromProblemsView = 'fromProblemsView',
	FromCodeActions = 'fromCodeActions',
	FromAILightbulb = 'fromAILightbulb', // direct invocation when clicking on the AI lightbulb
	FromProblemsHover = 'fromProblemsHover'
}

export async function applyCodeAction(
	accessor: ServicesAccessor,
	item: CodeActionItem,
	codeActionReason: ApplyCodeActionReason,
	options?: { readonly preview?: boolean; readonly editor?: ICodeEditor },
	token: CancellationToken = CancellationToken.None,
): Promise<void> {
	const bulkEditService = accessor.get(IBulkEditService);
	const commandService = accessor.get(ICommandService);
	const telemetryService = accessor.get(ITelemetryService);
	const notificationService = accessor.get(INotificationService);
	const accessibilitySignalService = accessor.get(IAccessibilitySignalService);

	type ApplyCodeActionEvent = {
		codeActionTitle: string;
		codeActionKind: string | undefined;
		codeActionIsPreferred: boolean;
		reason: ApplyCodeActionReason;
	};
	type ApplyCodeEventClassification = {
		codeActionTitle: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The display label of the applied code action' };
		codeActionKind: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The kind (refactor, quickfix) of the applied code action' };
		codeActionIsPreferred: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Was the code action marked as being a preferred action?' };
		reason: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The kind of action used to trigger apply code action.' };
		owner: 'justschen';
		comment: 'Event used to gain insights into which code actions are being triggered';
	};

	telemetryService.publicLog2<ApplyCodeActionEvent, ApplyCodeEventClassification>('codeAction.applyCodeAction', {
		codeActionTitle: item.action.title,
		codeActionKind: item.action.kind,
		codeActionIsPreferred: !!item.action.isPreferred,
		reason: codeActionReason,
	});
	accessibilitySignalService.playSignal(AccessibilitySignal.codeActionTriggered);
	await item.resolve(token);
	if (token.isCancellationRequested) {
		return;
	}

	if (item.action.edit?.edits.length) {
		const result = await bulkEditService.apply(item.action.edit, {
			editor: options?.editor,
			label: item.action.title,
			quotableLabel: item.action.title,
			code: 'undoredo.codeAction',
			respectAutoSaveConfig: codeActionReason !== ApplyCodeActionReason.OnSave,
			showPreview: options?.preview,
			reason: EditSources.codeAction({ kind: item.action.kind, providerId: languages.ProviderId.fromExtensionId(item.provider?.extensionId) }),
		});

		if (!result.isApplied) {
			return;
		}
	}

	if (item.action.command) {
		try {
			await commandService.executeCommand(item.action.command.id, ...(item.action.command.arguments || []));
		} catch (err) {
			const message = asMessage(err);
			notificationService.error(
				typeof message === 'string'
					? message
					: nls.localize('applyCodeActionFailed', "An unknown error occurred while applying the code action"));
		}
	}
	// ensure the start sound and end sound do not overlap
	setTimeout(() => accessibilitySignalService.playSignal(AccessibilitySignal.codeActionApplied), CODE_ACTION_SOUND_APPLIED_DURATION);
}

function asMessage(err: any): string | undefined {
	if (typeof err === 'string') {
		return err;
	} else if (err instanceof Error && typeof err.message === 'string') {
		return err.message;
	} else {
		return undefined;
	}
}

CommandsRegistry.registerCommand('_executeCodeActionProvider', async function (accessor, resource: URI, rangeOrSelection: Range | Selection, kind?: string, itemResolveCount?: number): Promise<ReadonlyArray<languages.CodeAction>> {
	if (!(resource instanceof URI)) {
		throw illegalArgument();
	}

	const { codeActionProvider } = accessor.get(ILanguageFeaturesService);
	const model = accessor.get(IModelService).getModel(resource);
	if (!model) {
		throw illegalArgument();
	}

	const validatedRangeOrSelection = Selection.isISelection(rangeOrSelection)
		? Selection.liftSelection(rangeOrSelection)
		: Range.isIRange(rangeOrSelection)
			? model.validateRange(rangeOrSelection)
			: undefined;

	if (!validatedRangeOrSelection) {
		throw illegalArgument();
	}

	const include = typeof kind === 'string' ? new HierarchicalKind(kind) : undefined;
	const codeActionSet = await getCodeActions(
		codeActionProvider,
		model,
		validatedRangeOrSelection,
		{ type: languages.CodeActionTriggerType.Invoke, triggerAction: CodeActionTriggerSource.Default, filter: { includeSourceActions: true, include } },
		Progress.None,
		CancellationToken.None);

	const resolving: Promise<any>[] = [];
	const resolveCount = Math.min(codeActionSet.validActions.length, typeof itemResolveCount === 'number' ? itemResolveCount : 0);
	for (let i = 0; i < resolveCount; i++) {
		resolving.push(codeActionSet.validActions[i].resolve(CancellationToken.None));
	}

	try {
		await Promise.all(resolving);
		return codeActionSet.validActions.map(item => item.action);
	} finally {
		setTimeout(() => codeActionSet.dispose(), 100);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codeAction/browser/codeActionCommands.ts]---
Location: vscode-main/src/vs/editor/contrib/codeAction/browser/codeActionCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';
import { IJSONSchema, TypeFromJsonSchema } from '../../../../base/common/jsonSchema.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { escapeRegExpCharacters } from '../../../../base/common/strings.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorCommand, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { autoFixCommandId, codeActionCommandId, fixAllCommandId, organizeImportsCommandId, quickFixCommandId, refactorCommandId, sourceActionCommandId } from './codeAction.js';
import * as nls from '../../../../nls.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { CodeActionAutoApply, CodeActionCommandArgs, CodeActionFilter, CodeActionKind, CodeActionTriggerSource } from '../common/types.js';
import { CodeActionController } from './codeActionController.js';
import { SUPPORTED_CODE_ACTIONS } from './codeActionModel.js';

function contextKeyForSupportedActions(kind: HierarchicalKind) {
	return ContextKeyExpr.regex(
		SUPPORTED_CODE_ACTIONS.keys()[0],
		new RegExp('(\\s|^)' + escapeRegExpCharacters(kind.value) + '\\b'));
}

const argsSchema = {
	type: 'object',
	defaultSnippets: [{ body: { kind: '' } }],
	properties: {
		'kind': {
			type: 'string',
			description: nls.localize('args.schema.kind', "Kind of the code action to run."),
		},
		'apply': {
			type: 'string',
			description: nls.localize('args.schema.apply', "Controls when the returned actions are applied."),
			default: CodeActionAutoApply.IfSingle,
			enum: [CodeActionAutoApply.First, CodeActionAutoApply.IfSingle, CodeActionAutoApply.Never],
			enumDescriptions: [
				nls.localize('args.schema.apply.first', "Always apply the first returned code action."),
				nls.localize('args.schema.apply.ifSingle', "Apply the first returned code action if it is the only one."),
				nls.localize('args.schema.apply.never', "Do not apply the returned code actions."),
			]
		},
		'preferred': {
			type: 'boolean',
			default: false,
			description: nls.localize('args.schema.preferred', "Controls if only preferred code actions should be returned."),
		}
	}
} as const satisfies IJSONSchema;

function triggerCodeActionsForEditorSelection(
	editor: ICodeEditor,
	notAvailableMessage: string,
	filter: CodeActionFilter | undefined,
	autoApply: CodeActionAutoApply | undefined,
	triggerAction: CodeActionTriggerSource = CodeActionTriggerSource.Default
): void {
	if (editor.hasModel()) {
		const controller = CodeActionController.get(editor);
		controller?.manualTriggerAtCurrentPosition(notAvailableMessage, triggerAction, filter, autoApply);
	}
}

export class QuickFixAction extends EditorAction {

	constructor() {
		super({
			id: quickFixCommandId,
			label: nls.localize2('quickfix.trigger.label', "Quick Fix..."),
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: KeyMod.CtrlCmd | KeyCode.Period,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		return triggerCodeActionsForEditorSelection(editor, nls.localize('editor.action.quickFix.noneMessage', "No code actions available"), undefined, undefined, CodeActionTriggerSource.QuickFix);
	}
}

export class CodeActionCommand extends EditorCommand {

	constructor() {
		super({
			id: codeActionCommandId,
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
			metadata: {
				description: 'Trigger a code action',
				args: [{ name: 'args', schema: argsSchema, }]
			}
		});
	}

	public runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor, userArgs?: TypeFromJsonSchema<typeof argsSchema>): void {
		const args = CodeActionCommandArgs.fromUser(userArgs, {
			kind: HierarchicalKind.Empty,
			apply: CodeActionAutoApply.IfSingle,
		});
		return triggerCodeActionsForEditorSelection(editor,
			typeof userArgs?.kind === 'string'
				? args.preferred
					? nls.localize('editor.action.codeAction.noneMessage.preferred.kind', "No preferred code actions for '{0}' available", userArgs.kind)
					: nls.localize('editor.action.codeAction.noneMessage.kind', "No code actions for '{0}' available", userArgs.kind)
				: args.preferred
					? nls.localize('editor.action.codeAction.noneMessage.preferred', "No preferred code actions available")
					: nls.localize('editor.action.codeAction.noneMessage', "No code actions available"),
			{
				include: args.kind,
				includeSourceActions: true,
				onlyIncludePreferredActions: args.preferred,
			},
			args.apply);
	}
}


export class RefactorAction extends EditorAction {

	constructor() {
		super({
			id: refactorCommandId,
			label: nls.localize2('refactor.label', "Refactor..."),
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyR,
				mac: {
					primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.KeyR
				},
				weight: KeybindingWeight.EditorContrib
			},
			contextMenuOpts: {
				group: '1_modification',
				order: 2,
				when: ContextKeyExpr.and(
					EditorContextKeys.writable,
					contextKeyForSupportedActions(CodeActionKind.Refactor)),
			},
			metadata: {
				description: 'Refactor...',
				args: [{ name: 'args', schema: argsSchema }]
			}
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor, userArgs?: TypeFromJsonSchema<typeof argsSchema>): void {
		const args = CodeActionCommandArgs.fromUser(userArgs, {
			kind: CodeActionKind.Refactor,
			apply: CodeActionAutoApply.Never
		});
		return triggerCodeActionsForEditorSelection(editor,
			typeof userArgs?.kind === 'string'
				? args.preferred
					? nls.localize('editor.action.refactor.noneMessage.preferred.kind', "No preferred refactorings for '{0}' available", userArgs.kind)
					: nls.localize('editor.action.refactor.noneMessage.kind', "No refactorings for '{0}' available", userArgs.kind)
				: args.preferred
					? nls.localize('editor.action.refactor.noneMessage.preferred', "No preferred refactorings available")
					: nls.localize('editor.action.refactor.noneMessage', "No refactorings available"),
			{
				include: CodeActionKind.Refactor.contains(args.kind) ? args.kind : HierarchicalKind.None,
				onlyIncludePreferredActions: args.preferred
			},
			args.apply, CodeActionTriggerSource.Refactor);
	}
}

export class SourceAction extends EditorAction {

	constructor() {
		super({
			id: sourceActionCommandId,
			label: nls.localize2('source.label', "Source Action..."),
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
			contextMenuOpts: {
				group: '1_modification',
				order: 2.1,
				when: ContextKeyExpr.and(
					EditorContextKeys.writable,
					contextKeyForSupportedActions(CodeActionKind.Source)),
			},
			metadata: {
				description: 'Source Action...',
				args: [{ name: 'args', schema: argsSchema }]
			}
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor, userArgs?: TypeFromJsonSchema<typeof argsSchema>): void {
		const args = CodeActionCommandArgs.fromUser(userArgs, {
			kind: CodeActionKind.Source,
			apply: CodeActionAutoApply.Never
		});
		return triggerCodeActionsForEditorSelection(editor,
			typeof userArgs?.kind === 'string'
				? args.preferred
					? nls.localize('editor.action.source.noneMessage.preferred.kind', "No preferred source actions for '{0}' available", userArgs.kind)
					: nls.localize('editor.action.source.noneMessage.kind', "No source actions for '{0}' available", userArgs.kind)
				: args.preferred
					? nls.localize('editor.action.source.noneMessage.preferred', "No preferred source actions available")
					: nls.localize('editor.action.source.noneMessage', "No source actions available"),
			{
				include: CodeActionKind.Source.contains(args.kind) ? args.kind : HierarchicalKind.None,
				includeSourceActions: true,
				onlyIncludePreferredActions: args.preferred,
			},
			args.apply, CodeActionTriggerSource.SourceAction);
	}
}

export class OrganizeImportsAction extends EditorAction {

	constructor() {
		super({
			id: organizeImportsCommandId,
			label: nls.localize2('organizeImports.label', "Organize Imports"),
			precondition: ContextKeyExpr.and(
				EditorContextKeys.writable,
				contextKeyForSupportedActions(CodeActionKind.SourceOrganizeImports)),
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KeyO,
				weight: KeybindingWeight.EditorContrib
			},
			metadata: {
				description: nls.localize2('organizeImports.description', "Organize imports in the current file. Also called 'Optimize Imports' by some tools")
			}
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		return triggerCodeActionsForEditorSelection(editor,
			nls.localize('editor.action.organize.noneMessage', "No organize imports action available"),
			{ include: CodeActionKind.SourceOrganizeImports, includeSourceActions: true },
			CodeActionAutoApply.IfSingle, CodeActionTriggerSource.OrganizeImports);
	}
}

export class FixAllAction extends EditorAction {

	constructor() {
		super({
			id: fixAllCommandId,
			label: nls.localize2('fixAll.label', "Fix All"),
			precondition: ContextKeyExpr.and(
				EditorContextKeys.writable,
				contextKeyForSupportedActions(CodeActionKind.SourceFixAll))
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		return triggerCodeActionsForEditorSelection(editor,
			nls.localize('fixAll.noneMessage', "No fix all action available"),
			{ include: CodeActionKind.SourceFixAll, includeSourceActions: true },
			CodeActionAutoApply.IfSingle, CodeActionTriggerSource.FixAll);
	}
}

export class AutoFixAction extends EditorAction {

	constructor() {
		super({
			id: autoFixCommandId,
			label: nls.localize2('autoFix.label', "Auto Fix..."),
			precondition: ContextKeyExpr.and(
				EditorContextKeys.writable,
				contextKeyForSupportedActions(CodeActionKind.QuickFix)),
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: KeyMod.Alt | KeyMod.Shift | KeyCode.Period,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Period
				},
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		return triggerCodeActionsForEditorSelection(editor,
			nls.localize('editor.action.autoFix.noneMessage', "No auto fixes available"),
			{
				include: CodeActionKind.QuickFix,
				onlyIncludePreferredActions: true
			},
			CodeActionAutoApply.IfSingle, CodeActionTriggerSource.AutoFix);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codeAction/browser/codeActionContributions.ts]---
Location: vscode-main/src/vs/editor/contrib/codeAction/browser/codeActionContributions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorContributionInstantiation, registerEditorAction, registerEditorCommand, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { editorConfigurationBaseNode } from '../../../common/config/editorConfigurationSchema.js';
import { AutoFixAction, CodeActionCommand, FixAllAction, OrganizeImportsAction, QuickFixAction, RefactorAction, SourceAction } from './codeActionCommands.js';
import { CodeActionController } from './codeActionController.js';
import { LightBulbWidget } from './lightBulbWidget.js';
import * as nls from '../../../../nls.js';
import { ConfigurationScope, Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';

registerEditorContribution(CodeActionController.ID, CodeActionController, EditorContributionInstantiation.Eventually);
registerEditorContribution(LightBulbWidget.ID, LightBulbWidget, EditorContributionInstantiation.Lazy);
registerEditorAction(QuickFixAction);
registerEditorAction(RefactorAction);
registerEditorAction(SourceAction);
registerEditorAction(OrganizeImportsAction);
registerEditorAction(AutoFixAction);
registerEditorAction(FixAllAction);
registerEditorCommand(new CodeActionCommand());

Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration({
	...editorConfigurationBaseNode,
	properties: {
		'editor.codeActionWidget.showHeaders': {
			type: 'boolean',
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			description: nls.localize('showCodeActionHeaders', "Enable/disable showing group headers in the Code Action menu."),
			default: true,
		},
	}
});

Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration({
	...editorConfigurationBaseNode,
	properties: {
		'editor.codeActionWidget.includeNearbyQuickFixes': {
			type: 'boolean',
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			description: nls.localize('includeNearbyQuickFixes', "Enable/disable showing nearest Quick Fix within a line when not currently on a diagnostic."),
			default: true,
		},
	}
});

Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration({
	...editorConfigurationBaseNode,
	properties: {
		'editor.codeActions.triggerOnFocusChange': {
			type: 'boolean',
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: nls.localize('triggerOnFocusChange', 'Enable triggering {0} when {1} is set to {2}. Code Actions must be set to {3} to be triggered for window and focus changes.', '`#editor.codeActionsOnSave#`', '`#files.autoSave#`', '`afterDelay`', '`always`'),
			default: false,
		},
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codeAction/browser/codeActionController.ts]---
Location: vscode-main/src/vs/editor/contrib/codeAction/browser/codeActionController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getDomNodePagePosition } from '../../../../base/browser/dom.js';
import * as aria from '../../../../base/browser/ui/aria/aria.js';
import { IAnchor } from '../../../../base/browser/ui/contextview/contextview.js';
import { IAction } from '../../../../base/common/actions.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Color } from '../../../../base/common/color.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { IActionListDelegate } from '../../../../platform/actionWidget/browser/actionList.js';
import { IActionWidgetService } from '../../../../platform/actionWidget/browser/actionWidget.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IMarkerService } from '../../../../platform/markers/common/markers.js';
import { IEditorProgressService } from '../../../../platform/progress/common/progress.js';
import { editorFindMatchHighlight, editorFindMatchHighlightBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { isHighContrast } from '../../../../platform/theme/common/theme.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { IEditorContribution, ScrollType } from '../../../common/editorCommon.js';
import { CodeActionTriggerType } from '../../../common/languages.js';
import { IModelDeltaDecoration } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { MessageController } from '../../message/browser/messageController.js';
import { CodeActionAutoApply, CodeActionFilter, CodeActionItem, CodeActionKind, CodeActionSet, CodeActionTrigger, CodeActionTriggerSource } from '../common/types.js';
import { ApplyCodeActionReason, applyCodeAction } from './codeAction.js';
import { CodeActionKeybindingResolver } from './codeActionKeybindingResolver.js';
import { toMenuItems } from './codeActionMenu.js';
import { CodeActionModel, CodeActionsState } from './codeActionModel.js';
import { LightBulbWidget } from './lightBulbWidget.js';

interface IActionShowOptions {
	readonly includeDisabledActions?: boolean;
	readonly fromLightbulb?: boolean;
}


const DECORATION_CLASS_NAME = 'quickfix-edit-highlight';

export class CodeActionController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.codeActionController';

	public static get(editor: ICodeEditor): CodeActionController | null {
		return editor.getContribution<CodeActionController>(CodeActionController.ID);
	}

	private readonly _editor: ICodeEditor;
	private readonly _model: CodeActionModel;

	private readonly _lightBulbWidget: Lazy<LightBulbWidget | null>;
	private readonly _activeCodeActions = this._register(new MutableDisposable<CodeActionSet>());
	private _showDisabled = false;

	private readonly _resolver: CodeActionKeybindingResolver;

	private _disposed = false;

	constructor(
		editor: ICodeEditor,
		@IMarkerService markerService: IMarkerService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IEditorProgressService progressService: IEditorProgressService,
		@ICommandService private readonly _commandService: ICommandService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IActionWidgetService private readonly _actionWidgetService: IActionWidgetService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IEditorProgressService private readonly _progressService: IEditorProgressService,
	) {
		super();

		this._editor = editor;
		this._model = this._register(new CodeActionModel(this._editor, languageFeaturesService.codeActionProvider, markerService, contextKeyService, progressService, _configurationService));
		this._register(this._model.onDidChangeState(newState => this.update(newState)));

		this._lightBulbWidget = new Lazy(() => {
			const widget = this._editor.getContribution<LightBulbWidget>(LightBulbWidget.ID);
			if (widget) {
				this._register(widget.onClick(e => this.showCodeActionsFromLightbulb(e.actions, e)));
			}
			return widget;
		});

		this._resolver = instantiationService.createInstance(CodeActionKeybindingResolver);

		this._register(this._editor.onDidLayoutChange(() => this._actionWidgetService.hide()));
	}

	override dispose() {
		this._disposed = true;
		super.dispose();
	}

	private async showCodeActionsFromLightbulb(actions: CodeActionSet, at: IAnchor | IPosition): Promise<void> {
		if (actions.allAIFixes && actions.validActions.length === 1) {
			const actionItem = actions.validActions[0];
			const command = actionItem.action.command;
			if (command && command.id === 'inlineChat.start') {
				if (command.arguments && command.arguments.length >= 1 && command.arguments[0]) {
					command.arguments[0] = { ...command.arguments[0], autoSend: false };
				}
			}
			await this.applyCodeAction(actionItem, false, false, ApplyCodeActionReason.FromAILightbulb);
			return;
		}
		await this.showCodeActionList(actions, at, { includeDisabledActions: false, fromLightbulb: true });
	}

	public showCodeActions(_trigger: CodeActionTrigger, actions: CodeActionSet, at: IAnchor | IPosition) {
		return this.showCodeActionList(actions, at, { includeDisabledActions: false, fromLightbulb: false });
	}

	public hideCodeActions(): void {
		this._actionWidgetService.hide();
	}

	public manualTriggerAtCurrentPosition(
		notAvailableMessage: string,
		triggerAction: CodeActionTriggerSource,
		filter?: CodeActionFilter,
		autoApply?: CodeActionAutoApply,
	): void {
		if (!this._editor.hasModel()) {
			return;
		}

		MessageController.get(this._editor)?.closeMessage();
		const triggerPosition = this._editor.getPosition();
		this._trigger({ type: CodeActionTriggerType.Invoke, triggerAction, filter, autoApply, context: { notAvailableMessage, position: triggerPosition } });
	}

	private _trigger(trigger: CodeActionTrigger) {
		return this._model.trigger(trigger);
	}

	async applyCodeAction(action: CodeActionItem, retrigger: boolean, preview: boolean, actionReason: ApplyCodeActionReason): Promise<void> {
		const progress = this._progressService.show(true, 500);
		try {
			await this._instantiationService.invokeFunction(applyCodeAction, action, actionReason, { preview, editor: this._editor });
		} finally {
			if (retrigger) {
				this._trigger({ type: CodeActionTriggerType.Auto, triggerAction: CodeActionTriggerSource.QuickFix, filter: {} });
			}
			progress.done();
		}
	}

	public hideLightBulbWidget(): void {
		this._lightBulbWidget.rawValue?.hide();
		this._lightBulbWidget.rawValue?.gutterHide();
	}

	private async update(newState: CodeActionsState.State): Promise<void> {
		if (newState.type !== CodeActionsState.Type.Triggered) {
			this.hideLightBulbWidget();
			return;
		}

		let actions: CodeActionSet;
		try {
			actions = await newState.actions;
		} catch (e) {
			onUnexpectedError(e);
			return;
		}

		if (this._disposed) {
			return;
		}


		const selection = this._editor.getSelection();
		if (selection?.startLineNumber !== newState.position.lineNumber) {
			return;
		}

		this._lightBulbWidget.value?.update(actions, newState.trigger, newState.position);

		if (newState.trigger.type === CodeActionTriggerType.Invoke) {
			if (newState.trigger.filter?.include) { // Triggered for specific scope
				// Check to see if we want to auto apply.

				const validActionToApply = this.tryGetValidActionToApply(newState.trigger, actions);
				if (validActionToApply) {
					try {
						this.hideLightBulbWidget();
						await this.applyCodeAction(validActionToApply, false, false, ApplyCodeActionReason.FromCodeActions);
					} finally {
						actions.dispose();
					}
					return;
				}

				// Check to see if there is an action that we would have applied were it not invalid
				if (newState.trigger.context) {
					const invalidAction = this.getInvalidActionThatWouldHaveBeenApplied(newState.trigger, actions);
					if (invalidAction && invalidAction.action.disabled) {
						MessageController.get(this._editor)?.showMessage(invalidAction.action.disabled, newState.trigger.context.position);
						actions.dispose();
						return;
					}
				}
			}

			const includeDisabledActions = !!newState.trigger.filter?.include;
			if (newState.trigger.context) {
				if (!actions.allActions.length || !includeDisabledActions && !actions.validActions.length) {
					MessageController.get(this._editor)?.showMessage(newState.trigger.context.notAvailableMessage, newState.trigger.context.position);
					this._activeCodeActions.value = actions;
					actions.dispose();
					return;
				}
			}

			this._activeCodeActions.value = actions;
			this.showCodeActionList(actions, this.toCoords(newState.position), { includeDisabledActions, fromLightbulb: false });
		} else {
			// auto magically triggered
			if (this._actionWidgetService.isVisible) {
				// TODO: Figure out if we should update the showing menu?
				actions.dispose();
			} else {
				this._activeCodeActions.value = actions;
			}
		}
	}

	private getInvalidActionThatWouldHaveBeenApplied(trigger: CodeActionTrigger, actions: CodeActionSet): CodeActionItem | undefined {
		if (!actions.allActions.length) {
			return undefined;
		}

		if ((trigger.autoApply === CodeActionAutoApply.First && actions.validActions.length === 0)
			|| (trigger.autoApply === CodeActionAutoApply.IfSingle && actions.allActions.length === 1)
		) {
			return actions.allActions.find(({ action }) => action.disabled);
		}

		return undefined;
	}

	private tryGetValidActionToApply(trigger: CodeActionTrigger, actions: CodeActionSet): CodeActionItem | undefined {
		if (!actions.validActions.length) {
			return undefined;
		}

		if ((trigger.autoApply === CodeActionAutoApply.First && actions.validActions.length > 0)
			|| (trigger.autoApply === CodeActionAutoApply.IfSingle && actions.validActions.length === 1)
		) {
			return actions.validActions[0];
		}

		return undefined;
	}

	private static readonly DECORATION = ModelDecorationOptions.register({
		description: 'quickfix-highlight',
		className: DECORATION_CLASS_NAME
	});

	public async showCodeActionList(actions: CodeActionSet, at: IAnchor | IPosition, options: IActionShowOptions): Promise<void> {

		const currentDecorations = this._editor.createDecorationsCollection();

		const editorDom = this._editor.getDomNode();
		if (!editorDom) {
			return;
		}

		const actionsToShow = options.includeDisabledActions && (this._showDisabled || actions.validActions.length === 0) ? actions.allActions : actions.validActions;
		if (!actionsToShow.length) {
			return;
		}

		const anchor = Position.isIPosition(at) ? this.toCoords(at) : at;

		const delegate: IActionListDelegate<CodeActionItem> = {
			onSelect: async (action: CodeActionItem, preview?: boolean) => {
				this.applyCodeAction(action, /* retrigger */ true, !!preview, options.fromLightbulb ? ApplyCodeActionReason.FromAILightbulb : ApplyCodeActionReason.FromCodeActions);
				this._actionWidgetService.hide(false);
				currentDecorations.clear();
			},
			onHide: (didCancel?) => {
				this._editor?.focus();
				currentDecorations.clear();
			},
			onHover: async (action: CodeActionItem, token: CancellationToken) => {
				if (token.isCancellationRequested) {
					return;
				}

				let canPreview = false;
				const actionKind = action.action.kind;

				if (actionKind) {
					const hierarchicalKind = new HierarchicalKind(actionKind);
					const refactorKinds = [
						CodeActionKind.RefactorExtract,
						CodeActionKind.RefactorInline,
						CodeActionKind.RefactorRewrite,
						CodeActionKind.RefactorMove,
						CodeActionKind.Source
					];

					canPreview = refactorKinds.some(refactorKind => refactorKind.contains(hierarchicalKind));
				}

				return { canPreview: canPreview || !!action.action.edit?.edits.length };
			},
			onFocus: (action: CodeActionItem | undefined) => {
				if (action && action.action) {
					const ranges = action.action.ranges;
					const diagnostics = action.action.diagnostics;
					currentDecorations.clear();
					if (ranges && ranges.length > 0) {
						// Handles case for `fix all` where there are multiple diagnostics.
						const decorations: IModelDeltaDecoration[] = (diagnostics && diagnostics?.length > 1)
							? diagnostics.map(diagnostic => ({ range: diagnostic, options: CodeActionController.DECORATION }))
							: ranges.map(range => ({ range, options: CodeActionController.DECORATION }));
						currentDecorations.set(decorations);
					} else if (diagnostics && diagnostics.length > 0) {
						const decorations: IModelDeltaDecoration[] = diagnostics.map(diagnostic => ({ range: diagnostic, options: CodeActionController.DECORATION }));
						currentDecorations.set(decorations);
						const diagnostic = diagnostics[0];
						if (diagnostic.startLineNumber && diagnostic.startColumn) {
							const selectionText = this._editor.getModel()?.getWordAtPosition({ lineNumber: diagnostic.startLineNumber, column: diagnostic.startColumn })?.word;
							aria.status(localize('editingNewSelection', "Context: {0} at line {1} and column {2}.", selectionText, diagnostic.startLineNumber, diagnostic.startColumn));
						}
					}
				} else {
					currentDecorations.clear();
				}
			}
		};

		this._actionWidgetService.show(
			'codeActionWidget',
			true,
			toMenuItems(actionsToShow, this._shouldShowHeaders(), this._resolver.getResolver()),
			delegate,
			anchor,
			editorDom,
			this._getActionBarActions(actions, at, options));
	}

	private toCoords(position: IPosition): IAnchor {
		if (!this._editor.hasModel()) {
			return { x: 0, y: 0 };
		}

		this._editor.revealPosition(position, ScrollType.Immediate);
		this._editor.render();

		// Translate to absolute editor position
		const cursorCoords = this._editor.getScrolledVisiblePosition(position);
		const editorCoords = getDomNodePagePosition(this._editor.getDomNode());
		const x = editorCoords.left + cursorCoords.left;
		const y = editorCoords.top + cursorCoords.top + cursorCoords.height;

		return { x, y };
	}

	private _shouldShowHeaders(): boolean {
		const model = this._editor?.getModel();
		return this._configurationService.getValue('editor.codeActionWidget.showHeaders', { resource: model?.uri });
	}

	private _getActionBarActions(actions: CodeActionSet, at: IAnchor | IPosition, options: IActionShowOptions): IAction[] {
		if (options.fromLightbulb) {
			return [];
		}

		const resultActions = actions.documentation.map((command): IAction => ({
			id: command.id,
			label: command.title,
			tooltip: command.tooltip ?? '',
			class: undefined,
			enabled: true,
			run: () => this._commandService.executeCommand(command.id, ...(command.arguments ?? [])),
		}));

		if (options.includeDisabledActions && actions.validActions.length > 0 && actions.allActions.length !== actions.validActions.length) {
			resultActions.push(this._showDisabled ? {
				id: 'hideMoreActions',
				label: localize('hideMoreActions', 'Hide Disabled'),
				enabled: true,
				tooltip: '',
				class: undefined,
				run: () => {
					this._showDisabled = false;
					return this.showCodeActionList(actions, at, options);
				}
			} : {
				id: 'showMoreActions',
				label: localize('showMoreActions', 'Show Disabled'),
				enabled: true,
				tooltip: '',
				class: undefined,
				run: () => {
					this._showDisabled = true;
					return this.showCodeActionList(actions, at, options);
				}
			});
		}

		return resultActions;
	}
}

registerThemingParticipant((theme, collector) => {
	const addBackgroundColorRule = (selector: string, color: Color | undefined): void => {
		if (color) {
			collector.addRule(`.monaco-editor ${selector} { background-color: ${color}; }`);
		}
	};

	addBackgroundColorRule('.quickfix-edit-highlight', theme.getColor(editorFindMatchHighlight));
	const findMatchHighlightBorder = theme.getColor(editorFindMatchHighlightBorder);

	if (findMatchHighlightBorder) {
		collector.addRule(`.monaco-editor .quickfix-edit-highlight { border: 1px ${isHighContrast(theme.type) ? 'dotted' : 'solid'} ${findMatchHighlightBorder}; box-sizing: border-box; }`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codeAction/browser/codeActionKeybindingResolver.ts]---
Location: vscode-main/src/vs/editor/contrib/codeAction/browser/codeActionKeybindingResolver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';
import { ResolvedKeybinding } from '../../../../base/common/keybindings.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { CodeAction } from '../../../common/languages.js';
import { codeActionCommandId, fixAllCommandId, organizeImportsCommandId, refactorCommandId, sourceActionCommandId } from './codeAction.js';
import { CodeActionAutoApply, CodeActionCommandArgs, CodeActionKind } from '../common/types.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';

interface ResolveCodeActionKeybinding {
	readonly kind: HierarchicalKind;
	readonly preferred: boolean;
	readonly resolvedKeybinding: ResolvedKeybinding;
}

export class CodeActionKeybindingResolver {
	private static readonly codeActionCommands: readonly string[] = [
		refactorCommandId,
		codeActionCommandId,
		sourceActionCommandId,
		organizeImportsCommandId,
		fixAllCommandId
	];

	constructor(
		@IKeybindingService private readonly keybindingService: IKeybindingService
	) { }

	public getResolver(): (action: CodeAction) => ResolvedKeybinding | undefined {
		// Lazy since we may not actually ever read the value
		const allCodeActionBindings = new Lazy<readonly ResolveCodeActionKeybinding[]>(() => this.keybindingService.getKeybindings()
			.filter(item => CodeActionKeybindingResolver.codeActionCommands.indexOf(item.command!) >= 0)
			.filter(item => item.resolvedKeybinding)
			.map((item): ResolveCodeActionKeybinding => {
				// Special case these commands since they come built-in with VS Code and don't use 'commandArgs'
				let commandArgs = item.commandArgs;
				if (item.command === organizeImportsCommandId) {
					commandArgs = { kind: CodeActionKind.SourceOrganizeImports.value };
				} else if (item.command === fixAllCommandId) {
					commandArgs = { kind: CodeActionKind.SourceFixAll.value };
				}

				return {
					resolvedKeybinding: item.resolvedKeybinding!,
					...CodeActionCommandArgs.fromUser(commandArgs, {
						kind: HierarchicalKind.None,
						apply: CodeActionAutoApply.Never
					})
				};
			}));

		return (action) => {
			if (action.kind) {
				const binding = this.bestKeybindingForCodeAction(action, allCodeActionBindings.value);
				return binding?.resolvedKeybinding;
			}
			return undefined;
		};
	}

	private bestKeybindingForCodeAction(
		action: CodeAction,
		candidates: readonly ResolveCodeActionKeybinding[]
	): ResolveCodeActionKeybinding | undefined {
		if (!action.kind) {
			return undefined;
		}
		const kind = new HierarchicalKind(action.kind);

		return candidates
			.filter(candidate => candidate.kind.contains(kind))
			.filter(candidate => {
				if (candidate.preferred) {
					// If the candidate keybinding only applies to preferred actions, the this action must also be preferred
					return action.isPreferred;
				}
				return true;
			})
			.reduceRight((currentBest, candidate) => {
				if (!currentBest) {
					return candidate;
				}
				// Select the more specific binding
				return currentBest.kind.contains(candidate.kind) ? candidate : currentBest;
			}, undefined as ResolveCodeActionKeybinding | undefined);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codeAction/browser/codeActionMenu.ts]---
Location: vscode-main/src/vs/editor/contrib/codeAction/browser/codeActionMenu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../../../../base/browser/ui/codicons/codiconStyles.js'; // The codicon symbol styles are defined here and must be loaded
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { ResolvedKeybinding } from '../../../../base/common/keybindings.js';
import { CodeAction } from '../../../common/languages.js';
import { CodeActionItem, CodeActionKind } from '../common/types.js';
import '../../symbolIcons/browser/symbolIcons.js'; // The codicon symbol colors are defined here and must be loaded to get colors
import { localize } from '../../../../nls.js';
import { ActionListItemKind, IActionListItem } from '../../../../platform/actionWidget/browser/actionList.js';
import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';

interface ActionGroup {
	readonly kind: HierarchicalKind;
	readonly title: string;
	readonly icon?: ThemeIcon;
}

const uncategorizedCodeActionGroup = Object.freeze<ActionGroup>({ kind: HierarchicalKind.Empty, title: localize('codeAction.widget.id.more', 'More Actions...') });

const codeActionGroups = Object.freeze<ActionGroup[]>([
	{ kind: CodeActionKind.QuickFix, title: localize('codeAction.widget.id.quickfix', 'Quick Fix') },
	{ kind: CodeActionKind.RefactorExtract, title: localize('codeAction.widget.id.extract', 'Extract'), icon: Codicon.wrench },
	{ kind: CodeActionKind.RefactorInline, title: localize('codeAction.widget.id.inline', 'Inline'), icon: Codicon.wrench },
	{ kind: CodeActionKind.RefactorRewrite, title: localize('codeAction.widget.id.convert', 'Rewrite'), icon: Codicon.wrench },
	{ kind: CodeActionKind.RefactorMove, title: localize('codeAction.widget.id.move', 'Move'), icon: Codicon.wrench },
	{ kind: CodeActionKind.SurroundWith, title: localize('codeAction.widget.id.surround', 'Surround With'), icon: Codicon.surroundWith },
	{ kind: CodeActionKind.Source, title: localize('codeAction.widget.id.source', 'Source Action'), icon: Codicon.symbolFile },
	uncategorizedCodeActionGroup,
]);

export function toMenuItems(
	inputCodeActions: readonly CodeActionItem[],
	showHeaders: boolean,
	keybindingResolver: (action: CodeAction) => ResolvedKeybinding | undefined
): IActionListItem<CodeActionItem>[] {
	if (!showHeaders) {
		return inputCodeActions.map((action): IActionListItem<CodeActionItem> => {
			return {
				kind: ActionListItemKind.Action,
				item: action,
				group: uncategorizedCodeActionGroup,
				disabled: !!action.action.disabled,
				label: action.action.disabled || action.action.title,
				canPreview: !!action.action.edit?.edits.length,
			};
		});
	}

	// Group code actions
	const menuEntries = codeActionGroups.map(group => ({ group, actions: [] as CodeActionItem[] }));

	for (const action of inputCodeActions) {
		const kind = action.action.kind ? new HierarchicalKind(action.action.kind) : HierarchicalKind.None;
		for (const menuEntry of menuEntries) {
			if (menuEntry.group.kind.contains(kind)) {
				menuEntry.actions.push(action);
				break;
			}
		}
	}

	const allMenuItems: IActionListItem<CodeActionItem>[] = [];
	for (const menuEntry of menuEntries) {
		if (menuEntry.actions.length) {
			allMenuItems.push({ kind: ActionListItemKind.Header, group: menuEntry.group });
			for (const action of menuEntry.actions) {
				const group = menuEntry.group;
				allMenuItems.push({
					kind: ActionListItemKind.Action,
					item: action,
					group: action.action.isAI ? { title: group.title, kind: group.kind, icon: Codicon.sparkle } : group,
					label: action.action.title,
					disabled: !!action.action.disabled,
					keybinding: keybindingResolver(action.action),
				});
			}
		}
	}
	return allMenuItems;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codeAction/browser/codeActionModel.ts]---
Location: vscode-main/src/vs/editor/contrib/codeAction/browser/codeActionModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise, createCancelablePromise, TimeoutTimer } from '../../../../base/common/async.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';
import { Disposable, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IMarkerService } from '../../../../platform/markers/common/markers.js';
import { IEditorProgressService, Progress } from '../../../../platform/progress/common/progress.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption, ShowLightbulbIconMode } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { Selection } from '../../../common/core/selection.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { CodeActionProvider, CodeActionTriggerType } from '../../../common/languages.js';
import { CodeActionKind, CodeActionSet, CodeActionTrigger, CodeActionTriggerSource } from '../common/types.js';
import { getCodeActions } from './codeAction.js';

export const SUPPORTED_CODE_ACTIONS = new RawContextKey<string>('supportedCodeAction', '');

export const APPLY_FIX_ALL_COMMAND_ID = '_typescript.applyFixAllCodeAction';

type TriggeredCodeAction = {
	readonly selection: Selection;
	readonly trigger: CodeActionTrigger;
};

class CodeActionOracle extends Disposable {

	private readonly _autoTriggerTimer = this._register(new TimeoutTimer());

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _markerService: IMarkerService,
		private readonly _signalChange: (triggered: TriggeredCodeAction | undefined) => void,
		private readonly _delay: number = 250,
	) {
		super();
		this._register(this._markerService.onMarkerChanged(e => this._onMarkerChanges(e)));
		this._register(this._editor.onDidChangeCursorPosition(() => this._tryAutoTrigger()));
	}

	public trigger(trigger: CodeActionTrigger): void {
		const selection = this._getRangeOfSelectionUnlessWhitespaceEnclosed(trigger);
		this._signalChange(selection ? { trigger, selection } : undefined);
	}

	private _onMarkerChanges(resources: readonly URI[]): void {
		const model = this._editor.getModel();
		if (model && resources.some(resource => isEqual(resource, model.uri))) {
			this._tryAutoTrigger();
		}
	}

	private _tryAutoTrigger() {
		this._autoTriggerTimer.cancelAndSet(() => {
			this.trigger({ type: CodeActionTriggerType.Auto, triggerAction: CodeActionTriggerSource.Default });
		}, this._delay);
	}

	private _getRangeOfSelectionUnlessWhitespaceEnclosed(trigger: CodeActionTrigger): Selection | undefined {
		if (!this._editor.hasModel()) {
			return undefined;
		}
		const selection = this._editor.getSelection();
		if (trigger.type === CodeActionTriggerType.Invoke) {
			return selection;
		}
		const enabled = this._editor.getOption(EditorOption.lightbulb).enabled;
		if (enabled === ShowLightbulbIconMode.Off) {
			return undefined;
		} else if (enabled === ShowLightbulbIconMode.On) {
			return selection;
		} else if (enabled === ShowLightbulbIconMode.OnCode) {
			const isSelectionEmpty = selection.isEmpty();
			if (!isSelectionEmpty) {
				return selection;
			}
			const model = this._editor.getModel();
			const { lineNumber, column } = selection.getPosition();
			const line = model.getLineContent(lineNumber);
			if (line.length === 0) {
				// empty line
				return undefined;
			} else if (column === 1) {
				// look only right
				if (/\s/.test(line[0])) {
					return undefined;
				}
			} else if (column === model.getLineMaxColumn(lineNumber)) {
				// look only left
				if (/\s/.test(line[line.length - 1])) {
					return undefined;
				}
			} else {
				// look left and right
				if (/\s/.test(line[column - 2]) && /\s/.test(line[column - 1])) {
					return undefined;
				}
			}
		}
		return selection;
	}
}

export namespace CodeActionsState {

	export const enum Type { Empty, Triggered }

	export const Empty = { type: Type.Empty } as const;

	export class Triggered {
		readonly type = Type.Triggered;

		public readonly actions: Promise<CodeActionSet>;

		constructor(
			public readonly trigger: CodeActionTrigger,
			public readonly position: Position,
			private readonly _cancellablePromise: CancelablePromise<CodeActionSet>,
		) {
			this.actions = _cancellablePromise.catch((e): CodeActionSet => {
				if (isCancellationError(e)) {
					return emptyCodeActionSet;
				}
				throw e;
			});
		}

		public cancel() {
			this._cancellablePromise.cancel();
		}
	}

	export type State = typeof Empty | Triggered;
}

const emptyCodeActionSet = Object.freeze<CodeActionSet>({
	allActions: [],
	validActions: [],
	dispose: () => { },
	documentation: [],
	hasAutoFix: false,
	hasAIFix: false,
	allAIFixes: false,
});


export class CodeActionModel extends Disposable {

	private readonly _codeActionOracle = this._register(new MutableDisposable<CodeActionOracle>());
	private _state: CodeActionsState.State = CodeActionsState.Empty;

	private readonly _supportedCodeActions: IContextKey<string>;

	private readonly _onDidChangeState = this._register(new Emitter<CodeActionsState.State>());
	public readonly onDidChangeState = this._onDidChangeState.event;

	private readonly codeActionsDisposable: MutableDisposable<IDisposable> = this._register(new MutableDisposable());

	private _disposed = false;

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _registry: LanguageFeatureRegistry<CodeActionProvider>,
		private readonly _markerService: IMarkerService,
		contextKeyService: IContextKeyService,
		private readonly _progressService?: IEditorProgressService,
		private readonly _configurationService?: IConfigurationService,
	) {
		super();
		this._supportedCodeActions = SUPPORTED_CODE_ACTIONS.bindTo(contextKeyService);

		this._register(this._editor.onDidChangeModel(() => this._update()));
		this._register(this._editor.onDidChangeModelLanguage(() => this._update()));
		this._register(this._registry.onDidChange(() => this._update()));
		this._register(this._editor.onDidChangeConfiguration((e) => {
			if (e.hasChanged(EditorOption.lightbulb)) {
				this._update();
			}
		}));
		this._update();
	}

	override dispose(): void {
		if (this._disposed) {
			return;
		}
		this._disposed = true;

		super.dispose();
		this.setState(CodeActionsState.Empty, true);
	}

	private _settingEnabledNearbyQuickfixes(): boolean {
		const model = this._editor?.getModel();
		return this._configurationService ? this._configurationService.getValue('editor.codeActionWidget.includeNearbyQuickFixes', { resource: model?.uri }) : false;
	}

	private _update(): void {
		if (this._disposed) {
			return;
		}

		this._codeActionOracle.value = undefined;

		this.setState(CodeActionsState.Empty);

		const model = this._editor.getModel();
		if (model
			&& this._registry.has(model)
			&& !this._editor.getOption(EditorOption.readOnly)
		) {
			const supportedActions: string[] = this._registry.all(model).flatMap(provider => provider.providedCodeActionKinds ?? []);
			this._supportedCodeActions.set(supportedActions.join(' '));

			this._codeActionOracle.value = new CodeActionOracle(this._editor, this._markerService, trigger => {
				if (!trigger) {
					this.setState(CodeActionsState.Empty);
					return;
				}

				const startPosition = trigger.selection.getStartPosition();

				const actions = createCancelablePromise(async token => {
					if (this._settingEnabledNearbyQuickfixes() && trigger.trigger.type === CodeActionTriggerType.Invoke && (trigger.trigger.triggerAction === CodeActionTriggerSource.QuickFix || trigger.trigger.filter?.include?.contains(CodeActionKind.QuickFix))) {
						const codeActionSet = await getCodeActions(this._registry, model, trigger.selection, trigger.trigger, Progress.None, token);
						this.codeActionsDisposable.value = codeActionSet;
						const allCodeActions = [...codeActionSet.allActions];
						if (token.isCancellationRequested) {
							codeActionSet.dispose();
							return emptyCodeActionSet;
						}

						// Search for non-AI quickfixes in the current code action set - if AI code actions are the only thing found, continue searching for diagnostics in line.
						const foundQuickfix = codeActionSet.validActions?.some(action => {
							return action.action.kind &&
								CodeActionKind.QuickFix.contains(new HierarchicalKind(action.action.kind)) &&
								!action.action.isAI;
						});
						const allMarkers = this._markerService.read({ resource: model.uri });
						if (foundQuickfix) {
							for (const action of codeActionSet.validActions) {
								if (action.action.command?.arguments?.some(arg => typeof arg === 'string' && arg.includes(APPLY_FIX_ALL_COMMAND_ID))) {
									action.action.diagnostics = [...allMarkers.filter(marker => marker.relatedInformation)];
								}
							}
							return { validActions: codeActionSet.validActions, allActions: allCodeActions, documentation: codeActionSet.documentation, hasAutoFix: codeActionSet.hasAutoFix, hasAIFix: codeActionSet.hasAIFix, allAIFixes: codeActionSet.allAIFixes, dispose: () => { this.codeActionsDisposable.value = codeActionSet; } };
						} else if (!foundQuickfix) {
							// If markers exist, and there are no quickfixes found or length is zero, check for quickfixes on that line.
							if (allMarkers.length > 0) {
								const currPosition = trigger.selection.getPosition();
								let trackedPosition = currPosition;
								let distance = Number.MAX_VALUE;
								const currentActions = [...codeActionSet.validActions];

								for (const marker of allMarkers) {
									const col = marker.endColumn;
									const row = marker.endLineNumber;
									const startRow = marker.startLineNumber;

									// Found quickfix on the same line and check relative distance to other markers
									if ((row === currPosition.lineNumber || startRow === currPosition.lineNumber)) {
										trackedPosition = new Position(row, col);
										const newCodeActionTrigger: CodeActionTrigger = {
											type: trigger.trigger.type,
											triggerAction: trigger.trigger.triggerAction,
											filter: { include: trigger.trigger.filter?.include ? trigger.trigger.filter?.include : CodeActionKind.QuickFix },
											autoApply: trigger.trigger.autoApply,
											context: { notAvailableMessage: trigger.trigger.context?.notAvailableMessage || '', position: trackedPosition }
										};

										const selectionAsPosition = new Selection(trackedPosition.lineNumber, trackedPosition.column, trackedPosition.lineNumber, trackedPosition.column);
										const actionsAtMarker = await getCodeActions(this._registry, model, selectionAsPosition, newCodeActionTrigger, Progress.None, token);
										if (token.isCancellationRequested) {
											actionsAtMarker.dispose();
											return emptyCodeActionSet;
										}

										if (actionsAtMarker.validActions.length !== 0) {
											for (const action of actionsAtMarker.validActions) {
												if (action.action.command?.arguments?.some(arg => typeof arg === 'string' && arg.includes(APPLY_FIX_ALL_COMMAND_ID))) {
													action.action.diagnostics = [...allMarkers.filter(marker => marker.relatedInformation)];
												}
											}

											if (codeActionSet.allActions.length === 0) {
												allCodeActions.push(...actionsAtMarker.allActions);
											}

											// Already filtered through to only get quickfixes, so no need to filter again.
											if (Math.abs(currPosition.column - col) < distance) {
												currentActions.unshift(...actionsAtMarker.validActions);
											} else {
												currentActions.push(...actionsAtMarker.validActions);
											}
										}
										distance = Math.abs(currPosition.column - col);
									}
								}
								const filteredActions = currentActions.filter((action, index, self) =>
									self.findIndex((a) => a.action.title === action.action.title) === index);

								filteredActions.sort((a, b) => {
									if (a.action.isPreferred && !b.action.isPreferred) {
										return -1;
									} else if (!a.action.isPreferred && b.action.isPreferred) {
										return 1;
									} else if (a.action.isAI && !b.action.isAI) {
										return 1;
									} else if (!a.action.isAI && b.action.isAI) {
										return -1;
									} else {
										return 0;
									}
								});

								// Only retriggers if actually found quickfix on the same line as cursor
								return { validActions: filteredActions, allActions: allCodeActions, documentation: codeActionSet.documentation, hasAutoFix: codeActionSet.hasAutoFix, hasAIFix: codeActionSet.hasAIFix, allAIFixes: codeActionSet.allAIFixes, dispose: () => { this.codeActionsDisposable.value = codeActionSet; } };
							}
						}
					}

					// Case for manual triggers - specifically Source Actions and Refactors
					if (trigger.trigger.type === CodeActionTriggerType.Invoke) {
						const codeActions = await getCodeActions(this._registry, model, trigger.selection, trigger.trigger, Progress.None, token);
						this.codeActionsDisposable.value = codeActions;
						return codeActions;
					}

					const codeActionSet = await getCodeActions(this._registry, model, trigger.selection, trigger.trigger, Progress.None, token);
					this.codeActionsDisposable.value = codeActionSet;
					return codeActionSet;
				});

				if (trigger.trigger.type === CodeActionTriggerType.Invoke) {
					this._progressService?.showWhile(actions, 250);
				}
				const newState = new CodeActionsState.Triggered(trigger.trigger, startPosition, actions);
				let isManualToAutoTransition = false;
				if (this._state.type === CodeActionsState.Type.Triggered) {
					// Check if the current state is manual and the new state is automatic
					isManualToAutoTransition = this._state.trigger.type === CodeActionTriggerType.Invoke &&
						newState.type === CodeActionsState.Type.Triggered &&
						newState.trigger.type === CodeActionTriggerType.Auto &&
						this._state.position !== newState.position;
				}

				// Do not trigger state if current state is manual and incoming state is automatic
				if (!isManualToAutoTransition) {
					this.setState(newState);
				} else {
					// Reset the new state after getting code actions back.
					setTimeout(() => {
						this.setState(newState);
					}, 500);
				}
			}, undefined);
			this._codeActionOracle.value.trigger({ type: CodeActionTriggerType.Auto, triggerAction: CodeActionTriggerSource.Default });
		} else {
			this._supportedCodeActions.reset();
		}
	}

	public trigger(trigger: CodeActionTrigger) {
		this._codeActionOracle.value?.trigger(trigger);
		this.codeActionsDisposable.dispose();
	}

	private setState(newState: CodeActionsState.State, skipNotify?: boolean) {
		if (newState === this._state) {
			return;
		}

		// Cancel old request
		if (this._state.type === CodeActionsState.Type.Triggered) {
			this._state.cancel();
		}

		this._state = newState;

		if (!skipNotify && !this._disposed) {
			this._onDidChangeState.fire(newState);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codeAction/browser/lightBulbWidget.css]---
Location: vscode-main/src/vs/editor/contrib/codeAction/browser/lightBulbWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .lightBulbWidget {
	display: flex;
	align-items: center;
	justify-content: center;
}

.monaco-editor .lightBulbWidget:hover{
	cursor: pointer;
}

.monaco-editor .lightBulbWidget.codicon-light-bulb,
.monaco-editor .lightBulbWidget.codicon-lightbulb-sparkle {
	color: var(--vscode-editorLightBulb-foreground);
}

.monaco-editor .lightBulbWidget.codicon-lightbulb-autofix,
.monaco-editor .lightBulbWidget.codicon-lightbulb-sparkle-autofix {
	color: var(--vscode-editorLightBulbAutoFix-foreground, var(--vscode-editorLightBulb-foreground));
}

.monaco-editor .lightBulbWidget.codicon-sparkle-filled {
	color: var(--vscode-editorLightBulbAi-foreground, var(--vscode-icon-foreground));
}

.monaco-editor .lightBulbWidget:before {
	position: relative;
	z-index: 2;
}

.monaco-editor .lightBulbWidget:after {
	position: absolute;
	top: 0;
	left: 0;
	content: '';
	display: block;
	width: 100%;
	height: 100%;
	opacity: 0.3;
	z-index: 1;
}

/* gutter decoration */
.monaco-editor .glyph-margin-widgets .cgmr[class*="codicon-gutter-lightbulb"] {
	display: block;
	cursor: pointer;
}

.monaco-editor .glyph-margin-widgets .cgmr.codicon-gutter-lightbulb,
.monaco-editor .glyph-margin-widgets .cgmr.codicon-gutter-lightbulb-sparkle {
	color: var(--vscode-editorLightBulb-foreground);
}

.monaco-editor .glyph-margin-widgets .cgmr.codicon-gutter-lightbulb-auto-fix,
.monaco-editor .glyph-margin-widgets .cgmr.codicon-gutter-lightbulb-aifix-auto-fix {
	color: var(--vscode-editorLightBulbAutoFix-foreground, var(--vscode-editorLightBulb-foreground));
}

.monaco-editor .glyph-margin-widgets .cgmr.codicon-gutter-lightbulb-sparkle-filled {
	color: var(--vscode-editorLightBulbAi-foreground, var(--vscode-icon-foreground));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codeAction/browser/lightBulbWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/codeAction/browser/lightBulbWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { Gesture } from '../../../../base/browser/touch.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import './lightBulbWidget.css';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition, IEditorMouseEvent } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IPosition } from '../../../common/core/position.js';
import { GlyphMarginLane, IModelDecorationsChangeAccessor, TrackedRangeStickiness } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { computeIndentLevel } from '../../../common/model/utils.js';
import { autoFixCommandId, quickFixCommandId } from './codeAction.js';
import { CodeActionSet, CodeActionTrigger } from '../common/types.js';
import * as nls from '../../../../nls.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { Range } from '../../../common/core/range.js';

const GUTTER_LIGHTBULB_ICON = registerIcon('gutter-lightbulb', Codicon.lightBulb, nls.localize('gutterLightbulbWidget', 'Icon which spawns code actions menu from the gutter when there is no space in the editor.'));
const GUTTER_LIGHTBULB_AUTO_FIX_ICON = registerIcon('gutter-lightbulb-auto-fix', Codicon.lightbulbAutofix, nls.localize('gutterLightbulbAutoFixWidget', 'Icon which spawns code actions menu from the gutter when there is no space in the editor and a quick fix is available.'));
const GUTTER_LIGHTBULB_AIFIX_ICON = registerIcon('gutter-lightbulb-sparkle', Codicon.lightbulbSparkle, nls.localize('gutterLightbulbAIFixWidget', 'Icon which spawns code actions menu from the gutter when there is no space in the editor and an AI fix is available.'));
const GUTTER_LIGHTBULB_AIFIX_AUTO_FIX_ICON = registerIcon('gutter-lightbulb-aifix-auto-fix', Codicon.lightbulbSparkleAutofix, nls.localize('gutterLightbulbAIFixAutoFixWidget', 'Icon which spawns code actions menu from the gutter when there is no space in the editor and an AI fix and a quick fix is available.'));
const GUTTER_SPARKLE_FILLED_ICON = registerIcon('gutter-lightbulb-sparkle-filled', Codicon.sparkleFilled, nls.localize('gutterLightbulbSparkleFilledWidget', 'Icon which spawns code actions menu from the gutter when there is no space in the editor and an AI fix and a quick fix is available.'));

namespace LightBulbState {

	export const enum Type {
		Hidden,
		Showing,
	}

	export const Hidden = { type: Type.Hidden } as const;

	export class Showing {
		readonly type = Type.Showing;

		constructor(
			public readonly actions: CodeActionSet,
			public readonly trigger: CodeActionTrigger,
			public readonly editorPosition: IPosition,
			public readonly widgetPosition: IContentWidgetPosition,
		) { }
	}

	export type State = typeof Hidden | Showing;
}

export class LightBulbWidget extends Disposable implements IContentWidget {
	private _gutterDecorationID: string | undefined;

	private static readonly GUTTER_DECORATION = ModelDecorationOptions.register({
		description: 'codicon-gutter-lightbulb-decoration',
		glyphMarginClassName: ThemeIcon.asClassName(Codicon.lightBulb),
		glyphMargin: { position: GlyphMarginLane.Left },
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
	});

	public static readonly ID = 'editor.contrib.lightbulbWidget';

	private static readonly _posPref = [ContentWidgetPositionPreference.EXACT];

	private readonly _domNode: HTMLElement;

	private readonly _onClick = this._register(new Emitter<{ readonly x: number; readonly y: number; readonly actions: CodeActionSet; readonly trigger: CodeActionTrigger }>());
	public readonly onClick = this._onClick.event;

	private _state: LightBulbState.State = LightBulbState.Hidden;
	private _gutterState: LightBulbState.State = LightBulbState.Hidden;
	private _iconClasses: string[] = [];

	private readonly lightbulbClasses = [
		'codicon-' + GUTTER_LIGHTBULB_ICON.id,
		'codicon-' + GUTTER_LIGHTBULB_AIFIX_AUTO_FIX_ICON.id,
		'codicon-' + GUTTER_LIGHTBULB_AUTO_FIX_ICON.id,
		'codicon-' + GUTTER_LIGHTBULB_AIFIX_ICON.id,
		'codicon-' + GUTTER_SPARKLE_FILLED_ICON.id
	];

	private _preferredKbLabel?: string;
	private _quickFixKbLabel?: string;

	private gutterDecoration: ModelDecorationOptions = LightBulbWidget.GUTTER_DECORATION;

	constructor(
		private readonly _editor: ICodeEditor,
		@IKeybindingService private readonly _keybindingService: IKeybindingService
	) {
		super();

		this._domNode = dom.$('div.lightBulbWidget');
		this._domNode.role = 'listbox';
		this._register(Gesture.ignoreTarget(this._domNode));

		this._editor.addContentWidget(this);

		this._register(this._editor.onDidChangeModelContent(_ => {
			// cancel when the line in question has been removed
			const editorModel = this._editor.getModel();
			if (this.state.type !== LightBulbState.Type.Showing || !editorModel || this.state.editorPosition.lineNumber >= editorModel.getLineCount()) {
				this.hide();
			}

			if (this.gutterState.type !== LightBulbState.Type.Showing || !editorModel || this.gutterState.editorPosition.lineNumber >= editorModel.getLineCount()) {
				this.gutterHide();
			}
		}));

		this._register(dom.addStandardDisposableGenericMouseDownListener(this._domNode, e => {
			if (this.state.type !== LightBulbState.Type.Showing) {
				return;
			}

			// Make sure that focus / cursor location is not lost when clicking widget icon
			this._editor.focus();
			e.preventDefault();

			// a bit of extra work to make sure the menu
			// doesn't cover the line-text
			const { top, height } = dom.getDomNodePagePosition(this._domNode);
			const lineHeight = this._editor.getOption(EditorOption.lineHeight);

			let pad = Math.floor(lineHeight / 3);
			if (this.state.widgetPosition.position !== null && this.state.widgetPosition.position.lineNumber < this.state.editorPosition.lineNumber) {
				pad += lineHeight;
			}

			this._onClick.fire({
				x: e.posx,
				y: top + height + pad,
				actions: this.state.actions,
				trigger: this.state.trigger,
			});
		}));

		this._register(dom.addDisposableListener(this._domNode, 'mouseenter', (e: MouseEvent) => {
			if ((e.buttons & 1) !== 1) {
				return;
			}
			// mouse enters lightbulb while the primary/left button
			// is being pressed -> hide the lightbulb
			this.hide();
		}));


		this._register(Event.runAndSubscribe(this._keybindingService.onDidUpdateKeybindings, () => {
			this._preferredKbLabel = this._keybindingService.lookupKeybinding(autoFixCommandId)?.getLabel() ?? undefined;
			this._quickFixKbLabel = this._keybindingService.lookupKeybinding(quickFixCommandId)?.getLabel() ?? undefined;
			this._updateLightBulbTitleAndIcon();
		}));

		this._register(this._editor.onMouseDown(async (e: IEditorMouseEvent) => {

			if (!e.target.element || !this.lightbulbClasses.some(cls => e.target.element && e.target.element.classList.contains(cls))) {
				return;
			}

			if (this.gutterState.type !== LightBulbState.Type.Showing) {
				return;
			}

			// Make sure that focus / cursor location is not lost when clicking widget icon
			this._editor.focus();

			// a bit of extra work to make sure the menu
			// doesn't cover the line-text
			const { top, height } = dom.getDomNodePagePosition(e.target.element);
			const lineHeight = this._editor.getOption(EditorOption.lineHeight);

			let pad = Math.floor(lineHeight / 3);
			if (this.gutterState.widgetPosition.position !== null && this.gutterState.widgetPosition.position.lineNumber < this.gutterState.editorPosition.lineNumber) {
				pad += lineHeight;
			}

			this._onClick.fire({
				x: e.event.posx,
				y: top + height + pad,
				actions: this.gutterState.actions,
				trigger: this.gutterState.trigger,
			});
		}));
	}

	override dispose(): void {
		super.dispose();
		this._editor.removeContentWidget(this);
		if (this._gutterDecorationID) {
			this._removeGutterDecoration(this._gutterDecorationID);
		}
	}

	getId(): string {
		return 'LightBulbWidget';
	}

	getDomNode(): HTMLElement {
		return this._domNode;
	}

	getPosition(): IContentWidgetPosition | null {
		return this._state.type === LightBulbState.Type.Showing ? this._state.widgetPosition : null;
	}

	public update(actions: CodeActionSet, trigger: CodeActionTrigger, atPosition: IPosition) {
		if (actions.validActions.length <= 0) {
			this.gutterHide();
			return this.hide();
		}

		const hasTextFocus = this._editor.hasTextFocus();
		if (!hasTextFocus) {
			this.gutterHide();
			return this.hide();
		}

		const options = this._editor.getOptions();
		if (!options.get(EditorOption.lightbulb).enabled) {
			this.gutterHide();
			return this.hide();
		}


		const model = this._editor.getModel();
		if (!model) {
			this.gutterHide();
			return this.hide();
		}

		const { lineNumber, column } = model.validatePosition(atPosition);

		const tabSize = model.getOptions().tabSize;
		const fontInfo = this._editor.getOptions().get(EditorOption.fontInfo);
		const lineContent = model.getLineContent(lineNumber);
		const indent = computeIndentLevel(lineContent, tabSize);
		const lineHasSpace = fontInfo.spaceWidth * indent > 22;
		const isFolded = (lineNumber: number) => {
			return lineNumber > 2 && this._editor.getTopForLineNumber(lineNumber) === this._editor.getTopForLineNumber(lineNumber - 1);
		};

		// Check for glyph margin decorations of any kind
		const currLineDecorations = this._editor.getLineDecorations(lineNumber);
		let hasDecoration = false;
		if (currLineDecorations) {
			for (const decoration of currLineDecorations) {
				const glyphClass = decoration.options.glyphMarginClassName;

				if (glyphClass && !this.lightbulbClasses.some(className => glyphClass.includes(className))) {
					hasDecoration = true;
					break;
				}
			}
		}

		let effectiveLineNumber = lineNumber;
		let effectiveColumnNumber = 1;
		if (!lineHasSpace) {
			// Checks if line is empty or starts with any amount of whitespace
			const isLineEmptyOrIndented = (lineNumber: number): boolean => {
				const lineContent = model.getLineContent(lineNumber);
				return /^\s*$|^\s+/.test(lineContent) || lineContent.length <= effectiveColumnNumber;
			};

			if (lineNumber > 1 && !isFolded(lineNumber - 1)) {
				const lineCount = model.getLineCount();
				const endLine = lineNumber === lineCount;
				const prevLineEmptyOrIndented = lineNumber > 1 && isLineEmptyOrIndented(lineNumber - 1);
				const nextLineEmptyOrIndented = !endLine && isLineEmptyOrIndented(lineNumber + 1);
				const currLineEmptyOrIndented = isLineEmptyOrIndented(lineNumber);
				const notEmpty = !nextLineEmptyOrIndented && !prevLineEmptyOrIndented;

				// check above and below. if both are blocked, display lightbulb in the gutter.
				if (!nextLineEmptyOrIndented && !prevLineEmptyOrIndented && !hasDecoration) {
					this.gutterState = new LightBulbState.Showing(actions, trigger, atPosition, {
						position: { lineNumber: effectiveLineNumber, column: effectiveColumnNumber },
						preference: LightBulbWidget._posPref
					});
					this.renderGutterLightbub();
					return this.hide();
				} else if (prevLineEmptyOrIndented || endLine || (prevLineEmptyOrIndented && !currLineEmptyOrIndented)) {
					effectiveLineNumber -= 1;
				} else if (nextLineEmptyOrIndented || (notEmpty && currLineEmptyOrIndented)) {
					effectiveLineNumber += 1;
				}
			} else if (lineNumber === 1 && (lineNumber === model.getLineCount() || !isLineEmptyOrIndented(lineNumber + 1) && !isLineEmptyOrIndented(lineNumber))) {
				// special checks for first line blocked vs. not blocked.
				this.gutterState = new LightBulbState.Showing(actions, trigger, atPosition, {
					position: { lineNumber: effectiveLineNumber, column: effectiveColumnNumber },
					preference: LightBulbWidget._posPref
				});

				if (hasDecoration) {
					this.gutterHide();
				} else {
					this.renderGutterLightbub();
					return this.hide();
				}
			} else if ((lineNumber < model.getLineCount()) && !isFolded(lineNumber + 1)) {
				effectiveLineNumber += 1;
			} else if (column * fontInfo.spaceWidth < 22) {
				// cannot show lightbulb above/below and showing
				// it inline would overlay the cursor...
				return this.hide();
			}
			effectiveColumnNumber = /^\S\s*$/.test(model.getLineContent(effectiveLineNumber)) ? 2 : 1;
		}

		this.state = new LightBulbState.Showing(actions, trigger, atPosition, {
			position: { lineNumber: effectiveLineNumber, column: effectiveColumnNumber },
			preference: LightBulbWidget._posPref
		});

		if (this._gutterDecorationID) {
			this._removeGutterDecoration(this._gutterDecorationID);
			this.gutterHide();
		}

		const validActions = actions.validActions;
		const actionKind = actions.validActions[0].action.kind;
		if (validActions.length !== 1 || !actionKind) {
			this._editor.layoutContentWidget(this);
			return;
		}

		this._editor.layoutContentWidget(this);
	}

	public hide(): void {
		if (this.state === LightBulbState.Hidden) {
			return;
		}

		this.state = LightBulbState.Hidden;
		this._editor.layoutContentWidget(this);
	}

	public gutterHide(): void {
		if (this.gutterState === LightBulbState.Hidden) {
			return;
		}

		if (this._gutterDecorationID) {
			this._removeGutterDecoration(this._gutterDecorationID);
		}

		this.gutterState = LightBulbState.Hidden;
	}

	private get state(): LightBulbState.State { return this._state; }

	private set state(value) {
		this._state = value;
		this._updateLightBulbTitleAndIcon();
	}

	private get gutterState(): LightBulbState.State { return this._gutterState; }

	private set gutterState(value) {
		this._gutterState = value;
		this._updateGutterLightBulbTitleAndIcon();
	}

	private _updateLightBulbTitleAndIcon(): void {
		this._domNode.classList.remove(...this._iconClasses);
		this._iconClasses = [];
		if (this.state.type !== LightBulbState.Type.Showing) {
			return;
		}
		let icon: ThemeIcon;
		let autoRun = false;
		if (this.state.actions.allAIFixes) {
			icon = Codicon.sparkleFilled;
			if (this.state.actions.validActions.length === 1) {
				autoRun = true;
			}
		} else if (this.state.actions.hasAutoFix) {
			if (this.state.actions.hasAIFix) {
				icon = Codicon.lightbulbSparkleAutofix;
			} else {
				icon = Codicon.lightbulbAutofix;
			}
		} else if (this.state.actions.hasAIFix) {
			icon = Codicon.lightbulbSparkle;
		} else {
			icon = Codicon.lightBulb;
		}
		this._updateLightbulbTitle(this.state.actions.hasAutoFix, autoRun);
		this._iconClasses = ThemeIcon.asClassNameArray(icon);
		this._domNode.classList.add(...this._iconClasses);
	}

	private _updateGutterLightBulbTitleAndIcon(): void {
		if (this.gutterState.type !== LightBulbState.Type.Showing) {
			return;
		}
		let icon: ThemeIcon;
		let autoRun = false;
		if (this.gutterState.actions.allAIFixes) {
			icon = GUTTER_SPARKLE_FILLED_ICON;
			if (this.gutterState.actions.validActions.length === 1) {
				autoRun = true;
			}
		} else if (this.gutterState.actions.hasAutoFix) {
			if (this.gutterState.actions.hasAIFix) {
				icon = GUTTER_LIGHTBULB_AIFIX_AUTO_FIX_ICON;
			} else {
				icon = GUTTER_LIGHTBULB_AUTO_FIX_ICON;
			}
		} else if (this.gutterState.actions.hasAIFix) {
			icon = GUTTER_LIGHTBULB_AIFIX_ICON;
		} else {
			icon = GUTTER_LIGHTBULB_ICON;
		}
		this._updateLightbulbTitle(this.gutterState.actions.hasAutoFix, autoRun);

		const GUTTER_DECORATION = ModelDecorationOptions.register({
			description: 'codicon-gutter-lightbulb-decoration',
			glyphMarginClassName: ThemeIcon.asClassName(icon),
			glyphMargin: { position: GlyphMarginLane.Left },
			stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		});

		this.gutterDecoration = GUTTER_DECORATION;
	}

	/* Gutter Helper Functions */
	private renderGutterLightbub(): void {
		const selection = this._editor.getSelection();
		if (!selection) {
			return;
		}

		if (this._gutterDecorationID === undefined) {
			this._addGutterDecoration(selection.startLineNumber);
		} else {
			this._updateGutterDecoration(this._gutterDecorationID, selection.startLineNumber);
		}
	}

	private _addGutterDecoration(lineNumber: number) {
		this._editor.changeDecorations((accessor: IModelDecorationsChangeAccessor) => {
			this._gutterDecorationID = accessor.addDecoration(new Range(lineNumber, 0, lineNumber, 0), this.gutterDecoration);
		});
	}

	private _removeGutterDecoration(decorationId: string) {
		this._editor.changeDecorations((accessor: IModelDecorationsChangeAccessor) => {
			accessor.removeDecoration(decorationId);
			this._gutterDecorationID = undefined;
		});
	}

	private _updateGutterDecoration(decorationId: string, lineNumber: number) {
		this._editor.changeDecorations((accessor: IModelDecorationsChangeAccessor) => {
			accessor.changeDecoration(decorationId, new Range(lineNumber, 0, lineNumber, 0));
			accessor.changeDecorationOptions(decorationId, this.gutterDecoration);
		});
	}

	private _updateLightbulbTitle(autoFix: boolean, autoRun: boolean): void {
		if (this.state.type !== LightBulbState.Type.Showing) {
			return;
		}
		if (autoRun) {
			this.title = nls.localize('codeActionAutoRun', "Run: {0}", this.state.actions.validActions[0].action.title);
		} else if (autoFix && this._preferredKbLabel) {
			this.title = nls.localize('preferredcodeActionWithKb', "Show Code Actions. Preferred Quick Fix Available ({0})", this._preferredKbLabel);
		} else if (!autoFix && this._quickFixKbLabel) {
			this.title = nls.localize('codeActionWithKb', "Show Code Actions ({0})", this._quickFixKbLabel);
		} else if (!autoFix) {
			this.title = nls.localize('codeAction', "Show Code Actions");
		}
	}

	private set title(value: string) {
		this._domNode.title = value;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codeAction/common/types.ts]---
Location: vscode-main/src/vs/editor/contrib/codeAction/common/types.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';
import { Position } from '../../../common/core/position.js';
import * as languages from '../../../common/languages.js';
import { ActionSet } from '../../../../platform/actionWidget/common/actionWidget.js';

export const CodeActionKind = new class {
	public readonly QuickFix = new HierarchicalKind('quickfix');

	public readonly Refactor = new HierarchicalKind('refactor');
	public readonly RefactorExtract = this.Refactor.append('extract');
	public readonly RefactorInline = this.Refactor.append('inline');
	public readonly RefactorMove = this.Refactor.append('move');
	public readonly RefactorRewrite = this.Refactor.append('rewrite');

	public readonly Notebook = new HierarchicalKind('notebook');

	public readonly Source = new HierarchicalKind('source');
	public readonly SourceOrganizeImports = this.Source.append('organizeImports');
	public readonly SourceFixAll = this.Source.append('fixAll');
	public readonly SurroundWith = this.Refactor.append('surround');
};

export const enum CodeActionAutoApply {
	IfSingle = 'ifSingle',
	First = 'first',
	Never = 'never',
}

export enum CodeActionTriggerSource {
	Refactor = 'refactor',
	RefactorPreview = 'refactor preview',
	Lightbulb = 'lightbulb',
	Default = 'other (default)',
	SourceAction = 'source action',
	QuickFix = 'quick fix action',
	FixAll = 'fix all',
	OrganizeImports = 'organize imports',
	AutoFix = 'auto fix',
	QuickFixHover = 'quick fix hover window',
	OnSave = 'save participants',
	ProblemsView = 'problems view'
}

export interface CodeActionFilter {
	readonly include?: HierarchicalKind;
	readonly excludes?: readonly HierarchicalKind[];
	readonly includeSourceActions?: boolean;
	readonly onlyIncludePreferredActions?: boolean;
}

export function mayIncludeActionsOfKind(filter: CodeActionFilter, providedKind: HierarchicalKind): boolean {
	// A provided kind may be a subset or superset of our filtered kind.
	if (filter.include && !filter.include.intersects(providedKind)) {
		return false;
	}

	if (filter.excludes) {
		if (filter.excludes.some(exclude => excludesAction(providedKind, exclude, filter.include))) {
			return false;
		}
	}

	// Don't return source actions unless they are explicitly requested
	if (!filter.includeSourceActions && CodeActionKind.Source.contains(providedKind)) {
		return false;
	}

	return true;
}

export function filtersAction(filter: CodeActionFilter, action: languages.CodeAction): boolean {
	const actionKind = action.kind ? new HierarchicalKind(action.kind) : undefined;

	// Filter out actions by kind
	if (filter.include) {
		if (!actionKind || !filter.include.contains(actionKind)) {
			return false;
		}
	}

	if (filter.excludes) {
		if (actionKind && filter.excludes.some(exclude => excludesAction(actionKind, exclude, filter.include))) {
			return false;
		}
	}

	// Don't return source actions unless they are explicitly requested
	if (!filter.includeSourceActions) {
		if (actionKind && CodeActionKind.Source.contains(actionKind)) {
			return false;
		}
	}

	if (filter.onlyIncludePreferredActions) {
		if (!action.isPreferred) {
			return false;
		}
	}

	return true;
}

function excludesAction(providedKind: HierarchicalKind, exclude: HierarchicalKind, include: HierarchicalKind | undefined): boolean {
	if (!exclude.contains(providedKind)) {
		return false;
	}
	if (include && exclude.contains(include)) {
		// The include is more specific, don't filter out
		return false;
	}
	return true;
}

export interface CodeActionTrigger {
	readonly type: languages.CodeActionTriggerType;
	readonly triggerAction: CodeActionTriggerSource;
	readonly filter?: CodeActionFilter;
	readonly autoApply?: CodeActionAutoApply;
	readonly context?: {
		readonly notAvailableMessage: string;
		readonly position: Position;
	};
}

export class CodeActionCommandArgs {
	public static fromUser(arg: any, defaults: { kind: HierarchicalKind; apply: CodeActionAutoApply }): CodeActionCommandArgs {
		if (!arg || typeof arg !== 'object') {
			return new CodeActionCommandArgs(defaults.kind, defaults.apply, false);
		}
		return new CodeActionCommandArgs(
			CodeActionCommandArgs.getKindFromUser(arg, defaults.kind),
			CodeActionCommandArgs.getApplyFromUser(arg, defaults.apply),
			CodeActionCommandArgs.getPreferredUser(arg));
	}

	private static getApplyFromUser(arg: any, defaultAutoApply: CodeActionAutoApply) {
		switch (typeof arg.apply === 'string' ? arg.apply.toLowerCase() : '') {
			case 'first': return CodeActionAutoApply.First;
			case 'never': return CodeActionAutoApply.Never;
			case 'ifsingle': return CodeActionAutoApply.IfSingle;
			default: return defaultAutoApply;
		}
	}

	private static getKindFromUser(arg: any, defaultKind: HierarchicalKind) {
		return typeof arg.kind === 'string'
			? new HierarchicalKind(arg.kind)
			: defaultKind;
	}

	private static getPreferredUser(arg: any): boolean {
		return typeof arg.preferred === 'boolean'
			? arg.preferred
			: false;
	}

	private constructor(
		public readonly kind: HierarchicalKind,
		public readonly apply: CodeActionAutoApply,
		public readonly preferred: boolean,
	) { }
}

export class CodeActionItem {

	constructor(
		public readonly action: languages.CodeAction,
		public readonly provider: languages.CodeActionProvider | undefined,
		public highlightRange?: boolean,
	) { }

	async resolve(token: CancellationToken): Promise<this> {
		if (this.provider?.resolveCodeAction && !this.action.edit) {
			let action: languages.CodeAction | undefined | null;
			try {
				action = await this.provider.resolveCodeAction(this.action, token);
			} catch (err) {
				onUnexpectedExternalError(err);
			}
			if (action) {
				this.action.edit = action.edit;
			}
		}
		return this;
	}
}

export interface CodeActionSet extends ActionSet<CodeActionItem> {
	readonly validActions: readonly CodeActionItem[];
	readonly allActions: readonly CodeActionItem[];

	readonly documentation: readonly languages.Command[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codeAction/test/browser/codeAction.test.ts]---
Location: vscode-main/src/vs/editor/contrib/codeAction/test/browser/codeAction.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { HierarchicalKind } from '../../../../../base/common/hierarchicalKind.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../common/core/range.js';
import { LanguageFeatureRegistry } from '../../../../common/languageFeatureRegistry.js';
import * as languages from '../../../../common/languages.js';
import { TextModel } from '../../../../common/model/textModel.js';
import { getCodeActions } from '../../browser/codeAction.js';
import { CodeActionItem, CodeActionKind, CodeActionTriggerSource } from '../../common/types.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { IMarkerData, MarkerSeverity } from '../../../../../platform/markers/common/markers.js';
import { Progress } from '../../../../../platform/progress/common/progress.js';

function staticCodeActionProvider(...actions: languages.CodeAction[]): languages.CodeActionProvider {
	return new class implements languages.CodeActionProvider {
		provideCodeActions(): languages.CodeActionList {
			return {
				actions: actions,
				dispose: () => { }
			};
		}
	};
}


suite('CodeAction', () => {

	const langId = 'fooLang';
	const uri = URI.parse('untitled:path');
	let model: TextModel;
	let registry: LanguageFeatureRegistry<languages.CodeActionProvider>;
	const disposables = new DisposableStore();
	const testData = {
		diagnostics: {
			abc: {
				title: 'bTitle',
				diagnostics: [{
					startLineNumber: 1,
					startColumn: 1,
					endLineNumber: 2,
					endColumn: 1,
					severity: MarkerSeverity.Error,
					message: 'abc'
				}]
			},
			bcd: {
				title: 'aTitle',
				diagnostics: [{
					startLineNumber: 1,
					startColumn: 1,
					endLineNumber: 2,
					endColumn: 1,
					severity: MarkerSeverity.Error,
					message: 'bcd'
				}]
			}
		},
		command: {
			abc: {
				command: new class implements languages.Command {
					id!: '1';
					title!: 'abc';
				},
				title: 'Extract to inner function in function "test"'
			}
		},
		spelling: {
			bcd: {
				diagnostics: <IMarkerData[]>[],
				edit: new class implements languages.WorkspaceEdit {
					edits!: languages.IWorkspaceTextEdit[];
				},
				title: 'abc'
			}
		},
		tsLint: {
			abc: {
				$ident: 'funny' + 57,
				arguments: <IMarkerData[]>[],
				id: '_internal_command_delegation',
				title: 'abc'
			},
			bcd: {
				$ident: 'funny' + 47,
				arguments: <IMarkerData[]>[],
				id: '_internal_command_delegation',
				title: 'bcd'
			}
		}
	};

	setup(() => {
		registry = new LanguageFeatureRegistry();
		disposables.clear();
		model = createTextModel('test1\ntest2\ntest3', langId, undefined, uri);
		disposables.add(model);
	});

	teardown(() => {
		disposables.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('CodeActions are sorted by type, #38623', async () => {

		const provider = staticCodeActionProvider(
			testData.command.abc,
			testData.diagnostics.bcd,
			testData.spelling.bcd,
			testData.tsLint.bcd,
			testData.tsLint.abc,
			testData.diagnostics.abc
		);

		disposables.add(registry.register('fooLang', provider));

		const expected = [
			// CodeActions with a diagnostics array are shown first without further sorting
			new CodeActionItem(testData.diagnostics.bcd, provider),
			new CodeActionItem(testData.diagnostics.abc, provider),

			// CodeActions without diagnostics are shown in the given order without any further sorting
			new CodeActionItem(testData.command.abc, provider),
			new CodeActionItem(testData.spelling.bcd, provider),
			new CodeActionItem(testData.tsLint.bcd, provider),
			new CodeActionItem(testData.tsLint.abc, provider)
		];

		const { validActions: actions } = disposables.add(await getCodeActions(registry, model, new Range(1, 1, 2, 1), { type: languages.CodeActionTriggerType.Invoke, triggerAction: CodeActionTriggerSource.Default }, Progress.None, CancellationToken.None));
		assert.strictEqual(actions.length, 6);
		assert.deepStrictEqual(actions, expected);
	});

	test('getCodeActions should filter by scope', async () => {
		const provider = staticCodeActionProvider(
			{ title: 'a', kind: 'a' },
			{ title: 'b', kind: 'b' },
			{ title: 'a.b', kind: 'a.b' }
		);

		disposables.add(registry.register('fooLang', provider));

		{
			const { validActions: actions } = disposables.add(await getCodeActions(registry, model, new Range(1, 1, 2, 1), { type: languages.CodeActionTriggerType.Auto, triggerAction: CodeActionTriggerSource.Default, filter: { include: new HierarchicalKind('a') } }, Progress.None, CancellationToken.None));
			assert.strictEqual(actions.length, 2);
			assert.strictEqual(actions[0].action.title, 'a');
			assert.strictEqual(actions[1].action.title, 'a.b');
		}

		{
			const { validActions: actions } = disposables.add(await getCodeActions(registry, model, new Range(1, 1, 2, 1), { type: languages.CodeActionTriggerType.Auto, triggerAction: CodeActionTriggerSource.Default, filter: { include: new HierarchicalKind('a.b') } }, Progress.None, CancellationToken.None));
			assert.strictEqual(actions.length, 1);
			assert.strictEqual(actions[0].action.title, 'a.b');
		}

		{
			const { validActions: actions } = disposables.add(await getCodeActions(registry, model, new Range(1, 1, 2, 1), { type: languages.CodeActionTriggerType.Auto, triggerAction: CodeActionTriggerSource.Default, filter: { include: new HierarchicalKind('a.b.c') } }, Progress.None, CancellationToken.None));
			assert.strictEqual(actions.length, 0);
		}
	});

	test('getCodeActions should forward requested scope to providers', async () => {
		const provider = new class implements languages.CodeActionProvider {
			provideCodeActions(_model: any, _range: Range, context: languages.CodeActionContext, _token: any): languages.CodeActionList {
				return {
					actions: [
						{ title: context.only || '', kind: context.only }
					],
					dispose: () => { }
				};
			}
		};

		disposables.add(registry.register('fooLang', provider));

		const { validActions: actions } = disposables.add(await getCodeActions(registry, model, new Range(1, 1, 2, 1), { type: languages.CodeActionTriggerType.Auto, triggerAction: CodeActionTriggerSource.Default, filter: { include: new HierarchicalKind('a') } }, Progress.None, CancellationToken.None));
		assert.strictEqual(actions.length, 1);
		assert.strictEqual(actions[0].action.title, 'a');
	});

	test('getCodeActions should not return source code action by default', async () => {
		const provider = staticCodeActionProvider(
			{ title: 'a', kind: CodeActionKind.Source.value },
			{ title: 'b', kind: 'b' }
		);

		disposables.add(registry.register('fooLang', provider));

		{
			const { validActions: actions } = disposables.add(await getCodeActions(registry, model, new Range(1, 1, 2, 1), { type: languages.CodeActionTriggerType.Auto, triggerAction: CodeActionTriggerSource.SourceAction }, Progress.None, CancellationToken.None));
			assert.strictEqual(actions.length, 1);
			assert.strictEqual(actions[0].action.title, 'b');
		}

		{
			const { validActions: actions } = disposables.add(await getCodeActions(registry, model, new Range(1, 1, 2, 1), { type: languages.CodeActionTriggerType.Auto, triggerAction: CodeActionTriggerSource.Default, filter: { include: CodeActionKind.Source, includeSourceActions: true } }, Progress.None, CancellationToken.None));
			assert.strictEqual(actions.length, 1);
			assert.strictEqual(actions[0].action.title, 'a');
		}
	});

	test('getCodeActions should support filtering out some requested source code actions #84602', async () => {
		const provider = staticCodeActionProvider(
			{ title: 'a', kind: CodeActionKind.Source.value },
			{ title: 'b', kind: CodeActionKind.Source.append('test').value },
			{ title: 'c', kind: 'c' }
		);

		disposables.add(registry.register('fooLang', provider));

		{
			const { validActions: actions } = disposables.add(await getCodeActions(registry, model, new Range(1, 1, 2, 1), {
				type: languages.CodeActionTriggerType.Auto, triggerAction: CodeActionTriggerSource.SourceAction, filter: {
					include: CodeActionKind.Source.append('test'),
					excludes: [CodeActionKind.Source],
					includeSourceActions: true,
				}
			}, Progress.None, CancellationToken.None));
			assert.strictEqual(actions.length, 1);
			assert.strictEqual(actions[0].action.title, 'b');
		}
	});

	test('getCodeActions no invoke a provider that has been excluded #84602', async () => {
		const baseType = CodeActionKind.Refactor;
		const subType = CodeActionKind.Refactor.append('sub');

		disposables.add(registry.register('fooLang', staticCodeActionProvider(
			{ title: 'a', kind: baseType.value }
		)));

		let didInvoke = false;
		disposables.add(registry.register('fooLang', new class implements languages.CodeActionProvider {

			providedCodeActionKinds = [subType.value];

			provideCodeActions(): languages.ProviderResult<languages.CodeActionList> {
				didInvoke = true;
				return {
					actions: [
						{ title: 'x', kind: subType.value }
					],
					dispose: () => { }
				};
			}
		}));

		{
			const { validActions: actions } = disposables.add(await getCodeActions(registry, model, new Range(1, 1, 2, 1), {
				type: languages.CodeActionTriggerType.Auto, triggerAction: CodeActionTriggerSource.Refactor, filter: {
					include: baseType,
					excludes: [subType],
				}
			}, Progress.None, CancellationToken.None));
			assert.strictEqual(didInvoke, false);
			assert.strictEqual(actions.length, 1);
			assert.strictEqual(actions[0].action.title, 'a');
		}
	});

	test('getCodeActions should not invoke code action providers filtered out by providedCodeActionKinds', async () => {
		let wasInvoked = false;
		const provider = new class implements languages.CodeActionProvider {
			provideCodeActions(): languages.CodeActionList {
				wasInvoked = true;
				return { actions: [], dispose: () => { } };
			}

			providedCodeActionKinds = [CodeActionKind.Refactor.value];
		};

		disposables.add(registry.register('fooLang', provider));

		const { validActions: actions } = disposables.add(await getCodeActions(registry, model, new Range(1, 1, 2, 1), {
			type: languages.CodeActionTriggerType.Auto, triggerAction: CodeActionTriggerSource.Refactor,
			filter: {
				include: CodeActionKind.QuickFix
			}
		}, Progress.None, CancellationToken.None));
		assert.strictEqual(actions.length, 0);
		assert.strictEqual(wasInvoked, false);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codeAction/test/browser/codeActionKeybindingResolver.test.ts]---
Location: vscode-main/src/vs/editor/contrib/codeAction/test/browser/codeActionKeybindingResolver.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { KeyCodeChord } from '../../../../../base/common/keybindings.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { OperatingSystem } from '../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { organizeImportsCommandId, refactorCommandId } from '../../browser/codeAction.js';
import { CodeActionKeybindingResolver } from '../../browser/codeActionKeybindingResolver.js';
import { CodeActionKind } from '../../common/types.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { ResolvedKeybindingItem } from '../../../../../platform/keybinding/common/resolvedKeybindingItem.js';
import { USLayoutResolvedKeybinding } from '../../../../../platform/keybinding/common/usLayoutResolvedKeybinding.js';

suite('CodeActionKeybindingResolver', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const refactorKeybinding = createCodeActionKeybinding(
		KeyCode.KeyA,
		refactorCommandId,
		{ kind: CodeActionKind.Refactor.value });

	const refactorExtractKeybinding = createCodeActionKeybinding(
		KeyCode.KeyB,
		refactorCommandId,
		{ kind: CodeActionKind.Refactor.append('extract').value });

	const organizeImportsKeybinding = createCodeActionKeybinding(
		KeyCode.KeyC,
		organizeImportsCommandId,
		undefined);

	test('Should match refactor keybindings', async function () {
		const resolver = new CodeActionKeybindingResolver(
			createMockKeyBindingService([refactorKeybinding])
		).getResolver();

		assert.strictEqual(
			resolver({ title: '' }),
			undefined);

		assert.strictEqual(
			resolver({ title: '', kind: CodeActionKind.Refactor.value }),
			refactorKeybinding.resolvedKeybinding);

		assert.strictEqual(
			resolver({ title: '', kind: CodeActionKind.Refactor.append('extract').value }),
			refactorKeybinding.resolvedKeybinding);

		assert.strictEqual(
			resolver({ title: '', kind: CodeActionKind.QuickFix.value }),
			undefined);
	});

	test('Should prefer most specific keybinding', async function () {
		const resolver = new CodeActionKeybindingResolver(
			createMockKeyBindingService([refactorKeybinding, refactorExtractKeybinding, organizeImportsKeybinding])
		).getResolver();

		assert.strictEqual(
			resolver({ title: '', kind: CodeActionKind.Refactor.value }),
			refactorKeybinding.resolvedKeybinding);

		assert.strictEqual(
			resolver({ title: '', kind: CodeActionKind.Refactor.append('extract').value }),
			refactorExtractKeybinding.resolvedKeybinding);
	});

	test('Organize imports should still return a keybinding even though it does not have args', async function () {
		const resolver = new CodeActionKeybindingResolver(
			createMockKeyBindingService([refactorKeybinding, refactorExtractKeybinding, organizeImportsKeybinding])
		).getResolver();

		assert.strictEqual(
			resolver({ title: '', kind: CodeActionKind.SourceOrganizeImports.value }),
			organizeImportsKeybinding.resolvedKeybinding);
	});
});

function createMockKeyBindingService(items: ResolvedKeybindingItem[]): IKeybindingService {
	return <IKeybindingService>{
		getKeybindings: (): readonly ResolvedKeybindingItem[] => {
			return items;
		},
	};
}

function createCodeActionKeybinding(keycode: KeyCode, command: string, commandArgs: any) {
	return new ResolvedKeybindingItem(
		new USLayoutResolvedKeybinding(
			[new KeyCodeChord(false, true, false, false, keycode)],
			OperatingSystem.Linux),
		command,
		commandArgs,
		undefined,
		false,
		null,
		false);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codeAction/test/browser/codeActionModel.test.ts]---
Location: vscode-main/src/vs/editor/contrib/codeAction/test/browser/codeActionModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { promiseWithResolvers } from '../../../../../base/common/async.js';
import { assertType } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { MarkerService } from '../../../../../platform/markers/common/markerService.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { LanguageFeatureRegistry } from '../../../../common/languageFeatureRegistry.js';
import * as languages from '../../../../common/languages.js';
import { TextModel } from '../../../../common/model/textModel.js';
import { createTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { CodeActionModel, CodeActionsState } from '../../browser/codeActionModel.js';

const testProvider = {
	provideCodeActions(): languages.CodeActionList {
		return {
			actions: [
				{ title: 'test', command: { id: 'test-command', title: 'test', arguments: [] } }
			],
			dispose() { /* noop*/ }
		};
	}
};

suite('CodeActionModel', () => {

	const languageId = 'foo-lang';
	const uri = URI.parse('untitled:path');
	let model: TextModel;
	let markerService: MarkerService;
	let editor: ICodeEditor;
	let registry: LanguageFeatureRegistry<languages.CodeActionProvider>;

	setup(() => {
		markerService = new MarkerService();
		model = createTextModel('foobar  foo bar\nfarboo far boo', languageId, undefined, uri);
		editor = createTestCodeEditor(model);
		editor.setPosition({ lineNumber: 1, column: 1 });
		registry = new LanguageFeatureRegistry();
	});

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	teardown(() => {
		editor.dispose();
		model.dispose();
		markerService.dispose();
	});

	test('Oracle -> marker added', async () => {
		const { promise: donePromise, resolve: done } = promiseWithResolvers<void>();

		await runWithFakedTimers({ useFakeTimers: true }, () => {
			const reg = registry.register(languageId, testProvider);
			store.add(reg);

			const contextKeys = new MockContextKeyService();
			const model = store.add(new CodeActionModel(editor, registry, markerService, contextKeys, undefined));
			store.add(model.onDidChangeState((e: CodeActionsState.State) => {
				assertType(e.type === CodeActionsState.Type.Triggered);

				assert.strictEqual(e.trigger.type, languages.CodeActionTriggerType.Auto);
				assert.ok(e.actions);

				e.actions.then(fixes => {
					model.dispose();
					assert.strictEqual(fixes.validActions.length, 1);
					done();
				}, done);
			}));

			// start here
			markerService.changeOne('fake', uri, [{
				startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 6,
				message: 'error',
				severity: 1,
				code: '',
				source: ''
			}]);
			return donePromise;
		});
	});

	test('Oracle -> position changed', async () => {
		await runWithFakedTimers({ useFakeTimers: true }, () => {
			const reg = registry.register(languageId, testProvider);
			store.add(reg);

			markerService.changeOne('fake', uri, [{
				startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 6,
				message: 'error',
				severity: 1,
				code: '',
				source: ''
			}]);

			editor.setPosition({ lineNumber: 2, column: 1 });

			return new Promise((resolve, reject) => {
				const contextKeys = new MockContextKeyService();
				const model = store.add(new CodeActionModel(editor, registry, markerService, contextKeys, undefined));
				store.add(model.onDidChangeState((e: CodeActionsState.State) => {
					assertType(e.type === CodeActionsState.Type.Triggered);

					assert.strictEqual(e.trigger.type, languages.CodeActionTriggerType.Auto);
					assert.ok(e.actions);
					e.actions.then(fixes => {
						model.dispose();
						assert.strictEqual(fixes.validActions.length, 1);
						resolve(undefined);
					}, reject);
				}));
				// start here
				editor.setPosition({ lineNumber: 1, column: 1 });
			});
		});
	});

	test('Oracle -> should only auto trigger once for cursor and marker update right after each other', async () => {
		const { promise: donePromise, resolve: done } = promiseWithResolvers<void>();
		await runWithFakedTimers({ useFakeTimers: true }, () => {
			const reg = registry.register(languageId, testProvider);
			store.add(reg);

			let triggerCount = 0;
			const contextKeys = new MockContextKeyService();
			const model = store.add(new CodeActionModel(editor, registry, markerService, contextKeys, undefined));
			store.add(model.onDidChangeState((e: CodeActionsState.State) => {
				assertType(e.type === CodeActionsState.Type.Triggered);

				assert.strictEqual(e.trigger.type, languages.CodeActionTriggerType.Auto);
				++triggerCount;

				// give time for second trigger before completing test
				setTimeout(() => {
					model.dispose();
					assert.strictEqual(triggerCount, 1);
					done();
				}, 0);
			}, 5 /*delay*/));

			markerService.changeOne('fake', uri, [{
				startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 6,
				message: 'error',
				severity: 1,
				code: '',
				source: ''
			}]);

			editor.setSelection({ startLineNumber: 1, startColumn: 1, endLineNumber: 4, endColumn: 1 });

			return donePromise;
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codelens/browser/codelens.ts]---
Location: vscode-main/src/vs/editor/contrib/codelens/browser/codelens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { illegalArgument, onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { DisposableStore, isDisposable } from '../../../../base/common/lifecycle.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ITextModel } from '../../../common/model.js';
import { CodeLens, CodeLensList, CodeLensProvider } from '../../../common/languages.js';
import { IModelService } from '../../../common/services/model.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';

export interface CodeLensItem {
	readonly symbol: CodeLens;
	readonly provider: CodeLensProvider;
}

export class CodeLensModel {

	static readonly Empty = new CodeLensModel();

	lenses: CodeLensItem[] = [];

	private _store: DisposableStore | undefined;

	dispose(): void {
		this._store?.dispose();
	}

	get isDisposed(): boolean {
		return this._store?.isDisposed ?? false;
	}

	add(list: CodeLensList, provider: CodeLensProvider): void {
		if (isDisposable(list)) {
			this._store ??= new DisposableStore();
			this._store.add(list);
		}
		for (const symbol of list.lenses) {
			this.lenses.push({ symbol, provider });
		}
	}
}

export async function getCodeLensModel(registry: LanguageFeatureRegistry<CodeLensProvider>, model: ITextModel, token: CancellationToken): Promise<CodeLensModel> {

	const provider = registry.ordered(model);
	const providerRanks = new Map<CodeLensProvider, number>();
	const result = new CodeLensModel();

	const promises = provider.map(async (provider, i) => {

		providerRanks.set(provider, i);

		try {
			const list = await Promise.resolve(provider.provideCodeLenses(model, token));
			if (list) {
				result.add(list, provider);
			}
		} catch (err) {
			onUnexpectedExternalError(err);
		}
	});

	await Promise.all(promises);

	if (token.isCancellationRequested) {
		result.dispose();
		return CodeLensModel.Empty;
	}

	result.lenses = result.lenses.sort((a, b) => {
		// sort by lineNumber, provider-rank, and column
		if (a.symbol.range.startLineNumber < b.symbol.range.startLineNumber) {
			return -1;
		} else if (a.symbol.range.startLineNumber > b.symbol.range.startLineNumber) {
			return 1;
		} else if ((providerRanks.get(a.provider)!) < (providerRanks.get(b.provider)!)) {
			return -1;
		} else if ((providerRanks.get(a.provider)!) > (providerRanks.get(b.provider)!)) {
			return 1;
		} else if (a.symbol.range.startColumn < b.symbol.range.startColumn) {
			return -1;
		} else if (a.symbol.range.startColumn > b.symbol.range.startColumn) {
			return 1;
		} else {
			return 0;
		}
	});
	return result;
}

CommandsRegistry.registerCommand('_executeCodeLensProvider', function (accessor, ...args: [URI, number | undefined | null]) {
	let [uri, itemResolveCount] = args;
	assertType(URI.isUri(uri));
	assertType(typeof itemResolveCount === 'number' || !itemResolveCount);

	const { codeLensProvider } = accessor.get(ILanguageFeaturesService);

	const model = accessor.get(IModelService).getModel(uri);
	if (!model) {
		throw illegalArgument();
	}

	const result: CodeLens[] = [];
	const disposables = new DisposableStore();
	return getCodeLensModel(codeLensProvider, model, CancellationToken.None).then(value => {

		disposables.add(value);
		const resolve: Promise<unknown>[] = [];

		for (const item of value.lenses) {
			if (itemResolveCount === undefined || itemResolveCount === null || Boolean(item.symbol.command)) {
				result.push(item.symbol);
			} else if (itemResolveCount-- > 0 && item.provider.resolveCodeLens) {
				resolve.push(Promise.resolve(item.provider.resolveCodeLens(model, item.symbol, CancellationToken.None)).then(symbol => result.push(symbol || item.symbol)));
			}
		}

		return Promise.all(resolve);

	}).then(() => {
		return result;
	}).finally(() => {
		// make sure to return results, then (on next tick)
		// dispose the results
		setTimeout(() => disposables.dispose(), 100);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/codelens/browser/codeLensCache.ts]---
Location: vscode-main/src/vs/editor/contrib/codelens/browser/codeLensCache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { LRUCache } from '../../../../base/common/map.js';
import { Range } from '../../../common/core/range.js';
import { ITextModel } from '../../../common/model.js';
import { CodeLens, CodeLensList, CodeLensProvider } from '../../../common/languages.js';
import { CodeLensModel } from './codelens.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget, WillSaveStateReason } from '../../../../platform/storage/common/storage.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { runWhenWindowIdle } from '../../../../base/browser/dom.js';

export const ICodeLensCache = createDecorator<ICodeLensCache>('ICodeLensCache');

export interface ICodeLensCache {
	readonly _serviceBrand: undefined;
	put(model: ITextModel, data: CodeLensModel): void;
	get(model: ITextModel): CodeLensModel | undefined;
	delete(model: ITextModel): void;
}

interface ISerializedCacheData {
	lineCount: number;
	lines: number[];
}

class CacheItem {

	constructor(
		readonly lineCount: number,
		readonly data: CodeLensModel
	) { }
}

export class CodeLensCache implements ICodeLensCache {

	declare readonly _serviceBrand: undefined;

	private readonly _fakeProvider = new class implements CodeLensProvider {
		provideCodeLenses(): CodeLensList {
			throw new Error('not supported');
		}
	};

	private readonly _cache = new LRUCache<string, CacheItem>(20, 0.75);

	constructor(@IStorageService storageService: IStorageService) {

		// remove old data
		const oldkey = 'codelens/cache';
		runWhenWindowIdle(mainWindow, () => storageService.remove(oldkey, StorageScope.WORKSPACE));

		// restore lens data on start
		const key = 'codelens/cache2';
		const raw = storageService.get(key, StorageScope.WORKSPACE, '{}');
		this._deserialize(raw);

		// store lens data on shutdown
		const onWillSaveStateBecauseOfShutdown = Event.filter(storageService.onWillSaveState, e => e.reason === WillSaveStateReason.SHUTDOWN);
		Event.once(onWillSaveStateBecauseOfShutdown)(e => {
			storageService.store(key, this._serialize(), StorageScope.WORKSPACE, StorageTarget.MACHINE);
		});
	}

	put(model: ITextModel, data: CodeLensModel): void {
		// create a copy of the model that is without command-ids
		// but with comand-labels
		const copyItems = data.lenses.map((item): CodeLens => {
			return {
				range: item.symbol.range,
				command: item.symbol.command && { id: '', title: item.symbol.command?.title },
			};
		});
		const copyModel = new CodeLensModel();
		copyModel.add({ lenses: copyItems }, this._fakeProvider);

		const item = new CacheItem(model.getLineCount(), copyModel);
		this._cache.set(model.uri.toString(), item);
	}

	get(model: ITextModel) {
		const item = this._cache.get(model.uri.toString());
		return item && item.lineCount === model.getLineCount() ? item.data : undefined;
	}

	delete(model: ITextModel): void {
		this._cache.delete(model.uri.toString());
	}

	// --- persistence

	private _serialize(): string {
		const data: Record<string, ISerializedCacheData> = Object.create(null);
		for (const [key, value] of this._cache) {
			const lines = new Set<number>();
			for (const d of value.data.lenses) {
				lines.add(d.symbol.range.startLineNumber);
			}
			data[key] = {
				lineCount: value.lineCount,
				lines: [...lines.values()]
			};
		}
		return JSON.stringify(data);
	}

	private _deserialize(raw: string): void {
		try {
			const data: Record<string, ISerializedCacheData> = JSON.parse(raw);
			for (const key in data) {
				const element = data[key];
				const lenses: CodeLens[] = [];
				for (const line of element.lines) {
					lenses.push({ range: new Range(line, 1, line, 11) });
				}

				const model = new CodeLensModel();
				model.add({ lenses }, this._fakeProvider);
				this._cache.set(key, new CacheItem(element.lineCount, model));
			}
		} catch {
			// ignore...
		}
	}
}

registerSingleton(ICodeLensCache, CodeLensCache, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

````

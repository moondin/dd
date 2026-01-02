---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 234
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 234 of 552)

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

---[FILE: src/vs/editor/contrib/linkedEditing/browser/linkedEditing.ts]---
Location: vscode-main/src/vs/editor/contrib/linkedEditing/browser/linkedEditing.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../../base/common/arrays.js';
import { Delayer, first } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Color } from '../../../../base/common/color.js';
import { isCancellationError, onUnexpectedError, onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { Event } from '../../../../base/common/event.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import * as strings from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorCommand, EditorContributionInstantiation, registerEditorAction, registerEditorCommand, registerEditorContribution, registerModelAndPositionCommand, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { IRange, Range } from '../../../common/core/range.js';
import { IEditorContribution, IEditorDecorationsCollection } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { IModelDeltaDecoration, ITextModel, TrackedRangeStickiness } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { LinkedEditingRangeProvider, LinkedEditingRanges } from '../../../common/languages.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import * as nls from '../../../../nls.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { ISingleEditOperation } from '../../../common/core/editOperation.js';
import { IFeatureDebounceInformation, ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import './linkedEditing.css';

export const CONTEXT_ONTYPE_RENAME_INPUT_VISIBLE = new RawContextKey<boolean>('LinkedEditingInputVisible', false);

const DECORATION_CLASS_NAME = 'linked-editing-decoration';

export class LinkedEditingContribution extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.linkedEditing';

	private static readonly DECORATION = ModelDecorationOptions.register({
		description: 'linked-editing',
		stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges,
		className: DECORATION_CLASS_NAME
	});

	static get(editor: ICodeEditor): LinkedEditingContribution | null {
		return editor.getContribution<LinkedEditingContribution>(LinkedEditingContribution.ID);
	}

	private _debounceDuration: number | undefined;

	private readonly _editor: ICodeEditor;
	private readonly _providers: LanguageFeatureRegistry<LinkedEditingRangeProvider>;
	private _enabled: boolean;

	private readonly _visibleContextKey: IContextKey<boolean>;
	private readonly _debounceInformation: IFeatureDebounceInformation;

	private _rangeUpdateTriggerPromise: Promise<unknown> | null;
	private _rangeSyncTriggerPromise: Promise<unknown> | null;

	private _currentRequestCts: CancellationTokenSource | null;
	private _currentRequestPosition: Position | null;
	private _currentRequestModelVersion: number | null;

	private _currentDecorations: IEditorDecorationsCollection; // The one at index 0 is the reference one
	private _syncRangesToken: number = 0;

	private _languageWordPattern: RegExp | null;
	private _currentWordPattern: RegExp | null;
	private _ignoreChangeEvent: boolean;

	private readonly _localToDispose = this._register(new DisposableStore());

	constructor(
		editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@ILanguageConfigurationService private readonly languageConfigurationService: ILanguageConfigurationService,
		@ILanguageFeatureDebounceService languageFeatureDebounceService: ILanguageFeatureDebounceService
	) {
		super();
		this._editor = editor;
		this._providers = languageFeaturesService.linkedEditingRangeProvider;
		this._enabled = false;
		this._visibleContextKey = CONTEXT_ONTYPE_RENAME_INPUT_VISIBLE.bindTo(contextKeyService);
		this._debounceInformation = languageFeatureDebounceService.for(this._providers, 'Linked Editing', { max: 200 });

		this._currentDecorations = this._editor.createDecorationsCollection();
		this._languageWordPattern = null;
		this._currentWordPattern = null;
		this._ignoreChangeEvent = false;
		this._localToDispose = this._register(new DisposableStore());

		this._rangeUpdateTriggerPromise = null;
		this._rangeSyncTriggerPromise = null;

		this._currentRequestCts = null;
		this._currentRequestPosition = null;
		this._currentRequestModelVersion = null;

		this._register(this._editor.onDidChangeModel(() => this.reinitialize(true)));

		this._register(this._editor.onDidChangeConfiguration(e => {
			if (e.hasChanged(EditorOption.linkedEditing) || e.hasChanged(EditorOption.renameOnType)) {
				this.reinitialize(false);
			}
		}));
		this._register(this._providers.onDidChange(() => this.reinitialize(false)));
		this._register(this._editor.onDidChangeModelLanguage(() => this.reinitialize(true)));

		this.reinitialize(true);
	}

	private reinitialize(forceRefresh: boolean) {
		const model = this._editor.getModel();
		const isEnabled = model !== null && (this._editor.getOption(EditorOption.linkedEditing) || this._editor.getOption(EditorOption.renameOnType)) && this._providers.has(model);
		if (isEnabled === this._enabled && !forceRefresh) {
			return;
		}

		this._enabled = isEnabled;

		this.clearRanges();
		this._localToDispose.clear();

		if (!isEnabled || model === null) {
			return;
		}

		this._localToDispose.add(
			Event.runAndSubscribe(
				model.onDidChangeLanguageConfiguration,
				() => {
					this._languageWordPattern = this.languageConfigurationService.getLanguageConfiguration(model.getLanguageId()).getWordDefinition();
				}
			)
		);

		const rangeUpdateScheduler = new Delayer(this._debounceInformation.get(model));
		const triggerRangeUpdate = () => {
			this._rangeUpdateTriggerPromise = rangeUpdateScheduler.trigger(() => this.updateRanges(), this._debounceDuration ?? this._debounceInformation.get(model));
		};
		const rangeSyncScheduler = new Delayer(0);
		const triggerRangeSync = (token: number) => {
			this._rangeSyncTriggerPromise = rangeSyncScheduler.trigger(() => this._syncRanges(token));
		};
		this._localToDispose.add(this._editor.onDidChangeCursorPosition(() => {
			triggerRangeUpdate();
		}));
		this._localToDispose.add(this._editor.onDidChangeModelContent((e) => {
			if (!this._ignoreChangeEvent) {
				if (this._currentDecorations.length > 0) {
					const referenceRange = this._currentDecorations.getRange(0);
					if (referenceRange && e.changes.every(c => referenceRange.intersectRanges(c.range))) {
						triggerRangeSync(this._syncRangesToken);
						return;
					}
				}
			}
			triggerRangeUpdate();
		}));
		this._localToDispose.add({
			dispose: () => {
				rangeUpdateScheduler.dispose();
				rangeSyncScheduler.dispose();
			}
		});
		this.updateRanges();
	}

	private _syncRanges(token: number): void {
		// delayed invocation, make sure we're still on
		if (!this._editor.hasModel() || token !== this._syncRangesToken || this._currentDecorations.length === 0) {
			// nothing to do
			return;
		}

		const model = this._editor.getModel();
		const referenceRange = this._currentDecorations.getRange(0);

		if (!referenceRange || referenceRange.startLineNumber !== referenceRange.endLineNumber) {
			return this.clearRanges();
		}

		const referenceValue = model.getValueInRange(referenceRange);
		if (this._currentWordPattern) {
			const match = referenceValue.match(this._currentWordPattern);
			const matchLength = match ? match[0].length : 0;
			if (matchLength !== referenceValue.length) {
				return this.clearRanges();
			}
		}

		const edits: ISingleEditOperation[] = [];
		for (let i = 1, len = this._currentDecorations.length; i < len; i++) {
			const mirrorRange = this._currentDecorations.getRange(i);
			if (!mirrorRange) {
				continue;
			}
			if (mirrorRange.startLineNumber !== mirrorRange.endLineNumber) {
				edits.push({
					range: mirrorRange,
					text: referenceValue
				});
			} else {
				let oldValue = model.getValueInRange(mirrorRange);
				let newValue = referenceValue;
				let rangeStartColumn = mirrorRange.startColumn;
				let rangeEndColumn = mirrorRange.endColumn;

				const commonPrefixLength = strings.commonPrefixLength(oldValue, newValue);
				rangeStartColumn += commonPrefixLength;
				oldValue = oldValue.substr(commonPrefixLength);
				newValue = newValue.substr(commonPrefixLength);

				const commonSuffixLength = strings.commonSuffixLength(oldValue, newValue);
				rangeEndColumn -= commonSuffixLength;
				oldValue = oldValue.substr(0, oldValue.length - commonSuffixLength);
				newValue = newValue.substr(0, newValue.length - commonSuffixLength);

				if (rangeStartColumn !== rangeEndColumn || newValue.length !== 0) {
					edits.push({
						range: new Range(mirrorRange.startLineNumber, rangeStartColumn, mirrorRange.endLineNumber, rangeEndColumn),
						text: newValue
					});
				}
			}
		}

		if (edits.length === 0) {
			return;
		}

		try {
			this._editor.popUndoStop();
			this._ignoreChangeEvent = true;
			const prevEditOperationType = this._editor._getViewModel().getPrevEditOperationType();
			this._editor.executeEdits('linkedEditing', edits);
			this._editor._getViewModel().setPrevEditOperationType(prevEditOperationType);
		} finally {
			this._ignoreChangeEvent = false;
		}
	}

	public override dispose(): void {
		this.clearRanges();
		super.dispose();
	}

	public clearRanges(): void {
		this._visibleContextKey.set(false);
		this._currentDecorations.clear();
		if (this._currentRequestCts) {
			this._currentRequestCts.cancel();
			this._currentRequestCts = null;
			this._currentRequestPosition = null;
		}
	}

	public get currentUpdateTriggerPromise(): Promise<unknown> {
		return this._rangeUpdateTriggerPromise || Promise.resolve();
	}

	public get currentSyncTriggerPromise(): Promise<unknown> {
		return this._rangeSyncTriggerPromise || Promise.resolve();
	}

	public async updateRanges(force = false): Promise<void> {
		if (!this._editor.hasModel()) {
			this.clearRanges();
			return;
		}

		const position = this._editor.getPosition();
		if (!this._enabled && !force || this._editor.getSelections().length > 1) {
			// disabled or multicursor
			this.clearRanges();
			return;
		}

		const model = this._editor.getModel();
		const modelVersionId = model.getVersionId();
		if (this._currentRequestPosition && this._currentRequestModelVersion === modelVersionId) {
			if (position.equals(this._currentRequestPosition)) {
				return; // same position
			}
			if (this._currentDecorations.length > 0) {
				const range = this._currentDecorations.getRange(0);
				if (range && range.containsPosition(position)) {
					return; // just moving inside the existing primary range
				}
			}
		}

		if (!this._currentRequestPosition?.equals(position)) {
			// Get the current range of the first decoration (reference range)
			const currentRange = this._currentDecorations.getRange(0);
			// If there is no current range or the current range does not contain the new position, clear the ranges
			if (!currentRange?.containsPosition(position)) {
				// Clear existing decorations while we compute new ones
				this.clearRanges();
			}
		}

		this._currentRequestPosition = position;
		this._currentRequestModelVersion = modelVersionId;

		const currentRequestCts = this._currentRequestCts = new CancellationTokenSource();
		try {
			const sw = new StopWatch(false);
			const response = await getLinkedEditingRanges(this._providers, model, position, currentRequestCts.token);
			this._debounceInformation.update(model, sw.elapsed());
			if (currentRequestCts !== this._currentRequestCts) {
				return;
			}
			this._currentRequestCts = null;
			if (modelVersionId !== model.getVersionId()) {
				return;
			}

			let ranges: IRange[] = [];
			if (response?.ranges) {
				ranges = response.ranges;
			}

			this._currentWordPattern = response?.wordPattern || this._languageWordPattern;

			let foundReferenceRange = false;
			for (let i = 0, len = ranges.length; i < len; i++) {
				if (Range.containsPosition(ranges[i], position)) {
					foundReferenceRange = true;
					if (i !== 0) {
						const referenceRange = ranges[i];
						ranges.splice(i, 1);
						ranges.unshift(referenceRange);
					}
					break;
				}
			}

			if (!foundReferenceRange) {
				// Cannot do linked editing if the ranges are not where the cursor is...
				this.clearRanges();
				return;
			}

			const decorations: IModelDeltaDecoration[] = ranges.map(range => ({ range: range, options: LinkedEditingContribution.DECORATION }));
			this._visibleContextKey.set(true);
			this._currentDecorations.set(decorations);
			this._syncRangesToken++; // cancel any pending syncRanges call
		} catch (err) {
			if (!isCancellationError(err)) {
				onUnexpectedError(err);
			}
			if (this._currentRequestCts === currentRequestCts || !this._currentRequestCts) {
				// stop if we are still the latest request
				this.clearRanges();
			}
		}

	}

	// for testing
	public setDebounceDuration(timeInMS: number) {
		this._debounceDuration = timeInMS;
	}

	// private printDecorators(model: ITextModel) {
	// 	return this._currentDecorations.map(d => {
	// 		const range = model.getDecorationRange(d);
	// 		if (range) {
	// 			return this.printRange(range);
	// 		}
	// 		return 'invalid';
	// 	}).join(',');
	// }

	// private printChanges(changes: IModelContentChange[]) {
	// 	return changes.map(c => {
	// 		return `${this.printRange(c.range)} - ${c.text}`;
	// 	}
	// 	).join(',');
	// }

	// private printRange(range: IRange) {
	// 	return `${range.startLineNumber},${range.startColumn}/${range.endLineNumber},${range.endColumn}`;
	// }
}

export class LinkedEditingAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.linkedEditing',
			label: nls.localize2('linkedEditing.label', "Start Linked Editing"),
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasRenameProvider),
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.F2,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	override runCommand(accessor: ServicesAccessor, args: [URI, IPosition]): void | Promise<void> {
		const editorService = accessor.get(ICodeEditorService);
		const [uri, pos] = Array.isArray(args) && args || [undefined, undefined];

		if (URI.isUri(uri) && Position.isIPosition(pos)) {
			return editorService.openCodeEditor({ resource: uri }, editorService.getActiveCodeEditor()).then(editor => {
				if (!editor) {
					return;
				}
				editor.setPosition(pos);
				editor.invokeWithinContext(accessor => {
					this.reportTelemetry(accessor, editor);
					return this.run(accessor, editor);
				});
			}, onUnexpectedError);
		}

		return super.runCommand(accessor, args);
	}

	run(_accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const controller = LinkedEditingContribution.get(editor);
		if (controller) {
			return Promise.resolve(controller.updateRanges(true));
		}
		return Promise.resolve();
	}
}

const LinkedEditingCommand = EditorCommand.bindToContribution<LinkedEditingContribution>(LinkedEditingContribution.get);
registerEditorCommand(new LinkedEditingCommand({
	id: 'cancelLinkedEditingInput',
	precondition: CONTEXT_ONTYPE_RENAME_INPUT_VISIBLE,
	handler: x => x.clearRanges(),
	kbOpts: {
		kbExpr: EditorContextKeys.editorTextFocus,
		weight: KeybindingWeight.EditorContrib + 99,
		primary: KeyCode.Escape,
		secondary: [KeyMod.Shift | KeyCode.Escape]
	}
}));


function getLinkedEditingRanges(providers: LanguageFeatureRegistry<LinkedEditingRangeProvider>, model: ITextModel, position: Position, token: CancellationToken): Promise<LinkedEditingRanges | undefined | null> {
	const orderedByScore = providers.ordered(model);

	// in order of score ask the linked editing range provider
	// until someone response with a good result
	// (good = not null)
	return first<LinkedEditingRanges | undefined | null>(orderedByScore.map(provider => async () => {
		try {
			return await provider.provideLinkedEditingRanges(model, position, token);
		} catch (e) {
			onUnexpectedExternalError(e);
			return undefined;
		}
	}), result => !!result && arrays.isNonEmptyArray(result?.ranges));
}

export const editorLinkedEditingBackground = registerColor('editor.linkedEditingBackground', { dark: Color.fromHex('#f00').transparent(0.3), light: Color.fromHex('#f00').transparent(0.3), hcDark: Color.fromHex('#f00').transparent(0.3), hcLight: Color.white }, nls.localize('editorLinkedEditingBackground', 'Background color when the editor auto renames on type.'));

registerModelAndPositionCommand('_executeLinkedEditingProvider', (_accessor, model, position) => {
	const { linkedEditingRangeProvider } = _accessor.get(ILanguageFeaturesService);
	return getLinkedEditingRanges(linkedEditingRangeProvider, model, position, CancellationToken.None);
});

registerEditorContribution(LinkedEditingContribution.ID, LinkedEditingContribution, EditorContributionInstantiation.AfterFirstRender);
registerEditorAction(LinkedEditingAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/linkedEditing/test/browser/linkedEditing.test.ts]---
Location: vscode-main/src/vs/editor/contrib/linkedEditing/test/browser/linkedEditing.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CoreEditingCommands } from '../../../../browser/coreCommands.js';
import { IPosition, Position } from '../../../../common/core/position.js';
import { IRange, Range } from '../../../../common/core/range.js';
import { USUAL_WORD_SEPARATORS } from '../../../../common/core/wordHelper.js';
import { Handler } from '../../../../common/editorCommon.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { ITextModel } from '../../../../common/model.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { DeleteAllLeftAction } from '../../../linesOperations/browser/linesOperations.js';
import { LinkedEditingContribution } from '../../browser/linkedEditing.js';
import { DeleteWordLeft } from '../../../wordOperations/browser/wordOperations.js';
import { ITestCodeEditor, createCodeEditorServices, instantiateTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { instantiateTextModel } from '../../../../test/common/testTextModel.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';

const mockFile = URI.parse('test:somefile.ttt');
const mockFileSelector = { scheme: 'test' };
const timeout = 30;

interface TestEditor {
	setPosition(pos: Position): Promise<any>;
	setSelection(sel: IRange): Promise<any>;
	trigger(source: string | null | undefined, handlerId: string, payload: any): Promise<any>;
	undo(): void;
	redo(): void;
}

const languageId = 'linkedEditingTestLangage';

suite('linked editing', () => {
	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let languageFeaturesService: ILanguageFeaturesService;
	let languageConfigurationService: ILanguageConfigurationService;

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = createCodeEditorServices(disposables);
		languageFeaturesService = instantiationService.get(ILanguageFeaturesService);
		languageConfigurationService = instantiationService.get(ILanguageConfigurationService);

		disposables.add(languageConfigurationService.register(languageId, {
			wordPattern: /[a-zA-Z]+/
		}));
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function createMockEditor(text: string | string[]): ITestCodeEditor {
		const model = disposables.add(instantiateTextModel(instantiationService, typeof text === 'string' ? text : text.join('\n'), languageId, undefined, mockFile));
		const editor = disposables.add(instantiateTestCodeEditor(instantiationService, model));
		return editor;
	}

	function testCase(
		name: string,
		initialState: { text: string | string[]; responseWordPattern?: RegExp },
		operations: (editor: TestEditor) => Promise<void>,
		expectedEndText: string | string[]
	) {
		test(name, async () => {
			await runWithFakedTimers({}, async () => {

				disposables.add(languageFeaturesService.linkedEditingRangeProvider.register(mockFileSelector, {
					provideLinkedEditingRanges(model: ITextModel, pos: IPosition) {
						const wordAtPos = model.getWordAtPosition(pos);
						if (wordAtPos) {
							const matches = model.findMatches(wordAtPos.word, false, false, true, USUAL_WORD_SEPARATORS, false);
							return { ranges: matches.map(m => m.range), wordPattern: initialState.responseWordPattern };
						}
						return { ranges: [], wordPattern: initialState.responseWordPattern };
					}
				}));

				const editor = createMockEditor(initialState.text);
				editor.updateOptions({ linkedEditing: true });
				const linkedEditingContribution = disposables.add(editor.registerAndInstantiateContribution(
					LinkedEditingContribution.ID,
					LinkedEditingContribution,
				));
				linkedEditingContribution.setDebounceDuration(0);

				const testEditor: TestEditor = {
					setPosition(pos: Position) {
						editor.setPosition(pos);
						return linkedEditingContribution.currentUpdateTriggerPromise;
					},
					setSelection(sel: IRange) {
						editor.setSelection(sel);
						return linkedEditingContribution.currentUpdateTriggerPromise;
					},
					trigger(source: string | null | undefined, handlerId: string, payload: any) {
						if (handlerId === Handler.Type || handlerId === Handler.Paste) {
							editor.trigger(source, handlerId, payload);
						} else if (handlerId === 'deleteLeft') {
							editor.runCommand(CoreEditingCommands.DeleteLeft, payload);
						} else if (handlerId === 'deleteWordLeft') {
							instantiationService.invokeFunction((accessor) => (new DeleteWordLeft()).runEditorCommand(accessor, editor, payload));
						} else if (handlerId === 'deleteAllLeft') {
							instantiationService.invokeFunction((accessor) => (new DeleteAllLeftAction()).runEditorCommand(accessor, editor, payload));
						} else {
							throw new Error(`Unknown handler ${handlerId}!`);
						}
						return linkedEditingContribution.currentSyncTriggerPromise;
					},
					undo() {
						editor.runCommand(CoreEditingCommands.Undo, null);
					},
					redo() {
						editor.runCommand(CoreEditingCommands.Redo, null);
					}
				};

				await operations(testEditor);

				return new Promise<void>((resolve) => {
					setTimeout(() => {
						if (typeof expectedEndText === 'string') {
							assert.strictEqual(editor.getModel()!.getValue(), expectedEndText);
						} else {
							assert.strictEqual(editor.getModel()!.getValue(), expectedEndText.join('\n'));
						}
						resolve();
					}, timeout);
				});
			});
		});
	}

	const state = {
		text: '<ooo></ooo>'
	};

	/**
	 * Simple insertion
	 */
	testCase('Simple insert - initial', state, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<iooo></iooo>');

	testCase('Simple insert - middle', state, async (editor) => {
		const pos = new Position(1, 3);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<oioo></oioo>');

	testCase('Simple insert - end', state, async (editor) => {
		const pos = new Position(1, 5);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<oooi></oooi>');

	/**
	 * Simple insertion - end
	 */
	testCase('Simple insert end - initial', state, async (editor) => {
		const pos = new Position(1, 8);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<iooo></iooo>');

	testCase('Simple insert end - middle', state, async (editor) => {
		const pos = new Position(1, 9);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<oioo></oioo>');

	testCase('Simple insert end - end', state, async (editor) => {
		const pos = new Position(1, 11);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<oooi></oooi>');

	/**
	 * Boundary insertion
	 */
	testCase('Simple insert - out of boundary', state, async (editor) => {
		const pos = new Position(1, 1);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, 'i<ooo></ooo>');

	testCase('Simple insert - out of boundary 2', state, async (editor) => {
		const pos = new Position(1, 6);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<ooo>i</ooo>');

	testCase('Simple insert - out of boundary 3', state, async (editor) => {
		const pos = new Position(1, 7);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<ooo><i/ooo>');

	testCase('Simple insert - out of boundary 4', state, async (editor) => {
		const pos = new Position(1, 12);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<ooo></ooo>i');

	/**
	 * Insert + Move
	 */
	testCase('Continuous insert', state, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<iiooo></iiooo>');

	testCase('Insert - move - insert', state, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
		await editor.setPosition(new Position(1, 4));
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<ioioo></ioioo>');

	testCase('Insert - move - insert outside region', state, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
		await editor.setPosition(new Position(1, 7));
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<iooo>i</iooo>');

	/**
	 * Selection insert
	 */
	testCase('Selection insert - simple', state, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.setSelection(new Range(1, 2, 1, 3));
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<ioo></ioo>');

	testCase('Selection insert - whole', state, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.setSelection(new Range(1, 2, 1, 5));
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<i></i>');

	testCase('Selection insert - across boundary', state, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.setSelection(new Range(1, 1, 1, 3));
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, 'ioo></oo>');

	/**
	 * @todo
	 * Undefined behavior
	 */
	// testCase('Selection insert - across two boundary', state, async (editor) => {
	// 	const pos = new Position(1, 2);
	// 	await editor.setPosition(pos);
	// 	await linkedEditingContribution.updateLinkedUI(pos);
	// 	await editor.setSelection(new Range(1, 4, 1, 9));
	// 	await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	// }, '<ooioo>');

	/**
	 * Break out behavior
	 */
	testCase('Breakout - type space', state, async (editor) => {
		const pos = new Position(1, 5);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: ' ' });
	}, '<ooo ></ooo>');

	testCase('Breakout - type space then undo', state, async (editor) => {
		const pos = new Position(1, 5);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: ' ' });
		editor.undo();
	}, '<ooo></ooo>');

	testCase('Breakout - type space in middle', state, async (editor) => {
		const pos = new Position(1, 4);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: ' ' });
	}, '<oo o></ooo>');

	testCase('Breakout - paste content starting with space', state, async (editor) => {
		const pos = new Position(1, 5);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Paste, { text: ' i="i"' });
	}, '<ooo i="i"></ooo>');

	testCase('Breakout - paste content starting with space then undo', state, async (editor) => {
		const pos = new Position(1, 5);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Paste, { text: ' i="i"' });
		editor.undo();
	}, '<ooo></ooo>');

	testCase('Breakout - paste content starting with space in middle', state, async (editor) => {
		const pos = new Position(1, 4);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Paste, { text: ' i' });
	}, '<oo io></ooo>');

	/**
	 * Break out with custom provider wordPattern
	 */

	const state3 = {
		...state,
		responseWordPattern: /[a-yA-Y]+/
	};

	testCase('Breakout with stop pattern - insert', state3, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<iooo></iooo>');

	testCase('Breakout with stop pattern - insert stop char', state3, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'z' });
	}, '<zooo></ooo>');

	testCase('Breakout with stop pattern - paste char', state3, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Paste, { text: 'z' });
	}, '<zooo></ooo>');

	testCase('Breakout with stop pattern - paste string', state3, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Paste, { text: 'zo' });
	}, '<zoooo></ooo>');

	testCase('Breakout with stop pattern - insert at end', state3, async (editor) => {
		const pos = new Position(1, 5);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'z' });
	}, '<oooz></ooo>');

	const state4 = {
		...state,
		responseWordPattern: /[a-eA-E]+/
	};

	testCase('Breakout with stop pattern - insert stop char, respos', state4, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, '<iooo></ooo>');

	/**
	 * Delete
	 */
	testCase('Delete - left char', state, async (editor) => {
		const pos = new Position(1, 5);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', 'deleteLeft', {});
	}, '<oo></oo>');

	testCase('Delete - left char then undo', state, async (editor) => {
		const pos = new Position(1, 5);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', 'deleteLeft', {});
		editor.undo();
	}, '<ooo></ooo>');

	testCase('Delete - left word', state, async (editor) => {
		const pos = new Position(1, 5);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', 'deleteWordLeft', {});
	}, '<></>');

	testCase('Delete - left word then undo', state, async (editor) => {
		const pos = new Position(1, 5);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', 'deleteWordLeft', {});
		editor.undo();
		editor.undo();
	}, '<ooo></ooo>');

	/**
	 * Todo: Fix test
	 */
	// testCase('Delete - left all', state, async (editor) => {
	// 	const pos = new Position(1, 3);
	// 	await editor.setPosition(pos);
	// 	await linkedEditingContribution.updateLinkedUI(pos);
	// 	await editor.trigger('keyboard', 'deleteAllLeft', {});
	// }, '></>');

	/**
	 * Todo: Fix test
	 */
	// testCase('Delete - left all then undo', state, async (editor) => {
	// 	const pos = new Position(1, 5);
	// 	await editor.setPosition(pos);
	// 	await linkedEditingContribution.updateLinkedUI(pos);
	// 	await editor.trigger('keyboard', 'deleteAllLeft', {});
	// 	editor.undo();
	// }, '></ooo>');

	testCase('Delete - left all then undo twice', state, async (editor) => {
		const pos = new Position(1, 5);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', 'deleteAllLeft', {});
		editor.undo();
		editor.undo();
	}, '<ooo></ooo>');

	testCase('Delete - selection', state, async (editor) => {
		const pos = new Position(1, 5);
		await editor.setPosition(pos);
		await editor.setSelection(new Range(1, 2, 1, 3));
		await editor.trigger('keyboard', 'deleteLeft', {});
	}, '<oo></oo>');

	testCase('Delete - selection across boundary', state, async (editor) => {
		const pos = new Position(1, 3);
		await editor.setPosition(pos);
		await editor.setSelection(new Range(1, 1, 1, 3));
		await editor.trigger('keyboard', 'deleteLeft', {});
	}, 'oo></oo>');

	/**
	 * Undo / redo
	 */
	testCase('Undo/redo - simple undo', state, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
		editor.undo();
		editor.undo();
	}, '<ooo></ooo>');

	testCase('Undo/redo - simple undo/redo', state, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
		editor.undo();
		editor.redo();
	}, '<iooo></iooo>');

	/**
	 * Multi line
	 */
	const state2 = {
		text: [
			'<ooo>',
			'</ooo>'
		]
	};

	testCase('Multiline insert', state2, async (editor) => {
		const pos = new Position(1, 2);
		await editor.setPosition(pos);
		await editor.trigger('keyboard', Handler.Type, { text: 'i' });
	}, [
		'<iooo>',
		'</iooo>'
	]);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/links/browser/getLinks.ts]---
Location: vscode-main/src/vs/editor/contrib/links/browser/getLinks.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { DisposableStore, isDisposable } from '../../../../base/common/lifecycle.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { IRange, Range } from '../../../common/core/range.js';
import { ITextModel } from '../../../common/model.js';
import { ILink, ILinksList, LinkProvider } from '../../../common/languages.js';
import { IModelService } from '../../../common/services/model.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';

export class Link implements ILink {

	private _link: ILink;
	private readonly _provider: LinkProvider;

	constructor(link: ILink, provider: LinkProvider) {
		this._link = link;
		this._provider = provider;
	}

	toJSON(): ILink {
		return {
			range: this.range,
			url: this.url,
			tooltip: this.tooltip
		};
	}

	get range(): IRange {
		return this._link.range;
	}

	get url(): URI | string | undefined {
		return this._link.url;
	}

	get tooltip(): string | undefined {
		return this._link.tooltip;
	}

	async resolve(token: CancellationToken): Promise<URI | string> {
		if (this._link.url) {
			return this._link.url;
		}

		if (typeof this._provider.resolveLink === 'function') {
			return Promise.resolve(this._provider.resolveLink(this._link, token)).then(value => {
				this._link = value || this._link;
				if (this._link.url) {
					// recurse
					return this.resolve(token);
				}

				return Promise.reject(new Error('missing'));
			});
		}

		return Promise.reject(new Error('missing'));
	}
}

export class LinksList {

	static readonly Empty = new LinksList([]);

	readonly links: Link[];

	private readonly _disposables: DisposableStore | undefined = new DisposableStore();

	constructor(tuples: [ILinksList, LinkProvider][]) {

		let links: Link[] = [];
		for (const [list, provider] of tuples) {
			// merge all links
			const newLinks = list.links.map(link => new Link(link, provider));
			links = LinksList._union(links, newLinks);
			// register disposables
			if (isDisposable(list)) {
				this._disposables ??= new DisposableStore();
				this._disposables.add(list);
			}
		}
		this.links = links;
	}

	dispose(): void {
		this._disposables?.dispose();
		this.links.length = 0;
	}

	private static _union(oldLinks: Link[], newLinks: Link[]): Link[] {
		// reunite oldLinks with newLinks and remove duplicates
		const result: Link[] = [];
		let oldIndex: number;
		let oldLen: number;
		let newIndex: number;
		let newLen: number;

		for (oldIndex = 0, newIndex = 0, oldLen = oldLinks.length, newLen = newLinks.length; oldIndex < oldLen && newIndex < newLen;) {
			const oldLink = oldLinks[oldIndex];
			const newLink = newLinks[newIndex];

			if (Range.areIntersectingOrTouching(oldLink.range, newLink.range)) {
				// Remove the oldLink
				oldIndex++;
				continue;
			}

			const comparisonResult = Range.compareRangesUsingStarts(oldLink.range, newLink.range);

			if (comparisonResult < 0) {
				// oldLink is before
				result.push(oldLink);
				oldIndex++;
			} else {
				// newLink is before
				result.push(newLink);
				newIndex++;
			}
		}

		for (; oldIndex < oldLen; oldIndex++) {
			result.push(oldLinks[oldIndex]);
		}
		for (; newIndex < newLen; newIndex++) {
			result.push(newLinks[newIndex]);
		}

		return result;
	}

}

export async function getLinks(providers: LanguageFeatureRegistry<LinkProvider>, model: ITextModel, token: CancellationToken): Promise<LinksList> {
	const lists: [ILinksList, LinkProvider][] = [];

	// ask all providers for links in parallel
	const promises = providers.ordered(model).reverse().map(async (provider, i) => {
		try {
			const result = await provider.provideLinks(model, token);
			if (result) {
				lists[i] = [result, provider];
			}
		} catch (err) {
			onUnexpectedExternalError(err);
		}
	});

	await Promise.all(promises);

	let res = new LinksList(coalesce(lists));

	if (token.isCancellationRequested) {
		res.dispose();
		res = LinksList.Empty;
	}

	return res;
}


CommandsRegistry.registerCommand('_executeLinkProvider', async (accessor, ...args): Promise<ILink[]> => {
	let [uri, resolveCount] = args;
	assertType(uri instanceof URI);

	if (typeof resolveCount !== 'number') {
		resolveCount = 0;
	}

	const { linkProvider } = accessor.get(ILanguageFeaturesService);
	const model = accessor.get(IModelService).getModel(uri);
	if (!model) {
		return [];
	}
	const list = await getLinks(linkProvider, model, CancellationToken.None);
	if (!list) {
		return [];
	}

	// resolve links
	for (let i = 0; i < Math.min(resolveCount as number, list.links.length); i++) {
		await list.links[i].resolve(CancellationToken.None);
	}

	const result = list.links.slice(0);
	list.dispose();
	return result;
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/links/browser/links.css]---
Location: vscode-main/src/vs/editor/contrib/links/browser/links.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
.monaco-editor .detected-link,
.monaco-editor .detected-link-active {
	text-decoration: underline;
	text-underline-position: under;
}

.monaco-editor .detected-link-active {
	cursor: pointer;
	color: var(--vscode-editorLink-activeForeground) !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/links/browser/links.ts]---
Location: vscode-main/src/vs/editor/contrib/links/browser/links.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createCancelablePromise, CancelablePromise, RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import * as platform from '../../../../base/common/platform.js';
import * as resources from '../../../../base/common/resources.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { URI } from '../../../../base/common/uri.js';
import './links.css';
import { ICodeEditor, MouseTargetType } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, registerEditorAction, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { LinkProvider } from '../../../common/languages.js';
import { IModelDecorationsChangeAccessor, IModelDeltaDecoration, TrackedRangeStickiness } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { IFeatureDebounceInformation, ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { ClickLinkGesture, ClickLinkKeyboardEvent, ClickLinkMouseEvent } from '../../gotoSymbol/browser/link/clickLinkGesture.js';
import { getLinks, Link, LinksList } from './getLinks.js';
import * as nls from '../../../../nls.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';

export class LinkDetector extends Disposable implements IEditorContribution {

	public static readonly ID: string = 'editor.linkDetector';

	public static get(editor: ICodeEditor): LinkDetector | null {
		return editor.getContribution<LinkDetector>(LinkDetector.ID);
	}

	private readonly providers: LanguageFeatureRegistry<LinkProvider>;
	private readonly debounceInformation: IFeatureDebounceInformation;
	private readonly computeLinks: RunOnceScheduler;
	private computePromise: CancelablePromise<LinksList> | null;
	private activeLinksList: LinksList | null;
	private activeLinkDecorationId: string | null;
	private currentOccurrences: { [decorationId: string]: LinkOccurrence };

	constructor(
		private readonly editor: ICodeEditor,
		@IOpenerService private readonly openerService: IOpenerService,
		@INotificationService private readonly notificationService: INotificationService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@ILanguageFeatureDebounceService languageFeatureDebounceService: ILanguageFeatureDebounceService,
	) {
		super();

		this.providers = this.languageFeaturesService.linkProvider;
		this.debounceInformation = languageFeatureDebounceService.for(this.providers, 'Links', { min: 1000, max: 4000 });
		this.computeLinks = this._register(new RunOnceScheduler(() => this.computeLinksNow(), 1000));
		this.computePromise = null;
		this.activeLinksList = null;
		this.currentOccurrences = {};
		this.activeLinkDecorationId = null;

		const clickLinkGesture = this._register(new ClickLinkGesture(editor));

		this._register(clickLinkGesture.onMouseMoveOrRelevantKeyDown(([mouseEvent, keyboardEvent]) => {
			this._onEditorMouseMove(mouseEvent, keyboardEvent);
		}));
		this._register(clickLinkGesture.onExecute((e) => {
			this.onEditorMouseUp(e);
		}));
		this._register(clickLinkGesture.onCancel((e) => {
			this.cleanUpActiveLinkDecoration();
		}));
		this._register(editor.onDidChangeConfiguration((e) => {
			if (!e.hasChanged(EditorOption.links)) {
				return;
			}
			// Remove any links (for the getting disabled case)
			this.updateDecorations([]);

			// Stop any computation (for the getting disabled case)
			this.stop();

			// Start computing (for the getting enabled case)
			this.computeLinks.schedule(0);
		}));
		this._register(editor.onDidChangeModelContent((e) => {
			if (!this.editor.hasModel()) {
				return;
			}
			this.computeLinks.schedule(this.debounceInformation.get(this.editor.getModel()));
		}));
		this._register(editor.onDidChangeModel((e) => {
			this.currentOccurrences = {};
			this.activeLinkDecorationId = null;
			this.stop();
			this.computeLinks.schedule(0);
		}));
		this._register(editor.onDidChangeModelLanguage((e) => {
			this.stop();
			this.computeLinks.schedule(0);
		}));
		this._register(this.providers.onDidChange((e) => {
			this.stop();
			this.computeLinks.schedule(0);
		}));

		this.computeLinks.schedule(0);
	}

	private async computeLinksNow(): Promise<void> {
		if (!this.editor.hasModel() || !this.editor.getOption(EditorOption.links)) {
			return;
		}

		const model = this.editor.getModel();

		if (model.isTooLargeForSyncing()) {
			return;
		}

		if (!this.providers.has(model)) {
			return;
		}

		if (this.activeLinksList) {
			this.activeLinksList.dispose();
			this.activeLinksList = null;
		}

		this.computePromise = createCancelablePromise(token => getLinks(this.providers, model, token));
		try {
			const sw = new StopWatch(false);
			this.activeLinksList = await this.computePromise;
			this.debounceInformation.update(model, sw.elapsed());
			if (model.isDisposed()) {
				return;
			}
			this.updateDecorations(this.activeLinksList.links);
		} catch (err) {
			onUnexpectedError(err);
		} finally {
			this.computePromise = null;
		}
	}

	private updateDecorations(links: Link[]): void {
		const useMetaKey = (this.editor.getOption(EditorOption.multiCursorModifier) === 'altKey');
		const oldDecorations: string[] = [];
		const keys = Object.keys(this.currentOccurrences);
		for (const decorationId of keys) {
			const occurence = this.currentOccurrences[decorationId];
			oldDecorations.push(occurence.decorationId);
		}

		const newDecorations: IModelDeltaDecoration[] = [];
		if (links) {
			// Not sure why this is sometimes null
			for (const link of links) {
				newDecorations.push(LinkOccurrence.decoration(link, useMetaKey));
			}
		}

		this.editor.changeDecorations((changeAccessor) => {
			const decorations = changeAccessor.deltaDecorations(oldDecorations, newDecorations);

			this.currentOccurrences = {};
			this.activeLinkDecorationId = null;
			for (let i = 0, len = decorations.length; i < len; i++) {
				const occurence = new LinkOccurrence(links[i], decorations[i]);
				this.currentOccurrences[occurence.decorationId] = occurence;
			}
		});
	}

	private _onEditorMouseMove(mouseEvent: ClickLinkMouseEvent, withKey: ClickLinkKeyboardEvent | null): void {
		const useMetaKey = (this.editor.getOption(EditorOption.multiCursorModifier) === 'altKey');
		if (this.isEnabled(mouseEvent, withKey)) {
			this.cleanUpActiveLinkDecoration(); // always remove previous link decoration as their can only be one
			const occurrence = this.getLinkOccurrence(mouseEvent.target.position);
			if (occurrence) {
				this.editor.changeDecorations((changeAccessor) => {
					occurrence.activate(changeAccessor, useMetaKey);
					this.activeLinkDecorationId = occurrence.decorationId;
				});
			}
		} else {
			this.cleanUpActiveLinkDecoration();
		}
	}

	private cleanUpActiveLinkDecoration(): void {
		const useMetaKey = (this.editor.getOption(EditorOption.multiCursorModifier) === 'altKey');
		if (this.activeLinkDecorationId) {
			const occurrence = this.currentOccurrences[this.activeLinkDecorationId];
			if (occurrence) {
				this.editor.changeDecorations((changeAccessor) => {
					occurrence.deactivate(changeAccessor, useMetaKey);
				});
			}

			this.activeLinkDecorationId = null;
		}
	}

	private onEditorMouseUp(mouseEvent: ClickLinkMouseEvent): void {
		if (!this.isEnabled(mouseEvent)) {
			return;
		}
		const occurrence = this.getLinkOccurrence(mouseEvent.target.position);
		if (!occurrence) {
			return;
		}
		this.openLinkOccurrence(occurrence, mouseEvent.hasSideBySideModifier, true /* from user gesture */);
	}

	public openLinkOccurrence(occurrence: LinkOccurrence, openToSide: boolean, fromUserGesture = false): void {

		if (!this.openerService) {
			return;
		}

		const { link } = occurrence;

		link.resolve(CancellationToken.None).then(uri => {

			// Support for relative file URIs of the shape file://./relativeFile.txt or file:///./relativeFile.txt
			if (typeof uri === 'string' && this.editor.hasModel()) {
				const modelUri = this.editor.getModel().uri;
				if (modelUri.scheme === Schemas.file && uri.startsWith(`${Schemas.file}:`)) {
					const parsedUri = URI.parse(uri);
					if (parsedUri.scheme === Schemas.file) {
						const fsPath = resources.originalFSPath(parsedUri);

						let relativePath: string | null = null;
						if (fsPath.startsWith('/./') || fsPath.startsWith('\\.\\')) {
							relativePath = `.${fsPath.substr(1)}`;
						} else if (fsPath.startsWith('//./') || fsPath.startsWith('\\\\.\\')) {
							relativePath = `.${fsPath.substr(2)}`;
						}

						if (relativePath) {
							uri = resources.joinPath(modelUri, relativePath);
						}
					}
				}
			}

			return this.openerService.open(uri, { openToSide, fromUserGesture, allowContributedOpeners: true, allowCommands: true, fromWorkspace: true });

		}, err => {
			const messageOrError =
				err instanceof Error ? err.message : err;
			// different error cases
			if (messageOrError === 'invalid') {
				this.notificationService.warn(nls.localize('invalid.url', 'Failed to open this link because it is not well-formed: {0}', link.url!.toString()));
			} else if (messageOrError === 'missing') {
				this.notificationService.warn(nls.localize('missing.url', 'Failed to open this link because its target is missing.'));
			} else {
				onUnexpectedError(err);
			}
		});
	}

	public getLinkOccurrence(position: Position | null): LinkOccurrence | null {
		if (!this.editor.hasModel() || !position) {
			return null;
		}
		const decorations = this.editor.getModel().getDecorationsInRange({
			startLineNumber: position.lineNumber,
			startColumn: position.column,
			endLineNumber: position.lineNumber,
			endColumn: position.column
		}, 0, true);

		for (const decoration of decorations) {
			const currentOccurrence = this.currentOccurrences[decoration.id];
			if (currentOccurrence) {
				return currentOccurrence;
			}
		}

		return null;
	}

	private isEnabled(mouseEvent: ClickLinkMouseEvent, withKey?: ClickLinkKeyboardEvent | null): boolean {
		return Boolean(
			(mouseEvent.target.type === MouseTargetType.CONTENT_TEXT)
			&& ((mouseEvent.hasTriggerModifier || (withKey && withKey.keyCodeIsTriggerKey)) || mouseEvent.isMiddleClick && mouseEvent.mouseMiddleClickAction === 'openLink')
		);
	}

	private stop(): void {
		this.computeLinks.cancel();
		if (this.activeLinksList) {
			this.activeLinksList?.dispose();
			this.activeLinksList = null;
		}
		if (this.computePromise) {
			this.computePromise.cancel();
			this.computePromise = null;
		}
	}

	public override dispose(): void {
		super.dispose();
		this.stop();
	}
}

const decoration = {
	general: ModelDecorationOptions.register({
		description: 'detected-link',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		collapseOnReplaceEdit: true,
		inlineClassName: 'detected-link'
	}),
	active: ModelDecorationOptions.register({
		description: 'detected-link-active',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		collapseOnReplaceEdit: true,
		inlineClassName: 'detected-link-active'
	})
};

class LinkOccurrence {

	public static decoration(link: Link, useMetaKey: boolean): IModelDeltaDecoration {
		return {
			range: link.range,
			options: LinkOccurrence._getOptions(link, useMetaKey, false)
		};
	}

	private static _getOptions(link: Link, useMetaKey: boolean, isActive: boolean): ModelDecorationOptions {
		const options = { ... (isActive ? decoration.active : decoration.general) };
		options.hoverMessage = getHoverMessage(link, useMetaKey);
		return options;
	}

	public decorationId: string;
	public link: Link;

	constructor(link: Link, decorationId: string) {
		this.link = link;
		this.decorationId = decorationId;
	}

	public activate(changeAccessor: IModelDecorationsChangeAccessor, useMetaKey: boolean): void {
		changeAccessor.changeDecorationOptions(this.decorationId, LinkOccurrence._getOptions(this.link, useMetaKey, true));
	}

	public deactivate(changeAccessor: IModelDecorationsChangeAccessor, useMetaKey: boolean): void {
		changeAccessor.changeDecorationOptions(this.decorationId, LinkOccurrence._getOptions(this.link, useMetaKey, false));
	}
}

function getHoverMessage(link: Link, useMetaKey: boolean): MarkdownString {
	const executeCmd = link.url && /^command:/i.test(link.url.toString());

	const label = link.tooltip
		? link.tooltip
		: executeCmd
			? nls.localize('links.navigate.executeCmd', 'Execute command')
			: nls.localize('links.navigate.follow', 'Follow link');

	const kb = useMetaKey
		? platform.isMacintosh
			? nls.localize('links.navigate.kb.meta.mac', "cmd + click")
			: nls.localize('links.navigate.kb.meta', "ctrl + click")
		: platform.isMacintosh
			? nls.localize('links.navigate.kb.alt.mac', "option + click")
			: nls.localize('links.navigate.kb.alt', "alt + click");

	if (link.url) {
		let nativeLabel = '';
		if (/^command:/i.test(link.url.toString())) {
			// Don't show complete command arguments in the native tooltip
			const match = link.url.toString().match(/^command:([^?#]+)/);
			if (match) {
				const commandId = match[1];
				nativeLabel = nls.localize('tooltip.explanation', "Execute command {0}", commandId);
			}
		}
		const hoverMessage = new MarkdownString('', true)
			.appendLink(link.url.toString(true).replace(/ /g, '%20'), label, nativeLabel)
			.appendMarkdown(` (${kb})`);
		return hoverMessage;
	} else {
		return new MarkdownString().appendText(`${label} (${kb})`);
	}
}

class OpenLinkAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.openLink',
			label: nls.localize2('label', "Open Link"),
			precondition: undefined
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const linkDetector = LinkDetector.get(editor);
		if (!linkDetector) {
			return;
		}
		if (!editor.hasModel()) {
			return;
		}

		const selections = editor.getSelections();
		for (const sel of selections) {
			const link = linkDetector.getLinkOccurrence(sel.getEndPosition());
			if (link) {
				linkDetector.openLinkOccurrence(link, false);
			}
		}
	}
}

registerEditorContribution(LinkDetector.ID, LinkDetector, EditorContributionInstantiation.AfterFirstRender);
registerEditorAction(OpenLinkAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/longLinesHelper/browser/longLinesHelper.ts]---
Location: vscode-main/src/vs/editor/contrib/longLinesHelper/browser/longLinesHelper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor, MouseTargetType } from '../../../browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IEditorContribution } from '../../../common/editorCommon.js';

class LongLinesHelper extends Disposable implements IEditorContribution {
	public static readonly ID = 'editor.contrib.longLinesHelper';

	public static get(editor: ICodeEditor): LongLinesHelper | null {
		return editor.getContribution<LongLinesHelper>(LongLinesHelper.ID);
	}

	constructor(
		private readonly _editor: ICodeEditor,
	) {
		super();

		this._register(this._editor.onMouseDown((e) => {
			const stopRenderingLineAfter = this._editor.getOption(EditorOption.stopRenderingLineAfter);
			if (stopRenderingLineAfter >= 0 && e.target.type === MouseTargetType.CONTENT_TEXT && e.target.position.column >= stopRenderingLineAfter) {
				this._editor.updateOptions({
					stopRenderingLineAfter: -1
				});
			}
		}));
	}
}

registerEditorContribution(LongLinesHelper.ID, LongLinesHelper, EditorContributionInstantiation.BeforeFirstInteraction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/message/browser/messageController.css]---
Location: vscode-main/src/vs/editor/contrib/message/browser/messageController.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .monaco-editor-overlaymessage {
	padding-bottom: 8px;
	z-index: 10000;
}

.monaco-editor .monaco-editor-overlaymessage.below {
	padding-bottom: 0;
	padding-top: 8px;
	z-index: 10000;
}

@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}
.monaco-editor .monaco-editor-overlaymessage.fadeIn {
	animation: fadeIn 150ms ease-out;
}

@keyframes fadeOut {
	from { opacity: 1; }
	to { opacity: 0; }
}
.monaco-editor .monaco-editor-overlaymessage.fadeOut {
	animation: fadeOut 100ms ease-out;
}

.monaco-editor .monaco-editor-overlaymessage .message {
	padding: 2px 4px;
	color: var(--vscode-editorHoverWidget-foreground);
	background-color: var(--vscode-editorHoverWidget-background);
	border: 1px solid var(--vscode-inputValidation-infoBorder);
	border-radius: 3px;
}

.monaco-editor .monaco-editor-overlaymessage .message p {
	margin-block: 0px;
}

.monaco-editor .monaco-editor-overlaymessage .message a {
	color: var(--vscode-textLink-foreground);
}

.monaco-editor .monaco-editor-overlaymessage .message a:hover {
	color: var(--vscode-textLink-activeForeground);
}

.monaco-editor.hc-black .monaco-editor-overlaymessage .message,
.monaco-editor.hc-light .monaco-editor-overlaymessage .message {
	border-width: 2px;
}

.monaco-editor .monaco-editor-overlaymessage .anchor {
	width: 0 !important;
	height: 0 !important;
	border-color: transparent;
	border-style: solid;
	z-index: 1000;
	border-width: 8px;
	position: absolute;
	left: 2px;
}

.monaco-editor .monaco-editor-overlaymessage .anchor.top {
	border-bottom-color: var(--vscode-inputValidation-infoBorder);
}

.monaco-editor .monaco-editor-overlaymessage .anchor.below {
	border-top-color: var(--vscode-inputValidation-infoBorder);
}

.monaco-editor .monaco-editor-overlaymessage:not(.below) .anchor.top,
.monaco-editor .monaco-editor-overlaymessage.below .anchor.below {
	display: none;
}

.monaco-editor .monaco-editor-overlaymessage.below .anchor.top {
	display: inherit;
	top: -8px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/message/browser/messageController.ts]---
Location: vscode-main/src/vs/editor/contrib/message/browser/messageController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { renderMarkdown } from '../../../../base/browser/markdownRenderer.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { Event } from '../../../../base/common/event.js';
import { IMarkdownString, isMarkdownString } from '../../../../base/common/htmlContent.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { DisposableStore, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import './messageController.css';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition } from '../../../browser/editorBrowser.js';
import { EditorCommand, EditorContributionInstantiation, registerEditorCommand, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { IPosition } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { IEditorContribution, ScrollType } from '../../../common/editorCommon.js';
import { PositionAffinity } from '../../../common/model.js';
import { openLinkFromMarkdown } from '../../../../platform/markdown/browser/markdownRenderer.js';
import * as nls from '../../../../nls.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import * as dom from '../../../../base/browser/dom.js';

export class MessageController implements IEditorContribution {

	public static readonly ID = 'editor.contrib.messageController';

	static readonly MESSAGE_VISIBLE = new RawContextKey<boolean>('messageVisible', false, nls.localize('messageVisible', 'Whether the editor is currently showing an inline message'));

	static get(editor: ICodeEditor): MessageController | null {
		return editor.getContribution<MessageController>(MessageController.ID);
	}

	private readonly _editor: ICodeEditor;
	private readonly _visible: IContextKey<boolean>;
	private readonly _messageWidget = new MutableDisposable<MessageWidget>();
	private readonly _messageListeners = new DisposableStore();
	private _mouseOverMessage: boolean = false;

	constructor(
		editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IOpenerService private readonly _openerService: IOpenerService
	) {

		this._editor = editor;
		this._visible = MessageController.MESSAGE_VISIBLE.bindTo(contextKeyService);
	}

	dispose(): void {
		this._messageListeners.dispose();
		this._messageWidget.dispose();
		this._visible.reset();
	}

	isVisible() {
		return this._visible.get();
	}

	showMessage(message: IMarkdownString | string, position: IPosition): void {

		alert(isMarkdownString(message) ? message.value : message);

		this._visible.set(true);
		this._messageWidget.clear();
		this._messageListeners.clear();

		if (isMarkdownString(message)) {
			const renderedMessage = this._messageListeners.add(renderMarkdown(message, {
				actionHandler: (url, mdStr) => {
					this.closeMessage();
					openLinkFromMarkdown(this._openerService, url, mdStr.isTrusted);
				},
			}));
			this._messageWidget.value = new MessageWidget(this._editor, position, renderedMessage.element);
		} else {
			this._messageWidget.value = new MessageWidget(this._editor, position, message);
		}

		// close on blur (debounced to allow to tab into the message), cursor, model change, dispose
		this._messageListeners.add(Event.debounce(this._editor.onDidBlurEditorText, (last, event) => event, 0)(() => {
			if (this._mouseOverMessage) {
				return; // override when mouse over message
			}

			if (this._messageWidget.value && dom.isAncestor(dom.getActiveElement(), this._messageWidget.value.getDomNode())) {
				return; // override when focus is inside the message
			}

			this.closeMessage();
		}
		));
		this._messageListeners.add(this._editor.onDidChangeCursorPosition(() => this.closeMessage()));
		this._messageListeners.add(this._editor.onDidDispose(() => this.closeMessage()));
		this._messageListeners.add(this._editor.onDidChangeModel(() => this.closeMessage()));
		this._messageListeners.add(dom.addDisposableListener(this._messageWidget.value.getDomNode(), dom.EventType.MOUSE_ENTER, () => this._mouseOverMessage = true, true));
		this._messageListeners.add(dom.addDisposableListener(this._messageWidget.value.getDomNode(), dom.EventType.MOUSE_LEAVE, () => this._mouseOverMessage = false, true));

		// close on mouse move
		let bounds: Range;
		this._messageListeners.add(this._editor.onMouseMove(e => {
			// outside the text area
			if (!e.target.position) {
				return;
			}

			if (!bounds) {
				// define bounding box around position and first mouse occurance
				bounds = new Range(position.lineNumber - 3, 1, e.target.position.lineNumber + 3, 1);
			} else if (!bounds.containsPosition(e.target.position)) {
				// check if position is still in bounds
				this.closeMessage();
			}
		}));
	}

	closeMessage(): void {
		this._visible.reset();
		this._messageListeners.clear();
		if (this._messageWidget.value) {
			this._messageListeners.add(MessageWidget.fadeOut(this._messageWidget.value));
		}
	}
}

const MessageCommand = EditorCommand.bindToContribution<MessageController>(MessageController.get);


registerEditorCommand(new MessageCommand({
	id: 'leaveEditorMessage',
	precondition: MessageController.MESSAGE_VISIBLE,
	handler: c => c.closeMessage(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 30,
		primary: KeyCode.Escape
	}
}));

class MessageWidget implements IContentWidget {

	// Editor.IContentWidget.allowEditorOverflow
	readonly allowEditorOverflow = true;
	readonly suppressMouseDown = false;

	private readonly _editor: ICodeEditor;
	private readonly _position: IPosition;
	private readonly _domNode: HTMLDivElement;

	static fadeOut(messageWidget: MessageWidget): IDisposable {
		const dispose = () => {
			messageWidget.dispose();
			clearTimeout(handle);
			messageWidget.getDomNode().removeEventListener('animationend', dispose);
		};
		const handle = setTimeout(dispose, 110);
		messageWidget.getDomNode().addEventListener('animationend', dispose);
		messageWidget.getDomNode().classList.add('fadeOut');
		return { dispose };
	}

	constructor(editor: ICodeEditor, { lineNumber, column }: IPosition, text: HTMLElement | string) {

		this._editor = editor;
		this._editor.revealLinesInCenterIfOutsideViewport(lineNumber, lineNumber, ScrollType.Smooth);
		this._position = { lineNumber, column };

		this._domNode = document.createElement('div');
		this._domNode.classList.add('monaco-editor-overlaymessage');
		this._domNode.style.marginLeft = '-6px';

		const anchorTop = document.createElement('div');
		anchorTop.classList.add('anchor', 'top');
		this._domNode.appendChild(anchorTop);

		const message = document.createElement('div');
		if (typeof text === 'string') {
			message.classList.add('message');
			message.textContent = text;
		} else {
			text.classList.add('message');
			message.appendChild(text);
		}
		this._domNode.appendChild(message);

		const anchorBottom = document.createElement('div');
		anchorBottom.classList.add('anchor', 'below');
		this._domNode.appendChild(anchorBottom);

		this._editor.addContentWidget(this);
		this._domNode.classList.add('fadeIn');
	}

	dispose() {
		this._editor.removeContentWidget(this);
	}

	getId(): string {
		return 'messageoverlay';
	}

	getDomNode(): HTMLElement {
		return this._domNode;
	}

	getPosition(): IContentWidgetPosition {
		return {
			position: this._position,
			preference: [
				ContentWidgetPositionPreference.ABOVE,
				ContentWidgetPositionPreference.BELOW,
			],
			positionAffinity: PositionAffinity.Right,
		};
	}

	afterRender(position: ContentWidgetPositionPreference | null): void {
		this._domNode.classList.toggle('below', position === ContentWidgetPositionPreference.BELOW);
	}

}

registerEditorContribution(MessageController.ID, MessageController, EditorContributionInstantiation.Lazy);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/middleScroll/browser/middleScroll.contribution.ts]---
Location: vscode-main/src/vs/editor/contrib/middleScroll/browser/middleScroll.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorContributionInstantiation, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { MiddleScrollController } from './middleScrollController.js';

registerEditorContribution(MiddleScrollController.ID, MiddleScrollController, EditorContributionInstantiation.BeforeFirstInteraction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/middleScroll/browser/middleScroll.css]---
Location: vscode-main/src/vs/editor/contrib/middleScroll/browser/middleScroll.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor {
	.scroll-editor-on-middle-click-dot {
		cursor: all-scroll;
		position: absolute;
		z-index: 1;
		background-color: var(--vscode-editor-foreground, white);
		border: 1px solid var(--vscode-editor-background, black);
		opacity: 0.5;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		transform: translate(-50%, -50%);

		&.hidden {
			display: none;
		}
	}

	&.scroll-editor-on-middle-click-editor * {
		cursor: all-scroll;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/middleScroll/browser/middleScrollController.ts]---
Location: vscode-main/src/vs/editor/contrib/middleScroll/browser/middleScrollController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getWindow, addDisposableListener, n } from '../../../../base/browser/dom.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { IEditorContribution, INewScrollPosition } from '../../../common/editorCommon.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { autorun, derived, disposableObservableValue, IObservable, observableValue } from '../../../../base/common/observable.js';
import { observableCodeEditor } from '../../../browser/observableCodeEditor.js';
import { Point } from '../../../common/core/2d/point.js';
import { AnimationFrameScheduler } from '../../inlineCompletions/browser/model/animation.js';
import { appendRemoveOnDispose } from '../../../browser/widget/diffEditor/utils.js';
import './middleScroll.css';

export class MiddleScrollController extends Disposable implements IEditorContribution {
	public static readonly ID = 'editor.contrib.middleScroll';

	static get(editor: ICodeEditor): MiddleScrollController | null {
		return editor.getContribution<MiddleScrollController>(MiddleScrollController.ID);
	}

	constructor(
		private readonly _editor: ICodeEditor
	) {
		super();

		const obsEditor = observableCodeEditor(this._editor);
		const scrollOnMiddleClick = obsEditor.getOption(EditorOption.scrollOnMiddleClick);

		this._register(autorun(reader => {
			if (!scrollOnMiddleClick.read(reader)) {
				return;
			}
			const editorDomNode = obsEditor.domNode.read(reader);
			if (!editorDomNode) {
				return;
			}

			const scrollingSession = reader.store.add(
				disposableObservableValue(
					'scrollingSession',
					undefined as undefined | { mouseDeltaAfterThreshold: IObservable<Point>; initialMousePosInEditor: Point; didScroll: boolean } & IDisposable
				)
			);

			reader.store.add(this._editor.onMouseDown(e => {
				const session = scrollingSession.read(undefined);
				if (session) {
					scrollingSession.set(undefined, undefined);
					return;
				}

				if (!e.event.middleButton) {
					return;
				}
				e.event.stopPropagation();
				e.event.preventDefault();

				const store = new DisposableStore();
				const initialPos = new Point(e.event.posx, e.event.posy);
				const mousePos = observeWindowMousePos(getWindow(editorDomNode), initialPos, store);
				const mouseDeltaAfterThreshold = mousePos.map(v => v.subtract(initialPos).withThreshold(5));

				const editorDomNodeRect = editorDomNode.getBoundingClientRect();
				const initialMousePosInEditor = new Point(initialPos.x - editorDomNodeRect.left, initialPos.y - editorDomNodeRect.top);

				scrollingSession.set({
					mouseDeltaAfterThreshold,
					initialMousePosInEditor,
					didScroll: false,
					dispose: () => store.dispose(),
				}, undefined);

				store.add(this._editor.onMouseUp(e => {
					const session = scrollingSession.read(undefined);
					if (session && session.didScroll) {
						// Only cancel session on release if the user scrolled during it
						scrollingSession.set(undefined, undefined);
					}
				}));

				store.add(this._editor.onKeyDown(e => {
					scrollingSession.set(undefined, undefined);
				}));
			}));

			reader.store.add(autorun(reader => {
				const session = scrollingSession.read(reader);
				if (!session) {
					return;
				}

				let lastTime = Date.now();
				reader.store.add(autorun(reader => {
					AnimationFrameScheduler.instance.invalidateOnNextAnimationFrame(reader);

					const curTime = Date.now();
					const frameDurationMs = curTime - lastTime;
					lastTime = curTime;

					const mouseDelta = session.mouseDeltaAfterThreshold.read(undefined);

					// scroll by mouse delta every 32ms
					const factor = frameDurationMs / 32;
					const scrollDelta = mouseDelta.scale(factor);

					const scrollPos = new Point(this._editor.getScrollLeft(), this._editor.getScrollTop());
					this._editor.setScrollPosition(toScrollPosition(scrollPos.add(scrollDelta)));
					if (!scrollDelta.isZero()) {
						session.didScroll = true;
					}
				}));

				const directionAttr = derived(reader => {
					const delta = session.mouseDeltaAfterThreshold.read(reader);
					let direction: string = '';
					direction += (delta.y < 0 ? 'n' : (delta.y > 0 ? 's' : ''));
					direction += (delta.x < 0 ? 'w' : (delta.x > 0 ? 'e' : ''));
					return direction;
				});
				reader.store.add(autorun(reader => {
					editorDomNode.setAttribute('data-scroll-direction', directionAttr.read(reader));
				}));
			}));

			const dotDomElem = reader.store.add(n.div({
				class: ['scroll-editor-on-middle-click-dot', scrollingSession.map(session => session ? '' : 'hidden')],
				style: {
					left: scrollingSession.map((session) => session ? session.initialMousePosInEditor.x : 0),
					top: scrollingSession.map((session) => session ? session.initialMousePosInEditor.y : 0),
				}
			}).toDisposableLiveElement());
			reader.store.add(appendRemoveOnDispose(editorDomNode, dotDomElem.element));

			reader.store.add(autorun(reader => {
				const session = scrollingSession.read(reader);
				editorDomNode.classList.toggle('scroll-editor-on-middle-click-editor', !!session);
			}));
		}));
	}
}

function observeWindowMousePos(window: Window, initialPos: Point, store: DisposableStore): IObservable<Point> {
	const val = observableValue('pos', initialPos);
	store.add(addDisposableListener(window, 'mousemove', (e: MouseEvent) => {
		val.set(new Point(e.pageX, e.pageY), undefined);
	}));
	return val;
}

function toScrollPosition(p: Point): INewScrollPosition {
	return {
		scrollLeft: p.x,
		scrollTop: p.y,
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/multicursor/browser/multicursor.ts]---
Location: vscode-main/src/vs/editor/contrib/multicursor/browser/multicursor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { status } from '../../../../base/browser/ui/aria/aria.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { Constants } from '../../../../base/common/uint.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, registerEditorAction, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { CursorState } from '../../../common/cursorCommon.js';
import { CursorChangeReason, ICursorSelectionChangedEvent } from '../../../common/cursorEvents.js';
import { CursorMoveCommands } from '../../../common/cursor/cursorMoveCommands.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { IEditorContribution, IEditorDecorationsCollection, ScrollType } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { FindMatch, ITextModel } from '../../../common/model.js';
import { CommonFindController } from '../../find/browser/findController.js';
import { FindOptionOverride, INewFindReplaceState } from '../../find/browser/findState.js';
import * as nls from '../../../../nls.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { getSelectionHighlightDecorationOptions } from '../../wordHighlighter/browser/highlightDecorations.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';

function announceCursorChange(previousCursorState: CursorState[], cursorState: CursorState[]): void {
	const cursorDiff = cursorState.filter(cs => !previousCursorState.find(pcs => pcs.equals(cs)));
	if (cursorDiff.length >= 1) {
		const cursorPositions = cursorDiff.map(cs => `line ${cs.viewState.position.lineNumber} column ${cs.viewState.position.column}`).join(', ');
		const msg = cursorDiff.length === 1 ? nls.localize('cursorAdded', "Cursor added: {0}", cursorPositions) : nls.localize('cursorsAdded', "Cursors added: {0}", cursorPositions);
		status(msg);
	}
}

interface InsertCursorArgs {
	source?: string;
	logicalLine?: boolean;
}

export class InsertCursorAbove extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.insertCursorAbove',
			label: nls.localize2('mutlicursor.insertAbove', "Add Cursor Above"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.UpArrow,
				linux: {
					primary: KeyMod.Shift | KeyMod.Alt | KeyCode.UpArrow,
					secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.UpArrow]
				},
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarSelectionMenu,
				group: '3_multi',
				title: nls.localize({ key: 'miInsertCursorAbove', comment: ['&& denotes a mnemonic'] }, "&&Add Cursor Above"),
				order: 2
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor, args: InsertCursorArgs): void {
		if (!editor.hasModel()) {
			return;
		}

		let useLogicalLine = true;
		if (args && args.logicalLine === false) {
			useLogicalLine = false;
		}
		const viewModel = editor._getViewModel();

		if (viewModel.cursorConfig.readOnly) {
			return;
		}

		viewModel.model.pushStackElement();
		const previousCursorState = viewModel.getCursorStates();
		viewModel.setCursorStates(
			args.source,
			CursorChangeReason.Explicit,
			CursorMoveCommands.addCursorUp(viewModel, previousCursorState, useLogicalLine)
		);
		viewModel.revealTopMostCursor(args.source);
		announceCursorChange(previousCursorState, viewModel.getCursorStates());
	}
}

export class InsertCursorBelow extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.insertCursorBelow',
			label: nls.localize2('mutlicursor.insertBelow', "Add Cursor Below"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.DownArrow,
				linux: {
					primary: KeyMod.Shift | KeyMod.Alt | KeyCode.DownArrow,
					secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.DownArrow]
				},
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarSelectionMenu,
				group: '3_multi',
				title: nls.localize({ key: 'miInsertCursorBelow', comment: ['&& denotes a mnemonic'] }, "A&&dd Cursor Below"),
				order: 3
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor, args: InsertCursorArgs): void {
		if (!editor.hasModel()) {
			return;
		}

		let useLogicalLine = true;
		if (args && args.logicalLine === false) {
			useLogicalLine = false;
		}
		const viewModel = editor._getViewModel();

		if (viewModel.cursorConfig.readOnly) {
			return;
		}

		viewModel.model.pushStackElement();
		const previousCursorState = viewModel.getCursorStates();
		viewModel.setCursorStates(
			args.source,
			CursorChangeReason.Explicit,
			CursorMoveCommands.addCursorDown(viewModel, previousCursorState, useLogicalLine)
		);
		viewModel.revealBottomMostCursor(args.source);
		announceCursorChange(previousCursorState, viewModel.getCursorStates());
	}
}

class InsertCursorAtEndOfEachLineSelected extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.insertCursorAtEndOfEachLineSelected',
			label: nls.localize2('mutlicursor.insertAtEndOfEachLineSelected', "Add Cursors to Line Ends"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KeyI,
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarSelectionMenu,
				group: '3_multi',
				title: nls.localize({ key: 'miInsertCursorAtEndOfEachLineSelected', comment: ['&& denotes a mnemonic'] }, "Add C&&ursors to Line Ends"),
				order: 4
			}
		});
	}

	private getCursorsForSelection(selection: Selection, model: ITextModel, result: Selection[]): void {
		if (selection.isEmpty()) {
			return;
		}

		for (let i = selection.startLineNumber; i < selection.endLineNumber; i++) {
			const currentLineMaxColumn = model.getLineMaxColumn(i);
			result.push(new Selection(i, currentLineMaxColumn, i, currentLineMaxColumn));
		}
		if (selection.endColumn > 1) {
			result.push(new Selection(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn));
		}
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		if (!editor.hasModel()) {
			return;
		}

		const model = editor.getModel();
		const selections = editor.getSelections();
		const viewModel = editor._getViewModel();
		const previousCursorState = viewModel.getCursorStates();
		const newSelections: Selection[] = [];
		selections.forEach((sel) => this.getCursorsForSelection(sel, model, newSelections));

		if (newSelections.length > 0) {
			editor.setSelections(newSelections);
		}
		announceCursorChange(previousCursorState, viewModel.getCursorStates());
	}
}

class InsertCursorAtEndOfLineSelected extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.addCursorsToBottom',
			label: nls.localize2('mutlicursor.addCursorsToBottom', "Add Cursors to Bottom"),
			precondition: undefined
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		if (!editor.hasModel()) {
			return;
		}

		const selections = editor.getSelections();
		const lineCount = editor.getModel().getLineCount();

		const newSelections: Selection[] = [];
		for (let i = selections[0].startLineNumber; i <= lineCount; i++) {
			newSelections.push(new Selection(i, selections[0].startColumn, i, selections[0].endColumn));
		}

		const viewModel = editor._getViewModel();
		const previousCursorState = viewModel.getCursorStates();
		if (newSelections.length > 0) {
			editor.setSelections(newSelections);
		}
		announceCursorChange(previousCursorState, viewModel.getCursorStates());
	}
}

class InsertCursorAtTopOfLineSelected extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.addCursorsToTop',
			label: nls.localize2('mutlicursor.addCursorsToTop', "Add Cursors to Top"),
			precondition: undefined
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		if (!editor.hasModel()) {
			return;
		}

		const selections = editor.getSelections();

		const newSelections: Selection[] = [];
		for (let i = selections[0].startLineNumber; i >= 1; i--) {
			newSelections.push(new Selection(i, selections[0].startColumn, i, selections[0].endColumn));
		}

		const viewModel = editor._getViewModel();
		const previousCursorState = viewModel.getCursorStates();
		if (newSelections.length > 0) {
			editor.setSelections(newSelections);
		}
		announceCursorChange(previousCursorState, viewModel.getCursorStates());
	}
}

export class MultiCursorSessionResult {
	constructor(
		public readonly selections: Selection[],
		public readonly revealRange: Range,
		public readonly revealScrollType: ScrollType
	) { }
}

export class MultiCursorSession {

	public static create(editor: ICodeEditor, findController: CommonFindController): MultiCursorSession | null {
		if (!editor.hasModel()) {
			return null;
		}
		const findState = findController.getState();

		// Find widget owns entirely what we search for if:
		//  - focus is not in the editor (i.e. it is in the find widget)
		//  - and the search widget is visible
		//  - and the search string is non-empty
		if (!editor.hasTextFocus() && findState.isRevealed && findState.searchString.length > 0) {
			// Find widget owns what is searched for
			return new MultiCursorSession(editor, findController, false, findState.searchString, findState.wholeWord, findState.matchCase, null);
		}

		// Otherwise, the selection gives the search text, and the find widget gives the search settings
		// The exception is the find state disassociation case: when beginning with a single, collapsed selection
		let isDisconnectedFromFindController = false;
		let wholeWord: boolean;
		let matchCase: boolean;
		const selections = editor.getSelections();
		if (selections.length === 1 && selections[0].isEmpty()) {
			isDisconnectedFromFindController = true;
			wholeWord = true;
			matchCase = true;
		} else {
			wholeWord = findState.wholeWord;
			matchCase = findState.matchCase;
		}

		// Selection owns what is searched for
		const s = editor.getSelection();

		let searchText: string;
		let currentMatch: Selection | null = null;

		if (s.isEmpty()) {
			// selection is empty => expand to current word
			const word = editor.getConfiguredWordAtPosition(s.getStartPosition());
			if (!word) {
				return null;
			}
			searchText = word.word;
			currentMatch = new Selection(s.startLineNumber, word.startColumn, s.startLineNumber, word.endColumn);
		} else {
			searchText = editor.getModel().getValueInRange(s).replace(/\r\n/g, '\n');
		}

		return new MultiCursorSession(editor, findController, isDisconnectedFromFindController, searchText, wholeWord, matchCase, currentMatch);
	}

	constructor(
		private readonly _editor: ICodeEditor,
		public readonly findController: CommonFindController,
		public readonly isDisconnectedFromFindController: boolean,
		public readonly searchText: string,
		public readonly wholeWord: boolean,
		public readonly matchCase: boolean,
		public currentMatch: Selection | null
	) { }

	public addSelectionToNextFindMatch(): MultiCursorSessionResult | null {
		if (!this._editor.hasModel()) {
			return null;
		}

		const nextMatch = this._getNextMatch();
		if (!nextMatch) {
			return null;
		}

		const allSelections = this._editor.getSelections();
		return new MultiCursorSessionResult(allSelections.concat(nextMatch), nextMatch, ScrollType.Smooth);
	}

	public moveSelectionToNextFindMatch(): MultiCursorSessionResult | null {
		if (!this._editor.hasModel()) {
			return null;
		}

		const nextMatch = this._getNextMatch();
		if (!nextMatch) {
			return null;
		}

		const allSelections = this._editor.getSelections();
		return new MultiCursorSessionResult(allSelections.slice(0, allSelections.length - 1).concat(nextMatch), nextMatch, ScrollType.Smooth);
	}

	private _getNextMatch(): Selection | null {
		if (!this._editor.hasModel()) {
			return null;
		}

		if (this.currentMatch) {
			const result = this.currentMatch;
			this.currentMatch = null;
			return result;
		}

		this.findController.highlightFindOptions();

		const allSelections = this._editor.getSelections();
		const lastAddedSelection = allSelections[allSelections.length - 1];
		const nextMatch = this._editor.getModel().findNextMatch(this.searchText, lastAddedSelection.getEndPosition(), false, this.matchCase, this.wholeWord ? this._editor.getOption(EditorOption.wordSeparators) : null, false);

		if (!nextMatch) {
			return null;
		}
		return new Selection(nextMatch.range.startLineNumber, nextMatch.range.startColumn, nextMatch.range.endLineNumber, nextMatch.range.endColumn);
	}

	public addSelectionToPreviousFindMatch(): MultiCursorSessionResult | null {
		if (!this._editor.hasModel()) {
			return null;
		}

		const previousMatch = this._getPreviousMatch();
		if (!previousMatch) {
			return null;
		}

		const allSelections = this._editor.getSelections();
		return new MultiCursorSessionResult(allSelections.concat(previousMatch), previousMatch, ScrollType.Smooth);
	}

	public moveSelectionToPreviousFindMatch(): MultiCursorSessionResult | null {
		if (!this._editor.hasModel()) {
			return null;
		}

		const previousMatch = this._getPreviousMatch();
		if (!previousMatch) {
			return null;
		}

		const allSelections = this._editor.getSelections();
		return new MultiCursorSessionResult(allSelections.slice(0, allSelections.length - 1).concat(previousMatch), previousMatch, ScrollType.Smooth);
	}

	private _getPreviousMatch(): Selection | null {
		if (!this._editor.hasModel()) {
			return null;
		}

		if (this.currentMatch) {
			const result = this.currentMatch;
			this.currentMatch = null;
			return result;
		}

		this.findController.highlightFindOptions();

		const allSelections = this._editor.getSelections();
		const lastAddedSelection = allSelections[allSelections.length - 1];
		const previousMatch = this._editor.getModel().findPreviousMatch(this.searchText, lastAddedSelection.getStartPosition(), false, this.matchCase, this.wholeWord ? this._editor.getOption(EditorOption.wordSeparators) : null, false);

		if (!previousMatch) {
			return null;
		}
		return new Selection(previousMatch.range.startLineNumber, previousMatch.range.startColumn, previousMatch.range.endLineNumber, previousMatch.range.endColumn);
	}

	public selectAll(searchScope: Range[] | null): FindMatch[] {
		if (!this._editor.hasModel()) {
			return [];
		}

		this.findController.highlightFindOptions();

		const editorModel = this._editor.getModel();
		if (searchScope) {
			return editorModel.findMatches(this.searchText, searchScope, false, this.matchCase, this.wholeWord ? this._editor.getOption(EditorOption.wordSeparators) : null, false, Constants.MAX_SAFE_SMALL_INTEGER);
		}
		return editorModel.findMatches(this.searchText, true, false, this.matchCase, this.wholeWord ? this._editor.getOption(EditorOption.wordSeparators) : null, false, Constants.MAX_SAFE_SMALL_INTEGER);
	}
}

export class MultiCursorSelectionController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.multiCursorController';

	private readonly _editor: ICodeEditor;
	private _ignoreSelectionChange: boolean;
	private _session: MultiCursorSession | null;
	private readonly _sessionDispose = this._register(new DisposableStore());

	public static get(editor: ICodeEditor): MultiCursorSelectionController | null {
		return editor.getContribution<MultiCursorSelectionController>(MultiCursorSelectionController.ID);
	}

	constructor(editor: ICodeEditor) {
		super();
		this._editor = editor;
		this._ignoreSelectionChange = false;
		this._session = null;
	}

	public override dispose(): void {
		this._endSession();
		super.dispose();
	}

	private _beginSessionIfNeeded(findController: CommonFindController): void {
		if (!this._session) {
			// Create a new session
			const session = MultiCursorSession.create(this._editor, findController);
			if (!session) {
				return;
			}

			this._session = session;

			const newState: INewFindReplaceState = { searchString: this._session.searchText };
			if (this._session.isDisconnectedFromFindController) {
				newState.wholeWordOverride = FindOptionOverride.True;
				newState.matchCaseOverride = FindOptionOverride.True;
				newState.isRegexOverride = FindOptionOverride.False;
			}
			findController.getState().change(newState, false);

			this._sessionDispose.add(this._editor.onDidChangeCursorSelection((e) => {
				if (this._ignoreSelectionChange) {
					return;
				}
				this._endSession();
			}));
			this._sessionDispose.add(this._editor.onDidBlurEditorText(() => {
				this._endSession();
			}));
			this._sessionDispose.add(findController.getState().onFindReplaceStateChange((e) => {
				if (e.matchCase || e.wholeWord) {
					this._endSession();
				}
			}));
		}
	}

	private _endSession(): void {
		this._sessionDispose.clear();
		if (this._session && this._session.isDisconnectedFromFindController) {
			const newState: INewFindReplaceState = {
				wholeWordOverride: FindOptionOverride.NotSet,
				matchCaseOverride: FindOptionOverride.NotSet,
				isRegexOverride: FindOptionOverride.NotSet,
			};
			this._session.findController.getState().change(newState, false);
		}
		this._session = null;
	}

	private _setSelections(selections: Selection[]): void {
		this._ignoreSelectionChange = true;
		this._editor.setSelections(selections);
		this._ignoreSelectionChange = false;
	}

	private _expandEmptyToWord(model: ITextModel, selection: Selection): Selection {
		if (!selection.isEmpty()) {
			return selection;
		}
		const word = this._editor.getConfiguredWordAtPosition(selection.getStartPosition());
		if (!word) {
			return selection;
		}
		return new Selection(selection.startLineNumber, word.startColumn, selection.startLineNumber, word.endColumn);
	}

	private _applySessionResult(result: MultiCursorSessionResult | null): void {
		if (!result) {
			return;
		}
		this._setSelections(result.selections);
		if (result.revealRange) {
			this._editor.revealRangeInCenterIfOutsideViewport(result.revealRange, result.revealScrollType);
		}
	}

	public getSession(findController: CommonFindController): MultiCursorSession | null {
		return this._session;
	}

	public addSelectionToNextFindMatch(findController: CommonFindController): void {
		if (!this._editor.hasModel()) {
			return;
		}
		if (!this._session) {
			// If there are multiple cursors, handle the case where they do not all select the same text.
			const allSelections = this._editor.getSelections();
			if (allSelections.length > 1) {
				const findState = findController.getState();
				const matchCase = findState.matchCase;
				const selectionsContainSameText = modelRangesContainSameText(this._editor.getModel(), allSelections, matchCase);
				if (!selectionsContainSameText) {
					const model = this._editor.getModel();
					const resultingSelections: Selection[] = [];
					for (let i = 0, len = allSelections.length; i < len; i++) {
						resultingSelections[i] = this._expandEmptyToWord(model, allSelections[i]);
					}
					this._editor.setSelections(resultingSelections);
					return;
				}
			}
		}
		this._beginSessionIfNeeded(findController);
		if (this._session) {
			this._applySessionResult(this._session.addSelectionToNextFindMatch());
		}
	}

	public addSelectionToPreviousFindMatch(findController: CommonFindController): void {
		this._beginSessionIfNeeded(findController);
		if (this._session) {
			this._applySessionResult(this._session.addSelectionToPreviousFindMatch());
		}
	}

	public moveSelectionToNextFindMatch(findController: CommonFindController): void {
		this._beginSessionIfNeeded(findController);
		if (this._session) {
			this._applySessionResult(this._session.moveSelectionToNextFindMatch());
		}
	}

	public moveSelectionToPreviousFindMatch(findController: CommonFindController): void {
		this._beginSessionIfNeeded(findController);
		if (this._session) {
			this._applySessionResult(this._session.moveSelectionToPreviousFindMatch());
		}
	}

	public selectAll(findController: CommonFindController): void {
		if (!this._editor.hasModel()) {
			return;
		}

		let matches: FindMatch[] | null = null;

		const findState = findController.getState();

		// Special case: find widget owns entirely what we search for if:
		// - focus is not in the editor (i.e. it is in the find widget)
		// - and the search widget is visible
		// - and the search string is non-empty
		// - and we're searching for a regex
		if (findState.isRevealed && findState.searchString.length > 0 && findState.isRegex) {
			const editorModel = this._editor.getModel();
			if (findState.searchScope) {
				matches = editorModel.findMatches(findState.searchString, findState.searchScope, findState.isRegex, findState.matchCase, findState.wholeWord ? this._editor.getOption(EditorOption.wordSeparators) : null, false, Constants.MAX_SAFE_SMALL_INTEGER);
			} else {
				matches = editorModel.findMatches(findState.searchString, true, findState.isRegex, findState.matchCase, findState.wholeWord ? this._editor.getOption(EditorOption.wordSeparators) : null, false, Constants.MAX_SAFE_SMALL_INTEGER);
			}
		} else {

			this._beginSessionIfNeeded(findController);
			if (!this._session) {
				return;
			}

			matches = this._session.selectAll(findState.searchScope);
		}

		if (matches.length > 0) {
			const editorSelection = this._editor.getSelection();
			// Have the primary cursor remain the one where the action was invoked
			for (let i = 0, len = matches.length; i < len; i++) {
				const match = matches[i];
				const intersection = match.range.intersectRanges(editorSelection);
				if (intersection) {
					// bingo!
					matches[i] = matches[0];
					matches[0] = match;
					break;
				}
			}

			this._setSelections(matches.map(m => new Selection(m.range.startLineNumber, m.range.startColumn, m.range.endLineNumber, m.range.endColumn)));
		}
	}

	public selectAllUsingSelections(selections: Selection[]): void {
		if (selections.length > 0) {
			this._setSelections(selections);
		}
	}
}

export abstract class MultiCursorSelectionControllerAction extends EditorAction {

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const multiCursorController = MultiCursorSelectionController.get(editor);
		if (!multiCursorController) {
			return;
		}
		const viewModel = editor._getViewModel();
		if (viewModel) {
			const previousCursorState = viewModel.getCursorStates();
			const findController = CommonFindController.get(editor);
			if (findController) {
				this._run(multiCursorController, findController);
			} else {
				const newFindController = accessor.get(IInstantiationService).createInstance(CommonFindController, editor);
				this._run(multiCursorController, newFindController);
				newFindController.dispose();
			}

			announceCursorChange(previousCursorState, viewModel.getCursorStates());
		}
	}

	protected abstract _run(multiCursorController: MultiCursorSelectionController, findController: CommonFindController): void;
}

export class AddSelectionToNextFindMatchAction extends MultiCursorSelectionControllerAction {
	constructor() {
		super({
			id: 'editor.action.addSelectionToNextFindMatch',
			label: nls.localize2('addSelectionToNextFindMatch', "Add Selection to Next Find Match"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: KeyMod.CtrlCmd | KeyCode.KeyD,
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarSelectionMenu,
				group: '3_multi',
				title: nls.localize({ key: 'miAddSelectionToNextFindMatch', comment: ['&& denotes a mnemonic'] }, "Add &&Next Occurrence"),
				order: 5
			}
		});
	}
	protected _run(multiCursorController: MultiCursorSelectionController, findController: CommonFindController): void {
		multiCursorController.addSelectionToNextFindMatch(findController);
	}
}

export class AddSelectionToPreviousFindMatchAction extends MultiCursorSelectionControllerAction {
	constructor() {
		super({
			id: 'editor.action.addSelectionToPreviousFindMatch',
			label: nls.localize2('addSelectionToPreviousFindMatch', "Add Selection to Previous Find Match"),
			precondition: undefined,
			menuOpts: {
				menuId: MenuId.MenubarSelectionMenu,
				group: '3_multi',
				title: nls.localize({ key: 'miAddSelectionToPreviousFindMatch', comment: ['&& denotes a mnemonic'] }, "Add P&&revious Occurrence"),
				order: 6
			}
		});
	}
	protected _run(multiCursorController: MultiCursorSelectionController, findController: CommonFindController): void {
		multiCursorController.addSelectionToPreviousFindMatch(findController);
	}
}

export class MoveSelectionToNextFindMatchAction extends MultiCursorSelectionControllerAction {
	constructor() {
		super({
			id: 'editor.action.moveSelectionToNextFindMatch',
			label: nls.localize2('moveSelectionToNextFindMatch', "Move Last Selection to Next Find Match"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyD),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}
	protected _run(multiCursorController: MultiCursorSelectionController, findController: CommonFindController): void {
		multiCursorController.moveSelectionToNextFindMatch(findController);
	}
}

export class MoveSelectionToPreviousFindMatchAction extends MultiCursorSelectionControllerAction {
	constructor() {
		super({
			id: 'editor.action.moveSelectionToPreviousFindMatch',
			label: nls.localize2('moveSelectionToPreviousFindMatch', "Move Last Selection to Previous Find Match"),
			precondition: undefined
		});
	}
	protected _run(multiCursorController: MultiCursorSelectionController, findController: CommonFindController): void {
		multiCursorController.moveSelectionToPreviousFindMatch(findController);
	}
}

export class SelectHighlightsAction extends MultiCursorSelectionControllerAction {
	constructor() {
		super({
			id: 'editor.action.selectHighlights',
			label: nls.localize2('selectAllOccurrencesOfFindMatch', "Select All Occurrences of Find Match"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyL,
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarSelectionMenu,
				group: '3_multi',
				title: nls.localize({ key: 'miSelectHighlights', comment: ['&& denotes a mnemonic'] }, "Select All &&Occurrences"),
				order: 7
			}
		});
	}
	protected _run(multiCursorController: MultiCursorSelectionController, findController: CommonFindController): void {
		multiCursorController.selectAll(findController);
	}
}

export class CompatChangeAll extends MultiCursorSelectionControllerAction {
	constructor() {
		super({
			id: 'editor.action.changeAll',
			label: nls.localize2('changeAll.label', "Change All Occurrences"),
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.editorTextFocus),
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyCode.F2,
				weight: KeybindingWeight.EditorContrib
			},
			contextMenuOpts: {
				group: '1_modification',
				order: 1.2
			}
		});
	}
	protected _run(multiCursorController: MultiCursorSelectionController, findController: CommonFindController): void {
		multiCursorController.selectAll(findController);
	}
}

class SelectionHighlighterState {
	private readonly _modelVersionId: number;
	private _cachedFindMatches: Range[] | null = null;

	constructor(
		private readonly _model: ITextModel,
		private readonly _searchText: string,
		private readonly _matchCase: boolean,
		private readonly _wordSeparators: string | null,
		prevState: SelectionHighlighterState | null
	) {
		this._modelVersionId = this._model.getVersionId();
		if (prevState
			&& this._model === prevState._model
			&& this._searchText === prevState._searchText
			&& this._matchCase === prevState._matchCase
			&& this._wordSeparators === prevState._wordSeparators
			&& this._modelVersionId === prevState._modelVersionId
		) {
			this._cachedFindMatches = prevState._cachedFindMatches;
		}
	}

	public findMatches(): Range[] {
		if (this._cachedFindMatches === null) {
			this._cachedFindMatches = this._model.findMatches(this._searchText, true, false, this._matchCase, this._wordSeparators, false).map(m => m.range);
			this._cachedFindMatches.sort(Range.compareRangesUsingStarts);
		}
		return this._cachedFindMatches;
	}
}

export class SelectionHighlighter extends Disposable implements IEditorContribution {
	public static readonly ID = 'editor.contrib.selectionHighlighter';

	private readonly editor: ICodeEditor;
	private _isEnabled: boolean;
	private _isEnabledMultiline: boolean;
	private _maxLength: number;
	private readonly _decorations: IEditorDecorationsCollection;
	private readonly updateSoon: RunOnceScheduler;
	private state: SelectionHighlighterState | null;

	constructor(
		editor: ICodeEditor,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService
	) {
		super();
		this.editor = editor;
		this._isEnabled = editor.getOption(EditorOption.selectionHighlight);
		this._isEnabledMultiline = editor.getOption(EditorOption.selectionHighlightMultiline);
		this._maxLength = editor.getOption(EditorOption.selectionHighlightMaxLength);
		this._decorations = editor.createDecorationsCollection();
		this.updateSoon = this._register(new RunOnceScheduler(() => this._update(), 300));
		this.state = null;

		this._register(editor.onDidChangeConfiguration((e) => {
			this._isEnabled = editor.getOption(EditorOption.selectionHighlight);
			this._isEnabledMultiline = editor.getOption(EditorOption.selectionHighlightMultiline);
			this._maxLength = editor.getOption(EditorOption.selectionHighlightMaxLength);
		}));
		this._register(editor.onDidChangeCursorSelection((e: ICursorSelectionChangedEvent) => {

			if (!this._isEnabled) {
				// Early exit if nothing needs to be done!
				// Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
				return;
			}

			if (e.selection.isEmpty()) {
				if (e.reason === CursorChangeReason.Explicit) {
					if (this.state) {
						// no longer valid
						this._setState(null);
					}
					this.updateSoon.schedule();
				} else {
					this._setState(null);
				}
			} else {
				this._update();
			}
		}));
		this._register(editor.onDidChangeModel((e) => {
			this._setState(null);
		}));
		this._register(editor.onDidChangeModelContent((e) => {
			if (this._isEnabled) {
				this.updateSoon.schedule();
			}
		}));
		const findController = CommonFindController.get(editor);
		if (findController) {
			this._register(findController.getState().onFindReplaceStateChange((e) => {
				this._update();
			}));
		}
		this.updateSoon.schedule();
	}

	private _update(): void {
		this._setState(SelectionHighlighter._createState(this.state, this._isEnabled, this._isEnabledMultiline, this._maxLength, this.editor));
	}

	private static _createState(oldState: SelectionHighlighterState | null, isEnabled: boolean, isEnabledMultiline: boolean, maxLength: number, editor: ICodeEditor): SelectionHighlighterState | null {
		if (!isEnabled) {
			return null;
		}
		if (!editor.hasModel()) {
			return null;
		}
		if (!isEnabledMultiline) {
			const s = editor.getSelection();
			if (s.startLineNumber !== s.endLineNumber) {
				// multiline forbidden for perf reasons
				return null;
			}
		}
		const multiCursorController = MultiCursorSelectionController.get(editor);
		if (!multiCursorController) {
			return null;
		}
		const findController = CommonFindController.get(editor);
		if (!findController) {
			return null;
		}
		let r = multiCursorController.getSession(findController);
		if (!r) {
			const allSelections = editor.getSelections();
			if (allSelections.length > 1) {
				const findState = findController.getState();
				const matchCase = findState.matchCase;
				const selectionsContainSameText = modelRangesContainSameText(editor.getModel(), allSelections, matchCase);
				if (!selectionsContainSameText) {
					return null;
				}
			}

			r = MultiCursorSession.create(editor, findController);
		}
		if (!r) {
			return null;
		}

		if (r.currentMatch) {
			// This is an empty selection
			// Do not interfere with semantic word highlighting in the no selection case
			return null;
		}
		if (/^[ \t]+$/.test(r.searchText)) {
			// whitespace only selection
			return null;
		}
		if (maxLength > 0 && r.searchText.length > maxLength) {
			// very long selection
			return null;
		}

		// TODO: better handling of this case
		const findState = findController.getState();
		const caseSensitive = findState.matchCase;

		// Return early if the find widget shows the exact same matches
		if (findState.isRevealed) {
			let findStateSearchString = findState.searchString;
			if (!caseSensitive) {
				findStateSearchString = findStateSearchString.toLowerCase();
			}

			let mySearchString = r.searchText;
			if (!caseSensitive) {
				mySearchString = mySearchString.toLowerCase();
			}

			if (findStateSearchString === mySearchString && r.matchCase === findState.matchCase && r.wholeWord === findState.wholeWord && !findState.isRegex) {
				return null;
			}
		}

		return new SelectionHighlighterState(editor.getModel(), r.searchText, r.matchCase, r.wholeWord ? editor.getOption(EditorOption.wordSeparators) : null, oldState);
	}

	private _setState(newState: SelectionHighlighterState | null): void {
		this.state = newState;

		if (!this.state) {
			this._decorations.clear();
			return;
		}

		if (!this.editor.hasModel()) {
			return;
		}

		const model = this.editor.getModel();
		if (model.isTooLargeForTokenization()) {
			// the file is too large, so searching word under cursor in the whole document would be blocking the UI.
			return;
		}

		const allMatches = this.state.findMatches();

		const selections = this.editor.getSelections();
		selections.sort(Range.compareRangesUsingStarts);

		// do not overlap with selection (issue #64 and #512)
		const matches: Range[] = [];
		for (let i = 0, j = 0, len = allMatches.length, lenJ = selections.length; i < len;) {
			const match = allMatches[i];

			if (j >= lenJ) {
				// finished all editor selections
				matches.push(match);
				i++;
			} else {
				const cmp = Range.compareRangesUsingStarts(match, selections[j]);
				if (cmp < 0) {
					// match is before sel
					if (selections[j].isEmpty() || !Range.areIntersecting(match, selections[j])) {
						matches.push(match);
					}
					i++;
				} else if (cmp > 0) {
					// sel is before match
					j++;
				} else {
					// sel is equal to match
					i++;
					j++;
				}
			}
		}

		const occurrenceHighlighting: boolean = this.editor.getOption(EditorOption.occurrencesHighlight) !== 'off';
		const hasSemanticHighlights = this._languageFeaturesService.documentHighlightProvider.has(model) && occurrenceHighlighting;
		const decorations = matches.map(r => {
			return {
				range: r,
				options: getSelectionHighlightDecorationOptions(hasSemanticHighlights)
			};
		});

		this._decorations.set(decorations);
	}

	public override dispose(): void {
		this._setState(null);
		super.dispose();
	}
}

function modelRangesContainSameText(model: ITextModel, ranges: Range[], matchCase: boolean): boolean {
	const selectedText = getValueInRange(model, ranges[0], !matchCase);
	for (let i = 1, len = ranges.length; i < len; i++) {
		const range = ranges[i];
		if (range.isEmpty()) {
			return false;
		}
		const thisSelectedText = getValueInRange(model, range, !matchCase);
		if (selectedText !== thisSelectedText) {
			return false;
		}
	}
	return true;
}

function getValueInRange(model: ITextModel, range: Range, toLowerCase: boolean): string {
	const text = model.getValueInRange(range);
	return (toLowerCase ? text.toLowerCase() : text);
}

interface FocusCursorArgs {
	source?: string;
}

export class FocusNextCursor extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.focusNextCursor',
			label: nls.localize2('mutlicursor.focusNextCursor', "Focus Next Cursor"),
			metadata: {
				description: nls.localize('mutlicursor.focusNextCursor.description', "Focuses the next cursor"),
				args: [],
			},
			precondition: undefined
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor, args: FocusCursorArgs): void {
		if (!editor.hasModel()) {
			return;
		}

		const viewModel = editor._getViewModel();

		if (viewModel.cursorConfig.readOnly) {
			return;
		}

		viewModel.model.pushStackElement();
		const previousCursorState = Array.from(viewModel.getCursorStates());
		const firstCursor = previousCursorState.shift();
		if (!firstCursor) {
			return;
		}
		previousCursorState.push(firstCursor);

		viewModel.setCursorStates(args.source, CursorChangeReason.Explicit, previousCursorState);
		viewModel.revealPrimaryCursor(args.source, true);
		announceCursorChange(previousCursorState, viewModel.getCursorStates());
	}
}

export class FocusPreviousCursor extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.focusPreviousCursor',
			label: nls.localize2('mutlicursor.focusPreviousCursor', "Focus Previous Cursor"),
			metadata: {
				description: nls.localize('mutlicursor.focusPreviousCursor.description', "Focuses the previous cursor"),
				args: [],
			},
			precondition: undefined
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor, args: FocusCursorArgs): void {
		if (!editor.hasModel()) {
			return;
		}

		const viewModel = editor._getViewModel();

		if (viewModel.cursorConfig.readOnly) {
			return;
		}

		viewModel.model.pushStackElement();
		const previousCursorState = Array.from(viewModel.getCursorStates());
		const firstCursor = previousCursorState.pop();
		if (!firstCursor) {
			return;
		}
		previousCursorState.unshift(firstCursor);

		viewModel.setCursorStates(args.source, CursorChangeReason.Explicit, previousCursorState);
		viewModel.revealPrimaryCursor(args.source, true);
		announceCursorChange(previousCursorState, viewModel.getCursorStates());
	}
}

registerEditorContribution(MultiCursorSelectionController.ID, MultiCursorSelectionController, EditorContributionInstantiation.Lazy);
registerEditorContribution(SelectionHighlighter.ID, SelectionHighlighter, EditorContributionInstantiation.AfterFirstRender);

registerEditorAction(InsertCursorAbove);
registerEditorAction(InsertCursorBelow);
registerEditorAction(InsertCursorAtEndOfEachLineSelected);
registerEditorAction(AddSelectionToNextFindMatchAction);
registerEditorAction(AddSelectionToPreviousFindMatchAction);
registerEditorAction(MoveSelectionToNextFindMatchAction);
registerEditorAction(MoveSelectionToPreviousFindMatchAction);
registerEditorAction(SelectHighlightsAction);
registerEditorAction(CompatChangeAll);
registerEditorAction(InsertCursorAtEndOfLineSelected);
registerEditorAction(InsertCursorAtTopOfLineSelected);
registerEditorAction(FocusNextCursor);
registerEditorAction(FocusPreviousCursor);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/multicursor/test/browser/multicursor.test.ts]---
Location: vscode-main/src/vs/editor/contrib/multicursor/test/browser/multicursor.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../common/core/range.js';
import { Selection } from '../../../../common/core/selection.js';
import { Handler } from '../../../../common/editorCommon.js';
import { EndOfLineSequence } from '../../../../common/model.js';
import { CommonFindController } from '../../../find/browser/findController.js';
import { AddSelectionToNextFindMatchAction, InsertCursorAbove, InsertCursorBelow, MultiCursorSelectionController, SelectHighlightsAction } from '../../browser/multicursor.js';
import { ITestCodeEditor, withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { IStorageService, InMemoryStorageService } from '../../../../../platform/storage/common/storage.js';

suite('Multicursor', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #26393: Multiple cursors + Word wrap', () => {
		withTestCodeEditor([
			'a'.repeat(20),
			'a'.repeat(20),
		], { wordWrap: 'wordWrapColumn', wordWrapColumn: 10 }, (editor, viewModel) => {
			const addCursorDownAction = new InsertCursorBelow();
			addCursorDownAction.run(null!, editor, {});

			assert.strictEqual(viewModel.getCursorStates().length, 2);

			assert.strictEqual(viewModel.getCursorStates()[0].viewState.position.lineNumber, 1);
			assert.strictEqual(viewModel.getCursorStates()[1].viewState.position.lineNumber, 3);

			editor.setPosition({ lineNumber: 4, column: 1 });
			const addCursorUpAction = new InsertCursorAbove();
			addCursorUpAction.run(null!, editor, {});

			assert.strictEqual(viewModel.getCursorStates().length, 2);

			assert.strictEqual(viewModel.getCursorStates()[0].viewState.position.lineNumber, 4);
			assert.strictEqual(viewModel.getCursorStates()[1].viewState.position.lineNumber, 2);
		});
	});

	test('issue #2205: Multi-cursor pastes in reverse order', () => {
		withTestCodeEditor([
			'abc',
			'def'
		], {}, (editor, viewModel) => {
			const addCursorUpAction = new InsertCursorAbove();

			editor.setSelection(new Selection(2, 1, 2, 1));
			addCursorUpAction.run(null!, editor, {});
			assert.strictEqual(viewModel.getSelections().length, 2);

			editor.trigger('test', Handler.Paste, {
				text: '1\n2',
				multicursorText: [
					'1',
					'2'
				]
			});

			assert.strictEqual(editor.getModel()!.getLineContent(1), '1abc');
			assert.strictEqual(editor.getModel()!.getLineContent(2), '2def');
		});
	});

	test('issue #1336: Insert cursor below on last line adds a cursor to the end of the current line', () => {
		withTestCodeEditor([
			'abc'
		], {}, (editor, viewModel) => {
			const addCursorDownAction = new InsertCursorBelow();
			addCursorDownAction.run(null!, editor, {});
			assert.strictEqual(viewModel.getSelections().length, 1);
		});
	});

});

function fromRange(rng: Range): number[] {
	return [rng.startLineNumber, rng.startColumn, rng.endLineNumber, rng.endColumn];
}

suite('Multicursor selection', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	const serviceCollection = new ServiceCollection();
	serviceCollection.set(IStorageService, new InMemoryStorageService());

	test('issue #8817: Cursor position changes when you cancel multicursor', () => {
		withTestCodeEditor([
			'var x = (3 * 5)',
			'var y = (3 * 5)',
			'var z = (3 * 5)',
		], { serviceCollection: serviceCollection }, (editor) => {

			const findController = editor.registerAndInstantiateContribution(CommonFindController.ID, CommonFindController);
			const multiCursorSelectController = editor.registerAndInstantiateContribution(MultiCursorSelectionController.ID, MultiCursorSelectionController);
			const selectHighlightsAction = new SelectHighlightsAction();

			editor.setSelection(new Selection(2, 9, 2, 16));

			selectHighlightsAction.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections()!.map(fromRange), [
				[2, 9, 2, 16],
				[1, 9, 1, 16],
				[3, 9, 3, 16],
			]);

			editor.trigger('test', 'removeSecondaryCursors', null);

			assert.deepStrictEqual(fromRange(editor.getSelection()!), [2, 9, 2, 16]);

			multiCursorSelectController.dispose();
			findController.dispose();
		});
	});

	test('issue #5400: "Select All Occurrences of Find Match" does not select all if find uses regex', () => {
		withTestCodeEditor([
			'something',
			'someething',
			'someeething',
			'nothing'
		], { serviceCollection: serviceCollection }, (editor) => {

			const findController = editor.registerAndInstantiateContribution(CommonFindController.ID, CommonFindController);
			const multiCursorSelectController = editor.registerAndInstantiateContribution(MultiCursorSelectionController.ID, MultiCursorSelectionController);
			const selectHighlightsAction = new SelectHighlightsAction();

			editor.setSelection(new Selection(1, 1, 1, 1));
			findController.getState().change({ searchString: 'some+thing', isRegex: true, isRevealed: true }, false);

			selectHighlightsAction.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections()!.map(fromRange), [
				[1, 1, 1, 10],
				[2, 1, 2, 11],
				[3, 1, 3, 12],
			]);

			assert.strictEqual(findController.getState().searchString, 'some+thing');

			multiCursorSelectController.dispose();
			findController.dispose();
		});
	});

	test('AddSelectionToNextFindMatchAction can work with multiline', () => {
		withTestCodeEditor([
			'',
			'qwe',
			'rty',
			'',
			'qwe',
			'',
			'rty',
			'qwe',
			'rty'
		], { serviceCollection: serviceCollection }, (editor) => {

			const findController = editor.registerAndInstantiateContribution(CommonFindController.ID, CommonFindController);
			const multiCursorSelectController = editor.registerAndInstantiateContribution(MultiCursorSelectionController.ID, MultiCursorSelectionController);
			const addSelectionToNextFindMatch = new AddSelectionToNextFindMatchAction();

			editor.setSelection(new Selection(2, 1, 3, 4));

			addSelectionToNextFindMatch.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections()!.map(fromRange), [
				[2, 1, 3, 4],
				[8, 1, 9, 4]
			]);

			editor.trigger('test', 'removeSecondaryCursors', null);

			assert.deepStrictEqual(fromRange(editor.getSelection()!), [2, 1, 3, 4]);

			multiCursorSelectController.dispose();
			findController.dispose();
		});
	});

	test('issue #6661: AddSelectionToNextFindMatchAction can work with touching ranges', () => {
		withTestCodeEditor([
			'abcabc',
			'abc',
			'abcabc',
		], { serviceCollection: serviceCollection }, (editor) => {

			const findController = editor.registerAndInstantiateContribution(CommonFindController.ID, CommonFindController);
			const multiCursorSelectController = editor.registerAndInstantiateContribution(MultiCursorSelectionController.ID, MultiCursorSelectionController);
			const addSelectionToNextFindMatch = new AddSelectionToNextFindMatchAction();

			editor.setSelection(new Selection(1, 1, 1, 4));

			addSelectionToNextFindMatch.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections()!.map(fromRange), [
				[1, 1, 1, 4],
				[1, 4, 1, 7]
			]);

			addSelectionToNextFindMatch.run(null!, editor);
			addSelectionToNextFindMatch.run(null!, editor);
			addSelectionToNextFindMatch.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections()!.map(fromRange), [
				[1, 1, 1, 4],
				[1, 4, 1, 7],
				[2, 1, 2, 4],
				[3, 1, 3, 4],
				[3, 4, 3, 7]
			]);

			editor.trigger('test', Handler.Type, { text: 'z' });
			assert.deepStrictEqual(editor.getSelections()!.map(fromRange), [
				[1, 2, 1, 2],
				[1, 3, 1, 3],
				[2, 2, 2, 2],
				[3, 2, 3, 2],
				[3, 3, 3, 3]
			]);
			assert.strictEqual(editor.getValue(), [
				'zz',
				'z',
				'zz',
			].join('\n'));

			multiCursorSelectController.dispose();
			findController.dispose();
		});
	});

	test('issue #23541: Multiline Ctrl+D does not work in CRLF files', () => {
		withTestCodeEditor([
			'',
			'qwe',
			'rty',
			'',
			'qwe',
			'',
			'rty',
			'qwe',
			'rty'
		], { serviceCollection: serviceCollection }, (editor) => {

			editor.getModel()!.setEOL(EndOfLineSequence.CRLF);

			const findController = editor.registerAndInstantiateContribution(CommonFindController.ID, CommonFindController);
			const multiCursorSelectController = editor.registerAndInstantiateContribution(MultiCursorSelectionController.ID, MultiCursorSelectionController);
			const addSelectionToNextFindMatch = new AddSelectionToNextFindMatchAction();

			editor.setSelection(new Selection(2, 1, 3, 4));

			addSelectionToNextFindMatch.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections()!.map(fromRange), [
				[2, 1, 3, 4],
				[8, 1, 9, 4]
			]);

			editor.trigger('test', 'removeSecondaryCursors', null);

			assert.deepStrictEqual(fromRange(editor.getSelection()!), [2, 1, 3, 4]);

			multiCursorSelectController.dispose();
			findController.dispose();
		});
	});

	function testMulticursor(text: string[], callback: (editor: ITestCodeEditor, findController: CommonFindController) => void): void {
		withTestCodeEditor(text, { serviceCollection: serviceCollection }, (editor) => {
			const findController = editor.registerAndInstantiateContribution(CommonFindController.ID, CommonFindController);
			const multiCursorSelectController = editor.registerAndInstantiateContribution(MultiCursorSelectionController.ID, MultiCursorSelectionController);

			callback(editor, findController);

			multiCursorSelectController.dispose();
			findController.dispose();
		});
	}

	function testAddSelectionToNextFindMatchAction(text: string[], callback: (editor: ITestCodeEditor, action: AddSelectionToNextFindMatchAction, findController: CommonFindController) => void): void {
		testMulticursor(text, (editor, findController) => {
			const action = new AddSelectionToNextFindMatchAction();
			callback(editor, action, findController);
		});
	}

	test('AddSelectionToNextFindMatchAction starting with single collapsed selection', () => {
		const text = [
			'abc pizza',
			'abc house',
			'abc bar'
		];
		testAddSelectionToNextFindMatchAction(text, (editor, action, findController) => {
			editor.setSelections([
				new Selection(1, 2, 1, 2),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 4),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 4),
				new Selection(2, 1, 2, 4),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 4),
				new Selection(2, 1, 2, 4),
				new Selection(3, 1, 3, 4),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 4),
				new Selection(2, 1, 2, 4),
				new Selection(3, 1, 3, 4),
			]);
		});
	});

	test('AddSelectionToNextFindMatchAction starting with two selections, one being collapsed 1)', () => {
		const text = [
			'abc pizza',
			'abc house',
			'abc bar'
		];
		testAddSelectionToNextFindMatchAction(text, (editor, action, findController) => {
			editor.setSelections([
				new Selection(1, 1, 1, 4),
				new Selection(2, 2, 2, 2),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 4),
				new Selection(2, 1, 2, 4),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 4),
				new Selection(2, 1, 2, 4),
				new Selection(3, 1, 3, 4),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 4),
				new Selection(2, 1, 2, 4),
				new Selection(3, 1, 3, 4),
			]);
		});
	});

	test('AddSelectionToNextFindMatchAction starting with two selections, one being collapsed 2)', () => {
		const text = [
			'abc pizza',
			'abc house',
			'abc bar'
		];
		testAddSelectionToNextFindMatchAction(text, (editor, action, findController) => {
			editor.setSelections([
				new Selection(1, 2, 1, 2),
				new Selection(2, 1, 2, 4),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 4),
				new Selection(2, 1, 2, 4),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 4),
				new Selection(2, 1, 2, 4),
				new Selection(3, 1, 3, 4),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 4),
				new Selection(2, 1, 2, 4),
				new Selection(3, 1, 3, 4),
			]);
		});
	});

	test('AddSelectionToNextFindMatchAction starting with all collapsed selections', () => {
		const text = [
			'abc pizza',
			'abc house',
			'abc bar'
		];
		testAddSelectionToNextFindMatchAction(text, (editor, action, findController) => {
			editor.setSelections([
				new Selection(1, 2, 1, 2),
				new Selection(2, 2, 2, 2),
				new Selection(3, 1, 3, 1),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 4),
				new Selection(2, 1, 2, 4),
				new Selection(3, 1, 3, 4),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 4),
				new Selection(2, 1, 2, 4),
				new Selection(3, 1, 3, 4),
			]);
		});
	});

	test('AddSelectionToNextFindMatchAction starting with all collapsed selections on different words', () => {
		const text = [
			'abc pizza',
			'abc house',
			'abc bar'
		];
		testAddSelectionToNextFindMatchAction(text, (editor, action, findController) => {
			editor.setSelections([
				new Selection(1, 6, 1, 6),
				new Selection(2, 6, 2, 6),
				new Selection(3, 6, 3, 6),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 5, 1, 10),
				new Selection(2, 5, 2, 10),
				new Selection(3, 5, 3, 8),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 5, 1, 10),
				new Selection(2, 5, 2, 10),
				new Selection(3, 5, 3, 8),
			]);
		});
	});

	test('issue #20651: AddSelectionToNextFindMatchAction case insensitive', () => {
		const text = [
			'test',
			'testte',
			'Test',
			'testte',
			'test'
		];
		testAddSelectionToNextFindMatchAction(text, (editor, action, findController) => {
			editor.setSelections([
				new Selection(1, 1, 1, 5),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 5),
				new Selection(2, 1, 2, 5),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 5),
				new Selection(2, 1, 2, 5),
				new Selection(3, 1, 3, 5),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 5),
				new Selection(2, 1, 2, 5),
				new Selection(3, 1, 3, 5),
				new Selection(4, 1, 4, 5),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 5),
				new Selection(2, 1, 2, 5),
				new Selection(3, 1, 3, 5),
				new Selection(4, 1, 4, 5),
				new Selection(5, 1, 5, 5),
			]);

			action.run(null!, editor);
			assert.deepStrictEqual(editor.getSelections(), [
				new Selection(1, 1, 1, 5),
				new Selection(2, 1, 2, 5),
				new Selection(3, 1, 3, 5),
				new Selection(4, 1, 4, 5),
				new Selection(5, 1, 5, 5),
			]);
		});
	});

	suite('Find state disassociation', () => {

		const text = [
			'app',
			'apples',
			'whatsapp',
			'app',
			'App',
			' app'
		];

		test('enters mode', () => {
			testAddSelectionToNextFindMatchAction(text, (editor, action, findController) => {
				editor.setSelections([
					new Selection(1, 2, 1, 2),
				]);

				action.run(null!, editor);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 1, 1, 4),
				]);

				action.run(null!, editor);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 1, 1, 4),
					new Selection(4, 1, 4, 4),
				]);

				action.run(null!, editor);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 1, 1, 4),
					new Selection(4, 1, 4, 4),
					new Selection(6, 2, 6, 5),
				]);
			});
		});

		test('leaves mode when selection changes', () => {
			testAddSelectionToNextFindMatchAction(text, (editor, action, findController) => {
				editor.setSelections([
					new Selection(1, 2, 1, 2),
				]);

				action.run(null!, editor);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 1, 1, 4),
				]);

				action.run(null!, editor);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 1, 1, 4),
					new Selection(4, 1, 4, 4),
				]);

				// change selection
				editor.setSelections([
					new Selection(1, 1, 1, 4),
				]);

				action.run(null!, editor);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 1, 1, 4),
					new Selection(2, 1, 2, 4),
				]);
			});
		});

		test('Select Highlights respects mode ', () => {
			testMulticursor(text, (editor, findController) => {
				const action = new SelectHighlightsAction();
				editor.setSelections([
					new Selection(1, 2, 1, 2),
				]);

				action.run(null!, editor);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 1, 1, 4),
					new Selection(4, 1, 4, 4),
					new Selection(6, 2, 6, 5),
				]);

				action.run(null!, editor);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 1, 1, 4),
					new Selection(4, 1, 4, 4),
					new Selection(6, 2, 6, 5),
				]);
			});
		});

	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/parameterHints/browser/parameterHints.css]---
Location: vscode-main/src/vs/editor/contrib/parameterHints/browser/parameterHints.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .parameter-hints-widget {
	/* Must be higher than the sash's z-index and terminal canvases but lower than the suggest widget */
	z-index: 39;
	display: flex;
	flex-direction: column;
	line-height: 1.5em;
	cursor: default;
	color: var(--vscode-editorHoverWidget-foreground);
	background-color: var(--vscode-editorHoverWidget-background);
	border: 1px solid var(--vscode-editorHoverWidget-border);
}

.hc-black .monaco-editor .parameter-hints-widget,
.hc-light .monaco-editor .parameter-hints-widget {
	border-width: 2px;
}

.monaco-editor .parameter-hints-widget > .phwrapper {
	max-width: 440px;
	display: flex;
	flex-direction: row;
}

.monaco-editor .parameter-hints-widget.multiple {
	min-height: 3.3em;
	padding: 0;
}

.monaco-editor .parameter-hints-widget.multiple .body::before {
	content: "";
	display: block;
	height: 100%;
	position: absolute;
	opacity: 0.5;
	border-left: 1px solid var(--vscode-editorHoverWidget-border);
}

.monaco-editor .parameter-hints-widget p,
.monaco-editor .parameter-hints-widget ul {
	margin: 8px 0;
}

.monaco-editor .parameter-hints-widget .monaco-scrollable-element,
.monaco-editor .parameter-hints-widget .body {
	display: flex;
	flex: 1;
	flex-direction: column;
	min-height: 100%;
}

.monaco-editor .parameter-hints-widget .signature {
	padding: 4px 5px;
	position: relative;
}

.monaco-editor .parameter-hints-widget .signature.has-docs::after {
	content: "";
	display: block;
	position: absolute;
	left: 0;
	width: 100%;
	padding-top: 4px;
	opacity: 0.5;
	border-bottom: 1px solid var(--vscode-editorHoverWidget-border);
}

.monaco-editor .parameter-hints-widget .code {
	font-family: var(--vscode-parameterHintsWidget-editorFontFamily), var(--vscode-parameterHintsWidget-editorFontFamilyDefault);
}

.monaco-editor .parameter-hints-widget .docs {
	padding: 0 10px 0 5px;
	white-space: pre-wrap;
}

.monaco-editor .parameter-hints-widget .docs.empty {
	display: none;
}

.monaco-editor .parameter-hints-widget .docs a {
	color: var(--vscode-textLink-foreground);
}

.monaco-editor .parameter-hints-widget .docs a:hover {
	color: var(--vscode-textLink-activeForeground);
	cursor: pointer;
}

.monaco-editor .parameter-hints-widget .docs .markdown-docs {
	white-space: initial;
}

.monaco-editor .parameter-hints-widget .docs code {
	font-family: var(--monaco-monospace-font);
	border-radius: 3px;
	padding: 0 0.4em;
	background-color: var(--vscode-textCodeBlock-background);
}

.monaco-editor .parameter-hints-widget .docs .monaco-tokenized-source,
.monaco-editor .parameter-hints-widget .docs .code {
	white-space: pre-wrap;
}

.monaco-editor .parameter-hints-widget .controls {
	display: none;
	flex-direction: column;
	align-items: center;
	min-width: 22px;
	justify-content: flex-end;
}

.monaco-editor .parameter-hints-widget.multiple .controls {
	display: flex;
	padding: 0 2px;
}

.monaco-editor .parameter-hints-widget.multiple .button {
	width: 16px;
	height: 16px;
	background-repeat: no-repeat;
	cursor: pointer;
}

.monaco-editor .parameter-hints-widget .button.previous {
	bottom: 24px;
}

.monaco-editor .parameter-hints-widget .overloads {
	text-align: center;
	height: 12px;
	line-height: 12px;
	font-family: var(--monaco-monospace-font);
}

.monaco-editor .parameter-hints-widget .signature .parameter.active {
	color: var(--vscode-editorHoverWidget-highlightForeground);
	font-weight: bold;
}

.monaco-editor .parameter-hints-widget .documentation-parameter > .parameter {
	font-weight: bold;
	margin-right: 0.5em;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/parameterHints/browser/parameterHints.ts]---
Location: vscode-main/src/vs/editor/contrib/parameterHints/browser/parameterHints.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorCommand, EditorContributionInstantiation, registerEditorAction, registerEditorCommand, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import * as languages from '../../../common/languages.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { ParameterHintsModel, TriggerContext } from './parameterHintsModel.js';
import { Context } from './provideSignatureHelp.js';
import * as nls from '../../../../nls.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ParameterHintsWidget } from './parameterHintsWidget.js';

export class ParameterHintsController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.controller.parameterHints';

	public static get(editor: ICodeEditor): ParameterHintsController | null {
		return editor.getContribution<ParameterHintsController>(ParameterHintsController.ID);
	}

	private readonly editor: ICodeEditor;
	private readonly model: ParameterHintsModel;
	private readonly widget: Lazy<ParameterHintsWidget>;

	constructor(
		editor: ICodeEditor,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
	) {
		super();

		this.editor = editor;

		this.model = this._register(new ParameterHintsModel(editor, languageFeaturesService.signatureHelpProvider));

		this._register(this.model.onChangedHints(newParameterHints => {
			if (newParameterHints) {
				this.widget.value.show();
				this.widget.value.render(newParameterHints);
			} else {
				this.widget.rawValue?.hide();
			}
		}));

		this.widget = new Lazy(() => this._register(instantiationService.createInstance(ParameterHintsWidget, this.editor, this.model)));
	}

	cancel(): void {
		this.model.cancel();
	}

	previous(): void {
		this.widget.rawValue?.previous();
	}

	next(): void {
		this.widget.rawValue?.next();
	}

	trigger(context: TriggerContext): void {
		this.model.trigger(context, 0);
	}
}

export class TriggerParameterHintsAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.triggerParameterHints',
			label: nls.localize2('parameterHints.trigger.label', "Trigger Parameter Hints"),
			precondition: EditorContextKeys.hasSignatureHelpProvider,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Space,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const controller = ParameterHintsController.get(editor);
		controller?.trigger({
			triggerKind: languages.SignatureHelpTriggerKind.Invoke
		});
	}
}

registerEditorContribution(ParameterHintsController.ID, ParameterHintsController, EditorContributionInstantiation.BeforeFirstInteraction);
registerEditorAction(TriggerParameterHintsAction);

const weight = KeybindingWeight.EditorContrib + 75;

const ParameterHintsCommand = EditorCommand.bindToContribution<ParameterHintsController>(ParameterHintsController.get);

registerEditorCommand(new ParameterHintsCommand({
	id: 'closeParameterHints',
	precondition: Context.Visible,
	handler: x => x.cancel(),
	kbOpts: {
		weight: weight,
		kbExpr: EditorContextKeys.focus,
		primary: KeyCode.Escape,
		secondary: [KeyMod.Shift | KeyCode.Escape]
	}
}));

registerEditorCommand(new ParameterHintsCommand({
	id: 'showPrevParameterHint',
	precondition: ContextKeyExpr.and(Context.Visible, Context.MultipleSignatures),
	handler: x => x.previous(),
	kbOpts: {
		weight: weight,
		kbExpr: EditorContextKeys.focus,
		primary: KeyCode.UpArrow,
		secondary: [KeyMod.Alt | KeyCode.UpArrow],
		mac: { primary: KeyCode.UpArrow, secondary: [KeyMod.Alt | KeyCode.UpArrow, KeyMod.WinCtrl | KeyCode.KeyP] }
	}
}));

registerEditorCommand(new ParameterHintsCommand({
	id: 'showNextParameterHint',
	precondition: ContextKeyExpr.and(Context.Visible, Context.MultipleSignatures),
	handler: x => x.next(),
	kbOpts: {
		weight: weight,
		kbExpr: EditorContextKeys.focus,
		primary: KeyCode.DownArrow,
		secondary: [KeyMod.Alt | KeyCode.DownArrow],
		mac: { primary: KeyCode.DownArrow, secondary: [KeyMod.Alt | KeyCode.DownArrow, KeyMod.WinCtrl | KeyCode.KeyN] }
	}
}));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/parameterHints/browser/parameterHintsModel.ts]---
Location: vscode-main/src/vs/editor/contrib/parameterHints/browser/parameterHintsModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise, createCancelablePromise, Delayer } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { CharacterSet } from '../../../common/core/characterClassifier.js';
import { ICursorSelectionChangedEvent } from '../../../common/cursorEvents.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import * as languages from '../../../common/languages.js';
import { provideSignatureHelp } from './provideSignatureHelp.js';

export interface TriggerContext {
	readonly triggerKind: languages.SignatureHelpTriggerKind;
	readonly triggerCharacter?: string;
}

namespace ParameterHintState {
	export const enum Type {
		Default,
		Active,
		Pending,
	}

	export const Default = { type: Type.Default } as const;

	export class Pending {
		readonly type = Type.Pending;
		constructor(
			readonly request: CancelablePromise<languages.SignatureHelpResult | undefined | null>,
			readonly previouslyActiveHints: languages.SignatureHelp | undefined,
		) { }
	}

	export class Active {
		readonly type = Type.Active;
		constructor(
			readonly hints: languages.SignatureHelp
		) { }
	}

	export type State = typeof Default | Pending | Active;
}

export class ParameterHintsModel extends Disposable {

	private static readonly DEFAULT_DELAY = 120; // ms

	private readonly _onChangedHints = this._register(new Emitter<languages.SignatureHelp | undefined>());
	public readonly onChangedHints = this._onChangedHints.event;

	private readonly editor: ICodeEditor;
	private readonly providers: LanguageFeatureRegistry<languages.SignatureHelpProvider>;

	private triggerOnType = false;
	private _state: ParameterHintState.State = ParameterHintState.Default;
	private _pendingTriggers: TriggerContext[] = [];

	private readonly _lastSignatureHelpResult = this._register(new MutableDisposable<languages.SignatureHelpResult>());
	private readonly triggerChars = new CharacterSet();
	private readonly retriggerChars = new CharacterSet();

	private readonly throttledDelayer: Delayer<boolean>;
	private triggerId = 0;

	constructor(
		editor: ICodeEditor,
		providers: LanguageFeatureRegistry<languages.SignatureHelpProvider>,
		delay: number = ParameterHintsModel.DEFAULT_DELAY
	) {
		super();

		this.editor = editor;
		this.providers = providers;

		this.throttledDelayer = new Delayer(delay);

		this._register(this.editor.onDidBlurEditorWidget(() => this.cancel()));
		this._register(this.editor.onDidChangeConfiguration(() => this.onEditorConfigurationChange()));
		this._register(this.editor.onDidChangeModel(e => this.onModelChanged()));
		this._register(this.editor.onDidChangeModelLanguage(_ => this.onModelChanged()));
		this._register(this.editor.onDidChangeCursorSelection(e => this.onCursorChange(e)));
		this._register(this.editor.onDidChangeModelContent(e => this.onModelContentChange()));
		this._register(this.providers.onDidChange(this.onModelChanged, this));
		this._register(this.editor.onDidType(text => this.onDidType(text)));

		this.onEditorConfigurationChange();
		this.onModelChanged();
	}

	private get state() { return this._state; }
	private set state(value: ParameterHintState.State) {
		if (this._state.type === ParameterHintState.Type.Pending) {
			this._state.request.cancel();
		}
		this._state = value;
	}

	cancel(silent: boolean = false): void {
		this.state = ParameterHintState.Default;

		this.throttledDelayer.cancel();

		if (!silent) {
			this._onChangedHints.fire(undefined);
		}
	}

	trigger(context: TriggerContext, delay?: number): void {
		const model = this.editor.getModel();
		if (!model || !this.providers.has(model)) {
			return;
		}

		const triggerId = ++this.triggerId;

		this._pendingTriggers.push(context);
		this.throttledDelayer.trigger(() => {
			return this.doTrigger(triggerId);
		}, delay)
			.catch(onUnexpectedError);
	}

	public next(): void {
		if (this.state.type !== ParameterHintState.Type.Active) {
			return;
		}

		const length = this.state.hints.signatures.length;
		const activeSignature = this.state.hints.activeSignature;
		const last = (activeSignature % length) === (length - 1);
		const cycle = this.editor.getOption(EditorOption.parameterHints).cycle;

		// If there is only one signature, or we're on last signature of list
		if ((length < 2 || last) && !cycle) {
			this.cancel();
			return;
		}

		this.updateActiveSignature(last && cycle ? 0 : activeSignature + 1);
	}

	public previous(): void {
		if (this.state.type !== ParameterHintState.Type.Active) {
			return;
		}

		const length = this.state.hints.signatures.length;
		const activeSignature = this.state.hints.activeSignature;
		const first = activeSignature === 0;
		const cycle = this.editor.getOption(EditorOption.parameterHints).cycle;

		// If there is only one signature, or we're on first signature of list
		if ((length < 2 || first) && !cycle) {
			this.cancel();
			return;
		}

		this.updateActiveSignature(first && cycle ? length - 1 : activeSignature - 1);
	}

	private updateActiveSignature(activeSignature: number) {
		if (this.state.type !== ParameterHintState.Type.Active) {
			return;
		}

		this.state = new ParameterHintState.Active({ ...this.state.hints, activeSignature });
		this._onChangedHints.fire(this.state.hints);
	}

	private async doTrigger(triggerId: number): Promise<boolean> {
		const isRetrigger = this.state.type === ParameterHintState.Type.Active || this.state.type === ParameterHintState.Type.Pending;
		const activeSignatureHelp = this.getLastActiveHints();
		this.cancel(true);

		if (this._pendingTriggers.length === 0) {
			return false;
		}

		const context: TriggerContext = this._pendingTriggers.reduce(mergeTriggerContexts);
		this._pendingTriggers = [];

		const triggerContext = {
			triggerKind: context.triggerKind,
			triggerCharacter: context.triggerCharacter,
			isRetrigger: isRetrigger,
			activeSignatureHelp: activeSignatureHelp
		};

		if (!this.editor.hasModel()) {
			return false;
		}

		const model = this.editor.getModel();
		const position = this.editor.getPosition();

		this.state = new ParameterHintState.Pending(
			createCancelablePromise(token => provideSignatureHelp(this.providers, model, position, triggerContext, token)),
			activeSignatureHelp);

		try {
			const result = await this.state.request;

			// Check that we are still resolving the correct signature help
			if (triggerId !== this.triggerId) {
				result?.dispose();

				return false;
			}

			if (!result || !result.value.signatures || result.value.signatures.length === 0) {
				result?.dispose();
				this._lastSignatureHelpResult.clear();
				this.cancel();
				return false;
			} else {
				this.state = new ParameterHintState.Active(result.value);
				this._lastSignatureHelpResult.value = result;
				this._onChangedHints.fire(this.state.hints);
				return true;
			}
		} catch (error) {
			if (triggerId === this.triggerId) {
				this.state = ParameterHintState.Default;
			}
			onUnexpectedError(error);
			return false;
		}
	}

	private getLastActiveHints(): languages.SignatureHelp | undefined {
		switch (this.state.type) {
			case ParameterHintState.Type.Active: return this.state.hints;
			case ParameterHintState.Type.Pending: return this.state.previouslyActiveHints;
			default: return undefined;
		}
	}

	private get isTriggered(): boolean {
		return this.state.type === ParameterHintState.Type.Active
			|| this.state.type === ParameterHintState.Type.Pending
			|| this.throttledDelayer.isTriggered();
	}

	private onModelChanged(): void {
		this.cancel();

		this.triggerChars.clear();
		this.retriggerChars.clear();

		const model = this.editor.getModel();
		if (!model) {
			return;
		}

		for (const support of this.providers.ordered(model)) {
			for (const ch of support.signatureHelpTriggerCharacters || []) {
				if (ch.length) {
					const charCode = ch.charCodeAt(0);
					this.triggerChars.add(charCode);

					// All trigger characters are also considered retrigger characters
					this.retriggerChars.add(charCode);
				}
			}

			for (const ch of support.signatureHelpRetriggerCharacters || []) {
				if (ch.length) {
					this.retriggerChars.add(ch.charCodeAt(0));
				}
			}
		}
	}

	private onDidType(text: string) {
		if (!this.triggerOnType) {
			return;
		}

		const lastCharIndex = text.length - 1;
		const triggerCharCode = text.charCodeAt(lastCharIndex);

		if (this.triggerChars.has(triggerCharCode) || this.isTriggered && this.retriggerChars.has(triggerCharCode)) {
			this.trigger({
				triggerKind: languages.SignatureHelpTriggerKind.TriggerCharacter,
				triggerCharacter: text.charAt(lastCharIndex),
			});
		}
	}

	private onCursorChange(e: ICursorSelectionChangedEvent): void {
		if (e.source === 'mouse') {
			this.cancel();
		} else if (this.isTriggered) {
			this.trigger({ triggerKind: languages.SignatureHelpTriggerKind.ContentChange });
		}
	}

	private onModelContentChange(): void {
		if (this.isTriggered) {
			this.trigger({ triggerKind: languages.SignatureHelpTriggerKind.ContentChange });
		}
	}

	private onEditorConfigurationChange(): void {
		this.triggerOnType = this.editor.getOption(EditorOption.parameterHints).enabled;

		if (!this.triggerOnType) {
			this.cancel();
		}
	}

	override dispose(): void {
		this.cancel(true);
		super.dispose();
	}
}

function mergeTriggerContexts(previous: TriggerContext, current: TriggerContext) {
	switch (current.triggerKind) {
		case languages.SignatureHelpTriggerKind.Invoke:
			// Invoke overrides previous triggers.
			return current;

		case languages.SignatureHelpTriggerKind.ContentChange:
			// Ignore content changes triggers
			return previous;

		case languages.SignatureHelpTriggerKind.TriggerCharacter:
		default:
			return current;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/parameterHints/browser/parameterHintsWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/parameterHints/browser/parameterHintsWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import * as aria from '../../../../base/browser/ui/aria/aria.js';
import { DomScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Event } from '../../../../base/common/event.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { escapeRegExpCharacters } from '../../../../base/common/strings.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import './parameterHints.css';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { EDITOR_FONT_DEFAULTS } from '../../../common/config/fontInfo.js';
import * as languages from '../../../common/languages.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { IRenderedMarkdown } from '../../../../base/browser/markdownRenderer.js';
import { ParameterHintsModel } from './parameterHintsModel.js';
import { Context } from './provideSignatureHelp.js';
import * as nls from '../../../../nls.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { listHighlightForeground, registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

const $ = dom.$;

const parameterHintsNextIcon = registerIcon('parameter-hints-next', Codicon.chevronDown, nls.localize('parameterHintsNextIcon', 'Icon for show next parameter hint.'));
const parameterHintsPreviousIcon = registerIcon('parameter-hints-previous', Codicon.chevronUp, nls.localize('parameterHintsPreviousIcon', 'Icon for show previous parameter hint.'));

export class ParameterHintsWidget extends Disposable implements IContentWidget {

	private static readonly ID = 'editor.widget.parameterHintsWidget';

	private readonly renderDisposeables = this._register(new DisposableStore());
	private readonly keyVisible: IContextKey<boolean>;
	private readonly keyMultipleSignatures: IContextKey<boolean>;

	private domNodes?: {
		readonly element: HTMLElement;
		readonly signature: HTMLElement;
		readonly docs: HTMLElement;
		readonly overloads: HTMLElement;
		readonly scrollbar: DomScrollableElement;
	};

	private visible: boolean = false;
	private announcedLabel: string | null = null;

	// Editor.IContentWidget.allowEditorOverflow
	allowEditorOverflow = true;

	constructor(
		private readonly editor: ICodeEditor,
		private readonly model: ParameterHintsModel,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) {
		super();

		this.keyVisible = Context.Visible.bindTo(contextKeyService);
		this.keyMultipleSignatures = Context.MultipleSignatures.bindTo(contextKeyService);
	}

	private createParameterHintDOMNodes() {
		const element = $('.editor-widget.parameter-hints-widget');
		const wrapper = dom.append(element, $('.phwrapper'));
		wrapper.tabIndex = -1;

		const controls = dom.append(wrapper, $('.controls'));
		const previous = dom.append(controls, $('.button' + ThemeIcon.asCSSSelector(parameterHintsPreviousIcon)));
		const overloads = dom.append(controls, $('.overloads'));
		const next = dom.append(controls, $('.button' + ThemeIcon.asCSSSelector(parameterHintsNextIcon)));

		this._register(dom.addDisposableListener(previous, 'click', e => {
			dom.EventHelper.stop(e);
			this.previous();
		}));

		this._register(dom.addDisposableListener(next, 'click', e => {
			dom.EventHelper.stop(e);
			this.next();
		}));

		const body = $('.body');
		const scrollbar = new DomScrollableElement(body, {
			alwaysConsumeMouseWheel: true,
		});
		this._register(scrollbar);
		wrapper.appendChild(scrollbar.getDomNode());

		const signature = dom.append(body, $('.signature'));
		const docs = dom.append(body, $('.docs'));

		element.style.userSelect = 'text';

		this.domNodes = {
			element,
			signature,
			overloads,
			docs,
			scrollbar,
		};

		this.editor.addContentWidget(this);
		this.hide();

		this._register(this.editor.onDidChangeCursorSelection(e => {
			if (this.visible) {
				this.editor.layoutContentWidget(this);
			}
		}));

		const updateFont = () => {
			if (!this.domNodes) {
				return;
			}

			const fontInfo = this.editor.getOption(EditorOption.fontInfo);
			const element = this.domNodes.element;
			element.style.fontSize = `${fontInfo.fontSize}px`;
			element.style.lineHeight = `${fontInfo.lineHeight / fontInfo.fontSize}`;
			element.style.setProperty('--vscode-parameterHintsWidget-editorFontFamily', fontInfo.fontFamily);
			element.style.setProperty('--vscode-parameterHintsWidget-editorFontFamilyDefault', EDITOR_FONT_DEFAULTS.fontFamily);
		};

		updateFont();

		this._register(Event.chain(
			this.editor.onDidChangeConfiguration.bind(this.editor),
			$ => $.filter(e => e.hasChanged(EditorOption.fontInfo))
		)(updateFont));

		this._register(this.editor.onDidLayoutChange(e => this.updateMaxHeight()));
		this.updateMaxHeight();
	}

	public show(): void {
		if (this.visible) {
			return;
		}

		if (!this.domNodes) {
			this.createParameterHintDOMNodes();
		}

		this.keyVisible.set(true);
		this.visible = true;
		setTimeout(() => {
			this.domNodes?.element.classList.add('visible');
		}, 100);
		this.editor.layoutContentWidget(this);
	}

	public hide(): void {
		this.renderDisposeables.clear();

		if (!this.visible) {
			return;
		}

		this.keyVisible.reset();
		this.visible = false;
		this.announcedLabel = null;
		this.domNodes?.element.classList.remove('visible');
		this.editor.layoutContentWidget(this);
	}

	getPosition(): IContentWidgetPosition | null {
		if (this.visible) {
			return {
				position: this.editor.getPosition(),
				preference: [ContentWidgetPositionPreference.ABOVE, ContentWidgetPositionPreference.BELOW]
			};
		}
		return null;
	}

	public render(hints: languages.SignatureHelp): void {
		this.renderDisposeables.clear();

		if (!this.domNodes) {
			return;
		}

		const multiple = hints.signatures.length > 1;
		this.domNodes.element.classList.toggle('multiple', multiple);
		this.keyMultipleSignatures.set(multiple);

		this.domNodes.signature.innerText = '';
		this.domNodes.docs.innerText = '';

		const signature = hints.signatures[hints.activeSignature];
		if (!signature) {
			return;
		}

		const code = dom.append(this.domNodes.signature, $('.code'));
		const hasParameters = signature.parameters.length > 0;
		const activeParameterIndex = signature.activeParameter ?? hints.activeParameter;

		if (!hasParameters) {
			const label = dom.append(code, $('span'));
			label.textContent = signature.label;
		} else {
			this.renderParameters(code, signature, activeParameterIndex);
		}

		const activeParameter: languages.ParameterInformation | undefined = signature.parameters[activeParameterIndex];
		if (activeParameter?.documentation) {
			const documentation = $('span.documentation');
			if (typeof activeParameter.documentation === 'string') {
				documentation.textContent = activeParameter.documentation;
			} else {
				const renderedContents = this.renderMarkdownDocs(activeParameter.documentation);
				documentation.appendChild(renderedContents.element);
			}
			dom.append(this.domNodes.docs, $('p', {}, documentation));
		}

		if (signature.documentation === undefined) {
			/** no op */
		} else if (typeof signature.documentation === 'string') {
			dom.append(this.domNodes.docs, $('p', {}, signature.documentation));
		} else {
			const renderedContents = this.renderMarkdownDocs(signature.documentation);
			dom.append(this.domNodes.docs, renderedContents.element);
		}

		const hasDocs = this.hasDocs(signature, activeParameter);

		this.domNodes.signature.classList.toggle('has-docs', hasDocs);
		this.domNodes.docs.classList.toggle('empty', !hasDocs);

		this.domNodes.overloads.textContent =
			String(hints.activeSignature + 1).padStart(hints.signatures.length.toString().length, '0') + '/' + hints.signatures.length;

		if (activeParameter) {
			let labelToAnnounce = '';
			const param = signature.parameters[activeParameterIndex];
			if (Array.isArray(param.label)) {
				labelToAnnounce = signature.label.substring(param.label[0], param.label[1]);
			} else {
				labelToAnnounce = param.label;
			}
			if (param.documentation) {
				labelToAnnounce += typeof param.documentation === 'string' ? `, ${param.documentation}` : `, ${param.documentation.value}`;
			}
			if (signature.documentation) {
				labelToAnnounce += typeof signature.documentation === 'string' ? `, ${signature.documentation}` : `, ${signature.documentation.value}`;
			}

			// Select method gets called on every user type while parameter hints are visible.
			// We do not want to spam the user with same announcements, so we only announce if the current parameter changed.

			if (this.announcedLabel !== labelToAnnounce) {
				aria.alert(nls.localize('hint', "{0}, hint", labelToAnnounce));
				this.announcedLabel = labelToAnnounce;
			}
		}

		this.editor.layoutContentWidget(this);
		this.domNodes.scrollbar.scanDomNode();
	}

	private renderMarkdownDocs(markdown: IMarkdownString): IRenderedMarkdown {
		const renderedContents = this.renderDisposeables.add(this.markdownRendererService.render(markdown, {
			context: this.editor,
			asyncRenderCallback: () => {
				this.domNodes?.scrollbar.scanDomNode();
			}
		}));
		renderedContents.element.classList.add('markdown-docs');
		return renderedContents;
	}

	private hasDocs(signature: languages.SignatureInformation, activeParameter: languages.ParameterInformation | undefined): boolean {
		if (activeParameter && typeof activeParameter.documentation === 'string' && assertReturnsDefined(activeParameter.documentation).length > 0) {
			return true;
		}
		if (activeParameter && typeof activeParameter.documentation === 'object' && assertReturnsDefined(activeParameter.documentation).value.length > 0) {
			return true;
		}
		if (signature.documentation && typeof signature.documentation === 'string' && assertReturnsDefined(signature.documentation).length > 0) {
			return true;
		}
		if (signature.documentation && typeof signature.documentation === 'object' && assertReturnsDefined(signature.documentation.value).length > 0) {
			return true;
		}
		return false;
	}

	private renderParameters(parent: HTMLElement, signature: languages.SignatureInformation, activeParameterIndex: number): void {
		const [start, end] = this.getParameterLabelOffsets(signature, activeParameterIndex);

		const beforeSpan = document.createElement('span');
		beforeSpan.textContent = signature.label.substring(0, start);

		const paramSpan = document.createElement('span');
		paramSpan.textContent = signature.label.substring(start, end);
		paramSpan.className = 'parameter active';

		const afterSpan = document.createElement('span');
		afterSpan.textContent = signature.label.substring(end);

		dom.append(parent, beforeSpan, paramSpan, afterSpan);
	}

	private getParameterLabelOffsets(signature: languages.SignatureInformation, paramIdx: number): [number, number] {
		const param = signature.parameters[paramIdx];
		if (!param) {
			return [0, 0];
		} else if (Array.isArray(param.label)) {
			return param.label;
		} else if (!param.label.length) {
			return [0, 0];
		} else {
			const regex = new RegExp(`(\\W|^)${escapeRegExpCharacters(param.label)}(?=\\W|$)`, 'g');
			regex.test(signature.label);
			const idx = regex.lastIndex - param.label.length;
			return idx >= 0
				? [idx, regex.lastIndex]
				: [0, 0];
		}
	}

	next(): void {
		this.editor.focus();
		this.model.next();
	}

	previous(): void {
		this.editor.focus();
		this.model.previous();
	}

	getDomNode(): HTMLElement {
		if (!this.domNodes) {
			this.createParameterHintDOMNodes();
		}
		return this.domNodes!.element;
	}

	getId(): string {
		return ParameterHintsWidget.ID;
	}

	private updateMaxHeight(): void {
		if (!this.domNodes) {
			return;
		}
		const height = Math.max(this.editor.getLayoutInfo().height / 4, 250);
		const maxHeight = `${height}px`;
		this.domNodes.element.style.maxHeight = maxHeight;
		// eslint-disable-next-line no-restricted-syntax
		const wrapper = this.domNodes.element.getElementsByClassName('phwrapper') as HTMLCollectionOf<HTMLElement>;
		if (wrapper.length) {
			wrapper[0].style.maxHeight = maxHeight;
		}
	}
}

registerColor('editorHoverWidget.highlightForeground', listHighlightForeground, nls.localize('editorHoverWidgetHighlightForeground', 'Foreground color of the active item in the parameter hint.'));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/parameterHints/browser/provideSignatureHelp.ts]---
Location: vscode-main/src/vs/editor/contrib/parameterHints/browser/provideSignatureHelp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import * as languages from '../../../common/languages.js';
import { ITextModel } from '../../../common/model.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { ITextModelService } from '../../../common/services/resolverService.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';

export const Context = {
	Visible: new RawContextKey<boolean>('parameterHintsVisible', false),
	MultipleSignatures: new RawContextKey<boolean>('parameterHintsMultipleSignatures', false),
};

export async function provideSignatureHelp(
	registry: LanguageFeatureRegistry<languages.SignatureHelpProvider>,
	model: ITextModel,
	position: Position,
	context: languages.SignatureHelpContext,
	token: CancellationToken
): Promise<languages.SignatureHelpResult | undefined> {

	const supports = registry.ordered(model);

	for (const support of supports) {
		try {
			const result = await support.provideSignatureHelp(model, position, token, context);
			if (result) {
				return result;
			}
		} catch (err) {
			onUnexpectedExternalError(err);
		}
	}
	return undefined;
}

CommandsRegistry.registerCommand('_executeSignatureHelpProvider', async (accessor, ...args: [URI, IPosition, string?]) => {
	const [uri, position, triggerCharacter] = args;
	assertType(URI.isUri(uri));
	assertType(Position.isIPosition(position));
	assertType(typeof triggerCharacter === 'string' || !triggerCharacter);

	const languageFeaturesService = accessor.get(ILanguageFeaturesService);

	const ref = await accessor.get(ITextModelService).createModelReference(uri);
	try {

		const result = await provideSignatureHelp(languageFeaturesService.signatureHelpProvider, ref.object.textEditorModel, Position.lift(position), {
			triggerKind: languages.SignatureHelpTriggerKind.Invoke,
			isRetrigger: false,
			triggerCharacter,
		}, CancellationToken.None);

		if (!result) {
			return undefined;
		}

		setTimeout(() => result.dispose(), 0);
		return result.value;

	} finally {
		ref.dispose();
	}
});
```

--------------------------------------------------------------------------------

````

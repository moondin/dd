---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 214
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 214 of 552)

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

---[FILE: src/vs/editor/common/model/textModel.ts]---
Location: vscode-main/src/vs/editor/common/model/textModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ArrayQueue, pushMany } from '../../../base/common/arrays.js';
import { VSBuffer, VSBufferReadableStream } from '../../../base/common/buffer.js';
import { CharCode } from '../../../base/common/charCode.js';
import { SetWithKey } from '../../../base/common/collections.js';
import { Color } from '../../../base/common/color.js';
import { BugIndicatingError, illegalArgument, onUnexpectedError } from '../../../base/common/errors.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { Disposable, IDisposable, MutableDisposable, combinedDisposable } from '../../../base/common/lifecycle.js';
import { listenStream } from '../../../base/common/stream.js';
import * as strings from '../../../base/common/strings.js';
import { ThemeColor } from '../../../base/common/themables.js';
import { Constants } from '../../../base/common/uint.js';
import { URI } from '../../../base/common/uri.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { isDark } from '../../../platform/theme/common/theme.js';
import { IColorTheme } from '../../../platform/theme/common/themeService.js';
import { IUndoRedoService, ResourceEditStackSnapshot, UndoRedoGroup } from '../../../platform/undoRedo/common/undoRedo.js';
import { ISingleEditOperation } from '../core/editOperation.js';
import { TextEdit } from '../core/edits/textEdit.js';
import { countEOL } from '../core/misc/eolCounter.js';
import { normalizeIndentation } from '../core/misc/indentation.js';
import { EDITOR_MODEL_DEFAULTS } from '../core/misc/textModelDefaults.js';
import { IPosition, Position } from '../core/position.js';
import { IRange, Range } from '../core/range.js';
import { Selection } from '../core/selection.js';
import { TextChange } from '../core/textChange.js';
import { IWordAtPosition } from '../core/wordHelper.js';
import { FormattingOptions } from '../languages.js';
import { ILanguageSelection, ILanguageService } from '../languages/language.js';
import { ILanguageConfigurationService } from '../languages/languageConfigurationRegistry.js';
import * as model from '../model.js';
import { IBracketPairsTextModelPart } from '../textModelBracketPairs.js';
import { EditSources, TextModelEditSource } from '../textModelEditSource.js';
import { IModelContentChangedEvent, IModelDecorationsChangedEvent, IModelOptionsChangedEvent, InternalModelContentChangeEvent, LineInjectedText, ModelFontChanged, ModelFontChangedEvent, ModelInjectedTextChangedEvent, ModelLineHeightChanged, ModelLineHeightChangedEvent, ModelRawChange, ModelRawContentChangedEvent, ModelRawEOLChanged, ModelRawFlush, ModelRawLineChanged, ModelRawLinesDeleted, ModelRawLinesInserted } from '../textModelEvents.js';
import { IGuidesTextModelPart } from '../textModelGuides.js';
import { ITokenizationTextModelPart } from '../tokenizationTextModelPart.js';
import { TokenArray } from '../tokens/lineTokens.js';
import { BracketPairsTextModelPart } from './bracketPairsTextModelPart/bracketPairsImpl.js';
import { ColorizedBracketPairsDecorationProvider } from './bracketPairsTextModelPart/colorizedBracketPairsDecorationProvider.js';
import { EditStack } from './editStack.js';
import { GuidesTextModelPart } from './guidesTextModelPart.js';
import { guessIndentation } from './indentationGuesser.js';
import { IntervalNode, IntervalTree, recomputeMaxEnd } from './intervalTree.js';
import { PieceTreeTextBuffer } from './pieceTreeTextBuffer/pieceTreeTextBuffer.js';
import { PieceTreeTextBufferBuilder } from './pieceTreeTextBuffer/pieceTreeTextBufferBuilder.js';
import { SearchParams, TextModelSearch } from './textModelSearch.js';
import { AttachedViews } from './tokens/abstractSyntaxTokenBackend.js';
import { TokenizationFontDecorationProvider } from './tokens/tokenizationFontDecorationsProvider.js';
import { LineFontChangingDecoration, LineHeightChangingDecoration } from './decorationProvider.js';
import { TokenizationTextModelPart } from './tokens/tokenizationTextModelPart.js';

export function createTextBufferFactory(text: string): model.ITextBufferFactory {
	const builder = new PieceTreeTextBufferBuilder();
	builder.acceptChunk(text);
	return builder.finish();
}

interface ITextStream {
	on(event: 'data', callback: (data: string) => void): void;
	on(event: 'error', callback: (err: Error) => void): void;
	on(event: 'end', callback: () => void): void;
	on(event: string, callback: (...args: unknown[]) => void): void;
}

export function createTextBufferFactoryFromStream(stream: ITextStream): Promise<model.ITextBufferFactory>;
export function createTextBufferFactoryFromStream(stream: VSBufferReadableStream): Promise<model.ITextBufferFactory>;
export function createTextBufferFactoryFromStream(stream: ITextStream | VSBufferReadableStream): Promise<model.ITextBufferFactory> {
	return new Promise<model.ITextBufferFactory>((resolve, reject) => {
		const builder = new PieceTreeTextBufferBuilder();

		let done = false;

		listenStream<string | VSBuffer>(stream, {
			onData: chunk => {
				builder.acceptChunk((typeof chunk === 'string') ? chunk : chunk.toString());
			},
			onError: error => {
				if (!done) {
					done = true;
					reject(error);
				}
			},
			onEnd: () => {
				if (!done) {
					done = true;
					resolve(builder.finish());
				}
			}
		});
	});
}

export function createTextBufferFactoryFromSnapshot(snapshot: model.ITextSnapshot): model.ITextBufferFactory {
	const builder = new PieceTreeTextBufferBuilder();

	let chunk: string | null;
	while (typeof (chunk = snapshot.read()) === 'string') {
		builder.acceptChunk(chunk);
	}

	return builder.finish();
}

export function createTextBuffer(value: string | model.ITextBufferFactory | model.ITextSnapshot, defaultEOL: model.DefaultEndOfLine): { textBuffer: model.ITextBuffer; disposable: IDisposable } {
	let factory: model.ITextBufferFactory;
	if (typeof value === 'string') {
		factory = createTextBufferFactory(value);
	} else if (model.isITextSnapshot(value)) {
		factory = createTextBufferFactoryFromSnapshot(value);
	} else {
		factory = value;
	}
	return factory.create(defaultEOL);
}

let MODEL_ID = 0;

const LIMIT_FIND_COUNT = 999;
const LONG_LINE_BOUNDARY = 10000;
const LINE_HEIGHT_CEILING = 300;

class TextModelSnapshot implements model.ITextSnapshot {

	private readonly _source: model.ITextSnapshot;
	private _eos: boolean;

	constructor(source: model.ITextSnapshot) {
		this._source = source;
		this._eos = false;
	}

	public read(): string | null {
		if (this._eos) {
			return null;
		}

		const result: string[] = [];
		let resultCnt = 0;
		let resultLength = 0;

		do {
			const tmp = this._source.read();

			if (tmp === null) {
				// end-of-stream
				this._eos = true;
				if (resultCnt === 0) {
					return null;
				} else {
					return result.join('');
				}
			}

			if (tmp.length > 0) {
				result[resultCnt++] = tmp;
				resultLength += tmp.length;
			}

			if (resultLength >= 64 * 1024) {
				return result.join('');
			}
		} while (true);
	}
}

const invalidFunc = () => { throw new Error(`Invalid change accessor`); };

const enum StringOffsetValidationType {
	/**
	 * Even allowed in surrogate pairs
	 */
	Relaxed = 0,
	/**
	 * Not allowed in surrogate pairs
	 */
	SurrogatePairs = 1,
}

export class TextModel extends Disposable implements model.ITextModel, IDecorationsTreesHost {

	static _MODEL_SYNC_LIMIT = 50 * 1024 * 1024; // 50 MB,  // used in tests
	private static readonly LARGE_FILE_SIZE_THRESHOLD = 20 * 1024 * 1024; // 20 MB;
	private static readonly LARGE_FILE_LINE_COUNT_THRESHOLD = 300 * 1000; // 300K lines
	private static readonly LARGE_FILE_HEAP_OPERATION_THRESHOLD = 256 * 1024 * 1024; // 256M characters, usually ~> 512MB memory usage

	public static DEFAULT_CREATION_OPTIONS: model.ITextModelCreationOptions = {
		isForSimpleWidget: false,
		tabSize: EDITOR_MODEL_DEFAULTS.tabSize,
		indentSize: EDITOR_MODEL_DEFAULTS.indentSize,
		insertSpaces: EDITOR_MODEL_DEFAULTS.insertSpaces,
		detectIndentation: false,
		defaultEOL: model.DefaultEndOfLine.LF,
		trimAutoWhitespace: EDITOR_MODEL_DEFAULTS.trimAutoWhitespace,
		largeFileOptimizations: EDITOR_MODEL_DEFAULTS.largeFileOptimizations,
		bracketPairColorizationOptions: EDITOR_MODEL_DEFAULTS.bracketPairColorizationOptions,
	};

	public static resolveOptions(textBuffer: model.ITextBuffer, options: model.ITextModelCreationOptions): model.TextModelResolvedOptions {
		if (options.detectIndentation) {
			const guessedIndentation = guessIndentation(textBuffer, options.tabSize, options.insertSpaces);
			return new model.TextModelResolvedOptions({
				tabSize: guessedIndentation.tabSize,
				indentSize: 'tabSize', // TODO@Alex: guess indentSize independent of tabSize
				insertSpaces: guessedIndentation.insertSpaces,
				trimAutoWhitespace: options.trimAutoWhitespace,
				defaultEOL: options.defaultEOL,
				bracketPairColorizationOptions: options.bracketPairColorizationOptions,
			});
		}

		return new model.TextModelResolvedOptions(options);
	}

	//#region Events
	private readonly _onWillDispose: Emitter<void> = this._register(new Emitter<void>());
	public readonly onWillDispose: Event<void> = this._onWillDispose.event;

	private readonly _onDidChangeDecorations: DidChangeDecorationsEmitter = this._register(new DidChangeDecorationsEmitter((affectedInjectedTextLines, affectedLineHeights, affectedFontLines) => this.handleBeforeFireDecorationsChangedEvent(affectedInjectedTextLines, affectedLineHeights, affectedFontLines)));
	public readonly onDidChangeDecorations: Event<IModelDecorationsChangedEvent> = this._onDidChangeDecorations.event;

	public get onDidChangeLanguage() { return this._tokenizationTextModelPart.onDidChangeLanguage; }
	public get onDidChangeLanguageConfiguration() { return this._tokenizationTextModelPart.onDidChangeLanguageConfiguration; }
	public get onDidChangeTokens() { return this._tokenizationTextModelPart.onDidChangeTokens; }

	private readonly _onDidChangeOptions: Emitter<IModelOptionsChangedEvent> = this._register(new Emitter<IModelOptionsChangedEvent>());
	public get onDidChangeOptions(): Event<IModelOptionsChangedEvent> { return this._onDidChangeOptions.event; }

	private readonly _onDidChangeAttached: Emitter<void> = this._register(new Emitter<void>());
	public get onDidChangeAttached(): Event<void> { return this._onDidChangeAttached.event; }

	private readonly _onDidChangeInjectedText: Emitter<ModelInjectedTextChangedEvent> = this._register(new Emitter<ModelInjectedTextChangedEvent>());

	private readonly _onDidChangeLineHeight: Emitter<ModelLineHeightChangedEvent> = this._register(new Emitter<ModelLineHeightChangedEvent>());
	public get onDidChangeLineHeight(): Event<ModelLineHeightChangedEvent> { return this._onDidChangeLineHeight.event; }

	private readonly _onDidChangeFont: Emitter<ModelFontChangedEvent> = this._register(new Emitter<ModelFontChangedEvent>());
	public get onDidChangeFont(): Event<ModelFontChangedEvent> { return this._onDidChangeFont.event; }

	private readonly _eventEmitter: DidChangeContentEmitter = this._register(new DidChangeContentEmitter());
	public onDidChangeContent(listener: (e: IModelContentChangedEvent) => void): IDisposable {
		return this._eventEmitter.slowEvent((e: InternalModelContentChangeEvent) => listener(e.contentChangedEvent));
	}
	public onDidChangeContentOrInjectedText(listener: (e: InternalModelContentChangeEvent | ModelInjectedTextChangedEvent) => void): IDisposable {
		return combinedDisposable(
			this._eventEmitter.fastEvent(e => listener(e)),
			this._onDidChangeInjectedText.event(e => listener(e))
		);
	}
	//#endregion

	public readonly id: string;
	public readonly isForSimpleWidget: boolean;
	private readonly _associatedResource: URI;
	private _attachedEditorCount: number;
	private _buffer: model.ITextBuffer;
	private _bufferDisposable: IDisposable;
	private _options: model.TextModelResolvedOptions;
	private readonly _languageSelectionListener = this._register(new MutableDisposable<IDisposable>());

	private _isDisposed: boolean;
	private __isDisposing: boolean;
	public _isDisposing(): boolean { return this.__isDisposing; }
	private _versionId: number;
	/**
	 * Unlike, versionId, this can go down (via undo) or go to previous values (via redo)
	 */
	private _alternativeVersionId: number;
	private _initialUndoRedoSnapshot: ResourceEditStackSnapshot | null;
	private readonly _isTooLargeForSyncing: boolean;
	private readonly _isTooLargeForTokenization: boolean;
	private readonly _isTooLargeForHeapOperation: boolean;

	//#region Editing
	private readonly _commandManager: EditStack;
	private _isUndoing: boolean;
	private _isRedoing: boolean;
	private _trimAutoWhitespaceLines: number[] | null;
	//#endregion

	//#region Decorations
	/**
	 * Used to workaround broken clients that might attempt using a decoration id generated by a different model.
	 * It is not globally unique in order to limit it to one character.
	 */
	private readonly _instanceId: string;
	private _deltaDecorationCallCnt: number = 0;
	private _lastDecorationId: number;
	private _decorations: { [decorationId: string]: IntervalNode };
	private _decorationsTree: DecorationsTrees;
	private readonly _decorationProvider: ColorizedBracketPairsDecorationProvider;
	private readonly _fontTokenDecorationsProvider: TokenizationFontDecorationProvider;
	//#endregion

	private readonly _tokenizationTextModelPart: TokenizationTextModelPart;
	public get tokenization(): ITokenizationTextModelPart { return this._tokenizationTextModelPart; }

	private readonly _bracketPairs: BracketPairsTextModelPart;
	public get bracketPairs(): IBracketPairsTextModelPart { return this._bracketPairs; }

	private readonly _guidesTextModelPart: GuidesTextModelPart;
	public get guides(): IGuidesTextModelPart { return this._guidesTextModelPart; }

	private readonly _attachedViews = new AttachedViews();

	constructor(
		source: string | model.ITextBufferFactory,
		languageIdOrSelection: string | ILanguageSelection,
		creationOptions: model.ITextModelCreationOptions,
		associatedResource: URI | null = null,
		@IUndoRedoService private readonly _undoRedoService: IUndoRedoService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();

		// Generate a new unique model id
		MODEL_ID++;
		this.id = '$model' + MODEL_ID;
		this.isForSimpleWidget = creationOptions.isForSimpleWidget;
		if (typeof associatedResource === 'undefined' || associatedResource === null) {
			this._associatedResource = URI.parse('inmemory://model/' + MODEL_ID);
		} else {
			this._associatedResource = associatedResource;
		}
		this._attachedEditorCount = 0;

		const { textBuffer, disposable } = createTextBuffer(source, creationOptions.defaultEOL);
		this._buffer = textBuffer;
		this._bufferDisposable = disposable;

		const bufferLineCount = this._buffer.getLineCount();
		const bufferTextLength = this._buffer.getValueLengthInRange(new Range(1, 1, bufferLineCount, this._buffer.getLineLength(bufferLineCount) + 1), model.EndOfLinePreference.TextDefined);

		// !!! Make a decision in the ctor and permanently respect this decision !!!
		// If a model is too large at construction time, it will never get tokenized,
		// under no circumstances.
		if (creationOptions.largeFileOptimizations) {
			this._isTooLargeForTokenization = (
				(bufferTextLength > TextModel.LARGE_FILE_SIZE_THRESHOLD)
				|| (bufferLineCount > TextModel.LARGE_FILE_LINE_COUNT_THRESHOLD)
			);

			this._isTooLargeForHeapOperation = bufferTextLength > TextModel.LARGE_FILE_HEAP_OPERATION_THRESHOLD;
		} else {
			this._isTooLargeForTokenization = false;
			this._isTooLargeForHeapOperation = false;
		}

		this._options = TextModel.resolveOptions(this._buffer, creationOptions);

		const languageId = (typeof languageIdOrSelection === 'string' ? languageIdOrSelection : languageIdOrSelection.languageId);
		if (typeof languageIdOrSelection !== 'string') {
			this._languageSelectionListener.value = languageIdOrSelection.onDidChange(() => this._setLanguage(languageIdOrSelection.languageId));
		}

		this._bracketPairs = this._register(new BracketPairsTextModelPart(this, this._languageConfigurationService));
		this._guidesTextModelPart = this._register(new GuidesTextModelPart(this, this._languageConfigurationService));
		this._decorationProvider = this._register(new ColorizedBracketPairsDecorationProvider(this));
		this._tokenizationTextModelPart = this.instantiationService.createInstance(TokenizationTextModelPart,
			this,
			this._bracketPairs,
			languageId,
			this._attachedViews
		);
		this._fontTokenDecorationsProvider = this._register(new TokenizationFontDecorationProvider(this, this._tokenizationTextModelPart));

		this._isTooLargeForSyncing = (bufferTextLength > TextModel._MODEL_SYNC_LIMIT);

		this._versionId = 1;
		this._alternativeVersionId = 1;
		this._initialUndoRedoSnapshot = null;

		this._isDisposed = false;
		this.__isDisposing = false;

		this._instanceId = strings.singleLetterHash(MODEL_ID);
		this._lastDecorationId = 0;
		this._decorations = Object.create(null);
		this._decorationsTree = new DecorationsTrees();

		this._commandManager = new EditStack(this, this._undoRedoService);
		this._isUndoing = false;
		this._isRedoing = false;
		this._trimAutoWhitespaceLines = null;


		this._register(this._decorationProvider.onDidChange(() => {
			this._onDidChangeDecorations.beginDeferredEmit();
			this._onDidChangeDecorations.fire();
			this._onDidChangeDecorations.endDeferredEmit();
		}));
		this._register(this._fontTokenDecorationsProvider.onDidChangeLineHeight((affectedLineHeights) => {
			this._onDidChangeDecorations.beginDeferredEmit();
			this._onDidChangeDecorations.fire();
			this._fireOnDidChangeLineHeight(affectedLineHeights);
			this._onDidChangeDecorations.endDeferredEmit();
		}));
		this._register(this._fontTokenDecorationsProvider.onDidChangeFont((affectedFontLines) => {
			this._onDidChangeDecorations.beginDeferredEmit();
			this._onDidChangeDecorations.fire();
			this._fireOnDidChangeFont(affectedFontLines);
			this._onDidChangeDecorations.endDeferredEmit();
		}));

		this._languageService.requestRichLanguageFeatures(languageId);

		this._register(this._languageConfigurationService.onDidChange(e => {
			this._bracketPairs.handleLanguageConfigurationServiceChange(e);
			this._tokenizationTextModelPart.handleLanguageConfigurationServiceChange(e);
		}));
	}

	public override dispose(): void {
		this.__isDisposing = true;
		this._onWillDispose.fire();
		this._tokenizationTextModelPart.dispose();
		this._isDisposed = true;
		super.dispose();
		this._bufferDisposable.dispose();
		this.__isDisposing = false;
		// Manually release reference to previous text buffer to avoid large leaks
		// in case someone leaks a TextModel reference
		const emptyDisposedTextBuffer = new PieceTreeTextBuffer([], '', '\n', false, false, true, true);
		emptyDisposedTextBuffer.dispose();
		this._buffer = emptyDisposedTextBuffer;
		this._bufferDisposable = Disposable.None;
	}

	_hasListeners(): boolean {
		return (
			this._onWillDispose.hasListeners()
			|| this._onDidChangeDecorations.hasListeners()
			|| this._tokenizationTextModelPart._hasListeners()
			|| this._onDidChangeOptions.hasListeners()
			|| this._onDidChangeAttached.hasListeners()
			|| this._onDidChangeInjectedText.hasListeners()
			|| this._onDidChangeLineHeight.hasListeners()
			|| this._onDidChangeFont.hasListeners()
			|| this._eventEmitter.hasListeners()
		);
	}

	private _assertNotDisposed(): void {
		if (this._isDisposed) {
			throw new BugIndicatingError('Model is disposed!');
		}
	}

	public equalsTextBuffer(other: model.ITextBuffer): boolean {
		this._assertNotDisposed();
		return this._buffer.equals(other);
	}

	public getTextBuffer(): model.ITextBuffer {
		this._assertNotDisposed();
		return this._buffer;
	}

	private _emitContentChangedEvent(rawChange: ModelRawContentChangedEvent, change: IModelContentChangedEvent): void {
		if (this.__isDisposing) {
			// Do not confuse listeners by emitting any event after disposing
			return;
		}
		this._tokenizationTextModelPart.handleDidChangeContent(change);
		this._bracketPairs.handleDidChangeContent(change);
		this._fontTokenDecorationsProvider.handleDidChangeContent(change);
		this._eventEmitter.fire(new InternalModelContentChangeEvent(rawChange, change));
	}

	public setValue(value: string | model.ITextSnapshot, reason = EditSources.setValue()): void {
		this._assertNotDisposed();

		if (value === null || value === undefined) {
			throw illegalArgument();
		}

		const { textBuffer, disposable } = createTextBuffer(value, this._options.defaultEOL);
		this._setValueFromTextBuffer(textBuffer, disposable, reason);
	}

	private _createContentChanged2(range: Range, rangeOffset: number, rangeLength: number, rangeEndPosition: Position, text: string, isUndoing: boolean, isRedoing: boolean, isFlush: boolean, isEolChange: boolean, reason: TextModelEditSource): IModelContentChangedEvent {
		return {
			changes: [{
				range: range,
				rangeOffset: rangeOffset,
				rangeLength: rangeLength,
				text: text,
			}],
			eol: this._buffer.getEOL(),
			isEolChange: isEolChange,
			versionId: this.getVersionId(),
			isUndoing: isUndoing,
			isRedoing: isRedoing,
			isFlush: isFlush,
			detailedReasons: [reason],
			detailedReasonsChangeLengths: [1],
		};
	}

	private _setValueFromTextBuffer(textBuffer: model.ITextBuffer, textBufferDisposable: IDisposable, reason: TextModelEditSource): void {
		this._assertNotDisposed();
		const oldFullModelRange = this.getFullModelRange();
		const oldModelValueLength = this.getValueLengthInRange(oldFullModelRange);
		const endLineNumber = this.getLineCount();
		const endColumn = this.getLineMaxColumn(endLineNumber);

		this._buffer = textBuffer;
		this._bufferDisposable.dispose();
		this._bufferDisposable = textBufferDisposable;
		this._increaseVersionId();

		// Destroy all my decorations
		this._decorations = Object.create(null);
		this._decorationsTree = new DecorationsTrees();

		// Destroy my edit history and settings
		this._commandManager.clear();
		this._trimAutoWhitespaceLines = null;

		this._emitContentChangedEvent(
			new ModelRawContentChangedEvent(
				[
					new ModelRawFlush()
				],
				this._versionId,
				false,
				false
			),
			this._createContentChanged2(new Range(1, 1, endLineNumber, endColumn), 0, oldModelValueLength, new Position(endLineNumber, endColumn), this.getValue(), false, false, true, false, reason)
		);
	}

	public setEOL(eol: model.EndOfLineSequence): void {
		this._assertNotDisposed();
		const newEOL = (eol === model.EndOfLineSequence.CRLF ? '\r\n' : '\n');
		if (this._buffer.getEOL() === newEOL) {
			// Nothing to do
			return;
		}

		const oldFullModelRange = this.getFullModelRange();
		const oldModelValueLength = this.getValueLengthInRange(oldFullModelRange);
		const endLineNumber = this.getLineCount();
		const endColumn = this.getLineMaxColumn(endLineNumber);

		this._onBeforeEOLChange();
		this._buffer.setEOL(newEOL);
		this._increaseVersionId();
		this._onAfterEOLChange();

		this._emitContentChangedEvent(
			new ModelRawContentChangedEvent(
				[
					new ModelRawEOLChanged()
				],
				this._versionId,
				false,
				false
			),
			this._createContentChanged2(new Range(1, 1, endLineNumber, endColumn), 0, oldModelValueLength, new Position(endLineNumber, endColumn), this.getValue(), false, false, false, true, EditSources.eolChange())
		);
	}

	private _onBeforeEOLChange(): void {
		// Ensure all decorations get their `range` set.
		this._decorationsTree.ensureAllNodesHaveRanges(this);
	}

	private _onAfterEOLChange(): void {
		// Transform back `range` to offsets
		const versionId = this.getVersionId();
		const allDecorations = this._decorationsTree.collectNodesPostOrder();
		for (let i = 0, len = allDecorations.length; i < len; i++) {
			const node = allDecorations[i];
			const range = node.range!; // the range is defined due to `_onBeforeEOLChange`

			const delta = node.cachedAbsoluteStart - node.start;

			const startOffset = this._buffer.getOffsetAt(range.startLineNumber, range.startColumn);
			const endOffset = this._buffer.getOffsetAt(range.endLineNumber, range.endColumn);

			node.cachedAbsoluteStart = startOffset;
			node.cachedAbsoluteEnd = endOffset;
			node.cachedVersionId = versionId;

			node.start = startOffset - delta;
			node.end = endOffset - delta;

			recomputeMaxEnd(node);
		}
	}

	public onBeforeAttached(): model.IAttachedView {
		this._attachedEditorCount++;
		if (this._attachedEditorCount === 1) {
			this._tokenizationTextModelPart.handleDidChangeAttached();
			this._onDidChangeAttached.fire(undefined);
		}
		return this._attachedViews.attachView();
	}

	public onBeforeDetached(view: model.IAttachedView): void {
		this._attachedEditorCount--;
		if (this._attachedEditorCount === 0) {
			this._tokenizationTextModelPart.handleDidChangeAttached();
			this._onDidChangeAttached.fire(undefined);
		}
		this._attachedViews.detachView(view);
	}

	public isAttachedToEditor(): boolean {
		return this._attachedEditorCount > 0;
	}

	public getAttachedEditorCount(): number {
		return this._attachedEditorCount;
	}

	public isTooLargeForSyncing(): boolean {
		return this._isTooLargeForSyncing;
	}

	public isTooLargeForTokenization(): boolean {
		return this._isTooLargeForTokenization;
	}

	public isTooLargeForHeapOperation(): boolean {
		return this._isTooLargeForHeapOperation;
	}

	public isDisposed(): boolean {
		return this._isDisposed;
	}

	public isDominatedByLongLines(): boolean {
		this._assertNotDisposed();
		if (this.isTooLargeForTokenization()) {
			// Cannot word wrap huge files anyways, so it doesn't really matter
			return false;
		}
		let smallLineCharCount = 0;
		let longLineCharCount = 0;

		const lineCount = this._buffer.getLineCount();
		for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
			const lineLength = this._buffer.getLineLength(lineNumber);
			if (lineLength >= LONG_LINE_BOUNDARY) {
				longLineCharCount += lineLength;
			} else {
				smallLineCharCount += lineLength;
			}
		}

		return (longLineCharCount > smallLineCharCount);
	}

	public get uri(): URI {
		return this._associatedResource;
	}

	//#region Options

	public getOptions(): model.TextModelResolvedOptions {
		this._assertNotDisposed();
		return this._options;
	}

	public getFormattingOptions(): FormattingOptions {
		return {
			tabSize: this._options.indentSize,
			insertSpaces: this._options.insertSpaces
		};
	}

	public updateOptions(_newOpts: model.ITextModelUpdateOptions): void {
		this._assertNotDisposed();
		const tabSize = (typeof _newOpts.tabSize !== 'undefined') ? _newOpts.tabSize : this._options.tabSize;
		const indentSize = (typeof _newOpts.indentSize !== 'undefined') ? _newOpts.indentSize : this._options.originalIndentSize;
		const insertSpaces = (typeof _newOpts.insertSpaces !== 'undefined') ? _newOpts.insertSpaces : this._options.insertSpaces;
		const trimAutoWhitespace = (typeof _newOpts.trimAutoWhitespace !== 'undefined') ? _newOpts.trimAutoWhitespace : this._options.trimAutoWhitespace;
		const bracketPairColorizationOptions = (typeof _newOpts.bracketColorizationOptions !== 'undefined') ? _newOpts.bracketColorizationOptions : this._options.bracketPairColorizationOptions;

		const newOpts = new model.TextModelResolvedOptions({
			tabSize: tabSize,
			indentSize: indentSize,
			insertSpaces: insertSpaces,
			defaultEOL: this._options.defaultEOL,
			trimAutoWhitespace: trimAutoWhitespace,
			bracketPairColorizationOptions,
		});

		if (this._options.equals(newOpts)) {
			return;
		}

		const e = this._options.createChangeEvent(newOpts);
		this._options = newOpts;

		this._bracketPairs.handleDidChangeOptions(e);
		this._decorationProvider.handleDidChangeOptions(e);
		this._onDidChangeOptions.fire(e);
	}

	public detectIndentation(defaultInsertSpaces: boolean, defaultTabSize: number): void {
		this._assertNotDisposed();
		const guessedIndentation = guessIndentation(this._buffer, defaultTabSize, defaultInsertSpaces);
		this.updateOptions({
			insertSpaces: guessedIndentation.insertSpaces,
			tabSize: guessedIndentation.tabSize,
			indentSize: guessedIndentation.tabSize, // TODO@Alex: guess indentSize independent of tabSize
		});
	}

	public normalizeIndentation(str: string): string {
		this._assertNotDisposed();
		return normalizeIndentation(str, this._options.indentSize, this._options.insertSpaces);
	}

	//#endregion

	//#region Reading

	public getVersionId(): number {
		this._assertNotDisposed();
		return this._versionId;
	}

	public mightContainRTL(): boolean {
		return this._buffer.mightContainRTL();
	}

	public mightContainUnusualLineTerminators(): boolean {
		return this._buffer.mightContainUnusualLineTerminators();
	}

	public removeUnusualLineTerminators(selections: Selection[] | null = null): void {
		const matches = this.findMatches(strings.UNUSUAL_LINE_TERMINATORS.source, false, true, false, null, false, Constants.MAX_SAFE_SMALL_INTEGER);
		this._buffer.resetMightContainUnusualLineTerminators();
		this.pushEditOperations(selections, matches.map(m => ({ range: m.range, text: null })), () => null);
	}

	public mightContainNonBasicASCII(): boolean {
		return this._buffer.mightContainNonBasicASCII();
	}

	public getAlternativeVersionId(): number {
		this._assertNotDisposed();
		return this._alternativeVersionId;
	}

	public getInitialUndoRedoSnapshot(): ResourceEditStackSnapshot | null {
		this._assertNotDisposed();
		return this._initialUndoRedoSnapshot;
	}

	public getOffsetAt(rawPosition: IPosition): number {
		this._assertNotDisposed();
		const position = this._validatePosition(rawPosition.lineNumber, rawPosition.column, StringOffsetValidationType.Relaxed);
		return this._buffer.getOffsetAt(position.lineNumber, position.column);
	}

	public getPositionAt(rawOffset: number): Position {
		this._assertNotDisposed();
		const offset = (Math.min(this._buffer.getLength(), Math.max(0, rawOffset)));
		return this._buffer.getPositionAt(offset);
	}

	private _increaseVersionId(): void {
		this._versionId = this._versionId + 1;
		this._alternativeVersionId = this._versionId;
	}

	public _overwriteVersionId(versionId: number): void {
		this._versionId = versionId;
	}

	public _overwriteAlternativeVersionId(newAlternativeVersionId: number): void {
		this._alternativeVersionId = newAlternativeVersionId;
	}

	public _overwriteInitialUndoRedoSnapshot(newInitialUndoRedoSnapshot: ResourceEditStackSnapshot | null): void {
		this._initialUndoRedoSnapshot = newInitialUndoRedoSnapshot;
	}

	public getValue(eol?: model.EndOfLinePreference, preserveBOM: boolean = false): string {
		this._assertNotDisposed();
		if (this.isTooLargeForHeapOperation()) {
			throw new BugIndicatingError('Operation would exceed heap memory limits');
		}

		const fullModelRange = this.getFullModelRange();
		const fullModelValue = this.getValueInRange(fullModelRange, eol);

		if (preserveBOM) {
			return this._buffer.getBOM() + fullModelValue;
		}

		return fullModelValue;
	}

	public createSnapshot(preserveBOM: boolean = false): model.ITextSnapshot {
		return new TextModelSnapshot(this._buffer.createSnapshot(preserveBOM));
	}

	public getValueLength(eol?: model.EndOfLinePreference, preserveBOM: boolean = false): number {
		this._assertNotDisposed();
		const fullModelRange = this.getFullModelRange();
		const fullModelValue = this.getValueLengthInRange(fullModelRange, eol);

		if (preserveBOM) {
			return this._buffer.getBOM().length + fullModelValue;
		}

		return fullModelValue;
	}

	public getValueInRange(rawRange: IRange, eol: model.EndOfLinePreference = model.EndOfLinePreference.TextDefined): string {
		this._assertNotDisposed();
		return this._buffer.getValueInRange(this.validateRange(rawRange), eol);
	}

	public getValueLengthInRange(rawRange: IRange, eol: model.EndOfLinePreference = model.EndOfLinePreference.TextDefined): number {
		this._assertNotDisposed();
		return this._buffer.getValueLengthInRange(this.validateRange(rawRange), eol);
	}

	public getCharacterCountInRange(rawRange: IRange, eol: model.EndOfLinePreference = model.EndOfLinePreference.TextDefined): number {
		this._assertNotDisposed();
		return this._buffer.getCharacterCountInRange(this.validateRange(rawRange), eol);
	}

	public getLineCount(): number {
		this._assertNotDisposed();
		return this._buffer.getLineCount();
	}

	public getLineContent(lineNumber: number): string {
		this._assertNotDisposed();
		if (lineNumber < 1 || lineNumber > this.getLineCount()) {
			throw new BugIndicatingError('Illegal value for lineNumber');
		}

		return this._buffer.getLineContent(lineNumber);
	}

	public getLineLength(lineNumber: number): number {
		this._assertNotDisposed();
		if (lineNumber < 1 || lineNumber > this.getLineCount()) {
			throw new BugIndicatingError('Illegal value for lineNumber');
		}

		return this._buffer.getLineLength(lineNumber);
	}

	public getLinesContent(): string[] {
		this._assertNotDisposed();
		if (this.isTooLargeForHeapOperation()) {
			throw new BugIndicatingError('Operation would exceed heap memory limits');
		}

		return this._buffer.getLinesContent();
	}

	public getEOL(): string {
		this._assertNotDisposed();
		return this._buffer.getEOL();
	}

	public getEndOfLineSequence(): model.EndOfLineSequence {
		this._assertNotDisposed();
		return (
			this._buffer.getEOL() === '\n'
				? model.EndOfLineSequence.LF
				: model.EndOfLineSequence.CRLF
		);
	}

	public getLineMinColumn(lineNumber: number): number {
		this._assertNotDisposed();
		return 1;
	}

	public getLineMaxColumn(lineNumber: number): number {
		this._assertNotDisposed();
		if (lineNumber < 1 || lineNumber > this.getLineCount()) {
			throw new BugIndicatingError('Illegal value for lineNumber');
		}
		return this._buffer.getLineLength(lineNumber) + 1;
	}

	public getLineFirstNonWhitespaceColumn(lineNumber: number): number {
		this._assertNotDisposed();
		if (lineNumber < 1 || lineNumber > this.getLineCount()) {
			throw new BugIndicatingError('Illegal value for lineNumber');
		}
		return this._buffer.getLineFirstNonWhitespaceColumn(lineNumber);
	}

	public getLineLastNonWhitespaceColumn(lineNumber: number): number {
		this._assertNotDisposed();
		if (lineNumber < 1 || lineNumber > this.getLineCount()) {
			throw new BugIndicatingError('Illegal value for lineNumber');
		}
		return this._buffer.getLineLastNonWhitespaceColumn(lineNumber);
	}

	/**
	 * Validates `range` is within buffer bounds, but allows it to sit in between surrogate pairs, etc.
	 * Will try to not allocate if possible.
	 */
	public _validateRangeRelaxedNoAllocations(range: IRange): Range {
		const linesCount = this._buffer.getLineCount();

		const initialStartLineNumber = range.startLineNumber;
		const initialStartColumn = range.startColumn;
		let startLineNumber = Math.floor((typeof initialStartLineNumber === 'number' && !isNaN(initialStartLineNumber)) ? initialStartLineNumber : 1);
		let startColumn = Math.floor((typeof initialStartColumn === 'number' && !isNaN(initialStartColumn)) ? initialStartColumn : 1);

		if (startLineNumber < 1) {
			startLineNumber = 1;
			startColumn = 1;
		} else if (startLineNumber > linesCount) {
			startLineNumber = linesCount;
			startColumn = this.getLineMaxColumn(startLineNumber);
		} else {
			if (startColumn <= 1) {
				startColumn = 1;
			} else {
				const maxColumn = this.getLineMaxColumn(startLineNumber);
				if (startColumn >= maxColumn) {
					startColumn = maxColumn;
				}
			}
		}

		const initialEndLineNumber = range.endLineNumber;
		const initialEndColumn = range.endColumn;
		let endLineNumber = Math.floor((typeof initialEndLineNumber === 'number' && !isNaN(initialEndLineNumber)) ? initialEndLineNumber : 1);
		let endColumn = Math.floor((typeof initialEndColumn === 'number' && !isNaN(initialEndColumn)) ? initialEndColumn : 1);

		if (endLineNumber < 1) {
			endLineNumber = 1;
			endColumn = 1;
		} else if (endLineNumber > linesCount) {
			endLineNumber = linesCount;
			endColumn = this.getLineMaxColumn(endLineNumber);
		} else {
			if (endColumn <= 1) {
				endColumn = 1;
			} else {
				const maxColumn = this.getLineMaxColumn(endLineNumber);
				if (endColumn >= maxColumn) {
					endColumn = maxColumn;
				}
			}
		}

		if (
			initialStartLineNumber === startLineNumber
			&& initialStartColumn === startColumn
			&& initialEndLineNumber === endLineNumber
			&& initialEndColumn === endColumn
			&& range instanceof Range
			&& !(range instanceof Selection)
		) {
			return range;
		}

		return new Range(startLineNumber, startColumn, endLineNumber, endColumn);
	}

	private _isValidPosition(lineNumber: number, column: number, validationType: StringOffsetValidationType): boolean {
		if (typeof lineNumber !== 'number' || typeof column !== 'number') {
			return false;
		}

		if (isNaN(lineNumber) || isNaN(column)) {
			return false;
		}

		if (lineNumber < 1 || column < 1) {
			return false;
		}

		if ((lineNumber | 0) !== lineNumber || (column | 0) !== column) {
			return false;
		}

		const lineCount = this._buffer.getLineCount();
		if (lineNumber > lineCount) {
			return false;
		}

		if (column === 1) {
			return true;
		}

		const maxColumn = this.getLineMaxColumn(lineNumber);
		if (column > maxColumn) {
			return false;
		}

		if (validationType === StringOffsetValidationType.SurrogatePairs) {
			// !!At this point, column > 1
			const charCodeBefore = this._buffer.getLineCharCode(lineNumber, column - 2);
			if (strings.isHighSurrogate(charCodeBefore)) {
				return false;
			}
		}

		return true;
	}

	private _validatePosition(_lineNumber: number, _column: number, validationType: StringOffsetValidationType): Position {
		const lineNumber = Math.floor((typeof _lineNumber === 'number' && !isNaN(_lineNumber)) ? _lineNumber : 1);
		const column = Math.floor((typeof _column === 'number' && !isNaN(_column)) ? _column : 1);
		const lineCount = this._buffer.getLineCount();

		if (lineNumber < 1) {
			return new Position(1, 1);
		}

		if (lineNumber > lineCount) {
			return new Position(lineCount, this.getLineMaxColumn(lineCount));
		}

		if (column <= 1) {
			return new Position(lineNumber, 1);
		}

		const maxColumn = this.getLineMaxColumn(lineNumber);
		if (column >= maxColumn) {
			return new Position(lineNumber, maxColumn);
		}

		if (validationType === StringOffsetValidationType.SurrogatePairs) {
			// If the position would end up in the middle of a high-low surrogate pair,
			// we move it to before the pair
			// !!At this point, column > 1
			const charCodeBefore = this._buffer.getLineCharCode(lineNumber, column - 2);
			if (strings.isHighSurrogate(charCodeBefore)) {
				return new Position(lineNumber, column - 1);
			}
		}

		return new Position(lineNumber, column);
	}

	public validatePosition(position: IPosition): Position {
		const validationType = StringOffsetValidationType.SurrogatePairs;
		this._assertNotDisposed();

		// Avoid object allocation and cover most likely case
		if (position instanceof Position) {
			if (this._isValidPosition(position.lineNumber, position.column, validationType)) {
				return position;
			}
		}

		return this._validatePosition(position.lineNumber, position.column, validationType);
	}

	public isValidRange(range: Range): boolean {
		return this._isValidRange(range, StringOffsetValidationType.SurrogatePairs);
	}

	private _isValidRange(range: Range, validationType: StringOffsetValidationType): boolean {
		const startLineNumber = range.startLineNumber;
		const startColumn = range.startColumn;
		const endLineNumber = range.endLineNumber;
		const endColumn = range.endColumn;

		if (!this._isValidPosition(startLineNumber, startColumn, StringOffsetValidationType.Relaxed)) {
			return false;
		}
		if (!this._isValidPosition(endLineNumber, endColumn, StringOffsetValidationType.Relaxed)) {
			return false;
		}

		if (validationType === StringOffsetValidationType.SurrogatePairs) {
			const charCodeBeforeStart = (startColumn > 1 ? this._buffer.getLineCharCode(startLineNumber, startColumn - 2) : 0);
			const charCodeBeforeEnd = (endColumn > 1 && endColumn <= this._buffer.getLineLength(endLineNumber) ? this._buffer.getLineCharCode(endLineNumber, endColumn - 2) : 0);

			const startInsideSurrogatePair = strings.isHighSurrogate(charCodeBeforeStart);
			const endInsideSurrogatePair = strings.isHighSurrogate(charCodeBeforeEnd);

			if (!startInsideSurrogatePair && !endInsideSurrogatePair) {
				return true;
			}
			return false;
		}

		return true;
	}

	public validateRange(_range: IRange): Range {
		const validationType = StringOffsetValidationType.SurrogatePairs;
		this._assertNotDisposed();

		// Avoid object allocation and cover most likely case
		if ((_range instanceof Range) && !(_range instanceof Selection)) {
			if (this._isValidRange(_range, validationType)) {
				return _range;
			}
		}

		const start = this._validatePosition(_range.startLineNumber, _range.startColumn, StringOffsetValidationType.Relaxed);
		const end = this._validatePosition(_range.endLineNumber, _range.endColumn, StringOffsetValidationType.Relaxed);

		const startLineNumber = start.lineNumber;
		const startColumn = start.column;
		const endLineNumber = end.lineNumber;
		const endColumn = end.column;

		if (validationType === StringOffsetValidationType.SurrogatePairs) {
			const charCodeBeforeStart = (startColumn > 1 ? this._buffer.getLineCharCode(startLineNumber, startColumn - 2) : 0);
			const charCodeBeforeEnd = (endColumn > 1 && endColumn <= this._buffer.getLineLength(endLineNumber) ? this._buffer.getLineCharCode(endLineNumber, endColumn - 2) : 0);

			const startInsideSurrogatePair = strings.isHighSurrogate(charCodeBeforeStart);
			const endInsideSurrogatePair = strings.isHighSurrogate(charCodeBeforeEnd);

			if (!startInsideSurrogatePair && !endInsideSurrogatePair) {
				return new Range(startLineNumber, startColumn, endLineNumber, endColumn);
			}

			if (startLineNumber === endLineNumber && startColumn === endColumn) {
				// do not expand a collapsed range, simply move it to a valid location
				return new Range(startLineNumber, startColumn - 1, endLineNumber, endColumn - 1);
			}

			if (startInsideSurrogatePair && endInsideSurrogatePair) {
				// expand range at both ends
				return new Range(startLineNumber, startColumn - 1, endLineNumber, endColumn + 1);
			}

			if (startInsideSurrogatePair) {
				// only expand range at the start
				return new Range(startLineNumber, startColumn - 1, endLineNumber, endColumn);
			}

			// only expand range at the end
			return new Range(startLineNumber, startColumn, endLineNumber, endColumn + 1);
		}

		return new Range(startLineNumber, startColumn, endLineNumber, endColumn);
	}

	public modifyPosition(rawPosition: IPosition, offset: number): Position {
		this._assertNotDisposed();
		const candidate = this.getOffsetAt(rawPosition) + offset;
		return this.getPositionAt(Math.min(this._buffer.getLength(), Math.max(0, candidate)));
	}

	public getFullModelRange(): Range {
		this._assertNotDisposed();
		const lineCount = this.getLineCount();
		return new Range(1, 1, lineCount, this.getLineMaxColumn(lineCount));
	}

	private findMatchesLineByLine(searchRange: Range, searchData: model.SearchData, captureMatches: boolean, limitResultCount: number): model.FindMatch[] {
		return this._buffer.findMatchesLineByLine(searchRange, searchData, captureMatches, limitResultCount);
	}

	public findMatches(searchString: string, rawSearchScope: boolean | IRange | IRange[] | null, isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean, limitResultCount: number = LIMIT_FIND_COUNT): model.FindMatch[] {
		this._assertNotDisposed();

		let searchRanges: Range[] | null = null;

		if (rawSearchScope !== null && typeof rawSearchScope !== 'boolean') {
			if (!Array.isArray(rawSearchScope)) {
				rawSearchScope = [rawSearchScope];
			}

			if (rawSearchScope.every((searchScope: IRange) => Range.isIRange(searchScope))) {
				searchRanges = rawSearchScope.map((searchScope: IRange) => this.validateRange(searchScope));
			}
		}

		if (searchRanges === null) {
			searchRanges = [this.getFullModelRange()];
		}

		searchRanges = searchRanges.sort((d1, d2) => d1.startLineNumber - d2.startLineNumber || d1.startColumn - d2.startColumn);

		const uniqueSearchRanges: Range[] = [];
		uniqueSearchRanges.push(searchRanges.reduce((prev, curr) => {
			if (Range.areIntersecting(prev, curr)) {
				return prev.plusRange(curr);
			}

			uniqueSearchRanges.push(prev);
			return curr;
		}));

		let matchMapper: (value: Range, index: number, array: Range[]) => model.FindMatch[];
		if (!isRegex && searchString.indexOf('\n') < 0) {
			// not regex, not multi line
			const searchParams = new SearchParams(searchString, isRegex, matchCase, wordSeparators);
			const searchData = searchParams.parseSearchRequest();

			if (!searchData) {
				return [];
			}

			matchMapper = (searchRange: Range) => this.findMatchesLineByLine(searchRange, searchData, captureMatches, limitResultCount);
		} else {
			matchMapper = (searchRange: Range) => TextModelSearch.findMatches(this, new SearchParams(searchString, isRegex, matchCase, wordSeparators), searchRange, captureMatches, limitResultCount);
		}

		return uniqueSearchRanges.map(matchMapper).reduce((arr, matches: model.FindMatch[]) => arr.concat(matches), []);
	}

	public findNextMatch(searchString: string, rawSearchStart: IPosition, isRegex: boolean, matchCase: boolean, wordSeparators: string, captureMatches: boolean): model.FindMatch | null {
		this._assertNotDisposed();
		const searchStart = this.validatePosition(rawSearchStart);

		if (!isRegex && searchString.indexOf('\n') < 0) {
			const searchParams = new SearchParams(searchString, isRegex, matchCase, wordSeparators);
			const searchData = searchParams.parseSearchRequest();
			if (!searchData) {
				return null;
			}

			const lineCount = this.getLineCount();
			let searchRange = new Range(searchStart.lineNumber, searchStart.column, lineCount, this.getLineMaxColumn(lineCount));
			let ret = this.findMatchesLineByLine(searchRange, searchData, captureMatches, 1);
			TextModelSearch.findNextMatch(this, new SearchParams(searchString, isRegex, matchCase, wordSeparators), searchStart, captureMatches);
			if (ret.length > 0) {
				return ret[0];
			}

			searchRange = new Range(1, 1, searchStart.lineNumber, this.getLineMaxColumn(searchStart.lineNumber));
			ret = this.findMatchesLineByLine(searchRange, searchData, captureMatches, 1);

			if (ret.length > 0) {
				return ret[0];
			}

			return null;
		}

		return TextModelSearch.findNextMatch(this, new SearchParams(searchString, isRegex, matchCase, wordSeparators), searchStart, captureMatches);
	}

	public findPreviousMatch(searchString: string, rawSearchStart: IPosition, isRegex: boolean, matchCase: boolean, wordSeparators: string, captureMatches: boolean): model.FindMatch | null {
		this._assertNotDisposed();
		const searchStart = this.validatePosition(rawSearchStart);
		return TextModelSearch.findPreviousMatch(this, new SearchParams(searchString, isRegex, matchCase, wordSeparators), searchStart, captureMatches);
	}

	//#endregion

	//#region Editing

	public pushStackElement(): void {
		this._commandManager.pushStackElement();
	}

	public popStackElement(): void {
		this._commandManager.popStackElement();
	}

	public pushEOL(eol: model.EndOfLineSequence): void {
		const currentEOL = (this.getEOL() === '\n' ? model.EndOfLineSequence.LF : model.EndOfLineSequence.CRLF);
		if (currentEOL === eol) {
			return;
		}
		try {
			this._onDidChangeDecorations.beginDeferredEmit();
			this._eventEmitter.beginDeferredEmit();
			if (this._initialUndoRedoSnapshot === null) {
				this._initialUndoRedoSnapshot = this._undoRedoService.createSnapshot(this.uri);
			}
			this._commandManager.pushEOL(eol);
		} finally {
			this._eventEmitter.endDeferredEmit();
			this._onDidChangeDecorations.endDeferredEmit();
		}
	}

	private _validateEditOperation(rawOperation: model.IIdentifiedSingleEditOperation): model.ValidAnnotatedEditOperation {
		if (rawOperation instanceof model.ValidAnnotatedEditOperation) {
			return rawOperation;
		}

		const validatedRange = this.validateRange(rawOperation.range);

		// Normalize edit when replacement text ends with lone CR
		// and the range ends right before a CRLF in the buffer.
		// We strip the trailing CR from the replacement text.
		let opText = rawOperation.text;
		if (opText) {
			const endsWithLoneCR = (
				opText.length > 0 && opText.charCodeAt(opText.length - 1) === CharCode.CarriageReturn
			);
			const removeTrailingCR = (
				this.getEOL() === '\r\n' && endsWithLoneCR && validatedRange.endColumn === this.getLineMaxColumn(validatedRange.endLineNumber)
			);
			if (removeTrailingCR) {
				opText = opText.substring(0, opText.length - 1);
			}
		}

		return new model.ValidAnnotatedEditOperation(
			rawOperation.identifier || null,
			validatedRange,
			opText,
			rawOperation.forceMoveMarkers || false,
			rawOperation.isAutoWhitespaceEdit || false,
			rawOperation._isTracked || false
		);
	}

	private _validateEditOperations(rawOperations: readonly model.IIdentifiedSingleEditOperation[]): model.ValidAnnotatedEditOperation[] {
		const result: model.ValidAnnotatedEditOperation[] = [];
		for (let i = 0, len = rawOperations.length; i < len; i++) {
			result[i] = this._validateEditOperation(rawOperations[i]);
		}
		return result;
	}

	public edit(edit: TextEdit, options?: { reason?: TextModelEditSource }): void {
		this.pushEditOperations(null, edit.replacements.map(r => ({ range: r.range, text: r.text })), null);
	}

	public pushEditOperations(beforeCursorState: Selection[] | null, editOperations: model.IIdentifiedSingleEditOperation[], cursorStateComputer: model.ICursorStateComputer | null, group?: UndoRedoGroup, reason?: TextModelEditSource): Selection[] | null {
		try {
			this._onDidChangeDecorations.beginDeferredEmit();
			this._eventEmitter.beginDeferredEmit();
			return this._pushEditOperations(beforeCursorState, this._validateEditOperations(editOperations), cursorStateComputer, group, reason);
		} finally {
			this._eventEmitter.endDeferredEmit();
			this._onDidChangeDecorations.endDeferredEmit();
		}
	}

	private _pushEditOperations(beforeCursorState: Selection[] | null, editOperations: model.ValidAnnotatedEditOperation[], cursorStateComputer: model.ICursorStateComputer | null, group?: UndoRedoGroup, reason?: TextModelEditSource): Selection[] | null {
		if (this._options.trimAutoWhitespace && this._trimAutoWhitespaceLines) {
			// Go through each saved line number and insert a trim whitespace edit
			// if it is safe to do so (no conflicts with other edits).

			const incomingEdits = editOperations.map((op) => {
				return {
					range: this.validateRange(op.range),
					text: op.text
				};
			});

			// Sometimes, auto-formatters change ranges automatically which can cause undesired auto whitespace trimming near the cursor
			// We'll use the following heuristic: if the edits occur near the cursor, then it's ok to trim auto whitespace
			let editsAreNearCursors = true;
			if (beforeCursorState) {
				for (let i = 0, len = beforeCursorState.length; i < len; i++) {
					const sel = beforeCursorState[i];
					let foundEditNearSel = false;
					for (let j = 0, lenJ = incomingEdits.length; j < lenJ; j++) {
						const editRange = incomingEdits[j].range;
						const selIsAbove = editRange.startLineNumber > sel.endLineNumber;
						const selIsBelow = sel.startLineNumber > editRange.endLineNumber;
						if (!selIsAbove && !selIsBelow) {
							foundEditNearSel = true;
							break;
						}
					}
					if (!foundEditNearSel) {
						editsAreNearCursors = false;
						break;
					}
				}
			}

			if (editsAreNearCursors) {
				for (let i = 0, len = this._trimAutoWhitespaceLines.length; i < len; i++) {
					const trimLineNumber = this._trimAutoWhitespaceLines[i];
					const maxLineColumn = this.getLineMaxColumn(trimLineNumber);

					let allowTrimLine = true;
					for (let j = 0, lenJ = incomingEdits.length; j < lenJ; j++) {
						const editRange = incomingEdits[j].range;
						const editText = incomingEdits[j].text;

						if (trimLineNumber < editRange.startLineNumber || trimLineNumber > editRange.endLineNumber) {
							// `trimLine` is completely outside this edit
							continue;
						}

						// At this point:
						//   editRange.startLineNumber <= trimLine <= editRange.endLineNumber

						if (
							trimLineNumber === editRange.startLineNumber && editRange.startColumn === maxLineColumn
							&& editRange.isEmpty() && editText && editText.length > 0 && editText.charAt(0) === '\n'
						) {
							// This edit inserts a new line (and maybe other text) after `trimLine`
							continue;
						}

						if (
							trimLineNumber === editRange.startLineNumber && editRange.startColumn === 1
							&& editRange.isEmpty() && editText && editText.length > 0 && editText.charAt(editText.length - 1) === '\n'
						) {
							// This edit inserts a new line (and maybe other text) before `trimLine`
							continue;
						}

						// Looks like we can't trim this line as it would interfere with an incoming edit
						allowTrimLine = false;
						break;
					}

					if (allowTrimLine) {
						const trimRange = new Range(trimLineNumber, 1, trimLineNumber, maxLineColumn);
						editOperations.push(new model.ValidAnnotatedEditOperation(null, trimRange, null, false, false, false));
					}

				}
			}

			this._trimAutoWhitespaceLines = null;
		}
		if (this._initialUndoRedoSnapshot === null) {
			this._initialUndoRedoSnapshot = this._undoRedoService.createSnapshot(this.uri);
		}
		return this._commandManager.pushEditOperation(beforeCursorState, editOperations, cursorStateComputer, group, reason);
	}

	_applyUndo(changes: TextChange[], eol: model.EndOfLineSequence, resultingAlternativeVersionId: number, resultingSelection: Selection[] | null): void {
		const edits = changes.map<ISingleEditOperation>((change) => {
			const rangeStart = this.getPositionAt(change.newPosition);
			const rangeEnd = this.getPositionAt(change.newEnd);
			return {
				range: new Range(rangeStart.lineNumber, rangeStart.column, rangeEnd.lineNumber, rangeEnd.column),
				text: change.oldText
			};
		});
		this._applyUndoRedoEdits(edits, eol, true, false, resultingAlternativeVersionId, resultingSelection);
	}

	_applyRedo(changes: TextChange[], eol: model.EndOfLineSequence, resultingAlternativeVersionId: number, resultingSelection: Selection[] | null): void {
		const edits = changes.map<ISingleEditOperation>((change) => {
			const rangeStart = this.getPositionAt(change.oldPosition);
			const rangeEnd = this.getPositionAt(change.oldEnd);
			return {
				range: new Range(rangeStart.lineNumber, rangeStart.column, rangeEnd.lineNumber, rangeEnd.column),
				text: change.newText
			};
		});
		this._applyUndoRedoEdits(edits, eol, false, true, resultingAlternativeVersionId, resultingSelection);
	}

	private _applyUndoRedoEdits(edits: ISingleEditOperation[], eol: model.EndOfLineSequence, isUndoing: boolean, isRedoing: boolean, resultingAlternativeVersionId: number, resultingSelection: Selection[] | null): void {
		try {
			this._onDidChangeDecorations.beginDeferredEmit();
			this._eventEmitter.beginDeferredEmit();
			this._isUndoing = isUndoing;
			this._isRedoing = isRedoing;
			this.applyEdits(edits, false);
			this.setEOL(eol);
			this._overwriteAlternativeVersionId(resultingAlternativeVersionId);
		} finally {
			this._isUndoing = false;
			this._isRedoing = false;
			this._eventEmitter.endDeferredEmit(resultingSelection);
			this._onDidChangeDecorations.endDeferredEmit();
		}
	}

	public applyEdits(operations: readonly model.IIdentifiedSingleEditOperation[]): void;
	public applyEdits(operations: readonly model.IIdentifiedSingleEditOperation[], computeUndoEdits: false): void;
	public applyEdits(operations: readonly model.IIdentifiedSingleEditOperation[], computeUndoEdits: true): model.IValidEditOperation[];
	/** @internal */
	public applyEdits(operations: readonly model.IIdentifiedSingleEditOperation[], computeUndoEdits: false, reason: TextModelEditSource): void;
	/** @internal */
	public applyEdits(operations: readonly model.IIdentifiedSingleEditOperation[], computeUndoEdits: true, reason: TextModelEditSource): model.IValidEditOperation[];
	public applyEdits(rawOperations: readonly model.IIdentifiedSingleEditOperation[], computeUndoEdits?: boolean, reason?: TextModelEditSource): void | model.IValidEditOperation[] {
		try {
			this._onDidChangeDecorations.beginDeferredEmit();
			this._eventEmitter.beginDeferredEmit();
			const operations = this._validateEditOperations(rawOperations);

			return this._doApplyEdits(operations, computeUndoEdits ?? false, reason ?? EditSources.applyEdits());
		} finally {
			this._eventEmitter.endDeferredEmit();
			this._onDidChangeDecorations.endDeferredEmit();
		}
	}

	private _doApplyEdits(rawOperations: model.ValidAnnotatedEditOperation[], computeUndoEdits: boolean, reason: TextModelEditSource): void | model.IValidEditOperation[] {

		const oldLineCount = this._buffer.getLineCount();
		const result = this._buffer.applyEdits(rawOperations, this._options.trimAutoWhitespace, computeUndoEdits);
		const newLineCount = this._buffer.getLineCount();

		const contentChanges = result.changes;
		this._trimAutoWhitespaceLines = result.trimAutoWhitespaceLineNumbers;

		if (contentChanges.length !== 0) {
			// We do a first pass to update decorations
			// because we want to read decorations in the second pass
			// where we will emit content change events
			// and we want to read the final decorations
			for (let i = 0, len = contentChanges.length; i < len; i++) {
				const change = contentChanges[i];
				this._decorationsTree.acceptReplace(change.rangeOffset, change.rangeLength, change.text.length, change.forceMoveMarkers);
			}

			const rawContentChanges: ModelRawChange[] = [];

			this._increaseVersionId();

			let lineCount = oldLineCount;
			for (let i = 0, len = contentChanges.length; i < len; i++) {
				const change = contentChanges[i];
				const [eolCount] = countEOL(change.text);
				this._onDidChangeDecorations.fire();

				const startLineNumber = change.range.startLineNumber;
				const endLineNumber = change.range.endLineNumber;

				const deletingLinesCnt = endLineNumber - startLineNumber;
				const insertingLinesCnt = eolCount;
				const editingLinesCnt = Math.min(deletingLinesCnt, insertingLinesCnt);

				const changeLineCountDelta = (insertingLinesCnt - deletingLinesCnt);

				const currentEditStartLineNumber = newLineCount - lineCount - changeLineCountDelta + startLineNumber;
				const firstEditLineNumber = currentEditStartLineNumber;
				const lastInsertedLineNumber = currentEditStartLineNumber + insertingLinesCnt;

				const decorationsWithInjectedTextInEditedRange = this._decorationsTree.getInjectedTextInInterval(
					this,
					this.getOffsetAt(new Position(firstEditLineNumber, 1)),
					this.getOffsetAt(new Position(lastInsertedLineNumber, this.getLineMaxColumn(lastInsertedLineNumber))),
					0
				);


				const injectedTextInEditedRange = LineInjectedText.fromDecorations(decorationsWithInjectedTextInEditedRange);
				const injectedTextInEditedRangeQueue = new ArrayQueue(injectedTextInEditedRange);

				for (let j = editingLinesCnt; j >= 0; j--) {
					const editLineNumber = startLineNumber + j;
					const currentEditLineNumber = currentEditStartLineNumber + j;

					injectedTextInEditedRangeQueue.takeFromEndWhile(r => r.lineNumber > currentEditLineNumber);
					const decorationsInCurrentLine = injectedTextInEditedRangeQueue.takeFromEndWhile(r => r.lineNumber === currentEditLineNumber);

					rawContentChanges.push(
						new ModelRawLineChanged(
							editLineNumber,
							this.getLineContent(currentEditLineNumber),
							decorationsInCurrentLine
						));
				}

				if (editingLinesCnt < deletingLinesCnt) {
					// Must delete some lines
					const spliceStartLineNumber = startLineNumber + editingLinesCnt;
					rawContentChanges.push(new ModelRawLinesDeleted(spliceStartLineNumber + 1, endLineNumber));
				}

				if (editingLinesCnt < insertingLinesCnt) {
					const injectedTextInEditedRangeQueue = new ArrayQueue(injectedTextInEditedRange);
					// Must insert some lines
					const spliceLineNumber = startLineNumber + editingLinesCnt;
					const cnt = insertingLinesCnt - editingLinesCnt;
					const fromLineNumber = newLineCount - lineCount - cnt + spliceLineNumber + 1;
					const injectedTexts: (LineInjectedText[] | null)[] = [];
					const newLines: string[] = [];
					for (let i = 0; i < cnt; i++) {
						const lineNumber = fromLineNumber + i;
						newLines[i] = this.getLineContent(lineNumber);

						injectedTextInEditedRangeQueue.takeWhile(r => r.lineNumber < lineNumber);
						injectedTexts[i] = injectedTextInEditedRangeQueue.takeWhile(r => r.lineNumber === lineNumber);
					}

					rawContentChanges.push(
						new ModelRawLinesInserted(
							spliceLineNumber + 1,
							startLineNumber + insertingLinesCnt,
							newLines,
							injectedTexts
						)
					);
				}

				lineCount += changeLineCountDelta;
			}

			this._emitContentChangedEvent(
				new ModelRawContentChangedEvent(
					rawContentChanges,
					this.getVersionId(),
					this._isUndoing,
					this._isRedoing
				),
				{
					changes: contentChanges,
					eol: this._buffer.getEOL(),
					isEolChange: false,
					versionId: this.getVersionId(),
					isUndoing: this._isUndoing,
					isRedoing: this._isRedoing,
					isFlush: false,
					detailedReasons: [reason],
					detailedReasonsChangeLengths: [contentChanges.length],
				}
			);
		}

		return (result.reverseEdits === null ? undefined : result.reverseEdits);
	}

	public undo(): void | Promise<void> {
		return this._undoRedoService.undo(this.uri);
	}

	public canUndo(): boolean {
		return this._undoRedoService.canUndo(this.uri);
	}

	public redo(): void | Promise<void> {
		return this._undoRedoService.redo(this.uri);
	}

	public canRedo(): boolean {
		return this._undoRedoService.canRedo(this.uri);
	}

	//#endregion

	//#region Decorations

	private handleBeforeFireDecorationsChangedEvent(affectedInjectedTextLines: Set<number> | null, affectedLineHeights: Set<LineHeightChangingDecoration> | null, affectedFontLines: Set<LineFontChangingDecoration> | null): void {
		// This is called before the decoration changed event is fired.

		if (affectedInjectedTextLines && affectedInjectedTextLines.size > 0) {
			const affectedLines = Array.from(affectedInjectedTextLines);
			const lineChangeEvents = affectedLines.map(lineNumber => new ModelRawLineChanged(lineNumber, this.getLineContent(lineNumber), this._getInjectedTextInLine(lineNumber)));
			this._onDidChangeInjectedText.fire(new ModelInjectedTextChangedEvent(lineChangeEvents));
		}
		this._fireOnDidChangeLineHeight(affectedLineHeights);
		this._fireOnDidChangeFont(affectedFontLines);
	}

	private _fireOnDidChangeLineHeight(affectedLineHeights: Set<LineHeightChangingDecoration> | null): void {
		if (affectedLineHeights && affectedLineHeights.size > 0) {
			const affectedLines = Array.from(affectedLineHeights);
			const lineHeightChangeEvent = affectedLines.map(specialLineHeightChange => new ModelLineHeightChanged(specialLineHeightChange.ownerId, specialLineHeightChange.decorationId, specialLineHeightChange.lineNumber, specialLineHeightChange.lineHeight));
			this._onDidChangeLineHeight.fire(new ModelLineHeightChangedEvent(lineHeightChangeEvent));
		}
	}

	private _fireOnDidChangeFont(affectedFontLines: Set<LineFontChangingDecoration> | null): void {
		if (affectedFontLines && affectedFontLines.size > 0) {
			const affectedLines = Array.from(affectedFontLines);
			const fontChangeEvent = affectedLines.map(fontChange => new ModelFontChanged(fontChange.ownerId, fontChange.lineNumber));
			this._onDidChangeFont.fire(new ModelFontChangedEvent(fontChangeEvent));
		}
	}

	public changeDecorations<T>(callback: (changeAccessor: model.IModelDecorationsChangeAccessor) => T, ownerId: number = 0): T | null {
		this._assertNotDisposed();

		try {
			this._onDidChangeDecorations.beginDeferredEmit();
			return this._changeDecorations(ownerId, callback);
		} finally {
			this._onDidChangeDecorations.endDeferredEmit();
		}
	}

	private _changeDecorations<T>(ownerId: number, callback: (changeAccessor: model.IModelDecorationsChangeAccessor) => T): T | null {
		const changeAccessor: model.IModelDecorationsChangeAccessor = {
			addDecoration: (range: IRange, options: model.IModelDecorationOptions): string => {
				return this._deltaDecorationsImpl(ownerId, [], [{ range: range, options: options }])[0];
			},
			changeDecoration: (id: string, newRange: IRange): void => {
				this._changeDecorationImpl(ownerId, id, newRange);
			},
			changeDecorationOptions: (id: string, options: model.IModelDecorationOptions) => {
				this._changeDecorationOptionsImpl(ownerId, id, _normalizeOptions(options));
			},
			removeDecoration: (id: string): void => {
				this._deltaDecorationsImpl(ownerId, [id], []);
			},
			deltaDecorations: (oldDecorations: string[], newDecorations: model.IModelDeltaDecoration[]): string[] => {
				if (oldDecorations.length === 0 && newDecorations.length === 0) {
					// nothing to do
					return [];
				}
				return this._deltaDecorationsImpl(ownerId, oldDecorations, newDecorations);
			}
		};
		let result: T | null = null;
		try {
			result = callback(changeAccessor);
		} catch (e) {
			onUnexpectedError(e);
		}
		// Invalidate change accessor
		changeAccessor.addDecoration = invalidFunc;
		changeAccessor.changeDecoration = invalidFunc;
		changeAccessor.changeDecorationOptions = invalidFunc;
		changeAccessor.removeDecoration = invalidFunc;
		changeAccessor.deltaDecorations = invalidFunc;
		return result;
	}

	public deltaDecorations(oldDecorations: string[], newDecorations: model.IModelDeltaDecoration[], ownerId: number = 0): string[] {
		this._assertNotDisposed();
		if (!oldDecorations) {
			oldDecorations = [];
		}
		if (oldDecorations.length === 0 && newDecorations.length === 0) {
			// nothing to do
			return [];
		}

		try {
			this._deltaDecorationCallCnt++;
			if (this._deltaDecorationCallCnt > 1) {
				console.warn(`Invoking deltaDecorations recursively could lead to leaking decorations.`);
				onUnexpectedError(new Error(`Invoking deltaDecorations recursively could lead to leaking decorations.`));
			}
			this._onDidChangeDecorations.beginDeferredEmit();
			return this._deltaDecorationsImpl(ownerId, oldDecorations, newDecorations);
		} finally {
			this._onDidChangeDecorations.endDeferredEmit();
			this._deltaDecorationCallCnt--;
		}
	}

	_getTrackedRange(id: string): Range | null {
		return this.getDecorationRange(id);
	}

	_setTrackedRange(id: string | null, newRange: null, newStickiness: model.TrackedRangeStickiness): null;
	_setTrackedRange(id: string | null, newRange: Range, newStickiness: model.TrackedRangeStickiness): string;
	_setTrackedRange(id: string | null, newRange: Range | null, newStickiness: model.TrackedRangeStickiness): string | null {
		const node = (id ? this._decorations[id] : null);

		if (!node) {
			if (!newRange) {
				// node doesn't exist, the request is to delete => nothing to do
				return null;
			}
			// node doesn't exist, the request is to set => add the tracked range
			return this._deltaDecorationsImpl(0, [], [{ range: newRange, options: TRACKED_RANGE_OPTIONS[newStickiness] }], true)[0];
		}

		if (!newRange) {
			// node exists, the request is to delete => delete node
			this._decorationsTree.delete(node);
			delete this._decorations[node.id];
			return null;
		}

		// node exists, the request is to set => change the tracked range and its options
		const range = this._validateRangeRelaxedNoAllocations(newRange);
		const startOffset = this._buffer.getOffsetAt(range.startLineNumber, range.startColumn);
		const endOffset = this._buffer.getOffsetAt(range.endLineNumber, range.endColumn);
		this._decorationsTree.delete(node);
		node.reset(this.getVersionId(), startOffset, endOffset, range);
		node.setOptions(TRACKED_RANGE_OPTIONS[newStickiness]);
		this._decorationsTree.insert(node);
		return node.id;
	}

	public removeAllDecorationsWithOwnerId(ownerId: number): void {
		if (this._isDisposed) {
			return;
		}
		const nodes = this._decorationsTree.collectNodesFromOwner(ownerId);
		for (let i = 0, len = nodes.length; i < len; i++) {
			const node = nodes[i];

			this._decorationsTree.delete(node);
			delete this._decorations[node.id];
		}
	}

	public getDecorationOptions(decorationId: string): model.IModelDecorationOptions | null {
		const node = this._decorations[decorationId];
		if (!node) {
			return null;
		}
		return node.options;
	}

	public getDecorationRange(decorationId: string): Range | null {
		const node = this._decorations[decorationId];
		if (!node) {
			return null;
		}
		return this._decorationsTree.getNodeRange(this, node);
	}

	public getLineDecorations(lineNumber: number, ownerId: number = 0, filterOutValidation: boolean = false, filterFontDecorations: boolean = false): model.IModelDecoration[] {
		if (lineNumber < 1 || lineNumber > this.getLineCount()) {
			return [];
		}
		return this.getLinesDecorations(lineNumber, lineNumber, ownerId, filterOutValidation, filterFontDecorations);
	}

	public getLinesDecorations(_startLineNumber: number, _endLineNumber: number, ownerId: number = 0, filterOutValidation: boolean = false, filterFontDecorations: boolean = false, onlyMarginDecorations: boolean = false): model.IModelDecoration[] {
		const lineCount = this.getLineCount();
		const startLineNumber = Math.min(lineCount, Math.max(1, _startLineNumber));
		const endLineNumber = Math.min(lineCount, Math.max(1, _endLineNumber));
		const endColumn = this.getLineMaxColumn(endLineNumber);
		const range = new Range(startLineNumber, 1, endLineNumber, endColumn);

		const decorations = this._getDecorationsInRange(range, ownerId, filterOutValidation, filterFontDecorations, onlyMarginDecorations);
		pushMany(decorations, this._decorationProvider.getDecorationsInRange(range, ownerId, filterOutValidation));
		pushMany(decorations, this._fontTokenDecorationsProvider.getDecorationsInRange(range, ownerId, filterOutValidation));
		return decorations;
	}

	public getDecorationsInRange(range: IRange, ownerId: number = 0, filterOutValidation: boolean = false, filterFontDecorations: boolean = false, onlyMinimapDecorations: boolean = false, onlyMarginDecorations: boolean = false): model.IModelDecoration[] {
		const validatedRange = this.validateRange(range);

		const decorations = this._getDecorationsInRange(validatedRange, ownerId, filterOutValidation, filterFontDecorations, onlyMarginDecorations);
		pushMany(decorations, this._decorationProvider.getDecorationsInRange(validatedRange, ownerId, filterOutValidation, onlyMinimapDecorations));
		pushMany(decorations, this._fontTokenDecorationsProvider.getDecorationsInRange(validatedRange, ownerId, filterOutValidation, onlyMinimapDecorations));
		return decorations;
	}

	public getOverviewRulerDecorations(ownerId: number = 0, filterOutValidation: boolean = false, filterFontDecorations: boolean = false): model.IModelDecoration[] {
		return this._decorationsTree.getAll(this, ownerId, filterOutValidation, filterFontDecorations, true, false);
	}

	public getInjectedTextDecorations(ownerId: number = 0): model.IModelDecoration[] {
		return this._decorationsTree.getAllInjectedText(this, ownerId);
	}

	public getCustomLineHeightsDecorations(ownerId: number = 0): model.IModelDecoration[] {
		return this._decorationsTree.getAllCustomLineHeights(this, ownerId);
	}

	private _getInjectedTextInLine(lineNumber: number): LineInjectedText[] {
		const startOffset = this._buffer.getOffsetAt(lineNumber, 1);
		const endOffset = startOffset + this._buffer.getLineLength(lineNumber);

		const result = this._decorationsTree.getInjectedTextInInterval(this, startOffset, endOffset, 0);
		return LineInjectedText.fromDecorations(result).filter(t => t.lineNumber === lineNumber);
	}

	public getFontDecorationsInRange(range: IRange, ownerId: number = 0): model.IModelDecoration[] {
		const startOffset = this._buffer.getOffsetAt(range.startLineNumber, range.startColumn);
		const endOffset = this._buffer.getOffsetAt(range.endLineNumber, range.endColumn);
		return this._decorationsTree.getFontDecorationsInInterval(this, startOffset, endOffset, ownerId);
	}

	public getAllDecorations(ownerId: number = 0, filterOutValidation: boolean = false, filterFontDecorations: boolean = false): model.IModelDecoration[] {
		let result = this._decorationsTree.getAll(this, ownerId, filterOutValidation, filterFontDecorations, false, false);
		result = result.concat(this._decorationProvider.getAllDecorations(ownerId, filterOutValidation));
		result = result.concat(this._fontTokenDecorationsProvider.getAllDecorations(ownerId, filterOutValidation));
		return result;
	}

	public getAllMarginDecorations(ownerId: number = 0): model.IModelDecoration[] {
		return this._decorationsTree.getAll(this, ownerId, false, false, false, true);
	}

	private _getDecorationsInRange(filterRange: Range, filterOwnerId: number, filterOutValidation: boolean, filterFontDecorations: boolean, onlyMarginDecorations: boolean): model.IModelDecoration[] {
		const startOffset = this._buffer.getOffsetAt(filterRange.startLineNumber, filterRange.startColumn);
		const endOffset = this._buffer.getOffsetAt(filterRange.endLineNumber, filterRange.endColumn);
		return this._decorationsTree.getAllInInterval(this, startOffset, endOffset, filterOwnerId, filterOutValidation, filterFontDecorations, onlyMarginDecorations);
	}

	public getRangeAt(start: number, end: number): Range {
		return this._buffer.getRangeAt(start, end - start);
	}

	private _changeDecorationImpl(ownerId: number, decorationId: string, _range: IRange): void {
		const node = this._decorations[decorationId];
		if (!node) {
			return;
		}

		if (node.options.after) {
			const oldRange = this.getDecorationRange(decorationId);
			this._onDidChangeDecorations.recordLineAffectedByInjectedText(oldRange!.endLineNumber);
		}
		if (node.options.before) {
			const oldRange = this.getDecorationRange(decorationId);
			this._onDidChangeDecorations.recordLineAffectedByInjectedText(oldRange!.startLineNumber);
		}
		if (node.options.lineHeight !== null) {
			const oldRange = this.getDecorationRange(decorationId);
			this._onDidChangeDecorations.recordLineAffectedByLineHeightChange(ownerId, decorationId, oldRange!.startLineNumber, null);
		}
		if (node.options.affectsFont) {
			const oldRange = this.getDecorationRange(decorationId);
			this._onDidChangeDecorations.recordLineAffectedByFontChange(ownerId, node.id, oldRange!.startLineNumber);
		}

		const range = this._validateRangeRelaxedNoAllocations(_range);
		const startOffset = this._buffer.getOffsetAt(range.startLineNumber, range.startColumn);
		const endOffset = this._buffer.getOffsetAt(range.endLineNumber, range.endColumn);

		this._decorationsTree.delete(node);
		node.reset(this.getVersionId(), startOffset, endOffset, range);
		this._decorationsTree.insert(node);
		this._onDidChangeDecorations.checkAffectedAndFire(node.options);

		if (node.options.after) {
			this._onDidChangeDecorations.recordLineAffectedByInjectedText(range.endLineNumber);
		}
		if (node.options.before) {
			this._onDidChangeDecorations.recordLineAffectedByInjectedText(range.startLineNumber);
		}
		if (node.options.lineHeight !== null) {
			this._onDidChangeDecorations.recordLineAffectedByLineHeightChange(ownerId, decorationId, range.startLineNumber, node.options.lineHeight);
		}
		if (node.options.affectsFont) {
			this._onDidChangeDecorations.recordLineAffectedByFontChange(ownerId, node.id, range.startLineNumber);
		}
	}

	private _changeDecorationOptionsImpl(ownerId: number, decorationId: string, options: ModelDecorationOptions): void {
		const node = this._decorations[decorationId];
		if (!node) {
			return;
		}

		const nodeWasInOverviewRuler = (node.options.overviewRuler && node.options.overviewRuler.color ? true : false);
		const nodeIsInOverviewRuler = (options.overviewRuler && options.overviewRuler.color ? true : false);

		this._onDidChangeDecorations.checkAffectedAndFire(node.options);
		this._onDidChangeDecorations.checkAffectedAndFire(options);

		if (node.options.after || options.after) {
			const nodeRange = this._decorationsTree.getNodeRange(this, node);
			this._onDidChangeDecorations.recordLineAffectedByInjectedText(nodeRange.endLineNumber);
		}
		if (node.options.before || options.before) {
			const nodeRange = this._decorationsTree.getNodeRange(this, node);
			this._onDidChangeDecorations.recordLineAffectedByInjectedText(nodeRange.startLineNumber);
		}
		if (node.options.lineHeight !== null || options.lineHeight !== null) {
			const nodeRange = this._decorationsTree.getNodeRange(this, node);
			this._onDidChangeDecorations.recordLineAffectedByLineHeightChange(ownerId, decorationId, nodeRange.startLineNumber, options.lineHeight);
		}
		if (node.options.affectsFont || options.affectsFont) {
			const nodeRange = this._decorationsTree.getNodeRange(this, node);
			this._onDidChangeDecorations.recordLineAffectedByFontChange(ownerId, decorationId, nodeRange.startLineNumber);
		}

		const movedInOverviewRuler = nodeWasInOverviewRuler !== nodeIsInOverviewRuler;
		const changedWhetherInjectedText = isOptionsInjectedText(options) !== isNodeInjectedText(node);
		if (movedInOverviewRuler || changedWhetherInjectedText) {
			this._decorationsTree.delete(node);
			node.setOptions(options);
			this._decorationsTree.insert(node);
		} else {
			node.setOptions(options);
		}
	}

	private _deltaDecorationsImpl(ownerId: number, oldDecorationsIds: string[], newDecorations: model.IModelDeltaDecoration[], suppressEvents: boolean = false): string[] {
		const versionId = this.getVersionId();

		const oldDecorationsLen = oldDecorationsIds.length;
		let oldDecorationIndex = 0;

		const newDecorationsLen = newDecorations.length;
		let newDecorationIndex = 0;

		this._onDidChangeDecorations.beginDeferredEmit();
		try {
			const result = new Array<string>(newDecorationsLen);
			while (oldDecorationIndex < oldDecorationsLen || newDecorationIndex < newDecorationsLen) {

				let node: IntervalNode | null = null;

				if (oldDecorationIndex < oldDecorationsLen) {
					// (1) get ourselves an old node
					let decorationId: string;
					do {
						decorationId = oldDecorationsIds[oldDecorationIndex++];
						node = this._decorations[decorationId];
					} while (!node && oldDecorationIndex < oldDecorationsLen);

					// (2) remove the node from the tree (if it exists)
					if (node) {
						if (node.options.after) {
							const nodeRange = this._decorationsTree.getNodeRange(this, node);
							this._onDidChangeDecorations.recordLineAffectedByInjectedText(nodeRange.endLineNumber);
						}
						if (node.options.before) {
							const nodeRange = this._decorationsTree.getNodeRange(this, node);
							this._onDidChangeDecorations.recordLineAffectedByInjectedText(nodeRange.startLineNumber);
						}
						if (node.options.lineHeight !== null) {
							const nodeRange = this._decorationsTree.getNodeRange(this, node);
							this._onDidChangeDecorations.recordLineAffectedByLineHeightChange(ownerId, decorationId, nodeRange.startLineNumber, null);
						}
						if (node.options.affectsFont) {
							const nodeRange = this._decorationsTree.getNodeRange(this, node);
							this._onDidChangeDecorations.recordLineAffectedByFontChange(ownerId, decorationId, nodeRange.startLineNumber);
						}
						this._decorationsTree.delete(node);

						if (!suppressEvents) {
							this._onDidChangeDecorations.checkAffectedAndFire(node.options);
						}
					}
				}

				if (newDecorationIndex < newDecorationsLen) {
					// (3) create a new node if necessary
					if (!node) {
						const internalDecorationId = (++this._lastDecorationId);
						const decorationId = `${this._instanceId};${internalDecorationId}`;
						node = new IntervalNode(decorationId, 0, 0);
						this._decorations[decorationId] = node;
					}

					// (4) initialize node
					const newDecoration = newDecorations[newDecorationIndex];
					const range = this._validateRangeRelaxedNoAllocations(newDecoration.range);
					const options = _normalizeOptions(newDecoration.options);
					const startOffset = this._buffer.getOffsetAt(range.startLineNumber, range.startColumn);
					const endOffset = this._buffer.getOffsetAt(range.endLineNumber, range.endColumn);

					node.ownerId = ownerId;
					node.reset(versionId, startOffset, endOffset, range);
					node.setOptions(options);

					if (node.options.after) {
						this._onDidChangeDecorations.recordLineAffectedByInjectedText(range.endLineNumber);
					}
					if (node.options.before) {
						this._onDidChangeDecorations.recordLineAffectedByInjectedText(range.startLineNumber);
					}
					if (node.options.lineHeight !== null) {
						this._onDidChangeDecorations.recordLineAffectedByLineHeightChange(ownerId, node.id, range.startLineNumber, node.options.lineHeight);
					}
					if (node.options.affectsFont) {
						this._onDidChangeDecorations.recordLineAffectedByFontChange(ownerId, node.id, range.startLineNumber);
					}
					if (!suppressEvents) {
						this._onDidChangeDecorations.checkAffectedAndFire(options);
					}

					this._decorationsTree.insert(node);

					result[newDecorationIndex] = node.id;

					newDecorationIndex++;
				} else {
					if (node) {
						delete this._decorations[node.id];
					}
				}
			}

			return result;
		} finally {
			this._onDidChangeDecorations.endDeferredEmit();
		}
	}

	//#endregion

	//#region Tokenization

	// TODO move them to the tokenization part.
	public getLanguageId(): string {
		return this.tokenization.getLanguageId();
	}

	public setLanguage(languageIdOrSelection: string | ILanguageSelection, source?: string): void {
		if (typeof languageIdOrSelection === 'string') {
			this._languageSelectionListener.clear();
			this._setLanguage(languageIdOrSelection, source);
		} else {
			this._languageSelectionListener.value = languageIdOrSelection.onDidChange(() => this._setLanguage(languageIdOrSelection.languageId, source));
			this._setLanguage(languageIdOrSelection.languageId, source);
		}
	}

	private _setLanguage(languageId: string, source?: string): void {
		this.tokenization.setLanguageId(languageId, source);
		this._languageService.requestRichLanguageFeatures(languageId);
	}

	public getLanguageIdAtPosition(lineNumber: number, column: number): string {
		return this.tokenization.getLanguageIdAtPosition(lineNumber, column);
	}

	public getWordAtPosition(position: IPosition): IWordAtPosition | null {
		return this._tokenizationTextModelPart.getWordAtPosition(position);
	}

	public getWordUntilPosition(position: IPosition): IWordAtPosition {
		return this._tokenizationTextModelPart.getWordUntilPosition(position);
	}

	//#endregion
	normalizePosition(position: Position, affinity: model.PositionAffinity): Position {
		return position;
	}

	/**
	 * Gets the column at which indentation stops at a given line.
	 * @internal
	*/
	public getLineIndentColumn(lineNumber: number): number {
		// Columns start with 1.
		return indentOfLine(this.getLineContent(lineNumber)) + 1;
	}

	public override toString(): string {
		return `TextModel(${this.uri.toString()})`;
	}
}

export function indentOfLine(line: string): number {
	let indent = 0;
	for (const c of line) {
		if (c === ' ' || c === '\t') {
			indent++;
		} else {
			break;
		}
	}
	return indent;
}

//#region Decorations

function isNodeInOverviewRuler(node: IntervalNode): boolean {
	return (node.options.overviewRuler && node.options.overviewRuler.color ? true : false);
}

function isOptionsInjectedText(options: ModelDecorationOptions): boolean {
	return !!options.after || !!options.before;
}

function isNodeInjectedText(node: IntervalNode): boolean {
	return !!node.options.after || !!node.options.before;
}

export interface IDecorationsTreesHost {
	getVersionId(): number;
	getRangeAt(start: number, end: number): Range;
}

class DecorationsTrees {

	/**
	 * This tree holds decorations that do not show up in the overview ruler.
	 */
	private readonly _decorationsTree0: IntervalTree;

	/**
	 * This tree holds decorations that show up in the overview ruler.
	 */
	private readonly _decorationsTree1: IntervalTree;

	/**
	 * This tree holds decorations that contain injected text.
	 */
	private readonly _injectedTextDecorationsTree: IntervalTree;

	constructor() {
		this._decorationsTree0 = new IntervalTree();
		this._decorationsTree1 = new IntervalTree();
		this._injectedTextDecorationsTree = new IntervalTree();
	}

	public ensureAllNodesHaveRanges(host: IDecorationsTreesHost): void {
		this.getAll(host, 0, false, false, false, false);
	}

	private _ensureNodesHaveRanges(host: IDecorationsTreesHost, nodes: IntervalNode[]): model.IModelDecoration[] {
		for (const node of nodes) {
			if (node.range === null) {
				node.range = host.getRangeAt(node.cachedAbsoluteStart, node.cachedAbsoluteEnd);
			}
		}
		return <model.IModelDecoration[]>nodes;
	}

	public getAllInInterval(host: IDecorationsTreesHost, start: number, end: number, filterOwnerId: number, filterOutValidation: boolean, filterFontDecorations: boolean, onlyMarginDecorations: boolean): model.IModelDecoration[] {
		const versionId = host.getVersionId();
		const result = this._intervalSearch(start, end, filterOwnerId, filterOutValidation, filterFontDecorations, versionId, onlyMarginDecorations);
		return this._ensureNodesHaveRanges(host, result);
	}

	private _intervalSearch(start: number, end: number, filterOwnerId: number, filterOutValidation: boolean, filterFontDecorations: boolean, cachedVersionId: number, onlyMarginDecorations: boolean): IntervalNode[] {
		const r0 = this._decorationsTree0.intervalSearch(start, end, filterOwnerId, filterOutValidation, filterFontDecorations, cachedVersionId, onlyMarginDecorations);
		const r1 = this._decorationsTree1.intervalSearch(start, end, filterOwnerId, filterOutValidation, filterFontDecorations, cachedVersionId, onlyMarginDecorations);
		const r2 = this._injectedTextDecorationsTree.intervalSearch(start, end, filterOwnerId, filterOutValidation, filterFontDecorations, cachedVersionId, onlyMarginDecorations);
		return r0.concat(r1).concat(r2);
	}

	public getInjectedTextInInterval(host: IDecorationsTreesHost, start: number, end: number, filterOwnerId: number): model.IModelDecoration[] {
		const versionId = host.getVersionId();
		const result = this._injectedTextDecorationsTree.intervalSearch(start, end, filterOwnerId, false, false, versionId, false);
		return this._ensureNodesHaveRanges(host, result).filter((i) => i.options.showIfCollapsed || !i.range.isEmpty());
	}

	public getFontDecorationsInInterval(host: IDecorationsTreesHost, start: number, end: number, filterOwnerId: number): model.IModelDecoration[] {
		const versionId = host.getVersionId();
		const decorations = this._decorationsTree0.intervalSearch(start, end, filterOwnerId, false, false, versionId, false);
		return this._ensureNodesHaveRanges(host, decorations).filter((i) => i.options.affectsFont);
	}

	public getAllInjectedText(host: IDecorationsTreesHost, filterOwnerId: number): model.IModelDecoration[] {
		const versionId = host.getVersionId();
		const result = this._injectedTextDecorationsTree.search(filterOwnerId, false, false, versionId, false);
		return this._ensureNodesHaveRanges(host, result).filter((i) => i.options.showIfCollapsed || !i.range.isEmpty());
	}

	public getAllCustomLineHeights(host: IDecorationsTreesHost, filterOwnerId: number): model.IModelDecoration[] {
		const versionId = host.getVersionId();
		const result = this._search(filterOwnerId, false, false, false, versionId, false);
		return this._ensureNodesHaveRanges(host, result).filter((i) => typeof i.options.lineHeight === 'number');
	}

	public getAll(host: IDecorationsTreesHost, filterOwnerId: number, filterOutValidation: boolean, filterFontDecorations: boolean, overviewRulerOnly: boolean, onlyMarginDecorations: boolean): model.IModelDecoration[] {
		const versionId = host.getVersionId();
		const result = this._search(filterOwnerId, filterOutValidation, filterFontDecorations, overviewRulerOnly, versionId, onlyMarginDecorations);
		return this._ensureNodesHaveRanges(host, result);
	}

	private _search(filterOwnerId: number, filterOutValidation: boolean, filterFontDecorations: boolean, overviewRulerOnly: boolean, cachedVersionId: number, onlyMarginDecorations: boolean): IntervalNode[] {
		if (overviewRulerOnly) {
			return this._decorationsTree1.search(filterOwnerId, filterOutValidation, filterFontDecorations, cachedVersionId, onlyMarginDecorations);
		} else {
			const r0 = this._decorationsTree0.search(filterOwnerId, filterOutValidation, filterFontDecorations, cachedVersionId, onlyMarginDecorations);
			const r1 = this._decorationsTree1.search(filterOwnerId, filterOutValidation, filterFontDecorations, cachedVersionId, onlyMarginDecorations);
			const r2 = this._injectedTextDecorationsTree.search(filterOwnerId, filterOutValidation, filterFontDecorations, cachedVersionId, onlyMarginDecorations);
			return r0.concat(r1).concat(r2);
		}
	}

	public collectNodesFromOwner(ownerId: number): IntervalNode[] {
		const r0 = this._decorationsTree0.collectNodesFromOwner(ownerId);
		const r1 = this._decorationsTree1.collectNodesFromOwner(ownerId);
		const r2 = this._injectedTextDecorationsTree.collectNodesFromOwner(ownerId);
		return r0.concat(r1).concat(r2);
	}

	public collectNodesPostOrder(): IntervalNode[] {
		const r0 = this._decorationsTree0.collectNodesPostOrder();
		const r1 = this._decorationsTree1.collectNodesPostOrder();
		const r2 = this._injectedTextDecorationsTree.collectNodesPostOrder();
		return r0.concat(r1).concat(r2);
	}

	public insert(node: IntervalNode): void {
		if (isNodeInjectedText(node)) {
			this._injectedTextDecorationsTree.insert(node);
		} else if (isNodeInOverviewRuler(node)) {
			this._decorationsTree1.insert(node);
		} else {
			this._decorationsTree0.insert(node);
		}
	}

	public delete(node: IntervalNode): void {
		if (isNodeInjectedText(node)) {
			this._injectedTextDecorationsTree.delete(node);
		} else if (isNodeInOverviewRuler(node)) {
			this._decorationsTree1.delete(node);
		} else {
			this._decorationsTree0.delete(node);
		}
	}

	public getNodeRange(host: IDecorationsTreesHost, node: IntervalNode): Range {
		const versionId = host.getVersionId();
		if (node.cachedVersionId !== versionId) {
			this._resolveNode(node, versionId);
		}
		if (node.range === null) {
			node.range = host.getRangeAt(node.cachedAbsoluteStart, node.cachedAbsoluteEnd);
		}
		return node.range;
	}

	private _resolveNode(node: IntervalNode, cachedVersionId: number): void {
		if (isNodeInjectedText(node)) {
			this._injectedTextDecorationsTree.resolveNode(node, cachedVersionId);
		} else if (isNodeInOverviewRuler(node)) {
			this._decorationsTree1.resolveNode(node, cachedVersionId);
		} else {
			this._decorationsTree0.resolveNode(node, cachedVersionId);
		}
	}

	public acceptReplace(offset: number, length: number, textLength: number, forceMoveMarkers: boolean): void {
		this._decorationsTree0.acceptReplace(offset, length, textLength, forceMoveMarkers);
		this._decorationsTree1.acceptReplace(offset, length, textLength, forceMoveMarkers);
		this._injectedTextDecorationsTree.acceptReplace(offset, length, textLength, forceMoveMarkers);
	}
}

function cleanClassName(className: string): string {
	return className.replace(/[^a-z0-9\-_]/gi, ' ');
}

class DecorationOptions implements model.IDecorationOptions {
	readonly color: string | ThemeColor;
	readonly darkColor: string | ThemeColor;

	constructor(options: model.IDecorationOptions) {
		this.color = options.color || '';
		this.darkColor = options.darkColor || '';

	}
}

export class ModelDecorationOverviewRulerOptions extends DecorationOptions {
	readonly position: model.OverviewRulerLane;
	private _resolvedColor: string | null;

	constructor(options: model.IModelDecorationOverviewRulerOptions) {
		super(options);
		this._resolvedColor = null;
		this.position = (typeof options.position === 'number' ? options.position : model.OverviewRulerLane.Center);
	}

	public getColor(theme: IColorTheme): string {
		if (!this._resolvedColor) {
			if (isDark(theme.type) && this.darkColor) {
				this._resolvedColor = this._resolveColor(this.darkColor, theme);
			} else {
				this._resolvedColor = this._resolveColor(this.color, theme);
			}
		}
		return this._resolvedColor;
	}

	public invalidateCachedColor(): void {
		this._resolvedColor = null;
	}

	private _resolveColor(color: string | ThemeColor, theme: IColorTheme): string {
		if (typeof color === 'string') {
			return color;
		}
		const c = color ? theme.getColor(color.id) : null;
		if (!c) {
			return '';
		}
		return c.toString();
	}
}

export class ModelDecorationGlyphMarginOptions {
	readonly position: model.GlyphMarginLane;
	readonly persistLane: boolean | undefined;

	constructor(options: model.IModelDecorationGlyphMarginOptions | null | undefined) {
		this.position = options?.position ?? model.GlyphMarginLane.Center;
		this.persistLane = options?.persistLane;
	}
}

export class ModelDecorationMinimapOptions extends DecorationOptions {
	readonly position: model.MinimapPosition;
	readonly sectionHeaderStyle: model.MinimapSectionHeaderStyle | null;
	readonly sectionHeaderText: string | null;
	private _resolvedColor: Color | undefined;

	constructor(options: model.IModelDecorationMinimapOptions) {
		super(options);
		this.position = options.position;
		this.sectionHeaderStyle = options.sectionHeaderStyle ?? null;
		this.sectionHeaderText = options.sectionHeaderText ?? null;
	}

	public getColor(theme: IColorTheme): Color | undefined {
		if (!this._resolvedColor) {
			if (isDark(theme.type) && this.darkColor) {
				this._resolvedColor = this._resolveColor(this.darkColor, theme);
			} else {
				this._resolvedColor = this._resolveColor(this.color, theme);
			}
		}

		return this._resolvedColor;
	}

	public invalidateCachedColor(): void {
		this._resolvedColor = undefined;
	}

	private _resolveColor(color: string | ThemeColor, theme: IColorTheme): Color | undefined {
		if (typeof color === 'string') {
			return Color.fromHex(color);
		}
		return theme.getColor(color.id);
	}
}

export class ModelDecorationInjectedTextOptions implements model.InjectedTextOptions {
	public static from(options: model.InjectedTextOptions): ModelDecorationInjectedTextOptions {
		if (options instanceof ModelDecorationInjectedTextOptions) {
			return options;
		}
		return new ModelDecorationInjectedTextOptions(options);
	}

	public readonly content: string;
	public readonly tokens: TokenArray | null;
	readonly inlineClassName: string | null;
	readonly inlineClassNameAffectsLetterSpacing: boolean;
	readonly attachedData: unknown | null;
	readonly cursorStops: model.InjectedTextCursorStops | null;

	private constructor(options: model.InjectedTextOptions) {
		this.content = options.content || '';
		this.tokens = options.tokens ?? null;
		this.inlineClassName = options.inlineClassName || null;
		this.inlineClassNameAffectsLetterSpacing = options.inlineClassNameAffectsLetterSpacing || false;
		this.attachedData = options.attachedData || null;
		this.cursorStops = options.cursorStops || null;
	}
}

export class ModelDecorationOptions implements model.IModelDecorationOptions {

	public static EMPTY: ModelDecorationOptions;

	public static register(options: model.IModelDecorationOptions): ModelDecorationOptions {
		return new ModelDecorationOptions(options);
	}

	public static createDynamic(options: model.IModelDecorationOptions): ModelDecorationOptions {
		return new ModelDecorationOptions(options);
	}
	readonly description: string;
	readonly blockClassName: string | null;
	readonly blockIsAfterEnd: boolean | null;
	readonly blockDoesNotCollapse?: boolean | null;
	readonly blockPadding: [top: number, right: number, bottom: number, left: number] | null;
	readonly stickiness: model.TrackedRangeStickiness;
	readonly zIndex: number;
	readonly className: string | null;
	readonly shouldFillLineOnLineBreak: boolean | null;
	readonly hoverMessage: IMarkdownString | IMarkdownString[] | null;
	readonly glyphMarginHoverMessage: IMarkdownString | IMarkdownString[] | null;
	readonly isWholeLine: boolean;
	readonly lineHeight: number | null;
	readonly fontSize: string | null;
	readonly showIfCollapsed: boolean;
	readonly collapseOnReplaceEdit: boolean;
	readonly overviewRuler: ModelDecorationOverviewRulerOptions | null;
	readonly minimap: ModelDecorationMinimapOptions | null;
	readonly glyphMargin?: model.IModelDecorationGlyphMarginOptions | null | undefined;
	readonly glyphMarginClassName: string | null;
	readonly linesDecorationsClassName: string | null;
	readonly lineNumberClassName: string | null;
	readonly lineNumberHoverMessage: IMarkdownString | IMarkdownString[] | null;
	readonly linesDecorationsTooltip: string | null;
	readonly firstLineDecorationClassName: string | null;
	readonly marginClassName: string | null;
	readonly inlineClassName: string | null;
	readonly inlineClassNameAffectsLetterSpacing: boolean;
	readonly beforeContentClassName: string | null;
	readonly afterContentClassName: string | null;
	readonly after: ModelDecorationInjectedTextOptions | null;
	readonly before: ModelDecorationInjectedTextOptions | null;
	readonly hideInCommentTokens: boolean | null;
	readonly hideInStringTokens: boolean | null;
	readonly affectsFont: boolean | null;
	readonly textDirection?: model.TextDirection | null | undefined;

	private constructor(options: model.IModelDecorationOptions) {
		this.description = options.description;
		this.blockClassName = options.blockClassName ? cleanClassName(options.blockClassName) : null;
		this.blockDoesNotCollapse = options.blockDoesNotCollapse ?? null;
		this.blockIsAfterEnd = options.blockIsAfterEnd ?? null;
		this.blockPadding = options.blockPadding ?? null;
		this.stickiness = options.stickiness || model.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges;
		this.zIndex = options.zIndex || 0;
		this.className = options.className ? cleanClassName(options.className) : null;
		this.shouldFillLineOnLineBreak = options.shouldFillLineOnLineBreak ?? null;
		this.hoverMessage = options.hoverMessage || null;
		this.glyphMarginHoverMessage = options.glyphMarginHoverMessage || null;
		this.lineNumberHoverMessage = options.lineNumberHoverMessage || null;
		this.isWholeLine = options.isWholeLine || false;
		this.lineHeight = options.lineHeight ? Math.min(options.lineHeight, LINE_HEIGHT_CEILING) : null;
		this.fontSize = options.fontSize || null;
		this.affectsFont = !!options.fontSize || !!options.fontFamily || !!options.fontWeight || !!options.fontStyle;
		this.showIfCollapsed = options.showIfCollapsed || false;
		this.collapseOnReplaceEdit = options.collapseOnReplaceEdit || false;
		this.overviewRuler = options.overviewRuler ? new ModelDecorationOverviewRulerOptions(options.overviewRuler) : null;
		this.minimap = options.minimap ? new ModelDecorationMinimapOptions(options.minimap) : null;
		this.glyphMargin = options.glyphMarginClassName ? new ModelDecorationGlyphMarginOptions(options.glyphMargin) : null;
		this.glyphMarginClassName = options.glyphMarginClassName ? cleanClassName(options.glyphMarginClassName) : null;
		this.linesDecorationsClassName = options.linesDecorationsClassName ? cleanClassName(options.linesDecorationsClassName) : null;
		this.lineNumberClassName = options.lineNumberClassName ? cleanClassName(options.lineNumberClassName) : null;
		this.linesDecorationsTooltip = options.linesDecorationsTooltip ? strings.htmlAttributeEncodeValue(options.linesDecorationsTooltip) : null;
		this.firstLineDecorationClassName = options.firstLineDecorationClassName ? cleanClassName(options.firstLineDecorationClassName) : null;
		this.marginClassName = options.marginClassName ? cleanClassName(options.marginClassName) : null;
		this.inlineClassName = options.inlineClassName ? cleanClassName(options.inlineClassName) : null;
		this.inlineClassNameAffectsLetterSpacing = options.inlineClassNameAffectsLetterSpacing || false;
		this.beforeContentClassName = options.beforeContentClassName ? cleanClassName(options.beforeContentClassName) : null;
		this.afterContentClassName = options.afterContentClassName ? cleanClassName(options.afterContentClassName) : null;
		this.after = options.after ? ModelDecorationInjectedTextOptions.from(options.after) : null;
		this.before = options.before ? ModelDecorationInjectedTextOptions.from(options.before) : null;
		this.hideInCommentTokens = options.hideInCommentTokens ?? false;
		this.hideInStringTokens = options.hideInStringTokens ?? false;
		this.textDirection = options.textDirection ?? null;
	}
}
ModelDecorationOptions.EMPTY = ModelDecorationOptions.register({ description: 'empty' });

/**
 * The order carefully matches the values of the enum.
 */
const TRACKED_RANGE_OPTIONS = [
	ModelDecorationOptions.register({ description: 'tracked-range-always-grows-when-typing-at-edges', stickiness: model.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges }),
	ModelDecorationOptions.register({ description: 'tracked-range-never-grows-when-typing-at-edges', stickiness: model.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges }),
	ModelDecorationOptions.register({ description: 'tracked-range-grows-only-when-typing-before', stickiness: model.TrackedRangeStickiness.GrowsOnlyWhenTypingBefore }),
	ModelDecorationOptions.register({ description: 'tracked-range-grows-only-when-typing-after', stickiness: model.TrackedRangeStickiness.GrowsOnlyWhenTypingAfter }),
];

function _normalizeOptions(options: model.IModelDecorationOptions): ModelDecorationOptions {
	if (options instanceof ModelDecorationOptions) {
		return options;
	}
	return ModelDecorationOptions.createDynamic(options);
}


class DidChangeDecorationsEmitter extends Disposable {

	private readonly _actual: Emitter<IModelDecorationsChangedEvent> = this._register(new Emitter<IModelDecorationsChangedEvent>());
	public readonly event: Event<IModelDecorationsChangedEvent> = this._actual.event;

	private _deferredCnt: number;
	private _shouldFireDeferred: boolean;
	private _affectsMinimap: boolean;
	private _affectsOverviewRuler: boolean;
	private _affectedInjectedTextLines: Set<number> | null = null;
	private _affectedLineHeights: SetWithKey<LineHeightChangingDecoration> | null = null;
	private _affectedFontLines: SetWithKey<LineFontChangingDecoration> | null = null;
	private _affectsGlyphMargin: boolean;
	private _affectsLineNumber: boolean;

	constructor(private readonly handleBeforeFire: (affectedInjectedTextLines: Set<number> | null, affectedLineHeights: SetWithKey<LineHeightChangingDecoration> | null, affectedFontLines: SetWithKey<LineFontChangingDecoration> | null) => void) {
		super();
		this._deferredCnt = 0;
		this._shouldFireDeferred = false;
		this._affectsMinimap = false;
		this._affectsOverviewRuler = false;
		this._affectsGlyphMargin = false;
		this._affectsLineNumber = false;
	}

	hasListeners(): boolean {
		return this._actual.hasListeners();
	}

	public beginDeferredEmit(): void {
		this._deferredCnt++;
	}

	public endDeferredEmit(): void {
		this._deferredCnt--;
		if (this._deferredCnt === 0) {
			if (this._shouldFireDeferred) {
				this.doFire();
			}

			this._affectedInjectedTextLines?.clear();
			this._affectedInjectedTextLines = null;
			this._affectedLineHeights?.clear();
			this._affectedLineHeights = null;
			this._affectedFontLines?.clear();
			this._affectedFontLines = null;
		}
	}

	public recordLineAffectedByInjectedText(lineNumber: number): void {
		if (!this._affectedInjectedTextLines) {
			this._affectedInjectedTextLines = new Set();
		}
		this._affectedInjectedTextLines.add(lineNumber);
	}

	public recordLineAffectedByLineHeightChange(ownerId: number, decorationId: string, lineNumber: number, lineHeight: number | null): void {
		if (!this._affectedLineHeights) {
			this._affectedLineHeights = new SetWithKey<LineHeightChangingDecoration>([], LineHeightChangingDecoration.toKey);
		}
		this._affectedLineHeights.add(new LineHeightChangingDecoration(ownerId, decorationId, lineNumber, lineHeight));
	}

	public recordLineAffectedByFontChange(ownerId: number, decorationId: string, lineNumber: number): void {
		if (!this._affectedFontLines) {
			this._affectedFontLines = new SetWithKey<LineFontChangingDecoration>([], LineFontChangingDecoration.toKey);
		}
		this._affectedFontLines.add(new LineFontChangingDecoration(ownerId, decorationId, lineNumber));
	}

	public checkAffectedAndFire(options: ModelDecorationOptions): void {
		this._affectsMinimap ||= !!options.minimap?.position;
		this._affectsOverviewRuler ||= !!options.overviewRuler?.color;
		this._affectsGlyphMargin ||= !!options.glyphMarginClassName;
		this._affectsLineNumber ||= !!options.lineNumberClassName;
		this.tryFire();
	}

	public fire(): void {
		this._affectsMinimap = true;
		this._affectsOverviewRuler = true;
		this._affectsGlyphMargin = true;
		this.tryFire();
	}

	private tryFire() {
		if (this._deferredCnt === 0) {
			this.doFire();
		} else {
			this._shouldFireDeferred = true;
		}
	}

	private doFire() {
		this.handleBeforeFire(this._affectedInjectedTextLines, this._affectedLineHeights, this._affectedFontLines);

		const event: IModelDecorationsChangedEvent = {
			affectsMinimap: this._affectsMinimap,
			affectsOverviewRuler: this._affectsOverviewRuler,
			affectsGlyphMargin: this._affectsGlyphMargin,
			affectsLineNumber: this._affectsLineNumber,
		};
		this._shouldFireDeferred = false;
		this._affectsMinimap = false;
		this._affectsOverviewRuler = false;
		this._affectsGlyphMargin = false;
		this._actual.fire(event);
	}
}

//#endregion

class DidChangeContentEmitter extends Disposable {

	/**
	 * Both `fastEvent` and `slowEvent` work the same way and contain the same events, but first we invoke `fastEvent` and then `slowEvent`.
	 */
	private readonly _fastEmitter: Emitter<InternalModelContentChangeEvent> = this._register(new Emitter<InternalModelContentChangeEvent>());
	public readonly fastEvent: Event<InternalModelContentChangeEvent> = this._fastEmitter.event;
	private readonly _slowEmitter: Emitter<InternalModelContentChangeEvent> = this._register(new Emitter<InternalModelContentChangeEvent>());
	public readonly slowEvent: Event<InternalModelContentChangeEvent> = this._slowEmitter.event;

	private _deferredCnt: number;
	private _deferredEvent: InternalModelContentChangeEvent | null;

	constructor() {
		super();
		this._deferredCnt = 0;
		this._deferredEvent = null;
	}

	public hasListeners(): boolean {
		return (
			this._fastEmitter.hasListeners()
			|| this._slowEmitter.hasListeners()
		);
	}

	public beginDeferredEmit(): void {
		this._deferredCnt++;
	}

	public endDeferredEmit(resultingSelection: Selection[] | null = null): void {
		this._deferredCnt--;
		if (this._deferredCnt === 0) {
			if (this._deferredEvent !== null) {
				this._deferredEvent.rawContentChangedEvent.resultingSelection = resultingSelection;
				const e = this._deferredEvent;
				this._deferredEvent = null;
				this._fastEmitter.fire(e);
				this._slowEmitter.fire(e);
			}
		}
	}

	public fire(e: InternalModelContentChangeEvent): void {
		if (this._deferredCnt > 0) {
			if (this._deferredEvent) {
				this._deferredEvent = this._deferredEvent.merge(e);
			} else {
				this._deferredEvent = e;
			}
			return;
		}
		this._fastEmitter.fire(e);
		this._slowEmitter.fire(e);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/textModelPart.ts]---
Location: vscode-main/src/vs/editor/common/model/textModelPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';

export class TextModelPart extends Disposable {
	private _isDisposed = false;

	public override dispose(): void {
		super.dispose();
		this._isDisposed = true;
	}
	protected assertNotDisposed(): void {
		if (this._isDisposed) {
			throw new Error('TextModelPart is disposed!');
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/textModelSearch.ts]---
Location: vscode-main/src/vs/editor/common/model/textModelSearch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import * as strings from '../../../base/common/strings.js';
import { WordCharacterClass, WordCharacterClassifier, getMapForWordSeparators } from '../core/wordCharacterClassifier.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { EndOfLinePreference, FindMatch, SearchData } from '../model.js';
import { TextModel } from './textModel.js';

const LIMIT_FIND_COUNT = 999;

export class SearchParams {
	public readonly searchString: string;
	public readonly isRegex: boolean;
	public readonly matchCase: boolean;
	public readonly wordSeparators: string | null;

	constructor(searchString: string, isRegex: boolean, matchCase: boolean, wordSeparators: string | null) {
		this.searchString = searchString;
		this.isRegex = isRegex;
		this.matchCase = matchCase;
		this.wordSeparators = wordSeparators;
	}

	public parseSearchRequest(): SearchData | null {
		if (this.searchString === '') {
			return null;
		}

		// Try to create a RegExp out of the params
		let multiline: boolean;
		if (this.isRegex) {
			multiline = isMultilineRegexSource(this.searchString);
		} else {
			multiline = (this.searchString.indexOf('\n') >= 0);
		}

		let regex: RegExp | null = null;
		try {
			regex = strings.createRegExp(this.searchString, this.isRegex, {
				matchCase: this.matchCase,
				wholeWord: false,
				multiline: multiline,
				global: true,
				unicode: true
			});
		} catch (err) {
			return null;
		}

		if (!regex) {
			return null;
		}

		let canUseSimpleSearch = (!this.isRegex && !multiline);
		if (canUseSimpleSearch && this.searchString.toLowerCase() !== this.searchString.toUpperCase()) {
			// casing might make a difference
			canUseSimpleSearch = this.matchCase;
		}

		return new SearchData(regex, this.wordSeparators ? getMapForWordSeparators(this.wordSeparators, []) : null, canUseSimpleSearch ? this.searchString : null);
	}
}

export function isMultilineRegexSource(searchString: string): boolean {
	if (!searchString || searchString.length === 0) {
		return false;
	}

	for (let i = 0, len = searchString.length; i < len; i++) {
		const chCode = searchString.charCodeAt(i);

		if (chCode === CharCode.LineFeed) {
			return true;
		}

		if (chCode === CharCode.Backslash) {

			// move to next char
			i++;

			if (i >= len) {
				// string ends with a \
				break;
			}

			const nextChCode = searchString.charCodeAt(i);
			if (nextChCode === CharCode.n || nextChCode === CharCode.r || nextChCode === CharCode.W) {
				return true;
			}
		}
	}

	return false;
}

export function createFindMatch(range: Range, rawMatches: RegExpExecArray, captureMatches: boolean): FindMatch {
	if (!captureMatches) {
		return new FindMatch(range, null);
	}
	const matches: string[] = [];
	for (let i = 0, len = rawMatches.length; i < len; i++) {
		matches[i] = rawMatches[i];
	}
	return new FindMatch(range, matches);
}

class LineFeedCounter {

	private readonly _lineFeedsOffsets: number[];

	constructor(text: string) {
		const lineFeedsOffsets: number[] = [];
		let lineFeedsOffsetsLen = 0;
		for (let i = 0, textLen = text.length; i < textLen; i++) {
			if (text.charCodeAt(i) === CharCode.LineFeed) {
				lineFeedsOffsets[lineFeedsOffsetsLen++] = i;
			}
		}
		this._lineFeedsOffsets = lineFeedsOffsets;
	}

	public findLineFeedCountBeforeOffset(offset: number): number {
		const lineFeedsOffsets = this._lineFeedsOffsets;
		let min = 0;
		let max = lineFeedsOffsets.length - 1;

		if (max === -1) {
			// no line feeds
			return 0;
		}

		if (offset <= lineFeedsOffsets[0]) {
			// before first line feed
			return 0;
		}

		while (min < max) {
			const mid = min + ((max - min) / 2 >> 0);

			if (lineFeedsOffsets[mid] >= offset) {
				max = mid - 1;
			} else {
				if (lineFeedsOffsets[mid + 1] >= offset) {
					// bingo!
					min = mid;
					max = mid;
				} else {
					min = mid + 1;
				}
			}
		}
		return min + 1;
	}
}

export class TextModelSearch {

	public static findMatches(model: TextModel, searchParams: SearchParams, searchRange: Range, captureMatches: boolean, limitResultCount: number): FindMatch[] {
		const searchData = searchParams.parseSearchRequest();
		if (!searchData) {
			return [];
		}

		if (searchData.regex.multiline) {
			return this._doFindMatchesMultiline(model, searchRange, new Searcher(searchData.wordSeparators, searchData.regex), captureMatches, limitResultCount);
		}
		return this._doFindMatchesLineByLine(model, searchRange, searchData, captureMatches, limitResultCount);
	}

	/**
	 * Multiline search always executes on the lines concatenated with \n.
	 * We must therefore compensate for the count of \n in case the model is CRLF
	 */
	private static _getMultilineMatchRange(model: TextModel, deltaOffset: number, text: string, lfCounter: LineFeedCounter | null, matchIndex: number, match0: string): Range {
		let startOffset: number;
		let lineFeedCountBeforeMatch = 0;
		if (lfCounter) {
			lineFeedCountBeforeMatch = lfCounter.findLineFeedCountBeforeOffset(matchIndex);
			startOffset = deltaOffset + matchIndex + lineFeedCountBeforeMatch /* add as many \r as there were \n */;
		} else {
			startOffset = deltaOffset + matchIndex;
		}

		let endOffset: number;
		if (lfCounter) {
			const lineFeedCountBeforeEndOfMatch = lfCounter.findLineFeedCountBeforeOffset(matchIndex + match0.length);
			const lineFeedCountInMatch = lineFeedCountBeforeEndOfMatch - lineFeedCountBeforeMatch;
			endOffset = startOffset + match0.length + lineFeedCountInMatch /* add as many \r as there were \n */;
		} else {
			endOffset = startOffset + match0.length;
		}

		const startPosition = model.getPositionAt(startOffset);
		const endPosition = model.getPositionAt(endOffset);
		return new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
	}

	private static _doFindMatchesMultiline(model: TextModel, searchRange: Range, searcher: Searcher, captureMatches: boolean, limitResultCount: number): FindMatch[] {
		const deltaOffset = model.getOffsetAt(searchRange.getStartPosition());
		// We always execute multiline search over the lines joined with \n
		// This makes it that \n will match the EOL for both CRLF and LF models
		// We compensate for offset errors in `_getMultilineMatchRange`
		const text = model.getValueInRange(searchRange, EndOfLinePreference.LF);
		const lfCounter = (model.getEOL() === '\r\n' ? new LineFeedCounter(text) : null);

		const result: FindMatch[] = [];
		let counter = 0;

		let m: RegExpExecArray | null;
		searcher.reset(0);
		while ((m = searcher.next(text))) {
			result[counter++] = createFindMatch(this._getMultilineMatchRange(model, deltaOffset, text, lfCounter, m.index, m[0]), m, captureMatches);
			if (counter >= limitResultCount) {
				return result;
			}
		}

		return result;
	}

	private static _doFindMatchesLineByLine(model: TextModel, searchRange: Range, searchData: SearchData, captureMatches: boolean, limitResultCount: number): FindMatch[] {
		const result: FindMatch[] = [];
		let resultLen = 0;

		// Early case for a search range that starts & stops on the same line number
		if (searchRange.startLineNumber === searchRange.endLineNumber) {
			const text = model.getLineContent(searchRange.startLineNumber).substring(searchRange.startColumn - 1, searchRange.endColumn - 1);
			resultLen = this._findMatchesInLine(searchData, text, searchRange.startLineNumber, searchRange.startColumn - 1, resultLen, result, captureMatches, limitResultCount);
			return result;
		}

		// Collect results from first line
		const text = model.getLineContent(searchRange.startLineNumber).substring(searchRange.startColumn - 1);
		resultLen = this._findMatchesInLine(searchData, text, searchRange.startLineNumber, searchRange.startColumn - 1, resultLen, result, captureMatches, limitResultCount);

		// Collect results from middle lines
		for (let lineNumber = searchRange.startLineNumber + 1; lineNumber < searchRange.endLineNumber && resultLen < limitResultCount; lineNumber++) {
			resultLen = this._findMatchesInLine(searchData, model.getLineContent(lineNumber), lineNumber, 0, resultLen, result, captureMatches, limitResultCount);
		}

		// Collect results from last line
		if (resultLen < limitResultCount) {
			const text = model.getLineContent(searchRange.endLineNumber).substring(0, searchRange.endColumn - 1);
			resultLen = this._findMatchesInLine(searchData, text, searchRange.endLineNumber, 0, resultLen, result, captureMatches, limitResultCount);
		}

		return result;
	}

	private static _findMatchesInLine(searchData: SearchData, text: string, lineNumber: number, deltaOffset: number, resultLen: number, result: FindMatch[], captureMatches: boolean, limitResultCount: number): number {
		const wordSeparators = searchData.wordSeparators;
		if (!captureMatches && searchData.simpleSearch) {
			const searchString = searchData.simpleSearch;
			const searchStringLen = searchString.length;
			const textLength = text.length;

			let lastMatchIndex = -searchStringLen;
			while ((lastMatchIndex = text.indexOf(searchString, lastMatchIndex + searchStringLen)) !== -1) {
				if (!wordSeparators || isValidMatch(wordSeparators, text, textLength, lastMatchIndex, searchStringLen)) {
					result[resultLen++] = new FindMatch(new Range(lineNumber, lastMatchIndex + 1 + deltaOffset, lineNumber, lastMatchIndex + 1 + searchStringLen + deltaOffset), null);
					if (resultLen >= limitResultCount) {
						return resultLen;
					}
				}
			}
			return resultLen;
		}

		const searcher = new Searcher(searchData.wordSeparators, searchData.regex);
		let m: RegExpExecArray | null;
		// Reset regex to search from the beginning
		searcher.reset(0);
		do {
			m = searcher.next(text);
			if (m) {
				result[resultLen++] = createFindMatch(new Range(lineNumber, m.index + 1 + deltaOffset, lineNumber, m.index + 1 + m[0].length + deltaOffset), m, captureMatches);
				if (resultLen >= limitResultCount) {
					return resultLen;
				}
			}
		} while (m);
		return resultLen;
	}

	public static findNextMatch(model: TextModel, searchParams: SearchParams, searchStart: Position, captureMatches: boolean): FindMatch | null {
		const searchData = searchParams.parseSearchRequest();
		if (!searchData) {
			return null;
		}

		const searcher = new Searcher(searchData.wordSeparators, searchData.regex);

		if (searchData.regex.multiline) {
			return this._doFindNextMatchMultiline(model, searchStart, searcher, captureMatches);
		}
		return this._doFindNextMatchLineByLine(model, searchStart, searcher, captureMatches);
	}

	private static _doFindNextMatchMultiline(model: TextModel, searchStart: Position, searcher: Searcher, captureMatches: boolean): FindMatch | null {
		const searchTextStart = new Position(searchStart.lineNumber, 1);
		const deltaOffset = model.getOffsetAt(searchTextStart);
		const lineCount = model.getLineCount();
		// We always execute multiline search over the lines joined with \n
		// This makes it that \n will match the EOL for both CRLF and LF models
		// We compensate for offset errors in `_getMultilineMatchRange`
		const text = model.getValueInRange(new Range(searchTextStart.lineNumber, searchTextStart.column, lineCount, model.getLineMaxColumn(lineCount)), EndOfLinePreference.LF);
		const lfCounter = (model.getEOL() === '\r\n' ? new LineFeedCounter(text) : null);
		searcher.reset(searchStart.column - 1);
		const m = searcher.next(text);
		if (m) {
			return createFindMatch(
				this._getMultilineMatchRange(model, deltaOffset, text, lfCounter, m.index, m[0]),
				m,
				captureMatches
			);
		}

		if (searchStart.lineNumber !== 1 || searchStart.column !== 1) {
			// Try again from the top
			return this._doFindNextMatchMultiline(model, new Position(1, 1), searcher, captureMatches);
		}

		return null;
	}

	private static _doFindNextMatchLineByLine(model: TextModel, searchStart: Position, searcher: Searcher, captureMatches: boolean): FindMatch | null {
		const lineCount = model.getLineCount();
		const startLineNumber = searchStart.lineNumber;

		// Look in first line
		const text = model.getLineContent(startLineNumber);
		const r = this._findFirstMatchInLine(searcher, text, startLineNumber, searchStart.column, captureMatches);
		if (r) {
			return r;
		}

		for (let i = 1; i <= lineCount; i++) {
			const lineIndex = (startLineNumber + i - 1) % lineCount;
			const text = model.getLineContent(lineIndex + 1);
			const r = this._findFirstMatchInLine(searcher, text, lineIndex + 1, 1, captureMatches);
			if (r) {
				return r;
			}
		}

		return null;
	}

	private static _findFirstMatchInLine(searcher: Searcher, text: string, lineNumber: number, fromColumn: number, captureMatches: boolean): FindMatch | null {
		// Set regex to search from column
		searcher.reset(fromColumn - 1);
		const m: RegExpExecArray | null = searcher.next(text);
		if (m) {
			return createFindMatch(
				new Range(lineNumber, m.index + 1, lineNumber, m.index + 1 + m[0].length),
				m,
				captureMatches
			);
		}
		return null;
	}

	public static findPreviousMatch(model: TextModel, searchParams: SearchParams, searchStart: Position, captureMatches: boolean): FindMatch | null {
		const searchData = searchParams.parseSearchRequest();
		if (!searchData) {
			return null;
		}

		const searcher = new Searcher(searchData.wordSeparators, searchData.regex);

		if (searchData.regex.multiline) {
			return this._doFindPreviousMatchMultiline(model, searchStart, searcher, captureMatches);
		}
		return this._doFindPreviousMatchLineByLine(model, searchStart, searcher, captureMatches);
	}

	private static _doFindPreviousMatchMultiline(model: TextModel, searchStart: Position, searcher: Searcher, captureMatches: boolean): FindMatch | null {
		const matches = this._doFindMatchesMultiline(model, new Range(1, 1, searchStart.lineNumber, searchStart.column), searcher, captureMatches, 10 * LIMIT_FIND_COUNT);
		if (matches.length > 0) {
			return matches[matches.length - 1];
		}

		const lineCount = model.getLineCount();
		if (searchStart.lineNumber !== lineCount || searchStart.column !== model.getLineMaxColumn(lineCount)) {
			// Try again with all content
			return this._doFindPreviousMatchMultiline(model, new Position(lineCount, model.getLineMaxColumn(lineCount)), searcher, captureMatches);
		}

		return null;
	}

	private static _doFindPreviousMatchLineByLine(model: TextModel, searchStart: Position, searcher: Searcher, captureMatches: boolean): FindMatch | null {
		const lineCount = model.getLineCount();
		const startLineNumber = searchStart.lineNumber;

		// Look in first line
		const text = model.getLineContent(startLineNumber).substring(0, searchStart.column - 1);
		const r = this._findLastMatchInLine(searcher, text, startLineNumber, captureMatches);
		if (r) {
			return r;
		}

		for (let i = 1; i <= lineCount; i++) {
			const lineIndex = (lineCount + startLineNumber - i - 1) % lineCount;
			const text = model.getLineContent(lineIndex + 1);
			const r = this._findLastMatchInLine(searcher, text, lineIndex + 1, captureMatches);
			if (r) {
				return r;
			}
		}

		return null;
	}

	private static _findLastMatchInLine(searcher: Searcher, text: string, lineNumber: number, captureMatches: boolean): FindMatch | null {
		let bestResult: FindMatch | null = null;
		let m: RegExpExecArray | null;
		searcher.reset(0);
		while ((m = searcher.next(text))) {
			bestResult = createFindMatch(new Range(lineNumber, m.index + 1, lineNumber, m.index + 1 + m[0].length), m, captureMatches);
		}
		return bestResult;
	}
}

function leftIsWordBounday(wordSeparators: WordCharacterClassifier, text: string, textLength: number, matchStartIndex: number, matchLength: number): boolean {
	if (matchStartIndex === 0) {
		// Match starts at start of string
		return true;
	}

	const charBefore = text.charCodeAt(matchStartIndex - 1);
	if (wordSeparators.get(charBefore) !== WordCharacterClass.Regular) {
		// The character before the match is a word separator
		return true;
	}

	if (charBefore === CharCode.CarriageReturn || charBefore === CharCode.LineFeed) {
		// The character before the match is line break or carriage return.
		return true;
	}

	if (matchLength > 0) {
		const firstCharInMatch = text.charCodeAt(matchStartIndex);
		if (wordSeparators.get(firstCharInMatch) !== WordCharacterClass.Regular) {
			// The first character inside the match is a word separator
			return true;
		}
	}

	return false;
}

function rightIsWordBounday(wordSeparators: WordCharacterClassifier, text: string, textLength: number, matchStartIndex: number, matchLength: number): boolean {
	if (matchStartIndex + matchLength === textLength) {
		// Match ends at end of string
		return true;
	}

	const charAfter = text.charCodeAt(matchStartIndex + matchLength);
	if (wordSeparators.get(charAfter) !== WordCharacterClass.Regular) {
		// The character after the match is a word separator
		return true;
	}

	if (charAfter === CharCode.CarriageReturn || charAfter === CharCode.LineFeed) {
		// The character after the match is line break or carriage return.
		return true;
	}

	if (matchLength > 0) {
		const lastCharInMatch = text.charCodeAt(matchStartIndex + matchLength - 1);
		if (wordSeparators.get(lastCharInMatch) !== WordCharacterClass.Regular) {
			// The last character in the match is a word separator
			return true;
		}
	}

	return false;
}

export function isValidMatch(wordSeparators: WordCharacterClassifier, text: string, textLength: number, matchStartIndex: number, matchLength: number): boolean {
	return (
		leftIsWordBounday(wordSeparators, text, textLength, matchStartIndex, matchLength)
		&& rightIsWordBounday(wordSeparators, text, textLength, matchStartIndex, matchLength)
	);
}

export class Searcher {
	public readonly _wordSeparators: WordCharacterClassifier | null;
	private readonly _searchRegex: RegExp;
	private _prevMatchStartIndex: number;
	private _prevMatchLength: number;

	constructor(wordSeparators: WordCharacterClassifier | null, searchRegex: RegExp,) {
		this._wordSeparators = wordSeparators;
		this._searchRegex = searchRegex;
		this._prevMatchStartIndex = -1;
		this._prevMatchLength = 0;
	}

	public reset(lastIndex: number): void {
		this._searchRegex.lastIndex = lastIndex;
		this._prevMatchStartIndex = -1;
		this._prevMatchLength = 0;
	}

	public next(text: string): RegExpExecArray | null {
		const textLength = text.length;

		let m: RegExpExecArray | null;
		do {
			if (this._prevMatchStartIndex + this._prevMatchLength === textLength) {
				// Reached the end of the line
				return null;
			}

			m = this._searchRegex.exec(text);
			if (!m) {
				return null;
			}

			const matchStartIndex = m.index;
			const matchLength = m[0].length;
			if (matchStartIndex === this._prevMatchStartIndex && matchLength === this._prevMatchLength) {
				if (matchLength === 0) {
					// the search result is an empty string and won't advance `regex.lastIndex`, so `regex.exec` will stuck here
					// we attempt to recover from that by advancing by two if surrogate pair found and by one otherwise
					if (strings.getNextCodePoint(text, textLength, this._searchRegex.lastIndex) > 0xFFFF) {
						this._searchRegex.lastIndex += 2;
					} else {
						this._searchRegex.lastIndex += 1;
					}
					continue;
				}
				// Exit early if the regex matches the same range twice
				return null;
			}
			this._prevMatchStartIndex = matchStartIndex;
			this._prevMatchLength = matchLength;

			if (!this._wordSeparators || isValidMatch(this._wordSeparators, text, textLength, matchStartIndex, matchLength)) {
				return m;
			}

		} while (m);

		return null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/textModelStringEdit.ts]---
Location: vscode-main/src/vs/editor/common/model/textModelStringEdit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditOperation } from '../core/editOperation.js';
import { Range } from '../core/range.js';
import { StringEdit, StringReplacement } from '../core/edits/stringEdit.js';
import { OffsetRange } from '../core/ranges/offsetRange.js';
import { DetailedLineRangeMapping } from '../diff/rangeMapping.js';
import { ITextModel, IIdentifiedSingleEditOperation } from '../model.js';
import { IModelContentChange } from './mirrorTextModel.js';
import { LengthEdit } from '../core/edits/lengthEdit.js';
import { countEOL } from '../core/misc/eolCounter.js';

export function offsetEditToEditOperations(offsetEdit: StringEdit, doc: ITextModel): IIdentifiedSingleEditOperation[] {
	const edits: IIdentifiedSingleEditOperation[] = [];
	for (const singleEdit of offsetEdit.replacements) {
		const range = Range.fromPositions(
			doc.getPositionAt(singleEdit.replaceRange.start),
			doc.getPositionAt(singleEdit.replaceRange.start + singleEdit.replaceRange.length)
		);
		edits.push(EditOperation.replace(range, singleEdit.newText));
	}
	return edits;
}

export function offsetEditFromContentChanges(contentChanges: readonly IModelContentChange[]) {
	const editsArr = contentChanges.map(c => new StringReplacement(OffsetRange.ofStartAndLength(c.rangeOffset, c.rangeLength), c.text));
	editsArr.reverse();
	const edits = new StringEdit(editsArr);
	return edits;
}

export function offsetEditFromLineRangeMapping(original: ITextModel, modified: ITextModel, changes: readonly DetailedLineRangeMapping[]): StringEdit {
	const edits: StringReplacement[] = [];
	for (const c of changes) {
		for (const i of c.innerChanges ?? []) {
			const newText = modified.getValueInRange(i.modifiedRange);

			const startOrig = original.getOffsetAt(i.originalRange.getStartPosition());
			const endExOrig = original.getOffsetAt(i.originalRange.getEndPosition());
			const origRange = new OffsetRange(startOrig, endExOrig);

			edits.push(new StringReplacement(origRange, newText));
		}
	}

	return new StringEdit(edits);
}

export function linesLengthEditFromModelContentChange(c: IModelContentChange[]): LengthEdit {
	const contentChanges = c.slice().reverse();
	const lengthEdits = contentChanges.map(c => LengthEdit.replace(
		// Expand the edit range to include the entire line
		new OffsetRange(c.range.startLineNumber - 1, c.range.endLineNumber),
		countEOL(c.text)[0] + 1)
	);
	const lengthEdit = LengthEdit.compose(lengthEdits);
	return lengthEdit;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/textModelText.ts]---
Location: vscode-main/src/vs/editor/common/model/textModelText.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../core/range.js';
import { AbstractText } from '../core/text/abstractText.js';
import { TextLength } from '../core/text/textLength.js';
import { ITextModel } from '../model.js';

export class TextModelText extends AbstractText {
	constructor(private readonly _textModel: ITextModel) {
		super();
	}

	override getValueOfRange(range: Range): string {
		return this._textModel.getValueInRange(range);
	}

	override getLineLength(lineNumber: number): number {
		return this._textModel.getLineLength(lineNumber);
	}

	get length(): TextLength {
		const lastLineNumber = this._textModel.getLineCount();
		const lastLineLen = this._textModel.getLineLength(lastLineNumber);
		return new TextLength(lastLineNumber - 1, lastLineLen);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/textModelTokens.ts]---
Location: vscode-main/src/vs/editor/common/model/textModelTokens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IdleDeadline, runWhenGlobalIdle } from '../../../base/common/async.js';
import { BugIndicatingError, onUnexpectedError } from '../../../base/common/errors.js';
import { setTimeout0 } from '../../../base/common/platform.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { countEOL } from '../core/misc/eolCounter.js';
import { LineRange } from '../core/ranges/lineRange.js';
import { OffsetRange } from '../core/ranges/offsetRange.js';
import { Position } from '../core/position.js';
import { StandardTokenType } from '../encodedTokenAttributes.js';
import { EncodedTokenizationResult, IBackgroundTokenizationStore, IBackgroundTokenizer, ILanguageIdCodec, IState, ITokenizationSupport } from '../languages.js';
import { nullTokenizeEncoded } from '../languages/nullTokenize.js';
import { ITextModel } from '../model.js';
import { FixedArray } from './fixedArray.js';
import { IModelContentChange } from './mirrorTextModel.js';
import { ContiguousMultilineTokensBuilder } from '../tokens/contiguousMultilineTokensBuilder.js';
import { LineTokens } from '../tokens/lineTokens.js';

const enum Constants {
	CHEAP_TOKENIZATION_LENGTH_LIMIT = 2048
}

export class TokenizerWithStateStore<TState extends IState = IState> {
	private readonly initialState;

	public readonly store: TrackingTokenizationStateStore<TState>;

	constructor(
		lineCount: number,
		public readonly tokenizationSupport: ITokenizationSupport
	) {
		this.initialState = this.tokenizationSupport.getInitialState() as TState;
		this.store = new TrackingTokenizationStateStore<TState>(lineCount);
	}

	public getStartState(lineNumber: number): TState | null {
		return this.store.getStartState(lineNumber, this.initialState);
	}

	public getFirstInvalidLine(): { lineNumber: number; startState: TState } | null {
		return this.store.getFirstInvalidLine(this.initialState);
	}
}

export class TokenizerWithStateStoreAndTextModel<TState extends IState = IState> extends TokenizerWithStateStore<TState> {
	constructor(
		lineCount: number,
		tokenizationSupport: ITokenizationSupport,
		public readonly _textModel: ITextModel,
		public readonly _languageIdCodec: ILanguageIdCodec
	) {
		super(lineCount, tokenizationSupport);
	}

	public updateTokensUntilLine(builder: ContiguousMultilineTokensBuilder, lineNumber: number): void {
		const languageId = this._textModel.getLanguageId();

		while (true) {
			const lineToTokenize = this.getFirstInvalidLine();
			if (!lineToTokenize || lineToTokenize.lineNumber > lineNumber) {
				break;
			}

			const text = this._textModel.getLineContent(lineToTokenize.lineNumber);

			const r = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, text, true, lineToTokenize.startState);
			builder.add(lineToTokenize.lineNumber, r.tokens);
			this.store.setEndState(lineToTokenize.lineNumber, r.endState as TState);
		}
	}

	/** assumes state is up to date */
	public getTokenTypeIfInsertingCharacter(position: Position, character: string): StandardTokenType {
		// TODO@hediet: use tokenizeLineWithEdit
		const lineStartState = this.getStartState(position.lineNumber);
		if (!lineStartState) {
			return StandardTokenType.Other;
		}

		const languageId = this._textModel.getLanguageId();
		const lineContent = this._textModel.getLineContent(position.lineNumber);

		// Create the text as if `character` was inserted
		const text = (
			lineContent.substring(0, position.column - 1)
			+ character
			+ lineContent.substring(position.column - 1)
		);

		const r = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, text, true, lineStartState);
		const lineTokens = new LineTokens(r.tokens, text, this._languageIdCodec);
		if (lineTokens.getCount() === 0) {
			return StandardTokenType.Other;
		}

		const tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
		return lineTokens.getStandardTokenType(tokenIndex);
	}

	/** assumes state is up to date */
	public tokenizeLinesAt(lineNumber: number, lines: string[]): LineTokens[] | null {
		const lineStartState: IState | null = this.getStartState(lineNumber);
		if (!lineStartState) {
			return null;
		}

		const languageId = this._textModel.getLanguageId();
		const result: LineTokens[] = [];

		let state = lineStartState;
		for (const line of lines) {
			const r = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, line, true, state);
			result.push(new LineTokens(r.tokens, line, this._languageIdCodec));
			state = r.endState;
		}

		return result;
	}

	public hasAccurateTokensForLine(lineNumber: number): boolean {
		const firstInvalidLineNumber = this.store.getFirstInvalidEndStateLineNumberOrMax();
		return (lineNumber < firstInvalidLineNumber);
	}

	public isCheapToTokenize(lineNumber: number): boolean {
		const firstInvalidLineNumber = this.store.getFirstInvalidEndStateLineNumberOrMax();
		if (lineNumber < firstInvalidLineNumber) {
			return true;
		}
		if (lineNumber === firstInvalidLineNumber
			&& this._textModel.getLineLength(lineNumber) < Constants.CHEAP_TOKENIZATION_LENGTH_LIMIT) {
			return true;
		}

		return false;
	}

	/**
	 * The result is not cached.
	 */
	public tokenizeHeuristically(builder: ContiguousMultilineTokensBuilder, startLineNumber: number, endLineNumber: number): { heuristicTokens: boolean } {
		if (endLineNumber <= this.store.getFirstInvalidEndStateLineNumberOrMax()) {
			// nothing to do
			return { heuristicTokens: false };
		}

		if (startLineNumber <= this.store.getFirstInvalidEndStateLineNumberOrMax()) {
			// tokenization has reached the viewport start...
			this.updateTokensUntilLine(builder, endLineNumber);
			return { heuristicTokens: false };
		}

		let state = this.guessStartState(startLineNumber);
		const languageId = this._textModel.getLanguageId();

		for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
			const text = this._textModel.getLineContent(lineNumber);
			const r = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, text, true, state);
			builder.add(lineNumber, r.tokens);
			state = r.endState;
		}

		return { heuristicTokens: true };
	}

	private guessStartState(lineNumber: number): IState {
		let { likelyRelevantLines, initialState } = findLikelyRelevantLines(this._textModel, lineNumber, this);

		if (!initialState) {
			initialState = this.tokenizationSupport.getInitialState();
		}

		const languageId = this._textModel.getLanguageId();
		let state = initialState;
		for (const line of likelyRelevantLines) {
			const r = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, line, false, state);
			state = r.endState;
		}
		return state;
	}
}

export function findLikelyRelevantLines(model: ITextModel, lineNumber: number, store?: TokenizerWithStateStore): { likelyRelevantLines: string[]; initialState?: IState } {
	let nonWhitespaceColumn = model.getLineFirstNonWhitespaceColumn(lineNumber);
	const likelyRelevantLines: string[] = [];
	let initialState: IState | null | undefined = null;
	for (let i = lineNumber - 1; nonWhitespaceColumn > 1 && i >= 1; i--) {
		const newNonWhitespaceIndex = model.getLineFirstNonWhitespaceColumn(i);
		// Ignore lines full of whitespace
		if (newNonWhitespaceIndex === 0) {
			continue;
		}
		if (newNonWhitespaceIndex < nonWhitespaceColumn) {
			likelyRelevantLines.push(model.getLineContent(i));
			nonWhitespaceColumn = newNonWhitespaceIndex;
			initialState = store?.getStartState(i);
			if (initialState) {
				break;
			}
		}
	}

	likelyRelevantLines.reverse();
	return { likelyRelevantLines, initialState: initialState ?? undefined };
}

/**
 * **Invariant:**
 * If the text model is retokenized from line 1 to {@link getFirstInvalidEndStateLineNumber}() - 1,
 * then the recomputed end state for line l will be equal to {@link getEndState}(l).
 */
export class TrackingTokenizationStateStore<TState extends IState> {
	private readonly _tokenizationStateStore = new TokenizationStateStore<TState>();
	private readonly _invalidEndStatesLineNumbers = new RangePriorityQueueImpl();

	constructor(private lineCount: number) {
		this._invalidEndStatesLineNumbers.addRange(new OffsetRange(1, lineCount + 1));
	}

	public getEndState(lineNumber: number): TState | null {
		return this._tokenizationStateStore.getEndState(lineNumber);
	}

	/**
	 * @returns if the end state has changed.
	 */
	public setEndState(lineNumber: number, state: TState): boolean {
		if (!state) {
			throw new BugIndicatingError('Cannot set null/undefined state');
		}

		this._invalidEndStatesLineNumbers.delete(lineNumber);
		const r = this._tokenizationStateStore.setEndState(lineNumber, state);
		if (r && lineNumber < this.lineCount) {
			// because the state changed, we cannot trust the next state anymore and have to invalidate it.
			this._invalidEndStatesLineNumbers.addRange(new OffsetRange(lineNumber + 1, lineNumber + 2));
		}

		return r;
	}

	public acceptChange(range: LineRange, newLineCount: number): void {
		this.lineCount += newLineCount - range.length;
		this._tokenizationStateStore.acceptChange(range, newLineCount);
		this._invalidEndStatesLineNumbers.addRangeAndResize(new OffsetRange(range.startLineNumber, range.endLineNumberExclusive), newLineCount);
	}

	public acceptChanges(changes: IModelContentChange[]) {
		for (const c of changes) {
			const [eolCount] = countEOL(c.text);
			this.acceptChange(new LineRange(c.range.startLineNumber, c.range.endLineNumber + 1), eolCount + 1);
		}
	}

	public invalidateEndStateRange(range: LineRange): void {
		this._invalidEndStatesLineNumbers.addRange(new OffsetRange(range.startLineNumber, range.endLineNumberExclusive));
	}

	public getFirstInvalidEndStateLineNumber(): number | null { return this._invalidEndStatesLineNumbers.min; }

	public getFirstInvalidEndStateLineNumberOrMax(): number {
		return this.getFirstInvalidEndStateLineNumber() || Number.MAX_SAFE_INTEGER;
	}

	public allStatesValid(): boolean { return this._invalidEndStatesLineNumbers.min === null; }

	public getStartState(lineNumber: number, initialState: TState): TState | null {
		if (lineNumber === 1) { return initialState; }
		return this.getEndState(lineNumber - 1);
	}

	public getFirstInvalidLine(initialState: TState): { lineNumber: number; startState: TState } | null {
		const lineNumber = this.getFirstInvalidEndStateLineNumber();
		if (lineNumber === null) {
			return null;
		}
		const startState = this.getStartState(lineNumber, initialState);
		if (!startState) {
			throw new BugIndicatingError('Start state must be defined');
		}

		return { lineNumber, startState };
	}
}

export class TokenizationStateStore<TState extends IState> {
	private readonly _lineEndStates = new FixedArray<TState | null>(null);

	public getEndState(lineNumber: number): TState | null {
		return this._lineEndStates.get(lineNumber);
	}

	public setEndState(lineNumber: number, state: TState): boolean {
		const oldState = this._lineEndStates.get(lineNumber);
		if (oldState && oldState.equals(state)) {
			return false;
		}

		this._lineEndStates.set(lineNumber, state);
		return true;
	}

	public acceptChange(range: LineRange, newLineCount: number): void {
		let length = range.length;
		if (newLineCount > 0 && length > 0) {
			// Keep the last state, even though it is unrelated.
			// But if the new state happens to agree with this last state, then we know we can stop tokenizing.
			length--;
			newLineCount--;
		}

		this._lineEndStates.replace(range.startLineNumber, length, newLineCount);
	}

	public acceptChanges(changes: IModelContentChange[]) {
		for (const c of changes) {
			const [eolCount] = countEOL(c.text);
			this.acceptChange(new LineRange(c.range.startLineNumber, c.range.endLineNumber + 1), eolCount + 1);
		}
	}
}

interface RangePriorityQueue {
	get min(): number | null;
	removeMin(): number | null;

	addRange(range: OffsetRange): void;

	addRangeAndResize(range: OffsetRange, newLength: number): void;
}

export class RangePriorityQueueImpl implements RangePriorityQueue {
	private readonly _ranges: OffsetRange[] = [];

	public getRanges(): OffsetRange[] {
		return this._ranges;
	}

	public get min(): number | null {
		if (this._ranges.length === 0) {
			return null;
		}
		return this._ranges[0].start;
	}

	public removeMin(): number | null {
		if (this._ranges.length === 0) {
			return null;
		}
		const range = this._ranges[0];
		if (range.start + 1 === range.endExclusive) {
			this._ranges.shift();
		} else {
			this._ranges[0] = new OffsetRange(range.start + 1, range.endExclusive);
		}
		return range.start;
	}

	public delete(value: number): void {
		const idx = this._ranges.findIndex(r => r.contains(value));
		if (idx !== -1) {
			const range = this._ranges[idx];
			if (range.start === value) {
				if (range.endExclusive === value + 1) {
					this._ranges.splice(idx, 1);
				} else {
					this._ranges[idx] = new OffsetRange(value + 1, range.endExclusive);
				}
			} else {
				if (range.endExclusive === value + 1) {
					this._ranges[idx] = new OffsetRange(range.start, value);
				} else {
					this._ranges.splice(idx, 1, new OffsetRange(range.start, value), new OffsetRange(value + 1, range.endExclusive));
				}
			}
		}
	}

	public addRange(range: OffsetRange): void {
		OffsetRange.addRange(range, this._ranges);
	}

	public addRangeAndResize(range: OffsetRange, newLength: number): void {
		let idxFirstMightBeIntersecting = 0;
		while (!(idxFirstMightBeIntersecting >= this._ranges.length || range.start <= this._ranges[idxFirstMightBeIntersecting].endExclusive)) {
			idxFirstMightBeIntersecting++;
		}
		let idxFirstIsAfter = idxFirstMightBeIntersecting;
		while (!(idxFirstIsAfter >= this._ranges.length || range.endExclusive < this._ranges[idxFirstIsAfter].start)) {
			idxFirstIsAfter++;
		}
		const delta = newLength - range.length;

		for (let i = idxFirstIsAfter; i < this._ranges.length; i++) {
			this._ranges[i] = this._ranges[i].delta(delta);
		}

		if (idxFirstMightBeIntersecting === idxFirstIsAfter) {
			const newRange = new OffsetRange(range.start, range.start + newLength);
			if (!newRange.isEmpty) {
				this._ranges.splice(idxFirstMightBeIntersecting, 0, newRange);
			}
		} else {
			const start = Math.min(range.start, this._ranges[idxFirstMightBeIntersecting].start);
			const endEx = Math.max(range.endExclusive, this._ranges[idxFirstIsAfter - 1].endExclusive);

			const newRange = new OffsetRange(start, endEx + delta);
			if (!newRange.isEmpty) {
				this._ranges.splice(idxFirstMightBeIntersecting, idxFirstIsAfter - idxFirstMightBeIntersecting, newRange);
			} else {
				this._ranges.splice(idxFirstMightBeIntersecting, idxFirstIsAfter - idxFirstMightBeIntersecting);
			}
		}
	}

	toString() {
		return this._ranges.map(r => r.toString()).join(' + ');
	}
}


function safeTokenize(languageIdCodec: ILanguageIdCodec, languageId: string, tokenizationSupport: ITokenizationSupport | null, text: string, hasEOL: boolean, state: IState): EncodedTokenizationResult {
	let r: EncodedTokenizationResult | null = null;

	if (tokenizationSupport) {
		try {
			r = tokenizationSupport.tokenizeEncoded(text, hasEOL, state.clone());
		} catch (e) {
			onUnexpectedError(e);
		}
	}

	if (!r) {
		r = nullTokenizeEncoded(languageIdCodec.encodeLanguageId(languageId), state);
	}

	LineTokens.convertToEndOffset(r.tokens, text.length);
	return r;
}

export class DefaultBackgroundTokenizer implements IBackgroundTokenizer {
	private _isDisposed = false;

	constructor(
		private readonly _tokenizerWithStateStore: TokenizerWithStateStoreAndTextModel,
		private readonly _backgroundTokenStore: IBackgroundTokenizationStore,
	) {
	}

	public dispose(): void {
		this._isDisposed = true;
	}

	public handleChanges(): void {
		this._beginBackgroundTokenization();
	}

	private _isScheduled = false;
	private _beginBackgroundTokenization(): void {
		if (this._isScheduled || !this._tokenizerWithStateStore._textModel.isAttachedToEditor() || !this._hasLinesToTokenize()) {
			return;
		}

		this._isScheduled = true;
		runWhenGlobalIdle((deadline) => {
			this._isScheduled = false;

			this._backgroundTokenizeWithDeadline(deadline);
		});
	}

	/**
	 * Tokenize until the deadline occurs, but try to yield every 1-2ms.
	 */
	private _backgroundTokenizeWithDeadline(deadline: IdleDeadline): void {
		// Read the time remaining from the `deadline` immediately because it is unclear
		// if the `deadline` object will be valid after execution leaves this function.
		const endTime = Date.now() + deadline.timeRemaining();

		const execute = () => {
			if (this._isDisposed || !this._tokenizerWithStateStore._textModel.isAttachedToEditor() || !this._hasLinesToTokenize()) {
				// disposed in the meantime or detached or finished
				return;
			}

			this._backgroundTokenizeForAtLeast1ms();

			if (Date.now() < endTime) {
				// There is still time before reaching the deadline, so yield to the browser and then
				// continue execution
				setTimeout0(execute);
			} else {
				// The deadline has been reached, so schedule a new idle callback if necessary
				this._beginBackgroundTokenization();
			}
		};
		execute();
	}

	/**
	 * Tokenize for at least 1ms.
	 */
	private _backgroundTokenizeForAtLeast1ms(): void {
		const lineCount = this._tokenizerWithStateStore._textModel.getLineCount();
		const builder = new ContiguousMultilineTokensBuilder();
		const sw = StopWatch.create(false);

		do {
			if (sw.elapsed() > 1) {
				// the comparison is intentionally > 1 and not >= 1 to ensure that
				// a full millisecond has elapsed, given how microseconds are rounded
				// to milliseconds
				break;
			}

			const tokenizedLineNumber = this._tokenizeOneInvalidLine(builder);

			if (tokenizedLineNumber >= lineCount) {
				break;
			}
		} while (this._hasLinesToTokenize());

		this._backgroundTokenStore.setTokens(builder.finalize());
		this.checkFinished();
	}

	private _hasLinesToTokenize(): boolean {
		if (!this._tokenizerWithStateStore) {
			return false;
		}
		return !this._tokenizerWithStateStore.store.allStatesValid();
	}

	private _tokenizeOneInvalidLine(builder: ContiguousMultilineTokensBuilder): number {
		const firstInvalidLine = this._tokenizerWithStateStore?.getFirstInvalidLine();
		if (!firstInvalidLine) {
			return this._tokenizerWithStateStore._textModel.getLineCount() + 1;
		}
		this._tokenizerWithStateStore.updateTokensUntilLine(builder, firstInvalidLine.lineNumber);
		return firstInvalidLine.lineNumber;
	}

	public checkFinished(): void {
		if (this._isDisposed) {
			return;
		}
		if (this._tokenizerWithStateStore.store.allStatesValid()) {
			this._backgroundTokenStore.backgroundTokenizationFinished();
		}
	}

	public requestTokens(startLineNumber: number, endLineNumberExclusive: number): void {
		this._tokenizerWithStateStore.store.invalidateEndStateRange(new LineRange(startLineNumber, endLineNumberExclusive));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/utils.ts]---
Location: vscode-main/src/vs/editor/common/model/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';

/**
 * Returns:
 *  - -1 => the line consists of whitespace
 *  - otherwise => the indent level is returned value
 */
export function computeIndentLevel(line: string, tabSize: number): number {
	let indent = 0;
	let i = 0;
	const len = line.length;

	while (i < len) {
		const chCode = line.charCodeAt(i);
		if (chCode === CharCode.Space) {
			indent++;
		} else if (chCode === CharCode.Tab) {
			indent = indent - indent % tabSize + tabSize;
		} else {
			break;
		}
		i++;
	}

	if (i === len) {
		return -1; // line only consists of whitespace
	}

	return indent;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsImpl.ts]---
Location: vscode-main/src/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CallbackIterable, compareBy } from '../../../../base/common/arrays.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, IReference, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { IPosition, Position } from '../../core/position.js';
import { Range } from '../../core/range.js';
import { ILanguageConfigurationService, LanguageConfigurationServiceChangeEvent } from '../../languages/languageConfigurationRegistry.js';
import { ignoreBracketsInToken } from '../../languages/supports.js';
import { LanguageBracketsConfiguration } from '../../languages/supports/languageBracketsConfiguration.js';
import { BracketsUtils, RichEditBracket, RichEditBrackets } from '../../languages/supports/richEditBrackets.js';
import { BracketPairsTree } from './bracketPairsTree/bracketPairsTree.js';
import { TextModel } from '../textModel.js';
import { BracketInfo, BracketPairInfo, BracketPairWithMinIndentationInfo, IBracketPairsTextModelPart, IFoundBracket } from '../../textModelBracketPairs.js';
import { IModelContentChangedEvent, IModelLanguageChangedEvent, IModelOptionsChangedEvent, IModelTokensChangedEvent } from '../../textModelEvents.js';
import { LineTokens } from '../../tokens/lineTokens.js';

export class BracketPairsTextModelPart extends Disposable implements IBracketPairsTextModelPart {
	private readonly bracketPairsTree = this._register(new MutableDisposable<IReference<BracketPairsTree>>());

	private readonly onDidChangeEmitter = new Emitter<void>();
	public readonly onDidChange = this.onDidChangeEmitter.event;

	private get canBuildAST() {
		const maxSupportedDocumentLength = /* max lines */ 50_000 * /* average column count */ 100;
		return this.textModel.getValueLength() <= maxSupportedDocumentLength;
	}

	private bracketsRequested = false;

	public constructor(
		private readonly textModel: TextModel,
		private readonly languageConfigurationService: ILanguageConfigurationService
	) {
		super();
	}

	//#region TextModel events

	public handleLanguageConfigurationServiceChange(e: LanguageConfigurationServiceChangeEvent): void {
		if (!e.languageId || this.bracketPairsTree.value?.object.didLanguageChange(e.languageId)) {
			this.bracketPairsTree.clear();
			this.updateBracketPairsTree();
		}
	}

	public handleDidChangeOptions(e: IModelOptionsChangedEvent): void {
		this.bracketPairsTree.clear();
		this.updateBracketPairsTree();
	}

	public handleDidChangeLanguage(e: IModelLanguageChangedEvent): void {
		this.bracketPairsTree.clear();
		this.updateBracketPairsTree();
	}

	public handleDidChangeContent(change: IModelContentChangedEvent) {
		this.bracketPairsTree.value?.object.handleContentChanged(change);
	}

	public handleDidChangeBackgroundTokenizationState(): void {
		this.bracketPairsTree.value?.object.handleDidChangeBackgroundTokenizationState();
	}

	public handleDidChangeTokens(e: IModelTokensChangedEvent): void {
		this.bracketPairsTree.value?.object.handleDidChangeTokens(e);
	}

	//#endregion

	private updateBracketPairsTree() {
		if (this.bracketsRequested && this.canBuildAST) {
			if (!this.bracketPairsTree.value) {
				const store = new DisposableStore();

				this.bracketPairsTree.value = createDisposableRef(
					store.add(
						new BracketPairsTree(this.textModel, (languageId) => {
							return this.languageConfigurationService.getLanguageConfiguration(languageId);
						})
					),
					store
				);
				store.add(this.bracketPairsTree.value.object.onDidChange(e => this.onDidChangeEmitter.fire(e)));
				this.onDidChangeEmitter.fire();
			}
		} else {
			if (this.bracketPairsTree.value) {
				this.bracketPairsTree.clear();
				// Important: Don't call fire if there was no change!
				this.onDidChangeEmitter.fire();
			}
		}
	}

	/**
	 * Returns all bracket pairs that intersect the given range.
	 * The result is sorted by the start position.
	*/
	public getBracketPairsInRange(range: Range): CallbackIterable<BracketPairInfo> {
		this.bracketsRequested = true;
		this.updateBracketPairsTree();
		return this.bracketPairsTree.value?.object.getBracketPairsInRange(range, false) || CallbackIterable.empty;
	}

	public getBracketPairsInRangeWithMinIndentation(range: Range): CallbackIterable<BracketPairWithMinIndentationInfo> {
		this.bracketsRequested = true;
		this.updateBracketPairsTree();
		return this.bracketPairsTree.value?.object.getBracketPairsInRange(range, true) || CallbackIterable.empty;
	}

	public getBracketsInRange(range: Range, onlyColorizedBrackets: boolean = false): CallbackIterable<BracketInfo> {
		this.bracketsRequested = true;
		this.updateBracketPairsTree();
		return this.bracketPairsTree.value?.object.getBracketsInRange(range, onlyColorizedBrackets) || CallbackIterable.empty;
	}

	public findMatchingBracketUp(_bracket: string, _position: IPosition, maxDuration?: number): Range | null {
		const position = this.textModel.validatePosition(_position);
		const languageId = this.textModel.getLanguageIdAtPosition(position.lineNumber, position.column);

		if (this.canBuildAST) {
			const closingBracketInfo = this.languageConfigurationService
				.getLanguageConfiguration(languageId)
				.bracketsNew.getClosingBracketInfo(_bracket);

			if (!closingBracketInfo) {
				return null;
			}

			const bracketPair = this.getBracketPairsInRange(Range.fromPositions(_position, _position)).findLast((b) =>
				closingBracketInfo.closes(b.openingBracketInfo)
			);

			if (bracketPair) {
				return bracketPair.openingBracketRange;
			}
			return null;
		} else {
			// Fallback to old bracket matching code:
			const bracket = _bracket.toLowerCase();

			const bracketsSupport = this.languageConfigurationService.getLanguageConfiguration(languageId).brackets;

			if (!bracketsSupport) {
				return null;
			}

			const data = bracketsSupport.textIsBracket[bracket];

			if (!data) {
				return null;
			}

			return stripBracketSearchCanceled(this._findMatchingBracketUp(data, position, createTimeBasedContinueBracketSearchPredicate(maxDuration)));
		}
	}

	public matchBracket(position: IPosition, maxDuration?: number): [Range, Range] | null {
		if (this.canBuildAST) {
			const bracketPair =
				this.getBracketPairsInRange(
					Range.fromPositions(position, position)
				).filter(
					(item) =>
						item.closingBracketRange !== undefined &&
						(item.openingBracketRange.containsPosition(position) ||
							item.closingBracketRange.containsPosition(position))
				).findLastMaxBy(
					compareBy(
						(item) =>
							item.openingBracketRange.containsPosition(position)
								? item.openingBracketRange
								: item.closingBracketRange,
						Range.compareRangesUsingStarts
					)
				);
			if (bracketPair) {
				return [bracketPair.openingBracketRange, bracketPair.closingBracketRange!];
			}
			return null;
		} else {
			// Fallback to old bracket matching code:
			const continueSearchPredicate = createTimeBasedContinueBracketSearchPredicate(maxDuration);
			return this._matchBracket(this.textModel.validatePosition(position), continueSearchPredicate);
		}
	}

	private _establishBracketSearchOffsets(position: Position, lineTokens: LineTokens, modeBrackets: RichEditBrackets, tokenIndex: number) {
		const tokenCount = lineTokens.getCount();
		const currentLanguageId = lineTokens.getLanguageId(tokenIndex);

		// limit search to not go before `maxBracketLength`
		let searchStartOffset = Math.max(0, position.column - 1 - modeBrackets.maxBracketLength);
		for (let i = tokenIndex - 1; i >= 0; i--) {
			const tokenEndOffset = lineTokens.getEndOffset(i);
			if (tokenEndOffset <= searchStartOffset) {
				break;
			}
			if (ignoreBracketsInToken(lineTokens.getStandardTokenType(i)) || lineTokens.getLanguageId(i) !== currentLanguageId) {
				searchStartOffset = tokenEndOffset;
				break;
			}
		}

		// limit search to not go after `maxBracketLength`
		let searchEndOffset = Math.min(lineTokens.getLineContent().length, position.column - 1 + modeBrackets.maxBracketLength);
		for (let i = tokenIndex + 1; i < tokenCount; i++) {
			const tokenStartOffset = lineTokens.getStartOffset(i);
			if (tokenStartOffset >= searchEndOffset) {
				break;
			}
			if (ignoreBracketsInToken(lineTokens.getStandardTokenType(i)) || lineTokens.getLanguageId(i) !== currentLanguageId) {
				searchEndOffset = tokenStartOffset;
				break;
			}
		}

		return { searchStartOffset, searchEndOffset };
	}

	private _matchBracket(position: Position, continueSearchPredicate: ContinueBracketSearchPredicate): [Range, Range] | null {
		const lineNumber = position.lineNumber;
		const lineTokens = this.textModel.tokenization.getLineTokens(lineNumber);
		const lineText = this.textModel.getLineContent(lineNumber);

		const tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
		if (tokenIndex < 0) {
			return null;
		}
		const currentModeBrackets = this.languageConfigurationService.getLanguageConfiguration(lineTokens.getLanguageId(tokenIndex)).brackets;

		// check that the token is not to be ignored
		if (currentModeBrackets && !ignoreBracketsInToken(lineTokens.getStandardTokenType(tokenIndex))) {

			let { searchStartOffset, searchEndOffset } = this._establishBracketSearchOffsets(position, lineTokens, currentModeBrackets, tokenIndex);

			// it might be the case that [currentTokenStart -> currentTokenEnd] contains multiple brackets
			// `bestResult` will contain the most right-side result
			let bestResult: [Range, Range] | null = null;
			while (true) {
				const foundBracket = BracketsUtils.findNextBracketInRange(currentModeBrackets.forwardRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
				if (!foundBracket) {
					// there are no more brackets in this text
					break;
				}

				// check that we didn't hit a bracket too far away from position
				if (foundBracket.startColumn <= position.column && position.column <= foundBracket.endColumn) {
					const foundBracketText = lineText.substring(foundBracket.startColumn - 1, foundBracket.endColumn - 1).toLowerCase();
					const r = this._matchFoundBracket(foundBracket, currentModeBrackets.textIsBracket[foundBracketText], currentModeBrackets.textIsOpenBracket[foundBracketText], continueSearchPredicate);
					if (r) {
						if (r instanceof BracketSearchCanceled) {
							return null;
						}
						bestResult = r;
					}
				}

				searchStartOffset = foundBracket.endColumn - 1;
			}

			if (bestResult) {
				return bestResult;
			}
		}

		// If position is in between two tokens, try also looking in the previous token
		if (tokenIndex > 0 && lineTokens.getStartOffset(tokenIndex) === position.column - 1) {
			const prevTokenIndex = tokenIndex - 1;
			const prevModeBrackets = this.languageConfigurationService.getLanguageConfiguration(lineTokens.getLanguageId(prevTokenIndex)).brackets;

			// check that previous token is not to be ignored
			if (prevModeBrackets && !ignoreBracketsInToken(lineTokens.getStandardTokenType(prevTokenIndex))) {

				const { searchStartOffset, searchEndOffset } = this._establishBracketSearchOffsets(position, lineTokens, prevModeBrackets, prevTokenIndex);

				const foundBracket = BracketsUtils.findPrevBracketInRange(prevModeBrackets.reversedRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);

				// check that we didn't hit a bracket too far away from position
				if (foundBracket && foundBracket.startColumn <= position.column && position.column <= foundBracket.endColumn) {
					const foundBracketText = lineText.substring(foundBracket.startColumn - 1, foundBracket.endColumn - 1).toLowerCase();
					const r = this._matchFoundBracket(foundBracket, prevModeBrackets.textIsBracket[foundBracketText], prevModeBrackets.textIsOpenBracket[foundBracketText], continueSearchPredicate);
					if (r) {
						if (r instanceof BracketSearchCanceled) {
							return null;
						}
						return r;
					}
				}
			}
		}

		return null;
	}

	private _matchFoundBracket(foundBracket: Range, data: RichEditBracket, isOpen: boolean, continueSearchPredicate: ContinueBracketSearchPredicate): [Range, Range] | null | BracketSearchCanceled {
		if (!data) {
			return null;
		}

		const matched = (
			isOpen
				? this._findMatchingBracketDown(data, foundBracket.getEndPosition(), continueSearchPredicate)
				: this._findMatchingBracketUp(data, foundBracket.getStartPosition(), continueSearchPredicate)
		);

		if (!matched) {
			return null;
		}

		if (matched instanceof BracketSearchCanceled) {
			return matched;
		}

		return [foundBracket, matched];
	}

	private _findMatchingBracketUp(bracket: RichEditBracket, position: Position, continueSearchPredicate: ContinueBracketSearchPredicate): Range | null | BracketSearchCanceled {
		// console.log('_findMatchingBracketUp: ', 'bracket: ', JSON.stringify(bracket), 'startPosition: ', String(position));

		const languageId = bracket.languageId;
		const reversedBracketRegex = bracket.reversedRegex;
		let count = -1;

		let totalCallCount = 0;
		const searchPrevMatchingBracketInRange = (lineNumber: number, lineText: string, searchStartOffset: number, searchEndOffset: number): Range | null | BracketSearchCanceled => {
			while (true) {
				if (continueSearchPredicate && (++totalCallCount) % 100 === 0 && !continueSearchPredicate()) {
					return BracketSearchCanceled.INSTANCE;
				}
				const r = BracketsUtils.findPrevBracketInRange(reversedBracketRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
				if (!r) {
					break;
				}

				const hitText = lineText.substring(r.startColumn - 1, r.endColumn - 1).toLowerCase();
				if (bracket.isOpen(hitText)) {
					count++;
				} else if (bracket.isClose(hitText)) {
					count--;
				}

				if (count === 0) {
					return r;
				}

				searchEndOffset = r.startColumn - 1;
			}

			return null;
		};

		for (let lineNumber = position.lineNumber; lineNumber >= 1; lineNumber--) {
			const lineTokens = this.textModel.tokenization.getLineTokens(lineNumber);
			const tokenCount = lineTokens.getCount();
			const lineText = this.textModel.getLineContent(lineNumber);

			let tokenIndex = tokenCount - 1;
			let searchStartOffset = lineText.length;
			let searchEndOffset = lineText.length;
			if (lineNumber === position.lineNumber) {
				tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
				searchStartOffset = position.column - 1;
				searchEndOffset = position.column - 1;
			}

			let prevSearchInToken = true;
			for (; tokenIndex >= 0; tokenIndex--) {
				const searchInToken = (lineTokens.getLanguageId(tokenIndex) === languageId && !ignoreBracketsInToken(lineTokens.getStandardTokenType(tokenIndex)));

				if (searchInToken) {
					// this token should be searched
					if (prevSearchInToken) {
						// the previous token should be searched, simply extend searchStartOffset
						searchStartOffset = lineTokens.getStartOffset(tokenIndex);
					} else {
						// the previous token should not be searched
						searchStartOffset = lineTokens.getStartOffset(tokenIndex);
						searchEndOffset = lineTokens.getEndOffset(tokenIndex);
					}
				} else {
					// this token should not be searched
					if (prevSearchInToken && searchStartOffset !== searchEndOffset) {
						const r = searchPrevMatchingBracketInRange(lineNumber, lineText, searchStartOffset, searchEndOffset);
						if (r) {
							return r;
						}
					}
				}

				prevSearchInToken = searchInToken;
			}

			if (prevSearchInToken && searchStartOffset !== searchEndOffset) {
				const r = searchPrevMatchingBracketInRange(lineNumber, lineText, searchStartOffset, searchEndOffset);
				if (r) {
					return r;
				}
			}
		}

		return null;
	}

	private _findMatchingBracketDown(bracket: RichEditBracket, position: Position, continueSearchPredicate: ContinueBracketSearchPredicate): Range | null | BracketSearchCanceled {
		// console.log('_findMatchingBracketDown: ', 'bracket: ', JSON.stringify(bracket), 'startPosition: ', String(position));

		const languageId = bracket.languageId;
		const bracketRegex = bracket.forwardRegex;
		let count = 1;

		let totalCallCount = 0;
		const searchNextMatchingBracketInRange = (lineNumber: number, lineText: string, searchStartOffset: number, searchEndOffset: number): Range | null | BracketSearchCanceled => {
			while (true) {
				if (continueSearchPredicate && (++totalCallCount) % 100 === 0 && !continueSearchPredicate()) {
					return BracketSearchCanceled.INSTANCE;
				}
				const r = BracketsUtils.findNextBracketInRange(bracketRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
				if (!r) {
					break;
				}

				const hitText = lineText.substring(r.startColumn - 1, r.endColumn - 1).toLowerCase();
				if (bracket.isOpen(hitText)) {
					count++;
				} else if (bracket.isClose(hitText)) {
					count--;
				}

				if (count === 0) {
					return r;
				}

				searchStartOffset = r.endColumn - 1;
			}

			return null;
		};

		const lineCount = this.textModel.getLineCount();
		for (let lineNumber = position.lineNumber; lineNumber <= lineCount; lineNumber++) {
			const lineTokens = this.textModel.tokenization.getLineTokens(lineNumber);
			const tokenCount = lineTokens.getCount();
			const lineText = this.textModel.getLineContent(lineNumber);

			let tokenIndex = 0;
			let searchStartOffset = 0;
			let searchEndOffset = 0;
			if (lineNumber === position.lineNumber) {
				tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
				searchStartOffset = position.column - 1;
				searchEndOffset = position.column - 1;
			}

			let prevSearchInToken = true;
			for (; tokenIndex < tokenCount; tokenIndex++) {
				const searchInToken = (lineTokens.getLanguageId(tokenIndex) === languageId && !ignoreBracketsInToken(lineTokens.getStandardTokenType(tokenIndex)));

				if (searchInToken) {
					// this token should be searched
					if (prevSearchInToken) {
						// the previous token should be searched, simply extend searchEndOffset
						searchEndOffset = lineTokens.getEndOffset(tokenIndex);
					} else {
						// the previous token should not be searched
						searchStartOffset = lineTokens.getStartOffset(tokenIndex);
						searchEndOffset = lineTokens.getEndOffset(tokenIndex);
					}
				} else {
					// this token should not be searched
					if (prevSearchInToken && searchStartOffset !== searchEndOffset) {
						const r = searchNextMatchingBracketInRange(lineNumber, lineText, searchStartOffset, searchEndOffset);
						if (r) {
							return r;
						}
					}
				}

				prevSearchInToken = searchInToken;
			}

			if (prevSearchInToken && searchStartOffset !== searchEndOffset) {
				const r = searchNextMatchingBracketInRange(lineNumber, lineText, searchStartOffset, searchEndOffset);
				if (r) {
					return r;
				}
			}
		}

		return null;
	}

	public findPrevBracket(_position: IPosition): IFoundBracket | null {
		const position = this.textModel.validatePosition(_position);

		if (this.canBuildAST) {
			this.bracketsRequested = true;
			this.updateBracketPairsTree();
			return this.bracketPairsTree.value?.object.getFirstBracketBefore(position) || null;
		}

		let languageId: string | null = null;
		let modeBrackets: RichEditBrackets | null = null;
		let bracketConfig: LanguageBracketsConfiguration | null = null;
		for (let lineNumber = position.lineNumber; lineNumber >= 1; lineNumber--) {
			const lineTokens = this.textModel.tokenization.getLineTokens(lineNumber);
			const tokenCount = lineTokens.getCount();
			const lineText = this.textModel.getLineContent(lineNumber);

			let tokenIndex = tokenCount - 1;
			let searchStartOffset = lineText.length;
			let searchEndOffset = lineText.length;
			if (lineNumber === position.lineNumber) {
				tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
				searchStartOffset = position.column - 1;
				searchEndOffset = position.column - 1;
				const tokenLanguageId = lineTokens.getLanguageId(tokenIndex);
				if (languageId !== tokenLanguageId) {
					languageId = tokenLanguageId;
					modeBrackets = this.languageConfigurationService.getLanguageConfiguration(languageId).brackets;
					bracketConfig = this.languageConfigurationService.getLanguageConfiguration(languageId).bracketsNew;
				}
			}

			let prevSearchInToken = true;
			for (; tokenIndex >= 0; tokenIndex--) {
				const tokenLanguageId = lineTokens.getLanguageId(tokenIndex);

				if (languageId !== tokenLanguageId) {
					// language id change!
					if (modeBrackets && bracketConfig && prevSearchInToken && searchStartOffset !== searchEndOffset) {
						const r = BracketsUtils.findPrevBracketInRange(modeBrackets.reversedRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
						if (r) {
							return this._toFoundBracket(bracketConfig, r);
						}
						prevSearchInToken = false;
					}
					languageId = tokenLanguageId;
					modeBrackets = this.languageConfigurationService.getLanguageConfiguration(languageId).brackets;
					bracketConfig = this.languageConfigurationService.getLanguageConfiguration(languageId).bracketsNew;
				}

				const searchInToken = (!!modeBrackets && !ignoreBracketsInToken(lineTokens.getStandardTokenType(tokenIndex)));

				if (searchInToken) {
					// this token should be searched
					if (prevSearchInToken) {
						// the previous token should be searched, simply extend searchStartOffset
						searchStartOffset = lineTokens.getStartOffset(tokenIndex);
					} else {
						// the previous token should not be searched
						searchStartOffset = lineTokens.getStartOffset(tokenIndex);
						searchEndOffset = lineTokens.getEndOffset(tokenIndex);
					}
				} else {
					// this token should not be searched
					if (bracketConfig && modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
						const r = BracketsUtils.findPrevBracketInRange(modeBrackets.reversedRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
						if (r) {
							return this._toFoundBracket(bracketConfig, r);
						}
					}
				}

				prevSearchInToken = searchInToken;
			}

			if (bracketConfig && modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
				const r = BracketsUtils.findPrevBracketInRange(modeBrackets.reversedRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
				if (r) {
					return this._toFoundBracket(bracketConfig, r);
				}
			}
		}

		return null;
	}

	public findNextBracket(_position: IPosition): IFoundBracket | null {
		const position = this.textModel.validatePosition(_position);

		if (this.canBuildAST) {
			this.bracketsRequested = true;
			this.updateBracketPairsTree();
			return this.bracketPairsTree.value?.object.getFirstBracketAfter(position) || null;
		}

		const lineCount = this.textModel.getLineCount();

		let languageId: string | null = null;
		let modeBrackets: RichEditBrackets | null = null;
		let bracketConfig: LanguageBracketsConfiguration | null = null;
		for (let lineNumber = position.lineNumber; lineNumber <= lineCount; lineNumber++) {
			const lineTokens = this.textModel.tokenization.getLineTokens(lineNumber);
			const tokenCount = lineTokens.getCount();
			const lineText = this.textModel.getLineContent(lineNumber);

			let tokenIndex = 0;
			let searchStartOffset = 0;
			let searchEndOffset = 0;
			if (lineNumber === position.lineNumber) {
				tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
				searchStartOffset = position.column - 1;
				searchEndOffset = position.column - 1;
				const tokenLanguageId = lineTokens.getLanguageId(tokenIndex);
				if (languageId !== tokenLanguageId) {
					languageId = tokenLanguageId;
					modeBrackets = this.languageConfigurationService.getLanguageConfiguration(languageId).brackets;
					bracketConfig = this.languageConfigurationService.getLanguageConfiguration(languageId).bracketsNew;
				}
			}

			let prevSearchInToken = true;
			for (; tokenIndex < tokenCount; tokenIndex++) {
				const tokenLanguageId = lineTokens.getLanguageId(tokenIndex);

				if (languageId !== tokenLanguageId) {
					// language id change!
					if (bracketConfig && modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
						const r = BracketsUtils.findNextBracketInRange(modeBrackets.forwardRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
						if (r) {
							return this._toFoundBracket(bracketConfig, r);
						}
						prevSearchInToken = false;
					}
					languageId = tokenLanguageId;
					modeBrackets = this.languageConfigurationService.getLanguageConfiguration(languageId).brackets;
					bracketConfig = this.languageConfigurationService.getLanguageConfiguration(languageId).bracketsNew;
				}

				const searchInToken = (!!modeBrackets && !ignoreBracketsInToken(lineTokens.getStandardTokenType(tokenIndex)));
				if (searchInToken) {
					// this token should be searched
					if (prevSearchInToken) {
						// the previous token should be searched, simply extend searchEndOffset
						searchEndOffset = lineTokens.getEndOffset(tokenIndex);
					} else {
						// the previous token should not be searched
						searchStartOffset = lineTokens.getStartOffset(tokenIndex);
						searchEndOffset = lineTokens.getEndOffset(tokenIndex);
					}
				} else {
					// this token should not be searched
					if (bracketConfig && modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
						const r = BracketsUtils.findNextBracketInRange(modeBrackets.forwardRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
						if (r) {
							return this._toFoundBracket(bracketConfig, r);
						}
					}
				}

				prevSearchInToken = searchInToken;
			}

			if (bracketConfig && modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
				const r = BracketsUtils.findNextBracketInRange(modeBrackets.forwardRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
				if (r) {
					return this._toFoundBracket(bracketConfig, r);
				}
			}
		}

		return null;
	}

	public findEnclosingBrackets(_position: IPosition, maxDuration?: number): [Range, Range] | null {
		const position = this.textModel.validatePosition(_position);

		if (this.canBuildAST) {
			const range = Range.fromPositions(position);
			const bracketPair =
				this.getBracketPairsInRange(Range.fromPositions(position, position)).findLast(
					(item) => item.closingBracketRange !== undefined && item.range.strictContainsRange(range)
				);
			if (bracketPair) {
				return [bracketPair.openingBracketRange, bracketPair.closingBracketRange!];
			}
			return null;
		}

		const continueSearchPredicate = createTimeBasedContinueBracketSearchPredicate(maxDuration);
		const lineCount = this.textModel.getLineCount();
		const savedCounts = new Map<string, number[]>();

		let counts: number[] = [];
		const resetCounts = (languageId: string, modeBrackets: RichEditBrackets | null) => {
			if (!savedCounts.has(languageId)) {
				const tmp = [];
				for (let i = 0, len = modeBrackets ? modeBrackets.brackets.length : 0; i < len; i++) {
					tmp[i] = 0;
				}
				savedCounts.set(languageId, tmp);
			}
			counts = savedCounts.get(languageId)!;
		};

		let totalCallCount = 0;
		const searchInRange = (modeBrackets: RichEditBrackets, lineNumber: number, lineText: string, searchStartOffset: number, searchEndOffset: number): [Range, Range] | null | BracketSearchCanceled => {
			while (true) {
				if (continueSearchPredicate && (++totalCallCount) % 100 === 0 && !continueSearchPredicate()) {
					return BracketSearchCanceled.INSTANCE;
				}
				const r = BracketsUtils.findNextBracketInRange(modeBrackets.forwardRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
				if (!r) {
					break;
				}

				const hitText = lineText.substring(r.startColumn - 1, r.endColumn - 1).toLowerCase();
				const bracket = modeBrackets.textIsBracket[hitText];
				if (bracket) {
					if (bracket.isOpen(hitText)) {
						counts[bracket.index]++;
					} else if (bracket.isClose(hitText)) {
						counts[bracket.index]--;
					}

					if (counts[bracket.index] === -1) {
						return this._matchFoundBracket(r, bracket, false, continueSearchPredicate);
					}
				}

				searchStartOffset = r.endColumn - 1;
			}
			return null;
		};

		let languageId: string | null = null;
		let modeBrackets: RichEditBrackets | null = null;
		for (let lineNumber = position.lineNumber; lineNumber <= lineCount; lineNumber++) {
			const lineTokens = this.textModel.tokenization.getLineTokens(lineNumber);
			const tokenCount = lineTokens.getCount();
			const lineText = this.textModel.getLineContent(lineNumber);

			let tokenIndex = 0;
			let searchStartOffset = 0;
			let searchEndOffset = 0;
			if (lineNumber === position.lineNumber) {
				tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
				searchStartOffset = position.column - 1;
				searchEndOffset = position.column - 1;
				const tokenLanguageId = lineTokens.getLanguageId(tokenIndex);
				if (languageId !== tokenLanguageId) {
					languageId = tokenLanguageId;
					modeBrackets = this.languageConfigurationService.getLanguageConfiguration(languageId).brackets;
					resetCounts(languageId, modeBrackets);
				}
			}

			let prevSearchInToken = true;
			for (; tokenIndex < tokenCount; tokenIndex++) {
				const tokenLanguageId = lineTokens.getLanguageId(tokenIndex);

				if (languageId !== tokenLanguageId) {
					// language id change!
					if (modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
						const r = searchInRange(modeBrackets, lineNumber, lineText, searchStartOffset, searchEndOffset);
						if (r) {
							return stripBracketSearchCanceled(r);
						}
						prevSearchInToken = false;
					}
					languageId = tokenLanguageId;
					modeBrackets = this.languageConfigurationService.getLanguageConfiguration(languageId).brackets;
					resetCounts(languageId, modeBrackets);
				}

				const searchInToken = (!!modeBrackets && !ignoreBracketsInToken(lineTokens.getStandardTokenType(tokenIndex)));
				if (searchInToken) {
					// this token should be searched
					if (prevSearchInToken) {
						// the previous token should be searched, simply extend searchEndOffset
						searchEndOffset = lineTokens.getEndOffset(tokenIndex);
					} else {
						// the previous token should not be searched
						searchStartOffset = lineTokens.getStartOffset(tokenIndex);
						searchEndOffset = lineTokens.getEndOffset(tokenIndex);
					}
				} else {
					// this token should not be searched
					if (modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
						const r = searchInRange(modeBrackets, lineNumber, lineText, searchStartOffset, searchEndOffset);
						if (r) {
							return stripBracketSearchCanceled(r);
						}
					}
				}

				prevSearchInToken = searchInToken;
			}

			if (modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
				const r = searchInRange(modeBrackets, lineNumber, lineText, searchStartOffset, searchEndOffset);
				if (r) {
					return stripBracketSearchCanceled(r);
				}
			}
		}

		return null;
	}

	private _toFoundBracket(bracketConfig: LanguageBracketsConfiguration, r: Range): IFoundBracket | null {
		if (!r) {
			return null;
		}

		let text = this.textModel.getValueInRange(r);
		text = text.toLowerCase();

		const bracketInfo = bracketConfig.getBracketInfo(text);
		if (!bracketInfo) {
			return null;
		}

		return {
			range: r,
			bracketInfo
		};
	}
}

function createDisposableRef<T>(object: T, disposable?: IDisposable): IReference<T> {
	return {
		object,
		dispose: () => disposable?.dispose(),
	};
}

type ContinueBracketSearchPredicate = (() => boolean);

function createTimeBasedContinueBracketSearchPredicate(maxDuration: number | undefined): ContinueBracketSearchPredicate {
	if (typeof maxDuration === 'undefined') {
		return () => true;
	} else {
		const startTime = Date.now();
		return () => {
			return (Date.now() - startTime <= maxDuration);
		};
	}
}

class BracketSearchCanceled {
	public static INSTANCE = new BracketSearchCanceled();
	_searchCanceledBrand = undefined;
	private constructor() { }
}

function stripBracketSearchCanceled<T>(result: T | null | BracketSearchCanceled): T | null {
	if (result instanceof BracketSearchCanceled) {
		return null;
	}
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model/bracketPairsTextModelPart/colorizedBracketPairsDecorationProvider.ts]---
Location: vscode-main/src/vs/editor/common/model/bracketPairsTextModelPart/colorizedBracketPairsDecorationProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Color } from '../../../../base/common/color.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Range } from '../../core/range.js';
import { BracketPairColorizationOptions, IModelDecoration } from '../../model.js';
import { BracketInfo } from '../../textModelBracketPairs.js';
import { DecorationProvider } from '../decorationProvider.js';
import { TextModel } from '../textModel.js';
import {
	editorBracketHighlightingForeground1, editorBracketHighlightingForeground2, editorBracketHighlightingForeground3, editorBracketHighlightingForeground4, editorBracketHighlightingForeground5, editorBracketHighlightingForeground6, editorBracketHighlightingUnexpectedBracketForeground
} from '../../core/editorColorRegistry.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { IModelOptionsChangedEvent } from '../../textModelEvents.js';

export class ColorizedBracketPairsDecorationProvider extends Disposable implements DecorationProvider {
	private colorizationOptions: BracketPairColorizationOptions;
	private readonly colorProvider = new ColorProvider();

	private readonly onDidChangeEmitter = new Emitter<void>();
	public readonly onDidChange = this.onDidChangeEmitter.event;

	constructor(private readonly textModel: TextModel) {
		super();

		this.colorizationOptions = textModel.getOptions().bracketPairColorizationOptions;

		this._register(textModel.bracketPairs.onDidChange(e => {
			this.onDidChangeEmitter.fire();
		}));
	}

	//#region TextModel events

	public handleDidChangeOptions(e: IModelOptionsChangedEvent): void {
		this.colorizationOptions = this.textModel.getOptions().bracketPairColorizationOptions;
	}

	//#endregion

	getDecorationsInRange(range: Range, ownerId?: number, filterOutValidation?: boolean, onlyMinimapDecorations?: boolean): IModelDecoration[] {
		if (onlyMinimapDecorations) {
			// Bracket pair colorization decorations are not rendered in the minimap
			return [];
		}
		if (ownerId === undefined) {
			return [];
		}
		if (!this.colorizationOptions.enabled) {
			return [];
		}

		const result = this.textModel.bracketPairs.getBracketsInRange(range, true).map<IModelDecoration>(bracket => ({
			id: `bracket${bracket.range.toString()}-${bracket.nestingLevel}`,
			options: {
				description: 'BracketPairColorization',
				inlineClassName: this.colorProvider.getInlineClassName(
					bracket,
					this.colorizationOptions.independentColorPoolPerBracketType
				),
			},
			ownerId: 0,
			range: bracket.range,
		})).toArray();

		return result;
	}

	getAllDecorations(ownerId?: number, filterOutValidation?: boolean): IModelDecoration[] {
		if (ownerId === undefined) {
			return [];
		}
		if (!this.colorizationOptions.enabled) {
			return [];
		}
		return this.getDecorationsInRange(
			new Range(1, 1, this.textModel.getLineCount(), 1),
			ownerId,
			filterOutValidation
		);
	}
}

class ColorProvider {
	public readonly unexpectedClosingBracketClassName = 'unexpected-closing-bracket';

	getInlineClassName(bracket: BracketInfo, independentColorPoolPerBracketType: boolean): string {
		if (bracket.isInvalid) {
			return this.unexpectedClosingBracketClassName;
		}
		return this.getInlineClassNameOfLevel(independentColorPoolPerBracketType ? bracket.nestingLevelOfEqualBracketType : bracket.nestingLevel);
	}

	getInlineClassNameOfLevel(level: number): string {
		// To support a dynamic amount of colors up to 6 colors,
		// we use a number that is a lcm of all numbers from 1 to 6.
		return `bracket-highlighting-${level % 30}`;
	}
}

registerThemingParticipant((theme, collector) => {
	const colors = [
		editorBracketHighlightingForeground1,
		editorBracketHighlightingForeground2,
		editorBracketHighlightingForeground3,
		editorBracketHighlightingForeground4,
		editorBracketHighlightingForeground5,
		editorBracketHighlightingForeground6
	];
	const colorProvider = new ColorProvider();

	collector.addRule(`.monaco-editor .${colorProvider.unexpectedClosingBracketClassName} { color: ${theme.getColor(editorBracketHighlightingUnexpectedBracketForeground)}; }`);

	const colorValues = colors
		.map(c => theme.getColor(c))
		.filter((c): c is Color => !!c)
		.filter(c => !c.isTransparent());

	for (let level = 0; level < 30; level++) {
		const color = colorValues[level % colorValues.length];
		collector.addRule(`.monaco-editor .${colorProvider.getInlineClassNameOfLevel(level)} { color: ${color}; }`);
	}
});
```

--------------------------------------------------------------------------------

````

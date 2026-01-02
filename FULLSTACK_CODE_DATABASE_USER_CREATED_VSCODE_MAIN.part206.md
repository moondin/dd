---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 206
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 206 of 552)

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

---[FILE: src/vs/editor/common/editorCommon.ts]---
Location: vscode-main/src/vs/editor/common/editorCommon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../base/common/event.js';
import { IMarkdownString } from '../../base/common/htmlContent.js';
import { IDisposable } from '../../base/common/lifecycle.js';
import { ThemeColor } from '../../base/common/themables.js';
import { URI, UriComponents } from '../../base/common/uri.js';
import { IEditorOptions } from './config/editorOptions.js';
import { IDimension } from './core/2d/dimension.js';
import { IPosition, Position } from './core/position.js';
import { IRange, Range } from './core/range.js';
import { ISelection, Selection } from './core/selection.js';
import { IModelDecoration, IModelDecorationsChangeAccessor, IModelDeltaDecoration, ITextModel, IValidEditOperation, OverviewRulerLane, TrackedRangeStickiness } from './model.js';
import { IModelDecorationsChangedEvent } from './textModelEvents.js';
import { ICommandMetadata } from '../../platform/commands/common/commands.js';

/**
 * A builder and helper for edit operations for a command.
 */
export interface IEditOperationBuilder {
	/**
	 * Add a new edit operation (a replace operation).
	 * @param range The range to replace (delete). May be empty to represent a simple insert.
	 * @param text The text to replace with. May be null to represent a simple delete.
	 */
	addEditOperation(range: IRange, text: string | null, forceMoveMarkers?: boolean): void;

	/**
	 * Add a new edit operation (a replace operation).
	 * The inverse edits will be accessible in `ICursorStateComputerData.getInverseEditOperations()`
	 * @param range The range to replace (delete). May be empty to represent a simple insert.
	 * @param text The text to replace with. May be null to represent a simple delete.
	 */
	addTrackedEditOperation(range: IRange, text: string | null, forceMoveMarkers?: boolean): void;

	/**
	 * Track `selection` when applying edit operations.
	 * A best effort will be made to not grow/expand the selection.
	 * An empty selection will clamp to a nearby character.
	 * @param selection The selection to track.
	 * @param trackPreviousOnEmpty If set, and the selection is empty, indicates whether the selection
	 *           should clamp to the previous or the next character.
	 * @return A unique identifier.
	 */
	trackSelection(selection: Selection, trackPreviousOnEmpty?: boolean): string;
}

/**
 * A helper for computing cursor state after a command.
 */
export interface ICursorStateComputerData {
	/**
	 * Get the inverse edit operations of the added edit operations.
	 */
	getInverseEditOperations(): IValidEditOperation[];
	/**
	 * Get a previously tracked selection.
	 * @param id The unique identifier returned by `trackSelection`.
	 * @return The selection.
	 */
	getTrackedSelection(id: string): Selection;
}

/**
 * A command that modifies text / cursor state on a model.
 */
export interface ICommand {

	/**
	 * Signal that this command is inserting automatic whitespace that should be trimmed if possible.
	 * @internal
	 */
	readonly insertsAutoWhitespace?: boolean;

	/**
	 * Get the edit operations needed to execute this command.
	 * @param model The model the command will execute on.
	 * @param builder A helper to collect the needed edit operations and to track selections.
	 */
	getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void;

	/**
	 * Compute the cursor state after the edit operations were applied.
	 * @param model The model the command has executed on.
	 * @param helper A helper to get inverse edit operations and to get previously tracked selections.
	 * @return The cursor state after the command executed.
	 */
	computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection;
}

/**
 * A model for the diff editor.
 */
export interface IDiffEditorModel {
	/**
	 * Original model.
	 */
	original: ITextModel;
	/**
	 * Modified model.
	 */
	modified: ITextModel;
}

export interface IDiffEditorViewModel extends IDisposable {
	readonly model: IDiffEditorModel;

	waitForDiff(): Promise<void>;
}

/**
 * An event describing that an editor has had its model reset (i.e. `editor.setModel()`).
 */
export interface IModelChangedEvent {
	/**
	 * The `uri` of the previous model or null.
	 */
	readonly oldModelUrl: URI | null;
	/**
	 * The `uri` of the new model or null.
	 */
	readonly newModelUrl: URI | null;
}

// --- view

export interface IScrollEvent {
	readonly scrollTop: number;
	readonly scrollLeft: number;
	readonly scrollWidth: number;
	readonly scrollHeight: number;

	readonly scrollTopChanged: boolean;
	readonly scrollLeftChanged: boolean;
	readonly scrollWidthChanged: boolean;
	readonly scrollHeightChanged: boolean;
}

export interface IContentSizeChangedEvent {
	readonly contentWidth: number;
	readonly contentHeight: number;

	readonly contentWidthChanged: boolean;
	readonly contentHeightChanged: boolean;
}

/**
 * @internal
 */
export interface ITriggerEditorOperationEvent {
	source: string | null | undefined;
	handlerId: string;
	payload: unknown;
}

export interface INewScrollPosition {
	scrollLeft?: number;
	scrollTop?: number;
}

export interface IEditorAction {
	readonly id: string;
	readonly label: string;
	readonly alias: string;
	readonly metadata: ICommandMetadata | undefined;
	isSupported(): boolean;
	run(args?: unknown): Promise<void>;
}

export type IEditorModel = ITextModel | IDiffEditorModel | IDiffEditorViewModel;

/**
 * A (serializable) state of the cursors.
 */
export interface ICursorState {
	inSelectionMode: boolean;
	selectionStart: IPosition;
	position: IPosition;
}
/**
 * A (serializable) state of the view.
 */
export interface IViewState {
	/** written by previous versions */
	scrollTop?: number;
	/** written by previous versions */
	scrollTopWithoutViewZones?: number;
	scrollLeft: number;
	firstPosition: IPosition;
	firstPositionDeltaTop: number;
}
/**
 * A (serializable) state of the code editor.
 */
export interface ICodeEditorViewState {
	cursorState: ICursorState[];
	viewState: IViewState;
	contributionsState: { [id: string]: unknown };
}
/**
 * (Serializable) View state for the diff editor.
 */
export interface IDiffEditorViewState {
	original: ICodeEditorViewState | null;
	modified: ICodeEditorViewState | null;
	modelState?: unknown;
}
/**
 * An editor view state.
 */
export type IEditorViewState = ICodeEditorViewState | IDiffEditorViewState;

export const enum ScrollType {
	Smooth = 0,
	Immediate = 1,
}

/**
 * An editor.
 */
export interface IEditor {
	/**
	 * An event emitted when the editor has been disposed.
	 * @event
	 */
	onDidDispose(listener: () => void): IDisposable;

	/**
	 * Dispose the editor.
	 */
	dispose(): void;

	/**
	 * Get a unique id for this editor instance.
	 */
	getId(): string;

	/**
	 * Get the editor type. Please see `EditorType`.
	 * This is to avoid an instanceof check
	 */
	getEditorType(): string;

	/**
	 * Update the editor's options after the editor has been created.
	 */
	updateOptions(newOptions: IEditorOptions): void;

	/**
	 * Indicates that the editor becomes visible.
	 * @internal
	 */
	onVisible(): void;

	/**
	 * Indicates that the editor becomes hidden.
	 * @internal
	 */
	onHide(): void;

	/**
	 * Instructs the editor to remeasure its container. This method should
	 * be called when the container of the editor gets resized.
	 *
	 * If a dimension is passed in, the passed in value will be used.
	 *
	 * By default, this will also render the editor immediately.
	 * If you prefer to delay rendering to the next animation frame, use postponeRendering == true.
	 */
	layout(dimension?: IDimension, postponeRendering?: boolean): void;

	/**
	 * Brings browser focus to the editor text
	 */
	focus(): void;

	/**
	 * Returns true if the text inside this editor is focused (i.e. cursor is blinking).
	 */
	hasTextFocus(): boolean;

	/**
	 * Returns all actions associated with this editor.
	 */
	getSupportedActions(): IEditorAction[];

	/**
	 * Saves current view state of the editor in a serializable object.
	 */
	saveViewState(): IEditorViewState | null;

	/**
	 * Restores the view state of the editor from a serializable object generated by `saveViewState`.
	 */
	restoreViewState(state: IEditorViewState | null): void;

	/**
	 * Given a position, returns a column number that takes tab-widths into account.
	 */
	getVisibleColumnFromPosition(position: IPosition): number;

	/**
	 * Given a position, returns a column number that takes tab-widths into account.
	 * @internal
	 */
	getStatusbarColumn(position: IPosition): number;

	/**
	 * Returns the primary position of the cursor.
	 */
	getPosition(): Position | null;

	/**
	 * Set the primary position of the cursor. This will remove any secondary cursors.
	 * @param position New primary cursor's position
	 * @param source Source of the call that caused the position
	 */
	setPosition(position: IPosition, source?: string): void;

	/**
	 * Scroll vertically as necessary and reveal a line.
	 */
	revealLine(lineNumber: number, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically as necessary and reveal a line centered vertically.
	 */
	revealLineInCenter(lineNumber: number, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically as necessary and reveal a line centered vertically only if it lies outside the viewport.
	 */
	revealLineInCenterIfOutsideViewport(lineNumber: number, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically as necessary and reveal a line close to the top of the viewport,
	 * optimized for viewing a code definition.
	 */
	revealLineNearTop(lineNumber: number, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically or horizontally as necessary and reveal a position.
	 */
	revealPosition(position: IPosition, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically or horizontally as necessary and reveal a position centered vertically.
	 */
	revealPositionInCenter(position: IPosition, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically or horizontally as necessary and reveal a position centered vertically only if it lies outside the viewport.
	 */
	revealPositionInCenterIfOutsideViewport(position: IPosition, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically or horizontally as necessary and reveal a position close to the top of the viewport,
	 * optimized for viewing a code definition.
	 */
	revealPositionNearTop(position: IPosition, scrollType?: ScrollType): void;

	/**
	 * Returns the primary selection of the editor.
	 */
	getSelection(): Selection | null;

	/**
	 * Returns all the selections of the editor.
	 */
	getSelections(): Selection[] | null;

	/**
	 * Set the primary selection of the editor. This will remove any secondary cursors.
	 * @param selection The new selection
	 * @param source Source of the call that caused the selection
	 */
	setSelection(selection: IRange, source?: string): void;
	/**
	 * Set the primary selection of the editor. This will remove any secondary cursors.
	 * @param selection The new selection
	 * @param source Source of the call that caused the selection
	 */
	setSelection(selection: Range, source?: string): void;
	/**
	 * Set the primary selection of the editor. This will remove any secondary cursors.
	 * @param selection The new selection
	 * @param source Source of the call that caused the selection
	 */
	setSelection(selection: ISelection, source?: string): void;
	/**
	 * Set the primary selection of the editor. This will remove any secondary cursors.
	 * @param selection The new selection
	 * @param source Source of the call that caused the selection
	 */
	setSelection(selection: Selection, source?: string): void;

	/**
	 * Set the selections for all the cursors of the editor.
	 * Cursors will be removed or added, as necessary.
	 * @param selections The new selection
	 * @param source Source of the call that caused the selection
	 */
	setSelections(selections: readonly ISelection[], source?: string): void;

	/**
	 * Scroll vertically as necessary and reveal lines.
	 */
	revealLines(startLineNumber: number, endLineNumber: number, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically as necessary and reveal lines centered vertically.
	 */
	revealLinesInCenter(lineNumber: number, endLineNumber: number, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically as necessary and reveal lines centered vertically only if it lies outside the viewport.
	 */
	revealLinesInCenterIfOutsideViewport(lineNumber: number, endLineNumber: number, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically as necessary and reveal lines close to the top of the viewport,
	 * optimized for viewing a code definition.
	 */
	revealLinesNearTop(lineNumber: number, endLineNumber: number, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically or horizontally as necessary and reveal a range.
	 */
	revealRange(range: IRange, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically or horizontally as necessary and reveal a range centered vertically.
	 */
	revealRangeInCenter(range: IRange, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically or horizontally as necessary and reveal a range at the top of the viewport.
	 */
	revealRangeAtTop(range: IRange, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically or horizontally as necessary and reveal a range centered vertically only if it lies outside the viewport.
	 */
	revealRangeInCenterIfOutsideViewport(range: IRange, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically or horizontally as necessary and reveal a range close to the top of the viewport,
	 * optimized for viewing a code definition.
	 */
	revealRangeNearTop(range: IRange, scrollType?: ScrollType): void;

	/**
	 * Scroll vertically or horizontally as necessary and reveal a range close to the top of the viewport,
	 * optimized for viewing a code definition. Only if it lies outside the viewport.
	 */
	revealRangeNearTopIfOutsideViewport(range: IRange, scrollType?: ScrollType): void;

	/**
	 * Directly trigger a handler or an editor action.
	 * @param source The source of the call.
	 * @param handlerId The id of the handler or the id of a contribution.
	 * @param payload Extra data to be sent to the handler.
	 */
	trigger(source: string | null | undefined, handlerId: string, payload: unknown): void;

	/**
	 * Gets the current model attached to this editor.
	 */
	getModel(): IEditorModel | null;

	/**
	 * Sets the current model attached to this editor.
	 * If the previous model was created by the editor via the value key in the options
	 * literal object, it will be destroyed. Otherwise, if the previous model was set
	 * via setModel, or the model key in the options literal object, the previous model
	 * will not be destroyed.
	 * It is safe to call setModel(null) to simply detach the current model from the editor.
	 */
	setModel(model: IEditorModel | null): void;

	/**
	 * Create a collection of decorations. All decorations added through this collection
	 * will get the ownerId of the editor (meaning they will not show up in other editors).
	 * These decorations will be automatically cleared when the editor's model changes.
	 */
	createDecorationsCollection(decorations?: IModelDeltaDecoration[]): IEditorDecorationsCollection;

	/**
	 * Change the decorations. All decorations added through this changeAccessor
	 * will get the ownerId of the editor (meaning they will not show up in other
	 * editors).
	 * @see {@link ITextModel.changeDecorations}
	 * @internal
	 */
	changeDecorations<T>(callback: (changeAccessor: IModelDecorationsChangeAccessor) => T): T | null;
}

/**
 * A diff editor.
 *
 * @internal
 */
export interface IDiffEditor extends IEditor {

	/**
	 * Type the getModel() of IEditor.
	 */
	getModel(): IDiffEditorModel | null;

	/**
	 * Get the `original` editor.
	 */
	getOriginalEditor(): IEditor;

	/**
	 * Get the `modified` editor.
	 */
	getModifiedEditor(): IEditor;
}

/**
 * @internal
 */
export interface ICompositeCodeEditor {

	/**
	 * An event that signals that the active editor has changed
	 */
	readonly onDidChangeActiveEditor: Event<ICompositeCodeEditor>;

	/**
	 * The active code editor iff any
	 */
	readonly activeCodeEditor: IEditor | undefined;
	// readonly editors: readonly ICodeEditor[] maybe supported with uris
}

/**
 * A collection of decorations
 */
export interface IEditorDecorationsCollection {
	/**
	 * An event emitted when decorations change in the editor,
	 * but the change is not caused by us setting or clearing the collection.
	 */
	readonly onDidChange: Event<IModelDecorationsChangedEvent>;
	/**
	 * Get the decorations count.
	 */
	length: number;
	/**
	 * Get the range for a decoration.
	 */
	getRange(index: number): Range | null;
	/**
	 * Get all ranges for decorations.
	 */
	getRanges(): Range[];
	/**
	 * Determine if a decoration is in this collection.
	 */
	has(decoration: IModelDecoration): boolean;
	/**
	 * Replace all previous decorations with `newDecorations`.
	 */
	set(newDecorations: readonly IModelDeltaDecoration[]): string[];
	/**
	 * Append `newDecorations` to this collection.
	 */
	append(newDecorations: readonly IModelDeltaDecoration[]): string[];
	/**
	 * Remove all previous decorations.
	 */
	clear(): void;
}

/**
 * An editor contribution that gets created every time a new editor gets created and gets disposed when the editor gets disposed.
 */
export interface IEditorContribution {
	/**
	 * Dispose this contribution.
	 */
	dispose(): void;
	/**
	 * Store view state.
	 */
	saveViewState?(): unknown;
	/**
	 * Restore view state.
	 */
	restoreViewState?(state: unknown): void;
}

/**
 * A diff editor contribution that gets created every time a new  diffeditor gets created and gets disposed when the diff editor gets disposed.
 * @internal
 */
export interface IDiffEditorContribution {
	/**
	 * Dispose this contribution.
	 */
	dispose(): void;
}

/**
 * @internal
 */
export function isThemeColor(o: unknown): o is ThemeColor {
	return !!o && typeof (o as ThemeColor).id === 'string';
}

/**
 * @internal
 */
export interface IThemeDecorationRenderOptions {
	backgroundColor?: string | ThemeColor;

	outline?: string;
	outlineColor?: string | ThemeColor;
	outlineStyle?: string;
	outlineWidth?: string;

	border?: string;
	borderColor?: string | ThemeColor;
	borderRadius?: string;
	borderSpacing?: string;
	borderStyle?: string;
	borderWidth?: string;

	fontStyle?: string;
	fontWeight?: string;
	fontFamily?: string;
	fontSize?: string;
	lineHeight?: number;
	textDecoration?: string;
	cursor?: string;
	color?: string | ThemeColor;
	opacity?: string;
	letterSpacing?: string;

	gutterIconPath?: UriComponents;
	gutterIconSize?: string;

	overviewRulerColor?: string | ThemeColor;

	/**
	 * @deprecated
	 */
	before?: IContentDecorationRenderOptions;
	/**
	 * @deprecated
	 */
	after?: IContentDecorationRenderOptions;

	/**
	 * @deprecated
	 */
	beforeInjectedText?: IContentDecorationRenderOptions & { affectsLetterSpacing?: boolean };
	/**
	 * @deprecated
	 */
	afterInjectedText?: IContentDecorationRenderOptions & { affectsLetterSpacing?: boolean };
}

/**
 * @internal
 */
export interface IContentDecorationRenderOptions {
	contentText?: string;
	contentIconPath?: UriComponents;

	border?: string;
	borderColor?: string | ThemeColor;
	borderRadius?: string;
	fontStyle?: string;
	fontWeight?: string;
	fontSize?: string;
	fontFamily?: string;
	textDecoration?: string;
	color?: string | ThemeColor;
	backgroundColor?: string | ThemeColor;
	opacity?: string;
	verticalAlign?: string;

	margin?: string;
	padding?: string;
	width?: string;
	height?: string;
}

/**
 * @internal
 */
export interface IDecorationRenderOptions extends IThemeDecorationRenderOptions {
	isWholeLine?: boolean;
	rangeBehavior?: TrackedRangeStickiness;
	overviewRulerLane?: OverviewRulerLane;

	light?: IThemeDecorationRenderOptions;
	dark?: IThemeDecorationRenderOptions;
}

/**
 * @internal
 */
export interface IThemeDecorationInstanceRenderOptions {
	/**
	 * @deprecated
	 */
	before?: IContentDecorationRenderOptions;
	/**
	 * @deprecated
	 */
	after?: IContentDecorationRenderOptions;
}

/**
 * @internal
 */
export interface IDecorationInstanceRenderOptions extends IThemeDecorationInstanceRenderOptions {
	light?: IThemeDecorationInstanceRenderOptions;
	dark?: IThemeDecorationInstanceRenderOptions;
}

/**
 * @internal
 */
export interface IDecorationOptions {
	range: IRange;
	hoverMessage?: IMarkdownString | IMarkdownString[];
	renderOptions?: IDecorationInstanceRenderOptions;
}

/**
 * The type of the `IEditor`.
 */
export const EditorType = {
	ICodeEditor: 'vs.editor.ICodeEditor',
	IDiffEditor: 'vs.editor.IDiffEditor'
};

/**
 * Built-in commands.
 * @internal
 */
export const enum Handler {
	CompositionStart = 'compositionStart',
	CompositionEnd = 'compositionEnd',
	Type = 'type',
	ReplacePreviousChar = 'replacePreviousChar',
	CompositionType = 'compositionType',
	Paste = 'paste',
	Cut = 'cut',
}

/**
 * @internal
 */
export interface TypePayload {
	text: string;
}

/**
 * @internal
 */
export interface ReplacePreviousCharPayload {
	text: string;
	replaceCharCnt: number;
}

/**
 * @internal
 */
export interface CompositionTypePayload {
	text: string;
	replacePrevCharCnt: number;
	replaceNextCharCnt: number;
	positionDelta: number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/editorContextKeys.ts]---
Location: vscode-main/src/vs/editor/common/editorContextKeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../nls.js';
import { RawContextKey } from '../../platform/contextkey/common/contextkey.js';

export namespace EditorContextKeys {

	export const editorSimpleInput = new RawContextKey<boolean>('editorSimpleInput', false, true);
	/**
	 * A context key that is set when the editor's text has focus (cursor is blinking).
	 * Is false when focus is in simple editor widgets (repl input, scm commit input).
	 */
	export const editorTextFocus = new RawContextKey<boolean>('editorTextFocus', false, nls.localize('editorTextFocus', "Whether the editor text has focus (cursor is blinking)"));
	/**
	 * A context key that is set when the editor's text or an editor's widget has focus.
	 */
	export const focus = new RawContextKey<boolean>('editorFocus', false, nls.localize('editorFocus', "Whether the editor or an editor widget has focus (e.g. focus is in the find widget)"));

	/**
	 * A context key that is set when any editor input has focus (regular editor, repl input...).
	 */
	export const textInputFocus = new RawContextKey<boolean>('textInputFocus', false, nls.localize('textInputFocus', "Whether an editor or a rich text input has focus (cursor is blinking)"));

	export const readOnly = new RawContextKey<boolean>('editorReadonly', false, nls.localize('editorReadonly', "Whether the editor is read-only"));
	export const inDiffEditor = new RawContextKey<boolean>('inDiffEditor', false, nls.localize('inDiffEditor', "Whether the context is a diff editor"));
	export const isEmbeddedDiffEditor = new RawContextKey<boolean>('isEmbeddedDiffEditor', false, nls.localize('isEmbeddedDiffEditor', "Whether the context is an embedded diff editor"));
	export const inMultiDiffEditor = new RawContextKey<boolean>('inMultiDiffEditor', false, nls.localize('inMultiDiffEditor', "Whether the context is a multi diff editor"));
	export const multiDiffEditorAllCollapsed = new RawContextKey<boolean>('multiDiffEditorAllCollapsed', undefined, nls.localize('multiDiffEditorAllCollapsed', "Whether all files in multi diff editor are collapsed"));
	export const hasChanges = new RawContextKey<boolean>('diffEditorHasChanges', false, nls.localize('diffEditorHasChanges', "Whether the diff editor has changes"));
	export const comparingMovedCode = new RawContextKey<boolean>('comparingMovedCode', false, nls.localize('comparingMovedCode', "Whether a moved code block is selected for comparison"));
	export const accessibleDiffViewerVisible = new RawContextKey<boolean>('accessibleDiffViewerVisible', false, nls.localize('accessibleDiffViewerVisible', "Whether the accessible diff viewer is visible"));
	export const diffEditorRenderSideBySideInlineBreakpointReached = new RawContextKey<boolean>('diffEditorRenderSideBySideInlineBreakpointReached', false, nls.localize('diffEditorRenderSideBySideInlineBreakpointReached', "Whether the diff editor render side by side inline breakpoint is reached"));
	export const diffEditorInlineMode = new RawContextKey<boolean>('diffEditorInlineMode', false, nls.localize('diffEditorInlineMode', "Whether inline mode is active"));

	export const diffEditorOriginalWritable = new RawContextKey<boolean>('diffEditorOriginalWritable', false, nls.localize('diffEditorOriginalWritable', "Whether modified is writable in the diff editor"));
	export const diffEditorModifiedWritable = new RawContextKey<boolean>('diffEditorModifiedWritable', false, nls.localize('diffEditorModifiedWritable', "Whether modified is writable in the diff editor"));
	export const diffEditorOriginalUri = new RawContextKey<string>('diffEditorOriginalUri', '', nls.localize('diffEditorOriginalUri', "The uri of the original document"));
	export const diffEditorModifiedUri = new RawContextKey<string>('diffEditorModifiedUri', '', nls.localize('diffEditorModifiedUri', "The uri of the modified document"));

	export const columnSelection = new RawContextKey<boolean>('editorColumnSelection', false, nls.localize('editorColumnSelection', "Whether `editor.columnSelection` is enabled"));
	export const writable = readOnly.toNegated();
	export const hasNonEmptySelection = new RawContextKey<boolean>('editorHasSelection', false, nls.localize('editorHasSelection', "Whether the editor has text selected"));
	export const hasOnlyEmptySelection = hasNonEmptySelection.toNegated();
	export const hasMultipleSelections = new RawContextKey<boolean>('editorHasMultipleSelections', false, nls.localize('editorHasMultipleSelections', "Whether the editor has multiple selections"));
	export const hasSingleSelection = hasMultipleSelections.toNegated();
	export const tabMovesFocus = new RawContextKey<boolean>('editorTabMovesFocus', false, nls.localize('editorTabMovesFocus', "Whether `Tab` will move focus out of the editor"));
	export const tabDoesNotMoveFocus = tabMovesFocus.toNegated();
	export const isInEmbeddedEditor = new RawContextKey<boolean>('isInEmbeddedEditor', false, true);
	export const canUndo = new RawContextKey<boolean>('canUndo', false, true);
	export const canRedo = new RawContextKey<boolean>('canRedo', false, true);

	export const hoverVisible = new RawContextKey<boolean>('editorHoverVisible', false, nls.localize('editorHoverVisible', "Whether the editor hover is visible"));
	export const hoverFocused = new RawContextKey<boolean>('editorHoverFocused', false, nls.localize('editorHoverFocused', "Whether the editor hover is focused"));

	export const stickyScrollFocused = new RawContextKey<boolean>('stickyScrollFocused', false, nls.localize('stickyScrollFocused', "Whether the sticky scroll is focused"));
	export const stickyScrollVisible = new RawContextKey<boolean>('stickyScrollVisible', false, nls.localize('stickyScrollVisible', "Whether the sticky scroll is visible"));

	export const standaloneColorPickerVisible = new RawContextKey<boolean>('standaloneColorPickerVisible', false, nls.localize('standaloneColorPickerVisible', "Whether the standalone color picker is visible"));
	export const standaloneColorPickerFocused = new RawContextKey<boolean>('standaloneColorPickerFocused', false, nls.localize('standaloneColorPickerFocused', "Whether the standalone color picker is focused"));
	/**
	 * A context key that is set when an editor is part of a larger editor, like notebooks or
	 * (future) a diff editor
	 */
	export const inCompositeEditor = new RawContextKey<boolean>('inCompositeEditor', undefined, nls.localize('inCompositeEditor', "Whether the editor is part of a larger editor (e.g. notebooks)"));
	export const notInCompositeEditor = inCompositeEditor.toNegated();

	// -- mode context keys
	export const languageId = new RawContextKey<string>('editorLangId', '', nls.localize('editorLangId', "The language identifier of the editor"));
	export const hasCompletionItemProvider = new RawContextKey<boolean>('editorHasCompletionItemProvider', false, nls.localize('editorHasCompletionItemProvider', "Whether the editor has a completion item provider"));
	export const hasCodeActionsProvider = new RawContextKey<boolean>('editorHasCodeActionsProvider', false, nls.localize('editorHasCodeActionsProvider', "Whether the editor has a code actions provider"));
	export const hasCodeLensProvider = new RawContextKey<boolean>('editorHasCodeLensProvider', false, nls.localize('editorHasCodeLensProvider', "Whether the editor has a code lens provider"));
	export const hasDefinitionProvider = new RawContextKey<boolean>('editorHasDefinitionProvider', false, nls.localize('editorHasDefinitionProvider', "Whether the editor has a definition provider"));
	export const hasDeclarationProvider = new RawContextKey<boolean>('editorHasDeclarationProvider', false, nls.localize('editorHasDeclarationProvider', "Whether the editor has a declaration provider"));
	export const hasImplementationProvider = new RawContextKey<boolean>('editorHasImplementationProvider', false, nls.localize('editorHasImplementationProvider', "Whether the editor has an implementation provider"));
	export const hasTypeDefinitionProvider = new RawContextKey<boolean>('editorHasTypeDefinitionProvider', false, nls.localize('editorHasTypeDefinitionProvider', "Whether the editor has a type definition provider"));
	export const hasHoverProvider = new RawContextKey<boolean>('editorHasHoverProvider', false, nls.localize('editorHasHoverProvider', "Whether the editor has a hover provider"));
	export const hasDocumentHighlightProvider = new RawContextKey<boolean>('editorHasDocumentHighlightProvider', false, nls.localize('editorHasDocumentHighlightProvider', "Whether the editor has a document highlight provider"));
	export const hasDocumentSymbolProvider = new RawContextKey<boolean>('editorHasDocumentSymbolProvider', false, nls.localize('editorHasDocumentSymbolProvider', "Whether the editor has a document symbol provider"));
	export const hasReferenceProvider = new RawContextKey<boolean>('editorHasReferenceProvider', false, nls.localize('editorHasReferenceProvider', "Whether the editor has a reference provider"));
	export const hasRenameProvider = new RawContextKey<boolean>('editorHasRenameProvider', false, nls.localize('editorHasRenameProvider', "Whether the editor has a rename provider"));
	export const hasSignatureHelpProvider = new RawContextKey<boolean>('editorHasSignatureHelpProvider', false, nls.localize('editorHasSignatureHelpProvider', "Whether the editor has a signature help provider"));
	export const hasInlayHintsProvider = new RawContextKey<boolean>('editorHasInlayHintsProvider', false, nls.localize('editorHasInlayHintsProvider', "Whether the editor has an inline hints provider"));

	// -- mode context keys: formatting
	export const hasDocumentFormattingProvider = new RawContextKey<boolean>('editorHasDocumentFormattingProvider', false, nls.localize('editorHasDocumentFormattingProvider', "Whether the editor has a document formatting provider"));
	export const hasDocumentSelectionFormattingProvider = new RawContextKey<boolean>('editorHasDocumentSelectionFormattingProvider', false, nls.localize('editorHasDocumentSelectionFormattingProvider', "Whether the editor has a document selection formatting provider"));
	export const hasMultipleDocumentFormattingProvider = new RawContextKey<boolean>('editorHasMultipleDocumentFormattingProvider', false, nls.localize('editorHasMultipleDocumentFormattingProvider', "Whether the editor has multiple document formatting providers"));
	export const hasMultipleDocumentSelectionFormattingProvider = new RawContextKey<boolean>('editorHasMultipleDocumentSelectionFormattingProvider', false, nls.localize('editorHasMultipleDocumentSelectionFormattingProvider', "Whether the editor has multiple document selection formatting providers"));

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/editorFeatures.ts]---
Location: vscode-main/src/vs/editor/common/editorFeatures.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrandedService, IConstructorSignature } from '../../platform/instantiation/common/instantiation.js';

/**
 * A feature that will be loaded when the first code editor is constructed and disposed when the system shuts down.
 */
export interface IEditorFeature {
	// Marker Interface
}

export type EditorFeatureCtor = IConstructorSignature<IEditorFeature>;

const editorFeatures: EditorFeatureCtor[] = [];

/**
 * Registers an editor feature. Editor features will be instantiated only once, as soon as
 * the first code editor is instantiated.
 */
export function registerEditorFeature<Services extends BrandedService[]>(ctor: { new(...services: Services): IEditorFeature }): void {
	editorFeatures.push(ctor as EditorFeatureCtor);
}

export function getEditorFeatures(): Iterable<EditorFeatureCtor> {
	return editorFeatures.slice(0);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/editorTheme.ts]---
Location: vscode-main/src/vs/editor/common/editorTheme.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IColorTheme } from '../../platform/theme/common/themeService.js';
import { ColorIdentifier } from '../../platform/theme/common/colorRegistry.js';
import { Color } from '../../base/common/color.js';
import { ColorScheme } from '../../platform/theme/common/theme.js';

export class EditorTheme {

	private _theme: IColorTheme;

	public get type(): ColorScheme {
		return this._theme.type;
	}

	public get value(): IColorTheme {
		return this._theme;
	}

	constructor(theme: IColorTheme) {
		this._theme = theme;
	}

	public update(theme: IColorTheme): void {
		this._theme = theme;
	}

	public getColor(color: ColorIdentifier): Color | undefined {
		return this._theme.getColor(color);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/encodedTokenAttributes.ts]---
Location: vscode-main/src/vs/editor/common/encodedTokenAttributes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Open ended enum at runtime
 */
export const enum LanguageId {
	Null = 0,
	PlainText = 1
}

/**
 * A font style. Values are 2^x such that a bit mask can be used.
 */
export const enum FontStyle {
	NotSet = -1,
	None = 0,
	Italic = 1,
	Bold = 2,
	Underline = 4,
	Strikethrough = 8,
}

/**
 * Open ended enum at runtime
 */
export const enum ColorId {
	None = 0,
	DefaultForeground = 1,
	DefaultBackground = 2
}

/**
 * A standard token type.
 */
export const enum StandardTokenType {
	Other = 0,
	Comment = 1,
	String = 2,
	RegEx = 3
}

/**
 * Helpers to manage the "collapsed" metadata of an entire StackElement stack.
 * The following assumptions have been made:
 *  - languageId < 256 => needs 8 bits
 *  - unique color count < 512 => needs 9 bits
 *
 * The binary format is:
 * - -------------------------------------------
 *     3322 2222 2222 1111 1111 1100 0000 0000
 *     1098 7654 3210 9876 5432 1098 7654 3210
 * - -------------------------------------------
 *     xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx
 *     bbbb bbbb ffff ffff fFFF FBTT LLLL LLLL
 * - -------------------------------------------
 *  - L = LanguageId (8 bits)
 *  - T = StandardTokenType (2 bits)
 *  - B = Balanced bracket (1 bit)
 *  - F = FontStyle (4 bits)
 *  - f = foreground color (9 bits)
 *  - b = background color (8 bits)
 *
 */
export const enum MetadataConsts {
	LANGUAGEID_MASK /*            */ = 0b00000000_00000000_00000000_11111111,
	TOKEN_TYPE_MASK /*            */ = 0b00000000_00000000_00000011_00000000,
	BALANCED_BRACKETS_MASK /*     */ = 0b00000000_00000000_00000100_00000000,
	FONT_STYLE_MASK /*            */ = 0b00000000_00000000_01111000_00000000,
	FOREGROUND_MASK /*            */ = 0b00000000_11111111_10000000_00000000,
	BACKGROUND_MASK /*            */ = 0b11111111_00000000_00000000_00000000,

	ITALIC_MASK /*                */ = 0b00000000_00000000_00001000_00000000,
	BOLD_MASK /*                  */ = 0b00000000_00000000_00010000_00000000,
	UNDERLINE_MASK /*             */ = 0b00000000_00000000_00100000_00000000,
	STRIKETHROUGH_MASK /*         */ = 0b00000000_00000000_01000000_00000000,

	// Semantic tokens cannot set the language id, so we can
	// use the first 8 bits for control purposes
	SEMANTIC_USE_ITALIC /*        */ = 0b00000000_00000000_00000000_00000001,
	SEMANTIC_USE_BOLD /*          */ = 0b00000000_00000000_00000000_00000010,
	SEMANTIC_USE_UNDERLINE  /*    */ = 0b00000000_00000000_00000000_00000100,
	SEMANTIC_USE_STRIKETHROUGH /* */ = 0b00000000_00000000_00000000_00001000,
	SEMANTIC_USE_FOREGROUND /*    */ = 0b00000000_00000000_00000000_00010000,
	SEMANTIC_USE_BACKGROUND /*    */ = 0b00000000_00000000_00000000_00100000,

	LANGUAGEID_OFFSET = 0,
	TOKEN_TYPE_OFFSET = 8,
	BALANCED_BRACKETS_OFFSET = 10,
	FONT_STYLE_OFFSET = 11,
	FOREGROUND_OFFSET = 15,
	BACKGROUND_OFFSET = 24
}

/**
 */
export class TokenMetadata {

	public static getLanguageId(metadata: number): LanguageId {
		return (metadata & MetadataConsts.LANGUAGEID_MASK) >>> MetadataConsts.LANGUAGEID_OFFSET;
	}

	public static getTokenType(metadata: number): StandardTokenType {
		return (metadata & MetadataConsts.TOKEN_TYPE_MASK) >>> MetadataConsts.TOKEN_TYPE_OFFSET;
	}

	public static containsBalancedBrackets(metadata: number): boolean {
		return (metadata & MetadataConsts.BALANCED_BRACKETS_MASK) !== 0;
	}

	public static getFontStyle(metadata: number): FontStyle {
		return (metadata & MetadataConsts.FONT_STYLE_MASK) >>> MetadataConsts.FONT_STYLE_OFFSET;
	}

	public static getForeground(metadata: number): ColorId {
		return (metadata & MetadataConsts.FOREGROUND_MASK) >>> MetadataConsts.FOREGROUND_OFFSET;
	}

	public static getBackground(metadata: number): ColorId {
		return (metadata & MetadataConsts.BACKGROUND_MASK) >>> MetadataConsts.BACKGROUND_OFFSET;
	}

	public static getClassNameFromMetadata(metadata: number): string {
		const foreground = this.getForeground(metadata);
		let className = 'mtk' + foreground;

		const fontStyle = this.getFontStyle(metadata);
		if (fontStyle & FontStyle.Italic) {
			className += ' mtki';
		}
		if (fontStyle & FontStyle.Bold) {
			className += ' mtkb';
		}
		if (fontStyle & FontStyle.Underline) {
			className += ' mtku';
		}
		if (fontStyle & FontStyle.Strikethrough) {
			className += ' mtks';
		}

		return className;
	}

	public static getInlineStyleFromMetadata(metadata: number, colorMap: string[]): string {
		const foreground = this.getForeground(metadata);
		const fontStyle = this.getFontStyle(metadata);

		let result = `color: ${colorMap[foreground]};`;
		if (fontStyle & FontStyle.Italic) {
			result += 'font-style: italic;';
		}
		if (fontStyle & FontStyle.Bold) {
			result += 'font-weight: bold;';
		}
		let textDecoration = '';
		if (fontStyle & FontStyle.Underline) {
			textDecoration += ' underline';
		}
		if (fontStyle & FontStyle.Strikethrough) {
			textDecoration += ' line-through';
		}
		if (textDecoration) {
			result += `text-decoration:${textDecoration};`;

		}
		return result;
	}

	public static getPresentationFromMetadata(metadata: number): ITokenPresentation {
		const foreground = this.getForeground(metadata);
		const fontStyle = this.getFontStyle(metadata);

		return {
			foreground: foreground,
			italic: Boolean(fontStyle & FontStyle.Italic),
			bold: Boolean(fontStyle & FontStyle.Bold),
			underline: Boolean(fontStyle & FontStyle.Underline),
			strikethrough: Boolean(fontStyle & FontStyle.Strikethrough),
		};
	}
}

/**
 */
export interface ITokenPresentation {
	foreground: ColorId;
	italic: boolean;
	bold: boolean;
	underline: boolean;
	strikethrough: boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/inputMode.ts]---
Location: vscode-main/src/vs/editor/common/inputMode.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../base/common/event.js';

class InputModeImpl {

	private _inputMode: 'overtype' | 'insert' = 'insert';
	private readonly _onDidChangeInputMode = new Emitter<'overtype' | 'insert'>();
	public readonly onDidChangeInputMode: Event<'overtype' | 'insert'> = this._onDidChangeInputMode.event;

	public getInputMode(): 'overtype' | 'insert' {
		return this._inputMode;
	}

	public setInputMode(inputMode: 'overtype' | 'insert'): void {
		this._inputMode = inputMode;
		this._onDidChangeInputMode.fire(this._inputMode);
	}
}

/**
 * Controls the type mode, whether insert or overtype
 */
export const InputMode = new InputModeImpl();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languageFeatureRegistry.ts]---
Location: vscode-main/src/vs/editor/common/languageFeatureRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../base/common/event.js';
import { IDisposable, toDisposable } from '../../base/common/lifecycle.js';
import { ITextModel, shouldSynchronizeModel } from './model.js';
import { LanguageFilter, LanguageSelector, score } from './languageSelector.js';
import { URI } from '../../base/common/uri.js';

interface Entry<T> {
	readonly selector: LanguageSelector;
	readonly provider: T;
	_score: number;
	readonly _time: number;
}

function isExclusive(selector: LanguageSelector): boolean {
	if (typeof selector === 'string') {
		return false;
	} else if (Array.isArray(selector)) {
		return selector.every(isExclusive);
	} else {
		return !!(selector as LanguageFilter).exclusive; // TODO: microsoft/TypeScript#42768
	}
}

export interface NotebookInfo {
	readonly uri: URI;
	readonly type: string;
}

export interface NotebookInfoResolver {
	(uri: URI): NotebookInfo | undefined;
}

class MatchCandidate {
	constructor(
		readonly uri: URI,
		readonly languageId: string,
		readonly notebookUri: URI | undefined,
		readonly notebookType: string | undefined,
		readonly recursive: boolean,
	) { }

	equals(other: MatchCandidate): boolean {
		return this.notebookType === other.notebookType
			&& this.languageId === other.languageId
			&& this.uri.toString() === other.uri.toString()
			&& this.notebookUri?.toString() === other.notebookUri?.toString()
			&& this.recursive === other.recursive;
	}
}

export class LanguageFeatureRegistry<T> {

	private _clock: number = 0;
	private readonly _entries: Entry<T>[] = [];

	private readonly _onDidChange = new Emitter<number>();
	get onDidChange() { return this._onDidChange.event; }

	constructor(private readonly _notebookInfoResolver?: NotebookInfoResolver) { }

	register(selector: LanguageSelector, provider: T): IDisposable {

		let entry: Entry<T> | undefined = {
			selector,
			provider,
			_score: -1,
			_time: this._clock++
		};

		this._entries.push(entry);
		this._lastCandidate = undefined;
		this._onDidChange.fire(this._entries.length);

		return toDisposable(() => {
			if (entry) {
				const idx = this._entries.indexOf(entry);
				if (idx >= 0) {
					this._entries.splice(idx, 1);
					this._lastCandidate = undefined;
					this._onDidChange.fire(this._entries.length);
					entry = undefined;
				}
			}
		});
	}

	has(model: ITextModel): boolean {
		return this.all(model).length > 0;
	}

	all(model: ITextModel): T[] {
		if (!model) {
			return [];
		}

		this._updateScores(model, false);
		const result: T[] = [];

		// from registry
		for (const entry of this._entries) {
			if (entry._score > 0) {
				result.push(entry.provider);
			}
		}

		return result;
	}

	allNoModel(): T[] {
		return this._entries.map(entry => entry.provider);
	}

	ordered(model: ITextModel, recursive = false): T[] {
		const result: T[] = [];
		this._orderedForEach(model, recursive, entry => result.push(entry.provider));
		return result;
	}

	orderedGroups(model: ITextModel): T[][] {
		const result: T[][] = [];
		let lastBucket: T[];
		let lastBucketScore: number;

		this._orderedForEach(model, false, entry => {
			if (lastBucket && lastBucketScore === entry._score) {
				lastBucket.push(entry.provider);
			} else {
				lastBucketScore = entry._score;
				lastBucket = [entry.provider];
				result.push(lastBucket);
			}
		});

		return result;
	}

	private _orderedForEach(model: ITextModel, recursive: boolean, callback: (provider: Entry<T>) => void): void {

		this._updateScores(model, recursive);

		for (const entry of this._entries) {
			if (entry._score > 0) {
				callback(entry);
			}
		}
	}

	private _lastCandidate: MatchCandidate | undefined;

	private _updateScores(model: ITextModel, recursive: boolean): void {

		const notebookInfo = this._notebookInfoResolver?.(model.uri);

		// use the uri (scheme, pattern) of the notebook info iff we have one
		// otherwise it's the model's/document's uri
		const candidate = notebookInfo
			? new MatchCandidate(model.uri, model.getLanguageId(), notebookInfo.uri, notebookInfo.type, recursive)
			: new MatchCandidate(model.uri, model.getLanguageId(), undefined, undefined, recursive);

		if (this._lastCandidate?.equals(candidate)) {
			// nothing has changed
			return;
		}

		this._lastCandidate = candidate;

		for (const entry of this._entries) {
			entry._score = score(entry.selector, candidate.uri, candidate.languageId, shouldSynchronizeModel(model), candidate.notebookUri, candidate.notebookType);

			if (isExclusive(entry.selector) && entry._score > 0) {
				if (recursive) {
					entry._score = 0;
				} else {
					// support for one exclusive selector that overwrites
					// any other selector
					for (const entry of this._entries) {
						entry._score = 0;
					}
					entry._score = 1000;
					break;
				}
			}
		}

		// needs sorting
		this._entries.sort(LanguageFeatureRegistry._compareByScoreAndTime);
	}

	private static _compareByScoreAndTime(a: Entry<unknown>, b: Entry<unknown>): number {
		if (a._score < b._score) {
			return 1;
		} else if (a._score > b._score) {
			return -1;
		}

		// De-prioritize built-in providers
		if (isBuiltinSelector(a.selector) && !isBuiltinSelector(b.selector)) {
			return 1;
		} else if (!isBuiltinSelector(a.selector) && isBuiltinSelector(b.selector)) {
			return -1;
		}

		if (a._time < b._time) {
			return 1;
		} else if (a._time > b._time) {
			return -1;
		} else {
			return 0;
		}
	}
}

function isBuiltinSelector(selector: LanguageSelector): boolean {
	if (typeof selector === 'string') {
		return false;
	}

	if (Array.isArray(selector)) {
		return selector.some(isBuiltinSelector);
	}

	return Boolean((selector as LanguageFilter).isBuiltin);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languages.ts]---
Location: vscode-main/src/vs/editor/common/languages.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../base/common/buffer.js';
import { CancellationToken } from '../../base/common/cancellation.js';
import { Codicon } from '../../base/common/codicons.js';
import { Color } from '../../base/common/color.js';
import { IReadonlyVSDataTransfer } from '../../base/common/dataTransfer.js';
import { Event } from '../../base/common/event.js';
import { HierarchicalKind } from '../../base/common/hierarchicalKind.js';
import { IMarkdownString } from '../../base/common/htmlContent.js';
import { IDisposable } from '../../base/common/lifecycle.js';
import { ThemeIcon } from '../../base/common/themables.js';
import { URI, UriComponents } from '../../base/common/uri.js';
import { EditOperation, ISingleEditOperation } from './core/editOperation.js';
import { IPosition, Position } from './core/position.js';
import { IRange, Range } from './core/range.js';
import { Selection } from './core/selection.js';
import { LanguageId } from './encodedTokenAttributes.js';
import { LanguageSelector } from './languageSelector.js';
import * as model from './model.js';
import { TokenizationRegistry as TokenizationRegistryImpl } from './tokenizationRegistry.js';
import { ContiguousMultilineTokens } from './tokens/contiguousMultilineTokens.js';
import { localize } from '../../nls.js';
import { ExtensionIdentifier } from '../../platform/extensions/common/extensions.js';
import { IMarkerData } from '../../platform/markers/common/markers.js';
import { EditDeltaInfo } from './textModelEditSource.js';
import { FontTokensUpdate } from './textModelEvents.js';

/**
 * @internal
 */
export interface ILanguageIdCodec {
	encodeLanguageId(languageId: string): LanguageId;
	decodeLanguageId(languageId: LanguageId): string;
}

export class Token {
	_tokenBrand: void = undefined;

	constructor(
		public readonly offset: number,
		public readonly type: string,
		public readonly language: string,
	) {
	}

	public toString(): string {
		return '(' + this.offset + ', ' + this.type + ')';
	}
}

/**
 * @internal
 */
export class TokenizationResult {
	_tokenizationResultBrand: void = undefined;

	constructor(
		public readonly tokens: Token[],
		public readonly endState: IState,
	) {
	}
}

/**
 * @internal
 */
export interface IFontToken {
	readonly startIndex: number;
	readonly endIndex: number;
	readonly fontFamily: string | null;
	readonly fontSize: string | null;
	readonly lineHeight: number | null;
}

/**
 * @internal
 */
export class EncodedTokenizationResult {
	_encodedTokenizationResultBrand: void = undefined;

	constructor(
		/**
		 * The tokens in binary format. Each token occupies two array indices. For token i:
		 *  - at offset 2*i => startIndex
		 *  - at offset 2*i + 1 => metadata
		 *
		 */
		public readonly tokens: Uint32Array,
		public readonly fontInfo: IFontToken[],
		public readonly endState: IState,
	) {
	}
}

export interface SyntaxNode {
	startIndex: number;
	endIndex: number;
	startPosition: IPosition;
	endPosition: IPosition;
}

export interface QueryCapture {
	name: string;
	text?: string;
	node: SyntaxNode;
	encodedLanguageId: number;
}

/**
 * @internal
 */
export interface ITokenizationSupport {
	/**
	 * If true, the background tokenizer will only be used to verify tokens against the default background tokenizer.
	 * Used for debugging.
	 */
	readonly backgroundTokenizerShouldOnlyVerifyTokens?: boolean;

	getInitialState(): IState;

	tokenize(line: string, hasEOL: boolean, state: IState): TokenizationResult;

	tokenizeEncoded(line: string, hasEOL: boolean, state: IState): EncodedTokenizationResult;

	/**
	 * Can be/return undefined if default background tokenization should be used.
	 */
	createBackgroundTokenizer?(textModel: model.ITextModel, store: IBackgroundTokenizationStore): IBackgroundTokenizer | undefined;
}

/**
 * @internal
 */
export interface IBackgroundTokenizer extends IDisposable {
	/**
	 * Instructs the background tokenizer to set the tokens for the given range again.
	 *
	 * This might be necessary if the renderer overwrote those tokens with heuristically computed ones for some viewport,
	 * when the change does not even propagate to that viewport.
	 */
	requestTokens(startLineNumber: number, endLineNumberExclusive: number): void;

	reportMismatchingTokens?(lineNumber: number): void;
}

/**
 * @internal
 */
export interface IBackgroundTokenizationStore {
	setTokens(tokens: ContiguousMultilineTokens[]): void;

	setFontInfo(changes: FontTokensUpdate): void;

	setEndState(lineNumber: number, state: IState): void;

	/**
	 * Should be called to indicate that the background tokenization has finished for now.
	 * (This triggers bracket pair colorization to re-parse the bracket pairs with token information)
	 */
	backgroundTokenizationFinished(): void;
}

/**
 * The state of the tokenizer between two lines.
 * It is useful to store flags such as in multiline comment, etc.
 * The model will clone the previous line's state and pass it in to tokenize the next line.
 */
export interface IState {
	clone(): IState;
	equals(other: IState): boolean;
}

/**
 * A provider result represents the values a provider, like the {@link HoverProvider},
 * may return. For once this is the actual result type `T`, like `Hover`, or a thenable that resolves
 * to that type `T`. In addition, `null` and `undefined` can be returned - either directly or from a
 * thenable.
 */
export type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;

/**
 * A hover represents additional information for a symbol or word. Hovers are
 * rendered in a tooltip-like widget.
 */
export interface Hover {
	/**
	 * The contents of this hover.
	 */
	contents: IMarkdownString[];

	/**
	 * The range to which this hover applies. When missing, the
	 * editor will use the range at the current position or the
	 * current position itself.
	 */
	range?: IRange;

	/**
	 * Can increase the verbosity of the hover
	 */
	canIncreaseVerbosity?: boolean;

	/**
	 * Can decrease the verbosity of the hover
	 */
	canDecreaseVerbosity?: boolean;
}

/**
 * The hover provider interface defines the contract between extensions and
 * the [hover](https://code.visualstudio.com/docs/editor/intellisense)-feature.
 */
export interface HoverProvider<THover = Hover> {
	/**
	 * Provide a hover for the given position, context and document. Multiple hovers at the same
	 * position will be merged by the editor. A hover can have a range which defaults
	 * to the word range at the position when omitted.
	 */
	provideHover(model: model.ITextModel, position: Position, token: CancellationToken, context?: HoverContext<THover>): ProviderResult<THover>;
}

export interface HoverContext<THover = Hover> {
	/**
	 * Hover verbosity request
	 */
	verbosityRequest?: HoverVerbosityRequest<THover>;
}

export interface HoverVerbosityRequest<THover = Hover> {
	/**
	 * The delta by which to increase/decrease the hover verbosity level
	 */
	verbosityDelta: number;
	/**
	 * The previous hover for the same position
	 */
	previousHover: THover;
}

export enum HoverVerbosityAction {
	/**
	 * Increase the verbosity of the hover
	 */
	Increase,
	/**
	 * Decrease the verbosity of the hover
	 */
	Decrease
}

/**
 * An evaluatable expression represents additional information for an expression in a document. Evaluatable expressions are
 * evaluated by a debugger or runtime and their result is rendered in a tooltip-like widget.
 * @internal
 */
export interface EvaluatableExpression {
	/**
	 * The range to which this expression applies.
	 */
	range: IRange;
	/**
	 * This expression overrides the expression extracted from the range.
	 */
	expression?: string;
}


/**
 * The evaluatable expression provider interface defines the contract between extensions and
 * the debug hover.
 * @internal
 */
export interface EvaluatableExpressionProvider {
	/**
	 * Provide a hover for the given position and document. Multiple hovers at the same
	 * position will be merged by the editor. A hover can have a range which defaults
	 * to the word range at the position when omitted.
	 */
	provideEvaluatableExpression(model: model.ITextModel, position: Position, token: CancellationToken): ProviderResult<EvaluatableExpression>;
}

/**
 * A value-object that contains contextual information when requesting inline values from a InlineValuesProvider.
 * @internal
 */
export interface InlineValueContext {
	frameId: number;
	stoppedLocation: Range;
}

/**
 * Provide inline value as text.
 * @internal
 */
export interface InlineValueText {
	type: 'text';
	range: IRange;
	text: string;
}

/**
 * Provide inline value through a variable lookup.
 * @internal
 */
export interface InlineValueVariableLookup {
	type: 'variable';
	range: IRange;
	variableName?: string;
	caseSensitiveLookup: boolean;
}

/**
 * Provide inline value through an expression evaluation.
 * @internal
 */
export interface InlineValueExpression {
	type: 'expression';
	range: IRange;
	expression?: string;
}

/**
 * Inline value information can be provided by different means:
 * - directly as a text value (class InlineValueText).
 * - as a name to use for a variable lookup (class InlineValueVariableLookup)
 * - as an evaluatable expression (class InlineValueEvaluatableExpression)
 * The InlineValue types combines all inline value types into one type.
 * @internal
 */
export type InlineValue = InlineValueText | InlineValueVariableLookup | InlineValueExpression;

/**
 * The inline values provider interface defines the contract between extensions and
 * the debugger's inline values feature.
 * @internal
 */
export interface InlineValuesProvider {
	/**
	 */
	onDidChangeInlineValues?: Event<void> | undefined;
	/**
	 * Provide the "inline values" for the given range and document. Multiple hovers at the same
	 * position will be merged by the editor. A hover can have a range which defaults
	 * to the word range at the position when omitted.
	 */
	provideInlineValues(model: model.ITextModel, viewPort: Range, context: InlineValueContext, token: CancellationToken): ProviderResult<InlineValue[]>;
}

export const enum CompletionItemKind {
	Method,
	Function,
	Constructor,
	Field,
	Variable,
	Class,
	Struct,
	Interface,
	Module,
	Property,
	Event,
	Operator,
	Unit,
	Value,
	Constant,
	Enum,
	EnumMember,
	Keyword,
	Text,
	Color,
	File,
	Reference,
	Customcolor,
	Folder,
	TypeParameter,
	User,
	Issue,
	Tool,
	Snippet, // <- highest value (used for compare!)
}

/**
 * @internal
 */
export namespace CompletionItemKinds {

	const byKind = new Map<CompletionItemKind, ThemeIcon>();
	byKind.set(CompletionItemKind.Method, Codicon.symbolMethod);
	byKind.set(CompletionItemKind.Function, Codicon.symbolFunction);
	byKind.set(CompletionItemKind.Constructor, Codicon.symbolConstructor);
	byKind.set(CompletionItemKind.Field, Codicon.symbolField);
	byKind.set(CompletionItemKind.Variable, Codicon.symbolVariable);
	byKind.set(CompletionItemKind.Class, Codicon.symbolClass);
	byKind.set(CompletionItemKind.Struct, Codicon.symbolStruct);
	byKind.set(CompletionItemKind.Interface, Codicon.symbolInterface);
	byKind.set(CompletionItemKind.Module, Codicon.symbolModule);
	byKind.set(CompletionItemKind.Property, Codicon.symbolProperty);
	byKind.set(CompletionItemKind.Event, Codicon.symbolEvent);
	byKind.set(CompletionItemKind.Operator, Codicon.symbolOperator);
	byKind.set(CompletionItemKind.Unit, Codicon.symbolUnit);
	byKind.set(CompletionItemKind.Value, Codicon.symbolValue);
	byKind.set(CompletionItemKind.Enum, Codicon.symbolEnum);
	byKind.set(CompletionItemKind.Constant, Codicon.symbolConstant);
	byKind.set(CompletionItemKind.Enum, Codicon.symbolEnum);
	byKind.set(CompletionItemKind.EnumMember, Codicon.symbolEnumMember);
	byKind.set(CompletionItemKind.Keyword, Codicon.symbolKeyword);
	byKind.set(CompletionItemKind.Snippet, Codicon.symbolSnippet);
	byKind.set(CompletionItemKind.Text, Codicon.symbolText);
	byKind.set(CompletionItemKind.Color, Codicon.symbolColor);
	byKind.set(CompletionItemKind.File, Codicon.symbolFile);
	byKind.set(CompletionItemKind.Reference, Codicon.symbolReference);
	byKind.set(CompletionItemKind.Customcolor, Codicon.symbolCustomColor);
	byKind.set(CompletionItemKind.Folder, Codicon.symbolFolder);
	byKind.set(CompletionItemKind.TypeParameter, Codicon.symbolTypeParameter);
	byKind.set(CompletionItemKind.User, Codicon.account);
	byKind.set(CompletionItemKind.Issue, Codicon.issues);
	byKind.set(CompletionItemKind.Tool, Codicon.tools);

	/**
	 * @internal
	 */
	export function toIcon(kind: CompletionItemKind): ThemeIcon {
		let codicon = byKind.get(kind);
		if (!codicon) {
			console.info('No codicon found for CompletionItemKind ' + kind);
			codicon = Codicon.symbolProperty;
		}
		return codicon;
	}

	/**
	 * @internal
	 */
	export function toLabel(kind: CompletionItemKind): string {
		switch (kind) {
			case CompletionItemKind.Method: return localize('suggestWidget.kind.method', 'Method');
			case CompletionItemKind.Function: return localize('suggestWidget.kind.function', 'Function');
			case CompletionItemKind.Constructor: return localize('suggestWidget.kind.constructor', 'Constructor');
			case CompletionItemKind.Field: return localize('suggestWidget.kind.field', 'Field');
			case CompletionItemKind.Variable: return localize('suggestWidget.kind.variable', 'Variable');
			case CompletionItemKind.Class: return localize('suggestWidget.kind.class', 'Class');
			case CompletionItemKind.Struct: return localize('suggestWidget.kind.struct', 'Struct');
			case CompletionItemKind.Interface: return localize('suggestWidget.kind.interface', 'Interface');
			case CompletionItemKind.Module: return localize('suggestWidget.kind.module', 'Module');
			case CompletionItemKind.Property: return localize('suggestWidget.kind.property', 'Property');
			case CompletionItemKind.Event: return localize('suggestWidget.kind.event', 'Event');
			case CompletionItemKind.Operator: return localize('suggestWidget.kind.operator', 'Operator');
			case CompletionItemKind.Unit: return localize('suggestWidget.kind.unit', 'Unit');
			case CompletionItemKind.Value: return localize('suggestWidget.kind.value', 'Value');
			case CompletionItemKind.Constant: return localize('suggestWidget.kind.constant', 'Constant');
			case CompletionItemKind.Enum: return localize('suggestWidget.kind.enum', 'Enum');
			case CompletionItemKind.EnumMember: return localize('suggestWidget.kind.enumMember', 'Enum Member');
			case CompletionItemKind.Keyword: return localize('suggestWidget.kind.keyword', 'Keyword');
			case CompletionItemKind.Text: return localize('suggestWidget.kind.text', 'Text');
			case CompletionItemKind.Color: return localize('suggestWidget.kind.color', 'Color');
			case CompletionItemKind.File: return localize('suggestWidget.kind.file', 'File');
			case CompletionItemKind.Reference: return localize('suggestWidget.kind.reference', 'Reference');
			case CompletionItemKind.Customcolor: return localize('suggestWidget.kind.customcolor', 'Custom Color');
			case CompletionItemKind.Folder: return localize('suggestWidget.kind.folder', 'Folder');
			case CompletionItemKind.TypeParameter: return localize('suggestWidget.kind.typeParameter', 'Type Parameter');
			case CompletionItemKind.User: return localize('suggestWidget.kind.user', 'User');
			case CompletionItemKind.Issue: return localize('suggestWidget.kind.issue', 'Issue');
			case CompletionItemKind.Tool: return localize('suggestWidget.kind.tool', 'Tool');
			case CompletionItemKind.Snippet: return localize('suggestWidget.kind.snippet', 'Snippet');
			default: return '';
		}
	}

	const data = new Map<string, CompletionItemKind>();
	data.set('method', CompletionItemKind.Method);
	data.set('function', CompletionItemKind.Function);
	data.set('constructor', CompletionItemKind.Constructor);
	data.set('field', CompletionItemKind.Field);
	data.set('variable', CompletionItemKind.Variable);
	data.set('class', CompletionItemKind.Class);
	data.set('struct', CompletionItemKind.Struct);
	data.set('interface', CompletionItemKind.Interface);
	data.set('module', CompletionItemKind.Module);
	data.set('property', CompletionItemKind.Property);
	data.set('event', CompletionItemKind.Event);
	data.set('operator', CompletionItemKind.Operator);
	data.set('unit', CompletionItemKind.Unit);
	data.set('value', CompletionItemKind.Value);
	data.set('constant', CompletionItemKind.Constant);
	data.set('enum', CompletionItemKind.Enum);
	data.set('enum-member', CompletionItemKind.EnumMember);
	data.set('enumMember', CompletionItemKind.EnumMember);
	data.set('keyword', CompletionItemKind.Keyword);
	data.set('snippet', CompletionItemKind.Snippet);
	data.set('text', CompletionItemKind.Text);
	data.set('color', CompletionItemKind.Color);
	data.set('file', CompletionItemKind.File);
	data.set('reference', CompletionItemKind.Reference);
	data.set('customcolor', CompletionItemKind.Customcolor);
	data.set('folder', CompletionItemKind.Folder);
	data.set('type-parameter', CompletionItemKind.TypeParameter);
	data.set('typeParameter', CompletionItemKind.TypeParameter);
	data.set('account', CompletionItemKind.User);
	data.set('issue', CompletionItemKind.Issue);
	data.set('tool', CompletionItemKind.Tool);

	/**
	 * @internal
	 */
	export function fromString(value: string): CompletionItemKind;
	/**
	 * @internal
	 */
	export function fromString(value: string, strict: true): CompletionItemKind | undefined;
	/**
	 * @internal
	 */
	export function fromString(value: string, strict?: boolean): CompletionItemKind | undefined {
		let res = data.get(value);
		if (typeof res === 'undefined' && !strict) {
			res = CompletionItemKind.Property;
		}
		return res;
	}
}

export interface CompletionItemLabel {
	label: string;
	detail?: string;
	description?: string;
}

export const enum CompletionItemTag {
	Deprecated = 1
}

export const enum CompletionItemInsertTextRule {
	None = 0,

	/**
	 * Adjust whitespace/indentation of multiline insert texts to
	 * match the current line indentation.
	 */
	KeepWhitespace = 0b001,

	/**
	 * `insertText` is a snippet.
	 */
	InsertAsSnippet = 0b100,
}

export interface CompletionItemRanges {
	insert: IRange;
	replace: IRange;
}

/**
 * A completion item represents a text snippet that is
 * proposed to complete text that is being typed.
 */
export interface CompletionItem {
	/**
	 * The label of this completion item. By default
	 * this is also the text that is inserted when selecting
	 * this completion.
	 */
	label: string | CompletionItemLabel;
	/**
	 * The kind of this completion item. Based on the kind
	 * an icon is chosen by the editor.
	 */
	kind: CompletionItemKind;
	/**
	 * A modifier to the `kind` which affect how the item
	 * is rendered, e.g. Deprecated is rendered with a strikeout
	 */
	tags?: ReadonlyArray<CompletionItemTag>;
	/**
	 * A human-readable string with additional information
	 * about this item, like type or symbol information.
	 */
	detail?: string;
	/**
	 * A human-readable string that represents a doc-comment.
	 */
	documentation?: string | IMarkdownString;
	/**
	 * A string that should be used when comparing this item
	 * with other items. When `falsy` the {@link CompletionItem.label label}
	 * is used.
	 */
	sortText?: string;
	/**
	 * A string that should be used when filtering a set of
	 * completion items. When `falsy` the {@link CompletionItem.label label}
	 * is used.
	 */
	filterText?: string;
	/**
	 * Select this item when showing. *Note* that only one completion item can be selected and
	 * that the editor decides which item that is. The rule is that the *first* item of those
	 * that match best is selected.
	 */
	preselect?: boolean;
	/**
	 * A string or snippet that should be inserted in a document when selecting
	 * this completion.
	 */
	insertText: string;
	/**
	 * Additional rules (as bitmask) that should be applied when inserting
	 * this completion.
	 */
	insertTextRules?: CompletionItemInsertTextRule;
	/**
	 * A range of text that should be replaced by this completion item.
	 *
	 * *Note:* The range must be a {@link Range.isSingleLine single line} and it must
	 * {@link Range.contains contain} the position at which completion has been {@link CompletionItemProvider.provideCompletionItems requested}.
	 */
	range: IRange | CompletionItemRanges;
	/**
	 * An optional set of characters that when pressed while this completion is active will accept it first and
	 * then type that character. *Note* that all commit characters should have `length=1` and that superfluous
	 * characters will be ignored.
	 */
	commitCharacters?: string[];
	/**
	 * An optional array of additional text edits that are applied when
	 * selecting this completion. Edits must not overlap with the main edit
	 * nor with themselves.
	 */
	additionalTextEdits?: ISingleEditOperation[];
	/**
	 * A command that should be run upon acceptance of this item.
	 */
	command?: Command;
	/**
	 * A command that should be run upon acceptance of this item.
	 */
	action?: Command;
	/**
	 * @internal
	 */
	extensionId?: ExtensionIdentifier;

	/**
	 * @internal
	 */
	_id?: [number, number];
}

export interface CompletionList {
	suggestions: CompletionItem[];
	incomplete?: boolean;
	dispose?(): void;

	/**
	 * @internal
	 */
	duration?: number;
}

/**
 * Info provided on partial acceptance.
 */
export interface PartialAcceptInfo {
	kind: PartialAcceptTriggerKind;
	acceptedLength: number;
}

/**
 * How a partial acceptance was triggered.
 */
export const enum PartialAcceptTriggerKind {
	Word = 0,
	Line = 1,
	Suggest = 2,
}

/**
 * How a suggest provider was triggered.
 */
export const enum CompletionTriggerKind {
	Invoke = 0,
	TriggerCharacter = 1,
	TriggerForIncompleteCompletions = 2
}
/**
 * Contains additional information about the context in which
 * {@link CompletionItemProvider.provideCompletionItems completion provider} is triggered.
 */
export interface CompletionContext {
	/**
	 * How the completion was triggered.
	 */
	triggerKind: CompletionTriggerKind;
	/**
	 * Character that triggered the completion item provider.
	 *
	 * `undefined` if provider was not triggered by a character.
	 */
	triggerCharacter?: string;
}
/**
 * The completion item provider interface defines the contract between extensions and
 * the [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense).
 *
 * When computing *complete* completion items is expensive, providers can optionally implement
 * the `resolveCompletionItem`-function. In that case it is enough to return completion
 * items with a {@link CompletionItem.label label} from the
 * {@link CompletionItemProvider.provideCompletionItems provideCompletionItems}-function. Subsequently,
 * when a completion item is shown in the UI and gains focus this provider is asked to resolve
 * the item, like adding {@link CompletionItem.documentation doc-comment} or {@link CompletionItem.detail details}.
 */
export interface CompletionItemProvider {

	/**
	 * Used to identify completions in the (debug) UI and telemetry. This isn't the extension identifier because extensions
	 * often contribute multiple completion item providers.
	 *
	 * @internal
	 */
	_debugDisplayName: string;

	triggerCharacters?: string[];
	/**
	 * Provide completion items for the given position and document.
	 */
	provideCompletionItems(model: model.ITextModel, position: Position, context: CompletionContext, token: CancellationToken): ProviderResult<CompletionList>;

	/**
	 * Given a completion item fill in more data, like {@link CompletionItem.documentation doc-comment}
	 * or {@link CompletionItem.detail details}.
	 *
	 * The editor will only resolve a completion item once.
	 */
	resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem>;
}

/**
 * How an {@link InlineCompletionsProvider inline completion provider} was triggered.
 */
export enum InlineCompletionTriggerKind {
	/**
	 * Completion was triggered automatically while editing.
	 * It is sufficient to return a single completion item in this case.
	 */
	Automatic = 0,

	/**
	 * Completion was triggered explicitly by a user gesture.
	 * Return multiple completion items to enable cycling through them.
	 */
	Explicit = 1,
}

export interface InlineCompletionContext {

	/**
	 * How the completion was triggered.
	 */
	readonly triggerKind: InlineCompletionTriggerKind;
	readonly selectedSuggestionInfo: SelectedSuggestionInfo | undefined;
	/**
	 * @experimental
	 * @internal
	*/
	readonly userPrompt?: string | undefined;
	/**
	 * @experimental
	 * @internal
	*/
	readonly requestUuid: string;

	readonly includeInlineEdits: boolean;
	readonly includeInlineCompletions: boolean;
	readonly requestIssuedDateTime: number;
	readonly earliestShownDateTime: number;
}

export interface IInlineCompletionModelInfo {
	models: IInlineCompletionModel[];
	currentModelId: string;
}

export interface IInlineCompletionModel {
	name: string;
	id: string;
}

export class SelectedSuggestionInfo {
	constructor(
		public readonly range: IRange,
		public readonly text: string,
		public readonly completionKind: CompletionItemKind,
		public readonly isSnippetText: boolean,
	) {
	}

	public equals(other: SelectedSuggestionInfo) {
		return Range.lift(this.range).equalsRange(other.range)
			&& this.text === other.text
			&& this.completionKind === other.completionKind
			&& this.isSnippetText === other.isSnippetText;
	}
}

export interface InlineCompletion {
	/**
	 * The text to insert.
	 * If the text contains a line break, the range must end at the end of a line.
	 * If existing text should be replaced, the existing text must be a prefix of the text to insert.
	 *
	 * The text can also be a snippet. In that case, a preview with default parameters is shown.
	 * When accepting the suggestion, the full snippet is inserted.
	*/
	readonly insertText: string | { snippet: string } | undefined;

	/**
	 * The range to replace.
	 * Must begin and end on the same line.
	 * Refers to the current document or `uri` if provided.
	*/
	readonly range?: IRange;

	/**
	 * An optional array of additional text edits that are applied when
	 * selecting this completion. Edits must not overlap with the main edit
	 * nor with themselves.
	 * Refers to the current document or `uri` if provided.
	 */
	readonly additionalTextEdits?: ISingleEditOperation[];

	/**
	 * The file for which the edit applies to.
	*/
	readonly uri?: UriComponents;

	/**
	 * A command that is run upon acceptance of this item.
	*/
	readonly command?: Command;

	readonly gutterMenuLinkAction?: Command;

	/**
	 * Is called the first time an inline completion is shown.
	 * @deprecated. Use `onDidShow` of the provider instead.
	*/
	readonly shownCommand?: Command;

	/**
	 * If set to `true`, unopened closing brackets are removed and unclosed opening brackets are closed.
	 * Defaults to `false`.
	*/
	readonly completeBracketPairs?: boolean;

	readonly isInlineEdit?: boolean;
	readonly showInlineEditMenu?: boolean;

	/** Only show the inline suggestion when the cursor is in the showRange. */
	readonly showRange?: IRange;

	readonly warning?: InlineCompletionWarning;

	readonly hint?: IInlineCompletionHint;

	readonly supportsRename?: boolean;

	/**
	 * Used for telemetry.
	 */
	readonly correlationId?: string | undefined;

	readonly jumpToPosition?: IPosition;

	readonly doNotLog?: boolean;
}

export interface InlineCompletionWarning {
	message: IMarkdownString | string;
	icon?: IconPath;
}

export enum InlineCompletionHintStyle {
	Code = 1,
	Label = 2
}

export interface IInlineCompletionHint {
	/** Refers to the current document. */
	range: IRange;
	style: InlineCompletionHintStyle;
	content: string;
}

// TODO: add `| URI | { light: URI; dark: URI }`.
export type IconPath = ThemeIcon;

export interface InlineCompletions<TItem extends InlineCompletion = InlineCompletion> {
	readonly items: readonly TItem[];
	/**
	 * A list of commands associated with the inline completions of this list.
	 */
	readonly commands?: InlineCompletionCommand[];

	readonly suppressSuggestions?: boolean | undefined;

	/**
	 * When set and the user types a suggestion without derivating from it, the inline suggestion is not updated.
	 */
	readonly enableForwardStability?: boolean | undefined;
}

export type InlineCompletionCommand = { command: Command; icon?: ThemeIcon };

export type InlineCompletionProviderGroupId = string;

export interface InlineCompletionsProvider<T extends InlineCompletions = InlineCompletions> {
	provideInlineCompletions(model: model.ITextModel, position: Position, context: InlineCompletionContext, token: CancellationToken): ProviderResult<T>;

	/**
	 * Will be called when an item is shown.
	 * @param updatedInsertText Is useful to understand bracket completion.
	*/
	handleItemDidShow?(completions: T, item: T['items'][number], updatedInsertText: string, editDeltaInfo: EditDeltaInfo): void;

	/**
	 * Will be called when an item is partially accepted. TODO: also handle full acceptance here!
	 * @param acceptedCharacters Deprecated. Use `info.acceptedCharacters` instead.
	 */
	handlePartialAccept?(completions: T, item: T['items'][number], acceptedCharacters: number, info: PartialAcceptInfo): void;

	/**
	 * @deprecated Use `handleEndOfLifetime` instead.
	*/
	handleRejection?(completions: T, item: T['items'][number]): void;

	/**
	 * Is called when an inline completion item is no longer being used.
	 * Provides a reason of why it is not used anymore.
	*/
	handleEndOfLifetime?(completions: T, item: T['items'][number], reason: InlineCompletionEndOfLifeReason<T['items'][number]>, lifetimeSummary: LifetimeSummary): void;

	/**
	 * Will be called when a completions list is no longer in use and can be garbage-collected.
	*/
	disposeInlineCompletions(completions: T, reason: InlineCompletionsDisposeReason): void;

	onDidChangeInlineCompletions?: Event<void>;

	/**
	 * Only used for {@link yieldsToGroupIds}.
	 * Multiple providers can have the same group id.
	 */
	groupId?: InlineCompletionProviderGroupId;

	/** @internal */
	providerId?: ProviderId;

	/**
	 * Returns a list of preferred provider {@link groupId}s.
	 * The current provider is only requested for completions if no provider with a preferred group id returned a result.
	 */
	yieldsToGroupIds?: InlineCompletionProviderGroupId[];

	excludesGroupIds?: InlineCompletionProviderGroupId[];

	displayName?: string;

	debounceDelayMs?: number;

	modelInfo?: IInlineCompletionModelInfo;
	onDidModelInfoChange?: Event<void>;
	setModelId?(modelId: string): Promise<void>;

	toString?(): string;
}


/** @internal */
export class ProviderId {
	public static fromExtensionId(extensionId: string | undefined): ProviderId {
		return new ProviderId(extensionId, undefined, undefined);
	}

	constructor(
		public readonly extensionId: string | undefined,
		public readonly extensionVersion: string | undefined,
		public readonly providerId: string | undefined
	) {
	}

	toString(): string {
		let result = '';
		if (this.extensionId) {
			result += this.extensionId;
		}
		if (this.extensionVersion) {
			result += `@${this.extensionVersion}`;
		}
		if (this.providerId) {
			result += `:${this.providerId}`;
		}
		if (result.length === 0) {
			result = 'unknown';
		}
		return result;
	}

	toStringWithoutVersion(): string {
		let result = '';
		if (this.extensionId) {
			result += this.extensionId;
		}
		if (this.providerId) {
			result += `:${this.providerId}`;
		}
		return result;
	}
}

/** @internal */
export class VersionedExtensionId {
	public static tryCreate(extensionId: string | undefined, version: string | undefined): VersionedExtensionId | undefined {
		if (!extensionId || !version) {
			return undefined;
		}
		return new VersionedExtensionId(extensionId, version);
	}

	constructor(
		public readonly extensionId: string,
		public readonly version: string,
	) { }

	toString(): string {
		return `${this.extensionId}@${this.version}`;
	}
}

export type InlineCompletionsDisposeReason = { kind: 'lostRace' | 'tokenCancellation' | 'other' | 'empty' | 'notTaken' };

export enum InlineCompletionEndOfLifeReasonKind {
	Accepted = 0,
	Rejected = 1,
	Ignored = 2,
}

export type InlineCompletionEndOfLifeReason<TInlineCompletion = InlineCompletion> = {
	kind: InlineCompletionEndOfLifeReasonKind.Accepted; // User did an explicit action to accept
	alternativeAction: boolean; // Whether the user performed an alternative action.
} | {
	kind: InlineCompletionEndOfLifeReasonKind.Rejected; // User did an explicit action to reject
} | {
	kind: InlineCompletionEndOfLifeReasonKind.Ignored;
	supersededBy?: TInlineCompletion;
	userTypingDisagreed: boolean;
};

export type LifetimeSummary = {
	requestUuid: string;
	correlationId: string | undefined;
	partiallyAccepted: number;
	partiallyAcceptedCountSinceOriginal: number;
	partiallyAcceptedRatioSinceOriginal: number;
	partiallyAcceptedCharactersSinceOriginal: number;
	shown: boolean;
	shownDuration: number;
	shownDurationUncollapsed: number;
	timeUntilShown: number | undefined;
	timeUntilActuallyShown: number | undefined;
	timeUntilProviderRequest: number;
	timeUntilProviderResponse: number;
	notShownReason: string | undefined;
	editorType: string;
	viewKind: string | undefined;
	preceeded: boolean;
	languageId: string;
	requestReason: string;
	performanceMarkers?: string;
	cursorColumnDistance?: number;
	cursorLineDistance?: number;
	lineCountOriginal?: number;
	lineCountModified?: number;
	characterCountOriginal?: number;
	characterCountModified?: number;
	disjointReplacements?: number;
	sameShapeReplacements?: boolean;
	typingInterval: number;
	typingIntervalCharacterCount: number;
	selectedSuggestionInfo: boolean;
	availableProviders: string;
	skuPlan: string | undefined;
	skuType: string | undefined;
	renameCreated: boolean | undefined;
	renameDuration: number | undefined;
	renameTimedOut: boolean | undefined;
	renameDroppedOtherEdits: number | undefined;
	renameDroppedRenameEdits: number | undefined;
	editKind: string | undefined;
	longDistanceHintVisible?: boolean;
	longDistanceHintDistance?: number;
};

export interface CodeAction {
	title: string;
	command?: Command;
	edit?: WorkspaceEdit;
	diagnostics?: IMarkerData[];
	kind?: string;
	isPreferred?: boolean;
	isAI?: boolean;
	disabled?: string;
	ranges?: IRange[];
}

export const enum CodeActionTriggerType {
	Invoke = 1,
	Auto = 2,
}

/**
 * @internal
 */
export interface CodeActionContext {
	only?: string;
	trigger: CodeActionTriggerType;
}

export interface CodeActionList extends IDisposable {
	readonly actions: ReadonlyArray<CodeAction>;
}

/**
 * The code action interface defines the contract between extensions and
 * the [light bulb](https://code.visualstudio.com/docs/editor/editingevolved#_code-action) feature.
 * @internal
 */
export interface CodeActionProvider {

	displayName?: string;

	extensionId?: string;

	/**
	 * Provide commands for the given document and range.
	 */
	provideCodeActions(model: model.ITextModel, range: Range | Selection, context: CodeActionContext, token: CancellationToken): ProviderResult<CodeActionList>;

	/**
	 * Given a code action fill in the edit. Will only invoked when missing.
	 */
	resolveCodeAction?(codeAction: CodeAction, token: CancellationToken): ProviderResult<CodeAction>;

	/**
	 * Optional list of CodeActionKinds that this provider returns.
	 */
	readonly providedCodeActionKinds?: ReadonlyArray<string>;

	readonly documentation?: ReadonlyArray<{ readonly kind: string; readonly command: Command }>;

	/**
	 * @internal
	 */
	_getAdditionalMenuItems?(context: CodeActionContext, actions: readonly CodeAction[]): Command[];
}

/**
 * @internal
 */
export interface DocumentPasteEdit {
	readonly title: string;
	readonly kind: HierarchicalKind;
	readonly handledMimeType?: string;
	yieldTo?: readonly DropYieldTo[];
	insertText: string | { readonly snippet: string };
	additionalEdit?: WorkspaceEdit;
}

/**
 * @internal
 */
export enum DocumentPasteTriggerKind {
	Automatic = 0,
	PasteAs = 1,
}

/**
 * @internal
 */
export interface DocumentPasteContext {
	readonly only?: HierarchicalKind;
	readonly triggerKind: DocumentPasteTriggerKind;
}

/**
 * @internal
 */
export interface DocumentPasteEditsSession {
	edits: readonly DocumentPasteEdit[];
	dispose(): void;
}

/**
 * @internal
 */
export interface DocumentPasteEditProvider {
	readonly id?: string;
	readonly copyMimeTypes: readonly string[];
	readonly pasteMimeTypes: readonly string[];
	readonly providedPasteEditKinds: readonly HierarchicalKind[];

	prepareDocumentPaste?(model: model.ITextModel, ranges: readonly IRange[], dataTransfer: IReadonlyVSDataTransfer, token: CancellationToken): Promise<undefined | IReadonlyVSDataTransfer>;

	provideDocumentPasteEdits?(model: model.ITextModel, ranges: readonly IRange[], dataTransfer: IReadonlyVSDataTransfer, context: DocumentPasteContext, token: CancellationToken): Promise<DocumentPasteEditsSession | undefined>;

	resolveDocumentPasteEdit?(edit: DocumentPasteEdit, token: CancellationToken): Promise<DocumentPasteEdit>;
}

/**
 * Represents a parameter of a callable-signature. A parameter can
 * have a label and a doc-comment.
 */
export interface ParameterInformation {
	/**
	 * The label of this signature. Will be shown in
	 * the UI.
	 */
	label: string | [number, number];
	/**
	 * The human-readable doc-comment of this signature. Will be shown
	 * in the UI but can be omitted.
	 */
	documentation?: string | IMarkdownString;
}
/**
 * Represents the signature of something callable. A signature
 * can have a label, like a function-name, a doc-comment, and
 * a set of parameters.
 */
export interface SignatureInformation {
	/**
	 * The label of this signature. Will be shown in
	 * the UI.
	 */
	label: string;
	/**
	 * The human-readable doc-comment of this signature. Will be shown
	 * in the UI but can be omitted.
	 */
	documentation?: string | IMarkdownString;
	/**
	 * The parameters of this signature.
	 */
	parameters: ParameterInformation[];
	/**
	 * Index of the active parameter.
	 *
	 * If provided, this is used in place of `SignatureHelp.activeSignature`.
	 */
	activeParameter?: number;
}
/**
 * Signature help represents the signature of something
 * callable. There can be multiple signatures but only one
 * active and only one active parameter.
 */
export interface SignatureHelp {
	/**
	 * One or more signatures.
	 */
	signatures: SignatureInformation[];
	/**
	 * The active signature.
	 */
	activeSignature: number;
	/**
	 * The active parameter of the active signature.
	 */
	activeParameter: number;
}

export interface SignatureHelpResult extends IDisposable {
	value: SignatureHelp;
}

export enum SignatureHelpTriggerKind {
	Invoke = 1,
	TriggerCharacter = 2,
	ContentChange = 3,
}

export interface SignatureHelpContext {
	readonly triggerKind: SignatureHelpTriggerKind;
	readonly triggerCharacter?: string;
	readonly isRetrigger: boolean;
	readonly activeSignatureHelp?: SignatureHelp;
}

/**
 * The signature help provider interface defines the contract between extensions and
 * the [parameter hints](https://code.visualstudio.com/docs/editor/intellisense)-feature.
 */
export interface SignatureHelpProvider {

	readonly signatureHelpTriggerCharacters?: ReadonlyArray<string>;
	readonly signatureHelpRetriggerCharacters?: ReadonlyArray<string>;

	/**
	 * Provide help for the signature at the given position and document.
	 */
	provideSignatureHelp(model: model.ITextModel, position: Position, token: CancellationToken, context: SignatureHelpContext): ProviderResult<SignatureHelpResult>;
}

/**
 * A document highlight kind.
 */
export enum DocumentHighlightKind {
	/**
	 * A textual occurrence.
	 */
	Text,
	/**
	 * Read-access of a symbol, like reading a variable.
	 */
	Read,
	/**
	 * Write-access of a symbol, like writing to a variable.
	 */
	Write
}
/**
 * A document highlight is a range inside a text document which deserves
 * special attention. Usually a document highlight is visualized by changing
 * the background color of its range.
 */
export interface DocumentHighlight {
	/**
	 * The range this highlight applies to.
	 */
	range: IRange;
	/**
	 * The highlight kind, default is {@link DocumentHighlightKind.Text text}.
	 */
	kind?: DocumentHighlightKind;
}

/**
 * Represents a set of document highlights for a specific URI.
 */
export interface MultiDocumentHighlight {
	/**
	 * The URI of the document that the highlights belong to.
	 */
	uri: URI;

	/**
	 * The set of highlights for the document.
	 */
	highlights: DocumentHighlight[];
}

/**
 * The document highlight provider interface defines the contract between extensions and
 * the word-highlight-feature.
 */
export interface DocumentHighlightProvider {
	/**
	 * Provide a set of document highlights, like all occurrences of a variable or
	 * all exit-points of a function.
	 */
	provideDocumentHighlights(model: model.ITextModel, position: Position, token: CancellationToken): ProviderResult<DocumentHighlight[]>;
}

/**
 * A provider that can provide document highlights across multiple documents.
 */
export interface MultiDocumentHighlightProvider {
	readonly selector: LanguageSelector;

	/**
	 * Provide a Map of URI --> document highlights, like all occurrences of a variable or
	 * all exit-points of a function.
	 *
	 * Used in cases such as split view, notebooks, etc. where there can be multiple documents
	 * with shared symbols.
	 *
	 * @param primaryModel The primary text model.
	 * @param position The position at which to provide document highlights.
	 * @param otherModels The other text models to search for document highlights.
	 * @param token A cancellation token.
	 * @returns A map of URI to document highlights.
	 */
	provideMultiDocumentHighlights(primaryModel: model.ITextModel, position: Position, otherModels: model.ITextModel[], token: CancellationToken): ProviderResult<Map<URI, DocumentHighlight[]>>;
}

/**
 * The linked editing range provider interface defines the contract between extensions and
 * the linked editing feature.
 */
export interface LinkedEditingRangeProvider {

	/**
	 * Provide a list of ranges that can be edited together.
	 */
	provideLinkedEditingRanges(model: model.ITextModel, position: Position, token: CancellationToken): ProviderResult<LinkedEditingRanges>;
}

/**
 * Represents a list of ranges that can be edited together along with a word pattern to describe valid contents.
 */
export interface LinkedEditingRanges {
	/**
	 * A list of ranges that can be edited together. The ranges must have
	 * identical length and text content. The ranges cannot overlap
	 */
	ranges: IRange[];

	/**
	 * An optional word pattern that describes valid contents for the given ranges.
	 * If no pattern is provided, the language configuration's word pattern will be used.
	 */
	wordPattern?: RegExp;
}

/**
 * Value-object that contains additional information when
 * requesting references.
 */
export interface ReferenceContext {
	/**
	 * Include the declaration of the current symbol.
	 */
	includeDeclaration: boolean;
}
/**
 * The reference provider interface defines the contract between extensions and
 * the [find references](https://code.visualstudio.com/docs/editor/editingevolved#_peek)-feature.
 */
export interface ReferenceProvider {
	/**
	 * Provide a set of project-wide references for the given position and document.
	 */
	provideReferences(model: model.ITextModel, position: Position, context: ReferenceContext, token: CancellationToken): ProviderResult<Location[]>;
}

/**
 * Represents a location inside a resource, such as a line
 * inside a text file.
 */
export interface Location {
	/**
	 * The resource identifier of this location.
	 */
	uri: URI;
	/**
	 * The document range of this locations.
	 */
	range: IRange;
}

export interface LocationLink {
	/**
	 * A range to select where this link originates from.
	 */
	originSelectionRange?: IRange;

	/**
	 * The target uri this link points to.
	 */
	uri: URI;

	/**
	 * The full range this link points to.
	 */
	range: IRange;

	/**
	 * A range to select this link points to. Must be contained
	 * in `LocationLink.range`.
	 */
	targetSelectionRange?: IRange;
}

/**
 * @internal
 */
export function isLocationLink(thing: unknown): thing is LocationLink {
	return !!thing
		&& URI.isUri((thing as LocationLink).uri)
		&& Range.isIRange((thing as LocationLink).range)
		&& (Range.isIRange((thing as LocationLink).originSelectionRange) || Range.isIRange((thing as LocationLink).targetSelectionRange));
}

/**
 * @internal
 */
export function isLocation(thing: unknown): thing is Location {
	return !!thing
		&& URI.isUri((thing as Location).uri)
		&& Range.isIRange((thing as Location).range);
}


export type Definition = Location | Location[] | LocationLink[];

/**
 * The definition provider interface defines the contract between extensions and
 * the [go to definition](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)
 * and peek definition features.
 */
export interface DefinitionProvider {
	/**
	 * Provide the definition of the symbol at the given position and document.
	 */
	provideDefinition(model: model.ITextModel, position: Position, token: CancellationToken): ProviderResult<Definition | LocationLink[]>;
}

/**
 * The definition provider interface defines the contract between extensions and
 * the [go to definition](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)
 * and peek definition features.
 */
export interface DeclarationProvider {
	/**
	 * Provide the declaration of the symbol at the given position and document.
	 */
	provideDeclaration(model: model.ITextModel, position: Position, token: CancellationToken): ProviderResult<Definition | LocationLink[]>;
}

/**
 * The implementation provider interface defines the contract between extensions and
 * the go to implementation feature.
 */
export interface ImplementationProvider {
	/**
	 * Provide the implementation of the symbol at the given position and document.
	 */
	provideImplementation(model: model.ITextModel, position: Position, token: CancellationToken): ProviderResult<Definition | LocationLink[]>;
}

/**
 * The type definition provider interface defines the contract between extensions and
 * the go to type definition feature.
 */
export interface TypeDefinitionProvider {
	/**
	 * Provide the type definition of the symbol at the given position and document.
	 */
	provideTypeDefinition(model: model.ITextModel, position: Position, token: CancellationToken): ProviderResult<Definition | LocationLink[]>;
}

/**
 * A symbol kind.
 */
export const enum SymbolKind {
	File = 0,
	Module = 1,
	Namespace = 2,
	Package = 3,
	Class = 4,
	Method = 5,
	Property = 6,
	Field = 7,
	Constructor = 8,
	Enum = 9,
	Interface = 10,
	Function = 11,
	Variable = 12,
	Constant = 13,
	String = 14,
	Number = 15,
	Boolean = 16,
	Array = 17,
	Object = 18,
	Key = 19,
	Null = 20,
	EnumMember = 21,
	Struct = 22,
	Event = 23,
	Operator = 24,
	TypeParameter = 25
}

/**
 * @internal
 */
export const symbolKindNames: { [symbol: number]: string } = {
	[SymbolKind.Array]: localize('Array', "array"),
	[SymbolKind.Boolean]: localize('Boolean', "boolean"),
	[SymbolKind.Class]: localize('Class', "class"),
	[SymbolKind.Constant]: localize('Constant', "constant"),
	[SymbolKind.Constructor]: localize('Constructor', "constructor"),
	[SymbolKind.Enum]: localize('Enum', "enumeration"),
	[SymbolKind.EnumMember]: localize('EnumMember', "enumeration member"),
	[SymbolKind.Event]: localize('Event', "event"),
	[SymbolKind.Field]: localize('Field', "field"),
	[SymbolKind.File]: localize('File', "file"),
	[SymbolKind.Function]: localize('Function', "function"),
	[SymbolKind.Interface]: localize('Interface', "interface"),
	[SymbolKind.Key]: localize('Key', "key"),
	[SymbolKind.Method]: localize('Method', "method"),
	[SymbolKind.Module]: localize('Module', "module"),
	[SymbolKind.Namespace]: localize('Namespace', "namespace"),
	[SymbolKind.Null]: localize('Null', "null"),
	[SymbolKind.Number]: localize('Number', "number"),
	[SymbolKind.Object]: localize('Object', "object"),
	[SymbolKind.Operator]: localize('Operator', "operator"),
	[SymbolKind.Package]: localize('Package', "package"),
	[SymbolKind.Property]: localize('Property', "property"),
	[SymbolKind.String]: localize('String', "string"),
	[SymbolKind.Struct]: localize('Struct', "struct"),
	[SymbolKind.TypeParameter]: localize('TypeParameter', "type parameter"),
	[SymbolKind.Variable]: localize('Variable', "variable"),
};

/**
 * @internal
 */
export function getAriaLabelForSymbol(symbolName: string, kind: SymbolKind): string {
	return localize('symbolAriaLabel', '{0} ({1})', symbolName, symbolKindNames[kind]);
}

export const enum SymbolTag {
	Deprecated = 1,
}

/**
 * @internal
 */
export namespace SymbolKinds {

	const byKind = new Map<SymbolKind, ThemeIcon>();
	byKind.set(SymbolKind.File, Codicon.symbolFile);
	byKind.set(SymbolKind.Module, Codicon.symbolModule);
	byKind.set(SymbolKind.Namespace, Codicon.symbolNamespace);
	byKind.set(SymbolKind.Package, Codicon.symbolPackage);
	byKind.set(SymbolKind.Class, Codicon.symbolClass);
	byKind.set(SymbolKind.Method, Codicon.symbolMethod);
	byKind.set(SymbolKind.Property, Codicon.symbolProperty);
	byKind.set(SymbolKind.Field, Codicon.symbolField);
	byKind.set(SymbolKind.Constructor, Codicon.symbolConstructor);
	byKind.set(SymbolKind.Enum, Codicon.symbolEnum);
	byKind.set(SymbolKind.Interface, Codicon.symbolInterface);
	byKind.set(SymbolKind.Function, Codicon.symbolFunction);
	byKind.set(SymbolKind.Variable, Codicon.symbolVariable);
	byKind.set(SymbolKind.Constant, Codicon.symbolConstant);
	byKind.set(SymbolKind.String, Codicon.symbolString);
	byKind.set(SymbolKind.Number, Codicon.symbolNumber);
	byKind.set(SymbolKind.Boolean, Codicon.symbolBoolean);
	byKind.set(SymbolKind.Array, Codicon.symbolArray);
	byKind.set(SymbolKind.Object, Codicon.symbolObject);
	byKind.set(SymbolKind.Key, Codicon.symbolKey);
	byKind.set(SymbolKind.Null, Codicon.symbolNull);
	byKind.set(SymbolKind.EnumMember, Codicon.symbolEnumMember);
	byKind.set(SymbolKind.Struct, Codicon.symbolStruct);
	byKind.set(SymbolKind.Event, Codicon.symbolEvent);
	byKind.set(SymbolKind.Operator, Codicon.symbolOperator);
	byKind.set(SymbolKind.TypeParameter, Codicon.symbolTypeParameter);
	/**
	 * @internal
	 */
	export function toIcon(kind: SymbolKind): ThemeIcon {
		let icon = byKind.get(kind);
		if (!icon) {
			console.info('No codicon found for SymbolKind ' + kind);
			icon = Codicon.symbolProperty;
		}
		return icon;
	}

	const byCompletionKind = new Map<SymbolKind, CompletionItemKind>();
	byCompletionKind.set(SymbolKind.File, CompletionItemKind.File);
	byCompletionKind.set(SymbolKind.Module, CompletionItemKind.Module);
	byCompletionKind.set(SymbolKind.Namespace, CompletionItemKind.Module);
	byCompletionKind.set(SymbolKind.Package, CompletionItemKind.Module);
	byCompletionKind.set(SymbolKind.Class, CompletionItemKind.Class);
	byCompletionKind.set(SymbolKind.Method, CompletionItemKind.Method);
	byCompletionKind.set(SymbolKind.Property, CompletionItemKind.Property);
	byCompletionKind.set(SymbolKind.Field, CompletionItemKind.Field);
	byCompletionKind.set(SymbolKind.Constructor, CompletionItemKind.Constructor);
	byCompletionKind.set(SymbolKind.Enum, CompletionItemKind.Enum);
	byCompletionKind.set(SymbolKind.Interface, CompletionItemKind.Interface);
	byCompletionKind.set(SymbolKind.Function, CompletionItemKind.Function);
	byCompletionKind.set(SymbolKind.Variable, CompletionItemKind.Variable);
	byCompletionKind.set(SymbolKind.Constant, CompletionItemKind.Constant);
	byCompletionKind.set(SymbolKind.String, CompletionItemKind.Text);
	byCompletionKind.set(SymbolKind.Number, CompletionItemKind.Value);
	byCompletionKind.set(SymbolKind.Boolean, CompletionItemKind.Value);
	byCompletionKind.set(SymbolKind.Array, CompletionItemKind.Value);
	byCompletionKind.set(SymbolKind.Object, CompletionItemKind.Value);
	byCompletionKind.set(SymbolKind.Key, CompletionItemKind.Keyword);
	byCompletionKind.set(SymbolKind.Null, CompletionItemKind.Value);
	byCompletionKind.set(SymbolKind.EnumMember, CompletionItemKind.EnumMember);
	byCompletionKind.set(SymbolKind.Struct, CompletionItemKind.Struct);
	byCompletionKind.set(SymbolKind.Event, CompletionItemKind.Event);
	byCompletionKind.set(SymbolKind.Operator, CompletionItemKind.Operator);
	byCompletionKind.set(SymbolKind.TypeParameter, CompletionItemKind.TypeParameter);
	/**
	 * @internal
	 */
	export function toCompletionKind(kind: SymbolKind): CompletionItemKind {
		let completionKind = byCompletionKind.get(kind);
		if (completionKind === undefined) {
			console.info('No completion kind found for SymbolKind ' + kind);
			completionKind = CompletionItemKind.File;
		}
		return completionKind;
	}
}

export interface DocumentSymbol {
	name: string;
	detail: string;
	kind: SymbolKind;
	tags: ReadonlyArray<SymbolTag>;
	containerName?: string;
	range: IRange;
	selectionRange: IRange;
	children?: DocumentSymbol[];
}

/**
 * The document symbol provider interface defines the contract between extensions and
 * the [go to symbol](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-symbol)-feature.
 */
export interface DocumentSymbolProvider {

	displayName?: string;

	/**
	 * Provide symbol information for the given document.
	 */
	provideDocumentSymbols(model: model.ITextModel, token: CancellationToken): ProviderResult<DocumentSymbol[]>;
}

export interface TextEdit {
	range: IRange;
	text: string;
	eol?: model.EndOfLineSequence;
}

/** @internal */
export abstract class TextEdit {
	static asEditOperation(edit: TextEdit): ISingleEditOperation {
		const range = Range.lift(edit.range);
		return range.isEmpty()
			? EditOperation.insert(range.getStartPosition(), edit.text) // moves marker
			: EditOperation.replace(range, edit.text);
	}
	static isTextEdit(thing: unknown): thing is TextEdit {
		const possibleTextEdit = thing as TextEdit;
		return typeof possibleTextEdit.text === 'string' && Range.isIRange(possibleTextEdit.range);
	}
}

/**
 * Interface used to format a model
 */
export interface FormattingOptions {
	/**
	 * Size of a tab in spaces.
	 */
	tabSize: number;
	/**
	 * Prefer spaces over tabs.
	 */
	insertSpaces: boolean;
}
/**
 * The document formatting provider interface defines the contract between extensions and
 * the formatting-feature.
 */
export interface DocumentFormattingEditProvider {

	/**
	 * @internal
	 */
	readonly extensionId?: ExtensionIdentifier;

	readonly displayName?: string;

	/**
	 * Provide formatting edits for a whole document.
	 */
	provideDocumentFormattingEdits(model: model.ITextModel, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>;
}
/**
 * The document formatting provider interface defines the contract between extensions and
 * the formatting-feature.
 */
export interface DocumentRangeFormattingEditProvider {
	/**
	 * @internal
	 */
	readonly extensionId?: ExtensionIdentifier;

	readonly displayName?: string;

	/**
	 * Provide formatting edits for a range in a document.
	 *
	 * The given range is a hint and providers can decide to format a smaller
	 * or larger range. Often this is done by adjusting the start and end
	 * of the range to full syntax nodes.
	 */
	provideDocumentRangeFormattingEdits(model: model.ITextModel, range: Range, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>;

	provideDocumentRangesFormattingEdits?(model: model.ITextModel, ranges: Range[], options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>;
}
/**
 * The document formatting provider interface defines the contract between extensions and
 * the formatting-feature.
 */
export interface OnTypeFormattingEditProvider {


	/**
	 * @internal
	 */
	readonly extensionId?: ExtensionIdentifier;

	autoFormatTriggerCharacters: string[];

	/**
	 * Provide formatting edits after a character has been typed.
	 *
	 * The given position and character should hint to the provider
	 * what range the position to expand to, like find the matching `{`
	 * when `}` has been entered.
	 */
	provideOnTypeFormattingEdits(model: model.ITextModel, position: Position, ch: string, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]>;
}

/**
 * @internal
 */
export interface IInplaceReplaceSupportResult {
	value: string;
	range: IRange;
}

/**
 * A link inside the editor.
 */
export interface ILink {
	range: IRange;
	url?: URI | string;
	tooltip?: string;
}

export interface ILinksList {
	links: ILink[];
	dispose?(): void;
}
/**
 * A provider of links.
 */
export interface LinkProvider {
	provideLinks(model: model.ITextModel, token: CancellationToken): ProviderResult<ILinksList>;
	resolveLink?: (link: ILink, token: CancellationToken) => ProviderResult<ILink>;
}

/**
 * A color in RGBA format.
 */
export interface IColor {

	/**
	 * The red component in the range [0-1].
	 */
	readonly red: number;

	/**
	 * The green component in the range [0-1].
	 */
	readonly green: number;

	/**
	 * The blue component in the range [0-1].
	 */
	readonly blue: number;

	/**
	 * The alpha component in the range [0-1].
	 */
	readonly alpha: number;
}

/**
 * String representations for a color
 */
export interface IColorPresentation {
	/**
	 * The label of this color presentation. It will be shown on the color
	 * picker header. By default this is also the text that is inserted when selecting
	 * this color presentation.
	 */
	label: string;
	/**
	 * An {@link TextEdit edit} which is applied to a document when selecting
	 * this presentation for the color.
	 */
	textEdit?: TextEdit;
	/**
	 * An optional array of additional {@link TextEdit text edits} that are applied when
	 * selecting this color presentation.
	 */
	additionalTextEdits?: TextEdit[];
}

/**
 * A color range is a range in a text model which represents a color.
 */
export interface IColorInformation {

	/**
	 * The range within the model.
	 */
	range: IRange;

	/**
	 * The color represented in this range.
	 */
	color: IColor;
}

/**
 * A provider of colors for editor models.
 */
export interface DocumentColorProvider {
	/**
	 * Provides the color ranges for a specific model.
	 */
	provideDocumentColors(model: model.ITextModel, token: CancellationToken): ProviderResult<IColorInformation[]>;
	/**
	 * Provide the string representations for a color.
	 */
	provideColorPresentations(model: model.ITextModel, colorInfo: IColorInformation, token: CancellationToken): ProviderResult<IColorPresentation[]>;
}

export interface SelectionRange {
	range: IRange;
}

export interface SelectionRangeProvider {
	/**
	 * Provide ranges that should be selected from the given position.
	 */
	provideSelectionRanges(model: model.ITextModel, positions: Position[], token: CancellationToken): ProviderResult<SelectionRange[][]>;
}

export interface FoldingContext {
}
/**
 * A provider of folding ranges for editor models.
 */
export interface FoldingRangeProvider {

	/**
	 * @internal
	 */
	readonly id?: string;

	/**
	 * An optional event to signal that the folding ranges from this provider have changed.
	 */
	onDidChange?: Event<this>;

	/**
	 * Provides the folding ranges for a specific model.
	 */
	provideFoldingRanges(model: model.ITextModel, context: FoldingContext, token: CancellationToken): ProviderResult<FoldingRange[]>;
}

export interface FoldingRange {

	/**
	 * The one-based start line of the range to fold. The folded area starts after the line's last character.
	 */
	start: number;

	/**
	 * The one-based end line of the range to fold. The folded area ends with the line's last character.
	 */
	end: number;

	/**
	 * Describes the {@link FoldingRangeKind Kind} of the folding range such as {@link FoldingRangeKind.Comment Comment} or
	 * {@link FoldingRangeKind.Region Region}. The kind is used to categorize folding ranges and used by commands
	 * like 'Fold all comments'. See
	 * {@link FoldingRangeKind} for an enumeration of standardized kinds.
	 */
	kind?: FoldingRangeKind;
}
export class FoldingRangeKind {
	/**
	 * Kind for folding range representing a comment. The value of the kind is 'comment'.
	 */
	static readonly Comment = new FoldingRangeKind('comment');
	/**
	 * Kind for folding range representing a import. The value of the kind is 'imports'.
	 */
	static readonly Imports = new FoldingRangeKind('imports');
	/**
	 * Kind for folding range representing regions (for example marked by `#region`, `#endregion`).
	 * The value of the kind is 'region'.
	 */
	static readonly Region = new FoldingRangeKind('region');

	/**
	 * Returns a {@link FoldingRangeKind} for the given value.
	 *
	 * @param value of the kind.
	 */
	static fromValue(value: string) {
		switch (value) {
			case 'comment': return FoldingRangeKind.Comment;
			case 'imports': return FoldingRangeKind.Imports;
			case 'region': return FoldingRangeKind.Region;
		}
		return new FoldingRangeKind(value);
	}

	/**
	 * Creates a new {@link FoldingRangeKind}.
	 *
	 * @param value of the kind.
	 */
	public constructor(public value: string) {
	}
}


export interface WorkspaceEditMetadata {
	needsConfirmation: boolean;
	label: string;
	description?: string;
	/**
	 * @internal
	 */
	iconPath?: ThemeIcon | URI | { light: URI; dark: URI };
}

export interface WorkspaceFileEditOptions {
	overwrite?: boolean;
	ignoreIfNotExists?: boolean;
	ignoreIfExists?: boolean;
	recursive?: boolean;
	copy?: boolean;
	folder?: boolean;
	skipTrashBin?: boolean;
	maxSize?: number;

	/**
	 * @internal
	 */
	contents?: Promise<VSBuffer>;
}

export interface IWorkspaceFileEdit {
	oldResource?: URI;
	newResource?: URI;
	options?: WorkspaceFileEditOptions;
	metadata?: WorkspaceEditMetadata;
}

export interface IWorkspaceTextEdit {
	resource: URI;
	textEdit: TextEdit & { insertAsSnippet?: boolean; keepWhitespace?: boolean };
	versionId: number | undefined;
	metadata?: WorkspaceEditMetadata;
}

export interface WorkspaceEdit {
	edits: Array<IWorkspaceTextEdit | IWorkspaceFileEdit | ICustomEdit>;
}

export interface ICustomEdit {
	readonly resource: URI;
	readonly metadata?: WorkspaceEditMetadata;
	undo(): Promise<void> | void;
	redo(): Promise<void> | void;
}

export interface Rejection {
	rejectReason?: string;
}
export interface RenameLocation {
	range: IRange;
	text: string;
}

export interface RenameProvider {
	provideRenameEdits(model: model.ITextModel, position: Position, newName: string, token: CancellationToken): ProviderResult<WorkspaceEdit & Rejection>;
	resolveRenameLocation?(model: model.ITextModel, position: Position, token: CancellationToken): ProviderResult<RenameLocation & Rejection>;
}

export enum NewSymbolNameTag {
	AIGenerated = 1
}

export enum NewSymbolNameTriggerKind {
	Invoke = 0,
	Automatic = 1,
}

export interface NewSymbolName {
	readonly newSymbolName: string;
	readonly tags?: readonly NewSymbolNameTag[];
}

export interface NewSymbolNamesProvider {
	supportsAutomaticNewSymbolNamesTriggerKind?: Promise<boolean | undefined>;
	provideNewSymbolNames(model: model.ITextModel, range: IRange, triggerKind: NewSymbolNameTriggerKind, token: CancellationToken): ProviderResult<NewSymbolName[]>;
}

export interface Command {
	id: string;
	title: string;
	tooltip?: string;
	arguments?: unknown[];
}

/**
 * @internal
 */
export namespace Command {

	/**
	 * @internal
	 */
	export function is(obj: unknown): obj is Command {
		if (!obj || typeof obj !== 'object') {
			return false;
		}
		return typeof (<Command>obj).id === 'string' &&
			typeof (<Command>obj).title === 'string';
	}
}

/**
 * @internal
 */
export interface CommentThreadTemplate {
	controllerHandle: number;
	label: string;
	acceptInputCommand?: Command;
	additionalCommands?: Command[];
	deleteCommand?: Command;
}

/**
 * @internal
 */
export interface CommentInfo<T = IRange> {
	extensionId?: string;
	threads: CommentThread<T>[];
	pendingCommentThreads?: PendingCommentThread[];
	commentingRanges: CommentingRanges;
}


/**
 * @internal
 */
export interface CommentingRangeResourceHint {
	schemes: readonly string[];
}

/**
 * @internal
 */
export enum CommentThreadCollapsibleState {
	/**
	 * Determines an item is collapsed
	 */
	Collapsed = 0,
	/**
	 * Determines an item is expanded
	 */
	Expanded = 1
}

/**
 * @internal
 */
export enum CommentThreadState {
	Unresolved = 0,
	Resolved = 1
}

/**
 * @internal
 */
export enum CommentThreadApplicability {
	Current = 0,
	Outdated = 1
}

/**
 * @internal
 */
export interface CommentWidget {
	commentThread: CommentThread;
	comment?: Comment;
	input: string;
	readonly onDidChangeInput: Event<string>;
}

/**
 * @internal
 */
export interface CommentInput {
	value: string;
	uri: URI;
}

export interface CommentThreadRevealOptions {
	preserveFocus: boolean;
	focusReply: boolean;
}

/**
 * @internal
 */
export interface CommentThread<T = IRange> {
	isDocumentCommentThread(): this is CommentThread<IRange>;
	commentThreadHandle: number;
	controllerHandle: number;
	extensionId?: string;
	threadId: string;
	resource: string | null;
	range: T | undefined;
	label: string | undefined;
	contextValue: string | undefined;
	comments: ReadonlyArray<Comment> | undefined;
	readonly onDidChangeComments: Event<readonly Comment[] | undefined>;
	collapsibleState?: CommentThreadCollapsibleState;
	initialCollapsibleState?: CommentThreadCollapsibleState;
	readonly onDidChangeInitialCollapsibleState: Event<CommentThreadCollapsibleState | undefined>;
	state?: CommentThreadState;
	applicability?: CommentThreadApplicability;
	canReply: boolean | CommentAuthorInformation;
	input?: CommentInput;
	readonly onDidChangeInput: Event<CommentInput | undefined>;
	readonly onDidChangeLabel: Event<string | undefined>;
	readonly onDidChangeCollapsibleState: Event<CommentThreadCollapsibleState | undefined>;
	readonly onDidChangeState: Event<CommentThreadState | undefined>;
	readonly onDidChangeCanReply: Event<boolean>;
	isDisposed: boolean;
	isTemplate: boolean;
}

/**
 * @internal
 */
export interface AddedCommentThread<T = IRange> extends CommentThread<T> {
	editorId?: string;
}

/**
 * @internal
 */

export interface CommentingRanges {
	readonly resource: URI;
	ranges: IRange[];
	fileComments: boolean;
}

export interface CommentAuthorInformation {
	name: string;
	iconPath?: UriComponents;

}

/**
 * @internal
 */
export interface CommentReaction {
	readonly label?: string;
	readonly iconPath?: UriComponents;
	readonly count?: number;
	readonly hasReacted?: boolean;
	readonly canEdit?: boolean;
	readonly reactors?: readonly string[];
}

/**
 * @internal
 */
export interface CommentOptions {
	/**
	 * An optional string to show on the comment input box when it's collapsed.
	 */
	prompt?: string;

	/**
	 * An optional string to show as placeholder in the comment input box when it's focused.
	 */
	placeHolder?: string;
}

/**
 * @internal
 */
export enum CommentMode {
	Editing = 0,
	Preview = 1
}

/**
 * @internal
 */
export enum CommentState {
	Published = 0,
	Draft = 1
}

/**
 * @internal
 */
export interface Comment {
	readonly uniqueIdInThread: number;
	readonly body: string | IMarkdownString;
	readonly userName: string;
	readonly userIconPath?: UriComponents;
	readonly contextValue?: string;
	readonly commentReactions?: CommentReaction[];
	readonly label?: string;
	readonly mode?: CommentMode;
	readonly state?: CommentState;
	readonly timestamp?: string;
}

export interface PendingCommentThread {
	range: IRange | undefined;
	uri: URI;
	uniqueOwner: string;
	isReply: boolean;
	comment: PendingComment;
}

export interface PendingComment {
	body: string;
	cursor: IPosition;
}

/**
 * @internal
 */
export interface CommentThreadChangedEvent<T> {
	/**
	 * Pending comment threads.
	 */
	readonly pending: PendingCommentThread[];

	/**
	 * Added comment threads.
	 */
	readonly added: AddedCommentThread<T>[];

	/**
	 * Removed comment threads.
	 */
	readonly removed: CommentThread<T>[];

	/**
	 * Changed comment threads.
	 */
	readonly changed: CommentThread<T>[];
}

export interface CodeLens {
	range: IRange;
	id?: string;
	command?: Command;
}

export interface CodeLensList {
	readonly lenses: readonly CodeLens[];
	dispose?(): void;
}

export interface CodeLensProvider {
	onDidChange?: Event<this>;
	provideCodeLenses(model: model.ITextModel, token: CancellationToken): ProviderResult<CodeLensList>;
	resolveCodeLens?(model: model.ITextModel, codeLens: CodeLens, token: CancellationToken): ProviderResult<CodeLens>;
}


export enum InlayHintKind {
	Type = 1,
	Parameter = 2,
}

export interface InlayHintLabelPart {
	label: string;
	tooltip?: string | IMarkdownString;
	// collapsible?: boolean;
	command?: Command;
	location?: Location;
}

export interface InlayHint {
	label: string | InlayHintLabelPart[];
	tooltip?: string | IMarkdownString;
	textEdits?: TextEdit[];
	position: IPosition;
	kind?: InlayHintKind;
	paddingLeft?: boolean;
	paddingRight?: boolean;
}

export interface InlayHintList {
	hints: InlayHint[];
	dispose(): void;
}

export interface InlayHintsProvider {
	displayName?: string;
	onDidChangeInlayHints?: Event<void>;
	provideInlayHints(model: model.ITextModel, range: Range, token: CancellationToken): ProviderResult<InlayHintList>;
	resolveInlayHint?(hint: InlayHint, token: CancellationToken): ProviderResult<InlayHint>;
}

export interface SemanticTokensLegend {
	readonly tokenTypes: string[];
	readonly tokenModifiers: string[];
}

export interface SemanticTokens {
	readonly resultId?: string;
	readonly data: Uint32Array;
}

export interface SemanticTokensEdit {
	readonly start: number;
	readonly deleteCount: number;
	readonly data?: Uint32Array;
}

export interface SemanticTokensEdits {
	readonly resultId?: string;
	readonly edits: SemanticTokensEdit[];
}

export interface DocumentSemanticTokensProvider {
	readonly onDidChange?: Event<void>;
	getLegend(): SemanticTokensLegend;
	provideDocumentSemanticTokens(model: model.ITextModel, lastResultId: string | null, token: CancellationToken): ProviderResult<SemanticTokens | SemanticTokensEdits>;
	releaseDocumentSemanticTokens(resultId: string | undefined): void;
}

export interface DocumentRangeSemanticTokensProvider {
	readonly onDidChange?: Event<void>;
	getLegend(): SemanticTokensLegend;
	provideDocumentRangeSemanticTokens(model: model.ITextModel, range: Range, token: CancellationToken): ProviderResult<SemanticTokens>;
}

/**
 * @internal
 */
export interface ITokenizationSupportChangedEvent {
	changedLanguages: string[];
	changedColorMap: boolean;
}

/**
 * @internal
 */
export interface ILazyTokenizationSupport<TSupport> {
	get tokenizationSupport(): Promise<TSupport | null>;
}

/**
 * @internal
 */
export class LazyTokenizationSupport<TSupport = ITokenizationSupport> implements IDisposable, ILazyTokenizationSupport<TSupport> {
	private _tokenizationSupport: Promise<TSupport & IDisposable | null> | null = null;

	constructor(private readonly createSupport: () => Promise<TSupport & IDisposable | null>) {
	}

	dispose(): void {
		if (this._tokenizationSupport) {
			this._tokenizationSupport.then((support) => {
				if (support) {
					support.dispose();
				}
			});
		}
	}

	get tokenizationSupport(): Promise<TSupport | null> {
		if (!this._tokenizationSupport) {
			this._tokenizationSupport = this.createSupport();
		}
		return this._tokenizationSupport;
	}
}

/**
 * @internal
 */
export interface ITokenizationRegistry<TSupport> {

	/**
	 * An event triggered when:
	 *  - a tokenization support is registered, unregistered or changed.
	 *  - the color map is changed.
	 */
	readonly onDidChange: Event<ITokenizationSupportChangedEvent>;

	/**
	 * Fire a change event for a language.
	 * This is useful for languages that embed other languages.
	 */
	handleChange(languageIds: string[]): void;

	/**
	 * Register a tokenization support.
	 */
	register(languageId: string, support: TSupport): IDisposable;

	/**
	 * Register a tokenization support factory.
	 */
	registerFactory(languageId: string, factory: ILazyTokenizationSupport<TSupport>): IDisposable;

	/**
	 * Get or create the tokenization support for a language.
	 * Returns `null` if not found.
	 */
	getOrCreate(languageId: string): Promise<TSupport | null>;

	/**
	 * Get the tokenization support for a language.
	 * Returns `null` if not found.
	 */
	get(languageId: string): TSupport | null;

	/**
	 * Returns false if a factory is still pending.
	 */
	isResolved(languageId: string): boolean;

	/**
	 * Set the new color map that all tokens will use in their ColorId binary encoded bits for foreground and background.
	 */
	setColorMap(colorMap: Color[]): void;

	getColorMap(): Color[] | null;

	getDefaultBackground(): Color | null;
}

/**
 * @internal
 */
export const TokenizationRegistry: ITokenizationRegistry<ITokenizationSupport> = new TokenizationRegistryImpl();

/**
 * @internal
 */
export enum ExternalUriOpenerPriority {
	None = 0,
	Option = 1,
	Default = 2,
	Preferred = 3,
}

/**
 * @internal
 */
export type DropYieldTo = { readonly kind: HierarchicalKind } | { readonly mimeType: string };

/**
 * @internal
 */
export interface DocumentDropEdit {
	readonly title: string;
	readonly kind: HierarchicalKind | undefined;
	readonly handledMimeType?: string;
	readonly yieldTo?: readonly DropYieldTo[];
	insertText: string | { readonly snippet: string };
	additionalEdit?: WorkspaceEdit;
}

/**
 * @internal
 */
export interface DocumentDropEditsSession {
	edits: readonly DocumentDropEdit[];
	dispose(): void;
}

/**
 * @internal
 */
export interface DocumentDropEditProvider {
	readonly id?: string;
	readonly dropMimeTypes?: readonly string[];
	readonly providedDropEditKinds?: readonly HierarchicalKind[];

	provideDocumentDropEdits(model: model.ITextModel, position: IPosition, dataTransfer: IReadonlyVSDataTransfer, token: CancellationToken): ProviderResult<DocumentDropEditsSession>;
	resolveDocumentDropEdit?(edit: DocumentDropEdit, token: CancellationToken): Promise<DocumentDropEdit>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/languageSelector.ts]---
Location: vscode-main/src/vs/editor/common/languageSelector.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IRelativePattern, match as matchGlobPattern } from '../../base/common/glob.js';
import { URI } from '../../base/common/uri.js';
import { normalize } from '../../base/common/path.js';

export interface LanguageFilter {
	readonly language?: string;
	readonly scheme?: string;
	readonly pattern?: string | IRelativePattern;
	readonly notebookType?: string;
	/**
	 * This provider is implemented in the UI thread.
	 */
	readonly hasAccessToAllModels?: boolean;
	readonly exclusive?: boolean;

	/**
	 * This provider comes from a builtin extension.
	 */
	readonly isBuiltin?: boolean;
}

export type LanguageSelector = string | LanguageFilter | ReadonlyArray<string | LanguageFilter>;

export function score(selector: LanguageSelector | undefined, candidateUri: URI, candidateLanguage: string, candidateIsSynchronized: boolean, candidateNotebookUri: URI | undefined, candidateNotebookType: string | undefined): number {

	if (Array.isArray(selector)) {
		// array -> take max individual value
		let ret = 0;
		for (const filter of selector) {
			const value = score(filter, candidateUri, candidateLanguage, candidateIsSynchronized, candidateNotebookUri, candidateNotebookType);
			if (value === 10) {
				return value; // already at the highest
			}
			if (value > ret) {
				ret = value;
			}
		}
		return ret;

	} else if (typeof selector === 'string') {

		if (!candidateIsSynchronized) {
			return 0;
		}

		// short-hand notion, desugars to
		// 'fooLang' -> { language: 'fooLang'}
		// '*' -> { language: '*' }
		if (selector === '*') {
			return 5;
		} else if (selector === candidateLanguage) {
			return 10;
		} else {
			return 0;
		}

	} else if (selector) {
		// filter -> select accordingly, use defaults for scheme
		const { language, pattern, scheme, hasAccessToAllModels, notebookType } = selector as LanguageFilter; // TODO: microsoft/TypeScript#42768

		if (!candidateIsSynchronized && !hasAccessToAllModels) {
			return 0;
		}

		// selector targets a notebook -> use the notebook uri instead
		// of the "normal" document uri.
		if (notebookType && candidateNotebookUri) {
			candidateUri = candidateNotebookUri;
		}

		let ret = 0;

		if (scheme) {
			if (scheme === candidateUri.scheme) {
				ret = 10;
			} else if (scheme === '*') {
				ret = 5;
			} else {
				return 0;
			}
		}

		if (language) {
			if (language === candidateLanguage) {
				ret = 10;
			} else if (language === '*') {
				ret = Math.max(ret, 5);
			} else {
				return 0;
			}
		}

		if (notebookType) {
			if (notebookType === candidateNotebookType) {
				ret = 10;
			} else if (notebookType === '*' && candidateNotebookType !== undefined) {
				ret = Math.max(ret, 5);
			} else {
				return 0;
			}
		}

		if (pattern) {
			let normalizedPattern: string | IRelativePattern;
			if (typeof pattern === 'string') {
				normalizedPattern = pattern;
			} else {
				// Since this pattern has a `base` property, we need
				// to normalize this path first before passing it on
				// because we will compare it against `Uri.fsPath`
				// which uses platform specific separators.
				// Refs: https://github.com/microsoft/vscode/issues/99938
				normalizedPattern = { ...pattern, base: normalize(pattern.base) };
			}

			if (normalizedPattern === candidateUri.fsPath || matchGlobPattern(normalizedPattern, candidateUri.fsPath)) {
				ret = 10;
			} else {
				return 0;
			}
		}

		return ret;

	} else {
		return 0;
	}
}


export function targetsNotebooks(selector: LanguageSelector): boolean {
	if (typeof selector === 'string') {
		return false;
	} else if (Array.isArray(selector)) {
		return selector.some(targetsNotebooks);
	} else {
		return !!(<LanguageFilter>selector).notebookType;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/model.ts]---
Location: vscode-main/src/vs/editor/common/model.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../base/common/event.js';
import { IMarkdownString } from '../../base/common/htmlContent.js';
import { IDisposable } from '../../base/common/lifecycle.js';
import { equals } from '../../base/common/objects.js';
import { ThemeColor } from '../../base/common/themables.js';
import { URI } from '../../base/common/uri.js';
import { ISingleEditOperation } from './core/editOperation.js';
import { IPosition, Position } from './core/position.js';
import { IRange, Range } from './core/range.js';
import { Selection } from './core/selection.js';
import { TextChange } from './core/textChange.js';
import { WordCharacterClassifier } from './core/wordCharacterClassifier.js';
import { IWordAtPosition } from './core/wordHelper.js';
import { FormattingOptions } from './languages.js';
import { ILanguageSelection } from './languages/language.js';
import { IBracketPairsTextModelPart } from './textModelBracketPairs.js';
import { IModelContentChangedEvent, IModelDecorationsChangedEvent, IModelLanguageChangedEvent, IModelLanguageConfigurationChangedEvent, IModelOptionsChangedEvent, IModelTokensChangedEvent, InternalModelContentChangeEvent, ModelFontChangedEvent, ModelInjectedTextChangedEvent, ModelLineHeightChangedEvent } from './textModelEvents.js';
import { IModelContentChange } from './model/mirrorTextModel.js';
import { IGuidesTextModelPart } from './textModelGuides.js';
import { ITokenizationTextModelPart } from './tokenizationTextModelPart.js';
import { UndoRedoGroup } from '../../platform/undoRedo/common/undoRedo.js';
import { TokenArray } from './tokens/lineTokens.js';
import { IEditorModel } from './editorCommon.js';
import { TextModelEditSource } from './textModelEditSource.js';
import { TextEdit } from './core/edits/textEdit.js';

/**
 * Vertical Lane in the overview ruler of the editor.
 */
export enum OverviewRulerLane {
	Left = 1,
	Center = 2,
	Right = 4,
	Full = 7
}

/**
 * Vertical Lane in the glyph margin of the editor.
 */
export enum GlyphMarginLane {
	Left = 1,
	Center = 2,
	Right = 3,
}

export interface IGlyphMarginLanesModel {
	/**
	 * The number of lanes that should be rendered in the editor.
	 */
	readonly requiredLanes: number;

	/**
	 * Gets the lanes that should be rendered starting at a given line number.
	 */
	getLanesAtLine(lineNumber: number): GlyphMarginLane[];

	/**
	 * Resets the model and ensures it can contain at least `maxLine` lines.
	 */
	reset(maxLine: number): void;

	/**
	 * Registers that a lane should be visible at the Range in the model.
	 * @param persist - if true, notes that the lane should always be visible,
	 * even on lines where there's no specific request for that lane.
	 */
	push(lane: GlyphMarginLane, range: Range, persist?: boolean): void;
}

/**
 * Position in the minimap to render the decoration.
 */
export const enum MinimapPosition {
	Inline = 1,
	Gutter = 2
}

/**
 * Section header style.
 */
export const enum MinimapSectionHeaderStyle {
	Normal = 1,
	Underlined = 2
}

export interface IDecorationOptions {
	/**
	 * CSS color to render.
	 * e.g.: rgba(100, 100, 100, 0.5) or a color from the color registry
	 */
	color: string | ThemeColor | undefined;
	/**
	 * CSS color to render.
	 * e.g.: rgba(100, 100, 100, 0.5) or a color from the color registry
	 */
	darkColor?: string | ThemeColor;
}

export interface IModelDecorationGlyphMarginOptions {
	/**
	 * The position in the glyph margin.
	 */
	position: GlyphMarginLane;

	/**
	 * Whether the glyph margin lane in {@link position} should be rendered even
	 * outside of this decoration's range.
	 */
	persistLane?: boolean;
}

/**
 * Options for rendering a model decoration in the overview ruler.
 */
export interface IModelDecorationOverviewRulerOptions extends IDecorationOptions {
	/**
	 * The position in the overview ruler.
	 */
	position: OverviewRulerLane;
}

/**
 * Options for rendering a model decoration in the minimap.
 */
export interface IModelDecorationMinimapOptions extends IDecorationOptions {
	/**
	 * The position in the minimap.
	 */
	position: MinimapPosition;
	/**
	 * If the decoration is for a section header, which header style.
	 */
	sectionHeaderStyle?: MinimapSectionHeaderStyle | null;
	/**
	 * If the decoration is for a section header, the header text.
	 */
	sectionHeaderText?: string | null;
}

/**
 * Options for a model decoration.
 */
export interface IModelDecorationOptions {
	/**
	 * A debug description that can be used for inspecting model decorations.
	 * @internal
	 */
	description: string;
	/**
	 * Customize the growing behavior of the decoration when typing at the edges of the decoration.
	 * Defaults to TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
	 */
	stickiness?: TrackedRangeStickiness;
	/**
	 * CSS class name describing the decoration.
	 */
	className?: string | null;
	/**
	 * Indicates whether the decoration should span across the entire line when it continues onto the next line.
	 */
	shouldFillLineOnLineBreak?: boolean | null;
	blockClassName?: string | null;
	/**
	 * Indicates if this block should be rendered after the last line.
	 * In this case, the range must be empty and set to the last line.
	 */
	blockIsAfterEnd?: boolean | null;
	blockDoesNotCollapse?: boolean | null;
	blockPadding?: [top: number, right: number, bottom: number, left: number] | null;

	/**
	 * Message to be rendered when hovering over the glyph margin decoration.
	 */
	glyphMarginHoverMessage?: IMarkdownString | IMarkdownString[] | null;
	/**
	 * Array of MarkdownString to render as the decoration message.
	 */
	hoverMessage?: IMarkdownString | IMarkdownString[] | null;
	/**
	 * Array of MarkdownString to render as the line number message.
	 */
	lineNumberHoverMessage?: IMarkdownString | IMarkdownString[] | null;
	/**
	 * Should the decoration expand to encompass a whole line.
	 */
	isWholeLine?: boolean;
	/**
	 * Always render the decoration (even when the range it encompasses is collapsed).
	 */
	showIfCollapsed?: boolean;
	/**
	 * Collapse the decoration if its entire range is being replaced via an edit.
	 * @internal
	 */
	collapseOnReplaceEdit?: boolean;
	/**
	 * Specifies the stack order of a decoration.
	 * A decoration with greater stack order is always in front of a decoration with
	 * a lower stack order when the decorations are on the same line.
	 */
	zIndex?: number;
	/**
	 * If set, render this decoration in the overview ruler.
	 */
	overviewRuler?: IModelDecorationOverviewRulerOptions | null;
	/**
	 * If set, render this decoration in the minimap.
	 */
	minimap?: IModelDecorationMinimapOptions | null;
	/**
	 * If set, the decoration will be rendered in the glyph margin with this CSS class name.
	 */
	glyphMarginClassName?: string | null;
	/**
	 * If set and the decoration has {@link glyphMarginClassName} set, render this decoration
	 * with the specified {@link IModelDecorationGlyphMarginOptions} in the glyph margin.
	 */
	glyphMargin?: IModelDecorationGlyphMarginOptions | null;
	/**
	 * If set, the decoration will override the line height of the lines it spans. Maximum value is 300px.
	 */
	lineHeight?: number | null;
	/**
	 * Font family
	 */
	fontFamily?: string | null;
	/**
	 * Font size
	 */
	fontSize?: string | null;
	/**
	 * Font weight
	 */
	fontWeight?: string | null;
	/**
	 * Font style
	 */
	fontStyle?: string | null;
	/**
	 * If set, the decoration will be rendered in the lines decorations with this CSS class name.
	 */
	linesDecorationsClassName?: string | null;
	/**
	 * Controls the tooltip text of the line decoration.
	 */
	linesDecorationsTooltip?: string | null;
	/**
	 * If set, the decoration will be rendered on the line number.
	 */
	lineNumberClassName?: string | null;
	/**
	 * If set, the decoration will be rendered in the lines decorations with this CSS class name, but only for the first line in case of line wrapping.
	 */
	firstLineDecorationClassName?: string | null;
	/**
	 * If set, the decoration will be rendered in the margin (covering its full width) with this CSS class name.
	 */
	marginClassName?: string | null;
	/**
	 * If set, the decoration will be rendered inline with the text with this CSS class name.
	 * Please use this only for CSS rules that must impact the text. For example, use `className`
	 * to have a background color decoration.
	 */
	inlineClassName?: string | null;
	/**
	 * If there is an `inlineClassName` which affects letter spacing.
	 */
	inlineClassNameAffectsLetterSpacing?: boolean;
	/**
	 * If set, the decoration will be rendered before the text with this CSS class name.
	 */
	beforeContentClassName?: string | null;
	/**
	 * If set, the decoration will be rendered after the text with this CSS class name.
	 */
	afterContentClassName?: string | null;
	/**
	 * If set, text will be injected in the view after the range.
	 */
	after?: InjectedTextOptions | null;

	/**
	 * If set, text will be injected in the view before the range.
	 */
	before?: InjectedTextOptions | null;

	/**
	 * If set, this decoration will not be rendered for comment tokens.
	 * @internal
	*/
	hideInCommentTokens?: boolean | null;

	/**
	 * If set, this decoration will not be rendered for string tokens.
	 * @internal
	*/
	hideInStringTokens?: boolean | null;

	/**
	 * Whether the decoration affects the font.
	 * @internal
	 */
	affectsFont?: boolean | null;

	/**
	 * The text direction of the decoration.
	 */
	textDirection?: TextDirection | null;
}

/**
 * Text Direction for a decoration.
 */
export enum TextDirection {
	LTR = 0,

	RTL = 1,
}

/**
 * Configures text that is injected into the view without changing the underlying document.
*/
export interface InjectedTextOptions {
	/**
	 * Sets the text to inject. Must be a single line.
	 */
	readonly content: string;

	/**
	 * @internal
	*/
	readonly tokens?: TokenArray | null;

	/**
	 * If set, the decoration will be rendered inline with the text with this CSS class name.
	 */
	readonly inlineClassName?: string | null;

	/**
	 * If there is an `inlineClassName` which affects letter spacing.
	 */
	readonly inlineClassNameAffectsLetterSpacing?: boolean;

	/**
	 * This field allows to attach data to this injected text.
	 * The data can be read when injected texts at a given position are queried.
	 */
	readonly attachedData?: unknown;

	/**
	 * Configures cursor stops around injected text.
	 * Defaults to {@link InjectedTextCursorStops.Both}.
	*/
	readonly cursorStops?: InjectedTextCursorStops | null;
}

export enum InjectedTextCursorStops {
	Both,
	Right,
	Left,
	None
}

/**
 * New model decorations.
 */
export interface IModelDeltaDecoration {
	/**
	 * Range that this decoration covers.
	 */
	range: IRange;
	/**
	 * Options associated with this decoration.
	 */
	options: IModelDecorationOptions;
}

/**
 * A decoration in the model.
 */
export interface IModelDecoration {
	/**
	 * Identifier for a decoration.
	 */
	readonly id: string;
	/**
	 * Identifier for a decoration's owner.
	 */
	readonly ownerId: number;
	/**
	 * Range that this decoration covers.
	 */
	readonly range: Range;
	/**
	 * Options associated with this decoration.
	 */
	readonly options: IModelDecorationOptions;
}

/**
 * An accessor that can add, change or remove model decorations.
 * @internal
 */
export interface IModelDecorationsChangeAccessor {
	/**
	 * Add a new decoration.
	 * @param range Range that this decoration covers.
	 * @param options Options associated with this decoration.
	 * @return An unique identifier associated with this decoration.
	 */
	addDecoration(range: IRange, options: IModelDecorationOptions): string;
	/**
	 * Change the range that an existing decoration covers.
	 * @param id The unique identifier associated with the decoration.
	 * @param newRange The new range that this decoration covers.
	 */
	changeDecoration(id: string, newRange: IRange): void;
	/**
	 * Change the options associated with an existing decoration.
	 * @param id The unique identifier associated with the decoration.
	 * @param newOptions The new options associated with this decoration.
	 */
	changeDecorationOptions(id: string, newOptions: IModelDecorationOptions): void;
	/**
	 * Remove an existing decoration.
	 * @param id The unique identifier associated with the decoration.
	 */
	removeDecoration(id: string): void;
	/**
	 * Perform a minimum amount of operations, in order to transform the decorations
	 * identified by `oldDecorations` to the decorations described by `newDecorations`
	 * and returns the new identifiers associated with the resulting decorations.
	 *
	 * @param oldDecorations Array containing previous decorations identifiers.
	 * @param newDecorations Array describing what decorations should result after the call.
	 * @return An array containing the new decorations identifiers.
	 */
	deltaDecorations(oldDecorations: readonly string[], newDecorations: readonly IModelDeltaDecoration[]): string[];
}

/**
 * End of line character preference.
 */
export const enum EndOfLinePreference {
	/**
	 * Use the end of line character identified in the text buffer.
	 */
	TextDefined = 0,
	/**
	 * Use line feed (\n) as the end of line character.
	 */
	LF = 1,
	/**
	 * Use carriage return and line feed (\r\n) as the end of line character.
	 */
	CRLF = 2
}

/**
 * The default end of line to use when instantiating models.
 */
export const enum DefaultEndOfLine {
	/**
	 * Use line feed (\n) as the end of line character.
	 */
	LF = 1,
	/**
	 * Use carriage return and line feed (\r\n) as the end of line character.
	 */
	CRLF = 2
}

/**
 * End of line character preference.
 */
export const enum EndOfLineSequence {
	/**
	 * Use line feed (\n) as the end of line character.
	 */
	LF = 0,
	/**
	 * Use carriage return and line feed (\r\n) as the end of line character.
	 */
	CRLF = 1
}

/**
 * An identifier for a single edit operation.
 * @internal
 */
export interface ISingleEditOperationIdentifier {
	/**
	 * Identifier major
	 */
	major: number;
	/**
	 * Identifier minor
	 */
	minor: number;
}

/**
 * A single edit operation, that has an identifier.
 */
export interface IIdentifiedSingleEditOperation extends ISingleEditOperation {
	/**
	 * An identifier associated with this single edit operation.
	 * @internal
	 */
	identifier?: ISingleEditOperationIdentifier | null;
	/**
	 * This indicates that this operation is inserting automatic whitespace
	 * that can be removed on next model edit operation if `config.trimAutoWhitespace` is true.
	 * @internal
	 */
	isAutoWhitespaceEdit?: boolean;
	/**
	 * This indicates that this operation is in a set of operations that are tracked and should not be "simplified".
	 * @internal
	 */
	_isTracked?: boolean;
}

export interface IValidEditOperation {
	/**
	 * An identifier associated with this single edit operation.
	 * @internal
	 */
	identifier: ISingleEditOperationIdentifier | null;
	/**
	 * The range to replace. This can be empty to emulate a simple insert.
	 */
	range: Range;
	/**
	 * The text to replace with. This can be empty to emulate a simple delete.
	 */
	text: string;
	/**
	 * @internal
	 */
	textChange: TextChange;
}

/**
 * A callback that can compute the cursor state after applying a series of edit operations.
 */
export interface ICursorStateComputer {
	/**
	 * A callback that can compute the resulting cursors state after some edit operations have been executed.
	 */
	(inverseEditOperations: IValidEditOperation[]): Selection[] | null;
}

export class TextModelResolvedOptions {
	_textModelResolvedOptionsBrand: void = undefined;

	readonly tabSize: number;
	readonly indentSize: number;
	private readonly _indentSizeIsTabSize: boolean;
	readonly insertSpaces: boolean;
	readonly defaultEOL: DefaultEndOfLine;
	readonly trimAutoWhitespace: boolean;
	readonly bracketPairColorizationOptions: BracketPairColorizationOptions;

	public get originalIndentSize(): number | 'tabSize' {
		return this._indentSizeIsTabSize ? 'tabSize' : this.indentSize;
	}

	/**
	 * @internal
	 */
	constructor(src: {
		tabSize: number;
		indentSize: number | 'tabSize';
		insertSpaces: boolean;
		defaultEOL: DefaultEndOfLine;
		trimAutoWhitespace: boolean;
		bracketPairColorizationOptions: BracketPairColorizationOptions;
	}) {
		this.tabSize = Math.max(1, src.tabSize | 0);
		if (src.indentSize === 'tabSize') {
			this.indentSize = this.tabSize;
			this._indentSizeIsTabSize = true;
		} else {
			this.indentSize = Math.max(1, src.indentSize | 0);
			this._indentSizeIsTabSize = false;
		}
		this.insertSpaces = Boolean(src.insertSpaces);
		this.defaultEOL = src.defaultEOL | 0;
		this.trimAutoWhitespace = Boolean(src.trimAutoWhitespace);
		this.bracketPairColorizationOptions = src.bracketPairColorizationOptions;
	}

	/**
	 * @internal
	 */
	public equals(other: TextModelResolvedOptions): boolean {
		return (
			this.tabSize === other.tabSize
			&& this._indentSizeIsTabSize === other._indentSizeIsTabSize
			&& this.indentSize === other.indentSize
			&& this.insertSpaces === other.insertSpaces
			&& this.defaultEOL === other.defaultEOL
			&& this.trimAutoWhitespace === other.trimAutoWhitespace
			&& equals(this.bracketPairColorizationOptions, other.bracketPairColorizationOptions)
		);
	}

	/**
	 * @internal
	 */
	public createChangeEvent(newOpts: TextModelResolvedOptions): IModelOptionsChangedEvent {
		return {
			tabSize: this.tabSize !== newOpts.tabSize,
			indentSize: this.indentSize !== newOpts.indentSize,
			insertSpaces: this.insertSpaces !== newOpts.insertSpaces,
			trimAutoWhitespace: this.trimAutoWhitespace !== newOpts.trimAutoWhitespace,
		};
	}
}

/**
 * @internal
 */
export interface ITextModelCreationOptions {
	tabSize: number;
	indentSize: number | 'tabSize';
	insertSpaces: boolean;
	detectIndentation: boolean;
	trimAutoWhitespace: boolean;
	defaultEOL: DefaultEndOfLine;
	isForSimpleWidget: boolean;
	largeFileOptimizations: boolean;
	bracketPairColorizationOptions: BracketPairColorizationOptions;
}

export interface BracketPairColorizationOptions {
	enabled: boolean;
	independentColorPoolPerBracketType: boolean;
}

export interface ITextModelUpdateOptions {
	tabSize?: number;
	indentSize?: number | 'tabSize';
	insertSpaces?: boolean;
	trimAutoWhitespace?: boolean;
	bracketColorizationOptions?: BracketPairColorizationOptions;
}

export class FindMatch {
	_findMatchBrand: void = undefined;

	public readonly range: Range;
	public readonly matches: string[] | null;

	/**
	 * @internal
	 */
	constructor(range: Range, matches: string[] | null) {
		this.range = range;
		this.matches = matches;
	}
}

/**
 * Describes the behavior of decorations when typing/editing near their edges.
 * Note: Please do not edit the values, as they very carefully match `DecorationRangeBehavior`
 */
export const enum TrackedRangeStickiness {
	AlwaysGrowsWhenTypingAtEdges = 0,
	NeverGrowsWhenTypingAtEdges = 1,
	GrowsOnlyWhenTypingBefore = 2,
	GrowsOnlyWhenTypingAfter = 3,
}

/**
 * Text snapshot that works like an iterator.
 * Will try to return chunks of roughly ~64KB size.
 * Will return null when finished.
 */
export interface ITextSnapshot {
	read(): string | null;
}

/**
 * @internal
 */
export function isITextSnapshot(obj: unknown): obj is ITextSnapshot {
	return (!!obj && typeof (obj as ITextSnapshot).read === 'function');
}

/**
 * A model.
 */
export interface ITextModel {

	/**
	 * Gets the resource associated with this editor model.
	 */
	readonly uri: URI;

	/**
	 * A unique identifier associated with this model.
	 */
	readonly id: string;

	/**
	 * This model is constructed for a simple widget code editor.
	 * @internal
	 */
	readonly isForSimpleWidget: boolean;

	/**
	 * If true, the text model might contain RTL.
	 * If false, the text model **contains only** contain LTR.
	 * @internal
	 */
	mightContainRTL(): boolean;

	/**
	 * If true, the text model might contain LINE SEPARATOR (LS), PARAGRAPH SEPARATOR (PS).
	 * If false, the text model definitely does not contain these.
	 * @internal
	 */
	mightContainUnusualLineTerminators(): boolean;

	/**
	 * @internal
	 */
	removeUnusualLineTerminators(selections?: Selection[]): void;

	/**
	 * If true, the text model might contain non basic ASCII.
	 * If false, the text model **contains only** basic ASCII.
	 * @internal
	 */
	mightContainNonBasicASCII(): boolean;

	/**
	 * Get the resolved options for this model.
	 */
	getOptions(): TextModelResolvedOptions;

	/**
	 * Get the formatting options for this model.
	 * @internal
	 */
	getFormattingOptions(): FormattingOptions;

	/**
	 * Get the current version id of the model.
	 * Anytime a change happens to the model (even undo/redo),
	 * the version id is incremented.
	 */
	getVersionId(): number;

	/**
	 * Get the alternative version id of the model.
	 * This alternative version id is not always incremented,
	 * it will return the same values in the case of undo-redo.
	 */
	getAlternativeVersionId(): number;

	/**
	 * Replace the entire text buffer value contained in this model.
	 */
	setValue(newValue: string | ITextSnapshot): void;

	/**
	 * Get the text stored in this model.
	 * @param eol The end of line character preference. Defaults to `EndOfLinePreference.TextDefined`.
	 * @param preserverBOM Preserve a BOM character if it was detected when the model was constructed.
	 * @return The text.
	 */
	getValue(eol?: EndOfLinePreference, preserveBOM?: boolean): string;

	/**
	 * Get the text stored in this model.
	 * @param preserverBOM Preserve a BOM character if it was detected when the model was constructed.
	 * @return The text snapshot (it is safe to consume it asynchronously).
	 */
	createSnapshot(preserveBOM?: boolean): ITextSnapshot;

	/**
	 * Get the length of the text stored in this model.
	 */
	getValueLength(eol?: EndOfLinePreference, preserveBOM?: boolean): number;

	/**
	 * Check if the raw text stored in this model equals another raw text.
	 * @internal
	 */
	equalsTextBuffer(other: ITextBuffer): boolean;

	/**
	 * Get the underling text buffer.
	 * @internal
	 */
	getTextBuffer(): ITextBuffer;

	/**
	 * Get the text in a certain range.
	 * @param range The range describing what text to get.
	 * @param eol The end of line character preference. This will only be used for multiline ranges. Defaults to `EndOfLinePreference.TextDefined`.
	 * @return The text.
	 */
	getValueInRange(range: IRange, eol?: EndOfLinePreference): string;

	/**
	 * Get the length of text in a certain range.
	 * @param range The range describing what text length to get.
	 * @return The text length.
	 */
	getValueLengthInRange(range: IRange, eol?: EndOfLinePreference): number;

	/**
	 * Get the character count of text in a certain range.
	 * @param range The range describing what text length to get.
	 */
	getCharacterCountInRange(range: IRange, eol?: EndOfLinePreference): number;

	/**
	 * Splits characters in two buckets. First bucket (A) is of characters that
	 * sit in lines with length < `LONG_LINE_BOUNDARY`. Second bucket (B) is of
	 * characters that sit in lines with length >= `LONG_LINE_BOUNDARY`.
	 * If count(B) > count(A) return true. Returns false otherwise.
	 * @internal
	 */
	isDominatedByLongLines(): boolean;

	/**
	 * Get the number of lines in the model.
	 */
	getLineCount(): number;

	/**
	 * Get the text for a certain line.
	 */
	getLineContent(lineNumber: number): string;

	/**
	 * Get the text length for a certain line.
	 */
	getLineLength(lineNumber: number): number;

	/**
	 * Get the text for all lines.
	 */
	getLinesContent(): string[];

	/**
	 * Get the end of line sequence predominantly used in the text buffer.
	 * @return EOL char sequence (e.g.: '\n' or '\r\n').
	 */
	getEOL(): string;

	/**
	 * Get the end of line sequence predominantly used in the text buffer.
	 */
	getEndOfLineSequence(): EndOfLineSequence;

	/**
	 * Get the minimum legal column for line at `lineNumber`
	 */
	getLineMinColumn(lineNumber: number): number;

	/**
	 * Get the maximum legal column for line at `lineNumber`
	 */
	getLineMaxColumn(lineNumber: number): number;

	/**
	 * Returns the column before the first non whitespace character for line at `lineNumber`.
	 * Returns 0 if line is empty or contains only whitespace.
	 */
	getLineFirstNonWhitespaceColumn(lineNumber: number): number;

	/**
	 * Returns the column after the last non whitespace character for line at `lineNumber`.
	 * Returns 0 if line is empty or contains only whitespace.
	 */
	getLineLastNonWhitespaceColumn(lineNumber: number): number;

	/**
	 * Create a valid position.
	 */
	validatePosition(position: IPosition): Position;

	/**
	 * Advances the given position by the given offset (negative offsets are also accepted)
	 * and returns it as a new valid position.
	 *
	 * If the offset and position are such that their combination goes beyond the beginning or
	 * end of the model, throws an exception.
	 *
	 * If the offset is such that the new position would be in the middle of a multi-byte
	 * line terminator, throws an exception.
	 */
	modifyPosition(position: IPosition, offset: number): Position;

	/**
	 * Create a valid range.
	 */
	validateRange(range: IRange): Range;

	/**
	 * Verifies the range is valid.
	 */
	isValidRange(range: IRange): boolean;

	/**
	 * Converts the position to a zero-based offset.
	 *
	 * The position will be [adjusted](#TextDocument.validatePosition).
	 *
	 * @param position A position.
	 * @return A valid zero-based offset.
	 */
	getOffsetAt(position: IPosition): number;

	/**
	 * Converts a zero-based offset to a position.
	 *
	 * @param offset A zero-based offset.
	 * @return A valid [position](#Position).
	 */
	getPositionAt(offset: number): Position;

	/**
	 * Get a range covering the entire model.
	 */
	getFullModelRange(): Range;

	/**
	 * Returns if the model was disposed or not.
	 */
	isDisposed(): boolean;

	/**
	 * This model is so large that it would not be a good idea to sync it over
	 * to web workers or other places.
	 * @internal
	 */
	isTooLargeForSyncing(): boolean;

	/**
	 * The file is so large, that even tokenization is disabled.
	 * @internal
	 */
	isTooLargeForTokenization(): boolean;

	/**
	 * The file is so large, that operations on it might be too large for heap
	 * and can lead to OOM crashes so they should be disabled.
	 * @internal
	 */
	isTooLargeForHeapOperation(): boolean;

	/**
	 * Search the model.
	 * @param searchString The string used to search. If it is a regular expression, set `isRegex` to true.
	 * @param searchOnlyEditableRange Limit the searching to only search inside the editable range of the model.
	 * @param isRegex Used to indicate that `searchString` is a regular expression.
	 * @param matchCase Force the matching to match lower/upper case exactly.
	 * @param wordSeparators Force the matching to match entire words only. Pass null otherwise.
	 * @param captureMatches The result will contain the captured groups.
	 * @param limitResultCount Limit the number of results
	 * @return The ranges where the matches are. It is empty if not matches have been found.
	 */
	findMatches(searchString: string, searchOnlyEditableRange: boolean, isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean, limitResultCount?: number): FindMatch[];
	/**
	 * Search the model.
	 * @param searchString The string used to search. If it is a regular expression, set `isRegex` to true.
	 * @param searchScope Limit the searching to only search inside these ranges.
	 * @param isRegex Used to indicate that `searchString` is a regular expression.
	 * @param matchCase Force the matching to match lower/upper case exactly.
	 * @param wordSeparators Force the matching to match entire words only. Pass null otherwise.
	 * @param captureMatches The result will contain the captured groups.
	 * @param limitResultCount Limit the number of results
	 * @return The ranges where the matches are. It is empty if no matches have been found.
	 */
	findMatches(searchString: string, searchScope: IRange | IRange[], isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean, limitResultCount?: number): FindMatch[];
	/**
	 * Search the model for the next match. Loops to the beginning of the model if needed.
	 * @param searchString The string used to search. If it is a regular expression, set `isRegex` to true.
	 * @param searchStart Start the searching at the specified position.
	 * @param isRegex Used to indicate that `searchString` is a regular expression.
	 * @param matchCase Force the matching to match lower/upper case exactly.
	 * @param wordSeparators Force the matching to match entire words only. Pass null otherwise.
	 * @param captureMatches The result will contain the captured groups.
	 * @return The range where the next match is. It is null if no next match has been found.
	 */
	findNextMatch(searchString: string, searchStart: IPosition, isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean): FindMatch | null;
	/**
	 * Search the model for the previous match. Loops to the end of the model if needed.
	 * @param searchString The string used to search. If it is a regular expression, set `isRegex` to true.
	 * @param searchStart Start the searching at the specified position.
	 * @param isRegex Used to indicate that `searchString` is a regular expression.
	 * @param matchCase Force the matching to match lower/upper case exactly.
	 * @param wordSeparators Force the matching to match entire words only. Pass null otherwise.
	 * @param captureMatches The result will contain the captured groups.
	 * @return The range where the previous match is. It is null if no previous match has been found.
	 */
	findPreviousMatch(searchString: string, searchStart: IPosition, isRegex: boolean, matchCase: boolean, wordSeparators: string | null, captureMatches: boolean): FindMatch | null;


	/**
	 * Get the language associated with this model.
	 */
	getLanguageId(): string;

	/**
	 * Set the current language mode associated with the model.
	 * @param languageId The new language.
	 * @param source The source of the call that set the language.
	 * @internal
	 */
	setLanguage(languageId: string, source?: string): void;

	/**
	 * Set the current language mode associated with the model.
	 * @param languageSelection The new language selection.
	 * @param source The source of the call that set the language.
	 * @internal
	 */
	setLanguage(languageSelection: ILanguageSelection, source?: string): void;

	/**
	 * Returns the real (inner-most) language mode at a given position.
	 * The result might be inaccurate. Use `forceTokenization` to ensure accurate tokens.
	 * @internal
	 */
	getLanguageIdAtPosition(lineNumber: number, column: number): string;

	/**
	 * Get the word under or besides `position`.
	 * @param position The position to look for a word.
	 * @return The word under or besides `position`. Might be null.
	 */
	getWordAtPosition(position: IPosition): IWordAtPosition | null;

	/**
	 * Get the word under or besides `position` trimmed to `position`.column
	 * @param position The position to look for a word.
	 * @return The word under or besides `position`. Will never be null.
	 */
	getWordUntilPosition(position: IPosition): IWordAtPosition;

	/**
	 * Change the decorations. The callback will be called with a change accessor
	 * that becomes invalid as soon as the callback finishes executing.
	 * This allows for all events to be queued up until the change
	 * is completed. Returns whatever the callback returns.
	 * @param ownerId Identifies the editor id in which these decorations should appear. If no `ownerId` is provided, the decorations will appear in all editors that attach this model.
	 * @internal
	 */
	changeDecorations<T>(callback: (changeAccessor: IModelDecorationsChangeAccessor) => T, ownerId?: number): T | null;

	/**
	 * Perform a minimum amount of operations, in order to transform the decorations
	 * identified by `oldDecorations` to the decorations described by `newDecorations`
	 * and returns the new identifiers associated with the resulting decorations.
	 *
	 * @param oldDecorations Array containing previous decorations identifiers.
	 * @param newDecorations Array describing what decorations should result after the call.
	 * @param ownerId Identifies the editor id in which these decorations should appear. If no `ownerId` is provided, the decorations will appear in all editors that attach this model.
	 * @return An array containing the new decorations identifiers.
	 */
	deltaDecorations(oldDecorations: string[], newDecorations: IModelDeltaDecoration[], ownerId?: number): string[];

	/**
	 * Remove all decorations that have been added with this specific ownerId.
	 * @param ownerId The owner id to search for.
	 * @internal
	 */
	removeAllDecorationsWithOwnerId(ownerId: number): void;

	/**
	 * Get the options associated with a decoration.
	 * @param id The decoration id.
	 * @return The decoration options or null if the decoration was not found.
	 */
	getDecorationOptions(id: string): IModelDecorationOptions | null;

	/**
	 * Get the range associated with a decoration.
	 * @param id The decoration id.
	 * @return The decoration range or null if the decoration was not found.
	 */
	getDecorationRange(id: string): Range | null;

	/**
	 * Gets all the decorations for the line `lineNumber` as an array.
	 * @param lineNumber The line number
	 * @param ownerId If set, it will ignore decorations belonging to other owners.
	 * @param filterOutValidation If set, it will ignore decorations specific to validation (i.e. warnings, errors).
	 * @param filterFontDecorations If set, it will ignore font decorations.
	 * @return An array with the decorations
	 */
	getLineDecorations(lineNumber: number, ownerId?: number, filterOutValidation?: boolean, filterFontDecorations?: boolean): IModelDecoration[];

	/**
	 * Gets all the font decorations for the line `lineNumber` as an array.
	 * @param ownerId If set, it will ignore decorations belonging to other owners.
	 * @internal
	 */
	getFontDecorationsInRange(range: IRange, ownerId?: number): IModelDecoration[];

	/**
	 * Gets all the decorations for the lines between `startLineNumber` and `endLineNumber` as an array.
	 * @param startLineNumber The start line number
	 * @param endLineNumber The end line number
	 * @param ownerId If set, it will ignore decorations belonging to other owners.
	 * @param filterOutValidation If set, it will ignore decorations specific to validation (i.e. warnings, errors).
	 * @param filterFontDecorations If set, it will ignore font decorations.
	 * @return An array with the decorations
	 */
	getLinesDecorations(startLineNumber: number, endLineNumber: number, ownerId?: number, filterOutValidation?: boolean, filterFontDecorations?: boolean): IModelDecoration[];

	/**
	 * Gets all the decorations in a range as an array. Only `startLineNumber` and `endLineNumber` from `range` are used for filtering.
	 * So for now it returns all the decorations on the same line as `range`.
	 * @param range The range to search in
	 * @param ownerId If set, it will ignore decorations belonging to other owners.
	 * @param filterOutValidation If set, it will ignore decorations specific to validation (i.e. warnings, errors).
	 * @param filterFontDecorations If set, it will ignore font decorations.
	 * @param onlyMinimapDecorations If set, it will return only decorations that render in the minimap.
	 * @param onlyMarginDecorations If set, it will return only decorations that render in the glyph margin.
	 * @return An array with the decorations
	 */
	getDecorationsInRange(range: IRange, ownerId?: number, filterOutValidation?: boolean, filterFontDecorations?: boolean, onlyMinimapDecorations?: boolean, onlyMarginDecorations?: boolean): IModelDecoration[];

	/**
	 * Gets all the decorations as an array.
	 * @param ownerId If set, it will ignore decorations belonging to other owners.
	 * @param filterOutValidation If set, it will ignore decorations specific to validation (i.e. warnings, errors).
	 * @param filterFontDecorations If set, it will ignore font decorations.
	 */
	getAllDecorations(ownerId?: number, filterOutValidation?: boolean, filterFontDecorations?: boolean): IModelDecoration[];

	/**
	 * Gets all decorations that render in the glyph margin as an array.
	 * @param ownerId If set, it will ignore decorations belonging to other owners.
	 */
	getAllMarginDecorations(ownerId?: number): IModelDecoration[];

	/**
	 * Gets all the decorations that should be rendered in the overview ruler as an array.
	 * @param ownerId If set, it will ignore decorations belonging to other owners.
	 * @param filterOutValidation If set, it will ignore decorations specific to validation (i.e. warnings, errors).
	 * @param filterFontDecorations If set, it will ignore font decorations.
	 */
	getOverviewRulerDecorations(ownerId?: number, filterOutValidation?: boolean, filterFontDecorations?: boolean): IModelDecoration[];

	/**
	 * Gets all the decorations that contain injected text.
	 * @param ownerId If set, it will ignore decorations belonging to other owners.
	 */
	getInjectedTextDecorations(ownerId?: number): IModelDecoration[];

	/**
	 * Gets all the decorations that contain custom line heights.
	 * @param ownerId If set, it will ignore decorations belonging to other owners.
	 */
	getCustomLineHeightsDecorations(ownerId?: number): IModelDecoration[];

	/**
	 * @internal
	 */
	_getTrackedRange(id: string): Range | null;

	/**
	 * @internal
	 */
	_setTrackedRange(id: string | null, newRange: null, newStickiness: TrackedRangeStickiness): null;
	/**
	 * @internal
	 */
	_setTrackedRange(id: string | null, newRange: Range, newStickiness: TrackedRangeStickiness): string;

	/**
	 * Normalize a string containing whitespace according to indentation rules (converts to spaces or to tabs).
	 */
	normalizeIndentation(str: string): string;

	/**
	 * Change the options of this model.
	 */
	updateOptions(newOpts: ITextModelUpdateOptions): void;

	/**
	 * Detect the indentation options for this model from its content.
	 */
	detectIndentation(defaultInsertSpaces: boolean, defaultTabSize: number): void;

	/**
	 * Close the current undo-redo element.
	 * This offers a way to create an undo/redo stop point.
	 */
	pushStackElement(): void;

	/**
	 * Open the current undo-redo element.
	 * This offers a way to remove the current undo/redo stop point.
	 */
	popStackElement(): void;

	/**
	 * @internal
	*/
	edit(edit: TextEdit, options?: { reason?: TextModelEditSource }): void;

	/**
	 * Push edit operations, basically editing the model. This is the preferred way
	 * of editing the model. The edit operations will land on the undo stack.
	 * @param beforeCursorState The cursor state before the edit operations. This cursor state will be returned when `undo` or `redo` are invoked.
	 * @param editOperations The edit operations.
	 * @param cursorStateComputer A callback that can compute the resulting cursors state after the edit operations have been executed.
	 * @return The cursor state returned by the `cursorStateComputer`.
	 */
	pushEditOperations(beforeCursorState: Selection[] | null, editOperations: IIdentifiedSingleEditOperation[], cursorStateComputer: ICursorStateComputer): Selection[] | null;
	/**
	 * @internal
	 */
	pushEditOperations(beforeCursorState: Selection[] | null, editOperations: IIdentifiedSingleEditOperation[], cursorStateComputer: ICursorStateComputer, group?: UndoRedoGroup, reason?: TextModelEditSource): Selection[] | null;

	/**
	 * Change the end of line sequence. This is the preferred way of
	 * changing the eol sequence. This will land on the undo stack.
	 */
	pushEOL(eol: EndOfLineSequence): void;

	/**
	 * Edit the model without adding the edits to the undo stack.
	 * This can have dire consequences on the undo stack! See @pushEditOperations for the preferred way.
	 * @param operations The edit operations.
	 * @return If desired, the inverse edit operations, that, when applied, will bring the model back to the previous state.
	 */
	applyEdits(operations: readonly IIdentifiedSingleEditOperation[]): void;
	/** @internal */
	applyEdits(operations: readonly IIdentifiedSingleEditOperation[], reason: TextModelEditSource): void;
	applyEdits(operations: readonly IIdentifiedSingleEditOperation[], computeUndoEdits: false): void;
	applyEdits(operations: readonly IIdentifiedSingleEditOperation[], computeUndoEdits: true): IValidEditOperation[];

	/**
	 * Change the end of line sequence without recording in the undo stack.
	 * This can have dire consequences on the undo stack! See @pushEOL for the preferred way.
	 */
	setEOL(eol: EndOfLineSequence): void;

	/**
	 * @internal
	 */
	_applyUndo(changes: TextChange[], eol: EndOfLineSequence, resultingAlternativeVersionId: number, resultingSelection: Selection[] | null): void;

	/**
	 * @internal
	 */
	_applyRedo(changes: TextChange[], eol: EndOfLineSequence, resultingAlternativeVersionId: number, resultingSelection: Selection[] | null): void;

	/**
	 * Undo edit operations until the previous undo/redo point.
	 * The inverse edit operations will be pushed on the redo stack.
	 */
	undo(): void | Promise<void>;

	/**
	 * Is there anything in the undo stack?
	 */
	canUndo(): boolean;

	/**
	 * Redo edit operations until the next undo/redo point.
	 * The inverse edit operations will be pushed on the undo stack.
	 */
	redo(): void | Promise<void>;

	/**
	 * Is there anything in the redo stack?
	 */
	canRedo(): boolean;

	/**
	 * @deprecated Please use `onDidChangeContent` instead.
	 * An event emitted when the contents of the model have changed.
	 * @internal
	 * @event
	 */
	readonly onDidChangeContentOrInjectedText: Event<InternalModelContentChangeEvent | ModelInjectedTextChangedEvent>;
	/**
	 * An event emitted when the contents of the model have changed.
	 * @event
	 */
	onDidChangeContent(listener: (e: IModelContentChangedEvent) => void): IDisposable;
	/**
	 * An event emitted when decorations of the model have changed.
	 * @event
	 */
	readonly onDidChangeDecorations: Event<IModelDecorationsChangedEvent>;
	/**
	 * An event emitted when line heights from decorations changes.
	 * This event is emitted only when adding, removing or changing a decoration
	 * and not when doing edits in the model (i.e. when decoration ranges change)
	 * @internal
	 * @event
	 */
	readonly onDidChangeLineHeight: Event<ModelLineHeightChangedEvent>;
	/**
	* An event emitted when the font from decorations changes.
	* This event is emitted only when adding, removing or changing a decoration
	* and not when doing edits in the model (i.e. when decoration ranges change)
	* @internal
	* @event
	*/
	readonly onDidChangeFont: Event<ModelFontChangedEvent>;
	/**
	 * An event emitted when the model options have changed.
	 * @event
	 */
	readonly onDidChangeOptions: Event<IModelOptionsChangedEvent>;
	/**
	 * An event emitted when the language associated with the model has changed.
	 * @event
	 */
	readonly onDidChangeLanguage: Event<IModelLanguageChangedEvent>;
	/**
	 * An event emitted when the language configuration associated with the model has changed.
	 * @event
	 */
	readonly onDidChangeLanguageConfiguration: Event<IModelLanguageConfigurationChangedEvent>;
	/**
	 * An event emitted when the tokens associated with the model have changed.
	 * @event
	 * @internal
	 */
	readonly onDidChangeTokens: Event<IModelTokensChangedEvent>;
	/**
	 * An event emitted when the model has been attached to the first editor or detached from the last editor.
	 * @event
	 */
	readonly onDidChangeAttached: Event<void>;
	/**
	 * An event emitted right before disposing the model.
	 * @event
	 */
	readonly onWillDispose: Event<void>;

	/**
	 * Destroy this model.
	 */
	dispose(): void;

	/**
	 * @internal
	 */
	onBeforeAttached(): IAttachedView;

	/**
	 * @internal
	 */
	onBeforeDetached(view: IAttachedView): void;

	/**
	 * Returns if this model is attached to an editor or not.
	 */
	isAttachedToEditor(): boolean;

	/**
	 * Returns the count of editors this model is attached to.
	 * @internal
	 */
	getAttachedEditorCount(): number;

	/**
	 * Among all positions that are projected to the same position in the underlying text model as
	 * the given position, select a unique position as indicated by the affinity.
	 *
	 * PositionAffinity.Left:
	 * The normalized position must be equal or left to the requested position.
	 *
	 * PositionAffinity.Right:
	 * The normalized position must be equal or right to the requested position.
	 *
	 * @internal
	 */
	normalizePosition(position: Position, affinity: PositionAffinity): Position;

	/**
	 * Gets the column at which indentation stops at a given line.
	 * @internal
	*/
	getLineIndentColumn(lineNumber: number): number;

	/**
	 * Returns an object that can be used to query brackets.
	 * @internal
	*/
	readonly bracketPairs: IBracketPairsTextModelPart;

	/**
	 * Returns an object that can be used to query indent guides.
	 * @internal
	*/
	readonly guides: IGuidesTextModelPart;

	/**
	 * @internal
	 */
	readonly tokenization: ITokenizationTextModelPart;
}

/**
 * @internal
 */
export function isITextModel(obj: IEditorModel): obj is ITextModel {
	return Boolean(obj && (obj as ITextModel).uri);
}

/**
 * @internal
 */
export interface IAttachedView {
	/**
	 * @param stabilized Indicates if the visible lines are probably going to change soon or can be considered stable.
	 * Is true on reveal range and false on scroll.
	 * Tokenizers should tokenize synchronously if stabilized is true.
	 */
	setVisibleLines(visibleLines: { startLineNumber: number; endLineNumber: number }[], stabilized: boolean): void;
}

export const enum PositionAffinity {
	/**
	 * Prefers the left most position.
	*/
	Left = 0,

	/**
	 * Prefers the right most position.
	*/
	Right = 1,

	/**
	 * No preference.
	*/
	None = 2,

	/**
	 * If the given position is on injected text, prefers the position left of it.
	*/
	LeftOfInjectedText = 3,

	/**
	 * If the given position is on injected text, prefers the position right of it.
	*/
	RightOfInjectedText = 4,
}

/**
 * @internal
 */
export interface ITextBufferBuilder {
	acceptChunk(chunk: string): void;
	finish(): ITextBufferFactory;
}

/**
 * @internal
 */
export interface ITextBufferFactory {
	create(defaultEOL: DefaultEndOfLine): { textBuffer: ITextBuffer; disposable: IDisposable };
	getFirstLineText(lengthLimit: number): string;
}

/**
 * @internal
 */
export const enum ModelConstants {
	FIRST_LINE_DETECTION_LENGTH_LIMIT = 1000
}

/**
 * @internal
 */
export class ValidAnnotatedEditOperation implements IIdentifiedSingleEditOperation {
	constructor(
		public readonly identifier: ISingleEditOperationIdentifier | null,
		public readonly range: Range,
		public readonly text: string | null,
		public readonly forceMoveMarkers: boolean,
		public readonly isAutoWhitespaceEdit: boolean,
		public readonly _isTracked: boolean,
	) { }
}

/**
 * @internal
 *
 * `lineNumber` is 1 based.
 */
export interface IReadonlyTextBuffer {
	readonly onDidChangeContent: Event<void>;
	equals(other: ITextBuffer): boolean;
	mightContainRTL(): boolean;
	mightContainUnusualLineTerminators(): boolean;
	resetMightContainUnusualLineTerminators(): void;
	mightContainNonBasicASCII(): boolean;
	getBOM(): string;
	getEOL(): string;

	getOffsetAt(lineNumber: number, column: number): number;
	getPositionAt(offset: number): Position;
	getRangeAt(offset: number, length: number): Range;

	getValueInRange(range: Range, eol: EndOfLinePreference): string;
	createSnapshot(preserveBOM: boolean): ITextSnapshot;
	getValueLengthInRange(range: Range, eol: EndOfLinePreference): number;
	getCharacterCountInRange(range: Range, eol: EndOfLinePreference): number;
	getLength(): number;
	getLineCount(): number;
	getLinesContent(): string[];
	getLineContent(lineNumber: number): string;
	getLineCharCode(lineNumber: number, index: number): number;
	getCharCode(offset: number): number;
	getLineLength(lineNumber: number): number;
	getLineMinColumn(lineNumber: number): number;
	getLineMaxColumn(lineNumber: number): number;
	getLineFirstNonWhitespaceColumn(lineNumber: number): number;
	getLineLastNonWhitespaceColumn(lineNumber: number): number;
	findMatchesLineByLine(searchRange: Range, searchData: SearchData, captureMatches: boolean, limitResultCount: number): FindMatch[];

	/**
	 * Get nearest chunk of text after `offset` in the text buffer.
	 */
	getNearestChunk(offset: number): string;
}

/**
 * @internal
 */
export class SearchData {

	/**
	 * The regex to search for. Always defined.
	 */
	public readonly regex: RegExp;
	/**
	 * The word separator classifier.
	 */
	public readonly wordSeparators: WordCharacterClassifier | null;
	/**
	 * The simple string to search for (if possible).
	 */
	public readonly simpleSearch: string | null;

	constructor(regex: RegExp, wordSeparators: WordCharacterClassifier | null, simpleSearch: string | null) {
		this.regex = regex;
		this.wordSeparators = wordSeparators;
		this.simpleSearch = simpleSearch;
	}
}

/**
 * @internal
 */
export interface ITextBuffer extends IReadonlyTextBuffer, IDisposable {
	setEOL(newEOL: '\r\n' | '\n'): void;
	applyEdits(rawOperations: ValidAnnotatedEditOperation[], recordTrimAutoWhitespace: boolean, computeUndoEdits: boolean): ApplyEditsResult;
}

/**
 * @internal
 */
export class ApplyEditsResult {

	constructor(
		public readonly reverseEdits: IValidEditOperation[] | null,
		public readonly changes: IInternalModelContentChange[],
		public readonly trimAutoWhitespaceLineNumbers: number[] | null
	) { }

}

/**
 * @internal
 */
export interface IInternalModelContentChange extends IModelContentChange {
	range: Range;
	forceMoveMarkers: boolean;
}

/**
 * @internal
 */
export function shouldSynchronizeModel(model: ITextModel): boolean {
	return (
		!model.isTooLargeForSyncing() && !model.isForSimpleWidget
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/modelLineProjectionData.ts]---
Location: vscode-main/src/vs/editor/common/modelLineProjectionData.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertNever } from '../../base/common/assert.js';
import { WrappingIndent } from './config/editorOptions.js';
import { FontInfo } from './config/fontInfo.js';
import { Position } from './core/position.js';
import { InjectedTextCursorStops, InjectedTextOptions, PositionAffinity } from './model.js';
import { LineInjectedText } from './textModelEvents.js';

/**
 * *input*:
 * ```
 * xxxxxxxxxxxxxxxxxxxxxxxxxxx
 * ```
 *
 * -> Applying injections `[i...i]`, *inputWithInjections*:
 * ```
 * xxxxxx[iiiiiiiiii]xxxxxxxxxxxxxxxxx[ii]xxxx
 * ```
 *
 * -> breaking at offsets `|` in `xxxxxx[iiiiiii|iii]xxxxxxxxxxx|xxxxxx[ii]xxxx|`:
 * ```
 * xxxxxx[iiiiiii
 * iii]xxxxxxxxxxx
 * xxxxxx[ii]xxxx
 * ```
 *
 * -> applying wrappedTextIndentLength, *output*:
 * ```
 * xxxxxx[iiiiiii
 *    iii]xxxxxxxxxxx
 *    xxxxxx[ii]xxxx
 * ```
 */
export class ModelLineProjectionData {
	constructor(
		public injectionOffsets: number[] | null,
		/**
		 * `injectionOptions.length` must equal `injectionOffsets.length`
		 */
		public injectionOptions: InjectedTextOptions[] | null,
		/**
		 * Refers to offsets after applying injections to the source.
		 * The last break offset indicates the length of the source after applying injections.
		 */
		public breakOffsets: number[],
		/**
		 * Refers to offsets after applying injections
		 */
		public breakOffsetsVisibleColumn: number[],
		public wrappedTextIndentLength: number
	) {
	}

	public getOutputLineCount(): number {
		return this.breakOffsets.length;
	}

	public getMinOutputOffset(outputLineIndex: number): number {
		if (outputLineIndex > 0) {
			return this.wrappedTextIndentLength;
		}
		return 0;
	}

	public getLineLength(outputLineIndex: number): number {
		// These offsets refer to model text with injected text.
		const startOffset = outputLineIndex > 0 ? this.breakOffsets[outputLineIndex - 1] : 0;
		const endOffset = this.breakOffsets[outputLineIndex];

		let lineLength = endOffset - startOffset;
		if (outputLineIndex > 0) {
			lineLength += this.wrappedTextIndentLength;
		}
		return lineLength;
	}

	public getMaxOutputOffset(outputLineIndex: number): number {
		return this.getLineLength(outputLineIndex);
	}

	public translateToInputOffset(outputLineIndex: number, outputOffset: number): number {
		if (outputLineIndex > 0) {
			outputOffset = Math.max(0, outputOffset - this.wrappedTextIndentLength);
		}

		const offsetInInputWithInjection = outputLineIndex === 0 ? outputOffset : this.breakOffsets[outputLineIndex - 1] + outputOffset;
		let offsetInInput = offsetInInputWithInjection;

		if (this.injectionOffsets !== null) {
			for (let i = 0; i < this.injectionOffsets.length; i++) {
				if (offsetInInput > this.injectionOffsets[i]) {
					if (offsetInInput < this.injectionOffsets[i] + this.injectionOptions![i].content.length) {
						// `inputOffset` is within injected text
						offsetInInput = this.injectionOffsets[i];
					} else {
						offsetInInput -= this.injectionOptions![i].content.length;
					}
				} else {
					break;
				}
			}
		}

		return offsetInInput;
	}

	public translateToOutputPosition(inputOffset: number, affinity: PositionAffinity = PositionAffinity.None): OutputPosition {
		let inputOffsetInInputWithInjection = inputOffset;
		if (this.injectionOffsets !== null) {
			for (let i = 0; i < this.injectionOffsets.length; i++) {
				if (inputOffset < this.injectionOffsets[i]) {
					break;
				}

				if (affinity !== PositionAffinity.Right && inputOffset === this.injectionOffsets[i]) {
					break;
				}

				inputOffsetInInputWithInjection += this.injectionOptions![i].content.length;
			}
		}

		return this.offsetInInputWithInjectionsToOutputPosition(inputOffsetInInputWithInjection, affinity);
	}

	private offsetInInputWithInjectionsToOutputPosition(offsetInInputWithInjections: number, affinity: PositionAffinity = PositionAffinity.None): OutputPosition {
		let low = 0;
		let high = this.breakOffsets.length - 1;
		let mid = 0;
		let midStart = 0;

		while (low <= high) {
			mid = low + ((high - low) / 2) | 0;

			const midStop = this.breakOffsets[mid];
			midStart = mid > 0 ? this.breakOffsets[mid - 1] : 0;

			if (affinity === PositionAffinity.Left) {
				if (offsetInInputWithInjections <= midStart) {
					high = mid - 1;
				} else if (offsetInInputWithInjections > midStop) {
					low = mid + 1;
				} else {
					break;
				}
			} else {
				if (offsetInInputWithInjections < midStart) {
					high = mid - 1;
				} else if (offsetInInputWithInjections >= midStop) {
					low = mid + 1;
				} else {
					break;
				}
			}
		}

		let outputOffset = offsetInInputWithInjections - midStart;
		if (mid > 0) {
			outputOffset += this.wrappedTextIndentLength;
		}

		return new OutputPosition(mid, outputOffset);
	}

	public normalizeOutputPosition(outputLineIndex: number, outputOffset: number, affinity: PositionAffinity): OutputPosition {
		if (this.injectionOffsets !== null) {
			const offsetInInputWithInjections = this.outputPositionToOffsetInInputWithInjections(outputLineIndex, outputOffset);
			const normalizedOffsetInUnwrappedLine = this.normalizeOffsetInInputWithInjectionsAroundInjections(offsetInInputWithInjections, affinity);
			if (normalizedOffsetInUnwrappedLine !== offsetInInputWithInjections) {
				// injected text caused a change
				return this.offsetInInputWithInjectionsToOutputPosition(normalizedOffsetInUnwrappedLine, affinity);
			}
		}

		if (affinity === PositionAffinity.Left) {
			if (outputLineIndex > 0 && outputOffset === this.getMinOutputOffset(outputLineIndex)) {
				return new OutputPosition(outputLineIndex - 1, this.getMaxOutputOffset(outputLineIndex - 1));
			}
		}
		else if (affinity === PositionAffinity.Right) {
			const maxOutputLineIndex = this.getOutputLineCount() - 1;
			if (outputLineIndex < maxOutputLineIndex && outputOffset === this.getMaxOutputOffset(outputLineIndex)) {
				return new OutputPosition(outputLineIndex + 1, this.getMinOutputOffset(outputLineIndex + 1));
			}
		}

		return new OutputPosition(outputLineIndex, outputOffset);
	}

	private outputPositionToOffsetInInputWithInjections(outputLineIndex: number, outputOffset: number): number {
		if (outputLineIndex > 0) {
			outputOffset = Math.max(0, outputOffset - this.wrappedTextIndentLength);
		}
		const result = (outputLineIndex > 0 ? this.breakOffsets[outputLineIndex - 1] : 0) + outputOffset;
		return result;
	}

	private normalizeOffsetInInputWithInjectionsAroundInjections(offsetInInputWithInjections: number, affinity: PositionAffinity): number {
		const injectedText = this.getInjectedTextAtOffset(offsetInInputWithInjections);
		if (!injectedText) {
			return offsetInInputWithInjections;
		}

		if (affinity === PositionAffinity.None) {
			if (offsetInInputWithInjections === injectedText.offsetInInputWithInjections + injectedText.length
				&& hasRightCursorStop(this.injectionOptions![injectedText.injectedTextIndex].cursorStops)) {
				return injectedText.offsetInInputWithInjections + injectedText.length;
			} else {
				let result = injectedText.offsetInInputWithInjections;
				if (hasLeftCursorStop(this.injectionOptions![injectedText.injectedTextIndex].cursorStops)) {
					return result;
				}

				let index = injectedText.injectedTextIndex - 1;
				while (index >= 0 && this.injectionOffsets![index] === this.injectionOffsets![injectedText.injectedTextIndex]) {
					if (hasRightCursorStop(this.injectionOptions![index].cursorStops)) {
						break;
					}
					result -= this.injectionOptions![index].content.length;
					if (hasLeftCursorStop(this.injectionOptions![index].cursorStops)) {
						break;
					}
					index--;
				}

				return result;
			}
		} else if (affinity === PositionAffinity.Right || affinity === PositionAffinity.RightOfInjectedText) {
			let result = injectedText.offsetInInputWithInjections + injectedText.length;
			let index = injectedText.injectedTextIndex;
			// traverse all injected text that touch each other
			while (index + 1 < this.injectionOffsets!.length && this.injectionOffsets![index + 1] === this.injectionOffsets![index]) {
				result += this.injectionOptions![index + 1].content.length;
				index++;
			}
			return result;
		} else if (affinity === PositionAffinity.Left || affinity === PositionAffinity.LeftOfInjectedText) {
			// affinity is left
			let result = injectedText.offsetInInputWithInjections;
			let index = injectedText.injectedTextIndex;
			// traverse all injected text that touch each other
			while (index - 1 >= 0 && this.injectionOffsets![index - 1] === this.injectionOffsets![index]) {
				result -= this.injectionOptions![index - 1].content.length;
				index--;
			}
			return result;
		}

		assertNever(affinity);
	}

	public getInjectedText(outputLineIndex: number, outputOffset: number): InjectedText | null {
		const offset = this.outputPositionToOffsetInInputWithInjections(outputLineIndex, outputOffset);
		const injectedText = this.getInjectedTextAtOffset(offset);
		if (!injectedText) {
			return null;
		}
		return {
			options: this.injectionOptions![injectedText.injectedTextIndex]
		};
	}

	private getInjectedTextAtOffset(offsetInInputWithInjections: number): { injectedTextIndex: number; offsetInInputWithInjections: number; length: number } | undefined {
		const injectionOffsets = this.injectionOffsets;
		const injectionOptions = this.injectionOptions;

		if (injectionOffsets !== null) {
			let totalInjectedTextLengthBefore = 0;
			for (let i = 0; i < injectionOffsets.length; i++) {
				const length = injectionOptions![i].content.length;
				const injectedTextStartOffsetInInputWithInjections = injectionOffsets[i] + totalInjectedTextLengthBefore;
				const injectedTextEndOffsetInInputWithInjections = injectionOffsets[i] + totalInjectedTextLengthBefore + length;

				if (injectedTextStartOffsetInInputWithInjections > offsetInInputWithInjections) {
					// Injected text starts later.
					break; // All later injected texts have an even larger offset.
				}

				if (offsetInInputWithInjections <= injectedTextEndOffsetInInputWithInjections) {
					// Injected text ends after or with the given position (but also starts with or before it).
					return {
						injectedTextIndex: i,
						offsetInInputWithInjections: injectedTextStartOffsetInInputWithInjections,
						length
					};
				}

				totalInjectedTextLengthBefore += length;
			}
		}

		return undefined;
	}
}

function hasRightCursorStop(cursorStop: InjectedTextCursorStops | null | undefined): boolean {
	if (cursorStop === null || cursorStop === undefined) { return true; }
	return cursorStop === InjectedTextCursorStops.Right || cursorStop === InjectedTextCursorStops.Both;
}
function hasLeftCursorStop(cursorStop: InjectedTextCursorStops | null | undefined): boolean {
	if (cursorStop === null || cursorStop === undefined) { return true; }
	return cursorStop === InjectedTextCursorStops.Left || cursorStop === InjectedTextCursorStops.Both;
}

export class InjectedText {
	constructor(public readonly options: InjectedTextOptions) { }
}

export class OutputPosition {
	outputLineIndex: number;
	outputOffset: number;

	constructor(outputLineIndex: number, outputOffset: number) {
		this.outputLineIndex = outputLineIndex;
		this.outputOffset = outputOffset;
	}

	toString(): string {
		return `${this.outputLineIndex}:${this.outputOffset}`;
	}

	toPosition(baseLineNumber: number): Position {
		return new Position(baseLineNumber + this.outputLineIndex, this.outputOffset + 1);
	}
}

export interface ILineBreaksComputerFactory {
	createLineBreaksComputer(fontInfo: FontInfo, tabSize: number, wrappingColumn: number, wrappingIndent: WrappingIndent, wordBreak: 'normal' | 'keepAll', wrapOnEscapedLineFeeds: boolean): ILineBreaksComputer;
}

export interface ILineBreaksComputer {
	/**
	 * Pass in `previousLineBreakData` if the only difference is in breaking columns!!!
	 */
	addRequest(lineText: string, injectedText: LineInjectedText[] | null, previousLineBreakData: ModelLineProjectionData | null): void;
	finalize(): (ModelLineProjectionData | null)[];
}
```

--------------------------------------------------------------------------------

````

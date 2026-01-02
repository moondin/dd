---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 205
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 205 of 552)

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

---[FILE: src/vs/editor/browser/widget/diffEditor/components/diffEditorViewZones/inlineDiffDeletedCodeMargin.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/components/diffEditorViewZones/inlineDiffDeletedCodeMargin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addStandardDisposableListener, getDomNodePagePosition } from '../../../../../../base/browser/dom.js';
import { Action } from '../../../../../../base/common/actions.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { isIOS } from '../../../../../../base/common/platform.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { IEditorMouseEvent, MouseTargetType } from '../../../../editorBrowser.js';
import { CodeEditorWidget } from '../../../codeEditor/codeEditorWidget.js';
import { DiffEditorWidget } from '../../diffEditorWidget.js';
import { EditorOption } from '../../../../../common/config/editorOptions.js';
import { DetailedLineRangeMapping } from '../../../../../common/diff/rangeMapping.js';
import { EndOfLineSequence, ITextModel } from '../../../../../common/model.js';
import { localize } from '../../../../../../nls.js';
import { IClipboardService } from '../../../../../../platform/clipboard/common/clipboardService.js';
import { IContextMenuService } from '../../../../../../platform/contextview/browser/contextView.js';
import { enableCopySelection } from './copySelection.js';
import { RenderLinesResult } from './renderLines.js';

export class InlineDiffDeletedCodeMargin extends Disposable {
	private readonly _diffActions: HTMLElement;

	private _visibility: boolean = false;

	get visibility(): boolean {
		return this._visibility;
	}

	set visibility(_visibility: boolean) {
		if (this._visibility !== _visibility) {
			this._visibility = _visibility;
			this._diffActions.style.visibility = _visibility ? 'visible' : 'hidden';
		}
	}

	constructor(
		private readonly _getViewZoneId: () => string,
		private readonly _marginDomNode: HTMLElement,
		private readonly _deletedCodeDomNode: HTMLElement,
		private readonly _modifiedEditor: CodeEditorWidget,
		private readonly _diff: DetailedLineRangeMapping,
		private readonly _editor: DiffEditorWidget,
		private readonly _renderLinesResult: RenderLinesResult,
		private readonly _originalTextModel: ITextModel,
		private readonly _contextMenuService: IContextMenuService,
		private readonly _clipboardService: IClipboardService,
	) {
		super();

		// make sure the diff margin shows above overlay.
		this._marginDomNode.style.zIndex = '10';

		this._diffActions = document.createElement('div');
		this._diffActions.className = ThemeIcon.asClassName(Codicon.lightBulb) + ' lightbulb-glyph';
		this._diffActions.style.position = 'absolute';
		const lineHeight = this._modifiedEditor.getOption(EditorOption.lineHeight);
		this._diffActions.style.right = '0px';
		this._diffActions.style.visibility = 'hidden';
		this._diffActions.style.height = `${lineHeight}px`;
		this._diffActions.style.lineHeight = `${lineHeight}px`;
		this._marginDomNode.appendChild(this._diffActions);

		let currentLineNumberOffset = 0;

		const useShadowDOM = _modifiedEditor.getOption(EditorOption.useShadowDOM) && !isIOS; // Do not use shadow dom on IOS #122035
		const showContextMenu = (anchor: { x: number; y: number }, baseActions?: Action[], onHide?: () => void) => {
			this._contextMenuService.showContextMenu({
				domForShadowRoot: useShadowDOM ? _modifiedEditor.getDomNode() ?? undefined : undefined,
				getAnchor: () => anchor,
				onHide,
				getActions: () => {
					const actions: Action[] = baseActions ?? [];
					const isDeletion = _diff.modified.isEmpty;

					// default action
					actions.push(new Action(
						'diff.clipboard.copyDeletedContent',
						isDeletion
							? (_diff.original.length > 1
								? localize('diff.clipboard.copyDeletedLinesContent.label', "Copy deleted lines")
								: localize('diff.clipboard.copyDeletedLinesContent.single.label', "Copy deleted line"))
							: (_diff.original.length > 1
								? localize('diff.clipboard.copyChangedLinesContent.label', "Copy changed lines")
								: localize('diff.clipboard.copyChangedLinesContent.single.label', "Copy changed line")),
						undefined,
						true,
						async () => {
							const originalText = this._originalTextModel.getValueInRange(_diff.original.toExclusiveRange());
							await this._clipboardService.writeText(originalText);
						}
					));

					if (_diff.original.length > 1) {
						actions.push(new Action(
							'diff.clipboard.copyDeletedLineContent',
							isDeletion
								? localize('diff.clipboard.copyDeletedLineContent.label', "Copy deleted line ({0})",
									_diff.original.startLineNumber + currentLineNumberOffset)
								: localize('diff.clipboard.copyChangedLineContent.label', "Copy changed line ({0})",
									_diff.original.startLineNumber + currentLineNumberOffset),
							undefined,
							true,
							async () => {
								let lineContent = this._originalTextModel.getLineContent(_diff.original.startLineNumber + currentLineNumberOffset);
								if (lineContent === '') {
									// empty line -> new line
									const eof = this._originalTextModel.getEndOfLineSequence();
									lineContent = eof === EndOfLineSequence.LF ? '\n' : '\r\n';
								}
								await this._clipboardService.writeText(lineContent);
							}
						));
					}
					const readOnly = _modifiedEditor.getOption(EditorOption.readOnly);
					if (!readOnly) {
						actions.push(new Action(
							'diff.inline.revertChange',
							localize('diff.inline.revertChange.label', "Revert this change"),
							undefined,
							true,
							async () => {
								this._editor.revert(this._diff);
							})
						);
					}
					return actions;
				},
				autoSelectFirstItem: true
			});
		};

		this._register(addStandardDisposableListener(this._diffActions, 'mousedown', e => {
			if (!e.leftButton) { return; }

			const { top, height } = getDomNodePagePosition(this._diffActions);
			const pad = Math.floor(lineHeight / 3);
			e.preventDefault();
			showContextMenu({ x: e.posx, y: top + height + pad });
		}));

		this._register(_modifiedEditor.onMouseMove((e: IEditorMouseEvent) => {
			if ((e.target.type === MouseTargetType.CONTENT_VIEW_ZONE || e.target.type === MouseTargetType.GUTTER_VIEW_ZONE) && e.target.detail.viewZoneId === this._getViewZoneId()) {
				currentLineNumberOffset = this._updateLightBulbPosition(this._marginDomNode, e.event.browserEvent.y, lineHeight);
				this.visibility = true;
			} else {
				this.visibility = false;
			}
		}));

		this._register(enableCopySelection({
			domNode: this._deletedCodeDomNode,
			diffEntry: _diff,
			originalModel: this._originalTextModel,
			renderLinesResult: this._renderLinesResult,
			clipboardService: _clipboardService,
		}));
	}

	private _updateLightBulbPosition(marginDomNode: HTMLElement, y: number, lineHeight: number): number {
		const { top } = getDomNodePagePosition(marginDomNode);
		const offset = y - top;
		const lineNumberOffset = Math.floor(offset / lineHeight);
		const newTop = lineNumberOffset * lineHeight;
		this._diffActions.style.top = `${newTop}px`;
		if (this._renderLinesResult.viewLineCounts) {
			let acc = 0;
			for (let i = 0; i < this._renderLinesResult.viewLineCounts.length; i++) {
				acc += this._renderLinesResult.viewLineCounts[i];
				if (lineNumberOffset < acc) {
					return i;
				}
			}
		}
		return lineNumberOffset;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/components/diffEditorViewZones/renderLines.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/components/diffEditorViewZones/renderLines.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createTrustedTypesPolicy } from '../../../../../../base/browser/trustedTypes.js';
import { applyFontInfo } from '../../../../config/domFontInfo.js';
import { ICodeEditor } from '../../../../editorBrowser.js';
import { EditorFontLigatures, EditorOption, FindComputedEditorOptionValueById } from '../../../../../common/config/editorOptions.js';
import { FontInfo } from '../../../../../common/config/fontInfo.js';
import { Position } from '../../../../../common/core/position.js';
import { StringBuilder } from '../../../../../common/core/stringBuilder.js';
import { ModelLineProjectionData } from '../../../../../common/modelLineProjectionData.js';
import { IViewLineTokens, LineTokens } from '../../../../../common/tokens/lineTokens.js';
import { LineDecoration } from '../../../../../common/viewLayout/lineDecorations.js';
import { CharacterMapping, ForeignElementType, RenderLineInput, RenderLineOutput, renderViewLine } from '../../../../../common/viewLayout/viewLineRenderer.js';
import { ViewLineRenderingData } from '../../../../../common/viewModel.js';
import { InlineDecoration } from '../../../../../common/viewModel/inlineDecorations.js';
import { getColumnOfNodeOffset } from '../../../../viewParts/viewLines/viewLine.js';

const ttPolicy = createTrustedTypesPolicy('diffEditorWidget', { createHTML: value => value });

export function renderLines(source: LineSource, options: RenderOptions, decorations: InlineDecoration[], domNode: HTMLElement, noExtra = false): RenderLinesResult {
	applyFontInfo(domNode, options.fontInfo);

	const hasCharChanges = (decorations.length > 0);

	const sb = new StringBuilder(10000);
	let maxCharsPerLine = 0;
	let renderedLineCount = 0;
	const viewLineCounts: number[] = [];
	const renderOutputs: RenderLineOutputWithOffset[] = [];
	for (let lineIndex = 0; lineIndex < source.lineTokens.length; lineIndex++) {
		const lineNumber = lineIndex + 1;
		const lineTokens = source.lineTokens[lineIndex];
		const lineBreakData = source.lineBreakData[lineIndex];
		const actualDecorations = LineDecoration.filter(decorations, lineNumber, 1, Number.MAX_SAFE_INTEGER);

		if (lineBreakData) {
			let lastBreakOffset = 0;
			for (const breakOffset of lineBreakData.breakOffsets) {
				const viewLineTokens = lineTokens.sliceAndInflate(lastBreakOffset, breakOffset, 0);
				const result = renderOriginalLine(
					renderedLineCount,
					viewLineTokens,
					LineDecoration.extractWrapped(actualDecorations, lastBreakOffset, breakOffset),
					hasCharChanges,
					source.mightContainNonBasicASCII,
					source.mightContainRTL,
					options,
					sb,
					noExtra,
				);
				maxCharsPerLine = Math.max(maxCharsPerLine, result.maxCharWidth);
				renderOutputs.push(new RenderLineOutputWithOffset(result.output.characterMapping, result.output.containsForeignElements, lastBreakOffset));
				renderedLineCount++;
				lastBreakOffset = breakOffset;
			}
			viewLineCounts.push(lineBreakData.breakOffsets.length);
		} else {
			viewLineCounts.push(1);
			const result = renderOriginalLine(
				renderedLineCount,
				lineTokens,
				actualDecorations,
				hasCharChanges,
				source.mightContainNonBasicASCII,
				source.mightContainRTL,
				options,
				sb,
				noExtra,
			);
			maxCharsPerLine = Math.max(maxCharsPerLine, result.maxCharWidth);
			renderOutputs.push(new RenderLineOutputWithOffset(result.output.characterMapping, result.output.containsForeignElements, 0));
			renderedLineCount++;
		}
	}
	maxCharsPerLine += options.scrollBeyondLastColumn;

	const html = sb.build();
	const trustedhtml = ttPolicy ? ttPolicy.createHTML(html) : html;
	domNode.innerHTML = trustedhtml as string;
	const minWidthInPx = (maxCharsPerLine * options.typicalHalfwidthCharacterWidth);

	return new RenderLinesResult(
		renderedLineCount,
		minWidthInPx,
		viewLineCounts,
		renderOutputs,
		source,
	);
}

export class LineSource {
	constructor(
		public readonly lineTokens: LineTokens[],
		public readonly lineBreakData: (ModelLineProjectionData | null)[] = lineTokens.map(t => null),
		public readonly mightContainNonBasicASCII: boolean = true,
		public readonly mightContainRTL: boolean = true,
	) { }
}

export class RenderOptions {
	public static fromEditor(editor: ICodeEditor): RenderOptions {

		const modifiedEditorOptions = editor.getOptions();
		const fontInfo = modifiedEditorOptions.get(EditorOption.fontInfo);
		const layoutInfo = modifiedEditorOptions.get(EditorOption.layoutInfo);

		return new RenderOptions(
			editor.getModel()?.getOptions().tabSize || 0,
			fontInfo,
			modifiedEditorOptions.get(EditorOption.disableMonospaceOptimizations),
			fontInfo.typicalHalfwidthCharacterWidth,
			modifiedEditorOptions.get(EditorOption.scrollBeyondLastColumn),

			modifiedEditorOptions.get(EditorOption.lineHeight),

			layoutInfo.decorationsWidth,
			modifiedEditorOptions.get(EditorOption.stopRenderingLineAfter),
			modifiedEditorOptions.get(EditorOption.renderWhitespace),
			modifiedEditorOptions.get(EditorOption.renderControlCharacters),
			modifiedEditorOptions.get(EditorOption.fontLigatures),
			modifiedEditorOptions.get(EditorOption.scrollbar).verticalScrollbarSize,
		);
	}

	constructor(
		public readonly tabSize: number,
		public readonly fontInfo: FontInfo,
		public readonly disableMonospaceOptimizations: boolean,
		public readonly typicalHalfwidthCharacterWidth: number,
		public readonly scrollBeyondLastColumn: number,
		public readonly lineHeight: number,
		public readonly lineDecorationsWidth: number,
		public readonly stopRenderingLineAfter: number,
		public readonly renderWhitespace: FindComputedEditorOptionValueById<EditorOption.renderWhitespace>,
		public readonly renderControlCharacters: boolean,
		public readonly fontLigatures: FindComputedEditorOptionValueById<EditorOption.fontLigatures>,
		public readonly verticalScrollbarSize: number,
		public readonly setWidth = true,
	) { }

	public withSetWidth(setWidth: boolean): RenderOptions {
		return new RenderOptions(
			this.tabSize,
			this.fontInfo,
			this.disableMonospaceOptimizations,
			this.typicalHalfwidthCharacterWidth,
			this.scrollBeyondLastColumn,
			this.lineHeight,
			this.lineDecorationsWidth,
			this.stopRenderingLineAfter,
			this.renderWhitespace,
			this.renderControlCharacters,
			this.fontLigatures,
			this.verticalScrollbarSize,
			setWidth,
		);
	}

	public withScrollBeyondLastColumn(scrollBeyondLastColumn: number): RenderOptions {
		return new RenderOptions(
			this.tabSize,
			this.fontInfo,
			this.disableMonospaceOptimizations,
			this.typicalHalfwidthCharacterWidth,
			scrollBeyondLastColumn,
			this.lineHeight,
			this.lineDecorationsWidth,
			this.stopRenderingLineAfter,
			this.renderWhitespace,
			this.renderControlCharacters,
			this.fontLigatures,
			this.verticalScrollbarSize,
			this.setWidth,
		);
	}
}

export class RenderLinesResult {
	constructor(
		public readonly heightInLines: number,
		public readonly minWidthInPx: number,
		public readonly viewLineCounts: number[],
		private readonly _renderOutputs: RenderLineOutputWithOffset[],
		private readonly _source: LineSource,
	) { }

	/**
	 * Returns the model position for a given DOM node and offset within that node.
	 * @param domNode The span node within a view-line where the offset is located
	 * @param offset The offset within the span node
	 * @returns The Position in the model, or undefined if the position cannot be determined
	 */
	public getModelPositionAt(domNode: HTMLElement, offset: number): Position | undefined {
		// Find the view-line element that contains this span
		let viewLineElement: HTMLElement | null = domNode;
		while (viewLineElement && !viewLineElement.classList.contains('view-line')) {
			viewLineElement = viewLineElement.parentElement;
		}

		if (!viewLineElement) {
			return undefined;
		}

		// Find the container that has all view lines
		const container = viewLineElement.parentElement;
		if (!container) {
			return undefined;
		}

		// Find the view line index based on the element
		// eslint-disable-next-line no-restricted-syntax
		const viewLines = container.querySelectorAll('.view-line');
		let viewLineIndex = -1;
		for (let i = 0; i < viewLines.length; i++) {
			if (viewLines[i] === viewLineElement) {
				viewLineIndex = i;
				break;
			}
		}

		if (viewLineIndex === -1 || viewLineIndex >= this._renderOutputs.length) {
			return undefined;
		}

		// Map view line index back to model line
		let modelLineNumber = 1;
		let remainingViewLines = viewLineIndex;
		for (let i = 0; i < this.viewLineCounts.length; i++) {
			if (remainingViewLines < this.viewLineCounts[i]) {
				modelLineNumber = i + 1;
				break;
			}
			remainingViewLines -= this.viewLineCounts[i];
		}

		if (modelLineNumber > this._source.lineTokens.length) {
			return undefined;
		}

		const renderOutput = this._renderOutputs[viewLineIndex];
		if (!renderOutput) {
			return undefined;
		}

		const column = getColumnOfNodeOffset(renderOutput.characterMapping, domNode, offset) + renderOutput.offset;

		return new Position(modelLineNumber, column);
	}
}

class RenderLineOutputWithOffset extends RenderLineOutput {
	constructor(characterMapping: CharacterMapping, containsForeignElements: ForeignElementType, public readonly offset: number) {
		super(characterMapping, containsForeignElements);
	}
}

function renderOriginalLine(
	viewLineIdx: number,
	lineTokens: IViewLineTokens,
	decorations: LineDecoration[],
	hasCharChanges: boolean,
	mightContainNonBasicASCII: boolean,
	mightContainRTL: boolean,
	options: RenderOptions,
	sb: StringBuilder,
	noExtra: boolean,
): { output: RenderLineOutput; maxCharWidth: number } {

	sb.appendString('<div class="view-line');
	if (!noExtra && !hasCharChanges) {
		// No char changes
		sb.appendString(' char-delete');
	}
	sb.appendString('" style="top:');
	sb.appendString(String(viewLineIdx * options.lineHeight));
	if (options.setWidth) {
		sb.appendString('px;width:1000000px;">');
	} else {
		sb.appendString('px;">');
	}

	const lineContent = lineTokens.getLineContent();
	const isBasicASCII = ViewLineRenderingData.isBasicASCII(lineContent, mightContainNonBasicASCII);
	const containsRTL = ViewLineRenderingData.containsRTL(lineContent, isBasicASCII, mightContainRTL);
	const output = renderViewLine(new RenderLineInput(
		(options.fontInfo.isMonospace && !options.disableMonospaceOptimizations),
		options.fontInfo.canUseHalfwidthRightwardsArrow,
		lineContent,
		false,
		isBasicASCII,
		containsRTL,
		0,
		lineTokens,
		decorations,
		options.tabSize,
		0,
		options.fontInfo.spaceWidth,
		options.fontInfo.middotWidth,
		options.fontInfo.wsmiddotWidth,
		options.stopRenderingLineAfter,
		options.renderWhitespace,
		options.renderControlCharacters,
		options.fontLigatures !== EditorFontLigatures.OFF,
		null, // Send no selections, original line cannot be selected
		null,
		options.verticalScrollbarSize
	), sb);

	sb.appendString('</div>');

	const maxCharWidth = output.characterMapping.getHorizontalOffset(output.characterMapping.length);
	return { output, maxCharWidth };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/features/gutterFeature.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/features/gutterFeature.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EventType, addDisposableListener, h } from '../../../../../base/browser/dom.js';
import { IMouseWheelEvent } from '../../../../../base/browser/mouseEvent.js';
import { ActionsOrientation } from '../../../../../base/browser/ui/actionbar/actionbar.js';
import { HoverPosition } from '../../../../../base/browser/ui/hover/hoverWidget.js';
import { IBoundarySashes } from '../../../../../base/browser/ui/sash/sash.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, autorun, autorunWithStore, derived, derivedDisposable, derivedWithSetter, observableFromEvent, observableValue } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { HiddenItemStrategy, MenuWorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { IMenuService, MenuId } from '../../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { WorkbenchHoverDelegate } from '../../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { LineRange, LineRangeSet } from '../../../../common/core/ranges/lineRange.js';
import { OffsetRange } from '../../../../common/core/ranges/offsetRange.js';
import { Range } from '../../../../common/core/range.js';
import { TextEdit } from '../../../../common/core/edits/textEdit.js';
import { DetailedLineRangeMapping } from '../../../../common/diff/rangeMapping.js';
import { TextModelText } from '../../../../common/model/textModelText.js';
import { ActionRunnerWithContext } from '../../multiDiffEditor/utils.js';
import { DiffEditorEditors } from '../components/diffEditorEditors.js';
import { DiffEditorSash, SashLayout } from '../components/diffEditorSash.js';
import { DiffEditorOptions } from '../diffEditorOptions.js';
import { DiffEditorViewModel } from '../diffEditorViewModel.js';
import { appendRemoveOnDispose, applyStyle, prependRemoveOnDispose } from '../utils.js';
import { EditorGutter, IGutterItemInfo, IGutterItemView } from '../utils/editorGutter.js';

const emptyArr: never[] = [];
const width = 35;

export class DiffEditorGutter extends Disposable {
	private readonly _menu;
	private readonly _actions;
	private readonly _hasActions;
	private readonly _showSash;

	public readonly width;

	private readonly elements;

	constructor(
		diffEditorRoot: HTMLDivElement,
		private readonly _diffModel: IObservable<DiffEditorViewModel | undefined>,
		private readonly _editors: DiffEditorEditors,
		private readonly _options: DiffEditorOptions,
		private readonly _sashLayout: SashLayout,
		private readonly _boundarySashes: IObservable<IBoundarySashes | undefined>,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IMenuService private readonly _menuService: IMenuService,
	) {
		super();
		this._menu = this._register(this._menuService.createMenu(MenuId.DiffEditorHunkToolbar, this._contextKeyService));
		this._actions = observableFromEvent(this, this._menu.onDidChange, () => this._menu.getActions());
		this._hasActions = this._actions.map(a => a.length > 0);
		this._showSash = derived(this, reader => this._options.renderSideBySide.read(reader) && this._hasActions.read(reader));
		this.width = derived(this, reader => this._hasActions.read(reader) ? width : 0);
		this.elements = h('div.gutter@gutter', { style: { position: 'absolute', height: '100%', width: width + 'px' } }, []);
		this._currentDiff = derived(this, (reader) => {
			const model = this._diffModel.read(reader);
			if (!model) {
				return undefined;
			}
			const mappings = model.diff.read(reader)?.mappings;

			const cursorPosition = this._editors.modifiedCursor.read(reader);
			if (!cursorPosition) { return undefined; }

			return mappings?.find(m => m.lineRangeMapping.modified.contains(cursorPosition.lineNumber));
		});
		this._selectedDiffs = derived(this, (reader) => {
			/** @description selectedDiffs */
			const model = this._diffModel.read(reader);
			const diff = model?.diff.read(reader);
			// Return `emptyArr` because it is a constant. [] is always a new array and would trigger a change.
			if (!diff) { return emptyArr; }

			const selections = this._editors.modifiedSelections.read(reader);
			if (selections.every(s => s.isEmpty())) { return emptyArr; }

			const selectedLineNumbers = new LineRangeSet(selections.map(s => LineRange.fromRangeInclusive(s)));

			const selectedMappings = diff.mappings.filter(m =>
				m.lineRangeMapping.innerChanges && selectedLineNumbers.intersects(m.lineRangeMapping.modified)
			);
			const result = selectedMappings.map(mapping => ({
				mapping,
				rangeMappings: mapping.lineRangeMapping.innerChanges!.filter(
					c => selections.some(s => Range.areIntersecting(c.modifiedRange, s))
				)
			}));
			if (result.length === 0 || result.every(r => r.rangeMappings.length === 0)) { return emptyArr; }
			return result;
		});

		this._register(prependRemoveOnDispose(diffEditorRoot, this.elements.root));

		this._register(addDisposableListener(this.elements.root, 'click', () => {
			this._editors.modified.focus();
		}));

		this._register(applyStyle(this.elements.root, { display: this._hasActions.map(a => a ? 'block' : 'none') }));

		derivedDisposable(this, reader => {
			const showSash = this._showSash.read(reader);
			return !showSash ? undefined : new DiffEditorSash(
				diffEditorRoot,
				this._sashLayout.dimensions,
				this._options.enableSplitViewResizing,
				this._boundarySashes,
				derivedWithSetter(
					this, reader => this._sashLayout.sashLeft.read(reader) - width,
					(v, tx) => this._sashLayout.sashLeft.set(v + width, tx)
				),
				() => this._sashLayout.resetSash(),
			);
		}).recomputeInitiallyAndOnChange(this._store);

		const gutterItems = derived(this, reader => {
			const model = this._diffModel.read(reader);
			if (!model) {
				return [];
			}
			const diffs = model.diff.read(reader);
			if (!diffs) { return []; }

			const selection = this._selectedDiffs.read(reader);
			if (selection.length > 0) {
				const m = DetailedLineRangeMapping.fromRangeMappings(selection.flatMap(s => s.rangeMappings));
				return [
					new DiffGutterItem(
						m,
						true,
						MenuId.DiffEditorSelectionToolbar,
						undefined,
						model.model.original.uri,
						model.model.modified.uri,
					)];
			}

			const currentDiff = this._currentDiff.read(reader);

			return diffs.mappings.map(m => new DiffGutterItem(
				m.lineRangeMapping.withInnerChangesFromLineRanges(),
				m.lineRangeMapping === currentDiff?.lineRangeMapping,
				MenuId.DiffEditorHunkToolbar,
				undefined,
				model.model.original.uri,
				model.model.modified.uri,
			));
		});

		this._register(new EditorGutter<DiffGutterItem>(this._editors.modified, this.elements.root, {
			getIntersectingGutterItems: (range, reader) => gutterItems.read(reader),
			createView: (item, target) => {
				return this._instantiationService.createInstance(DiffToolBar, item, target, this);
			},
		}));

		this._register(addDisposableListener(this.elements.gutter, EventType.MOUSE_WHEEL, (e: IMouseWheelEvent) => {
			if (this._editors.modified.getOption(EditorOption.scrollbar).handleMouseWheel) {
				this._editors.modified.delegateScrollFromMouseWheelEvent(e);
			}
		}, { passive: false }));
	}

	public computeStagedValue(mapping: DetailedLineRangeMapping): string {
		const c = mapping.innerChanges ?? [];
		const modified = new TextModelText(this._editors.modifiedModel.get()!);
		const original = new TextModelText(this._editors.original.getModel()!);

		const edit = new TextEdit(c.map(c => c.toTextEdit(modified)));
		const value = edit.apply(original);
		return value;
	}

	private readonly _currentDiff;

	private readonly _selectedDiffs;

	layout(left: number) {
		this.elements.gutter.style.left = left + 'px';
	}
}

class DiffGutterItem implements IGutterItemInfo {
	constructor(
		public readonly mapping: DetailedLineRangeMapping,
		public readonly showAlways: boolean,
		public readonly menuId: MenuId,
		public readonly rangeOverride: LineRange | undefined,
		public readonly originalUri: URI,
		public readonly modifiedUri: URI,
	) {
	}
	get id(): string { return this.mapping.modified.toString(); }
	get range(): LineRange { return this.rangeOverride ?? this.mapping.modified; }
}


class DiffToolBar extends Disposable implements IGutterItemView {
	private readonly _elements;

	private readonly _showAlways;
	private readonly _menuId;

	private readonly _isSmall;

	constructor(
		private readonly _item: IObservable<DiffGutterItem>,
		target: HTMLElement,
		gutter: DiffEditorGutter,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		super();
		this._elements = h('div.gutterItem', { style: { height: '20px', width: '34px' } }, [
			h('div.background@background', {}, []),
			h('div.buttons@buttons', {}, []),
		]);
		this._showAlways = this._item.map(this, item => item.showAlways);
		this._menuId = this._item.map(this, item => item.menuId);
		this._isSmall = observableValue(this, false);
		this._lastItemRange = undefined;
		this._lastViewRange = undefined;

		const hoverDelegate = this._register(instantiationService.createInstance(
			WorkbenchHoverDelegate,
			'element',
			{ instantHover: true },
			{ position: { hoverPosition: HoverPosition.RIGHT } }
		));

		this._register(appendRemoveOnDispose(target, this._elements.root));

		this._register(autorun(reader => {
			/** @description update showAlways */
			const showAlways = this._showAlways.read(reader);
			this._elements.root.classList.toggle('noTransition', true);
			this._elements.root.classList.toggle('showAlways', showAlways);
			setTimeout(() => {
				this._elements.root.classList.toggle('noTransition', false);
			}, 0);
		}));


		this._register(autorunWithStore((reader, store) => {
			this._elements.buttons.replaceChildren();
			const i = store.add(instantiationService.createInstance(MenuWorkbenchToolBar, this._elements.buttons, this._menuId.read(reader), {
				orientation: ActionsOrientation.VERTICAL,
				hoverDelegate,
				toolbarOptions: {
					primaryGroup: g => g.startsWith('primary'),
				},
				overflowBehavior: { maxItems: this._isSmall.read(reader) ? 1 : 3 },
				hiddenItemStrategy: HiddenItemStrategy.Ignore,
				actionRunner: store.add(new ActionRunnerWithContext(() => {
					const item = this._item.read(undefined);
					const mapping = item.mapping;
					return {
						mapping,
						originalWithModifiedChanges: gutter.computeStagedValue(mapping),
						originalUri: item.originalUri,
						modifiedUri: item.modifiedUri,
					} satisfies DiffEditorSelectionHunkToolbarContext;
				})),
				menuOptions: {
					shouldForwardArgs: true,
				},
			}));
			store.add(i.onDidChangeMenuItems(() => {
				if (this._lastItemRange) {
					this.layout(this._lastItemRange, this._lastViewRange!);
				}
			}));
		}));
	}

	private _lastItemRange: OffsetRange | undefined;
	private _lastViewRange: OffsetRange | undefined;

	layout(itemRange: OffsetRange, viewRange: OffsetRange): void {
		this._lastItemRange = itemRange;
		this._lastViewRange = viewRange;

		let itemHeight = this._elements.buttons.clientHeight;
		this._isSmall.set(this._item.get().mapping.original.startLineNumber === 1 && itemRange.length < 30, undefined);
		// Item might have changed
		itemHeight = this._elements.buttons.clientHeight;

		const middleHeight = itemRange.length / 2 - itemHeight / 2;

		const margin = itemHeight;

		let effectiveCheckboxTop = itemRange.start + middleHeight;

		const preferredViewPortRange = OffsetRange.tryCreate(
			margin,
			viewRange.endExclusive - margin - itemHeight
		);

		const preferredParentRange = OffsetRange.tryCreate(
			itemRange.start + margin,
			itemRange.endExclusive - itemHeight - margin
		);

		if (preferredParentRange && preferredViewPortRange && preferredParentRange.start < preferredParentRange.endExclusive) {
			effectiveCheckboxTop = preferredViewPortRange.clip(effectiveCheckboxTop);
			effectiveCheckboxTop = preferredParentRange.clip(effectiveCheckboxTop);
		}

		this._elements.buttons.style.top = `${effectiveCheckboxTop - itemRange.start}px`;
	}
}

export interface DiffEditorSelectionHunkToolbarContext {
	mapping: DetailedLineRangeMapping;

	/**
	 * The original text with the selected modified changes applied.
	*/
	originalWithModifiedChanges: string;

	modifiedUri: URI;
	originalUri: URI;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/features/hideUnchangedRegionsFeature.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/features/hideUnchangedRegionsFeature.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, addDisposableListener, getWindow, h, reset } from '../../../../../base/browser/dom.js';
import { renderIcon, renderLabelWithIcons } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, IReader, autorun, derived, derivedDisposable, observableValue, transaction } from '../../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { isDefined } from '../../../../../base/common/types.js';
import { localize } from '../../../../../nls.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { LineRange } from '../../../../common/core/ranges/lineRange.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { CursorChangeReason } from '../../../../common/cursorEvents.js';
import { SymbolKind, SymbolKinds } from '../../../../common/languages.js';
import { IModelDecorationOptions, IModelDeltaDecoration, ITextModel } from '../../../../common/model.js';
import { ICodeEditor } from '../../../editorBrowser.js';
import { observableCodeEditor } from '../../../observableCodeEditor.js';
import { DiffEditorEditors } from '../components/diffEditorEditors.js';
import { DiffEditorOptions } from '../diffEditorOptions.js';
import { DiffEditorViewModel, RevealPreference, UnchangedRegion } from '../diffEditorViewModel.js';
import { IObservableViewZone, PlaceholderViewZone, ViewZoneOverlayWidget, applyObservableDecorations, applyStyle } from '../utils.js';

/**
 * Make sure to add the view zones to the editor!
 */
export class HideUnchangedRegionsFeature extends Disposable {
	public static readonly _breadcrumbsSourceFactory = observableValue<((textModel: ITextModel, instantiationService: IInstantiationService) => IDiffEditorBreadcrumbsSource)>(
		this, () => ({
			dispose() {
			},
			getBreadcrumbItems(startRange, reader) {
				return [];
			},
			getAt: () => [],
		}));
	public static setBreadcrumbsSourceFactory(factory: (textModel: ITextModel, instantiationService: IInstantiationService) => IDiffEditorBreadcrumbsSource) {
		this._breadcrumbsSourceFactory.set(factory, undefined);
	}

	private readonly _modifiedOutlineSource = derivedDisposable(this, (reader) => {
		const m = this._editors.modifiedModel.read(reader);
		const factory = HideUnchangedRegionsFeature._breadcrumbsSourceFactory.read(reader);
		return (!m || !factory) ? undefined : factory(m, this._instantiationService);
	});

	public readonly viewZones: IObservable<{
		origViewZones: IObservableViewZone[];
		modViewZones: IObservableViewZone[];
	}>;

	private _isUpdatingHiddenAreas = false;
	public get isUpdatingHiddenAreas() { return this._isUpdatingHiddenAreas; }

	constructor(
		private readonly _editors: DiffEditorEditors,
		private readonly _diffModel: IObservable<DiffEditorViewModel | undefined>,
		private readonly _options: DiffEditorOptions,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();

		this._register(this._editors.original.onDidChangeCursorPosition(e => {
			if (e.reason === CursorChangeReason.ContentFlush) { return; }
			const m = this._diffModel.get();
			transaction(tx => {
				for (const s of this._editors.original.getSelections() || []) {
					m?.ensureOriginalLineIsVisible(s.getStartPosition().lineNumber, RevealPreference.FromCloserSide, tx);
					m?.ensureOriginalLineIsVisible(s.getEndPosition().lineNumber, RevealPreference.FromCloserSide, tx);
				}
			});
		}));

		this._register(this._editors.modified.onDidChangeCursorPosition(e => {
			if (e.reason === CursorChangeReason.ContentFlush) { return; }
			const m = this._diffModel.get();
			transaction(tx => {
				for (const s of this._editors.modified.getSelections() || []) {
					m?.ensureModifiedLineIsVisible(s.getStartPosition().lineNumber, RevealPreference.FromCloserSide, tx);
					m?.ensureModifiedLineIsVisible(s.getEndPosition().lineNumber, RevealPreference.FromCloserSide, tx);
				}
			});
		}));

		const unchangedRegions = this._diffModel.map((m, reader) => {
			const regions = m?.unchangedRegions.read(reader) ?? [];
			if (regions.length === 1 && regions[0].modifiedLineNumber === 1 && regions[0].lineCount === this._editors.modifiedModel.read(reader)?.getLineCount()) {
				return [];
			}
			return regions;
		});

		this.viewZones = derived(this, (reader) => {
			/** @description view Zones */
			const modifiedOutlineSource = this._modifiedOutlineSource.read(reader);
			if (!modifiedOutlineSource) { return { origViewZones: [], modViewZones: [] }; }

			const origViewZones: IObservableViewZone[] = [];
			const modViewZones: IObservableViewZone[] = [];
			const sideBySide = this._options.renderSideBySide.read(reader);

			const compactMode = this._options.compactMode.read(reader);

			const curUnchangedRegions = unchangedRegions.read(reader);
			for (let i = 0; i < curUnchangedRegions.length; i++) {
				const r = curUnchangedRegions[i];
				if (r.shouldHideControls(reader)) {
					continue;
				}

				if (compactMode && (i === 0 || i === curUnchangedRegions.length - 1)) {
					continue;
				}

				if (compactMode) {
					{
						const d = derived(this, reader => /** @description hiddenOriginalRangeStart */ r.getHiddenOriginalRange(reader).startLineNumber - 1);
						const origVz = new PlaceholderViewZone(d, 12);
						origViewZones.push(origVz);
						reader.store.add(new CompactCollapsedCodeOverlayWidget(
							this._editors.original,
							origVz,
							r,
							!sideBySide,
						));
					}
					{
						const d = derived(this, reader => /** @description hiddenModifiedRangeStart */ r.getHiddenModifiedRange(reader).startLineNumber - 1);
						const modViewZone = new PlaceholderViewZone(d, 12);
						modViewZones.push(modViewZone);
						reader.store.add(new CompactCollapsedCodeOverlayWidget(
							this._editors.modified,
							modViewZone,
							r,
						));
					}
				} else {
					{
						const d = derived(this, reader => /** @description hiddenOriginalRangeStart */ r.getHiddenOriginalRange(reader).startLineNumber - 1);
						const origVz = new PlaceholderViewZone(d, 24);
						origViewZones.push(origVz);
						reader.store.add(new CollapsedCodeOverlayWidget(
							this._editors.original,
							origVz,
							r,
							r.originalUnchangedRange,
							!sideBySide,
							modifiedOutlineSource,
							l => this._diffModel.get()!.ensureModifiedLineIsVisible(l, RevealPreference.FromBottom, undefined),
							this._options,
						));
					}
					{
						const d = derived(this, reader => /** @description hiddenModifiedRangeStart */ r.getHiddenModifiedRange(reader).startLineNumber - 1);
						const modViewZone = new PlaceholderViewZone(d, 24);
						modViewZones.push(modViewZone);
						reader.store.add(new CollapsedCodeOverlayWidget(
							this._editors.modified,
							modViewZone,
							r,
							r.modifiedUnchangedRange,
							false,
							modifiedOutlineSource,
							l => this._diffModel.get()!.ensureModifiedLineIsVisible(l, RevealPreference.FromBottom, undefined),
							this._options,
						));
					}
				}
			}

			return { origViewZones, modViewZones, };
		});


		const unchangedLinesDecoration: IModelDecorationOptions = {
			description: 'unchanged lines',
			className: 'diff-unchanged-lines',
			isWholeLine: true,
		};
		const unchangedLinesDecorationShow: IModelDecorationOptions = {
			description: 'Fold Unchanged',
			glyphMarginHoverMessage: new MarkdownString(undefined, { isTrusted: true, supportThemeIcons: true })
				.appendMarkdown(localize('foldUnchanged', 'Fold Unchanged Region')),
			glyphMarginClassName: 'fold-unchanged ' + ThemeIcon.asClassName(Codicon.fold),
			zIndex: 10001,
		};

		this._register(applyObservableDecorations(this._editors.original, derived(this, reader => {
			/** @description decorations */
			const curUnchangedRegions = unchangedRegions.read(reader);
			const result = curUnchangedRegions.map<IModelDeltaDecoration>(r => ({
				range: r.originalUnchangedRange.toInclusiveRange()!,
				options: unchangedLinesDecoration,
			}));
			for (const r of curUnchangedRegions) {
				if (r.shouldHideControls(reader)) {
					result.push({
						range: Range.fromPositions(new Position(r.originalLineNumber, 1)),
						options: unchangedLinesDecorationShow,
					});
				}
			}
			return result;
		})));

		this._register(applyObservableDecorations(this._editors.modified, derived(this, reader => {
			/** @description decorations */
			const curUnchangedRegions = unchangedRegions.read(reader);
			const result = curUnchangedRegions.map<IModelDeltaDecoration>(r => ({
				range: r.modifiedUnchangedRange.toInclusiveRange()!,
				options: unchangedLinesDecoration,
			}));
			for (const r of curUnchangedRegions) {
				if (r.shouldHideControls(reader)) {
					result.push({
						range: LineRange.ofLength(r.modifiedLineNumber, 1).toInclusiveRange()!,
						options: unchangedLinesDecorationShow,
					});
				}
			}
			return result;
		})));

		this._register(autorun((reader) => {
			/** @description update folded unchanged regions */
			const curUnchangedRegions = unchangedRegions.read(reader);
			this._isUpdatingHiddenAreas = true;
			try {
				this._editors.original.setHiddenAreas(curUnchangedRegions.map(r => r.getHiddenOriginalRange(reader).toInclusiveRange()).filter(isDefined));
				this._editors.modified.setHiddenAreas(curUnchangedRegions.map(r => r.getHiddenModifiedRange(reader).toInclusiveRange()).filter(isDefined));
			} finally {
				this._isUpdatingHiddenAreas = false;
			}
		}));

		this._register(this._editors.modified.onMouseUp(event => {
			if (!event.event.rightButton && event.target.position && event.target.element?.className.includes('fold-unchanged')) {
				const lineNumber = event.target.position.lineNumber;
				const model = this._diffModel.get();
				if (!model) { return; }
				const region = model.unchangedRegions.get().find(r => r.modifiedUnchangedRange.contains(lineNumber));
				if (!region) { return; }
				region.collapseAll(undefined);
				event.event.stopPropagation();
				event.event.preventDefault();
			}
		}));

		this._register(this._editors.original.onMouseUp(event => {
			if (!event.event.rightButton && event.target.position && event.target.element?.className.includes('fold-unchanged')) {
				const lineNumber = event.target.position.lineNumber;
				const model = this._diffModel.get();
				if (!model) { return; }
				const region = model.unchangedRegions.get().find(r => r.originalUnchangedRange.contains(lineNumber));
				if (!region) { return; }
				region.collapseAll(undefined);
				event.event.stopPropagation();
				event.event.preventDefault();
			}
		}));
	}
}

class CompactCollapsedCodeOverlayWidget extends ViewZoneOverlayWidget {
	private readonly _nodes = h('div.diff-hidden-lines-compact', [
		h('div.line-left', []),
		h('div.text@text', []),
		h('div.line-right', [])
	]);

	constructor(
		editor: ICodeEditor,
		_viewZone: PlaceholderViewZone,
		private readonly _unchangedRegion: UnchangedRegion,
		private readonly _hide: boolean = false,
	) {
		const root = h('div.diff-hidden-lines-widget');
		super(editor, _viewZone, root.root);
		root.root.appendChild(this._nodes.root);

		if (this._hide) {
			this._nodes.root.replaceChildren();
		}

		this._register(autorun(reader => {
			/** @description update labels */

			if (!this._hide) {
				const lineCount = this._unchangedRegion.getHiddenModifiedRange(reader).length;
				const linesHiddenText = localize('hiddenLines', '{0} hidden lines', lineCount);
				this._nodes.text.innerText = linesHiddenText;
			}
		}));
	}
}

class CollapsedCodeOverlayWidget extends ViewZoneOverlayWidget {
	private readonly _nodes = h('div.diff-hidden-lines', [
		h('div.top@top', { title: localize('diff.hiddenLines.top', 'Click or drag to show more above') }),
		h('div.center@content', { style: { display: 'flex' } }, [
			h('div@first', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: '0' } },
				[$('a', { title: localize('showUnchangedRegion', 'Show Unchanged Region'), role: 'button', onclick: () => { this._unchangedRegion.showAll(undefined); } },
					...renderLabelWithIcons('$(unfold)'))]
			),
			h('div@others', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } }),
		]),
		h('div.bottom@bottom', { title: localize('diff.bottom', 'Click or drag to show more below'), role: 'button' }),
	]);

	constructor(
		private readonly _editor: ICodeEditor,
		_viewZone: PlaceholderViewZone,
		private readonly _unchangedRegion: UnchangedRegion,
		private readonly _unchangedRegionRange: LineRange,
		private readonly _hide: boolean,
		private readonly _modifiedOutlineSource: IDiffEditorBreadcrumbsSource,
		private readonly _revealModifiedHiddenLine: (lineNumber: number) => void,
		private readonly _options: DiffEditorOptions,
	) {
		const root = h('div.diff-hidden-lines-widget');
		super(_editor, _viewZone, root.root);
		root.root.appendChild(this._nodes.root);

		if (!this._hide) {
			this._register(applyStyle(this._nodes.first, { width: observableCodeEditor(this._editor).layoutInfoContentLeft }));
		} else {
			reset(this._nodes.first);
		}

		this._register(autorun(reader => {
			/** @description Update CollapsedCodeOverlayWidget canMove* css classes */
			const isFullyRevealed = this._unchangedRegion.visibleLineCountTop.read(reader) + this._unchangedRegion.visibleLineCountBottom.read(reader) === this._unchangedRegion.lineCount;

			this._nodes.bottom.classList.toggle('canMoveTop', !isFullyRevealed);
			this._nodes.bottom.classList.toggle('canMoveBottom', this._unchangedRegion.visibleLineCountBottom.read(reader) > 0);
			this._nodes.top.classList.toggle('canMoveTop', this._unchangedRegion.visibleLineCountTop.read(reader) > 0);
			this._nodes.top.classList.toggle('canMoveBottom', !isFullyRevealed);
			const isDragged = this._unchangedRegion.isDragged.read(reader);
			const domNode = this._editor.getDomNode();
			if (domNode) {
				domNode.classList.toggle('draggingUnchangedRegion', !!isDragged);
				if (isDragged === 'top') {
					domNode.classList.toggle('canMoveTop', this._unchangedRegion.visibleLineCountTop.read(reader) > 0);
					domNode.classList.toggle('canMoveBottom', !isFullyRevealed);
				} else if (isDragged === 'bottom') {
					domNode.classList.toggle('canMoveTop', !isFullyRevealed);
					domNode.classList.toggle('canMoveBottom', this._unchangedRegion.visibleLineCountBottom.read(reader) > 0);
				} else {
					domNode.classList.toggle('canMoveTop', false);
					domNode.classList.toggle('canMoveBottom', false);
				}
			}
		}));

		const editor = this._editor;

		this._register(addDisposableListener(this._nodes.top, 'mousedown', e => {
			if (e.button !== 0) {
				return;
			}
			this._nodes.top.classList.toggle('dragging', true);
			this._nodes.root.classList.toggle('dragging', true);
			e.preventDefault();
			const startTop = e.clientY;
			let didMove = false;
			const cur = this._unchangedRegion.visibleLineCountTop.get();
			this._unchangedRegion.isDragged.set('top', undefined);

			const window = getWindow(this._nodes.top);

			const mouseMoveListener = addDisposableListener(window, 'mousemove', e => {
				const currentTop = e.clientY;
				const delta = currentTop - startTop;
				didMove = didMove || Math.abs(delta) > 2;
				const lineDelta = Math.round(delta / editor.getOption(EditorOption.lineHeight));
				const newVal = Math.max(0, Math.min(cur + lineDelta, this._unchangedRegion.getMaxVisibleLineCountTop()));
				this._unchangedRegion.visibleLineCountTop.set(newVal, undefined);
			});

			const mouseUpListener = addDisposableListener(window, 'mouseup', e => {
				if (!didMove) {
					this._unchangedRegion.showMoreAbove(this._options.hideUnchangedRegionsRevealLineCount.get(), undefined);
				}
				this._nodes.top.classList.toggle('dragging', false);
				this._nodes.root.classList.toggle('dragging', false);
				this._unchangedRegion.isDragged.set(undefined, undefined);
				mouseMoveListener.dispose();
				mouseUpListener.dispose();
			});
		}));

		this._register(addDisposableListener(this._nodes.bottom, 'mousedown', e => {
			if (e.button !== 0) {
				return;
			}
			this._nodes.bottom.classList.toggle('dragging', true);
			this._nodes.root.classList.toggle('dragging', true);
			e.preventDefault();
			const startTop = e.clientY;
			let didMove = false;
			const cur = this._unchangedRegion.visibleLineCountBottom.get();
			this._unchangedRegion.isDragged.set('bottom', undefined);

			const window = getWindow(this._nodes.bottom);

			const mouseMoveListener = addDisposableListener(window, 'mousemove', e => {
				const currentTop = e.clientY;
				const delta = currentTop - startTop;
				didMove = didMove || Math.abs(delta) > 2;
				const lineDelta = Math.round(delta / editor.getOption(EditorOption.lineHeight));
				const newVal = Math.max(0, Math.min(cur - lineDelta, this._unchangedRegion.getMaxVisibleLineCountBottom()));
				const top = this._unchangedRegionRange.endLineNumberExclusive > editor.getModel()!.getLineCount()
					? editor.getContentHeight()
					: editor.getTopForLineNumber(this._unchangedRegionRange.endLineNumberExclusive);
				this._unchangedRegion.visibleLineCountBottom.set(newVal, undefined);
				const top2 = this._unchangedRegionRange.endLineNumberExclusive > editor.getModel()!.getLineCount()
					? editor.getContentHeight()
					: editor.getTopForLineNumber(this._unchangedRegionRange.endLineNumberExclusive);
				editor.setScrollTop(editor.getScrollTop() + (top2 - top));
			});

			const mouseUpListener = addDisposableListener(window, 'mouseup', e => {
				this._unchangedRegion.isDragged.set(undefined, undefined);

				if (!didMove) {
					const top = editor.getTopForLineNumber(this._unchangedRegionRange.endLineNumberExclusive);

					this._unchangedRegion.showMoreBelow(this._options.hideUnchangedRegionsRevealLineCount.get(), undefined);
					const top2 = editor.getTopForLineNumber(this._unchangedRegionRange.endLineNumberExclusive);
					editor.setScrollTop(editor.getScrollTop() + (top2 - top));
				}
				this._nodes.bottom.classList.toggle('dragging', false);
				this._nodes.root.classList.toggle('dragging', false);
				mouseMoveListener.dispose();
				mouseUpListener.dispose();
			});
		}));

		this._register(autorun(reader => {
			/** @description update labels */

			const children: HTMLElement[] = [];
			if (!this._hide) {
				const lineCount = _unchangedRegion.getHiddenModifiedRange(reader).length;
				const linesHiddenText = localize('hiddenLines', '{0} hidden lines', lineCount);
				const span = $('span', { title: localize('diff.hiddenLines.expandAll', 'Double click to unfold') }, linesHiddenText);
				span.addEventListener('dblclick', e => {
					if (e.button !== 0) { return; }
					e.preventDefault();
					this._unchangedRegion.showAll(undefined);
				});
				children.push(span);

				const range = this._unchangedRegion.getHiddenModifiedRange(reader);
				const items = this._modifiedOutlineSource.getBreadcrumbItems(range, reader);

				if (items.length > 0) {
					children.push($('span', undefined, '\u00a0\u00a0|\u00a0\u00a0'));

					for (let i = 0; i < items.length; i++) {
						const item = items[i];
						const icon = SymbolKinds.toIcon(item.kind);
						const divItem = h('div.breadcrumb-item', {
							style: { display: 'flex', alignItems: 'center' },
						}, [
							renderIcon(icon),
							'\u00a0',
							item.name,
							...(i === items.length - 1
								? []
								: [renderIcon(Codicon.chevronRight)]
							)
						]).root;
						children.push(divItem);
						divItem.onclick = () => {
							this._revealModifiedHiddenLine(item.startLineNumber);
						};
					}
				}
			}

			reset(this._nodes.others, ...children);
		}));
	}
}

export interface IDiffEditorBreadcrumbsSource extends IDisposable {
	getBreadcrumbItems(startRange: LineRange, reader: IReader): { name: string; kind: SymbolKind; startLineNumber: number }[];

	getAt(lineNumber: number, reader: IReader): { name: string; kind: SymbolKind; startLineNumber: number }[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/features/movedBlocksLinesFeature.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/features/movedBlocksLinesFeature.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { h } from '../../../../../base/browser/dom.js';
import { ActionBar } from '../../../../../base/browser/ui/actionbar/actionbar.js';
import { Action } from '../../../../../base/common/actions.js';
import { booleanComparator, compareBy, numberComparator, tieBreakComparators } from '../../../../../base/common/arrays.js';
import { findMaxIdx } from '../../../../../base/common/arraysFind.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Disposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, autorun, autorunHandleChanges, autorunWithStore, constObservable, derived, observableFromEvent, observableSignalFromEvent, observableValue, recomputeInitiallyAndOnChange } from '../../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { ICodeEditor } from '../../../editorBrowser.js';
import { DiffEditorEditors } from '../components/diffEditorEditors.js';
import { DiffEditorViewModel } from '../diffEditorViewModel.js';
import { PlaceholderViewZone, ViewZoneOverlayWidget, applyStyle, applyViewZones } from '../utils.js';
import { EditorLayoutInfo } from '../../../../common/config/editorOptions.js';
import { LineRange } from '../../../../common/core/ranges/lineRange.js';
import { OffsetRange, OffsetRangeSet } from '../../../../common/core/ranges/offsetRange.js';
import { MovedText } from '../../../../common/diff/linesDiffComputer.js';
import { localize } from '../../../../../nls.js';

export class MovedBlocksLinesFeature extends Disposable {
	public static readonly movedCodeBlockPadding = 4;

	private readonly _element: SVGElement;
	private readonly _originalScrollTop;
	private readonly _modifiedScrollTop;
	private readonly _viewZonesChanged;

	public readonly width;

	constructor(
		private readonly _rootElement: HTMLElement,
		private readonly _diffModel: IObservable<DiffEditorViewModel | undefined>,
		private readonly _originalEditorLayoutInfo: IObservable<EditorLayoutInfo | null>,
		private readonly _modifiedEditorLayoutInfo: IObservable<EditorLayoutInfo | null>,
		private readonly _editors: DiffEditorEditors,
	) {
		super();
		this._originalScrollTop = observableFromEvent(this, this._editors.original.onDidScrollChange, () => this._editors.original.getScrollTop());
		this._modifiedScrollTop = observableFromEvent(this, this._editors.modified.onDidScrollChange, () => this._editors.modified.getScrollTop());
		this._viewZonesChanged = observableSignalFromEvent('onDidChangeViewZones', this._editors.modified.onDidChangeViewZones);
		this.width = observableValue(this, 0);
		this._modifiedViewZonesChangedSignal = observableSignalFromEvent('modified.onDidChangeViewZones', this._editors.modified.onDidChangeViewZones);
		this._originalViewZonesChangedSignal = observableSignalFromEvent('original.onDidChangeViewZones', this._editors.original.onDidChangeViewZones);
		this._state = derived(this, (reader) => {
			/** @description state */

			this._element.replaceChildren();
			const model = this._diffModel.read(reader);
			const moves = model?.diff.read(reader)?.movedTexts;
			if (!moves || moves.length === 0) {
				this.width.set(0, undefined);
				return;
			}

			this._viewZonesChanged.read(reader);

			const infoOrig = this._originalEditorLayoutInfo.read(reader);
			const infoMod = this._modifiedEditorLayoutInfo.read(reader);
			if (!infoOrig || !infoMod) {
				this.width.set(0, undefined);
				return;
			}

			this._modifiedViewZonesChangedSignal.read(reader);
			this._originalViewZonesChangedSignal.read(reader);

			const lines = moves.map((move) => {
				function computeLineStart(range: LineRange, editor: ICodeEditor) {
					const t1 = editor.getTopForLineNumber(range.startLineNumber, true);
					const t2 = editor.getTopForLineNumber(range.endLineNumberExclusive, true);
					return (t1 + t2) / 2;
				}

				const start = computeLineStart(move.lineRangeMapping.original, this._editors.original);
				const startOffset = this._originalScrollTop.read(reader);
				const end = computeLineStart(move.lineRangeMapping.modified, this._editors.modified);
				const endOffset = this._modifiedScrollTop.read(reader);

				const from = start - startOffset;
				const to = end - endOffset;

				const top = Math.min(start, end);
				const bottom = Math.max(start, end);

				return { range: new OffsetRange(top, bottom), from, to, fromWithoutScroll: start, toWithoutScroll: end, move };
			});

			lines.sort(tieBreakComparators(
				compareBy(l => l.fromWithoutScroll > l.toWithoutScroll, booleanComparator),
				compareBy(l => l.fromWithoutScroll > l.toWithoutScroll ? l.fromWithoutScroll : -l.toWithoutScroll, numberComparator)
			));

			const layout = LinesLayout.compute(lines.map(l => l.range));

			const padding = 10;
			const lineAreaLeft = infoOrig.verticalScrollbarWidth;
			const lineAreaWidth = (layout.getTrackCount() - 1) * 10 + padding * 2;
			const width = lineAreaLeft + lineAreaWidth + (infoMod.contentLeft - MovedBlocksLinesFeature.movedCodeBlockPadding);

			let idx = 0;
			for (const line of lines) {
				const track = layout.getTrack(idx);
				const verticalY = lineAreaLeft + padding + track * 10;

				const arrowHeight = 15;
				const arrowWidth = 15;
				const right = width;

				const rectWidth = infoMod.glyphMarginWidth + infoMod.lineNumbersWidth;
				const rectHeight = 18;
				const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
				rect.classList.add('arrow-rectangle');
				rect.setAttribute('x', `${right - rectWidth}`);
				rect.setAttribute('y', `${line.to - rectHeight / 2}`);
				rect.setAttribute('width', `${rectWidth}`);
				rect.setAttribute('height', `${rectHeight}`);
				this._element.appendChild(rect);

				const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

				const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

				path.setAttribute('d', `M ${0} ${line.from} L ${verticalY} ${line.from} L ${verticalY} ${line.to} L ${right - arrowWidth} ${line.to}`);
				path.setAttribute('fill', 'none');
				g.appendChild(path);

				const arrowRight = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
				arrowRight.classList.add('arrow');

				reader.store.add(autorun(reader => {
					path.classList.toggle('currentMove', line.move === model.activeMovedText.read(reader));
					arrowRight.classList.toggle('currentMove', line.move === model.activeMovedText.read(reader));
				}));

				arrowRight.setAttribute('points', `${right - arrowWidth},${line.to - arrowHeight / 2} ${right},${line.to} ${right - arrowWidth},${line.to + arrowHeight / 2}`);
				g.appendChild(arrowRight);

				this._element.appendChild(g);

				/*
				TODO@hediet
				path.addEventListener('mouseenter', () => {
					model.setHoveredMovedText(line.move);
				});
				path.addEventListener('mouseleave', () => {
					model.setHoveredMovedText(undefined);
				});*/

				idx++;
			}

			this.width.set(lineAreaWidth, undefined);
		});

		this._element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this._element.setAttribute('class', 'moved-blocks-lines');
		this._rootElement.appendChild(this._element);
		this._register(toDisposable(() => this._element.remove()));

		this._register(autorun(reader => {
			/** @description update moved blocks lines positioning */
			const info = this._originalEditorLayoutInfo.read(reader);
			const info2 = this._modifiedEditorLayoutInfo.read(reader);
			if (!info || !info2) {
				return;
			}

			this._element.style.left = `${info.width - info.verticalScrollbarWidth}px`;
			this._element.style.height = `${info.height}px`;
			this._element.style.width = `${info.verticalScrollbarWidth + info.contentLeft - MovedBlocksLinesFeature.movedCodeBlockPadding + this.width.read(reader)}px`;
		}));

		this._register(recomputeInitiallyAndOnChange(this._state));

		const movedBlockViewZones = derived(reader => {
			const model = this._diffModel.read(reader);
			const d = model?.diff.read(reader);
			if (!d) { return []; }
			return d.movedTexts.map(move => ({
				move,
				original: new PlaceholderViewZone(constObservable(move.lineRangeMapping.original.startLineNumber - 1), 18),
				modified: new PlaceholderViewZone(constObservable(move.lineRangeMapping.modified.startLineNumber - 1), 18),
			}));
		});

		this._register(applyViewZones(this._editors.original, movedBlockViewZones.map(zones => /** @description movedBlockViewZones.original */ zones.map(z => z.original))));
		this._register(applyViewZones(this._editors.modified, movedBlockViewZones.map(zones => /** @description movedBlockViewZones.modified */ zones.map(z => z.modified))));

		this._register(autorunWithStore((reader, store) => {
			const blocks = movedBlockViewZones.read(reader);
			for (const b of blocks) {
				store.add(new MovedBlockOverlayWidget(this._editors.original, b.original, b.move, 'original', this._diffModel.get()!));
				store.add(new MovedBlockOverlayWidget(this._editors.modified, b.modified, b.move, 'modified', this._diffModel.get()!));
			}
		}));

		const originalHasFocus = observableSignalFromEvent(
			'original.onDidFocusEditorWidget',
			e => this._editors.original.onDidFocusEditorWidget(() => setTimeout(() => e(undefined), 0))
		);
		const modifiedHasFocus = observableSignalFromEvent(
			'modified.onDidFocusEditorWidget',
			e => this._editors.modified.onDidFocusEditorWidget(() => setTimeout(() => e(undefined), 0))
		);

		let lastChangedEditor: 'original' | 'modified' = 'modified';

		this._register(autorunHandleChanges({
			changeTracker: {
				createChangeSummary: () => undefined,
				handleChange: (ctx, summary) => {
					if (ctx.didChange(originalHasFocus)) { lastChangedEditor = 'original'; }
					if (ctx.didChange(modifiedHasFocus)) { lastChangedEditor = 'modified'; }
					return true;
				}
			}
		}, reader => {
			/** @description MovedBlocksLines.setActiveMovedTextFromCursor */
			originalHasFocus.read(reader);
			modifiedHasFocus.read(reader);

			const m = this._diffModel.read(reader);
			if (!m) { return; }
			const diff = m.diff.read(reader);

			let movedText: MovedText | undefined = undefined;

			if (diff && lastChangedEditor === 'original') {
				const originalPos = this._editors.originalCursor.read(reader);
				if (originalPos) {
					movedText = diff.movedTexts.find(m => m.lineRangeMapping.original.contains(originalPos.lineNumber));
				}
			}

			if (diff && lastChangedEditor === 'modified') {
				const modifiedPos = this._editors.modifiedCursor.read(reader);
				if (modifiedPos) {
					movedText = diff.movedTexts.find(m => m.lineRangeMapping.modified.contains(modifiedPos.lineNumber));
				}
			}

			if (movedText !== m.movedTextToCompare.read(undefined)) {
				m.movedTextToCompare.set(undefined, undefined);
			}
			m.setActiveMovedText(movedText);
		}));
	}

	private readonly _modifiedViewZonesChangedSignal;
	private readonly _originalViewZonesChangedSignal;

	private readonly _state;
}

class LinesLayout {
	public static compute(lines: OffsetRange[]): LinesLayout {
		const setsPerTrack: OffsetRangeSet[] = [];
		const trackPerLineIdx: number[] = [];

		for (const line of lines) {
			let trackIdx = setsPerTrack.findIndex(set => !set.intersectsStrict(line));
			if (trackIdx === -1) {
				const maxTrackCount = 6;
				if (setsPerTrack.length >= maxTrackCount) {
					trackIdx = findMaxIdx(setsPerTrack, compareBy(set => set.intersectWithRangeLength(line), numberComparator));
				} else {
					trackIdx = setsPerTrack.length;
					setsPerTrack.push(new OffsetRangeSet());
				}
			}
			setsPerTrack[trackIdx].addRange(line);
			trackPerLineIdx.push(trackIdx);
		}

		return new LinesLayout(setsPerTrack.length, trackPerLineIdx);
	}

	private constructor(
		private readonly _trackCount: number,
		private readonly trackPerLineIdx: number[]
	) { }

	getTrack(lineIdx: number): number {
		return this.trackPerLineIdx[lineIdx];
	}

	getTrackCount(): number {
		return this._trackCount;
	}
}

class MovedBlockOverlayWidget extends ViewZoneOverlayWidget {
	private readonly _nodes = h('div.diff-moved-code-block', { style: { marginRight: '4px' } }, [
		h('div.text-content@textContent'),
		h('div.action-bar@actionBar'),
	]);

	constructor(
		private readonly _editor: ICodeEditor,
		_viewZone: PlaceholderViewZone,
		private readonly _move: MovedText,
		private readonly _kind: 'original' | 'modified',
		private readonly _diffModel: DiffEditorViewModel,
	) {
		const root = h('div.diff-hidden-lines-widget');
		super(_editor, _viewZone, root.root);
		root.root.appendChild(this._nodes.root);

		const editorLayout = observableFromEvent(this._editor.onDidLayoutChange, () => this._editor.getLayoutInfo());

		this._register(applyStyle(this._nodes.root, {
			paddingRight: editorLayout.map(l => l.verticalScrollbarWidth)
		}));

		let text: string;

		if (_move.changes.length > 0) {
			text = this._kind === 'original' ? localize(
				'codeMovedToWithChanges',
				'Code moved with changes to line {0}-{1}',
				this._move.lineRangeMapping.modified.startLineNumber,
				this._move.lineRangeMapping.modified.endLineNumberExclusive - 1,
			) : localize(
				'codeMovedFromWithChanges',
				'Code moved with changes from line {0}-{1}',
				this._move.lineRangeMapping.original.startLineNumber,
				this._move.lineRangeMapping.original.endLineNumberExclusive - 1,
			);
		} else {
			text = this._kind === 'original' ? localize(
				'codeMovedTo',
				'Code moved to line {0}-{1}',
				this._move.lineRangeMapping.modified.startLineNumber,
				this._move.lineRangeMapping.modified.endLineNumberExclusive - 1,
			) : localize(
				'codeMovedFrom',
				'Code moved from line {0}-{1}',
				this._move.lineRangeMapping.original.startLineNumber,
				this._move.lineRangeMapping.original.endLineNumberExclusive - 1,
			);
		}

		const actionBar = this._register(new ActionBar(this._nodes.actionBar, {
			highlightToggledItems: true,
		}));

		const caption = new Action(
			'',
			text,
			'',
			false,
		);
		actionBar.push(caption, { icon: false, label: true });

		const actionCompare = new Action(
			'',
			'Compare',
			ThemeIcon.asClassName(Codicon.compareChanges),
			true,
			() => {
				this._editor.focus();
				this._diffModel.movedTextToCompare.set(this._diffModel.movedTextToCompare.get() === _move ? undefined : this._move, undefined);
			},
		);
		this._register(autorun(reader => {
			const isActive = this._diffModel.movedTextToCompare.read(reader) === _move;
			actionCompare.checked = isActive;
		}));

		actionBar.push(actionCompare, { icon: false, label: true });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/features/overviewRulerFeature.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/features/overviewRulerFeature.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EventType, addDisposableListener, addStandardDisposableListener, h } from '../../../../../base/browser/dom.js';
import { createFastDomNode } from '../../../../../base/browser/fastDomNode.js';
import { IMouseWheelEvent } from '../../../../../base/browser/mouseEvent.js';
import { ScrollbarState } from '../../../../../base/browser/ui/scrollbar/scrollbarState.js';
import { Color } from '../../../../../base/common/color.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, autorun, autorunWithStore, derived, observableFromEvent, observableSignalFromEvent } from '../../../../../base/common/observable.js';
import { CodeEditorWidget } from '../../codeEditor/codeEditorWidget.js';
import { DiffEditorEditors } from '../components/diffEditorEditors.js';
import { DiffEditorViewModel } from '../diffEditorViewModel.js';
import { appendRemoveOnDispose } from '../utils.js';
import { EditorLayoutInfo, EditorOption } from '../../../../common/config/editorOptions.js';
import { LineRange } from '../../../../common/core/ranges/lineRange.js';
import { Position } from '../../../../common/core/position.js';
import { OverviewRulerZone } from '../../../../common/viewModel/overviewZoneManager.js';
import { defaultInsertColor, defaultRemoveColor, diffInserted, diffOverviewRulerInserted, diffOverviewRulerRemoved, diffRemoved } from '../../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';

export class OverviewRulerFeature extends Disposable {
	private static readonly ONE_OVERVIEW_WIDTH = 15;
	public static readonly ENTIRE_DIFF_OVERVIEW_WIDTH = this.ONE_OVERVIEW_WIDTH * 2;
	public readonly width = OverviewRulerFeature.ENTIRE_DIFF_OVERVIEW_WIDTH;

	constructor(
		private readonly _editors: DiffEditorEditors,
		private readonly _rootElement: HTMLElement,
		private readonly _diffModel: IObservable<DiffEditorViewModel | undefined>,
		private readonly _rootWidth: IObservable<number>,
		private readonly _rootHeight: IObservable<number>,
		private readonly _modifiedEditorLayoutInfo: IObservable<EditorLayoutInfo | null>,
		@IThemeService private readonly _themeService: IThemeService,
	) {
		super();

		const currentColorTheme = observableFromEvent(this._themeService.onDidColorThemeChange, () => this._themeService.getColorTheme());

		const currentColors = derived(reader => {
			/** @description colors */
			const theme = currentColorTheme.read(reader);
			const insertColor = theme.getColor(diffOverviewRulerInserted) || (theme.getColor(diffInserted) || defaultInsertColor).transparent(2);
			const removeColor = theme.getColor(diffOverviewRulerRemoved) || (theme.getColor(diffRemoved) || defaultRemoveColor).transparent(2);
			return { insertColor, removeColor };
		});

		const viewportDomElement = createFastDomNode(document.createElement('div'));
		viewportDomElement.setClassName('diffViewport');
		viewportDomElement.setPosition('absolute');

		const diffOverviewRoot = h('div.diffOverview', {
			style: { position: 'absolute', top: '0px', width: OverviewRulerFeature.ENTIRE_DIFF_OVERVIEW_WIDTH + 'px' }
		}).root;
		this._register(appendRemoveOnDispose(diffOverviewRoot, viewportDomElement.domNode));
		this._register(addStandardDisposableListener(diffOverviewRoot, EventType.POINTER_DOWN, (e) => {
			this._editors.modified.delegateVerticalScrollbarPointerDown(e);
		}));
		this._register(addDisposableListener(diffOverviewRoot, EventType.MOUSE_WHEEL, (e: IMouseWheelEvent) => {
			this._editors.modified.delegateScrollFromMouseWheelEvent(e);
		}, { passive: false }));
		this._register(appendRemoveOnDispose(this._rootElement, diffOverviewRoot));

		this._register(autorunWithStore((reader, store) => {
			/** @description recreate overview rules when model changes */
			const m = this._diffModel.read(reader);

			const originalOverviewRuler = this._editors.original.createOverviewRuler('original diffOverviewRuler');
			if (originalOverviewRuler) {
				store.add(originalOverviewRuler);
				store.add(appendRemoveOnDispose(diffOverviewRoot, originalOverviewRuler.getDomNode()));
			}

			const modifiedOverviewRuler = this._editors.modified.createOverviewRuler('modified diffOverviewRuler');
			if (modifiedOverviewRuler) {
				store.add(modifiedOverviewRuler);
				store.add(appendRemoveOnDispose(diffOverviewRoot, modifiedOverviewRuler.getDomNode()));
			}

			if (!originalOverviewRuler || !modifiedOverviewRuler) {
				// probably no model
				return;
			}

			const origViewZonesChanged = observableSignalFromEvent('viewZoneChanged', this._editors.original.onDidChangeViewZones);
			const modViewZonesChanged = observableSignalFromEvent('viewZoneChanged', this._editors.modified.onDidChangeViewZones);
			const origHiddenRangesChanged = observableSignalFromEvent('hiddenRangesChanged', this._editors.original.onDidChangeHiddenAreas);
			const modHiddenRangesChanged = observableSignalFromEvent('hiddenRangesChanged', this._editors.modified.onDidChangeHiddenAreas);

			store.add(autorun(reader => {
				/** @description set overview ruler zones */
				origViewZonesChanged.read(reader);
				modViewZonesChanged.read(reader);
				origHiddenRangesChanged.read(reader);
				modHiddenRangesChanged.read(reader);

				const colors = currentColors.read(reader);
				const diff = m?.diff.read(reader)?.mappings;

				function createZones(ranges: LineRange[], color: Color, editor: CodeEditorWidget) {
					const vm = editor._getViewModel();
					if (!vm) {
						return [];
					}
					return ranges
						.filter(d => d.length > 0)
						.map(r => {
							const start = vm.coordinatesConverter.convertModelPositionToViewPosition(new Position(r.startLineNumber, 1));
							const end = vm.coordinatesConverter.convertModelPositionToViewPosition(new Position(r.endLineNumberExclusive, 1));
							// By computing the lineCount, we won't ask the view model later for the bottom vertical position.
							// (The view model will take into account the alignment viewzones, which will give
							// modifications and deletetions always the same height.)
							const lineCount = end.lineNumber - start.lineNumber;
							return new OverviewRulerZone(start.lineNumber, end.lineNumber, lineCount, color.toString());
						});
				}

				const originalZones = createZones((diff || []).map(d => d.lineRangeMapping.original), colors.removeColor, this._editors.original);
				const modifiedZones = createZones((diff || []).map(d => d.lineRangeMapping.modified), colors.insertColor, this._editors.modified);
				originalOverviewRuler?.setZones(originalZones);
				modifiedOverviewRuler?.setZones(modifiedZones);
			}));

			store.add(autorun(reader => {
				/** @description layout overview ruler */
				const height = this._rootHeight.read(reader);
				const width = this._rootWidth.read(reader);
				const layoutInfo = this._modifiedEditorLayoutInfo.read(reader);
				if (layoutInfo) {
					const freeSpace = OverviewRulerFeature.ENTIRE_DIFF_OVERVIEW_WIDTH - 2 * OverviewRulerFeature.ONE_OVERVIEW_WIDTH;
					originalOverviewRuler.setLayout({
						top: 0,
						height: height,
						right: freeSpace + OverviewRulerFeature.ONE_OVERVIEW_WIDTH,
						width: OverviewRulerFeature.ONE_OVERVIEW_WIDTH,
					});
					modifiedOverviewRuler.setLayout({
						top: 0,
						height: height,
						right: 0,
						width: OverviewRulerFeature.ONE_OVERVIEW_WIDTH,
					});
					const scrollTop = this._editors.modifiedScrollTop.read(reader);
					const scrollHeight = this._editors.modifiedScrollHeight.read(reader);

					const scrollBarOptions = this._editors.modified.getOption(EditorOption.scrollbar);
					const state = new ScrollbarState(
						scrollBarOptions.verticalHasArrows ? scrollBarOptions.arrowSize : 0,
						scrollBarOptions.verticalScrollbarSize,
						0,
						layoutInfo.height,
						scrollHeight,
						scrollTop
					);

					viewportDomElement.setTop(state.getSliderPosition());
					viewportDomElement.setHeight(state.getSliderSize());
				} else {
					viewportDomElement.setTop(0);
					viewportDomElement.setHeight(0);
				}

				diffOverviewRoot.style.height = height + 'px';
				diffOverviewRoot.style.left = (width - OverviewRulerFeature.ENTIRE_DIFF_OVERVIEW_WIDTH) + 'px';
				viewportDomElement.setWidth(OverviewRulerFeature.ENTIRE_DIFF_OVERVIEW_WIDTH);
			}));
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/features/revertButtonsFeature.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/features/revertButtonsFeature.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener, h, EventType } from '../../../../../base/browser/dom.js';
import { renderIcon } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Disposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, autorunWithStore, derived } from '../../../../../base/common/observable.js';
import { IGlyphMarginWidget, IGlyphMarginWidgetPosition } from '../../../editorBrowser.js';
import { DiffEditorEditors } from '../components/diffEditorEditors.js';
import { DiffEditorOptions } from '../diffEditorOptions.js';
import { DiffEditorViewModel } from '../diffEditorViewModel.js';
import { DiffEditorWidget } from '../diffEditorWidget.js';
import { LineRange, LineRangeSet } from '../../../../common/core/ranges/lineRange.js';
import { Range } from '../../../../common/core/range.js';
import { LineRangeMapping, RangeMapping } from '../../../../common/diff/rangeMapping.js';
import { GlyphMarginLane } from '../../../../common/model.js';
import { localize } from '../../../../../nls.js';

const emptyArr: never[] = [];

export class RevertButtonsFeature extends Disposable {
	constructor(
		private readonly _editors: DiffEditorEditors,
		private readonly _diffModel: IObservable<DiffEditorViewModel | undefined>,
		private readonly _options: DiffEditorOptions,
		private readonly _widget: DiffEditorWidget
	) {
		super();

		this._register(autorunWithStore((reader, store) => {
			if (!this._options.shouldRenderOldRevertArrows.read(reader)) { return; }
			const model = this._diffModel.read(reader);
			const diff = model?.diff.read(reader);
			if (!model || !diff) { return; }
			if (model.movedTextToCompare.read(reader)) { return; }

			const glyphWidgetsModified: IGlyphMarginWidget[] = [];

			const selectedDiffs = this._selectedDiffs.read(reader);
			const selectedDiffsSet = new Set(selectedDiffs.map(d => d.mapping));

			if (selectedDiffs.length > 0) {
				// The button to revert the selection
				const selections = this._editors.modifiedSelections.read(reader);

				const btn = store.add(new RevertButton(
					selections[selections.length - 1].positionLineNumber,
					this._widget,
					selectedDiffs.flatMap(d => d.rangeMappings),
					true
				));
				this._editors.modified.addGlyphMarginWidget(btn);
				glyphWidgetsModified.push(btn);
			}

			for (const m of diff.mappings) {
				if (selectedDiffsSet.has(m)) { continue; }
				if (!m.lineRangeMapping.modified.isEmpty && m.lineRangeMapping.innerChanges) {
					const btn = store.add(new RevertButton(
						m.lineRangeMapping.modified.startLineNumber,
						this._widget,
						m.lineRangeMapping,
						false
					));
					this._editors.modified.addGlyphMarginWidget(btn);
					glyphWidgetsModified.push(btn);
				}
			}

			store.add(toDisposable(() => {
				for (const w of glyphWidgetsModified) {
					this._editors.modified.removeGlyphMarginWidget(w);
				}
			}));
		}));
	}

	private readonly _selectedDiffs = derived(this, (reader) => {
		/** @description selectedDiffs */
		const model = this._diffModel.read(reader);
		const diff = model?.diff.read(reader);
		// Return `emptyArr` because it is a constant. [] is always a new array and would trigger a change.
		if (!diff) { return emptyArr; }

		const selections = this._editors.modifiedSelections.read(reader);
		if (selections.every(s => s.isEmpty())) { return emptyArr; }

		const selectedLineNumbers = new LineRangeSet(selections.map(s => LineRange.fromRangeInclusive(s)));

		const selectedMappings = diff.mappings.filter(m =>
			m.lineRangeMapping.innerChanges && selectedLineNumbers.intersects(m.lineRangeMapping.modified)
		);
		const result = selectedMappings.map(mapping => ({
			mapping,
			rangeMappings: mapping.lineRangeMapping.innerChanges!.filter(
				c => selections.some(s => Range.areIntersecting(c.modifiedRange, s))
			)
		}));
		if (result.length === 0 || result.every(r => r.rangeMappings.length === 0)) { return emptyArr; }
		return result;
	});
}

export class RevertButton extends Disposable implements IGlyphMarginWidget {
	public static counter = 0;

	private readonly _id: string;

	getId(): string { return this._id; }

	private readonly _domNode;

	constructor(
		private readonly _lineNumber: number,
		private readonly _widget: DiffEditorWidget,
		private readonly _diffs: RangeMapping[] | LineRangeMapping,
		private readonly _revertSelection: boolean,
	) {
		super();
		this._id = `revertButton${RevertButton.counter++}`;
		this._domNode = h('div.revertButton', {
			title: this._revertSelection
				? localize('revertSelectedChanges', 'Revert Selected Changes')
				: localize('revertChange', 'Revert Change')
		},
			[renderIcon(Codicon.arrowRight)]
		).root;


		this._register(addDisposableListener(this._domNode, EventType.MOUSE_DOWN, e => {
			// don't prevent context menu from showing up
			if (e.button !== 2) {
				e.stopPropagation();
				e.preventDefault();
			}
		}));

		this._register(addDisposableListener(this._domNode, EventType.MOUSE_UP, e => {
			e.stopPropagation();
			e.preventDefault();
		}));

		this._register(addDisposableListener(this._domNode, EventType.CLICK, (e) => {
			if (this._diffs instanceof LineRangeMapping) {
				this._widget.revert(this._diffs);
			} else {
				this._widget.revertRangeMappings(this._diffs);
			}
			e.stopPropagation();
			e.preventDefault();
		}));
	}

	/**
	 * Get the dom node of the glyph widget.
	 */
	getDomNode(): HTMLElement {
		return this._domNode;
	}

	/**
	 * Get the placement of the glyph widget.
	 */
	getPosition(): IGlyphMarginWidgetPosition {
		return {
			lane: GlyphMarginLane.Right,
			range: {
				startColumn: 1,
				startLineNumber: this._lineNumber,
				endColumn: 1,
				endLineNumber: this._lineNumber,
			},
			zIndex: 10001,
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/utils/editorGutter.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/utils/editorGutter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { h, reset } from '../../../../../base/browser/dom.js';
import { Disposable, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, IObservable, IReader, ISettableObservable, observableFromEvent, observableSignal, observableSignalFromEvent, observableValue, transaction } from '../../../../../base/common/observable.js';
import { CodeEditorWidget } from '../../codeEditor/codeEditorWidget.js';
import { LineRange } from '../../../../common/core/ranges/lineRange.js';
import { OffsetRange } from '../../../../common/core/ranges/offsetRange.js';

export class EditorGutter<T extends IGutterItemInfo = IGutterItemInfo> extends Disposable {
	private readonly scrollTop;
	private readonly isScrollTopZero;
	private readonly modelAttached;

	private readonly editorOnDidChangeViewZones;
	private readonly editorOnDidContentSizeChange;
	private readonly domNodeSizeChanged;

	constructor(
		private readonly _editor: CodeEditorWidget,
		private readonly _domNode: HTMLElement,
		private readonly itemProvider: IGutterItemProvider<T>
	) {
		super();
		this.scrollTop = observableFromEvent(this,
			this._editor.onDidScrollChange,
			(e) => /** @description editor.onDidScrollChange */ this._editor.getScrollTop()
		);
		this.isScrollTopZero = this.scrollTop.map((scrollTop) => /** @description isScrollTopZero */ scrollTop === 0);
		this.modelAttached = observableFromEvent(this,
			this._editor.onDidChangeModel,
			(e) => /** @description editor.onDidChangeModel */ this._editor.hasModel()
		);
		this.editorOnDidChangeViewZones = observableSignalFromEvent('onDidChangeViewZones', this._editor.onDidChangeViewZones);
		this.editorOnDidContentSizeChange = observableSignalFromEvent('onDidContentSizeChange', this._editor.onDidContentSizeChange);
		this.domNodeSizeChanged = observableSignal('domNodeSizeChanged');
		this.views = new Map<string, ManagedGutterItemView>();
		this._domNode.className = 'gutter monaco-editor';
		const scrollDecoration = this._domNode.appendChild(
			h('div.scroll-decoration', { role: 'presentation', ariaHidden: 'true', style: { width: '100%' } })
				.root
		);

		const o = new ResizeObserver(() => {
			transaction(tx => {
				/** @description ResizeObserver: size changed */
				this.domNodeSizeChanged.trigger(tx);
			});
		});
		o.observe(this._domNode);
		this._register(toDisposable(() => o.disconnect()));

		this._register(autorun(reader => {
			/** @description update scroll decoration */
			scrollDecoration.className = this.isScrollTopZero.read(reader) ? '' : 'scroll-decoration';
		}));

		this._register(autorun(reader => /** @description EditorGutter.Render */ this.render(reader)));
	}

	override dispose(): void {
		super.dispose();

		reset(this._domNode);
	}

	private readonly views;

	private render(reader: IReader): void {
		if (!this.modelAttached.read(reader)) {
			return;
		}

		this.domNodeSizeChanged.read(reader);
		this.editorOnDidChangeViewZones.read(reader);
		this.editorOnDidContentSizeChange.read(reader);

		const scrollTop = this.scrollTop.read(reader);

		const visibleRanges = this._editor.getVisibleRanges();
		const unusedIds = new Set(this.views.keys());

		const viewRange = OffsetRange.ofStartAndLength(0, this._domNode.clientHeight);

		if (!viewRange.isEmpty) {
			for (const visibleRange of visibleRanges) {
				const visibleRange2 = new LineRange(
					visibleRange.startLineNumber,
					visibleRange.endLineNumber + 1
				);

				const gutterItems = this.itemProvider.getIntersectingGutterItems(
					visibleRange2,
					reader
				);

				transaction(tx => {
					/** EditorGutter.render */

					for (const gutterItem of gutterItems) {
						if (!gutterItem.range.intersect(visibleRange2)) {
							continue;
						}

						unusedIds.delete(gutterItem.id);
						let view = this.views.get(gutterItem.id);
						if (!view) {
							const viewDomNode = document.createElement('div');
							this._domNode.appendChild(viewDomNode);
							const gutterItemObs = observableValue('item', gutterItem);
							const itemView = this.itemProvider.createView(
								gutterItemObs,
								viewDomNode
							);
							view = new ManagedGutterItemView(gutterItemObs, itemView, viewDomNode);
							this.views.set(gutterItem.id, view);
						} else {
							view.item.set(gutterItem, tx);
						}

						const top =
							gutterItem.range.startLineNumber <= this._editor.getModel()!.getLineCount()
								? this._editor.getTopForLineNumber(gutterItem.range.startLineNumber, true) - scrollTop
								: gutterItem.range.startLineNumber > 1
									? this._editor.getBottomForLineNumber(gutterItem.range.startLineNumber - 1, false) - scrollTop
									: 0;
						const bottom =
							gutterItem.range.endLineNumberExclusive === 1 ?
								Math.max(top, this._editor.getTopForLineNumber(gutterItem.range.startLineNumber, false) - scrollTop)
								: Math.max(top, this._editor.getBottomForLineNumber(gutterItem.range.endLineNumberExclusive - 1, true) - scrollTop);

						const height = bottom - top;
						view.domNode.style.top = `${top}px`;
						view.domNode.style.height = `${height}px`;

						view.gutterItemView.layout(OffsetRange.ofStartAndLength(top, height), viewRange);
					}
				});
			}
		}

		for (const id of unusedIds) {
			const view = this.views.get(id)!;
			view.gutterItemView.dispose();
			view.domNode.remove();
			this.views.delete(id);
		}
	}
}

class ManagedGutterItemView {
	constructor(
		public readonly item: ISettableObservable<IGutterItemInfo>,
		public readonly gutterItemView: IGutterItemView,
		public readonly domNode: HTMLDivElement,
	) { }
}

export interface IGutterItemProvider<TItem extends IGutterItemInfo> {
	getIntersectingGutterItems(range: LineRange, reader: IReader): TItem[];

	createView(item: IObservable<TItem>, target: HTMLElement): IGutterItemView;
}

export interface IGutterItemInfo {
	id: string;
	range: LineRange;
}

export interface IGutterItemView extends IDisposable {
	layout(itemRange: OffsetRange, viewRange: OffsetRange): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/markdownRenderer/browser/editorMarkdownCodeBlockRenderer.ts]---
Location: vscode-main/src/vs/editor/browser/widget/markdownRenderer/browser/editorMarkdownCodeBlockRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isHTMLElement } from '../../../../../base/browser/dom.js';
import { createTrustedTypesPolicy } from '../../../../../base/browser/trustedTypes.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IMarkdownCodeBlockRenderer, IMarkdownRendererExtraOptions } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import { EditorOption, IEditorOptions } from '../../../../common/config/editorOptions.js';
import { BareFontInfo } from '../../../../common/config/fontInfo.js';
import { createBareFontInfoFromRawSettings } from '../../../../common/config/fontInfoFromSettings.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../common/languages/modesRegistry.js';
import { tokenizeToString } from '../../../../common/languages/textToHtmlTokenizer.js';
import { applyFontInfo } from '../../../config/domFontInfo.js';
import { ICodeEditor, isCodeEditor } from '../../../editorBrowser.js';
import './renderedMarkdown.css';

/**
 * Renders markdown code blocks using the editor's tokenization and font settings.
 */
export class EditorMarkdownCodeBlockRenderer implements IMarkdownCodeBlockRenderer {

	private static _ttpTokenizer = createTrustedTypesPolicy('tokenizeToString', {
		createHTML(html: string) {
			return html;
		}
	});

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILanguageService private readonly _languageService: ILanguageService,
	) { }

	public async renderCodeBlock(languageAlias: string | undefined, value: string, options: IMarkdownRendererExtraOptions): Promise<HTMLElement> {
		const editor = isCodeEditor(options.context) ? options.context : undefined;

		// In markdown, it is possible that we stumble upon language aliases (e.g.js instead of javascript).
		// it is possible no alias is given in which case we fall back to the current editor lang
		let languageId: string | undefined | null;
		if (languageAlias) {
			languageId = this._languageService.getLanguageIdByLanguageName(languageAlias);
		} else if (editor) {
			languageId = editor.getModel()?.getLanguageId();
		}
		if (!languageId) {
			languageId = PLAINTEXT_LANGUAGE_ID;
		}
		const html = await tokenizeToString(this._languageService, value, languageId);

		const content = EditorMarkdownCodeBlockRenderer._ttpTokenizer ? EditorMarkdownCodeBlockRenderer._ttpTokenizer.createHTML(html) ?? html : html;

		const root = document.createElement('span');
		root.innerHTML = content as string;
		// eslint-disable-next-line no-restricted-syntax
		const codeElement = root.querySelector('.monaco-tokenized-source');
		if (!isHTMLElement(codeElement)) {
			return document.createElement('span');
		}

		applyFontInfo(codeElement, this.getFontInfo(editor));

		return root;
	}

	private getFontInfo(editor: ICodeEditor | undefined): BareFontInfo {
		// Use editor's font if we have one
		if (editor) {
			return editor.getOption(EditorOption.fontInfo);
		} else {
			// Otherwise use the global font settings.
			// Pass in fake pixel ratio of 1 since we only need the font info to apply font family
			return createBareFontInfoFromRawSettings({
				fontFamily: this._configurationService.getValue<IEditorOptions>('editor').fontFamily
			}, 1);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/markdownRenderer/browser/renderedMarkdown.css]---
Location: vscode-main/src/vs/editor/browser/widget/markdownRenderer/browser/renderedMarkdown.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .rendered-markdown kbd {
	background-color: var(--vscode-keybindingLabel-background);
	color: var(--vscode-keybindingLabel-foreground);
	border-style: solid;
	border-width: 1px;
	border-radius: 3px;
	border-color: var(--vscode-keybindingLabel-border);
	border-bottom-color: var(--vscode-keybindingLabel-bottomBorder);
	box-shadow: inset 0 -1px 0 var(--vscode-widget-shadow);
	vertical-align: middle;
	padding: 1px 3px;
}

.rendered-markdown li:has(input[type=checkbox]) {
	list-style-type: none;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/multiDiffEditor/colors.ts]---
Location: vscode-main/src/vs/editor/browser/widget/multiDiffEditor/colors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { registerColor, editorBackground } from '../../../../platform/theme/common/colorRegistry.js';

export const multiDiffEditorHeaderBackground = registerColor(
	'multiDiffEditor.headerBackground',
	{ dark: '#262626', light: 'tab.inactiveBackground', hcDark: 'tab.inactiveBackground', hcLight: 'tab.inactiveBackground', },
	localize('multiDiffEditor.headerBackground', 'The background color of the diff editor\'s header')
);

export const multiDiffEditorBackground = registerColor(
	'multiDiffEditor.background',
	editorBackground,
	localize('multiDiffEditor.background', 'The background color of the multi file diff editor')
);

export const multiDiffEditorBorder = registerColor(
	'multiDiffEditor.border',
	{ dark: 'sideBarSectionHeader.border', light: '#cccccc', hcDark: 'sideBarSectionHeader.border', hcLight: '#cccccc', },
	localize('multiDiffEditor.border', 'The border color of the multi file diff editor')
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/multiDiffEditor/diffEditorItemTemplate.ts]---
Location: vscode-main/src/vs/editor/browser/widget/multiDiffEditor/diffEditorItemTemplate.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { h } from '../../../../base/browser/dom.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { autorun, derived, globalTransaction, observableValue } from '../../../../base/common/observable.js';
import { createActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { MenuWorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService, type IScopedContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IDiffEditorOptions } from '../../../common/config/editorOptions.js';
import { OffsetRange } from '../../../common/core/ranges/offsetRange.js';
import { observableCodeEditor } from '../../observableCodeEditor.js';
import { DiffEditorWidget } from '../diffEditor/diffEditorWidget.js';
import { DocumentDiffItemViewModel } from './multiDiffEditorViewModel.js';
import { IObjectData, IPooledObject } from './objectPool.js';
import { ActionRunnerWithContext } from './utils.js';
import { IWorkbenchUIElementFactory } from './workbenchUIElementFactory.js';

export class TemplateData implements IObjectData {
	constructor(
		public readonly viewModel: DocumentDiffItemViewModel,
		public readonly deltaScrollVertical: (delta: number) => void,
	) { }


	getId(): unknown {
		return this.viewModel;
	}
}

export class DiffEditorItemTemplate extends Disposable implements IPooledObject<TemplateData> {
	private readonly _viewModel;

	private readonly _collapsed;

	private readonly _editorContentHeight;
	public readonly contentHeight;

	private readonly _modifiedContentWidth;
	private readonly _modifiedWidth;
	private readonly _originalContentWidth;
	private readonly _originalWidth;

	public readonly maxScroll;

	private readonly _elements;

	public readonly editor;

	private readonly isModifedFocused;
	private readonly isOriginalFocused;
	public readonly isFocused;

	private readonly _resourceLabel;

	private readonly _resourceLabel2;

	private readonly _outerEditorHeight: number;
	private readonly _contextKeyService: IScopedContextKeyService;

	constructor(
		private readonly _container: HTMLElement,
		private readonly _overflowWidgetsDomNode: HTMLElement,
		private readonly _workbenchUIElementFactory: IWorkbenchUIElementFactory,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IContextKeyService _parentContextKeyService: IContextKeyService,
	) {
		super();
		this._viewModel = observableValue<DocumentDiffItemViewModel | undefined>(this, undefined);
		this._collapsed = derived(this, reader => this._viewModel.read(reader)?.collapsed.read(reader));
		this._editorContentHeight = observableValue<number>(this, 500);
		this.contentHeight = derived(this, reader => {
			const h = this._collapsed.read(reader) ? 0 : this._editorContentHeight.read(reader);
			return h + this._outerEditorHeight;
		});
		this._modifiedContentWidth = observableValue<number>(this, 0);
		this._modifiedWidth = observableValue<number>(this, 0);
		this._originalContentWidth = observableValue<number>(this, 0);
		this._originalWidth = observableValue<number>(this, 0);
		this.maxScroll = derived(this, reader => {
			const scroll1 = this._modifiedContentWidth.read(reader) - this._modifiedWidth.read(reader);
			const scroll2 = this._originalContentWidth.read(reader) - this._originalWidth.read(reader);
			if (scroll1 > scroll2) {
				return { maxScroll: scroll1, width: this._modifiedWidth.read(reader) };
			} else {
				return { maxScroll: scroll2, width: this._originalWidth.read(reader) };
			}
		});
		this._elements = h('div.multiDiffEntry', [
			h('div.header@header', [
				h('div.header-content', [
					h('div.collapse-button@collapseButton'),
					h('div.file-path', [
						// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
						h('div.title.modified.show-file-icons@primaryPath', [] as any),
						h('div.status.deleted@status', ['R']),
						// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
						h('div.title.original.show-file-icons@secondaryPath', [] as any),
					]),
					h('div.actions@actions'),
				]),
			]),

			h('div.editorParent', [
				h('div.editorContainer@editor'),
			])
		]) as Record<string, HTMLElement>;
		this.editor = this._register(this._instantiationService.createInstance(DiffEditorWidget, this._elements.editor, {
			overflowWidgetsDomNode: this._overflowWidgetsDomNode,
			fixedOverflowWidgets: true
		}, {}));
		this.isModifedFocused = observableCodeEditor(this.editor.getModifiedEditor()).isFocused;
		this.isOriginalFocused = observableCodeEditor(this.editor.getOriginalEditor()).isFocused;
		this.isFocused = derived(this, reader => this.isModifedFocused.read(reader) || this.isOriginalFocused.read(reader));
		this._resourceLabel = this._workbenchUIElementFactory.createResourceLabel
			? this._register(this._workbenchUIElementFactory.createResourceLabel(this._elements.primaryPath))
			: undefined;
		this._resourceLabel2 = this._workbenchUIElementFactory.createResourceLabel
			? this._register(this._workbenchUIElementFactory.createResourceLabel(this._elements.secondaryPath))
			: undefined;
		this._dataStore = this._register(new DisposableStore());
		this._headerHeight = 40;
		this._lastScrollTop = -1;
		this._isSettingScrollTop = false;

		const btn = new Button(this._elements.collapseButton, {});

		this._register(autorun(reader => {
			btn.element.className = '';
			btn.icon = this._collapsed.read(reader) ? Codicon.chevronRight : Codicon.chevronDown;
		}));
		this._register(btn.onDidClick(() => {
			this._viewModel.get()?.collapsed.set(!this._collapsed.get(), undefined);
		}));

		this._register(autorun(reader => {
			this._elements.editor.style.display = this._collapsed.read(reader) ? 'none' : 'block';
		}));

		this._register(this.editor.getModifiedEditor().onDidLayoutChange(e => {
			const width = this.editor.getModifiedEditor().getLayoutInfo().contentWidth;
			this._modifiedWidth.set(width, undefined);
		}));

		this._register(this.editor.getOriginalEditor().onDidLayoutChange(e => {
			const width = this.editor.getOriginalEditor().getLayoutInfo().contentWidth;
			this._originalWidth.set(width, undefined);
		}));

		this._register(this.editor.onDidContentSizeChange(e => {
			globalTransaction(tx => {
				this._editorContentHeight.set(e.contentHeight, tx);
				this._modifiedContentWidth.set(this.editor.getModifiedEditor().getContentWidth(), tx);
				this._originalContentWidth.set(this.editor.getOriginalEditor().getContentWidth(), tx);
			});
		}));

		this._register(this.editor.getOriginalEditor().onDidScrollChange(e => {
			if (this._isSettingScrollTop) {
				return;
			}

			if (!e.scrollTopChanged || !this._data) {
				return;
			}
			const delta = e.scrollTop - this._lastScrollTop;
			this._data.deltaScrollVertical(delta);
		}));

		this._register(autorun(reader => {
			const isActive = this._viewModel.read(reader)?.isActive.read(reader);
			this._elements.root.classList.toggle('active', isActive);
		}));

		this._container.appendChild(this._elements.root);
		this._outerEditorHeight = this._headerHeight;

		this._contextKeyService = this._register(_parentContextKeyService.createScoped(this._elements.actions));
		const instantiationService = this._register(this._instantiationService.createChild(new ServiceCollection([IContextKeyService, this._contextKeyService])));
		this._register(instantiationService.createInstance(MenuWorkbenchToolBar, this._elements.actions, MenuId.MultiDiffEditorFileToolbar, {
			actionRunner: this._register(new ActionRunnerWithContext(() => (this._viewModel.get()?.modifiedUri ?? this._viewModel.get()?.originalUri))),
			menuOptions: {
				shouldForwardArgs: true,
			},
			toolbarOptions: { primaryGroup: g => g.startsWith('navigation') },
			actionViewItemProvider: (action, options) => createActionViewItem(instantiationService, action, options),
		}));
	}

	public setScrollLeft(left: number): void {
		if (this._modifiedContentWidth.get() - this._modifiedWidth.get() > this._originalContentWidth.get() - this._originalWidth.get()) {
			this.editor.getModifiedEditor().setScrollLeft(left);
		} else {
			this.editor.getOriginalEditor().setScrollLeft(left);
		}
	}

	private readonly _dataStore;

	private _data: TemplateData | undefined;

	public setData(data: TemplateData | undefined): void {
		this._data = data;
		function updateOptions(options: IDiffEditorOptions): IDiffEditorOptions {
			return {
				...options,
				scrollBeyondLastLine: false,
				hideUnchangedRegions: {
					enabled: true,
				},
				scrollbar: {
					vertical: 'hidden',
					horizontal: 'hidden',
					handleMouseWheel: false,
					useShadows: false,
				},
				renderOverviewRuler: false,
				fixedOverflowWidgets: true,
				overviewRulerBorder: false,
			};
		}

		if (!data) {
			globalTransaction(tx => {
				this._viewModel.set(undefined, tx);
				this.editor.setDiffModel(null, tx);
				this._dataStore.clear();
			});
			return;
		}

		const value = data.viewModel.documentDiffItem;

		globalTransaction(tx => {
			this._resourceLabel?.setUri(data.viewModel.modifiedUri ?? data.viewModel.originalUri!, { strikethrough: data.viewModel.modifiedUri === undefined });

			let isRenamed = false;
			let isDeleted = false;
			let isAdded = false;
			let flag = '';
			if (data.viewModel.modifiedUri && data.viewModel.originalUri && data.viewModel.modifiedUri.path !== data.viewModel.originalUri.path) {
				flag = 'R';
				isRenamed = true;
			} else if (!data.viewModel.modifiedUri) {
				flag = 'D';
				isDeleted = true;
			} else if (!data.viewModel.originalUri) {
				flag = 'A';
				isAdded = true;
			}
			this._elements.status.classList.toggle('renamed', isRenamed);
			this._elements.status.classList.toggle('deleted', isDeleted);
			this._elements.status.classList.toggle('added', isAdded);
			this._elements.status.innerText = flag;

			this._resourceLabel2?.setUri(isRenamed ? data.viewModel.originalUri : undefined, { strikethrough: true });

			this._dataStore.clear();
			this._viewModel.set(data.viewModel, tx);
			this.editor.setDiffModel(data.viewModel.diffEditorViewModelRef, tx);
			this.editor.updateOptions(updateOptions(value.options ?? {}));
		});
		if (value.onOptionsDidChange) {
			this._dataStore.add(value.onOptionsDidChange(() => {
				this.editor.updateOptions(updateOptions(value.options ?? {}));
			}));
		}
		data.viewModel.isAlive.recomputeInitiallyAndOnChange(this._dataStore, value => {
			if (!value) {
				this.setData(undefined);
			}
		});

		if (data.viewModel.documentDiffItem.contextKeys) {
			for (const [key, value] of Object.entries(data.viewModel.documentDiffItem.contextKeys)) {
				this._contextKeyService.createKey(key, value);
			}
		}
	}

	private readonly _headerHeight;

	private _lastScrollTop;
	private _isSettingScrollTop;

	public render(verticalRange: OffsetRange, width: number, editorScroll: number, viewPort: OffsetRange): void {
		this._elements.root.style.visibility = 'visible';
		this._elements.root.style.top = `${verticalRange.start}px`;
		this._elements.root.style.height = `${verticalRange.length}px`;
		this._elements.root.style.width = `${width}px`;
		this._elements.root.style.position = 'absolute';

		// For sticky scroll
		const maxDelta = verticalRange.length - this._headerHeight;
		const delta = Math.max(0, Math.min(viewPort.start - verticalRange.start, maxDelta));
		this._elements.header.style.transform = `translateY(${delta}px)`;

		globalTransaction(tx => {
			this.editor.layout({
				width: width - 2 * 8 - 2 * 1,
				height: verticalRange.length - this._outerEditorHeight,
			});
		});
		try {
			this._isSettingScrollTop = true;
			this._lastScrollTop = editorScroll;
			this.editor.getOriginalEditor().setScrollTop(editorScroll);
		} finally {
			this._isSettingScrollTop = false;
		}

		this._elements.header.classList.toggle('shadow', delta > 0 || editorScroll > 0);
		this._elements.header.classList.toggle('collapsed', delta === maxDelta);
	}

	public hide(): void {
		this._elements.root.style.top = `-100000px`;
		this._elements.root.style.visibility = 'hidden'; // Some editor parts are still visible
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/multiDiffEditor/model.ts]---
Location: vscode-main/src/vs/editor/browser/widget/multiDiffEditor/model.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, IValueWithChangeEvent } from '../../../../base/common/event.js';
import { RefCounted } from '../diffEditor/utils.js';
import { IDiffEditorOptions } from '../../../common/config/editorOptions.js';
import { ITextModel } from '../../../common/model.js';
import { ContextKeyValue } from '../../../../platform/contextkey/common/contextkey.js';

export interface IMultiDiffEditorModel {
	readonly documents: IValueWithChangeEvent<readonly RefCounted<IDocumentDiffItem>[] | 'loading'>;
	readonly contextKeys?: Record<string, ContextKeyValue>;
}

export interface IDocumentDiffItem {
	/**
	 * undefined if the file was created.
	 */
	readonly original: ITextModel | undefined;

	/**
	 * undefined if the file was deleted.
	 */
	readonly modified: ITextModel | undefined;
	readonly options?: IDiffEditorOptions;
	readonly onOptionsDidChange?: Event<void>;
	readonly contextKeys?: Record<string, ContextKeyValue>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/multiDiffEditor/multiDiffEditorViewModel.ts]---
Location: vscode-main/src/vs/editor/browser/widget/multiDiffEditor/multiDiffEditorViewModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable, ITransaction, constObservable, derived, derivedObservableWithWritableCache, mapObservableArrayCached, observableFromValueWithChangeEvent, observableValue, transaction } from '../../../../base/common/observable.js';
import { URI } from '../../../../base/common/uri.js';
import { ContextKeyValue } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IDiffEditorOptions } from '../../../common/config/editorOptions.js';
import { Selection } from '../../../common/core/selection.js';
import { IDiffEditorViewModel } from '../../../common/editorCommon.js';
import { IModelService } from '../../../common/services/model.js';
import { DiffEditorOptions } from '../diffEditor/diffEditorOptions.js';
import { DiffEditorViewModel } from '../diffEditor/diffEditorViewModel.js';
import { RefCounted } from '../diffEditor/utils.js';
import { IDocumentDiffItem, IMultiDiffEditorModel } from './model.js';

export class MultiDiffEditorViewModel extends Disposable {
	private readonly _documents: IObservable<readonly RefCounted<IDocumentDiffItem>[] | 'loading'>;

	private readonly _documentsArr;

	public readonly isLoading;

	public readonly items: IObservable<readonly DocumentDiffItemViewModel[]>;

	public readonly focusedDiffItem;
	public readonly activeDiffItem;

	public async waitForDiffs(): Promise<void> {
		for (const d of this.items.get()) {
			await d.diffEditorViewModel.waitForDiff();
		}
	}

	public collapseAll(): void {
		transaction(tx => {
			for (const d of this.items.get()) {
				d.collapsed.set(true, tx);
			}
		});
	}

	public expandAll(): void {
		transaction(tx => {
			for (const d of this.items.get()) {
				d.collapsed.set(false, tx);
			}
		});
	}

	public get contextKeys(): Record<string, ContextKeyValue> | undefined {
		return this.model.contextKeys;
	}

	constructor(
		public readonly model: IMultiDiffEditorModel,
		private readonly _instantiationService: IInstantiationService,
	) {
		super();
		this._documents = observableFromValueWithChangeEvent(this.model, this.model.documents);
		this._documentsArr = derived(this, reader => {
			const result = this._documents.read(reader);
			if (result === 'loading') { return []; }
			return result;
		});
		this.isLoading = derived(this, reader => this._documents.read(reader) === 'loading');
		this.items = mapObservableArrayCached(
			this,
			this._documentsArr,
			(d, store) => store.add(this._instantiationService.createInstance(DocumentDiffItemViewModel, d, this))
		).recomputeInitiallyAndOnChange(this._store);
		this.focusedDiffItem = derived(this, reader => this.items.read(reader).find(i => i.isFocused.read(reader)));
		this.activeDiffItem = derivedObservableWithWritableCache<DocumentDiffItemViewModel | undefined>(this,
			(reader, lastValue) => this.focusedDiffItem.read(reader) ?? (lastValue && this.items.read(reader).indexOf(lastValue) !== -1) ? lastValue : undefined
		);
	}
}

export class DocumentDiffItemViewModel extends Disposable {
	/**
	 * The diff editor view model keeps its inner objects alive.
	*/
	public readonly diffEditorViewModelRef: RefCounted<IDiffEditorViewModel>;
	public get diffEditorViewModel(): IDiffEditorViewModel {
		return this.diffEditorViewModelRef.object;
	}
	public readonly collapsed = observableValue<boolean>(this, false);

	public readonly lastTemplateData = observableValue<{ contentHeight: number; selections: Selection[] | undefined }>(
		this,
		{ contentHeight: 500, selections: undefined, }
	);

	public get originalUri(): URI | undefined { return this.documentDiffItem.original?.uri; }
	public get modifiedUri(): URI | undefined { return this.documentDiffItem.modified?.uri; }

	public readonly isActive: IObservable<boolean> = derived(this, reader => this._editorViewModel.activeDiffItem.read(reader) === this);

	private readonly _isFocusedSource = observableValue<IObservable<boolean>>(this, constObservable(false));
	public readonly isFocused = derived(this, reader => this._isFocusedSource.read(reader).read(reader));

	public setIsFocused(source: IObservable<boolean>, tx: ITransaction | undefined): void {
		this._isFocusedSource.set(source, tx);
	}

	private readonly documentDiffItemRef: RefCounted<IDocumentDiffItem>;
	public get documentDiffItem(): IDocumentDiffItem {
		return this.documentDiffItemRef.object;
	}

	public readonly isAlive = observableValue<boolean>(this, true);

	constructor(
		documentDiffItem: RefCounted<IDocumentDiffItem>,
		private readonly _editorViewModel: MultiDiffEditorViewModel,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IModelService private readonly _modelService: IModelService,
	) {
		super();

		this._register(toDisposable(() => {
			this.isAlive.set(false, undefined);
		}));

		this.documentDiffItemRef = this._register(documentDiffItem.createNewRef(this));

		function updateOptions(options: IDiffEditorOptions): IDiffEditorOptions {
			return {
				...options,
				hideUnchangedRegions: {
					enabled: true,
				},
			};
		}

		const options = this._instantiationService.createInstance(DiffEditorOptions, updateOptions(this.documentDiffItem.options || {}));
		if (this.documentDiffItem.onOptionsDidChange) {
			this._register(this.documentDiffItem.onOptionsDidChange(() => {
				options.updateOptions(updateOptions(this.documentDiffItem.options || {}));
			}));
		}

		const diffEditorViewModelStore = new DisposableStore();
		const originalTextModel = this.documentDiffItem.original ?? diffEditorViewModelStore.add(this._modelService.createModel('', null));
		const modifiedTextModel = this.documentDiffItem.modified ?? diffEditorViewModelStore.add(this._modelService.createModel('', null));
		diffEditorViewModelStore.add(this.documentDiffItemRef.createNewRef(this));

		this.diffEditorViewModelRef = this._register(RefCounted.createWithDisposable(
			this._instantiationService.createInstance(DiffEditorViewModel, {
				original: originalTextModel,
				modified: modifiedTextModel,
			}, options),
			diffEditorViewModelStore,
			this
		));
	}

	public getKey(): string {
		return JSON.stringify([
			this.originalUri?.toString(),
			this.modifiedUri?.toString()
		]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/multiDiffEditor/multiDiffEditorWidget.ts]---
Location: vscode-main/src/vs/editor/browser/widget/multiDiffEditor/multiDiffEditorWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Dimension } from '../../../../base/browser/dom.js';
import { Event } from '../../../../base/common/event.js';
import { readHotReloadableExport } from '../../../../base/common/hotReloadHelpers.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { derived, observableValue, recomputeInitiallyAndOnChange } from '../../../../base/common/observable.js';
import { URI } from '../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { Range } from '../../../common/core/range.js';
import { IDiffEditor } from '../../../common/editorCommon.js';
import { ICodeEditor } from '../../editorBrowser.js';
import { DiffEditorWidget } from '../diffEditor/diffEditorWidget.js';
import './colors.js';
import { DiffEditorItemTemplate } from './diffEditorItemTemplate.js';
import { IDocumentDiffItem, IMultiDiffEditorModel } from './model.js';
import { MultiDiffEditorViewModel } from './multiDiffEditorViewModel.js';
import { IMultiDiffEditorViewState, IMultiDiffResourceId, MultiDiffEditorWidgetImpl } from './multiDiffEditorWidgetImpl.js';
import { IWorkbenchUIElementFactory } from './workbenchUIElementFactory.js';

export class MultiDiffEditorWidget extends Disposable {
	private readonly _dimension = observableValue<Dimension | undefined>(this, undefined);
	private readonly _viewModel = observableValue<MultiDiffEditorViewModel | undefined>(this, undefined);

	private readonly _widgetImpl = derived(this, (reader) => {
		readHotReloadableExport(DiffEditorItemTemplate, reader);
		return reader.store.add(this._instantiationService.createInstance((
			readHotReloadableExport(MultiDiffEditorWidgetImpl, reader)),
			this._element,
			this._dimension,
			this._viewModel,
			this._workbenchUIElementFactory,
		));
	});

	constructor(
		private readonly _element: HTMLElement,
		private readonly _workbenchUIElementFactory: IWorkbenchUIElementFactory,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();

		this._register(recomputeInitiallyAndOnChange(this._widgetImpl));
	}

	public reveal(resource: IMultiDiffResourceId, options?: RevealOptions): void {
		this._widgetImpl.get().reveal(resource, options);
	}

	public createViewModel(model: IMultiDiffEditorModel): MultiDiffEditorViewModel {
		return new MultiDiffEditorViewModel(model, this._instantiationService);
	}

	public setViewModel(viewModel: MultiDiffEditorViewModel | undefined): void {
		this._viewModel.set(viewModel, undefined);
	}

	public layout(dimension: Dimension): void {
		this._dimension.set(dimension, undefined);
	}

	private readonly _activeControl = derived(this, (reader) => this._widgetImpl.read(reader).activeControl.read(reader));

	public getActiveControl(): DiffEditorWidget | undefined {
		return this._activeControl.get();
	}

	public readonly onDidChangeActiveControl = Event.fromObservableLight(this._activeControl);

	public getViewState(): IMultiDiffEditorViewState {
		return this._widgetImpl.get().getViewState();
	}

	public setViewState(viewState: IMultiDiffEditorViewState): void {
		this._widgetImpl.get().setViewState(viewState);
	}

	public tryGetCodeEditor(resource: URI): { diffEditor: IDiffEditor; editor: ICodeEditor } | undefined {
		return this._widgetImpl.get().tryGetCodeEditor(resource);
	}

	public getRootElement(): HTMLElement {
		return this._widgetImpl.get().getRootElement();
	}

	public getContextKeyService(): IContextKeyService {
		return this._widgetImpl.get().getContextKeyService();
	}

	public getScopedInstantiationService(): IInstantiationService {
		return this._widgetImpl.get().getScopedInstantiationService();
	}

	public findDocumentDiffItem(resource: URI): IDocumentDiffItem | undefined {
		return this._widgetImpl.get().findDocumentDiffItem(resource);
	}

	public goToNextChange(): void {
		this._widgetImpl.get().goToNextChange();
	}

	public goToPreviousChange(): void {
		this._widgetImpl.get().goToPreviousChange();
	}
}

export interface RevealOptions {
	range?: Range;
	highlight: boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/multiDiffEditor/multiDiffEditorWidgetImpl.ts]---
Location: vscode-main/src/vs/editor/browser/widget/multiDiffEditor/multiDiffEditorWidgetImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Dimension, getWindow, h, scheduleAtNextAnimationFrame } from '../../../../base/browser/dom.js';
import { SmoothScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { compareBy, numberComparator } from '../../../../base/common/arrays.js';
import { findFirstMax } from '../../../../base/common/arraysFind.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
import { Disposable, IReference, toDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable, IReader, ITransaction, autorun, autorunWithStore, derived, disposableObservableValue, globalTransaction, observableFromEvent, observableValue, transaction } from '../../../../base/common/observable.js';
import { Scrollable, ScrollbarVisibility } from '../../../../base/common/scrollable.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { ContextKeyValue, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { OffsetRange } from '../../../common/core/ranges/offsetRange.js';
import { IRange } from '../../../common/core/range.js';
import { ISelection, Selection } from '../../../common/core/selection.js';
import { IDiffEditor } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ICodeEditor } from '../../editorBrowser.js';
import { ObservableElementSizeObserver } from '../diffEditor/utils.js';
import { DiffEditorItemTemplate, TemplateData } from './diffEditorItemTemplate.js';
import { IDocumentDiffItem } from './model.js';
import { DocumentDiffItemViewModel, MultiDiffEditorViewModel } from './multiDiffEditorViewModel.js';
import { RevealOptions } from './multiDiffEditorWidget.js';
import { ObjectPool } from './objectPool.js';
import './style.css';
import { IWorkbenchUIElementFactory } from './workbenchUIElementFactory.js';

export class MultiDiffEditorWidgetImpl extends Disposable {
	private readonly _scrollableElements;

	private readonly _scrollable;

	private readonly _scrollableElement;

	private readonly _elements;

	private readonly _sizeObserver;

	private readonly _objectPool;

	public readonly scrollTop;
	public readonly scrollLeft;

	private readonly _viewItemsInfo;

	private readonly _viewItems;

	private readonly _spaceBetweenPx;

	private readonly _totalHeight;
	public readonly activeControl;

	private readonly _contextKeyService;
	private readonly _instantiationService;

	constructor(
		private readonly _element: HTMLElement,
		private readonly _dimension: IObservable<Dimension | undefined>,
		private readonly _viewModel: IObservable<MultiDiffEditorViewModel | undefined>,
		private readonly _workbenchUIElementFactory: IWorkbenchUIElementFactory,
		@IContextKeyService private readonly _parentContextKeyService: IContextKeyService,
		@IInstantiationService private readonly _parentInstantiationService: IInstantiationService,
	) {
		super();
		this._scrollableElements = h('div.scrollContent', [
			h('div@content', {
				style: {
					overflow: 'hidden',
				}
			}),
			h('div.monaco-editor@overflowWidgetsDomNode', {
			}),
		]);
		this._scrollable = this._register(new Scrollable({
			forceIntegerValues: false,
			scheduleAtNextAnimationFrame: (cb) => scheduleAtNextAnimationFrame(getWindow(this._element), cb),
			smoothScrollDuration: 100,
		}));
		this._scrollableElement = this._register(new SmoothScrollableElement(this._scrollableElements.root, {
			vertical: ScrollbarVisibility.Auto,
			horizontal: ScrollbarVisibility.Auto,
			useShadows: false,
		}, this._scrollable));
		this._elements = h('div.monaco-component.multiDiffEditor', {}, [
			h('div', {}, [this._scrollableElement.getDomNode()]),
			h('div.placeholder@placeholder', {}, [h('div')]),
		]);
		this._sizeObserver = this._register(new ObservableElementSizeObserver(this._element, undefined));
		this._objectPool = this._register(new ObjectPool<TemplateData, DiffEditorItemTemplate>((data) => {
			const template = this._instantiationService.createInstance(
				DiffEditorItemTemplate,
				this._scrollableElements.content,
				this._scrollableElements.overflowWidgetsDomNode,
				this._workbenchUIElementFactory
			);
			template.setData(data);
			return template;
		}));
		this.scrollTop = observableFromEvent(this, this._scrollableElement.onScroll, () => /** @description scrollTop */ this._scrollableElement.getScrollPosition().scrollTop);
		this.scrollLeft = observableFromEvent(this, this._scrollableElement.onScroll, () => /** @description scrollLeft */ this._scrollableElement.getScrollPosition().scrollLeft);
		this._viewItemsInfo = derived<{ items: readonly VirtualizedViewItem[]; getItem: (viewModel: DocumentDiffItemViewModel) => VirtualizedViewItem }>(this,
			(reader) => {
				const vm = this._viewModel.read(reader);
				if (!vm) {
					return { items: [], getItem: _d => { throw new BugIndicatingError(); } };
				}
				const viewModels = vm.items.read(reader);
				const map = new Map<DocumentDiffItemViewModel, VirtualizedViewItem>();
				const items = viewModels.map(d => {
					const item = reader.store.add(new VirtualizedViewItem(d, this._objectPool, this.scrollLeft, delta => {
						this._scrollableElement.setScrollPosition({ scrollTop: this._scrollableElement.getScrollPosition().scrollTop + delta });
					}));
					const data = this._lastDocStates?.[item.getKey()];
					if (data) {
						transaction(tx => {
							item.setViewState(data, tx);
						});
					}
					map.set(d, item);
					return item;
				});
				return { items, getItem: d => map.get(d)! };
			}
		);
		this._viewItems = this._viewItemsInfo.map(this, items => items.items);
		this._spaceBetweenPx = 0;
		this._totalHeight = this._viewItems.map(this, (items, reader) => items.reduce((r, i) => r + i.contentHeight.read(reader) + this._spaceBetweenPx, 0));
		this.activeControl = derived(this, reader => {
			const activeDiffItem = this._viewModel.read(reader)?.activeDiffItem.read(reader);
			if (!activeDiffItem) { return undefined; }
			const viewItem = this._viewItemsInfo.read(reader).getItem(activeDiffItem);
			return viewItem.template.read(reader)?.editor;
		});
		this._contextKeyService = this._register(this._parentContextKeyService.createScoped(this._element));
		this._instantiationService = this._register(this._parentInstantiationService.createChild(
			new ServiceCollection([IContextKeyService, this._contextKeyService])
		));

		this._contextKeyService.createKey(EditorContextKeys.inMultiDiffEditor.key, true);

		this._lastDocStates = {};

		this._register(autorunWithStore((reader, store) => {
			const viewModel = this._viewModel.read(reader);
			if (viewModel && viewModel.contextKeys) {
				for (const [key, value] of Object.entries(viewModel.contextKeys)) {
					const contextKey = this._contextKeyService.createKey<ContextKeyValue>(key, undefined);
					contextKey.set(value);
					store.add(toDisposable(() => contextKey.reset()));
				}
			}
		}));

		const ctxAllCollapsed = this._parentContextKeyService.createKey<boolean>(EditorContextKeys.multiDiffEditorAllCollapsed.key, false);
		this._register(autorun((reader) => {
			const viewModel = this._viewModel.read(reader);
			if (viewModel) {
				const allCollapsed = viewModel.items.read(reader).every(item => item.collapsed.read(reader));
				ctxAllCollapsed.set(allCollapsed);
			}
		}));

		this._register(autorun((reader) => {
			/** @description Update widget dimension */
			const dimension = this._dimension.read(reader);
			this._sizeObserver.observe(dimension);
		}));

		const placeholderMessage = derived(reader => {
			const items = this._viewItems.read(reader);
			if (items.length > 0) { return undefined; }

			const vm = this._viewModel.read(reader);
			return (!vm || vm.isLoading.read(reader))
				? localize('loading', 'Loading...')
				: localize('noChangedFiles', 'No Changed Files');
		});

		this._register(autorun((reader) => {
			const message = placeholderMessage.read(reader);
			this._elements.placeholder.innerText = message ?? '';
			this._elements.placeholder.classList.toggle('visible', !!message);
		}));

		this._scrollableElements.content.style.position = 'relative';

		this._register(autorun((reader) => {
			/** @description Update scroll dimensions */
			const height = this._sizeObserver.height.read(reader);
			this._scrollableElements.root.style.height = `${height}px`;
			const totalHeight = this._totalHeight.read(reader);
			this._scrollableElements.content.style.height = `${totalHeight}px`;

			const width = this._sizeObserver.width.read(reader);

			let scrollWidth = width;
			const viewItems = this._viewItems.read(reader);
			const max = findFirstMax(viewItems, compareBy(i => i.maxScroll.read(reader).maxScroll, numberComparator));
			if (max) {
				const maxScroll = max.maxScroll.read(reader);
				scrollWidth = width + maxScroll.maxScroll;
			}

			this._scrollableElement.setScrollDimensions({
				width: width,
				height: height,
				scrollHeight: totalHeight,
				scrollWidth,
			});
		}));

		_element.replaceChildren(this._elements.root);
		this._register(toDisposable(() => {
			_element.replaceChildren();
		}));

		// Automatically select the first change in the first file when items are loaded
		this._register(autorun(reader => {
			/** @description Initialize first change */
			const viewModel = this._viewModel.read(reader);
			if (!viewModel) {
				return;
			}

			// Only initialize when loading is complete
			if (!viewModel.isLoading.read(reader)) {
				const items = viewModel.items.read(reader);
				if (items.length === 0) {
					return;
				}

				// Only initialize if there's no active item yet
				const activeDiffItem = viewModel.activeDiffItem.read(reader);
				if (activeDiffItem) {
					return;
				}

				// Navigate to the first change using the existing navigation logic
				this.goToNextChange();
			}
		}));

		this._register(this._register(autorun(reader => {
			/** @description Render all */
			globalTransaction(tx => {
				this.render(reader);
			});
		})));
	}

	public setScrollState(scrollState: { top?: number; left?: number }): void {
		this._scrollableElement.setScrollPosition({ scrollLeft: scrollState.left, scrollTop: scrollState.top });
	}

	public getRootElement(): HTMLElement {
		return this._elements.root;
	}

	public getContextKeyService(): IContextKeyService {
		return this._contextKeyService;
	}

	public getScopedInstantiationService(): IInstantiationService {
		return this._instantiationService;
	}
	public reveal(resource: IMultiDiffResourceId, options?: RevealOptions): void {
		const viewItems = this._viewItems.get();
		const index = viewItems.findIndex(
			(item) => item.viewModel.originalUri?.toString() === resource.original?.toString()
				&& item.viewModel.modifiedUri?.toString() === resource.modified?.toString()
		);
		if (index === -1) {
			throw new BugIndicatingError('Resource not found in diff editor');
		}
		const viewItem = viewItems[index];
		this._viewModel.get()!.activeDiffItem.setCache(viewItem.viewModel, undefined);

		let scrollTop = 0;
		for (let i = 0; i < index; i++) {
			scrollTop += viewItems[i].contentHeight.get() + this._spaceBetweenPx;
		}
		this._scrollableElement.setScrollPosition({ scrollTop });

		const diffEditor = viewItem.template.get()?.editor;
		const editor = 'original' in resource ? diffEditor?.getOriginalEditor() : diffEditor?.getModifiedEditor();
		if (editor && options?.range) {
			editor.revealRangeInCenter(options.range);
			highlightRange(editor, options.range);
		}
	}

	public getViewState(): IMultiDiffEditorViewState {
		return {
			scrollState: {
				top: this.scrollTop.get(),
				left: this.scrollLeft.get(),
			},
			docStates: Object.fromEntries(this._viewItems.get().map(i => [i.getKey(), i.getViewState()])),
		};
	}

	/** This accounts for documents that are not loaded yet. */
	private _lastDocStates: IMultiDiffEditorViewState['docStates'];

	public setViewState(viewState: IMultiDiffEditorViewState): void {
		this.setScrollState(viewState.scrollState);

		this._lastDocStates = viewState.docStates;

		transaction(tx => {
			/** setViewState */
			if (viewState.docStates) {
				for (const i of this._viewItems.get()) {
					const state = viewState.docStates[i.getKey()];
					if (state) {
						i.setViewState(state, tx);
					}
				}
			}
		});
	}

	public findDocumentDiffItem(resource: URI): IDocumentDiffItem | undefined {
		const item = this._viewItems.get().find(v =>
			v.viewModel.diffEditorViewModel.model.modified.uri.toString() === resource.toString()
			|| v.viewModel.diffEditorViewModel.model.original.uri.toString() === resource.toString()
		);
		return item?.viewModel.documentDiffItem;
	}

	public tryGetCodeEditor(resource: URI): { diffEditor: IDiffEditor; editor: ICodeEditor } | undefined {
		const item = this._viewItems.get().find(v =>
			v.viewModel.diffEditorViewModel.model.modified.uri.toString() === resource.toString()
			|| v.viewModel.diffEditorViewModel.model.original.uri.toString() === resource.toString()
		);
		const editor = item?.template.get()?.editor;
		if (!editor) {
			return undefined;
		}

		if (item.viewModel.diffEditorViewModel.model.modified.uri.toString() === resource.toString()) {
			return { diffEditor: editor, editor: editor.getModifiedEditor() };
		} else {
			return { diffEditor: editor, editor: editor.getOriginalEditor() };
		}
	}

	public goToNextChange(): void {
		this._navigateToChange('next');
	}

	public goToPreviousChange(): void {
		this._navigateToChange('previous');
	}

	private _navigateToChange(direction: 'next' | 'previous'): void {
		const viewItems = this._viewItems.get();
		if (viewItems.length === 0) {
			return;
		}

		const activeViewModel = this._viewModel.get()?.activeDiffItem.get();
		const currentIndex = activeViewModel ? viewItems.findIndex(v => v.viewModel === activeViewModel) : -1;

		// Start with first file if no active item
		if (currentIndex === -1) {
			this._goToFile(0, 'first');
			return;
		}

		// Try current file first - expand if collapsed
		const currentItem = viewItems[currentIndex];
		if (currentItem.viewModel.collapsed.get()) {
			currentItem.viewModel.collapsed.set(false, undefined);
		}

		const editor = currentItem.template.get()?.editor;
		if (editor?.getDiffComputationResult()?.changes2?.length) {
			const pos = editor.getModifiedEditor().getPosition()?.lineNumber || 1;
			const changes = editor.getDiffComputationResult()!.changes2!;
			const hasNext = direction === 'next' ? changes.some(c => c.modified.startLineNumber > pos) : changes.some(c => c.modified.endLineNumberExclusive <= pos);

			if (hasNext) {
				editor.goToDiff(direction);
				return;
			}
		}

		// Move to next/previous file
		const nextIndex = (currentIndex + (direction === 'next' ? 1 : -1) + viewItems.length) % viewItems.length;
		this._goToFile(nextIndex, direction === 'next' ? 'first' : 'last');
	}

	private _goToFile(index: number, position: 'first' | 'last'): void {
		const item = this._viewItems.get()[index];
		if (item.viewModel.collapsed.get()) {
			item.viewModel.collapsed.set(false, undefined);
		}

		this.reveal({ original: item.viewModel.originalUri, modified: item.viewModel.modifiedUri });

		const editor = item.template.get()?.editor;
		if (editor?.getDiffComputationResult()?.changes2?.length) {
			if (position === 'first') {
				editor.revealFirstDiff();
			} else {
				const lastChange = editor.getDiffComputationResult()!.changes2!.at(-1)!;
				const modifiedEditor = editor.getModifiedEditor();
				modifiedEditor.setPosition({ lineNumber: lastChange.modified.startLineNumber, column: 1 });
				modifiedEditor.revealLineInCenter(lastChange.modified.startLineNumber);
			}
		}
		editor?.focus();
	}

	private render(reader: IReader | undefined) {
		const scrollTop = this.scrollTop.read(reader);
		let contentScrollOffsetToScrollOffset = 0;
		let itemHeightSumBefore = 0;
		let itemContentHeightSumBefore = 0;
		const viewPortHeight = this._sizeObserver.height.read(reader);
		const contentViewPort = OffsetRange.ofStartAndLength(scrollTop, viewPortHeight);

		const width = this._sizeObserver.width.read(reader);

		for (const v of this._viewItems.read(reader)) {
			const itemContentHeight = v.contentHeight.read(reader);
			const itemHeight = Math.min(itemContentHeight, viewPortHeight);
			const itemRange = OffsetRange.ofStartAndLength(itemHeightSumBefore, itemHeight);
			const itemContentRange = OffsetRange.ofStartAndLength(itemContentHeightSumBefore, itemContentHeight);

			if (itemContentRange.isBefore(contentViewPort)) {
				contentScrollOffsetToScrollOffset -= itemContentHeight - itemHeight;
				v.hide();
			} else if (itemContentRange.isAfter(contentViewPort)) {
				v.hide();
			} else {
				const scroll = Math.max(0, Math.min(contentViewPort.start - itemContentRange.start, itemContentHeight - itemHeight));
				contentScrollOffsetToScrollOffset -= scroll;
				const viewPort = OffsetRange.ofStartAndLength(scrollTop + contentScrollOffsetToScrollOffset, viewPortHeight);
				v.render(itemRange, scroll, width, viewPort);
			}

			itemHeightSumBefore += itemHeight + this._spaceBetweenPx;
			itemContentHeightSumBefore += itemContentHeight + this._spaceBetweenPx;
		}

		this._scrollableElements.content.style.transform = `translateY(${-(scrollTop + contentScrollOffsetToScrollOffset)}px)`;
	}
}

function highlightRange(targetEditor: ICodeEditor, range: IRange) {
	const modelNow = targetEditor.getModel();
	const decorations = targetEditor.createDecorationsCollection([{ range, options: { description: 'symbol-navigate-action-highlight', className: 'symbolHighlight' } }]);
	setTimeout(() => {
		if (targetEditor.getModel() === modelNow) {
			decorations.clear();
		}
	}, 350);
}

export interface IMultiDiffEditorViewState {
	scrollState: { top: number; left: number };
	docStates?: Record<string, IMultiDiffDocState>;
}

interface IMultiDiffDocState {
	collapsed: boolean;
	selections?: ISelection[];
}

export interface IMultiDiffEditorOptions extends ITextEditorOptions {
	viewState?: IMultiDiffEditorOptionsViewState;
}

export interface IMultiDiffEditorOptionsViewState {
	revealData?: {
		resource: IMultiDiffResourceId;
		range?: IRange;
	};
}

export type IMultiDiffResourceId = { original: URI | undefined; modified: URI | undefined };

class VirtualizedViewItem extends Disposable {
	private readonly _templateRef = this._register(disposableObservableValue<IReference<DiffEditorItemTemplate> | undefined>(this, undefined));

	public readonly contentHeight = derived(this, reader =>
		this._templateRef.read(reader)?.object.contentHeight?.read(reader) ?? this.viewModel.lastTemplateData.read(reader).contentHeight
	);

	public readonly maxScroll = derived(this, reader => this._templateRef.read(reader)?.object.maxScroll.read(reader) ?? { maxScroll: 0, scrollWidth: 0 });

	public readonly template = derived(this, reader => this._templateRef.read(reader)?.object);
	private _isHidden = observableValue(this, false);

	private readonly _isFocused = derived(this, reader => this.template.read(reader)?.isFocused.read(reader) ?? false);

	constructor(
		public readonly viewModel: DocumentDiffItemViewModel,
		private readonly _objectPool: ObjectPool<TemplateData, DiffEditorItemTemplate>,
		private readonly _scrollLeft: IObservable<number>,
		private readonly _deltaScrollVertical: (delta: number) => void,
	) {
		super();

		this.viewModel.setIsFocused(this._isFocused, undefined);

		this._register(autorun((reader) => {
			const scrollLeft = this._scrollLeft.read(reader);
			this._templateRef.read(reader)?.object.setScrollLeft(scrollLeft);
		}));

		this._register(autorun(reader => {
			const ref = this._templateRef.read(reader);
			if (!ref) { return; }
			const isHidden = this._isHidden.read(reader);
			if (!isHidden) { return; }

			const isFocused = ref.object.isFocused.read(reader);
			if (isFocused) { return; }

			this._clear();
		}));
	}

	override dispose(): void {
		this._clear();
		super.dispose();
	}

	public override toString(): string {
		return `VirtualViewItem(${this.viewModel.documentDiffItem.modified?.uri.toString()})`;
	}

	public getKey(): string {
		return this.viewModel.getKey();
	}

	public getViewState(): IMultiDiffDocState {
		transaction(tx => {
			this._updateTemplateData(tx);
		});
		return {
			collapsed: this.viewModel.collapsed.get(),
			selections: this.viewModel.lastTemplateData.get().selections,
		};
	}

	public setViewState(viewState: IMultiDiffDocState, tx: ITransaction): void {
		this.viewModel.collapsed.set(viewState.collapsed, tx);

		this._updateTemplateData(tx);
		const data = this.viewModel.lastTemplateData.get();
		const selections = viewState.selections?.map(Selection.liftSelection);
		this.viewModel.lastTemplateData.set({
			...data,
			selections,
		}, tx);
		const ref = this._templateRef.get();
		if (ref) {
			if (selections) {
				ref.object.editor.setSelections(selections);
			}
		}
	}

	private _updateTemplateData(tx: ITransaction): void {
		const ref = this._templateRef.get();
		if (!ref) { return; }
		this.viewModel.lastTemplateData.set({
			contentHeight: ref.object.contentHeight.get(),
			selections: ref.object.editor.getSelections() ?? undefined,
		}, tx);
	}

	private _clear(): void {
		const ref = this._templateRef.get();
		if (!ref) { return; }
		transaction(tx => {
			this._updateTemplateData(tx);
			ref.object.hide();
			this._templateRef.set(undefined, tx);
		});
	}

	public hide(): void {
		this._isHidden.set(true, undefined);
	}

	public render(verticalSpace: OffsetRange, offset: number, width: number, viewPort: OffsetRange): void {
		this._isHidden.set(false, undefined);

		let ref = this._templateRef.get();
		if (!ref) {
			ref = this._objectPool.getUnusedObj(new TemplateData(this.viewModel, this._deltaScrollVertical));
			this._templateRef.set(ref, undefined);

			const selections = this.viewModel.lastTemplateData.get().selections;
			if (selections) {
				ref.object.editor.setSelections(selections);
			}
		}
		ref.object.render(verticalSpace, width, offset, viewPort);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/multiDiffEditor/objectPool.ts]---
Location: vscode-main/src/vs/editor/browser/widget/multiDiffEditor/objectPool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IDisposable, IReference } from '../../../../base/common/lifecycle.js';

export class ObjectPool<TData extends IObjectData, T extends IPooledObject<TData>> implements IDisposable {
	private readonly _unused = new Set<T>();
	private readonly _used = new Set<T>();
	private readonly _itemData = new Map<T, TData>();

	constructor(
		private readonly _create: (data: TData) => T,
	) { }

	public getUnusedObj(data: TData): IReference<T> {
		let obj: T;

		if (this._unused.size === 0) {
			obj = this._create(data);
			this._itemData.set(obj, data);
		} else {
			const values = [...this._unused.values()];
			obj = values.find(obj => this._itemData.get(obj)!.getId() === data.getId()) ?? values[0];
			this._unused.delete(obj);
			this._itemData.set(obj, data);
			obj.setData(data);
		}
		this._used.add(obj);
		return {
			object: obj,
			dispose: () => {
				this._used.delete(obj);
				if (this._unused.size > 5) {
					obj.dispose();
				} else {
					this._unused.add(obj);
				}
			}
		};
	}

	dispose(): void {
		for (const obj of this._used) {
			obj.dispose();
		}
		for (const obj of this._unused) {
			obj.dispose();
		}
		this._used.clear();
		this._unused.clear();
	}
}

export interface IObjectData {
	getId(): unknown;
}

export interface IPooledObject<TData> extends IDisposable {
	setData(data: TData): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/multiDiffEditor/style.css]---
Location: vscode-main/src/vs/editor/browser/widget/multiDiffEditor/style.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-component.multiDiffEditor {
	background: var(--vscode-multiDiffEditor-background);

	position: relative;

	height: 100%;
	width: 100%;

	overflow-y: hidden;

	> div {
		position: absolute;
		top: 0px;
		left: 0px;

		height: 100%;
		width: 100%;

		&.placeholder {
			visibility: hidden;

			&.visible {
				visibility: visible;
			}

			display: grid;
			place-items: center;
			place-content: center;
		}
	}

	> .multi-diff-root-floating-menu {
		position: absolute;
		right: 32px;
		bottom: 32px;
		top: auto;
		left: auto;
		height: auto;
		width: auto;
		padding: 4px 6px;
		color: var(--vscode-button-foreground);
		background-color: var(--vscode-button-background);
		border-radius: 4px;
		border: 1px solid var(--vscode-contrastBorder);
		display: flex;
		align-items: center;
		z-index: 10;
		box-shadow: 0 3px 12px var(--vscode-widget-shadow);
		overflow: hidden;
	}

	.multi-diff-root-floating-menu .action-item > .action-label {
		padding: 7px 8px;
		font-size: 15px;
		border-radius: 2px;
	}

	.multi-diff-root-floating-menu .action-item > .action-label.codicon {
		color: var(--vscode-button-foreground);
	}

	.multi-diff-root-floating-menu .action-item > .action-label.codicon:not(.separator) {
		padding-top: 6px;
		padding-bottom: 6px;
	}

	.multi-diff-root-floating-menu .action-item:first-child > .action-label {
		padding-left: 7px;
	}

	.multi-diff-root-floating-menu .action-item:last-child > .action-label {
		padding-right: 7px;
	}

	.multi-diff-root-floating-menu .action-item .action-label.separator {
		background-color: var(--vscode-button-separator);
	}


	.active {
		--vscode-multiDiffEditor-border: var(--vscode-focusBorder);
	}

	.multiDiffEntry {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;


		.collapse-button {
			margin: 0 5px;
			cursor: pointer;

			a {
				display: block;
			}
		}

		.header {
			z-index: 1000;
			background: var(--vscode-editor-background);

			&:not(.collapsed) .header-content {
				border-bottom: 1px solid var(--vscode-sideBarSectionHeader-border);
			}

			.header-content {
				margin: 8px 0px 0px 0px;
				padding: 4px 5px;

				border-top: 1px solid var(--vscode-multiDiffEditor-border);

				display: flex;
				align-items: center;

				color: var(--vscode-foreground);
				background: var(--vscode-multiDiffEditor-headerBackground);

				&.shadow {
					box-shadow: var(--vscode-scrollbar-shadow) 0px 6px 6px -6px;
				}

				.file-path {
					display: flex;
					flex: 1;
					min-width: 0;

					.title {
						font-size: 14px;
						line-height: 22px;

						&.original {
							flex: 1;
							min-width: 0;
							text-overflow: ellipsis;
						}
					}

					.status {
						font-weight: 600;
						opacity: 0.75;
						margin: 0px 10px;
						line-height: 22px;

						/*
							TODO@hediet: move colors from git extension to core!
						&.renamed {
							color: v ar(--vscode-gitDecoration-renamedResourceForeground);
						}

						&.deleted {
							color: v ar(--vscode-gitDecoration-deletedResourceForeground);
						}

						&.added {
							color: v ar(--vscode-gitDecoration-addedResourceForeground);
						}
						*/
					}
				}

				.actions {
					padding: 0 8px;
				}
			}


		}

		.editorParent {
			flex: 1;
			display: flex;
			flex-direction: column;

			border-bottom: 1px solid var(--vscode-multiDiffEditor-border);
			overflow: hidden;
		}

		.editorContainer {
			flex: 1;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/multiDiffEditor/utils.ts]---
Location: vscode-main/src/vs/editor/browser/widget/multiDiffEditor/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ActionRunner, IAction } from '../../../../base/common/actions.js';

export class ActionRunnerWithContext extends ActionRunner {
	constructor(private readonly _getContext: () => unknown) {
		super();
	}

	protected override runAction(action: IAction, _context?: unknown): Promise<void> {
		const ctx = this._getContext();
		return super.runAction(action, ctx);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/multiDiffEditor/workbenchUIElementFactory.ts]---
Location: vscode-main/src/vs/editor/browser/widget/multiDiffEditor/workbenchUIElementFactory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';

/**
 * This solves the problem that the editor layer cannot depend on the workbench layer.
 *
 * Maybe the multi diff editor widget should be moved to the workbench layer?
 * This would make monaco-editor consumption much more difficult though.
 */
export interface IWorkbenchUIElementFactory {
	createResourceLabel?(element: HTMLElement): IResourceLabel;
}

export interface IResourceLabel extends IDisposable {
	setUri(uri: URI | undefined, options?: IResourceLabelOptions): void;
}

export interface IResourceLabelOptions {
	strikethrough?: boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/coordinatesConverter.ts]---
Location: vscode-main/src/vs/editor/common/coordinatesConverter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Position } from './core/position.js';
import { Range } from './core/range.js';
import { ITextModel, PositionAffinity } from './model.js';

export interface ICoordinatesConverter {
	// View -> Model conversion and related methods
	convertViewPositionToModelPosition(viewPosition: Position): Position;
	convertViewRangeToModelRange(viewRange: Range): Range;
	validateViewPosition(viewPosition: Position, expectedModelPosition: Position): Position;
	validateViewRange(viewRange: Range, expectedModelRange: Range): Range;

	// Model -> View conversion and related methods
	/**
	 * @param allowZeroLineNumber Should it return 0 when there are hidden lines at the top and the position is in the hidden area?
	 * @param belowHiddenRanges When the model position is in a hidden area, should it return the first view position after or before?
	 */
	convertModelPositionToViewPosition(modelPosition: Position, affinity?: PositionAffinity, allowZeroLineNumber?: boolean, belowHiddenRanges?: boolean): Position;
	/**
	 * @param affinity Only has an effect if the range is empty.
	*/
	convertModelRangeToViewRange(modelRange: Range, affinity?: PositionAffinity): Range;
	modelPositionIsVisible(modelPosition: Position): boolean;
	getModelLineViewLineCount(modelLineNumber: number): number;
	getViewLineNumberOfModelPosition(modelLineNumber: number, modelColumn: number): number;
}

export class IdentityCoordinatesConverter implements ICoordinatesConverter {

	private readonly _model: ITextModel;

	constructor(model: ITextModel) {
		this._model = model;
	}

	private _validPosition(pos: Position): Position {
		return this._model.validatePosition(pos);
	}

	private _validRange(range: Range): Range {
		return this._model.validateRange(range);
	}

	// View -> Model conversion and related methods

	public convertViewPositionToModelPosition(viewPosition: Position): Position {
		return this._validPosition(viewPosition);
	}

	public convertViewRangeToModelRange(viewRange: Range): Range {
		return this._validRange(viewRange);
	}

	public validateViewPosition(_viewPosition: Position, expectedModelPosition: Position): Position {
		return this._validPosition(expectedModelPosition);
	}

	public validateViewRange(_viewRange: Range, expectedModelRange: Range): Range {
		return this._validRange(expectedModelRange);
	}

	// Model -> View conversion and related methods

	public convertModelPositionToViewPosition(modelPosition: Position): Position {
		return this._validPosition(modelPosition);
	}

	public convertModelRangeToViewRange(modelRange: Range): Range {
		return this._validRange(modelRange);
	}

	public modelPositionIsVisible(modelPosition: Position): boolean {
		const lineCount = this._model.getLineCount();
		if (modelPosition.lineNumber < 1 || modelPosition.lineNumber > lineCount) {
			// invalid arguments
			return false;
		}
		return true;
	}

	public modelRangeIsVisible(modelRange: Range): boolean {
		const lineCount = this._model.getLineCount();
		if (modelRange.startLineNumber < 1 || modelRange.startLineNumber > lineCount) {
			// invalid arguments
			return false;
		}
		if (modelRange.endLineNumber < 1 || modelRange.endLineNumber > lineCount) {
			// invalid arguments
			return false;
		}
		return true;
	}

	public getModelLineViewLineCount(modelLineNumber: number): number {
		return 1;
	}

	public getViewLineNumberOfModelPosition(modelLineNumber: number, modelColumn: number): number {
		return modelLineNumber;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/cursorCommon.ts]---
Location: vscode-main/src/vs/editor/common/cursorCommon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ConfigurationChangedEvent, EditorAutoClosingEditStrategy, EditorAutoClosingStrategy, EditorAutoIndentStrategy, EditorAutoSurroundStrategy, EditorOption } from './config/editorOptions.js';
import { LineTokens } from './tokens/lineTokens.js';
import { Position } from './core/position.js';
import { Range } from './core/range.js';
import { ISelection, Selection } from './core/selection.js';
import { ICommand } from './editorCommon.js';
import { IEditorConfiguration } from './config/editorConfiguration.js';
import { PositionAffinity, TextModelResolvedOptions } from './model.js';
import { AutoClosingPairs } from './languages/languageConfiguration.js';
import { ILanguageConfigurationService } from './languages/languageConfigurationRegistry.js';
import { createScopedLineTokens } from './languages/supports.js';
import { IElectricAction } from './languages/supports/electricCharacter.js';
import { CursorColumns } from './core/cursorColumns.js';
import { normalizeIndentation } from './core/misc/indentation.js';
import { InputMode } from './inputMode.js';

export interface IColumnSelectData {
	isReal: boolean;
	fromViewLineNumber: number;
	fromViewVisualColumn: number;
	toViewLineNumber: number;
	toViewVisualColumn: number;
}

/**
 * This is an operation type that will be recorded for undo/redo purposes.
 * The goal is to introduce an undo stop when the controller switches between different operation types.
 */
export const enum EditOperationType {
	Other = 0,
	DeletingLeft = 2,
	DeletingRight = 3,
	TypingOther = 4,
	TypingFirstSpace = 5,
	TypingConsecutiveSpace = 6,
}

export interface CharacterMap {
	[char: string]: string;
}

const autoCloseAlways = () => true;
const autoCloseNever = () => false;
const autoCloseBeforeWhitespace = (chr: string) => (chr === ' ' || chr === '\t');

export class CursorConfiguration {
	_cursorMoveConfigurationBrand: void = undefined;

	public readonly readOnly: boolean;
	public readonly tabSize: number;
	public readonly indentSize: number;
	public readonly insertSpaces: boolean;
	public readonly stickyTabStops: boolean;
	public readonly pageSize: number;
	public readonly lineHeight: number;
	public readonly typicalHalfwidthCharacterWidth: number;
	public readonly useTabStops: boolean;
	public readonly trimWhitespaceOnDelete: boolean;
	public readonly wordSeparators: string;
	public readonly emptySelectionClipboard: boolean;
	public readonly copyWithSyntaxHighlighting: boolean;
	public readonly multiCursorMergeOverlapping: boolean;
	public readonly multiCursorPaste: 'spread' | 'full';
	public readonly multiCursorLimit: number;
	public readonly autoClosingBrackets: EditorAutoClosingStrategy;
	public readonly autoClosingComments: EditorAutoClosingStrategy;
	public readonly autoClosingQuotes: EditorAutoClosingStrategy;
	public readonly autoClosingDelete: EditorAutoClosingEditStrategy;
	public readonly autoClosingOvertype: EditorAutoClosingEditStrategy;
	public readonly autoSurround: EditorAutoSurroundStrategy;
	public readonly autoIndent: EditorAutoIndentStrategy;
	public readonly autoClosingPairs: AutoClosingPairs;
	public readonly surroundingPairs: CharacterMap;
	public readonly blockCommentStartToken: string | null;
	public readonly shouldAutoCloseBefore: { quote: (ch: string) => boolean; bracket: (ch: string) => boolean; comment: (ch: string) => boolean };
	public readonly wordSegmenterLocales: string[];
	public readonly overtypeOnPaste: boolean;

	private readonly _languageId: string;
	private _electricChars: { [key: string]: boolean } | null;

	public static shouldRecreate(e: ConfigurationChangedEvent): boolean {
		return (
			e.hasChanged(EditorOption.layoutInfo)
			|| e.hasChanged(EditorOption.wordSeparators)
			|| e.hasChanged(EditorOption.emptySelectionClipboard)
			|| e.hasChanged(EditorOption.multiCursorMergeOverlapping)
			|| e.hasChanged(EditorOption.multiCursorPaste)
			|| e.hasChanged(EditorOption.multiCursorLimit)
			|| e.hasChanged(EditorOption.autoClosingBrackets)
			|| e.hasChanged(EditorOption.autoClosingComments)
			|| e.hasChanged(EditorOption.autoClosingQuotes)
			|| e.hasChanged(EditorOption.autoClosingDelete)
			|| e.hasChanged(EditorOption.autoClosingOvertype)
			|| e.hasChanged(EditorOption.autoSurround)
			|| e.hasChanged(EditorOption.useTabStops)
			|| e.hasChanged(EditorOption.trimWhitespaceOnDelete)
			|| e.hasChanged(EditorOption.fontInfo)
			|| e.hasChanged(EditorOption.readOnly)
			|| e.hasChanged(EditorOption.wordSegmenterLocales)
			|| e.hasChanged(EditorOption.overtypeOnPaste)
		);
	}

	constructor(
		languageId: string,
		modelOptions: TextModelResolvedOptions,
		configuration: IEditorConfiguration,
		public readonly languageConfigurationService: ILanguageConfigurationService
	) {
		this._languageId = languageId;

		const options = configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);
		const fontInfo = options.get(EditorOption.fontInfo);

		this.readOnly = options.get(EditorOption.readOnly);
		this.tabSize = modelOptions.tabSize;
		this.indentSize = modelOptions.indentSize;
		this.insertSpaces = modelOptions.insertSpaces;
		this.stickyTabStops = options.get(EditorOption.stickyTabStops);
		this.lineHeight = fontInfo.lineHeight;
		this.typicalHalfwidthCharacterWidth = fontInfo.typicalHalfwidthCharacterWidth;
		this.pageSize = Math.max(1, Math.floor(layoutInfo.height / this.lineHeight) - 2);
		this.useTabStops = options.get(EditorOption.useTabStops);
		this.trimWhitespaceOnDelete = options.get(EditorOption.trimWhitespaceOnDelete);
		this.wordSeparators = options.get(EditorOption.wordSeparators);
		this.emptySelectionClipboard = options.get(EditorOption.emptySelectionClipboard);
		this.copyWithSyntaxHighlighting = options.get(EditorOption.copyWithSyntaxHighlighting);
		this.multiCursorMergeOverlapping = options.get(EditorOption.multiCursorMergeOverlapping);
		this.multiCursorPaste = options.get(EditorOption.multiCursorPaste);
		this.multiCursorLimit = options.get(EditorOption.multiCursorLimit);
		this.autoClosingBrackets = options.get(EditorOption.autoClosingBrackets);
		this.autoClosingComments = options.get(EditorOption.autoClosingComments);
		this.autoClosingQuotes = options.get(EditorOption.autoClosingQuotes);
		this.autoClosingDelete = options.get(EditorOption.autoClosingDelete);
		this.autoClosingOvertype = options.get(EditorOption.autoClosingOvertype);
		this.autoSurround = options.get(EditorOption.autoSurround);
		this.autoIndent = options.get(EditorOption.autoIndent);
		this.wordSegmenterLocales = options.get(EditorOption.wordSegmenterLocales);
		this.overtypeOnPaste = options.get(EditorOption.overtypeOnPaste);

		this.surroundingPairs = {};
		this._electricChars = null;

		this.shouldAutoCloseBefore = {
			quote: this._getShouldAutoClose(languageId, this.autoClosingQuotes, true),
			comment: this._getShouldAutoClose(languageId, this.autoClosingComments, false),
			bracket: this._getShouldAutoClose(languageId, this.autoClosingBrackets, false),
		};

		this.autoClosingPairs = this.languageConfigurationService.getLanguageConfiguration(languageId).getAutoClosingPairs();

		const surroundingPairs = this.languageConfigurationService.getLanguageConfiguration(languageId).getSurroundingPairs();
		if (surroundingPairs) {
			for (const pair of surroundingPairs) {
				this.surroundingPairs[pair.open] = pair.close;
			}
		}

		const commentsConfiguration = this.languageConfigurationService.getLanguageConfiguration(languageId).comments;
		this.blockCommentStartToken = commentsConfiguration?.blockCommentStartToken ?? null;
	}

	public get electricChars() {
		if (!this._electricChars) {
			this._electricChars = {};
			const electricChars = this.languageConfigurationService.getLanguageConfiguration(this._languageId).electricCharacter?.getElectricCharacters();
			if (electricChars) {
				for (const char of electricChars) {
					this._electricChars[char] = true;
				}
			}
		}
		return this._electricChars;
	}

	public get inputMode(): 'insert' | 'overtype' {
		return InputMode.getInputMode();
	}

	/**
	 * Should return opening bracket type to match indentation with
	 */
	public onElectricCharacter(character: string, context: LineTokens, column: number): IElectricAction | null {
		const scopedLineTokens = createScopedLineTokens(context, column - 1);
		const electricCharacterSupport = this.languageConfigurationService.getLanguageConfiguration(scopedLineTokens.languageId).electricCharacter;
		if (!electricCharacterSupport) {
			return null;
		}
		return electricCharacterSupport.onElectricCharacter(character, scopedLineTokens, column - scopedLineTokens.firstCharOffset);
	}

	public normalizeIndentation(str: string): string {
		return normalizeIndentation(str, this.indentSize, this.insertSpaces);
	}

	private _getShouldAutoClose(languageId: string, autoCloseConfig: EditorAutoClosingStrategy, forQuotes: boolean): (ch: string) => boolean {
		switch (autoCloseConfig) {
			case 'beforeWhitespace':
				return autoCloseBeforeWhitespace;
			case 'languageDefined':
				return this._getLanguageDefinedShouldAutoClose(languageId, forQuotes);
			case 'always':
				return autoCloseAlways;
			case 'never':
				return autoCloseNever;
		}
	}

	private _getLanguageDefinedShouldAutoClose(languageId: string, forQuotes: boolean): (ch: string) => boolean {
		const autoCloseBeforeSet = this.languageConfigurationService.getLanguageConfiguration(languageId).getAutoCloseBeforeSet(forQuotes);
		return c => autoCloseBeforeSet.indexOf(c) !== -1;
	}

	/**
	 * Returns a visible column from a column.
	 * @see {@link CursorColumns}
	 */
	public visibleColumnFromColumn(model: ICursorSimpleModel, position: Position): number {
		return CursorColumns.visibleColumnFromColumn(model.getLineContent(position.lineNumber), position.column, this.tabSize);
	}

	/**
	 * Returns a visible column from a column.
	 * @see {@link CursorColumns}
	 */
	public columnFromVisibleColumn(model: ICursorSimpleModel, lineNumber: number, visibleColumn: number): number {
		const result = CursorColumns.columnFromVisibleColumn(model.getLineContent(lineNumber), visibleColumn, this.tabSize);

		const minColumn = model.getLineMinColumn(lineNumber);
		if (result < minColumn) {
			return minColumn;
		}

		const maxColumn = model.getLineMaxColumn(lineNumber);
		if (result > maxColumn) {
			return maxColumn;
		}

		return result;
	}
}

/**
 * Represents a simple model (either the model or the view model).
 */
export interface ICursorSimpleModel {
	getLineCount(): number;
	getLineContent(lineNumber: number): string;
	getLineMinColumn(lineNumber: number): number;
	getLineMaxColumn(lineNumber: number): number;
	getLineFirstNonWhitespaceColumn(lineNumber: number): number;
	getLineLastNonWhitespaceColumn(lineNumber: number): number;
	normalizePosition(position: Position, affinity: PositionAffinity): Position;

	/**
	 * Gets the column at which indentation stops at a given line.
	 * @internal
	 */
	getLineIndentColumn(lineNumber: number): number;
}

export type PartialCursorState = CursorState | PartialModelCursorState | PartialViewCursorState;

export class CursorState {
	_cursorStateBrand: void = undefined;

	public static fromModelState(modelState: SingleCursorState): PartialModelCursorState {
		return new PartialModelCursorState(modelState);
	}

	public static fromViewState(viewState: SingleCursorState): PartialViewCursorState {
		return new PartialViewCursorState(viewState);
	}

	public static fromModelSelection(modelSelection: ISelection): PartialModelCursorState {
		const selection = Selection.liftSelection(modelSelection);
		const modelState = new SingleCursorState(
			Range.fromPositions(selection.getSelectionStart()),
			SelectionStartKind.Simple, 0,
			selection.getPosition(), 0
		);
		return CursorState.fromModelState(modelState);
	}

	public static fromModelSelections(modelSelections: readonly ISelection[]): PartialModelCursorState[] {
		const states: PartialModelCursorState[] = [];
		for (let i = 0, len = modelSelections.length; i < len; i++) {
			states[i] = this.fromModelSelection(modelSelections[i]);
		}
		return states;
	}

	readonly modelState: SingleCursorState;
	readonly viewState: SingleCursorState;

	constructor(modelState: SingleCursorState, viewState: SingleCursorState) {
		this.modelState = modelState;
		this.viewState = viewState;
	}

	public equals(other: CursorState): boolean {
		return (this.viewState.equals(other.viewState) && this.modelState.equals(other.modelState));
	}
}

export class PartialModelCursorState {
	readonly modelState: SingleCursorState;
	readonly viewState: null;

	constructor(modelState: SingleCursorState) {
		this.modelState = modelState;
		this.viewState = null;
	}
}

export class PartialViewCursorState {
	readonly modelState: null;
	readonly viewState: SingleCursorState;

	constructor(viewState: SingleCursorState) {
		this.modelState = null;
		this.viewState = viewState;
	}
}

export const enum SelectionStartKind {
	Simple,
	Word,
	Line
}

/**
 * Represents the cursor state on either the model or on the view model.
 */
export class SingleCursorState {
	_singleCursorStateBrand: void = undefined;

	public readonly selection: Selection;

	constructor(
		public readonly selectionStart: Range,
		public readonly selectionStartKind: SelectionStartKind,
		public readonly selectionStartLeftoverVisibleColumns: number,
		public readonly position: Position,
		public readonly leftoverVisibleColumns: number,
	) {
		this.selection = SingleCursorState._computeSelection(this.selectionStart, this.position);
	}

	public equals(other: SingleCursorState) {
		return (
			this.selectionStartLeftoverVisibleColumns === other.selectionStartLeftoverVisibleColumns
			&& this.leftoverVisibleColumns === other.leftoverVisibleColumns
			&& this.selectionStartKind === other.selectionStartKind
			&& this.position.equals(other.position)
			&& this.selectionStart.equalsRange(other.selectionStart)
		);
	}

	public hasSelection(): boolean {
		return (!this.selection.isEmpty() || !this.selectionStart.isEmpty());
	}

	public move(inSelectionMode: boolean, lineNumber: number, column: number, leftoverVisibleColumns: number): SingleCursorState {
		if (inSelectionMode) {
			// move just position
			return new SingleCursorState(
				this.selectionStart,
				this.selectionStartKind,
				this.selectionStartLeftoverVisibleColumns,
				new Position(lineNumber, column),
				leftoverVisibleColumns
			);
		} else {
			// move everything
			return new SingleCursorState(
				new Range(lineNumber, column, lineNumber, column),
				SelectionStartKind.Simple,
				leftoverVisibleColumns,
				new Position(lineNumber, column),
				leftoverVisibleColumns
			);
		}
	}

	private static _computeSelection(selectionStart: Range, position: Position): Selection {
		if (selectionStart.isEmpty() || !position.isBeforeOrEqual(selectionStart.getStartPosition())) {
			return Selection.fromPositions(selectionStart.getStartPosition(), position);
		} else {
			return Selection.fromPositions(selectionStart.getEndPosition(), position);
		}
	}
}

export class EditOperationResult {
	_editOperationResultBrand: void = undefined;

	readonly type: EditOperationType;
	readonly commands: Array<ICommand | null>;
	readonly shouldPushStackElementBefore: boolean;
	readonly shouldPushStackElementAfter: boolean;

	constructor(
		type: EditOperationType,
		commands: Array<ICommand | null>,
		opts: {
			shouldPushStackElementBefore: boolean;
			shouldPushStackElementAfter: boolean;
		}
	) {
		this.type = type;
		this.commands = commands;
		this.shouldPushStackElementBefore = opts.shouldPushStackElementBefore;
		this.shouldPushStackElementAfter = opts.shouldPushStackElementAfter;
	}
}

export function isQuote(ch: string): boolean {
	return (ch === '\'' || ch === '"' || ch === '`');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/cursorEvents.ts]---
Location: vscode-main/src/vs/editor/common/cursorEvents.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Position } from './core/position.js';
import { Selection } from './core/selection.js';

/**
 * Describes the reason the cursor has changed its position.
 */
export const enum CursorChangeReason {
	/**
	 * Unknown or not set.
	 */
	NotSet = 0,
	/**
	 * A `model.setValue()` was called.
	 */
	ContentFlush = 1,
	/**
	 * The `model` has been changed outside of this cursor and the cursor recovers its position from associated markers.
	 */
	RecoverFromMarkers = 2,
	/**
	 * There was an explicit user gesture.
	 */
	Explicit = 3,
	/**
	 * There was a Paste.
	 */
	Paste = 4,
	/**
	 * There was an Undo.
	 */
	Undo = 5,
	/**
	 * There was a Redo.
	 */
	Redo = 6,
}
/**
 * An event describing that the cursor position has changed.
 */
export interface ICursorPositionChangedEvent {
	/**
	 * Primary cursor's position.
	 */
	readonly position: Position;
	/**
	 * Secondary cursors' position.
	 */
	readonly secondaryPositions: Position[];
	/**
	 * Reason.
	 */
	readonly reason: CursorChangeReason;
	/**
	 * Source of the call that caused the event.
	 */
	readonly source: string;
}
/**
 * An event describing that the cursor selection has changed.
 */
export interface ICursorSelectionChangedEvent {
	/**
	 * The primary selection.
	 */
	readonly selection: Selection;
	/**
	 * The secondary selections.
	 */
	readonly secondarySelections: Selection[];
	/**
	 * The model version id.
	 */
	readonly modelVersionId: number;
	/**
	 * The old selections.
	 */
	readonly oldSelections: Selection[] | null;
	/**
	 * The model version id the that `oldSelections` refer to.
	 */
	readonly oldModelVersionId: number;
	/**
	 * Source of the call that caused the event.
	 */
	readonly source: string;
	/**
	 * Reason.
	 */
	readonly reason: CursorChangeReason;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/editorAction.ts]---
Location: vscode-main/src/vs/editor/common/editorAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEditorAction } from './editorCommon.js';
import { ICommandMetadata } from '../../platform/commands/common/commands.js';
import { ContextKeyExpression, IContextKeyService } from '../../platform/contextkey/common/contextkey.js';

export class InternalEditorAction implements IEditorAction {

	constructor(
		public readonly id: string,
		public readonly label: string,
		public readonly alias: string,
		public readonly metadata: ICommandMetadata | undefined,
		private readonly _precondition: ContextKeyExpression | undefined,
		private readonly _run: (args: unknown) => Promise<void>,
		private readonly _contextKeyService: IContextKeyService
	) { }

	public isSupported(): boolean {
		return this._contextKeyService.contextMatchesRules(this._precondition);
	}

	public run(args: unknown): Promise<void> {
		if (!this.isSupported()) {
			return Promise.resolve(undefined);
		}

		return this._run(args);
	}
}
```

--------------------------------------------------------------------------------

````

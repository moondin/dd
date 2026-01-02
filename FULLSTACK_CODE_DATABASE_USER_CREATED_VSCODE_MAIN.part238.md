---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 238
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 238 of 552)

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

---[FILE: src/vs/editor/contrib/stickyScroll/browser/stickyScrollWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/stickyScroll/browser/stickyScrollWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { createTrustedTypesPolicy } from '../../../../base/browser/trustedTypes.js';
import { equals } from '../../../../base/common/arrays.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import './stickyScroll.css';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition, OverlayWidgetPositionPreference } from '../../../browser/editorBrowser.js';
import { getColumnOfNodeOffset } from '../../../browser/viewParts/viewLines/viewLine.js';
import { EmbeddedCodeEditorWidget } from '../../../browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { EditorLayoutInfo, EditorOption, RenderLineNumbersType } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { StringBuilder } from '../../../common/core/stringBuilder.js';
import { LineDecoration } from '../../../common/viewLayout/lineDecorations.js';
import { CharacterMapping, RenderLineInput, renderViewLine } from '../../../common/viewLayout/viewLineRenderer.js';
import { foldingCollapsedIcon, foldingExpandedIcon } from '../../folding/browser/foldingDecorations.js';
import { FoldingModel } from '../../folding/browser/foldingModel.js';
import { Emitter } from '../../../../base/common/event.js';
import { IViewModel } from '../../../common/viewModel.js';

export class StickyScrollWidgetState {
	constructor(
		readonly startLineNumbers: number[],
		readonly endLineNumbers: number[],
		readonly lastLineRelativePosition: number,
		readonly showEndForLine: number | null = null
	) { }

	equals(other: StickyScrollWidgetState | undefined): boolean {
		return !!other
			&& this.lastLineRelativePosition === other.lastLineRelativePosition
			&& this.showEndForLine === other.showEndForLine
			&& equals(this.startLineNumbers, other.startLineNumbers)
			&& equals(this.endLineNumbers, other.endLineNumbers);
	}

	static get Empty() {
		return new StickyScrollWidgetState([], [], 0);
	}
}

const _ttPolicy = createTrustedTypesPolicy('stickyScrollViewLayer', { createHTML: value => value });
const STICKY_INDEX_ATTR = 'data-sticky-line-index';
const STICKY_IS_LINE_ATTR = 'data-sticky-is-line';
const STICKY_IS_LINE_NUMBER_ATTR = 'data-sticky-is-line-number';
const STICKY_IS_FOLDING_ICON_ATTR = 'data-sticky-is-folding-icon';

export class StickyScrollWidget extends Disposable implements IOverlayWidget {

	private readonly _foldingIconStore = this._register(new DisposableStore());
	private readonly _rootDomNode: HTMLElement = document.createElement('div');
	private readonly _lineNumbersDomNode: HTMLElement = document.createElement('div');
	private readonly _linesDomNodeScrollable: HTMLElement = document.createElement('div');
	private readonly _linesDomNode: HTMLElement = document.createElement('div');

	private readonly _editor: ICodeEditor;

	private _state: StickyScrollWidgetState | undefined;
	private _lineHeight: number;
	private _renderedStickyLines: RenderedStickyLine[] = [];
	private _lineNumbers: number[] = [];
	private _lastLineRelativePosition: number = 0;
	private _minContentWidthInPx: number = 0;
	private _isOnGlyphMargin: boolean = false;
	private _height: number = -1;

	public get height(): number { return this._height; }

	private readonly _onDidChangeStickyScrollHeight = this._register(new Emitter<{ height: number }>());
	public readonly onDidChangeStickyScrollHeight = this._onDidChangeStickyScrollHeight.event;

	constructor(
		editor: ICodeEditor
	) {
		super();

		this._editor = editor;
		this._lineHeight = editor.getOption(EditorOption.lineHeight);
		this._lineNumbersDomNode.className = 'sticky-widget-line-numbers';
		this._lineNumbersDomNode.setAttribute('role', 'none');

		this._linesDomNode.className = 'sticky-widget-lines';
		this._linesDomNode.setAttribute('role', 'list');

		this._linesDomNodeScrollable.className = 'sticky-widget-lines-scrollable';
		this._linesDomNodeScrollable.appendChild(this._linesDomNode);

		this._rootDomNode.className = 'sticky-widget';
		this._rootDomNode.classList.toggle('peek', editor instanceof EmbeddedCodeEditorWidget);
		this._rootDomNode.appendChild(this._lineNumbersDomNode);
		this._rootDomNode.appendChild(this._linesDomNodeScrollable);
		this._setHeight(0);

		const updateScrollLeftPosition = () => {
			this._linesDomNode.style.left = this._editor.getOption(EditorOption.stickyScroll).scrollWithEditor ? `-${this._editor.getScrollLeft()}px` : '0px';
		};
		this._register(this._editor.onDidChangeConfiguration((e) => {
			if (e.hasChanged(EditorOption.stickyScroll)) {
				updateScrollLeftPosition();
			}
			if (e.hasChanged(EditorOption.lineHeight)) {
				this._lineHeight = this._editor.getOption(EditorOption.lineHeight);
			}
		}));
		this._register(this._editor.onDidScrollChange((e) => {
			if (e.scrollLeftChanged) {
				updateScrollLeftPosition();
			}
			if (e.scrollWidthChanged) {
				this._updateWidgetWidth();
			}
		}));
		this._register(this._editor.onDidChangeModel(() => {
			updateScrollLeftPosition();
			this._updateWidgetWidth();
		}));
		updateScrollLeftPosition();

		this._register(this._editor.onDidLayoutChange((e) => {
			this._updateWidgetWidth();
		}));
		this._updateWidgetWidth();
	}

	get lineNumbers(): number[] {
		return this._lineNumbers;
	}

	get lineNumberCount(): number {
		return this._lineNumbers.length;
	}

	getRenderedStickyLine(lineNumber: number): RenderedStickyLine | undefined {
		return this._renderedStickyLines.find(stickyLine => stickyLine.lineNumber === lineNumber);
	}

	getCurrentLines(): readonly number[] {
		return this._lineNumbers;
	}

	setState(state: StickyScrollWidgetState | undefined, foldingModel: FoldingModel | undefined, rebuildFromIndexCandidate?: number): void {
		const currentStateAndPreviousStateUndefined = !this._state && !state;
		const currentStateDefinedAndEqualsPreviousState = this._state && this._state.equals(state);
		if (rebuildFromIndexCandidate === undefined && (currentStateAndPreviousStateUndefined || currentStateDefinedAndEqualsPreviousState)) {
			return;
		}
		const data = this._findRenderingData(state);
		const previousLineNumbers = this._lineNumbers;
		this._lineNumbers = data.lineNumbers;
		this._lastLineRelativePosition = data.lastLineRelativePosition;
		const rebuildFromIndex = this._findIndexToRebuildFrom(previousLineNumbers, this._lineNumbers, rebuildFromIndexCandidate);
		this._renderRootNode(this._lineNumbers, this._lastLineRelativePosition, foldingModel, rebuildFromIndex);
		this._state = state;
	}

	private _findRenderingData(state: StickyScrollWidgetState | undefined): { lineNumbers: number[]; lastLineRelativePosition: number } {
		if (!state) {
			return { lineNumbers: [], lastLineRelativePosition: 0 };
		}
		const candidateLineNumbers = [...state.startLineNumbers];
		if (state.showEndForLine !== null) {
			candidateLineNumbers[state.showEndForLine] = state.endLineNumbers[state.showEndForLine];
		}
		let totalHeight = 0;
		for (let i = 0; i < candidateLineNumbers.length; i++) {
			totalHeight += this._editor.getLineHeightForPosition(new Position(candidateLineNumbers[i], 1));
		}
		if (totalHeight === 0) {
			return { lineNumbers: [], lastLineRelativePosition: 0 };
		}
		return { lineNumbers: candidateLineNumbers, lastLineRelativePosition: state.lastLineRelativePosition };
	}

	private _findIndexToRebuildFrom(previousLineNumbers: number[], newLineNumbers: number[], rebuildFromIndexCandidate?: number): number {
		if (newLineNumbers.length === 0) {
			return 0;
		}
		if (rebuildFromIndexCandidate !== undefined) {
			return rebuildFromIndexCandidate;
		}
		const validIndex = newLineNumbers.findIndex(startLineNumber => !previousLineNumbers.includes(startLineNumber));
		return validIndex === -1 ? 0 : validIndex;
	}

	private _updateWidgetWidth(): void {
		const layoutInfo = this._editor.getLayoutInfo();
		const lineNumbersWidth = layoutInfo.contentLeft;
		this._lineNumbersDomNode.style.width = `${lineNumbersWidth}px`;
		this._linesDomNodeScrollable.style.setProperty('--vscode-editorStickyScroll-scrollableWidth', `${this._editor.getScrollWidth() - layoutInfo.verticalScrollbarWidth}px`);
		this._rootDomNode.style.width = `${layoutInfo.width - layoutInfo.verticalScrollbarWidth}px`;
	}

	private _useFoldingOpacityTransition(requireTransitions: boolean) {
		this._lineNumbersDomNode.style.setProperty('--vscode-editorStickyScroll-foldingOpacityTransition', `opacity ${requireTransitions ? 0.5 : 0}s`);
	}

	private _setFoldingIconsVisibility(allVisible: boolean) {
		for (const line of this._renderedStickyLines) {
			const foldingIcon = line.foldingIcon;
			if (!foldingIcon) {
				continue;
			}
			foldingIcon.setVisible(allVisible ? true : foldingIcon.isCollapsed);
		}
	}

	private async _renderRootNode(lineNumbers: number[], lastLineRelativePosition: number, foldingModel: FoldingModel | undefined, rebuildFromIndex: number): Promise<void> {
		const viewModel = this._editor._getViewModel();
		if (!viewModel) {
			this._clearWidget();
			return;
		}
		if (lineNumbers.length === 0) {
			this._clearWidget();
			return;
		}
		const renderedStickyLines: RenderedStickyLine[] = [];
		const lastLineNumber = lineNumbers[lineNumbers.length - 1];
		let top: number = 0;
		for (let i = 0; i < this._renderedStickyLines.length; i++) {
			if (i < rebuildFromIndex) {
				const renderedLine = this._renderedStickyLines[i];
				renderedStickyLines.push(this._updatePosition(renderedLine, top, renderedLine.lineNumber === lastLineNumber));
				top += renderedLine.height;
			} else {
				const renderedLine = this._renderedStickyLines[i];
				renderedLine.lineNumberDomNode.remove();
				renderedLine.lineDomNode.remove();
			}
		}
		const layoutInfo = this._editor.getLayoutInfo();
		for (let i = rebuildFromIndex; i < lineNumbers.length; i++) {
			const stickyLine = this._renderChildNode(viewModel, i, lineNumbers[i], top, lastLineNumber === lineNumbers[i], foldingModel, layoutInfo);
			top += stickyLine.height;
			this._linesDomNode.appendChild(stickyLine.lineDomNode);
			this._lineNumbersDomNode.appendChild(stickyLine.lineNumberDomNode);
			renderedStickyLines.push(stickyLine);
		}
		if (foldingModel) {
			this._setFoldingHoverListeners();
			this._useFoldingOpacityTransition(!this._isOnGlyphMargin);
		}
		this._minContentWidthInPx = Math.max(...this._renderedStickyLines.map(l => l.scrollWidth)) + layoutInfo.verticalScrollbarWidth;
		this._renderedStickyLines = renderedStickyLines;
		this._setHeight(top + lastLineRelativePosition);
		this._editor.layoutOverlayWidget(this);
	}

	private _clearWidget(): void {
		for (let i = 0; i < this._renderedStickyLines.length; i++) {
			const stickyLine = this._renderedStickyLines[i];
			stickyLine.lineNumberDomNode.remove();
			stickyLine.lineDomNode.remove();
		}
		this._setHeight(0);
	}

	private _setHeight(height: number): void {
		if (this._height === height) {
			return;
		}
		this._height = height;

		if (this._height === 0) {
			this._rootDomNode.style.display = 'none';
		} else {
			this._rootDomNode.style.display = 'block';
			this._lineNumbersDomNode.style.height = `${this._height}px`;
			this._linesDomNodeScrollable.style.height = `${this._height}px`;
			this._rootDomNode.style.height = `${this._height}px`;
		}

		this._onDidChangeStickyScrollHeight.fire({ height: this._height });
	}

	private _setFoldingHoverListeners(): void {
		this._foldingIconStore.clear();
		const showFoldingControls: 'mouseover' | 'always' | 'never' = this._editor.getOption(EditorOption.showFoldingControls);
		if (showFoldingControls !== 'mouseover') {
			return;
		}
		this._foldingIconStore.clear();
		this._foldingIconStore.add(dom.addDisposableListener(this._lineNumbersDomNode, dom.EventType.MOUSE_ENTER, () => {
			this._isOnGlyphMargin = true;
			this._setFoldingIconsVisibility(true);
		}));
		this._foldingIconStore.add(dom.addDisposableListener(this._lineNumbersDomNode, dom.EventType.MOUSE_LEAVE, () => {
			this._isOnGlyphMargin = false;
			this._useFoldingOpacityTransition(true);
			this._setFoldingIconsVisibility(false);
		}));
	}

	private _renderChildNode(viewModel: IViewModel, index: number, line: number, top: number, isLastLine: boolean, foldingModel: FoldingModel | undefined, layoutInfo: EditorLayoutInfo): RenderedStickyLine {
		const viewLineNumber = viewModel.coordinatesConverter.convertModelPositionToViewPosition(new Position(line, 1)).lineNumber;
		const lineRenderingData = viewModel.getViewLineRenderingData(viewLineNumber);
		const lineNumberOption = this._editor.getOption(EditorOption.lineNumbers);
		const verticalScrollbarSize = this._editor.getOption(EditorOption.scrollbar).verticalScrollbarSize;

		let actualInlineDecorations: LineDecoration[];
		try {
			actualInlineDecorations = LineDecoration.filter(lineRenderingData.inlineDecorations, viewLineNumber, lineRenderingData.minColumn, lineRenderingData.maxColumn);
		} catch (err) {
			actualInlineDecorations = [];
		}

		const lineHeight = this._editor.getLineHeightForPosition(new Position(line, 1));
		const textDirection = viewModel.getTextDirection(line);
		const renderLineInput: RenderLineInput = new RenderLineInput(true, true, lineRenderingData.content,
			lineRenderingData.continuesWithWrappedLine,
			lineRenderingData.isBasicASCII, lineRenderingData.containsRTL, 0,
			lineRenderingData.tokens, actualInlineDecorations,
			lineRenderingData.tabSize, lineRenderingData.startVisibleColumn,
			1, 1, 1, 500, 'none', true, true, null,
			textDirection, verticalScrollbarSize
		);

		const sb = new StringBuilder(2000);
		const renderOutput = renderViewLine(renderLineInput, sb);

		let newLine;
		if (_ttPolicy) {
			newLine = _ttPolicy.createHTML(sb.build());
		} else {
			newLine = sb.build();
		}

		const lineHTMLNode = document.createElement('span');
		lineHTMLNode.setAttribute(STICKY_INDEX_ATTR, String(index));
		lineHTMLNode.setAttribute(STICKY_IS_LINE_ATTR, '');
		lineHTMLNode.setAttribute('role', 'listitem');
		lineHTMLNode.tabIndex = 0;
		lineHTMLNode.className = 'sticky-line-content';
		lineHTMLNode.classList.add(`stickyLine${line}`);
		lineHTMLNode.style.lineHeight = `${lineHeight}px`;
		lineHTMLNode.innerHTML = newLine as string;

		const lineNumberHTMLNode = document.createElement('span');
		lineNumberHTMLNode.setAttribute(STICKY_INDEX_ATTR, String(index));
		lineNumberHTMLNode.setAttribute(STICKY_IS_LINE_NUMBER_ATTR, '');
		lineNumberHTMLNode.className = 'sticky-line-number';
		lineNumberHTMLNode.style.lineHeight = `${lineHeight}px`;
		const lineNumbersWidth = layoutInfo.contentLeft;
		lineNumberHTMLNode.style.width = `${lineNumbersWidth}px`;

		const innerLineNumberHTML = document.createElement('span');
		if (lineNumberOption.renderType === RenderLineNumbersType.On || lineNumberOption.renderType === RenderLineNumbersType.Interval && line % 10 === 0) {
			innerLineNumberHTML.innerText = line.toString();
		} else if (lineNumberOption.renderType === RenderLineNumbersType.Relative) {
			innerLineNumberHTML.innerText = Math.abs(line - this._editor.getPosition()!.lineNumber).toString();
		}
		innerLineNumberHTML.className = 'sticky-line-number-inner';
		innerLineNumberHTML.style.width = `${layoutInfo.lineNumbersWidth}px`;
		innerLineNumberHTML.style.paddingLeft = `${layoutInfo.lineNumbersLeft}px`;

		lineNumberHTMLNode.appendChild(innerLineNumberHTML);
		const foldingIcon = this._renderFoldingIconForLine(foldingModel, line);
		if (foldingIcon) {
			lineNumberHTMLNode.appendChild(foldingIcon.domNode);
			foldingIcon.domNode.style.left = `${layoutInfo.lineNumbersWidth + layoutInfo.lineNumbersLeft}px`;
			foldingIcon.domNode.style.lineHeight = `${lineHeight}px`;
		}

		this._editor.applyFontInfo(lineHTMLNode);
		this._editor.applyFontInfo(lineNumberHTMLNode);

		lineNumberHTMLNode.style.lineHeight = `${lineHeight}px`;
		lineHTMLNode.style.lineHeight = `${lineHeight}px`;
		lineNumberHTMLNode.style.height = `${lineHeight}px`;
		lineHTMLNode.style.height = `${lineHeight}px`;

		const renderedLine = new RenderedStickyLine(
			index,
			line,
			lineHTMLNode,
			lineNumberHTMLNode,
			foldingIcon,
			renderOutput.characterMapping,
			lineHTMLNode.scrollWidth,
			lineHeight
		);
		return this._updatePosition(renderedLine, top, isLastLine);
	}

	private _updatePosition(stickyLine: RenderedStickyLine, top: number, isLastLine: boolean): RenderedStickyLine {
		const lineHTMLNode = stickyLine.lineDomNode;
		const lineNumberHTMLNode = stickyLine.lineNumberDomNode;
		if (isLastLine) {
			const zIndex = '0';
			lineHTMLNode.style.zIndex = zIndex;
			lineNumberHTMLNode.style.zIndex = zIndex;
			const updatedTop = `${top + this._lastLineRelativePosition + (stickyLine.foldingIcon?.isCollapsed ? 1 : 0)}px`;
			lineHTMLNode.style.top = updatedTop;
			lineNumberHTMLNode.style.top = updatedTop;
		} else {
			const zIndex = '1';
			lineHTMLNode.style.zIndex = zIndex;
			lineNumberHTMLNode.style.zIndex = zIndex;
			lineHTMLNode.style.top = `${top}px`;
			lineNumberHTMLNode.style.top = `${top}px`;
		}
		return stickyLine;
	}

	private _renderFoldingIconForLine(foldingModel: FoldingModel | undefined, line: number): StickyFoldingIcon | undefined {
		const showFoldingControls: 'mouseover' | 'always' | 'never' = this._editor.getOption(EditorOption.showFoldingControls);
		if (!foldingModel || showFoldingControls === 'never') {
			return;
		}
		const foldingRegions = foldingModel.regions;
		const indexOfFoldingRegion = foldingRegions.findRange(line);
		const startLineNumber = foldingRegions.getStartLineNumber(indexOfFoldingRegion);
		const isFoldingScope = line === startLineNumber;
		if (!isFoldingScope) {
			return;
		}
		const isCollapsed = foldingRegions.isCollapsed(indexOfFoldingRegion);
		const foldingIcon = new StickyFoldingIcon(isCollapsed, startLineNumber, foldingRegions.getEndLineNumber(indexOfFoldingRegion), this._lineHeight);
		foldingIcon.setVisible(this._isOnGlyphMargin ? true : (isCollapsed || showFoldingControls === 'always'));
		foldingIcon.domNode.setAttribute(STICKY_IS_FOLDING_ICON_ATTR, '');
		return foldingIcon;
	}

	getId(): string {
		return 'editor.contrib.stickyScrollWidget';
	}

	getDomNode(): HTMLElement {
		return this._rootDomNode;
	}

	getPosition(): IOverlayWidgetPosition | null {
		return {
			preference: OverlayWidgetPositionPreference.TOP_CENTER,
			stackOrdinal: 10,
		};
	}

	getMinContentWidthInPx(): number {
		return this._minContentWidthInPx;
	}

	focusLineWithIndex(index: number) {
		if (0 <= index && index < this._renderedStickyLines.length) {
			this._renderedStickyLines[index].lineDomNode.focus();
		}
	}

	/**
	 * Given a leaf dom node, tries to find the editor position.
	 */
	getEditorPositionFromNode(spanDomNode: HTMLElement | null): Position | null {
		if (!spanDomNode || spanDomNode.children.length > 0) {
			// This is not a leaf node
			return null;
		}
		const renderedStickyLine = this._getRenderedStickyLineFromChildDomNode(spanDomNode);
		if (!renderedStickyLine) {
			return null;
		}
		const column = getColumnOfNodeOffset(renderedStickyLine.characterMapping, spanDomNode, 0);
		return new Position(renderedStickyLine.lineNumber, column);
	}

	getLineNumberFromChildDomNode(domNode: HTMLElement | null): number | null {
		return this._getRenderedStickyLineFromChildDomNode(domNode)?.lineNumber ?? null;
	}

	private _getRenderedStickyLineFromChildDomNode(domNode: HTMLElement | null): RenderedStickyLine | null {
		const index = this.getLineIndexFromChildDomNode(domNode);
		if (index === null || index < 0 || index >= this._renderedStickyLines.length) {
			return null;
		}
		return this._renderedStickyLines[index];
	}

	/**
	 * Given a child dom node, tries to find the line number attribute that was stored in the node.
	 * @returns the attribute value or null if none is found.
	 */
	getLineIndexFromChildDomNode(domNode: HTMLElement | null): number | null {
		const lineIndex = this._getAttributeValue(domNode, STICKY_INDEX_ATTR);
		return lineIndex ? parseInt(lineIndex, 10) : null;
	}

	/**
	 * Given a child dom node, tries to find if it is (contained in) a sticky line.
	 * @returns a boolean.
	 */
	isInStickyLine(domNode: HTMLElement | null): boolean {
		const isInLine = this._getAttributeValue(domNode, STICKY_IS_LINE_ATTR);
		return isInLine !== undefined;
	}

	/**
	 * Given a child dom node, tries to find if this dom node is (contained in) a sticky folding icon.
	 * @returns a boolean.
	 */
	isInFoldingIconDomNode(domNode: HTMLElement | null): boolean {
		const isInFoldingIcon = this._getAttributeValue(domNode, STICKY_IS_FOLDING_ICON_ATTR);
		return isInFoldingIcon !== undefined;
	}

	/**
	 * Given the dom node, finds if it or its parent sequence contains the given attribute.
	 * @returns the attribute value or undefined.
	 */
	private _getAttributeValue(domNode: HTMLElement | null, attribute: string): string | undefined {
		while (domNode && domNode !== this._rootDomNode) {
			const line = domNode.getAttribute(attribute);
			if (line !== null) {
				return line;
			}
			domNode = domNode.parentElement;
		}
		return;
	}
}

class RenderedStickyLine {
	constructor(
		public readonly index: number,
		public readonly lineNumber: number,
		public readonly lineDomNode: HTMLElement,
		public readonly lineNumberDomNode: HTMLElement,
		public readonly foldingIcon: StickyFoldingIcon | undefined,
		public readonly characterMapping: CharacterMapping,
		public readonly scrollWidth: number,
		public readonly height: number
	) { }
}

class StickyFoldingIcon {

	public domNode: HTMLElement;

	constructor(
		public isCollapsed: boolean,
		public foldingStartLine: number,
		public foldingEndLine: number,
		public dimension: number
	) {
		this.domNode = document.createElement('div');
		this.domNode.style.width = `26px`;
		this.domNode.style.height = `${dimension}px`;
		this.domNode.style.lineHeight = `${dimension}px`;
		this.domNode.className = ThemeIcon.asClassName(isCollapsed ? foldingCollapsedIcon : foldingExpandedIcon);
	}

	public setVisible(visible: boolean) {
		this.domNode.style.cursor = visible ? 'pointer' : 'default';
		this.domNode.style.opacity = visible ? '1' : '0';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/stickyScroll/test/browser/stickyScroll.test.ts]---
Location: vscode-main/src/vs/editor/contrib/stickyScroll/test/browser/stickyScroll.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { withAsyncTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { StickyScrollController } from '../../browser/stickyScrollController.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { LanguageFeaturesService } from '../../../../common/services/languageFeaturesService.js';
import { DocumentSymbol, SymbolKind } from '../../../../common/languages.js';
import { StickyLineCandidate, StickyLineCandidateProvider } from '../../browser/stickyScrollProvider.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { ILanguageFeatureDebounceService, LanguageFeatureDebounceService } from '../../../../common/services/languageFeatureDebounce.js';
import { TestLanguageConfigurationService } from '../../../../test/common/modes/testLanguageConfigurationService.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';

suite('Sticky Scroll Tests', () => {

	const disposables = new DisposableStore();

	const serviceCollection = new ServiceCollection(
		[ILanguageFeaturesService, new LanguageFeaturesService()],
		[ILogService, new NullLogService()],
		[IContextMenuService, new class extends mock<IContextMenuService>() { }],
		[ILanguageConfigurationService, new TestLanguageConfigurationService()],
		[IEnvironmentService, new class extends mock<IEnvironmentService>() {
			override isBuilt: boolean = true;
			override isExtensionDevelopment: boolean = false;
		}],
		[ILanguageFeatureDebounceService, new SyncDescriptor(LanguageFeatureDebounceService)],
	);

	const text = [
		'function foo() {',
		'',
		'}',
		'/* comment related to TestClass',
		' end of the comment */',
		'@classDecorator',
		'class TestClass {',
		'// comment related to the function functionOfClass',
		'functionOfClass(){',
		'function function1(){',
		'}',
		'}}',
		'function bar() { function insideBar() {}',
		'}'
	].join('\n');

	setup(() => {
		disposables.clear();
	});
	teardown(() => {
		disposables.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function documentSymbolProviderForTestModel() {
		return {
			provideDocumentSymbols() {
				return [
					{
						name: 'foo',
						detail: 'foo',
						kind: SymbolKind.Function,
						tags: [],
						range: { startLineNumber: 1, endLineNumber: 3, startColumn: 1, endColumn: 1 },
						selectionRange: { startLineNumber: 1, endLineNumber: 1, startColumn: 1, endColumn: 1 }
					} as DocumentSymbol,
					{
						name: 'TestClass',
						detail: 'TestClass',
						kind: SymbolKind.Class,
						tags: [],
						range: { startLineNumber: 4, endLineNumber: 12, startColumn: 1, endColumn: 1 },
						selectionRange: { startLineNumber: 7, endLineNumber: 7, startColumn: 1, endColumn: 1 },
						children: [
							{
								name: 'functionOfClass',
								detail: 'functionOfClass',
								kind: SymbolKind.Function,
								tags: [],
								range: { startLineNumber: 8, endLineNumber: 12, startColumn: 1, endColumn: 1 },
								selectionRange: { startLineNumber: 9, endLineNumber: 9, startColumn: 1, endColumn: 1 },
								children: [
									{
										name: 'function1',
										detail: 'function1',
										kind: SymbolKind.Function,
										tags: [],
										range: { startLineNumber: 10, endLineNumber: 11, startColumn: 1, endColumn: 1 },
										selectionRange: { startLineNumber: 10, endLineNumber: 10, startColumn: 1, endColumn: 1 },
									}
								]
							} as DocumentSymbol
						]
					} as DocumentSymbol,
					{
						name: 'bar',
						detail: 'bar',
						kind: SymbolKind.Function,
						tags: [],
						range: { startLineNumber: 13, endLineNumber: 14, startColumn: 1, endColumn: 1 },
						selectionRange: { startLineNumber: 13, endLineNumber: 13, startColumn: 1, endColumn: 1 },
						children: [
							{
								name: 'insideBar',
								detail: 'insideBar',
								kind: SymbolKind.Function,
								tags: [],
								range: { startLineNumber: 13, endLineNumber: 13, startColumn: 1, endColumn: 1 },
								selectionRange: { startLineNumber: 13, endLineNumber: 13, startColumn: 1, endColumn: 1 },
							} as DocumentSymbol
						]
					} as DocumentSymbol
				];
			}
		};
	}

	test('Testing the function getCandidateStickyLinesIntersecting', () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			const model = createTextModel(text);
			await withAsyncTestCodeEditor(model, {
				stickyScroll: {
					enabled: true,
					maxLineCount: 5,
					defaultModel: 'outlineModel'
				},
				envConfig: {
					outerHeight: 500
				},
				serviceCollection: serviceCollection
			}, async (editor, _viewModel, instantiationService) => {
				const languageService = instantiationService.get(ILanguageFeaturesService);
				const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
				disposables.add(languageService.documentSymbolProvider.register('*', documentSymbolProviderForTestModel()));
				const provider: StickyLineCandidateProvider = new StickyLineCandidateProvider(editor, languageService, languageConfigurationService);
				await provider.update();
				assert.deepStrictEqual(provider.getCandidateStickyLinesIntersecting({ startLineNumber: 1, endLineNumber: 4 }), [new StickyLineCandidate(1, 2, 0, 19)]);
				assert.deepStrictEqual(provider.getCandidateStickyLinesIntersecting({ startLineNumber: 8, endLineNumber: 10 }), [new StickyLineCandidate(7, 11, 0, 19), new StickyLineCandidate(9, 11, 19, 19)]);
				assert.deepStrictEqual(provider.getCandidateStickyLinesIntersecting({ startLineNumber: 10, endLineNumber: 13 }), [new StickyLineCandidate(7, 11, 0, 19), new StickyLineCandidate(9, 11, 19, 19)]);

				provider.dispose();
				model.dispose();
			});
		});
	});

	test('issue #157180: Render the correct line corresponding to the scope definition', () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			const model = createTextModel(text);
			await withAsyncTestCodeEditor(model, {
				stickyScroll: {
					enabled: true,
					maxLineCount: 5,
					defaultModel: 'outlineModel'
				},
				envConfig: {
					outerHeight: 500
				},
				serviceCollection
			}, async (editor, _viewModel, instantiationService) => {

				const stickyScrollController: StickyScrollController = editor.registerAndInstantiateContribution(StickyScrollController.ID, StickyScrollController);
				const lineHeight: number = editor.getOption(EditorOption.lineHeight);
				const languageService: ILanguageFeaturesService = instantiationService.get(ILanguageFeaturesService);
				disposables.add(languageService.documentSymbolProvider.register('*', documentSymbolProviderForTestModel()));
				await stickyScrollController.stickyScrollCandidateProvider.update();
				let state;

				editor.setScrollTop(1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, [1]);

				editor.setScrollTop(lineHeight + 1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, [1]);

				editor.setScrollTop(4 * lineHeight + 1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, []);

				editor.setScrollTop(8 * lineHeight + 1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, [7, 9]);

				editor.setScrollTop(9 * lineHeight + 1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, [7, 9]);

				editor.setScrollTop(10 * lineHeight + 1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, [7]);

				stickyScrollController.dispose();
				stickyScrollController.stickyScrollCandidateProvider.dispose();
				model.dispose();
			});
		});
	});

	test('issue #156268 : Do not reveal sticky lines when they are in a folded region ', () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			const model = createTextModel(text);
			await withAsyncTestCodeEditor(model, {
				stickyScroll: {
					enabled: true,
					maxLineCount: 5,
					defaultModel: 'outlineModel'
				},
				envConfig: {
					outerHeight: 500
				},
				serviceCollection
			}, async (editor, viewModel, instantiationService) => {

				const stickyScrollController: StickyScrollController = editor.registerAndInstantiateContribution(StickyScrollController.ID, StickyScrollController);
				const lineHeight = editor.getOption(EditorOption.lineHeight);

				const languageService = instantiationService.get(ILanguageFeaturesService);
				disposables.add(languageService.documentSymbolProvider.register('*', documentSymbolProviderForTestModel()));
				await stickyScrollController.stickyScrollCandidateProvider.update();
				editor.setHiddenAreas([{ startLineNumber: 2, endLineNumber: 2, startColumn: 1, endColumn: 1 }, { startLineNumber: 10, endLineNumber: 11, startColumn: 1, endColumn: 1 }]);
				let state;

				editor.setScrollTop(1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, [1]);

				editor.setScrollTop(lineHeight + 1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, []);

				editor.setScrollTop(6 * lineHeight + 1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, [7, 9]);

				editor.setScrollTop(7 * lineHeight + 1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, [7]);

				editor.setScrollTop(10 * lineHeight + 1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, []);

				stickyScrollController.dispose();
				stickyScrollController.stickyScrollCandidateProvider.dispose();
				model.dispose();
			});
		});
	});

	const textWithScopesWithSameStartingLines = [
		'class TestClass { foo() {',
		'function bar(){',
		'',
		'}}',
		'}',
		''
	].join('\n');

	function documentSymbolProviderForSecondTestModel() {
		return {
			provideDocumentSymbols() {
				return [
					{
						name: 'TestClass',
						detail: 'TestClass',
						kind: SymbolKind.Class,
						tags: [],
						range: { startLineNumber: 1, endLineNumber: 5, startColumn: 1, endColumn: 1 },
						selectionRange: { startLineNumber: 1, endLineNumber: 1, startColumn: 1, endColumn: 1 },
						children: [
							{
								name: 'foo',
								detail: 'foo',
								kind: SymbolKind.Function,
								tags: [],
								range: { startLineNumber: 1, endLineNumber: 4, startColumn: 1, endColumn: 1 },
								selectionRange: { startLineNumber: 1, endLineNumber: 1, startColumn: 1, endColumn: 1 },
								children: [
									{
										name: 'bar',
										detail: 'bar',
										kind: SymbolKind.Function,
										tags: [],
										range: { startLineNumber: 2, endLineNumber: 4, startColumn: 1, endColumn: 1 },
										selectionRange: { startLineNumber: 2, endLineNumber: 2, startColumn: 1, endColumn: 1 },
										children: []
									} as DocumentSymbol
								]
							} as DocumentSymbol,
						]
					} as DocumentSymbol
				];
			}
		};
	}

	test('issue #159271 : render the correct widget state when the child scope starts on the same line as the parent scope', () => {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			const model = createTextModel(textWithScopesWithSameStartingLines);
			await withAsyncTestCodeEditor(model, {
				stickyScroll: {
					enabled: true,
					maxLineCount: 5,
					defaultModel: 'outlineModel'
				},
				envConfig: {
					outerHeight: 500
				},
				serviceCollection
			}, async (editor, _viewModel, instantiationService) => {

				const stickyScrollController: StickyScrollController = editor.registerAndInstantiateContribution(StickyScrollController.ID, StickyScrollController);
				await stickyScrollController.stickyScrollCandidateProvider.update();
				const lineHeight = editor.getOption(EditorOption.lineHeight);

				const languageService = instantiationService.get(ILanguageFeaturesService);
				disposables.add(languageService.documentSymbolProvider.register('*', documentSymbolProviderForSecondTestModel()));
				await stickyScrollController.stickyScrollCandidateProvider.update();
				let state;

				editor.setScrollTop(1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, [1, 2]);

				editor.setScrollTop(lineHeight + 1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, [1, 2]);

				editor.setScrollTop(2 * lineHeight + 1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, [1]);

				editor.setScrollTop(3 * lineHeight + 1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, [1]);

				editor.setScrollTop(4 * lineHeight + 1);
				state = stickyScrollController.findScrollWidgetState();
				assert.deepStrictEqual(state.startLineNumbers, []);

				stickyScrollController.dispose();
				stickyScrollController.stickyScrollCandidateProvider.dispose();
				model.dispose();
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/completionModel.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/completionModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { quickSelect } from '../../../../base/common/arrays.js';
import { CharCode } from '../../../../base/common/charCode.js';
import { anyScore, fuzzyScore, FuzzyScore, fuzzyScoreGracefulAggressive, FuzzyScoreOptions, FuzzyScorer } from '../../../../base/common/filters.js';
import { compareIgnoreCase } from '../../../../base/common/strings.js';
import { InternalSuggestOptions } from '../../../common/config/editorOptions.js';
import { CompletionItemKind, CompletionItemProvider } from '../../../common/languages.js';
import { WordDistance } from './wordDistance.js';
import { CompletionItem } from './suggest.js';

type StrictCompletionItem = Required<CompletionItem>;

export interface ICompletionStats {
	pLabelLen: number;
}

export class LineContext {
	constructor(
		readonly leadingLineContent: string,
		readonly characterCountDelta: number,
	) { }
}

const enum Refilter {
	Nothing = 0,
	All = 1,
	Incr = 2
}

/**
 * Sorted, filtered completion view model
 * */
export class CompletionModel {

	private readonly _items: CompletionItem[];
	private readonly _column: number;
	private readonly _wordDistance: WordDistance;
	private readonly _options: InternalSuggestOptions;
	private readonly _snippetCompareFn = CompletionModel._compareCompletionItems;
	private readonly _fuzzyScoreOptions: FuzzyScoreOptions;

	private _lineContext: LineContext;
	private _refilterKind: Refilter;
	private _filteredItems?: StrictCompletionItem[];

	private _itemsByProvider?: Map<CompletionItemProvider, CompletionItem[]>;
	private _stats?: ICompletionStats;

	constructor(
		items: CompletionItem[],
		column: number,
		lineContext: LineContext,
		wordDistance: WordDistance,
		options: InternalSuggestOptions,
		snippetSuggestions: 'top' | 'bottom' | 'inline' | 'none',
		fuzzyScoreOptions: FuzzyScoreOptions | undefined = FuzzyScoreOptions.default,
		readonly clipboardText: string | undefined = undefined
	) {
		this._items = items;
		this._column = column;
		this._wordDistance = wordDistance;
		this._options = options;
		this._refilterKind = Refilter.All;
		this._lineContext = lineContext;
		this._fuzzyScoreOptions = fuzzyScoreOptions;

		if (snippetSuggestions === 'top') {
			this._snippetCompareFn = CompletionModel._compareCompletionItemsSnippetsUp;
		} else if (snippetSuggestions === 'bottom') {
			this._snippetCompareFn = CompletionModel._compareCompletionItemsSnippetsDown;
		}
	}

	get lineContext(): LineContext {
		return this._lineContext;
	}

	set lineContext(value: LineContext) {
		if (this._lineContext.leadingLineContent !== value.leadingLineContent
			|| this._lineContext.characterCountDelta !== value.characterCountDelta
		) {
			this._refilterKind = this._lineContext.characterCountDelta < value.characterCountDelta && this._filteredItems ? Refilter.Incr : Refilter.All;
			this._lineContext = value;
		}
	}

	get items(): CompletionItem[] {
		this._ensureCachedState();
		return this._filteredItems!;
	}

	getItemsByProvider(): ReadonlyMap<CompletionItemProvider, CompletionItem[]> {
		this._ensureCachedState();
		return this._itemsByProvider!;
	}

	getIncompleteProvider(): Set<CompletionItemProvider> {
		this._ensureCachedState();
		const result = new Set<CompletionItemProvider>();
		for (const [provider, items] of this.getItemsByProvider()) {
			if (items.length > 0 && items[0].container.incomplete) {
				result.add(provider);
			}
		}
		return result;
	}

	get stats(): ICompletionStats {
		this._ensureCachedState();
		return this._stats!;
	}

	private _ensureCachedState(): void {
		if (this._refilterKind !== Refilter.Nothing) {
			this._createCachedState();
		}
	}

	private _createCachedState(): void {

		this._itemsByProvider = new Map();

		const labelLengths: number[] = [];

		const { leadingLineContent, characterCountDelta } = this._lineContext;
		let word = '';
		let wordLow = '';

		// incrementally filter less
		const source = this._refilterKind === Refilter.All ? this._items : this._filteredItems!;
		const target: StrictCompletionItem[] = [];

		// picks a score function based on the number of
		// items that we have to score/filter and based on the
		// user-configuration
		const scoreFn: FuzzyScorer = (!this._options.filterGraceful || source.length > 2000) ? fuzzyScore : fuzzyScoreGracefulAggressive;

		for (let i = 0; i < source.length; i++) {

			const item = source[i];

			if (item.isInvalid) {
				continue; // SKIP invalid items
			}

			// keep all items by their provider
			const arr = this._itemsByProvider.get(item.provider);
			if (arr) {
				arr.push(item);
			} else {
				this._itemsByProvider.set(item.provider, [item]);
			}

			// 'word' is that remainder of the current line that we
			// filter and score against. In theory each suggestion uses a
			// different word, but in practice not - that's why we cache
			const overwriteBefore = item.position.column - item.editStart.column;
			const wordLen = overwriteBefore + characterCountDelta - (item.position.column - this._column);
			if (word.length !== wordLen) {
				word = wordLen === 0 ? '' : leadingLineContent.slice(-wordLen);
				wordLow = word.toLowerCase();
			}

			// remember the word against which this item was
			// scored
			item.word = word;

			if (wordLen === 0) {
				// when there is nothing to score against, don't
				// event try to do. Use a const rank and rely on
				// the fallback-sort using the initial sort order.
				// use a score of `-100` because that is out of the
				// bound of values `fuzzyScore` will return
				item.score = FuzzyScore.Default;

			} else {
				// skip word characters that are whitespace until
				// we have hit the replace range (overwriteBefore)
				let wordPos = 0;
				while (wordPos < overwriteBefore) {
					const ch = word.charCodeAt(wordPos);
					if (ch === CharCode.Space || ch === CharCode.Tab) {
						wordPos += 1;
					} else {
						break;
					}
				}

				if (wordPos >= wordLen) {
					// the wordPos at which scoring starts is the whole word
					// and therefore the same rules as not having a word apply
					item.score = FuzzyScore.Default;

				} else if (typeof item.completion.filterText === 'string') {
					// when there is a `filterText` it must match the `word`.
					// if it matches we check with the label to compute highlights
					// and if that doesn't yield a result we have no highlights,
					// despite having the match
					const match = scoreFn(word, wordLow, wordPos, item.completion.filterText, item.filterTextLow!, 0, this._fuzzyScoreOptions);
					if (!match) {
						continue; // NO match
					}
					if (compareIgnoreCase(item.completion.filterText, item.textLabel) === 0) {
						// filterText and label are actually the same -> use good highlights
						item.score = match;
					} else {
						// re-run the scorer on the label in the hope of a result BUT use the rank
						// of the filterText-match
						item.score = anyScore(word, wordLow, wordPos, item.textLabel, item.labelLow, 0);
						item.score[0] = match[0]; // use score from filterText
					}

				} else {
					// by default match `word` against the `label`
					const match = scoreFn(word, wordLow, wordPos, item.textLabel, item.labelLow, 0, this._fuzzyScoreOptions);
					if (!match) {
						continue; // NO match
					}
					item.score = match;
				}
			}

			item.idx = i;
			item.distance = this._wordDistance.distance(item.position, item.completion);
			target.push(item as StrictCompletionItem);

			// update stats
			labelLengths.push(item.textLabel.length);
		}

		this._filteredItems = target.sort(this._snippetCompareFn);
		this._refilterKind = Refilter.Nothing;
		this._stats = {
			pLabelLen: labelLengths.length ?
				quickSelect(labelLengths.length - .85, labelLengths, (a, b) => a - b)
				: 0
		};
	}

	private static _compareCompletionItems(a: StrictCompletionItem, b: StrictCompletionItem): number {
		if (a.score[0] > b.score[0]) {
			return -1;
		} else if (a.score[0] < b.score[0]) {
			return 1;
		} else if (a.distance < b.distance) {
			return -1;
		} else if (a.distance > b.distance) {
			return 1;
		} else if (a.idx < b.idx) {
			return -1;
		} else if (a.idx > b.idx) {
			return 1;
		} else {
			return 0;
		}
	}

	private static _compareCompletionItemsSnippetsDown(a: StrictCompletionItem, b: StrictCompletionItem): number {
		if (a.completion.kind !== b.completion.kind) {
			if (a.completion.kind === CompletionItemKind.Snippet) {
				return 1;
			} else if (b.completion.kind === CompletionItemKind.Snippet) {
				return -1;
			}
		}
		return CompletionModel._compareCompletionItems(a, b);
	}

	private static _compareCompletionItemsSnippetsUp(a: StrictCompletionItem, b: StrictCompletionItem): number {
		if (a.completion.kind !== b.completion.kind) {
			if (a.completion.kind === CompletionItemKind.Snippet) {
				return -1;
			} else if (b.completion.kind === CompletionItemKind.Snippet) {
				return 1;
			}
		}
		return CompletionModel._compareCompletionItems(a, b);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/suggest.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/suggest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { CancellationError, isCancellationError, onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { FuzzyScore } from '../../../../base/common/filters.js';
import { DisposableStore, IDisposable, isDisposable } from '../../../../base/common/lifecycle.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';
import * as languages from '../../../common/languages.js';
import { ITextModelService } from '../../../common/services/resolverService.js';
import { SnippetParser } from '../../snippet/browser/snippetParser.js';
import { localize } from '../../../../nls.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { historyNavigationVisible } from '../../../../platform/history/browser/contextScopedHistoryWidget.js';
import { InternalQuickSuggestionsOptions, QuickSuggestionsValue } from '../../../common/config/editorOptions.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { StandardTokenType } from '../../../common/encodedTokenAttributes.js';

export const Context = {
	Visible: historyNavigationVisible,
	HasFocusedSuggestion: new RawContextKey<boolean>('suggestWidgetHasFocusedSuggestion', false, localize('suggestWidgetHasSelection', "Whether any suggestion is focused")),
	DetailsVisible: new RawContextKey<boolean>('suggestWidgetDetailsVisible', false, localize('suggestWidgetDetailsVisible', "Whether suggestion details are visible")),
	DetailsFocused: new RawContextKey<boolean>('suggestWidgetDetailsFocused', false, localize('suggestWidgetDetailsFocused', "Whether the details pane of the suggest widget has focus")),
	MultipleSuggestions: new RawContextKey<boolean>('suggestWidgetMultipleSuggestions', false, localize('suggestWidgetMultipleSuggestions', "Whether there are multiple suggestions to pick from")),
	MakesTextEdit: new RawContextKey<boolean>('suggestionMakesTextEdit', true, localize('suggestionMakesTextEdit', "Whether inserting the current suggestion yields in a change or has everything already been typed")),
	AcceptSuggestionsOnEnter: new RawContextKey<boolean>('acceptSuggestionOnEnter', true, localize('acceptSuggestionOnEnter', "Whether suggestions are inserted when pressing Enter")),
	HasInsertAndReplaceRange: new RawContextKey<boolean>('suggestionHasInsertAndReplaceRange', false, localize('suggestionHasInsertAndReplaceRange', "Whether the current suggestion has insert and replace behaviour")),
	InsertMode: new RawContextKey<'insert' | 'replace'>('suggestionInsertMode', undefined, { type: 'string', description: localize('suggestionInsertMode', "Whether the default behaviour is to insert or replace") }),
	CanResolve: new RawContextKey<boolean>('suggestionCanResolve', false, localize('suggestionCanResolve', "Whether the current suggestion supports to resolve further details")),
};

export const suggestWidgetStatusbarMenu = new MenuId('suggestWidgetStatusBar');

export class CompletionItem {

	_brand!: 'ISuggestionItem';

	//
	readonly editStart: IPosition;
	readonly editInsertEnd: IPosition;
	readonly editReplaceEnd: IPosition;

	//
	readonly textLabel: string;

	// perf
	readonly labelLow: string;
	readonly sortTextLow?: string;
	readonly filterTextLow?: string;

	// validation
	readonly isInvalid: boolean = false;

	// sorting, filtering
	score: FuzzyScore = FuzzyScore.Default;
	distance: number = 0;
	idx?: number;
	word?: string;

	// instrumentation
	readonly extensionId?: ExtensionIdentifier;

	// resolving
	private _resolveDuration?: number;
	private _resolveCache?: Promise<void>;

	constructor(
		readonly position: IPosition,
		readonly completion: languages.CompletionItem,
		readonly container: languages.CompletionList,
		readonly provider: languages.CompletionItemProvider,
	) {
		this.textLabel = typeof completion.label === 'string'
			? completion.label
			: completion.label?.label;

		// ensure lower-variants (perf)
		this.labelLow = this.textLabel.toLowerCase();

		// validate label
		this.isInvalid = !this.textLabel;

		this.sortTextLow = completion.sortText && completion.sortText.toLowerCase();
		this.filterTextLow = completion.filterText && completion.filterText.toLowerCase();

		this.extensionId = completion.extensionId;

		// normalize ranges
		if (Range.isIRange(completion.range)) {
			this.editStart = new Position(completion.range.startLineNumber, completion.range.startColumn);
			this.editInsertEnd = new Position(completion.range.endLineNumber, completion.range.endColumn);
			this.editReplaceEnd = new Position(completion.range.endLineNumber, completion.range.endColumn);

			// validate range
			this.isInvalid = this.isInvalid
				|| Range.spansMultipleLines(completion.range) || completion.range.startLineNumber !== position.lineNumber;

		} else {
			this.editStart = new Position(completion.range.insert.startLineNumber, completion.range.insert.startColumn);
			this.editInsertEnd = new Position(completion.range.insert.endLineNumber, completion.range.insert.endColumn);
			this.editReplaceEnd = new Position(completion.range.replace.endLineNumber, completion.range.replace.endColumn);

			// validate ranges
			this.isInvalid = this.isInvalid
				|| Range.spansMultipleLines(completion.range.insert) || Range.spansMultipleLines(completion.range.replace)
				|| completion.range.insert.startLineNumber !== position.lineNumber || completion.range.replace.startLineNumber !== position.lineNumber
				|| completion.range.insert.startColumn !== completion.range.replace.startColumn;
		}

		// create the suggestion resolver
		if (typeof provider.resolveCompletionItem !== 'function') {
			this._resolveCache = Promise.resolve();
			this._resolveDuration = 0;
		}
	}

	// ---- resolving

	get isResolved(): boolean {
		return this._resolveDuration !== undefined;
	}

	get resolveDuration(): number {
		return this._resolveDuration !== undefined ? this._resolveDuration : -1;
	}

	async resolve(token: CancellationToken) {
		if (!this._resolveCache) {
			const sub = token.onCancellationRequested(() => {
				this._resolveCache = undefined;
				this._resolveDuration = undefined;
			});
			const sw = new StopWatch(true);
			this._resolveCache = Promise.resolve(this.provider.resolveCompletionItem!(this.completion, token)).then(value => {
				Object.assign(this.completion, value);
				this._resolveDuration = sw.elapsed();
			}, err => {
				if (isCancellationError(err)) {
					// the IPC queue will reject the request with the
					// cancellation error -> reset cached
					this._resolveCache = undefined;
					this._resolveDuration = undefined;
				}
			}).finally(() => {
				sub.dispose();
			});
		}
		return this._resolveCache;
	}
}

export const enum SnippetSortOrder {
	Top, Inline, Bottom
}

export class CompletionOptions {

	static readonly default = new CompletionOptions();

	constructor(
		readonly snippetSortOrder = SnippetSortOrder.Bottom,
		readonly kindFilter = new Set<languages.CompletionItemKind>(),
		readonly providerFilter = new Set<languages.CompletionItemProvider>(),
		readonly providerItemsToReuse: ReadonlyMap<languages.CompletionItemProvider, CompletionItem[]> = new Map<languages.CompletionItemProvider, CompletionItem[]>(),
		readonly showDeprecated = true
	) { }
}

let _snippetSuggestSupport: languages.CompletionItemProvider | undefined;

export function getSnippetSuggestSupport(): languages.CompletionItemProvider | undefined {
	return _snippetSuggestSupport;
}

export function setSnippetSuggestSupport(support: languages.CompletionItemProvider | undefined): languages.CompletionItemProvider | undefined {
	const old = _snippetSuggestSupport;
	_snippetSuggestSupport = support;
	return old;
}

export interface CompletionDurationEntry {
	readonly providerName: string;
	readonly elapsedProvider: number;
	readonly elapsedOverall: number;
}

export interface CompletionDurations {
	readonly entries: readonly CompletionDurationEntry[];
	readonly elapsed: number;
}

export class CompletionItemModel {
	constructor(
		readonly items: CompletionItem[],
		readonly needsClipboard: boolean,
		readonly durations: CompletionDurations,
		readonly disposable: IDisposable,
	) { }
}

export async function provideSuggestionItems(
	registry: LanguageFeatureRegistry<languages.CompletionItemProvider>,
	model: ITextModel,
	position: Position,
	options: CompletionOptions = CompletionOptions.default,
	context: languages.CompletionContext = { triggerKind: languages.CompletionTriggerKind.Invoke },
	token: CancellationToken = CancellationToken.None
): Promise<CompletionItemModel> {

	const sw = new StopWatch();
	position = position.clone();

	const word = model.getWordAtPosition(position);
	const defaultReplaceRange = word ? new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn) : Range.fromPositions(position);
	const defaultRange = { replace: defaultReplaceRange, insert: defaultReplaceRange.setEndPosition(position.lineNumber, position.column) };

	const result: CompletionItem[] = [];
	const disposables = new DisposableStore();
	const durations: CompletionDurationEntry[] = [];
	let needsClipboard = false;

	const onCompletionList = (provider: languages.CompletionItemProvider, container: languages.CompletionList | null | undefined, sw: StopWatch): boolean => {
		let didAddResult = false;
		if (!container) {
			return didAddResult;
		}
		for (const suggestion of container.suggestions) {
			if (!options.kindFilter.has(suggestion.kind)) {
				// skip if not showing deprecated suggestions
				if (!options.showDeprecated && suggestion?.tags?.includes(languages.CompletionItemTag.Deprecated)) {
					continue;
				}
				// fill in default range when missing
				if (!suggestion.range) {
					suggestion.range = defaultRange;
				}
				// fill in default sortText when missing
				if (!suggestion.sortText) {
					suggestion.sortText = typeof suggestion.label === 'string' ? suggestion.label : suggestion.label.label;
				}
				if (!needsClipboard && suggestion.insertTextRules && suggestion.insertTextRules & languages.CompletionItemInsertTextRule.InsertAsSnippet) {
					needsClipboard = SnippetParser.guessNeedsClipboard(suggestion.insertText);
				}
				result.push(new CompletionItem(position, suggestion, container, provider));
				didAddResult = true;
			}
		}
		if (isDisposable(container)) {
			disposables.add(container);
		}
		durations.push({
			providerName: provider._debugDisplayName ?? 'unknown_provider', elapsedProvider: container.duration ?? -1, elapsedOverall: sw.elapsed()
		});
		return didAddResult;
	};

	// ask for snippets in parallel to asking "real" providers. Only do something if configured to
	// do so - no snippet filter, no special-providers-only request
	const snippetCompletions = (async () => {
		if (!_snippetSuggestSupport || options.kindFilter.has(languages.CompletionItemKind.Snippet)) {
			return;
		}
		// we have items from a previous session that we can reuse
		const reuseItems = options.providerItemsToReuse.get(_snippetSuggestSupport);
		if (reuseItems) {
			reuseItems.forEach(item => result.push(item));
			return;
		}
		if (options.providerFilter.size > 0 && !options.providerFilter.has(_snippetSuggestSupport)) {
			return;
		}
		const sw = new StopWatch();
		const list = await _snippetSuggestSupport.provideCompletionItems(model, position, context, token);
		onCompletionList(_snippetSuggestSupport, list, sw);
	})();

	// add suggestions from contributed providers - providers are ordered in groups of
	// equal score and once a group produces a result the process stops
	// get provider groups, always add snippet suggestion provider
	for (const providerGroup of registry.orderedGroups(model)) {

		// for each support in the group ask for suggestions
		let didAddResult = false;
		await Promise.all(providerGroup.map(async provider => {
			// we have items from a previous session that we can reuse
			if (options.providerItemsToReuse.has(provider)) {
				const items = options.providerItemsToReuse.get(provider)!;
				items.forEach(item => result.push(item));
				didAddResult = didAddResult || items.length > 0;
				return;
			}
			// check if this provider is filtered out
			if (options.providerFilter.size > 0 && !options.providerFilter.has(provider)) {
				return;
			}
			try {
				const sw = new StopWatch();
				const list = await provider.provideCompletionItems(model, position, context, token);
				didAddResult = onCompletionList(provider, list, sw) || didAddResult;
			} catch (err) {
				onUnexpectedExternalError(err);
			}
		}));

		if (didAddResult || token.isCancellationRequested) {
			break;
		}
	}

	await snippetCompletions;

	if (token.isCancellationRequested) {
		disposables.dispose();
		return Promise.reject(new CancellationError());
	}

	return new CompletionItemModel(
		result.sort(getSuggestionComparator(options.snippetSortOrder)),
		needsClipboard,
		{ entries: durations, elapsed: sw.elapsed() },
		disposables,
	);
}


function defaultComparator(a: CompletionItem, b: CompletionItem): number {
	// check with 'sortText'
	if (a.sortTextLow && b.sortTextLow) {
		if (a.sortTextLow < b.sortTextLow) {
			return -1;
		} else if (a.sortTextLow > b.sortTextLow) {
			return 1;
		}
	}
	// check with 'label'
	if (a.textLabel < b.textLabel) {
		return -1;
	} else if (a.textLabel > b.textLabel) {
		return 1;
	}
	// check with 'type'
	return a.completion.kind - b.completion.kind;
}

function snippetUpComparator(a: CompletionItem, b: CompletionItem): number {
	if (a.completion.kind !== b.completion.kind) {
		if (a.completion.kind === languages.CompletionItemKind.Snippet) {
			return -1;
		} else if (b.completion.kind === languages.CompletionItemKind.Snippet) {
			return 1;
		}
	}
	return defaultComparator(a, b);
}

function snippetDownComparator(a: CompletionItem, b: CompletionItem): number {
	if (a.completion.kind !== b.completion.kind) {
		if (a.completion.kind === languages.CompletionItemKind.Snippet) {
			return 1;
		} else if (b.completion.kind === languages.CompletionItemKind.Snippet) {
			return -1;
		}
	}
	return defaultComparator(a, b);
}

interface Comparator<T> { (a: T, b: T): number }
const _snippetComparators = new Map<SnippetSortOrder, Comparator<CompletionItem>>();
_snippetComparators.set(SnippetSortOrder.Top, snippetUpComparator);
_snippetComparators.set(SnippetSortOrder.Bottom, snippetDownComparator);
_snippetComparators.set(SnippetSortOrder.Inline, defaultComparator);

export function getSuggestionComparator(snippetConfig: SnippetSortOrder): (a: CompletionItem, b: CompletionItem) => number {
	return _snippetComparators.get(snippetConfig)!;
}

CommandsRegistry.registerCommand('_executeCompletionItemProvider', async (accessor, ...args: [URI, IPosition, string?, number?]) => {
	const [uri, position, triggerCharacter, maxItemsToResolve] = args;
	assertType(URI.isUri(uri));
	assertType(Position.isIPosition(position));
	assertType(typeof triggerCharacter === 'string' || !triggerCharacter);
	assertType(typeof maxItemsToResolve === 'number' || !maxItemsToResolve);

	const { completionProvider } = accessor.get(ILanguageFeaturesService);
	const ref = await accessor.get(ITextModelService).createModelReference(uri);
	try {

		const result: languages.CompletionList = {
			incomplete: false,
			suggestions: []
		};

		const resolving: Promise<unknown>[] = [];
		const actualPosition = ref.object.textEditorModel.validatePosition(position);
		const completions = await provideSuggestionItems(completionProvider, ref.object.textEditorModel, actualPosition, undefined, { triggerCharacter: triggerCharacter ?? undefined, triggerKind: triggerCharacter ? languages.CompletionTriggerKind.TriggerCharacter : languages.CompletionTriggerKind.Invoke });
		for (const item of completions.items) {
			if (resolving.length < (maxItemsToResolve ?? 0)) {
				resolving.push(item.resolve(CancellationToken.None));
			}
			result.incomplete = result.incomplete || item.container.incomplete;
			result.suggestions.push(item.completion);
		}

		try {
			await Promise.all(resolving);
			return result;
		} finally {
			setTimeout(() => completions.disposable.dispose(), 100);
		}

	} finally {
		ref.dispose();
	}

});

interface SuggestController extends IEditorContribution {
	triggerSuggest(onlyFrom?: Set<languages.CompletionItemProvider>, auto?: boolean, noFilter?: boolean): void;
}

export function showSimpleSuggestions(editor: ICodeEditor, provider: languages.CompletionItemProvider) {
	editor.getContribution<SuggestController>('editor.contrib.suggestController')?.triggerSuggest(
		new Set<languages.CompletionItemProvider>().add(provider), undefined, true
	);
}

export interface ISuggestItemPreselector {
	/**
	 * The preselector with highest priority is asked first.
	*/
	readonly priority: number;

	/**
	 * Is called to preselect a suggest item.
	 * When -1 is returned, item preselectors with lower priority are asked.
	*/
	select(model: ITextModel, pos: IPosition, items: CompletionItem[]): number | -1;
}


export abstract class QuickSuggestionsOptions {

	static isAllOff(config: InternalQuickSuggestionsOptions): boolean {
		return config.other === 'off' && config.comments === 'off' && config.strings === 'off';
	}

	static isAllOn(config: InternalQuickSuggestionsOptions): boolean {
		return config.other === 'on' && config.comments === 'on' && config.strings === 'on';
	}

	static valueFor(config: InternalQuickSuggestionsOptions, tokenType: StandardTokenType): QuickSuggestionsValue {
		switch (tokenType) {
			case StandardTokenType.Comment: return config.comments;
			case StandardTokenType.String: return config.strings;
			default: return config.other;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/suggestAlternatives.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/suggestAlternatives.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { CompletionModel } from './completionModel.js';
import { ISelectedSuggestion } from './suggestWidget.js';

export class SuggestAlternatives {

	static readonly OtherSuggestions = new RawContextKey<boolean>('hasOtherSuggestions', false);

	private readonly _ckOtherSuggestions: IContextKey<boolean>;

	private _index: number = 0;
	private _model: CompletionModel | undefined;
	private _acceptNext: ((selected: ISelectedSuggestion) => unknown) | undefined;
	private _listener: IDisposable | undefined;
	private _ignore: boolean | undefined;

	constructor(
		private readonly _editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		this._ckOtherSuggestions = SuggestAlternatives.OtherSuggestions.bindTo(contextKeyService);
	}

	dispose(): void {
		this.reset();
	}

	reset(): void {
		this._ckOtherSuggestions.reset();
		this._listener?.dispose();
		this._model = undefined;
		this._acceptNext = undefined;
		this._ignore = false;
	}

	set({ model, index }: ISelectedSuggestion, acceptNext: (selected: ISelectedSuggestion) => unknown): void {

		// no suggestions -> nothing to do
		if (model.items.length === 0) {
			this.reset();
			return;
		}

		// no alternative suggestions -> nothing to do
		const nextIndex = SuggestAlternatives._moveIndex(true, model, index);
		if (nextIndex === index) {
			this.reset();
			return;
		}

		this._acceptNext = acceptNext;
		this._model = model;
		this._index = index;
		this._listener = this._editor.onDidChangeCursorPosition(() => {
			if (!this._ignore) {
				this.reset();
			}
		});
		this._ckOtherSuggestions.set(true);
	}

	private static _moveIndex(fwd: boolean, model: CompletionModel, index: number): number {
		let newIndex = index;
		for (let rounds = model.items.length; rounds > 0; rounds--) {
			newIndex = (newIndex + model.items.length + (fwd ? +1 : -1)) % model.items.length;
			if (newIndex === index) {
				break;
			}
			if (!model.items[newIndex].completion.additionalTextEdits) {
				break;
			}
		}
		return newIndex;
	}

	next(): void {
		this._move(true);
	}

	prev(): void {
		this._move(false);
	}

	private _move(fwd: boolean): void {
		if (!this._model) {
			// nothing to reason about
			return;
		}
		try {
			this._ignore = true;
			this._index = SuggestAlternatives._moveIndex(fwd, this._model, this._index);
			this._acceptNext!({ index: this._index, item: this._model.items[this._index], model: this._model });
		} finally {
			this._ignore = false;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/suggestCommitCharacters.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/suggestCommitCharacters.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { CharacterSet } from '../../../common/core/characterClassifier.js';
import { State, SuggestModel } from './suggestModel.js';
import { ISelectedSuggestion, SuggestWidget } from './suggestWidget.js';

export class CommitCharacterController {

	private readonly _disposables = new DisposableStore();

	private _active?: {
		readonly acceptCharacters: CharacterSet;
		readonly item: ISelectedSuggestion;
	};

	constructor(editor: ICodeEditor, widget: SuggestWidget, model: SuggestModel, accept: (selected: ISelectedSuggestion) => unknown) {

		this._disposables.add(model.onDidSuggest(e => {
			if (e.completionModel.items.length === 0) {
				this.reset();
			}
		}));
		this._disposables.add(model.onDidCancel(e => {
			this.reset();
		}));

		this._disposables.add(widget.onDidShow(() => this._onItem(widget.getFocusedItem())));
		this._disposables.add(widget.onDidFocus(this._onItem, this));
		this._disposables.add(widget.onDidHide(this.reset, this));

		this._disposables.add(editor.onWillType(text => {
			if (this._active && !widget.isFrozen() && model.state !== State.Idle) {
				const ch = text.charCodeAt(text.length - 1);
				if (this._active.acceptCharacters.has(ch) && editor.getOption(EditorOption.acceptSuggestionOnCommitCharacter)) {
					accept(this._active.item);
				}
			}
		}));
	}

	private _onItem(selected: ISelectedSuggestion | undefined): void {
		if (!selected || !isNonEmptyArray(selected.item.completion.commitCharacters)) {
			// no item or no commit characters
			this.reset();
			return;
		}

		if (this._active && this._active.item.item === selected.item) {
			// still the same item
			return;
		}

		// keep item and its commit characters
		const acceptCharacters = new CharacterSet();
		for (const ch of selected.item.completion.commitCharacters) {
			if (ch.length > 0) {
				acceptCharacters.add(ch.charCodeAt(0));
			}
		}
		this._active = { acceptCharacters, item: selected };
	}

	reset(): void {
		this._active = undefined;
	}

	dispose() {
		this._disposables.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/suggestController.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/suggestController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { onUnexpectedError, onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { DisposableStore, dispose, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { assertType, isObject } from '../../../../base/common/types.js';
import { StableEditorScrollState } from '../../../browser/stableEditorScroll.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorCommand, EditorContributionInstantiation, registerEditorAction, registerEditorCommand, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { EditOperation } from '../../../common/core/editOperation.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { IEditorContribution, ScrollType } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ITextModel, TrackedRangeStickiness } from '../../../common/model.js';
import { CompletionItemInsertTextRule, CompletionItemProvider, CompletionTriggerKind, ProviderId } from '../../../common/languages.js';
import { SnippetController2 } from '../../snippet/browser/snippetController2.js';
import { SnippetParser } from '../../snippet/browser/snippetParser.js';
import { ISuggestMemoryService } from './suggestMemory.js';
import { WordContextKey } from './wordContextKey.js';
import * as nls from '../../../../nls.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { CompletionItem, Context as SuggestContext, ISuggestItemPreselector, suggestWidgetStatusbarMenu } from './suggest.js';
import { SuggestAlternatives } from './suggestAlternatives.js';
import { CommitCharacterController } from './suggestCommitCharacters.js';
import { State, SuggestModel } from './suggestModel.js';
import { OvertypingCapturer } from './suggestOvertypingCapturer.js';
import { ISelectedSuggestion, SuggestWidget } from './suggestWidget.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { basename, extname } from '../../../../base/common/resources.js';
import { hash } from '../../../../base/common/hash.js';
import { WindowIdleValue, getWindow } from '../../../../base/browser/dom.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { EditSources } from '../../../common/textModelEditSource.js';

// sticky suggest widget which doesn't disappear on focus out and such
const _sticky = false
	// || Boolean("true") // done "weirdly" so that a lint warning prevents you from pushing this
	;

class LineSuffix {

	private readonly _decorationOptions = ModelDecorationOptions.register({
		description: 'suggest-line-suffix',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
	});

	private _marker: string | undefined;

	constructor(private readonly _model: ITextModel, private readonly _position: IPosition) {
		// spy on what's happening right of the cursor. two cases:
		// 1. end of line -> check that it's still end of line
		// 2. mid of line -> add a marker and compute the delta
		const maxColumn = _model.getLineMaxColumn(_position.lineNumber);
		if (maxColumn !== _position.column) {
			const offset = _model.getOffsetAt(_position);
			const end = _model.getPositionAt(offset + 1);
			_model.changeDecorations(accessor => {
				if (this._marker) {
					accessor.removeDecoration(this._marker);
				}
				this._marker = accessor.addDecoration(Range.fromPositions(_position, end), this._decorationOptions);
			});
		}
	}

	dispose(): void {
		if (this._marker && !this._model.isDisposed()) {
			this._model.changeDecorations(accessor => {
				accessor.removeDecoration(this._marker!);
				this._marker = undefined;
			});
		}
	}

	delta(position: IPosition): number {
		if (this._model.isDisposed() || this._position.lineNumber !== position.lineNumber) {
			// bail out early if things seems fishy
			return 0;
		}
		// read the marker (in case suggest was triggered at line end) or compare
		// the cursor to the line end.
		if (this._marker) {
			const range = this._model.getDecorationRange(this._marker);
			const end = this._model.getOffsetAt(range!.getStartPosition());
			return end - this._model.getOffsetAt(position);
		} else {
			return this._model.getLineMaxColumn(position.lineNumber) - position.column;
		}
	}
}

const enum InsertFlags {
	None = 0,
	NoBeforeUndoStop = 1,
	NoAfterUndoStop = 2,
	KeepAlternativeSuggestions = 4,
	AlternativeOverwriteConfig = 8
}

export class SuggestController implements IEditorContribution {

	public static readonly ID: string = 'editor.contrib.suggestController';

	public static get(editor: ICodeEditor): SuggestController | null {
		return editor.getContribution<SuggestController>(SuggestController.ID);
	}

	readonly editor: ICodeEditor;
	readonly model: SuggestModel;
	readonly widget: WindowIdleValue<SuggestWidget>;

	private readonly _alternatives: WindowIdleValue<SuggestAlternatives>;
	private readonly _lineSuffix = new MutableDisposable<LineSuffix>();
	private readonly _toDispose = new DisposableStore();
	private readonly _overtypingCapturer: WindowIdleValue<OvertypingCapturer>;
	private readonly _selectors = new PriorityRegistry<ISuggestItemPreselector>(s => s.priority);

	private readonly _onWillInsertSuggestItem = new Emitter<{ item: CompletionItem }>();
	get onWillInsertSuggestItem() { return this._onWillInsertSuggestItem.event; }

	private _wantsForceRenderingAbove = false;


	constructor(
		editor: ICodeEditor,
		@ISuggestMemoryService private readonly _memoryService: ISuggestMemoryService,
		@ICommandService private readonly _commandService: ICommandService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ILogService private readonly _logService: ILogService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
	) {
		this.editor = editor;
		this.model = _instantiationService.createInstance(SuggestModel, this.editor,);

		// default selector
		this._selectors.register({
			priority: 0,
			select: (model, pos, items) => this._memoryService.select(model, pos, items)
		});

		// context key: update insert/replace mode
		const ctxInsertMode = SuggestContext.InsertMode.bindTo(_contextKeyService);
		ctxInsertMode.set(editor.getOption(EditorOption.suggest).insertMode);
		this._toDispose.add(this.model.onDidTrigger(() => ctxInsertMode.set(editor.getOption(EditorOption.suggest).insertMode)));

		this.widget = this._toDispose.add(new WindowIdleValue(getWindow(editor.getDomNode()), () => {

			const widget = this._instantiationService.createInstance(SuggestWidget, this.editor);

			this._toDispose.add(widget);
			this._toDispose.add(widget.onDidSelect(item => this._insertSuggestion(item, InsertFlags.None), this));

			// Wire up logic to accept a suggestion on certain characters
			const commitCharacterController = new CommitCharacterController(this.editor, widget, this.model, item => this._insertSuggestion(item, InsertFlags.NoAfterUndoStop));
			this._toDispose.add(commitCharacterController);


			// Wire up makes text edit context key
			const ctxMakesTextEdit = SuggestContext.MakesTextEdit.bindTo(this._contextKeyService);
			const ctxHasInsertAndReplace = SuggestContext.HasInsertAndReplaceRange.bindTo(this._contextKeyService);
			const ctxCanResolve = SuggestContext.CanResolve.bindTo(this._contextKeyService);

			this._toDispose.add(toDisposable(() => {
				ctxMakesTextEdit.reset();
				ctxHasInsertAndReplace.reset();
				ctxCanResolve.reset();
			}));

			this._toDispose.add(widget.onDidFocus(({ item }) => {

				// (ctx: makesTextEdit)
				const position = this.editor.getPosition()!;
				const startColumn = item.editStart.column;
				const endColumn = position.column;
				let value = true;
				if (
					this.editor.getOption(EditorOption.acceptSuggestionOnEnter) === 'smart'
					&& this.model.state === State.Auto
					&& !item.completion.additionalTextEdits
					&& !(item.completion.insertTextRules! & CompletionItemInsertTextRule.InsertAsSnippet)
					&& endColumn - startColumn === item.completion.insertText.length
				) {
					const oldText = this.editor.getModel()!.getValueInRange({
						startLineNumber: position.lineNumber,
						startColumn,
						endLineNumber: position.lineNumber,
						endColumn
					});
					value = oldText !== item.completion.insertText;
				}
				ctxMakesTextEdit.set(value);

				// (ctx: hasInsertAndReplaceRange)
				ctxHasInsertAndReplace.set(!Position.equals(item.editInsertEnd, item.editReplaceEnd));

				// (ctx: canResolve)
				ctxCanResolve.set(Boolean(item.provider.resolveCompletionItem) || Boolean(item.completion.documentation) || item.completion.detail !== item.completion.label);
			}));

			if (this._wantsForceRenderingAbove) {
				widget.forceRenderingAbove();
			}

			return widget;
		}));

		// Wire up text overtyping capture
		this._overtypingCapturer = this._toDispose.add(new WindowIdleValue(getWindow(editor.getDomNode()), () => {
			return this._toDispose.add(new OvertypingCapturer(this.editor, this.model));
		}));

		this._alternatives = this._toDispose.add(new WindowIdleValue(getWindow(editor.getDomNode()), () => {
			return this._toDispose.add(new SuggestAlternatives(this.editor, this._contextKeyService));
		}));

		this._toDispose.add(_instantiationService.createInstance(WordContextKey, editor));

		this._toDispose.add(this.model.onDidTrigger(e => {
			this.widget.value.showTriggered(e.auto, e.shy ? 250 : 50);
			this._lineSuffix.value = new LineSuffix(this.editor.getModel()!, e.position);
		}));
		this._toDispose.add(this.model.onDidSuggest(e => {
			if (e.triggerOptions.shy) {
				return;
			}
			let index = -1;
			for (const selector of this._selectors.itemsOrderedByPriorityDesc) {
				index = selector.select(this.editor.getModel()!, this.editor.getPosition()!, e.completionModel.items);
				if (index !== -1) {
					break;
				}
			}
			if (index === -1) {
				index = 0;
			}
			if (this.model.state === State.Idle) {
				// selecting an item can "pump" out selection/cursor change events
				// which can cancel suggest halfway through this function. therefore
				// we need to check again and bail if the session has been canceled
				return;
			}
			let noFocus = false;
			if (e.triggerOptions.auto) {
				// don't "focus" item when configured to do
				const options = this.editor.getOption(EditorOption.suggest);
				if (options.selectionMode === 'never' || options.selectionMode === 'always') {
					// simple: always or never
					noFocus = options.selectionMode === 'never';

				} else if (options.selectionMode === 'whenTriggerCharacter') {
					// on with trigger character
					noFocus = e.triggerOptions.triggerKind !== CompletionTriggerKind.TriggerCharacter;

				} else if (options.selectionMode === 'whenQuickSuggestion') {
					// without trigger character or when refiltering
					noFocus = e.triggerOptions.triggerKind === CompletionTriggerKind.TriggerCharacter && !e.triggerOptions.refilter;
				}

			}
			this.widget.value.showSuggestions(e.completionModel, index, e.isFrozen, e.triggerOptions.auto, noFocus);
		}));
		this._toDispose.add(this.model.onDidCancel(e => {
			if (!e.retrigger) {
				this.widget.value.hideWidget();
			}
		}));
		this._toDispose.add(this.editor.onDidBlurEditorWidget(() => {
			if (!_sticky) {
				this.model.cancel();
				this.model.clear();
			}
		}));

		// Manage the acceptSuggestionsOnEnter context key
		const acceptSuggestionsOnEnter = SuggestContext.AcceptSuggestionsOnEnter.bindTo(_contextKeyService);
		const updateFromConfig = () => {
			const acceptSuggestionOnEnter = this.editor.getOption(EditorOption.acceptSuggestionOnEnter);
			acceptSuggestionsOnEnter.set(acceptSuggestionOnEnter === 'on' || acceptSuggestionOnEnter === 'smart');
		};
		this._toDispose.add(this.editor.onDidChangeConfiguration(() => updateFromConfig()));
		updateFromConfig();
	}

	dispose(): void {
		this._alternatives.dispose();
		this._toDispose.dispose();
		this.widget.dispose();
		this.model.dispose();
		this._lineSuffix.dispose();
		this._onWillInsertSuggestItem.dispose();
	}

	protected _insertSuggestion(
		event: ISelectedSuggestion | undefined,
		flags: InsertFlags
	): void {
		if (!event || !event.item) {
			this._alternatives.value.reset();
			this.model.cancel();
			this.model.clear();
			return;
		}
		if (!this.editor.hasModel()) {
			return;
		}
		const snippetController = SnippetController2.get(this.editor);
		if (!snippetController) {
			return;
		}

		this._onWillInsertSuggestItem.fire({ item: event.item });

		const model = this.editor.getModel();
		const modelVersionNow = model.getAlternativeVersionId();
		const { item } = event;

		//
		const tasks: Promise<unknown>[] = [];
		const cts = new CancellationTokenSource();

		// pushing undo stops *before* additional text edits and
		// *after* the main edit
		if (!(flags & InsertFlags.NoBeforeUndoStop)) {
			this.editor.pushUndoStop();
		}

		// compute overwrite[Before|After] deltas BEFORE applying extra edits
		const info = this.getOverwriteInfo(item, Boolean(flags & InsertFlags.AlternativeOverwriteConfig));

		// keep item in memory
		this._memoryService.memorize(model, this.editor.getPosition(), item);

		const isResolved = item.isResolved;

		// telemetry data points: duration of command execution, info about async additional edits (-1=n/a, -2=none, 1=success, 0=failed)
		let _commandExectionDuration = -1;
		let _additionalEditsAppliedAsync = -1;

		if (Array.isArray(item.completion.additionalTextEdits)) {

			// cancel -> stops all listening and closes widget
			this.model.cancel();

			// sync additional edits
			const scrollState = StableEditorScrollState.capture(this.editor);
			this.editor.executeEdits(
				'suggestController.additionalTextEdits.sync',
				item.completion.additionalTextEdits.map(edit => {
					let range = Range.lift(edit.range);
					if (range.startLineNumber === item.position.lineNumber && range.startColumn > item.position.column) {
						// shift additional edit when it is "after" the completion insertion position
						const columnDelta = this.editor.getPosition()!.column - item.position.column;
						const startColumnDelta = columnDelta;
						const endColumnDelta = Range.spansMultipleLines(range) ? 0 : columnDelta;
						range = new Range(range.startLineNumber, range.startColumn + startColumnDelta, range.endLineNumber, range.endColumn + endColumnDelta);
					}
					return EditOperation.replaceMove(range, edit.text);
				})
			);
			scrollState.restoreRelativeVerticalPositionOfCursor(this.editor);

		} else if (!isResolved) {
			// async additional edits
			const sw = new StopWatch();
			let position: IPosition | undefined;

			const docListener = model.onDidChangeContent(e => {
				if (e.isFlush) {
					cts.cancel();
					docListener.dispose();
					return;
				}
				for (const change of e.changes) {
					const thisPosition = Range.getEndPosition(change.range);
					if (!position || Position.isBefore(thisPosition, position)) {
						position = thisPosition;
					}
				}
			});

			const oldFlags = flags;
			flags |= InsertFlags.NoAfterUndoStop;
			let didType = false;
			const typeListener = this.editor.onWillType(() => {
				typeListener.dispose();
				didType = true;
				if (!(oldFlags & InsertFlags.NoAfterUndoStop)) {
					this.editor.pushUndoStop();
				}
			});

			tasks.push(item.resolve(cts.token).then(() => {
				if (!item.completion.additionalTextEdits || cts.token.isCancellationRequested) {
					return undefined;
				}
				if (position && item.completion.additionalTextEdits.some(edit => Position.isBefore(position!, Range.getStartPosition(edit.range)))) {
					return false;
				}
				if (didType) {
					this.editor.pushUndoStop();
				}
				const scrollState = StableEditorScrollState.capture(this.editor);
				this.editor.executeEdits(
					'suggestController.additionalTextEdits.async',
					item.completion.additionalTextEdits.map(edit => EditOperation.replaceMove(Range.lift(edit.range), edit.text))
				);
				scrollState.restoreRelativeVerticalPositionOfCursor(this.editor);
				if (didType || !(oldFlags & InsertFlags.NoAfterUndoStop)) {
					this.editor.pushUndoStop();
				}
				return true;
			}).then(applied => {
				this._logService.trace('[suggest] async resolving of edits DONE (ms, applied?)', sw.elapsed(), applied);
				_additionalEditsAppliedAsync = applied === true ? 1 : applied === false ? 0 : -2;
			}).finally(() => {
				docListener.dispose();
				typeListener.dispose();
			}));
		}

		let { insertText } = item.completion;
		if (!(item.completion.insertTextRules! & CompletionItemInsertTextRule.InsertAsSnippet)) {
			insertText = SnippetParser.escape(insertText);
		}

		// cancel -> stops all listening and closes widget
		this.model.cancel();

		snippetController.insert(insertText, {
			overwriteBefore: info.overwriteBefore,
			overwriteAfter: info.overwriteAfter,
			undoStopBefore: false,
			undoStopAfter: false,
			adjustWhitespace: !(item.completion.insertTextRules! & CompletionItemInsertTextRule.KeepWhitespace),
			clipboardText: event.model.clipboardText,
			overtypingCapturer: this._overtypingCapturer.value,
			reason: EditSources.suggest({ providerId: ProviderId.fromExtensionId(item.extensionId?.value) }),
		});

		if (!(flags & InsertFlags.NoAfterUndoStop)) {
			this.editor.pushUndoStop();
		}

		if (item.completion.command) {
			if (item.completion.command.id === TriggerSuggestAction.id) {
				// retigger
				this.model.trigger({ auto: true, retrigger: true });
			} else {
				// exec command, done
				const sw = new StopWatch();
				tasks.push(this._commandService.executeCommand(item.completion.command.id, ...(item.completion.command.arguments ? [...item.completion.command.arguments] : [])).catch(e => {
					if (item.completion.extensionId) {
						onUnexpectedExternalError(e);
					} else {
						onUnexpectedError(e);
					}
				}).finally(() => {
					_commandExectionDuration = sw.elapsed();
				}));
			}
		}

		if (flags & InsertFlags.KeepAlternativeSuggestions) {
			this._alternatives.value.set(event, next => {

				// cancel resolving of additional edits
				cts.cancel();

				// this is not so pretty. when inserting the 'next'
				// suggestion we undo until we are at the state at
				// which we were before inserting the previous suggestion...
				while (model.canUndo()) {
					if (modelVersionNow !== model.getAlternativeVersionId()) {
						model.undo();
					}
					this._insertSuggestion(
						next,
						InsertFlags.NoBeforeUndoStop | InsertFlags.NoAfterUndoStop | (flags & InsertFlags.AlternativeOverwriteConfig ? InsertFlags.AlternativeOverwriteConfig : 0)
					);
					break;
				}
			});
		}

		this._alertCompletionItem(item);

		// clear only now - after all tasks are done
		Promise.all(tasks).finally(() => {
			this._reportSuggestionAcceptedTelemetry(item, model, isResolved, _commandExectionDuration, _additionalEditsAppliedAsync, event.index, event.model.items);

			this.model.clear();
			cts.dispose();
		});
	}

	private _reportSuggestionAcceptedTelemetry(item: CompletionItem, model: ITextModel, itemResolved: boolean, commandExectionDuration: number, additionalEditsAppliedAsync: number, index: number, completionItems: CompletionItem[]): void {
		if (Math.random() > 0.0001) { // 0.01%
			return;
		}

		const labelMap = new Map<string, number[]>();

		for (let i = 0; i < Math.min(30, completionItems.length); i++) {
			const label = completionItems[i].textLabel;

			if (labelMap.has(label)) {
				labelMap.get(label)!.push(i);
			} else {
				labelMap.set(label, [i]);
			}
		}

		const firstIndexArray = labelMap.get(item.textLabel);
		const hasDuplicates = firstIndexArray && firstIndexArray.length > 1;
		const firstIndex = hasDuplicates ? firstIndexArray[0] : -1;

		type AcceptedSuggestion = {
			extensionId: string; providerId: string;
			fileExtension: string; languageId: string; basenameHash: string; kind: number;
			resolveInfo: number; resolveDuration: number;
			commandDuration: number;
			additionalEditsAsync: number;
			index: number; firstIndex: number;
		};
		type AcceptedSuggestionClassification = {
			owner: 'jrieken';
			comment: 'Information accepting completion items';
			extensionId: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'Extension contributing the completions item' };
			providerId: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'Provider of the completions item' };
			basenameHash: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'Hash of the basename of the file into which the completion was inserted' };
			fileExtension: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'File extension of the file into which the completion was inserted' };
			languageId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Language type of the file into which the completion was inserted' };
			kind: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The completion item kind' };
			resolveInfo: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'If the item was inserted before resolving was done' };
			resolveDuration: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'How long resolving took to finish' };
			commandDuration: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'How long a completion item command took' };
			additionalEditsAsync: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Info about asynchronously applying additional edits' };
			index: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The index of the completion item in the sorted list.' };
			firstIndex: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'When there are multiple completions, the index of the first instance.' };
		};

		this._telemetryService.publicLog2<AcceptedSuggestion, AcceptedSuggestionClassification>('suggest.acceptedSuggestion', {
			extensionId: item.extensionId?.value ?? 'unknown',
			providerId: item.provider._debugDisplayName ?? 'unknown',
			kind: item.completion.kind,
			basenameHash: hash(basename(model.uri)).toString(16),
			languageId: model.getLanguageId(),
			fileExtension: extname(model.uri),
			resolveInfo: !item.provider.resolveCompletionItem ? -1 : itemResolved ? 1 : 0,
			resolveDuration: item.resolveDuration,
			commandDuration: commandExectionDuration,
			additionalEditsAsync: additionalEditsAppliedAsync,
			index,
			firstIndex,
		});
	}

	getOverwriteInfo(item: CompletionItem, toggleMode: boolean): { overwriteBefore: number; overwriteAfter: number } {
		assertType(this.editor.hasModel());

		let replace = this.editor.getOption(EditorOption.suggest).insertMode === 'replace';
		if (toggleMode) {
			replace = !replace;
		}
		const overwriteBefore = item.position.column - item.editStart.column;
		const overwriteAfter = (replace ? item.editReplaceEnd.column : item.editInsertEnd.column) - item.position.column;
		const columnDelta = this.editor.getPosition().column - item.position.column;
		const suffixDelta = this._lineSuffix.value ? this._lineSuffix.value.delta(this.editor.getPosition()) : 0;

		return {
			overwriteBefore: overwriteBefore + columnDelta,
			overwriteAfter: overwriteAfter + suffixDelta
		};
	}

	private _alertCompletionItem(item: CompletionItem): void {
		if (isNonEmptyArray(item.completion.additionalTextEdits)) {
			const msg = nls.localize('aria.alert.snippet', "Accepting '{0}' made {1} additional edits", item.textLabel, item.completion.additionalTextEdits.length);
			alert(msg);
		}
	}

	triggerSuggest(onlyFrom?: Set<CompletionItemProvider>, auto?: boolean, noFilter?: boolean): void {
		if (this.editor.hasModel()) {
			this.model.trigger({
				auto: auto ?? false,
				completionOptions: { providerFilter: onlyFrom, kindFilter: noFilter ? new Set() : undefined }
			});
			this.editor.revealPosition(this.editor.getPosition(), ScrollType.Smooth);
			this.editor.focus();
		}
	}

	triggerSuggestAndAcceptBest(arg: { fallback: string }): void {
		if (!this.editor.hasModel()) {
			return;

		}
		const positionNow = this.editor.getPosition();

		const fallback = () => {
			if (positionNow.equals(this.editor.getPosition()!)) {
				this._commandService.executeCommand(arg.fallback);
			}
		};

		const makesTextEdit = (item: CompletionItem): boolean => {
			if (item.completion.insertTextRules! & CompletionItemInsertTextRule.InsertAsSnippet || item.completion.additionalTextEdits) {
				// snippet, other editor -> makes edit
				return true;
			}
			const position = this.editor.getPosition()!;
			const startColumn = item.editStart.column;
			const endColumn = position.column;
			if (endColumn - startColumn !== item.completion.insertText.length) {
				// unequal lengths -> makes edit
				return true;
			}
			const textNow = this.editor.getModel()!.getValueInRange({
				startLineNumber: position.lineNumber,
				startColumn,
				endLineNumber: position.lineNumber,
				endColumn
			});
			// unequal text -> makes edit
			return textNow !== item.completion.insertText;
		};

		Event.once(this.model.onDidTrigger)(_ => {
			// wait for trigger because only then the cancel-event is trustworthy
			const listener: IDisposable[] = [];

			Event.any<unknown>(this.model.onDidTrigger, this.model.onDidCancel)(() => {
				// retrigger or cancel -> try to type default text
				dispose(listener);
				fallback();
			}, undefined, listener);

			this.model.onDidSuggest(({ completionModel }) => {
				dispose(listener);
				if (completionModel.items.length === 0) {
					fallback();
					return;
				}
				const index = this._memoryService.select(this.editor.getModel()!, this.editor.getPosition()!, completionModel.items);
				const item = completionModel.items[index];
				if (!makesTextEdit(item)) {
					fallback();
					return;
				}
				this.editor.pushUndoStop();
				this._insertSuggestion({ index, item, model: completionModel }, InsertFlags.KeepAlternativeSuggestions | InsertFlags.NoBeforeUndoStop | InsertFlags.NoAfterUndoStop);

			}, undefined, listener);
		});

		this.model.trigger({ auto: false, shy: true });
		this.editor.revealPosition(positionNow, ScrollType.Smooth);
		this.editor.focus();
	}

	acceptSelectedSuggestion(keepAlternativeSuggestions: boolean, alternativeOverwriteConfig: boolean): void {
		const item = this.widget.value.getFocusedItem();
		let flags = 0;
		if (keepAlternativeSuggestions) {
			flags |= InsertFlags.KeepAlternativeSuggestions;
		}
		if (alternativeOverwriteConfig) {
			flags |= InsertFlags.AlternativeOverwriteConfig;
		}
		this._insertSuggestion(item, flags);
	}

	acceptNextSuggestion() {
		this._alternatives.value.next();
	}

	acceptPrevSuggestion() {
		this._alternatives.value.prev();
	}

	cancelSuggestWidget(): void {
		this.model.cancel();
		this.model.clear();
		this.widget.value.hideWidget();
	}

	focusSuggestion(): void {
		this.widget.value.focusSelected();
	}

	selectNextSuggestion(): void {
		this.widget.value.selectNext();
	}

	selectNextPageSuggestion(): void {
		this.widget.value.selectNextPage();
	}

	selectLastSuggestion(): void {
		this.widget.value.selectLast();
	}

	selectPrevSuggestion(): void {
		this.widget.value.selectPrevious();
	}

	selectPrevPageSuggestion(): void {
		this.widget.value.selectPreviousPage();
	}

	selectFirstSuggestion(): void {
		this.widget.value.selectFirst();
	}

	toggleSuggestionDetails(): void {
		this.widget.value.toggleDetails();
	}

	toggleExplainMode(): void {
		this.widget.value.toggleExplainMode();
	}

	toggleSuggestionFocus(): void {
		this.widget.value.toggleDetailsFocus();
	}

	resetWidgetSize(): void {
		this.widget.value.resetPersistedSize();
	}

	forceRenderingAbove() {
		if (this.widget.isInitialized) {
			this.widget.value.forceRenderingAbove();
		} else {
			// Defer this until the widget is created
			this._wantsForceRenderingAbove = true;
		}
	}

	stopForceRenderingAbove() {
		if (this.widget.isInitialized) {
			this.widget.value.stopForceRenderingAbove();
		} else {
			this._wantsForceRenderingAbove = false;
		}
	}

	registerSelector(selector: ISuggestItemPreselector): IDisposable {
		return this._selectors.register(selector);
	}
}

class PriorityRegistry<T> {
	private readonly _items = new Array<T>();

	constructor(private readonly prioritySelector: (item: T) => number) { }

	register(value: T): IDisposable {
		if (this._items.indexOf(value) !== -1) {
			throw new Error('Value is already registered');
		}
		this._items.push(value);
		this._items.sort((s1, s2) => this.prioritySelector(s2) - this.prioritySelector(s1));

		return {
			dispose: () => {
				const idx = this._items.indexOf(value);
				if (idx >= 0) {
					this._items.splice(idx, 1);
				}
			}
		};
	}

	get itemsOrderedByPriorityDesc(): readonly T[] {
		return this._items;
	}
}

export class TriggerSuggestAction extends EditorAction {

	static readonly id = 'editor.action.triggerSuggest';

	constructor() {
		super({
			id: TriggerSuggestAction.id,
			label: nls.localize2('suggest.trigger.label', "Trigger Suggest"),
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCompletionItemProvider, SuggestContext.Visible.toNegated()),
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: KeyMod.CtrlCmd | KeyCode.Space,
				secondary: [KeyMod.CtrlCmd | KeyCode.KeyI],
				mac: { primary: KeyMod.WinCtrl | KeyCode.Space, secondary: [KeyMod.Alt | KeyCode.Escape, KeyMod.CtrlCmd | KeyCode.KeyI] },
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	run(_accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void {
		const controller = SuggestController.get(editor);

		if (!controller) {
			return;
		}

		type TriggerArgs = { auto: boolean };
		let auto: boolean | undefined;
		if (args && typeof args === 'object') {
			if ((<TriggerArgs>args).auto === true) {
				auto = true;
			}
		}

		controller.triggerSuggest(undefined, auto, undefined);
	}
}

registerEditorContribution(SuggestController.ID, SuggestController, EditorContributionInstantiation.BeforeFirstInteraction);
registerEditorAction(TriggerSuggestAction);

const weight = KeybindingWeight.EditorContrib + 90;

const SuggestCommand = EditorCommand.bindToContribution<SuggestController>(SuggestController.get);


registerEditorCommand(new SuggestCommand({
	id: 'acceptSelectedSuggestion',
	precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.HasFocusedSuggestion),
	handler(x) {
		x.acceptSelectedSuggestion(true, false);
	},
	kbOpts: [{
		// normal tab
		primary: KeyCode.Tab,
		kbExpr: ContextKeyExpr.and(SuggestContext.Visible, EditorContextKeys.textInputFocus),
		weight,
	}, {
		// accept on enter has special rules
		primary: KeyCode.Enter,
		kbExpr: ContextKeyExpr.and(SuggestContext.Visible, EditorContextKeys.textInputFocus, SuggestContext.AcceptSuggestionsOnEnter, SuggestContext.MakesTextEdit),
		weight,
	}],
	menuOpts: [{
		menuId: suggestWidgetStatusbarMenu,
		title: nls.localize('accept.insert', "Insert"),
		group: 'left',
		order: 1,
		when: ContextKeyExpr.and(SuggestContext.HasFocusedSuggestion, SuggestContext.HasInsertAndReplaceRange.toNegated())
	}, {
		menuId: suggestWidgetStatusbarMenu,
		title: nls.localize('accept.insert', "Insert"),
		group: 'left',
		order: 1,
		when: ContextKeyExpr.and(SuggestContext.HasFocusedSuggestion, SuggestContext.HasInsertAndReplaceRange, SuggestContext.InsertMode.isEqualTo('insert'))
	}, {
		menuId: suggestWidgetStatusbarMenu,
		title: nls.localize('accept.replace', "Replace"),
		group: 'left',
		order: 1,
		when: ContextKeyExpr.and(SuggestContext.HasFocusedSuggestion, SuggestContext.HasInsertAndReplaceRange, SuggestContext.InsertMode.isEqualTo('replace'))
	}]
}));

registerEditorCommand(new SuggestCommand({
	id: 'acceptAlternativeSelectedSuggestion',
	precondition: ContextKeyExpr.and(SuggestContext.Visible, EditorContextKeys.textInputFocus, SuggestContext.HasFocusedSuggestion),
	kbOpts: {
		weight: weight,
		kbExpr: EditorContextKeys.textInputFocus,
		primary: KeyMod.Shift | KeyCode.Enter,
		secondary: [KeyMod.Shift | KeyCode.Tab],
	},
	handler(x) {
		x.acceptSelectedSuggestion(false, true);
	},
	menuOpts: [{
		menuId: suggestWidgetStatusbarMenu,
		group: 'left',
		order: 2,
		when: ContextKeyExpr.and(SuggestContext.HasFocusedSuggestion, SuggestContext.HasInsertAndReplaceRange, SuggestContext.InsertMode.isEqualTo('insert')),
		title: nls.localize('accept.replace', "Replace")
	}, {
		menuId: suggestWidgetStatusbarMenu,
		group: 'left',
		order: 2,
		when: ContextKeyExpr.and(SuggestContext.HasFocusedSuggestion, SuggestContext.HasInsertAndReplaceRange, SuggestContext.InsertMode.isEqualTo('replace')),
		title: nls.localize('accept.insert', "Insert")
	}]
}));


// continue to support the old command
CommandsRegistry.registerCommandAlias('acceptSelectedSuggestionOnEnter', 'acceptSelectedSuggestion');

registerEditorCommand(new SuggestCommand({
	id: 'hideSuggestWidget',
	precondition: SuggestContext.Visible,
	handler: x => x.cancelSuggestWidget(),
	kbOpts: {
		weight: weight,
		kbExpr: EditorContextKeys.textInputFocus,
		primary: KeyCode.Escape,
		secondary: [KeyMod.Shift | KeyCode.Escape]
	}
}));

registerEditorCommand(new SuggestCommand({
	id: 'selectNextSuggestion',
	precondition: ContextKeyExpr.and(SuggestContext.Visible, ContextKeyExpr.or(SuggestContext.MultipleSuggestions, SuggestContext.HasFocusedSuggestion.negate())),
	handler: c => c.selectNextSuggestion(),
	kbOpts: {
		weight: weight,
		kbExpr: EditorContextKeys.textInputFocus,
		primary: KeyCode.DownArrow,
		secondary: [KeyMod.CtrlCmd | KeyCode.DownArrow],
		mac: { primary: KeyCode.DownArrow, secondary: [KeyMod.CtrlCmd | KeyCode.DownArrow, KeyMod.WinCtrl | KeyCode.KeyN] }
	},
	menuOpts: {
		menuId: suggestWidgetStatusbarMenu,
		group: 'left',
		order: 0,
		when: SuggestContext.HasFocusedSuggestion.toNegated(),
		title: nls.localize('focus.suggestion', "Select")
	}
}));

registerEditorCommand(new SuggestCommand({
	id: 'selectNextPageSuggestion',
	precondition: ContextKeyExpr.and(SuggestContext.Visible, ContextKeyExpr.or(SuggestContext.MultipleSuggestions, SuggestContext.HasFocusedSuggestion.negate())),
	handler: c => c.selectNextPageSuggestion(),
	kbOpts: {
		weight: weight,
		kbExpr: EditorContextKeys.textInputFocus,
		primary: KeyCode.PageDown,
		secondary: [KeyMod.CtrlCmd | KeyCode.PageDown]
	}
}));

registerEditorCommand(new SuggestCommand({
	id: 'selectLastSuggestion',
	precondition: ContextKeyExpr.and(SuggestContext.Visible, ContextKeyExpr.or(SuggestContext.MultipleSuggestions, SuggestContext.HasFocusedSuggestion.negate())),
	handler: c => c.selectLastSuggestion()
}));

registerEditorCommand(new SuggestCommand({
	id: 'selectPrevSuggestion',
	precondition: ContextKeyExpr.and(SuggestContext.Visible, ContextKeyExpr.or(SuggestContext.MultipleSuggestions, SuggestContext.HasFocusedSuggestion.negate())),
	handler: c => c.selectPrevSuggestion(),
	kbOpts: {
		weight: weight,
		kbExpr: EditorContextKeys.textInputFocus,
		primary: KeyCode.UpArrow,
		secondary: [KeyMod.CtrlCmd | KeyCode.UpArrow],
		mac: { primary: KeyCode.UpArrow, secondary: [KeyMod.CtrlCmd | KeyCode.UpArrow, KeyMod.WinCtrl | KeyCode.KeyP] }
	}
}));

registerEditorCommand(new SuggestCommand({
	id: 'selectPrevPageSuggestion',
	precondition: ContextKeyExpr.and(SuggestContext.Visible, ContextKeyExpr.or(SuggestContext.MultipleSuggestions, SuggestContext.HasFocusedSuggestion.negate())),
	handler: c => c.selectPrevPageSuggestion(),
	kbOpts: {
		weight: weight,
		kbExpr: EditorContextKeys.textInputFocus,
		primary: KeyCode.PageUp,
		secondary: [KeyMod.CtrlCmd | KeyCode.PageUp]
	}
}));

registerEditorCommand(new SuggestCommand({
	id: 'selectFirstSuggestion',
	precondition: ContextKeyExpr.and(SuggestContext.Visible, ContextKeyExpr.or(SuggestContext.MultipleSuggestions, SuggestContext.HasFocusedSuggestion.negate())),
	handler: c => c.selectFirstSuggestion()
}));

registerEditorCommand(new SuggestCommand({
	id: 'focusSuggestion',
	precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.HasFocusedSuggestion.negate()),
	handler: x => x.focusSuggestion(),
	kbOpts: {
		weight: weight,
		kbExpr: EditorContextKeys.textInputFocus,
		primary: KeyMod.CtrlCmd | KeyCode.Space,
		secondary: [KeyMod.CtrlCmd | KeyCode.KeyI],
		mac: { primary: KeyMod.WinCtrl | KeyCode.Space, secondary: [KeyMod.CtrlCmd | KeyCode.KeyI] }
	},
}));

registerEditorCommand(new SuggestCommand({
	id: 'focusAndAcceptSuggestion',
	precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.HasFocusedSuggestion.negate()),
	handler: c => {
		c.focusSuggestion();
		c.acceptSelectedSuggestion(true, false);
	}
}));

registerEditorCommand(new SuggestCommand({
	id: 'toggleSuggestionDetails',
	precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.HasFocusedSuggestion),
	handler: x => x.toggleSuggestionDetails(),
	kbOpts: {
		weight: weight,
		kbExpr: EditorContextKeys.textInputFocus,
		primary: KeyMod.CtrlCmd | KeyCode.Space,
		secondary: [KeyMod.CtrlCmd | KeyCode.KeyI],
		mac: { primary: KeyMod.WinCtrl | KeyCode.Space, secondary: [KeyMod.CtrlCmd | KeyCode.KeyI] }
	},
	menuOpts: [{
		menuId: suggestWidgetStatusbarMenu,
		group: 'right',
		order: 1,
		when: ContextKeyExpr.and(SuggestContext.DetailsVisible, SuggestContext.CanResolve),
		title: nls.localize('detail.more', "Show Less")
	}, {
		menuId: suggestWidgetStatusbarMenu,
		group: 'right',
		order: 1,
		when: ContextKeyExpr.and(SuggestContext.DetailsVisible.toNegated(), SuggestContext.CanResolve),
		title: nls.localize('detail.less', "Show More")
	}]
}));

registerEditorCommand(new SuggestCommand({
	id: 'toggleExplainMode',
	precondition: SuggestContext.Visible,
	handler: x => x.toggleExplainMode(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib,
		primary: KeyMod.CtrlCmd | KeyCode.Slash,
	}
}));

registerEditorCommand(new SuggestCommand({
	id: 'toggleSuggestionFocus',
	precondition: SuggestContext.Visible,
	handler: x => x.toggleSuggestionFocus(),
	kbOpts: {
		weight: weight,
		kbExpr: EditorContextKeys.textInputFocus,
		primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Space,
		mac: { primary: KeyMod.WinCtrl | KeyMod.Alt | KeyCode.Space }
	}
}));

//#region tab completions

registerEditorCommand(new SuggestCommand({
	id: 'insertBestCompletion',
	precondition: ContextKeyExpr.and(
		EditorContextKeys.textInputFocus,
		ContextKeyExpr.equals('config.editor.tabCompletion', 'on'),
		WordContextKey.AtEnd,
		SuggestContext.Visible.toNegated(),
		SuggestAlternatives.OtherSuggestions.toNegated(),
		SnippetController2.InSnippetMode.toNegated()
	),
	handler: (x, arg) => {

		x.triggerSuggestAndAcceptBest(isObject(arg) ? { fallback: 'tab', ...arg } : { fallback: 'tab' });
	},
	kbOpts: {
		weight,
		primary: KeyCode.Tab
	}
}));

registerEditorCommand(new SuggestCommand({
	id: 'insertNextSuggestion',
	precondition: ContextKeyExpr.and(
		EditorContextKeys.textInputFocus,
		ContextKeyExpr.equals('config.editor.tabCompletion', 'on'),
		SuggestAlternatives.OtherSuggestions,
		SuggestContext.Visible.toNegated(),
		SnippetController2.InSnippetMode.toNegated()
	),
	handler: x => x.acceptNextSuggestion(),
	kbOpts: {
		weight: weight,
		kbExpr: EditorContextKeys.textInputFocus,
		primary: KeyCode.Tab
	}
}));

registerEditorCommand(new SuggestCommand({
	id: 'insertPrevSuggestion',
	precondition: ContextKeyExpr.and(
		EditorContextKeys.textInputFocus,
		ContextKeyExpr.equals('config.editor.tabCompletion', 'on'),
		SuggestAlternatives.OtherSuggestions,
		SuggestContext.Visible.toNegated(),
		SnippetController2.InSnippetMode.toNegated()
	),
	handler: x => x.acceptPrevSuggestion(),
	kbOpts: {
		weight: weight,
		kbExpr: EditorContextKeys.textInputFocus,
		primary: KeyMod.Shift | KeyCode.Tab
	}
}));


registerEditorCommand(new class extends EditorCommand {
	constructor() {
		super({
			id: 'suggestWidgetCopy',
			precondition: SuggestContext.DetailsFocused,
			kbOpts: {
				weight: weight + 10,
				kbExpr: SuggestContext.DetailsFocused,
				primary: KeyMod.CtrlCmd | KeyCode.KeyC,
				win: { primary: KeyMod.CtrlCmd | KeyCode.KeyC, secondary: [KeyMod.CtrlCmd | KeyCode.Insert] }
			}
		});
	}
	runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor) {
		getWindow(editor.getDomNode()).document.execCommand('copy');
	}
}());

registerEditorAction(class extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.resetSuggestSize',
			label: nls.localize2('suggest.reset.label', "Reset Suggest Widget Size"),
			precondition: undefined
		});
	}

	run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		SuggestController.get(editor)?.resetWidgetSize();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/suggestInlineCompletions.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/suggestInlineCompletions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { FuzzyScore } from '../../../../base/common/filters.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Disposable, RefCountedDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { ISingleEditOperation } from '../../../common/core/editOperation.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { IRange, Range } from '../../../common/core/range.js';
import { IWordAtPosition } from '../../../common/core/wordHelper.js';
import { registerEditorFeature } from '../../../common/editorFeatures.js';
import { Command, CompletionItemInsertTextRule, CompletionItemProvider, CompletionTriggerKind, InlineCompletion, InlineCompletionContext, InlineCompletions, InlineCompletionsProvider } from '../../../common/languages.js';
import { ITextModel } from '../../../common/model.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { CompletionModel, LineContext } from './completionModel.js';
import { CompletionItem, CompletionItemModel, CompletionOptions, provideSuggestionItems, QuickSuggestionsOptions } from './suggest.js';
import { ISuggestMemoryService } from './suggestMemory.js';
import { SuggestModel } from './suggestModel.js';
import { WordDistance } from './wordDistance.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';

class SuggestInlineCompletion implements InlineCompletion {
	readonly doNotLog = true;

	constructor(
		readonly range: IRange,
		readonly insertText: string | { snippet: string },
		readonly filterText: string,
		readonly additionalTextEdits: ISingleEditOperation[] | undefined,
		readonly command: Command | undefined,
		readonly gutterMenuLinkAction: Command | undefined,
		readonly completion: CompletionItem,
	) { }
}

class InlineCompletionResults extends RefCountedDisposable implements InlineCompletions<SuggestInlineCompletion> {

	constructor(
		readonly model: ITextModel,
		readonly line: number,
		readonly word: IWordAtPosition,
		readonly completionModel: CompletionModel,
		completions: CompletionItemModel,
		@ISuggestMemoryService private readonly _suggestMemoryService: ISuggestMemoryService,
	) {
		super(completions.disposable);
	}

	canBeReused(model: ITextModel, line: number, word: IWordAtPosition) {
		return this.model === model // same model
			&& this.line === line
			&& this.word.word.length > 0
			&& this.word.startColumn === word.startColumn && this.word.endColumn < word.endColumn // same word
			&& this.completionModel.getIncompleteProvider().size === 0; // no incomplete results
	}

	get items(): SuggestInlineCompletion[] {
		const result: SuggestInlineCompletion[] = [];

		// Split items by preselected index. This ensures the memory-selected item shows first and that better/worst
		// ranked items are before/after
		const { items } = this.completionModel;
		const selectedIndex = this._suggestMemoryService.select(this.model, { lineNumber: this.line, column: this.word.endColumn + this.completionModel.lineContext.characterCountDelta }, items);
		const first = Iterable.slice(items, selectedIndex);
		const second = Iterable.slice(items, 0, selectedIndex);

		let resolveCount = 5;

		for (const item of Iterable.concat(first, second)) {

			if (item.score === FuzzyScore.Default) {
				// skip items that have no overlap
				continue;
			}

			const range = new Range(
				item.editStart.lineNumber, item.editStart.column,
				item.editInsertEnd.lineNumber, item.editInsertEnd.column + this.completionModel.lineContext.characterCountDelta // end PLUS character delta
			);
			const insertText = item.completion.insertTextRules && (item.completion.insertTextRules & CompletionItemInsertTextRule.InsertAsSnippet)
				? { snippet: item.completion.insertText }
				: item.completion.insertText;

			result.push(new SuggestInlineCompletion(
				range,
				insertText,
				item.filterTextLow ?? item.labelLow,
				item.completion.additionalTextEdits,
				item.completion.command,
				item.completion.action,
				item
			));

			// resolve the first N suggestions eagerly
			if (resolveCount-- >= 0) {
				item.resolve(CancellationToken.None);
			}
		}
		return result;
	}
}


export class SuggestInlineCompletions extends Disposable implements InlineCompletionsProvider<InlineCompletionResults> {

	private _lastResult?: InlineCompletionResults;

	constructor(
		@ILanguageFeaturesService private readonly _languageFeatureService: ILanguageFeaturesService,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@ISuggestMemoryService private readonly _suggestMemoryService: ISuggestMemoryService,
		@ICodeEditorService private readonly _editorService: ICodeEditorService,
	) {
		super();
		this._store.add(_languageFeatureService.inlineCompletionsProvider.register('*', this));
	}

	async provideInlineCompletions(model: ITextModel, position: Position, context: InlineCompletionContext, token: CancellationToken): Promise<InlineCompletionResults | undefined> {

		if (context.selectedSuggestionInfo) {
			return;
		}

		let editor: ICodeEditor | undefined;
		for (const candidate of this._editorService.listCodeEditors()) {
			if (candidate.getModel() === model) {
				editor = candidate;
				break;
			}
		}

		if (!editor) {
			return;
		}

		const config = editor.getOption(EditorOption.quickSuggestions);
		if (QuickSuggestionsOptions.isAllOff(config)) {
			// quick suggest is off (for this model/language)
			return;
		}

		model.tokenization.tokenizeIfCheap(position.lineNumber);
		const lineTokens = model.tokenization.getLineTokens(position.lineNumber);
		const tokenType = lineTokens.getStandardTokenType(lineTokens.findTokenIndexAtOffset(Math.max(position.column - 1 - 1, 0)));
		if (QuickSuggestionsOptions.valueFor(config, tokenType) !== 'inline') {
			// quick suggest is off (for this token)
			return undefined;
		}

		// We consider non-empty leading words and trigger characters. The latter only
		// when no word is being typed (word characters superseed trigger characters)
		let wordInfo = model.getWordAtPosition(position);
		let triggerCharacterInfo: { ch: string; providers: Set<CompletionItemProvider> } | undefined;

		if (!wordInfo?.word) {
			triggerCharacterInfo = this._getTriggerCharacterInfo(model, position);
		}

		if (!wordInfo?.word && !triggerCharacterInfo) {
			// not at word, not a trigger character
			return;
		}

		// ensure that we have word information and that we are at the end of a word
		// otherwise we stop because we don't want to do quick suggestions inside words
		if (!wordInfo) {
			wordInfo = model.getWordUntilPosition(position);
		}
		if (wordInfo.endColumn !== position.column) {
			return;
		}

		let result: InlineCompletionResults;
		const leadingLineContents = model.getValueInRange(new Range(position.lineNumber, 1, position.lineNumber, position.column));
		if (!triggerCharacterInfo && this._lastResult?.canBeReused(model, position.lineNumber, wordInfo)) {
			// reuse a previous result iff possible, only a refilter is needed
			// TODO@jrieken this can be improved further and only incomplete results can be updated
			// console.log(`REUSE with ${wordInfo.word}`);
			const newLineContext = new LineContext(leadingLineContents, position.column - this._lastResult.word.endColumn);
			this._lastResult.completionModel.lineContext = newLineContext;
			this._lastResult.acquire();
			result = this._lastResult;

		} else {
			// refesh model is required
			const completions = await provideSuggestionItems(
				this._languageFeatureService.completionProvider,
				model, position,
				new CompletionOptions(undefined, SuggestModel.createSuggestFilter(editor).itemKind, triggerCharacterInfo?.providers),
				triggerCharacterInfo && { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: triggerCharacterInfo.ch },
				token
			);

			let clipboardText: string | undefined;
			if (completions.needsClipboard) {
				clipboardText = await this._clipboardService.readText();
			}

			const completionModel = new CompletionModel(
				completions.items,
				position.column,
				new LineContext(leadingLineContents, 0),
				WordDistance.None,
				editor.getOption(EditorOption.suggest),
				editor.getOption(EditorOption.snippetSuggestions),
				{ boostFullMatch: false, firstMatchCanBeWeak: false },
				clipboardText
			);
			result = new InlineCompletionResults(model, position.lineNumber, wordInfo, completionModel, completions, this._suggestMemoryService);
		}

		this._lastResult = result;
		return result;
	}

	handleItemDidShow(_completions: InlineCompletionResults, item: SuggestInlineCompletion): void {
		item.completion.resolve(CancellationToken.None);
	}

	disposeInlineCompletions(result: InlineCompletionResults): void {
		result.release();
	}

	private _getTriggerCharacterInfo(model: ITextModel, position: IPosition) {
		const ch = model.getValueInRange(Range.fromPositions({ lineNumber: position.lineNumber, column: position.column - 1 }, position));
		const providers = new Set<CompletionItemProvider>();
		for (const provider of this._languageFeatureService.completionProvider.all(model)) {
			if (provider.triggerCharacters?.includes(ch)) {
				providers.add(provider);
			}
		}
		if (providers.size === 0) {
			return undefined;
		}
		return { providers, ch };
	}
}


registerEditorFeature(SuggestInlineCompletions);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/suggestMemory.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/suggestMemory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { RunOnceScheduler } from '../../../../base/common/async.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { LRUCache } from '../../../../base/common/map.js';
import { TernarySearchTree } from '../../../../base/common/ternarySearchTree.js';
import { IPosition } from '../../../common/core/position.js';
import { ITextModel } from '../../../common/model.js';
import { CompletionItemKind, CompletionItemKinds } from '../../../common/languages.js';
import { CompletionItem } from './suggest.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget, WillSaveStateReason } from '../../../../platform/storage/common/storage.js';

export abstract class Memory {

	constructor(readonly name: MemMode) { }

	select(model: ITextModel, pos: IPosition, items: CompletionItem[]): number {
		if (items.length === 0) {
			return 0;
		}
		const topScore = items[0].score[0];
		for (let i = 0; i < items.length; i++) {
			const { score, completion: suggestion } = items[i];
			if (score[0] !== topScore) {
				// stop when leaving the group of top matches
				break;
			}
			if (suggestion.preselect) {
				// stop when seeing an auto-select-item
				return i;
			}
		}
		return 0;
	}

	abstract memorize(model: ITextModel, pos: IPosition, item: CompletionItem): void;

	abstract toJSON(): object | undefined;

	abstract fromJSON(data: object): void;
}

export class NoMemory extends Memory {

	constructor() {
		super('first');
	}

	memorize(model: ITextModel, pos: IPosition, item: CompletionItem): void {
		// no-op
	}

	toJSON() {
		return undefined;
	}

	fromJSON() {
		//
	}
}

export interface MemItem {
	type: string | CompletionItemKind;
	insertText: string;
	touch: number;
}

export class LRUMemory extends Memory {

	constructor() {
		super('recentlyUsed');
	}

	private _cache = new LRUCache<string, MemItem>(300, 0.66);
	private _seq = 0;

	memorize(model: ITextModel, pos: IPosition, item: CompletionItem): void {
		const key = `${model.getLanguageId()}/${item.textLabel}`;
		this._cache.set(key, {
			touch: this._seq++,
			type: item.completion.kind,
			insertText: item.completion.insertText
		});
	}

	override select(model: ITextModel, pos: IPosition, items: CompletionItem[]): number {

		if (items.length === 0) {
			return 0;
		}

		const lineSuffix = model.getLineContent(pos.lineNumber).substr(pos.column - 10, pos.column - 1);
		if (/\s$/.test(lineSuffix)) {
			return super.select(model, pos, items);
		}

		const topScore = items[0].score[0];
		let indexPreselect = -1;
		let indexRecency = -1;
		let seq = -1;
		for (let i = 0; i < items.length; i++) {
			if (items[i].score[0] !== topScore) {
				// consider only top items
				break;
			}
			const key = `${model.getLanguageId()}/${items[i].textLabel}`;
			const item = this._cache.peek(key);
			if (item && item.touch > seq && item.type === items[i].completion.kind && item.insertText === items[i].completion.insertText) {
				seq = item.touch;
				indexRecency = i;
			}
			if (items[i].completion.preselect && indexPreselect === -1) {
				// stop when seeing an auto-select-item
				return indexPreselect = i;
			}
		}
		if (indexRecency !== -1) {
			return indexRecency;
		} else if (indexPreselect !== -1) {
			return indexPreselect;
		} else {
			return 0;
		}
	}

	toJSON(): object {
		return this._cache.toJSON();
	}

	fromJSON(data: [string, MemItem][]): void {
		this._cache.clear();
		const seq = 0;
		for (const [key, value] of data) {
			value.touch = seq;
			value.type = typeof value.type === 'number' ? value.type : CompletionItemKinds.fromString(value.type);
			this._cache.set(key, value);
		}
		this._seq = this._cache.size;
	}
}


export class PrefixMemory extends Memory {

	constructor() {
		super('recentlyUsedByPrefix');
	}

	private _trie = TernarySearchTree.forStrings<MemItem>();
	private _seq = 0;

	memorize(model: ITextModel, pos: IPosition, item: CompletionItem): void {
		const { word } = model.getWordUntilPosition(pos);
		const key = `${model.getLanguageId()}/${word}`;
		this._trie.set(key, {
			type: item.completion.kind,
			insertText: item.completion.insertText,
			touch: this._seq++
		});
	}

	override select(model: ITextModel, pos: IPosition, items: CompletionItem[]): number {
		const { word } = model.getWordUntilPosition(pos);
		if (!word) {
			return super.select(model, pos, items);
		}
		const key = `${model.getLanguageId()}/${word}`;
		let item = this._trie.get(key);
		if (!item) {
			item = this._trie.findSubstr(key);
		}
		if (item) {
			for (let i = 0; i < items.length; i++) {
				const { kind, insertText } = items[i].completion;
				if (kind === item.type && insertText === item.insertText) {
					return i;
				}
			}
		}
		return super.select(model, pos, items);
	}

	toJSON(): object {

		const entries: [string, MemItem][] = [];
		this._trie.forEach((value, key) => entries.push([key, value]));

		// sort by last recently used (touch), then
		// take the top 200 item and normalize their
		// touch
		entries
			.sort((a, b) => -(a[1].touch - b[1].touch))
			.forEach((value, i) => value[1].touch = i);

		return entries.slice(0, 200);
	}

	fromJSON(data: [string, MemItem][]): void {
		this._trie.clear();
		if (data.length > 0) {
			this._seq = data[0][1].touch + 1;
			for (const [key, value] of data) {
				value.type = typeof value.type === 'number' ? value.type : CompletionItemKinds.fromString(value.type);
				this._trie.set(key, value);
			}
		}
	}
}

export type MemMode = 'first' | 'recentlyUsed' | 'recentlyUsedByPrefix';

export class SuggestMemoryService implements ISuggestMemoryService {

	private static readonly _strategyCtors = new Map<MemMode, { new(): Memory }>([
		['recentlyUsedByPrefix', PrefixMemory],
		['recentlyUsed', LRUMemory],
		['first', NoMemory]
	]);

	private static readonly _storagePrefix = 'suggest/memories';

	readonly _serviceBrand: undefined;


	private readonly _persistSoon: RunOnceScheduler;
	private readonly _disposables = new DisposableStore();

	private _strategy?: Memory;

	constructor(
		@IStorageService private readonly _storageService: IStorageService,
		@IConfigurationService private readonly _configService: IConfigurationService,
	) {
		this._persistSoon = new RunOnceScheduler(() => this._saveState(), 500);
		this._disposables.add(_storageService.onWillSaveState(e => {
			if (e.reason === WillSaveStateReason.SHUTDOWN) {
				this._saveState();
			}
		}));
	}

	dispose(): void {
		this._disposables.dispose();
		this._persistSoon.dispose();
	}

	memorize(model: ITextModel, pos: IPosition, item: CompletionItem): void {
		this._withStrategy(model, pos).memorize(model, pos, item);
		this._persistSoon.schedule();
	}

	select(model: ITextModel, pos: IPosition, items: CompletionItem[]): number {
		return this._withStrategy(model, pos).select(model, pos, items);
	}

	private _withStrategy(model: ITextModel, pos: IPosition): Memory {

		const mode = this._configService.getValue<MemMode>('editor.suggestSelection', {
			overrideIdentifier: model.getLanguageIdAtPosition(pos.lineNumber, pos.column),
			resource: model.uri
		});

		if (this._strategy?.name !== mode) {

			this._saveState();
			const ctor = SuggestMemoryService._strategyCtors.get(mode) || NoMemory;
			this._strategy = new ctor();

			try {
				const share = this._configService.getValue<boolean>('editor.suggest.shareSuggestSelections');
				const scope = share ? StorageScope.PROFILE : StorageScope.WORKSPACE;
				const raw = this._storageService.get(`${SuggestMemoryService._storagePrefix}/${mode}`, scope);
				if (raw) {
					this._strategy.fromJSON(JSON.parse(raw));
				}
			} catch (e) {
				// things can go wrong with JSON...
			}
		}

		return this._strategy;
	}

	private _saveState() {
		if (this._strategy) {
			const share = this._configService.getValue<boolean>('editor.suggest.shareSuggestSelections');
			const scope = share ? StorageScope.PROFILE : StorageScope.WORKSPACE;
			const raw = JSON.stringify(this._strategy);
			this._storageService.store(`${SuggestMemoryService._storagePrefix}/${this._strategy.name}`, raw, scope, StorageTarget.MACHINE);
		}
	}
}


export const ISuggestMemoryService = createDecorator<ISuggestMemoryService>('ISuggestMemories');

export interface ISuggestMemoryService {
	readonly _serviceBrand: undefined;
	memorize(model: ITextModel, pos: IPosition, item: CompletionItem): void;
	select(model: ITextModel, pos: IPosition, items: CompletionItem[]): number;
}

registerSingleton(ISuggestMemoryService, SuggestMemoryService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/suggestModel.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/suggestModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TimeoutTimer } from '../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore, dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import { getLeadingWhitespace, isHighSurrogate, isLowSurrogate } from '../../../../base/common/strings.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { CursorChangeReason, ICursorSelectionChangedEvent } from '../../../common/cursorEvents.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { Selection } from '../../../common/core/selection.js';
import { ITextModel } from '../../../common/model.js';
import { CompletionContext, CompletionItemKind, CompletionItemProvider, CompletionTriggerKind } from '../../../common/languages.js';
import { IEditorWorkerService } from '../../../common/services/editorWorker.js';
import { WordDistance } from './wordDistance.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { CompletionModel } from './completionModel.js';
import { CompletionDurations, CompletionItem, CompletionOptions, getSnippetSuggestSupport, provideSuggestionItems, QuickSuggestionsOptions, SnippetSortOrder } from './suggest.js';
import { IWordAtPosition } from '../../../common/core/wordHelper.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { FuzzyScoreOptions } from '../../../../base/common/filters.js';
import { assertType } from '../../../../base/common/types.js';
import { InlineCompletionContextKeys } from '../../inlineCompletions/browser/controller/inlineCompletionContextKeys.js';
import { SnippetController2 } from '../../snippet/browser/snippetController2.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';

export interface ICancelEvent {
	readonly retrigger: boolean;
}

export interface ITriggerEvent {
	readonly auto: boolean;
	readonly shy: boolean;
	readonly position: IPosition;
}

export interface ISuggestEvent {
	readonly completionModel: CompletionModel;
	readonly isFrozen: boolean;
	readonly triggerOptions: SuggestTriggerOptions;
}

export interface SuggestTriggerOptions {
	readonly auto: boolean;
	readonly shy?: boolean;
	readonly refilter?: boolean;
	readonly retrigger?: boolean;
	readonly triggerKind?: CompletionTriggerKind;
	readonly triggerCharacter?: string;
	readonly clipboardText?: string;
	completionOptions?: Partial<CompletionOptions>;
}

export class LineContext {

	static shouldAutoTrigger(editor: ICodeEditor): boolean {
		if (!editor.hasModel()) {
			return false;
		}
		const model = editor.getModel();
		const pos = editor.getPosition();
		model.tokenization.tokenizeIfCheap(pos.lineNumber);

		const word = model.getWordAtPosition(pos);
		if (!word) {
			return false;
		}
		if (word.endColumn !== pos.column &&
			word.startColumn + 1 !== pos.column /* after typing a single character before a word */) {
			return false;
		}
		if (!isNaN(Number(word.word))) {
			return false;
		}
		return true;
	}

	readonly lineNumber: number;
	readonly column: number;
	readonly leadingLineContent: string;
	readonly leadingWord: IWordAtPosition;
	readonly triggerOptions: SuggestTriggerOptions;

	constructor(model: ITextModel, position: Position, triggerOptions: SuggestTriggerOptions) {
		this.leadingLineContent = model.getLineContent(position.lineNumber).substr(0, position.column - 1);
		this.leadingWord = model.getWordUntilPosition(position);
		this.lineNumber = position.lineNumber;
		this.column = position.column;
		this.triggerOptions = triggerOptions;
	}
}

export const enum State {
	Idle = 0,
	Manual = 1,
	Auto = 2
}

function canShowQuickSuggest(editor: ICodeEditor, contextKeyService: IContextKeyService, configurationService: IConfigurationService): boolean {
	if (!Boolean(contextKeyService.getContextKeyValue(InlineCompletionContextKeys.inlineSuggestionVisible.key))) {
		// Allow if there is no inline suggestion.
		return true;
	}
	const suppressSuggestions = contextKeyService.getContextKeyValue<boolean | undefined>(InlineCompletionContextKeys.suppressSuggestions.key);
	if (suppressSuggestions !== undefined) {
		return !suppressSuggestions;
	}
	return !editor.getOption(EditorOption.inlineSuggest).suppressSuggestions;
}

function canShowSuggestOnTriggerCharacters(editor: ICodeEditor, contextKeyService: IContextKeyService, configurationService: IConfigurationService): boolean {
	if (!Boolean(contextKeyService.getContextKeyValue('inlineSuggestionVisible'))) {
		// Allow if there is no inline suggestion.
		return true;
	}
	const suppressSuggestions = contextKeyService.getContextKeyValue<boolean | undefined>(InlineCompletionContextKeys.suppressSuggestions.key);
	if (suppressSuggestions !== undefined) {
		return !suppressSuggestions;
	}
	return !editor.getOption(EditorOption.inlineSuggest).suppressSuggestions;
}

export class SuggestModel implements IDisposable {

	private readonly _toDispose = new DisposableStore();
	private readonly _triggerCharacterListener = new DisposableStore();
	private readonly _triggerQuickSuggest = new TimeoutTimer();

	private _triggerState: SuggestTriggerOptions | undefined = undefined;
	private _requestToken?: CancellationTokenSource;
	private _context?: LineContext;
	private _currentSelection: Selection;

	private _completionModel: CompletionModel | undefined;
	private readonly _completionDisposables = new DisposableStore();
	private readonly _onDidCancel = new Emitter<ICancelEvent>();
	private readonly _onDidTrigger = new Emitter<ITriggerEvent>();
	private readonly _onDidSuggest = new Emitter<ISuggestEvent>();

	readonly onDidCancel: Event<ICancelEvent> = this._onDidCancel.event;
	readonly onDidTrigger: Event<ITriggerEvent> = this._onDidTrigger.event;
	readonly onDidSuggest: Event<ISuggestEvent> = this._onDidSuggest.event;

	constructor(
		private readonly _editor: ICodeEditor,
		@IEditorWorkerService private readonly _editorWorkerService: IEditorWorkerService,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ILogService private readonly _logService: ILogService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@IEnvironmentService private readonly _envService: IEnvironmentService,
	) {
		this._currentSelection = this._editor.getSelection() || new Selection(1, 1, 1, 1);

		// wire up various listeners
		this._toDispose.add(this._editor.onDidChangeModel(() => {
			this._updateTriggerCharacters();
			this.cancel();
		}));
		this._toDispose.add(this._editor.onDidChangeModelLanguage(() => {
			this._updateTriggerCharacters();
			this.cancel();
		}));
		this._toDispose.add(this._editor.onDidChangeConfiguration(() => {
			this._updateTriggerCharacters();
		}));
		this._toDispose.add(this._languageFeaturesService.completionProvider.onDidChange(() => {
			this._updateTriggerCharacters();
			this._updateActiveSuggestSession();
		}));

		let editorIsComposing = false;
		this._toDispose.add(this._editor.onDidCompositionStart(() => {
			editorIsComposing = true;
		}));
		this._toDispose.add(this._editor.onDidCompositionEnd(() => {
			editorIsComposing = false;
			this._onCompositionEnd();
		}));
		this._toDispose.add(this._editor.onDidChangeCursorSelection(e => {
			// only trigger suggest when the editor isn't composing a character
			if (!editorIsComposing) {
				this._onCursorChange(e);
			}
		}));
		this._toDispose.add(this._editor.onDidChangeModelContent(() => {
			// only filter completions when the editor isn't composing a character
			// allow-any-unicode-next-line
			// e.g. ¨ + u makes ü but just ¨ cannot be used for filtering
			if (!editorIsComposing && this._triggerState !== undefined) {
				this._refilterCompletionItems();
			}
		}));

		this._updateTriggerCharacters();
	}

	dispose(): void {
		dispose(this._triggerCharacterListener);
		dispose([this._onDidCancel, this._onDidSuggest, this._onDidTrigger, this._triggerQuickSuggest]);
		this._toDispose.dispose();
		this._completionDisposables.dispose();
		this.cancel();
	}

	private _updateTriggerCharacters(): void {
		this._triggerCharacterListener.clear();

		if (this._editor.getOption(EditorOption.readOnly)
			|| !this._editor.hasModel()
			|| !this._editor.getOption(EditorOption.suggestOnTriggerCharacters)) {

			return;
		}

		const supportsByTriggerCharacter = new Map<string, Set<CompletionItemProvider>>();
		for (const support of this._languageFeaturesService.completionProvider.all(this._editor.getModel())) {
			for (const ch of support.triggerCharacters || []) {
				let set = supportsByTriggerCharacter.get(ch);
				if (!set) {
					set = new Set();
					const suggestSupport = getSnippetSuggestSupport();
					if (suggestSupport) {
						set.add(suggestSupport);
					}
					supportsByTriggerCharacter.set(ch, set);
				}
				set.add(support);
			}
		}


		const checkTriggerCharacter = (text?: string) => {

			if (!canShowSuggestOnTriggerCharacters(this._editor, this._contextKeyService, this._configurationService)) {
				return;
			}

			if (LineContext.shouldAutoTrigger(this._editor)) {
				// don't trigger by trigger characters when this is a case for quick suggest
				return;
			}

			if (!text) {
				// came here from the compositionEnd-event
				const position = this._editor.getPosition()!;
				const model = this._editor.getModel()!;
				text = model.getLineContent(position.lineNumber).substr(0, position.column - 1);
			}

			let lastChar = '';
			if (isLowSurrogate(text.charCodeAt(text.length - 1))) {
				if (isHighSurrogate(text.charCodeAt(text.length - 2))) {
					lastChar = text.substr(text.length - 2);
				}
			} else {
				lastChar = text.charAt(text.length - 1);
			}

			const supports = supportsByTriggerCharacter.get(lastChar);
			if (supports) {

				// keep existing items that where not computed by the
				// supports/providers that want to trigger now
				const providerItemsToReuse = new Map<CompletionItemProvider, CompletionItem[]>();
				if (this._completionModel) {
					for (const [provider, items] of this._completionModel.getItemsByProvider()) {
						if (!supports.has(provider)) {
							providerItemsToReuse.set(provider, items);
						}
					}
				}

				this.trigger({
					auto: true,
					triggerKind: CompletionTriggerKind.TriggerCharacter,
					triggerCharacter: lastChar,
					retrigger: Boolean(this._completionModel),
					clipboardText: this._completionModel?.clipboardText,
					completionOptions: { providerFilter: supports, providerItemsToReuse }
				});
			}
		};

		this._triggerCharacterListener.add(this._editor.onDidType(checkTriggerCharacter));
		this._triggerCharacterListener.add(this._editor.onDidCompositionEnd(() => checkTriggerCharacter()));
	}

	// --- trigger/retrigger/cancel suggest

	get state(): State {
		if (!this._triggerState) {
			return State.Idle;
		} else if (!this._triggerState.auto) {
			return State.Manual;
		} else {
			return State.Auto;
		}
	}

	cancel(retrigger: boolean = false): void {
		if (this._triggerState !== undefined) {
			this._triggerQuickSuggest.cancel();
			this._requestToken?.cancel();
			this._requestToken = undefined;
			this._triggerState = undefined;
			this._completionModel = undefined;
			this._context = undefined;
			this._onDidCancel.fire({ retrigger });
		}
	}

	clear() {
		this._completionDisposables.clear();
	}

	private _updateActiveSuggestSession(): void {
		if (this._triggerState !== undefined) {
			if (!this._editor.hasModel() || !this._languageFeaturesService.completionProvider.has(this._editor.getModel())) {
				this.cancel();
			} else {
				this.trigger({ auto: this._triggerState.auto, retrigger: true });
			}
		}
	}

	private _onCursorChange(e: ICursorSelectionChangedEvent): void {

		if (!this._editor.hasModel()) {
			return;
		}

		const prevSelection = this._currentSelection;
		this._currentSelection = this._editor.getSelection();

		if (!e.selection.isEmpty()
			|| (e.reason !== CursorChangeReason.NotSet && e.reason !== CursorChangeReason.Explicit)
			|| (e.source !== 'keyboard' && e.source !== 'deleteLeft')
		) {
			// Early exit if nothing needs to be done!
			// Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
			this.cancel();
			return;
		}


		if (this._triggerState === undefined && e.reason === CursorChangeReason.NotSet) {
			if (prevSelection.containsRange(this._currentSelection) || prevSelection.getEndPosition().isBeforeOrEqual(this._currentSelection.getPosition())) {
				// cursor did move RIGHT due to typing -> trigger quick suggest
				this._doTriggerQuickSuggest();
			}

		} else if (this._triggerState !== undefined && e.reason === CursorChangeReason.Explicit) {
			// suggest is active and something like cursor keys are used to move
			// the cursor. this means we can refilter at the new position
			this._refilterCompletionItems();
		}
	}

	private _onCompositionEnd(): void {
		// trigger or refilter when composition ends
		if (this._triggerState === undefined) {
			this._doTriggerQuickSuggest();
		} else {
			this._refilterCompletionItems();
		}
	}

	private _doTriggerQuickSuggest(): void {

		if (QuickSuggestionsOptions.isAllOff(this._editor.getOption(EditorOption.quickSuggestions))) {
			// not enabled
			return;
		}

		if (this._editor.getOption(EditorOption.suggest).snippetsPreventQuickSuggestions && SnippetController2.get(this._editor)?.isInSnippet()) {
			// no quick suggestion when in snippet mode
			return;
		}

		this.cancel();

		this._triggerQuickSuggest.cancelAndSet(() => {
			if (this._triggerState !== undefined) {
				return;
			}
			if (!LineContext.shouldAutoTrigger(this._editor)) {
				return;
			}
			if (!this._editor.hasModel() || !this._editor.hasWidgetFocus()) {
				return;
			}
			const model = this._editor.getModel();
			const pos = this._editor.getPosition();
			// validate enabled now
			const config = this._editor.getOption(EditorOption.quickSuggestions);
			if (QuickSuggestionsOptions.isAllOff(config)) {
				return;
			}

			if (!QuickSuggestionsOptions.isAllOn(config)) {
				// Check the type of the token that triggered this
				model.tokenization.tokenizeIfCheap(pos.lineNumber);
				const lineTokens = model.tokenization.getLineTokens(pos.lineNumber);
				const tokenType = lineTokens.getStandardTokenType(lineTokens.findTokenIndexAtOffset(Math.max(pos.column - 1 - 1, 0)));
				if (QuickSuggestionsOptions.valueFor(config, tokenType) !== 'on') {
					return;
				}
			}

			if (!canShowQuickSuggest(this._editor, this._contextKeyService, this._configurationService)) {
				// do not trigger quick suggestions if inline suggestions are shown
				return;
			}

			if (!this._languageFeaturesService.completionProvider.has(model)) {
				return;
			}

			// we made it till here -> trigger now
			this.trigger({ auto: true });

		}, this._editor.getOption(EditorOption.quickSuggestionsDelay));
	}

	private _refilterCompletionItems(): void {
		assertType(this._editor.hasModel());
		assertType(this._triggerState !== undefined);

		const model = this._editor.getModel();
		const position = this._editor.getPosition();
		const ctx = new LineContext(model, position, { ...this._triggerState, refilter: true });
		this._onNewContext(ctx);
	}

	trigger(options: SuggestTriggerOptions): void {
		if (!this._editor.hasModel()) {
			return;
		}

		const model = this._editor.getModel();
		const ctx = new LineContext(model, this._editor.getPosition(), options);

		// Cancel previous requests, change state & update UI
		this.cancel(options.retrigger);
		this._triggerState = options;
		this._onDidTrigger.fire({ auto: options.auto, shy: options.shy ?? false, position: this._editor.getPosition() });

		// Capture context when request was sent
		this._context = ctx;

		// Build context for request
		let suggestCtx: CompletionContext = { triggerKind: options.triggerKind ?? CompletionTriggerKind.Invoke };
		if (options.triggerCharacter) {
			suggestCtx = {
				triggerKind: CompletionTriggerKind.TriggerCharacter,
				triggerCharacter: options.triggerCharacter
			};
		}

		this._requestToken = new CancellationTokenSource();

		// kind filter and snippet sort rules
		const snippetSuggestions = this._editor.getOption(EditorOption.snippetSuggestions);
		let snippetSortOrder = SnippetSortOrder.Inline;
		switch (snippetSuggestions) {
			case 'top':
				snippetSortOrder = SnippetSortOrder.Top;
				break;
			// 	↓ that's the default anyways...
			// case 'inline':
			// 	snippetSortOrder = SnippetSortOrder.Inline;
			// 	break;
			case 'bottom':
				snippetSortOrder = SnippetSortOrder.Bottom;
				break;
		}

		const { itemKind: itemKindFilter, showDeprecated } = SuggestModel.createSuggestFilter(this._editor);
		const completionOptions = new CompletionOptions(snippetSortOrder, options.completionOptions?.kindFilter ?? itemKindFilter, options.completionOptions?.providerFilter, options.completionOptions?.providerItemsToReuse, showDeprecated);
		const wordDistance = WordDistance.create(this._editorWorkerService, this._editor);

		const completions = provideSuggestionItems(
			this._languageFeaturesService.completionProvider,
			model,
			this._editor.getPosition(),
			completionOptions,
			suggestCtx,
			this._requestToken.token
		);

		Promise.all([completions, wordDistance]).then(async ([completions, wordDistance]) => {

			this._requestToken?.dispose();

			if (!this._editor.hasModel()) {
				completions.disposable.dispose();
				return;
			}

			let clipboardText = options?.clipboardText;
			if (!clipboardText && completions.needsClipboard) {
				clipboardText = await this._clipboardService.readText();
			}

			if (this._triggerState === undefined) {
				completions.disposable.dispose();
				return;
			}

			const model = this._editor.getModel();
			// const items = completions.items;

			// if (existing) {
			// 	const cmpFn = getSuggestionComparator(snippetSortOrder);
			// 	items = items.concat(existing.items).sort(cmpFn);
			// }

			const ctx = new LineContext(model, this._editor.getPosition(), options);
			const fuzzySearchOptions = {
				...FuzzyScoreOptions.default,
				firstMatchCanBeWeak: !this._editor.getOption(EditorOption.suggest).matchOnWordStartOnly
			};
			this._completionModel = new CompletionModel(completions.items, this._context!.column, {
				leadingLineContent: ctx.leadingLineContent,
				characterCountDelta: ctx.column - this._context!.column
			},
				wordDistance,
				this._editor.getOption(EditorOption.suggest),
				this._editor.getOption(EditorOption.snippetSuggestions),
				fuzzySearchOptions,
				clipboardText
			);

			// store containers so that they can be disposed later
			this._completionDisposables.add(completions.disposable);

			this._onNewContext(ctx);

			// finally report telemetry about durations
			this._reportDurationsTelemetry(completions.durations);

			// report invalid completions by source
			if (!this._envService.isBuilt || this._envService.isExtensionDevelopment) {
				for (const item of completions.items) {
					if (item.isInvalid) {
						this._logService.warn(`[suggest] did IGNORE invalid completion item from ${item.provider._debugDisplayName}`, item.completion);
					}
				}
			}

		}).catch(onUnexpectedError);
	}

	/**
	 * Report durations telemetry with a 1% sampling rate.
	 * The telemetry is reported only if a random number between 0 and 100 is less than or equal to 1.
	 */
	private _reportDurationsTelemetry(durations: CompletionDurations): void {
		if (Math.random() > 0.0001) { // 0.01%
			return;
		}

		setTimeout(() => {
			type Durations = { data: string };
			type DurationsClassification = {
				owner: 'jrieken';
				comment: 'Completions performance numbers';
				data: { comment: 'Durations per source and overall'; classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth' };
			};
			this._telemetryService.publicLog2<Durations, DurationsClassification>('suggest.durations.json', { data: JSON.stringify(durations) });
			this._logService.debug('suggest.durations.json', durations);
		});
	}

	static createSuggestFilter(editor: ICodeEditor): { itemKind: Set<CompletionItemKind>; showDeprecated: boolean } {
		// kind filter and snippet sort rules
		const result = new Set<CompletionItemKind>();

		// snippet setting
		const snippetSuggestions = editor.getOption(EditorOption.snippetSuggestions);
		if (snippetSuggestions === 'none') {
			result.add(CompletionItemKind.Snippet);
		}

		// type setting
		const suggestOptions = editor.getOption(EditorOption.suggest);
		if (!suggestOptions.showMethods) { result.add(CompletionItemKind.Method); }
		if (!suggestOptions.showFunctions) { result.add(CompletionItemKind.Function); }
		if (!suggestOptions.showConstructors) { result.add(CompletionItemKind.Constructor); }
		if (!suggestOptions.showFields) { result.add(CompletionItemKind.Field); }
		if (!suggestOptions.showVariables) { result.add(CompletionItemKind.Variable); }
		if (!suggestOptions.showClasses) { result.add(CompletionItemKind.Class); }
		if (!suggestOptions.showStructs) { result.add(CompletionItemKind.Struct); }
		if (!suggestOptions.showInterfaces) { result.add(CompletionItemKind.Interface); }
		if (!suggestOptions.showModules) { result.add(CompletionItemKind.Module); }
		if (!suggestOptions.showProperties) { result.add(CompletionItemKind.Property); }
		if (!suggestOptions.showEvents) { result.add(CompletionItemKind.Event); }
		if (!suggestOptions.showOperators) { result.add(CompletionItemKind.Operator); }
		if (!suggestOptions.showUnits) { result.add(CompletionItemKind.Unit); }
		if (!suggestOptions.showValues) { result.add(CompletionItemKind.Value); }
		if (!suggestOptions.showConstants) { result.add(CompletionItemKind.Constant); }
		if (!suggestOptions.showEnums) { result.add(CompletionItemKind.Enum); }
		if (!suggestOptions.showEnumMembers) { result.add(CompletionItemKind.EnumMember); }
		if (!suggestOptions.showKeywords) { result.add(CompletionItemKind.Keyword); }
		if (!suggestOptions.showWords) { result.add(CompletionItemKind.Text); }
		if (!suggestOptions.showColors) { result.add(CompletionItemKind.Color); }
		if (!suggestOptions.showFiles) { result.add(CompletionItemKind.File); }
		if (!suggestOptions.showReferences) { result.add(CompletionItemKind.Reference); }
		if (!suggestOptions.showColors) { result.add(CompletionItemKind.Customcolor); }
		if (!suggestOptions.showFolders) { result.add(CompletionItemKind.Folder); }
		if (!suggestOptions.showTypeParameters) { result.add(CompletionItemKind.TypeParameter); }
		if (!suggestOptions.showSnippets) { result.add(CompletionItemKind.Snippet); }
		if (!suggestOptions.showUsers) { result.add(CompletionItemKind.User); }
		if (!suggestOptions.showIssues) { result.add(CompletionItemKind.Issue); }

		return { itemKind: result, showDeprecated: suggestOptions.showDeprecated };
	}

	private _onNewContext(ctx: LineContext): void {

		if (!this._context) {
			// happens when 24x7 IntelliSense is enabled and still in its delay
			return;
		}

		if (ctx.lineNumber !== this._context.lineNumber) {
			// e.g. happens when pressing Enter while IntelliSense is computed
			this.cancel();
			return;
		}

		if (getLeadingWhitespace(ctx.leadingLineContent) !== getLeadingWhitespace(this._context.leadingLineContent)) {
			// cancel IntelliSense when line start changes
			// happens when the current word gets outdented
			this.cancel();
			return;
		}

		if (ctx.column < this._context.column) {
			// typed -> moved cursor LEFT -> retrigger if still on a word
			if (ctx.leadingWord.word) {
				this.trigger({ auto: this._context.triggerOptions.auto, retrigger: true });
			} else {
				this.cancel();
			}
			return;
		}

		if (!this._completionModel) {
			// happens when IntelliSense is not yet computed
			return;
		}

		if (ctx.leadingWord.word.length !== 0 && ctx.leadingWord.startColumn > this._context.leadingWord.startColumn) {
			// started a new word while IntelliSense shows -> retrigger but reuse all items that we currently have
			const shouldAutoTrigger = LineContext.shouldAutoTrigger(this._editor);
			if (shouldAutoTrigger && this._context) {
				// shouldAutoTrigger forces tokenization, which can cause pending cursor change events to be emitted, which can cause
				// suggestions to be cancelled, which causes `this._context` to be undefined
				const map = this._completionModel.getItemsByProvider();
				this.trigger({
					auto: this._context.triggerOptions.auto,
					retrigger: true,
					clipboardText: this._completionModel.clipboardText,
					completionOptions: { providerItemsToReuse: map }
				});
			}
			return;
		}

		if (ctx.column > this._context.column && this._completionModel.getIncompleteProvider().size > 0 && ctx.leadingWord.word.length !== 0) {
			// typed -> moved cursor RIGHT & incomple model & still on a word -> retrigger

			const providerItemsToReuse = new Map<CompletionItemProvider, CompletionItem[]>();
			const providerFilter = new Set<CompletionItemProvider>();
			for (const [provider, items] of this._completionModel.getItemsByProvider()) {
				if (items.length > 0 && items[0].container.incomplete) {
					providerFilter.add(provider);
				} else {
					providerItemsToReuse.set(provider, items);
				}
			}

			this.trigger({
				auto: this._context.triggerOptions.auto,
				triggerKind: CompletionTriggerKind.TriggerForIncompleteCompletions,
				retrigger: true,
				clipboardText: this._completionModel.clipboardText,
				completionOptions: { providerFilter, providerItemsToReuse }
			});

		} else {
			// typed -> moved cursor RIGHT -> update UI
			const oldLineContext = this._completionModel.lineContext;
			let isFrozen = false;

			this._completionModel.lineContext = {
				leadingLineContent: ctx.leadingLineContent,
				characterCountDelta: ctx.column - this._context.column
			};

			if (this._completionModel.items.length === 0) {

				const shouldAutoTrigger = LineContext.shouldAutoTrigger(this._editor);
				if (!this._context) {
					// shouldAutoTrigger forces tokenization, which can cause pending cursor change events to be emitted, which can cause
					// suggestions to be cancelled, which causes `this._context` to be undefined
					this.cancel();
					return;
				}

				if (shouldAutoTrigger && this._context.leadingWord.endColumn < ctx.leadingWord.startColumn) {
					// retrigger when heading into a new word
					this.trigger({ auto: this._context.triggerOptions.auto, retrigger: true });
					return;
				}

				if (!this._context.triggerOptions.auto) {
					// freeze when IntelliSense was manually requested
					this._completionModel.lineContext = oldLineContext;
					isFrozen = this._completionModel.items.length > 0;

					if (isFrozen && ctx.leadingWord.word.length === 0) {
						// there were results before but now there aren't
						// and also we are not on a word anymore -> cancel
						this.cancel();
						return;
					}

				} else {
					// nothing left
					this.cancel();
					return;
				}
			}

			this._onDidSuggest.fire({
				completionModel: this._completionModel,
				triggerOptions: ctx.triggerOptions,
				isFrozen,
			});
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/suggestOvertypingCapturer.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/suggestOvertypingCapturer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { SuggestModel } from './suggestModel.js';

export class OvertypingCapturer implements IDisposable {

	private static readonly _maxSelectionLength = 51200;
	private readonly _disposables = new DisposableStore();

	private _lastOvertyped: { value: string; multiline: boolean }[] = [];
	private _locked: boolean = false;

	constructor(editor: ICodeEditor, suggestModel: SuggestModel) {

		this._disposables.add(editor.onWillType(() => {
			if (this._locked || !editor.hasModel()) {
				return;
			}

			const selections = editor.getSelections();
			const selectionsLength = selections.length;

			// Check if it will overtype any selections
			let willOvertype = false;
			for (let i = 0; i < selectionsLength; i++) {
				if (!selections[i].isEmpty()) {
					willOvertype = true;
					break;
				}
			}
			if (!willOvertype) {
				if (this._lastOvertyped.length !== 0) {
					this._lastOvertyped.length = 0;
				}
				return;
			}

			this._lastOvertyped = [];
			const model = editor.getModel();
			for (let i = 0; i < selectionsLength; i++) {
				const selection = selections[i];
				// Check for overtyping capturer restrictions
				if (model.getValueLengthInRange(selection) > OvertypingCapturer._maxSelectionLength) {
					return;
				}
				this._lastOvertyped[i] = { value: model.getValueInRange(selection), multiline: selection.startLineNumber !== selection.endLineNumber };
			}
		}));

		this._disposables.add(suggestModel.onDidTrigger(e => {
			this._locked = true;
		}));

		this._disposables.add(suggestModel.onDidCancel(e => {
			this._locked = false;
		}));
	}

	getLastOvertypedInfo(idx: number): { value: string; multiline: boolean } | undefined {
		if (idx >= 0 && idx < this._lastOvertyped.length) {
			return this._lastOvertyped[idx];
		}
		return undefined;
	}

	dispose() {
		this._disposables.dispose();
	}
}
```

--------------------------------------------------------------------------------

````

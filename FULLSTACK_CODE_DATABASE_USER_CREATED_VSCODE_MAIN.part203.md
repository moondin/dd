---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 203
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 203 of 552)

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

---[FILE: src/vs/editor/browser/viewParts/viewZones/viewZones.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/viewZones/viewZones.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { IViewZone, IViewZoneChangeAccessor } from '../../editorBrowser.js';
import { ViewPart } from '../../view/viewPart.js';
import { Position } from '../../../common/core/position.js';
import { RenderingContext, RestrictedRenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { IEditorWhitespace, IViewWhitespaceViewportData, IWhitespaceChangeAccessor } from '../../../common/viewModel.js';
import { EditorOption } from '../../../common/config/editorOptions.js';

interface IMyViewZone {
	whitespaceId: string;
	delegate: IViewZone;
	isInHiddenArea: boolean;
	isVisible: boolean;
	domNode: FastDomNode<HTMLElement>;
	marginDomNode: FastDomNode<HTMLElement> | null;
}

interface IComputedViewZoneProps {
	isInHiddenArea: boolean;
	afterViewLineNumber: number;
	heightInPx: number;
	minWidthInPx: number;
}

const invalidFunc = () => { throw new Error(`Invalid change accessor`); };

/**
 * A view zone is a rectangle that is a section that is inserted into the editor
 * lines that can be used for various purposes such as showing a diffs, peeking
 * an implementation, etc.
 */
export class ViewZones extends ViewPart {

	private _zones: { [id: string]: IMyViewZone };
	private _lineHeight: number;
	private _contentWidth: number;
	private _contentLeft: number;

	public domNode: FastDomNode<HTMLElement>;

	public marginDomNode: FastDomNode<HTMLElement>;

	constructor(context: ViewContext) {
		super(context);
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);

		this._lineHeight = options.get(EditorOption.lineHeight);
		this._contentWidth = layoutInfo.contentWidth;
		this._contentLeft = layoutInfo.contentLeft;

		this.domNode = createFastDomNode(document.createElement('div'));
		this.domNode.setClassName('view-zones');
		this.domNode.setPosition('absolute');
		this.domNode.setAttribute('role', 'presentation');
		this.domNode.setAttribute('aria-hidden', 'true');

		this.marginDomNode = createFastDomNode(document.createElement('div'));
		this.marginDomNode.setClassName('margin-view-zones');
		this.marginDomNode.setPosition('absolute');
		this.marginDomNode.setAttribute('role', 'presentation');
		this.marginDomNode.setAttribute('aria-hidden', 'true');

		this._zones = {};
	}

	public override dispose(): void {
		super.dispose();
		this._zones = {};
	}

	// ---- begin view event handlers

	private _recomputeWhitespacesProps(): boolean {
		const whitespaces = this._context.viewLayout.getWhitespaces();
		const oldWhitespaces = new Map<string, IEditorWhitespace>();
		for (const whitespace of whitespaces) {
			oldWhitespaces.set(whitespace.id, whitespace);
		}
		let hadAChange = false;
		this._context.viewModel.changeWhitespace((whitespaceAccessor: IWhitespaceChangeAccessor) => {
			const keys = Object.keys(this._zones);
			for (let i = 0, len = keys.length; i < len; i++) {
				const id = keys[i];
				const zone = this._zones[id];
				const props = this._computeWhitespaceProps(zone.delegate);
				zone.isInHiddenArea = props.isInHiddenArea;
				const oldWhitespace = oldWhitespaces.get(id);
				if (oldWhitespace && (oldWhitespace.afterLineNumber !== props.afterViewLineNumber || oldWhitespace.height !== props.heightInPx)) {
					whitespaceAccessor.changeOneWhitespace(id, props.afterViewLineNumber, props.heightInPx);
					this._safeCallOnComputedHeight(zone.delegate, props.heightInPx);
					hadAChange = true;
				}
			}
		});
		return hadAChange;
	}

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);

		this._lineHeight = options.get(EditorOption.lineHeight);
		this._contentWidth = layoutInfo.contentWidth;
		this._contentLeft = layoutInfo.contentLeft;

		if (e.hasChanged(EditorOption.lineHeight)) {
			this._recomputeWhitespacesProps();
		}

		return true;
	}

	public override onLineMappingChanged(e: viewEvents.ViewLineMappingChangedEvent): boolean {
		return this._recomputeWhitespacesProps();
	}

	public override onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean {
		return true;
	}

	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return e.scrollTopChanged || e.scrollWidthChanged;
	}

	public override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		return true;
	}

	public override onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean {
		return true;
	}

	// ---- end view event handlers

	private _getZoneOrdinal(zone: IViewZone): number {
		return zone.ordinal ?? zone.afterColumn ?? 10000;
	}

	private _computeWhitespaceProps(zone: IViewZone): IComputedViewZoneProps {
		if (zone.afterLineNumber === 0) {
			return {
				isInHiddenArea: false,
				afterViewLineNumber: 0,
				heightInPx: this._heightInPixels(zone),
				minWidthInPx: this._minWidthInPixels(zone)
			};
		}

		let zoneAfterModelPosition: Position;
		if (typeof zone.afterColumn !== 'undefined') {
			zoneAfterModelPosition = this._context.viewModel.model.validatePosition({
				lineNumber: zone.afterLineNumber,
				column: zone.afterColumn
			});
		} else {
			const validAfterLineNumber = this._context.viewModel.model.validatePosition({
				lineNumber: zone.afterLineNumber,
				column: 1
			}).lineNumber;

			zoneAfterModelPosition = new Position(
				validAfterLineNumber,
				this._context.viewModel.model.getLineMaxColumn(validAfterLineNumber)
			);
		}

		let zoneBeforeModelPosition: Position;
		if (zoneAfterModelPosition.column === this._context.viewModel.model.getLineMaxColumn(zoneAfterModelPosition.lineNumber)) {
			zoneBeforeModelPosition = this._context.viewModel.model.validatePosition({
				lineNumber: zoneAfterModelPosition.lineNumber + 1,
				column: 1
			});
		} else {
			zoneBeforeModelPosition = this._context.viewModel.model.validatePosition({
				lineNumber: zoneAfterModelPosition.lineNumber,
				column: zoneAfterModelPosition.column + 1
			});
		}

		const viewPosition = this._context.viewModel.coordinatesConverter.convertModelPositionToViewPosition(zoneAfterModelPosition, zone.afterColumnAffinity, true);
		const isVisible = zone.showInHiddenAreas || this._context.viewModel.coordinatesConverter.modelPositionIsVisible(zoneBeforeModelPosition);
		return {
			isInHiddenArea: !isVisible,
			afterViewLineNumber: viewPosition.lineNumber,
			heightInPx: (isVisible ? this._heightInPixels(zone) : 0),
			minWidthInPx: this._minWidthInPixels(zone)
		};
	}

	public changeViewZones(callback: (changeAccessor: IViewZoneChangeAccessor) => void): boolean {
		let zonesHaveChanged = false;

		this._context.viewModel.changeWhitespace((whitespaceAccessor: IWhitespaceChangeAccessor) => {

			const changeAccessor: IViewZoneChangeAccessor = {
				addZone: (zone: IViewZone): string => {
					zonesHaveChanged = true;
					return this._addZone(whitespaceAccessor, zone);
				},
				removeZone: (id: string): void => {
					if (!id) {
						return;
					}
					zonesHaveChanged = this._removeZone(whitespaceAccessor, id) || zonesHaveChanged;
				},
				layoutZone: (id: string): void => {
					if (!id) {
						return;
					}
					zonesHaveChanged = this._layoutZone(whitespaceAccessor, id) || zonesHaveChanged;
				}
			};

			safeInvoke1Arg(callback, changeAccessor);

			// Invalidate changeAccessor
			changeAccessor.addZone = invalidFunc;
			changeAccessor.removeZone = invalidFunc;
			changeAccessor.layoutZone = invalidFunc;
		});

		return zonesHaveChanged;
	}

	private _addZone(whitespaceAccessor: IWhitespaceChangeAccessor, zone: IViewZone): string {
		const props = this._computeWhitespaceProps(zone);
		const whitespaceId = whitespaceAccessor.insertWhitespace(props.afterViewLineNumber, this._getZoneOrdinal(zone), props.heightInPx, props.minWidthInPx);

		const myZone: IMyViewZone = {
			whitespaceId: whitespaceId,
			delegate: zone,
			isInHiddenArea: props.isInHiddenArea,
			isVisible: false,
			domNode: createFastDomNode(zone.domNode),
			marginDomNode: zone.marginDomNode ? createFastDomNode(zone.marginDomNode) : null
		};

		this._safeCallOnComputedHeight(myZone.delegate, props.heightInPx);

		myZone.domNode.setPosition('absolute');
		myZone.domNode.domNode.style.width = '100%';
		myZone.domNode.setDisplay('none');
		myZone.domNode.setAttribute('monaco-view-zone', myZone.whitespaceId);
		this.domNode.appendChild(myZone.domNode);

		if (myZone.marginDomNode) {
			myZone.marginDomNode.setPosition('absolute');
			myZone.marginDomNode.domNode.style.width = '100%';
			myZone.marginDomNode.setDisplay('none');
			myZone.marginDomNode.setAttribute('monaco-view-zone', myZone.whitespaceId);
			this.marginDomNode.appendChild(myZone.marginDomNode);
		}

		this._zones[myZone.whitespaceId] = myZone;


		this.setShouldRender();

		return myZone.whitespaceId;
	}

	private _removeZone(whitespaceAccessor: IWhitespaceChangeAccessor, id: string): boolean {
		if (this._zones.hasOwnProperty(id)) {
			const zone = this._zones[id];
			delete this._zones[id];
			whitespaceAccessor.removeWhitespace(zone.whitespaceId);

			zone.domNode.removeAttribute('monaco-visible-view-zone');
			zone.domNode.removeAttribute('monaco-view-zone');
			zone.domNode.domNode.remove();

			if (zone.marginDomNode) {
				zone.marginDomNode.removeAttribute('monaco-visible-view-zone');
				zone.marginDomNode.removeAttribute('monaco-view-zone');
				zone.marginDomNode.domNode.remove();
			}

			this.setShouldRender();

			return true;
		}
		return false;
	}

	private _layoutZone(whitespaceAccessor: IWhitespaceChangeAccessor, id: string): boolean {
		if (this._zones.hasOwnProperty(id)) {
			const zone = this._zones[id];
			const props = this._computeWhitespaceProps(zone.delegate);
			zone.isInHiddenArea = props.isInHiddenArea;
			// const newOrdinal = this._getZoneOrdinal(zone.delegate);
			whitespaceAccessor.changeOneWhitespace(zone.whitespaceId, props.afterViewLineNumber, props.heightInPx);
			// TODO@Alex: change `newOrdinal` too

			this._safeCallOnComputedHeight(zone.delegate, props.heightInPx);
			this.setShouldRender();

			return true;
		}
		return false;
	}

	public shouldSuppressMouseDownOnViewZone(id: string): boolean {
		if (this._zones.hasOwnProperty(id)) {
			const zone = this._zones[id];
			return Boolean(zone.delegate.suppressMouseDown);
		}
		return false;
	}

	private _heightInPixels(zone: IViewZone): number {
		if (typeof zone.heightInPx === 'number') {
			return zone.heightInPx;
		}
		if (typeof zone.heightInLines === 'number') {
			return this._lineHeight * zone.heightInLines;
		}
		return this._lineHeight;
	}

	private _minWidthInPixels(zone: IViewZone): number {
		if (typeof zone.minWidthInPx === 'number') {
			return zone.minWidthInPx;
		}
		return 0;
	}

	private _safeCallOnComputedHeight(zone: IViewZone, height: number): void {
		if (typeof zone.onComputedHeight === 'function') {
			try {
				zone.onComputedHeight(height);
			} catch (e) {
				onUnexpectedError(e);
			}
		}
	}

	private _safeCallOnDomNodeTop(zone: IViewZone, top: number): void {
		if (typeof zone.onDomNodeTop === 'function') {
			try {
				zone.onDomNodeTop(top);
			} catch (e) {
				onUnexpectedError(e);
			}
		}
	}

	public prepareRender(ctx: RenderingContext): void {
		// Nothing to read
	}

	public render(ctx: RestrictedRenderingContext): void {
		const visibleWhitespaces = ctx.viewportData.whitespaceViewportData;
		const visibleZones: { [id: string]: IViewWhitespaceViewportData } = {};

		let hasVisibleZone = false;
		for (const visibleWhitespace of visibleWhitespaces) {
			if (this._zones[visibleWhitespace.id].isInHiddenArea) {
				continue;
			}
			visibleZones[visibleWhitespace.id] = visibleWhitespace;
			hasVisibleZone = true;
		}

		const keys = Object.keys(this._zones);
		for (let i = 0, len = keys.length; i < len; i++) {
			const id = keys[i];
			const zone = this._zones[id];

			let newTop = 0;
			let newHeight = 0;
			let newDisplay = 'none';
			if (visibleZones.hasOwnProperty(id)) {
				newTop = visibleZones[id].verticalOffset - ctx.bigNumbersDelta;
				newHeight = visibleZones[id].height;
				newDisplay = 'block';
				// zone is visible
				if (!zone.isVisible) {
					zone.domNode.setAttribute('monaco-visible-view-zone', 'true');
					zone.isVisible = true;
				}
				this._safeCallOnDomNodeTop(zone.delegate, ctx.getScrolledTopFromAbsoluteTop(visibleZones[id].verticalOffset));
			} else {
				if (zone.isVisible) {
					zone.domNode.removeAttribute('monaco-visible-view-zone');
					zone.isVisible = false;
				}
				this._safeCallOnDomNodeTop(zone.delegate, ctx.getScrolledTopFromAbsoluteTop(-1000000));
			}
			zone.domNode.setTop(newTop);
			zone.domNode.setHeight(newHeight);
			zone.domNode.setDisplay(newDisplay);

			if (zone.marginDomNode) {
				zone.marginDomNode.setTop(newTop);
				zone.marginDomNode.setHeight(newHeight);
				zone.marginDomNode.setDisplay(newDisplay);
			}
		}

		if (hasVisibleZone) {
			this.domNode.setWidth(Math.max(ctx.scrollWidth, this._contentWidth));
			this.marginDomNode.setWidth(this._contentLeft);
		}
	}
}

function safeInvoke1Arg(func: Function, arg1: unknown): unknown {
	try {
		return func(arg1);
	} catch (e) {
		onUnexpectedError(e);
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/whitespace/whitespace.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/whitespace/whitespace.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .mwh {
	position: absolute;
	color: var(--vscode-editorWhitespace-foreground) !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/whitespace/whitespace.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/whitespace/whitespace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './whitespace.css';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
import { Selection } from '../../../common/core/selection.js';
import { RenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { ViewLineRenderingData } from '../../../common/viewModel.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IEditorConfiguration } from '../../../common/config/editorConfiguration.js';
import * as strings from '../../../../base/common/strings.js';
import { CharCode } from '../../../../base/common/charCode.js';
import { Position } from '../../../common/core/position.js';
import { editorWhitespaces } from '../../../common/core/editorColorRegistry.js';
import { OffsetRange } from '../../../common/core/ranges/offsetRange.js';

/**
 * The whitespace overlay will visual certain whitespace depending on the
 * current editor configuration (boundary, selection, etc.).
 */
export class WhitespaceOverlay extends DynamicViewOverlay {

	private readonly _context: ViewContext;
	private _options: WhitespaceOptions;
	private _selection: Selection[];
	private _renderResult: string[] | null;

	constructor(context: ViewContext) {
		super();
		this._context = context;
		this._options = new WhitespaceOptions(this._context.configuration);
		this._selection = [];
		this._renderResult = null;
		this._context.addEventHandler(this);
	}

	public override dispose(): void {
		this._context.removeEventHandler(this);
		this._renderResult = null;
		super.dispose();
	}

	// --- begin event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const newOptions = new WhitespaceOptions(this._context.configuration);
		if (this._options.equals(newOptions)) {
			return e.hasChanged(EditorOption.layoutInfo);
		}
		this._options = newOptions;
		return true;
	}
	public override onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean {
		this._selection = e.selections;
		if (this._options.renderWhitespace === 'selection') {
			return true;
		}
		return false;
	}
	public override onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean {
		return true;
	}
	public override onFlushed(e: viewEvents.ViewFlushedEvent): boolean {
		return true;
	}
	public override onLinesChanged(e: viewEvents.ViewLinesChangedEvent): boolean {
		return true;
	}
	public override onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean {
		return true;
	}
	public override onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean {
		return true;
	}
	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return e.scrollTopChanged;
	}
	public override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		return true;
	}
	// --- end event handlers

	public prepareRender(ctx: RenderingContext): void {
		if (this._options.renderWhitespace === 'none') {
			this._renderResult = null;
			return;
		}

		this._renderResult = [];
		for (let lineNumber = ctx.viewportData.startLineNumber; lineNumber <= ctx.viewportData.endLineNumber; lineNumber++) {
			const lineIndex = lineNumber - ctx.viewportData.startLineNumber;
			const lineData = this._context.viewModel.getViewLineRenderingData(lineNumber);

			let selectionsOnLine: OffsetRange[] | null = null;
			if (this._options.renderWhitespace === 'selection') {
				const selections = this._selection;
				for (const selection of selections) {

					if (selection.endLineNumber < lineNumber || selection.startLineNumber > lineNumber) {
						// Selection does not intersect line
						continue;
					}

					const startColumn = (selection.startLineNumber === lineNumber ? selection.startColumn : lineData.minColumn);
					const endColumn = (selection.endLineNumber === lineNumber ? selection.endColumn : lineData.maxColumn);

					if (startColumn < endColumn) {
						if (!selectionsOnLine) {
							selectionsOnLine = [];
						}
						selectionsOnLine.push(new OffsetRange(startColumn - 1, endColumn - 1));
					}
				}
			}

			this._renderResult[lineIndex] = this._applyRenderWhitespace(ctx, lineNumber, selectionsOnLine, lineData);
		}
	}

	private _applyRenderWhitespace(ctx: RenderingContext, lineNumber: number, selections: OffsetRange[] | null, lineData: ViewLineRenderingData): string {
		if (lineData.hasVariableFonts) {
			return '';
		}
		if (this._options.renderWhitespace === 'selection' && !selections) {
			return '';
		}
		if (this._options.renderWhitespace === 'trailing' && lineData.continuesWithWrappedLine) {
			return '';
		}
		const color = this._context.theme.getColor(editorWhitespaces);
		const USE_SVG = this._options.renderWithSVG;

		const lineContent = lineData.content;
		const len = (this._options.stopRenderingLineAfter === -1 ? lineContent.length : Math.min(this._options.stopRenderingLineAfter, lineContent.length));
		const continuesWithWrappedLine = lineData.continuesWithWrappedLine;
		const fauxIndentLength = lineData.minColumn - 1;
		const onlyBoundary = (this._options.renderWhitespace === 'boundary');
		const onlyTrailing = (this._options.renderWhitespace === 'trailing');
		const lineHeight = ctx.getLineHeightForLineNumber(lineNumber);
		const middotWidth = this._options.middotWidth;
		const wsmiddotWidth = this._options.wsmiddotWidth;
		const spaceWidth = this._options.spaceWidth;
		const wsmiddotDiff = Math.abs(wsmiddotWidth - spaceWidth);
		const middotDiff = Math.abs(middotWidth - spaceWidth);

		// U+2E31 - WORD SEPARATOR MIDDLE DOT
		// U+00B7 - MIDDLE DOT
		const renderSpaceCharCode = (wsmiddotDiff < middotDiff ? 0x2E31 : 0xB7);

		const canUseHalfwidthRightwardsArrow = this._options.canUseHalfwidthRightwardsArrow;

		let result: string = '';

		let lineIsEmptyOrWhitespace = false;
		let firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(lineContent);
		let lastNonWhitespaceIndex: number;
		if (firstNonWhitespaceIndex === -1) {
			lineIsEmptyOrWhitespace = true;
			firstNonWhitespaceIndex = len;
			lastNonWhitespaceIndex = len;
		} else {
			lastNonWhitespaceIndex = strings.lastNonWhitespaceIndex(lineContent);
		}

		let currentSelectionIndex = 0;
		let currentSelection = selections && selections[currentSelectionIndex];
		let maxLeft = 0;

		for (let charIndex = fauxIndentLength; charIndex < len; charIndex++) {
			const chCode = lineContent.charCodeAt(charIndex);

			if (currentSelection && currentSelection.endExclusive <= charIndex) {
				currentSelectionIndex++;
				currentSelection = selections && selections[currentSelectionIndex];
			}

			if (chCode !== CharCode.Tab && chCode !== CharCode.Space) {
				continue;
			}

			if (onlyTrailing && !lineIsEmptyOrWhitespace && charIndex <= lastNonWhitespaceIndex) {
				// If rendering only trailing whitespace, check that the charIndex points to trailing whitespace.
				continue;
			}

			if (onlyBoundary && charIndex >= firstNonWhitespaceIndex && charIndex <= lastNonWhitespaceIndex && chCode === CharCode.Space) {
				// rendering only boundary whitespace
				const prevChCode = (charIndex - 1 >= 0 ? lineContent.charCodeAt(charIndex - 1) : CharCode.Null);
				const nextChCode = (charIndex + 1 < len ? lineContent.charCodeAt(charIndex + 1) : CharCode.Null);
				if (prevChCode !== CharCode.Space && nextChCode !== CharCode.Space) {
					continue;
				}
			}

			if (onlyBoundary && continuesWithWrappedLine && charIndex === len - 1) {
				const prevCharCode = (charIndex - 1 >= 0 ? lineContent.charCodeAt(charIndex - 1) : CharCode.Null);
				const isSingleTrailingSpace = (chCode === CharCode.Space && (prevCharCode !== CharCode.Space && prevCharCode !== CharCode.Tab));
				if (isSingleTrailingSpace) {
					continue;
				}
			}

			if (selections && !(currentSelection && currentSelection.start <= charIndex && charIndex < currentSelection.endExclusive)) {
				// If rendering whitespace on selection, check that the charIndex falls within a selection
				continue;
			}

			const visibleRange = ctx.visibleRangeForPosition(new Position(lineNumber, charIndex + 1));
			if (!visibleRange) {
				continue;
			}

			if (USE_SVG) {
				maxLeft = Math.max(maxLeft, visibleRange.left);
				if (chCode === CharCode.Tab) {
					result += this._renderArrow(lineHeight, spaceWidth, visibleRange.left);
				} else {
					result += `<circle cx="${(visibleRange.left + spaceWidth / 2).toFixed(2)}" cy="${(lineHeight / 2).toFixed(2)}" r="${(spaceWidth / 7).toFixed(2)}" />`;
				}
			} else {
				if (chCode === CharCode.Tab) {
					result += `<div class="mwh" style="left:${visibleRange.left}px;height:${lineHeight}px;">${canUseHalfwidthRightwardsArrow ? String.fromCharCode(0xFFEB) : String.fromCharCode(0x2192)}</div>`;
				} else {
					result += `<div class="mwh" style="left:${visibleRange.left}px;height:${lineHeight}px;">${String.fromCharCode(renderSpaceCharCode)}</div>`;
				}
			}
		}

		if (USE_SVG) {
			maxLeft = Math.round(maxLeft + spaceWidth);
			return (
				`<svg style="bottom:0;position:absolute;width:${maxLeft}px;height:${lineHeight}px" viewBox="0 0 ${maxLeft} ${lineHeight}" xmlns="http://www.w3.org/2000/svg" fill="${color}">`
				+ result
				+ `</svg>`
			);
		}

		return result;
	}

	private _renderArrow(lineHeight: number, spaceWidth: number, left: number): string {
		const strokeWidth = spaceWidth / 7;
		const width = spaceWidth;
		const dy = lineHeight / 2;
		const dx = left;

		const p1 = { x: 0, y: strokeWidth / 2 };
		const p2 = { x: 100 / 125 * width, y: p1.y };
		const p3 = { x: p2.x - 0.2 * p2.x, y: p2.y + 0.2 * p2.x };
		const p4 = { x: p3.x + 0.1 * p2.x, y: p3.y + 0.1 * p2.x };
		const p5 = { x: p4.x + 0.35 * p2.x, y: p4.y - 0.35 * p2.x };
		const p6 = { x: p5.x, y: -p5.y };
		const p7 = { x: p4.x, y: -p4.y };
		const p8 = { x: p3.x, y: -p3.y };
		const p9 = { x: p2.x, y: -p2.y };
		const p10 = { x: p1.x, y: -p1.y };

		const p = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10];
		const parts = p.map((p) => `${(dx + p.x).toFixed(2)} ${(dy + p.y).toFixed(2)}`).join(' L ');
		return `<path d="M ${parts}" />`;
	}

	public render(startLineNumber: number, lineNumber: number): string {
		if (!this._renderResult) {
			return '';
		}
		const lineIndex = lineNumber - startLineNumber;
		if (lineIndex < 0 || lineIndex >= this._renderResult.length) {
			return '';
		}
		return this._renderResult[lineIndex];
	}
}

class WhitespaceOptions {

	public readonly renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
	public readonly renderWithSVG: boolean;
	public readonly spaceWidth: number;
	public readonly middotWidth: number;
	public readonly wsmiddotWidth: number;
	public readonly canUseHalfwidthRightwardsArrow: boolean;
	public readonly lineHeight: number;
	public readonly stopRenderingLineAfter: number;

	constructor(config: IEditorConfiguration) {
		const options = config.options;
		const fontInfo = options.get(EditorOption.fontInfo);
		const experimentalWhitespaceRendering = options.get(EditorOption.experimentalWhitespaceRendering);
		if (experimentalWhitespaceRendering === 'off') {
			// whitespace is rendered in the view line
			this.renderWhitespace = 'none';
			this.renderWithSVG = false;
		} else if (experimentalWhitespaceRendering === 'svg') {
			this.renderWhitespace = options.get(EditorOption.renderWhitespace);
			this.renderWithSVG = true;
		} else {
			this.renderWhitespace = options.get(EditorOption.renderWhitespace);
			this.renderWithSVG = false;
		}
		this.spaceWidth = fontInfo.spaceWidth;
		this.middotWidth = fontInfo.middotWidth;
		this.wsmiddotWidth = fontInfo.wsmiddotWidth;
		this.canUseHalfwidthRightwardsArrow = fontInfo.canUseHalfwidthRightwardsArrow;
		this.lineHeight = options.get(EditorOption.lineHeight);
		this.stopRenderingLineAfter = options.get(EditorOption.stopRenderingLineAfter);
	}

	public equals(other: WhitespaceOptions): boolean {
		return (
			this.renderWhitespace === other.renderWhitespace
			&& this.renderWithSVG === other.renderWithSVG
			&& this.spaceWidth === other.spaceWidth
			&& this.middotWidth === other.middotWidth
			&& this.wsmiddotWidth === other.wsmiddotWidth
			&& this.canUseHalfwidthRightwardsArrow === other.canUseHalfwidthRightwardsArrow
			&& this.lineHeight === other.lineHeight
			&& this.stopRenderingLineAfter === other.stopRenderingLineAfter
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/codeEditor/codeEditorContributions.ts]---
Location: vscode-main/src/vs/editor/browser/widget/codeEditor/codeEditorContributions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getWindow, runWhenWindowIdle } from '../../../../base/browser/dom.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Disposable, DisposableMap, IDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../editorBrowser.js';
import { EditorContributionInstantiation, IEditorContributionDescription } from '../../editorExtensions.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';

export class CodeEditorContributions extends Disposable {

	private _editor: ICodeEditor | null = null;
	private _instantiationService: IInstantiationService | null = null;

	/**
	 * Contains all instantiated contributions.
	 */
	private readonly _instances = this._register(new DisposableMap<string, IEditorContribution>());
	/**
	 * Contains contributions which are not yet instantiated.
	 */
	private readonly _pending = new Map<string, IEditorContributionDescription>();
	/**
	 * Tracks which instantiation kinds are still left in `_pending`.
	 */
	private readonly _finishedInstantiation: boolean[] = [];

	constructor(

	) {
		super();

		this._finishedInstantiation[EditorContributionInstantiation.Eager] = false;
		this._finishedInstantiation[EditorContributionInstantiation.AfterFirstRender] = false;
		this._finishedInstantiation[EditorContributionInstantiation.BeforeFirstInteraction] = false;
		this._finishedInstantiation[EditorContributionInstantiation.Eventually] = false;
	}

	public initialize(editor: ICodeEditor, contributions: IEditorContributionDescription[], instantiationService: IInstantiationService) {
		this._editor = editor;
		this._instantiationService = instantiationService;

		for (const desc of contributions) {
			if (this._pending.has(desc.id)) {
				onUnexpectedError(new Error(`Cannot have two contributions with the same id ${desc.id}`));
				continue;
			}
			this._pending.set(desc.id, desc);
		}

		this._instantiateSome(EditorContributionInstantiation.Eager);

		// AfterFirstRender
		// - these extensions will be instantiated at the latest 50ms after the first render.
		// - but if there is idle time, we will instantiate them sooner.
		this._register(runWhenWindowIdle(getWindow(this._editor.getDomNode()), () => {
			this._instantiateSome(EditorContributionInstantiation.AfterFirstRender);
		}));

		// BeforeFirstInteraction
		// - these extensions will be instantiated at the latest before a mouse or a keyboard event.
		// - but if there is idle time, we will instantiate them sooner.
		this._register(runWhenWindowIdle(getWindow(this._editor.getDomNode()), () => {
			this._instantiateSome(EditorContributionInstantiation.BeforeFirstInteraction);
		}));

		// Eventually
		// - these extensions will only be instantiated when there is idle time.
		// - since there is no guarantee that there will ever be idle time, we set a timeout of 5s here.
		this._register(runWhenWindowIdle(getWindow(this._editor.getDomNode()), () => {
			this._instantiateSome(EditorContributionInstantiation.Eventually);
		}, 5000));
	}

	public saveViewState(): { [key: string]: unknown } {
		const contributionsState: { [key: string]: unknown } = {};
		for (const [id, contribution] of this._instances) {
			if (typeof contribution.saveViewState === 'function') {
				contributionsState[id] = contribution.saveViewState();
			}
		}
		return contributionsState;
	}

	public restoreViewState(contributionsState: { [key: string]: unknown }): void {
		for (const [id, contribution] of this._instances) {
			if (typeof contribution.restoreViewState === 'function') {
				contribution.restoreViewState(contributionsState[id]);
			}
		}
	}

	public get(id: string): IEditorContribution | null {
		this._instantiateById(id);
		return this._instances.get(id) || null;
	}

	/**
	 * used by tests
	 */
	public set(id: string, value: IEditorContribution) {
		this._instances.set(id, value);
	}

	public onBeforeInteractionEvent(): void {
		// this method is called very often by the editor!
		this._instantiateSome(EditorContributionInstantiation.BeforeFirstInteraction);
	}

	public onAfterModelAttached(): IDisposable {
		return runWhenWindowIdle(getWindow(this._editor?.getDomNode()), () => {
			this._instantiateSome(EditorContributionInstantiation.AfterFirstRender);
		}, 50);
	}

	private _instantiateSome(instantiation: EditorContributionInstantiation): void {
		if (this._finishedInstantiation[instantiation]) {
			// already done with this instantiation!
			return;
		}
		this._finishedInstantiation[instantiation] = true;

		const contribs = this._findPendingContributionsByInstantiation(instantiation);
		for (const contrib of contribs) {
			this._instantiateById(contrib.id);
		}
	}

	private _findPendingContributionsByInstantiation(instantiation: EditorContributionInstantiation): readonly IEditorContributionDescription[] {
		const result: IEditorContributionDescription[] = [];
		for (const [, desc] of this._pending) {
			if (desc.instantiation === instantiation) {
				result.push(desc);
			}
		}
		return result;
	}

	private _instantiateById(id: string): void {
		const desc = this._pending.get(id);
		if (!desc) {
			return;
		}

		this._pending.delete(id);

		if (!this._instantiationService || !this._editor) {
			throw new Error(`Cannot instantiate contributions before being initialized!`);
		}

		try {
			const instance = this._instantiationService.createInstance(desc.ctor, this._editor);
			this._instances.set(desc.id, instance);
			if (typeof instance.restoreViewState === 'function' && desc.instantiation !== EditorContributionInstantiation.Eager) {
				console.warn(`Editor contribution '${desc.id}' should be eager instantiated because it uses saveViewState / restoreViewState.`);
			}
		} catch (err) {
			onUnexpectedError(err);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/codeEditor/codeEditorWidget.ts]---
Location: vscode-main/src/vs/editor/browser/widget/codeEditor/codeEditorWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../../services/markerDecorations.js';
import * as dom from '../../../../base/browser/dom.js';
import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { IMouseWheelEvent } from '../../../../base/browser/mouseEvent.js';
import { Color } from '../../../../base/common/color.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, EmitterOptions, Event, EventDeliveryQueue, createEventDeliveryQueue } from '../../../../base/common/event.js';
import { hash } from '../../../../base/common/hash.js';
import { Disposable, DisposableStore, IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import './editor.css';
import { applyFontInfo } from '../../config/domFontInfo.js';
import { EditorConfiguration, IEditorConstructionOptions } from '../../config/editorConfiguration.js';
import { TabFocus } from '../../config/tabFocus.js';
import * as editorBrowser from '../../editorBrowser.js';
import { EditorExtensionsRegistry, IEditorContributionDescription } from '../../editorExtensions.js';
import { ICodeEditorService } from '../../services/codeEditorService.js';
import { IContentWidgetData, IGlyphMarginWidgetData, IOverlayWidgetData, View } from '../../view.js';
import { DOMLineBreaksComputerFactory } from '../../view/domLineBreaksComputer.js';
import { ICommandDelegate } from '../../view/viewController.js';
import { ViewUserInputEvents } from '../../view/viewUserInputEvents.js';
import { CodeEditorContributions } from './codeEditorContributions.js';
import { IEditorConfiguration } from '../../../common/config/editorConfiguration.js';
import { ConfigurationChangedEvent, EditorLayoutInfo, EditorOption, FindComputedEditorOptionValueById, IComputedEditorOptions, IEditorOptions, filterFontDecorations, filterValidationDecorations } from '../../../common/config/editorOptions.js';
import { CursorColumns } from '../../../common/core/cursorColumns.js';
import { IDimension } from '../../../common/core/2d/dimension.js';
import { editorUnnecessaryCodeOpacity } from '../../../common/core/editorColorRegistry.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { IRange, Range } from '../../../common/core/range.js';
import { ISelection, Selection } from '../../../common/core/selection.js';
import { IWordAtPosition } from '../../../common/core/wordHelper.js';
import { WordOperations } from '../../../common/cursor/cursorWordOperations.js';
import { CursorChangeReason, ICursorPositionChangedEvent, ICursorSelectionChangedEvent } from '../../../common/cursorEvents.js';
import { InternalEditorAction } from '../../../common/editorAction.js';
import * as editorCommon from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { EndOfLinePreference, IAttachedView, ICursorStateComputer, IIdentifiedSingleEditOperation, IModelDecoration, IModelDecorationOptions, IModelDecorationsChangeAccessor, IModelDeltaDecoration, ITextModel } from '../../../common/model.js';
import { ClassName } from '../../../common/model/intervalTree.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { IModelContentChangedEvent, IModelDecorationsChangedEvent, IModelLanguageChangedEvent, IModelLanguageConfigurationChangedEvent, IModelOptionsChangedEvent, IModelTokensChangedEvent, ModelFontChangedEvent, ModelLineHeightChangedEvent } from '../../../common/textModelEvents.js';
import { VerticalRevealType } from '../../../common/viewEvents.js';
import { IEditorWhitespace, IViewModel } from '../../../common/viewModel.js';
import { MonospaceLineBreaksComputerFactory } from '../../../common/viewModel/monospaceLineBreaksComputer.js';
import { ViewModel } from '../../../common/viewModel/viewModelImpl.js';
import { OutgoingViewModelEventKind } from '../../../common/viewModelEventDispatcher.js';
import * as nls from '../../../../nls.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ContextKeyValue, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { editorErrorForeground, editorHintForeground, editorInfoForeground, editorWarningForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { TextModelEditSource, EditSources } from '../../../common/textModelEditSource.js';
import { TextEdit } from '../../../common/core/edits/textEdit.js';
import { isObject } from '../../../../base/common/types.js';

export class CodeEditorWidget extends Disposable implements editorBrowser.ICodeEditor {

	private static readonly dropIntoEditorDecorationOptions = ModelDecorationOptions.register({
		description: 'workbench-dnd-target',
		className: 'dnd-target'
	});

	//#region Eventing

	private readonly _deliveryQueue = createEventDeliveryQueue();
	protected readonly _contributions: CodeEditorContributions = this._register(new CodeEditorContributions());

	private readonly _onDidDispose: Emitter<void> = this._register(new Emitter<void>());
	public readonly onDidDispose: Event<void> = this._onDidDispose.event;

	private readonly _onDidChangeModelContent: Emitter<IModelContentChangedEvent> = this._register(new Emitter<IModelContentChangedEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidChangeModelContent: Event<IModelContentChangedEvent> = this._onDidChangeModelContent.event;

	private readonly _onDidChangeModelLanguage: Emitter<IModelLanguageChangedEvent> = this._register(new Emitter<IModelLanguageChangedEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidChangeModelLanguage: Event<IModelLanguageChangedEvent> = this._onDidChangeModelLanguage.event;

	private readonly _onDidChangeModelLanguageConfiguration: Emitter<IModelLanguageConfigurationChangedEvent> = this._register(new Emitter<IModelLanguageConfigurationChangedEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidChangeModelLanguageConfiguration: Event<IModelLanguageConfigurationChangedEvent> = this._onDidChangeModelLanguageConfiguration.event;

	private readonly _onDidChangeModelOptions: Emitter<IModelOptionsChangedEvent> = this._register(new Emitter<IModelOptionsChangedEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidChangeModelOptions: Event<IModelOptionsChangedEvent> = this._onDidChangeModelOptions.event;

	private readonly _onDidChangeModelDecorations: Emitter<IModelDecorationsChangedEvent> = this._register(new Emitter<IModelDecorationsChangedEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidChangeModelDecorations: Event<IModelDecorationsChangedEvent> = this._onDidChangeModelDecorations.event;

	private readonly _onDidChangeLineHeight: Emitter<ModelLineHeightChangedEvent> = this._register(new Emitter<ModelLineHeightChangedEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidChangeLineHeight: Event<ModelLineHeightChangedEvent> = this._onDidChangeLineHeight.event;

	private readonly _onDidChangeFont: Emitter<ModelFontChangedEvent> = this._register(new Emitter<ModelFontChangedEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidChangeFont: Event<ModelFontChangedEvent> = this._onDidChangeFont.event;

	private readonly _onDidChangeModelTokens: Emitter<IModelTokensChangedEvent> = this._register(new Emitter<IModelTokensChangedEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidChangeModelTokens: Event<IModelTokensChangedEvent> = this._onDidChangeModelTokens.event;

	private readonly _onDidChangeConfiguration: Emitter<ConfigurationChangedEvent> = this._register(new Emitter<ConfigurationChangedEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidChangeConfiguration: Event<ConfigurationChangedEvent> = this._onDidChangeConfiguration.event;

	protected readonly _onWillChangeModel: Emitter<editorCommon.IModelChangedEvent> = this._register(new Emitter<editorCommon.IModelChangedEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onWillChangeModel: Event<editorCommon.IModelChangedEvent> = this._onWillChangeModel.event;

	protected readonly _onDidChangeModel: Emitter<editorCommon.IModelChangedEvent> = this._register(new Emitter<editorCommon.IModelChangedEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidChangeModel: Event<editorCommon.IModelChangedEvent> = this._onDidChangeModel.event;

	private readonly _onDidChangeCursorPosition: Emitter<ICursorPositionChangedEvent> = this._register(new Emitter<ICursorPositionChangedEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidChangeCursorPosition: Event<ICursorPositionChangedEvent> = this._onDidChangeCursorPosition.event;

	private readonly _onDidChangeCursorSelection: Emitter<ICursorSelectionChangedEvent> = this._register(new Emitter<ICursorSelectionChangedEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidChangeCursorSelection: Event<ICursorSelectionChangedEvent> = this._onDidChangeCursorSelection.event;

	private readonly _onDidAttemptReadOnlyEdit: Emitter<void> = this._register(new InteractionEmitter<void>(this._contributions, this._deliveryQueue));
	public readonly onDidAttemptReadOnlyEdit: Event<void> = this._onDidAttemptReadOnlyEdit.event;

	private readonly _onDidLayoutChange: Emitter<EditorLayoutInfo> = this._register(new Emitter<EditorLayoutInfo>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidLayoutChange: Event<EditorLayoutInfo> = this._onDidLayoutChange.event;

	private readonly _editorTextFocus: BooleanEventEmitter = this._register(new BooleanEventEmitter({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidFocusEditorText: Event<void> = this._editorTextFocus.onDidChangeToTrue;
	public readonly onDidBlurEditorText: Event<void> = this._editorTextFocus.onDidChangeToFalse;

	private readonly _editorWidgetFocus: BooleanEventEmitter = this._register(new BooleanEventEmitter({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidFocusEditorWidget: Event<void> = this._editorWidgetFocus.onDidChangeToTrue;
	public readonly onDidBlurEditorWidget: Event<void> = this._editorWidgetFocus.onDidChangeToFalse;

	private readonly _onWillType: Emitter<string> = this._register(new InteractionEmitter<string>(this._contributions, this._deliveryQueue));
	public readonly onWillType = this._onWillType.event;

	private readonly _onDidType: Emitter<string> = this._register(new InteractionEmitter<string>(this._contributions, this._deliveryQueue));
	public readonly onDidType = this._onDidType.event;

	private readonly _onDidCompositionStart: Emitter<void> = this._register(new InteractionEmitter<void>(this._contributions, this._deliveryQueue));
	public readonly onDidCompositionStart = this._onDidCompositionStart.event;

	private readonly _onDidCompositionEnd: Emitter<void> = this._register(new InteractionEmitter<void>(this._contributions, this._deliveryQueue));
	public readonly onDidCompositionEnd = this._onDidCompositionEnd.event;

	private readonly _onDidPaste: Emitter<editorBrowser.IPasteEvent> = this._register(new InteractionEmitter<editorBrowser.IPasteEvent>(this._contributions, this._deliveryQueue));
	public readonly onDidPaste = this._onDidPaste.event;

	private readonly _onMouseUp: Emitter<editorBrowser.IEditorMouseEvent> = this._register(new InteractionEmitter<editorBrowser.IEditorMouseEvent>(this._contributions, this._deliveryQueue));
	public readonly onMouseUp: Event<editorBrowser.IEditorMouseEvent> = this._onMouseUp.event;

	private readonly _onMouseDown: Emitter<editorBrowser.IEditorMouseEvent> = this._register(new InteractionEmitter<editorBrowser.IEditorMouseEvent>(this._contributions, this._deliveryQueue));
	public readonly onMouseDown: Event<editorBrowser.IEditorMouseEvent> = this._onMouseDown.event;

	private readonly _onMouseDrag: Emitter<editorBrowser.IEditorMouseEvent> = this._register(new InteractionEmitter<editorBrowser.IEditorMouseEvent>(this._contributions, this._deliveryQueue));
	public readonly onMouseDrag: Event<editorBrowser.IEditorMouseEvent> = this._onMouseDrag.event;

	private readonly _onMouseDrop: Emitter<editorBrowser.IPartialEditorMouseEvent> = this._register(new InteractionEmitter<editorBrowser.IPartialEditorMouseEvent>(this._contributions, this._deliveryQueue));
	public readonly onMouseDrop: Event<editorBrowser.IPartialEditorMouseEvent> = this._onMouseDrop.event;

	private readonly _onMouseDropCanceled: Emitter<void> = this._register(new InteractionEmitter<void>(this._contributions, this._deliveryQueue));
	public readonly onMouseDropCanceled: Event<void> = this._onMouseDropCanceled.event;

	private readonly _onDropIntoEditor = this._register(new InteractionEmitter<{ readonly position: IPosition; readonly event: DragEvent }>(this._contributions, this._deliveryQueue));
	public readonly onDropIntoEditor = this._onDropIntoEditor.event;

	private readonly _onContextMenu: Emitter<editorBrowser.IEditorMouseEvent> = this._register(new InteractionEmitter<editorBrowser.IEditorMouseEvent>(this._contributions, this._deliveryQueue));
	public readonly onContextMenu: Event<editorBrowser.IEditorMouseEvent> = this._onContextMenu.event;

	private readonly _onMouseMove: Emitter<editorBrowser.IEditorMouseEvent> = this._register(new InteractionEmitter<editorBrowser.IEditorMouseEvent>(this._contributions, this._deliveryQueue));
	public readonly onMouseMove: Event<editorBrowser.IEditorMouseEvent> = this._onMouseMove.event;

	private readonly _onMouseLeave: Emitter<editorBrowser.IPartialEditorMouseEvent> = this._register(new InteractionEmitter<editorBrowser.IPartialEditorMouseEvent>(this._contributions, this._deliveryQueue));
	public readonly onMouseLeave: Event<editorBrowser.IPartialEditorMouseEvent> = this._onMouseLeave.event;

	private readonly _onMouseWheel: Emitter<IMouseWheelEvent> = this._register(new InteractionEmitter<IMouseWheelEvent>(this._contributions, this._deliveryQueue));
	public readonly onMouseWheel: Event<IMouseWheelEvent> = this._onMouseWheel.event;

	private readonly _onKeyUp: Emitter<IKeyboardEvent> = this._register(new InteractionEmitter<IKeyboardEvent>(this._contributions, this._deliveryQueue));
	public readonly onKeyUp: Event<IKeyboardEvent> = this._onKeyUp.event;

	private readonly _onKeyDown: Emitter<IKeyboardEvent> = this._register(new InteractionEmitter<IKeyboardEvent>(this._contributions, this._deliveryQueue));
	public readonly onKeyDown: Event<IKeyboardEvent> = this._onKeyDown.event;

	private readonly _onDidContentSizeChange: Emitter<editorCommon.IContentSizeChangedEvent> = this._register(new Emitter<editorCommon.IContentSizeChangedEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidContentSizeChange: Event<editorCommon.IContentSizeChangedEvent> = this._onDidContentSizeChange.event;

	private readonly _onDidScrollChange: Emitter<editorCommon.IScrollEvent> = this._register(new Emitter<editorCommon.IScrollEvent>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidScrollChange: Event<editorCommon.IScrollEvent> = this._onDidScrollChange.event;

	private readonly _onDidChangeViewZones: Emitter<void> = this._register(new Emitter<void>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidChangeViewZones: Event<void> = this._onDidChangeViewZones.event;

	private readonly _onDidChangeHiddenAreas: Emitter<void> = this._register(new Emitter<void>({ deliveryQueue: this._deliveryQueue }));
	public readonly onDidChangeHiddenAreas: Event<void> = this._onDidChangeHiddenAreas.event;

	private _updateCounter = 0;

	private readonly _onWillTriggerEditorOperationEvent: Emitter<editorCommon.ITriggerEditorOperationEvent> = this._register(new Emitter<editorCommon.ITriggerEditorOperationEvent>());
	public readonly onWillTriggerEditorOperationEvent: Event<editorCommon.ITriggerEditorOperationEvent> = this._onWillTriggerEditorOperationEvent.event;

	private readonly _onBeginUpdate: Emitter<void> = this._register(new Emitter<void>());
	public readonly onBeginUpdate: Event<void> = this._onBeginUpdate.event;

	private readonly _onEndUpdate: Emitter<void> = this._register(new Emitter<void>());
	public readonly onEndUpdate: Event<void> = this._onEndUpdate.event;

	private readonly _onBeforeExecuteEdit = this._register(new Emitter<{ source: string | undefined }>());
	public readonly onBeforeExecuteEdit = this._onBeforeExecuteEdit.event;

	//#endregion

	public get isSimpleWidget(): boolean {
		return this._configuration.isSimpleWidget;
	}

	public get contextMenuId(): MenuId {
		return this._configuration.contextMenuId;
	}

	private readonly _telemetryData?: object;

	private readonly _domElement: HTMLElement;
	private readonly _overflowWidgetsDomNode: HTMLElement | undefined;
	private readonly _id: number;
	private readonly _configuration: IEditorConfiguration;
	private _contributionsDisposable: IDisposable | undefined;

	protected readonly _actions = new Map<string, editorCommon.IEditorAction>();

	// --- Members logically associated to a model
	protected _modelData: ModelData | null;

	protected readonly _instantiationService: IInstantiationService;
	protected readonly _contextKeyService: IContextKeyService;
	get contextKeyService() { return this._contextKeyService; }
	private readonly _notificationService: INotificationService;
	protected readonly _codeEditorService: ICodeEditorService;
	private readonly _commandService: ICommandService;
	private readonly _themeService: IThemeService;

	private _contentWidgets: { [key: string]: IContentWidgetData };
	private _overlayWidgets: { [key: string]: IOverlayWidgetData };
	private _glyphMarginWidgets: { [key: string]: IGlyphMarginWidgetData };

	/**
	 * map from "parent" decoration type to live decoration ids.
	 */
	private _decorationTypeKeysToIds: { [decorationTypeKey: string]: string[] };
	private _decorationTypeSubtypes: { [decorationTypeKey: string]: { [subtype: string]: boolean } };

	private _bannerDomNode: HTMLElement | null = null;

	private _dropIntoEditorDecorations: EditorDecorationsCollection = this.createDecorationsCollection();

	public inComposition: boolean = false;

	constructor(
		domElement: HTMLElement,
		_options: Readonly<IEditorConstructionOptions>,
		codeEditorWidgetOptions: ICodeEditorWidgetOptions,
		@IInstantiationService instantiationService: IInstantiationService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@ICommandService commandService: ICommandService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IThemeService themeService: IThemeService,
		@INotificationService notificationService: INotificationService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
		@ILanguageConfigurationService private readonly languageConfigurationService: ILanguageConfigurationService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
	) {
		super();
		codeEditorService.willCreateCodeEditor();

		const options = { ..._options };

		this._domElement = domElement;
		this._overflowWidgetsDomNode = options.overflowWidgetsDomNode;
		delete options.overflowWidgetsDomNode;
		this._id = (++EDITOR_ID);
		this._decorationTypeKeysToIds = {};
		this._decorationTypeSubtypes = {};
		this._telemetryData = codeEditorWidgetOptions.telemetryData;

		this._configuration = this._register(this._createConfiguration(codeEditorWidgetOptions.isSimpleWidget || false,
			codeEditorWidgetOptions.contextMenuId ?? (codeEditorWidgetOptions.isSimpleWidget ? MenuId.SimpleEditorContext : MenuId.EditorContext),
			options, accessibilityService));
		this._register(this._configuration.onDidChange((e) => {
			this._onDidChangeConfiguration.fire(e);

			const options = this._configuration.options;
			if (e.hasChanged(EditorOption.layoutInfo)) {
				const layoutInfo = options.get(EditorOption.layoutInfo);
				this._onDidLayoutChange.fire(layoutInfo);
			}
		}));

		this._contextKeyService = this._register(contextKeyService.createScoped(this._domElement));
		if (codeEditorWidgetOptions.contextKeyValues) {
			for (const [key, value] of Object.entries(codeEditorWidgetOptions.contextKeyValues)) {
				this._contextKeyService.createKey(key, value);
			}
		}
		this._notificationService = notificationService;
		this._codeEditorService = codeEditorService;
		this._commandService = commandService;
		this._themeService = themeService;
		this._register(new EditorContextKeysManager(this, this._contextKeyService));
		this._register(new EditorModeContext(this, this._contextKeyService, languageFeaturesService));

		this._instantiationService = this._register(instantiationService.createChild(new ServiceCollection([IContextKeyService, this._contextKeyService])));

		this._modelData = null;

		this._contentWidgets = {};
		this._overlayWidgets = {};
		this._glyphMarginWidgets = {};

		let contributions: IEditorContributionDescription[];
		if (Array.isArray(codeEditorWidgetOptions.contributions)) {
			contributions = codeEditorWidgetOptions.contributions;
		} else {
			contributions = EditorExtensionsRegistry.getEditorContributions();
		}
		this._contributions.initialize(this, contributions, this._instantiationService);

		for (const action of EditorExtensionsRegistry.getEditorActions()) {
			if (this._actions.has(action.id)) {
				onUnexpectedError(new Error(`Cannot have two actions with the same id ${action.id}`));
				continue;
			}
			const internalAction = new InternalEditorAction(
				action.id,
				action.label,
				action.alias,
				action.metadata,
				action.precondition ?? undefined,
				(args: unknown): Promise<void> => {
					return this._instantiationService.invokeFunction((accessor) => {
						return Promise.resolve(action.runEditorCommand(accessor, this, args));
					});
				},
				this._contextKeyService
			);
			this._actions.set(internalAction.id, internalAction);
		}

		const isDropIntoEnabled = () => {
			return !this._configuration.options.get(EditorOption.readOnly)
				&& this._configuration.options.get(EditorOption.dropIntoEditor).enabled;
		};

		this._register(new dom.DragAndDropObserver(this._domElement, {
			onDragOver: e => {
				if (!isDropIntoEnabled()) {
					return;
				}

				const target = this.getTargetAtClientPoint(e.clientX, e.clientY);
				if (target?.position) {
					this.showDropIndicatorAt(target.position);
				}
			},
			onDrop: async e => {
				if (!isDropIntoEnabled()) {
					return;
				}

				this.removeDropIndicator();

				if (!e.dataTransfer) {
					return;
				}

				const target = this.getTargetAtClientPoint(e.clientX, e.clientY);
				if (target?.position) {
					this._onDropIntoEditor.fire({ position: target.position, event: e });
				}
			},
			onDragLeave: () => {
				this.removeDropIndicator();
			},
			onDragEnd: () => {
				this.removeDropIndicator();
			},
		}));

		this._codeEditorService.addCodeEditor(this);
	}

	public writeScreenReaderContent(reason: string): void {
		this._modelData?.view.writeScreenReaderContent(reason);
	}

	protected _createConfiguration(isSimpleWidget: boolean, contextMenuId: MenuId, options: Readonly<IEditorConstructionOptions>, accessibilityService: IAccessibilityService): EditorConfiguration {
		return new EditorConfiguration(isSimpleWidget, contextMenuId, options, this._domElement, accessibilityService);
	}

	public getId(): string {
		return this.getEditorType() + ':' + this._id;
	}

	public getEditorType(): string {
		return editorCommon.EditorType.ICodeEditor;
	}

	public override dispose(): void {
		this._codeEditorService.removeCodeEditor(this);

		this._actions.clear();
		this._contentWidgets = {};
		this._overlayWidgets = {};

		this._removeDecorationTypes();
		this._postDetachModelCleanup(this._detachModel());

		this._onDidDispose.fire();

		super.dispose();
	}

	public invokeWithinContext<T>(fn: (accessor: ServicesAccessor) => T): T {
		return this._instantiationService.invokeFunction(fn);
	}

	public updateOptions(newOptions: Readonly<IEditorOptions> | undefined): void {
		this._configuration.updateOptions(newOptions || {});
	}

	public getOptions(): IComputedEditorOptions {
		return this._configuration.options;
	}

	public getOption<T extends EditorOption>(id: T): FindComputedEditorOptionValueById<T> {
		return this._configuration.options.get(id);
	}

	public getRawOptions(): IEditorOptions {
		return this._configuration.getRawOptions();
	}

	public getOverflowWidgetsDomNode(): HTMLElement | undefined {
		return this._overflowWidgetsDomNode;
	}

	public getConfiguredWordAtPosition(position: Position): IWordAtPosition | null {
		if (!this._modelData) {
			return null;
		}
		return WordOperations.getWordAtPosition(this._modelData.model, this._configuration.options.get(EditorOption.wordSeparators), this._configuration.options.get(EditorOption.wordSegmenterLocales), position);
	}

	public getValue(options: { preserveBOM: boolean; lineEnding: string } | null = null): string {
		if (!this._modelData) {
			return '';
		}

		const preserveBOM: boolean = (options && options.preserveBOM) ? true : false;
		let eolPreference = EndOfLinePreference.TextDefined;
		if (options && options.lineEnding && options.lineEnding === '\n') {
			eolPreference = EndOfLinePreference.LF;
		} else if (options && options.lineEnding && options.lineEnding === '\r\n') {
			eolPreference = EndOfLinePreference.CRLF;
		}
		return this._modelData.model.getValue(eolPreference, preserveBOM);
	}

	public setValue(newValue: string): void {
		try {
			this._beginUpdate();
			if (!this._modelData) {
				return;
			}
			this._modelData.model.setValue(newValue);
		} finally {
			this._endUpdate();
		}
	}

	public getModel(): ITextModel | null {
		if (!this._modelData) {
			return null;
		}
		return this._modelData.model;
	}

	public setModel(_model: ITextModel | editorCommon.IDiffEditorModel | editorCommon.IDiffEditorViewModel | null = null): void {
		try {
			this._beginUpdate();
			const model = <ITextModel | null>_model;
			if (this._modelData === null && model === null) {
				// Current model is the new model
				return;
			}
			if (this._modelData && this._modelData.model === model) {
				// Current model is the new model
				return;
			}

			const e: editorCommon.IModelChangedEvent = {
				oldModelUrl: this._modelData?.model.uri || null,
				newModelUrl: model?.uri || null
			};
			this._onWillChangeModel.fire(e);

			const hasTextFocus = this.hasTextFocus();
			const detachedModel = this._detachModel();
			this._attachModel(model);
			if (this.hasModel()) {
				// we have a new model (with a new view)!
				if (hasTextFocus) {
					this.focus();
				}
			} else {
				// we have no model (and no view) anymore
				// make sure the outside world knows we are not focused
				this._editorTextFocus.setValue(false);
				this._editorWidgetFocus.setValue(false);
			}

			this._removeDecorationTypes();
			this._onDidChangeModel.fire(e);
			this._postDetachModelCleanup(detachedModel);

			this._contributionsDisposable = this._contributions.onAfterModelAttached();
		} finally {
			this._endUpdate();
		}
	}

	private _removeDecorationTypes(): void {
		this._decorationTypeKeysToIds = {};
		if (this._decorationTypeSubtypes) {
			for (const decorationType in this._decorationTypeSubtypes) {
				const subTypes = this._decorationTypeSubtypes[decorationType];
				for (const subType in subTypes) {
					this._removeDecorationType(decorationType + '-' + subType);
				}
			}
			this._decorationTypeSubtypes = {};
		}
	}

	public getVisibleRanges(): Range[] {
		if (!this._modelData) {
			return [];
		}
		return this._modelData.viewModel.getVisibleRanges();
	}

	public getVisibleRangesPlusViewportAboveBelow(): Range[] {
		if (!this._modelData) {
			return [];
		}
		return this._modelData.viewModel.getVisibleRangesPlusViewportAboveBelow();
	}

	public getWhitespaces(): IEditorWhitespace[] {
		if (!this._modelData) {
			return [];
		}
		return this._modelData.viewModel.viewLayout.getWhitespaces();
	}

	private static _getVerticalOffsetAfterPosition(modelData: ModelData, modelLineNumber: number, modelColumn: number, includeViewZones: boolean): number {
		const modelPosition = modelData.model.validatePosition({
			lineNumber: modelLineNumber,
			column: modelColumn
		});
		const viewPosition = modelData.viewModel.coordinatesConverter.convertModelPositionToViewPosition(modelPosition);
		return modelData.viewModel.viewLayout.getVerticalOffsetAfterLineNumber(viewPosition.lineNumber, includeViewZones);
	}

	public getTopForLineNumber(lineNumber: number, includeViewZones: boolean = false): number {
		if (!this._modelData) {
			return -1;
		}
		return CodeEditorWidget._getVerticalOffsetForPosition(this._modelData, lineNumber, 1, includeViewZones);
	}

	public getTopForPosition(lineNumber: number, column: number): number {
		if (!this._modelData) {
			return -1;
		}
		return CodeEditorWidget._getVerticalOffsetForPosition(this._modelData, lineNumber, column, false);
	}

	private static _getVerticalOffsetForPosition(modelData: ModelData, modelLineNumber: number, modelColumn: number, includeViewZones: boolean = false): number {
		const modelPosition = modelData.model.validatePosition({
			lineNumber: modelLineNumber,
			column: modelColumn
		});
		const viewPosition = modelData.viewModel.coordinatesConverter.convertModelPositionToViewPosition(modelPosition);
		return modelData.viewModel.viewLayout.getVerticalOffsetForLineNumber(viewPosition.lineNumber, includeViewZones);
	}

	public getBottomForLineNumber(lineNumber: number, includeViewZones: boolean = false): number {
		if (!this._modelData) {
			return -1;
		}
		return CodeEditorWidget._getVerticalOffsetAfterPosition(this._modelData, lineNumber, Number.MAX_SAFE_INTEGER, includeViewZones);
	}

	public getLineHeightForPosition(position: IPosition): number {
		if (!this._modelData) {
			return -1;
		}
		const viewModel = this._modelData.viewModel;
		const coordinatesConverter = viewModel.coordinatesConverter;
		const pos = Position.lift(position);
		if (coordinatesConverter.modelPositionIsVisible(pos)) {
			const viewPosition = coordinatesConverter.convertModelPositionToViewPosition(pos);
			return viewModel.viewLayout.getLineHeightForLineNumber(viewPosition.lineNumber);
		}
		return 0;
	}

	public setHiddenAreas(ranges: IRange[], source?: unknown, forceUpdate?: boolean): void {
		this._modelData?.viewModel.setHiddenAreas(ranges.map(r => Range.lift(r)), source, forceUpdate);
	}

	public getVisibleColumnFromPosition(rawPosition: IPosition): number {
		if (!this._modelData) {
			return rawPosition.column;
		}

		const position = this._modelData.model.validatePosition(rawPosition);
		const tabSize = this._modelData.model.getOptions().tabSize;

		return CursorColumns.visibleColumnFromColumn(this._modelData.model.getLineContent(position.lineNumber), position.column, tabSize) + 1;
	}

	public getStatusbarColumn(rawPosition: IPosition): number {
		if (!this._modelData) {
			return rawPosition.column;
		}

		const position = this._modelData.model.validatePosition(rawPosition);
		const tabSize = this._modelData.model.getOptions().tabSize;

		return CursorColumns.toStatusbarColumn(this._modelData.model.getLineContent(position.lineNumber), position.column, tabSize);
	}

	public getPosition(): Position | null {
		if (!this._modelData) {
			return null;
		}
		return this._modelData.viewModel.getPosition();
	}

	public setPosition(position: IPosition, source: string = 'api'): void {
		if (!this._modelData) {
			return;
		}
		if (!Position.isIPosition(position)) {
			throw new Error('Invalid arguments');
		}
		this._modelData.viewModel.setSelections(source, [{
			selectionStartLineNumber: position.lineNumber,
			selectionStartColumn: position.column,
			positionLineNumber: position.lineNumber,
			positionColumn: position.column
		}]);
	}

	private _sendRevealRange(modelRange: Range, verticalType: VerticalRevealType, revealHorizontal: boolean, scrollType: editorCommon.ScrollType): void {
		if (!this._modelData) {
			return;
		}
		if (!Range.isIRange(modelRange)) {
			throw new Error('Invalid arguments');
		}
		const validatedModelRange = this._modelData.model.validateRange(modelRange);
		const viewRange = this._modelData.viewModel.coordinatesConverter.convertModelRangeToViewRange(validatedModelRange);

		this._modelData.viewModel.revealRange('api', revealHorizontal, viewRange, verticalType, scrollType);
	}

	public revealAllCursors(revealHorizontal: boolean, minimalReveal?: boolean): void {
		if (!this._modelData) {
			return;
		}
		this._modelData.viewModel.revealAllCursors('api', revealHorizontal, minimalReveal);
	}

	public revealLine(lineNumber: number, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealLine(lineNumber, VerticalRevealType.Simple, scrollType);
	}

	public revealLineInCenter(lineNumber: number, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealLine(lineNumber, VerticalRevealType.Center, scrollType);
	}

	public revealLineInCenterIfOutsideViewport(lineNumber: number, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealLine(lineNumber, VerticalRevealType.CenterIfOutsideViewport, scrollType);
	}

	public revealLineNearTop(lineNumber: number, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealLine(lineNumber, VerticalRevealType.NearTop, scrollType);
	}

	private _revealLine(lineNumber: number, revealType: VerticalRevealType, scrollType: editorCommon.ScrollType): void {
		if (typeof lineNumber !== 'number') {
			throw new Error('Invalid arguments');
		}

		this._sendRevealRange(
			new Range(lineNumber, 1, lineNumber, 1),
			revealType,
			false,
			scrollType
		);
	}

	public revealPosition(position: IPosition, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealPosition(
			position,
			VerticalRevealType.Simple,
			true,
			scrollType
		);
	}

	public revealPositionInCenter(position: IPosition, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealPosition(
			position,
			VerticalRevealType.Center,
			true,
			scrollType
		);
	}

	public revealPositionInCenterIfOutsideViewport(position: IPosition, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealPosition(
			position,
			VerticalRevealType.CenterIfOutsideViewport,
			true,
			scrollType
		);
	}

	public revealPositionNearTop(position: IPosition, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealPosition(
			position,
			VerticalRevealType.NearTop,
			true,
			scrollType
		);
	}

	private _revealPosition(position: IPosition, verticalType: VerticalRevealType, revealHorizontal: boolean, scrollType: editorCommon.ScrollType): void {
		if (!Position.isIPosition(position)) {
			throw new Error('Invalid arguments');
		}

		this._sendRevealRange(
			new Range(position.lineNumber, position.column, position.lineNumber, position.column),
			verticalType,
			revealHorizontal,
			scrollType
		);
	}

	public getSelection(): Selection | null {
		if (!this._modelData) {
			return null;
		}
		return this._modelData.viewModel.getSelection();
	}

	public getSelections(): Selection[] | null {
		if (!this._modelData) {
			return null;
		}
		return this._modelData.viewModel.getSelections();
	}

	public setSelection(range: IRange, source?: string): void;
	public setSelection(editorRange: Range, source?: string): void;
	public setSelection(selection: ISelection, source?: string): void;
	public setSelection(editorSelection: Selection, source?: string): void;
	public setSelection(something: unknown, source?: string): void;
	public setSelection(something: unknown, source: string = 'api'): void {
		const isSelection = Selection.isISelection(something);
		const isRange = Range.isIRange(something);

		if (!isSelection && !isRange) {
			throw new Error('Invalid arguments');
		}

		if (isSelection) {
			this._setSelectionImpl(something, source);
		} else if (isRange) {
			// act as if it was an IRange
			const selection: ISelection = {
				selectionStartLineNumber: something.startLineNumber,
				selectionStartColumn: something.startColumn,
				positionLineNumber: something.endLineNumber,
				positionColumn: something.endColumn
			};
			this._setSelectionImpl(selection, source);
		}
	}

	private _setSelectionImpl(sel: ISelection, source: string): void {
		if (!this._modelData) {
			return;
		}
		const selection = new Selection(sel.selectionStartLineNumber, sel.selectionStartColumn, sel.positionLineNumber, sel.positionColumn);
		this._modelData.viewModel.setSelections(source, [selection]);
	}

	public revealLines(startLineNumber: number, endLineNumber: number, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealLines(
			startLineNumber,
			endLineNumber,
			VerticalRevealType.Simple,
			scrollType
		);
	}

	public revealLinesInCenter(startLineNumber: number, endLineNumber: number, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealLines(
			startLineNumber,
			endLineNumber,
			VerticalRevealType.Center,
			scrollType
		);
	}

	public revealLinesInCenterIfOutsideViewport(startLineNumber: number, endLineNumber: number, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealLines(
			startLineNumber,
			endLineNumber,
			VerticalRevealType.CenterIfOutsideViewport,
			scrollType
		);
	}

	public revealLinesNearTop(startLineNumber: number, endLineNumber: number, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealLines(
			startLineNumber,
			endLineNumber,
			VerticalRevealType.NearTop,
			scrollType
		);
	}

	private _revealLines(startLineNumber: number, endLineNumber: number, verticalType: VerticalRevealType, scrollType: editorCommon.ScrollType): void {
		if (typeof startLineNumber !== 'number' || typeof endLineNumber !== 'number') {
			throw new Error('Invalid arguments');
		}

		this._sendRevealRange(
			new Range(startLineNumber, 1, endLineNumber, 1),
			verticalType,
			false,
			scrollType
		);
	}

	public revealRange(range: IRange, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth, revealVerticalInCenter: boolean = false, revealHorizontal: boolean = true): void {
		this._revealRange(
			range,
			revealVerticalInCenter ? VerticalRevealType.Center : VerticalRevealType.Simple,
			revealHorizontal,
			scrollType
		);
	}

	public revealRangeInCenter(range: IRange, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealRange(
			range,
			VerticalRevealType.Center,
			true,
			scrollType
		);
	}

	public revealRangeInCenterIfOutsideViewport(range: IRange, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealRange(
			range,
			VerticalRevealType.CenterIfOutsideViewport,
			true,
			scrollType
		);
	}

	public revealRangeNearTop(range: IRange, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealRange(
			range,
			VerticalRevealType.NearTop,
			true,
			scrollType
		);
	}

	public revealRangeNearTopIfOutsideViewport(range: IRange, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealRange(
			range,
			VerticalRevealType.NearTopIfOutsideViewport,
			true,
			scrollType
		);
	}

	public revealRangeAtTop(range: IRange, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Smooth): void {
		this._revealRange(
			range,
			VerticalRevealType.Top,
			true,
			scrollType
		);
	}

	private _revealRange(range: IRange, verticalType: VerticalRevealType, revealHorizontal: boolean, scrollType: editorCommon.ScrollType): void {
		if (!Range.isIRange(range)) {
			throw new Error('Invalid arguments');
		}

		this._sendRevealRange(
			Range.lift(range),
			verticalType,
			revealHorizontal,
			scrollType
		);
	}

	public setSelections(ranges: readonly ISelection[], source: string = 'api', reason = CursorChangeReason.NotSet): void {
		if (!this._modelData) {
			return;
		}
		if (!ranges || ranges.length === 0) {
			throw new Error('Invalid arguments');
		}
		for (let i = 0, len = ranges.length; i < len; i++) {
			if (!Selection.isISelection(ranges[i])) {
				throw new Error('Invalid arguments');
			}
		}
		this._modelData.viewModel.setSelections(source, ranges, reason);
	}

	public getContentWidth(): number {
		if (!this._modelData) {
			return -1;
		}
		return this._modelData.viewModel.viewLayout.getContentWidth();
	}

	public getScrollWidth(): number {
		if (!this._modelData) {
			return -1;
		}
		return this._modelData.viewModel.viewLayout.getScrollWidth();
	}
	public getScrollLeft(): number {
		if (!this._modelData) {
			return -1;
		}
		return this._modelData.viewModel.viewLayout.getCurrentScrollLeft();
	}

	public getContentHeight(): number {
		if (!this._modelData) {
			return -1;
		}
		return this._modelData.viewModel.viewLayout.getContentHeight();
	}

	public getScrollHeight(): number {
		if (!this._modelData) {
			return -1;
		}
		return this._modelData.viewModel.viewLayout.getScrollHeight();
	}
	public getScrollTop(): number {
		if (!this._modelData) {
			return -1;
		}
		return this._modelData.viewModel.viewLayout.getCurrentScrollTop();
	}

	public setScrollLeft(newScrollLeft: number, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Immediate): void {
		if (!this._modelData) {
			return;
		}
		if (typeof newScrollLeft !== 'number') {
			throw new Error('Invalid arguments');
		}
		this._modelData.viewModel.viewLayout.setScrollPosition({
			scrollLeft: newScrollLeft
		}, scrollType);
	}
	public setScrollTop(newScrollTop: number, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Immediate): void {
		if (!this._modelData) {
			return;
		}
		if (typeof newScrollTop !== 'number') {
			throw new Error('Invalid arguments');
		}
		this._modelData.viewModel.viewLayout.setScrollPosition({
			scrollTop: newScrollTop
		}, scrollType);
	}
	public setScrollPosition(position: editorCommon.INewScrollPosition, scrollType: editorCommon.ScrollType = editorCommon.ScrollType.Immediate): void {
		if (!this._modelData) {
			return;
		}
		this._modelData.viewModel.viewLayout.setScrollPosition(position, scrollType);
	}
	public hasPendingScrollAnimation(): boolean {
		if (!this._modelData) {
			return false;
		}
		return this._modelData.viewModel.viewLayout.hasPendingScrollAnimation();
	}

	public saveViewState(): editorCommon.ICodeEditorViewState | null {
		if (!this._modelData) {
			return null;
		}
		const contributionsState = this._contributions.saveViewState();
		const cursorState = this._modelData.viewModel.saveCursorState();
		const viewState = this._modelData.viewModel.saveState();
		return {
			cursorState: cursorState,
			viewState: viewState,
			contributionsState: contributionsState
		};
	}

	public restoreViewState(s: editorCommon.IEditorViewState | null): void {
		if (!this._modelData || !this._modelData.hasRealView) {
			return;
		}
		const codeEditorState = s as editorCommon.ICodeEditorViewState | null;
		if (codeEditorState && codeEditorState.cursorState && codeEditorState.viewState) {
			const cursorState = <unknown>codeEditorState.cursorState;
			if (Array.isArray(cursorState)) {
				if (cursorState.length > 0) {
					this._modelData.viewModel.restoreCursorState(<editorCommon.ICursorState[]>cursorState);
				}
			} else {
				// Backwards compatibility
				this._modelData.viewModel.restoreCursorState([<editorCommon.ICursorState>cursorState]);
			}

			this._contributions.restoreViewState(codeEditorState.contributionsState || {});
			const reducedState = this._modelData.viewModel.reduceRestoreState(codeEditorState.viewState);
			this._modelData.view.restoreState(reducedState);
		}
	}

	public handleInitialized(): void {
		this._getViewModel()?.visibleLinesStabilized();
	}

	public onVisible(): void {
		this._modelData?.view.refreshFocusState();
	}

	public onHide(): void {
		this._modelData?.view.refreshFocusState();
	}

	public getContribution<T extends editorCommon.IEditorContribution>(id: string): T | null {
		return this._contributions.get(id) as T | null;
	}

	public getActions(): editorCommon.IEditorAction[] {
		return Array.from(this._actions.values());
	}

	public getSupportedActions(): editorCommon.IEditorAction[] {
		let result = this.getActions();

		result = result.filter(action => action.isSupported());

		return result;
	}

	public getAction(id: string): editorCommon.IEditorAction | null {
		return this._actions.get(id) || null;
	}

	public trigger(source: string | null | undefined, handlerId: string, payload: unknown): void {
		payload = payload || {};

		try {
			this._onWillTriggerEditorOperationEvent.fire({ source: source, handlerId: handlerId, payload: payload });
			this._beginUpdate();

			switch (handlerId) {
				case editorCommon.Handler.CompositionStart:
					this._startComposition();
					return;
				case editorCommon.Handler.CompositionEnd:
					this._endComposition(source);
					return;
				case editorCommon.Handler.Type: {
					const args = <Partial<editorCommon.TypePayload>>payload;
					this._type(source, args.text || '');
					return;
				}
				case editorCommon.Handler.ReplacePreviousChar: {
					const args = <Partial<editorCommon.ReplacePreviousCharPayload>>payload;
					this._compositionType(source, args.text || '', args.replaceCharCnt || 0, 0, 0);
					return;
				}
				case editorCommon.Handler.CompositionType: {
					const args = <Partial<editorCommon.CompositionTypePayload>>payload;
					this._compositionType(source, args.text || '', args.replacePrevCharCnt || 0, args.replaceNextCharCnt || 0, args.positionDelta || 0);
					return;
				}
				case editorCommon.Handler.Paste: {
					const args = <Partial<editorBrowser.PastePayload>>payload;
					this._paste(source, args.text || '', args.pasteOnNewLine || false, args.multicursorText || null, args.mode || null, args.clipboardEvent);
					return;
				}
				case editorCommon.Handler.Cut:
					this._cut(source);
					return;
			}

			const action = this.getAction(handlerId);
			if (action) {
				Promise.resolve(action.run(payload)).then(undefined, onUnexpectedError);
				return;
			}

			if (!this._modelData) {
				return;
			}

			if (this._triggerEditorCommand(source, handlerId, payload)) {
				return;
			}

			this._triggerCommand(handlerId, payload);
		} finally {
			this._endUpdate();
		}
	}

	protected _triggerCommand(handlerId: string, payload: unknown): void {
		this._commandService.executeCommand(handlerId, payload);
	}

	private _startComposition(): void {
		if (!this._modelData) {
			return;
		}
		this.inComposition = true;
		this._modelData.viewModel.startComposition();
		this._onDidCompositionStart.fire();
	}

	private _endComposition(source: string | null | undefined): void {
		if (!this._modelData) {
			return;
		}
		this.inComposition = false;
		this._modelData.viewModel.endComposition(source);
		this._onDidCompositionEnd.fire();
	}

	private _type(source: string | null | undefined, text: string): void {
		if (!this._modelData || text.length === 0) {
			return;
		}
		if (source === 'keyboard') {
			this._onWillType.fire(text);
		}
		this._modelData.viewModel.type(text, source);
		if (source === 'keyboard') {
			this._onDidType.fire(text);
		}
	}

	private _compositionType(source: string | null | undefined, text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number): void {
		if (!this._modelData) {
			return;
		}
		this._modelData.viewModel.compositionType(text, replacePrevCharCnt, replaceNextCharCnt, positionDelta, source);
	}

	private _paste(source: string | null | undefined, text: string, pasteOnNewLine: boolean, multicursorText: string[] | null, mode: string | null, clipboardEvent?: ClipboardEvent): void {
		if (!this._modelData) {
			return;
		}
		const viewModel = this._modelData.viewModel;
		const startPosition = viewModel.getSelection().getStartPosition();
		viewModel.paste(text, pasteOnNewLine, multicursorText, source);
		const endPosition = viewModel.getSelection().getStartPosition();
		if (source === 'keyboard') {
			this._onDidPaste.fire({
				clipboardEvent,
				range: new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column),
				languageId: mode
			});
		}
	}

	private _cut(source: string | null | undefined): void {
		if (!this._modelData) {
			return;
		}
		this._modelData.viewModel.cut(source);
	}

	private _triggerEditorCommand(source: string | null | undefined, handlerId: string, payload: unknown): boolean {
		const command = EditorExtensionsRegistry.getEditorCommand(handlerId);
		if (command) {
			payload = payload || {};
			if (isObject(payload)) {
				(payload as { source: string | null | undefined }).source = source;
			}
			this._instantiationService.invokeFunction((accessor) => {
				Promise.resolve(command.runEditorCommand(accessor, this, payload)).then(undefined, onUnexpectedError);
			});
			return true;
		}

		return false;
	}

	public _getViewModel(): IViewModel | null {
		if (!this._modelData) {
			return null;
		}
		return this._modelData.viewModel;
	}

	public pushUndoStop(): boolean {
		if (!this._modelData) {
			return false;
		}
		if (this._configuration.options.get(EditorOption.readOnly)) {
			// read only editor => sorry!
			return false;
		}
		this._modelData.model.pushStackElement();
		return true;
	}

	public popUndoStop(): boolean {
		if (!this._modelData) {
			return false;
		}
		if (this._configuration.options.get(EditorOption.readOnly)) {
			// read only editor => sorry!
			return false;
		}
		this._modelData.model.popStackElement();
		return true;
	}

	public edit(edit: TextEdit, reason: TextModelEditSource): boolean {
		return this.executeEdits(reason, edit.replacements.map<IIdentifiedSingleEditOperation>(e => ({ range: e.range, text: e.text })), undefined);
	}

	public executeEdits(source: string | null | undefined | TextModelEditSource, edits: IIdentifiedSingleEditOperation[], endCursorState?: ICursorStateComputer | Selection[]): boolean {
		if (!this._modelData) {
			return false;
		}
		if (this._configuration.options.get(EditorOption.readOnly)) {
			// read only editor => sorry!
			return false;
		}

		let cursorStateComputer: ICursorStateComputer;
		if (!endCursorState) {
			cursorStateComputer = () => null;
		} else if (Array.isArray(endCursorState)) {
			cursorStateComputer = () => endCursorState;
		} else {
			cursorStateComputer = endCursorState;
		}

		let sourceStr: string | undefined | null;
		let reason: TextModelEditSource;

		if (source instanceof TextModelEditSource) {
			reason = source;
			sourceStr = source.metadata.source;
		} else {
			reason = EditSources.unknown({ name: sourceStr });
			sourceStr = source;
		}

		this._onBeforeExecuteEdit.fire({ source: sourceStr ?? undefined });
		this._modelData.viewModel.executeEdits(sourceStr, edits, cursorStateComputer, reason);
		return true;
	}

	public executeCommand(source: string | null | undefined, command: editorCommon.ICommand): void {
		if (!this._modelData) {
			return;
		}
		this._modelData.viewModel.executeCommand(command, source);
	}

	public executeCommands(source: string | null | undefined, commands: editorCommon.ICommand[]): void {
		if (!this._modelData) {
			return;
		}
		this._modelData.viewModel.executeCommands(commands, source);
	}

	public createDecorationsCollection(decorations?: IModelDeltaDecoration[]): EditorDecorationsCollection {
		return new EditorDecorationsCollection(this, decorations);
	}

	public changeDecorations<T>(callback: (changeAccessor: IModelDecorationsChangeAccessor) => T): T | null {
		if (!this._modelData) {
			// callback will not be called
			return null;
		}
		return this._modelData.model.changeDecorations(callback, this._id);
	}

	public getLineDecorations(lineNumber: number): IModelDecoration[] | null {
		if (!this._modelData) {
			return null;
		}
		const options = this._configuration.options;
		return this._modelData.model.getLineDecorations(lineNumber, this._id, filterValidationDecorations(options), filterFontDecorations(options));
	}

	public getDecorationsInRange(range: Range): IModelDecoration[] | null {
		if (!this._modelData) {
			return null;
		}
		const options = this._configuration.options;
		return this._modelData.model.getDecorationsInRange(range, this._id, filterValidationDecorations(options), filterFontDecorations(options));
	}

	public getFontSizeAtPosition(position: IPosition): string | null {
		if (!this._modelData) {
			return null;
		}
		return this._modelData.viewModel.getFontSizeAtPosition(position);
	}

	/**
	 * @deprecated
	 */
	public deltaDecorations(oldDecorations: string[], newDecorations: IModelDeltaDecoration[]): string[] {
		if (!this._modelData) {
			return [];
		}

		if (oldDecorations.length === 0 && newDecorations.length === 0) {
			return oldDecorations;
		}

		return this._modelData.model.deltaDecorations(oldDecorations, newDecorations, this._id);
	}

	public removeDecorations(decorationIds: string[]): void {
		if (!this._modelData || decorationIds.length === 0) {
			return;
		}

		this._modelData.model.changeDecorations((changeAccessor) => {
			changeAccessor.deltaDecorations(decorationIds, []);
		});
	}

	public setDecorationsByType(description: string, decorationTypeKey: string, decorationOptions: editorCommon.IDecorationOptions[]): readonly string[] {

		const newDecorationsSubTypes: { [key: string]: boolean } = {};
		const oldDecorationsSubTypes = this._decorationTypeSubtypes[decorationTypeKey] || {};
		this._decorationTypeSubtypes[decorationTypeKey] = newDecorationsSubTypes;

		const newModelDecorations: IModelDeltaDecoration[] = [];

		for (const decorationOption of decorationOptions) {
			let typeKey = decorationTypeKey;
			if (decorationOption.renderOptions) {
				// identify custom render options by a hash code over all keys and values
				// For custom render options register a decoration type if necessary
				const subType = hash(decorationOption.renderOptions).toString(16);
				// The fact that `decorationTypeKey` appears in the typeKey has no influence
				// it is just a mechanism to get predictable and unique keys (repeatable for the same options and unique across clients)
				typeKey = decorationTypeKey + '-' + subType;
				if (!oldDecorationsSubTypes[subType] && !newDecorationsSubTypes[subType]) {
					// decoration type did not exist before, register new one
					this._registerDecorationType(description, typeKey, decorationOption.renderOptions, decorationTypeKey);
				}
				newDecorationsSubTypes[subType] = true;
			}
			const opts = this._resolveDecorationOptions(typeKey, !!decorationOption.hoverMessage);
			if (decorationOption.hoverMessage) {
				opts.hoverMessage = decorationOption.hoverMessage;
			}
			newModelDecorations.push({ range: decorationOption.range, options: opts });
		}

		// remove decoration sub types that are no longer used, deregister decoration type if necessary
		for (const subType in oldDecorationsSubTypes) {
			if (!newDecorationsSubTypes[subType]) {
				this._removeDecorationType(decorationTypeKey + '-' + subType);
			}
		}

		// update all decorations
		const oldDecorationsIds = this._decorationTypeKeysToIds[decorationTypeKey] || [];
		this.changeDecorations(accessor => this._decorationTypeKeysToIds[decorationTypeKey] = accessor.deltaDecorations(oldDecorationsIds, newModelDecorations));
		return this._decorationTypeKeysToIds[decorationTypeKey] || [];
	}

	public setDecorationsByTypeFast(decorationTypeKey: string, ranges: IRange[]): void {

		// remove decoration sub types that are no longer used, deregister decoration type if necessary
		const oldDecorationsSubTypes = this._decorationTypeSubtypes[decorationTypeKey] || {};
		for (const subType in oldDecorationsSubTypes) {
			this._removeDecorationType(decorationTypeKey + '-' + subType);
		}
		this._decorationTypeSubtypes[decorationTypeKey] = {};

		const opts = ModelDecorationOptions.createDynamic(this._resolveDecorationOptions(decorationTypeKey, false));
		const newModelDecorations: IModelDeltaDecoration[] = new Array<IModelDeltaDecoration>(ranges.length);
		for (let i = 0, len = ranges.length; i < len; i++) {
			newModelDecorations[i] = { range: ranges[i], options: opts };
		}

		// update all decorations
		const oldDecorationsIds = this._decorationTypeKeysToIds[decorationTypeKey] || [];
		this.changeDecorations(accessor => this._decorationTypeKeysToIds[decorationTypeKey] = accessor.deltaDecorations(oldDecorationsIds, newModelDecorations));
	}

	public removeDecorationsByType(decorationTypeKey: string): void {
		// remove decorations for type and sub type
		const oldDecorationsIds = this._decorationTypeKeysToIds[decorationTypeKey];
		if (oldDecorationsIds) {
			this.changeDecorations(accessor => accessor.deltaDecorations(oldDecorationsIds, []));
		}
		if (this._decorationTypeKeysToIds.hasOwnProperty(decorationTypeKey)) {
			delete this._decorationTypeKeysToIds[decorationTypeKey];
		}
		if (this._decorationTypeSubtypes.hasOwnProperty(decorationTypeKey)) {
			const items = this._decorationTypeSubtypes[decorationTypeKey];
			for (const subType of Object.keys(items)) {
				this._removeDecorationType(decorationTypeKey + '-' + subType);
			}
			delete this._decorationTypeSubtypes[decorationTypeKey];

		}
	}

	public getLayoutInfo(): EditorLayoutInfo {
		const options = this._configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);
		return layoutInfo;
	}

	public createOverviewRuler(cssClassName: string): editorBrowser.IOverviewRuler | null {
		if (!this._modelData || !this._modelData.hasRealView) {
			return null;
		}
		return this._modelData.view.createOverviewRuler(cssClassName);
	}

	public getContainerDomNode(): HTMLElement {
		return this._domElement;
	}

	public getDomNode(): HTMLElement | null {
		if (!this._modelData || !this._modelData.hasRealView) {
			return null;
		}
		return this._modelData.view.domNode.domNode;
	}

	public delegateVerticalScrollbarPointerDown(browserEvent: PointerEvent): void {
		if (!this._modelData || !this._modelData.hasRealView) {
			return;
		}
		this._modelData.view.delegateVerticalScrollbarPointerDown(browserEvent);
	}

	public delegateScrollFromMouseWheelEvent(browserEvent: IMouseWheelEvent) {
		if (!this._modelData || !this._modelData.hasRealView) {
			return;
		}
		this._modelData.view.delegateScrollFromMouseWheelEvent(browserEvent);
	}

	public layout(dimension?: IDimension, postponeRendering: boolean = false): void {
		this._configuration.observeContainer(dimension);
		if (!postponeRendering) {
			this.render();
		}
	}

	public focus(): void {
		if (!this._modelData || !this._modelData.hasRealView) {
			return;
		}
		this._modelData.view.focus();
	}

	public hasTextFocus(): boolean {
		if (!this._modelData || !this._modelData.hasRealView) {
			return false;
		}
		return this._modelData.view.isFocused();
	}

	public hasWidgetFocus(): boolean {
		if (!this._modelData || !this._modelData.hasRealView) {
			return false;
		}
		return this._modelData.view.isWidgetFocused();
	}

	public addContentWidget(widget: editorBrowser.IContentWidget): void {
		const widgetData: IContentWidgetData = {
			widget: widget,
			position: widget.getPosition()
		};

		if (this._contentWidgets.hasOwnProperty(widget.getId())) {
			console.warn('Overwriting a content widget with the same id:' + widget.getId());
		}

		this._contentWidgets[widget.getId()] = widgetData;

		if (this._modelData && this._modelData.hasRealView) {
			this._modelData.view.addContentWidget(widgetData);
		}
	}

	public layoutContentWidget(widget: editorBrowser.IContentWidget): void {
		const widgetId = widget.getId();
		if (this._contentWidgets.hasOwnProperty(widgetId)) {
			const widgetData = this._contentWidgets[widgetId];
			widgetData.position = widget.getPosition();
			if (this._modelData && this._modelData.hasRealView) {
				this._modelData.view.layoutContentWidget(widgetData);
			}
		}
	}

	public removeContentWidget(widget: editorBrowser.IContentWidget): void {
		const widgetId = widget.getId();
		if (this._contentWidgets.hasOwnProperty(widgetId)) {
			const widgetData = this._contentWidgets[widgetId];
			delete this._contentWidgets[widgetId];
			if (this._modelData && this._modelData.hasRealView) {
				this._modelData.view.removeContentWidget(widgetData);
			}
		}
	}

	public addOverlayWidget(widget: editorBrowser.IOverlayWidget): void {
		const widgetData: IOverlayWidgetData = {
			widget: widget,
			position: widget.getPosition()
		};

		if (this._overlayWidgets.hasOwnProperty(widget.getId())) {
			console.warn('Overwriting an overlay widget with the same id.');
		}

		this._overlayWidgets[widget.getId()] = widgetData;
		if (this._modelData && this._modelData.hasRealView) {
			this._modelData.view.addOverlayWidget(widgetData);
		}
	}

	public layoutOverlayWidget(widget: editorBrowser.IOverlayWidget): void {
		const widgetId = widget.getId();
		if (this._overlayWidgets.hasOwnProperty(widgetId)) {
			const widgetData = this._overlayWidgets[widgetId];
			widgetData.position = widget.getPosition();
			if (this._modelData && this._modelData.hasRealView) {
				this._modelData.view.layoutOverlayWidget(widgetData);
			}
		}
	}

	public removeOverlayWidget(widget: editorBrowser.IOverlayWidget): void {
		const widgetId = widget.getId();
		if (this._overlayWidgets.hasOwnProperty(widgetId)) {
			const widgetData = this._overlayWidgets[widgetId];
			delete this._overlayWidgets[widgetId];
			if (this._modelData && this._modelData.hasRealView) {
				this._modelData.view.removeOverlayWidget(widgetData);
			}
		}
	}

	public addGlyphMarginWidget(widget: editorBrowser.IGlyphMarginWidget): void {
		const widgetData: IGlyphMarginWidgetData = {
			widget: widget,
			position: widget.getPosition()
		};

		if (this._glyphMarginWidgets.hasOwnProperty(widget.getId())) {
			console.warn('Overwriting a glyph margin widget with the same id.');
		}

		this._glyphMarginWidgets[widget.getId()] = widgetData;

		if (this._modelData && this._modelData.hasRealView) {
			this._modelData.view.addGlyphMarginWidget(widgetData);
		}
	}

	public layoutGlyphMarginWidget(widget: editorBrowser.IGlyphMarginWidget): void {
		const widgetId = widget.getId();
		if (this._glyphMarginWidgets.hasOwnProperty(widgetId)) {
			const widgetData = this._glyphMarginWidgets[widgetId];
			widgetData.position = widget.getPosition();
			if (this._modelData && this._modelData.hasRealView) {
				this._modelData.view.layoutGlyphMarginWidget(widgetData);
			}
		}
	}

	public removeGlyphMarginWidget(widget: editorBrowser.IGlyphMarginWidget): void {
		const widgetId = widget.getId();
		if (this._glyphMarginWidgets.hasOwnProperty(widgetId)) {
			const widgetData = this._glyphMarginWidgets[widgetId];
			delete this._glyphMarginWidgets[widgetId];
			if (this._modelData && this._modelData.hasRealView) {
				this._modelData.view.removeGlyphMarginWidget(widgetData);
			}
		}
	}

	public changeViewZones(callback: (accessor: editorBrowser.IViewZoneChangeAccessor) => void): void {
		if (!this._modelData || !this._modelData.hasRealView) {
			return;
		}
		this._modelData.view.change(callback);
	}

	public getTargetAtClientPoint(clientX: number, clientY: number): editorBrowser.IMouseTarget | null {
		if (!this._modelData || !this._modelData.hasRealView) {
			return null;
		}
		return this._modelData.view.getTargetAtClientPoint(clientX, clientY);
	}

	public getScrolledVisiblePosition(rawPosition: IPosition): { top: number; left: number; height: number } | null {
		if (!this._modelData || !this._modelData.hasRealView) {
			return null;
		}

		const position = this._modelData.model.validatePosition(rawPosition);
		const options = this._configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);

		const top = CodeEditorWidget._getVerticalOffsetForPosition(this._modelData, position.lineNumber, position.column) - this.getScrollTop();
		const left = this._modelData.view.getOffsetForColumn(position.lineNumber, position.column) + layoutInfo.glyphMarginWidth + layoutInfo.lineNumbersWidth + layoutInfo.decorationsWidth - this.getScrollLeft();
		const height = this.getLineHeightForPosition(position);
		return {
			top: top,
			left: left,
			height
		};
	}

	public getOffsetForColumn(lineNumber: number, column: number): number {
		if (!this._modelData || !this._modelData.hasRealView) {
			return -1;
		}
		return this._modelData.view.getOffsetForColumn(lineNumber, column);
	}

	public getWidthOfLine(lineNumber: number): number {
		if (!this._modelData || !this._modelData.hasRealView) {
			return -1;
		}
		return this._modelData.view.getLineWidth(lineNumber);
	}

	public render(forceRedraw: boolean = false): void {
		if (!this._modelData || !this._modelData.hasRealView) {
			return;
		}
		this._modelData.viewModel.batchEvents(() => {
			this._modelData!.view.render(true, forceRedraw);
		});
	}

	public setAriaOptions(options: editorBrowser.IEditorAriaOptions): void {
		if (!this._modelData || !this._modelData.hasRealView) {
			return;
		}
		this._modelData.view.setAriaOptions(options);
	}

	public applyFontInfo(target: HTMLElement): void {
		applyFontInfo(target, this._configuration.options.get(EditorOption.fontInfo));
	}

	public setBanner(domNode: HTMLElement | null, domNodeHeight: number): void {
		if (this._bannerDomNode && this._domElement.contains(this._bannerDomNode)) {
			this._bannerDomNode.remove();
		}

		this._bannerDomNode = domNode;
		this._configuration.setReservedHeight(domNode ? domNodeHeight : 0);

		if (this._bannerDomNode) {
			this._domElement.prepend(this._bannerDomNode);
		}
	}

	protected _attachModel(model: ITextModel | null): void {
		if (!model) {
			this._modelData = null;
			return;
		}

		const listenersToRemove: IDisposable[] = [];

		this._domElement.setAttribute('data-mode-id', model.getLanguageId());
		this._configuration.setIsDominatedByLongLines(model.isDominatedByLongLines());
		this._configuration.setModelLineCount(model.getLineCount());

		const attachedView = model.onBeforeAttached();

		const viewModel = new ViewModel(
			this._id,
			this._configuration,
			model,
			DOMLineBreaksComputerFactory.create(dom.getWindow(this._domElement)),
			MonospaceLineBreaksComputerFactory.create(this._configuration.options),
			(callback) => dom.scheduleAtNextAnimationFrame(dom.getWindow(this._domElement), callback),
			this.languageConfigurationService,
			this._themeService,
			attachedView,
			{
				batchChanges: (cb) => {
					try {
						this._beginUpdate();
						return cb();
					} finally {
						this._endUpdate();
					}
				},
			}
		);

		// Someone might destroy the model from under the editor, so prevent any exceptions by setting a null model
		listenersToRemove.push(model.onWillDispose(() => this.setModel(null)));

		listenersToRemove.push(viewModel.onEvent((e) => {
			switch (e.kind) {
				case OutgoingViewModelEventKind.ContentSizeChanged:
					this._onDidContentSizeChange.fire(e);
					break;
				case OutgoingViewModelEventKind.FocusChanged:
					this._editorTextFocus.setValue(e.hasFocus);
					break;
				case OutgoingViewModelEventKind.WidgetFocusChanged:
					this._editorWidgetFocus.setValue(e.hasFocus);
					break;
				case OutgoingViewModelEventKind.ScrollChanged:
					this._onDidScrollChange.fire(e);
					break;
				case OutgoingViewModelEventKind.ViewZonesChanged:
					this._onDidChangeViewZones.fire();
					break;
				case OutgoingViewModelEventKind.HiddenAreasChanged:
					this._onDidChangeHiddenAreas.fire();
					break;
				case OutgoingViewModelEventKind.ReadOnlyEditAttempt:
					this._onDidAttemptReadOnlyEdit.fire();
					break;
				case OutgoingViewModelEventKind.CursorStateChanged: {
					if (e.reachedMaxCursorCount) {

						const multiCursorLimit = this.getOption(EditorOption.multiCursorLimit);
						const message = nls.localize('cursors.maximum', "The number of cursors has been limited to {0}. Consider using [find and replace](https://code.visualstudio.com/docs/editor/codebasics#_find-and-replace) for larger changes or increase the editor multi cursor limit setting.", multiCursorLimit);
						this._notificationService.prompt(Severity.Warning, message, [
							{
								label: 'Find and Replace',
								run: () => {
									this._commandService.executeCommand('editor.action.startFindReplaceAction');
								}
							},
							{
								label: nls.localize('goToSetting', 'Increase Multi Cursor Limit'),
								run: () => {
									this._commandService.executeCommand('workbench.action.openSettings2', {
										query: 'editor.multiCursorLimit'
									});
								}
							}
						]);
					}

					const positions: Position[] = [];
					for (let i = 0, len = e.selections.length; i < len; i++) {
						positions[i] = e.selections[i].getPosition();
					}

					const e1: ICursorPositionChangedEvent = {
						position: positions[0],
						secondaryPositions: positions.slice(1),
						reason: e.reason,
						source: e.source
					};
					this._onDidChangeCursorPosition.fire(e1);

					const e2: ICursorSelectionChangedEvent = {
						selection: e.selections[0],
						secondarySelections: e.selections.slice(1),
						modelVersionId: e.modelVersionId,
						oldSelections: e.oldSelections,
						oldModelVersionId: e.oldModelVersionId,
						source: e.source,
						reason: e.reason
					};
					this._onDidChangeCursorSelection.fire(e2);

					break;
				}
				case OutgoingViewModelEventKind.ModelDecorationsChanged:
					this._onDidChangeModelDecorations.fire(e.event);
					break;
				case OutgoingViewModelEventKind.ModelLanguageChanged:
					this._domElement.setAttribute('data-mode-id', model.getLanguageId());
					this._onDidChangeModelLanguage.fire(e.event);
					break;
				case OutgoingViewModelEventKind.ModelLanguageConfigurationChanged:
					this._onDidChangeModelLanguageConfiguration.fire(e.event);
					break;
				case OutgoingViewModelEventKind.ModelContentChanged:
					this._onDidChangeModelContent.fire(e.event);
					break;
				case OutgoingViewModelEventKind.ModelOptionsChanged:
					this._onDidChangeModelOptions.fire(e.event);
					break;
				case OutgoingViewModelEventKind.ModelTokensChanged:
					this._onDidChangeModelTokens.fire(e.event);
					break;
				case OutgoingViewModelEventKind.ModelLineHeightChanged:
					this._onDidChangeLineHeight.fire(e.event);
					break;
				case OutgoingViewModelEventKind.ModelFontChangedEvent:
					this._onDidChangeFont.fire(e.event);
					break;
			}
		}));

		const [view, hasRealView] = this._createView(viewModel);
		if (hasRealView) {
			this._domElement.appendChild(view.domNode.domNode);

			let keys = Object.keys(this._contentWidgets);
			for (let i = 0, len = keys.length; i < len; i++) {
				const widgetId = keys[i];
				view.addContentWidget(this._contentWidgets[widgetId]);
			}

			keys = Object.keys(this._overlayWidgets);
			for (let i = 0, len = keys.length; i < len; i++) {
				const widgetId = keys[i];
				view.addOverlayWidget(this._overlayWidgets[widgetId]);
			}

			keys = Object.keys(this._glyphMarginWidgets);
			for (let i = 0, len = keys.length; i < len; i++) {
				const widgetId = keys[i];
				view.addGlyphMarginWidget(this._glyphMarginWidgets[widgetId]);
			}

			view.render(false, true);
			view.domNode.domNode.setAttribute('data-uri', model.uri.toString());
		}

		this._modelData = new ModelData(model, viewModel, view, hasRealView, listenersToRemove, attachedView);
	}

	protected _createView(viewModel: ViewModel): [View, boolean] {
		let commandDelegate: ICommandDelegate;
		if (this.isSimpleWidget) {
			commandDelegate = {
				paste: (text: string, pasteOnNewLine: boolean, multicursorText: string[] | null, mode: string | null) => {
					this._paste('keyboard', text, pasteOnNewLine, multicursorText, mode);
				},
				type: (text: string) => {
					this._type('keyboard', text);
				},
				compositionType: (text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number) => {
					this._compositionType('keyboard', text, replacePrevCharCnt, replaceNextCharCnt, positionDelta);
				},
				startComposition: () => {
					this._startComposition();
				},
				endComposition: () => {
					this._endComposition('keyboard');
				},
				cut: () => {
					this._cut('keyboard');
				}
			};
		} else {
			commandDelegate = {
				paste: (text: string, pasteOnNewLine: boolean, multicursorText: string[] | null, mode: string | null) => {
					const payload: editorBrowser.PastePayload = { text, pasteOnNewLine, multicursorText, mode };
					this._commandService.executeCommand(editorCommon.Handler.Paste, payload);
				},
				type: (text: string) => {
					const payload: editorCommon.TypePayload = { text };
					this._commandService.executeCommand(editorCommon.Handler.Type, payload);
				},
				compositionType: (text: string, replacePrevCharCnt: number, replaceNextCharCnt: number, positionDelta: number) => {
					// Try if possible to go through the existing `replacePreviousChar` command
					if (replaceNextCharCnt || positionDelta) {
						// must be handled through the new command
						const payload: editorCommon.CompositionTypePayload = { text, replacePrevCharCnt, replaceNextCharCnt, positionDelta };
						this._commandService.executeCommand(editorCommon.Handler.CompositionType, payload);
					} else {
						const payload: editorCommon.ReplacePreviousCharPayload = { text, replaceCharCnt: replacePrevCharCnt };
						this._commandService.executeCommand(editorCommon.Handler.ReplacePreviousChar, payload);
					}
				},
				startComposition: () => {
					this._commandService.executeCommand(editorCommon.Handler.CompositionStart, {});
				},
				endComposition: () => {
					this._commandService.executeCommand(editorCommon.Handler.CompositionEnd, {});
				},
				cut: () => {
					this._commandService.executeCommand(editorCommon.Handler.Cut, {});
				}
			};
		}

		const viewUserInputEvents = new ViewUserInputEvents(viewModel.coordinatesConverter);
		viewUserInputEvents.onKeyDown = (e) => this._onKeyDown.fire(e);
		viewUserInputEvents.onKeyUp = (e) => this._onKeyUp.fire(e);
		viewUserInputEvents.onContextMenu = (e) => this._onContextMenu.fire(e);
		viewUserInputEvents.onMouseMove = (e) => this._onMouseMove.fire(e);
		viewUserInputEvents.onMouseLeave = (e) => this._onMouseLeave.fire(e);
		viewUserInputEvents.onMouseDown = (e) => this._onMouseDown.fire(e);
		viewUserInputEvents.onMouseUp = (e) => this._onMouseUp.fire(e);
		viewUserInputEvents.onMouseDrag = (e) => this._onMouseDrag.fire(e);
		viewUserInputEvents.onMouseDrop = (e) => this._onMouseDrop.fire(e);
		viewUserInputEvents.onMouseDropCanceled = (e) => this._onMouseDropCanceled.fire(e);
		viewUserInputEvents.onMouseWheel = (e) => this._onMouseWheel.fire(e);

		const view = new View(
			this._domElement,
			this.getId(),
			commandDelegate,
			this._configuration,
			this._themeService.getColorTheme(),
			viewModel,
			viewUserInputEvents,
			this._overflowWidgetsDomNode,
			this._instantiationService
		);

		return [view, true];
	}

	protected _postDetachModelCleanup(detachedModel: ITextModel | null): void {
		detachedModel?.removeAllDecorationsWithOwnerId(this._id);
	}

	private _detachModel(): ITextModel | null {
		this._contributionsDisposable?.dispose();
		this._contributionsDisposable = undefined;
		if (!this._modelData) {
			return null;
		}
		const model = this._modelData.model;
		const removeDomNode = this._modelData.hasRealView ? this._modelData.view.domNode.domNode : null;

		this._modelData.dispose();
		this._modelData = null;

		this._domElement.removeAttribute('data-mode-id');
		if (removeDomNode && this._domElement.contains(removeDomNode)) {
			removeDomNode.remove();
		}
		if (this._bannerDomNode && this._domElement.contains(this._bannerDomNode)) {
			this._bannerDomNode.remove();
		}
		return model;
	}

	private _registerDecorationType(description: string, key: string, options: editorCommon.IDecorationRenderOptions, parentTypeKey?: string): void {
		this._codeEditorService.registerDecorationType(description, key, options, parentTypeKey, this);
	}

	private _removeDecorationType(key: string): void {
		this._codeEditorService.removeDecorationType(key);
	}

	private _resolveDecorationOptions(typeKey: string, writable: boolean): IModelDecorationOptions {
		return this._codeEditorService.resolveDecorationOptions(typeKey, writable);
	}

	public getTelemetryData(): object | undefined {
		return this._telemetryData;
	}

	public hasModel(): this is editorBrowser.IActiveCodeEditor {
		return (this._modelData !== null);
	}

	private showDropIndicatorAt(position: Position): void {
		const newDecorations: IModelDeltaDecoration[] = [{
			range: new Range(position.lineNumber, position.column, position.lineNumber, position.column),
			options: CodeEditorWidget.dropIntoEditorDecorationOptions
		}];

		this._dropIntoEditorDecorations.set(newDecorations);
		this.revealPosition(position, editorCommon.ScrollType.Immediate);
	}

	private removeDropIndicator(): void {
		this._dropIntoEditorDecorations.clear();
	}

	public setContextValue(key: string, value: ContextKeyValue): void {
		this._contextKeyService.createKey(key, value);
	}

	private _beginUpdate(): void {
		this._updateCounter++;
		if (this._updateCounter === 1) {
			this._onBeginUpdate.fire();
		}
	}

	private _endUpdate(): void {
		this._updateCounter--;
		if (this._updateCounter === 0) {
			this._onEndUpdate.fire();
		}
	}
}

let EDITOR_ID = 0;

export interface ICodeEditorWidgetOptions {
	/**
	 * Is this a simple widget (not a real code editor)?
	 * Defaults to false.
	 */
	isSimpleWidget?: boolean;

	/**
	 * Contributions to instantiate.
	 * When provided, only the contributions included will be instantiated.
	 * To include the defaults, those must be provided as well via [...EditorExtensionsRegistry.getEditorContributions()]
	 * Defaults to EditorExtensionsRegistry.getEditorContributions().
	 */
	contributions?: IEditorContributionDescription[];

	/**
	 * Telemetry data associated with this CodeEditorWidget.
	 * Defaults to null.
	 */
	telemetryData?: object;

	/**
	 * The ID of the context menu.
	 * Defaults to MenuId.SimpleEditorContext or MenuId.EditorContext depending on whether the widget is simple.
	 */
	contextMenuId?: MenuId;

	/**
	 * Define extra context keys that will be defined in the context service
	 * for the editor.
	 */
	contextKeyValues?: Record<string, ContextKeyValue>;
}

class ModelData {
	constructor(
		public readonly model: ITextModel,
		public readonly viewModel: ViewModel,
		public readonly view: View,
		public readonly hasRealView: boolean,
		public readonly listenersToRemove: IDisposable[],
		public readonly attachedView: IAttachedView,
	) {
	}

	public dispose(): void {
		dispose(this.listenersToRemove);
		this.model.onBeforeDetached(this.attachedView);
		if (this.hasRealView) {
			this.view.dispose();
		}
		this.viewModel.dispose();
	}
}

const enum BooleanEventValue {
	NotSet,
	False,
	True
}

export class BooleanEventEmitter extends Disposable {
	private readonly _onDidChangeToTrue: Emitter<void>;
	public readonly onDidChangeToTrue: Event<void>;

	private readonly _onDidChangeToFalse: Emitter<void>;
	public readonly onDidChangeToFalse: Event<void>;

	private _value: BooleanEventValue;

	constructor(
		private readonly _emitterOptions: EmitterOptions
	) {
		super();
		this._onDidChangeToTrue = this._register(new Emitter<void>(this._emitterOptions));
		this.onDidChangeToTrue = this._onDidChangeToTrue.event;
		this._onDidChangeToFalse = this._register(new Emitter<void>(this._emitterOptions));
		this.onDidChangeToFalse = this._onDidChangeToFalse.event;
		this._value = BooleanEventValue.NotSet;
	}

	public setValue(_value: boolean) {
		const value = (_value ? BooleanEventValue.True : BooleanEventValue.False);
		if (this._value === value) {
			return;
		}
		this._value = value;
		if (this._value === BooleanEventValue.True) {
			this._onDidChangeToTrue.fire();
		} else if (this._value === BooleanEventValue.False) {
			this._onDidChangeToFalse.fire();
		}
	}
}

/**
 * A regular event emitter that also makes sure contributions are instantiated if necessary
 */
class InteractionEmitter<T> extends Emitter<T> {

	constructor(
		private readonly _contributions: CodeEditorContributions,
		deliveryQueue: EventDeliveryQueue
	) {
		super({ deliveryQueue });
	}

	override fire(event: T): void {
		this._contributions.onBeforeInteractionEvent();
		super.fire(event);
	}
}

class EditorContextKeysManager extends Disposable {

	private readonly _editor: CodeEditorWidget;
	private readonly _editorSimpleInput: IContextKey<boolean>;
	private readonly _editorFocus: IContextKey<boolean>;
	private readonly _textInputFocus: IContextKey<boolean>;
	private readonly _editorTextFocus: IContextKey<boolean>;
	private readonly _tabMovesFocus: IContextKey<boolean>;
	private readonly _editorReadonly: IContextKey<boolean>;
	private readonly _inDiffEditor: IContextKey<boolean>;
	private readonly _editorColumnSelection: IContextKey<boolean>;
	private readonly _hasMultipleSelections: IContextKey<boolean>;
	private readonly _hasNonEmptySelection: IContextKey<boolean>;
	private readonly _canUndo: IContextKey<boolean>;
	private readonly _canRedo: IContextKey<boolean>;

	constructor(
		editor: CodeEditorWidget,
		contextKeyService: IContextKeyService
	) {
		super();

		this._editor = editor;

		contextKeyService.createKey('editorId', editor.getId());

		this._editorSimpleInput = EditorContextKeys.editorSimpleInput.bindTo(contextKeyService);
		this._editorFocus = EditorContextKeys.focus.bindTo(contextKeyService);
		this._textInputFocus = EditorContextKeys.textInputFocus.bindTo(contextKeyService);
		this._editorTextFocus = EditorContextKeys.editorTextFocus.bindTo(contextKeyService);
		this._tabMovesFocus = EditorContextKeys.tabMovesFocus.bindTo(contextKeyService);
		this._editorReadonly = EditorContextKeys.readOnly.bindTo(contextKeyService);
		this._inDiffEditor = EditorContextKeys.inDiffEditor.bindTo(contextKeyService);
		this._editorColumnSelection = EditorContextKeys.columnSelection.bindTo(contextKeyService);
		this._hasMultipleSelections = EditorContextKeys.hasMultipleSelections.bindTo(contextKeyService);
		this._hasNonEmptySelection = EditorContextKeys.hasNonEmptySelection.bindTo(contextKeyService);
		this._canUndo = EditorContextKeys.canUndo.bindTo(contextKeyService);
		this._canRedo = EditorContextKeys.canRedo.bindTo(contextKeyService);

		this._register(this._editor.onDidChangeConfiguration(() => this._updateFromConfig()));
		this._register(this._editor.onDidChangeCursorSelection(() => this._updateFromSelection()));
		this._register(this._editor.onDidFocusEditorWidget(() => this._updateFromFocus()));
		this._register(this._editor.onDidBlurEditorWidget(() => this._updateFromFocus()));
		this._register(this._editor.onDidFocusEditorText(() => this._updateFromFocus()));
		this._register(this._editor.onDidBlurEditorText(() => this._updateFromFocus()));
		this._register(this._editor.onDidChangeModel(() => this._updateFromModel()));
		this._register(this._editor.onDidChangeConfiguration(() => this._updateFromModel()));
		this._register(TabFocus.onDidChangeTabFocus((tabFocusMode: boolean) => this._tabMovesFocus.set(tabFocusMode)));

		this._updateFromConfig();
		this._updateFromSelection();
		this._updateFromFocus();
		this._updateFromModel();

		this._editorSimpleInput.set(this._editor.isSimpleWidget);
	}

	private _updateFromConfig(): void {
		const options = this._editor.getOptions();

		this._tabMovesFocus.set(options.get(EditorOption.tabFocusMode) || TabFocus.getTabFocusMode());
		this._editorReadonly.set(options.get(EditorOption.readOnly));
		this._inDiffEditor.set(options.get(EditorOption.inDiffEditor));
		this._editorColumnSelection.set(options.get(EditorOption.columnSelection));
	}

	private _updateFromSelection(): void {
		const selections = this._editor.getSelections();
		if (!selections) {
			this._hasMultipleSelections.reset();
			this._hasNonEmptySelection.reset();
		} else {
			this._hasMultipleSelections.set(selections.length > 1);
			this._hasNonEmptySelection.set(selections.some(s => !s.isEmpty()));
		}
	}

	private _updateFromFocus(): void {
		this._editorFocus.set(this._editor.hasWidgetFocus() && !this._editor.isSimpleWidget);
		this._editorTextFocus.set(this._editor.hasTextFocus() && !this._editor.isSimpleWidget);
		this._textInputFocus.set(this._editor.hasTextFocus());
	}

	private _updateFromModel(): void {
		const model = this._editor.getModel();
		this._canUndo.set(Boolean(model && model.canUndo()));
		this._canRedo.set(Boolean(model && model.canRedo()));
	}
}

export class EditorModeContext extends Disposable {

	private readonly _langId: IContextKey<string>;
	private readonly _hasCompletionItemProvider: IContextKey<boolean>;
	private readonly _hasCodeActionsProvider: IContextKey<boolean>;
	private readonly _hasCodeLensProvider: IContextKey<boolean>;
	private readonly _hasDefinitionProvider: IContextKey<boolean>;
	private readonly _hasDeclarationProvider: IContextKey<boolean>;
	private readonly _hasImplementationProvider: IContextKey<boolean>;
	private readonly _hasTypeDefinitionProvider: IContextKey<boolean>;
	private readonly _hasHoverProvider: IContextKey<boolean>;
	private readonly _hasDocumentHighlightProvider: IContextKey<boolean>;
	private readonly _hasDocumentSymbolProvider: IContextKey<boolean>;
	private readonly _hasReferenceProvider: IContextKey<boolean>;
	private readonly _hasRenameProvider: IContextKey<boolean>;
	private readonly _hasDocumentFormattingProvider: IContextKey<boolean>;
	private readonly _hasDocumentSelectionFormattingProvider: IContextKey<boolean>;
	private readonly _hasMultipleDocumentFormattingProvider: IContextKey<boolean>;
	private readonly _hasMultipleDocumentSelectionFormattingProvider: IContextKey<boolean>;
	private readonly _hasSignatureHelpProvider: IContextKey<boolean>;
	private readonly _hasInlayHintsProvider: IContextKey<boolean>;
	private readonly _isInEmbeddedEditor: IContextKey<boolean>;

	constructor(
		private readonly _editor: CodeEditorWidget,
		private readonly _contextKeyService: IContextKeyService,
		private readonly _languageFeaturesService: ILanguageFeaturesService,
	) {
		super();

		this._langId = EditorContextKeys.languageId.bindTo(_contextKeyService);
		this._hasCompletionItemProvider = EditorContextKeys.hasCompletionItemProvider.bindTo(_contextKeyService);
		this._hasCodeActionsProvider = EditorContextKeys.hasCodeActionsProvider.bindTo(_contextKeyService);
		this._hasCodeLensProvider = EditorContextKeys.hasCodeLensProvider.bindTo(_contextKeyService);
		this._hasDefinitionProvider = EditorContextKeys.hasDefinitionProvider.bindTo(_contextKeyService);
		this._hasDeclarationProvider = EditorContextKeys.hasDeclarationProvider.bindTo(_contextKeyService);
		this._hasImplementationProvider = EditorContextKeys.hasImplementationProvider.bindTo(_contextKeyService);
		this._hasTypeDefinitionProvider = EditorContextKeys.hasTypeDefinitionProvider.bindTo(_contextKeyService);
		this._hasHoverProvider = EditorContextKeys.hasHoverProvider.bindTo(_contextKeyService);
		this._hasDocumentHighlightProvider = EditorContextKeys.hasDocumentHighlightProvider.bindTo(_contextKeyService);
		this._hasDocumentSymbolProvider = EditorContextKeys.hasDocumentSymbolProvider.bindTo(_contextKeyService);
		this._hasReferenceProvider = EditorContextKeys.hasReferenceProvider.bindTo(_contextKeyService);
		this._hasRenameProvider = EditorContextKeys.hasRenameProvider.bindTo(_contextKeyService);
		this._hasSignatureHelpProvider = EditorContextKeys.hasSignatureHelpProvider.bindTo(_contextKeyService);
		this._hasInlayHintsProvider = EditorContextKeys.hasInlayHintsProvider.bindTo(_contextKeyService);
		this._hasDocumentFormattingProvider = EditorContextKeys.hasDocumentFormattingProvider.bindTo(_contextKeyService);
		this._hasDocumentSelectionFormattingProvider = EditorContextKeys.hasDocumentSelectionFormattingProvider.bindTo(_contextKeyService);
		this._hasMultipleDocumentFormattingProvider = EditorContextKeys.hasMultipleDocumentFormattingProvider.bindTo(_contextKeyService);
		this._hasMultipleDocumentSelectionFormattingProvider = EditorContextKeys.hasMultipleDocumentSelectionFormattingProvider.bindTo(_contextKeyService);
		this._isInEmbeddedEditor = EditorContextKeys.isInEmbeddedEditor.bindTo(_contextKeyService);

		const update = () => this._update();

		// update when model/mode changes
		this._register(_editor.onDidChangeModel(update));
		this._register(_editor.onDidChangeModelLanguage(update));

		// update when registries change
		this._register(_languageFeaturesService.completionProvider.onDidChange(update));
		this._register(_languageFeaturesService.codeActionProvider.onDidChange(update));
		this._register(_languageFeaturesService.codeLensProvider.onDidChange(update));
		this._register(_languageFeaturesService.definitionProvider.onDidChange(update));
		this._register(_languageFeaturesService.declarationProvider.onDidChange(update));
		this._register(_languageFeaturesService.implementationProvider.onDidChange(update));
		this._register(_languageFeaturesService.typeDefinitionProvider.onDidChange(update));
		this._register(_languageFeaturesService.hoverProvider.onDidChange(update));
		this._register(_languageFeaturesService.documentHighlightProvider.onDidChange(update));
		this._register(_languageFeaturesService.documentSymbolProvider.onDidChange(update));
		this._register(_languageFeaturesService.referenceProvider.onDidChange(update));
		this._register(_languageFeaturesService.renameProvider.onDidChange(update));
		this._register(_languageFeaturesService.documentFormattingEditProvider.onDidChange(update));
		this._register(_languageFeaturesService.documentRangeFormattingEditProvider.onDidChange(update));
		this._register(_languageFeaturesService.signatureHelpProvider.onDidChange(update));
		this._register(_languageFeaturesService.inlayHintsProvider.onDidChange(update));

		update();
	}

	override dispose() {
		super.dispose();
	}

	reset() {
		this._contextKeyService.bufferChangeEvents(() => {
			this._langId.reset();
			this._hasCompletionItemProvider.reset();
			this._hasCodeActionsProvider.reset();
			this._hasCodeLensProvider.reset();
			this._hasDefinitionProvider.reset();
			this._hasDeclarationProvider.reset();
			this._hasImplementationProvider.reset();
			this._hasTypeDefinitionProvider.reset();
			this._hasHoverProvider.reset();
			this._hasDocumentHighlightProvider.reset();
			this._hasDocumentSymbolProvider.reset();
			this._hasReferenceProvider.reset();
			this._hasRenameProvider.reset();
			this._hasDocumentFormattingProvider.reset();
			this._hasDocumentSelectionFormattingProvider.reset();
			this._hasSignatureHelpProvider.reset();
			this._isInEmbeddedEditor.reset();
		});
	}

	private _update() {
		const model = this._editor.getModel();
		if (!model) {
			this.reset();
			return;
		}
		this._contextKeyService.bufferChangeEvents(() => {
			this._langId.set(model.getLanguageId());
			this._hasCompletionItemProvider.set(this._languageFeaturesService.completionProvider.has(model));
			this._hasCodeActionsProvider.set(this._languageFeaturesService.codeActionProvider.has(model));
			this._hasCodeLensProvider.set(this._languageFeaturesService.codeLensProvider.has(model));
			this._hasDefinitionProvider.set(this._languageFeaturesService.definitionProvider.has(model));
			this._hasDeclarationProvider.set(this._languageFeaturesService.declarationProvider.has(model));
			this._hasImplementationProvider.set(this._languageFeaturesService.implementationProvider.has(model));
			this._hasTypeDefinitionProvider.set(this._languageFeaturesService.typeDefinitionProvider.has(model));
			this._hasHoverProvider.set(this._languageFeaturesService.hoverProvider.has(model));
			this._hasDocumentHighlightProvider.set(this._languageFeaturesService.documentHighlightProvider.has(model));
			this._hasDocumentSymbolProvider.set(this._languageFeaturesService.documentSymbolProvider.has(model));
			this._hasReferenceProvider.set(this._languageFeaturesService.referenceProvider.has(model));
			this._hasRenameProvider.set(this._languageFeaturesService.renameProvider.has(model));
			this._hasSignatureHelpProvider.set(this._languageFeaturesService.signatureHelpProvider.has(model));
			this._hasInlayHintsProvider.set(this._languageFeaturesService.inlayHintsProvider.has(model));
			this._hasDocumentFormattingProvider.set(this._languageFeaturesService.documentFormattingEditProvider.has(model) || this._languageFeaturesService.documentRangeFormattingEditProvider.has(model));
			this._hasDocumentSelectionFormattingProvider.set(this._languageFeaturesService.documentRangeFormattingEditProvider.has(model));
			this._hasMultipleDocumentFormattingProvider.set(this._languageFeaturesService.documentFormattingEditProvider.all(model).length + this._languageFeaturesService.documentRangeFormattingEditProvider.all(model).length > 1);
			this._hasMultipleDocumentSelectionFormattingProvider.set(this._languageFeaturesService.documentRangeFormattingEditProvider.all(model).length > 1);
			this._isInEmbeddedEditor.set(model.uri.scheme === Schemas.walkThroughSnippet || model.uri.scheme === Schemas.vscodeChatCodeBlock);
		});
	}
}


class EditorDecorationsCollection implements editorCommon.IEditorDecorationsCollection {

	private _decorationIds: string[] = [];
	private _isChangingDecorations: boolean = false;

	public get length(): number {
		return this._decorationIds.length;
	}

	constructor(
		private readonly _editor: editorBrowser.ICodeEditor,
		decorations: IModelDeltaDecoration[] | undefined
	) {
		if (Array.isArray(decorations) && decorations.length > 0) {
			this.set(decorations);
		}
	}

	public onDidChange(listener: (e: IModelDecorationsChangedEvent) => unknown, thisArgs?: unknown, disposables?: IDisposable[] | DisposableStore): IDisposable {
		return this._editor.onDidChangeModelDecorations((e) => {
			if (this._isChangingDecorations) {
				return;
			}
			listener.call(thisArgs, e);
		}, disposables);
	}

	public getRange(index: number): Range | null {
		if (!this._editor.hasModel()) {
			return null;
		}
		if (index >= this._decorationIds.length) {
			return null;
		}
		return this._editor.getModel().getDecorationRange(this._decorationIds[index]);
	}

	public getRanges(): Range[] {
		if (!this._editor.hasModel()) {
			return [];
		}
		const model = this._editor.getModel();
		const result: Range[] = [];
		for (const decorationId of this._decorationIds) {
			const range = model.getDecorationRange(decorationId);
			if (range) {
				result.push(range);
			}
		}
		return result;
	}

	public has(decoration: IModelDecoration): boolean {
		return this._decorationIds.includes(decoration.id);
	}

	public clear(): void {
		if (this._decorationIds.length === 0) {
			// nothing to do
			return;
		}
		this.set([]);
	}

	public set(newDecorations: readonly IModelDeltaDecoration[]): string[] {
		try {
			this._isChangingDecorations = true;
			this._editor.changeDecorations((accessor) => {
				this._decorationIds = accessor.deltaDecorations(this._decorationIds, newDecorations);
			});
		} finally {
			this._isChangingDecorations = false;
		}
		return this._decorationIds;
	}

	public append(newDecorations: readonly IModelDeltaDecoration[]): string[] {
		let newDecorationIds: string[] = [];
		try {
			this._isChangingDecorations = true;
			this._editor.changeDecorations((accessor) => {
				newDecorationIds = accessor.deltaDecorations([], newDecorations);
				this._decorationIds = this._decorationIds.concat(newDecorationIds);
			});
		} finally {
			this._isChangingDecorations = false;
		}
		return newDecorationIds;
	}
}

const squigglyStart = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 3' enable-background='new 0 0 6 3' height='3' width='6'><g fill='`);
const squigglyEnd = encodeURIComponent(`'><polygon points='5.5,0 2.5,3 1.1,3 4.1,0'/><polygon points='4,0 6,2 6,0.6 5.4,0'/><polygon points='0,2 1,3 2.4,3 0,0.6'/></g></svg>`);

function getSquigglySVGData(color: Color) {
	return squigglyStart + encodeURIComponent(color.toString()) + squigglyEnd;
}

const dotdotdotStart = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" height="3" width="12"><g fill="`);
const dotdotdotEnd = encodeURIComponent(`"><circle cx="1" cy="1" r="1"/><circle cx="5" cy="1" r="1"/><circle cx="9" cy="1" r="1"/></g></svg>`);

function getDotDotDotSVGData(color: Color) {
	return dotdotdotStart + encodeURIComponent(color.toString()) + dotdotdotEnd;
}

registerThemingParticipant((theme, collector) => {
	const errorForeground = theme.getColor(editorErrorForeground);
	if (errorForeground) {
		collector.addRule(`.monaco-editor .${ClassName.EditorErrorDecoration} { background: url("data:image/svg+xml,${getSquigglySVGData(errorForeground)}") repeat-x bottom left; }`);
		collector.addRule(`:root { --monaco-editor-error-decoration: url("data:image/svg+xml,${getSquigglySVGData(errorForeground)}"); }`);
	}
	const warningForeground = theme.getColor(editorWarningForeground);
	if (warningForeground) {
		collector.addRule(`.monaco-editor .${ClassName.EditorWarningDecoration} { background: url("data:image/svg+xml,${getSquigglySVGData(warningForeground)}") repeat-x bottom left; }`);
		collector.addRule(`:root { --monaco-editor-warning-decoration: url("data:image/svg+xml,${getSquigglySVGData(warningForeground)}"); }`);
	}
	const infoForeground = theme.getColor(editorInfoForeground);
	if (infoForeground) {
		collector.addRule(`.monaco-editor .${ClassName.EditorInfoDecoration} { background: url("data:image/svg+xml,${getSquigglySVGData(infoForeground)}") repeat-x bottom left; }`);
		collector.addRule(`:root { --monaco-editor-info-decoration: url("data:image/svg+xml,${getSquigglySVGData(infoForeground)}"); }`);
	}
	const hintForeground = theme.getColor(editorHintForeground);
	if (hintForeground) {
		collector.addRule(`.monaco-editor .${ClassName.EditorHintDecoration} { background: url("data:image/svg+xml,${getDotDotDotSVGData(hintForeground)}") no-repeat bottom left; }`);
		collector.addRule(`:root { --monaco-editor-hint-decoration: url("data:image/svg+xml,${getDotDotDotSVGData(hintForeground)}"); }`);
	}
	const unnecessaryForeground = theme.getColor(editorUnnecessaryCodeOpacity);
	if (unnecessaryForeground) {
		collector.addRule(`.monaco-editor.showUnused .${ClassName.EditorUnnecessaryInlineDecoration} { opacity: ${unnecessaryForeground.rgba.a}; }`);
		collector.addRule(`:root { --monaco-editor-unnecessary-decoration-opacity: ${unnecessaryForeground.rgba.a}; }`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/codeEditor/editor.css]---
Location: vscode-main/src/vs/editor/browser/widget/codeEditor/editor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* -------------------- IE10 remove auto clear button -------------------- */

::-ms-clear {
	display: none;
}

/* All widgets */
/* I am not a big fan of this rule */
.monaco-editor .editor-widget input {
	color: inherit;
}

/* -------------------- Editor -------------------- */

.monaco-editor {
	position: relative;
	overflow: visible;
	-webkit-text-size-adjust: 100%;
	color: var(--vscode-editor-foreground);
	background-color: var(--vscode-editor-background);
	overflow-wrap: initial;
}
.monaco-editor-background {
	background-color: var(--vscode-editor-background);
}
.monaco-editor .rangeHighlight {
	background-color: var(--vscode-editor-rangeHighlightBackground);
	box-sizing: border-box;
	border: 1px solid var(--vscode-editor-rangeHighlightBorder);
}
.monaco-editor.hc-black .rangeHighlight, .monaco-editor.hc-light .rangeHighlight {
	border-style: dotted;
}
.monaco-editor .symbolHighlight {
	background-color: var(--vscode-editor-symbolHighlightBackground);
	box-sizing: border-box;
	border: 1px solid var(--vscode-editor-symbolHighlightBorder);
}
.monaco-editor.hc-black .symbolHighlight, .monaco-editor.hc-light .symbolHighlight {
	border-style: dotted;
}

.monaco-editor .editorCanvas {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 0;
	pointer-events: none;
}

/* -------------------- Misc -------------------- */

.monaco-editor .overflow-guard {
	position: relative;
	overflow: hidden;
}

.monaco-editor .view-overlays {
	position: absolute;
	top: 0;
}

.monaco-editor .view-overlays > div, .monaco-editor .margin-view-overlays > div {
	position: absolute;
	width: 100%;
}

/*
.monaco-editor .auto-closed-character {
	opacity: 0.3;
}
*/


.monaco-editor .squiggly-error {
	border-bottom: 4px double var(--vscode-editorError-border);
}
.monaco-editor .squiggly-error::before {
	display: block;
	content: '';
	width: 100%;
	height: 100%;
	background: var(--vscode-editorError-background);
}
.monaco-editor .squiggly-warning {
	border-bottom: 4px double var(--vscode-editorWarning-border);
}
.monaco-editor .squiggly-warning::before {
	display: block;
	content: '';
	width: 100%;
	height: 100%;
	background: var(--vscode-editorWarning-background);
}
.monaco-editor .squiggly-info {
	border-bottom: 4px double var(--vscode-editorInfo-border);
}
.monaco-editor .squiggly-info::before {
	display: block;
	content: '';
	width: 100%;
	height: 100%;
	background: var(--vscode-editorInfo-background);
}
.monaco-editor .squiggly-hint {
	border-bottom: 2px dotted var(--vscode-editorHint-border);
}
.monaco-editor.showUnused .squiggly-unnecessary {
	border-bottom: 2px dashed var(--vscode-editorUnnecessaryCode-border);
}
.monaco-editor.showDeprecated .squiggly-inline-deprecated {
	text-decoration: line-through;
	text-decoration-color: var(--vscode-editor-foreground, inherit);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/codeEditor/embeddedCodeEditorWidget.ts]---
Location: vscode-main/src/vs/editor/browser/widget/codeEditor/embeddedCodeEditorWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as objects from '../../../../base/common/objects.js';
import { ICodeEditor } from '../../editorBrowser.js';
import { ICodeEditorService } from '../../services/codeEditorService.js';
import { CodeEditorWidget, ICodeEditorWidgetOptions } from './codeEditorWidget.js';
import { ConfigurationChangedEvent, IEditorOptions } from '../../../common/config/editorOptions.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';

export class EmbeddedCodeEditorWidget extends CodeEditorWidget {
	private readonly _parentEditor: ICodeEditor;
	private readonly _overwriteOptions: IEditorOptions;

	constructor(
		domElement: HTMLElement,
		options: IEditorOptions,
		codeEditorWidgetOptions: ICodeEditorWidgetOptions,
		parentEditor: ICodeEditor,
		@IInstantiationService instantiationService: IInstantiationService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@ICommandService commandService: ICommandService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IThemeService themeService: IThemeService,
		@INotificationService notificationService: INotificationService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
		@ILanguageConfigurationService languageConfigurationService: ILanguageConfigurationService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService
	) {
		super(domElement, { ...parentEditor.getRawOptions(), overflowWidgetsDomNode: parentEditor.getOverflowWidgetsDomNode() }, codeEditorWidgetOptions, instantiationService, codeEditorService, commandService, contextKeyService, themeService, notificationService, accessibilityService, languageConfigurationService, languageFeaturesService);

		this._parentEditor = parentEditor;
		this._overwriteOptions = options;

		// Overwrite parent's options
		super.updateOptions(this._overwriteOptions);

		this._register(parentEditor.onDidChangeConfiguration((e: ConfigurationChangedEvent) => this._onParentConfigurationChanged(e)));
	}

	getParentEditor(): ICodeEditor {
		return this._parentEditor;
	}

	private _onParentConfigurationChanged(e: ConfigurationChangedEvent): void {
		super.updateOptions(this._parentEditor.getRawOptions());
		super.updateOptions(this._overwriteOptions);
	}

	override updateOptions(newOptions: IEditorOptions): void {
		objects.mixin(this._overwriteOptions, newOptions, true);
		super.updateOptions(this._overwriteOptions);
	}
}

export function getOuterEditor(accessor: ServicesAccessor): ICodeEditor | null {
	const editor = accessor.get(ICodeEditorService).getFocusedCodeEditor();
	if (editor instanceof EmbeddedCodeEditorWidget) {
		return editor.getParentEditor();
	}
	return editor;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/commands.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/commands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getActiveElement } from '../../../../base/browser/dom.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { ICodeEditor, IDiffEditor } from '../../editorBrowser.js';
import { EditorAction2, ServicesAccessor } from '../../editorExtensions.js';
import { ICodeEditorService } from '../../services/codeEditorService.js';
import { DiffEditorWidget } from './diffEditorWidget.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { localize2 } from '../../../../nls.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import './registrations.contribution.js';
import { DiffEditorSelectionHunkToolbarContext } from './features/gutterFeature.js';
import { URI } from '../../../../base/common/uri.js';
import { EditorOption } from '../../../common/config/editorOptions.js';

export class ToggleCollapseUnchangedRegions extends Action2 {
	constructor() {
		super({
			id: 'diffEditor.toggleCollapseUnchangedRegions',
			title: localize2('toggleCollapseUnchangedRegions', 'Toggle Collapse Unchanged Regions'),
			icon: Codicon.map,
			toggled: ContextKeyExpr.has('config.diffEditor.hideUnchangedRegions.enabled'),
			precondition: ContextKeyExpr.has('isInDiffEditor'),
			menu: {
				when: ContextKeyExpr.has('isInDiffEditor'),
				id: MenuId.EditorTitle,
				order: 22,
				group: 'navigation',
			},
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const configurationService = accessor.get(IConfigurationService);
		const newValue = !configurationService.getValue<boolean>('diffEditor.hideUnchangedRegions.enabled');
		configurationService.updateValue('diffEditor.hideUnchangedRegions.enabled', newValue);
	}
}

export class ToggleShowMovedCodeBlocks extends Action2 {
	constructor() {
		super({
			id: 'diffEditor.toggleShowMovedCodeBlocks',
			title: localize2('toggleShowMovedCodeBlocks', 'Toggle Show Moved Code Blocks'),
			precondition: ContextKeyExpr.has('isInDiffEditor'),
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const configurationService = accessor.get(IConfigurationService);
		const newValue = !configurationService.getValue<boolean>('diffEditor.experimental.showMoves');
		configurationService.updateValue('diffEditor.experimental.showMoves', newValue);
	}
}

export class ToggleUseInlineViewWhenSpaceIsLimited extends Action2 {
	constructor() {
		super({
			id: 'diffEditor.toggleUseInlineViewWhenSpaceIsLimited',
			title: localize2('toggleUseInlineViewWhenSpaceIsLimited', 'Toggle Use Inline View When Space Is Limited'),
			precondition: ContextKeyExpr.has('isInDiffEditor'),
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		const configurationService = accessor.get(IConfigurationService);
		const newValue = !configurationService.getValue<boolean>('diffEditor.useInlineViewWhenSpaceIsLimited');
		configurationService.updateValue('diffEditor.useInlineViewWhenSpaceIsLimited', newValue);
	}
}

const diffEditorCategory: ILocalizedString = localize2('diffEditor', "Diff Editor");

export class SwitchSide extends EditorAction2 {
	constructor() {
		super({
			id: 'diffEditor.switchSide',
			title: localize2('switchSide', 'Switch Side'),
			icon: Codicon.arrowSwap,
			precondition: ContextKeyExpr.has('isInDiffEditor'),
			f1: true,
			category: diffEditorCategory,
		});
	}

	runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, arg?: { dryRun: boolean }): unknown {
		const diffEditor = findFocusedDiffEditor(accessor);
		if (diffEditor instanceof DiffEditorWidget) {
			if (arg && arg.dryRun) {
				return { destinationSelection: diffEditor.mapToOtherSide().destinationSelection };
			} else {
				diffEditor.switchSide();
			}
		}
		return undefined;
	}
}
export class ExitCompareMove extends EditorAction2 {
	constructor() {
		super({
			id: 'diffEditor.exitCompareMove',
			title: localize2('exitCompareMove', 'Exit Compare Move'),
			icon: Codicon.close,
			precondition: EditorContextKeys.comparingMovedCode,
			f1: false,
			category: diffEditorCategory,
			keybinding: {
				weight: 10000,
				primary: KeyCode.Escape,
			}
		});
	}

	runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, ...args: unknown[]): void {
		const diffEditor = findFocusedDiffEditor(accessor);
		if (diffEditor instanceof DiffEditorWidget) {
			diffEditor.exitCompareMove();
		}
	}
}

export class CollapseAllUnchangedRegions extends EditorAction2 {
	constructor() {
		super({
			id: 'diffEditor.collapseAllUnchangedRegions',
			title: localize2('collapseAllUnchangedRegions', 'Collapse All Unchanged Regions'),
			icon: Codicon.fold,
			precondition: ContextKeyExpr.has('isInDiffEditor'),
			f1: true,
			category: diffEditorCategory,
		});
	}

	runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, ...args: unknown[]): void {
		const diffEditor = findFocusedDiffEditor(accessor);
		if (diffEditor instanceof DiffEditorWidget) {
			diffEditor.collapseAllUnchangedRegions();
		}
	}
}

export class ShowAllUnchangedRegions extends EditorAction2 {
	constructor() {
		super({
			id: 'diffEditor.showAllUnchangedRegions',
			title: localize2('showAllUnchangedRegions', 'Show All Unchanged Regions'),
			icon: Codicon.unfold,
			precondition: ContextKeyExpr.has('isInDiffEditor'),
			f1: true,
			category: diffEditorCategory,
		});
	}

	runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, ...args: unknown[]): void {
		const diffEditor = findFocusedDiffEditor(accessor);
		if (diffEditor instanceof DiffEditorWidget) {
			diffEditor.showAllUnchangedRegions();
		}
	}
}

export class RevertHunkOrSelection extends Action2 {
	constructor() {
		super({
			id: 'diffEditor.revert',
			title: localize2('revert', 'Revert'),
			f1: true,
			category: diffEditorCategory,
			precondition: ContextKeyExpr.has('isInDiffEditor'),
		});
	}

	run(accessor: ServicesAccessor, arg?: DiffEditorSelectionHunkToolbarContext): unknown {
		return arg ? this.runViaToolbarContext(accessor, arg) : this.runViaCursorOrSelection(accessor);
	}

	runViaCursorOrSelection(accessor: ServicesAccessor): unknown {
		const diffEditor = findFocusedDiffEditor(accessor);
		if (diffEditor instanceof DiffEditorWidget) {
			diffEditor.revertFocusedRangeMappings();
		}
		return undefined;
	}

	runViaToolbarContext(accessor: ServicesAccessor, arg: DiffEditorSelectionHunkToolbarContext): unknown {
		const diffEditor = findDiffEditor(accessor, arg.originalUri, arg.modifiedUri);
		if (diffEditor instanceof DiffEditorWidget) {
			diffEditor.revertRangeMappings(arg.mapping.innerChanges ?? []);
		}
		return undefined;
	}
}

const accessibleDiffViewerCategory: ILocalizedString = localize2('accessibleDiffViewer', "Accessible Diff Viewer");

export class AccessibleDiffViewerNext extends Action2 {
	public static id = 'editor.action.accessibleDiffViewer.next';

	constructor() {
		super({
			id: AccessibleDiffViewerNext.id,
			title: localize2('editor.action.accessibleDiffViewer.next', 'Go to Next Difference'),
			category: accessibleDiffViewerCategory,
			precondition: ContextKeyExpr.has('isInDiffEditor'),
			keybinding: {
				primary: KeyCode.F7,
				weight: KeybindingWeight.EditorContrib
			},
			f1: true,
		});
	}

	public override run(accessor: ServicesAccessor): void {
		const diffEditor = findFocusedDiffEditor(accessor);
		diffEditor?.accessibleDiffViewerNext();
	}
}

export class AccessibleDiffViewerPrev extends Action2 {
	public static id = 'editor.action.accessibleDiffViewer.prev';

	constructor() {
		super({
			id: AccessibleDiffViewerPrev.id,
			title: localize2('editor.action.accessibleDiffViewer.prev', 'Go to Previous Difference'),
			category: accessibleDiffViewerCategory,
			precondition: ContextKeyExpr.has('isInDiffEditor'),
			keybinding: {
				primary: KeyMod.Shift | KeyCode.F7,
				weight: KeybindingWeight.EditorContrib
			},
			f1: true,
		});
	}

	public override run(accessor: ServicesAccessor): void {
		const diffEditor = findFocusedDiffEditor(accessor);
		diffEditor?.accessibleDiffViewerPrev();
	}
}

export function findDiffEditor(accessor: ServicesAccessor, originalUri: URI, modifiedUri: URI): IDiffEditor | null {
	const codeEditorService = accessor.get(ICodeEditorService);
	const diffEditors = codeEditorService.listDiffEditors();

	return diffEditors.find(diffEditor => {
		const modified = diffEditor.getModifiedEditor();
		const original = diffEditor.getOriginalEditor();

		return modified && modified.getModel()?.uri.toString() === modifiedUri.toString()
			&& original && original.getModel()?.uri.toString() === originalUri.toString();
	}) || null;
}

export function findFocusedDiffEditor(accessor: ServicesAccessor): IDiffEditor | null {
	const codeEditorService = accessor.get(ICodeEditorService);
	const diffEditors = codeEditorService.listDiffEditors();

	const activeElement = getActiveElement();
	if (activeElement) {
		for (const d of diffEditors) {
			const container = d.getContainerDomNode();
			if (container.contains(activeElement)) {
				return d;
			}
		}
	}

	return null;
}


/**
 * If `editor` is the original or modified editor of a diff editor, it returns it.
 * It returns null otherwise.
 */
export function findDiffEditorContainingCodeEditor(accessor: ServicesAccessor, editor: ICodeEditor): IDiffEditor | null {
	if (!editor.getOption(EditorOption.inDiffEditor)) {
		return null;
	}

	const codeEditorService = accessor.get(ICodeEditorService);

	for (const diffEditor of codeEditorService.listDiffEditors()) {
		const originalEditor = diffEditor.getOriginalEditor();
		const modifiedEditor = diffEditor.getModifiedEditor();
		if (originalEditor === editor || modifiedEditor === editor) {
			return diffEditor;
		}
	}
	return null;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/delegatingEditorImpl.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/delegatingEditorImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { CodeEditorWidget } from '../codeEditor/codeEditorWidget.js';
import { IEditorOptions } from '../../../common/config/editorOptions.js';
import { IDimension } from '../../../common/core/2d/dimension.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { IRange, Range } from '../../../common/core/range.js';
import { ISelection, Selection } from '../../../common/core/selection.js';
import { IDiffEditorViewModel, IEditor, IEditorAction, IEditorDecorationsCollection, IEditorModel, IEditorViewState, ScrollType } from '../../../common/editorCommon.js';
import { IModelDecorationsChangeAccessor, IModelDeltaDecoration } from '../../../common/model.js';

export abstract class DelegatingEditor extends Disposable implements IEditor {
	private static idCounter = 0;
	private readonly _id = ++DelegatingEditor.idCounter;

	private readonly _onDidDispose = this._register(new Emitter<void>());
	public readonly onDidDispose = this._onDidDispose.event;

	protected abstract get _targetEditor(): CodeEditorWidget;

	getId(): string { return this.getEditorType() + ':v2:' + this._id; }

	abstract getEditorType(): string;
	abstract updateOptions(newOptions: IEditorOptions): void;
	abstract onVisible(): void;
	abstract onHide(): void;
	abstract layout(dimension?: IDimension | undefined): void;
	abstract hasTextFocus(): boolean;
	abstract saveViewState(): IEditorViewState | null;
	abstract restoreViewState(state: IEditorViewState | null): void;
	abstract getModel(): IEditorModel | null;
	abstract setModel(model: IEditorModel | null | IDiffEditorViewModel): void;

	// #region editorBrowser.IDiffEditor: Delegating to modified Editor

	public getVisibleColumnFromPosition(position: IPosition): number {
		return this._targetEditor.getVisibleColumnFromPosition(position);
	}

	public getStatusbarColumn(position: IPosition): number {
		return this._targetEditor.getStatusbarColumn(position);
	}

	public getPosition(): Position | null {
		return this._targetEditor.getPosition();
	}

	public setPosition(position: IPosition, source: string = 'api'): void {
		this._targetEditor.setPosition(position, source);
	}

	public revealLine(lineNumber: number, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealLine(lineNumber, scrollType);
	}

	public revealLineInCenter(lineNumber: number, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealLineInCenter(lineNumber, scrollType);
	}

	public revealLineInCenterIfOutsideViewport(lineNumber: number, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealLineInCenterIfOutsideViewport(lineNumber, scrollType);
	}

	public revealLineNearTop(lineNumber: number, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealLineNearTop(lineNumber, scrollType);
	}

	public revealPosition(position: IPosition, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealPosition(position, scrollType);
	}

	public revealPositionInCenter(position: IPosition, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealPositionInCenter(position, scrollType);
	}

	public revealPositionInCenterIfOutsideViewport(position: IPosition, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealPositionInCenterIfOutsideViewport(position, scrollType);
	}

	public revealPositionNearTop(position: IPosition, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealPositionNearTop(position, scrollType);
	}

	public getSelection(): Selection | null {
		return this._targetEditor.getSelection();
	}

	public getSelections(): Selection[] | null {
		return this._targetEditor.getSelections();
	}

	public setSelection(range: IRange, source?: string): void;
	public setSelection(editorRange: Range, source?: string): void;
	public setSelection(selection: ISelection, source?: string): void;
	public setSelection(editorSelection: Selection, source?: string): void;
	public setSelection(something: unknown, source: string = 'api'): void {
		this._targetEditor.setSelection(something, source);
	}

	public setSelections(ranges: readonly ISelection[], source: string = 'api'): void {
		this._targetEditor.setSelections(ranges, source);
	}

	public revealLines(startLineNumber: number, endLineNumber: number, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealLines(startLineNumber, endLineNumber, scrollType);
	}

	public revealLinesInCenter(startLineNumber: number, endLineNumber: number, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealLinesInCenter(startLineNumber, endLineNumber, scrollType);
	}

	public revealLinesInCenterIfOutsideViewport(startLineNumber: number, endLineNumber: number, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealLinesInCenterIfOutsideViewport(startLineNumber, endLineNumber, scrollType);
	}

	public revealLinesNearTop(startLineNumber: number, endLineNumber: number, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealLinesNearTop(startLineNumber, endLineNumber, scrollType);
	}

	public revealRange(range: IRange, scrollType: ScrollType = ScrollType.Smooth, revealVerticalInCenter: boolean = false, revealHorizontal: boolean = true): void {
		this._targetEditor.revealRange(range, scrollType, revealVerticalInCenter, revealHorizontal);
	}

	public revealRangeInCenter(range: IRange, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealRangeInCenter(range, scrollType);
	}

	public revealRangeInCenterIfOutsideViewport(range: IRange, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealRangeInCenterIfOutsideViewport(range, scrollType);
	}

	public revealRangeNearTop(range: IRange, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealRangeNearTop(range, scrollType);
	}

	public revealRangeNearTopIfOutsideViewport(range: IRange, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealRangeNearTopIfOutsideViewport(range, scrollType);
	}

	public revealRangeAtTop(range: IRange, scrollType: ScrollType = ScrollType.Smooth): void {
		this._targetEditor.revealRangeAtTop(range, scrollType);
	}

	public getSupportedActions(): IEditorAction[] {
		return this._targetEditor.getSupportedActions();
	}

	public focus(): void {
		this._targetEditor.focus();
	}

	public trigger(source: string | null | undefined, handlerId: string, payload: unknown): void {
		this._targetEditor.trigger(source, handlerId, payload);
	}

	public createDecorationsCollection(decorations?: IModelDeltaDecoration[]): IEditorDecorationsCollection {
		return this._targetEditor.createDecorationsCollection(decorations);
	}

	public changeDecorations<T>(callback: (changeAccessor: IModelDecorationsChangeAccessor) => T): T | null {
		return this._targetEditor.changeDecorations(callback);
	}

	// #endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/diffEditor.contribution.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/diffEditor.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { AccessibleDiffViewerNext, AccessibleDiffViewerPrev, CollapseAllUnchangedRegions, ExitCompareMove, RevertHunkOrSelection, ShowAllUnchangedRegions, SwitchSide, ToggleCollapseUnchangedRegions, ToggleShowMovedCodeBlocks, ToggleUseInlineViewWhenSpaceIsLimited } from './commands.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { localize } from '../../../../nls.js';
import { MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { ContextKeyEqualsExpr, ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import './registrations.contribution.js';

registerAction2(ToggleCollapseUnchangedRegions);
registerAction2(ToggleShowMovedCodeBlocks);
registerAction2(ToggleUseInlineViewWhenSpaceIsLimited);

MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
	command: {
		id: new ToggleUseInlineViewWhenSpaceIsLimited().desc.id,
		title: localize('useInlineViewWhenSpaceIsLimited', "Use Inline View When Space Is Limited"),
		toggled: ContextKeyExpr.has('config.diffEditor.useInlineViewWhenSpaceIsLimited'),
		precondition: ContextKeyExpr.has('isInDiffEditor'),
	},
	order: 11,
	group: '1_diff',
	when: ContextKeyExpr.and(
		EditorContextKeys.diffEditorRenderSideBySideInlineBreakpointReached,
		ContextKeyExpr.has('isInDiffEditor'),
	),
});

MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
	command: {
		id: new ToggleShowMovedCodeBlocks().desc.id,
		title: localize('showMoves', "Show Moved Code Blocks"),
		icon: Codicon.move,
		toggled: ContextKeyEqualsExpr.create('config.diffEditor.experimental.showMoves', true),
		precondition: ContextKeyExpr.has('isInDiffEditor'),
	},
	order: 10,
	group: '1_diff',
	when: ContextKeyExpr.has('isInDiffEditor'),
});

registerAction2(RevertHunkOrSelection);

for (const ctx of [
	{ icon: Codicon.arrowRight, key: EditorContextKeys.diffEditorInlineMode.toNegated() },
	{ icon: Codicon.discard, key: EditorContextKeys.diffEditorInlineMode }
]) {
	MenuRegistry.appendMenuItem(MenuId.DiffEditorHunkToolbar, {
		command: {
			id: new RevertHunkOrSelection().desc.id,
			title: localize('revertHunk', "Revert Block"),
			icon: ctx.icon,
		},
		when: ContextKeyExpr.and(EditorContextKeys.diffEditorModifiedWritable, ctx.key),
		order: 5,
		group: 'primary',
	});

	MenuRegistry.appendMenuItem(MenuId.DiffEditorSelectionToolbar, {
		command: {
			id: new RevertHunkOrSelection().desc.id,
			title: localize('revertSelection', "Revert Selection"),
			icon: ctx.icon,
		},
		when: ContextKeyExpr.and(EditorContextKeys.diffEditorModifiedWritable, ctx.key),
		order: 5,
		group: 'primary',
	});

}

registerAction2(SwitchSide);
registerAction2(ExitCompareMove);
registerAction2(CollapseAllUnchangedRegions);
registerAction2(ShowAllUnchangedRegions);

MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
	command: {
		id: AccessibleDiffViewerNext.id,
		title: localize('Open Accessible Diff Viewer', "Open Accessible Diff Viewer"),
		precondition: ContextKeyExpr.has('isInDiffEditor'),
	},
	order: 10,
	group: '2_diff',
	when: ContextKeyExpr.and(
		EditorContextKeys.accessibleDiffViewerVisible.negate(),
		ContextKeyExpr.has('isInDiffEditor'),
	),
});


CommandsRegistry.registerCommandAlias('editor.action.diffReview.next', AccessibleDiffViewerNext.id);
registerAction2(AccessibleDiffViewerNext);

CommandsRegistry.registerCommandAlias('editor.action.diffReview.prev', AccessibleDiffViewerPrev.id);
registerAction2(AccessibleDiffViewerPrev);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/widget/diffEditor/diffEditorOptions.ts]---
Location: vscode-main/src/vs/editor/browser/widget/diffEditor/diffEditorOptions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IObservable, IObservableWithChange, ISettableObservable, derived, derivedConstOnceDefined, observableFromEvent, observableValue } from '../../../../base/common/observable.js';
import { Constants } from '../../../../base/common/uint.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { diffEditorDefaultOptions } from '../../../common/config/diffEditor.js';
import { IDiffEditorBaseOptions, IDiffEditorOptions, IEditorOptions, ValidDiffEditorBaseOptions, clampedFloat, clampedInt, boolean as validateBooleanOption, stringSet as validateStringSetOption } from '../../../common/config/editorOptions.js';
import { LineRangeMapping } from '../../../common/diff/rangeMapping.js';
import { allowsTrueInlineDiffRendering } from './components/diffEditorViewZones/diffEditorViewZones.js';
import { DiffEditorViewModel, DiffState } from './diffEditorViewModel.js';

export class DiffEditorOptions {
	private readonly _options: ISettableObservable<IEditorOptions & Required<IDiffEditorBaseOptions>, { changedOptions: IDiffEditorOptions }>;

	public get editorOptions(): IObservableWithChange<IEditorOptions, { changedOptions: IEditorOptions }> { return this._options; }

	private readonly _diffEditorWidth;

	private readonly _screenReaderMode;

	constructor(
		options: Readonly<IDiffEditorOptions>,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
	) {
		this._diffEditorWidth = observableValue<number>(this, 0);
		this._screenReaderMode = observableFromEvent(this, this._accessibilityService.onDidChangeScreenReaderOptimized, () => this._accessibilityService.isScreenReaderOptimized());
		this.couldShowInlineViewBecauseOfSize = derived(this, reader =>
			this._options.read(reader).renderSideBySide && this._diffEditorWidth.read(reader) <= this._options.read(reader).renderSideBySideInlineBreakpoint
		);
		this.renderOverviewRuler = derived(this, reader => this._options.read(reader).renderOverviewRuler);
		this.renderSideBySide = derived(this, reader => {
			if (this.compactMode.read(reader)) {
				if (this.shouldRenderInlineViewInSmartMode.read(reader)) {
					return false;
				}
			}

			return this._options.read(reader).renderSideBySide
				&& !(this._options.read(reader).useInlineViewWhenSpaceIsLimited && this.couldShowInlineViewBecauseOfSize.read(reader) && !this._screenReaderMode.read(reader));
		});
		this.readOnly = derived(this, reader => this._options.read(reader).readOnly);
		this.shouldRenderOldRevertArrows = derived(this, reader => {
			if (!this._options.read(reader).renderMarginRevertIcon) { return false; }
			if (!this.renderSideBySide.read(reader)) { return false; }
			if (this.readOnly.read(reader)) { return false; }
			if (this.shouldRenderGutterMenu.read(reader)) { return false; }
			return true;
		});
		this.shouldRenderGutterMenu = derived(this, reader => this._options.read(reader).renderGutterMenu);
		this.renderIndicators = derived(this, reader => this._options.read(reader).renderIndicators);
		this.enableSplitViewResizing = derived(this, reader => this._options.read(reader).enableSplitViewResizing);
		this.splitViewDefaultRatio = derived(this, reader => this._options.read(reader).splitViewDefaultRatio);
		this.ignoreTrimWhitespace = derived(this, reader => this._options.read(reader).ignoreTrimWhitespace);
		this.maxComputationTimeMs = derived(this, reader => this._options.read(reader).maxComputationTime);
		this.showMoves = derived(this, reader => this._options.read(reader).experimental.showMoves! && this.renderSideBySide.read(reader));
		this.isInEmbeddedEditor = derived(this, reader => this._options.read(reader).isInEmbeddedEditor);
		this.diffWordWrap = derived(this, reader => this._options.read(reader).diffWordWrap);
		this.originalEditable = derived(this, reader => this._options.read(reader).originalEditable);
		this.diffCodeLens = derived(this, reader => this._options.read(reader).diffCodeLens);
		this.accessibilityVerbose = derived(this, reader => this._options.read(reader).accessibilityVerbose);
		this.diffAlgorithm = derived(this, reader => this._options.read(reader).diffAlgorithm);
		this.showEmptyDecorations = derived(this, reader => this._options.read(reader).experimental.showEmptyDecorations!);
		this.onlyShowAccessibleDiffViewer = derived(this, reader => this._options.read(reader).onlyShowAccessibleDiffViewer);
		this.compactMode = derived(this, reader => this._options.read(reader).compactMode);
		this.trueInlineDiffRenderingEnabled = derived(this, reader =>
			this._options.read(reader).experimental.useTrueInlineView!
		);
		this.useTrueInlineDiffRendering = derived(this, reader =>
			!this.renderSideBySide.read(reader) && this.trueInlineDiffRenderingEnabled.read(reader)
		);
		this.hideUnchangedRegions = derived(this, reader => this._options.read(reader).hideUnchangedRegions.enabled!);
		this.hideUnchangedRegionsRevealLineCount = derived(this, reader => this._options.read(reader).hideUnchangedRegions.revealLineCount!);
		this.hideUnchangedRegionsContextLineCount = derived(this, reader => this._options.read(reader).hideUnchangedRegions.contextLineCount!);
		this.hideUnchangedRegionsMinimumLineCount = derived(this, reader => this._options.read(reader).hideUnchangedRegions.minimumLineCount!);
		this._model = observableValue<DiffEditorViewModel | undefined>(this, undefined);
		this.shouldRenderInlineViewInSmartMode = this._model
			.map(this, model => derivedConstOnceDefined(this, reader => {
				const diffs = model?.diff.read(reader);
				return diffs ? isSimpleDiff(diffs, this.trueInlineDiffRenderingEnabled.read(reader)) : undefined;
			}))
			.flatten()
			.map(this, v => !!v);
		this.inlineViewHideOriginalLineNumbers = this.compactMode;
		const optionsCopy = { ...options, ...validateDiffEditorOptions(options, diffEditorDefaultOptions) };
		this._options = observableValue(this, optionsCopy);
	}

	public readonly couldShowInlineViewBecauseOfSize;

	public readonly renderOverviewRuler;
	public readonly renderSideBySide;
	public readonly readOnly;

	public readonly shouldRenderOldRevertArrows;

	public readonly shouldRenderGutterMenu;
	public readonly renderIndicators;
	public readonly enableSplitViewResizing;
	public readonly splitViewDefaultRatio;
	public readonly ignoreTrimWhitespace;
	public readonly maxComputationTimeMs;
	public readonly showMoves;
	public readonly isInEmbeddedEditor;
	public readonly diffWordWrap;
	public readonly originalEditable;
	public readonly diffCodeLens;
	public readonly accessibilityVerbose;
	public readonly diffAlgorithm;
	public readonly showEmptyDecorations;
	public readonly onlyShowAccessibleDiffViewer;
	public readonly compactMode;
	private readonly trueInlineDiffRenderingEnabled: IObservable<boolean>;

	public readonly useTrueInlineDiffRendering: IObservable<boolean>;

	public readonly hideUnchangedRegions;
	public readonly hideUnchangedRegionsRevealLineCount;
	public readonly hideUnchangedRegionsContextLineCount;
	public readonly hideUnchangedRegionsMinimumLineCount;

	public updateOptions(changedOptions: IDiffEditorOptions): void {
		const newDiffEditorOptions = validateDiffEditorOptions(changedOptions, this._options.get());
		const newOptions = { ...this._options.get(), ...changedOptions, ...newDiffEditorOptions };
		this._options.set(newOptions, undefined, { changedOptions: changedOptions });
	}

	public setWidth(width: number): void {
		this._diffEditorWidth.set(width, undefined);
	}

	private readonly _model;

	public setModel(model: DiffEditorViewModel | undefined) {
		this._model.set(model, undefined);
	}

	private readonly shouldRenderInlineViewInSmartMode;

	public readonly inlineViewHideOriginalLineNumbers;
}

function isSimpleDiff(diff: DiffState, supportsTrueDiffRendering: boolean): boolean {
	return diff.mappings.every(m => isInsertion(m.lineRangeMapping) || isDeletion(m.lineRangeMapping) || (supportsTrueDiffRendering && allowsTrueInlineDiffRendering(m.lineRangeMapping)));
}

function isInsertion(mapping: LineRangeMapping): boolean {
	return mapping.original.length === 0;
}

function isDeletion(mapping: LineRangeMapping): boolean {
	return mapping.modified.length === 0;
}

function validateDiffEditorOptions(options: Readonly<IDiffEditorOptions>, defaults: typeof diffEditorDefaultOptions | ValidDiffEditorBaseOptions): ValidDiffEditorBaseOptions {
	return {
		enableSplitViewResizing: validateBooleanOption(options.enableSplitViewResizing, defaults.enableSplitViewResizing),
		splitViewDefaultRatio: clampedFloat(options.splitViewDefaultRatio, 0.5, 0.1, 0.9),
		renderSideBySide: validateBooleanOption(options.renderSideBySide, defaults.renderSideBySide),
		renderMarginRevertIcon: validateBooleanOption(options.renderMarginRevertIcon, defaults.renderMarginRevertIcon),
		maxComputationTime: clampedInt(options.maxComputationTime, defaults.maxComputationTime, 0, Constants.MAX_SAFE_SMALL_INTEGER),
		maxFileSize: clampedInt(options.maxFileSize, defaults.maxFileSize, 0, Constants.MAX_SAFE_SMALL_INTEGER),
		ignoreTrimWhitespace: validateBooleanOption(options.ignoreTrimWhitespace, defaults.ignoreTrimWhitespace),
		renderIndicators: validateBooleanOption(options.renderIndicators, defaults.renderIndicators),
		originalEditable: validateBooleanOption(options.originalEditable, defaults.originalEditable),
		diffCodeLens: validateBooleanOption(options.diffCodeLens, defaults.diffCodeLens),
		renderOverviewRuler: validateBooleanOption(options.renderOverviewRuler, defaults.renderOverviewRuler),
		diffWordWrap: validateStringSetOption<'off' | 'on' | 'inherit'>(options.diffWordWrap, defaults.diffWordWrap, ['off', 'on', 'inherit']),
		diffAlgorithm: validateStringSetOption(options.diffAlgorithm, defaults.diffAlgorithm, ['legacy', 'advanced'], { 'smart': 'legacy', 'experimental': 'advanced' }),
		accessibilityVerbose: validateBooleanOption(options.accessibilityVerbose, defaults.accessibilityVerbose),
		experimental: {
			showMoves: validateBooleanOption(options.experimental?.showMoves, defaults.experimental.showMoves!),
			showEmptyDecorations: validateBooleanOption(options.experimental?.showEmptyDecorations, defaults.experimental.showEmptyDecorations!),
			useTrueInlineView: validateBooleanOption(options.experimental?.useTrueInlineView, defaults.experimental.useTrueInlineView!),
		},
		hideUnchangedRegions: {
			// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
			enabled: validateBooleanOption(options.hideUnchangedRegions?.enabled ?? (options.experimental as any)?.collapseUnchangedRegions, defaults.hideUnchangedRegions.enabled!),
			contextLineCount: clampedInt(options.hideUnchangedRegions?.contextLineCount, defaults.hideUnchangedRegions.contextLineCount!, 0, Constants.MAX_SAFE_SMALL_INTEGER),
			minimumLineCount: clampedInt(options.hideUnchangedRegions?.minimumLineCount, defaults.hideUnchangedRegions.minimumLineCount!, 0, Constants.MAX_SAFE_SMALL_INTEGER),
			revealLineCount: clampedInt(options.hideUnchangedRegions?.revealLineCount, defaults.hideUnchangedRegions.revealLineCount!, 0, Constants.MAX_SAFE_SMALL_INTEGER),
		},
		isInEmbeddedEditor: validateBooleanOption(options.isInEmbeddedEditor, defaults.isInEmbeddedEditor),
		onlyShowAccessibleDiffViewer: validateBooleanOption(options.onlyShowAccessibleDiffViewer, defaults.onlyShowAccessibleDiffViewer),
		renderSideBySideInlineBreakpoint: clampedInt(options.renderSideBySideInlineBreakpoint, defaults.renderSideBySideInlineBreakpoint, 0, Constants.MAX_SAFE_SMALL_INTEGER),
		useInlineViewWhenSpaceIsLimited: validateBooleanOption(options.useInlineViewWhenSpaceIsLimited, defaults.useInlineViewWhenSpaceIsLimited),
		renderGutterMenu: validateBooleanOption(options.renderGutterMenu, defaults.renderGutterMenu),
		compactMode: validateBooleanOption(options.compactMode, defaults.compactMode),
	};
}
```

--------------------------------------------------------------------------------

````

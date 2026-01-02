---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 201
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 201 of 552)

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

---[FILE: src/vs/editor/browser/viewParts/decorations/decorations.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/decorations/decorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './decorations.css';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
import { HorizontalRange, RenderingContext } from '../../view/renderingContext.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import { ViewModelDecoration } from '../../../common/viewModel/viewModelDecoration.js';

export class DecorationsOverlay extends DynamicViewOverlay {

	private readonly _context: ViewContext;
	private _typicalHalfwidthCharacterWidth: number;
	private _renderResult: string[] | null;

	constructor(context: ViewContext) {
		super();
		this._context = context;
		const options = this._context.configuration.options;
		this._typicalHalfwidthCharacterWidth = options.get(EditorOption.fontInfo).typicalHalfwidthCharacterWidth;
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
		const options = this._context.configuration.options;
		this._typicalHalfwidthCharacterWidth = options.get(EditorOption.fontInfo).typicalHalfwidthCharacterWidth;
		return true;
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
		return e.scrollTopChanged || e.scrollWidthChanged;
	}
	public override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		return true;
	}
	// --- end event handlers

	public prepareRender(ctx: RenderingContext): void {
		const _decorations = ctx.getDecorationsInViewport();

		// Keep only decorations with `className`
		let decorations: ViewModelDecoration[] = [];
		let decorationsLen = 0;
		for (let i = 0, len = _decorations.length; i < len; i++) {
			const d = _decorations[i];
			if (d.options.className) {
				decorations[decorationsLen++] = d;
			}
		}

		// Sort decorations for consistent render output
		decorations = decorations.sort((a, b) => {
			if (a.options.zIndex! < b.options.zIndex!) {
				return -1;
			}
			if (a.options.zIndex! > b.options.zIndex!) {
				return 1;
			}
			const aClassName = a.options.className!;
			const bClassName = b.options.className!;

			if (aClassName < bClassName) {
				return -1;
			}
			if (aClassName > bClassName) {
				return 1;
			}

			return Range.compareRangesUsingStarts(a.range, b.range);
		});

		const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
		const visibleEndLineNumber = ctx.visibleRange.endLineNumber;
		const output: string[] = [];
		for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
			const lineIndex = lineNumber - visibleStartLineNumber;
			output[lineIndex] = '';
		}

		// Render first whole line decorations and then regular decorations
		this._renderWholeLineDecorations(ctx, decorations, output);
		this._renderNormalDecorations(ctx, decorations, output);
		this._renderResult = output;
	}

	private _renderWholeLineDecorations(ctx: RenderingContext, decorations: ViewModelDecoration[], output: string[]): void {
		const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
		const visibleEndLineNumber = ctx.visibleRange.endLineNumber;

		for (let i = 0, lenI = decorations.length; i < lenI; i++) {
			const d = decorations[i];

			if (!d.options.isWholeLine) {
				continue;
			}

			const decorationOutput = (
				'<div class="cdr '
				+ d.options.className
				+ '" style="left:0;width:100%;"></div>'
			);

			const startLineNumber = Math.max(d.range.startLineNumber, visibleStartLineNumber);
			const endLineNumber = Math.min(d.range.endLineNumber, visibleEndLineNumber);
			for (let j = startLineNumber; j <= endLineNumber; j++) {
				const lineIndex = j - visibleStartLineNumber;
				output[lineIndex] += decorationOutput;
			}
		}
	}

	private _renderNormalDecorations(ctx: RenderingContext, decorations: ViewModelDecoration[], output: string[]): void {
		const visibleStartLineNumber = ctx.visibleRange.startLineNumber;

		let prevClassName: string | null = null;
		let prevShowIfCollapsed: boolean = false;
		let prevRange: Range | null = null;
		let prevShouldFillLineOnLineBreak: boolean = false;

		for (let i = 0, lenI = decorations.length; i < lenI; i++) {
			const d = decorations[i];

			if (d.options.isWholeLine) {
				continue;
			}

			const className = d.options.className!;
			const showIfCollapsed = Boolean(d.options.showIfCollapsed);

			let range = d.range;
			if (showIfCollapsed && range.endColumn === 1 && range.endLineNumber !== range.startLineNumber) {
				range = new Range(range.startLineNumber, range.startColumn, range.endLineNumber - 1, this._context.viewModel.getLineMaxColumn(range.endLineNumber - 1));
			}

			if (prevClassName === className && prevShowIfCollapsed === showIfCollapsed && Range.areIntersectingOrTouching(prevRange!, range)) {
				// merge into previous decoration
				prevRange = Range.plusRange(prevRange!, range);
				continue;
			}

			// flush previous decoration
			if (prevClassName !== null) {
				this._renderNormalDecoration(ctx, prevRange!, prevClassName, prevShouldFillLineOnLineBreak, prevShowIfCollapsed, visibleStartLineNumber, output);
			}

			prevClassName = className;
			prevShowIfCollapsed = showIfCollapsed;
			prevRange = range;
			prevShouldFillLineOnLineBreak = d.options.shouldFillLineOnLineBreak ?? false;
		}

		if (prevClassName !== null) {
			this._renderNormalDecoration(ctx, prevRange!, prevClassName, prevShouldFillLineOnLineBreak, prevShowIfCollapsed, visibleStartLineNumber, output);
		}
	}

	private _renderNormalDecoration(ctx: RenderingContext, range: Range, className: string, shouldFillLineOnLineBreak: boolean, showIfCollapsed: boolean, visibleStartLineNumber: number, output: string[]): void {
		const linesVisibleRanges = ctx.linesVisibleRangesForRange(range, /*TODO@Alex*/className === 'findMatch');
		if (!linesVisibleRanges) {
			return;
		}

		for (let j = 0, lenJ = linesVisibleRanges.length; j < lenJ; j++) {
			const lineVisibleRanges = linesVisibleRanges[j];
			if (lineVisibleRanges.outsideRenderedLine) {
				continue;
			}
			const lineIndex = lineVisibleRanges.lineNumber - visibleStartLineNumber;

			if (showIfCollapsed && lineVisibleRanges.ranges.length === 1) {
				const singleVisibleRange = lineVisibleRanges.ranges[0];
				if (singleVisibleRange.width < this._typicalHalfwidthCharacterWidth) {
					// collapsed/very small range case => make the decoration visible by expanding its width
					// expand its size on both sides (both to the left and to the right, keeping it centered)
					const center = Math.round(singleVisibleRange.left + singleVisibleRange.width / 2);
					const left = Math.max(0, Math.round(center - this._typicalHalfwidthCharacterWidth / 2));
					lineVisibleRanges.ranges[0] = new HorizontalRange(left, this._typicalHalfwidthCharacterWidth);
				}
			}

			for (let k = 0, lenK = lineVisibleRanges.ranges.length; k < lenK; k++) {
				const expandToLeft = shouldFillLineOnLineBreak && lineVisibleRanges.continuesOnNextLine && lenK === 1;
				const visibleRange = lineVisibleRanges.ranges[k];
				const decorationOutput = (
					'<div class="cdr '
					+ className
					+ '" style="left:'
					+ String(visibleRange.left)
					+ 'px;width:'
					+ (expandToLeft ?
						'100%;' :
						(String(visibleRange.width) + 'px;')
					)
					+ '"></div>'
				);
				output[lineIndex] += decorationOutput;
			}
		}
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
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/editorScrollbar/editorScrollbar.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/editorScrollbar/editorScrollbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { IOverviewRulerLayoutInfo, SmoothScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { ScrollableElementChangeOptions, ScrollableElementCreationOptions } from '../../../../base/browser/ui/scrollbar/scrollableElementOptions.js';
import { PartFingerprint, PartFingerprints, ViewPart } from '../../view/viewPart.js';
import { INewScrollPosition, ScrollType } from '../../../common/editorCommon.js';
import { RenderingContext, RestrictedRenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { getThemeTypeSelector } from '../../../../platform/theme/common/themeService.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IMouseWheelEvent } from '../../../../base/browser/mouseEvent.js';

/**
 * The editor scrollbar built on VS Code's scrollable element that sits beside
 * the minimap.
 */
export class EditorScrollbar extends ViewPart {

	private readonly scrollbar: SmoothScrollableElement;
	private readonly scrollbarDomNode: FastDomNode<HTMLElement>;

	constructor(
		context: ViewContext,
		linesContent: FastDomNode<HTMLElement>,
		viewDomNode: FastDomNode<HTMLElement>,
		overflowGuardDomNode: FastDomNode<HTMLElement>
	) {
		super(context);


		const options = this._context.configuration.options;
		const scrollbar = options.get(EditorOption.scrollbar);
		const mouseWheelScrollSensitivity = options.get(EditorOption.mouseWheelScrollSensitivity);
		const fastScrollSensitivity = options.get(EditorOption.fastScrollSensitivity);
		const scrollPredominantAxis = options.get(EditorOption.scrollPredominantAxis);
		const inertialScroll = options.get(EditorOption.inertialScroll);

		const scrollbarOptions: ScrollableElementCreationOptions = {
			listenOnDomNode: viewDomNode.domNode,
			className: 'editor-scrollable' + ' ' + getThemeTypeSelector(context.theme.type),
			useShadows: false,
			lazyRender: true,

			vertical: scrollbar.vertical,
			horizontal: scrollbar.horizontal,
			verticalHasArrows: scrollbar.verticalHasArrows,
			horizontalHasArrows: scrollbar.horizontalHasArrows,
			verticalScrollbarSize: scrollbar.verticalScrollbarSize,
			verticalSliderSize: scrollbar.verticalSliderSize,
			horizontalScrollbarSize: scrollbar.horizontalScrollbarSize,
			horizontalSliderSize: scrollbar.horizontalSliderSize,
			handleMouseWheel: scrollbar.handleMouseWheel,
			alwaysConsumeMouseWheel: scrollbar.alwaysConsumeMouseWheel,
			arrowSize: scrollbar.arrowSize,
			mouseWheelScrollSensitivity: mouseWheelScrollSensitivity,
			fastScrollSensitivity: fastScrollSensitivity,
			scrollPredominantAxis: scrollPredominantAxis,
			scrollByPage: scrollbar.scrollByPage,
			inertialScroll: inertialScroll,
		};

		this.scrollbar = this._register(new SmoothScrollableElement(linesContent.domNode, scrollbarOptions, this._context.viewLayout.getScrollable()));
		PartFingerprints.write(this.scrollbar.getDomNode(), PartFingerprint.ScrollableElement);

		this.scrollbarDomNode = createFastDomNode(this.scrollbar.getDomNode());
		this.scrollbarDomNode.setPosition('absolute');
		this._setLayout();

		// When having a zone widget that calls .focus() on one of its dom elements,
		// the browser will try desperately to reveal that dom node, unexpectedly
		// changing the .scrollTop of this.linesContent

		const onBrowserDesperateReveal = (domNode: HTMLElement, lookAtScrollTop: boolean, lookAtScrollLeft: boolean) => {
			const newScrollPosition: INewScrollPosition = {};

			if (lookAtScrollTop) {
				const deltaTop = domNode.scrollTop;
				if (deltaTop) {
					newScrollPosition.scrollTop = this._context.viewLayout.getCurrentScrollTop() + deltaTop;
					domNode.scrollTop = 0;
				}
			}

			if (lookAtScrollLeft) {
				const deltaLeft = domNode.scrollLeft;
				if (deltaLeft) {
					newScrollPosition.scrollLeft = this._context.viewLayout.getCurrentScrollLeft() + deltaLeft;
					domNode.scrollLeft = 0;
				}
			}

			this._context.viewModel.viewLayout.setScrollPosition(newScrollPosition, ScrollType.Immediate);
		};

		// I've seen this happen both on the view dom node & on the lines content dom node.
		this._register(dom.addDisposableListener(viewDomNode.domNode, 'scroll', (e: Event) => onBrowserDesperateReveal(viewDomNode.domNode, true, true)));
		this._register(dom.addDisposableListener(linesContent.domNode, 'scroll', (e: Event) => onBrowserDesperateReveal(linesContent.domNode, true, false)));
		this._register(dom.addDisposableListener(overflowGuardDomNode.domNode, 'scroll', (e: Event) => onBrowserDesperateReveal(overflowGuardDomNode.domNode, true, false)));
		this._register(dom.addDisposableListener(this.scrollbarDomNode.domNode, 'scroll', (e: Event) => onBrowserDesperateReveal(this.scrollbarDomNode.domNode, true, false)));
	}

	public override dispose(): void {
		super.dispose();
	}

	private _setLayout(): void {
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);

		this.scrollbarDomNode.setLeft(layoutInfo.contentLeft);

		const minimap = options.get(EditorOption.minimap);
		const side = minimap.side;
		if (side === 'right') {
			this.scrollbarDomNode.setWidth(layoutInfo.contentWidth + layoutInfo.minimap.minimapWidth);
		} else {
			this.scrollbarDomNode.setWidth(layoutInfo.contentWidth);
		}
		this.scrollbarDomNode.setHeight(layoutInfo.height);
	}

	public getOverviewRulerLayoutInfo(): IOverviewRulerLayoutInfo {
		return this.scrollbar.getOverviewRulerLayoutInfo();
	}

	public getDomNode(): FastDomNode<HTMLElement> {
		return this.scrollbarDomNode;
	}

	public delegateVerticalScrollbarPointerDown(browserEvent: PointerEvent): void {
		this.scrollbar.delegateVerticalScrollbarPointerDown(browserEvent);
	}

	public delegateScrollFromMouseWheelEvent(browserEvent: IMouseWheelEvent) {
		this.scrollbar.delegateScrollFromMouseWheelEvent(browserEvent);
	}

	// --- begin event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		if (
			e.hasChanged(EditorOption.scrollbar)
			|| e.hasChanged(EditorOption.mouseWheelScrollSensitivity)
			|| e.hasChanged(EditorOption.fastScrollSensitivity)
		) {
			const options = this._context.configuration.options;
			const scrollbar = options.get(EditorOption.scrollbar);
			const mouseWheelScrollSensitivity = options.get(EditorOption.mouseWheelScrollSensitivity);
			const fastScrollSensitivity = options.get(EditorOption.fastScrollSensitivity);
			const scrollPredominantAxis = options.get(EditorOption.scrollPredominantAxis);
			const newOpts: ScrollableElementChangeOptions = {
				vertical: scrollbar.vertical,
				horizontal: scrollbar.horizontal,
				verticalScrollbarSize: scrollbar.verticalScrollbarSize,
				horizontalScrollbarSize: scrollbar.horizontalScrollbarSize,
				scrollByPage: scrollbar.scrollByPage,
				handleMouseWheel: scrollbar.handleMouseWheel,
				mouseWheelScrollSensitivity: mouseWheelScrollSensitivity,
				fastScrollSensitivity: fastScrollSensitivity,
				scrollPredominantAxis: scrollPredominantAxis
			};
			this.scrollbar.updateOptions(newOpts);
		}
		if (e.hasChanged(EditorOption.layoutInfo)) {
			this._setLayout();
		}
		return true;
	}
	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return true;
	}
	public override onThemeChanged(e: viewEvents.ViewThemeChangedEvent): boolean {
		this.scrollbar.updateClassName('editor-scrollable' + ' ' + getThemeTypeSelector(this._context.theme.type));
		return true;
	}

	// --- end event handlers

	public prepareRender(ctx: RenderingContext): void {
		// Nothing to do
	}

	public render(ctx: RestrictedRenderingContext): void {
		this.scrollbar.renderNow();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/glyphMargin/glyphMargin.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/glyphMargin/glyphMargin.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .glyph-margin {
	position: absolute;
	top: 0;
}

/*
	Keeping name short for faster parsing.
	cgmr = core glyph margin rendering (div)
*/
.monaco-editor .glyph-margin-widgets .cgmr {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
}

/*
	Ensure spinning icons are pixel-perfectly centered and avoid wobble.
	This is only applied to icons that spin to avoid unnecessary
	GPU layers and blurry subpixel AA.
*/
.monaco-editor .glyph-margin-widgets .cgmr.codicon-modifier-spin::before  {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/glyphMargin/glyphMargin.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/glyphMargin/glyphMargin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { ArrayQueue } from '../../../../base/common/arrays.js';
import './glyphMargin.css';
import { IGlyphMarginWidget, IGlyphMarginWidgetPosition } from '../../editorBrowser.js';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
import { RenderingContext, RestrictedRenderingContext } from '../../view/renderingContext.js';
import { ViewPart } from '../../view/viewPart.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { GlyphMarginLane } from '../../../common/model.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';

/**
 * Represents a decoration that should be shown along the lines from `startLineNumber` to `endLineNumber`.
 * This can end up producing multiple `LineDecorationToRender`.
 */
export class DecorationToRender {
	public readonly _decorationToRenderBrand: void = undefined;

	public readonly zIndex: number;

	constructor(
		public readonly startLineNumber: number,
		public readonly endLineNumber: number,
		public readonly className: string,
		public readonly tooltip: string | null,
		zIndex: number | undefined,
	) {
		this.zIndex = zIndex ?? 0;
	}
}

/**
 * A decoration that should be shown along a line.
 */
export class LineDecorationToRender {
	constructor(
		public readonly className: string,
		public readonly zIndex: number,
		public readonly tooltip: string | null,
	) { }
}

/**
 * Decorations to render on a visible line.
 */
export class VisibleLineDecorationsToRender {

	private readonly decorations: LineDecorationToRender[] = [];

	public add(decoration: LineDecorationToRender) {
		this.decorations.push(decoration);
	}

	public getDecorations(): LineDecorationToRender[] {
		return this.decorations;
	}
}

export abstract class DedupOverlay extends DynamicViewOverlay {

	/**
	 * Returns an array with an element for each visible line number.
	 */
	protected _render(visibleStartLineNumber: number, visibleEndLineNumber: number, decorations: DecorationToRender[]): VisibleLineDecorationsToRender[] {

		const output: VisibleLineDecorationsToRender[] = [];
		for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
			const lineIndex = lineNumber - visibleStartLineNumber;
			output[lineIndex] = new VisibleLineDecorationsToRender();
		}

		if (decorations.length === 0) {
			return output;
		}

		// Sort decorations by className, then by startLineNumber and then by endLineNumber
		decorations.sort((a, b) => {
			if (a.className === b.className) {
				if (a.startLineNumber === b.startLineNumber) {
					return a.endLineNumber - b.endLineNumber;
				}
				return a.startLineNumber - b.startLineNumber;
			}
			return (a.className < b.className ? -1 : 1);
		});

		let prevClassName: string | null = null;
		let prevEndLineIndex = 0;
		for (const d of decorations) {
			const className = d.className;
			const zIndex = d.zIndex;
			let startLineIndex = Math.max(d.startLineNumber, visibleStartLineNumber) - visibleStartLineNumber;
			const endLineIndex = Math.min(d.endLineNumber, visibleEndLineNumber) - visibleStartLineNumber;

			if (prevClassName === className) {
				// Here we avoid rendering the same className multiple times on the same line
				startLineIndex = Math.max(prevEndLineIndex + 1, startLineIndex);
				prevEndLineIndex = Math.max(prevEndLineIndex, endLineIndex);
			} else {
				prevClassName = className;
				prevEndLineIndex = endLineIndex;
			}

			for (let lineIndex = startLineIndex; lineIndex <= prevEndLineIndex; lineIndex++) {
				output[lineIndex].add(new LineDecorationToRender(className, zIndex, d.tooltip));
			}
		}

		return output;
	}
}

export class GlyphMarginWidgets extends ViewPart {

	public domNode: FastDomNode<HTMLElement>;

	private _lineHeight: number;
	private _glyphMargin: boolean;
	private _glyphMarginLeft: number;
	private _glyphMarginWidth: number;
	private _glyphMarginDecorationLaneCount: number;

	private _managedDomNodes: FastDomNode<HTMLElement>[];
	private _decorationGlyphsToRender: DecorationBasedGlyph[];

	private _widgets: { [key: string]: IWidgetData } = {};

	constructor(context: ViewContext) {
		super(context);
		this._context = context;

		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);

		this.domNode = createFastDomNode(document.createElement('div'));
		this.domNode.setClassName('glyph-margin-widgets');
		this.domNode.setPosition('absolute');
		this.domNode.setTop(0);

		this._lineHeight = options.get(EditorOption.lineHeight);
		this._glyphMargin = options.get(EditorOption.glyphMargin);
		this._glyphMarginLeft = layoutInfo.glyphMarginLeft;
		this._glyphMarginWidth = layoutInfo.glyphMarginWidth;
		this._glyphMarginDecorationLaneCount = layoutInfo.glyphMarginDecorationLaneCount;
		this._managedDomNodes = [];
		this._decorationGlyphsToRender = [];
	}

	public override dispose(): void {
		this._managedDomNodes = [];
		this._decorationGlyphsToRender = [];
		this._widgets = {};
		super.dispose();
	}

	public getWidgets(): IWidgetData[] {
		return Object.values(this._widgets);
	}

	// --- begin event handlers
	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);

		this._lineHeight = options.get(EditorOption.lineHeight);
		this._glyphMargin = options.get(EditorOption.glyphMargin);
		this._glyphMarginLeft = layoutInfo.glyphMarginLeft;
		this._glyphMarginWidth = layoutInfo.glyphMarginWidth;
		this._glyphMarginDecorationLaneCount = layoutInfo.glyphMarginDecorationLaneCount;
		return true;
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

	// --- begin widget management

	public addWidget(widget: IGlyphMarginWidget): void {
		const domNode = createFastDomNode(widget.getDomNode());

		this._widgets[widget.getId()] = {
			widget: widget,
			preference: widget.getPosition(),
			domNode: domNode,
			renderInfo: null
		};

		domNode.setPosition('absolute');
		domNode.setDisplay('none');
		domNode.setAttribute('widgetId', widget.getId());
		this.domNode.appendChild(domNode);

		this.setShouldRender();
	}

	public setWidgetPosition(widget: IGlyphMarginWidget, preference: IGlyphMarginWidgetPosition): boolean {
		const myWidget = this._widgets[widget.getId()];
		if (myWidget.preference.lane === preference.lane
			&& myWidget.preference.zIndex === preference.zIndex
			&& Range.equalsRange(myWidget.preference.range, preference.range)) {
			return false;
		}

		myWidget.preference = preference;
		this.setShouldRender();

		return true;
	}

	public removeWidget(widget: IGlyphMarginWidget): void {
		const widgetId = widget.getId();
		if (this._widgets[widgetId]) {
			const widgetData = this._widgets[widgetId];
			const domNode = widgetData.domNode.domNode;
			delete this._widgets[widgetId];

			domNode.remove();
			this.setShouldRender();
		}
	}

	// --- end widget management

	private _collectDecorationBasedGlyphRenderRequest(ctx: RenderingContext, requests: GlyphRenderRequest[]): void {
		const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
		const visibleEndLineNumber = ctx.visibleRange.endLineNumber;
		const decorations = ctx.getDecorationsInViewport();

		for (const d of decorations) {
			const glyphMarginClassName = d.options.glyphMarginClassName;
			if (!glyphMarginClassName) {
				continue;
			}

			const startLineNumber = Math.max(d.range.startLineNumber, visibleStartLineNumber);
			const endLineNumber = Math.min(d.range.endLineNumber, visibleEndLineNumber);
			const lane = d.options.glyphMargin?.position ?? GlyphMarginLane.Center;
			const zIndex = d.options.zIndex ?? 0;

			for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
				const modelPosition = this._context.viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(lineNumber, 0));
				const laneIndex = this._context.viewModel.glyphLanes.getLanesAtLine(modelPosition.lineNumber).indexOf(lane);
				requests.push(new DecorationBasedGlyphRenderRequest(lineNumber, laneIndex, zIndex, glyphMarginClassName));
			}
		}
	}

	private _collectWidgetBasedGlyphRenderRequest(ctx: RenderingContext, requests: GlyphRenderRequest[]): void {
		const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
		const visibleEndLineNumber = ctx.visibleRange.endLineNumber;

		for (const widget of Object.values(this._widgets)) {
			const range = widget.preference.range;
			const { startLineNumber, endLineNumber } = this._context.viewModel.coordinatesConverter.convertModelRangeToViewRange(Range.lift(range));
			if (!startLineNumber || !endLineNumber || endLineNumber < visibleStartLineNumber || startLineNumber > visibleEndLineNumber) {
				// The widget is not in the viewport
				continue;
			}

			// The widget is in the viewport, find a good line for it
			const widgetLineNumber = Math.max(startLineNumber, visibleStartLineNumber);
			const modelPosition = this._context.viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(widgetLineNumber, 0));
			const laneIndex = this._context.viewModel.glyphLanes.getLanesAtLine(modelPosition.lineNumber).indexOf(widget.preference.lane);
			requests.push(new WidgetBasedGlyphRenderRequest(widgetLineNumber, laneIndex, widget.preference.zIndex, widget));
		}
	}

	private _collectSortedGlyphRenderRequests(ctx: RenderingContext): GlyphRenderRequest[] {

		const requests: GlyphRenderRequest[] = [];

		this._collectDecorationBasedGlyphRenderRequest(ctx, requests);
		this._collectWidgetBasedGlyphRenderRequest(ctx, requests);

		// sort requests by lineNumber ASC, lane  ASC, zIndex DESC, type DESC (widgets first), className ASC
		// don't change this sort unless you understand `prepareRender` below.
		requests.sort((a, b) => {
			if (a.lineNumber === b.lineNumber) {
				if (a.laneIndex === b.laneIndex) {
					if (a.zIndex === b.zIndex) {
						if (b.type === a.type) {
							if (a.type === GlyphRenderRequestType.Decoration && b.type === GlyphRenderRequestType.Decoration) {
								return (a.className < b.className ? -1 : 1);
							}
							return 0;
						}
						return b.type - a.type;
					}
					return b.zIndex - a.zIndex;
				}
				return a.laneIndex - b.laneIndex;
			}
			return a.lineNumber - b.lineNumber;
		});

		return requests;
	}

	/**
	 * Will store render information in each widget's renderInfo and in `_decorationGlyphsToRender`.
	 */
	public prepareRender(ctx: RenderingContext): void {
		if (!this._glyphMargin) {
			this._decorationGlyphsToRender = [];
			return;
		}

		for (const widget of Object.values(this._widgets)) {
			widget.renderInfo = null;
		}

		const requests = new ArrayQueue<GlyphRenderRequest>(this._collectSortedGlyphRenderRequests(ctx));
		const decorationGlyphsToRender: DecorationBasedGlyph[] = [];
		while (requests.length > 0) {
			const first = requests.peek();
			if (!first) {
				// not possible
				break;
			}

			// Requests are sorted by lineNumber and lane, so we read all requests for this particular location
			const requestsAtLocation = requests.takeWhile((el) => el.lineNumber === first.lineNumber && el.laneIndex === first.laneIndex);
			if (!requestsAtLocation || requestsAtLocation.length === 0) {
				// not possible
				break;
			}

			const winner = requestsAtLocation[0];
			if (winner.type === GlyphRenderRequestType.Decoration) {
				// combine all decorations with the same z-index

				const classNames: string[] = [];
				// requests are sorted by zIndex, type, and className so we can dedup className by looking at the previous one
				for (const request of requestsAtLocation) {
					if (request.zIndex !== winner.zIndex || request.type !== winner.type) {
						break;
					}
					if (classNames.length === 0 || classNames[classNames.length - 1] !== request.className) {
						classNames.push(request.className);
					}
				}

				decorationGlyphsToRender.push(winner.accept(classNames.join(' '))); // TODO@joyceerhl Implement overflow for remaining decorations
			} else {
				// widgets cannot be combined
				winner.widget.renderInfo = {
					lineNumber: winner.lineNumber,
					laneIndex: winner.laneIndex,
				};
			}
		}
		this._decorationGlyphsToRender = decorationGlyphsToRender;
	}

	public render(ctx: RestrictedRenderingContext): void {
		if (!this._glyphMargin) {
			for (const widget of Object.values(this._widgets)) {
				widget.domNode.setDisplay('none');
			}
			while (this._managedDomNodes.length > 0) {
				const domNode = this._managedDomNodes.pop();
				domNode?.domNode.remove();
			}
			return;
		}

		const width = (Math.round(this._glyphMarginWidth / this._glyphMarginDecorationLaneCount));

		// Render widgets
		for (const widget of Object.values(this._widgets)) {
			if (!widget.renderInfo) {
				// this widget is not visible
				widget.domNode.setDisplay('none');
			} else {
				const top = ctx.viewportData.relativeVerticalOffset[widget.renderInfo.lineNumber - ctx.viewportData.startLineNumber];
				const left = this._glyphMarginLeft + widget.renderInfo.laneIndex * this._lineHeight;

				widget.domNode.setDisplay('block');
				widget.domNode.setTop(top);
				widget.domNode.setLeft(left);
				widget.domNode.setWidth(width);
				widget.domNode.setHeight(this._lineHeight);
			}
		}

		// Render decorations, reusing previous dom nodes as possible
		for (let i = 0; i < this._decorationGlyphsToRender.length; i++) {
			const dec = this._decorationGlyphsToRender[i];
			const decLineNumber = dec.lineNumber;
			const top = ctx.viewportData.relativeVerticalOffset[decLineNumber - ctx.viewportData.startLineNumber];
			const left = this._glyphMarginLeft + dec.laneIndex * this._lineHeight;

			let domNode: FastDomNode<HTMLElement>;
			if (i < this._managedDomNodes.length) {
				domNode = this._managedDomNodes[i];
			} else {
				domNode = createFastDomNode(document.createElement('div'));
				this._managedDomNodes.push(domNode);
				this.domNode.appendChild(domNode);
			}
			const lineHeight = this._context.viewLayout.getLineHeightForLineNumber(decLineNumber);

			domNode.setClassName(`cgmr codicon ` + dec.combinedClassName);
			domNode.setPosition(`absolute`);
			domNode.setTop(top);
			domNode.setLeft(left);
			domNode.setWidth(width);
			domNode.setHeight(lineHeight);
		}

		// remove extra dom nodes
		while (this._managedDomNodes.length > this._decorationGlyphsToRender.length) {
			const domNode = this._managedDomNodes.pop();
			domNode?.domNode.remove();
		}
	}
}

export interface IWidgetData {
	widget: IGlyphMarginWidget;
	preference: IGlyphMarginWidgetPosition;
	domNode: FastDomNode<HTMLElement>;
	/**
	 * it will contain the location where to render the widget
	 * or null if the widget is not visible
	 */
	renderInfo: IRenderInfo | null;
}

export interface IRenderInfo {
	lineNumber: number;
	laneIndex: number;
}

const enum GlyphRenderRequestType {
	Decoration = 0,
	Widget = 1
}

/**
 * A request to render a decoration in the glyph margin at a certain location.
 */
class DecorationBasedGlyphRenderRequest {
	public readonly type = GlyphRenderRequestType.Decoration;

	constructor(
		public readonly lineNumber: number,
		public readonly laneIndex: number,
		public readonly zIndex: number,
		public readonly className: string,
	) { }

	accept(combinedClassName: string): DecorationBasedGlyph {
		return new DecorationBasedGlyph(this.lineNumber, this.laneIndex, combinedClassName);
	}
}

/**
 * A request to render a widget in the glyph margin at a certain location.
 */
class WidgetBasedGlyphRenderRequest {
	public readonly type = GlyphRenderRequestType.Widget;

	constructor(
		public readonly lineNumber: number,
		public readonly laneIndex: number,
		public readonly zIndex: number,
		public readonly widget: IWidgetData,
	) { }
}

type GlyphRenderRequest = DecorationBasedGlyphRenderRequest | WidgetBasedGlyphRenderRequest;

class DecorationBasedGlyph {
	constructor(
		public readonly lineNumber: number,
		public readonly laneIndex: number,
		public readonly combinedClassName: string
	) { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/gpuMark/gpuMark.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/gpuMark/gpuMark.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .margin-view-overlays .gpu-mark {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	display: inline-block;
	border-left: solid 2px var(--vscode-editorWarning-foreground);
	opacity: 0.2;
	transition: background-color 0.1s linear;
}

.monaco-editor .margin-view-overlays .gpu-mark:hover {
	background-color: var(--vscode-editorWarning-foreground)
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/gpuMark/gpuMark.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/gpuMark/gpuMark.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as viewEvents from '../../../common/viewEvents.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import { ViewGpuContext } from '../../gpu/viewGpuContext.js';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
import { RenderingContext } from '../../view/renderingContext.js';
import { ViewLineOptions } from '../viewLines/viewLineOptions.js';
import './gpuMark.css';

/**
 * A mark on lines to make identification of GPU-rendered lines vs DOM easier.
 */
export class GpuMarkOverlay extends DynamicViewOverlay {

	public static readonly CLASS_NAME = 'gpu-mark';

	private readonly _context: ViewContext;

	private _renderResult: string[] | null;

	constructor(context: ViewContext, private readonly _viewGpuContext: ViewGpuContext) {
		super();
		this._context = context;
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
		return true;
	}
	public override onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean {
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
	public override onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean {
		return true;
	}

	// --- end event handlers

	public prepareRender(ctx: RenderingContext): void {
		const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
		const visibleEndLineNumber = ctx.visibleRange.endLineNumber;

		const viewportData = ctx.viewportData;
		const options = new ViewLineOptions(this._context.configuration, this._context.theme.type);

		const output: string[] = [];
		for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
			const lineIndex = lineNumber - visibleStartLineNumber;
			const cannotRenderReasons = this._viewGpuContext.canRenderDetailed(options, viewportData, lineNumber);
			output[lineIndex] = cannotRenderReasons.length ? `<div class="${GpuMarkOverlay.CLASS_NAME}" title="Cannot render on GPU: ${cannotRenderReasons.join(', ')}"></div>` : '';
		}

		this._renderResult = output;
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
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/indentGuides/indentGuides.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/indentGuides/indentGuides.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .lines-content .core-guide {
	position: absolute;
	box-sizing: border-box;
	height: 100%;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/indentGuides/indentGuides.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/indentGuides/indentGuides.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './indentGuides.css';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
import { editorBracketHighlightingForeground1, editorBracketHighlightingForeground2, editorBracketHighlightingForeground3, editorBracketHighlightingForeground4, editorBracketHighlightingForeground5, editorBracketHighlightingForeground6, editorBracketPairGuideActiveBackground1, editorBracketPairGuideActiveBackground2, editorBracketPairGuideActiveBackground3, editorBracketPairGuideActiveBackground4, editorBracketPairGuideActiveBackground5, editorBracketPairGuideActiveBackground6, editorBracketPairGuideBackground1, editorBracketPairGuideBackground2, editorBracketPairGuideBackground3, editorBracketPairGuideBackground4, editorBracketPairGuideBackground5, editorBracketPairGuideBackground6, editorIndentGuide1, editorIndentGuide2, editorIndentGuide3, editorIndentGuide4, editorIndentGuide5, editorIndentGuide6, editorActiveIndentGuide1, editorActiveIndentGuide2, editorActiveIndentGuide3, editorActiveIndentGuide4, editorActiveIndentGuide5, editorActiveIndentGuide6 } from '../../../common/core/editorColorRegistry.js';
import { RenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { EditorOption, InternalGuidesOptions } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { ArrayQueue } from '../../../../base/common/arrays.js';
import { Color } from '../../../../base/common/color.js';
import { isDefined } from '../../../../base/common/types.js';
import { BracketPairGuidesClassNames } from '../../../common/model/guidesTextModelPart.js';
import { IndentGuide, HorizontalGuidesState } from '../../../common/textModelGuides.js';

/**
 * Indent guides are vertical lines that help identify the indentation level of
 * the code.
 */
export class IndentGuidesOverlay extends DynamicViewOverlay {

	private readonly _context: ViewContext;
	private _primaryPosition: Position | null;
	private _spaceWidth: number;
	private _renderResult: string[] | null;
	private _maxIndentLeft: number;
	private _bracketPairGuideOptions: InternalGuidesOptions;

	constructor(context: ViewContext) {
		super();
		this._context = context;
		this._primaryPosition = null;

		const options = this._context.configuration.options;
		const wrappingInfo = options.get(EditorOption.wrappingInfo);
		const fontInfo = options.get(EditorOption.fontInfo);

		this._spaceWidth = fontInfo.spaceWidth;
		this._maxIndentLeft = wrappingInfo.wrappingColumn === -1 ? -1 : (wrappingInfo.wrappingColumn * fontInfo.typicalHalfwidthCharacterWidth);
		this._bracketPairGuideOptions = options.get(EditorOption.guides);

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
		const options = this._context.configuration.options;
		const wrappingInfo = options.get(EditorOption.wrappingInfo);
		const fontInfo = options.get(EditorOption.fontInfo);

		this._spaceWidth = fontInfo.spaceWidth;
		this._maxIndentLeft = wrappingInfo.wrappingColumn === -1 ? -1 : (wrappingInfo.wrappingColumn * fontInfo.typicalHalfwidthCharacterWidth);
		this._bracketPairGuideOptions = options.get(EditorOption.guides);

		return true;
	}
	public override onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean {
		const selection = e.selections[0];
		const newPosition = selection.getPosition();
		if (!this._primaryPosition?.equals(newPosition)) {
			this._primaryPosition = newPosition;
			return true;
		}

		return false;
	}
	public override onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean {
		// true for inline decorations
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
		return e.scrollTopChanged;// || e.scrollWidthChanged;
	}
	public override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		return true;
	}
	public override onLanguageConfigurationChanged(e: viewEvents.ViewLanguageConfigurationEvent): boolean {
		return true;
	}

	// --- end event handlers

	public prepareRender(ctx: RenderingContext): void {
		if (!this._bracketPairGuideOptions.indentation && this._bracketPairGuideOptions.bracketPairs === false) {
			this._renderResult = null;
			return;
		}

		const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
		const visibleEndLineNumber = ctx.visibleRange.endLineNumber;
		const scrollWidth = ctx.scrollWidth;

		const activeCursorPosition = this._primaryPosition;

		const indents = this.getGuidesByLine(
			visibleStartLineNumber,
			Math.min(visibleEndLineNumber + 1, this._context.viewModel.getLineCount()),
			activeCursorPosition
		);

		const output: string[] = [];
		for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
			const lineIndex = lineNumber - visibleStartLineNumber;
			const indent = indents[lineIndex];
			let result = '';
			const leftOffset = ctx.visibleRangeForPosition(new Position(lineNumber, 1))?.left ?? 0;
			for (const guide of indent) {
				const left =
					guide.column === -1
						? leftOffset + (guide.visibleColumn - 1) * this._spaceWidth
						: ctx.visibleRangeForPosition(
							new Position(lineNumber, guide.column)
						)!.left;

				if (left > scrollWidth || (this._maxIndentLeft > 0 && left > this._maxIndentLeft)) {
					break;
				}

				const className = guide.horizontalLine ? (guide.horizontalLine.top ? 'horizontal-top' : 'horizontal-bottom') : 'vertical';

				const width = guide.horizontalLine
					? (ctx.visibleRangeForPosition(
						new Position(lineNumber, guide.horizontalLine.endColumn)
					)?.left ?? (left + this._spaceWidth)) - left
					: this._spaceWidth;

				result += `<div class="core-guide ${guide.className} ${className}" style="left:${left}px;width:${width}px"></div>`;
			}
			output[lineIndex] = result;
		}
		this._renderResult = output;
	}

	private getGuidesByLine(
		visibleStartLineNumber: number,
		visibleEndLineNumber: number,
		activeCursorPosition: Position | null
	): IndentGuide[][] {
		const bracketGuides = this._bracketPairGuideOptions.bracketPairs !== false
			? this._context.viewModel.getBracketGuidesInRangeByLine(
				visibleStartLineNumber,
				visibleEndLineNumber,
				activeCursorPosition,
				{
					highlightActive: this._bracketPairGuideOptions.highlightActiveBracketPair,
					horizontalGuides: this._bracketPairGuideOptions.bracketPairsHorizontal === true
						? HorizontalGuidesState.Enabled
						: this._bracketPairGuideOptions.bracketPairsHorizontal === 'active'
							? HorizontalGuidesState.EnabledForActive
							: HorizontalGuidesState.Disabled,
					includeInactive: this._bracketPairGuideOptions.bracketPairs === true,
				}
			)
			: null;

		const indentGuides = this._bracketPairGuideOptions.indentation
			? this._context.viewModel.getLinesIndentGuides(
				visibleStartLineNumber,
				visibleEndLineNumber
			)
			: null;

		let activeIndentStartLineNumber = 0;
		let activeIndentEndLineNumber = 0;
		let activeIndentLevel = 0;

		if (this._bracketPairGuideOptions.highlightActiveIndentation !== false && activeCursorPosition) {
			const activeIndentInfo = this._context.viewModel.getActiveIndentGuide(activeCursorPosition.lineNumber, visibleStartLineNumber, visibleEndLineNumber);
			activeIndentStartLineNumber = activeIndentInfo.startLineNumber;
			activeIndentEndLineNumber = activeIndentInfo.endLineNumber;
			activeIndentLevel = activeIndentInfo.indent;
		}

		const { indentSize } = this._context.viewModel.model.getOptions();

		const result: IndentGuide[][] = [];
		for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
			const lineGuides = new Array<IndentGuide>();
			result.push(lineGuides);

			const bracketGuidesInLine = bracketGuides ? bracketGuides[lineNumber - visibleStartLineNumber] : [];
			const bracketGuidesInLineQueue = new ArrayQueue(bracketGuidesInLine);

			const indentGuidesInLine = indentGuides ? indentGuides[lineNumber - visibleStartLineNumber] : 0;

			for (let indentLvl = 1; indentLvl <= indentGuidesInLine; indentLvl++) {
				const indentGuide = (indentLvl - 1) * indentSize + 1;
				const isActive =
					// Disable active indent guide if there are bracket guides.
					(this._bracketPairGuideOptions.highlightActiveIndentation === 'always' || bracketGuidesInLine.length === 0) &&
					activeIndentStartLineNumber <= lineNumber &&
					lineNumber <= activeIndentEndLineNumber &&
					indentLvl === activeIndentLevel;
				lineGuides.push(...bracketGuidesInLineQueue.takeWhile(g => g.visibleColumn < indentGuide) || []);
				const peeked = bracketGuidesInLineQueue.peek();
				if (!peeked || peeked.visibleColumn !== indentGuide || peeked.horizontalLine) {
					lineGuides.push(
						new IndentGuide(
							indentGuide,
							-1,
							`core-guide-indent lvl-${(indentLvl - 1) % 30}` + (isActive ? ' indent-active' : ''),
							null,
							-1,
							-1,
						)
					);
				}
			}

			lineGuides.push(...bracketGuidesInLineQueue.takeWhile(g => true) || []);
		}

		return result;
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

function transparentToUndefined(color: Color | undefined): Color | undefined {
	if (color && color.isTransparent()) {
		return undefined;
	}
	return color;
}

registerThemingParticipant((theme, collector) => {

	const colors = [
		{ bracketColor: editorBracketHighlightingForeground1, guideColor: editorBracketPairGuideBackground1, guideColorActive: editorBracketPairGuideActiveBackground1 },
		{ bracketColor: editorBracketHighlightingForeground2, guideColor: editorBracketPairGuideBackground2, guideColorActive: editorBracketPairGuideActiveBackground2 },
		{ bracketColor: editorBracketHighlightingForeground3, guideColor: editorBracketPairGuideBackground3, guideColorActive: editorBracketPairGuideActiveBackground3 },
		{ bracketColor: editorBracketHighlightingForeground4, guideColor: editorBracketPairGuideBackground4, guideColorActive: editorBracketPairGuideActiveBackground4 },
		{ bracketColor: editorBracketHighlightingForeground5, guideColor: editorBracketPairGuideBackground5, guideColorActive: editorBracketPairGuideActiveBackground5 },
		{ bracketColor: editorBracketHighlightingForeground6, guideColor: editorBracketPairGuideBackground6, guideColorActive: editorBracketPairGuideActiveBackground6 }
	];
	const colorProvider = new BracketPairGuidesClassNames();

	const indentColors = [
		{ indentColor: editorIndentGuide1, indentColorActive: editorActiveIndentGuide1 },
		{ indentColor: editorIndentGuide2, indentColorActive: editorActiveIndentGuide2 },
		{ indentColor: editorIndentGuide3, indentColorActive: editorActiveIndentGuide3 },
		{ indentColor: editorIndentGuide4, indentColorActive: editorActiveIndentGuide4 },
		{ indentColor: editorIndentGuide5, indentColorActive: editorActiveIndentGuide5 },
		{ indentColor: editorIndentGuide6, indentColorActive: editorActiveIndentGuide6 },
	];

	const colorValues = colors
		.map(c => {
			const bracketColor = theme.getColor(c.bracketColor);
			const guideColor = theme.getColor(c.guideColor);
			const guideColorActive = theme.getColor(c.guideColorActive);

			const effectiveGuideColor = transparentToUndefined(transparentToUndefined(guideColor) ?? bracketColor?.transparent(0.3));
			const effectiveGuideColorActive = transparentToUndefined(transparentToUndefined(guideColorActive) ?? bracketColor);

			if (!effectiveGuideColor || !effectiveGuideColorActive) {
				return undefined;
			}

			return {
				guideColor: effectiveGuideColor,
				guideColorActive: effectiveGuideColorActive,
			};
		})
		.filter(isDefined);

	const indentColorValues = indentColors
		.map(c => {
			const indentColor = theme.getColor(c.indentColor);
			const indentColorActive = theme.getColor(c.indentColorActive);

			const effectiveIndentColor = transparentToUndefined(indentColor);
			const effectiveIndentColorActive = transparentToUndefined(indentColorActive);

			if (!effectiveIndentColor || !effectiveIndentColorActive) {
				return undefined;
			}

			return {
				indentColor: effectiveIndentColor,
				indentColorActive: effectiveIndentColorActive,
			};
		})
		.filter(isDefined);

	if (colorValues.length > 0) {
		for (let level = 0; level < 30; level++) {
			const colors = colorValues[level % colorValues.length];
			collector.addRule(`.monaco-editor .${colorProvider.getInlineClassNameOfLevel(level).replace(/ /g, '.')} { --guide-color: ${colors.guideColor}; --guide-color-active: ${colors.guideColorActive}; }`);
		}

		collector.addRule(`.monaco-editor .vertical { box-shadow: 1px 0 0 0 var(--guide-color) inset; }`);
		collector.addRule(`.monaco-editor .horizontal-top { border-top: 1px solid var(--guide-color); }`);
		collector.addRule(`.monaco-editor .horizontal-bottom { border-bottom: 1px solid var(--guide-color); }`);

		collector.addRule(`.monaco-editor .vertical.${colorProvider.activeClassName} { box-shadow: 1px 0 0 0 var(--guide-color-active) inset; }`);
		collector.addRule(`.monaco-editor .horizontal-top.${colorProvider.activeClassName} { border-top: 1px solid var(--guide-color-active); }`);
		collector.addRule(`.monaco-editor .horizontal-bottom.${colorProvider.activeClassName} { border-bottom: 1px solid var(--guide-color-active); }`);
	}

	if (indentColorValues.length > 0) {
		for (let level = 0; level < 30; level++) {
			const colors = indentColorValues[level % indentColorValues.length];
			collector.addRule(`.monaco-editor .lines-content .core-guide-indent.lvl-${level} { --indent-color: ${colors.indentColor}; --indent-color-active: ${colors.indentColorActive}; }`);
		}

		collector.addRule(`.monaco-editor .lines-content .core-guide-indent { box-shadow: 1px 0 0 0 var(--indent-color) inset; }`);
		collector.addRule(`.monaco-editor .lines-content .core-guide-indent.indent-active { box-shadow: 1px 0 0 0 var(--indent-color-active) inset; }`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/lineNumbers/lineNumbers.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/lineNumbers/lineNumbers.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .margin-view-overlays .line-numbers {
	bottom: 0;
	font-variant-numeric: tabular-nums;
	position: absolute;
	text-align: right;
	display: inline-block;
	vertical-align: middle;
	box-sizing: border-box;
	cursor: default;
}

.monaco-editor .relative-current-line-number {
	text-align: left;
	display: inline-block;
	width: 100%;
}

.monaco-editor .margin-view-overlays .line-numbers.lh-odd {
	margin-top: 1px;
}

.monaco-editor .line-numbers {
	color: var(--vscode-editorLineNumber-foreground);
}

.monaco-editor .line-numbers.active-line-number {
	color: var(--vscode-editorLineNumber-activeForeground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/lineNumbers/lineNumbers.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/lineNumbers/lineNumbers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './lineNumbers.css';
import * as platform from '../../../../base/common/platform.js';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
import { RenderLineNumbersType, EditorOption } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { RenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { editorDimmedLineNumber, editorLineNumbers } from '../../../common/core/editorColorRegistry.js';

/**
 * Renders line numbers to the left of the main view lines content.
 */
export class LineNumbersOverlay extends DynamicViewOverlay {

	public static readonly CLASS_NAME = 'line-numbers';

	private readonly _context: ViewContext;

	private _lineHeight!: number;
	private _renderLineNumbers!: RenderLineNumbersType;
	private _renderCustomLineNumbers!: ((lineNumber: number) => string) | null;
	private _renderFinalNewline!: 'off' | 'on' | 'dimmed';
	private _lineNumbersLeft!: number;
	private _lineNumbersWidth!: number;
	private _lastCursorModelPosition: Position;
	private _renderResult: string[] | null;
	private _activeModelLineNumber: number;

	constructor(context: ViewContext) {
		super();
		this._context = context;

		this._readConfig();

		this._lastCursorModelPosition = new Position(1, 1);
		this._renderResult = null;
		this._activeModelLineNumber = 1;
		this._context.addEventHandler(this);
	}

	private _readConfig(): void {
		const options = this._context.configuration.options;
		this._lineHeight = options.get(EditorOption.lineHeight);
		const lineNumbers = options.get(EditorOption.lineNumbers);
		this._renderLineNumbers = lineNumbers.renderType;
		this._renderCustomLineNumbers = lineNumbers.renderFn;
		this._renderFinalNewline = options.get(EditorOption.renderFinalNewline);
		const layoutInfo = options.get(EditorOption.layoutInfo);
		this._lineNumbersLeft = layoutInfo.lineNumbersLeft;
		this._lineNumbersWidth = layoutInfo.lineNumbersWidth;
	}

	public override dispose(): void {
		this._context.removeEventHandler(this);
		this._renderResult = null;
		super.dispose();
	}

	// --- begin event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		this._readConfig();
		return true;
	}
	public override onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean {
		const primaryViewPosition = e.selections[0].getPosition();
		this._lastCursorModelPosition = this._context.viewModel.coordinatesConverter.convertViewPositionToModelPosition(primaryViewPosition);

		let shouldRender = false;
		if (this._activeModelLineNumber !== this._lastCursorModelPosition.lineNumber) {
			this._activeModelLineNumber = this._lastCursorModelPosition.lineNumber;
			shouldRender = true;
		}
		if (this._renderLineNumbers === RenderLineNumbersType.Relative || this._renderLineNumbers === RenderLineNumbersType.Interval) {
			shouldRender = true;
		}
		return shouldRender;
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
	public override onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean {
		return e.affectsLineNumber;
	}

	// --- end event handlers

	private _getLineRenderLineNumber(viewLineNumber: number): string {
		const modelPosition = this._context.viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(viewLineNumber, 1));
		if (modelPosition.column !== 1) {
			return '';
		}
		const modelLineNumber = modelPosition.lineNumber;

		if (this._renderCustomLineNumbers) {
			return this._renderCustomLineNumbers(modelLineNumber);
		}

		if (this._renderLineNumbers === RenderLineNumbersType.Relative) {
			const diff = Math.abs(this._lastCursorModelPosition.lineNumber - modelLineNumber);
			if (diff === 0) {
				return '<span class="relative-current-line-number">' + modelLineNumber + '</span>';
			}
			return String(diff);
		}

		if (this._renderLineNumbers === RenderLineNumbersType.Interval) {
			if (this._lastCursorModelPosition.lineNumber === modelLineNumber) {
				return String(modelLineNumber);
			}
			if (modelLineNumber % 10 === 0) {
				return String(modelLineNumber);
			}
			const finalLineNumber = this._context.viewModel.getLineCount();
			if (modelLineNumber === finalLineNumber) {
				return String(modelLineNumber);
			}
			return '';
		}

		return String(modelLineNumber);
	}

	public prepareRender(ctx: RenderingContext): void {
		if (this._renderLineNumbers === RenderLineNumbersType.Off) {
			this._renderResult = null;
			return;
		}

		const lineHeightClassName = (platform.isLinux ? (this._lineHeight % 2 === 0 ? ' lh-even' : ' lh-odd') : '');
		const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
		const visibleEndLineNumber = ctx.visibleRange.endLineNumber;

		const lineNoDecorations = this._context.viewModel.getDecorationsInViewport(ctx.visibleRange).filter(d => !!d.options.lineNumberClassName);
		lineNoDecorations.sort((a, b) => Range.compareRangesUsingEnds(a.range, b.range));
		let decorationStartIndex = 0;

		const lineCount = this._context.viewModel.getLineCount();
		const output: string[] = [];
		for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
			const lineIndex = lineNumber - visibleStartLineNumber;
			const modelLineNumber: number = this._context.viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(lineNumber, 1)).lineNumber;

			let renderLineNumber = this._getLineRenderLineNumber(lineNumber);
			let extraClassNames = '';

			// skip decorations whose end positions we've already passed
			while (decorationStartIndex < lineNoDecorations.length && lineNoDecorations[decorationStartIndex].range.endLineNumber < lineNumber) {
				decorationStartIndex++;
			}
			for (let i = decorationStartIndex; i < lineNoDecorations.length; i++) {
				const { range, options } = lineNoDecorations[i];
				if (range.startLineNumber <= lineNumber) {
					extraClassNames += ' ' + options.lineNumberClassName;
				}
			}

			if (!renderLineNumber && !extraClassNames) {
				output[lineIndex] = '';
				continue;
			}

			if (lineNumber === lineCount && this._context.viewModel.getLineLength(lineNumber) === 0) {
				// this is the last line
				if (this._renderFinalNewline === 'off') {
					renderLineNumber = '';
				}
				if (this._renderFinalNewline === 'dimmed') {
					extraClassNames += ' dimmed-line-number';
				}
			}
			if (modelLineNumber === this._activeModelLineNumber) {
				extraClassNames += ' active-line-number';
			}


			output[lineIndex] = (
				`<div class="${LineNumbersOverlay.CLASS_NAME}${lineHeightClassName}${extraClassNames}" style="left:${this._lineNumbersLeft}px;width:${this._lineNumbersWidth}px;">${renderLineNumber}</div>`
			);
		}

		this._renderResult = output;
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

registerThemingParticipant((theme, collector) => {
	const editorLineNumbersColor = theme.getColor(editorLineNumbers);
	const editorDimmedLineNumberColor = theme.getColor(editorDimmedLineNumber);
	if (editorDimmedLineNumberColor) {
		collector.addRule(`.monaco-editor .line-numbers.dimmed-line-number { color: ${editorDimmedLineNumberColor}; }`);
	} else if (editorLineNumbersColor) {
		collector.addRule(`.monaco-editor .line-numbers.dimmed-line-number { color: ${editorLineNumbersColor.transparent(0.4)}; }`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/linesDecorations/linesDecorations.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/linesDecorations/linesDecorations.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
.monaco-editor .lines-decorations {
	position: absolute;
	top: 0;
	background: white;
}

/*
	Keeping name short for faster parsing.
	cldr = core lines decorations rendering (div)
*/
.monaco-editor .margin-view-overlays .cldr {
	position: absolute;
	height: 100%;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/linesDecorations/linesDecorations.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/linesDecorations/linesDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './linesDecorations.css';
import { DecorationToRender, DedupOverlay } from '../glyphMargin/glyphMargin.js';
import { RenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { EditorOption } from '../../../common/config/editorOptions.js';


export class LinesDecorationsOverlay extends DedupOverlay {

	private readonly _context: ViewContext;

	private _decorationsLeft: number;
	private _decorationsWidth: number;
	private _renderResult: string[] | null;

	constructor(context: ViewContext) {
		super();
		this._context = context;
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);
		this._decorationsLeft = layoutInfo.decorationsLeft;
		this._decorationsWidth = layoutInfo.decorationsWidth;
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
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);
		this._decorationsLeft = layoutInfo.decorationsLeft;
		this._decorationsWidth = layoutInfo.decorationsWidth;
		return true;
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

	protected _getDecorations(ctx: RenderingContext): DecorationToRender[] {
		const decorations = ctx.getDecorationsInViewport();
		const r: DecorationToRender[] = [];
		let rLen = 0;
		for (let i = 0, len = decorations.length; i < len; i++) {
			const d = decorations[i];
			const linesDecorationsClassName = d.options.linesDecorationsClassName;
			const zIndex = d.options.zIndex;
			if (linesDecorationsClassName) {
				r[rLen++] = new DecorationToRender(d.range.startLineNumber, d.range.endLineNumber, linesDecorationsClassName, d.options.linesDecorationsTooltip ?? null, zIndex);
			}
			const firstLineDecorationClassName = d.options.firstLineDecorationClassName;
			if (firstLineDecorationClassName) {
				r[rLen++] = new DecorationToRender(d.range.startLineNumber, d.range.startLineNumber, firstLineDecorationClassName, d.options.linesDecorationsTooltip ?? null, zIndex);
			}
		}
		return r;
	}

	public prepareRender(ctx: RenderingContext): void {
		const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
		const visibleEndLineNumber = ctx.visibleRange.endLineNumber;
		const toRender = this._render(visibleStartLineNumber, visibleEndLineNumber, this._getDecorations(ctx));

		const left = this._decorationsLeft.toString();
		const width = this._decorationsWidth.toString();
		const common = '" style="left:' + left + 'px;width:' + width + 'px;"></div>';

		const output: string[] = [];
		for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
			const lineIndex = lineNumber - visibleStartLineNumber;
			const decorations = toRender[lineIndex].getDecorations();
			let lineOutput = '';
			for (const decoration of decorations) {
				let addition = '<div class="cldr ' + decoration.className;
				if (decoration.tooltip !== null) {
					addition += '" title="' + decoration.tooltip; // The tooltip is already escaped.
				}
				addition += common;
				lineOutput += addition;
			}
			output[lineIndex] = lineOutput;
		}

		this._renderResult = output;
	}

	public render(startLineNumber: number, lineNumber: number): string {
		if (!this._renderResult) {
			return '';
		}
		return this._renderResult[lineNumber - startLineNumber];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/margin/margin.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/margin/margin.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .margin {
	background-color: var(--vscode-editorGutter-background);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/margin/margin.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/margin/margin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './margin.css';
import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { ViewPart } from '../../view/viewPart.js';
import { RenderingContext, RestrictedRenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { EditorOption } from '../../../common/config/editorOptions.js';

/**
 * Margin is a vertical strip located on the left of the editor's content area.
 * It is used for various features such as line numbers, folding markers, and
 * decorations that provide additional information about the lines of code.
 */
export class Margin extends ViewPart {

	public static readonly CLASS_NAME = 'glyph-margin';
	public static readonly OUTER_CLASS_NAME = 'margin';

	private readonly _domNode: FastDomNode<HTMLElement>;
	private _canUseLayerHinting: boolean;
	private _contentLeft: number;
	private _glyphMarginLeft: number;
	private _glyphMarginWidth: number;
	private _glyphMarginBackgroundDomNode: FastDomNode<HTMLElement>;

	constructor(context: ViewContext) {
		super(context);
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);

		this._canUseLayerHinting = !options.get(EditorOption.disableLayerHinting);
		this._contentLeft = layoutInfo.contentLeft;
		this._glyphMarginLeft = layoutInfo.glyphMarginLeft;
		this._glyphMarginWidth = layoutInfo.glyphMarginWidth;

		this._domNode = createFastDomNode(document.createElement('div'));
		this._domNode.setClassName(Margin.OUTER_CLASS_NAME);
		this._domNode.setPosition('absolute');
		this._domNode.setAttribute('role', 'presentation');
		this._domNode.setAttribute('aria-hidden', 'true');

		this._glyphMarginBackgroundDomNode = createFastDomNode(document.createElement('div'));
		this._glyphMarginBackgroundDomNode.setClassName(Margin.CLASS_NAME);

		this._domNode.appendChild(this._glyphMarginBackgroundDomNode);
	}

	public override dispose(): void {
		super.dispose();
	}

	public getDomNode(): FastDomNode<HTMLElement> {
		return this._domNode;
	}

	// --- begin event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);

		this._canUseLayerHinting = !options.get(EditorOption.disableLayerHinting);
		this._contentLeft = layoutInfo.contentLeft;
		this._glyphMarginLeft = layoutInfo.glyphMarginLeft;
		this._glyphMarginWidth = layoutInfo.glyphMarginWidth;

		return true;
	}
	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return super.onScrollChanged(e) || e.scrollTopChanged;
	}

	// --- end event handlers

	public prepareRender(ctx: RenderingContext): void {
		// Nothing to read
	}

	public render(ctx: RestrictedRenderingContext): void {
		this._domNode.setLayerHinting(this._canUseLayerHinting);
		this._domNode.setContain('strict');
		const adjustedScrollTop = ctx.scrollTop - ctx.bigNumbersDelta;
		this._domNode.setTop(-adjustedScrollTop);

		const height = Math.min(ctx.scrollHeight, 1000000);
		this._domNode.setHeight(height);
		this._domNode.setWidth(this._contentLeft);

		this._glyphMarginBackgroundDomNode.setLeft(this._glyphMarginLeft);
		this._glyphMarginBackgroundDomNode.setWidth(this._glyphMarginWidth);
		this._glyphMarginBackgroundDomNode.setHeight(height);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/marginDecorations/marginDecorations.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/marginDecorations/marginDecorations.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*
	Keeping name short for faster parsing.
	cmdr = core margin decorations rendering (div)
*/
.monaco-editor .margin-view-overlays .cmdr {
	position: absolute;
	left: 0;
	width: 100%;
	height: 100%;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/marginDecorations/marginDecorations.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/marginDecorations/marginDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './marginDecorations.css';
import { DecorationToRender, DedupOverlay } from '../glyphMargin/glyphMargin.js';
import { RenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';

export class MarginViewLineDecorationsOverlay extends DedupOverlay {
	private readonly _context: ViewContext;
	private _renderResult: string[] | null;

	constructor(context: ViewContext) {
		super();
		this._context = context;
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
		return true;
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

	protected _getDecorations(ctx: RenderingContext): DecorationToRender[] {
		const decorations = ctx.getDecorationsInViewport();
		const r: DecorationToRender[] = [];
		let rLen = 0;
		for (let i = 0, len = decorations.length; i < len; i++) {
			const d = decorations[i];
			const marginClassName = d.options.marginClassName;
			const zIndex = d.options.zIndex;
			if (marginClassName) {
				r[rLen++] = new DecorationToRender(d.range.startLineNumber, d.range.endLineNumber, marginClassName, null, zIndex);
			}
		}
		return r;
	}

	public prepareRender(ctx: RenderingContext): void {
		const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
		const visibleEndLineNumber = ctx.visibleRange.endLineNumber;
		const toRender = this._render(visibleStartLineNumber, visibleEndLineNumber, this._getDecorations(ctx));

		const output: string[] = [];
		for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
			const lineIndex = lineNumber - visibleStartLineNumber;
			const decorations = toRender[lineIndex].getDecorations();
			let lineOutput = '';
			for (const decoration of decorations) {
				lineOutput += '<div class="cmdr ' + decoration.className + '" style=""></div>';
			}
			output[lineIndex] = lineOutput;
		}

		this._renderResult = output;
	}

	public render(startLineNumber: number, lineNumber: number): string {
		if (!this._renderResult) {
			return '';
		}
		return this._renderResult[lineNumber - startLineNumber];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/minimap/minimap.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/minimap/minimap.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* START cover the case that slider is visible on mouseover */
.monaco-editor .minimap.slider-mouseover .minimap-slider {
	opacity: 0;
	transition: opacity 100ms linear;
}
.monaco-editor .minimap.slider-mouseover:hover .minimap-slider {
	opacity: 1;
}
.monaco-editor .minimap.slider-mouseover .minimap-slider.active {
	opacity: 1;
}
/* END cover the case that slider is visible on mouseover */
.monaco-editor .minimap-slider .minimap-slider-horizontal {
	background: var(--vscode-minimapSlider-background);
}
.monaco-editor .minimap-slider:hover .minimap-slider-horizontal {
	background: var(--vscode-minimapSlider-hoverBackground);
}
.monaco-editor .minimap-slider.active .minimap-slider-horizontal {
	background: var(--vscode-minimapSlider-activeBackground);
}
.monaco-editor .minimap-shadow-visible {
	box-shadow: var(--vscode-scrollbar-shadow) -6px 0 6px -6px inset;
}
.monaco-editor .minimap-shadow-hidden {
	position: absolute;
	width: 0;
}
.monaco-editor .minimap-shadow-visible {
	position: absolute;
	left: -6px;
	width: 6px;
	pointer-events: none;
}
.monaco-editor.no-minimap-shadow .minimap-shadow-visible {
	position: absolute;
	left: -1px;
	width: 1px;
}

/* 0.5s fade in/out for the minimap */
.minimap.minimap-autohide-mouseover,
.minimap.minimap-autohide-scroll {
	opacity: 0;
	transition: opacity 0.5s;
}
.minimap.minimap-autohide-scroll{
	pointer-events: none;
}
.minimap.minimap-autohide-mouseover:hover,
.minimap.minimap-autohide-scroll.active {
	opacity: 1;
	pointer-events: auto;
}

.monaco-editor .minimap {
	z-index: 5;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/minimap/minimap.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/minimap/minimap.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './minimap.css';
import * as dom from '../../../../base/browser/dom.js';
import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { GlobalPointerMoveMonitor } from '../../../../base/browser/globalPointerMoveMonitor.js';
import { CharCode } from '../../../../base/common/charCode.js';
import { IDisposable, Disposable } from '../../../../base/common/lifecycle.js';
import * as platform from '../../../../base/common/platform.js';
import * as strings from '../../../../base/common/strings.js';
import { ILine, RenderedLinesCollection } from '../../view/viewLayer.js';
import { PartFingerprint, PartFingerprints, ViewPart } from '../../view/viewPart.js';
import { RenderMinimap, EditorOption, MINIMAP_GUTTER_WIDTH, EditorLayoutInfoComputer } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import { RGBA8 } from '../../../common/core/misc/rgba.js';
import { ScrollType } from '../../../common/editorCommon.js';
import { IEditorConfiguration } from '../../../common/config/editorConfiguration.js';
import { ColorId } from '../../../common/encodedTokenAttributes.js';
import { MinimapCharRenderer } from './minimapCharRenderer.js';
import { Constants } from './minimapCharSheet.js';
import { MinimapTokensColorTracker } from '../../../common/viewModel/minimapTokensColorTracker.js';
import { RenderingContext, RestrictedRenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import { EditorTheme } from '../../../common/editorTheme.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { ViewLineData } from '../../../common/viewModel.js';
import { minimapSelection, minimapBackground, minimapForegroundOpacity, editorForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { ModelDecorationMinimapOptions } from '../../../common/model/textModel.js';
import { Selection } from '../../../common/core/selection.js';
import { Color } from '../../../../base/common/color.js';
import { GestureEvent, EventType, Gesture } from '../../../../base/browser/touch.js';
import { MinimapCharRendererFactory } from './minimapCharRendererFactory.js';
import { MinimapPosition, MinimapSectionHeaderStyle, TextModelResolvedOptions } from '../../../common/model.js';
import { createSingleCallFunction } from '../../../../base/common/functional.js';
import { LRUCache } from '../../../../base/common/map.js';
import { DEFAULT_FONT_FAMILY } from '../../../../base/browser/fonts.js';
import { ViewModelDecoration } from '../../../common/viewModel/viewModelDecoration.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';

/**
 * The orthogonal distance to the slider at which dragging "resets". This implements "snapping"
 */
const POINTER_DRAG_RESET_DISTANCE = 140;

const GUTTER_DECORATION_WIDTH = 2;

class MinimapOptions {

	public readonly renderMinimap: RenderMinimap;
	public readonly size: 'proportional' | 'fill' | 'fit';
	public readonly minimapHeightIsEditorHeight: boolean;
	public readonly scrollBeyondLastLine: boolean;
	public readonly paddingTop: number;
	public readonly paddingBottom: number;
	public readonly showSlider: 'always' | 'mouseover';
	public readonly autohide: 'none' | 'mouseover' | 'scroll';
	public readonly pixelRatio: number;
	public readonly typicalHalfwidthCharacterWidth: number;
	public readonly lineHeight: number;
	/**
	 * container dom node left position (in CSS px)
	 */
	public readonly minimapLeft: number;
	/**
	 * container dom node width (in CSS px)
	 */
	public readonly minimapWidth: number;
	/**
	 * container dom node height (in CSS px)
	 */
	public readonly minimapHeight: number;
	/**
	 * canvas backing store width (in device px)
	 */
	public readonly canvasInnerWidth: number;
	/**
	 * canvas backing store height (in device px)
	 */
	public readonly canvasInnerHeight: number;
	/**
	 * canvas width (in CSS px)
	 */
	public readonly canvasOuterWidth: number;
	/**
	 * canvas height (in CSS px)
	 */
	public readonly canvasOuterHeight: number;

	public readonly isSampling: boolean;
	public readonly editorHeight: number;
	public readonly fontScale: number;
	public readonly minimapLineHeight: number;
	public readonly minimapCharWidth: number;
	public readonly sectionHeaderFontFamily: string;
	public readonly sectionHeaderFontSize: number;
	/**
	 * Space in between the characters of the section header (in CSS px)
	 */
	public readonly sectionHeaderLetterSpacing: number;
	public readonly sectionHeaderFontColor: RGBA8;

	public readonly charRenderer: () => MinimapCharRenderer;
	public readonly defaultBackgroundColor: RGBA8;
	public readonly backgroundColor: RGBA8;
	/**
	 * foreground alpha: integer in [0-255]
	 */
	public readonly foregroundAlpha: number;

	constructor(configuration: IEditorConfiguration, theme: EditorTheme, tokensColorTracker: MinimapTokensColorTracker) {
		const options = configuration.options;
		const pixelRatio = options.get(EditorOption.pixelRatio);
		const layoutInfo = options.get(EditorOption.layoutInfo);
		const minimapLayout = layoutInfo.minimap;
		const fontInfo = options.get(EditorOption.fontInfo);
		const minimapOpts = options.get(EditorOption.minimap);

		this.renderMinimap = minimapLayout.renderMinimap;
		this.size = minimapOpts.size;
		this.minimapHeightIsEditorHeight = minimapLayout.minimapHeightIsEditorHeight;
		this.scrollBeyondLastLine = options.get(EditorOption.scrollBeyondLastLine);
		this.paddingTop = options.get(EditorOption.padding).top;
		this.paddingBottom = options.get(EditorOption.padding).bottom;
		this.showSlider = minimapOpts.showSlider;
		this.autohide = minimapOpts.autohide;
		this.pixelRatio = pixelRatio;
		this.typicalHalfwidthCharacterWidth = fontInfo.typicalHalfwidthCharacterWidth;
		this.lineHeight = options.get(EditorOption.lineHeight);
		this.minimapLeft = minimapLayout.minimapLeft;
		this.minimapWidth = minimapLayout.minimapWidth;
		this.minimapHeight = layoutInfo.height;

		this.canvasInnerWidth = minimapLayout.minimapCanvasInnerWidth;
		this.canvasInnerHeight = minimapLayout.minimapCanvasInnerHeight;
		this.canvasOuterWidth = minimapLayout.minimapCanvasOuterWidth;
		this.canvasOuterHeight = minimapLayout.minimapCanvasOuterHeight;

		this.isSampling = minimapLayout.minimapIsSampling;
		this.editorHeight = layoutInfo.height;
		this.fontScale = minimapLayout.minimapScale;
		this.minimapLineHeight = minimapLayout.minimapLineHeight;
		this.minimapCharWidth = Constants.BASE_CHAR_WIDTH * this.fontScale;
		this.sectionHeaderFontFamily = DEFAULT_FONT_FAMILY;
		this.sectionHeaderFontSize = minimapOpts.sectionHeaderFontSize * pixelRatio;
		this.sectionHeaderLetterSpacing = minimapOpts.sectionHeaderLetterSpacing; // intentionally not multiplying by pixelRatio
		this.sectionHeaderFontColor = MinimapOptions._getSectionHeaderColor(theme, tokensColorTracker.getColor(ColorId.DefaultForeground));

		this.charRenderer = createSingleCallFunction(() => MinimapCharRendererFactory.create(this.fontScale, fontInfo.fontFamily));
		this.defaultBackgroundColor = tokensColorTracker.getColor(ColorId.DefaultBackground);
		this.backgroundColor = MinimapOptions._getMinimapBackground(theme, this.defaultBackgroundColor);
		this.foregroundAlpha = MinimapOptions._getMinimapForegroundOpacity(theme);
	}

	private static _getMinimapBackground(theme: EditorTheme, defaultBackgroundColor: RGBA8): RGBA8 {
		const themeColor = theme.getColor(minimapBackground);
		if (themeColor) {
			return new RGBA8(themeColor.rgba.r, themeColor.rgba.g, themeColor.rgba.b, Math.round(255 * themeColor.rgba.a));
		}
		return defaultBackgroundColor;
	}

	private static _getMinimapForegroundOpacity(theme: EditorTheme): number {
		const themeColor = theme.getColor(minimapForegroundOpacity);
		if (themeColor) {
			return RGBA8._clamp(Math.round(255 * themeColor.rgba.a));
		}
		return 255;
	}

	private static _getSectionHeaderColor(theme: EditorTheme, defaultForegroundColor: RGBA8): RGBA8 {
		const themeColor = theme.getColor(editorForeground);
		if (themeColor) {
			return new RGBA8(themeColor.rgba.r, themeColor.rgba.g, themeColor.rgba.b, Math.round(255 * themeColor.rgba.a));
		}
		return defaultForegroundColor;
	}

	public equals(other: MinimapOptions): boolean {
		return (this.renderMinimap === other.renderMinimap
			&& this.size === other.size
			&& this.minimapHeightIsEditorHeight === other.minimapHeightIsEditorHeight
			&& this.scrollBeyondLastLine === other.scrollBeyondLastLine
			&& this.paddingTop === other.paddingTop
			&& this.paddingBottom === other.paddingBottom
			&& this.showSlider === other.showSlider
			&& this.autohide === other.autohide
			&& this.pixelRatio === other.pixelRatio
			&& this.typicalHalfwidthCharacterWidth === other.typicalHalfwidthCharacterWidth
			&& this.lineHeight === other.lineHeight
			&& this.minimapLeft === other.minimapLeft
			&& this.minimapWidth === other.minimapWidth
			&& this.minimapHeight === other.minimapHeight
			&& this.canvasInnerWidth === other.canvasInnerWidth
			&& this.canvasInnerHeight === other.canvasInnerHeight
			&& this.canvasOuterWidth === other.canvasOuterWidth
			&& this.canvasOuterHeight === other.canvasOuterHeight
			&& this.isSampling === other.isSampling
			&& this.editorHeight === other.editorHeight
			&& this.fontScale === other.fontScale
			&& this.minimapLineHeight === other.minimapLineHeight
			&& this.minimapCharWidth === other.minimapCharWidth
			&& this.sectionHeaderFontSize === other.sectionHeaderFontSize
			&& this.sectionHeaderLetterSpacing === other.sectionHeaderLetterSpacing
			&& this.defaultBackgroundColor && this.defaultBackgroundColor.equals(other.defaultBackgroundColor)
			&& this.backgroundColor && this.backgroundColor.equals(other.backgroundColor)
			&& this.foregroundAlpha === other.foregroundAlpha
		);
	}
}

class MinimapLayout {

	constructor(
		/**
		 * The given editor scrollTop (input).
		 */
		public readonly scrollTop: number,
		/**
		 * The given editor scrollHeight (input).
		 */
		public readonly scrollHeight: number,
		public readonly sliderNeeded: boolean,
		private readonly _computedSliderRatio: number,
		/**
		 * slider dom node top (in CSS px)
		 */
		public readonly sliderTop: number,
		/**
		 * slider dom node height (in CSS px)
		 */
		public readonly sliderHeight: number,
		/**
		 * empty lines to reserve at the top of the minimap.
		 */
		public readonly topPaddingLineCount: number,
		/**
		 * minimap render start line number.
		 */
		public readonly startLineNumber: number,
		/**
		 * minimap render end line number.
		 */
		public readonly endLineNumber: number
	) { }

	/**
	 * Compute a desired `scrollPosition` such that the slider moves by `delta`.
	 */
	public getDesiredScrollTopFromDelta(delta: number): number {
		return Math.round(this.scrollTop + delta / this._computedSliderRatio);
	}

	public getDesiredScrollTopFromTouchLocation(pageY: number): number {
		return Math.round((pageY - this.sliderHeight / 2) / this._computedSliderRatio);
	}

	/**
	 * Intersect a line range with `this.startLineNumber` and `this.endLineNumber`.
	 */
	public intersectWithViewport(range: Range): [number, number] | null {
		const startLineNumber = Math.max(this.startLineNumber, range.startLineNumber);
		const endLineNumber = Math.min(this.endLineNumber, range.endLineNumber);
		if (startLineNumber > endLineNumber) {
			// entirely outside minimap's viewport
			return null;
		}
		return [startLineNumber, endLineNumber];
	}

	/**
	 * Get the inner minimap y coordinate for a line number.
	 */
	public getYForLineNumber(lineNumber: number, minimapLineHeight: number): number {
		return + (lineNumber - this.startLineNumber + this.topPaddingLineCount) * minimapLineHeight;
	}

	public static create(
		options: MinimapOptions,
		viewportStartLineNumber: number,
		viewportEndLineNumber: number,
		viewportStartLineNumberVerticalOffset: number,
		viewportHeight: number,
		viewportContainsWhitespaceGaps: boolean,
		lineCount: number,
		realLineCount: number,
		scrollTop: number,
		scrollHeight: number,
		previousLayout: MinimapLayout | null
	): MinimapLayout {
		const pixelRatio = options.pixelRatio;
		const minimapLineHeight = options.minimapLineHeight;
		const minimapLinesFitting = Math.floor(options.canvasInnerHeight / minimapLineHeight);
		const lineHeight = options.lineHeight;

		if (options.minimapHeightIsEditorHeight) {
			let logicalScrollHeight = (
				realLineCount * options.lineHeight
				+ options.paddingTop
				+ options.paddingBottom
			);
			if (options.scrollBeyondLastLine) {
				logicalScrollHeight += Math.max(0, viewportHeight - options.lineHeight - options.paddingBottom);
			}
			const sliderHeight = Math.max(1, Math.floor(viewportHeight * viewportHeight / logicalScrollHeight));
			const maxMinimapSliderTop = Math.max(0, options.minimapHeight - sliderHeight);
			// The slider can move from 0 to `maxMinimapSliderTop`
			// in the same way `scrollTop` can move from 0 to `scrollHeight` - `viewportHeight`.
			const computedSliderRatio = (maxMinimapSliderTop) / (scrollHeight - viewportHeight);
			const sliderTop = (scrollTop * computedSliderRatio);
			const sliderNeeded = (maxMinimapSliderTop > 0);
			const maxLinesFitting = Math.floor(options.canvasInnerHeight / options.minimapLineHeight);
			const topPaddingLineCount = Math.floor(options.paddingTop / options.lineHeight);
			return new MinimapLayout(scrollTop, scrollHeight, sliderNeeded, computedSliderRatio, sliderTop, sliderHeight, topPaddingLineCount, 1, Math.min(lineCount, maxLinesFitting));
		}

		// The visible line count in a viewport can change due to a number of reasons:
		//  a) with the same viewport width, different scroll positions can result in partial lines being visible:
		//    e.g. for a line height of 20, and a viewport height of 600
		//          * scrollTop = 0  => visible lines are [1, 30]
		//          * scrollTop = 10 => visible lines are [1, 31] (with lines 1 and 31 partially visible)
		//          * scrollTop = 20 => visible lines are [2, 31]
		//  b) whitespace gaps might make their way in the viewport (which results in a decrease in the visible line count)
		//  c) we could be in the scroll beyond last line case (which also results in a decrease in the visible line count, down to possibly only one line being visible)

		// We must first establish a desirable slider height.
		let sliderHeight: number;
		if (viewportContainsWhitespaceGaps && viewportEndLineNumber !== lineCount) {
			// case b) from above: there are whitespace gaps in the viewport.
			// In this case, the height of the slider directly reflects the visible line count.
			const viewportLineCount = viewportEndLineNumber - viewportStartLineNumber + 1;
			sliderHeight = Math.floor(viewportLineCount * minimapLineHeight / pixelRatio);
		} else {
			// The slider has a stable height
			const expectedViewportLineCount = viewportHeight / lineHeight;
			sliderHeight = Math.floor(expectedViewportLineCount * minimapLineHeight / pixelRatio);
		}

		const extraLinesAtTheTop = Math.floor(options.paddingTop / lineHeight);
		let extraLinesAtTheBottom = Math.floor(options.paddingBottom / lineHeight);
		if (options.scrollBeyondLastLine) {
			const expectedViewportLineCount = viewportHeight / lineHeight;
			extraLinesAtTheBottom = Math.max(extraLinesAtTheBottom, expectedViewportLineCount - 1);
		}

		let maxMinimapSliderTop: number;
		if (extraLinesAtTheBottom > 0) {
			const expectedViewportLineCount = viewportHeight / lineHeight;
			// The minimap slider, when dragged all the way down, will contain the last line at its top
			maxMinimapSliderTop = (extraLinesAtTheTop + lineCount + extraLinesAtTheBottom - expectedViewportLineCount - 1) * minimapLineHeight / pixelRatio;
		} else {
			// The minimap slider, when dragged all the way down, will contain the last line at its bottom
			maxMinimapSliderTop = Math.max(0, (extraLinesAtTheTop + lineCount) * minimapLineHeight / pixelRatio - sliderHeight);
		}
		maxMinimapSliderTop = Math.min(options.minimapHeight - sliderHeight, maxMinimapSliderTop);

		// The slider can move from 0 to `maxMinimapSliderTop`
		// in the same way `scrollTop` can move from 0 to `scrollHeight` - `viewportHeight`.
		const computedSliderRatio = (maxMinimapSliderTop) / (scrollHeight - viewportHeight);
		const sliderTop = (scrollTop * computedSliderRatio);

		if (minimapLinesFitting >= extraLinesAtTheTop + lineCount + extraLinesAtTheBottom) {
			// All lines fit in the minimap
			const sliderNeeded = (maxMinimapSliderTop > 0);
			return new MinimapLayout(scrollTop, scrollHeight, sliderNeeded, computedSliderRatio, sliderTop, sliderHeight, extraLinesAtTheTop, 1, lineCount);
		} else {
			let consideringStartLineNumber: number;
			if (viewportStartLineNumber > 1) {
				consideringStartLineNumber = viewportStartLineNumber + extraLinesAtTheTop;
			} else {
				consideringStartLineNumber = Math.max(1, scrollTop / lineHeight);
			}

			let topPaddingLineCount: number;
			let startLineNumber = Math.max(1, Math.floor(consideringStartLineNumber - sliderTop * pixelRatio / minimapLineHeight));
			if (startLineNumber < extraLinesAtTheTop) {
				topPaddingLineCount = extraLinesAtTheTop - startLineNumber + 1;
				startLineNumber = 1;
			} else {
				topPaddingLineCount = 0;
				startLineNumber = Math.max(1, startLineNumber - extraLinesAtTheTop);
			}

			// Avoid flickering caused by a partial viewport start line
			// by being consistent w.r.t. the previous layout decision
			if (previousLayout && previousLayout.scrollHeight === scrollHeight) {
				if (previousLayout.scrollTop > scrollTop) {
					// Scrolling up => never increase `startLineNumber`
					startLineNumber = Math.min(startLineNumber, previousLayout.startLineNumber);
					topPaddingLineCount = Math.max(topPaddingLineCount, previousLayout.topPaddingLineCount);
				}
				if (previousLayout.scrollTop < scrollTop) {
					// Scrolling down => never decrease `startLineNumber`
					startLineNumber = Math.max(startLineNumber, previousLayout.startLineNumber);
					topPaddingLineCount = Math.min(topPaddingLineCount, previousLayout.topPaddingLineCount);
				}
			}

			const endLineNumber = Math.min(lineCount, startLineNumber - topPaddingLineCount + minimapLinesFitting - 1);
			const partialLine = (scrollTop - viewportStartLineNumberVerticalOffset) / lineHeight;

			let sliderTopAligned: number;
			if (scrollTop >= options.paddingTop) {
				sliderTopAligned = (viewportStartLineNumber - startLineNumber + topPaddingLineCount + partialLine) * minimapLineHeight / pixelRatio;
			} else {
				sliderTopAligned = (scrollTop / options.paddingTop) * (topPaddingLineCount + partialLine) * minimapLineHeight / pixelRatio;
			}

			return new MinimapLayout(scrollTop, scrollHeight, true, computedSliderRatio, sliderTopAligned, sliderHeight, topPaddingLineCount, startLineNumber, endLineNumber);
		}
	}
}

class MinimapLine implements ILine {

	public static readonly INVALID = new MinimapLine(-1);

	dy: number;

	constructor(dy: number) {
		this.dy = dy;
	}

	public onContentChanged(): void {
		this.dy = -1;
	}

	public onTokensChanged(): void {
		this.dy = -1;
	}
}

class RenderData {
	/**
	 * last rendered layout.
	 */
	public readonly renderedLayout: MinimapLayout;
	private readonly _imageData: ImageData;
	private readonly _renderedLines: RenderedLinesCollection<MinimapLine>;

	constructor(
		renderedLayout: MinimapLayout,
		imageData: ImageData,
		lines: MinimapLine[]
	) {
		this.renderedLayout = renderedLayout;
		this._imageData = imageData;
		this._renderedLines = new RenderedLinesCollection({
			createLine: () => MinimapLine.INVALID
		});
		this._renderedLines._set(renderedLayout.startLineNumber, lines);
	}

	/**
	 * Check if the current RenderData matches accurately the new desired layout and no painting is needed.
	 */
	public linesEquals(layout: MinimapLayout): boolean {
		if (!this.scrollEquals(layout)) {
			return false;
		}

		const tmp = this._renderedLines._get();
		const lines = tmp.lines;
		for (let i = 0, len = lines.length; i < len; i++) {
			if (lines[i].dy === -1) {
				// This line is invalid
				return false;
			}
		}

		return true;
	}

	/**
	 * Check if the current RenderData matches the new layout's scroll position
	 */
	public scrollEquals(layout: MinimapLayout): boolean {
		return this.renderedLayout.startLineNumber === layout.startLineNumber
			&& this.renderedLayout.endLineNumber === layout.endLineNumber;
	}

	_get(): { imageData: ImageData; rendLineNumberStart: number; lines: MinimapLine[] } {
		const tmp = this._renderedLines._get();
		return {
			imageData: this._imageData,
			rendLineNumberStart: tmp.rendLineNumberStart,
			lines: tmp.lines
		};
	}

	public onLinesChanged(changeFromLineNumber: number, changeCount: number): boolean {
		return this._renderedLines.onLinesChanged(changeFromLineNumber, changeCount);
	}
	public onLinesDeleted(deleteFromLineNumber: number, deleteToLineNumber: number): void {
		this._renderedLines.onLinesDeleted(deleteFromLineNumber, deleteToLineNumber);
	}
	public onLinesInserted(insertFromLineNumber: number, insertToLineNumber: number): void {
		this._renderedLines.onLinesInserted(insertFromLineNumber, insertToLineNumber);
	}
	public onTokensChanged(ranges: { fromLineNumber: number; toLineNumber: number }[]): boolean {
		return this._renderedLines.onTokensChanged(ranges);
	}
}

/**
 * Some sort of double buffering.
 *
 * Keeps two buffers around that will be rotated for painting.
 * Always gives a buffer that is filled with the background color.
 */
class MinimapBuffers {

	private readonly _backgroundFillData: Uint8ClampedArray;
	private readonly _buffers: [ImageData, ImageData];
	private _lastUsedBuffer: number;

	constructor(ctx: CanvasRenderingContext2D, WIDTH: number, HEIGHT: number, background: RGBA8) {
		this._backgroundFillData = MinimapBuffers._createBackgroundFillData(WIDTH, HEIGHT, background);
		this._buffers = [
			ctx.createImageData(WIDTH, HEIGHT),
			ctx.createImageData(WIDTH, HEIGHT)
		];
		this._lastUsedBuffer = 0;
	}

	public getBuffer(): ImageData {
		// rotate buffers
		this._lastUsedBuffer = 1 - this._lastUsedBuffer;
		const result = this._buffers[this._lastUsedBuffer];

		// fill with background color
		result.data.set(this._backgroundFillData);

		return result;
	}

	private static _createBackgroundFillData(WIDTH: number, HEIGHT: number, background: RGBA8): Uint8ClampedArray {
		const backgroundR = background.r;
		const backgroundG = background.g;
		const backgroundB = background.b;
		const backgroundA = background.a;

		const result = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
		let offset = 0;
		for (let i = 0; i < HEIGHT; i++) {
			for (let j = 0; j < WIDTH; j++) {
				result[offset] = backgroundR;
				result[offset + 1] = backgroundG;
				result[offset + 2] = backgroundB;
				result[offset + 3] = backgroundA;
				offset += 4;
			}
		}

		return result;
	}
}

export interface IMinimapModel {
	readonly tokensColorTracker: MinimapTokensColorTracker;
	readonly options: MinimapOptions;

	getLineCount(): number;
	getRealLineCount(): number;
	getLineContent(lineNumber: number): string;
	getLineMaxColumn(lineNumber: number): number;
	getMinimapLinesRenderingData(startLineNumber: number, endLineNumber: number, needed: boolean[]): (ViewLineData | null)[];
	getSelections(): Selection[];
	getMinimapDecorationsInViewport(startLineNumber: number, endLineNumber: number): ViewModelDecoration[];
	getSectionHeaderDecorationsInViewport(startLineNumber: number, endLineNumber: number): ViewModelDecoration[];
	getSectionHeaderText(decoration: ViewModelDecoration, fitWidth: (s: string) => string): string | null;
	getOptions(): TextModelResolvedOptions;
	revealLineNumber(lineNumber: number): void;
	setScrollTop(scrollTop: number): void;
}

interface IMinimapRenderingContext {
	readonly viewportContainsWhitespaceGaps: boolean;

	readonly scrollWidth: number;
	readonly scrollHeight: number;

	readonly viewportStartLineNumber: number;
	readonly viewportEndLineNumber: number;
	readonly viewportStartLineNumberVerticalOffset: number;

	readonly scrollTop: number;
	readonly scrollLeft: number;

	readonly viewportWidth: number;
	readonly viewportHeight: number;
}

interface SamplingStateLinesDeletedEvent {
	type: 'deleted';
	_oldIndex: number;
	deleteFromLineNumber: number;
	deleteToLineNumber: number;
}

interface SamplingStateLinesInsertedEvent {
	type: 'inserted';
	_i: number;
	insertFromLineNumber: number;
	insertToLineNumber: number;
}

interface SamplingStateFlushEvent {
	type: 'flush';
}

type SamplingStateEvent = SamplingStateLinesInsertedEvent | SamplingStateLinesDeletedEvent | SamplingStateFlushEvent;

class MinimapSamplingState {

	public static compute(options: MinimapOptions, viewLineCount: number, oldSamplingState: MinimapSamplingState | null): [MinimapSamplingState | null, SamplingStateEvent[]] {
		if (options.renderMinimap === RenderMinimap.None || !options.isSampling) {
			return [null, []];
		}

		// ratio is intentionally not part of the layout to avoid the layout changing all the time
		// so we need to recompute it again...
		const { minimapLineCount } = EditorLayoutInfoComputer.computeContainedMinimapLineCount({
			viewLineCount: viewLineCount,
			scrollBeyondLastLine: options.scrollBeyondLastLine,
			paddingTop: options.paddingTop,
			paddingBottom: options.paddingBottom,
			height: options.editorHeight,
			lineHeight: options.lineHeight,
			pixelRatio: options.pixelRatio
		});
		const ratio = viewLineCount / minimapLineCount;
		const halfRatio = ratio / 2;

		if (!oldSamplingState || oldSamplingState.minimapLines.length === 0) {
			const result: number[] = [];
			result[0] = 1;
			if (minimapLineCount > 1) {
				for (let i = 0, lastIndex = minimapLineCount - 1; i < lastIndex; i++) {
					result[i] = Math.round(i * ratio + halfRatio);
				}
				result[minimapLineCount - 1] = viewLineCount;
			}
			return [new MinimapSamplingState(ratio, result), []];
		}

		const oldMinimapLines = oldSamplingState.minimapLines;
		const oldLength = oldMinimapLines.length;
		const result: number[] = [];
		let oldIndex = 0;
		let oldDeltaLineCount = 0;
		let minViewLineNumber = 1;
		const MAX_EVENT_COUNT = 10; // generate at most 10 events, if there are more than 10 changes, just flush all previous data
		let events: SamplingStateEvent[] = [];
		let lastEvent: SamplingStateEvent | null = null;
		for (let i = 0; i < minimapLineCount; i++) {
			const fromViewLineNumber = Math.max(minViewLineNumber, Math.round(i * ratio));
			const toViewLineNumber = Math.max(fromViewLineNumber, Math.round((i + 1) * ratio));

			while (oldIndex < oldLength && oldMinimapLines[oldIndex] < fromViewLineNumber) {
				if (events.length < MAX_EVENT_COUNT) {
					const oldMinimapLineNumber = oldIndex + 1 + oldDeltaLineCount;
					if (lastEvent && lastEvent.type === 'deleted' && lastEvent._oldIndex === oldIndex - 1) {
						lastEvent.deleteToLineNumber++;
					} else {
						lastEvent = { type: 'deleted', _oldIndex: oldIndex, deleteFromLineNumber: oldMinimapLineNumber, deleteToLineNumber: oldMinimapLineNumber };
						events.push(lastEvent);
					}
					oldDeltaLineCount--;
				}
				oldIndex++;
			}

			let selectedViewLineNumber: number;
			if (oldIndex < oldLength && oldMinimapLines[oldIndex] <= toViewLineNumber) {
				// reuse the old sampled line
				selectedViewLineNumber = oldMinimapLines[oldIndex];
				oldIndex++;
			} else {
				if (i === 0) {
					selectedViewLineNumber = 1;
				} else if (i + 1 === minimapLineCount) {
					selectedViewLineNumber = viewLineCount;
				} else {
					selectedViewLineNumber = Math.round(i * ratio + halfRatio);
				}
				if (events.length < MAX_EVENT_COUNT) {
					const oldMinimapLineNumber = oldIndex + 1 + oldDeltaLineCount;
					if (lastEvent && lastEvent.type === 'inserted' && lastEvent._i === i - 1) {
						lastEvent.insertToLineNumber++;
					} else {
						lastEvent = { type: 'inserted', _i: i, insertFromLineNumber: oldMinimapLineNumber, insertToLineNumber: oldMinimapLineNumber };
						events.push(lastEvent);
					}
					oldDeltaLineCount++;
				}
			}

			result[i] = selectedViewLineNumber;
			minViewLineNumber = selectedViewLineNumber;
		}

		if (events.length < MAX_EVENT_COUNT) {
			while (oldIndex < oldLength) {
				const oldMinimapLineNumber = oldIndex + 1 + oldDeltaLineCount;
				if (lastEvent && lastEvent.type === 'deleted' && lastEvent._oldIndex === oldIndex - 1) {
					lastEvent.deleteToLineNumber++;
				} else {
					lastEvent = { type: 'deleted', _oldIndex: oldIndex, deleteFromLineNumber: oldMinimapLineNumber, deleteToLineNumber: oldMinimapLineNumber };
					events.push(lastEvent);
				}
				oldDeltaLineCount--;
				oldIndex++;
			}
		} else {
			// too many events, just give up
			events = [{ type: 'flush' }];
		}

		return [new MinimapSamplingState(ratio, result), events];
	}

	constructor(
		public readonly samplingRatio: number,
		public readonly minimapLines: number[]	// a map of 0-based minimap line indexes to 1-based view line numbers
	) {
	}

	public modelLineToMinimapLine(lineNumber: number): number {
		return Math.min(this.minimapLines.length, Math.max(1, Math.round(lineNumber / this.samplingRatio)));
	}

	/**
	 * Will return null if the model line ranges are not intersecting with a sampled model line.
	 */
	public modelLineRangeToMinimapLineRange(fromLineNumber: number, toLineNumber: number): [number, number] | null {
		let fromLineIndex = this.modelLineToMinimapLine(fromLineNumber) - 1;
		while (fromLineIndex > 0 && this.minimapLines[fromLineIndex - 1] >= fromLineNumber) {
			fromLineIndex--;
		}
		let toLineIndex = this.modelLineToMinimapLine(toLineNumber) - 1;
		while (toLineIndex + 1 < this.minimapLines.length && this.minimapLines[toLineIndex + 1] <= toLineNumber) {
			toLineIndex++;
		}
		if (fromLineIndex === toLineIndex) {
			const sampledLineNumber = this.minimapLines[fromLineIndex];
			if (sampledLineNumber < fromLineNumber || sampledLineNumber > toLineNumber) {
				// This line is not part of the sampled lines ==> nothing to do
				return null;
			}
		}
		return [fromLineIndex + 1, toLineIndex + 1];
	}

	/**
	 * Will always return a range, even if it is not intersecting with a sampled model line.
	 */
	public decorationLineRangeToMinimapLineRange(startLineNumber: number, endLineNumber: number): [number, number] {
		let minimapLineStart = this.modelLineToMinimapLine(startLineNumber);
		let minimapLineEnd = this.modelLineToMinimapLine(endLineNumber);
		if (startLineNumber !== endLineNumber && minimapLineEnd === minimapLineStart) {
			if (minimapLineEnd === this.minimapLines.length) {
				if (minimapLineStart > 1) {
					minimapLineStart--;
				}
			} else {
				minimapLineEnd++;
			}
		}
		return [minimapLineStart, minimapLineEnd];
	}

	public onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): [number, number] {
		// have the mapping be sticky
		const deletedLineCount = e.toLineNumber - e.fromLineNumber + 1;
		let changeStartIndex = this.minimapLines.length;
		let changeEndIndex = 0;
		for (let i = this.minimapLines.length - 1; i >= 0; i--) {
			if (this.minimapLines[i] < e.fromLineNumber) {
				break;
			}
			if (this.minimapLines[i] <= e.toLineNumber) {
				// this line got deleted => move to previous available
				this.minimapLines[i] = Math.max(1, e.fromLineNumber - 1);
				changeStartIndex = Math.min(changeStartIndex, i);
				changeEndIndex = Math.max(changeEndIndex, i);
			} else {
				this.minimapLines[i] -= deletedLineCount;
			}
		}
		return [changeStartIndex, changeEndIndex];
	}

	public onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): void {
		// have the mapping be sticky
		const insertedLineCount = e.toLineNumber - e.fromLineNumber + 1;
		for (let i = this.minimapLines.length - 1; i >= 0; i--) {
			if (this.minimapLines[i] < e.fromLineNumber) {
				break;
			}
			this.minimapLines[i] += insertedLineCount;
		}
	}
}

/**
 * The minimap appears beside the editor scroll bar and visualizes a zoomed out
 * view of the file.
 */
export class Minimap extends ViewPart implements IMinimapModel {

	public readonly tokensColorTracker: MinimapTokensColorTracker;

	private _selections: Selection[];
	private _minimapSelections: Selection[] | null;

	public options: MinimapOptions;

	private _samplingState: MinimapSamplingState | null;
	private _shouldCheckSampling: boolean;

	private _sectionHeaderCache = new LRUCache<string, string>(10, 1.5);

	private _actual: InnerMinimap;

	constructor(context: ViewContext) {
		super(context);

		this.tokensColorTracker = MinimapTokensColorTracker.getInstance();

		this._selections = [];
		this._minimapSelections = null;

		this.options = new MinimapOptions(this._context.configuration, this._context.theme, this.tokensColorTracker);
		const [samplingState,] = MinimapSamplingState.compute(this.options, this._context.viewModel.getLineCount(), null);
		this._samplingState = samplingState;
		this._shouldCheckSampling = false;

		this._actual = new InnerMinimap(context.theme, this);
	}

	public override dispose(): void {
		this._actual.dispose();
		super.dispose();
	}

	public getDomNode(): FastDomNode<HTMLElement> {
		return this._actual.getDomNode();
	}

	private _onOptionsMaybeChanged(): boolean {
		const opts = new MinimapOptions(this._context.configuration, this._context.theme, this.tokensColorTracker);
		if (this.options.equals(opts)) {
			return false;
		}
		this.options = opts;
		this._recreateLineSampling();
		this._actual.onDidChangeOptions();
		return true;
	}

	// ---- begin view event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		return this._onOptionsMaybeChanged();
	}
	public override onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean {
		this._selections = e.selections;
		this._minimapSelections = null;
		return this._actual.onSelectionChanged();
	}
	public override onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean {
		if (e.affectsMinimap) {
			return this._actual.onDecorationsChanged();
		}
		return false;
	}
	public override onFlushed(e: viewEvents.ViewFlushedEvent): boolean {
		if (this._samplingState) {
			this._shouldCheckSampling = true;
		}
		return this._actual.onFlushed();
	}
	public override onLinesChanged(e: viewEvents.ViewLinesChangedEvent): boolean {
		if (this._samplingState) {
			const minimapLineRange = this._samplingState.modelLineRangeToMinimapLineRange(e.fromLineNumber, e.fromLineNumber + e.count - 1);
			if (minimapLineRange) {
				return this._actual.onLinesChanged(minimapLineRange[0], minimapLineRange[1] - minimapLineRange[0] + 1);
			} else {
				return false;
			}
		} else {
			return this._actual.onLinesChanged(e.fromLineNumber, e.count);
		}
	}
	public override onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean {
		if (this._samplingState) {
			const [changeStartIndex, changeEndIndex] = this._samplingState.onLinesDeleted(e);
			if (changeStartIndex <= changeEndIndex) {
				this._actual.onLinesChanged(changeStartIndex + 1, changeEndIndex - changeStartIndex + 1);
			}
			this._shouldCheckSampling = true;
			return true;
		} else {
			return this._actual.onLinesDeleted(e.fromLineNumber, e.toLineNumber);
		}
	}
	public override onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean {
		if (this._samplingState) {
			this._samplingState.onLinesInserted(e);
			this._shouldCheckSampling = true;
			return true;
		} else {
			return this._actual.onLinesInserted(e.fromLineNumber, e.toLineNumber);
		}
	}
	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return this._actual.onScrollChanged(e);
	}
	public override onThemeChanged(e: viewEvents.ViewThemeChangedEvent): boolean {
		this._actual.onThemeChanged();
		this._onOptionsMaybeChanged();
		return true;
	}
	public override onTokensChanged(e: viewEvents.ViewTokensChangedEvent): boolean {
		if (this._samplingState) {
			const ranges: { fromLineNumber: number; toLineNumber: number }[] = [];
			for (const range of e.ranges) {
				const minimapLineRange = this._samplingState.modelLineRangeToMinimapLineRange(range.fromLineNumber, range.toLineNumber);
				if (minimapLineRange) {
					ranges.push({ fromLineNumber: minimapLineRange[0], toLineNumber: minimapLineRange[1] });
				}
			}
			if (ranges.length) {
				return this._actual.onTokensChanged(ranges);
			} else {
				return false;
			}
		} else {
			return this._actual.onTokensChanged(e.ranges);
		}
	}
	public override onTokensColorsChanged(e: viewEvents.ViewTokensColorsChangedEvent): boolean {
		this._onOptionsMaybeChanged();
		return this._actual.onTokensColorsChanged();
	}
	public override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		return this._actual.onZonesChanged();
	}

	// --- end event handlers

	public prepareRender(ctx: RenderingContext): void {
		if (this._shouldCheckSampling) {
			this._shouldCheckSampling = false;
			this._recreateLineSampling();
		}
	}

	public render(ctx: RestrictedRenderingContext): void {
		let viewportStartLineNumber = ctx.visibleRange.startLineNumber;
		let viewportEndLineNumber = ctx.visibleRange.endLineNumber;

		if (this._samplingState) {
			viewportStartLineNumber = this._samplingState.modelLineToMinimapLine(viewportStartLineNumber);
			viewportEndLineNumber = this._samplingState.modelLineToMinimapLine(viewportEndLineNumber);
		}

		const minimapCtx: IMinimapRenderingContext = {
			viewportContainsWhitespaceGaps: (ctx.viewportData.whitespaceViewportData.length > 0),

			scrollWidth: ctx.scrollWidth,
			scrollHeight: ctx.scrollHeight,

			viewportStartLineNumber: viewportStartLineNumber,
			viewportEndLineNumber: viewportEndLineNumber,
			viewportStartLineNumberVerticalOffset: ctx.getVerticalOffsetForLineNumber(viewportStartLineNumber),

			scrollTop: ctx.scrollTop,
			scrollLeft: ctx.scrollLeft,

			viewportWidth: ctx.viewportWidth,
			viewportHeight: ctx.viewportHeight,
		};
		this._actual.render(minimapCtx);
	}

	//#region IMinimapModel

	private _recreateLineSampling(): void {
		this._minimapSelections = null;

		const wasSampling = Boolean(this._samplingState);
		const [samplingState, events] = MinimapSamplingState.compute(this.options, this._context.viewModel.getLineCount(), this._samplingState);
		this._samplingState = samplingState;

		if (wasSampling && this._samplingState) {
			// was sampling, is sampling
			for (const event of events) {
				switch (event.type) {
					case 'deleted':
						this._actual.onLinesDeleted(event.deleteFromLineNumber, event.deleteToLineNumber);
						break;
					case 'inserted':
						this._actual.onLinesInserted(event.insertFromLineNumber, event.insertToLineNumber);
						break;
					case 'flush':
						this._actual.onFlushed();
						break;
				}
			}
		}
	}

	public getLineCount(): number {
		if (this._samplingState) {
			return this._samplingState.minimapLines.length;
		}
		return this._context.viewModel.getLineCount();
	}

	public getRealLineCount(): number {
		return this._context.viewModel.getLineCount();
	}

	public getLineContent(lineNumber: number): string {
		if (this._samplingState) {
			return this._context.viewModel.getLineContent(this._samplingState.minimapLines[lineNumber - 1]);
		}
		return this._context.viewModel.getLineContent(lineNumber);
	}

	public getLineMaxColumn(lineNumber: number): number {
		if (this._samplingState) {
			return this._context.viewModel.getLineMaxColumn(this._samplingState.minimapLines[lineNumber - 1]);
		}
		return this._context.viewModel.getLineMaxColumn(lineNumber);
	}

	public getMinimapLinesRenderingData(startLineNumber: number, endLineNumber: number, needed: boolean[]): (ViewLineData | null)[] {
		if (this._samplingState) {
			const result: (ViewLineData | null)[] = [];
			for (let lineIndex = 0, lineCount = endLineNumber - startLineNumber + 1; lineIndex < lineCount; lineIndex++) {
				if (needed[lineIndex]) {
					result[lineIndex] = this._context.viewModel.getViewLineData(this._samplingState.minimapLines[startLineNumber + lineIndex - 1]);
				} else {
					result[lineIndex] = null;
				}
			}
			return result;
		}
		return this._context.viewModel.getMinimapLinesRenderingData(startLineNumber, endLineNumber, needed).data;
	}

	public getSelections(): Selection[] {
		if (this._minimapSelections === null) {
			if (this._samplingState) {
				this._minimapSelections = [];
				for (const selection of this._selections) {
					const [minimapLineStart, minimapLineEnd] = this._samplingState.decorationLineRangeToMinimapLineRange(selection.startLineNumber, selection.endLineNumber);
					this._minimapSelections.push(new Selection(minimapLineStart, selection.startColumn, minimapLineEnd, selection.endColumn));
				}
			} else {
				this._minimapSelections = this._selections;
			}
		}
		return this._minimapSelections;
	}

	public getMinimapDecorationsInViewport(startLineNumber: number, endLineNumber: number): ViewModelDecoration[] {
		return this._getMinimapDecorationsInViewport(startLineNumber, endLineNumber)
			.filter(decoration => !decoration.options.minimap?.sectionHeaderStyle);
	}

	public getSectionHeaderDecorationsInViewport(startLineNumber: number, endLineNumber: number): ViewModelDecoration[] {
		const headerHeightInMinimapLines = this.options.sectionHeaderFontSize / this.options.minimapLineHeight;
		startLineNumber = Math.floor(Math.max(1, startLineNumber - headerHeightInMinimapLines));
		return this._getMinimapDecorationsInViewport(startLineNumber, endLineNumber)
			.filter(decoration => !!decoration.options.minimap?.sectionHeaderStyle);
	}

	private _getMinimapDecorationsInViewport(startLineNumber: number, endLineNumber: number) {
		let visibleRange: Range;
		if (this._samplingState) {
			const modelStartLineNumber = this._samplingState.minimapLines[startLineNumber - 1];
			const modelEndLineNumber = this._samplingState.minimapLines[endLineNumber - 1];
			visibleRange = new Range(modelStartLineNumber, 1, modelEndLineNumber, this._context.viewModel.getLineMaxColumn(modelEndLineNumber));
		} else {
			visibleRange = new Range(startLineNumber, 1, endLineNumber, this._context.viewModel.getLineMaxColumn(endLineNumber));
		}
		const decorations = this._context.viewModel.getMinimapDecorationsInRange(visibleRange);

		if (this._samplingState) {
			const result: ViewModelDecoration[] = [];
			for (const decoration of decorations) {
				if (!decoration.options.minimap) {
					continue;
				}
				const range = decoration.range;
				const minimapStartLineNumber = this._samplingState.modelLineToMinimapLine(range.startLineNumber);
				const minimapEndLineNumber = this._samplingState.modelLineToMinimapLine(range.endLineNumber);
				result.push(new ViewModelDecoration(new Range(minimapStartLineNumber, range.startColumn, minimapEndLineNumber, range.endColumn), decoration.options));
			}
			return result;
		}

		return decorations;
	}

	public getSectionHeaderText(decoration: ViewModelDecoration, fitWidth: (s: string) => string): string | null {
		const headerText = decoration.options.minimap?.sectionHeaderText;
		if (!headerText) {
			return null;
		}
		const cachedText = this._sectionHeaderCache.get(headerText);
		if (cachedText) {
			return cachedText;
		}
		const fittedText = fitWidth(headerText);
		this._sectionHeaderCache.set(headerText, fittedText);
		return fittedText;
	}

	public getOptions(): TextModelResolvedOptions {
		return this._context.viewModel.model.getOptions();
	}

	public revealLineNumber(lineNumber: number): void {
		if (this._samplingState) {
			lineNumber = this._samplingState.minimapLines[lineNumber - 1];
		}
		this._context.viewModel.revealRange(
			'mouse',
			false,
			new Range(lineNumber, 1, lineNumber, 1),
			viewEvents.VerticalRevealType.Center,
			ScrollType.Smooth
		);
	}

	public setScrollTop(scrollTop: number): void {
		this._context.viewModel.viewLayout.setScrollPosition({
			scrollTop: scrollTop
		}, ScrollType.Immediate);
	}

	//#endregion
}

class InnerMinimap extends Disposable {

	private readonly _theme: EditorTheme;
	private readonly _model: IMinimapModel;

	private readonly _domNode: FastDomNode<HTMLElement>;
	private readonly _shadow: FastDomNode<HTMLElement>;
	private readonly _canvas: FastDomNode<HTMLCanvasElement>;
	private readonly _decorationsCanvas: FastDomNode<HTMLCanvasElement>;
	private readonly _slider: FastDomNode<HTMLElement>;
	private readonly _sliderHorizontal: FastDomNode<HTMLElement>;
	private readonly _pointerDownListener: IDisposable;
	private readonly _sliderPointerMoveMonitor: GlobalPointerMoveMonitor;
	private readonly _sliderPointerDownListener: IDisposable;
	private readonly _gestureDisposable: IDisposable;
	private readonly _sliderTouchStartListener: IDisposable;
	private readonly _sliderTouchMoveListener: IDisposable;
	private readonly _sliderTouchEndListener: IDisposable;

	private _lastRenderData: RenderData | null;
	private _selectionColor: Color | undefined;
	private _renderDecorations: boolean = false;
	private _gestureInProgress: boolean = false;
	private _buffers: MinimapBuffers | null;
	private _isMouseOverMinimap: boolean = false;
	private _hideDelayedScheduler: RunOnceScheduler;

	constructor(
		theme: EditorTheme,
		model: IMinimapModel
	) {
		super();

		this._theme = theme;
		this._model = model;

		this._lastRenderData = null;
		this._buffers = null;
		this._selectionColor = this._theme.getColor(minimapSelection);

		this._domNode = createFastDomNode(document.createElement('div'));
		PartFingerprints.write(this._domNode, PartFingerprint.Minimap);
		this._domNode.setClassName(this._getMinimapDomNodeClassName());
		this._domNode.setPosition('absolute');
		this._domNode.setAttribute('role', 'presentation');
		this._domNode.setAttribute('aria-hidden', 'true');

		this._shadow = createFastDomNode(document.createElement('div'));
		this._shadow.setClassName('minimap-shadow-hidden');
		this._domNode.appendChild(this._shadow);

		this._canvas = createFastDomNode(document.createElement('canvas'));
		this._canvas.setPosition('absolute');
		this._canvas.setLeft(0);
		this._domNode.appendChild(this._canvas);

		this._decorationsCanvas = createFastDomNode(document.createElement('canvas'));
		this._decorationsCanvas.setPosition('absolute');
		this._decorationsCanvas.setClassName('minimap-decorations-layer');
		this._decorationsCanvas.setLeft(0);
		this._domNode.appendChild(this._decorationsCanvas);

		this._slider = createFastDomNode(document.createElement('div'));
		this._slider.setPosition('absolute');
		this._slider.setClassName('minimap-slider');
		this._slider.setLayerHinting(true);
		this._slider.setContain('strict');
		this._domNode.appendChild(this._slider);

		this._sliderHorizontal = createFastDomNode(document.createElement('div'));
		this._sliderHorizontal.setPosition('absolute');
		this._sliderHorizontal.setClassName('minimap-slider-horizontal');
		this._slider.appendChild(this._sliderHorizontal);

		this._applyLayout();

		this._hideDelayedScheduler = this._register(new RunOnceScheduler(() => this._hideImmediatelyIfMouseIsOutside(), 500));

		this._register(dom.addStandardDisposableListener(this._domNode.domNode, dom.EventType.MOUSE_OVER, () => {
			this._isMouseOverMinimap = true;
		}));
		this._register(dom.addStandardDisposableListener(this._domNode.domNode, dom.EventType.MOUSE_LEAVE, () => {
			this._isMouseOverMinimap = false;
		}));

		this._pointerDownListener = dom.addStandardDisposableListener(this._domNode.domNode, dom.EventType.POINTER_DOWN, (e) => {
			e.preventDefault();

			const isMouse = (e.pointerType === 'mouse');
			const isLeftClick = (e.button === 0);

			const renderMinimap = this._model.options.renderMinimap;
			if (renderMinimap === RenderMinimap.None) {
				return;
			}
			if (!this._lastRenderData) {
				return;
			}
			if (this._model.options.size !== 'proportional') {
				if (isLeftClick && this._lastRenderData) {
					// pretend the click occurred in the center of the slider
					const position = dom.getDomNodePagePosition(this._slider.domNode);
					const initialPosY = position.top + position.height / 2;
					this._startSliderDragging(e, initialPosY, this._lastRenderData.renderedLayout);
				}
				return;
			}

			if (isLeftClick || !isMouse) {
				const minimapLineHeight = this._model.options.minimapLineHeight;
				const internalOffsetY = (this._model.options.canvasInnerHeight / this._model.options.canvasOuterHeight) * e.offsetY;
				const lineIndex = Math.floor(internalOffsetY / minimapLineHeight);

				let lineNumber = lineIndex + this._lastRenderData.renderedLayout.startLineNumber - this._lastRenderData.renderedLayout.topPaddingLineCount;
				lineNumber = Math.min(lineNumber, this._model.getLineCount());

				this._model.revealLineNumber(lineNumber);
			}
		});

		this._sliderPointerMoveMonitor = new GlobalPointerMoveMonitor();

		this._sliderPointerDownListener = dom.addStandardDisposableListener(this._slider.domNode, dom.EventType.POINTER_DOWN, (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (e.button === 0 && this._lastRenderData) {
				this._startSliderDragging(e, e.pageY, this._lastRenderData.renderedLayout);
			}
		});

		this._gestureDisposable = Gesture.addTarget(this._domNode.domNode);
		this._sliderTouchStartListener = dom.addDisposableListener(this._domNode.domNode, EventType.Start, (e: GestureEvent) => {
			e.preventDefault();
			e.stopPropagation();
			if (this._lastRenderData) {
				this._slider.toggleClassName('active', true);
				this._gestureInProgress = true;
				this.scrollDueToTouchEvent(e);
			}
		}, { passive: false });

		this._sliderTouchMoveListener = dom.addDisposableListener(this._domNode.domNode, EventType.Change, (e: GestureEvent) => {
			e.preventDefault();
			e.stopPropagation();
			if (this._lastRenderData && this._gestureInProgress) {
				this.scrollDueToTouchEvent(e);
			}
		}, { passive: false });

		this._sliderTouchEndListener = dom.addStandardDisposableListener(this._domNode.domNode, EventType.End, (e: GestureEvent) => {
			e.preventDefault();
			e.stopPropagation();
			this._gestureInProgress = false;
			this._slider.toggleClassName('active', false);
		});
	}

	private _hideSoon() {
		this._hideDelayedScheduler.cancel();
		this._hideDelayedScheduler.schedule();
	}

	private _hideImmediatelyIfMouseIsOutside() {
		if (this._isMouseOverMinimap) {
			this._hideSoon();
			return;
		}
		this._domNode.toggleClassName('active', false);
	}

	private _startSliderDragging(e: PointerEvent, initialPosY: number, initialSliderState: MinimapLayout): void {
		if (!e.target || !(e.target instanceof Element)) {
			return;
		}
		const initialPosX = e.pageX;

		this._slider.toggleClassName('active', true);

		const handlePointerMove = (posy: number, posx: number) => {
			const minimapPosition = dom.getDomNodePagePosition(this._domNode.domNode);
			const pointerOrthogonalDelta = Math.min(
				Math.abs(posx - initialPosX),
				Math.abs(posx - minimapPosition.left),
				Math.abs(posx - minimapPosition.left - minimapPosition.width)
			);

			if (platform.isWindows && pointerOrthogonalDelta > POINTER_DRAG_RESET_DISTANCE) {
				// The pointer has wondered away from the scrollbar => reset dragging
				this._model.setScrollTop(initialSliderState.scrollTop);
				return;
			}

			const pointerDelta = posy - initialPosY;
			this._model.setScrollTop(initialSliderState.getDesiredScrollTopFromDelta(pointerDelta));
		};

		if (e.pageY !== initialPosY) {
			handlePointerMove(e.pageY, initialPosX);
		}

		this._sliderPointerMoveMonitor.startMonitoring(
			e.target,
			e.pointerId,
			e.buttons,
			pointerMoveData => handlePointerMove(pointerMoveData.pageY, pointerMoveData.pageX),
			() => {
				this._slider.toggleClassName('active', false);
			}
		);
	}

	private scrollDueToTouchEvent(touch: GestureEvent) {
		const startY = this._domNode.domNode.getBoundingClientRect().top;
		const scrollTop = this._lastRenderData!.renderedLayout.getDesiredScrollTopFromTouchLocation(touch.pageY - startY);
		this._model.setScrollTop(scrollTop);
	}

	public override dispose(): void {
		this._pointerDownListener.dispose();
		this._sliderPointerMoveMonitor.dispose();
		this._sliderPointerDownListener.dispose();
		this._gestureDisposable.dispose();
		this._sliderTouchStartListener.dispose();
		this._sliderTouchMoveListener.dispose();
		this._sliderTouchEndListener.dispose();
		super.dispose();
	}

	private _getMinimapDomNodeClassName(): string {
		const class_ = ['minimap'];
		if (this._model.options.showSlider === 'always') {
			class_.push('slider-always');
		} else {
			class_.push('slider-mouseover');
		}

		if (this._model.options.autohide === 'mouseover') {
			class_.push('minimap-autohide-mouseover');
		} else if (this._model.options.autohide === 'scroll') {
			class_.push('minimap-autohide-scroll');
		}

		return class_.join(' ');
	}

	public getDomNode(): FastDomNode<HTMLElement> {
		return this._domNode;
	}

	private _applyLayout(): void {
		this._domNode.setLeft(this._model.options.minimapLeft);
		this._domNode.setWidth(this._model.options.minimapWidth);
		this._domNode.setHeight(this._model.options.minimapHeight);
		this._shadow.setHeight(this._model.options.minimapHeight);

		this._canvas.setWidth(this._model.options.canvasOuterWidth);
		this._canvas.setHeight(this._model.options.canvasOuterHeight);
		this._canvas.domNode.width = this._model.options.canvasInnerWidth;
		this._canvas.domNode.height = this._model.options.canvasInnerHeight;

		this._decorationsCanvas.setWidth(this._model.options.canvasOuterWidth);
		this._decorationsCanvas.setHeight(this._model.options.canvasOuterHeight);
		this._decorationsCanvas.domNode.width = this._model.options.canvasInnerWidth;
		this._decorationsCanvas.domNode.height = this._model.options.canvasInnerHeight;

		this._slider.setWidth(this._model.options.minimapWidth);
	}

	private _getBuffer(): ImageData | null {
		if (!this._buffers) {
			if (this._model.options.canvasInnerWidth > 0 && this._model.options.canvasInnerHeight > 0) {
				this._buffers = new MinimapBuffers(
					this._canvas.domNode.getContext('2d')!,
					this._model.options.canvasInnerWidth,
					this._model.options.canvasInnerHeight,
					this._model.options.backgroundColor
				);
			}
		}
		return this._buffers ? this._buffers.getBuffer() : null;
	}

	// ---- begin view event handlers

	public onDidChangeOptions(): void {
		this._lastRenderData = null;
		this._buffers = null;
		this._applyLayout();
		this._domNode.setClassName(this._getMinimapDomNodeClassName());
	}
	public onSelectionChanged(): boolean {
		this._renderDecorations = true;
		return true;
	}
	public onDecorationsChanged(): boolean {
		this._renderDecorations = true;
		return true;
	}
	public onFlushed(): boolean {
		this._lastRenderData = null;
		return true;
	}
	public onLinesChanged(changeFromLineNumber: number, changeCount: number): boolean {
		if (this._lastRenderData) {
			return this._lastRenderData.onLinesChanged(changeFromLineNumber, changeCount);
		}
		return false;
	}
	public onLinesDeleted(deleteFromLineNumber: number, deleteToLineNumber: number): boolean {
		this._lastRenderData?.onLinesDeleted(deleteFromLineNumber, deleteToLineNumber);
		return true;
	}
	public onLinesInserted(insertFromLineNumber: number, insertToLineNumber: number): boolean {
		this._lastRenderData?.onLinesInserted(insertFromLineNumber, insertToLineNumber);
		return true;
	}
	public onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		if (this._model.options.autohide === 'scroll' && (e.scrollTopChanged || e.scrollHeightChanged)) {
			this._domNode.toggleClassName('active', true);
			this._hideSoon();
		}
		this._renderDecorations = true;
		return true;
	}
	public onThemeChanged(): boolean {
		this._selectionColor = this._theme.getColor(minimapSelection);
		this._renderDecorations = true;
		return true;
	}
	public onTokensChanged(ranges: { fromLineNumber: number; toLineNumber: number }[]): boolean {
		if (this._lastRenderData) {
			return this._lastRenderData.onTokensChanged(ranges);
		}
		return false;
	}
	public onTokensColorsChanged(): boolean {
		this._lastRenderData = null;
		this._buffers = null;
		return true;
	}
	public onZonesChanged(): boolean {
		this._lastRenderData = null;
		return true;
	}

	// --- end event handlers

	public render(renderingCtx: IMinimapRenderingContext): void {
		const renderMinimap = this._model.options.renderMinimap;
		if (renderMinimap === RenderMinimap.None) {
			this._shadow.setClassName('minimap-shadow-hidden');
			this._sliderHorizontal.setWidth(0);
			this._sliderHorizontal.setHeight(0);
			return;
		}
		if (renderingCtx.scrollLeft + renderingCtx.viewportWidth >= renderingCtx.scrollWidth) {
			this._shadow.setClassName('minimap-shadow-hidden');
		} else {
			this._shadow.setClassName('minimap-shadow-visible');
		}

		const layout = MinimapLayout.create(
			this._model.options,
			renderingCtx.viewportStartLineNumber,
			renderingCtx.viewportEndLineNumber,
			renderingCtx.viewportStartLineNumberVerticalOffset,
			renderingCtx.viewportHeight,
			renderingCtx.viewportContainsWhitespaceGaps,
			this._model.getLineCount(),
			this._model.getRealLineCount(),
			renderingCtx.scrollTop,
			renderingCtx.scrollHeight,
			this._lastRenderData ? this._lastRenderData.renderedLayout : null
		);
		this._slider.setDisplay(layout.sliderNeeded ? 'block' : 'none');
		this._slider.setTop(layout.sliderTop);
		this._slider.setHeight(layout.sliderHeight);

		// Compute horizontal slider coordinates
		this._sliderHorizontal.setLeft(0);
		this._sliderHorizontal.setWidth(this._model.options.minimapWidth);
		this._sliderHorizontal.setTop(0);
		this._sliderHorizontal.setHeight(layout.sliderHeight);

		this.renderDecorations(layout);
		this._lastRenderData = this.renderLines(layout);
	}

	private renderDecorations(layout: MinimapLayout) {
		if (this._renderDecorations) {
			this._renderDecorations = false;
			const selections = this._model.getSelections();
			selections.sort(Range.compareRangesUsingStarts);

			const decorations = this._model.getMinimapDecorationsInViewport(layout.startLineNumber, layout.endLineNumber);
			decorations.sort((a, b) => (a.options.zIndex || 0) - (b.options.zIndex || 0));

			const { canvasInnerWidth, canvasInnerHeight } = this._model.options;
			const minimapLineHeight = this._model.options.minimapLineHeight;
			const minimapCharWidth = this._model.options.minimapCharWidth;
			const tabSize = this._model.getOptions().tabSize;
			const canvasContext = this._decorationsCanvas.domNode.getContext('2d')!;

			canvasContext.clearRect(0, 0, canvasInnerWidth, canvasInnerHeight);

			// We first need to render line highlights and then render decorations on top of those.
			// But we need to pick a single color for each line, and use that as a line highlight.
			// This needs to be the color of the decoration with the highest `zIndex`, but priority
			// is given to the selection.

			const highlightedLines = new ContiguousLineMap<boolean>(layout.startLineNumber, layout.endLineNumber, false);
			this._renderSelectionLineHighlights(canvasContext, selections, highlightedLines, layout, minimapLineHeight);
			this._renderDecorationsLineHighlights(canvasContext, decorations, highlightedLines, layout, minimapLineHeight);

			const lineOffsetMap = new ContiguousLineMap<number[] | null>(layout.startLineNumber, layout.endLineNumber, null);
			this._renderSelectionsHighlights(canvasContext, selections, lineOffsetMap, layout, minimapLineHeight, tabSize, minimapCharWidth, canvasInnerWidth);
			this._renderDecorationsHighlights(canvasContext, decorations, lineOffsetMap, layout, minimapLineHeight, tabSize, minimapCharWidth, canvasInnerWidth);
			this._renderSectionHeaders(layout);
		}
	}

	private _renderSelectionLineHighlights(
		canvasContext: CanvasRenderingContext2D,
		selections: Selection[],
		highlightedLines: ContiguousLineMap<boolean>,
		layout: MinimapLayout,
		minimapLineHeight: number
	): void {
		if (!this._selectionColor || this._selectionColor.isTransparent()) {
			return;
		}

		canvasContext.fillStyle = this._selectionColor.transparent(0.5).toString();

		let y1 = 0;
		let y2 = 0;

		for (const selection of selections) {
			const intersection = layout.intersectWithViewport(selection);
			if (!intersection) {
				// entirely outside minimap's viewport
				continue;
			}
			const [startLineNumber, endLineNumber] = intersection;

			for (let line = startLineNumber; line <= endLineNumber; line++) {
				highlightedLines.set(line, true);
			}

			const yy1 = layout.getYForLineNumber(startLineNumber, minimapLineHeight);
			const yy2 = layout.getYForLineNumber(endLineNumber, minimapLineHeight);

			if (y2 >= yy1) {
				// merge into previous
				y2 = yy2;
			} else {
				if (y2 > y1) {
					// flush
					canvasContext.fillRect(MINIMAP_GUTTER_WIDTH, y1, canvasContext.canvas.width, y2 - y1);
				}
				y1 = yy1;
				y2 = yy2;
			}
		}

		if (y2 > y1) {
			// flush
			canvasContext.fillRect(MINIMAP_GUTTER_WIDTH, y1, canvasContext.canvas.width, y2 - y1);
		}
	}

	private _renderDecorationsLineHighlights(
		canvasContext: CanvasRenderingContext2D,
		decorations: ViewModelDecoration[],
		highlightedLines: ContiguousLineMap<boolean>,
		layout: MinimapLayout,
		minimapLineHeight: number
	): void {

		const highlightColors = new Map<string, string>();

		// Loop backwards to hit first decorations with higher `zIndex`
		for (let i = decorations.length - 1; i >= 0; i--) {
			const decoration = decorations[i];

			const minimapOptions = <ModelDecorationMinimapOptions | null | undefined>decoration.options.minimap;
			if (!minimapOptions || minimapOptions.position !== MinimapPosition.Inline) {
				continue;
			}

			const intersection = layout.intersectWithViewport(decoration.range);
			if (!intersection) {
				// entirely outside minimap's viewport
				continue;
			}
			const [startLineNumber, endLineNumber] = intersection;

			const decorationColor = minimapOptions.getColor(this._theme.value);
			if (!decorationColor || decorationColor.isTransparent()) {
				continue;
			}

			let highlightColor = highlightColors.get(decorationColor.toString());
			if (!highlightColor) {
				highlightColor = decorationColor.transparent(0.5).toString();
				highlightColors.set(decorationColor.toString(), highlightColor);
			}

			canvasContext.fillStyle = highlightColor;
			for (let line = startLineNumber; line <= endLineNumber; line++) {
				if (highlightedLines.has(line)) {
					continue;
				}
				highlightedLines.set(line, true);
				const y = layout.getYForLineNumber(line, minimapLineHeight);
				canvasContext.fillRect(MINIMAP_GUTTER_WIDTH, y, canvasContext.canvas.width, minimapLineHeight);
			}
		}
	}

	private _renderSelectionsHighlights(
		canvasContext: CanvasRenderingContext2D,
		selections: Selection[],
		lineOffsetMap: ContiguousLineMap<number[] | null>,
		layout: MinimapLayout,
		lineHeight: number,
		tabSize: number,
		characterWidth: number,
		canvasInnerWidth: number
	): void {
		if (!this._selectionColor || this._selectionColor.isTransparent()) {
			return;
		}
		for (const selection of selections) {
			const intersection = layout.intersectWithViewport(selection);
			if (!intersection) {
				// entirely outside minimap's viewport
				continue;
			}
			const [startLineNumber, endLineNumber] = intersection;

			for (let line = startLineNumber; line <= endLineNumber; line++) {
				this.renderDecorationOnLine(canvasContext, lineOffsetMap, selection, this._selectionColor, layout, line, lineHeight, lineHeight, tabSize, characterWidth, canvasInnerWidth);
			}
		}
	}

	private _renderDecorationsHighlights(
		canvasContext: CanvasRenderingContext2D,
		decorations: ViewModelDecoration[],
		lineOffsetMap: ContiguousLineMap<number[] | null>,
		layout: MinimapLayout,
		minimapLineHeight: number,
		tabSize: number,
		characterWidth: number,
		canvasInnerWidth: number
	): void {
		// Loop forwards to hit first decorations with lower `zIndex`
		for (const decoration of decorations) {

			const minimapOptions = <ModelDecorationMinimapOptions | null | undefined>decoration.options.minimap;
			if (!minimapOptions) {
				continue;
			}

			const intersection = layout.intersectWithViewport(decoration.range);
			if (!intersection) {
				// entirely outside minimap's viewport
				continue;
			}
			const [startLineNumber, endLineNumber] = intersection;

			const decorationColor = minimapOptions.getColor(this._theme.value);
			if (!decorationColor || decorationColor.isTransparent()) {
				continue;
			}

			for (let line = startLineNumber; line <= endLineNumber; line++) {
				switch (minimapOptions.position) {

					case MinimapPosition.Inline:
						this.renderDecorationOnLine(canvasContext, lineOffsetMap, decoration.range, decorationColor, layout, line, minimapLineHeight, minimapLineHeight, tabSize, characterWidth, canvasInnerWidth);
						continue;

					case MinimapPosition.Gutter: {
						const y = layout.getYForLineNumber(line, minimapLineHeight);
						const x = 2;
						this.renderDecoration(canvasContext, decorationColor, x, y, GUTTER_DECORATION_WIDTH, minimapLineHeight);
						continue;
					}
				}
			}
		}
	}

	private renderDecorationOnLine(
		canvasContext: CanvasRenderingContext2D,
		lineOffsetMap: ContiguousLineMap<number[] | null>,
		decorationRange: Range,
		decorationColor: Color | undefined,
		layout: MinimapLayout,
		lineNumber: number,
		height: number,
		minimapLineHeight: number,
		tabSize: number,
		charWidth: number,
		canvasInnerWidth: number
	): void {
		const y = layout.getYForLineNumber(lineNumber, minimapLineHeight);

		// Skip rendering the line if it's vertically outside our viewport
		if (y + height < 0 || y > this._model.options.canvasInnerHeight) {
			return;
		}

		const { startLineNumber, endLineNumber } = decorationRange;
		const startColumn = (startLineNumber === lineNumber ? decorationRange.startColumn : 1);
		const endColumn = (endLineNumber === lineNumber ? decorationRange.endColumn : this._model.getLineMaxColumn(lineNumber));

		const x1 = this.getXOffsetForPosition(lineOffsetMap, lineNumber, startColumn, tabSize, charWidth, canvasInnerWidth);
		const x2 = this.getXOffsetForPosition(lineOffsetMap, lineNumber, endColumn, tabSize, charWidth, canvasInnerWidth);

		this.renderDecoration(canvasContext, decorationColor, x1, y, x2 - x1, height);
	}

	private getXOffsetForPosition(
		lineOffsetMap: ContiguousLineMap<number[] | null>,
		lineNumber: number,
		column: number,
		tabSize: number,
		charWidth: number,
		canvasInnerWidth: number
	): number {
		if (column === 1) {
			return MINIMAP_GUTTER_WIDTH;
		}

		const minimumXOffset = (column - 1) * charWidth;
		if (minimumXOffset >= canvasInnerWidth) {
			// there is no need to look at actual characters,
			// as this column is certainly after the minimap width
			return canvasInnerWidth;
		}

		// Cache line offset data so that it is only read once per line
		let lineIndexToXOffset = lineOffsetMap.get(lineNumber);
		if (!lineIndexToXOffset) {
			const lineData = this._model.getLineContent(lineNumber);
			lineIndexToXOffset = [MINIMAP_GUTTER_WIDTH];
			let prevx = MINIMAP_GUTTER_WIDTH;
			for (let i = 1; i < lineData.length + 1; i++) {
				const charCode = lineData.charCodeAt(i - 1);
				const dx = charCode === CharCode.Tab
					? tabSize * charWidth
					: strings.isFullWidthCharacter(charCode)
						? 2 * charWidth
						: charWidth;

				const x = prevx + dx;
				if (x >= canvasInnerWidth) {
					// no need to keep on going, as we've hit the canvas width
					lineIndexToXOffset[i] = canvasInnerWidth;
					break;
				}

				lineIndexToXOffset[i] = x;
				prevx = x;
			}

			lineOffsetMap.set(lineNumber, lineIndexToXOffset);
		}

		if (column - 1 < lineIndexToXOffset.length) {
			return lineIndexToXOffset[column - 1];
		}
		// goes over the canvas width
		return canvasInnerWidth;
	}

	private renderDecoration(canvasContext: CanvasRenderingContext2D, decorationColor: Color | undefined, x: number, y: number, width: number, height: number) {
		canvasContext.fillStyle = decorationColor && decorationColor.toString() || '';
		canvasContext.fillRect(x, y, width, height);
	}

	private _renderSectionHeaders(layout: MinimapLayout) {
		const minimapLineHeight = this._model.options.minimapLineHeight;
		const sectionHeaderFontSize = this._model.options.sectionHeaderFontSize;
		const sectionHeaderLetterSpacing = this._model.options.sectionHeaderLetterSpacing;
		const backgroundFillHeight = sectionHeaderFontSize * 1.5;
		const { canvasInnerWidth } = this._model.options;

		const backgroundColor = this._model.options.backgroundColor;
		const backgroundFill = `rgb(${backgroundColor.r} ${backgroundColor.g} ${backgroundColor.b} / .7)`;
		const foregroundColor = this._model.options.sectionHeaderFontColor;
		const foregroundFill = `rgb(${foregroundColor.r} ${foregroundColor.g} ${foregroundColor.b})`;
		const separatorStroke = foregroundFill;

		const canvasContext = this._decorationsCanvas.domNode.getContext('2d')!;
		canvasContext.letterSpacing = sectionHeaderLetterSpacing + 'px';
		canvasContext.font = '500 ' + sectionHeaderFontSize + 'px ' + this._model.options.sectionHeaderFontFamily;
		canvasContext.strokeStyle = separatorStroke;
		canvasContext.lineWidth = 0.4;

		const decorations = this._model.getSectionHeaderDecorationsInViewport(layout.startLineNumber, layout.endLineNumber);
		decorations.sort((a, b) => a.range.startLineNumber - b.range.startLineNumber);

		const fitWidth = InnerMinimap._fitSectionHeader.bind(null, canvasContext,
			canvasInnerWidth - MINIMAP_GUTTER_WIDTH);

		for (const decoration of decorations) {
			const y = layout.getYForLineNumber(decoration.range.startLineNumber, minimapLineHeight) + sectionHeaderFontSize;
			const backgroundFillY = y - sectionHeaderFontSize;
			const separatorY = backgroundFillY + 2;
			const headerText = this._model.getSectionHeaderText(decoration, fitWidth);

			InnerMinimap._renderSectionLabel(
				canvasContext,
				headerText,
				decoration.options.minimap?.sectionHeaderStyle === MinimapSectionHeaderStyle.Underlined,
				backgroundFill,
				foregroundFill,
				canvasInnerWidth,
				backgroundFillY,
				backgroundFillHeight,
				y,
				separatorY);
		}
	}

	private static _fitSectionHeader(
		target: CanvasRenderingContext2D,
		maxWidth: number,
		headerText: string,
	): string {
		if (!headerText) {
			return headerText;
		}

		const ellipsis = '…';
		const width = target.measureText(headerText).width;
		const ellipsisWidth = target.measureText(ellipsis).width;

		if (width <= maxWidth || width <= ellipsisWidth) {
			return headerText;
		}

		const len = headerText.length;
		const averageCharWidth = width / headerText.length;
		const maxCharCount = Math.floor((maxWidth - ellipsisWidth) / averageCharWidth) - 1;

		// Find a halfway point that isn't after whitespace
		let halfCharCount = Math.ceil(maxCharCount / 2);
		while (halfCharCount > 0 && /\s/.test(headerText[halfCharCount - 1])) {
			--halfCharCount;
		}

		// Split with ellipsis
		return headerText.substring(0, halfCharCount)
			+ ellipsis + headerText.substring(len - (maxCharCount - halfCharCount));
	}

	private static _renderSectionLabel(
		target: CanvasRenderingContext2D,
		headerText: string | null,
		hasSeparatorLine: boolean,
		backgroundFill: string,
		foregroundFill: string,
		minimapWidth: number,
		backgroundFillY: number,
		backgroundFillHeight: number,
		textY: number,
		separatorY: number
	): void {
		if (headerText) {
			target.fillStyle = backgroundFill;
			target.fillRect(0, backgroundFillY, minimapWidth, backgroundFillHeight);

			target.fillStyle = foregroundFill;
			target.fillText(headerText, MINIMAP_GUTTER_WIDTH, textY);
		}

		if (hasSeparatorLine) {
			target.beginPath();
			target.moveTo(0, separatorY);
			target.lineTo(minimapWidth, separatorY);
			target.closePath();
			target.stroke();
		}
	}

	private renderLines(layout: MinimapLayout): RenderData | null {
		const startLineNumber = layout.startLineNumber;
		const endLineNumber = layout.endLineNumber;
		const minimapLineHeight = this._model.options.minimapLineHeight;

		// Check if nothing changed w.r.t. lines from last frame
		if (this._lastRenderData && this._lastRenderData.linesEquals(layout)) {
			const _lastData = this._lastRenderData._get();
			// Nice!! Nothing changed from last frame
			return new RenderData(layout, _lastData.imageData, _lastData.lines);
		}

		// Oh well!! We need to repaint some lines...

		const imageData = this._getBuffer();
		if (!imageData) {
			// 0 width or 0 height canvas, nothing to do
			return null;
		}

		// Render untouched lines by using last rendered data.
		const [_dirtyY1, _dirtyY2, needed] = InnerMinimap._renderUntouchedLines(
			imageData,
			layout.topPaddingLineCount,
			startLineNumber,
			endLineNumber,
			minimapLineHeight,
			this._lastRenderData
		);

		// Fetch rendering info from view model for rest of lines that need rendering.
		const lineInfo = this._model.getMinimapLinesRenderingData(startLineNumber, endLineNumber, needed);
		const tabSize = this._model.getOptions().tabSize;
		const defaultBackground = this._model.options.defaultBackgroundColor;
		const background = this._model.options.backgroundColor;
		const foregroundAlpha = this._model.options.foregroundAlpha;
		const tokensColorTracker = this._model.tokensColorTracker;
		const useLighterFont = tokensColorTracker.backgroundIsLight();
		const renderMinimap = this._model.options.renderMinimap;
		const charRenderer = this._model.options.charRenderer();
		const fontScale = this._model.options.fontScale;
		const minimapCharWidth = this._model.options.minimapCharWidth;

		const baseCharHeight = (renderMinimap === RenderMinimap.Text ? Constants.BASE_CHAR_HEIGHT : Constants.BASE_CHAR_HEIGHT + 1);
		const renderMinimapLineHeight = baseCharHeight * fontScale;
		const innerLinePadding = (minimapLineHeight > renderMinimapLineHeight ? Math.floor((minimapLineHeight - renderMinimapLineHeight) / 2) : 0);

		// Render the rest of lines
		const backgroundA = background.a / 255;
		const renderBackground = new RGBA8(
			Math.round((background.r - defaultBackground.r) * backgroundA + defaultBackground.r),
			Math.round((background.g - defaultBackground.g) * backgroundA + defaultBackground.g),
			Math.round((background.b - defaultBackground.b) * backgroundA + defaultBackground.b),
			255
		);
		let dy = layout.topPaddingLineCount * minimapLineHeight;
		const renderedLines: MinimapLine[] = [];
		for (let lineIndex = 0, lineCount = endLineNumber - startLineNumber + 1; lineIndex < lineCount; lineIndex++) {
			if (needed[lineIndex]) {
				InnerMinimap._renderLine(
					imageData,
					renderBackground,
					background.a,
					useLighterFont,
					renderMinimap,
					minimapCharWidth,
					tokensColorTracker,
					foregroundAlpha,
					charRenderer,
					dy,
					innerLinePadding,
					tabSize,
					lineInfo[lineIndex]!,
					fontScale,
					minimapLineHeight
				);
			}
			renderedLines[lineIndex] = new MinimapLine(dy);
			dy += minimapLineHeight;
		}

		const dirtyY1 = (_dirtyY1 === -1 ? 0 : _dirtyY1);
		const dirtyY2 = (_dirtyY2 === -1 ? imageData.height : _dirtyY2);
		const dirtyHeight = dirtyY2 - dirtyY1;

		// Finally, paint to the canvas
		const ctx = this._canvas.domNode.getContext('2d')!;
		ctx.putImageData(imageData, 0, 0, 0, dirtyY1, imageData.width, dirtyHeight);

		// Save rendered data for reuse on next frame if possible
		return new RenderData(
			layout,
			imageData,
			renderedLines
		);
	}

	private static _renderUntouchedLines(
		target: ImageData,
		topPaddingLineCount: number,
		startLineNumber: number,
		endLineNumber: number,
		minimapLineHeight: number,
		lastRenderData: RenderData | null,
	): [number, number, boolean[]] {

		const needed: boolean[] = [];
		if (!lastRenderData) {
			for (let i = 0, len = endLineNumber - startLineNumber + 1; i < len; i++) {
				needed[i] = true;
			}
			return [-1, -1, needed];
		}

		const _lastData = lastRenderData._get();
		const lastTargetData = _lastData.imageData.data;
		const lastStartLineNumber = _lastData.rendLineNumberStart;
		const lastLines = _lastData.lines;
		const lastLinesLength = lastLines.length;
		const WIDTH = target.width;
		const targetData = target.data;

		const maxDestPixel = (endLineNumber - startLineNumber + 1) * minimapLineHeight * WIDTH * 4;
		let dirtyPixel1 = -1; // the pixel offset up to which all the data is equal to the prev frame
		let dirtyPixel2 = -1; // the pixel offset after which all the data is equal to the prev frame

		let copySourceStart = -1;
		let copySourceEnd = -1;
		let copyDestStart = -1;
		let copyDestEnd = -1;

		let dest_dy = topPaddingLineCount * minimapLineHeight;
		for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
			const lineIndex = lineNumber - startLineNumber;
			const lastLineIndex = lineNumber - lastStartLineNumber;
			const source_dy = (lastLineIndex >= 0 && lastLineIndex < lastLinesLength ? lastLines[lastLineIndex].dy : -1);

			if (source_dy === -1) {
				needed[lineIndex] = true;
				dest_dy += minimapLineHeight;
				continue;
			}

			const sourceStart = source_dy * WIDTH * 4;
			const sourceEnd = (source_dy + minimapLineHeight) * WIDTH * 4;
			const destStart = dest_dy * WIDTH * 4;
			const destEnd = (dest_dy + minimapLineHeight) * WIDTH * 4;

			if (copySourceEnd === sourceStart && copyDestEnd === destStart) {
				// contiguous zone => extend copy request
				copySourceEnd = sourceEnd;
				copyDestEnd = destEnd;
			} else {
				if (copySourceStart !== -1) {
					// flush existing copy request
					targetData.set(lastTargetData.subarray(copySourceStart, copySourceEnd), copyDestStart);
					if (dirtyPixel1 === -1 && copySourceStart === 0 && copySourceStart === copyDestStart) {
						dirtyPixel1 = copySourceEnd;
					}
					if (dirtyPixel2 === -1 && copySourceEnd === maxDestPixel && copySourceStart === copyDestStart) {
						dirtyPixel2 = copySourceStart;
					}
				}
				copySourceStart = sourceStart;
				copySourceEnd = sourceEnd;
				copyDestStart = destStart;
				copyDestEnd = destEnd;
			}

			needed[lineIndex] = false;
			dest_dy += minimapLineHeight;
		}

		if (copySourceStart !== -1) {
			// flush existing copy request
			targetData.set(lastTargetData.subarray(copySourceStart, copySourceEnd), copyDestStart);
			if (dirtyPixel1 === -1 && copySourceStart === 0 && copySourceStart === copyDestStart) {
				dirtyPixel1 = copySourceEnd;
			}
			if (dirtyPixel2 === -1 && copySourceEnd === maxDestPixel && copySourceStart === copyDestStart) {
				dirtyPixel2 = copySourceStart;
			}
		}

		const dirtyY1 = (dirtyPixel1 === -1 ? -1 : dirtyPixel1 / (WIDTH * 4));
		const dirtyY2 = (dirtyPixel2 === -1 ? -1 : dirtyPixel2 / (WIDTH * 4));

		return [dirtyY1, dirtyY2, needed];
	}

	private static _renderLine(
		target: ImageData,
		backgroundColor: RGBA8,
		backgroundAlpha: number,
		useLighterFont: boolean,
		renderMinimap: RenderMinimap,
		charWidth: number,
		colorTracker: MinimapTokensColorTracker,
		foregroundAlpha: number,
		minimapCharRenderer: MinimapCharRenderer,
		dy: number,
		innerLinePadding: number,
		tabSize: number,
		lineData: ViewLineData,
		fontScale: number,
		minimapLineHeight: number
	): void {
		const content = lineData.content;
		const tokens = lineData.tokens;
		const maxDx = target.width - charWidth;
		const force1pxHeight = (minimapLineHeight === 1);

		let dx = MINIMAP_GUTTER_WIDTH;
		let charIndex = 0;
		let tabsCharDelta = 0;

		for (let tokenIndex = 0, tokensLen = tokens.getCount(); tokenIndex < tokensLen; tokenIndex++) {
			const tokenEndIndex = tokens.getEndOffset(tokenIndex);
			const tokenColorId = tokens.getForeground(tokenIndex);
			const tokenColor = colorTracker.getColor(tokenColorId);

			for (; charIndex < tokenEndIndex; charIndex++) {
				if (dx > maxDx) {
					// hit edge of minimap
					return;
				}
				const charCode = content.charCodeAt(charIndex);

				if (charCode === CharCode.Tab) {
					const insertSpacesCount = tabSize - (charIndex + tabsCharDelta) % tabSize;
					tabsCharDelta += insertSpacesCount - 1;
					// No need to render anything since tab is invisible
					dx += insertSpacesCount * charWidth;
				} else if (charCode === CharCode.Space) {
					// No need to render anything since space is invisible
					dx += charWidth;
				} else {
					// Render twice for a full width character
					const count = strings.isFullWidthCharacter(charCode) ? 2 : 1;

					for (let i = 0; i < count; i++) {
						if (renderMinimap === RenderMinimap.Blocks) {
							minimapCharRenderer.blockRenderChar(target, dx, dy + innerLinePadding, tokenColor, foregroundAlpha, backgroundColor, backgroundAlpha, force1pxHeight);
						} else { // RenderMinimap.Text
							minimapCharRenderer.renderChar(target, dx, dy + innerLinePadding, charCode, tokenColor, foregroundAlpha, backgroundColor, backgroundAlpha, fontScale, useLighterFont, force1pxHeight);
						}

						dx += charWidth;

						if (dx > maxDx) {
							// hit edge of minimap
							return;
						}
					}
				}
			}
		}
	}
}

class ContiguousLineMap<T> {

	private readonly _startLineNumber: number;
	private readonly _endLineNumber: number;
	private readonly _defaultValue: T;
	private readonly _values: T[];

	constructor(startLineNumber: number, endLineNumber: number, defaultValue: T) {
		this._startLineNumber = startLineNumber;
		this._endLineNumber = endLineNumber;
		this._defaultValue = defaultValue;
		this._values = [];
		for (let i = 0, count = this._endLineNumber - this._startLineNumber + 1; i < count; i++) {
			this._values[i] = defaultValue;
		}
	}

	public has(lineNumber: number): boolean {
		return (this.get(lineNumber) !== this._defaultValue);
	}

	public set(lineNumber: number, value: T): void {
		if (lineNumber < this._startLineNumber || lineNumber > this._endLineNumber) {
			return;
		}
		this._values[lineNumber - this._startLineNumber] = value;
	}

	public get(lineNumber: number): T {
		if (lineNumber < this._startLineNumber || lineNumber > this._endLineNumber) {
			return this._defaultValue;
		}
		return this._values[lineNumber - this._startLineNumber];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/minimap/minimapCharRenderer.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/minimap/minimapCharRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RGBA8 } from '../../../common/core/misc/rgba.js';
import { Constants, getCharIndex } from './minimapCharSheet.js';
import { toUint8 } from '../../../../base/common/uint.js';

export class MinimapCharRenderer {
	_minimapCharRendererBrand: void = undefined;

	private readonly charDataNormal: Uint8ClampedArray;
	private readonly charDataLight: Uint8ClampedArray;

	constructor(charData: Uint8ClampedArray, public readonly scale: number) {
		this.charDataNormal = MinimapCharRenderer.soften(charData, 12 / 15);
		this.charDataLight = MinimapCharRenderer.soften(charData, 50 / 60);
	}

	private static soften(input: Uint8ClampedArray, ratio: number): Uint8ClampedArray {
		const result = new Uint8ClampedArray(input.length);
		for (let i = 0, len = input.length; i < len; i++) {
			result[i] = toUint8(input[i] * ratio);
		}
		return result;
	}

	public renderChar(
		target: ImageData,
		dx: number,
		dy: number,
		chCode: number,
		color: RGBA8,
		foregroundAlpha: number,
		backgroundColor: RGBA8,
		backgroundAlpha: number,
		fontScale: number,
		useLighterFont: boolean,
		force1pxHeight: boolean
	): void {
		const charWidth = Constants.BASE_CHAR_WIDTH * this.scale;
		const charHeight = Constants.BASE_CHAR_HEIGHT * this.scale;
		const renderHeight = (force1pxHeight ? 1 : charHeight);
		if (dx + charWidth > target.width || dy + renderHeight > target.height) {
			console.warn('bad render request outside image data');
			return;
		}

		const charData = useLighterFont ? this.charDataLight : this.charDataNormal;
		const charIndex = getCharIndex(chCode, fontScale);

		const destWidth = target.width * Constants.RGBA_CHANNELS_CNT;

		const backgroundR = backgroundColor.r;
		const backgroundG = backgroundColor.g;
		const backgroundB = backgroundColor.b;

		const deltaR = color.r - backgroundR;
		const deltaG = color.g - backgroundG;
		const deltaB = color.b - backgroundB;

		const destAlpha = Math.max(foregroundAlpha, backgroundAlpha);

		const dest = target.data;
		let sourceOffset = charIndex * charWidth * charHeight;

		let row = dy * destWidth + dx * Constants.RGBA_CHANNELS_CNT;
		for (let y = 0; y < renderHeight; y++) {
			let column = row;
			for (let x = 0; x < charWidth; x++) {
				const c = (charData[sourceOffset++] / 255) * (foregroundAlpha / 255);
				dest[column++] = backgroundR + deltaR * c;
				dest[column++] = backgroundG + deltaG * c;
				dest[column++] = backgroundB + deltaB * c;
				dest[column++] = destAlpha;
			}

			row += destWidth;
		}
	}

	public blockRenderChar(
		target: ImageData,
		dx: number,
		dy: number,
		color: RGBA8,
		foregroundAlpha: number,
		backgroundColor: RGBA8,
		backgroundAlpha: number,
		force1pxHeight: boolean
	): void {
		const charWidth = Constants.BASE_CHAR_WIDTH * this.scale;
		const charHeight = Constants.BASE_CHAR_HEIGHT * this.scale;
		const renderHeight = (force1pxHeight ? 1 : charHeight);
		if (dx + charWidth > target.width || dy + renderHeight > target.height) {
			console.warn('bad render request outside image data');
			return;
		}

		const destWidth = target.width * Constants.RGBA_CHANNELS_CNT;

		const c = 0.5 * (foregroundAlpha / 255);

		const backgroundR = backgroundColor.r;
		const backgroundG = backgroundColor.g;
		const backgroundB = backgroundColor.b;

		const deltaR = color.r - backgroundR;
		const deltaG = color.g - backgroundG;
		const deltaB = color.b - backgroundB;

		const colorR = backgroundR + deltaR * c;
		const colorG = backgroundG + deltaG * c;
		const colorB = backgroundB + deltaB * c;

		const destAlpha = Math.max(foregroundAlpha, backgroundAlpha);

		const dest = target.data;

		let row = dy * destWidth + dx * Constants.RGBA_CHANNELS_CNT;
		for (let y = 0; y < renderHeight; y++) {
			let column = row;
			for (let x = 0; x < charWidth; x++) {
				dest[column++] = colorR;
				dest[column++] = colorG;
				dest[column++] = colorB;
				dest[column++] = destAlpha;
			}

			row += destWidth;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/minimap/minimapCharRendererFactory.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/minimap/minimapCharRendererFactory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MinimapCharRenderer } from './minimapCharRenderer.js';
import { allCharCodes, Constants } from './minimapCharSheet.js';
import { prebakedMiniMaps } from './minimapPreBaked.js';
import { toUint8 } from '../../../../base/common/uint.js';

/**
 * Creates character renderers. It takes a 'scale' that determines how large
 * characters should be drawn. Using this, it draws data into a canvas and
 * then downsamples the characters as necessary for the current display.
 * This makes rendering more efficient, rather than drawing a full (tiny)
 * font, or downsampling in real-time.
 */
export class MinimapCharRendererFactory {
	private static lastCreated?: MinimapCharRenderer;
	private static lastFontFamily?: string;

	/**
	 * Creates a new character renderer factory with the given scale.
	 */
	public static create(scale: number, fontFamily: string) {
		// renderers are immutable. By default we'll 'create' a new minimap
		// character renderer whenever we switch editors, no need to do extra work.
		if (this.lastCreated && scale === this.lastCreated.scale && fontFamily === this.lastFontFamily) {
			return this.lastCreated;
		}

		let factory: MinimapCharRenderer;
		if (prebakedMiniMaps[scale]) {
			factory = new MinimapCharRenderer(prebakedMiniMaps[scale](), scale);
		} else {
			factory = MinimapCharRendererFactory.createFromSampleData(
				MinimapCharRendererFactory.createSampleData(fontFamily).data,
				scale
			);
		}

		this.lastFontFamily = fontFamily;
		this.lastCreated = factory;
		return factory;
	}

	/**
	 * Creates the font sample data, writing to a canvas.
	 */
	public static createSampleData(fontFamily: string): ImageData {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d')!;

		canvas.style.height = `${Constants.SAMPLED_CHAR_HEIGHT}px`;
		canvas.height = Constants.SAMPLED_CHAR_HEIGHT;
		canvas.width = Constants.CHAR_COUNT * Constants.SAMPLED_CHAR_WIDTH;
		canvas.style.width = Constants.CHAR_COUNT * Constants.SAMPLED_CHAR_WIDTH + 'px';

		ctx.fillStyle = '#ffffff';
		ctx.font = `bold ${Constants.SAMPLED_CHAR_HEIGHT}px ${fontFamily}`;
		ctx.textBaseline = 'middle';

		let x = 0;
		for (const code of allCharCodes) {
			ctx.fillText(String.fromCharCode(code), x, Constants.SAMPLED_CHAR_HEIGHT / 2);
			x += Constants.SAMPLED_CHAR_WIDTH;
		}

		return ctx.getImageData(0, 0, Constants.CHAR_COUNT * Constants.SAMPLED_CHAR_WIDTH, Constants.SAMPLED_CHAR_HEIGHT);
	}

	/**
	 * Creates a character renderer from the canvas sample data.
	 */
	public static createFromSampleData(source: Uint8ClampedArray, scale: number): MinimapCharRenderer {
		const expectedLength =
			Constants.SAMPLED_CHAR_HEIGHT * Constants.SAMPLED_CHAR_WIDTH * Constants.RGBA_CHANNELS_CNT * Constants.CHAR_COUNT;
		if (source.length !== expectedLength) {
			throw new Error('Unexpected source in MinimapCharRenderer');
		}

		const charData = MinimapCharRendererFactory._downsample(source, scale);
		return new MinimapCharRenderer(charData, scale);
	}

	private static _downsampleChar(
		source: Uint8ClampedArray,
		sourceOffset: number,
		dest: Uint8ClampedArray,
		destOffset: number,
		scale: number
	): number {
		const width = Constants.BASE_CHAR_WIDTH * scale;
		const height = Constants.BASE_CHAR_HEIGHT * scale;

		let targetIndex = destOffset;
		let brightest = 0;

		// This is essentially an ad-hoc rescaling algorithm. Standard approaches
		// like bicubic interpolation are awesome for scaling between image sizes,
		// but don't work so well when scaling to very small pixel values, we end
		// up with blurry, indistinct forms.
		//
		// The approach taken here is simply mapping each source pixel to the target
		// pixels, and taking the weighted values for all pixels in each, and then
		// averaging them out. Finally we apply an intensity boost in _downsample,
		// since when scaling to the smallest pixel sizes there's more black space
		// which causes characters to be much less distinct.
		for (let y = 0; y < height; y++) {
			// 1. For this destination pixel, get the source pixels we're sampling
			// from (x1, y1) to the next pixel (x2, y2)
			const sourceY1 = (y / height) * Constants.SAMPLED_CHAR_HEIGHT;
			const sourceY2 = ((y + 1) / height) * Constants.SAMPLED_CHAR_HEIGHT;

			for (let x = 0; x < width; x++) {
				const sourceX1 = (x / width) * Constants.SAMPLED_CHAR_WIDTH;
				const sourceX2 = ((x + 1) / width) * Constants.SAMPLED_CHAR_WIDTH;

				// 2. Sample all of them, summing them up and weighting them. Similar
				// to bilinear interpolation.
				let value = 0;
				let samples = 0;
				for (let sy = sourceY1; sy < sourceY2; sy++) {
					const sourceRow = sourceOffset + Math.floor(sy) * Constants.RGBA_SAMPLED_ROW_WIDTH;
					const yBalance = 1 - (sy - Math.floor(sy));
					for (let sx = sourceX1; sx < sourceX2; sx++) {
						const xBalance = 1 - (sx - Math.floor(sx));
						const sourceIndex = sourceRow + Math.floor(sx) * Constants.RGBA_CHANNELS_CNT;

						const weight = xBalance * yBalance;
						samples += weight;
						value += ((source[sourceIndex] * source[sourceIndex + 3]) / 255) * weight;
					}
				}

				const final = value / samples;
				brightest = Math.max(brightest, final);
				dest[targetIndex++] = toUint8(final);
			}
		}

		return brightest;
	}

	private static _downsample(data: Uint8ClampedArray, scale: number): Uint8ClampedArray {
		const pixelsPerCharacter = Constants.BASE_CHAR_HEIGHT * scale * Constants.BASE_CHAR_WIDTH * scale;
		const resultLen = pixelsPerCharacter * Constants.CHAR_COUNT;
		const result = new Uint8ClampedArray(resultLen);

		let resultOffset = 0;
		let sourceOffset = 0;
		let brightest = 0;
		for (let charIndex = 0; charIndex < Constants.CHAR_COUNT; charIndex++) {
			brightest = Math.max(brightest, this._downsampleChar(data, sourceOffset, result, resultOffset, scale));
			resultOffset += pixelsPerCharacter;
			sourceOffset += Constants.SAMPLED_CHAR_WIDTH * Constants.RGBA_CHANNELS_CNT;
		}

		if (brightest > 0) {
			const adjust = 255 / brightest;
			for (let i = 0; i < resultLen; i++) {
				result[i] *= adjust;
			}
		}

		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/minimap/minimapCharSheet.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/minimap/minimapCharSheet.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum Constants {
	START_CH_CODE = 32, // Space
	END_CH_CODE = 126, // Tilde (~)
	UNKNOWN_CODE = 65533, // UTF placeholder code
	CHAR_COUNT = END_CH_CODE - START_CH_CODE + 2,

	SAMPLED_CHAR_HEIGHT = 16,
	SAMPLED_CHAR_WIDTH = 10,

	BASE_CHAR_HEIGHT = 2,
	BASE_CHAR_WIDTH = 1,

	RGBA_CHANNELS_CNT = 4,
	RGBA_SAMPLED_ROW_WIDTH = RGBA_CHANNELS_CNT * CHAR_COUNT * SAMPLED_CHAR_WIDTH
}

export const allCharCodes: ReadonlyArray<number> = (() => {
	const v: number[] = [];
	for (let i = Constants.START_CH_CODE; i <= Constants.END_CH_CODE; i++) {
		v.push(i);
	}

	v.push(Constants.UNKNOWN_CODE);
	return v;
})();

export const getCharIndex = (chCode: number, fontScale: number) => {
	chCode -= Constants.START_CH_CODE;
	if (chCode < 0 || chCode > Constants.CHAR_COUNT) {
		if (fontScale <= 2) {
			// for smaller scales, we can get away with using any ASCII character...
			return (chCode + Constants.CHAR_COUNT) % Constants.CHAR_COUNT;
		}
		return Constants.CHAR_COUNT - 1; // unknown symbol
	}

	return chCode;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/minimap/minimapPreBaked.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/minimap/minimapPreBaked.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createSingleCallFunction } from '../../../../base/common/functional.js';

const charTable: { [hex: string]: number } = {
	'0': 0,
	'1': 1,
	'2': 2,
	'3': 3,
	'4': 4,
	'5': 5,
	'6': 6,
	'7': 7,
	'8': 8,
	'9': 9,
	A: 10,
	B: 11,
	C: 12,
	D: 13,
	E: 14,
	F: 15
};

const decodeData = (str: string) => {
	const output = new Uint8ClampedArray(str.length / 2);
	for (let i = 0; i < str.length; i += 2) {
		output[i >> 1] = (charTable[str[i]] << 4) | (charTable[str[i + 1]] & 0xF);
	}

	return output;
};

/*
const encodeData = (data: Uint8ClampedArray, length: string) => {
	const chars = '0123456789ABCDEF';
	let output = '';
	for (let i = 0; i < data.length; i++) {
		output += chars[data[i] >> 4] + chars[data[i] & 0xf];
	}
	return output;
};
*/

/**
 * Map of minimap scales to prebaked sample data at those scales. We don't
 * sample much larger data, because then font family becomes visible, which
 * is use-configurable.
 */
export const prebakedMiniMaps: { [scale: number]: () => Uint8ClampedArray } = {
	1: createSingleCallFunction(() =>
		decodeData(
			'0000511D6300CF609C709645A78432005642574171487021003C451900274D35D762755E8B629C5BA856AF57BA649530C167D1512A272A3F6038604460398526BCA2A968DB6F8957C768BE5FBE2FB467CF5D8D5B795DC7625B5DFF50DE64C466DB2FC47CD860A65E9A2EB96CB54CE06DA763AB2EA26860524D3763536601005116008177A8705E53AB738E6A982F88BAA35B5F5B626D9C636B449B737E5B7B678598869A662F6B5B8542706C704C80736A607578685B70594A49715A4522E792'
		)
	),
	2: createSingleCallFunction(() =>
		decodeData(
			'000000000000000055394F383D2800008B8B1F210002000081B1CBCBCC820000847AAF6B9AAF2119BE08B8881AD60000A44FD07DCCF107015338130C00000000385972265F390B406E2437634B4B48031B12B8A0847000001E15B29A402F0000000000004B33460B00007A752C2A0000000000004D3900000084394B82013400ABA5CFC7AD9C0302A45A3E5A98AB000089A43382D97900008BA54AA087A70A0248A6A7AE6DBE0000BF6F94987EA40A01A06DCFA7A7A9030496C32F77891D0000A99FB1A0AFA80603B29AB9CA75930D010C0948354D3900000C0948354F37460D0028BE673D8400000000AF9D7B6E00002B007AA8933400007AA642675C2700007984CFB9C3985B768772A8A6B7B20000CAAECAAFC4B700009F94A6009F840009D09F9BA4CA9C0000CC8FC76DC87F0000C991C472A2000000A894A48CA7B501079BA2C9C69BA20000B19A5D3FA89000005CA6009DA2960901B0A7F0669FB200009D009E00B7890000DAD0F5D092820000D294D4C48BD10000B5A7A4A3B1A50402CAB6CBA6A2000000B5A7A4A3B1A8044FCDADD19D9CB00000B7778F7B8AAE0803C9AB5D3F5D3F00009EA09EA0BAB006039EA0989A8C7900009B9EF4D6B7C00000A9A7816CACA80000ABAC84705D3F000096DA635CDC8C00006F486F266F263D4784006124097B00374F6D2D6D2D6D4A3A95872322000000030000000000008D8939130000000000002E22A5C9CBC70600AB25C0B5C9B400061A2DB04CA67001082AA6BEBEBFC606002321DACBC19E03087AA08B6768380000282FBAC0B8CA7A88AD25BBA5A29900004C396C5894A6000040485A6E356E9442A32CD17EADA70000B4237923628600003E2DE9C1D7B500002F25BBA5A2990000231DB6AFB4A804023025C0B5CAB588062B2CBDBEC0C706882435A75CA20000002326BD6A82A908048B4B9A5A668000002423A09CB4BB060025259C9D8A7900001C1FCAB2C7C700002A2A9387ABA200002626A4A47D6E9D14333163A0C87500004B6F9C2D643A257049364936493647358A34438355497F1A0000A24C1D590000D38DFFBDD4CD3126'
		)
	)
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/overlayWidgets/overlayWidgets.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/overlayWidgets/overlayWidgets.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
.monaco-editor .overlayWidgets {
	position: absolute;
	top: 0;
	left:0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/overlayWidgets/overlayWidgets.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/overlayWidgets/overlayWidgets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './overlayWidgets.css';
import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { IOverlayWidget, IOverlayWidgetPosition, IOverlayWidgetPositionCoordinates, OverlayWidgetPositionPreference } from '../../editorBrowser.js';
import { PartFingerprint, PartFingerprints, ViewPart } from '../../view/viewPart.js';
import { RenderingContext, RestrictedRenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import * as dom from '../../../../base/browser/dom.js';


interface IWidgetData {
	widget: IOverlayWidget;
	preference: OverlayWidgetPositionPreference | IOverlayWidgetPositionCoordinates | null;
	stack?: number;
	domNode: FastDomNode<HTMLElement>;
}

interface IWidgetMap {
	[key: string]: IWidgetData;
}

/*
 * This view part for rendering the overlay widgets, which are
 * floating widgets positioned based on the editor's viewport,
 * such as the find widget.
 */
export class ViewOverlayWidgets extends ViewPart {

	private readonly _viewDomNode: FastDomNode<HTMLElement>;
	private _widgets: IWidgetMap;
	private _viewDomNodeRect: dom.IDomNodePagePosition;
	private readonly _domNode: FastDomNode<HTMLElement>;
	public readonly overflowingOverlayWidgetsDomNode: FastDomNode<HTMLElement>;
	private _verticalScrollbarWidth: number;
	private _minimapWidth: number;
	private _horizontalScrollbarHeight: number;
	private _editorHeight: number;
	private _editorWidth: number;

	constructor(context: ViewContext, viewDomNode: FastDomNode<HTMLElement>) {
		super(context);
		this._viewDomNode = viewDomNode;

		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);

		this._widgets = {};
		this._verticalScrollbarWidth = layoutInfo.verticalScrollbarWidth;
		this._minimapWidth = layoutInfo.minimap.minimapWidth;
		this._horizontalScrollbarHeight = layoutInfo.horizontalScrollbarHeight;
		this._editorHeight = layoutInfo.height;
		this._editorWidth = layoutInfo.width;
		this._viewDomNodeRect = { top: 0, left: 0, width: 0, height: 0 };

		this._domNode = createFastDomNode(document.createElement('div'));
		PartFingerprints.write(this._domNode, PartFingerprint.OverlayWidgets);
		this._domNode.setClassName('overlayWidgets');

		this.overflowingOverlayWidgetsDomNode = createFastDomNode(document.createElement('div'));
		PartFingerprints.write(this.overflowingOverlayWidgetsDomNode, PartFingerprint.OverflowingOverlayWidgets);
		this.overflowingOverlayWidgetsDomNode.setClassName('overflowingOverlayWidgets');
	}

	public override dispose(): void {
		super.dispose();
		this._widgets = {};
	}

	public getDomNode(): FastDomNode<HTMLElement> {
		return this._domNode;
	}

	// ---- begin view event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);

		this._verticalScrollbarWidth = layoutInfo.verticalScrollbarWidth;
		this._minimapWidth = layoutInfo.minimap.minimapWidth;
		this._horizontalScrollbarHeight = layoutInfo.horizontalScrollbarHeight;
		this._editorHeight = layoutInfo.height;
		this._editorWidth = layoutInfo.width;
		return true;
	}

	// ---- end view event handlers

	private _widgetCanOverflow(widget: IOverlayWidget): boolean {
		const options = this._context.configuration.options;
		const allowOverflow = options.get(EditorOption.allowOverflow);
		return (widget.allowEditorOverflow || false) && allowOverflow;
	}

	public addWidget(widget: IOverlayWidget): void {
		const domNode = createFastDomNode(widget.getDomNode());

		this._widgets[widget.getId()] = {
			widget: widget,
			preference: null,
			domNode: domNode
		};

		// This is sync because a widget wants to be in the dom
		domNode.setPosition('absolute');
		domNode.setAttribute('widgetId', widget.getId());

		if (this._widgetCanOverflow(widget)) {
			this.overflowingOverlayWidgetsDomNode.appendChild(domNode);
		} else {
			this._domNode.appendChild(domNode);
		}

		this.setShouldRender();
		this._updateMaxMinWidth();
	}

	public setWidgetPosition(widget: IOverlayWidget, position: IOverlayWidgetPosition | null): boolean {
		const widgetData = this._widgets[widget.getId()];
		const preference = position ? position.preference : null;
		const stack = position?.stackOrdinal;
		if (widgetData.preference === preference && widgetData.stack === stack) {
			this._updateMaxMinWidth();
			return false;
		}

		widgetData.preference = preference;
		widgetData.stack = stack;
		this.setShouldRender();
		this._updateMaxMinWidth();

		return true;
	}

	public removeWidget(widget: IOverlayWidget): void {
		const widgetId = widget.getId();
		if (this._widgets.hasOwnProperty(widgetId)) {
			const widgetData = this._widgets[widgetId];
			const domNode = widgetData.domNode.domNode;
			delete this._widgets[widgetId];

			domNode.remove();
			this.setShouldRender();
			this._updateMaxMinWidth();
		}
	}

	private _updateMaxMinWidth(): void {
		let maxMinWidth = 0;
		const keys = Object.keys(this._widgets);
		for (let i = 0, len = keys.length; i < len; i++) {
			const widgetId = keys[i];
			const widget = this._widgets[widgetId];
			const widgetMinWidthInPx = widget.widget.getMinContentWidthInPx?.();
			if (typeof widgetMinWidthInPx !== 'undefined') {
				maxMinWidth = Math.max(maxMinWidth, widgetMinWidthInPx);
			}
		}
		this._context.viewLayout.setOverlayWidgetsMinWidth(maxMinWidth);
	}

	private _renderWidget(widgetData: IWidgetData, stackCoordinates: number[]): void {
		const domNode = widgetData.domNode;

		if (widgetData.preference === null) {
			domNode.setTop('');
			return;
		}

		const maxRight = (2 * this._verticalScrollbarWidth) + this._minimapWidth;
		if (widgetData.preference === OverlayWidgetPositionPreference.TOP_RIGHT_CORNER || widgetData.preference === OverlayWidgetPositionPreference.BOTTOM_RIGHT_CORNER) {
			if (widgetData.preference === OverlayWidgetPositionPreference.BOTTOM_RIGHT_CORNER) {
				const widgetHeight = domNode.domNode.clientHeight;
				domNode.setTop((this._editorHeight - widgetHeight - 2 * this._horizontalScrollbarHeight));
			} else {
				domNode.setTop(0);
			}

			if (widgetData.stack !== undefined) {
				domNode.setTop(stackCoordinates[widgetData.preference]);
				stackCoordinates[widgetData.preference] += domNode.domNode.clientWidth;
			} else {
				domNode.setRight(maxRight);
			}
		} else if (widgetData.preference === OverlayWidgetPositionPreference.TOP_CENTER) {
			domNode.domNode.style.right = '50%';
			if (widgetData.stack !== undefined) {
				domNode.setTop(stackCoordinates[OverlayWidgetPositionPreference.TOP_CENTER]);
				stackCoordinates[OverlayWidgetPositionPreference.TOP_CENTER] += domNode.domNode.clientHeight;
			} else {
				domNode.setTop(0);
			}
		} else {
			const { top, left } = widgetData.preference;
			const fixedOverflowWidgets = this._context.configuration.options.get(EditorOption.fixedOverflowWidgets);
			if (fixedOverflowWidgets && this._widgetCanOverflow(widgetData.widget)) {
				// top, left are computed relative to the editor and we need them relative to the page
				const editorBoundingBox = this._viewDomNodeRect;
				domNode.setTop(top + editorBoundingBox.top);
				domNode.setLeft(left + editorBoundingBox.left);
				domNode.setPosition('fixed');

			} else {
				domNode.setTop(top);
				domNode.setLeft(left);
				domNode.setPosition('absolute');
			}
		}
	}

	public prepareRender(ctx: RenderingContext): void {
		this._viewDomNodeRect = dom.getDomNodePagePosition(this._viewDomNode.domNode);
	}

	public render(ctx: RestrictedRenderingContext): void {
		this._domNode.setWidth(this._editorWidth);

		const keys = Object.keys(this._widgets);
		const stackCoordinates = Array.from({ length: OverlayWidgetPositionPreference.TOP_CENTER + 1 }, () => 0);
		keys.sort((a, b) => (this._widgets[a].stack || 0) - (this._widgets[b].stack || 0));

		for (let i = 0, len = keys.length; i < len; i++) {
			const widgetId = keys[i];
			this._renderWidget(this._widgets[widgetId], stackCoordinates);
		}
	}
}
```

--------------------------------------------------------------------------------

````

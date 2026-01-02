---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 198
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 198 of 552)

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

---[FILE: src/vs/editor/browser/controller/mouseTarget.ts]---
Location: vscode-main/src/vs/editor/browser/controller/mouseTarget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IPointerHandlerHelper } from './mouseHandler.js';
import { IMouseTargetContentEmptyData, IMouseTargetMarginData, IMouseTarget, IMouseTargetContentEmpty, IMouseTargetContentText, IMouseTargetContentWidget, IMouseTargetMargin, IMouseTargetOutsideEditor, IMouseTargetOverlayWidget, IMouseTargetScrollbar, IMouseTargetTextarea, IMouseTargetUnknown, IMouseTargetViewZone, IMouseTargetContentTextData, IMouseTargetViewZoneData, MouseTargetType } from '../editorBrowser.js';
import { ClientCoordinates, EditorMouseEvent, EditorPagePosition, PageCoordinates, CoordinatesRelativeToEditor } from '../editorDom.js';
import { PartFingerprint, PartFingerprints } from '../view/viewPart.js';
import { ViewLine } from '../viewParts/viewLines/viewLine.js';
import { IViewCursorRenderData } from '../viewParts/viewCursors/viewCursor.js';
import { EditorLayoutInfo, EditorOption } from '../../common/config/editorOptions.js';
import { Position } from '../../common/core/position.js';
import { Range as EditorRange } from '../../common/core/range.js';
import { HorizontalPosition } from '../view/renderingContext.js';
import { ViewContext } from '../../common/viewModel/viewContext.js';
import { IViewModel } from '../../common/viewModel.js';
import { CursorColumns } from '../../common/core/cursorColumns.js';
import * as dom from '../../../base/browser/dom.js';
import { AtomicTabMoveOperations, Direction } from '../../common/cursor/cursorAtomicMoveOperations.js';
import { PositionAffinity, TextDirection } from '../../common/model.js';
import { InjectedText } from '../../common/modelLineProjectionData.js';
import { Mutable } from '../../../base/common/types.js';
import { Lazy } from '../../../base/common/lazy.js';
import type { ViewLinesGpu } from '../viewParts/viewLinesGpu/viewLinesGpu.js';

const enum HitTestResultType {
	Unknown,
	Content,
}

class UnknownHitTestResult {
	readonly type = HitTestResultType.Unknown;
	constructor(
		readonly hitTarget: HTMLElement | null = null
	) { }
}

class ContentHitTestResult {
	readonly type = HitTestResultType.Content;

	get hitTarget(): HTMLElement { return this.spanNode; }

	constructor(
		readonly position: Position,
		readonly spanNode: HTMLElement,
		readonly injectedText: InjectedText | null,
	) { }
}

type HitTestResult = UnknownHitTestResult | ContentHitTestResult;

namespace HitTestResult {
	export function createFromDOMInfo(ctx: HitTestContext, spanNode: HTMLElement, offset: number): HitTestResult {
		const position = ctx.getPositionFromDOMInfo(spanNode, offset);
		if (position) {
			return new ContentHitTestResult(position, spanNode, null);
		}
		return new UnknownHitTestResult(spanNode);
	}
}

export class PointerHandlerLastRenderData {
	constructor(
		public readonly lastViewCursorsRenderData: IViewCursorRenderData[],
		public readonly lastTextareaPosition: Position | null
	) { }
}

export class MouseTarget {

	private static _deduceRage(position: Position): EditorRange;
	private static _deduceRage(position: Position, range: EditorRange | null): EditorRange;
	private static _deduceRage(position: Position | null): EditorRange | null;
	private static _deduceRage(position: Position | null, range: EditorRange | null = null): EditorRange | null {
		if (!range && position) {
			return new EditorRange(position.lineNumber, position.column, position.lineNumber, position.column);
		}
		return range ?? null;
	}
	public static createUnknown(element: HTMLElement | null, mouseColumn: number, position: Position | null): IMouseTargetUnknown {
		return { type: MouseTargetType.UNKNOWN, element, mouseColumn, position, range: this._deduceRage(position) };
	}
	public static createTextarea(element: HTMLElement | null, mouseColumn: number): IMouseTargetTextarea {
		return { type: MouseTargetType.TEXTAREA, element, mouseColumn, position: null, range: null };
	}
	public static createMargin(type: MouseTargetType.GUTTER_GLYPH_MARGIN | MouseTargetType.GUTTER_LINE_NUMBERS | MouseTargetType.GUTTER_LINE_DECORATIONS, element: HTMLElement | null, mouseColumn: number, position: Position, range: EditorRange, detail: IMouseTargetMarginData): IMouseTargetMargin {
		return { type, element, mouseColumn, position, range, detail };
	}
	public static createViewZone(type: MouseTargetType.GUTTER_VIEW_ZONE | MouseTargetType.CONTENT_VIEW_ZONE, element: HTMLElement | null, mouseColumn: number, position: Position, detail: IMouseTargetViewZoneData): IMouseTargetViewZone {
		return { type, element, mouseColumn, position, range: this._deduceRage(position), detail };
	}
	public static createContentText(element: HTMLElement | null, mouseColumn: number, position: Position, range: EditorRange | null, detail: IMouseTargetContentTextData): IMouseTargetContentText {
		return { type: MouseTargetType.CONTENT_TEXT, element, mouseColumn, position, range: this._deduceRage(position, range), detail };
	}
	public static createContentEmpty(element: HTMLElement | null, mouseColumn: number, position: Position, detail: IMouseTargetContentEmptyData): IMouseTargetContentEmpty {
		return { type: MouseTargetType.CONTENT_EMPTY, element, mouseColumn, position, range: this._deduceRage(position), detail };
	}
	public static createContentWidget(element: HTMLElement | null, mouseColumn: number, detail: string): IMouseTargetContentWidget {
		return { type: MouseTargetType.CONTENT_WIDGET, element, mouseColumn, position: null, range: null, detail };
	}
	public static createScrollbar(element: HTMLElement | null, mouseColumn: number, position: Position): IMouseTargetScrollbar {
		return { type: MouseTargetType.SCROLLBAR, element, mouseColumn, position, range: this._deduceRage(position) };
	}
	public static createOverlayWidget(element: HTMLElement | null, mouseColumn: number, detail: string): IMouseTargetOverlayWidget {
		return { type: MouseTargetType.OVERLAY_WIDGET, element, mouseColumn, position: null, range: null, detail };
	}
	public static createOutsideEditor(mouseColumn: number, position: Position, outsidePosition: 'above' | 'below' | 'left' | 'right', outsideDistance: number): IMouseTargetOutsideEditor {
		return { type: MouseTargetType.OUTSIDE_EDITOR, element: null, mouseColumn, position, range: this._deduceRage(position), outsidePosition, outsideDistance };
	}

	private static _typeToString(type: MouseTargetType): string {
		if (type === MouseTargetType.TEXTAREA) {
			return 'TEXTAREA';
		}
		if (type === MouseTargetType.GUTTER_GLYPH_MARGIN) {
			return 'GUTTER_GLYPH_MARGIN';
		}
		if (type === MouseTargetType.GUTTER_LINE_NUMBERS) {
			return 'GUTTER_LINE_NUMBERS';
		}
		if (type === MouseTargetType.GUTTER_LINE_DECORATIONS) {
			return 'GUTTER_LINE_DECORATIONS';
		}
		if (type === MouseTargetType.GUTTER_VIEW_ZONE) {
			return 'GUTTER_VIEW_ZONE';
		}
		if (type === MouseTargetType.CONTENT_TEXT) {
			return 'CONTENT_TEXT';
		}
		if (type === MouseTargetType.CONTENT_EMPTY) {
			return 'CONTENT_EMPTY';
		}
		if (type === MouseTargetType.CONTENT_VIEW_ZONE) {
			return 'CONTENT_VIEW_ZONE';
		}
		if (type === MouseTargetType.CONTENT_WIDGET) {
			return 'CONTENT_WIDGET';
		}
		if (type === MouseTargetType.OVERVIEW_RULER) {
			return 'OVERVIEW_RULER';
		}
		if (type === MouseTargetType.SCROLLBAR) {
			return 'SCROLLBAR';
		}
		if (type === MouseTargetType.OVERLAY_WIDGET) {
			return 'OVERLAY_WIDGET';
		}
		return 'UNKNOWN';
	}

	public static toString(target: IMouseTarget): string {
		return this._typeToString(target.type) + ': ' + target.position + ' - ' + target.range + ' - ' + JSON.stringify((target as unknown as Record<string, unknown>).detail);
	}
}

class ElementPath {

	public static isTextArea(path: Uint8Array): boolean {
		return (
			path.length === 2
			&& path[0] === PartFingerprint.OverflowGuard
			&& path[1] === PartFingerprint.TextArea
		);
	}

	public static isChildOfViewLines(path: Uint8Array): boolean {
		return (
			path.length >= 4
			&& path[0] === PartFingerprint.OverflowGuard
			&& path[3] === PartFingerprint.ViewLines
		);
	}

	public static isStrictChildOfViewLines(path: Uint8Array): boolean {
		return (
			path.length > 4
			&& path[0] === PartFingerprint.OverflowGuard
			&& path[3] === PartFingerprint.ViewLines
		);
	}

	public static isChildOfScrollableElement(path: Uint8Array): boolean {
		return (
			path.length >= 2
			&& path[0] === PartFingerprint.OverflowGuard
			&& path[1] === PartFingerprint.ScrollableElement
		);
	}

	public static isChildOfMinimap(path: Uint8Array): boolean {
		return (
			path.length >= 2
			&& path[0] === PartFingerprint.OverflowGuard
			&& path[1] === PartFingerprint.Minimap
		);
	}

	public static isChildOfContentWidgets(path: Uint8Array): boolean {
		return (
			path.length >= 4
			&& path[0] === PartFingerprint.OverflowGuard
			&& path[3] === PartFingerprint.ContentWidgets
		);
	}

	public static isChildOfOverflowGuard(path: Uint8Array): boolean {
		return (
			path.length >= 1
			&& path[0] === PartFingerprint.OverflowGuard
		);
	}

	public static isChildOfOverflowingContentWidgets(path: Uint8Array): boolean {
		return (
			path.length >= 1
			&& path[0] === PartFingerprint.OverflowingContentWidgets
		);
	}

	public static isChildOfOverlayWidgets(path: Uint8Array): boolean {
		return (
			path.length >= 2
			&& path[0] === PartFingerprint.OverflowGuard
			&& path[1] === PartFingerprint.OverlayWidgets
		);
	}

	public static isChildOfOverflowingOverlayWidgets(path: Uint8Array): boolean {
		return (
			path.length >= 1
			&& path[0] === PartFingerprint.OverflowingOverlayWidgets
		);
	}
}

export class HitTestContext {

	public readonly viewModel: IViewModel;
	public readonly layoutInfo: EditorLayoutInfo;
	public readonly viewDomNode: HTMLElement;
	public readonly viewLinesGpu: ViewLinesGpu | undefined;
	public readonly lineHeight: number;
	public readonly stickyTabStops: boolean;
	public readonly typicalHalfwidthCharacterWidth: number;
	public readonly lastRenderData: PointerHandlerLastRenderData;

	private readonly _context: ViewContext;
	private readonly _viewHelper: IPointerHandlerHelper;

	constructor(context: ViewContext, viewHelper: IPointerHandlerHelper, lastRenderData: PointerHandlerLastRenderData) {
		this.viewModel = context.viewModel;
		const options = context.configuration.options;
		this.layoutInfo = options.get(EditorOption.layoutInfo);
		this.viewDomNode = viewHelper.viewDomNode;
		this.viewLinesGpu = viewHelper.viewLinesGpu;
		this.lineHeight = options.get(EditorOption.lineHeight);
		this.stickyTabStops = options.get(EditorOption.stickyTabStops);
		this.typicalHalfwidthCharacterWidth = options.get(EditorOption.fontInfo).typicalHalfwidthCharacterWidth;
		this.lastRenderData = lastRenderData;
		this._context = context;
		this._viewHelper = viewHelper;
	}

	public getZoneAtCoord(mouseVerticalOffset: number): IMouseTargetViewZoneData | null {
		return HitTestContext.getZoneAtCoord(this._context, mouseVerticalOffset);
	}

	public static getZoneAtCoord(context: ViewContext, mouseVerticalOffset: number): IMouseTargetViewZoneData | null {
		// The target is either a view zone or the empty space after the last view-line
		const viewZoneWhitespace = context.viewLayout.getWhitespaceAtVerticalOffset(mouseVerticalOffset);

		if (viewZoneWhitespace) {
			const viewZoneMiddle = viewZoneWhitespace.verticalOffset + viewZoneWhitespace.height / 2;
			const lineCount = context.viewModel.getLineCount();
			let positionBefore: Position | null = null;
			let position: Position | null;
			let positionAfter: Position | null = null;

			if (viewZoneWhitespace.afterLineNumber !== lineCount) {
				// There are more lines after this view zone
				positionAfter = new Position(viewZoneWhitespace.afterLineNumber + 1, 1);
			}
			if (viewZoneWhitespace.afterLineNumber > 0) {
				// There are more lines above this view zone
				positionBefore = new Position(viewZoneWhitespace.afterLineNumber, context.viewModel.getLineMaxColumn(viewZoneWhitespace.afterLineNumber));
			}

			if (positionAfter === null) {
				position = positionBefore;
			} else if (positionBefore === null) {
				position = positionAfter;
			} else if (mouseVerticalOffset < viewZoneMiddle) {
				position = positionBefore;
			} else {
				position = positionAfter;
			}

			return {
				viewZoneId: viewZoneWhitespace.id,
				afterLineNumber: viewZoneWhitespace.afterLineNumber,
				positionBefore: positionBefore,
				positionAfter: positionAfter,
				position: position!
			};
		}
		return null;
	}

	public getFullLineRangeAtCoord(mouseVerticalOffset: number): { range: EditorRange; isAfterLines: boolean } {
		if (this._context.viewLayout.isAfterLines(mouseVerticalOffset)) {
			// Below the last line
			const lineNumber = this._context.viewModel.getLineCount();
			const maxLineColumn = this._context.viewModel.getLineMaxColumn(lineNumber);
			return {
				range: new EditorRange(lineNumber, maxLineColumn, lineNumber, maxLineColumn),
				isAfterLines: true
			};
		}

		const lineNumber = this._context.viewLayout.getLineNumberAtVerticalOffset(mouseVerticalOffset);
		const maxLineColumn = this._context.viewModel.getLineMaxColumn(lineNumber);
		return {
			range: new EditorRange(lineNumber, 1, lineNumber, maxLineColumn),
			isAfterLines: false
		};
	}

	public getLineNumberAtVerticalOffset(mouseVerticalOffset: number): number {
		return this._context.viewLayout.getLineNumberAtVerticalOffset(mouseVerticalOffset);
	}

	public isAfterLines(mouseVerticalOffset: number): boolean {
		return this._context.viewLayout.isAfterLines(mouseVerticalOffset);
	}

	public isInTopPadding(mouseVerticalOffset: number): boolean {
		return this._context.viewLayout.isInTopPadding(mouseVerticalOffset);
	}

	public isInBottomPadding(mouseVerticalOffset: number): boolean {
		return this._context.viewLayout.isInBottomPadding(mouseVerticalOffset);
	}

	public getVerticalOffsetForLineNumber(lineNumber: number): number {
		return this._context.viewLayout.getVerticalOffsetForLineNumber(lineNumber);
	}

	public findAttribute(element: Element, attr: string): string | null {
		return HitTestContext._findAttribute(element, attr, this._viewHelper.viewDomNode);
	}

	private static _findAttribute(element: Element, attr: string, stopAt: Element): string | null {
		while (element && element !== element.ownerDocument.body) {
			if (element.hasAttribute && element.hasAttribute(attr)) {
				return element.getAttribute(attr);
			}
			if (element === stopAt) {
				return null;
			}
			element = <Element>element.parentNode;
		}
		return null;
	}

	public getLineWidth(lineNumber: number): number {
		return this._viewHelper.getLineWidth(lineNumber);
	}

	public isRtl(lineNumber: number): boolean {
		return this.viewModel.getTextDirection(lineNumber) === TextDirection.RTL;

	}

	public visibleRangeForPosition(lineNumber: number, column: number): HorizontalPosition | null {
		return this._viewHelper.visibleRangeForPosition(lineNumber, column);
	}

	public getPositionFromDOMInfo(spanNode: HTMLElement, offset: number): Position | null {
		return this._viewHelper.getPositionFromDOMInfo(spanNode, offset);
	}

	public getCurrentScrollTop(): number {
		return this._context.viewLayout.getCurrentScrollTop();
	}

	public getCurrentScrollLeft(): number {
		return this._context.viewLayout.getCurrentScrollLeft();
	}
}

abstract class BareHitTestRequest {

	public readonly editorPos: EditorPagePosition;
	public readonly pos: PageCoordinates;
	public readonly relativePos: CoordinatesRelativeToEditor;
	public readonly mouseVerticalOffset: number;
	public readonly isInMarginArea: boolean;
	public readonly isInContentArea: boolean;
	public readonly mouseContentHorizontalOffset: number;

	protected readonly mouseColumn: number;

	constructor(ctx: HitTestContext, editorPos: EditorPagePosition, pos: PageCoordinates, relativePos: CoordinatesRelativeToEditor) {
		this.editorPos = editorPos;
		this.pos = pos;
		this.relativePos = relativePos;

		this.mouseVerticalOffset = Math.max(0, ctx.getCurrentScrollTop() + this.relativePos.y);
		this.mouseContentHorizontalOffset = ctx.getCurrentScrollLeft() + this.relativePos.x - ctx.layoutInfo.contentLeft;
		this.isInMarginArea = (this.relativePos.x < ctx.layoutInfo.contentLeft && this.relativePos.x >= ctx.layoutInfo.glyphMarginLeft);
		this.isInContentArea = !this.isInMarginArea;
		this.mouseColumn = Math.max(0, MouseTargetFactory._getMouseColumn(this.mouseContentHorizontalOffset, ctx.typicalHalfwidthCharacterWidth));
	}
}

class HitTestRequest extends BareHitTestRequest {
	private readonly _ctx: HitTestContext;
	private readonly _eventTarget: HTMLElement | null;
	public readonly hitTestResult = new Lazy(() => MouseTargetFactory.doHitTest(this._ctx, this));
	private _useHitTestTarget: boolean;
	private _targetPathCacheElement: HTMLElement | null = null;
	private _targetPathCacheValue: Uint8Array = new Uint8Array(0);

	public get target(): HTMLElement | null {
		if (this._useHitTestTarget) {
			return this.hitTestResult.value.hitTarget;
		}
		return this._eventTarget;
	}

	public get targetPath(): Uint8Array {
		if (this._targetPathCacheElement !== this.target) {
			this._targetPathCacheElement = this.target;
			this._targetPathCacheValue = PartFingerprints.collect(this.target, this._ctx.viewDomNode);
		}
		return this._targetPathCacheValue;
	}

	constructor(ctx: HitTestContext, editorPos: EditorPagePosition, pos: PageCoordinates, relativePos: CoordinatesRelativeToEditor, eventTarget: HTMLElement | null) {
		super(ctx, editorPos, pos, relativePos);
		this._ctx = ctx;
		this._eventTarget = eventTarget;

		// If no event target is passed in, we will use the hit test target
		const hasEventTarget = Boolean(this._eventTarget);
		this._useHitTestTarget = !hasEventTarget;
	}

	public override toString(): string {
		return `pos(${this.pos.x},${this.pos.y}), editorPos(${this.editorPos.x},${this.editorPos.y}), relativePos(${this.relativePos.x},${this.relativePos.y}), mouseVerticalOffset: ${this.mouseVerticalOffset}, mouseContentHorizontalOffset: ${this.mouseContentHorizontalOffset}\n\ttarget: ${this.target ? this.target.outerHTML : null}`;
	}

	public get wouldBenefitFromHitTestTargetSwitch(): boolean {
		return (
			!this._useHitTestTarget
			&& this.hitTestResult.value.hitTarget !== null
			&& this.target !== this.hitTestResult.value.hitTarget
		);
	}

	public switchToHitTestTarget(): void {
		this._useHitTestTarget = true;
	}

	private _getMouseColumn(position: Position | null = null): number {
		if (position && position.column < this._ctx.viewModel.getLineMaxColumn(position.lineNumber)) {
			// Most likely, the line contains foreign decorations...
			return CursorColumns.visibleColumnFromColumn(this._ctx.viewModel.getLineContent(position.lineNumber), position.column, this._ctx.viewModel.model.getOptions().tabSize) + 1;
		}
		return this.mouseColumn;
	}

	public fulfillUnknown(position: Position | null = null): IMouseTargetUnknown {
		return MouseTarget.createUnknown(this.target, this._getMouseColumn(position), position);
	}
	public fulfillTextarea(): IMouseTargetTextarea {
		return MouseTarget.createTextarea(this.target, this._getMouseColumn());
	}
	public fulfillMargin(type: MouseTargetType.GUTTER_GLYPH_MARGIN | MouseTargetType.GUTTER_LINE_NUMBERS | MouseTargetType.GUTTER_LINE_DECORATIONS, position: Position, range: EditorRange, detail: IMouseTargetMarginData): IMouseTargetMargin {
		return MouseTarget.createMargin(type, this.target, this._getMouseColumn(position), position, range, detail);
	}
	public fulfillViewZone(type: MouseTargetType.GUTTER_VIEW_ZONE | MouseTargetType.CONTENT_VIEW_ZONE, position: Position, detail: IMouseTargetViewZoneData): IMouseTargetViewZone {
		// Always return the usual mouse column for a view zone.
		return MouseTarget.createViewZone(type, this.target, this._getMouseColumn(), position, detail);
	}
	public fulfillContentText(position: Position, range: EditorRange | null, detail: IMouseTargetContentTextData): IMouseTargetContentText {
		return MouseTarget.createContentText(this.target, this._getMouseColumn(position), position, range, detail);
	}
	public fulfillContentEmpty(position: Position, detail: IMouseTargetContentEmptyData): IMouseTargetContentEmpty {
		return MouseTarget.createContentEmpty(this.target, this._getMouseColumn(position), position, detail);
	}
	public fulfillContentWidget(detail: string): IMouseTargetContentWidget {
		return MouseTarget.createContentWidget(this.target, this._getMouseColumn(), detail);
	}
	public fulfillScrollbar(position: Position): IMouseTargetScrollbar {
		return MouseTarget.createScrollbar(this.target, this._getMouseColumn(position), position);
	}
	public fulfillOverlayWidget(detail: string): IMouseTargetOverlayWidget {
		return MouseTarget.createOverlayWidget(this.target, this._getMouseColumn(), detail);
	}
}

interface ResolvedHitTestRequest extends HitTestRequest {
	readonly target: HTMLElement;
}

const EMPTY_CONTENT_AFTER_LINES: IMouseTargetContentEmptyData = { isAfterLines: true };

function createEmptyContentDataInLines(horizontalDistanceToText: number): IMouseTargetContentEmptyData {
	return {
		isAfterLines: false,
		horizontalDistanceToText: horizontalDistanceToText
	};
}

export class MouseTargetFactory {

	private readonly _context: ViewContext;
	private readonly _viewHelper: IPointerHandlerHelper;

	constructor(context: ViewContext, viewHelper: IPointerHandlerHelper) {
		this._context = context;
		this._viewHelper = viewHelper;
	}

	public mouseTargetIsWidget(e: EditorMouseEvent): boolean {
		const t = <Element>e.target;
		const path = PartFingerprints.collect(t, this._viewHelper.viewDomNode);

		// Is it a content widget?
		if (ElementPath.isChildOfContentWidgets(path) || ElementPath.isChildOfOverflowingContentWidgets(path)) {
			return true;
		}

		// Is it an overlay widget?
		if (ElementPath.isChildOfOverlayWidgets(path) || ElementPath.isChildOfOverflowingOverlayWidgets(path)) {
			return true;
		}

		return false;
	}

	public createMouseTarget(lastRenderData: PointerHandlerLastRenderData, editorPos: EditorPagePosition, pos: PageCoordinates, relativePos: CoordinatesRelativeToEditor, target: HTMLElement | null): IMouseTarget {
		const ctx = new HitTestContext(this._context, this._viewHelper, lastRenderData);
		const request = new HitTestRequest(ctx, editorPos, pos, relativePos, target);
		try {
			const r = MouseTargetFactory._createMouseTarget(ctx, request);

			if (r.type === MouseTargetType.CONTENT_TEXT) {
				// Snap to the nearest soft tab boundary if atomic soft tabs are enabled.
				if (ctx.stickyTabStops && r.position !== null) {
					const position = MouseTargetFactory._snapToSoftTabBoundary(r.position, ctx.viewModel);
					const range = EditorRange.fromPositions(position, position).plusRange(r.range);
					return request.fulfillContentText(position, range, r.detail);
				}
			}

			// console.log(MouseTarget.toString(r));
			return r;
		} catch (err) {
			// console.log(err);
			return request.fulfillUnknown();
		}
	}

	private static _createMouseTarget(ctx: HitTestContext, request: HitTestRequest): IMouseTarget {

		// console.log(`${domHitTestExecuted ? '=>' : ''}CAME IN REQUEST: ${request}`);

		if (request.target === null) {
			// No target
			return request.fulfillUnknown();
		}

		// we know for a fact that request.target is not null
		const resolvedRequest = <ResolvedHitTestRequest>request;

		let result: IMouseTarget | null = null;

		if (!ElementPath.isChildOfOverflowGuard(request.targetPath) && !ElementPath.isChildOfOverflowingContentWidgets(request.targetPath) && !ElementPath.isChildOfOverflowingOverlayWidgets(request.targetPath)) {
			// We only render dom nodes inside the overflow guard or in the overflowing content widgets
			result = result || request.fulfillUnknown();
		}

		result = result || MouseTargetFactory._hitTestContentWidget(ctx, resolvedRequest);
		result = result || MouseTargetFactory._hitTestOverlayWidget(ctx, resolvedRequest);
		result = result || MouseTargetFactory._hitTestMinimap(ctx, resolvedRequest);
		result = result || MouseTargetFactory._hitTestScrollbarSlider(ctx, resolvedRequest);
		result = result || MouseTargetFactory._hitTestViewZone(ctx, resolvedRequest);
		result = result || MouseTargetFactory._hitTestMargin(ctx, resolvedRequest);
		result = result || MouseTargetFactory._hitTestViewCursor(ctx, resolvedRequest);
		result = result || MouseTargetFactory._hitTestTextArea(ctx, resolvedRequest);
		result = result || MouseTargetFactory._hitTestViewLines(ctx, resolvedRequest);
		result = result || MouseTargetFactory._hitTestScrollbar(ctx, resolvedRequest);

		return (result || request.fulfillUnknown());
	}

	private static _hitTestContentWidget(ctx: HitTestContext, request: ResolvedHitTestRequest): IMouseTarget | null {
		// Is it a content widget?
		if (ElementPath.isChildOfContentWidgets(request.targetPath) || ElementPath.isChildOfOverflowingContentWidgets(request.targetPath)) {
			const widgetId = ctx.findAttribute(request.target, 'widgetId');
			if (widgetId) {
				return request.fulfillContentWidget(widgetId);
			} else {
				return request.fulfillUnknown();
			}
		}
		return null;
	}

	private static _hitTestOverlayWidget(ctx: HitTestContext, request: ResolvedHitTestRequest): IMouseTarget | null {
		// Is it an overlay widget?
		if (ElementPath.isChildOfOverlayWidgets(request.targetPath) || ElementPath.isChildOfOverflowingOverlayWidgets(request.targetPath)) {
			const widgetId = ctx.findAttribute(request.target, 'widgetId');
			if (widgetId) {
				return request.fulfillOverlayWidget(widgetId);
			} else {
				return request.fulfillUnknown();
			}
		}
		return null;
	}

	private static _hitTestViewCursor(ctx: HitTestContext, request: ResolvedHitTestRequest): IMouseTarget | null {

		if (request.target) {
			// Check if we've hit a painted cursor
			const lastViewCursorsRenderData = ctx.lastRenderData.lastViewCursorsRenderData;

			for (const d of lastViewCursorsRenderData) {

				if (request.target === d.domNode) {
					return request.fulfillContentText(d.position, null, { mightBeForeignElement: false, injectedText: null });
				}
			}
		}

		if (request.isInContentArea) {
			// Edge has a bug when hit-testing the exact position of a cursor,
			// instead of returning the correct dom node, it returns the
			// first or last rendered view line dom node, therefore help it out
			// and first check if we are on top of a cursor

			const lastViewCursorsRenderData = ctx.lastRenderData.lastViewCursorsRenderData;
			const mouseContentHorizontalOffset = request.mouseContentHorizontalOffset;
			const mouseVerticalOffset = request.mouseVerticalOffset;

			for (const d of lastViewCursorsRenderData) {

				if (mouseContentHorizontalOffset < d.contentLeft) {
					// mouse position is to the left of the cursor
					continue;
				}
				if (mouseContentHorizontalOffset > d.contentLeft + d.width) {
					// mouse position is to the right of the cursor
					continue;
				}

				const cursorVerticalOffset = ctx.getVerticalOffsetForLineNumber(d.position.lineNumber);

				if (
					cursorVerticalOffset <= mouseVerticalOffset
					&& mouseVerticalOffset <= cursorVerticalOffset + d.height
				) {
					return request.fulfillContentText(d.position, null, { mightBeForeignElement: false, injectedText: null });
				}
			}
		}

		return null;
	}

	private static _hitTestViewZone(ctx: HitTestContext, request: ResolvedHitTestRequest): IMouseTarget | null {
		const viewZoneData = ctx.getZoneAtCoord(request.mouseVerticalOffset);
		if (viewZoneData) {
			const mouseTargetType = (request.isInContentArea ? MouseTargetType.CONTENT_VIEW_ZONE : MouseTargetType.GUTTER_VIEW_ZONE);
			return request.fulfillViewZone(mouseTargetType, viewZoneData.position, viewZoneData);
		}

		return null;
	}

	private static _hitTestTextArea(ctx: HitTestContext, request: ResolvedHitTestRequest): IMouseTarget | null {
		// Is it the textarea?
		if (ElementPath.isTextArea(request.targetPath)) {
			if (ctx.lastRenderData.lastTextareaPosition) {
				return request.fulfillContentText(ctx.lastRenderData.lastTextareaPosition, null, { mightBeForeignElement: false, injectedText: null });
			}
			return request.fulfillTextarea();
		}
		return null;
	}

	private static _hitTestMargin(ctx: HitTestContext, request: ResolvedHitTestRequest): IMouseTarget | null {
		if (request.isInMarginArea) {
			const res = ctx.getFullLineRangeAtCoord(request.mouseVerticalOffset);
			const pos = res.range.getStartPosition();
			let offset = Math.abs(request.relativePos.x);
			const detail: Mutable<IMouseTargetMarginData> = {
				isAfterLines: res.isAfterLines,
				glyphMarginLeft: ctx.layoutInfo.glyphMarginLeft,
				glyphMarginWidth: ctx.layoutInfo.glyphMarginWidth,
				lineNumbersWidth: ctx.layoutInfo.lineNumbersWidth,
				offsetX: offset
			};

			offset -= ctx.layoutInfo.glyphMarginLeft;

			if (offset <= ctx.layoutInfo.glyphMarginWidth) {
				// On the glyph margin
				const modelCoordinate = ctx.viewModel.coordinatesConverter.convertViewPositionToModelPosition(res.range.getStartPosition());
				const lanes = ctx.viewModel.glyphLanes.getLanesAtLine(modelCoordinate.lineNumber);
				detail.glyphMarginLane = lanes[Math.floor(offset / ctx.lineHeight)];
				return request.fulfillMargin(MouseTargetType.GUTTER_GLYPH_MARGIN, pos, res.range, detail);
			}
			offset -= ctx.layoutInfo.glyphMarginWidth;

			if (offset <= ctx.layoutInfo.lineNumbersWidth) {
				// On the line numbers
				return request.fulfillMargin(MouseTargetType.GUTTER_LINE_NUMBERS, pos, res.range, detail);
			}
			offset -= ctx.layoutInfo.lineNumbersWidth;

			// On the line decorations
			return request.fulfillMargin(MouseTargetType.GUTTER_LINE_DECORATIONS, pos, res.range, detail);
		}
		return null;
	}

	private static _hitTestViewLines(ctx: HitTestContext, request: ResolvedHitTestRequest): IMouseTarget | null {
		if (!ElementPath.isChildOfViewLines(request.targetPath)) {
			return null;
		}

		if (ctx.isInTopPadding(request.mouseVerticalOffset)) {
			return request.fulfillContentEmpty(new Position(1, 1), EMPTY_CONTENT_AFTER_LINES);
		}

		// Check if it is below any lines and any view zones
		if (ctx.isAfterLines(request.mouseVerticalOffset) || ctx.isInBottomPadding(request.mouseVerticalOffset)) {
			// This most likely indicates it happened after the last view-line
			const lineCount = ctx.viewModel.getLineCount();
			const maxLineColumn = ctx.viewModel.getLineMaxColumn(lineCount);
			return request.fulfillContentEmpty(new Position(lineCount, maxLineColumn), EMPTY_CONTENT_AFTER_LINES);
		}

		// Check if we are hitting a view-line (can happen in the case of inline decorations on empty lines)
		// See https://github.com/microsoft/vscode/issues/46942
		if (ElementPath.isStrictChildOfViewLines(request.targetPath)) {
			const lineNumber = ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset);
			const lineLength = ctx.viewModel.getLineLength(lineNumber);
			const lineWidth = ctx.getLineWidth(lineNumber);
			if (lineLength === 0) {
				const detail = createEmptyContentDataInLines(request.mouseContentHorizontalOffset - lineWidth);
				return request.fulfillContentEmpty(new Position(lineNumber, 1), detail);
			}

			const isRtl = ctx.isRtl(lineNumber);
			if (isRtl) {
				if (request.mouseContentHorizontalOffset + lineWidth <= ctx.layoutInfo.contentWidth - ctx.layoutInfo.verticalScrollbarWidth) {
					const detail = createEmptyContentDataInLines(request.mouseContentHorizontalOffset - lineWidth);
					const pos = new Position(lineNumber, ctx.viewModel.getLineMaxColumn(lineNumber));
					return request.fulfillContentEmpty(pos, detail);
				}
			} else if (request.mouseContentHorizontalOffset >= lineWidth) {
				const detail = createEmptyContentDataInLines(request.mouseContentHorizontalOffset - lineWidth);
				const pos = new Position(lineNumber, ctx.viewModel.getLineMaxColumn(lineNumber));
				return request.fulfillContentEmpty(pos, detail);
			}
		} else {
			if (ctx.viewLinesGpu) {
				const lineNumber = ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset);
				if (ctx.viewModel.getLineLength(lineNumber) === 0) {
					const lineWidth = ctx.getLineWidth(lineNumber);
					const detail = createEmptyContentDataInLines(request.mouseContentHorizontalOffset - lineWidth);
					return request.fulfillContentEmpty(new Position(lineNumber, 1), detail);
				}

				const lineWidth = ctx.getLineWidth(lineNumber);
				const isRtl = ctx.isRtl(lineNumber);
				if (isRtl) {
					if (request.mouseContentHorizontalOffset + lineWidth <= ctx.layoutInfo.contentWidth - ctx.layoutInfo.verticalScrollbarWidth) {
						const detail = createEmptyContentDataInLines(request.mouseContentHorizontalOffset - lineWidth);
						const pos = new Position(lineNumber, ctx.viewModel.getLineMaxColumn(lineNumber));
						return request.fulfillContentEmpty(pos, detail);
					}
				} else if (request.mouseContentHorizontalOffset >= lineWidth) {
					const detail = createEmptyContentDataInLines(request.mouseContentHorizontalOffset - lineWidth);
					const pos = new Position(lineNumber, ctx.viewModel.getLineMaxColumn(lineNumber));
					return request.fulfillContentEmpty(pos, detail);
				}

				const position = ctx.viewLinesGpu.getPositionAtCoordinate(lineNumber, request.mouseContentHorizontalOffset);
				if (position) {
					const detail: IMouseTargetContentTextData = {
						injectedText: null,
						mightBeForeignElement: false
					};
					return request.fulfillContentText(position, EditorRange.fromPositions(position, position), detail);
				}
			}
		}

		// Do the hit test (if not already done)
		const hitTestResult = request.hitTestResult.value;

		if (hitTestResult.type === HitTestResultType.Content) {
			return MouseTargetFactory.createMouseTargetFromHitTestPosition(ctx, request, hitTestResult.spanNode, hitTestResult.position, hitTestResult.injectedText);
		}

		// We didn't hit content...
		if (request.wouldBenefitFromHitTestTargetSwitch) {
			// We actually hit something different... Give it one last change by trying again with this new target
			request.switchToHitTestTarget();
			return this._createMouseTarget(ctx, request);
		}

		// We have tried everything...
		return request.fulfillUnknown();
	}

	private static _hitTestMinimap(ctx: HitTestContext, request: ResolvedHitTestRequest): IMouseTarget | null {
		if (ElementPath.isChildOfMinimap(request.targetPath)) {
			const possibleLineNumber = ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset);
			const maxColumn = ctx.viewModel.getLineMaxColumn(possibleLineNumber);
			return request.fulfillScrollbar(new Position(possibleLineNumber, maxColumn));
		}
		return null;
	}

	private static _hitTestScrollbarSlider(ctx: HitTestContext, request: ResolvedHitTestRequest): IMouseTarget | null {
		if (ElementPath.isChildOfScrollableElement(request.targetPath)) {
			if (request.target && request.target.nodeType === 1) {
				const className = request.target.className;
				if (className && /\b(slider|scrollbar)\b/.test(className)) {
					const possibleLineNumber = ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset);
					const maxColumn = ctx.viewModel.getLineMaxColumn(possibleLineNumber);
					return request.fulfillScrollbar(new Position(possibleLineNumber, maxColumn));
				}
			}
		}
		return null;
	}

	private static _hitTestScrollbar(ctx: HitTestContext, request: ResolvedHitTestRequest): IMouseTarget | null {
		// Is it the overview ruler?
		// Is it a child of the scrollable element?
		if (ElementPath.isChildOfScrollableElement(request.targetPath)) {
			const possibleLineNumber = ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset);
			const maxColumn = ctx.viewModel.getLineMaxColumn(possibleLineNumber);
			return request.fulfillScrollbar(new Position(possibleLineNumber, maxColumn));
		}

		return null;
	}

	public getMouseColumn(relativePos: CoordinatesRelativeToEditor): number {
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);
		const mouseContentHorizontalOffset = this._context.viewLayout.getCurrentScrollLeft() + relativePos.x - layoutInfo.contentLeft;
		return MouseTargetFactory._getMouseColumn(mouseContentHorizontalOffset, options.get(EditorOption.fontInfo).typicalHalfwidthCharacterWidth);
	}

	public static _getMouseColumn(mouseContentHorizontalOffset: number, typicalHalfwidthCharacterWidth: number): number {
		if (mouseContentHorizontalOffset < 0) {
			return 1;
		}
		const chars = Math.round(mouseContentHorizontalOffset / typicalHalfwidthCharacterWidth);
		return (chars + 1);
	}

	private static createMouseTargetFromHitTestPosition(ctx: HitTestContext, request: HitTestRequest, spanNode: HTMLElement, pos: Position, injectedText: InjectedText | null): IMouseTarget {
		const lineNumber = pos.lineNumber;
		const column = pos.column;

		const lineWidth = ctx.getLineWidth(lineNumber);

		if (request.mouseContentHorizontalOffset > lineWidth) {
			const detail = createEmptyContentDataInLines(request.mouseContentHorizontalOffset - lineWidth);
			return request.fulfillContentEmpty(pos, detail);
		}

		const visibleRange = ctx.visibleRangeForPosition(lineNumber, column);

		if (!visibleRange) {
			return request.fulfillUnknown(pos);
		}

		const columnHorizontalOffset = visibleRange.left;

		if (Math.abs(request.mouseContentHorizontalOffset - columnHorizontalOffset) < 1) {
			return request.fulfillContentText(pos, null, { mightBeForeignElement: !!injectedText, injectedText });
		}

		// Let's define a, b, c and check if the offset is in between them...
		interface OffsetColumn { offset: number; column: number }

		const points: OffsetColumn[] = [];
		points.push({ offset: visibleRange.left, column: column });
		if (column > 1) {
			const visibleRange = ctx.visibleRangeForPosition(lineNumber, column - 1);
			if (visibleRange) {
				points.push({ offset: visibleRange.left, column: column - 1 });
			}
		}
		const lineMaxColumn = ctx.viewModel.getLineMaxColumn(lineNumber);
		if (column < lineMaxColumn) {
			const visibleRange = ctx.visibleRangeForPosition(lineNumber, column + 1);
			if (visibleRange) {
				points.push({ offset: visibleRange.left, column: column + 1 });
			}
		}

		points.sort((a, b) => a.offset - b.offset);

		const mouseCoordinates = request.pos.toClientCoordinates(dom.getWindow(ctx.viewDomNode));
		const spanNodeClientRect = spanNode.getBoundingClientRect();
		const mouseIsOverSpanNode = (spanNodeClientRect.left <= mouseCoordinates.clientX && mouseCoordinates.clientX <= spanNodeClientRect.right);

		let rng: EditorRange | null = null;

		for (let i = 1; i < points.length; i++) {
			const prev = points[i - 1];
			const curr = points[i];
			if (prev.offset <= request.mouseContentHorizontalOffset && request.mouseContentHorizontalOffset <= curr.offset) {
				rng = new EditorRange(lineNumber, prev.column, lineNumber, curr.column);

				// See https://github.com/microsoft/vscode/issues/152819
				// Due to the use of zwj, the browser's hit test result is skewed towards the left
				// Here we try to correct that if the mouse horizontal offset is closer to the right than the left

				const prevDelta = Math.abs(prev.offset - request.mouseContentHorizontalOffset);
				const nextDelta = Math.abs(curr.offset - request.mouseContentHorizontalOffset);

				pos = (
					prevDelta < nextDelta
						? new Position(lineNumber, prev.column)
						: new Position(lineNumber, curr.column)
				);

				break;
			}
		}

		return request.fulfillContentText(pos, rng, { mightBeForeignElement: !mouseIsOverSpanNode || !!injectedText, injectedText });
	}

	/**
	 * Most probably WebKit browsers and Edge
	 */
	private static _doHitTestWithCaretRangeFromPoint(ctx: HitTestContext, request: BareHitTestRequest): HitTestResult {

		// In Chrome, especially on Linux it is possible to click between lines,
		// so try to adjust the `hity` below so that it lands in the center of a line
		const lineNumber = ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset);
		const lineStartVerticalOffset = ctx.getVerticalOffsetForLineNumber(lineNumber);
		const lineEndVerticalOffset = lineStartVerticalOffset + ctx.lineHeight;

		const isBelowLastLine = (
			lineNumber === ctx.viewModel.getLineCount()
			&& request.mouseVerticalOffset > lineEndVerticalOffset
		);

		if (!isBelowLastLine) {
			const lineCenteredVerticalOffset = Math.floor((lineStartVerticalOffset + lineEndVerticalOffset) / 2);
			let adjustedPageY = request.pos.y + (lineCenteredVerticalOffset - request.mouseVerticalOffset);

			if (adjustedPageY <= request.editorPos.y) {
				adjustedPageY = request.editorPos.y + 1;
			}
			if (adjustedPageY >= request.editorPos.y + request.editorPos.height) {
				adjustedPageY = request.editorPos.y + request.editorPos.height - 1;
			}

			const adjustedPage = new PageCoordinates(request.pos.x, adjustedPageY);

			const r = this._actualDoHitTestWithCaretRangeFromPoint(ctx, adjustedPage.toClientCoordinates(dom.getWindow(ctx.viewDomNode)));
			if (r.type === HitTestResultType.Content) {
				return r;
			}
		}

		// Also try to hit test without the adjustment (for the edge cases that we are near the top or bottom)
		return this._actualDoHitTestWithCaretRangeFromPoint(ctx, request.pos.toClientCoordinates(dom.getWindow(ctx.viewDomNode)));
	}

	private static _actualDoHitTestWithCaretRangeFromPoint(ctx: HitTestContext, coords: ClientCoordinates): HitTestResult {
		const shadowRoot = dom.getShadowRoot(ctx.viewDomNode);
		let range: Range;
		if (shadowRoot) {
			// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
			if (typeof (<any>shadowRoot).caretRangeFromPoint === 'undefined') {
				range = shadowCaretRangeFromPoint(shadowRoot, coords.clientX, coords.clientY);
			} else {
				// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
				range = (<any>shadowRoot).caretRangeFromPoint(coords.clientX, coords.clientY);
			}
		} else {
			// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
			range = (<any>ctx.viewDomNode.ownerDocument).caretRangeFromPoint(coords.clientX, coords.clientY);
		}

		if (!range || !range.startContainer) {
			return new UnknownHitTestResult();
		}

		// Chrome always hits a TEXT_NODE, while Edge sometimes hits a token span
		const startContainer = range.startContainer;

		if (startContainer.nodeType === startContainer.TEXT_NODE) {
			// startContainer is expected to be the token text
			const parent1 = startContainer.parentNode; // expected to be the token span
			const parent2 = parent1 ? parent1.parentNode : null; // expected to be the view line container span
			const parent3 = parent2 ? parent2.parentNode : null; // expected to be the view line div
			const parent3ClassName = parent3 && parent3.nodeType === parent3.ELEMENT_NODE ? (<HTMLElement>parent3).className : null;

			if (parent3ClassName === ViewLine.CLASS_NAME) {
				return HitTestResult.createFromDOMInfo(ctx, <HTMLElement>parent1, range.startOffset);
			} else {
				return new UnknownHitTestResult(<HTMLElement>startContainer.parentNode);
			}
		} else if (startContainer.nodeType === startContainer.ELEMENT_NODE) {
			// startContainer is expected to be the token span
			const parent1 = startContainer.parentNode; // expected to be the view line container span
			const parent2 = parent1 ? parent1.parentNode : null; // expected to be the view line div
			const parent2ClassName = parent2 && parent2.nodeType === parent2.ELEMENT_NODE ? (<HTMLElement>parent2).className : null;

			if (parent2ClassName === ViewLine.CLASS_NAME) {
				return HitTestResult.createFromDOMInfo(ctx, <HTMLElement>startContainer, (<HTMLElement>startContainer).textContent.length);
			} else {
				return new UnknownHitTestResult(<HTMLElement>startContainer);
			}
		}

		return new UnknownHitTestResult();
	}

	/**
	 * Most probably Gecko
	 */
	private static _doHitTestWithCaretPositionFromPoint(ctx: HitTestContext, coords: ClientCoordinates): HitTestResult {
		// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
		const hitResult: { offsetNode: Node; offset: number } = (<any>ctx.viewDomNode.ownerDocument).caretPositionFromPoint(coords.clientX, coords.clientY);

		if (hitResult.offsetNode.nodeType === hitResult.offsetNode.TEXT_NODE) {
			// offsetNode is expected to be the token text
			const parent1 = hitResult.offsetNode.parentNode; // expected to be the token span
			const parent2 = parent1 ? parent1.parentNode : null; // expected to be the view line container span
			const parent3 = parent2 ? parent2.parentNode : null; // expected to be the view line div
			const parent3ClassName = parent3 && parent3.nodeType === parent3.ELEMENT_NODE ? (<HTMLElement>parent3).className : null;

			if (parent3ClassName === ViewLine.CLASS_NAME) {
				return HitTestResult.createFromDOMInfo(ctx, <HTMLElement>hitResult.offsetNode.parentNode, hitResult.offset);
			} else {
				return new UnknownHitTestResult(<HTMLElement>hitResult.offsetNode.parentNode);
			}
		}

		// For inline decorations, Gecko sometimes returns the `<span>` of the line and the offset is the `<span>` with the inline decoration
		// Some other times, it returns the `<span>` with the inline decoration
		if (hitResult.offsetNode.nodeType === hitResult.offsetNode.ELEMENT_NODE) {
			const parent1 = hitResult.offsetNode.parentNode;
			const parent1ClassName = parent1 && parent1.nodeType === parent1.ELEMENT_NODE ? (<HTMLElement>parent1).className : null;
			const parent2 = parent1 ? parent1.parentNode : null;
			const parent2ClassName = parent2 && parent2.nodeType === parent2.ELEMENT_NODE ? (<HTMLElement>parent2).className : null;

			if (parent1ClassName === ViewLine.CLASS_NAME) {
				// it returned the `<span>` of the line and the offset is the `<span>` with the inline decoration
				const tokenSpan = hitResult.offsetNode.childNodes[Math.min(hitResult.offset, hitResult.offsetNode.childNodes.length - 1)];
				if (tokenSpan) {
					return HitTestResult.createFromDOMInfo(ctx, <HTMLElement>tokenSpan, 0);
				}
			} else if (parent2ClassName === ViewLine.CLASS_NAME) {
				// it returned the `<span>` with the inline decoration
				return HitTestResult.createFromDOMInfo(ctx, <HTMLElement>hitResult.offsetNode, 0);
			}
		}

		return new UnknownHitTestResult(<HTMLElement>hitResult.offsetNode);
	}

	private static _snapToSoftTabBoundary(position: Position, viewModel: IViewModel): Position {
		const lineContent = viewModel.getLineContent(position.lineNumber);
		const { tabSize } = viewModel.model.getOptions();
		const newPosition = AtomicTabMoveOperations.atomicPosition(lineContent, position.column - 1, tabSize, Direction.Nearest);
		if (newPosition !== -1) {
			return new Position(position.lineNumber, newPosition + 1);
		}
		return position;
	}

	public static doHitTest(ctx: HitTestContext, request: BareHitTestRequest): HitTestResult {

		let result: HitTestResult = new UnknownHitTestResult();
		// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
		if (typeof (<any>ctx.viewDomNode.ownerDocument).caretRangeFromPoint === 'function') {
			result = this._doHitTestWithCaretRangeFromPoint(ctx, request);
			// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
		} else if ((<any>ctx.viewDomNode.ownerDocument).caretPositionFromPoint) {
			result = this._doHitTestWithCaretPositionFromPoint(ctx, request.pos.toClientCoordinates(dom.getWindow(ctx.viewDomNode)));
		}
		if (result.type === HitTestResultType.Content) {
			const injectedText = ctx.viewModel.getInjectedTextAt(result.position);

			const normalizedPosition = ctx.viewModel.normalizePosition(result.position, PositionAffinity.None);
			if (injectedText || !normalizedPosition.equals(result.position)) {
				result = new ContentHitTestResult(normalizedPosition, result.spanNode, injectedText);
			}
		}
		return result;
	}
}

function shadowCaretRangeFromPoint(shadowRoot: ShadowRoot, x: number, y: number): Range {
	const range = document.createRange();

	// Get the element under the point
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	let el: HTMLElement | null = (<any>shadowRoot).elementFromPoint(x, y);
	// When el is not null, it may be div.monaco-mouse-cursor-text Element, which has not childNodes, we don't need to handle it.
	if (el?.hasChildNodes()) {
		// Get the last child of the element until its firstChild is a text node
		// This assumes that the pointer is on the right of the line, out of the tokens
		// and that we want to get the offset of the last token of the line
		while (el && el.firstChild && el.firstChild.nodeType !== el.firstChild.TEXT_NODE && el.lastChild && el.lastChild.firstChild) {
			el = <HTMLElement>el.lastChild;
		}

		// Grab its rect
		const rect = el.getBoundingClientRect();

		// And its font (the computed shorthand font property might be empty, see #3217)
		const elWindow = dom.getWindow(el);
		const fontStyle = elWindow.getComputedStyle(el, null).getPropertyValue('font-style');
		const fontVariant = elWindow.getComputedStyle(el, null).getPropertyValue('font-variant');
		const fontWeight = elWindow.getComputedStyle(el, null).getPropertyValue('font-weight');
		const fontSize = elWindow.getComputedStyle(el, null).getPropertyValue('font-size');
		const lineHeight = elWindow.getComputedStyle(el, null).getPropertyValue('line-height');
		const fontFamily = elWindow.getComputedStyle(el, null).getPropertyValue('font-family');
		const font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`;

		// And also its txt content
		const text = el.innerText;

		// Position the pixel cursor at the left of the element
		let pixelCursor = rect.left;
		let offset = 0;
		let step: number;

		// If the point is on the right of the box put the cursor after the last character
		if (x > rect.left + rect.width) {
			offset = text.length;
		} else {
			const charWidthReader = CharWidthReader.getInstance();
			// Goes through all the characters of the innerText, and checks if the x of the point
			// belongs to the character.
			for (let i = 0; i < text.length + 1; i++) {
				// The step is half the width of the character
				step = charWidthReader.getCharWidth(text.charAt(i), font) / 2;
				// Move to the center of the character
				pixelCursor += step;
				// If the x of the point is smaller that the position of the cursor, the point is over that character
				if (x < pixelCursor) {
					offset = i;
					break;
				}
				// Move between the current character and the next
				pixelCursor += step;
			}
		}

		// Creates a range with the text node of the element and set the offset found
		range.setStart(el.firstChild!, offset);
		range.setEnd(el.firstChild!, offset);
	}

	return range;
}

class CharWidthReader {
	private static _INSTANCE: CharWidthReader | null = null;

	public static getInstance(): CharWidthReader {
		if (!CharWidthReader._INSTANCE) {
			CharWidthReader._INSTANCE = new CharWidthReader();
		}
		return CharWidthReader._INSTANCE;
	}

	private readonly _cache: { [cacheKey: string]: number };
	private readonly _canvas: HTMLCanvasElement;

	private constructor() {
		this._cache = {};
		this._canvas = document.createElement('canvas');
	}

	public getCharWidth(char: string, font: string): number {
		const cacheKey = char + font;
		if (this._cache[cacheKey]) {
			return this._cache[cacheKey];
		}

		const context = this._canvas.getContext('2d')!;
		context.font = font;
		const metrics = context.measureText(char);
		const width = metrics.width;
		this._cache[cacheKey] = width;
		return width;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/pointerHandler.ts]---
Location: vscode-main/src/vs/editor/browser/controller/pointerHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserFeatures } from '../../../base/browser/canIUse.js';
import * as dom from '../../../base/browser/dom.js';
import { EventType, Gesture, GestureEvent } from '../../../base/browser/touch.js';
import { mainWindow } from '../../../base/browser/window.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import * as platform from '../../../base/common/platform.js';
import { IPointerHandlerHelper, MouseHandler } from './mouseHandler.js';
import { NavigationCommandRevealType } from '../coreCommands.js';
import { IMouseTarget, MouseTargetType } from '../editorBrowser.js';
import { EditorMouseEvent, EditorPointerEventFactory } from '../editorDom.js';
import { ViewController } from '../view/viewController.js';
import { ViewContext } from '../../common/viewModel/viewContext.js';
import { TextAreaSyntethicEvents } from './editContext/textArea/textAreaEditContextInput.js';

/**
 * Currently only tested on iOS 13/ iPadOS.
 */
export class PointerEventHandler extends MouseHandler {
	private _lastPointerType: string;
	constructor(context: ViewContext, viewController: ViewController, viewHelper: IPointerHandlerHelper) {
		super(context, viewController, viewHelper);

		this._register(Gesture.addTarget(this.viewHelper.linesContentDomNode));
		this._register(dom.addDisposableListener(this.viewHelper.linesContentDomNode, EventType.Tap, (e) => this.onTap(e)));
		this._register(dom.addDisposableListener(this.viewHelper.linesContentDomNode, EventType.Change, (e) => this.onChange(e)));
		this._register(dom.addDisposableListener(this.viewHelper.linesContentDomNode, EventType.Contextmenu, (e: MouseEvent) => this._onContextMenu(new EditorMouseEvent(e, false, this.viewHelper.viewDomNode), false)));

		this._lastPointerType = 'mouse';

		this._register(dom.addDisposableListener(this.viewHelper.linesContentDomNode, 'pointerdown', (e: PointerEvent) => {
			const pointerType = e.pointerType;
			if (pointerType === 'mouse') {
				this._lastPointerType = 'mouse';
				return;
			} else if (pointerType === 'touch') {
				this._lastPointerType = 'touch';
			} else {
				this._lastPointerType = 'pen';
			}
		}));

		// PonterEvents
		const pointerEvents = new EditorPointerEventFactory(this.viewHelper.viewDomNode);

		this._register(pointerEvents.onPointerMove(this.viewHelper.viewDomNode, (e) => this._onMouseMove(e)));
		this._register(pointerEvents.onPointerUp(this.viewHelper.viewDomNode, (e) => this._onMouseUp(e)));
		this._register(pointerEvents.onPointerLeave(this.viewHelper.viewDomNode, (e) => this._onMouseLeave(e)));
		this._register(pointerEvents.onPointerDown(this.viewHelper.viewDomNode, (e, pointerId) => this._onMouseDown(e, pointerId)));
	}

	private onTap(event: GestureEvent): void {
		if (!event.initialTarget || !this.viewHelper.linesContentDomNode.contains(event.initialTarget as HTMLElement)) {
			return;
		}

		event.preventDefault();
		this.viewHelper.focusTextArea();
		this._dispatchGesture(event, /*inSelectionMode*/false);
	}

	private onChange(event: GestureEvent): void {
		if (this._lastPointerType === 'touch') {
			this._context.viewModel.viewLayout.deltaScrollNow(-event.translationX, -event.translationY);
		}
		if (this._lastPointerType === 'pen') {
			this._dispatchGesture(event, /*inSelectionMode*/true);
		}
	}

	private _dispatchGesture(event: GestureEvent, inSelectionMode: boolean): void {
		const target = this._createMouseTarget(new EditorMouseEvent(event, false, this.viewHelper.viewDomNode), false);
		if (target.position) {
			this.viewController.dispatchMouse({
				position: target.position,
				mouseColumn: target.position.column,
				startedOnLineNumbers: false,
				revealType: NavigationCommandRevealType.Minimal,
				mouseDownCount: event.tapCount,
				inSelectionMode,
				altKey: false,
				ctrlKey: false,
				metaKey: false,
				shiftKey: false,
				leftButton: false,
				middleButton: false,
				onInjectedText: target.type === MouseTargetType.CONTENT_TEXT && target.detail.injectedText !== null
			});
		}
	}

	protected override _onMouseDown(e: EditorMouseEvent, pointerId: number): void {
		if ((e.browserEvent as PointerEvent).pointerType === 'touch') {
			return;
		}

		super._onMouseDown(e, pointerId);
	}
}

class TouchHandler extends MouseHandler {

	constructor(context: ViewContext, viewController: ViewController, viewHelper: IPointerHandlerHelper) {
		super(context, viewController, viewHelper);

		this._register(Gesture.addTarget(this.viewHelper.linesContentDomNode));

		this._register(dom.addDisposableListener(this.viewHelper.linesContentDomNode, EventType.Tap, (e) => this.onTap(e)));
		this._register(dom.addDisposableListener(this.viewHelper.linesContentDomNode, EventType.Change, (e) => this.onChange(e)));
		this._register(dom.addDisposableListener(this.viewHelper.linesContentDomNode, EventType.Contextmenu, (e: MouseEvent) => this._onContextMenu(new EditorMouseEvent(e, false, this.viewHelper.viewDomNode), false)));
	}

	private onTap(event: GestureEvent): void {
		event.preventDefault();

		this.viewHelper.focusTextArea();

		const target = this._createMouseTarget(new EditorMouseEvent(event, false, this.viewHelper.viewDomNode), false);

		if (target.position) {
			// Send the tap event also to the <textarea> (for input purposes)
			const event = document.createEvent('CustomEvent');
			event.initEvent(TextAreaSyntethicEvents.Tap, false, true);
			this.viewHelper.dispatchTextAreaEvent(event);

			this.viewController.moveTo(target.position, NavigationCommandRevealType.Minimal);
		}
	}

	private onChange(e: GestureEvent): void {
		this._context.viewModel.viewLayout.deltaScrollNow(-e.translationX, -e.translationY);
	}
}

export class PointerHandler extends Disposable {
	private readonly handler: MouseHandler;

	constructor(context: ViewContext, viewController: ViewController, viewHelper: IPointerHandlerHelper) {
		super();
		const isPhone = platform.isIOS || (platform.isAndroid && platform.isMobile);
		if (isPhone && BrowserFeatures.pointerEvents) {
			this.handler = this._register(new PointerEventHandler(context, viewController, viewHelper));
		} else if (mainWindow.TouchEvent) {
			this.handler = this._register(new TouchHandler(context, viewController, viewHelper));
		} else {
			this.handler = this._register(new MouseHandler(context, viewController, viewHelper));
		}
	}

	public getTargetAtClientPoint(clientX: number, clientY: number): IMouseTarget | null {
		return this.handler.getTargetAtClientPoint(clientX, clientY);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/clipboardUtils.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/clipboardUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IViewModel } from '../../../common/viewModel.js';
import { Range } from '../../../common/core/range.js';
import { isWindows } from '../../../../base/common/platform.js';
import { Mimes } from '../../../../base/common/mime.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import { ILogService, LogLevel } from '../../../../platform/log/common/log.js';
import { EditorOption, IComputedEditorOptions } from '../../../common/config/editorOptions.js';
import { generateUuid } from '../../../../base/common/uuid.js';

export function ensureClipboardGetsEditorSelection(e: ClipboardEvent, context: ViewContext, logService: ILogService, isFirefox: boolean): void {
	const viewModel = context.viewModel;
	const options = context.configuration.options;
	let id: string | undefined = undefined;
	if (logService.getLevel() === LogLevel.Trace) {
		id = generateUuid();
	}

	const { dataToCopy, storedMetadata } = generateDataToCopyAndStoreInMemory(viewModel, options, id, isFirefox);

	// !!!!!
	// This is a workaround for what we think is an Electron bug where
	// execCommand('copy') does not always work (it does not fire a clipboard event)
	// !!!!!
	// We signal that we have executed a copy command
	CopyOptions.electronBugWorkaroundCopyEventHasFired = true;

	e.preventDefault();
	if (e.clipboardData) {
		ClipboardEventUtils.setTextData(e.clipboardData, dataToCopy.text, dataToCopy.html, storedMetadata);
	}
	logService.trace('ensureClipboardGetsEditorSelection with id : ', id, ' with text.length: ', dataToCopy.text.length);
}

export function generateDataToCopyAndStoreInMemory(viewModel: IViewModel, options: IComputedEditorOptions, id: string | undefined, isFirefox: boolean) {
	const emptySelectionClipboard = options.get(EditorOption.emptySelectionClipboard);
	const copyWithSyntaxHighlighting = options.get(EditorOption.copyWithSyntaxHighlighting);
	const selections = viewModel.getCursorStates().map(cursorState => cursorState.modelState.selection);
	const dataToCopy = getDataToCopy(viewModel, selections, emptySelectionClipboard, copyWithSyntaxHighlighting);
	const storedMetadata: ClipboardStoredMetadata = {
		version: 1,
		id,
		isFromEmptySelection: dataToCopy.isFromEmptySelection,
		multicursorText: dataToCopy.multicursorText,
		mode: dataToCopy.mode
	};
	InMemoryClipboardMetadataManager.INSTANCE.set(
		// When writing "LINE\r\n" to the clipboard and then pasting,
		// Firefox pastes "LINE\n", so let's work around this quirk
		(isFirefox ? dataToCopy.text.replace(/\r\n/g, '\n') : dataToCopy.text),
		storedMetadata
	);
	return { dataToCopy, storedMetadata };
}

function getDataToCopy(viewModel: IViewModel, modelSelections: Range[], emptySelectionClipboard: boolean, copyWithSyntaxHighlighting: boolean): ClipboardDataToCopy {
	const rawTextToCopy = viewModel.getPlainTextToCopy(modelSelections, emptySelectionClipboard, isWindows);
	const newLineCharacter = viewModel.model.getEOL();

	const isFromEmptySelection = (emptySelectionClipboard && modelSelections.length === 1 && modelSelections[0].isEmpty());
	const multicursorText = (Array.isArray(rawTextToCopy) ? rawTextToCopy : null);
	const text = (Array.isArray(rawTextToCopy) ? rawTextToCopy.join(newLineCharacter) : rawTextToCopy);

	let html: string | null | undefined = undefined;
	let mode: string | null = null;
	if (CopyOptions.forceCopyWithSyntaxHighlighting || (copyWithSyntaxHighlighting && text.length < 65536)) {
		const richText = viewModel.getRichTextToCopy(modelSelections, emptySelectionClipboard);
		if (richText) {
			html = richText.html;
			mode = richText.mode;
		}
	}
	const dataToCopy: ClipboardDataToCopy = {
		isFromEmptySelection,
		multicursorText,
		text,
		html,
		mode
	};
	return dataToCopy;
}

export interface IPasteData {
	text: string;
	pasteOnNewLine: boolean;
	multicursorText: string[] | null;
	mode: string | null;
}

export function computePasteData(e: ClipboardEvent, context: ViewContext, logService: ILogService): IPasteData | undefined {
	e.preventDefault();
	if (!e.clipboardData) {
		return;
	}
	let [text, metadata] = ClipboardEventUtils.getTextData(e.clipboardData);
	logService.trace('computePasteData with id : ', metadata?.id, ' with text.length: ', text.length);
	if (!text) {
		return;
	}
	PasteOptions.electronBugWorkaroundPasteEventHasFired = true;
	metadata = metadata || InMemoryClipboardMetadataManager.INSTANCE.get(text);
	return getPasteDataFromMetadata(text, metadata, context);
}

export function getPasteDataFromMetadata(text: string, metadata: ClipboardStoredMetadata | null, context: ViewContext): IPasteData {
	let pasteOnNewLine = false;
	let multicursorText: string[] | null = null;
	let mode: string | null = null;
	if (metadata) {
		const options = context.configuration.options;
		const emptySelectionClipboard = options.get(EditorOption.emptySelectionClipboard);
		pasteOnNewLine = emptySelectionClipboard && !!metadata.isFromEmptySelection;
		multicursorText = typeof metadata.multicursorText !== 'undefined' ? metadata.multicursorText : null;
		mode = metadata.mode;
	}
	return { text, pasteOnNewLine, multicursorText, mode };
}
/**
 * Every time we write to the clipboard, we record a bit of extra metadata here.
 * Every time we read from the cipboard, if the text matches our last written text,
 * we can fetch the previous metadata.
 */
export class InMemoryClipboardMetadataManager {
	public static readonly INSTANCE = new InMemoryClipboardMetadataManager();

	private _lastState: InMemoryClipboardMetadata | null;

	constructor() {
		this._lastState = null;
	}

	public set(lastCopiedValue: string, data: ClipboardStoredMetadata): void {
		this._lastState = { lastCopiedValue, data };
	}

	public get(pastedText: string): ClipboardStoredMetadata | null {
		if (this._lastState && this._lastState.lastCopiedValue === pastedText) {
			// match!
			return this._lastState.data;
		}
		this._lastState = null;
		return null;
	}
}

export interface ClipboardDataToCopy {
	isFromEmptySelection: boolean;
	multicursorText: string[] | null | undefined;
	text: string;
	html: string | null | undefined;
	mode: string | null;
}

export interface ClipboardStoredMetadata {
	version: 1;
	id: string | undefined;
	isFromEmptySelection: boolean | undefined;
	multicursorText: string[] | null | undefined;
	mode: string | null;
}

export const CopyOptions = {
	forceCopyWithSyntaxHighlighting: false,
	electronBugWorkaroundCopyEventHasFired: false
};

export const PasteOptions = {
	electronBugWorkaroundPasteEventHasFired: false
};

interface InMemoryClipboardMetadata {
	lastCopiedValue: string;
	data: ClipboardStoredMetadata;
}

export const ClipboardEventUtils = {

	getTextData(clipboardData: DataTransfer): [string, ClipboardStoredMetadata | null] {
		const text = clipboardData.getData(Mimes.text);
		let metadata: ClipboardStoredMetadata | null = null;
		const rawmetadata = clipboardData.getData('vscode-editor-data');
		if (typeof rawmetadata === 'string') {
			try {
				metadata = <ClipboardStoredMetadata>JSON.parse(rawmetadata);
				if (metadata.version !== 1) {
					metadata = null;
				}
			} catch (err) {
				// no problem!
			}
		}
		if (text.length === 0 && metadata === null && clipboardData.files.length > 0) {
			// no textual data pasted, generate text from file names
			const files: File[] = Array.prototype.slice.call(clipboardData.files, 0);
			return [files.map(file => file.name).join('\n'), null];
		}
		return [text, metadata];
	},

	setTextData(clipboardData: DataTransfer, text: string, html: string | null | undefined, metadata: ClipboardStoredMetadata): void {
		clipboardData.setData(Mimes.text, text);
		if (typeof html === 'string') {
			clipboardData.setData('text/html', html);
		}
		clipboardData.setData('vscode-editor-data', JSON.stringify(metadata));
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/editContext.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/editContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode } from '../../../../base/browser/fastDomNode.js';
import { Position } from '../../../common/core/position.js';
import { IEditorAriaOptions } from '../../editorBrowser.js';
import { ViewPart } from '../../view/viewPart.js';

export abstract class AbstractEditContext extends ViewPart {
	abstract domNode: FastDomNode<HTMLElement>;
	abstract focus(): void;
	abstract isFocused(): boolean;
	abstract refreshFocusState(): void;
	abstract setAriaOptions(options: IEditorAriaOptions): void;
	abstract getLastRenderData(): Position | null;
	abstract writeScreenReaderContent(reason: string): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/screenReaderUtils.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/screenReaderUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EndOfLinePreference } from '../../../common/model.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection, SelectionDirection } from '../../../common/core/selection.js';
import { EditorOption, IComputedEditorOptions } from '../../../common/config/editorOptions.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { AccessibilitySupport } from '../../../../platform/accessibility/common/accessibility.js';
import * as nls from '../../../../nls.js';
import { ISimpleModel } from '../../../common/viewModel/screenReaderSimpleModel.js';

export interface IPagedScreenReaderStrategy<T> {
	fromEditorSelection(model: ISimpleModel, selection: Selection, linesPerPage: number, trimLongText: boolean): T;
}

export interface ISimpleScreenReaderContentState {
	value: string;

	/** the offset where selection starts inside `value` */
	selectionStart: number;

	/** the offset where selection ends inside `value` */
	selectionEnd: number;

	/** the editor range in the view coordinate system that matches the selection inside `value` */
	selection: Selection;

	/** the position of the start of the `value` in the editor */
	startPositionWithinEditor: Position;

	/** the visible line count (wrapped, not necessarily matching \n characters) for the text in `value` before `selectionStart` */
	newlineCountBeforeSelection: number;
}

export class SimplePagedScreenReaderStrategy implements IPagedScreenReaderStrategy<ISimpleScreenReaderContentState> {
	private _getPageOfLine(lineNumber: number, linesPerPage: number): number {
		return Math.floor((lineNumber - 1) / linesPerPage);
	}

	private _getRangeForPage(page: number, linesPerPage: number): Range {
		const offset = page * linesPerPage;
		const startLineNumber = offset + 1;
		const endLineNumber = offset + linesPerPage;
		return new Range(startLineNumber, 1, endLineNumber + 1, 1);
	}

	public fromEditorSelection(model: ISimpleModel, selection: Selection, linesPerPage: number, trimLongText: boolean): ISimpleScreenReaderContentState {
		// Chromium handles very poorly text even of a few thousand chars
		// Cut text to avoid stalling the entire UI
		const LIMIT_CHARS = 500;

		const selectionStartPage = this._getPageOfLine(selection.startLineNumber, linesPerPage);
		const selectionStartPageRange = this._getRangeForPage(selectionStartPage, linesPerPage);

		const selectionEndPage = this._getPageOfLine(selection.endLineNumber, linesPerPage);
		const selectionEndPageRange = this._getRangeForPage(selectionEndPage, linesPerPage);

		let pretextRange = selectionStartPageRange.intersectRanges(new Range(1, 1, selection.startLineNumber, selection.startColumn))!;
		if (trimLongText && model.getValueLengthInRange(pretextRange, EndOfLinePreference.LF) > LIMIT_CHARS) {
			const pretextStart = model.modifyPosition(pretextRange.getEndPosition(), -LIMIT_CHARS);
			pretextRange = Range.fromPositions(pretextStart, pretextRange.getEndPosition());
		}
		const pretext = model.getValueInRange(pretextRange, EndOfLinePreference.LF);

		const lastLine = model.getLineCount();
		const lastLineMaxColumn = model.getLineMaxColumn(lastLine);
		let posttextRange = selectionEndPageRange.intersectRanges(new Range(selection.endLineNumber, selection.endColumn, lastLine, lastLineMaxColumn))!;
		if (trimLongText && model.getValueLengthInRange(posttextRange, EndOfLinePreference.LF) > LIMIT_CHARS) {
			const posttextEnd = model.modifyPosition(posttextRange.getStartPosition(), LIMIT_CHARS);
			posttextRange = Range.fromPositions(posttextRange.getStartPosition(), posttextEnd);
		}
		const posttext = model.getValueInRange(posttextRange, EndOfLinePreference.LF);


		let text: string;
		if (selectionStartPage === selectionEndPage || selectionStartPage + 1 === selectionEndPage) {
			// take full selection
			text = model.getValueInRange(selection, EndOfLinePreference.LF);
		} else {
			const selectionRange1 = selectionStartPageRange.intersectRanges(selection)!;
			const selectionRange2 = selectionEndPageRange.intersectRanges(selection)!;
			text = (
				model.getValueInRange(selectionRange1, EndOfLinePreference.LF)
				+ String.fromCharCode(8230)
				+ model.getValueInRange(selectionRange2, EndOfLinePreference.LF)
			);
		}
		if (trimLongText && text.length > 2 * LIMIT_CHARS) {
			text = text.substring(0, LIMIT_CHARS) + String.fromCharCode(8230) + text.substring(text.length - LIMIT_CHARS, text.length);
		}

		let selectionStart: number;
		let selectionEnd: number;
		if (selection.getDirection() === SelectionDirection.LTR) {
			selectionStart = pretext.length;
			selectionEnd = pretext.length + text.length;
		} else {
			selectionEnd = pretext.length;
			selectionStart = pretext.length + text.length;
		}
		return {
			value: pretext + text + posttext,
			selection: selection,
			selectionStart,
			selectionEnd,
			startPositionWithinEditor: pretextRange.getStartPosition(),
			newlineCountBeforeSelection: pretextRange.endLineNumber - pretextRange.startLineNumber,
		};
	}
}

export function ariaLabelForScreenReaderContent(options: IComputedEditorOptions, keybindingService: IKeybindingService) {
	const accessibilitySupport = options.get(EditorOption.accessibilitySupport);
	if (accessibilitySupport === AccessibilitySupport.Disabled) {

		const toggleKeybindingLabel = keybindingService.lookupKeybinding('editor.action.toggleScreenReaderAccessibilityMode')?.getAriaLabel();
		const runCommandKeybindingLabel = keybindingService.lookupKeybinding('workbench.action.showCommands')?.getAriaLabel();
		const keybindingEditorKeybindingLabel = keybindingService.lookupKeybinding('workbench.action.openGlobalKeybindings')?.getAriaLabel();
		const editorNotAccessibleMessage = nls.localize('accessibilityModeOff', "The editor is not accessible at this time.");
		if (toggleKeybindingLabel) {
			return nls.localize('accessibilityOffAriaLabel', "{0} To enable screen reader optimized mode, use {1}", editorNotAccessibleMessage, toggleKeybindingLabel);
		} else if (runCommandKeybindingLabel) {
			return nls.localize('accessibilityOffAriaLabelNoKb', "{0} To enable screen reader optimized mode, open the quick pick with {1} and run the command Toggle Screen Reader Accessibility Mode, which is currently not triggerable via keyboard.", editorNotAccessibleMessage, runCommandKeybindingLabel);
		} else if (keybindingEditorKeybindingLabel) {
			return nls.localize('accessibilityOffAriaLabelNoKbs', "{0} Please assign a keybinding for the command Toggle Screen Reader Accessibility Mode by accessing the keybindings editor with {1} and run it.", editorNotAccessibleMessage, keybindingEditorKeybindingLabel);
		} else {
			// SOS
			return editorNotAccessibleMessage;
		}
	}
	return options.get(EditorOption.ariaLabel);
}

export function newlinecount(text: string): number {
	let result = 0;
	let startIndex = -1;
	do {
		startIndex = text.indexOf('\n', startIndex + 1);
		if (startIndex === -1) {
			break;
		}
		result++;
	} while (true);
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/native/debugEditContext.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/native/debugEditContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditContext } from './editContextFactory.js';

const COLOR_FOR_CONTROL_BOUNDS = 'blue';
const COLOR_FOR_SELECTION_BOUNDS = 'red';
const COLOR_FOR_CHARACTER_BOUNDS = 'green';

export class DebugEditContext {
	private _isDebugging = true;
	private _controlBounds: DOMRect | null = null;
	private _selectionBounds: DOMRect | null = null;
	private _characterBounds: { rangeStart: number; characterBounds: DOMRect[] } | null = null;

	private _editContext: EditContext;

	constructor(window: Window, options?: EditContextInit | undefined) {
		this._editContext = EditContext.create(window, options);
	}

	get text(): DOMString {
		return this._editContext.text;
	}

	get selectionStart(): number {
		return this._editContext.selectionStart;
	}

	get selectionEnd(): number {
		return this._editContext.selectionEnd;
	}

	get characterBoundsRangeStart(): number {
		return this._editContext.characterBoundsRangeStart;
	}

	updateText(rangeStart: number, rangeEnd: number, text: string): void {
		this._editContext.updateText(rangeStart, rangeEnd, text);
		this.renderDebug();
	}
	updateSelection(start: number, end: number): void {
		this._editContext.updateSelection(start, end);
		this.renderDebug();
	}
	updateControlBounds(controlBounds: DOMRect): void {
		this._editContext.updateControlBounds(controlBounds);
		this._controlBounds = controlBounds;
		this.renderDebug();
	}
	updateSelectionBounds(selectionBounds: DOMRect): void {
		this._editContext.updateSelectionBounds(selectionBounds);
		this._selectionBounds = selectionBounds;
		this.renderDebug();
	}
	updateCharacterBounds(rangeStart: number, characterBounds: DOMRect[]): void {
		this._editContext.updateCharacterBounds(rangeStart, characterBounds);
		this._characterBounds = { rangeStart, characterBounds };
		this.renderDebug();
	}
	attachedElements(): HTMLElement[] {
		return this._editContext.attachedElements();
	}

	characterBounds(): DOMRect[] {
		return this._editContext.characterBounds();
	}

	private readonly _ontextupdateWrapper = new EventListenerWrapper('textupdate', this);
	private readonly _ontextformatupdateWrapper = new EventListenerWrapper('textformatupdate', this);
	private readonly _oncharacterboundsupdateWrapper = new EventListenerWrapper('characterboundsupdate', this);
	private readonly _oncompositionstartWrapper = new EventListenerWrapper('compositionstart', this);
	private readonly _oncompositionendWrapper = new EventListenerWrapper('compositionend', this);

	get ontextupdate(): EventHandler | null { return this._ontextupdateWrapper.eventHandler; }
	set ontextupdate(value: EventHandler | null) { this._ontextupdateWrapper.eventHandler = value; }
	get ontextformatupdate(): EventHandler | null { return this._ontextformatupdateWrapper.eventHandler; }
	set ontextformatupdate(value: EventHandler | null) { this._ontextformatupdateWrapper.eventHandler = value; }
	get oncharacterboundsupdate(): EventHandler | null { return this._oncharacterboundsupdateWrapper.eventHandler; }
	set oncharacterboundsupdate(value: EventHandler | null) { this._oncharacterboundsupdateWrapper.eventHandler = value; }
	get oncompositionstart(): EventHandler | null { return this._oncompositionstartWrapper.eventHandler; }
	set oncompositionstart(value: EventHandler | null) { this._oncompositionstartWrapper.eventHandler = value; }
	get oncompositionend(): EventHandler | null { return this._oncompositionendWrapper.eventHandler; }
	set oncompositionend(value: EventHandler | null) { this._oncompositionendWrapper.eventHandler = value; }


	private readonly _listenerMap = new Map<EventListenerOrEventListenerObject, EventListenerOrEventListenerObject>();

	addEventListener<K extends keyof EditContextEventHandlersEventMap>(type: K, listener: (this: GlobalEventHandlers, ev: EditContextEventHandlersEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
	addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
		if (!listener) { return; }

		const debugListener = (event: Event) => {
			if (this._isDebugging) {
				this.renderDebug();
				console.log(`DebugEditContex.on_${type}`, event);
			}
			if (typeof listener === 'function') {
				listener.call(this, event);
			} else if (typeof listener === 'object' && 'handleEvent' in listener) {
				listener.handleEvent(event);
			}
		};
		this._listenerMap.set(listener, debugListener);
		this._editContext.addEventListener(type, debugListener, options);
		this.renderDebug();
	}

	removeEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions | undefined): void {
		if (!listener) { return; }
		const debugListener = this._listenerMap.get(listener);
		if (debugListener) {
			this._editContext.removeEventListener(type, debugListener, options);
			this._listenerMap.delete(listener);
		}
		this.renderDebug();
	}

	dispatchEvent(event: Event): boolean {
		return this._editContext.dispatchEvent(event);
	}

	public startDebugging() {
		this._isDebugging = true;
		this.renderDebug();
	}

	public endDebugging() {
		this._isDebugging = false;
		this.renderDebug();
	}

	private _disposables: { dispose(): void }[] = [];

	public renderDebug() {
		this._disposables.forEach(d => d.dispose());
		this._disposables = [];
		if (!this._isDebugging || this._listenerMap.size === 0) {
			return;
		}
		if (this._controlBounds) {
			this._disposables.push(createRect(this._controlBounds, COLOR_FOR_CONTROL_BOUNDS));
		}
		if (this._selectionBounds) {
			this._disposables.push(createRect(this._selectionBounds, COLOR_FOR_SELECTION_BOUNDS));
		}
		if (this._characterBounds) {
			for (const rect of this._characterBounds.characterBounds) {
				this._disposables.push(createRect(rect, COLOR_FOR_CHARACTER_BOUNDS));
			}
		}
		this._disposables.push(createDiv(this._editContext.text, this._editContext.selectionStart, this._editContext.selectionEnd));
	}
}

function createDiv(text: string, selectionStart: number, selectionEnd: number) {
	const ret = document.createElement('div');
	ret.className = 'debug-rect-marker';
	ret.style.position = 'absolute';
	ret.style.zIndex = '999999999';
	ret.style.bottom = '50px';
	ret.style.left = '60px';
	ret.style.backgroundColor = 'white';
	ret.style.border = '1px solid black';
	ret.style.padding = '5px';
	ret.style.whiteSpace = 'pre';
	ret.style.font = '12px monospace';
	ret.style.pointerEvents = 'none';

	const before = text.substring(0, selectionStart);
	const selected = text.substring(selectionStart, selectionEnd) || '|';
	const after = text.substring(selectionEnd) + ' ';

	const beforeNode = document.createTextNode(before);
	ret.appendChild(beforeNode);

	const selectedNode = document.createElement('span');
	selectedNode.style.backgroundColor = 'yellow';
	selectedNode.appendChild(document.createTextNode(selected));

	selectedNode.style.minWidth = '2px';
	selectedNode.style.minHeight = '16px';
	ret.appendChild(selectedNode);

	const afterNode = document.createTextNode(after);
	ret.appendChild(afterNode);

	// eslint-disable-next-line no-restricted-syntax
	document.body.appendChild(ret);

	return {
		dispose: () => {
			ret.remove();
		}
	};
}

function createRect(rect: DOMRect, color: 'green' | 'blue' | 'red') {
	const ret = document.createElement('div');
	ret.className = 'debug-rect-marker';
	ret.style.position = 'absolute';
	ret.style.zIndex = '999999999';
	ret.style.outline = `2px solid ${color}`;
	ret.style.pointerEvents = 'none';

	ret.style.top = rect.top + 'px';
	ret.style.left = rect.left + 'px';
	ret.style.width = rect.width + 'px';
	ret.style.height = rect.height + 'px';

	// eslint-disable-next-line no-restricted-syntax
	document.body.appendChild(ret);

	return {
		dispose: () => {
			ret.remove();
		}
	};
}

class EventListenerWrapper {
	private _eventHandler: EventHandler | null = null;

	constructor(
		private readonly _eventType: string,
		private readonly _target: EventTarget,
	) {
	}

	get eventHandler(): EventHandler | null {
		return this._eventHandler;
	}

	set eventHandler(value: EventHandler | null) {
		if (this._eventHandler) {
			this._target.removeEventListener(this._eventType, this._eventHandler);
		}
		this._eventHandler = value;
		if (value) {
			this._target.addEventListener(this._eventType, value);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/native/editContextFactory.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/native/editContextFactory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


export namespace EditContext {

	/**
	 * Create an edit context.
	 */
	export function create(window: Window, options?: EditContextInit): EditContext {
		return new (window as unknown as { EditContext: new (options?: EditContextInit) => EditContext }).EditContext(options);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/native/nativeEditContext.css]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/native/nativeEditContext.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .native-edit-context {
	margin: 0;
	padding: 0;
	position: absolute;
	overflow-y: scroll;
	scrollbar-width: none;
	z-index: -10;
	white-space: pre-wrap;
}

.monaco-editor .ime-text-area {
	min-width: 0;
	min-height: 0;
	margin: 0;
	padding: 0;
	position: absolute;
	outline: none !important;
	resize: none;
	border: none;
	overflow: hidden;
	color: transparent;
	background-color: transparent;
	z-index: -10;
}

.monaco-editor .edit-context-composition-none {
	background-color: transparent;
	border-bottom: none;
}

.monaco-editor :not(.hc-black, .hc-light) .edit-context-composition-secondary {
	border-bottom: 1px solid var(--vscode-editor-compositionBorder);
}

.monaco-editor :not(.hc-black, .hc-light) .edit-context-composition-primary {
	border-bottom: 2px solid var(--vscode-editor-compositionBorder);
}

.monaco-editor :is(.hc-black, .hc-light) .edit-context-composition-secondary {
	border: 1px solid var(--vscode-editor-compositionBorder);
}

.monaco-editor :is(.hc-black, .hc-light) .edit-context-composition-primary {
	border: 2px solid var(--vscode-editor-compositionBorder);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/native/nativeEditContext.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/native/nativeEditContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './nativeEditContext.css';
import { isFirefox } from '../../../../../base/browser/browser.js';
import { addDisposableListener, getActiveElement, getWindow, getWindowId } from '../../../../../base/browser/dom.js';
import { FastDomNode } from '../../../../../base/browser/fastDomNode.js';
import { StandardKeyboardEvent } from '../../../../../base/browser/keyboardEvent.js';
import { KeyCode } from '../../../../../base/common/keyCodes.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { EndOfLinePreference, IModelDeltaDecoration } from '../../../../common/model.js';
import { ViewConfigurationChangedEvent, ViewCursorStateChangedEvent, ViewDecorationsChangedEvent, ViewFlushedEvent, ViewLinesChangedEvent, ViewLinesDeletedEvent, ViewLinesInsertedEvent, ViewScrollChangedEvent, ViewZonesChangedEvent } from '../../../../common/viewEvents.js';
import { ViewContext } from '../../../../common/viewModel/viewContext.js';
import { RestrictedRenderingContext, RenderingContext, HorizontalPosition } from '../../../view/renderingContext.js';
import { ViewController } from '../../../view/viewController.js';
import { ensureClipboardGetsEditorSelection, computePasteData } from '../clipboardUtils.js';
import { AbstractEditContext } from '../editContext.js';
import { editContextAddDisposableListener, FocusTracker, ITypeData } from './nativeEditContextUtils.js';
import { ScreenReaderSupport } from './screenReaderSupport.js';
import { Range } from '../../../../common/core/range.js';
import { Selection } from '../../../../common/core/selection.js';
import { Position } from '../../../../common/core/position.js';
import { IVisibleRangeProvider } from '../textArea/textAreaEditContext.js';
import { PositionOffsetTransformer } from '../../../../common/core/text/positionToOffset.js';
import { EditContext } from './editContextFactory.js';
import { NativeEditContextRegistry } from './nativeEditContextRegistry.js';
import { IEditorAriaOptions } from '../../../editorBrowser.js';
import { isHighSurrogate, isLowSurrogate } from '../../../../../base/common/strings.js';
import { IME } from '../../../../../base/common/ime.js';
import { OffsetRange } from '../../../../common/core/ranges/offsetRange.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { inputLatency } from '../../../../../base/browser/performance.js';

// Corresponds to classes in nativeEditContext.css
enum CompositionClassName {
	NONE = 'edit-context-composition-none',
	SECONDARY = 'edit-context-composition-secondary',
	PRIMARY = 'edit-context-composition-primary',
}

interface ITextUpdateEvent {
	text: string;
	selectionStart: number;
	selectionEnd: number;
	updateRangeStart: number;
	updateRangeEnd: number;
}

export class NativeEditContext extends AbstractEditContext {

	// Text area used to handle paste events
	public readonly domNode: FastDomNode<HTMLDivElement>;
	private readonly _imeTextArea: FastDomNode<HTMLTextAreaElement>;
	private readonly _editContext: EditContext;
	private readonly _screenReaderSupport: ScreenReaderSupport;
	private _previousEditContextSelection: OffsetRange = new OffsetRange(0, 0);
	private _editContextPrimarySelection: Selection = new Selection(1, 1, 1, 1);

	// Overflow guard container
	private readonly _parent: HTMLElement;
	private _decorations: string[] = [];
	private _primarySelection: Selection = new Selection(1, 1, 1, 1);


	private _targetWindowId: number = -1;
	private _scrollTop: number = 0;
	private _scrollLeft: number = 0;

	private readonly _focusTracker: FocusTracker;

	constructor(
		ownerID: string,
		context: ViewContext,
		overflowGuardContainer: FastDomNode<HTMLElement>,
		private readonly _viewController: ViewController,
		private readonly _visibleRangeProvider: IVisibleRangeProvider,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILogService private readonly logService: ILogService
	) {
		super(context);

		this.domNode = new FastDomNode(document.createElement('div'));
		this.domNode.setClassName(`native-edit-context`);
		this._imeTextArea = new FastDomNode(document.createElement('textarea'));
		this._imeTextArea.setClassName(`ime-text-area`);
		this._imeTextArea.setAttribute('readonly', 'true');
		this._imeTextArea.setAttribute('tabindex', '-1');
		this._imeTextArea.setAttribute('aria-hidden', 'true');
		this.domNode.setAttribute('autocorrect', 'off');
		this.domNode.setAttribute('autocapitalize', 'off');
		this.domNode.setAttribute('autocomplete', 'off');
		this.domNode.setAttribute('spellcheck', 'false');

		this._updateDomAttributes();

		overflowGuardContainer.appendChild(this.domNode);
		overflowGuardContainer.appendChild(this._imeTextArea);
		this._parent = overflowGuardContainer.domNode;

		this._focusTracker = this._register(new FocusTracker(logService, this.domNode.domNode, (newFocusValue: boolean) => {
			logService.trace('NativeEditContext#handleFocusChange : ', newFocusValue);
			this._screenReaderSupport.handleFocusChange(newFocusValue);
			this._context.viewModel.setHasFocus(newFocusValue);
		}));

		const window = getWindow(this.domNode.domNode);
		this._editContext = EditContext.create(window);
		this.setEditContextOnDomNode();

		this._screenReaderSupport = this._register(instantiationService.createInstance(ScreenReaderSupport, this.domNode, context, this._viewController));

		this._register(addDisposableListener(this.domNode.domNode, 'copy', (e) => {
			this.logService.trace('NativeEditContext#copy');
			ensureClipboardGetsEditorSelection(e, this._context, this.logService, isFirefox);
		}));
		this._register(addDisposableListener(this.domNode.domNode, 'cut', (e) => {
			this.logService.trace('NativeEditContext#cut');
			// Pretend here we touched the text area, as the `cut` event will most likely
			// result in a `selectionchange` event which we want to ignore
			this._screenReaderSupport.onWillCut();
			ensureClipboardGetsEditorSelection(e, this._context, this.logService, isFirefox);
			this.logService.trace('NativeEditContext#cut (before viewController.cut)');
			this._viewController.cut();
		}));
		this._register(addDisposableListener(this.domNode.domNode, 'selectionchange', () => {
			inputLatency.onSelectionChange();
		}));

		this._register(addDisposableListener(this.domNode.domNode, 'keyup', (e) => this._onKeyUp(e)));
		this._register(addDisposableListener(this.domNode.domNode, 'keydown', async (e) => this._onKeyDown(e)));
		this._register(addDisposableListener(this._imeTextArea.domNode, 'keyup', (e) => this._onKeyUp(e)));
		this._register(addDisposableListener(this._imeTextArea.domNode, 'keydown', async (e) => this._onKeyDown(e)));
		this._register(addDisposableListener(this.domNode.domNode, 'beforeinput', async (e) => {
			inputLatency.onBeforeInput();
			if (e.inputType === 'insertParagraph' || e.inputType === 'insertLineBreak') {
				this._onType(this._viewController, { text: '\n', replacePrevCharCnt: 0, replaceNextCharCnt: 0, positionDelta: 0 });
			}
		}));
		this._register(addDisposableListener(this.domNode.domNode, 'paste', (e) => {
			this.logService.trace('NativeEditContext#paste');
			const pasteData = computePasteData(e, this._context, this.logService);
			if (!pasteData) {
				return;
			}
			this.logService.trace('NativeEditContext#paste (before viewController.paste)');
			this._viewController.paste(pasteData.text, pasteData.pasteOnNewLine, pasteData.multicursorText, pasteData.mode);
		}));

		// Edit context events
		this._register(editContextAddDisposableListener(this._editContext, 'textformatupdate', (e) => this._handleTextFormatUpdate(e)));
		this._register(editContextAddDisposableListener(this._editContext, 'characterboundsupdate', (e) => this._updateCharacterBounds(e)));
		let highSurrogateCharacter: string | undefined;
		this._register(editContextAddDisposableListener(this._editContext, 'textupdate', (e) => {
			inputLatency.onInput();
			const text = e.text;
			if (text.length === 1) {
				const charCode = text.charCodeAt(0);
				if (isHighSurrogate(charCode)) {
					highSurrogateCharacter = text;
					return;
				}
				if (isLowSurrogate(charCode) && highSurrogateCharacter) {
					const textUpdateEvent: ITextUpdateEvent = {
						text: highSurrogateCharacter + text,
						selectionEnd: e.selectionEnd,
						selectionStart: e.selectionStart,
						updateRangeStart: e.updateRangeStart - 1,
						updateRangeEnd: e.updateRangeEnd - 1
					};
					highSurrogateCharacter = undefined;
					this._emitTypeEvent(this._viewController, textUpdateEvent);
					return;
				}
			}
			this._emitTypeEvent(this._viewController, e);
		}));
		this._register(editContextAddDisposableListener(this._editContext, 'compositionstart', (e) => {
			this._updateEditContext();
			// Utlimately fires onDidCompositionStart() on the editor to notify for example suggest model of composition state
			// Updates the composition state of the cursor controller which determines behavior of typing with interceptors
			this._viewController.compositionStart();
			// Emits ViewCompositionStartEvent which can be depended on by ViewEventHandlers
			this._context.viewModel.onCompositionStart();
		}));
		this._register(editContextAddDisposableListener(this._editContext, 'compositionend', (e) => {
			this._updateEditContext();
			// Utlimately fires compositionEnd() on the editor to notify for example suggest model of composition state
			// Updates the composition state of the cursor controller which determines behavior of typing with interceptors
			this._viewController.compositionEnd();
			// Emits ViewCompositionEndEvent which can be depended on by ViewEventHandlers
			this._context.viewModel.onCompositionEnd();
		}));
		let reenableTracking: boolean = false;
		this._register(IME.onDidChange(() => {
			if (IME.enabled && reenableTracking) {
				this._focusTracker.resume();
				this.domNode.focus();
				reenableTracking = false;
			}
			if (!IME.enabled && this.isFocused()) {
				this._focusTracker.pause();
				this._imeTextArea.focus();
				reenableTracking = true;
			}
		}));
		this._register(NativeEditContextRegistry.register(ownerID, this));
	}

	// --- Public methods ---

	public override dispose(): void {
		// Force blue the dom node so can write in pane with no native edit context after disposal
		this.domNode.domNode.editContext = undefined;
		this.domNode.domNode.blur();
		this.domNode.domNode.remove();
		this._imeTextArea.domNode.remove();
		super.dispose();
	}

	public setAriaOptions(options: IEditorAriaOptions): void {
		this._screenReaderSupport.setAriaOptions(options);
	}

	/* Last rendered data needed for correct hit-testing and determining the mouse position.
	 * Without this, the selection will blink as incorrect mouse position is calculated */
	public getLastRenderData(): Position | null {
		return this._primarySelection.getPosition();
	}

	public override prepareRender(ctx: RenderingContext): void {
		this._screenReaderSupport.prepareRender(ctx);
		this._updateSelectionAndControlBoundsData(ctx);
	}

	public override onDidRender(): void {
		this._updateSelectionAndControlBoundsAfterRender();
	}

	public render(ctx: RestrictedRenderingContext): void {
		this._screenReaderSupport.render(ctx);
	}

	public override onCursorStateChanged(e: ViewCursorStateChangedEvent): boolean {
		this._primarySelection = e.modelSelections[0] ?? new Selection(1, 1, 1, 1);
		this._screenReaderSupport.onCursorStateChanged(e);
		this._updateEditContext();
		return true;
	}

	public override onConfigurationChanged(e: ViewConfigurationChangedEvent): boolean {
		this._screenReaderSupport.onConfigurationChanged(e);
		this._updateDomAttributes();
		return true;
	}

	public override onDecorationsChanged(e: ViewDecorationsChangedEvent): boolean {
		// true for inline decorations that can end up relayouting text
		return true;
	}

	public override onFlushed(e: ViewFlushedEvent): boolean {
		return true;
	}

	public override onLinesChanged(e: ViewLinesChangedEvent): boolean {
		this._updateEditContextOnLineChange(e.fromLineNumber, e.fromLineNumber + e.count - 1);
		return true;
	}

	public override onLinesDeleted(e: ViewLinesDeletedEvent): boolean {
		this._updateEditContextOnLineChange(e.fromLineNumber, e.toLineNumber);
		return true;
	}

	public override onLinesInserted(e: ViewLinesInsertedEvent): boolean {
		this._updateEditContextOnLineChange(e.fromLineNumber, e.toLineNumber);
		return true;
	}

	private _updateEditContextOnLineChange(fromLineNumber: number, toLineNumber: number): void {
		if (this._editContextPrimarySelection.endLineNumber < fromLineNumber || this._editContextPrimarySelection.startLineNumber > toLineNumber) {
			return;
		}
		this._updateEditContext();
	}

	public override onScrollChanged(e: ViewScrollChangedEvent): boolean {
		this._scrollLeft = e.scrollLeft;
		this._scrollTop = e.scrollTop;
		return true;
	}

	public override onZonesChanged(e: ViewZonesChangedEvent): boolean {
		return true;
	}

	public onWillPaste(): void {
		this.logService.trace('NativeEditContext#onWillPaste');
		this._onWillPaste();
	}

	private _onWillPaste(): void {
		this._screenReaderSupport.onWillPaste();
	}

	public onWillCopy(): void {
		this.logService.trace('NativeEditContext#onWillCopy');
		this.logService.trace('NativeEditContext#isFocused : ', this.domNode.domNode === getActiveElement());
	}

	public writeScreenReaderContent(): void {
		this._screenReaderSupport.writeScreenReaderContent();
	}

	public isFocused(): boolean {
		return this._focusTracker.isFocused;
	}

	public focus(): void {
		this._focusTracker.focus();

		// If the editor is off DOM, focus cannot be really set, so let's double check that we have managed to set the focus
		this.refreshFocusState();
	}

	public refreshFocusState(): void {
		this._focusTracker.refreshFocusState();
	}

	// TODO: added as a workaround fix for https://github.com/microsoft/vscode/issues/229825
	// When this issue will be fixed the following should be removed.
	public setEditContextOnDomNode(): void {
		const targetWindow = getWindow(this.domNode.domNode);
		const targetWindowId = getWindowId(targetWindow);
		if (this._targetWindowId !== targetWindowId) {
			this.domNode.domNode.editContext = this._editContext;
			this._targetWindowId = targetWindowId;
		}
	}

	// --- Private methods ---

	private _onKeyUp(e: KeyboardEvent) {
		inputLatency.onKeyUp();
		this._viewController.emitKeyUp(new StandardKeyboardEvent(e));
	}

	private _onKeyDown(e: KeyboardEvent) {
		inputLatency.onKeyDown();
		const standardKeyboardEvent = new StandardKeyboardEvent(e);
		// When the IME is visible, the keys, like arrow-left and arrow-right, should be used to navigate in the IME, and should not be propagated further
		if (standardKeyboardEvent.keyCode === KeyCode.KEY_IN_COMPOSITION) {
			standardKeyboardEvent.stopPropagation();
		}
		this._viewController.emitKeyDown(standardKeyboardEvent);
	}

	private _updateDomAttributes(): void {
		const options = this._context.configuration.options;
		this.domNode.domNode.setAttribute('tabindex', String(options.get(EditorOption.tabIndex)));
	}

	private _updateEditContext(): void {
		const editContextState = this._getNewEditContextState();
		if (!editContextState) {
			return;
		}
		this._editContext.updateText(0, Number.MAX_SAFE_INTEGER, editContextState.text ?? ' ');
		this._editContext.updateSelection(editContextState.selectionStartOffset, editContextState.selectionEndOffset);
		this._editContextPrimarySelection = editContextState.editContextPrimarySelection;
		this._previousEditContextSelection = new OffsetRange(editContextState.selectionStartOffset, editContextState.selectionEndOffset);
	}

	private _emitTypeEvent(viewController: ViewController, e: ITextUpdateEvent): void {
		if (!this._editContext) {
			return;
		}
		const selectionEndOffset = this._previousEditContextSelection.endExclusive;
		const selectionStartOffset = this._previousEditContextSelection.start;
		this._previousEditContextSelection = new OffsetRange(e.selectionStart, e.selectionEnd);

		let replaceNextCharCnt = 0;
		let replacePrevCharCnt = 0;
		if (e.updateRangeEnd > selectionEndOffset) {
			replaceNextCharCnt = e.updateRangeEnd - selectionEndOffset;
		}
		if (e.updateRangeStart < selectionStartOffset) {
			replacePrevCharCnt = selectionStartOffset - e.updateRangeStart;
		}
		let text = '';
		if (selectionStartOffset < e.updateRangeStart) {
			text += this._editContext.text.substring(selectionStartOffset, e.updateRangeStart);
		}
		text += e.text;
		if (selectionEndOffset > e.updateRangeEnd) {
			text += this._editContext.text.substring(e.updateRangeEnd, selectionEndOffset);
		}
		let positionDelta = 0;
		if (e.selectionStart === e.selectionEnd && selectionStartOffset === selectionEndOffset) {
			positionDelta = e.selectionStart - (e.updateRangeStart + e.text.length);
		}
		const typeInput: ITypeData = {
			text,
			replacePrevCharCnt,
			replaceNextCharCnt,
			positionDelta
		};
		this._onType(viewController, typeInput);
	}

	private _onType(viewController: ViewController, typeInput: ITypeData): void {
		if (typeInput.replacePrevCharCnt || typeInput.replaceNextCharCnt || typeInput.positionDelta) {
			viewController.compositionType(typeInput.text, typeInput.replacePrevCharCnt, typeInput.replaceNextCharCnt, typeInput.positionDelta);
		} else {
			viewController.type(typeInput.text);
		}
	}

	private _getNewEditContextState(): { text: string; selectionStartOffset: number; selectionEndOffset: number; editContextPrimarySelection: Selection } | undefined {
		const editContextPrimarySelection = this._primarySelection;
		const model = this._context.viewModel.model;
		if (!model.isValidRange(editContextPrimarySelection)) {
			return;
		}
		const primarySelectionStartLine = editContextPrimarySelection.startLineNumber;
		const primarySelectionEndLine = editContextPrimarySelection.endLineNumber;
		const endColumnOfEndLineNumber = model.getLineMaxColumn(primarySelectionEndLine);
		const rangeOfText = new Range(primarySelectionStartLine, 1, primarySelectionEndLine, endColumnOfEndLineNumber);
		const text = model.getValueInRange(rangeOfText, EndOfLinePreference.TextDefined);
		const selectionStartOffset = editContextPrimarySelection.startColumn - 1;
		const selectionEndOffset = text.length + editContextPrimarySelection.endColumn - endColumnOfEndLineNumber;
		return {
			text,
			selectionStartOffset,
			selectionEndOffset,
			editContextPrimarySelection
		};
	}

	private _editContextStartPosition(): Position {
		return new Position(this._editContextPrimarySelection.startLineNumber, 1);
	}

	private _handleTextFormatUpdate(e: TextFormatUpdateEvent): void {
		if (!this._editContext) {
			return;
		}
		const formats = e.getTextFormats();
		const editContextStartPosition = this._editContextStartPosition();
		const decorations: IModelDeltaDecoration[] = [];
		formats.forEach(f => {
			const textModel = this._context.viewModel.model;
			const offsetOfEditContextText = textModel.getOffsetAt(editContextStartPosition);
			const startPositionOfDecoration = textModel.getPositionAt(offsetOfEditContextText + f.rangeStart);
			const endPositionOfDecoration = textModel.getPositionAt(offsetOfEditContextText + f.rangeEnd);
			const decorationRange = Range.fromPositions(startPositionOfDecoration, endPositionOfDecoration);
			const thickness = f.underlineThickness.toLowerCase();
			let decorationClassName: string = CompositionClassName.NONE;
			switch (thickness) {
				case 'thin':
					decorationClassName = CompositionClassName.SECONDARY;
					break;
				case 'thick':
					decorationClassName = CompositionClassName.PRIMARY;
					break;
			}
			decorations.push({
				range: decorationRange,
				options: {
					description: 'textFormatDecoration',
					inlineClassName: decorationClassName,
				}
			});
		});
		this._decorations = this._context.viewModel.model.deltaDecorations(this._decorations, decorations);
	}

	private _linesVisibleRanges: HorizontalPosition | null = null;
	private _updateSelectionAndControlBoundsData(ctx: RenderingContext): void {
		const viewSelection = this._context.viewModel.coordinatesConverter.convertModelRangeToViewRange(this._primarySelection);
		if (this._primarySelection.isEmpty()) {
			const linesVisibleRanges = ctx.visibleRangeForPosition(viewSelection.getStartPosition());
			this._linesVisibleRanges = linesVisibleRanges;
		} else {
			this._linesVisibleRanges = null;
		}
	}

	private _updateSelectionAndControlBoundsAfterRender() {
		const options = this._context.configuration.options;
		const contentLeft = options.get(EditorOption.layoutInfo).contentLeft;

		const viewSelection = this._context.viewModel.coordinatesConverter.convertModelRangeToViewRange(this._primarySelection);
		const verticalOffsetStart = this._context.viewLayout.getVerticalOffsetForLineNumber(viewSelection.startLineNumber);
		const verticalOffsetEnd = this._context.viewLayout.getVerticalOffsetAfterLineNumber(viewSelection.endLineNumber);

		// Make sure this doesn't force an extra layout (i.e. don't call it before rendering finished)
		const parentBounds = this._parent.getBoundingClientRect();
		const top = parentBounds.top + verticalOffsetStart - this._scrollTop;
		const height = verticalOffsetEnd - verticalOffsetStart;
		let left = parentBounds.left + contentLeft - this._scrollLeft;
		let width: number;

		if (this._primarySelection.isEmpty()) {
			if (this._linesVisibleRanges) {
				left += this._linesVisibleRanges.left;
			}
			width = 0;
		} else {
			width = parentBounds.width - contentLeft;
		}

		const selectionBounds = new DOMRect(left, top, width, height);
		this._editContext.updateSelectionBounds(selectionBounds);
		this._editContext.updateControlBounds(selectionBounds);
	}

	private _updateCharacterBounds(e: CharacterBoundsUpdateEvent): void {
		const options = this._context.configuration.options;
		const typicalHalfWidthCharacterWidth = options.get(EditorOption.fontInfo).typicalHalfwidthCharacterWidth;
		const contentLeft = options.get(EditorOption.layoutInfo).contentLeft;
		const parentBounds = this._parent.getBoundingClientRect();

		const characterBounds: DOMRect[] = [];
		const offsetTransformer = new PositionOffsetTransformer(this._editContext.text);
		for (let offset = e.rangeStart; offset < e.rangeEnd; offset++) {
			const editContextStartPosition = offsetTransformer.getPosition(offset);
			const textStartLineOffsetWithinEditor = this._editContextPrimarySelection.startLineNumber - 1;
			const characterStartPosition = new Position(textStartLineOffsetWithinEditor + editContextStartPosition.lineNumber, editContextStartPosition.column);
			const characterEndPosition = characterStartPosition.delta(0, 1);
			const characterModelRange = Range.fromPositions(characterStartPosition, characterEndPosition);
			const characterViewRange = this._context.viewModel.coordinatesConverter.convertModelRangeToViewRange(characterModelRange);
			const characterLinesVisibleRanges = this._visibleRangeProvider.linesVisibleRangesForRange(characterViewRange, true) ?? [];
			const lineNumber = characterViewRange.startLineNumber;
			const characterVerticalOffset = this._context.viewLayout.getVerticalOffsetForLineNumber(lineNumber);
			const top = parentBounds.top + characterVerticalOffset - this._scrollTop;

			let left = 0;
			let width = typicalHalfWidthCharacterWidth;
			if (characterLinesVisibleRanges.length > 0) {
				for (const visibleRange of characterLinesVisibleRanges[0].ranges) {
					left = visibleRange.left;
					width = visibleRange.width;
					break;
				}
			}
			const lineHeight = this._context.viewLayout.getLineHeightForLineNumber(lineNumber);
			characterBounds.push(new DOMRect(parentBounds.left + contentLeft + left - this._scrollLeft, top, width, lineHeight));
		}
		this._editContext.updateCharacterBounds(e.rangeStart, characterBounds);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/native/nativeEditContextRegistry.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/native/nativeEditContextRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { NativeEditContext } from './nativeEditContext.js';

class NativeEditContextRegistryImpl {

	private _nativeEditContextMapping: Map<string, NativeEditContext> = new Map();

	register(ownerID: string, nativeEditContext: NativeEditContext): IDisposable {
		this._nativeEditContextMapping.set(ownerID, nativeEditContext);
		return {
			dispose: () => {
				this._nativeEditContextMapping.delete(ownerID);
			}
		};
	}

	get(ownerID: string): NativeEditContext | undefined {
		return this._nativeEditContextMapping.get(ownerID);
	}
}

export const NativeEditContextRegistry = new NativeEditContextRegistryImpl();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/native/nativeEditContextUtils.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/native/nativeEditContextUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener, getActiveElement, getShadowRoot } from '../../../../../base/browser/dom.js';
import { IDisposable, Disposable } from '../../../../../base/common/lifecycle.js';
import { ILogService } from '../../../../../platform/log/common/log.js';

export interface ITypeData {
	text: string;
	replacePrevCharCnt: number;
	replaceNextCharCnt: number;
	positionDelta: number;
}

export class FocusTracker extends Disposable {
	private _isFocused: boolean = false;
	private _isPaused: boolean = false;

	constructor(
		@ILogService _logService: ILogService,
		private readonly _domNode: HTMLElement,
		private readonly _onFocusChange: (newFocusValue: boolean) => void,
	) {
		super();
		this._register(addDisposableListener(this._domNode, 'focus', () => {
			_logService.trace('NativeEditContext.focus');
			if (this._isPaused) {
				return;
			}
			// Here we don't trust the browser and instead we check
			// that the active element is the one we are tracking
			// (this happens when cmd+tab is used to switch apps)
			this.refreshFocusState();
		}));
		this._register(addDisposableListener(this._domNode, 'blur', () => {
			_logService.trace('NativeEditContext.blur');
			if (this._isPaused) {
				return;
			}
			this._handleFocusedChanged(false);
		}));
	}

	public pause(): void {
		this._isPaused = true;
	}

	public resume(): void {
		this._isPaused = false;
		this.refreshFocusState();
	}

	private _handleFocusedChanged(focused: boolean): void {
		if (this._isFocused === focused) {
			return;
		}
		this._isFocused = focused;
		this._onFocusChange(this._isFocused);
	}

	public focus(): void {
		this._domNode.focus();
		this.refreshFocusState();
	}

	public refreshFocusState(): void {
		const shadowRoot = getShadowRoot(this._domNode);
		const activeElement = shadowRoot ? shadowRoot.activeElement : getActiveElement();
		const focused = this._domNode === activeElement;
		this._handleFocusedChanged(focused);
	}

	get isFocused(): boolean {
		return this._isFocused;
	}
}

export function editContextAddDisposableListener<K extends keyof EditContextEventHandlersEventMap>(target: EventTarget, type: K, listener: (this: GlobalEventHandlers, ev: EditContextEventHandlersEventMap[K]) => void, options?: boolean | AddEventListenerOptions): IDisposable {
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	target.addEventListener(type, listener as any, options);
	return {
		dispose() {
			// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
			target.removeEventListener(type, listener as any);
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/native/screenReaderContentRich.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/native/screenReaderContentRich.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener, getActiveWindow, isHTMLElement } from '../../../../../base/browser/dom.js';
import { FastDomNode } from '../../../../../base/browser/fastDomNode.js';
import { createTrustedTypesPolicy } from '../../../../../base/browser/trustedTypes.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { EditorFontLigatures, EditorOption, FindComputedEditorOptionValueById, IComputedEditorOptions } from '../../../../common/config/editorOptions.js';
import { Range } from '../../../../common/core/range.js';
import { Selection } from '../../../../common/core/selection.js';
import { StringBuilder } from '../../../../common/core/stringBuilder.js';
import { LineDecoration } from '../../../../common/viewLayout/lineDecorations.js';
import { CharacterMapping, RenderLineInput, renderViewLine } from '../../../../common/viewLayout/viewLineRenderer.js';
import { ViewContext } from '../../../../common/viewModel/viewContext.js';
import { IPagedScreenReaderStrategy } from '../screenReaderUtils.js';
import { ISimpleModel } from '../../../../common/viewModel/screenReaderSimpleModel.js';
import { Disposable, IDisposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { IME } from '../../../../../base/common/ime.js';
import { ViewController } from '../../../view/viewController.js';
import { IScreenReaderContent } from './screenReaderUtils.js';
import { getColumnOfNodeOffset } from '../../../viewParts/viewLines/viewLine.js';

const ttPolicy = createTrustedTypesPolicy('richScreenReaderContent', { createHTML: value => value });

const LINE_NUMBER_ATTRIBUTE = 'data-line-number';

export class RichScreenReaderContent extends Disposable implements IScreenReaderContent {

	private readonly _selectionChangeListener = this._register(new MutableDisposable());

	private _accessibilityPageSize: number = 1;
	private _ignoreSelectionChangeTime: number = 0;

	private _state: RichScreenReaderState = RichScreenReaderState.NULL;
	private _strategy: RichPagedScreenReaderStrategy = new RichPagedScreenReaderStrategy();

	private _renderedLines: Map<number, RichRenderedScreenReaderLine> = new Map();
	private _renderedSelection: Selection = new Selection(1, 1, 1, 1);

	constructor(
		private readonly _domNode: FastDomNode<HTMLElement>,
		private readonly _context: ViewContext,
		private readonly _viewController: ViewController,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService
	) {
		super();
		this.onConfigurationChanged(this._context.configuration.options);
	}

	public updateScreenReaderContent(primarySelection: Selection): void {
		const focusedElement = getActiveWindow().document.activeElement;
		if (!focusedElement || focusedElement !== this._domNode.domNode) {
			return;
		}
		const isScreenReaderOptimized = this._accessibilityService.isScreenReaderOptimized();
		if (isScreenReaderOptimized) {
			const state = this._getScreenReaderContentLineIntervals(primarySelection);
			if (!this._state.equals(state)) {
				this._state = state;
				this._renderedLines = this._renderScreenReaderContent(state);
			}
			if (!this._renderedSelection.equalsSelection(primarySelection)) {
				this._renderedSelection = primarySelection;
				this._setSelectionOnScreenReaderContent(this._context, this._renderedLines, primarySelection);
			}
		} else {
			this._state = RichScreenReaderState.NULL;
			this._setIgnoreSelectionChangeTime('setValue');
			this._domNode.domNode.textContent = '';
		}
	}

	public updateScrollTop(primarySelection: Selection): void {
		const intervals = this._state.intervals;
		if (!intervals.length) {
			return;
		}
		const viewLayout = this._context.viewModel.viewLayout;
		const stateStartLineNumber = intervals[0].startLine;
		const verticalOffsetOfStateStartLineNumber = viewLayout.getVerticalOffsetForLineNumber(stateStartLineNumber);
		const verticalOffsetOfPositionLineNumber = viewLayout.getVerticalOffsetForLineNumber(primarySelection.positionLineNumber);
		this._domNode.domNode.scrollTop = verticalOffsetOfPositionLineNumber - verticalOffsetOfStateStartLineNumber;
	}

	public onFocusChange(newFocusValue: boolean): void {
		if (newFocusValue) {
			this._selectionChangeListener.value = this._setSelectionChangeListener();
		} else {
			this._selectionChangeListener.value = undefined;
		}
	}

	public onConfigurationChanged(options: IComputedEditorOptions): void {
		this._accessibilityPageSize = options.get(EditorOption.accessibilityPageSize);
	}

	public onWillCut(): void {
		this._setIgnoreSelectionChangeTime('onCut');
	}

	public onWillPaste(): void {
		this._setIgnoreSelectionChangeTime('onWillPaste');
	}

	// --- private methods

	private _setIgnoreSelectionChangeTime(reason: string): void {
		this._ignoreSelectionChangeTime = Date.now();
	}

	private _setSelectionChangeListener(): IDisposable {
		// See https://github.com/microsoft/vscode/issues/27216 and https://github.com/microsoft/vscode/issues/98256
		// When using a Braille display or NVDA for example, it is possible for users to reposition the
		// system caret. This is reflected in Chrome as a `selectionchange` event and needs to be reflected within the editor.

		// `selectionchange` events often come multiple times for a single logical change
		// so throttle multiple `selectionchange` events that burst in a short period of time.
		let previousSelectionChangeEventTime = 0;
		return addDisposableListener(this._domNode.domNode.ownerDocument, 'selectionchange', () => {
			const activeElement = getActiveWindow().document.activeElement;
			const isFocused = activeElement === this._domNode.domNode;
			if (!isFocused) {
				return;
			}
			const isScreenReaderOptimized = this._accessibilityService.isScreenReaderOptimized();
			if (!isScreenReaderOptimized || !IME.enabled) {
				return;
			}
			const now = Date.now();
			const delta1 = now - previousSelectionChangeEventTime;
			previousSelectionChangeEventTime = now;
			if (delta1 < 5) {
				// received another `selectionchange` event within 5ms of the previous `selectionchange` event
				// => ignore it
				return;
			}
			const delta2 = now - this._ignoreSelectionChangeTime;
			this._ignoreSelectionChangeTime = 0;
			if (delta2 < 100) {
				// received a `selectionchange` event within 100ms since we touched the hidden div
				// => ignore it, since we caused it
				return;
			}
			const selection = this._getEditorSelectionFromDomRange();
			if (!selection) {
				return;
			}
			this._viewController.setSelection(selection);
		});
	}

	private _renderScreenReaderContent(state: RichScreenReaderState): Map<number, RichRenderedScreenReaderLine> {
		const nodes: HTMLDivElement[] = [];
		const renderedLines = new Map<number, RichRenderedScreenReaderLine>();
		for (const interval of state.intervals) {
			for (let lineNumber = interval.startLine; lineNumber <= interval.endLine; lineNumber++) {
				const renderedLine = this._renderLine(lineNumber);
				renderedLines.set(lineNumber, renderedLine);
				nodes.push(renderedLine.domNode);
			}
		}
		this._setIgnoreSelectionChangeTime('setValue');
		this._domNode.domNode.replaceChildren(...nodes);
		return renderedLines;
	}

	private _renderLine(viewLineNumber: number): RichRenderedScreenReaderLine {
		const viewModel = this._context.viewModel;
		const positionLineData = viewModel.getViewLineRenderingData(viewLineNumber);
		const options = this._context.configuration.options;
		const fontInfo = options.get(EditorOption.fontInfo);
		const stopRenderingLineAfter = options.get(EditorOption.stopRenderingLineAfter);
		const renderControlCharacters = options.get(EditorOption.renderControlCharacters);
		const fontLigatures = options.get(EditorOption.fontLigatures);
		const disableMonospaceOptimizations = options.get(EditorOption.disableMonospaceOptimizations);
		const lineDecorations = LineDecoration.filter(positionLineData.inlineDecorations, viewLineNumber, positionLineData.minColumn, positionLineData.maxColumn);
		const useMonospaceOptimizations = fontInfo.isMonospace && !disableMonospaceOptimizations;
		const useFontLigatures = fontLigatures !== EditorFontLigatures.OFF;
		let renderWhitespace: FindComputedEditorOptionValueById<EditorOption.renderWhitespace>;
		const experimentalWhitespaceRendering = options.get(EditorOption.experimentalWhitespaceRendering);
		if (experimentalWhitespaceRendering === 'off') {
			renderWhitespace = options.get(EditorOption.renderWhitespace);
		} else {
			renderWhitespace = 'none';
		}
		const renderLineInput = new RenderLineInput(
			useMonospaceOptimizations,
			fontInfo.canUseHalfwidthRightwardsArrow,
			positionLineData.content,
			positionLineData.continuesWithWrappedLine,
			positionLineData.isBasicASCII,
			positionLineData.containsRTL,
			positionLineData.minColumn - 1,
			positionLineData.tokens,
			lineDecorations,
			positionLineData.tabSize,
			positionLineData.startVisibleColumn,
			fontInfo.spaceWidth,
			fontInfo.middotWidth,
			fontInfo.wsmiddotWidth,
			stopRenderingLineAfter,
			renderWhitespace,
			renderControlCharacters,
			useFontLigatures,
			null,
			null,
			0,
			true
		);
		const htmlBuilder = new StringBuilder(10000);
		const renderOutput = renderViewLine(renderLineInput, htmlBuilder);
		const html = htmlBuilder.build();
		const trustedhtml = ttPolicy?.createHTML(html) ?? html;
		const lineHeight = viewModel.viewLayout.getLineHeightForLineNumber(viewLineNumber) + 'px';
		const domNode = document.createElement('div');
		domNode.innerHTML = trustedhtml as string;
		domNode.style.lineHeight = lineHeight;
		domNode.style.height = lineHeight;
		domNode.setAttribute(LINE_NUMBER_ATTRIBUTE, viewLineNumber.toString());
		return new RichRenderedScreenReaderLine(domNode, renderOutput.characterMapping);
	}

	private _setSelectionOnScreenReaderContent(context: ViewContext, renderedLines: Map<number, RichRenderedScreenReaderLine>, viewSelection: Selection): void {
		const activeDocument = getActiveWindow().document;
		const activeDocumentSelection = activeDocument.getSelection();
		if (!activeDocumentSelection) {
			return;
		}
		const startLineNumber = viewSelection.startLineNumber;
		const endLineNumber = viewSelection.endLineNumber;
		const startRenderedLine = renderedLines.get(startLineNumber);
		const endRenderedLine = renderedLines.get(endLineNumber);
		if (!startRenderedLine || !endRenderedLine) {
			return;
		}
		const viewModel = context.viewModel;
		const model = viewModel.model;
		const coordinatesConverter = viewModel.coordinatesConverter;
		const startRange = new Range(startLineNumber, 1, startLineNumber, viewSelection.selectionStartColumn);
		const modelStartRange = coordinatesConverter.convertViewRangeToModelRange(startRange);
		const characterCountForStart = model.getCharacterCountInRange(modelStartRange);
		const endRange = new Range(endLineNumber, 1, endLineNumber, viewSelection.positionColumn);
		const modelEndRange = coordinatesConverter.convertViewRangeToModelRange(endRange);
		const characterCountForEnd = model.getCharacterCountInRange(modelEndRange);
		const startDomPosition = startRenderedLine.characterMapping.getDomPosition(characterCountForStart);
		const endDomPosition = endRenderedLine.characterMapping.getDomPosition(characterCountForEnd);
		const startDomNode = startRenderedLine.domNode.firstChild!;
		const endDomNode = endRenderedLine.domNode.firstChild!;
		const startChildren = startDomNode.childNodes;
		const endChildren = endDomNode.childNodes;
		const startNode = startChildren.item(startDomPosition.partIndex);
		const endNode = endChildren.item(endDomPosition.partIndex);
		if (!startNode.firstChild || !endNode.firstChild) {
			return;
		}
		this._setIgnoreSelectionChangeTime('setRange');
		activeDocumentSelection.setBaseAndExtent(
			startNode.firstChild,
			viewSelection.startColumn === 1 ? 0 : startDomPosition.charIndex + 1,
			endNode.firstChild,
			viewSelection.endColumn === 1 ? 0 : endDomPosition.charIndex + 1
		);
	}

	private _getScreenReaderContentLineIntervals(primarySelection: Selection): RichScreenReaderState {
		return this._strategy.fromEditorSelection(this._context.viewModel, primarySelection, this._accessibilityPageSize);
	}

	private _getEditorSelectionFromDomRange(): Selection | undefined {
		if (!this._renderedLines) {
			return;
		}
		const selection = getActiveWindow().document.getSelection();
		if (!selection) {
			return;
		}
		const rangeCount = selection.rangeCount;
		if (rangeCount === 0) {
			return;
		}
		const range = selection.getRangeAt(0);
		const startContainer = range.startContainer;
		const endContainer = range.endContainer;
		const startSpanElement = startContainer.parentElement;
		const endSpanElement = endContainer.parentElement;
		if (!startSpanElement || !isHTMLElement(startSpanElement) || !endSpanElement || !isHTMLElement(endSpanElement)) {
			return;
		}
		const startLineDomNode = startSpanElement.parentElement?.parentElement;
		const endLineDomNode = endSpanElement.parentElement?.parentElement;
		if (!startLineDomNode || !endLineDomNode) {
			return;
		}
		const startLineNumberAttribute = startLineDomNode.getAttribute(LINE_NUMBER_ATTRIBUTE);
		const endLineNumberAttribute = endLineDomNode.getAttribute(LINE_NUMBER_ATTRIBUTE);
		if (!startLineNumberAttribute || !endLineNumberAttribute) {
			return;
		}
		const startLineNumber = parseInt(startLineNumberAttribute);
		const endLineNumber = parseInt(endLineNumberAttribute);
		const startMapping = this._renderedLines.get(startLineNumber)?.characterMapping;
		const endMapping = this._renderedLines.get(endLineNumber)?.characterMapping;
		if (!startMapping || !endMapping) {
			return;
		}
		const startColumn = getColumnOfNodeOffset(startMapping, startSpanElement, range.startOffset);
		const endColumn = getColumnOfNodeOffset(endMapping, endSpanElement, range.endOffset);
		if (selection.direction === 'forward') {
			return new Selection(
				startLineNumber,
				startColumn,
				endLineNumber,
				endColumn
			);
		} else {
			return new Selection(
				endLineNumber,
				endColumn,
				startLineNumber,
				startColumn
			);
		}
	}
}

class RichRenderedScreenReaderLine {
	constructor(
		public readonly domNode: HTMLDivElement,
		public readonly characterMapping: CharacterMapping
	) { }
}

class LineInterval {
	constructor(
		public readonly startLine: number,
		public readonly endLine: number
	) { }
}

class RichScreenReaderState {

	public readonly value: string;

	constructor(model: ISimpleModel, public readonly intervals: LineInterval[]) {
		let value = '';
		for (const interval of intervals) {
			for (let lineNumber = interval.startLine; lineNumber <= interval.endLine; lineNumber++) {
				value += model.getLineContent(lineNumber) + '\n';
			}
		}
		this.value = value;
	}

	equals(other: RichScreenReaderState): boolean {
		return this.value === other.value;
	}

	static get NULL(): RichScreenReaderState {
		const nullModel: ISimpleModel = {
			getLineContent: () => '',
			getLineCount: () => 1,
			getLineMaxColumn: () => 1,
			getValueInRange: () => '',
			getValueLengthInRange: () => 0,
			modifyPosition: (position, offset) => position
		};
		return new RichScreenReaderState(nullModel, []);
	}
}

class RichPagedScreenReaderStrategy implements IPagedScreenReaderStrategy<RichScreenReaderState> {

	constructor() { }

	private _getPageOfLine(lineNumber: number, linesPerPage: number): number {
		return Math.floor((lineNumber - 1) / linesPerPage);
	}

	private _getRangeForPage(context: ISimpleModel, page: number, linesPerPage: number): LineInterval {
		const offset = page * linesPerPage;
		const startLineNumber = offset + 1;
		const endLineNumber = Math.min(offset + linesPerPage, context.getLineCount());
		return new LineInterval(startLineNumber, endLineNumber);
	}

	public fromEditorSelection(context: ISimpleModel, viewSelection: Selection, linesPerPage: number): RichScreenReaderState {
		const selectionStartPage = this._getPageOfLine(viewSelection.startLineNumber, linesPerPage);
		const selectionStartPageRange = this._getRangeForPage(context, selectionStartPage, linesPerPage);
		const selectionEndPage = this._getPageOfLine(viewSelection.endLineNumber, linesPerPage);
		const selectionEndPageRange = this._getRangeForPage(context, selectionEndPage, linesPerPage);
		const lineIntervals: LineInterval[] = [{ startLine: selectionStartPageRange.startLine, endLine: selectionStartPageRange.endLine }];
		if (selectionStartPage + 1 < selectionEndPage) {
			lineIntervals.push({ startLine: selectionEndPageRange.startLine, endLine: selectionEndPageRange.endLine });
		}
		return new RichScreenReaderState(context, lineIntervals);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/native/screenReaderContentSimple.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/native/screenReaderContentSimple.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener, getActiveWindow } from '../../../../../base/browser/dom.js';
import { FastDomNode } from '../../../../../base/browser/fastDomNode.js';
import { AccessibilitySupport, IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { EditorOption, IComputedEditorOptions } from '../../../../common/config/editorOptions.js';
import { EndOfLineSequence } from '../../../../common/model.js';
import { ViewContext } from '../../../../common/viewModel/viewContext.js';
import { Selection } from '../../../../common/core/selection.js';
import { SimplePagedScreenReaderStrategy, ISimpleScreenReaderContentState } from '../screenReaderUtils.js';
import { PositionOffsetTransformer } from '../../../../common/core/text/positionToOffset.js';
import { Disposable, IDisposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { IME } from '../../../../../base/common/ime.js';
import { ViewController } from '../../../view/viewController.js';
import { IScreenReaderContent } from './screenReaderUtils.js';

export class SimpleScreenReaderContent extends Disposable implements IScreenReaderContent {

	private readonly _selectionChangeListener = this._register(new MutableDisposable());

	private _accessibilityPageSize: number = 1;
	private _ignoreSelectionChangeTime: number = 0;

	private _state: ISimpleScreenReaderContentState | undefined;
	private _strategy: SimplePagedScreenReaderStrategy = new SimplePagedScreenReaderStrategy();

	constructor(
		private readonly _domNode: FastDomNode<HTMLElement>,
		private readonly _context: ViewContext,
		private readonly _viewController: ViewController,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService
	) {
		super();
		this.onConfigurationChanged(this._context.configuration.options);
	}

	public updateScreenReaderContent(primarySelection: Selection): void {
		const domNode = this._domNode.domNode;
		const focusedElement = getActiveWindow().document.activeElement;
		if (!focusedElement || focusedElement !== domNode) {
			return;
		}
		const isScreenReaderOptimized = this._accessibilityService.isScreenReaderOptimized();
		if (isScreenReaderOptimized) {
			this._state = this._getScreenReaderContentState(primarySelection);
			if (domNode.textContent !== this._state.value) {
				this._setIgnoreSelectionChangeTime('setValue');
				domNode.textContent = this._state.value;
			}
			const selection = getActiveWindow().document.getSelection();
			if (!selection) {
				return;
			}
			const data = this._getScreenReaderRange(this._state.selectionStart, this._state.selectionEnd);
			if (!data) {
				return;
			}
			this._setIgnoreSelectionChangeTime('setRange');
			selection.setBaseAndExtent(
				data.anchorNode,
				data.anchorOffset,
				data.focusNode,
				data.focusOffset
			);
		} else {
			this._state = undefined;
			this._setIgnoreSelectionChangeTime('setValue');
			this._domNode.domNode.textContent = '';
		}
	}

	public updateScrollTop(primarySelection: Selection): void {
		if (!this._state) {
			return;
		}
		const viewLayout = this._context.viewModel.viewLayout;
		const stateStartLineNumber = this._state.startPositionWithinEditor.lineNumber;
		const verticalOffsetOfStateStartLineNumber = viewLayout.getVerticalOffsetForLineNumber(stateStartLineNumber);
		const verticalOffsetOfPositionLineNumber = viewLayout.getVerticalOffsetForLineNumber(primarySelection.positionLineNumber);
		this._domNode.domNode.scrollTop = verticalOffsetOfPositionLineNumber - verticalOffsetOfStateStartLineNumber;
	}

	public onFocusChange(newFocusValue: boolean): void {
		if (newFocusValue) {
			this._selectionChangeListener.value = this._setSelectionChangeListener();
		} else {
			this._selectionChangeListener.value = undefined;
		}
	}

	public onConfigurationChanged(options: IComputedEditorOptions): void {
		this._accessibilityPageSize = options.get(EditorOption.accessibilityPageSize);
	}

	public onWillCut(): void {
		this._setIgnoreSelectionChangeTime('onCut');
	}

	public onWillPaste(): void {
		this._setIgnoreSelectionChangeTime('onWillPaste');
	}

	// --- private methods

	public _setIgnoreSelectionChangeTime(reason: string): void {
		this._ignoreSelectionChangeTime = Date.now();
	}

	private _setSelectionChangeListener(): IDisposable {
		// See https://github.com/microsoft/vscode/issues/27216 and https://github.com/microsoft/vscode/issues/98256
		// When using a Braille display or NVDA for example, it is possible for users to reposition the
		// system caret. This is reflected in Chrome as a `selectionchange` event and needs to be reflected within the editor.

		// `selectionchange` events often come multiple times for a single logical change
		// so throttle multiple `selectionchange` events that burst in a short period of time.
		let previousSelectionChangeEventTime = 0;
		return addDisposableListener(this._domNode.domNode.ownerDocument, 'selectionchange', () => {
			const isScreenReaderOptimized = this._accessibilityService.isScreenReaderOptimized();
			if (!this._state || !isScreenReaderOptimized || !IME.enabled) {
				return;
			}
			const activeElement = getActiveWindow().document.activeElement;
			const isFocused = activeElement === this._domNode.domNode;
			if (!isFocused) {
				return;
			}
			const selection = getActiveWindow().document.getSelection();
			if (!selection) {
				return;
			}
			const rangeCount = selection.rangeCount;
			if (rangeCount === 0) {
				return;
			}
			const range = selection.getRangeAt(0);

			const now = Date.now();
			const delta1 = now - previousSelectionChangeEventTime;
			previousSelectionChangeEventTime = now;
			if (delta1 < 5) {
				// received another `selectionchange` event within 5ms of the previous `selectionchange` event
				// => ignore it
				return;
			}
			const delta2 = now - this._ignoreSelectionChangeTime;
			this._ignoreSelectionChangeTime = 0;
			if (delta2 < 100) {
				// received a `selectionchange` event within 100ms since we touched the hidden div
				// => ignore it, since we caused it
				return;
			}

			this._viewController.setSelection(this._getEditorSelectionFromDomRange(this._context, this._state, selection.direction, range));
		});
	}

	private _getScreenReaderContentState(primarySelection: Selection): ISimpleScreenReaderContentState {
		const state = this._strategy.fromEditorSelection(
			this._context.viewModel,
			primarySelection,
			this._accessibilityPageSize,
			this._accessibilityService.getAccessibilitySupport() === AccessibilitySupport.Unknown
		);
		const endPosition = this._context.viewModel.model.getPositionAt(Infinity);
		let value = state.value;
		if (endPosition.column === 1 && primarySelection.getEndPosition().equals(endPosition)) {
			value += '\n';
		}
		state.value = value;
		return state;
	}

	private _getScreenReaderRange(selectionOffsetStart: number, selectionOffsetEnd: number): { anchorNode: Node; anchorOffset: number; focusNode: Node; focusOffset: number } | undefined {
		const textContent = this._domNode.domNode.firstChild;
		if (!textContent) {
			return;
		}
		const range = new globalThis.Range();
		range.setStart(textContent, selectionOffsetStart);
		range.setEnd(textContent, selectionOffsetEnd);
		return {
			anchorNode: textContent,
			anchorOffset: selectionOffsetStart,
			focusNode: textContent,
			focusOffset: selectionOffsetEnd
		};
	}

	private _getEditorSelectionFromDomRange(context: ViewContext, state: ISimpleScreenReaderContentState, direction: string, range: globalThis.Range): Selection {
		const viewModel = context.viewModel;
		const model = viewModel.model;
		const coordinatesConverter = viewModel.coordinatesConverter;
		const modelScreenReaderContentStartPositionWithinEditor = coordinatesConverter.convertViewPositionToModelPosition(state.startPositionWithinEditor);
		const offsetOfStartOfScreenReaderContent = model.getOffsetAt(modelScreenReaderContentStartPositionWithinEditor);
		let offsetOfSelectionStart = range.startOffset + offsetOfStartOfScreenReaderContent;
		let offsetOfSelectionEnd = range.endOffset + offsetOfStartOfScreenReaderContent;
		const modelUsesCRLF = model.getEndOfLineSequence() === EndOfLineSequence.CRLF;
		if (modelUsesCRLF) {
			const screenReaderContentText = state.value;
			const offsetTransformer = new PositionOffsetTransformer(screenReaderContentText);
			const positionOfStartWithinText = offsetTransformer.getPosition(range.startOffset);
			const positionOfEndWithinText = offsetTransformer.getPosition(range.endOffset);
			offsetOfSelectionStart += positionOfStartWithinText.lineNumber - 1;
			offsetOfSelectionEnd += positionOfEndWithinText.lineNumber - 1;
		}
		const positionOfSelectionStart = model.getPositionAt(offsetOfSelectionStart);
		const positionOfSelectionEnd = model.getPositionAt(offsetOfSelectionEnd);
		const selectionStart = direction === 'forward' ? positionOfSelectionStart : positionOfSelectionEnd;
		const selectionEnd = direction === 'forward' ? positionOfSelectionEnd : positionOfSelectionStart;
		return Selection.fromPositions(selectionStart, selectionEnd);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/native/screenReaderSupport.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/native/screenReaderSupport.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode } from '../../../../../base/browser/fastDomNode.js';
import { Disposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { FontInfo } from '../../../../common/config/fontInfo.js';
import { Selection } from '../../../../common/core/selection.js';
import { ViewConfigurationChangedEvent, ViewCursorStateChangedEvent } from '../../../../common/viewEvents.js';
import { ViewContext } from '../../../../common/viewModel/viewContext.js';
import { applyFontInfo } from '../../../config/domFontInfo.js';
import { IEditorAriaOptions } from '../../../editorBrowser.js';
import { RestrictedRenderingContext, RenderingContext, HorizontalPosition } from '../../../view/renderingContext.js';
import { ViewController } from '../../../view/viewController.js';
import { ariaLabelForScreenReaderContent } from '../screenReaderUtils.js';
import { RichScreenReaderContent } from './screenReaderContentRich.js';
import { SimpleScreenReaderContent } from './screenReaderContentSimple.js';
import { IScreenReaderContent } from './screenReaderUtils.js';

export class ScreenReaderSupport extends Disposable {

	// Configuration values
	private _contentLeft: number = 1;
	private _contentWidth: number = 1;
	private _contentHeight: number = 1;
	private _divWidth: number = 1;
	private _fontInfo!: FontInfo;
	private _renderRichContent: boolean | undefined;

	private _primarySelection: Selection = new Selection(1, 1, 1, 1);
	private _primaryCursorVisibleRange: HorizontalPosition | null = null;
	private readonly _state: MutableDisposable<IScreenReaderContent>;

	constructor(
		private readonly _domNode: FastDomNode<HTMLElement>,
		private readonly _context: ViewContext,
		private readonly _viewController: ViewController,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService
	) {
		super();
		this._state = this._register(new MutableDisposable<IScreenReaderContent>());
		this._instantiateScreenReaderContent();
		this._updateConfigurationSettings();
		this._updateDomAttributes();
	}

	public onWillPaste(): void {
		this._state.value?.onWillPaste();
	}

	public onWillCut(): void {
		this._state.value?.onWillCut();
	}

	public handleFocusChange(newFocusValue: boolean): void {
		this._state.value?.onFocusChange(newFocusValue);
		this.writeScreenReaderContent();
	}

	public onConfigurationChanged(e: ViewConfigurationChangedEvent): void {
		this._instantiateScreenReaderContent();
		this._updateConfigurationSettings();
		this._updateDomAttributes();
		if (e.hasChanged(EditorOption.accessibilitySupport)) {
			this.writeScreenReaderContent();
		}
	}

	private _instantiateScreenReaderContent(): void {
		const renderRichContent = this._context.configuration.options.get(EditorOption.renderRichScreenReaderContent);
		if (this._renderRichContent !== renderRichContent) {
			this._renderRichContent = renderRichContent;
			this._state.value = this._createScreenReaderContent(renderRichContent);
		}
	}

	private _createScreenReaderContent(renderRichContent: boolean): IScreenReaderContent {
		if (renderRichContent) {
			return new RichScreenReaderContent(this._domNode, this._context, this._viewController, this._accessibilityService);
		} else {
			return new SimpleScreenReaderContent(this._domNode, this._context, this._viewController, this._accessibilityService);
		}
	}

	private _updateConfigurationSettings(): void {
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);
		const wrappingColumn = layoutInfo.wrappingColumn;
		this._contentLeft = layoutInfo.contentLeft;
		this._contentWidth = layoutInfo.contentWidth;
		this._contentHeight = layoutInfo.height;
		this._fontInfo = options.get(EditorOption.fontInfo);
		this._divWidth = Math.round(wrappingColumn * this._fontInfo.typicalHalfwidthCharacterWidth);
		this._state.value?.onConfigurationChanged(options);
	}

	private _updateDomAttributes(): void {
		const options = this._context.configuration.options;
		this._domNode.domNode.setAttribute('role', 'textbox');
		this._domNode.domNode.setAttribute('aria-required', options.get(EditorOption.ariaRequired) ? 'true' : 'false');
		this._domNode.domNode.setAttribute('aria-multiline', 'true');
		this._domNode.domNode.setAttribute('aria-autocomplete', options.get(EditorOption.readOnly) ? 'none' : 'both');
		this._domNode.domNode.setAttribute('aria-roledescription', localize('editor', "editor"));
		this._domNode.domNode.setAttribute('aria-label', ariaLabelForScreenReaderContent(options, this._keybindingService));
		const tabSize = this._context.viewModel.model.getOptions().tabSize;
		const spaceWidth = options.get(EditorOption.fontInfo).spaceWidth;
		this._domNode.domNode.style.tabSize = `${tabSize * spaceWidth}px`;
		const wordWrapOverride2 = options.get(EditorOption.wordWrapOverride2);
		const wordWrapOverride1 = (wordWrapOverride2 === 'inherit' ? options.get(EditorOption.wordWrapOverride1) : wordWrapOverride2);
		const wordWrap = (wordWrapOverride1 === 'inherit' ? options.get(EditorOption.wordWrap) : wordWrapOverride1);
		this._domNode.domNode.style.textWrap = wordWrap === 'off' ? 'nowrap' : 'wrap';
	}

	public onCursorStateChanged(e: ViewCursorStateChangedEvent): void {
		this._primarySelection = e.selections[0] ?? new Selection(1, 1, 1, 1);
	}

	public prepareRender(ctx: RenderingContext): void {
		this.writeScreenReaderContent();
		this._primaryCursorVisibleRange = ctx.visibleRangeForPosition(this._primarySelection.getPosition());
	}

	public render(ctx: RestrictedRenderingContext): void {
		if (!this._primaryCursorVisibleRange) {
			// The primary cursor is outside the viewport => place textarea to the top left
			this._renderAtTopLeft();
			return;
		}

		const editorScrollLeft = this._context.viewLayout.getCurrentScrollLeft();
		const left = this._contentLeft + this._primaryCursorVisibleRange.left - editorScrollLeft;
		if (left < this._contentLeft || left > this._contentLeft + this._contentWidth) {
			// cursor is outside the viewport
			this._renderAtTopLeft();
			return;
		}

		const editorScrollTop = this._context.viewLayout.getCurrentScrollTop();
		const positionLineNumber = this._primarySelection.positionLineNumber;
		const top = this._context.viewLayout.getVerticalOffsetForLineNumber(positionLineNumber) - editorScrollTop;
		if (top < 0 || top > this._contentHeight) {
			// cursor is outside the viewport
			this._renderAtTopLeft();
			return;
		}

		// The <div> where we render the screen reader content does not support variable line heights,
		// all the lines must have the same height. We use the line height of the cursor position as the
		// line height for all lines.
		const lineHeight = this._context.viewLayout.getLineHeightForLineNumber(positionLineNumber);
		this._doRender(top, this._contentLeft, this._divWidth, lineHeight);
		this._state.value?.updateScrollTop(this._primarySelection);
	}

	private _renderAtTopLeft(): void {
		this._doRender(0, 0, this._contentWidth, 1);
	}

	private _doRender(top: number, left: number, width: number, height: number): void {
		// For correct alignment of the screen reader content, we need to apply the correct font
		applyFontInfo(this._domNode, this._fontInfo);

		this._domNode.setTop(top);
		this._domNode.setLeft(left);
		this._domNode.setWidth(width);
		this._domNode.setHeight(height);
		this._domNode.setLineHeight(height);
	}

	public setAriaOptions(options: IEditorAriaOptions): void {
		if (options.activeDescendant) {
			this._domNode.setAttribute('aria-haspopup', 'true');
			this._domNode.setAttribute('aria-autocomplete', 'list');
			this._domNode.setAttribute('aria-activedescendant', options.activeDescendant);
		} else {
			this._domNode.setAttribute('aria-haspopup', 'false');
			this._domNode.setAttribute('aria-autocomplete', 'both');
			this._domNode.removeAttribute('aria-activedescendant');
		}
		if (options.role) {
			this._domNode.setAttribute('role', options.role);
		}
	}

	public writeScreenReaderContent(): void {
		this._state.value?.updateScreenReaderContent(this._primarySelection);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/native/screenReaderUtils.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/native/screenReaderUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IComputedEditorOptions } from '../../../../common/config/editorOptions.js';
import { Selection } from '../../../../common/core/selection.js';

export interface IScreenReaderContent {

	dispose(): void;

	/**
	 * Handle screen reader content before cutting the content
	 */
	onWillCut(): void;

	/**
	 * Handle screen reader content before pasting the content
	 */
	onWillPaste(): void;

	/**
	 * Handle focus changes
	 */
	onFocusChange(newFocusValue: boolean): void;

	/**
	 * Handle configuration changes
	 */
	onConfigurationChanged(options: IComputedEditorOptions): void;

	/**
	 * Update the screen reader content given the selection. It will update the content and set the range within the screen reader content if needed.
	 */
	updateScreenReaderContent(primarySelection: Selection): void;

	/**
	 * Update the scroll top value of the screen reader content
	 */
	updateScrollTop(primarySelection: Selection): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/textArea/textAreaEditContext.css]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/textArea/textAreaEditContext.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .inputarea {
	min-width: 0;
	min-height: 0;
	margin: 0;
	padding: 0;
	position: absolute;
	outline: none !important;
	resize: none;
	border: none;
	overflow: hidden;
	color: transparent;
	background-color: transparent;
	z-index: -10;
}
/*.monaco-editor .inputarea {
	position: fixed !important;
	width: 800px !important;
	height: 500px !important;
	top: initial !important;
	left: initial !important;
	bottom: 0 !important;
	right: 0 !important;
	color: black !important;
	background: white !important;
	line-height: 15px !important;
	font-size: 14px !important;
	z-index: 10 !important;
}*/
.monaco-editor .inputarea.ime-input {
	z-index: 10;
	caret-color: var(--vscode-editorCursor-foreground);
	color: var(--vscode-editor-foreground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/controller/editContext/textArea/textAreaEditContext.ts]---
Location: vscode-main/src/vs/editor/browser/controller/editContext/textArea/textAreaEditContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './textAreaEditContext.css';
import * as nls from '../../../../../nls.js';
import * as browser from '../../../../../base/browser/browser.js';
import { FastDomNode, createFastDomNode } from '../../../../../base/browser/fastDomNode.js';
import { IKeyboardEvent } from '../../../../../base/browser/keyboardEvent.js';
import * as platform from '../../../../../base/common/platform.js';
import * as strings from '../../../../../base/common/strings.js';
import { applyFontInfo } from '../../../config/domFontInfo.js';
import { ViewController } from '../../../view/viewController.js';
import { PartFingerprint, PartFingerprints } from '../../../view/viewPart.js';
import { LineNumbersOverlay } from '../../../viewParts/lineNumbers/lineNumbers.js';
import { Margin } from '../../../viewParts/margin/margin.js';
import { RenderLineNumbersType, EditorOption, IComputedEditorOptions, EditorOptions } from '../../../../common/config/editorOptions.js';
import { FontInfo } from '../../../../common/config/fontInfo.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { Selection } from '../../../../common/core/selection.js';
import { ScrollType } from '../../../../common/editorCommon.js';
import { EndOfLinePreference } from '../../../../common/model.js';
import { RenderingContext, RestrictedRenderingContext, HorizontalPosition, LineVisibleRanges } from '../../../view/renderingContext.js';
import { ViewContext } from '../../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../../common/viewEvents.js';
import { AccessibilitySupport } from '../../../../../platform/accessibility/common/accessibility.js';
import { IEditorAriaOptions } from '../../../editorBrowser.js';
import { MOUSE_CURSOR_TEXT_CSS_CLASS_NAME } from '../../../../../base/browser/ui/mouseCursor/mouseCursor.js';
import { TokenizationRegistry } from '../../../../common/languages.js';
import { ColorId, ITokenPresentation } from '../../../../common/encodedTokenAttributes.js';
import { Color } from '../../../../../base/common/color.js';
import { IME } from '../../../../../base/common/ime.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { AbstractEditContext } from '../editContext.js';
import { ICompositionData, ITextAreaInputHost, TextAreaInput, TextAreaWrapper } from './textAreaEditContextInput.js';
import { ariaLabelForScreenReaderContent, newlinecount, SimplePagedScreenReaderStrategy } from '../screenReaderUtils.js';
import { _debugComposition, ITypeData, TextAreaState } from './textAreaEditContextState.js';
import { getMapForWordSeparators, WordCharacterClass } from '../../../../common/core/wordCharacterClassifier.js';
import { TextAreaEditContextRegistry } from './textAreaEditContextRegistry.js';
import { IPasteData } from '../clipboardUtils.js';

export interface IVisibleRangeProvider {
	visibleRangeForPosition(position: Position): HorizontalPosition | null;
	linesVisibleRangesForRange(range: Range, includeNewLines: boolean): LineVisibleRanges[] | null;
}

class VisibleTextAreaData {
	_visibleTextAreaBrand: void = undefined;

	public startPosition: Position | null = null;
	public endPosition: Position | null = null;

	public visibleTextareaStart: HorizontalPosition | null = null;
	public visibleTextareaEnd: HorizontalPosition | null = null;

	/**
	 * When doing composition, the currently composed text might be split up into
	 * multiple tokens, then merged again into a single token, etc. Here we attempt
	 * to keep the presentation of the <textarea> stable by using the previous used
	 * style if multiple tokens come into play. This avoids flickering.
	 */
	private _previousPresentation: ITokenPresentation | null = null;

	constructor(
		private readonly _context: ViewContext,
		public readonly modelLineNumber: number,
		public readonly distanceToModelLineStart: number,
		public readonly widthOfHiddenLineTextBefore: number,
		public readonly distanceToModelLineEnd: number,
	) {
	}

	prepareRender(visibleRangeProvider: IVisibleRangeProvider): void {
		const startModelPosition = new Position(this.modelLineNumber, this.distanceToModelLineStart + 1);
		const endModelPosition = new Position(this.modelLineNumber, this._context.viewModel.model.getLineMaxColumn(this.modelLineNumber) - this.distanceToModelLineEnd);

		this.startPosition = this._context.viewModel.coordinatesConverter.convertModelPositionToViewPosition(startModelPosition);
		this.endPosition = this._context.viewModel.coordinatesConverter.convertModelPositionToViewPosition(endModelPosition);

		if (this.startPosition.lineNumber === this.endPosition.lineNumber) {
			this.visibleTextareaStart = visibleRangeProvider.visibleRangeForPosition(this.startPosition);
			this.visibleTextareaEnd = visibleRangeProvider.visibleRangeForPosition(this.endPosition);
		} else {
			// TODO: what if the view positions are not on the same line?
			this.visibleTextareaStart = null;
			this.visibleTextareaEnd = null;
		}
	}

	definePresentation(tokenPresentation: ITokenPresentation | null): ITokenPresentation {
		if (!this._previousPresentation) {
			// To avoid flickering, once set, always reuse a presentation throughout the entire IME session
			if (tokenPresentation) {
				this._previousPresentation = tokenPresentation;
			} else {
				this._previousPresentation = {
					foreground: ColorId.DefaultForeground,
					italic: false,
					bold: false,
					underline: false,
					strikethrough: false,
				};
			}
		}
		return this._previousPresentation;
	}
}

const canUseZeroSizeTextarea = (browser.isFirefox);

export class TextAreaEditContext extends AbstractEditContext {

	private readonly _viewController: ViewController;
	private readonly _visibleRangeProvider: IVisibleRangeProvider;
	private _scrollLeft: number;
	private _scrollTop: number;

	private _accessibilitySupport!: AccessibilitySupport;
	private _accessibilityPageSize!: number;
	private _textAreaWrapping!: boolean;
	private _textAreaWidth!: number;
	private _contentLeft: number;
	private _contentWidth: number;
	private _contentHeight: number;
	private _fontInfo: FontInfo;

	/**
	 * Defined only when the text area is visible (composition case).
	 */
	private _visibleTextArea: VisibleTextAreaData | null;
	private _selections: Selection[];
	private _modelSelections: Selection[];

	/**
	 * The position at which the textarea was rendered.
	 * This is useful for hit-testing and determining the mouse position.
	 */
	private _lastRenderPosition: Position | null;

	public readonly textArea: FastDomNode<HTMLTextAreaElement>;
	public readonly textAreaCover: FastDomNode<HTMLElement>;
	private readonly _textAreaInput: TextAreaInput;

	constructor(
		ownerID: string,
		context: ViewContext,
		overflowGuardContainer: FastDomNode<HTMLElement>,
		viewController: ViewController,
		visibleRangeProvider: IVisibleRangeProvider,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super(context);

		this._viewController = viewController;
		this._visibleRangeProvider = visibleRangeProvider;
		this._scrollLeft = 0;
		this._scrollTop = 0;

		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);

		this._setAccessibilityOptions(options);
		this._contentLeft = layoutInfo.contentLeft;
		this._contentWidth = layoutInfo.contentWidth;
		this._contentHeight = layoutInfo.height;
		this._fontInfo = options.get(EditorOption.fontInfo);

		this._visibleTextArea = null;
		this._selections = [new Selection(1, 1, 1, 1)];
		this._modelSelections = [new Selection(1, 1, 1, 1)];
		this._lastRenderPosition = null;

		// Text Area (The focus will always be in the textarea when the cursor is blinking)
		this.textArea = createFastDomNode(document.createElement('textarea'));
		PartFingerprints.write(this.textArea, PartFingerprint.TextArea);
		this.textArea.setClassName(`inputarea ${MOUSE_CURSOR_TEXT_CSS_CLASS_NAME}`);
		this.textArea.setAttribute('wrap', this._textAreaWrapping && !this._visibleTextArea ? 'on' : 'off');
		const { tabSize } = this._context.viewModel.model.getOptions();
		this.textArea.domNode.style.tabSize = `${tabSize * this._fontInfo.spaceWidth}px`;
		this.textArea.setAttribute('autocorrect', 'off');
		this.textArea.setAttribute('autocapitalize', 'off');
		this.textArea.setAttribute('autocomplete', 'off');
		this.textArea.setAttribute('spellcheck', 'false');
		this.textArea.setAttribute('aria-label', ariaLabelForScreenReaderContent(options, this._keybindingService));
		this.textArea.setAttribute('aria-required', options.get(EditorOption.ariaRequired) ? 'true' : 'false');
		this.textArea.setAttribute('tabindex', String(options.get(EditorOption.tabIndex)));
		this.textArea.setAttribute('role', 'textbox');
		this.textArea.setAttribute('aria-roledescription', nls.localize('editor', "editor"));
		this.textArea.setAttribute('aria-multiline', 'true');
		this.textArea.setAttribute('aria-autocomplete', options.get(EditorOption.readOnly) ? 'none' : 'both');

		this._ensureReadOnlyAttribute();

		this.textAreaCover = createFastDomNode(document.createElement('div'));
		this.textAreaCover.setPosition('absolute');

		overflowGuardContainer.appendChild(this.textArea);
		overflowGuardContainer.appendChild(this.textAreaCover);

		const simplePagedScreenReaderStrategy = new SimplePagedScreenReaderStrategy();
		const textAreaInputHost: ITextAreaInputHost = {
			context: this._context,
			getScreenReaderContent: (): TextAreaState => {
				if (this._accessibilitySupport === AccessibilitySupport.Disabled) {
					// We know for a fact that a screen reader is not attached
					// On OSX, we write the character before the cursor to allow for "long-press" composition
					// Also on OSX, we write the word before the cursor to allow for the Accessibility Keyboard to give good hints
					const selection = this._selections[0];
					if (platform.isMacintosh && selection.isEmpty()) {
						const position = selection.getStartPosition();

						let textBefore = this._getWordBeforePosition(position);
						if (textBefore.length === 0) {
							textBefore = this._getCharacterBeforePosition(position);
						}

						if (textBefore.length > 0) {
							return new TextAreaState(textBefore, textBefore.length, textBefore.length, Range.fromPositions(position), 0);
						}
					}
					// on macOS, write current selection into textarea will allow system text services pick selected text,
					// but we still want to limit the amount of text given Chromium handles very poorly text even of a few
					// thousand chars
					// (https://github.com/microsoft/vscode/issues/27799)
					const LIMIT_CHARS = 500;
					if (platform.isMacintosh && !selection.isEmpty() && this._context.viewModel.getValueLengthInRange(selection, EndOfLinePreference.TextDefined) < LIMIT_CHARS) {
						const text = this._context.viewModel.getValueInRange(selection, EndOfLinePreference.TextDefined);
						return new TextAreaState(text, 0, text.length, selection, 0);
					}

					// on Safari, document.execCommand('cut') and document.execCommand('copy') will just not work
					// if the textarea has no content selected. So if there is an editor selection, ensure something
					// is selected in the textarea.
					if (browser.isSafari && !selection.isEmpty()) {
						const placeholderText = 'vscode-placeholder';
						return new TextAreaState(placeholderText, 0, placeholderText.length, null, undefined);
					}

					return TextAreaState.EMPTY;
				}

				if (browser.isAndroid) {
					// when tapping in the editor on a word, Android enters composition mode.
					// in the `compositionstart` event we cannot clear the textarea, because
					// it then forgets to ever send a `compositionend`.
					// we therefore only write the current word in the textarea
					const selection = this._selections[0];
					if (selection.isEmpty()) {
						const position = selection.getStartPosition();
						const [wordAtPosition, positionOffsetInWord] = this._getAndroidWordAtPosition(position);
						if (wordAtPosition.length > 0) {
							return new TextAreaState(wordAtPosition, positionOffsetInWord, positionOffsetInWord, Range.fromPositions(position), 0);
						}
					}
					return TextAreaState.EMPTY;
				}

				const screenReaderContentState = simplePagedScreenReaderStrategy.fromEditorSelection(this._context.viewModel, this._selections[0], this._accessibilityPageSize, this._accessibilitySupport === AccessibilitySupport.Unknown);
				return TextAreaState.fromScreenReaderContentState(screenReaderContentState);
			},

			deduceModelPosition: (viewAnchorPosition: Position, deltaOffset: number, lineFeedCnt: number): Position => {
				return this._context.viewModel.deduceModelPositionRelativeToViewPosition(viewAnchorPosition, deltaOffset, lineFeedCnt);
			}
		};

		const textAreaWrapper = this._register(new TextAreaWrapper(this.textArea.domNode));
		this._textAreaInput = this._register(this._instantiationService.createInstance(TextAreaInput, textAreaInputHost, textAreaWrapper, platform.OS, {
			isAndroid: browser.isAndroid,
			isChrome: browser.isChrome,
			isFirefox: browser.isFirefox,
			isSafari: browser.isSafari,
		}));

		this._register(this._textAreaInput.onKeyDown((e: IKeyboardEvent) => {
			this._viewController.emitKeyDown(e);
		}));

		this._register(this._textAreaInput.onKeyUp((e: IKeyboardEvent) => {
			this._viewController.emitKeyUp(e);
		}));

		this._register(this._textAreaInput.onPaste((e: IPasteData) => {
			this._viewController.paste(e.text, e.pasteOnNewLine, e.multicursorText, e.mode);
		}));

		this._register(this._textAreaInput.onCut(() => {
			this._viewController.cut();
		}));

		this._register(this._textAreaInput.onType((e: ITypeData) => {
			if (e.replacePrevCharCnt || e.replaceNextCharCnt || e.positionDelta) {
				// must be handled through the new command
				if (_debugComposition) {
					console.log(` => compositionType: <<${e.text}>>, ${e.replacePrevCharCnt}, ${e.replaceNextCharCnt}, ${e.positionDelta}`);
				}
				this._viewController.compositionType(e.text, e.replacePrevCharCnt, e.replaceNextCharCnt, e.positionDelta);
			} else {
				if (_debugComposition) {
					console.log(` => type: <<${e.text}>>`);
				}
				this._viewController.type(e.text);
			}
		}));

		this._register(this._textAreaInput.onSelectionChangeRequest((modelSelection: Selection) => {
			this._viewController.setSelection(modelSelection);
		}));

		this._register(this._textAreaInput.onCompositionStart((e) => {

			// The textarea might contain some content when composition starts.
			//
			// When we make the textarea visible, it always has a height of 1 line,
			// so we don't need to worry too much about content on lines above or below
			// the selection.
			//
			// However, the text on the current line needs to be made visible because
			// some IME methods allow to move to other glyphs on the current line
			// (by pressing arrow keys).
			//
			// (1) The textarea might contain only some parts of the current line,
			// like the word before the selection. Also, the content inside the textarea
			// can grow or shrink as composition occurs. We therefore anchor the textarea
			// in terms of distance to a certain line start and line end.
			//
			// (2) Also, we should not make \t characters visible, because their rendering
			// inside the <textarea> will not align nicely with our rendering. We therefore
			// will hide (if necessary) some of the leading text on the current line.

			const ta = this.textArea.domNode;
			const modelSelection = this._modelSelections[0];

			const { distanceToModelLineStart, widthOfHiddenTextBefore } = (() => {
				// Find the text that is on the current line before the selection
				const textBeforeSelection = ta.value.substring(0, Math.min(ta.selectionStart, ta.selectionEnd));
				const lineFeedOffset1 = textBeforeSelection.lastIndexOf('\n');
				const lineTextBeforeSelection = textBeforeSelection.substring(lineFeedOffset1 + 1);

				// We now search to see if we should hide some part of it (if it contains \t)
				const tabOffset1 = lineTextBeforeSelection.lastIndexOf('\t');
				const desiredVisibleBeforeCharCount = lineTextBeforeSelection.length - tabOffset1 - 1;
				const startModelPosition = modelSelection.getStartPosition();
				const visibleBeforeCharCount = Math.min(startModelPosition.column - 1, desiredVisibleBeforeCharCount);
				const distanceToModelLineStart = startModelPosition.column - 1 - visibleBeforeCharCount;
				const hiddenLineTextBefore = lineTextBeforeSelection.substring(0, lineTextBeforeSelection.length - visibleBeforeCharCount);
				const { tabSize } = this._context.viewModel.model.getOptions();
				const widthOfHiddenTextBefore = measureText(this.textArea.domNode.ownerDocument, hiddenLineTextBefore, this._fontInfo, tabSize);

				return { distanceToModelLineStart, widthOfHiddenTextBefore };
			})();

			const { distanceToModelLineEnd } = (() => {
				// Find the text that is on the current line after the selection
				const textAfterSelection = ta.value.substring(Math.max(ta.selectionStart, ta.selectionEnd));
				const lineFeedOffset2 = textAfterSelection.indexOf('\n');
				const lineTextAfterSelection = lineFeedOffset2 === -1 ? textAfterSelection : textAfterSelection.substring(0, lineFeedOffset2);

				const tabOffset2 = lineTextAfterSelection.indexOf('\t');
				const desiredVisibleAfterCharCount = (tabOffset2 === -1 ? lineTextAfterSelection.length : lineTextAfterSelection.length - tabOffset2 - 1);
				const endModelPosition = modelSelection.getEndPosition();
				const visibleAfterCharCount = Math.min(this._context.viewModel.model.getLineMaxColumn(endModelPosition.lineNumber) - endModelPosition.column, desiredVisibleAfterCharCount);
				const distanceToModelLineEnd = this._context.viewModel.model.getLineMaxColumn(endModelPosition.lineNumber) - endModelPosition.column - visibleAfterCharCount;

				return { distanceToModelLineEnd };
			})();

			// Scroll to reveal the location in the editor where composition occurs
			this._context.viewModel.revealRange(
				'keyboard',
				true,
				Range.fromPositions(this._selections[0].getStartPosition()),
				viewEvents.VerticalRevealType.Simple,
				ScrollType.Immediate
			);

			this._visibleTextArea = new VisibleTextAreaData(
				this._context,
				modelSelection.startLineNumber,
				distanceToModelLineStart,
				widthOfHiddenTextBefore,
				distanceToModelLineEnd,
			);

			// We turn off wrapping if the <textarea> becomes visible for composition
			this.textArea.setAttribute('wrap', this._textAreaWrapping && !this._visibleTextArea ? 'on' : 'off');

			this._visibleTextArea.prepareRender(this._visibleRangeProvider);
			this._render();

			// Show the textarea
			this.textArea.setClassName(`inputarea ${MOUSE_CURSOR_TEXT_CSS_CLASS_NAME} ime-input`);

			this._viewController.compositionStart();
			this._context.viewModel.onCompositionStart();
		}));

		this._register(this._textAreaInput.onCompositionUpdate((e: ICompositionData) => {
			if (!this._visibleTextArea) {
				return;
			}

			this._visibleTextArea.prepareRender(this._visibleRangeProvider);
			this._render();
		}));

		this._register(this._textAreaInput.onCompositionEnd(() => {

			this._visibleTextArea = null;

			// We turn on wrapping as necessary if the <textarea> hides after composition
			this.textArea.setAttribute('wrap', this._textAreaWrapping && !this._visibleTextArea ? 'on' : 'off');

			this._render();

			this.textArea.setClassName(`inputarea ${MOUSE_CURSOR_TEXT_CSS_CLASS_NAME}`);
			this._viewController.compositionEnd();
			this._context.viewModel.onCompositionEnd();
		}));

		this._register(this._textAreaInput.onFocus(() => {
			this._context.viewModel.setHasFocus(true);
		}));

		this._register(this._textAreaInput.onBlur(() => {
			this._context.viewModel.setHasFocus(false);
		}));

		this._register(IME.onDidChange(() => {
			this._ensureReadOnlyAttribute();
		}));

		this._register(TextAreaEditContextRegistry.register(ownerID, this));
	}

	public get domNode() {
		return this.textArea;
	}

	public writeScreenReaderContent(reason: string): void {
		this._textAreaInput.writeNativeTextAreaContent(reason);
	}

	public getTextAreaDomNode(): HTMLTextAreaElement {
		return this.textArea.domNode;
	}

	public override dispose(): void {
		super.dispose();
		this.textArea.domNode.remove();
		this.textAreaCover.domNode.remove();
	}

	private _getAndroidWordAtPosition(position: Position): [string, number] {
		const ANDROID_WORD_SEPARATORS = '`~!@#$%^&*()-=+[{]}\\|;:",.<>/?';
		const lineContent = this._context.viewModel.getLineContent(position.lineNumber);
		const wordSeparators = getMapForWordSeparators(ANDROID_WORD_SEPARATORS, []);

		let goingLeft = true;
		let startColumn = position.column;
		let goingRight = true;
		let endColumn = position.column;
		let distance = 0;
		while (distance < 50 && (goingLeft || goingRight)) {
			if (goingLeft && startColumn <= 1) {
				goingLeft = false;
			}
			if (goingLeft) {
				const charCode = lineContent.charCodeAt(startColumn - 2);
				const charClass = wordSeparators.get(charCode);
				if (charClass !== WordCharacterClass.Regular) {
					goingLeft = false;
				} else {
					startColumn--;
				}
			}
			if (goingRight && endColumn > lineContent.length) {
				goingRight = false;
			}
			if (goingRight) {
				const charCode = lineContent.charCodeAt(endColumn - 1);
				const charClass = wordSeparators.get(charCode);
				if (charClass !== WordCharacterClass.Regular) {
					goingRight = false;
				} else {
					endColumn++;
				}
			}
			distance++;
		}

		return [lineContent.substring(startColumn - 1, endColumn - 1), position.column - startColumn];
	}

	private _getWordBeforePosition(position: Position): string {
		const lineContent = this._context.viewModel.getLineContent(position.lineNumber);
		const wordSeparators = getMapForWordSeparators(this._context.configuration.options.get(EditorOption.wordSeparators), []);

		let column = position.column;
		let distance = 0;
		while (column > 1) {
			const charCode = lineContent.charCodeAt(column - 2);
			const charClass = wordSeparators.get(charCode);
			if (charClass !== WordCharacterClass.Regular || distance > 50) {
				return lineContent.substring(column - 1, position.column - 1);
			}
			distance++;
			column--;
		}
		return lineContent.substring(0, position.column - 1);
	}

	private _getCharacterBeforePosition(position: Position): string {
		if (position.column > 1) {
			const lineContent = this._context.viewModel.getLineContent(position.lineNumber);
			const charBefore = lineContent.charAt(position.column - 2);
			if (!strings.isHighSurrogate(charBefore.charCodeAt(0))) {
				return charBefore;
			}
		}
		return '';
	}

	private _setAccessibilityOptions(options: IComputedEditorOptions): void {
		this._accessibilitySupport = options.get(EditorOption.accessibilitySupport);
		const accessibilityPageSize = options.get(EditorOption.accessibilityPageSize);
		if (this._accessibilitySupport === AccessibilitySupport.Enabled && accessibilityPageSize === EditorOptions.accessibilityPageSize.defaultValue) {
			// If a screen reader is attached and the default value is not set we should automatically increase the page size to 500 for a better experience
			this._accessibilityPageSize = 500;
		} else {
			this._accessibilityPageSize = accessibilityPageSize;
		}

		// When wrapping is enabled and a screen reader might be attached,
		// we will size the textarea to match the width used for wrapping points computation (see `domLineBreaksComputer.ts`).
		// This is because screen readers will read the text in the textarea and we'd like that the
		// wrapping points in the textarea match the wrapping points in the editor.
		const layoutInfo = options.get(EditorOption.layoutInfo);
		const wrappingColumn = layoutInfo.wrappingColumn;
		if (wrappingColumn !== -1 && this._accessibilitySupport !== AccessibilitySupport.Disabled) {
			const fontInfo = options.get(EditorOption.fontInfo);
			this._textAreaWrapping = true;
			this._textAreaWidth = Math.round(wrappingColumn * fontInfo.typicalHalfwidthCharacterWidth);
		} else {
			this._textAreaWrapping = false;
			this._textAreaWidth = (canUseZeroSizeTextarea ? 0 : 1);
		}
	}

	// --- begin event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);

		this._setAccessibilityOptions(options);
		this._contentLeft = layoutInfo.contentLeft;
		this._contentWidth = layoutInfo.contentWidth;
		this._contentHeight = layoutInfo.height;
		this._fontInfo = options.get(EditorOption.fontInfo);
		this.textArea.setAttribute('wrap', this._textAreaWrapping && !this._visibleTextArea ? 'on' : 'off');
		const { tabSize } = this._context.viewModel.model.getOptions();
		this.textArea.domNode.style.tabSize = `${tabSize * this._fontInfo.spaceWidth}px`;
		this.textArea.setAttribute('aria-label', ariaLabelForScreenReaderContent(options, this._keybindingService));
		this.textArea.setAttribute('aria-required', options.get(EditorOption.ariaRequired) ? 'true' : 'false');
		this.textArea.setAttribute('tabindex', String(options.get(EditorOption.tabIndex)));

		if (e.hasChanged(EditorOption.domReadOnly) || e.hasChanged(EditorOption.readOnly)) {
			this._ensureReadOnlyAttribute();
		}

		if (e.hasChanged(EditorOption.accessibilitySupport)) {
			this._textAreaInput.writeNativeTextAreaContent('strategy changed');
		}

		return true;
	}
	public override onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean {
		this._selections = e.selections.slice(0);
		this._modelSelections = e.modelSelections.slice(0);
		// We must update the <textarea> synchronously, otherwise long press IME on macos breaks.
		// See https://github.com/microsoft/vscode/issues/165821
		this._textAreaInput.writeNativeTextAreaContent('selection changed');
		return true;
	}
	public override onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean {
		// true for inline decorations that can end up relayouting text
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
		this._scrollLeft = e.scrollLeft;
		this._scrollTop = e.scrollTop;
		return true;
	}
	public override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		return true;
	}

	// --- end event handlers

	// --- begin view API

	public isFocused(): boolean {
		return this._textAreaInput.isFocused();
	}

	public focus(): void {
		this._textAreaInput.focusTextArea();
	}

	public refreshFocusState() {
		this._textAreaInput.refreshFocusState();
	}

	public getLastRenderData(): Position | null {
		return this._lastRenderPosition;
	}

	public setAriaOptions(options: IEditorAriaOptions): void {
		if (options.activeDescendant) {
			this.textArea.setAttribute('aria-haspopup', 'true');
			this.textArea.setAttribute('aria-autocomplete', 'list');
			this.textArea.setAttribute('aria-activedescendant', options.activeDescendant);
		} else {
			this.textArea.setAttribute('aria-haspopup', 'false');
			this.textArea.setAttribute('aria-autocomplete', 'both');
			this.textArea.removeAttribute('aria-activedescendant');
		}
		if (options.role) {
			this.textArea.setAttribute('role', options.role);
		}
	}

	// --- end view API

	private _ensureReadOnlyAttribute(): void {
		const options = this._context.configuration.options;
		// When someone requests to disable IME, we set the "readonly" attribute on the <textarea>.
		// This will prevent composition.
		const useReadOnly = !IME.enabled || (options.get(EditorOption.domReadOnly) && options.get(EditorOption.readOnly));
		if (useReadOnly) {
			this.textArea.setAttribute('readonly', 'true');
		} else {
			this.textArea.removeAttribute('readonly');
		}
	}

	private _primaryCursorPosition: Position = new Position(1, 1);
	private _primaryCursorVisibleRange: HorizontalPosition | null = null;

	public prepareRender(ctx: RenderingContext): void {
		this._primaryCursorPosition = new Position(this._selections[0].positionLineNumber, this._selections[0].positionColumn);
		this._primaryCursorVisibleRange = ctx.visibleRangeForPosition(this._primaryCursorPosition);
		this._visibleTextArea?.prepareRender(ctx);
	}

	public render(ctx: RestrictedRenderingContext): void {
		this._textAreaInput.writeNativeTextAreaContent('render');
		this._render();
	}

	private _render(): void {
		if (this._visibleTextArea) {
			// The text area is visible for composition reasons

			const visibleStart = this._visibleTextArea.visibleTextareaStart;
			const visibleEnd = this._visibleTextArea.visibleTextareaEnd;
			const startPosition = this._visibleTextArea.startPosition;
			const endPosition = this._visibleTextArea.endPosition;
			if (startPosition && endPosition && visibleStart && visibleEnd && visibleEnd.left >= this._scrollLeft && visibleStart.left <= this._scrollLeft + this._contentWidth) {
				const top = (this._context.viewLayout.getVerticalOffsetForLineNumber(this._primaryCursorPosition.lineNumber) - this._scrollTop);
				const lineCount = newlinecount(this.textArea.domNode.value.substr(0, this.textArea.domNode.selectionStart));

				let scrollLeft = this._visibleTextArea.widthOfHiddenLineTextBefore;
				let left = (this._contentLeft + visibleStart.left - this._scrollLeft);
				// See https://github.com/microsoft/vscode/issues/141725#issuecomment-1050670841
				// Here we are adding +1 to avoid flickering that might be caused by having a width that is too small.
				// This could be caused by rounding errors that might only show up with certain font families.
				// In other words, a pixel might be lost when doing something like
				//      `Math.round(end) - Math.round(start)`
				// vs
				//      `Math.round(end - start)`
				let width = visibleEnd.left - visibleStart.left + 1;
				if (left < this._contentLeft) {
					// the textarea would be rendered on top of the margin,
					// so reduce its width. We use the same technique as
					// for hiding text before
					const delta = (this._contentLeft - left);
					left += delta;
					scrollLeft += delta;
					width -= delta;
				}
				if (width > this._contentWidth) {
					// the textarea would be wider than the content width,
					// so reduce its width.
					width = this._contentWidth;
				}

				// Try to render the textarea with the color/font style to match the text under it
				const lineHeight = this._context.viewLayout.getLineHeightForLineNumber(startPosition.lineNumber);
				const fontSize = this._context.viewModel.getFontSizeAtPosition(this._primaryCursorPosition);
				const viewLineData = this._context.viewModel.getViewLineData(startPosition.lineNumber);
				const startTokenIndex = viewLineData.tokens.findTokenIndexAtOffset(startPosition.column - 1);
				const endTokenIndex = viewLineData.tokens.findTokenIndexAtOffset(endPosition.column - 1);
				const textareaSpansSingleToken = (startTokenIndex === endTokenIndex);
				const presentation = this._visibleTextArea.definePresentation(
					(textareaSpansSingleToken ? viewLineData.tokens.getPresentation(startTokenIndex) : null)
				);

				this.textArea.domNode.scrollTop = lineCount * lineHeight;
				this.textArea.domNode.scrollLeft = scrollLeft;

				this._doRender({
					lastRenderPosition: null,
					top: top,
					left: left,
					width: width,
					height: lineHeight,
					useCover: false,
					color: (TokenizationRegistry.getColorMap() || [])[presentation.foreground],
					italic: presentation.italic,
					bold: presentation.bold,
					underline: presentation.underline,
					strikethrough: presentation.strikethrough,
					fontSize
				});
			}
			return;
		}

		if (!this._primaryCursorVisibleRange) {
			// The primary cursor is outside the viewport => place textarea to the top left
			this._renderAtTopLeft();
			return;
		}

		const left = this._contentLeft + this._primaryCursorVisibleRange.left - this._scrollLeft;
		if (left < this._contentLeft || left > this._contentLeft + this._contentWidth) {
			// cursor is outside the viewport
			this._renderAtTopLeft();
			return;
		}

		const top = this._context.viewLayout.getVerticalOffsetForLineNumber(this._selections[0].positionLineNumber) - this._scrollTop;
		if (top < 0 || top > this._contentHeight) {
			// cursor is outside the viewport
			this._renderAtTopLeft();
			return;
		}

		// The primary cursor is in the viewport (at least vertically) => place textarea on the cursor

		if (platform.isMacintosh || this._accessibilitySupport === AccessibilitySupport.Enabled) {
			// For the popup emoji input, we will make the text area as high as the line height
			// We will also make the fontSize and lineHeight the correct dimensions to help with the placement of these pickers
			const lineNumber = this._primaryCursorPosition.lineNumber;
			const lineHeight = this._context.viewLayout.getLineHeightForLineNumber(lineNumber);
			this._doRender({
				lastRenderPosition: this._primaryCursorPosition,
				top,
				left: this._textAreaWrapping ? this._contentLeft : left,
				width: this._textAreaWidth,
				height: lineHeight,
				useCover: false
			});
			// In case the textarea contains a word, we're going to try to align the textarea's cursor
			// with our cursor by scrolling the textarea as much as possible
			this.textArea.domNode.scrollLeft = this._primaryCursorVisibleRange.left;
			const lineCount = this._textAreaInput.textAreaState.newlineCountBeforeSelection ?? newlinecount(this.textArea.domNode.value.substring(0, this.textArea.domNode.selectionStart));
			this.textArea.domNode.scrollTop = lineCount * lineHeight;
			return;
		}

		this._doRender({
			lastRenderPosition: this._primaryCursorPosition,
			top: top,
			left: this._textAreaWrapping ? this._contentLeft : left,
			width: this._textAreaWidth,
			height: (canUseZeroSizeTextarea ? 0 : 1),
			useCover: false
		});
	}

	private _renderAtTopLeft(): void {
		// (in WebKit the textarea is 1px by 1px because it cannot handle input to a 0x0 textarea)
		// specifically, when doing Korean IME, setting the textarea to 0x0 breaks IME badly.
		this._doRender({
			lastRenderPosition: null,
			top: 0,
			left: 0,
			width: this._textAreaWidth,
			height: (canUseZeroSizeTextarea ? 0 : 1),
			useCover: true
		});
	}

	private _doRender(renderData: IRenderData): void {
		this._lastRenderPosition = renderData.lastRenderPosition;

		const ta = this.textArea;
		const tac = this.textAreaCover;

		applyFontInfo(ta, this._fontInfo);
		ta.setTop(renderData.top);
		ta.setLeft(renderData.left);
		ta.setWidth(renderData.width);
		ta.setHeight(renderData.height);
		ta.setLineHeight(renderData.height);

		ta.setFontSize(renderData.fontSize ?? this._fontInfo.fontSize);
		ta.setColor(renderData.color ? Color.Format.CSS.formatHex(renderData.color) : '');
		ta.setFontStyle(renderData.italic ? 'italic' : '');
		if (renderData.bold) {
			// fontWeight is also set by `applyFontInfo`, so only overwrite it if necessary
			ta.setFontWeight('bold');
		}
		ta.setTextDecoration(`${renderData.underline ? ' underline' : ''}${renderData.strikethrough ? ' line-through' : ''}`);

		tac.setTop(renderData.useCover ? renderData.top : 0);
		tac.setLeft(renderData.useCover ? renderData.left : 0);
		tac.setWidth(renderData.useCover ? renderData.width : 0);
		tac.setHeight(renderData.useCover ? renderData.height : 0);

		const options = this._context.configuration.options;

		if (options.get(EditorOption.glyphMargin)) {
			tac.setClassName('monaco-editor-background textAreaCover ' + Margin.OUTER_CLASS_NAME);
		} else {
			if (options.get(EditorOption.lineNumbers).renderType !== RenderLineNumbersType.Off) {
				tac.setClassName('monaco-editor-background textAreaCover ' + LineNumbersOverlay.CLASS_NAME);
			} else {
				tac.setClassName('monaco-editor-background textAreaCover');
			}
		}
	}
}

interface IRenderData {
	lastRenderPosition: Position | null;
	top: number;
	left: number;
	width: number;
	height: number;
	useCover: boolean;

	fontSize?: string | null;
	color?: Color | null;
	italic?: boolean;
	bold?: boolean;
	underline?: boolean;
	strikethrough?: boolean;
}

function measureText(targetDocument: Document, text: string, fontInfo: FontInfo, tabSize: number): number {
	if (text.length === 0) {
		return 0;
	}

	const container = targetDocument.createElement('div');
	container.style.position = 'absolute';
	container.style.top = '-50000px';
	container.style.width = '50000px';

	const regularDomNode = targetDocument.createElement('span');
	applyFontInfo(regularDomNode, fontInfo);
	regularDomNode.style.whiteSpace = 'pre'; // just like the textarea
	regularDomNode.style.tabSize = `${tabSize * fontInfo.spaceWidth}px`; // just like the textarea
	regularDomNode.append(text);
	container.appendChild(regularDomNode);

	targetDocument.body.appendChild(container);

	const res = regularDomNode.offsetWidth;

	container.remove();

	return res;
}
```

--------------------------------------------------------------------------------

````

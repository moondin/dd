---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 202
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 202 of 552)

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

---[FILE: src/vs/editor/browser/viewParts/overviewRuler/decorationsOverviewRuler.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/overviewRuler/decorationsOverviewRuler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { Color } from '../../../../base/common/color.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { ViewPart } from '../../view/viewPart.js';
import { Position } from '../../../common/core/position.js';
import { IEditorConfiguration } from '../../../common/config/editorConfiguration.js';
import { TokenizationRegistry } from '../../../common/languages.js';
import { editorCursorForeground, editorOverviewRulerBorder, editorOverviewRulerBackground, editorMultiCursorSecondaryForeground, editorMultiCursorPrimaryForeground } from '../../../common/core/editorColorRegistry.js';
import { RenderingContext, RestrictedRenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import { EditorTheme } from '../../../common/editorTheme.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { OverviewRulerDecorationsGroup } from '../../../common/viewModel.js';
import { equals } from '../../../../base/common/arrays.js';

class Settings {

	public readonly lineHeight: number;
	public readonly pixelRatio: number;
	public readonly overviewRulerLanes: number;

	public readonly renderBorder: boolean;
	public readonly borderColor: string | null;

	public readonly hideCursor: boolean;
	public readonly cursorColorSingle: string | null;
	public readonly cursorColorPrimary: string | null;
	public readonly cursorColorSecondary: string | null;

	public readonly themeType: 'light' | 'dark' | 'hcLight' | 'hcDark';
	public readonly backgroundColor: Color | null;

	public readonly top: number;
	public readonly right: number;
	public readonly domWidth: number;
	public readonly domHeight: number;
	public readonly canvasWidth: number;
	public readonly canvasHeight: number;

	public readonly x: number[];
	public readonly w: number[];

	constructor(config: IEditorConfiguration, theme: EditorTheme) {
		const options = config.options;
		this.lineHeight = options.get(EditorOption.lineHeight);
		this.pixelRatio = options.get(EditorOption.pixelRatio);
		this.overviewRulerLanes = options.get(EditorOption.overviewRulerLanes);

		this.renderBorder = options.get(EditorOption.overviewRulerBorder);
		const borderColor = theme.getColor(editorOverviewRulerBorder);
		this.borderColor = borderColor ? borderColor.toString() : null;

		this.hideCursor = options.get(EditorOption.hideCursorInOverviewRuler);
		const cursorColorSingle = theme.getColor(editorCursorForeground);
		this.cursorColorSingle = cursorColorSingle ? cursorColorSingle.transparent(0.7).toString() : null;
		const cursorColorPrimary = theme.getColor(editorMultiCursorPrimaryForeground);
		this.cursorColorPrimary = cursorColorPrimary ? cursorColorPrimary.transparent(0.7).toString() : null;
		const cursorColorSecondary = theme.getColor(editorMultiCursorSecondaryForeground);
		this.cursorColorSecondary = cursorColorSecondary ? cursorColorSecondary.transparent(0.7).toString() : null;

		this.themeType = theme.type;

		const minimapOpts = options.get(EditorOption.minimap);
		const minimapEnabled = minimapOpts.enabled;
		const minimapSide = minimapOpts.side;
		const themeColor = theme.getColor(editorOverviewRulerBackground);
		const defaultBackground = TokenizationRegistry.getDefaultBackground();

		if (themeColor) {
			this.backgroundColor = themeColor;
		} else if (minimapEnabled && minimapSide === 'right') {
			this.backgroundColor = defaultBackground;
		} else {
			this.backgroundColor = null;
		}

		const layoutInfo = options.get(EditorOption.layoutInfo);
		const position = layoutInfo.overviewRuler;
		this.top = position.top;
		this.right = position.right;
		this.domWidth = position.width;
		this.domHeight = position.height;
		if (this.overviewRulerLanes === 0) {
			// overview ruler is off
			this.canvasWidth = 0;
			this.canvasHeight = 0;
		} else {
			this.canvasWidth = (this.domWidth * this.pixelRatio) | 0;
			this.canvasHeight = (this.domHeight * this.pixelRatio) | 0;
		}

		const [x, w] = this._initLanes(1, this.canvasWidth, this.overviewRulerLanes);
		this.x = x;
		this.w = w;
	}

	private _initLanes(canvasLeftOffset: number, canvasWidth: number, laneCount: number): [number[], number[]] {
		const remainingWidth = canvasWidth - canvasLeftOffset;

		if (laneCount >= 3) {
			const leftWidth = Math.floor(remainingWidth / 3);
			const rightWidth = Math.floor(remainingWidth / 3);
			const centerWidth = remainingWidth - leftWidth - rightWidth;
			const leftOffset = canvasLeftOffset;
			const centerOffset = leftOffset + leftWidth;
			const rightOffset = leftOffset + leftWidth + centerWidth;

			return [
				[
					0,
					leftOffset, // Left
					centerOffset, // Center
					leftOffset, // Left | Center
					rightOffset, // Right
					leftOffset, // Left | Right
					centerOffset, // Center | Right
					leftOffset, // Left | Center | Right
				], [
					0,
					leftWidth, // Left
					centerWidth, // Center
					leftWidth + centerWidth, // Left | Center
					rightWidth, // Right
					leftWidth + centerWidth + rightWidth, // Left | Right
					centerWidth + rightWidth, // Center | Right
					leftWidth + centerWidth + rightWidth, // Left | Center | Right
				]
			];
		} else if (laneCount === 2) {
			const leftWidth = Math.floor(remainingWidth / 2);
			const rightWidth = remainingWidth - leftWidth;
			const leftOffset = canvasLeftOffset;
			const rightOffset = leftOffset + leftWidth;

			return [
				[
					0,
					leftOffset, // Left
					leftOffset, // Center
					leftOffset, // Left | Center
					rightOffset, // Right
					leftOffset, // Left | Right
					leftOffset, // Center | Right
					leftOffset, // Left | Center | Right
				], [
					0,
					leftWidth, // Left
					leftWidth, // Center
					leftWidth, // Left | Center
					rightWidth, // Right
					leftWidth + rightWidth, // Left | Right
					leftWidth + rightWidth, // Center | Right
					leftWidth + rightWidth, // Left | Center | Right
				]
			];
		} else {
			const offset = canvasLeftOffset;
			const width = remainingWidth;

			return [
				[
					0,
					offset, // Left
					offset, // Center
					offset, // Left | Center
					offset, // Right
					offset, // Left | Right
					offset, // Center | Right
					offset, // Left | Center | Right
				], [
					0,
					width, // Left
					width, // Center
					width, // Left | Center
					width, // Right
					width, // Left | Right
					width, // Center | Right
					width, // Left | Center | Right
				]
			];
		}
	}

	public equals(other: Settings): boolean {
		return (
			this.lineHeight === other.lineHeight
			&& this.pixelRatio === other.pixelRatio
			&& this.overviewRulerLanes === other.overviewRulerLanes
			&& this.renderBorder === other.renderBorder
			&& this.borderColor === other.borderColor
			&& this.hideCursor === other.hideCursor
			&& this.cursorColorSingle === other.cursorColorSingle
			&& this.cursorColorPrimary === other.cursorColorPrimary
			&& this.cursorColorSecondary === other.cursorColorSecondary
			&& this.themeType === other.themeType
			&& Color.equals(this.backgroundColor, other.backgroundColor)
			&& this.top === other.top
			&& this.right === other.right
			&& this.domWidth === other.domWidth
			&& this.domHeight === other.domHeight
			&& this.canvasWidth === other.canvasWidth
			&& this.canvasHeight === other.canvasHeight
		);
	}
}

const enum Constants {
	MIN_DECORATION_HEIGHT = 6
}

const enum OverviewRulerLane {
	Left = 1,
	Center = 2,
	Right = 4,
	Full = 7
}

type Cursor = {
	position: Position;
	color: string | null;
};

const enum ShouldRenderValue {
	NotNeeded = 0,
	Maybe = 1,
	Needed = 2
}

export class DecorationsOverviewRuler extends ViewPart {

	private _actualShouldRender: ShouldRenderValue = ShouldRenderValue.NotNeeded;

	private readonly _tokensColorTrackerListener: IDisposable;
	private readonly _domNode: FastDomNode<HTMLCanvasElement>;
	private _settings!: Settings;
	private _cursorPositions: Cursor[];

	private _renderedDecorations: OverviewRulerDecorationsGroup[] = [];
	private _renderedCursorPositions: Cursor[] = [];

	constructor(context: ViewContext) {
		super(context);

		this._domNode = createFastDomNode(document.createElement('canvas'));
		this._domNode.setClassName('decorationsOverviewRuler');
		this._domNode.setPosition('absolute');
		this._domNode.setLayerHinting(true);
		this._domNode.setContain('strict');
		this._domNode.setAttribute('aria-hidden', 'true');

		this._updateSettings(false);

		this._tokensColorTrackerListener = TokenizationRegistry.onDidChange((e) => {
			if (e.changedColorMap) {
				this._updateSettings(true);
			}
		});

		this._cursorPositions = [{ position: new Position(1, 1), color: this._settings.cursorColorSingle }];
	}

	public override dispose(): void {
		super.dispose();
		this._tokensColorTrackerListener.dispose();
	}

	private _updateSettings(renderNow: boolean): boolean {
		const newSettings = new Settings(this._context.configuration, this._context.theme);
		if (this._settings && this._settings.equals(newSettings)) {
			// nothing to do
			return false;
		}

		this._settings = newSettings;

		this._domNode.setTop(this._settings.top);
		this._domNode.setRight(this._settings.right);
		this._domNode.setWidth(this._settings.domWidth);
		this._domNode.setHeight(this._settings.domHeight);
		this._domNode.domNode.width = this._settings.canvasWidth;
		this._domNode.domNode.height = this._settings.canvasHeight;

		if (renderNow) {
			this._render();
		}

		return true;
	}

	// ---- begin view event handlers

	private _markRenderingIsNeeded(): true {
		this._actualShouldRender = ShouldRenderValue.Needed;
		return true;
	}

	private _markRenderingIsMaybeNeeded(): true {
		this._actualShouldRender = ShouldRenderValue.Maybe;
		return true;
	}

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		return this._updateSettings(false) ? this._markRenderingIsNeeded() : false;
	}
	public override onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean {
		this._cursorPositions = [];
		for (let i = 0, len = e.selections.length; i < len; i++) {
			let color = this._settings.cursorColorSingle;
			if (len > 1) {
				color = i === 0 ? this._settings.cursorColorPrimary : this._settings.cursorColorSecondary;
			}
			this._cursorPositions.push({ position: e.selections[i].getPosition(), color });
		}
		this._cursorPositions.sort((a, b) => Position.compare(a.position, b.position));
		return this._markRenderingIsMaybeNeeded();
	}
	public override onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean {
		if (e.affectsOverviewRuler) {
			return this._markRenderingIsMaybeNeeded();
		}
		return false;
	}
	public override onFlushed(e: viewEvents.ViewFlushedEvent): boolean {
		return this._markRenderingIsNeeded();
	}
	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return e.scrollHeightChanged ? this._markRenderingIsNeeded() : false;
	}
	public override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		return this._markRenderingIsNeeded();
	}
	public override onThemeChanged(e: viewEvents.ViewThemeChangedEvent): boolean {
		return this._updateSettings(false) ? this._markRenderingIsNeeded() : false;
	}

	// ---- end view event handlers

	public getDomNode(): HTMLElement {
		return this._domNode.domNode;
	}

	public prepareRender(ctx: RenderingContext): void {
		// Nothing to read
	}

	public render(editorCtx: RestrictedRenderingContext): void {
		this._render();
		this._actualShouldRender = ShouldRenderValue.NotNeeded;
	}

	private _render(): void {
		const backgroundColor = this._settings.backgroundColor;
		if (this._settings.overviewRulerLanes === 0) {
			// overview ruler is off
			this._domNode.setBackgroundColor(backgroundColor ? Color.Format.CSS.formatHexA(backgroundColor) : '');
			this._domNode.setDisplay('none');
			return;
		}

		const decorations = this._context.viewModel.getAllOverviewRulerDecorations(this._context.theme);
		decorations.sort(OverviewRulerDecorationsGroup.compareByRenderingProps);

		if (this._actualShouldRender === ShouldRenderValue.Maybe && !OverviewRulerDecorationsGroup.equalsArr(this._renderedDecorations, decorations)) {
			this._actualShouldRender = ShouldRenderValue.Needed;
		}
		if (this._actualShouldRender === ShouldRenderValue.Maybe && !equals(this._renderedCursorPositions, this._cursorPositions, (a, b) => a.position.lineNumber === b.position.lineNumber && a.color === b.color)) {
			this._actualShouldRender = ShouldRenderValue.Needed;
		}
		if (this._actualShouldRender === ShouldRenderValue.Maybe) {
			// both decorations and cursor positions are unchanged, nothing to do
			return;
		}
		this._renderedDecorations = decorations;
		this._renderedCursorPositions = this._cursorPositions;

		this._domNode.setDisplay('block');
		const canvasWidth = this._settings.canvasWidth;
		const canvasHeight = this._settings.canvasHeight;
		const lineHeight = this._settings.lineHeight;
		const viewLayout = this._context.viewLayout;
		const outerHeight = this._context.viewLayout.getScrollHeight();
		const heightRatio = canvasHeight / outerHeight;

		const minDecorationHeight = (Constants.MIN_DECORATION_HEIGHT * this._settings.pixelRatio) | 0;
		const halfMinDecorationHeight = (minDecorationHeight / 2) | 0;

		const canvasCtx = this._domNode.domNode.getContext('2d')!;
		if (backgroundColor) {
			if (backgroundColor.isOpaque()) {
				// We have a background color which is opaque, we can just paint the entire surface with it
				canvasCtx.fillStyle = Color.Format.CSS.formatHexA(backgroundColor);
				canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
			} else {
				// We have a background color which is transparent, we need to first clear the surface and
				// then fill it
				canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
				canvasCtx.fillStyle = Color.Format.CSS.formatHexA(backgroundColor);
				canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
			}
		} else {
			// We don't have a background color
			canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
		}

		const x = this._settings.x;
		const w = this._settings.w;



		for (const decorationGroup of decorations) {
			const color = decorationGroup.color;
			const decorationGroupData = decorationGroup.data;

			canvasCtx.fillStyle = color;

			let prevLane = 0;
			let prevY1 = 0;
			let prevY2 = 0;
			for (let i = 0, len = decorationGroupData.length / 3; i < len; i++) {
				const lane = decorationGroupData[3 * i];
				const startLineNumber = decorationGroupData[3 * i + 1];
				const endLineNumber = decorationGroupData[3 * i + 2];

				let y1 = (viewLayout.getVerticalOffsetForLineNumber(startLineNumber) * heightRatio) | 0;
				let y2 = ((viewLayout.getVerticalOffsetForLineNumber(endLineNumber) + lineHeight) * heightRatio) | 0;
				const height = y2 - y1;
				if (height < minDecorationHeight) {
					let yCenter = ((y1 + y2) / 2) | 0;
					if (yCenter < halfMinDecorationHeight) {
						yCenter = halfMinDecorationHeight;
					} else if (yCenter + halfMinDecorationHeight > canvasHeight) {
						yCenter = canvasHeight - halfMinDecorationHeight;
					}
					y1 = yCenter - halfMinDecorationHeight;
					y2 = yCenter + halfMinDecorationHeight;
				}

				if (y1 > prevY2 + 1 || lane !== prevLane) {
					// flush prev
					if (i !== 0) {
						canvasCtx.fillRect(x[prevLane], prevY1, w[prevLane], prevY2 - prevY1);
					}
					prevLane = lane;
					prevY1 = y1;
					prevY2 = y2;
				} else {
					// merge into prev
					if (y2 > prevY2) {
						prevY2 = y2;
					}
				}
			}
			canvasCtx.fillRect(x[prevLane], prevY1, w[prevLane], prevY2 - prevY1);
		}

		// Draw cursors
		if (!this._settings.hideCursor) {
			const cursorHeight = (2 * this._settings.pixelRatio) | 0;
			const halfCursorHeight = (cursorHeight / 2) | 0;
			const cursorX = this._settings.x[OverviewRulerLane.Full];
			const cursorW = this._settings.w[OverviewRulerLane.Full];

			let prevY1 = -100;
			let prevY2 = -100;
			let prevColor: string | null = null;
			for (let i = 0, len = this._cursorPositions.length; i < len; i++) {
				const color = this._cursorPositions[i].color;
				if (!color) {
					continue;
				}
				const cursor = this._cursorPositions[i].position;

				let yCenter = (viewLayout.getVerticalOffsetForLineNumber(cursor.lineNumber) * heightRatio) | 0;
				if (yCenter < halfCursorHeight) {
					yCenter = halfCursorHeight;
				} else if (yCenter + halfCursorHeight > canvasHeight) {
					yCenter = canvasHeight - halfCursorHeight;
				}
				const y1 = yCenter - halfCursorHeight;
				const y2 = y1 + cursorHeight;

				if (y1 > prevY2 + 1 || color !== prevColor) {
					// flush prev
					if (i !== 0 && prevColor) {
						canvasCtx.fillRect(cursorX, prevY1, cursorW, prevY2 - prevY1);
					}
					prevY1 = y1;
					prevY2 = y2;
				} else {
					// merge into prev
					if (y2 > prevY2) {
						prevY2 = y2;
					}
				}
				prevColor = color;
				canvasCtx.fillStyle = color;
			}
			if (prevColor) {
				canvasCtx.fillRect(cursorX, prevY1, cursorW, prevY2 - prevY1);
			}
		}

		if (this._settings.renderBorder && this._settings.borderColor && this._settings.overviewRulerLanes > 0) {
			canvasCtx.beginPath();
			canvasCtx.lineWidth = 1;
			canvasCtx.strokeStyle = this._settings.borderColor;
			canvasCtx.moveTo(0, 0);
			canvasCtx.lineTo(0, canvasHeight);
			canvasCtx.moveTo(1, 0);
			canvasCtx.lineTo(canvasWidth, 0);
			canvasCtx.stroke();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/overviewRuler/overviewRuler.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/overviewRuler/overviewRuler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { IOverviewRuler } from '../../editorBrowser.js';
import { OverviewRulerPosition, EditorOption } from '../../../common/config/editorOptions.js';
import { ColorZone, OverviewRulerZone, OverviewZoneManager } from '../../../common/viewModel/overviewZoneManager.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { ViewEventHandler } from '../../../common/viewEventHandler.js';

/**
 * The overview ruler appears underneath the editor scroll bar and shows things
 * like the cursor, various decorations, etc.
 */
export class OverviewRuler extends ViewEventHandler implements IOverviewRuler {

	private readonly _context: ViewContext;
	private readonly _domNode: FastDomNode<HTMLCanvasElement>;
	private readonly _zoneManager: OverviewZoneManager;

	constructor(context: ViewContext, cssClassName: string) {
		super();
		this._context = context;
		const options = this._context.configuration.options;

		this._domNode = createFastDomNode(document.createElement('canvas'));
		this._domNode.setClassName(cssClassName);
		this._domNode.setPosition('absolute');
		this._domNode.setLayerHinting(true);
		this._domNode.setContain('strict');

		this._zoneManager = new OverviewZoneManager((lineNumber: number) => this._context.viewLayout.getVerticalOffsetForLineNumber(lineNumber));
		this._zoneManager.setDOMWidth(0);
		this._zoneManager.setDOMHeight(0);
		this._zoneManager.setOuterHeight(this._context.viewLayout.getScrollHeight());
		this._zoneManager.setLineHeight(options.get(EditorOption.lineHeight));

		this._zoneManager.setPixelRatio(options.get(EditorOption.pixelRatio));

		this._context.addEventHandler(this);
	}

	public override dispose(): void {
		this._context.removeEventHandler(this);
		super.dispose();
	}

	// ---- begin view event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const options = this._context.configuration.options;

		if (e.hasChanged(EditorOption.lineHeight)) {
			this._zoneManager.setLineHeight(options.get(EditorOption.lineHeight));
			this._render();
		}

		if (e.hasChanged(EditorOption.pixelRatio)) {
			this._zoneManager.setPixelRatio(options.get(EditorOption.pixelRatio));
			this._domNode.setWidth(this._zoneManager.getDOMWidth());
			this._domNode.setHeight(this._zoneManager.getDOMHeight());
			this._domNode.domNode.width = this._zoneManager.getCanvasWidth();
			this._domNode.domNode.height = this._zoneManager.getCanvasHeight();
			this._render();
		}

		return true;
	}
	public override onFlushed(e: viewEvents.ViewFlushedEvent): boolean {
		this._render();
		return true;
	}
	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		if (e.scrollHeightChanged) {
			this._zoneManager.setOuterHeight(e.scrollHeight);
			this._render();
		}
		return true;
	}
	public override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		this._render();
		return true;
	}

	// ---- end view event handlers

	public getDomNode(): HTMLElement {
		return this._domNode.domNode;
	}

	public setLayout(position: OverviewRulerPosition): void {
		this._domNode.setTop(position.top);
		this._domNode.setRight(position.right);

		let hasChanged = false;
		hasChanged = this._zoneManager.setDOMWidth(position.width) || hasChanged;
		hasChanged = this._zoneManager.setDOMHeight(position.height) || hasChanged;

		if (hasChanged) {
			this._domNode.setWidth(this._zoneManager.getDOMWidth());
			this._domNode.setHeight(this._zoneManager.getDOMHeight());
			this._domNode.domNode.width = this._zoneManager.getCanvasWidth();
			this._domNode.domNode.height = this._zoneManager.getCanvasHeight();

			this._render();
		}
	}

	public setZones(zones: OverviewRulerZone[]): void {
		this._zoneManager.setZones(zones);
		this._render();
	}

	private _render(): boolean {
		if (this._zoneManager.getOuterHeight() === 0) {
			return false;
		}

		const width = this._zoneManager.getCanvasWidth();
		const height = this._zoneManager.getCanvasHeight();

		const colorZones = this._zoneManager.resolveColorZones();
		const id2Color = this._zoneManager.getId2Color();

		const ctx = this._domNode.domNode.getContext('2d')!;
		ctx.clearRect(0, 0, width, height);
		if (colorZones.length > 0) {
			this._renderOneLane(ctx, colorZones, id2Color, width);
		}

		return true;
	}

	private _renderOneLane(ctx: CanvasRenderingContext2D, colorZones: ColorZone[], id2Color: string[], width: number): void {

		let currentColorId = 0; // will never match a real color id which is > 0
		let currentFrom = 0;
		let currentTo = 0;

		for (const zone of colorZones) {

			const zoneColorId = zone.colorId;
			const zoneFrom = zone.from;
			const zoneTo = zone.to;

			if (zoneColorId !== currentColorId) {
				if (currentColorId !== 0) {
					ctx.fillRect(0, currentFrom, width, currentTo - currentFrom);
				}

				currentColorId = zoneColorId;
				ctx.fillStyle = id2Color[currentColorId];
				currentFrom = zoneFrom;
				currentTo = zoneTo;
			} else {
				if (currentTo >= zoneFrom) {
					currentTo = Math.max(currentTo, zoneTo);
				} else {
					ctx.fillRect(0, currentFrom, width, currentTo - currentFrom);
					currentFrom = zoneFrom;
					currentTo = zoneTo;
				}
			}
		}

		ctx.fillRect(0, currentFrom, width, currentTo - currentFrom);

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/rulers/rulers.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/rulers/rulers.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .view-ruler {
	position: absolute;
	top: 0;
	box-shadow: 1px 0 0 0 var(--vscode-editorRuler-foreground) inset;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/rulers/rulers.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/rulers/rulers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './rulers.css';
import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { ViewPart } from '../../view/viewPart.js';
import { RenderingContext, RestrictedRenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { EditorOption, IRulerOption } from '../../../common/config/editorOptions.js';

/**
 * Rulers are vertical lines that appear at certain columns in the editor. There can be >= 0 rulers
 * at a time.
 */
export class Rulers extends ViewPart {

	public domNode: FastDomNode<HTMLElement>;
	private readonly _renderedRulers: FastDomNode<HTMLElement>[];
	private _rulers: IRulerOption[];
	private _typicalHalfwidthCharacterWidth: number;

	constructor(context: ViewContext) {
		super(context);
		this.domNode = createFastDomNode<HTMLElement>(document.createElement('div'));
		this.domNode.setAttribute('role', 'presentation');
		this.domNode.setAttribute('aria-hidden', 'true');
		this.domNode.setClassName('view-rulers');
		this._renderedRulers = [];
		const options = this._context.configuration.options;
		this._rulers = options.get(EditorOption.rulers);
		this._typicalHalfwidthCharacterWidth = options.get(EditorOption.fontInfo).typicalHalfwidthCharacterWidth;
	}

	public override dispose(): void {
		super.dispose();
	}

	// --- begin event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const options = this._context.configuration.options;
		this._rulers = options.get(EditorOption.rulers);
		this._typicalHalfwidthCharacterWidth = options.get(EditorOption.fontInfo).typicalHalfwidthCharacterWidth;
		return true;
	}
	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		return e.scrollHeightChanged;
	}

	// --- end event handlers

	public prepareRender(ctx: RenderingContext): void {
		// Nothing to read
	}

	private _ensureRulersCount(): void {
		const currentCount = this._renderedRulers.length;
		const desiredCount = this._rulers.length;

		if (currentCount === desiredCount) {
			// Nothing to do
			return;
		}

		if (currentCount < desiredCount) {
			let addCount = desiredCount - currentCount;
			while (addCount > 0) {
				const node = createFastDomNode(document.createElement('div'));
				node.setClassName('view-ruler');
				node.setWidth('1px');
				this.domNode.appendChild(node);
				this._renderedRulers.push(node);
				addCount--;
			}
			return;
		}

		let removeCount = currentCount - desiredCount;
		while (removeCount > 0) {
			const node = this._renderedRulers.pop()!;
			this.domNode.removeChild(node);
			removeCount--;
		}
	}

	public render(ctx: RestrictedRenderingContext): void {

		this._ensureRulersCount();

		for (let i = 0, len = this._rulers.length; i < len; i++) {
			const node = this._renderedRulers[i];
			const ruler = this._rulers[i];

			node.setBoxShadow(ruler.color ? `1px 0 0 0 ${ruler.color} inset` : ``);
			node.setHeight(Math.min(ctx.scrollHeight, 1000000));
			node.setLeft(ruler.column * this._typicalHalfwidthCharacterWidth);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/rulersGpu/rulersGpu.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/rulersGpu/rulersGpu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ViewPart } from '../../view/viewPart.js';
import { RenderingContext, RestrictedRenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import type { ViewGpuContext } from '../../gpu/viewGpuContext.js';
import type { IObjectCollectionBufferEntry } from '../../gpu/objectCollectionBuffer.js';
import type { RectangleRenderer, RectangleRendererEntrySpec } from '../../gpu/rectangleRenderer.js';
import { Color } from '../../../../base/common/color.js';
import { editorRuler } from '../../../common/core/editorColorRegistry.js';
import { autorun, type IReader } from '../../../../base/common/observable.js';

/**
 * Rulers are vertical lines that appear at certain columns in the editor. There can be >= 0 rulers
 * at a time.
 */
export class RulersGpu extends ViewPart {

	private readonly _gpuShapes: IObjectCollectionBufferEntry<RectangleRendererEntrySpec>[] = [];

	constructor(
		context: ViewContext,
		private readonly _viewGpuContext: ViewGpuContext
	) {
		super(context);
		this._register(autorun(reader => this._updateEntries(reader)));
	}

	// --- begin event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		this._updateEntries(undefined);
		return true;
	}

	// --- end event handlers

	public prepareRender(ctx: RenderingContext): void {
		// Nothing to read
	}

	public render(ctx: RestrictedRenderingContext): void {
		// Rendering is handled by RectangleRenderer
	}

	private _updateEntries(reader: IReader | undefined) {
		const options = this._context.configuration.options;
		const rulers = options.get(EditorOption.rulers);
		const typicalHalfwidthCharacterWidth = options.get(EditorOption.fontInfo).typicalHalfwidthCharacterWidth;
		const devicePixelRatio = this._viewGpuContext.devicePixelRatio.read(reader);
		for (let i = 0, len = rulers.length; i < len; i++) {
			const ruler = rulers[i];
			const shape = this._gpuShapes[i];
			const color = ruler.color ? Color.fromHex(ruler.color) : this._context.theme.getColor(editorRuler) ?? Color.white;
			const rulerData: Parameters<RectangleRenderer['register']> = [
				ruler.column * typicalHalfwidthCharacterWidth * devicePixelRatio,
				0,
				Math.max(1, Math.ceil(devicePixelRatio)),
				Number.MAX_SAFE_INTEGER,
				color.rgba.r / 255,
				color.rgba.g / 255,
				color.rgba.b / 255,
				color.rgba.a,
			];
			if (!shape) {
				this._gpuShapes[i] = this._viewGpuContext.rectangleRenderer.register(...rulerData);
			} else {
				shape.setRaw(rulerData);
			}
		}
		while (this._gpuShapes.length > rulers.length) {
			this._gpuShapes.splice(-1, 1)[0].dispose();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/scrollDecoration/scrollDecoration.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/scrollDecoration/scrollDecoration.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .scroll-decoration {
	position: absolute;
	top: 0;
	left: 0;
	height: 6px;
	box-shadow: var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/scrollDecoration/scrollDecoration.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/scrollDecoration/scrollDecoration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './scrollDecoration.css';
import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { ViewPart } from '../../view/viewPart.js';
import { RenderingContext, RestrictedRenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { EditorOption, RenderMinimap } from '../../../common/config/editorOptions.js';


export class ScrollDecorationViewPart extends ViewPart {

	private readonly _domNode: FastDomNode<HTMLElement>;
	private _scrollTop: number;
	private _width: number;
	private _shouldShow: boolean;
	private _useShadows: boolean;

	constructor(context: ViewContext) {
		super(context);

		this._scrollTop = 0;
		this._width = 0;
		this._updateWidth();
		this._shouldShow = false;
		const options = this._context.configuration.options;
		const scrollbar = options.get(EditorOption.scrollbar);
		this._useShadows = scrollbar.useShadows;
		this._domNode = createFastDomNode(document.createElement('div'));
		this._domNode.setAttribute('role', 'presentation');
		this._domNode.setAttribute('aria-hidden', 'true');
	}

	public override dispose(): void {
		super.dispose();
	}

	private _updateShouldShow(): boolean {
		const newShouldShow = (this._useShadows && this._scrollTop > 0);
		if (this._shouldShow !== newShouldShow) {
			this._shouldShow = newShouldShow;
			return true;
		}
		return false;
	}

	public getDomNode(): FastDomNode<HTMLElement> {
		return this._domNode;
	}

	private _updateWidth(): void {
		const options = this._context.configuration.options;
		const layoutInfo = options.get(EditorOption.layoutInfo);

		if (layoutInfo.minimap.renderMinimap === RenderMinimap.None || (layoutInfo.minimap.minimapWidth > 0 && layoutInfo.minimap.minimapLeft === 0)) {
			this._width = layoutInfo.width;
		} else {
			this._width = layoutInfo.width - layoutInfo.verticalScrollbarWidth;
		}
	}

	// --- begin event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const options = this._context.configuration.options;
		const scrollbar = options.get(EditorOption.scrollbar);
		this._useShadows = scrollbar.useShadows;
		this._updateWidth();
		this._updateShouldShow();
		return true;
	}
	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		this._scrollTop = e.scrollTop;
		return this._updateShouldShow();
	}

	// --- end event handlers

	public prepareRender(ctx: RenderingContext): void {
		// Nothing to read
	}

	public render(ctx: RestrictedRenderingContext): void {
		this._domNode.setWidth(this._width);
		this._domNode.setClassName(this._shouldShow ? 'scroll-decoration' : '');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/selections/selections.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/selections/selections.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*
	Keeping name short for faster parsing.
	cslr = core selections layer rendering (div)
*/
.monaco-editor .lines-content .cslr {
	position: absolute;
}

.monaco-editor .focused .selected-text {
	background-color: var(--vscode-editor-selectionBackground);
}

.monaco-editor .selected-text {
	background-color: var(--vscode-editor-inactiveSelectionBackground);
}

.monaco-editor			.top-left-radius		{ border-top-left-radius: 3px; }
.monaco-editor			.bottom-left-radius		{ border-bottom-left-radius: 3px; }
.monaco-editor			.top-right-radius		{ border-top-right-radius: 3px; }
.monaco-editor			.bottom-right-radius	{ border-bottom-right-radius: 3px; }

.monaco-editor.hc-black .top-left-radius		{ border-top-left-radius: 0; }
.monaco-editor.hc-black .bottom-left-radius		{ border-bottom-left-radius: 0; }
.monaco-editor.hc-black .top-right-radius		{ border-top-right-radius: 0; }
.monaco-editor.hc-black .bottom-right-radius	{ border-bottom-right-radius: 0; }

.monaco-editor.hc-light .top-left-radius		{ border-top-left-radius: 0; }
.monaco-editor.hc-light .bottom-left-radius		{ border-bottom-left-radius: 0; }
.monaco-editor.hc-light .top-right-radius		{ border-top-right-radius: 0; }
.monaco-editor.hc-light .bottom-right-radius	{ border-bottom-right-radius: 0; }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/selections/selections.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/selections/selections.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './selections.css';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
import { Range } from '../../../common/core/range.js';
import { HorizontalRange, LineVisibleRanges, RenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { editorSelectionForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { EditorOption } from '../../../common/config/editorOptions.js';

const enum CornerStyle {
	EXTERN,
	INTERN,
	FLAT
}

interface IVisibleRangeEndPointStyle {
	top: CornerStyle;
	bottom: CornerStyle;
}

class HorizontalRangeWithStyle {
	public left: number;
	public width: number;
	public startStyle: IVisibleRangeEndPointStyle | null;
	public endStyle: IVisibleRangeEndPointStyle | null;

	constructor(other: HorizontalRange) {
		this.left = other.left;
		this.width = other.width;
		this.startStyle = null;
		this.endStyle = null;
	}
}

class LineVisibleRangesWithStyle {
	public lineNumber: number;
	public ranges: HorizontalRangeWithStyle[];

	constructor(lineNumber: number, ranges: HorizontalRangeWithStyle[]) {
		this.lineNumber = lineNumber;
		this.ranges = ranges;
	}
}

function toStyledRange(item: HorizontalRange): HorizontalRangeWithStyle {
	return new HorizontalRangeWithStyle(item);
}

function toStyled(item: LineVisibleRanges): LineVisibleRangesWithStyle {
	return new LineVisibleRangesWithStyle(item.lineNumber, item.ranges.map(toStyledRange));
}

/**
 * This view part displays selected text to the user. Every line has its own selection overlay.
 */
export class SelectionsOverlay extends DynamicViewOverlay {

	private static readonly SELECTION_CLASS_NAME = 'selected-text';
	private static readonly SELECTION_TOP_LEFT = 'top-left-radius';
	private static readonly SELECTION_BOTTOM_LEFT = 'bottom-left-radius';
	private static readonly SELECTION_TOP_RIGHT = 'top-right-radius';
	private static readonly SELECTION_BOTTOM_RIGHT = 'bottom-right-radius';
	private static readonly EDITOR_BACKGROUND_CLASS_NAME = 'monaco-editor-background';

	private static readonly ROUNDED_PIECE_WIDTH = 10;

	private readonly _context: ViewContext;
	private _roundedSelection: boolean;
	private _typicalHalfwidthCharacterWidth: number;
	private _selections: Range[];
	private _renderResult: string[] | null;

	constructor(context: ViewContext) {
		super();
		this._context = context;
		const options = this._context.configuration.options;
		this._roundedSelection = options.get(EditorOption.roundedSelection);
		this._typicalHalfwidthCharacterWidth = options.get(EditorOption.fontInfo).typicalHalfwidthCharacterWidth;
		this._selections = [];
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
		this._roundedSelection = options.get(EditorOption.roundedSelection);
		this._typicalHalfwidthCharacterWidth = options.get(EditorOption.fontInfo).typicalHalfwidthCharacterWidth;
		return true;
	}
	public override onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean {
		this._selections = e.selections.slice(0);
		return true;
	}
	public override onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean {
		// true for inline decorations that can end up relayouting text
		return true;//e.inlineDecorationsChanged;
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

	private _visibleRangesHaveGaps(linesVisibleRanges: LineVisibleRangesWithStyle[]): boolean {

		for (let i = 0, len = linesVisibleRanges.length; i < len; i++) {
			const lineVisibleRanges = linesVisibleRanges[i];

			if (lineVisibleRanges.ranges.length > 1) {
				// There are two ranges on the same line
				return true;
			}
		}

		return false;
	}

	private _enrichVisibleRangesWithStyle(viewport: Range, linesVisibleRanges: LineVisibleRangesWithStyle[], previousFrame: LineVisibleRangesWithStyle[] | null): void {
		const epsilon = this._typicalHalfwidthCharacterWidth / 4;
		let previousFrameTop: HorizontalRangeWithStyle | null = null;
		let previousFrameBottom: HorizontalRangeWithStyle | null = null;

		if (previousFrame && previousFrame.length > 0 && linesVisibleRanges.length > 0) {

			const topLineNumber = linesVisibleRanges[0].lineNumber;
			if (topLineNumber === viewport.startLineNumber) {
				for (let i = 0; !previousFrameTop && i < previousFrame.length; i++) {
					if (previousFrame[i].lineNumber === topLineNumber) {
						previousFrameTop = previousFrame[i].ranges[0];
					}
				}
			}

			const bottomLineNumber = linesVisibleRanges[linesVisibleRanges.length - 1].lineNumber;
			if (bottomLineNumber === viewport.endLineNumber) {
				for (let i = previousFrame.length - 1; !previousFrameBottom && i >= 0; i--) {
					if (previousFrame[i].lineNumber === bottomLineNumber) {
						previousFrameBottom = previousFrame[i].ranges[0];
					}
				}
			}

			if (previousFrameTop && !previousFrameTop.startStyle) {
				previousFrameTop = null;
			}
			if (previousFrameBottom && !previousFrameBottom.startStyle) {
				previousFrameBottom = null;
			}
		}

		for (let i = 0, len = linesVisibleRanges.length; i < len; i++) {
			// We know for a fact that there is precisely one range on each line
			const curLineRange = linesVisibleRanges[i].ranges[0];
			const curLeft = curLineRange.left;
			const curRight = curLineRange.left + curLineRange.width;

			const startStyle = {
				top: CornerStyle.EXTERN,
				bottom: CornerStyle.EXTERN
			};

			const endStyle = {
				top: CornerStyle.EXTERN,
				bottom: CornerStyle.EXTERN
			};

			if (i > 0) {
				// Look above
				const prevLeft = linesVisibleRanges[i - 1].ranges[0].left;
				const prevRight = linesVisibleRanges[i - 1].ranges[0].left + linesVisibleRanges[i - 1].ranges[0].width;

				if (abs(curLeft - prevLeft) < epsilon) {
					startStyle.top = CornerStyle.FLAT;
				} else if (curLeft > prevLeft) {
					startStyle.top = CornerStyle.INTERN;
				}

				if (abs(curRight - prevRight) < epsilon) {
					endStyle.top = CornerStyle.FLAT;
				} else if (prevLeft < curRight && curRight < prevRight) {
					endStyle.top = CornerStyle.INTERN;
				}
			} else if (previousFrameTop) {
				// Accept some hiccups near the viewport edges to save on repaints
				startStyle.top = previousFrameTop.startStyle!.top;
				endStyle.top = previousFrameTop.endStyle!.top;
			}

			if (i + 1 < len) {
				// Look below
				const nextLeft = linesVisibleRanges[i + 1].ranges[0].left;
				const nextRight = linesVisibleRanges[i + 1].ranges[0].left + linesVisibleRanges[i + 1].ranges[0].width;

				if (abs(curLeft - nextLeft) < epsilon) {
					startStyle.bottom = CornerStyle.FLAT;
				} else if (nextLeft < curLeft && curLeft < nextRight) {
					startStyle.bottom = CornerStyle.INTERN;
				}

				if (abs(curRight - nextRight) < epsilon) {
					endStyle.bottom = CornerStyle.FLAT;
				} else if (curRight < nextRight) {
					endStyle.bottom = CornerStyle.INTERN;
				}
			} else if (previousFrameBottom) {
				// Accept some hiccups near the viewport edges to save on repaints
				startStyle.bottom = previousFrameBottom.startStyle!.bottom;
				endStyle.bottom = previousFrameBottom.endStyle!.bottom;
			}

			curLineRange.startStyle = startStyle;
			curLineRange.endStyle = endStyle;
		}
	}

	private _getVisibleRangesWithStyle(selection: Range, ctx: RenderingContext, previousFrame: LineVisibleRangesWithStyle[] | null): LineVisibleRangesWithStyle[] {
		const _linesVisibleRanges = ctx.linesVisibleRangesForRange(selection, true) || [];
		const linesVisibleRanges = _linesVisibleRanges.map(toStyled);
		const visibleRangesHaveGaps = this._visibleRangesHaveGaps(linesVisibleRanges);

		if (!visibleRangesHaveGaps && this._roundedSelection) {
			this._enrichVisibleRangesWithStyle(ctx.visibleRange, linesVisibleRanges, previousFrame);
		}

		// The visible ranges are sorted TOP-BOTTOM and LEFT-RIGHT
		return linesVisibleRanges;
	}

	private _createSelectionPiece(top: number, bottom: number, className: string, left: number, width: number): string {
		return (
			'<div class="cslr '
			+ className
			+ '" style="'
			+ 'top:' + top.toString() + 'px;'
			+ 'bottom:' + bottom.toString() + 'px;'
			+ 'left:' + left.toString() + 'px;'
			+ 'width:' + width.toString() + 'px;'
			+ '"></div>'
		);
	}

	private _actualRenderOneSelection(output2: [string, string][], visibleStartLineNumber: number, hasMultipleSelections: boolean, visibleRanges: LineVisibleRangesWithStyle[]): void {
		if (visibleRanges.length === 0) {
			return;
		}

		const visibleRangesHaveStyle = !!visibleRanges[0].ranges[0].startStyle;

		const firstLineNumber = visibleRanges[0].lineNumber;
		const lastLineNumber = visibleRanges[visibleRanges.length - 1].lineNumber;

		for (let i = 0, len = visibleRanges.length; i < len; i++) {
			const lineVisibleRanges = visibleRanges[i];
			const lineNumber = lineVisibleRanges.lineNumber;
			const lineIndex = lineNumber - visibleStartLineNumber;

			const top = hasMultipleSelections ? (lineNumber === firstLineNumber ? 1 : 0) : 0;
			const bottom = hasMultipleSelections ? (lineNumber !== firstLineNumber && lineNumber === lastLineNumber ? 1 : 0) : 0;

			let innerCornerOutput = '';
			let restOfSelectionOutput = '';

			for (let j = 0, lenJ = lineVisibleRanges.ranges.length; j < lenJ; j++) {
				const visibleRange = lineVisibleRanges.ranges[j];

				if (visibleRangesHaveStyle) {
					const startStyle = visibleRange.startStyle!;
					const endStyle = visibleRange.endStyle!;
					if (startStyle.top === CornerStyle.INTERN || startStyle.bottom === CornerStyle.INTERN) {
						// Reverse rounded corner to the left

						// First comes the selection (blue layer)
						innerCornerOutput += this._createSelectionPiece(top, bottom, SelectionsOverlay.SELECTION_CLASS_NAME, visibleRange.left - SelectionsOverlay.ROUNDED_PIECE_WIDTH, SelectionsOverlay.ROUNDED_PIECE_WIDTH);

						// Second comes the background (white layer) with inverse border radius
						let className = SelectionsOverlay.EDITOR_BACKGROUND_CLASS_NAME;
						if (startStyle.top === CornerStyle.INTERN) {
							className += ' ' + SelectionsOverlay.SELECTION_TOP_RIGHT;
						}
						if (startStyle.bottom === CornerStyle.INTERN) {
							className += ' ' + SelectionsOverlay.SELECTION_BOTTOM_RIGHT;
						}
						innerCornerOutput += this._createSelectionPiece(top, bottom, className, visibleRange.left - SelectionsOverlay.ROUNDED_PIECE_WIDTH, SelectionsOverlay.ROUNDED_PIECE_WIDTH);
					}
					if (endStyle.top === CornerStyle.INTERN || endStyle.bottom === CornerStyle.INTERN) {
						// Reverse rounded corner to the right

						// First comes the selection (blue layer)
						innerCornerOutput += this._createSelectionPiece(top, bottom, SelectionsOverlay.SELECTION_CLASS_NAME, visibleRange.left + visibleRange.width, SelectionsOverlay.ROUNDED_PIECE_WIDTH);

						// Second comes the background (white layer) with inverse border radius
						let className = SelectionsOverlay.EDITOR_BACKGROUND_CLASS_NAME;
						if (endStyle.top === CornerStyle.INTERN) {
							className += ' ' + SelectionsOverlay.SELECTION_TOP_LEFT;
						}
						if (endStyle.bottom === CornerStyle.INTERN) {
							className += ' ' + SelectionsOverlay.SELECTION_BOTTOM_LEFT;
						}
						innerCornerOutput += this._createSelectionPiece(top, bottom, className, visibleRange.left + visibleRange.width, SelectionsOverlay.ROUNDED_PIECE_WIDTH);
					}
				}

				let className = SelectionsOverlay.SELECTION_CLASS_NAME;
				if (visibleRangesHaveStyle) {
					const startStyle = visibleRange.startStyle!;
					const endStyle = visibleRange.endStyle!;
					if (startStyle.top === CornerStyle.EXTERN) {
						className += ' ' + SelectionsOverlay.SELECTION_TOP_LEFT;
					}
					if (startStyle.bottom === CornerStyle.EXTERN) {
						className += ' ' + SelectionsOverlay.SELECTION_BOTTOM_LEFT;
					}
					if (endStyle.top === CornerStyle.EXTERN) {
						className += ' ' + SelectionsOverlay.SELECTION_TOP_RIGHT;
					}
					if (endStyle.bottom === CornerStyle.EXTERN) {
						className += ' ' + SelectionsOverlay.SELECTION_BOTTOM_RIGHT;
					}
				}
				restOfSelectionOutput += this._createSelectionPiece(top, bottom, className, visibleRange.left, visibleRange.width);
			}

			output2[lineIndex][0] += innerCornerOutput;
			output2[lineIndex][1] += restOfSelectionOutput;
		}
	}

	private _previousFrameVisibleRangesWithStyle: (LineVisibleRangesWithStyle[] | null)[] = [];
	public prepareRender(ctx: RenderingContext): void {

		// Build HTML for inner corners separate from HTML for the rest of selections,
		// as the inner corner HTML can interfere with that of other selections.
		// In final render, make sure to place the inner corner HTML before the rest of selection HTML. See issue #77777.
		const output: [string, string][] = [];
		const visibleStartLineNumber = ctx.visibleRange.startLineNumber;
		const visibleEndLineNumber = ctx.visibleRange.endLineNumber;
		for (let lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
			const lineIndex = lineNumber - visibleStartLineNumber;
			output[lineIndex] = ['', ''];
		}

		const thisFrameVisibleRangesWithStyle: (LineVisibleRangesWithStyle[] | null)[] = [];
		for (let i = 0, len = this._selections.length; i < len; i++) {
			const selection = this._selections[i];
			if (selection.isEmpty()) {
				thisFrameVisibleRangesWithStyle[i] = null;
				continue;
			}

			const visibleRangesWithStyle = this._getVisibleRangesWithStyle(selection, ctx, this._previousFrameVisibleRangesWithStyle[i]);
			thisFrameVisibleRangesWithStyle[i] = visibleRangesWithStyle;
			this._actualRenderOneSelection(output, visibleStartLineNumber, this._selections.length > 1, visibleRangesWithStyle);
		}

		this._previousFrameVisibleRangesWithStyle = thisFrameVisibleRangesWithStyle;
		this._renderResult = output.map(([internalCorners, restOfSelection]) => internalCorners + restOfSelection);
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
	const editorSelectionForegroundColor = theme.getColor(editorSelectionForeground);
	if (editorSelectionForegroundColor && !editorSelectionForegroundColor.isTransparent()) {
		collector.addRule(`.monaco-editor .view-line span.inline-selected-text { color: ${editorSelectionForegroundColor}; }`);
	}
});

function abs(n: number): number {
	return n < 0 ? -n : n;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/viewCursors/viewCursor.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/viewCursors/viewCursor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import * as strings from '../../../../base/common/strings.js';
import { applyFontInfo } from '../../config/domFontInfo.js';
import { TextEditorCursorStyle, EditorOption } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { RenderingContext, RestrictedRenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { MOUSE_CURSOR_TEXT_CSS_CLASS_NAME } from '../../../../base/browser/ui/mouseCursor/mouseCursor.js';

export interface IViewCursorRenderData {
	domNode: HTMLElement;
	position: Position;
	contentLeft: number;
	width: number;
	height: number;
}

class ViewCursorRenderData {
	constructor(
		public readonly top: number,
		public readonly left: number,
		public readonly paddingLeft: number,
		public readonly width: number,
		public readonly height: number,
		public readonly textContent: string,
		public readonly textContentClassName: string
	) { }
}

export enum CursorPlurality {
	Single,
	MultiPrimary,
	MultiSecondary,
}

export class ViewCursor {
	private readonly _context: ViewContext;
	private readonly _domNode: FastDomNode<HTMLElement>;

	private _cursorStyle: TextEditorCursorStyle;
	private _lineCursorWidth: number;
	private _lineCursorHeight: number;
	private _typicalHalfwidthCharacterWidth: number;

	private _isVisible: boolean;

	private _position: Position;
	private _pluralityClass: string;

	private _lastRenderedContent: string;
	private _renderData: ViewCursorRenderData | null;

	constructor(context: ViewContext, plurality: CursorPlurality) {
		this._context = context;
		const options = this._context.configuration.options;
		const fontInfo = options.get(EditorOption.fontInfo);

		this._cursorStyle = options.get(EditorOption.effectiveCursorStyle);
		this._typicalHalfwidthCharacterWidth = fontInfo.typicalHalfwidthCharacterWidth;
		this._lineCursorWidth = Math.min(options.get(EditorOption.cursorWidth), this._typicalHalfwidthCharacterWidth);
		this._lineCursorHeight = options.get(EditorOption.cursorHeight);

		this._isVisible = true;

		// Create the dom node
		this._domNode = createFastDomNode(document.createElement('div'));
		this._domNode.setClassName(`cursor ${MOUSE_CURSOR_TEXT_CSS_CLASS_NAME}`);
		this._domNode.setHeight(this._context.viewLayout.getLineHeightForLineNumber(1));
		this._domNode.setTop(0);
		this._domNode.setLeft(0);
		applyFontInfo(this._domNode, fontInfo);
		this._domNode.setDisplay('none');

		this._position = new Position(1, 1);
		this._pluralityClass = '';
		this.setPlurality(plurality);

		this._lastRenderedContent = '';
		this._renderData = null;
	}

	public getDomNode(): FastDomNode<HTMLElement> {
		return this._domNode;
	}

	public getPosition(): Position {
		return this._position;
	}

	public setPlurality(plurality: CursorPlurality) {
		switch (plurality) {
			default:
			case CursorPlurality.Single:
				this._pluralityClass = '';
				break;

			case CursorPlurality.MultiPrimary:
				this._pluralityClass = 'cursor-primary';
				break;

			case CursorPlurality.MultiSecondary:
				this._pluralityClass = 'cursor-secondary';
				break;
		}
	}

	public show(): void {
		if (!this._isVisible) {
			this._domNode.setVisibility('inherit');
			this._isVisible = true;
		}
	}

	public hide(): void {
		if (this._isVisible) {
			this._domNode.setVisibility('hidden');
			this._isVisible = false;
		}
	}

	public onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const options = this._context.configuration.options;
		const fontInfo = options.get(EditorOption.fontInfo);

		this._cursorStyle = options.get(EditorOption.effectiveCursorStyle);
		this._typicalHalfwidthCharacterWidth = fontInfo.typicalHalfwidthCharacterWidth;
		this._lineCursorWidth = Math.min(options.get(EditorOption.cursorWidth), this._typicalHalfwidthCharacterWidth);
		this._lineCursorHeight = options.get(EditorOption.cursorHeight);
		applyFontInfo(this._domNode, fontInfo);

		return true;
	}

	public onCursorPositionChanged(position: Position, pauseAnimation: boolean): boolean {
		if (pauseAnimation) {
			this._domNode.domNode.style.transitionProperty = 'none';
		} else {
			this._domNode.domNode.style.transitionProperty = '';
		}
		this._position = position;
		return true;
	}

	/**
	 * If `this._position` is inside a grapheme, returns the position where the grapheme starts.
	 * Also returns the next grapheme.
	 */
	private _getGraphemeAwarePosition(): [Position, string] {
		const { lineNumber, column } = this._position;
		const lineContent = this._context.viewModel.getLineContent(lineNumber);
		const [startOffset, endOffset] = strings.getCharContainingOffset(lineContent, column - 1);
		return [new Position(lineNumber, startOffset + 1), lineContent.substring(startOffset, endOffset)];
	}

	private _prepareRender(ctx: RenderingContext): ViewCursorRenderData | null {
		let textContent = '';
		let textContentClassName = '';
		const [position, nextGrapheme] = this._getGraphemeAwarePosition();
		const lineHeight = this._context.viewLayout.getLineHeightForLineNumber(position.lineNumber);
		const lineCursorHeight = (
			this._lineCursorHeight === 0
				? lineHeight // 0 indicates that the cursor should take the full line height
				: Math.min(lineHeight, this._lineCursorHeight)
		);
		const lineHeightAdjustment = (lineHeight - lineCursorHeight) / 2;

		if (this._cursorStyle === TextEditorCursorStyle.Line || this._cursorStyle === TextEditorCursorStyle.LineThin) {
			const visibleRange = ctx.visibleRangeForPosition(position);
			if (!visibleRange || visibleRange.outsideRenderedLine) {
				// Outside viewport
				return null;
			}

			const window = dom.getWindow(this._domNode.domNode);
			let width: number;
			if (this._cursorStyle === TextEditorCursorStyle.Line) {
				width = dom.computeScreenAwareSize(window, this._lineCursorWidth > 0 ? this._lineCursorWidth : 2);
				if (width > 2) {
					textContent = nextGrapheme;
					textContentClassName = this._getTokenClassName(position);
				}
			} else {
				width = dom.computeScreenAwareSize(window, 1);
			}

			let left = visibleRange.left;
			let paddingLeft = 0;
			if (width >= 2 && left >= 1) {
				// shift the cursor a bit between the characters
				paddingLeft = 1;
				left -= paddingLeft;
			}

			const top = ctx.getVerticalOffsetForLineNumber(position.lineNumber) - ctx.bigNumbersDelta + lineHeightAdjustment;
			return new ViewCursorRenderData(top, left, paddingLeft, width, lineCursorHeight, textContent, textContentClassName);
		}

		const visibleRangeForCharacter = ctx.linesVisibleRangesForRange(new Range(position.lineNumber, position.column, position.lineNumber, position.column + nextGrapheme.length), false);
		if (!visibleRangeForCharacter || visibleRangeForCharacter.length === 0) {
			// Outside viewport
			return null;
		}

		const firstVisibleRangeForCharacter = visibleRangeForCharacter[0];
		if (firstVisibleRangeForCharacter.outsideRenderedLine || firstVisibleRangeForCharacter.ranges.length === 0) {
			// Outside viewport
			return null;
		}

		const range = firstVisibleRangeForCharacter.ranges[0];
		const width = (
			nextGrapheme === '\t'
				? this._typicalHalfwidthCharacterWidth
				: (range.width < 1
					? this._typicalHalfwidthCharacterWidth
					: range.width)
		);

		if (this._cursorStyle === TextEditorCursorStyle.Block) {
			textContent = nextGrapheme;
			textContentClassName = this._getTokenClassName(position);
		}

		let top = ctx.getVerticalOffsetForLineNumber(position.lineNumber) - ctx.bigNumbersDelta;
		let height = lineHeight;

		// Underline might interfere with clicking
		if (this._cursorStyle === TextEditorCursorStyle.Underline || this._cursorStyle === TextEditorCursorStyle.UnderlineThin) {
			top += lineHeight - 2;
			height = 2;
		}

		return new ViewCursorRenderData(top, range.left, 0, width, height, textContent, textContentClassName);
	}

	private _getTokenClassName(position: Position): string {
		const lineData = this._context.viewModel.getViewLineData(position.lineNumber);
		const tokenIndex = lineData.tokens.findTokenIndexAtOffset(position.column - 1);
		return lineData.tokens.getClassName(tokenIndex);
	}

	public prepareRender(ctx: RenderingContext): void {
		this._renderData = this._prepareRender(ctx);
	}

	public render(ctx: RestrictedRenderingContext): IViewCursorRenderData | null {
		if (!this._renderData) {
			this._domNode.setDisplay('none');
			return null;
		}

		if (this._lastRenderedContent !== this._renderData.textContent) {
			this._lastRenderedContent = this._renderData.textContent;
			this._domNode.domNode.textContent = this._lastRenderedContent;
		}

		this._domNode.setClassName(`cursor ${this._pluralityClass} ${MOUSE_CURSOR_TEXT_CSS_CLASS_NAME} ${this._renderData.textContentClassName}`);

		this._domNode.setDisplay('block');
		this._domNode.setTop(this._renderData.top);
		this._domNode.setLeft(this._renderData.left);
		this._domNode.setPaddingLeft(this._renderData.paddingLeft);
		this._domNode.setWidth(this._renderData.width);
		this._domNode.setLineHeight(this._renderData.height);
		this._domNode.setHeight(this._renderData.height);

		return {
			domNode: this._domNode.domNode,
			position: this._position,
			contentLeft: this._renderData.left,
			height: this._renderData.height,
			width: 2
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/viewCursors/viewCursors.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/viewCursors/viewCursors.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
.monaco-editor .cursors-layer {
	position: absolute;
	top: 0;
}

.monaco-editor .cursors-layer > .cursor {
	position: absolute;
	overflow: hidden;
	box-sizing: border-box;
}

/* -- smooth-caret-animation -- */
.monaco-editor .cursors-layer.cursor-smooth-caret-animation > .cursor {
	transition: all 80ms;
}

/* -- block-outline-style -- */
.monaco-editor .cursors-layer.cursor-block-outline-style > .cursor {
	background: transparent !important;
	border-style: solid;
	border-width: 1px;
}

/* -- underline-style -- */
.monaco-editor .cursors-layer.cursor-underline-style > .cursor {
	border-bottom-width: 2px;
	border-bottom-style: solid;
	background: transparent !important;
}

/* -- underline-thin-style -- */
.monaco-editor .cursors-layer.cursor-underline-thin-style > .cursor {
	border-bottom-width: 1px;
	border-bottom-style: solid;
	background: transparent !important;
}

@keyframes monaco-cursor-smooth {
	0%,
	20% {
		opacity: 1;
	}
	60%,
	100% {
		opacity: 0;
	}
}

@keyframes monaco-cursor-phase {
	0%,
	20% {
		opacity: 1;
	}
	90%,
	100% {
		opacity: 0;
	}
}

@keyframes monaco-cursor-expand {
	0%,
	20% {
		transform: scaleY(1);
	}
	80%,
	100% {
		transform: scaleY(0);
	}
}

.cursor-smooth {
	animation: monaco-cursor-smooth 0.5s ease-in-out 0s 20 alternate;
}

.cursor-phase {
	animation: monaco-cursor-phase 0.5s ease-in-out 0s 20 alternate;
}

.cursor-expand > .cursor {
	animation: monaco-cursor-expand 0.5s ease-in-out 0s 20 alternate;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/viewCursors/viewCursors.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/viewCursors/viewCursors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './viewCursors.css';
import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { IntervalTimer, TimeoutTimer } from '../../../../base/common/async.js';
import { ViewPart } from '../../view/viewPart.js';
import { IViewCursorRenderData, ViewCursor, CursorPlurality } from './viewCursor.js';
import { TextEditorCursorBlinkingStyle, TextEditorCursorStyle, EditorOption } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import {
	editorCursorBackground, editorCursorForeground,
	editorMultiCursorPrimaryForeground, editorMultiCursorPrimaryBackground,
	editorMultiCursorSecondaryForeground, editorMultiCursorSecondaryBackground
} from '../../../common/core/editorColorRegistry.js';
import { RenderingContext, RestrictedRenderingContext } from '../../view/renderingContext.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { isHighContrast } from '../../../../platform/theme/common/theme.js';
import { CursorChangeReason } from '../../../common/cursorEvents.js';
import { WindowIntervalTimer, getWindow } from '../../../../base/browser/dom.js';

/**
 * View cursors is a view part responsible for rendering the primary cursor and
 * any secondary cursors that are currently active.
 */
export class ViewCursors extends ViewPart {

	static readonly BLINK_INTERVAL = 500;

	private _readOnly: boolean;
	private _cursorBlinking: TextEditorCursorBlinkingStyle;
	private _cursorStyle: TextEditorCursorStyle;
	private _cursorSmoothCaretAnimation: 'off' | 'explicit' | 'on';
	private _editContextEnabled: boolean;
	private _selectionIsEmpty: boolean;
	private _isComposingInput: boolean;

	private _isVisible: boolean;

	private readonly _domNode: FastDomNode<HTMLElement>;

	private readonly _startCursorBlinkAnimation: TimeoutTimer;
	private readonly _cursorFlatBlinkInterval: IntervalTimer;
	private _blinkingEnabled: boolean;

	private _editorHasFocus: boolean;

	private readonly _primaryCursor: ViewCursor;
	private readonly _secondaryCursors: ViewCursor[];
	private _renderData: IViewCursorRenderData[];

	constructor(context: ViewContext) {
		super(context);

		const options = this._context.configuration.options;
		this._readOnly = options.get(EditorOption.readOnly);
		this._cursorBlinking = options.get(EditorOption.cursorBlinking);
		this._cursorStyle = options.get(EditorOption.effectiveCursorStyle);
		this._cursorSmoothCaretAnimation = options.get(EditorOption.cursorSmoothCaretAnimation);
		this._editContextEnabled = options.get(EditorOption.effectiveEditContext);
		this._selectionIsEmpty = true;
		this._isComposingInput = false;

		this._isVisible = false;

		this._primaryCursor = new ViewCursor(this._context, CursorPlurality.Single);
		this._secondaryCursors = [];
		this._renderData = [];

		this._domNode = createFastDomNode(document.createElement('div'));
		this._domNode.setAttribute('role', 'presentation');
		this._domNode.setAttribute('aria-hidden', 'true');
		this._updateDomClassName();

		this._domNode.appendChild(this._primaryCursor.getDomNode());

		this._startCursorBlinkAnimation = new TimeoutTimer();
		this._cursorFlatBlinkInterval = new WindowIntervalTimer();

		this._blinkingEnabled = false;

		this._editorHasFocus = false;
		this._updateBlinking();
	}

	public override dispose(): void {
		super.dispose();
		this._startCursorBlinkAnimation.dispose();
		this._cursorFlatBlinkInterval.dispose();
	}

	public getDomNode(): FastDomNode<HTMLElement> {
		return this._domNode;
	}

	// --- begin event handlers

	public override onCompositionStart(e: viewEvents.ViewCompositionStartEvent): boolean {
		this._isComposingInput = true;
		this._updateBlinking();
		return true;
	}
	public override onCompositionEnd(e: viewEvents.ViewCompositionEndEvent): boolean {
		this._isComposingInput = false;
		this._updateBlinking();
		return true;
	}
	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		const options = this._context.configuration.options;

		this._readOnly = options.get(EditorOption.readOnly);
		this._cursorBlinking = options.get(EditorOption.cursorBlinking);
		this._cursorStyle = options.get(EditorOption.effectiveCursorStyle);
		this._cursorSmoothCaretAnimation = options.get(EditorOption.cursorSmoothCaretAnimation);
		this._editContextEnabled = options.get(EditorOption.effectiveEditContext);

		this._updateBlinking();
		this._updateDomClassName();

		this._primaryCursor.onConfigurationChanged(e);
		for (let i = 0, len = this._secondaryCursors.length; i < len; i++) {
			this._secondaryCursors[i].onConfigurationChanged(e);
		}
		return true;
	}
	private _onCursorPositionChanged(position: Position, secondaryPositions: Position[], reason: CursorChangeReason): void {
		const pauseAnimation = (
			this._secondaryCursors.length !== secondaryPositions.length
			|| (this._cursorSmoothCaretAnimation === 'explicit' && reason !== CursorChangeReason.Explicit)
		);
		this._primaryCursor.setPlurality(secondaryPositions.length ? CursorPlurality.MultiPrimary : CursorPlurality.Single);
		this._primaryCursor.onCursorPositionChanged(position, pauseAnimation);
		this._updateBlinking();

		if (this._secondaryCursors.length < secondaryPositions.length) {
			// Create new cursors
			const addCnt = secondaryPositions.length - this._secondaryCursors.length;
			for (let i = 0; i < addCnt; i++) {
				const newCursor = new ViewCursor(this._context, CursorPlurality.MultiSecondary);
				this._domNode.domNode.insertBefore(newCursor.getDomNode().domNode, this._primaryCursor.getDomNode().domNode.nextSibling);
				this._secondaryCursors.push(newCursor);
			}
		} else if (this._secondaryCursors.length > secondaryPositions.length) {
			// Remove some cursors
			const removeCnt = this._secondaryCursors.length - secondaryPositions.length;
			for (let i = 0; i < removeCnt; i++) {
				this._domNode.removeChild(this._secondaryCursors[0].getDomNode());
				this._secondaryCursors.splice(0, 1);
			}
		}

		for (let i = 0; i < secondaryPositions.length; i++) {
			this._secondaryCursors[i].onCursorPositionChanged(secondaryPositions[i], pauseAnimation);
		}

	}
	public override onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean {
		const positions: Position[] = [];
		for (let i = 0, len = e.selections.length; i < len; i++) {
			positions[i] = e.selections[i].getPosition();
		}
		this._onCursorPositionChanged(positions[0], positions.slice(1), e.reason);

		const selectionIsEmpty = e.selections[0].isEmpty();
		if (this._selectionIsEmpty !== selectionIsEmpty) {
			this._selectionIsEmpty = selectionIsEmpty;
			this._updateDomClassName();
		}

		return true;
	}
	public override onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean {
		// true for inline decorations that can end up relayouting text
		return true;
	}
	public override onFlushed(e: viewEvents.ViewFlushedEvent): boolean {
		return true;
	}
	public override onFocusChanged(e: viewEvents.ViewFocusChangedEvent): boolean {
		this._editorHasFocus = e.isFocused;
		this._updateBlinking();
		return false;
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
		return true;
	}
	public override onTokensChanged(e: viewEvents.ViewTokensChangedEvent): boolean {
		const shouldRender = (position: Position) => {
			for (let i = 0, len = e.ranges.length; i < len; i++) {
				if (e.ranges[i].fromLineNumber <= position.lineNumber && position.lineNumber <= e.ranges[i].toLineNumber) {
					return true;
				}
			}
			return false;
		};
		if (shouldRender(this._primaryCursor.getPosition())) {
			return true;
		}
		for (const secondaryCursor of this._secondaryCursors) {
			if (shouldRender(secondaryCursor.getPosition())) {
				return true;
			}
		}
		return false;
	}
	public override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		return true;
	}

	// --- end event handlers

	// ---- blinking logic

	private _getCursorBlinking(): TextEditorCursorBlinkingStyle {
		// TODO: Remove the following if statement when experimental edit context is made default sole implementation
		if (this._isComposingInput && !this._editContextEnabled) {
			// avoid double cursors
			return TextEditorCursorBlinkingStyle.Hidden;
		}
		if (!this._editorHasFocus) {
			return TextEditorCursorBlinkingStyle.Hidden;
		}
		if (this._readOnly) {
			return TextEditorCursorBlinkingStyle.Solid;
		}
		return this._cursorBlinking;
	}

	private _updateBlinking(): void {
		this._startCursorBlinkAnimation.cancel();
		this._cursorFlatBlinkInterval.cancel();

		const blinkingStyle = this._getCursorBlinking();

		// hidden and solid are special as they involve no animations
		const isHidden = (blinkingStyle === TextEditorCursorBlinkingStyle.Hidden);
		const isSolid = (blinkingStyle === TextEditorCursorBlinkingStyle.Solid);

		if (isHidden) {
			this._hide();
		} else {
			this._show();
		}

		this._blinkingEnabled = false;
		this._updateDomClassName();

		if (!isHidden && !isSolid) {
			if (blinkingStyle === TextEditorCursorBlinkingStyle.Blink) {
				// flat blinking is handled by JavaScript to save battery life due to Chromium step timing issue https://bugs.chromium.org/p/chromium/issues/detail?id=361587
				this._cursorFlatBlinkInterval.cancelAndSet(() => {
					if (this._isVisible) {
						this._hide();
					} else {
						this._show();
					}
				}, ViewCursors.BLINK_INTERVAL, getWindow(this._domNode.domNode));
			} else {
				this._startCursorBlinkAnimation.setIfNotSet(() => {
					this._blinkingEnabled = true;
					this._updateDomClassName();
				}, ViewCursors.BLINK_INTERVAL);
			}
		}
	}

	// --- end blinking logic

	private _updateDomClassName(): void {
		this._domNode.setClassName(this._getClassName());
	}

	private _getClassName(): string {
		let result = 'cursors-layer';
		if (!this._selectionIsEmpty) {
			result += ' has-selection';
		}
		switch (this._cursorStyle) {
			case TextEditorCursorStyle.Line:
				result += ' cursor-line-style';
				break;
			case TextEditorCursorStyle.Block:
				result += ' cursor-block-style';
				break;
			case TextEditorCursorStyle.Underline:
				result += ' cursor-underline-style';
				break;
			case TextEditorCursorStyle.LineThin:
				result += ' cursor-line-thin-style';
				break;
			case TextEditorCursorStyle.BlockOutline:
				result += ' cursor-block-outline-style';
				break;
			case TextEditorCursorStyle.UnderlineThin:
				result += ' cursor-underline-thin-style';
				break;
			default:
				result += ' cursor-line-style';
		}
		if (this._blinkingEnabled) {
			switch (this._getCursorBlinking()) {
				case TextEditorCursorBlinkingStyle.Blink:
					result += ' cursor-blink';
					break;
				case TextEditorCursorBlinkingStyle.Smooth:
					result += ' cursor-smooth';
					break;
				case TextEditorCursorBlinkingStyle.Phase:
					result += ' cursor-phase';
					break;
				case TextEditorCursorBlinkingStyle.Expand:
					result += ' cursor-expand';
					break;
				case TextEditorCursorBlinkingStyle.Solid:
					result += ' cursor-solid';
					break;
				default:
					result += ' cursor-solid';
			}
		} else {
			result += ' cursor-solid';
		}
		if (this._cursorSmoothCaretAnimation === 'on' || this._cursorSmoothCaretAnimation === 'explicit') {
			result += ' cursor-smooth-caret-animation';
		}
		return result;
	}

	private _show(): void {
		this._primaryCursor.show();
		for (let i = 0, len = this._secondaryCursors.length; i < len; i++) {
			this._secondaryCursors[i].show();
		}
		this._isVisible = true;
	}

	private _hide(): void {
		this._primaryCursor.hide();
		for (let i = 0, len = this._secondaryCursors.length; i < len; i++) {
			this._secondaryCursors[i].hide();
		}
		this._isVisible = false;
	}

	// ---- IViewPart implementation

	public prepareRender(ctx: RenderingContext): void {
		this._primaryCursor.prepareRender(ctx);
		for (let i = 0, len = this._secondaryCursors.length; i < len; i++) {
			this._secondaryCursors[i].prepareRender(ctx);
		}
	}

	public render(ctx: RestrictedRenderingContext): void {
		const renderData: IViewCursorRenderData[] = [];
		let renderDataLen = 0;

		const primaryRenderData = this._primaryCursor.render(ctx);
		if (primaryRenderData) {
			renderData[renderDataLen++] = primaryRenderData;
		}

		for (let i = 0, len = this._secondaryCursors.length; i < len; i++) {
			const secondaryRenderData = this._secondaryCursors[i].render(ctx);
			if (secondaryRenderData) {
				renderData[renderDataLen++] = secondaryRenderData;
			}
		}

		this._renderData = renderData;
	}

	public getLastRenderData(): IViewCursorRenderData[] {
		return this._renderData;
	}
}

registerThemingParticipant((theme, collector) => {
	type CursorTheme = {
		foreground: string;
		background: string;
		class: string;
	};

	const cursorThemes: CursorTheme[] = [
		{ class: '.cursor', foreground: editorCursorForeground, background: editorCursorBackground },
		{ class: '.cursor-primary', foreground: editorMultiCursorPrimaryForeground, background: editorMultiCursorPrimaryBackground },
		{ class: '.cursor-secondary', foreground: editorMultiCursorSecondaryForeground, background: editorMultiCursorSecondaryBackground },
	];

	for (const cursorTheme of cursorThemes) {
		const caret = theme.getColor(cursorTheme.foreground);
		if (caret) {
			let caretBackground = theme.getColor(cursorTheme.background);
			if (!caretBackground) {
				caretBackground = caret.opposite();
			}
			collector.addRule(`.monaco-editor .cursors-layer ${cursorTheme.class} { background-color: ${caret}; border-color: ${caret}; color: ${caretBackground}; }`);
			if (isHighContrast(theme.type)) {
				collector.addRule(`.monaco-editor .cursors-layer.has-selection ${cursorTheme.class} { border-left: 1px solid ${caretBackground}; border-right: 1px solid ${caretBackground}; }`);
			}
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/viewLines/domReadingContext.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/viewLines/domReadingContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class DomReadingContext {

	private _didDomLayout: boolean = false;
	private _clientRectDeltaLeft: number = 0;
	private _clientRectScale: number = 1;
	private _clientRectRead: boolean = false;

	public get didDomLayout(): boolean {
		return this._didDomLayout;
	}

	private readClientRect(): void {
		if (!this._clientRectRead) {
			this._clientRectRead = true;
			const rect = this._domNode.getBoundingClientRect();
			this.markDidDomLayout();
			this._clientRectDeltaLeft = rect.left;
			const offsetWidth = this._domNode.offsetWidth;
			this._clientRectScale = offsetWidth > 0 ? rect.width / offsetWidth : 1;
		}
	}

	public get clientRectDeltaLeft(): number {
		if (!this._clientRectRead) {
			this.readClientRect();
		}
		return this._clientRectDeltaLeft;
	}

	public get clientRectScale(): number {
		if (!this._clientRectRead) {
			this.readClientRect();
		}
		return this._clientRectScale;
	}

	constructor(
		private readonly _domNode: HTMLElement,
		public readonly endNode: HTMLElement
	) {
	}

	public markDidDomLayout(): void {
		this._didDomLayout = true;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/viewLines/rangeUtil.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/viewLines/rangeUtil.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Constants } from '../../../../base/common/uint.js';
import { FloatHorizontalRange } from '../../view/renderingContext.js';
import { DomReadingContext } from './domReadingContext.js';

export class RangeUtil {

	/**
	 * Reusing the same range here
	 * because IE is buggy and constantly freezes when using a large number
	 * of ranges and calling .detach on them
	 */
	private static _handyReadyRange: Range;

	private static _createRange(): Range {
		if (!this._handyReadyRange) {
			this._handyReadyRange = document.createRange();
		}
		return this._handyReadyRange;
	}

	private static _detachRange(range: Range, endNode: HTMLElement): void {
		// Move range out of the span node, IE doesn't like having many ranges in
		// the same spot and will act badly for lines containing dashes ('-')
		range.selectNodeContents(endNode);
	}

	private static _readClientRects(startElement: Node, startOffset: number, endElement: Node, endOffset: number, endNode: HTMLElement): DOMRectList | null {
		const range = this._createRange();
		try {
			range.setStart(startElement, startOffset);
			range.setEnd(endElement, endOffset);

			return range.getClientRects();
		} catch (e) {
			// This is life ...
			return null;
		} finally {
			this._detachRange(range, endNode);
		}
	}

	private static _mergeAdjacentRanges(ranges: FloatHorizontalRange[]): FloatHorizontalRange[] {
		if (ranges.length === 1) {
			// There is nothing to merge
			return ranges;
		}

		ranges.sort(FloatHorizontalRange.compare);

		const result: FloatHorizontalRange[] = [];
		let resultLen = 0;
		let prev = ranges[0];

		for (let i = 1, len = ranges.length; i < len; i++) {
			const range = ranges[i];
			if (prev.left + prev.width + 0.9 /* account for browser's rounding errors*/ >= range.left) {
				prev.width = Math.max(prev.width, range.left + range.width - prev.left);
			} else {
				result[resultLen++] = prev;
				prev = range;
			}
		}

		result[resultLen++] = prev;

		return result;
	}

	private static _createHorizontalRangesFromClientRects(clientRects: DOMRectList | null, clientRectDeltaLeft: number, clientRectScale: number): FloatHorizontalRange[] | null {
		if (!clientRects || clientRects.length === 0) {
			return null;
		}

		// We go through FloatHorizontalRange because it has been observed in bi-di text
		// that the clientRects are not coming in sorted from the browser

		const result: FloatHorizontalRange[] = [];
		for (let i = 0, len = clientRects.length; i < len; i++) {
			const clientRect = clientRects[i];
			result[i] = new FloatHorizontalRange(Math.max(0, (clientRect.left - clientRectDeltaLeft) / clientRectScale), clientRect.width / clientRectScale);
		}

		return this._mergeAdjacentRanges(result);
	}

	public static readHorizontalRanges(domNode: HTMLElement, startChildIndex: number, startOffset: number, endChildIndex: number, endOffset: number, context: DomReadingContext): FloatHorizontalRange[] | null {
		// Panic check
		const min = 0;
		const max = domNode.children.length - 1;
		if (min > max) {
			return null;
		}
		startChildIndex = Math.min(max, Math.max(min, startChildIndex));
		endChildIndex = Math.min(max, Math.max(min, endChildIndex));

		if (startChildIndex === endChildIndex && startOffset === endOffset && startOffset === 0 && !domNode.children[startChildIndex].firstChild) {
			// We must find the position at the beginning of a <span>
			// To cover cases of empty <span>s, avoid using a range and use the <span>'s bounding box
			const clientRects = domNode.children[startChildIndex].getClientRects();
			context.markDidDomLayout();
			return this._createHorizontalRangesFromClientRects(clientRects, context.clientRectDeltaLeft, context.clientRectScale);
		}

		// If crossing over to a span only to select offset 0, then use the previous span's maximum offset
		// Chrome is buggy and doesn't handle 0 offsets well sometimes.
		if (startChildIndex !== endChildIndex) {
			if (endChildIndex > 0 && endOffset === 0) {
				endChildIndex--;
				endOffset = Constants.MAX_SAFE_SMALL_INTEGER;
			}
		}

		let startElement = domNode.children[startChildIndex].firstChild;
		let endElement = domNode.children[endChildIndex].firstChild;

		if (!startElement || !endElement) {
			// When having an empty <span> (without any text content), try to move to the previous <span>
			if (!startElement && startOffset === 0 && startChildIndex > 0) {
				startElement = domNode.children[startChildIndex - 1].firstChild;
				startOffset = Constants.MAX_SAFE_SMALL_INTEGER;
			}
			if (!endElement && endOffset === 0 && endChildIndex > 0) {
				endElement = domNode.children[endChildIndex - 1].firstChild;
				endOffset = Constants.MAX_SAFE_SMALL_INTEGER;
			}
		}

		if (!startElement || !endElement) {
			return null;
		}

		startOffset = Math.min(startElement.textContent!.length, Math.max(0, startOffset));
		endOffset = Math.min(endElement.textContent!.length, Math.max(0, endOffset));

		const clientRects = this._readClientRects(startElement, startOffset, endElement, endOffset, context.endNode);
		context.markDidDomLayout();
		return this._createHorizontalRangesFromClientRects(clientRects, context.clientRectDeltaLeft, context.clientRectScale);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/viewLines/viewLine.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/viewLines/viewLine.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as browser from '../../../../base/browser/browser.js';
import { FastDomNode, createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import * as platform from '../../../../base/common/platform.js';
import { IVisibleLine } from '../../view/viewLayer.js';
import { RangeUtil } from './rangeUtil.js';
import { StringBuilder } from '../../../common/core/stringBuilder.js';
import { FloatHorizontalRange, VisibleRanges } from '../../view/renderingContext.js';
import { LineDecoration } from '../../../common/viewLayout/lineDecorations.js';
import { CharacterMapping, ForeignElementType, RenderLineInput, renderViewLine, DomPosition, RenderWhitespace } from '../../../common/viewLayout/viewLineRenderer.js';
import { ViewportData } from '../../../common/viewLayout/viewLinesViewportData.js';
import { isHighContrast } from '../../../../platform/theme/common/theme.js';
import { EditorFontLigatures } from '../../../common/config/editorOptions.js';
import { DomReadingContext } from './domReadingContext.js';
import type { ViewLineOptions } from './viewLineOptions.js';
import { ViewGpuContext } from '../../gpu/viewGpuContext.js';
import { OffsetRange } from '../../../common/core/ranges/offsetRange.js';
import { InlineDecorationType } from '../../../common/viewModel/inlineDecorations.js';
import { TextDirection } from '../../../common/model.js';

const canUseFastRenderedViewLine = (function () {
	if (platform.isNative) {
		// In VSCode we know very well when the zoom level changes
		return true;
	}

	if (platform.isLinux || browser.isFirefox || browser.isSafari) {
		// On Linux, it appears that zooming affects char widths (in pixels), which is unexpected.
		// --
		// Even though we read character widths correctly, having read them at a specific zoom level
		// does not mean they are the same at the current zoom level.
		// --
		// This could be improved if we ever figure out how to get an event when browsers zoom,
		// but until then we have to stick with reading client rects.
		// --
		// The same has been observed with Firefox on Windows7
		// --
		// The same has been oversved with Safari
		return false;
	}

	return true;
})();

let monospaceAssumptionsAreValid = true;

export class ViewLine implements IVisibleLine {

	public static readonly CLASS_NAME = 'view-line';

	private _options: ViewLineOptions;
	private _isMaybeInvalid: boolean;
	private _renderedViewLine: IRenderedViewLine | null;

	constructor(private readonly _viewGpuContext: ViewGpuContext | undefined, options: ViewLineOptions) {
		this._options = options;
		this._isMaybeInvalid = true;
		this._renderedViewLine = null;
	}

	// --- begin IVisibleLineData

	public getDomNode(): HTMLElement | null {
		if (this._renderedViewLine && this._renderedViewLine.domNode) {
			return this._renderedViewLine.domNode.domNode;
		}
		return null;
	}
	public setDomNode(domNode: HTMLElement): void {
		if (this._renderedViewLine) {
			this._renderedViewLine.domNode = createFastDomNode(domNode);
		} else {
			throw new Error('I have no rendered view line to set the dom node to...');
		}
	}

	public onContentChanged(): void {
		this._isMaybeInvalid = true;
	}
	public onTokensChanged(): void {
		this._isMaybeInvalid = true;
	}
	public onDecorationsChanged(): void {
		this._isMaybeInvalid = true;
	}
	public onOptionsChanged(newOptions: ViewLineOptions): void {
		this._isMaybeInvalid = true;
		this._options = newOptions;
	}
	public onSelectionChanged(): boolean {
		if (isHighContrast(this._options.themeType) || this._renderedViewLine?.input.renderWhitespace === RenderWhitespace.Selection) {
			this._isMaybeInvalid = true;
			return true;
		}
		return false;
	}

	public renderLine(lineNumber: number, deltaTop: number, lineHeight: number, viewportData: ViewportData, sb: StringBuilder): boolean {
		if (this._options.useGpu && this._viewGpuContext?.canRender(this._options, viewportData, lineNumber)) {
			this._renderedViewLine?.domNode?.domNode.remove();
			this._renderedViewLine = null;
			return false;
		}

		if (this._isMaybeInvalid === false) {
			// it appears that nothing relevant has changed
			return false;
		}

		this._isMaybeInvalid = false;

		const lineData = viewportData.getViewLineRenderingData(lineNumber);
		const options = this._options;
		const actualInlineDecorations = LineDecoration.filter(lineData.inlineDecorations, lineNumber, lineData.minColumn, lineData.maxColumn);
		const renderWhitespace = (lineData.hasVariableFonts || options.experimentalWhitespaceRendering === 'off') ? options.renderWhitespace : 'none';
		const allowFastRendering = !lineData.hasVariableFonts;

		// Only send selection information when needed for rendering whitespace
		let selectionsOnLine: OffsetRange[] | null = null;
		if (isHighContrast(options.themeType) || renderWhitespace === 'selection') {
			const selections = viewportData.selections;
			for (const selection of selections) {

				if (selection.endLineNumber < lineNumber || selection.startLineNumber > lineNumber) {
					// Selection does not intersect line
					continue;
				}

				const startColumn = (selection.startLineNumber === lineNumber ? selection.startColumn : lineData.minColumn);
				const endColumn = (selection.endLineNumber === lineNumber ? selection.endColumn : lineData.maxColumn);

				if (startColumn < endColumn) {
					if (isHighContrast(options.themeType)) {
						actualInlineDecorations.push(new LineDecoration(startColumn, endColumn, 'inline-selected-text', InlineDecorationType.Regular));
					}
					if (renderWhitespace === 'selection') {
						if (!selectionsOnLine) {
							selectionsOnLine = [];
						}

						selectionsOnLine.push(new OffsetRange(startColumn - 1, endColumn - 1));
					}
				}
			}
		}

		const renderLineInput = new RenderLineInput(
			options.useMonospaceOptimizations,
			options.canUseHalfwidthRightwardsArrow,
			lineData.content,
			lineData.continuesWithWrappedLine,
			lineData.isBasicASCII,
			lineData.containsRTL,
			lineData.minColumn - 1,
			lineData.tokens,
			actualInlineDecorations,
			lineData.tabSize,
			lineData.startVisibleColumn,
			options.spaceWidth,
			options.middotWidth,
			options.wsmiddotWidth,
			options.stopRenderingLineAfter,
			renderWhitespace,
			options.renderControlCharacters,
			options.fontLigatures !== EditorFontLigatures.OFF,
			selectionsOnLine,
			lineData.textDirection,
			options.verticalScrollbarSize
		);

		if (this._renderedViewLine && this._renderedViewLine.input.equals(renderLineInput)) {
			// no need to do anything, we have the same render input
			return false;
		}

		sb.appendString('<div ');
		if (lineData.textDirection === TextDirection.RTL) {
			sb.appendString('dir="rtl" ');
		} else if (lineData.containsRTL) {
			sb.appendString('dir="ltr" ');
		}
		sb.appendString('style="top:');
		sb.appendString(String(deltaTop));
		sb.appendString('px;height:');
		sb.appendString(String(lineHeight));
		sb.appendString('px;line-height:');
		sb.appendString(String(lineHeight));
		if (lineData.textDirection === TextDirection.RTL) {
			sb.appendString('px;padding-right:');
			sb.appendString(String(options.verticalScrollbarSize));
		}
		sb.appendString('px;" class="');
		sb.appendString(ViewLine.CLASS_NAME);
		sb.appendString('">');

		const output = renderViewLine(renderLineInput, sb);

		sb.appendString('</div>');

		let renderedViewLine: IRenderedViewLine | null = null;
		if (
			allowFastRendering
			&& monospaceAssumptionsAreValid
			&& canUseFastRenderedViewLine
			&& lineData.isBasicASCII
			&& renderLineInput.isLTR
			&& options.useMonospaceOptimizations
			&& output.containsForeignElements === ForeignElementType.None
		) {
			renderedViewLine = new FastRenderedViewLine(
				this._renderedViewLine ? this._renderedViewLine.domNode : null,
				renderLineInput,
				output.characterMapping
			);
		}

		if (!renderedViewLine) {
			renderedViewLine = createRenderedLine(
				this._renderedViewLine ? this._renderedViewLine.domNode : null,
				renderLineInput,
				output.characterMapping,
				output.containsForeignElements
			);
		}

		this._renderedViewLine = renderedViewLine;

		return true;
	}

	public layoutLine(lineNumber: number, deltaTop: number, lineHeight: number): void {
		if (this._renderedViewLine && this._renderedViewLine.domNode) {
			this._renderedViewLine.domNode.setTop(deltaTop);
			this._renderedViewLine.domNode.setHeight(lineHeight);
			this._renderedViewLine.domNode.setLineHeight(lineHeight);
		}
	}

	// --- end IVisibleLineData

	public isRenderedRTL(): boolean {
		if (!this._renderedViewLine) {
			return false;
		}
		return this._renderedViewLine.input.textDirection === TextDirection.RTL;
	}

	public getWidth(context: DomReadingContext | null): number {
		if (!this._renderedViewLine) {
			return 0;
		}
		return this._renderedViewLine.getWidth(context);
	}

	public getWidthIsFast(): boolean {
		if (!this._renderedViewLine) {
			return true;
		}
		return this._renderedViewLine.getWidthIsFast();
	}

	public needsMonospaceFontCheck(): boolean {
		if (!this._renderedViewLine) {
			return false;
		}
		return (this._renderedViewLine instanceof FastRenderedViewLine);
	}

	public monospaceAssumptionsAreValid(): boolean {
		if (!this._renderedViewLine) {
			return monospaceAssumptionsAreValid;
		}
		if (this._renderedViewLine instanceof FastRenderedViewLine) {
			return this._renderedViewLine.monospaceAssumptionsAreValid();
		}
		return monospaceAssumptionsAreValid;
	}

	public onMonospaceAssumptionsInvalidated(): void {
		if (this._renderedViewLine && this._renderedViewLine instanceof FastRenderedViewLine) {
			this._renderedViewLine = this._renderedViewLine.toSlowRenderedLine();
		}
	}

	public getVisibleRangesForRange(lineNumber: number, startColumn: number, endColumn: number, context: DomReadingContext): VisibleRanges | null {
		if (!this._renderedViewLine) {
			return null;
		}

		startColumn = Math.min(this._renderedViewLine.input.lineContent.length + 1, Math.max(1, startColumn));
		endColumn = Math.min(this._renderedViewLine.input.lineContent.length + 1, Math.max(1, endColumn));

		const stopRenderingLineAfter = this._renderedViewLine.input.stopRenderingLineAfter;

		if (stopRenderingLineAfter !== -1 && startColumn > stopRenderingLineAfter + 1 && endColumn > stopRenderingLineAfter + 1) {
			// This range is obviously not visible
			return new VisibleRanges(true, [new FloatHorizontalRange(this.getWidth(context), 0)]);
		}

		if (stopRenderingLineAfter !== -1 && startColumn > stopRenderingLineAfter + 1) {
			startColumn = stopRenderingLineAfter + 1;
		}

		if (stopRenderingLineAfter !== -1 && endColumn > stopRenderingLineAfter + 1) {
			endColumn = stopRenderingLineAfter + 1;
		}

		const horizontalRanges = this._renderedViewLine.getVisibleRangesForRange(lineNumber, startColumn, endColumn, context);
		if (horizontalRanges && horizontalRanges.length > 0) {
			return new VisibleRanges(false, horizontalRanges);
		}

		return null;
	}

	public getColumnOfNodeOffset(spanNode: HTMLElement, offset: number): number {
		if (!this._renderedViewLine) {
			return 1;
		}
		return this._renderedViewLine.getColumnOfNodeOffset(spanNode, offset);
	}
}

interface IRenderedViewLine {
	domNode: FastDomNode<HTMLElement> | null;
	readonly input: RenderLineInput;
	getWidth(context: DomReadingContext | null): number;
	getWidthIsFast(): boolean;
	getVisibleRangesForRange(lineNumber: number, startColumn: number, endColumn: number, context: DomReadingContext): FloatHorizontalRange[] | null;
	getColumnOfNodeOffset(spanNode: HTMLElement, offset: number): number;
}

const enum Constants {
	/**
	 * It seems that rounding errors occur with long lines, so the purely multiplication based
	 * method is only viable for short lines. For longer lines, we look up the real position of
	 * every 300th character and use multiplication based on that.
	 *
	 * See https://github.com/microsoft/vscode/issues/33178
	 */
	MaxMonospaceDistance = 300
}

/**
 * A rendered line which is guaranteed to contain only regular ASCII and is rendered with a monospace font.
 */
class FastRenderedViewLine implements IRenderedViewLine {

	public domNode: FastDomNode<HTMLElement> | null;
	public readonly input: RenderLineInput;

	private readonly _characterMapping: CharacterMapping;
	private readonly _charWidth: number;
	private readonly _keyColumnPixelOffsetCache: Float32Array | null;
	private _cachedWidth: number = -1;

	constructor(domNode: FastDomNode<HTMLElement> | null, renderLineInput: RenderLineInput, characterMapping: CharacterMapping) {
		this.domNode = domNode;
		this.input = renderLineInput;
		const keyColumnCount = Math.floor(renderLineInput.lineContent.length / Constants.MaxMonospaceDistance);
		if (keyColumnCount > 0) {
			this._keyColumnPixelOffsetCache = new Float32Array(keyColumnCount);
			for (let i = 0; i < keyColumnCount; i++) {
				this._keyColumnPixelOffsetCache[i] = -1;
			}
		} else {
			this._keyColumnPixelOffsetCache = null;
		}

		this._characterMapping = characterMapping;
		this._charWidth = renderLineInput.spaceWidth;
	}

	public getWidth(context: DomReadingContext | null): number {
		if (!this.domNode || this.input.lineContent.length < Constants.MaxMonospaceDistance) {
			const horizontalOffset = this._characterMapping.getHorizontalOffset(this._characterMapping.length);
			return Math.round(this._charWidth * horizontalOffset);
		}
		if (this._cachedWidth === -1) {
			this._cachedWidth = this._getReadingTarget(this.domNode).offsetWidth;
			context?.markDidDomLayout();
		}
		return this._cachedWidth;
	}

	public getWidthIsFast(): boolean {
		return (this.input.lineContent.length < Constants.MaxMonospaceDistance) || this._cachedWidth !== -1;
	}

	public monospaceAssumptionsAreValid(): boolean {
		if (!this.domNode) {
			return monospaceAssumptionsAreValid;
		}
		if (this.input.lineContent.length < Constants.MaxMonospaceDistance) {
			const expectedWidth = this.getWidth(null);
			const actualWidth = (<HTMLSpanElement>this.domNode.domNode.firstChild).offsetWidth;
			if (Math.abs(expectedWidth - actualWidth) >= 2) {
				// more than 2px off
				console.warn(`monospace assumptions have been violated, therefore disabling monospace optimizations!`);
				monospaceAssumptionsAreValid = false;
			}
		}
		return monospaceAssumptionsAreValid;
	}

	public toSlowRenderedLine(): RenderedViewLine {
		return createRenderedLine(this.domNode, this.input, this._characterMapping, ForeignElementType.None);
	}

	public getVisibleRangesForRange(lineNumber: number, startColumn: number, endColumn: number, context: DomReadingContext): FloatHorizontalRange[] | null {
		const startPosition = this._getColumnPixelOffset(lineNumber, startColumn, context);
		const endPosition = this._getColumnPixelOffset(lineNumber, endColumn, context);
		return [new FloatHorizontalRange(startPosition, endPosition - startPosition)];
	}

	private _getColumnPixelOffset(lineNumber: number, column: number, context: DomReadingContext): number {
		if (column <= Constants.MaxMonospaceDistance) {
			const horizontalOffset = this._characterMapping.getHorizontalOffset(column);
			return this._charWidth * horizontalOffset;
		}

		const keyColumnOrdinal = Math.floor((column - 1) / Constants.MaxMonospaceDistance) - 1;
		const keyColumn = (keyColumnOrdinal + 1) * Constants.MaxMonospaceDistance + 1;
		let keyColumnPixelOffset = -1;
		if (this._keyColumnPixelOffsetCache) {
			keyColumnPixelOffset = this._keyColumnPixelOffsetCache[keyColumnOrdinal];
			if (keyColumnPixelOffset === -1) {
				keyColumnPixelOffset = this._actualReadPixelOffset(lineNumber, keyColumn, context);
				this._keyColumnPixelOffsetCache[keyColumnOrdinal] = keyColumnPixelOffset;
			}
		}

		if (keyColumnPixelOffset === -1) {
			// Could not read actual key column pixel offset
			const horizontalOffset = this._characterMapping.getHorizontalOffset(column);
			return this._charWidth * horizontalOffset;
		}

		const keyColumnHorizontalOffset = this._characterMapping.getHorizontalOffset(keyColumn);
		const horizontalOffset = this._characterMapping.getHorizontalOffset(column);
		return keyColumnPixelOffset + this._charWidth * (horizontalOffset - keyColumnHorizontalOffset);
	}

	private _getReadingTarget(myDomNode: FastDomNode<HTMLElement>): HTMLElement {
		return <HTMLSpanElement>myDomNode.domNode.firstChild;
	}

	private _actualReadPixelOffset(lineNumber: number, column: number, context: DomReadingContext): number {
		if (!this.domNode) {
			return -1;
		}
		const domPosition = this._characterMapping.getDomPosition(column);
		const r = RangeUtil.readHorizontalRanges(this._getReadingTarget(this.domNode), domPosition.partIndex, domPosition.charIndex, domPosition.partIndex, domPosition.charIndex, context);
		if (!r || r.length === 0) {
			return -1;
		}
		return r[0].left;
	}

	public getColumnOfNodeOffset(spanNode: HTMLElement, offset: number): number {
		return getColumnOfNodeOffset(this._characterMapping, spanNode, offset);
	}
}

/**
 * Every time we render a line, we save what we have rendered in an instance of this class.
 */
class RenderedViewLine implements IRenderedViewLine {

	public domNode: FastDomNode<HTMLElement> | null;
	public readonly input: RenderLineInput;

	protected readonly _characterMapping: CharacterMapping;
	private readonly _isWhitespaceOnly: boolean;
	private readonly _containsForeignElements: ForeignElementType;
	private _cachedWidth: number;

	/**
	 * This is a map that is used only when the line is guaranteed to be rendered LTR and has no RTL text.
	 */
	private readonly _pixelOffsetCache: Float32Array | null;

	constructor(domNode: FastDomNode<HTMLElement> | null, renderLineInput: RenderLineInput, characterMapping: CharacterMapping, containsForeignElements: ForeignElementType) {
		this.domNode = domNode;
		this.input = renderLineInput;
		this._characterMapping = characterMapping;
		this._isWhitespaceOnly = /^\s*$/.test(renderLineInput.lineContent);
		this._containsForeignElements = containsForeignElements;
		this._cachedWidth = -1;

		this._pixelOffsetCache = null;
		if (renderLineInput.isLTR) {
			this._pixelOffsetCache = new Float32Array(Math.max(2, this._characterMapping.length + 1));
			for (let column = 0, len = this._characterMapping.length; column <= len; column++) {
				this._pixelOffsetCache[column] = -1;
			}
		}
	}

	// --- Reading from the DOM methods

	protected _getReadingTarget(myDomNode: FastDomNode<HTMLElement>): HTMLElement {
		return <HTMLSpanElement>myDomNode.domNode.firstChild;
	}

	/**
	 * Width of the line in pixels
	 */
	public getWidth(context: DomReadingContext | null): number {
		if (!this.domNode) {
			return 0;
		}
		if (this._cachedWidth === -1) {
			this._cachedWidth = this._getReadingTarget(this.domNode).offsetWidth;
			context?.markDidDomLayout();
		}
		return this._cachedWidth;
	}

	public getWidthIsFast(): boolean {
		if (this._cachedWidth === -1) {
			return false;
		}
		return true;
	}

	/**
	 * Visible ranges for a model range
	 */
	public getVisibleRangesForRange(lineNumber: number, startColumn: number, endColumn: number, context: DomReadingContext): FloatHorizontalRange[] | null {
		if (!this.domNode) {
			return null;
		}
		if (this._pixelOffsetCache !== null) {
			// the text is guaranteed to be entirely LTR
			const startOffset = this._readPixelOffset(this.domNode, lineNumber, startColumn, context);
			if (startOffset === -1) {
				return null;
			}

			const endOffset = this._readPixelOffset(this.domNode, lineNumber, endColumn, context);
			if (endOffset === -1) {
				return null;
			}

			return [new FloatHorizontalRange(startOffset, endOffset - startOffset)];
		}

		return this._readVisibleRangesForRange(this.domNode, lineNumber, startColumn, endColumn, context);
	}

	protected _readVisibleRangesForRange(domNode: FastDomNode<HTMLElement>, lineNumber: number, startColumn: number, endColumn: number, context: DomReadingContext): FloatHorizontalRange[] | null {
		if (startColumn === endColumn) {
			const pixelOffset = this._readPixelOffset(domNode, lineNumber, startColumn, context);
			if (pixelOffset === -1) {
				return null;
			} else {
				return [new FloatHorizontalRange(pixelOffset, 0)];
			}
		} else {
			return this._readRawVisibleRangesForRange(domNode, startColumn, endColumn, context);
		}
	}

	protected _readPixelOffset(domNode: FastDomNode<HTMLElement>, lineNumber: number, column: number, context: DomReadingContext): number {
		if (this.input.isLTR && this._characterMapping.length === 0) {
			// This line has no content
			if (this._containsForeignElements === ForeignElementType.None) {
				// We can assume the line is really empty
				return 0;
			}
			if (this._containsForeignElements === ForeignElementType.After) {
				// We have foreign elements after the (empty) line
				return 0;
			}
			if (this._containsForeignElements === ForeignElementType.Before) {
				// We have foreign elements before the (empty) line
				return this.getWidth(context);
			}
			// We have foreign elements before & after the (empty) line
			const readingTarget = this._getReadingTarget(domNode);
			if (readingTarget.firstChild) {
				context.markDidDomLayout();
				return (<HTMLSpanElement>readingTarget.firstChild).offsetWidth;
			} else {
				return 0;
			}
		}

		if (this._pixelOffsetCache !== null) {
			// the text is guaranteed to be LTR

			const cachedPixelOffset = this._pixelOffsetCache[column];
			if (cachedPixelOffset !== -1) {
				return cachedPixelOffset;
			}

			const result = this._actualReadPixelOffset(domNode, lineNumber, column, context);
			this._pixelOffsetCache[column] = result;
			return result;
		}

		return this._actualReadPixelOffset(domNode, lineNumber, column, context);
	}

	private _actualReadPixelOffset(domNode: FastDomNode<HTMLElement>, lineNumber: number, column: number, context: DomReadingContext): number {
		if (this._characterMapping.length === 0) {
			// This line has no content
			const r = RangeUtil.readHorizontalRanges(this._getReadingTarget(domNode), 0, 0, 0, 0, context);
			if (!r || r.length === 0) {
				return -1;
			}
			return r[0].left;
		}

		if (this.input.isLTR && column === this._characterMapping.length && this._isWhitespaceOnly && this._containsForeignElements === ForeignElementType.None) {
			// This branch helps in the case of whitespace only lines which have a width set
			return this.getWidth(context);
		}

		const domPosition = this._characterMapping.getDomPosition(column);

		const r = RangeUtil.readHorizontalRanges(this._getReadingTarget(domNode), domPosition.partIndex, domPosition.charIndex, domPosition.partIndex, domPosition.charIndex, context);
		if (!r || r.length === 0) {
			return -1;
		}
		const result = r[0].left;
		if (this.input.isBasicASCII) {
			const horizontalOffset = this._characterMapping.getHorizontalOffset(column);
			const expectedResult = Math.round(this.input.spaceWidth * horizontalOffset);
			if (Math.abs(expectedResult - result) <= 1) {
				return expectedResult;
			}
		}
		return result;
	}

	private _readRawVisibleRangesForRange(domNode: FastDomNode<HTMLElement>, startColumn: number, endColumn: number, context: DomReadingContext): FloatHorizontalRange[] | null {

		if (this.input.isLTR && startColumn === 1 && endColumn === this._characterMapping.length) {
			// This branch helps IE with bidi text & gives a performance boost to other browsers when reading visible ranges for an entire line

			return [new FloatHorizontalRange(0, this.getWidth(context))];
		}

		const startDomPosition = this._characterMapping.getDomPosition(startColumn);
		const endDomPosition = this._characterMapping.getDomPosition(endColumn);

		return RangeUtil.readHorizontalRanges(this._getReadingTarget(domNode), startDomPosition.partIndex, startDomPosition.charIndex, endDomPosition.partIndex, endDomPosition.charIndex, context);
	}

	/**
	 * Returns the column for the text found at a specific offset inside a rendered dom node
	 */
	public getColumnOfNodeOffset(spanNode: HTMLElement, offset: number): number {
		return getColumnOfNodeOffset(this._characterMapping, spanNode, offset);
	}
}

class WebKitRenderedViewLine extends RenderedViewLine {
	protected override _readVisibleRangesForRange(domNode: FastDomNode<HTMLElement>, lineNumber: number, startColumn: number, endColumn: number, context: DomReadingContext): FloatHorizontalRange[] | null {
		const output = super._readVisibleRangesForRange(domNode, lineNumber, startColumn, endColumn, context);

		if (!output || output.length === 0 || startColumn === endColumn || (startColumn === 1 && endColumn === this._characterMapping.length)) {
			return output;
		}

		// WebKit is buggy and returns an expanded range (to contain words in some cases)
		// The last client rect is enlarged (I think)
		if (this.input.isLTR) {
			// This is an attempt to patch things up
			// Find position of last column
			const endPixelOffset = this._readPixelOffset(domNode, lineNumber, endColumn, context);
			if (endPixelOffset !== -1) {
				const lastRange = output[output.length - 1];
				if (lastRange.left < endPixelOffset) {
					// Trim down the width of the last visible range to not go after the last column's position
					lastRange.width = endPixelOffset - lastRange.left;
				}
			}
		}

		return output;
	}
}

const createRenderedLine: (domNode: FastDomNode<HTMLElement> | null, renderLineInput: RenderLineInput, characterMapping: CharacterMapping, containsForeignElements: ForeignElementType) => RenderedViewLine = (function () {
	if (browser.isWebKit) {
		return createWebKitRenderedLine;
	}
	return createNormalRenderedLine;
})();

function createWebKitRenderedLine(domNode: FastDomNode<HTMLElement> | null, renderLineInput: RenderLineInput, characterMapping: CharacterMapping, containsForeignElements: ForeignElementType): RenderedViewLine {
	return new WebKitRenderedViewLine(domNode, renderLineInput, characterMapping, containsForeignElements);
}

function createNormalRenderedLine(domNode: FastDomNode<HTMLElement> | null, renderLineInput: RenderLineInput, characterMapping: CharacterMapping, containsForeignElements: ForeignElementType): RenderedViewLine {
	return new RenderedViewLine(domNode, renderLineInput, characterMapping, containsForeignElements);
}

export function getColumnOfNodeOffset(characterMapping: CharacterMapping, spanNode: HTMLElement, offset: number): number {
	const spanNodeTextContentLength = spanNode.textContent.length;

	let spanIndex = -1;
	while (spanNode) {
		spanNode = <HTMLElement>spanNode.previousSibling;
		spanIndex++;
	}

	return characterMapping.getColumn(new DomPosition(spanIndex, offset), spanNodeTextContentLength);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/viewLines/viewLineOptions.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/viewLines/viewLineOptions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { ColorScheme } from '../../../../platform/theme/common/theme.js';
import type { IEditorConfiguration } from '../../../common/config/editorConfiguration.js';
import { EditorOption } from '../../../common/config/editorOptions.js';

export class ViewLineOptions {
	public readonly themeType: ColorScheme;
	public readonly renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
	public readonly experimentalWhitespaceRendering: 'svg' | 'font' | 'off';
	public readonly renderControlCharacters: boolean;
	public readonly spaceWidth: number;
	public readonly middotWidth: number;
	public readonly wsmiddotWidth: number;
	public readonly useMonospaceOptimizations: boolean;
	public readonly canUseHalfwidthRightwardsArrow: boolean;
	public readonly lineHeight: number;
	public readonly stopRenderingLineAfter: number;
	public readonly fontLigatures: string;
	public readonly verticalScrollbarSize: number;
	public readonly useGpu: boolean;

	constructor(config: IEditorConfiguration, themeType: ColorScheme) {
		this.themeType = themeType;
		const options = config.options;
		const fontInfo = options.get(EditorOption.fontInfo);
		this.renderWhitespace = options.get(EditorOption.renderWhitespace);
		this.experimentalWhitespaceRendering = options.get(EditorOption.experimentalWhitespaceRendering);
		this.renderControlCharacters = options.get(EditorOption.renderControlCharacters);
		this.spaceWidth = fontInfo.spaceWidth;
		this.middotWidth = fontInfo.middotWidth;
		this.wsmiddotWidth = fontInfo.wsmiddotWidth;
		this.useMonospaceOptimizations = (
			fontInfo.isMonospace
			&& !options.get(EditorOption.disableMonospaceOptimizations)
		);
		this.canUseHalfwidthRightwardsArrow = fontInfo.canUseHalfwidthRightwardsArrow;
		this.lineHeight = options.get(EditorOption.lineHeight);
		this.stopRenderingLineAfter = options.get(EditorOption.stopRenderingLineAfter);
		this.fontLigatures = options.get(EditorOption.fontLigatures);
		this.verticalScrollbarSize = options.get(EditorOption.scrollbar).verticalScrollbarSize;
		this.useGpu = options.get(EditorOption.experimentalGpuAcceleration) === 'on';
	}

	public equals(other: ViewLineOptions): boolean {
		return (
			this.themeType === other.themeType
			&& this.renderWhitespace === other.renderWhitespace
			&& this.experimentalWhitespaceRendering === other.experimentalWhitespaceRendering
			&& this.renderControlCharacters === other.renderControlCharacters
			&& this.spaceWidth === other.spaceWidth
			&& this.middotWidth === other.middotWidth
			&& this.wsmiddotWidth === other.wsmiddotWidth
			&& this.useMonospaceOptimizations === other.useMonospaceOptimizations
			&& this.canUseHalfwidthRightwardsArrow === other.canUseHalfwidthRightwardsArrow
			&& this.lineHeight === other.lineHeight
			&& this.stopRenderingLineAfter === other.stopRenderingLineAfter
			&& this.fontLigatures === other.fontLigatures
			&& this.verticalScrollbarSize === other.verticalScrollbarSize
			&& this.useGpu === other.useGpu
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/viewLines/viewLines.css]---
Location: vscode-main/src/vs/editor/browser/viewParts/viewLines/viewLines.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Uncomment to see lines flashing when they're painted */
/*.monaco-editor .view-lines > .view-line {
	background-color: none;
	animation-name: flash-background;
	animation-duration: 800ms;
}
@keyframes flash-background {
	0%   { background-color: lightgreen; }
	100% { background-color: none }
}*/

.mtkcontrol {
	color: rgb(255, 255, 255) !important;
	background: rgb(150, 0, 0) !important;
}

.mtkoverflow {
	background-color: var(--vscode-button-background, var(--vscode-editor-background));
	color: var(--vscode-button-foreground, var(--vscode-editor-foreground));
	border-width: 1px;
	border-style: solid;
	border-color: var(--vscode-contrastBorder);
	border-radius: 2px;
	padding: 4px;
	cursor: pointer;
}
.mtkoverflow:hover {
	background-color: var(--vscode-button-hoverBackground);
}

.monaco-editor.no-user-select .lines-content,
.monaco-editor.no-user-select .view-line,
.monaco-editor.no-user-select .view-lines {
	user-select: none;
	-webkit-user-select: none;
}
/* Use user-select: text for lookup feature on macOS */
/* https://github.com/microsoft/vscode/issues/85632 */
.monaco-editor.mac .lines-content:hover,
.monaco-editor.mac .view-line:hover,
.monaco-editor.mac .view-lines:hover {
	user-select: text;
	-webkit-user-select: text;
	-ms-user-select: text;
}

.monaco-editor.enable-user-select {
	user-select: initial;
	-webkit-user-select: initial;
}

.monaco-editor .view-lines {
	white-space: nowrap;
}

.monaco-editor .view-line {
	box-sizing: border-box;
	position: absolute;
	width: 100%;
}

/* There are view-lines in view-zones. We have to make sure this rule does not apply to them, as they don't set a line height */
.monaco-editor .lines-content > .view-lines > .view-line > span {
	top: 0;
	bottom: 0;
	position: absolute;
}

.monaco-editor .mtkw {
	color: var(--vscode-editorWhitespace-foreground) !important;
}

.monaco-editor .mtkz {
	display: inline-block;
	color: var(--vscode-editorWhitespace-foreground) !important;
}

/* TODO@tokenization bootstrap fix */
/*.monaco-editor .view-line > span > span {
	float: none;
	min-height: inherit;
	margin-left: inherit;
}*/
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/viewLines/viewLines.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/viewLines/viewLines.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode } from '../../../../base/browser/fastDomNode.js';
import { MOUSE_CURSOR_TEXT_CSS_CLASS_NAME } from '../../../../base/browser/ui/mouseCursor/mouseCursor.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import * as platform from '../../../../base/common/platform.js';
import { Constants } from '../../../../base/common/uint.js';
import './viewLines.css';
import { applyFontInfo } from '../../config/domFontInfo.js';
import { HorizontalPosition, HorizontalRange, IViewLines, LineVisibleRanges, VisibleRanges } from '../../view/renderingContext.js';
import { VisibleLinesCollection } from '../../view/viewLayer.js';
import { PartFingerprint, PartFingerprints, ViewPart } from '../../view/viewPart.js';
import { DomReadingContext } from './domReadingContext.js';
import { ViewLine } from './viewLine.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ScrollType } from '../../../common/editorCommon.js';
import * as viewEvents from '../../../common/viewEvents.js';
import { ViewportData } from '../../../common/viewLayout/viewLinesViewportData.js';
import { Viewport } from '../../../common/viewModel.js';
import { ViewContext } from '../../../common/viewModel/viewContext.js';
import { ViewLineOptions } from './viewLineOptions.js';
import type { ViewGpuContext } from '../../gpu/viewGpuContext.js';
import { TextDirection } from '../../../common/model.js';

class LastRenderedData {

	private _currentVisibleRange: Range;

	constructor() {
		this._currentVisibleRange = new Range(1, 1, 1, 1);
	}

	public getCurrentVisibleRange(): Range {
		return this._currentVisibleRange;
	}

	public setCurrentVisibleRange(currentVisibleRange: Range): void {
		this._currentVisibleRange = currentVisibleRange;
	}
}

class HorizontalRevealRangeRequest {
	public readonly type = 'range';
	public readonly minLineNumber: number;
	public readonly maxLineNumber: number;

	constructor(
		public readonly minimalReveal: boolean,
		public readonly lineNumber: number,
		public readonly startColumn: number,
		public readonly endColumn: number,
		public readonly startScrollTop: number,
		public readonly stopScrollTop: number,
		public readonly scrollType: ScrollType
	) {
		this.minLineNumber = lineNumber;
		this.maxLineNumber = lineNumber;
	}
}

class HorizontalRevealSelectionsRequest {
	public readonly type = 'selections';
	public readonly minLineNumber: number;
	public readonly maxLineNumber: number;

	constructor(
		public readonly minimalReveal: boolean,
		public readonly selections: Selection[],
		public readonly startScrollTop: number,
		public readonly stopScrollTop: number,
		public readonly scrollType: ScrollType
	) {
		let minLineNumber = selections[0].startLineNumber;
		let maxLineNumber = selections[0].endLineNumber;
		for (let i = 1, len = selections.length; i < len; i++) {
			const selection = selections[i];
			minLineNumber = Math.min(minLineNumber, selection.startLineNumber);
			maxLineNumber = Math.max(maxLineNumber, selection.endLineNumber);
		}
		this.minLineNumber = minLineNumber;
		this.maxLineNumber = maxLineNumber;
	}
}

type HorizontalRevealRequest = HorizontalRevealRangeRequest | HorizontalRevealSelectionsRequest;

/**
 * The view lines part is responsible for rendering the actual content of a
 * file.
 */
export class ViewLines extends ViewPart implements IViewLines {
	/**
	 * Adds this amount of pixels to the right of lines (no-one wants to type near the edge of the viewport)
	 */
	private static readonly HORIZONTAL_EXTRA_PX = 30;

	private readonly _linesContent: FastDomNode<HTMLElement>;
	private readonly _textRangeRestingSpot: HTMLElement;
	private readonly _visibleLines: VisibleLinesCollection<ViewLine>;
	private readonly domNode: FastDomNode<HTMLElement>;

	// --- config
	private _lineHeight: number;
	private _typicalHalfwidthCharacterWidth: number;
	private _isViewportWrapping: boolean;
	private _revealHorizontalRightPadding: number;
	private _cursorSurroundingLines: number;
	private _cursorSurroundingLinesStyle: 'default' | 'all';
	private _canUseLayerHinting: boolean;
	private _viewLineOptions: ViewLineOptions;

	// --- width
	private _maxLineWidth: number;
	private readonly _asyncUpdateLineWidths: RunOnceScheduler;
	private readonly _asyncCheckMonospaceFontAssumptions: RunOnceScheduler;

	private _horizontalRevealRequest: HorizontalRevealRequest | null;
	private readonly _lastRenderedData: LastRenderedData;

	// Sticky Scroll
	private _stickyScrollEnabled: boolean;
	private _maxNumberStickyLines: number;

	constructor(context: ViewContext, viewGpuContext: ViewGpuContext | undefined, linesContent: FastDomNode<HTMLElement>) {
		super(context);

		const conf = this._context.configuration;
		const options = this._context.configuration.options;
		const fontInfo = options.get(EditorOption.fontInfo);
		const wrappingInfo = options.get(EditorOption.wrappingInfo);

		this._lineHeight = options.get(EditorOption.lineHeight);
		this._typicalHalfwidthCharacterWidth = fontInfo.typicalHalfwidthCharacterWidth;
		this._isViewportWrapping = wrappingInfo.isViewportWrapping;
		this._revealHorizontalRightPadding = options.get(EditorOption.revealHorizontalRightPadding);
		this._cursorSurroundingLines = options.get(EditorOption.cursorSurroundingLines);
		this._cursorSurroundingLinesStyle = options.get(EditorOption.cursorSurroundingLinesStyle);
		this._canUseLayerHinting = !options.get(EditorOption.disableLayerHinting);
		this._viewLineOptions = new ViewLineOptions(conf, this._context.theme.type);

		this._linesContent = linesContent;
		this._textRangeRestingSpot = document.createElement('div');
		this._visibleLines = new VisibleLinesCollection(this._context, {
			createLine: () => new ViewLine(viewGpuContext, this._viewLineOptions),
		});
		this.domNode = this._visibleLines.domNode;

		PartFingerprints.write(this.domNode, PartFingerprint.ViewLines);
		this.domNode.setClassName(`view-lines ${MOUSE_CURSOR_TEXT_CSS_CLASS_NAME}`);
		applyFontInfo(this.domNode, fontInfo);

		// --- width & height
		this._maxLineWidth = 0;
		this._asyncUpdateLineWidths = new RunOnceScheduler(() => {
			this._updateLineWidthsSlow();
		}, 200);
		this._asyncCheckMonospaceFontAssumptions = new RunOnceScheduler(() => {
			this._checkMonospaceFontAssumptions();
		}, 2000);

		this._lastRenderedData = new LastRenderedData();

		this._horizontalRevealRequest = null;

		// sticky scroll widget
		this._stickyScrollEnabled = options.get(EditorOption.stickyScroll).enabled;
		this._maxNumberStickyLines = options.get(EditorOption.stickyScroll).maxLineCount;
	}

	public override dispose(): void {
		this._asyncUpdateLineWidths.dispose();
		this._asyncCheckMonospaceFontAssumptions.dispose();
		super.dispose();
	}

	public getDomNode(): FastDomNode<HTMLElement> {
		return this.domNode;
	}

	// ---- begin view event handlers

	public override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		this._visibleLines.onConfigurationChanged(e);
		if (e.hasChanged(EditorOption.wrappingInfo)) {
			this._maxLineWidth = 0;
		}

		const options = this._context.configuration.options;
		const fontInfo = options.get(EditorOption.fontInfo);
		const wrappingInfo = options.get(EditorOption.wrappingInfo);

		this._lineHeight = options.get(EditorOption.lineHeight);
		this._typicalHalfwidthCharacterWidth = fontInfo.typicalHalfwidthCharacterWidth;
		this._isViewportWrapping = wrappingInfo.isViewportWrapping;
		this._revealHorizontalRightPadding = options.get(EditorOption.revealHorizontalRightPadding);
		this._cursorSurroundingLines = options.get(EditorOption.cursorSurroundingLines);
		this._cursorSurroundingLinesStyle = options.get(EditorOption.cursorSurroundingLinesStyle);
		this._canUseLayerHinting = !options.get(EditorOption.disableLayerHinting);

		// sticky scroll
		this._stickyScrollEnabled = options.get(EditorOption.stickyScroll).enabled;
		this._maxNumberStickyLines = options.get(EditorOption.stickyScroll).maxLineCount;

		applyFontInfo(this.domNode, fontInfo);

		this._onOptionsMaybeChanged();

		if (e.hasChanged(EditorOption.layoutInfo)) {
			this._maxLineWidth = 0;
		}

		return true;
	}
	private _onOptionsMaybeChanged(): boolean {
		const conf = this._context.configuration;

		const newViewLineOptions = new ViewLineOptions(conf, this._context.theme.type);
		if (!this._viewLineOptions.equals(newViewLineOptions)) {
			this._viewLineOptions = newViewLineOptions;

			const startLineNumber = this._visibleLines.getStartLineNumber();
			const endLineNumber = this._visibleLines.getEndLineNumber();
			for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
				const line = this._visibleLines.getVisibleLine(lineNumber);
				line.onOptionsChanged(this._viewLineOptions);
			}
			return true;
		}

		return false;
	}
	public override onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean {
		const rendStartLineNumber = this._visibleLines.getStartLineNumber();
		const rendEndLineNumber = this._visibleLines.getEndLineNumber();
		let r = false;
		for (let lineNumber = rendStartLineNumber; lineNumber <= rendEndLineNumber; lineNumber++) {
			r = this._visibleLines.getVisibleLine(lineNumber).onSelectionChanged() || r;
		}
		return r;
	}
	public override onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean {
		const rendStartLineNumber = this._visibleLines.getStartLineNumber();
		const rendEndLineNumber = this._visibleLines.getEndLineNumber();
		for (let lineNumber = rendStartLineNumber; lineNumber <= rendEndLineNumber; lineNumber++) {
			this._visibleLines.getVisibleLine(lineNumber).onDecorationsChanged();
		}
		return true;
	}
	public override onFlushed(e: viewEvents.ViewFlushedEvent): boolean {
		const shouldRender = this._visibleLines.onFlushed(e, this._viewLineOptions.useGpu);
		this._maxLineWidth = 0;
		return shouldRender;
	}
	public override onLinesChanged(e: viewEvents.ViewLinesChangedEvent): boolean {
		return this._visibleLines.onLinesChanged(e);
	}
	public override onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean {
		return this._visibleLines.onLinesDeleted(e);
	}
	public override onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean {
		return this._visibleLines.onLinesInserted(e);
	}
	public override onRevealRangeRequest(e: viewEvents.ViewRevealRangeRequestEvent): boolean {
		// Using the future viewport here in order to handle multiple
		// incoming reveal range requests that might all desire to be animated
		const desiredScrollTop = this._computeScrollTopToRevealRange(this._context.viewLayout.getFutureViewport(), e.source, e.minimalReveal, e.range, e.selections, e.verticalType);

		if (desiredScrollTop === -1) {
			// marker to abort the reveal range request
			return false;
		}

		// validate the new desired scroll top
		let newScrollPosition = this._context.viewLayout.validateScrollPosition({ scrollTop: desiredScrollTop });

		if (e.revealHorizontal) {
			if (e.range && e.range.startLineNumber !== e.range.endLineNumber) {
				// Two or more lines? => scroll to base (That's how you see most of the two lines)
				newScrollPosition = {
					scrollTop: newScrollPosition.scrollTop,
					scrollLeft: 0
				};
			} else if (e.range) {
				// We don't necessarily know the horizontal offset of this range since the line might not be in the view...
				this._horizontalRevealRequest = new HorizontalRevealRangeRequest(e.minimalReveal, e.range.startLineNumber, e.range.startColumn, e.range.endColumn, this._context.viewLayout.getCurrentScrollTop(), newScrollPosition.scrollTop, e.scrollType);
			} else if (e.selections && e.selections.length > 0) {
				this._horizontalRevealRequest = new HorizontalRevealSelectionsRequest(e.minimalReveal, e.selections, this._context.viewLayout.getCurrentScrollTop(), newScrollPosition.scrollTop, e.scrollType);
			}
		} else {
			this._horizontalRevealRequest = null;
		}

		const scrollTopDelta = Math.abs(this._context.viewLayout.getCurrentScrollTop() - newScrollPosition.scrollTop);
		const scrollType = (scrollTopDelta <= this._lineHeight ? ScrollType.Immediate : e.scrollType);
		this._context.viewModel.viewLayout.setScrollPosition(newScrollPosition, scrollType);

		return true;
	}
	public override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean {
		if (this._horizontalRevealRequest && e.scrollLeftChanged) {
			// cancel any outstanding horizontal reveal request if someone else scrolls horizontally.
			this._horizontalRevealRequest = null;
		}
		if (this._horizontalRevealRequest && e.scrollTopChanged) {
			const min = Math.min(this._horizontalRevealRequest.startScrollTop, this._horizontalRevealRequest.stopScrollTop);
			const max = Math.max(this._horizontalRevealRequest.startScrollTop, this._horizontalRevealRequest.stopScrollTop);
			if (e.scrollTop < min || e.scrollTop > max) {
				// cancel any outstanding horizontal reveal request if someone else scrolls vertically.
				this._horizontalRevealRequest = null;
			}
		}
		this.domNode.setWidth(e.scrollWidth);
		return this._visibleLines.onScrollChanged(e) || e.scrollTopChanged || e.scrollLeftChanged;
	}

	public override onTokensChanged(e: viewEvents.ViewTokensChangedEvent): boolean {
		return this._visibleLines.onTokensChanged(e);
	}
	public override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean {
		this._context.viewModel.viewLayout.setMaxLineWidth(this._maxLineWidth);
		return this._visibleLines.onZonesChanged(e);
	}
	public override onThemeChanged(e: viewEvents.ViewThemeChangedEvent): boolean {
		return this._onOptionsMaybeChanged();
	}

	// ---- end view event handlers

	// ----------- HELPERS FOR OTHERS

	public getPositionFromDOMInfo(spanNode: HTMLElement, offset: number): Position | null {
		const viewLineDomNode = this._getViewLineDomNode(spanNode);
		if (viewLineDomNode === null) {
			// Couldn't find view line node
			return null;
		}
		const lineNumber = this._getLineNumberFor(viewLineDomNode);

		if (lineNumber === -1) {
			// Couldn't find view line node
			return null;
		}

		if (lineNumber < 1 || lineNumber > this._context.viewModel.getLineCount()) {
			// lineNumber is outside range
			return null;
		}

		if (this._context.viewModel.getLineMaxColumn(lineNumber) === 1) {
			// Line is empty
			return new Position(lineNumber, 1);
		}

		const rendStartLineNumber = this._visibleLines.getStartLineNumber();
		const rendEndLineNumber = this._visibleLines.getEndLineNumber();
		if (lineNumber < rendStartLineNumber || lineNumber > rendEndLineNumber) {
			// Couldn't find line
			return null;
		}

		let column = this._visibleLines.getVisibleLine(lineNumber).getColumnOfNodeOffset(spanNode, offset);
		const minColumn = this._context.viewModel.getLineMinColumn(lineNumber);
		if (column < minColumn) {
			column = minColumn;
		}
		return new Position(lineNumber, column);
	}

	private _getViewLineDomNode(node: HTMLElement | null): HTMLElement | null {
		while (node && node.nodeType === 1) {
			if (node.className === ViewLine.CLASS_NAME) {
				return node;
			}
			node = node.parentElement;
		}
		return null;
	}

	/**
	 * @returns the line number of this view line dom node.
	 */
	private _getLineNumberFor(domNode: HTMLElement): number {
		const startLineNumber = this._visibleLines.getStartLineNumber();
		const endLineNumber = this._visibleLines.getEndLineNumber();
		for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
			const line = this._visibleLines.getVisibleLine(lineNumber);
			if (domNode === line.getDomNode()) {
				return lineNumber;
			}
		}
		return -1;
	}

	public getLineWidth(lineNumber: number): number {
		const rendStartLineNumber = this._visibleLines.getStartLineNumber();
		const rendEndLineNumber = this._visibleLines.getEndLineNumber();
		if (lineNumber < rendStartLineNumber || lineNumber > rendEndLineNumber) {
			// Couldn't find line
			return -1;
		}

		const context = new DomReadingContext(this.domNode.domNode, this._textRangeRestingSpot);
		const result = this._visibleLines.getVisibleLine(lineNumber).getWidth(context);
		this._updateLineWidthsSlowIfDomDidLayout(context);

		return result;
	}

	public linesVisibleRangesForRange(_range: Range, includeNewLines: boolean): LineVisibleRanges[] | null {
		const originalEndLineNumber = _range.endLineNumber;
		const range = Range.intersectRanges(_range, this._lastRenderedData.getCurrentVisibleRange());
		if (!range) {
			return null;
		}

		const visibleRanges: LineVisibleRanges[] = [];
		let visibleRangesLen = 0;
		const domReadingContext = new DomReadingContext(this.domNode.domNode, this._textRangeRestingSpot);

		let nextLineModelLineNumber: number = 0;
		if (includeNewLines) {
			nextLineModelLineNumber = this._context.viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(range.startLineNumber, 1)).lineNumber;
		}

		const rendStartLineNumber = this._visibleLines.getStartLineNumber();
		const rendEndLineNumber = this._visibleLines.getEndLineNumber();
		for (let lineNumber = range.startLineNumber; lineNumber <= range.endLineNumber; lineNumber++) {

			if (lineNumber < rendStartLineNumber || lineNumber > rendEndLineNumber) {
				continue;
			}

			const startColumn = lineNumber === range.startLineNumber ? range.startColumn : 1;
			const continuesInNextLine = lineNumber !== originalEndLineNumber;
			const endColumn = continuesInNextLine ? this._context.viewModel.getLineMaxColumn(lineNumber) : range.endColumn;
			const visibleLine = this._visibleLines.getVisibleLine(lineNumber);
			const visibleRangesForLine = visibleLine.getVisibleRangesForRange(lineNumber, startColumn, endColumn, domReadingContext);

			if (!visibleRangesForLine) {
				continue;
			}

			if (includeNewLines && lineNumber < originalEndLineNumber) {
				const currentLineModelLineNumber = nextLineModelLineNumber;
				nextLineModelLineNumber = this._context.viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(lineNumber + 1, 1)).lineNumber;

				if (currentLineModelLineNumber !== nextLineModelLineNumber) {
					const floatHorizontalRange = visibleRangesForLine.ranges[visibleRangesForLine.ranges.length - 1];
					floatHorizontalRange.width += this._typicalHalfwidthCharacterWidth;
					if (this._context.viewModel.getTextDirection(currentLineModelLineNumber) === TextDirection.RTL) {
						floatHorizontalRange.left -= this._typicalHalfwidthCharacterWidth;
					}
				}
			}

			visibleRanges[visibleRangesLen++] = new LineVisibleRanges(visibleRangesForLine.outsideRenderedLine, lineNumber, HorizontalRange.from(visibleRangesForLine.ranges), continuesInNextLine);
		}

		this._updateLineWidthsSlowIfDomDidLayout(domReadingContext);

		if (visibleRangesLen === 0) {
			return null;
		}

		return visibleRanges;
	}

	private _visibleRangesForLineRange(lineNumber: number, startColumn: number, endColumn: number): VisibleRanges | null {
		if (lineNumber < this._visibleLines.getStartLineNumber() || lineNumber > this._visibleLines.getEndLineNumber()) {
			return null;
		}

		const domReadingContext = new DomReadingContext(this.domNode.domNode, this._textRangeRestingSpot);
		const result = this._visibleLines.getVisibleLine(lineNumber).getVisibleRangesForRange(lineNumber, startColumn, endColumn, domReadingContext);
		this._updateLineWidthsSlowIfDomDidLayout(domReadingContext);

		return result;
	}

	private _lineIsRenderedRTL(lineNumber: number): boolean {
		if (lineNumber < this._visibleLines.getStartLineNumber() || lineNumber > this._visibleLines.getEndLineNumber()) {
			return false;
		}
		const visibleLine = this._visibleLines.getVisibleLine(lineNumber);
		return visibleLine.isRenderedRTL();
	}

	public visibleRangeForPosition(position: Position): HorizontalPosition | null {
		const visibleRanges = this._visibleRangesForLineRange(position.lineNumber, position.column, position.column);
		if (!visibleRanges) {
			return null;
		}
		return new HorizontalPosition(visibleRanges.outsideRenderedLine, visibleRanges.ranges[0].left);
	}

	// --- implementation

	public updateLineWidths(): void {
		this._updateLineWidths(false);
	}

	/**
	 * Updates the max line width if it is fast to compute.
	 * Returns true if all lines were taken into account.
	 * Returns false if some lines need to be reevaluated (in a slow fashion).
	 */
	private _updateLineWidthsFast(): boolean {
		return this._updateLineWidths(true);
	}

	private _updateLineWidthsSlow(): void {
		this._updateLineWidths(false);
	}

	/**
	 * Update the line widths using DOM layout information after someone else
	 * has caused a synchronous layout.
	 */
	private _updateLineWidthsSlowIfDomDidLayout(domReadingContext: DomReadingContext): void {
		if (!domReadingContext.didDomLayout) {
			// only proceed if we just did a layout
			return;
		}
		if (!this._asyncUpdateLineWidths.isScheduled()) {
			// reading widths is not scheduled => widths are up-to-date
			return;
		}
		this._asyncUpdateLineWidths.cancel();
		this._updateLineWidthsSlow();
	}

	private _updateLineWidths(fast: boolean): boolean {
		const rendStartLineNumber = this._visibleLines.getStartLineNumber();
		const rendEndLineNumber = this._visibleLines.getEndLineNumber();

		let localMaxLineWidth = 1;
		let allWidthsComputed = true;
		for (let lineNumber = rendStartLineNumber; lineNumber <= rendEndLineNumber; lineNumber++) {
			const visibleLine = this._visibleLines.getVisibleLine(lineNumber);

			if (fast && !visibleLine.getWidthIsFast()) {
				// Cannot compute width in a fast way for this line
				allWidthsComputed = false;
				continue;
			}

			localMaxLineWidth = Math.max(localMaxLineWidth, visibleLine.getWidth(null));
		}

		if (allWidthsComputed && rendStartLineNumber === 1 && rendEndLineNumber === this._context.viewModel.getLineCount()) {
			// we know the max line width for all the lines
			this._maxLineWidth = 0;
		}

		this._ensureMaxLineWidth(localMaxLineWidth);

		return allWidthsComputed;
	}

	private _checkMonospaceFontAssumptions(): void {
		// Problems with monospace assumptions are more apparent for longer lines,
		// as small rounding errors start to sum up, so we will select the longest
		// line for a closer inspection
		let longestLineNumber = -1;
		let longestWidth = -1;
		const rendStartLineNumber = this._visibleLines.getStartLineNumber();
		const rendEndLineNumber = this._visibleLines.getEndLineNumber();
		for (let lineNumber = rendStartLineNumber; lineNumber <= rendEndLineNumber; lineNumber++) {
			const visibleLine = this._visibleLines.getVisibleLine(lineNumber);
			if (visibleLine.needsMonospaceFontCheck()) {
				const lineWidth = visibleLine.getWidth(null);
				if (lineWidth > longestWidth) {
					longestWidth = lineWidth;
					longestLineNumber = lineNumber;
				}
			}
		}

		if (longestLineNumber === -1) {
			return;
		}

		if (!this._visibleLines.getVisibleLine(longestLineNumber).monospaceAssumptionsAreValid()) {
			for (let lineNumber = rendStartLineNumber; lineNumber <= rendEndLineNumber; lineNumber++) {
				const visibleLine = this._visibleLines.getVisibleLine(lineNumber);
				visibleLine.onMonospaceAssumptionsInvalidated();
			}
		}
	}

	public prepareRender(): void {
		throw new Error('Not supported');
	}

	public render(): void {
		throw new Error('Not supported');
	}

	public renderText(viewportData: ViewportData): void {
		// (1) render lines - ensures lines are in the DOM
		this._visibleLines.renderLines(viewportData);
		this._lastRenderedData.setCurrentVisibleRange(viewportData.visibleRange);
		this.domNode.setWidth(this._context.viewLayout.getScrollWidth());
		this.domNode.setHeight(Math.min(this._context.viewLayout.getScrollHeight(), 1000000));

		// (2) compute horizontal scroll position:
		//  - this must happen after the lines are in the DOM since it might need a line that rendered just now
		//  - it might change `scrollWidth` and `scrollLeft`
		if (this._horizontalRevealRequest) {

			const horizontalRevealRequest = this._horizontalRevealRequest;

			// Check that we have the line that contains the horizontal range in the viewport
			if (viewportData.startLineNumber <= horizontalRevealRequest.minLineNumber && horizontalRevealRequest.maxLineNumber <= viewportData.endLineNumber) {

				this._horizontalRevealRequest = null;

				// allow `visibleRangesForRange2` to work
				this.onDidRender();

				// compute new scroll position
				const newScrollLeft = this._computeScrollLeftToReveal(horizontalRevealRequest);

				if (newScrollLeft) {
					if (!this._isViewportWrapping && !newScrollLeft.hasRTL) {
						// ensure `scrollWidth` is large enough
						this._ensureMaxLineWidth(newScrollLeft.maxHorizontalOffset);
					}
					// set `scrollLeft`
					this._context.viewModel.viewLayout.setScrollPosition({
						scrollLeft: newScrollLeft.scrollLeft
					}, horizontalRevealRequest.scrollType);
				}
			}
		}

		// Update max line width (not so important, it is just so the horizontal scrollbar doesn't get too small)
		if (!this._updateLineWidthsFast()) {
			// Computing the width of some lines would be slow => delay it
			this._asyncUpdateLineWidths.schedule();
		} else {
			this._asyncUpdateLineWidths.cancel();
		}

		if (platform.isLinux && !this._asyncCheckMonospaceFontAssumptions.isScheduled()) {
			const rendStartLineNumber = this._visibleLines.getStartLineNumber();
			const rendEndLineNumber = this._visibleLines.getEndLineNumber();
			for (let lineNumber = rendStartLineNumber; lineNumber <= rendEndLineNumber; lineNumber++) {
				const visibleLine = this._visibleLines.getVisibleLine(lineNumber);
				if (visibleLine.needsMonospaceFontCheck()) {
					this._asyncCheckMonospaceFontAssumptions.schedule();
					break;
				}
			}
		}

		// (3) handle scrolling
		this._linesContent.setLayerHinting(this._canUseLayerHinting);
		this._linesContent.setContain('strict');
		const adjustedScrollTop = this._context.viewLayout.getCurrentScrollTop() - viewportData.bigNumbersDelta;
		this._linesContent.setTop(-adjustedScrollTop);
		this._linesContent.setLeft(-this._context.viewLayout.getCurrentScrollLeft());
	}

	// --- width

	private _ensureMaxLineWidth(lineWidth: number): void {
		const iLineWidth = Math.ceil(lineWidth);
		if (this._maxLineWidth < iLineWidth) {
			this._maxLineWidth = iLineWidth;
			this._context.viewModel.viewLayout.setMaxLineWidth(this._maxLineWidth);
		}
	}

	private _computeScrollTopToRevealRange(viewport: Viewport, source: string | null | undefined, minimalReveal: boolean, range: Range | null, selections: Selection[] | null, verticalType: viewEvents.VerticalRevealType): number {
		const viewportStartY = viewport.top;
		const viewportHeight = viewport.height;
		const viewportEndY = viewportStartY + viewportHeight;
		let boxIsSingleRange: boolean;
		let boxStartY: number;
		let boxEndY: number;

		if (selections && selections.length > 0) {
			let minLineNumber = selections[0].startLineNumber;
			let maxLineNumber = selections[0].endLineNumber;
			for (let i = 1, len = selections.length; i < len; i++) {
				const selection = selections[i];
				minLineNumber = Math.min(minLineNumber, selection.startLineNumber);
				maxLineNumber = Math.max(maxLineNumber, selection.endLineNumber);
			}
			boxIsSingleRange = false;
			boxStartY = this._context.viewLayout.getVerticalOffsetForLineNumber(minLineNumber);
			boxEndY = this._context.viewLayout.getVerticalOffsetForLineNumber(maxLineNumber) + this._lineHeight;
		} else if (range) {
			boxIsSingleRange = true;
			boxStartY = this._context.viewLayout.getVerticalOffsetForLineNumber(range.startLineNumber);
			boxEndY = this._context.viewLayout.getVerticalOffsetForLineNumber(range.endLineNumber) + this._lineHeight;
		} else {
			return -1;
		}

		const shouldIgnoreScrollOff = (source === 'mouse' || minimalReveal) && this._cursorSurroundingLinesStyle === 'default';

		let paddingTop: number = 0;
		let paddingBottom: number = 0;

		if (!shouldIgnoreScrollOff) {
			const maxLinesInViewport = (viewportHeight / this._lineHeight);
			const surroundingLines = Math.max(this._cursorSurroundingLines, this._stickyScrollEnabled ? this._maxNumberStickyLines : 0);
			const context = Math.min(maxLinesInViewport / 2, surroundingLines);
			paddingTop = context * this._lineHeight;
			paddingBottom = Math.max(0, (context - 1)) * this._lineHeight;
		} else {
			if (!minimalReveal) {
				// Reveal one more line above (this case is hit when dragging)
				paddingTop = this._lineHeight;
			}
		}
		if (!minimalReveal) {
			if (verticalType === viewEvents.VerticalRevealType.Simple || verticalType === viewEvents.VerticalRevealType.Bottom) {
				// Reveal one line more when the last line would be covered by the scrollbar - arrow down case or revealing a line explicitly at bottom
				paddingBottom += this._lineHeight;
			}
		}

		boxStartY -= paddingTop;
		boxEndY += paddingBottom;
		let newScrollTop: number;

		if (boxEndY - boxStartY > viewportHeight) {
			// the box is larger than the viewport ... scroll to its top
			if (!boxIsSingleRange) {
				// do not reveal multiple cursors if there are more than fit the viewport
				return -1;
			}
			newScrollTop = boxStartY;
		} else if (verticalType === viewEvents.VerticalRevealType.NearTop || verticalType === viewEvents.VerticalRevealType.NearTopIfOutsideViewport) {
			if (verticalType === viewEvents.VerticalRevealType.NearTopIfOutsideViewport && viewportStartY <= boxStartY && boxEndY <= viewportEndY) {
				// Box is already in the viewport... do nothing
				newScrollTop = viewportStartY;
			} else {
				// We want a gap that is 20% of the viewport, but with a minimum of 5 lines
				const desiredGapAbove = Math.max(5 * this._lineHeight, viewportHeight * 0.2);
				// Try to scroll just above the box with the desired gap
				const desiredScrollTop = boxStartY - desiredGapAbove;
				// But ensure that the box is not pushed out of viewport
				const minScrollTop = boxEndY - viewportHeight;
				newScrollTop = Math.max(minScrollTop, desiredScrollTop);
			}
		} else if (verticalType === viewEvents.VerticalRevealType.Center || verticalType === viewEvents.VerticalRevealType.CenterIfOutsideViewport) {
			if (verticalType === viewEvents.VerticalRevealType.CenterIfOutsideViewport && viewportStartY <= boxStartY && boxEndY <= viewportEndY) {
				// Box is already in the viewport... do nothing
				newScrollTop = viewportStartY;
			} else {
				// Box is outside the viewport... center it
				const boxMiddleY = (boxStartY + boxEndY) / 2;
				newScrollTop = Math.max(0, boxMiddleY - viewportHeight / 2);
			}
		} else {
			newScrollTop = this._computeMinimumScrolling(viewportStartY, viewportEndY, boxStartY, boxEndY, verticalType === viewEvents.VerticalRevealType.Top, verticalType === viewEvents.VerticalRevealType.Bottom);
		}

		return newScrollTop;
	}

	private _computeScrollLeftToReveal(horizontalRevealRequest: HorizontalRevealRequest): { scrollLeft: number; maxHorizontalOffset: number; hasRTL: boolean } | null {

		const viewport = this._context.viewLayout.getCurrentViewport();
		const layoutInfo = this._context.configuration.options.get(EditorOption.layoutInfo);
		const viewportStartX = viewport.left;
		const viewportEndX = viewportStartX + viewport.width - layoutInfo.verticalScrollbarWidth;

		let boxStartX = Constants.MAX_SAFE_SMALL_INTEGER;
		let boxEndX = 0;
		let hasRTL = false;
		if (horizontalRevealRequest.type === 'range') {
			hasRTL = this._lineIsRenderedRTL(horizontalRevealRequest.lineNumber);
			const visibleRanges = this._visibleRangesForLineRange(horizontalRevealRequest.lineNumber, horizontalRevealRequest.startColumn, horizontalRevealRequest.endColumn);
			if (!visibleRanges) {
				return null;
			}
			for (const visibleRange of visibleRanges.ranges) {
				boxStartX = Math.min(boxStartX, Math.round(visibleRange.left));
				boxEndX = Math.max(boxEndX, Math.round(visibleRange.left + visibleRange.width));
			}
		} else {
			for (const selection of horizontalRevealRequest.selections) {
				if (selection.startLineNumber !== selection.endLineNumber) {
					return null;
				}
				const visibleRanges = this._visibleRangesForLineRange(selection.startLineNumber, selection.startColumn, selection.endColumn);
				hasRTL ||= this._lineIsRenderedRTL(selection.startLineNumber);
				if (!visibleRanges) {
					return null;
				}
				for (const visibleRange of visibleRanges.ranges) {
					boxStartX = Math.min(boxStartX, Math.round(visibleRange.left));
					boxEndX = Math.max(boxEndX, Math.round(visibleRange.left + visibleRange.width));
				}
			}
		}

		if (!horizontalRevealRequest.minimalReveal) {
			boxStartX = Math.max(0, boxStartX - ViewLines.HORIZONTAL_EXTRA_PX);
			boxEndX += this._revealHorizontalRightPadding;
		}

		if (horizontalRevealRequest.type === 'selections' && boxEndX - boxStartX > viewport.width) {
			return null;
		}

		const newScrollLeft = this._computeMinimumScrolling(viewportStartX, viewportEndX, boxStartX, boxEndX);
		return {
			scrollLeft: newScrollLeft,
			maxHorizontalOffset: boxEndX,
			hasRTL
		};
	}

	private _computeMinimumScrolling(viewportStart: number, viewportEnd: number, boxStart: number, boxEnd: number, revealAtStart?: boolean, revealAtEnd?: boolean): number {
		viewportStart = viewportStart | 0;
		viewportEnd = viewportEnd | 0;
		boxStart = boxStart | 0;
		boxEnd = boxEnd | 0;
		revealAtStart = !!revealAtStart;
		revealAtEnd = !!revealAtEnd;

		const viewportLength = viewportEnd - viewportStart;
		const boxLength = boxEnd - boxStart;

		if (boxLength < viewportLength) {
			// The box would fit in the viewport

			if (revealAtStart) {
				return boxStart;
			}

			if (revealAtEnd) {
				return Math.max(0, boxEnd - viewportLength);
			}

			if (boxStart < viewportStart) {
				// The box is above the viewport
				return boxStart;
			} else if (boxEnd > viewportEnd) {
				// The box is below the viewport
				return Math.max(0, boxEnd - viewportLength);
			}
		} else {
			// The box would not fit in the viewport
			// Reveal the beginning of the box
			return boxStart;
		}

		return viewportStart;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/browser/viewParts/viewLinesGpu/viewLinesGpu.ts]---
Location: vscode-main/src/vs/editor/browser/viewParts/viewLinesGpu/viewLinesGpu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getActiveWindow } from '../../../../base/browser/dom.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
import { autorun, runOnChange } from '../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import type { ViewportData } from '../../../common/viewLayout/viewLinesViewportData.js';
import type { ViewContext } from '../../../common/viewModel/viewContext.js';
import { TextureAtlasPage } from '../../gpu/atlas/textureAtlasPage.js';
import { BindingId, type IGpuRenderStrategy } from '../../gpu/gpu.js';
import { GPULifecycle } from '../../gpu/gpuDisposable.js';
import { quadVertices } from '../../gpu/gpuUtils.js';
import { ViewGpuContext } from '../../gpu/viewGpuContext.js';
import { FloatHorizontalRange, HorizontalPosition, HorizontalRange, IViewLines, LineVisibleRanges, RenderingContext, RestrictedRenderingContext, VisibleRanges } from '../../view/renderingContext.js';
import { ViewPart } from '../../view/viewPart.js';
import { ViewLineOptions } from '../viewLines/viewLineOptions.js';
import type * as viewEvents from '../../../common/viewEvents.js';
import { CursorColumns } from '../../../common/core/cursorColumns.js';
import { TextureAtlas } from '../../gpu/atlas/textureAtlas.js';
import { createContentSegmenter, type IContentSegmenter } from '../../gpu/contentSegmenter.js';
import { ViewportRenderStrategy } from '../../gpu/renderStrategy/viewportRenderStrategy.js';
import { FullFileRenderStrategy } from '../../gpu/renderStrategy/fullFileRenderStrategy.js';
import { MutableDisposable } from '../../../../base/common/lifecycle.js';
import type { ViewLineRenderingData } from '../../../common/viewModel.js';
import { GlyphRasterizer } from '../../gpu/raster/glyphRasterizer.js';

const enum GlyphStorageBufferInfo {
	FloatsPerEntry = 2 + 2 + 2,
	BytesPerEntry = GlyphStorageBufferInfo.FloatsPerEntry * 4,
	Offset_TexturePosition = 0,
	Offset_TextureSize = 2,
	Offset_OriginPosition = 4,
}

/**
 * The GPU implementation of the ViewLines part.
 */
export class ViewLinesGpu extends ViewPart implements IViewLines {

	private readonly canvas: HTMLCanvasElement;

	private _initViewportData?: ViewportData[];
	private _lastViewportData?: ViewportData;
	private _lastViewLineOptions?: ViewLineOptions;

	private _device!: GPUDevice;
	private _renderPassDescriptor!: GPURenderPassDescriptor;
	private _renderPassColorAttachment!: GPURenderPassColorAttachment;
	private _bindGroup!: GPUBindGroup;
	private _pipeline!: GPURenderPipeline;

	private _vertexBuffer!: GPUBuffer;

	private _glyphStorageBuffer!: GPUBuffer;
	private _atlasGpuTexture!: GPUTexture;
	private readonly _atlasGpuTextureVersions: number[] = [];

	private _initialized = false;

	private readonly _glyphRasterizer: MutableDisposable<GlyphRasterizer> = this._register(new MutableDisposable());
	private readonly _renderStrategy: MutableDisposable<IGpuRenderStrategy> = this._register(new MutableDisposable());
	private _rebuildBindGroup?: () => void;

	constructor(
		context: ViewContext,
		private readonly _viewGpuContext: ViewGpuContext,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ILogService private readonly _logService: ILogService,
	) {
		super(context);

		this.canvas = this._viewGpuContext.canvas.domNode;

		// Re-render the following frame after canvas device pixel dimensions change, provided a
		// new render does not occur.
		this._register(autorun(reader => {
			this._viewGpuContext.canvasDevicePixelDimensions.read(reader);
			const lastViewportData = this._lastViewportData;
			if (lastViewportData) {
				setTimeout(() => {
					if (lastViewportData === this._lastViewportData) {
						this.renderText(lastViewportData);
					}
				});
			}
		}));

		this.initWebgpu();
	}

	async initWebgpu() {
		// #region General

		this._device = ViewGpuContext.deviceSync || await ViewGpuContext.device;

		if (this._store.isDisposed) {
			return;
		}

		const atlas = ViewGpuContext.atlas;

		// Rerender when the texture atlas deletes glyphs
		this._register(atlas.onDidDeleteGlyphs(() => {
			this._atlasGpuTextureVersions.length = 0;
			this._atlasGpuTextureVersions[0] = 0;
			this._atlasGpuTextureVersions[1] = 0;
			this._renderStrategy.value!.reset();
		}));

		const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
		this._viewGpuContext.ctx.configure({
			device: this._device,
			format: presentationFormat,
			alphaMode: 'premultiplied',
		});

		this._renderPassColorAttachment = {
			view: null!, // Will be filled at render time
			loadOp: 'load',
			storeOp: 'store',
		};
		this._renderPassDescriptor = {
			label: 'Monaco render pass',
			colorAttachments: [this._renderPassColorAttachment],
		};

		// #endregion General

		// #region Uniforms

		let layoutInfoUniformBuffer: GPUBuffer;
		{
			const enum Info {
				FloatsPerEntry = 6,
				BytesPerEntry = Info.FloatsPerEntry * 4,
				Offset_CanvasWidth____ = 0,
				Offset_CanvasHeight___ = 1,
				Offset_ViewportOffsetX = 2,
				Offset_ViewportOffsetY = 3,
				Offset_ViewportWidth__ = 4,
				Offset_ViewportHeight_ = 5,
			}
			const bufferValues = new Float32Array(Info.FloatsPerEntry);
			const updateBufferValues = (canvasDevicePixelWidth: number = this.canvas.width, canvasDevicePixelHeight: number = this.canvas.height) => {
				bufferValues[Info.Offset_CanvasWidth____] = canvasDevicePixelWidth;
				bufferValues[Info.Offset_CanvasHeight___] = canvasDevicePixelHeight;
				bufferValues[Info.Offset_ViewportOffsetX] = Math.ceil(this._context.configuration.options.get(EditorOption.layoutInfo).contentLeft * getActiveWindow().devicePixelRatio);
				bufferValues[Info.Offset_ViewportOffsetY] = 0;
				bufferValues[Info.Offset_ViewportWidth__] = bufferValues[Info.Offset_CanvasWidth____] - bufferValues[Info.Offset_ViewportOffsetX];
				bufferValues[Info.Offset_ViewportHeight_] = bufferValues[Info.Offset_CanvasHeight___] - bufferValues[Info.Offset_ViewportOffsetY];
				return bufferValues;
			};
			layoutInfoUniformBuffer = this._register(GPULifecycle.createBuffer(this._device, {
				label: 'Monaco uniform buffer',
				size: Info.BytesPerEntry,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			}, () => updateBufferValues())).object;
			this._register(runOnChange(this._viewGpuContext.canvasDevicePixelDimensions, ({ width, height }) => {
				this._device.queue.writeBuffer(layoutInfoUniformBuffer, 0, updateBufferValues(width, height));
			}));
			this._register(runOnChange(this._viewGpuContext.contentLeft, () => {
				this._device.queue.writeBuffer(layoutInfoUniformBuffer, 0, updateBufferValues());
			}));
		}

		let atlasInfoUniformBuffer: GPUBuffer;
		{
			const enum Info {
				FloatsPerEntry = 2,
				BytesPerEntry = Info.FloatsPerEntry * 4,
				Offset_Width_ = 0,
				Offset_Height = 1,
			}
			atlasInfoUniformBuffer = this._register(GPULifecycle.createBuffer(this._device, {
				label: 'Monaco atlas info uniform buffer',
				size: Info.BytesPerEntry,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			}, () => {
				const values = new Float32Array(Info.FloatsPerEntry);
				values[Info.Offset_Width_] = atlas.pageSize;
				values[Info.Offset_Height] = atlas.pageSize;
				return values;
			})).object;
		}

		// #endregion Uniforms

		// #region Storage buffers

		const fontFamily = this._context.configuration.options.get(EditorOption.fontFamily);
		const fontSize = this._context.configuration.options.get(EditorOption.fontSize);
		this._glyphRasterizer.value = this._register(new GlyphRasterizer(fontSize, fontFamily, this._viewGpuContext.devicePixelRatio.get(), ViewGpuContext.decorationStyleCache));
		this._register(runOnChange(this._viewGpuContext.devicePixelRatio, () => {
			this._refreshGlyphRasterizer();
		}));


		this._renderStrategy.value = this._instantiationService.createInstance(FullFileRenderStrategy, this._context, this._viewGpuContext, this._device, this._glyphRasterizer as { value: GlyphRasterizer });
		// this._renderStrategy.value = this._instantiationService.createInstance(ViewportRenderStrategy, this._context, this._viewGpuContext, this._device);

		this._glyphStorageBuffer = this._register(GPULifecycle.createBuffer(this._device, {
			label: 'Monaco glyph storage buffer',
			size: TextureAtlas.maximumPageCount * (TextureAtlasPage.maximumGlyphCount * GlyphStorageBufferInfo.BytesPerEntry),
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
		})).object;
		this._atlasGpuTextureVersions[0] = 0;
		this._atlasGpuTextureVersions[1] = 0;
		this._atlasGpuTexture = this._register(GPULifecycle.createTexture(this._device, {
			label: 'Monaco atlas texture',
			format: 'rgba8unorm',
			size: { width: atlas.pageSize, height: atlas.pageSize, depthOrArrayLayers: TextureAtlas.maximumPageCount },
			dimension: '2d',
			usage: GPUTextureUsage.TEXTURE_BINDING |
				GPUTextureUsage.COPY_DST |
				GPUTextureUsage.RENDER_ATTACHMENT,
		})).object;

		this._updateAtlasStorageBufferAndTexture();

		// #endregion Storage buffers

		// #region Vertex buffer

		this._vertexBuffer = this._register(GPULifecycle.createBuffer(this._device, {
			label: 'Monaco vertex buffer',
			size: quadVertices.byteLength,
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
		}, quadVertices)).object;

		// #endregion Vertex buffer

		// #region Shader module

		const module = this._device.createShaderModule({
			label: 'Monaco shader module',
			code: this._renderStrategy.value.wgsl,
		});

		// #endregion Shader module

		// #region Pipeline

		this._pipeline = this._device.createRenderPipeline({
			label: 'Monaco render pipeline',
			layout: 'auto',
			vertex: {
				module,
				buffers: [
					{
						arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT, // 2 floats, 4 bytes each
						attributes: [
							{ shaderLocation: 0, offset: 0, format: 'float32x2' },  // position
						],
					}
				]
			},
			fragment: {
				module,
				targets: [
					{
						format: presentationFormat,
						blend: {
							color: {
								srcFactor: 'src-alpha',
								dstFactor: 'one-minus-src-alpha'
							},
							alpha: {
								srcFactor: 'src-alpha',
								dstFactor: 'one-minus-src-alpha'
							},
						},
					}
				],
			},
		});

		// #endregion Pipeline

		// #region Bind group

		this._rebuildBindGroup = () => {
			this._bindGroup = this._device.createBindGroup({
				label: 'Monaco bind group',
				layout: this._pipeline.getBindGroupLayout(0),
				entries: [
					// TODO: Pass in generically as array?
					{ binding: BindingId.GlyphInfo, resource: { buffer: this._glyphStorageBuffer } },
					{
						binding: BindingId.TextureSampler, resource: this._device.createSampler({
							label: 'Monaco atlas sampler',
							magFilter: 'nearest',
							minFilter: 'nearest',
						})
					},
					{ binding: BindingId.Texture, resource: this._atlasGpuTexture.createView() },
					{ binding: BindingId.LayoutInfoUniform, resource: { buffer: layoutInfoUniformBuffer } },
					{ binding: BindingId.AtlasDimensionsUniform, resource: { buffer: atlasInfoUniformBuffer } },
					...this._renderStrategy.value!.bindGroupEntries
				],
			});
		};
		this._rebuildBindGroup();

		// endregion Bind group

		this._initialized = true;

		// Render the initial viewport immediately after initialization
		if (this._initViewportData) {
			// HACK: Rendering multiple times in the same frame like this isn't ideal, but there
			//       isn't an easy way to merge viewport data
			for (const viewportData of this._initViewportData) {
				this.renderText(viewportData);
			}
			this._initViewportData = undefined;
		}
	}

	private _refreshRenderStrategy(viewportData: ViewportData) {
		if (this._renderStrategy.value?.type === 'viewport') {
			return;
		}
		if (viewportData.endLineNumber < FullFileRenderStrategy.maxSupportedLines && this._viewportMaxColumn(viewportData) < FullFileRenderStrategy.maxSupportedColumns) {
			return;
		}
		this._logService.trace(`File is larger than ${FullFileRenderStrategy.maxSupportedLines} lines or ${FullFileRenderStrategy.maxSupportedColumns} columns, switching to viewport render strategy`);
		const viewportRenderStrategy = this._instantiationService.createInstance(ViewportRenderStrategy, this._context, this._viewGpuContext, this._device, this._glyphRasterizer as { value: GlyphRasterizer });
		this._renderStrategy.value = viewportRenderStrategy;
		this._register(viewportRenderStrategy.onDidChangeBindGroupEntries(() => this._rebuildBindGroup?.()));
		this._rebuildBindGroup?.();
	}

	private _viewportMaxColumn(viewportData: ViewportData): number {
		let maxColumn = 0;
		let lineData: ViewLineRenderingData;
		for (let i = viewportData.startLineNumber; i <= viewportData.endLineNumber; i++) {
			lineData = viewportData.getViewLineRenderingData(i);
			maxColumn = Math.max(maxColumn, lineData.maxColumn);
		}
		return maxColumn;
	}

	private _updateAtlasStorageBufferAndTexture() {
		for (const [layerIndex, page] of ViewGpuContext.atlas.pages.entries()) {
			if (layerIndex >= TextureAtlas.maximumPageCount) {
				console.log(`Attempt to upload atlas page [${layerIndex}], only ${TextureAtlas.maximumPageCount} are supported currently`);
				continue;
			}

			// Skip the update if it's already the latest version
			if (page.version === this._atlasGpuTextureVersions[layerIndex]) {
				continue;
			}

			this._logService.trace('Updating atlas page[', layerIndex, '] from version ', this._atlasGpuTextureVersions[layerIndex], ' to version ', page.version);

			const entryCount = GlyphStorageBufferInfo.FloatsPerEntry * TextureAtlasPage.maximumGlyphCount;
			const values = new Float32Array(entryCount);
			let entryOffset = 0;
			for (const glyph of page.glyphs) {
				values[entryOffset + GlyphStorageBufferInfo.Offset_TexturePosition] = glyph.x;
				values[entryOffset + GlyphStorageBufferInfo.Offset_TexturePosition + 1] = glyph.y;
				values[entryOffset + GlyphStorageBufferInfo.Offset_TextureSize] = glyph.w;
				values[entryOffset + GlyphStorageBufferInfo.Offset_TextureSize + 1] = glyph.h;
				values[entryOffset + GlyphStorageBufferInfo.Offset_OriginPosition] = glyph.originOffsetX;
				values[entryOffset + GlyphStorageBufferInfo.Offset_OriginPosition + 1] = glyph.originOffsetY;
				entryOffset += GlyphStorageBufferInfo.FloatsPerEntry;
			}
			if (entryOffset / GlyphStorageBufferInfo.FloatsPerEntry > TextureAtlasPage.maximumGlyphCount) {
				throw new Error(`Attempting to write more glyphs (${entryOffset / GlyphStorageBufferInfo.FloatsPerEntry}) than the GPUBuffer can hold (${TextureAtlasPage.maximumGlyphCount})`);
			}
			this._device.queue.writeBuffer(
				this._glyphStorageBuffer,
				layerIndex * GlyphStorageBufferInfo.FloatsPerEntry * TextureAtlasPage.maximumGlyphCount * Float32Array.BYTES_PER_ELEMENT,
				values,
				0,
				GlyphStorageBufferInfo.FloatsPerEntry * TextureAtlasPage.maximumGlyphCount
			);
			if (page.usedArea.right - page.usedArea.left > 0 && page.usedArea.bottom - page.usedArea.top > 0) {
				this._device.queue.copyExternalImageToTexture(
					{ source: page.source },
					{
						texture: this._atlasGpuTexture,
						origin: {
							x: page.usedArea.left,
							y: page.usedArea.top,
							z: layerIndex
						}
					},
					{
						width: page.usedArea.right - page.usedArea.left + 1,
						height: page.usedArea.bottom - page.usedArea.top + 1
					},
				);
			}
			this._atlasGpuTextureVersions[layerIndex] = page.version;
		}
	}

	public prepareRender(ctx: RenderingContext): void {
		throw new BugIndicatingError('Should not be called');
	}

	public override render(ctx: RestrictedRenderingContext): void {
		throw new BugIndicatingError('Should not be called');
	}

	// #region Event handlers

	// Since ViewLinesGpu currently coordinates rendering to the canvas, it must listen to all
	// changed events that any GPU part listens to. This is because any drawing to the canvas will
	// clear it for that frame, so all parts must be rendered every time.
	//
	// Additionally, since this is intrinsically linked to ViewLines, it must also listen to events
	// from that side. Luckily rendering is cheap, it's only when uploaded data changes does it
	// start to cost.

	override onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean {
		this._refreshGlyphRasterizer();
		return true;
	}
	override onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean { return true; }
	override onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean { return true; }
	override onFlushed(e: viewEvents.ViewFlushedEvent): boolean { return true; }

	override onLinesChanged(e: viewEvents.ViewLinesChangedEvent): boolean { return true; }
	override onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean { return true; }
	override onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean { return true; }
	override onLineMappingChanged(e: viewEvents.ViewLineMappingChangedEvent): boolean { return true; }
	override onRevealRangeRequest(e: viewEvents.ViewRevealRangeRequestEvent): boolean { return true; }
	override onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean { return true; }
	override onThemeChanged(e: viewEvents.ViewThemeChangedEvent): boolean { return true; }
	override onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean { return true; }

	// #endregion

	private _refreshGlyphRasterizer() {
		const glyphRasterizer = this._glyphRasterizer.value;
		if (!glyphRasterizer) {
			return;
		}
		const fontFamily = this._context.configuration.options.get(EditorOption.fontFamily);
		const fontSize = this._context.configuration.options.get(EditorOption.fontSize);
		const devicePixelRatio = this._viewGpuContext.devicePixelRatio.get();
		if (
			glyphRasterizer.fontFamily !== fontFamily ||
			glyphRasterizer.fontSize !== fontSize ||
			glyphRasterizer.devicePixelRatio !== devicePixelRatio
		) {
			this._glyphRasterizer.value = new GlyphRasterizer(fontSize, fontFamily, devicePixelRatio, ViewGpuContext.decorationStyleCache);
		}
	}

	public renderText(viewportData: ViewportData): void {
		if (this._initialized) {
			this._refreshRenderStrategy(viewportData);
			return this._renderText(viewportData);
		} else {
			this._initViewportData = this._initViewportData ?? [];
			this._initViewportData.push(viewportData);
		}
	}

	private _renderText(viewportData: ViewportData): void {
		this._viewGpuContext.rectangleRenderer.draw(viewportData);

		const options = new ViewLineOptions(this._context.configuration, this._context.theme.type);

		this._renderStrategy.value!.update(viewportData, options);

		this._updateAtlasStorageBufferAndTexture();

		const encoder = this._device.createCommandEncoder({ label: 'Monaco command encoder' });

		this._renderPassColorAttachment.view = this._viewGpuContext.ctx.getCurrentTexture().createView({ label: 'Monaco canvas texture view' });
		const pass = encoder.beginRenderPass(this._renderPassDescriptor);
		pass.setPipeline(this._pipeline);
		pass.setVertexBuffer(0, this._vertexBuffer);

		// Only draw the content area
		const contentLeft = Math.ceil(this._viewGpuContext.contentLeft.get() * this._viewGpuContext.devicePixelRatio.get());
		pass.setScissorRect(contentLeft, 0, this.canvas.width - contentLeft, this.canvas.height);

		pass.setBindGroup(0, this._bindGroup);

		this._renderStrategy.value!.draw(pass, viewportData);

		pass.end();

		const commandBuffer = encoder.finish();

		this._device.queue.submit([commandBuffer]);

		this._lastViewportData = viewportData;
		this._lastViewLineOptions = options;
	}

	linesVisibleRangesForRange(_range: Range, includeNewLines: boolean): LineVisibleRanges[] | null {
		if (!this._lastViewportData) {
			return null;
		}
		const originalEndLineNumber = _range.endLineNumber;
		const range = Range.intersectRanges(_range, this._lastViewportData.visibleRange);
		if (!range) {
			return null;
		}

		const rendStartLineNumber = this._lastViewportData.startLineNumber;
		const rendEndLineNumber = this._lastViewportData.endLineNumber;

		const viewportData = this._lastViewportData;
		const viewLineOptions = this._lastViewLineOptions;

		if (!viewportData || !viewLineOptions) {
			return null;
		}

		const visibleRanges: LineVisibleRanges[] = [];

		let nextLineModelLineNumber: number = 0;
		if (includeNewLines) {
			nextLineModelLineNumber = this._context.viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(range.startLineNumber, 1)).lineNumber;
		}

		for (let lineNumber = range.startLineNumber; lineNumber <= range.endLineNumber; lineNumber++) {

			if (lineNumber < rendStartLineNumber || lineNumber > rendEndLineNumber) {
				continue;
			}
			const startColumn = lineNumber === range.startLineNumber ? range.startColumn : 1;
			const continuesInNextLine = lineNumber !== originalEndLineNumber;
			const endColumn = continuesInNextLine ? this._context.viewModel.getLineMaxColumn(lineNumber) : range.endColumn;

			const visibleRangesForLine = this._visibleRangesForLineRange(lineNumber, startColumn, endColumn);

			if (!visibleRangesForLine) {
				continue;
			}

			if (includeNewLines && lineNumber < originalEndLineNumber) {
				const currentLineModelLineNumber = nextLineModelLineNumber;
				nextLineModelLineNumber = this._context.viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(lineNumber + 1, 1)).lineNumber;

				if (currentLineModelLineNumber !== nextLineModelLineNumber) {
					visibleRangesForLine.ranges[visibleRangesForLine.ranges.length - 1].width += viewLineOptions.spaceWidth;
				}
			}

			visibleRanges.push(new LineVisibleRanges(visibleRangesForLine.outsideRenderedLine, lineNumber, HorizontalRange.from(visibleRangesForLine.ranges), continuesInNextLine));
		}

		if (visibleRanges.length === 0) {
			return null;
		}

		return visibleRanges;
	}

	private _visibleRangesForLineRange(lineNumber: number, startColumn: number, endColumn: number): VisibleRanges | null {
		if (this.shouldRender()) {
			// Cannot read from the DOM because it is dirty
			// i.e. the model & the dom are out of sync, so I'd be reading something stale
			return null;
		}

		const viewportData = this._lastViewportData;
		const viewLineOptions = this._lastViewLineOptions;

		if (!viewportData || !viewLineOptions || lineNumber < viewportData.startLineNumber || lineNumber > viewportData.endLineNumber) {
			return null;
		}

		// Resolve tab widths for this line
		const lineData = viewportData.getViewLineRenderingData(lineNumber);
		const content = lineData.content;

		let contentSegmenter: IContentSegmenter | undefined;
		if (!(lineData.isBasicASCII && viewLineOptions.useMonospaceOptimizations)) {
			contentSegmenter = createContentSegmenter(lineData, viewLineOptions);
		}

		let chars: string | undefined = '';

		let resolvedStartColumn = 0;
		let resolvedStartCssPixelOffset = 0;
		for (let x = 0; x < startColumn - 1; x++) {
			if (lineData.isBasicASCII && viewLineOptions.useMonospaceOptimizations) {
				chars = content.charAt(x);
			} else {
				chars = contentSegmenter!.getSegmentAtIndex(x);
				if (chars === undefined) {
					continue;
				}
				resolvedStartCssPixelOffset += (this._renderStrategy.value!.glyphRasterizer.getTextMetrics(chars).width / getActiveWindow().devicePixelRatio) - viewLineOptions.spaceWidth;
			}
			if (chars === '\t') {
				resolvedStartColumn = CursorColumns.nextRenderTabStop(resolvedStartColumn, lineData.tabSize);
			} else {
				resolvedStartColumn++;
			}
		}
		let resolvedEndColumn = resolvedStartColumn;
		let resolvedEndCssPixelOffset = 0;
		for (let x = startColumn - 1; x < endColumn - 1; x++) {
			if (lineData.isBasicASCII && viewLineOptions.useMonospaceOptimizations) {
				chars = content.charAt(x);
			} else {
				chars = contentSegmenter!.getSegmentAtIndex(x);
				if (chars === undefined) {
					continue;
				}
				resolvedEndCssPixelOffset += (this._renderStrategy.value!.glyphRasterizer.getTextMetrics(chars).width / getActiveWindow().devicePixelRatio) - viewLineOptions.spaceWidth;
			}
			if (chars === '\t') {
				resolvedEndColumn = CursorColumns.nextRenderTabStop(resolvedEndColumn, lineData.tabSize);
			} else {
				resolvedEndColumn++;
			}
		}

		// Visible horizontal range in _scaled_ pixels
		const result = new VisibleRanges(false, [new FloatHorizontalRange(
			resolvedStartColumn * viewLineOptions.spaceWidth + resolvedStartCssPixelOffset,
			(resolvedEndColumn - resolvedStartColumn) * viewLineOptions.spaceWidth + resolvedEndCssPixelOffset)
		]);

		return result;
	}

	visibleRangeForPosition(position: Position): HorizontalPosition | null {
		const visibleRanges = this._visibleRangesForLineRange(position.lineNumber, position.column, position.column);
		if (!visibleRanges) {
			return null;
		}
		return new HorizontalPosition(visibleRanges.outsideRenderedLine, visibleRanges.ranges[0].left);
	}

	getLineWidth(lineNumber: number): number | undefined {
		if (!this._lastViewportData || !this._lastViewLineOptions) {
			return undefined;
		}
		if (!this._viewGpuContext.canRender(this._lastViewLineOptions, this._lastViewportData, lineNumber)) {
			return undefined;
		}

		const lineData = this._lastViewportData.getViewLineRenderingData(lineNumber);
		const lineRange = this._visibleRangesForLineRange(lineNumber, 1, lineData.maxColumn);
		const lastRange = lineRange?.ranges.at(-1);
		if (lastRange) {
			return lastRange.width;
		}

		return undefined;
	}

	getPositionAtCoordinate(lineNumber: number, mouseContentHorizontalOffset: number): Position | undefined {
		if (!this._lastViewportData || !this._lastViewLineOptions) {
			return undefined;
		}
		if (!this._viewGpuContext.canRender(this._lastViewLineOptions, this._lastViewportData, lineNumber)) {
			return undefined;
		}
		const lineData = this._lastViewportData.getViewLineRenderingData(lineNumber);
		const content = lineData.content;
		const dpr = getActiveWindow().devicePixelRatio;
		const mouseContentHorizontalOffsetDevicePixels = mouseContentHorizontalOffset * dpr;
		const spaceWidthDevicePixels = this._lastViewLineOptions.spaceWidth * dpr;
		const contentSegmenter = createContentSegmenter(lineData, this._lastViewLineOptions);

		let widthSoFar = 0;
		let charWidth = 0;
		let tabXOffset = 0;
		let column = 0;
		for (let x = 0; x < content.length; x++) {
			const chars = contentSegmenter.getSegmentAtIndex(x);

			// Part of an earlier segment
			if (chars === undefined) {
				column++;
				continue;
			}

			// Get the width of the character
			if (chars === '\t') {
				// Find the pixel offset between the current position and the next tab stop
				const offsetBefore = x + tabXOffset;
				tabXOffset = CursorColumns.nextRenderTabStop(x + tabXOffset, lineData.tabSize);
				charWidth = spaceWidthDevicePixels * (tabXOffset - offsetBefore);
				// Convert back to offset excluding x and the current character
				tabXOffset -= x + 1;
			} else if (lineData.isBasicASCII && this._lastViewLineOptions.useMonospaceOptimizations) {
				charWidth = spaceWidthDevicePixels;
			} else {
				charWidth = this._renderStrategy.value!.glyphRasterizer.getTextMetrics(chars).width;
			}

			if (mouseContentHorizontalOffsetDevicePixels < widthSoFar + charWidth / 2) {
				break;
			}

			widthSoFar += charWidth;
			column++;
		}

		return new Position(lineNumber, column + 1);
	}
}
```

--------------------------------------------------------------------------------

````

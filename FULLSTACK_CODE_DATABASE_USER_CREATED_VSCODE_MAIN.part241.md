---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 241
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 241 of 552)

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

---[FILE: src/vs/editor/contrib/zoneWidget/browser/zoneWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/zoneWidget/browser/zoneWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import * as domStylesheetsJs from '../../../../base/browser/domStylesheets.js';
import { IHorizontalSashLayoutProvider, ISashEvent, Orientation, Sash, SashState } from '../../../../base/browser/ui/sash/sash.js';
import { Color, RGBA } from '../../../../base/common/color.js';
import { IdGenerator } from '../../../../base/common/idGenerator.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import * as objects from '../../../../base/common/objects.js';
import './zoneWidget.css';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition, IViewZone, IViewZoneChangeAccessor } from '../../../browser/editorBrowser.js';
import { EditorLayoutInfo, EditorOption } from '../../../common/config/editorOptions.js';
import { IPosition, Position } from '../../../common/core/position.js';
import { IRange, Range } from '../../../common/core/range.js';
import { IEditorDecorationsCollection, ScrollType } from '../../../common/editorCommon.js';
import { TrackedRangeStickiness } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';

export interface IOptions {
	showFrame?: boolean;
	showArrow?: boolean;
	frameWidth?: number;
	className?: string;
	isAccessible?: boolean;
	isResizeable?: boolean;
	frameColor?: Color | string;
	arrowColor?: Color;
	keepEditorSelection?: boolean;
	ordinal?: number;
	showInHiddenAreas?: boolean;
}

export interface IStyles {
	frameColor?: Color | string | null;
	arrowColor?: Color | null;
}

const defaultColor = new Color(new RGBA(0, 122, 204));

const defaultOptions: IOptions = {
	showArrow: true,
	showFrame: true,
	className: '',
	frameColor: defaultColor,
	arrowColor: defaultColor,
	keepEditorSelection: false
};

const WIDGET_ID = 'vs.editor.contrib.zoneWidget';

class ViewZoneDelegate implements IViewZone {

	domNode: HTMLElement;
	id: string = ''; // A valid zone id should be greater than 0
	afterLineNumber: number;
	afterColumn: number;
	heightInLines: number;
	readonly showInHiddenAreas: boolean | undefined;
	readonly ordinal: number | undefined;

	private readonly _onDomNodeTop: (top: number) => void;
	private readonly _onComputedHeight: (height: number) => void;

	constructor(domNode: HTMLElement, afterLineNumber: number, afterColumn: number, heightInLines: number,
		onDomNodeTop: (top: number) => void,
		onComputedHeight: (height: number) => void,
		showInHiddenAreas: boolean | undefined,
		ordinal: number | undefined
	) {
		this.domNode = domNode;
		this.afterLineNumber = afterLineNumber;
		this.afterColumn = afterColumn;
		this.heightInLines = heightInLines;
		this.showInHiddenAreas = showInHiddenAreas;
		this.ordinal = ordinal;
		this._onDomNodeTop = onDomNodeTop;
		this._onComputedHeight = onComputedHeight;
	}

	onDomNodeTop(top: number): void {
		this._onDomNodeTop(top);
	}

	onComputedHeight(height: number): void {
		this._onComputedHeight(height);
	}
}

export class OverlayWidgetDelegate implements IOverlayWidget {

	private readonly _id: string;
	private readonly _domNode: HTMLElement;

	constructor(id: string, domNode: HTMLElement) {
		this._id = id;
		this._domNode = domNode;
	}

	getId(): string {
		return this._id;
	}

	getDomNode(): HTMLElement {
		return this._domNode;
	}

	getPosition(): IOverlayWidgetPosition | null {
		return null;
	}
}

class Arrow {

	private static readonly _IdGenerator = new IdGenerator('.arrow-decoration-');

	private readonly _ruleName = Arrow._IdGenerator.nextId();
	private readonly _decorations: IEditorDecorationsCollection;
	private _color: string | null = null;
	private _height: number = -1;

	constructor(
		private readonly _editor: ICodeEditor
	) {
		this._decorations = this._editor.createDecorationsCollection();
	}

	dispose(): void {
		this.hide();
		domStylesheetsJs.removeCSSRulesContainingSelector(this._ruleName);
	}

	set color(value: string) {
		if (this._color !== value) {
			this._color = value;
			this._updateStyle();
		}
	}

	set height(value: number) {
		if (this._height !== value) {
			this._height = value;
			this._updateStyle();
		}
	}

	private _updateStyle(): void {
		domStylesheetsJs.removeCSSRulesContainingSelector(this._ruleName);
		domStylesheetsJs.createCSSRule(
			`.monaco-editor ${this._ruleName}`,
			`border-style: solid; border-color: transparent; border-bottom-color: ${this._color}; border-width: ${this._height}px; bottom: -${this._height}px !important; margin-left: -${this._height}px; `
		);
	}

	show(where: IPosition): void {

		if (where.column === 1) {
			// the arrow isn't pretty at column 1 and we need to push it out a little
			where = { lineNumber: where.lineNumber, column: 2 };
		}

		this._decorations.set([{
			range: Range.fromPositions(where),
			options: {
				description: 'zone-widget-arrow',
				className: this._ruleName,
				stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
			}
		}]);
	}

	hide(): void {
		this._decorations.clear();
	}
}

export abstract class ZoneWidget implements IHorizontalSashLayoutProvider {

	private _arrow: Arrow | null = null;
	private _overlayWidget: OverlayWidgetDelegate | null = null;
	private _resizeSash: Sash | null = null;
	private _isSashResizeHeight: boolean = false;
	private readonly _positionMarkerId: IEditorDecorationsCollection;

	protected _viewZone: ViewZoneDelegate | null = null;
	protected readonly _disposables = new DisposableStore();

	container: HTMLElement | null = null;
	domNode: HTMLElement;
	editor: ICodeEditor;
	options: IOptions;


	constructor(editor: ICodeEditor, options: IOptions = {}) {
		this.editor = editor;
		this._positionMarkerId = this.editor.createDecorationsCollection();
		this.options = objects.deepClone(options);
		objects.mixin(this.options, defaultOptions, false);
		this.domNode = document.createElement('div');
		if (!this.options.isAccessible) {
			this.domNode.setAttribute('aria-hidden', 'true');
			this.domNode.setAttribute('role', 'presentation');
		}

		this._disposables.add(this.editor.onDidLayoutChange((info: EditorLayoutInfo) => {
			const width = this._getWidth(info);
			this.domNode.style.width = width + 'px';
			this.domNode.style.left = this._getLeft(info) + 'px';
			this._onWidth(width);
		}));
	}

	dispose(): void {
		if (this._overlayWidget) {
			this.editor.removeOverlayWidget(this._overlayWidget);
			this._overlayWidget = null;
		}

		if (this._viewZone) {
			this.editor.changeViewZones(accessor => {
				if (this._viewZone) {
					accessor.removeZone(this._viewZone.id);
				}
				this._viewZone = null;
			});
		}

		this._positionMarkerId.clear();

		this._disposables.dispose();
	}

	create(): void {

		this.domNode.classList.add('zone-widget');
		if (this.options.className) {
			this.domNode.classList.add(this.options.className);
		}

		this.container = document.createElement('div');
		this.container.classList.add('zone-widget-container');
		this.domNode.appendChild(this.container);
		if (this.options.showArrow) {
			this._arrow = new Arrow(this.editor);
			this._disposables.add(this._arrow);
		}
		this._fillContainer(this.container);
		this._initSash();
		this._applyStyles();
	}

	style(styles: IStyles): void {
		if (styles.frameColor) {
			this.options.frameColor = styles.frameColor;
		}
		if (styles.arrowColor) {
			this.options.arrowColor = styles.arrowColor;
		}
		this._applyStyles();
	}

	protected _applyStyles(): void {
		if (this.container && this.options.frameColor) {
			const frameColor = this.options.frameColor.toString();
			this.container.style.borderTopColor = frameColor;
			this.container.style.borderBottomColor = frameColor;
		}
		if (this._arrow && this.options.arrowColor) {
			const arrowColor = this.options.arrowColor.toString();
			this._arrow.color = arrowColor;
		}
	}

	protected _getWidth(info: EditorLayoutInfo): number {
		return info.width - info.minimap.minimapWidth - info.verticalScrollbarWidth;
	}

	private _getLeft(info: EditorLayoutInfo): number {
		// If minimap is to the left, we move beyond it
		if (info.minimap.minimapWidth > 0 && info.minimap.minimapLeft === 0) {
			return info.minimap.minimapWidth;
		}
		return 0;
	}

	private _onViewZoneTop(top: number): void {
		this.domNode.style.top = top + 'px';
	}

	private _onViewZoneHeight(height: number): void {
		this.domNode.style.height = `${height}px`;

		if (this.container) {
			const containerHeight = height - this._decoratingElementsHeight();
			this.container.style.height = `${containerHeight}px`;
			const layoutInfo = this.editor.getLayoutInfo();
			this._doLayout(containerHeight, this._getWidth(layoutInfo));
		}

		this._resizeSash?.layout();
	}

	get position(): Position | undefined {
		const range = this._positionMarkerId.getRange(0);
		if (!range) {
			return undefined;
		}
		return range.getStartPosition();
	}

	hasFocus() {
		return this.domNode.contains(dom.getActiveElement());
	}

	protected _isShowing: boolean = false;

	show(rangeOrPos: IRange | IPosition, heightInLines: number): void {
		const range = Range.isIRange(rangeOrPos) ? Range.lift(rangeOrPos) : Range.fromPositions(rangeOrPos);
		this._isShowing = true;
		this._showImpl(range, heightInLines);
		this._isShowing = false;
		this._positionMarkerId.set([{ range, options: ModelDecorationOptions.EMPTY }]);
	}

	updatePositionAndHeight(rangeOrPos: IRange | IPosition, heightInLines?: number): void {
		if (this._viewZone) {
			rangeOrPos = Range.isIRange(rangeOrPos) ? Range.getStartPosition(rangeOrPos) : rangeOrPos;
			this._viewZone.afterLineNumber = rangeOrPos.lineNumber;
			this._viewZone.afterColumn = rangeOrPos.column;
			this._viewZone.heightInLines = heightInLines ?? this._viewZone.heightInLines;

			this.editor.changeViewZones(accessor => {
				accessor.layoutZone(this._viewZone!.id);
			});
			this._positionMarkerId.set([{
				range: Range.isIRange(rangeOrPos) ? rangeOrPos : Range.fromPositions(rangeOrPos),
				options: ModelDecorationOptions.EMPTY
			}]);
			this._updateSashEnablement();
		}
	}

	hide(): void {
		if (this._viewZone) {
			this.editor.changeViewZones(accessor => {
				if (this._viewZone) {
					accessor.removeZone(this._viewZone.id);
				}
			});
			this._viewZone = null;
		}
		if (this._overlayWidget) {
			this.editor.removeOverlayWidget(this._overlayWidget);
			this._overlayWidget = null;
		}
		this._arrow?.hide();
		this._positionMarkerId.clear();
		this._isSashResizeHeight = false;
	}

	protected _decoratingElementsHeight(): number {
		const lineHeight = this.editor.getOption(EditorOption.lineHeight);
		let result = 0;

		if (this.options.showArrow) {
			const arrowHeight = Math.round(lineHeight / 3);
			result += 2 * arrowHeight;
		}

		if (this.options.showFrame) {
			const frameThickness = this.options.frameWidth ?? Math.round(lineHeight / 9);
			result += 2 * frameThickness;
		}

		return result;
	}

	/** Gets the maximum widget height in lines. */
	protected _getMaximumHeightInLines(): number | undefined {
		return Math.max(12, (this.editor.getLayoutInfo().height / this.editor.getOption(EditorOption.lineHeight)) * 0.8);
	}

	private _showImpl(where: Range, heightInLines: number): void {
		const position = where.getStartPosition();
		const layoutInfo = this.editor.getLayoutInfo();
		const width = this._getWidth(layoutInfo);
		this.domNode.style.width = `${width}px`;
		this.domNode.style.left = this._getLeft(layoutInfo) + 'px';

		// Render the widget as zone (rendering) and widget (lifecycle)
		const viewZoneDomNode = document.createElement('div');
		viewZoneDomNode.style.overflow = 'hidden';
		const lineHeight = this.editor.getOption(EditorOption.lineHeight);

		// adjust heightInLines to viewport
		const maxHeightInLines = this._getMaximumHeightInLines();
		if (maxHeightInLines !== undefined) {
			heightInLines = Math.min(heightInLines, maxHeightInLines);
		}

		let arrowHeight = 0;
		let frameThickness = 0;

		// Render the arrow one 1/3 of an editor line height
		if (this._arrow && this.options.showArrow) {
			arrowHeight = Math.round(lineHeight / 3);
			this._arrow.height = arrowHeight;
			this._arrow.show(position);
		}

		// Render the frame as 1/9 of an editor line height
		if (this.options.showFrame) {
			frameThickness = Math.round(lineHeight / 9);
		}

		// insert zone widget
		this.editor.changeViewZones((accessor: IViewZoneChangeAccessor) => {
			if (this._viewZone) {
				accessor.removeZone(this._viewZone.id);
			}
			if (this._overlayWidget) {
				this.editor.removeOverlayWidget(this._overlayWidget);
				this._overlayWidget = null;
			}
			this.domNode.style.top = '-1000px';
			this._viewZone = new ViewZoneDelegate(
				viewZoneDomNode,
				position.lineNumber,
				position.column,
				heightInLines,
				(top: number) => this._onViewZoneTop(top),
				(height: number) => this._onViewZoneHeight(height),
				this.options.showInHiddenAreas,
				this.options.ordinal
			);
			this._viewZone.id = accessor.addZone(this._viewZone);
			this._overlayWidget = new OverlayWidgetDelegate(WIDGET_ID + this._viewZone.id, this.domNode);
			this.editor.addOverlayWidget(this._overlayWidget);
		});
		this._updateSashEnablement();

		if (this.container && this.options.showFrame) {
			const width = this.options.frameWidth ? this.options.frameWidth : frameThickness;
			this.container.style.borderTopWidth = width + 'px';
			this.container.style.borderBottomWidth = width + 'px';
		}

		const containerHeight = heightInLines * lineHeight - this._decoratingElementsHeight();

		if (this.container) {
			this.container.style.top = arrowHeight + 'px';
			this.container.style.height = containerHeight + 'px';
			this.container.style.overflow = 'hidden';
		}

		this._doLayout(containerHeight, width);

		if (!this.options.keepEditorSelection) {
			this.editor.setSelection(where);
		}

		const model = this.editor.getModel();
		if (model) {
			const range = model.validateRange(new Range(where.startLineNumber, 1, where.endLineNumber + 1, 1));
			this.revealRange(range, range.startLineNumber === model.getLineCount());
		}
	}

	protected revealRange(range: Range, isLastLine: boolean) {
		if (isLastLine) {
			this.editor.revealLineNearTop(range.endLineNumber, ScrollType.Smooth);
		} else {
			this.editor.revealRange(range, ScrollType.Smooth);
		}
	}

	protected setCssClass(className: string, classToReplace?: string): void {
		if (!this.container) {
			return;
		}

		if (classToReplace) {
			this.container.classList.remove(classToReplace);
		}

		this.container.classList.add(className);

	}

	protected abstract _fillContainer(container: HTMLElement): void;

	protected _onWidth(widthInPixel: number): void {
		// implement in subclass
	}

	protected _doLayout(heightInPixel: number, widthInPixel: number): void {
		// implement in subclass
	}

	protected _relayout(_newHeightInLines: number, useMax?: boolean): void {
		const maxHeightInLines = this._getMaximumHeightInLines();
		const newHeightInLines = (useMax && (maxHeightInLines !== undefined)) ? Math.min(maxHeightInLines, _newHeightInLines) : _newHeightInLines;
		if (this._viewZone && this._viewZone.heightInLines !== newHeightInLines) {
			this.editor.changeViewZones(accessor => {
				if (this._viewZone) {
					this._viewZone.heightInLines = newHeightInLines;
					accessor.layoutZone(this._viewZone.id);
				}
			});
			this._updateSashEnablement();
		}
	}

	// --- sash

	private _initSash(): void {
		if (this._resizeSash) {
			return;
		}
		this._resizeSash = this._disposables.add(new Sash(this.domNode, this, { orientation: Orientation.HORIZONTAL }));

		if (!this.options.isResizeable) {
			this._resizeSash.state = SashState.Disabled;
		}

		let data: { startY: number; heightInLines: number; minLines: number; maxLines: number } | undefined;
		this._disposables.add(this._resizeSash.onDidStart((e: ISashEvent) => {
			if (this._viewZone) {
				data = {
					startY: e.startY,
					heightInLines: this._viewZone.heightInLines,
					... this._getResizeBounds()
				};
			}
		}));

		this._disposables.add(this._resizeSash.onDidEnd(() => {
			data = undefined;
		}));

		this._disposables.add(this._resizeSash.onDidChange((evt: ISashEvent) => {
			if (data) {
				const lineDelta = (evt.currentY - data.startY) / this.editor.getOption(EditorOption.lineHeight);
				const roundedLineDelta = lineDelta < 0 ? Math.ceil(lineDelta) : Math.floor(lineDelta);
				const newHeightInLines = data.heightInLines + roundedLineDelta;

				if (newHeightInLines > data.minLines && newHeightInLines < data.maxLines) {
					this._isSashResizeHeight = true;
					this._relayout(newHeightInLines);
				}
			}
		}));
	}

	private _updateSashEnablement(): void {
		if (this._resizeSash) {
			const { minLines, maxLines } = this._getResizeBounds();
			this._resizeSash.state = minLines === maxLines ? SashState.Disabled : SashState.Enabled;
		}
	}

	protected get _usesResizeHeight(): boolean {
		return this._isSashResizeHeight;
	}

	protected _getResizeBounds(): { readonly minLines: number; readonly maxLines: number } {
		return { minLines: 5, maxLines: 35 };
	}

	getHorizontalSashLeft() {
		return 0;
	}

	getHorizontalSashTop() {
		return (this.domNode.style.height === null ? 0 : parseInt(this.domNode.style.height)) - (this._decoratingElementsHeight() / 2);
	}

	getHorizontalSashWidth() {
		const layoutInfo = this.editor.getLayoutInfo();
		return layoutInfo.width - layoutInfo.minimap.minimapWidth;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/colorizer.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/colorizer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createTrustedTypesPolicy } from '../../../base/browser/trustedTypes.js';
import * as strings from '../../../base/common/strings.js';
import { ColorId, FontStyle, MetadataConsts } from '../../common/encodedTokenAttributes.js';
import { ILanguageIdCodec, ITokenizationSupport, TokenizationRegistry } from '../../common/languages.js';
import { ILanguageService } from '../../common/languages/language.js';
import { ITextModel } from '../../common/model.js';
import { IViewLineTokens, LineTokens } from '../../common/tokens/lineTokens.js';
import { RenderLineInput, renderViewLine2 as renderViewLine } from '../../common/viewLayout/viewLineRenderer.js';
import { ViewLineRenderingData } from '../../common/viewModel.js';
import { MonarchTokenizer } from '../common/monarch/monarchLexer.js';
import { IStandaloneThemeService } from '../common/standaloneTheme.js';

const ttPolicy = createTrustedTypesPolicy('standaloneColorizer', { createHTML: value => value });

export interface IColorizerOptions {
	tabSize?: number;
}

export interface IColorizerElementOptions extends IColorizerOptions {
	theme?: string;
	mimeType?: string;
}

export class Colorizer {

	public static colorizeElement(themeService: IStandaloneThemeService, languageService: ILanguageService, domNode: HTMLElement, options: IColorizerElementOptions): Promise<void> {
		options = options || {};
		const theme = options.theme || 'vs';
		const mimeType = options.mimeType || domNode.getAttribute('lang') || domNode.getAttribute('data-lang');
		if (!mimeType) {
			console.error('Mode not detected');
			return Promise.resolve();
		}
		const languageId = languageService.getLanguageIdByMimeType(mimeType) || mimeType;

		themeService.setTheme(theme);

		const text = domNode.firstChild ? domNode.firstChild.nodeValue : '';
		domNode.className += ' ' + theme;
		const render = (str: string) => {
			const trustedhtml = ttPolicy?.createHTML(str) ?? str;
			domNode.innerHTML = trustedhtml as string;
		};
		return this.colorize(languageService, text || '', languageId, options).then(render, (err) => console.error(err));
	}

	public static async colorize(languageService: ILanguageService, text: string, languageId: string, options: IColorizerOptions | null | undefined): Promise<string> {
		const languageIdCodec = languageService.languageIdCodec;
		let tabSize = 4;
		if (options && typeof options.tabSize === 'number') {
			tabSize = options.tabSize;
		}

		if (strings.startsWithUTF8BOM(text)) {
			text = text.substr(1);
		}
		const lines = strings.splitLines(text);
		if (!languageService.isRegisteredLanguageId(languageId)) {
			return _fakeColorize(lines, tabSize, languageIdCodec);
		}

		const tokenizationSupport = await TokenizationRegistry.getOrCreate(languageId);
		if (tokenizationSupport) {
			return _colorize(lines, tabSize, tokenizationSupport, languageIdCodec);
		}

		return _fakeColorize(lines, tabSize, languageIdCodec);
	}

	public static colorizeLine(line: string, mightContainNonBasicASCII: boolean, mightContainRTL: boolean, tokens: IViewLineTokens, tabSize: number = 4): string {
		const isBasicASCII = ViewLineRenderingData.isBasicASCII(line, mightContainNonBasicASCII);
		const containsRTL = ViewLineRenderingData.containsRTL(line, isBasicASCII, mightContainRTL);
		const renderResult = renderViewLine(new RenderLineInput(
			false,
			true,
			line,
			false,
			isBasicASCII,
			containsRTL,
			0,
			tokens,
			[],
			tabSize,
			0,
			0,
			0,
			0,
			-1,
			'none',
			false,
			false,
			null,
			null,
			0
		));
		return renderResult.html;
	}

	public static colorizeModelLine(model: ITextModel, lineNumber: number, tabSize: number = 4): string {
		const content = model.getLineContent(lineNumber);
		model.tokenization.forceTokenization(lineNumber);
		const tokens = model.tokenization.getLineTokens(lineNumber);
		const inflatedTokens = tokens.inflate();
		return this.colorizeLine(content, model.mightContainNonBasicASCII(), model.mightContainRTL(), inflatedTokens, tabSize);
	}
}

function _colorize(lines: string[], tabSize: number, tokenizationSupport: ITokenizationSupport, languageIdCodec: ILanguageIdCodec): Promise<string> {
	return new Promise<string>((c, e) => {
		const execute = () => {
			const result = _actualColorize(lines, tabSize, tokenizationSupport, languageIdCodec);
			if (tokenizationSupport instanceof MonarchTokenizer) {
				const status = tokenizationSupport.getLoadStatus();
				if (status.loaded === false) {
					status.promise.then(execute, e);
					return;
				}
			}
			c(result);
		};
		execute();
	});
}

function _fakeColorize(lines: string[], tabSize: number, languageIdCodec: ILanguageIdCodec): string {
	let html: string[] = [];

	const defaultMetadata = (
		(FontStyle.None << MetadataConsts.FONT_STYLE_OFFSET)
		| (ColorId.DefaultForeground << MetadataConsts.FOREGROUND_OFFSET)
		| (ColorId.DefaultBackground << MetadataConsts.BACKGROUND_OFFSET)
	) >>> 0;

	const tokens = new Uint32Array(2);
	tokens[0] = 0;
	tokens[1] = defaultMetadata;

	for (let i = 0, length = lines.length; i < length; i++) {
		const line = lines[i];

		tokens[0] = line.length;
		const lineTokens = new LineTokens(tokens, line, languageIdCodec);

		const isBasicASCII = ViewLineRenderingData.isBasicASCII(line, /* check for basic ASCII */true);
		const containsRTL = ViewLineRenderingData.containsRTL(line, isBasicASCII, /* check for RTL */true);
		const renderResult = renderViewLine(new RenderLineInput(
			false,
			true,
			line,
			false,
			isBasicASCII,
			containsRTL,
			0,
			lineTokens,
			[],
			tabSize,
			0,
			0,
			0,
			0,
			-1,
			'none',
			false,
			false,
			null,
			null,
			0
		));

		html = html.concat(renderResult.html);
		html.push('<br/>');
	}

	return html.join('');
}

function _actualColorize(lines: string[], tabSize: number, tokenizationSupport: ITokenizationSupport, languageIdCodec: ILanguageIdCodec): string {
	let html: string[] = [];
	let state = tokenizationSupport.getInitialState();

	for (let i = 0, length = lines.length; i < length; i++) {
		const line = lines[i];
		const tokenizeResult = tokenizationSupport.tokenizeEncoded(line, true, state);
		LineTokens.convertToEndOffset(tokenizeResult.tokens, line.length);
		const lineTokens = new LineTokens(tokenizeResult.tokens, line, languageIdCodec);
		const isBasicASCII = ViewLineRenderingData.isBasicASCII(line, /* check for basic ASCII */true);
		const containsRTL = ViewLineRenderingData.containsRTL(line, isBasicASCII, /* check for RTL */true);
		const renderResult = renderViewLine(new RenderLineInput(
			false,
			true,
			line,
			false,
			isBasicASCII,
			containsRTL,
			0,
			lineTokens.inflate(),
			[],
			tabSize,
			0,
			0,
			0,
			0,
			-1,
			'none',
			false,
			false,
			null,
			null,
			0
		));

		html = html.concat(renderResult.html);
		html.push('<br/>');

		state = tokenizeResult.endState;
	}

	return html.join('');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/standalone-tokens.css]---
Location: vscode-main/src/vs/editor/standalone/browser/standalone-tokens.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


/* Default standalone editor fonts */
.monaco-editor {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", "HelveticaNeue-Light", system-ui, "Ubuntu", "Droid Sans", sans-serif;
	--monaco-monospace-font: "SF Mono", Monaco, Menlo, Consolas, "Ubuntu Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace;
}

.monaco-menu .monaco-action-bar.vertical .action-item .action-menu-item:focus .action-label {
	stroke-width: 1.2px;
}

.monaco-editor.vs-dark .monaco-menu .monaco-action-bar.vertical .action-menu-item:focus .action-label,
.monaco-editor.hc-black .monaco-menu .monaco-action-bar.vertical .action-menu-item:focus .action-label,
.monaco-editor.hc-light .monaco-menu .monaco-action-bar.vertical .action-menu-item:focus .action-label {
	stroke-width: 1.2px;
}

.monaco-hover p {
	margin: 0;
}

/* See https://github.com/microsoft/monaco-editor/issues/2168#issuecomment-780078600 */
.monaco-aria-container {
	position: absolute !important;
	top: 0; /* avoid being placed underneath a sibling element */
	height: 1px;
	width: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	clip: rect(1px, 1px, 1px, 1px);
	clip-path: inset(50%);
}

.monaco-editor .synthetic-focus, .monaco-diff-editor .synthetic-focus,
.monaco-editor [tabindex="0"]:focus, .monaco-diff-editor [tabindex="0"]:focus,
.monaco-editor [tabindex="-1"]:focus, .monaco-diff-editor [tabindex="-1"]:focus,
.monaco-editor button:focus, .monaco-diff-editor button:focus,
.monaco-editor input[type=button]:focus, .monaco-diff-editor input[type=button]:focus,
.monaco-editor input[type=checkbox]:focus, .monaco-diff-editor input[type=checkbox]:focus,
.monaco-editor input[type=search]:focus, .monaco-diff-editor input[type=search]:focus,
.monaco-editor input[type=text]:focus, .monaco-diff-editor input[type=text]:focus,
.monaco-editor select:focus, .monaco-diff-editor select:focus,
.monaco-editor textarea:focus, .monaco-diff-editor textarea:focus {
	outline-width: 1px;
	outline-style: solid;
	outline-offset: -1px;
	outline-color: var(--vscode-focusBorder);
	opacity: 1
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/standaloneCodeEditor.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/standaloneCodeEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as aria from '../../../base/browser/ui/aria/aria.js';
import { Disposable, IDisposable, toDisposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { ICodeEditor, IDiffEditor, IDiffEditorConstructionOptions } from '../../browser/editorBrowser.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { CodeEditorWidget } from '../../browser/widget/codeEditor/codeEditorWidget.js';
import { IDiffEditorOptions, IEditorOptions } from '../../common/config/editorOptions.js';
import { InternalEditorAction } from '../../common/editorAction.js';
import { IModelChangedEvent } from '../../common/editorCommon.js';
import { ITextModel } from '../../common/model.js';
import { StandaloneKeybindingService, updateConfigurationService } from './standaloneServices.js';
import { IStandaloneThemeService } from '../common/standaloneTheme.js';
import { IMenuItem, MenuId, MenuRegistry } from '../../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandHandler, ICommandService } from '../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, ContextKeyValue, IContextKey, IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../platform/contextview/browser/contextView.js';
import { IInstantiationService, ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { IAccessibilityService } from '../../../platform/accessibility/common/accessibility.js';
import { StandaloneCodeEditorNLS } from '../../common/standaloneStrings.js';
import { IClipboardService } from '../../../platform/clipboard/common/clipboardService.js';
import { IEditorProgressService } from '../../../platform/progress/common/progress.js';
import { StandaloneThemeService } from './standaloneThemeService.js';
import { IModelService } from '../../common/services/model.js';
import { ILanguageSelection, ILanguageService } from '../../common/languages/language.js';
import { URI } from '../../../base/common/uri.js';
import { StandaloneCodeEditorService } from './standaloneCodeEditorService.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../common/languages/modesRegistry.js';
import { ILanguageConfigurationService } from '../../common/languages/languageConfigurationRegistry.js';
import { IEditorConstructionOptions } from '../../browser/config/editorConfiguration.js';
import { ILanguageFeaturesService } from '../../common/services/languageFeatures.js';
import { DiffEditorWidget } from '../../browser/widget/diffEditor/diffEditorWidget.js';
import { IAccessibilitySignalService } from '../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { mainWindow } from '../../../base/browser/window.js';
import { setHoverDelegateFactory } from '../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IHoverService, WorkbenchHoverDelegate } from '../../../platform/hover/browser/hover.js';
import { setBaseLayerHoverDelegate } from '../../../base/browser/ui/hover/hoverDelegate2.js';
import { IMarkdownRendererService } from '../../../platform/markdown/browser/markdownRenderer.js';
import { EditorMarkdownCodeBlockRenderer } from '../../browser/widget/markdownRenderer/browser/editorMarkdownCodeBlockRenderer.js';

/**
 * Description of an action contribution
 */
export interface IActionDescriptor {
	/**
	 * An unique identifier of the contributed action.
	 */
	id: string;
	/**
	 * A label of the action that will be presented to the user.
	 */
	label: string;
	/**
	 * Precondition rule. The value should be a [context key expression](https://code.visualstudio.com/docs/getstarted/keybindings#_when-clause-contexts).
	 */
	precondition?: string;
	/**
	 * An array of keybindings for the action.
	 */
	keybindings?: number[];
	/**
	 * The keybinding rule (condition on top of precondition).
	 */
	keybindingContext?: string;
	/**
	 * Control if the action should show up in the context menu and where.
	 * The context menu of the editor has these default:
	 *   navigation - The navigation group comes first in all cases.
	 *   1_modification - This group comes next and contains commands that modify your code.
	 *   9_cutcopypaste - The last default group with the basic editing commands.
	 * You can also create your own group.
	 * Defaults to null (don't show in context menu).
	 */
	contextMenuGroupId?: string;
	/**
	 * Control the order in the context menu group.
	 */
	contextMenuOrder?: number;
	/**
	 * Method that will be executed when the action is triggered.
	 * @param editor The editor instance is passed in as a convenience
	 */
	run(editor: ICodeEditor, ...args: unknown[]): void | Promise<void>;
}

/**
 * Options which apply for all editors.
 */
export interface IGlobalEditorOptions {
	/**
	 * The number of spaces a tab is equal to.
	 * This setting is overridden based on the file contents when `detectIndentation` is on.
	 * Defaults to 4.
	 */
	tabSize?: number;
	/**
	 * Insert spaces when pressing `Tab`.
	 * This setting is overridden based on the file contents when `detectIndentation` is on.
	 * Defaults to true.
	 */
	insertSpaces?: boolean;
	/**
	 * Controls whether `tabSize` and `insertSpaces` will be automatically detected when a file is opened based on the file contents.
	 * Defaults to true.
	 */
	detectIndentation?: boolean;
	/**
	 * Remove trailing auto inserted whitespace.
	 * Defaults to true.
	 */
	trimAutoWhitespace?: boolean;
	/**
	 * Special handling for large files to disable certain memory intensive features.
	 * Defaults to true.
	 */
	largeFileOptimizations?: boolean;
	/**
	 * Controls whether completions should be computed based on words in the document.
	 * Defaults to true.
	 */
	wordBasedSuggestions?: 'off' | 'currentDocument' | 'matchingDocuments' | 'allDocuments';
	/**
	 * Controls whether word based completions should be included from opened documents of the same language or any language.
	 */
	wordBasedSuggestionsOnlySameLanguage?: boolean;
	/**
	 * Controls whether the semanticHighlighting is shown for the languages that support it.
	 * true: semanticHighlighting is enabled for all themes
	 * false: semanticHighlighting is disabled for all themes
	 * 'configuredByTheme': semanticHighlighting is controlled by the current color theme's semanticHighlighting setting.
	 * Defaults to 'byTheme'.
	 */
	'semanticHighlighting.enabled'?: true | false | 'configuredByTheme';
	/**
	 * Keep peek editors open even when double-clicking their content or when hitting `Escape`.
	 * Defaults to false.
	 */
	stablePeek?: boolean;
	/**
	 * Lines above this length will not be tokenized for performance reasons.
	 * Defaults to 20000.
	 */
	maxTokenizationLineLength?: number;
	/**
	 * Theme to be used for rendering.
	 * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black', 'hc-light'.
	 * You can create custom themes via `monaco.editor.defineTheme`.
	 * To switch a theme, use `monaco.editor.setTheme`.
	 * **NOTE**: The theme might be overwritten if the OS is in high contrast mode, unless `autoDetectHighContrast` is set to false.
	 */
	theme?: string;
	/**
	 * If enabled, will automatically change to high contrast theme if the OS is using a high contrast theme.
	 * Defaults to true.
	 */
	autoDetectHighContrast?: boolean;
}

/**
 * The options to create an editor.
 */
export interface IStandaloneEditorConstructionOptions extends IEditorConstructionOptions, IGlobalEditorOptions {
	/**
	 * The initial model associated with this code editor.
	 */
	model?: ITextModel | null;
	/**
	 * The initial value of the auto created model in the editor.
	 * To not automatically create a model, use `model: null`.
	 */
	value?: string;
	/**
	 * The initial language of the auto created model in the editor.
	 * To not automatically create a model, use `model: null`.
	 */
	language?: string;
	/**
	 * Initial theme to be used for rendering.
	 * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black', 'hc-light.
	 * You can create custom themes via `monaco.editor.defineTheme`.
	 * To switch a theme, use `monaco.editor.setTheme`.
	 * **NOTE**: The theme might be overwritten if the OS is in high contrast mode, unless `autoDetectHighContrast` is set to false.
	 */
	theme?: string;
	/**
	 * If enabled, will automatically change to high contrast theme if the OS is using a high contrast theme.
	 * Defaults to true.
	 */
	autoDetectHighContrast?: boolean;
	/**
	 * An URL to open when Ctrl+H (Windows and Linux) or Cmd+H (OSX) is pressed in
	 * the accessibility help dialog in the editor.
	 *
	 * Defaults to "https://go.microsoft.com/fwlink/?linkid=852450"
	 */
	accessibilityHelpUrl?: string;
	/**
	 * Container element to use for ARIA messages.
	 * Defaults to document.body.
	 */
	ariaContainerElement?: HTMLElement;
}

/**
 * The options to create a diff editor.
 */
export interface IStandaloneDiffEditorConstructionOptions extends IDiffEditorConstructionOptions {
	/**
	 * Initial theme to be used for rendering.
	 * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black', 'hc-light.
	 * You can create custom themes via `monaco.editor.defineTheme`.
	 * To switch a theme, use `monaco.editor.setTheme`.
	 * **NOTE**: The theme might be overwritten if the OS is in high contrast mode, unless `autoDetectHighContrast` is set to false.
	 */
	theme?: string;
	/**
	 * If enabled, will automatically change to high contrast theme if the OS is using a high contrast theme.
	 * Defaults to true.
	 */
	autoDetectHighContrast?: boolean;
}

export interface IStandaloneCodeEditor extends ICodeEditor {
	updateOptions(newOptions: IEditorOptions & IGlobalEditorOptions): void;
	addCommand(keybinding: number, handler: ICommandHandler, context?: string): string | null;
	createContextKey<T extends ContextKeyValue = ContextKeyValue>(key: string, defaultValue: T): IContextKey<T>;
	addAction(descriptor: IActionDescriptor): IDisposable;
}

export interface IStandaloneDiffEditor extends IDiffEditor {
	addCommand(keybinding: number, handler: ICommandHandler, context?: string): string | null;
	createContextKey<T extends ContextKeyValue = ContextKeyValue>(key: string, defaultValue: T): IContextKey<T>;
	addAction(descriptor: IActionDescriptor): IDisposable;

	getOriginalEditor(): IStandaloneCodeEditor;
	getModifiedEditor(): IStandaloneCodeEditor;
}

let LAST_GENERATED_COMMAND_ID = 0;

let ariaDomNodeCreated = false;
/**
 * Create ARIA dom node inside parent,
 * or only for the first editor instantiation inside document.body.
 * @param parent container element for ARIA dom node
 */
function createAriaDomNode(parent: HTMLElement | undefined) {
	if (!parent) {
		if (ariaDomNodeCreated) {
			return;
		}
		ariaDomNodeCreated = true;
	}
	aria.setARIAContainer(parent || mainWindow.document.body);
}

/**
 * A code editor to be used both by the standalone editor and the standalone diff editor.
 */
export class StandaloneCodeEditor extends CodeEditorWidget implements IStandaloneCodeEditor {

	private readonly _standaloneKeybindingService: StandaloneKeybindingService | null;

	constructor(
		domElement: HTMLElement,
		_options: Readonly<IStandaloneEditorConstructionOptions>,
		@IInstantiationService instantiationService: IInstantiationService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@ICommandService commandService: ICommandService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IHoverService hoverService: IHoverService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IThemeService themeService: IThemeService,
		@INotificationService notificationService: INotificationService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
		@ILanguageConfigurationService languageConfigurationService: ILanguageConfigurationService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IMarkdownRendererService markdownRendererService: IMarkdownRendererService,
	) {
		const options = { ..._options };
		options.ariaLabel = options.ariaLabel || StandaloneCodeEditorNLS.editorViewAccessibleLabel;
		super(domElement, options, {}, instantiationService, codeEditorService, commandService, contextKeyService, themeService, notificationService, accessibilityService, languageConfigurationService, languageFeaturesService);

		if (keybindingService instanceof StandaloneKeybindingService) {
			this._standaloneKeybindingService = keybindingService;
		} else {
			this._standaloneKeybindingService = null;
		}

		createAriaDomNode(options.ariaContainerElement);

		setHoverDelegateFactory((placement, enableInstantHover) => instantiationService.createInstance(WorkbenchHoverDelegate, placement, { instantHover: enableInstantHover }, {}));
		setBaseLayerHoverDelegate(hoverService);

		markdownRendererService.setDefaultCodeBlockRenderer(instantiationService.createInstance(EditorMarkdownCodeBlockRenderer));
	}

	public addCommand(keybinding: number, handler: ICommandHandler, context?: string): string | null {
		if (!this._standaloneKeybindingService) {
			console.warn('Cannot add command because the editor is configured with an unrecognized KeybindingService');
			return null;
		}
		const commandId = 'DYNAMIC_' + (++LAST_GENERATED_COMMAND_ID);
		const whenExpression = ContextKeyExpr.deserialize(context);
		this._standaloneKeybindingService.addDynamicKeybinding(commandId, keybinding, handler, whenExpression);
		return commandId;
	}

	public createContextKey<T extends ContextKeyValue = ContextKeyValue>(key: string, defaultValue: T): IContextKey<T> {
		return this._contextKeyService.createKey(key, defaultValue);
	}

	public addAction(_descriptor: IActionDescriptor): IDisposable {
		if ((typeof _descriptor.id !== 'string') || (typeof _descriptor.label !== 'string') || (typeof _descriptor.run !== 'function')) {
			throw new Error('Invalid action descriptor, `id`, `label` and `run` are required properties!');
		}
		if (!this._standaloneKeybindingService) {
			console.warn('Cannot add keybinding because the editor is configured with an unrecognized KeybindingService');
			return Disposable.None;
		}

		// Read descriptor options
		const id = _descriptor.id;
		const label = _descriptor.label;
		const precondition = ContextKeyExpr.and(
			ContextKeyExpr.equals('editorId', this.getId()),
			ContextKeyExpr.deserialize(_descriptor.precondition)
		);
		const keybindings = _descriptor.keybindings;
		const keybindingsWhen = ContextKeyExpr.and(
			precondition,
			ContextKeyExpr.deserialize(_descriptor.keybindingContext)
		);
		const contextMenuGroupId = _descriptor.contextMenuGroupId || null;
		const contextMenuOrder = _descriptor.contextMenuOrder || 0;
		const run = (_accessor?: ServicesAccessor, ...args: unknown[]): Promise<void> => {
			return Promise.resolve(_descriptor.run(this, ...args));
		};


		const toDispose = new DisposableStore();

		// Generate a unique id to allow the same descriptor.id across multiple editor instances
		const uniqueId = this.getId() + ':' + id;

		// Register the command
		toDispose.add(CommandsRegistry.registerCommand(uniqueId, run));

		// Register the context menu item
		if (contextMenuGroupId) {
			const menuItem: IMenuItem = {
				command: {
					id: uniqueId,
					title: label
				},
				when: precondition,
				group: contextMenuGroupId,
				order: contextMenuOrder
			};
			toDispose.add(MenuRegistry.appendMenuItem(MenuId.EditorContext, menuItem));
		}

		// Register the keybindings
		if (Array.isArray(keybindings)) {
			for (const kb of keybindings) {
				toDispose.add(this._standaloneKeybindingService.addDynamicKeybinding(uniqueId, kb, run, keybindingsWhen));
			}
		}

		// Finally, register an internal editor action
		const internalAction = new InternalEditorAction(
			uniqueId,
			label,
			label,
			undefined,
			precondition,
			(...args: unknown[]) => Promise.resolve(_descriptor.run(this, ...args)),
			this._contextKeyService
		);

		// Store it under the original id, such that trigger with the original id will work
		this._actions.set(id, internalAction);
		toDispose.add(toDisposable(() => {
			this._actions.delete(id);
		}));

		return toDispose;
	}

	protected override _triggerCommand(handlerId: string, payload: unknown): void {
		if (this._codeEditorService instanceof StandaloneCodeEditorService) {
			// Help commands find this editor as the active editor
			try {
				this._codeEditorService.setActiveCodeEditor(this);
				super._triggerCommand(handlerId, payload);
			} finally {
				this._codeEditorService.setActiveCodeEditor(null);
			}
		} else {
			super._triggerCommand(handlerId, payload);
		}
	}
}

export class StandaloneEditor extends StandaloneCodeEditor implements IStandaloneCodeEditor {

	private readonly _configurationService: IConfigurationService;
	private readonly _standaloneThemeService: IStandaloneThemeService;
	private _ownsModel: boolean;

	constructor(
		domElement: HTMLElement,
		_options: Readonly<IStandaloneEditorConstructionOptions> | undefined,
		@IInstantiationService instantiationService: IInstantiationService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@ICommandService commandService: ICommandService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IHoverService hoverService: IHoverService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IStandaloneThemeService themeService: IStandaloneThemeService,
		@INotificationService notificationService: INotificationService,
		@IConfigurationService configurationService: IConfigurationService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
		@IModelService modelService: IModelService,
		@ILanguageService languageService: ILanguageService,
		@ILanguageConfigurationService languageConfigurationService: ILanguageConfigurationService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IMarkdownRendererService markdownRendererService: IMarkdownRendererService,
	) {
		const options = { ..._options };
		updateConfigurationService(configurationService, options, false);
		const themeDomRegistration = (<StandaloneThemeService>themeService).registerEditorContainer(domElement);
		if (typeof options.theme === 'string') {
			themeService.setTheme(options.theme);
		}
		if (typeof options.autoDetectHighContrast !== 'undefined') {
			themeService.setAutoDetectHighContrast(Boolean(options.autoDetectHighContrast));
		}
		const _model: ITextModel | null | undefined = options.model;
		delete options.model;
		super(domElement, options, instantiationService, codeEditorService, commandService, contextKeyService, hoverService, keybindingService, themeService, notificationService, accessibilityService, languageConfigurationService, languageFeaturesService, markdownRendererService);

		this._configurationService = configurationService;
		this._standaloneThemeService = themeService;
		this._register(themeDomRegistration);

		let model: ITextModel | null;
		if (typeof _model === 'undefined') {
			const languageId = languageService.getLanguageIdByMimeType(options.language) || options.language || PLAINTEXT_LANGUAGE_ID;
			model = createTextModel(modelService, languageService, options.value || '', languageId, undefined);
			this._ownsModel = true;
		} else {
			model = _model;
			this._ownsModel = false;
		}

		this._attachModel(model);
		if (model) {
			const e: IModelChangedEvent = {
				oldModelUrl: null,
				newModelUrl: model.uri
			};
			this._onDidChangeModel.fire(e);
		}
	}

	public override dispose(): void {
		super.dispose();
	}

	public override updateOptions(newOptions: Readonly<IEditorOptions & IGlobalEditorOptions>): void {
		updateConfigurationService(this._configurationService, newOptions, false);
		if (typeof newOptions.theme === 'string') {
			this._standaloneThemeService.setTheme(newOptions.theme);
		}
		if (typeof newOptions.autoDetectHighContrast !== 'undefined') {
			this._standaloneThemeService.setAutoDetectHighContrast(Boolean(newOptions.autoDetectHighContrast));
		}
		super.updateOptions(newOptions);
	}

	protected override _postDetachModelCleanup(detachedModel: ITextModel): void {
		super._postDetachModelCleanup(detachedModel);
		if (detachedModel && this._ownsModel) {
			detachedModel.dispose();
			this._ownsModel = false;
		}
	}
}

export class StandaloneDiffEditor2 extends DiffEditorWidget implements IStandaloneDiffEditor {

	private readonly _configurationService: IConfigurationService;
	private readonly _standaloneThemeService: IStandaloneThemeService;

	constructor(
		domElement: HTMLElement,
		_options: Readonly<IStandaloneDiffEditorConstructionOptions> | undefined,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IStandaloneThemeService themeService: IStandaloneThemeService,
		@INotificationService notificationService: INotificationService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IEditorProgressService editorProgressService: IEditorProgressService,
		@IClipboardService clipboardService: IClipboardService,
		@IAccessibilitySignalService accessibilitySignalService: IAccessibilitySignalService,
	) {
		const options = { ..._options };
		updateConfigurationService(configurationService, options, true);
		const themeDomRegistration = (<StandaloneThemeService>themeService).registerEditorContainer(domElement);
		if (typeof options.theme === 'string') {
			themeService.setTheme(options.theme);
		}
		if (typeof options.autoDetectHighContrast !== 'undefined') {
			themeService.setAutoDetectHighContrast(Boolean(options.autoDetectHighContrast));
		}

		super(
			domElement,
			options,
			{},
			contextKeyService,
			instantiationService,
			codeEditorService,
			accessibilitySignalService,
			editorProgressService,
		);

		this._configurationService = configurationService;
		this._standaloneThemeService = themeService;

		this._register(themeDomRegistration);
	}

	public override dispose(): void {
		super.dispose();
	}

	public override updateOptions(newOptions: Readonly<IDiffEditorOptions & IGlobalEditorOptions>): void {
		updateConfigurationService(this._configurationService, newOptions, true);
		if (typeof newOptions.theme === 'string') {
			this._standaloneThemeService.setTheme(newOptions.theme);
		}
		if (typeof newOptions.autoDetectHighContrast !== 'undefined') {
			this._standaloneThemeService.setAutoDetectHighContrast(Boolean(newOptions.autoDetectHighContrast));
		}
		super.updateOptions(newOptions);
	}

	protected override _createInnerEditor(instantiationService: IInstantiationService, container: HTMLElement, options: Readonly<IEditorOptions>): CodeEditorWidget {
		return instantiationService.createInstance(StandaloneCodeEditor, container, options);
	}

	public override getOriginalEditor(): IStandaloneCodeEditor {
		return <StandaloneCodeEditor>super.getOriginalEditor();
	}

	public override getModifiedEditor(): IStandaloneCodeEditor {
		return <StandaloneCodeEditor>super.getModifiedEditor();
	}

	public addCommand(keybinding: number, handler: ICommandHandler, context?: string): string | null {
		return this.getModifiedEditor().addCommand(keybinding, handler, context);
	}

	public createContextKey<T extends ContextKeyValue = ContextKeyValue>(key: string, defaultValue: T): IContextKey<T> {
		return this.getModifiedEditor().createContextKey(key, defaultValue);
	}

	public addAction(descriptor: IActionDescriptor): IDisposable {
		return this.getModifiedEditor().addAction(descriptor);
	}
}

/**
 * @internal
 */
export function createTextModel(modelService: IModelService, languageService: ILanguageService, value: string, languageId: string | undefined, uri: URI | undefined): ITextModel {
	value = value || '';
	if (!languageId) {
		const firstLF = value.indexOf('\n');
		let firstLine = value;
		if (firstLF !== -1) {
			firstLine = value.substring(0, firstLF);
		}
		return doCreateModel(modelService, value, languageService.createByFilepathOrFirstLine(uri || null, firstLine), uri);
	}
	return doCreateModel(modelService, value, languageService.createById(languageId), uri);
}

/**
 * @internal
 */
function doCreateModel(modelService: IModelService, value: string, languageSelection: ILanguageSelection, uri: URI | undefined): ITextModel {
	return modelService.createModel(value, languageSelection, uri);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/standaloneCodeEditorService.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/standaloneCodeEditorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { windowOpenNoOpener } from '../../../base/browser/dom.js';
import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { ICodeEditor } from '../../browser/editorBrowser.js';
import { AbstractCodeEditorService } from '../../browser/services/abstractCodeEditorService.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { IRange } from '../../common/core/range.js';
import { ScrollType } from '../../common/editorCommon.js';
import { ITextModel } from '../../common/model.js';
import { IContextKey, IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { ITextResourceEditorInput } from '../../../platform/editor/common/editor.js';
import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';

export class StandaloneCodeEditorService extends AbstractCodeEditorService {

	private readonly _editorIsOpen: IContextKey<boolean>;
	private _activeCodeEditor: ICodeEditor | null;

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@IThemeService themeService: IThemeService,
	) {
		super(themeService);
		this._register(this.onCodeEditorAdd(() => this._checkContextKey()));
		this._register(this.onCodeEditorRemove(() => this._checkContextKey()));
		this._editorIsOpen = contextKeyService.createKey('editorIsOpen', false);
		this._activeCodeEditor = null;

		this._register(this.registerCodeEditorOpenHandler(async (input, source, sideBySide) => {
			if (!source) {
				return null;
			}
			return this.doOpenEditor(source, input);
		}));
	}

	private _checkContextKey(): void {
		let hasCodeEditor = false;
		for (const editor of this.listCodeEditors()) {
			if (!editor.isSimpleWidget) {
				hasCodeEditor = true;
				break;
			}
		}
		this._editorIsOpen.set(hasCodeEditor);
	}

	public setActiveCodeEditor(activeCodeEditor: ICodeEditor | null): void {
		this._activeCodeEditor = activeCodeEditor;
	}

	public getActiveCodeEditor(): ICodeEditor | null {
		return this._activeCodeEditor;
	}


	private doOpenEditor(editor: ICodeEditor, input: ITextResourceEditorInput): ICodeEditor | null {
		const model = this.findModel(editor, input.resource);
		if (!model) {
			if (input.resource) {

				const schema = input.resource.scheme;
				if (schema === Schemas.http || schema === Schemas.https) {
					// This is a fully qualified http or https URL
					windowOpenNoOpener(input.resource.toString());
					return editor;
				}
			}
			return null;
		}

		const selection = <IRange>(input.options ? input.options.selection : null);
		if (selection) {
			if (typeof selection.endLineNumber === 'number' && typeof selection.endColumn === 'number') {
				editor.setSelection(selection);
				editor.revealRangeInCenter(selection, ScrollType.Immediate);
			} else {
				const pos = {
					lineNumber: selection.startLineNumber,
					column: selection.startColumn
				};
				editor.setPosition(pos);
				editor.revealPositionInCenter(pos, ScrollType.Immediate);
			}
		}

		return editor;
	}

	private findModel(editor: ICodeEditor, resource: URI): ITextModel | null {
		const model = editor.getModel();
		if (model && model.uri.toString() !== resource.toString()) {
			return null;
		}

		return model;
	}
}

registerSingleton(ICodeEditorService, StandaloneCodeEditorService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/standaloneEditor.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/standaloneEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mainWindow } from '../../../base/browser/window.js';
import { Disposable, DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { splitLines } from '../../../base/common/strings.js';
import { URI } from '../../../base/common/uri.js';
import './standalone-tokens.css';
import { FontMeasurements } from '../../browser/config/fontMeasurements.js';
import { ICodeEditor } from '../../browser/editorBrowser.js';
import { EditorCommand, ServicesAccessor } from '../../browser/editorExtensions.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { IInternalWebWorkerOptions, MonacoWebWorker, createWebWorker as actualCreateWebWorker } from './standaloneWebWorker.js';
import { ApplyUpdateResult, ConfigurationChangedEvent, EditorOptions } from '../../common/config/editorOptions.js';
import { EditorZoom } from '../../common/config/editorZoom.js';
import { BareFontInfo, FontInfo } from '../../common/config/fontInfo.js';
import { IPosition } from '../../common/core/position.js';
import { IRange } from '../../common/core/range.js';
import { EditorType, IDiffEditor } from '../../common/editorCommon.js';
import * as languages from '../../common/languages.js';
import { ILanguageService } from '../../common/languages/language.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../common/languages/modesRegistry.js';
import { NullState, nullTokenize } from '../../common/languages/nullTokenize.js';
import { FindMatch, ITextModel, TextModelResolvedOptions } from '../../common/model.js';
import { IModelService } from '../../common/services/model.js';
import * as standaloneEnums from '../../common/standalone/standaloneEnums.js';
import { Colorizer, IColorizerElementOptions, IColorizerOptions } from './colorizer.js';
import { IActionDescriptor, IStandaloneCodeEditor, IStandaloneDiffEditor, IStandaloneDiffEditorConstructionOptions, IStandaloneEditorConstructionOptions, StandaloneDiffEditor2, StandaloneEditor, createTextModel } from './standaloneCodeEditor.js';
import { IEditorOverrideServices, StandaloneKeybindingService, StandaloneServices } from './standaloneServices.js';
import { StandaloneThemeService } from './standaloneThemeService.js';
import { IStandaloneThemeData, IStandaloneThemeService } from '../common/standaloneTheme.js';
import { IMenuItem, MenuId, MenuRegistry } from '../../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandHandler } from '../../../platform/commands/common/commands.js';
import { ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';
import { ITextResourceEditorInput } from '../../../platform/editor/common/editor.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { IMarker, IMarkerData, IMarkerService } from '../../../platform/markers/common/markers.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
import { MultiDiffEditorWidget } from '../../browser/widget/multiDiffEditor/multiDiffEditorWidget.js';
import { IWebWorkerService } from '../../../platform/webWorker/browser/webWorkerService.js';

/**
 * Create a new editor under `domElement`.
 * `domElement` should be empty (not contain other dom nodes).
 * The editor will read the size of `domElement`.
 */
export function create(domElement: HTMLElement, options?: IStandaloneEditorConstructionOptions, override?: IEditorOverrideServices): IStandaloneCodeEditor {
	const instantiationService = StandaloneServices.initialize(override || {});
	return instantiationService.createInstance(StandaloneEditor, domElement, options);
}

/**
 * Emitted when an editor is created.
 * Creating a diff editor might cause this listener to be invoked with the two editors.
 * @event
 */
export function onDidCreateEditor(listener: (codeEditor: ICodeEditor) => void): IDisposable {
	const codeEditorService = StandaloneServices.get(ICodeEditorService);
	return codeEditorService.onCodeEditorAdd((editor) => {
		listener(editor);
	});
}

/**
 * Emitted when an diff editor is created.
 * @event
 */
export function onDidCreateDiffEditor(listener: (diffEditor: IDiffEditor) => void): IDisposable {
	const codeEditorService = StandaloneServices.get(ICodeEditorService);
	return codeEditorService.onDiffEditorAdd((editor) => {
		listener(<IDiffEditor>editor);
	});
}

/**
 * Get all the created editors.
 */
export function getEditors(): readonly ICodeEditor[] {
	const codeEditorService = StandaloneServices.get(ICodeEditorService);
	return codeEditorService.listCodeEditors();
}

/**
 * Get all the created diff editors.
 */
export function getDiffEditors(): readonly IDiffEditor[] {
	const codeEditorService = StandaloneServices.get(ICodeEditorService);
	return codeEditorService.listDiffEditors();
}

/**
 * Create a new diff editor under `domElement`.
 * `domElement` should be empty (not contain other dom nodes).
 * The editor will read the size of `domElement`.
 */
export function createDiffEditor(domElement: HTMLElement, options?: IStandaloneDiffEditorConstructionOptions, override?: IEditorOverrideServices): IStandaloneDiffEditor {
	const instantiationService = StandaloneServices.initialize(override || {});
	return instantiationService.createInstance(StandaloneDiffEditor2, domElement, options);
}

export function createMultiFileDiffEditor(domElement: HTMLElement, override?: IEditorOverrideServices) {
	const instantiationService = StandaloneServices.initialize(override || {});
	return new MultiDiffEditorWidget(domElement, {}, instantiationService);
}

/**
 * Description of a command contribution
 */
export interface ICommandDescriptor {
	/**
	 * An unique identifier of the contributed command.
	 */
	id: string;
	/**
	 * Callback that will be executed when the command is triggered.
	 */
	run: ICommandHandler;
}

/**
 * Add a command.
 */
export function addCommand(descriptor: ICommandDescriptor): IDisposable {
	if ((typeof descriptor.id !== 'string') || (typeof descriptor.run !== 'function')) {
		throw new Error('Invalid command descriptor, `id` and `run` are required properties!');
	}
	return CommandsRegistry.registerCommand(descriptor.id, descriptor.run);
}

/**
 * Add an action to all editors.
 */
export function addEditorAction(descriptor: IActionDescriptor): IDisposable {
	if ((typeof descriptor.id !== 'string') || (typeof descriptor.label !== 'string') || (typeof descriptor.run !== 'function')) {
		throw new Error('Invalid action descriptor, `id`, `label` and `run` are required properties!');
	}

	const precondition = ContextKeyExpr.deserialize(descriptor.precondition);
	const run = (accessor: ServicesAccessor, ...args: unknown[]): void | Promise<void> => {
		return EditorCommand.runEditorCommand(accessor, args, precondition, (accessor, editor, args) => Promise.resolve(descriptor.run(editor, ...args)));
	};

	const toDispose = new DisposableStore();

	// Register the command
	toDispose.add(CommandsRegistry.registerCommand(descriptor.id, run));

	// Register the context menu item
	if (descriptor.contextMenuGroupId) {
		const menuItem: IMenuItem = {
			command: {
				id: descriptor.id,
				title: descriptor.label
			},
			when: precondition,
			group: descriptor.contextMenuGroupId,
			order: descriptor.contextMenuOrder || 0
		};
		toDispose.add(MenuRegistry.appendMenuItem(MenuId.EditorContext, menuItem));
	}

	// Register the keybindings
	if (Array.isArray(descriptor.keybindings)) {
		const keybindingService = StandaloneServices.get(IKeybindingService);
		if (!(keybindingService instanceof StandaloneKeybindingService)) {
			console.warn('Cannot add keybinding because the editor is configured with an unrecognized KeybindingService');
		} else {
			const keybindingsWhen = ContextKeyExpr.and(precondition, ContextKeyExpr.deserialize(descriptor.keybindingContext));
			toDispose.add(keybindingService.addDynamicKeybindings(descriptor.keybindings.map((keybinding) => {
				return {
					keybinding,
					command: descriptor.id,
					when: keybindingsWhen
				};
			})));
		}
	}

	return toDispose;
}

/**
 * A keybinding rule.
 */
export interface IKeybindingRule {
	keybinding: number;
	command?: string | null;
	commandArgs?: any;
	when?: string | null;
}

/**
 * Add a keybinding rule.
 */
export function addKeybindingRule(rule: IKeybindingRule): IDisposable {
	return addKeybindingRules([rule]);
}

/**
 * Add keybinding rules.
 */
export function addKeybindingRules(rules: IKeybindingRule[]): IDisposable {
	const keybindingService = StandaloneServices.get(IKeybindingService);
	if (!(keybindingService instanceof StandaloneKeybindingService)) {
		console.warn('Cannot add keybinding because the editor is configured with an unrecognized KeybindingService');
		return Disposable.None;
	}

	return keybindingService.addDynamicKeybindings(rules.map((rule) => {
		return {
			keybinding: rule.keybinding,
			command: rule.command,
			commandArgs: rule.commandArgs,
			when: ContextKeyExpr.deserialize(rule.when),
		};
	}));
}

/**
 * Create a new editor model.
 * You can specify the language that should be set for this model or let the language be inferred from the `uri`.
 */
export function createModel(value: string, language?: string, uri?: URI): ITextModel {
	const languageService = StandaloneServices.get(ILanguageService);
	const languageId = languageService.getLanguageIdByMimeType(language) || language;
	return createTextModel(
		StandaloneServices.get(IModelService),
		languageService,
		value,
		languageId,
		uri
	);
}

/**
 * Change the language for a model.
 */
export function setModelLanguage(model: ITextModel, mimeTypeOrLanguageId: string): void {
	const languageService = StandaloneServices.get(ILanguageService);
	const languageId = languageService.getLanguageIdByMimeType(mimeTypeOrLanguageId) || mimeTypeOrLanguageId || PLAINTEXT_LANGUAGE_ID;
	model.setLanguage(languageService.createById(languageId));
}

/**
 * Set the markers for a model.
 */
export function setModelMarkers(model: ITextModel, owner: string, markers: IMarkerData[]): void {
	if (model) {
		const markerService = StandaloneServices.get(IMarkerService);
		markerService.changeOne(owner, model.uri, markers);
	}
}

/**
 * Remove all markers of an owner.
 */
export function removeAllMarkers(owner: string) {
	const markerService = StandaloneServices.get(IMarkerService);
	markerService.changeAll(owner, []);
}

/**
 * Get markers for owner and/or resource
 *
 * @returns list of markers
 */
export function getModelMarkers(filter: { owner?: string; resource?: URI; take?: number }): IMarker[] {
	const markerService = StandaloneServices.get(IMarkerService);
	return markerService.read(filter);
}

/**
 * Emitted when markers change for a model.
 * @event
 */
export function onDidChangeMarkers(listener: (e: readonly URI[]) => void): IDisposable {
	const markerService = StandaloneServices.get(IMarkerService);
	return markerService.onMarkerChanged(listener);
}

/**
 * Get the model that has `uri` if it exists.
 */
export function getModel(uri: URI): ITextModel | null {
	const modelService = StandaloneServices.get(IModelService);
	return modelService.getModel(uri);
}

/**
 * Get all the created models.
 */
export function getModels(): ITextModel[] {
	const modelService = StandaloneServices.get(IModelService);
	return modelService.getModels();
}

/**
 * Emitted when a model is created.
 * @event
 */
export function onDidCreateModel(listener: (model: ITextModel) => void): IDisposable {
	const modelService = StandaloneServices.get(IModelService);
	return modelService.onModelAdded(listener);
}

/**
 * Emitted right before a model is disposed.
 * @event
 */
export function onWillDisposeModel(listener: (model: ITextModel) => void): IDisposable {
	const modelService = StandaloneServices.get(IModelService);
	return modelService.onModelRemoved(listener);
}

/**
 * Emitted when a different language is set to a model.
 * @event
 */
export function onDidChangeModelLanguage(listener: (e: { readonly model: ITextModel; readonly oldLanguage: string }) => void): IDisposable {
	const modelService = StandaloneServices.get(IModelService);
	return modelService.onModelLanguageChanged((e) => {
		listener({
			model: e.model,
			oldLanguage: e.oldLanguageId
		});
	});
}

/**
 * Create a new web worker that has model syncing capabilities built in.
 * Specify an AMD module to load that will `create` an object that will be proxied.
 */
export function createWebWorker<T extends object>(opts: IInternalWebWorkerOptions): MonacoWebWorker<T> {
	return actualCreateWebWorker<T>(StandaloneServices.get(IModelService), StandaloneServices.get(IWebWorkerService), opts);
}

/**
 * Colorize the contents of `domNode` using attribute `data-lang`.
 */
export function colorizeElement(domNode: HTMLElement, options: IColorizerElementOptions): Promise<void> {
	const languageService = StandaloneServices.get(ILanguageService);
	const themeService = <StandaloneThemeService>StandaloneServices.get(IStandaloneThemeService);
	return Colorizer.colorizeElement(themeService, languageService, domNode, options).then(() => {
		themeService.registerEditorContainer(domNode);
	});
}

/**
 * Colorize `text` using language `languageId`.
 */
export function colorize(text: string, languageId: string, options: IColorizerOptions): Promise<string> {
	const languageService = StandaloneServices.get(ILanguageService);
	const themeService = <StandaloneThemeService>StandaloneServices.get(IStandaloneThemeService);
	themeService.registerEditorContainer(mainWindow.document.body);
	return Colorizer.colorize(languageService, text, languageId, options);
}

/**
 * Colorize a line in a model.
 */
export function colorizeModelLine(model: ITextModel, lineNumber: number, tabSize: number = 4): string {
	const themeService = <StandaloneThemeService>StandaloneServices.get(IStandaloneThemeService);
	themeService.registerEditorContainer(mainWindow.document.body);
	return Colorizer.colorizeModelLine(model, lineNumber, tabSize);
}

/**
 * @internal
 */
function getSafeTokenizationSupport(language: string): Omit<languages.ITokenizationSupport, 'tokenizeEncoded'> {
	const tokenizationSupport = languages.TokenizationRegistry.get(language);
	if (tokenizationSupport) {
		return tokenizationSupport;
	}
	return {
		getInitialState: () => NullState,
		tokenize: (line: string, hasEOL: boolean, state: languages.IState) => nullTokenize(language, state)
	};
}

/**
 * Tokenize `text` using language `languageId`
 */
export function tokenize(text: string, languageId: string): languages.Token[][] {
	// Needed in order to get the mode registered for subsequent look-ups
	languages.TokenizationRegistry.getOrCreate(languageId);

	const tokenizationSupport = getSafeTokenizationSupport(languageId);
	const lines = splitLines(text);
	const result: languages.Token[][] = [];
	let state = tokenizationSupport.getInitialState();
	for (let i = 0, len = lines.length; i < len; i++) {
		const line = lines[i];
		const tokenizationResult = tokenizationSupport.tokenize(line, true, state);

		result[i] = tokenizationResult.tokens;
		state = tokenizationResult.endState;
	}
	return result;
}

/**
 * Define a new theme or update an existing theme.
 */
export function defineTheme(themeName: string, themeData: IStandaloneThemeData): void {
	const standaloneThemeService = StandaloneServices.get(IStandaloneThemeService);
	standaloneThemeService.defineTheme(themeName, themeData);
}

/**
 * Switches to a theme.
 */
export function setTheme(themeName: string): void {
	const standaloneThemeService = StandaloneServices.get(IStandaloneThemeService);
	standaloneThemeService.setTheme(themeName);
}

/**
 * Clears all cached font measurements and triggers re-measurement.
 */
export function remeasureFonts(): void {
	FontMeasurements.clearAllFontInfos();
}

/**
 * Register a command.
 */
export function registerCommand(id: string, handler: (accessor: any, ...args: any[]) => void): IDisposable {
	return CommandsRegistry.registerCommand({ id, handler });
}

export interface ILinkOpener {
	open(resource: URI): boolean | Promise<boolean>;
}

/**
 * Registers a handler that is called when a link is opened in any editor. The handler callback should return `true` if the link was handled and `false` otherwise.
 * The handler that was registered last will be called first when a link is opened.
 *
 * Returns a disposable that can unregister the opener again.
 */
export function registerLinkOpener(opener: ILinkOpener): IDisposable {
	const openerService = StandaloneServices.get(IOpenerService);
	return openerService.registerOpener({
		async open(resource: string | URI) {
			if (typeof resource === 'string') {
				resource = URI.parse(resource);
			}
			return opener.open(resource);
		}
	});
}

/**
 * Represents an object that can handle editor open operations (e.g. when "go to definition" is called
 * with a resource other than the current model).
 */
export interface ICodeEditorOpener {
	/**
	 * Callback that is invoked when a resource other than the current model should be opened (e.g. when "go to definition" is called).
	 * The callback should return `true` if the request was handled and `false` otherwise.
	 * @param source The code editor instance that initiated the request.
	 * @param resource The URI of the resource that should be opened.
	 * @param selectionOrPosition An optional position or selection inside the model corresponding to `resource` that can be used to set the cursor.
	 */
	openCodeEditor(source: ICodeEditor, resource: URI, selectionOrPosition?: IRange | IPosition): boolean | Promise<boolean>;
}

/**
 * Registers a handler that is called when a resource other than the current model should be opened in the editor (e.g. "go to definition").
 * The handler callback should return `true` if the request was handled and `false` otherwise.
 *
 * Returns a disposable that can unregister the opener again.
 *
 * If no handler is registered the default behavior is to do nothing for models other than the currently attached one.
 */
export function registerEditorOpener(opener: ICodeEditorOpener): IDisposable {
	const codeEditorService = StandaloneServices.get(ICodeEditorService);
	return codeEditorService.registerCodeEditorOpenHandler(async (input: ITextResourceEditorInput, source: ICodeEditor | null, sideBySide?: boolean) => {
		if (!source) {
			return null;
		}
		const selection = input.options?.selection;
		let selectionOrPosition: IRange | IPosition | undefined;
		if (selection && typeof selection.endLineNumber === 'number' && typeof selection.endColumn === 'number') {
			selectionOrPosition = <IRange>selection;
		} else if (selection) {
			selectionOrPosition = { lineNumber: selection.startLineNumber, column: selection.startColumn };
		}
		if (await opener.openCodeEditor(source, input.resource, selectionOrPosition)) {
			return source; // return source editor to indicate that this handler has successfully handled the opening
		}
		return null; // fallback to other registered handlers
	});
}

/**
 * @internal
 */
export function createMonacoEditorAPI(): typeof monaco.editor {
	return {
		// methods
		// eslint-disable-next-line local/code-no-any-casts
		create: <any>create,
		// eslint-disable-next-line local/code-no-any-casts
		getEditors: <any>getEditors,
		// eslint-disable-next-line local/code-no-any-casts
		getDiffEditors: <any>getDiffEditors,
		// eslint-disable-next-line local/code-no-any-casts
		onDidCreateEditor: <any>onDidCreateEditor,
		// eslint-disable-next-line local/code-no-any-casts
		onDidCreateDiffEditor: <any>onDidCreateDiffEditor,
		// eslint-disable-next-line local/code-no-any-casts
		createDiffEditor: <any>createDiffEditor,

		// eslint-disable-next-line local/code-no-any-casts
		addCommand: <any>addCommand,
		// eslint-disable-next-line local/code-no-any-casts
		addEditorAction: <any>addEditorAction,
		// eslint-disable-next-line local/code-no-any-casts
		addKeybindingRule: <any>addKeybindingRule,
		// eslint-disable-next-line local/code-no-any-casts
		addKeybindingRules: <any>addKeybindingRules,

		// eslint-disable-next-line local/code-no-any-casts
		createModel: <any>createModel,
		// eslint-disable-next-line local/code-no-any-casts
		setModelLanguage: <any>setModelLanguage,
		// eslint-disable-next-line local/code-no-any-casts
		setModelMarkers: <any>setModelMarkers,
		// eslint-disable-next-line local/code-no-any-casts
		getModelMarkers: <any>getModelMarkers,
		removeAllMarkers: removeAllMarkers,
		// eslint-disable-next-line local/code-no-any-casts
		onDidChangeMarkers: <any>onDidChangeMarkers,
		// eslint-disable-next-line local/code-no-any-casts
		getModels: <any>getModels,
		// eslint-disable-next-line local/code-no-any-casts
		getModel: <any>getModel,
		// eslint-disable-next-line local/code-no-any-casts
		onDidCreateModel: <any>onDidCreateModel,
		// eslint-disable-next-line local/code-no-any-casts
		onWillDisposeModel: <any>onWillDisposeModel,
		// eslint-disable-next-line local/code-no-any-casts
		onDidChangeModelLanguage: <any>onDidChangeModelLanguage,


		// eslint-disable-next-line local/code-no-any-casts
		createWebWorker: <any>createWebWorker,
		// eslint-disable-next-line local/code-no-any-casts
		colorizeElement: <any>colorizeElement,
		// eslint-disable-next-line local/code-no-any-casts
		colorize: <any>colorize,
		// eslint-disable-next-line local/code-no-any-casts
		colorizeModelLine: <any>colorizeModelLine,
		// eslint-disable-next-line local/code-no-any-casts
		tokenize: <any>tokenize,
		// eslint-disable-next-line local/code-no-any-casts
		defineTheme: <any>defineTheme,
		// eslint-disable-next-line local/code-no-any-casts
		setTheme: <any>setTheme,
		remeasureFonts: remeasureFonts,
		registerCommand: registerCommand,

		registerLinkOpener: registerLinkOpener,
		// eslint-disable-next-line local/code-no-any-casts
		registerEditorOpener: <any>registerEditorOpener,

		// enums
		AccessibilitySupport: standaloneEnums.AccessibilitySupport,
		ContentWidgetPositionPreference: standaloneEnums.ContentWidgetPositionPreference,
		CursorChangeReason: standaloneEnums.CursorChangeReason,
		DefaultEndOfLine: standaloneEnums.DefaultEndOfLine,
		EditorAutoIndentStrategy: standaloneEnums.EditorAutoIndentStrategy,
		EditorOption: standaloneEnums.EditorOption,
		EndOfLinePreference: standaloneEnums.EndOfLinePreference,
		EndOfLineSequence: standaloneEnums.EndOfLineSequence,
		MinimapPosition: standaloneEnums.MinimapPosition,
		MinimapSectionHeaderStyle: standaloneEnums.MinimapSectionHeaderStyle,
		MouseTargetType: standaloneEnums.MouseTargetType,
		OverlayWidgetPositionPreference: standaloneEnums.OverlayWidgetPositionPreference,
		OverviewRulerLane: standaloneEnums.OverviewRulerLane,
		GlyphMarginLane: standaloneEnums.GlyphMarginLane,
		RenderLineNumbersType: standaloneEnums.RenderLineNumbersType,
		RenderMinimap: standaloneEnums.RenderMinimap,
		ScrollbarVisibility: standaloneEnums.ScrollbarVisibility,
		ScrollType: standaloneEnums.ScrollType,
		TextEditorCursorBlinkingStyle: standaloneEnums.TextEditorCursorBlinkingStyle,
		TextEditorCursorStyle: standaloneEnums.TextEditorCursorStyle,
		TrackedRangeStickiness: standaloneEnums.TrackedRangeStickiness,
		WrappingIndent: standaloneEnums.WrappingIndent,
		InjectedTextCursorStops: standaloneEnums.InjectedTextCursorStops,
		PositionAffinity: standaloneEnums.PositionAffinity,
		ShowLightbulbIconMode: standaloneEnums.ShowLightbulbIconMode,
		TextDirection: standaloneEnums.TextDirection,

		// classes
		// eslint-disable-next-line local/code-no-any-casts
		ConfigurationChangedEvent: <any>ConfigurationChangedEvent,
		// eslint-disable-next-line local/code-no-any-casts
		BareFontInfo: <any>BareFontInfo,
		// eslint-disable-next-line local/code-no-any-casts
		FontInfo: <any>FontInfo,
		// eslint-disable-next-line local/code-no-any-casts
		TextModelResolvedOptions: <any>TextModelResolvedOptions,
		// eslint-disable-next-line local/code-no-any-casts
		FindMatch: <any>FindMatch,
		// eslint-disable-next-line local/code-no-any-casts
		ApplyUpdateResult: <any>ApplyUpdateResult,
		// eslint-disable-next-line local/code-no-any-casts
		EditorZoom: <any>EditorZoom,

		// eslint-disable-next-line local/code-no-any-casts
		createMultiFileDiffEditor: <any>createMultiFileDiffEditor,

		// vars
		EditorType: EditorType,
		// eslint-disable-next-line local/code-no-any-casts
		EditorOptions: <any>EditorOptions

	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/standaloneLanguages.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/standaloneLanguages.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Color } from '../../../base/common/color.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { Position } from '../../common/core/position.js';
import { Range } from '../../common/core/range.js';
import { MetadataConsts } from '../../common/encodedTokenAttributes.js';
import * as languages from '../../common/languages.js';
import { ILanguageExtensionPoint, ILanguageService } from '../../common/languages/language.js';
import { LanguageConfiguration } from '../../common/languages/languageConfiguration.js';
import { ILanguageConfigurationService } from '../../common/languages/languageConfigurationRegistry.js';
import { ModesRegistry } from '../../common/languages/modesRegistry.js';
import { LanguageSelector } from '../../common/languageSelector.js';
import * as model from '../../common/model.js';
import { ILanguageFeaturesService } from '../../common/services/languageFeatures.js';
import * as standaloneEnums from '../../common/standalone/standaloneEnums.js';
import { StandaloneServices } from './standaloneServices.js';
import { compile } from '../common/monarch/monarchCompile.js';
import { MonarchTokenizer } from '../common/monarch/monarchLexer.js';
import { IMonarchLanguage } from '../common/monarch/monarchTypes.js';
import { IStandaloneThemeService } from '../common/standaloneTheme.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { IMarkerData, IMarkerService } from '../../../platform/markers/common/markers.js';
import { EditDeltaInfo } from '../../common/textModelEditSource.js';

/**
 * Register information about a new language.
 */
export function register(language: ILanguageExtensionPoint): void {
	// Intentionally using the `ModesRegistry` here to avoid
	// instantiating services too quickly in the standalone editor.
	ModesRegistry.registerLanguage(language);
}

/**
 * Get the information of all the registered languages.
 */
export function getLanguages(): ILanguageExtensionPoint[] {
	let result: ILanguageExtensionPoint[] = [];
	result = result.concat(ModesRegistry.getLanguages());
	return result;
}

export function getEncodedLanguageId(languageId: string): number {
	const languageService = StandaloneServices.get(ILanguageService);
	return languageService.languageIdCodec.encodeLanguageId(languageId);
}

/**
 * An event emitted when a language is associated for the first time with a text model.
 * @event
 */
export function onLanguage(languageId: string, callback: () => void): IDisposable {
	return StandaloneServices.withServices(() => {
		const languageService = StandaloneServices.get(ILanguageService);
		const disposable = languageService.onDidRequestRichLanguageFeatures((encounteredLanguageId) => {
			if (encounteredLanguageId === languageId) {
				// stop listening
				disposable.dispose();
				// invoke actual listener
				callback();
			}
		});
		return disposable;
	});
}

/**
 * An event emitted when a language is associated for the first time with a text model or
 * when a language is encountered during the tokenization of another language.
 * @event
 */
export function onLanguageEncountered(languageId: string, callback: () => void): IDisposable {
	return StandaloneServices.withServices(() => {
		const languageService = StandaloneServices.get(ILanguageService);
		const disposable = languageService.onDidRequestBasicLanguageFeatures((encounteredLanguageId) => {
			if (encounteredLanguageId === languageId) {
				// stop listening
				disposable.dispose();
				// invoke actual listener
				callback();
			}
		});
		return disposable;
	});
}

/**
 * Set the editing configuration for a language.
 */
export function setLanguageConfiguration(languageId: string, configuration: LanguageConfiguration): IDisposable {
	const languageService = StandaloneServices.get(ILanguageService);
	if (!languageService.isRegisteredLanguageId(languageId)) {
		throw new Error(`Cannot set configuration for unknown language ${languageId}`);
	}
	const languageConfigurationService = StandaloneServices.get(ILanguageConfigurationService);
	return languageConfigurationService.register(languageId, configuration, 100);
}

/**
 * @internal
 */
export class EncodedTokenizationSupportAdapter implements languages.ITokenizationSupport, IDisposable {

	private readonly _languageId: string;
	private readonly _actual: EncodedTokensProvider;

	constructor(languageId: string, actual: EncodedTokensProvider) {
		this._languageId = languageId;
		this._actual = actual;
	}

	dispose(): void {
		// NOOP
	}

	public getInitialState(): languages.IState {
		return this._actual.getInitialState();
	}

	public tokenize(line: string, hasEOL: boolean, state: languages.IState): languages.TokenizationResult {
		if (typeof this._actual.tokenize === 'function') {
			return TokenizationSupportAdapter.adaptTokenize(this._languageId, <{ tokenize(line: string, state: languages.IState): ILineTokens }>this._actual, line, state);
		}
		throw new Error('Not supported!');
	}

	public tokenizeEncoded(line: string, hasEOL: boolean, state: languages.IState): languages.EncodedTokenizationResult {
		const result = this._actual.tokenizeEncoded(line, state);
		return new languages.EncodedTokenizationResult(result.tokens, [], result.endState);
	}
}

/**
 * @internal
 */
export class TokenizationSupportAdapter implements languages.ITokenizationSupport, IDisposable {

	constructor(
		private readonly _languageId: string,
		private readonly _actual: TokensProvider,
		private readonly _languageService: ILanguageService,
		private readonly _standaloneThemeService: IStandaloneThemeService,
	) {
	}

	dispose(): void {
		// NOOP
	}

	public getInitialState(): languages.IState {
		return this._actual.getInitialState();
	}

	private static _toClassicTokens(tokens: IToken[], language: string): languages.Token[] {
		const result: languages.Token[] = [];
		let previousStartIndex: number = 0;
		for (let i = 0, len = tokens.length; i < len; i++) {
			const t = tokens[i];
			let startIndex = t.startIndex;

			// Prevent issues stemming from a buggy external tokenizer.
			if (i === 0) {
				// Force first token to start at first index!
				startIndex = 0;
			} else if (startIndex < previousStartIndex) {
				// Force tokens to be after one another!
				startIndex = previousStartIndex;
			}

			result[i] = new languages.Token(startIndex, t.scopes, language);

			previousStartIndex = startIndex;
		}
		return result;
	}

	public static adaptTokenize(language: string, actual: { tokenize(line: string, state: languages.IState): ILineTokens }, line: string, state: languages.IState): languages.TokenizationResult {
		const actualResult = actual.tokenize(line, state);
		const tokens = TokenizationSupportAdapter._toClassicTokens(actualResult.tokens, language);

		let endState: languages.IState;
		// try to save an object if possible
		if (actualResult.endState.equals(state)) {
			endState = state;
		} else {
			endState = actualResult.endState;
		}

		return new languages.TokenizationResult(tokens, endState);
	}

	public tokenize(line: string, hasEOL: boolean, state: languages.IState): languages.TokenizationResult {
		return TokenizationSupportAdapter.adaptTokenize(this._languageId, this._actual, line, state);
	}

	private _toBinaryTokens(languageIdCodec: languages.ILanguageIdCodec, tokens: IToken[]): Uint32Array {
		const languageId = languageIdCodec.encodeLanguageId(this._languageId);
		const tokenTheme = this._standaloneThemeService.getColorTheme().tokenTheme;

		const result: number[] = [];
		let resultLen = 0;
		let previousStartIndex: number = 0;
		for (let i = 0, len = tokens.length; i < len; i++) {
			const t = tokens[i];
			const metadata = tokenTheme.match(languageId, t.scopes) | MetadataConsts.BALANCED_BRACKETS_MASK;
			if (resultLen > 0 && result[resultLen - 1] === metadata) {
				// same metadata
				continue;
			}

			let startIndex = t.startIndex;

			// Prevent issues stemming from a buggy external tokenizer.
			if (i === 0) {
				// Force first token to start at first index!
				startIndex = 0;
			} else if (startIndex < previousStartIndex) {
				// Force tokens to be after one another!
				startIndex = previousStartIndex;
			}

			result[resultLen++] = startIndex;
			result[resultLen++] = metadata;

			previousStartIndex = startIndex;
		}

		const actualResult = new Uint32Array(resultLen);
		for (let i = 0; i < resultLen; i++) {
			actualResult[i] = result[i];
		}
		return actualResult;
	}

	public tokenizeEncoded(line: string, hasEOL: boolean, state: languages.IState): languages.EncodedTokenizationResult {
		const actualResult = this._actual.tokenize(line, state);
		const tokens = this._toBinaryTokens(this._languageService.languageIdCodec, actualResult.tokens);

		let endState: languages.IState;
		// try to save an object if possible
		if (actualResult.endState.equals(state)) {
			endState = state;
		} else {
			endState = actualResult.endState;
		}

		return new languages.EncodedTokenizationResult(tokens, [], endState);
	}
}

/**
 * A token.
 */
export interface IToken {
	startIndex: number;
	scopes: string;
}

/**
 * The result of a line tokenization.
 */
export interface ILineTokens {
	/**
	 * The list of tokens on the line.
	 */
	tokens: IToken[];
	/**
	 * The tokenization end state.
	 * A pointer will be held to this and the object should not be modified by the tokenizer after the pointer is returned.
	 */
	endState: languages.IState;
}

/**
 * The result of a line tokenization.
 */
export interface IEncodedLineTokens {
	/**
	 * The tokens on the line in a binary, encoded format. Each token occupies two array indices. For token i:
	 *  - at offset 2*i => startIndex
	 *  - at offset 2*i + 1 => metadata
	 * Meta data is in binary format:
	 * - -------------------------------------------
	 *     3322 2222 2222 1111 1111 1100 0000 0000
	 *     1098 7654 3210 9876 5432 1098 7654 3210
	 * - -------------------------------------------
	 *     bbbb bbbb bfff ffff ffFF FFTT LLLL LLLL
	 * - -------------------------------------------
	 *  - L = EncodedLanguageId (8 bits): Use `getEncodedLanguageId` to get the encoded ID of a language.
	 *  - T = StandardTokenType (2 bits): Other = 0, Comment = 1, String = 2, RegEx = 3.
	 *  - F = FontStyle (4 bits): None = 0, Italic = 1, Bold = 2, Underline = 4, Strikethrough = 8.
	 *  - f = foreground ColorId (9 bits)
	 *  - b = background ColorId (9 bits)
	 *  - The color value for each colorId is defined in IStandaloneThemeData.customTokenColors:
	 * e.g. colorId = 1 is stored in IStandaloneThemeData.customTokenColors[1]. Color id = 0 means no color,
	 * id = 1 is for the default foreground color, id = 2 for the default background.
	 */
	tokens: Uint32Array;
	/**
	 * The tokenization end state.
	 * A pointer will be held to this and the object should not be modified by the tokenizer after the pointer is returned.
	 */
	endState: languages.IState;
}

/**
 * A factory for token providers.
 */
export interface TokensProviderFactory {
	create(): languages.ProviderResult<TokensProvider | EncodedTokensProvider | IMonarchLanguage>;
}

/**
 * A "manual" provider of tokens.
 */
export interface TokensProvider {
	/**
	 * The initial state of a language. Will be the state passed in to tokenize the first line.
	 */
	getInitialState(): languages.IState;
	/**
	 * Tokenize a line given the state at the beginning of the line.
	 */
	tokenize(line: string, state: languages.IState): ILineTokens;
}

/**
 * A "manual" provider of tokens, returning tokens in a binary form.
 */
export interface EncodedTokensProvider {
	/**
	 * The initial state of a language. Will be the state passed in to tokenize the first line.
	 */
	getInitialState(): languages.IState;
	/**
	 * Tokenize a line given the state at the beginning of the line.
	 */
	tokenizeEncoded(line: string, state: languages.IState): IEncodedLineTokens;
	/**
	 * Tokenize a line given the state at the beginning of the line.
	 */
	tokenize?(line: string, state: languages.IState): ILineTokens;
}

function isATokensProvider(provider: TokensProvider | EncodedTokensProvider | IMonarchLanguage): provider is TokensProvider | EncodedTokensProvider {
	return (typeof provider.getInitialState === 'function');
}

function isEncodedTokensProvider(provider: TokensProvider | EncodedTokensProvider): provider is EncodedTokensProvider {
	return 'tokenizeEncoded' in provider;
}

function isThenable<T>(obj: any): obj is Thenable<T> {
	return obj && typeof obj.then === 'function';
}

/**
 * Change the color map that is used for token colors.
 * Supported formats (hex): #RRGGBB, $RRGGBBAA, #RGB, #RGBA
 */
export function setColorMap(colorMap: string[] | null): void {
	const standaloneThemeService = StandaloneServices.get(IStandaloneThemeService);
	if (colorMap) {
		const result: Color[] = [null!];
		for (let i = 1, len = colorMap.length; i < len; i++) {
			result[i] = Color.fromHex(colorMap[i]);
		}
		standaloneThemeService.setColorMapOverride(result);
	} else {
		standaloneThemeService.setColorMapOverride(null);
	}
}

/**
 * @internal
 */
function createTokenizationSupportAdapter(languageId: string, provider: TokensProvider | EncodedTokensProvider) {
	if (isEncodedTokensProvider(provider)) {
		return new EncodedTokenizationSupportAdapter(languageId, provider);
	} else {
		return new TokenizationSupportAdapter(
			languageId,
			provider,
			StandaloneServices.get(ILanguageService),
			StandaloneServices.get(IStandaloneThemeService),
		);
	}
}

/**
 * Register a tokens provider factory for a language. This tokenizer will be exclusive with a tokenizer
 * set using `setTokensProvider` or one created using `setMonarchTokensProvider`, but will work together
 * with a tokens provider set using `registerDocumentSemanticTokensProvider` or `registerDocumentRangeSemanticTokensProvider`.
 */
export function registerTokensProviderFactory(languageId: string, factory: TokensProviderFactory): IDisposable {
	const adaptedFactory = new languages.LazyTokenizationSupport(async () => {
		const result = await Promise.resolve(factory.create());
		if (!result) {
			return null;
		}
		if (isATokensProvider(result)) {
			return createTokenizationSupportAdapter(languageId, result);
		}
		return new MonarchTokenizer(StandaloneServices.get(ILanguageService), StandaloneServices.get(IStandaloneThemeService), languageId, compile(languageId, result), StandaloneServices.get(IConfigurationService));
	});
	return languages.TokenizationRegistry.registerFactory(languageId, adaptedFactory);
}

/**
 * Set the tokens provider for a language (manual implementation). This tokenizer will be exclusive
 * with a tokenizer created using `setMonarchTokensProvider`, or with `registerTokensProviderFactory`,
 * but will work together with a tokens provider set using `registerDocumentSemanticTokensProvider`
 * or `registerDocumentRangeSemanticTokensProvider`.
 */
export function setTokensProvider(languageId: string, provider: TokensProvider | EncodedTokensProvider | Thenable<TokensProvider | EncodedTokensProvider>): IDisposable {
	const languageService = StandaloneServices.get(ILanguageService);
	if (!languageService.isRegisteredLanguageId(languageId)) {
		throw new Error(`Cannot set tokens provider for unknown language ${languageId}`);
	}
	if (isThenable<TokensProvider | EncodedTokensProvider>(provider)) {
		return registerTokensProviderFactory(languageId, { create: () => provider });
	}
	return languages.TokenizationRegistry.register(languageId, createTokenizationSupportAdapter(languageId, provider));
}

/**
 * Set the tokens provider for a language (monarch implementation). This tokenizer will be exclusive
 * with a tokenizer set using `setTokensProvider`, or with `registerTokensProviderFactory`, but will
 * work together with a tokens provider set using `registerDocumentSemanticTokensProvider` or
 * `registerDocumentRangeSemanticTokensProvider`.
 */
export function setMonarchTokensProvider(languageId: string, languageDef: IMonarchLanguage | Thenable<IMonarchLanguage>): IDisposable {
	const create = (languageDef: IMonarchLanguage) => {
		return new MonarchTokenizer(StandaloneServices.get(ILanguageService), StandaloneServices.get(IStandaloneThemeService), languageId, compile(languageId, languageDef), StandaloneServices.get(IConfigurationService));
	};
	if (isThenable<IMonarchLanguage>(languageDef)) {
		return registerTokensProviderFactory(languageId, { create: () => languageDef });
	}
	return languages.TokenizationRegistry.register(languageId, create(languageDef));
}

/**
 * Register a reference provider (used by e.g. reference search).
 */
export function registerReferenceProvider(languageSelector: LanguageSelector, provider: languages.ReferenceProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.referenceProvider.register(languageSelector, provider);
}

/**
 * Register a rename provider (used by e.g. rename symbol).
 */
export function registerRenameProvider(languageSelector: LanguageSelector, provider: languages.RenameProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.renameProvider.register(languageSelector, provider);
}

/**
 * Register a new symbol-name provider (e.g., when a symbol is being renamed, show new possible symbol-names)
 */
export function registerNewSymbolNameProvider(languageSelector: LanguageSelector, provider: languages.NewSymbolNamesProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.newSymbolNamesProvider.register(languageSelector, provider);
}

/**
 * Register a signature help provider (used by e.g. parameter hints).
 */
export function registerSignatureHelpProvider(languageSelector: LanguageSelector, provider: languages.SignatureHelpProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.signatureHelpProvider.register(languageSelector, provider);
}

/**
 * Register a hover provider (used by e.g. editor hover).
 */
export function registerHoverProvider(languageSelector: LanguageSelector, provider: languages.HoverProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.hoverProvider.register(languageSelector, {
		provideHover: async (model: model.ITextModel, position: Position, token: CancellationToken, context?: languages.HoverContext<languages.Hover>): Promise<languages.Hover | undefined> => {
			const word = model.getWordAtPosition(position);

			return Promise.resolve<languages.Hover | null | undefined>(provider.provideHover(model, position, token, context)).then((value): languages.Hover | undefined => {
				if (!value) {
					return undefined;
				}
				if (!value.range && word) {
					value.range = new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
				}
				if (!value.range) {
					value.range = new Range(position.lineNumber, position.column, position.lineNumber, position.column);
				}
				return value;
			});
		}
	});
}

/**
 * Register a document symbol provider (used by e.g. outline).
 */
export function registerDocumentSymbolProvider(languageSelector: LanguageSelector, provider: languages.DocumentSymbolProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.documentSymbolProvider.register(languageSelector, provider);
}

/**
 * Register a document highlight provider (used by e.g. highlight occurrences).
 */
export function registerDocumentHighlightProvider(languageSelector: LanguageSelector, provider: languages.DocumentHighlightProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.documentHighlightProvider.register(languageSelector, provider);
}

/**
 * Register an linked editing range provider.
 */
export function registerLinkedEditingRangeProvider(languageSelector: LanguageSelector, provider: languages.LinkedEditingRangeProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.linkedEditingRangeProvider.register(languageSelector, provider);
}

/**
 * Register a definition provider (used by e.g. go to definition).
 */
export function registerDefinitionProvider(languageSelector: LanguageSelector, provider: languages.DefinitionProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.definitionProvider.register(languageSelector, provider);
}

/**
 * Register a implementation provider (used by e.g. go to implementation).
 */
export function registerImplementationProvider(languageSelector: LanguageSelector, provider: languages.ImplementationProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.implementationProvider.register(languageSelector, provider);
}

/**
 * Register a type definition provider (used by e.g. go to type definition).
 */
export function registerTypeDefinitionProvider(languageSelector: LanguageSelector, provider: languages.TypeDefinitionProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.typeDefinitionProvider.register(languageSelector, provider);
}

/**
 * Register a code lens provider (used by e.g. inline code lenses).
 */
export function registerCodeLensProvider(languageSelector: LanguageSelector, provider: languages.CodeLensProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.codeLensProvider.register(languageSelector, provider);
}

/**
 * Register a code action provider (used by e.g. quick fix).
 */
export function registerCodeActionProvider(languageSelector: LanguageSelector, provider: CodeActionProvider, metadata?: CodeActionProviderMetadata): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.codeActionProvider.register(languageSelector, {
		providedCodeActionKinds: metadata?.providedCodeActionKinds,
		documentation: metadata?.documentation,
		provideCodeActions: (model: model.ITextModel, range: Range, context: languages.CodeActionContext, token: CancellationToken): languages.ProviderResult<languages.CodeActionList> => {
			const markerService = StandaloneServices.get(IMarkerService);
			const markers = markerService.read({ resource: model.uri }).filter(m => {
				return Range.areIntersectingOrTouching(m, range);
			});
			return provider.provideCodeActions(model, range, { markers, only: context.only, trigger: context.trigger }, token);
		},
		resolveCodeAction: provider.resolveCodeAction
	});
}

/**
 * Register a formatter that can handle only entire models.
 */
export function registerDocumentFormattingEditProvider(languageSelector: LanguageSelector, provider: languages.DocumentFormattingEditProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.documentFormattingEditProvider.register(languageSelector, provider);
}

/**
 * Register a formatter that can handle a range inside a model.
 */
export function registerDocumentRangeFormattingEditProvider(languageSelector: LanguageSelector, provider: languages.DocumentRangeFormattingEditProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.documentRangeFormattingEditProvider.register(languageSelector, provider);
}

/**
 * Register a formatter than can do formatting as the user types.
 */
export function registerOnTypeFormattingEditProvider(languageSelector: LanguageSelector, provider: languages.OnTypeFormattingEditProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.onTypeFormattingEditProvider.register(languageSelector, provider);
}

/**
 * Register a link provider that can find links in text.
 */
export function registerLinkProvider(languageSelector: LanguageSelector, provider: languages.LinkProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.linkProvider.register(languageSelector, provider);
}

/**
 * Register a completion item provider (use by e.g. suggestions).
 */
export function registerCompletionItemProvider(languageSelector: LanguageSelector, provider: languages.CompletionItemProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.completionProvider.register(languageSelector, provider);
}

/**
 * Register a document color provider (used by Color Picker, Color Decorator).
 */
export function registerColorProvider(languageSelector: LanguageSelector, provider: languages.DocumentColorProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.colorProvider.register(languageSelector, provider);
}

/**
 * Register a folding range provider
 */
export function registerFoldingRangeProvider(languageSelector: LanguageSelector, provider: languages.FoldingRangeProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.foldingRangeProvider.register(languageSelector, provider);
}

/**
 * Register a declaration provider
 */
export function registerDeclarationProvider(languageSelector: LanguageSelector, provider: languages.DeclarationProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.declarationProvider.register(languageSelector, provider);
}

/**
 * Register a selection range provider
 */
export function registerSelectionRangeProvider(languageSelector: LanguageSelector, provider: languages.SelectionRangeProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.selectionRangeProvider.register(languageSelector, provider);
}

/**
 * Register a document semantic tokens provider. A semantic tokens provider will complement and enhance a
 * simple top-down tokenizer. Simple top-down tokenizers can be set either via `setMonarchTokensProvider`
 * or `setTokensProvider`.
 *
 * For the best user experience, register both a semantic tokens provider and a top-down tokenizer.
 */
export function registerDocumentSemanticTokensProvider(languageSelector: LanguageSelector, provider: languages.DocumentSemanticTokensProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.documentSemanticTokensProvider.register(languageSelector, provider);
}

/**
 * Register a document range semantic tokens provider. A semantic tokens provider will complement and enhance a
 * simple top-down tokenizer. Simple top-down tokenizers can be set either via `setMonarchTokensProvider`
 * or `setTokensProvider`.
 *
 * For the best user experience, register both a semantic tokens provider and a top-down tokenizer.
 */
export function registerDocumentRangeSemanticTokensProvider(languageSelector: LanguageSelector, provider: languages.DocumentRangeSemanticTokensProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.documentRangeSemanticTokensProvider.register(languageSelector, provider);
}

/**
 * Register an inline completions provider.
 */
export function registerInlineCompletionsProvider(languageSelector: LanguageSelector, provider: languages.InlineCompletionsProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.inlineCompletionsProvider.register(languageSelector, provider);
}

/**
 * Register an inlay hints provider.
 */
export function registerInlayHintsProvider(languageSelector: LanguageSelector, provider: languages.InlayHintsProvider): IDisposable {
	const languageFeaturesService = StandaloneServices.get(ILanguageFeaturesService);
	return languageFeaturesService.inlayHintsProvider.register(languageSelector, provider);
}

/**
 * Contains additional diagnostic information about the context in which
 * a [code action](#CodeActionProvider.provideCodeActions) is run.
 */
export interface CodeActionContext {

	/**
	 * An array of diagnostics.
	 */
	readonly markers: IMarkerData[];

	/**
	 * Requested kind of actions to return.
	 */
	readonly only?: string;

	/**
	 * The reason why code actions were requested.
	 */
	readonly trigger: languages.CodeActionTriggerType;
}

/**
 * The code action interface defines the contract between extensions and
 * the [light bulb](https://code.visualstudio.com/docs/editor/editingevolved#_code-action) feature.
 */
export interface CodeActionProvider {
	/**
	 * Provide commands for the given document and range.
	 */
	provideCodeActions(model: model.ITextModel, range: Range, context: CodeActionContext, token: CancellationToken): languages.ProviderResult<languages.CodeActionList>;

	/**
	 * Given a code action fill in the edit. Will only invoked when missing.
	 */
	resolveCodeAction?(codeAction: languages.CodeAction, token: CancellationToken): languages.ProviderResult<languages.CodeAction>;
}



/**
 * Metadata about the type of code actions that a {@link CodeActionProvider} provides.
 */
export interface CodeActionProviderMetadata {
	/**
	 * List of code action kinds that a {@link CodeActionProvider} may return.
	 *
	 * This list is used to determine if a given `CodeActionProvider` should be invoked or not.
	 * To avoid unnecessary computation, every `CodeActionProvider` should list use `providedCodeActionKinds`. The
	 * list of kinds may either be generic, such as `["quickfix", "refactor", "source"]`, or list out every kind provided,
	 * such as `["quickfix.removeLine", "source.fixAll" ...]`.
	 */
	readonly providedCodeActionKinds?: readonly string[];

	readonly documentation?: ReadonlyArray<{ readonly kind: string; readonly command: languages.Command }>;
}

/**
 * @internal
 */
export function createMonacoLanguagesAPI(): typeof monaco.languages {
	return {
		// eslint-disable-next-line local/code-no-any-casts
		register: <any>register,
		// eslint-disable-next-line local/code-no-any-casts
		getLanguages: <any>getLanguages,
		// eslint-disable-next-line local/code-no-any-casts
		onLanguage: <any>onLanguage,
		// eslint-disable-next-line local/code-no-any-casts
		onLanguageEncountered: <any>onLanguageEncountered,
		// eslint-disable-next-line local/code-no-any-casts
		getEncodedLanguageId: <any>getEncodedLanguageId,

		// provider methods
		// eslint-disable-next-line local/code-no-any-casts
		setLanguageConfiguration: <any>setLanguageConfiguration,
		setColorMap: setColorMap,
		// eslint-disable-next-line local/code-no-any-casts
		registerTokensProviderFactory: <any>registerTokensProviderFactory,
		// eslint-disable-next-line local/code-no-any-casts
		setTokensProvider: <any>setTokensProvider,
		// eslint-disable-next-line local/code-no-any-casts
		setMonarchTokensProvider: <any>setMonarchTokensProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerReferenceProvider: <any>registerReferenceProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerRenameProvider: <any>registerRenameProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerNewSymbolNameProvider: <any>registerNewSymbolNameProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerCompletionItemProvider: <any>registerCompletionItemProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerSignatureHelpProvider: <any>registerSignatureHelpProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerHoverProvider: <any>registerHoverProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerDocumentSymbolProvider: <any>registerDocumentSymbolProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerDocumentHighlightProvider: <any>registerDocumentHighlightProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerLinkedEditingRangeProvider: <any>registerLinkedEditingRangeProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerDefinitionProvider: <any>registerDefinitionProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerImplementationProvider: <any>registerImplementationProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerTypeDefinitionProvider: <any>registerTypeDefinitionProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerCodeLensProvider: <any>registerCodeLensProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerCodeActionProvider: <any>registerCodeActionProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerDocumentFormattingEditProvider: <any>registerDocumentFormattingEditProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerDocumentRangeFormattingEditProvider: <any>registerDocumentRangeFormattingEditProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerOnTypeFormattingEditProvider: <any>registerOnTypeFormattingEditProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerLinkProvider: <any>registerLinkProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerColorProvider: <any>registerColorProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerFoldingRangeProvider: <any>registerFoldingRangeProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerDeclarationProvider: <any>registerDeclarationProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerSelectionRangeProvider: <any>registerSelectionRangeProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerDocumentSemanticTokensProvider: <any>registerDocumentSemanticTokensProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerDocumentRangeSemanticTokensProvider: <any>registerDocumentRangeSemanticTokensProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerInlineCompletionsProvider: <any>registerInlineCompletionsProvider,
		// eslint-disable-next-line local/code-no-any-casts
		registerInlayHintsProvider: <any>registerInlayHintsProvider,

		// enums
		DocumentHighlightKind: standaloneEnums.DocumentHighlightKind,
		CompletionItemKind: standaloneEnums.CompletionItemKind,
		CompletionItemTag: standaloneEnums.CompletionItemTag,
		CompletionItemInsertTextRule: standaloneEnums.CompletionItemInsertTextRule,
		SymbolKind: standaloneEnums.SymbolKind,
		SymbolTag: standaloneEnums.SymbolTag,
		IndentAction: standaloneEnums.IndentAction,
		CompletionTriggerKind: standaloneEnums.CompletionTriggerKind,
		SignatureHelpTriggerKind: standaloneEnums.SignatureHelpTriggerKind,
		InlayHintKind: standaloneEnums.InlayHintKind,
		InlineCompletionTriggerKind: standaloneEnums.InlineCompletionTriggerKind,
		CodeActionTriggerType: standaloneEnums.CodeActionTriggerType,
		NewSymbolNameTag: standaloneEnums.NewSymbolNameTag,
		NewSymbolNameTriggerKind: standaloneEnums.NewSymbolNameTriggerKind,
		PartialAcceptTriggerKind: standaloneEnums.PartialAcceptTriggerKind,
		HoverVerbosityAction: standaloneEnums.HoverVerbosityAction,
		InlineCompletionEndOfLifeReasonKind: standaloneEnums.InlineCompletionEndOfLifeReasonKind,
		InlineCompletionHintStyle: standaloneEnums.InlineCompletionHintStyle,

		// classes
		FoldingRangeKind: languages.FoldingRangeKind,
		// eslint-disable-next-line local/code-no-any-casts
		SelectedSuggestionInfo: <any>languages.SelectedSuggestionInfo,
		// eslint-disable-next-line local/code-no-any-casts
		EditDeltaInfo: <any>EditDeltaInfo,
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/standaloneLayoutService.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/standaloneLayoutService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../base/browser/dom.js';
import { mainWindow } from '../../../base/browser/window.js';
import { coalesce } from '../../../base/common/arrays.js';
import { Event } from '../../../base/common/event.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { ILayoutOffsetInfo, ILayoutService } from '../../../platform/layout/browser/layoutService.js';

class StandaloneLayoutService implements ILayoutService {
	declare readonly _serviceBrand: undefined;

	readonly onDidLayoutMainContainer = Event.None;
	readonly onDidLayoutActiveContainer = Event.None;
	readonly onDidLayoutContainer = Event.None;
	readonly onDidChangeActiveContainer = Event.None;
	readonly onDidAddContainer = Event.None;

	get mainContainer(): HTMLElement {
		return this._codeEditorService.listCodeEditors().at(0)?.getContainerDomNode() ?? mainWindow.document.body;
	}

	get activeContainer(): HTMLElement {
		const activeCodeEditor = this._codeEditorService.getFocusedCodeEditor() ?? this._codeEditorService.getActiveCodeEditor();

		return activeCodeEditor?.getContainerDomNode() ?? this.mainContainer;
	}

	get mainContainerDimension(): dom.IDimension {
		return dom.getClientArea(this.mainContainer);
	}

	get activeContainerDimension() {
		return dom.getClientArea(this.activeContainer);
	}

	readonly mainContainerOffset: ILayoutOffsetInfo = { top: 0, quickPickTop: 0 };
	readonly activeContainerOffset: ILayoutOffsetInfo = { top: 0, quickPickTop: 0 };

	get containers(): Iterable<HTMLElement> {
		return coalesce(this._codeEditorService.listCodeEditors().map(codeEditor => codeEditor.getContainerDomNode()));
	}

	getContainer() {
		return this.activeContainer;
	}

	whenContainerStylesLoaded() { return undefined; }

	focus(): void {
		this._codeEditorService.getFocusedCodeEditor()?.focus();
	}

	constructor(
		@ICodeEditorService private _codeEditorService: ICodeEditorService
	) { }

}

export class EditorScopedLayoutService extends StandaloneLayoutService {
	override get mainContainer(): HTMLElement {
		return this._container;
	}
	constructor(
		private _container: HTMLElement,
		@ICodeEditorService codeEditorService: ICodeEditorService,
	) {
		super(codeEditorService);
	}
}

registerSingleton(ILayoutService, StandaloneLayoutService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/standaloneServices.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/standaloneServices.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './standaloneCodeEditorService.js';
import './standaloneLayoutService.js';
import '../../../platform/undoRedo/common/undoRedoService.js';
import '../../common/services/languageFeatureDebounce.js';
import '../../common/services/semanticTokensStylingService.js';
import '../../common/services/languageFeaturesService.js';
import '../../../platform/hover/browser/hoverService.js';
import '../../browser/services/inlineCompletionsService.js';

import * as strings from '../../../base/common/strings.js';
import * as dom from '../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { Emitter, Event, IValueWithChangeEvent, ValueWithChangeEvent } from '../../../base/common/event.js';
import { ResolvedKeybinding, KeyCodeChord, Keybinding, decodeKeybinding } from '../../../base/common/keybindings.js';
import { IDisposable, IReference, ImmortalReference, toDisposable, DisposableStore, Disposable, combinedDisposable } from '../../../base/common/lifecycle.js';
import { OS, isLinux, isMacintosh } from '../../../base/common/platform.js';
import Severity from '../../../base/common/severity.js';
import { URI } from '../../../base/common/uri.js';
import { IBulkEditOptions, IBulkEditResult, IBulkEditService, ResourceEdit, ResourceTextEdit } from '../../browser/services/bulkEditService.js';
import { isDiffEditorConfigurationKey, isEditorConfigurationKey } from '../../common/config/editorConfigurationSchema.js';
import { EditOperation, ISingleEditOperation } from '../../common/core/editOperation.js';
import { IPosition, Position as Pos } from '../../common/core/position.js';
import { Range } from '../../common/core/range.js';
import { ITextModel, ITextSnapshot } from '../../common/model.js';
import { IModelService } from '../../common/services/model.js';
import { IResolvedTextEditorModel, ITextModelContentProvider, ITextModelService } from '../../common/services/resolverService.js';
import { ITextResourceConfigurationService, ITextResourcePropertiesService, ITextResourceConfigurationChangeEvent } from '../../common/services/textResourceConfiguration.js';
import { CommandsRegistry, ICommandEvent, ICommandHandler, ICommandService } from '../../../platform/commands/common/commands.js';
import { IConfigurationChangeEvent, IConfigurationData, IConfigurationOverrides, IConfigurationService, IConfigurationModel, IConfigurationValue, ConfigurationTarget } from '../../../platform/configuration/common/configuration.js';
import { Configuration, ConfigurationModel, ConfigurationChangeEvent } from '../../../platform/configuration/common/configurationModels.js';
import { IContextKeyService, ContextKeyExpression } from '../../../platform/contextkey/common/contextkey.js';
import { IConfirmation, IConfirmationResult, IDialogService, IInputResult, IPrompt, IPromptResult, IPromptWithCustomCancel, IPromptResultWithCancel, IPromptWithDefaultCancel, IPromptBaseButton } from '../../../platform/dialogs/common/dialogs.js';
import { createDecorator, IInstantiationService, ServiceIdentifier } from '../../../platform/instantiation/common/instantiation.js';
import { AbstractKeybindingService } from '../../../platform/keybinding/common/abstractKeybindingService.js';
import { IKeybindingService, IKeyboardEvent, KeybindingsSchemaContribution } from '../../../platform/keybinding/common/keybinding.js';
import { KeybindingResolver } from '../../../platform/keybinding/common/keybindingResolver.js';
import { IKeybindingItem, KeybindingsRegistry } from '../../../platform/keybinding/common/keybindingsRegistry.js';
import { ResolvedKeybindingItem } from '../../../platform/keybinding/common/resolvedKeybindingItem.js';
import { USLayoutResolvedKeybinding } from '../../../platform/keybinding/common/usLayoutResolvedKeybinding.js';
import { ILabelService, ResourceLabelFormatter, IFormatterChangeEvent, Verbosity } from '../../../platform/label/common/label.js';
import { INotification, INotificationHandle, INotificationService, IPromptChoice, IPromptOptions, NoOpNotification, IStatusMessageOptions, INotificationSource, INotificationSourceFilter, NotificationsFilter, IStatusHandle } from '../../../platform/notification/common/notification.js';
import { IProgressRunner, IEditorProgressService, IProgressService, IProgress, IProgressCompositeOptions, IProgressDialogOptions, IProgressNotificationOptions, IProgressOptions, IProgressStep, IProgressWindowOptions } from '../../../platform/progress/common/progress.js';
import { ITelemetryService, TelemetryLevel } from '../../../platform/telemetry/common/telemetry.js';
import { ISingleFolderWorkspaceIdentifier, IWorkspaceIdentifier, IWorkspace, IWorkspaceContextService, IWorkspaceFolder, IWorkspaceFoldersChangeEvent, IWorkspaceFoldersWillChangeEvent, WorkbenchState, WorkspaceFolder, STANDALONE_EDITOR_WORKSPACE_ID } from '../../../platform/workspace/common/workspace.js';
import { ILayoutService } from '../../../platform/layout/browser/layoutService.js';
import { StandaloneServicesNLS } from '../../common/standaloneStrings.js';
import { basename } from '../../../base/common/resources.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { ConsoleLogger, ILoggerService, ILogService, NullLoggerService } from '../../../platform/log/common/log.js';
import { IWorkspaceTrustManagementService, IWorkspaceTrustTransitionParticipant, IWorkspaceTrustUriInfo } from '../../../platform/workspace/common/workspaceTrust.js';
import { EditorOption } from '../../common/config/editorOptions.js';
import { ICodeEditor, IDiffEditor } from '../../browser/editorBrowser.js';
import { IContextMenuService, IContextViewDelegate, IContextViewService, IOpenContextView } from '../../../platform/contextview/browser/contextView.js';
import { ContextViewService } from '../../../platform/contextview/browser/contextViewService.js';
import { LanguageService } from '../../common/services/languageService.js';
import { ContextMenuService } from '../../../platform/contextview/browser/contextMenuService.js';
import { getSingletonServiceDescriptors, InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { OpenerService } from '../../browser/services/openerService.js';
import { ILanguageService } from '../../common/languages/language.js';
import { MarkerDecorationsService } from '../../common/services/markerDecorationsService.js';
import { IMarkerDecorationsService } from '../../common/services/markerDecorations.js';
import { ModelService } from '../../common/services/modelService.js';
import { StandaloneQuickInputService } from './quickInput/standaloneQuickInputService.js';
import { StandaloneThemeService } from './standaloneThemeService.js';
import { IStandaloneThemeService } from '../common/standaloneTheme.js';
import { AccessibilityService } from '../../../platform/accessibility/browser/accessibilityService.js';
import { IAccessibilityService } from '../../../platform/accessibility/common/accessibility.js';
import { IMenuService } from '../../../platform/actions/common/actions.js';
import { MenuService } from '../../../platform/actions/common/menuService.js';
import { BrowserClipboardService } from '../../../platform/clipboard/browser/clipboardService.js';
import { IClipboardService } from '../../../platform/clipboard/common/clipboardService.js';
import { ContextKeyService } from '../../../platform/contextkey/browser/contextKeyService.js';
import { SyncDescriptor } from '../../../platform/instantiation/common/descriptors.js';
import { InstantiationService } from '../../../platform/instantiation/common/instantiationService.js';
import { ServiceCollection } from '../../../platform/instantiation/common/serviceCollection.js';
import { IListService, ListService } from '../../../platform/list/browser/listService.js';
import { IMarkerService } from '../../../platform/markers/common/markers.js';
import { MarkerService } from '../../../platform/markers/common/markerService.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
import { IQuickInputService } from '../../../platform/quickinput/common/quickInput.js';
import { IStorageService, InMemoryStorageService } from '../../../platform/storage/common/storage.js';
import { DefaultConfiguration } from '../../../platform/configuration/common/configurations.js';
import { WorkspaceEdit } from '../../common/languages.js';
import { AccessibilitySignal, AccessibilityModality, IAccessibilitySignalService, Sound } from '../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { LogService } from '../../../platform/log/common/logService.js';
import { getEditorFeatures } from '../../common/editorFeatures.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { ExtensionKind, IEnvironmentService, IExtensionHostDebugParams } from '../../../platform/environment/common/environment.js';
import { mainWindow } from '../../../base/browser/window.js';
import { ResourceMap } from '../../../base/common/map.js';
import { ITreeSitterLibraryService } from '../../common/services/treeSitter/treeSitterLibraryService.js';
import { StandaloneTreeSitterLibraryService } from './standaloneTreeSitterLibraryService.js';
import { IDataChannelService, NullDataChannelService } from '../../../platform/dataChannel/common/dataChannel.js';
import { IWebWorkerService } from '../../../platform/webWorker/browser/webWorkerService.js';
import { StandaloneWebWorkerService } from './services/standaloneWebWorkerService.js';
import { IDefaultAccountService } from '../../../platform/defaultAccount/common/defaultAccount.js';
import { IDefaultAccount } from '../../../base/common/defaultAccount.js';

class SimpleModel implements IResolvedTextEditorModel {

	private readonly model: ITextModel;
	private readonly _onWillDispose: Emitter<void>;

	constructor(model: ITextModel) {
		this.model = model;
		this._onWillDispose = new Emitter<void>();
	}

	public get onWillDispose(): Event<void> {
		return this._onWillDispose.event;
	}

	public resolve(): Promise<void> {
		return Promise.resolve();
	}

	public get textEditorModel(): ITextModel {
		return this.model;
	}

	public createSnapshot(): ITextSnapshot {
		return this.model.createSnapshot();
	}

	public isReadonly(): boolean {
		return false;
	}

	private disposed = false;
	public dispose(): void {
		this.disposed = true;

		this._onWillDispose.fire();
	}

	public isDisposed(): boolean {
		return this.disposed;
	}

	public isResolved(): boolean {
		return true;
	}

	public getLanguageId(): string | undefined {
		return this.model.getLanguageId();
	}
}

class StandaloneTextModelService implements ITextModelService {
	public _serviceBrand: undefined;

	constructor(
		@IModelService private readonly modelService: IModelService
	) { }

	public createModelReference(resource: URI): Promise<IReference<IResolvedTextEditorModel>> {
		const model = this.modelService.getModel(resource);

		if (!model) {
			return Promise.reject(new Error(`Model not found`));
		}

		return Promise.resolve(new ImmortalReference(new SimpleModel(model)));
	}

	public registerTextModelContentProvider(scheme: string, provider: ITextModelContentProvider): IDisposable {
		return {
			dispose: function () { /* no op */ }
		};
	}

	public canHandleResource(resource: URI): boolean {
		return false;
	}
}

class StandaloneEditorProgressService implements IEditorProgressService {
	declare readonly _serviceBrand: undefined;

	private static NULL_PROGRESS_RUNNER: IProgressRunner = {
		done: () => { },
		total: () => { },
		worked: () => { }
	};

	show(infinite: true, delay?: number): IProgressRunner;
	show(total: number, delay?: number): IProgressRunner;
	show(): IProgressRunner {
		return StandaloneEditorProgressService.NULL_PROGRESS_RUNNER;
	}

	async showWhile(promise: Promise<unknown>, delay?: number): Promise<void> {
		await promise;
	}
}

class StandaloneProgressService implements IProgressService {

	declare readonly _serviceBrand: undefined;

	withProgress<R>(_options: IProgressOptions | IProgressDialogOptions | IProgressNotificationOptions | IProgressWindowOptions | IProgressCompositeOptions, task: (progress: IProgress<IProgressStep>) => Promise<R>, onDidCancel?: ((choice?: number | undefined) => void) | undefined): Promise<R> {
		return task({
			report: () => { },
		});
	}
}

class StandaloneEnvironmentService implements IEnvironmentService {

	declare readonly _serviceBrand: undefined;

	readonly stateResource: URI = URI.from({ scheme: 'monaco', authority: 'stateResource' });
	readonly userRoamingDataHome: URI = URI.from({ scheme: 'monaco', authority: 'userRoamingDataHome' });
	readonly keyboardLayoutResource: URI = URI.from({ scheme: 'monaco', authority: 'keyboardLayoutResource' });
	readonly argvResource: URI = URI.from({ scheme: 'monaco', authority: 'argvResource' });
	readonly untitledWorkspacesHome: URI = URI.from({ scheme: 'monaco', authority: 'untitledWorkspacesHome' });
	readonly workspaceStorageHome: URI = URI.from({ scheme: 'monaco', authority: 'workspaceStorageHome' });
	readonly localHistoryHome: URI = URI.from({ scheme: 'monaco', authority: 'localHistoryHome' });
	readonly cacheHome: URI = URI.from({ scheme: 'monaco', authority: 'cacheHome' });
	readonly userDataSyncHome: URI = URI.from({ scheme: 'monaco', authority: 'userDataSyncHome' });
	readonly sync: 'on' | 'off' | undefined = undefined;
	readonly continueOn?: string | undefined = undefined;
	readonly editSessionId?: string | undefined = undefined;
	readonly debugExtensionHost: IExtensionHostDebugParams = { port: null, break: false };
	readonly isExtensionDevelopment: boolean = false;
	readonly disableExtensions: boolean | string[] = false;
	readonly disableExperiments: boolean = false;
	readonly enableExtensions?: readonly string[] | undefined = undefined;
	readonly extensionDevelopmentLocationURI?: URI[] | undefined = undefined;
	readonly extensionDevelopmentKind?: ExtensionKind[] | undefined = undefined;
	readonly extensionTestsLocationURI?: URI | undefined = undefined;
	readonly logsHome: URI = URI.from({ scheme: 'monaco', authority: 'logsHome' });
	readonly logLevel?: string | undefined = undefined;
	readonly extensionLogLevel?: [string, string][] | undefined = undefined;
	readonly verbose: boolean = false;
	readonly isBuilt: boolean = false;
	readonly disableTelemetry: boolean = false;
	readonly serviceMachineIdResource: URI = URI.from({ scheme: 'monaco', authority: 'serviceMachineIdResource' });
	readonly policyFile?: URI | undefined = undefined;
}

class StandaloneDialogService implements IDialogService {

	_serviceBrand: undefined;

	readonly onWillShowDialog = Event.None;
	readonly onDidShowDialog = Event.None;

	async confirm(confirmation: IConfirmation): Promise<IConfirmationResult> {
		const confirmed = this.doConfirm(confirmation.message, confirmation.detail);

		return {
			confirmed,
			checkboxChecked: false // unsupported
		};
	}

	private doConfirm(message: string, detail?: string): boolean {
		let messageText = message;
		if (detail) {
			messageText = messageText + '\n\n' + detail;
		}

		return mainWindow.confirm(messageText);
	}

	prompt<T>(prompt: IPromptWithCustomCancel<T>): Promise<IPromptResultWithCancel<T>>;
	prompt<T>(prompt: IPrompt<T>): Promise<IPromptResult<T>>;
	prompt<T>(prompt: IPromptWithDefaultCancel<T>): Promise<IPromptResult<T>>;
	async prompt<T>(prompt: IPrompt<T> | IPromptWithCustomCancel<T>): Promise<IPromptResult<T> | IPromptResultWithCancel<T>> {
		let result: T | undefined = undefined;
		const confirmed = this.doConfirm(prompt.message, prompt.detail);
		if (confirmed) {
			const promptButtons: IPromptBaseButton<T>[] = [...(prompt.buttons ?? [])];
			if (prompt.cancelButton && typeof prompt.cancelButton !== 'string' && typeof prompt.cancelButton !== 'boolean') {
				promptButtons.push(prompt.cancelButton);
			}

			result = await promptButtons[0]?.run({ checkboxChecked: false });
		}

		return { result };
	}

	async info(message: string, detail?: string): Promise<void> {
		await this.prompt({ type: Severity.Info, message, detail });
	}

	async warn(message: string, detail?: string): Promise<void> {
		await this.prompt({ type: Severity.Warning, message, detail });
	}

	async error(message: string, detail?: string): Promise<void> {
		await this.prompt({ type: Severity.Error, message, detail });
	}

	input(): Promise<IInputResult> {
		return Promise.resolve({ confirmed: false }); // unsupported
	}

	about(): Promise<void> {
		return Promise.resolve(undefined);
	}
}

export class StandaloneNotificationService implements INotificationService {

	readonly onDidChangeFilter: Event<void> = Event.None;

	public _serviceBrand: undefined;

	private static readonly NO_OP: INotificationHandle = new NoOpNotification();

	public info(message: string): INotificationHandle {
		return this.notify({ severity: Severity.Info, message });
	}

	public warn(message: string): INotificationHandle {
		return this.notify({ severity: Severity.Warning, message });
	}

	public error(error: string | Error): INotificationHandle {
		return this.notify({ severity: Severity.Error, message: error });
	}

	public notify(notification: INotification): INotificationHandle {
		switch (notification.severity) {
			case Severity.Error:
				console.error(notification.message);
				break;
			case Severity.Warning:
				console.warn(notification.message);
				break;
			default:
				console.log(notification.message);
				break;
		}

		return StandaloneNotificationService.NO_OP;
	}

	public prompt(severity: Severity, message: string, choices: IPromptChoice[], options?: IPromptOptions): INotificationHandle {
		return StandaloneNotificationService.NO_OP;
	}

	public status(message: string | Error, options?: IStatusMessageOptions): IStatusHandle {
		return { close: () => { } };
	}

	public setFilter(filter: NotificationsFilter | INotificationSourceFilter): void { }

	public getFilter(source?: INotificationSource): NotificationsFilter {
		return NotificationsFilter.OFF;
	}

	public getFilters(): INotificationSourceFilter[] {
		return [];
	}

	public removeFilter(sourceId: string): void { }
}

export class StandaloneCommandService implements ICommandService {
	declare readonly _serviceBrand: undefined;

	private readonly _instantiationService: IInstantiationService;

	private readonly _onWillExecuteCommand = new Emitter<ICommandEvent>();
	private readonly _onDidExecuteCommand = new Emitter<ICommandEvent>();
	public readonly onWillExecuteCommand: Event<ICommandEvent> = this._onWillExecuteCommand.event;
	public readonly onDidExecuteCommand: Event<ICommandEvent> = this._onDidExecuteCommand.event;

	constructor(
		@IInstantiationService instantiationService: IInstantiationService
	) {
		this._instantiationService = instantiationService;
	}

	public executeCommand<T>(id: string, ...args: unknown[]): Promise<T> {
		const command = CommandsRegistry.getCommand(id);
		if (!command) {
			return Promise.reject(new Error(`command '${id}' not found`));
		}

		try {
			this._onWillExecuteCommand.fire({ commandId: id, args });
			const result = this._instantiationService.invokeFunction.apply(this._instantiationService, [command.handler, ...args]) as T;

			this._onDidExecuteCommand.fire({ commandId: id, args });
			return Promise.resolve(result);
		} catch (err) {
			return Promise.reject(err);
		}
	}
}

export interface IKeybindingRule {
	keybinding: number;
	command?: string | null;
	commandArgs?: unknown;
	when?: ContextKeyExpression | null;
}

export class StandaloneKeybindingService extends AbstractKeybindingService {
	private _cachedResolver: KeybindingResolver | null;
	private _dynamicKeybindings: IKeybindingItem[];
	private readonly _domNodeListeners: DomNodeListeners[];

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@ICommandService commandService: ICommandService,
		@ITelemetryService telemetryService: ITelemetryService,
		@INotificationService notificationService: INotificationService,
		@ILogService logService: ILogService,
		@ICodeEditorService codeEditorService: ICodeEditorService
	) {
		super(contextKeyService, commandService, telemetryService, notificationService, logService);

		this._cachedResolver = null;
		this._dynamicKeybindings = [];
		this._domNodeListeners = [];

		const addContainer = (domNode: HTMLElement) => {
			const disposables = new DisposableStore();

			// for standard keybindings
			disposables.add(dom.addDisposableListener(domNode, dom.EventType.KEY_DOWN, (e: KeyboardEvent) => {
				const keyEvent = new StandardKeyboardEvent(e);
				const shouldPreventDefault = this._dispatch(keyEvent, keyEvent.target);
				if (shouldPreventDefault) {
					keyEvent.preventDefault();
					keyEvent.stopPropagation();
				}
			}));

			// for single modifier chord keybindings (e.g. shift shift)
			disposables.add(dom.addDisposableListener(domNode, dom.EventType.KEY_UP, (e: KeyboardEvent) => {
				const keyEvent = new StandardKeyboardEvent(e);
				const shouldPreventDefault = this._singleModifierDispatch(keyEvent, keyEvent.target);
				if (shouldPreventDefault) {
					keyEvent.preventDefault();
				}
			}));

			this._domNodeListeners.push(new DomNodeListeners(domNode, disposables));
		};
		const removeContainer = (domNode: HTMLElement) => {
			for (let i = 0; i < this._domNodeListeners.length; i++) {
				const domNodeListeners = this._domNodeListeners[i];
				if (domNodeListeners.domNode === domNode) {
					this._domNodeListeners.splice(i, 1);
					domNodeListeners.dispose();
				}
			}
		};

		const addCodeEditor = (codeEditor: ICodeEditor) => {
			if (codeEditor.getOption(EditorOption.inDiffEditor)) {
				return;
			}
			addContainer(codeEditor.getContainerDomNode());
		};
		const removeCodeEditor = (codeEditor: ICodeEditor) => {
			if (codeEditor.getOption(EditorOption.inDiffEditor)) {
				return;
			}
			removeContainer(codeEditor.getContainerDomNode());
		};
		this._register(codeEditorService.onCodeEditorAdd(addCodeEditor));
		this._register(codeEditorService.onCodeEditorRemove(removeCodeEditor));
		codeEditorService.listCodeEditors().forEach(addCodeEditor);

		const addDiffEditor = (diffEditor: IDiffEditor) => {
			addContainer(diffEditor.getContainerDomNode());
		};
		const removeDiffEditor = (diffEditor: IDiffEditor) => {
			removeContainer(diffEditor.getContainerDomNode());
		};
		this._register(codeEditorService.onDiffEditorAdd(addDiffEditor));
		this._register(codeEditorService.onDiffEditorRemove(removeDiffEditor));
		codeEditorService.listDiffEditors().forEach(addDiffEditor);
	}

	public addDynamicKeybinding(command: string, keybinding: number, handler: ICommandHandler, when: ContextKeyExpression | undefined): IDisposable {
		return combinedDisposable(
			CommandsRegistry.registerCommand(command, handler),
			this.addDynamicKeybindings([{
				keybinding,
				command,
				when
			}])
		);
	}

	public addDynamicKeybindings(rules: IKeybindingRule[]): IDisposable {
		const entries: IKeybindingItem[] = rules.map((rule) => {
			const keybinding = decodeKeybinding(rule.keybinding, OS);
			return {
				keybinding,
				command: rule.command ?? null,
				commandArgs: rule.commandArgs,
				when: rule.when,
				weight1: 1000,
				weight2: 0,
				extensionId: null,
				isBuiltinExtension: false
			};
		});
		this._dynamicKeybindings = this._dynamicKeybindings.concat(entries);

		this.updateResolver();

		return toDisposable(() => {
			// Search the first entry and remove them all since they will be contiguous
			for (let i = 0; i < this._dynamicKeybindings.length; i++) {
				if (this._dynamicKeybindings[i] === entries[0]) {
					this._dynamicKeybindings.splice(i, entries.length);
					this.updateResolver();
					return;
				}
			}
		});
	}

	private updateResolver(): void {
		this._cachedResolver = null;
		this._onDidUpdateKeybindings.fire();
	}

	protected _getResolver(): KeybindingResolver {
		if (!this._cachedResolver) {
			const defaults = this._toNormalizedKeybindingItems(KeybindingsRegistry.getDefaultKeybindings(), true);
			const overrides = this._toNormalizedKeybindingItems(this._dynamicKeybindings, false);
			this._cachedResolver = new KeybindingResolver(defaults, overrides, (str) => this._log(str));
		}
		return this._cachedResolver;
	}

	protected _documentHasFocus(): boolean {
		return mainWindow.document.hasFocus();
	}

	private _toNormalizedKeybindingItems(items: IKeybindingItem[], isDefault: boolean): ResolvedKeybindingItem[] {
		const result: ResolvedKeybindingItem[] = [];
		let resultLen = 0;
		for (const item of items) {
			const when = item.when || undefined;
			const keybinding = item.keybinding;

			if (!keybinding) {
				// This might be a removal keybinding item in user settings => accept it
				result[resultLen++] = new ResolvedKeybindingItem(undefined, item.command, item.commandArgs, when, isDefault, null, false);
			} else {
				const resolvedKeybindings = USLayoutResolvedKeybinding.resolveKeybinding(keybinding, OS);
				for (const resolvedKeybinding of resolvedKeybindings) {
					result[resultLen++] = new ResolvedKeybindingItem(resolvedKeybinding, item.command, item.commandArgs, when, isDefault, null, false);
				}
			}
		}

		return result;
	}

	public resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[] {
		return USLayoutResolvedKeybinding.resolveKeybinding(keybinding, OS);
	}

	public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding {
		const chord = new KeyCodeChord(
			keyboardEvent.ctrlKey,
			keyboardEvent.shiftKey,
			keyboardEvent.altKey,
			keyboardEvent.metaKey,
			keyboardEvent.keyCode
		);
		return new USLayoutResolvedKeybinding([chord], OS);
	}

	public resolveUserBinding(userBinding: string): ResolvedKeybinding[] {
		return [];
	}

	public _dumpDebugInfo(): string {
		return '';
	}

	public _dumpDebugInfoJSON(): string {
		return '';
	}

	public registerSchemaContribution(contribution: KeybindingsSchemaContribution): IDisposable {
		return Disposable.None;
	}

	/**
	 * not yet supported
	 */
	public override enableKeybindingHoldMode(commandId: string): Promise<void> | undefined {
		return undefined;
	}
}

class DomNodeListeners extends Disposable {
	constructor(
		public readonly domNode: HTMLElement,
		disposables: DisposableStore
	) {
		super();
		this._register(disposables);
	}
}

function isConfigurationOverrides(thing: unknown): thing is IConfigurationOverrides {
	return !!thing
		&& typeof thing === 'object'
		&& (!(thing as IConfigurationOverrides).overrideIdentifier || typeof (thing as IConfigurationOverrides).overrideIdentifier === 'string')
		&& (!(thing as IConfigurationOverrides).resource || (thing as IConfigurationOverrides).resource instanceof URI);
}

export class StandaloneConfigurationService implements IConfigurationService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeConfiguration = new Emitter<IConfigurationChangeEvent>();
	public readonly onDidChangeConfiguration: Event<IConfigurationChangeEvent> = this._onDidChangeConfiguration.event;

	private readonly _configuration: Configuration;

	constructor(
		@ILogService private readonly logService: ILogService,
	) {
		const defaultConfiguration = new DefaultConfiguration(logService);
		this._configuration = new Configuration(
			defaultConfiguration.reload(),
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			new ResourceMap<ConfigurationModel>(),
			ConfigurationModel.createEmptyModel(logService),
			new ResourceMap<ConfigurationModel>(),
			logService
		);
		defaultConfiguration.dispose();
	}

	getValue<T>(): T;
	getValue<T>(section: string): T;
	getValue<T>(overrides: IConfigurationOverrides): T;
	getValue<T>(section: string, overrides: IConfigurationOverrides): T;
	getValue(arg1?: unknown, arg2?: unknown): unknown {
		const section = typeof arg1 === 'string' ? arg1 : undefined;
		const overrides = isConfigurationOverrides(arg1) ? arg1 : isConfigurationOverrides(arg2) ? arg2 : {};
		return this._configuration.getValue(section, overrides, undefined);
	}

	public updateValues(values: [string, unknown][]): Promise<void> {
		const previous = { data: this._configuration.toData() };

		const changedKeys: string[] = [];

		for (const entry of values) {
			const [key, value] = entry;
			if (this.getValue(key) === value) {
				continue;
			}
			this._configuration.updateValue(key, value);
			changedKeys.push(key);
		}

		if (changedKeys.length > 0) {
			const configurationChangeEvent = new ConfigurationChangeEvent({ keys: changedKeys, overrides: [] }, previous, this._configuration, undefined, this.logService);
			configurationChangeEvent.source = ConfigurationTarget.MEMORY;
			this._onDidChangeConfiguration.fire(configurationChangeEvent);
		}

		return Promise.resolve();
	}

	public updateValue(key: string, value: unknown, arg3?: unknown, arg4?: unknown): Promise<void> {
		return this.updateValues([[key, value]]);
	}

	public inspect<C>(key: string, options: IConfigurationOverrides = {}): IConfigurationValue<C> {
		return this._configuration.inspect<C>(key, options, undefined);
	}

	public keys() {
		return this._configuration.keys(undefined);
	}

	public reloadConfiguration(): Promise<void> {
		return Promise.resolve(undefined);
	}

	public getConfigurationData(): IConfigurationData | null {
		const emptyModel: IConfigurationModel = {
			contents: {},
			keys: [],
			overrides: []
		};
		return {
			defaults: emptyModel,
			policy: emptyModel,
			application: emptyModel,
			userLocal: emptyModel,
			userRemote: emptyModel,
			workspace: emptyModel,
			folders: []
		};
	}
}

class StandaloneResourceConfigurationService implements ITextResourceConfigurationService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeConfiguration = new Emitter<ITextResourceConfigurationChangeEvent>();
	public readonly onDidChangeConfiguration = this._onDidChangeConfiguration.event;

	constructor(
		@IConfigurationService private readonly configurationService: StandaloneConfigurationService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService
	) {
		this.configurationService.onDidChangeConfiguration((e) => {
			this._onDidChangeConfiguration.fire({ affectedKeys: e.affectedKeys, affectsConfiguration: (resource: URI, configuration: string) => e.affectsConfiguration(configuration) });
		});
	}

	getValue<T>(resource: URI, section?: string): T;
	getValue<T>(resource: URI, position?: IPosition, section?: string): T;
	getValue<T>(resource: URI | undefined, arg2?: unknown, arg3?: unknown) {
		const position: IPosition | null = Pos.isIPosition(arg2) ? arg2 : null;
		const section: string | undefined = position ? (typeof arg3 === 'string' ? arg3 : undefined) : (typeof arg2 === 'string' ? arg2 : undefined);
		const language = resource ? this.getLanguage(resource, position) : undefined;
		if (typeof section === 'undefined') {
			return this.configurationService.getValue<T>({
				resource,
				overrideIdentifier: language
			});
		}
		return this.configurationService.getValue<T>(section, {
			resource,
			overrideIdentifier: language
		});
	}

	inspect<T>(resource: URI | undefined, position: IPosition | null, section: string): IConfigurationValue<Readonly<T>> {
		const language = resource ? this.getLanguage(resource, position) : undefined;
		return this.configurationService.inspect<T>(section, { resource, overrideIdentifier: language });
	}

	private getLanguage(resource: URI, position: IPosition | null): string | null {
		const model = this.modelService.getModel(resource);
		if (model) {
			return position ? model.getLanguageIdAtPosition(position.lineNumber, position.column) : model.getLanguageId();
		}
		return this.languageService.guessLanguageIdByFilepathOrFirstLine(resource);
	}

	updateValue(resource: URI, key: string, value: unknown, configurationTarget?: ConfigurationTarget): Promise<void> {
		return this.configurationService.updateValue(key, value, { resource }, configurationTarget);
	}
}

class StandaloneResourcePropertiesService implements ITextResourcePropertiesService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
	}

	getEOL(resource: URI, language?: string): string {
		const eol = this.configurationService.getValue('files.eol', { overrideIdentifier: language, resource });
		if (eol && typeof eol === 'string' && eol !== 'auto') {
			return eol;
		}
		return (isLinux || isMacintosh) ? '\n' : '\r\n';
	}
}

class StandaloneTelemetryService implements ITelemetryService {
	declare readonly _serviceBrand: undefined;
	readonly telemetryLevel = TelemetryLevel.NONE;
	readonly sessionId = 'someValue.sessionId';
	readonly machineId = 'someValue.machineId';
	readonly sqmId = 'someValue.sqmId';
	readonly devDeviceId = 'someValue.devDeviceId';
	readonly firstSessionDate = 'someValue.firstSessionDate';
	readonly sendErrorTelemetry = false;
	setEnabled(): void { }
	setExperimentProperty(): void { }
	publicLog() { }
	publicLog2() { }
	publicLogError() { }
	publicLogError2() { }
}

class StandaloneWorkspaceContextService implements IWorkspaceContextService {

	public _serviceBrand: undefined;

	private static readonly SCHEME = 'inmemory';

	private readonly _onDidChangeWorkspaceName = new Emitter<void>();
	public readonly onDidChangeWorkspaceName: Event<void> = this._onDidChangeWorkspaceName.event;

	private readonly _onWillChangeWorkspaceFolders = new Emitter<IWorkspaceFoldersWillChangeEvent>();
	public readonly onWillChangeWorkspaceFolders: Event<IWorkspaceFoldersWillChangeEvent> = this._onWillChangeWorkspaceFolders.event;

	private readonly _onDidChangeWorkspaceFolders = new Emitter<IWorkspaceFoldersChangeEvent>();
	public readonly onDidChangeWorkspaceFolders: Event<IWorkspaceFoldersChangeEvent> = this._onDidChangeWorkspaceFolders.event;

	private readonly _onDidChangeWorkbenchState = new Emitter<WorkbenchState>();
	public readonly onDidChangeWorkbenchState: Event<WorkbenchState> = this._onDidChangeWorkbenchState.event;

	private readonly workspace: IWorkspace;

	constructor() {
		const resource = URI.from({ scheme: StandaloneWorkspaceContextService.SCHEME, authority: 'model', path: '/' });
		this.workspace = { id: STANDALONE_EDITOR_WORKSPACE_ID, folders: [new WorkspaceFolder({ uri: resource, name: '', index: 0 })] };
	}

	getCompleteWorkspace(): Promise<IWorkspace> {
		return Promise.resolve(this.getWorkspace());
	}

	public getWorkspace(): IWorkspace {
		return this.workspace;
	}

	public getWorkbenchState(): WorkbenchState {
		if (this.workspace) {
			if (this.workspace.configuration) {
				return WorkbenchState.WORKSPACE;
			}
			return WorkbenchState.FOLDER;
		}
		return WorkbenchState.EMPTY;
	}

	public getWorkspaceFolder(resource: URI): IWorkspaceFolder | null {
		return resource && resource.scheme === StandaloneWorkspaceContextService.SCHEME ? this.workspace.folders[0] : null;
	}

	public isInsideWorkspace(resource: URI): boolean {
		return resource && resource.scheme === StandaloneWorkspaceContextService.SCHEME;
	}

	public isCurrentWorkspace(workspaceIdOrFolder: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | URI): boolean {
		return true;
	}
}

export function updateConfigurationService(configurationService: IConfigurationService, source: any, isDiffEditor: boolean): void {
	if (!source) {
		return;
	}
	if (!(configurationService instanceof StandaloneConfigurationService)) {
		return;
	}
	const toUpdate: [string, unknown][] = [];
	Object.keys(source).forEach((key) => {
		if (isEditorConfigurationKey(key)) {
			toUpdate.push([`editor.${key}`, source[key]]);
		}
		if (isDiffEditor && isDiffEditorConfigurationKey(key)) {
			toUpdate.push([`diffEditor.${key}`, source[key]]);
		}
	});
	if (toUpdate.length > 0) {
		configurationService.updateValues(toUpdate);
	}
}

class StandaloneBulkEditService implements IBulkEditService {
	declare readonly _serviceBrand: undefined;

	constructor(
		@IModelService private readonly _modelService: IModelService
	) {
		//
	}

	hasPreviewHandler(): false {
		return false;
	}

	setPreviewHandler(): IDisposable {
		return Disposable.None;
	}

	async apply(editsIn: ResourceEdit[] | WorkspaceEdit, _options?: IBulkEditOptions): Promise<IBulkEditResult> {
		const edits = Array.isArray(editsIn) ? editsIn : ResourceEdit.convert(editsIn);
		const textEdits = new Map<ITextModel, ISingleEditOperation[]>();

		for (const edit of edits) {
			if (!(edit instanceof ResourceTextEdit)) {
				throw new Error('bad edit - only text edits are supported');
			}
			const model = this._modelService.getModel(edit.resource);
			if (!model) {
				throw new Error('bad edit - model not found');
			}
			if (typeof edit.versionId === 'number' && model.getVersionId() !== edit.versionId) {
				throw new Error('bad state - model changed in the meantime');
			}
			let array = textEdits.get(model);
			if (!array) {
				array = [];
				textEdits.set(model, array);
			}
			array.push(EditOperation.replaceMove(Range.lift(edit.textEdit.range), edit.textEdit.text));
		}


		let totalEdits = 0;
		let totalFiles = 0;
		for (const [model, edits] of textEdits) {
			model.pushStackElement();
			model.pushEditOperations([], edits, () => []);
			model.pushStackElement();
			totalFiles += 1;
			totalEdits += edits.length;
		}

		return {
			ariaSummary: strings.format(StandaloneServicesNLS.bulkEditServiceSummary, totalEdits, totalFiles),
			isApplied: totalEdits > 0
		};
	}
}

class StandaloneUriLabelService implements ILabelService {

	declare readonly _serviceBrand: undefined;

	public readonly onDidChangeFormatters: Event<IFormatterChangeEvent> = Event.None;

	public getUriLabel(resource: URI, options?: { relative?: boolean; forceNoTildify?: boolean }): string {
		if (resource.scheme === 'file') {
			return resource.fsPath;
		}
		return resource.path;
	}

	getUriBasenameLabel(resource: URI): string {
		return basename(resource);
	}

	public getWorkspaceLabel(workspace: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | URI | IWorkspace, options?: { verbose: Verbosity }): string {
		return '';
	}

	public getSeparator(scheme: string, authority?: string): '/' | '\\' {
		return '/';
	}

	public registerFormatter(formatter: ResourceLabelFormatter): IDisposable {
		throw new Error('Not implemented');
	}

	public registerCachedFormatter(formatter: ResourceLabelFormatter): IDisposable {
		return this.registerFormatter(formatter);
	}

	public getHostLabel(): string {
		return '';
	}

	public getHostTooltip(): string | undefined {
		return undefined;
	}
}


class StandaloneContextViewService extends ContextViewService {

	constructor(
		@ILayoutService layoutService: ILayoutService,
		@ICodeEditorService private readonly _codeEditorService: ICodeEditorService,
	) {
		super(layoutService);
	}

	override showContextView(delegate: IContextViewDelegate, container?: HTMLElement, shadowRoot?: boolean): IOpenContextView {
		if (!container) {
			const codeEditor = this._codeEditorService.getFocusedCodeEditor() || this._codeEditorService.getActiveCodeEditor();
			if (codeEditor) {
				container = codeEditor.getContainerDomNode();
			}
		}
		return super.showContextView(delegate, container, shadowRoot);
	}
}

class StandaloneWorkspaceTrustManagementService implements IWorkspaceTrustManagementService {
	_serviceBrand: undefined;

	private _neverEmitter = new Emitter<never>();
	public readonly onDidChangeTrust: Event<boolean> = this._neverEmitter.event;
	readonly onDidChangeTrustedFolders: Event<void> = this._neverEmitter.event;
	public readonly workspaceResolved = Promise.resolve();
	public readonly workspaceTrustInitialized = Promise.resolve();
	public readonly acceptsOutOfWorkspaceFiles = true;

	isWorkspaceTrusted(): boolean {
		return true;
	}
	isWorkspaceTrustForced(): boolean {
		return false;
	}
	canSetParentFolderTrust(): boolean {
		return false;
	}
	async setParentFolderTrust(trusted: boolean): Promise<void> {
		// noop
	}
	canSetWorkspaceTrust(): boolean {
		return false;
	}
	async setWorkspaceTrust(trusted: boolean): Promise<void> {
		// noop
	}
	getUriTrustInfo(uri: URI): Promise<IWorkspaceTrustUriInfo> {
		throw new Error('Method not supported.');
	}
	async setUrisTrust(uri: URI[], trusted: boolean): Promise<void> {
		// noop
	}
	getTrustedUris(): URI[] {
		return [];
	}
	async setTrustedUris(uris: URI[]): Promise<void> {
		// noop
	}
	addWorkspaceTrustTransitionParticipant(participant: IWorkspaceTrustTransitionParticipant): IDisposable {
		throw new Error('Method not supported.');
	}
}

class StandaloneLanguageService extends LanguageService {
	constructor() {
		super();
	}
}

class StandaloneLogService extends LogService {
	constructor() {
		super(new ConsoleLogger());
	}
}

class StandaloneContextMenuService extends ContextMenuService {
	constructor(
		@ITelemetryService telemetryService: ITelemetryService,
		@INotificationService notificationService: INotificationService,
		@IContextViewService contextViewService: IContextViewService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super(telemetryService, notificationService, contextViewService, keybindingService, menuService, contextKeyService);
		this.configure({ blockMouse: false }); // we do not want that in the standalone editor
	}
}

class StandaloneAccessbilitySignalService implements IAccessibilitySignalService {
	_serviceBrand: undefined;
	async playSignal(cue: AccessibilitySignal, options: {}): Promise<void> {
	}

	async playSignals(cues: AccessibilitySignal[]): Promise<void> {
	}

	getEnabledState(signal: AccessibilitySignal, userGesture: boolean, modality?: AccessibilityModality | undefined): IValueWithChangeEvent<boolean> {
		return ValueWithChangeEvent.const(false);
	}

	getDelayMs(signal: AccessibilitySignal, modality: AccessibilityModality): number {
		return 0;
	}

	isSoundEnabled(cue: AccessibilitySignal): boolean {
		return false;
	}

	isAnnouncementEnabled(cue: AccessibilitySignal): boolean {
		return false;
	}

	onSoundEnabledChanged(cue: AccessibilitySignal): Event<void> {
		return Event.None;
	}

	async playSound(cue: Sound, allowManyInParallel?: boolean | undefined): Promise<void> {
	}
	playSignalLoop(cue: AccessibilitySignal): IDisposable {
		return toDisposable(() => { });
	}
}

class StandaloneDefaultAccountService implements IDefaultAccountService {
	declare readonly _serviceBrand: undefined;

	readonly onDidChangeDefaultAccount: Event<IDefaultAccount | null> = Event.None;

	async getDefaultAccount(): Promise<IDefaultAccount | null> {
		return null;
	}

	setDefaultAccount(account: IDefaultAccount | null): void {
		// no-op
	}
}

export interface IEditorOverrideServices {
	[index: string]: unknown;
}


registerSingleton(IWebWorkerService, StandaloneWebWorkerService, InstantiationType.Eager);
registerSingleton(ILogService, StandaloneLogService, InstantiationType.Eager);
registerSingleton(IConfigurationService, StandaloneConfigurationService, InstantiationType.Eager);
registerSingleton(ITextResourceConfigurationService, StandaloneResourceConfigurationService, InstantiationType.Eager);
registerSingleton(ITextResourcePropertiesService, StandaloneResourcePropertiesService, InstantiationType.Eager);
registerSingleton(IWorkspaceContextService, StandaloneWorkspaceContextService, InstantiationType.Eager);
registerSingleton(ILabelService, StandaloneUriLabelService, InstantiationType.Eager);
registerSingleton(ITelemetryService, StandaloneTelemetryService, InstantiationType.Eager);
registerSingleton(IDialogService, StandaloneDialogService, InstantiationType.Eager);
registerSingleton(IEnvironmentService, StandaloneEnvironmentService, InstantiationType.Eager);
registerSingleton(INotificationService, StandaloneNotificationService, InstantiationType.Eager);
registerSingleton(IMarkerService, MarkerService, InstantiationType.Eager);
registerSingleton(ILanguageService, StandaloneLanguageService, InstantiationType.Eager);
registerSingleton(IStandaloneThemeService, StandaloneThemeService, InstantiationType.Eager);
registerSingleton(IModelService, ModelService, InstantiationType.Eager);
registerSingleton(IMarkerDecorationsService, MarkerDecorationsService, InstantiationType.Eager);
registerSingleton(IContextKeyService, ContextKeyService, InstantiationType.Eager);
registerSingleton(IProgressService, StandaloneProgressService, InstantiationType.Eager);
registerSingleton(IEditorProgressService, StandaloneEditorProgressService, InstantiationType.Eager);
registerSingleton(IStorageService, InMemoryStorageService, InstantiationType.Eager);
registerSingleton(IBulkEditService, StandaloneBulkEditService, InstantiationType.Eager);
registerSingleton(IWorkspaceTrustManagementService, StandaloneWorkspaceTrustManagementService, InstantiationType.Eager);
registerSingleton(ITextModelService, StandaloneTextModelService, InstantiationType.Eager);
registerSingleton(IAccessibilityService, AccessibilityService, InstantiationType.Eager);
registerSingleton(IListService, ListService, InstantiationType.Eager);
registerSingleton(ICommandService, StandaloneCommandService, InstantiationType.Eager);
registerSingleton(IKeybindingService, StandaloneKeybindingService, InstantiationType.Eager);
registerSingleton(IQuickInputService, StandaloneQuickInputService, InstantiationType.Eager);
registerSingleton(IContextViewService, StandaloneContextViewService, InstantiationType.Eager);
registerSingleton(IOpenerService, OpenerService, InstantiationType.Eager);
registerSingleton(IClipboardService, BrowserClipboardService, InstantiationType.Eager);
registerSingleton(IContextMenuService, StandaloneContextMenuService, InstantiationType.Eager);
registerSingleton(IMenuService, MenuService, InstantiationType.Eager);
registerSingleton(IAccessibilitySignalService, StandaloneAccessbilitySignalService, InstantiationType.Eager);
registerSingleton(ITreeSitterLibraryService, StandaloneTreeSitterLibraryService, InstantiationType.Eager);
registerSingleton(ILoggerService, NullLoggerService, InstantiationType.Eager);
registerSingleton(IDataChannelService, NullDataChannelService, InstantiationType.Eager);
registerSingleton(IDefaultAccountService, StandaloneDefaultAccountService, InstantiationType.Eager);

/**
 * We don't want to eagerly instantiate services because embedders get a one time chance
 * to override services when they create the first editor.
 */
export namespace StandaloneServices {

	const serviceCollection = new ServiceCollection();
	for (const [id, descriptor] of getSingletonServiceDescriptors()) {
		serviceCollection.set(id, descriptor);
	}

	const instantiationService = new InstantiationService(serviceCollection, true);
	serviceCollection.set(IInstantiationService, instantiationService);

	export function get<T>(serviceId: ServiceIdentifier<T>): T {
		if (!initialized) {
			initialize({});
		}
		const r = serviceCollection.get(serviceId);
		if (!r) {
			throw new Error('Missing service ' + serviceId);
		}
		if (r instanceof SyncDescriptor) {
			return instantiationService.invokeFunction((accessor) => accessor.get(serviceId));
		} else {
			return r;
		}
	}

	let initialized = false;
	const onDidInitialize = new Emitter<void>();
	export function initialize(overrides: IEditorOverrideServices): IInstantiationService {
		if (initialized) {
			return instantiationService;
		}
		initialized = true;

		// Add singletons that were registered after this module loaded
		for (const [id, descriptor] of getSingletonServiceDescriptors()) {
			if (!serviceCollection.get(id)) {
				serviceCollection.set(id, descriptor);
			}
		}

		// Initialize the service collection with the overrides, but only if the
		// service was not instantiated in the meantime.
		for (const serviceId in overrides) {
			if (overrides.hasOwnProperty(serviceId)) {
				const serviceIdentifier = createDecorator(serviceId);
				const r = serviceCollection.get(serviceIdentifier);
				if (r instanceof SyncDescriptor) {
					serviceCollection.set(serviceIdentifier, overrides[serviceId]);
				}
			}
		}

		// Instantiate all editor features
		const editorFeatures = getEditorFeatures();
		for (const feature of editorFeatures) {
			try {
				instantiationService.createInstance(feature);
			} catch (err) {
				onUnexpectedError(err);
			}
		}

		onDidInitialize.fire();

		return instantiationService;
	}

	/**
	 * Executes callback once services are initialized.
	 */
	export function withServices(callback: () => IDisposable): IDisposable {
		if (initialized) {
			return callback();
		}

		const disposable = new DisposableStore();

		const listener = disposable.add(onDidInitialize.event(() => {
			listener.dispose();
			disposable.add(callback());
		}));

		return disposable;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/standaloneThemeService.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/standaloneThemeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../base/browser/dom.js';
import * as domStylesheetsJs from '../../../base/browser/domStylesheets.js';
import { addMatchMediaChangeListener } from '../../../base/browser/browser.js';
import { Color } from '../../../base/common/color.js';
import { Emitter } from '../../../base/common/event.js';
import { TokenizationRegistry } from '../../common/languages.js';
import { FontStyle, TokenMetadata } from '../../common/encodedTokenAttributes.js';
import { ITokenThemeRule, TokenTheme, generateTokensCSSForColorMap } from '../../common/languages/supports/tokenization.js';
import { BuiltinTheme, IStandaloneTheme, IStandaloneThemeData, IStandaloneThemeService } from '../common/standaloneTheme.js';
import { hc_black, hc_light, vs, vs_dark } from '../common/themes.js';
import { IEnvironmentService } from '../../../platform/environment/common/environment.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { asCssVariableName, ColorIdentifier, Extensions, IColorRegistry } from '../../../platform/theme/common/colorRegistry.js';
import { Extensions as ThemingExtensions, ICssStyleCollector, IFileIconTheme, IProductIconTheme, IThemingRegistry, ITokenStyle, IFontTokenOptions } from '../../../platform/theme/common/themeService.js';
import { IDisposable, Disposable } from '../../../base/common/lifecycle.js';
import { ColorScheme, isDark, isHighContrast } from '../../../platform/theme/common/theme.js';
import { getIconsStyleSheet, UnthemedProductIconTheme } from '../../../platform/theme/browser/iconsStyleSheet.js';
import { mainWindow } from '../../../base/browser/window.js';

export const VS_LIGHT_THEME_NAME = 'vs';
export const VS_DARK_THEME_NAME = 'vs-dark';
export const HC_BLACK_THEME_NAME = 'hc-black';
export const HC_LIGHT_THEME_NAME = 'hc-light';

const colorRegistry = Registry.as<IColorRegistry>(Extensions.ColorContribution);
const themingRegistry = Registry.as<IThemingRegistry>(ThemingExtensions.ThemingContribution);

class StandaloneTheme implements IStandaloneTheme {

	public readonly id: string;
	public readonly themeName: string;

	private readonly themeData: IStandaloneThemeData;
	private colors: Map<string, Color> | null;
	private readonly defaultColors: { [colorId: string]: Color | undefined };
	private _tokenTheme: TokenTheme | null;

	constructor(name: string, standaloneThemeData: IStandaloneThemeData) {
		this.themeData = standaloneThemeData;
		const base = standaloneThemeData.base;
		if (name.length > 0) {
			if (isBuiltinTheme(name)) {
				this.id = name;
			} else {
				this.id = base + ' ' + name;
			}
			this.themeName = name;
		} else {
			this.id = base;
			this.themeName = base;
		}
		this.colors = null;
		this.defaultColors = Object.create(null);
		this._tokenTheme = null;
	}

	public get label(): string {
		return this.themeName;
	}

	public get base(): string {
		return this.themeData.base;
	}

	public notifyBaseUpdated() {
		if (this.themeData.inherit) {
			this.colors = null;
			this._tokenTheme = null;
		}
	}

	private getColors(): Map<string, Color> {
		if (!this.colors) {
			const colors = new Map<string, Color>();
			for (const id in this.themeData.colors) {
				colors.set(id, Color.fromHex(this.themeData.colors[id]));
			}
			if (this.themeData.inherit) {
				const baseData = getBuiltinRules(this.themeData.base);
				for (const id in baseData.colors) {
					if (!colors.has(id)) {
						colors.set(id, Color.fromHex(baseData.colors[id]));
					}
				}
			}
			this.colors = colors;
		}
		return this.colors;
	}

	public getColor(colorId: ColorIdentifier, useDefault?: boolean): Color | undefined {
		const color = this.getColors().get(colorId);
		if (color) {
			return color;
		}
		if (useDefault !== false) {
			return this.getDefault(colorId);
		}
		return undefined;
	}

	private getDefault(colorId: ColorIdentifier): Color | undefined {
		let color = this.defaultColors[colorId];
		if (color) {
			return color;
		}
		color = colorRegistry.resolveDefaultColor(colorId, this);
		this.defaultColors[colorId] = color;
		return color;
	}

	public defines(colorId: ColorIdentifier): boolean {
		return this.getColors().has(colorId);
	}

	public get type(): ColorScheme {
		switch (this.base) {
			case VS_LIGHT_THEME_NAME: return ColorScheme.LIGHT;
			case HC_BLACK_THEME_NAME: return ColorScheme.HIGH_CONTRAST_DARK;
			case HC_LIGHT_THEME_NAME: return ColorScheme.HIGH_CONTRAST_LIGHT;
			default: return ColorScheme.DARK;
		}
	}

	public get tokenTheme(): TokenTheme {
		if (!this._tokenTheme) {
			let rules: ITokenThemeRule[] = [];
			let encodedTokensColors: string[] = [];
			if (this.themeData.inherit) {
				const baseData = getBuiltinRules(this.themeData.base);
				rules = baseData.rules;
				if (baseData.encodedTokensColors) {
					encodedTokensColors = baseData.encodedTokensColors;
				}
			}
			// Pick up default colors from `editor.foreground` and `editor.background` if available
			const editorForeground = this.themeData.colors['editor.foreground'];
			const editorBackground = this.themeData.colors['editor.background'];
			if (editorForeground || editorBackground) {
				const rule: ITokenThemeRule = { token: '' };
				if (editorForeground) {
					rule.foreground = editorForeground;
				}
				if (editorBackground) {
					rule.background = editorBackground;
				}
				rules.push(rule);
			}
			rules = rules.concat(this.themeData.rules);
			if (this.themeData.encodedTokensColors) {
				encodedTokensColors = this.themeData.encodedTokensColors;
			}
			this._tokenTheme = TokenTheme.createFromRawTokenTheme(rules, encodedTokensColors);
		}
		return this._tokenTheme;
	}

	public getTokenStyleMetadata(type: string, modifiers: string[], modelLanguage: string): ITokenStyle | undefined {
		// use theme rules match
		const style = this.tokenTheme._match([type].concat(modifiers).join('.'));
		const metadata = style.metadata;
		const foreground = TokenMetadata.getForeground(metadata);
		const fontStyle = TokenMetadata.getFontStyle(metadata);
		return {
			foreground: foreground,
			italic: Boolean(fontStyle & FontStyle.Italic),
			bold: Boolean(fontStyle & FontStyle.Bold),
			underline: Boolean(fontStyle & FontStyle.Underline),
			strikethrough: Boolean(fontStyle & FontStyle.Strikethrough)
		};
	}

	public get tokenColorMap(): string[] {
		return [];
	}

	public get tokenFontMap(): IFontTokenOptions[] {
		return [];
	}

	public readonly semanticHighlighting = false;
}

function isBuiltinTheme(themeName: string): themeName is BuiltinTheme {
	return (
		themeName === VS_LIGHT_THEME_NAME
		|| themeName === VS_DARK_THEME_NAME
		|| themeName === HC_BLACK_THEME_NAME
		|| themeName === HC_LIGHT_THEME_NAME
	);
}

function getBuiltinRules(builtinTheme: BuiltinTheme): IStandaloneThemeData {
	switch (builtinTheme) {
		case VS_LIGHT_THEME_NAME:
			return vs;
		case VS_DARK_THEME_NAME:
			return vs_dark;
		case HC_BLACK_THEME_NAME:
			return hc_black;
		case HC_LIGHT_THEME_NAME:
			return hc_light;
	}
}

function newBuiltInTheme(builtinTheme: BuiltinTheme): StandaloneTheme {
	const themeData = getBuiltinRules(builtinTheme);
	return new StandaloneTheme(builtinTheme, themeData);
}

export class StandaloneThemeService extends Disposable implements IStandaloneThemeService {

	declare readonly _serviceBrand: undefined;

	private readonly _onColorThemeChange = this._register(new Emitter<IStandaloneTheme>());
	public readonly onDidColorThemeChange = this._onColorThemeChange.event;

	private readonly _onFileIconThemeChange = this._register(new Emitter<IFileIconTheme>());
	public readonly onDidFileIconThemeChange = this._onFileIconThemeChange.event;

	private readonly _onProductIconThemeChange = this._register(new Emitter<IProductIconTheme>());
	public readonly onDidProductIconThemeChange = this._onProductIconThemeChange.event;

	private readonly _environment: IEnvironmentService = Object.create(null);
	private readonly _knownThemes: Map<string, StandaloneTheme>;
	private _autoDetectHighContrast: boolean;
	private _codiconCSS: string;
	private _themeCSS: string;
	private _allCSS: string;
	private _globalStyleElement: HTMLStyleElement | null;
	private _styleElements: HTMLStyleElement[];
	private _colorMapOverride: Color[] | null;
	private _theme!: IStandaloneTheme;

	private _builtInProductIconTheme = new UnthemedProductIconTheme();

	constructor() {
		super();

		this._autoDetectHighContrast = true;

		this._knownThemes = new Map<string, StandaloneTheme>();
		this._knownThemes.set(VS_LIGHT_THEME_NAME, newBuiltInTheme(VS_LIGHT_THEME_NAME));
		this._knownThemes.set(VS_DARK_THEME_NAME, newBuiltInTheme(VS_DARK_THEME_NAME));
		this._knownThemes.set(HC_BLACK_THEME_NAME, newBuiltInTheme(HC_BLACK_THEME_NAME));
		this._knownThemes.set(HC_LIGHT_THEME_NAME, newBuiltInTheme(HC_LIGHT_THEME_NAME));

		const iconsStyleSheet = this._register(getIconsStyleSheet(this));

		this._codiconCSS = iconsStyleSheet.getCSS();
		this._themeCSS = '';
		this._allCSS = `${this._codiconCSS}\n${this._themeCSS}`;
		this._globalStyleElement = null;
		this._styleElements = [];
		this._colorMapOverride = null;
		this.setTheme(VS_LIGHT_THEME_NAME);
		this._onOSSchemeChanged();

		this._register(iconsStyleSheet.onDidChange(() => {
			this._codiconCSS = iconsStyleSheet.getCSS();
			this._updateCSS();
		}));

		addMatchMediaChangeListener(mainWindow, '(forced-colors: active)', () => {
			// Update theme selection for auto-detecting high contrast
			this._onOSSchemeChanged();
		});
	}

	public registerEditorContainer(domNode: HTMLElement): IDisposable {
		if (dom.isInShadowDOM(domNode)) {
			return this._registerShadowDomContainer(domNode);
		}
		return this._registerRegularEditorContainer();
	}

	private _registerRegularEditorContainer(): IDisposable {
		if (!this._globalStyleElement) {
			this._globalStyleElement = domStylesheetsJs.createStyleSheet(undefined, style => {
				style.className = 'monaco-colors';
				style.textContent = this._allCSS;
			});
			this._styleElements.push(this._globalStyleElement);
		}
		return Disposable.None;
	}

	private _registerShadowDomContainer(domNode: HTMLElement): IDisposable {
		const styleElement = domStylesheetsJs.createStyleSheet(domNode, style => {
			style.className = 'monaco-colors';
			style.textContent = this._allCSS;
		});
		this._styleElements.push(styleElement);
		return {
			dispose: () => {
				for (let i = 0; i < this._styleElements.length; i++) {
					if (this._styleElements[i] === styleElement) {
						this._styleElements.splice(i, 1);
						return;
					}
				}
			}
		};
	}

	public defineTheme(themeName: string, themeData: IStandaloneThemeData): void {
		if (!/^[a-z0-9\-]+$/i.test(themeName)) {
			throw new Error('Illegal theme name!');
		}
		if (!isBuiltinTheme(themeData.base) && !isBuiltinTheme(themeName)) {
			throw new Error('Illegal theme base!');
		}
		// set or replace theme
		this._knownThemes.set(themeName, new StandaloneTheme(themeName, themeData));

		if (isBuiltinTheme(themeName)) {
			this._knownThemes.forEach(theme => {
				if (theme.base === themeName) {
					theme.notifyBaseUpdated();
				}
			});
		}
		if (this._theme.themeName === themeName) {
			this.setTheme(themeName); // refresh theme
		}
	}

	public getColorTheme(): IStandaloneTheme {
		return this._theme;
	}

	public setColorMapOverride(colorMapOverride: Color[] | null): void {
		this._colorMapOverride = colorMapOverride;
		this._updateThemeOrColorMap();
	}

	public setTheme(themeName: string): void {
		let theme: StandaloneTheme | undefined;
		if (this._knownThemes.has(themeName)) {
			theme = this._knownThemes.get(themeName);
		} else {
			theme = this._knownThemes.get(VS_LIGHT_THEME_NAME);
		}
		this._updateActualTheme(theme);
	}

	private _updateActualTheme(desiredTheme: IStandaloneTheme | undefined): void {
		if (!desiredTheme || this._theme === desiredTheme) {
			// Nothing to do
			return;
		}
		this._theme = desiredTheme;
		this._updateThemeOrColorMap();
	}

	private _onOSSchemeChanged() {
		if (this._autoDetectHighContrast) {
			const wantsHighContrast = mainWindow.matchMedia(`(forced-colors: active)`).matches;
			if (wantsHighContrast !== isHighContrast(this._theme.type)) {
				// switch to high contrast or non-high contrast but stick to dark or light
				let newThemeName;
				if (isDark(this._theme.type)) {
					newThemeName = wantsHighContrast ? HC_BLACK_THEME_NAME : VS_DARK_THEME_NAME;
				} else {
					newThemeName = wantsHighContrast ? HC_LIGHT_THEME_NAME : VS_LIGHT_THEME_NAME;
				}
				this._updateActualTheme(this._knownThemes.get(newThemeName));
			}
		}
	}

	public setAutoDetectHighContrast(autoDetectHighContrast: boolean): void {
		this._autoDetectHighContrast = autoDetectHighContrast;
		this._onOSSchemeChanged();
	}

	private _updateThemeOrColorMap(): void {
		const cssRules: string[] = [];
		const hasRule: { [rule: string]: boolean } = {};
		const ruleCollector: ICssStyleCollector = {
			addRule: (rule: string) => {
				if (!hasRule[rule]) {
					cssRules.push(rule);
					hasRule[rule] = true;
				}
			}
		};
		themingRegistry.getThemingParticipants().forEach(p => p(this._theme, ruleCollector, this._environment));

		const colorVariables: string[] = [];
		for (const item of colorRegistry.getColors()) {
			const color = this._theme.getColor(item.id, true);
			if (color) {
				colorVariables.push(`${asCssVariableName(item.id)}: ${color.toString()};`);
			}
		}
		ruleCollector.addRule(`.monaco-editor, .monaco-diff-editor, .monaco-component { ${colorVariables.join('\n')} }`);

		const colorMap = this._colorMapOverride || this._theme.tokenTheme.getColorMap();
		ruleCollector.addRule(generateTokensCSSForColorMap(colorMap));

		// If the OS has forced-colors active, disable forced color adjustment for
		// Monaco editor elements so that VS Code's built-in high contrast themes
		// (hc-black / hc-light) are used instead of the OS forcing system colors.
		ruleCollector.addRule(`.monaco-editor, .monaco-diff-editor, .monaco-component { forced-color-adjust: none; }`);

		this._themeCSS = cssRules.join('\n');
		this._updateCSS();

		TokenizationRegistry.setColorMap(colorMap);
		this._onColorThemeChange.fire(this._theme);
	}

	private _updateCSS(): void {
		this._allCSS = `${this._codiconCSS}\n${this._themeCSS}`;
		this._styleElements.forEach(styleElement => styleElement.textContent = this._allCSS);
	}

	public getFileIconTheme(): IFileIconTheme {
		return {
			hasFileIcons: false,
			hasFolderIcons: false,
			hidesExplorerArrows: false
		};
	}

	public getProductIconTheme(): IProductIconTheme {
		return this._builtInProductIconTheme;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/standaloneTreeSitterLibraryService.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/standaloneTreeSitterLibraryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Parser, Language, Query } from '@vscode/tree-sitter-wasm';
import { IReader } from '../../../base/common/observable.js';
import { ITreeSitterLibraryService } from '../../../editor/common/services/treeSitter/treeSitterLibraryService.js';

export class StandaloneTreeSitterLibraryService implements ITreeSitterLibraryService {
	readonly _serviceBrand: undefined;

	getParserClass(): Promise<typeof Parser> {
		throw new Error('not implemented in StandaloneTreeSitterLibraryService');
	}

	supportsLanguage(languageId: string, reader: IReader | undefined): boolean {
		return false;
	}

	getLanguage(languageId: string, ignoreSupportsCheck: boolean, reader: IReader | undefined): Language | undefined {
		return undefined;
	}

	async getLanguagePromise(languageId: string): Promise<Language | undefined> {
		return undefined;
	}

	getInjectionQueries(languageId: string, reader: IReader | undefined): Query | null | undefined {
		return null;
	}

	getHighlightingQueries(languageId: string, reader: IReader | undefined): Query | null | undefined {
		return null;
	}

	async createQuery(language: Language, querySource: string): Promise<Query> {
		throw new Error('not implemented in StandaloneTreeSitterLibraryService');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/standaloneWebWorker.ts]---
Location: vscode-main/src/vs/editor/standalone/browser/standaloneWebWorker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { IWebWorkerService } from '../../../platform/webWorker/browser/webWorkerService.js';
import { EditorWorkerClient } from '../../browser/services/editorWorkerService.js';
import { IModelService } from '../../common/services/model.js';

/**
 * Create a new web worker that has model syncing capabilities built in.
 * Specify an AMD module to load that will `create` an object that will be proxied.
 */
export function createWebWorker<T extends object>(modelService: IModelService, webWorkerService: IWebWorkerService, opts: IInternalWebWorkerOptions): MonacoWebWorker<T> {
	return new MonacoWebWorkerImpl<T>(modelService, webWorkerService, opts);
}

/**
 * A web worker that can provide a proxy to an arbitrary file.
 */
export interface MonacoWebWorker<T> {
	/**
	 * Terminate the web worker, thus invalidating the returned proxy.
	 */
	dispose(): void;
	/**
	 * Get a proxy to the arbitrary loaded code.
	 */
	getProxy(): Promise<T>;
	/**
	 * Synchronize (send) the models at `resources` to the web worker,
	 * making them available in the monaco.worker.getMirrorModels().
	 */
	withSyncedResources(resources: URI[]): Promise<T>;
}

export interface IInternalWebWorkerOptions {
	/**
	 * The worker.
	 */
	worker: Worker | Promise<Worker>;
	/**
	 * An object that can be used by the web worker to make calls back to the main thread.
	 */
	host?: Record<string, Function>;
	/**
	 * Keep idle models.
	 * Defaults to false, which means that idle models will stop syncing after a while.
	 */
	keepIdleModels?: boolean;
}

class MonacoWebWorkerImpl<T extends object> extends EditorWorkerClient implements MonacoWebWorker<T> {

	private readonly _foreignModuleHost: { [method: string]: Function } | null;
	private _foreignProxy: Promise<T>;

	constructor(modelService: IModelService, webWorkerService: IWebWorkerService, opts: IInternalWebWorkerOptions) {
		super(opts.worker, opts.keepIdleModels || false, modelService, webWorkerService);
		this._foreignModuleHost = opts.host || null;
		this._foreignProxy = this._getProxy().then(proxy => {
			return new Proxy({}, {
				get(target, prop, receiver) {
					if (prop === 'then') {
						// Don't forward the call when the proxy is returned in an async function and the runtime tries to .then it.
						return undefined;
					}
					if (typeof prop !== 'string') {
						throw new Error(`Not supported`);
					}
					return (...args: unknown[]) => {
						return proxy.$fmr(prop, args);
					};
				}
			}) as T;
		});
	}

	// foreign host request
	public override fhr(method: string, args: unknown[]): Promise<unknown> {
		if (!this._foreignModuleHost || typeof this._foreignModuleHost[method] !== 'function') {
			return Promise.reject(new Error('Missing method ' + method + ' or missing main thread foreign host.'));
		}

		try {
			return Promise.resolve(this._foreignModuleHost[method].apply(this._foreignModuleHost, args));
		} catch (e) {
			return Promise.reject(e);
		}
	}

	public getProxy(): Promise<T> {
		return this._foreignProxy;
	}

	public withSyncedResources(resources: URI[]): Promise<T> {
		return this.workerWithSyncedResources(resources).then(_ => this.getProxy());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/standalone/browser/inspectTokens/inspectTokens.css]---
Location: vscode-main/src/vs/editor/standalone/browser/inspectTokens/inspectTokens.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .tokens-inspect-widget {
	z-index: 50;
	user-select: text;
	-webkit-user-select: text;
	padding: 10px;
	color: var(--vscode-editorHoverWidget-foreground);
	background-color: var(--vscode-editorHoverWidget-background);
	border: 1px solid var(--vscode-editorHoverWidget-border);
}
.monaco-editor.hc-black .tokens-inspect-widget, .monaco-editor.hc-light .tokens-inspect-widget {
	border-width: 2px;
}

.monaco-editor .tokens-inspect-widget .tokens-inspect-separator {
	height: 1px;
	border: 0;
	background-color: var(--vscode-editorHoverWidget-border);
}

.monaco-editor .tokens-inspect-widget .tm-token {
	font-family: var(--monaco-monospace-font);
}

.monaco-editor .tokens-inspect-widget .tm-token-length {
	font-weight: normal;
	font-size: 60%;
	float: right;
}

.monaco-editor .tokens-inspect-widget .tm-metadata-table {
	width: 100%;
}

.monaco-editor .tokens-inspect-widget .tm-metadata-value {
	font-family: var(--monaco-monospace-font);
	text-align: right;
}

.monaco-editor .tokens-inspect-widget .tm-token-type {
	font-family: var(--monaco-monospace-font);
}
```

--------------------------------------------------------------------------------

````

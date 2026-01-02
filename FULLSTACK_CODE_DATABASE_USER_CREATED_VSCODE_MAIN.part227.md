---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 227
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 227 of 552)

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

---[FILE: src/vs/editor/contrib/hover/browser/contentHoverWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/contentHoverWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidgetPosition } from '../../../browser/editorBrowser.js';
import { ConfigurationChangedEvent, EditorOption } from '../../../common/config/editorOptions.js';
import { HoverStartSource } from './hoverOperation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ResizableContentWidget } from './resizableContentWidget.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { getHoverAccessibleViewHint, HoverWidget } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { PositionAffinity } from '../../../common/model.js';
import { Emitter } from '../../../../base/common/event.js';
import { RenderedContentHover } from './contentHoverRendered.js';
import { ScrollEvent } from '../../../../base/common/scrollable.js';

const HORIZONTAL_SCROLLING_BY = 30;

export class ContentHoverWidget extends ResizableContentWidget {

	public static ID = 'editor.contrib.resizableContentHoverWidget';
	private static _lastDimensions: dom.Dimension = new dom.Dimension(0, 0);

	private _renderedHover: RenderedContentHover | undefined;
	private _positionPreference: ContentWidgetPositionPreference | undefined;
	private _minimumSize: dom.Dimension;
	private _contentWidth: number | undefined;

	private readonly _hover: HoverWidget = this._register(new HoverWidget(true));
	private readonly _hoverVisibleKey: IContextKey<boolean>;
	private readonly _hoverFocusedKey: IContextKey<boolean>;

	private readonly _onDidResize = this._register(new Emitter<void>());
	public readonly onDidResize = this._onDidResize.event;

	private readonly _onDidScroll = this._register(new Emitter<ScrollEvent>());
	public readonly onDidScroll = this._onDidScroll.event;

	private readonly _onContentsChanged = this._register(new Emitter<void>());
	public readonly onContentsChanged = this._onContentsChanged.event;

	public get isVisibleFromKeyboard(): boolean {
		return (this._renderedHover?.source === HoverStartSource.Keyboard);
	}

	public get isVisible(): boolean {
		return this._hoverVisibleKey.get() ?? false;
	}

	public get isFocused(): boolean {
		return this._hoverFocusedKey.get() ?? false;
	}

	constructor(
		editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService
	) {
		const minimumHeight = editor.getOption(EditorOption.lineHeight) + 8;
		const minimumWidth = 150;
		const minimumSize = new dom.Dimension(minimumWidth, minimumHeight);
		super(editor, minimumSize);

		this._minimumSize = minimumSize;
		this._hoverVisibleKey = EditorContextKeys.hoverVisible.bindTo(contextKeyService);
		this._hoverFocusedKey = EditorContextKeys.hoverFocused.bindTo(contextKeyService);

		dom.append(this._resizableNode.domNode, this._hover.containerDomNode);
		this._resizableNode.domNode.style.zIndex = '50';
		this._resizableNode.domNode.className = 'monaco-resizable-hover';

		this._register(this._editor.onDidLayoutChange(() => {
			if (this.isVisible) {
				this._updateMaxDimensions();
			}
		}));
		this._register(this._editor.onDidChangeConfiguration((e: ConfigurationChangedEvent) => {
			if (e.hasChanged(EditorOption.fontInfo)) {
				this._updateFont();
			}
		}));
		const focusTracker = this._register(dom.trackFocus(this._resizableNode.domNode));
		this._register(focusTracker.onDidFocus(() => {
			this._hoverFocusedKey.set(true);
		}));
		this._register(focusTracker.onDidBlur(() => {
			this._hoverFocusedKey.set(false);
		}));
		this._register(this._hover.scrollbar.onScroll((e) => {
			this._onDidScroll.fire(e);
		}));
		this._setRenderedHover(undefined);
		this._editor.addContentWidget(this);
	}

	public override dispose(): void {
		super.dispose();
		this._renderedHover?.dispose();
		this._editor.removeContentWidget(this);
	}

	public getId(): string {
		return ContentHoverWidget.ID;
	}

	private static _applyDimensions(container: HTMLElement, width: number | string, height: number | string): void {
		const transformedWidth = typeof width === 'number' ? `${width}px` : width;
		const transformedHeight = typeof height === 'number' ? `${height}px` : height;
		container.style.width = transformedWidth;
		container.style.height = transformedHeight;
	}

	private _setContentsDomNodeDimensions(width: number | string, height: number | string): void {
		const contentsDomNode = this._hover.contentsDomNode;
		return ContentHoverWidget._applyDimensions(contentsDomNode, width, height);
	}

	private _setContainerDomNodeDimensions(width: number | string, height: number | string): void {
		const containerDomNode = this._hover.containerDomNode;
		return ContentHoverWidget._applyDimensions(containerDomNode, width, height);
	}

	private _setScrollableElementDimensions(width: number | string, height: number | string): void {
		const scrollbarDomElement = this._hover.scrollbar.getDomNode();
		return ContentHoverWidget._applyDimensions(scrollbarDomElement, width, height);
	}

	private _setHoverWidgetDimensions(width: number | string, height: number | string): void {
		this._setContainerDomNodeDimensions(width, height);
		this._setScrollableElementDimensions(width, height);
		this._setContentsDomNodeDimensions(width, height);
		this._layoutContentWidget();
	}

	private static _applyMaxDimensions(container: HTMLElement, width: number | string, height: number | string) {
		const transformedWidth = typeof width === 'number' ? `${width}px` : width;
		const transformedHeight = typeof height === 'number' ? `${height}px` : height;
		container.style.maxWidth = transformedWidth;
		container.style.maxHeight = transformedHeight;
	}

	private _setHoverWidgetMaxDimensions(width: number | string, height: number | string): void {
		ContentHoverWidget._applyMaxDimensions(this._hover.contentsDomNode, width, height);
		ContentHoverWidget._applyMaxDimensions(this._hover.scrollbar.getDomNode(), width, height);
		ContentHoverWidget._applyMaxDimensions(this._hover.containerDomNode, width, height);
		this._hover.containerDomNode.style.setProperty('--vscode-hover-maxWidth', typeof width === 'number' ? `${width}px` : width);
		this._layoutContentWidget();
	}

	private _setAdjustedHoverWidgetDimensions(size: dom.Dimension): void {
		this._setHoverWidgetMaxDimensions('none', 'none');
		this._setHoverWidgetDimensions(size.width, size.height);
	}

	private _updateResizableNodeMaxDimensions(): void {
		const maxRenderingWidth = this._findMaximumRenderingWidth() ?? Infinity;
		const maxRenderingHeight = this._findMaximumRenderingHeight() ?? Infinity;
		this._resizableNode.maxSize = new dom.Dimension(maxRenderingWidth, maxRenderingHeight);
		this._setHoverWidgetMaxDimensions(maxRenderingWidth, maxRenderingHeight);
	}

	protected override _resize(size: dom.Dimension): void {
		ContentHoverWidget._lastDimensions = new dom.Dimension(size.width, size.height);
		this._setAdjustedHoverWidgetDimensions(size);
		this._resizableNode.layout(size.height, size.width);
		this._updateResizableNodeMaxDimensions();
		this._hover.scrollbar.scanDomNode();
		this._editor.layoutContentWidget(this);
		this._onDidResize.fire();
	}

	private _findAvailableSpaceVertically(): number | undefined {
		const position = this._renderedHover?.showAtPosition;
		if (!position) {
			return;
		}
		return this._positionPreference === ContentWidgetPositionPreference.ABOVE ?
			this._availableVerticalSpaceAbove(position)
			: this._availableVerticalSpaceBelow(position);
	}

	private _findMaximumRenderingHeight(): number | undefined {
		const availableSpace = this._findAvailableSpaceVertically();
		if (!availableSpace) {
			return;
		}
		const children = this._hover.contentsDomNode.children;
		let maximumHeight = children.length - 1;
		Array.from(this._hover.contentsDomNode.children).forEach((hoverPart) => {
			maximumHeight += hoverPart.clientHeight;
		});
		return Math.min(availableSpace, maximumHeight);
	}

	private _isHoverTextOverflowing(): boolean {
		// To find out if the text is overflowing, we will disable wrapping, check the widths, and then re-enable wrapping
		this._hover.containerDomNode.style.setProperty('--vscode-hover-whiteSpace', 'nowrap');
		this._hover.containerDomNode.style.setProperty('--vscode-hover-sourceWhiteSpace', 'nowrap');

		const overflowing = Array.from(this._hover.contentsDomNode.children).some((hoverElement) => {
			return hoverElement.scrollWidth > hoverElement.clientWidth;
		});

		this._hover.containerDomNode.style.removeProperty('--vscode-hover-whiteSpace');
		this._hover.containerDomNode.style.removeProperty('--vscode-hover-sourceWhiteSpace');

		return overflowing;
	}

	private _findMaximumRenderingWidth(): number | undefined {
		if (!this._editor || !this._editor.hasModel()) {
			return;
		}

		const overflowing = this._isHoverTextOverflowing();
		const initialWidth = (
			typeof this._contentWidth === 'undefined'
				? 0
				: this._contentWidth
		);

		if (overflowing || this._hover.containerDomNode.clientWidth < initialWidth) {
			const bodyBoxWidth = dom.getClientArea(this._hover.containerDomNode.ownerDocument.body).width;
			const horizontalPadding = 14;
			return bodyBoxWidth - horizontalPadding;
		} else {
			return this._hover.containerDomNode.clientWidth;
		}
	}

	public isMouseGettingCloser(posx: number, posy: number): boolean {

		if (!this._renderedHover) {
			return false;
		}
		if (this._renderedHover.initialMousePosX === undefined || this._renderedHover.initialMousePosY === undefined) {
			this._renderedHover.initialMousePosX = posx;
			this._renderedHover.initialMousePosY = posy;
			return false;
		}

		const widgetRect = dom.getDomNodePagePosition(this.getDomNode());
		if (this._renderedHover.closestMouseDistance === undefined) {
			this._renderedHover.closestMouseDistance = computeDistanceFromPointToRectangle(
				this._renderedHover.initialMousePosX,
				this._renderedHover.initialMousePosY,
				widgetRect.left,
				widgetRect.top,
				widgetRect.width,
				widgetRect.height
			);
		}

		const distance = computeDistanceFromPointToRectangle(
			posx,
			posy,
			widgetRect.left,
			widgetRect.top,
			widgetRect.width,
			widgetRect.height
		);
		if (distance > this._renderedHover.closestMouseDistance + 4 /* tolerance of 4 pixels */) {
			// The mouse is getting farther away
			return false;
		}

		this._renderedHover.closestMouseDistance = Math.min(this._renderedHover.closestMouseDistance, distance);
		return true;
	}

	private _setRenderedHover(renderedHover: RenderedContentHover | undefined): void {
		this._renderedHover?.dispose();
		this._renderedHover = renderedHover;
		this._hoverVisibleKey.set(!!renderedHover);
		this._hover.containerDomNode.classList.toggle('hidden', !renderedHover);
	}

	private _updateFont(): void {
		const { fontSize, lineHeight } = this._editor.getOption(EditorOption.fontInfo);
		const contentsDomNode = this._hover.contentsDomNode;
		contentsDomNode.style.fontSize = `${fontSize}px`;
		contentsDomNode.style.lineHeight = `${lineHeight / fontSize}`;
		// eslint-disable-next-line no-restricted-syntax
		const codeClasses: HTMLElement[] = Array.prototype.slice.call(this._hover.contentsDomNode.getElementsByClassName('code'));
		codeClasses.forEach(node => this._editor.applyFontInfo(node));
	}

	private _updateContent(node: DocumentFragment): void {
		const contentsDomNode = this._hover.contentsDomNode;
		contentsDomNode.style.paddingBottom = '';
		contentsDomNode.textContent = '';
		contentsDomNode.appendChild(node);
	}

	private _layoutContentWidget(): void {
		this._editor.layoutContentWidget(this);
		this._hover.onContentsChanged();
	}

	private _updateMaxDimensions() {
		const height = Math.max(this._editor.getLayoutInfo().height / 4, 250, ContentHoverWidget._lastDimensions.height);
		const width = Math.max(this._editor.getLayoutInfo().width * 0.66, 750, ContentHoverWidget._lastDimensions.width);
		this._resizableNode.maxSize = new dom.Dimension(width, height);
		this._setHoverWidgetMaxDimensions(width, height);
	}

	private _render(renderedHover: RenderedContentHover) {
		this._setRenderedHover(renderedHover);
		this._updateFont();
		this._updateContent(renderedHover.domNode);
		this.handleContentsChanged();
		// Simply force a synchronous render on the editor
		// such that the widget does not really render with left = '0px'
		this._editor.render();
	}

	override getPosition(): IContentWidgetPosition | null {
		if (!this._renderedHover) {
			return null;
		}
		return {
			position: this._renderedHover.showAtPosition,
			secondaryPosition: this._renderedHover.showAtSecondaryPosition,
			positionAffinity: this._renderedHover.shouldAppearBeforeContent ? PositionAffinity.LeftOfInjectedText : undefined,
			preference: [this._positionPreference ?? ContentWidgetPositionPreference.ABOVE]
		};
	}

	public show(renderedHover: RenderedContentHover): void {
		if (!this._editor || !this._editor.hasModel()) {
			return;
		}
		this._render(renderedHover);
		const widgetHeight = dom.getTotalHeight(this._hover.containerDomNode);
		const widgetPosition = renderedHover.showAtPosition;
		this._positionPreference = this._findPositionPreference(widgetHeight, widgetPosition) ?? ContentWidgetPositionPreference.ABOVE;

		// See https://github.com/microsoft/vscode/issues/140339
		// TODO: Doing a second layout of the hover after force rendering the editor
		this.handleContentsChanged();
		if (renderedHover.shouldFocus) {
			this._hover.containerDomNode.focus();
		}
		this._onDidResize.fire();
		// The aria label overrides the label, so if we add to it, add the contents of the hover
		const hoverFocused = this._hover.containerDomNode.ownerDocument.activeElement === this._hover.containerDomNode;
		const accessibleViewHint = hoverFocused && getHoverAccessibleViewHint(
			this._configurationService.getValue('accessibility.verbosity.hover') === true && this._accessibilityService.isScreenReaderOptimized(),
			this._keybindingService.lookupKeybinding('editor.action.accessibleView')?.getAriaLabel() ?? ''
		);

		if (accessibleViewHint) {
			this._hover.contentsDomNode.ariaLabel = this._hover.contentsDomNode.textContent + ', ' + accessibleViewHint;
		}
	}

	public hide(): void {
		if (!this._renderedHover) {
			return;
		}
		const hoverStoleFocus = this._renderedHover.shouldFocus || this._hoverFocusedKey.get();
		this._setRenderedHover(undefined);
		this._resizableNode.maxSize = new dom.Dimension(Infinity, Infinity);
		this._resizableNode.clearSashHoverState();
		this._hoverFocusedKey.set(false);
		this._editor.layoutContentWidget(this);
		if (hoverStoleFocus) {
			this._editor.focus();
		}
	}

	private _removeConstraintsRenderNormally(): void {
		// Added because otherwise the initial size of the hover content is smaller than should be
		const layoutInfo = this._editor.getLayoutInfo();
		this._resizableNode.layout(layoutInfo.height, layoutInfo.width);
		this._setHoverWidgetDimensions('auto', 'auto');
		this._updateMaxDimensions();
	}

	public setMinimumDimensions(dimensions: dom.Dimension): void {
		// We combine the new minimum dimensions with the previous ones
		this._minimumSize = new dom.Dimension(
			Math.max(this._minimumSize.width, dimensions.width),
			Math.max(this._minimumSize.height, dimensions.height)
		);
		this._updateMinimumWidth();
	}

	private _updateMinimumWidth(): void {
		const width = (
			typeof this._contentWidth === 'undefined'
				? this._minimumSize.width
				: Math.min(this._contentWidth, this._minimumSize.width)
		);
		// We want to avoid that the hover is artificially large, so we use the content width as minimum width
		this._resizableNode.minSize = new dom.Dimension(width, this._minimumSize.height);
	}

	public handleContentsChanged(): void {
		this._removeConstraintsRenderNormally();
		const contentsDomNode = this._hover.contentsDomNode;

		let height = dom.getTotalHeight(contentsDomNode);
		let width = dom.getTotalWidth(contentsDomNode) + 2;
		this._resizableNode.layout(height, width);

		this._setHoverWidgetDimensions(width, height);

		height = dom.getTotalHeight(contentsDomNode);
		width = dom.getTotalWidth(contentsDomNode);
		this._contentWidth = width;
		this._updateMinimumWidth();
		this._resizableNode.layout(height, width);

		if (this._renderedHover?.showAtPosition) {
			const widgetHeight = dom.getTotalHeight(this._hover.containerDomNode);
			this._positionPreference = this._findPositionPreference(widgetHeight, this._renderedHover.showAtPosition);
		}
		this._layoutContentWidget();
		this._onContentsChanged.fire();
	}

	public focus(): void {
		this._hover.containerDomNode.focus();
	}

	public scrollUp(): void {
		const scrollTop = this._hover.scrollbar.getScrollPosition().scrollTop;
		const fontInfo = this._editor.getOption(EditorOption.fontInfo);
		this._hover.scrollbar.setScrollPosition({ scrollTop: scrollTop - fontInfo.lineHeight });
	}

	public scrollDown(): void {
		const scrollTop = this._hover.scrollbar.getScrollPosition().scrollTop;
		const fontInfo = this._editor.getOption(EditorOption.fontInfo);
		this._hover.scrollbar.setScrollPosition({ scrollTop: scrollTop + fontInfo.lineHeight });
	}

	public scrollLeft(): void {
		const scrollLeft = this._hover.scrollbar.getScrollPosition().scrollLeft;
		this._hover.scrollbar.setScrollPosition({ scrollLeft: scrollLeft - HORIZONTAL_SCROLLING_BY });
	}

	public scrollRight(): void {
		const scrollLeft = this._hover.scrollbar.getScrollPosition().scrollLeft;
		this._hover.scrollbar.setScrollPosition({ scrollLeft: scrollLeft + HORIZONTAL_SCROLLING_BY });
	}

	public pageUp(): void {
		const scrollTop = this._hover.scrollbar.getScrollPosition().scrollTop;
		const scrollHeight = this._hover.scrollbar.getScrollDimensions().height;
		this._hover.scrollbar.setScrollPosition({ scrollTop: scrollTop - scrollHeight });
	}

	public pageDown(): void {
		const scrollTop = this._hover.scrollbar.getScrollPosition().scrollTop;
		const scrollHeight = this._hover.scrollbar.getScrollDimensions().height;
		this._hover.scrollbar.setScrollPosition({ scrollTop: scrollTop + scrollHeight });
	}

	public goToTop(): void {
		this._hover.scrollbar.setScrollPosition({ scrollTop: 0 });
	}

	public goToBottom(): void {
		this._hover.scrollbar.setScrollPosition({ scrollTop: this._hover.scrollbar.getScrollDimensions().scrollHeight });
	}
}

function computeDistanceFromPointToRectangle(pointX: number, pointY: number, left: number, top: number, width: number, height: number): number {
	const x = (left + width / 2); // x center of rectangle
	const y = (top + height / 2); // y center of rectangle
	const dx = Math.max(Math.abs(pointX - x) - width / 2, 0);
	const dy = Math.max(Math.abs(pointY - y) - height / 2, 0);
	return Math.sqrt(dx * dx + dy * dy);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/contentHoverWidgetWrapper.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/contentHoverWidgetWrapper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor, IEditorMouseEvent, MouseTargetType } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import { TokenizationRegistry } from '../../../common/languages.js';
import { HoverOperation, HoverResult, HoverStartMode, HoverStartSource } from './hoverOperation.js';
import { HoverAnchor, HoverParticipantRegistry, HoverRangeAnchor, IEditorHoverContext, IEditorHoverParticipant, IHoverPart, IHoverWidget } from './hoverTypes.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { HoverVerbosityAction } from '../../../common/standalone/standaloneEnums.js';
import { ContentHoverWidget } from './contentHoverWidget.js';
import { ContentHoverComputer, ContentHoverComputerOptions } from './contentHoverComputer.js';
import { ContentHoverResult } from './contentHoverTypes.js';
import { Emitter } from '../../../../base/common/event.js';
import { RenderedContentHover } from './contentHoverRendered.js';
import { isMousePositionWithinElement } from './hoverUtils.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';

export class ContentHoverWidgetWrapper extends Disposable implements IHoverWidget {

	private _currentResult: ContentHoverResult | null = null;
	private readonly _renderedContentHover = this._register(new MutableDisposable<RenderedContentHover>());

	private readonly _contentHoverWidget: ContentHoverWidget;
	private readonly _participants: IEditorHoverParticipant[];
	private readonly _hoverOperation: HoverOperation<ContentHoverComputerOptions, IHoverPart>;

	private readonly _onContentsChanged = this._register(new Emitter<void>());
	public readonly onContentsChanged = this._onContentsChanged.event;

	constructor(
		private readonly _editor: ICodeEditor,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IHoverService private readonly _hoverService: IHoverService,
		@IClipboardService private readonly _clipboardService: IClipboardService
	) {
		super();
		this._contentHoverWidget = this._register(this._instantiationService.createInstance(ContentHoverWidget, this._editor));
		this._participants = this._initializeHoverParticipants();
		this._hoverOperation = this._register(new HoverOperation(this._editor, new ContentHoverComputer(this._editor, this._participants)));
		this._registerListeners();
	}

	private _initializeHoverParticipants(): IEditorHoverParticipant[] {
		const participants: IEditorHoverParticipant[] = [];
		for (const participant of HoverParticipantRegistry.getAll()) {
			const participantInstance = this._instantiationService.createInstance(participant, this._editor);
			participants.push(participantInstance);
		}
		participants.sort((p1, p2) => p1.hoverOrdinal - p2.hoverOrdinal);
		this._register(this._contentHoverWidget.onDidResize(() => {
			this._participants.forEach(participant => participant.handleResize?.());
		}));
		this._register(this._contentHoverWidget.onDidScroll((e) => {
			this._participants.forEach(participant => participant.handleScroll?.(e));
		}));
		this._register(this._contentHoverWidget.onContentsChanged(() => {
			this._participants.forEach(participant => participant.handleContentsChanged?.());
		}));
		return participants;
	}

	private _registerListeners(): void {
		this._register(this._hoverOperation.onResult((result) => {
			const messages = (result.hasLoadingMessage ? this._addLoadingMessage(result) : result.value);
			this._withResult(new ContentHoverResult(messages, result.isComplete, result.options));
		}));
		const contentHoverWidgetNode = this._contentHoverWidget.getDomNode();
		this._register(dom.addStandardDisposableListener(contentHoverWidgetNode, 'keydown', (e) => {
			if (e.equals(KeyCode.Escape)) {
				this.hide();
			}
		}));
		this._register(dom.addStandardDisposableListener(contentHoverWidgetNode, 'mouseleave', (e) => {
			this._onMouseLeave(e);
		}));
		this._register(TokenizationRegistry.onDidChange(() => {
			if (this._contentHoverWidget.position && this._currentResult) {
				this._setCurrentResult(this._currentResult); // render again
			}
		}));
		this._register(this._contentHoverWidget.onContentsChanged(() => {
			this._onContentsChanged.fire();
		}));
	}

	/**
	 * Returns true if the hover shows now or will show.
	 */
	private _startShowingOrUpdateHover(
		anchor: HoverAnchor | null,
		mode: HoverStartMode,
		source: HoverStartSource,
		focus: boolean,
		mouseEvent: IEditorMouseEvent | null
	): boolean {
		const contentHoverIsVisible = this._contentHoverWidget.position && this._currentResult;
		if (!contentHoverIsVisible) {
			if (anchor) {
				this._startHoverOperationIfNecessary(anchor, mode, source, focus, false);
				return true;
			}
			return false;
		}
		const isHoverSticky = this._editor.getOption(EditorOption.hover).sticky;
		const isMouseGettingCloser = mouseEvent && this._contentHoverWidget.isMouseGettingCloser(mouseEvent.event.posx, mouseEvent.event.posy);
		const isHoverStickyAndIsMouseGettingCloser = isHoverSticky && isMouseGettingCloser;
		// The mouse is getting closer to the hover, so we will keep the hover untouched
		// But we will kick off a hover update at the new anchor, insisting on keeping the hover visible.
		if (isHoverStickyAndIsMouseGettingCloser) {
			if (anchor) {
				this._startHoverOperationIfNecessary(anchor, mode, source, focus, true);
			}
			return true;
		}
		// If mouse is not getting closer and anchor not defined, hide the hover
		if (!anchor) {
			this._setCurrentResult(null);
			return false;
		}
		// If mouse if not getting closer and anchor is defined, and the new anchor is the same as the previous anchor
		const currentAnchorEqualsPreviousAnchor = this._currentResult && this._currentResult.options.anchor.equals(anchor);
		if (currentAnchorEqualsPreviousAnchor) {
			return true;
		}
		// If mouse if not getting closer and anchor is defined, and the new anchor is not compatible with the previous anchor
		const currentAnchorCompatibleWithPreviousAnchor = this._currentResult && anchor.canAdoptVisibleHover(this._currentResult.options.anchor, this._contentHoverWidget.position);
		if (!currentAnchorCompatibleWithPreviousAnchor) {
			this._setCurrentResult(null);
			this._startHoverOperationIfNecessary(anchor, mode, source, focus, false);
			return true;
		}
		// We aren't getting any closer to the hover, so we will filter existing results
		// and keep those which also apply to the new anchor.
		if (this._currentResult) {
			this._setCurrentResult(this._currentResult.filter(anchor));
		}
		this._startHoverOperationIfNecessary(anchor, mode, source, focus, false);
		return true;
	}

	private _startHoverOperationIfNecessary(anchor: HoverAnchor, mode: HoverStartMode, source: HoverStartSource, shouldFocus: boolean, insistOnKeepingHoverVisible: boolean): void {
		const currentAnchorEqualToPreviousHover = this._hoverOperation.options && this._hoverOperation.options.anchor.equals(anchor);
		if (currentAnchorEqualToPreviousHover) {
			return;
		}
		this._hoverOperation.cancel();
		const contentHoverComputerOptions: ContentHoverComputerOptions = {
			anchor,
			source,
			shouldFocus,
			insistOnKeepingHoverVisible
		};
		this._hoverOperation.start(mode, contentHoverComputerOptions);
	}

	private _setCurrentResult(hoverResult: ContentHoverResult | null): void {
		let currentHoverResult = hoverResult;
		const currentResultEqualToPreviousResult = this._currentResult === currentHoverResult;
		if (currentResultEqualToPreviousResult) {
			return;
		}
		const currentHoverResultIsEmpty = currentHoverResult && currentHoverResult.hoverParts.length === 0;
		if (currentHoverResultIsEmpty) {
			currentHoverResult = null;
		}
		this._currentResult = currentHoverResult;
		if (this._currentResult) {
			this._showHover(this._currentResult);
		} else {
			this._hideHover();
		}
	}

	private _addLoadingMessage(hoverResult: HoverResult<ContentHoverComputerOptions, IHoverPart>): IHoverPart[] {
		for (const participant of this._participants) {
			if (!participant.createLoadingMessage) {
				continue;
			}
			const loadingMessage = participant.createLoadingMessage(hoverResult.options.anchor);
			if (!loadingMessage) {
				continue;
			}
			return hoverResult.value.slice(0).concat([loadingMessage]);
		}
		return hoverResult.value;
	}

	private _withResult(hoverResult: ContentHoverResult): void {
		const previousHoverIsVisibleWithCompleteResult = this._contentHoverWidget.position && this._currentResult && this._currentResult.isComplete;
		if (!previousHoverIsVisibleWithCompleteResult) {
			this._setCurrentResult(hoverResult);
		}
		// The hover is visible with a previous complete result.
		const isCurrentHoverResultComplete = hoverResult.isComplete;
		if (!isCurrentHoverResultComplete) {
			// Instead of rendering the new partial result, we wait for the result to be complete.
			return;
		}
		const currentHoverResultIsEmpty = hoverResult.hoverParts.length === 0;
		const insistOnKeepingPreviousHoverVisible = hoverResult.options.insistOnKeepingHoverVisible;
		const shouldKeepPreviousHoverVisible = currentHoverResultIsEmpty && insistOnKeepingPreviousHoverVisible;
		if (shouldKeepPreviousHoverVisible) {
			// The hover would now hide normally, so we'll keep the previous messages
			return;
		}
		this._setCurrentResult(hoverResult);
	}

	private _showHover(hoverResult: ContentHoverResult): void {
		const context = this._getHoverContext();
		this._renderedContentHover.value = new RenderedContentHover(this._editor, hoverResult, this._participants, context, this._keybindingService, this._hoverService, this._clipboardService);
		if (this._renderedContentHover.value.domNodeHasChildren) {
			this._contentHoverWidget.show(this._renderedContentHover.value);
		} else {
			this._renderedContentHover.clear();
		}
	}

	private _hideHover(): void {
		this._contentHoverWidget.hide();
		this._participants.forEach(participant => participant.handleHide?.());
	}

	private _getHoverContext(): IEditorHoverContext {
		const hide = () => {
			this.hide();
		};
		const onContentsChanged = () => {
			this._contentHoverWidget.handleContentsChanged();
		};
		const setMinimumDimensions = (dimensions: dom.Dimension) => {
			this._contentHoverWidget.setMinimumDimensions(dimensions);
		};
		const focus = () => this.focus();
		return { hide, onContentsChanged, setMinimumDimensions, focus };
	}


	public showsOrWillShow(mouseEvent: IEditorMouseEvent): boolean {
		const isContentWidgetResizing = this._contentHoverWidget.isResizing;
		if (isContentWidgetResizing) {
			return true;
		}
		const anchorCandidates: HoverAnchor[] = this._findHoverAnchorCandidates(mouseEvent);
		const anchorCandidatesExist = anchorCandidates.length > 0;
		if (!anchorCandidatesExist) {
			return this._startShowingOrUpdateHover(null, HoverStartMode.Delayed, HoverStartSource.Mouse, false, mouseEvent);
		}
		const anchor = anchorCandidates[0];
		return this._startShowingOrUpdateHover(anchor, HoverStartMode.Delayed, HoverStartSource.Mouse, false, mouseEvent);
	}

	private _findHoverAnchorCandidates(mouseEvent: IEditorMouseEvent): HoverAnchor[] {
		const anchorCandidates: HoverAnchor[] = [];
		for (const participant of this._participants) {
			if (!participant.suggestHoverAnchor) {
				continue;
			}
			const anchor = participant.suggestHoverAnchor(mouseEvent);
			if (!anchor) {
				continue;
			}
			anchorCandidates.push(anchor);
		}
		const target = mouseEvent.target;
		switch (target.type) {
			case MouseTargetType.CONTENT_TEXT: {
				anchorCandidates.push(new HoverRangeAnchor(0, target.range, mouseEvent.event.posx, mouseEvent.event.posy));
				break;
			}
			case MouseTargetType.CONTENT_EMPTY: {
				const epsilon = this._editor.getOption(EditorOption.fontInfo).typicalHalfwidthCharacterWidth / 2;
				// Let hover kick in even when the mouse is technically in the empty area after a line, given the distance is small enough
				const mouseIsWithinLinesAndCloseToHover = !target.detail.isAfterLines
					&& typeof target.detail.horizontalDistanceToText === 'number'
					&& target.detail.horizontalDistanceToText < epsilon;
				if (!mouseIsWithinLinesAndCloseToHover) {
					break;
				}
				anchorCandidates.push(new HoverRangeAnchor(0, target.range, mouseEvent.event.posx, mouseEvent.event.posy));
				break;
			}
		}
		anchorCandidates.sort((a, b) => b.priority - a.priority);
		return anchorCandidates;
	}

	private _onMouseLeave(e: MouseEvent): void {
		const editorDomNode = this._editor.getDomNode();
		const isMousePositionOutsideOfEditor = !editorDomNode || !isMousePositionWithinElement(editorDomNode, e.x, e.y);
		if (isMousePositionOutsideOfEditor) {
			this.hide();
		}
	}

	public startShowingAtRange(range: Range, mode: HoverStartMode, source: HoverStartSource, focus: boolean): void {
		this._startShowingOrUpdateHover(new HoverRangeAnchor(0, range, undefined, undefined), mode, source, focus, null);
	}

	public getWidgetContent(): string | undefined {
		const node = this._contentHoverWidget.getDomNode();
		if (!node.textContent) {
			return undefined;
		}
		return node.textContent;
	}

	public async updateHoverVerbosityLevel(action: HoverVerbosityAction, index: number, focus?: boolean): Promise<void> {
		this._renderedContentHover.value?.updateHoverVerbosityLevel(action, index, focus);
	}

	public doesHoverAtIndexSupportVerbosityAction(index: number, action: HoverVerbosityAction): boolean {
		return this._renderedContentHover.value?.doesHoverAtIndexSupportVerbosityAction(index, action) ?? false;
	}

	public getAccessibleWidgetContent(): string | undefined {
		return this._renderedContentHover.value?.getAccessibleWidgetContent();
	}

	public getAccessibleWidgetContentAtIndex(index: number): string | undefined {
		return this._renderedContentHover.value?.getAccessibleWidgetContentAtIndex(index);
	}

	public focusedHoverPartIndex(): number {
		return this._renderedContentHover.value?.focusedHoverPartIndex ?? -1;
	}

	public containsNode(node: Node | null | undefined): boolean {
		return (node ? this._contentHoverWidget.getDomNode().contains(node) : false);
	}

	public focus(): void {
		const hoverPartsCount = this._renderedContentHover.value?.hoverPartsCount;
		if (hoverPartsCount === 1) {
			this.focusHoverPartWithIndex(0);
			return;
		}
		this._contentHoverWidget.focus();
	}

	public focusHoverPartWithIndex(index: number): void {
		this._renderedContentHover.value?.focusHoverPartWithIndex(index);
	}

	public scrollUp(): void {
		this._contentHoverWidget.scrollUp();
	}

	public scrollDown(): void {
		this._contentHoverWidget.scrollDown();
	}

	public scrollLeft(): void {
		this._contentHoverWidget.scrollLeft();
	}

	public scrollRight(): void {
		this._contentHoverWidget.scrollRight();
	}

	public pageUp(): void {
		this._contentHoverWidget.pageUp();
	}

	public pageDown(): void {
		this._contentHoverWidget.pageDown();
	}

	public goToTop(): void {
		this._contentHoverWidget.goToTop();
	}

	public goToBottom(): void {
		this._contentHoverWidget.goToBottom();
	}

	public hide(): void {
		this._hoverOperation.cancel();
		this._setCurrentResult(null);
	}

	public getDomNode(): HTMLElement {
		return this._contentHoverWidget.getDomNode();
	}

	public get isColorPickerVisible(): boolean {
		return this._renderedContentHover.value?.isColorPickerVisible() ?? false;
	}

	public get isVisibleFromKeyboard(): boolean {
		return this._contentHoverWidget.isVisibleFromKeyboard;
	}

	public get isVisible(): boolean {
		return this._contentHoverWidget.isVisible;
	}

	public get isFocused(): boolean {
		return this._contentHoverWidget.isFocused;
	}

	public get isResizing(): boolean {
		return this._contentHoverWidget.isResizing;
	}

	public get widget() {
		return this._contentHoverWidget;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/getHover.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/getHover.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AsyncIterableProducer } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { registerModelAndPositionCommand } from '../../../browser/editorExtensions.js';
import { Position } from '../../../common/core/position.js';
import { ITextModel } from '../../../common/model.js';
import { Hover, HoverProvider } from '../../../common/languages.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';

export class HoverProviderResult {
	constructor(
		public readonly provider: HoverProvider,
		public readonly hover: Hover,
		public readonly ordinal: number
	) { }
}

/**
 * Does not throw or return a rejected promise (returns undefined instead).
 */
async function executeProvider(provider: HoverProvider, ordinal: number, model: ITextModel, position: Position, token: CancellationToken): Promise<HoverProviderResult | undefined> {
	const result = await Promise
		.resolve(provider.provideHover(model, position, token))
		.catch(onUnexpectedExternalError);
	if (!result || !isValid(result)) {
		return undefined;
	}
	return new HoverProviderResult(provider, result, ordinal);
}

export function getHoverProviderResultsAsAsyncIterable(registry: LanguageFeatureRegistry<HoverProvider>, model: ITextModel, position: Position, token: CancellationToken, recursive = false): AsyncIterable<HoverProviderResult> {
	const providers = registry.ordered(model, recursive);
	const promises = providers.map((provider, index) => executeProvider(provider, index, model, position, token));
	return AsyncIterableProducer.fromPromisesResolveOrder(promises).coalesce();
}

export async function getHoversPromise(registry: LanguageFeatureRegistry<HoverProvider>, model: ITextModel, position: Position, token: CancellationToken, recursive = false): Promise<Hover[]> {
	const out: Hover[] = [];
	for await (const item of getHoverProviderResultsAsAsyncIterable(registry, model, position, token, recursive)) {
		out.push(item.hover);
	}
	return out;
}

registerModelAndPositionCommand('_executeHoverProvider', (accessor, model, position): Promise<Hover[]> => {
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	return getHoversPromise(languageFeaturesService.hoverProvider, model, position, CancellationToken.None);
});

registerModelAndPositionCommand('_executeHoverProvider_recursive', (accessor, model, position): Promise<Hover[]> => {
	const languageFeaturesService = accessor.get(ILanguageFeaturesService);
	return getHoversPromise(languageFeaturesService.hoverProvider, model, position, CancellationToken.None, true);
});

function isValid(result: Hover) {
	const hasRange = (typeof result.range !== 'undefined');
	const hasHtmlContent = typeof result.contents !== 'undefined' && result.contents && result.contents.length > 0;
	return hasRange && hasHtmlContent;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/glyphHoverComputer.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/glyphHoverComputer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { asArray } from '../../../../base/common/arrays.js';
import { IMarkdownString, isEmptyMarkdownString } from '../../../../base/common/htmlContent.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { IHoverComputer } from './hoverOperation.js';
import { GlyphMarginLane } from '../../../common/model.js';

export type LaneOrLineNumber = GlyphMarginLane | 'lineNo';

export interface IHoverMessage {
	value: IMarkdownString;
}

export interface GlyphHoverComputerOptions {
	lineNumber: number;
	laneOrLine: LaneOrLineNumber;
}

export class GlyphHoverComputer implements IHoverComputer<GlyphHoverComputerOptions, IHoverMessage> {

	constructor(
		private readonly _editor: ICodeEditor
	) {
	}

	public computeSync(opts: GlyphHoverComputerOptions): IHoverMessage[] {

		const toHoverMessage = (contents: IMarkdownString): IHoverMessage => {
			return {
				value: contents
			};
		};

		const lineDecorations = this._editor.getLineDecorations(opts.lineNumber);

		const result: IHoverMessage[] = [];
		const isLineHover = opts.laneOrLine === 'lineNo';
		if (!lineDecorations) {
			return result;
		}

		for (const d of lineDecorations) {
			const lane = d.options.glyphMargin?.position ?? GlyphMarginLane.Center;
			if (!isLineHover && lane !== opts.laneOrLine) {
				continue;
			}

			const hoverMessage = isLineHover ? d.options.lineNumberHoverMessage : d.options.glyphMarginHoverMessage;
			if (!hoverMessage || isEmptyMarkdownString(hoverMessage)) {
				continue;
			}

			result.push(...asArray(hoverMessage).map(toHoverMessage));
		}

		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/glyphHoverController.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/glyphHoverController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { isModifierKey } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { ICodeEditor, IEditorMouseEvent, IPartialEditorMouseEvent } from '../../../browser/editorBrowser.js';
import { ConfigurationChangedEvent, EditorOption } from '../../../common/config/editorOptions.js';
import { IEditorContribution, IScrollEvent } from '../../../common/editorCommon.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IHoverWidget } from './hoverTypes.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { isMousePositionWithinElement, shouldShowHover } from './hoverUtils.js';
import './hover.css';
import { GlyphHoverWidget } from './glyphHoverWidget.js';

// sticky hover widget which doesn't disappear on focus out and such
const _sticky = false
	// || Boolean("true") // done "weirdly" so that a lint warning prevents you from pushing this
	;

interface IHoverSettings {
	readonly enabled: 'on' | 'off' | 'onKeyboardModifier';
	readonly sticky: boolean;
	readonly hidingDelay: number;
}

interface IHoverState {
	mouseDown: boolean;
}

export class GlyphHoverController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.marginHover';

	public shouldKeepOpenOnEditorMouseMoveOrLeave: boolean = false;

	private readonly _listenersStore = new DisposableStore();

	private _glyphWidget: GlyphHoverWidget | undefined;
	private _mouseMoveEvent: IEditorMouseEvent | undefined;
	private _reactToEditorMouseMoveRunner: RunOnceScheduler;

	private _hoverSettings!: IHoverSettings;
	private _hoverState: IHoverState = {
		mouseDown: false
	};

	constructor(
		private readonly _editor: ICodeEditor,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();
		this._reactToEditorMouseMoveRunner = this._register(
			new RunOnceScheduler(
				() => this._reactToEditorMouseMove(this._mouseMoveEvent), 0
			)
		);
		this._hookListeners();
		this._register(this._editor.onDidChangeConfiguration((e: ConfigurationChangedEvent) => {
			if (e.hasChanged(EditorOption.hover)) {
				this._unhookListeners();
				this._hookListeners();
			}
		}));
	}

	static get(editor: ICodeEditor): GlyphHoverController | null {
		return editor.getContribution<GlyphHoverController>(GlyphHoverController.ID);
	}

	private _hookListeners(): void {

		const hoverOpts = this._editor.getOption(EditorOption.hover);
		this._hoverSettings = {
			enabled: hoverOpts.enabled,
			sticky: hoverOpts.sticky,
			hidingDelay: hoverOpts.hidingDelay
		};

		if (hoverOpts.enabled !== 'off') {
			this._listenersStore.add(this._editor.onMouseDown((e: IEditorMouseEvent) => this._onEditorMouseDown(e)));
			this._listenersStore.add(this._editor.onMouseUp(() => this._onEditorMouseUp()));
			this._listenersStore.add(this._editor.onMouseMove((e: IEditorMouseEvent) => this._onEditorMouseMove(e)));
			this._listenersStore.add(this._editor.onKeyDown((e: IKeyboardEvent) => this._onKeyDown(e)));
		} else {
			this._listenersStore.add(this._editor.onMouseMove((e: IEditorMouseEvent) => this._onEditorMouseMove(e)));
			this._listenersStore.add(this._editor.onKeyDown((e: IKeyboardEvent) => this._onKeyDown(e)));
		}

		this._listenersStore.add(this._editor.onMouseLeave((e) => this._onEditorMouseLeave(e)));
		this._listenersStore.add(this._editor.onDidChangeModel(() => {
			this._cancelScheduler();
			this.hideGlyphHover();
		}));
		this._listenersStore.add(this._editor.onDidChangeModelContent(() => this._cancelScheduler()));
		this._listenersStore.add(this._editor.onDidScrollChange((e: IScrollEvent) => this._onEditorScrollChanged(e)));
	}

	private _unhookListeners(): void {
		this._listenersStore.clear();
	}

	private _cancelScheduler() {
		this._mouseMoveEvent = undefined;
		this._reactToEditorMouseMoveRunner.cancel();
	}

	private _onEditorScrollChanged(e: IScrollEvent): void {
		if (e.scrollTopChanged || e.scrollLeftChanged) {
			this.hideGlyphHover();
		}
	}

	private _onEditorMouseDown(mouseEvent: IEditorMouseEvent): void {
		this._hoverState.mouseDown = true;
		const shouldNotHideCurrentHoverWidget = this._isMouseOnGlyphHoverWidget(mouseEvent);
		if (shouldNotHideCurrentHoverWidget) {
			return;
		}
		this.hideGlyphHover();
	}

	private _isMouseOnGlyphHoverWidget(mouseEvent: IPartialEditorMouseEvent): boolean {
		const glyphHoverWidgetNode = this._glyphWidget?.getDomNode();
		if (glyphHoverWidgetNode) {
			return isMousePositionWithinElement(glyphHoverWidgetNode, mouseEvent.event.posx, mouseEvent.event.posy);
		}
		return false;
	}

	private _onEditorMouseUp(): void {
		this._hoverState.mouseDown = false;
	}

	private _onEditorMouseLeave(mouseEvent: IPartialEditorMouseEvent): void {
		if (this.shouldKeepOpenOnEditorMouseMoveOrLeave) {
			return;
		}

		this._cancelScheduler();
		const shouldNotHideCurrentHoverWidget = this._isMouseOnGlyphHoverWidget(mouseEvent);
		if (shouldNotHideCurrentHoverWidget) {
			return;
		}
		if (_sticky) {
			return;
		}
		this.hideGlyphHover();
	}

	private _shouldNotRecomputeCurrentHoverWidget(mouseEvent: IEditorMouseEvent): boolean {
		const isHoverSticky = this._hoverSettings.sticky;
		const isMouseOnGlyphHoverWidget = this._isMouseOnGlyphHoverWidget(mouseEvent);
		return isHoverSticky && isMouseOnGlyphHoverWidget;
	}

	private _onEditorMouseMove(mouseEvent: IEditorMouseEvent): void {
		if (this.shouldKeepOpenOnEditorMouseMoveOrLeave) {
			return;
		}

		this._mouseMoveEvent = mouseEvent;
		const shouldNotRecomputeCurrentHoverWidget = this._shouldNotRecomputeCurrentHoverWidget(mouseEvent);
		if (shouldNotRecomputeCurrentHoverWidget) {
			this._reactToEditorMouseMoveRunner.cancel();
			return;
		}
		this._reactToEditorMouseMove(mouseEvent);
	}

	private _reactToEditorMouseMove(mouseEvent: IEditorMouseEvent | undefined): void {

		if (!mouseEvent) {
			return;
		}
		if (!shouldShowHover(
			this._hoverSettings.enabled,
			this._editor.getOption(EditorOption.multiCursorModifier),
			mouseEvent
		)) {
			if (_sticky) {
				return;
			}
			this.hideGlyphHover();
			return;
		}
		const glyphWidgetShowsOrWillShow = this._tryShowHoverWidget(mouseEvent);
		if (glyphWidgetShowsOrWillShow) {
			return;
		}
		if (_sticky) {
			return;
		}
		this.hideGlyphHover();
	}

	private _tryShowHoverWidget(mouseEvent: IEditorMouseEvent): boolean {
		const glyphWidget: IHoverWidget = this._getOrCreateGlyphWidget();
		return glyphWidget.showsOrWillShow(mouseEvent);
	}

	private _onKeyDown(e: IKeyboardEvent): void {
		if (!this._editor.hasModel()) {
			return;
		}
		if (isModifierKey(e.keyCode)) {
			// Do not hide hover when a modifier key is pressed
			return;
		}
		this.hideGlyphHover();
	}

	public hideGlyphHover(): void {
		if (_sticky) {
			return;
		}
		this._glyphWidget?.hide();
	}

	private _getOrCreateGlyphWidget(): GlyphHoverWidget {
		if (!this._glyphWidget) {
			this._glyphWidget = this._instantiationService.createInstance(GlyphHoverWidget, this._editor);
		}
		return this._glyphWidget;
	}

	public override dispose(): void {
		super.dispose();
		this._unhookListeners();
		this._listenersStore.dispose();
		this._glyphWidget?.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/glyphHoverWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/glyphHoverWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { ICodeEditor, IEditorMouseEvent, IOverlayWidget, IOverlayWidgetPosition, MouseTargetType } from '../../../browser/editorBrowser.js';
import { ConfigurationChangedEvent, EditorOption } from '../../../common/config/editorOptions.js';
import { HoverOperation, HoverResult, HoverStartMode } from './hoverOperation.js';
import { HoverWidget } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { IHoverWidget } from './hoverTypes.js';
import { IHoverMessage, LaneOrLineNumber, GlyphHoverComputer, GlyphHoverComputerOptions } from './glyphHoverComputer.js';
import { isMousePositionWithinElement } from './hoverUtils.js';

const $ = dom.$;

export class GlyphHoverWidget extends Disposable implements IOverlayWidget, IHoverWidget {

	public static readonly ID = 'editor.contrib.modesGlyphHoverWidget';
	public readonly allowEditorOverflow = true;

	private readonly _editor: ICodeEditor;
	private readonly _hover: HoverWidget;

	private _isVisible: boolean;
	private _messages: IHoverMessage[];

	private readonly _hoverOperation: HoverOperation<GlyphHoverComputerOptions, IHoverMessage>;
	private readonly _renderDisposeables = this._register(new DisposableStore());

	private _hoverComputerOptions: GlyphHoverComputerOptions | undefined;

	constructor(
		editor: ICodeEditor,
		@IMarkdownRendererService private readonly _markdownRendererService: IMarkdownRendererService,
	) {
		super();
		this._editor = editor;

		this._isVisible = false;
		this._messages = [];

		this._hover = this._register(new HoverWidget(true));
		this._hover.containerDomNode.classList.toggle('hidden', !this._isVisible);

		this._hoverOperation = this._register(new HoverOperation(this._editor, new GlyphHoverComputer(this._editor)));
		this._register(this._hoverOperation.onResult((result) => this._withResult(result)));

		this._register(this._editor.onDidChangeModelDecorations(() => this._onModelDecorationsChanged()));
		this._register(this._editor.onDidChangeConfiguration((e: ConfigurationChangedEvent) => {
			if (e.hasChanged(EditorOption.fontInfo)) {
				this._updateFont();
			}
		}));
		this._register(dom.addStandardDisposableListener(this._hover.containerDomNode, 'mouseleave', (e) => {
			this._onMouseLeave(e);
		}));
		this._editor.addOverlayWidget(this);
	}

	public override dispose(): void {
		this._hoverComputerOptions = undefined;
		this._editor.removeOverlayWidget(this);
		super.dispose();
	}

	public getId(): string {
		return GlyphHoverWidget.ID;
	}

	public getDomNode(): HTMLElement {
		return this._hover.containerDomNode;
	}

	public getPosition(): IOverlayWidgetPosition | null {
		return null;
	}

	private _updateFont(): void {
		// eslint-disable-next-line no-restricted-syntax
		const codeClasses: HTMLElement[] = Array.prototype.slice.call(this._hover.contentsDomNode.getElementsByClassName('code'));
		codeClasses.forEach(node => this._editor.applyFontInfo(node));
	}

	private _onModelDecorationsChanged(): void {
		if (this._isVisible && this._hoverComputerOptions) {
			// The decorations have changed and the hover is visible,
			// we need to recompute the displayed text
			this._hoverOperation.cancel();
			this._hoverOperation.start(HoverStartMode.Delayed, this._hoverComputerOptions);
		}
	}

	public showsOrWillShow(mouseEvent: IEditorMouseEvent): boolean {
		const target = mouseEvent.target;
		if (target.type === MouseTargetType.GUTTER_GLYPH_MARGIN && target.detail.glyphMarginLane) {
			this._startShowingAt(target.position.lineNumber, target.detail.glyphMarginLane);
			return true;
		}
		if (target.type === MouseTargetType.GUTTER_LINE_NUMBERS) {
			this._startShowingAt(target.position.lineNumber, 'lineNo');
			return true;
		}
		return false;
	}

	private _startShowingAt(lineNumber: number, laneOrLine: LaneOrLineNumber): void {
		if (this._hoverComputerOptions
			&& this._hoverComputerOptions.lineNumber === lineNumber
			&& this._hoverComputerOptions.laneOrLine === laneOrLine) {
			// We have to show the widget at the exact same line number as before, so no work is needed
			return;
		}
		this._hoverOperation.cancel();
		this.hide();
		this._hoverComputerOptions = { lineNumber, laneOrLine };
		this._hoverOperation.start(HoverStartMode.Delayed, this._hoverComputerOptions);
	}

	public hide(): void {
		this._hoverComputerOptions = undefined;
		this._hoverOperation.cancel();
		if (!this._isVisible) {
			return;
		}
		this._isVisible = false;
		this._hover.containerDomNode.classList.toggle('hidden', !this._isVisible);
	}

	private _withResult(result: HoverResult<GlyphHoverComputerOptions, IHoverMessage>): void {
		this._messages = result.value;

		if (this._messages.length > 0) {
			this._renderMessages(result.options.lineNumber, result.options.laneOrLine, this._messages);
		} else {
			this.hide();
		}
	}

	private _renderMessages(lineNumber: number, laneOrLine: LaneOrLineNumber, messages: IHoverMessage[]): void {
		this._renderDisposeables.clear();

		const fragment = document.createDocumentFragment();

		for (const msg of messages) {
			const markdownHoverElement = $('div.hover-row.markdown-hover');
			const hoverContentsElement = dom.append(markdownHoverElement, $('div.hover-contents'));
			const renderedContents = this._renderDisposeables.add(this._markdownRendererService.render(msg.value, { context: this._editor }));
			hoverContentsElement.appendChild(renderedContents.element);
			fragment.appendChild(markdownHoverElement);
		}

		this._updateContents(fragment);
		this._showAt(lineNumber, laneOrLine);
	}

	private _updateContents(node: Node): void {
		this._hover.contentsDomNode.textContent = '';
		this._hover.contentsDomNode.appendChild(node);
		this._updateFont();
	}

	private _showAt(lineNumber: number, laneOrLine: LaneOrLineNumber): void {
		if (!this._isVisible) {
			this._isVisible = true;
			this._hover.containerDomNode.classList.toggle('hidden', !this._isVisible);
		}

		const editorLayout = this._editor.getLayoutInfo();
		const topForLineNumber = this._editor.getTopForLineNumber(lineNumber);
		const editorScrollTop = this._editor.getScrollTop();
		const lineHeight = this._editor.getOption(EditorOption.lineHeight);
		const nodeHeight = this._hover.containerDomNode.clientHeight;
		const top = topForLineNumber - editorScrollTop - ((nodeHeight - lineHeight) / 2);
		const left = editorLayout.glyphMarginLeft + editorLayout.glyphMarginWidth + (laneOrLine === 'lineNo' ? editorLayout.lineNumbersWidth : 0);

		// Constrain the hover widget to stay within the editor bounds
		const editorHeight = editorLayout.height;
		const maxTop = editorHeight - nodeHeight;
		const constrainedTop = Math.max(0, Math.min(Math.round(top), maxTop));

		const fixedOverflowWidgets = this._editor.getOption(EditorOption.fixedOverflowWidgets);
		if (fixedOverflowWidgets) {
			// Use fixed positioning relative to the viewport
			const editorDomNode = this._editor.getDomNode();
			if (editorDomNode) {
				const editorRect = dom.getDomNodePagePosition(editorDomNode);
				this._hover.containerDomNode.style.position = 'fixed';
				this._hover.containerDomNode.style.left = `${editorRect.left + left}px`;
				this._hover.containerDomNode.style.top = `${editorRect.top + constrainedTop}px`;
			}
		} else {
			// Use absolute positioning relative to the editor
			this._hover.containerDomNode.style.position = 'absolute';
			this._hover.containerDomNode.style.left = `${left}px`;
			this._hover.containerDomNode.style.top = `${constrainedTop}px`;
		}
		this._hover.containerDomNode.style.zIndex = '11'; // 1 more than the zone widget at 10 (#233819)
	}

	private _onMouseLeave(e: MouseEvent): void {
		const editorDomNode = this._editor.getDomNode();
		const isMousePositionOutsideOfEditor = !editorDomNode || !isMousePositionWithinElement(editorDomNode, e.x, e.y);
		if (isMousePositionOutsideOfEditor) {
			this.hide();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/hover.css]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/hover.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .hoverHighlight {
	background-color: var(--vscode-editor-hoverHighlightBackground);
}

.monaco-editor .monaco-resizable-hover {
	border: 1px solid var(--vscode-editorHoverWidget-border);
	border-radius: 3px;
	box-sizing: content-box;
}

.monaco-editor .monaco-resizable-hover > .monaco-hover {
	border: none;
	border-radius: unset;
}

.monaco-editor .monaco-hover {
	border: 1px solid var(--vscode-editorHoverWidget-border);
	border-radius: 3px;
	color: var(--vscode-editorHoverWidget-foreground);
	background-color: var(--vscode-editorHoverWidget-background);
}

.monaco-editor .monaco-hover a {
	color: var(--vscode-textLink-foreground);
}

.monaco-editor .monaco-hover a:hover {
	color: var(--vscode-textLink-activeForeground);
}

.monaco-editor .monaco-hover .hover-row {
	display: flex;
}

.monaco-editor .monaco-hover .hover-row.hover-row-with-copy {
	position: relative;
	padding-right: 20px;
}

.monaco-editor .monaco-hover .hover-row .hover-row-contents {
	min-width: 0;
	display: flex;
	flex-direction: column;
}

.monaco-editor .monaco-hover .hover-row .verbosity-actions {
	border-right: 1px solid var(--vscode-editorHoverWidget-border);
	width: 22px;
	overflow-y: clip;
}

.monaco-editor .monaco-hover .hover-row .verbosity-actions-inner {
	display: flex;
	flex-direction: column;
	padding-left: 5px;
	padding-right: 5px;
	justify-content: flex-end;
	position: relative;
}

.monaco-editor .monaco-hover .hover-row .verbosity-actions-inner .codicon {
	cursor: pointer;
	font-size: 11px;
}

.monaco-editor .monaco-hover .hover-row .verbosity-actions-inner .codicon.enabled {
	color: var(--vscode-textLink-foreground);
}

.monaco-editor .monaco-hover .hover-row .verbosity-actions-inner .codicon.disabled {
	opacity: 0.6;
}

.monaco-editor .monaco-hover .hover-row .actions {
	background-color: var(--vscode-editorHoverWidget-statusBarBackground);
}

.monaco-editor .monaco-hover code {
	background-color: var(--vscode-textCodeBlock-background);
}

.monaco-editor .monaco-hover .hover-copy-button {
	position: absolute;
	top: 4px;
	right: 4px;
	padding: 2px 4px;
	border-radius: 3px;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0;
}

.monaco-editor .monaco-hover .hover-row-with-copy:hover .hover-copy-button,
.monaco-editor .monaco-hover .hover-row-with-copy:focus-within .hover-copy-button {
	opacity: 1;
}

.monaco-editor .monaco-hover .hover-copy-button:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
	cursor: pointer;
}

.monaco-editor .monaco-hover .hover-copy-button:focus {
	outline: 1px solid var(--vscode-focusBorder);
	outline-offset: -1px;
}

.monaco-editor .monaco-hover .hover-copy-button .codicon {
	font-size: 16px;
	color: var(--vscode-foreground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/hoverAccessibleViews.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/hoverAccessibleViews.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { localize } from '../../../../nls.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ContentHoverController } from './contentHoverController.js';
import { AccessibleViewType, AccessibleViewProviderId, AccessibleContentProvider, IAccessibleViewContentProvider, IAccessibleViewOptions } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { HoverVerbosityAction } from '../../../common/languages.js';
import { DECREASE_HOVER_VERBOSITY_ACCESSIBLE_ACTION_ID, DECREASE_HOVER_VERBOSITY_ACTION_ID, INCREASE_HOVER_VERBOSITY_ACCESSIBLE_ACTION_ID, INCREASE_HOVER_VERBOSITY_ACTION_ID } from './hoverActionIds.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { ICodeEditorService } from '../../../browser/services/codeEditorService.js';
import { Action, IAction } from '../../../../base/common/actions.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { labelForHoverVerbosityAction } from './markdownHoverParticipant.js';

namespace HoverAccessibilityHelpNLS {
	export const increaseVerbosity = localize('increaseVerbosity', '- The focused hover part verbosity level can be increased with the Increase Hover Verbosity command.', `<keybinding:${INCREASE_HOVER_VERBOSITY_ACTION_ID}>`);
	export const decreaseVerbosity = localize('decreaseVerbosity', '- The focused hover part verbosity level can be decreased with the Decrease Hover Verbosity command.', `<keybinding:${DECREASE_HOVER_VERBOSITY_ACTION_ID}>`);
}

export class HoverAccessibleView implements IAccessibleViewImplementation {

	public readonly type = AccessibleViewType.View;
	public readonly priority = 95;
	public readonly name = 'hover';
	public readonly when = EditorContextKeys.hoverFocused;

	getProvider(accessor: ServicesAccessor): AccessibleContentProvider | undefined {
		const codeEditorService = accessor.get(ICodeEditorService);
		const codeEditor = codeEditorService.getActiveCodeEditor() || codeEditorService.getFocusedCodeEditor();
		if (!codeEditor) {
			throw new Error('No active or focused code editor');
		}
		const hoverController = ContentHoverController.get(codeEditor);
		if (!hoverController) {
			return;
		}
		const keybindingService = accessor.get(IKeybindingService);
		return accessor.get(IInstantiationService).createInstance(HoverAccessibleViewProvider, keybindingService, codeEditor, hoverController);
	}
}

export class HoverAccessibilityHelp implements IAccessibleViewImplementation {

	public readonly priority = 100;
	public readonly name = 'hover';
	public readonly type = AccessibleViewType.Help;
	public readonly when = EditorContextKeys.hoverVisible;

	getProvider(accessor: ServicesAccessor): AccessibleContentProvider | undefined {
		const codeEditorService = accessor.get(ICodeEditorService);
		const codeEditor = codeEditorService.getActiveCodeEditor() || codeEditorService.getFocusedCodeEditor();
		if (!codeEditor) {
			throw new Error('No active or focused code editor');
		}
		const hoverController = ContentHoverController.get(codeEditor);
		if (!hoverController) {
			return;
		}
		return accessor.get(IInstantiationService).createInstance(HoverAccessibilityHelpProvider, hoverController);
	}
}

abstract class BaseHoverAccessibleViewProvider extends Disposable implements IAccessibleViewContentProvider {

	abstract provideContent(): string;
	abstract options: IAccessibleViewOptions;

	public readonly id = AccessibleViewProviderId.Hover;
	public readonly verbositySettingKey = 'accessibility.verbosity.hover';

	private readonly _onDidChangeContent: Emitter<void> = this._register(new Emitter<void>());
	public readonly onDidChangeContent: Event<void> = this._onDidChangeContent.event;

	protected _focusedHoverPartIndex: number = -1;

	constructor(protected readonly _hoverController: ContentHoverController) {
		super();
	}

	public onOpen(): void {
		if (!this._hoverController) {
			return;
		}
		this._hoverController.shouldKeepOpenOnEditorMouseMoveOrLeave = true;
		this._focusedHoverPartIndex = this._hoverController.focusedHoverPartIndex();
		this._register(this._hoverController.onHoverContentsChanged(() => {
			this._onDidChangeContent.fire();
		}));
	}

	public onClose(): void {
		if (!this._hoverController) {
			return;
		}
		if (this._focusedHoverPartIndex === -1) {
			this._hoverController.focus();
		} else {
			this._hoverController.focusHoverPartWithIndex(this._focusedHoverPartIndex);
		}
		this._focusedHoverPartIndex = -1;
		this._hoverController.shouldKeepOpenOnEditorMouseMoveOrLeave = false;
	}

	provideContentAtIndex(focusedHoverIndex: number, includeVerbosityActions: boolean): string {
		if (focusedHoverIndex !== -1) {
			const accessibleContent = this._hoverController.getAccessibleWidgetContentAtIndex(focusedHoverIndex);
			if (accessibleContent === undefined) {
				return '';
			}
			const contents: string[] = [];
			if (includeVerbosityActions) {
				contents.push(...this._descriptionsOfVerbosityActionsForIndex(focusedHoverIndex));
			}
			contents.push(accessibleContent);
			return contents.join('\n');
		} else {
			const accessibleContent = this._hoverController.getAccessibleWidgetContent();
			if (accessibleContent === undefined) {
				return '';
			}
			const contents: string[] = [];
			contents.push(accessibleContent);
			return contents.join('\n');
		}
	}

	private _descriptionsOfVerbosityActionsForIndex(index: number): string[] {
		const content: string[] = [];
		const descriptionForIncreaseAction = this._descriptionOfVerbosityActionForIndex(HoverVerbosityAction.Increase, index);
		if (descriptionForIncreaseAction !== undefined) {
			content.push(descriptionForIncreaseAction);
		}
		const descriptionForDecreaseAction = this._descriptionOfVerbosityActionForIndex(HoverVerbosityAction.Decrease, index);
		if (descriptionForDecreaseAction !== undefined) {
			content.push(descriptionForDecreaseAction);
		}
		return content;
	}

	private _descriptionOfVerbosityActionForIndex(action: HoverVerbosityAction, index: number): string | undefined {
		const isActionSupported = this._hoverController.doesHoverAtIndexSupportVerbosityAction(index, action);
		if (!isActionSupported) {
			return;
		}
		switch (action) {
			case HoverVerbosityAction.Increase:
				return HoverAccessibilityHelpNLS.increaseVerbosity;
			case HoverVerbosityAction.Decrease:
				return HoverAccessibilityHelpNLS.decreaseVerbosity;
		}
	}
}

export class HoverAccessibilityHelpProvider extends BaseHoverAccessibleViewProvider implements IAccessibleViewContentProvider {

	public readonly options: IAccessibleViewOptions = { type: AccessibleViewType.Help };

	constructor(hoverController: ContentHoverController) {
		super(hoverController);
	}

	provideContent(): string {
		return this.provideContentAtIndex(this._focusedHoverPartIndex, true);
	}
}

export class HoverAccessibleViewProvider extends BaseHoverAccessibleViewProvider implements IAccessibleViewContentProvider {

	public readonly options: IAccessibleViewOptions = { type: AccessibleViewType.View };

	constructor(
		private readonly _keybindingService: IKeybindingService,
		private readonly _editor: ICodeEditor,
		hoverController: ContentHoverController,
	) {
		super(hoverController);
		this._initializeOptions(this._editor, hoverController);
	}

	public provideContent(): string {
		return this.provideContentAtIndex(this._focusedHoverPartIndex, false);
	}

	public get actions(): IAction[] {
		const actions: IAction[] = [];
		actions.push(this._getActionFor(this._editor, HoverVerbosityAction.Increase));
		actions.push(this._getActionFor(this._editor, HoverVerbosityAction.Decrease));
		return actions;
	}

	private _getActionFor(editor: ICodeEditor, action: HoverVerbosityAction): IAction {
		let actionId: string;
		let accessibleActionId: string;
		let actionCodicon: ThemeIcon;
		switch (action) {
			case HoverVerbosityAction.Increase:
				actionId = INCREASE_HOVER_VERBOSITY_ACTION_ID;
				accessibleActionId = INCREASE_HOVER_VERBOSITY_ACCESSIBLE_ACTION_ID;
				actionCodicon = Codicon.add;
				break;
			case HoverVerbosityAction.Decrease:
				actionId = DECREASE_HOVER_VERBOSITY_ACTION_ID;
				accessibleActionId = DECREASE_HOVER_VERBOSITY_ACCESSIBLE_ACTION_ID;
				actionCodicon = Codicon.remove;
				break;
		}
		const actionLabel = labelForHoverVerbosityAction(this._keybindingService, action);
		const actionEnabled = this._hoverController.doesHoverAtIndexSupportVerbosityAction(this._focusedHoverPartIndex, action);
		return new Action(accessibleActionId, actionLabel, ThemeIcon.asClassName(actionCodicon), actionEnabled, () => {
			editor.getAction(actionId)?.run({ index: this._focusedHoverPartIndex, focus: false });
		});
	}

	private _initializeOptions(editor: ICodeEditor, hoverController: ContentHoverController): void {
		const helpProvider = this._register(new HoverAccessibilityHelpProvider(hoverController));
		this.options.language = editor.getModel()?.getLanguageId();
		this.options.customHelp = () => { return helpProvider.provideContentAtIndex(this._focusedHoverPartIndex, true); };
	}
}

export class ExtHoverAccessibleView implements IAccessibleViewImplementation {
	public readonly type = AccessibleViewType.View;
	public readonly priority = 90;
	public readonly name = 'extension-hover';

	getProvider(accessor: ServicesAccessor): AccessibleContentProvider | undefined {
		const contextViewService = accessor.get(IContextViewService);
		const contextViewElement = contextViewService.getContextViewElement();
		const extensionHoverContent = contextViewElement?.textContent ?? undefined;
		const hoverService = accessor.get(IHoverService);

		if (contextViewElement.classList.contains('accessible-view-container') || !extensionHoverContent) {
			// The accessible view, itself, uses the context view service to display the text. We don't want to read that.
			return;
		}
		return new AccessibleContentProvider(
			AccessibleViewProviderId.Hover,
			{ language: 'typescript', type: AccessibleViewType.View },
			() => { return extensionHoverContent; },
			() => {
				hoverService.showAndFocusLastHover();
			},
			'accessibility.verbosity.hover',
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/hoverActionIds.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/hoverActionIds.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls.js';

export const SHOW_OR_FOCUS_HOVER_ACTION_ID = 'editor.action.showHover';
export const SHOW_DEFINITION_PREVIEW_HOVER_ACTION_ID = 'editor.action.showDefinitionPreviewHover';
export const HIDE_HOVER_ACTION_ID = 'editor.action.hideHover';
export const SCROLL_UP_HOVER_ACTION_ID = 'editor.action.scrollUpHover';
export const SCROLL_DOWN_HOVER_ACTION_ID = 'editor.action.scrollDownHover';
export const SCROLL_LEFT_HOVER_ACTION_ID = 'editor.action.scrollLeftHover';
export const SCROLL_RIGHT_HOVER_ACTION_ID = 'editor.action.scrollRightHover';
export const PAGE_UP_HOVER_ACTION_ID = 'editor.action.pageUpHover';
export const PAGE_DOWN_HOVER_ACTION_ID = 'editor.action.pageDownHover';
export const GO_TO_TOP_HOVER_ACTION_ID = 'editor.action.goToTopHover';
export const GO_TO_BOTTOM_HOVER_ACTION_ID = 'editor.action.goToBottomHover';
export const INCREASE_HOVER_VERBOSITY_ACTION_ID = 'editor.action.increaseHoverVerbosityLevel';
export const INCREASE_HOVER_VERBOSITY_ACCESSIBLE_ACTION_ID = 'editor.action.increaseHoverVerbosityLevelFromAccessibleView';
export const INCREASE_HOVER_VERBOSITY_ACTION_LABEL = nls.localize({ key: 'increaseHoverVerbosityLevel', comment: ['Label for action that will increase the hover verbosity level.'] }, "Increase Hover Verbosity Level");
export const DECREASE_HOVER_VERBOSITY_ACTION_ID = 'editor.action.decreaseHoverVerbosityLevel';
export const DECREASE_HOVER_VERBOSITY_ACCESSIBLE_ACTION_ID = 'editor.action.decreaseHoverVerbosityLevelFromAccessibleView';
export const DECREASE_HOVER_VERBOSITY_ACTION_LABEL = nls.localize({ key: 'decreaseHoverVerbosityLevel', comment: ['Label for action that will decrease the hover verbosity level.'] }, "Decrease Hover Verbosity Level");
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/hoverActions.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/hoverActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DECREASE_HOVER_VERBOSITY_ACTION_ID, DECREASE_HOVER_VERBOSITY_ACTION_LABEL, GO_TO_BOTTOM_HOVER_ACTION_ID, GO_TO_TOP_HOVER_ACTION_ID, HIDE_HOVER_ACTION_ID, INCREASE_HOVER_VERBOSITY_ACTION_ID, INCREASE_HOVER_VERBOSITY_ACTION_LABEL, PAGE_DOWN_HOVER_ACTION_ID, PAGE_UP_HOVER_ACTION_ID, SCROLL_DOWN_HOVER_ACTION_ID, SCROLL_LEFT_HOVER_ACTION_ID, SCROLL_RIGHT_HOVER_ACTION_ID, SCROLL_UP_HOVER_ACTION_ID, SHOW_DEFINITION_PREVIEW_HOVER_ACTION_ID, SHOW_OR_FOCUS_HOVER_ACTION_ID } from './hoverActionIds.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { GotoDefinitionAtPositionEditorContribution } from '../../gotoSymbol/browser/link/goToDefinitionAtPosition.js';
import { HoverStartMode, HoverStartSource } from './hoverOperation.js';
import { AccessibilitySupport } from '../../../../platform/accessibility/common/accessibility.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ContentHoverController } from './contentHoverController.js';
import { HoverVerbosityAction } from '../../../common/languages.js';
import * as nls from '../../../../nls.js';
import './hover.css';

enum HoverFocusBehavior {
	NoAutoFocus = 'noAutoFocus',
	FocusIfVisible = 'focusIfVisible',
	AutoFocusImmediately = 'autoFocusImmediately'
}

export class ShowOrFocusHoverAction extends EditorAction {

	constructor() {
		super({
			id: SHOW_OR_FOCUS_HOVER_ACTION_ID,
			label: nls.localize2({
				key: 'showOrFocusHover',
				comment: [
					'Label for action that will trigger the showing/focusing of a hover in the editor.',
					'If the hover is not visible, it will show the hover.',
					'This allows for users to show the hover without using the mouse.'
				]
			}, "Show or Focus Hover"),
			metadata: {
				description: nls.localize2('showOrFocusHoverDescription', 'Show or focus the editor hover which shows documentation, references, and other content for a symbol at the current cursor position.'),
				args: [{
					name: 'args',
					schema: {
						type: 'object',
						properties: {
							'focus': {
								description: 'Controls if and when the hover should take focus upon being triggered by this action.',
								enum: [HoverFocusBehavior.NoAutoFocus, HoverFocusBehavior.FocusIfVisible, HoverFocusBehavior.AutoFocusImmediately],
								enumDescriptions: [
									nls.localize('showOrFocusHover.focus.noAutoFocus', 'The hover will not automatically take focus.'),
									nls.localize('showOrFocusHover.focus.focusIfVisible', 'The hover will take focus only if it is already visible.'),
									nls.localize('showOrFocusHover.focus.autoFocusImmediately', 'The hover will automatically take focus when it appears.'),
								],
								default: HoverFocusBehavior.FocusIfVisible,
							}
						},
					}
				}]
			},
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyI),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor, args: any): void {
		if (!editor.hasModel()) {
			return;
		}

		const controller = ContentHoverController.get(editor);
		if (!controller) {
			return;
		}

		const focusArgument = args?.focus;
		let focusOption = HoverFocusBehavior.FocusIfVisible;
		if (Object.values(HoverFocusBehavior).includes(focusArgument)) {
			focusOption = focusArgument;
		} else if (typeof focusArgument === 'boolean' && focusArgument) {
			focusOption = HoverFocusBehavior.AutoFocusImmediately;
		}

		const showContentHover = (focus: boolean) => {
			const position = editor.getPosition();
			const range = new Range(position.lineNumber, position.column, position.lineNumber, position.column);
			controller.showContentHover(range, HoverStartMode.Immediate, HoverStartSource.Keyboard, focus);
		};

		const accessibilitySupportEnabled = editor.getOption(EditorOption.accessibilitySupport) === AccessibilitySupport.Enabled;

		if (controller.isHoverVisible) {
			if (focusOption !== HoverFocusBehavior.NoAutoFocus) {
				controller.focus();
			} else {
				showContentHover(accessibilitySupportEnabled);
			}
		} else {
			showContentHover(accessibilitySupportEnabled || focusOption === HoverFocusBehavior.AutoFocusImmediately);
		}
	}
}

export class ShowDefinitionPreviewHoverAction extends EditorAction {

	constructor() {
		super({
			id: SHOW_DEFINITION_PREVIEW_HOVER_ACTION_ID,
			label: nls.localize2({
				key: 'showDefinitionPreviewHover',
				comment: [
					'Label for action that will trigger the showing of definition preview hover in the editor.',
					'This allows for users to show the definition preview hover without using the mouse.'
				]
			}, "Show Definition Preview Hover"),
			precondition: undefined,
			metadata: {
				description: nls.localize2('showDefinitionPreviewHoverDescription', 'Show the definition preview hover in the editor.'),
			},
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const controller = ContentHoverController.get(editor);
		if (!controller) {
			return;
		}
		const position = editor.getPosition();

		if (!position) {
			return;
		}

		const range = new Range(position.lineNumber, position.column, position.lineNumber, position.column);
		const goto = GotoDefinitionAtPositionEditorContribution.get(editor);
		if (!goto) {
			return;
		}

		const promise = goto.startFindDefinitionFromCursor(position);
		promise.then(() => {
			controller.showContentHover(range, HoverStartMode.Immediate, HoverStartSource.Keyboard, true);
		});
	}
}

export class HideContentHoverAction extends EditorAction {

	constructor() {
		super({
			id: HIDE_HOVER_ACTION_ID,
			label: nls.localize2({
				key: 'hideHover',
				comment: ['Label for action that will hide the hover in the editor.']
			}, "Hide Hover"),
			alias: 'Hide Content Hover',
			precondition: undefined
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		ContentHoverController.get(editor)?.hideContentHover();
	}
}

export class ScrollUpHoverAction extends EditorAction {

	constructor() {
		super({
			id: SCROLL_UP_HOVER_ACTION_ID,
			label: nls.localize2({
				key: 'scrollUpHover',
				comment: [
					'Action that allows to scroll up in the hover widget with the up arrow when the hover widget is focused.'
				]
			}, "Scroll Up Hover"),
			precondition: EditorContextKeys.hoverFocused,
			kbOpts: {
				kbExpr: EditorContextKeys.hoverFocused,
				primary: KeyCode.UpArrow,
				weight: KeybindingWeight.EditorContrib
			},
			metadata: {
				description: nls.localize2('scrollUpHoverDescription', 'Scroll up the editor hover.')
			},
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const controller = ContentHoverController.get(editor);
		if (!controller) {
			return;
		}
		controller.scrollUp();
	}
}

export class ScrollDownHoverAction extends EditorAction {

	constructor() {
		super({
			id: SCROLL_DOWN_HOVER_ACTION_ID,
			label: nls.localize2({
				key: 'scrollDownHover',
				comment: [
					'Action that allows to scroll down in the hover widget with the up arrow when the hover widget is focused.'
				]
			}, "Scroll Down Hover"),
			precondition: EditorContextKeys.hoverFocused,
			kbOpts: {
				kbExpr: EditorContextKeys.hoverFocused,
				primary: KeyCode.DownArrow,
				weight: KeybindingWeight.EditorContrib
			},
			metadata: {
				description: nls.localize2('scrollDownHoverDescription', 'Scroll down the editor hover.'),
			},
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const controller = ContentHoverController.get(editor);
		if (!controller) {
			return;
		}
		controller.scrollDown();
	}
}

export class ScrollLeftHoverAction extends EditorAction {

	constructor() {
		super({
			id: SCROLL_LEFT_HOVER_ACTION_ID,
			label: nls.localize2({
				key: 'scrollLeftHover',
				comment: [
					'Action that allows to scroll left in the hover widget with the left arrow when the hover widget is focused.'
				]
			}, "Scroll Left Hover"),
			precondition: EditorContextKeys.hoverFocused,
			kbOpts: {
				kbExpr: EditorContextKeys.hoverFocused,
				primary: KeyCode.LeftArrow,
				weight: KeybindingWeight.EditorContrib
			},
			metadata: {
				description: nls.localize2('scrollLeftHoverDescription', 'Scroll left the editor hover.'),
			},
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const controller = ContentHoverController.get(editor);
		if (!controller) {
			return;
		}
		controller.scrollLeft();
	}
}

export class ScrollRightHoverAction extends EditorAction {

	constructor() {
		super({
			id: SCROLL_RIGHT_HOVER_ACTION_ID,
			label: nls.localize2({
				key: 'scrollRightHover',
				comment: [
					'Action that allows to scroll right in the hover widget with the right arrow when the hover widget is focused.'
				]
			}, "Scroll Right Hover"),
			precondition: EditorContextKeys.hoverFocused,
			kbOpts: {
				kbExpr: EditorContextKeys.hoverFocused,
				primary: KeyCode.RightArrow,
				weight: KeybindingWeight.EditorContrib
			},
			metadata: {
				description: nls.localize2('scrollRightHoverDescription', 'Scroll right the editor hover.')
			},
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const controller = ContentHoverController.get(editor);
		if (!controller) {
			return;
		}
		controller.scrollRight();
	}
}

export class PageUpHoverAction extends EditorAction {

	constructor() {
		super({
			id: PAGE_UP_HOVER_ACTION_ID,
			label: nls.localize2({
				key: 'pageUpHover',
				comment: [
					'Action that allows to page up in the hover widget with the page up command when the hover widget is focused.'
				]
			}, "Page Up Hover"),
			precondition: EditorContextKeys.hoverFocused,
			kbOpts: {
				kbExpr: EditorContextKeys.hoverFocused,
				primary: KeyCode.PageUp,
				secondary: [KeyMod.Alt | KeyCode.UpArrow],
				weight: KeybindingWeight.EditorContrib
			},
			metadata: {
				description: nls.localize2('pageUpHoverDescription', 'Page up the editor hover.'),
			},
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const controller = ContentHoverController.get(editor);
		if (!controller) {
			return;
		}
		controller.pageUp();
	}
}

export class PageDownHoverAction extends EditorAction {

	constructor() {
		super({
			id: PAGE_DOWN_HOVER_ACTION_ID,
			label: nls.localize2({
				key: 'pageDownHover',
				comment: [
					'Action that allows to page down in the hover widget with the page down command when the hover widget is focused.'
				]
			}, "Page Down Hover"),
			precondition: EditorContextKeys.hoverFocused,
			kbOpts: {
				kbExpr: EditorContextKeys.hoverFocused,
				primary: KeyCode.PageDown,
				secondary: [KeyMod.Alt | KeyCode.DownArrow],
				weight: KeybindingWeight.EditorContrib
			},
			metadata: {
				description: nls.localize2('pageDownHoverDescription', 'Page down the editor hover.'),
			},
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const controller = ContentHoverController.get(editor);
		if (!controller) {
			return;
		}
		controller.pageDown();
	}
}

export class GoToTopHoverAction extends EditorAction {

	constructor() {
		super({
			id: GO_TO_TOP_HOVER_ACTION_ID,
			label: nls.localize2({
				key: 'goToTopHover',
				comment: [
					'Action that allows to go to the top of the hover widget with the home command when the hover widget is focused.'
				]
			}, "Go To Top Hover"),
			precondition: EditorContextKeys.hoverFocused,
			kbOpts: {
				kbExpr: EditorContextKeys.hoverFocused,
				primary: KeyCode.Home,
				secondary: [KeyMod.CtrlCmd | KeyCode.UpArrow],
				weight: KeybindingWeight.EditorContrib
			},
			metadata: {
				description: nls.localize2('goToTopHoverDescription', 'Go to the top of the editor hover.'),
			},
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const controller = ContentHoverController.get(editor);
		if (!controller) {
			return;
		}
		controller.goToTop();
	}
}


export class GoToBottomHoverAction extends EditorAction {

	constructor() {
		super({
			id: GO_TO_BOTTOM_HOVER_ACTION_ID,
			label: nls.localize2({
				key: 'goToBottomHover',
				comment: [
					'Action that allows to go to the bottom in the hover widget with the end command when the hover widget is focused.'
				]
			}, "Go To Bottom Hover"),
			precondition: EditorContextKeys.hoverFocused,
			kbOpts: {
				kbExpr: EditorContextKeys.hoverFocused,
				primary: KeyCode.End,
				secondary: [KeyMod.CtrlCmd | KeyCode.DownArrow],
				weight: KeybindingWeight.EditorContrib
			},
			metadata: {
				description: nls.localize2('goToBottomHoverDescription', 'Go to the bottom of the editor hover.')
			},
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const controller = ContentHoverController.get(editor);
		if (!controller) {
			return;
		}
		controller.goToBottom();
	}
}

export class IncreaseHoverVerbosityLevel extends EditorAction {

	constructor() {
		super({
			id: INCREASE_HOVER_VERBOSITY_ACTION_ID,
			label: INCREASE_HOVER_VERBOSITY_ACTION_LABEL,
			alias: 'Increase Hover Verbosity Level',
			precondition: EditorContextKeys.hoverVisible
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor, args?: { index: number; focus: boolean }): void {
		const hoverController = ContentHoverController.get(editor);
		if (!hoverController) {
			return;
		}
		const index = args?.index !== undefined ? args.index : hoverController.focusedHoverPartIndex();
		hoverController.updateHoverVerbosityLevel(HoverVerbosityAction.Increase, index, args?.focus);
	}
}

export class DecreaseHoverVerbosityLevel extends EditorAction {

	constructor() {
		super({
			id: DECREASE_HOVER_VERBOSITY_ACTION_ID,
			label: DECREASE_HOVER_VERBOSITY_ACTION_LABEL,
			alias: 'Decrease Hover Verbosity Level',
			precondition: EditorContextKeys.hoverVisible
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor, args?: { index: number; focus: boolean }): void {
		const hoverController = ContentHoverController.get(editor);
		if (!hoverController) {
			return;
		}
		const index = args?.index !== undefined ? args.index : hoverController.focusedHoverPartIndex();
		ContentHoverController.get(editor)?.updateHoverVerbosityLevel(HoverVerbosityAction.Decrease, index, args?.focus);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/hoverContribution.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/hoverContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DecreaseHoverVerbosityLevel, GoToBottomHoverAction, GoToTopHoverAction, HideContentHoverAction, IncreaseHoverVerbosityLevel, PageDownHoverAction, PageUpHoverAction, ScrollDownHoverAction, ScrollLeftHoverAction, ScrollRightHoverAction, ScrollUpHoverAction, ShowDefinitionPreviewHoverAction, ShowOrFocusHoverAction } from './hoverActions.js';
import { EditorContributionInstantiation, registerEditorAction, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { editorHoverBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { HoverParticipantRegistry } from './hoverTypes.js';
import { MarkdownHoverParticipant } from './markdownHoverParticipant.js';
import { MarkerHoverParticipant } from './markerHoverParticipant.js';
import { ContentHoverController } from './contentHoverController.js';
import { GlyphHoverController } from './glyphHoverController.js';
import './hover.css';
import { AccessibleViewRegistry } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ExtHoverAccessibleView, HoverAccessibilityHelp, HoverAccessibleView } from './hoverAccessibleViews.js';

registerEditorContribution(ContentHoverController.ID, ContentHoverController, EditorContributionInstantiation.BeforeFirstInteraction);
registerEditorContribution(GlyphHoverController.ID, GlyphHoverController, EditorContributionInstantiation.BeforeFirstInteraction);
registerEditorAction(ShowOrFocusHoverAction);
registerEditorAction(ShowDefinitionPreviewHoverAction);
registerEditorAction(HideContentHoverAction);
registerEditorAction(ScrollUpHoverAction);
registerEditorAction(ScrollDownHoverAction);
registerEditorAction(ScrollLeftHoverAction);
registerEditorAction(ScrollRightHoverAction);
registerEditorAction(PageUpHoverAction);
registerEditorAction(PageDownHoverAction);
registerEditorAction(GoToTopHoverAction);
registerEditorAction(GoToBottomHoverAction);
registerEditorAction(IncreaseHoverVerbosityLevel);
registerEditorAction(DecreaseHoverVerbosityLevel);
HoverParticipantRegistry.register(MarkdownHoverParticipant);
HoverParticipantRegistry.register(MarkerHoverParticipant);

// theming
registerThemingParticipant((theme, collector) => {
	const hoverBorder = theme.getColor(editorHoverBorder);
	if (hoverBorder) {
		collector.addRule(`.monaco-editor .monaco-hover .hover-row:not(:first-child):not(:empty) { border-top: 1px solid ${hoverBorder.transparent(0.5)}; }`);
		collector.addRule(`.monaco-editor .monaco-hover hr { border-top: 1px solid ${hoverBorder.transparent(0.5)}; }`);
		collector.addRule(`.monaco-editor .monaco-hover hr { border-bottom: 0px solid ${hoverBorder.transparent(0.5)}; }`);
	}
});
AccessibleViewRegistry.register(new HoverAccessibleView());
AccessibleViewRegistry.register(new HoverAccessibilityHelp());
AccessibleViewRegistry.register(new ExtHoverAccessibleView());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/hoverCopyButton.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/hoverCopyButton.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { localize } from '../../../../nls.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { SimpleButton } from '../../find/browser/findWidget.js';
import { status } from '../../../../base/browser/ui/aria/aria.js';

/**
 * A button that appears in hover parts to copy their content to the clipboard.
 */
export class HoverCopyButton extends Disposable {

	private readonly _button: SimpleButton;

	constructor(
		private readonly _container: HTMLElement,
		private readonly _getContent: () => string,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@IHoverService private readonly _hoverService: IHoverService,
	) {
		super();

		this._container.classList.add('hover-row-with-copy');

		this._button = this._register(new SimpleButton({
			label: localize('hover.copy', "Copy"),
			icon: Codicon.copy,
			onTrigger: () => this._copyContent(),
			className: 'hover-copy-button',
		}, this._hoverService));

		this._container.appendChild(this._button.domNode);
	}

	private async _copyContent(): Promise<void> {
		const content = this._getContent();
		if (content) {
			await this._clipboardService.writeText(content);
			status(localize('hover.copied', "Copied to clipboard"));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/hoverOperation.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/hoverOperation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AsyncIterableProducer, CancelableAsyncIterableProducer, createCancelableAsyncIterableProducer, RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';

export interface IHoverComputer<TArgs, TResult> {
	/**
	 * This is called after half the hover time
	 */
	computeAsync?: (args: TArgs, token: CancellationToken) => AsyncIterableProducer<TResult>;
	/**
	 * This is called after all the hover time
	 */
	computeSync?: (args: TArgs) => TResult[];
}

const enum HoverOperationState {
	Idle,
	FirstWait,
	SecondWait,
	WaitingForAsync = 3,
	WaitingForAsyncShowingLoading = 4,
}

export const enum HoverStartMode {
	Delayed = 0,
	Immediate = 1
}

export const enum HoverStartSource {
	Mouse = 0,
	Click = 1,
	Keyboard = 2
}

export class HoverResult<TArgs, TResult> {
	constructor(
		public readonly value: TResult[],
		public readonly isComplete: boolean,
		public readonly hasLoadingMessage: boolean,
		public readonly options: TArgs
	) { }
}

/**
 * Computing the hover is very fine tuned.
 *
 * Suppose the hover delay is 300ms (the default). Then, when resting the mouse at an anchor:
 * - at 150ms, the async computation is triggered (i.e. semantic hover)
 *   - if async results already come in, they are not rendered yet.
 * - at 300ms, the sync computation is triggered (i.e. decorations, markers)
 *   - if there are sync or async results, they are rendered.
 * - at 900ms, if the async computation hasn't finished, a "Loading..." result is added.
 */
export class HoverOperation<TArgs, TResult> extends Disposable {

	private readonly _onResult = this._register(new Emitter<HoverResult<TArgs, TResult>>());
	public readonly onResult = this._onResult.event;

	private readonly _asyncComputationScheduler = this._register(new Debouncer((options: TArgs) => this._triggerAsyncComputation(options), 0));
	private readonly _syncComputationScheduler = this._register(new Debouncer((options: TArgs) => this._triggerSyncComputation(options), 0));
	private readonly _loadingMessageScheduler = this._register(new Debouncer((options: TArgs) => this._triggerLoadingMessage(options), 0));

	private _state = HoverOperationState.Idle;
	private _asyncIterable: CancelableAsyncIterableProducer<TResult> | null = null;
	private _asyncIterableDone: boolean = false;
	private _result: TResult[] = [];
	private _options: TArgs | undefined;

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _computer: IHoverComputer<TArgs, TResult>
	) {
		super();
	}

	public override dispose(): void {
		if (this._asyncIterable) {
			this._asyncIterable.cancel();
			this._asyncIterable = null;
		}
		this._options = undefined;
		super.dispose();
	}

	private get _hoverTime(): number {
		return this._editor.getOption(EditorOption.hover).delay;
	}

	private get _firstWaitTime(): number {
		return this._hoverTime / 2;
	}

	private get _secondWaitTime(): number {
		return this._hoverTime - this._firstWaitTime;
	}

	private get _loadingMessageTime(): number {
		return 3 * this._hoverTime;
	}

	private _setState(state: HoverOperationState, options: TArgs): void {
		this._options = options;
		this._state = state;
		this._fireResult(options);
	}

	private _triggerAsyncComputation(options: TArgs): void {
		this._setState(HoverOperationState.SecondWait, options);
		this._syncComputationScheduler.schedule(options, this._secondWaitTime);

		if (this._computer.computeAsync) {
			this._asyncIterableDone = false;
			this._asyncIterable = createCancelableAsyncIterableProducer(token => this._computer.computeAsync!(options, token));

			(async () => {
				try {
					for await (const item of this._asyncIterable!) {
						if (item) {
							this._result.push(item);
							this._fireResult(options);
						}
					}
					this._asyncIterableDone = true;

					if (this._state === HoverOperationState.WaitingForAsync || this._state === HoverOperationState.WaitingForAsyncShowingLoading) {
						this._setState(HoverOperationState.Idle, options);
					}

				} catch (e) {
					onUnexpectedError(e);
				}
			})();

		} else {
			this._asyncIterableDone = true;
		}
	}

	private _triggerSyncComputation(options: TArgs): void {
		if (this._computer.computeSync) {
			this._result = this._result.concat(this._computer.computeSync(options));
		}
		this._setState(this._asyncIterableDone ? HoverOperationState.Idle : HoverOperationState.WaitingForAsync, options);
	}

	private _triggerLoadingMessage(options: TArgs): void {
		if (this._state === HoverOperationState.WaitingForAsync) {
			this._setState(HoverOperationState.WaitingForAsyncShowingLoading, options);
		}
	}

	private _fireResult(options: TArgs): void {
		if (this._state === HoverOperationState.FirstWait || this._state === HoverOperationState.SecondWait) {
			// Do not send out results before the hover time
			return;
		}
		const isComplete = (this._state === HoverOperationState.Idle);
		const hasLoadingMessage = (this._state === HoverOperationState.WaitingForAsyncShowingLoading);
		this._onResult.fire(new HoverResult(this._result.slice(0), isComplete, hasLoadingMessage, options));
	}

	public start(mode: HoverStartMode, options: TArgs): void {
		if (mode === HoverStartMode.Delayed) {
			if (this._state === HoverOperationState.Idle) {
				this._setState(HoverOperationState.FirstWait, options);
				this._asyncComputationScheduler.schedule(options, this._firstWaitTime);
				this._loadingMessageScheduler.schedule(options, this._loadingMessageTime);
			}
		} else {
			switch (this._state) {
				case HoverOperationState.Idle:
					this._triggerAsyncComputation(options);
					this._syncComputationScheduler.cancel();
					this._triggerSyncComputation(options);
					break;
				case HoverOperationState.SecondWait:
					this._syncComputationScheduler.cancel();
					this._triggerSyncComputation(options);
					break;
			}
		}
	}

	public cancel(): void {
		this._asyncComputationScheduler.cancel();
		this._syncComputationScheduler.cancel();
		this._loadingMessageScheduler.cancel();
		if (this._asyncIterable) {
			this._asyncIterable.cancel();
			this._asyncIterable = null;
		}
		this._result = [];
		this._options = undefined;
		this._state = HoverOperationState.Idle;
	}

	public get options(): TArgs | undefined {
		return this._options;
	}
}

class Debouncer<TArgs> extends Disposable {

	private readonly _scheduler: RunOnceScheduler;

	private _options: TArgs | undefined;

	constructor(runner: (options: TArgs) => void, debounceTimeMs: number) {
		super();
		this._scheduler = this._register(new RunOnceScheduler(() => runner(this._options!), debounceTimeMs));
	}

	schedule(options: TArgs, debounceTimeMs: number): void {
		this._options = options;
		this._scheduler.schedule(debounceTimeMs);
	}

	cancel(): void {
		this._scheduler.cancel();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/hoverTypes.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/hoverTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Dimension } from '../../../../base/browser/dom.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { ScrollEvent } from '../../../../base/common/scrollable.js';
import { BrandedService, IConstructorSignature } from '../../../../platform/instantiation/common/instantiation.js';
import { ICodeEditor, IEditorMouseEvent } from '../../../browser/editorBrowser.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { IModelDecoration } from '../../../common/model.js';
import { HoverStartSource } from './hoverOperation.js';

export interface IHoverPart {
	/**
	 * The creator of this hover part.
	 */
	readonly owner: IEditorHoverParticipant;
	/**
	 * The range where this hover part applies.
	 */
	readonly range: Range;
	/**
	 * Force the hover to always be rendered at this specific range,
	 * even in the case of multiple hover parts.
	 */
	readonly forceShowAtRange?: boolean;

	/**
	 * If true, the hover item should appear before content
	 */
	readonly isBeforeContent?: boolean;
	/**
	 * Is this hover part still valid for this new anchor?
	 */
	isValidForHoverAnchor(anchor: HoverAnchor): boolean;
}

export const enum HoverAnchorType {
	Range = 1,
	ForeignElement = 2
}

export class HoverRangeAnchor {
	public readonly type = HoverAnchorType.Range;
	constructor(
		public readonly priority: number,
		public readonly range: Range,
		public readonly initialMousePosX: number | undefined,
		public readonly initialMousePosY: number | undefined,
	) {
	}
	public equals(other: HoverAnchor) {
		return (other.type === HoverAnchorType.Range && this.range.equalsRange(other.range));
	}
	public canAdoptVisibleHover(lastAnchor: HoverAnchor, showAtPosition: Position): boolean {
		return (lastAnchor.type === HoverAnchorType.Range && showAtPosition.lineNumber === this.range.startLineNumber);
	}
}

export class HoverForeignElementAnchor {
	public readonly type = HoverAnchorType.ForeignElement;
	constructor(
		public readonly priority: number,
		public readonly owner: IEditorHoverParticipant,
		public readonly range: Range,
		public readonly initialMousePosX: number | undefined,
		public readonly initialMousePosY: number | undefined,
		public readonly supportsMarkerHover: boolean | undefined
	) {
	}
	public equals(other: HoverAnchor) {
		return (other.type === HoverAnchorType.ForeignElement && this.owner === other.owner);
	}
	public canAdoptVisibleHover(lastAnchor: HoverAnchor, showAtPosition: Position): boolean {
		return (lastAnchor.type === HoverAnchorType.ForeignElement && this.owner === lastAnchor.owner);
	}
}

export type HoverAnchor = HoverRangeAnchor | HoverForeignElementAnchor;

export interface IEditorHoverStatusBar {
	addAction(actionOptions: { label: string; iconClass?: string; run: (target: HTMLElement) => void; commandId: string }): IEditorHoverAction;
	append(element: HTMLElement): HTMLElement;
}

export interface IEditorHoverAction {
	setEnabled(enabled: boolean): void;
}

export interface IEditorHoverColorPickerWidget {
	layout(): void;
}

export interface IEditorHoverContext {
	/**
	 * The contents rendered inside the fragment have been changed, which means that the hover should relayout.
	 */
	onContentsChanged(): void;
	/**
	 * Set the minimum dimensions of the resizable hover
	 */
	setMinimumDimensions(dimensions: Dimension): void;
	/**
	 * Hide the hover.
	 */
	hide(): void;
	/**
	 * Focus the hover.
	 */
	focus(): void;
}

export interface IEditorHoverRenderContext extends IEditorHoverContext {
	/**
	 * The fragment where dom elements should be attached.
	 */
	readonly fragment: DocumentFragment;
	/**
	 * The status bar for actions for this hover.
	 */
	readonly statusBar: IEditorHoverStatusBar;
}

export interface IRenderedHoverPart<T extends IHoverPart> extends IDisposable {
	/**
	 * The rendered hover part.
	 */
	hoverPart: T;
	/**
	 * The HTML element containing the hover part.
	 */
	hoverElement: HTMLElement;
}

export interface IRenderedHoverParts<T extends IHoverPart> extends IDisposable {
	/**
	 * Array of rendered hover parts.
	 */
	renderedHoverParts: IRenderedHoverPart<T>[];
}

/**
 * Default implementation of IRenderedHoverParts.
 */
export class RenderedHoverParts<T extends IHoverPart> implements IRenderedHoverParts<T> {

	constructor(public readonly renderedHoverParts: IRenderedHoverPart<T>[], private readonly disposables?: IDisposable) { }

	dispose() {
		for (const part of this.renderedHoverParts) {
			part.dispose();
		}
		this.disposables?.dispose();
	}
}

export interface IEditorHoverParticipant<T extends IHoverPart = IHoverPart> {
	readonly hoverOrdinal: number;
	suggestHoverAnchor?(mouseEvent: IEditorMouseEvent): HoverAnchor | null;
	computeSync(anchor: HoverAnchor, lineDecorations: IModelDecoration[], source: HoverStartSource): T[];
	computeAsync?(anchor: HoverAnchor, lineDecorations: IModelDecoration[], source: HoverStartSource, token: CancellationToken): AsyncIterable<T>;
	createLoadingMessage?(anchor: HoverAnchor): T | null;
	renderHoverParts(context: IEditorHoverRenderContext, hoverParts: T[]): IRenderedHoverParts<T>;
	getAccessibleContent(hoverPart: T): string;
	handleResize?(): void;
	handleHide?(): void;
	handleContentsChanged?(): void;
	handleScroll?(e: ScrollEvent): void;
}

export type IEditorHoverParticipantCtor = IConstructorSignature<IEditorHoverParticipant, [ICodeEditor]>;

export const HoverParticipantRegistry = (new class HoverParticipantRegistry {

	_participants: IEditorHoverParticipantCtor[] = [];

	public register<Services extends BrandedService[]>(ctor: { new(editor: ICodeEditor, ...services: Services): IEditorHoverParticipant }): void {
		this._participants.push(ctor as IEditorHoverParticipantCtor);
	}

	public getAll(): IEditorHoverParticipantCtor[] {
		return this._participants;
	}

}());

export interface IHoverWidget {
	/**
	 * Returns whether the hover widget is shown or should show in the future.
	 * If the widget should show, this triggers the display.
	 * @param mouseEvent editor mouse event
	 */
	showsOrWillShow(mouseEvent: IEditorMouseEvent): boolean;

	/**
	 * Hides the hover.
	 */
	hide(): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/hoverUtils.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/hoverUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { IEditorMouseEvent } from '../../../browser/editorBrowser.js';

export function isMousePositionWithinElement(element: HTMLElement, posx: number, posy: number): boolean {
	const elementRect = dom.getDomNodePagePosition(element);
	if (posx < elementRect.left
		|| posx > elementRect.left + elementRect.width
		|| posy < elementRect.top
		|| posy > elementRect.top + elementRect.height) {
		return false;
	}
	return true;
}
/**
 * Determines whether hover should be shown based on the hover setting and current keyboard modifiers.
 * When `hoverEnabled` is 'onKeyboardModifier', hover is shown when the user presses the opposite
 * modifier key from the multi-cursor modifier (e.g., if multi-cursor uses Alt, hover shows on Ctrl/Cmd).
 *
 * @param hoverEnabled - The hover enabled setting
 * @param multiCursorModifier - The modifier key used for multi-cursor operations
 * @param mouseEvent - The current mouse event containing modifier key states
 * @returns true if hover should be shown, false otherwise
 */
export function shouldShowHover(
	hoverEnabled: 'on' | 'off' | 'onKeyboardModifier',
	multiCursorModifier: 'altKey' | 'ctrlKey' | 'metaKey',
	mouseEvent: IEditorMouseEvent
): boolean {
	if (hoverEnabled === 'on') {
		return true;
	}
	if (hoverEnabled === 'off') {
		return false;
	}
	if (multiCursorModifier === 'altKey') {
		return mouseEvent.event.ctrlKey || mouseEvent.event.metaKey;
	} else {
		return mouseEvent.event.altKey;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/markdownHoverParticipant.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/markdownHoverParticipant.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { asArray, compareBy, numberComparator } from '../../../../base/common/arrays.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { IMarkdownString, isEmptyMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { DECREASE_HOVER_VERBOSITY_ACTION_ID, INCREASE_HOVER_VERBOSITY_ACTION_ID } from './hoverActionIds.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { IModelDecoration, ITextModel } from '../../../common/model.js';
import { HoverAnchor, HoverAnchorType, HoverRangeAnchor, IEditorHoverParticipant, IEditorHoverRenderContext, IHoverPart, IRenderedHoverPart, IRenderedHoverParts, RenderedHoverParts } from './hoverTypes.js';
import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Hover, HoverContext, HoverProvider, HoverVerbosityAction } from '../../../common/languages.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { onUnexpectedExternalError } from '../../../../base/common/errors.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ClickAction, HoverPosition, KeyDownAction } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { IHoverService, WorkbenchHoverDelegate } from '../../../../platform/hover/browser/hover.js';
import { AsyncIterableProducer } from '../../../../base/common/async.js';
import { LanguageFeatureRegistry } from '../../../common/languageFeatureRegistry.js';
import { getHoverProviderResultsAsAsyncIterable } from './getHover.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { HoverStartSource } from './hoverOperation.js';
import { ScrollEvent } from '../../../../base/common/scrollable.js';

const $ = dom.$;
const increaseHoverVerbosityIcon = registerIcon('hover-increase-verbosity', Codicon.add, nls.localize('increaseHoverVerbosity', 'Icon for increaseing hover verbosity.'));
const decreaseHoverVerbosityIcon = registerIcon('hover-decrease-verbosity', Codicon.remove, nls.localize('decreaseHoverVerbosity', 'Icon for decreasing hover verbosity.'));

export class MarkdownHover implements IHoverPart {

	constructor(
		public readonly owner: IEditorHoverParticipant<MarkdownHover>,
		public readonly range: Range,
		public readonly contents: IMarkdownString[],
		public readonly isBeforeContent: boolean,
		public readonly ordinal: number,
		public readonly source: HoverSource | undefined = undefined,
	) { }

	public isValidForHoverAnchor(anchor: HoverAnchor): boolean {
		return (
			anchor.type === HoverAnchorType.Range
			&& this.range.startColumn <= anchor.range.startColumn
			&& this.range.endColumn >= anchor.range.endColumn
		);
	}
}

class HoverSource {

	constructor(
		readonly hover: Hover,
		readonly hoverProvider: HoverProvider,
		readonly hoverPosition: Position,
	) { }

	public supportsVerbosityAction(hoverVerbosityAction: HoverVerbosityAction): boolean {
		switch (hoverVerbosityAction) {
			case HoverVerbosityAction.Increase:
				return this.hover.canIncreaseVerbosity ?? false;
			case HoverVerbosityAction.Decrease:
				return this.hover.canDecreaseVerbosity ?? false;
		}
	}
}

export class MarkdownHoverParticipant implements IEditorHoverParticipant<MarkdownHover> {

	public readonly hoverOrdinal: number = 3;

	private _renderedHoverParts: MarkdownRenderedHoverParts | undefined;

	constructor(
		protected readonly _editor: ICodeEditor,
		@IMarkdownRendererService private readonly _markdownRendererService: IMarkdownRendererService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILanguageFeaturesService protected readonly _languageFeaturesService: ILanguageFeaturesService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IHoverService private readonly _hoverService: IHoverService,
		@ICommandService private readonly _commandService: ICommandService,
	) { }

	public createLoadingMessage(anchor: HoverAnchor): MarkdownHover | null {
		return new MarkdownHover(this, anchor.range, [new MarkdownString().appendText(nls.localize('modesContentHover.loading', "Loading..."))], false, 2000);
	}

	public computeSync(anchor: HoverAnchor, lineDecorations: IModelDecoration[]): MarkdownHover[] {
		if (!this._editor.hasModel() || anchor.type !== HoverAnchorType.Range) {
			return [];
		}

		const model = this._editor.getModel();
		const lineNumber = anchor.range.startLineNumber;
		const maxColumn = model.getLineMaxColumn(lineNumber);
		const result: MarkdownHover[] = [];

		let index = 1000;

		const lineLength = model.getLineLength(lineNumber);
		const languageId = model.getLanguageIdAtPosition(anchor.range.startLineNumber, anchor.range.startColumn);
		const stopRenderingLineAfter = this._editor.getOption(EditorOption.stopRenderingLineAfter);
		const maxTokenizationLineLength = this._configurationService.getValue<number>('editor.maxTokenizationLineLength', {
			overrideIdentifier: languageId
		});
		let stopRenderingMessage = false;
		if (stopRenderingLineAfter >= 0 && lineLength > stopRenderingLineAfter && anchor.range.startColumn >= stopRenderingLineAfter) {
			stopRenderingMessage = true;
			result.push(new MarkdownHover(this, anchor.range, [{
				value: nls.localize('stopped rendering', "Rendering paused for long line for performance reasons. This can be configured via `editor.stopRenderingLineAfter`.")
			}], false, index++));
		}
		if (!stopRenderingMessage && typeof maxTokenizationLineLength === 'number' && lineLength >= maxTokenizationLineLength) {
			result.push(new MarkdownHover(this, anchor.range, [{
				value: nls.localize('too many characters', "Tokenization is skipped for long lines for performance reasons. This can be configured via `editor.maxTokenizationLineLength`.")
			}], false, index++));
		}

		let isBeforeContent = false;

		for (const d of lineDecorations) {
			const startColumn = (d.range.startLineNumber === lineNumber) ? d.range.startColumn : 1;
			const endColumn = (d.range.endLineNumber === lineNumber) ? d.range.endColumn : maxColumn;

			const hoverMessage = d.options.hoverMessage;
			if (!hoverMessage || isEmptyMarkdownString(hoverMessage)) {
				continue;
			}

			if (d.options.beforeContentClassName) {
				isBeforeContent = true;
			}

			const range = new Range(anchor.range.startLineNumber, startColumn, anchor.range.startLineNumber, endColumn);
			result.push(new MarkdownHover(this, range, asArray(hoverMessage), isBeforeContent, index++));
		}

		return result;
	}

	public computeAsync(anchor: HoverAnchor, lineDecorations: IModelDecoration[], source: HoverStartSource, token: CancellationToken): AsyncIterable<MarkdownHover> {
		if (!this._editor.hasModel() || anchor.type !== HoverAnchorType.Range) {
			return AsyncIterableProducer.EMPTY;
		}

		const model = this._editor.getModel();

		const hoverProviderRegistry = this._languageFeaturesService.hoverProvider;
		if (!hoverProviderRegistry.has(model)) {
			return AsyncIterableProducer.EMPTY;
		}
		return this._getMarkdownHovers(hoverProviderRegistry, model, anchor, token);
	}

	private async *_getMarkdownHovers(hoverProviderRegistry: LanguageFeatureRegistry<HoverProvider>, model: ITextModel, anchor: HoverRangeAnchor, token: CancellationToken): AsyncIterable<MarkdownHover> {
		const position = anchor.range.getStartPosition();
		const hoverProviderResults = getHoverProviderResultsAsAsyncIterable(hoverProviderRegistry, model, position, token);

		for await (const item of hoverProviderResults) {
			if (!isEmptyMarkdownString(item.hover.contents)) {
				const range = item.hover.range ? Range.lift(item.hover.range) : anchor.range;
				const hoverSource = new HoverSource(item.hover, item.provider, position);
				yield new MarkdownHover(this, range, item.hover.contents, false, item.ordinal, hoverSource);
			}
		}
	}

	public renderHoverParts(context: IEditorHoverRenderContext, hoverParts: MarkdownHover[]): IRenderedHoverParts<MarkdownHover> {
		this._renderedHoverParts = new MarkdownRenderedHoverParts(
			hoverParts,
			context.fragment,
			this,
			this._editor,
			this._commandService,
			this._keybindingService,
			this._hoverService,
			this._configurationService,
			this._markdownRendererService,
			context.onContentsChanged
		);
		return this._renderedHoverParts;
	}

	public handleScroll(e: ScrollEvent): void {
		this._renderedHoverParts?.handleScroll(e);
	}

	public getAccessibleContent(hoverPart: MarkdownHover): string {
		return this._renderedHoverParts?.getAccessibleContent(hoverPart) ?? '';
	}

	public doesMarkdownHoverAtIndexSupportVerbosityAction(index: number, action: HoverVerbosityAction): boolean {
		return this._renderedHoverParts?.doesMarkdownHoverAtIndexSupportVerbosityAction(index, action) ?? false;
	}

	public updateMarkdownHoverVerbosityLevel(action: HoverVerbosityAction, index: number): Promise<{ hoverPart: MarkdownHover; hoverElement: HTMLElement } | undefined> {
		return Promise.resolve(this._renderedHoverParts?.updateMarkdownHoverPartVerbosityLevel(action, index));
	}
}

class RenderedMarkdownHoverPart implements IRenderedHoverPart<MarkdownHover> {

	constructor(
		public readonly hoverPart: MarkdownHover,
		public readonly hoverElement: HTMLElement,
		public readonly disposables: DisposableStore,
		public readonly actionsContainer?: HTMLElement
	) { }

	get hoverAccessibleContent(): string {
		return this.hoverElement.innerText.trim();
	}

	dispose(): void {
		this.disposables.dispose();
	}
}

class MarkdownRenderedHoverParts implements IRenderedHoverParts<MarkdownHover> {

	public renderedHoverParts: RenderedMarkdownHoverPart[];

	private _ongoingHoverOperations: Map<HoverProvider, { verbosityDelta: number; tokenSource: CancellationTokenSource }> = new Map();

	private readonly _disposables = new DisposableStore();

	constructor(
		hoverParts: MarkdownHover[],
		hoverPartsContainer: DocumentFragment,
		private readonly _hoverParticipant: MarkdownHoverParticipant,
		private readonly _editor: ICodeEditor,
		private readonly _commandService: ICommandService,
		private readonly _keybindingService: IKeybindingService,
		private readonly _hoverService: IHoverService,
		private readonly _configurationService: IConfigurationService,
		private readonly _markdownRendererService: IMarkdownRendererService,
		private readonly _onFinishedRendering: () => void,
	) {
		this.renderedHoverParts = this._renderHoverParts(hoverParts, hoverPartsContainer, this._onFinishedRendering);
		this._disposables.add(toDisposable(() => {
			this.renderedHoverParts.forEach(renderedHoverPart => {
				renderedHoverPart.dispose();
			});
			this._ongoingHoverOperations.forEach(operation => {
				operation.tokenSource.dispose(true);
			});
		}));
	}

	private _renderHoverParts(
		hoverParts: MarkdownHover[],
		hoverPartsContainer: DocumentFragment,
		onFinishedRendering: () => void,
	): RenderedMarkdownHoverPart[] {
		hoverParts.sort(compareBy(hover => hover.ordinal, numberComparator));
		return hoverParts.map(hoverPart => {
			const renderedHoverPart = this._renderHoverPart(hoverPart, onFinishedRendering);
			hoverPartsContainer.appendChild(renderedHoverPart.hoverElement);
			return renderedHoverPart;
		});
	}

	private _renderHoverPart(
		hoverPart: MarkdownHover,
		onFinishedRendering: () => void
	): RenderedMarkdownHoverPart {

		const renderedMarkdownPart = this._renderMarkdownHover(hoverPart, onFinishedRendering);
		const renderedMarkdownElement = renderedMarkdownPart.hoverElement;
		const hoverSource = hoverPart.source;
		const disposables = new DisposableStore();
		disposables.add(renderedMarkdownPart);

		if (!hoverSource) {
			return new RenderedMarkdownHoverPart(hoverPart, renderedMarkdownElement, disposables);
		}

		const canIncreaseVerbosity = hoverSource.supportsVerbosityAction(HoverVerbosityAction.Increase);
		const canDecreaseVerbosity = hoverSource.supportsVerbosityAction(HoverVerbosityAction.Decrease);

		if (!canIncreaseVerbosity && !canDecreaseVerbosity) {
			return new RenderedMarkdownHoverPart(hoverPart, renderedMarkdownElement, disposables);
		}

		const actionsContainer = $('div.verbosity-actions');
		renderedMarkdownElement.prepend(actionsContainer);
		const actionsContainerInner = $('div.verbosity-actions-inner');
		actionsContainer.append(actionsContainerInner);
		disposables.add(this._renderHoverExpansionAction(actionsContainerInner, HoverVerbosityAction.Increase, canIncreaseVerbosity));
		disposables.add(this._renderHoverExpansionAction(actionsContainerInner, HoverVerbosityAction.Decrease, canDecreaseVerbosity));
		return new RenderedMarkdownHoverPart(hoverPart, renderedMarkdownElement, disposables, actionsContainerInner);
	}

	private _renderMarkdownHover(
		markdownHover: MarkdownHover,
		onFinishedRendering: () => void
	): IRenderedHoverPart<MarkdownHover> {
		const renderedMarkdownHover = renderMarkdown(
			this._editor,
			markdownHover,
			this._markdownRendererService,
			onFinishedRendering,
		);
		return renderedMarkdownHover;
	}

	private _renderHoverExpansionAction(container: HTMLElement, action: HoverVerbosityAction, actionEnabled: boolean): DisposableStore {
		const store = new DisposableStore();
		const isActionIncrease = action === HoverVerbosityAction.Increase;
		const actionElement = dom.append(container, $(ThemeIcon.asCSSSelector(isActionIncrease ? increaseHoverVerbosityIcon : decreaseHoverVerbosityIcon)));
		actionElement.tabIndex = 0;
		const hoverDelegate = store.add(new WorkbenchHoverDelegate('mouse', undefined, { target: container, position: { hoverPosition: HoverPosition.LEFT } }, this._configurationService, this._hoverService));
		store.add(this._hoverService.setupManagedHover(hoverDelegate, actionElement, labelForHoverVerbosityAction(this._keybindingService, action)));
		if (!actionEnabled) {
			actionElement.classList.add('disabled');
			return store;
		}
		actionElement.classList.add('enabled');
		const actionFunction = () => this._commandService.executeCommand(action === HoverVerbosityAction.Increase ? INCREASE_HOVER_VERBOSITY_ACTION_ID : DECREASE_HOVER_VERBOSITY_ACTION_ID, { focus: true });
		store.add(new ClickAction(actionElement, actionFunction));
		store.add(new KeyDownAction(actionElement, actionFunction, [KeyCode.Enter, KeyCode.Space]));
		return store;
	}

	public handleScroll(e: ScrollEvent): void {
		this.renderedHoverParts.forEach(renderedHoverPart => {
			const actionsContainerInner = renderedHoverPart.actionsContainer;
			if (!actionsContainerInner) {
				return;
			}
			const hoverElement = renderedHoverPart.hoverElement;
			const topOfHoverScrollPosition = e.scrollTop;
			const bottomOfHoverScrollPosition = topOfHoverScrollPosition + e.height;
			const topOfRenderedPart = hoverElement.offsetTop;
			const hoverElementHeight = hoverElement.clientHeight;
			const bottomOfRenderedPart = topOfRenderedPart + hoverElementHeight;
			const iconsHeight = 22;
			let top: number;
			if (bottomOfRenderedPart <= bottomOfHoverScrollPosition || topOfRenderedPart >= bottomOfHoverScrollPosition) {
				top = hoverElementHeight - iconsHeight;
			} else {
				top = bottomOfHoverScrollPosition - topOfRenderedPart - iconsHeight;
			}
			actionsContainerInner.style.top = `${top}px`;
		});
	}

	public async updateMarkdownHoverPartVerbosityLevel(action: HoverVerbosityAction, index: number): Promise<{ hoverPart: MarkdownHover; hoverElement: HTMLElement } | undefined> {
		const model = this._editor.getModel();
		if (!model) {
			return undefined;
		}
		const hoverRenderedPart = this._getRenderedHoverPartAtIndex(index);
		const hoverSource = hoverRenderedPart?.hoverPart.source;
		if (!hoverRenderedPart || !hoverSource?.supportsVerbosityAction(action)) {
			return undefined;
		}
		const newHover = await this._fetchHover(hoverSource, model, action);
		if (!newHover) {
			return undefined;
		}
		const newHoverSource = new HoverSource(newHover, hoverSource.hoverProvider, hoverSource.hoverPosition);
		const initialHoverPart = hoverRenderedPart.hoverPart;
		const newHoverPart = new MarkdownHover(
			this._hoverParticipant,
			initialHoverPart.range,
			newHover.contents,
			initialHoverPart.isBeforeContent,
			initialHoverPart.ordinal,
			newHoverSource
		);
		const newHoverRenderedPart = this._updateRenderedHoverPart(index, newHoverPart);
		if (!newHoverRenderedPart) {
			return undefined;
		}
		return {
			hoverPart: newHoverPart,
			hoverElement: newHoverRenderedPart.hoverElement
		};
	}

	public getAccessibleContent(hoverPart: MarkdownHover): string | undefined {
		const renderedHoverPartIndex = this.renderedHoverParts.findIndex(renderedHoverPart => renderedHoverPart.hoverPart === hoverPart);
		if (renderedHoverPartIndex === -1) {
			return undefined;
		}
		const renderedHoverPart = this._getRenderedHoverPartAtIndex(renderedHoverPartIndex);
		if (!renderedHoverPart) {
			return undefined;
		}
		const hoverElementInnerText = renderedHoverPart.hoverElement.innerText;
		const accessibleContent = hoverElementInnerText.replace(/[^\S\n\r]+/gu, ' ');
		return accessibleContent;
	}

	public doesMarkdownHoverAtIndexSupportVerbosityAction(index: number, action: HoverVerbosityAction): boolean {
		const hoverRenderedPart = this._getRenderedHoverPartAtIndex(index);
		const hoverSource = hoverRenderedPart?.hoverPart.source;
		if (!hoverRenderedPart || !hoverSource?.supportsVerbosityAction(action)) {
			return false;
		}
		return true;
	}

	private async _fetchHover(hoverSource: HoverSource, model: ITextModel, action: HoverVerbosityAction): Promise<Hover | null | undefined> {
		let verbosityDelta = action === HoverVerbosityAction.Increase ? 1 : -1;
		const provider = hoverSource.hoverProvider;
		const ongoingHoverOperation = this._ongoingHoverOperations.get(provider);
		if (ongoingHoverOperation) {
			ongoingHoverOperation.tokenSource.cancel();
			verbosityDelta += ongoingHoverOperation.verbosityDelta;
		}
		const tokenSource = new CancellationTokenSource();
		this._ongoingHoverOperations.set(provider, { verbosityDelta, tokenSource });
		const context: HoverContext = { verbosityRequest: { verbosityDelta, previousHover: hoverSource.hover } };
		let hover: Hover | null | undefined;
		try {
			hover = await Promise.resolve(provider.provideHover(model, hoverSource.hoverPosition, tokenSource.token, context));
		} catch (e) {
			onUnexpectedExternalError(e);
		}
		tokenSource.dispose();
		this._ongoingHoverOperations.delete(provider);
		return hover;
	}

	private _updateRenderedHoverPart(index: number, hoverPart: MarkdownHover): RenderedMarkdownHoverPart | undefined {
		if (index >= this.renderedHoverParts.length || index < 0) {
			return undefined;
		}
		const renderedHoverPart = this._renderHoverPart(hoverPart, this._onFinishedRendering);
		const currentRenderedHoverPart = this.renderedHoverParts[index];
		const currentRenderedMarkdown = currentRenderedHoverPart.hoverElement;
		const renderedMarkdown = renderedHoverPart.hoverElement;
		const renderedChildrenElements = Array.from(renderedMarkdown.children);
		currentRenderedMarkdown.replaceChildren(...renderedChildrenElements);
		const newRenderedHoverPart = new RenderedMarkdownHoverPart(
			hoverPart,
			currentRenderedMarkdown,
			renderedHoverPart.disposables,
			renderedHoverPart.actionsContainer
		);
		currentRenderedHoverPart.dispose();
		this.renderedHoverParts[index] = newRenderedHoverPart;
		return newRenderedHoverPart;
	}

	private _getRenderedHoverPartAtIndex(index: number): RenderedMarkdownHoverPart | undefined {
		return this.renderedHoverParts[index];
	}

	public dispose(): void {
		this._disposables.dispose();
	}
}

export function renderMarkdownHovers(
	context: IEditorHoverRenderContext,
	markdownHovers: MarkdownHover[],
	editor: ICodeEditor,
	markdownRendererService: IMarkdownRendererService,
): IRenderedHoverParts<MarkdownHover> {

	// Sort hover parts to keep them stable since they might come in async, out-of-order
	markdownHovers.sort(compareBy(hover => hover.ordinal, numberComparator));
	const renderedHoverParts: IRenderedHoverPart<MarkdownHover>[] = [];
	for (const markdownHover of markdownHovers) {
		const renderedHoverPart = renderMarkdown(
			editor,
			markdownHover,
			markdownRendererService,
			context.onContentsChanged,
		);
		context.fragment.appendChild(renderedHoverPart.hoverElement);
		renderedHoverParts.push(renderedHoverPart);
	}
	return new RenderedHoverParts(renderedHoverParts);
}

function renderMarkdown(
	editor: ICodeEditor,
	markdownHover: MarkdownHover,
	markdownRendererService: IMarkdownRendererService,
	onFinishedRendering: () => void,
): IRenderedHoverPart<MarkdownHover> {
	const disposables = new DisposableStore();
	const renderedMarkdown = $('div.hover-row');
	const renderedMarkdownContents = $('div.hover-row-contents');
	renderedMarkdown.appendChild(renderedMarkdownContents);
	const markdownStrings = markdownHover.contents;
	for (const markdownString of markdownStrings) {
		if (isEmptyMarkdownString(markdownString)) {
			continue;
		}
		const markdownHoverElement = $('div.markdown-hover');
		const hoverContentsElement = dom.append(markdownHoverElement, $('div.hover-contents'));

		const renderedContents = disposables.add(markdownRendererService.render(markdownString, {
			context: editor,
			asyncRenderCallback: () => {
				hoverContentsElement.className = 'hover-contents code-hover-contents';
				onFinishedRendering();
			}
		}));
		hoverContentsElement.appendChild(renderedContents.element);
		renderedMarkdownContents.appendChild(markdownHoverElement);
	}
	const renderedHoverPart: IRenderedHoverPart<MarkdownHover> = {
		hoverPart: markdownHover,
		hoverElement: renderedMarkdown,
		dispose() { disposables.dispose(); }
	};
	return renderedHoverPart;
}

export function labelForHoverVerbosityAction(keybindingService: IKeybindingService, action: HoverVerbosityAction): string {
	switch (action) {
		case HoverVerbosityAction.Increase: {
			const kb = keybindingService.lookupKeybinding(INCREASE_HOVER_VERBOSITY_ACTION_ID);
			return kb ?
				nls.localize('increaseVerbosityWithKb', "Increase Hover Verbosity ({0})", kb.getLabel()) :
				nls.localize('increaseVerbosity', "Increase Hover Verbosity");
		}
		case HoverVerbosityAction.Decrease: {
			const kb = keybindingService.lookupKeybinding(DECREASE_HOVER_VERBOSITY_ACTION_ID);
			return kb ?
				nls.localize('decreaseVerbosityWithKb', "Decrease Hover Verbosity ({0})", kb.getLabel()) :
				nls.localize('decreaseVerbosity', "Decrease Hover Verbosity");
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/markerHoverParticipant.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/markerHoverParticipant.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { CancelablePromise, createCancelablePromise, disposableTimeout } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { basename } from '../../../../base/common/resources.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import { CodeActionTriggerType } from '../../../common/languages.js';
import { IModelDecoration } from '../../../common/model.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { IMarkerDecorationsService } from '../../../common/services/markerDecorations.js';
import { ApplyCodeActionReason, getCodeActions, quickFixCommandId } from '../../codeAction/browser/codeAction.js';
import { CodeActionController } from '../../codeAction/browser/codeActionController.js';
import { CodeActionKind, CodeActionSet, CodeActionTrigger, CodeActionTriggerSource } from '../../codeAction/common/types.js';
import { MarkerController, NextMarkerAction } from '../../gotoError/browser/gotoError.js';
import { HoverAnchor, HoverAnchorType, IEditorHoverParticipant, IEditorHoverRenderContext, IHoverPart, IRenderedHoverPart, IRenderedHoverParts, RenderedHoverParts } from './hoverTypes.js';
import * as nls from '../../../../nls.js';
import { ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IMarker, IMarkerData, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { Progress } from '../../../../platform/progress/common/progress.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Codicon } from '../../../../base/common/codicons.js';

const $ = dom.$;

export class MarkerHover implements IHoverPart {

	constructor(
		public readonly owner: IEditorHoverParticipant<MarkerHover>,
		public readonly range: Range,
		public readonly marker: IMarker,
	) { }

	public isValidForHoverAnchor(anchor: HoverAnchor): boolean {
		return (
			anchor.type === HoverAnchorType.Range
			&& this.range.startColumn <= anchor.range.startColumn
			&& this.range.endColumn >= anchor.range.endColumn
		);
	}
}

const markerCodeActionTrigger: CodeActionTrigger = {
	type: CodeActionTriggerType.Invoke,
	filter: { include: CodeActionKind.QuickFix },
	triggerAction: CodeActionTriggerSource.QuickFixHover
};

export class MarkerHoverParticipant implements IEditorHoverParticipant<MarkerHover> {

	public readonly hoverOrdinal: number = 1;

	private recentMarkerCodeActionsInfo: { marker: IMarker; hasCodeActions: boolean } | undefined = undefined;

	constructor(
		private readonly _editor: ICodeEditor,
		@IMarkerDecorationsService private readonly _markerDecorationsService: IMarkerDecorationsService,
		@IOpenerService private readonly _openerService: IOpenerService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
	) { }

	public computeSync(anchor: HoverAnchor, lineDecorations: IModelDecoration[]): MarkerHover[] {
		if (!this._editor.hasModel() || anchor.type !== HoverAnchorType.Range && !anchor.supportsMarkerHover) {
			return [];
		}

		const model = this._editor.getModel();
		const anchorRange = anchor.range;
		if (!model.isValidRange(anchor.range)) {
			return [];
		}
		const lineNumber = anchorRange.startLineNumber;
		const maxColumn = model.getLineMaxColumn(lineNumber);
		const result: MarkerHover[] = [];
		for (const d of lineDecorations) {
			const startColumn = (d.range.startLineNumber === lineNumber) ? d.range.startColumn : 1;
			const endColumn = (d.range.endLineNumber === lineNumber) ? d.range.endColumn : maxColumn;

			const marker = this._markerDecorationsService.getMarker(model.uri, d);
			if (!marker) {
				continue;
			}

			const range = new Range(anchor.range.startLineNumber, startColumn, anchor.range.startLineNumber, endColumn);
			result.push(new MarkerHover(this, range, marker));
		}

		return result;
	}

	public renderHoverParts(context: IEditorHoverRenderContext, hoverParts: MarkerHover[]): IRenderedHoverParts<MarkerHover> {
		if (!hoverParts.length) {
			return new RenderedHoverParts([]);
		}
		const renderedHoverParts: IRenderedHoverPart<MarkerHover>[] = [];
		hoverParts.forEach(hoverPart => {
			const renderedMarkerHover = this._renderMarkerHover(hoverPart);
			context.fragment.appendChild(renderedMarkerHover.hoverElement);
			renderedHoverParts.push(renderedMarkerHover);
		});
		const markerHoverForStatusbar = hoverParts.length === 1 ? hoverParts[0] : hoverParts.sort((a, b) => MarkerSeverity.compare(a.marker.severity, b.marker.severity))[0];
		const disposables = this._renderMarkerStatusbar(context, markerHoverForStatusbar);
		return new RenderedHoverParts(renderedHoverParts, disposables);
	}

	public getAccessibleContent(hoverPart: MarkerHover): string {
		return hoverPart.marker.message;
	}

	private _renderMarkerHover(markerHover: MarkerHover): IRenderedHoverPart<MarkerHover> {
		const disposables: DisposableStore = new DisposableStore();
		const hoverElement = $('div.hover-row');
		const markerElement = dom.append(hoverElement, $('div.marker.hover-contents'));
		const { source, message, code, relatedInformation } = markerHover.marker;

		this._editor.applyFontInfo(markerElement);
		const messageElement = dom.append(markerElement, $('span'));
		messageElement.style.whiteSpace = 'pre-wrap';
		messageElement.innerText = message;

		if (source || code) {
			// Code has link
			if (code && typeof code !== 'string') {
				const sourceAndCodeElement = $('span');
				if (source) {
					const sourceElement = dom.append(sourceAndCodeElement, $('span'));
					sourceElement.innerText = source;
				}
				const codeLink = dom.append(sourceAndCodeElement, $('a.code-link'));
				codeLink.setAttribute('href', code.target.toString(true));

				disposables.add(dom.addDisposableListener(codeLink, 'click', (e) => {
					this._openerService.open(code.target, { allowCommands: true });
					e.preventDefault();
					e.stopPropagation();
				}));

				const codeElement = dom.append(codeLink, $('span'));
				codeElement.innerText = code.value;

				const detailsElement = dom.append(markerElement, sourceAndCodeElement);
				detailsElement.style.opacity = '0.6';
				detailsElement.style.paddingLeft = '6px';
			} else {
				const detailsElement = dom.append(markerElement, $('span'));
				detailsElement.style.opacity = '0.6';
				detailsElement.style.paddingLeft = '6px';
				detailsElement.innerText = source && code ? `${source}(${code})` : source ? source : `(${code})`;
			}
		}

		if (isNonEmptyArray(relatedInformation)) {
			for (const { message, resource, startLineNumber, startColumn } of relatedInformation) {
				const relatedInfoContainer = dom.append(markerElement, $('div'));
				relatedInfoContainer.style.marginTop = '8px';
				const a = dom.append(relatedInfoContainer, $('a'));
				a.innerText = `${basename(resource)}(${startLineNumber}, ${startColumn}): `;
				a.style.cursor = 'pointer';
				disposables.add(dom.addDisposableListener(a, 'click', (e) => {
					e.stopPropagation();
					e.preventDefault();
					if (this._openerService) {
						const editorOptions: ITextEditorOptions = { selection: { startLineNumber, startColumn } };
						this._openerService.open(resource, {
							fromUserGesture: true,
							editorOptions
						}).catch(onUnexpectedError);
					}
				}));
				const messageElement = dom.append<HTMLAnchorElement>(relatedInfoContainer, $('span'));
				messageElement.innerText = message;
				this._editor.applyFontInfo(messageElement);
			}
		}

		const renderedHoverPart: IRenderedHoverPart<MarkerHover> = {
			hoverPart: markerHover,
			hoverElement,
			dispose: () => disposables.dispose()
		};
		return renderedHoverPart;
	}

	private _renderMarkerStatusbar(context: IEditorHoverRenderContext, markerHover: MarkerHover): IDisposable {
		const disposables = new DisposableStore();
		if (markerHover.marker.severity === MarkerSeverity.Error || markerHover.marker.severity === MarkerSeverity.Warning || markerHover.marker.severity === MarkerSeverity.Info) {
			const markerController = MarkerController.get(this._editor);
			if (markerController) {
				context.statusBar.addAction({
					label: nls.localize('view problem', "View Problem"),
					commandId: NextMarkerAction.ID,
					run: () => {
						context.hide();
						markerController.showAtMarker(markerHover.marker);
						this._editor.focus();
					}
				});
			}
		}

		if (!this._editor.getOption(EditorOption.readOnly)) {
			const quickfixPlaceholderElement = context.statusBar.append($('div'));
			if (this.recentMarkerCodeActionsInfo) {
				if (IMarkerData.makeKey(this.recentMarkerCodeActionsInfo.marker) === IMarkerData.makeKey(markerHover.marker)) {
					if (!this.recentMarkerCodeActionsInfo.hasCodeActions) {
						quickfixPlaceholderElement.textContent = nls.localize('noQuickFixes', "No quick fixes available");
					}
				} else {
					this.recentMarkerCodeActionsInfo = undefined;
				}
			}
			const updatePlaceholderDisposable = this.recentMarkerCodeActionsInfo && !this.recentMarkerCodeActionsInfo.hasCodeActions ? Disposable.None : disposableTimeout(() => quickfixPlaceholderElement.textContent = nls.localize('checkingForQuickFixes', "Checking for quick fixes..."), 200, disposables);
			if (!quickfixPlaceholderElement.textContent) {
				// Have some content in here to avoid flickering
				quickfixPlaceholderElement.textContent = String.fromCharCode(0xA0); // &nbsp;
			}
			const codeActionsPromise = this.getCodeActions(markerHover.marker);
			disposables.add(toDisposable(() => codeActionsPromise.cancel()));
			codeActionsPromise.then(actions => {
				updatePlaceholderDisposable.dispose();
				this.recentMarkerCodeActionsInfo = { marker: markerHover.marker, hasCodeActions: actions.validActions.length > 0 };

				if (!this.recentMarkerCodeActionsInfo.hasCodeActions) {
					actions.dispose();
					quickfixPlaceholderElement.textContent = nls.localize('noQuickFixes', "No quick fixes available");
					return;
				}
				quickfixPlaceholderElement.style.display = 'none';

				let showing = false;
				disposables.add(toDisposable(() => {
					if (!showing) {
						actions.dispose();
					}
				}));

				context.statusBar.addAction({
					label: nls.localize('quick fixes', "Quick Fix..."),
					commandId: quickFixCommandId,
					run: (target) => {
						showing = true;
						const controller = CodeActionController.get(this._editor);
						const elementPosition = dom.getDomNodePagePosition(target);
						// Hide the hover pre-emptively, otherwise the editor can close the code actions
						// context menu as well when using keyboard navigation
						context.hide();
						controller?.showCodeActions(markerCodeActionTrigger, actions, {
							x: elementPosition.left,
							y: elementPosition.top,
							width: elementPosition.width,
							height: elementPosition.height
						});
					}
				});

				const aiCodeAction = actions.validActions.find(action => action.action.isAI);
				if (aiCodeAction) {
					context.statusBar.addAction({
						label: aiCodeAction.action.title,
						commandId: aiCodeAction.action.command?.id ?? '',
						iconClass: ThemeIcon.asClassName(Codicon.sparkle),
						run: () => {
							const controller = CodeActionController.get(this._editor);
							controller?.applyCodeAction(aiCodeAction, false, false, ApplyCodeActionReason.FromProblemsHover);
						}
					});
				}

				// Notify that the contents have changed given we added
				// actions to the hover
				// https://github.com/microsoft/vscode/issues/250424
				context.onContentsChanged();

			}, onUnexpectedError);
		}
		return disposables;
	}

	private getCodeActions(marker: IMarker): CancelablePromise<CodeActionSet> {
		return createCancelablePromise(cancellationToken => {
			return getCodeActions(
				this._languageFeaturesService.codeActionProvider,
				this._editor.getModel()!,
				new Range(marker.startLineNumber, marker.startColumn, marker.endLineNumber, marker.endColumn),
				markerCodeActionTrigger,
				Progress.None,
				cancellationToken);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/browser/resizableContentWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/browser/resizableContentWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ResizableHTMLElement } from '../../../../base/browser/ui/resizable/resizable.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IPosition, Position } from '../../../common/core/position.js';
import * as dom from '../../../../base/browser/dom.js';

const TOP_HEIGHT = 30;
const BOTTOM_HEIGHT = 24;

export abstract class ResizableContentWidget extends Disposable implements IContentWidget {

	readonly allowEditorOverflow: boolean = true;
	readonly suppressMouseDown: boolean = false;

	protected readonly _resizableNode = this._register(new ResizableHTMLElement());
	protected _contentPosition: IContentWidgetPosition | null = null;

	private _isResizing: boolean = false;

	constructor(
		protected readonly _editor: ICodeEditor,
		minimumSize: dom.IDimension = new dom.Dimension(10, 10)
	) {
		super();
		this._resizableNode.domNode.style.position = 'absolute';
		this._resizableNode.minSize = dom.Dimension.lift(minimumSize);
		this._resizableNode.layout(minimumSize.height, minimumSize.width);
		this._resizableNode.enableSashes(true, true, true, true);
		this._register(this._resizableNode.onDidResize(e => {
			this._resize(new dom.Dimension(e.dimension.width, e.dimension.height));
			if (e.done) {
				this._isResizing = false;
			}
		}));
		this._register(this._resizableNode.onDidWillResize(() => {
			this._isResizing = true;
		}));
	}

	get isResizing() {
		return this._isResizing;
	}

	abstract getId(): string;

	getDomNode(): HTMLElement {
		return this._resizableNode.domNode;
	}

	getPosition(): IContentWidgetPosition | null {
		return this._contentPosition;
	}

	get position(): Position | undefined {
		return this._contentPosition?.position ? Position.lift(this._contentPosition.position) : undefined;
	}

	protected _availableVerticalSpaceAbove(position: IPosition): number | undefined {
		const editorDomNode = this._editor.getDomNode();
		const mouseBox = this._editor.getScrolledVisiblePosition(position);
		if (!editorDomNode || !mouseBox) {
			return;
		}
		const editorBox = dom.getDomNodePagePosition(editorDomNode);
		return editorBox.top + mouseBox.top - TOP_HEIGHT;
	}

	protected _availableVerticalSpaceBelow(position: IPosition): number | undefined {
		const editorDomNode = this._editor.getDomNode();
		const mouseBox = this._editor.getScrolledVisiblePosition(position);
		if (!editorDomNode || !mouseBox) {
			return;
		}
		const editorBox = dom.getDomNodePagePosition(editorDomNode);
		const bodyBox = dom.getClientArea(editorDomNode.ownerDocument.body);
		const mouseBottom = editorBox.top + mouseBox.top + mouseBox.height;
		return bodyBox.height - mouseBottom - BOTTOM_HEIGHT;
	}

	protected _findPositionPreference(widgetHeight: number, showAtPosition: IPosition): ContentWidgetPositionPreference | undefined {
		const maxHeightBelow = Math.min(this._availableVerticalSpaceBelow(showAtPosition) ?? Infinity, widgetHeight);
		const maxHeightAbove = Math.min(this._availableVerticalSpaceAbove(showAtPosition) ?? Infinity, widgetHeight);
		const maxHeight = Math.min(Math.max(maxHeightAbove, maxHeightBelow), widgetHeight);
		const height = Math.min(widgetHeight, maxHeight);
		let renderingAbove: ContentWidgetPositionPreference;
		if (this._editor.getOption(EditorOption.hover).above) {
			renderingAbove = height <= maxHeightAbove ? ContentWidgetPositionPreference.ABOVE : ContentWidgetPositionPreference.BELOW;
		} else {
			renderingAbove = height <= maxHeightBelow ? ContentWidgetPositionPreference.BELOW : ContentWidgetPositionPreference.ABOVE;
		}
		if (renderingAbove === ContentWidgetPositionPreference.ABOVE) {
			this._resizableNode.enableSashes(true, true, false, false);
		} else {
			this._resizableNode.enableSashes(false, true, true, false);
		}
		return renderingAbove;
	}

	protected _resize(dimension: dom.Dimension): void {
		this._resizableNode.layout(dimension.height, dimension.width);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/test/browser/contentHover.test.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/test/browser/contentHover.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { RenderedContentHover } from '../../browser/contentHoverRendered.js';
import { IHoverPart } from '../../browser/hoverTypes.js';
import { TestCodeEditorInstantiationOptions, withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';

suite('Content Hover', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #151235: Gitlens hover shows up in the wrong place', () => {
		const text = 'just some text';
		withTestCodeEditor(text, {}, (editor) => {
			const actual = RenderedContentHover.computeHoverPositions(
				editor,
				new Range(5, 5, 5, 5),
				[<IHoverPart>{ range: new Range(4, 1, 5, 6) }]
			);
			assert.deepStrictEqual(
				actual,
				{
					showAtPosition: new Position(5, 5),
					showAtSecondaryPosition: new Position(5, 5)
				}
			);
		});
	});

	test('issue #95328: Hover placement with word-wrap', () => {
		const text = 'just some text';
		const opts: TestCodeEditorInstantiationOptions = { wordWrap: 'wordWrapColumn', wordWrapColumn: 6 };
		withTestCodeEditor(text, opts, (editor) => {
			const actual = RenderedContentHover.computeHoverPositions(
				editor,
				new Range(1, 8, 1, 8),
				[<IHoverPart>{ range: new Range(1, 1, 1, 15) }]
			);
			assert.deepStrictEqual(
				actual,
				{
					showAtPosition: new Position(1, 8),
					showAtSecondaryPosition: new Position(1, 6)
				}
			);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/test/browser/hoverCopyButton.test.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/test/browser/hoverCopyButton.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable no-restricted-syntax */

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { HoverCopyButton } from '../../browser/hoverCopyButton.js';
import { TestClipboardService } from '../../../../../platform/clipboard/test/common/testClipboardService.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { NullHoverService } from '../../../../../platform/hover/test/browser/nullHoverService.js';
import { mainWindow } from '../../../../../base/browser/window.js';

suite('Hover Copy Button', () => {
	const disposables = new DisposableStore();
	let clipboardService: TestClipboardService;
	let hoverService: IHoverService;
	let container: HTMLElement;

	setup(() => {
		clipboardService = new TestClipboardService();
		hoverService = NullHoverService;
		container = mainWindow.document.createElement('div');
		mainWindow.document.body.appendChild(container);
	});

	teardown(() => {
		disposables.clear();
		if (container.parentElement) {
			container.parentElement.removeChild(container);
		}
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('should create button element in container', () => {
		disposables.add(new HoverCopyButton(
			container,
			() => 'test content',
			clipboardService,
			hoverService
		));

		const buttonElement = container.querySelector('.hover-copy-button');
		assert.ok(buttonElement, 'Button element should be created');
		assert.strictEqual(buttonElement?.getAttribute('role'), 'button');
		assert.strictEqual(buttonElement?.getAttribute('tabindex'), '0');
		assert.strictEqual(buttonElement?.getAttribute('aria-label'), 'Copy');
	});

	test('should add hover-row-with-copy class to container', () => {
		assert.ok(!container.classList.contains('hover-row-with-copy'), 'Container should not have class before button creation');

		disposables.add(new HoverCopyButton(
			container,
			() => 'test content',
			clipboardService,
			hoverService
		));

		assert.ok(container.classList.contains('hover-row-with-copy'), 'Container should have hover-row-with-copy class after button creation');
	});

	test('should have copy icon', () => {
		disposables.add(new HoverCopyButton(
			container,
			() => 'test content',
			clipboardService,
			hoverService
		));

		const icon = container.querySelector('.codicon-copy');
		assert.ok(icon, 'Copy icon should be present');
	});

	test('should copy content on click', async () => {
		const testContent = 'test content to copy';
		disposables.add(new HoverCopyButton(
			container,
			() => testContent,
			clipboardService,
			hoverService
		));

		const buttonElement = container.querySelector('.hover-copy-button') as HTMLElement;
		assert.ok(buttonElement);

		buttonElement.click();

		const copiedText = await clipboardService.readText();
		assert.strictEqual(copiedText, testContent, 'Content should be copied to clipboard');
	});

	test('should copy content on Enter key', async () => {
		const testContent = 'test content for enter key';
		disposables.add(new HoverCopyButton(
			container,
			() => testContent,
			clipboardService,
			hoverService
		));

		const buttonElement = container.querySelector('.hover-copy-button') as HTMLElement;
		assert.ok(buttonElement);

		// Simulate Enter key press - need to override keyCode for StandardKeyboardEvent
		const keyEvent = new KeyboardEvent('keydown', {
			key: 'Enter',
			code: 'Enter',
			bubbles: true
		});
		Object.defineProperty(keyEvent, 'keyCode', { get: () => 13 }); // Enter keyCode
		buttonElement.dispatchEvent(keyEvent);

		const copiedText = await clipboardService.readText();
		assert.strictEqual(copiedText, testContent, 'Content should be copied on Enter key');
	});

	test('should copy content on Space key', async () => {
		const testContent = 'test content for space key';
		disposables.add(new HoverCopyButton(
			container,
			() => testContent,
			clipboardService,
			hoverService
		));

		const buttonElement = container.querySelector('.hover-copy-button') as HTMLElement;
		assert.ok(buttonElement);

		// Simulate Space key press - need to override keyCode for StandardKeyboardEvent
		const keyEvent = new KeyboardEvent('keydown', {
			key: ' ',
			code: 'Space',
			bubbles: true
		});
		Object.defineProperty(keyEvent, 'keyCode', { get: () => 32 }); // Space keyCode
		buttonElement.dispatchEvent(keyEvent);

		const copiedText = await clipboardService.readText();
		assert.strictEqual(copiedText, testContent, 'Content should be copied on Space key');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/hover/test/browser/hoverUtils.test.ts]---
Location: vscode-main/src/vs/editor/contrib/hover/test/browser/hoverUtils.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { shouldShowHover } from '../../browser/hoverUtils.js';
import { IEditorMouseEvent } from '../../../../browser/editorBrowser.js';

suite('Hover Utils', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	suite('shouldShowHover', () => {

		function createMockMouseEvent(ctrlKey: boolean, altKey: boolean, metaKey: boolean): IEditorMouseEvent {
			return {
				event: {
					ctrlKey,
					altKey,
					metaKey,
					shiftKey: false,
				}
			} as IEditorMouseEvent;
		}

		test('returns true when enabled is "on"', () => {
			const mouseEvent = createMockMouseEvent(false, false, false);
			const result = shouldShowHover('on', 'altKey', mouseEvent);
			assert.strictEqual(result, true);
		});

		test('returns false when enabled is "off"', () => {
			const mouseEvent = createMockMouseEvent(false, false, false);
			const result = shouldShowHover('off', 'altKey', mouseEvent);
			assert.strictEqual(result, false);
		});

		test('returns true with ctrl pressed when multiCursorModifier is altKey', () => {
			const mouseEvent = createMockMouseEvent(true, false, false);
			const result = shouldShowHover('onKeyboardModifier', 'altKey', mouseEvent);
			assert.strictEqual(result, true);
		});

		test('returns false without ctrl pressed when multiCursorModifier is altKey', () => {
			const mouseEvent = createMockMouseEvent(false, false, false);
			const result = shouldShowHover('onKeyboardModifier', 'altKey', mouseEvent);
			assert.strictEqual(result, false);
		});

		test('returns true with metaKey pressed when multiCursorModifier is altKey', () => {
			const mouseEvent = createMockMouseEvent(false, false, true);
			const result = shouldShowHover('onKeyboardModifier', 'altKey', mouseEvent);
			assert.strictEqual(result, true);
		});

		test('returns true with alt pressed when multiCursorModifier is ctrlKey', () => {
			const mouseEvent = createMockMouseEvent(false, true, false);
			const result = shouldShowHover('onKeyboardModifier', 'ctrlKey', mouseEvent);
			assert.strictEqual(result, true);
		});

		test('returns false without alt pressed when multiCursorModifier is ctrlKey', () => {
			const mouseEvent = createMockMouseEvent(false, false, false);
			const result = shouldShowHover('onKeyboardModifier', 'ctrlKey', mouseEvent);
			assert.strictEqual(result, false);
		});

		test('returns true with alt pressed when multiCursorModifier is metaKey', () => {
			const mouseEvent = createMockMouseEvent(false, true, false);
			const result = shouldShowHover('onKeyboardModifier', 'metaKey', mouseEvent);
			assert.strictEqual(result, true);
		});

		test('ignores alt when multiCursorModifier is altKey', () => {
			const mouseEvent = createMockMouseEvent(false, true, false);
			const result = shouldShowHover('onKeyboardModifier', 'altKey', mouseEvent);
			assert.strictEqual(result, false);
		});

		test('ignores ctrl when multiCursorModifier is ctrlKey', () => {
			const mouseEvent = createMockMouseEvent(true, false, false);
			const result = shouldShowHover('onKeyboardModifier', 'ctrlKey', mouseEvent);
			assert.strictEqual(result, false);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/indentation/browser/indentation.ts]---
Location: vscode-main/src/vs/editor/contrib/indentation/browser/indentation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../../base/common/lifecycle.js';
import * as strings from '../../../../base/common/strings.js';
import * as nls from '../../../../nls.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, IActionOptions, registerEditorAction, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { ShiftCommand } from '../../../common/commands/shiftCommand.js';
import { EditorAutoIndentStrategy, EditorOption } from '../../../common/config/editorOptions.js';
import { ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Position } from '../../../common/core/position.js';
import { IRange, Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder, IEditorContribution } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { StandardTokenType } from '../../../common/encodedTokenAttributes.js';
import { TextEdit } from '../../../common/languages.js';
import { getGoodIndentForLine, getIndentMetadata } from '../../../common/languages/autoIndent.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { IndentConsts } from '../../../common/languages/supports/indentRules.js';
import { EndOfLineSequence, ITextModel } from '../../../common/model.js';
import { IModelService } from '../../../common/services/model.js';
import { getStandardTokenTypeAtPosition } from '../../../common/tokens/lineTokens.js';
import { getReindentEditOperations } from '../common/indentation.js';
import * as indentUtils from '../common/indentUtils.js';

export class IndentationToSpacesAction extends EditorAction {
	public static readonly ID = 'editor.action.indentationToSpaces';

	constructor() {
		super({
			id: IndentationToSpacesAction.ID,
			label: nls.localize2('indentationToSpaces', "Convert Indentation to Spaces"),
			precondition: EditorContextKeys.writable,
			metadata: {
				description: nls.localize2('indentationToSpacesDescription', "Convert the tab indentation to spaces."),
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const model = editor.getModel();
		if (!model) {
			return;
		}
		const modelOpts = model.getOptions();
		const selection = editor.getSelection();
		if (!selection) {
			return;
		}
		const command = new IndentationToSpacesCommand(selection, modelOpts.tabSize);

		editor.pushUndoStop();
		editor.executeCommands(this.id, [command]);
		editor.pushUndoStop();

		model.updateOptions({
			insertSpaces: true
		});
	}
}

export class IndentationToTabsAction extends EditorAction {
	public static readonly ID = 'editor.action.indentationToTabs';

	constructor() {
		super({
			id: IndentationToTabsAction.ID,
			label: nls.localize2('indentationToTabs', "Convert Indentation to Tabs"),
			precondition: EditorContextKeys.writable,
			metadata: {
				description: nls.localize2('indentationToTabsDescription', "Convert the spaces indentation to tabs."),
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const model = editor.getModel();
		if (!model) {
			return;
		}
		const modelOpts = model.getOptions();
		const selection = editor.getSelection();
		if (!selection) {
			return;
		}
		const command = new IndentationToTabsCommand(selection, modelOpts.tabSize);

		editor.pushUndoStop();
		editor.executeCommands(this.id, [command]);
		editor.pushUndoStop();

		model.updateOptions({
			insertSpaces: false
		});
	}
}

export class ChangeIndentationSizeAction extends EditorAction {

	constructor(private readonly insertSpaces: boolean, private readonly displaySizeOnly: boolean, opts: IActionOptions) {
		super(opts);
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const quickInputService = accessor.get(IQuickInputService);
		const modelService = accessor.get(IModelService);

		const model = editor.getModel();
		if (!model) {
			return;
		}

		const creationOpts = modelService.getCreationOptions(model.getLanguageId(), model.uri, model.isForSimpleWidget);
		const modelOpts = model.getOptions();
		const picks = [1, 2, 3, 4, 5, 6, 7, 8].map(n => ({
			id: n.toString(),
			label: n.toString(),
			// add description for tabSize value set in the configuration
			description: (
				n === creationOpts.tabSize && n === modelOpts.tabSize
					? nls.localize('configuredTabSize', "Configured Tab Size")
					: n === creationOpts.tabSize
						? nls.localize('defaultTabSize', "Default Tab Size")
						: n === modelOpts.tabSize
							? nls.localize('currentTabSize', "Current Tab Size")
							: undefined
			)
		}));

		// auto focus the tabSize set for the current editor
		const autoFocusIndex = Math.min(model.getOptions().tabSize - 1, 7);

		setTimeout(() => {
			quickInputService.pick(picks, { placeHolder: nls.localize({ key: 'selectTabWidth', comment: ['Tab corresponds to the tab key'] }, "Select Tab Size for Current File"), activeItem: picks[autoFocusIndex] }).then(pick => {
				if (pick) {
					if (model && !model.isDisposed()) {
						const pickedVal = parseInt(pick.label, 10);
						if (this.displaySizeOnly) {
							model.updateOptions({
								tabSize: pickedVal
							});
						} else {
							model.updateOptions({
								tabSize: pickedVal,
								indentSize: pickedVal,
								insertSpaces: this.insertSpaces
							});
						}
					}
				}
			});
		}, 50/* quick input is sensitive to being opened so soon after another */);
	}
}

export class IndentUsingTabs extends ChangeIndentationSizeAction {

	public static readonly ID = 'editor.action.indentUsingTabs';

	constructor() {
		super(false, false, {
			id: IndentUsingTabs.ID,
			label: nls.localize2('indentUsingTabs', "Indent Using Tabs"),
			precondition: undefined,
			metadata: {
				description: nls.localize2('indentUsingTabsDescription', "Use indentation with tabs."),
			}
		});
	}
}

export class IndentUsingSpaces extends ChangeIndentationSizeAction {

	public static readonly ID = 'editor.action.indentUsingSpaces';

	constructor() {
		super(true, false, {
			id: IndentUsingSpaces.ID,
			label: nls.localize2('indentUsingSpaces', "Indent Using Spaces"),
			precondition: undefined,
			metadata: {
				description: nls.localize2('indentUsingSpacesDescription', "Use indentation with spaces."),
			}
		});
	}
}

export class ChangeTabDisplaySize extends ChangeIndentationSizeAction {

	public static readonly ID = 'editor.action.changeTabDisplaySize';

	constructor() {
		super(true, true, {
			id: ChangeTabDisplaySize.ID,
			label: nls.localize2('changeTabDisplaySize', "Change Tab Display Size"),
			precondition: undefined,
			metadata: {
				description: nls.localize2('changeTabDisplaySizeDescription', "Change the space size equivalent of the tab."),
			}
		});
	}
}

export class DetectIndentation extends EditorAction {

	public static readonly ID = 'editor.action.detectIndentation';

	constructor() {
		super({
			id: DetectIndentation.ID,
			label: nls.localize2('detectIndentation', "Detect Indentation from Content"),
			precondition: undefined,
			metadata: {
				description: nls.localize2('detectIndentationDescription', "Detect the indentation from content."),
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const modelService = accessor.get(IModelService);

		const model = editor.getModel();
		if (!model) {
			return;
		}

		const creationOpts = modelService.getCreationOptions(model.getLanguageId(), model.uri, model.isForSimpleWidget);
		model.detectIndentation(creationOpts.insertSpaces, creationOpts.tabSize);
	}
}

export class ReindentLinesAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.reindentlines',
			label: nls.localize2('editor.reindentlines', "Reindent Lines"),
			precondition: EditorContextKeys.writable,
			metadata: {
				description: nls.localize2('editor.reindentlinesDescription', "Reindent the lines of the editor."),
			},
			canTriggerInlineEdits: true,
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const languageConfigurationService = accessor.get(ILanguageConfigurationService);

		const model = editor.getModel();
		if (!model) {
			return;
		}
		const edits = getReindentEditOperations(model, languageConfigurationService, 1, model.getLineCount());
		if (edits.length > 0) {
			editor.pushUndoStop();
			editor.executeEdits(this.id, edits);
			editor.pushUndoStop();
		}
	}
}

export class ReindentSelectedLinesAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.reindentselectedlines',
			label: nls.localize2('editor.reindentselectedlines', "Reindent Selected Lines"),
			precondition: EditorContextKeys.writable,
			metadata: {
				description: nls.localize2('editor.reindentselectedlinesDescription', "Reindent the selected lines of the editor."),
			},
			canTriggerInlineEdits: true,
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const languageConfigurationService = accessor.get(ILanguageConfigurationService);

		const model = editor.getModel();
		if (!model) {
			return;
		}

		const selections = editor.getSelections();
		if (selections === null) {
			return;
		}

		const edits: ISingleEditOperation[] = [];

		for (const selection of selections) {
			let startLineNumber = selection.startLineNumber;
			let endLineNumber = selection.endLineNumber;

			if (startLineNumber !== endLineNumber && selection.endColumn === 1) {
				endLineNumber--;
			}

			if (startLineNumber === 1) {
				if (startLineNumber === endLineNumber) {
					continue;
				}
			} else {
				startLineNumber--;
			}

			const editOperations = getReindentEditOperations(model, languageConfigurationService, startLineNumber, endLineNumber);
			edits.push(...editOperations);
		}

		if (edits.length > 0) {
			editor.pushUndoStop();
			editor.executeEdits(this.id, edits);
			editor.pushUndoStop();
		}
	}
}

export class AutoIndentOnPasteCommand implements ICommand {

	private readonly _edits: { range: IRange; text: string; eol?: EndOfLineSequence }[];

	private readonly _initialSelection: Selection;
	private _selectionId: string | null;

	constructor(edits: TextEdit[], initialSelection: Selection) {
		this._initialSelection = initialSelection;
		this._edits = [];
		this._selectionId = null;

		for (const edit of edits) {
			if (edit.range && typeof edit.text === 'string') {
				this._edits.push(edit as { range: IRange; text: string; eol?: EndOfLineSequence });
			}
		}
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		for (const edit of this._edits) {
			builder.addEditOperation(Range.lift(edit.range), edit.text);
		}

		let selectionIsSet = false;
		if (Array.isArray(this._edits) && this._edits.length === 1 && this._initialSelection.isEmpty()) {
			if (this._edits[0].range.startColumn === this._initialSelection.endColumn &&
				this._edits[0].range.startLineNumber === this._initialSelection.endLineNumber) {
				selectionIsSet = true;
				this._selectionId = builder.trackSelection(this._initialSelection, true);
			} else if (this._edits[0].range.endColumn === this._initialSelection.startColumn &&
				this._edits[0].range.endLineNumber === this._initialSelection.startLineNumber) {
				selectionIsSet = true;
				this._selectionId = builder.trackSelection(this._initialSelection, false);
			}
		}

		if (!selectionIsSet) {
			this._selectionId = builder.trackSelection(this._initialSelection);
		}
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		return helper.getTrackedSelection(this._selectionId!);
	}
}

export class AutoIndentOnPaste implements IEditorContribution {
	public static readonly ID = 'editor.contrib.autoIndentOnPaste';

	private readonly callOnDispose = new DisposableStore();
	private readonly callOnModel = new DisposableStore();

	constructor(
		private readonly editor: ICodeEditor,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService
	) {

		this.callOnDispose.add(editor.onDidChangeConfiguration(() => this.update()));
		this.callOnDispose.add(editor.onDidChangeModel(() => this.update()));
		this.callOnDispose.add(editor.onDidChangeModelLanguage(() => this.update()));
	}

	private update(): void {

		// clean up
		this.callOnModel.clear();

		// we are disabled
		if (!this.editor.getOption(EditorOption.autoIndentOnPaste) || this.editor.getOption(EditorOption.autoIndent) < EditorAutoIndentStrategy.Full) {
			return;
		}

		// no model
		if (!this.editor.hasModel()) {
			return;
		}

		this.callOnModel.add(this.editor.onDidPaste(({ range }) => {
			this.trigger(range);
		}));
	}

	public trigger(range: Range): void {
		const selections = this.editor.getSelections();
		if (selections === null || selections.length > 1) {
			return;
		}

		const model = this.editor.getModel();
		if (!model) {
			return;
		}
		const containsOnlyWhitespace = this.rangeContainsOnlyWhitespaceCharacters(model, range);
		if (containsOnlyWhitespace) {
			return;
		}
		if (!this.editor.getOption(EditorOption.autoIndentOnPasteWithinString) && isStartOrEndInString(model, range)) {
			return;
		}
		if (!model.tokenization.isCheapToTokenize(range.getStartPosition().lineNumber)) {
			return;
		}
		const autoIndent = this.editor.getOption(EditorOption.autoIndent);
		const { tabSize, indentSize, insertSpaces } = model.getOptions();
		const textEdits: TextEdit[] = [];

		const indentConverter = {
			shiftIndent: (indentation: string) => {
				return ShiftCommand.shiftIndent(indentation, indentation.length + 1, tabSize, indentSize, insertSpaces);
			},
			unshiftIndent: (indentation: string) => {
				return ShiftCommand.unshiftIndent(indentation, indentation.length + 1, tabSize, indentSize, insertSpaces);
			}
		};

		let startLineNumber = range.startLineNumber;

		let firstLineText = model.getLineContent(startLineNumber);
		if (!/\S/.test(firstLineText.substring(0, range.startColumn - 1))) {
			const indentOfFirstLine = getGoodIndentForLine(autoIndent, model, model.getLanguageId(), startLineNumber, indentConverter, this._languageConfigurationService);

			if (indentOfFirstLine !== null) {
				const oldIndentation = strings.getLeadingWhitespace(firstLineText);
				const newSpaceCnt = indentUtils.getSpaceCnt(indentOfFirstLine, tabSize);
				const oldSpaceCnt = indentUtils.getSpaceCnt(oldIndentation, tabSize);

				if (newSpaceCnt !== oldSpaceCnt) {
					const newIndent = indentUtils.generateIndent(newSpaceCnt, tabSize, insertSpaces);
					textEdits.push({
						range: new Range(startLineNumber, 1, startLineNumber, oldIndentation.length + 1),
						text: newIndent
					});
					firstLineText = newIndent + firstLineText.substring(oldIndentation.length);
				} else {
					const indentMetadata = getIndentMetadata(model, startLineNumber, this._languageConfigurationService);

					if (indentMetadata === 0 || indentMetadata === IndentConsts.UNINDENT_MASK) {
						// we paste content into a line where only contains whitespaces
						// after pasting, the indentation of the first line is already correct
						// the first line doesn't match any indentation rule
						// then no-op.
						return;
					}
				}
			}
		}

		const firstLineNumber = startLineNumber;

		// ignore empty or ignored lines
		while (startLineNumber < range.endLineNumber) {
			if (!/\S/.test(model.getLineContent(startLineNumber + 1))) {
				startLineNumber++;
				continue;
			}
			break;
		}

		if (startLineNumber !== range.endLineNumber) {
			const virtualModel = {
				tokenization: {
					getLineTokens: (lineNumber: number) => {
						return model.tokenization.getLineTokens(lineNumber);
					},
					getLanguageId: () => {
						return model.getLanguageId();
					},
					getLanguageIdAtPosition: (lineNumber: number, column: number) => {
						return model.getLanguageIdAtPosition(lineNumber, column);
					},
				},
				getLineContent: (lineNumber: number) => {
					if (lineNumber === firstLineNumber) {
						return firstLineText;
					} else {
						return model.getLineContent(lineNumber);
					}
				}
			};
			const indentOfSecondLine = getGoodIndentForLine(autoIndent, virtualModel, model.getLanguageId(), startLineNumber + 1, indentConverter, this._languageConfigurationService);
			if (indentOfSecondLine !== null) {
				const newSpaceCntOfSecondLine = indentUtils.getSpaceCnt(indentOfSecondLine, tabSize);
				const oldSpaceCntOfSecondLine = indentUtils.getSpaceCnt(strings.getLeadingWhitespace(model.getLineContent(startLineNumber + 1)), tabSize);

				if (newSpaceCntOfSecondLine !== oldSpaceCntOfSecondLine) {
					const spaceCntOffset = newSpaceCntOfSecondLine - oldSpaceCntOfSecondLine;
					for (let i = startLineNumber + 1; i <= range.endLineNumber; i++) {
						const lineContent = model.getLineContent(i);
						const originalIndent = strings.getLeadingWhitespace(lineContent);
						const originalSpacesCnt = indentUtils.getSpaceCnt(originalIndent, tabSize);
						const newSpacesCnt = originalSpacesCnt + spaceCntOffset;
						const newIndent = indentUtils.generateIndent(newSpacesCnt, tabSize, insertSpaces);

						if (newIndent !== originalIndent) {
							textEdits.push({
								range: new Range(i, 1, i, originalIndent.length + 1),
								text: newIndent
							});
						}
					}
				}
			}
		}

		if (textEdits.length > 0) {
			this.editor.pushUndoStop();
			const cmd = new AutoIndentOnPasteCommand(textEdits, this.editor.getSelection()!);
			this.editor.executeCommand('autoIndentOnPaste', cmd);
			this.editor.pushUndoStop();
		}
	}

	private rangeContainsOnlyWhitespaceCharacters(model: ITextModel, range: Range): boolean {
		const lineContainsOnlyWhitespace = (content: string): boolean => {
			return content.trim().length === 0;
		};
		let containsOnlyWhitespace: boolean = true;
		if (range.startLineNumber === range.endLineNumber) {
			const lineContent = model.getLineContent(range.startLineNumber);
			const linePart = lineContent.substring(range.startColumn - 1, range.endColumn - 1);
			containsOnlyWhitespace = lineContainsOnlyWhitespace(linePart);
		} else {
			for (let i = range.startLineNumber; i <= range.endLineNumber; i++) {
				const lineContent = model.getLineContent(i);
				if (i === range.startLineNumber) {
					const linePart = lineContent.substring(range.startColumn - 1);
					containsOnlyWhitespace = lineContainsOnlyWhitespace(linePart);
				} else if (i === range.endLineNumber) {
					const linePart = lineContent.substring(0, range.endColumn - 1);
					containsOnlyWhitespace = lineContainsOnlyWhitespace(linePart);
				} else {
					containsOnlyWhitespace = model.getLineFirstNonWhitespaceColumn(i) === 0;
				}
				if (!containsOnlyWhitespace) {
					break;
				}
			}
		}
		return containsOnlyWhitespace;
	}

	public dispose(): void {
		this.callOnDispose.dispose();
		this.callOnModel.dispose();
	}
}

function isStartOrEndInString(model: ITextModel, range: Range): boolean {
	const isPositionInString = (position: Position): boolean => {
		const tokenType = getStandardTokenTypeAtPosition(model, position);
		return tokenType === StandardTokenType.String;
	};
	return isPositionInString(range.getStartPosition()) || isPositionInString(range.getEndPosition());
}

function getIndentationEditOperations(model: ITextModel, builder: IEditOperationBuilder, tabSize: number, tabsToSpaces: boolean): void {
	if (model.getLineCount() === 1 && model.getLineMaxColumn(1) === 1) {
		// Model is empty
		return;
	}

	let spaces = '';
	for (let i = 0; i < tabSize; i++) {
		spaces += ' ';
	}

	const spacesRegExp = new RegExp(spaces, 'gi');

	for (let lineNumber = 1, lineCount = model.getLineCount(); lineNumber <= lineCount; lineNumber++) {
		let lastIndentationColumn = model.getLineFirstNonWhitespaceColumn(lineNumber);
		if (lastIndentationColumn === 0) {
			lastIndentationColumn = model.getLineMaxColumn(lineNumber);
		}

		if (lastIndentationColumn === 1) {
			continue;
		}

		const originalIndentationRange = new Range(lineNumber, 1, lineNumber, lastIndentationColumn);
		const originalIndentation = model.getValueInRange(originalIndentationRange);
		const newIndentation = (
			tabsToSpaces
				? originalIndentation.replace(/\t/ig, spaces)
				: originalIndentation.replace(spacesRegExp, '\t')
		);

		builder.addEditOperation(originalIndentationRange, newIndentation);
	}
}

export class IndentationToSpacesCommand implements ICommand {

	private selectionId: string | null = null;

	constructor(private readonly selection: Selection, private tabSize: number) { }

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		this.selectionId = builder.trackSelection(this.selection);
		getIndentationEditOperations(model, builder, this.tabSize, true);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		return helper.getTrackedSelection(this.selectionId!);
	}
}

export class IndentationToTabsCommand implements ICommand {

	private selectionId: string | null = null;

	constructor(private readonly selection: Selection, private tabSize: number) { }

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		this.selectionId = builder.trackSelection(this.selection);
		getIndentationEditOperations(model, builder, this.tabSize, false);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		return helper.getTrackedSelection(this.selectionId!);
	}
}

registerEditorContribution(AutoIndentOnPaste.ID, AutoIndentOnPaste, EditorContributionInstantiation.BeforeFirstInteraction);
registerEditorAction(IndentationToSpacesAction);
registerEditorAction(IndentationToTabsAction);
registerEditorAction(IndentUsingTabs);
registerEditorAction(IndentUsingSpaces);
registerEditorAction(ChangeTabDisplaySize);
registerEditorAction(DetectIndentation);
registerEditorAction(ReindentLinesAction);
registerEditorAction(ReindentSelectedLinesAction);
```

--------------------------------------------------------------------------------

````

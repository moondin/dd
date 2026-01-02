---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 232
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 232 of 552)

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

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/longDistanceHint/inlineEditsLongDistanceHint.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/longDistanceHint/inlineEditsLongDistanceHint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ChildNode, n, ObserverNode, ObserverNodeWithElement } from '../../../../../../../../base/browser/dom.js';
import { Event } from '../../../../../../../../base/common/event.js';
import { Disposable } from '../../../../../../../../base/common/lifecycle.js';
import { IObservable, IReader, autorun, constObservable, debouncedObservable2, derived, derivedDisposable, observableFromEvent } from '../../../../../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../../../../../platform/instantiation/common/instantiation.js';
import { ICodeEditor } from '../../../../../../../browser/editorBrowser.js';
import { observableCodeEditor } from '../../../../../../../browser/observableCodeEditor.js';
import { Rect } from '../../../../../../../common/core/2d/rect.js';
import { Position } from '../../../../../../../common/core/position.js';
import { ITextModel } from '../../../../../../../common/model.js';
import { IInlineEditsView, InlineEditTabAction } from '../../inlineEditsViewInterface.js';
import { InlineEditWithChanges } from '../../inlineEditWithChanges.js';
import { getContentSizeOfLines, rectToProps } from '../../utils/utils.js';
import { DetailedLineRangeMapping } from '../../../../../../../common/diff/rangeMapping.js';
import { OffsetRange } from '../../../../../../../common/core/ranges/offsetRange.js';
import { LineRange } from '../../../../../../../common/core/ranges/lineRange.js';
import { HideUnchangedRegionsFeature } from '../../../../../../../browser/widget/diffEditor/features/hideUnchangedRegionsFeature.js';
import { Codicon } from '../../../../../../../../base/common/codicons.js';
import { renderIcon } from '../../../../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { SymbolKinds } from '../../../../../../../common/languages.js';
import { debugLogHorizontalOffsetRanges, debugLogRects, debugView } from '../debugVisualization.js';
import { distributeFlexBoxLayout } from '../../utils/flexBoxLayout.js';
import { Point } from '../../../../../../../common/core/2d/point.js';
import { Size2D } from '../../../../../../../common/core/2d/size.js';
import { IThemeService } from '../../../../../../../../platform/theme/common/themeService.js';
import { IKeybindingService } from '../../../../../../../../platform/keybinding/common/keybinding.js';
import { getEditorBlendedColor, inlineEditIndicatorPrimaryBackground, inlineEditIndicatorSecondaryBackground, inlineEditIndicatorSuccessfulBackground, observeColor } from '../../theme.js';
import { asCssVariable, descriptionForeground, editorBackground, editorWidgetBackground } from '../../../../../../../../platform/theme/common/colorRegistry.js';
import { editorWidgetBorder } from '../../../../../../../../platform/theme/common/colors/editorColors.js';
import { ILongDistancePreviewProps, LongDistancePreviewEditor } from './longDistancePreviewEditor.js';
import { InlineSuggestionGutterMenuData, SimpleInlineSuggestModel } from '../../components/gutterIndicatorView.js';
import { jumpToNextInlineEditId } from '../../../../controller/commandIds.js';
import { splitIntoContinuousLineRanges, WidgetLayoutConstants, WidgetOutline, WidgetPlacementContext } from './longDistnaceWidgetPlacement.js';

const BORDER_RADIUS = 6;
const MAX_WIDGET_WIDTH = { EMPTY_SPACE: 425, OVERLAY: 375 };
const MIN_WIDGET_WIDTH = 250;

const DEFAULT_WIDGET_LAYOUT_CONSTANTS: WidgetLayoutConstants = {
	previewEditorMargin: 2,
	widgetPadding: 2,
	widgetBorder: 1,
	lowerBarHeight: 20,
	minWidgetWidth: MIN_WIDGET_WIDTH,
};

export class InlineEditsLongDistanceHint extends Disposable implements IInlineEditsView {

	private readonly _editorObs;
	readonly onDidClick = Event.None;
	private _viewWithElement: ObserverNodeWithElement<HTMLDivElement> | undefined = undefined;

	private readonly _previewEditor;

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _viewState: IObservable<ILongDistanceViewState | undefined>,
		private readonly _previewTextModel: ITextModel,
		private readonly _tabAction: IObservable<InlineEditTabAction>,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IThemeService private readonly _themeService: IThemeService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
	) {
		super();

		this._styles = derived(reader => {
			const v = this._tabAction.read(reader);

			// Check theme type by observing a color - this ensures we react to theme changes
			const widgetBorderColor = observeColor(editorWidgetBorder, this._themeService).read(reader);
			const isHighContrast = observableFromEvent(this._themeService.onDidColorThemeChange, () => {
				const theme = this._themeService.getColorTheme();
				return theme.type === 'hcDark' || theme.type === 'hcLight';
			}).read(reader);

			let borderColor;
			if (isHighContrast) {
				// Use editorWidgetBorder in high contrast mode for better visibility
				borderColor = widgetBorderColor;
			} else {
				let border;
				switch (v) {
					case InlineEditTabAction.Inactive: border = inlineEditIndicatorSecondaryBackground; break;
					case InlineEditTabAction.Jump: border = inlineEditIndicatorPrimaryBackground; break;
					case InlineEditTabAction.Accept: border = inlineEditIndicatorSuccessfulBackground; break;
				}
				borderColor = getEditorBlendedColor(border, this._themeService).read(reader);
			}

			return {
				border: borderColor.toString(),
				background: asCssVariable(editorBackground)
			};
		});

		this._editorObs = observableCodeEditor(this._editor);

		this._previewEditor = this._register(
			this._instantiationService.createInstance(
				LongDistancePreviewEditor,
				this._previewTextModel,
				derived(reader => {
					const viewState = this._viewState.read(reader);
					if (!viewState) {
						return undefined;
					}
					return {
						diff: viewState.diff,
						model: viewState.model,
						inlineSuggestInfo: viewState.inlineSuggestInfo,
						nextCursorPosition: viewState.nextCursorPosition,
					} satisfies ILongDistancePreviewProps;
				}),
				this._editor,
				this._tabAction,
			)
		);

		this._viewWithElement = this._view.keepUpdated(this._store);
		this._register(this._editorObs.createOverlayWidget({
			domNode: this._viewWithElement.element,
			position: constObservable(null),
			allowEditorOverflow: false,
			minContentWidthInPx: constObservable(0),
		}));

		this._widgetContent.get().keepUpdated(this._store);

		this._register(autorun(reader => {
			const layoutInfo = this._previewEditorLayoutInfo.read(reader);
			if (!layoutInfo) {
				return;
			}
			this._previewEditor.layout(layoutInfo.codeEditorSize.toDimension(), layoutInfo.desiredPreviewEditorScrollLeft);
		}));

		this._isVisibleDelayed.recomputeInitiallyAndOnChange(this._store);
	}

	private readonly _styles;

	public get isHovered() { return this._widgetContent.get().didMouseMoveDuringHover; }

	private readonly _hintTextPosition = derived(this, (reader) => {
		const viewState = this._viewState.read(reader);
		return viewState ? new Position(viewState.hint.lineNumber, Number.MAX_SAFE_INTEGER) : null;
	});

	private readonly _lineSizesAroundHintPosition = derived(this, (reader) => {
		const viewState = this._viewState.read(reader);
		const p = this._hintTextPosition.read(reader);
		if (!viewState || !p) {
			return [];
		}

		const model = this._editorObs.model.read(reader);
		if (!model) {
			return [];
		}
		const range = LineRange.ofLength(p.lineNumber, 1).addMargin(5, 5).intersect(LineRange.ofLength(1, model.getLineCount()));

		if (!range) {
			return [];
		}

		const sizes = getContentSizeOfLines(this._editorObs, range, reader);
		const top = this._editorObs.observeTopForLineNumber(range.startLineNumber).read(reader);

		return splitIntoContinuousLineRanges(range, sizes, top, this._editorObs, reader);
	});

	private readonly _isVisibleDelayed = debouncedObservable2(
		derived(this, reader => this._viewState.read(reader)?.hint.isVisible),
		(lastValue, newValue) => lastValue === true && newValue === false ? 200 : 0,
	);

	private readonly _previewEditorLayoutInfo = derived(this, (reader) => {
		const viewState = this._viewState.read(reader);

		if (!viewState || !this._isVisibleDelayed.read(reader)) {
			return undefined;
		}

		const continousLineRanges = this._lineSizesAroundHintPosition.read(reader);
		if (continousLineRanges.length === 0) {
			return undefined;
		}

		const editorScrollTop = this._editorObs.scrollTop.read(reader);
		const editorScrollLeft = this._editorObs.scrollLeft.read(reader);
		const editorLayout = this._editorObs.layoutInfo.read(reader);

		const previewContentHeight = this._previewEditor.contentHeight.read(reader);
		const previewEditorContentLayout = this._previewEditor.horizontalContentRangeInPreviewEditorToShow.read(reader);

		if (!previewContentHeight || !previewEditorContentLayout) {
			return undefined;
		}

		// const debugRects = stackSizesDown(new Point(editorLayout.contentLeft, lineSizes.top - scrollTop), lineSizes.sizes);

		const editorTrueContentWidth = editorLayout.contentWidth - editorLayout.verticalScrollbarWidth;
		const editorTrueContentRight = editorLayout.contentLeft + editorTrueContentWidth;

		// drawEditorWidths(this._editor, reader);

		const c = this._editorObs.cursorLineNumber.read(reader);
		if (!c) {
			return undefined;
		}

		const layoutConstants = DEFAULT_WIDGET_LAYOUT_CONSTANTS;
		const extraGutterMarginToAvoidScrollBar = 2;
		const previewEditorHeight = previewContentHeight + extraGutterMarginToAvoidScrollBar;

		// Try to find widget placement in available empty space
		let possibleWidgetOutline: WidgetOutline | undefined;
		let lastPlacementContext: WidgetPlacementContext | undefined;

		const endOfLinePadding = (lineNumber: number) => lineNumber === viewState.hint.lineNumber ? 40 : 20;

		for (const continousLineRange of continousLineRanges) {
			const placementContext = new WidgetPlacementContext(
				continousLineRange,
				editorTrueContentWidth,
				endOfLinePadding
			);
			lastPlacementContext = placementContext;

			const showRects = false;
			if (showRects) {
				const rects2 = stackSizesDown(
					new Point(editorTrueContentRight, continousLineRange.top - editorScrollTop),
					placementContext.availableSpaceSizes as Size2D[],
					'right'
				);
				debugView(debugLogRects({ ...rects2 }, this._editor.getDomNode()!), reader);
			}

			possibleWidgetOutline = placementContext.tryFindWidgetOutline(
				viewState.hint.lineNumber,
				previewEditorHeight,
				editorTrueContentRight,
				layoutConstants
			);

			if (possibleWidgetOutline) {
				break;
			}
		}

		// Fallback to overlay position if no empty space was found
		let position: 'overlay' | 'empty-space' = 'empty-space';
		if (!possibleWidgetOutline) {
			position = 'overlay';
			const maxAvailableWidth = Math.min(editorLayout.width - editorLayout.contentLeft, MAX_WIDGET_WIDTH.OVERLAY);

			// Create a fallback placement context for computing overlay vertical position
			const fallbackPlacementContext = lastPlacementContext ?? new WidgetPlacementContext(
				continousLineRanges[0],
				editorTrueContentWidth,
				endOfLinePadding,
			);

			possibleWidgetOutline = {
				horizontalWidgetRange: OffsetRange.ofStartAndLength(editorTrueContentRight - maxAvailableWidth, maxAvailableWidth),
				verticalWidgetRange: fallbackPlacementContext.getWidgetVerticalOutline(
					viewState.hint.lineNumber + 2,
					previewEditorHeight,
					layoutConstants
				).delta(10),
			};
		}

		if (!possibleWidgetOutline) {
			return undefined;
		}

		const rectAvailableSpace = Rect.fromRanges(
			possibleWidgetOutline.horizontalWidgetRange,
			possibleWidgetOutline.verticalWidgetRange
		).translateX(-editorScrollLeft).translateY(-editorScrollTop);

		const showAvailableSpace = false;
		if (showAvailableSpace) {
			debugView(debugLogRects({ rectAvailableSpace }, this._editor.getDomNode()!), reader);
		}

		const { previewEditorMargin, widgetPadding, widgetBorder, lowerBarHeight } = layoutConstants;
		const maxWidgetWidth = Math.min(position === 'overlay' ? MAX_WIDGET_WIDTH.OVERLAY : MAX_WIDGET_WIDTH.EMPTY_SPACE, previewEditorContentLayout.maxEditorWidth + previewEditorMargin + widgetPadding);

		const layout = distributeFlexBoxLayout(rectAvailableSpace.width, {
			spaceBefore: { min: 0, max: 10, priority: 1 },
			content: { min: 50, rules: [{ max: 150, priority: 2 }, { max: maxWidgetWidth, priority: 1 }] },
			spaceAfter: { min: 10 },
		});

		if (!layout) {
			return null;
		}

		const ranges = lengthsToOffsetRanges([layout.spaceBefore, layout.content, layout.spaceAfter], rectAvailableSpace.left);
		const spaceBeforeRect = rectAvailableSpace.withHorizontalRange(ranges[0]);
		const widgetRect = rectAvailableSpace.withHorizontalRange(ranges[1]);
		const spaceAfterRect = rectAvailableSpace.withHorizontalRange(ranges[2]);

		const showRects2 = false;
		if (showRects2) {
			debugView(debugLogRects({ spaceBeforeRect, widgetRect, spaceAfterRect }, this._editor.getDomNode()!), reader);
		}

		const previewEditorRect = widgetRect.withMargin(-widgetPadding - widgetBorder - previewEditorMargin).withMargin(0, 0, -lowerBarHeight, 0);

		const showEditorRect = false;
		if (showEditorRect) {
			debugView(debugLogRects({ previewEditorRect }, this._editor.getDomNode()!), reader);
		}

		const previewEditorContentWidth = previewEditorRect.width - previewEditorContentLayout.nonContentWidth;
		const maxPrefferedRangeLength = previewEditorContentWidth * 0.8;
		const preferredRangeToReveal = previewEditorContentLayout.preferredRangeToReveal.intersect(OffsetRange.ofStartAndLength(
			previewEditorContentLayout.preferredRangeToReveal.start,
			maxPrefferedRangeLength
		)) ?? previewEditorContentLayout.preferredRangeToReveal;
		const desiredPreviewEditorScrollLeft = scrollToReveal(previewEditorContentLayout.indentationEnd, previewEditorContentWidth, preferredRangeToReveal);

		return {
			codeEditorSize: previewEditorRect.getSize(),
			codeScrollLeft: editorScrollLeft,
			contentLeft: editorLayout.contentLeft,

			widgetRect,

			previewEditorMargin,
			widgetPadding,
			widgetBorder,

			lowerBarHeight,

			desiredPreviewEditorScrollLeft: desiredPreviewEditorScrollLeft.newScrollPosition,
		};
	});

	private readonly _view = n.div({
		class: 'inline-edits-view',
		style: {
			position: 'absolute',
			overflow: 'visible',
			top: '0px',
			left: '0px',
			display: derived(this, reader => !!this._previewEditorLayoutInfo.read(reader) ? 'block' : 'none'),
		},
	}, [
		derived(this, _reader => [this._widgetContent]),
	]);

	private readonly _widgetContent = derived(this, reader => // TODO@hediet: remove when n.div lazily creates previewEditor.element node
		n.div({
			class: 'inline-edits-long-distance-hint-widget',
			style: {
				position: 'absolute',
				overflow: 'hidden',
				cursor: 'pointer',
				background: asCssVariable(editorWidgetBackground),
				padding: this._previewEditorLayoutInfo.map(i => i?.widgetPadding),
				boxSizing: 'border-box',
				borderRadius: BORDER_RADIUS,
				border: derived(reader => `${this._previewEditorLayoutInfo.read(reader)?.widgetBorder}px solid ${this._styles.read(reader).border}`),
				display: 'flex',
				flexDirection: 'column',
				opacity: derived(reader => this._viewState.read(reader)?.hint.isVisible ? '1' : '0'),
				transition: 'opacity 200ms ease-in-out',
				...rectToProps(reader => this._previewEditorLayoutInfo.read(reader)?.widgetRect)
			},
			onmousedown: e => {
				e.preventDefault(); // This prevents that the editor loses focus
			},
			onclick: () => {
				this._viewState.read(undefined)?.model.jump();
			}
		}, [
			n.div({
				class: ['editorContainer'],
				style: {
					overflow: 'hidden',
					padding: this._previewEditorLayoutInfo.map(i => i?.previewEditorMargin),
					background: asCssVariable(editorBackground),
					pointerEvents: 'none',
				},
			}, [
				derived(this, r => this._previewEditor.element), // --
			]),
			n.div({ class: 'bar', style: { color: asCssVariable(descriptionForeground), pointerEvents: 'none', margin: '0 4px', height: this._previewEditorLayoutInfo.map(i => i?.lowerBarHeight), display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
				derived(this, reader => {
					const children: (HTMLElement | ObserverNode<HTMLDivElement>)[] = [];
					const viewState = this._viewState.read(reader);
					if (!viewState) {
						return children;
					}

					// Outline Element
					const source = this._originalOutlineSource.read(reader);
					const originalTargetLineNumber = this._originalTargetLineNumber.read(reader);
					const outlineItems = source?.getAt(originalTargetLineNumber, reader).slice(0, 1) ?? [];
					const outlineElements: ChildNode[] = [];
					if (outlineItems.length > 0) {
						for (let i = 0; i < outlineItems.length; i++) {
							const item = outlineItems[i];
							const icon = SymbolKinds.toIcon(item.kind);
							outlineElements.push(n.div({
								class: 'breadcrumb-item',
								style: { display: 'flex', alignItems: 'center', flex: '1 1 auto', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
							}, [
								renderIcon(icon),
								'\u00a0',
								item.name,
								...(i === outlineItems.length - 1
									? []
									: [renderIcon(Codicon.chevronRight)]
								)
							]));
						}
					}
					children.push(n.div({ class: 'outline-elements', style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, outlineElements));

					// Show Edit Direction
					const arrowIcon = viewState.hint.lineNumber < originalTargetLineNumber ? Codicon.arrowDown : Codicon.arrowUp;
					const keybinding = this._keybindingService.lookupKeybinding(jumpToNextInlineEditId);
					let label = 'Go to suggestion';
					if (keybinding && keybinding.getLabel() === 'Tab') {
						label = 'Tab to jump';
					}
					children.push(n.div({
						class: 'go-to-label',
						style: { position: 'relative', display: 'flex', alignItems: 'center', flex: '0 0 auto', paddingLeft: '6px' },
					}, [
						label,
						'\u00a0',
						renderIcon(arrowIcon),
					]));

					return children;
				})
			]),
		])
	);

	// Drives breadcrumbs and symbol icon
	private readonly _originalTargetLineNumber = derived(this, (reader) => {
		const viewState = this._viewState.read(reader);
		if (!viewState) {
			return -1;
		}

		if (viewState.edit.action?.kind === 'jumpTo') {
			return viewState.edit.action.position.lineNumber;
		}

		return viewState.diff[0]?.original.startLineNumber ?? -1;
	});

	private readonly _originalOutlineSource = derivedDisposable(this, (reader) => {
		const m = this._editorObs.model.read(reader);
		const factory = HideUnchangedRegionsFeature._breadcrumbsSourceFactory.read(reader);
		return (!m || !factory) ? undefined : factory(m, this._instantiationService);
	});
}

export interface ILongDistanceHint {
	lineNumber: number;
	isVisible: boolean;
}

export interface ILongDistanceViewState {
	hint: ILongDistanceHint;
	newTextLineCount: number;
	edit: InlineEditWithChanges;
	diff: DetailedLineRangeMapping[];
	nextCursorPosition: Position | null;

	model: SimpleInlineSuggestModel;
	inlineSuggestInfo: InlineSuggestionGutterMenuData;
}

function lengthsToOffsetRanges(lengths: number[], initialOffset = 0): OffsetRange[] {
	const result: OffsetRange[] = [];
	let offset = initialOffset;
	for (const length of lengths) {
		result.push(new OffsetRange(offset, offset + length));
		offset += length;
	}
	return result;
}

function stackSizesDown(at: Point, sizes: Size2D[], alignment: 'left' | 'right' = 'left'): Rect[] {
	const rects: Rect[] = [];
	let offset = 0;
	for (const s of sizes) {
		rects.push(
			Rect.fromLeftTopWidthHeight(
				at.x + (alignment === 'left' ? 0 : -s.width),
				at.y + offset,
				s.width,
				s.height
			)
		);
		offset += s.height;
	}
	return rects;
}



export function drawEditorWidths(e: ICodeEditor, reader: IReader) {
	const layoutInfo = e.getLayoutInfo();
	const contentLeft = new OffsetRange(0, layoutInfo.contentLeft);
	const trueContent = OffsetRange.ofStartAndLength(layoutInfo.contentLeft, layoutInfo.contentWidth - layoutInfo.verticalScrollbarWidth);
	const minimap = OffsetRange.ofStartAndLength(trueContent.endExclusive, layoutInfo.minimap.minimapWidth);
	const verticalScrollbar = OffsetRange.ofStartAndLength(minimap.endExclusive, layoutInfo.verticalScrollbarWidth);

	const r = new OffsetRange(0, 200);
	debugView(debugLogHorizontalOffsetRanges({
		contentLeft: Rect.fromRanges(contentLeft, r),
		trueContent: Rect.fromRanges(trueContent, r),
		minimap: Rect.fromRanges(minimap, r),
		verticalScrollbar: Rect.fromRanges(verticalScrollbar, r),
	}, e.getDomNode()!), reader);
}


/**
 * Changes the scroll position as little as possible just to reveal the given range in the window.
*/
export function scrollToReveal(currentScrollPosition: number, windowWidth: number, contentRangeToReveal: OffsetRange): { newScrollPosition: number } {
	const visibleRange = new OffsetRange(currentScrollPosition, currentScrollPosition + windowWidth);
	if (visibleRange.containsRange(contentRangeToReveal)) {
		return { newScrollPosition: currentScrollPosition };
	}
	if (contentRangeToReveal.length > windowWidth) {
		return { newScrollPosition: contentRangeToReveal.start };
	}
	if (contentRangeToReveal.endExclusive > visibleRange.endExclusive) {
		return { newScrollPosition: contentRangeToReveal.endExclusive - windowWidth };
	}
	if (contentRangeToReveal.start < visibleRange.start) {
		return { newScrollPosition: contentRangeToReveal.start };
	}
	return { newScrollPosition: currentScrollPosition };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/longDistanceHint/longDistancePreviewEditor.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/longDistanceHint/longDistancePreviewEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { n } from '../../../../../../../../base/browser/dom.js';
import { Disposable } from '../../../../../../../../base/common/lifecycle.js';
import { clamp } from '../../../../../../../../base/common/numbers.js';
import { IObservable, derived, constObservable, IReader, autorun, observableValue } from '../../../../../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../../../../../platform/instantiation/common/instantiation.js';
import { ICodeEditor } from '../../../../../../../browser/editorBrowser.js';
import { ObservableCodeEditor, observableCodeEditor } from '../../../../../../../browser/observableCodeEditor.js';
import { EmbeddedCodeEditorWidget } from '../../../../../../../browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { IDimension } from '../../../../../../../common/core/2d/dimension.js';
import { Position } from '../../../../../../../common/core/position.js';
import { Range } from '../../../../../../../common/core/range.js';
import { LineRange } from '../../../../../../../common/core/ranges/lineRange.js';
import { OffsetRange } from '../../../../../../../common/core/ranges/offsetRange.js';
import { DetailedLineRangeMapping } from '../../../../../../../common/diff/rangeMapping.js';
import { IModelDeltaDecoration, ITextModel } from '../../../../../../../common/model.js';
import { ModelDecorationOptions } from '../../../../../../../common/model/textModel.js';
import { InlineCompletionContextKeys } from '../../../../controller/inlineCompletionContextKeys.js';
import { InlineEditsGutterIndicator, InlineEditsGutterIndicatorData, InlineSuggestionGutterMenuData, SimpleInlineSuggestModel } from '../../components/gutterIndicatorView.js';
import { InlineEditTabAction } from '../../inlineEditsViewInterface.js';
import { classNames, maxContentWidthInRange } from '../../utils/utils.js';
import { JumpToView } from '../jumpToView.js';

export interface ILongDistancePreviewProps {
	nextCursorPosition: Position | null; // assert: nextCursorPosition !== null  xor  diff.length > 0
	diff: DetailedLineRangeMapping[];
	model: SimpleInlineSuggestModel;
	inlineSuggestInfo: InlineSuggestionGutterMenuData;
}

export class LongDistancePreviewEditor extends Disposable {
	public readonly previewEditor;
	private readonly _previewEditorObs;

	private readonly _previewRef = n.ref<HTMLDivElement>();
	public readonly element = n.div({ class: 'preview', style: { /*pointerEvents: 'none'*/ }, ref: this._previewRef });

	private _parentEditorObs: ObservableCodeEditor;

	constructor(
		private readonly _previewTextModel: ITextModel,
		private readonly _properties: IObservable<ILongDistancePreviewProps | undefined>,
		private readonly _parentEditor: ICodeEditor,
		private readonly _tabAction: IObservable<InlineEditTabAction>,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();

		this.previewEditor = this._register(this._createPreviewEditor());
		this._parentEditorObs = observableCodeEditor(this._parentEditor);

		this._register(autorun(reader => {
			const tm = this._state.read(reader)?.textModel || null;

			if (tm) {
				// Avoid transitions from tm -> null -> tm, where tm -> tm would be a no-op.
				this.previewEditor.setModel(tm);
			}
		}));

		this._previewEditorObs = observableCodeEditor(this.previewEditor);
		this._register(this._previewEditorObs.setDecorations(derived(reader => {
			const state = this._state.read(reader);
			const decorations = this._editorDecorations.read(reader);
			return (state?.mode === 'original' ? decorations?.originalDecorations : decorations?.modifiedDecorations) ?? [];
		})));

		const showJumpToDecoration = false;

		if (showJumpToDecoration) {
			this._register(this._instantiationService.createInstance(JumpToView, this._previewEditorObs, { style: 'cursor' }, derived(reader => {
				const p = this._properties.read(reader);
				if (!p || !p.nextCursorPosition) {
					return undefined;
				}
				return {
					jumpToPosition: p.nextCursorPosition,

				};
			})));
		}

		// Mirror the cursor position. Allows the gutter arrow to point in the correct direction.
		this._register(autorun((reader) => {
			if (!this._properties.read(reader)) {
				return;
			}
			const cursorPosition = this._parentEditorObs.cursorPosition.read(reader);
			if (cursorPosition) {
				this.previewEditor.setPosition(this._previewTextModel.validatePosition(cursorPosition), 'longDistanceHintPreview');
			}
		}));

		this._register(autorun(reader => {
			const state = this._state.read(reader);
			if (!state) {
				return;
			}
			// Ensure there is enough space to the left of the line number for the gutter indicator to fits.
			const lineNumberDigets = state.visibleLineRange.startLineNumber.toString().length;
			this.previewEditor.updateOptions({ lineNumbersMinChars: lineNumberDigets + 1 });
		}));

		this._register(this._instantiationService.createInstance(
			InlineEditsGutterIndicator,
			this._previewEditorObs,
			derived(reader => {
				const state = this._state.read(reader);
				if (!state) { return undefined; }
				const props = this._properties.read(reader);
				if (!props) { return undefined; }
				return new InlineEditsGutterIndicatorData(
					props.inlineSuggestInfo,
					LineRange.ofLength(state.visibleLineRange.startLineNumber, 1),
					props.model,
					undefined,
				);
			}),
			this._tabAction,
			constObservable(0),
			constObservable(false),
			observableValue(this, false),
		));

		this.updatePreviewEditorEffect.recomputeInitiallyAndOnChange(this._store);
	}

	private readonly _state = derived(this, reader => {
		const props = this._properties.read(reader);
		if (!props) {
			return undefined;
		}

		let mode: 'original' | 'modified';
		let visibleRange: LineRange;

		if (props.nextCursorPosition !== null) {
			mode = 'original';
			visibleRange = LineRange.ofLength(props.nextCursorPosition.lineNumber, 1);
		} else {
			if (props.diff[0].innerChanges?.every(c => c.modifiedRange.isEmpty())) {
				mode = 'original';
				visibleRange = LineRange.ofLength(props.diff[0].original.startLineNumber, 1);
			} else {
				mode = 'modified';
				visibleRange = LineRange.ofLength(props.diff[0].modified.startLineNumber, 1);
			}
		}

		const textModel = mode === 'original' ? this._parentEditorObs.model.read(reader) : this._previewTextModel;
		return {
			mode,
			visibleLineRange: visibleRange,
			textModel,
			diff: props.diff,
		};
	});

	private _createPreviewEditor() {
		return this._instantiationService.createInstance(
			EmbeddedCodeEditorWidget,
			this._previewRef.element,
			{
				glyphMargin: false,
				lineNumbers: 'on',
				minimap: { enabled: false },
				guides: {
					indentation: false,
					bracketPairs: false,
					bracketPairsHorizontal: false,
					highlightActiveIndentation: false,
				},
				editContext: false, // is a bit faster
				rulers: [],
				padding: { top: 0, bottom: 0 },
				//folding: false,
				selectOnLineNumbers: false,
				selectionHighlight: false,
				columnSelection: false,
				overviewRulerBorder: false,
				overviewRulerLanes: 0,
				//lineDecorationsWidth: 0,
				//lineNumbersMinChars: 0,
				revealHorizontalRightPadding: 0,
				bracketPairColorization: { enabled: true, independentColorPoolPerBracketType: false },
				scrollBeyondLastLine: false,
				scrollbar: {
					vertical: 'hidden',
					horizontal: 'hidden',
					handleMouseWheel: false,
				},
				readOnly: true,
				wordWrap: 'off',
				wordWrapOverride1: 'off',
				wordWrapOverride2: 'off',
			},
			{
				contextKeyValues: {
					[InlineCompletionContextKeys.inInlineEditsPreviewEditor.key]: true,
				},
				contributions: [],
			},
			this._parentEditor
		);
	}

	public readonly updatePreviewEditorEffect = derived(this, reader => {
		// this._widgetContent.readEffect(reader);
		this._previewEditorObs.model.read(reader); // update when the model is set

		const range = this._state.read(reader)?.visibleLineRange;
		if (!range) {
			return;
		}
		const hiddenAreas: Range[] = [];
		if (range.startLineNumber > 1) {
			hiddenAreas.push(new Range(1, 1, range.startLineNumber - 1, 1));
		}
		if (range.endLineNumberExclusive < this._previewTextModel.getLineCount() + 1) {
			hiddenAreas.push(new Range(range.endLineNumberExclusive, 1, this._previewTextModel.getLineCount() + 1, 1));
		}
		this.previewEditor.setHiddenAreas(hiddenAreas, undefined, true);
	});

	public readonly horizontalContentRangeInPreviewEditorToShow = derived(this, reader => {
		return this._getHorizontalContentRangeInPreviewEditorToShow(this.previewEditor, reader);
	});

	public readonly contentHeight = derived(this, (reader) => {
		const viewState = this._state.read(reader);
		if (!viewState) {
			return constObservable(null);
		}

		const previewEditorHeight = this._previewEditorObs.observeLineHeightForLine(viewState.visibleLineRange.startLineNumber);
		return previewEditorHeight;
	}).flatten();

	private _getHorizontalContentRangeInPreviewEditorToShow(editor: ICodeEditor, reader: IReader) {
		const state = this._state.read(reader);
		if (!state) { return undefined; }

		const diff = state.diff;
		const jumpToPos = this._properties.read(reader)?.nextCursorPosition;

		const visibleRange = state.visibleLineRange;
		const l = this._previewEditorObs.layoutInfo.read(reader);
		const trueContentWidth = maxContentWidthInRange(this._previewEditorObs, visibleRange, reader);

		let firstCharacterChange: Range;
		if (jumpToPos) {
			firstCharacterChange = Range.fromPositions(jumpToPos);
		} else if (diff[0].innerChanges) {
			firstCharacterChange = state.mode === 'modified' ? diff[0].innerChanges[0].modifiedRange : diff[0].innerChanges[0].originalRange;
		} else {
			return undefined;
		}


		// find the horizontal range we want to show.
		const preferredRange = growUntilVariableBoundaries(editor.getModel()!, firstCharacterChange, 5);
		const leftOffset = this._previewEditorObs.getLeftOfPosition(preferredRange.getStartPosition(), reader);
		const rightOffset = this._previewEditorObs.getLeftOfPosition(preferredRange.getEndPosition(), reader);

		const left = clamp(leftOffset, 0, trueContentWidth);
		const right = clamp(rightOffset, left, trueContentWidth);

		const indentCol = editor.getModel()!.getLineFirstNonWhitespaceColumn(preferredRange.startLineNumber);
		const indentationEnd = this._previewEditorObs.getLeftOfPosition(new Position(preferredRange.startLineNumber, indentCol), reader);

		const preferredRangeToReveal = new OffsetRange(left, right);

		return {
			indentationEnd,
			preferredRangeToReveal,
			maxEditorWidth: trueContentWidth + l.contentLeft,
			contentWidth: trueContentWidth,
			nonContentWidth: l.contentLeft, // Width of area that is not content
		};
	}

	public layout(dimension: IDimension, desiredPreviewEditorScrollLeft: number): void {
		this.previewEditor.layout(dimension);
		this._previewEditorObs.editor.setScrollLeft(desiredPreviewEditorScrollLeft);
	}

	private readonly _editorDecorations = derived(this, reader => {
		const state = this._state.read(reader);
		if (!state) { return undefined; }

		const diff = {
			mode: 'insertionInline' as const,
			diff: state.diff,
		};
		const originalDecorations: IModelDeltaDecoration[] = [];
		const modifiedDecorations: IModelDeltaDecoration[] = [];

		const diffWholeLineDeleteDecoration = ModelDecorationOptions.register({
			className: 'inlineCompletions-char-delete',
			description: 'char-delete',
			isWholeLine: false,
			zIndex: 1, // be on top of diff background decoration
		});

		const diffWholeLineAddDecoration = ModelDecorationOptions.register({
			className: 'inlineCompletions-char-insert',
			description: 'char-insert',
			isWholeLine: true,
		});

		const diffAddDecoration = ModelDecorationOptions.register({
			className: 'inlineCompletions-char-insert',
			description: 'char-insert',
			shouldFillLineOnLineBreak: true,
		});

		const hideEmptyInnerDecorations = true; // diff.mode === 'lineReplacement';
		for (const m of diff.diff) {
			if (m.modified.isEmpty || m.original.isEmpty) {
				if (!m.original.isEmpty) {
					originalDecorations.push({ range: m.original.toInclusiveRange()!, options: diffWholeLineDeleteDecoration });
				}
				if (!m.modified.isEmpty) {
					modifiedDecorations.push({ range: m.modified.toInclusiveRange()!, options: diffWholeLineAddDecoration });
				}
			} else {
				for (const i of m.innerChanges || []) {
					// Don't show empty markers outside the line range
					if (m.original.contains(i.originalRange.startLineNumber) && !(hideEmptyInnerDecorations && i.originalRange.isEmpty())) {
						originalDecorations.push({
							range: i.originalRange,
							options: {
								description: 'char-delete',
								shouldFillLineOnLineBreak: false,
								className: classNames(
									'inlineCompletions-char-delete',
									// i.originalRange.isSingleLine() && diff.mode === 'insertionInline' && 'single-line-inline',
									i.originalRange.isEmpty() && 'empty',
								),
								zIndex: 1
							}
						});
					}
					if (m.modified.contains(i.modifiedRange.startLineNumber)) {
						modifiedDecorations.push({
							range: i.modifiedRange,
							options: diffAddDecoration
						});
					}
				}
			}
		}

		return { originalDecorations, modifiedDecorations };
	});
}

/*
 * Grows the range on each ends until it includes a none-variable-name character
 * or the next character would be a whitespace character
 * or the maxGrow limit is reached
 */
function growUntilVariableBoundaries(textModel: ITextModel, range: Range, maxGrow: number): Range {
	const startPosition = range.getStartPosition();
	const endPosition = range.getEndPosition();
	const line = textModel.getLineContent(startPosition.lineNumber);

	function isVariableNameCharacter(col: number): boolean {
		const char = line.charAt(col - 1);
		return (/[a-zA-Z0-9_]/).test(char);
	}

	function isWhitespace(col: number): boolean {
		const char = line.charAt(col - 1);
		return char === ' ' || char === '\t';
	}

	let startColumn = startPosition.column;
	while (startColumn > 1 && isVariableNameCharacter(startColumn) && !isWhitespace(startColumn - 1) && startPosition.column - startColumn < maxGrow) {
		startColumn--;
	}

	let endColumn = endPosition.column - 1;
	while (endColumn <= line.length && isVariableNameCharacter(endColumn) && !isWhitespace(endColumn + 1) && endColumn - endPosition.column < maxGrow) {
		endColumn++;
	}

	return new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endColumn + 1);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/longDistanceHint/longDistnaceWidgetPlacement.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/longDistanceHint/longDistnaceWidgetPlacement.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { derived, IReader } from '../../../../../../../../base/common/observable.js';
import { ObservableCodeEditor } from '../../../../../../../browser/observableCodeEditor.js';
import { Size2D } from '../../../../../../../common/core/2d/size.js';
import { LineRange } from '../../../../../../../common/core/ranges/lineRange.js';
import { OffsetRange } from '../../../../../../../common/core/ranges/offsetRange.js';
import { getMaxTowerHeightInAvailableArea } from '../../utils/towersLayout.js';

/**
 * Layout constants used for the long-distance hint widget.
 */
export interface WidgetLayoutConstants {
	readonly previewEditorMargin: number;
	readonly widgetPadding: number;
	readonly widgetBorder: number;
	readonly lowerBarHeight: number;
	readonly minWidgetWidth: number;
}
/**
 * Represents a widget placement outline with horizontal and vertical ranges.
 */
export interface WidgetOutline {
	readonly horizontalWidgetRange: OffsetRange;
	readonly verticalWidgetRange: OffsetRange;
}
/**
 * Represents a continuous range of lines with their sizes and positioning.
 * Used to compute available space for widget placement.
 */
export interface ContinuousLineSizes {
	readonly lineRange: LineRange;
	readonly top: number;
	readonly sizes: Size2D[];
}
/**
 * Context for computing widget placement within a continuous line range.
 */
export class WidgetPlacementContext {
	public readonly availableSpaceSizes: Size2D[];
	public readonly availableSpaceHeightPrefixSums: number[];
	public readonly availableSpaceSizesTransposed: Size2D[];

	constructor(
		private readonly _lineRangeInfo: ContinuousLineSizes,
		editorTrueContentWidth: number,
		endOfLinePadding: (lineNumber: number) => number,
	) {
		this.availableSpaceSizes = _lineRangeInfo.sizes.map((s, idx) => {
			const lineNumber = _lineRangeInfo.lineRange.startLineNumber + idx;
			const linePaddingLeft = endOfLinePadding(lineNumber);
			return new Size2D(Math.max(0, editorTrueContentWidth - s.width - linePaddingLeft), s.height);
		});

		this.availableSpaceHeightPrefixSums = getSums(this.availableSpaceSizes, s => s.height);
		this.availableSpaceSizesTransposed = this.availableSpaceSizes.map(s => s.transpose());
	}

	/**
	 * Computes the vertical outline for a widget placed at the given line number.
	 */
	public getWidgetVerticalOutline(
		lineNumber: number,
		previewEditorHeight: number,
		layoutConstants: WidgetLayoutConstants
	): OffsetRange {
		const sizeIdx = lineNumber - this._lineRangeInfo.lineRange.startLineNumber;
		const top = this._lineRangeInfo.top + this.availableSpaceHeightPrefixSums[sizeIdx];
		const editorRange = OffsetRange.ofStartAndLength(top, previewEditorHeight);
		const { previewEditorMargin, widgetPadding, widgetBorder, lowerBarHeight } = layoutConstants;
		const verticalWidgetRange = editorRange.withMargin(previewEditorMargin + widgetPadding + widgetBorder).withMargin(0, lowerBarHeight);
		return verticalWidgetRange;
	}

	/**
	 * Tries to find a valid widget outline within this line range context.
	 */
	public tryFindWidgetOutline(
		targetLineNumber: number,
		previewEditorHeight: number,
		editorTrueContentRight: number,
		layoutConstants: WidgetLayoutConstants
	): WidgetOutline | undefined {
		if (this._lineRangeInfo.lineRange.length < 3) {
			return undefined;
		}
		return findFirstMinimzeDistance(
			this._lineRangeInfo.lineRange.addMargin(-1, -1),
			targetLineNumber,
			lineNumber => {
				const verticalWidgetRange = this.getWidgetVerticalOutline(lineNumber, previewEditorHeight, layoutConstants);
				const maxWidth = getMaxTowerHeightInAvailableArea(
					verticalWidgetRange.delta(-this._lineRangeInfo.top),
					this.availableSpaceSizesTransposed
				);
				if (maxWidth < layoutConstants.minWidgetWidth) {
					return undefined;
				}
				const horizontalWidgetRange = OffsetRange.ofStartAndLength(editorTrueContentRight - maxWidth, maxWidth);
				return { horizontalWidgetRange, verticalWidgetRange };
			}
		);
	}
}
/**
 * Splits line size information into continuous ranges, breaking at positions where
 * the expected vertical position differs from the actual position (e.g., due to folded regions).
 */
export function splitIntoContinuousLineRanges(
	lineRange: LineRange,
	sizes: Size2D[],
	top: number,
	editorObs: ObservableCodeEditor,
	reader: IReader,
): ContinuousLineSizes[] {
	const result: ContinuousLineSizes[] = [];
	let currentRangeStart = lineRange.startLineNumber;
	let currentRangeTop = top;
	let currentSizes: Size2D[] = [];

	for (let i = 0; i < sizes.length; i++) {
		const lineNumber = lineRange.startLineNumber + i;
		const expectedTop = currentRangeTop + currentSizes.reduce((p, c) => p + c.height, 0);
		const actualTop = editorObs.editor.getTopForLineNumber(lineNumber);

		if (i > 0 && actualTop !== expectedTop) {
			// Discontinuity detected - push the current range and start a new one
			result.push({
				lineRange: LineRange.ofLength(currentRangeStart, lineNumber - currentRangeStart),
				top: currentRangeTop,
				sizes: currentSizes,
			});
			currentRangeStart = lineNumber;
			currentRangeTop = actualTop;
			currentSizes = [];
		}
		currentSizes.push(sizes[i]);
	}

	// Push the final range
	result.push({
		lineRange: LineRange.ofLength(currentRangeStart, lineRange.endLineNumberExclusive - currentRangeStart),
		top: currentRangeTop,
		sizes: currentSizes,
	});

	// Don't observe each line individually for performance reasons
	derived({ owner: 'splitIntoContinuousLineRanges' }, r => {
		return editorObs.observeTopForLineNumber(lineRange.endLineNumberExclusive - 1).read(r);
	}).read(reader);

	return result;
}

function findFirstMinimzeDistance<T>(range: LineRange, targetLine: number, predicate: (lineNumber: number) => T | undefined): T | undefined {
	for (let offset = 0; ; offset++) {
		const down = targetLine + offset;
		if (down <= range.endLineNumberExclusive) {
			const result = predicate(down);
			if (result !== undefined) {
				return result;
			}
		}
		const up = targetLine - offset;
		if (up >= range.startLineNumber) {
			const result = predicate(up);
			if (result !== undefined) {
				return result;
			}
		}
		if (up < range.startLineNumber && down > range.endLineNumberExclusive) {
			return undefined;
		}
	}
}

function getSums<T>(array: T[], fn: (item: T) => number): number[] {
	const result: number[] = [0];
	let sum = 0;
	for (const item of array) {
		sum += fn(item);
		result.push(sum);
	}
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/utils/flexBoxLayout.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/utils/flexBoxLayout.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IFlexBoxPartGrowthRule extends IFlexBoxPartExtensionRule {
	min?: number;
	rules?: IFlexBoxPartExtensionRule[];
}

export interface IFlexBoxPartExtensionRule {
	max?: number;
	priority?: number;
	share?: number;
}


/**
 * Distributes a total size into parts that each have a list of growth rules.
 * Returns `null` if the layout is not possible.
 * The sum of all returned sizes will be equal to `totalSize`.
 *
 * First, each part gets its minimum size.
 * Then, remaining space is distributed to the rules with the highest priority, as long as the max constraint allows it (considering share).
 * This continues with next lower priority rules until no space is left.
*/
export function distributeFlexBoxLayout<T extends Record<string, IFlexBoxPartGrowthRule | IFlexBoxPartGrowthRule[]>>(
	totalSize: number,
	parts: T & Record<string, IFlexBoxPartGrowthRule | IFlexBoxPartGrowthRule[]>
): Record<keyof T, number> | null {
	// Normalize parts to always have array of rules
	const normalizedParts: Record<string, { min: number; rules: IFlexBoxPartExtensionRule[] }> = {};
	for (const [key, part] of Object.entries(parts)) {
		if (Array.isArray(part)) {
			normalizedParts[key] = { min: 0, rules: part };
		} else {
			normalizedParts[key] = {
				min: part.min ?? 0,
				rules: part.rules ?? [{ max: part.max, priority: part.priority, share: part.share }]
			};
		}
	}

	// Initialize result with minimum sizes
	const result: Record<string, number> = {};
	let usedSize = 0;
	for (const [key, part] of Object.entries(normalizedParts)) {
		result[key] = part.min;
		usedSize += part.min;
	}

	// Check if we can satisfy minimum constraints
	if (usedSize > totalSize) {
		return null;
	}

	let remainingSize = totalSize - usedSize;

	// Distribute remaining space by priority levels
	while (remainingSize > 0) {
		// Find all rules at current highest priority that can still grow
		const candidateRules: Array<{
			partKey: string;
			ruleIndex: number;
			rule: IFlexBoxPartExtensionRule;
			priority: number;
			share: number;
		}> = [];

		for (const [key, part] of Object.entries(normalizedParts)) {
			for (let i = 0; i < part.rules.length; i++) {
				const rule = part.rules[i];
				const currentUsage = result[key];
				const maxSize = rule.max ?? Infinity;

				if (currentUsage < maxSize) {
					candidateRules.push({
						partKey: key,
						ruleIndex: i,
						rule,
						priority: rule.priority ?? 0,
						share: rule.share ?? 1
					});
				}
			}
		}

		if (candidateRules.length === 0) {
			// No rules can grow anymore, but we have remaining space
			break;
		}

		// Find the highest priority among candidates
		const maxPriority = Math.max(...candidateRules.map(c => c.priority));
		const highestPriorityCandidates = candidateRules.filter(c => c.priority === maxPriority);

		// Calculate total share
		const totalShare = highestPriorityCandidates.reduce((sum, c) => sum + c.share, 0);

		// Distribute space proportionally by share
		let distributedThisRound = 0;
		const distributions: Array<{ partKey: string; ruleIndex: number; amount: number }> = [];

		for (const candidate of highestPriorityCandidates) {
			const rule = candidate.rule;
			const currentUsage = result[candidate.partKey];
			const maxSize = rule.max ?? Infinity;
			const availableForThisRule = maxSize - currentUsage;

			// Calculate ideal share
			const idealShare = (remainingSize * candidate.share) / totalShare;
			const actualAmount = Math.min(idealShare, availableForThisRule);

			distributions.push({
				partKey: candidate.partKey,
				ruleIndex: candidate.ruleIndex,
				amount: actualAmount
			});

			distributedThisRound += actualAmount;
		}

		if (distributedThisRound === 0) {
			// No progress can be made
			break;
		}

		// Apply distributions
		for (const dist of distributions) {
			result[dist.partKey] += dist.amount;
		}

		remainingSize -= distributedThisRound;

		// Break if remaining is negligible (floating point precision)
		if (remainingSize < 0.0001) {
			break;
		}
	}

	return result as Record<keyof T, number>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/utils/towersLayout.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/utils/towersLayout.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Size2D } from '../../../../../../common/core/2d/size.js';
import { OffsetRange } from '../../../../../../common/core/ranges/offsetRange.js';

/**
 * The tower areas are arranged from left to right, touch and are aligned at the bottom.
 * How high can a tower be placed at the requested horizontal range, so that its size fits into the union of the stacked availableTowerAreas?
 */
export function getMaxTowerHeightInAvailableArea(towerHorizontalRange: OffsetRange, availableTowerAreas: Size2D[]): number {
	const towerLeftOffset = towerHorizontalRange.start;
	const towerRightOffset = towerHorizontalRange.endExclusive;

	let minHeight = Number.MAX_VALUE;

	// Calculate the accumulated width to find which tower areas the requested tower overlaps
	let currentLeftOffset = 0;
	for (const availableArea of availableTowerAreas) {
		const currentRightOffset = currentLeftOffset + availableArea.width;

		// Check if the requested tower overlaps with this available area
		const overlapLeft = Math.max(towerLeftOffset, currentLeftOffset);
		const overlapRight = Math.min(towerRightOffset, currentRightOffset);

		if (overlapLeft < overlapRight) {
			// There is an overlap - track the minimum height
			minHeight = Math.min(minHeight, availableArea.height);
		}

		currentLeftOffset = currentRightOffset;
	}

	if (towerRightOffset > currentLeftOffset) {
		return 0;
	}

	// If no overlap was found, return 0
	return minHeight === Number.MAX_VALUE ? 0 : minHeight;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/utils/utils.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/utils/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getDomNodePagePosition, h } from '../../../../../../../base/browser/dom.js';
import { KeybindingLabel, unthemedKeybindingLabelOptions } from '../../../../../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { numberComparator } from '../../../../../../../base/common/arrays.js';
import { findFirstMin } from '../../../../../../../base/common/arraysFind.js';
import { DisposableStore, toDisposable } from '../../../../../../../base/common/lifecycle.js';
import { DebugLocation, derived, derivedObservableWithCache, derivedOpts, IObservable, IReader, observableSignalFromEvent, observableValue, transaction } from '../../../../../../../base/common/observable.js';
import { OS } from '../../../../../../../base/common/platform.js';
import { splitLines } from '../../../../../../../base/common/strings.js';
import { URI } from '../../../../../../../base/common/uri.js';
import { MenuEntryActionViewItem } from '../../../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { ICodeEditor } from '../../../../../../browser/editorBrowser.js';
import { observableCodeEditor, ObservableCodeEditor } from '../../../../../../browser/observableCodeEditor.js';
import { Point } from '../../../../../../common/core/2d/point.js';
import { Rect } from '../../../../../../common/core/2d/rect.js';
import { EditorOption } from '../../../../../../common/config/editorOptions.js';
import { LineRange } from '../../../../../../common/core/ranges/lineRange.js';
import { OffsetRange } from '../../../../../../common/core/ranges/offsetRange.js';
import { Position } from '../../../../../../common/core/position.js';
import { Range } from '../../../../../../common/core/range.js';
import { TextReplacement, TextEdit } from '../../../../../../common/core/edits/textEdit.js';
import { RangeMapping } from '../../../../../../common/diff/rangeMapping.js';
import { ITextModel } from '../../../../../../common/model.js';
import { indentOfLine } from '../../../../../../common/model/textModel.js';
import { CharCode } from '../../../../../../../base/common/charCode.js';
import { BugIndicatingError } from '../../../../../../../base/common/errors.js';
import { Size2D } from '../../../../../../common/core/2d/size.js';

/**
 * Warning: might return 0.
*/
export function maxContentWidthInRange(editor: ObservableCodeEditor, range: LineRange, reader: IReader | undefined): number {
	editor.layoutInfo.read(reader);
	editor.value.read(reader);

	const model = editor.model.read(reader);
	if (!model) { return 0; }
	let maxContentWidth = 0;

	editor.scrollTop.read(reader);
	for (let i = range.startLineNumber; i < range.endLineNumberExclusive; i++) {
		const lineContentWidth = editor.editor.getWidthOfLine(i);
		maxContentWidth = Math.max(maxContentWidth, lineContentWidth);
	}
	const lines = range.mapToLineArray(l => model.getLineContent(l));

	if (maxContentWidth < 5 && lines.some(l => l.length > 0) && model.uri.scheme !== 'file') {
		console.error('unexpected width');
	}
	return maxContentWidth;
}

export function getContentSizeOfLines(editor: ObservableCodeEditor, range: LineRange, reader: IReader | undefined): Size2D[] {
	editor.layoutInfo.read(reader);
	editor.value.read(reader);
	observableSignalFromEvent(editor, editor.editor.onDidChangeLineHeight).read(reader);

	const model = editor.model.read(reader);
	if (!model) { throw new BugIndicatingError('Model is required'); }

	const sizes: Size2D[] = [];

	editor.scrollTop.read(reader);
	for (let i = range.startLineNumber; i < range.endLineNumberExclusive; i++) {
		let lineContentWidth = editor.editor.getWidthOfLine(i);
		if (lineContentWidth === -1) {
			// approximation
			const column = model.getLineMaxColumn(i);
			const typicalHalfwidthCharacterWidth = editor.editor.getOption(EditorOption.fontInfo).typicalHalfwidthCharacterWidth;
			const approximation = column * typicalHalfwidthCharacterWidth;
			lineContentWidth = approximation;
		}

		const height = editor.editor.getLineHeightForPosition(new Position(i, 1));
		sizes.push(new Size2D(lineContentWidth, height));
	}

	return sizes;
}

export function getOffsetForPos(editor: ObservableCodeEditor, pos: Position, reader: IReader): number {
	editor.layoutInfo.read(reader);
	editor.value.read(reader);

	const model = editor.model.read(reader);
	if (!model) { return 0; }

	editor.scrollTop.read(reader);
	const lineContentWidth = editor.editor.getOffsetForColumn(pos.lineNumber, pos.column);

	return lineContentWidth;
}

export function getPrefixTrim(diffRanges: Range[], originalLinesRange: LineRange, modifiedLines: string[], editor: ICodeEditor, reader: IReader | undefined = undefined): { prefixTrim: number; prefixLeftOffset: number } {
	const textModel = editor.getModel();
	if (!textModel) {
		return { prefixTrim: 0, prefixLeftOffset: 0 };
	}

	const replacementStart = diffRanges.map(r => r.isSingleLine() ? r.startColumn - 1 : 0);
	const originalIndents = originalLinesRange.mapToLineArray(line => indentOfLine(textModel.getLineContent(line)));
	const modifiedIndents = modifiedLines.filter(line => line !== '').map(line => indentOfLine(line));
	const prefixTrim = Math.min(...replacementStart, ...originalIndents, ...modifiedIndents);

	let prefixLeftOffset;
	const startLineIndent = textModel.getLineIndentColumn(originalLinesRange.startLineNumber);
	if (startLineIndent >= prefixTrim + 1) {
		// We can use the editor to get the offset
		// TODO go through other usages of getOffsetForColumn and come up with a robust reactive solution to read it
		observableCodeEditor(editor).scrollTop.read(reader); // getOffsetForColumn requires the line number to be visible. This might change on scroll top.
		prefixLeftOffset = editor.getOffsetForColumn(originalLinesRange.startLineNumber, prefixTrim + 1);
	} else if (modifiedLines.length > 0) {
		// Content is not in the editor, we can use the content width to calculate the offset
		prefixLeftOffset = getContentRenderWidth(modifiedLines[0].slice(0, prefixTrim), editor, textModel);
	} else {
		// unable to approximate the offset
		return { prefixTrim: 0, prefixLeftOffset: 0 };
	}

	return { prefixTrim, prefixLeftOffset };
}

export function getContentRenderWidth(content: string, editor: ICodeEditor, textModel: ITextModel) {
	const w = editor.getOption(EditorOption.fontInfo).typicalHalfwidthCharacterWidth;
	const tabSize = textModel.getOptions().tabSize * w;

	const numTabs = content.split('\t').length - 1;
	const numNoneTabs = content.length - numTabs;
	return numNoneTabs * w + numTabs * tabSize;
}

export function getEditorValidOverlayRect(editor: ObservableCodeEditor): IObservable<Rect> {
	const contentLeft = editor.layoutInfoContentLeft;

	const width = derived({ name: 'editor.validOverlay.width' }, r => {
		const hasMinimapOnTheRight = editor.layoutInfoMinimap.read(r).minimapLeft !== 0;
		const editorWidth = editor.layoutInfoWidth.read(r) - contentLeft.read(r);

		if (hasMinimapOnTheRight) {
			const minimapAndScrollbarWidth = editor.layoutInfoMinimap.read(r).minimapWidth + editor.layoutInfoVerticalScrollbarWidth.read(r);
			return editorWidth - minimapAndScrollbarWidth;
		}

		return editorWidth;
	});

	const height = derived({ name: 'editor.validOverlay.height' }, r => editor.layoutInfoHeight.read(r) + editor.contentHeight.read(r));

	return derived({ name: 'editor.validOverlay' }, r => Rect.fromLeftTopWidthHeight(contentLeft.read(r), 0, width.read(r), height.read(r)));
}

export class StatusBarViewItem extends MenuEntryActionViewItem {
	protected readonly _updateLabelListener = this._register(this._contextKeyService.onDidChangeContext(() => {
		this.updateLabel();
	}));

	protected override updateLabel() {
		const kb = this._keybindingService.lookupKeybinding(this._action.id, this._contextKeyService, true);
		if (!kb) {
			return super.updateLabel();
		}
		if (this.label) {
			const div = h('div.keybinding').root;
			const keybindingLabel = this._register(new KeybindingLabel(div, OS, { disableTitle: true, ...unthemedKeybindingLabelOptions }));
			keybindingLabel.set(kb);
			this.label.textContent = this._action.label;
			this.label.appendChild(div);
			this.label.classList.add('inlineSuggestionStatusBarItemLabel');
		}
	}

	protected override updateTooltip(): void {
		// NOOP, disable tooltip
	}
}

export class UniqueUriGenerator {
	private static _modelId = 0;

	constructor(
		public readonly scheme: string
	) { }

	public getUniqueUri(): URI {
		return URI.from({ scheme: this.scheme, path: new Date().toString() + String(UniqueUriGenerator._modelId++) });
	}
}
export function applyEditToModifiedRangeMappings(rangeMapping: RangeMapping[], edit: TextEdit): RangeMapping[] {
	const updatedMappings: RangeMapping[] = [];
	for (const m of rangeMapping) {
		const updatedRange = edit.mapRange(m.modifiedRange);
		updatedMappings.push(new RangeMapping(m.originalRange, updatedRange));
	}
	return updatedMappings;
}


export function classNames(...classes: (string | false | undefined | null)[]) {
	return classes.filter(c => typeof c === 'string').join(' ');
}

function offsetRangeToRange(columnOffsetRange: OffsetRange, startPos: Position): Range {
	return new Range(
		startPos.lineNumber,
		startPos.column + columnOffsetRange.start,
		startPos.lineNumber,
		startPos.column + columnOffsetRange.endExclusive,
	);
}

/**
 * Calculates the indentation size (in spaces) of a given line,
 * interpreting tabs as the specified tab size.
 */
function getIndentationSize(line: string, tabSize: number): number {
	let currentSize = 0;
	loop: for (let i = 0, len = line.length; i < len; i++) {
		switch (line.charCodeAt(i)) {
			case CharCode.Tab: currentSize += tabSize; break;
			case CharCode.Space: currentSize++; break;
			default: break loop;
		}
	}
	// if currentSize % tabSize !== 0,
	// then there are spaces which are not part of the indentation
	return currentSize - (currentSize % tabSize);
}

/**
 * Calculates the number of characters at the start of a line that correspond to a given indentation size,
 * taking into account both tabs and spaces.
 */
function indentSizeToIndentLength(line: string, indentSize: number, tabSize: number): number {
	let remainingSize = indentSize - (indentSize % tabSize);
	let i = 0;
	for (; i < line.length; i++) {
		if (remainingSize === 0) {
			break;
		}
		switch (line.charCodeAt(i)) {
			case CharCode.Tab: remainingSize -= tabSize; break;
			case CharCode.Space: remainingSize--; break;
			default: throw new BugIndicatingError('Unexpected character found while calculating indent length');
		}
	}
	return i;
}

export function createReindentEdit(text: string, range: LineRange, tabSize: number): TextEdit {
	const newLines = splitLines(text);
	const edits: TextReplacement[] = [];
	const minIndentSize = findFirstMin(range.mapToLineArray(l => getIndentationSize(newLines[l - 1], tabSize)), numberComparator)!;
	range.forEach(lineNumber => {
		const indentLength = indentSizeToIndentLength(newLines[lineNumber - 1], minIndentSize, tabSize);
		edits.push(new TextReplacement(offsetRangeToRange(new OffsetRange(0, indentLength), new Position(lineNumber, 1)), ''));
	});
	return new TextEdit(edits);
}

export class PathBuilder {
	private _data: string = '';

	public moveTo(point: Point): this {
		this._data += `M ${point.x} ${point.y} `;
		return this;
	}

	public lineTo(point: Point): this {
		this._data += `L ${point.x} ${point.y} `;
		return this;
	}

	public curveTo(cp: Point, to: Point): this {
		this._data += `Q ${cp.x} ${cp.y} ${to.x} ${to.y} `;
		return this;
	}

	public curveTo2(cp1: Point, cp2: Point, to: Point): this {
		this._data += `C ${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${to.x} ${to.y} `;
		return this;
	}

	public build(): string {
		return this._data;
	}
}

// Arguments are a bit messy currently, could be improved
export function createRectangle(
	layout: { topLeft: Point; width: number; height: number },
	padding: number | { top: number; right: number; bottom: number; left: number },
	borderRadius: number | { topLeft: number; topRight: number; bottomLeft: number; bottomRight: number },
	options: { hideLeft?: boolean; hideRight?: boolean; hideTop?: boolean; hideBottom?: boolean } = {}
): string {

	const topLeftInner = layout.topLeft;
	const topRightInner = topLeftInner.deltaX(layout.width);
	const bottomLeftInner = topLeftInner.deltaY(layout.height);
	const bottomRightInner = bottomLeftInner.deltaX(layout.width);

	// padding
	const { top: paddingTop, bottom: paddingBottom, left: paddingLeft, right: paddingRight } = typeof padding === 'number' ?
		{ top: padding, bottom: padding, left: padding, right: padding }
		: padding;

	// corner radius
	const { topLeft: radiusTL, topRight: radiusTR, bottomLeft: radiusBL, bottomRight: radiusBR } = typeof borderRadius === 'number' ?
		{ topLeft: borderRadius, topRight: borderRadius, bottomLeft: borderRadius, bottomRight: borderRadius } :
		borderRadius;

	const totalHeight = layout.height + paddingTop + paddingBottom;
	const totalWidth = layout.width + paddingLeft + paddingRight;

	// The path is drawn from bottom left at the end of the rounded corner in a clockwise direction
	// Before: before the rounded corner
	// After: after the rounded corner
	const topLeft = topLeftInner.deltaX(-paddingLeft).deltaY(-paddingTop);
	const topRight = topRightInner.deltaX(paddingRight).deltaY(-paddingTop);
	const topLeftBefore = topLeft.deltaY(Math.min(radiusTL, totalHeight / 2));
	const topLeftAfter = topLeft.deltaX(Math.min(radiusTL, totalWidth / 2));
	const topRightBefore = topRight.deltaX(-Math.min(radiusTR, totalWidth / 2));
	const topRightAfter = topRight.deltaY(Math.min(radiusTR, totalHeight / 2));

	const bottomLeft = bottomLeftInner.deltaX(-paddingLeft).deltaY(paddingBottom);
	const bottomRight = bottomRightInner.deltaX(paddingRight).deltaY(paddingBottom);
	const bottomLeftBefore = bottomLeft.deltaX(Math.min(radiusBL, totalWidth / 2));
	const bottomLeftAfter = bottomLeft.deltaY(-Math.min(radiusBL, totalHeight / 2));
	const bottomRightBefore = bottomRight.deltaY(-Math.min(radiusBR, totalHeight / 2));
	const bottomRightAfter = bottomRight.deltaX(-Math.min(radiusBR, totalWidth / 2));

	const path = new PathBuilder();

	if (!options.hideLeft) {
		path.moveTo(bottomLeftAfter).lineTo(topLeftBefore);
	}

	if (!options.hideLeft && !options.hideTop) {
		path.curveTo(topLeft, topLeftAfter);
	} else {
		path.moveTo(topLeftAfter);
	}

	if (!options.hideTop) {
		path.lineTo(topRightBefore);
	}

	if (!options.hideTop && !options.hideRight) {
		path.curveTo(topRight, topRightAfter);
	} else {
		path.moveTo(topRightAfter);
	}

	if (!options.hideRight) {
		path.lineTo(bottomRightBefore);
	}

	if (!options.hideRight && !options.hideBottom) {
		path.curveTo(bottomRight, bottomRightAfter);
	} else {
		path.moveTo(bottomRightAfter);
	}

	if (!options.hideBottom) {
		path.lineTo(bottomLeftBefore);
	}

	if (!options.hideBottom && !options.hideLeft) {
		path.curveTo(bottomLeft, bottomLeftAfter);
	} else {
		path.moveTo(bottomLeftAfter);
	}

	return path.build();
}

type RemoveFalsy<T> = T extends false | undefined | null ? never : T;
type Falsy<T> = T extends false | undefined | null ? T : never;

export function mapOutFalsy<T>(obs: IObservable<T>): IObservable<IObservable<RemoveFalsy<T>> | Falsy<T>> {
	const nonUndefinedObs = derivedObservableWithCache<T | undefined | null | false>(undefined, (reader, lastValue) => obs.read(reader) || lastValue);

	return derivedOpts({
		debugName: () => `${obs.debugName}.mapOutFalsy`
	}, reader => {
		nonUndefinedObs.read(reader);
		const val = obs.read(reader);
		if (!val) {
			return undefined as Falsy<T>;
		}

		return nonUndefinedObs as IObservable<RemoveFalsy<T>>;
	});
}

export function observeElementPosition(element: HTMLElement, store: DisposableStore) {
	const topLeft = getDomNodePagePosition(element);
	const top = observableValue<number>('top', topLeft.top);
	const left = observableValue<number>('left', topLeft.left);

	const resizeObserver = new ResizeObserver(() => {
		transaction(tx => {
			const topLeft = getDomNodePagePosition(element);
			top.set(topLeft.top, tx);
			left.set(topLeft.left, tx);
		});
	});

	resizeObserver.observe(element);

	store.add(toDisposable(() => resizeObserver.disconnect()));

	return {
		top,
		left
	};
}

export function rectToProps(fn: (reader: IReader) => Rect | undefined, debugLocation: DebugLocation = DebugLocation.ofCaller()) {
	return {
		left: derived({ name: 'editor.validOverlay.left' }, reader => /** @description left */ fn(reader)?.left, debugLocation),
		top: derived({ name: 'editor.validOverlay.top' }, reader => /** @description top */ fn(reader)?.top, debugLocation),
		width: derived({ name: 'editor.validOverlay.width' }, reader => {
			/** @description width */
			const val = fn(reader);
			if (!val) {
				return undefined;
			}
			return val.width;
		}, debugLocation),
		height: derived({ name: 'editor.validOverlay.height' }, reader => {
			/** @description height */
			const val = fn(reader);
			if (!val) {
				return undefined;
			}
			return val.height;
		}, debugLocation),
	};
}

export type FirstFnArg<T> = T extends (arg: infer U) => any ? U : never;


export function observeEditorBoundingClientRect(editor: ICodeEditor, store: DisposableStore): IObservable<DOMRectReadOnly> {
	const dom = editor.getContainerDomNode()!;
	const initialDomRect = observableValue('domRect', dom.getBoundingClientRect());
	store.add(editor.onDidLayoutChange(e => {
		initialDomRect.set(dom.getBoundingClientRect(), undefined);
	}));
	return initialDomRect;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/test/browser/computeGhostText.test.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/test/browser/computeGhostText.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../common/core/range.js';
import { TextReplacement } from '../../../../common/core/edits/textEdit.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { computeGhostText } from '../../browser/model/computeGhostText.js';

suite('computeGhostText', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function getOutput(text: string, suggestion: string): unknown {
		const rangeStartOffset = text.indexOf('[');
		const rangeEndOffset = text.indexOf(']') - 1;
		const cleanedText = text.replace('[', '').replace(']', '');
		const tempModel = createTextModel(cleanedText);
		const range = Range.fromPositions(tempModel.getPositionAt(rangeStartOffset), tempModel.getPositionAt(rangeEndOffset));
		const options = ['prefix', 'subword'] as const;
		// eslint-disable-next-line local/code-no-any-casts
		const result = {} as any;
		for (const option of options) {
			result[option] = computeGhostText(new TextReplacement(range, suggestion), tempModel, option)?.render(cleanedText, true);
		}

		tempModel.dispose();

		if (new Set(Object.values(result)).size === 1) {
			return Object.values(result)[0];
		}

		return result;
	}

	test('Basic', () => {
		assert.deepStrictEqual(getOutput('[foo]baz', 'foobar'), 'foo[bar]baz');
		assert.deepStrictEqual(getOutput('[aaa]aaa', 'aaaaaa'), 'aaa[aaa]aaa');
		assert.deepStrictEqual(getOutput('[foo]baz', 'boobar'), undefined);
		assert.deepStrictEqual(getOutput('[foo]foo', 'foofoo'), 'foo[foo]foo');
		assert.deepStrictEqual(getOutput('foo[]', 'bar\nhello'), 'foo[bar\nhello]');
	});

	test('Empty ghost text', () => {
		assert.deepStrictEqual(getOutput('[foo]', 'foo'), 'foo');
	});

	test('Whitespace (indentation)', () => {
		assert.deepStrictEqual(getOutput('[ foo]', 'foobar'), ' foo[bar]');
		assert.deepStrictEqual(getOutput('[\tfoo]', 'foobar'), '\tfoo[bar]');
		assert.deepStrictEqual(getOutput('[\t foo]', '\tfoobar'), '	 foo[bar]');
		assert.deepStrictEqual(getOutput('[\tfoo]', '\t\tfoobar'), { prefix: undefined, subword: '\t[\t]foo[bar]' });
		assert.deepStrictEqual(getOutput('[\t]', '\t\tfoobar'), '\t[\tfoobar]');
		assert.deepStrictEqual(getOutput('\t[]', '\t'), '\t[\t]');
		assert.deepStrictEqual(getOutput('\t[\t]', ''), '\t\t');

		assert.deepStrictEqual(getOutput('[ ]', 'return 1'), ' [return 1]');
	});

	test('Whitespace (outside of indentation)', () => {
		assert.deepStrictEqual(getOutput('bar[ foo]', 'foobar'), undefined);
		assert.deepStrictEqual(getOutput('bar[\tfoo]', 'foobar'), undefined);
	});

	test('Unsupported Case', () => {
		assert.deepStrictEqual(getOutput('fo[o\n]', 'x\nbar'), undefined);
	});

	test('New Line', () => {
		assert.deepStrictEqual(getOutput('fo[o\n]', 'o\nbar'), 'foo\n[bar]');
	});

	test('Multi Part Diffing', () => {
		assert.deepStrictEqual(getOutput('foo[()]', '(x);'), { prefix: undefined, subword: 'foo([x])[;]' });
		assert.deepStrictEqual(getOutput('[\tfoo]', '\t\tfoobar'), { prefix: undefined, subword: '\t[\t]foo[bar]' });
		assert.deepStrictEqual(getOutput('[(y ===)]', '(y === 1) { f(); }'), { prefix: undefined, subword: '(y ===[ 1])[ { f(); }]' });
		assert.deepStrictEqual(getOutput('[(y ==)]', '(y === 1) { f(); }'), { prefix: undefined, subword: '(y ==[= 1])[ { f(); }]' });

		assert.deepStrictEqual(getOutput('[(y ==)]', '(y === 1) { f(); }'), { prefix: undefined, subword: '(y ==[= 1])[ { f(); }]' });
	});

	test('Multi Part Diffing 1', () => {
		assert.deepStrictEqual(getOutput('[if () ()]', 'if (1 == f()) ()'), { prefix: undefined, subword: 'if ([1 == f()]) ()' });
	});

	test('Multi Part Diffing 2', () => {
		assert.deepStrictEqual(getOutput('[)]', '())'), ({ prefix: undefined, subword: '[(])[)]' }));
		assert.deepStrictEqual(getOutput('[))]', '(())'), ({ prefix: undefined, subword: '[((]))' }));
	});

	test('Parenthesis Matching', () => {
		assert.deepStrictEqual(getOutput('[console.log()]', 'console.log({ label: "(" })'), {
			prefix: undefined,
			subword: 'console.log([{ label: "(" }])'
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/test/browser/editKind.test.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/test/browser/editKind.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Position } from '../../../../common/core/position.js';
import { OffsetRange } from '../../../../common/core/ranges/offsetRange.js';
import { StringEdit } from '../../../../common/core/edits/stringEdit.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { computeEditKind, InsertProperties, DeleteProperties, ReplaceProperties } from '../../browser/model/editKind.js';

suite('computeEditKind', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('Insert operations', () => {
		test('single character insert - syntactical', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.insert(5, ';');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			assert.strictEqual(result.edits[0].charactersInserted, 1);
			assert.strictEqual(result.edits[0].charactersDeleted, 0);
			assert.strictEqual(result.edits[0].linesInserted, 0);
			assert.strictEqual(result.edits[0].linesDeleted, 0);
			const props = result.edits[0].properties as InsertProperties;
			assert.strictEqual(props.textShape.kind, 'singleLine');
			if (props.textShape.kind === 'singleLine') {
				assert.strictEqual(props.textShape.isSingleCharacter, true);
				assert.strictEqual(props.textShape.singleCharacterKind, 'syntactical');
			}
			model.dispose();
		});

		test('single character insert - identifier', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.insert(5, 'a');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			const props = result.edits[0].properties as InsertProperties;
			if (props.textShape.kind === 'singleLine') {
				assert.strictEqual(props.textShape.isSingleCharacter, true);
				assert.strictEqual(props.textShape.singleCharacterKind, 'identifier');
			}
			model.dispose();
		});

		test('single character insert - whitespace', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.insert(5, ' ');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			const props = result.edits[0].properties as InsertProperties;
			if (props.textShape.kind === 'singleLine') {
				assert.strictEqual(props.textShape.isSingleCharacter, true);
				assert.strictEqual(props.textShape.singleCharacterKind, 'whitespace');
			}
			model.dispose();
		});

		test('word insert', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.insert(5, 'foo');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			const props = result.edits[0].properties as InsertProperties;
			if (props.textShape.kind === 'singleLine') {
				assert.strictEqual(props.textShape.isWord, true);
				assert.strictEqual(props.textShape.isMultipleWords, false);
			}
			model.dispose();
		});

		test('multiple words insert', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.insert(5, 'foo bar baz');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			const props = result.edits[0].properties as InsertProperties;
			if (props.textShape.kind === 'singleLine') {
				assert.strictEqual(props.textShape.isMultipleWords, true);
			}
			model.dispose();
		});

		test('multi-line insert', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.insert(5, 'line1\nline2\nline3');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			assert.strictEqual(result.edits[0].charactersInserted, 17);
			assert.strictEqual(result.edits[0].charactersDeleted, 0);
			assert.strictEqual(result.edits[0].linesInserted, 2);
			assert.strictEqual(result.edits[0].linesDeleted, 0);
			const props = result.edits[0].properties as InsertProperties;
			assert.strictEqual(props.textShape.kind, 'multiLine');
			if (props.textShape.kind === 'multiLine') {
				assert.strictEqual(props.textShape.lineCount, 3);
			}
			model.dispose();
		});

		test('insert at end of line', () => {
			const model = createTextModel('hello');
			const edit = StringEdit.insert(5, ' world');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			const props = result.edits[0].properties as InsertProperties;
			assert.strictEqual(props.locationShape, 'endOfLine');
			model.dispose();
		});

		test('insert on empty line', () => {
			const model = createTextModel('hello\n\nworld');
			const edit = StringEdit.insert(6, 'text');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			const props = result.edits[0].properties as InsertProperties;
			assert.strictEqual(props.locationShape, 'emptyLine');
			model.dispose();
		});

		test('insert at start of line', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.insert(0, 'prefix');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			const props = result.edits[0].properties as InsertProperties;
			assert.strictEqual(props.locationShape, 'startOfLine');
			model.dispose();
		});

		test('insert in middle of line', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.insert(5, '_');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			const props = result.edits[0].properties as InsertProperties;
			assert.strictEqual(props.locationShape, 'middleOfLine');
			model.dispose();
		});

		test('insert relative to cursor - at cursor', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.insert(5, 'text');
			const cursor = new Position(1, 6); // column is 1-based
			const result = computeEditKind(edit, model, cursor);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			const props = result.edits[0].properties as InsertProperties;
			assert.ok(props.relativeToCursor);
			assert.strictEqual(props.relativeToCursor.atCursor, true);
			model.dispose();
		});

		test('insert relative to cursor - before cursor on same line', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.insert(2, 'text');
			const cursor = new Position(1, 8);
			const result = computeEditKind(edit, model, cursor);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			const props = result.edits[0].properties as InsertProperties;
			assert.ok(props.relativeToCursor);
			assert.strictEqual(props.relativeToCursor.beforeCursorOnSameLine, true);
			model.dispose();
		});

		test('insert relative to cursor - after cursor on same line', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.insert(8, 'text');
			const cursor = new Position(1, 4);
			const result = computeEditKind(edit, model, cursor);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			const props = result.edits[0].properties as InsertProperties;
			assert.ok(props.relativeToCursor);
			assert.strictEqual(props.relativeToCursor.afterCursorOnSameLine, true);
			model.dispose();
		});

		test('insert relative to cursor - lines above', () => {
			const model = createTextModel('line1\nline2\nline3');
			const edit = StringEdit.insert(0, 'text');
			const cursor = new Position(3, 1);
			const result = computeEditKind(edit, model, cursor);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			const props = result.edits[0].properties as InsertProperties;
			assert.ok(props.relativeToCursor);
			assert.strictEqual(props.relativeToCursor.linesAbove, 2);
			model.dispose();
		});

		test('insert relative to cursor - lines below', () => {
			const model = createTextModel('line1\nline2\nline3');
			const edit = StringEdit.insert(12, 'text'); // after 'line2\n'
			const cursor = new Position(1, 1);
			const result = computeEditKind(edit, model, cursor);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			const props = result.edits[0].properties as InsertProperties;
			assert.ok(props.relativeToCursor);
			assert.strictEqual(props.relativeToCursor.linesBelow, 2);
			model.dispose();
		});

		test('duplicated whitespace insert', () => {
			const model = createTextModel('hello');
			const edit = StringEdit.insert(5, '  ');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'insert');
			const props = result.edits[0].properties as InsertProperties;
			if (props.textShape.kind === 'singleLine') {
				assert.strictEqual(props.textShape.hasDuplicatedWhitespace, true);
			}
			model.dispose();
		});
	});

	suite('Delete operations', () => {
		test('single character delete - identifier', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.delete(new OffsetRange(4, 5)); // delete 'o'
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'delete');
			const props = result.edits[0].properties as DeleteProperties;
			if (props.textShape.kind === 'singleLine') {
				assert.strictEqual(props.textShape.isSingleCharacter, true);
				assert.strictEqual(props.textShape.singleCharacterKind, 'identifier');
			}
			model.dispose();
		});

		test('single character delete - syntactical', () => {
			const model = createTextModel('hello;world');
			const edit = StringEdit.delete(new OffsetRange(5, 6)); // delete ';'
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'delete');
			const props = result.edits[0].properties as DeleteProperties;
			if (props.textShape.kind === 'singleLine') {
				assert.strictEqual(props.textShape.isSingleCharacter, true);
				assert.strictEqual(props.textShape.singleCharacterKind, 'syntactical');
			}
			model.dispose();
		});

		test('word delete', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.delete(new OffsetRange(0, 5)); // delete 'hello'
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'delete');
			assert.strictEqual(result.edits[0].charactersInserted, 0);
			assert.strictEqual(result.edits[0].charactersDeleted, 5);
			assert.strictEqual(result.edits[0].linesInserted, 0);
			assert.strictEqual(result.edits[0].linesDeleted, 0);
			const props = result.edits[0].properties as DeleteProperties;
			if (props.textShape.kind === 'singleLine') {
				assert.strictEqual(props.textShape.isWord, true);
			}
			model.dispose();
		});

		test('multi-line delete', () => {
			const model = createTextModel('line1\nline2\nline3');
			const edit = StringEdit.delete(new OffsetRange(0, 12)); // delete 'line1\nline2\n'
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'delete');
			assert.strictEqual(result.edits[0].charactersInserted, 0);
			assert.strictEqual(result.edits[0].charactersDeleted, 12);
			assert.strictEqual(result.edits[0].linesInserted, 0);
			assert.strictEqual(result.edits[0].linesDeleted, 2);
			const props = result.edits[0].properties as DeleteProperties;
			assert.strictEqual(props.textShape.kind, 'multiLine');
			model.dispose();
		});

		test('delete entire line content', () => {
			const model = createTextModel('hello');
			const edit = StringEdit.delete(new OffsetRange(0, 5));
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'delete');
			const props = result.edits[0].properties as DeleteProperties;
			assert.strictEqual(props.deletesEntireLineContent, true);
			model.dispose();
		});
	});

	suite('Replace operations', () => {
		test('word to word replacement', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.replace(new OffsetRange(0, 5), 'goodbye');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'replace');
			assert.strictEqual(result.edits[0].charactersInserted, 7);
			assert.strictEqual(result.edits[0].charactersDeleted, 5);
			assert.strictEqual(result.edits[0].linesInserted, 0);
			assert.strictEqual(result.edits[0].linesDeleted, 0);
			const props = result.edits[0].properties as ReplaceProperties;
			assert.strictEqual(props.isWordToWordReplacement, true);
			model.dispose();
		});

		test('additive replacement', () => {
			const model = createTextModel('hi world');
			const edit = StringEdit.replace(new OffsetRange(0, 2), 'hello');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'replace');
			assert.strictEqual(result.edits[0].charactersInserted, 5);
			assert.strictEqual(result.edits[0].charactersDeleted, 2);
			const props = result.edits[0].properties as ReplaceProperties;
			assert.strictEqual(props.isAdditive, true);
			assert.strictEqual(props.isSubtractive, false);
			model.dispose();
		});

		test('subtractive replacement', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.replace(new OffsetRange(0, 5), 'hi');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'replace');
			assert.strictEqual(result.edits[0].charactersInserted, 2);
			assert.strictEqual(result.edits[0].charactersDeleted, 5);
			const props = result.edits[0].properties as ReplaceProperties;
			assert.strictEqual(props.isSubtractive, true);
			assert.strictEqual(props.isAdditive, false);
			model.dispose();
		});

		test('single line to multi-line replacement', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.replace(new OffsetRange(0, 5), 'line1\nline2');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'replace');
			assert.strictEqual(result.edits[0].linesInserted, 1);
			assert.strictEqual(result.edits[0].linesDeleted, 0);
			const props = result.edits[0].properties as ReplaceProperties;
			assert.strictEqual(props.isSingleLineToMultiLine, true);
			model.dispose();
		});

		test('multi-line to single line replacement', () => {
			const model = createTextModel('line1\nline2\nline3');
			const edit = StringEdit.replace(new OffsetRange(0, 12), 'hello');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'replace');
			assert.strictEqual(result.edits[0].linesInserted, 0);
			assert.strictEqual(result.edits[0].linesDeleted, 2);
			const props = result.edits[0].properties as ReplaceProperties;
			assert.strictEqual(props.isMultiLineToSingleLine, true);
			model.dispose();
		});

		test('single line to single line replacement', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.replace(new OffsetRange(0, 5), 'goodbye');
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 1);
			assert.strictEqual(result.edits[0].operation, 'replace');
			const props = result.edits[0].properties as ReplaceProperties;
			assert.strictEqual(props.isSingleLineToSingleLine, true);
			model.dispose();
		});
	});

	suite('Empty edit', () => {
		test('empty edit returns undefined', () => {
			const model = createTextModel('hello world');
			const edit = StringEdit.empty;
			const result = computeEditKind(edit, model);

			assert.strictEqual(result, undefined);
			model.dispose();
		});
	});

	suite('Multiple replacements', () => {
		test('multiple inserts', () => {
			const model = createTextModel('hello world');
			const edit = new StringEdit([
				StringEdit.insert(0, 'A').replacements[0],
				StringEdit.insert(5, 'B').replacements[0],
			]);
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 2);
			assert.strictEqual(result.edits[0].operation, 'insert');
			assert.strictEqual(result.edits[1].operation, 'insert');
			model.dispose();
		});

		test('mixed operations', () => {
			const model = createTextModel('hello world');
			const edit = new StringEdit([
				StringEdit.insert(0, 'prefix').replacements[0],
				StringEdit.delete(new OffsetRange(5, 6)).replacements[0],
			]);
			const result = computeEditKind(edit, model);

			assert.ok(result);
			assert.strictEqual(result.edits.length, 2);
			assert.strictEqual(result.edits[0].operation, 'insert');
			assert.strictEqual(result.edits[1].operation, 'delete');
			model.dispose();
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/test/browser/getSecondaryEdits.test.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/test/browser/getSecondaryEdits.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { Position } from '../../../../common/core/position.js';
import { getSecondaryEdits } from '../../browser/model/inlineCompletionsModel.js';
import { TextEdit, TextReplacement } from '../../../../common/core/edits/textEdit.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { Range } from '../../../../common/core/range.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { isDefined } from '../../../../../base/common/types.js';

suite('getSecondaryEdits', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('basic', async function () {

		const textModel = createTextModel([
			'function fib(',
			'function fib('
		].join('\n'));
		const positions = [
			new Position(1, 14),
			new Position(2, 14)
		];
		const primaryEdit = new TextReplacement(new Range(1, 1, 1, 14), 'function fib() {');
		const secondaryEdits = getSecondaryEdits(textModel, positions, primaryEdit);
		assert.deepStrictEqual(secondaryEdits, [new TextReplacement(
			new Range(2, 14, 2, 14),
			') {'
		)]);
		textModel.dispose();
	});

	test('cursor not on same line as primary edit 1', async function () {

		const textModel = createTextModel([
			'function fib(',
			'',
			'function fib(',
			''
		].join('\n'));
		const positions = [
			new Position(2, 1),
			new Position(4, 1)
		];
		const primaryEdit = new TextReplacement(new Range(1, 1, 2, 1), [
			'function fib() {',
			'	return 0;',
			'}'
		].join('\n'));
		const secondaryEdits = getSecondaryEdits(textModel, positions, primaryEdit);
		assert.deepStrictEqual(TextEdit.fromParallelReplacementsUnsorted(secondaryEdits.filter(isDefined)).toString(textModel.getValue()), '...ction fib(❰\n↦) {\n\t... 0;\n}❱');
		textModel.dispose();
	});

	test('cursor not on same line as primary edit 2', async function () {

		const textModel = createTextModel([
			'class A {',
			'',
			'class B {',
			'',
			'function f() {}'
		].join('\n'));
		const positions = [
			new Position(2, 1),
			new Position(4, 1)
		];
		const primaryEdit = new TextReplacement(new Range(1, 1, 2, 1), [
			'class A {',
			'	public x: number = 0;',
			'   public y: number = 0;',
			'}'
		].join('\n'));
		const secondaryEdits = getSecondaryEdits(textModel, positions, primaryEdit);
		assert.deepStrictEqual(secondaryEdits, [new TextReplacement(
			new Range(4, 1, 4, 1), [
				'	public x: number = 0;',
				'   public y: number = 0;',
				'}'
			].join('\n')
		)]);
		textModel.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/test/browser/graph.test.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/test/browser/graph.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { DirectedGraph } from '../../browser/model/graph.js';

suite('DirectedGraph', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('from - creates empty graph', () => {
		const graph = DirectedGraph.from<string>([], () => []);
		assert.deepStrictEqual(graph.getOutgoing('a'), []);
	});

	test('from - creates graph with single node', () => {
		const graph = DirectedGraph.from(['a'], () => []);
		assert.deepStrictEqual(graph.getOutgoing('a'), []);
	});

	test('from - creates graph with nodes and edges', () => {
		const nodes = ['a', 'b', 'c'];
		const getOutgoing = (node: string) => {
			switch (node) {
				case 'a':
					return ['b', 'c'];
				case 'b':
					return ['c'];
				case 'c':
					return [];
				default:
					return [];
			}
		};

		const graph = DirectedGraph.from(nodes, getOutgoing);

		assert.deepStrictEqual([...graph.getOutgoing('a')].sort(), ['b', 'c']);
		assert.deepStrictEqual(graph.getOutgoing('b'), ['c']);
		assert.deepStrictEqual(graph.getOutgoing('c'), []);
	});

	test('from - handles duplicate edges', () => {
		const nodes = ['a', 'b'];
		const getOutgoing = (node: string) => {
			switch (node) {
				case 'a':
					return ['b', 'b']; // Duplicate edge
				case 'b':
					return [];
				default:
					return [];
			}
		};

		const graph = DirectedGraph.from(nodes, getOutgoing);

		assert.deepStrictEqual(graph.getOutgoing('a'), ['b']);
		assert.deepStrictEqual(graph.getOutgoing('b'), []);
	});

	test('removeCycles - no cycles', () => {
		const nodes = ['a', 'b', 'c'];
		const getOutgoing = (node: string) => {
			switch (node) {
				case 'a':
					return ['b'];
				case 'b':
					return ['c'];
				case 'c':
					return [];
				default:
					return [];
			}
		};

		const graph = DirectedGraph.from(nodes, getOutgoing);
		const result = graph.removeCycles();

		assert.deepStrictEqual(result.foundCycles, []);
		assert.deepStrictEqual(graph.getOutgoing('a'), ['b']);
		assert.deepStrictEqual(graph.getOutgoing('b'), ['c']);
		assert.deepStrictEqual(graph.getOutgoing('c'), []);
	});

	test('removeCycles - simple cycle', () => {
		const nodes = ['a', 'b'];
		const getOutgoing = (node: string) => {
			switch (node) {
				case 'a':
					return ['b'];
				case 'b':
					return ['a']; // Creates cycle
				default:
					return [];
			}
		};

		const graph = DirectedGraph.from(nodes, getOutgoing);
		const result = graph.removeCycles();

		assert.strictEqual(result.foundCycles.length, 1);
		assert.ok(
			result.foundCycles.includes('a') || result.foundCycles.includes('b')
		);

		// After removing cycles, one of the edges should be removed
		const aOutgoing = graph.getOutgoing('a');
		const bOutgoing = graph.getOutgoing('b');
		assert.ok(
			(aOutgoing.length === 0 && bOutgoing.length === 1) ||
			(aOutgoing.length === 1 && bOutgoing.length === 0)
		);
	});

	test('removeCycles - self loop', () => {
		const nodes = ['a'];
		const getOutgoing = (node: string) => {
			switch (node) {
				case 'a':
					return ['a']; // Self loop
				default:
					return [];
			}
		};

		const graph = DirectedGraph.from(nodes, getOutgoing);
		const result = graph.removeCycles();

		assert.deepStrictEqual(result.foundCycles, ['a']);
		assert.deepStrictEqual(graph.getOutgoing('a'), []);
	});

	test('removeCycles - complex cycle', () => {
		const nodes = ['a', 'b', 'c', 'd'];
		const getOutgoing = (node: string) => {
			switch (node) {
				case 'a':
					return ['b'];
				case 'b':
					return ['c'];
				case 'c':
					return ['d', 'a']; // Creates cycle back to 'a'
				case 'd':
					return [];
				default:
					return [];
			}
		};

		const graph = DirectedGraph.from(nodes, getOutgoing);
		const result = graph.removeCycles();

		assert.ok(result.foundCycles.length >= 1);

		// After removing cycles, there should be no path back to 'a' from 'c'
		const cOutgoing = graph.getOutgoing('c');
		assert.ok(!cOutgoing.includes('a'));
	});

	test('removeCycles - multiple disconnected cycles', () => {
		const nodes = ['a', 'b', 'c', 'd'];
		const getOutgoing = (node: string) => {
			switch (node) {
				case 'a':
					return ['b'];
				case 'b':
					return ['a']; // Cycle 1: a <-> b
				case 'c':
					return ['d'];
				case 'd':
					return ['c']; // Cycle 2: c <-> d
				default:
					return [];
			}
		};

		const graph = DirectedGraph.from(nodes, getOutgoing);
		const result = graph.removeCycles();

		assert.ok(result.foundCycles.length >= 2);

		// After removing cycles, each pair should have only one direction
		const aOutgoing = graph.getOutgoing('a');
		const bOutgoing = graph.getOutgoing('b');
		const cOutgoing = graph.getOutgoing('c');
		const dOutgoing = graph.getOutgoing('d');

		assert.ok(
			(aOutgoing.length === 0 && bOutgoing.length === 1) ||
			(aOutgoing.length === 1 && bOutgoing.length === 0)
		);
		assert.ok(
			(cOutgoing.length === 0 && dOutgoing.length === 1) ||
			(cOutgoing.length === 1 && dOutgoing.length === 0)
		);
	});

	test('getOutgoing - non-existent node', () => {
		const graph = DirectedGraph.from(['a'], () => []);
		assert.deepStrictEqual(graph.getOutgoing('b'), []);
	});

	test('with number nodes', () => {
		const nodes = [1, 2, 3];
		const getOutgoing = (node: number) => {
			switch (node) {
				case 1:
					return [2, 3];
				case 2:
					return [3];
				case 3:
					return [];
				default:
					return [];
			}
		};

		const graph = DirectedGraph.from(nodes, getOutgoing);

		assert.deepStrictEqual([...graph.getOutgoing(1)].sort(), [2, 3]);
		assert.deepStrictEqual(graph.getOutgoing(2), [3]);
		assert.deepStrictEqual(graph.getOutgoing(3), []);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/test/browser/inlineCompletions.test.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/test/browser/inlineCompletions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../../../../base/common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../common/core/range.js';
import { InlineCompletionsModel } from '../../browser/model/inlineCompletionsModel.js';
import { IWithAsyncTestCodeEditorAndInlineCompletionsModel, MockInlineCompletionsProvider, withAsyncTestCodeEditorAndInlineCompletionsModel } from './utils.js';
import { ITestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { Selection } from '../../../../common/core/selection.js';

suite('Inline Completions', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('Does not trigger automatically if disabled', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider, inlineSuggest: { enabled: false } },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('foo');
				await timeout(1000);

				// Provider is not called, no ghost text is shown.
				assert.deepStrictEqual(provider.getAndClearCallHistory(), []);
				assert.deepStrictEqual(context.getAndClearViewStates(), ['']);
			}
		);
	});

	test('Ghost text is shown after trigger', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('foo');
				provider.setReturnValue({ insertText: 'foobar', range: new Range(1, 1, 1, 4) });
				model.triggerExplicitly();
				await timeout(1000);

				assert.deepStrictEqual(provider.getAndClearCallHistory(), [
					{ position: '(1,4)', text: 'foo', triggerKind: 1, }
				]);
				assert.deepStrictEqual(context.getAndClearViewStates(), ['', 'foo[bar]']);
			}
		);
	});

	test('Ghost text is shown automatically when configured', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider, inlineSuggest: { enabled: true } },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('foo');

				provider.setReturnValue({ insertText: 'foobar', range: new Range(1, 1, 1, 4) });
				await timeout(1000);

				assert.deepStrictEqual(provider.getAndClearCallHistory(), [
					{ position: '(1,4)', text: 'foo', triggerKind: 0, }
				]);
				assert.deepStrictEqual(context.getAndClearViewStates(), ['', 'foo[bar]']);
			}
		);
	});

	test('Ghost text is updated automatically', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider },
			async ({ editor, editorViewModel, model, context }) => {
				provider.setReturnValue({ insertText: 'foobar', range: new Range(1, 1, 1, 4) });
				context.keyboardType('foo');
				model.triggerExplicitly();
				await timeout(1000);

				provider.setReturnValue({ insertText: 'foobizz', range: new Range(1, 1, 1, 6) });
				context.keyboardType('b');
				context.keyboardType('i');
				await timeout(1000);

				assert.deepStrictEqual(provider.getAndClearCallHistory(), [
					{ position: '(1,4)', text: 'foo', triggerKind: 1, },
					{ position: '(1,6)', text: 'foobi', triggerKind: 0, }
				]);
				assert.deepStrictEqual(
					context.getAndClearViewStates(),
					['', 'foo[bar]', 'foob[ar]', 'foobi', 'foobi[zz]']
				);
			}
		);
	});

	test('Unindent whitespace', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('  ');
				provider.setReturnValue({ insertText: 'foo', range: new Range(1, 2, 1, 3) });
				model.triggerExplicitly();
				await timeout(1000);

				assert.deepStrictEqual(context.getAndClearViewStates(), ['', '  [foo]']);

				model.accept(editor);

				assert.deepStrictEqual(provider.getAndClearCallHistory(), [
					{ position: '(1,3)', text: '  ', triggerKind: 1, },
				]);

				assert.deepStrictEqual(context.getAndClearViewStates(), [' foo']);
			}
		);
	});

	test('Unindent tab', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('\t\t');
				provider.setReturnValue({ insertText: 'foo', range: new Range(1, 2, 1, 3) });
				model.triggerExplicitly();
				await timeout(1000);

				assert.deepStrictEqual(context.getAndClearViewStates(), ['', '\t\t[foo]']);

				model.accept(editor);

				assert.deepStrictEqual(provider.getAndClearCallHistory(), [
					{ position: '(1,3)', text: '\t\t', triggerKind: 1, },
				]);

				assert.deepStrictEqual(context.getAndClearViewStates(), ['\tfoo']);
			}
		);
	});

	test('No unindent after indentation', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('buzz  ');
				provider.setReturnValue({ insertText: 'foo', range: new Range(1, 6, 1, 7) });
				model.triggerExplicitly();
				await timeout(1000);

				assert.deepStrictEqual(context.getAndClearViewStates(), ['']);

				model.accept(editor);

				assert.deepStrictEqual(provider.getAndClearCallHistory(), [
					{ position: '(1,7)', text: 'buzz  ', triggerKind: 1, },
				]);

				assert.deepStrictEqual(context.getAndClearViewStates(), []);
			}
		);
	});

	test('Next/previous', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('foo');
				provider.setReturnValue({ insertText: 'foobar1', range: new Range(1, 1, 1, 4) });
				model.trigger();
				await timeout(1000);

				assert.deepStrictEqual(
					context.getAndClearViewStates(),
					['', 'foo[bar1]']
				);

				provider.setReturnValues([
					{ insertText: 'foobar1', range: new Range(1, 1, 1, 4) },
					{ insertText: 'foobizz2', range: new Range(1, 1, 1, 4) },
					{ insertText: 'foobuzz3', range: new Range(1, 1, 1, 4) }
				]);

				model.next();
				await timeout(1000);
				assert.deepStrictEqual(context.getAndClearViewStates(), ['foo[bizz2]']);

				model.next();
				await timeout(1000);
				assert.deepStrictEqual(context.getAndClearViewStates(), ['foo[buzz3]']);

				model.next();
				await timeout(1000);
				assert.deepStrictEqual(context.getAndClearViewStates(), ['foo[bar1]']);

				model.previous();
				await timeout(1000);
				assert.deepStrictEqual(context.getAndClearViewStates(), ['foo[buzz3]']);

				model.previous();
				await timeout(1000);
				assert.deepStrictEqual(context.getAndClearViewStates(), ['foo[bizz2]']);

				model.previous();
				await timeout(1000);
				assert.deepStrictEqual(context.getAndClearViewStates(), ['foo[bar1]']);

				assert.deepStrictEqual(provider.getAndClearCallHistory(), [
					{ position: '(1,4)', text: 'foo', triggerKind: 0, },
					{ position: '(1,4)', text: 'foo', triggerKind: 1, },
				]);
			}
		);
	});

	test('Calling the provider is debounced', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider },
			async ({ editor, editorViewModel, model, context }) => {
				model.trigger();

				context.keyboardType('f');
				await timeout(40);
				context.keyboardType('o');
				await timeout(40);
				context.keyboardType('o');
				await timeout(40);

				// The provider is not called
				assert.deepStrictEqual(provider.getAndClearCallHistory(), []);

				await timeout(400);
				assert.deepStrictEqual(provider.getAndClearCallHistory(), [
					{ position: '(1,4)', text: 'foo', triggerKind: 0, }
				]);

				provider.assertNotCalledTwiceWithin50ms();
			}
		);
	});

	test('Backspace is debounced', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider, inlineSuggest: { enabled: true } },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('foo');

				provider.setReturnValue({ insertText: 'foobar', range: new Range(1, 1, 1, 4) });
				await timeout(1000);

				for (let j = 0; j < 2; j++) {
					for (let i = 0; i < 3; i++) {
						context.leftDelete();
						await timeout(5);
					}

					context.keyboardType('bar');
				}

				await timeout(400);

				provider.assertNotCalledTwiceWithin50ms();
			}
		);
	});


	suite('Forward Stability', () => {
		test('Typing agrees', async function () {
			// The user types the text as suggested and the provider is forward-stable
			const provider = new MockInlineCompletionsProvider();
			await withAsyncTestCodeEditorAndInlineCompletionsModel('',
				{ fakeClock: true, provider },
				async ({ editor, editorViewModel, model, context }) => {
					provider.setReturnValue({ insertText: 'foobar', });
					context.keyboardType('foo');
					model.trigger();
					await timeout(1000);
					assert.deepStrictEqual(provider.getAndClearCallHistory(), [
						{ position: '(1,4)', text: 'foo', triggerKind: 0, }
					]);
					assert.deepStrictEqual(context.getAndClearViewStates(), ['', 'foo[bar]']);

					context.keyboardType('b');
					assert.deepStrictEqual(context.getAndClearViewStates(), (['foob[ar]']));
					await timeout(1000);
					assert.deepStrictEqual(provider.getAndClearCallHistory(), [
						{ position: '(1,5)', text: 'foob', triggerKind: 0, }
					]);
					assert.deepStrictEqual(context.getAndClearViewStates(), []);

					context.keyboardType('a');
					assert.deepStrictEqual(context.getAndClearViewStates(), (['fooba[r]']));
					await timeout(1000);
					assert.deepStrictEqual(provider.getAndClearCallHistory(), [
						{ position: '(1,6)', text: 'fooba', triggerKind: 0, }
					]);
					assert.deepStrictEqual(context.getAndClearViewStates(), []);
				}
			);
		});

		async function setupScenario({ editor, editorViewModel, model, context, store }: IWithAsyncTestCodeEditorAndInlineCompletionsModel, provider: MockInlineCompletionsProvider): Promise<void> {
			assert.deepStrictEqual(context.getAndClearViewStates(), ['']);
			provider.setReturnValue({ insertText: 'foo bar' });
			context.keyboardType('f');
			model.triggerExplicitly();
			await timeout(10000);
			assert.deepStrictEqual(provider.getAndClearCallHistory(), ([{ position: '(1,2)', triggerKind: 1, text: 'f' }]));
			assert.deepStrictEqual(context.getAndClearViewStates(), (['f[oo bar]']));

			provider.setReturnValue({ insertText: 'foo baz' });
			await timeout(10000);
		}

		test('Support forward instability', async function () {
			// The user types the text as suggested and the provider reports a different suggestion.
			const provider = new MockInlineCompletionsProvider();
			await withAsyncTestCodeEditorAndInlineCompletionsModel('',
				{ fakeClock: true, provider },
				async (ctx) => {
					await setupScenario(ctx, provider);

					ctx.context.keyboardType('o');
					assert.deepStrictEqual(ctx.context.getAndClearViewStates(), ['fo[o bar]']);
					await timeout(10000);

					assert.deepStrictEqual(provider.getAndClearCallHistory(), [
						{ position: '(1,3)', text: 'fo', triggerKind: 0, }
					]);
					assert.deepStrictEqual(ctx.context.getAndClearViewStates(), ['fo[o baz]']);
				}
			);
		});


		test('when accepting word by word', async function () {
			// The user types the text as suggested and the provider reports a different suggestion.
			// Even when triggering explicitly, we want to keep the suggestion.

			const provider = new MockInlineCompletionsProvider();
			await withAsyncTestCodeEditorAndInlineCompletionsModel('',
				{ fakeClock: true, provider },
				async (ctx) => {
					await setupScenario(ctx, provider);

					await ctx.model.acceptNextWord();
					assert.deepStrictEqual(ctx.context.getAndClearViewStates(), (['foo[ bar]']));

					await timeout(10000);
					assert.deepStrictEqual(provider.getAndClearCallHistory(), ([{ position: '(1,4)', triggerKind: 0, text: 'foo' }]));
					assert.deepStrictEqual(ctx.context.getAndClearViewStates(), ([]));

					await ctx.model.triggerExplicitly(); // reset to provider truth
					await timeout(10000);
					assert.deepStrictEqual(ctx.context.getAndClearViewStates(), ([]));
				}
			);
		});

		test('when accepting undo', async function () {
			// The user types the text as suggested and the provider reports a different suggestion.

			const provider = new MockInlineCompletionsProvider();
			await withAsyncTestCodeEditorAndInlineCompletionsModel('',
				{ fakeClock: true, provider },
				async (ctx) => {
					await setupScenario(ctx, provider);

					await ctx.model.acceptNextWord();
					assert.deepStrictEqual(ctx.context.getAndClearViewStates(), (['foo[ bar]']));

					await timeout(10000);
					assert.deepStrictEqual(ctx.context.getAndClearViewStates(), ([]));
					assert.deepStrictEqual(provider.getAndClearCallHistory(), ([{ position: '(1,4)', triggerKind: 0, text: 'foo' }]));

					await ctx.editor.getModel().undo();
					await timeout(10000);
					assert.deepStrictEqual(ctx.context.getAndClearViewStates(), (['f[oo bar]']));
					assert.deepStrictEqual(provider.getAndClearCallHistory(), ([{ position: '(1,2)', triggerKind: 0, text: 'f' }]));

					await ctx.editor.getModel().redo();
					await timeout(10000);
					assert.deepStrictEqual(ctx.context.getAndClearViewStates(), (['foo[ bar]']));
					assert.deepStrictEqual(provider.getAndClearCallHistory(), ([{ position: '(1,4)', triggerKind: 0, text: 'foo' }]));
				}
			);
		});

		test('Support backward instability', async function () {
			// The user deletes text and the suggestion changes
			const provider = new MockInlineCompletionsProvider();
			await withAsyncTestCodeEditorAndInlineCompletionsModel('',
				{ fakeClock: true, provider },
				async ({ editor, editorViewModel, model, context }) => {
					context.keyboardType('fooba');

					provider.setReturnValue({ insertText: 'foobar', range: new Range(1, 1, 1, 6) });

					model.triggerExplicitly();
					await timeout(1000);
					assert.deepStrictEqual(provider.getAndClearCallHistory(), [
						{ position: '(1,6)', text: 'fooba', triggerKind: 1, }
					]);
					assert.deepStrictEqual(context.getAndClearViewStates(), ['', 'fooba[r]']);

					provider.setReturnValue({ insertText: 'foobaz', range: new Range(1, 1, 1, 5) });
					context.leftDelete();
					await timeout(1000);
					assert.deepStrictEqual(provider.getAndClearCallHistory(), [
						{ position: '(1,5)', text: 'foob', triggerKind: 0, }
					]);
					assert.deepStrictEqual(context.getAndClearViewStates(), [
						'foob[ar]',
						'foob[az]'
					]);
				}
			);
		});

		test('Push item to preserve to front', async function () {
			const provider = new MockInlineCompletionsProvider(true);
			await withAsyncTestCodeEditorAndInlineCompletionsModel('',
				{ fakeClock: true, provider },
				async ({ editor, editorViewModel, model, context }) => {
					provider.setReturnValue({ insertText: 'foobar', range: new Range(1, 1, 1, 4) });
					context.keyboardType('foo');
					await timeout(1000);

					assert.deepStrictEqual(provider.getAndClearCallHistory(), ([
						{
							position: '(1,4)',
							triggerKind: 0,
							text: 'foo'
						}
					]));
					assert.deepStrictEqual(context.getAndClearViewStates(),
						([
							'',
							'foo[bar]'
						])
					);

					provider.setReturnValues([{ insertText: 'foobar1', range: new Range(1, 1, 1, 4) }, { insertText: 'foobar', range: new Range(1, 1, 1, 4) }]);

					await model.triggerExplicitly();
					await timeout(1000);

					assert.deepStrictEqual(provider.getAndClearCallHistory(), ([
						{
							position: '(1,4)',
							triggerKind: 1,
							text: 'foo'
						}
					]));
					assert.deepStrictEqual(context.getAndClearViewStates(),
						([])
					);
				}
			);
		});
	});

	test('No race conditions', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider, },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('h');
				provider.setReturnValue({ insertText: 'helloworld', range: new Range(1, 1, 1, 2) }, 1000);

				model.triggerExplicitly();

				await timeout(1030);
				context.keyboardType('ello');
				provider.setReturnValue({ insertText: 'helloworld', range: new Range(1, 1, 1, 6) }, 1000);

				// after 20ms: Inline completion provider answers back
				// after 50ms: Debounce is triggered
				await timeout(2000);

				assert.deepStrictEqual(context.getAndClearViewStates(), [
					'',
					'hello[world]',
				]);
			});
	});

	test('Do not reuse cache from previous session (#132516)', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider, inlineSuggest: { enabled: true } },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('hello\n');
				context.cursorLeft();
				context.keyboardType('x');
				context.leftDelete();
				provider.setReturnValue({ insertText: 'helloworld', range: new Range(1, 1, 1, 6) }, 1000);
				await timeout(2000);

				assert.deepStrictEqual(provider.getAndClearCallHistory(), [
					{
						position: '(1,6)',
						text: 'hello\n',
						triggerKind: 0,
					}
				]);

				provider.setReturnValue({ insertText: 'helloworld', range: new Range(2, 1, 2, 6) }, 1000);

				context.cursorDown();
				context.keyboardType('hello');
				await timeout(40);

				assert.deepStrictEqual(provider.getAndClearCallHistory(), []);

				// Update ghost text
				context.keyboardType('w');
				context.leftDelete();

				await timeout(2000);

				assert.deepStrictEqual(provider.getAndClearCallHistory(), [
					{ position: '(2,6)', triggerKind: 0, text: 'hello\nhello' },
				]);

				assert.deepStrictEqual(context.getAndClearViewStates(), [
					'',
					'hello[world]\n',
					'hello\n',
					'hello\nhello[world]',
				]);
			});
	});

	test('Additional Text Edits', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('buzz\nbaz');
				provider.setReturnValue({
					insertText: 'bazz',
					range: new Range(2, 1, 2, 4),
					additionalTextEdits: [{
						range: new Range(1, 1, 1, 5),
						text: 'bla'
					}],
				});
				model.triggerExplicitly();
				await timeout(1000);

				model.accept(editor);

				assert.deepStrictEqual(provider.getAndClearCallHistory(), ([{ position: '(2,4)', triggerKind: 1, text: 'buzz\nbaz' }]));

				assert.deepStrictEqual(context.getAndClearViewStates(), [
					'',
					'buzz\nbaz[z]',
					'bla\nbazz',
				]);
			}
		);
	});
});

suite('Multi Cursor Support', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('Basic', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('console\nconsole\n');
				editor.setSelections([
					new Selection(1, 1000, 1, 1000),
					new Selection(2, 1000, 2, 1000),
				]);
				provider.setReturnValue({
					insertText: 'console.log("hello");',
					range: new Range(1, 1, 1, 1000),
				});
				model.triggerExplicitly();
				await timeout(1000);
				model.accept(editor);
				assert.deepStrictEqual(
					editor.getValue(),
					[
						`console.log("hello");`,
						`console.log("hello");`,
						``
					].join('\n')
				);
			}
		);
	});

	test('Multi Part', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('console.log()\nconsole.log\n');
				editor.setSelections([
					new Selection(1, 12, 1, 12),
					new Selection(2, 1000, 2, 1000),
				]);
				provider.setReturnValue({
					insertText: 'console.log("hello");',
					range: new Range(1, 1, 1, 1000),
				});
				model.triggerExplicitly();
				await timeout(1000);
				model.accept(editor);
				assert.deepStrictEqual(
					editor.getValue(),
					[
						`console.log("hello");`,
						`console.log`,
						``
					].join('\n')
				);
			}
		);
	});

	test('Multi Part and Different Cursor Columns', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('console.log()\nconsole.warn\n');
				editor.setSelections([
					new Selection(1, 12, 1, 12),
					new Selection(2, 14, 2, 14),
				]);
				provider.setReturnValue({
					insertText: 'console.log("hello");',
					range: new Range(1, 1, 1, 1000),
				});
				model.triggerExplicitly();
				await timeout(1000);
				model.accept(editor);
				assert.deepStrictEqual(
					editor.getValue(),
					[
						`console.log("hello");`,
						`console.warn`,
						``
					].join('\n')
				);
			}
		);
	});

	async function acceptNextWord(model: InlineCompletionsModel, editor: ITestCodeEditor, timesToAccept: number = 1): Promise<void> {
		for (let i = 0; i < timesToAccept; i++) {
			model.triggerExplicitly();
			await timeout(1000);
			await model.acceptNextWord();
		}
	}

	test('Basic Partial Completion', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('let\nlet\n');
				editor.setSelections([
					new Selection(1, 1000, 1, 1000),
					new Selection(2, 1000, 2, 1000),
				]);

				provider.setReturnValue({
					insertText: `let a = 'some word'; `,
					range: new Range(1, 1, 1, 1000),
				});

				await acceptNextWord(model, editor, 2);

				assert.deepStrictEqual(
					editor.getValue(),
					[
						`let a`,
						`let a`,
						``
					].join('\n')
				);
			}
		);
	});

	test('Partial Multi-Part Completion', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType('for ()\nfor \n');
				editor.setSelections([
					new Selection(1, 5, 1, 5),
					new Selection(2, 1000, 2, 1000),
				]);

				provider.setReturnValue({
					insertText: `for (let i = 0; i < 10; i++) {`,
					range: new Range(1, 1, 1, 1000),
				});

				model.triggerExplicitly();
				await timeout(1000);

				await acceptNextWord(model, editor, 3);

				assert.deepStrictEqual(
					editor.getValue(),
					[
						`for (let i)`,
						`for `,
						``
					].join('\n')
				);
			}
		);
	});

	test('Partial Mutli-Part and Different Cursor Columns Completion', async function () {
		const provider = new MockInlineCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider },
			async ({ editor, editorViewModel, model, context }) => {
				context.keyboardType(`console.log()\nconsole.warnnnn\n`);
				editor.setSelections([
					new Selection(1, 12, 1, 12),
					new Selection(2, 16, 2, 16),
				]);

				provider.setReturnValue({
					insertText: `console.log("hello" + " " + "world");`,
					range: new Range(1, 1, 1, 1000),
				});

				model.triggerExplicitly();
				await timeout(1000);

				await acceptNextWord(model, editor, 4);

				assert.deepStrictEqual(
					editor.getValue(),
					[
						`console.log("hello" + )`,
						`console.warnnnn`,
						``
					].join('\n')
				);
			}
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/test/browser/inlineEdits.test.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/test/browser/inlineEdits.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../../../../base/common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { AnnotatedText, InlineEditContext, IWithAsyncTestCodeEditorAndInlineCompletionsModel, MockSearchReplaceCompletionsProvider, withAsyncTestCodeEditorAndInlineCompletionsModel } from './utils.js';

suite('Inline Edits', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	const val = new AnnotatedText(`
class Point {
	constructor(public x: number, public y: number) {}

	getLength2D(): number {
		return↓ Math.sqrt(this.x * this.x + this.y * this.y↓);
	}

	getJson(): string {
		return ↓Ü;
	}
}
`);

	async function runTest(cb: (ctx: IWithAsyncTestCodeEditorAndInlineCompletionsModel, provider: MockSearchReplaceCompletionsProvider, view: InlineEditContext) => Promise<void>): Promise<void> {
		const provider = new MockSearchReplaceCompletionsProvider();
		await withAsyncTestCodeEditorAndInlineCompletionsModel(val.value,
			{ fakeClock: true, provider, inlineSuggest: { enabled: true } },
			async (ctx) => {
				const view = new InlineEditContext(ctx.model, ctx.editor);
				ctx.store.add(view);
				await cb(ctx, provider, view);
			}
		);
	}

	test('Can Accept Inline Edit', async function () {
		await runTest(async ({ context, model, editor, editorViewModel }, provider, view) => {
			provider.add(`getLength2D(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}`, `getLength3D(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}`);

			await model.trigger();
			await timeout(10000);
			assert.deepStrictEqual(view.getAndClearViewStates(), ([
				undefined,
				'\n\tget❰Length2↦Length3❱D(): numbe...\n...y * this.y❰ + th...his.z❱);\n'
			]));

			model.accept();

			assert.deepStrictEqual(editor.getValue(), `
class Point {
	constructor(public x: number, public y: number) {}

	getLength3D(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	getJson(): string {
		return Ü;
	}
}
`);
		});
	});

	test('Can Type Inline Edit', async function () {
		await runTest(async ({ context, model, editor, editorViewModel }, provider, view) => {
			provider.add(`getLength2D(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}`, `getLength3D(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}`);
			await model.trigger();
			await timeout(10000);
			assert.deepStrictEqual(view.getAndClearViewStates(), ([
				undefined,
				'\n\tget❰Length2↦Length3❱D(): numbe...\n...y * this.y❰ + th...his.z❱);\n'
			]));

			editor.setPosition(val.getMarkerPosition(1));
			editorViewModel.type(' + t');

			assert.deepStrictEqual(view.getAndClearViewStates(), ([
				'\n\tget❰Length2↦Length3❱D(): numbe...\n...this.y + t❰his.z...his.z❱);\n'
			]));

			editorViewModel.type('his.z * this.z');
			assert.deepStrictEqual(view.getAndClearViewStates(), ([
				'\n\tget❰Length2↦Length3❱D(): numbe...'
			]));
		});
	});

	test('Inline Edit Is Correctly Shifted When Typing', async function () {
		await runTest(async ({ context, model, editor, editorViewModel }, provider, view) => {
			provider.add('Ü', '{x: this.x, y: this.y}');
			await model.trigger();
			await timeout(10000);
			assert.deepStrictEqual(view.getAndClearViewStates(), ([
				undefined,
				'...\n\t\treturn ❰Ü↦{x: t...is.y}❱;\n'
			]));
			editor.setPosition(val.getMarkerPosition(2));
			editorViewModel.type('{');

			assert.deepStrictEqual(view.getAndClearViewStates(), ([
				'...\t\treturn {❰Ü↦x: th...is.y}❱;\n'
			]));
		});
	});

	test('Inline Edit Stays On Unrelated Edit', async function () {
		await runTest(async ({ context, model, editor, editorViewModel }, provider, view) => {
			provider.add(`getLength2D(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}`, `getLength3D(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}`);
			await model.trigger();
			await timeout(10000);
			assert.deepStrictEqual(view.getAndClearViewStates(), ([
				undefined,
				'\n\tget❰Length2↦Length3❱D(): numbe...\n...y * this.y❰ + th...his.z❱);\n'
			]));

			editor.setPosition(val.getMarkerPosition(0));
			editorViewModel.type('/* */');

			assert.deepStrictEqual(view.getAndClearViewStates(), ([
				'\n\tget❰Length2↦Length3❱D(): numbe...\n...y * this.y❰ + th...his.z❱);\n'
			]));

			await timeout(10000);
			assert.deepStrictEqual(view.getAndClearViewStates(), ([
				undefined
			]));
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/test/browser/layout.test.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/test/browser/layout.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Size2D } from '../../../../common/core/2d/size.js';
import { OffsetRange } from '../../../../common/core/ranges/offsetRange.js';
import { getMaxTowerHeightInAvailableArea } from '../../browser/view/inlineEdits/utils/towersLayout.js';

suite('Layout - getMaxTowerHeightInAvailableArea', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('tower fits within single available area', () => {
		const towerHorizontalRange = new OffsetRange(5, 15); // width of 10
		const availableTowerAreas = [new Size2D(50, 30)];

		// Should return the available height (30)
		assert.strictEqual(getMaxTowerHeightInAvailableArea(towerHorizontalRange, availableTowerAreas), 30);
	});

	test('max height available in area', () => {
		const towerHorizontalRange = new OffsetRange(5, 15); // width of 10
		const availableTowerAreas = [new Size2D(50, 30)];

		// Should return the available height (30), even if original tower was 40
		assert.strictEqual(getMaxTowerHeightInAvailableArea(towerHorizontalRange, availableTowerAreas), 30);
	});

	test('tower extends beyond available width', () => {
		const towerHorizontalRange = new OffsetRange(0, 60); // width of 60
		const availableTowerAreas = [new Size2D(50, 30)];

		// Should return 0 because tower extends beyond available areas
		assert.strictEqual(getMaxTowerHeightInAvailableArea(towerHorizontalRange, availableTowerAreas), 0);
	});

	test('tower fits across multiple available areas', () => {
		const towerHorizontalRange = new OffsetRange(10, 40); // width of 30
		const availableTowerAreas = [
			new Size2D(20, 30),
			new Size2D(20, 25),
			new Size2D(20, 30)
		];

		// Should return the minimum height across overlapping areas (25)
		assert.strictEqual(getMaxTowerHeightInAvailableArea(towerHorizontalRange, availableTowerAreas), 25);
	});

	test('min height across overlapping areas', () => {
		const towerHorizontalRange = new OffsetRange(10, 40); // width of 30
		const availableTowerAreas = [
			new Size2D(20, 30),
			new Size2D(20, 15), // Shortest area
			new Size2D(20, 30)
		];

		// Should return the minimum height (15)
		assert.strictEqual(getMaxTowerHeightInAvailableArea(towerHorizontalRange, availableTowerAreas), 15);
	});

	test('tower at left edge of available areas', () => {
		const towerHorizontalRange = new OffsetRange(0, 10); // width of 10
		const availableTowerAreas = [new Size2D(50, 30)];

		// Should return the available height (30)
		assert.strictEqual(getMaxTowerHeightInAvailableArea(towerHorizontalRange, availableTowerAreas), 30);
	});

	test('tower at right edge of available areas', () => {
		const towerHorizontalRange = new OffsetRange(40, 50); // width of 10
		const availableTowerAreas = [new Size2D(50, 30)];

		// Should return the available height (30)
		assert.strictEqual(getMaxTowerHeightInAvailableArea(towerHorizontalRange, availableTowerAreas), 30);
	});

	test('tower exactly matches available area', () => {
		const towerHorizontalRange = new OffsetRange(0, 50); // width of 50
		const availableTowerAreas = [new Size2D(50, 30)];

		// Should return the available height (30)
		assert.strictEqual(getMaxTowerHeightInAvailableArea(towerHorizontalRange, availableTowerAreas), 30);
	});

	test('empty available areas', () => {
		const towerHorizontalRange = new OffsetRange(0, 10); // width of 10
		const availableTowerAreas: Size2D[] = [];

		// Should return 0 for empty areas
		assert.strictEqual(getMaxTowerHeightInAvailableArea(towerHorizontalRange, availableTowerAreas), 0);
	});

	test('tower spans exactly two available areas', () => {
		const towerHorizontalRange = new OffsetRange(10, 50); // width of 40
		const availableTowerAreas = [
			new Size2D(30, 25),
			new Size2D(30, 25)
		];

		// Should return the minimum height across both areas (25)
		assert.strictEqual(getMaxTowerHeightInAvailableArea(towerHorizontalRange, availableTowerAreas), 25);
	});

	test('tower starts at boundary between two areas', () => {
		const towerHorizontalRange = new OffsetRange(30, 50); // width of 20
		const availableTowerAreas = [
			new Size2D(30, 25),
			new Size2D(30, 25)
		];

		// Should return the height of the second area (25)
		assert.strictEqual(getMaxTowerHeightInAvailableArea(towerHorizontalRange, availableTowerAreas), 25);
	});

	test('tower with varying height available areas', () => {
		const towerHorizontalRange = new OffsetRange(0, 50); // width of 50
		const availableTowerAreas = [
			new Size2D(10, 30),
			new Size2D(10, 15), // Shortest area
			new Size2D(10, 25),
			new Size2D(10, 30),
			new Size2D(10, 40)
		];

		// Should return the minimum height (15)
		assert.strictEqual(getMaxTowerHeightInAvailableArea(towerHorizontalRange, availableTowerAreas), 15);
	});

	test('tower beyond all available areas to the right', () => {
		const towerHorizontalRange = new OffsetRange(100, 110); // width of 10
		const availableTowerAreas = [new Size2D(50, 30)];

		// Should return 0 because tower is beyond available areas
		assert.strictEqual(getMaxTowerHeightInAvailableArea(towerHorizontalRange, availableTowerAreas), 0);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/test/browser/longDistanceWidgetPlacement.test.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/test/browser/longDistanceWidgetPlacement.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Size2D } from '../../../../common/core/2d/size.js';
import { LineRange } from '../../../../common/core/ranges/lineRange.js';
import { WidgetLayoutConstants, WidgetPlacementContext, ContinuousLineSizes } from '../../browser/view/inlineEdits/inlineEditsViews/longDistanceHint/longDistnaceWidgetPlacement.js';

suite('WidgetPlacementContext', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function createLineRangeInfo(startLine: number, sizes: Size2D[], top: number = 0): ContinuousLineSizes {
		return {
			lineRange: LineRange.ofLength(startLine, sizes.length),
			top,
			sizes,
		};
	}

	const defaultLayoutConstants: WidgetLayoutConstants = {
		previewEditorMargin: 5,
		widgetPadding: 2,
		widgetBorder: 1,
		lowerBarHeight: 10,
		minWidgetWidth: 50,
	};

	suite('constructor - availableSpaceSizes computation', () => {
		test('computes available space sizes correctly with no padding', () => {
			const sizes = [new Size2D(100, 20), new Size2D(150, 20), new Size2D(80, 20)];
			const lineRangeInfo = createLineRangeInfo(1, sizes);
			const editorTrueContentWidth = 500;
			const endOfLinePadding = () => 0;

			const context = new WidgetPlacementContext(lineRangeInfo, editorTrueContentWidth, endOfLinePadding);

			assert.strictEqual(context.availableSpaceSizes.length, 3);
			assert.strictEqual(context.availableSpaceSizes[0].width, 400); // 500 - 100
			assert.strictEqual(context.availableSpaceSizes[1].width, 350); // 500 - 150
			assert.strictEqual(context.availableSpaceSizes[2].width, 420); // 500 - 80
		});

		test('computes available space sizes with end of line padding', () => {
			const sizes = [new Size2D(100, 20), new Size2D(150, 20)];
			const lineRangeInfo = createLineRangeInfo(1, sizes);
			const editorTrueContentWidth = 500;
			const endOfLinePadding = (lineNumber: number) => lineNumber * 10;

			const context = new WidgetPlacementContext(lineRangeInfo, editorTrueContentWidth, endOfLinePadding);

			assert.strictEqual(context.availableSpaceSizes[0].width, 390); // 500 - 100 - 10
			assert.strictEqual(context.availableSpaceSizes[1].width, 330); // 500 - 150 - 20
		});

		test('available space width is never negative', () => {
			const sizes = [new Size2D(600, 20)];
			const lineRangeInfo = createLineRangeInfo(1, sizes);
			const editorTrueContentWidth = 500;
			const endOfLinePadding = () => 0;

			const context = new WidgetPlacementContext(lineRangeInfo, editorTrueContentWidth, endOfLinePadding);

			assert.strictEqual(context.availableSpaceSizes[0].width, 0);
		});

		test('preserves heights in available space sizes', () => {
			const sizes = [new Size2D(100, 25), new Size2D(100, 30), new Size2D(100, 20)];
			const lineRangeInfo = createLineRangeInfo(1, sizes);
			const editorTrueContentWidth = 500;
			const endOfLinePadding = () => 0;

			const context = new WidgetPlacementContext(lineRangeInfo, editorTrueContentWidth, endOfLinePadding);

			assert.strictEqual(context.availableSpaceSizes[0].height, 25);
			assert.strictEqual(context.availableSpaceSizes[1].height, 30);
			assert.strictEqual(context.availableSpaceSizes[2].height, 20);
		});
	});

	suite('constructor - prefix sums computation', () => {
		test('computes height prefix sums correctly', () => {
			const sizes = [new Size2D(100, 20), new Size2D(100, 30), new Size2D(100, 25)];
			const lineRangeInfo = createLineRangeInfo(1, sizes);

			const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);

			assert.deepStrictEqual(context.availableSpaceHeightPrefixSums, [0, 20, 50, 75]);
		});

		test('prefix sums start with 0 and have length = sizes.length + 1', () => {
			const sizes = [new Size2D(100, 10), new Size2D(100, 20)];
			const lineRangeInfo = createLineRangeInfo(1, sizes);

			const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);

			assert.strictEqual(context.availableSpaceHeightPrefixSums[0], 0);
			assert.strictEqual(context.availableSpaceHeightPrefixSums.length, 3);
		});
	});

	suite('constructor - transposed sizes', () => {
		test('transposes width and height correctly', () => {
			const sizes = [new Size2D(100, 20), new Size2D(150, 30)];
			const lineRangeInfo = createLineRangeInfo(1, sizes);

			const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);

			// Transposed: width becomes height and vice versa
			// Available widths are 400 and 350, heights are 20 and 30
			assert.strictEqual(context.availableSpaceSizesTransposed[0].width, 20);
			assert.strictEqual(context.availableSpaceSizesTransposed[0].height, 400);
			assert.strictEqual(context.availableSpaceSizesTransposed[1].width, 30);
			assert.strictEqual(context.availableSpaceSizesTransposed[1].height, 350);
		});
	});

	suite('getWidgetVerticalOutline', () => {
		test('computes vertical outline for first line', () => {
			const sizes = [new Size2D(100, 20), new Size2D(100, 20)];
			const lineRangeInfo = createLineRangeInfo(1, sizes, 100);

			const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);
			const outline = context.getWidgetVerticalOutline(1, 50, defaultLayoutConstants);

			// previewEditorMargin + widgetPadding + widgetBorder = 5 + 2 + 1 = 8
			// editorRange = [100, 150)
			// verticalWidgetRange = [100 - 8, 150 + 8 + 10) = [92, 168)
			assert.strictEqual(outline.start, 92);
			assert.strictEqual(outline.endExclusive, 168);
		});

		test('computes vertical outline for second line', () => {
			const sizes = [new Size2D(100, 20), new Size2D(100, 25)];
			const lineRangeInfo = createLineRangeInfo(1, sizes, 100);

			const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);
			const outline = context.getWidgetVerticalOutline(2, 50, defaultLayoutConstants);

			// Line 2 is at index 1, prefixSum[1] = 20
			// top = 100 + 20 = 120
			// editorRange = [120, 170)
			// margin = 8, lowerBarHeight = 10
			// verticalWidgetRange = [120 - 8, 170 + 8 + 10) = [112, 188)
			assert.strictEqual(outline.start, 112);
			assert.strictEqual(outline.endExclusive, 188);
		});

		test('works with zero margins', () => {
			const sizes = [new Size2D(100, 20)];
			const lineRangeInfo = createLineRangeInfo(1, sizes, 0);
			const zeroConstants: WidgetLayoutConstants = {
				previewEditorMargin: 0,
				widgetPadding: 0,
				widgetBorder: 0,
				lowerBarHeight: 0,
				minWidgetWidth: 50,
			};

			const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);
			const outline = context.getWidgetVerticalOutline(1, 50, zeroConstants);

			assert.strictEqual(outline.start, 0);
			assert.strictEqual(outline.endExclusive, 50);
		});
	});

	suite('tryFindWidgetOutline', () => {
		test('returns undefined when no line has enough width', () => {
			// All lines have content that leaves less than minWidgetWidth
			const sizes = [new Size2D(460, 20), new Size2D(470, 20), new Size2D(480, 20)];
			const lineRangeInfo = createLineRangeInfo(1, sizes);

			const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);
			const result = context.tryFindWidgetOutline(2, 15, 500, defaultLayoutConstants);

			assert.strictEqual(result, undefined);
		});

		test('finds widget outline on target line when it has enough space', () => {
			const sizes = [new Size2D(100, 20), new Size2D(100, 20), new Size2D(100, 20)];
			const lineRangeInfo = createLineRangeInfo(1, sizes, 0);

			const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);
			const result = context.tryFindWidgetOutline(2, 15, 500, defaultLayoutConstants);

			assert.ok(result !== undefined);
			assert.ok(result.horizontalWidgetRange.length >= defaultLayoutConstants.minWidgetWidth);
		});

		test('searches outward from target line', () => {
			// First and last lines are excluded from placement
			// Lines 2, 3 have no space, line 4 has space
			const sizes = [
				new Size2D(100, 20),  // line 1 - excluded (first)
				new Size2D(460, 20),  // line 2 - no space
				new Size2D(460, 20),  // line 3 - no space (target)
				new Size2D(100, 20),  // line 4 - has space
				new Size2D(100, 20),  // line 5 - has space
				new Size2D(100, 20),  // line 6 - has space
				new Size2D(100, 20),  // line 7 - excluded (last)
			];
			const lineRangeInfo = createLineRangeInfo(1, sizes, 0);

			const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);
			// Target is line 3, but it should find line 4 (searching outward)
			const result = context.tryFindWidgetOutline(3, 15, 500, defaultLayoutConstants);

			assert.ok(result !== undefined);
		});

		test('prefers closer lines to target', () => {
			const sizes = [
				new Size2D(100, 20),  // line 0 - excluded (first)
				new Size2D(100, 20),  // line 1 - has space
				new Size2D(100, 20),  // line 2 - has space
				new Size2D(100, 20),  // line 3 - has space
				new Size2D(500, 9999),// line 4 - no space (target)
				new Size2D(100, 20),  // line 5 - has space
				new Size2D(100, 20),  // line 6 - has space
				new Size2D(100, 20),  // line 7 - has space
				new Size2D(100, 20),  // line 8 - excluded (last)
			];
			const lineRangeInfo = createLineRangeInfo(1, sizes, 0);

			for (let targetLine = 0; targetLine <= 4; targetLine++) {
				const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);
				const result = context.tryFindWidgetOutline(targetLine, 15, 500, defaultLayoutConstants);
				assert.ok(result !== undefined);
				assert.ok(result.verticalWidgetRange.endExclusive < 9999);
			}

			for (let targetLine = 5; targetLine <= 10 /* test outside line range */; targetLine++) {
				const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);
				const result = context.tryFindWidgetOutline(targetLine, 15, 500, defaultLayoutConstants);
				assert.ok(result !== undefined);
				assert.ok(result.verticalWidgetRange.start > 9999);
			}
		});

		test('horizontal widget range ends at editor content right', () => {
			const sizes = [new Size2D(100, 20), new Size2D(100, 20), new Size2D(100, 20)];
			const lineRangeInfo = createLineRangeInfo(1, sizes, 0);
			const editorTrueContentRight = 500;

			const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);
			const result = context.tryFindWidgetOutline(2, 15, editorTrueContentRight, defaultLayoutConstants);

			assert.ok(result !== undefined);
			assert.strictEqual(result.horizontalWidgetRange.endExclusive, editorTrueContentRight);
		});
	});

	suite('edge cases', () => {
		test('handles single line range', () => {
			const sizes = [new Size2D(100, 20)];
			const lineRangeInfo = createLineRangeInfo(5, sizes, 50);

			const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);

			assert.strictEqual(context.availableSpaceSizes.length, 1);
			assert.deepStrictEqual(context.availableSpaceHeightPrefixSums, [0, 20]);
		});

		test('handles empty content lines (width 0)', () => {
			const sizes = [new Size2D(0, 20), new Size2D(0, 20)];
			const lineRangeInfo = createLineRangeInfo(1, sizes);

			const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);

			assert.strictEqual(context.availableSpaceSizes[0].width, 500);
			assert.strictEqual(context.availableSpaceSizes[1].width, 500);
		});

		test('handles varying line heights', () => {
			const sizes = [new Size2D(100, 10), new Size2D(100, 30), new Size2D(100, 20)];
			const lineRangeInfo = createLineRangeInfo(1, sizes, 100);

			const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);

			// Verify prefix sums account for varying heights
			assert.deepStrictEqual(context.availableSpaceHeightPrefixSums, [0, 10, 40, 60]);
		});

		test('handles very large line numbers', () => {
			const sizes = [new Size2D(100, 20)];
			const lineRangeInfo = createLineRangeInfo(10000, sizes, 0);

			const context = new WidgetPlacementContext(lineRangeInfo, 500, () => 0);

			const outline = context.getWidgetVerticalOutline(10000, 50, defaultLayoutConstants);
			assert.ok(outline !== undefined);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/test/browser/renameSymbolProcessor.test.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/test/browser/renameSymbolProcessor.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Range } from '../../../../common/core/range.js';
import { RenameInferenceEngine } from '../../browser/model/renameSymbolProcessor.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import type { Position } from '../../../../common/core/position.js';
import { StandardTokenType } from '../../../../common/encodedTokenAttributes.js';
import type { ITextModel } from '../../../../common/model.js';

class TestRenameInferenceEngine extends RenameInferenceEngine {

	constructor(private readonly identifiers: { type: StandardTokenType; range: Range }[]) {
		super();
	}

	protected override getTokenAtPosition(textModel: ITextModel, position: Position): { type: StandardTokenType; range: Range } {
		for (const id of this.identifiers) {
			if (id.range.containsPosition(position)) {
				return { type: id.type, range: id.range };
			}
		}
		throw new Error('No token found at position');
	}
}

function assertDefined<T>(value: T | undefined | null): asserts value is T {
	assert.ok(value !== undefined && value !== null);
}

suite('renameSymbolProcessor', () => {

	// This got copied from the TypeScript language configuration.
	const wordPattern = /(-?\d*\.\d\w*)|([^\`\@\~\!\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>/\?\s]+)/;

	let disposables: DisposableStore;

	setup(() => {
		disposables = new DisposableStore();
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Full identifier rename', () => {
		const model = createTextModel([
			'const foo = 1;',
		].join('\n'), 'typescript', {});
		disposables.add(model);

		const renameInferenceEngine = new TestRenameInferenceEngine([{ type: StandardTokenType.Other, range: new Range(1, 7, 1, 10) }]);
		const result = renameInferenceEngine.inferRename(model, new Range(1, 7, 1, 10), 'bar', wordPattern);
		assertDefined(result);
		assert.strictEqual(result.renames.edits.length, 1);
		assert.strictEqual(result.renames.oldName, 'foo');
		assert.strictEqual(result.renames.newName, 'bar');
		const edit = result.renames.edits[0];
		assert.strictEqual(edit.range.startLineNumber, 1);
		assert.strictEqual(edit.range.startColumn, 7);
		assert.strictEqual(edit.range.endLineNumber, 1);
		assert.strictEqual(edit.range.endColumn, 10);
		assert.strictEqual(edit.text, 'bar');
	});

	test('Prefix rename - replacement', () => {
		const model = createTextModel([
			'const fooABC = 1;',
		].join('\n'), 'typescript', {});
		disposables.add(model);

		const renameInferenceEngine = new TestRenameInferenceEngine([{ type: StandardTokenType.Other, range: new Range(1, 7, 1, 13) }]);
		const result = renameInferenceEngine.inferRename(model, new Range(1, 7, 1, 10), 'bazz', wordPattern);
		assertDefined(result);
		assert.strictEqual(result.renames.edits.length, 1);
		assert.strictEqual(result.renames.oldName, 'fooABC');
		assert.strictEqual(result.renames.newName, 'bazzABC');
		const edit = result.renames.edits[0];
		assert.strictEqual(edit.range.startLineNumber, 1);
		assert.strictEqual(edit.range.startColumn, 7);
		assert.strictEqual(edit.range.endLineNumber, 1);
		assert.strictEqual(edit.range.endColumn, 13);
		assert.strictEqual(edit.text, 'bazzABC');
	});

	test('Prefix rename - full line', () => {
		const model = createTextModel([
			'const fooABC = 1;',
		].join('\n'), 'typescript', {});
		disposables.add(model);

		const renameInferenceEngine = new TestRenameInferenceEngine([{ type: StandardTokenType.Other, range: new Range(1, 7, 1, 13) }]);
		const result = renameInferenceEngine.inferRename(model, new Range(1, 1, 1, 18), 'const bazzABC = 1;', wordPattern);
		assertDefined(result);
		assert.strictEqual(result.renames.edits.length, 1);
		assert.strictEqual(result.renames.oldName, 'fooABC');
		assert.strictEqual(result.renames.newName, 'bazzABC');
		const edit = result.renames.edits[0];
		assert.strictEqual(edit.range.startLineNumber, 1);
		assert.strictEqual(edit.range.startColumn, 7);
		assert.strictEqual(edit.range.endLineNumber, 1);
		assert.strictEqual(edit.range.endColumn, 13);
		assert.strictEqual(edit.text, 'bazzABC');
	});

	test('Insertion - with whitespace', () => {
		const model = createTextModel([
			'foo',
		].join('\n'), 'typescript', {});
		disposables.add(model);

		const renameInferenceEngine = new TestRenameInferenceEngine([{ type: StandardTokenType.Other, range: new Range(1, 1, 1, 4) }]);
		const result = renameInferenceEngine.inferRename(model, new Range(1, 4, 1, 4), '.map(x => x);', wordPattern);
		assert.ok(result === undefined);
	});

	test('Insertion - with whitespace - full line', () => {
		const model = createTextModel([
			'foo',
		].join('\n'), 'typescript', {});
		disposables.add(model);

		const renameInferenceEngine = new TestRenameInferenceEngine([{ type: StandardTokenType.Other, range: new Range(1, 1, 1, 4) }]);
		const result = renameInferenceEngine.inferRename(model, new Range(1, 1, 1, 4), 'foo.map(x => x);', wordPattern);
		assert.ok(result === undefined);
	});

	test('Insertion - no word', () => {
		const model = createTextModel([
			'foo',
		].join('\n'), 'typescript', {});
		disposables.add(model);

		const renameInferenceEngine = new TestRenameInferenceEngine([{ type: StandardTokenType.Other, range: new Range(1, 1, 1, 4) }]);
		const result = renameInferenceEngine.inferRename(model, new Range(1, 4, 1, 4), '.map(x=>x);', wordPattern);
		assert.ok(result === undefined);
	});

	test('Insertion - no word - full line', () => {
		const model = createTextModel([
			'foo',
		].join('\n'), 'typescript', {});
		disposables.add(model);

		const renameInferenceEngine = new TestRenameInferenceEngine([{ type: StandardTokenType.Other, range: new Range(1, 1, 1, 4) }]);
		const result = renameInferenceEngine.inferRename(model, new Range(1, 1, 1, 4), '.map(x=>x);', wordPattern);
		assert.ok(result === undefined);
	});

	test('Suffix rename - replacement', () => {
		const model = createTextModel([
			'const ABCfoo = 1;',
		].join('\n'), 'typescript', {});
		disposables.add(model);
		const renameInferenceEngine = new TestRenameInferenceEngine([{ type: StandardTokenType.Other, range: new Range(1, 7, 1, 13) }]);
		const result = renameInferenceEngine.inferRename(model, new Range(1, 10, 1, 13), 'bazz', wordPattern);
		assertDefined(result);
		assert.strictEqual(result.renames.edits.length, 1);
		assert.strictEqual(result.renames.oldName, 'ABCfoo');
		assert.strictEqual(result.renames.newName, 'ABCbazz');
		const edit = result.renames.edits[0];
		assert.strictEqual(edit.range.startLineNumber, 1);
		assert.strictEqual(edit.range.startColumn, 7);
		assert.strictEqual(edit.range.endLineNumber, 1);
		assert.strictEqual(edit.range.endColumn, 13);
		assert.strictEqual(edit.text, 'ABCbazz');
	});

	test('Suffix rename - full line', () => {
		const model = createTextModel([
			'const ABCfoo = 1;',
		].join('\n'), 'typescript', {});
		disposables.add(model);
		const renameInferenceEngine = new TestRenameInferenceEngine([{ type: StandardTokenType.Other, range: new Range(1, 7, 1, 13) }]);
		const result = renameInferenceEngine.inferRename(model, new Range(1, 1, 1, 18), 'const ABCbazz = 1;', wordPattern);
		assertDefined(result);
		assert.strictEqual(result.renames.oldName, 'ABCfoo');
		assert.strictEqual(result.renames.newName, 'ABCbazz');
		assert.strictEqual(result.renames.edits.length, 1);
		const edit = result.renames.edits[0];
		assert.strictEqual(edit.range.startLineNumber, 1);
		assert.strictEqual(edit.range.startColumn, 7);
		assert.strictEqual(edit.range.endLineNumber, 1);
		assert.strictEqual(edit.range.endColumn, 13);
		assert.strictEqual(edit.text, 'ABCbazz');
	});

	test('Prefix and suffix rename - full line', () => {
		const model = createTextModel([
			'const abcfooxyz = 1;',
		].join('\n'), 'typescript', {});
		disposables.add(model);
		const renameInferenceEngine = new TestRenameInferenceEngine([{ type: StandardTokenType.Other, range: new Range(1, 7, 1, 16) }]);
		const result = renameInferenceEngine.inferRename(model, new Range(1, 1, 1, 21), 'const ABCfooXYZ = 1;', wordPattern);
		assertDefined(result);
		assert.strictEqual(result.renames.edits.length, 1);
		assert.strictEqual(result.renames.oldName, 'abcfooxyz');
		assert.strictEqual(result.renames.newName, 'ABCfooXYZ');
		const edit = result.renames.edits[0];
		assert.strictEqual(edit.range.startLineNumber, 1);
		assert.strictEqual(edit.range.startColumn, 7);
		assert.strictEqual(edit.range.endLineNumber, 1);
		assert.strictEqual(edit.range.endColumn, 16);
		assert.strictEqual(edit.text, 'ABCfooXYZ');
	});

	test('Prefix and suffix rename - replacement', () => {
		const model = createTextModel([
			'const abcfooxyz = 1;',
		].join('\n'), 'typescript', {});
		disposables.add(model);
		const renameInferenceEngine = new TestRenameInferenceEngine([{ type: StandardTokenType.Other, range: new Range(1, 7, 1, 16) }]);
		const result = renameInferenceEngine.inferRename(model, new Range(1, 7, 1, 16), 'ABCfooXYZ', wordPattern);
		assertDefined(result);
		assert.strictEqual(result.renames.edits.length, 1);
		assert.strictEqual(result.renames.oldName, 'abcfooxyz');
		assert.strictEqual(result.renames.newName, 'ABCfooXYZ');
		const edit = result.renames.edits[0];
		assert.strictEqual(edit.range.startLineNumber, 1);
		assert.strictEqual(edit.range.startColumn, 7);
		assert.strictEqual(edit.range.endLineNumber, 1);
		assert.strictEqual(edit.range.endColumn, 16);
		assert.strictEqual(edit.text, 'ABCfooXYZ');
	});

	test('No rename - different identifiers - replacement', () => {
		const model = createTextModel([
			'const foo bar = 1;',
		].join('\n'), 'typescript', {});
		disposables.add(model);
		const renameInferenceEngine = new TestRenameInferenceEngine([{ type: StandardTokenType.Other, range: new Range(1, 7, 1, 15) }]);
		const result = renameInferenceEngine.inferRename(model, new Range(1, 7, 1, 15), 'faz baz', wordPattern);
		assert.ok(result === undefined);
	});

	test('No rename - different identifiers - full line', () => {
		const model = createTextModel([
			'const foo bar = 1;',
		].join('\n'), 'typescript', {});
		disposables.add(model);
		const renameInferenceEngine = new TestRenameInferenceEngine([{ type: StandardTokenType.Other, range: new Range(1, 7, 1, 15) }]);
		const result = renameInferenceEngine.inferRename(model, new Range(1, 1, 1, 18), 'const faz baz = 1;', wordPattern);
		assert.ok(result === undefined);
	});

	test('Suffix insertion', () => {
		const model = createTextModel([
			'const w = 1;',
		].join('\n'), 'typescript', {});
		disposables.add(model);
		const renameInferenceEngine = new TestRenameInferenceEngine([{ type: StandardTokenType.Other, range: new Range(1, 7, 1, 8) }, { type: StandardTokenType.Other, range: new Range(1, 8, 1, 9) }]);
		const result = renameInferenceEngine.inferRename(model, new Range(1, 8, 1, 8), 'idth', wordPattern);
		assertDefined(result);
		assert.strictEqual(result.renames.edits.length, 1);
		assert.strictEqual(result.renames.oldName, 'w');
		assert.strictEqual(result.renames.newName, 'width');
		const edit = result.renames.edits[0];
		assert.strictEqual(edit.range.startLineNumber, 1);
		assert.strictEqual(edit.range.startColumn, 7);
		assert.strictEqual(edit.range.endLineNumber, 1);
		assert.strictEqual(edit.range.endColumn, 8);
		assert.strictEqual(edit.text, 'width');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/test/browser/scrollToReveal.test.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/test/browser/scrollToReveal.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { OffsetRange } from '../../../../common/core/ranges/offsetRange.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { scrollToReveal } from '../../browser/view/inlineEdits/inlineEditsViews/longDistanceHint/inlineEditsLongDistanceHint.js';

suite('scrollToReveal', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('should not scroll when content is already visible', () => {
		// Content range [20, 30) is fully contained in window [10, 50)
		const result = scrollToReveal(10, 40, new OffsetRange(20, 30));
		assert.strictEqual(result.newScrollPosition, 10);
	});

	test('should not scroll when content exactly fits the visible window', () => {
		// Content range [10, 50) exactly matches visible window [10, 50)
		const result = scrollToReveal(10, 40, new OffsetRange(10, 50));
		assert.strictEqual(result.newScrollPosition, 10);
	});

	test('should scroll left when content starts before visible window', () => {
		// Content range [5, 15) starts before visible window [20, 60)
		const result = scrollToReveal(20, 40, new OffsetRange(5, 15));
		assert.strictEqual(result.newScrollPosition, 5);
	});

	test('should scroll right when content ends after visible window', () => {
		// Content range [50, 80) ends after visible window [10, 50)
		// New scroll position should be 80 - 40 = 40 so window becomes [40, 80)
		const result = scrollToReveal(10, 40, new OffsetRange(50, 80));
		assert.strictEqual(result.newScrollPosition, 40);
	});

	test('should show start of content when content is larger than window', () => {
		// Content range [20, 100) is larger than window width 40
		// Should position at start of content
		const result = scrollToReveal(10, 40, new OffsetRange(20, 100));
		assert.strictEqual(result.newScrollPosition, 20);
	});

	test('should handle edge case with zero-width content', () => {
		// Empty content range [25, 25) in window [10, 50)
		const result = scrollToReveal(10, 40, new OffsetRange(25, 25));
		assert.strictEqual(result.newScrollPosition, 10);
	});

	test('should handle edge case with zero window width', () => {
		// Any non-empty content with zero window width should position at content start
		const result = scrollToReveal(10, 0, new OffsetRange(20, 30));
		assert.strictEqual(result.newScrollPosition, 20);
	});

	test('should handle content at exact window boundaries - left edge', () => {
		// Content range [10, 20) starts exactly at visible window start [10, 50)
		const result = scrollToReveal(10, 40, new OffsetRange(10, 20));
		assert.strictEqual(result.newScrollPosition, 10);
	});

	test('should handle content at exact window boundaries - right edge', () => {
		// Content range [40, 50) ends exactly at visible window end [10, 50)
		const result = scrollToReveal(10, 40, new OffsetRange(40, 50));
		assert.strictEqual(result.newScrollPosition, 10);
	});

	test('should scroll right when content extends beyond right boundary', () => {
		// Content range [40, 60) extends beyond visible window [10, 50)
		// New scroll position should be 60 - 40 = 20 so window becomes [20, 60)
		const result = scrollToReveal(10, 40, new OffsetRange(40, 60));
		assert.strictEqual(result.newScrollPosition, 20);
	});

	test('should scroll left when content extends beyond left boundary', () => {
		// Content range [5, 25) starts before visible window [20, 60)
		// Should position at start of content
		const result = scrollToReveal(20, 40, new OffsetRange(5, 25));
		assert.strictEqual(result.newScrollPosition, 5);
	});

	test('should handle content overlapping both boundaries', () => {
		// Content range [5, 70) overlaps both sides of visible window [20, 60)
		// Since content is larger than window, should position at start of content
		const result = scrollToReveal(20, 40, new OffsetRange(5, 70));
		assert.strictEqual(result.newScrollPosition, 5);
	});

	test('should handle negative scroll positions', () => {
		// Current scroll at -10, window width 40, so visible range [-10, 30)
		// Content [35, 45) is beyond the visible window
		const result = scrollToReveal(-10, 40, new OffsetRange(35, 45));
		assert.strictEqual(result.newScrollPosition, 5); // 45 - 40 = 5
	});

	test('should handle large numbers', () => {
		// Test with large numbers to ensure no overflow issues
		const result = scrollToReveal(1000000, 500, new OffsetRange(1000600, 1000700));
		assert.strictEqual(result.newScrollPosition, 1000200); // 1000700 - 500 = 1000200
	});

	test('should prioritize left scroll when content spans window but starts before', () => {
		// Content [5, 55) spans wider than window width 40, starting before visible [20, 60)
		// Should position at start of content
		const result = scrollToReveal(20, 40, new OffsetRange(5, 55));
		assert.strictEqual(result.newScrollPosition, 5);
	});

	test('should handle single character content requiring scroll', () => {
		// Single character at position [100, 101) with visible window [10, 50)
		const result = scrollToReveal(10, 40, new OffsetRange(100, 101));
		assert.strictEqual(result.newScrollPosition, 61); // 101 - 40 = 61
	});

	test('should handle content just barely outside visible area - left', () => {
		// Content [9, 19) with one unit outside visible window [10, 50)
		const result = scrollToReveal(10, 40, new OffsetRange(9, 19));
		assert.strictEqual(result.newScrollPosition, 9);
	});

	test('should handle content just barely outside visible area - right', () => {
		// Content [45, 51) with one unit outside visible window [10, 50)
		const result = scrollToReveal(10, 40, new OffsetRange(45, 51));
		assert.strictEqual(result.newScrollPosition, 11); // 51 - 40 = 11
	});

	test('should handle fractional-like scenarios with minimum window', () => {
		// Minimum window width 1, content needs to be revealed
		const result = scrollToReveal(50, 1, new OffsetRange(100, 105));
		assert.strictEqual(result.newScrollPosition, 100); // Content larger than window, show start
	});

	test('should preserve scroll when content partially visible on left', () => {
		// Content [5, 25) partially visible in window [20, 60), overlaps [20, 25)
		// Since content starts before window, scroll to show start
		const result = scrollToReveal(20, 40, new OffsetRange(5, 25));
		assert.strictEqual(result.newScrollPosition, 5);
	});

	test('should preserve scroll when content partially visible on right', () => {
		// Content [45, 65) partially visible in window [20, 60), overlaps [45, 60)
		// Since content extends beyond window, scroll to show end
		const result = scrollToReveal(20, 40, new OffsetRange(45, 65));
		assert.strictEqual(result.newScrollPosition, 25); // 65 - 40 = 25
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/test/browser/suggestWidgetModel.test.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/test/browser/suggestWidgetModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../../base/common/async.js';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { Range } from '../../../../common/core/range.js';
import { CompletionItemKind, CompletionItemProvider } from '../../../../common/languages.js';
import { IEditorWorkerService } from '../../../../common/services/editorWorker.js';
import { ViewModel } from '../../../../common/viewModel/viewModelImpl.js';
import { GhostTextContext } from './utils.js';
import { SnippetController2 } from '../../../snippet/browser/snippetController2.js';
import { SuggestController } from '../../../suggest/browser/suggestController.js';
import { ISuggestMemoryService } from '../../../suggest/browser/suggestMemory.js';
import { ITestCodeEditor, TestCodeEditorInstantiationOptions, withAsyncTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { IMenu, IMenuService } from '../../../../../platform/actions/common/actions.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { MockKeybindingService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { InMemoryStorageService, IStorageService } from '../../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import assert from 'assert';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { LanguageFeaturesService } from '../../../../common/services/languageFeaturesService.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { InlineCompletionsModel } from '../../browser/model/inlineCompletionsModel.js';
import { InlineCompletionsController } from '../../browser/controller/inlineCompletionsController.js';
import { autorun } from '../../../../../base/common/observable.js';
import { setUnexpectedErrorHandler } from '../../../../../base/common/errors.js';
import { IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IDefaultAccountService } from '../../../../../platform/defaultAccount/common/defaultAccount.js';
import { ModifierKeyEmitter } from '../../../../../base/browser/dom.js';
import { InlineSuggestionsView } from '../../browser/view/inlineSuggestionsView.js';

suite('Suggest Widget Model', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		setUnexpectedErrorHandler(function (err) {
			throw err;
		});
	});

	// This test is skipped because the fix for this causes https://github.com/microsoft/vscode/issues/166023
	test.skip('Active', async () => {
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider, },
			async ({ editor, editorViewModel, context, model }) => {
				let last: boolean | undefined = undefined;
				const history = new Array<boolean>();
				const d = autorun(reader => {
					/** @description debug */
					const selectedSuggestItem = !!model.debugGetSelectedSuggestItem().read(reader);
					if (last !== selectedSuggestItem) {
						last = selectedSuggestItem;
						history.push(last);
					}
				});

				context.keyboardType('h');
				const suggestController = (editor.getContribution(SuggestController.ID) as SuggestController);
				suggestController.triggerSuggest();
				await timeout(1000);
				assert.deepStrictEqual(history.splice(0), [false, true]);

				context.keyboardType('.');
				await timeout(1000);

				// No flicker here
				assert.deepStrictEqual(history.splice(0), []);
				suggestController.cancelSuggestWidget();
				await timeout(1000);

				assert.deepStrictEqual(history.splice(0), [false]);

				d.dispose();
			}
		);
	});

	test('Ghost Text', async () => {
		await withAsyncTestCodeEditorAndInlineCompletionsModel('',
			{ fakeClock: true, provider, suggest: { preview: true } },
			async ({ editor, editorViewModel, context, model }) => {
				context.keyboardType('h');
				const suggestController = (editor.getContribution(SuggestController.ID) as SuggestController);
				suggestController.triggerSuggest();
				await timeout(1000);
				assert.deepStrictEqual(context.getAndClearViewStates(), ['', 'h[ello]']);

				context.keyboardType('.');
				await timeout(1000);
				assert.deepStrictEqual(context.getAndClearViewStates(), ['h', 'hello.[hello]']);

				suggestController.cancelSuggestWidget();

				await timeout(1000);
				assert.deepStrictEqual(context.getAndClearViewStates(), ['hello.']);
			}
		);
	});
});

const provider: CompletionItemProvider = {
	_debugDisplayName: 'test',
	triggerCharacters: ['.'],
	async provideCompletionItems(model, pos) {
		const word = model.getWordAtPosition(pos);
		const range = word
			? { startLineNumber: 1, startColumn: word.startColumn, endLineNumber: 1, endColumn: word.endColumn }
			: Range.fromPositions(pos);

		return {
			suggestions: [{
				insertText: 'hello',
				kind: CompletionItemKind.Text,
				label: 'hello',
				range,
				commitCharacters: ['.'],
			}]
		};
	},
};

async function withAsyncTestCodeEditorAndInlineCompletionsModel(
	text: string,
	options: TestCodeEditorInstantiationOptions & { provider?: CompletionItemProvider; fakeClock?: boolean; serviceCollection?: never },
	callback: (args: { editor: ITestCodeEditor; editorViewModel: ViewModel; model: InlineCompletionsModel; context: GhostTextContext }) => Promise<void>
): Promise<void> {
	await runWithFakedTimers({ useFakeTimers: options.fakeClock }, async () => {
		const disposableStore = new DisposableStore();

		try {
			const serviceCollection = new ServiceCollection(
				[ITelemetryService, NullTelemetryService],
				[ILogService, new NullLogService()],
				[IStorageService, disposableStore.add(new InMemoryStorageService())],
				[IKeybindingService, new MockKeybindingService()],
				[IEditorWorkerService, new class extends mock<IEditorWorkerService>() {
					override computeWordRanges() {
						return Promise.resolve({});
					}
				}],
				[ISuggestMemoryService, new class extends mock<ISuggestMemoryService>() {
					override memorize(): void { }
					override select(): number { return 0; }
				}],
				[IMenuService, new class extends mock<IMenuService>() {
					override createMenu() {
						return new class extends mock<IMenu>() {
							override onDidChange = Event.None;
							override dispose() { }
						};
					}
				}],
				[ILabelService, new class extends mock<ILabelService>() { }],
				[IWorkspaceContextService, new class extends mock<IWorkspaceContextService>() { }],
				// eslint-disable-next-line local/code-no-any-casts
				[IAccessibilitySignalService, {
					playSignal: async () => { },
					isSoundEnabled(signal: unknown) { return false; },
				} as any],
				[IDefaultAccountService, new class extends mock<IDefaultAccountService>() {
					override onDidChangeDefaultAccount = Event.None;
					override getDefaultAccount = async () => null;
					override setDefaultAccount = () => { };
				}],
			);

			if (options.provider) {
				const languageFeaturesService = new LanguageFeaturesService();
				serviceCollection.set(ILanguageFeaturesService, languageFeaturesService);
				disposableStore.add(languageFeaturesService.completionProvider.register({ pattern: '**' }, options.provider));
			}

			await withAsyncTestCodeEditor(text, { ...options, serviceCollection }, async (editor, editorViewModel, instantiationService) => {
				instantiationService.stubInstance(InlineSuggestionsView, {
					dispose: () => { }
				});
				editor.registerAndInstantiateContribution(SnippetController2.ID, SnippetController2);
				editor.registerAndInstantiateContribution(SuggestController.ID, SuggestController);
				editor.registerAndInstantiateContribution(InlineCompletionsController.ID, InlineCompletionsController);
				const model = InlineCompletionsController.get(editor)?.model.get()!;

				const context = new GhostTextContext(model, editor);
				await callback({ editor, editorViewModel, model, context });
				context.dispose();
			});
		} finally {
			disposableStore.dispose();
			ModifierKeyEmitter.disposeInstance();
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/test/browser/utils.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/test/browser/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { CoreEditingCommands, CoreNavigationCommands } from '../../../../browser/coreCommands.js';
import { Position } from '../../../../common/core/position.js';
import { ITextModel } from '../../../../common/model.js';
import { InlineCompletion, InlineCompletionContext, InlineCompletions, InlineCompletionsProvider } from '../../../../common/languages.js';
import { ITestCodeEditor, TestCodeEditorInstantiationOptions, withAsyncTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { InlineCompletionsModel } from '../../browser/model/inlineCompletionsModel.js';
import { autorun, derived } from '../../../../../base/common/observable.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { LanguageFeaturesService } from '../../../../common/services/languageFeaturesService.js';
import { ViewModel } from '../../../../common/viewModel/viewModelImpl.js';
import { InlineCompletionsController } from '../../browser/controller/inlineCompletionsController.js';
import { Range } from '../../../../common/core/range.js';
import { TextEdit } from '../../../../common/core/edits/textEdit.js';
import { BugIndicatingError } from '../../../../../base/common/errors.js';
import { PositionOffsetTransformer } from '../../../../common/core/text/positionToOffset.js';
import { InlineSuggestionsView } from '../../browser/view/inlineSuggestionsView.js';
import { IBulkEditService } from '../../../../browser/services/bulkEditService.js';
import { IDefaultAccountService } from '../../../../../platform/defaultAccount/common/defaultAccount.js';
import { Event } from '../../../../../base/common/event.js';

export class MockInlineCompletionsProvider implements InlineCompletionsProvider {
	private returnValue: InlineCompletion[] = [];
	private delayMs: number = 0;

	private callHistory = new Array<unknown>();
	private calledTwiceIn50Ms = false;

	constructor(
		public readonly enableForwardStability = false,
	) { }

	public setReturnValue(value: InlineCompletion | undefined, delayMs: number = 0): void {
		this.returnValue = value ? [value] : [];
		this.delayMs = delayMs;
	}

	public setReturnValues(values: InlineCompletion[], delayMs: number = 0): void {
		this.returnValue = values;
		this.delayMs = delayMs;
	}

	public getAndClearCallHistory() {
		const history = [...this.callHistory];
		this.callHistory = [];
		return history;
	}

	public assertNotCalledTwiceWithin50ms() {
		if (this.calledTwiceIn50Ms) {
			throw new Error('provideInlineCompletions has been called at least twice within 50ms. This should not happen.');
		}
	}

	private lastTimeMs: number | undefined = undefined;

	async provideInlineCompletions(model: ITextModel, position: Position, context: InlineCompletionContext, token: CancellationToken): Promise<InlineCompletions> {
		const currentTimeMs = new Date().getTime();
		if (this.lastTimeMs && currentTimeMs - this.lastTimeMs < 50) {
			this.calledTwiceIn50Ms = true;
		}
		this.lastTimeMs = currentTimeMs;

		this.callHistory.push({
			position: position.toString(),
			triggerKind: context.triggerKind,
			text: model.getValue()
		});
		const result = new Array<InlineCompletion>();
		for (const v of this.returnValue) {
			const x = { ...v };
			if (!x.range) {
				x.range = model.getFullModelRange();
			}
			result.push(x);
		}

		if (this.delayMs > 0) {
			await timeout(this.delayMs);
		}

		return { items: result, enableForwardStability: this.enableForwardStability };
	}
	disposeInlineCompletions() { }
	handleItemDidShow() { }
}

export class MockSearchReplaceCompletionsProvider implements InlineCompletionsProvider {
	private _map = new Map<string, string>();

	public add(search: string, replace: string): void {
		this._map.set(search, replace);
	}

	async provideInlineCompletions(model: ITextModel, position: Position, context: InlineCompletionContext, token: CancellationToken): Promise<InlineCompletions> {
		const text = model.getValue();
		for (const [search, replace] of this._map) {
			const idx = text.indexOf(search);
			// replace idx...idx+text.length with replace
			if (idx !== -1) {
				const range = Range.fromPositions(model.getPositionAt(idx), model.getPositionAt(idx + search.length));
				return {
					items: [
						{ range, insertText: replace, isInlineEdit: true }
					]
				};
			}
		}
		return { items: [] };
	}
	disposeInlineCompletions() { }
	handleItemDidShow() { }
}

export class InlineEditContext extends Disposable {
	public readonly prettyViewStates = new Array<string | undefined>();

	constructor(model: InlineCompletionsModel, private readonly editor: ITestCodeEditor) {
		super();

		const edit = derived(reader => {
			const state = model.state.read(reader);
			return state ? new TextEdit(state.edits) : undefined;
		});

		this._register(autorun(reader => {
			/** @description update */
			const e = edit.read(reader);
			let view: string | undefined;

			if (e) {
				view = e.toString(this.editor.getValue());
			} else {
				view = undefined;
			}

			this.prettyViewStates.push(view);
		}));
	}

	public getAndClearViewStates(): (string | undefined)[] {
		const arr = [...this.prettyViewStates];
		this.prettyViewStates.length = 0;
		return arr;
	}
}

export class GhostTextContext extends Disposable {
	public readonly prettyViewStates = new Array<string | undefined>();
	private _currentPrettyViewState: string | undefined;
	public get currentPrettyViewState() {
		return this._currentPrettyViewState;
	}

	constructor(model: InlineCompletionsModel, private readonly editor: ITestCodeEditor) {
		super();

		this._register(autorun(reader => {
			/** @description update */
			const ghostText = model.primaryGhostText.read(reader);
			let view: string | undefined;
			if (ghostText) {
				view = ghostText.render(this.editor.getValue(), true);
			} else {
				view = this.editor.getValue();
			}

			if (this._currentPrettyViewState !== view) {
				this.prettyViewStates.push(view);
			}
			this._currentPrettyViewState = view;
		}));
	}

	public getAndClearViewStates(): (string | undefined)[] {
		const arr = [...this.prettyViewStates];
		this.prettyViewStates.length = 0;
		return arr;
	}

	public keyboardType(text: string): void {
		this.editor.trigger('keyboard', 'type', { text });
	}

	public cursorUp(): void {
		this.editor.runCommand(CoreNavigationCommands.CursorUp, null);
	}

	public cursorRight(): void {
		this.editor.runCommand(CoreNavigationCommands.CursorRight, null);
	}

	public cursorLeft(): void {
		this.editor.runCommand(CoreNavigationCommands.CursorLeft, null);
	}

	public cursorDown(): void {
		this.editor.runCommand(CoreNavigationCommands.CursorDown, null);
	}

	public cursorLineEnd(): void {
		this.editor.runCommand(CoreNavigationCommands.CursorLineEnd, null);
	}

	public leftDelete(): void {
		this.editor.runCommand(CoreEditingCommands.DeleteLeft, null);
	}
}

export interface IWithAsyncTestCodeEditorAndInlineCompletionsModel {
	editor: ITestCodeEditor;
	editorViewModel: ViewModel;
	model: InlineCompletionsModel;
	context: GhostTextContext;
	store: DisposableStore;
}

export async function withAsyncTestCodeEditorAndInlineCompletionsModel<T>(
	text: string,
	options: TestCodeEditorInstantiationOptions & { provider?: InlineCompletionsProvider; fakeClock?: boolean },
	callback: (args: IWithAsyncTestCodeEditorAndInlineCompletionsModel) => Promise<T>): Promise<T> {
	return await runWithFakedTimers({
		useFakeTimers: options.fakeClock,
	}, async () => {
		const disposableStore = new DisposableStore();

		try {
			if (options.provider) {
				const languageFeaturesService = new LanguageFeaturesService();
				if (!options.serviceCollection) {
					options.serviceCollection = new ServiceCollection();
				}
				options.serviceCollection.set(ILanguageFeaturesService, languageFeaturesService);
				// eslint-disable-next-line local/code-no-any-casts
				options.serviceCollection.set(IAccessibilitySignalService, {
					playSignal: async () => { },
					isSoundEnabled(signal: unknown) { return false; },
				} as any);
				options.serviceCollection.set(IBulkEditService, {
					apply: async () => { throw new Error('IBulkEditService.apply not implemented'); },
					hasPreviewHandler: () => { throw new Error('IBulkEditService.hasPreviewHandler not implemented'); },
					setPreviewHandler: () => { throw new Error('IBulkEditService.setPreviewHandler not implemented'); },
					_serviceBrand: undefined,
				});
				options.serviceCollection.set(IDefaultAccountService, {
					_serviceBrand: undefined,
					onDidChangeDefaultAccount: Event.None,
					getDefaultAccount: async () => null,
					setDefaultAccount: () => { },
				});

				const d = languageFeaturesService.inlineCompletionsProvider.register({ pattern: '**' }, options.provider);
				disposableStore.add(d);
			}

			let result: T;
			await withAsyncTestCodeEditor(text, options, async (editor, editorViewModel, instantiationService) => {
				instantiationService.stubInstance(InlineSuggestionsView, {
					shouldShowHoverAtViewZone: () => false,
					dispose: () => { },
				});
				const controller = instantiationService.createInstance(InlineCompletionsController, editor);
				const model = controller.model.get()!;
				const context = new GhostTextContext(model, editor);
				try {
					result = await callback({ editor, editorViewModel, model, context, store: disposableStore });
				} finally {
					context.dispose();
					model.dispose();
					controller.dispose();
				}
			});

			if (options.provider instanceof MockInlineCompletionsProvider) {
				options.provider.assertNotCalledTwiceWithin50ms();
			}

			return result!;
		} finally {
			disposableStore.dispose();
		}
	});
}

export class AnnotatedString {
	public readonly value: string;
	public readonly markers: { mark: string; idx: number }[];

	constructor(src: string, annotations: string[] = ['↓']) {
		const markers = findMarkers(src, annotations);
		this.value = markers.textWithoutMarkers;
		this.markers = markers.results;
	}

	getMarkerOffset(markerIdx = 0): number {
		if (markerIdx >= this.markers.length) {
			throw new BugIndicatingError(`Marker index ${markerIdx} out of bounds`);
		}
		return this.markers[markerIdx].idx;
	}
}

function findMarkers(text: string, markers: string[]): {
	results: { mark: string; idx: number }[];
	textWithoutMarkers: string;
} {
	const results: { mark: string; idx: number }[] = [];
	let textWithoutMarkers = '';

	markers.sort((a, b) => b.length - a.length);

	let pos = 0;
	for (let i = 0; i < text.length;) {
		let foundMarker = false;
		for (const marker of markers) {
			if (text.startsWith(marker, i)) {
				results.push({ mark: marker, idx: pos });
				i += marker.length;
				foundMarker = true;
				break;
			}
		}
		if (!foundMarker) {
			textWithoutMarkers += text[i];
			pos++;
			i++;
		}
	}

	return { results, textWithoutMarkers };
}

export class AnnotatedText extends AnnotatedString {
	private readonly _transformer = new PositionOffsetTransformer(this.value);

	getMarkerPosition(markerIdx = 0): Position {
		return this._transformer.getPosition(this.getMarkerOffset(markerIdx));
	}
}
```

--------------------------------------------------------------------------------

````

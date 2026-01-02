---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 231
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 231 of 552)

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

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/view.css]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/view.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*
	@keyframes blink { 50% { border-color: orange; }  }
*/

.monaco-editor {
	--inline-edit-border-radius: 3px;

	.inline-edits-view-indicator {
		display: flex;

		z-index: 34; /* Below the find widget */
		height: 20px;

		color: var(--vscode-inlineEdit-gutterIndicator-primaryForeground);
		background-color: var(--vscode-inlineEdit-gutterIndicator-background);
		border: 1px solid var(--vscode-inlineEdit-gutterIndicator-primaryBorder);
		border-radius: var(--inline-edit-border-radius);

		align-items: center;
		padding: 2px;
		padding-right: 10px;
		margin: 0 4px;

		/*
		animation: blink 1s;
		animation-iteration-count: 3;
		*/

		opacity: 0;

		&.contained {
			transition: opacity 0.2s ease-in-out;
			transition-delay: 0.4s;
		}

		&.visible {
			opacity: 1;
		}

		&.top {
			opacity: 1;

			.icon {
				transform: rotate(90deg);
			}
		}

		&.bottom {
			opacity: 1;

			.icon {
				transform: rotate(-90deg);
			}
		}

		.icon {
			display: flex;
			align-items: center;
			margin: 0 2px;
			transform: none;
			transition: transform 0.2s ease-in-out;
			.codicon {
				color: var(--vscode-inlineEdit-gutterIndicator-primaryForeground);
			}
		}

		.label {
			margin: 0 2px;

			display: flex;
			justify-content: center;
			width: 100%;
		}
	}

	.inline-edits-view .editorContainer {
		.preview .monaco-editor {
			.view-overlays .current-line-exact {
				border: none;
			}

			.current-line-margin {
				border: none;
			}
		}

		.inline-edits-view-zone.diagonal-fill {
			opacity: 0.5;
		}
	}

	.strike-through {
		text-decoration: line-through;
	}

	.inlineCompletions-line-insert {
		background: var(--vscode-inlineEdit-modifiedChangedLineBackground);
	}

	.inlineCompletions-line-delete {
		background: var(--vscode-inlineEdit-originalChangedLineBackground);
	}

	.inlineCompletions-char-insert {
		background: var(--vscode-inlineEdit-modifiedChangedTextBackground);
		cursor: pointer;
	}

	.inlineCompletions-char-delete {
		background: var(--vscode-inlineEdit-originalChangedTextBackground);
	}

	.inlineCompletions-char-delete.diff-range-empty {
		margin-left: -1px;
		border-left: solid var(--vscode-inlineEdit-originalChangedTextBackground) 3px;
	}

	.inlineCompletions-char-insert.diff-range-empty {
		border-left: solid var(--vscode-inlineEdit-modifiedChangedTextBackground) 3px;
	}

	.inlineCompletions-char-delete.single-line-inline { /* Editor Decoration */
		border: 1px solid var(--vscode-editorHoverWidget-border);
		margin: -2px 0 0 -2px;
	}

	.inlineCompletions-char-insert.single-line-inline { /* Inline Decoration */
		border-top: 1px solid var(--vscode-inlineEdit-modifiedBorder); /* TODO: Do not set border inline but create overlaywidget (like deletion view) */
		border-bottom: 1px solid var(--vscode-inlineEdit-modifiedBorder); /* TODO: Do not set border inline but create overlaywidget (like deletion view) */
	}
	.inlineCompletions-char-insert.single-line-inline.start {
		border-top-left-radius: var(--inline-edit-border-radius);
		border-bottom-left-radius: var(--inline-edit-border-radius);
		border-left: 1px solid var(--vscode-inlineEdit-modifiedBorder); /* TODO: Do not set border inline but create overlaywidget (like deletion view) */
	}
	.inlineCompletions-char-insert.single-line-inline.end {
		border-top-right-radius: var(--inline-edit-border-radius);
		border-bottom-right-radius: var(--inline-edit-border-radius);
		border-right: 1px solid var(--vscode-inlineEdit-modifiedBorder); /* TODO: Do not set border inline but create overlaywidget (like deletion view) */
	}

	.inlineCompletions-char-delete.single-line-inline.empty,
	.inlineCompletions-char-insert.single-line-inline.empty {
		display: none;
	}

	.inlineCompletions.strike-through {
		text-decoration-thickness: 1px;
	}

	/* line replacement bubbles */

	.inlineCompletions-modified-bubble {
		background: var(--vscode-inlineEdit-modifiedChangedTextBackground);
	}

	.inlineCompletions-original-bubble {
		background: var(--vscode-inlineEdit-originalChangedTextBackground);
	}

	.inlineCompletions-modified-bubble,
	.inlineCompletions-original-bubble {
		pointer-events: none;
		display: inline-block;
	}

	.inline-edit.ghost-text,
	.inline-edit.ghost-text-decoration,
	.inline-edit.ghost-text-decoration-preview,
	.inline-edit.suggest-preview-text .ghost-text {
		&.syntax-highlighted {
			opacity: 1 !important;
		}
		font-style: normal !important;
	}

	.inline-edit.modified-background.ghost-text,
	.inline-edit.modified-background.ghost-text-decoration,
	.inline-edit.modified-background.ghost-text-decoration-preview,
	.inline-edit.modified-background.suggest-preview-text .ghost-text {
		background: var(--vscode-inlineEdit-modifiedChangedTextBackground) !important;
		display: inline-block !important;
	}

	.inlineCompletions-original-lines {
		background: var(--vscode-editor-background);
	}

	.inline-edit-jump-to-widget {


		.monaco-keybinding {
			.monaco-keybinding-key {
				font-size: 11px;
				padding: 1px 2px 2px 2px;
			}
		}
	}
}

.monaco-menu-option {
	color: var(--vscode-editorActionList-foreground);
	font-size: 13px;
	padding: 0 4px;
	line-height: 28px;
	display: flex;
	gap: 4px;
	align-items: center;
	border-radius: 3px;
	cursor: pointer;

	.monaco-keybinding-key {
		font-size: 13px;
		opacity: 0.7;
	}

	&.active {
		background: var(--vscode-editorActionList-focusBackground);
		color: var(--vscode-editorActionList-focusForeground);
		outline: 1px solid var(--vscode-menu-selectionBorder, transparent);
		outline-offset: -1px;

		.monaco-keybinding-key {
			color: var(--vscode-editorActionList-focusForeground);
		}
	}
}

.inline-edits-long-distance-hint-widget .go-to-label::before {
	content: '';
	position: absolute;
	left: -12px;
	top: 0;
	width: 12px;
	height: 100%;
	background: linear-gradient(to left, var(--vscode-editorWidget-background) 0, transparent 12px);
}

.hc-black .inline-edits-long-distance-hint-widget .go-to-label::before,
.hc-light .inline-edits-long-distance-hint-widget .go-to-label::before {
	/* Remove gradient in high contrast mode for clearer separation */
	background: var(--vscode-editorWidget-background);
}

.inline-edit-alternative-action-label .codicon {
	font-size: 12px !important;
	padding-right: 4px;
}

.inline-edit-alternative-action-label .monaco-keybinding-key {
	padding: 2px 3px;
}

.inline-edit-alternative-action-label .inline-edit-alternative-action-label-separator {
	width: 4px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/components/gutterIndicatorMenu.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/components/gutterIndicatorMenu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ChildNode, LiveElement, n } from '../../../../../../../base/browser/dom.js';
import { ActionBar, IActionBarOptions } from '../../../../../../../base/browser/ui/actionbar/actionbar.js';
import { renderIcon } from '../../../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { KeybindingLabel } from '../../../../../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { IAction } from '../../../../../../../base/common/actions.js';
import { Codicon } from '../../../../../../../base/common/codicons.js';
import { ResolvedKeybinding } from '../../../../../../../base/common/keybindings.js';
import { IObservable, autorun, constObservable, derived, observableFromEvent, observableValue } from '../../../../../../../base/common/observable.js';
import { OS } from '../../../../../../../base/common/platform.js';
import { ThemeIcon } from '../../../../../../../base/common/themables.js';
import { localize } from '../../../../../../../nls.js';
import { ICommandService } from '../../../../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../../../../platform/contextkey/common/contextkey.js';
import { nativeHoverDelegate } from '../../../../../../../platform/hover/browser/hover.js';
import { IKeybindingService } from '../../../../../../../platform/keybinding/common/keybinding.js';
import { defaultKeybindingLabelStyles } from '../../../../../../../platform/theme/browser/defaultStyles.js';
import { asCssVariable, descriptionForeground, editorActionListForeground, editorHoverBorder } from '../../../../../../../platform/theme/common/colorRegistry.js';
import { ObservableCodeEditor } from '../../../../../../browser/observableCodeEditor.js';
import { EditorOption } from '../../../../../../common/config/editorOptions.js';
import { hideInlineCompletionId, inlineSuggestCommitAlternativeActionId, inlineSuggestCommitId, toggleShowCollapsedId } from '../../../controller/commandIds.js';
import { FirstFnArg, } from '../utils/utils.js';
import { InlineSuggestionGutterMenuData } from './gutterIndicatorView.js';

export class GutterIndicatorMenuContent {
	private readonly _inlineEditsShowCollapsed: IObservable<boolean>;

	constructor(
		private readonly _editorObs: ObservableCodeEditor,
		private readonly _data: InlineSuggestionGutterMenuData,
		private readonly _close: (focusEditor: boolean) => void,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@ICommandService private readonly _commandService: ICommandService,
	) {
		this._inlineEditsShowCollapsed = this._editorObs.getOption(EditorOption.inlineSuggest).map(s => s.edits.showCollapsed);
	}

	public toDisposableLiveElement(): LiveElement {
		return this._createHoverContent().toDisposableLiveElement();
	}

	private _createHoverContent() {
		const activeElement = observableValue<string | undefined>('active', undefined);

		const createOptionArgs = (options: { id: string; title: string; icon: IObservable<ThemeIcon> | ThemeIcon; commandId: string | IObservable<string>; commandArgs?: unknown[] }): FirstFnArg<typeof option> => {
			return {
				title: options.title,
				icon: options.icon,
				keybinding: typeof options.commandId === 'string' ? this._getKeybinding(options.commandArgs ? undefined : options.commandId) : derived(this, reader => typeof options.commandId === 'string' ? undefined : this._getKeybinding(options.commandArgs ? undefined : options.commandId.read(reader)).read(reader)),
				isActive: activeElement.map(v => v === options.id),
				onHoverChange: v => activeElement.set(v ? options.id : undefined, undefined),
				onAction: () => {
					this._close(true);
					return this._commandService.executeCommand(typeof options.commandId === 'string' ? options.commandId : options.commandId.get(), ...(options.commandArgs ?? []));
				},
			};
		};

		const title = header(this._data.displayName);

		const gotoAndAccept = option(createOptionArgs({
			id: 'gotoAndAccept',
			title: `${localize('goto', "Go To")} / ${localize('accept', "Accept")}`,
			icon: Codicon.check,
			commandId: inlineSuggestCommitId,
		}));

		const reject = option(createOptionArgs({
			id: 'reject',
			title: localize('reject', "Reject"),
			icon: Codicon.close,
			commandId: hideInlineCompletionId
		}));

		const alternativeCommand = this._data.alternativeAction ? option(createOptionArgs({
			id: 'alternativeCommand',
			title: this._data.alternativeAction.command.title,
			icon: this._data.alternativeAction.icon,
			commandId: inlineSuggestCommitAlternativeActionId,
		})) : undefined;

		const extensionCommands = this._data.extensionCommands.map((c, idx) => option(createOptionArgs({
			id: c.command.id + '_' + idx,
			title: c.command.title,
			icon: c.icon ?? Codicon.symbolEvent,
			commandId: c.command.id,
			commandArgs: c.command.arguments
		})));

		const showModelEnabled = false;
		const modelOptions = showModelEnabled ? this._data.modelInfo?.models.map((m: { id: string; name: string }) => option({
			title: m.name,
			icon: m.id === this._data.modelInfo?.currentModelId ? Codicon.check : Codicon.circle,
			keybinding: constObservable(undefined),
			isActive: activeElement.map(v => v === 'model_' + m.id),
			onHoverChange: v => activeElement.set(v ? 'model_' + m.id : undefined, undefined),
			onAction: () => {
				this._close(true);
				this._data.setModelId?.(m.id);
			},
		})) ?? [] : [];

		const toggleCollapsedMode = this._inlineEditsShowCollapsed.map(showCollapsed => showCollapsed ?
			option(createOptionArgs({
				id: 'showExpanded',
				title: localize('showExpanded', "Show Expanded"),
				icon: Codicon.expandAll,
				commandId: toggleShowCollapsedId
			}))
			: option(createOptionArgs({
				id: 'showCollapsed',
				title: localize('showCollapsed', "Show Collapsed"),
				icon: Codicon.collapseAll,
				commandId: toggleShowCollapsedId
			}))
		);

		const snooze = option(createOptionArgs({
			id: 'snooze',
			title: localize('snooze', "Snooze"),
			icon: Codicon.bellSlash,
			commandId: 'editor.action.inlineSuggest.snooze'
		}));

		const settings = option(createOptionArgs({
			id: 'settings',
			title: localize('settings', "Settings"),
			icon: Codicon.gear,
			commandId: 'workbench.action.openSettings',
			commandArgs: ['@tag:nextEditSuggestions']
		}));

		const actions = this._data.action ? [this._data.action] : [];
		const actionBarFooter = actions.length > 0 ? actionBar(
			actions.map(action => ({
				id: action.id,
				label: action.title + '...',
				enabled: true,
				run: () => this._commandService.executeCommand(action.id, ...(action.arguments ?? [])),
				class: undefined,
				tooltip: action.tooltip ?? action.title
			})),
			{ hoverDelegate: nativeHoverDelegate /* unable to show hover inside another hover */ }
		) : undefined;

		return hoverContent([
			title,
			gotoAndAccept,
			alternativeCommand,
			reject,
			toggleCollapsedMode,
			modelOptions.length ? separator() : undefined,
			...modelOptions,
			extensionCommands.length ? separator() : undefined,
			snooze,
			settings,

			...extensionCommands,

			actionBarFooter ? separator() : undefined,
			actionBarFooter
		]);
	}

	private _getKeybinding(commandId: string | undefined) {
		if (!commandId) {
			return constObservable(undefined);
		}
		return observableFromEvent(this._contextKeyService.onDidChangeContext, () => this._keybindingService.lookupKeybinding(commandId)); // TODO: use contextkeyservice to use different renderings
	}
}

function hoverContent(content: ChildNode) {
	return n.div({
		class: 'content',
		style: {
			margin: 4,
			minWidth: 180,
		}
	}, content);
}

function header(title: string | IObservable<string>) {
	return n.div({
		class: 'header',
		style: {
			color: asCssVariable(descriptionForeground),
			fontSize: '13px',
			fontWeight: '600',
			padding: '0 4px',
			lineHeight: 28,
		}
	}, [title]);
}

function option(props: {
	title: string;
	icon: IObservable<ThemeIcon> | ThemeIcon;
	keybinding: IObservable<ResolvedKeybinding | undefined>;
	isActive?: IObservable<boolean>;
	onHoverChange?: (isHovered: boolean) => void;
	onAction?: () => void;
}) {
	return derived({ name: 'inlineEdits.option' }, (_reader) => n.div({
		class: ['monaco-menu-option', props.isActive?.map(v => v && 'active')],
		onmouseenter: () => props.onHoverChange?.(true),
		onmouseleave: () => props.onHoverChange?.(false),
		onclick: props.onAction,
		onkeydown: e => {
			if (e.key === 'Enter') {
				props.onAction?.();
			}
		},
		tabIndex: 0,
		style: {
			borderRadius: 3, // same as hover widget border radius
		}
	}, [
		n.elem('span', {
			style: {
				fontSize: 16,
				display: 'flex',
			}
		}, [ThemeIcon.isThemeIcon(props.icon) ? renderIcon(props.icon) : props.icon.map(icon => renderIcon(icon))]),
		n.elem('span', {}, [props.title]),
		n.div({
			style: { marginLeft: 'auto' },
			ref: elem => {
				const keybindingLabel = _reader.store.add(new KeybindingLabel(elem, OS, {
					disableTitle: true,
					...defaultKeybindingLabelStyles,
					keybindingLabelShadow: undefined,
					keybindingLabelForeground: asCssVariable(descriptionForeground),
					keybindingLabelBackground: 'transparent',
					keybindingLabelBorder: 'transparent',
					keybindingLabelBottomBorder: undefined,
				}));
				_reader.store.add(autorun(reader => {
					keybindingLabel.set(props.keybinding.read(reader));
				}));
			}
		})
	]));
}

// TODO: make this observable
function actionBar(actions: IAction[], options: IActionBarOptions) {
	return derived({ name: 'inlineEdits.actionBar' }, (_reader) => n.div({
		class: ['action-widget-action-bar'],
		style: {
			padding: '3px 24px',
		}
	}, [
		n.div({
			ref: elem => {
				const actionBar = _reader.store.add(new ActionBar(elem, options));
				actionBar.push(actions, { icon: false, label: true });
			}
		})
	]));
}

function separator() {
	return n.div({
		id: 'inline-edit-gutter-indicator-menu-separator',
		class: 'menu-separator',
		style: {
			color: asCssVariable(editorActionListForeground),
			padding: '2px 0',
		}
	}, n.div({
		style: {
			borderBottom: `1px solid ${asCssVariable(editorHoverBorder)}`,
		}
	}));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/components/gutterIndicatorView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/components/gutterIndicatorView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ModifierKeyEmitter, n, trackFocus } from '../../../../../../../base/browser/dom.js';
import { renderIcon } from '../../../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { Codicon } from '../../../../../../../base/common/codicons.js';
import { BugIndicatingError } from '../../../../../../../base/common/errors.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../../../../base/common/lifecycle.js';
import { IObservable, ISettableObservable, autorun, constObservable, debouncedObservable, derived, observableFromEvent, observableValue, runOnChange } from '../../../../../../../base/common/observable.js';
import { IAccessibilityService } from '../../../../../../../platform/accessibility/common/accessibility.js';
import { IHoverService } from '../../../../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../../../../platform/theme/common/themeService.js';
import { IEditorMouseEvent } from '../../../../../../browser/editorBrowser.js';
import { ObservableCodeEditor } from '../../../../../../browser/observableCodeEditor.js';
import { Point } from '../../../../../../common/core/2d/point.js';
import { Rect } from '../../../../../../common/core/2d/rect.js';
import { HoverService } from '../../../../../../../platform/hover/browser/hoverService.js';
import { HoverWidget } from '../../../../../../../platform/hover/browser/hoverWidget.js';
import { EditorOption, RenderLineNumbersType } from '../../../../../../common/config/editorOptions.js';
import { LineRange } from '../../../../../../common/core/ranges/lineRange.js';
import { OffsetRange } from '../../../../../../common/core/ranges/offsetRange.js';
import { StickyScrollController } from '../../../../../stickyScroll/browser/stickyScrollController.js';
import { InlineEditTabAction } from '../inlineEditsViewInterface.js';
import { getEditorBlendedColor, INLINE_EDITS_BORDER_RADIUS, inlineEditIndicatorBackground, inlineEditIndicatorPrimaryBackground, inlineEditIndicatorPrimaryBorder, inlineEditIndicatorPrimaryForeground, inlineEditIndicatorSecondaryBackground, inlineEditIndicatorSecondaryBorder, inlineEditIndicatorSecondaryForeground, inlineEditIndicatorSuccessfulBackground, inlineEditIndicatorSuccessfulBorder, inlineEditIndicatorSuccessfulForeground } from '../theme.js';
import { mapOutFalsy, rectToProps } from '../utils/utils.js';
import { GutterIndicatorMenuContent } from './gutterIndicatorMenu.js';
import { assertNever } from '../../../../../../../base/common/assert.js';
import { Command, InlineCompletionCommand, IInlineCompletionModelInfo } from '../../../../../../common/languages.js';
import { InlineSuggestionItem } from '../../../model/inlineSuggestionItem.js';
import { localize } from '../../../../../../../nls.js';
import { InlineCompletionsModel } from '../../../model/inlineCompletionsModel.js';
import { InlineSuggestAlternativeAction } from '../../../model/InlineSuggestAlternativeAction.js';
import { asCssVariable } from '../../../../../../../platform/theme/common/colorUtils.js';

export class InlineEditsGutterIndicatorData {
	constructor(
		readonly gutterMenuData: InlineSuggestionGutterMenuData,
		readonly originalRange: LineRange,
		readonly model: SimpleInlineSuggestModel,
		readonly altAction: InlineSuggestAlternativeAction | undefined,
	) { }
}

export class InlineSuggestionGutterMenuData {
	public static fromInlineSuggestion(suggestion: InlineSuggestionItem): InlineSuggestionGutterMenuData {
		const alternativeAction = suggestion.action?.kind === 'edit' ? suggestion.action.alternativeAction : undefined;
		return new InlineSuggestionGutterMenuData(
			suggestion.gutterMenuLinkAction,
			suggestion.source.provider.displayName ?? localize('inlineSuggestion', "Inline Suggestion"),
			suggestion.source.inlineSuggestions.commands ?? [],
			alternativeAction,
			suggestion.source.provider.modelInfo,
			suggestion.source.provider.setModelId?.bind(suggestion.source.provider),
		);
	}

	constructor(
		readonly action: Command | undefined,
		readonly displayName: string,
		readonly extensionCommands: InlineCompletionCommand[],
		readonly alternativeAction: InlineSuggestAlternativeAction | undefined,
		readonly modelInfo: IInlineCompletionModelInfo | undefined,
		readonly setModelId: ((modelId: string) => Promise<void>) | undefined,
	) { }
}

// TODO this class does not make that much sense yet.
export class SimpleInlineSuggestModel {
	public static fromInlineCompletionModel(model: InlineCompletionsModel): SimpleInlineSuggestModel {
		return new SimpleInlineSuggestModel(
			() => model.accept(),
			() => model.jump(),
		);
	}

	constructor(
		readonly accept: () => void,
		readonly jump: () => void,
	) { }
}

const CODICON_SIZE_PX = 16;
const CODICON_PADDING_PX = 2;

export class InlineEditsGutterIndicator extends Disposable {
	constructor(
		private readonly _editorObs: ObservableCodeEditor,
		private readonly _data: IObservable<InlineEditsGutterIndicatorData | undefined>,
		private readonly _tabAction: IObservable<InlineEditTabAction>,
		private readonly _verticalOffset: IObservable<number>,
		private readonly _isHoveringOverInlineEdit: IObservable<boolean>,
		private readonly _focusIsInMenu: ISettableObservable<boolean>,

		@IHoverService private readonly _hoverService: HoverService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		@IThemeService private readonly _themeService: IThemeService
	) {
		super();

		this._originalRangeObs = mapOutFalsy(this._data.map(d => d?.originalRange));

		this._stickyScrollController = StickyScrollController.get(this._editorObs.editor);
		this._stickyScrollHeight = this._stickyScrollController
			? observableFromEvent(this._stickyScrollController.onDidChangeStickyScrollHeight, () => this._stickyScrollController!.stickyScrollWidgetHeight)
			: constObservable(0);

		const indicator = this._indicator.keepUpdated(this._store);

		this._register(this._editorObs.createOverlayWidget({
			domNode: indicator.element,
			position: constObservable(null),
			allowEditorOverflow: false,
			minContentWidthInPx: constObservable(0),
		}));

		this._register(this._editorObs.editor.onMouseMove((e: IEditorMouseEvent) => {
			const state = this._state.get();
			if (state === undefined) { return; }

			const el = this._iconRef.element;
			const rect = el.getBoundingClientRect();
			const rectangularArea = Rect.fromLeftTopWidthHeight(rect.left, rect.top, rect.width, rect.height);
			const point = new Point(e.event.posx, e.event.posy);
			this._isHoveredOverIcon.set(rectangularArea.containsPoint(point), undefined);
		}));

		this._register(this._editorObs.editor.onDidScrollChange(() => {
			this._isHoveredOverIcon.set(false, undefined);
		}));

		this._isHoveredOverInlineEditDebounced = debouncedObservable(this._isHoveringOverInlineEdit, 100);

		// pulse animation when hovering inline edit
		this._register(runOnChange(this._isHoveredOverInlineEditDebounced, (isHovering) => {
			if (isHovering) {
				this.triggerAnimation();
			}
		}));

		this._register(autorun(reader => {
			indicator.readEffect(reader);
			if (indicator.element) {
				// For the line number
				this._editorObs.editor.applyFontInfo(indicator.element);
			}
		}));
	}

	private readonly _isHoveredOverInlineEditDebounced: IObservable<boolean>;

	private readonly _modifierPressed = observableFromEvent(this, ModifierKeyEmitter.getInstance().event, () => ModifierKeyEmitter.getInstance().keyStatus.shiftKey);
	private readonly _gutterIndicatorStyles = derived(this, reader => {
		let v = this._tabAction.read(reader);

		// TODO: add source of truth for alt action active and key pressed
		const altAction = this._data.read(reader)?.altAction;
		const modifiedPressed = this._modifierPressed.read(reader);
		if (altAction && modifiedPressed) {
			v = InlineEditTabAction.Inactive;
		}

		switch (v) {
			case InlineEditTabAction.Inactive: return {
				background: getEditorBlendedColor(inlineEditIndicatorSecondaryBackground, this._themeService).read(reader).toString(),
				foreground: getEditorBlendedColor(inlineEditIndicatorSecondaryForeground, this._themeService).read(reader).toString(),
				border: getEditorBlendedColor(inlineEditIndicatorSecondaryBorder, this._themeService).read(reader).toString(),
			};
			case InlineEditTabAction.Jump: return {
				background: getEditorBlendedColor(inlineEditIndicatorPrimaryBackground, this._themeService).read(reader).toString(),
				foreground: getEditorBlendedColor(inlineEditIndicatorPrimaryForeground, this._themeService).read(reader).toString(),
				border: getEditorBlendedColor(inlineEditIndicatorPrimaryBorder, this._themeService).read(reader).toString()
			};
			case InlineEditTabAction.Accept: return {
				background: getEditorBlendedColor(inlineEditIndicatorSuccessfulBackground, this._themeService).read(reader).toString(),
				foreground: getEditorBlendedColor(inlineEditIndicatorSuccessfulForeground, this._themeService).read(reader).toString(),
				border: getEditorBlendedColor(inlineEditIndicatorSuccessfulBorder, this._themeService).read(reader).toString()
			};
			default:
				assertNever(v);
		}
	});

	public triggerAnimation(): Promise<Animation> {
		if (this._accessibilityService.isMotionReduced()) {
			return new Animation(null, null).finished;
		}

		// PULSE ANIMATION:
		const animation = this._iconRef.element.animate([
			{
				outline: `2px solid ${this._gutterIndicatorStyles.map(v => v.border).get()}`,
				outlineOffset: '-1px',
				offset: 0
			},
			{
				outline: `2px solid transparent`,
				outlineOffset: '10px',
				offset: 1
			},
		], { duration: 500 });

		return animation.finished;
	}

	private readonly _originalRangeObs;

	private readonly _state = derived(this, reader => {
		const range = this._originalRangeObs.read(reader);
		if (!range) { return undefined; }
		return {
			range,
			lineOffsetRange: this._editorObs.observeLineOffsetRange(range, reader.store),
		};
	});

	private readonly _stickyScrollController;
	private readonly _stickyScrollHeight;

	private readonly _lineNumberToRender = derived(this, reader => {
		if (this._verticalOffset.read(reader) !== 0) {
			return '';
		}

		const lineNumber = this._data.read(reader)?.originalRange.startLineNumber;
		const lineNumberOptions = this._editorObs.getOption(EditorOption.lineNumbers).read(reader);

		if (lineNumber === undefined || lineNumberOptions.renderType === RenderLineNumbersType.Off) {
			return '';
		}

		if (lineNumberOptions.renderType === RenderLineNumbersType.Interval) {
			const cursorPosition = this._editorObs.cursorPosition.read(reader);
			if (lineNumber % 10 === 0 || cursorPosition && cursorPosition.lineNumber === lineNumber) {
				return lineNumber.toString();
			}
			return '';
		}

		if (lineNumberOptions.renderType === RenderLineNumbersType.Relative) {
			const cursorPosition = this._editorObs.cursorPosition.read(reader);
			if (!cursorPosition) {
				return '';
			}
			const relativeLineNumber = Math.abs(lineNumber - cursorPosition.lineNumber);
			if (relativeLineNumber === 0) {
				return lineNumber.toString();
			}
			return relativeLineNumber.toString();
		}

		if (lineNumberOptions.renderType === RenderLineNumbersType.Custom) {
			if (lineNumberOptions.renderFn) {
				return lineNumberOptions.renderFn(lineNumber);
			}
			return '';
		}

		return lineNumber.toString();
	});

	private readonly _availableWidthForIcon = derived(this, reader => {
		const textModel = this._editorObs.editor.getModel();
		const editor = this._editorObs.editor;
		const layout = this._editorObs.layoutInfo.read(reader);
		const gutterWidth = layout.decorationsLeft + layout.decorationsWidth - layout.glyphMarginLeft;

		if (!textModel || gutterWidth <= 0) {
			return () => 0;
		}

		// no glyph margin => the entire gutter width is available as there is no optimal place to put the icon
		if (layout.lineNumbersLeft === 0) {
			return () => gutterWidth;
		}

		const lineNumberOptions = this._editorObs.getOption(EditorOption.lineNumbers).read(reader);
		if (lineNumberOptions.renderType === RenderLineNumbersType.Relative || /* likely to flicker */
			lineNumberOptions.renderType === RenderLineNumbersType.Off) {
			return () => gutterWidth;
		}

		const w = editor.getOption(EditorOption.fontInfo).typicalHalfwidthCharacterWidth;
		const rightOfLineNumber = layout.lineNumbersLeft + layout.lineNumbersWidth;
		const totalLines = textModel.getLineCount();
		const totalLinesDigits = (totalLines + 1 /* 0 based to 1 based*/).toString().length;

		const offsetDigits: {
			firstLineNumberWithDigitCount: number;
			topOfLineNumber: number;
			usableWidthLeftOfLineNumber: number;
		}[] = [];

		// We only need to pre compute the usable width left of the line number for the first line number with a given digit count
		for (let digits = 1; digits <= totalLinesDigits; digits++) {
			const firstLineNumberWithDigitCount = 10 ** (digits - 1);
			const topOfLineNumber = editor.getTopForLineNumber(firstLineNumberWithDigitCount);
			const digitsWidth = digits * w;
			const usableWidthLeftOfLineNumber = Math.min(gutterWidth, Math.max(0, rightOfLineNumber - digitsWidth - layout.glyphMarginLeft));
			offsetDigits.push({ firstLineNumberWithDigitCount, topOfLineNumber, usableWidthLeftOfLineNumber });
		}

		return (topOffset: number) => {
			for (let i = offsetDigits.length - 1; i >= 0; i--) {
				if (topOffset >= offsetDigits[i].topOfLineNumber) {
					return offsetDigits[i].usableWidthLeftOfLineNumber;
				}
			}
			throw new BugIndicatingError('Could not find avilable width for icon');
		};
	});

	private readonly _layout = derived(this, reader => {
		const s = this._state.read(reader);
		if (!s) { return undefined; }

		const layout = this._editorObs.layoutInfo.read(reader);

		const lineHeight = this._editorObs.observeLineHeightForLine(s.range.map(r => r.startLineNumber)).read(reader);
		const gutterViewPortPaddingLeft = 1;
		const gutterViewPortPaddingTop = 2;

		// Entire gutter view from top left to bottom right
		const gutterWidthWithoutPadding = layout.decorationsLeft + layout.decorationsWidth - layout.glyphMarginLeft - 2 * gutterViewPortPaddingLeft;
		const gutterHeightWithoutPadding = layout.height - 2 * gutterViewPortPaddingTop;
		const gutterViewPortWithStickyScroll = Rect.fromLeftTopWidthHeight(gutterViewPortPaddingLeft, gutterViewPortPaddingTop, gutterWidthWithoutPadding, gutterHeightWithoutPadding);
		const gutterViewPortWithoutStickyScrollWithoutPaddingTop = gutterViewPortWithStickyScroll.withTop(this._stickyScrollHeight.read(reader));
		const gutterViewPortWithoutStickyScroll = gutterViewPortWithStickyScroll.withTop(gutterViewPortWithoutStickyScrollWithoutPaddingTop.top + gutterViewPortPaddingTop);

		// The glyph margin area across all relevant lines
		const verticalEditRange = s.lineOffsetRange.read(reader);
		const gutterEditArea = Rect.fromRanges(OffsetRange.fromTo(gutterViewPortWithoutStickyScroll.left, gutterViewPortWithoutStickyScroll.right), verticalEditRange);

		// The gutter view container (pill)
		const pillHeight = lineHeight;
		const pillOffset = this._verticalOffset.read(reader);
		const pillFullyDockedRect = gutterEditArea.withHeight(pillHeight).translateY(pillOffset);
		const pillIsFullyDocked = gutterViewPortWithoutStickyScrollWithoutPaddingTop.containsRect(pillFullyDockedRect);

		// The icon which will be rendered in the pill
		const iconNoneDocked = this._tabAction.map(action => action === InlineEditTabAction.Accept ? Codicon.keyboardTab : Codicon.arrowRight);
		const iconDocked = derived(this, reader => {
			if (this._isHoveredOverIconDebounced.read(reader) || this._isHoveredOverInlineEditDebounced.read(reader)) {
				return Codicon.check;
			}
			if (this._tabAction.read(reader) === InlineEditTabAction.Accept) {
				return Codicon.keyboardTab;
			}
			const cursorLineNumber = this._editorObs.cursorLineNumber.read(reader) ?? 0;
			const editStartLineNumber = s.range.read(reader).startLineNumber;
			return cursorLineNumber <= editStartLineNumber ? Codicon.keyboardTabAbove : Codicon.keyboardTabBelow;
		});

		const idealIconAreaWidth = 22;
		const iconWidth = (pillRect: Rect) => {
			const availableIconAreaWidth = this._availableWidthForIcon.read(undefined)(pillRect.bottom + this._editorObs.editor.getScrollTop()) - gutterViewPortPaddingLeft;
			return Math.max(Math.min(availableIconAreaWidth, idealIconAreaWidth), CODICON_SIZE_PX);
		};

		if (pillIsFullyDocked) {
			const pillRect = pillFullyDockedRect;

			let lineNumberWidth;
			if (layout.lineNumbersWidth === 0) {
				lineNumberWidth = Math.min(Math.max(layout.lineNumbersLeft - gutterViewPortWithStickyScroll.left, 0), pillRect.width - idealIconAreaWidth);
			} else {
				lineNumberWidth = Math.max(layout.lineNumbersLeft + layout.lineNumbersWidth - gutterViewPortWithStickyScroll.left, 0);
			}

			const lineNumberRect = pillRect.withWidth(lineNumberWidth);
			const minimalIconWidthWithPadding = CODICON_SIZE_PX + CODICON_PADDING_PX;
			const iconWidth = Math.min(layout.decorationsWidth, idealIconAreaWidth);
			const iconRect = pillRect.withWidth(Math.max(iconWidth, minimalIconWidthWithPadding)).translateX(lineNumberWidth);
			const iconVisible = iconWidth >= minimalIconWidthWithPadding;

			return {
				gutterEditArea,
				icon: iconDocked,
				iconDirection: 'right' as const,
				iconRect,
				iconVisible,
				pillRect,
				lineNumberRect,
			};
		}

		const pillPartiallyDockedPossibleArea = gutterViewPortWithStickyScroll.intersect(gutterEditArea); // The area in which the pill could be partially docked
		const pillIsPartiallyDocked = pillPartiallyDockedPossibleArea && pillPartiallyDockedPossibleArea.height >= pillHeight;

		if (pillIsPartiallyDocked) {
			// pillFullyDockedRect is outside viewport, move it into the viewport under sticky scroll as we prefer the pill to not be on top of the sticky scroll
			// then move it into the possible area which will only cause it to move if it has to be rendered on top of the sticky scroll
			const pillRectMoved = pillFullyDockedRect.moveToBeContainedIn(gutterViewPortWithoutStickyScroll).moveToBeContainedIn(pillPartiallyDockedPossibleArea);
			const pillRect = pillRectMoved.withWidth(iconWidth(pillRectMoved));
			const iconRect = pillRect;

			return {
				gutterEditArea,
				icon: iconDocked,
				iconDirection: 'right' as const,
				iconRect,
				pillRect,
				iconVisible: true,
			};
		}

		// pillFullyDockedRect is outside viewport, so move it into viewport
		const pillRectMoved = pillFullyDockedRect.moveToBeContainedIn(gutterViewPortWithStickyScroll);
		const pillRect = pillRectMoved.withWidth(iconWidth(pillRectMoved));
		const iconRect = pillRect;

		// docked = pill was already in the viewport
		const iconDirection = pillRect.top < pillFullyDockedRect.top ?
			'top' as const :
			'bottom' as const;

		return {
			gutterEditArea,
			icon: iconNoneDocked,
			iconDirection,
			iconRect,
			pillRect,
			iconVisible: true,
		};
	});


	private readonly _iconRef = n.ref<HTMLDivElement>();

	public readonly isVisible = this._layout.map(l => !!l);

	private readonly _hoverVisible = observableValue(this, false);
	public readonly isHoverVisible: IObservable<boolean> = this._hoverVisible;

	private readonly _isHoveredOverIcon = observableValue(this, false);
	private readonly _isHoveredOverIconDebounced: IObservable<boolean> = debouncedObservable(this._isHoveredOverIcon, 100);
	public readonly isHoveredOverIcon: IObservable<boolean> = this._isHoveredOverIconDebounced;

	private _showHover(): void {
		if (this._hoverVisible.get()) {
			return;
		}

		const data = this._data.get();
		if (!data) {
			throw new BugIndicatingError('Gutter indicator data not available');
		}
		const disposableStore = new DisposableStore();
		const content = disposableStore.add(this._instantiationService.createInstance(
			GutterIndicatorMenuContent,
			this._editorObs,
			data.gutterMenuData,
			(focusEditor) => {
				if (focusEditor) {
					this._editorObs.editor.focus();
				}
				h?.dispose();
			},
		).toDisposableLiveElement());

		const focusTracker = disposableStore.add(trackFocus(content.element)); // TODO@benibenj should this be removed?
		disposableStore.add(focusTracker.onDidBlur(() => this._focusIsInMenu.set(false, undefined)));
		disposableStore.add(focusTracker.onDidFocus(() => this._focusIsInMenu.set(true, undefined)));
		disposableStore.add(toDisposable(() => this._focusIsInMenu.set(false, undefined)));

		const h = this._hoverService.showInstantHover({
			target: this._iconRef.element,
			content: content.element,
		}) as HoverWidget | undefined;
		if (h) {
			this._hoverVisible.set(true, undefined);
			disposableStore.add(this._editorObs.editor.onDidScrollChange(() => h.dispose()));
			disposableStore.add(h.onDispose(() => {
				this._hoverVisible.set(false, undefined);
				disposableStore.dispose();
			}));
		} else {
			disposableStore.dispose();
		}
	}

	private readonly _indicator = n.div({
		class: 'inline-edits-view-gutter-indicator',
		style: {
			position: 'absolute',
			overflow: 'visible',
		},
	}, mapOutFalsy(this._layout).map(layout => !layout ? [] : [
		n.div({
			style: {
				position: 'absolute',
				background: asCssVariable(inlineEditIndicatorBackground),
				borderRadius: `${INLINE_EDITS_BORDER_RADIUS}px`,
				...rectToProps(reader => layout.read(reader).gutterEditArea),
			}
		}),
		n.div({
			class: 'icon',
			ref: this._iconRef,

			tabIndex: 0,
			onclick: () => {
				const layout = this._layout.get();
				const acceptOnClick = layout?.icon.get() === Codicon.check;

				const data = this._data.get();
				if (!data) { throw new BugIndicatingError('Gutter indicator data not available'); }

				this._editorObs.editor.focus();
				if (acceptOnClick) {
					data.model.accept();
				} else {
					data.model.jump();
				}
			},

			onmouseenter: () => {
				// TODO show hover when hovering ghost text etc.
				this._showHover();
			},
			style: {
				cursor: 'pointer',
				zIndex: '20',
				position: 'absolute',
				backgroundColor: this._gutterIndicatorStyles.map(v => v.background),
				// eslint-disable-next-line local/code-no-any-casts
				['--vscodeIconForeground' as any]: this._gutterIndicatorStyles.map(v => v.foreground),
				border: this._gutterIndicatorStyles.map(v => `1px solid ${v.border}`),
				boxSizing: 'border-box',
				borderRadius: `${INLINE_EDITS_BORDER_RADIUS}px`,
				display: 'flex',
				justifyContent: layout.map(l => l.iconDirection === 'bottom' ? 'flex-start' : 'flex-end'),
				transition: this._modifierPressed.map(m => m ? '' : 'background-color 0.2s ease-in-out, width 0.2s ease-in-out'),
				...rectToProps(reader => layout.read(reader).pillRect),
			}
		}, [
			n.div({
				className: 'line-number',
				style: {
					lineHeight: layout.map(l => l.lineNumberRect ? l.lineNumberRect.height : 0),
					display: layout.map(l => l.lineNumberRect ? 'flex' : 'none'),
					alignItems: 'center',
					justifyContent: 'flex-end',
					width: layout.map(l => l.lineNumberRect ? l.lineNumberRect.width : 0),
					height: '100%',
					color: this._gutterIndicatorStyles.map(v => v.foreground),
				}
			},
				this._lineNumberToRender
			),
			n.div({
				style: {
					transform: layout.map(l => `rotate(${getRotationFromDirection(l.iconDirection)}deg)`),
					transition: 'rotate 0.2s ease-in-out, opacity 0.2s ease-in-out',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					opacity: layout.map(l => l.iconVisible ? '1' : '0'),
					marginRight: layout.map(l => l.pillRect.width - l.iconRect.width - (l.lineNumberRect?.width ?? 0)),
					width: layout.map(l => l.iconRect.width),
					position: 'relative',
					right: layout.map(l => l.iconDirection === 'top' ? '1px' : '0'),
				}
			}, [
				layout.map((l, reader) => withStyles(renderIcon(l.icon.read(reader)), { fontSize: toPx(Math.min(l.iconRect.width - CODICON_PADDING_PX, CODICON_SIZE_PX)) })),
			])
		]),
	]));
}

function getRotationFromDirection(direction: 'top' | 'bottom' | 'right'): number {
	switch (direction) {
		case 'top': return 90;
		case 'bottom': return -90;
		case 'right': return 0;
	}
}

function withStyles<T extends HTMLElement>(element: T, styles: { [key: string]: string }): T {
	for (const key in styles) {
		// eslint-disable-next-line local/code-no-any-casts
		element.style[key as any] = styles[key];
	}
	return element;
}

function toPx(n: number): string {
	return `${n}px`;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/debugVisualization.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/debugVisualization.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../../../../base/common/lifecycle.js';
import { IReader, derived } from '../../../../../../../base/common/observable.js';
import { Rect } from '../../../../../../common/core/2d/rect.js';

export interface IVisualizationEffect {
	visualize(): IDisposable;
}

export function setVisualization(data: object, visualization: IVisualizationEffect): void {
	// eslint-disable-next-line local/code-no-any-casts
	(data as any)['$$visualization'] = visualization;
}

export function debugLogRects(rects: Record<string, Rect> | Rect[], elem: HTMLElement): object {
	if (Array.isArray(rects)) {
		const record: Record<string, Rect> = {};
		rects.forEach((rect, index) => {
			record[index.toString()] = rect;
		});
		rects = record;
	}

	setVisualization(rects, new ManyRectVisualizer(rects, elem));
	return rects;
}

export function debugLogRect(rect: Rect, elem: HTMLElement, name: string): Rect {
	setVisualization(rect, new HtmlRectVisualizer(rect, elem, name));
	return rect;
}

export function debugLogHorizontalOffsetRange(rect: Rect, elem: HTMLElement, name: string): Rect {
	setVisualization(rect, new HtmlHorizontalOffsetRangeVisualizer(rect, elem, name, 0, 'above'));
	return rect;
}

export function debugLogHorizontalOffsetRanges(rects: Record<string, Rect> | Rect[], elem: HTMLElement): object {
	if (Array.isArray(rects)) {
		const record: Record<string, Rect> = {};
		rects.forEach((rect, index) => {
			record[index.toString()] = rect;
		});
		rects = record;
	}

	setVisualization(rects, new ManyHorizontalOffsetRangeVisualizer(rects, elem));
	return rects;
}

class ManyRectVisualizer implements IVisualizationEffect {
	constructor(
		private readonly _rects: Record<string, Rect>,
		private readonly _elem: HTMLElement
	) { }

	visualize(): IDisposable {
		const d: IDisposable[] = [];
		for (const key in this._rects) {
			const v = new HtmlRectVisualizer(this._rects[key], this._elem, key);
			d.push(v.visualize());
		}

		return {
			dispose: () => {
				d.forEach(d => d.dispose());
			}
		};
	}
}

class ManyHorizontalOffsetRangeVisualizer implements IVisualizationEffect {
	constructor(
		private readonly _rects: Record<string, Rect>,
		private readonly _elem: HTMLElement
	) { }

	visualize(): IDisposable {
		const d: IDisposable[] = [];
		const keys = Object.keys(this._rects);
		keys.forEach((key, index) => {
			// Stagger labels: odd indices go above, even indices go below
			const labelPosition = index % 2 === 0 ? 'above' : 'below';
			const v = new HtmlHorizontalOffsetRangeVisualizer(this._rects[key], this._elem, key, index * 12, labelPosition);
			d.push(v.visualize());
		});

		return {
			dispose: () => {
				d.forEach(d => d.dispose());
			}
		};
	}
}

class HtmlHorizontalOffsetRangeVisualizer implements IVisualizationEffect {
	constructor(
		private readonly _rect: Rect,
		private readonly _elem: HTMLElement,
		private readonly _name: string,
		private readonly _verticalOffset: number = 0,
		private readonly _labelPosition: 'above' | 'below' = 'above'
	) { }

	visualize(): IDisposable {
		const container = document.createElement('div');
		container.style.position = 'fixed';
		container.style.pointerEvents = 'none';
		container.style.zIndex = '100000';

		// Create horizontal line
		const horizontalLine = document.createElement('div');
		horizontalLine.style.position = 'absolute';
		horizontalLine.style.height = '2px';
		horizontalLine.style.backgroundColor = 'green';
		horizontalLine.style.top = '50%';
		horizontalLine.style.transform = 'translateY(-50%)';

		// Create start vertical bar
		const startBar = document.createElement('div');
		startBar.style.position = 'absolute';
		startBar.style.width = '2px';
		startBar.style.height = '8px';
		startBar.style.backgroundColor = 'green';
		startBar.style.left = '0';
		startBar.style.top = '50%';
		startBar.style.transform = 'translateY(-50%)';

		// Create end vertical bar
		const endBar = document.createElement('div');
		endBar.style.position = 'absolute';
		endBar.style.width = '2px';
		endBar.style.height = '8px';
		endBar.style.backgroundColor = 'green';
		endBar.style.right = '0';
		endBar.style.top = '50%';
		endBar.style.transform = 'translateY(-50%)';

		// Create label
		const label = document.createElement('div');
		label.textContent = this._name;
		label.style.position = 'absolute';

		// Position label above or below the line to avoid overlaps
		if (this._labelPosition === 'above') {
			label.style.bottom = '12px';
		} else {
			label.style.top = '12px';
		}

		label.style.left = '2px'; // Slight offset from start
		label.style.color = 'green';
		label.style.fontSize = '10px';
		label.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
		label.style.padding = '1px 3px';
		label.style.border = '1px solid green';
		label.style.borderRadius = '2px';
		label.style.whiteSpace = 'nowrap';
		label.style.boxShadow = '0 1px 2px rgba(0,0,0,0.15)';
		label.style.fontFamily = 'monospace';

		container.appendChild(horizontalLine);
		container.appendChild(startBar);
		container.appendChild(endBar);
		container.appendChild(label);

		const updatePosition = () => {
			const elemRect = this._elem.getBoundingClientRect();
			const centerY = this._rect.top + (this._rect.height / 2) + this._verticalOffset;
			const left = elemRect.left + this._rect.left;
			const width = this._rect.width;

			container.style.left = left + 'px';
			container.style.top = (elemRect.top + centerY) + 'px';
			container.style.width = width + 'px';
			container.style.height = '8px';

			horizontalLine.style.width = width + 'px';
		};

		// This is for debugging only
		// eslint-disable-next-line no-restricted-syntax
		document.body.appendChild(container);
		updatePosition();

		const observer = new ResizeObserver(updatePosition);
		observer.observe(this._elem);

		return {
			dispose: () => {
				observer.disconnect();
				container.remove();
			}
		};
	}
}

class HtmlRectVisualizer implements IVisualizationEffect {
	constructor(
		private readonly _rect: Rect,
		private readonly _elem: HTMLElement,
		private readonly _name: string
	) { }

	visualize(): IDisposable {
		const div = document.createElement('div');
		div.style.position = 'fixed';
		div.style.border = '1px solid red';
		div.style.boxSizing = 'border-box';
		div.style.pointerEvents = 'none';
		div.style.zIndex = '100000';

		const label = document.createElement('div');
		label.textContent = this._name;
		label.style.position = 'absolute';
		label.style.top = '-20px';
		label.style.left = '0';
		label.style.color = 'red';
		label.style.fontSize = '12px';
		label.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
		div.appendChild(label);

		const updatePosition = () => {
			const elemRect = this._elem.getBoundingClientRect();
			console.log(elemRect);
			div.style.left = (elemRect.left + this._rect.left) + 'px';
			div.style.top = (elemRect.top + this._rect.top) + 'px';
			div.style.width = this._rect.width + 'px';
			div.style.height = this._rect.height + 'px';
		};

		// This is for debugging only
		// eslint-disable-next-line no-restricted-syntax
		document.body.appendChild(div);
		updatePosition();

		const observer = new ResizeObserver(updatePosition);
		observer.observe(this._elem);

		return {
			dispose: () => {
				observer.disconnect();
				div.remove();
			}
		};
	}
}

export function debugView(value: unknown, reader: IReader): void {
	if (typeof value === 'object' && value && '$$visualization' in value) {
		const vis = value['$$visualization'] as IVisualizationEffect;
		debugReadDisposable(vis.visualize(), reader);
	}
}

function debugReadDisposable(d: IDisposable, reader: IReader): void {
	derived({ name: 'debugReadDisposable' }, (_reader) => {
		_reader.store.add(d);
		return undefined;
	}).read(reader);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsCollapsedView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsCollapsedView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { n } from '../../../../../../../base/browser/dom.js';
import { Event } from '../../../../../../../base/common/event.js';
import { Disposable } from '../../../../../../../base/common/lifecycle.js';
import { constObservable, derived, IObservable } from '../../../../../../../base/common/observable.js';
import { IAccessibilityService } from '../../../../../../../platform/accessibility/common/accessibility.js';
import { asCssVariable } from '../../../../../../../platform/theme/common/colorUtils.js';
import { ICodeEditor } from '../../../../../../browser/editorBrowser.js';
import { ObservableCodeEditor, observableCodeEditor } from '../../../../../../browser/observableCodeEditor.js';
import { Point } from '../../../../../../common/core/2d/point.js';
import { singleTextRemoveCommonPrefix } from '../../../model/singleTextEditHelpers.js';
import { IInlineEditsView } from '../inlineEditsViewInterface.js';
import { InlineEditWithChanges } from '../inlineEditWithChanges.js';
import { inlineEditIndicatorPrimaryBorder } from '../theme.js';
import { getEditorValidOverlayRect, PathBuilder, rectToProps } from '../utils/utils.js';

export class InlineEditsCollapsedView extends Disposable implements IInlineEditsView {

	readonly onDidClick = Event.None;

	private readonly _editorObs: ObservableCodeEditor;
	private readonly _iconRef = n.ref<SVGElement>();

	readonly isVisible: IObservable<boolean>;

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _edit: IObservable<InlineEditWithChanges | undefined>,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
	) {
		super();

		this._editorObs = observableCodeEditor(this._editor);

		const firstEdit = this._edit.map(inlineEdit => inlineEdit?.edit?.replacements[0] ?? null);

		const startPosition = firstEdit.map(edit => edit ? singleTextRemoveCommonPrefix(edit, this._editor.getModel()!).range.getStartPosition() : null);
		const observedStartPoint = this._editorObs.observePosition(startPosition, this._store);
		const startPoint = derived<Point | null>(reader => {
			const point = observedStartPoint.read(reader);
			if (!point) { return null; }

			const contentLeft = this._editorObs.layoutInfoContentLeft.read(reader);
			const scrollLeft = this._editorObs.scrollLeft.read(reader);
			return new Point(contentLeft + point.x - scrollLeft, point.y);
		});

		const overlayElement = n.div({
			class: 'inline-edits-collapsed-view',
			style: {
				position: 'absolute',
				overflow: 'visible',
				top: '0px',
				left: '0px',
				display: 'block',
			},
		}, [
			[this.getCollapsedIndicator(startPoint)],
		]).keepUpdated(this._store).element;

		this._register(this._editorObs.createOverlayWidget({
			domNode: overlayElement,
			position: constObservable(null),
			allowEditorOverflow: false,
			minContentWidthInPx: constObservable(0),
		}));

		this.isVisible = this._edit.map((inlineEdit, reader) => !!inlineEdit && startPoint.read(reader) !== null);
	}

	public triggerAnimation(): Promise<Animation> {
		if (this._accessibilityService.isMotionReduced()) {
			return new Animation(null, null).finished;
		}

		// PULSE ANIMATION:
		const animation = this._iconRef.element.animate([
			{ offset: 0.00, transform: 'translateY(-3px)', },
			{ offset: 0.20, transform: 'translateY(1px)', },
			{ offset: 0.36, transform: 'translateY(-1px)', },
			{ offset: 0.52, transform: 'translateY(1px)', },
			{ offset: 0.68, transform: 'translateY(-1px)', },
			{ offset: 0.84, transform: 'translateY(1px)', },
			{ offset: 1.00, transform: 'translateY(0px)', },
		], { duration: 2000 });

		return animation.finished;
	}

	private getCollapsedIndicator(startPoint: IObservable<Point | null>) {
		const contentLeft = this._editorObs.layoutInfoContentLeft;
		const startPointTranslated = startPoint.map((p, reader) => p ? p.deltaX(-contentLeft.read(reader)) : null);
		const iconPath = this.createIconPath(startPointTranslated);

		return n.svg({
			class: 'collapsedView',
			ref: this._iconRef,
			style: {
				position: 'absolute',
				...rectToProps((r) => getEditorValidOverlayRect(this._editorObs).read(r)),
				overflow: 'hidden',
				pointerEvents: 'none',
			}
		}, [
			n.svgElem('path', {
				class: 'collapsedViewPath',
				d: iconPath,
				fill: asCssVariable(inlineEditIndicatorPrimaryBorder),
			}),
		]);
	}

	private createIconPath(indicatorPoint: IObservable<Point | null>): IObservable<string> {
		const width = 6;
		const triangleHeight = 3;
		const baseHeight = 1;

		return indicatorPoint.map(point => {
			if (!point) { return new PathBuilder().build(); }
			const baseTopLeft = point.deltaX(-width / 2).deltaY(-baseHeight);
			const baseTopRight = baseTopLeft.deltaX(width);
			const baseBottomLeft = baseTopLeft.deltaY(baseHeight);
			const baseBottomRight = baseTopRight.deltaY(baseHeight);
			const triangleBottomCenter = baseBottomLeft.deltaX(width / 2).deltaY(triangleHeight);
			return new PathBuilder()
				.moveTo(baseTopLeft)
				.lineTo(baseTopRight)
				.lineTo(baseBottomRight)
				.lineTo(triangleBottomCenter)
				.lineTo(baseBottomLeft)
				.lineTo(baseTopLeft)
				.build();
		});
	}

	readonly isHovered = constObservable(false);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsCustomView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsCustomView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { n } from '../../../../../../../base/browser/dom.js';
import { Emitter } from '../../../../../../../base/common/event.js';
import { Disposable } from '../../../../../../../base/common/lifecycle.js';
import { autorun, constObservable, derived, derivedObservableWithCache, IObservable, IReader, observableValue } from '../../../../../../../base/common/observable.js';
import { editorBackground } from '../../../../../../../platform/theme/common/colorRegistry.js';
import { asCssVariable } from '../../../../../../../platform/theme/common/colorUtils.js';
import { IThemeService } from '../../../../../../../platform/theme/common/themeService.js';
import { ICodeEditor } from '../../../../../../browser/editorBrowser.js';
import { ObservableCodeEditor, observableCodeEditor } from '../../../../../../browser/observableCodeEditor.js';
import { LineSource, renderLines, RenderOptions } from '../../../../../../browser/widget/diffEditor/components/diffEditorViewZones/renderLines.js';
import { EditorOption } from '../../../../../../common/config/editorOptions.js';
import { Rect } from '../../../../../../common/core/2d/rect.js';
import { LineRange } from '../../../../../../common/core/ranges/lineRange.js';
import { InlineCompletionHintStyle } from '../../../../../../common/languages.js';
import { ILanguageService } from '../../../../../../common/languages/language.js';
import { LineTokens, TokenArray } from '../../../../../../common/tokens/lineTokens.js';
import { InlineSuggestHint } from '../../../model/inlineSuggestionItem.js';
import { IInlineEditsView, InlineEditClickEvent, InlineEditTabAction } from '../inlineEditsViewInterface.js';
import { getEditorBlendedColor, INLINE_EDITS_BORDER_RADIUS, inlineEditIndicatorPrimaryBackground, inlineEditIndicatorSecondaryBackground, inlineEditIndicatorSuccessfulBackground } from '../theme.js';
import { getContentRenderWidth, maxContentWidthInRange, rectToProps } from '../utils/utils.js';

const MIN_END_OF_LINE_PADDING = 14;
const PADDING_VERTICALLY = 0;
const PADDING_HORIZONTALLY = 4;
const HORIZONTAL_OFFSET_WHEN_ABOVE_BELOW = 4;
const VERTICAL_OFFSET_WHEN_ABOVE_BELOW = 2;
// !! minEndOfLinePadding should always be larger than paddingHorizontally + horizontalOffsetWhenAboveBelow

export class InlineEditsCustomView extends Disposable implements IInlineEditsView {

	private readonly _onDidClick = this._register(new Emitter<InlineEditClickEvent>());
	readonly onDidClick = this._onDidClick.event;

	private readonly _isHovered = observableValue(this, false);
	readonly isHovered: IObservable<boolean> = this._isHovered;
	private readonly _viewRef = n.ref<HTMLDivElement>();

	private readonly _editorObs: ObservableCodeEditor;

	readonly minEditorScrollHeight: IObservable<number>;

	constructor(
		private readonly _editor: ICodeEditor,
		displayLocation: IObservable<InlineSuggestHint | undefined>,
		tabAction: IObservable<InlineEditTabAction>,
		@IThemeService themeService: IThemeService,
		@ILanguageService private readonly _languageService: ILanguageService,
	) {
		super();

		this._editorObs = observableCodeEditor(this._editor);

		const styles = tabAction.map((v, reader) => {
			let border;
			switch (v) {
				case InlineEditTabAction.Inactive: border = inlineEditIndicatorSecondaryBackground; break;
				case InlineEditTabAction.Jump: border = inlineEditIndicatorPrimaryBackground; break;
				case InlineEditTabAction.Accept: border = inlineEditIndicatorSuccessfulBackground; break;
			}
			return {
				border: getEditorBlendedColor(border, themeService).read(reader).toString(),
				background: asCssVariable(editorBackground)
			};
		});

		const state = displayLocation.map(dl => dl ? this.getState(dl) : undefined);

		const view = state.map(s => s ? this.getRendering(s, styles) : undefined);

		this.minEditorScrollHeight = derived(this, reader => {
			const s = state.read(reader);
			if (!s) {
				return 0;
			}
			return s.rect.read(reader).bottom + this._editor.getScrollTop();
		});

		const overlay = n.div({
			class: 'inline-edits-custom-view',
			style: {
				position: 'absolute',
				overflow: 'visible',
				top: '0px',
				left: '0px',
				display: 'block',
			},
		}, [view]).keepUpdated(this._store);

		this._register(this._editorObs.createOverlayWidget({
			domNode: overlay.element,
			position: constObservable(null),
			allowEditorOverflow: false,
			minContentWidthInPx: derivedObservableWithCache<number>(this, (reader, prev) => {
				const s = state.read(reader);
				if (!s) { return prev ?? 0; }

				const current = s.rect.map(rect => rect.right).read(reader)
					+ this._editorObs.layoutInfoVerticalScrollbarWidth.read(reader)
					+ PADDING_HORIZONTALLY
					- this._editorObs.layoutInfoContentLeft.read(reader);
				return Math.max(prev ?? 0, current); // will run into infinite loop otherwise TODO: fix this
			}).recomputeInitiallyAndOnChange(this._store),
		}));

		this._register(autorun((reader) => {
			const v = view.read(reader);
			if (!v) { this._isHovered.set(false, undefined); return; }
			this._isHovered.set(overlay.isHovered.read(reader), undefined);
		}));
	}

	// TODO: this is very similar to side by side `fitsInsideViewport`, try to use the same function
	private fitsInsideViewport(range: LineRange, displayLabel: string, reader: IReader | undefined): boolean {
		const editorWidth = this._editorObs.layoutInfoWidth.read(reader);
		const editorContentLeft = this._editorObs.layoutInfoContentLeft.read(reader);
		const editorVerticalScrollbar = this._editor.getLayoutInfo().verticalScrollbarWidth;
		const minimapWidth = this._editorObs.layoutInfoMinimap.read(reader).minimapLeft !== 0 ? this._editorObs.layoutInfoMinimap.read(reader).minimapWidth : 0;

		const maxOriginalContent = maxContentWidthInRange(this._editorObs, range, undefined);
		const maxModifiedContent = getContentRenderWidth(displayLabel, this._editor, this._editor.getModel()!);
		const padding = PADDING_HORIZONTALLY + MIN_END_OF_LINE_PADDING;

		return maxOriginalContent + maxModifiedContent + padding < editorWidth - editorContentLeft - editorVerticalScrollbar - minimapWidth;
	}

	private getState(displayLocation: InlineSuggestHint): { rect: IObservable<Rect>; label: string; kind: InlineCompletionHintStyle } {

		const contentState = derived(this, (reader) => {
			const startLineNumber = displayLocation.range.startLineNumber;
			const endLineNumber = displayLocation.range.endLineNumber;
			const startColumn = displayLocation.range.startColumn;
			const endColumn = displayLocation.range.endColumn;
			const lineCount = this._editor.getModel()?.getLineCount() ?? 0;

			const lineWidth = maxContentWidthInRange(this._editorObs, new LineRange(startLineNumber, startLineNumber + 1), reader);
			const lineWidthBelow = startLineNumber + 1 <= lineCount ? maxContentWidthInRange(this._editorObs, new LineRange(startLineNumber + 1, startLineNumber + 2), reader) : undefined;
			const lineWidthAbove = startLineNumber - 1 >= 1 ? maxContentWidthInRange(this._editorObs, new LineRange(startLineNumber - 1, startLineNumber), reader) : undefined;
			const startContentLeftOffset = this._editor.getOffsetForColumn(startLineNumber, startColumn);
			const endContentLeftOffset = this._editor.getOffsetForColumn(endLineNumber, endColumn);

			return {
				lineWidth,
				lineWidthBelow,
				lineWidthAbove,
				startContentLeftOffset,
				endContentLeftOffset
			};
		});

		const startLineNumber = displayLocation.range.startLineNumber;
		const endLineNumber = displayLocation.range.endLineNumber;
		// only check viewport once in the beginning when rendering the view
		const fitsInsideViewport = this.fitsInsideViewport(new LineRange(startLineNumber, endLineNumber + 1), displayLocation.content, undefined);

		const rect = derived(this, reader => {
			const w = this._editorObs.getOption(EditorOption.fontInfo).read(reader).typicalHalfwidthCharacterWidth;

			const { lineWidth, lineWidthBelow, lineWidthAbove, startContentLeftOffset, endContentLeftOffset } = contentState.read(reader);

			const contentLeft = this._editorObs.layoutInfoContentLeft.read(reader);
			const lineHeight = this._editorObs.observeLineHeightForLine(startLineNumber).recomputeInitiallyAndOnChange(reader.store).read(reader);
			const scrollTop = this._editorObs.scrollTop.read(reader);
			const scrollLeft = this._editorObs.scrollLeft.read(reader);

			let position: 'end' | 'below' | 'above';
			if (startLineNumber === endLineNumber && endContentLeftOffset + 5 * w >= lineWidth && fitsInsideViewport) {
				position = 'end'; // Render at the end of the line if the range ends almost at the end of the line
			} else if (lineWidthBelow !== undefined && lineWidthBelow + MIN_END_OF_LINE_PADDING - HORIZONTAL_OFFSET_WHEN_ABOVE_BELOW - PADDING_HORIZONTALLY < startContentLeftOffset) {
				position = 'below'; // Render Below if possible
			} else if (lineWidthAbove !== undefined && lineWidthAbove + MIN_END_OF_LINE_PADDING - HORIZONTAL_OFFSET_WHEN_ABOVE_BELOW - PADDING_HORIZONTALLY < startContentLeftOffset) {
				position = 'above'; // Render Above if possible
			} else {
				position = 'end'; // Render at the end of the line otherwise
			}

			let topOfLine;
			let contentStartOffset;
			let deltaX = 0;
			let deltaY = 0;

			switch (position) {
				case 'end': {
					topOfLine = this._editorObs.editor.getTopForLineNumber(startLineNumber);
					contentStartOffset = lineWidth;
					deltaX = PADDING_HORIZONTALLY + MIN_END_OF_LINE_PADDING;
					break;
				}
				case 'below': {
					topOfLine = this._editorObs.editor.getTopForLineNumber(startLineNumber + 1);
					contentStartOffset = startContentLeftOffset;
					deltaX = PADDING_HORIZONTALLY + HORIZONTAL_OFFSET_WHEN_ABOVE_BELOW;
					deltaY = PADDING_VERTICALLY + VERTICAL_OFFSET_WHEN_ABOVE_BELOW;
					break;
				}
				case 'above': {
					topOfLine = this._editorObs.editor.getTopForLineNumber(startLineNumber - 1);
					contentStartOffset = startContentLeftOffset;
					deltaX = PADDING_HORIZONTALLY + HORIZONTAL_OFFSET_WHEN_ABOVE_BELOW;
					deltaY = -PADDING_VERTICALLY + VERTICAL_OFFSET_WHEN_ABOVE_BELOW;
					break;
				}
			}

			const textRect = Rect.fromLeftTopWidthHeight(
				contentLeft + contentStartOffset - scrollLeft,
				topOfLine - scrollTop,
				w * displayLocation.content.length,
				lineHeight
			);

			return textRect.withMargin(PADDING_VERTICALLY, PADDING_HORIZONTALLY).translateX(deltaX).translateY(deltaY);
		});

		return {
			rect,
			label: displayLocation.content,
			kind: displayLocation.style
		};
	}

	private getRendering(state: { rect: IObservable<Rect>; label: string; kind: InlineCompletionHintStyle }, styles: IObservable<{ background: string; border: string }>) {

		const line = document.createElement('div');
		const t = this._editor.getModel()!.tokenization.tokenizeLinesAt(1, [state.label])?.[0];
		let tokens: LineTokens;
		if (t && state.kind === InlineCompletionHintStyle.Code) {
			tokens = TokenArray.fromLineTokens(t).toLineTokens(state.label, this._languageService.languageIdCodec);
		} else {
			tokens = LineTokens.createEmpty(state.label, this._languageService.languageIdCodec);
		}

		const result = renderLines(new LineSource([tokens]), RenderOptions.fromEditor(this._editor).withSetWidth(false).withScrollBeyondLastColumn(0), [], line, true);
		line.style.width = `${result.minWidthInPx}px`;

		const rect = state.rect.map(r => r.withMargin(0, PADDING_HORIZONTALLY));

		return n.div({
			class: 'collapsedView',
			ref: this._viewRef,
			style: {
				position: 'absolute',
				...rectToProps(reader => rect.read(reader)),
				overflow: 'hidden',
				boxSizing: 'border-box',
				cursor: 'pointer',
				border: styles.map(s => `1px solid ${s.border}`),
				borderRadius: `${INLINE_EDITS_BORDER_RADIUS}px`,
				backgroundColor: styles.map(s => s.background),

				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				whiteSpace: 'nowrap',
			},
			onmousedown: e => {
				e.preventDefault(); // This prevents that the editor loses focus
			},
			onclick: (e) => { this._onDidClick.fire(InlineEditClickEvent.create(e)); }
		}, [
			line
		]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsDeletionView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsDeletionView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { n } from '../../../../../../../base/browser/dom.js';
import { Event } from '../../../../../../../base/common/event.js';
import { Disposable } from '../../../../../../../base/common/lifecycle.js';
import { constObservable, derived, derivedObservableWithCache, IObservable } from '../../../../../../../base/common/observable.js';
import { editorBackground } from '../../../../../../../platform/theme/common/colorRegistry.js';
import { asCssVariable } from '../../../../../../../platform/theme/common/colorUtils.js';
import { ICodeEditor } from '../../../../../../browser/editorBrowser.js';
import { ObservableCodeEditor, observableCodeEditor } from '../../../../../../browser/observableCodeEditor.js';
import { Rect } from '../../../../../../common/core/2d/rect.js';
import { EditorOption } from '../../../../../../common/config/editorOptions.js';
import { LineRange } from '../../../../../../common/core/ranges/lineRange.js';
import { OffsetRange } from '../../../../../../common/core/ranges/offsetRange.js';
import { Position } from '../../../../../../common/core/position.js';
import { Range } from '../../../../../../common/core/range.js';
import { IInlineEditsView, InlineEditTabAction } from '../inlineEditsViewInterface.js';
import { InlineEditWithChanges } from '../inlineEditWithChanges.js';
import { getOriginalBorderColor, INLINE_EDITS_BORDER_RADIUS, originalBackgroundColor } from '../theme.js';
import { getPrefixTrim, mapOutFalsy, maxContentWidthInRange } from '../utils/utils.js';

const HORIZONTAL_PADDING = 0;
const VERTICAL_PADDING = 0;
const BORDER_WIDTH = 1;
const WIDGET_SEPARATOR_WIDTH = 1;
const WIDGET_SEPARATOR_DIFF_EDITOR_WIDTH = 3;
const BORDER_RADIUS = INLINE_EDITS_BORDER_RADIUS;

export class InlineEditsDeletionView extends Disposable implements IInlineEditsView {

	readonly onDidClick = Event.None;

	private readonly _editorObs: ObservableCodeEditor;

	private readonly _originalVerticalStartPosition: IObservable<number | undefined>;
	private readonly _originalVerticalEndPosition: IObservable<number | undefined>;

	private readonly _originalDisplayRange: IObservable<LineRange | undefined>;

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _edit: IObservable<InlineEditWithChanges | undefined>,
		private readonly _uiState: IObservable<{
			originalRange: LineRange;
			deletions: Range[];
			inDiffEditor: boolean;
		} | undefined>,
		private readonly _tabAction: IObservable<InlineEditTabAction>,
	) {
		super();

		this._editorObs = observableCodeEditor(this._editor);

		const originalStartPosition = derived(this, (reader) => {
			const inlineEdit = this._edit.read(reader);
			return inlineEdit ? new Position(inlineEdit.originalLineRange.startLineNumber, 1) : null;
		});

		const originalEndPosition = derived(this, (reader) => {
			const inlineEdit = this._edit.read(reader);
			return inlineEdit ? new Position(inlineEdit.originalLineRange.endLineNumberExclusive, 1) : null;
		});

		this._originalDisplayRange = this._uiState.map(s => s?.originalRange);
		this._originalVerticalStartPosition = this._editorObs.observePosition(originalStartPosition, this._store).map(p => p?.y);
		this._originalVerticalEndPosition = this._editorObs.observePosition(originalEndPosition, this._store).map(p => p?.y);

		this._register(this._editorObs.createOverlayWidget({
			domNode: this._nonOverflowView.element,
			position: constObservable(null),
			allowEditorOverflow: false,
			minContentWidthInPx: derived(this, reader => {
				const info = this._editorLayoutInfo.read(reader);
				if (info === null) { return 0; }
				return info.codeRect.width;
			}),
		}));
	}

	private readonly _display = derived(this, reader => !!this._uiState.read(reader) ? 'block' : 'none');

	private readonly _editorMaxContentWidthInRange = derived(this, reader => {
		const originalDisplayRange = this._originalDisplayRange.read(reader);
		if (!originalDisplayRange) {
			return constObservable(0);
		}
		this._editorObs.versionId.read(reader);

		// Take the max value that we observed.
		// Reset when either the edit changes or the editor text version.
		return derivedObservableWithCache<number>(this, (reader, lastValue) => {
			const maxWidth = maxContentWidthInRange(this._editorObs, originalDisplayRange, reader);
			return Math.max(maxWidth, lastValue ?? 0);
		});
	}).map((v, r) => v.read(r));

	private readonly _maxPrefixTrim = derived(this, reader => {
		const state = this._uiState.read(reader);
		if (!state) {
			return { prefixTrim: 0, prefixLeftOffset: 0 };
		}
		return getPrefixTrim(state.deletions, state.originalRange, [], this._editor);
	});

	private readonly _editorLayoutInfo = derived(this, (reader) => {
		const inlineEdit = this._edit.read(reader);
		if (!inlineEdit) {
			return null;
		}
		const state = this._uiState.read(reader);
		if (!state) {
			return null;
		}

		const editorLayout = this._editorObs.layoutInfo.read(reader);
		const horizontalScrollOffset = this._editorObs.scrollLeft.read(reader);
		const w = this._editorObs.getOption(EditorOption.fontInfo).map(f => f.typicalHalfwidthCharacterWidth).read(reader);

		const right = editorLayout.contentLeft + Math.max(this._editorMaxContentWidthInRange.read(reader), w) - horizontalScrollOffset;

		const range = inlineEdit.originalLineRange;
		const selectionTop = this._originalVerticalStartPosition.read(reader) ?? this._editor.getTopForLineNumber(range.startLineNumber) - this._editorObs.scrollTop.read(reader);
		const selectionBottom = this._originalVerticalEndPosition.read(reader) ?? this._editor.getTopForLineNumber(range.endLineNumberExclusive) - this._editorObs.scrollTop.read(reader);

		const left = editorLayout.contentLeft + this._maxPrefixTrim.read(reader).prefixLeftOffset - horizontalScrollOffset;

		if (right <= left) {
			return null;
		}

		const codeRect = Rect.fromLeftTopRightBottom(left, selectionTop, right, selectionBottom).withMargin(VERTICAL_PADDING, HORIZONTAL_PADDING);

		return {
			codeRect,
			contentLeft: editorLayout.contentLeft,
		};
	}).recomputeInitiallyAndOnChange(this._store);

	private readonly _originalOverlay = n.div({
		style: { pointerEvents: 'none', }
	}, derived(this, reader => {
		const layoutInfoObs = mapOutFalsy(this._editorLayoutInfo).read(reader);
		if (!layoutInfoObs) { return undefined; }

		// Create an overlay which hides the left hand side of the original overlay when it overflows to the left
		// such that there is a smooth transition at the edge of content left
		const overlayhider = layoutInfoObs.map(layoutInfo => Rect.fromLeftTopRightBottom(
			layoutInfo.contentLeft - BORDER_RADIUS - BORDER_WIDTH,
			layoutInfo.codeRect.top,
			layoutInfo.contentLeft,
			layoutInfo.codeRect.bottom
		));

		const overlayRect = derived(this, reader => {
			const rect = layoutInfoObs.read(reader).codeRect;
			const overlayHider = overlayhider.read(reader);
			return rect.intersectHorizontal(new OffsetRange(overlayHider.left, Number.MAX_SAFE_INTEGER));
		});

		const separatorWidth = this._uiState.map(s => s?.inDiffEditor ? WIDGET_SEPARATOR_DIFF_EDITOR_WIDTH : WIDGET_SEPARATOR_WIDTH).read(reader);
		const separatorRect = overlayRect.map(rect => rect.withMargin(separatorWidth, separatorWidth));

		return [
			n.div({
				class: 'originalSeparatorDeletion',
				style: {
					...separatorRect.read(reader).toStyles(),
					borderRadius: `${BORDER_RADIUS}px`,
					border: `${BORDER_WIDTH + separatorWidth}px solid ${asCssVariable(editorBackground)}`,
					boxSizing: 'border-box',
				}
			}),
			n.div({
				class: 'originalOverlayDeletion',
				style: {
					...overlayRect.read(reader).toStyles(),
					borderRadius: `${BORDER_RADIUS}px`,
					border: getOriginalBorderColor(this._tabAction).map(bc => `${BORDER_WIDTH}px solid ${asCssVariable(bc)}`),
					boxSizing: 'border-box',
					backgroundColor: asCssVariable(originalBackgroundColor),
				}
			}),
			n.div({
				class: 'originalOverlayHiderDeletion',
				style: {
					...overlayhider.read(reader).toStyles(),
					backgroundColor: asCssVariable(editorBackground),
				}
			})
		];
	})).keepUpdated(this._store);

	private readonly _nonOverflowView = n.div({
		class: 'inline-edits-view',
		style: {
			position: 'absolute',
			overflow: 'visible',
			top: '0px',
			left: '0px',
			display: this._display,
		},
	}, [
		[this._originalOverlay],
	]).keepUpdated(this._store);

	readonly isHovered = constObservable(false);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsInsertionView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsInsertionView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { $, n } from '../../../../../../../base/browser/dom.js';
import { Emitter } from '../../../../../../../base/common/event.js';
import { Disposable } from '../../../../../../../base/common/lifecycle.js';
import { constObservable, derived, IObservable, observableValue } from '../../../../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../../../../platform/instantiation/common/instantiation.js';
import { editorBackground } from '../../../../../../../platform/theme/common/colorRegistry.js';
import { asCssVariable } from '../../../../../../../platform/theme/common/colorUtils.js';
import { ICodeEditor } from '../../../../../../browser/editorBrowser.js';
import { ObservableCodeEditor, observableCodeEditor } from '../../../../../../browser/observableCodeEditor.js';
import { LineSource, renderLines, RenderOptions } from '../../../../../../browser/widget/diffEditor/components/diffEditorViewZones/renderLines.js';
import { Rect } from '../../../../../../common/core/2d/rect.js';
import { Position } from '../../../../../../common/core/position.js';
import { Range } from '../../../../../../common/core/range.js';
import { LineRange } from '../../../../../../common/core/ranges/lineRange.js';
import { OffsetRange } from '../../../../../../common/core/ranges/offsetRange.js';
import { ILanguageService } from '../../../../../../common/languages/language.js';
import { LineTokens, TokenArray } from '../../../../../../common/tokens/lineTokens.js';
import { InlineDecoration, InlineDecorationType } from '../../../../../../common/viewModel/inlineDecorations.js';
import { GhostText, GhostTextPart } from '../../../model/ghostText.js';
import { GhostTextView, IGhostTextWidgetData } from '../../ghostText/ghostTextView.js';
import { IInlineEditsView, InlineEditClickEvent, InlineEditTabAction } from '../inlineEditsViewInterface.js';
import { getModifiedBorderColor, INLINE_EDITS_BORDER_RADIUS, modifiedBackgroundColor } from '../theme.js';
import { getPrefixTrim, mapOutFalsy } from '../utils/utils.js';

const BORDER_WIDTH = 1;
const WIDGET_SEPARATOR_WIDTH = 1;
const WIDGET_SEPARATOR_DIFF_EDITOR_WIDTH = 3;
const BORDER_RADIUS = INLINE_EDITS_BORDER_RADIUS;

export class InlineEditsInsertionView extends Disposable implements IInlineEditsView {
	private readonly _editorObs: ObservableCodeEditor;

	private readonly _onDidClick = this._register(new Emitter<InlineEditClickEvent>());
	readonly onDidClick = this._onDidClick.event;

	private readonly _state = derived(this, reader => {
		const state = this._input.read(reader);
		if (!state) { return undefined; }

		const textModel = this._editor.getModel()!;
		const eol = textModel.getEOL();

		if (state.startColumn === 1 && state.lineNumber > 1 && textModel.getLineLength(state.lineNumber) !== 0 && state.text.endsWith(eol) && !state.text.startsWith(eol)) {
			const endOfLineColumn = textModel.getLineLength(state.lineNumber - 1) + 1;
			return { lineNumber: state.lineNumber - 1, column: endOfLineColumn, text: eol + state.text.slice(0, -eol.length) };
		}

		return { lineNumber: state.lineNumber, column: state.startColumn, text: state.text };
	});

	private readonly _trimVertically = derived(this, reader => {
		const state = this._state.read(reader);
		const text = state?.text;
		if (!text || text.trim() === '') {
			return { topOffset: 0, bottomOffset: 0, linesTop: 0, linesBottom: 0 };
		}

		// Adjust for leading/trailing newlines
		const lineHeight = this._editor.getLineHeightForPosition(new Position(state.lineNumber, 1));
		const eol = this._editor.getModel()!.getEOL();
		let linesTop = 0;
		let linesBottom = 0;

		let i = 0;
		for (; i < text.length && text.startsWith(eol, i); i += eol.length) {
			linesTop += 1;
		}

		for (let j = text.length; j > i && text.endsWith(eol, j); j -= eol.length) {
			linesBottom += 1;
		}

		return { topOffset: linesTop * lineHeight, bottomOffset: linesBottom * lineHeight, linesTop, linesBottom };
	});

	private readonly _maxPrefixTrim = derived(this, reader => {
		const state = this._state.read(reader);
		if (!state) {
			return { prefixLeftOffset: 0, prefixTrim: 0 };
		}

		const textModel = this._editor.getModel()!;
		const eol = textModel.getEOL();

		const trimVertically = this._trimVertically.read(reader);

		const lines = state.text.split(eol);
		const modifiedLines = lines.slice(trimVertically.linesTop, lines.length - trimVertically.linesBottom);
		if (trimVertically.linesTop === 0) {
			modifiedLines[0] = textModel.getLineContent(state.lineNumber) + modifiedLines[0];
		}

		const originalRange = new LineRange(state.lineNumber, state.lineNumber + (trimVertically.linesTop > 0 ? 0 : 1));

		return getPrefixTrim([], originalRange, modifiedLines, this._editor);
	});

	private readonly _ghostText = derived<GhostText | undefined>(reader => {
		const state = this._state.read(reader);
		const prefixTrim = this._maxPrefixTrim.read(reader);
		if (!state) { return undefined; }

		const textModel = this._editor.getModel()!;
		const eol = textModel.getEOL();
		const modifiedLines = state.text.split(eol);

		const inlineDecorations = modifiedLines.map((line, i) => new InlineDecoration(
			new Range(i + 1, i === 0 ? 1 : prefixTrim.prefixTrim + 1, i + 1, line.length + 1),
			'modified-background',
			InlineDecorationType.Regular
		));

		return new GhostText(state.lineNumber, [new GhostTextPart(state.column, state.text, false, inlineDecorations)]);
	});

	protected readonly _ghostTextView: GhostTextView;
	readonly isHovered: IObservable<boolean>;

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _input: IObservable<{
			lineNumber: number;
			startColumn: number;
			text: string;
			inDiffEditor: boolean;
		} | undefined>,
		private readonly _tabAction: IObservable<InlineEditTabAction>,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILanguageService private readonly _languageService: ILanguageService,
	) {
		super();

		this._editorObs = observableCodeEditor(this._editor);

		this._ghostTextView = this._register(instantiationService.createInstance(
			GhostTextView,
			this._editor,
			derived(reader => {
				const ghostText = this._ghostText.read(reader);
				if (!ghostText) {
					return undefined;
				}
				return {
					ghostText: ghostText,
					handleInlineCompletionShown: (data) => {
						// This is a no-op for the insertion view, as it is handled by the InlineEditsView.
					},
					warning: undefined,
				} satisfies IGhostTextWidgetData;
			}),
			{
				extraClasses: ['inline-edit'],
				isClickable: true,
				shouldKeepCursorStable: true,
			}
		));

		this.isHovered = this._ghostTextView.isHovered;

		this._register(this._ghostTextView.onDidClick((e) => {
			this._onDidClick.fire(new InlineEditClickEvent(e));
		}));

		this._register(this._editorObs.createOverlayWidget({
			domNode: this._view.element,
			position: constObservable(null),
			allowEditorOverflow: false,
			minContentWidthInPx: derived(this, reader => {
				const info = this._overlayLayout.read(reader);
				if (info === null) { return 0; }
				return info.minContentWidthRequired;
			}),
		}));
	}

	private readonly _display = derived(this, reader => !!this._state.read(reader) ? 'block' : 'none');

	private readonly _editorMaxContentWidthInRange = derived(this, reader => {
		const state = this._state.read(reader);
		if (!state) {
			return 0;
		}
		this._editorObs.versionId.read(reader);
		const textModel = this._editor.getModel()!;
		const eol = textModel.getEOL();

		const textBeforeInsertion = state.text.startsWith(eol) ? '' : textModel.getValueInRange(new Range(state.lineNumber, 1, state.lineNumber, state.column));
		const textAfterInsertion = textModel.getValueInRange(new Range(state.lineNumber, state.column, state.lineNumber, textModel.getLineLength(state.lineNumber) + 1));
		const text = textBeforeInsertion + state.text + textAfterInsertion;
		const lines = text.split(eol);

		const renderOptions = RenderOptions.fromEditor(this._editor).withSetWidth(false).withScrollBeyondLastColumn(0);
		const lineWidths = lines.map(line => {
			const t = textModel.tokenization.tokenizeLinesAt(state.lineNumber, [line])?.[0];
			let tokens: LineTokens;
			if (t) {
				tokens = TokenArray.fromLineTokens(t).toLineTokens(line, this._languageService.languageIdCodec);
			} else {
				tokens = LineTokens.createEmpty(line, this._languageService.languageIdCodec);
			}

			return renderLines(new LineSource([tokens]), renderOptions, [], $('div'), true).minWidthInPx;
		});

		// Take the max value that we observed.
		// Reset when either the edit changes or the editor text version.
		return Math.max(...lineWidths);
	});

	public readonly startLineOffset = this._trimVertically.map(v => v.topOffset);
	public readonly originalLines = this._state.map(s => s ?
		new LineRange(
			s.lineNumber,
			Math.min(s.lineNumber + 2, this._editor.getModel()!.getLineCount() + 1)
		) : undefined
	);

	private readonly _overlayLayout = derived(this, (reader) => {
		this._ghostText.read(reader);
		const state = this._state.read(reader);
		if (!state) {
			return null;
		}

		// Update the overlay when the position changes
		this._editorObs.observePosition(observableValue(this, new Position(state.lineNumber, state.column)), reader.store).read(reader);

		const editorLayout = this._editorObs.layoutInfo.read(reader);
		const horizontalScrollOffset = this._editorObs.scrollLeft.read(reader);
		const verticalScrollbarWidth = this._editorObs.layoutInfoVerticalScrollbarWidth.read(reader);

		const right = editorLayout.contentLeft + this._editorMaxContentWidthInRange.read(reader) - horizontalScrollOffset;
		const prefixLeftOffset = this._maxPrefixTrim.read(reader).prefixLeftOffset ?? 0 /* fix due to observable bug? */;
		const left = editorLayout.contentLeft + prefixLeftOffset - horizontalScrollOffset;
		if (right <= left) {
			return null;
		}

		const { topOffset: topTrim, bottomOffset: bottomTrim } = this._trimVertically.read(reader);

		const scrollTop = this._editorObs.scrollTop.read(reader);
		const height = this._ghostTextView.height.read(reader) - topTrim - bottomTrim;
		const top = this._editor.getTopForLineNumber(state.lineNumber) - scrollTop + topTrim;
		const bottom = top + height;

		const overlay = new Rect(left, top, right, bottom);

		return {
			overlay,
			startsAtContentLeft: prefixLeftOffset === 0,
			contentLeft: editorLayout.contentLeft,
			minContentWidthRequired: prefixLeftOffset + overlay.width + verticalScrollbarWidth,
		};
	}).recomputeInitiallyAndOnChange(this._store);

	private readonly _modifiedOverlay = n.div({
		style: { pointerEvents: 'none', }
	}, derived(this, reader => {
		const overlayLayoutObs = mapOutFalsy(this._overlayLayout).read(reader);
		if (!overlayLayoutObs) { return undefined; }

		// Create an overlay which hides the left hand side of the original overlay when it overflows to the left
		// such that there is a smooth transition at the edge of content left
		const overlayHider = overlayLayoutObs.map(layoutInfo => Rect.fromLeftTopRightBottom(
			layoutInfo.contentLeft - BORDER_RADIUS - BORDER_WIDTH,
			layoutInfo.overlay.top,
			layoutInfo.contentLeft,
			layoutInfo.overlay.bottom
		)).read(reader);

		const separatorWidth = this._input.map(i => i?.inDiffEditor ? WIDGET_SEPARATOR_DIFF_EDITOR_WIDTH : WIDGET_SEPARATOR_WIDTH).read(reader);
		const overlayRect = overlayLayoutObs.map(l => l.overlay.withMargin(0, BORDER_WIDTH, 0, l.startsAtContentLeft ? 0 : BORDER_WIDTH).intersectHorizontal(new OffsetRange(overlayHider.left, Number.MAX_SAFE_INTEGER)));
		const underlayRect = overlayRect.map(rect => rect.withMargin(separatorWidth, separatorWidth));

		return [
			n.div({
				class: 'originalUnderlayInsertion',
				style: {
					...underlayRect.read(reader).toStyles(),
					borderRadius: BORDER_RADIUS,
					border: `${BORDER_WIDTH + separatorWidth}px solid ${asCssVariable(editorBackground)}`,
					boxSizing: 'border-box',
				}
			}),
			n.div({
				class: 'originalOverlayInsertion',
				style: {
					...overlayRect.read(reader).toStyles(),
					borderRadius: BORDER_RADIUS,
					border: getModifiedBorderColor(this._tabAction).map(bc => `${BORDER_WIDTH}px solid ${asCssVariable(bc)}`),
					boxSizing: 'border-box',
					backgroundColor: asCssVariable(modifiedBackgroundColor),
				}
			}),
			n.div({
				class: 'originalOverlayHiderInsertion',
				style: {
					...overlayHider.toStyles(),
					backgroundColor: asCssVariable(editorBackground),
				}
			})
		];
	})).keepUpdated(this._store);

	private readonly _view = n.div({
		class: 'inline-edits-view',
		style: {
			position: 'absolute',
			overflow: 'visible',
			top: '0px',
			left: '0px',
			display: this._display,
		},
	}, [
		[this._modifiedOverlay],
	]).keepUpdated(this._store);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsLineReplacementView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsLineReplacementView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, n } from '../../../../../../../base/browser/dom.js';
import { Emitter } from '../../../../../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../../../../../base/common/lifecycle.js';
import { autorunDelta, constObservable, derived, IObservable } from '../../../../../../../base/common/observable.js';
import { editorBackground, scrollbarShadow } from '../../../../../../../platform/theme/common/colorRegistry.js';
import { asCssVariable } from '../../../../../../../platform/theme/common/colorUtils.js';
import { IThemeService } from '../../../../../../../platform/theme/common/themeService.js';
import { IEditorMouseEvent, IViewZoneChangeAccessor } from '../../../../../../browser/editorBrowser.js';
import { EditorMouseEvent } from '../../../../../../browser/editorDom.js';
import { ObservableCodeEditor } from '../../../../../../browser/observableCodeEditor.js';
import { LineSource, renderLines, RenderOptions } from '../../../../../../browser/widget/diffEditor/components/diffEditorViewZones/renderLines.js';
import { EditorOption } from '../../../../../../common/config/editorOptions.js';
import { Point } from '../../../../../../common/core/2d/point.js';
import { Rect } from '../../../../../../common/core/2d/rect.js';
import { Range } from '../../../../../../common/core/range.js';
import { LineRange } from '../../../../../../common/core/ranges/lineRange.js';
import { OffsetRange } from '../../../../../../common/core/ranges/offsetRange.js';
import { ILanguageService } from '../../../../../../common/languages/language.js';
import { LineTokens, TokenArray } from '../../../../../../common/tokens/lineTokens.js';
import { InlineDecoration, InlineDecorationType } from '../../../../../../common/viewModel/inlineDecorations.js';
import { IInlineEditsView, InlineEditClickEvent, InlineEditTabAction } from '../inlineEditsViewInterface.js';
import { getEditorBlendedColor, getModifiedBorderColor, getOriginalBorderColor, INLINE_EDITS_BORDER_RADIUS, modifiedChangedLineBackgroundColor, originalBackgroundColor } from '../theme.js';
import { getEditorValidOverlayRect, getPrefixTrim, mapOutFalsy, rectToProps } from '../utils/utils.js';

export class InlineEditsLineReplacementView extends Disposable implements IInlineEditsView {

	private readonly _onDidClick = this._register(new Emitter<InlineEditClickEvent>());
	readonly onDidClick = this._onDidClick.event;

	private readonly _maxPrefixTrim;

	private readonly _modifiedLineElements;


	private readonly _layout;

	private readonly _viewZoneInfo;

	private readonly _div;

	readonly isHovered;

	readonly minEditorScrollHeight;

	constructor(
		private readonly _editor: ObservableCodeEditor,
		private readonly _edit: IObservable<{
			originalRange: LineRange;
			modifiedRange: LineRange;
			modifiedLines: string[];
			replacements: Replacement[];
		} | undefined>,
		private readonly _isInDiffEditor: IObservable<boolean>,
		private readonly _tabAction: IObservable<InlineEditTabAction>,
		@ILanguageService private readonly _languageService: ILanguageService,
		@IThemeService private readonly _themeService: IThemeService,
	) {
		super();
		this._maxPrefixTrim = this._edit.map((e, reader) => e ? getPrefixTrim(e.replacements.flatMap(r => [r.originalRange, r.modifiedRange]), e.originalRange, e.modifiedLines, this._editor.editor, reader) : undefined);
		this._modifiedLineElements = derived(this, reader => {
			const lines = [];
			let requiredWidth = 0;

			const prefixTrim = this._maxPrefixTrim.read(reader);
			const edit = this._edit.read(reader);
			if (!edit || !prefixTrim) {
				return undefined;
			}

			const maxPrefixTrim = prefixTrim.prefixTrim;
			const modifiedBubbles = rangesToBubbleRanges(edit.replacements.map(r => r.modifiedRange)).map(r => new Range(r.startLineNumber, r.startColumn - maxPrefixTrim, r.endLineNumber, r.endColumn - maxPrefixTrim));

			const textModel = this._editor.model.get()!;
			const startLineNumber = edit.modifiedRange.startLineNumber;
			for (let i = 0; i < edit.modifiedRange.length; i++) {
				const line = document.createElement('div');
				const lineNumber = startLineNumber + i;
				const modLine = edit.modifiedLines[i].slice(maxPrefixTrim);

				const t = textModel.tokenization.tokenizeLinesAt(lineNumber, [modLine])?.[0];
				let tokens: LineTokens;
				if (t) {
					tokens = TokenArray.fromLineTokens(t).toLineTokens(modLine, this._languageService.languageIdCodec);
				} else {
					tokens = LineTokens.createEmpty(modLine, this._languageService.languageIdCodec);
				}

				const decorations = [];
				for (const modified of modifiedBubbles.filter(b => b.startLineNumber === lineNumber)) {
					const validatedEndColumn = Math.min(modified.endColumn, modLine.length + 1);
					decorations.push(new InlineDecoration(new Range(1, modified.startColumn, 1, validatedEndColumn), 'inlineCompletions-modified-bubble', InlineDecorationType.Regular));
				}

				// TODO: All lines should be rendered at once for one dom element
				const result = renderLines(new LineSource([tokens]), RenderOptions.fromEditor(this._editor.editor).withSetWidth(false).withScrollBeyondLastColumn(0), decorations, line, true);
				this._editor.getOption(EditorOption.fontInfo).read(reader); // update when font info changes

				requiredWidth = Math.max(requiredWidth, result.minWidthInPx);

				lines.push(line);
			}

			return { lines, requiredWidth: requiredWidth };
		});
		this._layout = derived(this, reader => {
			const modifiedLines = this._modifiedLineElements.read(reader);
			const maxPrefixTrim = this._maxPrefixTrim.read(reader);
			const edit = this._edit.read(reader);
			if (!modifiedLines || !maxPrefixTrim || !edit) {
				return undefined;
			}

			const { prefixLeftOffset } = maxPrefixTrim;
			const { requiredWidth } = modifiedLines;

			const originalLineHeights = this._editor.observeLineHeightsForLineRange(edit.originalRange).read(reader);
			const modifiedLineHeights = (() => {
				const lineHeights = originalLineHeights.slice(0, edit.modifiedRange.length);
				while (lineHeights.length < edit.modifiedRange.length) {
					lineHeights.push(originalLineHeights[originalLineHeights.length - 1]);
				}
				return lineHeights;
			})();

			const contentLeft = this._editor.layoutInfoContentLeft.read(reader);
			const verticalScrollbarWidth = this._editor.layoutInfoVerticalScrollbarWidth.read(reader);
			const scrollLeft = this._editor.scrollLeft.read(reader);
			const scrollTop = this._editor.scrollTop.read(reader);
			const editorLeftOffset = contentLeft - scrollLeft;

			const textModel = this._editor.editor.getModel()!;

			const originalLineWidths = edit.originalRange.mapToLineArray(line => this._editor.editor.getOffsetForColumn(line, textModel.getLineMaxColumn(line)) - prefixLeftOffset);
			const maxLineWidth = Math.max(...originalLineWidths, requiredWidth);

			const startLineNumber = edit.originalRange.startLineNumber;
			const endLineNumber = edit.originalRange.endLineNumberExclusive - 1;
			const topOfOriginalLines = this._editor.editor.getTopForLineNumber(startLineNumber) - scrollTop;
			const bottomOfOriginalLines = this._editor.editor.getBottomForLineNumber(endLineNumber) - scrollTop;

			// Box Widget positioning
			const originalLinesOverlay = Rect.fromLeftTopWidthHeight(
				editorLeftOffset + prefixLeftOffset,
				topOfOriginalLines,
				maxLineWidth,
				bottomOfOriginalLines - topOfOriginalLines
			);
			const modifiedLinesOverlay = Rect.fromLeftTopWidthHeight(
				originalLinesOverlay.left,
				originalLinesOverlay.bottom,
				originalLinesOverlay.width,
				modifiedLineHeights.reduce((sum, h) => sum + h, 0)
			);
			const background = Rect.hull([originalLinesOverlay, modifiedLinesOverlay]);

			const lowerBackground = background.intersectVertical(new OffsetRange(originalLinesOverlay.bottom, Number.MAX_SAFE_INTEGER));
			const lowerText = new Rect(lowerBackground.left, lowerBackground.top, lowerBackground.right, lowerBackground.bottom);

			return {
				originalLinesOverlay,
				modifiedLinesOverlay,
				background,
				lowerBackground,
				lowerText,
				modifiedLineHeights,
				minContentWidthRequired: prefixLeftOffset + maxLineWidth + verticalScrollbarWidth,
			};
		});
		this._viewZoneInfo = derived<{ height: number; lineNumber: number } | undefined>(reader => {
			const shouldShowViewZone = this._editor.getOption(EditorOption.inlineSuggest).map(o => o.edits.allowCodeShifting === 'always').read(reader);
			if (!shouldShowViewZone) {
				return undefined;
			}

			const layout = this._layout.read(reader);
			const edit = this._edit.read(reader);
			if (!layout || !edit) {
				return undefined;
			}

			const viewZoneHeight = layout.lowerBackground.height;
			const viewZoneLineNumber = edit.originalRange.endLineNumberExclusive;
			return { height: viewZoneHeight, lineNumber: viewZoneLineNumber };
		});
		this.minEditorScrollHeight = derived(this, reader => {
			const layout = mapOutFalsy(this._layout).read(reader);
			if (!layout || this._viewZoneInfo.read(reader) !== undefined) {
				return 0;
			}
			return layout.read(reader).lowerText.bottom + this._editor.editor.getScrollTop();
		});
		this._div = n.div({
			class: 'line-replacement',
		}, [
			derived(this, reader => {
				const layout = mapOutFalsy(this._layout).read(reader);
				const modifiedLineElements = this._modifiedLineElements.read(reader);
				if (!layout || !modifiedLineElements) {
					return [];
				}

				const layoutProps = layout.read(reader);
				const contentLeft = this._editor.layoutInfoContentLeft.read(reader);

				const separatorWidth = this._isInDiffEditor.read(reader) ? 3 : 1;

				modifiedLineElements.lines.forEach((l, i) => {
					l.style.width = `${layoutProps.lowerText.width}px`;
					l.style.height = `${layoutProps.modifiedLineHeights[i]}px`;
					l.style.position = 'relative';
				});

				const modifiedBorderColor = getModifiedBorderColor(this._tabAction).read(reader);
				const originalBorderColor = getOriginalBorderColor(this._tabAction).read(reader);

				return [
					n.div({
						style: {
							position: 'absolute',
							...rectToProps((r) => getEditorValidOverlayRect(this._editor).read(r)),
							overflow: 'hidden',
							pointerEvents: 'none',
						}
					}, [
						n.div({
							class: 'borderAroundLineReplacement',
							style: {
								position: 'absolute',
								...rectToProps(reader => layout.read(reader).background.translateX(-contentLeft).withMargin(separatorWidth)),
								borderRadius: `${INLINE_EDITS_BORDER_RADIUS}px`,

								border: `${separatorWidth + 1}px solid ${asCssVariable(editorBackground)}`,
								boxSizing: 'border-box',
								pointerEvents: 'none',
							}
						}),
						n.div({
							class: 'originalOverlayLineReplacement',
							style: {
								position: 'absolute',
								...rectToProps(reader => layout.read(reader).background.translateX(-contentLeft)),
								borderRadius: `${INLINE_EDITS_BORDER_RADIUS}px`,

								border: getEditorBlendedColor(originalBorderColor, this._themeService).map(c => `1px solid ${c.toString()}`),
								pointerEvents: 'none',
								boxSizing: 'border-box',
								background: asCssVariable(originalBackgroundColor),
							}
						}),
						n.div({
							class: 'modifiedOverlayLineReplacement',
							style: {
								position: 'absolute',
								...rectToProps(reader => layout.read(reader).lowerBackground.translateX(-contentLeft)),
								borderRadius: `0 0 ${INLINE_EDITS_BORDER_RADIUS}px ${INLINE_EDITS_BORDER_RADIUS}px`,
								background: asCssVariable(editorBackground),
								boxShadow: `${asCssVariable(scrollbarShadow)} 0 6px 6px -6px`,
								border: `1px solid ${asCssVariable(modifiedBorderColor)}`,
								boxSizing: 'border-box',
								overflow: 'hidden',
								cursor: 'pointer',
								pointerEvents: 'auto',
							},
							onmousedown: e => {
								e.preventDefault(); // This prevents that the editor loses focus
							},
							onclick: (e) => this._onDidClick.fire(InlineEditClickEvent.create(e)),
						}, [
							n.div({
								style: {
									position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
									background: asCssVariable(modifiedChangedLineBackgroundColor),
								},
							})
						]),
						n.div({
							class: 'modifiedLinesLineReplacement',
							style: {
								position: 'absolute',
								boxSizing: 'border-box',
								...rectToProps(reader => layout.read(reader).lowerText.translateX(-contentLeft)),
								fontFamily: this._editor.getOption(EditorOption.fontFamily),
								fontSize: this._editor.getOption(EditorOption.fontSize),
								fontWeight: this._editor.getOption(EditorOption.fontWeight),
								pointerEvents: 'none',
								whiteSpace: 'nowrap',
								borderRadius: `0 0 ${INLINE_EDITS_BORDER_RADIUS}px ${INLINE_EDITS_BORDER_RADIUS}px`,
								overflow: 'hidden',
							}
						}, [...modifiedLineElements.lines]),
					])
				];
			})
		]).keepUpdated(this._store);
		this.isHovered = this._editor.isTargetHovered((e) => this._isMouseOverWidget(e), this._store);
		this._previousViewZoneInfo = undefined;

		this._register(toDisposable(() => this._editor.editor.changeViewZones(accessor => this.removePreviousViewZone(accessor))));

		this._register(autorunDelta(this._viewZoneInfo, ({ lastValue, newValue }) => {
			if (lastValue === newValue || (lastValue?.height === newValue?.height && lastValue?.lineNumber === newValue?.lineNumber)) {
				return;
			}
			this._editor.editor.changeViewZones((changeAccessor) => {
				this.removePreviousViewZone(changeAccessor);
				if (!newValue) { return; }
				this.addViewZone(newValue, changeAccessor);
			});
		}));

		this._register(this._editor.createOverlayWidget({
			domNode: this._div.element,
			minContentWidthInPx: derived(this, reader => {
				return this._layout.read(reader)?.minContentWidthRequired ?? 0;
			}),
			position: constObservable({ preference: { top: 0, left: 0 } }),
			allowEditorOverflow: false,
		}));
	}

	private _isMouseOverWidget(e: IEditorMouseEvent): boolean {
		const layout = this._layout.get();
		if (!layout || !(e.event instanceof EditorMouseEvent)) {
			return false;
		}

		return layout.lowerBackground.containsPoint(new Point(e.event.relativePos.x, e.event.relativePos.y));
	}

	// View Zones
	private _previousViewZoneInfo: { height: number; lineNumber: number; id: string } | undefined;

	private removePreviousViewZone(changeAccessor: IViewZoneChangeAccessor) {
		if (!this._previousViewZoneInfo) {
			return;
		}

		changeAccessor.removeZone(this._previousViewZoneInfo.id);

		const cursorLineNumber = this._editor.cursorLineNumber.get();
		if (cursorLineNumber !== null && cursorLineNumber >= this._previousViewZoneInfo.lineNumber) {
			this._editor.editor.setScrollTop(this._editor.scrollTop.get() - this._previousViewZoneInfo.height);
		}

		this._previousViewZoneInfo = undefined;
	}

	private addViewZone(viewZoneInfo: { height: number; lineNumber: number }, changeAccessor: IViewZoneChangeAccessor) {
		const activeViewZone = changeAccessor.addZone({
			afterLineNumber: viewZoneInfo.lineNumber - 1,
			heightInPx: viewZoneInfo.height, // move computation to layout?
			domNode: $('div'),
		});

		this._previousViewZoneInfo = { height: viewZoneInfo.height, lineNumber: viewZoneInfo.lineNumber, id: activeViewZone };

		const cursorLineNumber = this._editor.cursorLineNumber.get();
		if (cursorLineNumber !== null && cursorLineNumber >= viewZoneInfo.lineNumber) {
			this._editor.editor.setScrollTop(this._editor.scrollTop.get() + viewZoneInfo.height);
		}
	}
}

function rangesToBubbleRanges(ranges: Range[]): Range[] {
	const result: Range[] = [];
	while (ranges.length) {
		let range = ranges.shift()!;
		if (range.startLineNumber !== range.endLineNumber) {
			ranges.push(new Range(range.startLineNumber + 1, 1, range.endLineNumber, range.endColumn));
			range = new Range(range.startLineNumber, range.startColumn, range.startLineNumber, Number.MAX_SAFE_INTEGER); // TODO: this is not correct
		}

		result.push(range);
	}
	return result;

}

export interface Replacement {
	originalRange: Range;
	modifiedRange: Range;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsSideBySideView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsSideBySideView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { $, getWindow, n } from '../../../../../../../base/browser/dom.js';
import { Color } from '../../../../../../../base/common/color.js';
import { Emitter } from '../../../../../../../base/common/event.js';
import { Disposable } from '../../../../../../../base/common/lifecycle.js';
import { IObservable, IReader, autorun, constObservable, derived, derivedObservableWithCache, observableFromEvent } from '../../../../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../../../../platform/instantiation/common/instantiation.js';
import { editorBackground } from '../../../../../../../platform/theme/common/colorRegistry.js';
import { asCssVariable, asCssVariableWithDefault } from '../../../../../../../platform/theme/common/colorUtils.js';
import { IThemeService } from '../../../../../../../platform/theme/common/themeService.js';
import { ICodeEditor } from '../../../../../../browser/editorBrowser.js';
import { observableCodeEditor } from '../../../../../../browser/observableCodeEditor.js';
import { Rect } from '../../../../../../common/core/2d/rect.js';
import { EmbeddedCodeEditorWidget } from '../../../../../../browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { OffsetRange } from '../../../../../../common/core/ranges/offsetRange.js';
import { Position } from '../../../../../../common/core/position.js';
import { Range } from '../../../../../../common/core/range.js';
import { ITextModel } from '../../../../../../common/model.js';
import { StickyScrollController } from '../../../../../stickyScroll/browser/stickyScrollController.js';
import { InlineCompletionContextKeys } from '../../../controller/inlineCompletionContextKeys.js';
import { IInlineEditsView, InlineEditClickEvent, InlineEditTabAction } from '../inlineEditsViewInterface.js';
import { InlineEditWithChanges } from '../inlineEditWithChanges.js';
import { getEditorBlendedColor, getModifiedBorderColor, getOriginalBorderColor, INLINE_EDITS_BORDER_RADIUS, modifiedBackgroundColor, originalBackgroundColor } from '../theme.js';
import { PathBuilder, getContentRenderWidth, getOffsetForPos, mapOutFalsy, maxContentWidthInRange, observeEditorBoundingClientRect } from '../utils/utils.js';

const HORIZONTAL_PADDING = 0;
const VERTICAL_PADDING = 0;
const ENABLE_OVERFLOW = false;

const BORDER_WIDTH = 1;
const WIDGET_SEPARATOR_WIDTH = 1;
const WIDGET_SEPARATOR_DIFF_EDITOR_WIDTH = 3;
const BORDER_RADIUS = INLINE_EDITS_BORDER_RADIUS;
const ORIGINAL_END_PADDING = 20;
const MODIFIED_END_PADDING = 12;

export class InlineEditsSideBySideView extends Disposable implements IInlineEditsView {

	// This is an approximation and should be improved by using the real parameters used bellow
	static fitsInsideViewport(editor: ICodeEditor, textModel: ITextModel, edit: InlineEditWithChanges, reader: IReader): boolean {
		const editorObs = observableCodeEditor(editor);
		const editorWidth = editorObs.layoutInfoWidth.read(reader);
		const editorContentLeft = editorObs.layoutInfoContentLeft.read(reader);
		const editorVerticalScrollbar = editor.getLayoutInfo().verticalScrollbarWidth;
		const minimapWidth = editorObs.layoutInfoMinimap.read(reader).minimapLeft !== 0 ? editorObs.layoutInfoMinimap.read(reader).minimapWidth : 0;

		const maxOriginalContent = maxContentWidthInRange(editorObs, edit.displayRange, undefined/* do not reconsider on each layout info change */);
		const maxModifiedContent = edit.lineEdit.newLines.reduce((max, line) => Math.max(max, getContentRenderWidth(line, editor, textModel)), 0);
		const originalPadding = ORIGINAL_END_PADDING; // padding after last line of original editor
		const modifiedPadding = MODIFIED_END_PADDING + 2 * BORDER_WIDTH; // padding after last line of modified editor

		return maxOriginalContent + maxModifiedContent + originalPadding + modifiedPadding < editorWidth - editorContentLeft - editorVerticalScrollbar - minimapWidth;
	}

	private readonly _editorObs;

	private readonly _onDidClick = this._register(new Emitter<InlineEditClickEvent>());
	readonly onDidClick = this._onDidClick.event;

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _edit: IObservable<InlineEditWithChanges | undefined>,
		private readonly _previewTextModel: ITextModel,
		private readonly _uiState: IObservable<{
			newTextLineCount: number;
			isInDiffEditor: boolean;
		} | undefined>,
		private readonly _tabAction: IObservable<InlineEditTabAction>,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IThemeService private readonly _themeService: IThemeService,
	) {
		super();
		this._editorObs = observableCodeEditor(this._editor);
		this._display = derived(this, reader => !!this._uiState.read(reader) ? 'block' : 'none');
		this.previewRef = n.ref<HTMLDivElement>();
		const separatorWidthObs = this._uiState.map(s => s?.isInDiffEditor ? WIDGET_SEPARATOR_DIFF_EDITOR_WIDTH : WIDGET_SEPARATOR_WIDTH);
		this._editorContainer = n.div({
			class: ['editorContainer'],
			style: { position: 'absolute', overflow: 'hidden', cursor: 'pointer' },
			onmousedown: e => {
				e.preventDefault(); // This prevents that the editor loses focus
			},
			onclick: (e) => {
				this._onDidClick.fire(InlineEditClickEvent.create(e));
			}
		}, [
			n.div({ class: 'preview', style: { pointerEvents: 'none' }, ref: this.previewRef }),
		]).keepUpdated(this._store);
		this.isHovered = this._editorContainer.didMouseMoveDuringHover;
		this.previewEditor = this._register(this._instantiationService.createInstance(
			EmbeddedCodeEditorWidget,
			this.previewRef.element,
			{
				glyphMargin: false,
				lineNumbers: 'off',
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
				folding: false,
				selectOnLineNumbers: false,
				selectionHighlight: false,
				columnSelection: false,
				overviewRulerBorder: false,
				overviewRulerLanes: 0,
				lineDecorationsWidth: 0,
				lineNumbersMinChars: 0,
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
			this._editor
		));
		this._previewEditorObs = observableCodeEditor(this.previewEditor);
		this._activeViewZones = [];
		this._updatePreviewEditor = derived(this, reader => {
			this._editorContainer.readEffect(reader);
			this._previewEditorObs.model.read(reader); // update when the model is set

			// Setting this here explicitly to make sure that the preview editor is
			// visible when needed, we're also checking that these fields are defined
			// because of the auto run initial
			// Before removing these, verify with a non-monospace font family
			this._display.read(reader);
			if (this._nonOverflowView) {
				this._nonOverflowView.element.style.display = this._display.read(reader);
			}

			const uiState = this._uiState.read(reader);
			const edit = this._edit.read(reader);
			if (!uiState || !edit) {
				return;
			}

			const range = edit.originalLineRange;

			const hiddenAreas: Range[] = [];
			if (range.startLineNumber > 1) {
				hiddenAreas.push(new Range(1, 1, range.startLineNumber - 1, 1));
			}
			if (range.startLineNumber + uiState.newTextLineCount < this._previewTextModel.getLineCount() + 1) {
				hiddenAreas.push(new Range(range.startLineNumber + uiState.newTextLineCount, 1, this._previewTextModel.getLineCount() + 1, 1));
			}

			this.previewEditor.setHiddenAreas(hiddenAreas, undefined, true);

			// TODO: is this the proper way to handle viewzones?
			const previousViewZones = [...this._activeViewZones];
			this._activeViewZones = [];

			const reducedLinesCount = (range.endLineNumberExclusive - range.startLineNumber) - uiState.newTextLineCount;
			this.previewEditor.changeViewZones((changeAccessor) => {
				previousViewZones.forEach(id => changeAccessor.removeZone(id));

				if (reducedLinesCount > 0) {
					this._activeViewZones.push(changeAccessor.addZone({
						afterLineNumber: range.startLineNumber + uiState.newTextLineCount - 1,
						heightInLines: reducedLinesCount,
						showInHiddenAreas: true,
						domNode: $('div.diagonal-fill.inline-edits-view-zone'),
					}));
				}
			});
		});
		this._previewEditorWidth = derived(this, reader => {
			const edit = this._edit.read(reader);
			if (!edit) { return 0; }
			this._updatePreviewEditor.read(reader);

			return maxContentWidthInRange(this._previewEditorObs, edit.modifiedLineRange, reader);
		});
		this._cursorPosIfTouchesEdit = derived(this, reader => {
			const cursorPos = this._editorObs.cursorPosition.read(reader);
			const edit = this._edit.read(reader);
			if (!edit || !cursorPos) { return undefined; }
			return edit.modifiedLineRange.contains(cursorPos.lineNumber) ? cursorPos : undefined;
		});
		this._originalStartPosition = derived(this, (reader) => {
			const inlineEdit = this._edit.read(reader);
			return inlineEdit ? new Position(inlineEdit.originalLineRange.startLineNumber, 1) : null;
		});
		this._originalEndPosition = derived(this, (reader) => {
			const inlineEdit = this._edit.read(reader);
			return inlineEdit ? new Position(inlineEdit.originalLineRange.endLineNumberExclusive, 1) : null;
		});
		this._originalVerticalStartPosition = this._editorObs.observePosition(this._originalStartPosition, this._store).map(p => p?.y);
		this._originalVerticalEndPosition = this._editorObs.observePosition(this._originalEndPosition, this._store).map(p => p?.y);
		this._originalDisplayRange = this._edit.map(e => e?.displayRange);
		this._editorMaxContentWidthInRange = derived(this, reader => {
			const originalDisplayRange = this._originalDisplayRange.read(reader);
			if (!originalDisplayRange) {
				return constObservable(0);
			}
			this._editorObs.versionId.read(reader);

			// Take the max value that we observed.
			// Reset when either the edit changes or the editor text version.
			return derivedObservableWithCache<number>(this, (reader, lastValue) => {
				const maxWidth = maxContentWidthInRange(this._editorObs, originalDisplayRange, reader);
				return Math.max(maxWidth, lastValue ?? 0);
			});
		}).map((v, r) => v.read(r));

		const editorDomContentRect = observeEditorBoundingClientRect(this._editor, this._store);

		this._previewEditorLayoutInfo = derived(this, (reader) => {
			const inlineEdit = this._edit.read(reader);
			if (!inlineEdit) {
				return null;
			}
			const state = this._uiState.read(reader);
			if (!state) {
				return null;
			}

			const range = inlineEdit.originalLineRange;

			const horizontalScrollOffset = this._editorObs.scrollLeft.read(reader);

			const editorContentMaxWidthInRange = this._editorMaxContentWidthInRange.read(reader);
			const editorLayout = this._editorObs.layoutInfo.read(reader);
			const previewContentWidth = this._previewEditorWidth.read(reader);
			const editorContentAreaWidth = editorLayout.contentWidth - editorLayout.verticalScrollbarWidth;
			const editorBoundingClientRect = editorDomContentRect.read(reader);
			const clientContentAreaRight = editorLayout.contentLeft + editorLayout.contentWidth + editorBoundingClientRect.left;
			const remainingWidthRightOfContent = getWindow(this._editor.getContainerDomNode()).innerWidth - clientContentAreaRight;
			const remainingWidthRightOfEditor = getWindow(this._editor.getContainerDomNode()).innerWidth - editorBoundingClientRect.right;
			const desiredMinimumWidth = Math.min(editorLayout.contentWidth * 0.3, previewContentWidth, 100);
			const IN_EDITOR_DISPLACEMENT = 0;
			const maximumAvailableWidth = IN_EDITOR_DISPLACEMENT + remainingWidthRightOfContent;

			const cursorPos = this._cursorPosIfTouchesEdit.read(reader);

			const maxPreviewEditorLeft = Math.max(
				// We're starting from the content area right and moving it left by IN_EDITOR_DISPLACEMENT and also by an amount to ensure some minimum desired width
				editorContentAreaWidth + horizontalScrollOffset - IN_EDITOR_DISPLACEMENT - Math.max(0, desiredMinimumWidth - maximumAvailableWidth),
				// But we don't want that the moving left ends up covering the cursor, so this will push it to the right again
				Math.min(
					cursorPos ? getOffsetForPos(this._editorObs, cursorPos, reader) + 50 : 0,
					editorContentAreaWidth + horizontalScrollOffset
				)
			);
			const previewEditorLeftInTextArea = Math.min(editorContentMaxWidthInRange + ORIGINAL_END_PADDING, maxPreviewEditorLeft);

			const maxContentWidth = editorContentMaxWidthInRange + ORIGINAL_END_PADDING + previewContentWidth + 70;

			const dist = maxPreviewEditorLeft - previewEditorLeftInTextArea;

			let desiredPreviewEditorScrollLeft;
			let codeRight;
			if (previewEditorLeftInTextArea > horizontalScrollOffset) {
				desiredPreviewEditorScrollLeft = 0;
				codeRight = editorLayout.contentLeft + previewEditorLeftInTextArea - horizontalScrollOffset;
			} else {
				desiredPreviewEditorScrollLeft = horizontalScrollOffset - previewEditorLeftInTextArea;
				codeRight = editorLayout.contentLeft;
			}

			const selectionTop = this._originalVerticalStartPosition.read(reader) ?? this._editor.getTopForLineNumber(range.startLineNumber) - this._editorObs.scrollTop.read(reader);
			const selectionBottom = this._originalVerticalEndPosition.read(reader) ?? this._editor.getBottomForLineNumber(range.endLineNumberExclusive - 1) - this._editorObs.scrollTop.read(reader);

			// TODO: const { prefixLeftOffset } = getPrefixTrim(inlineEdit.edit.edits.map(e => e.range), inlineEdit.originalLineRange, [], this._editor);
			const codeLeft = editorLayout.contentLeft - horizontalScrollOffset;

			let codeRect = Rect.fromLeftTopRightBottom(codeLeft, selectionTop, codeRight, selectionBottom);
			const isInsertion = codeRect.height === 0;
			if (!isInsertion) {
				codeRect = codeRect.withMargin(VERTICAL_PADDING, HORIZONTAL_PADDING);
			}

			const previewLineHeights = this._previewEditorObs.observeLineHeightsForLineRange(inlineEdit.modifiedLineRange).read(reader);
			const editHeight = previewLineHeights.reduce((acc, h) => acc + h, 0);
			const codeHeight = selectionBottom - selectionTop;
			const previewEditorHeight = Math.max(codeHeight, editHeight);

			const clipped = dist === 0;
			const codeEditDist = 0;
			const previewEditorWidth = Math.min(previewContentWidth + MODIFIED_END_PADDING, remainingWidthRightOfEditor + editorLayout.width - editorLayout.contentLeft - codeEditDist);

			let editRect = Rect.fromLeftTopWidthHeight(codeRect.right + codeEditDist, selectionTop, previewEditorWidth, previewEditorHeight);
			if (!isInsertion) {
				editRect = editRect.withMargin(VERTICAL_PADDING, HORIZONTAL_PADDING).translateX(HORIZONTAL_PADDING + BORDER_WIDTH);
			} else {
				// Align top of edit with insertion line
				editRect = editRect.withMargin(VERTICAL_PADDING, HORIZONTAL_PADDING).translateY(VERTICAL_PADDING);
			}

			// debugView(debugLogRects({ codeRect, editRect }, this._editor.getDomNode()!), reader);

			return {
				codeRect,
				editRect,
				codeScrollLeft: horizontalScrollOffset,
				contentLeft: editorLayout.contentLeft,

				isInsertion,
				maxContentWidth,
				shouldShowShadow: clipped,
				desiredPreviewEditorScrollLeft,
				previewEditorWidth,
			};
		});
		this._stickyScrollController = StickyScrollController.get(this._editorObs.editor);
		this._stickyScrollHeight = this._stickyScrollController ? observableFromEvent(this._stickyScrollController.onDidChangeStickyScrollHeight, () => this._stickyScrollController!.stickyScrollWidgetHeight) : constObservable(0);
		this._shouldOverflow = derived(this, reader => {
			if (!ENABLE_OVERFLOW) {
				return false;
			}
			const range = this._edit.read(reader)?.originalLineRange;
			if (!range) {
				return false;
			}
			const stickyScrollHeight = this._stickyScrollHeight.read(reader);
			const top = this._editor.getTopForLineNumber(range.startLineNumber) - this._editorObs.scrollTop.read(reader);
			if (top <= stickyScrollHeight) {
				return false;
			}
			const bottom = this._editor.getTopForLineNumber(range.endLineNumberExclusive) - this._editorObs.scrollTop.read(reader);
			if (bottom >= this._editorObs.layoutInfo.read(reader).height) {
				return false;
			}
			return true;
		});
		this._originalBackgroundColor = observableFromEvent(this, this._themeService.onDidColorThemeChange, () => {
			return this._themeService.getColorTheme().getColor(originalBackgroundColor) ?? Color.transparent;
		});
		this._backgroundSvg = n.svg({
			transform: 'translate(-0.5 -0.5)',
			style: { overflow: 'visible', pointerEvents: 'none', position: 'absolute' },
		}, [
			n.svgElem('path', {
				class: 'rightOfModifiedBackgroundCoverUp',
				d: derived(this, reader => {
					const layoutInfo = this._previewEditorLayoutInfo.read(reader);
					if (!layoutInfo) {
						return undefined;
					}
					const originalBackgroundColor = this._originalBackgroundColor.read(reader);
					if (originalBackgroundColor.isTransparent()) {
						return undefined;
					}

					return new PathBuilder()
						.moveTo(layoutInfo.codeRect.getRightTop())
						.lineTo(layoutInfo.codeRect.getRightTop().deltaX(1000))
						.lineTo(layoutInfo.codeRect.getRightBottom().deltaX(1000))
						.lineTo(layoutInfo.codeRect.getRightBottom())
						.build();
				}),
				style: {
					fill: asCssVariableWithDefault(editorBackground, 'transparent'),
				}
			}),
		]).keepUpdated(this._store);
		this._originalOverlay = n.div({
			style: { pointerEvents: 'none', display: this._previewEditorLayoutInfo.map(layoutInfo => layoutInfo?.isInsertion ? 'none' : 'block') },
		}, derived(this, reader => {
			const layoutInfoObs = mapOutFalsy(this._previewEditorLayoutInfo).read(reader);
			if (!layoutInfoObs) { return undefined; }

			const separatorWidth = separatorWidthObs.read(reader);
			const borderStyling = getOriginalBorderColor(this._tabAction).map(bc => `${BORDER_WIDTH}px solid ${asCssVariable(bc)}`);
			const borderStylingSeparator = `${BORDER_WIDTH + separatorWidth}px solid ${asCssVariable(editorBackground)}`;

			const hasBorderLeft = layoutInfoObs.read(reader).codeScrollLeft !== 0;
			const isModifiedLower = layoutInfoObs.map(layoutInfo => layoutInfo.codeRect.bottom < layoutInfo.editRect.bottom);
			const transitionRectSize = BORDER_RADIUS * 2 + BORDER_WIDTH * 2;

			// Create an overlay which hides the left hand side of the original overlay when it overflows to the left
			// such that there is a smooth transition at the edge of content left
			const overlayHider = layoutInfoObs.map(layoutInfo => Rect.fromLeftTopRightBottom(
				layoutInfo.contentLeft - BORDER_RADIUS - BORDER_WIDTH,
				layoutInfo.codeRect.top,
				layoutInfo.contentLeft,
				layoutInfo.codeRect.bottom + transitionRectSize
			)).read(reader);

			const intersectionLine = new OffsetRange(overlayHider.left, Number.MAX_SAFE_INTEGER);
			const overlayRect = layoutInfoObs.map(layoutInfo => layoutInfo.codeRect.intersectHorizontal(intersectionLine));
			const separatorRect = overlayRect.map(overlayRect => overlayRect.withMargin(separatorWidth, 0, separatorWidth, separatorWidth).intersectHorizontal(intersectionLine));

			const transitionRect = overlayRect.map(overlayRect => Rect.fromLeftTopWidthHeight(overlayRect.right - transitionRectSize + BORDER_WIDTH, overlayRect.bottom - BORDER_WIDTH, transitionRectSize, transitionRectSize).intersectHorizontal(intersectionLine));

			return [
				n.div({
					class: 'originalSeparatorSideBySide',
					style: {
						...separatorRect.read(reader).toStyles(),
						boxSizing: 'border-box',
						borderRadius: `${BORDER_RADIUS}px 0 0 ${BORDER_RADIUS}px`,
						borderTop: borderStylingSeparator,
						borderBottom: borderStylingSeparator,
						borderLeft: hasBorderLeft ? 'none' : borderStylingSeparator,
					}
				}),

				n.div({
					class: 'originalOverlaySideBySide',
					style: {
						...overlayRect.read(reader).toStyles(),
						boxSizing: 'border-box',
						borderRadius: `${BORDER_RADIUS}px 0 0 ${BORDER_RADIUS}px`,
						borderTop: borderStyling,
						borderBottom: borderStyling,
						borderLeft: hasBorderLeft ? 'none' : borderStyling,
						backgroundColor: asCssVariable(originalBackgroundColor),
					}
				}),

				n.div({
					class: 'originalCornerCutoutSideBySide',
					style: {
						pointerEvents: 'none',
						display: isModifiedLower.map(isLower => isLower ? 'block' : 'none'),
						...transitionRect.read(reader).toStyles(),
					}
				}, [
					n.div({
						class: 'originalCornerCutoutBackground',
						style: {
							position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%',
							backgroundColor: getEditorBlendedColor(originalBackgroundColor, this._themeService).map(c => c.toString()),
						}
					}),
					n.div({
						class: 'originalCornerCutoutBorder',
						style: {
							position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%',
							boxSizing: 'border-box',
							borderTop: borderStyling,
							borderRight: borderStyling,
							borderRadius: `0 100% 0 0`,
							backgroundColor: asCssVariable(editorBackground)
						}
					})
				]),
				n.div({
					class: 'originalOverlaySideBySideHider',
					style: {
						...overlayHider.toStyles(),
						backgroundColor: asCssVariable(editorBackground),
					}
				}),
			];
		})).keepUpdated(this._store);
		this._modifiedOverlay = n.div({
			style: { pointerEvents: 'none', }
		}, derived(this, reader => {
			const layoutInfoObs = mapOutFalsy(this._previewEditorLayoutInfo).read(reader);
			if (!layoutInfoObs) { return undefined; }

			const isModifiedLower = layoutInfoObs.map(layoutInfo => layoutInfo.codeRect.bottom < layoutInfo.editRect.bottom);

			const separatorWidth = separatorWidthObs.read(reader);
			const borderRadius = isModifiedLower.map(isLower => `0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px ${isLower ? BORDER_RADIUS : 0}px`);
			const borderStyling = getEditorBlendedColor(getModifiedBorderColor(this._tabAction), this._themeService).map(c => `1px solid ${c.toString()}`);
			const borderStylingSeparator = `${BORDER_WIDTH + separatorWidth}px solid ${asCssVariable(editorBackground)}`;

			const overlayRect = layoutInfoObs.map(layoutInfo => layoutInfo.editRect.withMargin(0, BORDER_WIDTH));
			const separatorRect = overlayRect.map(overlayRect => overlayRect.withMargin(separatorWidth, separatorWidth, separatorWidth, 0));

			const insertionRect = derived(this, reader => {
				const overlay = overlayRect.read(reader);
				const layoutinfo = layoutInfoObs.read(reader);
				if (!layoutinfo.isInsertion || layoutinfo.contentLeft >= overlay.left) {
					return Rect.fromLeftTopWidthHeight(overlay.left, overlay.top, 0, 0);
				}
				return new Rect(layoutinfo.contentLeft, overlay.top, overlay.left, overlay.top + BORDER_WIDTH * 2);
			});

			return [
				n.div({
					class: 'modifiedInsertionSideBySide',
					style: {
						...insertionRect.read(reader).toStyles(),
						backgroundColor: getModifiedBorderColor(this._tabAction).map(c => asCssVariable(c)),
					}
				}),
				n.div({
					class: 'modifiedSeparatorSideBySide',
					style: {
						...separatorRect.read(reader).toStyles(),
						borderRadius,
						borderTop: borderStylingSeparator,
						borderBottom: borderStylingSeparator,
						borderRight: borderStylingSeparator,
						boxSizing: 'border-box',
					}
				}),
				n.div({
					class: 'modifiedOverlaySideBySide',
					style: {
						...overlayRect.read(reader).toStyles(),
						borderRadius,
						border: borderStyling,
						boxSizing: 'border-box',
						backgroundColor: asCssVariable(modifiedBackgroundColor),
					}
				})
			];
		})).keepUpdated(this._store);
		this._nonOverflowView = n.div({
			class: 'inline-edits-view',
			style: {
				position: 'absolute',
				overflow: 'visible',
				top: '0px',
				left: '0px',
				display: this._display,
			},
		}, [
			this._backgroundSvg,
			derived(this, reader => this._shouldOverflow.read(reader) ? [] : [this._editorContainer, this._originalOverlay, this._modifiedOverlay]),
		]).keepUpdated(this._store);

		this._register(this._editorObs.createOverlayWidget({
			domNode: this._nonOverflowView.element,
			position: constObservable(null),
			allowEditorOverflow: false,
			minContentWidthInPx: derived(this, reader => {
				const x = this._previewEditorLayoutInfo.read(reader)?.maxContentWidth;
				if (x === undefined) { return 0; }
				return x;
			}),
		}));

		this.previewEditor.setModel(this._previewTextModel);

		this._register(autorun(reader => {
			const layoutInfo = this._previewEditorLayoutInfo.read(reader);
			if (!layoutInfo) {
				return;
			}
			const editorRect = layoutInfo.editRect.withMargin(-VERTICAL_PADDING, -HORIZONTAL_PADDING);

			this.previewEditor.layout({ height: editorRect.height, width: layoutInfo.previewEditorWidth + 15 /* Make sure editor does not scroll horizontally */ });
			this._editorContainer.element.style.top = `${editorRect.top}px`;
			this._editorContainer.element.style.left = `${editorRect.left}px`;
			this._editorContainer.element.style.width = `${layoutInfo.previewEditorWidth + HORIZONTAL_PADDING}px`; // Set width to clip view zone
			//this._editorContainer.element.style.borderRadius = `0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0`;
		}));

		this._register(autorun(reader => {
			const layoutInfo = this._previewEditorLayoutInfo.read(reader);
			if (!layoutInfo) {
				return;
			}

			this._previewEditorObs.editor.setScrollLeft(layoutInfo.desiredPreviewEditorScrollLeft);
		}));

		this._updatePreviewEditor.recomputeInitiallyAndOnChange(this._store);
	}

	private readonly _display;

	private readonly previewRef;

	private readonly _editorContainer;

	public readonly isHovered;

	public readonly previewEditor;

	private readonly _previewEditorObs;

	private _activeViewZones: string[];
	private readonly _updatePreviewEditor;

	private readonly _previewEditorWidth;

	private readonly _cursorPosIfTouchesEdit;

	private readonly _originalStartPosition;

	private readonly _originalEndPosition;

	private readonly _originalVerticalStartPosition;
	private readonly _originalVerticalEndPosition;

	private readonly _originalDisplayRange;
	private readonly _editorMaxContentWidthInRange;

	private readonly _previewEditorLayoutInfo;

	private _stickyScrollController;
	private readonly _stickyScrollHeight;

	private readonly _shouldOverflow;

	private readonly _originalBackgroundColor;

	private readonly _backgroundSvg;

	private readonly _originalOverlay;

	private readonly _modifiedOverlay;

	private readonly _nonOverflowView;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsWordInsertView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsWordInsertView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { n } from '../../../../../../../base/browser/dom.js';
import { Event } from '../../../../../../../base/common/event.js';
import { Disposable } from '../../../../../../../base/common/lifecycle.js';
import { constObservable, derived, IObservable } from '../../../../../../../base/common/observable.js';
import { asCssVariable } from '../../../../../../../platform/theme/common/colorUtils.js';
import { ObservableCodeEditor } from '../../../../../../browser/observableCodeEditor.js';
import { Point } from '../../../../../../common/core/2d/point.js';
import { Rect } from '../../../../../../common/core/2d/rect.js';
import { EditorOption } from '../../../../../../common/config/editorOptions.js';
import { OffsetRange } from '../../../../../../common/core/ranges/offsetRange.js';
import { TextReplacement } from '../../../../../../common/core/edits/textEdit.js';
import { IInlineEditsView, InlineEditTabAction } from '../inlineEditsViewInterface.js';
import { getModifiedBorderColor, INLINE_EDITS_BORDER_RADIUS } from '../theme.js';
import { mapOutFalsy, rectToProps } from '../utils/utils.js';

export class InlineEditsWordInsertView extends Disposable implements IInlineEditsView {

	readonly onDidClick = Event.None;

	private readonly _start;

	private readonly _layout;

	private readonly _div;

	readonly isHovered;

	constructor(
		private readonly _editor: ObservableCodeEditor,
		/** Must be single-line in both sides */
		private readonly _edit: TextReplacement,
		private readonly _tabAction: IObservable<InlineEditTabAction>
	) {
		super();
		this._start = this._editor.observePosition(constObservable(this._edit.range.getStartPosition()), this._store);
		this._layout = derived(this, reader => {
			const start = this._start.read(reader);
			if (!start) {
				return undefined;
			}
			const contentLeft = this._editor.layoutInfoContentLeft.read(reader);
			const lineHeight = this._editor.observeLineHeightForPosition(this._edit.range.getStartPosition()).read(reader);

			const w = this._editor.getOption(EditorOption.fontInfo).read(reader).typicalHalfwidthCharacterWidth;
			const width = this._edit.text.length * w + 5;

			const center = new Point(contentLeft + start.x + w / 2 - this._editor.scrollLeft.read(reader), start.y);

			const modified = Rect.fromLeftTopWidthHeight(center.x - width / 2, center.y + lineHeight + 5, width, lineHeight);
			const background = Rect.hull([Rect.fromPoint(center), modified]).withMargin(4);

			return {
				modified,
				center,
				background,
				lowerBackground: background.intersectVertical(new OffsetRange(modified.top - 2, Number.MAX_SAFE_INTEGER)),
			};
		});
		this._div = n.div({
			class: 'word-insert',
		}, [
			derived(this, reader => {
				const layout = mapOutFalsy(this._layout).read(reader);
				if (!layout) {
					return [];
				}

				const modifiedBorderColor = asCssVariable(getModifiedBorderColor(this._tabAction).read(reader));

				return [
					n.div({
						style: {
							position: 'absolute',
							...rectToProps(reader => layout.read(reader).lowerBackground),
							borderRadius: `${INLINE_EDITS_BORDER_RADIUS}px`,
							background: 'var(--vscode-editor-background)'
						}
					}, []),
					n.div({
						style: {
							position: 'absolute',
							...rectToProps(reader => layout.read(reader).modified),
							borderRadius: `${INLINE_EDITS_BORDER_RADIUS}px`,
							padding: '0px',
							textAlign: 'center',
							background: 'var(--vscode-inlineEdit-modifiedChangedTextBackground)',
							fontFamily: this._editor.getOption(EditorOption.fontFamily),
							fontSize: this._editor.getOption(EditorOption.fontSize),
							fontWeight: this._editor.getOption(EditorOption.fontWeight),
						}
					}, [
						this._edit.text,
					]),
					n.div({
						style: {
							position: 'absolute',
							...rectToProps(reader => layout.read(reader).background),
							borderRadius: `${INLINE_EDITS_BORDER_RADIUS}px`,
							border: `1px solid ${modifiedBorderColor}`,
							//background: 'rgba(122, 122, 122, 0.12)', looks better
							background: 'var(--vscode-inlineEdit-wordReplacementView-background)',
						}
					}, []),
					n.svg({
						viewBox: '0 0 12 18',
						width: 12,
						height: 18,
						fill: 'none',
						style: {
							position: 'absolute',
							left: derived(this, reader => layout.read(reader).center.x - 9),
							top: derived(this, reader => layout.read(reader).center.y + 4),
							transform: 'scale(1.4, 1.4)',
						}
					}, [
						n.svgElem('path', {
							d: 'M5.06445 0H7.35759C7.35759 0 7.35759 8.47059 7.35759 11.1176C7.35759 13.7647 9.4552 18 13.4674 18C17.4795 18 -2.58445 18 0.281373 18C3.14719 18 5.06477 14.2941 5.06477 11.1176C5.06477 7.94118 5.06445 0 5.06445 0Z',
							fill: 'var(--vscode-inlineEdit-modifiedChangedTextBackground)',
						})
					])
				];
			})
		]).keepUpdated(this._store);
		this.isHovered = constObservable(false);

		this._register(this._editor.createOverlayWidget({
			domNode: this._div.element,
			minContentWidthInPx: constObservable(0),
			position: constObservable({ preference: { top: 0, left: 0 } }),
			allowEditorOverflow: false,
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsWordReplacementView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/inlineEditsWordReplacementView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, ModifierKeyEmitter, n, ObserverNodeWithElement } from '../../../../../../../base/browser/dom.js';
import { renderIcon } from '../../../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { KeybindingLabel, unthemedKeybindingLabelOptions } from '../../../../../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { IEquatable } from '../../../../../../../base/common/equals.js';
import { Emitter } from '../../../../../../../base/common/event.js';
import { Disposable } from '../../../../../../../base/common/lifecycle.js';
import { constObservable, derived, IObservable, observableFromEvent, observableFromPromise, observableValue } from '../../../../../../../base/common/observable.js';
import { OS } from '../../../../../../../base/common/platform.js';
import { localize } from '../../../../../../../nls.js';
import { IHoverService } from '../../../../../../../platform/hover/browser/hover.js';
import { IKeybindingService } from '../../../../../../../platform/keybinding/common/keybinding.js';
import { editorBackground, editorHoverForeground } from '../../../../../../../platform/theme/common/colorRegistry.js';
import { contrastBorder } from '../../../../../../../platform/theme/common/colors/baseColors.js';
import { asCssVariable } from '../../../../../../../platform/theme/common/colorUtils.js';
import { IThemeService } from '../../../../../../../platform/theme/common/themeService.js';
import { ObservableCodeEditor } from '../../../../../../browser/observableCodeEditor.js';
import { LineSource, renderLines, RenderOptions } from '../../../../../../browser/widget/diffEditor/components/diffEditorViewZones/renderLines.js';
import { EditorOption } from '../../../../../../common/config/editorOptions.js';
import { Point } from '../../../../../../common/core/2d/point.js';
import { Rect } from '../../../../../../common/core/2d/rect.js';
import { StringReplacement } from '../../../../../../common/core/edits/stringEdit.js';
import { TextReplacement } from '../../../../../../common/core/edits/textEdit.js';
import { OffsetRange } from '../../../../../../common/core/ranges/offsetRange.js';
import { ILanguageService } from '../../../../../../common/languages/language.js';
import { LineTokens, TokenArray } from '../../../../../../common/tokens/lineTokens.js';
import { inlineSuggestCommitAlternativeActionId } from '../../../controller/commandIds.js';
import { InlineSuggestAlternativeAction } from '../../../model/InlineSuggestAlternativeAction.js';
import { IInlineEditsView, InlineEditClickEvent, InlineEditTabAction } from '../inlineEditsViewInterface.js';
import { getModifiedBorderColor, getOriginalBorderColor, INLINE_EDITS_BORDER_RADIUS, inlineEditIndicatorPrimaryBackground, inlineEditIndicatorPrimaryBorder, inlineEditIndicatorPrimaryForeground, modifiedChangedTextOverlayColor, observeColor, originalChangedTextOverlayColor } from '../theme.js';
import { getEditorValidOverlayRect, mapOutFalsy, rectToProps } from '../utils/utils.js';

export class WordReplacementsViewData implements IEquatable<WordReplacementsViewData> {
	constructor(
		public readonly edit: TextReplacement,
		public readonly alternativeAction: InlineSuggestAlternativeAction | undefined,
	) { }

	equals(other: WordReplacementsViewData): boolean {
		return this.edit.equals(other.edit) && this.alternativeAction === other.alternativeAction;
	}
}

const BORDER_WIDTH = 1;
const DOM_ID_OVERLAY = 'word-replacement-view-overlay';
const DOM_ID_WIDGET = 'word-replacement-view-widget';
const DOM_ID_REPLACEMENT = 'word-replacement-view-replacement';
const DOM_ID_RENAME = 'word-replacement-view-rename';

export class InlineEditsWordReplacementView extends Disposable implements IInlineEditsView {

	public static MAX_LENGTH = 100;

	private readonly _onDidClick = this._register(new Emitter<InlineEditClickEvent>());
	readonly onDidClick = this._onDidClick.event;

	private readonly _start;
	private readonly _end;

	private readonly _line;

	private readonly _primaryElement;
	private readonly _secondaryElement;

	readonly isHovered;

	readonly minEditorScrollHeight;

	constructor(
		private readonly _editor: ObservableCodeEditor,
		private readonly _viewData: WordReplacementsViewData,
		protected readonly _tabAction: IObservable<InlineEditTabAction>,
		@ILanguageService private readonly _languageService: ILanguageService,
		@IThemeService private readonly _themeService: IThemeService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IHoverService private readonly _hoverService: IHoverService,
	) {
		super();
		this._start = this._editor.observePosition(constObservable(this._viewData.edit.range.getStartPosition()), this._store);
		this._end = this._editor.observePosition(constObservable(this._viewData.edit.range.getEndPosition()), this._store);
		this._line = document.createElement('div');
		this._primaryElement = observableValue<ObserverNodeWithElement | null>(this, null);
		this._secondaryElement = observableValue<ObserverNodeWithElement | null>(this, null);
		this.isHovered = this._primaryElement.map((e, reader) => e?.didMouseMoveDuringHover.read(reader) ?? false);
		this._renderTextEffect = derived(this, _reader => {
			const tm = this._editor.model.get()!;
			const origLine = tm.getLineContent(this._viewData.edit.range.startLineNumber);

			const edit = StringReplacement.replace(new OffsetRange(this._viewData.edit.range.startColumn - 1, this._viewData.edit.range.endColumn - 1), this._viewData.edit.text);
			const lineToTokenize = edit.replace(origLine);
			const t = tm.tokenization.tokenizeLinesAt(this._viewData.edit.range.startLineNumber, [lineToTokenize])?.[0];
			let tokens: LineTokens;
			if (t) {
				tokens = TokenArray.fromLineTokens(t).slice(edit.getRangeAfterReplace()).toLineTokens(this._viewData.edit.text, this._languageService.languageIdCodec);
			} else {
				tokens = LineTokens.createEmpty(this._viewData.edit.text, this._languageService.languageIdCodec);
			}
			const res = renderLines(new LineSource([tokens]), RenderOptions.fromEditor(this._editor.editor).withSetWidth(false).withScrollBeyondLastColumn(0), [], this._line, true);
			this._line.style.width = `${res.minWidthInPx}px`;
		});
		const modifiedLineHeight = this._editor.observeLineHeightForPosition(this._viewData.edit.range.getStartPosition());
		const altCount = observableFromPromise(this._viewData.alternativeAction?.count ?? new Promise<undefined>(resolve => resolve(undefined))).map(c => c.value);
		const altModifierActive = observableFromEvent(this, ModifierKeyEmitter.getInstance().event, () => ModifierKeyEmitter.getInstance().keyStatus.shiftKey);
		this._layout = derived(this, reader => {
			this._renderTextEffect.read(reader);
			const widgetStart = this._start.read(reader);
			const widgetEnd = this._end.read(reader);

			// TODO@hediet better about widgetStart and widgetEnd in a single transaction!
			if (!widgetStart || !widgetEnd || widgetStart.x > widgetEnd.x || widgetStart.y > widgetEnd.y) {
				return undefined;
			}

			const lineHeight = modifiedLineHeight.read(reader);
			const scrollLeft = this._editor.scrollLeft.read(reader);
			const w = this._editor.getOption(EditorOption.fontInfo).read(reader).typicalHalfwidthCharacterWidth;

			const modifiedLeftOffset = 3 * w;
			const modifiedTopOffset = 4;
			const modifiedOffset = new Point(modifiedLeftOffset, modifiedTopOffset);

			let alternativeAction = undefined;
			if (this._viewData.alternativeAction) {
				const label = this._viewData.alternativeAction.label;
				const count = altCount.read(reader);
				const active = altModifierActive.read(reader);
				const occurrencesLabel = count !== undefined ? count === 1 ?
					localize('labelOccurence', "{0} 1 occurrence", label) :
					localize('labelOccurences', "{0} {1} occurrences", label, count)
					: label;
				const keybindingTooltip = localize('shiftToSeeOccurences', "{0} show occurrences", '[shift]');
				alternativeAction = {
					label: count !== undefined ? (active ? occurrencesLabel : label) : label,
					tooltip: occurrencesLabel ? `${occurrencesLabel}\n${keybindingTooltip}` : undefined,
					icon: undefined, //this._viewData.alternativeAction.icon, Do not render icon fo the moment
					count,
					keybinding: this._keybindingService.lookupKeybinding(inlineSuggestCommitAlternativeActionId),
					active: altModifierActive,
				};
			}

			const originalLine = Rect.fromPoints(widgetStart, widgetEnd).withHeight(lineHeight).translateX(-scrollLeft);
			const codeLine = Rect.fromPointSize(originalLine.getLeftBottom().add(modifiedOffset), new Point(this._viewData.edit.text.length * w, originalLine.height));
			const modifiedLine = codeLine.withWidth(codeLine.width + (alternativeAction ? alternativeAction.label.length * w + 8 + 4 + 12 : 0));
			const lowerBackground = modifiedLine.withLeft(originalLine.left);

			// debugView(debugLogRects({ lowerBackground }, this._editor.editor.getContainerDomNode()), reader);

			return {
				alternativeAction,
				originalLine,
				codeLine,
				modifiedLine,
				lowerBackground,
				lineHeight,
			};
		});
		this.minEditorScrollHeight = derived(this, reader => {
			const layout = mapOutFalsy(this._layout).read(reader);
			if (!layout) {
				return 0;
			}
			return layout.read(reader).modifiedLine.bottom + BORDER_WIDTH + this._editor.editor.getScrollTop();
		});
		this._root = n.div({
			class: 'word-replacement',
		}, [
			derived(this, reader => {
				const layout = mapOutFalsy(this._layout).read(reader);
				if (!layout) {
					return [];
				}

				const originalBorderColor = getOriginalBorderColor(this._tabAction).map(c => asCssVariable(c)).read(reader);
				const modifiedBorderColor = getModifiedBorderColor(this._tabAction).map(c => asCssVariable(c)).read(reader);
				this._line.style.lineHeight = `${layout.read(reader).modifiedLine.height + 2 * BORDER_WIDTH}px`;

				const secondaryElementHovered = constObservable(false);//this._secondaryElement.map((e, r) => e?.isHovered.read(r) ?? false);
				const alternativeAction = layout.map(l => l.alternativeAction);
				const alternativeActionActive = derived(reader => (alternativeAction.read(reader)?.active.read(reader) ?? false) || secondaryElementHovered.read(reader));

				const isHighContrast = observableFromEvent(this._themeService.onDidColorThemeChange, () => {
					const theme = this._themeService.getColorTheme();
					return theme.type === 'hcDark' || theme.type === 'hcLight';
				}).read(reader);
				const hcBorderColor = isHighContrast ? observeColor(contrastBorder, this._themeService).read(reader) : null;

				const primaryActiveStyles = {
					borderColor: hcBorderColor ? hcBorderColor.toString() : modifiedBorderColor,
					backgroundColor: asCssVariable(modifiedChangedTextOverlayColor),
					color: '',
					opacity: '1',
				};

				const secondaryActiveStyles = {
					borderColor: hcBorderColor ? hcBorderColor.toString() : asCssVariable(inlineEditIndicatorPrimaryBorder),
					backgroundColor: asCssVariable(inlineEditIndicatorPrimaryBackground),
					color: asCssVariable(inlineEditIndicatorPrimaryForeground),
					opacity: '1',
				};

				const passiveStyles = {
					borderColor: hcBorderColor ? hcBorderColor.toString() : observeColor(editorHoverForeground, this._themeService).map(c => c.transparent(0.2).toString()).read(reader),
					backgroundColor: asCssVariable(editorBackground),
					color: '',
					opacity: '0.7',
				};

				const primaryActionStyles = derived(this, r => alternativeActionActive.read(r) ? primaryActiveStyles : primaryActiveStyles);
				const secondaryActionStyles = derived(this, r => alternativeActionActive.read(r) ? secondaryActiveStyles : passiveStyles);
				// TODO@benibenj clicking the arrow does not accept suggestion anymore
				return [
					n.div({
						id: DOM_ID_OVERLAY,
						style: {
							position: 'absolute',
							...rectToProps((r) => getEditorValidOverlayRect(this._editor).read(r)),
							overflow: 'hidden',
							pointerEvents: 'none',
						}
					}, [
						n.div({
							style: {
								position: 'absolute',
								...rectToProps(reader => layout.read(reader).lowerBackground.withMargin(BORDER_WIDTH, 2 * BORDER_WIDTH, BORDER_WIDTH, 0)),
								background: asCssVariable(editorBackground),
								cursor: 'pointer',
								pointerEvents: 'auto',
							},
							onmousedown: (e) => this._mouseDown(e),
						}),
						n.div({
							id: DOM_ID_WIDGET,
							style: {
								position: 'absolute',
								...rectToProps(reader => layout.read(reader).modifiedLine.withMargin(BORDER_WIDTH, 2 * BORDER_WIDTH)),
								width: undefined,
								pointerEvents: 'auto',
								boxSizing: 'border-box',
								borderRadius: `${INLINE_EDITS_BORDER_RADIUS}px`,

								background: asCssVariable(editorBackground),
								display: 'flex',
								justifyContent: 'left',

								outline: `2px solid ${asCssVariable(editorBackground)}`,
							},
							onmousedown: (e) => this._mouseDown(e),
						}, [
							n.div({
								id: DOM_ID_REPLACEMENT,
								style: {
									fontFamily: this._editor.getOption(EditorOption.fontFamily),
									fontSize: this._editor.getOption(EditorOption.fontSize),
									fontWeight: this._editor.getOption(EditorOption.fontWeight),
									width: rectToProps(reader => layout.read(reader).codeLine.withMargin(BORDER_WIDTH, 2 * BORDER_WIDTH)).width,
									borderRadius: `${INLINE_EDITS_BORDER_RADIUS}px`,
									border: primaryActionStyles.map(s => `${BORDER_WIDTH}px solid ${s.borderColor}`),
									boxSizing: 'border-box',
									padding: `${BORDER_WIDTH}px`,
									opacity: primaryActionStyles.map(s => s.opacity),
									background: primaryActionStyles.map(s => s.backgroundColor),
									display: 'flex',
									justifyContent: 'left',
									alignItems: 'center',
									pointerEvents: 'auto',
									cursor: 'pointer',
								},
								obsRef: (elem) => {
									this._primaryElement.set(elem, undefined);
								}
							}, [this._line]),
							derived(this, reader => {
								const altAction = alternativeAction.read(reader);
								if (!altAction) {
									return undefined;
								}
								const keybinding = document.createElement('div');
								const keybindingLabel = reader.store.add(new KeybindingLabel(keybinding, OS, { ...unthemedKeybindingLabelOptions, disableTitle: true }));
								keybindingLabel.set(altAction.keybinding);

								return n.div({
									id: DOM_ID_RENAME,
									style: {
										position: 'relative',
										borderRadius: `${INLINE_EDITS_BORDER_RADIUS}px`,
										borderTop: `${BORDER_WIDTH}px solid`,
										borderRight: `${BORDER_WIDTH}px solid`,
										borderBottom: `${BORDER_WIDTH}px solid`,
										borderLeft: `${BORDER_WIDTH}px solid`,
										borderColor: secondaryActionStyles.map(s => s.borderColor),
										opacity: secondaryActionStyles.map(s => s.opacity),
										color: secondaryActionStyles.map(s => s.color),
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										padding: '0 4px 0 1px',
										marginLeft: '4px',
										background: secondaryActionStyles.map(s => s.backgroundColor),
										cursor: 'pointer',
										textWrap: 'nowrap',
									},
									class: 'inline-edit-alternative-action-label',
									obsRef: (elem) => {
										this._secondaryElement.set(elem, undefined);
									},
									ref: (elem) => {
										if (altAction.tooltip) {
											reader.store.add(this._hoverService.setupDelayedHoverAtMouse(elem, { content: altAction.tooltip, appearance: { compact: true } }));
										}
									}
								}, [
									keybinding,
									$('div.inline-edit-alternative-action-label-separator'),
									altAction.icon ? renderIcon(altAction.icon) : undefined,
									altAction.label,
								]);
							})
						]),
						n.div({
							style: {
								position: 'absolute',
								...rectToProps(reader => layout.read(reader).originalLine.withMargin(BORDER_WIDTH)),
								boxSizing: 'border-box',
								borderRadius: `${INLINE_EDITS_BORDER_RADIUS}px`,
								border: `${BORDER_WIDTH}px solid ${originalBorderColor}`,
								background: asCssVariable(originalChangedTextOverlayColor),
								pointerEvents: 'none',
							}
						}, []),

						n.svg({
							width: 11,
							height: 14,
							viewBox: '0 0 11 14',
							fill: 'none',
							style: {
								position: 'absolute',
								left: layout.map(l => l.modifiedLine.left - 16),
								top: layout.map(l => l.modifiedLine.top + Math.round((l.lineHeight - 14 - 5) / 2)),
								pointerEvents: 'none',
							},
							onmousedown: (e) => this._mouseDown(e),
						}, [
							n.svgElem('path', {
								d: 'M1 0C1 2.98966 1 5.92087 1 8.49952C1 9.60409 1.89543 10.5 3 10.5H10.5',
								stroke: asCssVariable(editorHoverForeground),
							}),
							n.svgElem('path', {
								d: 'M6 7.5L9.99999 10.49998L6 13.5',
								stroke: asCssVariable(editorHoverForeground),
							})
						]),

					])
				];
			})
		]).keepUpdated(this._store);

		this._register(this._editor.createOverlayWidget({
			domNode: this._root.element,
			minContentWidthInPx: constObservable(0),
			position: constObservable({ preference: { top: 0, left: 0 } }),
			allowEditorOverflow: false,
		}));
	}

	private readonly _renderTextEffect;

	private readonly _layout;

	private readonly _root;

	private _mouseDown(e: MouseEvent): void {
		const target_id = traverseParentsUntilId(e.target as HTMLElement, new Set([DOM_ID_WIDGET, DOM_ID_REPLACEMENT, DOM_ID_RENAME, DOM_ID_OVERLAY]));
		if (!target_id) {
			return;
		}
		e.preventDefault(); // This prevents that the editor loses focus
		this._onDidClick.fire(InlineEditClickEvent.create(e, target_id === DOM_ID_RENAME));
	}
}

function traverseParentsUntilId(element: HTMLElement, ids: Set<string>): string | null {
	let current: HTMLElement | null = element;
	while (current) {
		if (ids.has(current.id)) {
			return current.id;
		}
		current = current.parentElement;
	}
	return null;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/jumpToView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/jumpToView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { n } from '../../../../../../../base/browser/dom.js';
import { KeybindingLabel } from '../../../../../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { RunOnceScheduler } from '../../../../../../../base/common/async.js';
import { ResolvedKeybinding } from '../../../../../../../base/common/keybindings.js';
import { Disposable } from '../../../../../../../base/common/lifecycle.js';
import { autorun, constObservable, DebugLocation, derived, IObservable, observableFromEvent } from '../../../../../../../base/common/observable.js';
import { OS } from '../../../../../../../base/common/platform.js';
import { IContextKeyService } from '../../../../../../../platform/contextkey/common/contextkey.js';
import { IKeybindingService } from '../../../../../../../platform/keybinding/common/keybinding.js';
import { defaultKeybindingLabelStyles } from '../../../../../../../platform/theme/browser/defaultStyles.js';
import { asCssVariable } from '../../../../../../../platform/theme/common/colorUtils.js';
import { IThemeService } from '../../../../../../../platform/theme/common/themeService.js';
import { ObservableCodeEditor } from '../../../../../../browser/observableCodeEditor.js';
import { Rect } from '../../../../../../common/core/2d/rect.js';
import { Position } from '../../../../../../common/core/position.js';
import { Range } from '../../../../../../common/core/range.js';
import { IModelDeltaDecoration } from '../../../../../../common/model.js';
import { inlineSuggestCommitId } from '../../../controller/commandIds.js';
import { getEditorBlendedColor, inlineEditIndicatorPrimaryBackground, inlineEditIndicatorPrimaryBorder, inlineEditIndicatorPrimaryForeground } from '../theme.js';
import { rectToProps } from '../utils/utils.js';

export class JumpToView extends Disposable {
	private readonly _style: 'label' | 'cursor';

	constructor(
		private readonly _editor: ObservableCodeEditor,
		options: { style: 'label' | 'cursor' },
		private readonly _data: IObservable<{ jumpToPosition: Position } | undefined>,
		@IThemeService private readonly _themeService: IThemeService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService
	) {
		super();

		this._style = options.style;
		this._keybinding = this._getKeybinding(inlineSuggestCommitId);

		const widget = this._widget.keepUpdated(this._store);

		this._register(this._editor.createOverlayWidget({
			domNode: widget.element,
			position: constObservable(null),
			allowEditorOverflow: false,
			minContentWidthInPx: constObservable(0),
		}));

		this._register(this._editor.setDecorations(derived<IModelDeltaDecoration[]>(reader => {
			const data = this._data.read(reader);
			if (!data) {
				return [];
			}
			// use injected text at position
			return [{
				range: Range.fromPositions(data.jumpToPosition, data.jumpToPosition),
				options: {
					description: 'inline-edit-jump-to-decoration',
					inlineClassNameAffectsLetterSpacing: true,
					showIfCollapsed: true,
					after: {
						content: this._style === 'label' ? '          ' : '  ',
					}
				},
			} satisfies IModelDeltaDecoration];
		})));
	}

	private readonly _styles = derived(this, reader => ({
		background: getEditorBlendedColor(inlineEditIndicatorPrimaryBackground, this._themeService).read(reader).toString(),
		foreground: getEditorBlendedColor(inlineEditIndicatorPrimaryForeground, this._themeService).read(reader).toString(),
		border: getEditorBlendedColor(inlineEditIndicatorPrimaryBorder, this._themeService).read(reader).toString(),
	}));

	private readonly _pos = derived(this, reader => {
		return this._editor.observePosition(derived(reader =>
			this._data.read(reader)?.jumpToPosition || null
		), reader.store);
	}).flatten();

	private _getKeybinding(commandId: string | undefined, debugLocation = DebugLocation.ofCaller()) {
		if (!commandId) {
			return constObservable(undefined);
		}
		return observableFromEvent(this, this._contextKeyService.onDidChangeContext, () => this._keybindingService.lookupKeybinding(commandId), debugLocation);
		// TODO: use contextkeyservice to use different renderings
	}

	private readonly _keybinding;

	private readonly _layout = derived(this, reader => {
		const data = this._data.read(reader);
		if (!data) {
			return undefined;
		}

		const position = data.jumpToPosition;
		const lineHeight = this._editor.observeLineHeightForLine(constObservable(position.lineNumber)).read(reader);
		const scrollLeft = this._editor.scrollLeft.read(reader);

		const point = this._pos.read(reader);

		if (!point) {
			return undefined;
		}

		const layout = this._editor.layoutInfo.read(reader);

		const widgetRect = Rect.fromLeftTopWidthHeight(
			point.x + layout.contentLeft + 2 - scrollLeft,
			point.y,
			100,
			lineHeight
		);

		return {
			widgetRect,
		};
	});

	private readonly _blink = animateFixedValues<boolean>([
		{ value: true, durationMs: 600 },
		{ value: false, durationMs: 600 },
	]);

	private readonly _widget = n.div({
		class: 'inline-edit-jump-to-widget',
		style: {
			position: 'absolute',
			display: this._layout.map(l => l ? 'flex' : 'none'),

			alignItems: 'center',
			cursor: 'pointer',
			userSelect: 'none',
			...rectToProps(reader => this._layout.read(reader)?.widgetRect),
		}
	},
		derived(reader => {
			if (this._data.read(reader) === undefined) {
				return [];
			}

			// Main content container with rounded border
			return n.div({
				style: {
					display: 'flex',
					alignItems: 'center',
					gap: '4px',
					padding: '0 4px',
					height: '100%',
					backgroundColor: this._styles.map(s => s.background),
					['--vscodeIconForeground' as string]: this._styles.map(s => s.foreground),
					border: this._styles.map(s => `1px solid ${s.border}`),
					borderRadius: '3px',
					boxSizing: 'border-box',
					fontSize: '11px',
					color: this._styles.map(s => s.foreground),
				}
			}, [
				this._style === 'cursor' ?
					n.elem('div', {
						style: {
							borderLeft: '2px solid',
							height: 14,
							opacity: this._blink.map(b => b ? '0' : '1'),
						}
					}) :

					[
						derived(() => n.elem('div', {}, keybindingLabel(this._keybinding))),
						n.elem('div', { style: { lineHeight: this._layout.map(l => l?.widgetRect.height), marginTop: '-2px' } },
							['to jump',]
						)
					],
			]);

		})
	);
}

function animateFixedValues<T>(values: { value: T; durationMs: number }[], debugLocation = DebugLocation.ofCaller()): IObservable<T> {
	let idx = 0;
	return observableFromEvent(undefined, (l) => {
		idx = 0;
		const timer = new RunOnceScheduler(() => {
			idx = (idx + 1) % values.length;
			l(null);
			timer.schedule(values[idx].durationMs);
		}, 0);
		timer.schedule(0);

		return timer;
	}, () => {
		return values[idx].value;
	}, debugLocation);
}

function keybindingLabel(keybinding: IObservable<ResolvedKeybinding | undefined>) {
	return derived(_reader => n.div({
		style: {},
		ref: elem => {
			const keybindingLabel = _reader.store.add(new KeybindingLabel(elem, OS, {
				disableTitle: true,
				...defaultKeybindingLabelStyles,
				keybindingLabelShadow: undefined,
				keybindingLabelForeground: asCssVariable(inlineEditIndicatorPrimaryForeground),
				keybindingLabelBackground: 'transparent',
				keybindingLabelBorder: asCssVariable(inlineEditIndicatorPrimaryForeground),
				keybindingLabelBottomBorder: undefined,
			}));
			_reader.store.add(autorun(reader => {
				keybindingLabel.set(keybinding.read(reader));
			}));
		}
	}));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/originalEditorInlineDiffView.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/originalEditorInlineDiffView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../../../base/common/event.js';
import { Disposable } from '../../../../../../../base/common/lifecycle.js';
import { autorunWithStore, derived, IObservable, observableFromEvent } from '../../../../../../../base/common/observable.js';
import { ICodeEditor, MouseTargetType } from '../../../../../../browser/editorBrowser.js';
import { observableCodeEditor } from '../../../../../../browser/observableCodeEditor.js';
import { rangeIsSingleLine } from '../../../../../../browser/widget/diffEditor/components/diffEditorViewZones/diffEditorViewZones.js';
import { OffsetRange } from '../../../../../../common/core/ranges/offsetRange.js';
import { Range } from '../../../../../../common/core/range.js';
import { AbstractText } from '../../../../../../common/core/text/abstractText.js';
import { DetailedLineRangeMapping } from '../../../../../../common/diff/rangeMapping.js';
import { EndOfLinePreference, IModelDeltaDecoration, InjectedTextCursorStops, ITextModel } from '../../../../../../common/model.js';
import { ModelDecorationOptions } from '../../../../../../common/model/textModel.js';
import { IInlineEditsView, InlineEditClickEvent } from '../inlineEditsViewInterface.js';
import { classNames } from '../utils/utils.js';

export interface IOriginalEditorInlineDiffViewState {
	diff: DetailedLineRangeMapping[];
	modifiedText: AbstractText;
	mode: 'insertionInline' | 'sideBySide' | 'deletion' | 'lineReplacement';
	isInDiffEditor: boolean;

	modifiedCodeEditor: ICodeEditor;
}

export class OriginalEditorInlineDiffView extends Disposable implements IInlineEditsView {
	public static supportsInlineDiffRendering(mapping: DetailedLineRangeMapping): boolean {
		return allowsTrueInlineDiffRendering(mapping);
	}

	private readonly _onDidClick = this._register(new Emitter<InlineEditClickEvent>());
	readonly onDidClick = this._onDidClick.event;

	readonly isHovered;

	private readonly _tokenizationFinished;

	constructor(
		private readonly _originalEditor: ICodeEditor,
		private readonly _state: IObservable<IOriginalEditorInlineDiffViewState | undefined>,
		private readonly _modifiedTextModel: ITextModel,
	) {
		super();
		this.isHovered = observableCodeEditor(this._originalEditor).isTargetHovered(
			p => p.target.type === MouseTargetType.CONTENT_TEXT &&
				p.target.detail.injectedText?.options.attachedData instanceof InlineEditAttachedData &&
				p.target.detail.injectedText.options.attachedData.owner === this,
			this._store
		);
		this._tokenizationFinished = modelTokenizationFinished(this._modifiedTextModel);
		this._decorations = derived(this, reader => {
			const diff = this._state.read(reader);
			if (!diff) { return undefined; }

			const modified = diff.modifiedText;
			const showInline = diff.mode === 'insertionInline';
			const hasOneInnerChange = diff.diff.length === 1 && diff.diff[0].innerChanges?.length === 1;

			const showEmptyDecorations = true;

			const originalDecorations: IModelDeltaDecoration[] = [];
			const modifiedDecorations: IModelDeltaDecoration[] = [];

			const diffLineAddDecorationBackground = ModelDecorationOptions.register({
				className: 'inlineCompletions-line-insert',
				description: 'line-insert',
				isWholeLine: true,
				marginClassName: 'gutter-insert',
			});

			const diffLineDeleteDecorationBackground = ModelDecorationOptions.register({
				className: 'inlineCompletions-line-delete',
				description: 'line-delete',
				isWholeLine: true,
				marginClassName: 'gutter-delete',
			});

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

			const diffAddDecorationEmpty = ModelDecorationOptions.register({
				className: 'inlineCompletions-char-insert diff-range-empty',
				description: 'char-insert diff-range-empty',
			});

			const NESOriginalBackground = ModelDecorationOptions.register({
				className: 'inlineCompletions-original-lines',
				description: 'inlineCompletions-original-lines',
				isWholeLine: false,
				shouldFillLineOnLineBreak: true,
			});

			const showFullLineDecorations = diff.mode !== 'sideBySide' && diff.mode !== 'deletion' && diff.mode !== 'insertionInline' && diff.mode !== 'lineReplacement';
			const hideEmptyInnerDecorations = diff.mode === 'lineReplacement';
			for (const m of diff.diff) {
				if (showFullLineDecorations) {
					if (!m.original.isEmpty) {
						originalDecorations.push({
							range: m.original.toInclusiveRange()!,
							options: diffLineDeleteDecorationBackground,
						});
					}
					if (!m.modified.isEmpty) {
						modifiedDecorations.push({
							range: m.modified.toInclusiveRange()!,
							options: diffLineAddDecorationBackground,
						});
					}
				}

				if (m.modified.isEmpty || m.original.isEmpty) {
					if (!m.original.isEmpty) {
						originalDecorations.push({ range: m.original.toInclusiveRange()!, options: diffWholeLineDeleteDecoration });
					}
					if (!m.modified.isEmpty) {
						modifiedDecorations.push({ range: m.modified.toInclusiveRange()!, options: diffWholeLineAddDecoration });
					}
				} else {
					const useInlineDiff = showInline && allowsTrueInlineDiffRendering(m);
					for (const i of m.innerChanges || []) {
						// Don't show empty markers outside the line range
						if (m.original.contains(i.originalRange.startLineNumber) && !(hideEmptyInnerDecorations && i.originalRange.isEmpty())) {
							const replacedText = this._originalEditor.getModel()?.getValueInRange(i.originalRange, EndOfLinePreference.LF);
							originalDecorations.push({
								range: i.originalRange,
								options: {
									description: 'char-delete',
									shouldFillLineOnLineBreak: false,
									className: classNames(
										'inlineCompletions-char-delete',
										i.originalRange.isSingleLine() && diff.mode === 'insertionInline' && 'single-line-inline',
										i.originalRange.isEmpty() && 'empty',
										((i.originalRange.isEmpty() && hasOneInnerChange || diff.mode === 'deletion' && replacedText === '\n') && showEmptyDecorations && !useInlineDiff) && 'diff-range-empty'
									),
									inlineClassName: useInlineDiff ? classNames('strike-through', 'inlineCompletions') : null,
									zIndex: 1
								}
							});
						}
						if (m.modified.contains(i.modifiedRange.startLineNumber)) {
							modifiedDecorations.push({
								range: i.modifiedRange,
								options: (i.modifiedRange.isEmpty() && showEmptyDecorations && !useInlineDiff && hasOneInnerChange)
									? diffAddDecorationEmpty
									: diffAddDecoration
							});
						}
						if (useInlineDiff) {
							const insertedText = modified.getValueOfRange(i.modifiedRange);
							// when the injected text becomes long, the editor will split it into multiple spans
							// to be able to get the border around the start and end of the text, we need to split it into multiple segments
							const textSegments = insertedText.length > 3 ?
								[
									{ text: insertedText.slice(0, 1), extraClasses: ['start'], offsetRange: new OffsetRange(i.modifiedRange.startColumn - 1, i.modifiedRange.startColumn) },
									{ text: insertedText.slice(1, -1), extraClasses: [], offsetRange: new OffsetRange(i.modifiedRange.startColumn, i.modifiedRange.endColumn - 2) },
									{ text: insertedText.slice(-1), extraClasses: ['end'], offsetRange: new OffsetRange(i.modifiedRange.endColumn - 2, i.modifiedRange.endColumn - 1) }
								] :
								[
									{ text: insertedText, extraClasses: ['start', 'end'], offsetRange: new OffsetRange(i.modifiedRange.startColumn - 1, i.modifiedRange.endColumn) }
								];

							// Tokenization
							this._tokenizationFinished.read(reader); // reconsider when tokenization is finished
							const lineTokens = this._modifiedTextModel.tokenization.getLineTokens(i.modifiedRange.startLineNumber);

							for (const { text, extraClasses, offsetRange } of textSegments) {
								originalDecorations.push({
									range: Range.fromPositions(i.originalRange.getEndPosition()),
									options: {
										description: 'inserted-text',
										before: {
											tokens: lineTokens.getTokensInRange(offsetRange),
											content: text,
											inlineClassName: classNames(
												'inlineCompletions-char-insert',
												i.modifiedRange.isSingleLine() && diff.mode === 'insertionInline' && 'single-line-inline',
												...extraClasses // include extraClasses for additional styling if provided
											),
											cursorStops: InjectedTextCursorStops.None,
											attachedData: new InlineEditAttachedData(this),
										},
										zIndex: 2,
										showIfCollapsed: true,
									}
								});
							}
						}
					}
				}
			}

			if (diff.isInDiffEditor) {
				for (const m of diff.diff) {
					if (!m.original.isEmpty) {
						originalDecorations.push({
							range: m.original.toExclusiveRange(),
							options: NESOriginalBackground,
						});
					}
				}
			}

			return { originalDecorations, modifiedDecorations };
		});

		this._register(observableCodeEditor(this._originalEditor).setDecorations(this._decorations.map(d => d?.originalDecorations ?? [])));

		const modifiedCodeEditor = this._state.map(s => s?.modifiedCodeEditor);
		this._register(autorunWithStore((reader, store) => {
			const e = modifiedCodeEditor.read(reader);
			if (e) {
				store.add(observableCodeEditor(e).setDecorations(this._decorations.map(d => d?.modifiedDecorations ?? [])));
			}
		}));

		this._register(this._originalEditor.onMouseUp(e => {
			if (e.target.type !== MouseTargetType.CONTENT_TEXT) {
				return;
			}
			const a = e.target.detail.injectedText?.options.attachedData;
			if (a instanceof InlineEditAttachedData && a.owner === this) {
				this._onDidClick.fire(new InlineEditClickEvent(e.event));
			}
		}));
	}

	private readonly _decorations;
}

class InlineEditAttachedData {
	constructor(public readonly owner: OriginalEditorInlineDiffView) { }
}

function allowsTrueInlineDiffRendering(mapping: DetailedLineRangeMapping): boolean {
	if (!mapping.innerChanges) {
		return false;
	}
	return mapping.innerChanges.every(c =>
		(rangeIsSingleLine(c.modifiedRange) && rangeIsSingleLine(c.originalRange)));
}

let i = 0;
function modelTokenizationFinished(model: ITextModel): IObservable<number> {
	return observableFromEvent(model.onDidChangeTokens, () => i++);
}
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 401
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 401 of 552)

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

---[FILE: src/vs/workbench/contrib/inlineChat/browser/media/inlineChat.css]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/browser/media/inlineChat.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


.monaco-workbench .inline-chat {
	color: inherit;
	border-radius: 4px;
	border: 1px solid var(--vscode-inlineChat-border);
	box-shadow: 0 2px 4px 0 var(--vscode-widget-shadow);
	background: var(--vscode-inlineChat-background);
	padding-top: 3px;
	position: relative;
}

.monaco-workbench .zone-widget.inline-chat-widget {
	z-index: 3;
}

.monaco-workbench .zone-widget.inline-chat-widget .interactive-session {
	max-width: unset;
}

.monaco-workbench .zone-widget.inline-chat-widget .interactive-session .chat-input-container {
	border-color: var(--vscode-inlineChat-border);
}

.monaco-workbench .zone-widget.inline-chat-widget .interactive-session .chat-input-container:focus-within {
	border-color: var(--vscode-focusBorder);
}

.monaco-workbench .zone-widget.inline-chat-widget .interactive-session .chat-input-container .interactive-input-part {
	padding-top: 0px
}

.monaco-workbench .zone-widget.inline-chat-widget > .zone-widget-container {
	background: var(--vscode-inlineChat-background);
}

@property --inline-chat-frame-progress {
	syntax: '<percentage>';
	initial-value: 0%;
	inherits: false;
}

@keyframes shift {
	0% {
		--inline-chat-frame-progress: 0%;
	}
	50% {
		--inline-chat-frame-progress: 100%;
	}
	100% {
		--inline-chat-frame-progress: 0%;
	}
}

.monaco-workbench .zone-widget.inline-chat-widget > .zone-widget-container.busy {
	--inline-chat-frame-progress: 0%;
	border-image: linear-gradient(90deg, var(--vscode-editorGutter-addedBackground) var(--inline-chat-frame-progress), var(--vscode-button-background)) 1;
	animation: 3s shift linear infinite;
}

.monaco-workbench .zone-widget.inline-chat-widget > .zone-widget-container > .inline-chat {
	color: inherit;
	border-radius: unset;
	border: unset;
	box-shadow: unset;
	background: var(--vscode-inlineChat-background);
	position: relative;
	outline: none;
}

.monaco-workbench .inline-chat .chat-widget {
	.checkpoint-container,
	.checkpoint-restore-container {
		display: none;
	}
}

.monaco-workbench .inline-chat .chat-widget .interactive-session .interactive-input-part {
	padding: 4px 0 0 0;
}


@keyframes pulse-opacity {
	0%, 100% {
		opacity: 1;
	}
	33% {
		opacity: .6;
	}
}

.monaco-workbench .zone-widget.inline-chat-widget.inline-chat-2 {

	.inline-chat .chat-widget .interactive-session .interactive-input-part {
		padding: 8px 0 0 0;
	}

	.interactive-session .chat-input-container {
		border-color: var(--vscode-input-border, transparent);
	}

	.interactive-session .chat-input-container:focus-within {
		border-color: var(--vscode-input-border, transparent);
	}

	.chat-attachments-container > .chat-input-toolbar {
		margin-left: auto;
		margin-right: 16px;
	}

	/* TODO@jrieken this isn't the nicest selector... */
	.request-in-progress .monaco-editor [class^="ced-chat-session-detail"]::after {
		animation: pulse-opacity 2.5s ease-in-out infinite;
	}
}


.monaco-workbench .inline-chat .chat-widget .interactive-session .interactive-input-part .interactive-execute-toolbar {
	margin-bottom: 1px;
}

.monaco-workbench .inline-chat .chat-widget .interactive-session .interactive-input-part .interactive-input-and-execute-toolbar {
	width: 100%;
	border-radius: 2px;
}


.monaco-workbench .inline-chat .chat-widget .interactive-session .interactive-input-part .interactive-input-followups .interactive-session-followups {
	margin: 3px 0 0 4px;
}

.monaco-workbench .inline-chat .chat-widget .interactive-session .interactive-list .monaco-scrollable-element {
	border-top-left-radius: 3px;
	border-top-right-radius: 3px;
}

.monaco-workbench .inline-chat .chat-widget .interactive-session .interactive-list .monaco-scrollable-element .shadow.top {
	box-shadow: none;
}

.monaco-workbench .inline-chat .chat-widget .interactive-session .interactive-list .interactive-item-container.interactive-item-compact {
	gap: 8px;
	padding: 3px 20px 3px 8px;
}

.monaco-workbench .inline-chat .chat-widget .interactive-session .interactive-list .interactive-item-container.interactive-item-compact .header .avatar {
	outline-offset: -1px;
}

.monaco-workbench .inline-chat .chat-widget .interactive-session .interactive-list .interactive-item-container.interactive-item-compact .chat-notification-widget {
	margin-bottom: 0;
	padding: 0;
	border: none;
}

.monaco-workbench .inline-chat .chat-widget .interactive-session .interactive-list .interactive-request {
	border: none;
}

.monaco-workbench .inline-chat .chat-widget .interactive-session .interactive-list .interactive-item-container.minimal > .header {
	top: 5px;
	right: 10px;
	display: none;
}

.monaco-workbench .inline-chat .chat-widget .interactive-session .interactive-list .interactive-item-container.minimal > .chat-footer-toolbar {
	display: none;
}

.monaco-workbench .inline-chat .chat-widget .interactive-session .chat-input-toolbars {
	max-width: 66%;
}

.monaco-workbench .inline-chat .chat-widget .interactive-session .chat-input-toolbars > .chat-execute-toolbar .chat-modelPicker-item {
	min-width: 40px;
	max-width: 132px;
}

/* status */

.monaco-workbench .inline-chat > .status {
	display: flex;
	align-items: center;
	padding-right: 16px;
}

.monaco-workbench .inline-chat > .status {
	.label,
	.actions {
		padding: 4px 0;
	}
}

.monaco-workbench .inline-chat .status .actions.hidden {
	display: none;
}

.monaco-workbench .inline-chat .status .label {
	overflow: hidden;
	color: var(--vscode-descriptionForeground);
	font-size: 12px;
	display: flex;
	white-space: nowrap;
}

.monaco-workbench .inline-chat .status .label.info {
	margin-right: auto;
}

.monaco-workbench .inline-chat .status .label.status {
	margin-left: auto;
	padding-right: 8px;
	padding-left: 8px;
}

.monaco-workbench .inline-chat .status .label.hidden,
.monaco-workbench .inline-chat .status .label:empty {
	display: none;
}

.monaco-workbench .inline-chat .status .label.error {
	color: var(--vscode-errorForeground);
}

.monaco-workbench .inline-chat .status .label.warn {
	color: var(--vscode-editorWarning-foreground);
}

.monaco-workbench .inline-chat .status .label > .codicon {
	padding: 0 3px;
	font-size: 12px;
	line-height: 18px;
}

.monaco-workbench .inline-chat .status .rerun {
	display: inline-flex;
}

.monaco-workbench .inline-chat .status .rerun:not(:empty) {
	padding-top: 8px;
	padding-left: 4px;
}

.monaco-workbench .inline-chat .status .rerun .agentOrSlashCommandDetected A {
	cursor: pointer;
	color: var(--vscode-textLink-foreground);
}

.monaco-workbench .inline-chat .interactive-item-container.interactive-response .detail-container .detail .agentOrSlashCommandDetected,
.monaco-workbench .inline-chat .interactive-item-container.interactive-response .detail-container .chat-animated-ellipsis {
	display: none;
}

.monaco-workbench .inline-chat .status .actions,
.monaco-workbench .inline-chat-diff-overlay {

	display: flex;
	height: 18px;

	.actions-container {
		gap: 3px
	}

	.monaco-button-dropdown > .monaco-dropdown-button {
		display: flex;
		align-items: center;
		padding: 0 4px;
	}

	.monaco-button.codicon {
		display: flex;
	}

	.monaco-button.codicon::before {
		align-self: center;
		color: var(--vscode-button-foreground);
	}

	.monaco-button.secondary.codicon::before {
		align-self: center;
		color: var(--vscode-button-secondaryForeground);
	}

	.monaco-text-button {
		padding: 0 6px;
		font-size: 12px;
		white-space: nowrap;
	}
}

.monaco-workbench .inline-chat .status .actions {
	gap: 4px;
}

.monaco-workbench .inline-chat .status .actions.secondary {
	margin-left: auto;
	display: none;
}

.monaco-workbench .inline-chat .status:hover .actions.secondary:not(.has-no-actions),
.monaco-workbench .inline-chat:focus .status .actions.secondary:not(.has-no-actions),
.monaco-workbench .inline-chat .status:focus-within .actions.secondary:not(.has-no-actions) {
	display: inherit;
}

.monaco-workbench .inline-chat-diff-overlay {

	.monaco-button {
		border-radius: 0;
	}

	.monaco-button.secondary.checked {
		background-color: var(--vscode-button-secondaryHoverBackground);
	}

	.monaco-button:first-child {
		border-top-left-radius: 2px;
		border-bottom-left-radius: 2px;
	}

	.monaco-button:last-child {
		border-top-right-radius: 2px;
		border-bottom-right-radius: 2px;
	}

	.monaco-button:not(:last-child) {
		border-right: 1px solid var(--vscode-button-foreground);
	}
}

.monaco-workbench .inline-chat .status .disclaimer {
	a {
		color: var(--vscode-textLink-foreground);
	}

	p {
		margin: 0;
	}
}

/* TODO@jrieken not needed? */
.monaco-workbench .inline-chat .status .monaco-toolbar .action-label.checked {
	color: var(--vscode-inputOption-activeForeground);
	background-color: var(--vscode-inputOption-activeBackground);
	outline: 1px solid var(--vscode-inputOption-activeBorder);
}


.monaco-workbench .inline-chat .status .monaco-toolbar .action-item.button-item .action-label:is(:hover, :focus) {
	background-color: var(--vscode-button-hoverBackground);
}

/* accessible diff viewer */

.monaco-workbench .inline-chat .diff-review {
	padding: 4px 6px;
	background-color: unset;
}

.monaco-workbench .inline-chat .diff-review.hidden {
	display: none;
}

/* decoration styles */

.monaco-workbench .inline-chat-inserted-range {
	background-color: var(--vscode-inlineChatDiff-inserted);
}

.monaco-workbench .inline-chat-inserted-range-linehighlight {
	background-color: var(--vscode-diffEditor-insertedLineBackground);
}

.monaco-workbench .inline-chat-original-zone2 {
	background-color: var(--vscode-diffEditor-removedLineBackground);
	opacity: 0.8;
}

.monaco-workbench .inline-chat-lines-inserted-range {
	background-color: var(--vscode-diffEditor-insertedTextBackground);
}

/* gutter decoration */

.monaco-workbench .glyph-margin-widgets .cgmr.codicon-inline-chat-opaque,
.monaco-workbench .glyph-margin-widgets .cgmr.codicon-inline-chat-transparent {
	display: block;
	cursor: pointer;
	transition: opacity .2s ease-in-out;
}

.monaco-workbench .glyph-margin-widgets .cgmr.codicon-inline-chat-opaque {
	opacity: 0.5;
}

.monaco-workbench .glyph-margin-widgets .cgmr.codicon-inline-chat-transparent {
	opacity: 0;
}

.monaco-workbench .glyph-margin-widgets .cgmr.codicon-inline-chat-opaque:hover,
.monaco-workbench .glyph-margin-widgets .cgmr.codicon-inline-chat-transparent:hover {
	opacity: 1;
}

.monaco-workbench .inline-chat .chat-attached-context {
	padding: 2px 0px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/common/inlineChat.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/common/inlineChat.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ContextKeyExpr, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { diffInserted, diffRemoved, editorWidgetBackground, editorWidgetBorder, editorWidgetForeground, focusBorder, inputBackground, inputPlaceholderForeground, registerColor, transparent, widgetShadow } from '../../../../platform/theme/common/colorRegistry.js';
import { NOTEBOOK_IS_ACTIVE_EDITOR } from '../../notebook/common/notebookContextKeys.js';

// settings

export const enum InlineChatConfigKeys {
	FinishOnType = 'inlineChat.finishOnType',
	StartWithOverlayWidget = 'inlineChat.startWithOverlayWidget',
	HoldToSpeech = 'inlineChat.holdToSpeech',
	/** @deprecated do not read on client */
	EnableV2 = 'inlineChat.enableV2',
	notebookAgent = 'inlineChat.notebookAgent',
}

Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration({
	id: 'editor',
	properties: {
		[InlineChatConfigKeys.FinishOnType]: {
			description: localize('finishOnType', "Whether to finish an inline chat session when typing outside of changed regions."),
			default: false,
			type: 'boolean'
		},
		[InlineChatConfigKeys.HoldToSpeech]: {
			description: localize('holdToSpeech', "Whether holding the inline chat keybinding will automatically enable speech recognition."),
			default: true,
			type: 'boolean'
		},
		[InlineChatConfigKeys.EnableV2]: {
			description: localize('enableV2', "Whether to use the next version of inline chat."),
			default: false,
			type: 'boolean',
			tags: ['preview'],
			experiment: {
				mode: 'auto'
			}
		},
		[InlineChatConfigKeys.notebookAgent]: {
			markdownDescription: localize('notebookAgent', "Enable agent-like behavior for inline chat widget in notebooks."),
			default: false,
			type: 'boolean',
			tags: ['experimental'],
			experiment: {
				mode: 'startup'
			}
		}
	}
});


export const INLINE_CHAT_ID = 'interactiveEditor';
export const INTERACTIVE_EDITOR_ACCESSIBILITY_HELP_ID = 'interactiveEditorAccessiblityHelp';

// --- CONTEXT

export const enum InlineChatResponseType {
	None = 'none',
	Messages = 'messages',
	MessagesAndEdits = 'messagesAndEdits'
}

export const CTX_INLINE_CHAT_POSSIBLE = new RawContextKey<boolean>('inlineChatPossible', false, localize('inlineChatHasPossible', "Whether a provider for inline chat exists and whether an editor for inline chat is open"));
/** @deprecated */
const CTX_INLINE_CHAT_HAS_AGENT = new RawContextKey<boolean>('inlineChatHasProvider', false, localize('inlineChatHasProvider', "Whether a provider for interactive editors exists"));
export const CTX_INLINE_CHAT_HAS_AGENT2 = new RawContextKey<boolean>('inlineChatHasEditsAgent', false, localize('inlineChatHasEditsAgent', "Whether an agent for inline for interactive editors exists"));
export const CTX_INLINE_CHAT_HAS_NOTEBOOK_INLINE = new RawContextKey<boolean>('inlineChatHasNotebookInline', false, localize('inlineChatHasNotebookInline', "Whether an agent for notebook cells exists"));
export const CTX_INLINE_CHAT_HAS_NOTEBOOK_AGENT = new RawContextKey<boolean>('inlineChatHasNotebookAgent', false, localize('inlineChatHasNotebookAgent', "Whether an agent for notebook cells exists"));
export const CTX_INLINE_CHAT_VISIBLE = new RawContextKey<boolean>('inlineChatVisible', false, localize('inlineChatVisible', "Whether the interactive editor input is visible"));
export const CTX_INLINE_CHAT_FOCUSED = new RawContextKey<boolean>('inlineChatFocused', false, localize('inlineChatFocused', "Whether the interactive editor input is focused"));
export const CTX_INLINE_CHAT_EDITING = new RawContextKey<boolean>('inlineChatEditing', true, localize('inlineChatEditing', "Whether the user is currently editing or generating code in the inline chat"));
export const CTX_INLINE_CHAT_RESPONSE_FOCUSED = new RawContextKey<boolean>('inlineChatResponseFocused', false, localize('inlineChatResponseFocused', "Whether the interactive widget's response is focused"));
export const CTX_INLINE_CHAT_EMPTY = new RawContextKey<boolean>('inlineChatEmpty', false, localize('inlineChatEmpty', "Whether the interactive editor input is empty"));
export const CTX_INLINE_CHAT_INNER_CURSOR_FIRST = new RawContextKey<boolean>('inlineChatInnerCursorFirst', false, localize('inlineChatInnerCursorFirst', "Whether the cursor of the iteractive editor input is on the first line"));
export const CTX_INLINE_CHAT_INNER_CURSOR_LAST = new RawContextKey<boolean>('inlineChatInnerCursorLast', false, localize('inlineChatInnerCursorLast', "Whether the cursor of the iteractive editor input is on the last line"));
export const CTX_INLINE_CHAT_OUTER_CURSOR_POSITION = new RawContextKey<'above' | 'below' | ''>('inlineChatOuterCursorPosition', '', localize('inlineChatOuterCursorPosition', "Whether the cursor of the outer editor is above or below the interactive editor input"));
export const CTX_INLINE_CHAT_HAS_STASHED_SESSION = new RawContextKey<boolean>('inlineChatHasStashedSession', false, localize('inlineChatHasStashedSession', "Whether interactive editor has kept a session for quick restore"));
export const CTX_INLINE_CHAT_CHANGE_HAS_DIFF = new RawContextKey<boolean>('inlineChatChangeHasDiff', false, localize('inlineChatChangeHasDiff', "Whether the current change supports showing a diff"));
export const CTX_INLINE_CHAT_CHANGE_SHOWS_DIFF = new RawContextKey<boolean>('inlineChatChangeShowsDiff', false, localize('inlineChatChangeShowsDiff', "Whether the current change showing a diff"));
export const CTX_INLINE_CHAT_REQUEST_IN_PROGRESS = new RawContextKey<boolean>('inlineChatRequestInProgress', false, localize('inlineChatRequestInProgress', "Whether an inline chat request is currently in progress"));
export const CTX_INLINE_CHAT_RESPONSE_TYPE = new RawContextKey<InlineChatResponseType>('inlineChatResponseType', InlineChatResponseType.None, localize('inlineChatResponseTypes', "What type was the responses have been receieved, nothing yet, just messages, or messaged and local edits"));

export const CTX_INLINE_CHAT_V1_ENABLED = ContextKeyExpr.or(
	ContextKeyExpr.and(NOTEBOOK_IS_ACTIVE_EDITOR.negate(), CTX_INLINE_CHAT_HAS_AGENT),
	ContextKeyExpr.and(NOTEBOOK_IS_ACTIVE_EDITOR, CTX_INLINE_CHAT_HAS_NOTEBOOK_INLINE)
);

export const CTX_INLINE_CHAT_V2_ENABLED = ContextKeyExpr.or(
	ContextKeyExpr.and(NOTEBOOK_IS_ACTIVE_EDITOR.negate(), CTX_INLINE_CHAT_HAS_AGENT2),
	ContextKeyExpr.and(NOTEBOOK_IS_ACTIVE_EDITOR, CTX_INLINE_CHAT_HAS_NOTEBOOK_AGENT)
);

// --- (selected) action identifier

export const ACTION_START = 'inlineChat.start';
export const ACTION_ACCEPT_CHANGES = 'inlineChat.acceptChanges';
export const ACTION_DISCARD_CHANGES = 'inlineChat.discardHunkChange';
export const ACTION_REGENERATE_RESPONSE = 'inlineChat.regenerate';
export const ACTION_VIEW_IN_CHAT = 'inlineChat.viewInChat';
export const ACTION_TOGGLE_DIFF = 'inlineChat.toggleDiff';
export const ACTION_REPORT_ISSUE = 'inlineChat.reportIssue';

// --- menus

export const MENU_INLINE_CHAT_WIDGET_STATUS = MenuId.for('inlineChatWidget.status');
export const MENU_INLINE_CHAT_WIDGET_SECONDARY = MenuId.for('inlineChatWidget.secondary');
export const MENU_INLINE_CHAT_ZONE = MenuId.for('inlineChatWidget.changesZone');

export const MENU_INLINE_CHAT_SIDE = MenuId.for('inlineChatWidget.side');

// --- colors


export const inlineChatForeground = registerColor('inlineChat.foreground', editorWidgetForeground, localize('inlineChat.foreground', "Foreground color of the interactive editor widget"));
export const inlineChatBackground = registerColor('inlineChat.background', editorWidgetBackground, localize('inlineChat.background', "Background color of the interactive editor widget"));
export const inlineChatBorder = registerColor('inlineChat.border', editorWidgetBorder, localize('inlineChat.border', "Border color of the interactive editor widget"));
export const inlineChatShadow = registerColor('inlineChat.shadow', widgetShadow, localize('inlineChat.shadow', "Shadow color of the interactive editor widget"));
export const inlineChatInputBorder = registerColor('inlineChatInput.border', editorWidgetBorder, localize('inlineChatInput.border', "Border color of the interactive editor input"));
export const inlineChatInputFocusBorder = registerColor('inlineChatInput.focusBorder', focusBorder, localize('inlineChatInput.focusBorder', "Border color of the interactive editor input when focused"));
export const inlineChatInputPlaceholderForeground = registerColor('inlineChatInput.placeholderForeground', inputPlaceholderForeground, localize('inlineChatInput.placeholderForeground', "Foreground color of the interactive editor input placeholder"));
export const inlineChatInputBackground = registerColor('inlineChatInput.background', inputBackground, localize('inlineChatInput.background', "Background color of the interactive editor input"));

export const inlineChatDiffInserted = registerColor('inlineChatDiff.inserted', transparent(diffInserted, .5), localize('inlineChatDiff.inserted', "Background color of inserted text in the interactive editor input"));
export const overviewRulerInlineChatDiffInserted = registerColor('editorOverviewRuler.inlineChatInserted', { dark: transparent(diffInserted, 0.6), light: transparent(diffInserted, 0.8), hcDark: transparent(diffInserted, 0.6), hcLight: transparent(diffInserted, 0.8) }, localize('editorOverviewRuler.inlineChatInserted', 'Overview ruler marker color for inline chat inserted content.'));
export const minimapInlineChatDiffInserted = registerColor('editorMinimap.inlineChatInserted', { dark: transparent(diffInserted, 0.6), light: transparent(diffInserted, 0.8), hcDark: transparent(diffInserted, 0.6), hcLight: transparent(diffInserted, 0.8) }, localize('editorMinimap.inlineChatInserted', 'Minimap marker color for inline chat inserted content.'));

export const inlineChatDiffRemoved = registerColor('inlineChatDiff.removed', transparent(diffRemoved, .5), localize('inlineChatDiff.removed', "Background color of removed text in the interactive editor input"));
export const overviewRulerInlineChatDiffRemoved = registerColor('editorOverviewRuler.inlineChatRemoved', { dark: transparent(diffRemoved, 0.6), light: transparent(diffRemoved, 0.8), hcDark: transparent(diffRemoved, 0.6), hcLight: transparent(diffRemoved, 0.8) }, localize('editorOverviewRuler.inlineChatRemoved', 'Overview ruler marker color for inline chat removed content.'));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/electron-browser/inlineChat.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/electron-browser/inlineChat.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { HoldToSpeak } from './inlineChatActions.js';

// start and hold for voice

registerAction2(HoldToSpeak);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/electron-browser/inlineChatActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/electron-browser/inlineChatActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { InlineChatController } from '../browser/inlineChatController.js';
import { AbstractInline1ChatAction, setHoldForSpeech } from '../browser/inlineChatActions.js';
import { disposableTimeout } from '../../../../base/common/async.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { StartVoiceChatAction, StopListeningAction, VOICE_KEY_HOLD_THRESHOLD } from '../../chat/electron-browser/actions/voiceChatActions.js';
import { IChatExecuteActionContext } from '../../chat/browser/actions/chatExecuteActions.js';
import { CTX_INLINE_CHAT_VISIBLE, InlineChatConfigKeys } from '../common/inlineChat.js';
import { HasSpeechProvider, ISpeechService } from '../../speech/common/speechService.js';
import { localize2 } from '../../../../nls.js';
import { Action2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { EditorAction2 } from '../../../../editor/browser/editorExtensions.js';

export class HoldToSpeak extends EditorAction2 {

	constructor() {
		super({
			id: 'inlineChat.holdForSpeech',
			category: AbstractInline1ChatAction.category,
			precondition: ContextKeyExpr.and(HasSpeechProvider, CTX_INLINE_CHAT_VISIBLE),
			title: localize2('holdForSpeech', "Hold for Speech"),
			keybinding: {
				when: EditorContextKeys.textInputFocus,
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyI,
			},
		});
	}

	override runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, ..._args: unknown[]) {
		const ctrl = InlineChatController.get(editor);
		if (ctrl) {
			holdForSpeech(accessor, ctrl, this);
		}
	}
}

function holdForSpeech(accessor: ServicesAccessor, ctrl: InlineChatController, action: Action2): void {

	const configService = accessor.get(IConfigurationService);
	const speechService = accessor.get(ISpeechService);
	const keybindingService = accessor.get(IKeybindingService);
	const commandService = accessor.get(ICommandService);

	// enabled or possible?
	if (!configService.getValue<boolean>(InlineChatConfigKeys.HoldToSpeech || !speechService.hasSpeechProvider)) {
		return;
	}

	const holdMode = keybindingService.enableKeybindingHoldMode(action.desc.id);
	if (!holdMode) {
		return;
	}
	let listening = false;
	const handle = disposableTimeout(() => {
		// start VOICE input
		commandService.executeCommand(StartVoiceChatAction.ID, { voice: { disableTimeout: true } } satisfies IChatExecuteActionContext);
		listening = true;
	}, VOICE_KEY_HOLD_THRESHOLD);

	holdMode.finally(() => {
		if (listening) {
			commandService.executeCommand(StopListeningAction.ID).finally(() => {
				ctrl.widget.chatWidget.acceptInput();
			});
		}
		handle.dispose();
	});
}

// make this accessible to the chat actions from the browser layer
setHoldForSpeech(holdForSpeech);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/test/browser/inlineChatController.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/test/browser/inlineChatController.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { equals } from '../../../../../base/common/arrays.js';
import { DeferredPromise, raceCancellation, timeout } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { constObservable, IObservable } from '../../../../../base/common/observable.js';
import { assertType } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { IActiveCodeEditor, ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { IDiffProviderFactoryService } from '../../../../../editor/browser/widget/diffEditor/diffProviderFactoryService.js';
import { EditOperation } from '../../../../../editor/common/core/editOperation.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { EndOfLineSequence, ITextModel } from '../../../../../editor/common/model.js';
import { IEditorWorkerService } from '../../../../../editor/common/services/editorWorker.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { TestDiffProviderFactoryService } from '../../../../../editor/test/browser/diff/testDiffProviderFactoryService.js';
import { TestCommandService } from '../../../../../editor/test/browser/editorTestServices.js';
import { instantiateTestCodeEditor } from '../../../../../editor/test/browser/testCodeEditor.js';
import { IAccessibleViewService } from '../../../../../platform/accessibility/browser/accessibleView.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { NullHoverService } from '../../../../../platform/hover/test/browser/nullHoverService.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IEditorProgressService, IProgressRunner } from '../../../../../platform/progress/common/progress.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IView, IViewDescriptorService } from '../../../../common/views.js';
import { IWorkbenchAssignmentService } from '../../../../services/assignment/common/assignmentService.js';
import { NullWorkbenchAssignmentService } from '../../../../services/assignment/test/common/nullAssignmentService.js';
import { IChatEntitlementService } from '../../../../services/chat/common/chatEntitlementService.js';
import { IExtensionService, nullExtensionDescription } from '../../../../services/extensions/common/extensions.js';
import { TextModelResolverService } from '../../../../services/textmodelResolver/common/textModelResolverService.js';
import { IViewsService } from '../../../../services/views/common/viewsService.js';
import { TestViewsService, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { TestChatEntitlementService, TestContextService, TestExtensionService } from '../../../../test/common/workbenchTestServices.js';
import { AccessibilityVerbositySettingId } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { IChatAccessibilityService, IChatWidget, IChatWidgetService, IQuickChatService } from '../../../chat/browser/chat.js';
import { ChatContextService, IChatContextService } from '../../../chat/browser/chatContextService.js';
import { ChatInputBoxContentProvider } from '../../../chat/browser/chatEdinputInputContentProvider.js';
import { ChatLayoutService } from '../../../chat/browser/chatLayoutService.js';
import { ChatVariablesService } from '../../../chat/browser/chatVariables.js';
import { ChatWidget } from '../../../chat/browser/chatWidget.js';
import { ChatWidgetService } from '../../../chat/browser/chatWidgetService.js';
import { ChatAgentService, IChatAgentData, IChatAgentNameService, IChatAgentService } from '../../../chat/common/chatAgents.js';
import { IChatEditingService, IChatEditingSession } from '../../../chat/common/chatEditingService.js';
import { IChatLayoutService } from '../../../chat/common/chatLayoutService.js';
import { IChatModeService } from '../../../chat/common/chatModes.js';
import { IChatProgress, IChatService } from '../../../chat/common/chatService.js';
import { ChatService } from '../../../chat/common/chatServiceImpl.js';
import { ChatSlashCommandService, IChatSlashCommandService } from '../../../chat/common/chatSlashCommands.js';
import { IChatTodo, IChatTodoListService } from '../../../chat/common/chatTodoListService.js';
import { ChatTransferService, IChatTransferService } from '../../../chat/common/chatTransferService.js';
import { IChatVariablesService } from '../../../chat/common/chatVariables.js';
import { IChatResponseViewModel } from '../../../chat/common/chatViewModel.js';
import { ChatWidgetHistoryService, IChatWidgetHistoryService } from '../../../chat/common/chatWidgetHistoryService.js';
import { ChatAgentLocation, ChatModeKind } from '../../../chat/common/constants.js';
import { ILanguageModelsService, LanguageModelsService } from '../../../chat/common/languageModels.js';
import { ILanguageModelToolsService } from '../../../chat/common/languageModelToolsService.js';
import { PromptsType } from '../../../chat/common/promptSyntax/promptTypes.js';
import { IPromptPath, IPromptsService } from '../../../chat/common/promptSyntax/service/promptsService.js';
import { MockChatModeService } from '../../../chat/test/common/mockChatModeService.js';
import { MockLanguageModelToolsService } from '../../../chat/test/common/mockLanguageModelToolsService.js';
import { IMcpService } from '../../../mcp/common/mcpTypes.js';
import { TestMcpService } from '../../../mcp/test/common/testMcpService.js';
import { INotebookEditorService } from '../../../notebook/browser/services/notebookEditorService.js';
import { RerunAction } from '../../browser/inlineChatActions.js';
import { InlineChatController1, State } from '../../browser/inlineChatController.js';
import { IInlineChatSessionService } from '../../browser/inlineChatSessionService.js';
import { InlineChatSessionServiceImpl } from '../../browser/inlineChatSessionServiceImpl.js';
import { CTX_INLINE_CHAT_RESPONSE_TYPE, InlineChatConfigKeys, InlineChatResponseType } from '../../common/inlineChat.js';
import { TestWorkerService } from './testWorkerService.js';
import { MockChatSessionsService } from '../../../chat/test/common/mockChatSessionsService.js';
import { IChatSessionsService } from '../../../chat/common/chatSessionsService.js';
import { IAgentSessionsService } from '../../../chat/browser/agentSessions/agentSessionsService.js';
import { IAgentSessionsModel } from '../../../chat/browser/agentSessions/agentSessionsModel.js';

suite('InlineChatController', function () {

	const agentData = {
		extensionId: nullExtensionDescription.identifier,
		extensionVersion: undefined,
		publisherDisplayName: '',
		extensionDisplayName: '',
		extensionPublisherId: '',
		// id: 'testEditorAgent',
		name: 'testEditorAgent',
		isDefault: true,
		locations: [ChatAgentLocation.EditorInline],
		modes: [ChatModeKind.Ask],
		metadata: {},
		slashCommands: [],
		disambiguation: [],
	};

	class TestController extends InlineChatController1 {

		static INIT_SEQUENCE: readonly State[] = [State.CREATE_SESSION, State.INIT_UI, State.WAIT_FOR_INPUT];
		static INIT_SEQUENCE_AUTO_SEND: readonly State[] = [...this.INIT_SEQUENCE, State.SHOW_REQUEST, State.WAIT_FOR_INPUT];


		readonly onDidChangeState: Event<State> = this._onDidEnterState.event;

		readonly states: readonly State[] = [];

		awaitStates(states: readonly State[]): Promise<string | undefined> {
			const actual: State[] = [];

			return new Promise<string | undefined>((resolve, reject) => {
				const d = this.onDidChangeState(state => {
					actual.push(state);
					if (equals(states, actual)) {
						d.dispose();
						resolve(undefined);
					}
				});

				setTimeout(() => {
					d.dispose();
					resolve(`[${states.join(',')}] <> [${actual.join(',')}]`);
				}, 1000);
			});
		}
	}

	const store = new DisposableStore();
	let configurationService: TestConfigurationService;
	let editor: IActiveCodeEditor;
	let model: ITextModel;
	let ctrl: TestController;
	let contextKeyService: MockContextKeyService;
	let chatService: IChatService;
	let chatAgentService: IChatAgentService;
	let inlineChatSessionService: IInlineChatSessionService;
	let instaService: TestInstantiationService;

	let chatWidget: IChatWidget;

	setup(function () {

		const serviceCollection = new ServiceCollection(
			[IConfigurationService, new TestConfigurationService()],
			[IChatVariablesService, new SyncDescriptor(ChatVariablesService)],
			[ILogService, new NullLogService()],
			[ITelemetryService, NullTelemetryService],
			[IHoverService, NullHoverService],
			[IExtensionService, new TestExtensionService()],
			[IContextKeyService, new MockContextKeyService()],
			[IViewsService, new class extends TestViewsService {
				override async openView<T extends IView>(id: string, focus?: boolean | undefined): Promise<T | null> {
					// eslint-disable-next-line local/code-no-any-casts
					return { widget: chatWidget ?? null } as any;
				}
			}()],
			[IWorkspaceContextService, new TestContextService()],
			[IChatWidgetHistoryService, new SyncDescriptor(ChatWidgetHistoryService)],
			[IChatWidgetService, new SyncDescriptor(ChatWidgetService)],
			[IChatSlashCommandService, new SyncDescriptor(ChatSlashCommandService)],
			[IChatTransferService, new SyncDescriptor(ChatTransferService)],
			[IChatService, new SyncDescriptor(ChatService)],
			[IMcpService, new TestMcpService()],
			[IChatAgentNameService, new class extends mock<IChatAgentNameService>() {
				override getAgentNameRestriction(chatAgentData: IChatAgentData): boolean {
					return false;
				}
			}],
			[IEditorWorkerService, new SyncDescriptor(TestWorkerService)],
			[IContextKeyService, contextKeyService],
			[IChatAgentService, new SyncDescriptor(ChatAgentService)],
			[IDiffProviderFactoryService, new SyncDescriptor(TestDiffProviderFactoryService)],
			[IInlineChatSessionService, new SyncDescriptor(InlineChatSessionServiceImpl)],
			[ICommandService, new SyncDescriptor(TestCommandService)],
			[IChatEditingService, new class extends mock<IChatEditingService>() {
				override editingSessionsObs: IObservable<readonly IChatEditingSession[]> = constObservable([]);
			}],
			[IEditorProgressService, new class extends mock<IEditorProgressService>() {
				override show(total: unknown, delay?: unknown): IProgressRunner {
					return {
						total() { },
						worked(value) { },
						done() { },
					};
				}
			}],
			[IChatAccessibilityService, new class extends mock<IChatAccessibilityService>() {
				override acceptResponse(widget: ChatWidget, container: HTMLElement, response: IChatResponseViewModel | undefined, requestId: URI | undefined): void { }
				override acceptRequest(): URI | undefined { return undefined; }
				override acceptElicitation(): void { }
			}],
			[IAccessibleViewService, new class extends mock<IAccessibleViewService>() {
				override getOpenAriaHint(verbositySettingKey: AccessibilityVerbositySettingId): string | null {
					return null;
				}
			}],
			[IConfigurationService, configurationService],
			[IViewDescriptorService, new class extends mock<IViewDescriptorService>() {
				override onDidChangeLocation = Event.None;
			}],
			[INotebookEditorService, new class extends mock<INotebookEditorService>() {
				override listNotebookEditors() { return []; }
				override getNotebookForPossibleCell(editor: ICodeEditor) {
					return undefined;
				}
			}],
			[IWorkbenchAssignmentService, new NullWorkbenchAssignmentService()],
			[ILanguageModelsService, new SyncDescriptor(LanguageModelsService)],
			[ITextModelService, new SyncDescriptor(TextModelResolverService)],
			[ILanguageModelToolsService, new SyncDescriptor(MockLanguageModelToolsService)],
			[IPromptsService, new class extends mock<IPromptsService>() {
				override async listPromptFiles(type: PromptsType, token: CancellationToken): Promise<readonly IPromptPath[]> {
					return [];
				}
			}],
			[IChatEntitlementService, new class extends mock<IChatEntitlementService>() { }],
			[IChatModeService, new SyncDescriptor(MockChatModeService)],
			[IChatLayoutService, new SyncDescriptor(ChatLayoutService)],
			[IQuickChatService, new class extends mock<IQuickChatService>() { }],
			[IChatTodoListService, new class extends mock<IChatTodoListService>() {
				override onDidUpdateTodos = Event.None;
				override getTodos(sessionResource: URI): IChatTodo[] { return []; }
				override setTodos(sessionResource: URI, todos: IChatTodo[]): void { }
			}],
			[IChatEntitlementService, new SyncDescriptor(TestChatEntitlementService)],
			[IChatSessionsService, new SyncDescriptor(MockChatSessionsService)],
			[IAgentSessionsService, new class extends mock<IAgentSessionsService>() {
				override get model(): IAgentSessionsModel {
					return {
						onWillResolve: Event.None,
						onDidResolve: Event.None,
						onDidChangeSessions: Event.None,
						sessions: [],
						resolve: async () => { },
						getSession: (resource: URI) => undefined,
					} as IAgentSessionsModel;
				}
			}],
		);

		instaService = store.add((store.add(workbenchInstantiationService(undefined, store))).createChild(serviceCollection));

		configurationService = instaService.get(IConfigurationService) as TestConfigurationService;
		configurationService.setUserConfiguration('chat', { editor: { fontSize: 14, fontFamily: 'default' } });

		configurationService.setUserConfiguration('editor', {});

		contextKeyService = instaService.get(IContextKeyService) as MockContextKeyService;
		chatService = instaService.get(IChatService);
		chatAgentService = instaService.get(IChatAgentService);

		inlineChatSessionService = store.add(instaService.get(IInlineChatSessionService));

		store.add(instaService.get(ILanguageModelsService) as LanguageModelsService);
		store.add(instaService.get(IEditorWorkerService) as TestWorkerService);

		store.add(instaService.createInstance(ChatInputBoxContentProvider));

		model = store.add(instaService.get(IModelService).createModel('Hello\nWorld\nHello Again\nHello World\n', null));
		model.setEOL(EndOfLineSequence.LF);
		editor = store.add(instantiateTestCodeEditor(instaService, model));

		instaService.set(IChatContextService, store.add(instaService.createInstance(ChatContextService)));

		store.add(chatAgentService.registerDynamicAgent({ id: 'testEditorAgent', ...agentData, }, {
			async invoke(request, progress, history, token) {
				progress([{
					kind: 'textEdit',
					uri: model.uri,
					edits: [{
						range: new Range(1, 1, 1, 1),
						text: request.message
					}]
				}]);
				return {};
			},
		}));

	});

	teardown(async function () {
		store.clear();
		ctrl?.dispose();
		await chatService.waitForModelDisposals();
	});

	// TODO@jrieken re-enable, looks like List/ChatWidget is leaking
	// ensureNoDisposablesAreLeakedInTestSuite();

	test('creation, not showing anything', function () {
		ctrl = instaService.createInstance(TestController, editor);
		assert.ok(ctrl);
		assert.strictEqual(ctrl.getWidgetPosition(), undefined);
	});

	test('run (show/hide)', async function () {
		ctrl = instaService.createInstance(TestController, editor);
		const actualStates = ctrl.awaitStates(TestController.INIT_SEQUENCE_AUTO_SEND);
		const run = ctrl.run({ message: 'Hello', autoSend: true });
		assert.strictEqual(await actualStates, undefined);
		assert.ok(ctrl.getWidgetPosition() !== undefined);
		await ctrl.cancelSession();

		await run;

		assert.ok(ctrl.getWidgetPosition() === undefined);
	});

	test('wholeRange does not expand to whole lines, editor selection default', async function () {

		editor.setSelection(new Range(1, 1, 1, 3));
		ctrl = instaService.createInstance(TestController, editor);

		ctrl.run({});
		await Event.toPromise(Event.filter(ctrl.onDidChangeState, e => e === State.WAIT_FOR_INPUT));

		const session = inlineChatSessionService.getSession(editor, editor.getModel()!.uri);
		assert.ok(session);
		assert.deepStrictEqual(session.wholeRange.value, new Range(1, 1, 1, 3));

		await ctrl.cancelSession();
	});

	test('typing outside of wholeRange finishes session', async function () {

		configurationService.setUserConfiguration(InlineChatConfigKeys.FinishOnType, true);

		ctrl = instaService.createInstance(TestController, editor);
		const actualStates = ctrl.awaitStates(TestController.INIT_SEQUENCE_AUTO_SEND);
		const r = ctrl.run({ message: 'Hello', autoSend: true });

		assert.strictEqual(await actualStates, undefined);

		const session = inlineChatSessionService.getSession(editor, editor.getModel()!.uri);
		assert.ok(session);
		assert.deepStrictEqual(session.wholeRange.value, new Range(1, 1, 1, 11 /* line length */));

		editor.setSelection(new Range(2, 1, 2, 1));
		editor.trigger('test', 'type', { text: 'a' });

		assert.strictEqual(await ctrl.awaitStates([State.ACCEPT]), undefined);
		await r;
	});

	test('\'whole range\' isn\'t updated for edits outside whole range #4346', async function () {

		editor.setSelection(new Range(3, 1, 3, 3));

		store.add(chatAgentService.registerDynamicAgent({
			id: 'testEditorAgent2',
			...agentData
		}, {
			async invoke(request, progress, history, token) {
				progress([{
					kind: 'textEdit',
					uri: editor.getModel().uri,
					edits: [{
						range: new Range(1, 1, 1, 1), // EDIT happens outside of whole range
						text: `${request.message}\n${request.message}`
					}]
				}]);

				return {};
			},
		}));

		ctrl = instaService.createInstance(TestController, editor);
		const p = ctrl.awaitStates(TestController.INIT_SEQUENCE);
		const r = ctrl.run({ message: 'GENGEN', autoSend: false });

		assert.strictEqual(await p, undefined);


		const session = inlineChatSessionService.getSession(editor, editor.getModel()!.uri);
		assert.ok(session);
		assert.deepStrictEqual(session.wholeRange.value, new Range(3, 1, 3, 3)); // initial

		ctrl.chatWidget.setInput('GENGEN');
		ctrl.chatWidget.acceptInput();
		assert.strictEqual(await ctrl.awaitStates([State.SHOW_REQUEST, State.WAIT_FOR_INPUT]), undefined);

		assert.deepStrictEqual(session.wholeRange.value, new Range(1, 1, 4, 3));

		await ctrl.cancelSession();
		await r;
	});

	test('Stuck inline chat widget #211', async function () {

		store.add(chatAgentService.registerDynamicAgent({
			id: 'testEditorAgent2',
			...agentData
		}, {
			async invoke(request, progress, history, token) {
				return new Promise<never>(() => { });
			},
		}));

		ctrl = instaService.createInstance(TestController, editor);
		const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST]);
		const r = ctrl.run({ message: 'Hello', autoSend: true });

		assert.strictEqual(await p, undefined);

		ctrl.acceptSession();

		await r;
		assert.strictEqual(ctrl.getWidgetPosition(), undefined);
	});

	test('[Bug] Inline Chat\'s streaming pushed broken iterations to the undo stack #2403', async function () {

		store.add(chatAgentService.registerDynamicAgent({
			id: 'testEditorAgent2',
			...agentData
		}, {
			async invoke(request, progress, history, token) {

				progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: 'hEllo1\n' }] }]);
				progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(2, 1, 2, 1), text: 'hEllo2\n' }] }]);
				progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1000, 1), text: 'Hello1\nHello2\n' }] }]);

				return {};
			},
		}));

		const valueThen = editor.getModel().getValue();

		ctrl = instaService.createInstance(TestController, editor);
		const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		const r = ctrl.run({ message: 'Hello', autoSend: true });
		assert.strictEqual(await p, undefined);
		ctrl.acceptSession();
		await r;

		assert.strictEqual(editor.getModel().getValue(), 'Hello1\nHello2\n');

		editor.getModel().undo();
		assert.strictEqual(editor.getModel().getValue(), valueThen);
	});



	test.skip('UI is streaming edits minutes after the response is finished #3345', async function () {


		return runWithFakedTimers({ maxTaskCount: Number.MAX_SAFE_INTEGER }, async () => {

			store.add(chatAgentService.registerDynamicAgent({
				id: 'testEditorAgent2',
				...agentData
			}, {
				async invoke(request, progress, history, token) {

					const text = '${CSI}#a\n${CSI}#b\n${CSI}#c\n';

					await timeout(10);
					progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: text }] }]);

					await timeout(10);
					progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: text.repeat(1000) + 'DONE' }] }]);

					throw new Error('Too long');
				},
			}));


			// let modelChangeCounter = 0;
			// store.add(editor.getModel().onDidChangeContent(() => { modelChangeCounter++; }));

			ctrl = instaService.createInstance(TestController, editor);
			const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
			const r = ctrl.run({ message: 'Hello', autoSend: true });
			assert.strictEqual(await p, undefined);

			// assert.ok(modelChangeCounter > 0, modelChangeCounter.toString()); // some changes have been made
			// const modelChangeCounterNow = modelChangeCounter;

			assert.ok(!editor.getModel().getValue().includes('DONE'));
			await timeout(10);

			// assert.strictEqual(modelChangeCounterNow, modelChangeCounter);
			assert.ok(!editor.getModel().getValue().includes('DONE'));

			await ctrl.cancelSession();
			await r;
		});
	});

	test('escape doesn\'t remove code added from inline editor chat #3523 1/2', async function () {


		// NO manual edits -> cancel
		ctrl = instaService.createInstance(TestController, editor);
		const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		const r = ctrl.run({ message: 'GENERATED', autoSend: true });
		assert.strictEqual(await p, undefined);

		assert.ok(model.getValue().includes('GENERATED'));
		ctrl.cancelSession();
		await r;
		assert.ok(!model.getValue().includes('GENERATED'));

	});

	test('escape doesn\'t remove code added from inline editor chat #3523, 2/2', async function () {

		// manual edits -> finish
		ctrl = instaService.createInstance(TestController, editor);
		const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		const r = ctrl.run({ message: 'GENERATED', autoSend: true });
		assert.strictEqual(await p, undefined);

		assert.ok(model.getValue().includes('GENERATED'));

		editor.executeEdits('test', [EditOperation.insert(model.getFullModelRange().getEndPosition(), 'MANUAL')]);

		ctrl.acceptSession();
		await r;
		assert.ok(model.getValue().includes('GENERATED'));
		assert.ok(model.getValue().includes('MANUAL'));

	});

	test('cancel while applying streamed edits should close the widget', async function () {

		const workerService = instaService.get(IEditorWorkerService) as TestWorkerService;
		const originalCompute = workerService.computeMoreMinimalEdits.bind(workerService);
		const editsBarrier = new DeferredPromise<void>();
		let computeInvoked = false;
		workerService.computeMoreMinimalEdits = async (resource, edits, pretty) => {
			computeInvoked = true;
			await editsBarrier.p;
			return originalCompute(resource, edits, pretty);
		};
		store.add({ dispose: () => { workerService.computeMoreMinimalEdits = originalCompute; } });

		const progressBarrier = new DeferredPromise<void>();
		store.add(chatAgentService.registerDynamicAgent({
			id: 'pendingEditsAgent',
			...agentData
		}, {
			async invoke(request, progress, history, token) {
				progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: request.message }] }]);
				await progressBarrier.p;
				return {};
			},
		}));

		ctrl = instaService.createInstance(TestController, editor);
		const states = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST]);
		const run = ctrl.run({ message: 'BLOCK', autoSend: true });
		assert.strictEqual(await states, undefined);
		assert.ok(computeInvoked);

		ctrl.cancelSession();
		assert.strictEqual(await states, undefined);

		await run;
	});

	test('re-run should discard pending edits', async function () {

		let count = 1;

		store.add(chatAgentService.registerDynamicAgent({
			id: 'testEditorAgent2',
			...agentData
		}, {
			async invoke(request, progress, history, token) {
				progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: request.message + (count++) }] }]);
				return {};
			},
		}));

		ctrl = instaService.createInstance(TestController, editor);
		const rerun = new RerunAction();

		model.setValue('');

		const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		const r = ctrl.run({ message: 'PROMPT_', autoSend: true });
		assert.strictEqual(await p, undefined);


		assert.strictEqual(model.getValue(), 'PROMPT_1');

		const p2 = ctrl.awaitStates([State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		await instaService.invokeFunction(rerun.runInlineChatCommand, ctrl, editor);

		assert.strictEqual(await p2, undefined);

		assert.strictEqual(model.getValue(), 'PROMPT_2');
		ctrl.acceptSession();
		await r;
	});

	test('Retry undoes all changes, not just those from the request#5736', async function () {

		const text = [
			'eins-',
			'zwei-',
			'drei-'
		];

		store.add(chatAgentService.registerDynamicAgent({
			id: 'testEditorAgent2',
			...agentData
		}, {
			async invoke(request, progress, history, token) {
				progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: text.shift() ?? '' }] }]);
				return {};
			},
		}));

		ctrl = instaService.createInstance(TestController, editor);
		const rerun = new RerunAction();

		model.setValue('');

		// REQUEST 1
		const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		const r = ctrl.run({ message: '1', autoSend: true });
		assert.strictEqual(await p, undefined);

		assert.strictEqual(model.getValue(), 'eins-');

		// REQUEST 2
		const p2 = ctrl.awaitStates([State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		ctrl.chatWidget.setInput('1');
		await ctrl.chatWidget.acceptInput();
		assert.strictEqual(await p2, undefined);

		assert.strictEqual(model.getValue(), 'zwei-eins-');

		// REQUEST 2 - RERUN
		const p3 = ctrl.awaitStates([State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		await instaService.invokeFunction(rerun.runInlineChatCommand, ctrl, editor);
		assert.strictEqual(await p3, undefined);

		assert.strictEqual(model.getValue(), 'drei-eins-');

		ctrl.acceptSession();
		await r;

	});

	test('moving inline chat to another model undoes changes', async function () {
		const text = [
			'eins\n',
			'zwei\n'
		];

		store.add(chatAgentService.registerDynamicAgent({
			id: 'testEditorAgent2',
			...agentData
		}, {
			async invoke(request, progress, history, token) {
				progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: text.shift() ?? '' }] }]);
				return {};
			},
		}));
		ctrl = instaService.createInstance(TestController, editor);

		// REQUEST 1
		const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		ctrl.run({ message: '1', autoSend: true });
		assert.strictEqual(await p, undefined);

		assert.strictEqual(model.getValue(), 'eins\nHello\nWorld\nHello Again\nHello World\n');

		const targetModel = chatService.startSession(ChatAgentLocation.EditorInline)!;
		store.add(targetModel);
		chatWidget = new class extends mock<IChatWidget>() {
			override get viewModel() {
				// eslint-disable-next-line local/code-no-any-casts
				return { model: targetModel.object } as any;
			}
			override focusResponseItem() { }
		};

		const r = ctrl.joinCurrentRun();
		await ctrl.viewInChat();

		assert.strictEqual(model.getValue(), 'Hello\nWorld\nHello Again\nHello World\n');
		await r;
	});

	test('moving inline chat to another model undoes changes (2 requests)', async function () {
		const text = [
			'eins\n',
			'zwei\n'
		];

		store.add(chatAgentService.registerDynamicAgent({
			id: 'testEditorAgent2',
			...agentData
		}, {
			async invoke(request, progress, history, token) {
				progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: text.shift() ?? '' }] }]);
				return {};
			},
		}));
		ctrl = instaService.createInstance(TestController, editor);

		// REQUEST 1
		const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		ctrl.run({ message: '1', autoSend: true });
		assert.strictEqual(await p, undefined);

		assert.strictEqual(model.getValue(), 'eins\nHello\nWorld\nHello Again\nHello World\n');

		// REQUEST 2
		const p2 = ctrl.awaitStates([State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		ctrl.chatWidget.setInput('1');
		await ctrl.chatWidget.acceptInput();
		assert.strictEqual(await p2, undefined);

		assert.strictEqual(model.getValue(), 'zwei\neins\nHello\nWorld\nHello Again\nHello World\n');

		const targetModel = chatService.startSession(ChatAgentLocation.EditorInline)!;
		store.add(targetModel);
		chatWidget = new class extends mock<IChatWidget>() {
			override get viewModel() {
				// eslint-disable-next-line local/code-no-any-casts
				return { model: targetModel.object } as any;
			}
			override focusResponseItem() { }
		};

		const r = ctrl.joinCurrentRun();

		await ctrl.viewInChat();

		assert.strictEqual(model.getValue(), 'Hello\nWorld\nHello Again\nHello World\n');

		await r;
	});

	// TODO@jrieken https://github.com/microsoft/vscode/issues/251429
	test.skip('Clicking "re-run without /doc" while a request is in progress closes the widget #5997', async function () {

		model.setValue('');

		let count = 0;
		const commandDetection: (boolean | undefined)[] = [];

		const onDidInvoke = new Emitter<void>();

		store.add(chatAgentService.registerDynamicAgent({
			id: 'testEditorAgent2',
			...agentData
		}, {
			async invoke(request, progress, history, token) {
				queueMicrotask(() => onDidInvoke.fire());
				commandDetection.push(request.enableCommandDetection);
				progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: request.message + (count++) }] }]);

				if (count === 1) {
					// FIRST call waits for cancellation
					await raceCancellation(new Promise<never>(() => { }), token);
				} else {
					await timeout(10);
				}

				return {};
			},
		}));
		ctrl = instaService.createInstance(TestController, editor);

		// REQUEST 1
		// const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST]);
		const p = Event.toPromise(onDidInvoke.event);
		ctrl.run({ message: 'Hello-', autoSend: true });

		await p;

		// assert.strictEqual(await p, undefined);

		// resend pending request without command detection
		const request = ctrl.chatWidget.viewModel?.model.getRequests().at(-1);
		assertType(request);
		const p2 = Event.toPromise(onDidInvoke.event);
		const p3 = ctrl.awaitStates([State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		chatService.resendRequest(request, { noCommandDetection: true, attempt: request.attempt + 1, location: ChatAgentLocation.EditorInline });

		await p2;
		assert.strictEqual(await p3, undefined);

		assert.deepStrictEqual(commandDetection, [true, false]);
		assert.strictEqual(model.getValue(), 'Hello-1');
	});

	test('Re-run without after request is done', async function () {

		model.setValue('');

		let count = 0;
		const commandDetection: (boolean | undefined)[] = [];

		store.add(chatAgentService.registerDynamicAgent({
			id: 'testEditorAgent2',
			...agentData
		}, {
			async invoke(request, progress, history, token) {
				commandDetection.push(request.enableCommandDetection);
				progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: request.message + (count++) }] }]);
				return {};
			},
		}));
		ctrl = instaService.createInstance(TestController, editor);

		// REQUEST 1
		const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		ctrl.run({ message: 'Hello-', autoSend: true });
		assert.strictEqual(await p, undefined);

		// resend pending request without command detection
		const request = ctrl.chatWidget.viewModel?.model.getRequests().at(-1);
		assertType(request);
		const p2 = ctrl.awaitStates([State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		chatService.resendRequest(request, { noCommandDetection: true, attempt: request.attempt + 1, location: ChatAgentLocation.EditorInline });

		assert.strictEqual(await p2, undefined);

		assert.deepStrictEqual(commandDetection, [true, false]);
		assert.strictEqual(model.getValue(), 'Hello-1');
	});


	test('Inline: Pressing Rerun request while the response streams breaks the response #5442', async function () {

		model.setValue('two\none\n');

		const attempts: (number | undefined)[] = [];

		const deferred = new DeferredPromise<void>();

		store.add(chatAgentService.registerDynamicAgent({
			id: 'testEditorAgent2',
			...agentData
		}, {
			async invoke(request, progress, history, token) {

				attempts.push(request.attempt);

				progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: `TRY:${request.attempt}\n` }] }]);
				await raceCancellation(deferred.p, token);
				deferred.complete();
				await timeout(10);
				return {};
			},
		}));

		ctrl = instaService.createInstance(TestController, editor);

		// REQUEST 1
		const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST]);
		ctrl.run({ message: 'Hello-', autoSend: true });
		assert.strictEqual(await p, undefined);
		await timeout(10);
		assert.deepStrictEqual(attempts, [0]);

		// RERUN (cancel, undo, redo)
		const p2 = ctrl.awaitStates([State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
		const rerun = new RerunAction();
		await instaService.invokeFunction(rerun.runInlineChatCommand, ctrl, editor);
		assert.strictEqual(await p2, undefined);

		assert.deepStrictEqual(attempts, [0, 1]);

		assert.strictEqual(model.getValue(), 'TRY:1\ntwo\none\n');

	});

	test('Stopping/cancelling a request should NOT undo its changes', async function () {

		model.setValue('World');

		const deferred = new DeferredPromise<void>();
		let progress: ((parts: IChatProgress[]) => void) | undefined;

		store.add(chatAgentService.registerDynamicAgent({
			id: 'testEditorAgent2',
			...agentData
		}, {
			async invoke(request, _progress, history, token) {

				progress = _progress;
				await deferred.p;
				return {};
			},
		}));

		ctrl = instaService.createInstance(TestController, editor);

		// REQUEST 1
		const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST]);
		ctrl.run({ message: 'Hello', autoSend: true });
		await timeout(10);
		assert.strictEqual(await p, undefined);

		assertType(progress);

		const modelChange = new Promise<void>(resolve => model.onDidChangeContent(() => resolve()));

		progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: 'Hello-Hello' }] }]);

		await modelChange;
		assert.strictEqual(model.getValue(), 'HelloWorld'); // first word has been streamed

		const p2 = ctrl.awaitStates([State.WAIT_FOR_INPUT]);
		chatService.cancelCurrentRequestForSession(ctrl.chatWidget.viewModel!.model.sessionResource);
		assert.strictEqual(await p2, undefined);

		assert.strictEqual(model.getValue(), 'HelloWorld'); // CANCEL just stops the request and progressive typing but doesn't undo

	});

	test('Apply Edits from existing session w/ edits', async function () {

		model.setValue('');

		const newSession = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(newSession);

		await (await chatService.sendRequest(newSession.chatModel.sessionResource, 'Existing', { location: ChatAgentLocation.EditorInline }))?.responseCreatedPromise;

		assert.strictEqual(newSession.chatModel.requestInProgress.get(), true);

		const response = newSession.chatModel.lastRequest?.response;
		assertType(response);

		await new Promise(resolve => {
			if (response.isComplete) {
				resolve(undefined);
			}
			const d = response.onDidChange(() => {
				if (response.isComplete) {
					d.dispose();
					resolve(undefined);
				}
			});
		});

		ctrl = instaService.createInstance(TestController, editor);
		const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE]);
		ctrl.run({ existingSession: newSession });

		assert.strictEqual(await p, undefined);

		assert.strictEqual(model.getValue(), 'Existing');

	});

	test('Undo on error (2 rounds)', async function () {

		return runWithFakedTimers({}, async () => {


			store.add(chatAgentService.registerDynamicAgent({ id: 'testEditorAgent', ...agentData, }, {
				async invoke(request, progress, history, token) {

					progress([{
						kind: 'textEdit',
						uri: model.uri,
						edits: [{
							range: new Range(1, 1, 1, 1),
							text: request.message
						}]
					}]);

					if (request.message === 'two') {
						await timeout(100); // give edit a chance
						return {
							errorDetails: { message: 'FAILED' }
						};
					}
					return {};
				},
			}));

			model.setValue('');

			// ROUND 1

			ctrl = instaService.createInstance(TestController, editor);
			const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
			ctrl.run({ autoSend: true, message: 'one' });
			assert.strictEqual(await p, undefined);
			assert.strictEqual(model.getValue(), 'one');


			// ROUND 2

			const p2 = ctrl.awaitStates([State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
			const values = new Set<string>();
			store.add(model.onDidChangeContent(() => values.add(model.getValue())));
			ctrl.chatWidget.acceptInput('two'); // WILL Trigger a failure
			assert.strictEqual(await p2, undefined);
			assert.strictEqual(model.getValue(), 'one'); // undone
			assert.ok(values.has('twoone')); // we had but the change got undone
		});
	});

	test('Inline chat "discard" button does not always appear if response is stopped #228030', async function () {

		model.setValue('World');

		const deferred = new DeferredPromise<void>();

		store.add(chatAgentService.registerDynamicAgent({
			id: 'testEditorAgent2',
			...agentData
		}, {
			async invoke(request, progress, history, token) {

				progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: 'Hello-Hello' }] }]);
				await deferred.p;
				return {};
			},
		}));

		ctrl = instaService.createInstance(TestController, editor);

		// REQUEST 1
		const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST]);
		ctrl.run({ message: 'Hello', autoSend: true });


		assert.strictEqual(await p, undefined);

		const p2 = ctrl.awaitStates([State.WAIT_FOR_INPUT]);
		chatService.cancelCurrentRequestForSession(ctrl.chatWidget.viewModel!.model.sessionResource);
		assert.strictEqual(await p2, undefined);


		const value = contextKeyService.getContextKeyValue(CTX_INLINE_CHAT_RESPONSE_TYPE.key);
		assert.notStrictEqual(value, InlineChatResponseType.None);
	});

	test('Restore doesn\'t edit on errored result', async function () {
		return runWithFakedTimers({ useFakeTimers: true }, async () => {

			const model2 = store.add(instaService.get(IModelService).createModel('ABC', null));

			model.setValue('World');

			store.add(chatAgentService.registerDynamicAgent({
				id: 'testEditorAgent2',
				...agentData
			}, {
				async invoke(request, progress, history, token) {

					progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: 'Hello1' }] }]);
					await timeout(100);
					progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: 'Hello2' }] }]);
					await timeout(100);
					progress([{ kind: 'textEdit', uri: model.uri, edits: [{ range: new Range(1, 1, 1, 1), text: 'Hello3' }] }]);
					await timeout(100);

					return {
						errorDetails: { message: 'FAILED' }
					};
				},
			}));

			ctrl = instaService.createInstance(TestController, editor);

			// REQUEST 1
			const p = ctrl.awaitStates([...TestController.INIT_SEQUENCE, State.SHOW_REQUEST, State.WAIT_FOR_INPUT]);
			ctrl.run({ message: 'Hello', autoSend: true });

			assert.strictEqual(await p, undefined);

			const p2 = ctrl.awaitStates([State.PAUSE]);
			editor.setModel(model2);
			assert.strictEqual(await p2, undefined);

			const p3 = ctrl.awaitStates([...TestController.INIT_SEQUENCE]);
			editor.setModel(model);
			assert.strictEqual(await p3, undefined);

			assert.strictEqual(model.getValue(), 'World');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/test/browser/inlineChatSession.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/test/browser/inlineChatSession.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IObservable, constObservable } from '../../../../../base/common/observable.js';
import { assertType } from '../../../../../base/common/types.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { assertSnapshot } from '../../../../../base/test/common/snapshot.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IActiveCodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { IDiffProviderFactoryService } from '../../../../../editor/browser/widget/diffEditor/diffProviderFactoryService.js';
import { EditOperation } from '../../../../../editor/common/core/editOperation.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IEditorWorkerService } from '../../../../../editor/common/services/editorWorker.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { TestDiffProviderFactoryService } from '../../../../../editor/test/browser/diff/testDiffProviderFactoryService.js';
import { TestCommandService } from '../../../../../editor/test/browser/editorTestServices.js';
import { instantiateTestCodeEditor } from '../../../../../editor/test/browser/testCodeEditor.js';
import { IAccessibleViewService } from '../../../../../platform/accessibility/browser/accessibleView.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IEditorProgressService, IProgressRunner } from '../../../../../platform/progress/common/progress.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IViewDescriptorService } from '../../../../common/views.js';
import { IWorkbenchAssignmentService } from '../../../../services/assignment/common/assignmentService.js';
import { NullWorkbenchAssignmentService } from '../../../../services/assignment/test/common/nullAssignmentService.js';
import { IExtensionService, nullExtensionDescription } from '../../../../services/extensions/common/extensions.js';
import { IViewsService } from '../../../../services/views/common/viewsService.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { TestContextService, TestExtensionService } from '../../../../test/common/workbenchTestServices.js';
import { AccessibilityVerbositySettingId } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { IChatAccessibilityService, IChatWidgetService, IQuickChatService } from '../../../chat/browser/chat.js';
import { ChatSessionsService } from '../../../chat/browser/chatSessions.contribution.js';
import { ChatVariablesService } from '../../../chat/browser/chatVariables.js';
import { ChatWidget } from '../../../chat/browser/chatWidget.js';
import { ChatAgentService, IChatAgentService } from '../../../chat/common/chatAgents.js';
import { IChatEditingService, IChatEditingSession } from '../../../chat/common/chatEditingService.js';
import { IChatRequestModel } from '../../../chat/common/chatModel.js';
import { IChatService } from '../../../chat/common/chatService.js';
import { ChatService } from '../../../chat/common/chatServiceImpl.js';
import { IChatSessionsService } from '../../../chat/common/chatSessionsService.js';
import { ChatSlashCommandService, IChatSlashCommandService } from '../../../chat/common/chatSlashCommands.js';
import { ChatTransferService, IChatTransferService } from '../../../chat/common/chatTransferService.js';
import { IChatVariablesService } from '../../../chat/common/chatVariables.js';
import { IChatResponseViewModel } from '../../../chat/common/chatViewModel.js';
import { ChatWidgetHistoryService, IChatWidgetHistoryService } from '../../../chat/common/chatWidgetHistoryService.js';
import { ChatAgentLocation, ChatModeKind } from '../../../chat/common/constants.js';
import { ILanguageModelsService } from '../../../chat/common/languageModels.js';
import { ILanguageModelToolsService } from '../../../chat/common/languageModelToolsService.js';
import { NullLanguageModelsService } from '../../../chat/test/common/languageModels.js';
import { MockLanguageModelToolsService } from '../../../chat/test/common/mockLanguageModelToolsService.js';
import { IMcpService } from '../../../mcp/common/mcpTypes.js';
import { TestMcpService } from '../../../mcp/test/common/testMcpService.js';
import { HunkState } from '../../browser/inlineChatSession.js';
import { IInlineChatSessionService } from '../../browser/inlineChatSessionService.js';
import { InlineChatSessionServiceImpl } from '../../browser/inlineChatSessionServiceImpl.js';
import { TestWorkerService } from './testWorkerService.js';
import { ChatWidgetService } from '../../../chat/browser/chatWidgetService.js';
import { URI } from '../../../../../base/common/uri.js';

suite('InlineChatSession', function () {

	const store = new DisposableStore();
	let editor: IActiveCodeEditor;
	let model: ITextModel;
	let instaService: TestInstantiationService;

	let inlineChatSessionService: IInlineChatSessionService;

	setup(function () {
		const contextKeyService = new MockContextKeyService();


		const serviceCollection = new ServiceCollection(
			[IConfigurationService, new TestConfigurationService()],
			[IChatVariablesService, new SyncDescriptor(ChatVariablesService)],
			[ILogService, new NullLogService()],
			[ITelemetryService, NullTelemetryService],
			[IExtensionService, new TestExtensionService()],
			[IContextKeyService, new MockContextKeyService()],
			[IViewsService, new TestExtensionService()],
			[IWorkspaceContextService, new TestContextService()],
			[IChatWidgetHistoryService, new SyncDescriptor(ChatWidgetHistoryService)],
			[IChatWidgetService, new SyncDescriptor(ChatWidgetService)],
			[IChatSlashCommandService, new SyncDescriptor(ChatSlashCommandService)],
			[IChatTransferService, new SyncDescriptor(ChatTransferService)],
			[IChatSessionsService, new SyncDescriptor(ChatSessionsService)],
			[IChatService, new SyncDescriptor(ChatService)],
			[IEditorWorkerService, new SyncDescriptor(TestWorkerService)],
			[IChatAgentService, new SyncDescriptor(ChatAgentService)],
			[IContextKeyService, contextKeyService],
			[IDiffProviderFactoryService, new SyncDescriptor(TestDiffProviderFactoryService)],
			[ILanguageModelsService, new SyncDescriptor(NullLanguageModelsService)],
			[IInlineChatSessionService, new SyncDescriptor(InlineChatSessionServiceImpl)],
			[ICommandService, new SyncDescriptor(TestCommandService)],
			[ILanguageModelToolsService, new MockLanguageModelToolsService()],
			[IMcpService, new TestMcpService()],
			[IEditorProgressService, new class extends mock<IEditorProgressService>() {
				override show(total: unknown, delay?: unknown): IProgressRunner {
					return {
						total() { },
						worked(value) { },
						done() { },
					};
				}
			}],
			[IChatEditingService, new class extends mock<IChatEditingService>() {
				override editingSessionsObs: IObservable<readonly IChatEditingSession[]> = constObservable([]);
			}],
			[IChatAccessibilityService, new class extends mock<IChatAccessibilityService>() {
				override acceptResponse(chatWidget: ChatWidget, container: HTMLElement, response: IChatResponseViewModel | undefined, requestId: URI | undefined): void { }
				override acceptRequest(): URI | undefined { return undefined; }
				override acceptElicitation(): void { }
			}],
			[IAccessibleViewService, new class extends mock<IAccessibleViewService>() {
				override getOpenAriaHint(verbositySettingKey: AccessibilityVerbositySettingId): string | null {
					return null;
				}
			}],
			[IQuickChatService, new class extends mock<IQuickChatService>() { }],
			[IConfigurationService, new TestConfigurationService()],
			[IViewDescriptorService, new class extends mock<IViewDescriptorService>() {
				override onDidChangeLocation = Event.None;
			}],
			[IWorkbenchAssignmentService, new NullWorkbenchAssignmentService()]
		);



		instaService = store.add(workbenchInstantiationService(undefined, store).createChild(serviceCollection));
		inlineChatSessionService = store.add(instaService.get(IInlineChatSessionService));
		store.add(instaService.get(IChatSessionsService) as ChatSessionsService);  // Needs to be disposed in between test runs to clear extensionPoint contribution
		store.add(instaService.get(IChatService) as ChatService);

		instaService.get(IChatAgentService).registerDynamicAgent({
			extensionId: nullExtensionDescription.identifier,
			extensionVersion: undefined,
			publisherDisplayName: '',
			extensionDisplayName: '',
			extensionPublisherId: '',
			id: 'testAgent',
			name: 'testAgent',
			isDefault: true,
			locations: [ChatAgentLocation.EditorInline],
			modes: [ChatModeKind.Ask],
			metadata: {},
			slashCommands: [],
			disambiguation: [],
		}, {
			async invoke() {
				return {};
			}
		});


		store.add(instaService.get(IEditorWorkerService) as TestWorkerService);
		model = store.add(instaService.get(IModelService).createModel('one\ntwo\nthree\nfour\nfive\nsix\nseven\neight\nnine\nten\neleven', null));
		editor = store.add(instantiateTestCodeEditor(instaService, model));
	});

	teardown(async function () {
		store.clear();
		await instaService.get(IChatService).waitForModelDisposals();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	async function makeEditAsAi(edit: EditOperation | EditOperation[]) {
		const session = inlineChatSessionService.getSession(editor, editor.getModel()!.uri);
		assertType(session);
		session.hunkData.ignoreTextModelNChanges = true;
		try {
			editor.executeEdits('test', Array.isArray(edit) ? edit : [edit]);
		} finally {
			session.hunkData.ignoreTextModelNChanges = false;
		}
		await session.hunkData.recompute({ applied: 0, sha1: 'fakeSha1' });
	}

	function makeEdit(edit: EditOperation | EditOperation[]) {
		editor.executeEdits('test', Array.isArray(edit) ? edit : [edit]);
	}

	test('Create, release', async function () {

		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);
		inlineChatSessionService.releaseSession(session);
	});

	test('HunkData, info', async function () {

		const decorationCountThen = model.getAllDecorations().length;

		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);
		assert.ok(session.textModelN === model);

		await makeEditAsAi(EditOperation.insert(new Position(1, 1), 'AI_EDIT\n'));


		assert.strictEqual(session.hunkData.size, 1);
		let [hunk] = session.hunkData.getInfo();
		assertType(hunk);

		assert.ok(!session.textModel0.equalsTextBuffer(session.textModelN.getTextBuffer()));
		assert.strictEqual(hunk.getState(), HunkState.Pending);
		assert.ok(hunk.getRangesN()[0].equalsRange({ startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 8 }));

		await makeEditAsAi(EditOperation.insert(new Position(1, 3), 'foobar'));
		[hunk] = session.hunkData.getInfo();
		assert.ok(hunk.getRangesN()[0].equalsRange({ startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 14 }));

		inlineChatSessionService.releaseSession(session);

		assert.strictEqual(model.getAllDecorations().length, decorationCountThen); // no leaked decorations!
	});

	test('HunkData, accept', async function () {

		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);

		await makeEditAsAi([EditOperation.insert(new Position(1, 1), 'AI_EDIT\n'), EditOperation.insert(new Position(10, 1), 'AI_EDIT\n')]);

		assert.strictEqual(session.hunkData.size, 2);
		assert.ok(!session.textModel0.equalsTextBuffer(session.textModelN.getTextBuffer()));

		for (const hunk of session.hunkData.getInfo()) {
			assertType(hunk);
			assert.strictEqual(hunk.getState(), HunkState.Pending);
			hunk.acceptChanges();
			assert.strictEqual(hunk.getState(), HunkState.Accepted);
		}

		assert.strictEqual(session.textModel0.getValue(), session.textModelN.getValue());
		inlineChatSessionService.releaseSession(session);
	});

	test('HunkData, reject', async function () {

		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);

		await makeEditAsAi([EditOperation.insert(new Position(1, 1), 'AI_EDIT\n'), EditOperation.insert(new Position(10, 1), 'AI_EDIT\n')]);

		assert.strictEqual(session.hunkData.size, 2);
		assert.ok(!session.textModel0.equalsTextBuffer(session.textModelN.getTextBuffer()));

		for (const hunk of session.hunkData.getInfo()) {
			assertType(hunk);
			assert.strictEqual(hunk.getState(), HunkState.Pending);
			hunk.discardChanges();
			assert.strictEqual(hunk.getState(), HunkState.Rejected);
		}

		assert.strictEqual(session.textModel0.getValue(), session.textModelN.getValue());
		inlineChatSessionService.releaseSession(session);
	});

	test('HunkData, N rounds', async function () {

		model.setValue('one\ntwo\nthree\nfour\nfive\nsix\nseven\neight\nnine\nten\neleven\ntwelwe\nthirteen\nfourteen\nfifteen\nsixteen\nseventeen\neighteen\nnineteen\n');

		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);

		assert.ok(session.textModel0.equalsTextBuffer(session.textModelN.getTextBuffer()));

		assert.strictEqual(session.hunkData.size, 0);

		// ROUND #1
		await makeEditAsAi([
			EditOperation.insert(new Position(1, 1), 'AI1'),
			EditOperation.insert(new Position(4, 1), 'AI2'),
			EditOperation.insert(new Position(19, 1), 'AI3')
		]);

		assert.strictEqual(session.hunkData.size, 2); // AI1, AI2 are merged into one hunk, AI3 is a separate hunk

		let [first, second] = session.hunkData.getInfo();

		assert.ok(model.getValueInRange(first.getRangesN()[0]).includes('AI1'));
		assert.ok(model.getValueInRange(first.getRangesN()[0]).includes('AI2'));
		assert.ok(model.getValueInRange(second.getRangesN()[0]).includes('AI3'));

		assert.ok(!session.textModel0.getValueInRange(first.getRangesN()[0]).includes('AI1'));
		assert.ok(!session.textModel0.getValueInRange(first.getRangesN()[0]).includes('AI2'));
		assert.ok(!session.textModel0.getValueInRange(second.getRangesN()[0]).includes('AI3'));

		first.acceptChanges();
		assert.ok(session.textModel0.getValueInRange(first.getRangesN()[0]).includes('AI1'));
		assert.ok(session.textModel0.getValueInRange(first.getRangesN()[0]).includes('AI2'));
		assert.ok(!session.textModel0.getValueInRange(second.getRangesN()[0]).includes('AI3'));


		// ROUND #2
		await makeEditAsAi([
			EditOperation.insert(new Position(7, 1), 'AI4'),
		]);
		assert.strictEqual(session.hunkData.size, 2);

		[first, second] = session.hunkData.getInfo();
		assert.ok(model.getValueInRange(first.getRangesN()[0]).includes('AI4')); // the new hunk (in line-order)
		assert.ok(model.getValueInRange(second.getRangesN()[0]).includes('AI3')); // the previous hunk remains

		inlineChatSessionService.releaseSession(session);
	});

	test('HunkData, (mirror) edit before', async function () {

		const lines = ['one', 'two', 'three'];
		model.setValue(lines.join('\n'));
		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);

		await makeEditAsAi([EditOperation.insert(new Position(3, 1), 'AI WAS HERE\n')]);
		assert.strictEqual(session.textModelN.getValue(), ['one', 'two', 'AI WAS HERE', 'three'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), lines.join('\n'));

		makeEdit([EditOperation.replace(new Range(1, 1, 1, 4), 'ONE')]);
		assert.strictEqual(session.textModelN.getValue(), ['ONE', 'two', 'AI WAS HERE', 'three'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), ['ONE', 'two', 'three'].join('\n'));
	});

	test('HunkData, (mirror) edit after', async function () {

		const lines = ['one', 'two', 'three', 'four', 'five'];
		model.setValue(lines.join('\n'));

		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);

		await makeEditAsAi([EditOperation.insert(new Position(3, 1), 'AI_EDIT\n')]);

		assert.strictEqual(session.hunkData.size, 1);
		const [hunk] = session.hunkData.getInfo();

		makeEdit([EditOperation.insert(new Position(1, 1), 'USER1')]);
		assert.strictEqual(session.textModelN.getValue(), ['USER1one', 'two', 'AI_EDIT', 'three', 'four', 'five'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), ['USER1one', 'two', 'three', 'four', 'five'].join('\n'));

		makeEdit([EditOperation.insert(new Position(5, 1), 'USER2')]);
		assert.strictEqual(session.textModelN.getValue(), ['USER1one', 'two', 'AI_EDIT', 'three', 'USER2four', 'five'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), ['USER1one', 'two', 'three', 'USER2four', 'five'].join('\n'));

		hunk.acceptChanges();
		assert.strictEqual(session.textModelN.getValue(), ['USER1one', 'two', 'AI_EDIT', 'three', 'USER2four', 'five'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), ['USER1one', 'two', 'AI_EDIT', 'three', 'USER2four', 'five'].join('\n'));
	});

	test('HunkData, (mirror) edit inside ', async function () {

		const lines = ['one', 'two', 'three'];
		model.setValue(lines.join('\n'));
		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);

		await makeEditAsAi([EditOperation.insert(new Position(3, 1), 'AI WAS HERE\n')]);
		assert.strictEqual(session.textModelN.getValue(), ['one', 'two', 'AI WAS HERE', 'three'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), lines.join('\n'));

		makeEdit([EditOperation.replace(new Range(3, 4, 3, 7), 'wwaaassss')]);
		assert.strictEqual(session.textModelN.getValue(), ['one', 'two', 'AI wwaaassss HERE', 'three'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), ['one', 'two', 'three'].join('\n'));
	});

	test('HunkData, (mirror) edit after dicard ', async function () {

		const lines = ['one', 'two', 'three'];
		model.setValue(lines.join('\n'));
		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);

		await makeEditAsAi([EditOperation.insert(new Position(3, 1), 'AI WAS HERE\n')]);
		assert.strictEqual(session.textModelN.getValue(), ['one', 'two', 'AI WAS HERE', 'three'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), lines.join('\n'));

		assert.strictEqual(session.hunkData.size, 1);
		const [hunk] = session.hunkData.getInfo();
		hunk.discardChanges();
		assert.strictEqual(session.textModelN.getValue(), lines.join('\n'));
		assert.strictEqual(session.textModel0.getValue(), lines.join('\n'));

		makeEdit([EditOperation.replace(new Range(3, 4, 3, 6), '3333')]);
		assert.strictEqual(session.textModelN.getValue(), ['one', 'two', 'thr3333'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), ['one', 'two', 'thr3333'].join('\n'));
	});

	test('HunkData, (mirror) edit after, multi turn', async function () {

		const lines = ['one', 'two', 'three', 'four', 'five'];
		model.setValue(lines.join('\n'));

		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);

		await makeEditAsAi([EditOperation.insert(new Position(3, 1), 'AI_EDIT\n')]);

		assert.strictEqual(session.hunkData.size, 1);

		makeEdit([EditOperation.insert(new Position(5, 1), 'FOO')]);
		assert.strictEqual(session.textModelN.getValue(), ['one', 'two', 'AI_EDIT', 'three', 'FOOfour', 'five'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), ['one', 'two', 'three', 'FOOfour', 'five'].join('\n'));

		await makeEditAsAi([EditOperation.insert(new Position(2, 4), ' zwei')]);
		assert.strictEqual(session.hunkData.size, 1);

		assert.strictEqual(session.textModelN.getValue(), ['one', 'two zwei', 'AI_EDIT', 'three', 'FOOfour', 'five'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), ['one', 'two', 'three', 'FOOfour', 'five'].join('\n'));

		makeEdit([EditOperation.replace(new Range(6, 3, 6, 5), 'vefivefi')]);
		assert.strictEqual(session.textModelN.getValue(), ['one', 'two zwei', 'AI_EDIT', 'three', 'FOOfour', 'fivefivefi'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), ['one', 'two', 'three', 'FOOfour', 'fivefivefi'].join('\n'));
	});

	test('HunkData, (mirror) edit after, multi turn 2', async function () {

		const lines = ['one', 'two', 'three', 'four', 'five'];
		model.setValue(lines.join('\n'));

		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);

		await makeEditAsAi([EditOperation.insert(new Position(3, 1), 'AI_EDIT\n')]);

		assert.strictEqual(session.hunkData.size, 1);

		makeEdit([EditOperation.insert(new Position(5, 1), 'FOO')]);
		assert.strictEqual(session.textModelN.getValue(), ['one', 'two', 'AI_EDIT', 'three', 'FOOfour', 'five'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), ['one', 'two', 'three', 'FOOfour', 'five'].join('\n'));

		await makeEditAsAi([EditOperation.insert(new Position(2, 4), 'zwei')]);
		assert.strictEqual(session.hunkData.size, 1);

		assert.strictEqual(session.textModelN.getValue(), ['one', 'twozwei', 'AI_EDIT', 'three', 'FOOfour', 'five'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), ['one', 'two', 'three', 'FOOfour', 'five'].join('\n'));

		makeEdit([EditOperation.replace(new Range(6, 3, 6, 5), 'vefivefi')]);
		assert.strictEqual(session.textModelN.getValue(), ['one', 'twozwei', 'AI_EDIT', 'three', 'FOOfour', 'fivefivefi'].join('\n'));
		assert.strictEqual(session.textModel0.getValue(), ['one', 'two', 'three', 'FOOfour', 'fivefivefi'].join('\n'));

		session.hunkData.getInfo()[0].acceptChanges();
		assert.strictEqual(session.textModelN.getValue(), session.textModel0.getValue());

		makeEdit([EditOperation.replace(new Range(1, 1, 1, 1), 'done')]);
		assert.strictEqual(session.textModelN.getValue(), session.textModel0.getValue());
	});

	test('HunkData, accept, discardAll', async function () {

		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);

		await makeEditAsAi([EditOperation.insert(new Position(1, 1), 'AI_EDIT\n'), EditOperation.insert(new Position(10, 1), 'AI_EDIT\n')]);

		assert.strictEqual(session.hunkData.size, 2);
		assert.ok(!session.textModel0.equalsTextBuffer(session.textModelN.getTextBuffer()));

		const textModeNNow = session.textModelN.getValue();

		session.hunkData.getInfo()[0].acceptChanges();
		assert.strictEqual(textModeNNow, session.textModelN.getValue());

		session.hunkData.discardAll(); // all remaining
		assert.strictEqual(session.textModelN.getValue(), 'AI_EDIT\none\ntwo\nthree\nfour\nfive\nsix\nseven\neight\nnine\nten\neleven');
		assert.strictEqual(session.textModelN.getValue(), session.textModel0.getValue());

		inlineChatSessionService.releaseSession(session);
	});

	test('HunkData, discardAll return undo edits', async function () {

		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);

		await makeEditAsAi([EditOperation.insert(new Position(1, 1), 'AI_EDIT\n'), EditOperation.insert(new Position(10, 1), 'AI_EDIT\n')]);

		assert.strictEqual(session.hunkData.size, 2);
		assert.ok(!session.textModel0.equalsTextBuffer(session.textModelN.getTextBuffer()));

		const textModeNNow = session.textModelN.getValue();

		session.hunkData.getInfo()[0].acceptChanges();
		assert.strictEqual(textModeNNow, session.textModelN.getValue());

		const undoEdits = session.hunkData.discardAll(); // all remaining
		assert.strictEqual(session.textModelN.getValue(), 'AI_EDIT\none\ntwo\nthree\nfour\nfive\nsix\nseven\neight\nnine\nten\neleven');
		assert.strictEqual(session.textModelN.getValue(), session.textModel0.getValue());

		// undo the discards
		session.textModelN.pushEditOperations(null, undoEdits, () => null);
		assert.strictEqual(textModeNNow, session.textModelN.getValue());

		inlineChatSessionService.releaseSession(session);
	});

	test('Pressing Escape after inline chat errored with "response filtered" leaves document dirty #7764', async function () {

		const origValue = `class Foo {
	private onError(error: string): void {
		if (/The request timed out|The network connection was lost/i.test(error)) {
			return;
		}

		error = error.replace(/See https:\/\/github\.com\/Squirrel\/Squirrel\.Mac\/issues\/182 for more information/, 'This might mean the application was put on quarantine by macOS. See [this link](https://github.com/microsoft/vscode/issues/7426#issuecomment-425093469) for more information');

		this.notificationService.notify({
			severity: Severity.Error,
			message: error,
			source: nls.localize('update service', "Update Service"),
		});
	}
}`;
		model.setValue(origValue);

		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);

		const fakeRequest = new class extends mock<IChatRequestModel>() {
			override get id() { return 'one'; }
		};
		session.markModelVersion(fakeRequest);

		assert.strictEqual(editor.getModel().getLineCount(), 15);

		await makeEditAsAi([EditOperation.replace(new Range(7, 1, 7, Number.MAX_SAFE_INTEGER), `error = error.replace(
			/See https:\/\/github\.com\/Squirrel\/Squirrel\.Mac\/issues\/182 for more information/,
			'This might mean the application was put on quarantine by macOS. See [this link](https://github.com/microsoft/vscode/issues/7426#issuecomment-425093469) for more information'
		);`)]);

		assert.strictEqual(editor.getModel().getLineCount(), 18);

		// called when a response errors out
		await session.undoChangesUntil(fakeRequest.id);
		await session.hunkData.recompute({ applied: 0, sha1: 'fakeSha1' }, undefined);

		assert.strictEqual(editor.getModel().getValue(), origValue);

		session.hunkData.discardAll(); // called when dimissing the session
		assert.strictEqual(editor.getModel().getValue(), origValue);
	});

	test('Apply Code\'s preview should be easier to undo/esc #7537', async function () {
		model.setValue(`export function fib(n) {
	if (n <= 0) return 0;
	if (n === 1) return 0;
	if (n === 2) return 1;
	return fib(n - 1) + fib(n - 2);
}`);
		const session = await inlineChatSessionService.createSession(editor, {}, CancellationToken.None);
		assertType(session);

		await makeEditAsAi([EditOperation.replace(new Range(5, 1, 6, Number.MAX_SAFE_INTEGER), `
	let a = 0, b = 1, c;
	for (let i = 3; i <= n; i++) {
		c = a + b;
		a = b;
		b = c;
	}
	return b;
}`)]);

		assert.strictEqual(session.hunkData.size, 1);
		assert.strictEqual(session.hunkData.pending, 1);
		assert.ok(session.hunkData.getInfo().every(d => d.getState() === HunkState.Pending));

		await assertSnapshot(editor.getModel().getValue(), { name: '1' });

		await model.undo();
		await assertSnapshot(editor.getModel().getValue(), { name: '2' });

		// overlapping edits (even UNDO) mark edits as accepted
		assert.strictEqual(session.hunkData.size, 1);
		assert.strictEqual(session.hunkData.pending, 0);
		assert.ok(session.hunkData.getInfo().every(d => d.getState() === HunkState.Accepted));

		// no further change when discarding
		session.hunkData.discardAll(); // CANCEL
		await assertSnapshot(editor.getModel().getValue(), { name: '2' });
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/test/browser/inlineChatStrategies.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/test/browser/inlineChatStrategies.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { IntervalTimer } from '../../../../../base/common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { asProgressiveEdit } from '../../browser/utils.js';
import assert from 'assert';


suite('AsyncEdit', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('asProgressiveEdit', async () => {
		const interval = new IntervalTimer();
		const edit = {
			range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 },
			text: 'Hello, world!'
		};

		const cts = new CancellationTokenSource();
		const result = asProgressiveEdit(interval, edit, 5, cts.token);

		// Verify the range
		assert.deepStrictEqual(result.range, edit.range);

		const iter = result.newText[Symbol.asyncIterator]();

		// Verify the newText
		const a = await iter.next();
		assert.strictEqual(a.value, 'Hello,');
		assert.strictEqual(a.done, false);

		// Verify the next word
		const b = await iter.next();
		assert.strictEqual(b.value, ' world!');
		assert.strictEqual(b.done, false);

		const c = await iter.next();
		assert.strictEqual(c.value, undefined);
		assert.strictEqual(c.done, true);

		cts.dispose();
	});

	test('asProgressiveEdit - cancellation', async () => {
		const interval = new IntervalTimer();
		const edit = {
			range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 },
			text: 'Hello, world!'
		};

		const cts = new CancellationTokenSource();
		const result = asProgressiveEdit(interval, edit, 5, cts.token);

		// Verify the range
		assert.deepStrictEqual(result.range, edit.range);

		const iter = result.newText[Symbol.asyncIterator]();

		// Verify the newText
		const a = await iter.next();
		assert.strictEqual(a.value, 'Hello,');
		assert.strictEqual(a.done, false);

		cts.dispose(true);

		const c = await iter.next();
		assert.strictEqual(c.value, undefined);
		assert.strictEqual(c.done, true);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/test/browser/testWorkerService.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/test/browser/testWorkerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { assertType } from '../../../../../base/common/types.js';
import { DiffAlgorithmName, IEditorWorkerService, ILineChange } from '../../../../../editor/common/services/editorWorker.js';
import { IDocumentDiff, IDocumentDiffProviderOptions } from '../../../../../editor/common/diff/documentDiffProvider.js';
import { EditorWorker } from '../../../../../editor/common/services/editorWebWorker.js';
import { LineRange } from '../../../../../editor/common/core/ranges/lineRange.js';
import { MovedText } from '../../../../../editor/common/diff/linesDiffComputer.js';
import { LineRangeMapping, DetailedLineRangeMapping, RangeMapping } from '../../../../../editor/common/diff/rangeMapping.js';
import { TextEdit } from '../../../../../editor/common/languages.js';
import { disposableTimeout } from '../../../../../base/common/async.js';
import { DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';


export class TestWorkerService extends mock<IEditorWorkerService>() implements IDisposable {

	private readonly _store = new DisposableStore();
	private readonly _worker = this._store.add(new EditorWorker());

	constructor(@IModelService private readonly _modelService: IModelService) {
		super();
	}

	dispose(): void {
		this._store.dispose();
	}
	override async computeMoreMinimalEdits(resource: URI, edits: TextEdit[] | null | undefined, pretty?: boolean | undefined): Promise<TextEdit[] | undefined> {
		return undefined;
	}

	override async computeDiff(original: URI, modified: URI, options: IDocumentDiffProviderOptions, algorithm: DiffAlgorithmName): Promise<IDocumentDiff | null> {
		await new Promise<void>(resolve => disposableTimeout(() => resolve(), 0, this._store));
		if (this._store.isDisposed) {
			return null;
		}

		const originalModel = this._modelService.getModel(original);
		const modifiedModel = this._modelService.getModel(modified);

		assertType(originalModel);
		assertType(modifiedModel);

		this._worker.$acceptNewModel({
			url: originalModel.uri.toString(),
			versionId: originalModel.getVersionId(),
			lines: originalModel.getLinesContent(),
			EOL: originalModel.getEOL(),
		});

		this._worker.$acceptNewModel({
			url: modifiedModel.uri.toString(),
			versionId: modifiedModel.getVersionId(),
			lines: modifiedModel.getLinesContent(),
			EOL: modifiedModel.getEOL(),
		});

		const result = await this._worker.$computeDiff(originalModel.uri.toString(), modifiedModel.uri.toString(), options, algorithm);
		if (!result) {
			return result;
		}
		// Convert from space efficient JSON data to rich objects.
		const diff: IDocumentDiff = {
			identical: result.identical,
			quitEarly: result.quitEarly,
			changes: toLineRangeMappings(result.changes),
			moves: result.moves.map(m => new MovedText(
				new LineRangeMapping(new LineRange(m[0], m[1]), new LineRange(m[2], m[3])),
				toLineRangeMappings(m[4])
			))
		};
		return diff;

		function toLineRangeMappings(changes: readonly ILineChange[]): readonly DetailedLineRangeMapping[] {
			return changes.map(
				(c) => new DetailedLineRangeMapping(
					new LineRange(c[0], c[1]),
					new LineRange(c[2], c[3]),
					c[4]?.map(
						(c) => new RangeMapping(
							new Range(c[0], c[1], c[2], c[3]),
							new Range(c[4], c[5], c[6], c[7])
						)
					)
				)
			);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/test/browser/__snapshots__/InlineChatSession_Apply_Code_s_preview_should_be_easier_to_undo_esc__7537.1.snap]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/test/browser/__snapshots__/InlineChatSession_Apply_Code_s_preview_should_be_easier_to_undo_esc__7537.1.snap

```text
export function fib(n) {
	if (n <= 0) return 0;
	if (n === 1) return 0;
	if (n === 2) return 1;

	let a = 0, b = 1, c;
	for (let i = 3; i <= n; i++) {
		c = a + b;
		a = b;
		b = c;
	}
	return b;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/test/browser/__snapshots__/InlineChatSession_Apply_Code_s_preview_should_be_easier_to_undo_esc__7537.2.snap]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/test/browser/__snapshots__/InlineChatSession_Apply_Code_s_preview_should_be_easier_to_undo_esc__7537.2.snap

```text
export function fib(n) {
	if (n <= 0) return 0;
	if (n === 1) return 0;
	if (n === 2) return 1;
	return fib(n - 1) + fib(n - 2);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineCompletions/browser/inlineCompletionLanguageStatusBarContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineCompletions/browser/inlineCompletionLanguageStatusBarContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createHotClass } from '../../../../base/common/hotReloadHelpers.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { autorunWithStore, debouncedObservable, derived, observableFromEvent } from '../../../../base/common/observable.js';
import Severity from '../../../../base/common/severity.js';
import { isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { InlineCompletionsController } from '../../../../editor/contrib/inlineCompletions/browser/controller/inlineCompletionsController.js';
import { localize } from '../../../../nls.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ILanguageStatusService } from '../../../services/languageStatus/common/languageStatusService.js';

export class InlineCompletionLanguageStatusBarContribution extends Disposable implements IWorkbenchContribution {
	public static readonly hot = createHotClass(this);

	public static Id = 'vs.contrib.inlineCompletionLanguageStatusBarContribution';
	public static readonly languageStatusBarDisposables = new Set<DisposableStore>();

	private _activeEditor;
	private _state;

	constructor(
		@ILanguageStatusService private readonly _languageStatusService: ILanguageStatusService,
		@IEditorService private readonly _editorService: IEditorService,
	) {
		super();


		this._activeEditor = observableFromEvent(this, _editorService.onDidActiveEditorChange, () => this._editorService.activeTextEditorControl);
		this._state = derived(this, reader => {
			const editor = this._activeEditor.read(reader);
			if (!editor || !isCodeEditor(editor)) {
				return undefined;
			}

			const c = InlineCompletionsController.get(editor);
			const model = c?.model.read(reader);
			if (!model) {
				return undefined;
			}

			return {
				model,
				status: debouncedObservable(model.status, 300),
			};
		});

		this._register(autorunWithStore((reader, store) => {
			const state = this._state.read(reader);
			if (!state) {
				return;
			}

			const status = state.status.read(reader);

			const statusMap: Record<typeof status, { shortLabel: string; label: string; loading: boolean }> = {
				loading: { shortLabel: '', label: localize('inlineSuggestionLoading', "Loading..."), loading: true, },
				ghostText: { shortLabel: '$(lightbulb)', label: '$(copilot) ' + localize('inlineCompletionAvailable', "Inline completion available"), loading: false, },
				inlineEdit: { shortLabel: '$(lightbulb-sparkle)', label: '$(copilot) ' + localize('inlineEditAvailable', "Inline edit available"), loading: false, },
				noSuggestion: { shortLabel: '$(circle-slash)', label: '$(copilot) ' + localize('noInlineSuggestionAvailable', "No inline suggestion available"), loading: false, },
			};

			store.add(this._languageStatusService.addStatus({
				accessibilityInfo: undefined,
				busy: statusMap[status].loading,
				command: undefined,
				detail: localize('inlineSuggestionsSmall', "Inline suggestions"),
				id: 'inlineSuggestions',
				label: { value: statusMap[status].label, shortValue: statusMap[status].shortLabel },
				name: localize('inlineSuggestions', "Inline Suggestions"),
				selector: { pattern: state.model.textModel.uri.fsPath },
				severity: Severity.Info,
				source: 'inlineSuggestions',
			}));
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineCompletions/browser/inlineCompletions.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineCompletions/browser/inlineCompletions.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { withoutDuplicates } from '../../../../base/common/arrays.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { autorun, observableFromEvent } from '../../../../base/common/observable.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { inlineCompletionProviderGetMatcher, providerIdSchemaUri } from '../../../../editor/contrib/inlineCompletions/browser/controller/commands.js';
import { Extensions, IJSONContributionRegistry } from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { wrapInHotClass1 } from '../../../../platform/observable/common/wrapInHotClass.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { InlineCompletionLanguageStatusBarContribution } from './inlineCompletionLanguageStatusBarContribution.js';

registerWorkbenchContribution2(InlineCompletionLanguageStatusBarContribution.Id, wrapInHotClass1(InlineCompletionLanguageStatusBarContribution.hot), WorkbenchPhase.Eventually);

export class InlineCompletionSchemaContribution extends Disposable implements IWorkbenchContribution {
	public static Id = 'vs.contrib.InlineCompletionSchemaContribution';

	constructor(
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
	) {
		super();

		const registry = Registry.as<IJSONContributionRegistry>(Extensions.JSONContribution);
		const inlineCompletionsProvider = observableFromEvent(this,
			this._languageFeaturesService.inlineCompletionsProvider.onDidChange,
			() => this._languageFeaturesService.inlineCompletionsProvider.allNoModel()
		);

		this._register(autorun(reader => {
			const provider = inlineCompletionsProvider.read(reader);
			registry.registerSchema(providerIdSchemaUri, {
				enum: withoutDuplicates(provider.flatMap(p => inlineCompletionProviderGetMatcher(p))),
			}, reader.store);
		}));
	}
}

registerWorkbenchContribution2(InlineCompletionSchemaContribution.Id, InlineCompletionSchemaContribution, WorkbenchPhase.Eventually);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/interactive/browser/interactive.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/interactive/browser/interactive.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Iterable } from '../../../../base/common/iterator.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { parse } from '../../../../base/common/marshalling.js';
import { Schemas } from '../../../../base/common/network.js';
import { extname, isEqual } from '../../../../base/common/resources.js';
import { isFalsyOrWhitespace } from '../../../../base/common/strings.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { IBulkEditService } from '../../../../editor/browser/services/bulkEditService.js';
import { EditOperation } from '../../../../editor/common/core/editOperation.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../editor/common/languages/modesRegistry.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextModelContentProvider, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { peekViewBorder } from '../../../../editor/contrib/peekView/browser/peekView.js';
import { Context as SuggestContext } from '../../../../editor/contrib/suggest/browser/suggest.js';
import { localize, localize2 } from '../../../../nls.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { EditorActivation, ITextResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { contrastBorder, ifDefinedThenElse, listInactiveSelectionBackground, registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { EditorExtensions, EditorsOrder, IEditorControl, IEditorFactoryRegistry, IEditorSerializer, IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { PANEL_BORDER } from '../../../common/theme.js';
import { ResourceNotebookCellEdit } from '../../bulkEdit/browser/bulkCellEdits.js';
import { ReplEditorSettings, INTERACTIVE_INPUT_CURSOR_BOUNDARY } from './interactiveCommon.js';
import { IInteractiveDocumentService, InteractiveDocumentService } from './interactiveDocumentService.js';
import { InteractiveEditor } from './interactiveEditor.js';
import { InteractiveEditorInput } from './interactiveEditorInput.js';
import { IInteractiveHistoryService, InteractiveHistoryService } from './interactiveHistoryService.js';
import { NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT } from '../../notebook/browser/controller/coreActions.js';
import { INotebookEditorOptions } from '../../notebook/browser/notebookBrowser.js';
import * as icons from '../../notebook/browser/notebookIcons.js';
import { INotebookEditorService } from '../../notebook/browser/services/notebookEditorService.js';
import { CellEditType, CellKind, CellUri, INTERACTIVE_WINDOW_EDITOR_ID, NotebookSetting, NotebookWorkingCopyTypeIdentifier } from '../../notebook/common/notebookCommon.js';
import { InteractiveWindowOpen, IS_COMPOSITE_NOTEBOOK, NOTEBOOK_EDITOR_FOCUSED } from '../../notebook/common/notebookContextKeys.js';
import { INotebookKernelService } from '../../notebook/common/notebookKernelService.js';
import { INotebookService } from '../../notebook/common/notebookService.js';
import { columnToEditorGroup } from '../../../services/editor/common/editorGroupColumn.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorResolverService, RegisteredEditorPriority } from '../../../services/editor/common/editorResolverService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IWorkingCopyIdentifier } from '../../../services/workingCopy/common/workingCopy.js';
import { IWorkingCopyEditorHandler, IWorkingCopyEditorService } from '../../../services/workingCopy/common/workingCopyEditorService.js';
import { isReplEditorControl, ReplEditorControl } from '../../replNotebook/browser/replEditor.js';
import { InlineChatController } from '../../inlineChat/browser/inlineChatController.js';
import { IsLinuxContext, IsWindowsContext } from '../../../../platform/contextkey/common/contextkeys.js';

const interactiveWindowCategory: ILocalizedString = localize2('interactiveWindow', "Interactive Window");

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		InteractiveEditor,
		INTERACTIVE_WINDOW_EDITOR_ID,
		'Interactive Window'
	),
	[
		new SyncDescriptor(InteractiveEditorInput)
	]
);

export class InteractiveDocumentContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.interactiveDocument';

	constructor(
		@INotebookService notebookService: INotebookService,
		@IEditorResolverService editorResolverService: IEditorResolverService,
		@IEditorService editorService: IEditorService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();

		const info = notebookService.getContributedNotebookType('interactive');

		// We need to contribute a notebook type for the Interactive Window to provide notebook models.
		if (!info) {
			this._register(notebookService.registerContributedNotebookType('interactive', {
				providerDisplayName: 'Interactive Notebook',
				displayName: 'Interactive',
				filenamePattern: ['*.interactive'],
				priority: RegisteredEditorPriority.builtin
			}));
		}

		editorResolverService.registerEditor(
			`${Schemas.vscodeInteractiveInput}:/**`,
			{
				id: 'vscode-interactive-input',
				label: 'Interactive Editor',
				priority: RegisteredEditorPriority.exclusive
			},
			{
				canSupportResource: uri => uri.scheme === Schemas.vscodeInteractiveInput,
				singlePerResource: true
			},
			{
				createEditorInput: ({ resource }) => {
					const editorInput = editorService.findEditors({
						resource,
						editorId: 'interactive',
						typeId: InteractiveEditorInput.ID
					}, { order: EditorsOrder.SEQUENTIAL }).at(0);
					return editorInput!;
				}
			}
		);

		editorResolverService.registerEditor(
			`*.interactive`,
			{
				id: 'interactive',
				label: 'Interactive Editor',
				priority: RegisteredEditorPriority.exclusive
			},
			{
				canSupportResource: uri =>
					(uri.scheme === Schemas.untitled && extname(uri) === '.interactive') ||
					(uri.scheme === Schemas.vscodeNotebookCell && extname(uri) === '.interactive'),
				singlePerResource: true
			},
			{
				createEditorInput: ({ resource, options }) => {
					const data = CellUri.parse(resource);
					let cellOptions: ITextResourceEditorInput | undefined;
					let iwResource = resource;

					if (data) {
						cellOptions = { resource, options };
						iwResource = data.notebook;
					}

					const notebookOptions: INotebookEditorOptions | undefined = {
						...options,
						cellOptions,
						cellRevealType: undefined,
						cellSelections: undefined,
						isReadOnly: undefined,
						viewState: undefined,
						indexedCellOptions: undefined
					};

					const editorInput = createEditor(iwResource, this.instantiationService);
					return {
						editor: editorInput,
						options: notebookOptions
					};
				},
				createUntitledEditorInput: ({ resource, options }) => {
					if (!resource) {
						throw new Error('Interactive window editors must have a resource name');
					}
					const data = CellUri.parse(resource);
					let cellOptions: ITextResourceEditorInput | undefined;

					if (data) {
						cellOptions = { resource, options };
					}

					const notebookOptions: INotebookEditorOptions = {
						...options,
						cellOptions,
						cellRevealType: undefined,
						cellSelections: undefined,
						isReadOnly: undefined,
						viewState: undefined,
						indexedCellOptions: undefined
					};

					const editorInput = createEditor(resource, this.instantiationService);
					return {
						editor: editorInput,
						options: notebookOptions
					};
				}
			}
		);
	}
}

class InteractiveInputContentProvider implements ITextModelContentProvider {

	static readonly ID = 'workbench.contrib.interactiveInputContentProvider';

	private readonly _registration: IDisposable;

	constructor(
		@ITextModelService textModelService: ITextModelService,
		@IModelService private readonly _modelService: IModelService,
	) {
		this._registration = textModelService.registerTextModelContentProvider(Schemas.vscodeInteractiveInput, this);
	}

	dispose(): void {
		this._registration.dispose();
	}

	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);
		if (existing) {
			return existing;
		}
		const result: ITextModel | null = this._modelService.createModel('', null, resource, false);
		return result;
	}
}

function createEditor(resource: URI, instantiationService: IInstantiationService): EditorInput {
	const counter = /\/Interactive-(\d+)/.exec(resource.path);
	const inputBoxPath = counter && counter[1] ? `/InteractiveInput-${counter[1]}` : 'InteractiveInput';
	const inputUri = URI.from({ scheme: Schemas.vscodeInteractiveInput, path: inputBoxPath });
	const editorInput = InteractiveEditorInput.create(instantiationService, resource, inputUri);

	return editorInput;
}

class InteractiveWindowWorkingCopyEditorHandler extends Disposable implements IWorkbenchContribution, IWorkingCopyEditorHandler {

	static readonly ID = 'workbench.contrib.interactiveWindowWorkingCopyEditorHandler';

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IWorkingCopyEditorService private readonly _workingCopyEditorService: IWorkingCopyEditorService,
		@IExtensionService private readonly _extensionService: IExtensionService,
	) {
		super();

		this._installHandler();
	}

	handles(workingCopy: IWorkingCopyIdentifier): boolean {
		const viewType = this._getViewType(workingCopy);
		return !!viewType && viewType === 'interactive';

	}

	isOpen(workingCopy: IWorkingCopyIdentifier, editor: EditorInput): boolean {
		if (!this.handles(workingCopy)) {
			return false;
		}

		return editor instanceof InteractiveEditorInput && isEqual(workingCopy.resource, editor.resource);
	}

	createEditor(workingCopy: IWorkingCopyIdentifier): EditorInput {
		return createEditor(workingCopy.resource, this._instantiationService);
	}

	private async _installHandler(): Promise<void> {
		await this._extensionService.whenInstalledExtensionsRegistered();

		this._register(this._workingCopyEditorService.registerHandler(this));
	}

	private _getViewType(workingCopy: IWorkingCopyIdentifier): string | undefined {
		return NotebookWorkingCopyTypeIdentifier.parse(workingCopy.typeId)?.viewType;
	}
}

registerWorkbenchContribution2(InteractiveDocumentContribution.ID, InteractiveDocumentContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(InteractiveInputContentProvider.ID, InteractiveInputContentProvider, {
	editorTypeId: INTERACTIVE_WINDOW_EDITOR_ID
});
registerWorkbenchContribution2(InteractiveWindowWorkingCopyEditorHandler.ID, InteractiveWindowWorkingCopyEditorHandler, {
	editorTypeId: INTERACTIVE_WINDOW_EDITOR_ID
});

type interactiveEditorInputData = { resource: URI; inputResource: URI; name: string; language: string };

export class InteractiveEditorSerializer implements IEditorSerializer {
	public static readonly ID = InteractiveEditorInput.ID;

	canSerialize(editor: EditorInput): editor is InteractiveEditorInput {
		if (!(editor instanceof InteractiveEditorInput)) {
			return false;
		}

		return URI.isUri(editor.primary.resource) && URI.isUri(editor.inputResource);
	}

	serialize(input: EditorInput): string | undefined {
		if (!this.canSerialize(input)) {
			return undefined;
		}

		return JSON.stringify({
			resource: input.primary.resource,
			inputResource: input.inputResource,
			name: input.getName(),
			language: input.language
		});
	}

	deserialize(instantiationService: IInstantiationService, raw: string) {
		const data = <interactiveEditorInputData>parse(raw);
		if (!data) {
			return undefined;
		}
		const { resource, inputResource, name, language } = data;
		if (!URI.isUri(resource) || !URI.isUri(inputResource)) {
			return undefined;
		}

		const input = InteractiveEditorInput.create(instantiationService, resource, inputResource, name, language);
		return input;
	}
}

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory)
	.registerEditorSerializer(
		InteractiveEditorSerializer.ID,
		InteractiveEditorSerializer);

registerSingleton(IInteractiveHistoryService, InteractiveHistoryService, InstantiationType.Delayed);
registerSingleton(IInteractiveDocumentService, InteractiveDocumentService, InstantiationType.Delayed);

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: '_interactive.open',
			title: localize2('interactive.open', 'Open Interactive Window'),
			f1: false,
			category: interactiveWindowCategory,
			metadata: {
				description: localize('interactive.open', 'Open Interactive Window'),
				args: [
					{
						name: 'showOptions',
						description: 'Show Options',
						schema: {
							type: 'object',
							properties: {
								'viewColumn': {
									type: 'number',
									default: -1
								},
								'preserveFocus': {
									type: 'boolean',
									default: true
								}
							},
						}
					},
					{
						name: 'resource',
						description: 'Interactive resource Uri',
						isOptional: true
					},
					{
						name: 'controllerId',
						description: 'Notebook controller Id',
						isOptional: true
					},
					{
						name: 'title',
						description: 'Notebook editor title',
						isOptional: true
					}
				]
			}

		});
	}

	async run(accessor: ServicesAccessor, showOptions?: number | { viewColumn?: number; preserveFocus?: boolean }, resource?: URI, id?: string, title?: string): Promise<{ notebookUri: URI; inputUri: URI; notebookEditorId?: string }> {
		const editorService = accessor.get(IEditorService);
		const editorGroupService = accessor.get(IEditorGroupsService);
		const historyService = accessor.get(IInteractiveHistoryService);
		const kernelService = accessor.get(INotebookKernelService);
		const logService = accessor.get(ILogService);
		const configurationService = accessor.get(IConfigurationService);
		const group = columnToEditorGroup(editorGroupService, configurationService, typeof showOptions === 'number' ? showOptions : showOptions?.viewColumn);
		const editorOptions = {
			activation: EditorActivation.PRESERVE,
			preserveFocus: typeof showOptions !== 'number' ? (showOptions?.preserveFocus ?? false) : false
		};

		if (resource && extname(resource) === '.interactive') {
			logService.debug('Open interactive window from resource:', resource.toString());
			const resourceUri = URI.revive(resource);
			const editors = editorService.findEditors(resourceUri).filter(id => id.editor instanceof InteractiveEditorInput && id.editor.resource?.toString() === resourceUri.toString());
			if (editors.length) {
				logService.debug('Find existing interactive window:', resource.toString());
				const editorInput = editors[0].editor as InteractiveEditorInput;
				const currentGroup = editors[0].groupId;
				const editor = await editorService.openEditor(editorInput, editorOptions, currentGroup);
				const editorControl = editor?.getControl() as ReplEditorControl;

				return {
					notebookUri: editorInput.resource,
					inputUri: editorInput.inputResource,
					notebookEditorId: editorControl?.notebookEditor?.getId()
				};
			}
		}

		const existingNotebookDocument = new Set<string>();
		editorService.getEditors(EditorsOrder.SEQUENTIAL).forEach(editor => {
			if (editor.editor.resource) {
				existingNotebookDocument.add(editor.editor.resource.toString());
			}
		});

		let notebookUri: URI | undefined = undefined;
		let inputUri: URI | undefined = undefined;
		let counter = 1;
		do {
			notebookUri = URI.from({ scheme: Schemas.untitled, path: `/Interactive-${counter}.interactive` });
			inputUri = URI.from({ scheme: Schemas.vscodeInteractiveInput, path: `/InteractiveInput-${counter}` });

			counter++;
		} while (existingNotebookDocument.has(notebookUri.toString()));
		InteractiveEditorInput.setName(notebookUri, title);

		logService.debug('Open new interactive window:', notebookUri.toString(), inputUri.toString());

		if (id) {
			const allKernels = kernelService.getMatchingKernel({ uri: notebookUri, notebookType: 'interactive' }).all;
			const preferredKernel = allKernels.find(kernel => kernel.id === id);
			if (preferredKernel) {
				kernelService.preselectKernelForNotebook(preferredKernel, { uri: notebookUri, notebookType: 'interactive' });
			}
		}

		historyService.clearHistory(notebookUri);
		const editorInput: IUntypedEditorInput = { resource: notebookUri, options: editorOptions };
		const editorPane = await editorService.openEditor(editorInput, group);
		const editorControl = editorPane?.getControl() as ReplEditorControl;
		// Extensions must retain references to these URIs to manipulate the interactive editor
		logService.debug('New interactive window opened. Notebook editor id', editorControl?.notebookEditor?.getId());
		return { notebookUri, inputUri, notebookEditorId: editorControl?.notebookEditor?.getId() };
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'interactive.execute',
			title: localize2('interactive.execute', 'Execute Code'),
			category: interactiveWindowCategory,
			keybinding: [{
				// when: NOTEBOOK_CELL_LIST_FOCUSED,
				when: ContextKeyExpr.and(
					IS_COMPOSITE_NOTEBOOK,
					ContextKeyExpr.equals('activeEditor', 'workbench.editor.interactive')
				),
				primary: KeyMod.CtrlCmd | KeyCode.Enter,
				weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT
			}, {
				when: ContextKeyExpr.and(
					IS_COMPOSITE_NOTEBOOK,
					ContextKeyExpr.equals('activeEditor', 'workbench.editor.interactive'),
					ContextKeyExpr.equals('config.interactiveWindow.executeWithShiftEnter', true)
				),
				primary: KeyMod.Shift | KeyCode.Enter,
				weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT
			}, {
				when: ContextKeyExpr.and(
					IS_COMPOSITE_NOTEBOOK,
					ContextKeyExpr.equals('activeEditor', 'workbench.editor.interactive'),
					ContextKeyExpr.equals('config.interactiveWindow.executeWithShiftEnter', false)
				),
				primary: KeyCode.Enter,
				weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT
			}],
			menu: [
				{
					id: MenuId.InteractiveInputExecute
				},
			],
			icon: icons.executeIcon,
			f1: false,
			metadata: {
				description: 'Execute the Contents of the Input Box',
				args: [
					{
						name: 'resource',
						description: 'Interactive resource Uri',
						isOptional: true
					}
				]
			}
		});
	}

	async run(accessor: ServicesAccessor, context?: UriComponents): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const bulkEditService = accessor.get(IBulkEditService);
		const historyService = accessor.get(IInteractiveHistoryService);
		const notebookEditorService = accessor.get(INotebookEditorService);
		let editorControl: IEditorControl | undefined;
		if (context) {
			const resourceUri = URI.revive(context);
			const editors = editorService.findEditors(resourceUri);
			for (const found of editors) {
				if (found.editor.typeId === InteractiveEditorInput.ID) {
					const editor = await editorService.openEditor(found.editor, found.groupId);
					editorControl = editor?.getControl();
					break;
				}
			}
		}
		else {
			editorControl = editorService.activeEditorPane?.getControl();
		}

		if (editorControl && isReplEditorControl(editorControl) && editorControl.notebookEditor) {
			const notebookDocument = editorControl.notebookEditor.textModel;
			const textModel = editorControl.activeCodeEditor?.getModel();
			const activeKernel = editorControl.notebookEditor.activeKernel;
			const language = activeKernel?.supportedLanguages[0] ?? PLAINTEXT_LANGUAGE_ID;

			if (notebookDocument && textModel && editorControl.activeCodeEditor) {
				const index = notebookDocument.length;
				const value = textModel.getValue();

				if (isFalsyOrWhitespace(value)) {
					return;
				}

				const ctrl = InlineChatController.get(editorControl.activeCodeEditor);
				if (ctrl) {
					ctrl.acceptSession();
				}

				historyService.replaceLast(notebookDocument.uri, value);
				historyService.addToHistory(notebookDocument.uri, '');
				textModel.setValue('');

				const collapseState = editorControl.notebookEditor.notebookOptions.getDisplayOptions().interactiveWindowCollapseCodeCells === 'fromEditor' ?
					{
						inputCollapsed: false,
						outputCollapsed: false
					} :
					undefined;

				await bulkEditService.apply([
					new ResourceNotebookCellEdit(notebookDocument.uri,
						{
							editType: CellEditType.Replace,
							index: index,
							count: 0,
							cells: [{
								cellKind: CellKind.Code,
								mime: undefined,
								language,
								source: value,
								outputs: [],
								metadata: {},
								collapseState
							}]
						}
					)
				]);

				// reveal the cell into view first
				const range = { start: index, end: index + 1 };
				editorControl.notebookEditor.revealCellRangeInView(range);
				await editorControl.notebookEditor.executeNotebookCells(editorControl.notebookEditor.getCellsInRange({ start: index, end: index + 1 }));

				// update the selection and focus in the extension host model
				const editor = notebookEditorService.getNotebookEditor(editorControl.notebookEditor.getId());
				if (editor) {
					editor.setSelections([range]);
					editor.setFocus(range);
				}
			}
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'interactive.input.clear',
			title: localize2('interactive.input.clear', 'Clear the interactive window input editor contents'),
			category: interactiveWindowCategory,
			f1: false
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editorControl = editorService.activeEditorPane?.getControl();

		if (editorControl && isReplEditorControl(editorControl) && editorControl.notebookEditor) {
			const notebookDocument = editorControl.notebookEditor.textModel;
			const editor = editorControl.activeCodeEditor;
			const range = editor?.getModel()?.getFullModelRange();


			if (notebookDocument && editor && range) {
				editor.executeEdits('', [EditOperation.replace(range, null)]);
			}
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'interactive.history.previous',
			title: localize2('interactive.history.previous', 'Previous value in history'),
			category: interactiveWindowCategory,
			f1: false,
			keybinding: {
				when: ContextKeyExpr.and(
					INTERACTIVE_INPUT_CURSOR_BOUNDARY.notEqualsTo('bottom'),
					INTERACTIVE_INPUT_CURSOR_BOUNDARY.notEqualsTo('none'),
					SuggestContext.Visible.toNegated()
				),
				primary: KeyCode.UpArrow,
				weight: KeybindingWeight.WorkbenchContrib
			},
			precondition: ContextKeyExpr.and(IS_COMPOSITE_NOTEBOOK, NOTEBOOK_EDITOR_FOCUSED.negate())
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const historyService = accessor.get(IInteractiveHistoryService);
		const editorControl = editorService.activeEditorPane?.getControl();



		if (editorControl && isReplEditorControl(editorControl) && editorControl.notebookEditor) {
			const notebookDocument = editorControl.notebookEditor.textModel;
			const textModel = editorControl.activeCodeEditor?.getModel();

			if (notebookDocument && textModel) {
				const previousValue = historyService.getPreviousValue(notebookDocument.uri);
				if (previousValue) {
					textModel.setValue(previousValue);
				}
			}
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'interactive.history.next',
			title: localize2('interactive.history.next', 'Next value in history'),
			category: interactiveWindowCategory,
			f1: false,
			keybinding: {
				when: ContextKeyExpr.and(
					INTERACTIVE_INPUT_CURSOR_BOUNDARY.notEqualsTo('top'),
					INTERACTIVE_INPUT_CURSOR_BOUNDARY.notEqualsTo('none'),
					SuggestContext.Visible.toNegated()
				),
				primary: KeyCode.DownArrow,
				weight: KeybindingWeight.WorkbenchContrib
			},
			precondition: ContextKeyExpr.and(IS_COMPOSITE_NOTEBOOK, NOTEBOOK_EDITOR_FOCUSED.negate())
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const historyService = accessor.get(IInteractiveHistoryService);
		const editorControl = editorService.activeEditorPane?.getControl();

		if (editorControl && isReplEditorControl(editorControl) && editorControl.notebookEditor) {
			const notebookDocument = editorControl.notebookEditor.textModel;
			const textModel = editorControl.activeCodeEditor?.getModel();

			if (notebookDocument && textModel) {
				const nextValue = historyService.getNextValue(notebookDocument.uri);
				if (nextValue !== null) {
					textModel.setValue(nextValue);
				}
			}
		}
	}
});


registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'interactive.scrollToTop',
			title: localize('interactiveScrollToTop', 'Scroll to Top'),
			keybinding: {
				when: ContextKeyExpr.equals('activeEditor', 'workbench.editor.interactive'),
				primary: KeyMod.CtrlCmd | KeyCode.Home,
				mac: { primary: KeyMod.CtrlCmd | KeyCode.UpArrow },
				weight: KeybindingWeight.WorkbenchContrib
			},
			category: interactiveWindowCategory,
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editorControl = editorService.activeEditorPane?.getControl();

		if (editorControl && isReplEditorControl(editorControl) && editorControl.notebookEditor) {
			if (editorControl.notebookEditor.getLength() === 0) {
				return;
			}

			editorControl.notebookEditor.revealCellRangeInView({ start: 0, end: 1 });
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'interactive.scrollToBottom',
			title: localize('interactiveScrollToBottom', 'Scroll to Bottom'),
			keybinding: {
				when: ContextKeyExpr.equals('activeEditor', 'workbench.editor.interactive'),
				primary: KeyMod.CtrlCmd | KeyCode.End,
				mac: { primary: KeyMod.CtrlCmd | KeyCode.DownArrow },
				weight: KeybindingWeight.WorkbenchContrib
			},
			category: interactiveWindowCategory,
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editorControl = editorService.activeEditorPane?.getControl();

		if (editorControl && isReplEditorControl(editorControl) && editorControl.notebookEditor) {
			if (editorControl.notebookEditor.getLength() === 0) {
				return;
			}

			const len = editorControl.notebookEditor.getLength();
			editorControl.notebookEditor.revealCellRangeInView({ start: len - 1, end: len });
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'interactive.input.focus',
			title: localize2('interactive.input.focus', 'Focus Input Editor'),
			category: interactiveWindowCategory,
			menu: {
				id: MenuId.CommandPalette,
				when: InteractiveWindowOpen
			},
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editorControl = editorService.activeEditorPane?.getControl();

		if (editorControl && isReplEditorControl(editorControl) && editorControl.notebookEditor) {
			editorService.activeEditorPane?.focus();
		}
		else {
			// find and open the most recent interactive window
			const openEditors = editorService.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE);
			const interactiveWindow = Iterable.find(openEditors, identifier => { return identifier.editor.typeId === InteractiveEditorInput.ID; });
			if (interactiveWindow) {
				const editorInput = interactiveWindow.editor as InteractiveEditorInput;
				const currentGroup = interactiveWindow.groupId;
				const editor = await editorService.openEditor(editorInput, currentGroup);
				const editorControl = editor?.getControl();

				if (editorControl && isReplEditorControl(editorControl) && editorControl.notebookEditor) {
					editorService.activeEditorPane?.focus();
				}
			}
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'interactive.history.focus',
			title: localize2('interactive.history.focus', 'Focus History'),
			category: interactiveWindowCategory,
			menu: {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.equals('activeEditor', 'workbench.editor.interactive'),
			},
			keybinding: [{
				// On mac, require that the cursor is at the top of the input, to avoid stealing cmd+up to move the cursor to the top
				when: ContextKeyExpr.and(
					INTERACTIVE_INPUT_CURSOR_BOUNDARY.notEqualsTo('bottom'),
					INTERACTIVE_INPUT_CURSOR_BOUNDARY.notEqualsTo('none')),
				weight: KeybindingWeight.WorkbenchContrib + 5,
				primary: KeyMod.CtrlCmd | KeyCode.UpArrow
			},
			{
				when: ContextKeyExpr.or(IsWindowsContext, IsLinuxContext),
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.UpArrow,
			}],
			precondition: ContextKeyExpr.and(IS_COMPOSITE_NOTEBOOK, NOTEBOOK_EDITOR_FOCUSED.negate())
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editorControl = editorService.activeEditorPane?.getControl();

		if (editorControl && isReplEditorControl(editorControl) && editorControl.notebookEditor) {
			editorControl.notebookEditor.focus();
		}
	}
});

registerColor('interactive.activeCodeBorder', {
	dark: ifDefinedThenElse(peekViewBorder, peekViewBorder, '#007acc'),
	light: ifDefinedThenElse(peekViewBorder, peekViewBorder, '#007acc'),
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('interactive.activeCodeBorder', 'The border color for the current interactive code cell when the editor has focus.'));

registerColor('interactive.inactiveCodeBorder', {
	//dark: theme.getColor(listInactiveSelectionBackground) ?? transparent(listInactiveSelectionBackground, 1),
	dark: ifDefinedThenElse(listInactiveSelectionBackground, listInactiveSelectionBackground, '#37373D'),
	light: ifDefinedThenElse(listInactiveSelectionBackground, listInactiveSelectionBackground, '#E4E6F1'),
	hcDark: PANEL_BORDER,
	hcLight: PANEL_BORDER
}, localize('interactive.inactiveCodeBorder', 'The border color for the current interactive code cell when the editor does not have focus.'));

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	id: 'interactiveWindow',
	order: 100,
	type: 'object',
	'properties': {
		[ReplEditorSettings.interactiveWindowAlwaysScrollOnNewCell]: {
			type: 'boolean',
			default: true,
			markdownDescription: localize('interactiveWindow.alwaysScrollOnNewCell', "Automatically scroll the interactive window to show the output of the last statement executed. If this value is false, the window will only scroll if the last cell was already the one scrolled to.")
		},
		[NotebookSetting.InteractiveWindowPromptToSave]: {
			type: 'boolean',
			default: false,
			markdownDescription: localize('interactiveWindow.promptToSaveOnClose', "Prompt to save the interactive window when it is closed. Only new interactive windows will be affected by this setting change.")
		},
		[ReplEditorSettings.executeWithShiftEnter]: {
			type: 'boolean',
			default: false,
			markdownDescription: localize('interactiveWindow.executeWithShiftEnter', "Execute the Interactive Window (REPL) input box with shift+enter, so that enter can be used to create a newline."),
			tags: ['replExecute']
		},
		[ReplEditorSettings.showExecutionHint]: {
			type: 'boolean',
			default: true,
			markdownDescription: localize('interactiveWindow.showExecutionHint', "Display a hint in the Interactive Window (REPL) input box to indicate how to execute code."),
			tags: ['replExecute']
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/interactive/browser/interactiveCommon.ts]---
Location: vscode-main/src/vs/workbench/contrib/interactive/browser/interactiveCommon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';

export const INTERACTIVE_INPUT_CURSOR_BOUNDARY = new RawContextKey<'none' | 'top' | 'bottom' | 'both'>('interactiveInputCursorAtBoundary', 'none');

export const ReplEditorSettings = {
	interactiveWindowAlwaysScrollOnNewCell: 'interactiveWindow.alwaysScrollOnNewCell',
	executeWithShiftEnter: 'interactiveWindow.executeWithShiftEnter',
	showExecutionHint: 'interactiveWindow.showExecutionHint',
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/interactive/browser/interactiveDocumentService.ts]---
Location: vscode-main/src/vs/workbench/contrib/interactive/browser/interactiveDocumentService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const IInteractiveDocumentService = createDecorator<IInteractiveDocumentService>('IInteractiveDocumentService');

export interface IInteractiveDocumentService {
	readonly _serviceBrand: undefined;
	readonly onWillAddInteractiveDocument: Event<{ notebookUri: URI; inputUri: URI; languageId: string }>;
	readonly onWillRemoveInteractiveDocument: Event<{ notebookUri: URI; inputUri: URI }>;
	willCreateInteractiveDocument(notebookUri: URI, inputUri: URI, languageId: string): void;
	willRemoveInteractiveDocument(notebookUri: URI, inputUri: URI): void;
}

export class InteractiveDocumentService extends Disposable implements IInteractiveDocumentService {
	declare readonly _serviceBrand: undefined;
	private readonly _onWillAddInteractiveDocument = this._register(new Emitter<{ notebookUri: URI; inputUri: URI; languageId: string }>());
	onWillAddInteractiveDocument = this._onWillAddInteractiveDocument.event;
	private readonly _onWillRemoveInteractiveDocument = this._register(new Emitter<{ notebookUri: URI; inputUri: URI }>());
	onWillRemoveInteractiveDocument = this._onWillRemoveInteractiveDocument.event;

	constructor() {
		super();
	}

	willCreateInteractiveDocument(notebookUri: URI, inputUri: URI, languageId: string) {
		this._onWillAddInteractiveDocument.fire({
			notebookUri,
			inputUri,
			languageId
		});
	}

	willRemoveInteractiveDocument(notebookUri: URI, inputUri: URI) {
		this._onWillRemoveInteractiveDocument.fire({
			notebookUri,
			inputUri
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/interactive/browser/interactiveEditor.css]---
Location: vscode-main/src/vs/workbench/contrib/interactive/browser/interactiveEditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.interactive-editor .input-cell-container:focus-within .input-editor-container>.monaco-editor {
	outline: solid 1px var(--vscode-notebook-focusedCellBorder);
}

.interactive-editor .input-cell-container .input-editor-container>.monaco-editor {
	outline: solid 1px var(--vscode-notebook-inactiveFocusedCellBorder);
}

.interactive-editor .input-cell-container .input-focus-indicator {
	top: 8px;
}

.interactive-editor .input-cell-container .monaco-editor-background,
.interactive-editor .input-cell-container .margin-view-overlays {
	background-color: var(--vscode-notebook-cellEditorBackground, var(--vscode-editor-background));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/interactive/browser/interactiveEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/interactive/browser/interactiveEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/interactive.css';
import * as DOM from '../../../../base/browser/dom.js';
import * as domStylesheets from '../../../../base/browser/domStylesheets.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { CodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { ICodeEditorViewState, ICompositeCodeEditor } from '../../../../editor/common/editorCommon.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { EditorPaneSelectionChangeReason, IEditorMemento, IEditorOpenContext, IEditorPaneScrollPosition, IEditorPaneSelectionChangeEvent, IEditorPaneWithScrolling } from '../../../common/editor.js';
import { getSimpleEditorOptions } from '../../codeEditor/browser/simpleEditorOptions.js';
import { InteractiveEditorInput } from './interactiveEditorInput.js';
import { ICellViewModel, INotebookEditorOptions, INotebookEditorViewState } from '../../notebook/browser/notebookBrowser.js';
import { NotebookEditorExtensionsRegistry } from '../../notebook/browser/notebookEditorExtensions.js';
import { IBorrowValue, INotebookEditorService } from '../../notebook/browser/services/notebookEditorService.js';
import { NotebookEditorWidget } from '../../notebook/browser/notebookEditorWidget.js';
import { GroupsOrder, IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { ExecutionStateCellStatusBarContrib, TimerCellStatusBarContrib } from '../../notebook/browser/contrib/cellStatusBar/executionStatusBarItemController.js';
import { INotebookKernelService } from '../../notebook/common/notebookKernelService.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../editor/common/languages/modesRegistry.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ReplEditorSettings, INTERACTIVE_INPUT_CURSOR_BOUNDARY } from './interactiveCommon.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { NotebookOptions } from '../../notebook/browser/notebookOptions.js';
import { ToolBar } from '../../../../base/browser/ui/toolbar/toolbar.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { createActionViewItem, getActionBarActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { EditorExtensionsRegistry } from '../../../../editor/browser/editorExtensions.js';
import { ParameterHintsController } from '../../../../editor/contrib/parameterHints/browser/parameterHints.js';
import { MenuPreventer } from '../../codeEditor/browser/menuPreventer.js';
import { SelectionClipboardContributionID } from '../../codeEditor/browser/selectionClipboard.js';
import { ContextMenuController } from '../../../../editor/contrib/contextmenu/browser/contextmenu.js';
import { SuggestController } from '../../../../editor/contrib/suggest/browser/suggestController.js';
import { SnippetController2 } from '../../../../editor/contrib/snippet/browser/snippetController2.js';
import { TabCompletionController } from '../../snippets/browser/tabCompletion.js';
import { MarkerController } from '../../../../editor/contrib/gotoError/browser/gotoError.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { ITextEditorOptions, TextEditorSelectionSource } from '../../../../platform/editor/common/editor.js';
import { INotebookExecutionStateService, NotebookExecutionType } from '../../notebook/common/notebookExecutionStateService.js';
import { NOTEBOOK_KERNEL } from '../../notebook/common/notebookContextKeys.js';
import { ICursorPositionChangedEvent } from '../../../../editor/common/cursorEvents.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { isEqual } from '../../../../base/common/resources.js';
import { NotebookFindContrib } from '../../notebook/browser/contrib/find/notebookFindWidget.js';
import { INTERACTIVE_WINDOW_EDITOR_ID } from '../../notebook/common/notebookCommon.js';
import './interactiveEditor.css';
import { IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { deepClone } from '../../../../base/common/objects.js';
import { ContentHoverController } from '../../../../editor/contrib/hover/browser/contentHoverController.js';
import { GlyphHoverController } from '../../../../editor/contrib/hover/browser/glyphHoverController.js';
import { ReplInputHintContentWidget } from './replInputHintContentWidget.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { INLINE_CHAT_ID } from '../../inlineChat/common/inlineChat.js';
import { ReplEditorControl } from '../../replNotebook/browser/replEditor.js';

const DECORATION_KEY = 'interactiveInputDecoration';
const INTERACTIVE_EDITOR_VIEW_STATE_PREFERENCE_KEY = 'InteractiveEditorViewState';

const INPUT_CELL_VERTICAL_PADDING = 8;
const INPUT_CELL_HORIZONTAL_PADDING_RIGHT = 10;
const INPUT_EDITOR_PADDING = 8;


export interface InteractiveEditorViewState {
	readonly notebook?: INotebookEditorViewState;
	readonly input?: ICodeEditorViewState | null;
}

export interface InteractiveEditorOptions extends ITextEditorOptions {
	readonly viewState?: InteractiveEditorViewState;
}

export class InteractiveEditor extends EditorPane implements IEditorPaneWithScrolling {
	private _rootElement!: HTMLElement;
	private _styleElement!: HTMLStyleElement;
	private _notebookEditorContainer!: HTMLElement;
	private _notebookWidget: IBorrowValue<NotebookEditorWidget> = { value: undefined };
	private _inputCellContainer!: HTMLElement;
	private _inputFocusIndicator!: HTMLElement;
	private _inputRunButtonContainer!: HTMLElement;
	private _inputEditorContainer!: HTMLElement;
	private _codeEditorWidget!: CodeEditorWidget;
	private _notebookWidgetService: INotebookEditorService;
	private _instantiationService: IInstantiationService;
	private _languageService: ILanguageService;
	private _contextKeyService: IContextKeyService;
	private _configurationService: IConfigurationService;
	private _notebookKernelService: INotebookKernelService;
	private _keybindingService: IKeybindingService;
	private _menuService: IMenuService;
	private _contextMenuService: IContextMenuService;
	private _editorGroupService: IEditorGroupsService;
	private _notebookExecutionStateService: INotebookExecutionStateService;
	private _extensionService: IExtensionService;
	private readonly _widgetDisposableStore: DisposableStore = this._register(new DisposableStore());
	private _lastLayoutDimensions?: { readonly dimension: DOM.Dimension; readonly position: DOM.IDomPosition };
	private _editorOptions: IEditorOptions;
	private _notebookOptions: NotebookOptions;
	private _editorMemento: IEditorMemento<InteractiveEditorViewState>;
	private readonly _groupListener = this._register(new MutableDisposable());
	private _runbuttonToolbar: ToolBar | undefined;
	private _hintElement: ReplInputHintContentWidget | undefined;

	private _onDidFocusWidget = this._register(new Emitter<void>());
	override get onDidFocus(): Event<void> { return this._onDidFocusWidget.event; }
	private _onDidChangeSelection = this._register(new Emitter<IEditorPaneSelectionChangeEvent>());
	readonly onDidChangeSelection = this._onDidChangeSelection.event;
	private _onDidChangeScroll = this._register(new Emitter<void>());
	readonly onDidChangeScroll = this._onDidChangeScroll.event;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IInstantiationService instantiationService: IInstantiationService,
		@INotebookEditorService notebookWidgetService: INotebookEditorService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@INotebookKernelService notebookKernelService: INotebookKernelService,
		@ILanguageService languageService: ILanguageService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IConfigurationService configurationService: IConfigurationService,
		@IMenuService menuService: IMenuService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@INotebookExecutionStateService notebookExecutionStateService: INotebookExecutionStateService,
		@IExtensionService extensionService: IExtensionService,
	) {
		super(
			INTERACTIVE_WINDOW_EDITOR_ID,
			group,
			telemetryService,
			themeService,
			storageService
		);
		this._notebookWidgetService = notebookWidgetService;
		this._configurationService = configurationService;
		this._notebookKernelService = notebookKernelService;
		this._languageService = languageService;
		this._keybindingService = keybindingService;
		this._menuService = menuService;
		this._contextMenuService = contextMenuService;
		this._editorGroupService = editorGroupService;
		this._notebookExecutionStateService = notebookExecutionStateService;
		this._extensionService = extensionService;

		this._rootElement = DOM.$('.interactive-editor');
		this._contextKeyService = this._register(contextKeyService.createScoped(this._rootElement));
		this._contextKeyService.createKey('isCompositeNotebook', true);
		this._instantiationService = this._register(instantiationService.createChild(new ServiceCollection([IContextKeyService, this._contextKeyService])));

		this._editorOptions = this._computeEditorOptions();
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('editor') || e.affectsConfiguration('notebook')) {
				this._editorOptions = this._computeEditorOptions();
			}
		}));
		this._notebookOptions = instantiationService.createInstance(NotebookOptions, this.window, true, { cellToolbarInteraction: 'hover', globalToolbar: true, stickyScrollEnabled: false, dragAndDropEnabled: false, disableRulers: true });
		this._editorMemento = this.getEditorMemento<InteractiveEditorViewState>(editorGroupService, textResourceConfigurationService, INTERACTIVE_EDITOR_VIEW_STATE_PREFERENCE_KEY);

		this._register(codeEditorService.registerDecorationType('interactive-decoration', DECORATION_KEY, {}));
		this._register(this._keybindingService.onDidUpdateKeybindings(this._updateInputHint, this));
		this._register(this._notebookExecutionStateService.onDidChangeExecution((e) => {
			if (e.type === NotebookExecutionType.cell && isEqual(e.notebook, this._notebookWidget.value?.viewModel?.notebookDocument.uri)) {
				const cell = this._notebookWidget.value?.getCellByHandle(e.cellHandle);
				if (cell && e.changed?.state) {
					this._scrollIfNecessary(cell);
				}
			}
		}));
	}

	private get inputCellContainerHeight() {
		return 19 + 2 + INPUT_CELL_VERTICAL_PADDING * 2 + INPUT_EDITOR_PADDING * 2;
	}

	private get inputCellEditorHeight() {
		return 19 + INPUT_EDITOR_PADDING * 2;
	}

	protected createEditor(parent: HTMLElement): void {
		DOM.append(parent, this._rootElement);
		this._rootElement.style.position = 'relative';
		this._notebookEditorContainer = DOM.append(this._rootElement, DOM.$('.notebook-editor-container'));
		this._inputCellContainer = DOM.append(this._rootElement, DOM.$('.input-cell-container'));
		this._inputCellContainer.style.position = 'absolute';
		this._inputCellContainer.style.height = `${this.inputCellContainerHeight}px`;
		this._inputFocusIndicator = DOM.append(this._inputCellContainer, DOM.$('.input-focus-indicator'));
		this._inputRunButtonContainer = DOM.append(this._inputCellContainer, DOM.$('.run-button-container'));
		this._setupRunButtonToolbar(this._inputRunButtonContainer);
		this._inputEditorContainer = DOM.append(this._inputCellContainer, DOM.$('.input-editor-container'));
		this._createLayoutStyles();
	}

	private _setupRunButtonToolbar(runButtonContainer: HTMLElement) {
		const menu = this._register(this._menuService.createMenu(MenuId.InteractiveInputExecute, this._contextKeyService));
		this._runbuttonToolbar = this._register(new ToolBar(runButtonContainer, this._contextMenuService, {
			getKeyBinding: action => this._keybindingService.lookupKeybinding(action.id),
			actionViewItemProvider: (action, options) => {
				return createActionViewItem(this._instantiationService, action, options);
			},
			renderDropdownAsChildElement: true
		}));

		const { primary, secondary } = getActionBarActions(menu.getActions({ shouldForwardArgs: true }));
		this._runbuttonToolbar.setActions([...primary, ...secondary]);
	}

	private _createLayoutStyles(): void {
		this._styleElement = domStylesheets.createStyleSheet(this._rootElement);
		const styleSheets: string[] = [];

		const {
			codeCellLeftMargin,
			cellRunGutter
		} = this._notebookOptions.getLayoutConfiguration();
		const {
			focusIndicator
		} = this._notebookOptions.getDisplayOptions();
		const leftMargin = this._notebookOptions.getCellEditorContainerLeftMargin();

		styleSheets.push(`
			.interactive-editor .input-cell-container {
				padding: ${INPUT_CELL_VERTICAL_PADDING}px ${INPUT_CELL_HORIZONTAL_PADDING_RIGHT}px ${INPUT_CELL_VERTICAL_PADDING}px ${leftMargin}px;
			}
		`);
		if (focusIndicator === 'gutter') {
			styleSheets.push(`
				.interactive-editor .input-cell-container:focus-within .input-focus-indicator::before {
					border-color: var(--vscode-notebook-focusedCellBorder) !important;
				}
				.interactive-editor .input-focus-indicator::before {
					border-color: var(--vscode-notebook-inactiveFocusedCellBorder) !important;
				}
				.interactive-editor .input-cell-container .input-focus-indicator {
					display: block;
					top: ${INPUT_CELL_VERTICAL_PADDING}px;
				}
				.interactive-editor .input-cell-container {
					border-top: 1px solid var(--vscode-notebook-inactiveFocusedCellBorder);
				}
			`);
		} else {
			// border
			styleSheets.push(`
				.interactive-editor .input-cell-container {
					border-top: 1px solid var(--vscode-notebook-inactiveFocusedCellBorder);
				}
				.interactive-editor .input-cell-container .input-focus-indicator {
					display: none;
				}
			`);
		}

		styleSheets.push(`
			.interactive-editor .input-cell-container .run-button-container {
				width: ${cellRunGutter}px;
				left: ${codeCellLeftMargin}px;
				margin-top: ${INPUT_EDITOR_PADDING - 2}px;
			}
		`);

		this._styleElement.textContent = styleSheets.join('\n');
	}

	private _computeEditorOptions(): IEditorOptions {
		let overrideIdentifier: string | undefined = undefined;
		if (this._codeEditorWidget) {
			overrideIdentifier = this._codeEditorWidget.getModel()?.getLanguageId();
		}
		const editorOptions = deepClone(this._configurationService.getValue<IEditorOptions>('editor', { overrideIdentifier }));
		const editorOptionsOverride = getSimpleEditorOptions(this._configurationService);
		const computed = Object.freeze({
			...editorOptions,
			...editorOptionsOverride,
			...{
				glyphMargin: true,
				padding: {
					top: INPUT_EDITOR_PADDING,
					bottom: INPUT_EDITOR_PADDING
				},
				hover: {
					enabled: 'on' as const
				},
				rulers: []
			}
		});

		return computed;
	}

	protected override saveState(): void {
		this._saveEditorViewState(this.input);
		super.saveState();
	}

	override getViewState(): InteractiveEditorViewState | undefined {
		const input = this.input;
		if (!(input instanceof InteractiveEditorInput)) {
			return undefined;
		}

		this._saveEditorViewState(input);
		return this._loadNotebookEditorViewState(input);
	}

	private _saveEditorViewState(input: EditorInput | undefined): void {
		if (this._notebookWidget.value && input instanceof InteractiveEditorInput) {
			if (this._notebookWidget.value.isDisposed) {
				return;
			}

			const state = this._notebookWidget.value.getEditorViewState();
			const editorState = this._codeEditorWidget.saveViewState();
			this._editorMemento.saveEditorState(this.group, input.notebookEditorInput.resource, {
				notebook: state,
				input: editorState
			});
		}
	}

	private _loadNotebookEditorViewState(input: InteractiveEditorInput): InteractiveEditorViewState | undefined {
		const result = this._editorMemento.loadEditorState(this.group, input.notebookEditorInput.resource);
		if (result) {
			return result;
		}
		// when we don't have a view state for the group/input-tuple then we try to use an existing
		// editor for the same resource.
		for (const group of this._editorGroupService.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE)) {
			if (group.activeEditorPane !== this && group.activeEditorPane === this && group.activeEditor?.matches(input)) {
				const notebook = this._notebookWidget.value?.getEditorViewState();
				const input = this._codeEditorWidget.saveViewState();
				return {
					notebook,
					input
				};
			}
		}
		return;
	}

	override async setInput(input: InteractiveEditorInput, options: InteractiveEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		const notebookInput = input.notebookEditorInput;

		// there currently is a widget which we still own so
		// we need to hide it before getting a new widget
		this._notebookWidget.value?.onWillHide();

		this._codeEditorWidget?.dispose();

		this._widgetDisposableStore.clear();

		this._notebookWidget = <IBorrowValue<NotebookEditorWidget>>this._instantiationService.invokeFunction(this._notebookWidgetService.retrieveWidget, this.group.id, notebookInput, {
			isReplHistory: true,
			isReadOnly: true,
			contributions: NotebookEditorExtensionsRegistry.getSomeEditorContributions([
				ExecutionStateCellStatusBarContrib.id,
				TimerCellStatusBarContrib.id,
				NotebookFindContrib.id
			]),
			menuIds: {
				notebookToolbar: MenuId.InteractiveToolbar,
				cellTitleToolbar: MenuId.InteractiveCellTitle,
				cellDeleteToolbar: MenuId.InteractiveCellDelete,
				cellInsertToolbar: MenuId.NotebookCellBetween,
				cellTopInsertToolbar: MenuId.NotebookCellListTop,
				cellExecuteToolbar: MenuId.InteractiveCellExecute,
				cellExecutePrimary: undefined
			},
			cellEditorContributions: EditorExtensionsRegistry.getSomeEditorContributions([
				SelectionClipboardContributionID,
				ContextMenuController.ID,
				ContentHoverController.ID,
				GlyphHoverController.ID,
				MarkerController.ID
			]),
			options: this._notebookOptions,
			codeWindow: this.window
		}, undefined, this.window);

		this._codeEditorWidget = this._instantiationService.createInstance(CodeEditorWidget, this._inputEditorContainer, this._editorOptions, {
			...{
				isSimpleWidget: false,
				contributions: EditorExtensionsRegistry.getSomeEditorContributions([
					MenuPreventer.ID,
					SelectionClipboardContributionID,
					ContextMenuController.ID,
					SuggestController.ID,
					ParameterHintsController.ID,
					SnippetController2.ID,
					TabCompletionController.ID,
					ContentHoverController.ID,
					GlyphHoverController.ID,
					MarkerController.ID,
					INLINE_CHAT_ID,
				])
			}
		});

		if (this._lastLayoutDimensions) {
			this._notebookEditorContainer.style.height = `${this._lastLayoutDimensions.dimension.height - this.inputCellContainerHeight}px`;
			this._notebookWidget.value!.layout(new DOM.Dimension(this._lastLayoutDimensions.dimension.width, this._lastLayoutDimensions.dimension.height - this.inputCellContainerHeight), this._notebookEditorContainer);
			const leftMargin = this._notebookOptions.getCellEditorContainerLeftMargin();
			const maxHeight = Math.min(this._lastLayoutDimensions.dimension.height / 2, this.inputCellEditorHeight);
			this._codeEditorWidget.layout(this._validateDimension(this._lastLayoutDimensions.dimension.width - leftMargin - INPUT_CELL_HORIZONTAL_PADDING_RIGHT, maxHeight));
			this._inputFocusIndicator.style.height = `${this.inputCellEditorHeight}px`;
			this._inputCellContainer.style.top = `${this._lastLayoutDimensions.dimension.height - this.inputCellContainerHeight}px`;
			this._inputCellContainer.style.width = `${this._lastLayoutDimensions.dimension.width}px`;
		}

		await super.setInput(input, options, context, token);
		const model = await input.resolve();
		if (this._runbuttonToolbar) {
			this._runbuttonToolbar.context = input.resource;
		}

		if (model === null) {
			throw new Error('The Interactive Window model could not be resolved');
		}

		this._notebookWidget.value?.setParentContextKeyService(this._contextKeyService);

		const viewState = options?.viewState ?? this._loadNotebookEditorViewState(input);
		await this._extensionService.whenInstalledExtensionsRegistered();
		await this._notebookWidget.value!.setModel(model.notebook, viewState?.notebook);
		model.notebook.setCellCollapseDefault(this._notebookOptions.getCellCollapseDefault());
		this._notebookWidget.value!.setOptions({
			isReadOnly: true
		});
		this._widgetDisposableStore.add(this._notebookWidget.value!.onDidResizeOutput((cvm) => {
			this._scrollIfNecessary(cvm);
		}));
		this._widgetDisposableStore.add(this._notebookWidget.value!.onDidFocusWidget(() => this._onDidFocusWidget.fire()));
		this._widgetDisposableStore.add(this._notebookOptions.onDidChangeOptions(e => {
			if (e.compactView || e.focusIndicator) {
				// update the styling
				this._styleElement?.remove();
				this._createLayoutStyles();
			}

			if (this._lastLayoutDimensions && this.isVisible()) {
				this.layout(this._lastLayoutDimensions.dimension, this._lastLayoutDimensions.position);
			}

			if (e.interactiveWindowCollapseCodeCells) {
				model.notebook.setCellCollapseDefault(this._notebookOptions.getCellCollapseDefault());
			}
		}));

		const languageId = this._notebookWidget.value?.activeKernel?.supportedLanguages[0] ?? input.language ?? PLAINTEXT_LANGUAGE_ID;
		const editorModel = await input.resolveInput(languageId);
		editorModel.setLanguage(languageId);
		this._codeEditorWidget.setModel(editorModel);
		if (viewState?.input) {
			this._codeEditorWidget.restoreViewState(viewState.input);
		}
		this._editorOptions = this._computeEditorOptions();
		this._codeEditorWidget.updateOptions(this._editorOptions);

		this._widgetDisposableStore.add(this._codeEditorWidget.onDidFocusEditorWidget(() => this._onDidFocusWidget.fire()));
		this._widgetDisposableStore.add(this._codeEditorWidget.onDidContentSizeChange(e => {
			if (!e.contentHeightChanged) {
				return;
			}

			if (this._lastLayoutDimensions) {
				this._layoutWidgets(this._lastLayoutDimensions.dimension, this._lastLayoutDimensions.position);
			}
		}));

		this._widgetDisposableStore.add(this._codeEditorWidget.onDidChangeCursorPosition(e => this._onDidChangeSelection.fire({ reason: this._toEditorPaneSelectionChangeReason(e) })));
		this._widgetDisposableStore.add(this._codeEditorWidget.onDidChangeModelContent(() => this._onDidChangeSelection.fire({ reason: EditorPaneSelectionChangeReason.EDIT })));


		this._widgetDisposableStore.add(this._notebookKernelService.onDidChangeNotebookAffinity(this._syncWithKernel, this));
		this._widgetDisposableStore.add(this._notebookKernelService.onDidChangeSelectedNotebooks(this._syncWithKernel, this));

		this._widgetDisposableStore.add(this.themeService.onDidColorThemeChange(() => {
			if (this.isVisible()) {
				this._updateInputHint();
			}
		}));

		this._widgetDisposableStore.add(this._codeEditorWidget.onDidChangeModelContent(() => {
			if (this.isVisible()) {
				this._updateInputHint();
			}
		}));

		this._codeEditorWidget.onDidChangeModelDecorations(() => {
			if (this.isVisible()) {
				this._updateInputHint();
			}
		});

		this._widgetDisposableStore.add(this._codeEditorWidget.onDidChangeModel(() => {
			this._updateInputHint();
		}));

		this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(ReplEditorSettings.showExecutionHint)) {
				this._updateInputHint();
			}
		});

		const cursorAtBoundaryContext = INTERACTIVE_INPUT_CURSOR_BOUNDARY.bindTo(this._contextKeyService);
		if (input.resource && input.historyService.has(input.resource)) {
			cursorAtBoundaryContext.set('top');
		} else {
			cursorAtBoundaryContext.set('none');
		}

		this._widgetDisposableStore.add(this._codeEditorWidget.onDidChangeCursorPosition(({ position }) => {
			const viewModel = this._codeEditorWidget._getViewModel()!;
			const lastLineNumber = viewModel.getLineCount();
			const lastLineCol = viewModel.getLineLength(lastLineNumber) + 1;
			const viewPosition = viewModel.coordinatesConverter.convertModelPositionToViewPosition(position);
			const firstLine = viewPosition.lineNumber === 1 && viewPosition.column === 1;
			const lastLine = viewPosition.lineNumber === lastLineNumber && viewPosition.column === lastLineCol;

			if (firstLine) {
				if (lastLine) {
					cursorAtBoundaryContext.set('both');
				} else {
					cursorAtBoundaryContext.set('top');
				}
			} else {
				if (lastLine) {
					cursorAtBoundaryContext.set('bottom');
				} else {
					cursorAtBoundaryContext.set('none');
				}
			}
		}));

		this._widgetDisposableStore.add(editorModel.onDidChangeContent(() => {
			const value = editorModel.getValue();
			if (this.input?.resource) {
				const historyService = (this.input as InteractiveEditorInput).historyService;
				if (!historyService.matchesCurrent(this.input.resource, value)) {
					historyService.replaceLast(this.input.resource, value);
				}
			}
		}));

		this._widgetDisposableStore.add(this._notebookWidget.value!.onDidScroll(() => this._onDidChangeScroll.fire()));

		this._syncWithKernel();

		this._updateInputHint();
	}

	override setOptions(options: INotebookEditorOptions | undefined): void {
		this._notebookWidget.value?.setOptions(options);
		super.setOptions(options);
	}

	private _toEditorPaneSelectionChangeReason(e: ICursorPositionChangedEvent): EditorPaneSelectionChangeReason {
		switch (e.source) {
			case TextEditorSelectionSource.PROGRAMMATIC: return EditorPaneSelectionChangeReason.PROGRAMMATIC;
			case TextEditorSelectionSource.NAVIGATION: return EditorPaneSelectionChangeReason.NAVIGATION;
			case TextEditorSelectionSource.JUMP: return EditorPaneSelectionChangeReason.JUMP;
			default: return EditorPaneSelectionChangeReason.USER;
		}
	}

	private _cellAtBottom(cell: ICellViewModel): boolean {
		const visibleRanges = this._notebookWidget.value?.visibleRanges || [];
		const cellIndex = this._notebookWidget.value?.getCellIndex(cell);
		if (cellIndex === Math.max(...visibleRanges.map(range => range.end - 1))) {
			return true;
		}
		return false;
	}

	private _scrollIfNecessary(cvm: ICellViewModel) {
		const index = this._notebookWidget.value!.getCellIndex(cvm);
		if (index === this._notebookWidget.value!.getLength() - 1) {
			// If we're already at the bottom or auto scroll is enabled, scroll to the bottom
			if (this._configurationService.getValue<boolean>(ReplEditorSettings.interactiveWindowAlwaysScrollOnNewCell) || this._cellAtBottom(cvm)) {
				this._notebookWidget.value!.scrollToBottom();
			}
		}
	}

	private _syncWithKernel() {
		const notebook = this._notebookWidget.value?.textModel;
		const textModel = this._codeEditorWidget.getModel();

		if (notebook && textModel) {
			const info = this._notebookKernelService.getMatchingKernel(notebook);
			const selectedOrSuggested = info.selected
				?? (info.suggestions.length === 1 ? info.suggestions[0] : undefined)
				?? (info.all.length === 1 ? info.all[0] : undefined);

			if (selectedOrSuggested) {
				const language = selectedOrSuggested.supportedLanguages[0];
				// All kernels will initially list plaintext as the supported language before they properly initialized.
				if (language && language !== 'plaintext') {
					const newMode = this._languageService.createById(language).languageId;
					textModel.setLanguage(newMode);
				}

				NOTEBOOK_KERNEL.bindTo(this._contextKeyService).set(selectedOrSuggested.id);
			}
		}
	}

	layout(dimension: DOM.Dimension, position: DOM.IDomPosition): void {
		this._rootElement.classList.toggle('mid-width', dimension.width < 1000 && dimension.width >= 600);
		this._rootElement.classList.toggle('narrow-width', dimension.width < 600);
		const editorHeightChanged = dimension.height !== this._lastLayoutDimensions?.dimension.height;
		this._lastLayoutDimensions = { dimension, position };

		if (!this._notebookWidget.value) {
			return;
		}

		if (editorHeightChanged && this._codeEditorWidget) {
			SuggestController.get(this._codeEditorWidget)?.cancelSuggestWidget();
		}

		this._notebookEditorContainer.style.height = `${this._lastLayoutDimensions.dimension.height - this.inputCellContainerHeight}px`;
		this._layoutWidgets(dimension, position);
	}

	private _layoutWidgets(dimension: DOM.Dimension, position: DOM.IDomPosition) {
		const contentHeight = this._codeEditorWidget.hasModel() ? this._codeEditorWidget.getContentHeight() : this.inputCellEditorHeight;
		const maxHeight = Math.min(dimension.height / 2, contentHeight);
		const leftMargin = this._notebookOptions.getCellEditorContainerLeftMargin();

		const inputCellContainerHeight = maxHeight + INPUT_CELL_VERTICAL_PADDING * 2;
		this._notebookEditorContainer.style.height = `${dimension.height - inputCellContainerHeight}px`;

		this._notebookWidget.value!.layout(dimension.with(dimension.width, dimension.height - inputCellContainerHeight), this._notebookEditorContainer, position);
		this._codeEditorWidget.layout(this._validateDimension(dimension.width - leftMargin - INPUT_CELL_HORIZONTAL_PADDING_RIGHT, maxHeight));
		this._inputFocusIndicator.style.height = `${contentHeight}px`;
		this._inputCellContainer.style.top = `${dimension.height - inputCellContainerHeight}px`;
		this._inputCellContainer.style.width = `${dimension.width}px`;
	}

	private _validateDimension(width: number, height: number) {
		return new DOM.Dimension(Math.max(0, width), Math.max(0, height));
	}

	private _hasConflictingDecoration() {
		return Boolean(this._codeEditorWidget.getLineDecorations(1)?.find((d) =>
			d.options.beforeContentClassName
			|| d.options.afterContentClassName
			|| d.options.before?.content
			|| d.options.after?.content
		));
	}

	private _updateInputHint(): void {
		if (!this._codeEditorWidget) {
			return;
		}

		const shouldHide =
			!this._codeEditorWidget.hasModel() ||
			this._configurationService.getValue<boolean>(ReplEditorSettings.showExecutionHint) === false ||
			this._codeEditorWidget.getModel()!.getValueLength() !== 0 ||
			this._hasConflictingDecoration();

		if (!this._hintElement && !shouldHide) {
			this._hintElement = this._instantiationService.createInstance(ReplInputHintContentWidget, this._codeEditorWidget);
		} else if (this._hintElement && shouldHide) {
			this._hintElement.dispose();
			this._hintElement = undefined;
		}
	}

	getScrollPosition(): IEditorPaneScrollPosition {
		return {
			scrollTop: this._notebookWidget.value?.scrollTop ?? 0,
			scrollLeft: 0
		};
	}

	setScrollPosition(position: IEditorPaneScrollPosition): void {
		this._notebookWidget.value?.setScrollTop(position.scrollTop);
	}

	override focus() {
		super.focus();

		this._notebookWidget.value?.onShow();
		this._codeEditorWidget.focus();
	}

	focusHistory() {
		this._notebookWidget.value!.focus();
	}

	protected override setEditorVisible(visible: boolean): void {
		super.setEditorVisible(visible);
		this._groupListener.value = this.group.onWillCloseEditor(e => this._saveEditorViewState(e.editor));

		if (!visible) {
			this._saveEditorViewState(this.input);
			if (this.input && this._notebookWidget.value) {
				this._notebookWidget.value.onWillHide();
			}
		}

		this._updateInputHint();
	}

	override clearInput() {
		if (this._notebookWidget.value) {
			this._saveEditorViewState(this.input);
			this._notebookWidget.value.onWillHide();
		}

		this._codeEditorWidget?.dispose();

		this._notebookWidget = { value: undefined };
		this._widgetDisposableStore.clear();

		super.clearInput();
	}

	override getControl(): ReplEditorControl & ICompositeCodeEditor {
		return {
			notebookEditor: this._notebookWidget.value,
			activeCodeEditor: this._codeEditorWidget,
			onDidChangeActiveEditor: Event.None
		};
	}
}
```

--------------------------------------------------------------------------------

````

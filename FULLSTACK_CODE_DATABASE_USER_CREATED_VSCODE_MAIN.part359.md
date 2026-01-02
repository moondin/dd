---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 359
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 359 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/media/chat.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/media/chat.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.interactive-session {
	display: flex;
	flex-direction: column;
	max-width: 950px;
	height: 100%;
	margin: auto;
	position: relative; /* Enable absolute positioning for child elements */

	/* 11px when base font is 13px */
	--vscode-chat-font-size-body-xs: 0.846em;
	/* 12px when base font is 13px */
	--vscode-chat-font-size-body-s: 0.923em;
	/* 13px when base font is 13px */
	--vscode-chat-font-size-body-m: 1em;
	/* 14px when base font is 13px */
	--vscode-chat-font-size-body-l: 1.077em;
	/* 16px when base font is 13px */
	--vscode-chat-font-size-body-xl: 1.231em;
	/* 20px when base font is 13px */
	--vscode-chat-font-size-body-xxl: 1.538em;
}

.interactive-list > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row > .monaco-tl-row > .monaco-tl-twistie {
	/* Hide twisties from chat tree rows, but not from nested trees within a chat response */
	display: none !important;
}

.interactive-item-container {
	padding: 12px 16px;
	display: flex;
	flex-direction: column;
	color: var(--vscode-interactive-session-foreground);

	cursor: default;
	user-select: text;
	-webkit-user-select: text;
}

.interactive-item-container:not(:has(.chat-extensions-content-part)) .header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	margin-bottom: 8px;
}

.interactive-item-container .header.hidden,
.interactive-item-container .header .avatar-container.hidden,
.interactive-item-container .header .username.hidden {
	display: none;
}

.interactive-item-container .header .user {
	display: flex;
	align-items: center;
	gap: 8px;

	/*
	Rendering the avatar icon as round makes it a little larger than the .user container.
	Add padding so that the focus outline doesn't run into it, and counteract it with a negative margin so it doesn't actually take up any extra space */
	padding: 2px;
	margin: -2px;
}

.interactive-item-container .header .username {
	margin: 0;
	font-size: 13px;
	font-weight: 600;
}

.interactive-item-container .detail-container {
	font-family: var(--vscode-chat-font-family, inherit);
	font-size: var(--vscode-chat-font-size-body-s);
	color: var(--vscode-descriptionForeground);
	overflow: hidden;
}

.interactive-item-container .detail-container .detail .agentOrSlashCommandDetected A {
	cursor: pointer;
	color: var(--vscode-textLink-foreground);
}

.interactive-item-container .chat-animated-ellipsis {
	display: inline-block;
	width: 2em;
}

.interactive-item-container:not(.show-detail-progress) .chat-animated-ellipsis {
	display: none;
}

@keyframes ellipsis {
	0% {
		content: "";
	}

	25% {
		content: ".";
	}

	50% {
		content: "..";
	}

	75% {
		content: "...";
	}

	100% {
		content: "";
	}
}

.interactive-item-container .chat-animated-ellipsis::after {
	content: '';
	white-space: nowrap;
	overflow: hidden;
	width: 3em;
	animation: ellipsis steps(4, end) 1s infinite;
}

.interactive-item-container .header .avatar-container {
	display: flex;
	pointer-events: none;
	user-select: none;
}

.interactive-item-container .header .avatar {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	outline: 1px solid var(--vscode-chat-requestBorder);
}

.interactive-item-container .header .avatar.codicon-avatar {
	background: var(--vscode-chat-avatarBackground);
}

.interactive-item-container .header .avatar + .avatar {
	margin-left: -8px;
}

.interactive-item-container .header .avatar .icon {
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background-color: var(--vscode-chat-list-background);
}

.interactive-item-container .header .avatar .codicon {
	color: var(--vscode-chat-avatarForeground) !important;
	font-size: 14px;
}

.monaco-list-row:not(.focused) .interactive-item-container:not(:hover) .header .monaco-toolbar,
.monaco-list:not(:focus-within) .monaco-list-row .interactive-item-container:not(:hover) .header .monaco-toolbar,
.monaco-list-row:not(.focused) .interactive-item-container:not(:hover) .header .monaco-toolbar .action-label,
.monaco-list:not(:focus-within) .monaco-list-row .interactive-item-container:not(:hover) .header .monaco-toolbar .action-label {
	/* Also apply this rule to the .action-label directly to work around a strange issue- when the
	toolbar is hidden without that second rule, tabbing from the list container into a list item doesn't work
	and the tab key doesn't do anything. */
	display: none;
}

.interactive-item-container .header .monaco-toolbar .monaco-action-bar .actions-container {
	gap: 4px;
}

.interactive-item-container .header .monaco-toolbar .action-label {
	border: 1px solid transparent;
	padding: 2px;
}

.interactive-item-container.interactive-response .header .monaco-toolbar {
	position: absolute;
	left: 0px;
	background-color: var(--vscode-chat-list-background);
}

.interactive-item-container.interactive-request .header .monaco-toolbar {
	/* Take the partially-transparent background color override for request rows */
	background-color: inherit;
}

.interactive-item-container .chat-footer-toolbar {
	display: none;
}

.interactive-item-container .chat-footer-toolbar.hidden {
	display: none !important;
}

.interactive-item-container .chat-footer-toolbar .monaco-action-bar .actions-container {
	gap: 4px;
}

.interactive-item-container .chat-footer-toolbar .checked.action-label,
.interactive-item-container .chat-footer-toolbar .checked.action-label:hover {
	color: var(--vscode-inputOption-activeForeground) !important;
	border-color: var(--vscode-inputOption-activeBorder);
	background-color: var(--vscode-inputOption-activeBackground);
}

.interactive-item-container.interactive-response.chat-most-recent-response {
	min-height: var(--chat-current-response-min-height);
}

.interactive-item-container.interactive-response:not(.chat-response-loading) .chat-footer-toolbar,
.interactive-item-container.interactive-response:not(.chat-response-loading) .chat-footer-toolbar .chat-footer-details {
	/* Complete response only */
	display: block;
	opacity: 0;
	visibility: hidden;
	padding-top: 6px;
	height: 22px;
}

/* Show toolbar on hover and last response. Also show when the item has keyboard focus (focus-within) or when the surrounding list row is marked focused (monaco list keyboard navigation). */
.interactive-item-container.interactive-response:not(.chat-response-loading):hover .chat-footer-toolbar,
.interactive-item-container.interactive-response.chat-most-recent-response:not(.chat-response-loading) .chat-footer-toolbar,
.interactive-item-container.interactive-response:not(.chat-response-loading):hover .chat-footer-toolbar .chat-footer-details,
.interactive-item-container.interactive-response:not(.chat-response-loading):focus-within .chat-footer-toolbar,
.interactive-item-container.interactive-response:not(.chat-response-loading):focus-within .chat-footer-toolbar .chat-footer-details,
.monaco-list-row.focused .interactive-item-container.interactive-response:not(.chat-response-loading) .chat-footer-toolbar,
.monaco-list-row.focused .interactive-item-container.interactive-response:not(.chat-response-loading) .chat-footer-toolbar .chat-footer-details {
	opacity: 1;
	visibility: visible;
}

/* Style the internal toolbar element to use flexbox */
.interactive-item-container .chat-footer-toolbar .monaco-toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.interactive-item-container .chat-footer-details {
	display: none;
	padding: 0;
	font-size: var(--vscode-chat-font-size-body-xs);
	opacity: 0.7;
	color: var(--vscode-descriptionForeground);
	line-height: 16px;
	margin-left: auto;
}

.interactive-item-container .chat-footer-details.hidden {
	display: none !important;
}

.interactive-item-container .value {
	width: 100%;
}

.interactive-item-container > .value .chat-used-context {
	margin-bottom: 8px;
}

.interactive-item-container .value .rendered-markdown:not(:has(.chat-extensions-content-part)) {
	.codicon {
		font-size: inherit;
	}

	.interactive-result-code-block .codicon {
		font-size: initial;
	}
}

.interactive-item-container .value .rendered-markdown blockquote {
	margin: 0px;
	padding: 0px 16px 0 10px;
	border-left-width: 5px;
	border-left-style: solid;
	border-radius: 2px;
	background: var(--vscode-textBlockQuote-background);
	border-color: var(--vscode-textBlockQuote-border);
}

.interactive-item-container .value .rendered-markdown table {
	width: 100%;
	text-align: left;
	margin-bottom: 16px;
}

.interactive-item-container .value .rendered-markdown table,
.interactive-item-container .value .rendered-markdown table td,
.interactive-item-container .value .rendered-markdown table th {
	border: 1px solid var(--vscode-chat-requestBorder);
	border-collapse: collapse;
	padding: 4px 6px;
}

.interactive-item-container .value .rendered-markdown a,
.interactive-item-container .value .interactive-session-followups,
.interactive-item-container .value .rendered-markdown a code {
	color: var(--vscode-textLink-foreground);
}

.interactive-item-container .value .rendered-markdown .chat-extensions-content-part a {
	color: inherit;
}

.interactive-item-container .value .rendered-markdown a {
	user-select: text;
}

.interactive-item-container .value .rendered-markdown a:hover,
.interactive-item-container .value .rendered-markdown a:active {
	color: var(--vscode-textLink-activeForeground);
}

.hc-black .interactive-item-container .value .rendered-markdown a code,
.hc-light .interactive-item-container .value .rendered-markdown a code {
	color: var(--vscode-textPreformat-foreground);
}

.interactive-list {
	overflow: hidden;
	position: relative;
	/* For the scroll down button */
}

.hc-black .interactive-request,
.hc-light .interactive-request {
	border-left: 3px solid var(--vscode-chat-requestBorder);
	border-right: 3px solid var(--vscode-chat-requestBorder);
}

.interactive-item-container .value {
	white-space: normal;
	overflow-wrap: anywhere;
}

.interactive-item-container .value > :last-child,
.interactive-item-container .value > :last-child.rendered-markdown > :last-child,
.interactive-item-container.interactive-request .value .rendered-markdown > :last-child {
	margin-bottom: 0px;
}

.interactive-item-container .value .rendered-markdown hr {
	border-color: rgba(0, 0, 0, 0.18);
}

.vs-dark .interactive-item-container .value .rendered-markdown hr {
	border-color: rgba(255, 255, 255, 0.18);
}

.interactive-item-container .value .rendered-markdown h1 {
	font-size: var(--vscode-chat-font-size-body-xxl);
	font-weight: 600;
	margin: 16px 0 8px 0;
	font-family: var(--vscode-chat-font-family, inherit);

}

.interactive-item-container .value .rendered-markdown h2 {
	font-size: var(--vscode-chat-font-size-body-xl);
	font-weight: 600;
	margin: 16px 0 8px 0;
	font-family: var(--vscode-chat-font-family, inherit);
}

.interactive-item-container .value .rendered-markdown h3 {
	font-size: var(--vscode-chat-font-size-body-l);
	font-weight: 600;
	margin: 16px 0 8px 0;
	font-family: var(--vscode-chat-font-family, inherit);
}

.interactive-item-container.editing-session .value .rendered-markdown p:has(+ [data-code] > .chat-codeblock-pill-widget) {
	margin-bottom: 8px;
}

.interactive-item-container.editing-session .value .rendered-markdown h3 {
	font-size: var(--vscode-chat-font-size-body-m);
	margin: 0 0 8px 0;
	font-weight: unset;
}

/* Codicons next to text need to be aligned with the text */
.interactive-item-container .value .rendered-markdown:not(:has(.chat-extensions-content-part)) .codicon {
	position: relative;
	top: 2px;
}

.interactive-item-container .value .rendered-markdown {
	.chat-codeblock-pill-widget .codicon {
		top: -1px;
	}

	/* But codicons in toolbars assume the natural position of the codicon */
	.monaco-toolbar .codicon {
		position: initial;
		top: initial;
	}

	/* Code blocks at the beginning of an answer should not have a margin as it means it won't align with the agent icon*/
	> div[data-code]:first-child {
		margin-top: 0;

	}

	/* Override the top to avoid the toolbar getting clipped by overflow:hidden */
	> div[data-code]:first-child .interactive-result-code-block .interactive-result-code-block-toolbar > .monaco-action-bar,
	> div[data-code]:first-child .interactive-result-code-block .interactive-result-code-block-toolbar > .monaco-toolbar {
		top: 6px;
	}
}

.interactive-item-container .value.inline-progress {

	.rendered-markdown {
		display: inline-flex;
	}

	/* not ideal but I cannot query the last div with this class... */
	.rendered-markdown:last-of-type > P > SPAN:empty {
		display: inline-block;
		width: 11px;
	}

	.rendered-markdown:last-of-type > P > SPAN:empty::after {
		content: '';
		white-space: nowrap;
		overflow: hidden;
		width: 3em;
		animation: ellipsis steps(4, end) 1s infinite;
	}
}

.interactive-item-container .value .rendered-markdown {
	line-height: 1.5em;
	font-size: var(--vscode-chat-font-size-body-m);
	font-family: var(--vscode-chat-font-family, inherit);
}

.interactive-item-container .value > .rendered-markdown p {
	/* Targetting normal text paras. `p` can also appear in other elements/widgets */
	margin: 0 0 16px 0;
}

.interactive-item-container .value > .chat-tool-invocation-part {
	.rendered-markdown p {
		margin: 0 0 6px 0;
	}

	.disclaimer {
		margin-top: 6px;
		margin-bottom: -6px;

		.rendered-markdown p:last-child {
			margin-bottom: 0;
		}
	}

	.message .see-more {
		display: none;
		position: absolute;
		right: 0;
		top: 20px;

		a {
			color: var(--vscode-textLink-foreground);
			text-decoration: underline;
			cursor: pointer;
		}
	}

	.message.can-see-more {
		position: relative;

		.message-wrapper {
			/* This mask fades out the end of the second line of text so the "see more" message can be displayed over it. */
			mask-image:
				linear-gradient(to right, rgba(0, 0, 0, 1) calc(100% - 95px), rgba(0, 0, 0, 0) calc(100% - 72px)), linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 20px, rgba(0, 0, 0, 1) 2px, rgba(0, 0, 0, 1) 100%);
			mask-repeat: no-repeat, no-repeat;
			pointer-events: none;
			max-height: 40px;
		}

		.see-more {
			display: block;
		}
	}

	.progress-container .rendered-markdown [data-code] {
		margin: 0;
	}

	.tool-input-output-part {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	.tool-input-output-part .rendered-markdown p {
		margin: inherit;
	}

	.tool-input-output-part .expando {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.tool-input-output-part .input-output {
		display: none;
		padding: 6px 0;
		flex-basis: 100%;
		width: 100%;
	}

	.tool-input-output-part.expanded .input-output {
		display: inherit;
	}

	.tool-output-part {
		border: 1px solid var(--vscode-widget-border);
		border-radius: 6px;
		background: var(--vscode-editor-background);
		margin: 4px 0;
		overflow: hidden;

		.output-title {
			padding: 8px 12px;
			background: var(--vscode-editorWidget-background);
			border-bottom: 1px solid var(--vscode-widget-border);
			font-size: var(--vscode-chat-font-size-body-m);
		}

		.output-error {
			margin: 6px 4px;
			color: var(--vscode-errorForeground);

			.output-error-header {
				display: flex;
				align-items: center;
				gap: 7px;
				margin-bottom: 4px;

				.codicon-error {
					color: var(--vscode-errorForeground) !important;
				}
			}

			.output-error-details {
				font-family: var(--monaco-monospace-font);
				font-size: var(--vscode-chat-font-size-body-xs);
			}
		}
	}

	&:not(:last-child) {
		margin-bottom: 8px;
	}
}

.interactive-item-container .value .from-sub-agent {
	&.chat-tool-invocation-part,
	&.chat-confirmation-widget,
	&.chat-terminal-confirmation-widget,
	&.chat-codeblock-pill-widget {
		margin-left: 18px;
	}
}

.interactive-item-container .value > .rendered-markdown li > p {
	margin: 0;
}

/* #region list indent rules */
.interactive-item-container .value .rendered-markdown ul {
	/* Keep this in sync with the values for dedented codeblocks below */
	padding-inline-start: 24px;
}

.interactive-item-container .value .rendered-markdown ol {
	/* Keep this in sync with the values for dedented codeblocks below */
	padding-inline-start: 28px;
}

/* NOTE- We want to dedent codeblocks in lists specifically to give them the full width. No more elegant way to do this, these values
have to be updated for changes to the rules above, or to support more deeply nested lists. */
.interactive-item-container .value .rendered-markdown ul .interactive-result-code-block {
	margin-left: -24px;
}

.interactive-item-container .value .rendered-markdown ul ul .interactive-result-code-block {
	margin-left: -48px;
}

.interactive-item-container .value .rendered-markdown ol .interactive-result-code-block {
	margin-left: -28px;
}

.interactive-item-container .value .rendered-markdown ol ol .interactive-result-code-block {
	margin-left: -56px;
}

.interactive-item-container .value .rendered-markdown ol ul .interactive-result-code-block,
.interactive-item-container .value .rendered-markdown ul ol .interactive-result-code-block {
	margin-left: -52px;
}

/* #endregion list indent rules */

.interactive-item-container .value .rendered-markdown img {
	max-width: 100%;
}

.chat-tool-hover,
.interactive-item-container {

	.monaco-tokenized-source,
	code {
		font-family: var(--monaco-monospace-font);
		font-size: var(--vscode-chat-font-size-body-s);
		color: var(--vscode-textPreformat-foreground);
		background-color: var(--vscode-textPreformat-background);
		padding: 1px 3px;
		border-radius: 4px;
		border: 1px solid var(--vscode-textPreformat-border);
		white-space: pre-wrap;
	}
}

.interactive-item-container.interactive-item-compact {
	padding: 8px 20px;
}

.interactive-item-container.interactive-item-compact .header {
	height: 16px;
}

.interactive-item-container.interactive-item-compact .header .avatar {
	width: 18px;
	height: 18px;
}

.interactive-item-container.interactive-item-compact .header .avatar .icon {
	width: 16px;
	height: 16px;
}

.interactive-item-container.interactive-item-compact .header .codicon-avatar .codicon {
	font-size: 12px;
}

.interactive-item-container.interactive-item-compact .header .avatar + .avatar {
	margin-left: -4px;
}

.interactive-item-container.interactive-item-compact .value {
	min-height: 0;
}

.interactive-item-container.interactive-item-compact .value > .rendered-markdown p {
	margin: 0 0 8px 0;
}

.interactive-item-container.interactive-item-compact .value > .rendered-markdown li > p {
	margin: 0;
}

.interactive-item-container.interactive-item-compact .value .rendered-markdown h1 {
	margin: 8px 0;

}

.interactive-item-container.interactive-item-compact .value .rendered-markdown h2 {
	margin: 8px 0;
}

.interactive-item-container.interactive-item-compact .value .rendered-markdown h3 {
	margin: 8px 0;
}

.interactive-item-container.minimal {
	flex-direction: row;
}

.interactive-item-container.minimal .column.left {
	padding-top: 2px;
	display: inline-block;
	flex-grow: 0;
}

.interactive-item-container.minimal .column.right {
	display: inline-block;
	flex-grow: 1;
}

.interactive-item-container.interactive-request.minimal .rendered-markdown .chat-animated-ellipsis {
	display: inline-flex;
}

.interactive-item-container.minimal .user > .username {
	display: none;
}

.interactive-item-container.minimal .detail-container {
	font-size: unset;
}

.interactive-item-container.minimal > .header {
	position: absolute;
	right: 0;
}

.chat-dnd-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	box-sizing: border-box;

	display: none;
}

.chat-dnd-overlay.visible {
	display: flex;
	align-items: center;
	justify-content: center;
}

.chat-dnd-overlay .attach-context-overlay-text {
	padding: 0.6em;
	margin: 0.2em;
	line-height: 12px;
	height: 12px;
	display: flex;
	align-items: center;
	text-align: center;
}

.chat-dnd-overlay .attach-context-overlay-text .codicon {
	height: 12px;
	font-size: 12px;
	margin-right: 3px;
}

.interactive-session .chat-input-container {
	box-sizing: border-box;
	cursor: text;
	background-color: var(--vscode-input-background);
	border: 1px solid var(--vscode-input-border, transparent);
	border-radius: 4px;
	padding: 0 6px 6px 6px;
	/* top padding is inside the editor widget */
	width: 100%;
}

.interactive-input-part:has(.chat-editing-session > .chat-editing-session-container) .chat-input-container,
.interactive-input-part:has(.chat-todo-list-widget-container > .chat-todo-list-widget.has-todos) .chat-input-container,
.interactive-input-part:has(.chat-input-widgets-container > .chat-status-widget:not([style*="display: none"])) .chat-input-container {
	/* Remove top border radius when editing session, todo list, or status widget is present */
	border-top-left-radius: 0;
	border-top-right-radius: 0;
}

.interactive-session .chat-editing-session {
	margin-bottom: -4px;
	/* Counter the flex gap */
	/* reset the 4px gap of the container for editing sessions */
	width: 100%;
	position: relative;
}

.interactive-session .chat-editing-session .chat-editing-session-container {
	padding: 6px 3px 6px 3px;
	box-sizing: border-box;
	background-color: var(--vscode-editor-background);
	border: 1px solid var(--vscode-input-border, transparent);
	border-bottom: none;
	border-radius: 4px 4px 0 0;
	display: flex;
	flex-direction: column;
	gap: 2px;
	overflow: hidden;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container:has(.chat-todo-list-widget.has-todos) + .chat-editing-session .chat-editing-session-container {
	border-top-left-radius: 0;
	border-top-right-radius: 0;
}

.interactive-session .chat-editing-session .monaco-list-row .chat-collapsible-list-action-bar {
	padding-left: 5px;
	display: none;
}

.interactive-session .chat-editing-session .monaco-list-row:hover .chat-collapsible-list-action-bar:not(.has-no-actions),
.interactive-session .chat-editing-session .monaco-list-row.focused .chat-collapsible-list-action-bar:not(.has-no-actions),
.interactive-session .chat-editing-session .monaco-list-row.selected .chat-collapsible-list-action-bar:not(.has-no-actions) {
	display: inherit;
}

.interactive-session .chat-editing-session .chat-editing-session-container.show-file-icons .monaco-scrollable-element .monaco-list-rows .monaco-list-row {
	border-radius: 2px;
}

.interactive-session .chat-editing-session .chat-editing-session-container.show-file-icons .chat-editing-session-list .monaco-scrollable-element:has(.visible.scrollbar.vertical) .monaco-list-row .monaco-icon-label {
	padding-right: 12px;
}

.interactive-session .chat-editing-session .chat-editing-session-container .chat-editing-session-overview {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	gap: 6px;
	padding-right: 4px;
	cursor: pointer;
}

.interactive-session .chat-editing-session .chat-editing-session-container .chat-editing-session-overview > .working-set-title {
	color: var(--vscode-descriptionForeground);
	font-size: 11px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	align-content: center;
}

.interactive-session .chat-editing-session .chat-editing-session-container .chat-editing-session-overview > .working-set-title .working-set-count.file-limit-reached {
	color: var(--vscode-notificationsWarningIcon-foreground);
}

/* Inline added/removed line count styling */
.interactive-session .chat-editing-session .chat-editing-session-container .chat-editing-session-overview .working-set-line-counts {
	display: inline-flex;
	gap: 4px;
	margin-left: 6px;
	font-weight: 500;
}

.interactive-session .chat-editing-session .chat-editing-session-container .chat-editing-session-overview .working-set-line-counts .working-set-lines-added {
	color: var(--vscode-chat-linesAddedForeground);
}

.interactive-session .chat-editing-session .chat-editing-session-container .chat-editing-session-overview .working-set-line-counts .working-set-lines-removed {
	color: var(--vscode-chat-linesRemovedForeground);
}

.interactive-session .chat-editing-session .chat-editing-session-list .working-set-line-counts {
	margin-left: 6px;
	display: inline-flex;
	gap: 4px;
	font-size: 11px;
}

.interactive-session .chat-editing-session .chat-editing-session-list .working-set-line-counts .working-set-lines-added {
	color: var(--vscode-chat-linesAddedForeground);
}

.interactive-session .chat-editing-session .chat-editing-session-list .working-set-line-counts .working-set-lines-removed {
	color: var(--vscode-chat-linesRemovedForeground);
}

.interactive-session .chat-editing-session .working-set-title {

	.monaco-button {
		padding: 4px 6px 4px 0px;
		border-radius: 2px;
		border: none;
		background-color: unset;
		color: var(--vscode-foreground)
	}

	.monaco-button:focus-visible {
		outline-offset: -1px !important;
	}
}


.interactive-session .chat-editing-session .chat-editing-session-container .monaco-progress-container {
	position: relative;
}

.interactive-session .chat-editing-session .chat-editing-session-toolbar-actions,
.interactive-session .chat-editing-session .chat-editing-session-actions {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	gap: 6px;
	align-items: center;
}

.interactive-session .chat-editing-session .chat-editing-session-toolbar-actions {
	margin: 3px 0px;
	overflow: hidden;
}

.interactive-session .chat-editing-session .monaco-button {
	height: 18px;
	width: fit-content;
	padding: 2px 6px;
	font-size: 11px;
}

.interactive-session .chat-editing-session .chat-editing-session-toolbar-actions .monaco-button:hover {
	background-color: var(--vscode-button-hoverBackground);
}

.interactive-session .chat-editing-session .chat-editing-session-actions-group {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 6px;
}

.interactive-session .chat-editing-session .chat-editing-session-toolbar-actions .monaco-button.codicon.codicon-close {
	width: 17px;
	height: 17px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	color: var(--vscode-descriptionForeground);
	background-color: transparent;
	border: none;
	padding: 0;
	border-radius: 5px;
	cursor: pointer;
}

.interactive-session .chat-editing-session .chat-editing-session-toolbar-actions .monaco-button.secondary {
	color: var(--vscode-foreground);
	background-color: transparent;
	border: none;
	height: 22px;
	padding-left: 0px;
	cursor: pointer;
	display: flex;
	justify-content: start;
}

.chat-attachments-container {
	display: flex;
	flex-direction: row;
	gap: 4px;
	margin-top: 6px;
	flex-wrap: wrap;
	cursor: default;
}

.chat-related-files {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 4px;
	max-width: 100%;
}

.chat-related-files .monaco-button-dropdown .monaco-text-button {
	font-size: 11px;
	justify-content: left;
	width: fit-content;
	padding: 0px;
	border: none;
	height: 18px;
}

.chat-related-files .monaco-button-dropdown .monaco-text-button span {
	font-style: italic;
	height: 18px;
	opacity: 0.7;
}

.chat-related-files .monaco-button-dropdown {
	border-radius: 4px;
	height: 18px;
	border: 1px solid var(--vscode-input-border);
	border-style: dashed;
	align-items: center;
	overflow: hidden;
	gap: 2px;
	padding: 0 4px;
}

.chat-related-files .monaco-button.codicon.codicon-add {
	display: flex;
	flex-direction: column;
	color: var(--vscode-descriptionForeground);
	padding-top: 3px;
	margin-left: -4px;
	padding-left: 4px;
	font-size: 14px;
	/* The + codicon is large, make it look more like the x codicon */
	height: calc(100% - 3px);
	width: 17px;
	outline-offset: -2px !important;
}

.interactive-session .chat-related-files .monaco-icon-label::before {
	padding: 4px 3px 0 2px;
}

.interactive-session .chat-editing-session .chat-related-files .monaco-button.secondary:first-child {
	margin: 3px 0px 3px 3px;
	flex-shrink: 0;
}

.interactive-session .chat-editing-session .chat-related-files .monaco-button.secondary.monaco-icon-label::before {
	display: inline-flex;
	align-items: center;
}

.interactive-session .chat-editing-session .chat-related-files .monaco-button.secondary:only-child {
	width: 100%;
}

.interactive-session .chat-editing-session .chat-related-files .monaco-button.secondary.disabled {
	cursor: initial;
}

.interactive-session .chat-editing-session .chat-related-files .monaco-button.secondary .codicon {
	font-size: 12px;
	margin-left: 4px;
}

.interactive-session .chat-editing-session .chat-editing-session-actions .monaco-button.secondary.monaco-text-button.codicon {
	background-color: transparent;
	border-color: transparent;
	color: var(--vscode-foreground);
	cursor: pointer;
	padding: 0px;
	border-radius: 2px;
	display: inline-flex;
}

.interactive-session .chat-editing-session .chat-editing-session-actions .monaco-button.secondary.monaco-text-button {
	background-color: var(--vscode-button-secondaryBackground);
	border: 1px solid var(--vscode-button-border);
	color: var(--vscode-button-secondaryForeground);
}

.interactive-session .chat-editing-session .chat-editing-session-actions .monaco-button.secondary:hover {
	background-color: var(--vscode-button-secondaryHoverBackground);
	color: var(--vscode-button-secondaryForeground);
}

/* The Add Files button is currently implemented as a secondary button but should not have the secondary button background */
.interactive-session .chat-editing-session .chat-editing-session-toolbar-actions .monaco-button.secondary:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.interactive-session .chat-editing-session .chat-editing-session-actions .monaco-button.secondary.monaco-text-button.codicon:not(.disabled):hover,
.interactive-session .chat-editing-session .chat-editing-session-toolbar-actions .monaco-button:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.interactive-session .chat-editing-session .chat-editing-session-toolbar-actions .monaco-button,
.interactive-session .chat-editing-session .chat-editing-session-actions .monaco-button {
	overflow: hidden;
	text-wrap: nowrap;
}

.interactive-session .chat-editing-session .chat-editing-session-toolbar-actions .monaco-button-dropdown.sidebyside-button {
	align-items: center;
	border-radius: 2px;
}

.interactive-session .chat-editing-session .chat-editing-session-toolbar-actions .monaco-button-dropdown.sidebyside-button .monaco-button,
.interactive-session .chat-editing-session .chat-editing-session-toolbar-actions .monaco-button-dropdown.sidebyside-button .monaco-button:hover {
	border-right: 1px solid transparent;
	background-color: unset;
	padding: 0;
}

.interactive-session .chat-editing-session .chat-editing-session-toolbar-actions .monaco-button-dropdown.sidebyside-button > .separator {
	border-right: 1px solid transparent;
	padding: 0 1px;
	height: 22px;
}

.interactive-session .chat-editing-session .chat-editing-session-toolbar-actions .monaco-button-dropdown.sidebyside-button:hover > .separator {
	border-color: var(--vscode-input-border, transparent);
}

.interactive-session .chat-editing-session .chat-editing-session-toolbar-actions .monaco-button-dropdown.sidebyside-button:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.interactive-session .interactive-input-part > .chat-input-widgets-container {
	margin-bottom: -4px;
	width: 100%;
	position: relative;
}

/* Chat Todo List Widget Container - mirrors chat-editing-session styling */
.interactive-session .interactive-input-part > .chat-todo-list-widget-container {
	margin-bottom: -4px;
	/* reset the 4px gap of the container for editing sessions */
	width: 100%;
	position: relative;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget {
	padding: 6px 3px 6px 3px;
	box-sizing: border-box;
	border: 1px solid var(--vscode-input-border, transparent);
	background-color: var(--vscode-editor-background);
	border-bottom: none;
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
	flex-direction: column;
	gap: 2px;
	overflow: hidden;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-list-expand {
	width: 100%;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-list-expand .monaco-button {
	display: flex;
	align-items: center;
	gap: 4px;
	cursor: pointer;
	justify-content: space-between;
	width: 100%;
	background-color: transparent;
	border-color: transparent;
	color: var(--vscode-foreground);
	padding: 0;
	min-width: unset;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-list-expand .monaco-button:focus:not(:focus-visible) {
	outline: none;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-list-expand .todo-list-title-section {
	padding-left: 3px;
	display: flex;
	align-items: center;
	flex: 1;
	font-size: 11px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	line-height: 16px;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-list-expand .todo-list-title-section .codicon {
	font-size: 16px;
	line-height: 16px;
	flex-shrink: 0;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-clear-button-container {
	padding-right: 2px;
	display: flex;
	align-items: center;
	height: 18px;
	opacity: 1;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-clear-button-container .monaco-button {
	background-color: transparent;
	border-color: transparent;
	color: var(--vscode-foreground);
	cursor: pointer;
	height: 16px;
	padding: 2px;
	border-radius: 2px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: unset;
	width: 14px;
	margin-right: 1px;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-clear-button-container .monaco-button:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-clear-button-container .monaco-button:focus {
	outline: 1px solid var(--vscode-focusBorder);
	outline-offset: 1px;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-clear-button-container .monaco-button .codicon {
	font-size: 10px;
	color: var(--vscode-foreground);
}


.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .expand-icon {
	flex-shrink: 0;
	margin-right: 3px;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-list-title {
	font-weight: normal;
	font-size: 11px;
	display: flex;
	align-items: center;
	overflow: hidden;
	text-overflow: ellipsis;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-list-container {
	margin-top: 2px;
	max-height: calc(6.5 * 21px);
	/* 6.5 items to show half-line affordance */
	overflow-y: auto;
	overscroll-behavior: contain;
	scroll-behavior: smooth;
	scroll-padding-top: 24px;
	/* Half item height to show partial next item */
	scroll-padding-bottom: 24px;
	/* Half item height to show partial previous item */
}


.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-list {
	display: flex;
	flex-direction: column;
	gap: 4px;
	scroll-snap-type: y proximity;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-item {
	display: flex;
	align-items: center;
	gap: 6px;
	scroll-snap-align: start;
	min-height: 22px;
	font-size: var(--vscode-chat-font-size-body-m);
	padding: 0px 3px;
	border-radius: 2px;
	cursor: pointer;
}


.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-item:focus {
	outline: 1px solid var(--vscode-focusBorder);
	outline-offset: -1px;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-item.focused {
	background-color: var(--vscode-list-focusBackground);
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-item > .todo-status-icon.codicon {
	flex-shrink: 0;
	font-size: 16px;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .todo-content {
	flex-grow: 1;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	min-width: 0;
}

.interactive-session .interactive-input-part > .chat-todo-list-widget-container .chat-todo-list-widget .monaco-scrollable-element .monaco-list-rows .monaco-list-row {
	border-radius: 2px;
}

.interactive-session .interactive-input-part.compact .chat-input-container {
	display: flex;
	justify-content: space-between;
	padding-bottom: 0;
	border-radius: 2px;
}

.interactive-session .interactive-input-and-side-toolbar {
	display: flex;
	gap: 4px;
	align-items: center;
	position: relative;
}

.interactive-session .chat-input-container.focused {
	border-color: var(--vscode-focusBorder);
}

.chat-editor-container .monaco-editor .mtk1 {
	color: var(--vscode-input-foreground);
}

.interactive-session .chat-editor-container .monaco-editor .chat-prompt-spinner {
	transform-origin: 6px 6px;
	font-size: 12px;
}

.interactive-session .interactive-input-part .chat-editor-container .interactive-input-editor .monaco-editor,
.interactive-session .interactive-input-part .chat-editor-container .interactive-input-editor .monaco-editor .monaco-editor-background {
	background-color: var(--vscode-input-background);
}

.interactive-session .interactive-input-part.editing .chat-input-container .chat-editor-container .monaco-editor,
.interactive-session .interactive-input-part.editing .chat-input-container .chat-editor-container .monaco-editor .monaco-editor-background,
.interactive-session .interactive-request.editing .interactive-input-part .chat-input-container .chat-editor-container .monaco-editor,
.interactive-session .interactive-request.editing .interactive-input-part .chat-input-container .chat-editor-container .monaco-editor .monaco-editor-background {
	background-color: transparent;
}

.interactive-session .interactive-input-part.editing .chat-input-container,
.interactive-session .interactive-request.editing .interactive-input-part .chat-input-container {
	background-color: var(--vscode-chat-requestBubbleBackground);
}


.interactive-session .chat-editor-container .monaco-editor .cursors-layer {
	padding-left: 4px;
}

.interactive-session .chat-input-toolbars {
	display: flex;
}

.interactive-session .chat-input-toolbars :first-child {
	margin-right: auto;
}

.interactive-session .chat-input-toolbars .tool-warning-indicator {
	position: absolute;
	bottom: 0;
	right: 0;
	font-size: 12px !important;
	color: var(--vscode-problemsWarningIcon-foreground);
	background: var(--vscode-input-background);
	width: fit-content;
	height: fit-content;
	border-radius: 100%;
}

.interactive-session .chat-input-toolbars > .chat-input-toolbar {
	overflow: hidden;
	min-width: 0px;

	.chat-modelPicker-item {
		min-width: 0px;

		.action-label {
			min-width: 0px;

			.chat-model-label {
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.codicon-warning {
				color: var(--vscode-problemsWarningIcon-foreground);
			}

			span + .chat-model-label {
				margin-left: 2px;
			}
		}

		.codicon {
			flex-shrink: 0;
		}
	}
}

.interactive-session .chat-input-toolbars.scroll-top-decoration {
	box-shadow: var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset
}

.interactive-session .chat-input-toolbar .chat-modelPicker-item .action-label,
.interactive-session .chat-input-toolbar .chat-sessionPicker-item .action-label {
	height: 16px;
	padding: 3px 0px 3px 6px;
	display: flex;
	align-items: center;
}


.interactive-session .chat-input-toolbar .chat-modelPicker-item .action-label .codicon-chevron-down,
.interactive-session .chat-input-toolbar .chat-sessionPicker-item .action-label .codicon-chevron-down {
	font-size: 12px;
	margin-left: 2px;
}

.interactive-session .chat-input-toolbars .monaco-action-bar .actions-container {
	display: flex;
	gap: 4px;
}

.interactive-session .chat-input-toolbars .chat-sessionPicker-container {
	display: flex;
	max-width: 100%;
}

.interactive-session .chat-input-toolbars .codicon-debug-stop {
	color: var(--vscode-icon-foreground) !important;
}

.interactive-response .interactive-result-code-block .interactive-result-editor .monaco-editor,
.interactive-response .interactive-result-code-block .interactive-result-editor .monaco-editor .margin,
.interactive-response .interactive-result-code-block .interactive-result-editor .monaco-editor .monaco-editor-background {
	background-color: var(--vscode-interactive-result-editor-background-color) !important;
}

.interactive-item-compact .interactive-result-code-block {
	margin: 0 0 8px 0;
}

.interactive-item-container .interactive-result-code-block .monaco-toolbar .monaco-action-bar .actions-container {
	padding-inline-start: unset;
}


@keyframes kf-chat-editing-atomic-edit {
	0% {
		opacity: 0.8;
	}

	100% {
		opacity: 0;
	}
}

.monaco-editor .chat-editing-atomic-edit {
	z-index: 1;
	opacity: 0.8;
	background-color: var(--vscode-editor-background);
	animation: 350ms kf-chat-editing-atomic-edit ease-out;
}

.monaco-editor .chat-editing-pending-edit {
	z-index: 1;
	opacity: 0.6;
	background-color: var(--vscode-editor-background);
}

.monaco-editor .chat-editing-last-edit {
	background-color: var(--vscode-editor-rangeHighlightBackground);
	box-sizing: border-box;
	border: 1px solid var(--vscode-editor-rangeHighlightBorder);
}

@property --chat-editing-last-edit-shift {
	syntax: '<percentage>';
	initial-value: 100%;
	inherits: false;
}

@keyframes kf-chat-editing-last-edit-shift {
	0% {
		--chat-editing-last-edit-shift: 100%;
	}

	50% {
		--chat-editing-last-edit-shift: 7%;
	}

	100% {
		--chat-editing-last-edit-shift: 100%;
	}
}

.monaco-editor .chat-editing-last-edit-line {
	--chat-editing-last-edit-shift: 100%;
	background: linear-gradient(45deg, var(--vscode-editor-rangeHighlightBackground), var(--chat-editing-last-edit-shift), transparent);
	animation: 2.3s kf-chat-editing-last-edit-shift ease-in-out infinite;
	animation-delay: 330ms;
}


.chat-notification-widget .chat-info-codicon,
.chat-notification-widget .chat-error-codicon,
.chat-notification-widget .chat-warning-codicon {
	display: flex;
	align-items: start;
	gap: 8px;
}

.interactive-item-container .value .chat-notification-widget .rendered-markdown p {
	margin: 0;
}

.interactive-response .interactive-response-error-details {
	display: flex;
	align-items: start;
	gap: 6px;
}

.interactive-response .interactive-response-error-details .rendered-markdown :last-child {
	margin-bottom: 0px;
}

.interactive-response .interactive-response-error-details .codicon {
	margin-top: 1px;
}

.chat-used-context-list .codicon-warning {
	color: var(--vscode-notificationsWarningIcon-foreground);
	/* Have to override default styles which apply to all lists */
}

.chat-used-context-list .monaco-icon-label-container {
	color: var(--vscode-interactive-session-foreground);
}

.chat-attached-context .chat-attached-context-attachment .monaco-icon-name-container.warning,
.chat-attached-context .chat-attached-context-attachment .monaco-icon-suffix-container.warning,
.chat-used-context-list .monaco-icon-name-container.warning,
.chat-used-context-list .monaco-icon-suffix-container.warning {
	color: var(--vscode-notificationsWarningIcon-foreground);
}

.chat-attached-context .chat-attached-context-attachment.show-file-icons.warning,
.chat-attached-context .chat-attached-context-attachment.show-file-icons.partial-warning {
	border-color: var(--vscode-notificationsWarningIcon-foreground);
}

/**
 * Styles for the `reusable prompts` attachment widget.
 */
.chat-attached-context-attachment .prompt-type {
	opacity: 0.7;
	font-size: .9em;
	margin-left: 0.5em;
}

.chat-attached-context-attachment.warning {
	color: var(--vscode-notificationsWarningIcon-foreground);
}

.chat-attached-context-attachment.error {
	color: var(--vscode-notificationsErrorIcon-foreground);
}

.chat-attached-context-attachment .monaco-icon-label > .monaco-icon-label-container > .monaco-icon-suffix-container > .label-suffix {
	color: var(--vscode-peekViewTitleDescription-foreground);
	opacity: 1;
}

.chat-notification-widget .chat-warning-codicon .codicon-warning,
.chat-quota-error-widget .codicon-warning {
	color: var(--vscode-notificationsWarningIcon-foreground) !important;
	/* Have to override default styles which apply to all lists */
}

.chat-rate-limited-widget .codicon-info {
	color: var(--vscode-notificationsInfoIcon-foreground) !important;
	/* Have to override default styles which apply to all lists */
}

.chat-notification-widget .chat-error-codicon .codicon-error,
.interactive-response .interactive-response-error-details .codicon-error {
	color: var(--vscode-errorForeground) !important;
	/* Have to override default styles which apply to all lists */
}

.chat-notification-widget .chat-info-codicon .codicon-info,
.interactive-response .interactive-response-error-details .codicon-info {
	color: var(--vscode-notificationsInfoIcon-foreground) !important;
	/* Have to override default styles which apply to all lists */
}

.interactive-session .interactive-input-part {
	margin: 0px 16px;
	padding: 4px 0 12px 0px;
	display: flex;
	flex-direction: column;
	gap: 4px;
	position: relative;
}

.interactive-session .interactive-input-part.compact {
	margin: 0;
	padding: 8px 0 0 0
}

.action-item.chat-attachment-button .action-label,
.interactive-session .chat-attached-context .chat-attached-context-attachment {
	display: flex;
	overflow: hidden;
	font-size: 11px;
	padding: 0 4px 0 0;
	border: 1px solid var(--vscode-chat-requestBorder, var(--vscode-input-background, transparent));
	border-radius: 4px;
	height: 18px;
	max-width: 100%;
	width: fit-content;
}

.interactive-session .interactive-list .chat-attached-context .chat-attached-context-attachment {
	font-family: var(--vscode-chat-font-family, inherit);
	font-size: var(--vscode-chat-font-size-body-xs);
}

.action-item.chat-attachment-button > .action-label > .codicon {
	font-size: 14px;
	height: auto;
}

.interactive-session .action-item.chat-attachment-button .action-label:not(.has-label) {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2px 4px 2px 4px;
	height: fit-content;
	gap: 0;
	border: 1px solid var(--vscode-chat-requestBorder, var(--vscode-input-background, transparent));
	border-radius: 4px;
	box-sizing: border-box;

	.codicon {
		width: 14px;
	}
}

.action-item.chat-attachment-button .codicon {
	font-size: 14px;
}

.action-item.chat-mcp {

	.chat-mcp-state-indicator {
		position: absolute;
		bottom: 0;
		right: 0;
		font-size: 12px !important;
		background: var(--vscode-input-background);
		width: fit-content;
		height: fit-content;
		border-radius: 100%;

		&.chat-mcp-state-new {
			color: var(--vscode-button-foreground);
		}

		&.chat-mcp-state-error {
			color: var(--vscode-problemsErrorIcon-foreground);
		}

		&.chat-mcp-state-refreshing {
			color: var(--vscode-button-foreground);
		}
	}
}

.action-item.chat-attached-context-attachment.chat-add-files .action-label.codicon::before {
	font: normal normal normal 16px/1 codicon;
}

.interactive-session .chat-attached-context .chat-attached-context-attachment .monaco-button {
	display: flex;
	align-items: center;
	margin-top: -2px;
	padding-right: 2px;
	padding-left: 3px;
	height: calc(100% + 4px);
	outline-offset: -4px;
	font-size: 12px;
}

.interactive-session .chat-attached-context .chat-attached-context-attachment .monaco-button.codicon.codicon-plus {
	padding-left: 4px;
	font-size: 11px;
}

.chat-related-files .monaco-button.codicon.codicon-add:hover,
.action-item.chat-attached-context-attachment.chat-add-files:hover,
.interactive-session .chat-attached-context .chat-attached-context-attachment .monaco-button:hover {
	cursor: pointer;
	background: var(--vscode-toolbar-hoverBackground);
}

.interactive-session .chat-attached-context .chat-attached-context-attachment.implicit.disabled .monaco-button:hover {
	cursor: pointer;
	background: transparent;
}

.interactive-session .chat-attached-context .chat-attached-context-attachment .monaco-icon-label-container {
	display: flex;

	.monaco-icon-suffix-container {
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

.interactive-session .chat-attached-context .chat-attached-context-attachment .monaco-icon-label-container .monaco-highlighted-label {
	display: inline-flex;
	align-items: center;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.interactive-session .chat-attached-context .chat-attached-context-attachment .monaco-icon-label .monaco-button.codicon.codicon-close,
.interactive-session .chat-attached-context .chat-attached-context-attachment .monaco-button.codicon.codicon-close,
.interactive-session .chat-attached-context .chat-attached-context-attachment .monaco-icon-label .monaco-button.codicon.codicon-plus,
.interactive-session .chat-attached-context .chat-attached-context-attachment .monaco-button.codicon.codicon-plus {
	color: var(--vscode-descriptionForeground);
	cursor: pointer;
}

.interactive-session .chat-attached-context .chat-attached-context-attachment .monaco-icon-label .codicon {
	font-size: 14px;
}

.interactive-session .chat-attached-context .chat-attached-context-attachment .monaco-icon-label .monaco-icon-label-iconpath.codicon {
	padding-top: 2px;
}

.interactive-session .chat-input-container .chat-attached-context {
	display: contents;
}

.interactive-session .chat-attached-context {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
}

.interactive-session .chat-attachment-toolbar .actions-container {
	gap: 4px;
	flex-wrap: wrap;
}

.interactive-session .interactive-input-part.compact .chat-attached-context {
	padding-bottom: 0px;
	display: flex;
	gap: 4px;
	flex-wrap: wrap;
}

.interactive-session .chat-attached-context .chat-attached-context-attachment.implicit .chat-implicit-hint {
	opacity: 0.7;
	font-size: .9em;
}

.interactive-session .chat-attached-context .chat-attached-context-attachment.implicit.disabled .chat-implicit-hint {
	font-style: italic;
}

.interactive-session .chat-attached-context .chat-attached-context-attachment.implicit.disabled {
	border-style: dashed;
}

.interactive-session .chat-attached-context .chat-attached-context-attachment.implicit.disabled:focus {
	outline: none;
	border-color: var(--vscode-focusBorder);
}

.interactive-session .chat-attached-context .chat-attached-context-attachment.implicit.disabled .monaco-icon-label .label-name {
	text-decoration: line-through;
	font-style: italic;
	opacity: 0.8;
}

.interactive-session .chat-attached-context .chat-attached-context-attachment .monaco-icon-label {
	gap: 4px;
}

.interactive-session .chat-attached-context .chat-attached-context-attachment .monaco-icon-label::before {
	height: auto;
	padding: 0;
	line-height: 100% !important;
	align-self: center;

	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;
}

.interactive-session .chat-attached-context .chat-attached-context-attachment .monaco-icon-label.predefined-file-icon::before {
	padding: 0 0 0 2px;
	align-content: center;
}

.interactive-session .interactive-item-container.interactive-request .chat-attached-context .chat-attached-context-attachment {
	padding-right: 6px;
}

.interactive-session-followups {
	display: flex;
	flex-direction: column;
	gap: 6px;
	align-items: start;
}

.interactive-session-followups .monaco-button {
	text-align: left;
	width: initial;
}

.interactive-session-followups .monaco-button .codicon {
	margin-left: 0;
	margin-top: 1px;
}

.interactive-item-container .interactive-response-followups .monaco-button {
	padding: 4px 8px;
}

/* .interactive-session .interactive-input-part .interactive-input-followups .interactive-session-followups {
	margin-bottom: 4px;
} */

.interactive-session .interactive-input-part .interactive-input-followups .interactive-session-followups .monaco-button {
	display: block;
	color: var(--vscode-textLink-foreground);
	font-size: 12px;

	/* clamp to max 3 lines */
	display: -webkit-box;
	line-clamp: 3;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.interactive-session .interactive-input-part .interactive-input-followups .interactive-session-followups code {
	font-family: var(--monaco-monospace-font);
	font-size: 11px;
}

.interactive-session .interactive-input-part .interactive-input-followups .interactive-session-followups .monaco-button .codicon-sparkle {
	float: left;
}

.interactive-session-followups .monaco-button.interactive-followup-reply {
	padding: 0px;
	border: none;
}

.interactive-item-container .monaco-toolbar .codicon {
	/* Very aggressive list styles try to apply focus colors to every codicon in a list row. */
	color: var(--vscode-icon-foreground) !important;
}

/* #region Quick Chat */

.quick-input-widget .interactive-session {
	width: 100%;
}

.quick-input-widget .interactive-session .interactive-input-part {
	padding: 8px 6px 8px 6px;
	margin: 0 3px;
}

.quick-input-widget .interactive-session .interactive-input-part .chat-input-toolbars .monaco-toolbar,
.quick-input-widget .interactive-session .interactive-input-part .chat-input-toolbars .actions-container {
	height: initial;
}

.quick-input-widget .interactive-session .interactive-input-part .chat-input-toolbars {
	margin-bottom: 1px;
	align-items: flex-end;
}

.quick-input-widget .interactive-session .chat-input-container {
	margin: 0;
	border-radius: 2px;
	padding: 0 4px 0 6px;
}

.quick-input-widget .interactive-list {
	border-bottom-right-radius: 6px;
	border-bottom-left-radius: 6px;
}

.quick-input-widget .interactive-response {
	min-height: 86px;
}

.quick-input-widget .interactive-session .disclaimer {
	margin: 8px 12px;
	color: var(--vscode-descriptionForeground);
	font-size: 12px;

	a {
		color: var(--vscode-textLink-foreground);
	}

	p {
		margin: 0;
	}
}

/* #endregion */

.interactive-response-progress-tree .monaco-list-row:not(.selected) .monaco-tl-row:hover {
	background-color: var(--vscode-list-hoverBackground);
}

.interactive-response-progress-tree {
	margin: 16px 0px;
}

.interactive-response-progress-tree.focused {
	border-color: var(--vscode-focusBorder, transparent);
}

.interactive-item-container .value .interactive-response-placeholder-codicon .codicon {
	color: var(--vscode-editorGhostText-foreground);
}

.interactive-item-container .value .interactive-response-placeholder-content {
	color: var(--vscode-editorGhostText-foreground);
	font-size: 12px;
	margin-bottom: 16px;
}

.interactive-item-container .value .interactive-response-placeholder-content p {
	margin: 0;
}

.interactive-response .interactive-response-codicon-details {
	display: flex;
	align-items: start;
	gap: 6px;
}

.chat-used-context-list .monaco-list {
	border: none;
	border-radius: 4px;
	width: auto;
}

.interactive-item-container .chat-resource-widget {
	background-color: var(--vscode-chat-slashCommandBackground);
	color: var(--vscode-chat-slashCommandForeground);
}


.interactive-item-container .chat-resource-widget,
.interactive-item-container .chat-agent-widget .monaco-button {
	border-radius: 4px;
	padding: 1px 3px;
}

.interactive-item-container .chat-agent-command {
	background-color: var(--vscode-chat-slashCommandBackground);
	color: var(--vscode-chat-slashCommandForeground);
	display: inline-flex;
	align-items: center;
	margin-right: 0.5ch;
	border-radius: 4px;
	padding: 0 0 0 3px;
}

.interactive-item-container .chat-agent-command > .monaco-button {
	display: flex;
	align-self: stretch;
	align-items: center;
	cursor: pointer;
	padding: 0 2px;
	margin-left: 2px;
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
}

.interactive-item-container .chat-agent-command > .monaco-button:hover {
	background: var(--vscode-toolbar-hoverBackground);
}

.interactive-item-container .chat-agent-widget .monaco-text-button {
	display: inline;
	border: none;
}

.interactive-session .checkpoint-file-changes-summary {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	align-items: center;
	border-radius: 4px;
	border: 1px solid var(--vscode-chat-requestBorder);

	.chat-view-changes-icon {
		padding: 3px;
		float: right;
		cursor: pointer;
	}

	.chat-view-changes-icon:hover {
		border-radius: 5px;
		background-color: var(--vscode-toolbar-hoverBackground);
	}

	.insertions-and-deletions {
		display: flex;
		margin-right: 5px;
		font-size: 12px;
	}

	.checkpoint-file-changes-summary-header {
		padding: 3px 3px 3px 3px;
		width: 100%;
		display: flex;
		box-sizing: border-box;
		justify-content: space-between;
	}

	.checkpoint-file-changes-summary-header .monaco-button-mdlabel {
		display: flex;
		width: 100%;
		text-align: left;
		align-items: center;
	}

	.checkpoint-file-changes-summary-header .chat-file-changes-label {
		width: 100%;
		float: left;
	}

	.checkpoint-file-changes-summary-header .chat-file-changes-label .monaco-button {
		width: 100%;
	}

	.checkpoint-file-changes-summary-header .chat-file-changes-label .monaco-button .codicon {
		font-size: 16px;
	}

	.chat-summary-list {
		width: 100%;
		max-width: 100%;
		padding: 0px;
		margin-bottom: 0px;
		border-bottom: 0px;
		border-left: 0px;
		border-right: 0px;
		box-sizing: border-box;
		border-radius: 0px;
	}

	.chat-summary-list .monaco-icon-label {
		display: flex;
	}

	.chat-summary-list .monaco-scrollable-element {
		border-radius: 4px;
	}

	.insertions {
		color: var(--vscode-chat-linesAddedForeground);
		font-weight: bold;
		padding-left: 5px;
		padding-right: 5px;
	}

	.deletions {
		color: var(--vscode-chat-linesRemovedForeground);
		font-weight: bold;
	}
}

.interactive-session .checkpoint-file-changes-summary.chat-file-changes-collapsed .chat-summary-list,
.interactive-session .chat-used-context.chat-used-context-collapsed .chat-used-context-list {
	display: none;
}

.interactive-session .chat-used-context {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.interactive-response-progress-tree,
.chat-notification-widget,
.chat-summary-list,
.chat-used-context-list,
.chat-quota-error-widget,
.chat-rate-limited-widget {
	border: 1px solid var(--vscode-chat-requestBorder);
	border-radius: 4px;
	margin-bottom: 8px;
}

.interactive-response-progress-tree,
.interactive-session .chat-summary-list,
.interactive-session .chat-used-context-list {
	padding: 4px 3px;

	.monaco-icon-label {
		padding: 0px 3px;
	}
}

.interactive-session .chat-editing-session-list {

	.monaco-icon-label {
		padding: 0px 3px;
	}

	.monaco-icon-label.excluded {
		color: var(--vscode-notificationsWarningIcon-foreground)
	}
}

.interactive-session .chat-editing-session-list.collapsed {
	display: none;
}

.interactive-session .chat-list-divider {
	display: flex;
	align-items: center;
	padding: 4px 3px 2px 3px;
	font-size: 11px;
	color: var(--vscode-descriptionForeground);
	gap: 8px;
	pointer-events: none;
	user-select: none;
}

.interactive-session .monaco-list .monaco-list-row:has(.chat-list-divider) {
	background-color: transparent !important;
	cursor: default;
}

.interactive-session .chat-list-divider .chat-list-divider-label {
	text-transform: uppercase;
	letter-spacing: 0.04em;
	flex-shrink: 0;
}

.interactive-session .chat-list-divider .chat-list-divider-line {
	flex: 1;
	height: 1px;
	background-color: var(--vscode-editorWidget-border, var(--vscode-contrastBorder));
	opacity: 0.5;
}

.interactive-session .chat-list-divider .chat-list-divider-toolbar {
	display: flex;
	align-items: center;
	pointer-events: auto;
}

.interactive-session .chat-summary-list .monaco-list .monaco-list-row {
	border-radius: 4px;
}

.interactive-session .chat-summary-list .monaco-list .monaco-list-row:hover {
	background-color: var(--vscode-list-hoverBackground) !important;
}

.interactive-session .chat-used-context-list .monaco-list .monaco-list-row {
	border-radius: 2px;
}

.interactive-session .chat-file-changes-label {
	color: var(--vscode-interactive-session-foreground);
	user-select: none;
}

.interactive-session .chat-used-context-label {
	font-size: var(--vscode-chat-font-size-body-s);
	font-family: var(--vscode-chat-font-family, inherit);
	color: var(--vscode-descriptionForeground);
	user-select: none;

	code {
		font-size: var(--vscode-chat-font-size-body-xs);
	}
}

.interactive-session .chat-file-changes-label:hover,
.interactive-session .chat-used-context-label:hover {
	opacity: unset;
}

.interactive-session .chat-file-changes-label .monaco-button,
.interactive-session .chat-used-context-label .monaco-button {
	width: fit-content;
	border: none;
	border-radius: 4px;
	gap: 4px;
	text-align: initial;
	justify-content: initial;
}

.interactive-session .chat-used-context-label .monaco-button {
	/* unset Button styles */
	display: inline-flex;
}

.interactive-session .chat-file-changes-label .monaco-button {
	padding: 2px 2px 2px 2px;
}

.interactive-session .chat-used-context-label .monaco-button {
	padding: 2px 6px 2px 2px;
}

.interactive-session .chat-file-changes-label .monaco-button:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.interactive-session .chat-used-context-label .monaco-button:hover {
	background-color: var(--vscode-list-hoverBackground);
	color: var(--vscode-foreground);

}

.interactive-session .chat-file-changes-label .monaco-text-button:focus,
.interactive-session .chat-used-context-label .monaco-text-button:focus {
	outline: none;
}

.interactive-session .chat-file-changes-label .monaco-text-button:focus-visible,
.interactive-session .chat-used-context-label .monaco-text-button:focus-visible {
	outline: 1px solid var(--vscode-focusBorder);
}

.interactive-session .chat-file-changes-label .monaco-button .codicon,
.interactive-session .chat-used-context-label .monaco-button .codicon {
	font-size: var(--vscode-chat-font-size-body-s);
	color: var(--vscode-icon-foreground) !important;
}

.interactive-item-container .progress-container {
	display: flex;
	align-items: center;
	gap: 7px;
	margin: 0 0 6px 4px;

	/* Tool calls transition from a progress to a collapsible list part, which needs to have this top padding.
	The working progress also can be replaced by a tool progress part. So align this padding so the text doesn't appear to shift. */
	padding-top: 2px;

	> .codicon[class*='codicon-'] {
		font-size: var(--vscode-chat-font-size-body-s);

		&::before {
			font-size: var(--vscode-chat-font-size-body-s);
		}
	}

	.codicon {
		/* Very aggressive list styles try to apply focus colors to every codicon in a list row. */
		color: var(--vscode-icon-foreground) !important;

		&.codicon-error {
			color: var(--vscode-editorError-foreground) !important;
		}
	}

	.rendered-markdown.progress-step {
		white-space: normal;

		& > p {
			color: var(--vscode-descriptionForeground);
			font-size: var(--vscode-chat-font-size-body-s);
			margin: 0;

			code {
				font-size: var(--vscode-chat-font-size-body-xs);
			}
		}

		.chat-inline-anchor-widget {
			display: inline;
		}
	}
}

.interactive-item-container .chat-command-button {
	display: flex;
	margin-bottom: 16px;
}

.interactive-item-container .chat-notification-widget {
	display: flex;
	align-items: center;
	flex-direction: row;
	padding: 8px 12px;
	gap: 6px;
}

.interactive-item-container .chat-confirmation-widget .interactive-result-code-block,
.interactive-item-container .chat-confirmation-widget .chat-attached-context {
	margin-bottom: 8px;
}

.interactive-item-container .chat-command-button .monaco-button .codicon {
	margin-left: 0;
	margin-top: 1px;
}

.chat-code-citation-label {
	opacity: 0.7;
	white-space: pre-wrap;
}

.chat-code-citation-button-container {
	display: inline;
}

.chat-code-citation-button-container .monaco-button {
	display: inline;
	border: none;
	padding: 0;
	color: var(--vscode-textLink-foreground);
}

.chat-attached-context-hover {
	padding: 0 6px;
}

.chat-attached-context-hover .chat-attached-context-image-container {
	padding: 6px 0 4px;
	height: auto;
	width: 100%;
	display: block;
}

.chat-attached-context-hover .chat-attached-context-image-container .chat-attached-context-image {
	width: 100%;
	height: 100%;
	object-fit: contain;
	display: block;
	max-height: 350px;
	max-width: 100%;
	min-width: 200px;
	min-height: 200px;

}

.chat-attached-context-hover .chat-attached-context-url {
	color: var(--vscode-textLink-foreground);
	cursor: pointer;
	margin-top: 4px;
	padding: 2px 0;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 100%;
	display: block;
}

.chat-attached-context-hover .chat-attached-context-url-separator {
	border-top: 1px solid var(--vscode-chat-requestBorder);
	left: 0;
	right: 0;
	position: absolute;
	margin-top: 2px;
}


.chat-attached-context-attachment .chat-attached-context-pill {
	font-size: 12px;
	display: inline-flex;
	align-items: center;
	padding: 2px 0 2px 0px;
	border-radius: 2px;
	margin-right: 1px;
	user-select: none;
	outline: none;
	border: none;
}

.chat-attached-context-attachment .attachment-additional-info {
	opacity: 0.7;
	font-size: .9em;
}

.chat-attached-context-attachment .chat-attached-context-pill-image {
	width: 14px;
	height: 14px;
	border-radius: 2px;
	object-fit: cover;
}

.chat-attached-context-attachment .chat-attached-context-custom-text {
	vertical-align: middle;
	user-select: none;
	outline: none;
	border: none;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;
	display: inline-block;
}

.chat-attached-context-attachment.show-file-icons.warning .chat-attached-context-custom-text {
	color: var(--vscode-notificationsWarningIcon-foreground);
	text-decoration: line-through;
}

.chat-attached-context-attachment.show-file-icons.partial-warning .chat-attached-context-custom-text {
	color: var(--vscode-notificationsWarningIcon-foreground);
}

.interactive-session .chat-scroll-down {
	display: none;
	position: absolute;
	bottom: 7px;
	right: 12px;
	border-radius: 100%;
	width: 27px;
	height: 27px;

	.codicon {
		margin: 0px;
	}
}

.interactive-session.show-scroll-down .chat-scroll-down {
	display: initial;
}

.chat-quota-error-widget,
.chat-rate-limited-widget {
	padding: 8px 12px;
	display: flex;
	gap: 6px;

	.monaco-button {
		width: fit-content;
		padding: 2px 11px;
	}

	.chat-quota-error-button,
	.chat-rate-limited-button {
		margin-top: 6px;
		margin-bottom: 2px;
	}

	.chat-quota-error-secondary-button {
		margin-top: 6px;
		padding: 0px;
		border: none;
	}

	.chat-quota-error-secondary-button,
	.chat-quota-wait-warning {
		font-size: 12px;
	}

	.chat-quota-wait-warning {
		margin-top: 2px;
	}

	.chat-quota-error-message,
	.chat-rate-limited-message {
		.rendered-markdown p {
			margin: 0px;
		}
	}
}

.hideSuggestTextIcons .suggest-widget .monaco-list .monaco-list-row .suggest-icon.codicon-symbol-text::before {
	display: none;
}

.interactive-session:not(.chat-widget > .interactive-session) {

	.interactive-item-container {
		padding: 5px 16px;
	}

	.interactive-item-container.interactive-request {
		align-items: flex-end;

	}

	.interactive-item-container.interactive-request:not(.editing):hover .request-hover {
		opacity: 1 !important;
	}

	.interactive-item-container.interactive-request.confirmation-message {
		align-items: flex-start;

		.checkpoint-container {
			display: none;
		}
	}

	.interactive-item-container.interactive-request .value .rendered-markdown {
		background-color: var(--vscode-chat-requestBubbleBackground);
		border-radius: 8px;
		padding: 8px 12px;
		max-width: 90%;
		margin-left: auto;
		width: fit-content;
		margin-bottom: 5px;
		position: relative;
	}

	.interactive-item-container.interactive-request .value .rendered-markdown {
		margin-left: auto;
	}

	.interactive-item-container.interactive-request .value .rendered-markdown.clickable:hover {
		cursor: pointer;
		background-color: var(--vscode-chat-requestBubbleHoverBackground);
	}

	.hc-black .interactive-item-container.interactive-request .value .rendered-markdown,
	.hc-light .interactive-item-container.interactive-request .value .rendered-markdown {
		border: 1px dotted var(--vscode-focusBorder);
	}

	.interactive-item-container.interactive-request .value .rendered-markdown > :last-child {
		margin-bottom: 0px;
	}

	.interactive-item-container.interactive-request .value > .rendered-markdown p {
		width: fit-content;
	}

	.interactive-item-container.interactive-request .chat-attached-context {
		max-width: 100%;
		width: fit-content;
		justify-content: flex-end;
		margin-left: auto;
		padding-bottom: 5px;
	}

	.interactive-request .header.header-disabled,
	.request-hover.has-no-actions,
	.request-hover.hidden,
	.request-hover.checkpoints-enabled.has-no-actions,
	.checkpoint-container.hidden,
	.checkpoint-restore-container.hidden {
		display: none;
	}

	.interactive-request .header.partially-disabled .avatar-container,
	.interactive-request .header.partially-disabled .username {
		display: none;
	}

	.interactive-request .header.partially-disabled .detail-container {
		margin-left: 4px;
	}

	.interactive-item-container .header .detail .codicon-check {
		margin-right: 7px;
		vertical-align: middle;
		font-size: 11px;
	}

	.request-hover {
		position: absolute;
		overflow: hidden;
		z-index: 100;
		background-color: var(--vscode-interactive-result-editor-background-color, var(--vscode-editor-background));
		border: 1px solid var(--vscode-chat-requestBorder);
		top: -13px;
		right: 20px;
		border-radius: 3px;
		width: 28px;
		height: 26px;
	}

	.request-hover.expanded:not(.checkpoints-enabled) {
		width: 50px;
	}

	.request-hover.checkpoints-enabled {
		top: 15px;
	}

	.request-hover.editing {
		opacity: 1 !important;
	}

	.request-hover:not(.expanded) .actions-container {
		width: 22px;
		height: 22px;
	}

	.request-hover.expanded .actions-container {
		padding: 0 3px;
	}

	.request-hover:not(.expanded) .actions-container {

		.action-label.codicon-discard,
		.action-label.codicon-x,
		.action-label.codicon-edit {
			margin-top: 4px;
			padding: 3px 3px;
		}
	}

	.request-hover:focus-within {
		opacity: 1 !important;
	}


	.checkpoint-container,
	.checkpoint-restore-container {
		display: flex;
		width: 100%;
		position: relative;

		.checkpoint-divider {
			border-top: 1px dashed var(--vscode-chat-checkpointSeparator);
			margin: 15px 0;
			width: 100%;
			height: 0;
		}

		.codicon-container {
			color: var(--vscode-descriptionForeground);
			padding-right: 4px;
			display: flex;
			align-items: center;
			gap: 4px;
		}

		.codicon-container .codicon {
			font-size: 14px;
			color: var(--vscode-chat-checkpointSeparator);
		}

		.monaco-toolbar {
			opacity: 0;
			height: fit-content;
			width: fit-content;
			user-select: none;
			position: absolute;
			top: 4px;
			margin-left: 25px;
			background: var(--vscode-sideBar-background);
		}

		.monaco-toolbar .action-label {
			border: 1px solid var(--vscode-chat-requestBorder, var(--vscode-input-background));
			padding: 1px 5px;
			background-color: var(--vscode-sideBar-background);
		}
	}

	.checkpoint-restore-container {
		margin-top: 10px;

		.checkpoint-label-text {
			font-size: 12px;
			color: var(--vscode-descriptionForeground);
			background-color: var(--vscode-sideBar-background);
			padding: 4px;
			display: flex;
			align-items: center;
			gap: 4px;
			position: absolute;
			margin-left: 71px;
			margin-top: 2px;
		}
	}

	.checkpoint-container .monaco-toolbar:focus-within,
	.checkpoint-restore-container .monaco-toolbar,
	.interactive-item-container.interactive-request:not(.editing):hover .checkpoint-container .monaco-toolbar {
		opacity: 1;
	}

	.interactive-item-container.interactive-request.editing .checkpoint-container {
		display: none;
	}

	.interactive-list > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row {
		overflow: visible !important;
	}

	.interactive-list > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.monaco-list-row.focused.request {
		outline: none !important;
	}

	div[data-index="0"] .monaco-tl-contents {
		.interactive-item-container.interactive-request:not(.editing) {
			padding-top: 19px;
		}

		.request-hover {
			top: 0px;
		}

		.checkpoint-container {
			display: none;
		}
	}

	.interactive-list > .monaco-list:focus > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused.request {
		outline: none !important;

		.interactive-item-container .value .rendered-markdown {
			outline: 1px solid var(--vscode-focusBorder);
		}

		.request-hover:not(.has-no-actions) {
			display: block;
		}
	}

	.interactive-request.editing .rendered-markdown,
	.interactive-request.editing .value {
		display: none;
	}

	.interactive-request.editing-input .rendered-markdown {
		outline: 1px solid var(--vscode-focusBorder);
	}

	.interactive-request.editing {
		padding: 0px;

		.interactive-input-part .chat-input-container .interactive-input-editor .monaco-editor .native-edit-context {
			opacity: 0;
		}
	}
}

.editor-instance .interactive-session .interactive-item-container.interactive-response .checkpoint-restore-container {

	.checkpoint-label-text,
	.monaco-toolbar {
		background-color: var(--vscode-editor-background);
	}
}

.chat-buttons-container {
	display: flex;
	gap: 8px;
	margin-top: 0px;
	flex-wrap: wrap;
	flex-basis: 100%;
	padding: 0 8px;
	margin: 8px 0;

	& .monaco-button.monaco-dropdown-button {
		padding: 0 3px;
	}
}

.interactive-item-container .chat-command-button .monaco-button,
.chat-buttons-container .monaco-button:not(.monaco-dropdown-button) {
	text-align: left;
	width: initial;
	padding: 4px 8px;
}

.interactive-item-container .chat-edit-input-container {
	width: 100%;
}

.chat-row-disabled-overlay,
.interactive-item-container .chat-edit-input-container .chat-editing-session {
	display: none;
}

.chat-row-disabled-overlay.disabled,
.chat-input-overlay.disabled {
	position: absolute;
	inset: 0;
	background-color: var(--vscode-sideBar-background);
	opacity: 0.6;
	display: flex;
	z-index: 101;
	user-select: none;
	cursor: default;
}

.interactive-session .focused-input-dom {
	position: absolute;
	top: -50000px;
	width: 1px;
	height: 1px;
}


.interactive-session .chat-attached-context .chat-attached-context-attachment.implicit.disabled:hover {
	cursor: pointer;
	border-style: solid;
	background-color: var(--vscode-toolbar-hoverBackground);
}

/* Chat Suggest Next Widget */
/* Suggested Actions widget - reuses chat-welcome-view-suggested-prompts styling */

.interactive-session > .chat-suggest-next-widget {
	/* Override positioning from welcome view styles (relative instead of absolute) */
	position: relative;
	bottom: auto;
	left: auto;
	right: auto;
	margin: 0 0 0 0;
	/* Keep standard padding with space for title */
	padding: 32px 16px 8px 16px;
	/* Left align buttons to match standard welcome view */
	justify-content: flex-start;
	/* Ensure flex layout is properly applied */
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.chat-welcome-view-suggested-prompt.chat-suggest-next-has-dropdown {
	padding-right: 12px;
}

/* Dropdown container for chevron in suggested prompt buttons - provides larger hit area */
.chat-welcome-view-suggested-prompt > .chat-suggest-next-dropdown {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	margin: -1px -8px -1px 0; /* Extend to button edge, accounting for button padding */
	padding: 0 4px 0 2px;
	gap: 4px;
	cursor: pointer;
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
	box-sizing: border-box;
}

.chat-welcome-view-suggested-prompt > .chat-suggest-next-dropdown:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.chat-welcome-view-suggested-prompt > .chat-suggest-next-dropdown:focus {
	outline: 1px solid var(--vscode-focusBorder);
	outline-offset: -1px;
}

/* Chevron icon in dropdown container */
.chat-welcome-view-suggested-prompt .codicon-chevron-down.dropdown-chevron {
	font-size: 12px;
	opacity: 0.7;
	flex-shrink: 0;
}

.chat-welcome-view-suggested-prompt > .chat-suggest-next-dropdown:hover .dropdown-chevron,
.chat-welcome-view-suggested-prompt > .chat-suggest-next-dropdown:focus .dropdown-chevron {
	opacity: 1;
}

/* Vertical separator between label and chevron in suggested next actions */
.chat-suggest-next-dropdown > .chat-suggest-next-separator {
	width: 1px;
	height: 16px;
	background-color: currentColor;
	opacity: 0.5;
	border-radius: 1px;
	align-self: center;
	flex-shrink: 0;
}

/* Show more attachments button styling */
.chat-attachments-show-more-button {
	opacity: 0.8;
	transition: opacity 0.2s ease;
}

.chat-attachments-show-more-button:hover {
	opacity: 1;
	background-color: var(--vscode-list-hoverBackground) !important;
}

.chat-attachments-show-more-button:focus {
	outline: 1px solid var(--vscode-focusBorder);
	outline-offset: -1px;
}

.chat-attachments-show-more-button .chat-attached-context-custom-text {
	font-style: italic;
	color: var(--vscode-descriptionForeground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/media/chatAgentHover.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/media/chatAgentHover.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.chat-agent-hover {
	line-height: unset;
	padding: 6px 0px;
}

.chat-agent-hover-header {
	display: flex;
	gap: 8px;
	margin-bottom: 4px;
}

.chat-agent-hover-icon img,
.chat-agent-hover-icon .codicon {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	outline: 1px solid var(--vscode-chat-requestBorder);
}

.chat-agent-hover .chat-agent-hover-icon .codicon {
	font-size: 23px !important; /* Override workbench hover styles */
	display: flex;
	justify-content: center;
	align-items: center;
}

.chat-agent-hover-publisher {
	display: flex;
	gap: 4px;
}

.chat-agent-hover .chat-agent-hover-publisher .codicon.codicon-extensions-verified-publisher {
	color: var(--vscode-extensionIcon-verifiedForeground);
}

.chat-agent-hover .extension-verified-publisher {
	display: none;
}

.chat-agent-hover.verifiedPublisher .extension-verified-publisher {
	display: flex;
	align-items: start;
	margin-top: 1px;
}

.chat-agent-hover .chat-agent-hover-warning .codicon {
	color: var(--vscode-notificationsWarningIcon-foreground) !important;
	margin-right: 3px;
}

.chat-agent-hover.allowedName .chat-agent-hover-warning {
	display: none;
}

.chat-agent-hover-header .chat-agent-hover-name {
	font-size: 14px;
	font-weight: 600;
}

.chat-agent-hover-header .chat-agent-hover-details {
	font-size: 12px;
}

.chat-agent-hover-extension {
	display: flex;
	gap: 6px;
	color: var(--vscode-descriptionForeground);
}

.chat-agent-hover.noExtensionName .chat-agent-hover-separator,
.chat-agent-hover.noExtensionName .chat-agent-hover-extension-name {
	display: none;
}

.chat-agent-hover-separator {
	opacity: 0.7;
}

.chat-agent-hover-description,
.chat-agent-hover-warning {
	font-size: 13px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/media/chatCodeBlockPill.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/media/chatCodeBlockPill.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.interactive-item-container.interactive-response .value .chat-markdown-part.rendered-markdown .code:has(.chat-codeblock-pill-container) {
	margin-bottom: 8px;
}

.chat-markdown-part.rendered-markdown .code .chat-codeblock-pill-container {
	display: flex;
	align-items: center;
	gap: 5px;
	margin: 0 0 6px 4px;
	font-size: var(--vscode-chat-font-size-body-s);
	color: var(--vscode-descriptionForeground);

	.status-indicator-container {
		display: flex;
		align-items: center;
		gap: 7px;
		flex-shrink: 0;

		.status-icon {
			display: inline-flex;
			align-items: center;
			line-height: 1em;
			top: 1px;
			color: var(--vscode-icon-foreground) !important;

			&::before {
				font-size: var(--vscode-chat-font-size-body-s);
			}
		}

		.status-label {
			color: var(--vscode-descriptionForeground);
			white-space: nowrap;
		}
	}

	.chat-codeblock-pill-widget {
		border: 1px solid var(--vscode-chat-requestBorder, var(--vscode-input-background, transparent));
		border-radius: 4px;
		text-wrap: nowrap;
		width: fit-content;
		font-weight: normal;
		text-decoration: none;
		padding: 1px 3px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		line-height: 1em;

		.progress-fill {
			display: none;
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 0%;
			background-color: var(--vscode-list-hoverBackground);
			pointer-events: none;
			transition: width 0.2s ease-out;
			z-index: 0;
		}

		&.progress-filling .progress-fill {
			display: block;
		}

		.icon, .icon-label, .label-detail, span.label-added, span.label-removed {
			position: relative;
			z-index: 1;
		}

		.icon {
			vertical-align: middle;
			line-height: 1em;
			overflow: hidden;
			font-size: 90%;
			top: 1px;
		}

		.icon-label {
			padding: 0px 3px;
			text-wrap: wrap;
			vertical-align: middle;
			line-height: 1em;
		}

		.icon::before {
			display: inline-block;
			line-height: 100%;
			overflow: hidden;
			background-size: contain;
			background-position: center;
			background-repeat: no-repeat;
			font-size: 100% !important;
			margin-bottom: 1px;
		}

		span.label-detail {
			padding-left: 4px;
			font-style: italic;
			font-size: var(--vscode-chat-font-size-body-s);
			color: var(--vscode-descriptionForeground);

			&:empty {
				display: none;
			}
		}

		span.label-added, span.label-removed {
			padding-left: 4px;
			font-size: var(--vscode-chat-font-size-body-s);
			vertical-align: middle;
			line-height: 1em;

			&:empty {
				padding: 0;
			}
		}

		span.label-removed {
			padding-right: 2px;
			color: var(--vscode-chat-linesRemovedForeground);
		}

		span.label-added {
			color: var(--vscode-chat-linesAddedForeground);
		}

		&:hover {
			background-color: var(--vscode-list-hoverBackground);
			color: var(--vscode-textLink-foreground);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/media/chatEditingEditorOverlay.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/media/chatEditingEditorOverlay.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.chat-editor-overlay-widget {
	padding: 2px;
	color: var(--vscode-button-foreground);
	background-color: var(--vscode-button-background);
	border-radius: 2px;
	border: 1px solid var(--vscode-contrastBorder);
	display: flex;
	align-items: center;
	z-index: 10;
	box-shadow: 0 2px 8px var(--vscode-widget-shadow);
	overflow: hidden;
}

@keyframes pulse {
	0% {
		box-shadow: 0 2px 8px 0 var(--vscode-widget-shadow);
	}
	50% {
		box-shadow: 0 2px 8px 4px var(--vscode-widget-shadow);
	}
	100% {
		box-shadow: 0 2px 8px 0 var(--vscode-widget-shadow);
	}
}

.chat-editor-overlay-widget.busy {
	animation: pulse ease-in 2.3s infinite;
}

.chat-editor-overlay-widget .chat-editor-overlay-progress {
	align-items: center;
	display: none;
	padding: 5px 0 5px 5px;
	font-size: 12px;
	overflow: hidden;
	gap: 6px;
}

.chat-editor-overlay-widget.busy .chat-editor-overlay-progress {
	display: inline-flex;
}

.chat-editor-overlay-widget .chat-editor-overlay-progress .progress-message {
	white-space: nowrap;
	max-width: 13em;
	overflow: hidden;
	text-overflow: ellipsis;
	padding-right: 8px;
}

.chat-editor-overlay-widget .action-item > .action-label {
	padding: 5px;
	font-size: 12px;
	border-radius: 2px; /* same as overlay widget */
}


.chat-editor-overlay-widget .action-item:first-child > .action-label {
	padding-left: 7px;
}

.chat-editor-overlay-widget .action-item:last-child > .action-label {
	padding-right: 7px;
}

.chat-editor-overlay-widget.busy .chat-editor-overlay-progress .codicon,
.chat-editor-overlay-widget .action-item > .action-label.codicon {
	color: var(--vscode-button-foreground);
}

.chat-diff-change-content-widget .monaco-action-bar .action-item.disabled,
.chat-editor-overlay-widget .monaco-action-bar .action-item.disabled {

	> .action-label.codicon::before,
	> .action-label.codicon,
	> .action-label,
	> .action-label:hover {
		color: var(--vscode-button-separator);
		opacity: 1;
	}
}

.chat-diff-change-content-widget .action-item > .action-label {
	border-radius: 2px; /* same as overlay widget */
}


.chat-editor-overlay-widget .action-item.label-item {
	font-variant-numeric: tabular-nums;
}

.chat-editor-overlay-widget .monaco-action-bar .action-item.label-item > .action-label,
.chat-editor-overlay-widget .monaco-action-bar .action-item.label-item > .action-label:hover {
	color: var(--vscode-button-foreground);
	opacity: 1;
}

.chat-editor-overlay-widget .action-item.auto {
	position: relative;
	overflow: hidden;
}

.chat-editor-overlay-widget .action-item.auto::before {
	content: '';
	position: absolute;
	top: 0;
	left: var(--vscode-action-item-auto-timeout, -100%);
	width: 100%;
	height: 100%;
	background-color: var(--vscode-toolbar-hoverBackground);
	transition: left 0.5s linear;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/media/chatEditorController.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/media/chatEditorController.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.chat-diff-change-content-widget {
	opacity: 0;
	transition: opacity 0.2s ease-in-out;
	display: flex;
	box-shadow: 0 2px 8px var(--vscode-widget-shadow);
}

.chat-diff-change-content-widget.hover {
	opacity: 1;
}

.chat-diff-change-content-widget .monaco-action-bar {
	padding: 2px;
	border-radius: 2px;
	background-color: var(--vscode-button-background);
	color: var(--vscode-button-foreground);
	border: 1px solid var(--vscode-contrastBorder);
}

.chat-diff-change-content-widget .monaco-action-bar .action-item .action-label {
	border-radius: 2px;
	color: var(--vscode-button-foreground);
	padding: 2px 5px;
}

.chat-diff-change-content-widget .monaco-action-bar .action-item .action-label.codicon {
	width: unset;
	padding: 2px;
	font-size: 16px;
	line-height: 16px;
	color: var(--vscode-button-foreground);
}

.chat-diff-change-content-widget .monaco-action-bar .action-item .action-label.codicon[class*='codicon-'] {
	font-size: 16px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/media/chatInlineAnchorWidget.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/media/chatInlineAnchorWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.chat-inline-anchor-widget {
	border: 1px solid var(--vscode-chat-requestBorder, var(--vscode-input-background, transparent));
	border-radius: 4px;
	margin: 0 1px;
	padding: 1px 3px;
	text-wrap: nowrap;
	width: fit-content;
	font-weight: normal;
	text-decoration: none;
}

.chat-inline-anchor-widget .icon-label {
	padding: 0 3px;
	text-wrap: wrap;

	.label-suffix {
		color: var(--vscode-peekViewTitleDescription-foreground);
	}
}

.chat-inline-anchor-widget:hover .icon-label .label-suffix  {
	color: currentColor
}

.interactive-item-container .value .rendered-markdown .chat-inline-anchor-widget {
	color: inherit;
}

.chat-inline-anchor-widget:hover {
	background-color: var(--vscode-list-hoverBackground);
}

.chat-inline-anchor-widget .icon {
	vertical-align: middle;
	line-height: 1em;
	font-size: 90% !important;
	overflow: hidden;

	top: 0 !important;
}

.show-file-icons.chat-inline-anchor-widget .icon::before {
	display: inline-block;
	line-height: 100%;
	overflow: hidden;
	font-size: 100% !important;

	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;

	padding: 0 !important;
	margin-bottom: 1px;

	flex-shrink: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/media/chatStatusWidget.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/media/chatStatusWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.interactive-session .interactive-input-part > .chat-input-widgets-container .chat-status-widget {
	padding: 6px 3px 6px 3px;
	box-sizing: border-box;
	border: 1px solid var(--vscode-input-border, transparent);
	background-color: var(--vscode-editor-background);
	border-bottom: none;
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
}

.interactive-session .interactive-input-part > .chat-input-widgets-container .chat-status-widget .chat-status-content {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
	padding-left: 8px;
}

.interactive-session .interactive-input-part > .chat-input-widgets-container .chat-status-widget .chat-status-message {
	font-size: 11px;
	line-height: 16px;
	color: var(--vscode-foreground);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.interactive-session .interactive-input-part > .chat-input-widgets-container .chat-status-widget .chat-status-action {
	flex-shrink: 0;
	padding-right: 4px;
}

.interactive-session .interactive-input-part > .chat-input-widgets-container .chat-status-widget .chat-status-button {
	font-size: 11px;
	padding: 2px 8px;
	min-width: unset;
	height: 22px;
}

.interactive-session .interactive-input-part > .chat-input-widgets-container:has(.chat-status-widget:not([style*="display: none"])) + .chat-todo-list-widget-container .chat-todo-list-widget {
	border-top-left-radius: 0;
	border-top-right-radius: 0;
}

.interactive-session .interactive-input-part > .chat-input-widgets-container:has(.chat-status-widget:not([style*="display: none"])) + .chat-todo-list-widget-container:not(:has(.chat-todo-list-widget.has-todos)) + .chat-editing-session .chat-editing-session-container {
	border-top-left-radius: 0;
	border-top-right-radius: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/media/chatViewPane.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/media/chatViewPane.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Overall styles */
.chat-viewpane {
	display: flex;
	flex-direction: column;

	.chat-controls-container {
		display: flex;
		flex-direction: column;
		flex: 1;
		height: 100%;
		min-height: 0;
		min-width: 0;

		.interactive-session {

			/* needed so that the chat welcome and chat input does not overflow and input grows over welcome */
			width: 100%;
			min-height: 0;
			min-width: 0;
		}
	}

	&:not(.chat-view-welcome-enabled) {

		.interactive-session {

			/* hide most welcome pieces (except suggested actions) when we show recent sessions to make some space */
			.chat-welcome-view .chat-welcome-view-icon,
			.chat-welcome-view .chat-welcome-view-title,
			.chat-welcome-view .chat-welcome-view-message,
			.chat-welcome-view .chat-welcome-view-disclaimer,
			.chat-welcome-view .chat-welcome-view-tips {
				visibility: hidden;
			}
		}
	}
}

/* Sessions control: either sidebar or stacked */
.chat-viewpane.has-sessions-control .agent-sessions-container {
	display: flex;
	flex-direction: column;

	.agent-sessions-title-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;

		.agent-sessions-title {
			cursor: pointer;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.agent-sessions-toolbar {

		.action-item {
			/* align with the title actions*/
			margin-right: 4px;
		}

		&.filtered .action-label.codicon.codicon-filter {
			/* indicate when sessions filter is enabled */
			border-color: var(--vscode-inputOption-activeBorder);
			color: var(--vscode-inputOption-activeForeground);
			background-color: var(--vscode-inputOption-activeBackground);
		}
	}

	.agent-sessions-link-container {
		padding: 8px 0;
		font-size: 12px;
		text-align: center;
	}

	.agent-sessions-link-container a {
		color: var(--vscode-descriptionForeground);
	}

	.agent-sessions-link-container a:hover,
	.agent-sessions-link-container a:active {
		text-decoration: none;
		color: var(--vscode-textLink-foreground);
	}
}

/* Sessions control: stacked */
.chat-viewpane.has-sessions-control.sessions-control-orientation-stacked {

	.agent-sessions-container {
		border-bottom: 1px solid var(--vscode-panel-border);
	}
}

/* Sessions control: side by side */
.chat-viewpane.has-sessions-control.sessions-control-orientation-sidebyside {

	&.chat-view-position-left {
		flex-direction: row;

		.agent-sessions-container {
			border-right: 1px solid var(--vscode-panel-border);
		}
	}

	&.chat-view-position-right {
		flex-direction: row-reverse;

		.agent-sessions-container {
			border-left: 1px solid var(--vscode-panel-border);
		}
	}

	.agent-sessions-link-container {
		/* hide link to show more when side by side */
		display: none;
	}
}

/*
 * Padding rules for agent sessions elements based on:
 * - orientation (stacked vs sidebyside)
 * - view position (left vs right)
 * - activity bar location (default vs other for auxiliarybar)
 */
.chat-viewpane.has-sessions-control {

	/* Base padding: left-aligned content */
	.agent-sessions-title-container {
		padding: 0 8px 0 20px;
	}

	.agent-session-section {
		padding: 0 12px 0 20px;
	}

	/* Right position: symmetric padding */
	&.sessions-control-orientation-sidebyside.chat-view-position-right {

		.agent-sessions-title-container {
			padding: 0 8px;
		}

		.agent-session-section {
			padding: 0 12px 0 8px;
		}
	}

	/* Auxiliarybar with non-default activity bar: tighter title padding */
	&.activity-bar-location-other.chat-view-location-auxiliarybar {

		.agent-sessions-title-container {
			padding-right: 4px;
		}

		/* Right position needs adjusted left padding too */
		&.sessions-control-orientation-sidebyside.chat-view-position-right {

			.agent-sessions-title-container,
			.agent-session-section {
				padding-left: 8px;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/media/chatViewTitleControl.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/media/chatViewTitleControl.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.chat-viewpane {

	.chat-view-title-container {
		display: none;
		align-items: center;
		cursor: pointer;

		.chat-view-title-navigation-toolbar {
			overflow: hidden;

			.chat-view-title-action-item {
				flex: 1 1 auto;
				min-width: 0;

				.chat-view-title-label-container {
					display: flex;
					gap: 4px;
				}
			}
		}

		.chat-view-title-label {
			text-transform: uppercase;
			font-size: 11px;
			font-weight: 700;
			line-height: 16px;
			display: block;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			min-width: 0;
		}

		.chat-view-title-actions-toolbar {
			margin-left: auto;
			padding-left: 4px;
		}
	}

	.chat-view-title-container.visible {
		display: flex;
	}
}

/*
 * Below is a very complicated set of CSS rules that try to align the
 * chat title to the surrounding elements depending on:
 * - the activity bar position
 * - the chat view container (sidebar, panel, auxiliarybar)
 * - the container orientation (left, right)
 * - the visibility of side by side
 */
.chat-viewpane {

	/* Default padding for all view locations */
	&.chat-view-location-sidebar,
	&.chat-view-location-panel,
	&.chat-view-location-auxiliarybar {
		.chat-view-title-container {
			padding: 0 12px 0 16px;
		}
	}

	/* Auxiliarybar with non-default activity bar position */
	&.activity-bar-location-other.chat-view-location-auxiliarybar {
		.chat-view-title-container {
			padding: 0 8px 0 16px;
		}
	}

	/* Side-by-side sessions: left position (any activity bar) */
	&.has-sessions-control.sessions-control-orientation-sidebyside.chat-view-position-left {
		.chat-view-title-container {
			padding: 0 8px;
		}
	}

	/* Side-by-side sessions: right position (default activity bar only) */
	&.activity-bar-location-default.has-sessions-control.sessions-control-orientation-sidebyside.chat-view-position-right {
		.chat-view-title-container {
			padding: 0 8px 0 16px;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/media/chatViewWelcome.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/media/chatViewWelcome.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.pane-body.chat-view-welcome-visible {

	& > .interactive-session {
		display: none;
	}

	& > .chat-view-welcome {
		display: flex;
	}
}

/* Chat welcome container */
.interactive-session .chat-welcome-view-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	flex: 1;
	position: relative; /* Allow absolute positioning of prompts */
}

/* Container for ChatViewPane welcome view */
.pane-body > .chat-view-welcome {
	flex-direction: column;
	justify-content: center;
	overflow: hidden;
	height: 100%;
	display: none;
}

div.chat-welcome-view {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 12px;

	& > .chat-welcome-view-icon {
		min-height: 48px;
	}

	& > .chat-welcome-view-icon .codicon {
		font-size: 40px;
	}

	& > .chat-welcome-view-icon.custom-icon {
		mask-size: 40px;
		-webkit-mask-size: 40px;
	}

	& > .chat-welcome-view-icon.large-icon {
		min-width: 72px;
		min-height: 72px;
	}

	& > .chat-welcome-view-icon.large-icon .codicon {
		font-size: 72px;
		width: 72px;
		height: 72px;
	}

	& > .chat-welcome-view-icon.large-icon.custom-icon {
		mask-size: 72px !important;
		-webkit-mask-size: 72px !important;
		width: 72px;
		height: 72px;
	}

	& > .chat-welcome-view-title {
		font-size: 24px;
		margin-top: 5px;
		text-align: center;
		line-height: normal;
		padding: 0 8px;
	}

	& > .chat-welcome-view-message {
		position: relative;
		text-align: center;
		max-width: 100%;
		padding: 0 20px;
		margin: 0 auto;
		color: var(--vscode-input-placeholderForeground);

		a {
			color: var(--vscode-textLink-foreground);
		}

		a:focus {
			outline: 1px solid var(--vscode-focusBorder);
		}

		p {
			margin-top: 8px;
			margin-bottom: 8px;
		}
	}

	.monaco-button {
		display: inline-block;
		width: initial;
		padding: 4px 7px;
	}

	& > .chat-welcome-view-tips {
		max-width: 250px;
		margin: 10px 5px 0px;

		.rendered-markdown {
			gap: 6px;
			display: flex;
			align-items: start;
			flex-direction: column;
		}

		.rendered-markdown p {
			display: flex;
			gap: 6px;
			margin: 6px 0 0 0;

			.codicon {
				padding-top: 1px;
			}
		}
	}

	& > .chat-welcome-view-disclaimer {
		color: var(--vscode-input-placeholderForeground);
		text-align: center;
		margin: -16px auto;
		max-width: 400px;
		padding: 0 12px;

		a {
			color: var(--vscode-textLink-foreground);
		}

		a:focus {
			outline: 1px solid var(--vscode-focusBorder);
		}
	}
}

/* Suggested prompts section - positioned at bottom of welcome container */
.chat-welcome-view-suggested-prompts {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	gap: 8px;
	/* Extra top padding for title */
	padding: 32px 16px 8px 16px;
	/* Avoids bleeding into other content since we use absolute positioning */
	background: var(--vscode-chat-list-background);

	.chat-welcome-view-suggested-prompts-title {
		position: absolute;
		top: 8px;
		left: 16px;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--vscode-descriptionForeground);
		margin: 0;
		text-align: left;
	}

	> .chat-welcome-view-suggested-prompt {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 24px;
		padding: 0 8px;
		border-radius: 4px;
		background-color: var(--vscode-editorWidget-background);
		cursor: pointer;
		border: 1px solid var(--vscode-chat-requestBorder, var(--vscode-input-background, transparent));
		width: fit-content;
		margin: 0;
		box-sizing: border-box;
		flex: 0 0 auto;

		& > .chat-welcome-view-suggested-prompt-title {
			font-size: 13px;
			color: var(--vscode-editorWidget-foreground);
			white-space: nowrap;
		}

		& > .chat-welcome-view-suggested-prompt-description {
			font-size: 13px;
			color: var(--vscode-descriptionForeground);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			flex: 0 1 auto;
			min-width: 0;
		}
	}

	> .chat-welcome-view-suggested-prompt:hover {
		background-color: var(--vscode-list-hoverBackground);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/media/simpleBrowserOverlay.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/media/simpleBrowserOverlay.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.element-selection-message,
.connecting-webview-element {
	position: absolute;
	bottom: 10px;
	right: 10px;
	padding: 0px 10px;
	background: var(--vscode-notifications-background);
	color: var(--vscode-notifications-foreground);
	border-radius: 4px;
	font-size: 12px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	display: flex;
	align-items: center;
	gap: 8px;
	width: max-content;
	z-index: 1;
	height: 42px;
}

.connecting-webview-element {
	bottom: 15px;
	right: 15px;
}

.element-selection-main-content,
.element-expand-container {
	display: flex;
	align-items: center;
	gap: 8px;
}

.element-selection-cancel {
	padding: 2px 8px;
	width: fit-content;
}

.element-selection-main-content .monaco-button-dropdown > .monaco-button.monaco-text-button {
	height: 24px;
	align-content: center;
	padding: 0px 5px;
}

.element-selection-main-content .monaco-button.codicon.codicon-close,
.element-expand-container .monaco-button.codicon.codicon-layout,
.element-selection-main-content .monaco-button.codicon.codicon-chevron-right,
.element-selection-main-content .monaco-button.codicon.codicon-gear {
	width: 17px;
	height: 17px;
	padding: 2px 2px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	color: var(--vscode-descriptionForeground);
	border: none;
	outline: none;
	padding: 0;
	border-radius: 5px;
	cursor: pointer;
}

.element-selection .monaco-button {
	height: 17px;
	width: fit-content;
	padding: 2px 6px;
	font-size: 11px;
	background-color: var(--vscode-button-background);
	border: 1px solid var(--vscode-button-border);
	color: var(--vscode-button-foreground);
}

.element-selection-main-content .monaco-button:hover,
.element-expand-container .monaco-button:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.element-selection-main-content .hidden,
.element-expand-container.hidden,
.element-selection-main-content.hidden {
	display: none !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/modelPicker/modelPickerActionItem.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/modelPicker/modelPickerActionItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../../../../base/common/actions.js';
import { Event } from '../../../../../base/common/event.js';
import { ILanguageModelChatMetadataAndIdentifier } from '../../common/languageModels.js';
import { localize } from '../../../../../nls.js';
import * as dom from '../../../../../base/browser/dom.js';
import { renderIcon, renderLabelWithIcons } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { IDisposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { ActionWidgetDropdownActionViewItem } from '../../../../../platform/actions/browser/actionWidgetDropdownActionViewItem.js';
import { IActionWidgetService } from '../../../../../platform/actionWidget/browser/actionWidget.js';
import { IActionWidgetDropdownAction, IActionWidgetDropdownActionProvider, IActionWidgetDropdownOptions } from '../../../../../platform/actionWidget/browser/actionWidgetDropdown.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ChatEntitlement, IChatEntitlementService } from '../../../../services/chat/common/chatEntitlementService.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { DEFAULT_MODEL_PICKER_CATEGORY } from '../../common/modelPicker/modelPickerWidget.js';
import { IActionProvider } from '../../../../../base/browser/ui/dropdown/dropdown.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { MANAGE_CHAT_COMMAND_ID } from '../../common/constants.js';
import { TelemetryTrustedValue } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';

export interface IModelPickerDelegate {
	readonly onDidChangeModel: Event<ILanguageModelChatMetadataAndIdentifier>;
	getCurrentModel(): ILanguageModelChatMetadataAndIdentifier | undefined;
	setModel(model: ILanguageModelChatMetadataAndIdentifier): void;
	getModels(): ILanguageModelChatMetadataAndIdentifier[];
}

type ChatModelChangeClassification = {
	owner: 'lramos15';
	comment: 'Reporting when the model picker is switched';
	fromModel?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The previous chat model' };
	toModel: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The new chat model' };
};

type ChatModelChangeEvent = {
	fromModel: string | TelemetryTrustedValue<string> | undefined;
	toModel: string | TelemetryTrustedValue<string>;
};


function modelDelegateToWidgetActionsProvider(delegate: IModelPickerDelegate, telemetryService: ITelemetryService): IActionWidgetDropdownActionProvider {
	return {
		getActions: () => {
			const models = delegate.getModels();
			if (models.length === 0) {
				// Show a fake "Auto" entry when no models are available
				return [{
					id: 'auto',
					enabled: true,
					checked: true,
					category: DEFAULT_MODEL_PICKER_CATEGORY,
					class: undefined,
					tooltip: localize('chat.modelPicker.auto', "Auto"),
					label: localize('chat.modelPicker.auto', "Auto"),
					run: () => { }
				} satisfies IActionWidgetDropdownAction];
			}
			return models.map(model => {
				return {
					id: model.metadata.id,
					enabled: true,
					icon: model.metadata.statusIcon,
					checked: model.identifier === delegate.getCurrentModel()?.identifier,
					category: model.metadata.modelPickerCategory || DEFAULT_MODEL_PICKER_CATEGORY,
					class: undefined,
					description: model.metadata.detail,
					tooltip: model.metadata.tooltip ?? model.metadata.name,
					label: model.metadata.name,
					run: () => {
						const previousModel = delegate.getCurrentModel();
						telemetryService.publicLog2<ChatModelChangeEvent, ChatModelChangeClassification>('chat.modelChange', {
							fromModel: previousModel?.metadata.vendor === 'copilot' ? new TelemetryTrustedValue(previousModel.identifier) : 'unknown',
							toModel: model.metadata.vendor === 'copilot' ? new TelemetryTrustedValue(model.identifier) : 'unknown'
						});
						delegate.setModel(model);
					}
				} satisfies IActionWidgetDropdownAction;
			});
		}
	};
}

function getModelPickerActionBarActionProvider(commandService: ICommandService, chatEntitlementService: IChatEntitlementService, productService: IProductService): IActionProvider {

	const actionProvider: IActionProvider = {
		getActions: () => {
			const additionalActions: IAction[] = [];
			if (
				chatEntitlementService.entitlement === ChatEntitlement.Free ||
				chatEntitlementService.entitlement === ChatEntitlement.Pro ||
				chatEntitlementService.entitlement === ChatEntitlement.ProPlus ||
				chatEntitlementService.isInternal
			) {
				additionalActions.push({
					id: 'manageModels',
					label: localize('chat.manageModels', "Manage Models..."),
					enabled: true,
					tooltip: localize('chat.manageModels.tooltip', "Manage Language Models"),
					class: undefined,
					run: () => {
						commandService.executeCommand(MANAGE_CHAT_COMMAND_ID);
					}
				});
			}

			// Add sign-in / upgrade option if entitlement is anonymous / free / new user
			const isNewOrAnonymousUser = !chatEntitlementService.sentiment.installed ||
				chatEntitlementService.entitlement === ChatEntitlement.Available ||
				chatEntitlementService.anonymous ||
				chatEntitlementService.entitlement === ChatEntitlement.Unknown;
			if (isNewOrAnonymousUser || chatEntitlementService.entitlement === ChatEntitlement.Free) {
				additionalActions.push({
					id: 'moreModels',
					label: isNewOrAnonymousUser ? localize('chat.moreModels', "Add Language Models") : localize('chat.morePremiumModels', "Add Premium Models"),
					enabled: true,
					tooltip: isNewOrAnonymousUser ? localize('chat.moreModels.tooltip', "Add Language Models") : localize('chat.morePremiumModels.tooltip', "Add Premium Models"),
					class: undefined,
					run: () => {
						const commandId = isNewOrAnonymousUser ? 'workbench.action.chat.triggerSetup' : 'workbench.action.chat.upgradePlan';
						commandService.executeCommand(commandId);
					}
				});
			}

			return additionalActions;
		}
	};
	return actionProvider;
}

/**
 * Action view item for selecting a language model in the chat interface.
 */
export class ModelPickerActionItem extends ActionWidgetDropdownActionViewItem {
	private readonly tooltipDisposable = this._register(new MutableDisposable());

	constructor(
		action: IAction,
		protected currentModel: ILanguageModelChatMetadataAndIdentifier | undefined,
		widgetOptions: Omit<IActionWidgetDropdownOptions, 'label' | 'labelRenderer'> | undefined,
		delegate: IModelPickerDelegate,
		@IActionWidgetService actionWidgetService: IActionWidgetService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ICommandService commandService: ICommandService,
		@IChatEntitlementService chatEntitlementService: IChatEntitlementService,
		@IKeybindingService keybindingService: IKeybindingService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IProductService productService: IProductService,
		@IHoverService private readonly hoverService: IHoverService,
	) {
		// Modify the original action with a different label and make it show the current model
		const actionWithLabel: IAction = {
			...action,
			label: currentModel?.metadata.name ?? localize('chat.modelPicker.auto', "Auto"),
			tooltip: localize('chat.modelPicker.label', "Pick Model"),
			run: () => { }
		};

		const modelPickerActionWidgetOptions: Omit<IActionWidgetDropdownOptions, 'label' | 'labelRenderer'> = {
			actionProvider: modelDelegateToWidgetActionsProvider(delegate, telemetryService),
			actionBarActionProvider: getModelPickerActionBarActionProvider(commandService, chatEntitlementService, productService)
		};

		super(actionWithLabel, widgetOptions ?? modelPickerActionWidgetOptions, actionWidgetService, keybindingService, contextKeyService);

		// Listen for model changes from the delegate
		this._register(delegate.onDidChangeModel(model => {
			this.currentModel = model;
			if (this.element) {
				this.renderLabel(this.element);
			}
		}));
	}

	protected override renderLabel(element: HTMLElement): IDisposable | null {
		const { name, statusIcon, tooltip } = this.currentModel?.metadata || {};
		const domChildren = [];

		if (statusIcon) {
			const iconElement = renderIcon(statusIcon);
			domChildren.push(iconElement);
			if (tooltip) {
				this.tooltipDisposable.value = this.hoverService.setupDelayedHoverAtMouse(iconElement, () => ({ content: tooltip }));
			}
		}

		domChildren.push(dom.$('span.chat-model-label', undefined, name ?? localize('chat.modelPicker.auto', "Auto")));
		domChildren.push(...renderLabelWithIcons(`$(chevron-down)`));

		dom.reset(element, ...domChildren);
		this.setAriaLabelAttributes(element);
		return null;
	}

	override render(container: HTMLElement): void {
		super.render(container);
		container.classList.add('chat-modelPicker-item');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/modelPicker/modePickerActionItem.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/modelPicker/modePickerActionItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { renderLabelWithIcons } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { IAction } from '../../../../../base/common/actions.js';
import { coalesce } from '../../../../../base/common/arrays.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { groupBy } from '../../../../../base/common/collections.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, IObservable } from '../../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize } from '../../../../../nls.js';
import { ActionWidgetDropdownActionViewItem } from '../../../../../platform/actions/browser/actionWidgetDropdownActionViewItem.js';
import { getFlatActionBarActions } from '../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId, MenuItemAction } from '../../../../../platform/actions/common/actions.js';
import { IActionWidgetService } from '../../../../../platform/actionWidget/browser/actionWidget.js';
import { IActionWidgetDropdownAction, IActionWidgetDropdownActionProvider, IActionWidgetDropdownOptions } from '../../../../../platform/actionWidget/browser/actionWidgetDropdown.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { IChatAgentService } from '../../common/chatAgents.js';
import { ChatMode, IChatMode, IChatModeService } from '../../common/chatModes.js';
import { ChatAgentLocation, ChatConfiguration, ChatModeKind } from '../../common/constants.js';
import { ExtensionAgentSourceType, PromptsStorage } from '../../common/promptSyntax/service/promptsService.js';
import { getOpenChatActionIdForMode } from '../actions/chatActions.js';
import { IToggleChatModeArgs, ToggleAgentModeActionId } from '../actions/chatExecuteActions.js';

export interface IModePickerDelegate {
	readonly currentMode: IObservable<IChatMode>;
	readonly sessionResource: () => URI | undefined;
}

export class ModePickerActionItem extends ActionWidgetDropdownActionViewItem {
	constructor(
		action: MenuItemAction,
		private readonly delegate: IModePickerDelegate,
		@IActionWidgetService actionWidgetService: IActionWidgetService,
		@IChatAgentService chatAgentService: IChatAgentService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IChatModeService chatModeService: IChatModeService,
		@IMenuService private readonly menuService: IMenuService,
		@ICommandService commandService: ICommandService,
		@IProductService productService: IProductService
	) {
		// Category definitions
		const builtInCategory = { label: localize('built-in', "Built-In"), order: 0 };
		const customCategory = { label: localize('custom', "Custom"), order: 1 };
		const policyDisabledCategory = { label: localize('managedByOrganization', "Managed by your organization"), order: 999, showHeader: true };

		const agentModeDisabledViaPolicy = configurationService.inspect<boolean>(ChatConfiguration.AgentEnabled).policyValue === false;

		const makeAction = (mode: IChatMode, currentMode: IChatMode): IActionWidgetDropdownAction => {
			const isDisabledViaPolicy =
				mode.kind === ChatModeKind.Agent &&
				agentModeDisabledViaPolicy;

			const tooltip = chatAgentService.getDefaultAgent(ChatAgentLocation.Chat, mode.kind)?.description ?? action.tooltip;

			return {
				...action,
				id: getOpenChatActionIdForMode(mode),
				label: mode.label.get(),
				icon: isDisabledViaPolicy ? ThemeIcon.fromId(Codicon.lock.id) : undefined,
				class: isDisabledViaPolicy ? 'disabled-by-policy' : undefined,
				enabled: !isDisabledViaPolicy,
				checked: !isDisabledViaPolicy && currentMode.id === mode.id,
				tooltip,
				run: async () => {
					if (isDisabledViaPolicy) {
						return; // Block interaction if disabled by policy
					}
					const result = await commandService.executeCommand(
						ToggleAgentModeActionId,
						{ modeId: mode.id, sessionResource: this.delegate.sessionResource() } satisfies IToggleChatModeArgs
					);
					if (this.element) {
						this.renderLabel(this.element);
					}
					return result;
				},
				category: isDisabledViaPolicy ? policyDisabledCategory : builtInCategory
			};
		};

		const makeActionFromCustomMode = (mode: IChatMode, currentMode: IChatMode): IActionWidgetDropdownAction => {
			return {
				...makeAction(mode, currentMode),
				tooltip: mode.description.get() ?? chatAgentService.getDefaultAgent(ChatAgentLocation.Chat, mode.kind)?.description ?? action.tooltip,
				category: agentModeDisabledViaPolicy ? policyDisabledCategory : customCategory
			};
		};

		const actionProvider: IActionWidgetDropdownActionProvider = {
			getActions: () => {
				const modes = chatModeService.getModes();
				const currentMode = delegate.currentMode.get();
				const agentMode = modes.builtin.find(mode => mode.id === ChatMode.Agent.id);
				const otherBuiltinModes = modes.builtin.filter(mode => mode.id !== ChatMode.Agent.id);
				const customModes = groupBy(
					modes.custom,
					mode => mode.source?.storage === PromptsStorage.extension && mode.source.extensionId.value === productService.defaultChatAgent?.chatExtensionId && mode.source.type === ExtensionAgentSourceType.contribution ?
						'builtin' : 'custom');

				const customBuiltinModeActions = customModes.builtin?.map(mode => {
					const action = makeActionFromCustomMode(mode, currentMode);
					action.category = agentModeDisabledViaPolicy ? policyDisabledCategory : builtInCategory;
					return action;
				}) ?? [];

				const orderedModes = coalesce([
					agentMode && makeAction(agentMode, currentMode),
					...otherBuiltinModes.map(mode => mode && makeAction(mode, currentMode)),
					...customBuiltinModeActions, ...customModes.custom?.map(mode => makeActionFromCustomMode(mode, currentMode)) ?? []
				]);
				return orderedModes;
			}
		};

		const modePickerActionWidgetOptions: Omit<IActionWidgetDropdownOptions, 'label' | 'labelRenderer'> = {
			actionProvider,
			actionBarActionProvider: {
				getActions: () => this.getModePickerActionBarActions()
			},
			showItemKeybindings: true
		};

		super(action, modePickerActionWidgetOptions, actionWidgetService, keybindingService, contextKeyService);

		// Listen to changes in the current mode and its properties
		this._register(autorun(reader => {
			this.delegate.currentMode.read(reader).label.read(reader); // use the reader so autorun tracks it
			if (this.element) {
				this.renderLabel(this.element);
			}
		}));
	}

	private getModePickerActionBarActions(): IAction[] {
		const menuActions = this.menuService.createMenu(MenuId.ChatModePicker, this.contextKeyService);
		const menuContributions = getFlatActionBarActions(menuActions.getActions({ renderShortTitle: true }));
		menuActions.dispose();

		return menuContributions;
	}

	protected override renderLabel(element: HTMLElement): IDisposable | null {
		this.setAriaLabelAttributes(element);
		const state = this.delegate.currentMode.get().label.get();
		dom.reset(element, dom.$('span.chat-model-label', undefined, state), ...renderLabelWithIcons(`$(chevron-down)`));
		return null;
	}

	override render(container: HTMLElement): void {
		super.render(container);
		container.classList.add('chat-modelPicker-item');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/promptSyntax/attachInstructionsAction.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/promptSyntax/attachInstructionsAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ChatViewId, IChatWidget } from '../chat.js';
import { CHAT_CATEGORY, CHAT_CONFIG_MENU_ID } from '../actions/chatActions.js';
import { localize, localize2 } from '../../../../../nls.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IPromptsService } from '../../common/promptSyntax/service/promptsService.js';
import { PromptFilePickers } from './pickers/promptFilePickers.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IChatContextPickerItem, IChatContextPickerPickItem, IChatContextPicker } from '../chatContextPickService.js';
import { IQuickPickSeparator } from '../../../../../platform/quickinput/common/quickInput.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { getCleanPromptName } from '../../common/promptSyntax/config/promptFileLocations.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { PromptsType } from '../../common/promptSyntax/promptTypes.js';
import { compare } from '../../../../../base/common/strings.js';
import { IPromptFileVariableEntry, PromptFileVariableKind, toPromptFileVariableEntry } from '../../common/chatVariableEntries.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';

/**
 * Action ID for the `Attach Instruction` action.
 */
const ATTACH_INSTRUCTIONS_ACTION_ID = 'workbench.action.chat.attach.instructions';

/**
 * Action ID for the `Configure Instruction` action.
 */
const CONFIGURE_INSTRUCTIONS_ACTION_ID = 'workbench.action.chat.configure.instructions';


class ManageInstructionsFilesAction extends Action2 {
	constructor() {
		super({
			id: CONFIGURE_INSTRUCTIONS_ACTION_ID,
			title: localize2('configure-instructions', "Configure Instructions..."),
			shortTitle: localize2('configure-instructions.short', "Chat Instructions"),
			icon: Codicon.bookmark,
			f1: true,
			precondition: ChatContextKeys.enabled,
			category: CHAT_CATEGORY,
			menu: {
				id: CHAT_CONFIG_MENU_ID,
				when: ContextKeyExpr.and(ChatContextKeys.enabled, ContextKeyExpr.equals('view', ChatViewId)),
				order: 10,
				group: '1_level'
			}
		});
	}

	public override async run(
		accessor: ServicesAccessor,
	): Promise<void> {
		const openerService = accessor.get(IOpenerService);
		const instaService = accessor.get(IInstantiationService);

		const pickers = instaService.createInstance(PromptFilePickers);

		const placeholder = localize(
			'commands.prompt.manage-dialog.placeholder',
			'Select the instructions file to open'
		);

		const result = await pickers.selectPromptFile({ placeholder, type: PromptsType.instructions, optionEdit: false });
		if (result !== undefined) {
			await openerService.open(result.promptFile);
		}

	}
}

/**
 * Helper to register the `Attach Prompt` action.
 */
export function registerAttachPromptActions(): void {
	registerAction2(ManageInstructionsFilesAction);
}


export class ChatInstructionsPickerPick implements IChatContextPickerItem {

	readonly type = 'pickerPick';
	readonly label = localize('chatContext.attach.instructions.label', 'Instructions...');
	readonly icon = Codicon.bookmark;
	readonly commandId = ATTACH_INSTRUCTIONS_ACTION_ID;

	constructor(
		@IPromptsService private readonly promptsService: IPromptsService,
	) { }

	isEnabled(widget: IChatWidget): Promise<boolean> | boolean {
		return !!widget.attachmentCapabilities.supportsInstructionAttachments;
	}

	asPicker(): IChatContextPicker {

		const picks = this.promptsService.listPromptFiles(PromptsType.instructions, CancellationToken.None).then(value => {

			const result: (IChatContextPickerPickItem | IQuickPickSeparator)[] = [];

			value = value.slice(0).sort((a, b) => compare(a.storage, b.storage));

			let storageType: string | undefined;

			for (const promptsPath of value) {

				if (storageType !== promptsPath.storage) {
					storageType = promptsPath.storage;
					result.push({
						type: 'separator',
						label: this.promptsService.getPromptLocationLabel(promptsPath)
					});
				}

				result.push({
					label: promptsPath.name ?? getCleanPromptName(promptsPath.uri),
					asAttachment: (): IPromptFileVariableEntry => {
						return toPromptFileVariableEntry(promptsPath.uri, PromptFileVariableKind.Instruction);
					}
				});
			}
			return result;
		});

		return {
			placeholder: localize('placeholder', 'Select instructions files to attach'),
			picks,
			configure: {
				label: localize('configureInstructions', 'Configure Instructions...'),
				commandId: CONFIGURE_INSTRUCTIONS_ACTION_ID
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/promptSyntax/chatModeActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/promptSyntax/chatModeActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CHAT_CATEGORY, CHAT_CONFIG_MENU_ID } from '../actions/chatActions.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { localize, localize2 } from '../../../../../nls.js';
import { PromptFilePickers } from './pickers/promptFilePickers.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { PromptsType } from '../../common/promptSyntax/promptTypes.js';
import { ChatViewId } from '../chat.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';

abstract class ConfigAgentActionImpl extends Action2 {
	public override async run(accessor: ServicesAccessor): Promise<void> {
		const instaService = accessor.get(IInstantiationService);
		const openerService = accessor.get(IOpenerService);
		const pickers = instaService.createInstance(PromptFilePickers);
		const placeholder = localize('configure.agent.prompts.placeholder', "Select the custom agents to open and configure visibility in the agent picker");

		const result = await pickers.selectPromptFile({ placeholder, type: PromptsType.agent, optionEdit: false, optionVisibility: true });
		if (result !== undefined) {
			await openerService.open(result.promptFile);
		}
	}
}

// Separate action `Configure Custom Agents` link in the agent picker.

const PICKER_CONFIGURE_AGENTS_ACTION_ID = 'workbench.action.chat.picker.customagents';

function createPickerConfigureAgentsActionConfig(disabled: boolean) {
	const config = {
		id: disabled ? PICKER_CONFIGURE_AGENTS_ACTION_ID + '.disabled' : PICKER_CONFIGURE_AGENTS_ACTION_ID,
		title: localize2('select-agent', "Configure Custom Agents..."),
		tooltip: disabled ? localize('managedByOrganization', "Managed by your organization") : undefined,
		icon: disabled ? Codicon.lock : undefined,
		category: CHAT_CATEGORY,
		f1: false,
		precondition: disabled ? ContextKeyExpr.false() : ChatContextKeys.Modes.agentModeDisabledByPolicy.negate(),
		menu: {
			id: MenuId.ChatModePicker,
			when: disabled ? ChatContextKeys.Modes.agentModeDisabledByPolicy : ChatContextKeys.Modes.agentModeDisabledByPolicy.negate(),
		},
	};
	return config;
}

class PickerConfigAgentAction extends ConfigAgentActionImpl { constructor() { super(createPickerConfigureAgentsActionConfig(false)); } }
class PickerConfigAgentActionDisabled extends ConfigAgentActionImpl { constructor() { super(createPickerConfigureAgentsActionConfig(true)); } }

/**
 * Action ID for the `Configure Custom Agents` action.
 */
const CONFIGURE_AGENTS_ACTION_ID = 'workbench.action.chat.configure.customagents';

function createManageAgentsActionConfig(disabled: boolean) {
	const base = {
		id: disabled ? CONFIGURE_AGENTS_ACTION_ID + '.disabled' : CONFIGURE_AGENTS_ACTION_ID,
		title: localize2('configure-agents', "Configure Custom Agents..."),
		shortTitle: localize('configure-agents.short', "Custom Agents"),
		icon: disabled ? Codicon.lock : Codicon.bookmark,
		f1: !disabled,
		precondition: disabled ? ContextKeyExpr.false() : ContextKeyExpr.and(ChatContextKeys.enabled, ChatContextKeys.Modes.agentModeDisabledByPolicy.negate()),
		category: CHAT_CATEGORY,
		menu: [
			{
				id: CHAT_CONFIG_MENU_ID,
				when: ContextKeyExpr.and(
					ChatContextKeys.enabled,
					ContextKeyExpr.equals('view', ChatViewId),
					disabled ? ChatContextKeys.Modes.agentModeDisabledByPolicy : ChatContextKeys.Modes.agentModeDisabledByPolicy.negate()
				),
				order: 10,
				group: '0_level'
			}
		]
	};
	return disabled ? { ...base, tooltip: localize('managedByOrganization', "Managed by your organization") } : base;
}
class ManageAgentsAction extends ConfigAgentActionImpl { constructor() { super(createManageAgentsActionConfig(false)); } }
class ManageAgentsActionDisabled extends ConfigAgentActionImpl { constructor() { super(createManageAgentsActionConfig(true)); } }


/**
 * Helper to register all the `Run Current Prompt` actions.
 */
export function registerAgentActions(): void {
	registerAction2(ManageAgentsAction);
	registerAction2(ManageAgentsActionDisabled);
	registerAction2(PickerConfigAgentAction);
	registerAction2(PickerConfigAgentActionDisabled);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/promptSyntax/newPromptFileActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/promptSyntax/newPromptFileActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isEqual } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { getCodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { SnippetController2 } from '../../../../../editor/contrib/snippet/browser/snippetController2.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { INotificationService, NeverShowAgainScope, Severity } from '../../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { getLanguageIdForPromptsType, PromptsType } from '../../common/promptSyntax/promptTypes.js';
import { IUserDataSyncEnablementService, SyncResource } from '../../../../../platform/userDataSync/common/userDataSync.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { CONFIGURE_SYNC_COMMAND_ID } from '../../../../services/userDataSync/common/userDataSync.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { CHAT_CATEGORY } from '../actions/chatActions.js';
import { askForPromptFileName } from './pickers/askForPromptName.js';
import { askForPromptSourceFolder } from './pickers/askForPromptSourceFolder.js';
import { IChatModeService } from '../../common/chatModes.js';


class AbstractNewPromptFileAction extends Action2 {

	constructor(id: string, title: string, private readonly type: PromptsType) {
		super({
			id,
			title,
			f1: false,
			precondition: ChatContextKeys.enabled,
			category: CHAT_CATEGORY,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib
			},
			menu: {
				id: MenuId.CommandPalette,
				when: ChatContextKeys.enabled
			}
		});
	}

	public override async run(accessor: ServicesAccessor) {
		const logService = accessor.get(ILogService);
		const openerService = accessor.get(IOpenerService);
		const commandService = accessor.get(ICommandService);
		const notificationService = accessor.get(INotificationService);
		const userDataSyncEnablementService = accessor.get(IUserDataSyncEnablementService);
		const editorService = accessor.get(IEditorService);
		const fileService = accessor.get(IFileService);
		const instaService = accessor.get(IInstantiationService);
		const chatModeService = accessor.get(IChatModeService);

		const selectedFolder = await instaService.invokeFunction(askForPromptSourceFolder, this.type);
		if (!selectedFolder) {
			return;
		}

		const fileName = await instaService.invokeFunction(askForPromptFileName, this.type, selectedFolder.uri);
		if (!fileName) {
			return;
		}

		// create the prompt file

		await fileService.createFolder(selectedFolder.uri);

		const promptUri = URI.joinPath(selectedFolder.uri, fileName);
		await fileService.createFile(promptUri);

		await openerService.open(promptUri);

		const editor = getCodeEditor(editorService.activeTextEditorControl);
		if (editor && editor.hasModel() && isEqual(editor.getModel().uri, promptUri)) {
			SnippetController2.get(editor)?.apply([{
				range: editor.getModel().getFullModelRange(),
				template: getDefaultContentSnippet(this.type, chatModeService),
			}]);
		}

		if (selectedFolder.storage !== 'user') {
			return;
		}

		// due to PII concerns, synchronization of the 'user' reusable prompts
		// is disabled by default, but we want to make that fact clear to the user
		// hence after a 'user' prompt is create, we check if the synchronization
		// was explicitly configured before, and if it wasn't, we show a suggestion
		// to enable the synchronization logic in the Settings Sync configuration

		const isConfigured = userDataSyncEnablementService
			.isResourceEnablementConfigured(SyncResource.Prompts);
		const isSettingsSyncEnabled = userDataSyncEnablementService.isEnabled();

		// if prompts synchronization has already been configured before or
		// if settings sync service is currently disabled, nothing to do
		if ((isConfigured === true) || (isSettingsSyncEnabled === false)) {
			return;
		}

		// show suggestion to enable synchronization of the user prompts and instructions to the user
		notificationService.prompt(
			Severity.Info,
			localize(
				'workbench.command.prompts.create.user.enable-sync-notification',
				"Do you want to backup and sync your user prompt, instruction and custom agent files with Setting Sync?'",
			),
			[
				{
					label: localize('enable.capitalized', "Enable"),
					run: () => {
						commandService.executeCommand(CONFIGURE_SYNC_COMMAND_ID)
							.catch((error) => {
								logService.error(`Failed to run '${CONFIGURE_SYNC_COMMAND_ID}' command: ${error}.`);
							});
					},
				},
				{
					label: localize('learnMore.capitalized', "Learn More"),
					run: () => {
						openerService.open(URI.parse('https://aka.ms/vscode-settings-sync-help'));
					},
				},
			],
			{
				neverShowAgain: {
					id: 'workbench.command.prompts.create.user.enable-sync-notification',
					scope: NeverShowAgainScope.PROFILE,
				},
			},
		);
	}
}

function getDefaultContentSnippet(promptType: PromptsType, chatModeService: IChatModeService): string {
	const agents = chatModeService.getModes();
	const agentNames = agents.builtin.map(agent => agent.name.get()).join(',') + (agents.custom.length ? (',' + agents.custom.map(agent => agent.name.get()).join(',')) : '');
	switch (promptType) {
		case PromptsType.prompt:
			return [
				`---`,
				`agent: \${1|${agentNames}|}`,
				`---`,
				`\${2:Define the task to achieve, including specific requirements, constraints, and success criteria.}`,
			].join('\n');
		case PromptsType.instructions:
			return [
				`---`,
				`applyTo: '\${1|**,**/*.ts|}'`,
				`---`,
				`\${2:Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.}`,
			].join('\n');
		case PromptsType.agent:
			return [
				`---`,
				`description: '\${1:Describe what this custom agent does and when to use it.}'`,
				`tools: []`,
				`---`,
				`\${2:Define what this custom agent accomplishes for the user, when to use it, and the edges it won't cross. Specify its ideal inputs/outputs, the tools it may call, and how it reports progress or asks for help.}`,
			].join('\n');
		default:
			throw new Error(`Unknown prompt type: ${promptType}`);
	}
}


export const NEW_PROMPT_COMMAND_ID = 'workbench.command.new.prompt';
export const NEW_INSTRUCTIONS_COMMAND_ID = 'workbench.command.new.instructions';
export const NEW_AGENT_COMMAND_ID = 'workbench.command.new.agent';

class NewPromptFileAction extends AbstractNewPromptFileAction {
	constructor() {
		super(NEW_PROMPT_COMMAND_ID, localize('commands.new.prompt.local.title', "New Prompt File..."), PromptsType.prompt);
	}
}

class NewInstructionsFileAction extends AbstractNewPromptFileAction {
	constructor() {
		super(NEW_INSTRUCTIONS_COMMAND_ID, localize('commands.new.instructions.local.title', "New Instructions File..."), PromptsType.instructions);
	}
}

class NewAgentFileAction extends AbstractNewPromptFileAction {
	constructor() {
		super(NEW_AGENT_COMMAND_ID, localize('commands.new.agent.local.title', "New Custom Agent..."), PromptsType.agent);
	}
}

class NewUntitledPromptFileAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.command.new.untitled.prompt',
			title: localize2('commands.new.untitled.prompt.title', "New Untitled Prompt File"),
			f1: true,
			precondition: ChatContextKeys.enabled,
			category: CHAT_CATEGORY,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib
			},
		});
	}

	public override async run(accessor: ServicesAccessor) {
		const editorService = accessor.get(IEditorService);
		const chatModeService = accessor.get(IChatModeService);

		const languageId = getLanguageIdForPromptsType(PromptsType.prompt);

		const input = await editorService.openEditor({
			resource: undefined,
			languageId,
			options: {
				pinned: true
			}
		});
		const type = PromptsType.prompt;

		const editor = getCodeEditor(editorService.activeTextEditorControl);
		if (editor && editor.hasModel()) {
			SnippetController2.get(editor)?.apply([{
				range: editor.getModel().getFullModelRange(),
				template: getDefaultContentSnippet(type, chatModeService),
			}]);
		}

		return input;
	}
}

export function registerNewPromptFileActions(): void {
	registerAction2(NewPromptFileAction);
	registerAction2(NewInstructionsFileAction);
	registerAction2(NewAgentFileAction);
	registerAction2(NewUntitledPromptFileAction);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/promptSyntax/promptCodingAgentActionContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/promptSyntax/promptCodingAgentActionContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableMap } from '../../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { registerEditorContribution, EditorContributionInstantiation } from '../../../../../editor/browser/editorExtensions.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { PROMPT_LANGUAGE_ID } from '../../common/promptSyntax/promptTypes.js';
import { PromptCodingAgentActionOverlayWidget } from './promptCodingAgentActionOverlay.js';

export class PromptCodingAgentActionContribution extends Disposable {
	static readonly ID = 'promptCodingAgentActionContribution';

	private readonly _overlayWidgets = this._register(new DisposableMap<ICodeEditor, PromptCodingAgentActionOverlayWidget>());

	constructor(
		private readonly _editor: ICodeEditor,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();

		this._register(this._editor.onDidChangeModel(() => {
			this._updateOverlayWidget();
		}));

		this._updateOverlayWidget();
	}
	private _updateOverlayWidget(): void {
		const model = this._editor.getModel();

		// Remove existing overlay if present
		this._overlayWidgets.deleteAndDispose(this._editor);

		// Add overlay if this is a prompt file
		if (model && model.getLanguageId() === PROMPT_LANGUAGE_ID) {
			const widget = this._instantiationService.createInstance(PromptCodingAgentActionOverlayWidget, this._editor);
			this._overlayWidgets.set(this._editor, widget);
		}
	}
}

registerEditorContribution(PromptCodingAgentActionContribution.ID, PromptCodingAgentActionContribution, EditorContributionInstantiation.AfterFirstRender);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/promptSyntax/promptCodingAgentActionOverlay.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/promptSyntax/promptCodingAgentActionOverlay.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition, OverlayWidgetPositionPreference } from '../../../../../editor/browser/editorBrowser.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { IRemoteCodingAgentsService } from '../../../remoteCodingAgents/common/remoteCodingAgentsService.js';
import { localize } from '../../../../../nls.js';
import { Button } from '../../../../../base/browser/ui/button/button.js';
import { PROMPT_LANGUAGE_ID } from '../../common/promptSyntax/promptTypes.js';
import { $ } from '../../../../../base/browser/dom.js';
import { IPromptsService } from '../../common/promptSyntax/service/promptsService.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';

export class PromptCodingAgentActionOverlayWidget extends Disposable implements IOverlayWidget {

	private static readonly ID = 'promptCodingAgentActionOverlay';

	private readonly _domNode: HTMLElement;
	private readonly _button: Button;
	private _isVisible: boolean = false;

	constructor(
		private readonly _editor: ICodeEditor,
		@ICommandService private readonly _commandService: ICommandService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IRemoteCodingAgentsService private readonly _remoteCodingAgentService: IRemoteCodingAgentsService,
		@IPromptsService private readonly _promptsService: IPromptsService,
	) {
		super();

		this._domNode = $('.prompt-coding-agent-action-overlay');

		this._button = this._register(new Button(this._domNode, {
			supportIcons: true,
			title: localize('runPromptWithCodingAgent', "Run prompt file in a remote coding agent")
		}));

		this._button.element.style.background = 'var(--vscode-button-background)';
		this._button.element.style.color = 'var(--vscode-button-foreground)';
		this._button.label = localize('runWithCodingAgent.label', "{0} Delegate to Copilot coding agent", '$(cloud-upload)');

		this._register(this._button.onDidClick(async () => {
			await this._execute();
		}));
		this._register(this._contextKeyService.onDidChangeContext(() => {
			this._updateVisibility();
		}));
		this._register(this._editor.onDidChangeModel(() => {
			this._updateVisibility();
		}));
		this._register(this._editor.onDidLayoutChange(() => {
			if (this._isVisible) {
				this._editor.layoutOverlayWidget(this);
			}
		}));

		// initial visibility
		this._updateVisibility();
	}

	getId(): string {
		return PromptCodingAgentActionOverlayWidget.ID;
	}

	getDomNode(): HTMLElement {
		return this._domNode;
	}

	getPosition(): IOverlayWidgetPosition | null {
		if (!this._isVisible) {
			return null;
		}

		return {
			preference: OverlayWidgetPositionPreference.BOTTOM_RIGHT_CORNER,
		};
	}

	private _updateVisibility(): void {
		const enableRemoteCodingAgentPromptFileOverlay = ChatContextKeys.enableRemoteCodingAgentPromptFileOverlay.getValue(this._contextKeyService);
		const hasRemoteCodingAgent = ChatContextKeys.hasRemoteCodingAgent.getValue(this._contextKeyService);
		const model = this._editor.getModel();
		const isPromptFile = model?.getLanguageId() === PROMPT_LANGUAGE_ID;
		const shouldBeVisible = !!(isPromptFile && enableRemoteCodingAgentPromptFileOverlay && hasRemoteCodingAgent);

		if (shouldBeVisible !== this._isVisible) {
			this._isVisible = shouldBeVisible;
			if (this._isVisible) {
				this._editor.addOverlayWidget(this);
			} else {
				this._editor.removeOverlayWidget(this);
			}
		}
	}

	private async _execute(): Promise<void> {
		const model = this._editor.getModel();
		if (!model) {
			return;
		}

		this._button.enabled = false;
		try {
			const promptContent = model.getValue();
			const promptName = await this._promptsService.getPromptSlashCommandName(model.uri, CancellationToken.None);

			const agents = this._remoteCodingAgentService.getAvailableAgents();
			const agent = agents[0]; // Use the first available agent
			if (!agent) {
				return;
			}

			await this._commandService.executeCommand(agent.command, {
				userPrompt: promptName,
				summary: promptContent,
				source: 'prompt',
			});
		} finally {
			this._button.enabled = true;
		}
	}

	override dispose(): void {
		if (this._isVisible) {
			this._editor.removeOverlayWidget(this);
		}
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/promptSyntax/promptFileActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/promptSyntax/promptFileActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerAttachPromptActions } from './attachInstructionsAction.js';
import { registerAgentActions } from './chatModeActions.js';
import { registerRunPromptActions } from './runPromptAction.js';
import { registerNewPromptFileActions } from './newPromptFileActions.js';
import { registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { SaveAsAgentFileAction, SaveAsInstructionsFileAction, SaveAsPromptFileAction } from './saveAsPromptFileActions.js';


/**
 * Helper to register all actions related to reusable prompt files.
 */
export function registerPromptActions(): void {
	registerRunPromptActions();
	registerAttachPromptActions();
	registerAction2(SaveAsPromptFileAction);
	registerAction2(SaveAsInstructionsFileAction);
	registerAction2(SaveAsAgentFileAction);
	registerAgentActions();
	registerNewPromptFileActions();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/promptSyntax/promptFileRewriter.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/promptSyntax/promptFileRewriter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { URI } from '../../../../../base/common/uri.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { EditOperation } from '../../../../../editor/common/core/editOperation.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { ILanguageModelToolsService, IToolAndToolSetEnablementMap } from '../../common/languageModelToolsService.js';
import { PromptHeaderAttributes } from '../../common/promptSyntax/promptFileParser.js';
import { IPromptsService } from '../../common/promptSyntax/service/promptsService.js';

export class PromptFileRewriter {
	constructor(
		@ICodeEditorService private readonly _codeEditorService: ICodeEditorService,
		@IPromptsService private readonly _promptsService: IPromptsService,
		@ILanguageModelToolsService private readonly _languageModelToolsService: ILanguageModelToolsService
	) {
	}

	public async openAndRewriteTools(uri: URI, newTools: IToolAndToolSetEnablementMap | undefined, token: CancellationToken): Promise<void> {
		const editor = await this._codeEditorService.openCodeEditor({ resource: uri }, this._codeEditorService.getFocusedCodeEditor());
		if (!editor || !editor.hasModel()) {
			return;
		}
		const model = editor.getModel();

		const promptAST = this._promptsService.getParsedPromptFile(model);
		if (!promptAST.header) {
			return undefined;
		}

		const toolsAttr = promptAST.header.getAttribute(PromptHeaderAttributes.tools);
		if (!toolsAttr) {
			return undefined;
		}

		editor.setSelection(toolsAttr.range);
		if (newTools === undefined) {
			this.rewriteAttribute(model, '', toolsAttr.range);
			return;
		} else {
			this.rewriteTools(model, newTools, toolsAttr.value.range);
		}
	}

	public rewriteTools(model: ITextModel, newTools: IToolAndToolSetEnablementMap, range: Range): void {
		const newToolNames = this._languageModelToolsService.toFullReferenceNames(newTools);
		const newValue = `[${newToolNames.map(s => `'${s}'`).join(', ')}]`;
		this.rewriteAttribute(model, newValue, range);
	}

	private rewriteAttribute(model: ITextModel, newValue: string, range: Range): void {
		model.pushStackElement();
		model.pushEditOperations(null, [EditOperation.replaceMove(range, newValue)], () => null);
		model.pushStackElement();
	}

	public async openAndRewriteName(uri: URI, newName: string, token: CancellationToken): Promise<void> {
		const editor = await this._codeEditorService.openCodeEditor({ resource: uri }, this._codeEditorService.getFocusedCodeEditor());
		if (!editor || !editor.hasModel()) {
			return;
		}
		const model = editor.getModel();

		const promptAST = this._promptsService.getParsedPromptFile(model);
		if (!promptAST.header) {
			return;
		}

		const nameAttr = promptAST.header.getAttribute(PromptHeaderAttributes.name);
		if (!nameAttr) {
			return;
		}
		if (nameAttr.value.type === 'string' && nameAttr.value.value === newName) {
			return;
		}

		editor.setSelection(nameAttr.range);
		this.rewriteAttribute(model, newName, nameAttr.value.range);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/promptSyntax/promptToolsCodeLensProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/promptSyntax/promptToolsCodeLensProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { CodeLens, CodeLensList, CodeLensProvider } from '../../../../../editor/common/languages.js';
import { isITextModel, ITextModel } from '../../../../../editor/common/model.js';
import { ILanguageFeaturesService } from '../../../../../editor/common/services/languageFeatures.js';
import { localize } from '../../../../../nls.js';
import { CommandsRegistry } from '../../../../../platform/commands/common/commands.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { showToolsPicker } from '../actions/chatToolPicker.js';
import { ILanguageModelToolsService } from '../../common/languageModelToolsService.js';
import { ALL_PROMPTS_LANGUAGE_SELECTOR, getPromptsTypeForLanguageId, PromptsType } from '../../common/promptSyntax/promptTypes.js';
import { IPromptsService } from '../../common/promptSyntax/service/promptsService.js';
import { registerEditorFeature } from '../../../../../editor/common/editorFeatures.js';
import { PromptFileRewriter } from './promptFileRewriter.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { IEditorModel } from '../../../../../editor/common/editorCommon.js';
import { PromptHeaderAttributes } from '../../common/promptSyntax/promptFileParser.js';
import { isGithubTarget } from '../../common/promptSyntax/languageProviders/promptValidator.js';

class PromptToolsCodeLensProvider extends Disposable implements CodeLensProvider {

	// `_`-prefix marks this as private command
	private readonly cmdId = `_configure/${generateUuid()}`;

	constructor(
		@IPromptsService private readonly promptsService: IPromptsService,
		@ILanguageFeaturesService private readonly languageService: ILanguageFeaturesService,
		@ILanguageModelToolsService private readonly languageModelToolsService: ILanguageModelToolsService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();


		this._register(this.languageService.codeLensProvider.register(ALL_PROMPTS_LANGUAGE_SELECTOR, this));

		this._register(CommandsRegistry.registerCommand(this.cmdId, (_accessor, ...args) => {
			const [first, second, third, forth] = args;
			const model = first as IEditorModel;
			if (isITextModel(model) && Range.isIRange(second) && Array.isArray(third) && (typeof forth === 'string' || forth === undefined)) {
				this.updateTools(model as ITextModel, Range.lift(second), third, forth);
			}
		}));
	}

	async provideCodeLenses(model: ITextModel, token: CancellationToken): Promise<undefined | CodeLensList> {
		const promptType = getPromptsTypeForLanguageId(model.getLanguageId());
		if (!promptType || promptType === PromptsType.instructions) {
			// if the model is not a prompt, we don't provide any code actions
			return undefined;
		}

		const promptAST = this.promptsService.getParsedPromptFile(model);
		const header = promptAST.header;
		if (!header) {
			return undefined;
		}

		if (isGithubTarget(promptType, header.target)) {
			return undefined;
		}

		const toolsAttr = header.getAttribute(PromptHeaderAttributes.tools);
		if (!toolsAttr || toolsAttr.value.type !== 'array') {
			return undefined;
		}
		const items = toolsAttr.value.items;
		const selectedTools = items.filter(item => item.type === 'string').map(item => item.value);

		const codeLens: CodeLens = {
			range: toolsAttr.range.collapseToStart(),
			command: {
				title: localize('configure-tools.capitalized.ellipsis', "Configure Tools..."),
				id: this.cmdId,
				arguments: [model, toolsAttr.value.range, selectedTools, header.target]
			}
		};
		return { lenses: [codeLens] };
	}

	private async updateTools(model: ITextModel, range: Range, selectedTools: readonly string[], target: string | undefined): Promise<void> {
		const selectedToolsNow = () => this.languageModelToolsService.toToolAndToolSetEnablementMap(selectedTools, target);
		const newSelectedAfter = await this.instantiationService.invokeFunction(showToolsPicker, localize('placeholder', "Select tools"), undefined, selectedToolsNow);
		if (!newSelectedAfter) {
			return;
		}
		await this.instantiationService.createInstance(PromptFileRewriter).rewriteTools(model, newSelectedAfter, range);
	}
}

registerEditorFeature(PromptToolsCodeLensProvider);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/promptSyntax/promptUrlHandler.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/promptSyntax/promptUrlHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { streamToBuffer, VSBuffer } from '../../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IRequestService } from '../../../../../platform/request/common/request.js';
import { IURLHandler, IURLService } from '../../../../../platform/url/common/url.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { askForPromptFileName } from './pickers/askForPromptName.js';
import { askForPromptSourceFolder } from './pickers/askForPromptSourceFolder.js';
import { getCleanPromptName } from '../../common/promptSyntax/config/promptFileLocations.js';
import { PromptsType } from '../../common/promptSyntax/promptTypes.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { localize } from '../../../../../nls.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { Schemas } from '../../../../../base/common/network.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { IHostService } from '../../../../services/host/browser/host.js';
import { mainWindow } from '../../../../../base/browser/window.js';

// example URL: code-oss:chat-prompt/install?url=https://gist.githubusercontent.com/aeschli/43fe78babd5635f062aef0195a476aad/raw/dfd71f60058a4dd25f584b55de3e20f5fd580e63/filterEvenNumbers.prompt.md

export class PromptUrlHandler extends Disposable implements IWorkbenchContribution, IURLHandler {

	static readonly ID = 'workbench.contrib.promptUrlHandler';

	constructor(
		@IURLService urlService: IURLService,
		@INotificationService private readonly notificationService: INotificationService,
		@IRequestService private readonly requestService: IRequestService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IFileService private readonly fileService: IFileService,
		@IOpenerService private readonly openerService: IOpenerService,
		@ILogService private readonly logService: ILogService,
		@IDialogService private readonly dialogService: IDialogService,

		@IHostService private readonly hostService: IHostService,
	) {
		super();
		this._register(urlService.registerHandler(this));
	}

	async handleURL(uri: URI): Promise<boolean> {
		let promptType: PromptsType | undefined;
		switch (uri.path) {
			case 'chat-prompt/install':
				promptType = PromptsType.prompt;
				break;
			case 'chat-instructions/install':
				promptType = PromptsType.instructions;
				break;
			case 'chat-mode/install':
			case 'chat-agent/install':
				promptType = PromptsType.agent;
				break;
			default:
				return false;
		}

		try {
			const query = decodeURIComponent(uri.query);
			if (!query || !query.startsWith('url=')) {
				return true;
			}

			const urlString = query.substring(4);
			const url = URI.parse(urlString);
			if (url.scheme !== Schemas.https && url.scheme !== Schemas.http) {
				this.logService.error(`[PromptUrlHandler] Invalid URL: ${urlString}`);
				return true;
			}

			await this.hostService.focus(mainWindow);

			if (await this.shouldBlockInstall(promptType, url)) {
				return true;
			}

			const result = await this.requestService.request({ type: 'GET', url: urlString }, CancellationToken.None);
			if (result.res.statusCode !== 200) {
				this.logService.error(`[PromptUrlHandler] Failed to fetch URL: ${urlString}`);
				this.notificationService.error(localize('failed', 'Failed to fetch URL: {0}', urlString));
				return true;
			}

			const responseData = (await streamToBuffer(result.stream)).toString();

			const newFolder = await this.instantiationService.invokeFunction(askForPromptSourceFolder, promptType);
			if (!newFolder) {
				return true;
			}

			const newName = await this.instantiationService.invokeFunction(askForPromptFileName, promptType, newFolder.uri, getCleanPromptName(url));
			if (!newName) {
				return true;
			}

			const promptUri = URI.joinPath(newFolder.uri, newName);

			await this.fileService.createFolder(newFolder.uri);
			await this.fileService.createFile(promptUri, VSBuffer.fromString(responseData));

			await this.openerService.open(promptUri);
			return true;

		} catch (error) {
			this.logService.error(`Error handling prompt URL ${uri.toString()}`, error);
			return true;
		}
	}

	private async shouldBlockInstall(promptType: PromptsType, url: URI): Promise<boolean> {
		let uriLabel = url.toString();
		if (uriLabel.length > 50) {
			uriLabel = `${uriLabel.substring(0, 35)}...${uriLabel.substring(uriLabel.length - 15)}`;
		}

		const detail = new MarkdownString('', { supportHtml: true });
		detail.appendMarkdown(localize('confirmOpenDetail2', "This will access {0}.\n\n", `[${uriLabel}](${url.toString()})`));
		detail.appendMarkdown(localize('confirmOpenDetail3', "If you did not initiate this request, it may represent an attempted attack on your system. Unless you took an explicit action to initiate this request, you should press 'No'"));

		let message: string;
		switch (promptType) {
			case PromptsType.prompt:
				message = localize('confirmInstallPrompt', "An external application wants to create a prompt file with content from a URL. Do you want to continue by selecting a destination folder and name?");
				break;
			case PromptsType.instructions:
				message = localize('confirmInstallInstructions', "An external application wants to create an instructions file with content from a URL. Do you want to continue by selecting a destination folder and name?");
				break;
			default:
				message = localize('confirmInstallAgent', "An external application wants to create a custom agent with content from a URL. Do you want to continue by selecting a destination folder and name?");
				break;
		}

		const { confirmed } = await this.dialogService.confirm({
			type: 'warning',
			primaryButton: localize({ key: 'yesButton', comment: ['&& denotes a mnemonic'] }, "&&Yes"),
			cancelButton: localize('noButton', "No"),
			message,
			custom: {
				markdownDetails: [{
					markdown: detail
				}]
			}
		});

		return !confirmed;

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/promptSyntax/runPromptAction.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/promptSyntax/runPromptAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ChatViewId, IChatWidget, IChatWidgetService } from '../chat.js';
import { ACTION_ID_NEW_CHAT, CHAT_CATEGORY, CHAT_CONFIG_MENU_ID } from '../actions/chatActions.js';
import { URI } from '../../../../../base/common/uri.js';
import { OS } from '../../../../../base/common/platform.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { assertDefined } from '../../../../../base/common/types.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { PromptsType, PROMPT_LANGUAGE_ID } from '../../common/promptSyntax/promptTypes.js';
import { ILocalizedString, localize, localize2 } from '../../../../../nls.js';
import { UILabelProvider } from '../../../../../base/common/keybindingLabels.js';
import { ICommandAction } from '../../../../../platform/action/common/action.js';
import { PromptFilePickers } from './pickers/promptFilePickers.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { EditorContextKeys } from '../../../../../editor/common/editorContextKeys.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { ResourceContextKey } from '../../../../common/contextkeys.js';
import { Action2, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IPromptsService } from '../../common/promptSyntax/service/promptsService.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';

/**
 * Condition for the `Run Current Prompt` action.
 */
const EDITOR_ACTIONS_CONDITION = ContextKeyExpr.and(
	ChatContextKeys.enabled,
	ResourceContextKey.HasResource,
	ResourceContextKey.LangId.isEqualTo(PROMPT_LANGUAGE_ID),
);

/**
 * Keybinding of the action.
 */
const COMMAND_KEY_BINDING = KeyMod.WinCtrl | KeyCode.Slash | KeyMod.Alt;

/**
 * Action ID for the `Run Current Prompt` action.
 */
const RUN_CURRENT_PROMPT_ACTION_ID = 'workbench.action.chat.run.prompt.current';

/**
 * Action ID for the `Run Prompt...` action.
 */
const RUN_SELECTED_PROMPT_ACTION_ID = 'workbench.action.chat.run.prompt';

/**
 * Action ID for the `Configure Prompt Files...` action.
 */
const CONFIGURE_PROMPTS_ACTION_ID = 'workbench.action.chat.configure.prompts';

/**
 * Constructor options for the `Run Prompt` base action.
 */
interface IRunPromptBaseActionConstructorOptions {
	/**
	 * ID of the action to be registered.
	 */
	id: string;

	/**
	 * Title of the action.
	 */
	title: ILocalizedString;

	/**
	 * Icon of the action.
	 */
	icon: ThemeIcon;

	/**
	 * Keybinding of the action.
	 */
	keybinding: number;

	/**
	 * Alt action of the UI menu item.
	 */
	alt?: ICommandAction;
}

/**
 * Base class of the `Run Prompt` action.
 */
abstract class RunPromptBaseAction extends Action2 {
	constructor(
		options: IRunPromptBaseActionConstructorOptions,
	) {
		super({
			id: options.id,
			title: options.title,
			f1: false,
			precondition: ChatContextKeys.enabled,
			category: CHAT_CATEGORY,
			icon: options.icon,
			keybinding: {
				when: ContextKeyExpr.and(
					EditorContextKeys.editorTextFocus,
					EDITOR_ACTIONS_CONDITION,
				),
				weight: KeybindingWeight.WorkbenchContrib,
				primary: options.keybinding,
			},
			menu: [
				{
					id: MenuId.EditorTitleRun,
					group: 'navigation',
					order: options.alt ? 0 : 1,
					alt: options.alt,
					when: EDITOR_ACTIONS_CONDITION,
				},
			],
		});
	}

	/**
	 * Executes the run prompt action with provided options.
	 */
	public async execute(
		resource: URI | undefined,
		inNewChat: boolean,
		accessor: ServicesAccessor,
	): Promise<IChatWidget | undefined> {
		const commandService = accessor.get(ICommandService);
		const promptsService = accessor.get(IPromptsService);
		const widgetService = accessor.get(IChatWidgetService);

		resource ||= getActivePromptFileUri(accessor);
		assertDefined(
			resource,
			'Cannot find URI resource for an active text editor.',
		);

		if (inNewChat === true) {
			await commandService.executeCommand(ACTION_ID_NEW_CHAT);
		}

		const widget = await widgetService.revealWidget();
		if (widget) {
			widget.setInput(`/${await promptsService.getPromptSlashCommandName(resource, CancellationToken.None)}`);
			// submit the prompt immediately
			await widget.acceptInput();
		}
		return widget;
	}
}

const RUN_CURRENT_PROMPT_ACTION_TITLE = localize2(
	'run-prompt.capitalized',
	"Run Prompt in Current Chat"
);
const RUN_CURRENT_PROMPT_ACTION_ICON = Codicon.playCircle;

/**
 * The default `Run Current Prompt` action.
 */
class RunCurrentPromptAction extends RunPromptBaseAction {
	constructor() {
		super({
			id: RUN_CURRENT_PROMPT_ACTION_ID,
			title: RUN_CURRENT_PROMPT_ACTION_TITLE,
			icon: RUN_CURRENT_PROMPT_ACTION_ICON,
			keybinding: COMMAND_KEY_BINDING,
		});
	}

	public override async run(
		accessor: ServicesAccessor,
		resource: URI | undefined,
	): Promise<IChatWidget | undefined> {
		return await super.execute(
			resource,
			false,
			accessor,
		);
	}
}

class RunSelectedPromptAction extends Action2 {
	constructor() {
		super({
			id: RUN_SELECTED_PROMPT_ACTION_ID,
			title: localize2('run-prompt.capitalized.ellipses', "Run Prompt..."),
			icon: Codicon.bookmark,
			f1: true,
			precondition: ChatContextKeys.enabled,
			keybinding: {
				when: ChatContextKeys.enabled,
				weight: KeybindingWeight.WorkbenchContrib,
				primary: COMMAND_KEY_BINDING,
			},
			category: CHAT_CATEGORY,
		});
	}

	public override async run(
		accessor: ServicesAccessor,
	): Promise<void> {
		const commandService = accessor.get(ICommandService);
		const instaService = accessor.get(IInstantiationService);
		const promptsService = accessor.get(IPromptsService);
		const widgetService = accessor.get(IChatWidgetService);

		const pickers = instaService.createInstance(PromptFilePickers);

		const placeholder = localize(
			'commands.prompt.select-dialog.placeholder',
			'Select the prompt file to run (hold {0}-key to use in new chat)',
			UILabelProvider.modifierLabels[OS].ctrlKey
		);

		const result = await pickers.selectPromptFile({ placeholder, type: PromptsType.prompt });

		if (result === undefined) {
			return;
		}

		const { promptFile, keyMods } = result;

		if (keyMods.ctrlCmd === true) {
			await commandService.executeCommand(ACTION_ID_NEW_CHAT);
		}

		const widget = await widgetService.revealWidget();
		if (widget) {
			widget.setInput(`/${await promptsService.getPromptSlashCommandName(promptFile, CancellationToken.None)}`);
			// submit the prompt immediately
			await widget.acceptInput();
			widget.focusInput();
		}
	}
}

class ManagePromptFilesAction extends Action2 {
	constructor() {
		super({
			id: CONFIGURE_PROMPTS_ACTION_ID,
			title: localize2('configure-prompts', "Configure Prompt Files..."),
			shortTitle: localize2('configure-prompts.short', "Prompt Files"),
			icon: Codicon.bookmark,
			f1: true,
			precondition: ChatContextKeys.enabled,
			category: CHAT_CATEGORY,
			menu: {
				id: CHAT_CONFIG_MENU_ID,
				when: ContextKeyExpr.and(ChatContextKeys.enabled, ContextKeyExpr.equals('view', ChatViewId)),
				order: 11,
				group: '0_level'
			},
		});
	}

	public override async run(
		accessor: ServicesAccessor,
	): Promise<void> {
		const openerService = accessor.get(IOpenerService);
		const instaService = accessor.get(IInstantiationService);

		const pickers = instaService.createInstance(PromptFilePickers);

		const placeholder = localize(
			'commands.prompt.manage-dialog.placeholder',
			'Select the prompt file to open'
		);

		const result = await pickers.selectPromptFile({ placeholder, type: PromptsType.prompt, optionEdit: false });
		if (result !== undefined) {
			await openerService.open(result.promptFile);
		}
	}
}


/**
 * Gets `URI` of a prompt file open in an active editor instance, if any.
 */
function getActivePromptFileUri(accessor: ServicesAccessor): URI | undefined {
	const codeEditorService = accessor.get(ICodeEditorService);
	const model = codeEditorService.getActiveCodeEditor()?.getModel();
	if (model?.getLanguageId() === PROMPT_LANGUAGE_ID) {
		return model.uri;
	}
	return undefined;
}


/**
 * Action ID for the `Run Current Prompt In New Chat` action.
 */
const RUN_CURRENT_PROMPT_IN_NEW_CHAT_ACTION_ID = 'workbench.action.chat.run-in-new-chat.prompt.current';

const RUN_IN_NEW_CHAT_ACTION_TITLE = localize2(
	'run-prompt-in-new-chat.capitalized',
	"Run Prompt In New Chat",
);

/**
 * Icon for the `Run Current Prompt In New Chat` action.
 */
const RUN_IN_NEW_CHAT_ACTION_ICON = Codicon.play;

/**
 * `Run Current Prompt In New Chat` action.
 */
class RunCurrentPromptInNewChatAction extends RunPromptBaseAction {
	constructor() {
		super({
			id: RUN_CURRENT_PROMPT_IN_NEW_CHAT_ACTION_ID,
			title: RUN_IN_NEW_CHAT_ACTION_TITLE,
			icon: RUN_IN_NEW_CHAT_ACTION_ICON,
			keybinding: COMMAND_KEY_BINDING | KeyMod.CtrlCmd,
			alt: {
				id: RUN_CURRENT_PROMPT_ACTION_ID,
				title: RUN_CURRENT_PROMPT_ACTION_TITLE,
				icon: RUN_CURRENT_PROMPT_ACTION_ICON,
			},
		});
	}

	public override async run(
		accessor: ServicesAccessor,
		resource: URI,
	): Promise<IChatWidget | undefined> {
		return await super.execute(
			resource,
			true,
			accessor,
		);
	}
}

/**
 * Helper to register all the `Run Current Prompt` actions.
 */
export function registerRunPromptActions(): void {
	registerAction2(RunCurrentPromptInNewChatAction);
	registerAction2(RunCurrentPromptAction);
	registerAction2(RunSelectedPromptAction);
	registerAction2(ManagePromptFilesAction);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/promptSyntax/saveAsPromptFileActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/promptSyntax/saveAsPromptFileActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../../base/common/network.js';
import { joinPath } from '../../../../../base/common/resources.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { ILocalizedString, localize2 } from '../../../../../nls.js';
import { ICommandActionTitle } from '../../../../../platform/action/common/action.js';
import { Action2, IAction2Options, MenuId } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ResourceContextKey } from '../../../../common/contextkeys.js';
import { ITextFileService } from '../../../../services/textfile/common/textfiles.js';
import { chatEditingWidgetFileStateContextKey, ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { getCleanPromptName } from '../../common/promptSyntax/config/promptFileLocations.js';
import { AGENT_LANGUAGE_ID, INSTRUCTIONS_LANGUAGE_ID, PROMPT_LANGUAGE_ID, PromptsType } from '../../common/promptSyntax/promptTypes.js';
import { CHAT_CATEGORY } from '../actions/chatActions.js';
import { askForPromptFileName } from './pickers/askForPromptName.js';
import { askForPromptSourceFolder } from './pickers/askForPromptSourceFolder.js';

class BaseSaveAsPromptFileAction extends Action2 {
	constructor(opts: Readonly<IAction2Options>, private readonly promptType: PromptsType) {
		super(opts);
	}

	async run(accessor: ServicesAccessor, configUri?: string): Promise<void> {
		const instantiationService = accessor.get(IInstantiationService);
		const codeEditorService = accessor.get(ICodeEditorService);
		const textFileService = accessor.get(ITextFileService);
		const fileService = accessor.get(IFileService);
		const activeCodeEditor = codeEditorService.getActiveCodeEditor();
		if (!activeCodeEditor) {
			return;
		}
		const model = activeCodeEditor.getModel();
		if (!model) {
			return;
		}
		const newFolder = await instantiationService.invokeFunction(askForPromptSourceFolder, this.promptType, undefined, true);
		if (!newFolder) {
			return;
		}
		const newName = await instantiationService.invokeFunction(askForPromptFileName, this.promptType, newFolder.uri, getCleanPromptName(model.uri));
		if (!newName) {
			return;
		}
		const newFile = joinPath(newFolder.uri, newName);
		if (model.uri.scheme === Schemas.untitled) {
			await textFileService.saveAs(model.uri, newFile, { from: model.uri });
		} else {
			await fileService.copy(model.uri, newFile);
		}
		await codeEditorService.openCodeEditor({ resource: newFile }, activeCodeEditor);
	}
}

function createOptions(id: string, title: ICommandActionTitle, description: ILocalizedString, languageId: string): Readonly<IAction2Options> {
	return {
		id: id,
		title: title,
		metadata: {
			description: description,
		},
		category: CHAT_CATEGORY,
		f1: false,
		menu: {
			id: MenuId.EditorContent,
			when: ContextKeyExpr.and(
				ContextKeyExpr.equals(ResourceContextKey.Scheme.key, Schemas.untitled),
				ContextKeyExpr.equals(ResourceContextKey.LangId.key, languageId),
				ContextKeyExpr.notEquals(chatEditingWidgetFileStateContextKey.key, ModifiedFileEntryState.Modified),
			)
		}
	};
}

export const SAVE_AS_PROMPT_FILE_ACTION_ID = 'workbench.action.chat.save-as-prompt';

export class SaveAsPromptFileAction extends BaseSaveAsPromptFileAction {
	constructor() {
		super(createOptions(SAVE_AS_PROMPT_FILE_ACTION_ID, localize2('promptfile.savePromptFile', "Save As Prompt File"), localize2('promptfile.savePromptFile.description', "Save as prompt file"), PROMPT_LANGUAGE_ID), PromptsType.prompt);
	}
}

export const SAVE_AS_AGENT_FILE_ACTION_ID = 'workbench.action.chat.save-as-agent';

export class SaveAsAgentFileAction extends BaseSaveAsPromptFileAction {
	constructor() {
		super(createOptions(SAVE_AS_AGENT_FILE_ACTION_ID, localize2('promptfile.saveAgentFile', "Save As Agent File"), localize2('promptfile.saveAgentFile.description', "Save as agent file"), AGENT_LANGUAGE_ID), PromptsType.agent);
	}
}

export const SAVE_AS_INSTRUCTIONS_FILE_ACTION_ID = 'workbench.action.chat.save-as-instructions';

export class SaveAsInstructionsFileAction extends BaseSaveAsPromptFileAction {
	constructor() {
		super(createOptions(SAVE_AS_INSTRUCTIONS_FILE_ACTION_ID, localize2('promptfile.saveInstructionsFile', "Save As Instructions File"), localize2('promptfile.saveInstructionsFile.description', "Save as instructions file"), INSTRUCTIONS_LANGUAGE_ID), PromptsType.instructions);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/promptSyntax/pickers/askForPromptName.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/promptSyntax/pickers/askForPromptName.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../../nls.js';
import { getPromptFileExtension } from '../../../common/promptSyntax/config/promptFileLocations.js';
import { PromptsType } from '../../../common/promptSyntax/promptTypes.js';
import { IQuickInputService } from '../../../../../../platform/quickinput/common/quickInput.js';
import { URI } from '../../../../../../base/common/uri.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import Severity from '../../../../../../base/common/severity.js';
import { isValidBasename } from '../../../../../../base/common/extpath.js';
import { ServicesAccessor } from '../../../../../../editor/browser/editorExtensions.js';

/**
 * Asks the user for a file name.
 */
export async function askForPromptFileName(
	accessor: ServicesAccessor,
	type: PromptsType,
	selectedFolder: URI,
	existingFileName?: string
): Promise<string | undefined> {
	const quickInputService = accessor.get(IQuickInputService);
	const fileService = accessor.get(IFileService);

	const sanitizeInput = (input: string) => {
		const trimmedName = input.trim();
		if (!trimmedName) {
			return undefined;
		}

		const fileExtension = getPromptFileExtension(type);
		return (trimmedName.endsWith(fileExtension))
			? trimmedName
			: `${trimmedName}${fileExtension}`;
	};

	const validateInput = async (value: string) => {
		const fileName = sanitizeInput(value);
		if (!fileName) {
			return {
				content: localize('askForPromptFileName.error.empty', "Please enter a name."),
				severity: Severity.Warning
			};
		}

		if (!isValidBasename(fileName)) {
			return {
				content: localize('askForPromptFileName.error.invalid', "The name contains invalid characters."),
				severity: Severity.Error
			};
		}

		const fileUri = URI.joinPath(selectedFolder, fileName);
		if (await fileService.exists(fileUri)) {
			return {
				content: localize('askForPromptFileName.error.exists', "A file for the given name already exists."),
				severity: Severity.Error
			};
		}

		return undefined;
	};
	const placeHolder = existingFileName ? getPlaceholderStringForRename(type) : getPlaceholderStringForNew(type);
	const result = await quickInputService.input({ placeHolder, validateInput, value: existingFileName });
	if (!result) {
		return undefined;
	}

	return sanitizeInput(result);
}

function getPlaceholderStringForNew(type: PromptsType): string {
	switch (type) {
		case PromptsType.instructions:
			return localize('askForInstructionsFileName.placeholder', "Enter the name of the instructions file");
		case PromptsType.prompt:
			return localize('askForPromptFileName.placeholder', "Enter the name of the prompt file");
		case PromptsType.agent:
			return localize('askForAgentFileName.placeholder', "Enter the name of the agent file");
		default:
			throw new Error('Unknown prompt type');
	}
}

function getPlaceholderStringForRename(type: PromptsType): string {
	switch (type) {
		case PromptsType.instructions:
			return localize('askForRenamedInstructionsFileName.placeholder', "Enter a new name of the instructions file");
		case PromptsType.prompt:
			return localize('askForRenamedPromptFileName.placeholder', "Enter a new name of the prompt file");
		case PromptsType.agent:
			return localize('askForRenamedAgentFileName.placeholder', "Enter a new name of the agent file");
		default:
			throw new Error('Unknown prompt type');
	}
}
```

--------------------------------------------------------------------------------

````

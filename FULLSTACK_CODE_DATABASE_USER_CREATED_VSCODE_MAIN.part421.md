---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 421
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 421 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebook.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebook.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notebookOverlay.notebook-editor {
	box-sizing: border-box;
	line-height: 22px;
	user-select: initial;
	-webkit-user-select: initial;
	position: relative;
}

.monaco-workbench .notebookOverlay.notebook-editor .monaco-editor {
	line-height: 1.4em;
}

.monaco-workbench .notebookOverlay .cell-list-container > .monaco-list {
	position: absolute;
}

.monaco-workbench .notebookOverlay .cell-list-container .monaco-list-rows {
	min-height: 100%;
	overflow: visible !important;
}

.monaco-workbench .notebookOverlay .cell-list-container .overflowingContentWidgets > div {
	white-space: normal;
}

.monaco-workbench .notebookOverlay .cell-list-container .overflowingContentWidgets > div {
	/* @rebornix: larger than the editor title bar */
	z-index: 600 !important;
}


.monaco-workbench .notebookOverlay .cell-list-container .overflowingContentWidgets > div.parameter-hints-widget {
	z-index: 639 !important;
}

.monaco-workbench .notebookOverlay .cell-list-container .overflowingContentWidgets > div.suggest-widget {
	z-index: 640 !important;
}

.monaco-workbench .notebookOverlay .cell-list-container .overflowingContentWidgets > div .suggest-details-container {
	z-index: 641 !important;
}

.monaco-workbench .notebookOverlay .cell-list-container .monaco-editor .zone-widget.interactive-editor-widget .interactive-editor .markdownMessage {
	white-space: normal;
}

.monaco-workbench .notebookOverlay .cell-list-container {
	position: relative;
}

.monaco-workbench .notebookOverlay.global-drag-active .webview {
	pointer-events: none;
}

.monaco-workbench .notebookOverlay .cell-list-container .webview-cover {
	position: absolute;
	top: 0;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row {
	cursor: default;
	overflow: visible !important;
	width: 100%;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .notebook-gutter > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row {
	cursor: default;
	overflow: visible !important;
	width: 100%;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell {
	display: flex;
	position: relative;
}


.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .menu {
	position: absolute;
	left: 0;
	top: 28px;
	visibility: hidden;
	width: 16px;
	margin: auto;
	padding-left: 4px;
}


.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .menu.mouseover,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row:hover .menu,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-output-hover .menu {
	visibility: visible;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row:hover,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-output-hover {
	outline: none !important;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused {
	outline: none !important;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .input-collapse-container {
	display: flex;
	align-items: center;
	position: relative;
	box-sizing: border-box;
	width: 100%;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .input-collapse-container .collapsed-execution-icon {
	line-height: normal;
	margin-left: 6px;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .input-collapse-container .collapsed-execution-icon .codicon-notebook-state-success {
	color: var(--vscode-notebookStatusSuccessIcon-foreground);
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .input-collapse-container .collapsed-execution-icon .codicon-notebook-state-error {
	color: var(--vscode-notebookStatusErrorIcon-foreground);
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .input-collapse-container .cell-collapse-preview {
	padding: 0px 8px;
	display: flex;
	align-items: center;
}
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .input-collapse-container .cell-collapse-preview .monaco-tokenized-source {
	font-size: var(--notebook-cell-input-preview-font-size);
	font-family: var(--notebook-cell-input-preview-font-family);
	cursor: pointer;
	white-space: normal;
	overflow: hidden;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .input-collapse-container .cell-collapse-preview .expandInputIcon {
	padding: 2px;
	border-radius: 5px;
	height: 16px;
	width: 16px;

	cursor: pointer;
	z-index: var(--z-index-notebook-input-collapse-condicon);
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .input-collapse-container .cell-collapse-preview .expandInputIcon:before {
	color: grey;
	font-size: 12px;
	line-height: 16px;
	vertical-align: bottom;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .output-collapse-container {
	cursor: pointer;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .output-collapse-container .expandOutputPlaceholder {
	font-style: italic;
	font-size: var(--notebook-cell-output-font-size);
	font-family: var(--monaco-monospace-font);
	min-height: 24px;
	opacity: 0.7;
	user-select: none;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .output-collapse-container .expandOutputIcon {
	position: relative;
	left: 0px;
	padding: 2px;
	border-radius: 5px;
	vertical-align:middle;
	margin-left: 4px;
	height: 16px;
	width: 16px;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-expand-part-button {
	position: relative;
	left: 0px;
	padding: 2px;
	border-radius: 5px;
	vertical-align: middle;
	margin-left: 4px;
	height: 16px;
	width: 16px;
	z-index: var(--z-index-notebook-cell-expand-part-button);
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .output-collapse-container .expandOutputIcon:before {
	color: grey;
	font-size: 12px;
	line-height: 16px;
	vertical-align: bottom;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-expand-part-button:before {
	color: grey;
	font-size: 12px;
	line-height: 16px;
	vertical-align: bottom;
}

.monaco-workbench.hc-black .notebookOverlay .monaco-list-row.focused .cell-editor-focus .cell-editor-part:before,
.monaco-workbench.hc-light .notebookOverlay .monaco-list-row.focused .cell-editor-focus .cell-editor-part:before {
	outline-style: dashed;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .menu.mouseover,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .menu:hover {
	cursor: pointer;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .run-button-container {
	position: absolute;
	flex-shrink: 0;
	z-index: var(--z-index-run-button-container);
	width: 35px;
	left: -35px;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .run-button-container .monaco-toolbar {
	visibility: hidden;
	height: initial;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .run-button-container .monaco-toolbar .action-item:not(.monaco-dropdown-with-primary) .codicon {
	padding: 6px;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .run-button-container .monaco-toolbar .actions-container {
	justify-content: center;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row:hover .run-button-container .monaco-toolbar,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused .run-button-container .monaco-toolbar,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-run-toolbar-dropdown-active .run-button-container .monaco-toolbar,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-output-hover .run-button-container .monaco-toolbar {
	visibility: visible;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .execution-count-label {
	position: absolute;
	font-size: 10px;
	font-family: var(--monaco-monospace-font);
	white-space: pre;
	box-sizing: border-box;
	opacity: .7;
	width: 35px;
	right: 0px;
	text-align: center;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-statusbar-hidden .execution-count-label {
	line-height: 15px;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .execution-count-label .codicon {
	font-size: 14px;
}

.monaco-workbench .notebookOverlay .cell .cell-editor-part {
	position: relative;
}

.monaco-workbench .notebookOverlay .cell .monaco-progress-container {
	top: -3px;
	position: absolute;
	left: 0;
	z-index: var(--z-index-notebook-progress-bar);
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list:not(.element-focused):focus:before {
	outline: none !important;
}

.monaco-workbench .notebookOverlay.notebook-editor > .cell-list-container > .monaco-list > .monaco-scrollable-element > .scrollbar.visible {
	z-index: var(--z-index-notebook-scrollbar);
	cursor: default;
}

.monaco-workbench .notebookOverlay .monaco-list-row .cell-editor-part:before {
	z-index: var(--z-index-notebook-cell-editor-outline);
	content: "";
	right: 0px;
	left: 0px;
	top: 0px;
	bottom: 0px;
	outline-offset: -1px;
	display: block;
	position: absolute;
	pointer-events: none;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-insertion-indicator-top {
	top: -15px;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .cell-list-insertion-indicator {
	position: absolute;
	height: 2px;
	left: 0px;
	right: 0px;
	opacity: 0;
	z-index: var(--z-index-notebook-list-insertion-indicator);
}

/** Theming */

.monaco-action-bar .action-item.verticalSeparator {
	width: 1px !important;
	height: 16px !important;
	margin: 5px 4px !important;
	cursor: default;
	min-width: 1px !important;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-decoration {
	top: -6px;
	position: absolute;
	display: flex;
}


.cell-contributed-items.cell-contributed-items-left {
	margin-left: 4px;
}

.cell-contributed-items.cell-contributed-items-right {
	flex-direction: row-reverse;
}

.monaco-workbench .notebookOverlay > .cell-list-container .notebook-overview-ruler-container {
	position: absolute;
	top: 0;
	right: 0;
}

/* high contrast border for multi-select */
.hc-black .notebookOverlay .monaco-list.selection-multiple:focus-within .monaco-list-row.selected:not(.focused) .cell-focus-indicator-top:before, .hc-light .notebookOverlay .monaco-list.selection-multiple:focus-within .monaco-list-row.selected:not(.focused) .cell-focus-indicator-top:before { border-top-style: dotted; }
.hc-black .notebookOverlay .monaco-list.selection-multiple:focus-within .monaco-list-row.selected:not(.focused) .cell-focus-indicator-bottom:before, .hc-light .notebookOverlay .monaco-list.selection-multiple:focus-within .monaco-list-row.selected:not(.focused) .cell-focus-indicator-bottom:before { border-bottom-style: dotted; }
.hc-black .notebookOverlay .monaco-list.selection-multiple:focus-within .monaco-list-row.selected:not(.focused) .cell-inner-container:not(.cell-editor-focus) .cell-focus-indicator-left:before, .hc-light .notebookOverlay .monaco-list.selection-multiple:focus-within .monaco-list-row.selected:not(.focused) .cell-inner-container:not(.cell-editor-focus) .cell-focus-indicator-left:before { border-left-style: dotted; }
.hc-black .notebookOverlay .monaco-list.selection-multiple:focus-within .monaco-list-row.selected:not(.focused) .cell-inner-container:not(.cell-editor-focus) .cell-focus-indicator-right:before, .hc-light .notebookOverlay .monaco-list.selection-multiple:focus-within .monaco-list-row.selected:not(.focused) .cell-inner-container:not(.cell-editor-focus) .cell-focus-indicator-right:before  { border-right-style: dotted; }

/** Notebook Cell Comments */

.cell-comment-container.review-widget {
	border-left: 1px solid var(--vscode-peekView-border); border-right: 1px solid var(--vscode-peekView-border);
	/* Restore text-wrap to default value to avoid inheriting nowrap from monaco-list. */
	text-wrap: initial;
}

.cell-comment-container.review-widget > .head {
	border-top: 1px solid var(--vscode-peekView-border);
}

.cell-comment-container.review-widget > .body {
	border-bottom: 1px solid var(--vscode-peekView-border);
}

.cell-comment-container.review-widget {
	background-color: var(--vscode-peekViewResult-background);
}


/** Notebook editor background */
.notebookOverlay .cell-drag-image .cell-editor-container > div {
	background: var(--vscode-editor-background) !important;
}
.notebookOverlay .monaco-list-row .cell-title-toolbar,
.notebookOverlay .monaco-list-row.cell-drag-image,
.notebookOverlay .cell-bottom-toolbar-container .action-item,
.notebookOverlay .cell-list-top-cell-toolbar-container .action-item {
	background-color: var(--vscode-editor-background);
}

.monaco-workbench .notebookOverlay.notebook-editor {
	background-color: var(--vscode-notebook-editorBackground);
}

.notebookOverlay .cell .monaco-editor-background,
.notebookOverlay .cell .margin-view-overlays,
.notebookOverlay .cell .cell-statusbar-container {
	background: var(--vscode-notebook-cellEditorBackground, var(--vscode-editor-background));
}

/** Cell toolbar separator */

.notebookOverlay .monaco-list-row .cell-title-toolbar,
.notebookOverlay .cell-bottom-toolbar-container .action-item,
.notebookOverlay .cell-list-top-cell-toolbar-container .action-item {
	border: solid 1px var(--vscode-notebook-cellToolbarSeparator);
}
.notebookOverlay .monaco-action-bar .action-item.verticalSeparator {
	background-color: var(--vscode-notebook-cellToolbarSeparator);
}
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .input-collapse-container {
	border-bottom: solid 1px var(--vscode-notebook-cellToolbarSeparator);
}

/** Focused cell background */

.notebookOverlay .code-cell-row.focused .cell-focus-indicator,
.notebookOverlay .markdown-cell-row.focused,
.notebookOverlay .code-cell-row.focused .input-collapse-container {
	background-color: var(--vscode-notebook-focusedCellBackground) !important;
}

/** Selected cell background */
.notebookOverlay .monaco-list.selection-multiple .markdown-cell-row.selected,
.notebookOverlay .monaco-list.selection-multiple .markdown-cell-row.selected .cell-focus-indicator-bottom,
.notebookOverlay .monaco-list.selection-multiple .code-cell-row.selected .cell-focus-indicator-top,
.notebookOverlay .monaco-list.selection-multiple .code-cell-row.selected .cell-focus-indicator-left,
.notebookOverlay .monaco-list.selection-multiple .code-cell-row.selected .cell-focus-indicator-right,
.notebookOverlay .monaco-list.selection-multiple .code-cell-row.selected .cell-focus-indicator-bottom {
	background-color: var(--vscode-notebook-selectedCellBackground, inherit) !important;
}

.notebookOverlay .monaco-list.selection-multiple:focus-within .monaco-list-row.selected .cell-focus-indicator-top:before,
.notebookOverlay .monaco-list.selection-multiple:focus-within .monaco-list-row.selected .cell-focus-indicator-bottom:before,
.notebookOverlay .monaco-list.selection-multiple:focus-within .monaco-list-row.selected .cell-inner-container:not(.cell-editor-focus) .cell-focus-indicator-left:before,
.notebookOverlay .monaco-list.selection-multiple:focus-within .monaco-list-row.selected .cell-inner-container:not(.cell-editor-focus) .cell-focus-indicator-right:before {
	border-color: var(--vscode-notebook-inactiveSelectedCellBorder, transparent) !important;
}

/** Cell hover background */
.notebookOverlay .code-cell-row:not(.focused):hover .cell-focus-indicator,
.notebookOverlay .code-cell-row:not(.focused).cell-output-hover .cell-focus-indicator,
.notebookOverlay .markdown-cell-row:not(.focused):hover {
	background-color: var(--vscode-notebook-cellHoverBackground) !important;
}

.notebookOverlay .code-cell-row:not(.focused):hover .input-collapse-container,
.notebookOverlay .code-cell-row:not(.focused).cell-output-hover .input-collapse-container {
	background-color: var(--vscode-notebook-cellHoverBackground);
}

/** Cell symbol higlight */
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.code-cell-row.nb-symbolHighlight .cell-focus-indicator,
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.markdown-cell-row.nb-symbolHighlight {
	background-color: var(--vscode-notebook-symbolHighlightBackground) !important;
}

/** Cell execution inline vars */
.nb-inline-value {
	background-color: var(--vscode-editorInlayHint-background);
	color: var(--vscode-editorInlayHint-foreground) !important;
	font-size: 90%;
}

/** Notebook Textual Selection Highlight */
.nb-selection-highlight {
	background-color: var(--vscode-editor-selectionHighlightBackground);
}

/** Cell Multi-Cursor Cursor highlight */
/* -- base selection styling -- */
.nb-multicursor-selection {
	top: 0;
	min-width: 1.9px;
	background-color: var(--vscode-editor-selectionBackground);

	/* unsure about these two */
	overflow: hidden;
	box-sizing: border-box;
}
/* -- base cursor styling -- */
.nb-multicursor-cursor {
	top: 0;
	min-width: 1.9px;
	/* z-index: 10000000; */
	background-color: #AEAFAD;

	/* unsure about these two */
	overflow: hidden;
	box-sizing: border-box;
}
/* ======================================================================== */
/* ======================================================================== */
/* -- block-style -- */
.nb-cursor-block-style {
	width: 8px !important;
}
/* -- underline-style -- */
.nb-cursor-underline-style {
	width: 8px !important;
	border-bottom-width: 2px;
	border-bottom-style: solid;
	background: transparent;
}
/* -- line-thin-style -- */
.nb-cursor-line-thin-style {
	min-width: none;
	width: 0.9px !important;
}
/* -- block-outline-style -- */
.nb-cursor-block-outline-style {
	width: 8px !important;
	border-width: 1px;
	border-style: solid;
	background: transparent;
}
/* -- underline-thin-style -- */
.nb-cursor-underline-thin-style {
	width: 8px !important;
	border-bottom-width: 1px;
	border-bottom-style: solid;
	background: transparent;
}
/* ======================================================================== */
/* ======================================================================== */
/* -- cursor animations -- */
.nb-blink {
	animation: nb-cursor-blink 1s step-end infinite;
}
.nb-smooth {
	animation: nb-cursor-smooth 0.5s ease-in-out 0.5s infinite alternate;
}
.nb-phase {
	animation: nb-cursor-phase 0.5s ease-in-out 0.5s infinite alternate;
}
.nb-expand{
	animation: nb-cursor-expand 0.5s ease-in-out 0.5s infinite alternate;
}
.nb-smooth-caret-animation {
	transition: all 80ms;
}

/* -- animation keyframes -- */
@keyframes nb-cursor-blink {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
@keyframes nb-cursor-smooth {
	0%,
	20% {
		opacity: 1;
	}
	60%,
	100% {
		opacity: 0;
	}
}
@keyframes nb-cursor-phase {
	0%,
	20% {
		opacity: 1;
	}
	90%,
	100% {
		opacity: 0;
	}
}
@keyframes nb-cursor-expand {
	0%,
	20% {
		transform: scaleY(1);
	}
	80%,
	100% {
		transform: scaleY(0);
	}
}

/** Cell Search Range selection highlight */
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.code-cell-row.nb-multiCellHighlight .cell-focus-indicator,
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.markdown-cell-row.nb-multiCellHighlight {
	background-color: var(--vscode-notebook-symbolHighlightBackground) !important;
}

/** Cell focused editor border */
.notebookOverlay .monaco-list:focus-within .monaco-list-row.focused .cell-editor-focus .cell-editor-part:before {
	outline: solid 1px var(--vscode-notebook-focusedEditorBorder);
}

/** Cell border color */
.notebookOverlay .cell.markdown h1 { border-color: var(--vscode-notebook-cellBorderColor); }
.notebookOverlay .monaco-list-row .cell-editor-part:before { outline: solid 1px var(--vscode-notebook-cellBorderColor); }

/** Cell status bar */
.monaco-workbench .notebookOverlay .cell-statusbar-container .cell-language-picker:hover,
.monaco-workbench .notebookOverlay .cell-statusbar-container .cell-status-item.cell-status-item-has-command:hover {
	background-color: var(--vscode-notebook-cellStatusBarItemHoverBackground);
}

/** Insert toolbar */
.notebookOverlay > .cell-list-container > .cell-list-insertion-indicator {
	background-color: var(--vscode-notebook-cellInsertionIndicator);
}

/** Scrollbar */
.notebookOverlay .cell-list-container > .monaco-list > .monaco-scrollable-element > .scrollbar > .slider {
	background: var(--vscode-notebookScrollbarSlider-background);
}

.notebookOverlay .cell-list-container > .monaco-list > .monaco-scrollable-element > .scrollbar > .slider:hover {
	background: var(--vscode-notebookScrollbarSlider-hoverBackground);
}

.notebookOverlay .cell-list-container > .monaco-list > .monaco-scrollable-element > .scrollbar > .slider.active {
	background: var(--vscode-notebookScrollbarSlider-activeBackground);
}

/** Cell expand */
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .expandInputIcon:hover,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .expandOutputIcon:hover,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-expand-part-button:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

/** Cell insertion/deletion */
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.code-cell-row.nb-cell-modified .cell-focus-indicator {
	background-color: var(--vscode-editorGutter-modifiedBackground) !important;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.markdown-cell-row.nb-cell-modified {
	background-color: var(--vscode-editorGutter-modifiedBackground) !important;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.code-cell-row.nb-cell-added .cell-focus-indicator {
	background-color: var(--vscode-diffEditor-insertedTextBackground) !important;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.markdown-cell-row.nb-cell-added {
	background-color: var(--vscode-diffEditor-insertedTextBackground) !important;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.code-cell-row.nb-cell-deleted .cell-focus-indicator {
	background-color: var(--vscode-diffEditor-removedTextBackground) !important;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.markdown-cell-row.nb-cell-deleted {
	background-color: var(--vscode-diffEditor-removedTextBackground) !important;
}

.monaco-workbench .notebookOverlay .codicon-debug-continue { color: var(--vscode-icon-foreground) !important; }

/** Cell Chat **/
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.code-cell-row.nb-chatGenerationHighlight .cell-focus-indicator,
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.markdown-cell-row.nb-chatGenerationHighlight {
	background-color: var(--vscode-notebook-selectedCellBackground) !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookCellChat.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookCellChat.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notebookOverlay .cell-chat-part {
	display: none;
	color: inherit;
	padding: 6px;
	border-radius: 6px;
	border: 1px solid var(--vscode-inlineChat-border);
	background: var(--vscode-inlineChat-background);
}
.monaco-workbench .notebookOverlay .cell-chat-part .cell-chat-container {
	padding: 8px 8px 0px 8px;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat {
	color: inherit;
}

/* body */

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .body {
	display: flex;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .body .content {
	display: flex;
	box-sizing: border-box;
	outline: 1px solid var(--vscode-inlineChatInput-border);
	outline-offset: -1px;
	border-radius: 2px;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .body .content.synthetic-focus {
	outline: 1px solid var(--vscode-inlineChatInput-focusBorder);
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .body .content .input {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 2px 2px 2px 6px;
	background-color: var(--vscode-inlineChatInput-background);
	cursor: text;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .body .content .input .monaco-editor-background {
	background-color: var(--vscode-inlineChatInput-background);
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .body .content .input .editor-placeholder {
	position: absolute;
	z-index: 1;
	color: var(--vscode-inlineChatInput-placeholderForeground);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .body .content .input .editor-placeholder.hidden {
	display: none;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .body .content .input .editor-container {
	vertical-align: middle;
}
.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .body .toolbar {
	display: flex;
	flex-direction: column;
	align-self: stretch;
	padding-right: 4px;
	border-top-right-radius: 2px;
	border-bottom-right-radius: 2px;
	background: var(--vscode-inlineChatInput-background);
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .body .toolbar .actions-container {
	display: flex;
	flex-direction: row;
	gap: 4px;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .body > .widget-toolbar {
	padding-left: 4px;
}

/* progress bit */

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .progress {
	position: relative;
	width: calc(100% - 18px);
	left: 19px;
}

/* UGLY - fighting against workbench styles */
.monaco-workbench .part.editor > .content .monaco-editor .inline-chat .progress .monaco-progress-container {
	top: 0;
}

/* status */

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status {
	margin-top: 4px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status.actions {
	margin-top: 4px;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .actions.hidden {
	display: none;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .label {
	overflow: hidden;
	color: var(--vscode-descriptionForeground);
	font-size: 11px;
	align-self: baseline;
	display: flex;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .label.hidden {
	display: none;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .label.info {
	margin-right: auto;
	padding-left: 2px;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .label.info > .codicon {
	padding: 0 5px;
	font-size: 12px;
	line-height: 18px;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .label.status {
	padding-left: 10px;
	padding-right: 4px;
	margin-left: auto;
	align-self: center;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .label .slash-command-pill CODE {
	border-radius: 3px;
	padding: 0 1px;
	background-color: var(--vscode-chat-slashCommandBackground);
	color: var(--vscode-chat-slashCommandForeground);
}


.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .markdownMessage {
	padding: 10px 5px;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .markdownMessage.hidden {
	display: none;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .markdownMessage .message * {
	margin: unset;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .markdownMessage .message code {
	font-family: var(--monaco-monospace-font);
	font-size: 12px;
	color: var(--vscode-textPreformat-foreground);
	background-color: var(--vscode-textPreformat-background);
	padding: 1px 3px;
	border-radius: 4px;
	border: 1px solid var(--vscode-textPreformat-border);
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .markdownMessage .message .interactive-result-code-block {
	margin: 16px 0;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .markdownMessage .message {
	line-clamp: initial;
	-webkit-line-clamp: initial;
	-webkit-box-orient: vertical;
	overflow: hidden;
	display: -webkit-box;
	-webkit-user-select: text;
	user-select: text;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .label A {
	color: var(--vscode-textLink-foreground);
	cursor: pointer;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .label.error {
	color: var(--vscode-errorForeground);
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .label.warn {
	color: var(--vscode-editorWarning-foreground);
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .actions  {
	display: flex;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .actions > .monaco-button,
.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .actions > .monaco-button-dropdown {
	margin-right: 6px;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .actions > .monaco-button-dropdown > .monaco-dropdown-button {
	display: flex;
	align-items: center;
	padding: 0 4px;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .actions > .monaco-button.codicon {
	display: flex;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .actions > .monaco-button.codicon::before {
	align-self: center;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .actions .monaco-text-button {
	padding: 2px 4px;
	white-space: nowrap;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .monaco-toolbar .action-item {
	padding: 0 2px;
}

/* TODO@jrieken not needed? */
.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .monaco-toolbar .action-label.checked {
	color: var(--vscode-inputOption-activeForeground);
	background-color: var(--vscode-inputOption-activeBackground);
	outline: 1px solid var(--vscode-inputOption-activeBorder);
}


.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .status .monaco-toolbar .action-item.button-item .action-label:is(:hover, :focus) {
	background-color: var(--vscode-button-hoverBackground);
}

/* preview */

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .preview {
	display: none;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .previewDiff {
	display: inherit;
	padding: 6px;
	border: 1px solid var(--vscode-inlineChat-border);
	border-top: none;
	border-bottom-left-radius: 2px;
	border-bottom-right-radius: 2px;
	margin: 0 2px 6px 2px;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .previewCreateTitle {
	padding-top: 6px;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .previewCreate {
	display: inherit;
	padding: 6px;
	border: 1px solid var(--vscode-inlineChat-border);
	border-radius: 2px;
	margin: 0 2px 6px 2px;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .previewDiff.hidden,
.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .previewCreate.hidden,
.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat .previewCreateTitle.hidden {
	display: none;
}

/* decoration styles */

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat-lines-deleted-range-inline {
	text-decoration: line-through;
	background-color: var(--vscode-diffEditor-removedTextBackground);
	opacity: 0.6;
}
.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat-lines-inserted-range {
	background-color: var(--vscode-diffEditor-insertedTextBackground);
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat-block-selection {
	background-color: var(--vscode-inlineChat-regionHighlight);
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat-slash-command {
	opacity: 0;
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat-slash-command-detail {
	opacity: 0.5;
}

/* diff zone */

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat-diff-widget .monaco-diff-editor .monaco-editor-background,
.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat-diff-widget .monaco-diff-editor .monaco-editor .margin-view-overlays {
	background-color: var(--vscode-inlineChat-regionHighlight);
}

/* create zone */

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat-newfile-widget {
	padding: 3px 0 6px 0;
	background-color: var(--vscode-inlineChat-regionHighlight);
}

.monaco-workbench .notebookOverlay .cell-chat-part .inline-chat-newfile-widget .title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 3px 6px 3px 0;
}

/* gutter decoration */

.monaco-workbench .notebookOverlay .cell-chat-part .glyph-margin-widgets .cgmr.codicon-inline-chat-opaque,
.monaco-workbench .notebookOverlay .cell-chat-part .glyph-margin-widgets .cgmr.codicon-inline-chat-transparent {
	display: block;
	cursor: pointer;
	transition: opacity .2s ease-in-out;
}

.monaco-workbench .notebookOverlay .cell-chat-part .glyph-margin-widgets .cgmr.codicon-inline-chat-opaque {
	opacity: 0.5;
}

.monaco-workbench .notebookOverlay .cell-chat-part .glyph-margin-widgets .cgmr.codicon-inline-chat-transparent {
	opacity: 0;
}

.monaco-workbench .notebookOverlay .cell-chat-part .glyph-margin-widgets .cgmr.codicon-inline-chat-opaque:hover,
.monaco-workbench .notebookOverlay .cell-chat-part .glyph-margin-widgets .cgmr.codicon-inline-chat-transparent:hover {
	opacity: 1;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookCellEditorHint.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookCellEditorHint.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notebookOverlay .monaco-editor .contentWidgets .empty-editor-hint {
	cursor: auto;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookCellInsertToolbar.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookCellInsertToolbar.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notebookOverlay .cell-list-top-cell-toolbar-container {
	padding-top: 1px !important;
}

.monaco-workbench .notebookOverlay .cell-list-top-cell-toolbar-container.emptyNotebook {
	opacity: 1 !important;
}

.monaco-workbench .notebookOverlay .cell-list-top-cell-toolbar-container,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-bottom-toolbar-container {
	position: absolute;
	display: flex;
	justify-content: center;
	z-index: var(--z-index-notebook-cell-bottom-toolbar-container);
	width: calc(100% - 32px);
	opacity: 0;
	padding: 0;
	margin: 0 16px 0 16px;
}

.monaco-workbench.monaco-enable-motion .notebookOverlay .cell-list-top-cell-toolbar-container,
.monaco-workbench.monaco-enable-motion .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-bottom-toolbar-container {
	transition: opacity 0.3s ease-in-out;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-bottom-toolbar-container {
	top: 0px;
	height: 33px;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image .cell-bottom-toolbar-container {
	display: none;
}

.monaco-workbench .notebookOverlay .cell-list-top-cell-toolbar-container:focus-within,
.monaco-workbench .notebookOverlay .cell-list-top-cell-toolbar-container:hover,
.monaco-workbench .notebookOverlay.notebook-editor-editable > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-bottom-toolbar-container:hover,
.monaco-workbench .notebookOverlay.notebook-editor-editable > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-bottom-toolbar-container:focus-within {
	opacity: 1;
}

.monaco-workbench .notebookOverlay .cell-list-top-cell-toolbar-container .monaco-toolbar {
	margin-top: 3px; /* This is the minimum to keep the top edge from being cut off at the top of the editor */
}

.monaco-workbench .notebookOverlay .cell-list-top-cell-toolbar-container .monaco-toolbar .action-item,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-bottom-toolbar-container .monaco-toolbar .action-item {
	display: flex;
}

.monaco-workbench .notebookOverlay .cell-list-top-cell-toolbar-container .monaco-toolbar .action-item.active,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-bottom-toolbar-container .monaco-toolbar .action-item.active {
	transform: none;
}

.monaco-workbench .notebookOverlay .cell-list-top-cell-toolbar-container .monaco-toolbar .action-label,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-bottom-toolbar-container .monaco-toolbar .action-label {
	font-size: 12px;
	margin: 0px;
	display: inline-flex;
	padding: 0px 4px;
	border-radius: 0;
	align-items: center;
}

.monaco-workbench .notebookOverlay .cell-list-top-cell-toolbar-container .monaco-toolbar .action-label .codicon,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-bottom-toolbar-container .monaco-toolbar .action-label .codicon {
	margin-right: 3px;
}

.monaco-workbench .notebookOverlay .cell-list-top-cell-toolbar-container .monaco-action-bar,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-bottom-toolbar-container .monaco-action-bar {
	display: flex;
	align-items: center;
}

.monaco-workbench .notebookOverlay .cell-list-top-cell-toolbar-container .action-item,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-bottom-toolbar-container .action-item {
	margin-left: 8px;
	margin-right: 8px;
}

.monaco-workbench .notebookOverlay .cell-list-top-cell-toolbar-container span.codicon,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-bottom-toolbar-container span.codicon {
	text-align: center;
	font-size: 14px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookCellOutput.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookCellOutput.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notebookOverlay .output {
	position: absolute;
	height: 0px;
	user-select: text;
	-webkit-user-select: text;
	cursor: auto;
	box-sizing: border-box;
	z-index: var(--z-index-notebook-output);
}

.monaco-workbench .notebookOverlay .output .cell-output-toolbar {
	left: -29px;
	width: 22px;
	z-index: var(--z-index-notebook-cell-output-toolbar);
}

.monaco-workbench .notebookOverlay .output p {
	white-space: initial;
	overflow-x: auto;
	margin: 0px;
}

.monaco-workbench .notebookOverlay .output > div.foreground {
	width: 100%;
	min-height: 24px;
	box-sizing: border-box;
}

.monaco-workbench .notebookOverlay .output > div.foreground.output-inner-container {
	width: 100%;
	box-sizing: border-box;
}

.monaco-workbench .notebookOverlay .output > div.foreground.output-inner-container .rendered-output {
	display: inline;
	transform: translate3d(0px, 0px, 0px);
}

.monaco-workbench .notebookOverlay .output .cell-output-toolbar {
	position: absolute;
	top: 4px;
	left: -32px;
	height: 16px;
	cursor: pointer;
	padding: 6px 0px;
}

.monaco-workbench .notebookOverlay .output .cell-output-toolbar .actions-container {
	justify-content: center;
}

.monaco-workbench .notebookOverlay .output pre {
	margin: 4px 0;
}

.monaco-workbench .notebookOverlay .output .error_message {
	color: red; /*TODO@rebornix theme color*/
}

.monaco-workbench .notebookOverlay .output .error > div {
	white-space: normal;
}

.monaco-workbench .notebookOverlay .output .error pre.traceback {
	margin: 8px 0;
}

.monaco-workbench .notebookOverlay .output .error .traceback > span {
	display: block;
}

.monaco-workbench .notebookOverlay .output .display img {
	max-width: 100%;
}

.monaco-workbench .notebookOverlay .output-show-more-container {
	position: absolute;
}

.monaco-workbench .notebookOverlay .output-show-more-container p {
	padding: 8px 8px 0 8px;
	margin: 0px;
}

.output-show-more {
	padding: 8px 0 0 0;
	font-style: italic;
}

.output-show-more a {
	cursor: pointer;
}

/** Cell output show more*/
.notebookOverlay .output-show-more-container a,
.notebookOverlay div.output-show-more a {
	color: var(--vscode-textLink-foreground);
}

.notebookOverlay .output-show-more-container a:active,
.notebookOverlay .output-show-more a:active {
	color: var(--vscode-textLink-activeForeground);
}

/** Notebook cell output background */
.notebookOverlay .output,
.notebookOverlay .output-element,
.notebookOverlay .output-show-more-container {
	background-color: var(--vscode-notebook-outputContainerBackgroundColor);
}

.notebookOverlay .output-element {
	border-top: none !important; border: 1px solid transparent; border-color: var(--vscode-notebook-outputContainerBorderColor) !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookCellStatusBar.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookCellStatusBar.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notebookOverlay .cell-statusbar-container {
	height: 22px;
	font-size: 12px;
	display: flex;
	position: relative;
	overflow: hidden;
	cursor: default;
}

.monaco-workbench .notebookOverlay .cell-statusbar-hidden .cell-statusbar-container {
	display: none;
}

.monaco-workbench .notebookOverlay .cell-statusbar-container .cell-status-left {
	display: flex;
	flex-grow: 1;
}

.monaco-workbench .notebookOverlay .cell-statusbar-container .cell-status-left,
.monaco-workbench .notebookOverlay .cell-statusbar-container .cell-status-right {
	display: flex;
	z-index: var(--z-index-notebook-cell-status);
}

.monaco-workbench .notebookOverlay .cell-statusbar-container .cell-status-right .cell-contributed-items {
	justify-content: flex-end;
}

.monaco-workbench .notebookOverlay .cell-statusbar-container .cell-contributed-items {
	display: flex;
	flex-wrap: wrap;
	overflow: hidden;
}

.monaco-workbench .notebookOverlay .cell-statusbar-container .cell-status-item {
	display: flex;
	align-items: center;
	white-space: pre;

	height: 21px; /* Editor outline is -1px in, don't overlap */
	margin: 0px 3px;
	padding: 0px 3px;
	overflow: hidden;
	text-overflow: clip;
}

.monaco-workbench .notebookOverlay .cell-statusbar-container .cell-status-item.cell-status-item-has-command {
	cursor: pointer;
}

.monaco-workbench .notebookOverlay .cell-statusbar-container .cell-status-left > .cell-contributed-items {
	margin-left: 10px;
}

.monaco-workbench .notebookOverlay .cell-statusbar-container .codicon {
	font-size: 14px;
	color: unset; /* Inherit from parent cell-status-item */
}

.monaco-workbench .notebookOverlay .cell-statusbar-container .cell-status-item-show-when-active {
	display: none;
}

.monaco-workbench .notebookOverlay .cell-statusbar-container.is-active-cell .cell-status-item-show-when-active {
	display: initial;
}

/* Ensure execution status icons always maintain their themed colors */
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-statusbar-container .cell-status-item .codicon-notebook-state-success {
	color: var(--vscode-notebookStatusSuccessIcon-foreground);
}
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-statusbar-container .cell-status-item .codicon-notebook-state-error {
	color: var(--vscode-notebookStatusErrorIcon-foreground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookCellTitleToolbar.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookCellTitleToolbar.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-title-toolbar {
	opacity: 0;
	display: inline-flex;
	position: absolute;
	height: 26px;
	top: -14px;
	/* this lines up the bottom toolbar border with the current line when on line 01 */
	z-index: var(--z-index-notebook-cell-toolbar);
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-toolbar-dropdown-active .cell-title-toolbar {
	z-index: var(--z-index-notebook-cell-toolbar-dropdown-active);
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-title-toolbar .action-item.menu-entry {
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	margin: 1px 2px;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-title-toolbar .action-item .action-label {
	display: flex;
	align-items: center;
	margin: auto;
}


.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-title-toolbar .action-item .monaco-dropdown {
	width: 100%;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-title-toolbar .action-item .monaco-dropdown .dropdown-label {
	display: flex;
}

/* toolbar visible on hover */
.monaco-workbench .notebookOverlay.cell-toolbar-hover > .cell-list-container > .monaco-list:focus-within > .monaco-scrollable-element > .monaco-list-rows:not(:hover) > .monaco-list-row.focused .cell-has-toolbar-actions .cell-title-toolbar,
.monaco-workbench .notebookOverlay.cell-toolbar-hover > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row:hover .cell-has-toolbar-actions .cell-title-toolbar,
.monaco-workbench .notebookOverlay.cell-toolbar-hover > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .markdown-cell-hover.cell-has-toolbar-actions .cell-title-toolbar,
.monaco-workbench .notebookOverlay.cell-toolbar-hover > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-has-toolbar-actions.cell-output-hover .cell-title-toolbar,
.monaco-workbench .notebookOverlay.cell-toolbar-hover > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-has-toolbar-actions:hover .cell-title-toolbar,
.monaco-workbench .notebookOverlay.cell-toolbar-hover > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-title-toolbar:hover,
.monaco-workbench .notebookOverlay.cell-toolbar-hover > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-toolbar-dropdown-active .cell-title-toolbar {
	opacity: 1;
}

/* toolbar visible on click */
.monaco-workbench .notebookOverlay.cell-toolbar-click > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .cell-title-toolbar {
	visibility: hidden;
}
.monaco-workbench .notebookOverlay.cell-toolbar-click > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused .cell-title-toolbar {
	opacity: 1;
	visibility: visible;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookChatEditController.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookChatEditController.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .view-zones .cell-editor-container > div {
	padding: 12px 16px;
}

/** Cell delete higlight */
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .view-zones .cell-inner-container {
	background-color: var(--vscode-diffEditor-removedLineBackground);
	padding: 8px 0;
	margin-bottom: 16px;
}

/** Cell insert higlight */
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.code-cell-row.nb-insertHighlight .cell-focus-indicator,
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.markdown-cell-row.nb-insertHighlight {
	background-color: var(--vscode-diffEditor-insertedLineBackground, var(--vscode-diffEditor-insertedTextBackground)) !important;
}

.notebookOverlay .cell .cell-statusbar-container .monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.code-cell-row.nb-insertHighlight .cell-focus-indicator .cell-inner-container,
.notebookOverlay .cell .cell-statusbar-container .monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.markdown-cell-row.nb-insertHighlight .cell-focus-indicator .cell-inner-container,
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.code-cell-row.nb-insertHighlight .monaco-editor-background,
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.markdown-cell-row.nb-insertHighlight .monaco-editor-background,
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.code-cell-row.nb-insertHighlight .margin-view-overlays,
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.markdown-cell-row.nb-insertHighlight .margin-view-overlays,
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.code-cell-row.nb-insertHighlight .cell-statusbar-container {
	background-color: var(--vscode-diffEditor-insertedLineBackground, var(--vscode-diffEditor-insertedTextBackground)) !important;
}
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.markdown-cell-row.nb-insertHighlight .cell-statusbar-container {
	background-color: inherit !important;
}

.monaco-workbench .notebookOverlay .view-zones .cell-editor-part {
	outline: solid 1px var(--vscode-notebook-cellBorderColor);
}


.monaco-workbench .notebookOverlay .view-zones .cell-editor-container > div > div {
	line-height: initial;
	overflow-x: hidden;
	font-family: var(--notebook-editor-font-family);
}

.monaco-workbench .notebookOverlay .view-zones .cell-editor-container > div > div span {
	font-family: var(--notebook-editor-font-family);
	font-size: var(--notebook-editor-font-size);
	font-weight: var(--notebook-editor-font-weight);
}

.monaco-workbench .notebookOverlay .view-zones .cell-editor-part {
	outline: solid 1px var(--vscode-notebook-cellBorderColor);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookChatEditorOverlay.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookChatEditorOverlay.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.notebook-chat-editor-overlay-widget {
	position: absolute;
	/** Based on chat widget for regular editors **/
	right: 28px;
	/** Based on chat widget for regular editors **/
	bottom: 23px;
	/** In notebook.css we set this to 22px, we need to revert this to standards **/
	line-height: 1.4em;
}

/** Copied from src/vs/workbench/contrib/chat/browser/media/chatEditorOverlay.css **/
/** Copied until we unify these, for now its separate **/
.notebook-chat-editor-overlay-widget {
	padding: 0px;
	color: var(--vscode-button-foreground);
	background-color: var(--vscode-button-background);
	border-radius: 5px;
	border: 1px solid var(--vscode-contrastBorder);
	display: flex;
	align-items: center;
	z-index: 30;
}

.notebook-chat-editor-overlay-widget .chat-editor-overlay-progress {
	display: none;
	padding: 0px 5px;
	font-size: 12px;
}

.notebook-chat-editor-overlay-widget.busy .chat-editor-overlay-progress {
	display: inherit;
}

.notebook-chat-editor-overlay-widget .action-item > .action-label {
	padding: 5px;
	font-size: 12px;
}

.notebook-chat-editor-overlay-widget .action-item:first-child > .action-label {
	padding-left: 9px;
}

.notebook-chat-editor-overlay-widget .action-item:last-child > .action-label {
	padding-right: 9px;
}

.notebook-chat-editor-overlay-widget.busy .chat-editor-overlay-progress .codicon,
.notebook-chat-editor-overlay-widget .action-item > .action-label.codicon {
	color: var(--vscode-button-foreground);
}

.notebook-chat-editor-overlay-widget .action-item.disabled > .action-label.codicon::before,
.notebook-chat-editor-overlay-widget .action-item.disabled > .action-label.codicon,
.notebook-chat-editor-overlay-widget .action-item.disabled > .action-label,
.notebook-chat-editor-overlay-widget .action-item.disabled > .action-label:hover {
	color: var(--vscode-button-foreground);
	opacity: 0.7;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookDnd.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookDnd.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image {
	position: absolute;
	top: -500px;
	z-index: 1000;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image .execution-count-label {
	display: none;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image .cell-editor-container > div {
	padding: 12px 16px;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image.code-cell-row .cell-focus-indicator-side {
	height: 44px !important;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image.code-cell-row .cell-focus-indicator-bottom {
	top: 50px !important;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image.markdown-cell-row .cell-focus-indicator {
	bottom: 8px;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image.code-cell-row {
	padding: 6px 0px;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image .output {
	display: none !important;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image .cell-title-toolbar {
	display: none;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image .cell-statusbar-container {
	display: none;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image .cell-editor-part {
	width: 100%;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image .cell-editor-container > div > div {
	/* Rendered code content - show a single unwrapped line */
	height: 20px;
	overflow: hidden;
	white-space: pre-wrap;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image.markdown-cell-row .cell.markdown {
	white-space: nowrap;
	overflow: hidden;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.cell-drag-image .codeOutput-focus-indicator-container {
	display: none;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list .monaco-list-row .cell-dragging {
	opacity: 0.5 !important;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row:not(.selected) .monaco-editor .lines-content .selected-text,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row:not(.selected) .monaco-editor .lines-content .selectionHighlight {
	opacity: 0.33;
}

.monaco-workbench .notebookOverlay .cell-drag-image .output .cell-output-toolbar {
	display: none;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookEditorStickyScroll.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookEditorStickyScroll.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notebookOverlay .notebook-sticky-scroll-container {
	display: none;
	background-color: var(--vscode-notebook-editorBackground);
	padding-left: 9.5px;
}

.monaco-workbench
	.notebookOverlay
	.notebook-sticky-scroll-container
	.notebook-sticky-scroll-element {
	display: flex;
	align-items: center;
}

.monaco-workbench
	.notebookOverlay
	.notebook-sticky-scroll-container
	.notebook-sticky-scroll-element
	.notebook-sticky-scroll-folding-icon:hover {
	outline: 1px dashed var(--vscode-contrastActiveBorder);
	outline-offset: -1px;
}

.monaco-workbench
	.notebookOverlay
	.notebook-sticky-scroll-container
	.notebook-sticky-scroll-element
	.notebook-sticky-scroll-header {
	width: 100%;
	padding-left: 6px;
}

.monaco-workbench
	.notebookOverlay
	.notebook-sticky-scroll-container
	.notebook-sticky-scroll-element:hover {
	background-color: var(--vscode-editorStickyScrollHover-background);
	cursor: pointer;
}

.monaco-workbench.hc-light .notebookOverlay .notebook-sticky-scroll-container,
.monaco-workbench.hc-black .notebookOverlay .notebook-sticky-scroll-container {
	background-color: var(--vscode-editorStickyScroll-background);
	border-bottom: 1px solid var(--vscode-contrastBorder);
	padding-bottom: 3px;
}

.monaco-workbench.hc-light
	.notebookOverlay
	.notebook-sticky-scroll-container
	.notebook-sticky-scroll-element:hover,
.monaco-workbench.hc-black
	.notebookOverlay
	.notebook-sticky-scroll-container
	.notebook-sticky-scroll-element:hover {
	outline: 1px dashed var(--vscode-contrastActiveBorder);
	outline-offset: -2px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookFocusIndicator.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookFocusIndicator.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-focus-indicator-top:before {
	top: 0;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-focus-indicator-left:before {
	left: 0;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-focus-indicator-bottom:before {
	bottom: 0px;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-focus-indicator-right:before {
	right: 0;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-focus-indicator {
	position: absolute;
	top: 0px;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-focus-indicator-side {
	/** Overidden for code cells */
	top: 0px;
	bottom: 0px;
}

.monaco-workbench .notebookOverlay .monaco-list .webview-backed-markdown-cell .cell-focus-indicator-side {
	/* Disable pointer events for the folding container */
	pointer-events: none;
}

.monaco-workbench .notebookOverlay .monaco-list .webview-backed-markdown-cell .cell-focus-indicator-side .notebook-folding-indicator {
	/* But allow clicking on the folding indicator itself */
	pointer-events: all;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-focus-indicator-top,
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-focus-indicator-bottom {
	width: 100%;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-focus-indicator-right {
	right: 0px;
}

/** cell border colors */

.monaco-workbench .notebookOverlay .monaco-list:focus-within .monaco-list-row.focused .cell-editor-focus .cell-focus-indicator-top:before,
.monaco-workbench .notebookOverlay .monaco-list:focus-within .monaco-list-row.focused .cell-editor-focus .cell-focus-indicator-bottom:before,
.monaco-workbench .notebookOverlay .monaco-list:focus-within .monaco-list-row.focused .cell-inner-container.cell-editor-focus:before {
	border-color: var(--vscode-notebook-selectedCellBorder) !important;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.focused .cell-focus-indicator-top:before,
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.focused .cell-focus-indicator-bottom:before {
	border-color: var(--vscode-notebook-inactiveFocusedCellBorder) !important;
}

.monaco-workbench .notebookOverlay .monaco-list:focus-within .monaco-list-row.focused .cell-inner-container:not(.cell-editor-focus) .cell-focus-indicator-top:before,
.monaco-workbench .notebookOverlay .monaco-list:focus-within .monaco-list-row.focused .cell-inner-container:not(.cell-editor-focus) .cell-focus-indicator-bottom:before,
.monaco-workbench .notebookOverlay .monaco-list:focus-within .monaco-list-row.focused .cell-inner-container:not(.cell-editor-focus) .cell-focus-indicator-left:before,
.monaco-workbench .notebookOverlay .monaco-list:focus-within .monaco-list-row.focused .cell-inner-container:not(.cell-editor-focus) .cell-focus-indicator-right:before {
	border-color: var(--vscode-notebook-focusedCellBorder) !important;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-focus-indicator-left .codeOutput-focus-indicator-container {
	display: none;
	position: relative;
	cursor: pointer;
	pointer-events: all; /* Take pointer-events in markdown cell */
	width: 11px;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-focus-indicator-left .codeOutput-focus-indicator {
	width: 0px;
	height: 100%;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-focus-indicator-left,
.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row.markdown-cell-row .cell-inner-container {
	cursor: grab;
}

.monaco-workbench .notebookOverlay .monaco-list .monaco-list-row .cell-focus-indicator .codicon:hover {
	cursor: pointer;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookFolding.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookFolding.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .notebook-folding-indicator.mouseover .codicon.codicon-notebook-expanded {
	opacity: 0;
}

.monaco-workbench.monaco-enable-motion .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .notebook-folding-indicator.mouseover .codicon.codicon-notebook-expanded {
	transition: opacity 0.1s;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row .markdown-cell-hover .notebook-folding-indicator.mouseover .codicon.codicon-notebook-expanded {
	opacity: 1;
}

.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused .notebook-folding-indicator.mouseover .codicon.codicon-notebook-expanded,
.monaco-workbench .notebookOverlay > .cell-list-container > .monaco-list > .monaco-scrollable-element > .monaco-list-rows > .monaco-list-row:hover .notebook-folding-indicator.mouseover .codicon.codicon-notebook-expanded {
	opacity: 1;
}

.monaco-workbench .notebookOverlay > .cell-list-container .notebook-folding-indicator {
	height: 20px;
	width: 20px;

	position: absolute;
	top: 10px;
	left: 6px;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: var(--z-index-notebook-folding-indicator);
}

.monaco-workbench .notebookOverlay > .cell-list-container .webview-backed-markdown-cell .notebook-folding-indicator {
	top: 8px;
}

.monaco-workbench .notebookOverlay > .cell-list-container .notebook-folding-indicator .codicon {
	visibility: visible;
	height: 16px;
	padding: 4px 4px 4px 4px;
}

.monaco-workbench .notebookOverlay > .cell-list-container .notebook-folded-hint {
	position: absolute;
	user-select: none;
	display: flex;
	align-items: center;
}

.monaco-workbench .notebookOverlay > .cell-list-container .notebook-folded-hint-label {
	font-size: var(--notebook-cell-output-font-size);
	font-family: var(--monaco-monospace-font);
	font-style: italic;
	opacity: 0.7;
}

.monaco-workbench .notebookOverlay > .cell-list-container .folded-cell-run-section-button {
	position: relative;
	left: 0px;
	padding: 2px;
	border-radius: 5px;
	margin-right: 4px;
	height: 16px;
	width: 16px;
	z-index: var(--z-index-notebook-cell-expand-part-button);
}

.monaco-workbench .notebookOverlay > .cell-list-container .folded-cell-run-section-button:hover {
	background-color: var(--vscode-editorStickyScrollHover-background);
	cursor: pointer;
}

.monaco-workbench .notebookOverlay .cell-editor-container .monaco-editor .margin-view-overlays .codicon-folding-expanded,
.monaco-workbench .notebookOverlay .cell-editor-container .monaco-editor .margin-view-overlays .codicon-folding-collapsed {
	margin-left: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookKernelActionViewItem.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookKernelActionViewItem.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .kernel-action-view-item {
	border-radius: 5px;
}
.monaco-workbench .kernel-action-view-item:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.monaco-workbench .kernel-action-view-item .action-label {
	display: inline-flex;
}

.monaco-workbench .kernel-action-view-item .kernel-label {
	font-size: 11px;
	padding: 3px 5px 3px 3px;
	border-radius: 5px;
	height: 16px;
	display: inline-flex;
	vertical-align: text-bottom;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookOutline.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookOutline.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-list .notebook-outline-element {
	display: flex;
	flex: 1;
	flex-flow: row nowrap;
	align-items: center;
}

.monaco-list .notebook-outline-element > .element-icon.file-icon {
	height: 100%;
}

.monaco-breadcrumbs > .notebook-outline-element > .element-icon.file-icon {
	height: 18px;
}
.monaco-list .notebook-outline-element .monaco-highlighted-label {
	color: var(--outline-element-color);
}

.monaco-breadcrumbs .notebook-outline-element .element-decoration,
.monaco-list .notebook-outline-element > .element-decoration {
	opacity: 0.75;
	font-size: 90%;
	font-weight: 600;
	padding: 0 12px 0 5px;
	margin-left: auto;
	text-align: center;
	color: var(--outline-element-color);
}

.monaco-list .notebook-outline-element > .element-decoration.bubble {
	font-family: codicon;
	font-size: 14px;
	opacity: 0.4;
	padding-right: 8px;
}

.monaco-breadcrumbs .notebook-outline-element .element-decoration {
	/* Don't show markers inline with breadcrumbs */
	display: none;
}

.monaco-list-row .notebook-outline-element .action-menu {
	display: none;
}

.monaco-list-row.focused.selected .notebook-outline-element .action-menu {
	display: flex;
}

.monaco-list-row:hover .notebook-outline-element .action-menu {
	display: flex;
}

.monaco-list-row .notebook-outline-element.notebook-outline-toolbar-dropdown-active .action-menu {
	display: flex;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/media/notebookToolbar.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/media/notebookToolbar.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notebookOverlay .notebook-toolbar-container {
	width: 100%;
	display: none;
	margin-top: 2px;
	margin-bottom: 2px;
	contain: style;
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container .monaco-action-bar .action-item {
	height: 22px;
	display: flex;
	align-items: center;
	border-radius: 5px;
	margin-right: 8px;
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container > .monaco-scrollable-element {
	flex: 1;
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container > .monaco-scrollable-element .notebook-toolbar-left {
	padding: 0px 0px 0px 8px;
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container .notebook-toolbar-right {
	display: flex;
	padding: 0px 0px 0px 0px;
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container .monaco-action-bar .action-item  .kernel-label {
	background-size: 16px;
	padding: 0px 5px 0px 3px;
	border-radius: 5px;
	font-size: 13px;
	height: 22px;
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container .notebook-toolbar-left .monaco-action-bar li a[tabindex="0"]:focus {
	outline: none !important;
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container .notebook-toolbar-left .monaco-action-bar li:has(a:focus) {
	outline-width: 1px;
	outline-style: solid;
	outline-offset: -1px;
	outline-color: var(--vscode-focusBorder);
	opacity: 1;
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container .notebook-toolbar-left .monaco-action-bar .action-item .action-label.separator {
	margin: 5px 0px !important;
	padding: 0px !important;
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container .monaco-action-bar .action-item:not(.disabled):hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container .monaco-action-bar .action-item .action-label {
	background-size: 16px;
	padding-left: 2px;
}

.monaco-workbench .notebook-action-view-item .action-label {
	display: inline-flex;
}

.monaco-workbench .notebook-action-view-item-unified .monaco-dropdown {
	pointer-events: none;
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container .monaco-action-bar .action-item .notebook-label {
	background-size: 16px;
	padding: 0px 5px 0px 2px;
	border-radius: 5px;
	background-color: unset;
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container .monaco-action-bar .action-item.disabled .notebook-label {
	opacity: 0.4;
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container .monaco-action-bar:not(.vertical) .action-item.active .action-label:not(.disabled) {
	background-color: unset;
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container .monaco-action-bar:not(.vertical) .action-label:not(.disabled):hover {
	background-color: unset;
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container .monaco-action-bar:not(.vertical) .action-item.active {
	background-color: var(--vscode-toolbar-activeBackground);
}

.monaco-workbench .notebookOverlay .notebook-toolbar-container .monaco-action-bar .action-item .codicon-notebook-state-error {
	color: var(--vscode-notebookStatusErrorIcon-foreground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/outputEditor/notebookOutputEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/outputEditor/notebookOutputEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import * as nls from '../../../../../nls.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { URI } from '../../../../../base/common/uri.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { IEditorOptions } from '../../../../../platform/editor/common/editor.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { EditorPane } from '../../../../browser/parts/editor/editorPane.js';
import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../../common/contributions.js';
import { IEditorOpenContext } from '../../../../common/editor.js';
import { IEditorGroup } from '../../../../services/editor/common/editorGroupsService.js';
import { IEditorResolverService, RegisteredEditorPriority } from '../../../../services/editor/common/editorResolverService.js';
import { CellUri, NOTEBOOK_OUTPUT_EDITOR_ID } from '../../common/notebookCommon.js';
import { INotebookService } from '../../common/notebookService.js';
import { CellEditState, IBaseCellEditorOptions, ICellOutputViewModel, ICommonCellInfo, IGenericCellViewModel, IInsetRenderOutput, INotebookEditorCreationOptions, RenderOutputType } from '../notebookBrowser.js';
import { getDefaultNotebookCreationOptions } from '../notebookEditorWidget.js';
import { NotebookOptions } from '../notebookOptions.js';
import { BackLayerWebView, INotebookDelegateForWebview } from '../view/renderers/backLayerWebView.js';
import { NotebookOutputEditorInput } from './notebookOutputEditorInput.js';
import { FontInfo } from '../../../../../editor/common/config/fontInfo.js';
import { createBareFontInfoFromRawSettings } from '../../../../../editor/common/config/fontInfoFromSettings.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IEditorOptions as ICodeEditorOptions } from '../../../../../editor/common/config/editorOptions.js';
import { FontMeasurements } from '../../../../../editor/browser/config/fontMeasurements.js';
import { PixelRatio } from '../../../../../base/browser/pixelRatio.js';
import { NotebookViewModel } from '../viewModel/notebookViewModelImpl.js';
import { NotebookEventDispatcher } from '../viewModel/eventDispatcher.js';
import { ViewContext } from '../viewModel/viewContext.js';

export class NoopCellEditorOptions extends Disposable implements IBaseCellEditorOptions {
	private static fixedEditorOptions: ICodeEditorOptions = {
		scrollBeyondLastLine: false,
		scrollbar: {
			verticalScrollbarSize: 14,
			horizontal: 'auto',
			useShadows: true,
			verticalHasArrows: false,
			horizontalHasArrows: false,
			alwaysConsumeMouseWheel: false
		},
		renderLineHighlightOnlyWhenFocus: true,
		overviewRulerLanes: 0,
		lineDecorationsWidth: 0,
		folding: true,
		fixedOverflowWidgets: true,
		minimap: { enabled: false },
		renderValidationDecorations: 'on',
		lineNumbersMinChars: 3
	};

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;
	private _value: ICodeEditorOptions;

	get value(): Readonly<ICodeEditorOptions> {
		return this._value;
	}

	constructor() {
		super();
		this._value = Object.freeze({
			...NoopCellEditorOptions.fixedEditorOptions,
			padding: { top: 12, bottom: 12 },
			readOnly: true
		});
	}
}

export class NotebookOutputEditor extends EditorPane implements INotebookDelegateForWebview {

	static readonly ID: string = NOTEBOOK_OUTPUT_EDITOR_ID;

	creationOptions: INotebookEditorCreationOptions = getDefaultNotebookCreationOptions();

	private _rootElement!: HTMLElement;
	private _outputWebview: BackLayerWebView<ICommonCellInfo> | null = null;

	private _fontInfo: FontInfo | undefined;

	private _notebookOptions: NotebookOptions;
	private _notebookViewModel: NotebookViewModel | undefined;

	private _isDisposed: boolean = false;
	get isDisposed() {
		return this._isDisposed;
	}

	constructor(
		group: IEditorGroup,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IStorageService storageService: IStorageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@INotebookService private readonly notebookService: INotebookService,

	) {
		super(NotebookOutputEditor.ID, group, telemetryService, themeService, storageService);
		this._notebookOptions = this.instantiationService.createInstance(NotebookOptions, this.window, false, undefined);
		this._register(this._notebookOptions);
	}

	protected createEditor(parent: HTMLElement): void {
		this._rootElement = DOM.append(parent, DOM.$('.notebook-output-editor'));
	}

	private get fontInfo() {
		if (!this._fontInfo) {
			this._fontInfo = this.createFontInfo();
		}

		return this._fontInfo;
	}

	private createFontInfo() {
		const editorOptions = this.configurationService.getValue<ICodeEditorOptions>('editor');
		return FontMeasurements.readFontInfo(this.window, createBareFontInfoFromRawSettings(editorOptions, PixelRatio.getInstance(this.window).value));
	}

	private async _createOriginalWebview(id: string, viewType: string, resource: URI): Promise<void> {
		this._outputWebview?.dispose();

		this._outputWebview = this.instantiationService.createInstance(BackLayerWebView, this, id, viewType, resource, {
			...this._notebookOptions.computeDiffWebviewOptions(),
			fontFamily: this._generateFontFamily()
		}, undefined) as BackLayerWebView<ICommonCellInfo>;

		// attach the webview container to the DOM tree first
		DOM.append(this._rootElement, this._outputWebview.element);

		this._outputWebview.createWebview(this.window);
		this._outputWebview.element.style.width = `calc(100% - 16px)`;
		this._outputWebview.element.style.left = `16px`;

	}

	private _generateFontFamily(): string {
		return this.fontInfo.fontFamily ?? `"SF Mono", Monaco, Menlo, Consolas, "Ubuntu Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace`;
	}

	override getTitle(): string {
		if (this.input) {
			return this.input.getName();
		}

		return nls.localize('notebookOutputEditor', "Notebook Output Editor");
	}

	override async setInput(input: NotebookOutputEditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		await super.setInput(input, options, context, token);

		const model = await input.resolve();
		if (!model) {
			throw new Error('Invalid notebook output editor input');
		}

		const resolvedNotebookEditorModel = model.resolvedNotebookEditorModel;

		await this._createOriginalWebview(generateUuid(), resolvedNotebookEditorModel.viewType, URI.from({ scheme: Schemas.vscodeNotebookCellOutput, path: '', query: 'openIn=notebookOutputEditor' }));

		const notebookTextModel = resolvedNotebookEditorModel.notebook;
		const eventDispatcher = this._register(new NotebookEventDispatcher());
		const editorOptions = this._register(new NoopCellEditorOptions());
		const viewContext = new ViewContext(
			this._notebookOptions,
			eventDispatcher,
			_language => editorOptions
		);

		this._notebookViewModel = this.instantiationService.createInstance(NotebookViewModel, notebookTextModel.viewType, notebookTextModel, viewContext, null, { isReadOnly: true });

		const cellViewModel = this._notebookViewModel.getCellByHandle(model.cell.handle);
		if (!cellViewModel) {
			throw new Error('Invalid NotebookOutputEditorInput, no matching cell view model');
		}

		const cellOutputViewModel = cellViewModel.outputsViewModels.find(outputViewModel => outputViewModel.model.outputId === model.outputId);
		if (!cellOutputViewModel) {
			throw new Error('Invalid NotebookOutputEditorInput, no matching cell output view model');
		}

		let result: IInsetRenderOutput | undefined = undefined;

		const [mimeTypes, pick] = cellOutputViewModel.resolveMimeTypes(notebookTextModel, undefined);
		const pickedMimeTypeRenderer = cellOutputViewModel.pickedMimeType || mimeTypes[pick];
		if (mimeTypes.length !== 0) {
			const renderer = this.notebookService.getRendererInfo(pickedMimeTypeRenderer.rendererId);
			result = renderer
				? { type: RenderOutputType.Extension, renderer, source: cellOutputViewModel, mimeType: pickedMimeTypeRenderer.mimeType }
				: this._renderMissingRenderer(cellOutputViewModel, pickedMimeTypeRenderer.mimeType);

		}

		if (!result) {
			throw new Error('No InsetRenderInfo for output');
		}

		const cellInfo: ICommonCellInfo = {
			cellId: cellViewModel.id,
			cellHandle: model.cell.handle,
			cellUri: model.cell.uri,
		};

		this._outputWebview?.createOutput(cellInfo, result, 0, 0);
	}

	private _renderMissingRenderer(viewModel: ICellOutputViewModel, preferredMimeType: string | undefined): IInsetRenderOutput {
		if (!viewModel.model.outputs.length) {
			return this._renderMessage(viewModel, nls.localize('empty', "Cell has no output"));
		}

		if (!preferredMimeType) {
			const mimeTypes = viewModel.model.outputs.map(op => op.mime);
			const mimeTypesMessage = mimeTypes.join(', ');
			return this._renderMessage(viewModel, nls.localize('noRenderer.2', "No renderer could be found for output. It has the following mimetypes: {0}", mimeTypesMessage));
		}

		return this._renderSearchForMimetype(viewModel, preferredMimeType);
	}

	private _renderMessage(viewModel: ICellOutputViewModel, message: string): IInsetRenderOutput {
		const el = DOM.$('p', undefined, message);
		return { type: RenderOutputType.Html, source: viewModel, htmlContent: el.outerHTML };
	}

	private _renderSearchForMimetype(viewModel: ICellOutputViewModel, mimeType: string): IInsetRenderOutput {
		const query = `@tag:notebookRenderer ${mimeType}`;

		const p = DOM.$('p', undefined, `No renderer could be found for mimetype "${mimeType}", but one might be available on the Marketplace.`);
		const a = DOM.$('a', { href: `command:workbench.extensions.search?%22${query}%22`, class: 'monaco-button monaco-text-button', tabindex: 0, role: 'button', style: 'padding: 8px; text-decoration: none; color: rgb(255, 255, 255); background-color: rgb(14, 99, 156); max-width: 200px;' }, `Search Marketplace`);

		return {
			type: RenderOutputType.Html,
			source: viewModel,
			htmlContent: p.outerHTML + a.outerHTML,
		};
	}

	scheduleOutputHeightAck(cellInfo: ICommonCellInfo, outputId: string, height: number): void {
		DOM.scheduleAtNextAnimationFrame(this.window, () => {
			this._outputWebview?.ackHeight([{ cellId: cellInfo.cellId, outputId, height }]);
		}, 10);
	}

	async focusNotebookCell(cell: IGenericCellViewModel, focus: 'output' | 'editor' | 'container'): Promise<void> {

	}

	async focusNextNotebookCell(cell: IGenericCellViewModel, focus: 'output' | 'editor' | 'container'): Promise<void> {

	}

	toggleNotebookCellSelection(cell: IGenericCellViewModel) {
		throw new Error('Not implemented.');
	}

	getCellById(cellId: string): IGenericCellViewModel | undefined {
		throw new Error('Not implemented');
	}

	getCellByInfo(cellInfo: ICommonCellInfo): IGenericCellViewModel {
		return this._notebookViewModel?.getCellByHandle(cellInfo.cellHandle) as IGenericCellViewModel;
	}

	layout(dimension: DOM.Dimension, position: DOM.IDomPosition): void {

	}

	setScrollTop(scrollTop: number): void {

	}

	triggerScroll(event: any): void {

	}

	getOutputRenderer(): any {

	}

	updateOutputHeight(cellInfo: ICommonCellInfo, output: ICellOutputViewModel, height: number, isInit: boolean, source?: string): void {

	}

	updateMarkupCellHeight(cellId: string, height: number, isInit: boolean): void {

	}

	setMarkupCellEditState(cellId: string, editState: CellEditState): void {

	}

	didResizeOutput(cellId: string): void {

	}

	didStartDragMarkupCell(cellId: string, event: { dragOffsetY: number }): void {

	}

	didDragMarkupCell(cellId: string, event: { dragOffsetY: number }): void {

	}

	didDropMarkupCell(cellId: string, event: { dragOffsetY: number; ctrlKey: boolean; altKey: boolean }): void {

	}

	didEndDragMarkupCell(cellId: string): void {

	}

	updatePerformanceMetadata(cellId: string, executionId: string, duration: number, rendererId: string): void {

	}

	didFocusOutputInputChange(inputFocused: boolean): void {

	}

	override dispose() {
		this._isDisposed = true;
		super.dispose();
	}
}

export class NotebookOutputEditorContribution implements IWorkbenchContribution {

	static readonly ID = 'workbench.contribution.notebookOutputEditorContribution';

	constructor(
		@IEditorResolverService editorResolverService: IEditorResolverService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,) {
		editorResolverService.registerEditor(
			`${Schemas.vscodeNotebookCellOutput}:/**`,
			{
				id: 'notebookOutputEditor',
				label: 'Notebook Output Editor',
				priority: RegisteredEditorPriority.default
			},
			{
				canSupportResource: (resource: URI) => {
					if (resource.scheme === Schemas.vscodeNotebookCellOutput) {
						const params = new URLSearchParams(resource.query);
						return params.get('openIn') === 'notebookOutputEditor';
					}
					return false;
				}
			},
			{
				createEditorInput: async ({ resource, options }) => {
					const outputUriData = CellUri.parseCellOutputUri(resource);
					if (!outputUriData || !outputUriData.notebook || outputUriData.cellIndex === undefined || outputUriData.outputIndex === undefined || !outputUriData.outputId) {
						throw new Error('Invalid output uri for notebook output editor');
					}

					const notebookUri = this.uriIdentityService.asCanonicalUri(outputUriData.notebook);
					const cellIndex = outputUriData.cellIndex;
					const outputId = outputUriData.outputId;
					const outputIndex = outputUriData.outputIndex;

					const editorInput = this.instantiationService.createInstance(NotebookOutputEditorInput, notebookUri, cellIndex, outputId, outputIndex);
					return {
						editor: editorInput,
						options: options
					};
				}
			}
		);
	}
}

registerWorkbenchContribution2(NotebookOutputEditorContribution.ID, NotebookOutputEditorContribution, WorkbenchPhase.BlockRestore);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/outputEditor/notebookOutputEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/outputEditor/notebookOutputEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../../nls.js';
import { IDisposable, IReference } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { EditorInputCapabilities } from '../../../../common/editor.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import { IResolvedNotebookEditorModel } from '../../common/notebookCommon.js';
import { INotebookEditorModelResolverService } from '../../common/notebookEditorModelResolverService.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';


class ResolvedNotebookOutputEditorInputModel implements IDisposable {
	constructor(
		readonly resolvedNotebookEditorModel: IResolvedNotebookEditorModel,
		readonly notebookUri: URI,
		readonly cell: NotebookCellTextModel,
		readonly outputId: string,
	) { }

	dispose(): void {
		this.resolvedNotebookEditorModel.dispose();
	}
}

// TODO @Yoyokrazy -- future feat. for viewing static outputs -- encode mime + data
// export class NotebookOutputViewerInput extends EditorInput {
// 	static readonly ID: string = 'workbench.input.notebookOutputViewerInput';
// }

export class NotebookOutputEditorInput extends EditorInput {
	static readonly ID: string = 'workbench.input.notebookOutputEditorInput';

	private _notebookRef: IReference<IResolvedNotebookEditorModel> | undefined;
	private readonly _notebookUri: URI;

	readonly cellIndex: number;

	public cellUri: URI | undefined;

	readonly outputIndex: number;
	private outputId: string | undefined;

	constructor(
		notebookUri: URI,
		cellIndex: number,
		outputId: string | undefined,
		outputIndex: number,
		@INotebookEditorModelResolverService private readonly notebookEditorModelResolverService: INotebookEditorModelResolverService,
	) {
		super();
		this._notebookUri = notebookUri;

		this.cellUri = undefined;
		this.cellIndex = cellIndex;

		this.outputId = outputId;
		this.outputIndex = outputIndex;
	}

	override get typeId(): string {
		return NotebookOutputEditorInput.ID;
	}

	override async resolve(): Promise<ResolvedNotebookOutputEditorInputModel> {
		if (!this._notebookRef) {
			this._notebookRef = await this.notebookEditorModelResolverService.resolve(this._notebookUri);
		}

		const cell = this._notebookRef.object.notebook.cells[this.cellIndex];
		if (!cell) {
			throw new Error('Cell not found');
		}

		this.cellUri = cell.uri;

		const resolvedOutputId = cell.outputs[this.outputIndex]?.outputId;
		if (!resolvedOutputId) {
			throw new Error('Output not found');
		}

		if (!this.outputId) {
			this.outputId = resolvedOutputId;
		}

		return new ResolvedNotebookOutputEditorInputModel(
			this._notebookRef.object,
			this._notebookUri,
			cell,
			resolvedOutputId,
		);
	}

	public getSerializedData(): { notebookUri: URI; cellIndex: number; outputIndex: number } | undefined {
		// need to translate from uris -> current indexes
		// uris aren't deterministic across reloads, so indices are best option

		if (!this._notebookRef) {
			return;
		}

		const cellIndex = this._notebookRef.object.notebook.cells.findIndex(c => isEqual(c.uri, this.cellUri));
		const cell = this._notebookRef.object.notebook.cells[cellIndex];
		if (!cell) {
			return;
		}

		const outputIndex = cell.outputs.findIndex(o => o.outputId === this.outputId);
		if (outputIndex === -1) {
			return;
		}

		return {
			notebookUri: this._notebookUri,
			cellIndex: cellIndex,
			outputIndex: outputIndex,
		};
	}

	override getName(): string {
		return nls.localize('notebookOutputEditorInput', "Notebook Output Preview");
	}

	override get editorId(): string {
		return 'notebookOutputEditor';
	}

	override get resource(): URI | undefined {
		return;
	}

	override get capabilities() {
		return EditorInputCapabilities.Readonly;
	}

	override dispose(): void {
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/services/notebookCellStatusBarServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/services/notebookCellStatusBarServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { INotebookCellStatusBarService } from '../../common/notebookCellStatusBarService.js';
import { INotebookCellStatusBarItemList, INotebookCellStatusBarItemProvider } from '../../common/notebookCommon.js';

export class NotebookCellStatusBarService extends Disposable implements INotebookCellStatusBarService {

	readonly _serviceBrand: undefined;

	private readonly _onDidChangeProviders = this._register(new Emitter<void>());
	readonly onDidChangeProviders: Event<void> = this._onDidChangeProviders.event;

	private readonly _onDidChangeItems = this._register(new Emitter<void>());
	readonly onDidChangeItems: Event<void> = this._onDidChangeItems.event;

	private readonly _providers: INotebookCellStatusBarItemProvider[] = [];

	registerCellStatusBarItemProvider(provider: INotebookCellStatusBarItemProvider): IDisposable {
		this._providers.push(provider);
		let changeListener: IDisposable | undefined;
		if (provider.onDidChangeStatusBarItems) {
			changeListener = provider.onDidChangeStatusBarItems(() => this._onDidChangeItems.fire());
		}

		this._onDidChangeProviders.fire();

		return toDisposable(() => {
			changeListener?.dispose();
			const idx = this._providers.findIndex(p => p === provider);
			this._providers.splice(idx, 1);
		});
	}

	async getStatusBarItemsForCell(docUri: URI, cellIndex: number, viewType: string, token: CancellationToken): Promise<INotebookCellStatusBarItemList[]> {
		const providers = this._providers.filter(p => p.viewType === viewType || p.viewType === '*');
		return await Promise.all(providers.map(async p => {
			try {
				return await p.provideCellStatusBarItems(docUri, cellIndex, token) ?? { items: [] };
			} catch (e) {
				onUnexpectedExternalError(e);
				return { items: [] };
			}
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/services/notebookEditorService.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/services/notebookEditorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeWindow } from '../../../../../base/browser/window.js';
import { createDecorator, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { INotebookEditor, INotebookEditorCreationOptions } from '../notebookBrowser.js';
import { Event } from '../../../../../base/common/event.js';
import { Dimension } from '../../../../../base/browser/dom.js';
import { NotebookEditorWidget } from '../notebookEditorWidget.js';
import { URI } from '../../../../../base/common/uri.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';

export const INotebookEditorService = createDecorator<INotebookEditorService>('INotebookEditorWidgetService');

export interface IBorrowValue<T> {
	readonly value: T | undefined;
}

export interface INotebookEditorService {
	_serviceBrand: undefined;

	retrieveWidget(accessor: ServicesAccessor, groupId: number, input: { resource: URI; typeId: string }, creationOptions?: INotebookEditorCreationOptions, dimension?: Dimension, codeWindow?: CodeWindow): IBorrowValue<INotebookEditor>;

	retrieveExistingWidgetFromURI(resource: URI): IBorrowValue<NotebookEditorWidget> | undefined;
	retrieveAllExistingWidgets(): IBorrowValue<NotebookEditorWidget>[];
	readonly onDidAddNotebookEditor: Event<INotebookEditor>;
	readonly onDidRemoveNotebookEditor: Event<INotebookEditor>;
	addNotebookEditor(editor: INotebookEditor): void;
	removeNotebookEditor(editor: INotebookEditor): void;
	getNotebookEditor(editorId: string): INotebookEditor | undefined;
	listNotebookEditors(): readonly INotebookEditor[];
	getNotebookForPossibleCell(editor: ICodeEditor): INotebookEditor | undefined;
	updateReplContextKey(uri: string): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/services/notebookEditorServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/services/notebookEditorServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeWindow } from '../../../../../base/browser/window.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { getDefaultNotebookCreationOptions, NotebookEditorWidget } from '../notebookEditorWidget.js';
import { DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { IEditorGroupsService, IEditorGroup } from '../../../../services/editor/common/editorGroupsService.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { isCompositeNotebookEditorInput, isNotebookEditorInput, NotebookEditorInput } from '../../common/notebookEditorInput.js';
import { IBorrowValue, INotebookEditorService } from './notebookEditorService.js';
import { INotebookEditor, INotebookEditorCreationOptions } from '../notebookBrowser.js';
import { Emitter } from '../../../../../base/common/event.js';
import { GroupIdentifier, GroupModelChangeKind } from '../../../../common/editor.js';
import { Dimension } from '../../../../../base/browser/dom.js';
import { URI } from '../../../../../base/common/uri.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { InteractiveWindowOpen, MOST_RECENT_REPL_EDITOR } from '../../common/notebookContextKeys.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { IEditorProgressService } from '../../../../../platform/progress/common/progress.js';
import { NotebookDiffEditorInput } from '../../common/notebookDiffEditorInput.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';

export class NotebookEditorWidgetService implements INotebookEditorService {

	readonly _serviceBrand: undefined;

	private _tokenPool = 1;

	private readonly _disposables = new DisposableStore();
	private readonly _notebookEditors = new Map<string, INotebookEditor>();

	private readonly groupListener = new Map<number, IDisposable[]>();

	private readonly _onNotebookEditorAdd = new Emitter<INotebookEditor>();
	private readonly _onNotebookEditorsRemove = new Emitter<INotebookEditor>();
	readonly onDidAddNotebookEditor = this._onNotebookEditorAdd.event;
	readonly onDidRemoveNotebookEditor = this._onNotebookEditorsRemove.event;

	private readonly _mostRecentRepl: IContextKey<string | undefined>;

	private readonly _borrowableEditors = new Map<number, ResourceMap<{ widget: NotebookEditorWidget; editorType: string; token: number | undefined; disposableStore: DisposableStore }[]>>();

	constructor(
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IEditorService editorService: IEditorService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		const onNewGroup = (group: IEditorGroup) => {
			const { id } = group;
			const listeners: IDisposable[] = [];
			listeners.push(group.onDidCloseEditor(e => {
				const widgetMap = this._borrowableEditors.get(group.id);
				if (!widgetMap) {
					return;
				}

				const inputs = e.editor instanceof NotebookEditorInput || e.editor instanceof NotebookDiffEditorInput
					? [e.editor]
					: (isCompositeNotebookEditorInput(e.editor) ? e.editor.editorInputs : []);
				inputs.forEach(input => {
					const widgets = widgetMap.get(input.resource);
					const index = widgets?.findIndex(widget => widget.editorType === input.typeId);
					if (!widgets || index === undefined || index === -1) {
						return;
					}
					const value = widgets.splice(index, 1)[0];
					value.token = undefined;
					this._disposeWidget(value.widget);
					value.disposableStore.dispose();
					// eslint-disable-next-line local/code-no-any-casts
					value.widget = (<any>undefined); // unset the widget so that others that still hold a reference don't harm us
				});
			}));
			listeners.push(group.onWillMoveEditor(e => {
				if (isNotebookEditorInput(e.editor)) {
					this._allowWidgetMove(e.editor, e.groupId, e.target);
				}

				if (isCompositeNotebookEditorInput(e.editor)) {
					e.editor.editorInputs.forEach(input => {
						this._allowWidgetMove(input, e.groupId, e.target);
					});
				}
			}));
			this.groupListener.set(id, listeners);
		};
		this._disposables.add(editorGroupService.onDidAddGroup(onNewGroup));
		editorGroupService.whenReady.then(() => editorGroupService.groups.forEach(onNewGroup));

		// group removed -> clean up listeners, clean up widgets
		this._disposables.add(editorGroupService.onDidRemoveGroup(group => {
			const listeners = this.groupListener.get(group.id);
			if (listeners) {
				listeners.forEach(listener => listener.dispose());
				this.groupListener.delete(group.id);
			}
			const widgets = this._borrowableEditors.get(group.id);
			this._borrowableEditors.delete(group.id);
			if (widgets) {
				for (const values of widgets.values()) {
					for (const value of values) {
						value.token = undefined;
						this._disposeWidget(value.widget);
						value.disposableStore.dispose();
					}
				}
			}
		}));

		this._mostRecentRepl = MOST_RECENT_REPL_EDITOR.bindTo(contextKeyService);
		const interactiveWindowOpen = InteractiveWindowOpen.bindTo(contextKeyService);
		this._disposables.add(editorService.onDidEditorsChange(e => {
			if (e.event.kind === GroupModelChangeKind.EDITOR_OPEN && !interactiveWindowOpen.get()) {
				if (editorService.editors.find(editor => isCompositeNotebookEditorInput(editor))) {
					interactiveWindowOpen.set(true);
				}
			} else if (e.event.kind === GroupModelChangeKind.EDITOR_CLOSE && interactiveWindowOpen.get()) {
				if (!editorService.editors.find(editor => isCompositeNotebookEditorInput(editor))) {
					interactiveWindowOpen.set(false);
				}
			}
		}));
	}

	dispose() {
		this._disposables.dispose();
		this._onNotebookEditorAdd.dispose();
		this._onNotebookEditorsRemove.dispose();
		this.groupListener.forEach((listeners) => {
			listeners.forEach(listener => listener.dispose());
		});
		this.groupListener.clear();
		this._borrowableEditors.forEach(widgetMap => {
			widgetMap.forEach(widgets => {
				widgets.forEach(widget => widget.disposableStore.dispose());
			});
		});
	}

	// --- group-based editor borrowing...

	private _disposeWidget(widget: NotebookEditorWidget): void {
		widget.onWillHide();
		const domNode = widget.getDomNode();
		widget.dispose();
		domNode.remove();
	}

	private _allowWidgetMove(input: NotebookEditorInput, sourceID: GroupIdentifier, targetID: GroupIdentifier): void {
		const sourcePart = this.editorGroupService.getPart(sourceID);
		const targetPart = this.editorGroupService.getPart(targetID);

		if (sourcePart.windowId !== targetPart.windowId) {
			return;
		}

		const target = this._borrowableEditors.get(targetID)?.get(input.resource)?.findIndex(widget => widget.editorType === input.typeId);
		if (target !== undefined && target !== -1) {
			// not needed, a separate widget is already there
			return;
		}

		const widget = this._borrowableEditors.get(sourceID)?.get(input.resource)?.find(widget => widget.editorType === input.typeId);
		if (!widget) {
			throw new Error('no widget at source group');
		}

		// don't allow the widget to be retrieved at its previous location any more
		const sourceWidgets = this._borrowableEditors.get(sourceID)?.get(input.resource);
		if (sourceWidgets) {
			const indexToRemove = sourceWidgets.findIndex(widget => widget.editorType === input.typeId);
			if (indexToRemove !== -1) {
				sourceWidgets.splice(indexToRemove, 1);
			}
		}

		// allow the widget to be retrieved at its new location
		let targetMap = this._borrowableEditors.get(targetID);
		if (!targetMap) {
			targetMap = new ResourceMap();
			this._borrowableEditors.set(targetID, targetMap);
		}
		const widgetsAtTarget = targetMap.get(input.resource) ?? [];
		widgetsAtTarget?.push(widget);
		targetMap.set(input.resource, widgetsAtTarget);
	}

	retrieveExistingWidgetFromURI(resource: URI): IBorrowValue<NotebookEditorWidget> | undefined {
		for (const widgetInfo of this._borrowableEditors.values()) {
			const widgets = widgetInfo.get(resource);
			if (widgets && widgets.length > 0) {
				return this._createBorrowValue(widgets[0].token!, widgets[0]);
			}
		}
		return undefined;
	}

	retrieveAllExistingWidgets(): IBorrowValue<NotebookEditorWidget>[] {
		const ret: IBorrowValue<NotebookEditorWidget>[] = [];
		for (const widgetInfo of this._borrowableEditors.values()) {
			for (const widgets of widgetInfo.values()) {
				for (const widget of widgets) {
					ret.push(this._createBorrowValue(widget.token!, widget));
				}
			}
		}
		return ret;
	}

	retrieveWidget(accessor: ServicesAccessor, groupId: number, input: { resource: URI; typeId: string }, creationOptions?: INotebookEditorCreationOptions, initialDimension?: Dimension, codeWindow?: CodeWindow): IBorrowValue<NotebookEditorWidget> {

		let value = this._borrowableEditors.get(groupId)?.get(input.resource)?.find(widget => widget.editorType === input.typeId);

		if (!value) {
			// NEW widget
			const editorGroupContextKeyService = accessor.get(IContextKeyService);
			const editorGroupEditorProgressService = accessor.get(IEditorProgressService);
			const widgetDisposeStore = new DisposableStore();
			const widget = this.createWidget(editorGroupContextKeyService, widgetDisposeStore, editorGroupEditorProgressService, creationOptions, codeWindow, initialDimension);
			const token = this._tokenPool++;
			value = { widget, editorType: input.typeId, token, disposableStore: widgetDisposeStore };

			let map = this._borrowableEditors.get(groupId);
			if (!map) {
				map = new ResourceMap();
				this._borrowableEditors.set(groupId, map);
			}
			const values = map.get(input.resource) ?? [];
			values.push(value);
			map.set(input.resource, values);
		} else {
			// reuse a widget which was either free'ed before or which
			// is simply being reused...
			value.token = this._tokenPool++;
		}

		return this._createBorrowValue(value.token!, value);
	}

	// protected for unit testing overrides
	protected createWidget(editorGroupContextKeyService: IContextKeyService, widgetDisposeStore: DisposableStore, editorGroupEditorProgressService: IEditorProgressService, creationOptions?: INotebookEditorCreationOptions, codeWindow?: CodeWindow, initialDimension?: Dimension) {
		const notebookInstantiationService = widgetDisposeStore.add(this.instantiationService.createChild(new ServiceCollection(
			[IContextKeyService, editorGroupContextKeyService],
			[IEditorProgressService, editorGroupEditorProgressService])));
		const ctorOptions = creationOptions ?? getDefaultNotebookCreationOptions();
		const widget = notebookInstantiationService.createInstance(NotebookEditorWidget, {
			...ctorOptions,
			codeWindow: codeWindow ?? ctorOptions.codeWindow,
		}, initialDimension);
		return widget;
	}

	private _createBorrowValue(myToken: number, widget: { widget: NotebookEditorWidget; token: number | undefined }): IBorrowValue<NotebookEditorWidget> {
		return {
			get value() {
				return widget.token === myToken ? widget.widget : undefined;
			}
		};
	}

	// --- editor management

	addNotebookEditor(editor: INotebookEditor): void {
		this._notebookEditors.set(editor.getId(), editor);
		this._onNotebookEditorAdd.fire(editor);
	}

	removeNotebookEditor(editor: INotebookEditor): void {
		const notebookUri = editor.getViewModel()?.notebookDocument.uri;
		if (this._notebookEditors.delete(editor.getId())) {
			this._onNotebookEditorsRemove.fire(editor);
		}
		if (this._mostRecentRepl.get() === notebookUri?.toString()) {
			this._mostRecentRepl.reset();
		}
	}

	getNotebookEditor(editorId: string): INotebookEditor | undefined {
		return this._notebookEditors.get(editorId);
	}

	listNotebookEditors(): readonly INotebookEditor[] {
		return [...this._notebookEditors].map(e => e[1]);
	}

	getNotebookForPossibleCell(candidate: ICodeEditor): INotebookEditor | undefined {
		for (const editor of this._notebookEditors.values()) {
			for (const [, codeEditor] of editor.codeEditors) {
				if (codeEditor === candidate) {
					return editor;
				}
			}
		}
		return undefined;
	}

	updateReplContextKey(uri: string): void {
		this._mostRecentRepl.set(uri);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/services/notebookExecutionServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/services/notebookExecutionServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import * as nls from '../../../../../nls.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IWorkspaceTrustRequestService } from '../../../../../platform/workspace/common/workspaceTrust.js';
import { KernelPickerMRUStrategy } from '../viewParts/notebookKernelQuickPickStrategy.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { CellKind, INotebookTextModel, NotebookCellExecutionState } from '../../common/notebookCommon.js';
import { INotebookExecutionService, ICellExecutionParticipant } from '../../common/notebookExecutionService.js';
import { INotebookCellExecution, INotebookExecutionStateService } from '../../common/notebookExecutionStateService.js';
import { INotebookKernelHistoryService, INotebookKernelService } from '../../common/notebookKernelService.js';
import { INotebookLoggingService } from '../../common/notebookLoggingService.js';


export class NotebookExecutionService implements INotebookExecutionService, IDisposable {
	declare _serviceBrand: undefined;
	private _activeProxyKernelExecutionToken: CancellationTokenSource | undefined;

	constructor(
		@ICommandService private readonly _commandService: ICommandService,
		@INotebookKernelService private readonly _notebookKernelService: INotebookKernelService,
		@INotebookKernelHistoryService private readonly _notebookKernelHistoryService: INotebookKernelHistoryService,
		@IWorkspaceTrustRequestService private readonly _workspaceTrustRequestService: IWorkspaceTrustRequestService,
		@INotebookLoggingService private readonly _logService: INotebookLoggingService,
		@INotebookExecutionStateService private readonly _notebookExecutionStateService: INotebookExecutionStateService,
	) {
	}

	async executeNotebookCells(notebook: INotebookTextModel, cells: Iterable<NotebookCellTextModel>, contextKeyService: IContextKeyService): Promise<void> {
		const cellsArr = Array.from(cells)
			.filter(c => c.cellKind === CellKind.Code);
		if (!cellsArr.length) {
			return;
		}

		this._logService.debug(`Execution`, `${JSON.stringify(cellsArr.map(c => c.handle))}`);
		const message = nls.localize('notebookRunTrust', "Executing a notebook cell will run code from this workspace.");
		const trust = await this._workspaceTrustRequestService.requestWorkspaceTrust({ message });
		if (!trust) {
			return;
		}

		// create cell executions
		const cellExecutions: [NotebookCellTextModel, INotebookCellExecution][] = [];
		for (const cell of cellsArr) {
			const cellExe = this._notebookExecutionStateService.getCellExecution(cell.uri);
			if (!!cellExe) {
				continue;
			}
			cellExecutions.push([cell, this._notebookExecutionStateService.createCellExecution(notebook.uri, cell.handle)]);
		}

		const kernel = await KernelPickerMRUStrategy.resolveKernel(notebook, this._notebookKernelService, this._notebookKernelHistoryService, this._commandService);

		if (!kernel) {
			// clear all pending cell executions
			cellExecutions.forEach(cellExe => cellExe[1].complete({}));
			return;
		}

		this._notebookKernelHistoryService.addMostRecentKernel(kernel);

		// filter cell executions based on selected kernel
		const validCellExecutions: INotebookCellExecution[] = [];
		for (const [cell, cellExecution] of cellExecutions) {
			if (!kernel.supportedLanguages.includes(cell.language)) {
				cellExecution.complete({});
			} else {
				validCellExecutions.push(cellExecution);
			}
		}

		// request execution
		if (validCellExecutions.length > 0) {
			await this.runExecutionParticipants(validCellExecutions);

			this._notebookKernelService.selectKernelForNotebook(kernel, notebook);
			await kernel.executeNotebookCellsRequest(notebook.uri, validCellExecutions.map(c => c.cellHandle));
			// the connecting state can change before the kernel resolves executeNotebookCellsRequest
			const unconfirmed = validCellExecutions.filter(exe => exe.state === NotebookCellExecutionState.Unconfirmed);
			if (unconfirmed.length) {
				this._logService.debug(`Execution`, `Completing unconfirmed executions ${JSON.stringify(unconfirmed.map(exe => exe.cellHandle))}`);
				unconfirmed.forEach(exe => exe.complete({}));
			}
			this._logService.debug(`Execution`, `Completed executions ${JSON.stringify(validCellExecutions.map(exe => exe.cellHandle))}`);
		}
	}

	async cancelNotebookCellHandles(notebook: INotebookTextModel, cells: Iterable<number>): Promise<void> {
		const cellsArr = Array.from(cells);
		this._logService.debug(`Execution`, `CancelNotebookCellHandles ${JSON.stringify(cellsArr)}`);
		const kernel = this._notebookKernelService.getSelectedOrSuggestedKernel(notebook);
		if (kernel) {
			await kernel.cancelNotebookCellExecution(notebook.uri, cellsArr);

		}
	}

	async cancelNotebookCells(notebook: INotebookTextModel, cells: Iterable<NotebookCellTextModel>): Promise<void> {
		this.cancelNotebookCellHandles(notebook, Array.from(cells, cell => cell.handle));
	}

	private readonly cellExecutionParticipants = new Set<ICellExecutionParticipant>;

	registerExecutionParticipant(participant: ICellExecutionParticipant) {
		this.cellExecutionParticipants.add(participant);
		return toDisposable(() => this.cellExecutionParticipants.delete(participant));
	}

	private async runExecutionParticipants(executions: INotebookCellExecution[]): Promise<void> {
		for (const participant of this.cellExecutionParticipants) {
			await participant.onWillExecuteCell(executions);
		}
		return;
	}

	dispose() {
		this._activeProxyKernelExecutionToken?.dispose(true);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/services/notebookExecutionStateServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/services/notebookExecutionStateServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { combinedDisposable, Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { CellEditType, CellUri, ICellEditOperation, NotebookCellExecutionState, NotebookCellInternalMetadata, NotebookExecutionState, NotebookTextModelWillAddRemoveEvent } from '../../common/notebookCommon.js';
import { CellExecutionUpdateType, INotebookExecutionService } from '../../common/notebookExecutionService.js';
import { ICellExecuteUpdate, ICellExecutionComplete, ICellExecutionStateChangedEvent, ICellExecutionStateUpdate, IExecutionStateChangedEvent, IFailedCellInfo, INotebookCellExecution, INotebookExecution, INotebookExecutionStateService, INotebookFailStateChangedEvent, NotebookExecutionType } from '../../common/notebookExecutionStateService.js';
import { INotebookKernelService } from '../../common/notebookKernelService.js';
import { INotebookService } from '../../common/notebookService.js';

export class NotebookExecutionStateService extends Disposable implements INotebookExecutionStateService {
	declare _serviceBrand: undefined;

	private readonly _executions = new ResourceMap<Map<number, CellExecution>>();
	private readonly _notebookExecutions = new ResourceMap<[NotebookExecution, IDisposable]>();
	private readonly _notebookListeners = new ResourceMap<NotebookExecutionListeners>();
	private readonly _cellListeners = new ResourceMap<IDisposable>();
	private readonly _lastFailedCells = new ResourceMap<IFailedCellInfo>();
	private readonly _lastCompletedCellHandles = new ResourceMap<number>();

	private readonly _onDidChangeExecution = this._register(new Emitter<ICellExecutionStateChangedEvent | IExecutionStateChangedEvent>());
	onDidChangeExecution = this._onDidChangeExecution.event;

	private readonly _onDidChangeLastRunFailState = this._register(new Emitter<INotebookFailStateChangedEvent>());
	onDidChangeLastRunFailState = this._onDidChangeLastRunFailState.event;

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ILogService private readonly _logService: ILogService,
		@INotebookService private readonly _notebookService: INotebookService,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService
	) {
		super();
	}

	getLastFailedCellForNotebook(notebook: URI): number | undefined {
		const failedCell = this._lastFailedCells.get(notebook);
		return failedCell?.visible ? failedCell.cellHandle : undefined;
	}

	getLastCompletedCellForNotebook(notebook: URI): number | undefined {
		return this._lastCompletedCellHandles.get(notebook);
	}

	forceCancelNotebookExecutions(notebookUri: URI): void {
		const notebookCellExecutions = this._executions.get(notebookUri);
		if (notebookCellExecutions) {
			for (const exe of notebookCellExecutions.values()) {
				this._onCellExecutionDidComplete(notebookUri, exe.cellHandle, exe);
			}
		}
		if (this._notebookExecutions.has(notebookUri)) {
			this._onExecutionDidComplete(notebookUri);
		}
	}

	getCellExecution(cellUri: URI): INotebookCellExecution | undefined {
		const parsed = CellUri.parse(cellUri);
		if (!parsed) {
			throw new Error(`Not a cell URI: ${cellUri}`);
		}

		const exeMap = this._executions.get(parsed.notebook);
		if (exeMap) {
			return exeMap.get(parsed.handle);
		}

		return undefined;
	}
	getExecution(notebook: URI): INotebookExecution | undefined {
		return this._notebookExecutions.get(notebook)?.[0];
	}

	getCellExecutionsForNotebook(notebook: URI): INotebookCellExecution[] {
		const exeMap = this._executions.get(notebook);
		return exeMap ? Array.from(exeMap.values()) : [];
	}

	getCellExecutionsByHandleForNotebook(notebook: URI): Map<number, INotebookCellExecution> | undefined {
		const exeMap = this._executions.get(notebook);
		return exeMap ? new Map(exeMap.entries()) : undefined;
	}

	private _onCellExecutionDidChange(notebookUri: URI, cellHandle: number, exe: CellExecution): void {
		this._onDidChangeExecution.fire(new NotebookCellExecutionEvent(notebookUri, cellHandle, exe));
	}

	private _onCellExecutionDidComplete(notebookUri: URI, cellHandle: number, exe: CellExecution, lastRunSuccess?: boolean): void {
		const notebookExecutions = this._executions.get(notebookUri);
		if (!notebookExecutions) {
			this._logService.debug(`NotebookExecutionStateService#_onCellExecutionDidComplete - unknown notebook ${notebookUri.toString()}`);
			return;
		}

		exe.dispose();
		const cellUri = CellUri.generate(notebookUri, cellHandle);
		this._cellListeners.get(cellUri)?.dispose();
		this._cellListeners.delete(cellUri);
		notebookExecutions.delete(cellHandle);
		if (notebookExecutions.size === 0) {
			this._executions.delete(notebookUri);
			this._notebookListeners.get(notebookUri)?.dispose();
			this._notebookListeners.delete(notebookUri);
		}

		if (lastRunSuccess !== undefined) {
			if (lastRunSuccess) {
				if (this._executions.size === 0) {
					this._accessibilitySignalService.playSignal(AccessibilitySignal.notebookCellCompleted);
				}
				this._clearLastFailedCell(notebookUri);
			} else {
				this._accessibilitySignalService.playSignal(AccessibilitySignal.notebookCellFailed);
				this._setLastFailedCell(notebookUri, cellHandle);
			}
			this._lastCompletedCellHandles.set(notebookUri, cellHandle);
		}

		this._onDidChangeExecution.fire(new NotebookCellExecutionEvent(notebookUri, cellHandle));
	}

	private _onExecutionDidChange(notebookUri: URI, exe: NotebookExecution): void {
		this._onDidChangeExecution.fire(new NotebookExecutionEvent(notebookUri, exe));
	}

	private _onExecutionDidComplete(notebookUri: URI): void {
		const disposables = this._notebookExecutions.get(notebookUri);
		if (!Array.isArray(disposables)) {
			this._logService.debug(`NotebookExecutionStateService#_onCellExecutionDidComplete - unknown notebook ${notebookUri.toString()}`);
			return;
		}

		this._notebookExecutions.delete(notebookUri);
		this._onDidChangeExecution.fire(new NotebookExecutionEvent(notebookUri));
		disposables.forEach(d => d.dispose());
	}

	createCellExecution(notebookUri: URI, cellHandle: number): INotebookCellExecution {
		const notebook = this._notebookService.getNotebookTextModel(notebookUri);
		if (!notebook) {
			throw new Error(`Notebook not found: ${notebookUri.toString()}`);
		}

		let notebookExecutionMap = this._executions.get(notebookUri);
		if (!notebookExecutionMap) {
			const listeners = this._instantiationService.createInstance(NotebookExecutionListeners, notebookUri);
			this._notebookListeners.set(notebookUri, listeners);

			notebookExecutionMap = new Map<number, CellExecution>();
			this._executions.set(notebookUri, notebookExecutionMap);
		}

		let exe = notebookExecutionMap.get(cellHandle);
		if (!exe) {
			exe = this._createNotebookCellExecution(notebook, cellHandle);
			notebookExecutionMap.set(cellHandle, exe);
			exe.initialize();
			this._onDidChangeExecution.fire(new NotebookCellExecutionEvent(notebookUri, cellHandle, exe));
		}

		return exe;
	}
	createExecution(notebookUri: URI): INotebookExecution {
		const notebook = this._notebookService.getNotebookTextModel(notebookUri);
		if (!notebook) {
			throw new Error(`Notebook not found: ${notebookUri.toString()}`);
		}

		if (!this._notebookListeners.has(notebookUri)) {
			const listeners = this._instantiationService.createInstance(NotebookExecutionListeners, notebookUri);
			this._notebookListeners.set(notebookUri, listeners);
		}

		let info = this._notebookExecutions.get(notebookUri);
		if (!info) {
			info = this._createNotebookExecution(notebook);
			this._notebookExecutions.set(notebookUri, info);
			this._onDidChangeExecution.fire(new NotebookExecutionEvent(notebookUri, info[0]));
		}

		return info[0];
	}

	private _createNotebookCellExecution(notebook: NotebookTextModel, cellHandle: number): CellExecution {
		const notebookUri = notebook.uri;
		const exe: CellExecution = this._instantiationService.createInstance(CellExecution, cellHandle, notebook);
		const disposable = combinedDisposable(
			exe.onDidUpdate(() => this._onCellExecutionDidChange(notebookUri, cellHandle, exe)),
			exe.onDidComplete(lastRunSuccess => this._onCellExecutionDidComplete(notebookUri, cellHandle, exe, lastRunSuccess)));
		this._cellListeners.set(CellUri.generate(notebookUri, cellHandle), disposable);

		return exe;
	}

	private _createNotebookExecution(notebook: NotebookTextModel): [NotebookExecution, IDisposable] {
		const notebookUri = notebook.uri;
		const exe: NotebookExecution = this._instantiationService.createInstance(NotebookExecution, notebook);
		const disposable = combinedDisposable(
			exe.onDidUpdate(() => this._onExecutionDidChange(notebookUri, exe)),
			exe.onDidComplete(() => this._onExecutionDidComplete(notebookUri)));
		return [exe, disposable];
	}

	private _setLastFailedCell(notebookURI: URI, cellHandle: number): void {
		const prevLastFailedCellInfo = this._lastFailedCells.get(notebookURI);
		const notebook = this._notebookService.getNotebookTextModel(notebookURI);
		if (!notebook) {
			return;
		}

		const newLastFailedCellInfo: IFailedCellInfo = {
			cellHandle: cellHandle,
			disposable: prevLastFailedCellInfo ? prevLastFailedCellInfo.disposable : this._getFailedCellListener(notebook),
			visible: true
		};

		this._lastFailedCells.set(notebookURI, newLastFailedCellInfo);

		this._onDidChangeLastRunFailState.fire({ visible: true, notebook: notebookURI });
	}

	private _setLastFailedCellVisibility(notebookURI: URI, visible: boolean): void {
		const lastFailedCellInfo = this._lastFailedCells.get(notebookURI);

		if (lastFailedCellInfo) {
			this._lastFailedCells.set(notebookURI, {
				cellHandle: lastFailedCellInfo.cellHandle,
				disposable: lastFailedCellInfo.disposable,
				visible: visible,
			});
		}

		this._onDidChangeLastRunFailState.fire({ visible: visible, notebook: notebookURI });
	}

	private _clearLastFailedCell(notebookURI: URI): void {
		const lastFailedCellInfo = this._lastFailedCells.get(notebookURI);

		if (lastFailedCellInfo) {
			lastFailedCellInfo.disposable?.dispose();
			this._lastFailedCells.delete(notebookURI);
		}

		this._onDidChangeLastRunFailState.fire({ visible: false, notebook: notebookURI });
	}

	private _getFailedCellListener(notebook: NotebookTextModel): IDisposable {
		return notebook.onWillAddRemoveCells((e: NotebookTextModelWillAddRemoveEvent) => {
			const lastFailedCell = this._lastFailedCells.get(notebook.uri)?.cellHandle;
			if (lastFailedCell !== undefined) {
				const lastFailedCellPos = notebook.cells.findIndex(c => c.handle === lastFailedCell);
				e.rawEvent.changes.forEach(([start, deleteCount, addedCells]) => {
					if (deleteCount) {
						if (lastFailedCellPos >= start && lastFailedCellPos < start + deleteCount) {
							this._setLastFailedCellVisibility(notebook.uri, false);
						}
					}

					if (addedCells.some(cell => cell.handle === lastFailedCell)) {
						this._setLastFailedCellVisibility(notebook.uri, true);
					}

				});
			}
		});
	}

	override dispose(): void {
		super.dispose();
		this._executions.forEach(executionMap => {
			executionMap.forEach(execution => execution.dispose());
			executionMap.clear();
		});
		this._executions.clear();
		this._notebookExecutions.forEach(disposables => {
			disposables.forEach(d => d.dispose());
		});
		this._notebookExecutions.clear();

		this._cellListeners.forEach(disposable => disposable.dispose());
		this._notebookListeners.forEach(disposable => disposable.dispose());
		this._lastFailedCells.forEach(elem => elem.disposable.dispose());
	}
}

class NotebookCellExecutionEvent implements ICellExecutionStateChangedEvent {
	readonly type = NotebookExecutionType.cell;
	constructor(
		readonly notebook: URI,
		readonly cellHandle: number,
		readonly changed?: CellExecution
	) { }

	affectsCell(cell: URI): boolean {
		const parsedUri = CellUri.parse(cell);
		return !!parsedUri && isEqual(this.notebook, parsedUri.notebook) && this.cellHandle === parsedUri.handle;
	}

	affectsNotebook(notebook: URI): boolean {
		return isEqual(this.notebook, notebook);
	}
}

class NotebookExecutionEvent implements IExecutionStateChangedEvent {
	readonly type = NotebookExecutionType.notebook;
	constructor(
		readonly notebook: URI,
		readonly changed?: NotebookExecution
	) { }

	affectsNotebook(notebook: URI): boolean {
		return isEqual(this.notebook, notebook);
	}
}

class NotebookExecutionListeners extends Disposable {
	private readonly _notebookModel: NotebookTextModel;

	constructor(
		notebook: URI,
		@INotebookService private readonly _notebookService: INotebookService,
		@INotebookKernelService private readonly _notebookKernelService: INotebookKernelService,
		@INotebookExecutionService private readonly _notebookExecutionService: INotebookExecutionService,
		@INotebookExecutionStateService private readonly _notebookExecutionStateService: INotebookExecutionStateService,
		@ILogService private readonly _logService: ILogService,
	) {
		super();
		this._logService.debug(`NotebookExecution#ctor ${notebook.toString()}`);

		const notebookModel = this._notebookService.getNotebookTextModel(notebook);
		if (!notebookModel) {
			throw new Error('Notebook not found: ' + notebook);
		}

		this._notebookModel = notebookModel;
		this._register(this._notebookModel.onWillAddRemoveCells(e => this.onWillAddRemoveCells(e)));
		this._register(this._notebookModel.onWillDispose(() => this.onWillDisposeDocument()));
	}

	private cancelAll(): void {
		this._logService.debug(`NotebookExecutionListeners#cancelAll`);
		const exes = this._notebookExecutionStateService.getCellExecutionsForNotebook(this._notebookModel.uri);
		this._notebookExecutionService.cancelNotebookCellHandles(this._notebookModel, exes.map(exe => exe.cellHandle));
	}

	private onWillDisposeDocument(): void {
		this._logService.debug(`NotebookExecution#onWillDisposeDocument`);
		this.cancelAll();
	}

	private onWillAddRemoveCells(e: NotebookTextModelWillAddRemoveEvent): void {
		const notebookExes = this._notebookExecutionStateService.getCellExecutionsByHandleForNotebook(this._notebookModel.uri);

		const executingDeletedHandles = new Set<number>();
		const pendingDeletedHandles = new Set<number>();
		if (notebookExes) {
			e.rawEvent.changes.forEach(([start, deleteCount]) => {
				if (deleteCount) {
					const deletedHandles = this._notebookModel.cells.slice(start, start + deleteCount).map(c => c.handle);
					deletedHandles.forEach(h => {
						const exe = notebookExes.get(h);
						if (exe?.state === NotebookCellExecutionState.Executing) {
							executingDeletedHandles.add(h);
						} else if (exe) {
							pendingDeletedHandles.add(h);
						}
					});
				}
			});
		}

		if (executingDeletedHandles.size || pendingDeletedHandles.size) {
			const kernel = this._notebookKernelService.getSelectedOrSuggestedKernel(this._notebookModel);
			if (kernel) {
				const implementsInterrupt = kernel.implementsInterrupt;
				const handlesToCancel = implementsInterrupt ? [...executingDeletedHandles] : [...executingDeletedHandles, ...pendingDeletedHandles];
				this._logService.debug(`NotebookExecution#onWillAddRemoveCells, ${JSON.stringify([...handlesToCancel])}`);
				if (handlesToCancel.length) {
					kernel.cancelNotebookCellExecution(this._notebookModel.uri, handlesToCancel);
				}
			}
		}
	}
}

function updateToEdit(update: ICellExecuteUpdate, cellHandle: number): ICellEditOperation {
	if (update.editType === CellExecutionUpdateType.Output) {
		return {
			editType: CellEditType.Output,
			handle: update.cellHandle,
			append: update.append,
			outputs: update.outputs,
		};
	} else if (update.editType === CellExecutionUpdateType.OutputItems) {
		return {
			editType: CellEditType.OutputItems,
			items: update.items,
			append: update.append,
			outputId: update.outputId
		};
	} else if (update.editType === CellExecutionUpdateType.ExecutionState) {
		const newInternalMetadata: Partial<NotebookCellInternalMetadata> = {};
		if (typeof update.executionOrder !== 'undefined') {
			newInternalMetadata.executionOrder = update.executionOrder;
		}
		if (typeof update.runStartTime !== 'undefined') {
			newInternalMetadata.runStartTime = update.runStartTime;
		}
		return {
			editType: CellEditType.PartialInternalMetadata,
			handle: cellHandle,
			internalMetadata: newInternalMetadata
		};
	}

	throw new Error('Unknown cell update type');
}

class CellExecution extends Disposable implements INotebookCellExecution {
	private readonly _onDidUpdate = this._register(new Emitter<void>());
	readonly onDidUpdate = this._onDidUpdate.event;

	private readonly _onDidComplete = this._register(new Emitter<boolean | undefined>());
	readonly onDidComplete = this._onDidComplete.event;

	private _state: NotebookCellExecutionState = NotebookCellExecutionState.Unconfirmed;
	get state() {
		return this._state;
	}

	get notebook(): URI {
		return this._notebookModel.uri;
	}

	private _didPause = false;
	get didPause() {
		return this._didPause;
	}

	private _isPaused = false;
	get isPaused() {
		return this._isPaused;
	}

	constructor(
		readonly cellHandle: number,
		private readonly _notebookModel: NotebookTextModel,
		@ILogService private readonly _logService: ILogService,
	) {
		super();
		this._logService.debug(`CellExecution#ctor ${this.getCellLog()}`);
	}

	initialize() {
		const startExecuteEdit: ICellEditOperation = {
			editType: CellEditType.PartialInternalMetadata,
			handle: this.cellHandle,
			internalMetadata: {
				executionId: generateUuid(),
				runStartTime: null,
				runEndTime: null,
				lastRunSuccess: null,
				executionOrder: null,
				renderDuration: null,
			}
		};
		this._applyExecutionEdits([startExecuteEdit]);
	}

	private getCellLog(): string {
		return `${this._notebookModel.uri.toString()}, ${this.cellHandle}`;
	}

	private logUpdates(updates: ICellExecuteUpdate[]): void {
		const updateTypes = updates.map(u => CellExecutionUpdateType[u.editType]).join(', ');
		this._logService.debug(`CellExecution#updateExecution ${this.getCellLog()}, [${updateTypes}]`);
	}

	confirm() {
		this._logService.debug(`CellExecution#confirm ${this.getCellLog()}`);
		this._state = NotebookCellExecutionState.Pending;
		this._onDidUpdate.fire();
	}

	update(updates: ICellExecuteUpdate[]): void {
		this.logUpdates(updates);
		if (updates.some(u => u.editType === CellExecutionUpdateType.ExecutionState)) {
			this._state = NotebookCellExecutionState.Executing;
		}

		if (!this._didPause && updates.some(u => u.editType === CellExecutionUpdateType.ExecutionState && u.didPause)) {
			this._didPause = true;
		}

		const lastIsPausedUpdate = [...updates].reverse().find(u => u.editType === CellExecutionUpdateType.ExecutionState && typeof u.isPaused === 'boolean');
		if (lastIsPausedUpdate) {
			this._isPaused = (lastIsPausedUpdate as ICellExecutionStateUpdate).isPaused!;
		}

		const cellModel = this._notebookModel.cells.find(c => c.handle === this.cellHandle);
		if (!cellModel) {
			this._logService.debug(`CellExecution#update, updating cell not in notebook: ${this._notebookModel.uri.toString()}, ${this.cellHandle}`);
		} else {
			const edits = updates.map(update => updateToEdit(update, this.cellHandle));
			this._applyExecutionEdits(edits);
		}

		if (updates.some(u => u.editType === CellExecutionUpdateType.ExecutionState)) {
			this._onDidUpdate.fire();
		}
	}

	complete(completionData: ICellExecutionComplete): void {
		const cellModel = this._notebookModel.cells.find(c => c.handle === this.cellHandle);
		if (!cellModel) {
			this._logService.debug(`CellExecution#complete, completing cell not in notebook: ${this._notebookModel.uri.toString()}, ${this.cellHandle}`);
		} else {
			const edit: ICellEditOperation = {
				editType: CellEditType.PartialInternalMetadata,
				handle: this.cellHandle,
				internalMetadata: {
					lastRunSuccess: completionData.lastRunSuccess,
					runStartTime: this._didPause ? null : cellModel.internalMetadata.runStartTime,
					runEndTime: this._didPause ? null : completionData.runEndTime,
					error: completionData.error
				}
			};
			this._applyExecutionEdits([edit]);
		}

		this._onDidComplete.fire(completionData.lastRunSuccess);
	}

	private _applyExecutionEdits(edits: ICellEditOperation[]): void {
		this._notebookModel.applyEdits(edits, true, undefined, () => undefined, undefined, false);
	}
}

class NotebookExecution extends Disposable implements INotebookExecution {
	private readonly _onDidUpdate = this._register(new Emitter<void>());
	readonly onDidUpdate = this._onDidUpdate.event;

	private readonly _onDidComplete = this._register(new Emitter<void>());
	readonly onDidComplete = this._onDidComplete.event;

	private _state: NotebookExecutionState = NotebookExecutionState.Unconfirmed;
	get state() {
		return this._state;
	}

	get notebook(): URI {
		return this._notebookModel.uri;
	}

	constructor(
		private readonly _notebookModel: NotebookTextModel,
		@ILogService private readonly _logService: ILogService,
	) {
		super();
		this._logService.debug(`NotebookExecution#ctor`);
	}
	private debug(message: string) {
		this._logService.debug(`${message} ${this._notebookModel.uri.toString()}`);
	}

	confirm() {
		this.debug(`Execution#confirm`);
		this._state = NotebookExecutionState.Pending;
		this._onDidUpdate.fire();
	}

	begin(): void {
		this.debug(`Execution#begin`);
		this._state = NotebookExecutionState.Executing;
		this._onDidUpdate.fire();
	}

	complete(): void {
		this.debug(`Execution#begin`);
		this._state = NotebookExecutionState.Unconfirmed;
		this._onDidComplete.fire();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/services/notebookKernelHistoryServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/services/notebookKernelHistoryServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { LinkedMap, Touch } from '../../../../../base/common/map.js';
import { localize2 } from '../../../../../nls.js';
import { Categories } from '../../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { INotebookKernel, INotebookKernelHistoryService, INotebookKernelService, INotebookTextModelLike } from '../../common/notebookKernelService.js';
import { INotebookLoggingService } from '../../common/notebookLoggingService.js';

interface ISerializedKernelsListPerType {
	entries: string[];
}

interface ISerializedKernelsList {
	[viewType: string]: ISerializedKernelsListPerType;
}

const MAX_KERNELS_IN_HISTORY = 5;

export class NotebookKernelHistoryService extends Disposable implements INotebookKernelHistoryService {
	declare _serviceBrand: undefined;

	private static STORAGE_KEY = 'notebook.kernelHistory';
	private _mostRecentKernelsMap: { [key: string]: LinkedMap<string, string> } = {};

	constructor(@IStorageService private readonly _storageService: IStorageService,
		@INotebookKernelService private readonly _notebookKernelService: INotebookKernelService,
		@INotebookLoggingService private readonly _notebookLoggingService: INotebookLoggingService) {
		super();

		this._loadState();
		this._register(this._storageService.onWillSaveState(() => this._saveState()));
		this._register(this._storageService.onDidChangeValue(StorageScope.WORKSPACE, NotebookKernelHistoryService.STORAGE_KEY, this._store)(() => {
			this._loadState();
		}));
	}

	getKernels(notebook: INotebookTextModelLike): { selected: INotebookKernel | undefined; all: INotebookKernel[] } {
		const allAvailableKernels = this._notebookKernelService.getMatchingKernel(notebook);
		const allKernels = allAvailableKernels.all;
		const selectedKernel = allAvailableKernels.selected;
		// We will suggest the only kernel
		const suggested = allAvailableKernels.all.length === 1 ? allAvailableKernels.all[0] : undefined;
		this._notebookLoggingService.debug('History', `getMatchingKernels: ${allAvailableKernels.all.length} kernels available for ${notebook.uri.path}. Selected: ${allAvailableKernels.selected?.label}. Suggested: ${suggested?.label}`);
		const mostRecentKernelIds = this._mostRecentKernelsMap[notebook.notebookType] ? [...this._mostRecentKernelsMap[notebook.notebookType].values()] : [];
		const all = mostRecentKernelIds.map(kernelId => allKernels.find(kernel => kernel.id === kernelId)).filter(kernel => !!kernel) as INotebookKernel[];
		this._notebookLoggingService.debug('History', `mru: ${mostRecentKernelIds.length} kernels in history, ${all.length} registered already.`);

		return {
			selected: selectedKernel ?? suggested,
			all
		};
	}

	addMostRecentKernel(kernel: INotebookKernel): void {
		const key = kernel.id;
		const viewType = kernel.viewType;
		const recentKeynels = this._mostRecentKernelsMap[viewType] ?? new LinkedMap<string, string>();

		recentKeynels.set(key, key, Touch.AsOld);


		if (recentKeynels.size > MAX_KERNELS_IN_HISTORY) {
			const reserved = [...recentKeynels.entries()].slice(0, MAX_KERNELS_IN_HISTORY);
			recentKeynels.fromJSON(reserved);
		}

		this._mostRecentKernelsMap[viewType] = recentKeynels;
	}

	private _saveState(): void {
		let notEmpty = false;
		for (const [_, kernels] of Object.entries(this._mostRecentKernelsMap)) {
			notEmpty = notEmpty || kernels.size > 0;
		}

		if (notEmpty) {
			const serialized = this._serialize();
			this._storageService.store(NotebookKernelHistoryService.STORAGE_KEY, JSON.stringify(serialized), StorageScope.WORKSPACE, StorageTarget.USER);
		} else {
			this._storageService.remove(NotebookKernelHistoryService.STORAGE_KEY, StorageScope.WORKSPACE);
		}
	}

	private _loadState(): void {
		const serialized = this._storageService.get(NotebookKernelHistoryService.STORAGE_KEY, StorageScope.WORKSPACE);
		if (serialized) {
			try {
				this._deserialize(JSON.parse(serialized));
			} catch (e) {
				this._mostRecentKernelsMap = {};
			}
		} else {
			this._mostRecentKernelsMap = {};
		}
	}

	private _serialize(): ISerializedKernelsList {
		const result: ISerializedKernelsList = Object.create(null);

		for (const [viewType, kernels] of Object.entries(this._mostRecentKernelsMap)) {
			result[viewType] = {
				entries: [...kernels.values()]
			};
		}
		return result;
	}

	private _deserialize(serialized: ISerializedKernelsList): void {
		this._mostRecentKernelsMap = {};

		for (const [viewType, kernels] of Object.entries(serialized)) {
			const linkedMap = new LinkedMap<string, string>();
			const mapValues: [string, string][] = [];

			for (const entry of kernels.entries) {
				mapValues.push([entry, entry]);
			}

			linkedMap.fromJSON(mapValues);
			this._mostRecentKernelsMap[viewType] = linkedMap;
		}
	}

	_clear(): void {
		this._mostRecentKernelsMap = {};
		this._saveState();
	}
}

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.clearNotebookKernelsMRUCache',
			title: localize2('workbench.notebook.clearNotebookKernelsMRUCache', "Clear Notebook Kernels MRU Cache"),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const historyService = accessor.get(INotebookKernelHistoryService) as NotebookKernelHistoryService;
		historyService._clear();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/services/notebookKernelServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/services/notebookKernelServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, Emitter } from '../../../../../base/common/event.js';
import { Disposable, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { INotebookKernelSourceAction, INotebookTextModel } from '../../common/notebookCommon.js';
import { INotebookKernel, ISelectedNotebooksChangeEvent, INotebookKernelMatchResult, INotebookKernelService, INotebookTextModelLike, ISourceAction, INotebookSourceActionChangeEvent, INotebookKernelDetectionTask, IKernelSourceActionProvider } from '../../common/notebookKernelService.js';
import { LRUCache, ResourceMap } from '../../../../../base/common/map.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { URI } from '../../../../../base/common/uri.js';
import { INotebookService } from '../../common/notebookService.js';
import { IMenu, IMenuService, MenuId } from '../../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IAction } from '../../../../../base/common/actions.js';
import { MarshalledId } from '../../../../../base/common/marshallingIds.js';
import { Schemas } from '../../../../../base/common/network.js';
import { getActiveWindow, runWhenWindowIdle } from '../../../../../base/browser/dom.js';

class KernelInfo {

	private static _logicClock = 0;

	readonly kernel: INotebookKernel;
	public score: number;
	readonly time: number;

	readonly notebookPriorities = new ResourceMap<number>();

	constructor(kernel: INotebookKernel) {
		this.kernel = kernel;
		this.score = -1;
		this.time = KernelInfo._logicClock++;
	}
}

class NotebookTextModelLikeId {
	static str(k: INotebookTextModelLike): string {
		return `${k.notebookType}/${k.uri.toString()}`;
	}
	static obj(s: string): INotebookTextModelLike {
		const idx = s.indexOf('/');
		return {
			notebookType: s.substring(0, idx),
			uri: URI.parse(s.substring(idx + 1))
		};
	}
}

class SourceAction extends Disposable implements ISourceAction {
	execution: Promise<void> | undefined;
	private readonly _onDidChangeState = this._register(new Emitter<void>());
	readonly onDidChangeState = this._onDidChangeState.event;

	constructor(
		readonly action: IAction,
		readonly model: INotebookTextModelLike,
		readonly isPrimary: boolean
	) {
		super();
	}

	async runAction() {
		if (this.execution) {
			return this.execution;
		}

		this.execution = this._runAction();
		this._onDidChangeState.fire();
		await this.execution;
		this.execution = undefined;
		this._onDidChangeState.fire();
	}

	private async _runAction(): Promise<void> {
		try {
			await this.action.run({
				uri: this.model.uri,
				$mid: MarshalledId.NotebookActionContext
			});

		} catch (error) {
			console.warn(`Kernel source command failed: ${error}`);
		}
	}
}

interface IKernelInfoCache {
	menu: IMenu;
	actions: [ISourceAction, IDisposable][];

}

export class NotebookKernelService extends Disposable implements INotebookKernelService {

	declare _serviceBrand: undefined;

	private readonly _kernels = new Map<string, KernelInfo>();

	private readonly _notebookBindings = new LRUCache<string, string>(1000, 0.7);

	private readonly _onDidChangeNotebookKernelBinding = this._register(new Emitter<ISelectedNotebooksChangeEvent>());
	private readonly _onDidAddKernel = this._register(new Emitter<INotebookKernel>());
	private readonly _onDidRemoveKernel = this._register(new Emitter<INotebookKernel>());
	private readonly _onDidChangeNotebookAffinity = this._register(new Emitter<void>());
	private readonly _onDidChangeSourceActions = this._register(new Emitter<INotebookSourceActionChangeEvent>());
	private readonly _onDidNotebookVariablesChange = this._register(new Emitter<URI>());
	private readonly _kernelSources = new Map<string, IKernelInfoCache>();
	private readonly _kernelSourceActionsUpdates = new Map<string, IDisposable>();
	private readonly _kernelDetectionTasks = new Map<string, INotebookKernelDetectionTask[]>();
	private readonly _onDidChangeKernelDetectionTasks = this._register(new Emitter<string>());
	private readonly _kernelSourceActionProviders = new Map<string, IKernelSourceActionProvider[]>();

	readonly onDidChangeSelectedNotebooks: Event<ISelectedNotebooksChangeEvent> = this._onDidChangeNotebookKernelBinding.event;
	readonly onDidAddKernel: Event<INotebookKernel> = this._onDidAddKernel.event;
	readonly onDidRemoveKernel: Event<INotebookKernel> = this._onDidRemoveKernel.event;
	readonly onDidChangeNotebookAffinity: Event<void> = this._onDidChangeNotebookAffinity.event;
	readonly onDidChangeSourceActions: Event<INotebookSourceActionChangeEvent> = this._onDidChangeSourceActions.event;
	readonly onDidChangeKernelDetectionTasks: Event<string> = this._onDidChangeKernelDetectionTasks.event;
	readonly onDidNotebookVariablesUpdate: Event<URI> = this._onDidNotebookVariablesChange.event;

	private static _storageNotebookBinding = 'notebook.controller2NotebookBindings';


	constructor(
		@INotebookService private readonly _notebookService: INotebookService,
		@IStorageService private readonly _storageService: IStorageService,
		@IMenuService private readonly _menuService: IMenuService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService
	) {
		super();

		// auto associate kernels to new notebook documents, also emit event when
		// a notebook has been closed (but don't update the memento)
		this._register(_notebookService.onDidAddNotebookDocument(this._tryAutoBindNotebook, this));
		this._register(_notebookService.onWillRemoveNotebookDocument(notebook => {
			const id = NotebookTextModelLikeId.str(notebook);
			const kernelId = this._notebookBindings.get(id);
			if (kernelId && notebook.uri.scheme === Schemas.untitled) {
				this.selectKernelForNotebook(undefined, notebook);
			}
			this._kernelSourceActionsUpdates.get(id)?.dispose();
			this._kernelSourceActionsUpdates.delete(id);
		}));

		// restore from storage
		try {
			const data = JSON.parse(this._storageService.get(NotebookKernelService._storageNotebookBinding, StorageScope.WORKSPACE, '[]'));
			this._notebookBindings.fromJSON(data);
		} catch {
			// ignore
		}
	}

	override dispose() {
		this._kernels.clear();
		this._kernelSources.forEach(v => {
			v.menu.dispose();
			v.actions.forEach(a => a[1].dispose());
		});
		this._kernelSourceActionsUpdates.forEach(v => {
			v.dispose();
		});
		this._kernelSourceActionsUpdates.clear();
		super.dispose();
	}

	private _persistSoonHandle?: IDisposable;

	private _persistMementos(): void {
		this._persistSoonHandle?.dispose();
		this._persistSoonHandle = runWhenWindowIdle(getActiveWindow(), () => {
			this._storageService.store(NotebookKernelService._storageNotebookBinding, JSON.stringify(this._notebookBindings), StorageScope.WORKSPACE, StorageTarget.MACHINE);
		}, 100);
	}

	private static _score(kernel: INotebookKernel, notebook: INotebookTextModelLike): number {
		if (kernel.viewType === '*') {
			return 5;
		} else if (kernel.viewType === notebook.notebookType) {
			return 10;
		} else {
			return 0;
		}
	}

	private _tryAutoBindNotebook(notebook: INotebookTextModel, onlyThisKernel?: INotebookKernel): void {

		const id = this._notebookBindings.get(NotebookTextModelLikeId.str(notebook));
		if (!id) {
			// no kernel associated
			return;
		}
		const existingKernel = this._kernels.get(id);
		if (!existingKernel || !NotebookKernelService._score(existingKernel.kernel, notebook)) {
			// associated kernel not known, not matching
			return;
		}
		if (!onlyThisKernel || existingKernel.kernel === onlyThisKernel) {
			this._onDidChangeNotebookKernelBinding.fire({ notebook: notebook.uri, oldKernel: undefined, newKernel: existingKernel.kernel.id });
		}
	}

	notifyVariablesChange(notebookUri: URI): void {
		this._onDidNotebookVariablesChange.fire(notebookUri);
	}

	registerKernel(kernel: INotebookKernel): IDisposable {
		if (this._kernels.has(kernel.id)) {
			throw new Error(`NOTEBOOK CONTROLLER with id '${kernel.id}' already exists`);
		}

		this._kernels.set(kernel.id, new KernelInfo(kernel));
		this._onDidAddKernel.fire(kernel);

		// auto associate the new kernel to existing notebooks it was
		// associated to in the past.
		for (const notebook of this._notebookService.getNotebookTextModels()) {
			this._tryAutoBindNotebook(notebook, kernel);
		}

		return toDisposable(() => {
			if (this._kernels.delete(kernel.id)) {
				this._onDidRemoveKernel.fire(kernel);
			}
			for (const [key, candidate] of Array.from(this._notebookBindings)) {
				if (candidate === kernel.id) {
					this._onDidChangeNotebookKernelBinding.fire({ notebook: NotebookTextModelLikeId.obj(key).uri, oldKernel: kernel.id, newKernel: undefined });
				}
			}
		});
	}

	getMatchingKernel(notebook: INotebookTextModelLike): INotebookKernelMatchResult {

		// all applicable kernels
		const kernels: { kernel: INotebookKernel; instanceAffinity: number; score: number }[] = [];
		for (const info of this._kernels.values()) {
			const score = NotebookKernelService._score(info.kernel, notebook);
			if (score) {
				kernels.push({
					score,
					kernel: info.kernel,
					instanceAffinity: info.notebookPriorities.get(notebook.uri) ?? 1 /* vscode.NotebookControllerPriority.Default */,
				});
			}
		}

		kernels
			.sort((a, b) => b.instanceAffinity - a.instanceAffinity || a.score - b.score || a.kernel.label.localeCompare(b.kernel.label));
		const all = kernels.map(obj => obj.kernel);

		// bound kernel
		const selectedId = this._notebookBindings.get(NotebookTextModelLikeId.str(notebook));
		const selected = selectedId ? this._kernels.get(selectedId)?.kernel : undefined;
		const suggestions = kernels.filter(item => item.instanceAffinity > 1).map(item => item.kernel);
		const hidden = kernels.filter(item => item.instanceAffinity < 0).map(item => item.kernel);
		return { all, selected, suggestions, hidden };
	}

	getSelectedOrSuggestedKernel(notebook: INotebookTextModel): INotebookKernel | undefined {
		const info = this.getMatchingKernel(notebook);
		if (info.selected) {
			return info.selected;
		}

		const preferred = info.all.filter(kernel => this._kernels.get(kernel.id)?.notebookPriorities.get(notebook.uri) === 2 /* vscode.NotebookControllerPriority.Preferred */);
		if (preferred.length === 1) {
			return preferred[0];
		}

		return info.all.length === 1 ? info.all[0] : undefined;
	}

	// a notebook has one kernel, a kernel has N notebooks
	// notebook <-1----N-> kernel
	selectKernelForNotebook(kernel: INotebookKernel | undefined, notebook: INotebookTextModelLike): void {
		const key = NotebookTextModelLikeId.str(notebook);
		const oldKernel = this._notebookBindings.get(key);
		if (oldKernel !== kernel?.id) {
			if (kernel) {
				this._notebookBindings.set(key, kernel.id);
			} else {
				this._notebookBindings.delete(key);
			}
			this._onDidChangeNotebookKernelBinding.fire({ notebook: notebook.uri, oldKernel, newKernel: kernel?.id });
			this._persistMementos();
		}
	}

	preselectKernelForNotebook(kernel: INotebookKernel, notebook: INotebookTextModelLike): void {
		const key = NotebookTextModelLikeId.str(notebook);
		const oldKernel = this._notebookBindings.get(key);
		if (oldKernel !== kernel?.id) {
			this._notebookBindings.set(key, kernel.id);
			this._persistMementos();
		}
	}

	updateKernelNotebookAffinity(kernel: INotebookKernel, notebook: URI, preference: number | undefined): void {
		const info = this._kernels.get(kernel.id);
		if (!info) {
			throw new Error(`UNKNOWN kernel '${kernel.id}'`);
		}
		if (preference === undefined) {
			info.notebookPriorities.delete(notebook);
		} else {
			info.notebookPriorities.set(notebook, preference);
		}
		this._onDidChangeNotebookAffinity.fire();
	}

	getRunningSourceActions(notebook: INotebookTextModelLike) {
		const id = NotebookTextModelLikeId.str(notebook);
		const existingInfo = this._kernelSources.get(id);
		if (existingInfo) {
			return existingInfo.actions.filter(action => action[0].execution).map(action => action[0]);
		}

		return [];
	}

	getSourceActions(notebook: INotebookTextModelLike, contextKeyService: IContextKeyService | undefined): ISourceAction[] {
		contextKeyService = contextKeyService ?? this._contextKeyService;
		const id = NotebookTextModelLikeId.str(notebook);
		const existingInfo = this._kernelSources.get(id);

		if (existingInfo) {
			return existingInfo.actions.map(a => a[0]);
		}

		const sourceMenu = this._register(this._menuService.createMenu(MenuId.NotebookKernelSource, contextKeyService));
		const info: IKernelInfoCache = { menu: sourceMenu, actions: [] };

		const loadActionsFromMenu = (menu: IMenu, document: INotebookTextModelLike) => {
			const groups = menu.getActions({ shouldForwardArgs: true });
			const sourceActions: [ISourceAction, IDisposable][] = [];
			groups.forEach(group => {
				const isPrimary = /^primary/.test(group[0]);
				group[1].forEach(action => {
					const sourceAction = new SourceAction(action, document, isPrimary);
					const stateChangeListener = sourceAction.onDidChangeState(() => {
						this._onDidChangeSourceActions.fire({
							notebook: document.uri,
							viewType: document.notebookType,
						});
					});
					sourceActions.push([sourceAction, stateChangeListener]);
				});
			});
			info.actions = sourceActions;
			this._kernelSources.set(id, info);
			this._onDidChangeSourceActions.fire({ notebook: document.uri, viewType: document.notebookType });
		};

		this._kernelSourceActionsUpdates.get(id)?.dispose();
		this._kernelSourceActionsUpdates.set(id, sourceMenu.onDidChange(() => {
			loadActionsFromMenu(sourceMenu, notebook);
		}));

		loadActionsFromMenu(sourceMenu, notebook);

		return info.actions.map(a => a[0]);
	}

	registerNotebookKernelDetectionTask(task: INotebookKernelDetectionTask): IDisposable {
		const notebookType = task.notebookType;
		const all = this._kernelDetectionTasks.get(notebookType) ?? [];
		all.push(task);
		this._kernelDetectionTasks.set(notebookType, all);
		this._onDidChangeKernelDetectionTasks.fire(notebookType);
		return toDisposable(() => {
			const all = this._kernelDetectionTasks.get(notebookType) ?? [];
			const idx = all.indexOf(task);
			if (idx >= 0) {
				all.splice(idx, 1);
				this._kernelDetectionTasks.set(notebookType, all);
				this._onDidChangeKernelDetectionTasks.fire(notebookType);
			}
		});
	}

	getKernelDetectionTasks(notebook: INotebookTextModelLike): INotebookKernelDetectionTask[] {
		return this._kernelDetectionTasks.get(notebook.notebookType) ?? [];
	}

	registerKernelSourceActionProvider(viewType: string, provider: IKernelSourceActionProvider): IDisposable {
		const providers = this._kernelSourceActionProviders.get(viewType) ?? [];
		providers.push(provider);
		this._kernelSourceActionProviders.set(viewType, providers);
		this._onDidChangeSourceActions.fire({ viewType: viewType });

		const eventEmitterDisposable = provider.onDidChangeSourceActions?.(() => {
			this._onDidChangeSourceActions.fire({ viewType: viewType });
		});

		return toDisposable(() => {
			const providers = this._kernelSourceActionProviders.get(viewType) ?? [];
			const idx = providers.indexOf(provider);
			if (idx >= 0) {
				providers.splice(idx, 1);
				this._kernelSourceActionProviders.set(viewType, providers);
			}

			eventEmitterDisposable?.dispose();
		});
	}

	/**
	 * Get kernel source actions from providers
	 */
	getKernelSourceActions2(notebook: INotebookTextModelLike): Promise<INotebookKernelSourceAction[]> {
		const viewType = notebook.notebookType;
		const providers = this._kernelSourceActionProviders.get(viewType) ?? [];
		const promises = providers.map(provider => provider.provideKernelSourceActions());
		return Promise.all(promises).then(actions => {
			return actions.reduce((a, b) => a.concat(b), []);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/services/notebookKeymapServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/services/notebookKeymapServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../../../base/common/errors.js';
import { Event } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { INotificationService, Severity } from '../../../../../platform/notification/common/notification.js';
import { getInstalledExtensions, IExtensionStatus } from '../../../extensions/common/extensionsUtils.js';
import { INotebookKeymapService } from '../../common/notebookKeymapService.js';
import { EnablementState, IWorkbenchExtensionEnablementService } from '../../../../services/extensionManagement/common/extensionManagement.js';
import { ILifecycleService } from '../../../../services/lifecycle/common/lifecycle.js';
import { IExtensionIdentifier, IExtensionManagementService, InstallOperation } from '../../../../../platform/extensionManagement/common/extensionManagement.js';
import { areSameExtensions } from '../../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { Memento } from '../../../../common/memento.js';
import { distinct } from '../../../../../base/common/arrays.js';

function onExtensionChanged(accessor: ServicesAccessor): Event<IExtensionIdentifier[]> {
	const extensionService = accessor.get(IExtensionManagementService);
	const extensionEnablementService = accessor.get(IWorkbenchExtensionEnablementService);
	const onDidInstallExtensions = Event.chain(extensionService.onDidInstallExtensions, $ =>
		$.filter(e => e.some(({ operation }) => operation === InstallOperation.Install))
			.map(e => e.map(({ identifier }) => identifier))
	);
	return Event.debounce<IExtensionIdentifier[], IExtensionIdentifier[]>(Event.any(
		Event.any(onDidInstallExtensions, Event.map(extensionService.onDidUninstallExtension, e => [e.identifier])),
		Event.map(extensionEnablementService.onEnablementChanged, extensions => extensions.map(e => e.identifier))
	), (result: IExtensionIdentifier[] | undefined, identifiers: IExtensionIdentifier[]) => {
		result = result || (identifiers.length ? [identifiers[0]] : []);
		for (const identifier of identifiers) {
			if (result.some(l => !areSameExtensions(l, identifier))) {
				result.push(identifier);
			}
		}

		return result;
	});
}

const hasRecommendedKeymapKey = 'hasRecommendedKeymap';

interface NotebookKeymapMemento {
	[hasRecommendedKeymapKey]?: boolean;
}

export class NotebookKeymapService extends Disposable implements INotebookKeymapService {
	_serviceBrand: undefined;

	private notebookKeymapMemento: Memento<NotebookKeymapMemento>;
	private notebookKeymap: NotebookKeymapMemento;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkbenchExtensionEnablementService private readonly extensionEnablementService: IWorkbenchExtensionEnablementService,
		@INotificationService private readonly notificationService: INotificationService,
		@IStorageService storageService: IStorageService,
		@ILifecycleService lifecycleService: ILifecycleService,
	) {
		super();

		this.notebookKeymapMemento = new Memento('notebookKeymap', storageService);
		this.notebookKeymap = this.notebookKeymapMemento.getMemento(StorageScope.PROFILE, StorageTarget.USER);

		this._register(lifecycleService.onDidShutdown(() => this.dispose()));
		this._register(this.instantiationService.invokeFunction(onExtensionChanged)((identifiers => {
			Promise.all(identifiers.map(identifier => this.checkForOtherKeymaps(identifier)))
				.then(undefined, onUnexpectedError);
		})));
	}

	private checkForOtherKeymaps(extensionIdentifier: IExtensionIdentifier): Promise<void> {
		return this.instantiationService.invokeFunction(getInstalledExtensions).then(extensions => {
			const keymaps = extensions.filter(extension => isNotebookKeymapExtension(extension));
			const extension = keymaps.find(extension => areSameExtensions(extension.identifier, extensionIdentifier));
			if (extension && extension.globallyEnabled) {
				// there is already a keymap extension
				this.notebookKeymap[hasRecommendedKeymapKey] = true;
				this.notebookKeymapMemento.saveMemento();
				const otherKeymaps = keymaps.filter(extension => !areSameExtensions(extension.identifier, extensionIdentifier) && extension.globallyEnabled);
				if (otherKeymaps.length) {
					return this.promptForDisablingOtherKeymaps(extension, otherKeymaps);
				}
			}
			return undefined;
		});
	}

	private promptForDisablingOtherKeymaps(newKeymap: IExtensionStatus, oldKeymaps: IExtensionStatus[]): void {
		const onPrompt = (confirmed: boolean) => {
			if (confirmed) {
				this.extensionEnablementService.setEnablement(oldKeymaps.map(keymap => keymap.local), EnablementState.DisabledGlobally);
			}
		};

		this.notificationService.prompt(Severity.Info, localize('disableOtherKeymapsConfirmation', "Disable other keymaps ({0}) to avoid conflicts between keybindings?", distinct(oldKeymaps.map(k => k.local.manifest.displayName)).map(name => `'${name}'`).join(', ')),
			[{
				label: localize('yes', "Yes"),
				run: () => onPrompt(true)
			}, {
				label: localize('no', "No"),
				run: () => onPrompt(false)
			}]
		);
	}
}

export function isNotebookKeymapExtension(extension: IExtensionStatus): boolean {
	if (extension.local.manifest.extensionPack) {
		return false;
	}

	const keywords = extension.local.manifest.keywords;
	if (!keywords) {
		return false;
	}

	return keywords.indexOf('notebook-keymap') !== -1;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/services/notebookLoggingServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/services/notebookLoggingServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../../nls.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { INotebookLoggingService } from '../../common/notebookLoggingService.js';
import { ILogger, ILoggerService } from '../../../../../platform/log/common/log.js';
import { windowLogGroup } from '../../../../services/log/common/logConstants.js';

const logChannelId = 'notebook.rendering';

export class NotebookLoggingService extends Disposable implements INotebookLoggingService {
	_serviceBrand: undefined;

	static ID: string = 'notebook';
	private readonly _logger: ILogger;

	constructor(
		@ILoggerService loggerService: ILoggerService,
	) {
		super();
		this._logger = this._register(loggerService.createLogger(logChannelId, { name: nls.localize('renderChannelName', "Notebook"), group: windowLogGroup }));
	}

	trace(category: string, output: string): void {
		this._logger.trace(`[${category}] ${output}`);
	}

	debug(category: string, output: string): void {
		this._logger.debug(`[${category}] ${output}`);
	}

	info(category: string, output: string): void {
		this._logger.info(`[${category}] ${output}`);
	}

	warn(category: string, output: string): void {
		this._logger.warn(`[${category}] ${output}`);
	}

	error(category: string, output: string): void {
		this._logger.error(`[${category}] ${output}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/services/notebookRendererMessagingServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/services/notebookRendererMessagingServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { INotebookRendererMessagingService, IScopedRendererMessaging } from '../../common/notebookRendererMessagingService.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';

type MessageToSend = { editorId: string; rendererId: string; message: unknown };

export class NotebookRendererMessagingService extends Disposable implements INotebookRendererMessagingService {
	declare _serviceBrand: undefined;
	/**
	 * Activation promises. Maps renderer IDs to a queue of messages that should
	 * be sent once activation finishes, or undefined if activation is complete.
	 */
	private readonly activations = new Map<string /* rendererId */, undefined | MessageToSend[]>();
	private readonly scopedMessaging = new Map</* editorId */ string, IScopedRendererMessaging>();
	private readonly postMessageEmitter = this._register(new Emitter<MessageToSend>());
	public readonly onShouldPostMessage = this.postMessageEmitter.event;

	constructor(
		@IExtensionService private readonly extensionService: IExtensionService
	) {
		super();
	}

	/** @inheritdoc */
	public receiveMessage(editorId: string | undefined, rendererId: string, message: unknown): Promise<boolean> {
		if (editorId === undefined) {
			const sends = [...this.scopedMessaging.values()].map(e => e.receiveMessageHandler?.(rendererId, message));
			return Promise.all(sends).then(s => s.some(s => !!s));
		}

		return this.scopedMessaging.get(editorId)?.receiveMessageHandler?.(rendererId, message) ?? Promise.resolve(false);
	}

	/** @inheritdoc */
	public prepare(rendererId: string) {
		if (this.activations.has(rendererId)) {
			return;
		}

		const queue: MessageToSend[] = [];
		this.activations.set(rendererId, queue);

		this.extensionService.activateByEvent(`onRenderer:${rendererId}`).then(() => {
			for (const message of queue) {
				this.postMessageEmitter.fire(message);
			}

			this.activations.set(rendererId, undefined);
		});
	}

	/** @inheritdoc */
	public getScoped(editorId: string): IScopedRendererMessaging {
		const existing = this.scopedMessaging.get(editorId);
		if (existing) {
			return existing;
		}

		const messaging: IScopedRendererMessaging = {
			postMessage: (rendererId, message) => this.postMessage(editorId, rendererId, message),
			dispose: () => this.scopedMessaging.delete(editorId),
		};

		this.scopedMessaging.set(editorId, messaging);
		return messaging;
	}

	private postMessage(editorId: string, rendererId: string, message: unknown): void {
		if (!this.activations.has(rendererId)) {
			this.prepare(rendererId);
		}

		const activation = this.activations.get(rendererId);
		const toSend = { rendererId, editorId, message };
		if (activation === undefined) {
			this.postMessageEmitter.fire(toSend);
		} else {
			activation.push(toSend);
		}
	}
}
```

--------------------------------------------------------------------------------

````

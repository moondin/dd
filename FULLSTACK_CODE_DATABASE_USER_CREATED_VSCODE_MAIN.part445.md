---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 445
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 445 of 552)

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

---[FILE: src/vs/workbench/contrib/scm/browser/media/scm.css]---
Location: vscode-main/src/vs/workbench/contrib/scm/browser/media/scm.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.scm-view {
	height: 100%;
	position: relative;
}

.scm-overflow-widgets-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 0;
	height: 0;
	overflow: visible;
	z-index: 5000;
}

.scm-view .monaco-tl-contents > div {
	padding-right: 12px;
	overflow: hidden;
}

.scm-view .count {
	display: flex;
	margin-left: 6px;
}

.scm-view .count.hidden {
	display: none;
}

.scm-view .scm-provider {
	display: flex;
	flex-direction: column;
	height: 100%;
	align-items: center;
	flex-flow: nowrap;
}

.scm-view.hide-provider-counts .scm-provider > .count,
.scm-view.auto-provider-counts .scm-provider > .count[data-count="0"] {
	display: none;
}

.scm-view .scm-provider > .codicon {
	padding-right: 2px;
}

.scm-view .scm-provider > .monaco-icon-label {
	min-width: 0;
	flex: 0 1 auto;
}

.scm-view .scm-provider > .monaco-icon-label .monaco-icon-name-container {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.scm-view .scm-provider .monaco-highlighted-label {
	display: flex;
	align-items: center;
	font-weight: bold;
}

.scm-view .scm-provider > .actions {
	min-width: 24px;
	flex: 1 10000 auto;
	overflow: hidden;
}

.scm-view .scm-provider > .actions .actions-container {
	justify-content: end;
}

/**
 * The following rules are very specific because of inline drop down menus
 * https://github.com/microsoft/vscode/issues/101410
 */
.scm-view .scm-provider > .actions > .monaco-toolbar > .monaco-action-bar > .actions-container > .action-item {
	padding-left: 4px;
	display: flex;
	align-items: center;
}

.scm-view .scm-provider > .actions > .monaco-toolbar > .monaco-action-bar > .actions-container > .action-item.scm-status-bar-action {
	.action-label > span:not(.codicon) {
		margin-left: 2px;
	}
}

.scm-view .scm-provider > .actions > .monaco-toolbar > .monaco-action-bar > .actions-container > .action-item.scm-status-bar-action > .action-label > .codicon {
	display: inline-block;
	vertical-align: middle;
}

.scm-view .scm-provider > .actions > .monaco-toolbar > .monaco-action-bar > .actions-container > .action-item.scm-status-bar-action > .action-label > span:not(.codicon) {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	min-width: 0;
}

.scm-view .scm-provider > .actions > .monaco-toolbar > .monaco-action-bar > .actions-container  > .action-item > .action-label,
.scm-view .scm-provider > .actions > .monaco-toolbar > .monaco-action-bar > .actions-container  > .action-item > .monaco-dropdown > .dropdown-label > .action-label {
	display: flex;
	align-items: center;
	line-height: 16px;
	overflow: hidden;
}

.scm-view .scm-provider > .actions > .monaco-toolbar > .monaco-action-bar > .actions-container  > .action-item > .action-label > .codicon {
	justify-content: center;
}

.scm-view .scm-provider > .actions > .monaco-toolbar > .monaco-action-bar > .actions-container > .action-item:last-of-type {
	padding-right: 0;
}

.scm-view .scm-provider > .body {
	flex-grow: 1;
}

.scm-view .scm-provider > .status > .monaco-action-bar > .actions-container {
	border-color: var(--vscode-sideBar-border);
}

.scm-view .monaco-list-row {
	line-height: 22px;
}

.scm-view .monaco-list-row .monaco-icon-label-container {
	height: 22px;
}

.scm-view .monaco-list-row .resource-group {
	display: flex;
	height: 100%;
	align-items: center;
}

.scm-view .monaco-list-row .history-item .monaco-icon-label {
	flex-grow: 1;
	align-items: center;
}

.scm-view .monaco-list-row .history-item {
	display: flex;
	align-items: center;
}

.scm-view .monaco-list-row .monaco-tl-twistie:not(.collapsed) + .monaco-tl-contents > .history-item > .graph-container > svg > path:last-of-type {
	stroke-width: 3px;
}

.scm-view .monaco-list-row .history-item > .graph-container {
	display: flex;
	flex-shrink: 0;
	height: 22px;
}

.scm-view .monaco-list-row .history-item > .graph-container.current > .graph > circle:last-child,
.scm-view .monaco-list-row .history-item > .graph-container.incoming-changes > .graph > circle:last-child,
.scm-view .monaco-list-row .history-item > .graph-container.outgoing-changes > .graph > circle:last-child {
	fill: var(--vscode-sideBar-background);
}

.scm-view .monaco-list-row:hover .history-item > .graph-container.current > .graph > circle:last-child,
.scm-view .monaco-list-row:hover .history-item > .graph-container.incoming-changes > .graph > circle:last-child,
.scm-view .monaco-list-row:hover .history-item > .graph-container.outgoing-changes > .graph > circle:last-child {
	fill: var(--vscode-list-hoverBackground);
}

.scm-view .monaco-list-row .history-item > .graph-container > .graph > circle {
	stroke: var(--vscode-sideBar-background);
}

.scm-view .monaco-list-row:hover .history-item > .graph-container > .graph > circle:first-of-type {
	stroke: transparent;
}

.scm-view .monaco-list-row:hover .history-item > .graph-container > .graph > circle:nth-of-type(2) {
	stroke: var(--vscode-list-hoverBackground);
}

.scm-view .monaco-list-row.focused.selected .history-item > .graph-container > .graph > circle:first-of-type {
	stroke: transparent !important;
}

.scm-view.scm-history-view > .monaco-list:focus .monaco-list-row.selected .history-item > .graph-container > .graph > circle:nth-of-type(2) {
	stroke: var(--vscode-list-activeSelectionBackground);
}

.scm-view.scm-history-view > .monaco-list:focus .monaco-list-row.selected .history-item > .graph-container.incoming-changes > .graph > circle:last-child,
.scm-view.scm-history-view > .monaco-list:focus .monaco-list-row.selected .history-item > .graph-container.outgoing-changes > .graph > circle:last-child {
	fill: var(--vscode-list-activeSelectionBackground);
}

.scm-view.scm-history-view > .monaco-list .monaco-list-row.focused .history-item > .graph-container > .graph > circle:nth-of-type(2) {
	stroke: var(--vscode-list-inactiveSelectionBackground);
}

.scm-view.scm-history-view > .monaco-list .monaco-list-row.focused .history-item > .graph-container.incoming-changes > .graph > circle:last-child,
.scm-view.scm-history-view > .monaco-list .monaco-list-row.focused .history-item > .graph-container.outgoing-changes > .graph > circle:last-child {
	fill: var(--vscode-list-inactiveSelectionBackground);
}

.scm-view .monaco-list-row .history-item > .label-container {
	display: flex;
	flex-shrink: 0;
	margin-left: 4px;
	gap: 4px;
}

.scm-view .monaco-list-row .history-item > .label-container > .label {
	display: flex;
	align-items: center;
	border-radius: 10px;
	line-height: 18px;
}

.scm-view .monaco-list-row .history-item > .label-container > .label > .count {
	font-size: 12px;
	margin-left: 0;
	padding-left: 4px;
}

.scm-view .monaco-list-row .history-item > .label-container > .label > .codicon {
	color: inherit !important;
	padding: 1px;
}

.scm-view .monaco-list-row .history-item > .label-container > .label > .codicon.codicon-git-branch {
	font-size: 12px;
	padding: 3px;
}

.scm-view .monaco-list-row .history-item > .label-container > .label > .description {
	font-size: 12px;
	padding-right: 4px;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100px;
}

.scm-view .monaco-list-row .history-item .monaco-icon-label .icon-container {
	display: flex;
	padding-right: 4px;
}

.scm-view .monaco-list-row .history-item .monaco-icon-label .avatar {
	width: 14px;
	height: 14px;
	border-radius: 14px;
}

.scm-view .monaco-list-row .history-item .monaco-icon-label.history-item-current .label-name {
	font-weight: 600;
}

.scm-view .monaco-list-row .history-item .monaco-icon-label.history-item-current .label-description {
	font-weight: 500;
}

.scm-view .monaco-list-row .history-item > .actions {
	margin-left: 4px;
}

.scm-view .monaco-list-row .resource-group > .name {
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
}

.scm-view .monaco-list-row .resource {
	display: flex;
	height: 100%;
}

.scm-view .monaco-list-row .resource.faded {
	opacity: 0.7;
}

.scm-view .monaco-list-row .resource > .name {
	flex: 1;
	overflow: hidden;
}

.scm-view .monaco-list-row .resource > .name > .monaco-icon-label::after,
.scm-view .monaco-list-row .history-item-change > .label-container > .monaco-icon-label::after {
	margin-right: 3px;
}

.scm-view .monaco-list-row .resource > .decoration-icon {
	width: 16px;
	height: 100%;
	background-repeat: no-repeat;
	background-position: 50% 50%;
	margin-left: 5px;
}

.scm-view .monaco-list-row .resource > .decoration-icon.codicon {
	margin-right: 0;
	margin-top: 3px;
}

.scm-view .monaco-list .monaco-list-row .resource > .name > .monaco-icon-label > .actions {
	flex-grow: 100;
}

.scm-view .monaco-list .monaco-list-row .resource-group > .actions,
.scm-view .monaco-list .monaco-list-row .resource > .name > .monaco-icon-label > .actions,
.scm-view .monaco-list .monaco-list-row .history-item > .actions,
.scm-view .monaco-list .monaco-list-row .history-item-change > .label-container > .monaco-icon-label > .actions {
	display: none;
	max-width: fit-content;
}

.scm-view .monaco-list .monaco-list-row:hover .resource-group > .actions,
.scm-view .monaco-list .monaco-list-row.focused .resource-group > .actions,
.scm-view .monaco-list .monaco-list-row:hover .resource > .name > .monaco-icon-label > .actions,
.scm-view .monaco-list .monaco-list-row.focused .resource > .name > .monaco-icon-label > .actions,
.scm-view .monaco-list:not(.selection-multiple) .monaco-list-row .resource:hover > .actions,
.scm-view .monaco-list .monaco-list-row:hover .history-item > .actions,
.scm-view .monaco-list .monaco-list-row.focused .history-item > .actions,
.scm-view .monaco-list .monaco-list-row:hover .history-item-change > .label-container > .monaco-icon-label > .actions,
.scm-view .monaco-list .monaco-list-row.focused .history-item-change > .label-container > .monaco-icon-label > .actions {
	display: block;
}

.scm-view .monaco-list .monaco-list-row.force-no-hover,
.scm-view .monaco-list .monaco-list-row:hover.force-no-hover,
.scm-view .monaco-list .monaco-list-row.focused.force-no-hover,
.scm-view .monaco-list .monaco-list-row.selected.force-no-hover {
	background: transparent !important;
}

.scm-view .monaco-list .monaco-list-row.cursor-default {
	cursor: default;
}

.scm-view.show-actions .scm-provider > .actions,
.scm-view.show-actions > .monaco-list .monaco-list-row .scm-input > .scm-editor > .actions,
.scm-view.show-actions > .monaco-list .monaco-list-row .resource-group > .actions,
.scm-view.show-actions > .monaco-list .monaco-list-row .resource > .name > .monaco-icon-label > .actions,
.scm-view.show-actions > .monaco-list .monaco-list-row .history-item > .actions {
	display: block;
}

.scm-view .monaco-list-row .actions .action-label {
	padding: 2px;
}

.scm-view .scm-input {
	height: 100%;
	display: flex;
	align-items: center;
	padding-left: 11px;
}

.scm-view .scm-input .scm-editor .scm-editor-toolbar {
	padding: 1px 3px 1px 1px;
}

.scm-view .scm-input .scm-editor .scm-editor-toolbar.hidden {
	display: none;
}

.scm-view .scm-input .scm-editor .scm-editor-toolbar.scroll-decoration {
	box-shadow: var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset;
}

.scm-view .scm-input .scm-editor .scm-editor-toolbar .action-label.codicon.codicon-debug-stop {
	color: var(--vscode-icon-foreground) !important;
}

.scm-view .scm-editor-container .monaco-editor {
	border-radius: 2px;
}

.scm-view .scm-editor {
	box-sizing: border-box;
	width: 100%;
	display: flex;
	align-items: flex-start;
	box-sizing: border-box;
	border: 1px solid var(--vscode-input-border, transparent);
	background-color: var(--vscode-input-background);
	border-radius: 2px;
}

.scm-view .button-container {
	display: flex;
	height: 100%;
	padding-left: 11px;
	align-items: center;
}

.scm-view .button-container .codicon.codicon-cloud-upload,
.scm-view .button-container .codicon.codicon-sync {
	margin: 0 4px 0 0;
}

.scm-view .button-container .codicon.codicon-arrow-up,
.scm-view .button-container .codicon.codicon-arrow-down {
	font-size: small !important;
	margin: 0 4px 0 0;
}

.scm-view .button-container > .monaco-button-dropdown {
	flex-grow: 1;
	overflow: hidden;
}

.scm-view .button-container > .monaco-button-dropdown > .monaco-dropdown-button {
	display:flex;
	align-items: center;
	padding: 0 4px;
}


.scm-view .button-container > .monaco-button-dropdown > .monaco-button.monaco-text-button {
	min-width: 0;
}

.scm-view .button-container > .monaco-button-dropdown > .monaco-button.monaco-text-button > span:not(.codicon) {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.scm-view .scm-editor.hidden {
	display: none;
}

.monaco-workbench .part.panel .scm-view .scm-editor-container {
	outline: 1px solid var(--vscode-panelInput-border);
}

.scm-view .scm-editor.synthetic-focus,
.monaco-workbench .part.panel .scm-view .scm-editor.synthetic-focus {
	outline: 1px solid var(--vscode-focusBorder);
	outline-offset: -1px;
}

.scm-view .scm-editor.validation-info {
	outline: 1px solid var(--vscode-inputValidation-infoBorder) !important;
	outline-offset: -1px;
}

.scm-view .scm-editor.validation-warning {
	outline: 1px solid var(--vscode-inputValidation-warningBorder) !important;
	outline-offset: -1px;
}

.scm-view .scm-editor.validation-error {
	outline: 1px solid var(--vscode-inputValidation-errorBorder) !important;
	outline-offset: -1px;
}

.scm-editor-validation-container {
	display: flex;
	box-sizing: border-box;
	border-width: 1px;
	border-style: solid;
	border-top: none;
	border-bottom-left-radius: 2px;
	border-bottom-right-radius: 2px;
	padding: 2px;
}

.scm-editor-validation-container.validation-info {
	background-color: var(--vscode-inputValidation-infoBackground);
	border-color: var(--vscode-inputValidation-infoBorder);
	color: var(--vscode-inputValidation-infoForeground);
}

.scm-editor-validation-container.validation-warning {
	background-color: var(--vscode-inputValidation-warningBackground);
	border-color: var(--vscode-inputValidation-warningBorder);
	color: var(--vscode-inputValidation-warningForeground);
}

.scm-editor-validation-container.validation-error {
	background-color: var(--vscode-inputValidation-errorBackground);
	border-color: var(--vscode-inputValidation-errorBorder);
	color: var(--vscode-inputValidation-errorForeground);
}

.scm-editor-validation {
	box-sizing: border-box;
	font-size: 0.9em;
	padding: 1px 3px;
	display: block;
	border-style: none;
	flex: auto;
}

.scm-editor-validation p {
	margin: 0;
	padding: 0;
}

.scm-editor-validation a {
	color: var(--vscode-textLink-foreground);
	-webkit-user-select: none;
	user-select: none;
}

.scm-editor-validation a:active,
.scm-editor-validation a:hover {
	color: var(--vscode-textLink-activeForeground);
}

.scm-editor-validation-actions {
	align-self: start;
	margin-top: 1px;
}

.scm-view .scm-editor-container .monaco-editor-background,
.scm-view .scm-editor-container .monaco-editor,
.scm-view .scm-editor-container .monaco-editor .margin,
.monaco-workbench .part.basepanel > .content .scm-view .scm-editor-container .monaco-editor,
.monaco-workbench .part.basepanel > .content .scm-view .scm-editor-container .monaco-editor .margin,
.monaco-workbench .part.basepanel > .content .scm-view .scm-editor-container .monaco-editor .monaco-editor-background {
	color: inherit;
	background-color: var(--vscode-input-background);
}

.scm-view .scm-editor-container .mtk1 {
	color: var(--vscode-input-foreground);
}

.scm-view .scm-editor-container .placeholder-text.mtk1 {
	color: var(--vscode-input-placeholderForeground);
}

/* Repositories */

.scm-repositories-view .monaco-list .monaco-list-row .scm-artifact-group > .actions,
.scm-repositories-view .monaco-list .monaco-list-row .scm-artifact > .actions {
	display: none;
	max-width: fit-content;
}

.scm-repositories-view .monaco-list .monaco-list-row:hover .scm-artifact-group > .actions,
.scm-repositories-view .monaco-list .monaco-list-row.focused .scm-artifact-group > .actions,
.scm-repositories-view .monaco-list .monaco-list-row:hover .scm-artifact > .actions,
.scm-repositories-view .monaco-list .monaco-list-row.focused .scm-artifact > .actions {
	display: block;
}

.scm-view.scm-repositories-view .monaco-highlighted-label {
	font-weight: normal;
}

.scm-repositories-view .scm-artifact-group,
.scm-repositories-view .scm-artifact {
	display: flex;
	align-items: center;

	.icon {
		margin-right: 2px;
	}
}

.scm-repositories-view .scm-artifact-group .monaco-icon-label,
.scm-repositories-view .scm-artifact .monaco-icon-label {
	flex-grow: 1;
}

.scm-repositories-view .scm-artifact-group .monaco-highlighted-label,
.scm-repositories-view .scm-artifact .monaco-highlighted-label {
	display: flex;
	align-items: center;
}

.scm-repositories-view .scm-artifact .monaco-icon-description-container {
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.scm-repositories-view .scm-artifact .timestamp-container {
	flex-shrink: 0;
	margin-left: 2px;
	margin-right: 4px;
	opacity: 0.5;
}

.scm-repositories-view .scm-artifact .timestamp-container.duplicate {
	height: 22px;
	min-width: 6px;
	border-left: 1px solid currentColor;
	opacity: 0.25;

	.timestamp {
		display: none;
	}
}

.scm-repositories-view .monaco-list .monaco-list-row:hover .scm-artifact .timestamp-container.duplicate {
	border-left: 0;
	opacity: 0.5;

	.timestamp {
		display: block;
	}
}

/* History item hover */

.monaco-hover.history-item-hover .history-item-hover-container > .rendered-markdown:first-child > p {
	margin-top: 4px;
}

.monaco-hover.history-item-hover .history-item-hover-container > .rendered-markdown:last-child p {
	margin-bottom: 2px !important;
}

.monaco-hover.history-item-hover .history-item-hover-container > .rendered-markdown:last-child p span:not(.codicon) {
	padding: 2px 0;
}

.monaco-hover.history-item-hover .history-item-hover-container > .rendered-markdown hr {
	margin-top: 4px;
	margin-bottom: 4px;
}

.monaco-hover.history-item-hover .history-item-hover-container > .rendered-markdown > p {
	margin: 4px 0;
}

.monaco-hover.history-item-hover .history-item-hover-container div:nth-of-type(3):nth-last-of-type(2) > p {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
}

.monaco-hover.history-item-hover .history-item-hover-container span:not(.codicon) {
	margin-bottom: 0 !important;
}

.monaco-hover.history-item-hover .history-item-hover-container p > span > span.codicon.codicon-git-branch {
	font-size: 12px;
	margin-bottom: 2px !important;
}

.monaco-hover.history-item-hover .history-item-hover-container p > span > span.codicon.codicon-tag,
.monaco-hover.history-item-hover .history-item-hover-container p > span > span.codicon.codicon-target {
	font-size: 14px;
	margin-bottom: 2px !important;
}

.monaco-hover.history-item-hover .history-item-hover-container p > span > span.codicon.codicon-cloud {
	font-size: 14px;
	margin-bottom: 1px !important;
}

/* Graph */

.pane-header .scm-graph-view-badge-container {
	display: flex;
	align-items: center;
	min-width: fit-content;
}

.pane-header .scm-graph-view-badge-container > .scm-graph-view-badge.monaco-count-badge.long {
	background-color: var(--vscode-badge-background);
	color: var(--vscode-badge-foreground);
	border: 1px solid var(--vscode-contrastBorder);
	margin: 0 6px;
	padding: 2px 4px;
}

.monaco-workbench .part.sidebar > .title > .title-actions .action-label.scm-graph-repository-picker,
.monaco-workbench .part.sidebar > .title > .title-actions .action-label.scm-graph-history-item-picker,
.monaco-workbench .part.auxiliarybar > .title > .title-actions .action-label.scm-graph-repository-picker,
.monaco-workbench .part.auxiliarybar > .title > .title-actions .action-label.scm-graph-history-item-picker,
.monaco-workbench .part.panel > .title > .title-actions .action-label.scm-graph-repository-picker,
.monaco-workbench .part.panel > .title > .title-actions .action-label.scm-graph-history-item-picker {
	display: flex;
}

.monaco-toolbar .action-item > .action-label.scm-graph-repository-picker,
.monaco-toolbar .action-item > .action-label.scm-graph-history-item-picker {
	color: var(--vscode-icon-foreground);
	align-items: center;
	font-weight: normal;
	line-height: 16px;
}

.monaco-toolbar .action-item.disabled > .action-label.scm-graph-repository-picker,
.monaco-toolbar .action-item.disabled > .action-label.scm-graph-history-item-picker {
	color: var(--vscode-disabledForeground);
}

.monaco-toolbar .action-label.scm-graph-repository-picker .codicon,
.monaco-toolbar .action-label.scm-graph-history-item-picker .codicon {
	color: inherit;
}

.monaco-toolbar .action-label.scm-graph-repository-picker > .name,
.monaco-toolbar .action-label.scm-graph-history-item-picker > .name {
	max-width: 100px;
	overflow: hidden;
	text-overflow: ellipsis;
	padding-right: 2px;
}

.scm-history-view .monaco-list-row > .monaco-tl-row > .monaco-tl-twistie.force-no-twistie {
	display: none !important;
}

.scm-history-view .scm-provider .label-name {
	font-weight: bold;
}

.scm-history-view .scm-provider .monaco-icon-label {
	align-items: center;
}

.scm-history-view .scm-provider .state-label.monaco-count-badge.long {
	display: flex;
	font-size: 0.8em;
	margin: 0 10px;
	color: var(--vscode-debugView-stateLabelForeground);
	background: var(--vscode-debugView-stateLabelBackground);
	border-radius: 2px;
}

.scm-history-view .scm-provider .actions {
	display: flex;
	flex-grow: 1;
}

.scm-view .monaco-list-row .history-item-change {
	display: flex;
	align-items: center;
}

.scm-view .monaco-list-row .history-item-change > .graph-placeholder {
	position: absolute;
	height: 22px;
}

.scm-view .monaco-list-row .history-item-change > .label-container {
	display: flex;
	flex: 1;
	overflow: hidden;
}

.scm-view .monaco-list-row .history-item-change > .label-container > .monaco-icon-label {
	flex-grow: 1;
}

.scm-history-view .history-item-load-more {
	display: flex;
	height: 22px;
}

.scm-history-view .history-item-load-more .graph-placeholder {
	mask-image: linear-gradient(black, transparent);
}

.scm-history-view .history-item-load-more .history-item-placeholder {
	flex-grow: 1;
}

.scm-history-view .history-item-load-more .history-item-placeholder .monaco-highlighted-label {
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--vscode-textLink-foreground)
}

.scm-history-view .history-item-load-more .history-item-placeholder .monaco-highlighted-label .codicon {
	font-size: 12px;
	color: var(--vscode-textLink-foreground)
}

.scm-history-view .history-item-load-more .history-item-placeholder.shimmer {
	padding: 2px 0;
}

.scm-history-view .history-item-load-more .history-item-placeholder.shimmer .monaco-icon-label-container {
	height: 18px;
	background: var(--vscode-scmGraph-historyItemHoverDefaultLabelBackground);
	border-radius: 2px;
	opacity: 0.5;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/common/artifact.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/common/artifact.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { Event } from '../../../../base/common/event.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { ISCMRepository } from './scm.js';
import { Command } from '../../../../editor/common/languages.js';

export interface ISCMArtifactProvider {
	readonly onDidChangeArtifacts: Event<string[]>;
	provideArtifactGroups(): Promise<ISCMArtifactGroup[] | undefined>;
	provideArtifacts(group: string): Promise<ISCMArtifact[] | undefined>;
}

export interface ISCMArtifactGroup {
	readonly id: string;
	readonly name: string;
	readonly icon?: URI | { light: URI; dark: URI } | ThemeIcon;
	readonly supportsFolders?: boolean;
}

export interface ISCMArtifact {
	readonly id: string;
	readonly name: string;
	readonly description?: string;
	readonly icon?: URI | { light: URI; dark: URI } | ThemeIcon;
	readonly timestamp?: number;
	readonly command?: Command;
}

export interface SCMArtifactGroupTreeElement {
	readonly repository: ISCMRepository;
	readonly artifactGroup: ISCMArtifactGroup;
	readonly type: 'artifactGroup';
}

export interface SCMArtifactTreeElement {
	readonly repository: ISCMRepository;
	readonly group: ISCMArtifactGroup;
	readonly artifact: ISCMArtifact;
	readonly hideTimestamp: boolean;
	readonly type: 'artifact';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/common/history.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/common/history.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { IObservable } from '../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { ColorIdentifier } from '../../../../platform/theme/common/colorUtils.js';
import { ISCMRepository } from './scm.js';

export const SCMIncomingHistoryItemId = 'scm-graph-incoming-changes';
export const SCMOutgoingHistoryItemId = 'scm-graph-outgoing-changes';

export interface ISCMHistoryProvider {
	readonly historyItemRef: IObservable<ISCMHistoryItemRef | undefined>;
	readonly historyItemRemoteRef: IObservable<ISCMHistoryItemRef | undefined>;
	readonly historyItemBaseRef: IObservable<ISCMHistoryItemRef | undefined>;

	readonly historyItemRefChanges: IObservable<ISCMHistoryItemRefsChangeEvent>;

	provideHistoryItemRefs(historyItemsRefs?: string[], token?: CancellationToken): Promise<ISCMHistoryItemRef[] | undefined>;
	provideHistoryItems(options: ISCMHistoryOptions, token?: CancellationToken): Promise<ISCMHistoryItem[] | undefined>;
	provideHistoryItemChanges(historyItemId: string, historyItemParentId: string | undefined, token?: CancellationToken): Promise<ISCMHistoryItemChange[] | undefined>;
	resolveHistoryItem(historyItemId: string, token?: CancellationToken): Promise<ISCMHistoryItem | undefined>;
	resolveHistoryItemChatContext(historyItemId: string, token?: CancellationToken): Promise<string | undefined>;
	resolveHistoryItemChangeRangeChatContext(historyItemId: string, historyItemParentId: string, path: string, token?: CancellationToken): Promise<string | undefined>;
	resolveHistoryItemRefsCommonAncestor(historyItemRefs: string[], token?: CancellationToken): Promise<string | undefined>;
}

export interface ISCMHistoryOptions {
	readonly skip?: number;
	readonly limit?: number | { id?: string };
	readonly historyItemRefs?: readonly string[];
	readonly filterText?: string;
}

export interface ISCMHistoryItemStatistics {
	readonly files: number;
	readonly insertions: number;
	readonly deletions: number;
}

export interface ISCMHistoryItemRef {
	readonly id: string;
	readonly name: string;
	readonly revision?: string;
	readonly category?: string;
	readonly description?: string;
	readonly color?: ColorIdentifier;
	readonly icon?: URI | { light: URI; dark: URI } | ThemeIcon;
}

export interface ISCMHistoryItemRefsChangeEvent {
	readonly added: readonly ISCMHistoryItemRef[];
	readonly removed: readonly ISCMHistoryItemRef[];
	readonly modified: readonly ISCMHistoryItemRef[];
	readonly silent: boolean;
}

export interface ISCMHistoryItem {
	readonly id: string;
	readonly parentIds: string[];
	readonly subject: string;
	readonly message: string;
	readonly displayId?: string;
	readonly author?: string;
	readonly authorEmail?: string;
	readonly authorIcon?: URI | { light: URI; dark: URI } | ThemeIcon;
	readonly timestamp?: number;
	readonly statistics?: ISCMHistoryItemStatistics;
	readonly references?: ISCMHistoryItemRef[];
	readonly tooltip?: IMarkdownString | Array<IMarkdownString> | undefined;
}

export interface ISCMHistoryItemGraphNode {
	readonly id: string;
	readonly color: ColorIdentifier;
}

export interface ISCMHistoryItemViewModel {
	readonly historyItem: ISCMHistoryItem;
	readonly inputSwimlanes: ISCMHistoryItemGraphNode[];
	readonly outputSwimlanes: ISCMHistoryItemGraphNode[];
	readonly kind: 'HEAD' | 'node' | 'incoming-changes' | 'outgoing-changes';
}

export interface SCMHistoryItemViewModelTreeElement {
	readonly repository: ISCMRepository;
	readonly historyItemViewModel: ISCMHistoryItemViewModel;
	readonly type: 'historyItemViewModel';
}

export interface SCMHistoryItemChangeViewModelTreeElement {
	readonly repository: ISCMRepository;
	readonly historyItemViewModel: ISCMHistoryItemViewModel;
	readonly historyItemChange: ISCMHistoryItemChange;
	readonly graphColumns: ISCMHistoryItemGraphNode[];
	readonly type: 'historyItemChangeViewModel';
}

export interface SCMHistoryItemLoadMoreTreeElement {
	readonly repository: ISCMRepository;
	readonly graphColumns: ISCMHistoryItemGraphNode[];
	readonly type: 'historyItemLoadMore';
}

export interface ISCMHistoryItemChange {
	readonly uri: URI;
	readonly originalUri?: URI;
	readonly modifiedUri?: URI;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/common/quickDiff.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/common/quickDiff.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { LanguageSelector } from '../../../../editor/common/languageSelector.js';
import { Event } from '../../../../base/common/event.js';
import { LineRangeMapping } from '../../../../editor/common/diff/rangeMapping.js';
import { IChange } from '../../../../editor/common/diff/legacyLinesDiffComputer.js';
import { IColorTheme } from '../../../../platform/theme/common/themeService.js';
import { Color } from '../../../../base/common/color.js';
import {
	darken, editorBackground, editorForeground, listInactiveSelectionBackground, opaque,
	editorErrorForeground, registerColor, transparent,
	lighten
} from '../../../../platform/theme/common/colorRegistry.js';

export const IQuickDiffService = createDecorator<IQuickDiffService>('quickDiff');

const editorGutterModifiedBackground = registerColor('editorGutter.modifiedBackground', {
	dark: '#1B81A8', light: '#2090D3', hcDark: '#1B81A8', hcLight: '#2090D3'
}, nls.localize('editorGutterModifiedBackground', "Editor gutter background color for lines that are modified."));

registerColor('editorGutter.modifiedSecondaryBackground',
	{ dark: darken(editorGutterModifiedBackground, 0.5), light: lighten(editorGutterModifiedBackground, 0.7), hcDark: '#1B81A8', hcLight: '#2090D3' },
	nls.localize('editorGutterModifiedSecondaryBackground', "Editor gutter secondary background color for lines that are modified."));

const editorGutterAddedBackground = registerColor('editorGutter.addedBackground', {
	dark: '#487E02', light: '#48985D', hcDark: '#487E02', hcLight: '#48985D'
}, nls.localize('editorGutterAddedBackground', "Editor gutter background color for lines that are added."));

registerColor('editorGutter.addedSecondaryBackground',
	{ dark: darken(editorGutterAddedBackground, 0.5), light: lighten(editorGutterAddedBackground, 0.7), hcDark: '#487E02', hcLight: '#48985D' },
	nls.localize('editorGutterAddedSecondaryBackground', "Editor gutter secondary background color for lines that are added."));

const editorGutterDeletedBackground = registerColor('editorGutter.deletedBackground',
	editorErrorForeground, nls.localize('editorGutterDeletedBackground', "Editor gutter background color for lines that are deleted."));

registerColor('editorGutter.deletedSecondaryBackground',
	{ dark: darken(editorGutterDeletedBackground, 0.4), light: lighten(editorGutterDeletedBackground, 0.3), hcDark: '#F48771', hcLight: '#B5200D' },
	nls.localize('editorGutterDeletedSecondaryBackground', "Editor gutter secondary background color for lines that are deleted."));
export const minimapGutterModifiedBackground = registerColor('minimapGutter.modifiedBackground',
	editorGutterModifiedBackground, nls.localize('minimapGutterModifiedBackground', "Minimap gutter background color for lines that are modified."));

export const minimapGutterAddedBackground = registerColor('minimapGutter.addedBackground',
	editorGutterAddedBackground, nls.localize('minimapGutterAddedBackground', "Minimap gutter background color for lines that are added."));

export const minimapGutterDeletedBackground = registerColor('minimapGutter.deletedBackground',
	editorGutterDeletedBackground, nls.localize('minimapGutterDeletedBackground', "Minimap gutter background color for lines that are deleted."));

export const overviewRulerModifiedForeground = registerColor('editorOverviewRuler.modifiedForeground',
	transparent(editorGutterModifiedBackground, 0.6), nls.localize('overviewRulerModifiedForeground', 'Overview ruler marker color for modified content.'));
export const overviewRulerAddedForeground = registerColor('editorOverviewRuler.addedForeground',
	transparent(editorGutterAddedBackground, 0.6), nls.localize('overviewRulerAddedForeground', 'Overview ruler marker color for added content.'));
export const overviewRulerDeletedForeground = registerColor('editorOverviewRuler.deletedForeground',
	transparent(editorGutterDeletedBackground, 0.6), nls.localize('overviewRulerDeletedForeground', 'Overview ruler marker color for deleted content.'));

export const editorGutterItemGlyphForeground = registerColor('editorGutter.itemGlyphForeground',
	{ dark: editorForeground, light: editorForeground, hcDark: Color.black, hcLight: Color.white },
	nls.localize('editorGutterItemGlyphForeground', 'Editor gutter decoration color for gutter item glyphs.')
);
export const editorGutterItemBackground = registerColor('editorGutter.itemBackground', { dark: opaque(listInactiveSelectionBackground, editorBackground), light: darken(opaque(listInactiveSelectionBackground, editorBackground), .05), hcDark: Color.white, hcLight: Color.black }, nls.localize('editorGutterItemBackground', 'Editor gutter decoration color for gutter item background. This color should be opaque.'));

export interface QuickDiffProvider {
	readonly id: string;
	readonly label: string;
	readonly rootUri: URI | undefined;
	readonly selector?: LanguageSelector;
	readonly kind: 'primary' | 'secondary' | 'contributed';
	getOriginalResource(uri: URI): Promise<URI | null>;
}

export interface QuickDiff {
	readonly id: string;
	readonly label: string;
	readonly originalResource: URI;
	readonly kind: 'primary' | 'secondary' | 'contributed';
}

export interface QuickDiffChange {
	readonly providerId: string;
	readonly original: URI;
	readonly modified: URI;
	readonly change: IChange;
	readonly change2: LineRangeMapping;
}

export interface QuickDiffResult {
	readonly original: URI;
	readonly modified: URI;
	readonly changes: IChange[];
	readonly changes2: LineRangeMapping[];
}

export interface IQuickDiffService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeQuickDiffProviders: Event<void>;
	readonly providers: readonly QuickDiffProvider[];
	addQuickDiffProvider(quickDiff: QuickDiffProvider): IDisposable;
	getQuickDiffs(uri: URI, language?: string, isSynchronized?: boolean): Promise<QuickDiff[]>;
	toggleQuickDiffProviderVisibility(id: string): void;
	isQuickDiffProviderVisible(id: string): boolean;
}

export enum ChangeType {
	Modify,
	Add,
	Delete
}

export function getChangeType(change: IChange): ChangeType {
	if (change.originalEndLineNumber === 0) {
		return ChangeType.Add;
	} else if (change.modifiedEndLineNumber === 0) {
		return ChangeType.Delete;
	} else {
		return ChangeType.Modify;
	}
}

export function getChangeTypeColor(theme: IColorTheme, changeType: ChangeType): Color | undefined {
	switch (changeType) {
		case ChangeType.Modify: return theme.getColor(editorGutterModifiedBackground);
		case ChangeType.Add: return theme.getColor(editorGutterAddedBackground);
		case ChangeType.Delete: return theme.getColor(editorGutterDeletedBackground);
	}
}

export function compareChanges(a: IChange, b: IChange): number {
	let result = a.modifiedStartLineNumber - b.modifiedStartLineNumber;

	if (result !== 0) {
		return result;
	}

	result = a.modifiedEndLineNumber - b.modifiedEndLineNumber;

	if (result !== 0) {
		return result;
	}

	result = a.originalStartLineNumber - b.originalStartLineNumber;

	if (result !== 0) {
		return result;
	}

	return a.originalEndLineNumber - b.originalEndLineNumber;
}

export function getChangeHeight(change: IChange): number {
	const modified = change.modifiedEndLineNumber - change.modifiedStartLineNumber + 1;
	const original = change.originalEndLineNumber - change.originalStartLineNumber + 1;

	if (change.originalEndLineNumber === 0) {
		return modified;
	} else if (change.modifiedEndLineNumber === 0) {
		return original;
	} else {
		return modified + original;
	}
}

export function getModifiedEndLineNumber(change: IChange): number {
	if (change.modifiedEndLineNumber === 0) {
		return change.modifiedStartLineNumber === 0 ? 1 : change.modifiedStartLineNumber;
	} else {
		return change.modifiedEndLineNumber;
	}
}

export function lineIntersectsChange(lineNumber: number, change: IChange): boolean {
	// deletion at the beginning of the file
	if (lineNumber === 1 && change.modifiedStartLineNumber === 0 && change.modifiedEndLineNumber === 0) {
		return true;
	}

	return lineNumber >= change.modifiedStartLineNumber && lineNumber <= (change.modifiedEndLineNumber || change.modifiedStartLineNumber);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/common/quickDiffService.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/common/quickDiffService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { IQuickDiffService, QuickDiff, QuickDiffProvider } from './quickDiff.js';
import { isEqualOrParent } from '../../../../base/common/resources.js';
import { score } from '../../../../editor/common/languageSelector.js';
import { Emitter } from '../../../../base/common/event.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';

function createProviderComparer(uri: URI): (a: QuickDiffProvider, b: QuickDiffProvider) => number {
	return (a, b) => {
		if (a.rootUri && !b.rootUri) {
			return -1;
		} else if (!a.rootUri && b.rootUri) {
			return 1;
		} else if (!a.rootUri && !b.rootUri) {
			return 0;
		}

		const aIsParent = isEqualOrParent(uri, a.rootUri!);
		const bIsParent = isEqualOrParent(uri, b.rootUri!);

		if (aIsParent && bIsParent) {
			return providerComparer(a, b);
		} else if (aIsParent) {
			return -1;
		} else if (bIsParent) {
			return 1;
		} else {
			return 0;
		}
	};
}

function providerComparer(a: QuickDiffProvider, b: QuickDiffProvider): number {
	if (a.kind === 'primary') {
		return -1;
	} else if (b.kind === 'primary') {
		return 1;
	} else if (a.kind === 'secondary') {
		return -1;
	} else if (b.kind === 'secondary') {
		return 1;
	}
	return 0;
}

export class QuickDiffService extends Disposable implements IQuickDiffService {
	declare readonly _serviceBrand: undefined;
	private static readonly STORAGE_KEY = 'workbench.scm.quickDiffProviders.hidden';

	private quickDiffProviders: Set<QuickDiffProvider> = new Set();
	get providers(): readonly QuickDiffProvider[] {
		return Array.from(this.quickDiffProviders).sort(providerComparer);
	}

	private readonly _onDidChangeQuickDiffProviders = this._register(new Emitter<void>());
	readonly onDidChangeQuickDiffProviders = this._onDidChangeQuickDiffProviders.event;

	private hiddenQuickDiffProviders = new Set<string>();

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService
	) {
		super();

		this.loadState();
	}

	addQuickDiffProvider(quickDiff: QuickDiffProvider): IDisposable {
		this.quickDiffProviders.add(quickDiff);
		this._onDidChangeQuickDiffProviders.fire();
		return {
			dispose: () => {
				this.quickDiffProviders.delete(quickDiff);
				this._onDidChangeQuickDiffProviders.fire();
			}
		};
	}

	async getQuickDiffs(uri: URI, language: string = '', isSynchronized: boolean = false): Promise<QuickDiff[]> {
		const providers = Array.from(this.quickDiffProviders)
			.filter(provider => !provider.rootUri || this.uriIdentityService.extUri.isEqualOrParent(uri, provider.rootUri))
			.sort(createProviderComparer(uri));

		const quickDiffOriginalResources = await Promise.allSettled(providers.map(async provider => {
			const scoreValue = provider.selector ? score(provider.selector, uri, language, isSynchronized, undefined, undefined) : 10;
			const originalResource = scoreValue > 0 ? await provider.getOriginalResource(uri) ?? undefined : undefined;
			return { provider, originalResource };
		}));

		const quickDiffs: QuickDiff[] = [];
		for (const quickDiffOriginalResource of quickDiffOriginalResources) {
			if (quickDiffOriginalResource.status === 'rejected') {
				continue;
			}

			const { provider, originalResource } = quickDiffOriginalResource.value;
			if (!originalResource) {
				continue;
			}

			quickDiffs.push({
				id: provider.id,
				label: provider.label,
				kind: provider.kind,
				originalResource,
			} satisfies QuickDiff);
		}

		return quickDiffs;
	}

	toggleQuickDiffProviderVisibility(id: string): void {
		if (this.isQuickDiffProviderVisible(id)) {
			this.hiddenQuickDiffProviders.add(id);
		} else {
			this.hiddenQuickDiffProviders.delete(id);
		}

		this.saveState();
		this._onDidChangeQuickDiffProviders.fire();
	}

	isQuickDiffProviderVisible(id: string): boolean {
		return !this.hiddenQuickDiffProviders.has(id);
	}

	private loadState(): void {
		const raw = this.storageService.get(QuickDiffService.STORAGE_KEY, StorageScope.PROFILE);
		if (raw) {
			try {
				this.hiddenQuickDiffProviders = new Set(JSON.parse(raw));
			} catch { }
		}
	}

	private saveState(): void {
		if (this.hiddenQuickDiffProviders.size === 0) {
			this.storageService.remove(QuickDiffService.STORAGE_KEY, StorageScope.PROFILE);
		} else {
			this.storageService.store(QuickDiffService.STORAGE_KEY, JSON.stringify(Array.from(this.hiddenQuickDiffProviders)), StorageScope.PROFILE, StorageTarget.USER);
		}
	}
}

export async function getOriginalResource(quickDiffService: IQuickDiffService, uri: URI, language: string | undefined, isSynchronized: boolean | undefined): Promise<URI | null> {
	const quickDiffs = await quickDiffService.getQuickDiffs(uri, language, isSynchronized);
	const primaryQuickDiffs = quickDiffs.find(quickDiff => quickDiff.kind === 'primary');
	return primaryQuickDiffs ? primaryQuickDiffs.originalResource : null;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/common/scm.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/common/scm.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { Command } from '../../../../editor/common/languages.js';
import { IAction } from '../../../../base/common/actions.js';
import { IMenu } from '../../../../platform/actions/common/actions.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { ResourceTree } from '../../../../base/common/resourceTree.js';
import { ISCMHistoryProvider } from './history.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IObservable } from '../../../../base/common/observable.js';
import { ISCMArtifact, ISCMArtifactGroup, ISCMArtifactProvider } from './artifact.js';

export const VIEWLET_ID = 'workbench.view.scm';
export const VIEW_PANE_ID = 'workbench.scm';
export const REPOSITORIES_VIEW_PANE_ID = 'workbench.scm.repositories';
export const HISTORY_VIEW_PANE_ID = 'workbench.scm.history';

export const enum ViewMode {
	List = 'list',
	Tree = 'tree'
}

export interface IBaselineResourceProvider {
	getBaselineResource(resource: URI): Promise<URI>;
}

export const ISCMService = createDecorator<ISCMService>('scm');

export interface ISCMResourceDecorations {
	icon?: URI | ThemeIcon;
	iconDark?: URI | ThemeIcon;
	tooltip?: string;
	strikeThrough?: boolean;
	faded?: boolean;
}

export interface ISCMResource {
	readonly resourceGroup: ISCMResourceGroup;
	readonly sourceUri: URI;
	readonly decorations: ISCMResourceDecorations;
	readonly contextValue: string | undefined;
	readonly command: Command | undefined;
	readonly multiDiffEditorOriginalUri: URI | undefined;
	readonly multiDiffEditorModifiedUri: URI | undefined;
	open(preserveFocus: boolean): Promise<void>;
}

export interface ISCMResourceGroup {
	readonly id: string;
	readonly provider: ISCMProvider;

	readonly resources: readonly ISCMResource[];
	readonly resourceTree: ResourceTree<ISCMResource, ISCMResourceGroup>;
	readonly onDidChangeResources: Event<void>;

	readonly label: string;
	contextValue: string | undefined;
	readonly hideWhenEmpty: boolean;
	readonly onDidChange: Event<void>;

	readonly multiDiffEditorEnableViewChanges: boolean;
}

export interface ISCMProvider extends IDisposable {
	readonly id: string;
	readonly parentId?: string;
	readonly providerId: string;
	readonly label: string;
	readonly name: string;

	readonly groups: readonly ISCMResourceGroup[];
	readonly onDidChangeResourceGroups: Event<void>;
	readonly onDidChangeResources: Event<void>;

	readonly rootUri?: URI;
	readonly iconPath?: URI | { light: URI; dark: URI } | ThemeIcon;
	readonly inputBoxTextModel: ITextModel;
	readonly contextValue: IObservable<string | undefined>;
	readonly count: IObservable<number | undefined>;
	readonly commitTemplate: IObservable<string>;
	readonly artifactProvider: IObservable<ISCMArtifactProvider | undefined>;
	readonly historyProvider: IObservable<ISCMHistoryProvider | undefined>;
	readonly acceptInputCommand?: Command;
	readonly actionButton: IObservable<ISCMActionButtonDescriptor | undefined>;
	readonly statusBarCommands: IObservable<readonly Command[] | undefined>;

	getOriginalResource(uri: URI): Promise<URI | null>;
}

export interface ISCMInputValueProviderContext {
	readonly resourceGroupId: string;
	readonly resources: readonly URI[];
}

export const enum InputValidationType {
	Error = 0,
	Warning = 1,
	Information = 2
}

export interface IInputValidation {
	message: string | IMarkdownString;
	type: InputValidationType;
}

export interface IInputValidator {
	(value: string, cursorPosition: number): Promise<IInputValidation | undefined>;
}

export enum SCMInputChangeReason {
	HistoryPrevious,
	HistoryNext
}

export interface ISCMInputChangeEvent {
	readonly value: string;
	readonly reason?: SCMInputChangeReason;
}

export interface ISCMActionButtonDescriptor {
	command: Command & { shortTitle?: string };
	secondaryCommands?: Command[][];
	enabled: boolean;
}

export interface ISCMActionButton {
	readonly type: 'actionButton';
	readonly repository: ISCMRepository;
	readonly button: ISCMActionButtonDescriptor;
}

export interface ISCMInput {
	readonly repository: ISCMRepository;

	readonly value: string;
	setValue(value: string, fromKeyboard: boolean): void;
	readonly onDidChange: Event<ISCMInputChangeEvent>;

	placeholder: string;
	readonly onDidChangePlaceholder: Event<string>;

	validateInput: IInputValidator;
	readonly onDidChangeValidateInput: Event<void>;

	enabled: boolean;
	readonly onDidChangeEnablement: Event<boolean>;

	visible: boolean;
	readonly onDidChangeVisibility: Event<boolean>;

	setFocus(): void;
	readonly onDidChangeFocus: Event<void>;

	showValidationMessage(message: string | IMarkdownString, type: InputValidationType): void;
	readonly onDidChangeValidationMessage: Event<IInputValidation>;

	showNextHistoryValue(): void;
	showPreviousHistoryValue(): void;
}

export interface ISCMRepository extends IDisposable {
	readonly id: string;
	readonly provider: ISCMProvider;
	readonly input: ISCMInput;
}

export interface ISCMService {

	readonly _serviceBrand: undefined;
	readonly onDidAddRepository: Event<ISCMRepository>;
	readonly onDidRemoveRepository: Event<ISCMRepository>;
	readonly repositories: Iterable<ISCMRepository>;
	readonly repositoryCount: number;

	registerSCMProvider(provider: ISCMProvider): ISCMRepository;

	getRepository(id: string): ISCMRepository | undefined;
	getRepository(resource: URI): ISCMRepository | undefined;
}

export interface ISCMTitleMenu {
	readonly actions: IAction[];
	readonly secondaryActions: IAction[];
	readonly onDidChangeTitle: Event<void>;
	readonly menu: IMenu;
}

export interface ISCMRepositoryMenus {
	readonly titleMenu: ISCMTitleMenu;
	getRepositoryMenu(repository: ISCMRepository): IMenu;
	getRepositoryContextMenu(repository: ISCMRepository): IMenu;
	getResourceGroupMenu(group: ISCMResourceGroup): IMenu;
	getResourceMenu(resource: ISCMResource): IMenu;
	getResourceFolderMenu(group: ISCMResourceGroup): IMenu;
	getArtifactGroupMenu(artifactGroup: ISCMArtifactGroup): IMenu;
	getArtifactMenu(artifactGroup: ISCMArtifactGroup, artifact: ISCMArtifact): IMenu;
}

export interface ISCMMenus {
	getRepositoryMenus(provider: ISCMProvider): ISCMRepositoryMenus;
}

export const enum ISCMRepositorySortKey {
	DiscoveryTime = 'discoveryTime',
	Name = 'name',
	Path = 'path'
}

export const enum ISCMRepositorySelectionMode {
	Single = 'single',
	Multiple = 'multiple'
}

export const ISCMViewService = createDecorator<ISCMViewService>('scmView');

export interface ISCMViewVisibleRepositoryChangeEvent {
	readonly added: Iterable<ISCMRepository>;
	readonly removed: Iterable<ISCMRepository>;
}

export interface ISCMViewService {
	readonly _serviceBrand: undefined;

	readonly menus: ISCMMenus;
	readonly selectionModeConfig: IObservable<ISCMRepositorySelectionMode>;
	readonly explorerEnabledConfig: IObservable<boolean>;
	readonly graphShowIncomingChangesConfig: IObservable<boolean>;
	readonly graphShowOutgoingChangesConfig: IObservable<boolean>;

	repositories: ISCMRepository[];
	readonly onDidChangeRepositories: Event<ISCMViewVisibleRepositoryChangeEvent>;
	readonly didFinishLoadingRepositories: IObservable<boolean>;

	visibleRepositories: readonly ISCMRepository[];
	readonly onDidChangeVisibleRepositories: Event<ISCMViewVisibleRepositoryChangeEvent>;

	isVisible(repository: ISCMRepository): boolean;
	toggleVisibility(repository: ISCMRepository, visible?: boolean): void;

	toggleSortKey(sortKey: ISCMRepositorySortKey): void;
	toggleSelectionMode(selectionMode: ISCMRepositorySelectionMode): void;

	readonly focusedRepository: ISCMRepository | undefined;
	readonly onDidFocusRepository: Event<ISCMRepository | undefined>;
	focus(repository: ISCMRepository): void;

	/**
	 * The active repository is the repository selected in the Source Control Repositories view
	 * or the repository associated with the active editor. The active repository is shown in the
	 * Source Control Repository status bar item.
	 */
	readonly activeRepository: IObservable<{ repository: ISCMRepository; pinned: boolean } | undefined>;
	pinActiveRepository(repository: ISCMRepository | undefined): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/common/scmService.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/common/scmService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { ISCMService, ISCMProvider, ISCMInput, ISCMRepository, IInputValidator, ISCMInputChangeEvent, SCMInputChangeReason, InputValidationType, IInputValidation } from './scm.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { HistoryNavigator2 } from '../../../../base/common/history.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { URI } from '../../../../base/common/uri.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { Schemas } from '../../../../base/common/network.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { runOnChange } from '../../../../base/common/observable.js';

class SCMInput extends Disposable implements ISCMInput {

	private _value = '';

	get value(): string {
		return this._value;
	}

	private readonly _onDidChange = new Emitter<ISCMInputChangeEvent>();
	readonly onDidChange: Event<ISCMInputChangeEvent> = this._onDidChange.event;

	private _placeholder = '';

	get placeholder(): string {
		return this._placeholder;
	}

	set placeholder(placeholder: string) {
		this._placeholder = placeholder;
		this._onDidChangePlaceholder.fire(placeholder);
	}

	private readonly _onDidChangePlaceholder = new Emitter<string>();
	readonly onDidChangePlaceholder: Event<string> = this._onDidChangePlaceholder.event;

	private _enabled = true;

	get enabled(): boolean {
		return this._enabled;
	}

	set enabled(enabled: boolean) {
		this._enabled = enabled;
		this._onDidChangeEnablement.fire(enabled);
	}

	private readonly _onDidChangeEnablement = new Emitter<boolean>();
	readonly onDidChangeEnablement: Event<boolean> = this._onDidChangeEnablement.event;

	private _visible = true;

	get visible(): boolean {
		return this._visible;
	}

	set visible(visible: boolean) {
		this._visible = visible;
		this._onDidChangeVisibility.fire(visible);
	}

	private readonly _onDidChangeVisibility = new Emitter<boolean>();
	readonly onDidChangeVisibility: Event<boolean> = this._onDidChangeVisibility.event;

	setFocus(): void {
		this._onDidChangeFocus.fire();
	}

	private readonly _onDidChangeFocus = new Emitter<void>();
	readonly onDidChangeFocus: Event<void> = this._onDidChangeFocus.event;

	showValidationMessage(message: string | IMarkdownString, type: InputValidationType): void {
		this._onDidChangeValidationMessage.fire({ message: message, type: type });
	}

	private readonly _onDidChangeValidationMessage = new Emitter<IInputValidation>();
	readonly onDidChangeValidationMessage: Event<IInputValidation> = this._onDidChangeValidationMessage.event;

	private _validateInput: IInputValidator = () => Promise.resolve(undefined);

	get validateInput(): IInputValidator {
		return this._validateInput;
	}

	set validateInput(validateInput: IInputValidator) {
		this._validateInput = validateInput;
		this._onDidChangeValidateInput.fire();
	}

	private readonly _onDidChangeValidateInput = new Emitter<void>();
	readonly onDidChangeValidateInput: Event<void> = this._onDidChangeValidateInput.event;

	private readonly historyNavigator: HistoryNavigator2<string>;
	private didChangeHistory: boolean = false;

	constructor(
		readonly repository: ISCMRepository,
		private readonly history: SCMInputHistory
	) {
		super();

		if (this.repository.provider.rootUri) {
			this.historyNavigator = history.getHistory(this.repository.provider.label, this.repository.provider.rootUri);
			this._register(this.history.onWillSaveHistory(event => {
				if (this.historyNavigator.isAtEnd()) {
					this.saveValue();
				}

				if (this.didChangeHistory) {
					event.historyDidIndeedChange();
				}

				this.didChangeHistory = false;
			}));
		} else { // in memory only
			this.historyNavigator = new HistoryNavigator2([''], 100);
		}

		this._value = this.historyNavigator.current();
	}

	setValue(value: string, transient: boolean, reason?: SCMInputChangeReason) {
		if (value === this._value) {
			return;
		}

		if (!transient) {
			this.historyNavigator.replaceLast(this._value);
			this.historyNavigator.add(value);
			this.didChangeHistory = true;
		}

		this._value = value;
		this._onDidChange.fire({ value, reason });
	}

	showNextHistoryValue(): void {
		if (this.historyNavigator.isAtEnd()) {
			return;
		} else if (!this.historyNavigator.has(this.value)) {
			this.saveValue();
			this.historyNavigator.resetCursor();
		}

		const value = this.historyNavigator.next();
		this.setValue(value, true, SCMInputChangeReason.HistoryNext);
	}

	showPreviousHistoryValue(): void {
		if (this.historyNavigator.isAtEnd()) {
			this.saveValue();
		} else if (!this.historyNavigator.has(this._value)) {
			this.saveValue();
			this.historyNavigator.resetCursor();
		}

		const value = this.historyNavigator.previous();
		this.setValue(value, true, SCMInputChangeReason.HistoryPrevious);
	}

	private saveValue(): void {
		const oldValue = this.historyNavigator.replaceLast(this._value);
		this.didChangeHistory = this.didChangeHistory || (oldValue !== this._value);
	}
}

class SCMRepository implements ISCMRepository {

	private _selected = false;
	get selected(): boolean {
		return this._selected;
	}

	private readonly _onDidChangeSelection = new Emitter<boolean>();
	readonly onDidChangeSelection: Event<boolean> = this._onDidChangeSelection.event;

	readonly input: ISCMInput;

	constructor(
		public readonly id: string,
		public readonly provider: ISCMProvider,
		private readonly disposables: DisposableStore,
		inputHistory: SCMInputHistory
	) {
		this.input = new SCMInput(this, inputHistory);
	}

	setSelected(selected: boolean): void {
		if (this._selected === selected) {
			return;
		}

		this._selected = selected;
		this._onDidChangeSelection.fire(selected);
	}

	dispose(): void {
		this.disposables.dispose();
		this.provider.dispose();
	}
}

class WillSaveHistoryEvent {
	private _didChangeHistory = false;
	get didChangeHistory() { return this._didChangeHistory; }
	historyDidIndeedChange() { this._didChangeHistory = true; }
}

class SCMInputHistory {

	private readonly disposables = new DisposableStore();
	private readonly histories = new Map<string, ResourceMap<HistoryNavigator2<string>>>();

	private readonly _onWillSaveHistory = this.disposables.add(new Emitter<WillSaveHistoryEvent>());
	readonly onWillSaveHistory = this._onWillSaveHistory.event;

	constructor(
		@IStorageService private storageService: IStorageService,
		@IWorkspaceContextService private workspaceContextService: IWorkspaceContextService,
	) {
		this.histories = new Map();

		const entries = this.storageService.getObject<[string, URI, string[]][]>('scm.history', StorageScope.WORKSPACE, []);

		for (const [providerLabel, rootUri, history] of entries) {
			let providerHistories = this.histories.get(providerLabel);

			if (!providerHistories) {
				providerHistories = new ResourceMap();
				this.histories.set(providerLabel, providerHistories);
			}

			providerHistories.set(rootUri, new HistoryNavigator2(history, 100));
		}

		if (this.migrateStorage()) {
			this.saveToStorage();
		}

		this.disposables.add(this.storageService.onDidChangeValue(StorageScope.WORKSPACE, 'scm.history', this.disposables)(e => {
			if (e.external && e.key === 'scm.history') {
				const raw = this.storageService.getObject<[string, URI, string[]][]>('scm.history', StorageScope.WORKSPACE, []);

				for (const [providerLabel, uri, rawHistory] of raw) {
					const history = this.getHistory(providerLabel, uri);

					for (const value of Iterable.reverse(rawHistory)) {
						history.prepend(value);
					}
				}
			}
		}));

		this.disposables.add(this.storageService.onWillSaveState(_ => {
			const event = new WillSaveHistoryEvent();
			this._onWillSaveHistory.fire(event);

			if (event.didChangeHistory) {
				this.saveToStorage();
			}
		}));
	}

	private saveToStorage(): void {
		const raw: [string, URI, string[]][] = [];

		for (const [providerLabel, providerHistories] of this.histories) {
			for (const [rootUri, history] of providerHistories) {
				if (!(history.size === 1 && history.current() === '')) {
					raw.push([providerLabel, rootUri, [...history]]);
				}
			}
		}

		this.storageService.store('scm.history', raw, StorageScope.WORKSPACE, StorageTarget.USER);
	}

	getHistory(providerLabel: string, rootUri: URI): HistoryNavigator2<string> {
		let providerHistories = this.histories.get(providerLabel);

		if (!providerHistories) {
			providerHistories = new ResourceMap();
			this.histories.set(providerLabel, providerHistories);
		}

		let history = providerHistories.get(rootUri);

		if (!history) {
			history = new HistoryNavigator2([''], 100);
			providerHistories.set(rootUri, history);
		}

		return history;
	}

	// Migrates from Application scope storage to Workspace scope.
	// TODO@joaomoreno: Change from January 2024 onwards such that the only code is to remove all `scm/input:` storage keys
	private migrateStorage(): boolean {
		let didSomethingChange = false;
		const machineKeys = Iterable.filter(this.storageService.keys(StorageScope.APPLICATION, StorageTarget.MACHINE), key => key.startsWith('scm/input:'));

		for (const key of machineKeys) {
			try {
				const legacyHistory = JSON.parse(this.storageService.get(key, StorageScope.APPLICATION, ''));
				const match = /^scm\/input:([^:]+):(.+)$/.exec(key);

				if (!match || !Array.isArray(legacyHistory?.history) || !Number.isInteger(legacyHistory?.timestamp)) {
					this.storageService.remove(key, StorageScope.APPLICATION);
					continue;
				}

				const [, providerLabel, rootPath] = match;
				const rootUri = URI.file(rootPath);

				if (this.workspaceContextService.getWorkspaceFolder(rootUri)) {
					const history = this.getHistory(providerLabel, rootUri);

					for (const entry of Iterable.reverse(legacyHistory.history as string[])) {
						history.prepend(entry);
					}

					didSomethingChange = true;
					this.storageService.remove(key, StorageScope.APPLICATION);
				}
			} catch {
				this.storageService.remove(key, StorageScope.APPLICATION);
			}
		}

		return didSomethingChange;
	}

	dispose() {
		this.disposables.dispose();
	}
}


export class SCMService implements ISCMService {

	declare readonly _serviceBrand: undefined;

	_repositories = new Map<string, ISCMRepository>();  // used in tests
	get repositories(): Iterable<ISCMRepository> { return this._repositories.values(); }
	get repositoryCount(): number { return this._repositories.size; }

	private inputHistory: SCMInputHistory;
	private providerCount: IContextKey<number>;
	private historyProviderCount: IContextKey<number>;

	private readonly _onDidAddProvider = new Emitter<ISCMRepository>();
	readonly onDidAddRepository: Event<ISCMRepository> = this._onDidAddProvider.event;

	private readonly _onDidRemoveProvider = new Emitter<ISCMRepository>();
	readonly onDidRemoveRepository: Event<ISCMRepository> = this._onDidRemoveProvider.event;

	constructor(
		@ILogService private readonly logService: ILogService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IStorageService storageService: IStorageService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService
	) {
		this.inputHistory = new SCMInputHistory(storageService, workspaceContextService);

		this.providerCount = contextKeyService.createKey('scm.providerCount', 0);
		this.historyProviderCount = contextKeyService.createKey('scm.historyProviderCount', 0);
	}

	registerSCMProvider(provider: ISCMProvider): ISCMRepository {
		this.logService.trace('SCMService#registerSCMProvider');

		if (this._repositories.has(provider.id)) {
			throw new Error(`SCM Provider ${provider.id} already exists.`);
		}

		const disposables = new DisposableStore();

		const historyProviderCount = () => {
			return Array.from(this._repositories.values())
				.filter(r => !!r.provider.historyProvider.get()).length;
		};

		disposables.add(toDisposable(() => {
			this._repositories.delete(provider.id);
			this._onDidRemoveProvider.fire(repository);

			this.providerCount.set(this._repositories.size);
			this.historyProviderCount.set(historyProviderCount());
		}));

		const repository = new SCMRepository(provider.id, provider, disposables, this.inputHistory);
		this._repositories.set(provider.id, repository);

		disposables.add(runOnChange(provider.historyProvider, () => {
			this.historyProviderCount.set(historyProviderCount());
		}));

		this.providerCount.set(this._repositories.size);
		this.historyProviderCount.set(historyProviderCount());

		this._onDidAddProvider.fire(repository);

		return repository;
	}

	getRepository(id: string): ISCMRepository | undefined;
	getRepository(resource: URI): ISCMRepository | undefined;
	getRepository(idOrResource: string | URI): ISCMRepository | undefined {
		if (typeof idOrResource === 'string') {
			return this._repositories.get(idOrResource);
		}

		if (idOrResource.scheme !== Schemas.file &&
			idOrResource.scheme !== Schemas.vscodeRemote) {
			return undefined;
		}

		let bestRepository: ISCMRepository | undefined = undefined;
		let bestMatchLength = Number.POSITIVE_INFINITY;

		for (const repository of this.repositories) {
			const root = repository.provider.rootUri;

			if (!root) {
				continue;
			}

			const path = this.uriIdentityService.extUri.relativePath(root, idOrResource);

			if (path && !/^\.\./.test(path) && path.length < bestMatchLength) {
				bestRepository = repository;
				bestMatchLength = path.length;
			}
		}

		return bestRepository;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/test/browser/scmHistory.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/test/browser/scmHistory.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ColorIdentifier } from '../../../../../platform/theme/common/colorUtils.js';
import { colorRegistry, historyItemBaseRefColor, historyItemRefColor, historyItemRemoteRefColor, toISCMHistoryItemViewModelArray } from '../../browser/scmHistory.js';
import { ISCMHistoryItem, ISCMHistoryItemRef, SCMIncomingHistoryItemId } from '../../common/history.js';

function toSCMHistoryItem(id: string, parentIds: string[], references?: ISCMHistoryItemRef[]): ISCMHistoryItem {
	return { id, parentIds, subject: '', message: '', references } satisfies ISCMHistoryItem;
}

suite('toISCMHistoryItemViewModelArray', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('empty graph', () => {
		const viewModels = toISCMHistoryItemViewModelArray([]);

		assert.strictEqual(viewModels.length, 0);
	});


	/**
	 *	* a
	 */

	test('single commit', () => {
		const models = [
			toSCMHistoryItem('a', []),
		];

		const viewModels = toISCMHistoryItemViewModelArray(models);

		assert.strictEqual(viewModels.length, 1);

		assert.strictEqual(viewModels[0].inputSwimlanes.length, 0);
		assert.strictEqual(viewModels[0].outputSwimlanes.length, 0);
	});

	/**
	 *	* a(b)
	 *	* b(c)
	 *	* c(d)
	 *	* d(e)
	 *	* e
	 */
	test('linear graph', () => {
		const models = [
			toSCMHistoryItem('a', ['b']),
			toSCMHistoryItem('b', ['c']),
			toSCMHistoryItem('c', ['d']),
			toSCMHistoryItem('d', ['e']),
			toSCMHistoryItem('e', []),
		];

		const viewModels = toISCMHistoryItemViewModelArray(models);

		assert.strictEqual(viewModels.length, 5);

		// node a
		assert.strictEqual(viewModels[0].inputSwimlanes.length, 0);

		assert.strictEqual(viewModels[0].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[0].outputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[0].outputSwimlanes[0].color, colorRegistry[0]);

		// node b
		assert.strictEqual(viewModels[1].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[1].inputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[1].inputSwimlanes[0].color, colorRegistry[0]);

		assert.strictEqual(viewModels[1].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[1].outputSwimlanes[0].id, 'c');
		assert.strictEqual(viewModels[1].outputSwimlanes[0].color, colorRegistry[0]);

		// node c
		assert.strictEqual(viewModels[2].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[2].inputSwimlanes[0].id, 'c');
		assert.strictEqual(viewModels[2].inputSwimlanes[0].color, colorRegistry[0]);

		assert.strictEqual(viewModels[2].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[2].outputSwimlanes[0].id, 'd');
		assert.strictEqual(viewModels[2].outputSwimlanes[0].color, colorRegistry[0]);

		// node d
		assert.strictEqual(viewModels[3].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[3].inputSwimlanes[0].id, 'd');
		assert.strictEqual(viewModels[3].inputSwimlanes[0].color, colorRegistry[0]);

		assert.strictEqual(viewModels[3].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[3].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[3].outputSwimlanes[0].color, colorRegistry[0]);

		// node e
		assert.strictEqual(viewModels[4].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[4].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[4].inputSwimlanes[0].color, colorRegistry[0]);

		assert.strictEqual(viewModels[4].outputSwimlanes.length, 0);
	});

	/**
	 *	* a(b)
	 *	*   b(c,d)
	 *	|\
	 *	| * d(c)
	 *	|/
	 *	* c(e)
	 *	* e(f)
	 */
	test('merge commit (single commit in topic branch)', () => {
		const models = [
			toSCMHistoryItem('a', ['b']),
			toSCMHistoryItem('b', ['c', 'd']),
			toSCMHistoryItem('d', ['c']),
			toSCMHistoryItem('c', ['e']),
			toSCMHistoryItem('e', ['f']),
		];

		const viewModels = toISCMHistoryItemViewModelArray(models);

		assert.strictEqual(viewModels.length, 5);

		// node a
		assert.strictEqual(viewModels[0].inputSwimlanes.length, 0);

		assert.strictEqual(viewModels[0].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[0].outputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[0].outputSwimlanes[0].color, colorRegistry[0]);

		// node b
		assert.strictEqual(viewModels[1].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[1].inputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[1].inputSwimlanes[0].color, colorRegistry[0]);

		assert.strictEqual(viewModels[1].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[1].outputSwimlanes[0].id, 'c');
		assert.strictEqual(viewModels[1].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[1].outputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[1].outputSwimlanes[1].color, colorRegistry[1]);

		// node d
		assert.strictEqual(viewModels[2].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[2].inputSwimlanes[0].id, 'c');
		assert.strictEqual(viewModels[2].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[2].inputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[2].inputSwimlanes[1].color, colorRegistry[1]);

		assert.strictEqual(viewModels[2].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[2].outputSwimlanes[0].id, 'c');
		assert.strictEqual(viewModels[2].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[2].outputSwimlanes[1].id, 'c');
		assert.strictEqual(viewModels[2].outputSwimlanes[1].color, colorRegistry[1]);

		// node c
		assert.strictEqual(viewModels[3].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[3].inputSwimlanes[0].id, 'c');
		assert.strictEqual(viewModels[3].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[3].inputSwimlanes[1].id, 'c');
		assert.strictEqual(viewModels[3].inputSwimlanes[1].color, colorRegistry[1]);

		assert.strictEqual(viewModels[3].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[3].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[3].outputSwimlanes[0].color, colorRegistry[0]);

		// node e
		assert.strictEqual(viewModels[4].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[4].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[4].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[4].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[4].outputSwimlanes[0].id, 'f');
		assert.strictEqual(viewModels[4].outputSwimlanes[0].color, colorRegistry[0]);
	});

	/**
	 *	* a(b,c)
	 *	|\
	 *	| * c(d)
	 *	* | b(e)
	 *	* | e(f)
	 *	* | f(d)
	 *	|/
	 *	* d(g)
	 */
	test('merge commit (multiple commits in topic branch)', () => {
		const models = [
			toSCMHistoryItem('a', ['b', 'c']),
			toSCMHistoryItem('c', ['d']),
			toSCMHistoryItem('b', ['e']),
			toSCMHistoryItem('e', ['f']),
			toSCMHistoryItem('f', ['d']),
			toSCMHistoryItem('d', ['g']),
		];

		const viewModels = toISCMHistoryItemViewModelArray(models);

		assert.strictEqual(viewModels.length, 6);

		// node a
		assert.strictEqual(viewModels[0].inputSwimlanes.length, 0);

		assert.strictEqual(viewModels[0].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[0].outputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[0].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[0].outputSwimlanes[1].id, 'c');
		assert.strictEqual(viewModels[0].outputSwimlanes[1].color, colorRegistry[1]);

		// node c
		assert.strictEqual(viewModels[1].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[1].inputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[1].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[1].inputSwimlanes[1].id, 'c');
		assert.strictEqual(viewModels[1].inputSwimlanes[1].color, colorRegistry[1]);

		assert.strictEqual(viewModels[1].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[1].outputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[1].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[1].outputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[1].outputSwimlanes[1].color, colorRegistry[1]);

		// node b
		assert.strictEqual(viewModels[2].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[2].inputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[2].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[2].inputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[2].inputSwimlanes[1].color, colorRegistry[1]);

		assert.strictEqual(viewModels[2].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[2].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[2].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[2].outputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[2].outputSwimlanes[1].color, colorRegistry[1]);

		// node e
		assert.strictEqual(viewModels[3].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[3].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[3].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[3].inputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[3].inputSwimlanes[1].color, colorRegistry[1]);

		assert.strictEqual(viewModels[3].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[3].outputSwimlanes[0].id, 'f');
		assert.strictEqual(viewModels[3].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[3].outputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[3].outputSwimlanes[1].color, colorRegistry[1]);

		// node f
		assert.strictEqual(viewModels[4].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[4].inputSwimlanes[0].id, 'f');
		assert.strictEqual(viewModels[4].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[4].inputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[4].inputSwimlanes[1].color, colorRegistry[1]);

		assert.strictEqual(viewModels[4].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[4].outputSwimlanes[0].id, 'd');
		assert.strictEqual(viewModels[4].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[4].outputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[4].outputSwimlanes[1].color, colorRegistry[1]);

		// node d
		assert.strictEqual(viewModels[5].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[5].inputSwimlanes[0].id, 'd');
		assert.strictEqual(viewModels[5].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[5].inputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[5].inputSwimlanes[1].color, colorRegistry[1]);

		assert.strictEqual(viewModels[5].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[5].outputSwimlanes[0].id, 'g');
		assert.strictEqual(viewModels[5].outputSwimlanes[0].color, colorRegistry[0]);
	});

	/**
	 * 	* a(b,c)
	 * 	|\
	 * 	| * c(b)
	 * 	|/
	 * 	* b(d,e)
	 * 	|\
	 * 	| * e(f)
	 * 	| * f(g)
	 * 	* | d(h)
	 */
	test('create brach from merge commit', () => {
		const models = [
			toSCMHistoryItem('a', ['b', 'c']),
			toSCMHistoryItem('c', ['b']),
			toSCMHistoryItem('b', ['d', 'e']),
			toSCMHistoryItem('e', ['f']),
			toSCMHistoryItem('f', ['g']),
			toSCMHistoryItem('d', ['h']),
		];

		const viewModels = toISCMHistoryItemViewModelArray(models);

		assert.strictEqual(viewModels.length, 6);

		// node a
		assert.strictEqual(viewModels[0].inputSwimlanes.length, 0);

		assert.strictEqual(viewModels[0].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[0].outputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[0].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[0].outputSwimlanes[1].id, 'c');
		assert.strictEqual(viewModels[0].outputSwimlanes[1].color, colorRegistry[1]);

		// node c
		assert.strictEqual(viewModels[1].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[1].inputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[1].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[1].inputSwimlanes[1].id, 'c');
		assert.strictEqual(viewModels[1].inputSwimlanes[1].color, colorRegistry[1]);

		assert.strictEqual(viewModels[1].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[1].outputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[1].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[1].outputSwimlanes[1].id, 'b');
		assert.strictEqual(viewModels[1].outputSwimlanes[1].color, colorRegistry[1]);

		// node b
		assert.strictEqual(viewModels[2].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[2].inputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[2].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[2].inputSwimlanes[1].id, 'b');
		assert.strictEqual(viewModels[2].inputSwimlanes[1].color, colorRegistry[1]);

		assert.strictEqual(viewModels[2].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[2].outputSwimlanes[0].id, 'd');
		assert.strictEqual(viewModels[2].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[2].outputSwimlanes[1].id, 'e');
		assert.strictEqual(viewModels[2].outputSwimlanes[1].color, colorRegistry[2]);

		// node e
		assert.strictEqual(viewModels[3].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[3].inputSwimlanes[0].id, 'd');
		assert.strictEqual(viewModels[3].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[3].inputSwimlanes[1].id, 'e');
		assert.strictEqual(viewModels[3].inputSwimlanes[1].color, colorRegistry[2]);

		assert.strictEqual(viewModels[3].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[3].outputSwimlanes[0].id, 'd');
		assert.strictEqual(viewModels[3].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[3].outputSwimlanes[1].id, 'f');
		assert.strictEqual(viewModels[3].outputSwimlanes[1].color, colorRegistry[2]);

		// node f
		assert.strictEqual(viewModels[4].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[4].inputSwimlanes[0].id, 'd');
		assert.strictEqual(viewModels[4].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[4].inputSwimlanes[1].id, 'f');
		assert.strictEqual(viewModels[4].inputSwimlanes[1].color, colorRegistry[2]);

		assert.strictEqual(viewModels[4].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[4].outputSwimlanes[0].id, 'd');
		assert.strictEqual(viewModels[4].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[4].outputSwimlanes[1].id, 'g');
		assert.strictEqual(viewModels[4].outputSwimlanes[1].color, colorRegistry[2]);

		// node d
		assert.strictEqual(viewModels[5].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[5].inputSwimlanes[0].id, 'd');
		assert.strictEqual(viewModels[5].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[5].inputSwimlanes[1].id, 'g');
		assert.strictEqual(viewModels[5].inputSwimlanes[1].color, colorRegistry[2]);

		assert.strictEqual(viewModels[5].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[5].outputSwimlanes[0].id, 'h');
		assert.strictEqual(viewModels[5].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[5].outputSwimlanes[1].id, 'g');
		assert.strictEqual(viewModels[5].outputSwimlanes[1].color, colorRegistry[2]);
	});


	/**
	 * 	* a(b,c)
	 * 	|\
	 * 	| * c(d)
	 * 	* | b(e,f)
	 * 	|\|
	 * 	| |\
	 * 	| | * f(g)
	 * 	* | | e(g)
	 * 	| * | d(g)
	 * 	|/ /
	 * 	| /
	 * 	|/
	 * 	* g(h)
	 */
	test('create multiple branches from a commit', () => {
		const models = [
			toSCMHistoryItem('a', ['b', 'c']),
			toSCMHistoryItem('c', ['d']),
			toSCMHistoryItem('b', ['e', 'f']),
			toSCMHistoryItem('f', ['g']),
			toSCMHistoryItem('e', ['g']),
			toSCMHistoryItem('d', ['g']),
			toSCMHistoryItem('g', ['h']),
		] satisfies ISCMHistoryItem[];

		const viewModels = toISCMHistoryItemViewModelArray(models);

		assert.strictEqual(viewModels.length, 7);

		// node a
		assert.strictEqual(viewModels[0].inputSwimlanes.length, 0);

		assert.strictEqual(viewModels[0].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[0].outputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[0].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[0].outputSwimlanes[1].id, 'c');
		assert.strictEqual(viewModels[0].outputSwimlanes[1].color, colorRegistry[1]);

		// node c
		assert.strictEqual(viewModels[1].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[1].inputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[1].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[1].inputSwimlanes[1].id, 'c');
		assert.strictEqual(viewModels[1].inputSwimlanes[1].color, colorRegistry[1]);

		assert.strictEqual(viewModels[1].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[1].outputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[1].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[1].outputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[1].outputSwimlanes[1].color, colorRegistry[1]);

		// node b
		assert.strictEqual(viewModels[2].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[2].inputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[2].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[2].inputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[2].inputSwimlanes[1].color, colorRegistry[1]);

		assert.strictEqual(viewModels[2].outputSwimlanes.length, 3);
		assert.strictEqual(viewModels[2].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[2].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[2].outputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[2].outputSwimlanes[1].color, colorRegistry[1]);
		assert.strictEqual(viewModels[2].outputSwimlanes[2].id, 'f');
		assert.strictEqual(viewModels[2].outputSwimlanes[2].color, colorRegistry[2]);

		// node f
		assert.strictEqual(viewModels[3].inputSwimlanes.length, 3);
		assert.strictEqual(viewModels[3].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[3].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[3].inputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[3].inputSwimlanes[1].color, colorRegistry[1]);
		assert.strictEqual(viewModels[3].inputSwimlanes[2].id, 'f');
		assert.strictEqual(viewModels[3].inputSwimlanes[2].color, colorRegistry[2]);

		assert.strictEqual(viewModels[3].outputSwimlanes.length, 3);
		assert.strictEqual(viewModels[3].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[3].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[3].outputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[3].outputSwimlanes[1].color, colorRegistry[1]);
		assert.strictEqual(viewModels[3].outputSwimlanes[2].id, 'g');
		assert.strictEqual(viewModels[3].outputSwimlanes[2].color, colorRegistry[2]);

		// node e
		assert.strictEqual(viewModels[4].inputSwimlanes.length, 3);
		assert.strictEqual(viewModels[4].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[4].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[4].inputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[4].inputSwimlanes[1].color, colorRegistry[1]);
		assert.strictEqual(viewModels[4].inputSwimlanes[2].id, 'g');
		assert.strictEqual(viewModels[4].inputSwimlanes[2].color, colorRegistry[2]);

		assert.strictEqual(viewModels[4].outputSwimlanes.length, 3);
		assert.strictEqual(viewModels[4].outputSwimlanes[0].id, 'g');
		assert.strictEqual(viewModels[4].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[4].outputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[4].outputSwimlanes[1].color, colorRegistry[1]);
		assert.strictEqual(viewModels[4].outputSwimlanes[2].id, 'g');
		assert.strictEqual(viewModels[4].outputSwimlanes[2].color, colorRegistry[2]);

		// node d
		assert.strictEqual(viewModels[5].inputSwimlanes.length, 3);
		assert.strictEqual(viewModels[5].inputSwimlanes[0].id, 'g');
		assert.strictEqual(viewModels[5].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[5].inputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[5].inputSwimlanes[1].color, colorRegistry[1]);
		assert.strictEqual(viewModels[5].inputSwimlanes[2].id, 'g');
		assert.strictEqual(viewModels[5].inputSwimlanes[2].color, colorRegistry[2]);

		assert.strictEqual(viewModels[5].outputSwimlanes.length, 3);
		assert.strictEqual(viewModels[5].outputSwimlanes[0].id, 'g');
		assert.strictEqual(viewModels[5].outputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[5].outputSwimlanes[1].id, 'g');
		assert.strictEqual(viewModels[5].outputSwimlanes[1].color, colorRegistry[1]);
		assert.strictEqual(viewModels[5].outputSwimlanes[2].id, 'g');
		assert.strictEqual(viewModels[5].outputSwimlanes[2].color, colorRegistry[2]);

		// node g
		assert.strictEqual(viewModels[6].inputSwimlanes.length, 3);
		assert.strictEqual(viewModels[6].inputSwimlanes[0].id, 'g');
		assert.strictEqual(viewModels[6].inputSwimlanes[0].color, colorRegistry[0]);
		assert.strictEqual(viewModels[6].inputSwimlanes[1].id, 'g');
		assert.strictEqual(viewModels[6].inputSwimlanes[1].color, colorRegistry[1]);
		assert.strictEqual(viewModels[6].inputSwimlanes[2].id, 'g');
		assert.strictEqual(viewModels[6].inputSwimlanes[2].color, colorRegistry[2]);

		assert.strictEqual(viewModels[6].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[6].outputSwimlanes[0].id, 'h');
		assert.strictEqual(viewModels[6].outputSwimlanes[0].color, colorRegistry[0]);
	});

	/**
	 * 	* a(b) [topic]
	 * 	* b(c)
	 * 	* c(d) [origin/topic]
	 * 	* d(e)
	 * 	* e(f,g)
	 * 	|\
	 * 	| * g(h) [origin/main]
	 */
	test('graph with color map', () => {
		const models = [
			toSCMHistoryItem('a', ['b'], [{ id: 'topic', name: 'topic' }]),
			toSCMHistoryItem('b', ['c']),
			toSCMHistoryItem('c', ['d'], [{ id: 'origin/topic', name: 'origin/topic' }]),
			toSCMHistoryItem('d', ['e']),
			toSCMHistoryItem('e', ['f', 'g']),
			toSCMHistoryItem('g', ['h'], [{ id: 'origin/main', name: 'origin/main' }])
		];

		const colorMap = new Map<string, ColorIdentifier>([
			['topic', historyItemRefColor],
			['origin/topic', historyItemRemoteRefColor],
			['origin/main', historyItemBaseRefColor],
		]);

		const viewModels = toISCMHistoryItemViewModelArray(models, colorMap);

		assert.strictEqual(viewModels.length, 6);

		// node a
		assert.strictEqual(viewModels[0].inputSwimlanes.length, 0);

		assert.strictEqual(viewModels[0].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[0].outputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[0].outputSwimlanes[0].color, historyItemRefColor);

		// node b
		assert.strictEqual(viewModels[1].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[1].inputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[1].inputSwimlanes[0].color, historyItemRefColor);

		assert.strictEqual(viewModels[1].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[1].outputSwimlanes[0].id, 'c');
		assert.strictEqual(viewModels[1].outputSwimlanes[0].color, historyItemRefColor);

		// node c
		assert.strictEqual(viewModels[2].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[2].inputSwimlanes[0].id, 'c');
		assert.strictEqual(viewModels[2].inputSwimlanes[0].color, historyItemRefColor);

		assert.strictEqual(viewModels[2].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[2].outputSwimlanes[0].id, 'd');
		assert.strictEqual(viewModels[2].outputSwimlanes[0].color, historyItemRemoteRefColor);

		// node d
		assert.strictEqual(viewModels[3].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[3].inputSwimlanes[0].id, 'd');
		assert.strictEqual(viewModels[3].inputSwimlanes[0].color, historyItemRemoteRefColor);

		assert.strictEqual(viewModels[3].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[3].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[3].outputSwimlanes[0].color, historyItemRemoteRefColor);

		// node e
		assert.strictEqual(viewModels[4].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[4].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[4].inputSwimlanes[0].color, historyItemRemoteRefColor);

		assert.strictEqual(viewModels[4].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[4].outputSwimlanes[0].id, 'f');
		assert.strictEqual(viewModels[4].outputSwimlanes[0].color, historyItemRemoteRefColor);
		assert.strictEqual(viewModels[4].outputSwimlanes[1].id, 'g');
		assert.strictEqual(viewModels[4].outputSwimlanes[1].color, historyItemBaseRefColor);

		// node g
		assert.strictEqual(viewModels[5].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[5].inputSwimlanes[0].id, 'f');
		assert.strictEqual(viewModels[5].inputSwimlanes[0].color, historyItemRemoteRefColor);
		assert.strictEqual(viewModels[5].inputSwimlanes[1].id, 'g');
		assert.strictEqual(viewModels[5].inputSwimlanes[1].color, historyItemBaseRefColor);

		assert.strictEqual(viewModels[5].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[5].outputSwimlanes[0].id, 'f');
		assert.strictEqual(viewModels[5].outputSwimlanes[0].color, historyItemRemoteRefColor);
		assert.strictEqual(viewModels[5].outputSwimlanes[1].id, 'h');
		assert.strictEqual(viewModels[5].outputSwimlanes[1].color, historyItemBaseRefColor);
	});

	/**
	 * 	* a(b) [origin/main]
	 * 	* b(e)
	 * 	| * c(d) [main]
	 * 	| * d(e)
	 * 	|/
	 * 	* e(f)
	 * 	* f(g)
	*/
	test('graph with incoming/outgoing changes (remote ref first)', () => {
		const models = [
			toSCMHistoryItem('a', ['b'], [{ id: 'origin/main', name: 'origin/main' }]),
			toSCMHistoryItem('b', ['e']),
			toSCMHistoryItem('c', ['d'], [{ id: 'main', name: 'main' }]),
			toSCMHistoryItem('d', ['e']),
			toSCMHistoryItem('e', ['f']),
			toSCMHistoryItem('f', ['g']),
		] satisfies ISCMHistoryItem[];

		const colorMap = new Map<string, ColorIdentifier>([
			['origin/main', historyItemRemoteRefColor],
			['main', historyItemRefColor]
		]);

		const viewModels = toISCMHistoryItemViewModelArray(
			models,
			colorMap,
			{ id: 'main', name: 'main', revision: 'c' },
			{ id: 'origin/main', name: 'origin/main', revision: 'a' },
			undefined,
			true,
			true,
			'e'
		);

		assert.strictEqual(viewModels.length, 8);

		// node a
		assert.strictEqual(viewModels[0].kind, 'node');
		assert.strictEqual(viewModels[0].inputSwimlanes.length, 0);

		assert.strictEqual(viewModels[0].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[0].outputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[0].outputSwimlanes[0].color, historyItemRemoteRefColor);

		// node b
		assert.strictEqual(viewModels[1].kind, 'node');
		assert.strictEqual(viewModels[1].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[1].inputSwimlanes[0].color, historyItemRemoteRefColor);

		assert.strictEqual(viewModels[1].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[1].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[1].outputSwimlanes[0].color, historyItemRemoteRefColor);

		// outgoing changes node
		assert.strictEqual(viewModels[2].kind, 'outgoing-changes');
		assert.strictEqual(viewModels[2].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[2].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[2].inputSwimlanes[0].color, historyItemRemoteRefColor);

		assert.strictEqual(viewModels[2].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[2].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[2].outputSwimlanes[0].color, historyItemRemoteRefColor);
		assert.strictEqual(viewModels[2].outputSwimlanes[1].id, 'c');
		assert.strictEqual(viewModels[2].outputSwimlanes[1].color, historyItemRefColor);

		// node c
		assert.strictEqual(viewModels[3].kind, 'HEAD');
		assert.strictEqual(viewModels[3].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[3].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[3].inputSwimlanes[0].color, historyItemRemoteRefColor);
		assert.strictEqual(viewModels[3].inputSwimlanes[1].id, 'c');
		assert.strictEqual(viewModels[3].inputSwimlanes[1].color, historyItemRefColor);

		assert.strictEqual(viewModels[3].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[3].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[3].outputSwimlanes[0].color, historyItemRemoteRefColor);
		assert.strictEqual(viewModels[3].outputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[3].outputSwimlanes[1].color, historyItemRefColor);

		// node d
		assert.strictEqual(viewModels[4].kind, 'node');
		assert.strictEqual(viewModels[4].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[4].inputSwimlanes[0].id, SCMIncomingHistoryItemId);
		assert.strictEqual(viewModels[4].inputSwimlanes[0].color, historyItemRemoteRefColor);
		assert.strictEqual(viewModels[4].inputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[4].inputSwimlanes[1].color, historyItemRefColor);

		assert.strictEqual(viewModels[4].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[4].outputSwimlanes[0].id, SCMIncomingHistoryItemId);
		assert.strictEqual(viewModels[4].outputSwimlanes[0].color, historyItemRemoteRefColor);
		assert.strictEqual(viewModels[4].outputSwimlanes[1].id, 'e');
		assert.strictEqual(viewModels[4].outputSwimlanes[1].color, historyItemRefColor);

		// incoming changes node
		assert.strictEqual(viewModels[5].kind, 'incoming-changes');
		assert.strictEqual(viewModels[5].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[5].inputSwimlanes[0].id, SCMIncomingHistoryItemId);
		assert.strictEqual(viewModels[5].inputSwimlanes[0].color, historyItemRemoteRefColor);
		assert.strictEqual(viewModels[5].inputSwimlanes[1].id, 'e');
		assert.strictEqual(viewModels[5].inputSwimlanes[1].color, historyItemRefColor);

		assert.strictEqual(viewModels[5].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[5].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[5].outputSwimlanes[0].color, historyItemRemoteRefColor);
		assert.strictEqual(viewModels[5].outputSwimlanes[1].id, 'e');
		assert.strictEqual(viewModels[5].outputSwimlanes[1].color, historyItemRefColor);

		// node e
		assert.strictEqual(viewModels[6].kind, 'node');
		assert.strictEqual(viewModels[6].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[6].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[6].inputSwimlanes[0].color, historyItemRemoteRefColor);
		assert.strictEqual(viewModels[6].inputSwimlanes[1].id, 'e');
		assert.strictEqual(viewModels[6].inputSwimlanes[1].color, historyItemRefColor);

		assert.strictEqual(viewModels[6].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[6].outputSwimlanes[0].id, 'f');
		assert.strictEqual(viewModels[6].outputSwimlanes[0].color, historyItemRemoteRefColor);

		// node f
		assert.strictEqual(viewModels[7].kind, 'node');
		assert.strictEqual(viewModels[7].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[7].inputSwimlanes[0].id, 'f');
		assert.strictEqual(viewModels[7].inputSwimlanes[0].color, historyItemRemoteRefColor);

		assert.strictEqual(viewModels[7].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[7].outputSwimlanes[0].id, 'g');
		assert.strictEqual(viewModels[7].outputSwimlanes[0].color, historyItemRemoteRefColor);
	});

	/**
	 * 	* a(b) [main]
	 * 	* b(e)
	 * 	| * c(d) [origin/main]
	 * 	| * d(e)
	 * 	|/
	 * 	* e(f)
	 * 	* f(g)
	*/
	test('graph with incoming/outgoing changes (local ref first)', () => {
		const models = [
			toSCMHistoryItem('a', ['b'], [{ id: 'main', name: 'main' }]),
			toSCMHistoryItem('b', ['e']),
			toSCMHistoryItem('c', ['d'], [{ id: 'origin/main', name: 'origin/main' }]),
			toSCMHistoryItem('d', ['e']),
			toSCMHistoryItem('e', ['f']),
			toSCMHistoryItem('f', ['g']),
		] satisfies ISCMHistoryItem[];

		const colorMap = new Map<string, ColorIdentifier>([
			['origin/main', historyItemRemoteRefColor],
			['main', historyItemRefColor]
		]);

		const viewModels = toISCMHistoryItemViewModelArray(
			models,
			colorMap,
			{ id: 'main', name: 'main', revision: 'a' },
			{ id: 'origin/main', name: 'origin/main', revision: 'c' },
			undefined,
			true,
			true,
			'e'
		);

		assert.strictEqual(viewModels.length, 8);

		// outgoing changes node
		assert.strictEqual(viewModels[0].kind, 'outgoing-changes');
		assert.strictEqual(viewModels[0].inputSwimlanes.length, 0);

		assert.strictEqual(viewModels[0].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[0].outputSwimlanes[0].id, 'a');
		assert.strictEqual(viewModels[0].outputSwimlanes[0].color, historyItemRefColor);

		// node a
		assert.strictEqual(viewModels[1].kind, 'HEAD');
		assert.strictEqual(viewModels[1].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[1].inputSwimlanes[0].id, 'a');
		assert.strictEqual(viewModels[1].inputSwimlanes[0].color, historyItemRefColor);

		assert.strictEqual(viewModels[1].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[1].outputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[1].outputSwimlanes[0].color, historyItemRefColor);

		// node b
		assert.strictEqual(viewModels[2].kind, 'node');
		assert.strictEqual(viewModels[2].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[2].inputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[2].inputSwimlanes[0].color, historyItemRefColor);

		assert.strictEqual(viewModels[2].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[2].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[2].outputSwimlanes[0].color, historyItemRefColor);

		// node c
		assert.strictEqual(viewModels[3].kind, 'node');
		assert.strictEqual(viewModels[3].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[3].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[3].inputSwimlanes[0].color, historyItemRefColor);

		assert.strictEqual(viewModels[3].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[3].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[3].outputSwimlanes[0].color, historyItemRefColor);
		assert.strictEqual(viewModels[3].outputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[3].outputSwimlanes[1].color, historyItemRemoteRefColor);

		// node d
		assert.strictEqual(viewModels[4].kind, 'node');
		assert.strictEqual(viewModels[4].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[4].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[4].inputSwimlanes[0].color, historyItemRefColor);
		assert.strictEqual(viewModels[4].inputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[4].inputSwimlanes[1].color, historyItemRemoteRefColor);

		assert.strictEqual(viewModels[4].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[4].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[4].outputSwimlanes[0].color, historyItemRefColor);
		assert.strictEqual(viewModels[4].outputSwimlanes[1].id, SCMIncomingHistoryItemId);
		assert.strictEqual(viewModels[4].outputSwimlanes[1].color, historyItemRemoteRefColor);

		// incoming changes node
		assert.strictEqual(viewModels[5].kind, 'incoming-changes');
		assert.strictEqual(viewModels[5].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[5].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[5].inputSwimlanes[0].color, historyItemRefColor);
		assert.strictEqual(viewModels[5].inputSwimlanes[1].id, SCMIncomingHistoryItemId);
		assert.strictEqual(viewModels[5].inputSwimlanes[1].color, historyItemRemoteRefColor);

		assert.strictEqual(viewModels[5].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[5].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[5].outputSwimlanes[0].color, historyItemRefColor);
		assert.strictEqual(viewModels[5].outputSwimlanes[1].id, 'e');
		assert.strictEqual(viewModels[5].outputSwimlanes[1].color, historyItemRemoteRefColor);

		// node e
		assert.strictEqual(viewModels[6].kind, 'node');
		assert.strictEqual(viewModels[6].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[6].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[6].inputSwimlanes[0].color, historyItemRefColor);
		assert.strictEqual(viewModels[6].inputSwimlanes[1].id, 'e');
		assert.strictEqual(viewModels[6].inputSwimlanes[1].color, historyItemRemoteRefColor);

		assert.strictEqual(viewModels[6].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[6].outputSwimlanes[0].id, 'f');
		assert.strictEqual(viewModels[6].outputSwimlanes[0].color, historyItemRefColor);

		// node f
		assert.strictEqual(viewModels[7].kind, 'node');
		assert.strictEqual(viewModels[7].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[7].inputSwimlanes[0].id, 'f');
		assert.strictEqual(viewModels[7].inputSwimlanes[0].color, historyItemRefColor);

		assert.strictEqual(viewModels[7].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[7].outputSwimlanes[0].id, 'g');
		assert.strictEqual(viewModels[7].outputSwimlanes[0].color, historyItemRefColor);
	});

	/**
	 * 	* a(b) [origin/main]
	 * 	* b(c,d)
	 * 	|\
	 * 	| * c(e) [main]
	 * 	* | d(e)
	 *  |/
	 * 	* e(f)
	 * 	* f(g)
	*/
	test('graph with merged incoming changes', () => {
		const models = [
			toSCMHistoryItem('a', ['b'], [{ id: 'origin/main', name: 'origin/main' }]),
			toSCMHistoryItem('b', ['c', 'd']),
			toSCMHistoryItem('c', ['e'], [{ id: 'main', name: 'main' }]),
			toSCMHistoryItem('d', ['e']),
			toSCMHistoryItem('e', ['f']),
			toSCMHistoryItem('f', ['g']),
		] satisfies ISCMHistoryItem[];

		const colorMap = new Map<string, ColorIdentifier>([
			['origin/main', historyItemRemoteRefColor],
			['main', historyItemRefColor]
		]);

		const viewModels = toISCMHistoryItemViewModelArray(
			models,
			colorMap,
			{ id: 'main', name: 'main', revision: 'c' },
			{ id: 'origin/main', name: 'origin/main', revision: 'a' },
			undefined,
			true,
			true,
			'c'
		);

		assert.strictEqual(viewModels.length, 6);

		// node a
		assert.strictEqual(viewModels[0].kind, 'node');
		assert.strictEqual(viewModels[0].inputSwimlanes.length, 0);

		assert.strictEqual(viewModels[0].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[0].outputSwimlanes[0].id, 'b');
		assert.strictEqual(viewModels[0].outputSwimlanes[0].color, historyItemRemoteRefColor);

		// node b
		assert.strictEqual(viewModels[1].kind, 'node');
		assert.strictEqual(viewModels[1].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[1].inputSwimlanes[0].color, historyItemRemoteRefColor);

		assert.strictEqual(viewModels[1].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[1].outputSwimlanes[0].id, 'c');
		assert.strictEqual(viewModels[1].outputSwimlanes[0].color, historyItemRemoteRefColor);
		assert.strictEqual(viewModels[1].outputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[1].outputSwimlanes[1].color, colorRegistry[0]);

		// node c
		assert.strictEqual(viewModels[2].kind, 'HEAD');
		assert.strictEqual(viewModels[2].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[2].inputSwimlanes[0].id, 'c');
		assert.strictEqual(viewModels[2].inputSwimlanes[0].color, historyItemRemoteRefColor);
		assert.strictEqual(viewModels[2].inputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[2].inputSwimlanes[1].color, colorRegistry[0]);

		assert.strictEqual(viewModels[2].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[2].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[2].outputSwimlanes[0].color, historyItemRefColor);
		assert.strictEqual(viewModels[2].outputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[2].outputSwimlanes[1].color, colorRegistry[0]);

		// node d
		assert.strictEqual(viewModels[3].kind, 'node');
		assert.strictEqual(viewModels[3].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[3].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[3].inputSwimlanes[0].color, historyItemRefColor);
		assert.strictEqual(viewModels[3].inputSwimlanes[1].id, 'd');
		assert.strictEqual(viewModels[3].inputSwimlanes[1].color, colorRegistry[0]);

		assert.strictEqual(viewModels[3].outputSwimlanes.length, 2);
		assert.strictEqual(viewModels[3].outputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[3].outputSwimlanes[0].color, historyItemRefColor);
		assert.strictEqual(viewModels[3].outputSwimlanes[1].id, 'e');
		assert.strictEqual(viewModels[3].outputSwimlanes[1].color, colorRegistry[0]);

		// node e
		assert.strictEqual(viewModels[4].kind, 'node');
		assert.strictEqual(viewModels[4].inputSwimlanes.length, 2);
		assert.strictEqual(viewModels[4].inputSwimlanes[0].id, 'e');
		assert.strictEqual(viewModels[4].inputSwimlanes[0].color, historyItemRefColor);
		assert.strictEqual(viewModels[4].inputSwimlanes[1].id, 'e');
		assert.strictEqual(viewModels[4].inputSwimlanes[1].color, colorRegistry[0]);

		assert.strictEqual(viewModels[4].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[4].outputSwimlanes[0].id, 'f');
		assert.strictEqual(viewModels[4].outputSwimlanes[0].color, historyItemRefColor);

		// node f
		assert.strictEqual(viewModels[5].kind, 'node');
		assert.strictEqual(viewModels[5].inputSwimlanes.length, 1);
		assert.strictEqual(viewModels[5].inputSwimlanes[0].id, 'f');
		assert.strictEqual(viewModels[5].inputSwimlanes[0].color, historyItemRefColor);

		assert.strictEqual(viewModels[5].outputSwimlanes.length, 1);
		assert.strictEqual(viewModels[5].outputSwimlanes[0].id, 'g');
		assert.strictEqual(viewModels[5].outputSwimlanes[0].color, historyItemRefColor);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scrollLocking/browser/scrollLocking.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/scrollLocking/browser/scrollLocking.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { SyncScroll as ScrollLocking } from './scrollLocking.js';

registerWorkbenchContribution2(
	ScrollLocking.ID,
	ScrollLocking,
	WorkbenchPhase.Eventually // registration only
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scrollLocking/browser/scrollLocking.ts]---
Location: vscode-main/src/vs/workbench/contrib/scrollLocking/browser/scrollLocking.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { localize, localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { SideBySideEditor } from '../../../browser/parts/editor/sideBySideEditor.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IEditorPane, IEditorPaneScrollPosition, isEditorPaneWithScrolling } from '../../../common/editor.js';
import { ReentrancyBarrier } from '../../../../base/common/controlFlow.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IStatusbarEntryAccessor, IStatusbarService, StatusbarAlignment } from '../../../services/statusbar/browser/statusbar.js';

export class SyncScroll extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.syncScrolling';

	private readonly paneInitialScrollTop = new Map<IEditorPane, IEditorPaneScrollPosition | undefined>();

	private readonly syncScrollDispoasbles = this._register(new DisposableStore());
	private readonly paneDisposables = new DisposableStore();

	private readonly statusBarEntry = this._register(new MutableDisposable<IStatusbarEntryAccessor>());

	private isActive: boolean = false;

	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@IStatusbarService private readonly statusbarService: IStatusbarService
	) {
		super();

		this.registerActions();
	}

	private registerActiveListeners(): void {
		this.syncScrollDispoasbles.add(this.editorService.onDidVisibleEditorsChange(() => this.trackVisiblePanes()));
	}

	private activate(): void {
		this.registerActiveListeners();

		this.trackVisiblePanes();
	}

	toggle(): void {
		if (this.isActive) {
			this.deactivate();
		} else {
			this.activate();
		}

		this.isActive = !this.isActive;

		this.toggleStatusbarItem(this.isActive);
	}

	// makes sure that the onDidEditorPaneScroll is not called multiple times for the same event
	private _reentrancyBarrier = new ReentrancyBarrier();

	private trackVisiblePanes(): void {
		this.paneDisposables.clear();
		this.paneInitialScrollTop.clear();

		for (const pane of this.getAllVisiblePanes()) {

			if (!isEditorPaneWithScrolling(pane)) {
				continue;
			}

			this.paneInitialScrollTop.set(pane, pane.getScrollPosition());
			this.paneDisposables.add(pane.onDidChangeScroll(() =>
				this._reentrancyBarrier.runExclusivelyOrSkip(() => {
					this.onDidEditorPaneScroll(pane);
				})
			));
		}
	}

	private onDidEditorPaneScroll(scrolledPane: IEditorPane) {

		const scrolledPaneInitialOffset = this.paneInitialScrollTop.get(scrolledPane);
		if (scrolledPaneInitialOffset === undefined) {
			throw new Error('Scrolled pane not tracked');
		}

		if (!isEditorPaneWithScrolling(scrolledPane)) {
			throw new Error('Scrolled pane does not support scrolling');
		}

		const scrolledPaneCurrentPosition = scrolledPane.getScrollPosition();
		const scrolledFromInitial = {
			scrollTop: scrolledPaneCurrentPosition.scrollTop - scrolledPaneInitialOffset.scrollTop,
			scrollLeft: scrolledPaneCurrentPosition.scrollLeft !== undefined && scrolledPaneInitialOffset.scrollLeft !== undefined ? scrolledPaneCurrentPosition.scrollLeft - scrolledPaneInitialOffset.scrollLeft : undefined,
		};

		for (const pane of this.getAllVisiblePanes()) {
			if (pane === scrolledPane) {
				continue;
			}

			if (!isEditorPaneWithScrolling(pane)) {
				continue;
			}

			const initialOffset = this.paneInitialScrollTop.get(pane);
			if (initialOffset === undefined) {
				throw new Error('Could not find initial offset for pane');
			}

			const currentPanePosition = pane.getScrollPosition();
			const newPaneScrollPosition = {
				scrollTop: initialOffset.scrollTop + scrolledFromInitial.scrollTop,
				scrollLeft: initialOffset.scrollLeft !== undefined && scrolledFromInitial.scrollLeft !== undefined ? initialOffset.scrollLeft + scrolledFromInitial.scrollLeft : undefined,
			};

			if (currentPanePosition.scrollTop === newPaneScrollPosition.scrollTop && currentPanePosition.scrollLeft === newPaneScrollPosition.scrollLeft) {
				continue;
			}

			pane.setScrollPosition(newPaneScrollPosition);
		}
	}

	private getAllVisiblePanes(): IEditorPane[] {
		const panes: IEditorPane[] = [];

		for (const pane of this.editorService.visibleEditorPanes) {

			if (pane instanceof SideBySideEditor) {
				const primaryPane = pane.getPrimaryEditorPane();
				const secondaryPane = pane.getSecondaryEditorPane();
				if (primaryPane) {
					panes.push(primaryPane);
				}
				if (secondaryPane) {
					panes.push(secondaryPane);
				}
				continue;
			}

			panes.push(pane);
		}

		return panes;
	}

	private deactivate(): void {
		this.paneDisposables.clear();
		this.syncScrollDispoasbles.clear();
		this.paneInitialScrollTop.clear();
	}

	// Actions & Commands

	private toggleStatusbarItem(active: boolean): void {
		if (active) {
			if (!this.statusBarEntry.value) {
				const text = localize('mouseScrolllingLocked', 'Scrolling Locked');
				const tooltip = localize('mouseLockScrollingEnabled', 'Lock Scrolling Enabled');
				this.statusBarEntry.value = this.statusbarService.addEntry({
					name: text,
					text,
					tooltip,
					ariaLabel: text,
					command: {
						id: 'workbench.action.toggleLockedScrolling',
						title: ''
					},
					kind: 'prominent',
					showInAllWindows: true
				}, 'status.scrollLockingEnabled', StatusbarAlignment.RIGHT, 102);
			}
		} else {
			this.statusBarEntry.clear();
		}
	}

	private registerActions() {
		const $this = this;
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.toggleLockedScrolling',
					title: {
						...localize2('toggleLockedScrolling', "Toggle Locked Scrolling Across Editors"),
						mnemonicTitle: localize({ key: 'miToggleLockedScrolling', comment: ['&& denotes a mnemonic'] }, "Locked Scrolling"),
					},
					category: Categories.View,
					f1: true,
					metadata: {
						description: localize('synchronizeScrolling', "Synchronize Scrolling Editors"),
					}
				});
			}

			run(): void {
				$this.toggle();
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.holdLockedScrolling',
					title: {
						...localize2('holdLockedScrolling', "Hold Locked Scrolling Across Editors"),
						mnemonicTitle: localize({ key: 'miHoldLockedScrolling', comment: ['&& denotes a mnemonic'] }, "Locked Scrolling"),
					},
					category: Categories.View,
				});
			}

			run(accessor: ServicesAccessor): void {
				const keybindingService = accessor.get(IKeybindingService);

				// Enable Sync Scrolling while pressed
				$this.toggle();

				const holdMode = keybindingService.enableKeybindingHoldMode('workbench.action.holdLockedScrolling');
				if (!holdMode) {
					return;
				}

				holdMode.finally(() => {
					$this.toggle();
				});
			}
		}));
	}

	override dispose(): void {
		this.deactivate();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/anythingQuickAccess.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/anythingQuickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/anythingQuickAccess.css';
import { IQuickInputButton, IKeyMods, quickPickItemScorerAccessor, QuickPickItemScorerAccessor, IQuickPick, IQuickPickItemWithResource, QuickInputHideReason, IQuickInputService, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { IPickerQuickAccessItem, PickerQuickAccessProvider, TriggerAction, FastAndSlowPicks, Picks, PicksWithActive } from '../../../../platform/quickinput/browser/pickerQuickAccess.js';
import { prepareQuery, IPreparedQuery, compareItemsByFuzzyScore, scoreItemFuzzy, FuzzyScorerCache } from '../../../../base/common/fuzzyScorer.js';
import { IFileQueryBuilderOptions, QueryBuilder } from '../../../services/search/common/queryBuilder.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { getOutOfWorkspaceEditorResources, extractRangeFromFilter, IWorkbenchSearchConfiguration } from '../common/search.js';
import { ISearchService, ISearchComplete } from '../../../services/search/common/search.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { untildify } from '../../../../base/common/labels.js';
import { IPathService } from '../../../services/path/common/pathService.js';
import { URI } from '../../../../base/common/uri.js';
import { toLocalResource, dirname, basenameOrAuthority } from '../../../../base/common/resources.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { DisposableStore, IDisposable, toDisposable, MutableDisposable, Disposable } from '../../../../base/common/lifecycle.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { getIconClasses } from '../../../../editor/common/services/getIconClasses.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { localize } from '../../../../nls.js';
import { IWorkingCopyService } from '../../../services/workingCopy/common/workingCopyService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWorkbenchEditorConfiguration, EditorResourceAccessor, isEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorService, SIDE_GROUP, ACTIVE_GROUP } from '../../../services/editor/common/editorService.js';
import { Range, IRange } from '../../../../editor/common/core/range.js';
import { ThrottledDelayer } from '../../../../base/common/async.js';
import { top } from '../../../../base/common/arrays.js';
import { FileQueryCacheState } from '../common/cacheState.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { IResourceEditorInput, ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { Schemas } from '../../../../base/common/network.js';
import { IFilesConfigurationService } from '../../../services/filesConfiguration/common/filesConfigurationService.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { SymbolsQuickAccessProvider } from './symbolsQuickAccess.js';
import { AnythingQuickAccessProviderRunOptions, DefaultQuickAccessFilterValue, Extensions, IQuickAccessRegistry } from '../../../../platform/quickinput/common/quickAccess.js';
import { PickerEditorState, IWorkbenchQuickAccessConfiguration } from '../../../browser/quickaccess.js';
import { GotoSymbolQuickAccessProvider } from '../../codeEditor/browser/quickaccess/gotoSymbolQuickAccess.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { ScrollType, IEditor } from '../../../../editor/common/editorCommon.js';
import { Event } from '../../../../base/common/event.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { stripIcons } from '../../../../base/common/iconLabels.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ASK_QUICK_QUESTION_ACTION_ID } from '../../chat/browser/actions/chatQuickInputActions.js';
import { IQuickChatService } from '../../chat/browser/chat.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ICustomEditorLabelService } from '../../../services/editor/common/customEditorLabelService.js';

interface IAnythingQuickPickItem extends IPickerQuickAccessItem, IQuickPickItemWithResource { }

interface IEditorSymbolAnythingQuickPickItem extends IAnythingQuickPickItem {
	resource: URI;
	range: { decoration: IRange; selection: IRange };
}

function isEditorSymbolQuickPickItem(pick?: IAnythingQuickPickItem): pick is IEditorSymbolAnythingQuickPickItem {
	const candidate = pick as IEditorSymbolAnythingQuickPickItem | undefined;

	return !!candidate?.range && !!candidate.resource;
}

interface IAnythingPickState extends IDisposable {
	picker: IQuickPick<IAnythingQuickPickItem, { useSeparators: true }> | undefined;
	editorViewState: PickerEditorState;

	scorerCache: FuzzyScorerCache;
	fileQueryCache: FileQueryCacheState | undefined;

	lastOriginalFilter: string | undefined;
	lastFilter: string | undefined;
	lastRange: IRange | undefined;

	lastGlobalPicks: PicksWithActive<IAnythingQuickPickItem> | undefined;

	isQuickNavigating: boolean | undefined;

	/**
	 * Sets the picker for this pick state.
	 */
	set(picker: IQuickPick<IAnythingQuickPickItem, { useSeparators: true }>): void;
}


export class AnythingQuickAccessProvider extends PickerQuickAccessProvider<IAnythingQuickPickItem> {

	static PREFIX = '';

	private static readonly NO_RESULTS_PICK: IAnythingQuickPickItem = {
		label: localize('noAnythingResults', "No matching results")
	};

	private static readonly MAX_RESULTS = 512;

	private static readonly TYPING_SEARCH_DELAY = 200; // this delay accommodates for the user typing a word and then stops typing to start searching

	private static SYMBOL_PICKS_MERGE_DELAY = 200; // allow some time to merge fast and slow picks to reduce flickering

	private readonly pickState: IAnythingPickState;

	get defaultFilterValue(): DefaultQuickAccessFilterValue | undefined {
		if (this.configuration.preserveInput) {
			return DefaultQuickAccessFilterValue.LAST;
		}

		return undefined;
	}

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ISearchService private readonly searchService: ISearchService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IPathService private readonly pathService: IPathService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IFileService private readonly fileService: IFileService,
		@ILabelService private readonly labelService: ILabelService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IWorkingCopyService private readonly workingCopyService: IWorkingCopyService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IEditorService private readonly editorService: IEditorService,
		@IHistoryService private readonly historyService: IHistoryService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IQuickChatService private readonly quickChatService: IQuickChatService,
		@ILogService private readonly logService: ILogService,
		@ICustomEditorLabelService private readonly customEditorLabelService: ICustomEditorLabelService
	) {
		super(AnythingQuickAccessProvider.PREFIX, {
			canAcceptInBackground: true,
			noResultsPick: AnythingQuickAccessProvider.NO_RESULTS_PICK
		});

		this.pickState = this._register(new class extends Disposable {

			picker: IQuickPick<IAnythingQuickPickItem, { useSeparators: true }> | undefined = undefined;

			editorViewState: PickerEditorState;

			scorerCache: FuzzyScorerCache = Object.create(null);
			fileQueryCache: FileQueryCacheState | undefined = undefined;

			lastOriginalFilter: string | undefined = undefined;
			lastFilter: string | undefined = undefined;
			lastRange: IRange | undefined = undefined;

			lastGlobalPicks: PicksWithActive<IAnythingQuickPickItem> | undefined = undefined;

			isQuickNavigating: boolean | undefined = undefined;

			constructor(
				private readonly provider: AnythingQuickAccessProvider,
				instantiationService: IInstantiationService
			) {
				super();
				this.editorViewState = this._register(instantiationService.createInstance(PickerEditorState));
			}

			set(picker: IQuickPick<IAnythingQuickPickItem, { useSeparators: true }>): void {

				// Picker for this run
				this.picker = picker;
				Event.once(picker.onDispose)(() => {
					if (picker === this.picker) {
						this.picker = undefined; // clear the picker when disposed to not keep it in memory for too long
					}
				});

				// Caches
				const isQuickNavigating = !!picker.quickNavigate;
				if (!isQuickNavigating) {
					this.fileQueryCache = this.provider.createFileQueryCache();
					this.scorerCache = Object.create(null);
				}

				// Other
				this.isQuickNavigating = isQuickNavigating;
				this.lastOriginalFilter = undefined;
				this.lastFilter = undefined;
				this.lastRange = undefined;
				this.lastGlobalPicks = undefined;
				this.editorViewState.reset();
			}
		}(this, instantiationService));

		this.fileQueryBuilder = this.instantiationService.createInstance(QueryBuilder);
		this.workspaceSymbolsQuickAccess = this._register(instantiationService.createInstance(SymbolsQuickAccessProvider));
		this.editorSymbolsQuickAccess = this.instantiationService.createInstance(GotoSymbolQuickAccessProvider);
	}

	private get configuration() {
		const editorConfig = this.configurationService.getValue<IWorkbenchEditorConfiguration>().workbench?.editor;
		const searchConfig = this.configurationService.getValue<IWorkbenchSearchConfiguration>().search;
		const quickAccessConfig = this.configurationService.getValue<IWorkbenchQuickAccessConfiguration>().workbench.quickOpen;

		return {
			openEditorPinned: !editorConfig?.enablePreviewFromQuickOpen || !editorConfig?.enablePreview,
			openSideBySideDirection: editorConfig?.openSideBySideDirection,
			includeSymbols: searchConfig?.quickOpen.includeSymbols,
			includeHistory: searchConfig?.quickOpen.includeHistory,
			historyFilterSortOrder: searchConfig?.quickOpen.history.filterSortOrder,
			preserveInput: quickAccessConfig.preserveInput
		};
	}

	override provide(picker: IQuickPick<IAnythingQuickPickItem, { useSeparators: true }>, token: CancellationToken, runOptions?: AnythingQuickAccessProviderRunOptions): IDisposable {
		const disposables = new DisposableStore();

		// Update the pick state for this run
		this.pickState.set(picker);

		// Add editor decorations for active editor symbol picks
		const editorDecorationsDisposable = disposables.add(new MutableDisposable());
		disposables.add(picker.onDidChangeActive(() => {

			// Clear old decorations
			editorDecorationsDisposable.value = undefined;

			// Add new decoration if editor symbol is active
			const [item] = picker.activeItems;
			if (isEditorSymbolQuickPickItem(item)) {
				editorDecorationsDisposable.value = this.decorateAndRevealSymbolRange(item);
			}
		}));

		// Restore view state upon cancellation if we changed it
		// but only when the picker was closed via explicit user
		// gesture and not e.g. when focus was lost because that
		// could mean the user clicked into the editor directly.
		disposables.add(Event.once(picker.onDidHide)(({ reason }) => {
			if (reason === QuickInputHideReason.Gesture) {
				this.pickState.editorViewState.restore();
			}
		}));

		// Start picker
		disposables.add(super.provide(picker, token, runOptions));

		return disposables;
	}

	private decorateAndRevealSymbolRange(pick: IEditorSymbolAnythingQuickPickItem): IDisposable {
		const activeEditor = this.editorService.activeEditor;
		if (!this.uriIdentityService.extUri.isEqual(pick.resource, activeEditor?.resource)) {
			return Disposable.None; // active editor needs to be for resource
		}

		const activeEditorControl = this.editorService.activeTextEditorControl;
		if (!activeEditorControl) {
			return Disposable.None; // we need a text editor control to decorate and reveal
		}

		// we must remember our current view state to be able to restore
		this.pickState.editorViewState.set();

		// Reveal
		activeEditorControl.revealRangeInCenter(pick.range.selection, ScrollType.Smooth);

		// Decorate
		this.addDecorations(activeEditorControl, pick.range.decoration);

		return toDisposable(() => this.clearDecorations(activeEditorControl));
	}

	protected _getPicks(originalFilter: string, disposables: DisposableStore, token: CancellationToken, runOptions?: AnythingQuickAccessProviderRunOptions): Picks<IAnythingQuickPickItem> | Promise<Picks<IAnythingQuickPickItem>> | FastAndSlowPicks<IAnythingQuickPickItem> | null {

		// Find a suitable range from the pattern looking for ":", "#" or ","
		// unless we have the `@` editor symbol character inside the filter
		const filterWithRange = extractRangeFromFilter(originalFilter, [GotoSymbolQuickAccessProvider.PREFIX]);

		// Update filter with normalized values
		let filter: string;
		if (filterWithRange) {
			filter = filterWithRange.filter;
		} else {
			filter = originalFilter;
		}

		// Remember as last range
		this.pickState.lastRange = filterWithRange?.range;

		// If the original filter value has changed but the normalized
		// one has not, we return early with a `null` result indicating
		// that the results should preserve because the range information
		// (:<line>:<column>) does not need to trigger any re-sorting.
		if (originalFilter !== this.pickState.lastOriginalFilter && filter === this.pickState.lastFilter) {
			return null;
		}

		// Remember as last filter
		const lastWasFiltering = !!this.pickState.lastOriginalFilter;
		this.pickState.lastOriginalFilter = originalFilter;
		this.pickState.lastFilter = filter;

		// Remember our pick state before returning new picks
		// unless we are inside an editor symbol filter or result.
		// We can use this state to return back to the global pick
		// when the user is narrowing back out of editor symbols.
		const picks = this.pickState.picker?.items;
		const activePick = this.pickState.picker?.activeItems[0];
		if (picks && activePick) {
			const activePickIsEditorSymbol = isEditorSymbolQuickPickItem(activePick);
			const activePickIsNoResultsInEditorSymbols = activePick === AnythingQuickAccessProvider.NO_RESULTS_PICK && filter.indexOf(GotoSymbolQuickAccessProvider.PREFIX) >= 0;
			if (!activePickIsEditorSymbol && !activePickIsNoResultsInEditorSymbols) {
				this.pickState.lastGlobalPicks = {
					items: picks,
					active: activePick
				};
			}
		}

		// `enableEditorSymbolSearch`: this will enable local editor symbol
		// search if the filter value includes `@` character. We only want
		// to enable this support though if the user was filtering in the
		// picker because this feature depends on an active item in the result
		// list to get symbols from. If we would simply trigger editor symbol
		// search without prior filtering, you could not paste a file name
		// including the `@` character to open it (e.g. /some/file@path)
		// refs: https://github.com/microsoft/vscode/issues/93845
		return this.doGetPicks(
			filter,
			{
				...runOptions,
				enableEditorSymbolSearch: lastWasFiltering
			},
			disposables,
			token
		);
	}

	private doGetPicks(
		filter: string,
		options: AnythingQuickAccessProviderRunOptions & { enableEditorSymbolSearch: boolean },
		disposables: DisposableStore,
		token: CancellationToken
	): Picks<IAnythingQuickPickItem> | Promise<Picks<IAnythingQuickPickItem>> | FastAndSlowPicks<IAnythingQuickPickItem> {
		const query = prepareQuery(filter);

		// Return early if we have editor symbol picks. We support this by:
		// - having a previously active global pick (e.g. a file)
		// - the user typing `@` to start the local symbol query
		if (options.enableEditorSymbolSearch) {
			const editorSymbolPicks = this.getEditorSymbolPicks(query, disposables, token);
			if (editorSymbolPicks) {
				return editorSymbolPicks;
			}
		}

		// If we have a known last active editor symbol pick, we try to restore
		// the last global pick to support the case of narrowing out from a
		// editor symbol search back into the global search
		const activePick = this.pickState.picker?.activeItems[0];
		if (isEditorSymbolQuickPickItem(activePick) && this.pickState.lastGlobalPicks) {
			return this.pickState.lastGlobalPicks;
		}

		// Otherwise return normally with history and file/symbol results
		const historyEditorPicks = this.getEditorHistoryPicks(query);

		let picks = new Array<IAnythingQuickPickItem | IQuickPickSeparator>();
		if (options.additionPicks) {
			for (const pick of options.additionPicks) {
				if (pick.type === 'separator') {
					picks.push(pick);
					continue;
				}
				if (!query.original) {
					pick.highlights = undefined;
					picks.push(pick);
					continue;
				}
				const { score, labelMatch, descriptionMatch } = scoreItemFuzzy(pick, query, true, quickPickItemScorerAccessor, this.pickState.scorerCache);
				if (!score) {
					continue;
				}
				pick.highlights = {
					label: labelMatch,
					description: descriptionMatch
				};
				picks.push(pick);
			}
		}
		if (this.pickState.isQuickNavigating) {
			if (picks.length > 0) {
				picks.push({ type: 'separator', label: localize('recentlyOpenedSeparator', "recently opened") } satisfies IQuickPickSeparator);
			}
			picks = historyEditorPicks;
		} else {
			if (options.includeHelp) {
				picks.push(...this.getHelpPicks(query, token, options));
			}
			if (historyEditorPicks.length !== 0) {
				picks.push({ type: 'separator', label: localize('recentlyOpenedSeparator', "recently opened") } satisfies IQuickPickSeparator);
				picks.push(...historyEditorPicks);
			}
		}

		return {

			// Fast picks: help (if included) & editor history
			picks: options.filter ? picks.filter((p) => options.filter?.(p)) : picks,

			// Slow picks: files and symbols
			additionalPicks: (async (): Promise<Picks<IAnythingQuickPickItem>> => {

				// Exclude any result that is already present in editor history.
				const additionalPicksExcludes = new ResourceMap<boolean>(uri => this.uriIdentityService.extUri.getComparisonKey(uri));
				for (const historyEditorPick of historyEditorPicks) {
					if (historyEditorPick.resource) {
						additionalPicksExcludes.set(historyEditorPick.resource, true);
					}
				}

				let additionalPicks = await this.getAdditionalPicks(query, additionalPicksExcludes, this.configuration.includeSymbols, token);
				if (options.filter) {
					additionalPicks = additionalPicks.filter((p) => options.filter?.(p));
				}
				if (token.isCancellationRequested) {
					return [];
				}

				return additionalPicks.length > 0 ? [
					{ type: 'separator', label: this.configuration.includeSymbols ? localize('fileAndSymbolResultsSeparator', "file and symbol results") : localize('fileResultsSeparator', "file results") },
					...additionalPicks
				] : [];
			})(),

			// allow some time to merge files and symbols to reduce flickering
			mergeDelay: AnythingQuickAccessProvider.SYMBOL_PICKS_MERGE_DELAY
		};
	}

	private async getAdditionalPicks(query: IPreparedQuery, excludes: ResourceMap<boolean>, includeSymbols: boolean, token: CancellationToken): Promise<Array<IAnythingQuickPickItem>> {

		// Resolve file and symbol picks (if enabled)
		const [filePicks, symbolPicks] = await Promise.all([
			this.getFilePicks(query, excludes, token),
			this.getWorkspaceSymbolPicks(query, includeSymbols, token)
		]);

		if (token.isCancellationRequested) {
			return [];
		}

		// Perform sorting (top results by score)
		const sortedAnythingPicks = top(
			[...filePicks, ...symbolPicks],
			(anyPickA, anyPickB) => compareItemsByFuzzyScore(anyPickA, anyPickB, query, true, quickPickItemScorerAccessor, this.pickState.scorerCache),
			AnythingQuickAccessProvider.MAX_RESULTS
		);

		// Perform filtering
		const filteredAnythingPicks: IAnythingQuickPickItem[] = [];
		for (const anythingPick of sortedAnythingPicks) {

			// Always preserve any existing highlights (e.g. from workspace symbols)
			if (anythingPick.highlights) {
				filteredAnythingPicks.push(anythingPick);
			}

			// Otherwise, do the scoring and matching here
			else {
				const { score, labelMatch, descriptionMatch } = scoreItemFuzzy(anythingPick, query, true, quickPickItemScorerAccessor, this.pickState.scorerCache);
				if (!score) {
					continue;
				}

				anythingPick.highlights = {
					label: labelMatch,
					description: descriptionMatch
				};

				filteredAnythingPicks.push(anythingPick);
			}
		}

		return filteredAnythingPicks;
	}


	//#region Editor History

	private readonly labelOnlyEditorHistoryPickAccessor = new QuickPickItemScorerAccessor({ skipDescription: true });

	private getEditorHistoryPicks(query: IPreparedQuery): Array<IAnythingQuickPickItem> {
		const configuration = this.configuration;

		// Just return all history entries if not searching
		if (!query.normalized) {
			return this.historyService.getHistory().map(editor => this.createAnythingPick(editor, configuration));
		}

		if (!this.configuration.includeHistory) {
			return []; // disabled when searching
		}

		// Perform filtering
		const editorHistoryScorerAccessor = query.containsPathSeparator ? quickPickItemScorerAccessor : this.labelOnlyEditorHistoryPickAccessor; // Only match on label of the editor unless the search includes path separators
		const editorHistoryPicks: Array<IAnythingQuickPickItem> = [];
		for (const editor of this.historyService.getHistory()) {
			const resource = editor.resource;
			if (!resource) {
				continue;
			}

			const editorHistoryPick = this.createAnythingPick(editor, configuration);

			const { score, labelMatch, descriptionMatch } = scoreItemFuzzy(editorHistoryPick, query, false, editorHistoryScorerAccessor, this.pickState.scorerCache);
			if (!score) {
				continue; // exclude editors not matching query
			}

			editorHistoryPick.highlights = {
				label: labelMatch,
				description: descriptionMatch
			};

			editorHistoryPicks.push(editorHistoryPick);
		}

		// Return without sorting if settings tell to sort by recency
		if (this.configuration.historyFilterSortOrder === 'recency') {
			return editorHistoryPicks;
		}

		// Perform sorting
		return editorHistoryPicks.sort((editorA, editorB) => compareItemsByFuzzyScore(editorA, editorB, query, false, editorHistoryScorerAccessor, this.pickState.scorerCache));
	}

	//#endregion


	//#region File Search

	private readonly fileQueryDelayer = this._register(new ThrottledDelayer<URI[]>(AnythingQuickAccessProvider.TYPING_SEARCH_DELAY));

	private readonly fileQueryBuilder: QueryBuilder;

	private createFileQueryCache(): FileQueryCacheState {
		return new FileQueryCacheState(
			cacheKey => this.fileQueryBuilder.file(this.contextService.getWorkspace().folders, this.getFileQueryOptions({ cacheKey })),
			query => this.searchService.fileSearch(query),
			cacheKey => this.searchService.clearCache(cacheKey),
			this.pickState.fileQueryCache
		).load();
	}

	private async getFilePicks(query: IPreparedQuery, excludes: ResourceMap<boolean>, token: CancellationToken): Promise<Array<IAnythingQuickPickItem>> {
		if (!query.normalized) {
			return [];
		}

		// Absolute path result
		const absolutePathResult = await this.getAbsolutePathFileResult(query, token);
		if (token.isCancellationRequested) {
			return [];
		}

		// Use absolute path result as only results if present
		let fileMatches: Array<URI>;
		if (absolutePathResult) {
			if (excludes.has(absolutePathResult)) {
				return []; // excluded
			}

			// Create a single result pick and make sure to apply full
			// highlights to ensure the pick is displayed. Since a
			// ~ might have been used for searching, our fuzzy scorer
			// may otherwise not properly respect the pick as a result
			const absolutePathPick = this.createAnythingPick(absolutePathResult, this.configuration);
			absolutePathPick.highlights = {
				label: [{ start: 0, end: absolutePathPick.label.length }],
				description: absolutePathPick.description ? [{ start: 0, end: absolutePathPick.description.length }] : undefined
			};

			return [absolutePathPick];
		}

		// Otherwise run the file search (with a delayer if cache is not ready yet)
		if (this.pickState.fileQueryCache?.isLoaded) {
			fileMatches = await this.doFileSearch(query, token);
		} else {
			fileMatches = await this.fileQueryDelayer.trigger(async () => {
				if (token.isCancellationRequested) {
					return [];
				}

				return this.doFileSearch(query, token);
			});
		}

		if (token.isCancellationRequested) {
			return [];
		}

		// Filter excludes & convert to picks
		const configuration = this.configuration;
		return fileMatches
			.filter(resource => !excludes.has(resource))
			.map(resource => this.createAnythingPick(resource, configuration));
	}

	private async doFileSearch(query: IPreparedQuery, token: CancellationToken): Promise<URI[]> {
		const [fileSearchResults, relativePathFileResults] = await Promise.all([

			// File search: this is a search over all files of the workspace using the provided pattern
			this.getFileSearchResults(query, token),

			// Relative path search: we also want to consider results that match files inside the workspace
			// by looking for relative paths that the user typed as query. This allows to return even excluded
			// results into the picker if found (e.g. helps for opening compilation results that are otherwise
			// excluded)
			this.getRelativePathFileResults(query, token)
		]);

		if (token.isCancellationRequested) {
			return [];
		}

		// Return quickly if no relative results are present
		if (!relativePathFileResults) {
			return fileSearchResults;
		}

		// Otherwise, make sure to filter relative path results from
		// the search results to prevent duplicates
		const relativePathFileResultsMap = new ResourceMap<boolean>(uri => this.uriIdentityService.extUri.getComparisonKey(uri));
		for (const relativePathFileResult of relativePathFileResults) {
			relativePathFileResultsMap.set(relativePathFileResult, true);
		}

		return [
			...fileSearchResults.filter(result => !relativePathFileResultsMap.has(result)),
			...relativePathFileResults
		];
	}

	private async getFileSearchResults(query: IPreparedQuery, token: CancellationToken): Promise<URI[]> {

		// filePattern for search depends on the number of queries in input:
		// - with multiple: only take the first one and let the filter later drop non-matching results
		// - with single: just take the original in full
		//
		// This enables to e.g. search for "someFile someFolder" by only returning
		// search results for "someFile" and not both that would normally not match.
		//
		let filePattern = '';
		if (query.values && query.values.length > 1) {
			filePattern = query.values[0].original;
		} else {
			filePattern = query.original;
		}

		const fileSearchResults = await this.doGetFileSearchResults(filePattern, token);
		if (token.isCancellationRequested) {
			return [];
		}

		// If we detect that the search limit has been hit and we have a query
		// that was composed of multiple inputs where we only took the first part
		// we run another search with the full original query included to make
		// sure we are including all possible results that could match.
		if (fileSearchResults.limitHit && query.values && query.values.length > 1) {
			const additionalFileSearchResults = await this.doGetFileSearchResults(query.original, token);
			if (token.isCancellationRequested) {
				return [];
			}

			// Remember which result we already covered
			const existingFileSearchResultsMap = new ResourceMap<boolean>(uri => this.uriIdentityService.extUri.getComparisonKey(uri));
			for (const fileSearchResult of fileSearchResults.results) {
				existingFileSearchResultsMap.set(fileSearchResult.resource, true);
			}

			// Add all additional results to the original set for inclusion
			for (const additionalFileSearchResult of additionalFileSearchResults.results) {
				if (!existingFileSearchResultsMap.has(additionalFileSearchResult.resource)) {
					fileSearchResults.results.push(additionalFileSearchResult);
				}
			}
		}

		return fileSearchResults.results.map(result => result.resource);
	}

	private doGetFileSearchResults(filePattern: string, token: CancellationToken): Promise<ISearchComplete> {
		const start = Date.now();
		return this.searchService.fileSearch(
			this.fileQueryBuilder.file(
				this.contextService.getWorkspace().folders,
				this.getFileQueryOptions({
					filePattern,
					cacheKey: this.pickState.fileQueryCache?.cacheKey,
					maxResults: AnythingQuickAccessProvider.MAX_RESULTS
				})
			), token).finally(() => {
				this.logService.trace(`QuickAccess fileSearch ${Date.now() - start}ms`);
			});
	}

	private getFileQueryOptions(input: { filePattern?: string; cacheKey?: string; maxResults?: number }): IFileQueryBuilderOptions {
		return {
			_reason: 'openFileHandler', // used for telemetry - do not change
			extraFileResources: this.instantiationService.invokeFunction(getOutOfWorkspaceEditorResources),
			filePattern: input.filePattern || '',
			cacheKey: input.cacheKey,
			maxResults: input.maxResults || 0,
			sortByScore: true
		};
	}

	private async getAbsolutePathFileResult(query: IPreparedQuery, token: CancellationToken): Promise<URI | undefined> {
		if (!query.containsPathSeparator) {
			return;
		}

		const userHome = await this.pathService.userHome();
		const detildifiedQuery = untildify(query.original, userHome.scheme === Schemas.file ? userHome.fsPath : userHome.path);
		if (token.isCancellationRequested) {
			return;
		}

		const isAbsolutePathQuery = (await this.pathService.path).isAbsolute(detildifiedQuery);
		if (token.isCancellationRequested) {
			return;
		}

		if (isAbsolutePathQuery) {
			const resource = toLocalResource(
				await this.pathService.fileURI(detildifiedQuery),
				this.environmentService.remoteAuthority,
				this.pathService.defaultUriScheme
			);

			if (token.isCancellationRequested) {
				return;
			}

			try {
				const stat = await this.fileService.stat(resource);
				if (stat.isFile) {
					return await this.matchFilenameCasing(resource);
				}
			} catch (error) {
				// ignore if file does not exist
			}
		}

		return;
	}

	private async getRelativePathFileResults(query: IPreparedQuery, token: CancellationToken): Promise<URI[] | undefined> {
		if (!query.containsPathSeparator) {
			return;
		}

		// Convert relative paths to absolute paths over all folders of the workspace
		// and return them as results if the absolute paths exist
		const isAbsolutePathQuery = (await this.pathService.path).isAbsolute(query.original);
		if (!isAbsolutePathQuery) {
			const resources: URI[] = [];
			for (const folder of this.contextService.getWorkspace().folders) {
				if (token.isCancellationRequested) {
					break;
				}

				const resource = toLocalResource(
					folder.toResource(query.original),
					this.environmentService.remoteAuthority,
					this.pathService.defaultUriScheme
				);

				try {
					const stat = await this.fileService.stat(resource);
					if (stat.isFile) {
						resources.push(await this.matchFilenameCasing(resource));
					}
				} catch (error) {
					// ignore if file does not exist
				}
			}

			return resources;
		}

		return;
	}

	/**
	 * Attempts to match the filename casing to file system by checking the parent folder's children.
	 */
	private async matchFilenameCasing(resource: URI): Promise<URI> {
		const parent = dirname(resource);
		const stat = await this.fileService.resolve(parent, { resolveTo: [resource] });
		if (stat?.children) {
			const match = stat.children.find(child => this.uriIdentityService.extUri.isEqual(child.resource, resource));
			if (match) {
				return URI.joinPath(parent, match.name);
			}
		}
		return resource;
	}

	//#endregion

	//#region Command Center (if enabled)

	private readonly lazyRegistry = new Lazy(() => Registry.as<IQuickAccessRegistry>(Extensions.Quickaccess));

	private getHelpPicks(query: IPreparedQuery, token: CancellationToken, runOptions?: AnythingQuickAccessProviderRunOptions): IAnythingQuickPickItem[] {
		if (query.normalized) {
			return []; // If there's a filter, we don't show the help
		}

		type IHelpAnythingQuickPickItem = IAnythingQuickPickItem & { commandCenterOrder: number };
		const providers: IHelpAnythingQuickPickItem[] = this.lazyRegistry.value.getQuickAccessProviders()
			.filter(p => p.helpEntries.some(h => h.commandCenterOrder !== undefined))
			.flatMap(provider => provider.helpEntries
				.filter(h => h.commandCenterOrder !== undefined)
				.map(helpEntry => {
					const providerSpecificOptions: AnythingQuickAccessProviderRunOptions | undefined = {
						...runOptions,
						includeHelp: provider.prefix === AnythingQuickAccessProvider.PREFIX ? false : runOptions?.includeHelp
					};

					const label = helpEntry.commandCenterLabel ?? helpEntry.description;
					return {
						label,
						description: helpEntry.prefix ?? provider.prefix,
						commandCenterOrder: helpEntry.commandCenterOrder!,
						keybinding: helpEntry.commandId ? this.keybindingService.lookupKeybinding(helpEntry.commandId) : undefined,
						ariaLabel: localize('helpPickAriaLabel', "{0}, {1}", label, helpEntry.description),
						accept: () => {
							this.quickInputService.quickAccess.show(provider.prefix, {
								preserveValue: true,
								providerOptions: providerSpecificOptions
							});
						}
					};
				}));

		// TODO: There has to be a better place for this, but it's the first time we are adding a non-quick access provider
		// to the command center, so for now, let's do this.
		if (this.quickChatService.enabled) {
			providers.push({
				label: localize('chat', "Open Quick Chat"),
				commandCenterOrder: 30,
				keybinding: this.keybindingService.lookupKeybinding(ASK_QUICK_QUESTION_ACTION_ID),
				accept: () => this.quickChatService.toggle()
			});
		}

		return providers.sort((a, b) => a.commandCenterOrder - b.commandCenterOrder);
	}

	//#endregion

	//#region Workspace Symbols (if enabled)

	private workspaceSymbolsQuickAccess: SymbolsQuickAccessProvider;

	private async getWorkspaceSymbolPicks(query: IPreparedQuery, includeSymbols: boolean, token: CancellationToken): Promise<Array<IAnythingQuickPickItem>> {
		if (
			!query.normalized ||	// we need a value for search for
			!includeSymbols ||		// we need to enable symbols in search
			this.pickState.lastRange				// a range is an indicator for just searching for files
		) {
			return [];
		}

		// Delegate to the existing symbols quick access
		// but skip local results and also do not score
		return this.workspaceSymbolsQuickAccess.getSymbolPicks(query.original, {
			skipLocal: true,
			skipSorting: true,
			delay: AnythingQuickAccessProvider.TYPING_SEARCH_DELAY
		}, token);
	}

	//#endregion


	//#region Editor Symbols (if narrowing down into a global pick via `@`)

	private readonly editorSymbolsQuickAccess: GotoSymbolQuickAccessProvider;

	private getEditorSymbolPicks(query: IPreparedQuery, disposables: DisposableStore, token: CancellationToken): Promise<Picks<IAnythingQuickPickItem>> | null {
		const filterSegments = query.original.split(GotoSymbolQuickAccessProvider.PREFIX);
		const filter = filterSegments.length > 1 ? filterSegments[filterSegments.length - 1].trim() : undefined;
		if (typeof filter !== 'string') {
			return null; // we need to be searched for editor symbols via `@`
		}

		const activeGlobalPick = this.pickState.lastGlobalPicks?.active;
		if (!activeGlobalPick) {
			return null; // we need an active global pick to find symbols for
		}

		const activeGlobalResource = activeGlobalPick.resource;
		if (!activeGlobalResource || (!this.fileService.hasProvider(activeGlobalResource) && activeGlobalResource.scheme !== Schemas.untitled)) {
			return null; // we need a resource that we can resolve
		}

		if (activeGlobalPick.label.includes(GotoSymbolQuickAccessProvider.PREFIX) || activeGlobalPick.description?.includes(GotoSymbolQuickAccessProvider.PREFIX)) {
			if (filterSegments.length < 3) {
				return null; // require at least 2 `@` if our active pick contains `@` in label or description
			}
		}

		return this.doGetEditorSymbolPicks(activeGlobalPick, activeGlobalResource, filter, disposables, token);
	}

	private async doGetEditorSymbolPicks(activeGlobalPick: IAnythingQuickPickItem, activeGlobalResource: URI, filter: string, disposables: DisposableStore, token: CancellationToken): Promise<Picks<IAnythingQuickPickItem>> {

		// Bring the editor to front to review symbols to go to
		try {

			// we must remember our current view state to be able to restore
			this.pickState.editorViewState.set();

			// open it
			await this.pickState.editorViewState.openTransientEditor({
				resource: activeGlobalResource,
				options: { preserveFocus: true, revealIfOpened: true, ignoreError: true }
			});
		} catch (error) {
			return []; // return if resource cannot be opened
		}

		if (token.isCancellationRequested) {
			return [];
		}

		// Obtain model from resource
		let model = this.modelService.getModel(activeGlobalResource);
		if (!model) {
			try {
				const modelReference = disposables.add(await this.textModelService.createModelReference(activeGlobalResource));
				if (token.isCancellationRequested) {
					return [];
				}

				model = modelReference.object.textEditorModel;
			} catch (error) {
				return []; // return if model cannot be resolved
			}
		}

		// Ask provider for editor symbols
		const editorSymbolPicks = (await this.editorSymbolsQuickAccess.getSymbolPicks(model, filter, { extraContainerLabel: stripIcons(activeGlobalPick.label) }, disposables, token));
		if (token.isCancellationRequested) {
			return [];
		}

		return editorSymbolPicks.map(editorSymbolPick => {

			// Preserve separators
			if (editorSymbolPick.type === 'separator') {
				return editorSymbolPick;
			}

			// Convert editor symbols to anything pick
			return {
				...editorSymbolPick,
				resource: activeGlobalResource,
				description: editorSymbolPick.description,
				trigger: (buttonIndex, keyMods) => {
					this.openAnything(activeGlobalResource, { keyMods, range: editorSymbolPick.range?.selection, forceOpenSideBySide: true });

					return TriggerAction.CLOSE_PICKER;
				},
				accept: (keyMods, event) => this.openAnything(activeGlobalResource, { keyMods, range: editorSymbolPick.range?.selection, preserveFocus: event.inBackground, forcePinned: event.inBackground })
			};
		});
	}

	addDecorations(editor: IEditor, range: IRange): void {
		this.editorSymbolsQuickAccess.addDecorations(editor, range);
	}

	clearDecorations(editor: IEditor): void {
		this.editorSymbolsQuickAccess.clearDecorations(editor);
	}

	//#endregion


	//#region Helpers

	private createAnythingPick(resourceOrEditor: URI | EditorInput | IResourceEditorInput, configuration: { openSideBySideDirection: 'right' | 'down' | undefined }): IAnythingQuickPickItem {
		const isEditorHistoryEntry = !URI.isUri(resourceOrEditor);

		let resource: URI | undefined;
		let label: string;
		let description: string | undefined = undefined;
		let isDirty: boolean | undefined = undefined;
		let extraClasses: string[];
		let icon: ThemeIcon | URI | undefined = undefined;

		if (isEditorInput(resourceOrEditor)) {
			resource = EditorResourceAccessor.getOriginalUri(resourceOrEditor);
			label = resourceOrEditor.getName();
			description = resourceOrEditor.getDescription();
			isDirty = resourceOrEditor.isDirty() && !resourceOrEditor.isSaving();
			extraClasses = resourceOrEditor.getLabelExtraClasses();
			icon = resourceOrEditor.getIcon();
		} else {
			resource = URI.isUri(resourceOrEditor) ? resourceOrEditor : resourceOrEditor.resource;
			const customLabel = this.customEditorLabelService.getName(resource);
			label = customLabel || basenameOrAuthority(resource);
			description = this.labelService.getUriLabel(!!customLabel ? resource : dirname(resource), { relative: true });
			isDirty = this.workingCopyService.isDirty(resource) && !this.filesConfigurationService.hasShortAutoSaveDelay(resource);
			extraClasses = [];
		}

		const labelAndDescription = description ? `${label} ${description}` : label;

		const iconClassesValue = new Lazy(() => getIconClasses(this.modelService, this.languageService, resource, undefined, icon).concat(extraClasses));

		const buttonsValue = new Lazy(() => {
			const openSideBySideDirection = configuration.openSideBySideDirection;
			const buttons: IQuickInputButton[] = [];

			// Open to side / below
			buttons.push({
				iconClass: openSideBySideDirection === 'right' ? ThemeIcon.asClassName(Codicon.splitHorizontal) : ThemeIcon.asClassName(Codicon.splitVertical),
				tooltip: openSideBySideDirection === 'right' ?
					localize({ key: 'openToSide', comment: ['Open this file in a split editor on the left/right side'] }, "Open to the Side") :
					localize({ key: 'openToBottom', comment: ['Open this file in a split editor on the bottom'] }, "Open to the Bottom")
			});

			// Remove from History
			if (isEditorHistoryEntry) {
				buttons.push({
					iconClass: isDirty ? ('dirty-anything ' + ThemeIcon.asClassName(Codicon.circleFilled)) : ThemeIcon.asClassName(Codicon.close),
					tooltip: localize('closeEditor', "Remove from Recently Opened"),
					alwaysVisible: isDirty
				});
			}

			return buttons;
		});

		return {
			resource,
			label,
			ariaLabel: isDirty ? localize('filePickAriaLabelDirty', "{0} unsaved changes", labelAndDescription) : labelAndDescription,
			description,
			get iconClasses() { return iconClassesValue.value; },
			get buttons() { return buttonsValue.value; },
			trigger: (buttonIndex, keyMods) => {
				switch (buttonIndex) {

					// Open to side / below
					case 0:
						this.openAnything(resourceOrEditor, { keyMods, range: this.pickState.lastRange, forceOpenSideBySide: true });

						return TriggerAction.CLOSE_PICKER;

					// Remove from History
					case 1:
						if (!URI.isUri(resourceOrEditor)) {
							this.historyService.removeFromHistory(resourceOrEditor);

							return TriggerAction.REMOVE_ITEM;
						}
				}

				return TriggerAction.NO_ACTION;
			},
			accept: (keyMods, event) => this.openAnything(resourceOrEditor, { keyMods, range: this.pickState.lastRange, preserveFocus: event.inBackground, forcePinned: event.inBackground })
		};
	}

	private async openAnything(resourceOrEditor: URI | EditorInput | IResourceEditorInput, options: { keyMods?: IKeyMods; preserveFocus?: boolean; range?: IRange; forceOpenSideBySide?: boolean; forcePinned?: boolean }): Promise<void> {

		// Craft some editor options based on quick access usage
		const editorOptions: ITextEditorOptions = {
			preserveFocus: options.preserveFocus,
			pinned: options.keyMods?.ctrlCmd || options.forcePinned || this.configuration.openEditorPinned,
			selection: options.range ? Range.collapseToStart(options.range) : undefined
		};

		const targetGroup = options.keyMods?.alt || (this.configuration.openEditorPinned && options.keyMods?.ctrlCmd) || options.forceOpenSideBySide ? SIDE_GROUP : ACTIVE_GROUP;

		// Restore any view state if the target is the side group
		if (targetGroup === SIDE_GROUP) {
			await this.pickState.editorViewState.restore();
		}

		// Open editor (typed)
		if (isEditorInput(resourceOrEditor)) {
			await this.editorService.openEditor(resourceOrEditor, editorOptions, targetGroup);
		}

		// Open editor (untyped)
		else {
			let resourceEditorInput: IResourceEditorInput;
			if (URI.isUri(resourceOrEditor)) {
				resourceEditorInput = {
					resource: resourceOrEditor,
					options: editorOptions
				};
			} else {
				resourceEditorInput = {
					...resourceOrEditor,
					options: {
						...resourceOrEditor.options,
						...editorOptions
					}
				};
			}

			await this.editorService.openEditor(resourceEditorInput, targetGroup);
		}
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/patternInputWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/patternInputWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { Toggle } from '../../../../base/browser/ui/toggle/toggle.js';
import { IContextViewProvider } from '../../../../base/browser/ui/contextview/contextview.js';
import { HistoryInputBox, IInputBoxStyles } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { Widget } from '../../../../base/browser/ui/widget.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter, Event as CommonEvent } from '../../../../base/common/event.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import * as nls from '../../../../nls.js';
import { ContextScopedHistoryInputBox } from '../../../../platform/history/browser/contextScopedHistoryWidget.js';
import { showHistoryKeybindingHint } from '../../../../platform/history/browser/historyWidgetKeybindingHint.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { defaultToggleStyles } from '../../../../platform/theme/browser/defaultStyles.js';

export interface IOptions {
	placeholder?: string;
	showPlaceholderOnFocus?: boolean;
	tooltip?: string;
	width?: number;
	ariaLabel?: string;
	history?: string[];
	inputBoxStyles: IInputBoxStyles;
}

export class PatternInputWidget extends Widget {

	static OPTION_CHANGE: string = 'optionChange';

	inputFocusTracker!: dom.IFocusTracker;

	private width: number;

	private domNode!: HTMLElement;
	protected inputBox!: HistoryInputBox;

	private _onSubmit = this._register(new Emitter<boolean>());
	onSubmit: CommonEvent<boolean /* triggeredOnType */> = this._onSubmit.event;

	private _onCancel = this._register(new Emitter<void>());
	onCancel: CommonEvent<void> = this._onCancel.event;

	constructor(parent: HTMLElement, private contextViewProvider: IContextViewProvider, options: IOptions,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
	) {
		super();
		options = {
			...{
				ariaLabel: nls.localize('defaultLabel', "input")
			},
			...options,
		};
		this.width = options.width ?? 100;

		this.render(options);

		parent.appendChild(this.domNode);
	}

	override dispose(): void {
		super.dispose();
		this.inputFocusTracker?.dispose();
	}

	setWidth(newWidth: number): void {
		this.width = newWidth;
		this.contextViewProvider.layout();
		this.setInputWidth();
	}

	getValue(): string {
		return this.inputBox.value;
	}

	setValue(value: string): void {
		if (this.inputBox.value !== value) {
			this.inputBox.value = value;
		}
	}


	select(): void {
		this.inputBox.select();
	}

	focus(): void {
		this.inputBox.focus();
	}

	inputHasFocus(): boolean {
		return this.inputBox.hasFocus();
	}

	private setInputWidth(): void {
		this.inputBox.width = this.width - this.getSubcontrolsWidth() - 2; // 2 for input box border
	}

	protected getSubcontrolsWidth(): number {
		return 0;
	}

	getHistory(): string[] {
		return this.inputBox.getHistory();
	}

	clearHistory(): void {
		this.inputBox.clearHistory();
	}

	prependHistory(history: string[]): void {
		this.inputBox.prependHistory(history);
	}

	clear(): void {
		this.setValue('');
	}

	onSearchSubmit(): void {
		this.inputBox.addToHistory();
	}

	showNextTerm() {
		this.inputBox.showNextValue();
	}

	showPreviousTerm() {
		this.inputBox.showPreviousValue();
	}

	private render(options: IOptions): void {
		this.domNode = document.createElement('div');
		this.domNode.classList.add('monaco-findInput');
		const history = options.history || [];

		this.inputBox = this._register(new ContextScopedHistoryInputBox(this.domNode, this.contextViewProvider, {
			placeholder: options.placeholder,
			showPlaceholderOnFocus: options.showPlaceholderOnFocus,
			tooltip: options.tooltip,
			ariaLabel: options.ariaLabel,
			validationOptions: {
				validation: undefined
			},
			history: new Set(history),
			showHistoryHint: () => showHistoryKeybindingHint(this.keybindingService),
			inputBoxStyles: options.inputBoxStyles
		}, this.contextKeyService));
		this._register(this.inputBox.onDidChange(() => this._onSubmit.fire(true)));

		this.inputFocusTracker = dom.trackFocus(this.inputBox.inputElement);
		this.onkeyup(this.inputBox.inputElement, (keyboardEvent) => this.onInputKeyUp(keyboardEvent));

		const controls = document.createElement('div');
		controls.className = 'controls';
		this.renderSubcontrols(controls);

		this.domNode.appendChild(controls);
		this.setInputWidth();
	}

	protected renderSubcontrols(_controlsDiv: HTMLDivElement): void {
	}

	private onInputKeyUp(keyboardEvent: IKeyboardEvent) {
		switch (keyboardEvent.keyCode) {
			case KeyCode.Enter:
				this.onSearchSubmit();
				this._onSubmit.fire(false);
				return;
			case KeyCode.Escape:
				this._onCancel.fire();
				return;
		}
	}
}

export class IncludePatternInputWidget extends PatternInputWidget {

	private _onChangeSearchInEditorsBoxEmitter = this._register(new Emitter<void>());
	onChangeSearchInEditorsBox = this._onChangeSearchInEditorsBoxEmitter.event;

	constructor(parent: HTMLElement, contextViewProvider: IContextViewProvider, options: IOptions,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@IKeybindingService keybindingService: IKeybindingService,
	) {
		super(parent, contextViewProvider, options, contextKeyService, configurationService, keybindingService);
	}

	private useSearchInEditorsBox!: Toggle;

	override dispose(): void {
		super.dispose();
		this.useSearchInEditorsBox.dispose();
	}

	onlySearchInOpenEditors(): boolean {
		return this.useSearchInEditorsBox.checked;
	}

	setOnlySearchInOpenEditors(value: boolean) {
		this.useSearchInEditorsBox.checked = value;
		this._onChangeSearchInEditorsBoxEmitter.fire();
	}

	protected override getSubcontrolsWidth(): number {
		return super.getSubcontrolsWidth() + this.useSearchInEditorsBox.width();
	}

	protected override renderSubcontrols(controlsDiv: HTMLDivElement): void {
		this.useSearchInEditorsBox = this._register(new Toggle({
			icon: Codicon.book,
			title: nls.localize('onlySearchInOpenEditors', "Search only in Open Editors"),
			isChecked: false,
			...defaultToggleStyles
		}));
		this._register(this.useSearchInEditorsBox.onChange(viaKeyboard => {
			this._onChangeSearchInEditorsBoxEmitter.fire();
			if (!viaKeyboard) {
				this.inputBox.focus();
			}
		}));
		controlsDiv.appendChild(this.useSearchInEditorsBox.domNode);
		super.renderSubcontrols(controlsDiv);
	}
}

export class ExcludePatternInputWidget extends PatternInputWidget {

	private _onChangeIgnoreBoxEmitter = this._register(new Emitter<void>());
	onChangeIgnoreBox = this._onChangeIgnoreBoxEmitter.event;

	constructor(parent: HTMLElement, contextViewProvider: IContextViewProvider, options: IOptions,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@IKeybindingService keybindingService: IKeybindingService,
	) {
		super(parent, contextViewProvider, options, contextKeyService, configurationService, keybindingService);
	}

	private useExcludesAndIgnoreFilesBox!: Toggle;

	override dispose(): void {
		super.dispose();
		this.useExcludesAndIgnoreFilesBox.dispose();
	}

	useExcludesAndIgnoreFiles(): boolean {
		return this.useExcludesAndIgnoreFilesBox.checked;
	}

	setUseExcludesAndIgnoreFiles(value: boolean) {
		this.useExcludesAndIgnoreFilesBox.checked = value;
		this._onChangeIgnoreBoxEmitter.fire();
	}

	protected override getSubcontrolsWidth(): number {
		return super.getSubcontrolsWidth() + this.useExcludesAndIgnoreFilesBox.width();
	}

	protected override renderSubcontrols(controlsDiv: HTMLDivElement): void {
		this.useExcludesAndIgnoreFilesBox = this._register(new Toggle({
			icon: Codicon.exclude,
			actionClassName: 'useExcludesAndIgnoreFiles',
			title: nls.localize('useExcludesAndIgnoreFilesDescription', "Use Exclude Settings and Ignore Files"),
			isChecked: true,
			...defaultToggleStyles
		}));
		this._register(this.useExcludesAndIgnoreFilesBox.onChange(viaKeyboard => {
			this._onChangeIgnoreBoxEmitter.fire();
			if (!viaKeyboard) {
				this.inputBox.focus();
			}
		}));

		controlsDiv.appendChild(this.useExcludesAndIgnoreFilesBox.domNode);
		super.renderSubcontrols(controlsDiv);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/replace.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/replace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IProgress, IProgressStep } from '../../../../platform/progress/common/progress.js';
import { ISearchTreeFileMatch, ISearchTreeMatch, FileMatchOrMatch } from './searchTreeModel/searchTreeCommon.js';

export const IReplaceService = createDecorator<IReplaceService>('replaceService');

export interface IReplaceService {

	readonly _serviceBrand: undefined;

	/**
	 * Replaces the given match in the file that match belongs to
	 */
	replace(match: ISearchTreeMatch): Promise<any>;

	/**
	 *	Replace all the matches from the given file matches in the files
	 *  You can also pass the progress runner to update the progress of replacing.
	 */
	replace(files: ISearchTreeFileMatch[], progress?: IProgress<IProgressStep>): Promise<any>;

	/**
	 * Opens the replace preview for given file match or match
	 */
	openReplacePreview(element: FileMatchOrMatch, preserveFocus?: boolean, sideBySide?: boolean, pinned?: boolean): Promise<any>;

	/**
	 * Update the replace preview for the given file.
	 * If `override` is `true`, then replace preview is constructed from source model
	 */
	updateReplacePreview(file: ISearchTreeFileMatch, override?: boolean): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/replaceContributions.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/replaceContributions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IReplaceService } from './replace.js';
import { ReplaceService, ReplacePreviewContentProvider } from './replaceService.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';

export function registerContributions(): void {
	registerSingleton(IReplaceService, ReplaceService, InstantiationType.Delayed);
	registerWorkbenchContribution2(ReplacePreviewContentProvider.ID, ReplacePreviewContentProvider, WorkbenchPhase.BlockStartup /* registration only */);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/browser/replaceService.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/browser/replaceService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import * as network from '../../../../base/common/network.js';
import { Disposable, IReference } from '../../../../base/common/lifecycle.js';
import { IReplaceService } from './replace.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ISearchViewModelWorkbenchService } from './searchTreeModel/searchViewModelWorkbenchService.js';
import { IProgress, IProgressStep } from '../../../../platform/progress/common/progress.js';
import { ITextModelService, ITextModelContentProvider } from '../../../../editor/common/services/resolverService.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ScrollType } from '../../../../editor/common/editorCommon.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { createTextBufferFactoryFromSnapshot } from '../../../../editor/common/model/textModel.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { IBulkEditService, ResourceTextEdit } from '../../../../editor/browser/services/bulkEditService.js';
import { Range } from '../../../../editor/common/core/range.js';
import { EditOperation, ISingleEditOperation } from '../../../../editor/common/core/editOperation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { dirname } from '../../../../base/common/resources.js';
import { Promises } from '../../../../base/common/async.js';
import { SaveSourceRegistry } from '../../../common/editor.js';
import { CellUri, IResolvedNotebookEditorModel } from '../../notebook/common/notebookCommon.js';
import { INotebookEditorModelResolverService } from '../../notebook/common/notebookEditorModelResolverService.js';
import { ISearchTreeFileMatch, isSearchTreeFileMatch, ISearchTreeMatch, FileMatchOrMatch, isSearchTreeMatch } from './searchTreeModel/searchTreeCommon.js';
import { isIMatchInNotebook } from './notebookSearch/notebookSearchModelBase.js';

const REPLACE_PREVIEW = 'replacePreview';

const toReplaceResource = (fileResource: URI): URI => {
	return fileResource.with({ scheme: network.Schemas.internal, fragment: REPLACE_PREVIEW, query: JSON.stringify({ scheme: fileResource.scheme }) });
};

const toFileResource = (replaceResource: URI): URI => {
	return replaceResource.with({ scheme: JSON.parse(replaceResource.query)['scheme'], fragment: '', query: '' });
};

export class ReplacePreviewContentProvider implements ITextModelContentProvider, IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.replacePreviewContentProvider';

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITextModelService private readonly textModelResolverService: ITextModelService
	) {
		this.textModelResolverService.registerTextModelContentProvider(network.Schemas.internal, this);
	}

	provideTextContent(uri: URI): Promise<ITextModel> | null {
		if (uri.fragment === REPLACE_PREVIEW) {
			return this.instantiationService.createInstance(ReplacePreviewModel).resolve(uri);
		}
		return null;
	}
}

class ReplacePreviewModel extends Disposable {
	constructor(
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@ITextModelService private readonly textModelResolverService: ITextModelService,
		@IReplaceService private readonly replaceService: IReplaceService,
		@ISearchViewModelWorkbenchService private readonly searchWorkbenchService: ISearchViewModelWorkbenchService
	) {
		super();
	}

	async resolve(replacePreviewUri: URI): Promise<ITextModel> {
		const fileResource = toFileResource(replacePreviewUri);
		const fileMatch = <ISearchTreeFileMatch>this.searchWorkbenchService.searchModel.searchResult.matches(false).filter(match => match.resource.toString() === fileResource.toString())[0];
		const ref = this._register(await this.textModelResolverService.createModelReference(fileResource));
		const sourceModel = ref.object.textEditorModel;
		const sourceModelLanguageId = sourceModel.getLanguageId();
		const replacePreviewModel = this.modelService.createModel(createTextBufferFactoryFromSnapshot(sourceModel.createSnapshot()), this.languageService.createById(sourceModelLanguageId), replacePreviewUri);
		this._register(fileMatch.onChange(({ forceUpdateModel }) => this.update(sourceModel, replacePreviewModel, fileMatch, forceUpdateModel)));
		this._register(this.searchWorkbenchService.searchModel.onReplaceTermChanged(() => this.update(sourceModel, replacePreviewModel, fileMatch)));
		this._register(fileMatch.onDispose(() => replacePreviewModel.dispose())); // TODO@Sandeep we should not dispose a model directly but rather the reference (depends on https://github.com/microsoft/vscode/issues/17073)
		this._register(replacePreviewModel.onWillDispose(() => this.dispose()));
		this._register(sourceModel.onWillDispose(() => this.dispose()));
		return replacePreviewModel;
	}

	private update(sourceModel: ITextModel, replacePreviewModel: ITextModel, fileMatch: ISearchTreeFileMatch, override: boolean = false): void {
		if (!sourceModel.isDisposed() && !replacePreviewModel.isDisposed()) {
			this.replaceService.updateReplacePreview(fileMatch, override);
		}
	}
}

export class ReplaceService implements IReplaceService {

	declare readonly _serviceBrand: undefined;

	private static readonly REPLACE_SAVE_SOURCE = SaveSourceRegistry.registerSource('searchReplace.source', nls.localize('searchReplace.source', "Search and Replace"));

	constructor(
		@ITextFileService private readonly textFileService: ITextFileService,
		@IEditorService private readonly editorService: IEditorService,
		@ITextModelService private readonly textModelResolverService: ITextModelService,
		@IBulkEditService private readonly bulkEditorService: IBulkEditService,
		@ILabelService private readonly labelService: ILabelService,
		@INotebookEditorModelResolverService private readonly notebookEditorModelResolverService: INotebookEditorModelResolverService
	) { }

	replace(match: ISearchTreeMatch): Promise<any>;
	replace(files: ISearchTreeFileMatch[], progress?: IProgress<IProgressStep>): Promise<any>;
	replace(match: FileMatchOrMatch, progress?: IProgress<IProgressStep>, resource?: URI): Promise<any>;
	async replace(arg: any, progress: IProgress<IProgressStep> | undefined = undefined, resource: URI | null = null): Promise<any> {
		const edits = this.createEdits(arg, resource);
		await this.bulkEditorService.apply(edits, { progress });

		const rawTextPromises = edits.map(async e => {
			if (e.resource.scheme === network.Schemas.vscodeNotebookCell) {
				const notebookResource = CellUri.parse(e.resource)?.notebook;
				if (notebookResource) {
					let ref: IReference<IResolvedNotebookEditorModel> | undefined;
					try {
						ref = await this.notebookEditorModelResolverService.resolve(notebookResource);
						await ref.object.save({ source: ReplaceService.REPLACE_SAVE_SOURCE });
					} finally {
						ref?.dispose();
					}
				}
				return;
			} else {
				return this.textFileService.files.get(e.resource)?.save({ source: ReplaceService.REPLACE_SAVE_SOURCE });
			}
		});

		return Promises.settled(rawTextPromises);
	}

	async openReplacePreview(element: FileMatchOrMatch, preserveFocus?: boolean, sideBySide?: boolean, pinned?: boolean): Promise<any> {
		const fileMatch = isSearchTreeMatch(element) ? element.parent() : element;

		const editor = await this.editorService.openEditor({
			original: { resource: fileMatch.resource },
			modified: { resource: toReplaceResource(fileMatch.resource) },
			label: nls.localize('fileReplaceChanges', "{0} ↔ {1} (Replace Preview)", fileMatch.name(), fileMatch.name()),
			description: this.labelService.getUriLabel(dirname(fileMatch.resource), { relative: true }),
			options: {
				preserveFocus,
				pinned,
				revealIfVisible: true
			}
		});
		const input = editor?.input;
		const disposable = fileMatch.onDispose(() => {
			input?.dispose();
			disposable.dispose();
		});
		await this.updateReplacePreview(fileMatch);
		if (editor) {
			const editorControl = editor.getControl();
			if (isSearchTreeMatch(element) && editorControl) {
				editorControl.revealLineInCenter(element.range().startLineNumber, ScrollType.Immediate);
			}
		}
	}

	async updateReplacePreview(fileMatch: ISearchTreeFileMatch, override: boolean = false): Promise<void> {
		const replacePreviewUri = toReplaceResource(fileMatch.resource);
		const [sourceModelRef, replaceModelRef] = await Promise.all([this.textModelResolverService.createModelReference(fileMatch.resource), this.textModelResolverService.createModelReference(replacePreviewUri)]);
		const sourceModel = sourceModelRef.object.textEditorModel;
		const replaceModel = replaceModelRef.object.textEditorModel;
		// If model is disposed do not update
		try {
			if (sourceModel && replaceModel) {
				if (override) {
					replaceModel.setValue(sourceModel.getValue());
				} else {
					replaceModel.undo();
				}
				this.applyEditsToPreview(fileMatch, replaceModel);
			}
		} finally {
			sourceModelRef.dispose();
			replaceModelRef.dispose();
		}
	}

	private applyEditsToPreview(fileMatch: ISearchTreeFileMatch, replaceModel: ITextModel): void {
		const resourceEdits = this.createEdits(fileMatch, replaceModel.uri);
		const modelEdits: ISingleEditOperation[] = [];
		for (const resourceEdit of resourceEdits) {
			modelEdits.push(EditOperation.replaceMove(
				Range.lift(resourceEdit.textEdit.range),
				resourceEdit.textEdit.text)
			);
		}
		replaceModel.pushEditOperations([], modelEdits.sort((a, b) => Range.compareRangesUsingStarts(a.range, b.range)), () => []);
	}

	private createEdits(arg: FileMatchOrMatch | ISearchTreeFileMatch[], resource: URI | null = null): ResourceTextEdit[] {
		const edits: ResourceTextEdit[] = [];

		if (isSearchTreeMatch(arg)) {
			if (!arg.isReadonly) {
				if (isIMatchInNotebook(arg)) {
					// only apply edits if it's not a webview match, since webview matches are read-only
					const match = arg;
					edits.push(this.createEdit(match, match.replaceString, match.cell?.uri));
				} else {
					const match = <ISearchTreeMatch>arg;
					edits.push(this.createEdit(match, match.replaceString, resource));
				}
			}
		}

		if (isSearchTreeFileMatch(arg)) {
			arg = [arg];
		}

		if (arg instanceof Array) {
			arg.forEach(element => {
				const fileMatch = <ISearchTreeFileMatch>element;
				if (fileMatch.count() > 0) {
					edits.push(...fileMatch.matches().flatMap(
						match => this.createEdits(match, resource)
					));
				}
			});
		}
		return edits;
	}

	private createEdit(match: ISearchTreeMatch, text: string, resource: URI | null = null): ResourceTextEdit {
		const fileMatch: ISearchTreeFileMatch = match.parent();
		return new ResourceTextEdit(
			resource ?? fileMatch.resource,
			{ range: match.range(), text }, undefined, undefined
		);
	}
}
```

--------------------------------------------------------------------------------

````

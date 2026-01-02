---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 392
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 392 of 552)

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

---[FILE: src/vs/workbench/contrib/extensions/browser/media/extensionEditor.css]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/media/extensionEditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.extension-editor {
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	margin: 0px auto;
	max-width: 90%;
}

.extension-editor .clickable {
	cursor: pointer;
}

.extension-editor > .header {
	display: flex;
	padding-top: 20px;
	padding-bottom: 12px;
	padding-left: 20px;
	overflow: hidden;
	font-size: 14px;
}

.extension-editor > .header > .icon-container {
	position: relative;
}

.extension-editor > .header > .icon-container .extension-icon .icon {
	height: 128px;
	width: 128px;
}

.extension-editor > .header > .icon-container > .extension-icon .codicon {
	font-size: 128px !important;
}

.extension-editor > .header > .icon-container .extension-icon-badge {
	position: absolute;
	right: 0px;
	top: 88px;
	width: 38px;
	height: 38px;
	line-height: 38px;
	border-radius: 20px;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
}

.extension-editor > .header > .icon-container .extension-icon-badge .codicon {
	color: currentColor;
	font-size: 28px;
}

.extension-editor > .header > .details {
	padding-left: 12px;
	overflow: hidden;
	user-select: text;
	-webkit-user-select: text;
}

.extension-editor > .header > .details > .title {
	display: flex;
	align-items: center;
}

.extension-editor > .header > .details > .title > .name {
	flex: 0;
	font-size: 26px;
	line-height: 30px;
	font-weight: 600;
	white-space: nowrap;
}

.extension-editor > .header > .details > .title > .name.deprecated {
	text-decoration: line-through;
}

.extension-editor > .header > .details > .title > .version {
	margin-left: 10px;
	user-select: text;
	-webkit-user-select: text;
	white-space: nowrap;
}

.extension-editor > .header > .details > .title > .builtin {
	font-size: 10px;
	font-style: italic;
	margin-left: 10px;
}

.extension-editor > .header > .details > .title > .pre-release {
	margin-left: 10px;
	padding: 0px 4px;
	border-radius: 4px;
	background-color: var(--vscode-extensionIcon-preReleaseForeground);
	color: #ffffff;
	display: flex;
	align-items: center;
}

.extension-editor > .header > .details > .title > .pre-release > .codicon.codicon-extensions-pre-release {
	color: #ffffff;
	font-size: 14px;
}

.extension-editor > .header > .details > .title > .pre-release > .pre-release-text {
	font-size: 10px;
	padding-left: 3px;
}

.monaco-workbench.vs .extension-editor > .header > .details > .title > .preview {
	color: white;
}

.extension-editor > .header > .details > .title > .preview {
	background: rgb(214, 63, 38);
	font-size: 10px;
	font-style: italic;
	margin-left: 10px;
	padding: 0px 4px;
	border-radius: 4px;
	user-select: none;
	-webkit-user-select: none;
}

.extension-editor > .header > .details > .subtitle {
	padding-top: 6px;
	white-space: nowrap;
	height: 20px;
	line-height: 20px;
}

.extension-editor > .header > .details > .subtitle .hide {
	display: none;
}

.extension-editor > .header > .details > .subtitle .publisher {
	display: flex;
	align-items: center;
}

.extension-editor > .header > .details > .subtitle .publisher .verified-publisher:not(:empty) {
	margin-left: 4px;
}

.extension-editor > .header > .details > .subtitle,
.extension-editor > .header > .details > .subtitle .extension-kind-indicator,
.extension-editor > .header > .details > .subtitle .install,
.extension-editor > .header > .details > .subtitle .rating,
.extension-editor > .header > .details > .subtitle .license,
.extension-editor > .header > .details > .subtitle .sponsor {
	display: flex;
	align-items: center;
}

.extension-editor > .header > .details > .subtitle .sponsor .codicon {
	padding-right: 3px;
}

.extension-editor > .header > .details > .subtitle .install > .count {
	margin-left: 6px;
}

.extension-editor > .header > .details > .subtitle .extension-kind-indicator > .codicon {
	margin-right: 6px;
}

.extension-editor > .header > .details > .subtitle > .subtitle-entry:not(:empty):not(.last-non-empty) {
	border-right: 1px solid rgba(128, 128, 128, 0.7);
	margin-right: 14px;
	padding-right: 14px;
}

.extension-editor > .header > .details > .description {
	margin-top: 10px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.extension-editor > .header > .details > .actions-status-container {
	margin-top: 10px;
	display: flex;
}

.extension-editor > .header > .details > .actions-status-container.list-layout {
	display: inherit;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar {
	text-align: initial;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item {
	margin-right: 0;
	overflow: hidden;
	flex-shrink: 0;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item.disabled {
	min-width: 0;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item .extension-action {
	margin-bottom: 2px;
	/* margin for outline */
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item > .extension-action:not(.icon) {
	margin-left: 2px;
	/* margin for outline */
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item.action-dropdown-item > .monaco-dropdown .extension-action.action-dropdown {
	margin-right: 2px;
	/* margin for outline */
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item:not(.checkbox-action-item) .extension-action:not(.icon) {
	padding-top: 0;
	padding-bottom: 0;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item > .extension-action,
.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item.action-dropdown-item > .monaco-dropdown .extension-action.action-dropdown {
	line-height: 22px;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item.action-dropdown-item,
.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item.checkbox-action-item,
.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item:not(.action-dropdown-item):not(.checkbox-action-item) > .extension-action {
	margin-right: 6px;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item.checkbox-action-item > .extension-action {
	height: 18px;
	width: 18px;
	margin-top: 2px;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item > .extension-action.label,
.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item.action-dropdown-item .extension-action.label {
	font-weight: 600;
	max-width: 300px;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item.action-dropdown-item > .action-dropdown-item-separator {
	height: 22px;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item.action-dropdown-item > .action-dropdown-item-separator > div {
	height: 16px;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item.action-dropdown-item.empty > .extension-action.label {
	margin-right: 2px;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item.action-dropdown-item.empty > .action-dropdown-item-separator {
	display: none;
}

/* single install */
.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item > .extension-action.label,
.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item.action-dropdown-item.empty > .extension-action.label {
	border-radius: 2px;
}

/* split install */
.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item.action-dropdown-item:not(.empty) > .extension-action.label {
	border-radius: 2px 0 0 2px;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item.action-dropdown-item:not(.empty) > .monaco-dropdown .extension-action.label {
	border-left-width: 0;
	border-radius: 0 2px 2px 0;
	padding: 0 2px;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar > .actions-container > .action-item > .action-label.extension-status {
	margin-right: 0;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar .action-item .action-label.extension-status-label,
.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar .action-item .action-label.disable-status {
	font-weight: normal;
}

.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar .action-item .action-label.extension-status-label:hover,
.extension-editor > .header > .details > .actions-status-container > .monaco-action-bar .action-item .action-label.disable-status:hover {
	opacity: 0.9;
}

.extension-editor > .header > .details > .actions-status-container > .status {
	line-height: 22px;
	font-size: 90%;
	margin-top: 3px;
}

.extension-editor > .header > .details > .actions-status-container.list-layout > .status {
	margin-top: 5px;
}

.extension-editor > .header > .details > .actions-status-container > .status .codicon {
	vertical-align: text-bottom;
}

.extension-editor > .header > .details > .pre-release-text p,
.extension-editor > .header > .details > .actions-status-container > .status p {
	margin-top: 0px;
	margin-bottom: 0px;
}

.extension-editor > .body > .content > .details > .additional-details-container .more-info-container > .more-info > .more-info-entry > .link {
	cursor: pointer;
}

.extension-editor > .body > .content > .details > .additional-details-container .more-info-container > .more-info > .more-info-entry > .more-info-entry-name {
	overflow: hidden;
	text-overflow: ellipsis;
}

.extension-editor > .body > .content > .details > .additional-details-container .more-info-container > .more-info > .more-info-entry > .link,
.extension-editor > .header > .details > .pre-release-text a,
.extension-editor > .header > .details > .actions-status-container > .status a {
	color: var(--vscode-textLink-foreground)
}

.extension-editor > .body > .content > .details > .additional-details-container .more-info-container > .more-info > .more-info-entry .link:hover,
.extension-editor > .header > .details > .pre-release-text a:hover,
.extension-editor > .header > .details > .actions-status-container > .status a:hover {
	text-decoration: underline;
	color: var(--vscode-textLink-activeForeground)
}

.extension-editor > .header > .details > .pre-release-text a:active,
.extension-editor > .header > .details > .actions-status-container > .status a:active {
	color: var(--vscode-textLink-activeForeground)
}

.extension-editor > .header > .details > .pre-release-text:not(:empty) {
	margin-top: 5px;
	display: flex;
	font-size: 90%;
}

.extension-editor > .header > .details > .recommendation {
	display: flex;
	margin-top: 5px;
}

.extension-editor > .header > .details > .recommendation .codicon {
	font-size: inherit;
	margin-right: 5px;
}

.extension-editor > .header > .details > .recommendation .recommendation-text {
	vertical-align: text-bottom;
	font-size: 90%;
}

.extension-editor > .body {
	flex: 1;
	overflow: hidden;
}

.extension-editor > .body > .navbar {
	height: 36px;
	font-weight: bold;
	font-size: 14px;
	line-height: 36px;
	padding-left: 20px;
	border-bottom: 1px solid var(--vscode-panelSection-border);
}

.extension-editor > .body > .navbar > .monaco-action-bar > .actions-container {
	justify-content: initial;
}

.extension-editor > .body > .navbar > .monaco-action-bar > .actions-container > .action-item {
	height: 100%;
}

.extension-editor > .body > .navbar > .monaco-action-bar > .actions-container > .action-item > .action-label {
	padding: 0 10px;
	font-size: 11px;
	font-weight: normal;
	color: var(--vscode-panelTitle-inactiveForeground);
	text-transform: uppercase;
	background: none !important;
	border-radius: 0px !important;
}

.extension-editor > .body > .navbar > .monaco-action-bar > .actions-container > .action-item > .action-label.checked {
	border-bottom: 1px solid var(--vscode-panelTitle-activeBorder);
	color: var(--vscode-panelTitle-activeForeground);
}

.extension-editor > .body > .navbar > .monaco-action-bar > .actions-container > .action-item > .action-label:hover {
	color: var(--vscode-panelTitle-activeForeground);
}

.extension-editor > .body > .content {
	height: calc(100% - 37px); /* Correct height so that it is not on top of bottom panel #231439 */
	position: relative;
	overflow: hidden;
	user-select: text;
	-webkit-user-select: text;
}

.extension-editor > .body > .content.loading {
	background: url('loading.svg') center center no-repeat;
}

.extension-editor > .body > .content > .monaco-scrollable-element {
	height: 100%;
}

.extension-editor > .body > .content > .nocontent {
	margin-left: 20px;
}

.extension-editor > .body > .content > .details {
	height: 100%;
	display: flex;
}

.extension-editor > .body > .content > .details > .readme-container {
	margin: 0px auto;
	max-width: 75%;
	height: 100%;
	flex: 1;
}

.extension-editor > .body > .content > .details.narrow > .readme-container {
	margin: inherit;
	max-width: inherit;
}

.extension-editor > .body > .content > .details > .additional-details-container {
	width: 25%;
	min-width: 175px;
	height: 100%;
}

.extension-editor > .body > .content > .details.narrow > .additional-details-container {
	display: none;
}

.extension-editor > .body > .content > .details > .additional-details-container > .monaco-scrollable-element {
	height: 100%;
}

.extension-editor > .body > .content > .details > .additional-details-container > .monaco-scrollable-element > .additional-details-content {
	height: 100%;
	overflow-y: scroll;
	padding: 12px;
	box-sizing: border-box;
}

.extension-editor > .body > .content > .details > .additional-details-container .additional-details-element:not(:first-child) {
	padding-top: 16px;
}

.extension-editor > .body > .content > .details > .additional-details-container .additional-details-element {
	padding-bottom: 16px;
}

.extension-editor > .body > .content > .details > .additional-details-container .additional-details-element:not(:last-child) {
	border-bottom: 1px solid rgba(128, 128, 128, 0.22);
}

.extension-editor > .body > .content > .details > .additional-details-container .additional-details-element > .additional-details-title {
	font-size: 120%;
	padding-bottom: 12px;
}

.extension-editor > .body > .content > .details > .additional-details-container .categories-container > .categories > .category {
	display: inline-block;
	border: 1px solid rgba(136, 136, 136, 0.45);
	padding: 2px 4px;
	border-radius: 2px;
	font-size: 90%;
	margin: 0px 6px 3px 0px;
}

.extension-editor > .body > .content > .details > .additional-details-container .resources-container > .resources > .resource {
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 2px 4px;
}

.extension-editor > .body > .content > .details > .additional-details-container .resources-container > .resources > .resource a {
	padding-left: 4px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	text-decoration: var(--text-link-decoration);
}

.extension-editor > .body > .content > .details > .additional-details-container .resources-container > .resources > .resource:hover a {
	text-decoration: underline;
}

.extension-editor > .body > .content > .details > .additional-details-container .more-info-container > .more-info > .more-info-entry {
	font-size: 90%;
	display: grid;
	grid-template-columns: 40% 60%;
	gap: 6px;
	padding: 2px 4px;
}

.extension-editor > .body > .content > .details > .additional-details-container .more-info-container > .more-info > .more-info-entry:nth-child(odd) {
	background-color: rgba(130, 130, 130, 0.04);
}

.extension-editor > .body > .content > .details > .additional-details-container .more-info-container > .more-info > .more-info-entry code {
	background-color: transparent;
	padding: 0px;
}

.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme {
	height: 100%;
}

.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme > .extension-pack {
	height: 224px;
	padding-left: 20px;
}

.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme.one-row > .extension-pack {
	height: 142px;
}

.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme.two-rows > .extension-pack {
	height: 224px;
}

.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme.three-rows > .extension-pack {
	height: 306px;
}

.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme.more-rows > .extension-pack {
	height: 326px;
}

.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme.one-row > .readme-content {
	height: calc(100% - 142px);
}

.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme.two-rows > .readme-content {
	height: calc(100% - 224px);
}

.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme.three-rows > .readme-content {
	height: calc(100% - 306px);
}

.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme.more-rows > .readme-content {
	height: calc(100% - 326px);
}

.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme > .extension-pack > .header,
.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme > .extension-pack > .footer {
	margin-bottom: 10px;
	margin-right: 30px;
	font-weight: bold;
	font-size: 120%;
	border-bottom: 1px solid rgba(128, 128, 128, 0.22);
	padding: 4px 6px;
	line-height: 22px;
}

.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme > .extension-pack > .extension-pack-content {
	height: calc(100% - 60px);
}

.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme > .extension-pack > .extension-pack-content > .monaco-scrollable-element {
	height: 100%;
}

.extension-editor > .body > .content > .details > .readme-container > .extension-pack-readme > .extension-pack > .extension-pack-content > .monaco-scrollable-element > .subcontent {
	height: 100%;
	overflow-y: scroll;
	box-sizing: border-box;
}

.extension-editor > .body > .content > .monaco-scrollable-element > .subcontent {
	height: 100%;
	padding: 20px;
	overflow-y: scroll;
	box-sizing: border-box;
}

.extension-editor > .body > .content table {
	width: 100%;
	border-spacing: 0;
	border-collapse: separate;
}

.extension-editor > .body > .content details:not(:first-child) {
	margin-top: 20px;
}

.extension-editor > .body > .content details > summary {
	cursor: pointer;
	margin-bottom: 10px;
	font-weight: bold;
	font-size: 120%;
	border-bottom: 1px solid rgba(128, 128, 128, 0.22);
	padding: 3px 6px;
	line-height: 22px;
}

.extension-editor > .body > .content table tr:nth-child(odd) {
	background-color: rgba(130, 130, 130, 0.04);
}

.extension-editor > .body > .content table tr:not(:first-child):hover {
	background-color: rgba(128, 128, 128, 0.15);
}

.extension-editor > .body > .content table th,
.extension-editor > .body > .content table td {
	padding: 2px 16px 2px 4px;
}

.extension-editor > .body > .content table td {
	vertical-align: top;
}

.extension-editor > .body > .content table th:last-child,
.extension-editor > .body > .content table td:last-child {
	padding: 2px 4px;
}

.extension-editor > .body > .content table th {
	text-align: left;
	word-break: keep-all;
}

.extension-editor > .body > .content table td > div,
.extension-editor > .body > .content table td > div > p {
	padding: 0px;
	margin: 0px;
}

.extension-editor code:not(:empty) {
	font-family: var(--monaco-monospace-font);
	font-size: 90%;
	background-color: rgba(128, 128, 128, 0.17);
	border-radius: 4px;
	padding: 1px 4px;
}

.extension-editor > .body > .content table .colorBox {
	box-sizing: border-box;
	width: 0.8em;
	height: 0.8em;
	display: inline-block;
	border-width: 0.1em;
	border-style: solid;
	border-color: rgb(0, 0, 0);
	margin: 0em 0.2em;
	vertical-align: middle;
}

.monaco-workbench.vs-dark .extension-editor > .body > .content table .colorBox,
.monaco-workbench.hc-black .extension-editor > .body > .content table .colorBox {
	border-color: rgb(238, 238, 238);
}

.extension-editor .subcontent .monaco-list-row .content .unknown-extension {
	line-height: 62px;
}

.extension-editor .subcontent .monaco-list-row .content .unknown-extension > .error-marker {
	background-color: #BE1100;
	padding: 2px 4px;
	font-weight: bold;
	font-size: 11px;
	color: #CCC;
}

.extension-editor .subcontent .monaco-list-row .unknown-extension > .message {
	padding-left: 10px;
	font-weight: bold;
	font-size: 14px;
}

.extension-editor .subcontent .monaco-list-row .extension {
	display: flex;
	align-items: center;
}

.extension-editor .subcontent .monaco-list-row .extension > .details {
	flex: 1;
	overflow: hidden;
	padding-left: 10px;
}

.extension-editor .subcontent .monaco-list-row .extension > .details > .header {
	display: flex;
	align-items: center;
	line-height: 19px;
	overflow: hidden;
}

.extension-editor .subcontent .monaco-list-row .extension > .icon {
	height: 40px;
	width: 40px;
	object-fit: contain;
}

.extension-editor .subcontent .monaco-list-row .extension > .details > .header > .name {
	font-weight: bold;
	font-size: 16px;
}

.extension-editor .subcontent .monaco-list-row .extension > .details > .header > .name:hover {
	text-decoration: underline;
}

.extension-editor .subcontent .monaco-list-row .extension > .details > .header > .identifier {
	font-size: 90%;
	opacity: 0.6;
	margin-left: 10px;
	background: rgba(173, 173, 173, 0.31);
	padding: 0px 4px;
	border-radius: 4px;
}

.extension-editor .subcontent .monaco-list-row .extension > .details > .footer {
	display: flex;
	line-height: 19px;
	overflow: hidden;
	padding-top: 5px;
}

.extension-editor .subcontent .monaco-list-row .extension > .details > .footer .publisher {
	font-size: 90%;
	font-weight: 600;
	opacity: 0.6;
}

.extension-editor .extensions-grid-view {
	display: flex;
	flex-wrap: wrap;
}

.extension-editor .extensions-grid-view > .extension-container {
	width: 350px;
	margin: 0 10px 20px 0;
}

.extension-editor .extensions-grid-view .extension-list-item {
	cursor: default;
}

.extension-editor .extensions-grid-view .extension-list-item > .details .header > .name {
	cursor: pointer;
}

.extension-editor .extensions-grid-view .extension-list-item > .details > .header-container > .header > .version,
.extension-editor .extensions-grid-view .extension-list-item > .details > .header-container > .header > .ratings,
.extension-editor .extensions-grid-view .extension-list-item > .details > .header-container > .header > .install-count {
	display: none;
}

.extension-editor .extensions-grid-view > .extension-container:focus > .extension-list-item > .details .header > .name,
.extension-editor .extensions-grid-view > .extension-container:hover > .extension-list-item > .details .header > .name {
	text-decoration: underline;
}

.monaco-workbench.vs .extension-editor .extensions-grid-view > .extension-container.disabled > .extension-list-item > .icon-container > .extension-icon .icon,
.monaco-workbench.vs-dark .extension-editor .extensions-grid-view > .extension-container.disabled > .extension-list-item > .icon-container > .extension-icon .icon,
.monaco-workbench.vs .extension-editor .extensions-grid-view > .extension-container.disabled > .extension-list-item > .details > .header-container .codicon,
.monaco-workbench.vs-dark .extension-editor .extensions-grid-view > .extension-container.disabled > .extension-list-item > .details > .header-container .codicon {
	opacity: 0.5;
}

.extension-editor > .body > .content .runtime-status .activation-details > .activation-element-entry > .activation-message-title {
	padding-right: 10px;
}

.extension-editor > .body > .content .runtime-status .message-entry {
	display: flex;
	align-items: center;
	margin: 5px;
}

.extension-editor > .body > .content .runtime-status .message-entry .codicon {
	padding-right: 2px;
}

.monaco-workbench .extension-editor > .header > .details > .recommendation .codicon {
	color: var(--vscode-extensionButton-prominentBackground);
}

/* Features Tab */

.extension-editor .subcontent.feature-contributions {
	margin-top: 14px;
}

.extension-editor .subcontent.feature-contributions .features-list-container {
	height: 100%;
}

.extension-editor .subcontent.feature-contributions .features-list-container > .features-list-wrapper {
	height: 100%;
	padding-left: 24px;
}

.extension-editor .subcontent.feature-contributions .features-list-container > .features-list-wrapper .monaco-list-row.extension-feature-list-item {
	padding-left: 10px;
	padding-right: 10px;
	display: flex;
	align-items: center;
}

.extension-editor .subcontent.feature-contributions .features-list-container > .features-list-wrapper .monaco-list-row.extension-feature-list-item .extension-feature-label {
	flex: 1;
}

.extension-editor .subcontent.feature-contributions .features-list-container > .features-list-wrapper .monaco-list-row.extension-feature-list-item .extension-feature-disabled-label {
	opacity: 0.8;
	font-size: 12px;
}

.extension-editor .subcontent.feature-contributions .features-list-container > .features-list-wrapper .monaco-list-row.extension-feature-list-item .extension-feature-status {
	padding-left: 5px;
}

.extension-editor .subcontent.feature-contributions .feature-view-container {
	height: 100%;
}

.extension-editor .subcontent.feature-contributions .extension-feature-content .feature-body-content .feature-description {
	margin-bottom: 10px;
}

.extension-editor .subcontent.feature-contributions .extension-feature-content {
	padding-left: 24px;
	height: 100%;
	box-sizing: border-box;
}

.extension-editor .subcontent.feature-contributions .extension-feature-content .feature-header {
	margin: 0 10px 10px 0;
	display: flex;
	line-height: 20px;
	align-items: center;
}

.extension-editor .subcontent.feature-contributions .extension-feature-content .feature-header > .feature-title {
	font-size: 26px;
	display: inline-block;
	margin: 0px;
	font-weight: 600;
	height: 100%;
	box-sizing: border-box;
	padding: 10px;
	padding-left: 0px;
	flex: 1;
	position: relative;
	overflow: hidden;
	text-overflow: ellipsis;
}

.extension-editor .subcontent.feature-contributions .feature-view-container .extension-feature-content .feature-body {
	height: calc(100% - 50px);
}

.extension-editor .subcontent.feature-contributions .feature-view-container .extension-feature-content .monaco-scrollable-element {
	height: 100%;
}

.extension-editor .subcontent.feature-contributions .feature-view-container .extension-feature-content .feature-body .feature-body-content {
	height: 100%;
	box-sizing: border-box;
	overflow-y: scroll;
}

.extension-editor .subcontent.feature-contributions .extension-feature-content .feature-body .feature-body-content .feature-status {
	display: flex;
	align-items: center;
}

.extension-editor .subcontent.feature-contributions .extension-feature-content .feature-body .feature-body-content .feature-content.markdown .codicon {
	vertical-align: sub;
}

.extension-editor .subcontent.feature-contributions .extension-feature-content .feature-chart-container {
	margin: 20px 0;
}

.extension-editor .subcontent.feature-contributions .extension-feature-content .feature-chart-container > .feature-chart {
	display: inline-block;
	padding: 20px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/media/extensionManagement.css]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/media/extensionManagement.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.rendered-markdown.extensions-management-publisher-trust-dialog .codicon {
	vertical-align: sub;
}

.rendered-markdown.extensions-management-publisher-trust-dialog .codicon.codicon-extensions-verified-publisher {
	color: var(--vscode-extensionIcon-verifiedForeground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/media/extensionsViewlet.css]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/media/extensionsViewlet.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.extensions-viewlet {
	position: relative;
	height: 100%;
}

.extensions-viewlet .hidden {
	display: none !important;
	visibility: hidden;
}

.extensions-viewlet > .overlay {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 2;
}

.extensions-viewlet > .header {
	height: 41px;
	box-sizing: border-box;
	padding: 5px 12px 6px 20px;
}

.extensions-viewlet > .header  > .extensions-search-container {
	position: relative;
}

.extensions-viewlet > .header  > .extensions-search-container >  .search-box {
	width: 100%;
	height: 28px;
	line-height: 18px;
	box-sizing: border-box;
	padding: 4px;
	border: 1px solid transparent;
	-webkit-appearance: textfield;
	-moz-appearance: textfield;
}

.extensions-viewlet > .header  > .extensions-search-container >  .extensions-search-actions-container {
	display: flex;
	align-items: center;
	position: absolute;
	top: 0;
	right: 0;
	height: 100%;
}

.extensions-viewlet > .header > .notification-container {
	margin-top: 10px;
	display: flex;
	justify-content: space-between;
}

.extensions-viewlet > .header .notification-container .message-container {
	padding-left: 4px;
}

.extensions-viewlet > .header .notification-container .message-container .codicon {
	vertical-align: text-top;
	padding-right: 5px;
}

.extensions-viewlet .notification-container .message-text-action {
	cursor: pointer;
	margin-left: 5px;
	color: var(--vscode-textLink-foreground);
	text-decoration: underline;
}

.extensions-viewlet .notification-container .message-text-action:hover,
.extensions-viewlet .notification-container .message-text-action:active {
	color: var(--vscode-textLink-activeForeground);
}

.extensions-viewlet .notification-container .message-action {
	cursor: pointer;
	padding: 2px;
	border-radius: 5px;
	height: 16px;
}

.extensions-viewlet .notification-container .message-action:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
	outline: 1px dashed var(--vscode-toolbar-hoverOutline);
}

.extensions-viewlet > .extensions {
	height: calc(100% - 41px);
}

.extensions-viewlet > .extensions .extension-list-item .monaco-action-bar,
.extensions-viewlet > .extensions .extension-view-header .monaco-action-bar {
	margin-right: 4px;
}

.extensions-viewlet > .extensions .extension-view-header .count-badge-wrapper {
	margin-right: 12px;
}

.extensions-viewlet > .extensions .extension-view-header .monaco-action-bar .action-item > .action-label.icon.codicon {
	vertical-align: middle;
	line-height: 22px;
}

.extensions-viewlet > .extensions .extension-view-header .monaco-action-bar .action-item.disabled  {
	display: none;
}

.extensions-viewlet > .extensions .panel-header {
	padding-right: 12px;
}

.extensions-viewlet > .extensions .panel-header > .title {
	flex: 1;
}

.extensions-viewlet > .extensions .panel-header > .actions.show {
	flex: inherit;
}

.extensions-viewlet > .extensions .message-container {
	padding: 5px 9px 5px 20px;
	cursor: default;
	display: flex;
}

.extensions-viewlet > .extensions .message-container .message {
	padding-left: 5px;
}

.extensions-viewlet > .extensions .message-container .severity-icon {
	flex-shrink: 0;
}

.extensions-viewlet > .extensions .extension-list-item {
	position: absolute;
}

.extensions-viewlet > .extensions .extension-list-item.loading {
	background: url('loading.svg') center center no-repeat;
}

.monaco-workbench.vs-dark .extensions-viewlet > .extensions .extension-list-item.loading {
	background-image: url('loading-dark.svg');
}

.monaco-workbench.hc-black .extensions-viewlet > .extensions .extension-list-item.loading {
	background-image: url('loading-hc.svg');
}

.extensions-viewlet > .extensions .extension-list-item.loading > .icon-container {
	display: none;
}
.extensions-viewlet.narrow > .extensions .extension-list-item > .icon-container {
	display: flex;
	align-items: flex-start;
	padding-top: 10px;
}
.extensions-viewlet.narrow > .extensions .extension-list-item > .icon-container > .extension-icon .icon {
	width: 24px;
	height: 24px;
	padding-right: 8px;
}
.extensions-viewlet.narrow > .extensions .extension-list-item > .icon-container > .extension-icon .codicon {
	font-size: 24px !important;
	padding-right: 8px;
}

.extensions-viewlet.narrow > .extensions .extension-list-item > .icon-container .extension-badge,
.extensions-viewlet.mini > .extensions .extension-list-item > .icon-container,
.extensions-viewlet.mini > .extensions .extension-list-item > .details > .header-container > .header > .ratings,
.extensions-viewlet.mini > .extensions .extension-bookmark-container {
	display: none;
}

.extensions-viewlet.narrow > .extensions .extension-list-item > .details > .footer > .monaco-action-bar > .actions-container .extension-action {
	max-width: 100px;
}

.monaco-workbench.vs .extensions-viewlet > .extensions .monaco-list-row.disabled:not(.selected) > .extension-list-item > .icon-container > .extension-icon .icon,
.monaco-workbench.vs-dark .extensions-viewlet > .extensions .monaco-list-row.disabled:not(.selected) > .extension-list-item > .icon-container > .extension-icon .icon,
.monaco-workbench.vs .extensions-viewlet > .extensions .monaco-list-row.disabled:not(.selected) > .extension-list-item > .details > .header-container .codicon,
.monaco-workbench.vs-dark .extensions-viewlet > .extensions .monaco-list-row.disabled:not(.selected) > .extension-list-item > .details > .header-container .codicon {
	opacity: 0.5;
}

.extensions-viewlet .codicon-error::before {
	color: var(--vscode-editorError-foreground);
}

.extensions-viewlet .codicon-warning::before {
	color: var(--vscode-editorWarning-foreground);
}

.extensions-viewlet .codicon-info::before {
	color: var(--vscode-editorInfo-foreground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/media/extensionsWidgets.css]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/media/extensionsWidgets.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.extension-icon .icon {
	width: 42px;
	height: 42px;
	padding-right: 14px;
	flex-shrink: 0;
	object-fit: contain;
}

.extension-icon .codicon {
	padding-right: 14px;
	font-size: 42px !important;
}

.extension-sync-ignored.hide {
	display: none;
}

.extension-ratings {
	display: inline-block;
}

.extension-ratings.small {
	font-size: 80%;
}

.extension-ratings > .codicon[class*='codicon-extensions-rating']:not(:first-child) {
	margin-left: 3px;
}

.extension-ratings > .count {
	margin-left: 6px;
}

.extension-ratings.small > .count {
	margin-left: 0;
}

.extension-ratings .codicon-extensions-star-empty {
	opacity: .75;
}

.verified-publisher {
	display: flex;
	align-items: center;
}

.verified-publisher > .extension-verified-publisher-domain {
	padding-left: 2px;
	color: var(--vscode-extensionIcon-verifiedForeground);
	text-decoration: var(--text-link-decoration);
}

.extension-bookmark {
	display: inline-block;
	height: 20px;
	width: 20px;
}

.extension-bookmark > .recommendation,
.extension-bookmark > .pre-release {
	border-right: 20px solid transparent;
	border-top: 20px solid;
	box-sizing: border-box;
	position: relative;
}

.extension-bookmark > .pre-release {
	border-top-color: var(--vscode-extensionIcon-preReleaseForeground);
	color: #ffffff;
}

.extension-bookmark > .recommendation > .codicon,
.extension-bookmark > .pre-release > .codicon {
	position: absolute;
	bottom: 9px;
	left: 1px;
	color: inherit;
	font-size: 80% !important;
}

.extension-bookmark .recommendation {
	border-top-color: var(--vscode-extensionButton-prominentBackground);
	color: var(--vscode-extensionButton-prominentForeground);
}

.hc-black .extension-bookmark .recommendation,
.hc-light .extension-bookmark .recommendation,
.hc-black .extension-bookmark .pre-release,
.hc-light .extension-bookmark .pre-release {
	border-top-color: var(--vscode-contrastBorder);
	color: var(--vscode-editor-background);
}

.hc-black .extension-bookmark .recommendation .codicon,
.hc-light .extension-bookmark .recommendation .codicon,
.hc-black .extension-bookmark .pre-release .codicon,
.hc-light .extension-bookmark .pre-release .codicon {
	color: var(--vscode-editor-background);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/media/language-icon.svg]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/media/language-icon.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><title>Market_LanguageGeneric</title><path d="M14.315,11H1.685a6.912,6.912,0,0,1,0-6h12.63a6.912,6.912,0,0,1,0,6Z" fill="#fff"/><path d="M8,0a8,8,0,1,0,8,8A8.009,8.009,0,0,0,8,0ZM8,1a6.993,6.993,0,0,1,5.736,3H2.264A6.991,6.991,0,0,1,8,1ZM8,15a6.991,6.991,0,0,1-5.736-3H13.736A6.993,6.993,0,0,1,8,15Zm6.315-4H1.685a6.912,6.912,0,0,1,0-6h12.63a6.912,6.912,0,0,1,0,6Z" fill="#2b2b2b"/><path d="M8,1a6.993,6.993,0,0,1,5.736,3H2.264A6.991,6.991,0,0,1,8,1ZM8,15a6.991,6.991,0,0,1-5.736-3H13.736A6.993,6.993,0,0,1,8,15Z" fill="#ff8c00"/><path d="M8,0a8,8,0,1,0,8,8A8.009,8.009,0,0,0,8,0ZM8,1a6.993,6.993,0,0,1,5.736,3H2.264A6.991,6.991,0,0,1,8,1ZM8,15a6.991,6.991,0,0,1-5.736-3H13.736A6.993,6.993,0,0,1,8,15Zm6.315-4H1.685a6.912,6.912,0,0,1,0-6h12.63a6.912,6.912,0,0,1,0,6Z" fill="#2b2b2b"/><path d="M8,1a6.993,6.993,0,0,1,5.736,3H2.264A6.991,6.991,0,0,1,8,1ZM8,15a6.991,6.991,0,0,1-5.736-3H13.736A6.993,6.993,0,0,1,8,15Z" fill="#767676"/><path d="M5.783,6.783,4.565,8,5.783,9.217l-.566.566L3.435,8,5.217,6.217Zm5-.566-.566.566L11.435,8,10.217,9.217l.566.566L12.565,8Zm-4.14,3.6.714.358,2-4-.714-.358Z" fill="#2b2b2b"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/media/loading-dark.svg]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/media/loading-dark.svg

```text
<?xml version='1.0' standalone='no' ?>
<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='10px' height='10px'>
	<style>
    circle {
      animation: ball 0.6s linear infinite;
    }

    circle:nth-child(2) { animation-delay: 0.075s; }
    circle:nth-child(3) { animation-delay: 0.15s; }
    circle:nth-child(4) { animation-delay: 0.225s; }
    circle:nth-child(5) { animation-delay: 0.3s; }
    circle:nth-child(6) { animation-delay: 0.375s; }
    circle:nth-child(7) { animation-delay: 0.45s; }
    circle:nth-child(8) { animation-delay: 0.525s; }

    @keyframes ball {
      from { opacity: 1; }
      to { opacity: 0.3; }
    }
	</style>
	<g style="fill:grey;">
		<circle cx='5' cy='1' r='1' style='opacity:0.3;' />
		<circle cx='7.8284' cy='2.1716' r='1' style='opacity:0.3;' />
		<circle cx='9' cy='5' r='1' style='opacity:0.3;' />
		<circle cx='7.8284' cy='7.8284' r='1' style='opacity:0.3;' />
		<circle cx='5' cy='9' r='1' style='opacity:0.3;' />
		<circle cx='2.1716' cy='7.8284' r='1' style='opacity:0.3;' />
		<circle cx='1' cy='5' r='1' style='opacity:0.3;' />
		<circle cx='2.1716' cy='2.1716' r='1' style='opacity:0.3;' />
	</g>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/media/loading-hc.svg]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/media/loading-hc.svg

```text
<?xml version='1.0' standalone='no' ?>
<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='10px' height='10px'>
	<style>
    circle {
      animation: ball 0.6s linear infinite;
    }

    circle:nth-child(2) { animation-delay: 0.075s; }
    circle:nth-child(3) { animation-delay: 0.15s; }
    circle:nth-child(4) { animation-delay: 0.225s; }
    circle:nth-child(5) { animation-delay: 0.3s; }
    circle:nth-child(6) { animation-delay: 0.375s; }
    circle:nth-child(7) { animation-delay: 0.45s; }
    circle:nth-child(8) { animation-delay: 0.525s; }

    @keyframes ball {
      from { opacity: 1; }
      to { opacity: 0.3; }
    }
	</style>
	<g style="fill:white;">
		<circle cx='5' cy='1' r='1' style='opacity:0.3;' />
		<circle cx='7.8284' cy='2.1716' r='1' style='opacity:0.3;' />
		<circle cx='9' cy='5' r='1' style='opacity:0.3;' />
		<circle cx='7.8284' cy='7.8284' r='1' style='opacity:0.3;' />
		<circle cx='5' cy='9' r='1' style='opacity:0.3;' />
		<circle cx='2.1716' cy='7.8284' r='1' style='opacity:0.3;' />
		<circle cx='1' cy='5' r='1' style='opacity:0.3;' />
		<circle cx='2.1716' cy='2.1716' r='1' style='opacity:0.3;' />
	</g>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/media/loading.svg]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/media/loading.svg

```text
<?xml version='1.0' standalone='no' ?>
<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='10px' height='10px'>
	<style>
    circle {
      animation: ball 0.6s linear infinite;
    }

    circle:nth-child(2) { animation-delay: 0.075s; }
    circle:nth-child(3) { animation-delay: 0.15s; }
    circle:nth-child(4) { animation-delay: 0.225s; }
    circle:nth-child(5) { animation-delay: 0.3s; }
    circle:nth-child(6) { animation-delay: 0.375s; }
    circle:nth-child(7) { animation-delay: 0.45s; }
    circle:nth-child(8) { animation-delay: 0.525s; }

    @keyframes ball {
      from { opacity: 1; }
      to { opacity: 0.3; }
    }
	</style>
	<g>
		<circle cx='5' cy='1' r='1' style='opacity:0.3;' />
		<circle cx='7.8284' cy='2.1716' r='1' style='opacity:0.3;' />
		<circle cx='9' cy='5' r='1' style='opacity:0.3;' />
		<circle cx='7.8284' cy='7.8284' r='1' style='opacity:0.3;' />
		<circle cx='5' cy='9' r='1' style='opacity:0.3;' />
		<circle cx='2.1716' cy='7.8284' r='1' style='opacity:0.3;' />
		<circle cx='1' cy='5' r='1' style='opacity:0.3;' />
		<circle cx='2.1716' cy='2.1716' r='1' style='opacity:0.3;' />
	</g>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/browser/media/runtimeExtensionsEditor.css]---
Location: vscode-main/src/vs/workbench/contrib/extensions/browser/media/runtimeExtensionsEditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.runtime-extensions-editor .monaco-list .monaco-list-rows > .monaco-list-row.odd:not(:hover):not(.focused) {
	background-color: rgba(130, 130, 130, 0.08);
}

.runtime-extensions-editor .extension {
	display: flex;
	padding-left: 20px;
	padding-right: 20px;
}

.runtime-extensions-editor .extension .desc {
	flex: 1;
	padding: 4px 0;
}

.runtime-extensions-editor .extension .desc .name {
	font-weight: bold;
}

.runtime-extensions-editor .extension .desc .msg .codicon {
	vertical-align: middle;
}

.runtime-extensions-editor .extension .time {
	padding: 4px;
	text-align: right;
}

.runtime-extensions-editor .extension .desc > .msg > span:not(:last-child)::after {
	content: '\2022';
	padding: 0 4px;
	opacity: .8;
}

.runtime-extensions-editor .monaco-action-bar  {
	height: unset;
}

.runtime-extensions-editor .monaco-action-bar .actions-container {
	justify-content: left;
}

.runtime-extensions-editor .extension > .icon-container {
	position: relative;
}

.runtime-extensions-editor .extension > .icon-container > .extension-icon .icon {
	padding: 10px 14px 10px 0;
}

.runtime-extensions-editor .extension > .icon-container .extension-icon-badge .codicon {
	color: currentColor;
}

.runtime-extensions-editor .extension > .desc > .header-container {
	display: flex;
	overflow: hidden;
}

.runtime-extensions-editor .extension > .desc > .header-container > .header {
	display: flex;
	align-items: baseline;
	flex-wrap: nowrap;
	overflow: hidden;
	flex: 1;
	min-width: 0;
}

.runtime-extensions-editor .extension > .desc > .header-container > .header > .name {
	font-weight: bold;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.runtime-extensions-editor .extension > .desc > .header-container > .header > .version {
	opacity: 0.85;
	font-size: 80%;
	padding-left: 6px;
	min-width: fit-content;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/common/extensionQuery.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/common/extensionQuery.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtensionGalleryManifest } from '../../../../platform/extensionManagement/common/extensionGalleryManifest.js';
import { FilterType, SortBy } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { EXTENSION_CATEGORIES } from '../../../../platform/extensions/common/extensions.js';

export class Query {

	constructor(public value: string, public sortBy: string) {
		this.value = value.trim();
	}

	static suggestions(query: string, galleryManifest: IExtensionGalleryManifest | null): string[] {

		const commands = ['installed', 'updates', 'enabled', 'disabled', 'builtin'];
		if (galleryManifest?.capabilities.extensionQuery?.filtering?.some(c => c.name === FilterType.Featured)) {
			commands.push('featured');
		}

		commands.push(...['mcp', 'popular', 'recommended', 'recentlyPublished', 'workspaceUnsupported', 'deprecated', 'sort']);
		const isCategoriesEnabled = galleryManifest?.capabilities.extensionQuery?.filtering?.some(c => c.name === FilterType.Category);
		if (isCategoriesEnabled) {
			commands.push('category');
		}

		commands.push(...['tag', 'ext', 'id', 'outdated', 'recentlyUpdated']);
		const sortCommands = [];
		if (galleryManifest?.capabilities.extensionQuery?.sorting?.some(c => c.name === SortBy.InstallCount)) {
			sortCommands.push('installs');
		}
		if (galleryManifest?.capabilities.extensionQuery?.sorting?.some(c => c.name === SortBy.WeightedRating)) {
			sortCommands.push('rating');
		}
		sortCommands.push('name', 'publishedDate', 'updateDate');

		const subcommands = {
			'sort': sortCommands,
			'category': isCategoriesEnabled ? EXTENSION_CATEGORIES.map(c => `"${c.toLowerCase()}"`) : [],
			'tag': [''],
			'ext': [''],
			'id': ['']
		} as const;

		const queryContains = (substr: string) => query.indexOf(substr) > -1;
		const hasSort = subcommands.sort.some(subcommand => queryContains(`@sort:${subcommand}`));
		const hasCategory = subcommands.category.some(subcommand => queryContains(`@category:${subcommand}`));

		return commands.flatMap(command => {
			if (hasSort && command === 'sort' || hasCategory && command === 'category') {
				return [];
			}
			if (command in subcommands) {
				return (subcommands as Record<string, readonly string[]>)[command]
					.map(subcommand => `@${command}:${subcommand}${subcommand === '' ? '' : ' '}`);
			}
			else {
				return queryContains(`@${command}`) ? [] : [`@${command} `];
			}
		});
	}

	static parse(value: string): Query {
		let sortBy = '';
		value = value.replace(/@sort:(\w+)(-\w*)?/g, (match, by: string, order: string) => {
			sortBy = by;

			return '';
		});
		return new Query(value, sortBy);
	}

	toString(): string {
		let result = this.value;

		if (this.sortBy) {
			result = `${result}${result ? ' ' : ''}@sort:${this.sortBy}`;
		}
		return result;
	}

	isValid(): boolean {
		return !/@outdated/.test(this.value);
	}

	equals(other: Query): boolean {
		return this.value === other.value && this.sortBy === other.sortBy;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/common/extensions.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/common/extensions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Event } from '../../../../base/common/event.js';
import { IPager } from '../../../../base/common/paging.js';
import { IQueryOptions, ILocalExtension, IGalleryExtension, IExtensionIdentifier, IExtensionInfo, IExtensionQueryOptions, IDeprecationInfo, InstallExtensionResult, InstallOptions } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { EnablementState, IExtensionManagementServer, IResourceExtension } from '../../../services/extensionManagement/common/extensionManagement.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { IExtensionManifest, ExtensionType } from '../../../../platform/extensions/common/extensions.js';
import { URI } from '../../../../base/common/uri.js';
import { IView, IViewPaneContainer } from '../../../common/views.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IExtensionsStatus as IExtensionRuntimeStatus } from '../../../services/extensions/common/extensions.js';
import { IExtensionEditorOptions } from './extensionsInput.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { Severity } from '../../../../platform/notification/common/notification.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { localize2 } from '../../../../nls.js';
import { ExtensionGalleryManifestStatus } from '../../../../platform/extensionManagement/common/extensionGalleryManifest.js';

export const VIEWLET_ID = 'workbench.view.extensions';
export const EXTENSIONS_CATEGORY = localize2('extensions', "Extensions");

export interface IExtensionsViewPaneContainer extends IViewPaneContainer {
	readonly searchValue: string | undefined;
	search(text: string): void;
	refresh(): Promise<void>;
}

export interface IWorkspaceRecommendedExtensionsView extends IView {
	installWorkspaceRecommendations(): Promise<void>;
}

export const enum ExtensionState {
	Installing,
	Installed,
	Uninstalling,
	Uninstalled
}

export const enum ExtensionRuntimeActionType {
	ReloadWindow = 'reloadWindow',
	RestartExtensions = 'restartExtensions',
	DownloadUpdate = 'downloadUpdate',
	ApplyUpdate = 'applyUpdate',
	QuitAndInstall = 'quitAndInstall',
}

export type ExtensionRuntimeState = { action: ExtensionRuntimeActionType; reason: string };

export interface IExtension {
	readonly type: ExtensionType;
	readonly isBuiltin: boolean;
	readonly isWorkspaceScoped: boolean;
	readonly state: ExtensionState;
	readonly name: string;
	readonly displayName: string;
	readonly identifier: IExtensionIdentifier;
	readonly publisher: string;
	readonly publisherDisplayName: string;
	readonly publisherUrl?: URI;
	readonly publisherDomain?: { link: string; verified: boolean };
	readonly publisherSponsorLink?: URI;
	readonly pinned: boolean;
	readonly version: string;
	readonly private: boolean;
	readonly latestVersion: string;
	readonly preRelease: boolean;
	readonly isPreReleaseVersion: boolean;
	readonly hasPreReleaseVersion: boolean;
	readonly hasReleaseVersion: boolean;
	readonly description: string;
	readonly url?: string;
	readonly repository?: string;
	readonly supportUrl?: string;
	readonly iconUrl?: string;
	readonly iconUrlFallback?: string;
	readonly licenseUrl?: string;
	readonly installCount?: number;
	readonly rating?: number;
	readonly ratingCount?: number;
	readonly ratingUrl?: string;
	readonly outdated: boolean;
	readonly outdatedTargetPlatform: boolean;
	readonly runtimeState: ExtensionRuntimeState | undefined;
	readonly enablementState: EnablementState;
	readonly tags: readonly string[];
	readonly categories: readonly string[];
	readonly dependencies: string[];
	readonly extensionPack: string[];
	readonly telemetryData: any;
	readonly preview: boolean;
	getManifest(token: CancellationToken): Promise<IExtensionManifest | null>;
	hasReadme(): boolean;
	getReadme(token: CancellationToken): Promise<string>;
	hasChangelog(): boolean;
	getChangelog(token: CancellationToken): Promise<string>;
	readonly server?: IExtensionManagementServer;
	readonly local?: ILocalExtension;
	gallery?: IGalleryExtension;
	readonly resourceExtension?: IResourceExtension;
	readonly isMalicious: boolean | undefined;
	readonly maliciousInfoLink: string | undefined;
	readonly deprecationInfo?: IDeprecationInfo;
	readonly missingFromGallery?: boolean;
}

export const IExtensionsWorkbenchService = createDecorator<IExtensionsWorkbenchService>('extensionsWorkbenchService');

export interface InstallExtensionOptions extends InstallOptions {
	version?: string;
	justification?: string | { reason: string; action: string };
	enable?: boolean;
	installEverywhere?: boolean;
}

export interface IExtensionsNotification {
	readonly message: string;
	readonly severity: Severity;
	readonly extensions: IExtension[];
	dismiss(): void;
}

export interface IExtensionsWorkbenchService {
	readonly _serviceBrand: undefined;
	readonly onChange: Event<IExtension | undefined>;
	readonly onReset: Event<void>;
	readonly local: IExtension[];
	readonly installed: IExtension[];
	readonly outdated: IExtension[];
	readonly whenInitialized: Promise<void>;
	queryLocal(server?: IExtensionManagementServer): Promise<IExtension[]>;
	queryGallery(token: CancellationToken): Promise<IPager<IExtension>>;
	queryGallery(options: IQueryOptions, token: CancellationToken): Promise<IPager<IExtension>>;
	getExtensions(extensionInfos: IExtensionInfo[], token: CancellationToken): Promise<IExtension[]>;
	getExtensions(extensionInfos: IExtensionInfo[], options: IExtensionQueryOptions, token: CancellationToken): Promise<IExtension[]>;
	getResourceExtensions(locations: URI[], isWorkspaceScoped: boolean): Promise<IExtension[]>;
	canInstall(extension: IExtension): Promise<true | IMarkdownString>;
	install(id: string, installOptions?: InstallExtensionOptions, progressLocation?: ProgressLocation | string): Promise<IExtension>;
	install(vsix: URI, installOptions?: InstallExtensionOptions, progressLocation?: ProgressLocation | string): Promise<IExtension>;
	install(extension: IExtension, installOptions?: InstallExtensionOptions, progressLocation?: ProgressLocation | string): Promise<IExtension>;
	installInServer(extension: IExtension, server: IExtensionManagementServer, installOptions?: InstallOptions): Promise<void>;
	downloadVSIX(extension: string, versionKind: 'prerelease' | 'release' | 'any'): Promise<void>;
	uninstall(extension: IExtension): Promise<void>;
	togglePreRelease(extension: IExtension): Promise<void>;
	canSetLanguage(extension: IExtension): boolean;
	setLanguage(extension: IExtension): Promise<void>;
	setEnablement(extensions: IExtension | IExtension[], enablementState: EnablementState): Promise<void>;
	isAutoUpdateEnabledFor(extensionOrPublisher: IExtension | string): boolean;
	updateAutoUpdateEnablementFor(extensionOrPublisher: IExtension | string, enable: boolean): Promise<void>;
	shouldRequireConsentToUpdate(extension: IExtension): Promise<string | undefined>;
	updateAutoUpdateForAllExtensions(value: boolean): Promise<void>;
	open(extension: IExtension | string, options?: IExtensionEditorOptions): Promise<void>;
	openSearch(searchValue: string, focus?: boolean): Promise<void>;
	getAutoUpdateValue(): AutoUpdateConfigurationValue;
	checkForUpdates(): Promise<void>;
	getExtensionRuntimeStatus(extension: IExtension): IExtensionRuntimeStatus | undefined;
	updateAll(): Promise<InstallExtensionResult[]>;
	updateRunningExtensions(message?: string): Promise<void>;

	readonly onDidChangeExtensionsNotification: Event<IExtensionsNotification | undefined>;
	getExtensionsNotification(): IExtensionsNotification | undefined;

	// Sync APIs
	isExtensionIgnoredToSync(extension: IExtension): boolean;
	toggleExtensionIgnoredToSync(extension: IExtension): Promise<void>;
	toggleApplyExtensionToAllProfiles(extension: IExtension): Promise<void>;
}

export const enum ExtensionEditorTab {
	Readme = 'readme',
	Features = 'features',
	Changelog = 'changelog',
	Dependencies = 'dependencies',
	ExtensionPack = 'extensionPack',
}

export const ConfigurationKey = 'extensions';
export const AutoUpdateConfigurationKey = 'extensions.autoUpdate';
export const AutoCheckUpdatesConfigurationKey = 'extensions.autoCheckUpdates';
export const CloseExtensionDetailsOnViewChangeKey = 'extensions.closeExtensionDetailsOnViewChange';
export const AutoRestartConfigurationKey = 'extensions.autoRestart';

export type AutoUpdateConfigurationValue = boolean | 'onlyEnabledExtensions' | 'onlySelectedExtensions';

export interface IExtensionsConfiguration {
	autoUpdate: boolean;
	autoCheckUpdates: boolean;
	ignoreRecommendations: boolean;
	closeExtensionDetailsOnViewChange: boolean;
}

export interface IExtensionContainer extends IDisposable {
	extension: IExtension | null;
	updateWhenCounterExtensionChanges?: boolean;
	update(): void;
}

export interface IExtensionsViewState {
	readonly onFocus: Event<IExtension>;
	readonly onBlur: Event<IExtension>;
	filters: {
		featureId?: string;
	};
}

export class ExtensionContainers extends Disposable {

	constructor(
		private readonly containers: IExtensionContainer[],
		@IExtensionsWorkbenchService extensionsWorkbenchService: IExtensionsWorkbenchService
	) {
		super();
		this._register(extensionsWorkbenchService.onChange(this.update, this));
	}

	set extension(extension: IExtension) {
		this.containers.forEach(c => c.extension = extension);
	}

	private update(extension: IExtension | undefined): void {
		for (const container of this.containers) {
			if (extension && container.extension) {
				if (areSameExtensions(container.extension.identifier, extension.identifier)) {
					if (container.extension.server && extension.server && container.extension.server !== extension.server) {
						if (container.updateWhenCounterExtensionChanges) {
							container.update();
						}
					} else {
						container.extension = extension;
					}
				}
			} else {
				container.update();
			}
		}
	}
}

export const WORKSPACE_RECOMMENDATIONS_VIEW_ID = 'workbench.views.extensions.workspaceRecommendations';
export const OUTDATED_EXTENSIONS_VIEW_ID = 'workbench.views.extensions.searchOutdated';
export const TOGGLE_IGNORE_EXTENSION_ACTION_ID = 'workbench.extensions.action.toggleIgnoreExtension';
export const SELECT_INSTALL_VSIX_EXTENSION_COMMAND_ID = 'workbench.extensions.action.installVSIX';
export const INSTALL_EXTENSION_FROM_VSIX_COMMAND_ID = 'workbench.extensions.command.installFromVSIX';

export const LIST_WORKSPACE_UNSUPPORTED_EXTENSIONS_COMMAND_ID = 'workbench.extensions.action.listWorkspaceUnsupportedExtensions';

// Context Keys
export const DefaultViewsContext = new RawContextKey<boolean>('defaultExtensionViews', true);
export const HasOutdatedExtensionsContext = new RawContextKey<boolean>('hasOutdatedExtensions', false);
export const CONTEXT_HAS_GALLERY = new RawContextKey<boolean>('hasGallery', false);
export const CONTEXT_EXTENSIONS_GALLERY_STATUS = new RawContextKey<string>('extensionsGalleryStatus', ExtensionGalleryManifestStatus.Unavailable);
export const ExtensionResultsListFocused = new RawContextKey<boolean>('extensionResultListFocused ', true);
export const SearchMcpServersContext = new RawContextKey<boolean>('searchMcpServers', false);

// Context Menu Groups
export const THEME_ACTIONS_GROUP = '_theme_';
export const INSTALL_ACTIONS_GROUP = '0_install';
export const UPDATE_ACTIONS_GROUP = '0_update';

export const extensionsSearchActionsMenu = new MenuId('extensionsSearchActionsMenu');
export const extensionsFilterSubMenu = new MenuId('extensionsFilterSubMenu');

export interface IExtensionArg {
	id: string;
	version: string;
	location: URI | undefined;
	galleryLink: string | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/common/extensionsFileTemplate.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/common/extensionsFileTemplate.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { EXTENSION_IDENTIFIER_PATTERN } from '../../../../platform/extensionManagement/common/extensionManagement.js';

export const ExtensionsConfigurationSchemaId = 'vscode://schemas/extensions';
export const ExtensionsConfigurationSchema: IJSONSchema = {
	id: ExtensionsConfigurationSchemaId,
	allowComments: true,
	allowTrailingCommas: true,
	type: 'object',
	title: localize('app.extensions.json.title', "Extensions"),
	additionalProperties: false,
	properties: {
		recommendations: {
			type: 'array',
			description: localize('app.extensions.json.recommendations', "List of extensions which should be recommended for users of this workspace. The identifier of an extension is always '${publisher}.${name}'. For example: 'vscode.csharp'."),
			items: {
				type: 'string',
				pattern: EXTENSION_IDENTIFIER_PATTERN,
				errorMessage: localize('app.extension.identifier.errorMessage', "Expected format '${publisher}.${name}'. Example: 'vscode.csharp'.")
			},
		},
		unwantedRecommendations: {
			type: 'array',
			description: localize('app.extensions.json.unwantedRecommendations', "List of extensions recommended by VS Code that should not be recommended for users of this workspace. The identifier of an extension is always '${publisher}.${name}'. For example: 'vscode.csharp'."),
			items: {
				type: 'string',
				pattern: EXTENSION_IDENTIFIER_PATTERN,
				errorMessage: localize('app.extension.identifier.errorMessage', "Expected format '${publisher}.${name}'. Example: 'vscode.csharp'.")
			},
		},
	}
};

export const ExtensionsConfigurationInitialContent: string = [
	'{',
	'\t// See https://go.microsoft.com/fwlink/?LinkId=827846 to learn about workspace recommendations.',
	'\t// Extension identifier format: ${publisher}.${name}. Example: vscode.csharp',
	'',
	'\t// List of extensions which should be recommended for users of this workspace.',
	'\t"recommendations": [',
	'\t\t',
	'\t],',
	'\t// List of extensions recommended by VS Code that should not be recommended for users of this workspace.',
	'\t"unwantedRecommendations": [',
	'\t\t',
	'\t]',
	'}'
].join('\n');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/common/extensionsInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/common/extensionsInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { EditorInputCapabilities, IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { ExtensionEditorTab, IExtension } from './extensions.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { join } from '../../../../base/common/path.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

const ExtensionEditorIcon = registerIcon('extensions-editor-label-icon', Codicon.extensions, localize('extensionsEditorLabelIcon', 'Icon of the extensions editor label.'));

export interface IExtensionEditorOptions extends IEditorOptions {
	showPreReleaseVersion?: boolean;
	tab?: ExtensionEditorTab;
	feature?: string;
	sideByside?: boolean;
}

export class ExtensionsInput extends EditorInput {

	static readonly ID = 'workbench.extensions.input2';

	override get typeId(): string {
		return ExtensionsInput.ID;
	}

	override get capabilities(): EditorInputCapabilities {
		return EditorInputCapabilities.Readonly | EditorInputCapabilities.Singleton;
	}

	override get resource() {
		return URI.from({
			scheme: Schemas.extension,
			path: join(this._extension.identifier.id, 'extension')
		});
	}

	constructor(private _extension: IExtension) {
		super();
	}

	get extension(): IExtension { return this._extension; }

	override getName(): string {
		return localize('extensionsInputName', "Extension: {0}", this._extension.displayName);
	}

	override getIcon(): ThemeIcon | undefined {
		return ExtensionEditorIcon;
	}

	override matches(other: EditorInput | IUntypedEditorInput): boolean {
		if (super.matches(other)) {
			return true;
		}

		return other instanceof ExtensionsInput && areSameExtensions(this._extension.identifier, other._extension.identifier);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/common/extensionsUtils.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/common/extensionsUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Event } from '../../../../base/common/event.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IExtensionManagementService, ILocalExtension, IExtensionIdentifier, InstallOperation } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { IWorkbenchExtensionEnablementService, EnablementState } from '../../../services/extensionManagement/common/extensionManagement.js';
import { IExtensionRecommendationsService } from '../../../services/extensionRecommendations/common/extensionRecommendations.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ServicesAccessor, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { Severity, INotificationService } from '../../../../platform/notification/common/notification.js';

export interface IExtensionStatus {
	identifier: IExtensionIdentifier;
	local: ILocalExtension;
	globallyEnabled: boolean;
}

export class KeymapExtensions extends Disposable implements IWorkbenchContribution {

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkbenchExtensionEnablementService private readonly extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IExtensionRecommendationsService private readonly tipsService: IExtensionRecommendationsService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@INotificationService private readonly notificationService: INotificationService,
	) {
		super();
		this._register(lifecycleService.onDidShutdown(() => this.dispose()));
		this._register(instantiationService.invokeFunction(onExtensionChanged)((identifiers => {
			Promise.all(identifiers.map(identifier => this.checkForOtherKeymaps(identifier)))
				.then(undefined, onUnexpectedError);
		})));
	}

	private checkForOtherKeymaps(extensionIdentifier: IExtensionIdentifier): Promise<void> {
		return this.instantiationService.invokeFunction(getInstalledExtensions).then(extensions => {
			const keymaps = extensions.filter(extension => isKeymapExtension(this.tipsService, extension));
			const extension = keymaps.find(extension => areSameExtensions(extension.identifier, extensionIdentifier));
			if (extension && extension.globallyEnabled) {
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

		this.notificationService.prompt(Severity.Info, localize('disableOtherKeymapsConfirmation', "Disable other keymaps ({0}) to avoid conflicts between keybindings?", oldKeymaps.map(k => `'${k.local.manifest.displayName}'`).join(', ')),
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
		result = result || [];
		for (const identifier of identifiers) {
			if (result.some(l => !areSameExtensions(l, identifier))) {
				result.push(identifier);
			}
		}
		return result;
	});
}

export async function getInstalledExtensions(accessor: ServicesAccessor): Promise<IExtensionStatus[]> {
	const extensionService = accessor.get(IExtensionManagementService);
	const extensionEnablementService = accessor.get(IWorkbenchExtensionEnablementService);
	const extensions = await extensionService.getInstalled();
	return extensions.map(extension => {
		return {
			identifier: extension.identifier,
			local: extension,
			globallyEnabled: extensionEnablementService.isEnabled(extension)
		};
	});
}

function isKeymapExtension(tipsService: IExtensionRecommendationsService, extension: IExtensionStatus): boolean {
	const cats = extension.local.manifest.categories;
	return cats && cats.indexOf('Keymaps') !== -1 || tipsService.getKeymapRecommendations().some(extensionId => areSameExtensions({ id: extensionId }, extension.local.identifier));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/common/installExtensionsTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/common/installExtensionsTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { localize } from '../../../../nls.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { CountTokensCallback, IPreparedToolInvocation, IToolData, IToolImpl, IToolInvocation, IToolInvocationPreparationContext, IToolResult, ToolDataSource, ToolProgress } from '../../chat/common/languageModelToolsService.js';
import { IExtensionsWorkbenchService } from './extensions.js';

export const InstallExtensionsToolId = 'vscode_installExtensions';

export const InstallExtensionsToolData: IToolData = {
	id: InstallExtensionsToolId,
	toolReferenceName: 'installExtensions',
	canBeReferencedInPrompt: true,
	displayName: localize('installExtensionsTool.displayName', 'Install Extensions'),
	modelDescription: 'This is a tool for installing extensions in Visual Studio Code. You should provide the list of extension ids to install. The identifier of an extension is \'\${ publisher }.\${ name }\' for example: \'vscode.csharp\'.',
	userDescription: localize('installExtensionsTool.userDescription', 'Tool for installing extensions'),
	source: ToolDataSource.Internal,
	inputSchema: {
		type: 'object',
		properties: {
			ids: {
				type: 'array',
				items: {
					type: 'string',
				},
				description: 'The ids of the extensions to search for. The identifier of an extension is \'\${ publisher }.\${ name }\' for example: \'vscode.csharp\'.',
			},
		}
	}
};

type InputParams = {
	ids: string[];
};

export class InstallExtensionsTool implements IToolImpl {

	constructor(
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
	) { }

	async prepareToolInvocation(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined> {
		const parameters = context.parameters as InputParams;
		return {
			confirmationMessages: {
				title: localize('installExtensionsTool.confirmationTitle', 'Install Extensions'),
				message: new MarkdownString(localize('installExtensionsTool.confirmationMessage', "Review the suggested extensions and click the **Install** button for each extension you wish to add. Once you have finished installing the selected extensions, click **Continue** to proceed.")),
			},
			toolSpecificData: {
				kind: 'extensions',
				extensions: parameters.ids
			}
		};
	}

	async invoke(invocation: IToolInvocation, _countTokens: CountTokensCallback, _progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		const input = invocation.parameters as InputParams;
		const installed = this.extensionsWorkbenchService.local.filter(e => input.ids.some(id => areSameExtensions({ id }, e.identifier)));
		return {
			content: [{
				kind: 'text',
				value: installed.length ? localize('installExtensionsTool.resultMessage', 'Following extensions are installed: {0}', installed.map(e => e.identifier.id).join(', ')) : localize('installExtensionsTool.noResultMessage', 'No extensions were installed.'),
			}]
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/common/reportExtensionIssueAction.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/common/reportExtensionIssueAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { Action } from '../../../../base/common/actions.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { IWorkbenchIssueService } from '../../issue/common/issue.js';

export class ReportExtensionIssueAction extends Action {

	private static readonly _id = 'workbench.extensions.action.reportExtensionIssue';
	private static readonly _label = nls.localize('reportExtensionIssue', "Report Issue");

	// TODO: Consider passing in IExtensionStatus or IExtensionHostProfile for additional data
	constructor(
		private extension: IExtensionDescription,
		@IWorkbenchIssueService private readonly issueService: IWorkbenchIssueService
	) {
		super(ReportExtensionIssueAction._id, ReportExtensionIssueAction._label, 'extension-action report-issue');

		this.enabled = extension.isBuiltin || (!!extension.repository && !!extension.repository.url);
	}

	override async run(): Promise<void> {
		await this.issueService.openReporter({
			extensionId: this.extension.identifier.value,
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/common/runtimeExtensionsInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/common/runtimeExtensionsInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { EditorInputCapabilities, IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

const RuntimeExtensionsEditorIcon = registerIcon('runtime-extensions-editor-label-icon', Codicon.extensions, nls.localize('runtimeExtensionEditorLabelIcon', 'Icon of the runtime extensions editor label.'));

export class RuntimeExtensionsInput extends EditorInput {

	static readonly ID = 'workbench.runtimeExtensions.input';

	override get typeId(): string {
		return RuntimeExtensionsInput.ID;
	}

	override get capabilities(): EditorInputCapabilities {
		return EditorInputCapabilities.Readonly | EditorInputCapabilities.Singleton;
	}

	static _instance: RuntimeExtensionsInput;
	static get instance() {
		if (!RuntimeExtensionsInput._instance || RuntimeExtensionsInput._instance.isDisposed()) {
			RuntimeExtensionsInput._instance = new RuntimeExtensionsInput();
		}

		return RuntimeExtensionsInput._instance;
	}

	readonly resource = URI.from({
		scheme: 'runtime-extensions',
		path: 'default'
	});

	override getName(): string {
		return nls.localize('extensionsInputName', "Running Extensions");
	}

	override getIcon(): ThemeIcon {
		return RuntimeExtensionsEditorIcon;
	}

	override matches(other: EditorInput | IUntypedEditorInput): boolean {
		if (super.matches(other)) {
			return true;
		}
		return other instanceof RuntimeExtensionsInput;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/common/searchExtensionsTool.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/common/searchExtensionsTool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { localize } from '../../../../nls.js';
import { SortBy } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { EXTENSION_CATEGORIES } from '../../../../platform/extensions/common/extensions.js';
import { CountTokensCallback, IToolData, IToolImpl, IToolInvocation, IToolResult, ToolDataSource, ToolProgress } from '../../chat/common/languageModelToolsService.js';
import { ExtensionState, IExtension, IExtensionsWorkbenchService } from '../common/extensions.js';

export const SearchExtensionsToolId = 'vscode_searchExtensions_internal';

export const SearchExtensionsToolData: IToolData = {
	id: SearchExtensionsToolId,
	toolReferenceName: 'extensions',
	legacyToolReferenceFullNames: ['extensions'],
	icon: ThemeIcon.fromId(Codicon.extensions.id),
	displayName: localize('searchExtensionsTool.displayName', 'Search Extensions'),
	modelDescription: 'This is a tool for browsing Visual Studio Code Extensions Marketplace. It allows the model to search for extensions and retrieve detailed information about them. The model should use this tool whenever it needs to discover extensions or resolve information about known ones. To use the tool, the model has to provide the category of the extensions, relevant search keywords, or known extension IDs. Note that search results may include false positives, so reviewing and filtering is recommended.',
	userDescription: localize('searchExtensionsTool.userDescription', 'Search for VS Code extensions'),
	source: ToolDataSource.Internal,
	inputSchema: {
		type: 'object',
		properties: {
			category: {
				type: 'string',
				description: 'The category of extensions to search for',
				enum: EXTENSION_CATEGORIES,
			},
			keywords: {
				type: 'array',
				items: {
					type: 'string',
				},
				description: 'The keywords to search for',
			},
			ids: {
				type: 'array',
				items: {
					type: 'string',
				},
				description: 'The ids of the extensions to search for',
			},
		},
	}
};

type InputParams = {
	category?: string;
	keywords?: string;
	ids?: string[];
};

type ExtensionData = {
	id: string;
	name: string;
	description: string;
	installed: boolean;
	installCount: number;
	rating: number;
	categories: readonly string[];
	tags: readonly string[];
};

export class SearchExtensionsTool implements IToolImpl {

	constructor(
		@IExtensionsWorkbenchService private readonly extensionWorkbenchService: IExtensionsWorkbenchService,
	) { }

	async invoke(invocation: IToolInvocation, _countTokens: CountTokensCallback, _progress: ToolProgress, token: CancellationToken): Promise<IToolResult> {
		const params = invocation.parameters as InputParams;
		if (!params.keywords?.length && !params.category && !params.ids?.length) {
			return {
				content: [{
					kind: 'text',
					value: localize('searchExtensionsTool.noInput', 'Please provide a category or keywords or ids to search for.')
				}]
			};
		}

		const extensionsMap = new Map<string, ExtensionData>();

		const addExtension = (extensions: IExtension[]) => {
			for (const extension of extensions) {
				if (extension.deprecationInfo || extension.isMalicious) {
					continue;
				}
				extensionsMap.set(extension.identifier.id.toLowerCase(), {
					id: extension.identifier.id,
					name: extension.displayName,
					description: extension.description,
					installed: extension.state === ExtensionState.Installed,
					installCount: extension.installCount ?? 0,
					rating: extension.rating ?? 0,
					categories: extension.categories ?? [],
					tags: extension.gallery?.tags ?? []
				});
			}
		};

		const queryAndAddExtensions = async (text: string) => {
			const extensions = await this.extensionWorkbenchService.queryGallery({
				text,
				pageSize: 10,
				sortBy: SortBy.InstallCount
			}, token);
			if (extensions.firstPage.length) {
				addExtension(extensions.firstPage);
			}
		};

		// Search for extensions by their ids
		if (params.ids?.length) {
			const extensions = await this.extensionWorkbenchService.getExtensions(params.ids.map(id => ({ id })), token);
			addExtension(extensions);
		}

		if (params.keywords?.length) {
			for (const keyword of params.keywords ?? []) {
				if (keyword === 'featured') {
					await queryAndAddExtensions('featured');
				} else {
					let text = params.category ? `category:"${params.category}"` : '';
					text = keyword ? `${text} ${keyword}`.trim() : text;
					await queryAndAddExtensions(text);
				}
			}
		} else {
			await queryAndAddExtensions(`category:"${params.category}"`);
		}

		const result = Array.from(extensionsMap.values());

		return {
			content: [{
				kind: 'text',
				value: `Here are the list of extensions:\n${JSON.stringify(result)}\n. Important: Use the following format to display extensions to the user because there is a renderer available to parse these extensions in this format and display them with all details. So, do not describe about the extensions to the user.\n\`\`\`vscode-extensions\nextensionId1,extensionId2\n\`\`\`\n.`
			}],
			toolResultDetails: {
				input: JSON.stringify(params),
				output: [{ type: 'embed', isText: true, value: JSON.stringify(result.map(extension => extension.id)) }]
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/electron-browser/debugExtensionHostAction.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/electron-browser/debugExtensionHostAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { randomPort } from '../../../../base/common/ports.js';
import * as nls from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ActiveEditorContext } from '../../../common/contextkeys.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ExtensionHostKind } from '../../../services/extensions/common/extensionHostKind.js';
import { IExtensionService, IExtensionInspectInfo } from '../../../services/extensions/common/extensions.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IConfig, IDebugService } from '../../debug/common/debug.js';
import { RuntimeExtensionsEditor } from './runtimeExtensionsEditor.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';

interface IExtensionHostQuickPickItem extends IQuickPickItem {
	portInfo: IExtensionInspectInfo;
}

export class DebugExtensionHostInDevToolsAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.extensions.action.devtoolsExtensionHost',
			title: nls.localize2('openDevToolsForExtensionHost', 'Debug Extension Host In Dev Tools'),
			category: Categories.Developer,
			f1: true,
			icon: Codicon.debugStart,
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const extensionService = accessor.get(IExtensionService);
		const nativeHostService = accessor.get(INativeHostService);
		const quickInputService = accessor.get(IQuickInputService);

		const inspectPorts = await extensionService.getInspectPorts(ExtensionHostKind.LocalProcess, true);

		if (inspectPorts.length === 0) {
			console.log('[devtoolsExtensionHost] No extension host inspect ports found.');
			return;
		}

		const items: IExtensionHostQuickPickItem[] = inspectPorts.filter(portInfo => portInfo.devtoolsUrl).map(portInfo => ({
			label: portInfo.devtoolsLabel ?? `${portInfo.host}:${portInfo.port}`,
			detail: `${portInfo.host}:${portInfo.port}`,
			portInfo: portInfo
		}));

		if (items.length === 1) {
			const portInfo = items[0].portInfo;
			nativeHostService.openDevToolsWindow(portInfo.devtoolsUrl!);
			return;
		}

		const selected = await quickInputService.pick<IExtensionHostQuickPickItem>(items, {
			placeHolder: nls.localize('selectExtensionHost', "Pick extension host"),
			matchOnDetail: true,
		});

		if (selected) {
			const portInfo = selected.portInfo;
			nativeHostService.openDevToolsWindow(portInfo.devtoolsUrl!);
		}
	}
}

export class DebugExtensionHostInNewWindowAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.extensions.action.debugExtensionHost',
			title: nls.localize2('debugExtensionHost', "Debug Extension Host In New Window"),
			category: Categories.Developer,
			f1: true,
			icon: Codicon.debugStart,
			menu: {
				id: MenuId.EditorTitle,
				when: ActiveEditorContext.isEqualTo(RuntimeExtensionsEditor.ID),
				group: 'navigation',
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const nativeHostService = accessor.get(INativeHostService);
		const dialogService = accessor.get(IDialogService);
		const extensionService = accessor.get(IExtensionService);
		const productService = accessor.get(IProductService);
		const instantiationService = accessor.get(IInstantiationService);
		const hostService = accessor.get(IHostService);

		extensionService.getInspectPorts(ExtensionHostKind.LocalProcess, false).then(async inspectPorts => {
			if (inspectPorts.length === 0) {
				const res = await dialogService.confirm({
					message: nls.localize('restart1', "Debug Extensions"),
					detail: nls.localize('restart2', "In order to debug extensions a restart is required. Do you want to restart '{0}' now?", productService.nameLong),
					primaryButton: nls.localize({ key: 'restart3', comment: ['&& denotes a mnemonic'] }, "&&Restart")
				});
				if (res.confirmed) {
					await nativeHostService.relaunch({ addArgs: [`--inspect-extensions=${randomPort()}`] });
				}
				return;
			}

			if (inspectPorts.length > 1) {
				// TODO
				console.warn(`There are multiple extension hosts available for debugging. Picking the first one...`);
			}

			const s = instantiationService.createInstance(Storage);
			s.storeDebugOnNewWindow(inspectPorts[0].port);

			hostService.openWindow();
		});
	}
}

class Storage {
	constructor(@IStorageService private readonly _storageService: IStorageService,) {
	}

	storeDebugOnNewWindow(targetPort: number) {
		this._storageService.store('debugExtensionHost.debugPort', targetPort, StorageScope.APPLICATION, StorageTarget.MACHINE);
	}

	getAndDeleteDebugPortIfSet(): number | undefined {
		const port = this._storageService.getNumber('debugExtensionHost.debugPort', StorageScope.APPLICATION);
		if (port !== undefined) {
			this._storageService.remove('debugExtensionHost.debugPort', StorageScope.APPLICATION);
		}
		return port;
	}
}

export class DebugExtensionsContribution extends Disposable implements IWorkbenchContribution {
	constructor(
		@IDebugService private readonly _debugService: IDebugService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IProgressService _progressService: IProgressService,
	) {
		super();

		const storage = this._instantiationService.createInstance(Storage);
		const port = storage.getAndDeleteDebugPortIfSet();
		if (port !== undefined) {
			_progressService.withProgress({
				location: ProgressLocation.Notification,
				title: nls.localize('debugExtensionHost.progress', "Attaching Debugger To Extension Host"),
			}, async p => {
				// eslint-disable-next-line local/code-no-dangerous-type-assertions
				await this._debugService.startDebugging(undefined, {
					type: 'node',
					name: nls.localize('debugExtensionHost.launch.name', "Attach Extension Host"),
					request: 'attach',
					port,
					trace: true,
					// resolve source maps everywhere:
					resolveSourceMapLocations: null,
					// announces sources eagerly for the loaded scripts view:
					eagerSources: true,
					// source maps of published VS Code are on the CDN and can take a while to load
					timeouts: {
						sourceMapMinPause: 30_000,
						sourceMapCumulativePause: 300_000,
					},
				} as IConfig);
			});
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/electron-browser/extensionProfileService.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/electron-browser/extensionProfileService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { disposableWindowInterval } from '../../../../base/browser/dom.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { randomPort } from '../../../../base/common/ports.js';
import * as nls from '../../../../nls.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ExtensionIdentifier, ExtensionIdentifierMap } from '../../../../platform/extensions/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { RuntimeExtensionsInput } from '../common/runtimeExtensionsInput.js';
import { IExtensionHostProfileService, ProfileSessionState } from './runtimeExtensionsEditor.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ExtensionHostKind } from '../../../services/extensions/common/extensionHostKind.js';
import { IExtensionHostProfile, IExtensionService, ProfileSession } from '../../../services/extensions/common/extensions.js';
import { ExtensionHostProfiler } from '../../../services/extensions/electron-browser/extensionHostProfiler.js';
import { IStatusbarEntry, IStatusbarEntryAccessor, IStatusbarService, StatusbarAlignment } from '../../../services/statusbar/browser/statusbar.js';
import { URI } from '../../../../base/common/uri.js';

export class ExtensionHostProfileService extends Disposable implements IExtensionHostProfileService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeState: Emitter<void> = this._register(new Emitter<void>());
	public readonly onDidChangeState: Event<void> = this._onDidChangeState.event;

	private readonly _onDidChangeLastProfile: Emitter<void> = this._register(new Emitter<void>());
	public readonly onDidChangeLastProfile: Event<void> = this._onDidChangeLastProfile.event;

	private readonly _unresponsiveProfiles = new ExtensionIdentifierMap<IExtensionHostProfile>();
	private _profile: IExtensionHostProfile | null;
	private _profileSession: ProfileSession | null;
	private _state: ProfileSessionState = ProfileSessionState.None;

	private profilingStatusBarIndicator: IStatusbarEntryAccessor | undefined;
	private readonly profilingStatusBarIndicatorLabelUpdater = this._register(new MutableDisposable());

	public lastProfileSavedTo: URI | undefined;
	public get state() { return this._state; }
	public get lastProfile() { return this._profile; }

	constructor(
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IEditorService private readonly _editorService: IEditorService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@INativeHostService private readonly _nativeHostService: INativeHostService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IStatusbarService private readonly _statusbarService: IStatusbarService,
		@IProductService private readonly _productService: IProductService
	) {
		super();
		this._profile = null;
		this._profileSession = null;
		this._setState(ProfileSessionState.None);

		CommandsRegistry.registerCommand('workbench.action.extensionHostProfiler.stop', () => {
			this.stopProfiling();
			this._editorService.openEditor(RuntimeExtensionsInput.instance, { pinned: true });
		});
	}

	private _setState(state: ProfileSessionState): void {
		if (this._state === state) {
			return;
		}
		this._state = state;

		if (this._state === ProfileSessionState.Running) {
			this.updateProfilingStatusBarIndicator(true);
		} else if (this._state === ProfileSessionState.Stopping) {
			this.updateProfilingStatusBarIndicator(false);
		}

		this._onDidChangeState.fire(undefined);
	}

	private updateProfilingStatusBarIndicator(visible: boolean): void {
		this.profilingStatusBarIndicatorLabelUpdater.clear();

		if (visible) {
			const indicator: IStatusbarEntry = {
				name: nls.localize('status.profiler', "Extension Profiler"),
				text: nls.localize('profilingExtensionHost', "Profiling Extension Host"),
				showProgress: true,
				ariaLabel: nls.localize('profilingExtensionHost', "Profiling Extension Host"),
				tooltip: nls.localize('selectAndStartDebug', "Click to stop profiling."),
				command: 'workbench.action.extensionHostProfiler.stop'
			};

			const timeStarted = Date.now();
			const handle = disposableWindowInterval(mainWindow, () => {
				this.profilingStatusBarIndicator?.update({ ...indicator, text: nls.localize('profilingExtensionHostTime', "Profiling Extension Host ({0} sec)", Math.round((new Date().getTime() - timeStarted) / 1000)), });
			}, 1000);
			this.profilingStatusBarIndicatorLabelUpdater.value = handle;

			if (!this.profilingStatusBarIndicator) {
				this.profilingStatusBarIndicator = this._statusbarService.addEntry(indicator, 'status.profiler', StatusbarAlignment.RIGHT);
			} else {
				this.profilingStatusBarIndicator.update(indicator);
			}
		} else {
			if (this.profilingStatusBarIndicator) {
				this.profilingStatusBarIndicator.dispose();
				this.profilingStatusBarIndicator = undefined;
			}
		}
	}

	public async startProfiling(): Promise<unknown> {
		if (this._state !== ProfileSessionState.None) {
			return null;
		}

		const inspectPorts = await this._extensionService.getInspectPorts(ExtensionHostKind.LocalProcess, true);

		if (inspectPorts.length === 0) {
			return this._dialogService.confirm({
				type: 'info',
				message: nls.localize('restart1', "Profile Extensions"),
				detail: nls.localize('restart2', "In order to profile extensions a restart is required. Do you want to restart '{0}' now?", this._productService.nameLong),
				primaryButton: nls.localize({ key: 'restart3', comment: ['&& denotes a mnemonic'] }, "&&Restart")
			}).then(res => {
				if (res.confirmed) {
					this._nativeHostService.relaunch({ addArgs: [`--inspect-extensions=${randomPort()}`] });
				}
			});
		}

		if (inspectPorts.length > 1) {
			// TODO
			console.warn(`There are multiple extension hosts available for profiling. Picking the first one...`);
		}

		this._setState(ProfileSessionState.Starting);

		return this._instantiationService.createInstance(ExtensionHostProfiler, inspectPorts[0].host, inspectPorts[0].port).start().then((value) => {
			this._profileSession = value;
			this._setState(ProfileSessionState.Running);
		}, (err) => {
			onUnexpectedError(err);
			this._setState(ProfileSessionState.None);
		});
	}

	public stopProfiling(): void {
		if (this._state !== ProfileSessionState.Running || !this._profileSession) {
			return;
		}

		this._setState(ProfileSessionState.Stopping);
		this._profileSession.stop().then((result) => {
			this._setLastProfile(result);
			this._setState(ProfileSessionState.None);
		}, (err) => {
			onUnexpectedError(err);
			this._setState(ProfileSessionState.None);
		});
		this._profileSession = null;
	}

	private _setLastProfile(profile: IExtensionHostProfile) {
		this._profile = profile;
		this.lastProfileSavedTo = undefined;
		this._onDidChangeLastProfile.fire(undefined);
	}

	getUnresponsiveProfile(extensionId: ExtensionIdentifier): IExtensionHostProfile | undefined {
		return this._unresponsiveProfiles.get(extensionId);
	}

	setUnresponsiveProfile(extensionId: ExtensionIdentifier, profile: IExtensionHostProfile): void {
		this._unresponsiveProfiles.set(extensionId, profile);
		this._setLastProfile(profile);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/electron-browser/extensions.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/electron-browser/extensions.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IExtensionRecommendationNotificationService } from '../../../../platform/extensionRecommendations/common/extensionRecommendations.js';
import { ExtensionRecommendationNotificationServiceChannel } from '../../../../platform/extensionRecommendations/common/extensionRecommendationsIpc.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ISharedProcessService } from '../../../../platform/ipc/electron-browser/services.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { EditorExtensions, IEditorFactoryRegistry, IEditorSerializer } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { RuntimeExtensionsInput } from '../common/runtimeExtensionsInput.js';
import { DebugExtensionHostInNewWindowAction, DebugExtensionsContribution, DebugExtensionHostInDevToolsAction } from './debugExtensionHostAction.js';
import { ExtensionHostProfileService } from './extensionProfileService.js';
import { CleanUpExtensionsFolderAction, OpenExtensionsFolderAction } from './extensionsActions.js';
import { ExtensionsAutoProfiler } from './extensionsAutoProfiler.js';
import { InstallRemoteExtensionsContribution, RemoteExtensionsInitializerContribution } from './remoteExtensionsInit.js';
import { IExtensionHostProfileService, OpenExtensionHostProfileACtion, RuntimeExtensionsEditor, SaveExtensionHostProfileAction, StartExtensionHostProfileAction, StopExtensionHostProfileAction } from './runtimeExtensionsEditor.js';

// Singletons
registerSingleton(IExtensionHostProfileService, ExtensionHostProfileService, InstantiationType.Delayed);

// Running Extensions Editor
Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(RuntimeExtensionsEditor, RuntimeExtensionsEditor.ID, localize('runtimeExtension', "Running Extensions")),
	[new SyncDescriptor(RuntimeExtensionsInput)]
);

class RuntimeExtensionsInputSerializer implements IEditorSerializer {
	canSerialize(editorInput: EditorInput): boolean {
		return true;
	}
	serialize(editorInput: EditorInput): string {
		return '';
	}
	deserialize(instantiationService: IInstantiationService): EditorInput {
		return RuntimeExtensionsInput.instance;
	}
}

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(RuntimeExtensionsInput.ID, RuntimeExtensionsInputSerializer);


// Global actions

class ExtensionsContributions extends Disposable implements IWorkbenchContribution {

	constructor(
		@IExtensionRecommendationNotificationService extensionRecommendationNotificationService: IExtensionRecommendationNotificationService,
		@ISharedProcessService sharedProcessService: ISharedProcessService,
	) {
		super();

		sharedProcessService.registerChannel('extensionRecommendationNotification', new ExtensionRecommendationNotificationServiceChannel(extensionRecommendationNotificationService));

		this._register(registerAction2(OpenExtensionsFolderAction));
		this._register(registerAction2(CleanUpExtensionsFolderAction));
	}
}

const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(ExtensionsContributions, LifecyclePhase.Restored);
workbenchRegistry.registerWorkbenchContribution(ExtensionsAutoProfiler, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(RemoteExtensionsInitializerContribution, LifecyclePhase.Restored);
workbenchRegistry.registerWorkbenchContribution(InstallRemoteExtensionsContribution, LifecyclePhase.Restored);
workbenchRegistry.registerWorkbenchContribution(DebugExtensionsContribution, LifecyclePhase.Restored);

// Register Commands

registerAction2(DebugExtensionHostInNewWindowAction);
registerAction2(StartExtensionHostProfileAction);
registerAction2(StopExtensionHostProfileAction);
registerAction2(SaveExtensionHostProfileAction);
registerAction2(OpenExtensionHostProfileACtion);
registerAction2(DebugExtensionHostInDevToolsAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/electron-browser/extensionsActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/electron-browser/extensionsActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize2 } from '../../../../nls.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { URI } from '../../../../base/common/uri.js';
import { INativeWorkbenchEnvironmentService } from '../../../services/environment/electron-browser/environmentService.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { Schemas } from '../../../../base/common/network.js';
import { Action2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IExtensionManagementService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';

export class OpenExtensionsFolderAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.extensions.action.openExtensionsFolder',
			title: localize2('openExtensionsFolder', 'Open Extensions Folder'),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const nativeHostService = accessor.get(INativeHostService);
		const fileService = accessor.get(IFileService);
		const environmentService = accessor.get(INativeWorkbenchEnvironmentService);

		const extensionsHome = URI.file(environmentService.extensionsPath);
		const file = await fileService.resolve(extensionsHome);

		let itemToShow: URI;
		if (file.children && file.children.length > 0) {
			itemToShow = file.children[0].resource;
		} else {
			itemToShow = extensionsHome;
		}

		if (itemToShow.scheme === Schemas.file) {
			return nativeHostService.showItemInFolder(itemToShow.fsPath);
		}
	}
}

export class CleanUpExtensionsFolderAction extends Action2 {

	constructor() {
		super({
			id: '_workbench.extensions.action.cleanUpExtensionsFolder',
			title: localize2('cleanUpExtensionsFolder', 'Cleanup Extensions Folder'),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const extensionManagementService = accessor.get(IExtensionManagementService);
		return extensionManagementService.cleanUp();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/electron-browser/extensionsAutoProfiler.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/electron-browser/extensionsAutoProfiler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { joinPath } from '../../../../base/common/resources.js';
import { TernarySearchTree } from '../../../../base/common/ternarySearchTree.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ExtensionIdentifier, ExtensionIdentifierSet, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService, NotificationPriority, Severity } from '../../../../platform/notification/common/notification.js';
import { IProfileAnalysisWorkerService } from '../../../../platform/profiling/electron-browser/profileAnalysisWorkerService.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { RuntimeExtensionsInput } from '../common/runtimeExtensionsInput.js';
import { createSlowExtensionAction } from './extensionsSlowActions.js';
import { IExtensionHostProfileService } from './runtimeExtensionsEditor.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { INativeWorkbenchEnvironmentService } from '../../../services/environment/electron-browser/environmentService.js';
import { ExtensionHostKind } from '../../../services/extensions/common/extensionHostKind.js';
import { IExtensionHostProfile, IExtensionService, IResponsiveStateChangeEvent, ProfileSession } from '../../../services/extensions/common/extensions.js';
import { ExtensionHostProfiler } from '../../../services/extensions/electron-browser/extensionHostProfiler.js';
import { ITimerService } from '../../../services/timer/browser/timerService.js';

export class ExtensionsAutoProfiler implements IWorkbenchContribution {

	private readonly _blame = new ExtensionIdentifierSet();

	private _session: CancellationTokenSource | undefined;
	private _unresponsiveListener: IDisposable | undefined;
	private _perfBaseline: number = -1;

	constructor(
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IExtensionHostProfileService private readonly _extensionProfileService: IExtensionHostProfileService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ILogService private readonly _logService: ILogService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IEditorService private readonly _editorService: IEditorService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@INativeWorkbenchEnvironmentService private readonly _environmentServie: INativeWorkbenchEnvironmentService,
		@IProfileAnalysisWorkerService private readonly _profileAnalysisService: IProfileAnalysisWorkerService,
		@IConfigurationService private readonly _configService: IConfigurationService,
		@IFileService private readonly _fileService: IFileService,
		@ITimerService timerService: ITimerService
	) {

		timerService.perfBaseline.then(value => {
			if (value < 0) {
				return; // too slow for profiling
			}
			this._perfBaseline = value;
			this._unresponsiveListener = _extensionService.onDidChangeResponsiveChange(this._onDidChangeResponsiveChange, this);
		});
	}

	dispose(): void {
		this._unresponsiveListener?.dispose();
		this._session?.dispose(true);
	}

	private async _onDidChangeResponsiveChange(event: IResponsiveStateChangeEvent): Promise<void> {
		if (event.extensionHostKind !== ExtensionHostKind.LocalProcess) {
			return;
		}

		const listener = await event.getInspectListener(true);

		if (!listener) {
			return;
		}

		if (event.isResponsive && this._session) {
			// stop profiling when responsive again
			this._session.cancel();
			this._logService.info('UNRESPONSIVE extension host: received responsive event and cancelling profiling session');


		} else if (!event.isResponsive && !this._session) {
			// start profiling if not yet profiling
			const cts = new CancellationTokenSource();
			this._session = cts;


			let session: ProfileSession;
			try {
				session = await this._instantiationService.createInstance(ExtensionHostProfiler, listener.host, listener.port).start();

			} catch (err) {
				this._session = undefined;
				// fail silent as this is often
				// caused by another party being
				// connected already
				return;
			}
			this._logService.info('UNRESPONSIVE extension host: starting to profile NOW');

			// wait 5 seconds or until responsive again
			try {
				await timeout(5e3, cts.token);
			} catch {
				// can throw cancellation error. that is
				// OK, we stop profiling and analyse the
				// profile anyways
			}

			try {
				// stop profiling and analyse results
				this._processCpuProfile(await session.stop());
			} catch (err) {
				onUnexpectedError(err);
			} finally {
				this._session = undefined;
			}
		}
	}

	private async _processCpuProfile(profile: IExtensionHostProfile) {

		// get all extensions
		await this._extensionService.whenInstalledExtensionsRegistered();

		// send heavy samples iff enabled
		if (this._configService.getValue('application.experimental.rendererProfiling')) {

			const searchTree = TernarySearchTree.forUris<IExtensionDescription>();
			searchTree.fill(this._extensionService.extensions.map(e => [e.extensionLocation, e]));

			await this._profileAnalysisService.analyseBottomUp(
				profile.data,
				url => searchTree.findSubstr(URI.parse(url))?.identifier.value ?? '<<not-found>>',
				this._perfBaseline,
				false
			);
		}

		// analyse profile by extension-category
		const categories: [location: URI, id: string][] = this._extensionService.extensions
			.filter(e => e.extensionLocation.scheme === Schemas.file)
			.map(e => [e.extensionLocation, ExtensionIdentifier.toKey(e.identifier)]);

		const data = await this._profileAnalysisService.analyseByLocation(profile.data, categories);

		//
		let overall: number = 0;
		let top: string = '';
		let topAggregated: number = -1;
		for (const [category, aggregated] of data) {
			overall += aggregated;
			if (aggregated > topAggregated) {
				topAggregated = aggregated;
				top = category;
			}
		}
		const topPercentage = topAggregated / (overall / 100);

		// associate extensions to profile node
		const extension = await this._extensionService.getExtension(top);
		if (!extension) {
			// not an extension => idle, gc, self?
			return;
		}


		const profilingSessionId = generateUuid();

		// print message to log
		const path = joinPath(this._environmentServie.tmpDir, `exthost-${Math.random().toString(16).slice(2, 8)}.cpuprofile`);
		await this._fileService.writeFile(path, VSBuffer.fromString(JSON.stringify(profile.data)));
		this._logService.warn(`UNRESPONSIVE extension host: '${top}' took ${topPercentage}% of ${topAggregated / 1e3}ms, saved PROFILE here: '${path}'`);

		type UnresponsiveData = {
			duration: number;
			profilingSessionId: string;
			data: string[];
			id: string;
		};
		type UnresponsiveDataClassification = {
			owner: 'jrieken';
			comment: 'Profiling data that was collected while the extension host was unresponsive';
			profilingSessionId: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Identifier of a profiling session' };
			duration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Duration for which the extension host was unresponsive' };
			data: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Extensions ids and core parts that were active while the extension host was frozen' };
			id: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Top extensions id that took most of the duration' };
		};
		this._telemetryService.publicLog2<UnresponsiveData, UnresponsiveDataClassification>('exthostunresponsive', {
			profilingSessionId,
			duration: overall,
			data: data.map(tuple => tuple[0]).flat(),
			id: ExtensionIdentifier.toKey(extension.identifier),
		});


		// add to running extensions view
		this._extensionProfileService.setUnresponsiveProfile(extension.identifier, profile);

		// prompt: when really slow/greedy
		if (!(topPercentage >= 95 && topAggregated >= 5e6)) {
			return;
		}

		const action = await this._instantiationService.invokeFunction(createSlowExtensionAction, extension, profile);

		if (!action) {
			// cannot report issues against this extension...
			return;
		}

		// only blame once per extension, don't blame too often
		if (this._blame.has(extension.identifier) || this._blame.size >= 3) {
			return;
		}
		this._blame.add(extension.identifier);

		// user-facing message when very bad...
		this._notificationService.prompt(
			Severity.Warning,
			localize(
				'unresponsive-exthost',
				"The extension '{0}' took a very long time to complete its last operation and it has prevented other extensions from running.",
				extension.displayName || extension.name
			),
			[{
				label: localize('show', 'Show Extensions'),
				run: () => this._editorService.openEditor(RuntimeExtensionsInput.instance, { pinned: true })
			},
				action
			],
			{ priority: NotificationPriority.SILENT }
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/electron-browser/extensionsSlowActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/electron-browser/extensionsSlowActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IProductService } from '../../../../platform/product/common/productService.js';
import { Action } from '../../../../base/common/actions.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { URI } from '../../../../base/common/uri.js';
import { IExtensionHostProfile } from '../../../services/extensions/common/extensions.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { localize } from '../../../../nls.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IRequestService, asText } from '../../../../platform/request/common/request.js';
import { joinPath } from '../../../../base/common/resources.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { INativeWorkbenchEnvironmentService } from '../../../services/environment/electron-browser/environmentService.js';
import { Utils } from '../../../../platform/profiling/common/profiling.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { IRequestContext } from '../../../../base/parts/request/common/request.js';

abstract class RepoInfo {
	abstract get base(): string;
	abstract get owner(): string;
	abstract get repo(): string;

	static fromExtension(desc: IExtensionDescription): RepoInfo | undefined {

		let result: RepoInfo | undefined;

		// scheme:auth/OWNER/REPO/issues/
		if (desc.bugs && typeof desc.bugs.url === 'string') {
			const base = URI.parse(desc.bugs.url);
			const match = /\/([^/]+)\/([^/]+)\/issues\/?$/.exec(desc.bugs.url);
			if (match) {
				result = {
					base: base.with({ path: null, fragment: null, query: null }).toString(true),
					owner: match[1],
					repo: match[2]
				};
			}
		}
		// scheme:auth/OWNER/REPO.git
		if (!result && desc.repository && typeof desc.repository.url === 'string') {
			const base = URI.parse(desc.repository.url);
			const match = /\/([^/]+)\/([^/]+)(\.git)?$/.exec(desc.repository.url);
			if (match) {
				result = {
					base: base.with({ path: null, fragment: null, query: null }).toString(true),
					owner: match[1],
					repo: match[2]
				};
			}
		}

		// for now only GH is supported
		if (result && result.base.indexOf('github') === -1) {
			result = undefined;
		}

		return result;
	}
}

export class SlowExtensionAction extends Action {

	constructor(
		readonly extension: IExtensionDescription,
		readonly profile: IExtensionHostProfile,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super('report.slow', localize('cmd.reportOrShow', "Performance Issue"), 'extension-action report-issue');
		this.enabled = Boolean(RepoInfo.fromExtension(extension));
	}

	override async run(): Promise<void> {
		const action = await this._instantiationService.invokeFunction(createSlowExtensionAction, this.extension, this.profile);
		if (action) {
			await action.run();
		}
	}
}

export async function createSlowExtensionAction(
	accessor: ServicesAccessor,
	extension: IExtensionDescription,
	profile: IExtensionHostProfile
): Promise<Action | undefined> {

	const info = RepoInfo.fromExtension(extension);
	if (!info) {
		return undefined;
	}

	const requestService = accessor.get(IRequestService);
	const instaService = accessor.get(IInstantiationService);
	const url = `https://api.github.com/search/issues?q=is:issue+state:open+in:title+repo:${info.owner}/${info.repo}+%22Extension+causes+high+cpu+load%22`;
	let res: IRequestContext;
	try {
		res = await requestService.request({ url }, CancellationToken.None);
	} catch {
		return undefined;
	}
	const rawText = await asText(res);
	if (!rawText) {
		return undefined;
	}

	const data = <{ total_count: number }>JSON.parse(rawText);
	if (!data || typeof data.total_count !== 'number') {
		return undefined;
	} else if (data.total_count === 0) {
		return instaService.createInstance(ReportExtensionSlowAction, extension, info, profile);
	} else {
		return instaService.createInstance(ShowExtensionSlowAction, extension, info, profile);
	}
}

class ReportExtensionSlowAction extends Action {

	constructor(
		readonly extension: IExtensionDescription,
		readonly repoInfo: RepoInfo,
		readonly profile: IExtensionHostProfile,
		@IDialogService private readonly _dialogService: IDialogService,
		@IOpenerService private readonly _openerService: IOpenerService,
		@IProductService private readonly _productService: IProductService,
		@INativeHostService private readonly _nativeHostService: INativeHostService,
		@INativeWorkbenchEnvironmentService private readonly _environmentService: INativeWorkbenchEnvironmentService,
		@IFileService private readonly _fileService: IFileService,
	) {
		super('report.slow', localize('cmd.report', "Report Issue"));
	}

	override async run(): Promise<void> {

		// rewrite pii (paths) and store on disk
		const data = Utils.rewriteAbsolutePaths(this.profile.data, 'pii_removed');
		const path = joinPath(this._environmentService.tmpDir, `${this.extension.identifier.value}-unresponsive.cpuprofile.txt`);
		await this._fileService.writeFile(path, VSBuffer.fromString(JSON.stringify(data, undefined, 4)));

		// build issue
		const os = await this._nativeHostService.getOSProperties();
		const title = encodeURIComponent('Extension causes high cpu load');
		const osVersion = `${os.type} ${os.arch} ${os.release}`;
		const message = `:warning: Make sure to **attach** this file from your *home*-directory:\n:warning:\`${path}\`\n\nFind more details here: https://github.com/microsoft/vscode/wiki/Explain-extension-causes-high-cpu-load`;
		const body = encodeURIComponent(`- Issue Type: \`Performance\`
- Extension Name: \`${this.extension.name}\`
- Extension Version: \`${this.extension.version}\`
- OS Version: \`${osVersion}\`
- VS Code version: \`${this._productService.version}\`\n\n${message}`);

		const url = `${this.repoInfo.base}/${this.repoInfo.owner}/${this.repoInfo.repo}/issues/new/?body=${body}&title=${title}`;
		this._openerService.open(URI.parse(url));

		this._dialogService.info(
			localize('attach.title', "Did you attach the CPU-Profile?"),
			localize('attach.msg', "This is a reminder to make sure that you have not forgotten to attach '{0}' to the issue you have just created.", path.fsPath)
		);
	}
}

class ShowExtensionSlowAction extends Action {

	constructor(
		readonly extension: IExtensionDescription,
		readonly repoInfo: RepoInfo,
		readonly profile: IExtensionHostProfile,
		@IDialogService private readonly _dialogService: IDialogService,
		@IOpenerService private readonly _openerService: IOpenerService,
		@INativeWorkbenchEnvironmentService private readonly _environmentService: INativeWorkbenchEnvironmentService,
		@IFileService private readonly _fileService: IFileService,

	) {
		super('show.slow', localize('cmd.show', "Show Issues"));
	}

	override async run(): Promise<void> {

		// rewrite pii (paths) and store on disk
		const data = Utils.rewriteAbsolutePaths(this.profile.data, 'pii_removed');
		const path = joinPath(this._environmentService.tmpDir, `${this.extension.identifier.value}-unresponsive.cpuprofile.txt`);
		await this._fileService.writeFile(path, VSBuffer.fromString(JSON.stringify(data, undefined, 4)));

		// show issues
		const url = `${this.repoInfo.base}/${this.repoInfo.owner}/${this.repoInfo.repo}/issues?utf8=✓&q=is%3Aissue+state%3Aopen+%22Extension+causes+high+cpu+load%22`;
		this._openerService.open(URI.parse(url));

		this._dialogService.info(
			localize('attach.title', "Did you attach the CPU-Profile?"),
			localize('attach.msg2', "This is a reminder to make sure that you have not forgotten to attach '{0}' to an existing performance issue.", path.fsPath)
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/electron-browser/remoteExtensionsInit.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/electron-browser/remoteExtensionsInit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT, IExtensionGalleryService, IExtensionManagementService, InstallExtensionInfo } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { REMOTE_DEFAULT_IF_LOCAL_EXTENSIONS } from '../../../../platform/remote/common/remote.js';
import { IRemoteAuthorityResolverService } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { IRemoteExtensionsScannerService } from '../../../../platform/remote/common/remoteExtensionsScanner.js';
import { IStorageService, IS_NEW_KEY, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { AbstractExtensionsInitializer } from '../../../../platform/userDataSync/common/extensionsSync.js';
import { IIgnoredExtensionsManagementService } from '../../../../platform/userDataSync/common/ignoredExtensions.js';
import { IRemoteUserData, IUserDataSyncEnablementService, IUserDataSyncStoreManagementService, SyncResource } from '../../../../platform/userDataSync/common/userDataSync.js';
import { UserDataSyncStoreClient } from '../../../../platform/userDataSync/common/userDataSyncStoreService.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IAuthenticationService } from '../../../services/authentication/common/authentication.js';
import { IExtensionManagementServerService } from '../../../services/extensionManagement/common/extensionManagement.js';
import { IExtensionManifestPropertiesService } from '../../../services/extensions/common/extensionManifestPropertiesService.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { IExtensionsWorkbenchService } from '../common/extensions.js';

export class InstallRemoteExtensionsContribution implements IWorkbenchContribution {
	constructor(
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IRemoteExtensionsScannerService private readonly remoteExtensionsScannerService: IRemoteExtensionsScannerService,
		@IExtensionGalleryService private readonly extensionGalleryService: IExtensionGalleryService,
		@IExtensionManagementServerService private readonly extensionManagementServerService: IExtensionManagementServerService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@ILogService private readonly logService: ILogService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		this.installExtensionsIfInstalledLocallyInRemote();
		this.installFailedRemoteExtensions();
	}

	private async installExtensionsIfInstalledLocallyInRemote(): Promise<void> {
		if (!this.remoteAgentService.getConnection()) {
			return;
		}

		if (!this.extensionManagementServerService.remoteExtensionManagementServer) {
			this.logService.error('No remote extension management server available');
			return;
		}

		if (!this.extensionManagementServerService.localExtensionManagementServer) {
			this.logService.error('No local extension management server available');
			return;
		}

		const settingValue = this.configurationService.getValue<string[]>(REMOTE_DEFAULT_IF_LOCAL_EXTENSIONS);
		if (!settingValue?.length) {
			return;
		}

		const alreadyInstalledLocally = await this.extensionsWorkbenchService.queryLocal(this.extensionManagementServerService.localExtensionManagementServer);
		const alreadyInstalledRemotely = await this.extensionsWorkbenchService.queryLocal(this.extensionManagementServerService.remoteExtensionManagementServer);
		const extensionsToInstall = alreadyInstalledLocally
			.filter(ext => settingValue.some(id => areSameExtensions(ext.identifier, { id })))
			.filter(ext => !alreadyInstalledRemotely.some(e => areSameExtensions(e.identifier, ext.identifier)));


		if (!extensionsToInstall.length) {
			return;
		}

		await Promise.allSettled(extensionsToInstall.map(ext => {
			this.extensionsWorkbenchService.installInServer(ext, this.extensionManagementServerService.remoteExtensionManagementServer!, { donotIncludePackAndDependencies: true });
		}));
	}

	private async installFailedRemoteExtensions(): Promise<void> {
		if (!this.remoteAgentService.getConnection()) {
			return;
		}

		const { failed } = await this.remoteExtensionsScannerService.whenExtensionsReady();
		if (failed.length === 0) {
			this.logService.trace('No extensions relayed from server');
			return;
		}

		if (!this.extensionManagementServerService.remoteExtensionManagementServer) {
			this.logService.error('No remote extension management server available');
			return;
		}

		this.logService.info(`Installing '${failed.length}' extensions relayed from server`);
		const galleryExtensions = await this.extensionGalleryService.getExtensions(failed.map(({ id }) => ({ id })), CancellationToken.None);
		const installExtensionInfo: InstallExtensionInfo[] = [];
		for (const { id, installOptions } of failed) {
			const extension = galleryExtensions.find(e => areSameExtensions(e.identifier, { id }));
			if (extension) {
				installExtensionInfo.push({
					extension, options: {
						...installOptions,
						downloadExtensionsLocally: true,
					}
				});
			} else {
				this.logService.warn(`Relayed failed extension '${id}' from server is not found in the gallery`);
			}
		}

		if (installExtensionInfo.length) {
			await Promise.allSettled(installExtensionInfo.map(e => this.extensionManagementServerService.remoteExtensionManagementServer!.extensionManagementService.installFromGallery(e.extension, e.options)));
		}
	}
}

export class RemoteExtensionsInitializerContribution implements IWorkbenchContribution {
	constructor(
		@IExtensionManagementServerService private readonly extensionManagementServerService: IExtensionManagementServerService,
		@IStorageService private readonly storageService: IStorageService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IUserDataSyncStoreManagementService private readonly userDataSyncStoreManagementService: IUserDataSyncStoreManagementService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILogService private readonly logService: ILogService,
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@IRemoteAuthorityResolverService private readonly remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@IUserDataSyncEnablementService private readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
	) {
		this.initializeRemoteExtensions();
	}

	private async initializeRemoteExtensions(): Promise<void> {
		const connection = this.remoteAgentService.getConnection();
		const localExtensionManagementServer = this.extensionManagementServerService.localExtensionManagementServer;
		const remoteExtensionManagementServer = this.extensionManagementServerService.remoteExtensionManagementServer;
		// Skip: Not a remote window
		if (!connection || !remoteExtensionManagementServer) {
			return;
		}
		// Skip: Not a native window
		if (!localExtensionManagementServer) {
			return;
		}
		// Skip: No UserdataSyncStore is configured
		if (!this.userDataSyncStoreManagementService.userDataSyncStore) {
			return;
		}
		const newRemoteConnectionKey = `${IS_NEW_KEY}.${connection.remoteAuthority}`;
		// Skip: Not a new remote connection
		if (!this.storageService.getBoolean(newRemoteConnectionKey, StorageScope.APPLICATION, true)) {
			this.logService.trace(`Skipping initializing remote extensions because the window with this remote authority was opened before.`);
			return;
		}
		this.storageService.store(newRemoteConnectionKey, false, StorageScope.APPLICATION, StorageTarget.MACHINE);
		// Skip: Not a new workspace
		if (!this.storageService.isNew(StorageScope.WORKSPACE)) {
			this.logService.trace(`Skipping initializing remote extensions because this workspace was opened before.`);
			return;
		}
		// Skip: Settings Sync is disabled
		if (!this.userDataSyncEnablementService.isEnabled()) {
			return;
		}
		// Skip: No account is provided to initialize
		const resolvedAuthority = await this.remoteAuthorityResolverService.resolveAuthority(connection.remoteAuthority);
		if (!resolvedAuthority.options?.authenticationSession) {
			return;
		}

		const sessions = await this.authenticationService.getSessions(resolvedAuthority.options?.authenticationSession.providerId);
		const session = sessions.find(s => s.id === resolvedAuthority.options?.authenticationSession?.id);
		// Skip: Session is not found
		if (!session) {
			this.logService.info('Skipping initializing remote extensions because the account with given session id is not found', resolvedAuthority.options.authenticationSession.id);
			return;
		}

		const userDataSyncStoreClient = this.instantiationService.createInstance(UserDataSyncStoreClient, this.userDataSyncStoreManagementService.userDataSyncStore.url);
		userDataSyncStoreClient.setAuthToken(session.accessToken, resolvedAuthority.options.authenticationSession.providerId);
		const userData = await userDataSyncStoreClient.readResource(SyncResource.Extensions, null);

		const serviceCollection = new ServiceCollection();
		serviceCollection.set(IExtensionManagementService, remoteExtensionManagementServer.extensionManagementService);
		const instantiationService = this.instantiationService.createChild(serviceCollection);
		const extensionsToInstallInitializer = instantiationService.createInstance(RemoteExtensionsInitializer);

		await extensionsToInstallInitializer.initialize(userData);
	}
}

class RemoteExtensionsInitializer extends AbstractExtensionsInitializer {

	constructor(
		@IExtensionManagementService extensionManagementService: IExtensionManagementService,
		@IIgnoredExtensionsManagementService ignoredExtensionsManagementService: IIgnoredExtensionsManagementService,
		@IFileService fileService: IFileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@ILogService logService: ILogService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IExtensionGalleryService private readonly extensionGalleryService: IExtensionGalleryService,
		@IStorageService storageService: IStorageService,
		@IExtensionManifestPropertiesService private readonly extensionManifestPropertiesService: IExtensionManifestPropertiesService,
	) {
		super(extensionManagementService, ignoredExtensionsManagementService, fileService, userDataProfilesService, environmentService, logService, storageService, uriIdentityService);
	}

	protected override async doInitialize(remoteUserData: IRemoteUserData): Promise<void> {
		const remoteExtensions = await this.parseExtensions(remoteUserData);
		if (!remoteExtensions) {
			this.logService.info('No synced extensions exist while initializing remote extensions.');
			return;
		}
		const installedExtensions = await this.extensionManagementService.getInstalled();
		const { newExtensions } = this.generatePreview(remoteExtensions, installedExtensions);
		if (!newExtensions.length) {
			this.logService.trace('No new remote extensions to install.');
			return;
		}
		const targetPlatform = await this.extensionManagementService.getTargetPlatform();
		const extensionsToInstall = await this.extensionGalleryService.getExtensions(newExtensions, { targetPlatform, compatible: true }, CancellationToken.None);
		if (extensionsToInstall.length) {
			await Promise.allSettled(extensionsToInstall.map(async e => {
				const manifest = await this.extensionGalleryService.getManifest(e, CancellationToken.None);
				if (manifest && this.extensionManifestPropertiesService.canExecuteOnWorkspace(manifest)) {
					const syncedExtension = remoteExtensions.find(e => areSameExtensions(e.identifier, e.identifier));
					await this.extensionManagementService.installFromGallery(e, { installPreReleaseVersion: syncedExtension?.preRelease, donotIncludePackAndDependencies: true, context: { [EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT]: true } });
				}
			}));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/electron-browser/runtimeExtensionsEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/electron-browser/runtimeExtensionsEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action } from '../../../../base/common/actions.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Event } from '../../../../base/common/event.js';
import { Schemas } from '../../../../base/common/network.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { Action2, IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService, ServicesAccessor, createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IV8Profile, Utils } from '../../../../platform/profiling/common/profiling.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ActiveEditorContext } from '../../../common/contextkeys.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IExtensionFeaturesManagementService } from '../../../services/extensionManagement/common/extensionFeatures.js';
import { IExtensionHostProfile, IExtensionService } from '../../../services/extensions/common/extensions.js';
import { AbstractRuntimeExtensionsEditor, IRuntimeExtension } from '../browser/abstractRuntimeExtensionsEditor.js';
import { IExtensionsWorkbenchService } from '../common/extensions.js';
import { ReportExtensionIssueAction } from '../common/reportExtensionIssueAction.js';
import { SlowExtensionAction } from './extensionsSlowActions.js';

export const IExtensionHostProfileService = createDecorator<IExtensionHostProfileService>('extensionHostProfileService');
export const CONTEXT_PROFILE_SESSION_STATE = new RawContextKey<string>('profileSessionState', 'none');
export const CONTEXT_EXTENSION_HOST_PROFILE_RECORDED = new RawContextKey<boolean>('extensionHostProfileRecorded', false);

export enum ProfileSessionState {
	None = 0,
	Starting = 1,
	Running = 2,
	Stopping = 3
}

export interface IExtensionHostProfileService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeState: Event<void>;
	readonly onDidChangeLastProfile: Event<void>;

	readonly state: ProfileSessionState;
	readonly lastProfile: IExtensionHostProfile | null;
	lastProfileSavedTo: URI | undefined;

	startProfiling(): void;
	stopProfiling(): void;

	getUnresponsiveProfile(extensionId: ExtensionIdentifier): IExtensionHostProfile | undefined;
	setUnresponsiveProfile(extensionId: ExtensionIdentifier, profile: IExtensionHostProfile): void;
}

export class RuntimeExtensionsEditor extends AbstractRuntimeExtensionsEditor {

	private _profileInfo: IExtensionHostProfile | null;
	private _extensionsHostRecorded: IContextKey<boolean>;
	private _profileSessionState: IContextKey<string>;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IExtensionsWorkbenchService extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IExtensionService extensionService: IExtensionService,
		@INotificationService notificationService: INotificationService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IStorageService storageService: IStorageService,
		@ILabelService labelService: ILabelService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IClipboardService clipboardService: IClipboardService,
		@IExtensionHostProfileService private readonly _extensionHostProfileService: IExtensionHostProfileService,
		@IExtensionFeaturesManagementService extensionFeaturesManagementService: IExtensionFeaturesManagementService,
		@IHoverService hoverService: IHoverService,
		@IMenuService menuService: IMenuService,
	) {
		super(group, telemetryService, themeService, contextKeyService, extensionsWorkbenchService, extensionService, notificationService, contextMenuService, instantiationService, storageService, labelService, environmentService, clipboardService, extensionFeaturesManagementService, hoverService, menuService);
		this._profileInfo = this._extensionHostProfileService.lastProfile;
		this._extensionsHostRecorded = CONTEXT_EXTENSION_HOST_PROFILE_RECORDED.bindTo(contextKeyService);
		this._profileSessionState = CONTEXT_PROFILE_SESSION_STATE.bindTo(contextKeyService);

		this._register(this._extensionHostProfileService.onDidChangeLastProfile(() => {
			this._profileInfo = this._extensionHostProfileService.lastProfile;
			this._extensionsHostRecorded.set(!!this._profileInfo);
			this._updateExtensions();
		}));
		this._register(this._extensionHostProfileService.onDidChangeState(() => {
			const state = this._extensionHostProfileService.state;
			this._profileSessionState.set(ProfileSessionState[state].toLowerCase());
		}));
	}

	protected _getProfileInfo(): IExtensionHostProfile | null {
		return this._profileInfo;
	}

	protected _getUnresponsiveProfile(extensionId: ExtensionIdentifier): IExtensionHostProfile | undefined {
		return this._extensionHostProfileService.getUnresponsiveProfile(extensionId);
	}

	protected _createSlowExtensionAction(element: IRuntimeExtension): Action | null {
		if (element.unresponsiveProfile) {
			return this._instantiationService.createInstance(SlowExtensionAction, element.description, element.unresponsiveProfile);
		}
		return null;
	}

	protected _createReportExtensionIssueAction(element: IRuntimeExtension): Action | null {
		if (element.marketplaceInfo) {
			return this._instantiationService.createInstance(ReportExtensionIssueAction, element.description);
		}
		return null;
	}
}

export class StartExtensionHostProfileAction extends Action2 {
	static readonly ID = 'workbench.extensions.action.extensionHostProfile';
	static readonly LABEL = nls.localize('extensionHostProfileStart', "Start Extension Host Profile");

	constructor() {
		super({
			id: StartExtensionHostProfileAction.ID,
			title: { value: StartExtensionHostProfileAction.LABEL, original: 'Start Extension Host Profile' },
			precondition: CONTEXT_PROFILE_SESSION_STATE.isEqualTo('none'),
			icon: Codicon.circleFilled,
			menu: [{
				id: MenuId.EditorTitle,
				when: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(RuntimeExtensionsEditor.ID), CONTEXT_PROFILE_SESSION_STATE.notEqualsTo('running')),
				group: 'navigation',
			}, {
				id: MenuId.ExtensionEditorContextMenu,
				when: CONTEXT_PROFILE_SESSION_STATE.notEqualsTo('running'),
				group: 'profiling',
			}]
		});
	}

	run(accessor: ServicesAccessor): Promise<any> {
		const extensionHostProfileService = accessor.get(IExtensionHostProfileService);
		extensionHostProfileService.startProfiling();
		return Promise.resolve();
	}
}

export class StopExtensionHostProfileAction extends Action2 {
	static readonly ID = 'workbench.extensions.action.stopExtensionHostProfile';
	static readonly LABEL = nls.localize('stopExtensionHostProfileStart', "Stop Extension Host Profile");

	constructor() {
		super({
			id: StopExtensionHostProfileAction.ID,
			title: { value: StopExtensionHostProfileAction.LABEL, original: 'Stop Extension Host Profile' },
			icon: Codicon.debugStop,
			menu: [{
				id: MenuId.EditorTitle,
				when: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(RuntimeExtensionsEditor.ID), CONTEXT_PROFILE_SESSION_STATE.isEqualTo('running')),
				group: 'navigation',
			}, {
				id: MenuId.ExtensionEditorContextMenu,
				when: CONTEXT_PROFILE_SESSION_STATE.isEqualTo('running'),
				group: 'profiling',
			}]
		});
	}

	run(accessor: ServicesAccessor): Promise<any> {
		const extensionHostProfileService = accessor.get(IExtensionHostProfileService);
		extensionHostProfileService.stopProfiling();
		return Promise.resolve();
	}
}

export class OpenExtensionHostProfileACtion extends Action2 {
	static readonly LABEL = nls.localize('openExtensionHostProfile', "Open Extension Host Profile");
	static readonly ID = 'workbench.extensions.action.openExtensionHostProfile';

	constructor() {
		super({
			id: OpenExtensionHostProfileACtion.ID,
			title: { value: OpenExtensionHostProfileACtion.LABEL, original: 'Open Extension Host Profile' },
			precondition: CONTEXT_EXTENSION_HOST_PROFILE_RECORDED,
			icon: Codicon.graph,
			menu: [{
				id: MenuId.EditorTitle,
				when: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(RuntimeExtensionsEditor.ID)),
				group: 'navigation',
			}, {
				id: MenuId.ExtensionEditorContextMenu,
				when: CONTEXT_EXTENSION_HOST_PROFILE_RECORDED,
				group: 'profiling',
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const extensionHostProfileService = accessor.get(IExtensionHostProfileService);
		const commandService = accessor.get(ICommandService);
		const editorService = accessor.get(IEditorService);
		if (!extensionHostProfileService.lastProfileSavedTo) {
			await commandService.executeCommand(SaveExtensionHostProfileAction.ID);
		}
		if (!extensionHostProfileService.lastProfileSavedTo) {
			return;
		}

		await editorService.openEditor({
			resource: extensionHostProfileService.lastProfileSavedTo,
			options: {
				revealIfOpened: true,
				override: 'jsProfileVisualizer.cpuprofile.table',
			},
		}, SIDE_GROUP);
	}

}

export class SaveExtensionHostProfileAction extends Action2 {

	static readonly LABEL = nls.localize('saveExtensionHostProfile', "Save Extension Host Profile");
	static readonly ID = 'workbench.extensions.action.saveExtensionHostProfile';

	constructor() {
		super({
			id: SaveExtensionHostProfileAction.ID,
			title: { value: SaveExtensionHostProfileAction.LABEL, original: 'Save Extension Host Profile' },
			precondition: CONTEXT_EXTENSION_HOST_PROFILE_RECORDED,
			icon: Codicon.saveAll,
			menu: [{
				id: MenuId.EditorTitle,
				when: ContextKeyExpr.and(ActiveEditorContext.isEqualTo(RuntimeExtensionsEditor.ID)),
				group: 'navigation',
			}, {
				id: MenuId.ExtensionEditorContextMenu,
				when: CONTEXT_EXTENSION_HOST_PROFILE_RECORDED,
				group: 'profiling',
			}]
		});
	}

	run(accessor: ServicesAccessor): Promise<any> {
		const environmentService = accessor.get(IWorkbenchEnvironmentService);
		const extensionHostProfileService = accessor.get(IExtensionHostProfileService);
		const fileService = accessor.get(IFileService);
		const fileDialogService = accessor.get(IFileDialogService);
		return this._asyncRun(environmentService, extensionHostProfileService, fileService, fileDialogService);
	}

	private async _asyncRun(
		environmentService: IWorkbenchEnvironmentService,
		extensionHostProfileService: IExtensionHostProfileService,
		fileService: IFileService,
		fileDialogService: IFileDialogService
	): Promise<any> {
		const picked = await fileDialogService.showSaveDialog({
			title: nls.localize('saveprofile.dialogTitle', "Save Extension Host Profile"),
			availableFileSystems: [Schemas.file],
			defaultUri: joinPath(await fileDialogService.defaultFilePath(), `CPU-${new Date().toISOString().replace(/[\-:]/g, '')}.cpuprofile`),
			filters: [{
				name: 'CPU Profiles',
				extensions: ['cpuprofile', 'txt']
			}]
		});

		if (!picked) {
			return;
		}

		const profileInfo = extensionHostProfileService.lastProfile;
		let dataToWrite: object = profileInfo ? profileInfo.data : {};

		let savePath = picked.fsPath;

		if (environmentService.isBuilt) {
			// when running from a not-development-build we remove
			// absolute filenames because we don't want to reveal anything
			// about users. We also append the `.txt` suffix to make it
			// easier to attach these files to GH issues
			dataToWrite = Utils.rewriteAbsolutePaths(dataToWrite as IV8Profile, 'piiRemoved');

			savePath = savePath + '.txt';
		}

		const saveURI = URI.file(savePath);
		extensionHostProfileService.lastProfileSavedTo = saveURI;
		return fileService.writeFile(saveURI, VSBuffer.fromString(JSON.stringify(profileInfo ? profileInfo.data : {}, null, '\t')));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/test/common/extensionQuery.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/test/common/extensionQuery.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Query } from '../../common/extensionQuery.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('Extension query', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('parse', () => {
		let query = Query.parse('');
		assert.strictEqual(query.value, '');
		assert.strictEqual(query.sortBy, '');

		query = Query.parse('hello');
		assert.strictEqual(query.value, 'hello');
		assert.strictEqual(query.sortBy, '');

		query = Query.parse('   hello world ');
		assert.strictEqual(query.value, 'hello world');
		assert.strictEqual(query.sortBy, '');

		query = Query.parse('@sort');
		assert.strictEqual(query.value, '@sort');
		assert.strictEqual(query.sortBy, '');

		query = Query.parse('@sort:');
		assert.strictEqual(query.value, '@sort:');
		assert.strictEqual(query.sortBy, '');

		query = Query.parse('  @sort:  ');
		assert.strictEqual(query.value, '@sort:');
		assert.strictEqual(query.sortBy, '');

		query = Query.parse('@sort:installs');
		assert.strictEqual(query.value, '');
		assert.strictEqual(query.sortBy, 'installs');

		query = Query.parse('   @sort:installs   ');
		assert.strictEqual(query.value, '');
		assert.strictEqual(query.sortBy, 'installs');

		query = Query.parse('@sort:installs-');
		assert.strictEqual(query.value, '');
		assert.strictEqual(query.sortBy, 'installs');

		query = Query.parse('@sort:installs-foo');
		assert.strictEqual(query.value, '');
		assert.strictEqual(query.sortBy, 'installs');

		query = Query.parse('@sort:installs');
		assert.strictEqual(query.value, '');
		assert.strictEqual(query.sortBy, 'installs');

		query = Query.parse('@sort:installs');
		assert.strictEqual(query.value, '');
		assert.strictEqual(query.sortBy, 'installs');

		query = Query.parse('vs @sort:installs');
		assert.strictEqual(query.value, 'vs');
		assert.strictEqual(query.sortBy, 'installs');

		query = Query.parse('vs @sort:installs code');
		assert.strictEqual(query.value, 'vs  code');
		assert.strictEqual(query.sortBy, 'installs');

		query = Query.parse('@sort:installs @sort:ratings');
		assert.strictEqual(query.value, '');
		assert.strictEqual(query.sortBy, 'ratings');
	});

	test('toString', () => {
		let query = new Query('hello', '');
		assert.strictEqual(query.toString(), 'hello');

		query = new Query('hello world', '');
		assert.strictEqual(query.toString(), 'hello world');

		query = new Query('  hello    ', '');
		assert.strictEqual(query.toString(), 'hello');

		query = new Query('', 'installs');
		assert.strictEqual(query.toString(), '@sort:installs');

		query = new Query('', 'installs');
		assert.strictEqual(query.toString(), '@sort:installs');

		query = new Query('', 'installs');
		assert.strictEqual(query.toString(), '@sort:installs');

		query = new Query('hello', 'installs');
		assert.strictEqual(query.toString(), 'hello @sort:installs');

		query = new Query('  hello      ', 'installs');
		assert.strictEqual(query.toString(), 'hello @sort:installs');
	});

	test('isValid', () => {
		let query = new Query('hello', '');
		assert(query.isValid());

		query = new Query('hello world', '');
		assert(query.isValid());

		query = new Query('  hello    ', '');
		assert(query.isValid());

		query = new Query('', 'installs');
		assert(query.isValid());

		query = new Query('', 'installs');
		assert(query.isValid());

		query = new Query('', 'installs');
		assert(query.isValid());

		query = new Query('', 'installs');
		assert(query.isValid());

		query = new Query('hello', 'installs');
		assert(query.isValid());

		query = new Query('  hello      ', 'installs');
		assert(query.isValid());
	});

	test('equals', () => {
		const query1 = new Query('hello', '');
		let query2 = new Query('hello', '');
		assert(query1.equals(query2));

		query2 = new Query('hello world', '');
		assert(!query1.equals(query2));

		query2 = new Query('hello', 'installs');
		assert(!query1.equals(query2));

		query2 = new Query('hello', 'installs');
		assert(!query1.equals(query2));
	});

	test('autocomplete', () => {
		Query.suggestions('@sort:in', null).some(x => x === '@sort:installs ');
		Query.suggestions('@sort:installs', null).every(x => x !== '@sort:rating ');

		Query.suggestions('@category:blah', null).some(x => x === '@category:"extension packs" ');
		Query.suggestions('@category:"extension packs"', null).every(x => x !== '@category:formatters ');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/test/electron-browser/extension.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/test/electron-browser/extension.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ExtensionState } from '../../common/extensions.js';
import { Extension } from '../../browser/extensionsWorkbenchService.js';
import { IGalleryExtension, IGalleryExtensionProperties, ILocalExtension } from '../../../../../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionType, IExtensionManifest, TargetPlatform } from '../../../../../platform/extensions/common/extensions.js';
import { URI } from '../../../../../base/common/uri.js';
import { getGalleryExtensionId } from '../../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('Extension Test', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;

	setup(() => {
		instantiationService = disposables.add(new TestInstantiationService());
		instantiationService.stub(IProductService, { quality: 'insiders' });
	});

	test('extension is not outdated when there is no local and gallery', () => {
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, undefined, undefined, undefined);
		assert.strictEqual(extension.outdated, false);
	});

	test('extension is not outdated when there is local and no gallery', () => {
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, aLocalExtension(), undefined, undefined);
		assert.strictEqual(extension.outdated, false);
	});

	test('extension is not outdated when there is no local and has gallery', () => {
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, undefined, aGalleryExtension(), undefined);
		assert.strictEqual(extension.outdated, false);
	});

	test('extension is not outdated when local and gallery are on same version', () => {
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, aLocalExtension(), aGalleryExtension(), undefined);
		assert.strictEqual(extension.outdated, false);
	});

	test('extension is outdated when local is older than gallery', () => {
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, aLocalExtension('somext', { version: '1.0.0' }), aGalleryExtension('somext', { version: '1.0.1' }), undefined);
		assert.strictEqual(extension.outdated, true);
	});

	test('extension is outdated when local is built in and older than gallery', () => {
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, aLocalExtension('somext', { version: '1.0.0' }, { type: ExtensionType.System }), aGalleryExtension('somext', { version: '1.0.1' }), undefined);
		assert.strictEqual(extension.outdated, true);
	});

	test('extension is not outdated when local is built in and older than gallery but product quality is stable', () => {
		instantiationService.stub(IProductService, { quality: 'stable' });
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, aLocalExtension('somext', { version: '1.0.0' }, { type: ExtensionType.System }), aGalleryExtension('somext', { version: '1.0.1' }), undefined);
		assert.strictEqual(extension.outdated, false);
	});

	test('extension is outdated when local and gallery are on same version but on different target platforms', () => {
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, aLocalExtension('somext', {}, { targetPlatform: TargetPlatform.WIN32_ARM64 }), aGalleryExtension('somext', {}, { targetPlatform: TargetPlatform.WIN32_X64 }), undefined);
		assert.strictEqual(extension.outdated, true);
	});

	test('extension is not outdated when local and gallery are on same version and local is on web', () => {
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, aLocalExtension('somext', {}, { targetPlatform: TargetPlatform.WEB }), aGalleryExtension('somext'), undefined);
		assert.strictEqual(extension.outdated, false);
	});

	test('extension is not outdated when local and gallery are on same version and gallery is on web', () => {
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, aLocalExtension('somext'), aGalleryExtension('somext', {}, { targetPlatform: TargetPlatform.WEB }), undefined);
		assert.strictEqual(extension.outdated, false);
	});

	test('extension is not outdated when local is not pre-release but gallery is pre-release', () => {
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, aLocalExtension('somext', { version: '1.0.0' }), aGalleryExtension('somext', { version: '1.0.1' }, { isPreReleaseVersion: true }), undefined);
		assert.strictEqual(extension.outdated, false);
	});

	test('extension is outdated when local and gallery are pre-releases', () => {
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, aLocalExtension('somext', { version: '1.0.0' }, { preRelease: true, isPreReleaseVersion: true }), aGalleryExtension('somext', { version: '1.0.1' }, { isPreReleaseVersion: true }), undefined);
		assert.strictEqual(extension.outdated, true);
	});

	test('extension is outdated when local was opted to pre-release but current version is not pre-release', () => {
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, aLocalExtension('somext', { version: '1.0.0' }, { preRelease: true, isPreReleaseVersion: false }), aGalleryExtension('somext', { version: '1.0.1' }, { isPreReleaseVersion: true }), undefined);
		assert.strictEqual(extension.outdated, true);
	});

	test('extension is outdated when local is pre-release but gallery is not', () => {
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, aLocalExtension('somext', { version: '1.0.0' }, { preRelease: true, isPreReleaseVersion: true }), aGalleryExtension('somext', { version: '1.0.1' }), undefined);
		assert.strictEqual(extension.outdated, true);
	});

	test('extension is outdated when local was opted pre-release but current version is not and gallery is not', () => {
		const extension = instantiationService.createInstance(Extension, () => ExtensionState.Installed, () => undefined, undefined, aLocalExtension('somext', { version: '1.0.0' }, { preRelease: true, isPreReleaseVersion: false }), aGalleryExtension('somext', { version: '1.0.1' }), undefined);
		assert.strictEqual(extension.outdated, true);
	});

	function aLocalExtension(name: string = 'someext', manifest: Partial<IExtensionManifest> = {}, properties: Partial<ILocalExtension> = {}): ILocalExtension {
		manifest = { name, publisher: 'pub', version: '1.0.0', ...manifest };
		properties = {
			type: ExtensionType.User,
			location: URI.file(`pub.${name}`),
			identifier: { id: getGalleryExtensionId(manifest.publisher, manifest.name!) },
			targetPlatform: TargetPlatform.UNDEFINED,
			...properties
		};
		return <ILocalExtension>Object.create({ manifest, ...properties });
	}

	function aGalleryExtension(name: string = 'somext', properties: Partial<IGalleryExtension> = {}, galleryExtensionProperties: Partial<IGalleryExtensionProperties> = {}): IGalleryExtension {
		const targetPlatform = galleryExtensionProperties.targetPlatform ?? TargetPlatform.UNDEFINED;
		const galleryExtension = <IGalleryExtension>Object.create({ name, publisher: 'pub', version: '1.0.0', allTargetPlatforms: [targetPlatform], properties: {}, assets: {}, ...properties });
		galleryExtension.properties = { ...galleryExtension.properties, dependencies: [], targetPlatform, ...galleryExtensionProperties };
		galleryExtension.identifier = { id: getGalleryExtensionId(galleryExtension.publisher, galleryExtension.name), uuid: generateUuid() };
		return <IGalleryExtension>galleryExtension;
	}

});
```

--------------------------------------------------------------------------------

````

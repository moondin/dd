---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 484
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 484 of 552)

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

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/browser/media/gettingStarted.css]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/browser/media/gettingStarted.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.file-icons-enabled .show-file-icons .vscode_getting_started_page-name-file-icon.file-icon::before {
	content: ' ';
	background-image: url('../../../../browser/media/code-icon.svg');
}

.monaco-workbench .part.editor > .content .gettingStartedContainer {
	box-sizing: border-box;
	line-height: 16px;
	position: relative;
	overflow: hidden;
	height: inherit;
	width: 100%;
	user-select: initial;
	-webkit-user-select: initial;
	outline: none;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.loading {
	display: none;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer img {
	max-width: 100%;
	max-height: 100%;
	object-fit: contain;
	pointer-events: none;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer {
	font-size: 13px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStarted {
	height: 100%;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer h1 {
	padding: 5px 0 0;
	margin: 0;
	border: none;
	font-weight: normal;
	font-size: 2.7em;
	white-space: nowrap;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .title {
	margin-top: 1em;
	margin-bottom: 1em;
	flex: 1 100%;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .subtitle {
	margin-top: .6em;
	font-size: 2em;
	display: block;
}

.monaco-workbench.hc-black .part.editor > .content .gettingStartedContainer .subtitle,
.monaco-workbench.hc-light .part.editor > .content .gettingStartedContainer .subtitle {
	font-weight: 200;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer h2 {
	font-weight: 400;
	margin-top: 0;
	margin-bottom: 5px;
	font-size: 1.5em;
	line-height: initial;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer a:focus {
	outline: 1px solid -webkit-focus-ring-color;
	outline-offset: -1px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide {
	width: 100%;
	height: 100%;
	padding: 0;
	position: absolute;
	box-sizing: border-box;
	left: 0;
	top: 0;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories {
	padding: 12px 24px;
}

/* duplicated until the getting-started specific setting is removed */
.monaco-workbench .part.editor > .content .gettingStartedContainer.animatable .gettingStartedSlide {
	/* keep consistant with SLIDE_TRANSITION_TIME_MS in gettingStarted.ts */
	transition: left 0.25s, opacity 0.25s;
}

.monaco-workbench.monaco-reduce-motion .part.editor > .content .gettingStartedContainer .gettingStartedSlide,
.monaco-workbench.monaco-reduce-motion .part.editor > .content .gettingStartedContainer.animatable .gettingStartedSlide {
	/* keep consistant with SLIDE_TRANSITION_TIME_MS in gettingStarted.ts */
	transition: left 0.0s, opacity 0.0s;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories > .gettingStartedCategoriesContainer {
	display: grid;
	height: 100%;
	max-width: 1200px;
	margin: 0 auto;
	grid-template-rows: 25% minmax(min-content, auto) min-content;
	grid-template-columns: 1fr 6fr 1fr 6fr 1fr;
	grid-template-areas:
		".  header header header ."
		". left-column . right-column ."
		". footer footer footer .";
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.width-constrained .gettingStartedSlideCategories > .gettingStartedCategoriesContainer {
	grid-template-rows: auto min-content minmax(min-content, auto) min-content;
	grid-template-columns: 1fr;
	grid-template-areas: "header" "left-column" "right-column" "footer";
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.height-constrained .gettingStartedSlideCategories > .gettingStartedCategoriesContainer {
	grid-template-rows: auto minmax(min-content, auto) min-content;
	grid-template-areas: "header" "left-column right-column" "footer footer";
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.height-constrained.width-constrained .gettingStartedSlideCategories > .gettingStartedCategoriesContainer {
	grid-template-rows: min-content minmax(min-content, auto) min-content;
	grid-template-columns: 1fr;
	grid-template-areas: "left-column" "right-column" "footer";
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.width-constrained .gettingStartedSlideCategories > .gettingStartedCategoriesContainer > .header,
.monaco-workbench .part.editor > .content .gettingStartedContainer.height-constrained .gettingStartedSlideCategories > .gettingStartedCategoriesContainer > .header {
	display: none;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories li.showWalkthroughsEntry {
	display: none;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.noWalkthroughs .gettingStartedSlideCategories li.showWalkthroughsEntry,
.gettingStartedContainer.noExtensions {
	display: unset;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories > .gettingStartedCategoriesContainer > * {
	overflow: hidden;
	text-overflow: ellipsis;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories > .gettingStartedCategoriesContainer > .categories-column > div {
	margin-bottom: 32px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories > .gettingStartedCategoriesContainer > .categories-column-left {
	grid-area: left-column;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories > .gettingStartedCategoriesContainer > .categories-column-right {
	grid-area: right-column;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories > .gettingStartedCategoriesContainer > .header {
	grid-area: header;
	align-self: end;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories > .gettingStartedCategoriesContainer > .footer {
	grid-area: footer;
	justify-self: center;
	text-align: center;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .categories-slide-container {
	width: 90%;
	max-width: 1200px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .gap {
	flex: 150px 0 1000
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .category-title {
	margin: 4px 0 4px;
	font-size: 14px;
	font-weight: 500;
	text-align: left;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .category-progress {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category.no-progress {
	padding: 3px 6px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .getting-started-category.no-progress .category-progress {
	display: none;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories ul {
	list-style: none;
	margin: 0;
	line-height: 24px;
	padding-left: 0;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories li {
	list-style: none;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .path {
	padding-left: 1em;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .recently-opened li > .button-link {
	flex-shrink: 0;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .recently-opened li > .path {
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .recently-opened-delete-button {
	visibility: hidden;
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	padding: 3px;
	border-radius: 5px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .recently-opened li {
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-right: 24px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .recently-opened li:hover .recently-opened-delete-button,
.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .recently-opened li:focus-within .recently-opened-delete-button {
	visibility: visible;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .recently-opened-delete-button:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .recently-opened-delete-button::before {
	vertical-align: unset;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .icon-widget,
.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .featured-icon {
	font-size: 20px;
	padding-right: 8px;
	position: relative;
	top: 3px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .codicon:not(.icon-widget, .featured-icon, .hide-category-button) {
	margin: 0 2px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .codicon:first-child {
	margin-left: 0;
}


.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .start-container img {
	padding-right: 8px;
	position: relative;
	top: 3px;
	max-width: 16px;
	max-height: 16px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .keybinding-label {
	padding-left: 1em;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .progress-bar-outer {
	height: 4px;
	margin-top: 4px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .progress-bar-inner {
	height: 100%;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category {
	width: calc(100% - 16px);
	font-size: 13px;
	box-sizing: border-box;
	line-height: normal;
	margin: 8px 8px 8px 1px;
	padding: 3px 6px 6px;
	text-align: left;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .getting-started-category {
	position: relative;
	border-radius: 6px;
	overflow: hidden;
}


.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category .main-content {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category .description-content {
	text-align: left;
	margin-left: 28px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category .description-content > .codicon {
	padding-right: 1px;
	font-size: 16px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category .description-content:not(:empty) {
	margin-bottom: 8px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category .new-badge {
	justify-self: flex-end;
	align-self: flex-start;
	border-radius: 4px;
	padding: 2px 4px;
	margin: 4px;
	font-size: 11px;
	white-space: nowrap;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category .featured-badge {
	position: relative;
	top: -4px;
	left: -8px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category .featured {
	border-top: 30px solid var(--vscode-activityBarBadge-background);
	width: 30px;
	box-sizing: border-box;
	height: 20px;
	border-right: 40px solid transparent;
	position: absolute;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category .featured .featured-icon {
	top: -30px;
	left: 4px;
	font-size: 14px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category .codicon.hide-category-button {
	margin-left: auto;
	top: 4px;
	right: 8px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category.featured .icon-widget {
	visibility: hidden;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .getting-started-category img.category-icon {
	padding-right: 8px;
	max-width: 20px;
	max-height: 20px;
	position: relative;
	top: auto;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .getting-started-category img.featured-icon {
	padding-right: 8px;
	max-width: 24px;
	max-height: 24px;
	border-radius: 4px;
	position: relative;
	top: auto;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-category img.category-icon {
	margin-right: 10px;
	margin-left: 10px;
	max-width: 32px;
	max-height: 32px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails {
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .gap {
	flex: 150px 0 1000
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-category {
	display: flex;
	margin-bottom: 24px;
	min-height: auto;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-detail-columns .gap {
	flex: 150px 1 1000
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .gettingStartedDetailsContent > .getting-started-category > .codicon-getting-started-setup {
	margin-right: 8px;
	font-size: 28px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-detail-columns {
	display: flex;
	justify-content: flex-start;
	padding: 40px 40px 0;
	max-height: calc(100% - 40px);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step {
	display: flex;
	width: 100%;
	overflow: hidden;
	border-radius: 6px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .button-container:not(:last-of-type) {
	margin-bottom: 6px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step.expanded {
	cursor: default !important;
	border: 1px solid var(--vscode-welcomePage-tileBorder);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step.expanded h3 {
	color: var(--vscode-walkthrough-stepTitle-foreground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step.expanded > .codicon {
	cursor: pointer !important;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step:not(.expanded) {
	height: 48px;
	background: none;
	color: var(--vscode-descriptionForeground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step:not(.expanded):hover {
	background: var(--vscode-welcomePage-tileHoverBackground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step:not(.expanded) .step-title {
	white-space: nowrap;
	text-overflow: ellipsis;
	display: inline-block;
	overflow: hidden;
	width: inherit;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .step-title .codicon {
	position: relative;
	top: 2px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-detail-columns .getting-started-detail-left > div {
	width: 100%;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step:not(.expanded) .step-description-container {
	visibility: hidden;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .step-container {
	width: 100%;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .step-description {
	padding-top: 8px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .actions {
	margin-top: 12px;
	display: flex;
	align-items: center;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .shortcut-message {
	display: flex;
	color: var(--vscode-descriptionForeground);
	font-size: 12px;
	margin-top: 12px;
	white-space: pre;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .shortcut-message .keybinding {
	font-weight: 600;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .shortcut-message .monaco-keybinding > .monaco-keybinding-key {
	display: inline-block;
	border-style: solid;
	border-width: 1px;
	border-radius: 2px;
	vertical-align: top;
	font-size: 10px;
	padding: 2px 3px;
	margin: 0 2px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .step-next {
	margin-left: auto;
	margin-right: 10px;
	padding: 6px 12px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .codicon.hidden {
	display: none;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .codicon-getting-started-step-unchecked,
.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .codicon-getting-started-step-checked {
	margin-right: 8px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step-action {
	padding: 6px 12px;
	font-size: 13px;
	margin-bottom: 0;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-detail-left {
	min-width: 330px;
	width: 40%;
	max-width: 400px;
	display: flex;
	flex-direction: column;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .full-height-scrollable {
	height: 100%;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-detail-container {
	height: 100%;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .gettingStartedDetailsContent {
	height: 100%;
	max-width: 80%;
	margin: 0 auto;
	padding: 0 32px;
	display: grid;
	grid-template-columns: 1fr 5fr 1fr 8fr;
	grid-template-rows: calc(25% - 100px) auto auto 1fr auto;
	grid-template-areas:
		". back   .      media  ."
		". title  .      media  ."
		". steps  .      media  ."
		". .      .      media  ."
		". footer footer footer .";
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.width-semi-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent {
	max-width: 500px;
	grid-template-columns: auto;
	grid-template-rows: 30px max-content minmax(30%, max-content) minmax(30%, 1fr) auto;
	row-gap: 4px;
	grid-template-areas: "back" "title" "steps" "media" "footer";
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.width-semi-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.markdown {
	grid-template-rows: 30px max-content minmax(30%, max-content) minmax(40%, 1fr) auto;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.width-semi-constrained.height-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent {
	grid-template-rows: 0 max-content minmax(25%, max-content) minmax(25%, 1fr) auto;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .gettingStartedDetailsContent > .prev-button {
	grid-area: back;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .gettingStartedDetailsContent > .getting-started-category {
	grid-area: title;
	align-self: flex-end;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .gettingStartedDetailsContent > .steps-container {
	height: 100%;
	align-self: center;
	grid-area: steps;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .gettingStartedDetailsContent > .getting-started-media {
	grid-area: media;
	align-self: center;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .gettingStartedDetailsContent.video > .getting-started-media {
	grid-area: steps-start / media-start / footer-start / media-end;
	align-self: self-start;
	display: flex;
	justify-content: center;
	height: 100%;
	width: 100%;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.width-semi-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.video > .getting-started-media {
	grid-area: media;
	height: inherit;
	width: inherit;
	display: flex;
	justify-content: center;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .gettingStartedDetailsContent.markdown > .getting-started-media {
	height: inherit;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .gettingStartedDetailsContent.image > .getting-started-media {
	grid-area: title-start / media-start / steps-end / media-end;
	align-self: unset;
	display: flex;
	justify-content: center;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.width-semi-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.image > .getting-started-media {
	grid-area: media;
	height: inherit;
	width: inherit;
	display: flex;
	justify-content: center;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.width-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.image > .getting-started-media,
.monaco-workbench .part.editor > .content .gettingStartedContainer.width-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.video > .getting-started-media,
.monaco-workbench .part.editor > .content .gettingStartedContainer.width-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.markdown > .getting-started-media,
.monaco-workbench .part.editor > .content .gettingStartedContainer.width-semi-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.image > .getting-started-media,
.monaco-workbench .part.editor > .content .gettingStartedContainer.width-semi-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.video > .getting-started-media,
.monaco-workbench .part.editor > .content .gettingStartedContainer.width-semi-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.markdown > .getting-started-media {
	display: none;
}

/* Adjust grid layout when media is hidden to give steps container full height */
.monaco-workbench .part.editor > .content .gettingStartedContainer.width-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.image,
.monaco-workbench .part.editor > .content .gettingStartedContainer.width-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.video,
.monaco-workbench .part.editor > .content .gettingStartedContainer.width-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.markdown,
.monaco-workbench .part.editor > .content .gettingStartedContainer.width-semi-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.image,
.monaco-workbench .part.editor > .content .gettingStartedContainer.width-semi-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.video,
.monaco-workbench .part.editor > .content .gettingStartedContainer.width-semi-constrained .gettingStartedSlideDetails .gettingStartedDetailsContent.markdown {
	grid-template-areas: "back" "title" "steps" "footer";
	grid-template-rows: 30px max-content 1fr auto;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .gettingStartedDetailsContent > .getting-started-media > video {
	max-width: 100%;
	max-height: 100%;
}


.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .gettingStartedDetailsContent > .getting-started-footer {
	grid-area: footer;
	align-self: flex-end;
	justify-self: center;
	text-align: center;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-detail-right {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	width: 66%;
	min-height: 300px;
	padding: 0px 0 20px 44px;
	min-width: 400px;
	max-width: 800px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .index-list.getting-started .button-link {
	margin: 0;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .index-list.getting-started .see-all-walkthroughs {
	display: none;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.someWalkthroughsHidden .index-list.getting-started .see-all-walkthroughs {
	display: inline;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.noWalkthroughs .index-list.getting-started {
	display: none;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-detail-right img {
	object-fit: contain;
	cursor: unset;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-detail-right img.clickable {
	cursor: pointer;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer button {
	border: none;
	color: inherit;
	text-align: left;
	padding: 16px;
	font-size: 13px;
	margin: 1px 0;
	/* makes room for focus border */
	font-family: inherit;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer button:hover {
	cursor: pointer;
}

/* Don't show focus outline on mouse click. Instead only show outline on keyboard focus. */
.monaco-workbench .part.editor > .content .gettingStartedContainer button:focus {
	outline: none;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer button:focus-visible {
	outline: 1px solid var(--vscode-focusBorder);
	outline-offset: 0;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .step-list-container button:focus-visible {
	box-shadow: inset 0 0 0 1px var(--vscode-focusBorder);
	outline: none;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .prev-button.button-link {
	position: absolute;
	left: 40px;
	top: 5px;
	padding: 0 2px 2px;
	margin: 10px;
	z-index: 1;
	display: none;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.width-semi-constrained .prev-button.button-link {
	left: 0;
	top: -10px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.height-constrained .prev-button.button-link {
	left: 0;
	top: -10px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.height-constrained .prev-button.button-link .codicon {
	font-size: 20px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer.height-constrained .prev-button.button-link .moreText {
	display: none;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .prev-button:hover {
	cursor: pointer;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .prev-button .codicon {
	position: relative;
	top: 3px;
	left: -4px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .button-link .codicon-arrow-right {
	padding-left: 4px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .button-link .codicon-check-all {
	padding-right: 4px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .skip {
	display: block;
	margin: 2px auto;
	width: fit-content;
	text-align: center;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails h2 {
	font-size: 26px;
	font-weight: normal;
	margin: 0 0 8px 0;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails h2 .codicon {
	font-size: 20px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails h3 {
	font-size: 13px;
	font-weight: 600;
	margin: 0;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .subtitle {
	font-size: 16px;
	margin: 0;
	padding: 0;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStarted.showCategories .gettingStartedSlideDetails {
	left: 100%;
	opacity: 0;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStarted.showDetails .gettingStartedSlideCategories {
	left: -100%;
	opacity: 0;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStarted.showDetails .categoriesScrollbar .scrollbar.vertical {
	display: none;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .done-next-container {
	display: flex;
	padding: 16px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .button-link {
	padding: 0;
	background: transparent;
	margin: 2px;
	cursor: pointer;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .done-next-container .button-link {
	display: flex;
	align-items: center;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .button-link.next {
	margin-left: auto;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .button-link:hover {
	background: transparent;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .openAWalkthrough > button,
.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .showOnStartup {
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-checkbox {
	color: inherit !important;
	height: 18px;
	width: 18px;
	border: 1px solid transparent;
	border-radius: 3px;
	padding: 0;
	margin-right: 9px;
}


.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-checkbox.codicon:not(.checked)::before {
	opacity: 0;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories > .gettingStartedCategoriesContainer > .footer p {
	margin: 0;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories > .gettingStartedCategoriesContainer .index-list.start-container {
	min-height: 156px;
	margin-bottom: 16px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories > .gettingStartedCategoriesContainer > .footer > button {
	text-align: center;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .getting-started-category .codicon {
	top: 0px;
}

.monaco-workbench .part.editor > .content .getting-started-category .codicon-star-full::before {
	vertical-align: middle;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .hide-category-button {
	visibility: hidden;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .getting-started-category:focus-within .hide-category-button,
.monaco-workbench .part.editor > .content .gettingStartedContainer .getting-started-category:hover .hide-category-button {
	visibility: visible;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .step-description-container span {
	line-height: 1.3em;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .step-description-container .monaco-button,
.monaco-workbench .part.editor > .content .gettingStartedContainer .max-lines-3 {
	line-clamp: 3;
	-webkit-line-clamp: 3;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .step-description-container .monaco-button {
	height: 24px;
	width: fit-content;
	display: flex;
	padding: 0 11px;
	align-items: center;
	min-width: max-content;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .hide-category-button {
	padding: 3px;
	border-radius: 5px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .hide-category-button::before {
	vertical-align: unset;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .hide-category-button:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer {
	background: var(--vscode-welcomePage-background);
	color: var(--vscode-foreground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .description {
	color: var(--vscode-descriptionForeground);
	line-height: 1.4em;
	font-size: 1.4em;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .category-progress .message {
	color: var(--vscode-descriptionForeground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .gettingStartedDetailsContent > .getting-started-footer {
	color: var(--vscode-descriptionForeground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .icon-widget {
	color: var(--vscode-textLink-foreground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .codicon-getting-started-step-checked {
	color: var(--vscode-textLink-foreground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step.expanded .codicon-getting-started-step-unchecked {
	color: var(--vscode-textLink-foreground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer button {
	background: var(--vscode-welcomePage-tileBackground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer button:hover {
	background: var(--vscode-welcomePage-tileHoverBackground);
	outline-color: var(--vscode-contrastActiveBorder, var(--vscode-focusBorder));
}

.monaco-workbench .part.editor > .content .gettingStartedContainer button.expanded:hover {
	background: var(--vscode-welcomePage-tileBackground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer button.emphasis {
	color: var(--vscode-button-foreground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer button.emphasis {
	background: var(--vscode-button-background);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideDetails .getting-started-step .codicon-getting-started-step-unchecked {
	color: var(--vscode-descriptionForeground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer button.emphasis:hover {
	background: var(--vscode-button-hoverBackground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer a:not(.hide-category-button) {
	color: var(--vscode-textLink-foreground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .button-link {
	color: var(--vscode-textLink-foreground);
	text-decoration: var(--text-link-decoration);
}

/* Make arrow icons consistent with the next and back buttons in color */
.monaco-workbench .part.editor > .content .gettingStartedContainer .codicon.codicon-arrow-left,
.monaco-workbench .part.editor > .content .gettingStartedContainer .codicon.codicon-arrow-right {
	color: var(--vscode-textLink-foreground);
	font-size: 18px;
}

/* Make arrow icons change color on hover, consistent with button-link hover */
.monaco-workbench .part.editor > .content .gettingStartedContainer .codicon.codicon-arrow-left:hover,
.monaco-workbench .part.editor > .content .gettingStartedContainer .codicon.codicon-arrow-right:hover {
	color: var(--vscode-textLink-activeForeground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .start-container .button-link {
	line-height: 24px;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer a:not(.hide-category-button):hover {
	color: var(--vscode-textLink-activeForeground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer a:not(.hide-category-button):active {
	color: var(--vscode-textLink-activeForeground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer button.button-link:hover {
	color: var(--vscode-textLink-activeForeground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer button.button-link:hover .codicon {
	color: var(--vscode-textLink-activeForeground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer a:not(.codicon-close):focus {
	outline-color: var(--vscode-focusBorder);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer button {
	border: 1px solid var(--vscode-contrastBorder);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer button.button-link {
	border: inherit;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .progress-bar-outer {
	background-color: var(--vscode-welcomePage-progress-background);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlideCategories .progress-bar-inner {
	background-color: var(--vscode-welcomePage-progress-foreground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category .new-badge {
	color: var(--vscode-activityBarBadge-foreground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category .featured .featured-icon {
	color: var(--vscode-activityBarBadge-foreground);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-category .new-badge {
	background-color: var(--vscode-activityBarBadge-background);
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-checkbox {
	background-color: var(--vscode-checkbox-background) !important;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-checkbox {
	color: var(--vscode-checkbox-foreground) !important;
}

.monaco-workbench .part.editor > .content .gettingStartedContainer .gettingStartedSlide .getting-started-checkbox {
	border-color: var(--vscode-checkbox-border) !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/common/gettingStartedContent.ts]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/common/gettingStartedContent.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import themePickerContent from './media/theme_picker.js';
import themePickerSmallContent from './media/theme_picker_small.js';
import notebookProfileContent from './media/notebookProfile.js';
import { localize } from '../../../../nls.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { NotebookSetting } from '../../notebook/common/notebookCommon.js';
import { CONTEXT_ACCESSIBILITY_MODE_ENABLED } from '../../../../platform/accessibility/common/accessibility.js';
import { URI } from '../../../../base/common/uri.js';
import product from '../../../../platform/product/common/product.js';

interface IGettingStartedContentProvider {
	(): string;
}

const defaultChat = {
	documentationUrl: product.defaultChatAgent?.documentationUrl ?? '',
	manageSettingsUrl: product.defaultChatAgent?.manageSettingsUrl ?? '',
	provider: product.defaultChatAgent?.provider ?? { default: { name: '' } },
	publicCodeMatchesUrl: product.defaultChatAgent?.publicCodeMatchesUrl ?? '',
	termsStatementUrl: product.defaultChatAgent?.termsStatementUrl ?? '',
	privacyStatementUrl: product.defaultChatAgent?.privacyStatementUrl ?? ''
};

export const copilotSettingsMessage = localize({ key: 'settings', comment: ['{Locked="["}', '{Locked="]({0})"}', '{Locked="]({1})"}'] }, "{0} Copilot may show [public code]({1}) suggestions and use your data to improve the product. You can change these [settings]({2}) anytime.", defaultChat.provider.default.name, defaultChat.publicCodeMatchesUrl, defaultChat.manageSettingsUrl);

class GettingStartedContentProviderRegistry {

	private readonly providers = new Map<string, IGettingStartedContentProvider>();

	registerProvider(moduleId: string, provider: IGettingStartedContentProvider): void {
		this.providers.set(moduleId, provider);
	}

	getProvider(moduleId: string): IGettingStartedContentProvider | undefined {
		return this.providers.get(moduleId);
	}
}
export const gettingStartedContentRegistry = new GettingStartedContentProviderRegistry();

export async function moduleToContent(resource: URI): Promise<string> {
	if (!resource.query) {
		throw new Error('Getting Started: invalid resource');
	}

	const query = JSON.parse(resource.query);
	if (!query.moduleId) {
		throw new Error('Getting Started: invalid resource');
	}

	const provider = gettingStartedContentRegistry.getProvider(query.moduleId);
	if (!provider) {
		throw new Error(`Getting Started: no provider registered for ${query.moduleId}`);
	}

	return provider();
}

gettingStartedContentRegistry.registerProvider('vs/workbench/contrib/welcomeGettingStarted/common/media/theme_picker', themePickerContent);
gettingStartedContentRegistry.registerProvider('vs/workbench/contrib/welcomeGettingStarted/common/media/theme_picker_small', themePickerSmallContent);
gettingStartedContentRegistry.registerProvider('vs/workbench/contrib/welcomeGettingStarted/common/media/notebookProfile', notebookProfileContent);
// Register empty media for accessibility walkthrough
gettingStartedContentRegistry.registerProvider('vs/workbench/contrib/welcomeGettingStarted/common/media/empty', () => '');

const setupIcon = registerIcon('getting-started-setup', Codicon.zap, localize('getting-started-setup-icon', "Icon used for the setup category of welcome page"));
const beginnerIcon = registerIcon('getting-started-beginner', Codicon.lightbulb, localize('getting-started-beginner-icon', "Icon used for the beginner category of welcome page"));

export type BuiltinGettingStartedStep = {
	id: string;
	title: string;
	description: string;
	completionEvents?: string[];
	when?: string;
	media:
	| { type: 'image'; path: string | { hc: string; hcLight?: string; light: string; dark: string }; altText: string }
	| { type: 'svg'; path: string; altText: string }
	| { type: 'markdown'; path: string }
	| { type: 'video'; path: string | { hc: string; hcLight?: string; light: string; dark: string }; poster?: string | { hc: string; hcLight?: string; light: string; dark: string }; altText: string };
};

export type BuiltinGettingStartedCategory = {
	id: string;
	title: string;
	description: string;
	isFeatured: boolean;
	next?: string;
	icon: ThemeIcon;
	when?: string;
	content:
	| { type: 'steps'; steps: BuiltinGettingStartedStep[] };
	walkthroughPageTitle: string;
};

export type BuiltinGettingStartedStartEntry = {
	id: string;
	title: string;
	description: string;
	icon: ThemeIcon;
	when?: string;
	content:
	| { type: 'startEntry'; command: string };
};

type GettingStartedWalkthroughContent = BuiltinGettingStartedCategory[];
type GettingStartedStartEntryContent = BuiltinGettingStartedStartEntry[];

export const startEntries: GettingStartedStartEntryContent = [
	{
		id: 'welcome.showNewFileEntries',
		title: localize('gettingStarted.newFile.title', "New File..."),
		description: localize('gettingStarted.newFile.description', "Open a new untitled text file, notebook, or custom editor."),
		icon: Codicon.newFile,
		content: {
			type: 'startEntry',
			command: 'command:welcome.showNewFileEntries',
		}
	},
	{
		id: 'topLevelOpenMac',
		title: localize('gettingStarted.openMac.title', "Open..."),
		description: localize('gettingStarted.openMac.description', "Open a file or folder to start working"),
		icon: Codicon.folderOpened,
		when: '!isWeb && isMac',
		content: {
			type: 'startEntry',
			command: 'command:workbench.action.files.openFileFolder',
		}
	},
	{
		id: 'topLevelOpenFile',
		title: localize('gettingStarted.openFile.title', "Open File..."),
		description: localize('gettingStarted.openFile.description', "Open a file to start working"),
		icon: Codicon.goToFile,
		when: 'isWeb || !isMac',
		content: {
			type: 'startEntry',
			command: 'command:workbench.action.files.openFile',
		}
	},
	{
		id: 'topLevelOpenFolder',
		title: localize('gettingStarted.openFolder.title', "Open Folder..."),
		description: localize('gettingStarted.openFolder.description', "Open a folder to start working"),
		icon: Codicon.folderOpened,
		when: '!isWeb && !isMac',
		content: {
			type: 'startEntry',
			command: 'command:workbench.action.files.openFolder',
		}
	},
	{
		id: 'topLevelOpenFolderWeb',
		title: localize('gettingStarted.openFolder.title', "Open Folder..."),
		description: localize('gettingStarted.openFolder.description', "Open a folder to start working"),
		icon: Codicon.folderOpened,
		when: '!openFolderWorkspaceSupport && workbenchState == \'workspace\'',
		content: {
			type: 'startEntry',
			command: 'command:workbench.action.files.openFolderViaWorkspace',
		}
	},
	{
		id: 'topLevelGitClone',
		title: localize('gettingStarted.topLevelGitClone.title', "Clone Git Repository..."),
		description: localize('gettingStarted.topLevelGitClone.description', "Clone a remote repository to a local folder"),
		when: 'config.git.enabled && !git.missing',
		icon: Codicon.sourceControl,
		content: {
			type: 'startEntry',
			command: 'command:git.clone',
		}
	},
	{
		id: 'topLevelGitOpen',
		title: localize('gettingStarted.topLevelGitOpen.title', "Open Repository..."),
		description: localize('gettingStarted.topLevelGitOpen.description', "Connect to a remote repository or pull request to browse, search, edit, and commit"),
		when: 'workspacePlatform == \'webworker\'',
		icon: Codicon.sourceControl,
		content: {
			type: 'startEntry',
			command: 'command:remoteHub.openRepository',
		}
	},
	{
		id: 'topLevelRemoteOpen',
		title: localize('gettingStarted.topLevelRemoteOpen.title', "Connect to..."),
		description: localize('gettingStarted.topLevelRemoteOpen.description', "Connect to remote development workspaces."),
		when: '!isWeb',
		icon: Codicon.remote,
		content: {
			type: 'startEntry',
			command: 'command:workbench.action.remote.showMenu',
		}
	},
	{
		id: 'topLevelOpenTunnel',
		title: localize('gettingStarted.topLevelOpenTunnel.title', "Open Tunnel..."),
		description: localize('gettingStarted.topLevelOpenTunnel.description', "Connect to a remote machine through a Tunnel"),
		when: 'isWeb && showRemoteStartEntryInWeb',
		icon: Codicon.remote,
		content: {
			type: 'startEntry',
			command: 'command:workbench.action.remote.showWebStartEntryActions',
		}
	},
	{
		id: 'topLevelNewWorkspaceChat',
		title: localize('gettingStarted.newWorkspaceChat.title', "Generate New Workspace..."),
		description: localize('gettingStarted.newWorkspaceChat.description', "Chat to create a new workspace"),
		icon: Codicon.chatSparkle,
		when: '!isWeb && !chatSetupHidden',
		content: {
			type: 'startEntry',
			command: 'command:welcome.newWorkspaceChat',
		}
	},
];

const Button = (title: string, href: string) => `[${title}](${href})`;

const CopilotStepTitle = localize('gettingStarted.copilotSetup.title', "Use AI features with Copilot for free");
const CopilotDescription = localize({ key: 'gettingStarted.copilotSetup.description', comment: ['{Locked="["}', '{Locked="]({0})"}'] }, "You can use [Copilot]({0}) to generate code across multiple files, fix errors, ask questions about your code, and much more using natural language.", defaultChat.documentationUrl ?? '');
const CopilotTermsString = localize({ key: 'gettingStarted.copilotSetup.terms', comment: ['{Locked="]({2})"}', '{Locked="]({3})"}'] }, "By continuing with {0} Copilot, you agree to {1}'s [Terms]({2}) and [Privacy Statement]({3})", defaultChat.provider.default.name, defaultChat.provider.default.name, defaultChat.termsStatementUrl, defaultChat.privacyStatementUrl);
const CopilotAnonymousButton = Button(localize('setupCopilotButton.setup', "Use AI Features"), `command:workbench.action.chat.triggerSetupAnonymousWithoutDialog`);
const CopilotSignedOutButton = Button(localize('setupCopilotButton.setup', "Use AI Features"), `command:workbench.action.chat.triggerSetup`);
const CopilotSignedInButton = Button(localize('setupCopilotButton.setup', "Use AI Features"), `command:workbench.action.chat.triggerSetup`);
const CopilotCompleteButton = Button(localize('setupCopilotButton.chatWithCopilot', "Start to Chat"), 'command:workbench.action.chat.open');

function createCopilotSetupStep(id: string, button: string, when: string, includeTerms: boolean): BuiltinGettingStartedStep {
	const description = includeTerms ?
		`${CopilotDescription}\n${CopilotTermsString}\n${button}` :
		`${CopilotDescription}\n${button}`;

	return {
		id,
		title: CopilotStepTitle,
		description,
		when: `${when} && !chatSetupHidden`,
		media: {
			type: 'svg', altText: 'VS Code Copilot multi file edits', path: 'multi-file-edits.svg'
		},
	};
}

export const walkthroughs: GettingStartedWalkthroughContent = [
	{
		id: 'Setup',
		title: localize('gettingStarted.setup.title', "Get started with VS Code"),
		description: localize('gettingStarted.setup.description', "Customize your editor, learn the basics, and start coding"),
		isFeatured: true,
		icon: setupIcon,
		when: '!isWeb',
		walkthroughPageTitle: localize('gettingStarted.setup.walkthroughPageTitle', 'Setup VS Code'),
		next: 'Beginner',
		content: {
			type: 'steps',
			steps: [
				createCopilotSetupStep('CopilotSetupAnonymous', CopilotAnonymousButton, 'chatAnonymous && !chatSetupInstalled', true),
				createCopilotSetupStep('CopilotSetupSignedOut', CopilotSignedOutButton, 'chatEntitlementSignedOut && !chatAnonymous', false),
				createCopilotSetupStep('CopilotSetupComplete', CopilotCompleteButton, 'chatSetupInstalled && !chatSetupDisabled && (chatAnonymous || chatPlanPro || chatPlanProPlus || chatPlanBusiness || chatPlanEnterprise || chatPlanFree)', false),
				createCopilotSetupStep('CopilotSetupSignedIn', CopilotSignedInButton, '!chatEntitlementSignedOut && (!chatSetupInstalled || chatSetupDisabled || chatPlanCanSignUp)', false),
				{
					id: 'pickColorTheme',
					title: localize('gettingStarted.pickColor.title', "Choose your theme"),
					description: localize('gettingStarted.pickColor.description.interpolated', "The right theme helps you focus on your code, is easy on your eyes, and is simply more fun to use.\n{0}", Button(localize('titleID', "Browse Color Themes"), 'command:workbench.action.selectTheme')),
					completionEvents: [
						'onSettingChanged:workbench.colorTheme',
						'onCommand:workbench.action.selectTheme'
					],
					media: { type: 'markdown', path: 'theme_picker', }
				},
				{
					id: 'videoTutorial',
					title: localize('gettingStarted.videoTutorial.title', "Watch video tutorials"),
					description: localize('gettingStarted.videoTutorial.description.interpolated', "Watch the first in a series of short & practical video tutorials for VS Code's key features.\n{0}", Button(localize('watch', "Watch Tutorial"), 'https://aka.ms/vscode-getting-started-video')),
					media: { type: 'svg', altText: 'VS Code Settings', path: 'learn.svg' },
				}
			]
		}
	},

	{
		id: 'SetupWeb',
		title: localize('gettingStarted.setupWeb.title', "Get Started with VS Code for the Web"),
		description: localize('gettingStarted.setupWeb.description', "Customize your editor, learn the basics, and start coding"),
		isFeatured: true,
		icon: setupIcon,
		when: 'isWeb',
		next: 'Beginner',
		walkthroughPageTitle: localize('gettingStarted.setupWeb.walkthroughPageTitle', 'Setup VS Code Web'),
		content: {
			type: 'steps',
			steps: [
				{
					id: 'pickColorThemeWeb',
					title: localize('gettingStarted.pickColor.title', "Choose your theme"),
					description: localize('gettingStarted.pickColor.description.interpolated', "The right theme helps you focus on your code, is easy on your eyes, and is simply more fun to use.\n{0}", Button(localize('titleID', "Browse Color Themes"), 'command:workbench.action.selectTheme')),
					completionEvents: [
						'onSettingChanged:workbench.colorTheme',
						'onCommand:workbench.action.selectTheme'
					],
					media: { type: 'markdown', path: 'theme_picker', }
				},
				{
					id: 'menuBarWeb',
					title: localize('gettingStarted.menuBar.title', "Just the right amount of UI"),
					description: localize('gettingStarted.menuBar.description.interpolated', "The full menu bar is available in the dropdown menu to make room for your code. Toggle its appearance for faster access. \n{0}", Button(localize('toggleMenuBar', "Toggle Menu Bar"), 'command:workbench.action.toggleMenuBar')),
					when: 'isWeb',
					media: {
						type: 'svg', altText: 'Comparing menu dropdown with the visible menu bar.', path: 'menuBar.svg'
					},
				},
				{
					id: 'extensionsWebWeb',
					title: localize('gettingStarted.extensions.title', "Code with extensions"),
					description: localize('gettingStarted.extensionsWeb.description.interpolated', "Extensions are VS Code's power-ups. A growing number are becoming available in the web.\n{0}", Button(localize('browsePopularWeb', "Browse Popular Web Extensions"), 'command:workbench.extensions.action.showPopularExtensions')),
					when: 'workspacePlatform == \'webworker\'',
					media: {
						type: 'svg', altText: 'VS Code extension marketplace with featured language extensions', path: 'extensions-web.svg'
					},
				},
				{
					id: 'findLanguageExtensionsWeb',
					title: localize('gettingStarted.findLanguageExts.title', "Rich support for all your languages"),
					description: localize('gettingStarted.findLanguageExts.description.interpolated', "Code smarter with syntax highlighting, inline suggestions, linting and debugging. While many languages are built-in, many more can be added as extensions.\n{0}", Button(localize('browseLangExts', "Browse Language Extensions"), 'command:workbench.extensions.action.showLanguageExtensions')),
					when: 'workspacePlatform != \'webworker\'',
					media: {
						type: 'svg', altText: 'Language extensions', path: 'languages.svg'
					},
				},
				{
					id: 'settingsSyncWeb',
					title: localize('gettingStarted.settingsSync.title', "Sync settings across devices"),
					description: localize('gettingStarted.settingsSync.description.interpolated', "Keep your essential customizations backed up and updated across all your devices.\n{0}", Button(localize('enableSync', "Backup and Sync Settings"), 'command:workbench.userDataSync.actions.turnOn')),
					when: 'syncStatus != uninitialized',
					completionEvents: ['onEvent:sync-enabled'],
					media: {
						type: 'svg', altText: 'The "Turn on Sync" entry in the settings gear menu.', path: 'settingsSync.svg'
					},
				},
				{
					id: 'commandPaletteTaskWeb',
					title: localize('gettingStarted.commandPalette.title', "Unlock productivity with the Command Palette "),
					description: localize('gettingStarted.commandPalette.description.interpolated', "Run commands without reaching for your mouse to accomplish any task in VS Code.\n{0}", Button(localize('commandPalette', "Open Command Palette"), 'command:workbench.action.showCommands')),
					media: { type: 'svg', altText: 'Command Palette overlay for searching and executing commands.', path: 'commandPalette.svg' },
				},
				{
					id: 'pickAFolderTask-WebWeb',
					title: localize('gettingStarted.setup.OpenFolder.title', "Open up your code"),
					description: localize('gettingStarted.setup.OpenFolderWeb.description.interpolated', "You're all set to start coding. You can open a local project or a remote repository to get your files into VS Code.\n{0}\n{1}", Button(localize('openFolder', "Open Folder"), 'command:workbench.action.addRootFolder'), Button(localize('openRepository', "Open Repository"), 'command:remoteHub.openRepository')),
					when: 'workspaceFolderCount == 0',
					media: {
						type: 'svg', altText: 'Explorer view showing buttons for opening folder and cloning repository.', path: 'openFolder.svg'
					}
				},
				{
					id: 'quickOpenWeb',
					title: localize('gettingStarted.quickOpen.title', "Quickly navigate between your files"),
					description: localize('gettingStarted.quickOpen.description.interpolated', "Navigate between files in an instant with one keystroke. Tip: Open multiple files by pressing the right arrow key.\n{0}", Button(localize('quickOpen', "Quick Open a File"), 'command:toSide:workbench.action.quickOpen')),
					when: 'workspaceFolderCount != 0',
					media: {
						type: 'svg', altText: 'Go to file in quick search.', path: 'search.svg'
					}
				}
			]
		}
	},
	{
		id: 'SetupAccessibility',
		title: localize('gettingStarted.setupAccessibility.title', "Get Started with Accessibility Features"),
		description: localize('gettingStarted.setupAccessibility.description', "Learn the tools and shortcuts that make VS Code accessible. Note that some actions are not actionable from within the context of the walkthrough."),
		isFeatured: true,
		icon: setupIcon,
		when: CONTEXT_ACCESSIBILITY_MODE_ENABLED.key,
		next: 'Setup',
		walkthroughPageTitle: localize('gettingStarted.setupAccessibility.walkthroughPageTitle', 'Setup VS Code Accessibility'),
		content: {
			type: 'steps',
			steps: [
				{
					id: 'accessibilityHelp',
					title: localize('gettingStarted.accessibilityHelp.title', "Use the accessibility help dialog to learn about features"),
					description: localize('gettingStarted.accessibilityHelp.description.interpolated', "The accessibility help dialog provides information about what to expect from a feature and the commands/keybindings to operate them.\n With focus in an editor, terminal, notebook, chat response, comment, or debug console, the relevant dialog can be opened with the Open Accessibility Help command.\n{0}", Button(localize('openAccessibilityHelp', "Open Accessibility Help"), 'command:editor.action.accessibilityHelp')),
					media: {
						type: 'markdown', path: 'empty'
					}
				},
				{
					id: 'accessibleView',
					title: localize('gettingStarted.accessibleView.title', "Screen reader users can inspect content line by line, character by character in the accessible view."),
					description: localize('gettingStarted.accessibleView.description.interpolated', "The accessible view is available for the terminal, hovers, notifications, comments, notebook output, chat responses, inline completions, and debug console output.\n With focus in any of those features, it can be opened with the Open Accessible View command.\n{0}", Button(localize('openAccessibleView', "Open Accessible View"), 'command:editor.action.accessibleView')),
					media: {
						type: 'markdown', path: 'empty'
					}
				},
				{
					id: 'verbositySettings',
					title: localize('gettingStarted.verbositySettings.title', "Control the verbosity of aria labels"),
					description: localize('gettingStarted.verbositySettings.description.interpolated', "Screen reader verbosity settings exist for features around the workbench so that once a user is familiar with a feature, they can avoid hearing hints about how to operate it. For example, features for which an accessibility help dialog exists will indicate how to open the dialog until the verbosity setting for that feature has been disabled.\n These and other accessibility settings can be configured by running the Open Accessibility Settings command.\n{0}", Button(localize('openVerbositySettings', "Open Accessibility Settings"), 'command:workbench.action.openAccessibilitySettings')),
					media: {
						type: 'markdown', path: 'empty'
					}
				},
				{
					id: 'commandPaletteTaskAccessibility',
					title: localize('gettingStarted.commandPaletteAccessibility.title', "Unlock productivity with the Command Palette "),
					description: localize('gettingStarted.commandPaletteAccessibility.description.interpolated', "Run commands without reaching for your mouse to accomplish any task in VS Code.\n{0}", Button(localize('commandPalette', "Open Command Palette"), 'command:workbench.action.showCommands')),
					media: { type: 'markdown', path: 'empty' },
				},
				{
					id: 'keybindingsAccessibility',
					title: localize('gettingStarted.keyboardShortcuts.title', "Customize your keyboard shortcuts"),
					description: localize('gettingStarted.keyboardShortcuts.description.interpolated', "Once you have discovered your favorite commands, create custom keyboard shortcuts for instant access.\n{0}", Button(localize('keyboardShortcuts', "Keyboard Shortcuts"), 'command:toSide:workbench.action.openGlobalKeybindings')),
					media: {
						type: 'markdown', path: 'empty',
					}
				},
				{
					id: 'accessibilitySignals',
					title: localize('gettingStarted.accessibilitySignals.title', "Fine tune which accessibility signals you want to receive via audio or a braille device"),
					description: localize('gettingStarted.accessibilitySignals.description.interpolated', "Accessibility sounds and announcements are played around the workbench for different events.\n These can be discovered and configured using the List Signal Sounds and List Signal Announcements commands.\n{0}\n{1}", Button(localize('listSignalSounds', "List Signal Sounds"), 'command:signals.sounds.help'), Button(localize('listSignalAnnouncements', "List Signal Announcements"), 'command:accessibility.announcement.help')),
					media: {
						type: 'markdown', path: 'empty'
					}
				},
				{
					id: 'hover',
					title: localize('gettingStarted.hover.title', "Access the hover in the editor to get more information on a variable or symbol"),
					description: localize('gettingStarted.hover.description.interpolated', "While focus is in the editor on a variable or symbol, a hover can be focused with the Show or Open Hover command.\n{0}", Button(localize('showOrFocusHover', "Show or Focus Hover"), 'command:editor.action.showHover')),
					media: {
						type: 'markdown', path: 'empty'
					}
				},
				{
					id: 'goToSymbol',
					title: localize('gettingStarted.goToSymbol.title', "Navigate to symbols in a file"),
					description: localize('gettingStarted.goToSymbol.description.interpolated', "The Go to Symbol command is useful for navigating between important landmarks in a document.\n{0}", Button(localize('openGoToSymbol', "Go to Symbol"), 'command:editor.action.goToSymbol')),
					media: {
						type: 'markdown', path: 'empty'
					}
				},
				{
					id: 'codeFolding',
					title: localize('gettingStarted.codeFolding.title', "Use code folding to collapse blocks of code and focus on the code you're interested in."),
					description: localize('gettingStarted.codeFolding.description.interpolated', "Fold or unfold a code section with the Toggle Fold command.\n{0}\n Fold or unfold recursively with the Toggle Fold Recursively Command\n{1}\n", Button(localize('toggleFold', "Toggle Fold"), 'command:editor.toggleFold'), Button(localize('toggleFoldRecursively', "Toggle Fold Recursively"), 'command:editor.toggleFoldRecursively')),
					media: {
						type: 'markdown', path: 'empty'
					}
				},
				{
					id: 'intellisense',
					title: localize('gettingStarted.intellisense.title', "Use Intellisense to improve coding efficiency"),
					description: localize('gettingStarted.intellisense.description.interpolated', "Intellisense suggestions can be opened with the Trigger Intellisense command.\n{0}\n Inline intellisense suggestions can be triggered with Trigger Inline Suggestion\n{1}\n Useful settings include editor.inlineCompletionsAccessibilityVerbose and editor.screenReaderAnnounceInlineSuggestion.", Button(localize('triggerIntellisense', "Trigger Intellisense"), 'command:editor.action.triggerSuggest'), Button(localize('triggerInlineSuggestion', 'Trigger Inline Suggestion'), 'command:editor.action.inlineSuggest.trigger')),
					media: {
						type: 'markdown', path: 'empty'
					}
				},
				{
					id: 'accessibilitySettings',
					title: localize('gettingStarted.accessibilitySettings.title', "Configure accessibility settings"),
					description: localize('gettingStarted.accessibilitySettings.description.interpolated', "Accessibility settings can be configured by running the Open Accessibility Settings command.\n{0}", Button(localize('openAccessibilitySettings', "Open Accessibility Settings"), 'command:workbench.action.openAccessibilitySettings')),
					media: { type: 'markdown', path: 'empty' }
				},
				{
					id: 'dictation',
					title: localize('gettingStarted.dictation.title', "Use dictation to write code and text in the editor and terminal"),
					description: localize('gettingStarted.dictation.description.interpolated', "Dictation allows you to write code and text using your voice. It can be activated with the Voice: Start Dictation in Editor command.\n{0}\n For dictation in the terminal, use the Voice: Start Dictation in Terminal and Voice: Stop Dictation in Terminal commands.\n{1}\n{2}", Button(localize('toggleDictation', "Voice: Start Dictation in Editor"), 'command:workbench.action.editorDictation.start'), Button(localize('terminalStartDictation', "Terminal: Start Dictation in Terminal"), 'command:workbench.action.terminal.startVoice'), Button(localize('terminalStopDictation', "Terminal: Stop Dictation in Terminal"), 'command:workbench.action.terminal.stopVoice')),
					when: 'hasSpeechProvider',
					media: { type: 'markdown', path: 'empty' }
				}
			]
		}
	},
	{
		id: 'Beginner',
		isFeatured: false,
		title: localize('gettingStarted.beginner.title', "Learn the Fundamentals"),
		icon: beginnerIcon,
		description: localize('gettingStarted.beginner.description', "Get an overview of the most essential features"),
		walkthroughPageTitle: localize('gettingStarted.beginner.walkthroughPageTitle', 'Essential Features'),
		content: {
			type: 'steps',
			steps: [
				{
					id: 'settingsAndSync',
					title: localize('gettingStarted.settings.title', "Tune your settings"),
					description: localize('gettingStarted.settingsAndSync.description.interpolated', "Customize every aspect of VS Code and [sync](command:workbench.userDataSync.actions.turnOn) customizations across devices.\n{0}", Button(localize('tweakSettings', "Open Settings"), 'command:toSide:workbench.action.openSettings')),
					when: 'workspacePlatform != \'webworker\' && syncStatus != uninitialized',
					completionEvents: ['onEvent:sync-enabled'],
					media: {
						type: 'svg', altText: 'VS Code Settings', path: 'settings.svg'
					},
				},
				{
					id: 'extensions',
					title: localize('gettingStarted.extensions.title', "Code with extensions"),
					description: localize('gettingStarted.extensions.description.interpolated', "Extensions are VS Code's power-ups. They range from handy productivity hacks, expanding out-of-the-box features, to adding completely new capabilities.\n{0}", Button(localize('browsePopular', "Browse Popular Extensions"), 'command:workbench.extensions.action.showPopularExtensions')),
					when: 'workspacePlatform != \'webworker\'',
					media: {
						type: 'svg', altText: 'VS Code extension marketplace with featured language extensions', path: 'extensions.svg'
					},
				},
				{
					id: 'terminal',
					title: localize('gettingStarted.terminal.title', "Built-in terminal"),
					description: localize('gettingStarted.terminal.description.interpolated', "Quickly run shell commands and monitor build output, right next to your code.\n{0}", Button(localize('showTerminal', "Open Terminal"), 'command:workbench.action.terminal.toggleTerminal')),
					when: 'workspacePlatform != \'webworker\' && remoteName != codespaces && !terminalIsOpen',
					media: {
						type: 'svg', altText: 'Integrated terminal running a few npm commands', path: 'terminal.svg'
					},
				},
				{
					id: 'debugging',
					title: localize('gettingStarted.debug.title', "Watch your code in action"),
					description: localize('gettingStarted.debug.description.interpolated', "Accelerate your edit, build, test, and debug loop by setting up a launch configuration.\n{0}", Button(localize('runProject', "Run your Project"), 'command:workbench.action.debug.selectandstart')),
					when: 'workspacePlatform != \'webworker\' && workspaceFolderCount != 0',
					media: {
						type: 'svg', altText: 'Run and debug view.', path: 'debug.svg',
					},
				},
				{
					id: 'scmClone',
					title: localize('gettingStarted.scm.title', "Track your code with Git"),
					description: localize('gettingStarted.scmClone.description.interpolated', "Set up the built-in version control for your project to track your changes and collaborate with others.\n{0}", Button(localize('cloneRepo', "Clone Repository"), 'command:git.clone')),
					when: 'config.git.enabled && !git.missing && workspaceFolderCount == 0',
					media: {
						type: 'svg', altText: 'Source Control view.', path: 'git.svg',
					},
				},
				{
					id: 'scmSetup',
					title: localize('gettingStarted.scm.title', "Track your code with Git"),
					description: localize('gettingStarted.scmSetup.description.interpolated', "Set up the built-in version control for your project to track your changes and collaborate with others.\n{0}", Button(localize('initRepo', "Initialize Git Repository"), 'command:git.init')),
					when: 'config.git.enabled && !git.missing && workspaceFolderCount != 0 && gitOpenRepositoryCount == 0',
					media: {
						type: 'svg', altText: 'Source Control view.', path: 'git.svg',
					},
				},
				{
					id: 'scm',
					title: localize('gettingStarted.scm.title', "Track your code with Git"),
					description: localize('gettingStarted.scm.description.interpolated', "No more looking up Git commands! Git and GitHub workflows are seamlessly integrated.\n{0}", Button(localize('openSCM', "Open Source Control"), 'command:workbench.view.scm')),
					when: 'config.git.enabled && !git.missing && workspaceFolderCount != 0 && gitOpenRepositoryCount != 0 && activeViewlet != \'workbench.view.scm\'',
					media: {
						type: 'svg', altText: 'Source Control view.', path: 'git.svg',
					},
				},
				{
					id: 'installGit',
					title: localize('gettingStarted.installGit.title', "Install Git"),
					description: localize({ key: 'gettingStarted.installGit.description.interpolated', comment: ['The placeholders are command link items should not be translated'] }, "Install Git to track changes in your projects.\n{0}\n{1}Reload window{2} after installation to complete Git setup.", Button(localize('installGit', "Install Git"), 'https://aka.ms/vscode-install-git'), '[', '](command:workbench.action.reloadWindow)'),
					when: 'git.missing',
					media: {
						type: 'svg', altText: 'Install Git.', path: 'git.svg',
					},
					completionEvents: [
						'onContext:git.state == initialized'
					]
				},

				{
					id: 'tasks',
					title: localize('gettingStarted.tasks.title', "Automate your project tasks"),
					when: 'workspaceFolderCount != 0 && workspacePlatform != \'webworker\'',
					description: localize('gettingStarted.tasks.description.interpolated', "Create tasks for your common workflows and enjoy the integrated experience of running scripts and automatically checking results.\n{0}", Button(localize('runTasks', "Run Auto-detected Tasks"), 'command:workbench.action.tasks.runTask')),
					media: {
						type: 'svg', altText: 'Task runner.', path: 'runTask.svg',
					},
				},
				{
					id: 'shortcuts',
					title: localize('gettingStarted.shortcuts.title', "Customize your shortcuts"),
					description: localize('gettingStarted.shortcuts.description.interpolated', "Once you have discovered your favorite commands, create custom keyboard shortcuts for instant access.\n{0}", Button(localize('keyboardShortcuts', "Keyboard Shortcuts"), 'command:toSide:workbench.action.openGlobalKeybindings')),
					media: {
						type: 'svg', altText: 'Interactive shortcuts.', path: 'shortcuts.svg',
					}
				},
				{
					id: 'workspaceTrust',
					title: localize('gettingStarted.workspaceTrust.title', "Safely browse and edit code"),
					description: localize('gettingStarted.workspaceTrust.description.interpolated', "{0} lets you decide whether your project folders should **allow or restrict** automatic code execution __(required for extensions, debugging, etc)__.\nOpening a file/folder will prompt to grant trust. You can always {1} later.", Button(localize('workspaceTrust', "Workspace Trust"), 'https://code.visualstudio.com/docs/editor/workspace-trust'), Button(localize('enableTrust', "enable trust"), 'command:toSide:workbench.trust.manage')),
					when: 'workspacePlatform != \'webworker\' && !isWorkspaceTrusted && workspaceFolderCount == 0',
					media: {
						type: 'svg', altText: 'Workspace Trust editor in Restricted mode and a primary button for switching to Trusted mode.', path: 'workspaceTrust.svg'
					},
				},
			]
		}
	},
	{
		id: 'notebooks',
		title: localize('gettingStarted.notebook.title', "Customize Notebooks"),
		description: '',
		icon: setupIcon,
		isFeatured: false,
		when: `config.${NotebookSetting.openGettingStarted} && userHasOpenedNotebook`,
		walkthroughPageTitle: localize('gettingStarted.notebook.walkthroughPageTitle', 'Notebooks'),
		content: {
			type: 'steps',
			steps: [
				{
					completionEvents: ['onCommand:notebook.setProfile'],
					id: 'notebookProfile',
					title: localize('gettingStarted.notebookProfile.title', "Select the layout for your notebooks"),
					description: localize('gettingStarted.notebookProfile.description', "Get notebooks to feel just the way you prefer"),
					when: 'userHasOpenedNotebook',
					media: {
						type: 'markdown', path: 'notebookProfile'
					}
				},
			]
		}
	}
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/common/media/ai-powered-suggestions.svg]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/common/media/ai-powered-suggestions.svg

```text
<svg viewBox="0 0 312 265" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g>
    <g>
      <g>
        <g>
          <path d="M33.8457 209.83L31.0859 214.453H33.8457V209.83ZM33.6523 208.752H35.0234V214.453H36.1895V215.414H35.0234V217.5H33.8457V215.414H30.1367V214.295L33.6523 208.752ZM38.3516 216.51H40.1914V209.9L37.9883 210.961V209.824L40.1797 208.781H41.3633V216.51H43.1797V217.5H38.3516V216.51Z" fill="var(--vscode-editorActiveLineNumber-foreground,
        #CCCCCC)" />
          <path d="M33.8457 230.83L31.0859 235.453H33.8457V230.83ZM33.6523 229.752H35.0234V235.453H36.1895V236.414H35.0234V238.5H33.8457V236.414H30.1367V235.295L33.6523 229.752ZM38.9551 237.504H42.9746V238.5H37.6602V237.504C38.3906 236.734 39.0293 236.055 39.5762 235.465C40.123 234.875 40.5 234.459 40.707 234.217C41.0977 233.74 41.3613 233.355 41.498 233.062C41.6348 232.766 41.7031 232.463 41.7031 232.154C41.7031 231.666 41.5586 231.283 41.2695 231.006C40.9844 230.729 40.5918 230.59 40.0918 230.59C39.7363 230.59 39.3633 230.654 38.9727 230.783C38.582 230.912 38.168 231.107 37.7305 231.369V230.174C38.1328 229.982 38.5273 229.838 38.9141 229.74C39.3047 229.643 39.6895 229.594 40.0684 229.594C40.9238 229.594 41.6113 229.822 42.1309 230.279C42.6543 230.732 42.916 231.328 42.916 232.066C42.916 232.441 42.8281 232.816 42.6523 233.191C42.4805 233.566 42.1992 233.98 41.8086 234.434C41.5898 234.688 41.2715 235.039 40.8535 235.488C40.4395 235.938 39.8066 236.609 38.9551 237.504Z" fill="var(--vscode-editorLineNumber-foreground,
        #6E7681)" />
        </g>
        <g>
          <g>
            <path d="M72.0273 211.275V207.883H73.1055V217H72.0273V216.174C71.8477 216.498 71.6074 216.746 71.3066 216.918C71.0098 217.086 70.666 217.17 70.2754 217.17C69.4824 217.17 68.8574 216.863 68.4004 216.25C67.9473 215.633 67.7207 214.783 67.7207 213.701C67.7207 212.635 67.9492 211.799 68.4062 211.193C68.8633 210.584 69.4863 210.279 70.2754 210.279C70.6699 210.279 71.0176 210.365 71.3184 210.537C71.6191 210.705 71.8555 210.951 72.0273 211.275ZM68.8574 213.725C68.8574 214.561 68.9902 215.191 69.2559 215.617C69.5215 216.043 69.9141 216.256 70.4336 216.256C70.9531 216.256 71.3477 216.041 71.6172 215.611C71.8906 215.182 72.0273 214.553 72.0273 213.725C72.0273 212.893 71.8906 212.264 71.6172 211.838C71.3477 211.408 70.9531 211.193 70.4336 211.193C69.9141 211.193 69.5215 211.406 69.2559 211.832C68.9902 212.258 68.8574 212.889 68.8574 213.725ZM78.4398 211.193C77.893 211.193 77.4789 211.406 77.1977 211.832C76.9164 212.258 76.7758 212.889 76.7758 213.725C76.7758 214.557 76.9164 215.188 77.1977 215.617C77.4789 216.043 77.893 216.256 78.4398 216.256C78.9906 216.256 79.4066 216.043 79.6879 215.617C79.9691 215.188 80.1098 214.557 80.1098 213.725C80.1098 212.889 79.9691 212.258 79.6879 211.832C79.4066 211.406 78.9906 211.193 78.4398 211.193ZM78.4398 210.279C79.35 210.279 80.0453 210.574 80.5258 211.164C81.0102 211.754 81.2523 212.607 81.2523 213.725C81.2523 214.846 81.0121 215.701 80.5316 216.291C80.0512 216.877 79.3539 217.17 78.4398 217.17C77.5297 217.17 76.8344 216.877 76.3539 216.291C75.8734 215.701 75.6332 214.846 75.6332 213.725C75.6332 212.607 75.8734 211.754 76.3539 211.164C76.8344 210.574 77.5297 210.279 78.4398 210.279ZM83.8035 214.516V210.449H84.8816V214.516C84.8816 215.105 84.9852 215.539 85.1922 215.816C85.4031 216.094 85.7273 216.232 86.1648 216.232C86.6727 216.232 87.0613 216.055 87.3309 215.699C87.6004 215.34 87.7352 214.826 87.7352 214.158V210.449H88.8191V217H87.7352V216.016C87.5437 216.395 87.282 216.682 86.95 216.877C86.6219 217.072 86.2371 217.17 85.7957 217.17C85.1238 217.17 84.6238 216.951 84.2957 216.514C83.9676 216.072 83.8035 215.406 83.8035 214.516ZM95.8703 213.725C95.8703 212.889 95.7375 212.258 95.4719 211.832C95.2062 211.406 94.8137 211.193 94.2941 211.193C93.7707 211.193 93.3742 211.408 93.1047 211.838C92.8352 212.264 92.7004 212.893 92.7004 213.725C92.7004 214.553 92.8352 215.182 93.1047 215.611C93.3742 216.041 93.7707 216.256 94.2941 216.256C94.8137 216.256 95.2062 216.043 95.4719 215.617C95.7375 215.191 95.8703 214.561 95.8703 213.725ZM92.7004 211.275C92.8723 210.955 93.1086 210.709 93.4094 210.537C93.7141 210.365 94.0656 210.279 94.4641 210.279C95.2531 210.279 95.8742 210.584 96.3273 211.193C96.7805 211.799 97.007 212.635 97.007 213.701C97.007 214.783 96.7785 215.633 96.3215 216.25C95.8684 216.863 95.2453 217.17 94.4523 217.17C94.0617 217.17 93.716 217.086 93.4152 216.918C93.1184 216.746 92.8801 216.498 92.7004 216.174V217H91.6223V207.883H92.7004V211.275ZM102.535 214.627C102.535 215.111 102.623 215.477 102.798 215.723C102.978 215.969 103.242 216.092 103.589 216.092H104.849V217H103.484C102.839 217 102.339 216.795 101.984 216.385C101.632 215.971 101.457 215.385 101.457 214.627V208.691H99.7281V207.848H102.535V214.627ZM112.715 213.18V213.707H108.045V213.742C108.014 214.637 108.184 215.279 108.555 215.67C108.93 216.061 109.457 216.256 110.137 216.256C110.48 216.256 110.84 216.201 111.215 216.092C111.59 215.982 111.99 215.816 112.416 215.594V216.666C112.006 216.834 111.609 216.959 111.227 217.041C110.848 217.127 110.48 217.17 110.125 217.17C109.105 217.17 108.309 216.865 107.734 216.256C107.16 215.643 106.873 214.799 106.873 213.725C106.873 212.678 107.154 211.842 107.717 211.217C108.279 210.592 109.029 210.279 109.967 210.279C110.803 210.279 111.461 210.562 111.941 211.129C112.426 211.695 112.684 212.379 112.715 213.18ZM111.637 212.863C111.59 212.41 111.424 212.02 111.139 211.691C110.857 211.359 110.451 211.193 109.92 211.193C109.4 211.193 108.973 211.365 108.637 211.709C108.301 212.053 108.117 212.439 108.086 212.869L111.637 212.863Z" fill="var(--vscode-terminal-ansiBrightBlue,
        #3B8EEA)" />
            <path d="M125.774 211.105C125.907 210.824 126.075 210.617 126.278 210.484C126.485 210.348 126.733 210.279 127.022 210.279C127.55 210.279 127.921 210.484 128.136 210.895C128.354 211.301 128.464 212.068 128.464 213.197V217H127.479V213.244C127.479 212.318 127.427 211.744 127.321 211.521C127.22 211.295 127.032 211.182 126.759 211.182C126.446 211.182 126.231 211.303 126.114 211.545C126.001 211.783 125.944 212.35 125.944 213.244V217H124.96V213.244C124.96 212.307 124.903 211.729 124.79 211.51C124.68 211.291 124.481 211.182 124.192 211.182C123.907 211.182 123.708 211.303 123.595 211.545C123.485 211.783 123.43 212.35 123.43 213.244V217H122.452V210.438H123.43V211C123.559 210.766 123.72 210.588 123.911 210.467C124.106 210.342 124.327 210.279 124.573 210.279C124.87 210.279 125.116 210.348 125.311 210.484C125.511 210.621 125.665 210.828 125.774 211.105ZM131.495 210.461H134.255V216.162H136.394V217H131.038V216.162H133.177V211.299H131.495V210.461ZM133.177 207.912H134.255V209.271H133.177V207.912ZM143.632 212.934V217H142.548V212.934C142.548 212.344 142.445 211.91 142.238 211.633C142.031 211.355 141.707 211.217 141.265 211.217C140.761 211.217 140.373 211.396 140.099 211.756C139.83 212.111 139.695 212.623 139.695 213.291V217H138.617V210.438H139.695V211.422C139.886 211.047 140.146 210.764 140.474 210.572C140.802 210.377 141.191 210.279 141.64 210.279C142.308 210.279 142.806 210.5 143.134 210.941C143.466 211.379 143.632 212.043 143.632 212.934ZM153.651 214.07H159.844V215.061H153.651V214.07ZM153.651 211.311H159.844V212.301H153.651V211.311ZM174.497 210.666V211.721C174.189 211.541 173.878 211.406 173.566 211.316C173.253 211.227 172.935 211.182 172.611 211.182C172.122 211.182 171.757 211.262 171.515 211.422C171.277 211.578 171.157 211.818 171.157 212.143C171.157 212.436 171.247 212.654 171.427 212.799C171.607 212.943 172.054 213.084 172.769 213.221L173.202 213.303C173.738 213.404 174.142 213.607 174.415 213.912C174.693 214.217 174.831 214.613 174.831 215.102C174.831 215.75 174.601 216.258 174.14 216.625C173.679 216.988 173.038 217.17 172.218 217.17C171.894 217.17 171.554 217.135 171.198 217.064C170.843 216.998 170.458 216.896 170.044 216.76V215.646C170.446 215.854 170.831 216.01 171.198 216.115C171.566 216.217 171.913 216.268 172.241 216.268C172.718 216.268 173.087 216.172 173.349 215.98C173.611 215.785 173.741 215.514 173.741 215.166C173.741 214.666 173.263 214.32 172.306 214.129L172.259 214.117L171.855 214.035C171.234 213.914 170.78 213.711 170.495 213.426C170.21 213.137 170.068 212.744 170.068 212.248C170.068 211.619 170.28 211.135 170.706 210.795C171.132 210.451 171.739 210.279 172.529 210.279C172.88 210.279 173.218 210.312 173.542 210.379C173.866 210.441 174.185 210.537 174.497 210.666ZM180.74 213.701H180.382C179.754 213.701 179.279 213.812 178.959 214.035C178.642 214.254 178.484 214.582 178.484 215.02C178.484 215.414 178.603 215.721 178.841 215.939C179.08 216.158 179.41 216.268 179.832 216.268C180.425 216.268 180.892 216.062 181.232 215.652C181.572 215.238 181.744 214.668 181.748 213.941V213.701H180.74ZM182.832 213.256V217H181.748V216.027C181.517 216.418 181.226 216.707 180.875 216.895C180.527 217.078 180.103 217.17 179.603 217.17C178.935 217.17 178.402 216.982 178.004 216.607C177.605 216.229 177.406 215.723 177.406 215.09C177.406 214.359 177.65 213.805 178.138 213.426C178.63 213.047 179.351 212.857 180.3 212.857H181.748V212.688C181.744 212.164 181.611 211.785 181.349 211.551C181.088 211.312 180.67 211.193 180.095 211.193C179.728 211.193 179.357 211.246 178.982 211.352C178.607 211.457 178.242 211.611 177.886 211.814V210.736C178.285 210.584 178.666 210.471 179.029 210.396C179.396 210.318 179.752 210.279 180.095 210.279C180.638 210.279 181.101 210.359 181.484 210.52C181.871 210.68 182.183 210.92 182.421 211.24C182.57 211.436 182.675 211.678 182.738 211.967C182.8 212.252 182.832 212.682 182.832 213.256ZM188.418 211.105C188.551 210.824 188.719 210.617 188.922 210.484C189.129 210.348 189.377 210.279 189.666 210.279C190.193 210.279 190.564 210.484 190.779 210.895C190.998 211.301 191.107 212.068 191.107 213.197V217H190.123V213.244C190.123 212.318 190.07 211.744 189.965 211.521C189.863 211.295 189.676 211.182 189.402 211.182C189.09 211.182 188.875 211.303 188.758 211.545C188.645 211.783 188.588 212.35 188.588 213.244V217H187.604V213.244C187.604 212.307 187.547 211.729 187.434 211.51C187.324 211.291 187.125 211.182 186.836 211.182C186.551 211.182 186.352 211.303 186.238 211.545C186.129 211.783 186.074 212.35 186.074 213.244V217H185.096V210.438H186.074V211C186.203 210.766 186.363 210.588 186.555 210.467C186.75 210.342 186.971 210.279 187.217 210.279C187.514 210.279 187.76 210.348 187.955 210.484C188.154 210.621 188.309 210.828 188.418 211.105ZM194.485 216.174V219.496H193.401V210.438H194.485V211.275C194.664 210.951 194.903 210.705 195.2 210.537C195.5 210.365 195.846 210.279 196.237 210.279C197.03 210.279 197.651 210.586 198.1 211.199C198.553 211.812 198.78 212.662 198.78 213.748C198.78 214.814 198.553 215.652 198.1 216.262C197.647 216.867 197.026 217.17 196.237 217.17C195.838 217.17 195.489 217.086 195.188 216.918C194.891 216.746 194.657 216.498 194.485 216.174ZM197.649 213.725C197.649 212.889 197.516 212.258 197.25 211.832C196.989 211.406 196.598 211.193 196.079 211.193C195.555 211.193 195.159 211.408 194.889 211.838C194.62 212.264 194.485 212.893 194.485 213.725C194.485 214.553 194.62 215.182 194.889 215.611C195.159 216.041 195.555 216.256 196.079 216.256C196.598 216.256 196.989 216.043 197.25 215.617C197.516 215.191 197.649 214.561 197.649 213.725ZM204.331 214.627C204.331 215.111 204.419 215.477 204.595 215.723C204.774 215.969 205.038 216.092 205.386 216.092H206.645V217H205.28C204.636 217 204.136 216.795 203.78 216.385C203.429 215.971 203.253 215.385 203.253 214.627V208.691H201.524V207.848H204.331V214.627ZM214.511 213.18V213.707H209.841V213.742C209.81 214.637 209.98 215.279 210.351 215.67C210.726 216.061 211.253 216.256 211.933 216.256C212.277 216.256 212.636 216.201 213.011 216.092C213.386 215.982 213.786 215.816 214.212 215.594V216.666C213.802 216.834 213.405 216.959 213.023 217.041C212.644 217.127 212.277 217.17 211.921 217.17C210.902 217.17 210.105 216.865 209.53 216.256C208.956 215.643 208.669 214.799 208.669 213.725C208.669 212.678 208.95 211.842 209.513 211.217C210.075 210.592 210.825 210.279 211.763 210.279C212.599 210.279 213.257 210.562 213.738 211.129C214.222 211.695 214.48 212.379 214.511 213.18ZM213.433 212.863C213.386 212.41 213.22 212.02 212.935 211.691C212.654 211.359 212.247 211.193 211.716 211.193C211.196 211.193 210.769 211.365 210.433 211.709C210.097 212.053 209.913 212.439 209.882 212.869L213.433 212.863ZM221.48 210.666V211.721C221.171 211.541 220.861 211.406 220.548 211.316C220.236 211.227 219.918 211.182 219.593 211.182C219.105 211.182 218.74 211.262 218.498 211.422C218.259 211.578 218.14 211.818 218.14 212.143C218.14 212.436 218.23 212.654 218.41 212.799C218.589 212.943 219.037 213.084 219.752 213.221L220.185 213.303C220.72 213.404 221.125 213.607 221.398 213.912C221.675 214.217 221.814 214.613 221.814 215.102C221.814 215.75 221.584 216.258 221.123 216.625C220.662 216.988 220.021 217.17 219.201 217.17C218.877 217.17 218.537 217.135 218.181 217.064C217.826 216.998 217.441 216.896 217.027 216.76V215.646C217.429 215.854 217.814 216.01 218.181 216.115C218.548 216.217 218.896 216.268 219.224 216.268C219.701 216.268 220.07 216.172 220.332 215.98C220.593 215.785 220.724 215.514 220.724 215.166C220.724 214.666 220.246 214.32 219.289 214.129L219.242 214.117L218.837 214.035C218.216 213.914 217.763 213.711 217.478 213.426C217.193 213.137 217.05 212.744 217.05 212.248C217.05 211.619 217.263 211.135 217.689 210.795C218.115 210.451 218.722 210.279 219.511 210.279C219.863 210.279 220.201 210.312 220.525 210.379C220.849 210.441 221.168 210.537 221.48 210.666ZM249.691 214.885H251.519V216.438L250.364 218.676H249.111L249.691 216.438V214.885ZM249.614 210.443H251.443V212.559H249.614V210.443ZM111.18 232.275V228.883H112.258V238H111.18V237.174C111 237.498 110.76 237.746 110.459 237.918C110.162 238.086 109.818 238.17 109.428 238.17C108.635 238.17 108.01 237.863 107.553 237.25C107.1 236.633 106.873 235.783 106.873 234.701C106.873 233.635 107.102 232.799 107.559 232.193C108.016 231.584 108.639 231.279 109.428 231.279C109.822 231.279 110.17 231.365 110.471 231.537C110.771 231.705 111.008 231.951 111.18 232.275ZM108.01 234.725C108.01 235.561 108.143 236.191 108.408 236.617C108.674 237.043 109.066 237.256 109.586 237.256C110.105 237.256 110.5 237.041 110.77 236.611C111.043 236.182 111.18 235.553 111.18 234.725C111.18 233.893 111.043 233.264 110.77 232.838C110.5 232.408 110.105 232.193 109.586 232.193C109.066 232.193 108.674 232.406 108.408 232.832C108.143 233.258 108.01 233.889 108.01 234.725ZM117.592 232.193C117.045 232.193 116.631 232.406 116.35 232.832C116.069 233.258 115.928 233.889 115.928 234.725C115.928 235.557 116.069 236.188 116.35 236.617C116.631 237.043 117.045 237.256 117.592 237.256C118.143 237.256 118.559 237.043 118.84 236.617C119.121 236.188 119.262 235.557 119.262 234.725C119.262 233.889 119.121 233.258 118.84 232.832C118.559 232.406 118.143 232.193 117.592 232.193ZM117.592 231.279C118.502 231.279 119.198 231.574 119.678 232.164C120.162 232.754 120.405 233.607 120.405 234.725C120.405 235.846 120.164 236.701 119.684 237.291C119.204 237.877 118.506 238.17 117.592 238.17C116.682 238.17 115.987 237.877 115.506 237.291C115.026 236.701 114.786 235.846 114.786 234.725C114.786 233.607 115.026 232.754 115.506 232.164C115.987 231.574 116.682 231.279 117.592 231.279ZM151.006 231.666V232.721C150.697 232.541 150.387 232.406 150.074 232.316C149.762 232.227 149.443 232.182 149.119 232.182C148.631 232.182 148.266 232.262 148.023 232.422C147.785 232.578 147.666 232.818 147.666 233.143C147.666 233.436 147.756 233.654 147.936 233.799C148.115 233.943 148.562 234.084 149.277 234.221L149.711 234.303C150.246 234.404 150.65 234.607 150.924 234.912C151.201 235.217 151.34 235.613 151.34 236.102C151.34 236.75 151.109 237.258 150.648 237.625C150.188 237.988 149.547 238.17 148.727 238.17C148.402 238.17 148.062 238.135 147.707 238.064C147.352 237.998 146.967 237.896 146.553 237.76V236.646C146.955 236.854 147.34 237.01 147.707 237.115C148.074 237.217 148.422 237.268 148.75 237.268C149.227 237.268 149.596 237.172 149.857 236.98C150.119 236.785 150.25 236.514 150.25 236.166C150.25 235.666 149.771 235.32 148.814 235.129L148.768 235.117L148.363 235.035C147.742 234.914 147.289 234.711 147.004 234.426C146.719 234.137 146.576 233.744 146.576 233.248C146.576 232.619 146.789 232.135 147.215 231.795C147.641 231.451 148.248 231.279 149.037 231.279C149.389 231.279 149.727 231.312 150.051 231.379C150.375 231.441 150.693 231.537 151.006 231.666ZM157.248 234.701H156.891C156.262 234.701 155.787 234.812 155.467 235.035C155.151 235.254 154.993 235.582 154.993 236.02C154.993 236.414 155.112 236.721 155.35 236.939C155.588 237.158 155.918 237.268 156.34 237.268C156.934 237.268 157.401 237.062 157.741 236.652C158.08 236.238 158.252 235.668 158.256 234.941V234.701H157.248ZM159.34 234.256V238H158.256V237.027C158.026 237.418 157.735 237.707 157.383 237.895C157.036 238.078 156.612 238.17 156.112 238.17C155.444 238.17 154.911 237.982 154.512 237.607C154.114 237.229 153.914 236.723 153.914 236.09C153.914 235.359 154.159 234.805 154.647 234.426C155.139 234.047 155.86 233.857 156.809 233.857H158.256V233.688C158.252 233.164 158.12 232.785 157.858 232.551C157.596 232.312 157.178 232.193 156.604 232.193C156.237 232.193 155.866 232.246 155.491 232.352C155.116 232.457 154.75 232.611 154.395 232.814V231.736C154.793 231.584 155.174 231.471 155.537 231.396C155.905 231.318 156.26 231.279 156.604 231.279C157.147 231.279 157.61 231.359 157.993 231.52C158.379 231.68 158.692 231.92 158.93 232.24C159.079 232.436 159.184 232.678 159.246 232.967C159.309 233.252 159.34 233.682 159.34 234.256ZM164.927 232.105C165.059 231.824 165.227 231.617 165.43 231.484C165.637 231.348 165.886 231.279 166.175 231.279C166.702 231.279 167.073 231.484 167.288 231.895C167.507 232.301 167.616 233.068 167.616 234.197V238H166.632V234.244C166.632 233.318 166.579 232.744 166.473 232.521C166.372 232.295 166.184 232.182 165.911 232.182C165.598 232.182 165.384 232.303 165.266 232.545C165.153 232.783 165.096 233.35 165.096 234.244V238H164.112V234.244C164.112 233.307 164.055 232.729 163.942 232.51C163.833 232.291 163.634 232.182 163.345 232.182C163.059 232.182 162.86 232.303 162.747 232.545C162.637 232.783 162.583 233.35 162.583 234.244V238H161.604V231.438H162.583V232C162.712 231.766 162.872 231.588 163.063 231.467C163.259 231.342 163.479 231.279 163.725 231.279C164.022 231.279 164.268 231.348 164.464 231.484C164.663 231.621 164.817 231.828 164.927 232.105ZM170.993 237.174V240.496H169.909V231.438H170.993V232.275C171.173 231.951 171.411 231.705 171.708 231.537C172.009 231.365 172.355 231.279 172.745 231.279C173.538 231.279 174.159 231.586 174.609 232.199C175.062 232.812 175.288 233.662 175.288 234.748C175.288 235.814 175.062 236.652 174.609 237.262C174.155 237.867 173.534 238.17 172.745 238.17C172.347 238.17 171.997 238.086 171.696 237.918C171.4 237.746 171.165 237.498 170.993 237.174ZM174.157 234.725C174.157 233.889 174.025 233.258 173.759 232.832C173.497 232.406 173.107 232.193 172.587 232.193C172.064 232.193 171.667 232.408 171.398 232.838C171.128 233.264 170.993 233.893 170.993 234.725C170.993 235.553 171.128 236.182 171.398 236.611C171.667 237.041 172.064 237.256 172.587 237.256C173.107 237.256 173.497 237.043 173.759 236.617C174.025 236.191 174.157 235.561 174.157 234.725ZM180.839 235.627C180.839 236.111 180.927 236.477 181.103 236.723C181.283 236.969 181.546 237.092 181.894 237.092H183.154V238H181.789C181.144 238 180.644 237.795 180.289 237.385C179.937 236.971 179.761 236.385 179.761 235.627V229.691H178.033V228.848H180.839V235.627ZM191.02 234.18V234.707H186.35V234.742C186.318 235.637 186.488 236.279 186.859 236.67C187.234 237.061 187.762 237.256 188.441 237.256C188.785 237.256 189.145 237.201 189.52 237.092C189.895 236.982 190.295 236.816 190.721 236.594V237.666C190.311 237.834 189.914 237.959 189.531 238.041C189.152 238.127 188.785 238.17 188.43 238.17C187.41 238.17 186.613 237.865 186.039 237.256C185.465 236.643 185.178 235.799 185.178 234.725C185.178 233.678 185.459 232.842 186.021 232.217C186.584 231.592 187.334 231.279 188.271 231.279C189.107 231.279 189.766 231.562 190.246 232.129C190.73 232.695 190.988 233.379 191.02 234.18ZM189.941 233.863C189.895 233.41 189.729 233.02 189.443 232.691C189.162 232.359 188.756 232.193 188.225 232.193C187.705 232.193 187.277 232.365 186.941 232.709C186.605 233.053 186.422 233.439 186.391 233.869L189.941 233.863ZM202.632 231.443H204.46V233.559H202.632V231.443ZM202.632 235.867H204.46V238H202.632V235.867ZM221.48 231.666V232.721C221.171 232.541 220.861 232.406 220.548 232.316C220.236 232.227 219.918 232.182 219.593 232.182C219.105 232.182 218.74 232.262 218.498 232.422C218.259 232.578 218.14 232.818 218.14 233.143C218.14 233.436 218.23 233.654 218.41 233.799C218.589 233.943 219.037 234.084 219.752 234.221L220.185 234.303C220.72 234.404 221.125 234.607 221.398 234.912C221.675 235.217 221.814 235.613 221.814 236.102C221.814 236.75 221.584 237.258 221.123 237.625C220.662 237.988 220.021 238.17 219.201 238.17C218.877 238.17 218.537 238.135 218.181 238.064C217.826 237.998 217.441 237.896 217.027 237.76V236.646C217.429 236.854 217.814 237.01 218.181 237.115C218.548 237.217 218.896 237.268 219.224 237.268C219.701 237.268 220.07 237.172 220.332 236.98C220.593 236.785 220.724 236.514 220.724 236.166C220.724 235.666 220.246 235.32 219.289 235.129L219.242 235.117L218.837 235.035C218.216 234.914 217.763 234.711 217.478 234.426C217.193 234.137 217.05 233.744 217.05 233.248C217.05 232.619 217.263 232.135 217.689 231.795C218.115 231.451 218.722 231.279 219.511 231.279C219.863 231.279 220.201 231.312 220.525 231.379C220.849 231.441 221.168 231.537 221.48 231.666ZM227.723 234.701H227.365C226.736 234.701 226.262 234.812 225.941 235.035C225.625 235.254 225.467 235.582 225.467 236.02C225.467 236.414 225.586 236.721 225.824 236.939C226.062 237.158 226.393 237.268 226.814 237.268C227.408 237.268 227.875 237.062 228.215 236.652C228.555 236.238 228.727 235.668 228.73 234.941V234.701H227.723ZM229.814 234.256V238H228.73V237.027C228.5 237.418 228.209 237.707 227.857 237.895C227.51 238.078 227.086 238.17 226.586 238.17C225.918 238.17 225.385 237.982 224.986 237.607C224.588 237.229 224.389 236.723 224.389 236.09C224.389 235.359 224.633 234.805 225.121 234.426C225.613 234.047 226.334 233.857 227.283 233.857H228.73V233.688C228.727 233.164 228.594 232.785 228.332 232.551C228.07 232.312 227.652 232.193 227.078 232.193C226.711 232.193 226.34 232.246 225.965 232.352C225.59 232.457 225.225 232.611 224.869 232.814V231.736C225.268 231.584 225.648 231.471 226.012 231.396C226.379 231.318 226.734 231.279 227.078 231.279C227.621 231.279 228.084 231.359 228.467 231.52C228.854 231.68 229.166 231.92 229.404 232.24C229.553 232.436 229.658 232.678 229.721 232.967C229.783 233.252 229.814 233.682 229.814 234.256ZM235.401 232.105C235.534 231.824 235.702 231.617 235.905 231.484C236.112 231.348 236.36 231.279 236.649 231.279C237.176 231.279 237.547 231.484 237.762 231.895C237.981 232.301 238.09 233.068 238.09 234.197V238H237.106V234.244C237.106 233.318 237.053 232.744 236.948 232.521C236.846 232.295 236.659 232.182 236.385 232.182C236.073 232.182 235.858 232.303 235.741 232.545C235.627 232.783 235.571 233.35 235.571 234.244V238H234.586V234.244C234.586 233.307 234.53 232.729 234.416 232.51C234.307 232.291 234.108 232.182 233.819 232.182C233.534 232.182 233.334 232.303 233.221 232.545C233.112 232.783 233.057 233.35 233.057 234.244V238H232.079V231.438H233.057V232C233.186 231.766 233.346 231.588 233.538 231.467C233.733 231.342 233.954 231.279 234.2 231.279C234.496 231.279 234.743 231.348 234.938 231.484C235.137 231.621 235.291 231.828 235.401 232.105ZM241.468 237.174V240.496H240.384V231.438H241.468V232.275C241.647 231.951 241.886 231.705 242.182 231.537C242.483 231.365 242.829 231.279 243.22 231.279C244.012 231.279 244.634 231.586 245.083 232.199C245.536 232.812 245.762 233.662 245.762 234.748C245.762 235.814 245.536 236.652 245.083 237.262C244.63 237.867 244.009 238.17 243.22 238.17C242.821 238.17 242.471 238.086 242.171 237.918C241.874 237.746 241.639 237.498 241.468 237.174ZM244.632 234.725C244.632 233.889 244.499 233.258 244.233 232.832C243.971 232.406 243.581 232.193 243.061 232.193C242.538 232.193 242.141 232.408 241.872 232.838C241.602 233.264 241.468 233.893 241.468 234.725C241.468 235.553 241.602 236.182 241.872 236.611C242.141 237.041 242.538 237.256 243.061 237.256C243.581 237.256 243.971 237.043 244.233 236.617C244.499 236.191 244.632 235.561 244.632 234.725ZM251.314 235.627C251.314 236.111 251.402 236.477 251.577 236.723C251.757 236.969 252.021 237.092 252.368 237.092H253.628V238H252.263C251.618 238 251.118 237.795 250.763 237.385C250.411 236.971 250.236 236.385 250.236 235.627V229.691H248.507V228.848H251.314V235.627ZM261.494 234.18V234.707H256.824V234.742C256.793 235.637 256.962 236.279 257.334 236.67C257.709 237.061 258.236 237.256 258.916 237.256C259.259 237.256 259.619 237.201 259.994 237.092C260.369 236.982 260.769 236.816 261.195 236.594V237.666C260.785 237.834 260.388 237.959 260.005 238.041C259.627 238.127 259.259 238.17 258.904 238.17C257.884 238.17 257.087 237.865 256.513 237.256C255.939 236.643 255.652 235.799 255.652 234.725C255.652 233.678 255.933 232.842 256.496 232.217C257.058 231.592 257.808 231.279 258.746 231.279C259.582 231.279 260.24 231.562 260.72 232.129C261.205 232.695 261.462 233.379 261.494 234.18ZM260.416 233.863C260.369 233.41 260.203 233.02 259.918 232.691C259.636 232.359 259.23 232.193 258.699 232.193C258.179 232.193 257.752 232.365 257.416 232.709C257.08 233.053 256.896 233.439 256.865 233.869L260.416 233.863ZM268.463 231.666V232.721C268.154 232.541 267.844 232.406 267.531 232.316C267.219 232.227 266.9 232.182 266.576 232.182C266.088 232.182 265.723 232.262 265.48 232.422C265.242 232.578 265.123 232.818 265.123 233.143C265.123 233.436 265.213 233.654 265.393 233.799C265.572 233.943 266.02 234.084 266.734 234.221L267.168 234.303C267.703 234.404 268.107 234.607 268.381 234.912C268.658 235.217 268.797 235.613 268.797 236.102C268.797 236.75 268.566 237.258 268.105 237.625C267.645 237.988 267.004 238.17 266.184 238.17C265.859 238.17 265.52 238.135 265.164 238.064C264.809 237.998 264.424 237.896 264.01 237.76V236.646C264.412 236.854 264.797 237.01 265.164 237.115C265.531 237.217 265.879 237.268 266.207 237.268C266.684 237.268 267.053 237.172 267.314 236.98C267.576 236.785 267.707 236.514 267.707 236.166C267.707 235.666 267.229 235.32 266.271 235.129L266.225 235.117L265.82 235.035C265.199 234.914 264.746 234.711 264.461 234.426C264.176 234.137 264.033 233.744 264.033 233.248C264.033 232.619 264.246 232.135 264.672 231.795C265.098 231.451 265.705 231.279 266.494 231.279C266.846 231.279 267.184 231.312 267.508 231.379C267.832 231.441 268.15 231.537 268.463 231.666Z" fill="var(--vscode-foreground,
        #CCCCCC)" />
            <path d="M226.908 207.297H229.393V208.135H227.986V217.158H229.393V217.996H226.908V207.297ZM235.049 208.123C235.983 208.123 236.688 208.504 237.164 209.266C237.645 210.027 237.885 211.154 237.885 212.646C237.885 214.139 237.645 215.266 237.164 216.027C236.688 216.789 235.983 217.17 235.049 217.17C234.116 217.17 233.411 216.789 232.934 216.027C232.457 215.266 232.219 214.139 232.219 212.646C232.219 211.154 232.457 210.027 232.934 209.266C233.411 208.504 234.116 208.123 235.049 208.123ZM235.049 216.232C235.604 216.232 236.016 215.938 236.286 215.348C236.559 214.758 236.696 213.857 236.696 212.646C236.696 212.002 236.657 211.42 236.579 210.9L233.789 215.266C234.082 215.91 234.502 216.232 235.049 216.232ZM235.049 209.061C234.498 209.061 234.086 209.355 233.813 209.945C233.543 210.535 233.409 211.436 233.409 212.646C233.409 213.197 233.446 213.713 233.52 214.193L236.25 209.84C235.954 209.32 235.553 209.061 235.049 209.061ZM243.489 207.297V217.996H241.005V217.158H242.411V208.135H241.005V207.297H243.489ZM103.332 228.309C102.812 229.199 102.423 230.088 102.166 230.975C101.912 231.857 101.785 232.748 101.785 233.646C101.785 234.541 101.912 235.432 102.166 236.318C102.423 237.205 102.812 238.098 103.332 238.996H102.394C101.804 238.066 101.365 237.162 101.076 236.283C100.787 235.4 100.642 234.521 100.642 233.646C100.642 232.775 100.787 231.898 101.076 231.016C101.365 230.133 101.804 229.23 102.394 228.309H103.332ZM272.631 228.309H273.569C274.159 229.23 274.598 230.133 274.887 231.016C275.176 231.898 275.321 232.775 275.321 233.646C275.321 234.525 275.176 235.406 274.887 236.289C274.598 237.172 274.159 238.074 273.569 238.996H272.631C273.151 238.09 273.538 237.193 273.791 236.307C274.049 235.42 274.178 234.533 274.178 233.646C274.178 232.756 274.049 231.867 273.791 230.98C273.538 230.094 273.151 229.203 272.631 228.309Z" fill="var(--vscode-terminal-ansiGreen,
        #0DBC79)" />
            <path d="M73.2285 228.883V229.779H72.0039C71.6172 229.779 71.3477 229.859 71.1953 230.02C71.0469 230.176 70.9727 230.455 70.9727 230.857V231.438H73.2285V232.275H70.9727V238H69.8945V232.275H68.1426V231.438H69.8945V230.98C69.8945 230.262 70.0586 229.732 70.3867 229.393C70.7188 229.053 71.2344 228.883 71.9336 228.883H73.2285ZM78.4398 232.193C77.893 232.193 77.4789 232.406 77.1977 232.832C76.9164 233.258 76.7758 233.889 76.7758 234.725C76.7758 235.557 76.9164 236.188 77.1977 236.617C77.4789 237.043 77.893 237.256 78.4398 237.256C78.9906 237.256 79.4066 237.043 79.6879 236.617C79.9691 236.188 80.1098 235.557 80.1098 234.725C80.1098 233.889 79.9691 233.258 79.6879 232.832C79.4066 232.406 78.9906 232.193 78.4398 232.193ZM78.4398 231.279C79.35 231.279 80.0453 231.574 80.5258 232.164C81.0102 232.754 81.2523 233.607 81.2523 234.725C81.2523 235.846 81.0121 236.701 80.5316 237.291C80.0512 237.877 79.3539 238.17 78.4398 238.17C77.5297 238.17 76.8344 237.877 76.3539 237.291C75.8734 236.701 75.6332 235.846 75.6332 234.725C75.6332 233.607 75.8734 232.754 76.3539 232.164C76.8344 231.574 77.5297 231.279 78.4398 231.279ZM89.4285 232.791C89.198 232.611 88.9637 232.48 88.7254 232.398C88.4871 232.316 88.2254 232.275 87.9402 232.275C87.2684 232.275 86.7547 232.486 86.3992 232.908C86.0437 233.33 85.866 233.939 85.866 234.736V238H84.782V231.438H85.866V232.721C86.0457 232.256 86.3211 231.9 86.6922 231.654C87.0672 231.404 87.5105 231.279 88.0223 231.279C88.2879 231.279 88.5359 231.312 88.7664 231.379C88.9969 231.445 89.2176 231.549 89.4285 231.689V232.791Z" fill="var(--vscode-terminal-ansiBrightMagenta,
        #D670D6)" />
          </g>
          <g>
            <g>
              <rect x="134" y="227" width="27" height="18" rx="4" fill="var(--vscode-editor-background,
        #1f1f1f)" />
              <rect x="134" y="227" width="27" height="18" rx="4" fill="var(--vscode-inlineEdit-modifiedChangedTextBackground,
        #9ccc2c)" fill-opacity="0.2" />
              <rect x="134.5" y="227.5" width="26" height="17" rx="3.5" stroke="var(--vscode-diffEditor-move-border,
        #868686)" stroke-opacity="0.286275" stroke-width="1" />
              <path d="M140.961 234.105C141.094 233.824 141.262 233.617 141.465 233.484C141.672 233.348 141.92 233.279 142.209 233.279C142.736 233.279 143.107 233.484 143.322 233.895C143.541 234.301 143.65 235.068 143.65 236.197V240H142.666V236.244C142.666 235.318 142.613 234.744 142.508 234.521C142.406 234.295 142.219 234.182 141.945 234.182C141.633 234.182 141.418 234.303 141.301 234.545C141.188 234.783 141.131 235.35 141.131 236.244V240H140.146V236.244C140.146 235.307 140.09 234.729 139.977 234.51C139.867 234.291 139.668 234.182 139.379 234.182C139.094 234.182 138.895 234.303 138.781 234.545C138.672 234.783 138.617 235.35 138.617 236.244V240H137.639V233.438H138.617V234C138.746 233.766 138.906 233.588 139.098 233.467C139.293 233.342 139.514 233.279 139.76 233.279C140.057 233.279 140.303 233.348 140.498 233.484C140.697 233.621 140.852 233.828 140.961 234.105ZM148.344 236.701H147.986C147.357 236.701 146.883 236.812 146.562 237.035C146.246 237.254 146.088 237.582 146.088 238.02C146.088 238.414 146.207 238.721 146.445 238.939C146.684 239.158 147.014 239.268 147.436 239.268C148.029 239.268 148.496 239.062 148.836 238.652C149.176 238.238 149.348 237.668 149.352 236.941V236.701H148.344ZM150.436 236.256V240H149.352V239.027C149.121 239.418 148.83 239.707 148.479 239.895C148.131 240.078 147.707 240.17 147.207 240.17C146.539 240.17 146.006 239.982 145.607 239.607C145.209 239.229 145.01 238.723 145.01 238.09C145.01 237.359 145.254 236.805 145.742 236.426C146.234 236.047 146.955 235.857 147.904 235.857H149.352V235.688C149.348 235.164 149.215 234.785 148.953 234.551C148.691 234.312 148.273 234.193 147.699 234.193C147.332 234.193 146.961 234.246 146.586 234.352C146.211 234.457 145.846 234.611 145.49 234.814V233.736C145.889 233.584 146.27 233.471 146.633 233.396C147 233.318 147.355 233.279 147.699 233.279C148.242 233.279 148.705 233.359 149.088 233.52C149.475 233.68 149.787 233.92 150.025 234.24C150.174 234.436 150.279 234.678 150.342 234.967C150.404 235.252 150.436 235.682 150.436 236.256ZM158.012 233.438L155.662 236.578L158.24 240H156.992L155.07 237.369L153.154 240H151.906L154.484 236.578L152.135 233.438H153.33L155.07 235.811L156.799 233.438H158.012Z" fill="var(--vscode-foreground,
        #CCCCCC)" />
            </g>
            <g>
              <rect x="118" y="203" width="27" height="18" rx="4" fill="var(--vscode-editor-background,
        #1F1F1F)" />
              <rect x="118" y="203" width="27" height="18" rx="4" fill="var(--vscode-diffEditor-removedLineBackground,
        #FF0000)" fill-opacity="0.2" />
              <rect x="118.5" y="203.5" width="26" height="17" rx="3.5" stroke="var(--vscode-diffEditor-removedLineBackground,
        #FF0000)" stroke-opacity="0.2" stroke-width="1" />
              <path d="M124.961 210.105C125.094 209.824 125.262 209.617 125.465 209.484C125.672 209.348 125.92 209.279 126.209 209.279C126.736 209.279 127.107 209.484 127.322 209.895C127.541 210.301 127.65 211.068 127.65 212.197V216H126.666V212.244C126.666 211.318 126.613 210.744 126.508 210.521C126.406 210.295 126.219 210.182 125.945 210.182C125.633 210.182 125.418 210.303 125.301 210.545C125.188 210.783 125.131 211.35 125.131 212.244V216H124.146V212.244C124.146 211.307 124.09 210.729 123.977 210.51C123.867 210.291 123.668 210.182 123.379 210.182C123.094 210.182 122.895 210.303 122.781 210.545C122.672 210.783 122.617 211.35 122.617 212.244V216H121.639V209.438H122.617V210C122.746 209.766 122.906 209.588 123.098 209.467C123.293 209.342 123.514 209.279 123.76 209.279C124.057 209.279 124.303 209.348 124.498 209.484C124.697 209.621 124.852 209.828 124.961 210.105ZM130.082 209.461H132.842V215.162H134.98V216H129.625V215.162H131.764V210.299H130.082V209.461ZM131.764 206.912H132.842V208.271H131.764V206.912ZM141.619 211.934V216H140.535V211.934C140.535 211.344 140.432 210.91 140.225 210.633C140.018 210.355 139.693 210.217 139.252 210.217C138.748 210.217 138.359 210.396 138.086 210.756C137.816 211.111 137.682 211.623 137.682 212.291V216H136.604V209.438H137.682V210.422C137.873 210.047 138.133 209.764 138.461 209.572C138.789 209.377 139.178 209.279 139.627 209.279C140.295 209.279 140.793 209.5 141.121 209.941C141.453 210.379 141.619 211.043 141.619 211.934Z" fill="var(--vscode-editor-foreground,
        #cccccc)" />
            </g>
            <path d="M126 223V229C126 230.657 127.343 232 129 232H133M133 232L130.455 229.375M133 232L130.455 235" stroke="var(--vscode-editorInlayHint-foreground,
        #969696)" stroke-width="1" />
          </g>
        </g>
        <g>
          <rect x="16.5" y="206.5" width="43" height="13" rx="1.5" fill="var(--vscode-button-background,
        #0e639c)" fill-opacity="0.301961" />
          <rect x="16.5" y="206.5" width="43" height="13" rx="1.5" stroke="var(--vscode-editorHoverWidget-highlightForeground,
        #2AAAFF)" stroke-width="1" />
          <g>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M56.8236 209.492L50.4711 216.992L49.8781 216.966L47.3656 213.388L47.9794 212.957L50.2127 216.137L56.2513 209.008L56.8236 209.492Z" fill="var(--vscode-breadcrumb-foreground,
        #CCCCCC)" />
          </g>
        </g>
      </g>
      <g filter="url(#filter0_d_2738_9213)">
        <rect x="17" y="15" width="199" height="182" rx="5" fill="var(--vscode-dropdown-background,
        #3c3c3c)" />
        <rect x="16.5" y="14.5" width="200" height="183" rx="5.5" stroke="var(--vscode-dropdown-border,
        #454545)" stroke-width="1" />
        <g>
          <g>
            <g>
              <g>
                <path d="M37.2324 35.1987C34.9873 35.1987 33.5962 33.6411 33.5962 31.1221C33.5962 28.603 34.9819 27.0508 37.2324 27.0508C39.0693 27.0508 40.4766 28.2539 40.5947 29.9189H39.0156C38.8599 29.022 38.1562 28.4312 37.2324 28.4312C36.0132 28.4312 35.2559 29.4624 35.2559 31.1221C35.2559 32.7817 36.0132 33.813 37.2378 33.813C38.167 33.813 38.8652 33.2651 39.021 32.4111H40.6001C40.4658 34.0654 39.1016 35.1987 37.2324 35.1987ZM44.564 35.1235C42.7432 35.1235 41.6475 33.9688 41.6475 32.0405C41.6475 30.1284 42.7593 28.9575 44.564 28.9575C46.3687 28.9575 47.4805 30.123 47.4805 32.0405C47.4805 33.9741 46.3848 35.1235 44.564 35.1235ZM44.564 33.8882C45.3965 33.8882 45.8745 33.2114 45.8745 32.0405C45.8745 30.8804 45.3911 30.1982 44.564 30.1982C43.7314 30.1982 43.2534 30.8804 43.2534 32.0405C43.2534 33.2114 43.7261 33.8882 44.564 33.8882ZM52.1802 28.9897C53.6787 28.9897 54.5972 30.1338 54.5972 32.0405C54.5972 33.9419 53.6895 35.0913 52.207 35.0913C51.3584 35.0913 50.7085 34.7207 50.4185 34.0977H50.3218V36.9604H48.7588V29.0864H50.2734V30.0586H50.3701C50.6924 29.3926 51.3638 28.9897 52.1802 28.9897ZM51.6484 33.8291C52.4917 33.8291 52.9912 33.1577 52.9912 32.0405C52.9912 30.9287 52.4863 30.2573 51.6538 30.2573C50.8213 30.2573 50.3057 30.9395 50.3057 32.0459C50.3057 33.1523 50.8213 33.8291 51.6484 33.8291ZM56.665 28.1787C56.1816 28.1787 55.7788 27.792 55.7788 27.3086C55.7788 26.8198 56.1816 26.4331 56.665 26.4331C57.1484 26.4331 57.5459 26.8198 57.5459 27.3086C57.5459 27.792 57.1484 28.1787 56.665 28.1787ZM55.8809 35V29.0864H57.4438V35H55.8809ZM59.082 35V26.8252H60.645V35H59.082ZM64.8989 35.1235C63.0781 35.1235 61.9824 33.9688 61.9824 32.0405C61.9824 30.1284 63.0942 28.9575 64.8989 28.9575C66.7036 28.9575 67.8154 30.123 67.8154 32.0405C67.8154 33.9741 66.7197 35.1235 64.8989 35.1235ZM64.8989 33.8882C65.7314 33.8882 66.2095 33.2114 66.2095 32.0405C66.2095 30.8804 65.7261 30.1982 64.8989 30.1982C64.0664 30.1982 63.5884 30.8804 63.5884 32.0405C63.5884 33.2114 64.061 33.8882 64.8989 33.8882ZM69.5396 27.6738H71.1025V29.1401H72.3325V30.3271H71.1025V33.0449C71.1025 33.5767 71.3389 33.8237 71.8706 33.8237C72.0747 33.8237 72.1821 33.813 72.3325 33.7969V34.9517C72.1392 34.9893 71.8491 35.0215 71.5483 35.0215C70.1089 35.0215 69.5396 34.5542 69.5396 33.4048V30.3271H68.6157V29.1401H69.5396V27.6738ZM78.1816 35H76.6294V27.2495H77.9829L81.5493 32.1855H81.646V27.2495H83.1982V35H81.8555L78.2783 30.0425H78.1816V35ZM88.7573 33.3296H90.2129C89.9819 34.4307 88.9561 35.1235 87.5059 35.1235C85.7012 35.1235 84.6377 33.9849 84.6377 32.0728C84.6377 30.1499 85.7227 28.9575 87.4844 28.9575C89.23 28.9575 90.2612 30.0747 90.2612 31.9438V32.4111H86.1953V32.4917C86.2168 33.394 86.7324 33.958 87.5488 33.958C88.1665 33.958 88.5908 33.7324 88.7573 33.3296ZM87.4897 30.123C86.7646 30.123 86.2544 30.644 86.2007 31.439H88.7251C88.6929 30.6279 88.2202 30.123 87.4897 30.123ZM93.7202 33.0503H93.6235L92.5225 35.0054H90.8682L92.7212 32.0835L90.8521 29.0918H92.6514L93.6987 31.0576H93.7954L94.8428 29.0918H96.5508L94.687 32.019L96.5615 35.0054H94.8267L93.7202 33.0503ZM98.1353 27.6738H99.6982V29.1401H100.928V30.3271H99.6982V33.0449C99.6982 33.5767 99.9346 33.8237 100.466 33.8237C100.67 33.8237 100.778 33.813 100.928 33.7969V34.9517C100.735 34.9893 100.445 35.0215 100.144 35.0215C98.7046 35.0215 98.1353 34.5542 98.1353 33.4048V30.3271H97.2114V29.1401H98.1353V27.6738ZM110.36 33.6626V35H105.225V27.2495H110.36V28.5869H106.847V30.4561H110.161V31.7021H106.847V33.6626H110.36ZM114.034 35.0913C112.541 35.0913 111.622 33.9204 111.622 32.0352C111.622 30.1553 112.546 28.9897 114.034 28.9897C114.834 28.9897 115.495 29.3765 115.801 30.0317H115.892V26.8252H117.455V35H115.94V34.0708H115.844C115.527 34.71 114.855 35.0913 114.034 35.0913ZM114.565 30.2573C113.733 30.2573 113.228 30.9287 113.228 32.0405C113.228 33.1577 113.728 33.8291 114.565 33.8291C115.403 33.8291 115.908 33.1523 115.908 32.0459C115.908 30.9395 115.398 30.2573 114.565 30.2573ZM119.872 28.1787C119.389 28.1787 118.986 27.792 118.986 27.3086C118.986 26.8198 119.389 26.4331 119.872 26.4331C120.355 26.4331 120.753 26.8198 120.753 27.3086C120.753 27.792 120.355 28.1787 119.872 28.1787ZM119.088 35V29.0864H120.651V35H119.088ZM122.681 27.6738H124.244V29.1401H125.474V30.3271H124.244V33.0449C124.244 33.5767 124.48 33.8237 125.012 33.8237C125.216 33.8237 125.324 33.813 125.474 33.7969V34.9517C125.281 34.9893 124.991 35.0215 124.69 35.0215C123.25 35.0215 122.681 34.5542 122.681 33.4048V30.3271H121.757V29.1401H122.681V27.6738ZM129.422 32.8569H130.99C131.065 33.5015 131.699 33.915 132.612 33.915C133.456 33.915 134.052 33.4907 134.052 32.8892C134.052 32.3789 133.665 32.0835 132.714 31.874L131.705 31.6538C130.292 31.353 129.599 30.6279 129.599 29.4517C129.599 28.0068 130.775 27.0508 132.564 27.0508C134.272 27.0508 135.48 28.0015 135.529 29.3711H134.003C133.928 28.7373 133.359 28.3237 132.575 28.3237C131.764 28.3237 131.227 28.7158 131.227 29.3228C131.227 29.8115 131.597 30.0962 132.505 30.2949L133.439 30.4937C134.997 30.8267 135.668 31.498 135.668 32.6958C135.668 34.2427 134.471 35.1987 132.526 35.1987C130.679 35.1987 129.481 34.291 129.422 32.8569ZM142.409 29.0864V35H140.895V34.0493H140.798C140.519 34.7368 139.965 35.1235 139.068 35.1235C137.79 35.1235 136.995 34.3125 136.995 32.9375V29.0864H138.558V32.5508C138.558 33.3887 138.929 33.813 139.648 33.813C140.427 33.813 140.846 33.3135 140.846 32.5024V29.0864H142.409ZM146.588 37.2397C145.014 37.2397 143.972 36.5576 143.875 35.521H145.422C145.503 35.897 145.943 36.1333 146.62 36.1333C147.458 36.1333 147.947 35.7358 147.947 35.0537V33.9526H147.85C147.522 34.5757 146.899 34.9141 146.067 34.9141C144.59 34.9141 143.671 33.7646 143.671 31.9922C143.671 30.1606 144.595 28.9897 146.099 28.9897C146.899 28.9897 147.582 29.3872 147.898 30.0317H147.995V29.0864H149.51V34.9893C149.51 36.3696 148.376 37.2397 146.588 37.2397ZM146.609 33.7163C147.458 33.7163 147.963 33.0503 147.963 31.9868C147.963 30.9233 147.453 30.2573 146.609 30.2573C145.766 30.2573 145.277 30.9233 145.277 31.9868C145.277 33.0503 145.761 33.7163 146.609 33.7163ZM153.688 37.2397C152.115 37.2397 151.073 36.5576 150.976 35.521H152.523C152.604 35.897 153.044 36.1333 153.721 36.1333C154.559 36.1333 155.047 35.7358 155.047 35.0537V33.9526H154.951C154.623 34.5757 154 34.9141 153.167 34.9141C151.69 34.9141 150.772 33.7646 150.772 31.9922C150.772 30.1606 151.696 28.9897 153.2 28.9897C154 28.9897 154.682 29.3872 154.999 30.0317H155.096V29.0864H156.61V34.9893C156.61 36.3696 155.477 37.2397 153.688 37.2397ZM153.71 33.7163C154.559 33.7163 155.063 33.0503 155.063 31.9868C155.063 30.9233 154.553 30.2573 153.71 30.2573C152.867 30.2573 152.378 30.9233 152.378 31.9868C152.378 33.0503 152.861 33.7163 153.71 33.7163ZM162.008 33.3296H163.464C163.233 34.4307 162.207 35.1235 160.757 35.1235C158.952 35.1235 157.889 33.9849 157.889 32.0728C157.889 30.1499 158.974 28.9575 160.735 28.9575C162.481 28.9575 163.512 30.0747 163.512 31.9438V32.4111H159.446V32.4917C159.468 33.394 159.983 33.958 160.8 33.958C161.417 33.958 161.842 33.7324 162.008 33.3296ZM160.741 30.123C160.016 30.123 159.505 30.644 159.452 31.439H161.976C161.944 30.6279 161.471 30.123 160.741 30.123ZM164.662 30.8105C164.662 29.7041 165.65 28.9575 167.127 28.9575C168.631 28.9575 169.517 29.5859 169.603 30.7031H168.158C168.078 30.311 167.718 30.0693 167.138 30.0693C166.579 30.0693 166.166 30.3325 166.166 30.7192C166.166 31.02 166.418 31.208 166.966 31.3315L168.078 31.5732C169.227 31.8257 169.743 32.3091 169.743 33.1899C169.743 34.3608 168.685 35.1235 167.132 35.1235C165.569 35.1235 164.624 34.4844 164.517 33.3672H166.042C166.16 33.7754 166.542 34.0171 167.165 34.0171C167.771 34.0171 168.19 33.7485 168.19 33.3564C168.19 33.0557 167.965 32.873 167.444 32.7549L166.37 32.5132C165.22 32.2607 164.662 31.7183 164.662 30.8105ZM171.44 27.6738H173.003V29.1401H174.233V30.3271H173.003V33.0449C173.003 33.5767 173.239 33.8237 173.771 33.8237C173.975 33.8237 174.083 33.813 174.233 33.7969V34.9517C174.04 34.9893 173.75 35.0215 173.449 35.0215C172.009 35.0215 171.44 34.5542 171.44 33.4048V30.3271H170.516V29.1401H171.44V27.6738ZM176.333 28.1787C175.85 28.1787 175.447 27.792 175.447 27.3086C175.447 26.8198 175.85 26.4331 176.333 26.4331C176.816 26.4331 177.214 26.8198 177.214 27.3086C177.214 27.792 176.816 28.1787 176.333 28.1787ZM175.549 35V29.0864H177.112V35H175.549ZM181.323 35.1235C179.502 35.1235 178.406 33.9688 178.406 32.0405C178.406 30.1284 179.518 28.9575 181.323 28.9575C183.127 28.9575 184.239 30.123 184.239 32.0405C184.239 33.9741 183.144 35.1235 181.323 35.1235ZM181.323 33.8882C182.155 33.8882 182.633 33.2114 182.633 32.0405C182.633 30.8804 182.15 30.1982 181.323 30.1982C180.49 30.1982 180.012 30.8804 180.012 32.0405C180.012 33.2114 180.485 33.8882 181.323 33.8882ZM185.518 35V29.0864H187.032V30.0371H187.129C187.403 29.3711 188.004 28.9575 188.88 28.9575C190.196 28.9575 190.905 29.7632 190.905 31.1758V35H189.342V31.5303C189.342 30.6978 188.993 30.2627 188.251 30.2627C187.526 30.2627 187.081 30.7783 187.081 31.5786V35H185.518Z" fill="var(--vscode-descriptionForeground,
        var(--vscode-descriptionForeground, #9d9d9d))" />
              </g>
            </g>
          </g>
        </g>
        <g>
          <g>
            <g>
              <g>
                <path d="M40.8867 63.1333L40.2333 62.5267L43.8733 58.8867H34.7733V58.0467H43.8733L40.2333 54.4067L40.8867 53.8L45.2733 58.14V58.7933L40.8867 63.1333Z" fill="var(--vscode-dropdown-foreground,
        #cccccc)" />
                <path d="M61.2734 58.6719C61.2734 60.8164 59.8379 62.2051 57.623 62.2051C55.2266 62.2051 53.7148 60.4941 53.7148 57.7695C53.7148 55.0801 55.2441 53.3398 57.6113 53.3398C59.5332 53.3398 60.9277 54.418 61.2148 56.123H59.8965C59.5684 55.0742 58.7656 54.5059 57.6113 54.5059C56.0469 54.5059 55.0566 55.7656 55.0566 57.7637C55.0566 59.791 56.0527 61.0391 57.6406 61.0391C59.0234 61.0391 59.9727 60.166 59.9844 58.8711V58.6836H57.8047V57.623H61.2734V58.6719ZM65.6328 62.123C63.7637 62.123 62.6211 60.875 62.6211 58.8184C62.6211 56.7676 63.7695 55.5137 65.6328 55.5137C67.4902 55.5137 68.6387 56.7617 68.6387 58.8184C68.6387 60.875 67.4961 62.123 65.6328 62.123ZM65.6328 61.0508C66.7227 61.0508 67.3438 60.2305 67.3438 58.8184C67.3438 57.4004 66.7227 56.5801 65.6328 56.5801C64.5371 56.5801 63.9219 57.4004 63.9219 58.8184C63.9219 60.2363 64.5371 61.0508 65.6328 61.0508ZM77.041 62H75.7285V54.6758H73.0684V53.5449H79.6953V54.6758H77.041V62ZM82.707 62.123C80.8379 62.123 79.6953 60.875 79.6953 58.8184C79.6953 56.7676 80.8438 55.5137 82.707 55.5137C84.5645 55.5137 85.7129 56.7617 85.7129 58.8184C85.7129 60.875 84.5703 62.123 82.707 62.123ZM82.707 61.0508C83.7969 61.0508 84.418 60.2305 84.418 58.8184C84.418 57.4004 83.7969 56.5801 82.707 56.5801C81.6113 56.5801 80.9961 57.4004 80.9961 58.8184C80.9961 60.2363 81.6113 61.0508 82.707 61.0508ZM90.7461 63.8047H89.6387L92.6738 53.1406H93.7871L90.7461 63.8047ZM103.643 62L102.869 59.7148H99.6465L98.8672 62H97.5195L100.572 53.5449H101.984L105.037 62H103.643ZM101.211 55.0391L99.9805 58.6602H102.535L101.311 55.0391H101.211ZM111.418 57.6816H110.193C110.047 57.0605 109.531 56.5859 108.688 56.5859C107.633 56.5859 106.988 57.418 106.988 58.7949C106.988 60.2012 107.639 61.0508 108.688 61.0508C109.484 61.0508 110.029 60.6758 110.193 59.9844H111.418C111.254 61.2383 110.27 62.123 108.693 62.123C106.836 62.123 105.699 60.8574 105.699 58.7949C105.699 56.7734 106.83 55.5137 108.688 55.5137C110.287 55.5137 111.254 56.4453 111.418 57.6816ZM118.262 57.6816H117.037C116.891 57.0605 116.375 56.5859 115.531 56.5859C114.477 56.5859 113.832 57.418 113.832 58.7949C113.832 60.2012 114.482 61.0508 115.531 61.0508C116.328 61.0508 116.873 60.6758 117.037 59.9844H118.262C118.098 61.2383 117.113 62.123 115.537 62.123C113.68 62.123 112.543 60.8574 112.543 58.7949C112.543 56.7734 113.674 55.5137 115.531 55.5137C117.131 55.5137 118.098 56.4453 118.262 57.6816ZM123.887 60.2949H125.1C124.824 61.4199 123.793 62.123 122.334 62.123C120.506 62.123 119.387 60.8633 119.387 58.8301C119.387 56.8086 120.529 55.5137 122.328 55.5137C124.104 55.5137 125.176 56.7266 125.176 58.7188V59.1523H120.67V59.2109C120.711 60.3652 121.361 61.0918 122.369 61.0918C123.131 61.0918 123.652 60.8105 123.887 60.2949ZM122.322 56.5391C121.391 56.5391 120.74 57.2188 120.67 58.2441H123.893C123.863 57.2129 123.254 56.5391 122.322 56.5391ZM129.998 55.5254C131.621 55.5254 132.646 56.7969 132.646 58.8184C132.646 60.8281 131.621 62.1055 130.01 62.1055C129.102 62.1055 128.381 61.7129 128.047 61.0391H127.947V64.1211H126.688V55.6367H127.9V56.6914H127.994C128.381 55.9648 129.131 55.5254 129.998 55.5254ZM129.641 61.0273C130.713 61.0273 131.352 60.2012 131.352 58.8184C131.352 57.4355 130.713 56.6035 129.646 56.6035C128.586 56.6035 127.924 57.4531 127.924 58.8184C127.924 60.1777 128.586 61.0273 129.641 61.0273ZM134.609 54.0312H135.869V55.6543H137.252V56.6621H135.869V60.0195C135.869 60.7051 136.145 61.0039 136.771 61.0039C136.965 61.0039 137.076 60.9922 137.252 60.9746V61.9766C137.047 62.0117 136.812 62.041 136.566 62.041C135.166 62.041 134.609 61.5488 134.609 60.3242V56.6621H133.596V55.6543H134.609V54.0312Z" fill="var(--vscode-breadcrumb-foreground,
        #CCCCCC)" />
                <g>
                  <rect x="172" y="50" width="28" height="16" rx="3" fill="var(--vscode-editorInlayHint-background,
        #4D4D4D)" fill-opacity="0.101961" />
                  <g>
                    <path d="M181.031 62H179.828V55.2861H177.389V54.2495H183.464V55.2861H181.031V62ZM185.328 62.0967C184.2 62.0967 183.378 61.4199 183.378 60.3564C183.378 59.3091 184.162 58.7021 185.553 58.6162L187.138 58.5195V58.0093C187.138 57.3701 186.729 57.0103 185.94 57.0103C185.295 57.0103 184.85 57.252 184.721 57.6763H183.604C183.722 56.6934 184.667 56.0542 185.994 56.0542C187.46 56.0542 188.287 56.7847 188.287 58.0093V62H187.175V61.1729H187.084C186.735 61.7637 186.096 62.0967 185.328 62.0967ZM185.623 61.1675C186.493 61.1675 187.138 60.5981 187.138 59.8462V59.3413L185.709 59.438C184.903 59.4917 184.538 59.7764 184.538 60.3081C184.538 60.8506 184.995 61.1675 185.623 61.1675ZM193.03 62.0967C192.213 62.0967 191.531 61.7207 191.182 61.0762H191.096V62H189.984V53.8789H191.139V57.0908H191.23C191.542 56.457 192.229 56.0649 193.03 56.0649C194.512 56.0649 195.447 57.2305 195.447 59.0835C195.447 60.9204 194.507 62.0967 193.03 62.0967ZM192.697 57.0532C191.73 57.0532 191.123 57.832 191.118 59.0835C191.123 60.335 191.725 61.1084 192.697 61.1084C193.674 61.1084 194.26 60.3457 194.26 59.0835C194.26 57.8213 193.674 57.0532 192.697 57.0532Z" fill="var(--vscode-descriptionForeground,
        var(--vscode-descriptionForeground, #9d9d9d))" />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
        <g>
          <g>
            <g>
              <g>
                <path d="M41 86.6933L37.3733 90.3733L36.6267 89.6267L40.3067 86L36.6267 82.3733L37.3733 81.6267L41 85.3067L44.6267 81.6267L45.3733 82.3733L41.6933 86L45.3733 89.6267L44.6267 90.3733L41 86.6933Z" fill="var(--vscode-colors-menu-foreground,
        var(--vscode-colors-menu-foreground, #cccccc))" />
                <path d="M57.373 86.748V90H56.0605V81.5449H59.4062C61.1113 81.5449 62.207 82.5527 62.207 84.1289C62.207 85.2715 61.5977 86.1973 60.5664 86.543L62.4648 90H60.9473L59.2246 86.748H57.373ZM57.373 82.6465V85.6699H59.2598C60.2734 85.6699 60.8594 85.125 60.8594 84.1582C60.8594 83.2148 60.2383 82.6465 59.2246 82.6465H57.373ZM67.9258 88.2949H69.1387C68.8633 89.4199 67.832 90.123 66.373 90.123C64.5449 90.123 63.4258 88.8633 63.4258 86.8301C63.4258 84.8086 64.5684 83.5137 66.3672 83.5137C68.1426 83.5137 69.2148 84.7266 69.2148 86.7188V87.1523H64.709V87.2109C64.75 88.3652 65.4004 89.0918 66.4082 89.0918C67.1699 89.0918 67.6914 88.8105 67.9258 88.2949ZM66.3613 84.5391C65.4297 84.5391 64.7793 85.2188 64.709 86.2441H67.9316C67.9023 85.2129 67.293 84.5391 66.3613 84.5391ZM71.3887 82.5C70.9492 82.5 70.5918 82.1426 70.5918 81.709C70.5918 81.2695 70.9492 80.9121 71.3887 80.9121C71.8223 80.9121 72.1855 81.2695 72.1855 81.709C72.1855 82.1426 71.8223 82.5 71.3887 82.5ZM72.0039 83.6367V90.2754C72.0039 91.582 71.3301 92.1797 69.9473 92.1797C69.9004 92.1797 69.6953 92.1738 69.666 92.1738V91.166C69.6836 91.166 69.8242 91.166 69.8418 91.166C70.5156 91.166 70.75 90.9082 70.75 90.2695V83.6367H72.0039ZM78.0391 88.2949H79.252C78.9766 89.4199 77.9453 90.123 76.4863 90.123C74.6582 90.123 73.5391 88.8633 73.5391 86.8301C73.5391 84.8086 74.6816 83.5137 76.4805 83.5137C78.2559 83.5137 79.3281 84.7266 79.3281 86.7188V87.1523H74.8223V87.2109C74.8633 88.3652 75.5137 89.0918 76.5215 89.0918C77.2832 89.0918 77.8047 88.8105 78.0391 88.2949ZM76.4746 84.5391C75.543 84.5391 74.8926 85.2188 74.8223 86.2441H78.0449C78.0156 85.2129 77.4062 84.5391 76.4746 84.5391ZM86.2422 85.6816H85.0176C84.8711 85.0605 84.3555 84.5859 83.5117 84.5859C82.457 84.5859 81.8125 85.418 81.8125 86.7949C81.8125 88.2012 82.4629 89.0508 83.5117 89.0508C84.3086 89.0508 84.8535 88.6758 85.0176 87.9844H86.2422C86.0781 89.2383 85.0938 90.123 83.5176 90.123C81.6602 90.123 80.5234 88.8574 80.5234 86.7949C80.5234 84.7734 81.6543 83.5137 83.5117 83.5137C85.1113 83.5137 86.0781 84.4453 86.2422 85.6816ZM88.2227 82.0312H89.4824V83.6543H90.8652V84.6621H89.4824V88.0195C89.4824 88.7051 89.7578 89.0039 90.3848 89.0039C90.5781 89.0039 90.6895 88.9922 90.8652 88.9746V89.9766C90.6602 90.0117 90.4258 90.041 90.1797 90.041C88.7793 90.041 88.2227 89.5488 88.2227 88.3242V84.6621H87.209V83.6543H88.2227V82.0312Z" fill="var(--vscode-breadcrumb-foreground,
        #CCCCCC)" />
                <g>
                  <rect x="153" y="78" width="47" height="16" rx="3" fill="var(--vscode-editorInlayHint-background,
        #4D4D4D)" fill-opacity="0.101961" />
                  <g>
                    <path d="M163.553 88.9634V90H158.633V82.2495H163.553V83.2861H159.836V85.5527H163.354V86.5518H159.836V88.9634H163.553ZM165.025 85.7998C165.025 84.7847 165.976 84.0542 167.297 84.0542C168.613 84.0542 169.472 84.6665 169.585 85.6763H168.479C168.371 85.2412 167.952 84.9565 167.297 84.9565C166.652 84.9565 166.164 85.2734 166.164 85.7461C166.164 86.106 166.459 86.3315 167.093 86.4819L168.065 86.7075C169.177 86.9653 169.698 87.4434 169.698 88.292C169.698 89.377 168.672 90.1128 167.275 90.1128C165.884 90.1128 164.977 89.4844 164.875 88.4692H166.029C166.174 88.9258 166.604 89.2104 167.302 89.2104C168.022 89.2104 168.532 88.8774 168.532 88.3994C168.532 88.0342 168.258 87.7979 167.673 87.6582L166.652 87.4165C165.541 87.1587 165.025 86.6646 165.025 85.7998ZM176.041 86.0415H174.918C174.784 85.4722 174.312 85.0371 173.538 85.0371C172.571 85.0371 171.98 85.7998 171.98 87.062C171.98 88.3511 172.577 89.1299 173.538 89.1299C174.269 89.1299 174.768 88.7861 174.918 88.1523H176.041C175.891 89.3018 174.988 90.1128 173.543 90.1128C171.841 90.1128 170.799 88.9526 170.799 87.062C170.799 85.209 171.835 84.0542 173.538 84.0542C175.004 84.0542 175.891 84.9082 176.041 86.0415ZM178.979 90.0967C177.851 90.0967 177.029 89.4199 177.029 88.3564C177.029 87.3091 177.813 86.7021 179.205 86.6162L180.789 86.5195V86.0093C180.789 85.3701 180.381 85.0103 179.591 85.0103C178.947 85.0103 178.501 85.252 178.372 85.6763H177.255C177.373 84.6934 178.318 84.0542 179.645 84.0542C181.111 84.0542 181.938 84.7847 181.938 86.0093V90H180.827V89.1729H180.735C180.386 89.7637 179.747 90.0967 178.979 90.0967ZM179.274 89.1675C180.145 89.1675 180.789 88.5981 180.789 87.8462V87.3413L179.36 87.438C178.555 87.4917 178.189 87.7764 178.189 88.3081C178.189 88.8506 178.646 89.1675 179.274 89.1675ZM186.617 84.0649C188.104 84.0649 189.044 85.2305 189.044 87.0835C189.044 88.9258 188.104 90.0967 186.627 90.0967C185.795 90.0967 185.134 89.7368 184.828 89.1191H184.737V91.9443H183.582V84.167H184.694V85.1338H184.78C185.134 84.4678 185.822 84.0649 186.617 84.0649ZM186.289 89.1084C187.272 89.1084 187.857 88.3511 187.857 87.0835C187.857 85.8159 187.272 85.0532 186.294 85.0532C185.322 85.0532 184.715 85.832 184.715 87.0835C184.715 88.3296 185.322 89.1084 186.289 89.1084ZM194.271 88.437H195.382C195.13 89.4683 194.185 90.1128 192.847 90.1128C191.171 90.1128 190.146 88.958 190.146 87.0942C190.146 85.2412 191.193 84.0542 192.842 84.0542C194.469 84.0542 195.452 85.166 195.452 86.9922V87.3896H191.322V87.4434C191.359 88.5015 191.956 89.1675 192.879 89.1675C193.578 89.1675 194.056 88.9097 194.271 88.437ZM192.836 84.9941C191.982 84.9941 191.386 85.6172 191.322 86.5571H194.276C194.249 85.6118 193.69 84.9941 192.836 84.9941Z" fill="var(--vscode-commandCenter-inactiveBorder,
        #9D9D9D)" />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
        <g>
          <g>
            <g>
              <g>
                <path d="M42.0133 115.013H37V115.973H42.0133V115.013ZM38.0133 108.987L39.0267 107.973H46.0133L47.0267 108.987V115.973L46.0133 116.987H43.9867V119.013L43.0267 119.973H35.9867L35.0267 119.013V111.973L35.9867 111.013H38.0133V108.987ZM39.0267 111.013H43.0267L43.9867 111.973V115.973H46.0133V108.987H39.0267V111.013ZM43.0267 111.973H35.9867V119.013H43.0267V111.973Z" fill="var(--vscode-dropdown-foreground,
        #cccccc)" />
                <path d="M55.6621 115.744H56.9629C57.0742 116.564 57.8594 117.086 58.9902 117.086C60.0449 117.086 60.8184 116.529 60.8184 115.756C60.8184 115.094 60.3262 114.684 59.207 114.414L58.1172 114.15C56.5879 113.781 55.8906 113.055 55.8906 111.824C55.8906 110.336 57.1211 109.34 58.9668 109.34C60.6836 109.34 61.9375 110.336 62.0137 111.748H60.7363C60.6133 110.945 59.9336 110.453 58.9492 110.453C57.9121 110.453 57.2207 110.963 57.2207 111.754C57.2207 112.369 57.666 112.721 58.7676 112.99L59.6992 113.219C61.4336 113.635 62.1484 114.332 62.1484 115.598C62.1484 117.197 60.8945 118.205 58.8906 118.205C57.0156 118.205 55.7559 117.244 55.6621 115.744ZM63.7891 118V109.141H65.0371V112.65H65.1367C65.4473 111.941 66.1211 111.52 67.082 111.52C68.4414 111.52 69.2793 112.381 69.2793 113.887V118H68.0195V114.186C68.0195 113.137 67.5449 112.615 66.6543 112.615C65.623 112.615 65.0488 113.277 65.0488 114.273V118H63.7891ZM73.75 118.123C71.8809 118.123 70.7383 116.875 70.7383 114.818C70.7383 112.768 71.8867 111.514 73.75 111.514C75.6074 111.514 76.7559 112.762 76.7559 114.818C76.7559 116.875 75.6133 118.123 73.75 118.123ZM73.75 117.051C74.8398 117.051 75.4609 116.23 75.4609 114.818C75.4609 113.4 74.8398 112.58 73.75 112.58C72.6543 112.58 72.0391 113.4 72.0391 114.818C72.0391 116.236 72.6543 117.051 73.75 117.051ZM86.3359 111.637L84.584 118H83.2773L81.959 113.254H81.8594L80.5469 118H79.252L77.4941 111.637H78.7715L79.9141 116.547H80.0078L81.3203 111.637H82.5273L83.8398 116.547H83.9395L85.0762 111.637H86.3359ZM94.5332 118.205C92.1836 118.205 90.7188 116.506 90.7188 113.775C90.7188 111.039 92.1777 109.34 94.5273 109.34C96.3906 109.34 97.832 110.529 98.043 112.223H96.7363C96.4902 111.174 95.6406 110.506 94.5273 110.506C93.0098 110.506 92.0605 111.766 92.0605 113.775C92.0605 115.785 93.0098 117.039 94.5332 117.039C95.6523 117.039 96.502 116.436 96.7363 115.475H98.043C97.8086 117.121 96.4199 118.205 94.5332 118.205ZM102.32 118.123C100.451 118.123 99.3086 116.875 99.3086 114.818C99.3086 112.768 100.457 111.514 102.32 111.514C104.178 111.514 105.326 112.762 105.326 114.818C105.326 116.875 104.184 118.123 102.32 118.123ZM102.32 117.051C103.41 117.051 104.031 116.23 104.031 114.818C104.031 113.4 103.41 112.58 102.32 112.58C101.225 112.58 100.609 113.4 100.609 114.818C100.609 116.236 101.225 117.051 102.32 117.051ZM106.902 118V109.141H108.162V118H106.902ZM110.113 118V109.141H111.373V118H110.113ZM115.029 118.105C113.799 118.105 112.902 117.367 112.902 116.207C112.902 115.064 113.758 114.402 115.275 114.309L117.004 114.203V113.646C117.004 112.949 116.559 112.557 115.697 112.557C114.994 112.557 114.508 112.82 114.367 113.283H113.148C113.277 112.211 114.309 111.514 115.756 111.514C117.355 111.514 118.258 112.311 118.258 113.646V118H117.045V117.098H116.945C116.564 117.742 115.867 118.105 115.029 118.105ZM115.352 117.092C116.301 117.092 117.004 116.471 117.004 115.65V115.1L115.445 115.205C114.566 115.264 114.168 115.574 114.168 116.154C114.168 116.746 114.666 117.092 115.352 117.092ZM123.361 111.525C124.984 111.525 126.01 112.797 126.01 114.818C126.01 116.828 124.984 118.105 123.373 118.105C122.465 118.105 121.744 117.713 121.41 117.039H121.311V120.121H120.051V111.637H121.264V112.691H121.357C121.744 111.965 122.494 111.525 123.361 111.525ZM123.004 117.027C124.076 117.027 124.715 116.201 124.715 114.818C124.715 113.436 124.076 112.604 123.01 112.604C121.949 112.604 121.287 113.453 121.287 114.818C121.287 116.178 121.949 117.027 123.004 117.027ZM127.381 113.418C127.381 112.311 128.418 111.514 129.859 111.514C131.295 111.514 132.232 112.182 132.355 113.283H131.148C131.031 112.809 130.574 112.498 129.859 112.498C129.156 112.498 128.623 112.844 128.623 113.359C128.623 113.752 128.945 113.998 129.637 114.162L130.697 114.408C131.91 114.689 132.479 115.211 132.479 116.137C132.479 117.32 131.359 118.123 129.836 118.123C128.318 118.123 127.328 117.438 127.217 116.33H128.477C128.635 116.828 129.104 117.139 129.865 117.139C130.65 117.139 131.207 116.775 131.207 116.254C131.207 115.855 130.908 115.598 130.27 115.445L129.156 115.182C127.943 114.9 127.381 114.361 127.381 113.418ZM138.18 116.295H139.393C139.117 117.42 138.086 118.123 136.627 118.123C134.799 118.123 133.68 116.863 133.68 114.83C133.68 112.809 134.822 111.514 136.621 111.514C138.396 111.514 139.469 112.727 139.469 114.719V115.152H134.963V115.211C135.004 116.365 135.654 117.092 136.662 117.092C137.424 117.092 137.945 116.811 138.18 116.295ZM136.615 112.539C135.684 112.539 135.033 113.219 134.963 114.244H138.186C138.156 113.213 137.547 112.539 136.615 112.539ZM143.312 118.105C141.689 118.105 140.664 116.828 140.664 114.812C140.664 112.809 141.701 111.525 143.312 111.525C144.186 111.525 144.924 111.947 145.27 112.645H145.363V109.141H146.623V118H145.416V116.992H145.316C144.936 117.689 144.191 118.105 143.312 118.105ZM143.67 112.604C142.609 112.604 141.965 113.441 141.965 114.818C141.965 116.201 142.604 117.027 143.67 117.027C144.73 117.027 145.387 116.189 145.387 114.818C145.387 113.459 144.725 112.604 143.67 112.604Z" fill="var(--vscode-breadcrumb-foreground,
        #CCCCCC)" />
              </g>
            </g>
          </g>
        </g>
        <g>
          <g>
            <g>
              <g>
                <path d="M42.3867 135.013L42.92 137.413L45 136.08L47.0267 138.107L45.5867 140.187L47.9867 140.613V143.387L45.5867 143.92L47.0267 146L45 147.973L42.92 146.587L42.3867 148.987H39.6133L39.08 146.587L37 147.92L35.0267 145.893L36.4133 143.813L34.0133 143.387V140.613L36.4133 140.08L35.08 138L37.1067 135.973L39.1867 137.413L39.6133 135.013H42.3867Z" fill="none" stroke="var(--vscode-dropdown-foreground, #cccccc)" stroke-width="1"/>
                <circle cx="41" cy="142" r="2.5" fill="none" stroke="var(--vscode-dropdown-foreground, #cccccc)" stroke-width="1"/>
                <path d="M55.6621 143.744H56.9629C57.0742 144.564 57.8594 145.086 58.9902 145.086C60.0449 145.086 60.8184 144.529 60.8184 143.756C60.8184 143.094 60.3262 142.684 59.207 142.414L58.1172 142.15C56.5879 141.781 55.8906 141.055 55.8906 139.824C55.8906 138.336 57.1211 137.34 58.9668 137.34C60.6836 137.34 61.9375 138.336 62.0137 139.748H60.7363C60.6133 138.945 59.9336 138.453 58.9492 138.453C57.9121 138.453 57.2207 138.963 57.2207 139.754C57.2207 140.369 57.666 140.721 58.7676 140.99L59.6992 141.219C61.4336 141.635 62.1484 142.332 62.1484 143.598C62.1484 145.197 60.8945 146.205 58.8906 146.205C57.0156 146.205 55.7559 145.244 55.6621 143.744ZM67.9141 144.295H69.127C68.8516 145.42 67.8203 146.123 66.3613 146.123C64.5332 146.123 63.4141 144.863 63.4141 142.83C63.4141 140.809 64.5566 139.514 66.3555 139.514C68.1309 139.514 69.2031 140.727 69.2031 142.719V143.152H64.6973V143.211C64.7383 144.365 65.3887 145.092 66.3965 145.092C67.1582 145.092 67.6797 144.811 67.9141 144.295ZM66.3496 140.539C65.418 140.539 64.7676 141.219 64.6973 142.244H67.9199C67.8906 141.213 67.2812 140.539 66.3496 140.539ZM71.1602 138.031H72.4199V139.654H73.8027V140.662H72.4199V144.02C72.4199 144.705 72.6953 145.004 73.3223 145.004C73.5156 145.004 73.627 144.992 73.8027 144.975V145.977C73.5977 146.012 73.3633 146.041 73.1172 146.041C71.7168 146.041 71.1602 145.549 71.1602 144.324V140.662H70.1465V139.654H71.1602V138.031ZM75.7539 138.031H77.0137V139.654H78.3965V140.662H77.0137V144.02C77.0137 144.705 77.2891 145.004 77.916 145.004C78.1094 145.004 78.2207 144.992 78.3965 144.975V145.977C78.1914 146.012 77.957 146.041 77.7109 146.041C76.3105 146.041 75.7539 145.549 75.7539 144.324V140.662H74.7402V139.654H75.7539V138.031ZM80.5293 138.5C80.0898 138.5 79.7324 138.143 79.7324 137.709C79.7324 137.27 80.0898 136.912 80.5293 136.912C80.9688 136.912 81.3262 137.27 81.3262 137.709C81.3262 138.143 80.9688 138.5 80.5293 138.5ZM79.9023 146V139.637H81.1562V146H79.9023ZM83.0078 146V139.637H84.2207V140.645H84.3145C84.625 139.941 85.2578 139.514 86.2188 139.514C87.6426 139.514 88.4277 140.363 88.4277 141.881V146H87.168V142.18C87.168 141.125 86.7227 140.609 85.791 140.609C84.8594 140.609 84.2676 141.242 84.2676 142.268V146H83.0078ZM92.8926 148.432C91.2988 148.432 90.2676 147.723 90.1328 146.65H91.4219C91.5273 147.131 92.0605 147.436 92.9102 147.436C93.959 147.436 94.5801 146.92 94.5801 146.059V144.834H94.4863C94.0996 145.525 93.3965 145.906 92.5176 145.906C90.8887 145.906 89.8809 144.646 89.8809 142.736C89.8809 140.809 90.9004 139.525 92.5293 139.525C93.4082 139.525 94.1758 139.959 94.5332 140.65H94.6328V139.637H95.8398V146.064C95.8398 147.512 94.6973 148.432 92.8926 148.432ZM92.875 144.863C93.9531 144.863 94.6035 144.037 94.6035 142.736C94.6035 141.436 93.9473 140.604 92.875 140.604C91.791 140.604 91.1816 141.436 91.1816 142.736C91.1816 144.037 91.791 144.863 92.875 144.863ZM97.5215 141.418C97.5215 140.311 98.5586 139.514 100 139.514C101.436 139.514 102.373 140.182 102.496 141.283H101.289C101.172 140.809 100.715 140.498 100 140.498C99.2969 140.498 98.7637 140.844 98.7637 141.359C98.7637 141.752 99.0859 141.998 99.7773 142.162L100.838 142.408C102.051 142.689 102.619 143.211 102.619 144.137C102.619 145.32 101.5 146.123 99.9766 146.123C98.459 146.123 97.4688 145.438 97.3574 144.33H98.6172C98.7754 144.828 99.2441 145.139 100.006 145.139C100.791 145.139 101.348 144.775 101.348 144.254C101.348 143.855 101.049 143.598 100.41 143.445L99.2969 143.182C98.084 142.9 97.5215 142.361 97.5215 141.418Z" fill="var(--vscode-breadcrumb-foreground,
        #CCCCCC)" />
              </g>
            </g>
            <g>
              <rect x="17" y="161" width="199" height="1" fill="var(--vscode-dropdown-border,
        #454545)" />
            </g>
          </g>
        </g>
        <g>
          <g>
            <g>
              <g>
                <path d="M39.334 182.857V184H34.0605V175.545H35.373V182.857H39.334ZM44.7422 182.295H45.9551C45.6797 183.42 44.6484 184.123 43.1895 184.123C41.3613 184.123 40.2422 182.863 40.2422 180.83C40.2422 178.809 41.3848 177.514 43.1836 177.514C44.959 177.514 46.0312 178.727 46.0312 180.719V181.152H41.5254V181.211C41.5664 182.365 42.2168 183.092 43.2246 183.092C43.9863 183.092 44.5078 182.811 44.7422 182.295ZM43.1777 178.539C42.2461 178.539 41.5957 179.219 41.5254 180.244H44.748C44.7188 179.213 44.1094 178.539 43.1777 178.539ZM49.3066 184.105C48.0762 184.105 47.1797 183.367 47.1797 182.207C47.1797 181.064 48.0352 180.402 49.5527 180.309L51.2812 180.203V179.646C51.2812 178.949 50.8359 178.557 49.9746 178.557C49.2715 178.557 48.7852 178.82 48.6445 179.283H47.4258C47.5547 178.211 48.5859 177.514 50.0332 177.514C51.6328 177.514 52.5352 178.311 52.5352 179.646V184H51.3223V183.098H51.2227C50.8418 183.742 50.1445 184.105 49.3066 184.105ZM49.6289 183.092C50.5781 183.092 51.2812 182.471 51.2812 181.65V181.1L49.7227 181.205C48.8438 181.264 48.4453 181.574 48.4453 182.154C48.4453 182.746 48.9434 183.092 49.6289 183.092ZM54.3281 184V177.637H55.541V178.604H55.6348C55.8164 177.977 56.5254 177.525 57.3574 177.525C57.5449 177.525 57.7852 177.543 57.9199 177.572V178.756C57.8145 178.727 57.4395 178.686 57.2168 178.686C56.2617 178.686 55.5879 179.301 55.5879 180.197V184H54.3281ZM59.2266 184V177.637H60.4395V178.645H60.5332C60.8438 177.941 61.4766 177.514 62.4375 177.514C63.8613 177.514 64.6465 178.363 64.6465 179.881V184H63.3867V180.18C63.3867 179.125 62.9414 178.609 62.0098 178.609C61.0781 178.609 60.4863 179.242 60.4863 180.268V184H59.2266ZM78.4043 184H77.1855V177.807H77.1035L74.625 183.848H73.6289L71.1504 177.807H71.0684V184H69.8496V175.545H71.3848L74.0742 182.16H74.1738L76.8691 175.545H78.4043V184ZM83.0742 184.123C81.2051 184.123 80.0625 182.875 80.0625 180.818C80.0625 178.768 81.2109 177.514 83.0742 177.514C84.9316 177.514 86.0801 178.762 86.0801 180.818C86.0801 182.875 84.9375 184.123 83.0742 184.123ZM83.0742 183.051C84.1641 183.051 84.7852 182.23 84.7852 180.818C84.7852 179.4 84.1641 178.58 83.0742 178.58C81.9785 178.58 81.3633 179.4 81.3633 180.818C81.3633 182.236 81.9785 183.051 83.0742 183.051ZM87.5977 184V177.637H88.8105V178.604H88.9043C89.0859 177.977 89.7949 177.525 90.627 177.525C90.8145 177.525 91.0547 177.543 91.1895 177.572V178.756C91.084 178.727 90.709 178.686 90.4863 178.686C89.5312 178.686 88.8574 179.301 88.8574 180.197V184H87.5977ZM96.4219 182.295H97.6348C97.3594 183.42 96.3281 184.123 94.8691 184.123C93.041 184.123 91.9219 182.863 91.9219 180.83C91.9219 178.809 93.0645 177.514 94.8633 177.514C96.6387 177.514 97.7109 178.727 97.7109 180.719V181.152H93.2051V181.211C93.2461 182.365 93.8965 183.092 94.9043 183.092C95.666 183.092 96.1875 182.811 96.4219 182.295ZM94.8574 178.539C93.9258 178.539 93.2754 179.219 93.2051 180.244H96.4277C96.3984 179.213 95.7891 178.539 94.8574 178.539Z" fill="var(--vscode-extensionIcon-verifiedForeground,
        #4DAAFC)" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
  <defs>
    <filter id="filter0_d_2738_9213" x="0" y="0" width="233" height="216" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
      <feOffset dy="2" />
      <feGaussianBlur stdDeviation="8" />
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.36 0" />
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2738_9213" />
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2738_9213" result="shape" />
    </filter>
  </defs>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/welcomeGettingStarted/common/media/commandPalette.svg]---
Location: vscode-main/src/vs/workbench/contrib/welcomeGettingStarted/common/media/commandPalette.svg

```text
<svg viewBox="0 0 520 260" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="520" height="260" fill="var(--vscode-editor-background, #1e1e1e)"/>
<g clip-path="url(#clip0)">
<rect width="520" height="39" fill="var(--vscode-editorGroupHeader-tabsBackground, #252526)"/>
<g clip-path="url(#clip1)">
<rect width="115.654" height="39.2998" fill="var(--vscode-tab-activeBackground, #1e1e1e)"/>
<rect x="13.4742" y="15.7199" width="88.7052" height="7.85995" rx="3.92998" fill="var(--vscode-tab-unfocusedInactiveForeground, #454545)"/>
</g>
</g>
<g filter="url(#filter0_d)">
<rect width="425" height="182" transform="translate(48 20)" fill="var(--vscode-quickInput-background, #252526)"/>
<rect x="55.5" y="27.5" width="410" height="25" fill="var(--vscode-input-background, #3c3c3c)"/>
<path d="M61.168 43.3242V44.708L67.4648 41.9595V40.7598L61.168 38.0239V39.4204L65.8779 41.3691V41.4326L61.168 43.3242ZM73.6665 45H75.0312V39.2173H76.5547V38.1255H75.0122V37.4463C75.0122 36.748 75.3232 36.3989 76.085 36.3989C76.3008 36.3989 76.4849 36.4116 76.6118 36.4307V35.4023C76.377 35.3643 76.1104 35.3389 75.7993 35.3389C74.3647 35.3389 73.6665 36.0117 73.6665 37.3828V38.1255H72.5303V39.2173H73.6665V45ZM78.8081 36.875C79.2842 36.875 79.6714 36.4878 79.6714 36.0181C79.6714 35.542 79.2842 35.1548 78.8081 35.1548C78.332 35.1548 77.9448 35.542 77.9448 36.0181C77.9448 36.4878 78.332 36.875 78.8081 36.875ZM78.1289 45H79.4873V38.1064H78.1289V45ZM81.5566 45H82.9214V35.4023H81.5566V45ZM89.5039 43.1528C89.25 43.7114 88.6851 44.0161 87.8599 44.0161C86.7681 44.0161 86.0635 43.229 86.019 41.9785V41.915H90.9004V41.4453C90.9004 39.2871 89.7388 37.9731 87.8154 37.9731C85.8667 37.9731 84.6289 39.376 84.6289 41.5659C84.6289 43.7686 85.8413 45.1333 87.8218 45.1333C89.4023 45.1333 90.5195 44.3716 90.8179 43.1528H89.5039ZM87.8091 39.084C88.8184 39.084 89.4785 39.814 89.5103 40.9312H86.019C86.0952 39.8203 86.7998 39.084 87.8091 39.084Z" fill="var(--vscode-input-foreground, #cccccc)"/>
<rect x="55.5" y="27.5" width="410" height="25" stroke="var(--vscode-focusBorder, #0078d4)"/>
<rect x="60" y="66" width="38" height="6" rx="3" fill="var(--vscode-foreground)" fill-opacity="0.25"/>
<rect x="135" y="66" width="105" height="6" rx="3" fill="var(--vscode-foreground)" fill-opacity="0.25"/>
<rect x="102" y="66" width="29" height="6" rx="3" fill="var(--vscode-pickerGroup-foreground)"/>
<rect width="425" height="24" transform="translate(48 82)" fill="var(--vscode-quickInputList-focusBackground, #062F4A)"/>
<path d="M63.0278 99V95.3945H66.7539V93.8774H63.0278V91.4209H67.1094V89.8403H61.1108V99H63.0278ZM69.6357 90.9385C70.207 90.9385 70.6768 90.4814 70.6768 89.9102C70.6768 89.3325 70.207 88.8755 69.6357 88.8755C69.0645 88.8755 68.5884 89.3325 68.5884 89.9102C68.5884 90.4814 69.0645 90.9385 69.6357 90.9385ZM68.709 99H70.5562V92.0112H68.709V99ZM72.4922 99H74.3394V89.3389H72.4922V99ZM80.7886 97.0259C80.5918 97.502 80.0903 97.7686 79.3604 97.7686C78.3955 97.7686 77.7861 97.1021 77.7607 96.0356V95.9404H82.5659V95.3882C82.5659 93.1792 81.3472 91.8589 79.2842 91.8589C77.2021 91.8589 75.9199 93.2681 75.9199 95.5405C75.9199 97.8003 77.1768 99.146 79.3096 99.146C81.0234 99.146 82.2358 98.3271 82.5088 97.0259H80.7886ZM79.2905 93.2363C80.1538 93.2363 80.7124 93.833 80.7505 94.7915H77.7671C77.8306 93.8521 78.4336 93.2363 79.2905 93.2363Z" fill="var(--vscode-list-focusHighlightForeground)"/>
<path d="M85.416 94.6519C86.1016 94.6519 86.5396 94.1948 86.5396 93.5728C86.5396 92.9507 86.1016 92.5 85.416 92.5C84.7368 92.5 84.2925 92.9507 84.2925 93.5728C84.2925 94.1948 84.7368 94.6519 85.416 94.6519ZM85.416 99.1587C86.1016 99.1587 86.5396 98.7017 86.5396 98.0796C86.5396 97.4575 86.1016 97.0068 85.416 97.0068C84.7368 97.0068 84.2925 97.4575 84.2925 98.0796C84.2925 98.7017 84.7368 99.1587 85.416 99.1587ZM93.7632 99V92.3477H93.8647L98.5684 99H99.8506V89.8403H98.4668V96.5054H98.3652L93.6616 89.8403H92.3794V99H93.7632ZM106.528 97.1528C106.274 97.7114 105.709 98.0161 104.884 98.0161C103.792 98.0161 103.088 97.229 103.043 95.9785V95.915H107.925V95.4453C107.925 93.2871 106.763 91.9731 104.84 91.9731C102.891 91.9731 101.653 93.376 101.653 95.5659C101.653 97.7686 102.866 99.1333 104.846 99.1333C106.427 99.1333 107.544 98.3716 107.842 97.1528H106.528ZM104.833 93.084C105.843 93.084 106.503 93.814 106.535 94.9312H103.043C103.12 93.8203 103.824 93.084 104.833 93.084ZM118.513 92.1064H117.148L115.917 97.4258H115.809L114.387 92.1064H113.079L111.657 97.4258H111.556L110.318 92.1064H108.934L110.838 99H112.241L113.663 93.8584H113.771L115.199 99H116.615L118.513 92.1064ZM125.044 89.8403H123.623V95.8452C123.623 97.8257 125.038 99.2222 127.33 99.2222C129.634 99.2222 131.043 97.8257 131.043 95.8452V89.8403H129.621V95.731C129.621 97.0386 128.79 97.959 127.33 97.959C125.876 97.959 125.044 97.0386 125.044 95.731V89.8403ZM133.176 99H134.541V94.9565C134.541 93.8457 135.182 93.1602 136.191 93.1602C137.2 93.1602 137.683 93.7188 137.683 94.8613V99H139.047V94.5376C139.047 92.8936 138.197 91.9731 136.654 91.9731C135.613 91.9731 134.928 92.4365 134.591 93.1982H134.49V92.1064H133.176V99ZM141.453 90.3672V92.1255H140.355V93.2173H141.453V97.1846C141.453 98.5112 142.056 99.0444 143.573 99.0444C143.84 99.0444 144.094 99.0127 144.316 98.9746V97.8892C144.125 97.9082 144.005 97.9209 143.795 97.9209C143.116 97.9209 142.818 97.5972 142.818 96.8545V93.2173H144.316V92.1255H142.818V90.3672H141.453ZM146.626 90.875C147.103 90.875 147.49 90.4878 147.49 90.0181C147.49 89.542 147.103 89.1548 146.626 89.1548C146.15 89.1548 145.763 89.542 145.763 90.0181C145.763 90.4878 146.15 90.875 146.626 90.875ZM145.947 99H147.306V92.1064H145.947V99ZM149.794 90.3672V92.1255H148.696V93.2173H149.794V97.1846C149.794 98.5112 150.397 99.0444 151.914 99.0444C152.181 99.0444 152.435 99.0127 152.657 98.9746V97.8892C152.466 97.9082 152.346 97.9209 152.136 97.9209C151.457 97.9209 151.159 97.5972 151.159 96.8545V93.2173H152.657V92.1255H151.159V90.3672H149.794ZM154.326 99H155.691V89.4023H154.326V99ZM162.273 97.1528C162.02 97.7114 161.455 98.0161 160.629 98.0161C159.538 98.0161 158.833 97.229 158.789 95.9785V95.915H163.67V95.4453C163.67 93.2871 162.508 91.9731 160.585 91.9731C158.636 91.9731 157.398 93.376 157.398 95.5659C157.398 97.7686 158.611 99.1333 160.591 99.1333C162.172 99.1333 163.289 98.3716 163.587 97.1528H162.273ZM160.579 93.084C161.588 93.084 162.248 93.814 162.28 94.9312H158.789C158.865 93.8203 159.569 93.084 160.579 93.084ZM167.834 99.1143C168.786 99.1143 169.592 98.6636 170.005 97.9082H170.113V99H171.42V89.4023H170.056V93.1982H169.954C169.58 92.4429 168.78 91.9858 167.834 91.9858C166.088 91.9858 164.965 93.376 164.965 95.5469C164.965 97.7305 166.076 99.1143 167.834 99.1143ZM168.221 93.1538C169.364 93.1538 170.081 94.0806 170.081 95.5532C170.081 97.0386 169.37 97.9463 168.221 97.9463C167.066 97.9463 166.374 97.0513 166.374 95.5532C166.374 94.0615 167.072 93.1538 168.221 93.1538ZM178.606 99V95.166H182.542V93.9663H178.606V91.0654H182.903V89.8403H177.184V99H178.606ZM185.296 90.875C185.772 90.875 186.16 90.4878 186.16 90.0181C186.16 89.542 185.772 89.1548 185.296 89.1548C184.82 89.1548 184.433 89.542 184.433 90.0181C184.433 90.4878 184.82 90.875 185.296 90.875ZM184.617 99H185.976V92.1064H184.617V99ZM188.045 99H189.41V89.4023H188.045V99ZM195.992 97.1528C195.738 97.7114 195.173 98.0161 194.348 98.0161C193.256 98.0161 192.552 97.229 192.507 95.9785V95.915H197.389V95.4453C197.389 93.2871 196.227 91.9731 194.304 91.9731C192.355 91.9731 191.117 93.376 191.117 95.5659C191.117 97.7686 192.33 99.1333 194.31 99.1333C195.891 99.1333 197.008 98.3716 197.306 97.1528H195.992ZM194.297 93.084C195.307 93.084 195.967 93.814 195.999 94.9312H192.507C192.583 93.8203 193.288 93.084 194.297 93.084Z" fill="var(--vscode-quickInputList-focusForeground, #E3E3E3)"/>
<rect x="60" y="116" width="62.5" height="6" rx="3" fill="var(--vscode-foreground)" fill-opacity="0.25"/>
<rect x="126.5" y="116" width="29" height="6" rx="3" fill="var(--vscode-pickerGroup-foreground)"/>
<rect x="159.5" y="116" width="62.5" height="6" rx="3" fill="var(--vscode-foreground)" fill-opacity="0.25"/>
<rect x="60" y="138" width="41" height="6" rx="3" fill="var(--vscode-foreground)" fill-opacity="0.25"/>
<rect x="105" y="138" width="69" height="6" rx="3" fill="var(--vscode-foreground)" fill-opacity="0.25"/>
<rect x="178" y="138" width="26" height="6" rx="3" fill="var(--vscode-pickerGroup-foreground)"/>
<rect x="60" y="160" width="26" height="6" rx="3" fill="var(--vscode-pickerGroup-foreground)"/>
<rect x="90" y="160" width="164" height="6" rx="3" fill="var(--vscode-foreground)" fill-opacity="0.25"/>
<rect x="60" y="182" width="46" height="6" rx="3" fill="var(--vscode-foreground)" fill-opacity="0.25"/>
<rect x="110" y="182" width="29" height="6" rx="3" fill="var(--vscode-pickerGroup-foreground)"/>
<rect x="143" y="182" width="46" height="6" rx="3" fill="var(--vscode-foreground)" fill-opacity="0.25"/>
</g>
<defs>
<filter id="filter0_d" x="36" y="10" width="449" height="206" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
<feOffset dy="2"/>
<feGaussianBlur stdDeviation="6"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
</filter>
<clipPath id="clip0">
<rect width="520" height="220" fill="white"/>
</clipPath>
<clipPath id="clip1">
<rect width="115.654" height="39.2998" fill="white"/>
</clipPath>
</defs>
</svg>
```

--------------------------------------------------------------------------------

````

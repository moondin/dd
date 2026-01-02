---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 335
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 335 of 552)

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

---[FILE: src/vs/workbench/browser/parts/editor/textResourceEditor.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/textResourceEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertReturnsDefined } from '../../../../base/common/types.js';
import { ICodeEditor, IPasteEvent } from '../../../../editor/browser/editorBrowser.js';
import { IEditorOpenContext, isTextEditorViewState } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { applyTextEditorOptions } from '../../../common/editor/editorOptions.js';
import { AbstractTextResourceEditorInput, TextResourceEditorInput } from '../../../common/editor/textResourceEditorInput.js';
import { BaseTextEditorModel } from '../../../common/editor/textEditorModel.js';
import { UntitledTextEditorInput } from '../../../services/untitled/common/untitledTextEditorInput.js';
import { AbstractTextCodeEditor } from './textCodeEditor.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ScrollType, ICodeEditorViewState } from '../../../../editor/common/editorCommon.js';
import { IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../editor/common/languages/modesRegistry.js';
import { EditorOption, IEditorOptions as ICodeEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { ModelConstants } from '../../../../editor/common/model.js';
import { ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IFileService } from '../../../../platform/files/common/files.js';

/**
 * An editor implementation that is capable of showing the contents of resource inputs. Uses
 * the TextEditor widget to show the contents.
 */
export abstract class AbstractTextResourceEditor extends AbstractTextCodeEditor<ICodeEditorViewState> {

	constructor(
		id: string,
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IStorageService storageService: IStorageService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IThemeService themeService: IThemeService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IEditorService editorService: IEditorService,
		@IFileService fileService: IFileService
	) {
		super(id, group, telemetryService, instantiationService, storageService, textResourceConfigurationService, themeService, editorService, editorGroupService, fileService);
	}

	override async setInput(input: AbstractTextResourceEditorInput, options: ITextEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {

		// Set input and resolve
		await super.setInput(input, options, context, token);
		const resolvedModel = await input.resolve();

		// Check for cancellation
		if (token.isCancellationRequested) {
			return undefined;
		}

		// Assert Model instance
		if (!(resolvedModel instanceof BaseTextEditorModel)) {
			throw new Error('Unable to open file as text');
		}

		// Set Editor Model
		const control = assertReturnsDefined(this.editorControl);
		const textEditorModel = resolvedModel.textEditorModel;
		control.setModel(textEditorModel);

		// Restore view state (unless provided by options)
		if (!isTextEditorViewState(options?.viewState)) {
			const editorViewState = this.loadEditorViewState(input, context);
			if (editorViewState) {
				if (options?.selection) {
					editorViewState.cursorState = []; // prevent duplicate selections via options
				}

				control.restoreViewState(editorViewState);
			}
		}

		// Apply options to editor if any
		if (options) {
			applyTextEditorOptions(options, control, ScrollType.Immediate);
		}

		// Since the resolved model provides information about being readonly
		// or not, we apply it here to the editor even though the editor input
		// was already asked for being readonly or not. The rationale is that
		// a resolved model might have more specific information about being
		// readonly or not that the input did not have.
		control.updateOptions(this.getReadonlyConfiguration(resolvedModel.isReadonly()));
	}

	/**
	 * Reveals the last line of this editor if it has a model set.
	 */
	revealLastLine(): void {
		const control = this.editorControl;
		if (!control) {
			return;
		}

		const model = control.getModel();

		if (model) {
			const lastLine = model.getLineCount();
			control.revealPosition({ lineNumber: lastLine, column: model.getLineMaxColumn(lastLine) }, ScrollType.Smooth);
		}
	}

	override clearInput(): void {
		super.clearInput();

		// Clear Model
		this.editorControl?.setModel(null);
	}

	protected override tracksEditorViewState(input: EditorInput): boolean {
		// editor view state persistence is only enabled for untitled and resource inputs
		return input instanceof UntitledTextEditorInput || input instanceof TextResourceEditorInput;
	}
}

export class TextResourceEditor extends AbstractTextResourceEditor {

	static readonly ID = 'workbench.editors.textResourceEditor';

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IStorageService storageService: IStorageService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IThemeService themeService: IThemeService,
		@IEditorService editorService: IEditorService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IFileService fileService: IFileService
	) {
		super(TextResourceEditor.ID, group, telemetryService, instantiationService, storageService, textResourceConfigurationService, themeService, editorGroupService, editorService, fileService);
	}

	protected override createEditorControl(parent: HTMLElement, configuration: ICodeEditorOptions): void {
		super.createEditorControl(parent, configuration);

		// Install a listener for paste to update this editors
		// language if the paste includes a specific language
		const control = this.editorControl;
		if (control) {
			this._register(control.onDidPaste(e => this.onDidEditorPaste(e, control)));
		}
	}

	private onDidEditorPaste(e: IPasteEvent, codeEditor: ICodeEditor): void {
		if (this.input instanceof UntitledTextEditorInput && this.input.hasLanguageSetExplicitly) {
			return; // do not override language if it was set explicitly
		}

		if (e.range.startLineNumber !== 1 || e.range.startColumn !== 1) {
			return; // document had existing content before the pasted text, don't override.
		}

		if (codeEditor.getOption(EditorOption.readOnly)) {
			return; // not for readonly editors
		}

		const textModel = codeEditor.getModel();
		if (!textModel) {
			return; // require a live model
		}

		const pasteIsWholeContents = textModel.getLineCount() === e.range.endLineNumber && textModel.getLineMaxColumn(e.range.endLineNumber) === e.range.endColumn;
		if (!pasteIsWholeContents) {
			return; // document had existing content after the pasted text, don't override.
		}

		const currentLanguageId = textModel.getLanguageId();
		if (currentLanguageId !== PLAINTEXT_LANGUAGE_ID) {
			return; // require current languageId to be unspecific
		}

		let candidateLanguage: { id: string; source: 'event' | 'guess' } | undefined = undefined;

		// A languageId is provided via the paste event so text was copied using
		// VSCode. As such we trust this languageId and use it if specific
		if (e.languageId) {
			candidateLanguage = { id: e.languageId, source: 'event' };
		}

		// A languageId was not provided, so the data comes from outside VSCode
		// We can still try to guess a good languageId from the first line if
		// the paste changed the first line
		else {
			const guess = this.languageService.guessLanguageIdByFilepathOrFirstLine(textModel.uri, textModel.getLineContent(1).substr(0, ModelConstants.FIRST_LINE_DETECTION_LENGTH_LIMIT)) ?? undefined;
			if (guess) {
				candidateLanguage = { id: guess, source: 'guess' };
			}
		}

		// Finally apply languageId to model if specified
		if (candidateLanguage && candidateLanguage.id !== PLAINTEXT_LANGUAGE_ID) {
			if (this.input instanceof UntitledTextEditorInput && candidateLanguage.source === 'event') {
				// High confidence, set language id at TextEditorModel level to block future auto-detection
				this.input.setLanguageId(candidateLanguage.id);
			} else {
				textModel.setLanguage(this.languageService.createById(candidateLanguage.id));
			}

			const opts = this.modelService.getCreationOptions(textModel.getLanguageId(), textModel.uri, textModel.isForSimpleWidget);
			textModel.detectIndentation(opts.insertSpaces, opts.tabSize);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/breadcrumbscontrol.css]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/breadcrumbscontrol.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .part.editor > .content .editor-group-container .breadcrumbs-control.hidden {
	display: none;
}

.monaco-workbench .part.editor > .content .editor-group-container .breadcrumbs-control .monaco-breadcrumb-item.selected .monaco-icon-label,
.monaco-workbench .part.editor > .content .editor-group-container .breadcrumbs-control .monaco-breadcrumb-item.focused .monaco-icon-label {
	text-decoration-line: underline;
}

.monaco-workbench .part.editor > .content .editor-group-container .breadcrumbs-control .monaco-breadcrumb-item.selected .hint-more,
.monaco-workbench .part.editor > .content .editor-group-container .breadcrumbs-control .monaco-breadcrumb-item.focused .hint-more {
	text-decoration-line: underline;
}

.monaco-workbench .monaco-breadcrumb-item.shows-symbol-icon .codicon[class*='codicon-symbol-'] {
	padding-right: 6px;
}

/* breadcrumbs-picker-style */

.monaco-workbench .monaco-breadcrumbs-picker .arrow {
	position: absolute;
	width: 0;
	border-style: solid;
}

.monaco-workbench .monaco-breadcrumbs-picker .picker-item {
	line-height: 22px;
	flex: 1;
}

.monaco-workbench .monaco-breadcrumbs-picker .highlighting-tree {
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.monaco-workbench .monaco-breadcrumbs-picker .highlighting-tree > .input {
	padding: 5px 9px;
	position: relative;
	box-sizing: border-box;
	height: 36px;
}

.monaco-workbench .monaco-breadcrumbs-picker .highlighting-tree > .tree {
	height: calc(100% - 36px);
}

.monaco-workbench .monaco-breadcrumbs-picker .highlighting-tree.inactive > .input {
	display: none;
}

.monaco-workbench .monaco-breadcrumbs-picker .highlighting-tree.inactive > .tree {
	height: 100%;
}

.monaco-workbench .monaco-breadcrumbs-picker .highlighting-tree .monaco-highlighted-label .highlight {
	font-weight: bold;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/editordroptarget.css]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/editordroptarget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

#monaco-workbench-editor-drop-overlay {
	position: absolute;
	z-index: 10000;
	width: 100%;
	height: 100%;
	left: 0;
}

#monaco-workbench-editor-drop-overlay > .editor-group-overlay-indicator {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none; /* very important to not take events away from the parent */
	opacity: 0; /* hidden initially */

	display: flex;
	align-items: center;
	justify-content: center;
}

.monaco-workbench.monaco-enable-motion #monaco-workbench-editor-drop-overlay > .editor-group-overlay-indicator {
	transition: opacity 150ms ease-out;
}

#monaco-workbench-editor-drop-overlay .editor-group-overlay-drop-into-prompt {
	text-align: center;
	padding: 0.6em;
	margin: 0.2em;
	line-height: normal;
	opacity: 0; /* hidden initially */
}

.monaco-workbench.monaco-enable-motion #monaco-workbench-editor-drop-overlay .editor-group-overlay-drop-into-prompt {
	transition: opacity 150ms ease-out;
}

#monaco-workbench-editor-drop-overlay .editor-group-overlay-drop-into-prompt i /* Style keybinding */ {
	padding: 0 8px;
	border: 1px solid hsla(0,0%,80%,.4);
	margin: 0 1px;
	border-radius: 5px;
	background-color: rgba(255, 255, 255, 0.05);
	font-style: normal;
}

.monaco-workbench.monaco-enable-motion #monaco-workbench-editor-drop-overlay > .editor-group-overlay-indicator.overlay-move-transition {
	transition: top 70ms ease-out, left 70ms ease-out, width 70ms ease-out, height 70ms ease-out, opacity 150ms ease-out;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/editorgroupview.css]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/editorgroupview.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Container */

.monaco-workbench .part.editor > .content .editor-group-container {
	height: 100%;
}

.monaco-workbench .part.editor > .content .editor-group-container.empty  {
	opacity: 0.5; /* dimmed to indicate inactive state */
}

.monaco-workbench .part.editor > .content .editor-group-container.empty.active,
.monaco-workbench .part.editor > .content .editor-group-container.empty.dragged-over {
	opacity: 1; /* indicate active/dragged-over group through undimmed state */
}

.monaco-workbench .part.editor > .content:not(.empty) .editor-group-container.empty.active:focus {
	outline-offset: -2px;
	outline: 1px solid var(--vscode-editorGroup-focusedEmptyBorder);
}

.monaco-workbench .part.editor > .content.empty .editor-group-container.empty.active:focus {
	outline: none; /* never show outline for empty group if it is the last */
}

/* Watermark & shortcuts */

.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-watermark  {
	display: flex;
	height: 100%;
	max-width: 272px;
	margin: auto;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-watermark > .watermark-container {
	display: flex;
	width: 100%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 24px;
}

.monaco-workbench .part.editor > .content .editor-group-container:not(.empty) > .editor-group-watermark {
	display: none;
}

.monaco-workbench .part.editor > .content:not(.empty) .editor-group-container.empty > .editor-group-watermark,
.monaco-workbench .part.editor > .content.auxiliary .editor-group-container.empty > .editor-group-watermark {
	max-width: 200px;
	height: calc(100% - 70px);
}

.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-watermark .letterpress {
	width: 100%;
	max-height: 100%;
	aspect-ratio: 1/1;
	background-image: url('./letterpress-light.svg');
	background-size: contain;
	background-position-x: center;
	background-repeat: no-repeat;
	max-width: 256px;
}

.monaco-workbench.vs-dark .part.editor > .content .editor-group-container .editor-group-watermark .letterpress {
	background-image: url('./letterpress-dark.svg');
}

.monaco-workbench.hc-light .part.editor > .content .editor-group-container .editor-group-watermark .letterpress {
	background-image: url('./letterpress-hcLight.svg');
}

.monaco-workbench.hc-black .part.editor > .content .editor-group-container .editor-group-watermark .letterpress {
	background-image: url('./letterpress-hcDark.svg');
}

.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-watermark .shortcuts {
	width: 100%;
}

.monaco-workbench .part.editor > .content:not(.empty) .editor-group-container > .editor-group-watermark .shortcuts,
.monaco-workbench .part.editor > .content.auxiliary .editor-group-container > .editor-group-watermark .shortcuts,
.monaco-workbench .part.editor > .content .editor-group-container.max-height-478px > .editor-group-watermark .shortcuts {
	display: none;
}

.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-watermark .shortcuts > .watermark-box {
	display: flex;
	flex-direction: column;
}

.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-watermark .shortcuts dl {
	display: flex;
	justify-content: space-between;
	margin: 4px 0;
	cursor: default;
	color: var(--vscode-descriptionForeground);
}

.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-watermark .shortcuts dl:first-of-type {
	margin-top: 0;
}

.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-watermark .shortcuts dl:last-of-type {
	margin-bottom: 0;
}

.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-watermark .shortcuts dt {
	letter-spacing: 0.04em;
}

.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-watermark .shortcuts dd {
	text-align: left;
	margin-inline-start: 24px;
}

/* Title */

.monaco-workbench .part.editor > .content .editor-group-container > .title {
	position: relative;
	box-sizing: border-box;
	overflow: hidden;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title:not(.tabs) {
	display: flex; /* when tabs are not shown, use flex layout */
	flex-wrap: nowrap;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.title-border-bottom::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	z-index: 9;
	pointer-events: none;
	background-color: var(--title-border-bottom-color);
	width: 100%;
	height: 1px;
}

.monaco-workbench .part.editor > .content .editor-group-container.empty > .title {
	display: none;
}

/* Toolbar */

.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-container-toolbar {
	display: none;
	height: 35px;
}

.monaco-workbench .part.editor > .content .editor-group-container.empty.locked > .editor-group-container-toolbar,
.monaco-workbench .part.editor > .content:not(.empty) .editor-group-container.empty > .editor-group-container-toolbar,
.monaco-workbench .part.editor > .content.auxiliary .editor-group-container.empty > .editor-group-container-toolbar {
	display: block; /* show toolbar when more than one editor group or always when auxiliary or locked */
}

.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-container-toolbar .actions-container {
	justify-content: flex-end;
}

.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-container-toolbar .action-item {
	margin-right: 4px;
}

/* Editor */

.monaco-workbench .part.editor > .content .editor-group-container.empty > .editor-container {
	display: none;
}

.monaco-workbench .part.editor > .content .editor-group-container > .editor-container > .editor-instance {
	height: 100%;
}

.monaco-workbench .part.editor > .content .grid-view-container {
	width: 100%;
	height: 100%;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/editorplaceholder.css]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/editorplaceholder.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor-pane-placeholder {
	padding: 0 16px 0 16px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
}

.monaco-editor-pane-placeholder:focus {
	outline: none !important;
}

.monaco-editor-pane-placeholder .editor-placeholder-icon-container .codicon {
	font-size: 48px !important;
}

.monaco-editor-pane-placeholder .editor-placeholder-icon-container .codicon.codicon-error {
	color: var(--vscode-editorError-foreground);
}

.monaco-editor-pane-placeholder .editor-placeholder-icon-container .codicon.codicon-warning {
	color: var(--vscode-editorWarning-foreground);
}

.monaco-editor-pane-placeholder .editor-placeholder-icon-container .codicon.codicon-info,
.monaco-editor-pane-placeholder .editor-placeholder-icon-container .codicon.codicon-workspace-untrusted {
	color: var(--vscode-editorInfo-foreground);
}

.monaco-editor-pane-placeholder.max-height-200px .editor-placeholder-icon-container {
	/* Hide the icon when height is limited */
	display: none;
}

.monaco-editor-pane-placeholder .editor-placeholder-label-container {
	font-size: 14px;
	max-width: 450px;
	text-align: center;
	word-break: break-word;
	user-select: text;
	-webkit-user-select: text;
}

.monaco-editor-pane-placeholder .editor-placeholder-buttons-container {
	display: flex;
}

.monaco-editor-pane-placeholder .editor-placeholder-buttons-container > .monaco-button {
	margin: 4px 5px;
}

.monaco-editor-pane-placeholder .editor-placeholder-buttons-container > .monaco-button {
	font-size: 14px;
	width: fit-content;
	padding: 6px 11px;
	outline-offset: 2px !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/editorquickaccess.css]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/editorquickaccess.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.quick-input-list .quick-input-list-entry.has-actions:hover .quick-input-list-entry-action-bar .action-label.dirty-editor::before {
	/* Close icon flips between black dot and "X" for dirty open editors */
	content: var(--vscode-icon-x-content);
	font-family: var(--vscode-icon-x-font-family);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/editorstatus.css]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/editorstatus.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .screen-reader-detected-explanation {
	width: 420px;
	top: 30px;
	right: 6px;
	padding: 1em;
	cursor: default;
}

.monaco-workbench .screen-reader-detected-explanation .cancel {
	position: absolute;
	top: 0;
	right: 0;
	padding: .5em;
	width: 22px;
	height: 22px;
	border: none;
	cursor: pointer;
}

.monaco-workbench .screen-reader-detected-explanation h2 {
	margin: 0;
	padding: 0;
	font-weight: 400;
	font-size: 1.8em;
}

.monaco-workbench .screen-reader-detected-explanation p {
	font-size: 1.2em;
}

.monaco-workbench .screen-reader-detected-explanation hr {
	border: 0;
	height: 2px;
}

.monaco-workbench .screen-reader-detected-explanation .buttons {
	display: flex;
}

.monaco-workbench .screen-reader-detected-explanation .buttons a {
	font-size: 13px;
	padding-left: 12px;
	padding-right: 12px;
	margin-right: 5px;
	max-width: fit-content;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/editortabscontrol.css]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/editortabscontrol.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Editor Label */

.monaco-workbench .part.editor > .content .editor-group-container > .title {
	cursor: pointer;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .title-label,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab .tab-label {
	white-space: nowrap !important;
	flex: 1;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .title-label .label-name,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab .tab-label .label-name {
	white-space: nowrap;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .title-label a,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab .tab-label a {
	font-size: 13px;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .monaco-icon-label::before,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab .monaco-icon-label::before,
.monaco-workbench .part.editor > .content .editor-group-container > .title .title-label a,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab .tab-label a,
.monaco-workbench .part.editor > .content .editor-group-container > .title .title-label h2,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab .tab-label span {
	cursor: pointer;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .monaco-icon-label {
	&::before,
	& > .monaco-icon-label-iconpath {
		height: var(--editor-group-tab-height); /* tweak the icon size of the editor labels when icons are enabled */
	}
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .monaco-icon-label::after,
.monaco-workbench .part.editor > .content .editor-group-container > .title.tabs .monaco-icon-label::after {
	margin-right: 0; /* by default the icon label has a padding right and this isn't wanted when not showing tabs and not showing breadcrumbs */
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/editortitlecontrol.css]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/editortitlecontrol.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Breadcrumbs (below multiple editor tabs) */

.monaco-workbench .part.editor > .content .editor-group-container > .title .breadcrumbs-below-tabs .breadcrumbs-control {
	flex: 1 100%;
	height: 22px;
	cursor: default;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .breadcrumbs-below-tabs .breadcrumbs-control .monaco-icon-label {
	height: 22px;
	line-height: 22px;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .breadcrumbs-below-tabs .breadcrumbs-control .monaco-icon-label::before {
	height: 22px; /* tweak the icon size of the editor labels when icons are enabled */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .breadcrumbs-below-tabs .breadcrumbs-control .outline-element-icon {
	padding-right: 3px;
	height: 22px; /* tweak the icon size of the editor labels when icons are enabled */
	line-height: 22px;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .breadcrumbs-below-tabs .breadcrumbs-control .monaco-breadcrumb-item {
	max-width: 80%;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .breadcrumbs-below-tabs .breadcrumbs-control .monaco-breadcrumb-item::before {
	width: 16px;
	height: 22px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .breadcrumbs-below-tabs .breadcrumbs-control .monaco-breadcrumb-item:last-child {
	padding-right: 8px;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .breadcrumbs-below-tabs .breadcrumbs-control .monaco-breadcrumb-item:last-child .codicon:last-child {
	display: none; /* hides chevrons when last item */
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/letterpress-dark.svg]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/letterpress-dark.svg

```text
<svg width="260" height="260" viewBox="0 0 260 260" opacity="0.3" xmlns="http://www.w3.org/2000/svg">
<path d="M220 16H40C17.909 16 0 33.909 0 56V204C0 226.091 17.909 244 40 244H220C242.091 244 260 226.091 260 204V56C260 33.909 242.091 16 220 16ZM12 204V56C12 40.561 24.561 28 40 28H75V232H40C24.561 232 12 219.439 12 204ZM248 204C248 219.439 235.439 232 220 232H87V28H220C235.439 28 248 40.561 248 56V204ZM112 58C112 54.686 114.686 52 118 52H187C190.314 52 193 54.686 193 58C193 61.314 190.314 64 187 64H118C114.686 64 112 61.314 112 58ZM193 202C193 205.314 190.314 208 187 208H118C114.686 208 112 205.314 112 202C112 198.686 114.686 196 118 196H187C190.314 196 193 198.686 193 202ZM222 94C222 97.314 219.314 100 216 100H147C143.686 100 141 97.314 141 94C141 90.686 143.686 88 147 88H216C219.314 88 222 90.686 222 94ZM222 130C222 133.314 219.314 136 216 136H147C143.686 136 141 133.314 141 130C141 126.686 143.686 124 147 124H216C219.314 124 222 126.686 222 130ZM222 166C222 169.314 219.314 172 216 172H147C143.686 172 141 169.314 141 166C141 162.686 143.686 160 147 160H216C219.314 160 222 162.686 222 166Z"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/letterpress-hcDark.svg]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/letterpress-hcDark.svg

```text
<svg width="260" height="260" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M220 16H40C17.909 16 0 33.909 0 56V204C0 226.091 17.909 244 40 244H220C242.091 244 260 226.091 260 204V56C260 33.909 242.091 16 220 16ZM12 204V56C12 40.561 24.561 28 40 28H75V232H40C24.561 232 12 219.439 12 204ZM248 204C248 219.439 235.439 232 220 232H87V28H220C235.439 28 248 40.561 248 56V204ZM112 58C112 54.686 114.686 52 118 52H187C190.314 52 193 54.686 193 58C193 61.314 190.314 64 187 64H118C114.686 64 112 61.314 112 58ZM193 202C193 205.314 190.314 208 187 208H118C114.686 208 112 205.314 112 202C112 198.686 114.686 196 118 196H187C190.314 196 193 198.686 193 202ZM222 94C222 97.314 219.314 100 216 100H147C143.686 100 141 97.314 141 94C141 90.686 143.686 88 147 88H216C219.314 88 222 90.686 222 94ZM222 130C222 133.314 219.314 136 216 136H147C143.686 136 141 133.314 141 130C141 126.686 143.686 124 147 124H216C219.314 124 222 126.686 222 130ZM222 166C222 169.314 219.314 172 216 172H147C143.686 172 141 169.314 141 166C141 162.686 143.686 160 147 160H216C219.314 160 222 162.686 222 166Z" fill="#3C3C3C"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/letterpress-hcLight.svg]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/letterpress-hcLight.svg

```text
<svg width="260" height="260" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M220 16H40C17.909 16 0 33.909 0 56V204C0 226.091 17.909 244 40 244H220C242.091 244 260 226.091 260 204V56C260 33.909 242.091 16 220 16ZM12 204V56C12 40.561 24.561 28 40 28H75V232H40C24.561 232 12 219.439 12 204ZM248 204C248 219.439 235.439 232 220 232H87V28H220C235.439 28 248 40.561 248 56V204ZM112 58C112 54.686 114.686 52 118 52H187C190.314 52 193 54.686 193 58C193 61.314 190.314 64 187 64H118C114.686 64 112 61.314 112 58ZM193 202C193 205.314 190.314 208 187 208H118C114.686 208 112 205.314 112 202C112 198.686 114.686 196 118 196H187C190.314 196 193 198.686 193 202ZM222 94C222 97.314 219.314 100 216 100H147C143.686 100 141 97.314 141 94C141 90.686 143.686 88 147 88H216C219.314 88 222 90.686 222 94ZM222 130C222 133.314 219.314 136 216 136H147C143.686 136 141 133.314 141 130C141 126.686 143.686 124 147 124H216C219.314 124 222 126.686 222 130ZM222 166C222 169.314 219.314 172 216 172H147C143.686 172 141 169.314 141 166C141 162.686 143.686 160 147 160H216C219.314 160 222 162.686 222 166Z" fill="#D9D9D9"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/letterpress-light.svg]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/letterpress-light.svg

```text
<svg width="260" height="260" viewBox="0 0 260 260" opacity="0.1" xmlns="http://www.w3.org/2000/svg">
<path d="M220 16H40C17.909 16 0 33.909 0 56V204C0 226.091 17.909 244 40 244H220C242.091 244 260 226.091 260 204V56C260 33.909 242.091 16 220 16ZM12 204V56C12 40.561 24.561 28 40 28H75V232H40C24.561 232 12 219.439 12 204ZM248 204C248 219.439 235.439 232 220 232H87V28H220C235.439 28 248 40.561 248 56V204ZM112 58C112 54.686 114.686 52 118 52H187C190.314 52 193 54.686 193 58C193 61.314 190.314 64 187 64H118C114.686 64 112 61.314 112 58ZM193 202C193 205.314 190.314 208 187 208H118C114.686 208 112 205.314 112 202C112 198.686 114.686 196 118 196H187C190.314 196 193 198.686 193 202ZM222 94C222 97.314 219.314 100 216 100H147C143.686 100 141 97.314 141 94C141 90.686 143.686 88 147 88H216C219.314 88 222 90.686 222 94ZM222 130C222 133.314 219.314 136 216 136H147C143.686 136 141 133.314 141 130C141 126.686 143.686 124 147 124H216C219.314 124 222 126.686 222 130ZM222 166C222 169.314 219.314 172 216 172H147C143.686 172 141 169.314 141 166C141 162.686 143.686 160 147 160H216C219.314 160 222 162.686 222 166Z"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/multieditortabscontrol.css]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/multieditortabscontrol.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*
	################################### z-index explainer ###################################

	Tabs have various levels of z-index depending on state, typically:
	- scrollbar should be above all
	- sticky (compact, shrink) tabs need to be above non-sticky tabs for scroll under effect
	including non-sticky tabs-top borders, otherwise these borders would not scroll under
	(https://github.com/microsoft/vscode/issues/111641)
	- bottom-border needs to be above tabs bottom border to win but also support sticky tabs
	(https://github.com/microsoft/vscode/issues/99084) <- this currently cannot be done and
	is still broken. putting sticky-tabs above tabs bottom border would not render this
	border at all for sticky tabs.

	On top of that there is 3 borders with a z-index for a general border below or above tabs
	- tabs bottom border
	- editor title bottom border (when breadcrumbs are disabled, this border will appear
	same as tabs bottom border)
	- editor group border

	Finally, we show a drop overlay that should always be on top of everything.

	The following tabls shows the current stacking order:

	[z-index] 	[kind]
			12  drag and drop overlay
			11 	scrollbar / tabs dnd border
			10	active-tab border-bottom
			9	tabs, title border bottom
			8	sticky-tab
			6  	active/dirty-tab border top
			5   editor group border / editor group header border
			0   tab

	##########################################################################################
*/

/* Tabs and Actions Container */

.monaco-workbench .part.editor > .content .editor-group-container > .title > .tabs-and-actions-container {
	display: flex;
	position: relative; /* position tabs border bottom or editor actions (when tabs wrap) relative to this container */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title > .tabs-and-actions-container.empty {
	display: none;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title > .tabs-and-actions-container.tabs-border-bottom::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	z-index: 9;
	pointer-events: none;
	background-color: var(--tabs-border-bottom-color);
	width: 100%;
	height: 1px;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title > .tabs-and-actions-container > .monaco-scrollable-element {
	flex: 1;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title > .tabs-and-actions-container > .monaco-scrollable-element .scrollbar {
	z-index: 11;
	cursor: default;
}

/* Tabs Container */

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container {
	display: flex;
	height: var(--editor-group-tab-height);
	scrollbar-width: none; /* Firefox: hide scrollbar */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container.scroll {
	overflow: scroll !important;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title > .tabs-and-actions-container.wrapping .tabs-container {

	/* Enable wrapping via flex layout and dynamic height */
	height: auto;
	flex-wrap: wrap;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container::-webkit-scrollbar {
	display: none; /* Chrome + Safari: hide scrollbar */
}

/* Tab */

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab {
	position: relative;
	display: flex;
	white-space: nowrap;
	cursor: pointer;
	height: var(--editor-group-tab-height);
	box-sizing: border-box;
	padding-left: 10px;
	outline-offset: -2px;
}

/* Tab Background Color in/active group/tab */
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab {
	background-color: var(--vscode-tab-unfocusedInactiveBackground);
}
.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab {
	background-color: var(--vscode-tab-inactiveBackground);
}
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active {
	background-color: var(--vscode-tab-unfocusedActiveBackground);
}
.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab.active {
	background-color: var(--vscode-tab-activeBackground);
}

/* Tab Foreground Color in/active group/tab */
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab {
	color: var(--vscode-tab-unfocusedInactiveForeground);
}
.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab {
	color: var(--vscode-tab-inactiveForeground);
}
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active {
	color: var(--vscode-tab-unfocusedActiveForeground);
}
.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab.active {
	color: var(--vscode-tab-activeForeground);
}

.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab.selected:not(.active) {
	background-color: var(--vscode-tab-selectedBackground);
	color: var(--vscode-tab-selectedForeground);
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab:not(.active) {
	box-shadow: none;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title > .tabs-and-actions-container.wrapping .tabs-container > .tab:last-child {
	margin-right: var(--last-tab-margin-right); /* when tabs wrap, we need a margin away from the absolute positioned editor actions */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title > .tabs-and-actions-container.wrapping .tabs-container > .tab.last-in-row:not(:last-child) {
	border-right: 0 !important; /* ensure no border for every last tab in a row except last row (#115046) */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink.has-icon.tab-actions-right,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink.has-icon.close-action-off:not(.sticky-compact),
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed.has-icon.tab-actions-right,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed.has-icon.close-action-off:not(.sticky-compact) {
	padding-left: 5px; /* reduce padding when we show icons and are in shrinking mode and tab actions is not left (unless sticky-compact) */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fit {
	width: 120px;
	min-width: fit-content;
	flex-shrink: 0;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed {
	min-width: var(--tab-sizing-current-width, var(--tab-sizing-fixed-min-width, 50px));
	max-width: var(--tab-sizing-current-width, var(--tab-sizing-fixed-max-width, 160px));
	flex: 1 0 0; /* all tabs are evenly sized and grow */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed.last-in-row {
	/* prevent last tab in a row from moving to next row when tab widths are
	 * fixed in case rounding errors make the fixed tabs grow over the size
	 * of the tabs container */
	min-width: calc(var(--tab-sizing-current-width, var(--tab-sizing-fixed-min-width, 50px)) - 1px);
}

.monaco-workbench .part.editor > .content .editor-group-container > .title > .tabs-and-actions-container.wrapping .tabs-container > .tab.sizing-fit.last-in-row:not(:last-child) {
	flex-grow: 1; /* grow the last tab in a row for a more homogeneous look except for last row (#113801) */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink {
	min-width: 80px;
	flex-basis: 0; /* all tabs are even */
	flex-grow: 1; /* all tabs grow even */
	max-width: fit-content;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fit.sticky-compact,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink.sticky-compact,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed.sticky-compact,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fit.sticky-shrink,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink.sticky-shrink,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed.sticky-shrink {

	/** Sticky compact/shrink/fixed tabs do not scroll in case of overflow and are always above unsticky tabs which scroll under */
	position: sticky;
	z-index: 8;

	/** Sticky compact/shrink/fixed tabs are even and never grow */
	flex-basis: 0;
	flex-grow: 0;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fit.sticky-compact,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink.sticky-compact,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed.sticky-compact {

	/** Sticky compact tabs have a fixed width of 38px */
	width: 38px;
	min-width: 38px;
	max-width: 38px;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fit.sticky-shrink,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink.sticky-shrink,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed.sticky-shrink {

	/** Sticky shrink tabs have a fixed width of 80px */
	width: 80px;
	min-width: 80px;
	max-width: 80px;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container.disable-sticky-tabs > .tab.sizing-fit.sticky-compact,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container.disable-sticky-tabs > .tab.sizing-shrink.sticky-compact,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container.disable-sticky-tabs > .tab.sizing-fixed.sticky-compact,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container.disable-sticky-tabs > .tab.sizing-fit.sticky-shrink,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container.disable-sticky-tabs > .tab.sizing-shrink.sticky-shrink,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container.disable-sticky-tabs > .tab.sizing-fixed.sticky-shrink {

	/**
	 * If sticky tabs are explicitly disabled, because width is too little, make sure
	 * to reset all styles associated with sticky tabs. This includes position, z-index
	 * and left property (which is set on the element itself, hence important is needed).
	 */
	position: relative;
	z-index: unset;
	left: unset !important;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab .tab-fade-hider {
	display: none;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink.tab-actions-left .tab-fade-hider,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink.close-action-off .tab-fade-hider,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed.tab-actions-left .tab-fade-hider,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed.close-action-off .tab-fade-hider {
	display: flex;
	flex: 0;
	width: 5px; /* reserve space to hide tab fade when close button is left or off (fixes https://github.com/microsoft/vscode/issues/45728) */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink.tab-actions-left,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed.tab-actions-left {
	min-width: 80px; /* make more room for close button when it shows to the left */
	padding-right: 5px; /* we need less room when sizing is shrink/fixed */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.tab-actions-left:not(.sticky-compact) {
	flex-direction: row-reverse;
	padding-left: 0;
	padding-right: 10px;
}

/* Tab border top/bottom */

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab > .tab-border-top-container,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab > .tab-border-bottom-container {
	display: none; /* hidden by default until a color is provided (see below) */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active.tab-border-top > .tab-border-top-container,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.selected.tab-border-top > .tab-border-top-container,
.monaco-workbench .part.editor > .content .editor-group-container > .title:not(.two-tab-bars) .tabs-container > .tab.active.tab-border-bottom > .tab-border-bottom-container,
.monaco-workbench .part.editor > .content .editor-group-container > .title.two-tab-bars .tabs-and-actions-container:not(:first-child)  .tabs-container > .tab.active.tab-border-bottom > .tab-border-bottom-container,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.dirty-border-top > .tab-border-top-container {
	display: block;
	position: absolute;
	left: 0;
	pointer-events: none;
	width: 100%;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active.tab-border-top:not(:focus) > .tab-border-top-container,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.selected.tab-border-top:not(:focus) > .tab-border-top-container {
	z-index: 6;
	top: 0;
	height: 1px;
	background-color: var(--tab-border-top-color);
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active.tab-border-bottom > .tab-border-bottom-container {
	z-index: 10;
	bottom: 0;
	height: 1px;
	background-color: var(--tab-border-bottom-color);
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.dirty-border-top:not(:focus) > .tab-border-top-container {
	z-index: 6;
	top: 0;
	height: 2px;
	background-color: var(--tab-dirty-border-top-color);
}

/* Tab Label */

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab .tab-label {
	margin-top: auto;
	margin-bottom: auto;
	line-height: var(--editor-group-tab-height); /* aligns icon and label vertically centered in the tab */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink .tab-label,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed .tab-label {
	position: relative;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container >  .tab.sizing-shrink > .tab-label > .monaco-icon-label-container::after,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container >  .tab.sizing-fixed > .tab-label > .monaco-icon-label-container::after {
	content: ''; /* enables a linear gradient to overlay the end of the label when tabs overflow */
	position: absolute;
	right: 0;
	width: 5px;
	opacity: 1;
	padding: 0;
	/* the rules below ensure that the gradient does not impact top/bottom borders (https://github.com/microsoft/vscode/issues/115129) */
	top: 1px;
	bottom: 1px;
	height: calc(100% - 2px);
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container >  .tab.sizing-shrink:focus > .tab-label > .monaco-icon-label-container::after,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container >  .tab.sizing-fixed:focus > .tab-label > .monaco-icon-label-container::after {
	opacity: 0; /* when tab has the focus this shade breaks the tab border (fixes https://github.com/microsoft/vscode/issues/57819) */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container >  .tab.sizing-shrink > .tab-label.tab-label-has-badge::after,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container >  .tab.sizing-fixed > .tab-label.tab-label-has-badge::after {
	margin-right: 5px; /* with tab sizing shrink/fixed and badges, we want a right-margin because the close button is hidden. Use margin instead of padding to support animating the badge (https://github.com/microsoft/vscode/issues/242661) */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink:not(.tab-actions-left):not(.close-action-off) .tab-label {
	padding-right: 5px; /* ensure that the gradient does not show when tab actions show https://github.com/microsoft/vscode/issues/189625*/
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sticky-compact:not(.has-icon) .monaco-icon-label {
	text-align: center; /* ensure that sticky-compact tabs without icon have label centered */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fit .monaco-icon-label,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fit .monaco-icon-label > .monaco-icon-label-container {
	overflow-x: visible; /* fixes https://github.com/microsoft/vscode/issues/20182 by ensuring the horizontal overflow is visible */

	scrollbar-width: none; /* Firefox */
	-ms-overflow-style: none; /* Internet Explorer 10+ */
	&::-webkit-scrollbar {
		display: none; /* Chrome, Safari, and Opera */
	}
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink > .monaco-icon-label > .monaco-icon-label-container,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed > .monaco-icon-label > .monaco-icon-label-container {
	text-overflow: clip;
	flex: none;
}

.monaco-workbench.hc-black .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink > .monaco-icon-label > .monaco-icon-label-container,
.monaco-workbench.hc-light .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink > .monaco-icon-label > .monaco-icon-label-container,
.monaco-workbench.hc-black .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed > .monaco-icon-label > .monaco-icon-label-container,
.monaco-workbench.hc-light .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed > .monaco-icon-label > .monaco-icon-label-container {
	text-overflow: ellipsis;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab > .monaco-icon-label.italic > .monaco-icon-label-container {
	/**
	 * Browser rendering engines seem to have trouble to render italic labels
	 * fully without clipping in case the parent container has `overflow: hidden`
	 * and/or `flex: none`. We added those styles to fix other issues so a pragmatic
	 * solution is to give the label container a bit more room to fully render.
	 *
	 * Refs: https://github.com/microsoft/vscode/issues/207409
	 */
	padding-right: 1px;
}

/* Tab Actions */

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab > .tab-actions {
	margin-top: auto;
	margin-bottom: auto;
	width: 28px;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab > .tab-actions > .monaco-action-bar {
	width: 28px;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.tab-actions-right.sizing-shrink > .tab-actions,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.tab-actions-right.sizing-fixed > .tab-actions {
	flex: 0;
	overflow: hidden; /* let the tab actions be pushed out of view when sizing is set to shrink/fixed to make more room */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.dirty.tab-actions-right.sizing-shrink > .tab-actions,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sticky.tab-actions-right.sizing-shrink > .tab-actions,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.tab-actions-right.sizing-shrink:hover > .tab-actions,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.tab-actions-right.sizing-shrink > .tab-actions:focus-within,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.dirty.tab-actions-right.sizing-fixed > .tab-actions,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sticky.tab-actions-right.sizing-fixed > .tab-actions,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.tab-actions-right.sizing-fixed:hover > .tab-actions,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.tab-actions-right.sizing-fixed > .tab-actions:focus-within {
	overflow: visible; /* ...but still show the tab actions on hover, focus and when dirty or sticky */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.close-action-off:not(.dirty) > .tab-actions,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sticky-compact > .tab-actions {
	display: none; /* hide the tab actions when we are configured to hide it (unless dirty, but always when sticky-compact) */
}

.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab.active > .tab-actions .action-label,		/* always show tab actions for active tab */
.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab > .tab-actions .action-label:focus,		/* always show tab actions on focus */
.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab:hover > .tab-actions .action-label,		/* always show tab actions on hover */
.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab.active:hover > .tab-actions .action-label,	/* always show tab actions on hover */
.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab.sticky:not(.pinned-action-off) > .tab-actions .action-label,		/* always show tab actions for sticky tabs */
.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab.dirty > .tab-actions .action-label {		/* always show tab actions for dirty tabs */
	opacity: 1;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab > .tab-actions .actions-container {
	justify-content: center;
}

.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab > .tab-actions .action-label.codicon {
	color: inherit;
	font-size: 16px;
	padding: 2px;
	width: 16px;
	height: 16px;
}

.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab.sticky.dirty > .tab-actions .action-label:not(:hover)::before,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sticky.dirty > .tab-actions .action-label:not(:hover)::before {
	/* use `pinned-dirty` icon unicode for sticky-dirty indication */
	content: var(--vscode-icon-pinned-dirty-content);
	font-family: var(--vscode-icon-pinned-dirty-font-family);
}

.monaco-workbench .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab.dirty > .tab-actions .action-label:not(:hover)::before,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.dirty > .tab-actions .action-label:not(:hover)::before {
	/* use `circle-filled` icon unicode for dirty indication */
	content: var(--vscode-icon-circle-filled-content);
	font-family: var(--vscode-icon-circle-filled-font-family);
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active > .tab-actions .action-label,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active:hover > .tab-actions .action-label,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.dirty > .tab-actions .action-label,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sticky:not(.pinned-action-off) > .tab-actions .action-label,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab:hover > .tab-actions .action-label {
	opacity: 0.5; /* show tab actions dimmed for inactive group */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab > .tab-actions .action-label {
	opacity: 0;
}

/* Tab Actions: Off */

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.close-action-off {
	padding-right: 10px; /* give a little bit more room if tab actions is off */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-shrink.close-action-off:not(.sticky-compact),
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.sizing-fixed.close-action-off:not(.sticky-compact) {
	padding-right: 5px; /* we need less room when sizing is shrink/fixed (unless tab is sticky-compact) */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.close-action-off.dirty-border-top > .tab-actions {
	display: none; /* hide dirty state when highlightModifiedTabs is enabled and when running without tab actions */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.close-action-off.dirty:not(.dirty-border-top):not(.sticky-compact) {
	padding-right: 0; /* remove extra padding when we are running without tab actions (unless tab is sticky-compact) */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.close-action-off > .tab-actions {
	pointer-events: none; /* don't allow tab actions to be clicked when running without tab actions */
}

/* Editor Actions Toolbar */

.monaco-workbench .part.editor > .content .editor-group-container > .title .editor-actions {
	cursor: default;
	flex: initial;
	padding: 0 8px 0 4px;
	height: var(--editor-group-tab-height);
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .editor-actions.hidden {
	display: none;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .editor-actions .action-item {
	margin-right: 4px;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title > .tabs-and-actions-container.wrapping .editor-actions {

	/* When tabs are wrapped, position the editor actions at the end of the very last row */
	position: absolute;
	bottom: 0;
	right: 0;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.two-tab-bars > .tabs-and-actions-container:first-child .editor-actions {

	/* When multiple tab bars are visible, only show editor actions for the last tab bar */
	display: none;
}

/* Drag and drop target */

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.drop-target-left::after,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.drop-target-right::before {
	content: "";
	position: absolute;
	top: 0;
	height: 100%;
	width: 1px;
	background-color: var(--vscode-tab-dragAndDropBorder);
	pointer-events: none;
	z-index: 11;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.drop-target-right::before {
	left: 0;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.drop-target-left::after {
	right: -1px; /* -1 to connect with drop-target-right */
}

/* Make drop target edge cases more visible (wrapped tabs & first/last) */

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.last-in-row.drop-target-left:not(:last-child)::after {
	right: 0px;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.last-in-row.drop-target-left::after,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.last-in-row + .tab.drop-target-right::before,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab:last-child.drop-target-left::after,
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab:first-child.drop-target-right::before {
	width: 2px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/sidebysideeditor.css]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/sidebysideeditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.side-by-side-editor-container {
	width: 100%;
	height: 100%;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/media/singleeditortabscontrol.css]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/media/singleeditortabscontrol.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Title Label */

.monaco-workbench .part.editor > .content .editor-group-container > .title > .label-container {
	height: var(--editor-group-tab-height);
	display: flex;
	justify-content: flex-start;
	align-items: center;
	overflow: hidden;
	flex: auto;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title > .label-container > .title-label {
	line-height: var(--editor-group-tab-height);
	overflow: hidden;
	text-overflow: ellipsis;
	position: relative;
	padding-left: 20px;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title > .label-container > .title-label > .monaco-icon-label-container {
	flex: initial; /* helps to show decorations right next to the label and not at the end while still preserving text overflow ellipsis */
}

/* Breadcrumbs (inline next to single editor tab) */

.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .single-tab.title-label {
	flex: none;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control {
	line-height: var(--editor-group-tab-height);
	flex: 1 50%;
	overflow: hidden;
	margin-left: .45em;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control.preview .monaco-breadcrumb-item {
	font-style: italic;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control .monaco-breadcrumb-item::before {
	content: '/';
	opacity: 1;
	height: inherit;
	width: inherit;
	background-image: none;
	font-size: 0.9em;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control.backslash-path .monaco-breadcrumb-item::before {
	content: '\\';
	font-size: 0.9em;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control .monaco-breadcrumb-item .outline-element-icon::before {
	font-size: 0.9em;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control .monaco-breadcrumb-item.root_folder::before,
.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control .monaco-breadcrumb-item.root_folder + .monaco-breadcrumb-item::before,
.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control.relative-path .monaco-breadcrumb-item:nth-child(2)::before,
.monaco-workbench.windows .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control .monaco-breadcrumb-item:nth-child(2)::before {
	display: none; /* workspace folder, item following workspace folder, or relative path -> hide first seperator */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control .monaco-breadcrumb-item.root_folder::after {
	content: '\00a0•\00a0'; /* use dot separator for workspace folder */
	font-size: 0.9em;
	padding: 0;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control .monaco-breadcrumb-item:last-child {
	padding-right: 4px; /* does not have trailing separator*/
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control .monaco-breadcrumb-item .codicon[class*='codicon-symbol-'] {
	padding: 0 1px;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control .monaco-breadcrumb-item .codicon:last-child {
	display: none; /* hides chevrons when no tabs visible */
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control .monaco-icon-label::before {
	height: 18px;
	padding-right: 2px;
}

.monaco-workbench .part.editor > .content .editor-group-container > .title.breadcrumbs .breadcrumbs-control .monaco-icon-label .label-name {
	font-size: 0.9em;
}

/* Editor Actions Toolbar (via title actions) */

.monaco-workbench .part.editor > .content .editor-group-container > .title > .title-actions {
	display: flex;
	flex: initial;
	opacity: 0.5;
	padding-right: 8px;
	height: var(--editor-group-tab-height);
}

.monaco-workbench .part.editor > .content .editor-group-container > .title > .title-actions.hidden {
	display: none;
}


.monaco-workbench .part.editor > .content .editor-group-container > .title > .title-actions .action-item {
	margin-right: 4px;
}

.monaco-workbench .part.editor > .content .editor-group-container.active > .title > .title-actions {
	opacity: 1;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/media/compositepart.css]---
Location: vscode-main/src/vs/workbench/browser/parts/media/compositepart.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .part > .content > .composite {
	height: 100%;
}

.monaco-workbench .part > .composite.header-or-footer,
.monaco-workbench .part > .composite.title {
	display: flex;
}

.monaco-workbench .part > .composite.title > .title-actions {
	flex: 1;
	padding-left: 8px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/media/paneCompositePart.css]---
Location: vscode-main/src/vs/workbench/browser/parts/media/paneCompositePart.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .pane-composite-part > .title.has-composite-bar > .title-actions .monaco-action-bar .actions-container {
	justify-content: flex-end;
}

.monaco-workbench .pane-composite-part > .title.has-composite-bar > .title-actions .monaco-action-bar .action-item,
.monaco-workbench .pane-composite-part > .title.has-composite-bar > .global-actions .monaco-action-bar .action-item {
	margin-right: 4px;
}

.monaco-workbench .pane-composite-part > .title.has-composite-bar > .title-actions .monaco-action-bar .action-item .action-label {
	outline-offset: -2px;
}

.monaco-workbench .pane-composite-part > .title.has-composite-bar > .title-label {
	display: none;
}

.monaco-workbench .pane-composite-part.empty > .title.has-composite-bar > .title-label {
	border-bottom: none !important;
}

.monaco-workbench .pane-composite-part > .header-or-footer {
	padding-left: 4px;
	padding-right: 4px;
	background-color: var(--vscode-activityBarTop-background);
}

.monaco-workbench .pane-composite-part:not(.empty) > .header {
	border-bottom: 1px solid var(--vscode-sideBarActivityBarTop-border);
}

.monaco-workbench .pane-composite-part:not(.empty) > .footer {
	border-top: 1px solid var(--vscode-sideBarActivityBarTop-border);
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container {
	display: flex;
}

.monaco-workbench .pane-composite-part > .header-or-footer .composite-bar-container {
	flex: 1;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-label.codicon-more,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-label.codicon-more {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 0px;
	margin-right: 0px;
	color: inherit !important;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar {
	line-height: 27px; /* matches panel titles in settings */
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item {
	text-transform: uppercase;
	padding-left: 10px;
	padding-right: 10px;
	font-size: 11px;
	padding-bottom: 2px; /* puts the bottom border down */
	padding-top: 2px;
	display: flex;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container >.composite-bar > .monaco-action-bar .action-item.icon,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container >.composite-bar > .monaco-action-bar .action-item.icon {
	height: 35px; /* matches height of composite container */
	padding: 0 3px;
}


.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .action-label:not(.codicon),
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .action-label:not(.codicon) {
	width: 16px;
	height: 16px;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item::before,
.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item::after,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item::before,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item::after {
	content: '';
	width: 2px;
	height: 24px;
	position: absolute;
	display: none;
	opacity: 0;
	background-color: var(--insert-border-color);
	transition-property: opacity;
	transition-duration: 0ms;
	transition-delay: 100ms;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container.dragged-over > .composite-bar > .monaco-action-bar .action-item::before,
.monaco-workbench .pane-composite-part > .title > .composite-bar-container.dragged-over > .composite-bar > .monaco-action-bar .action-item::after,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container.dragged-over > .composite-bar > .monaco-action-bar .action-item::before,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container.dragged-over > .composite-bar > .monaco-action-bar .action-item::after {
	display: block;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item::before,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item::before {
	left: 1px;
	margin-left: -2px;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item::after,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item::after {
	right: 1px;
	margin-right: -2px;
}


.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:first-of-type::before,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:first-of-type::before {
	left: 2px;
	margin-left: -2px;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:last-of-type::after,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:last-of-type::after {
	right: 2px;
	margin-right: -2px;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.right::before,
.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.left::after,
.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.left::before,
.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.right::after,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.right::before,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.left::after,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.left::before,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.right::after {
	transition-delay: 0s;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.right + .action-item::before,
.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.left::before,
.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:last-of-type.right::after,
.monaco-workbench .pane-composite-part > .title > .composite-bar-container.dragged-over-head > .composite-bar > .monaco-action-bar .action-item:first-of-type::before,
.monaco-workbench .pane-composite-part > .title > .composite-bar-container.dragged-over-tail > .composite-bar > .monaco-action-bar .action-item:last-of-type::after,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.right + .action-item::before,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.left::before,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:last-of-type.right::after,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container.dragged-over-head > .composite-bar > .monaco-action-bar .action-item:first-of-type::before,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container.dragged-over-tail > .composite-bar > .monaco-action-bar .action-item:last-of-type::after {
	opacity: 1;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label {
	margin-right: 0;
	padding: 2px;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label:not(.codicon-more),
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label:not(.codicon-more) {
	border-radius: 0;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:not(.icon) .action-label,
.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .action-label.codicon:not(.codicon-more),
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:not(.icon) .action-label,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .action-label.codicon:not(.codicon-more) {
	background: none !important;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked .action-label,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked .action-label {
	margin-right: 0;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .badge,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .badge {
	margin-left: 2px;
	display: flex;
	align-items: center;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .badge,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .badge {
	margin-left: 0px;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .badge .badge-content,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .badge .badge-content {
	padding: 3px 5px;
	border-radius: 10px;
	font-size: 10px;
	min-width: 16px;
	height: 16px;
	line-height: 10px;
	font-weight: normal;
	text-align: center;
	display: inline-block;
	box-sizing: border-box;
	position: relative;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .icon-badge .badge-content {
	padding: 3px;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .badge.compact,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .badge.compact {
	position: absolute;
	top: 0;
	bottom: 0;
	margin: auto;
	left: 0;
	overflow: hidden;
	width: 100%;
	height: 100%;
	z-index: 2;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .badge.compact .badge-content,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .badge.compact .badge-content {
	position: absolute;
	top: 17px;
	right: 0px;
	font-size: 9px;
	font-weight: 600;
	min-width: 13px;
	height: 13px;
	line-height: 13px;
	padding: 0 2px;
	border-radius: 16px;
	text-align: center;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .badge.compact.compact-content .badge-content,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .badge.compact.compact-content .badge-content {
	font-size: 8px;
	padding: 0 3px;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .badge.compact.progress-badge .badge-content::before,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .badge.compact.progress-badge .badge-content::before {
	mask-size: 13px;
	-webkit-mask-size: 13px;
}

/* active item indicator */
.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .active-item-indicator,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .active-item-indicator {
	position: absolute;
	z-index: 1;
	bottom: 0;
	overflow: hidden;
	pointer-events: none;
	height: 100%;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .active-item-indicator,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .active-item-indicator {
	top: -4px;
	left: 10px;
	width: calc(100% - 20px);
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .active-item-indicator,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon .active-item-indicator {
	top: 1px;
	left: 2px;
	width: calc(100% - 4px);
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon.checked,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.icon.checked {
	background-color: var(--vscode-activityBarTop-activeBackground);
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked .active-item-indicator:before,
.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:focus .active-item-indicator:before,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked .active-item-indicator:before,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:focus .active-item-indicator:before {
	content: "";
	position: absolute;
	z-index: 1;
	bottom: 2px;
	width: 100%;
	height: 0;
	border-top-width: 1px;
	border-top-style: solid;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.clicked:not(.checked):focus .active-item-indicator:before,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.clicked:not(.checked):focus .active-item-indicator:before {
	border-top-color: transparent !important; /* hides border on clicked state */
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:focus .active-item-indicator:before,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:focus .active-item-indicator:before {
	border-top-color: var(--vscode-focusBorder) !important;
	border-top-width: 2px;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked .action-label,
.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:hover .action-label,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked .action-label,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:hover .action-label {
	outline: var(--vscode-contrastActiveBorder, unset) solid 1px !important;
}

.monaco-workbench .pane-composite-part > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:not(.checked):hover .action-label,
.monaco-workbench .pane-composite-part > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:not(.checked):hover .action-label {
	outline: var(--vscode-contrastActiveBorder, unset) dashed 1px !important;
}

/** Empty Pane Message **/

.monaco-workbench .pane-composite-part .empty-pane-message-area {
	display: none;
	height: 100%;
	width: 100%;
}

.monaco-workbench .pane-composite-part.empty .empty-pane-message-area {
	display: flex;
	align-items: center;
	align-content: center;
	justify-content: center;
}

.monaco-workbench .pane-composite-part .empty-pane-message-area .empty-pane-message {
	margin: 12px;
	text-align: center;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/notifications/notificationAccessibleView.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/notifications/notificationAccessibleView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../../../base/common/actions.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { localize } from '../../../../nls.js';
import { IAccessibleViewService, AccessibleViewProviderId, AccessibleViewType, AccessibleContentProvider } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { IAccessibilitySignalService, AccessibilitySignal } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IListService, WorkbenchList } from '../../../../platform/list/browser/listService.js';
import { getNotificationFromContext } from './notificationsCommands.js';
import { NotificationFocusedContext } from '../../../common/contextkeys.js';
import { INotificationViewItem } from '../../../common/notifications.js';
import { withSeverityPrefix } from '../../../../platform/notification/common/notification.js';

export class NotificationAccessibleView implements IAccessibleViewImplementation {
	readonly priority = 90;
	readonly name = 'notifications';
	readonly when = NotificationFocusedContext;
	readonly type = AccessibleViewType.View;
	getProvider(accessor: ServicesAccessor) {
		const accessibleViewService = accessor.get(IAccessibleViewService);
		const listService = accessor.get(IListService);
		const commandService = accessor.get(ICommandService);
		const accessibilitySignalService = accessor.get(IAccessibilitySignalService);

		function getProvider() {
			const notification = getNotificationFromContext(listService);
			if (!notification) {
				return;
			}
			commandService.executeCommand('notifications.showList');
			let notificationIndex: number | undefined;
			const list = listService.lastFocusedList;
			if (list instanceof WorkbenchList) {
				notificationIndex = list.indexOf(notification);
			}
			if (notificationIndex === undefined) {
				return;
			}

			function focusList(): void {
				commandService.executeCommand('notifications.showList');
				if (list && notificationIndex !== undefined) {
					list.domFocus();
					try {
						list.setFocus([notificationIndex]);
					} catch { }
				}
			}

			function getContentForNotification(): string | undefined {
				const notification = getNotificationFromContext(listService);
				const message = notification?.message.original.toString();
				if (!notification || !message) {
					return;
				}
				return withSeverityPrefix(notification.source ? localize('notification.accessibleViewSrc', '{0} Source: {1}', message, notification.source) : message, notification.severity);
			}
			const content = getContentForNotification();
			if (!content) {
				return;
			}
			notification.onDidClose(() => accessibleViewService.next());
			return new AccessibleContentProvider(
				AccessibleViewProviderId.Notification,
				{ type: AccessibleViewType.View },
				() => content,
				() => focusList(),
				'accessibility.verbosity.notification',
				undefined,
				getActionsFromNotification(notification, accessibilitySignalService),
				() => {
					if (!list) {
						return;
					}
					focusList();
					list.focusNext();
					return getContentForNotification();
				},
				() => {
					if (!list) {
						return;
					}
					focusList();
					list.focusPrevious();
					return getContentForNotification();
				},
			);
		}
		return getProvider();
	}
}


function getActionsFromNotification(notification: INotificationViewItem, accessibilitySignalService: IAccessibilitySignalService): IAction[] | undefined {
	let actions = undefined;
	if (notification.actions) {
		actions = [];
		if (notification.actions.primary) {
			actions.push(...notification.actions.primary);
		}
		if (notification.actions.secondary) {
			actions.push(...notification.actions.secondary);
		}
	}
	if (actions) {
		for (const action of actions) {
			action.class = ThemeIcon.asClassName(Codicon.bell);
			const initialAction = action.run;
			action.run = () => {
				initialAction();
				notification.close();
			};
		}
	}
	const manageExtension = actions?.find(a => a.label.includes('Manage Extension'));
	if (manageExtension) {
		manageExtension.class = ThemeIcon.asClassName(Codicon.gear);
	}
	if (actions) {
		actions.push({
			id: 'clearNotification', label: localize('clearNotification', "Clear Notification"), tooltip: localize('clearNotification', "Clear Notification"), run: () => {
				notification.close();
				accessibilitySignalService.playSignal(AccessibilitySignal.clear);
			}, enabled: true, class: ThemeIcon.asClassName(Codicon.clearAll)
		});
	}
	return actions;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/notifications/notificationsActions.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/notifications/notificationsActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/notificationsActions.css';
import { INotificationViewItem } from '../../../common/notifications.js';
import { localize } from '../../../../nls.js';
import { Action } from '../../../../base/common/actions.js';
import { CLEAR_NOTIFICATION, EXPAND_NOTIFICATION, COLLAPSE_NOTIFICATION, CLEAR_ALL_NOTIFICATIONS, HIDE_NOTIFICATIONS_CENTER, TOGGLE_DO_NOT_DISTURB_MODE, TOGGLE_DO_NOT_DISTURB_MODE_BY_SOURCE } from './notificationsCommands.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

const clearIcon = registerIcon('notifications-clear', Codicon.close, localize('clearIcon', 'Icon for the clear action in notifications.'));
const clearAllIcon = registerIcon('notifications-clear-all', Codicon.clearAll, localize('clearAllIcon', 'Icon for the clear all action in notifications.'));
const hideIcon = registerIcon('notifications-hide', Codicon.chevronDown, localize('hideIcon', 'Icon for the hide action in notifications.'));
const expandIcon = registerIcon('notifications-expand', Codicon.chevronUp, localize('expandIcon', 'Icon for the expand action in notifications.'));
const collapseIcon = registerIcon('notifications-collapse', Codicon.chevronDown, localize('collapseIcon', 'Icon for the collapse action in notifications.'));
const configureIcon = registerIcon('notifications-configure', Codicon.gear, localize('configureIcon', 'Icon for the configure action in notifications.'));
const doNotDisturbIcon = registerIcon('notifications-do-not-disturb', Codicon.bellSlash, localize('doNotDisturbIcon', 'Icon for the mute all action in notifications.'));

export class ClearNotificationAction extends Action {

	static readonly ID = CLEAR_NOTIFICATION;
	static readonly LABEL = localize('clearNotification', "Clear Notification");

	constructor(
		id: string,
		label: string,
		@ICommandService private readonly commandService: ICommandService
	) {
		super(id, label, ThemeIcon.asClassName(clearIcon));
	}

	override async run(notification: INotificationViewItem): Promise<void> {
		this.commandService.executeCommand(CLEAR_NOTIFICATION, notification);
	}
}

export class ClearAllNotificationsAction extends Action {

	static readonly ID = CLEAR_ALL_NOTIFICATIONS;
	static readonly LABEL = localize('clearNotifications', "Clear All Notifications");

	constructor(
		id: string,
		label: string,
		@ICommandService private readonly commandService: ICommandService
	) {
		super(id, label, ThemeIcon.asClassName(clearAllIcon));
	}

	override async run(): Promise<void> {
		this.commandService.executeCommand(CLEAR_ALL_NOTIFICATIONS);
	}
}

export class ToggleDoNotDisturbAction extends Action {

	static readonly ID = TOGGLE_DO_NOT_DISTURB_MODE;
	static readonly LABEL = localize('toggleDoNotDisturbMode', "Toggle Do Not Disturb Mode");

	constructor(
		id: string,
		label: string,
		@ICommandService private readonly commandService: ICommandService
	) {
		super(id, label, ThemeIcon.asClassName(doNotDisturbIcon));
	}

	override async run(): Promise<void> {
		this.commandService.executeCommand(TOGGLE_DO_NOT_DISTURB_MODE);
	}
}

export class ToggleDoNotDisturbBySourceAction extends Action {

	static readonly ID = TOGGLE_DO_NOT_DISTURB_MODE_BY_SOURCE;
	static readonly LABEL = localize('toggleDoNotDisturbModeBySource', "Toggle Do Not Disturb Mode By Source...");

	constructor(
		id: string,
		label: string,
		@ICommandService private readonly commandService: ICommandService
	) {
		super(id, label);
	}

	override async run(): Promise<void> {
		this.commandService.executeCommand(TOGGLE_DO_NOT_DISTURB_MODE_BY_SOURCE);
	}
}

export class ConfigureDoNotDisturbAction extends Action {

	static readonly ID = 'workbench.action.configureDoNotDisturbMode';
	static readonly LABEL = localize('configureDoNotDisturbMode', "Configure Do Not Disturb...");

	constructor(
		id: string,
		label: string
	) {
		super(id, label, ThemeIcon.asClassName(doNotDisturbIcon));
	}
}

export class HideNotificationsCenterAction extends Action {

	static readonly ID = HIDE_NOTIFICATIONS_CENTER;
	static readonly LABEL = localize('hideNotificationsCenter', "Hide Notifications");

	constructor(
		id: string,
		label: string,
		@ICommandService private readonly commandService: ICommandService
	) {
		super(id, label, ThemeIcon.asClassName(hideIcon));
	}

	override async run(): Promise<void> {
		this.commandService.executeCommand(HIDE_NOTIFICATIONS_CENTER);
	}
}

export class ExpandNotificationAction extends Action {

	static readonly ID = EXPAND_NOTIFICATION;
	static readonly LABEL = localize('expandNotification', "Expand Notification");

	constructor(
		id: string,
		label: string,
		@ICommandService private readonly commandService: ICommandService
	) {
		super(id, label, ThemeIcon.asClassName(expandIcon));
	}

	override async run(notification: INotificationViewItem): Promise<void> {
		this.commandService.executeCommand(EXPAND_NOTIFICATION, notification);
	}
}

export class CollapseNotificationAction extends Action {

	static readonly ID = COLLAPSE_NOTIFICATION;
	static readonly LABEL = localize('collapseNotification', "Collapse Notification");

	constructor(
		id: string,
		label: string,
		@ICommandService private readonly commandService: ICommandService
	) {
		super(id, label, ThemeIcon.asClassName(collapseIcon));
	}

	override async run(notification: INotificationViewItem): Promise<void> {
		this.commandService.executeCommand(COLLAPSE_NOTIFICATION, notification);
	}
}

export class ConfigureNotificationAction extends Action {

	static readonly ID = 'workbench.action.configureNotification';
	static readonly LABEL = localize('configureNotification', "More Actions...");

	constructor(
		id: string,
		label: string,
		readonly notification: INotificationViewItem
	) {
		super(id, label, ThemeIcon.asClassName(configureIcon));
	}
}

export class CopyNotificationMessageAction extends Action {

	static readonly ID = 'workbench.action.copyNotificationMessage';
	static readonly LABEL = localize('copyNotification', "Copy Text");

	constructor(
		id: string,
		label: string,
		@IClipboardService private readonly clipboardService: IClipboardService
	) {
		super(id, label);
	}

	override run(notification: INotificationViewItem): Promise<void> {
		return this.clipboardService.writeText(notification.message.raw);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/notifications/notificationsAlerts.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/notifications/notificationsAlerts.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { localize } from '../../../../nls.js';
import { INotificationViewItem, INotificationsModel, NotificationChangeType, INotificationChangeEvent, NotificationViewItemContentChangeKind } from '../../../common/notifications.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { NotificationPriority, Severity } from '../../../../platform/notification/common/notification.js';
import { Event } from '../../../../base/common/event.js';

export class NotificationsAlerts extends Disposable {

	constructor(private readonly model: INotificationsModel) {
		super();

		// Alert initial notifications if any
		for (const notification of model.notifications) {
			this.triggerAriaAlert(notification);
		}

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.model.onDidChangeNotification(e => this.onDidChangeNotification(e)));
	}

	private onDidChangeNotification(e: INotificationChangeEvent): void {
		if (e.kind === NotificationChangeType.ADD) {

			// ARIA alert for screen readers
			this.triggerAriaAlert(e.item);

			// Always log errors to console with full details
			if (e.item.severity === Severity.Error) {
				if (e.item.message.original instanceof Error) {
					console.error(e.item.message.original);
				} else {
					console.error(toErrorMessage(e.item.message.linkedText.toString(), true));
				}
			}
		}
	}

	private triggerAriaAlert(notification: INotificationViewItem): void {
		if (notification.priority === NotificationPriority.SILENT) {
			return;
		}

		// Trigger the alert again whenever the message changes
		const listener = notification.onDidChangeContent(e => {
			if (e.kind === NotificationViewItemContentChangeKind.MESSAGE) {
				this.doTriggerAriaAlert(notification);
			}
		});

		Event.once(notification.onDidClose)(() => listener.dispose());

		this.doTriggerAriaAlert(notification);
	}

	private doTriggerAriaAlert(notification: INotificationViewItem): void {
		let alertText: string;
		if (notification.severity === Severity.Error) {
			alertText = localize('alertErrorMessage', "Error: {0}", notification.message.linkedText.toString());
		} else if (notification.severity === Severity.Warning) {
			alertText = localize('alertWarningMessage', "Warning: {0}", notification.message.linkedText.toString());
		} else {
			alertText = localize('alertInfoMessage', "Info: {0}", notification.message.linkedText.toString());
		}

		alert(alertText);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/notifications/notificationsCenter.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/notifications/notificationsCenter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/notificationsCenter.css';
import './media/notificationsActions.css';
import { NOTIFICATIONS_CENTER_HEADER_FOREGROUND, NOTIFICATIONS_CENTER_HEADER_BACKGROUND, NOTIFICATIONS_CENTER_BORDER } from '../../../common/theme.js';
import { IThemeService, Themable } from '../../../../platform/theme/common/themeService.js';
import { INotificationsModel, INotificationChangeEvent, NotificationChangeType, NotificationViewItemContentChangeKind } from '../../../common/notifications.js';
import { IWorkbenchLayoutService, Parts } from '../../../services/layout/browser/layoutService.js';
import { Emitter } from '../../../../base/common/event.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { INotificationsCenterController, NotificationActionRunner } from './notificationsCommands.js';
import { NotificationsList } from './notificationsList.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { $, Dimension, isAncestorOfActiveElement } from '../../../../base/browser/dom.js';
import { widgetShadow } from '../../../../platform/theme/common/colorRegistry.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { localize } from '../../../../nls.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { ClearAllNotificationsAction, ConfigureDoNotDisturbAction, ToggleDoNotDisturbBySourceAction, HideNotificationsCenterAction, ToggleDoNotDisturbAction } from './notificationsActions.js';
import { IAction, Separator, toAction } from '../../../../base/common/actions.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { assertReturnsAllDefined, assertReturnsDefined } from '../../../../base/common/types.js';
import { NotificationsCenterVisibleContext } from '../../../common/contextkeys.js';
import { INotificationService, NotificationsFilter } from '../../../../platform/notification/common/notification.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { DropdownMenuActionViewItem } from '../../../../base/browser/ui/dropdown/dropdownActionViewItem.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';

export class NotificationsCenter extends Themable implements INotificationsCenterController {

	private static readonly MAX_DIMENSIONS = new Dimension(450, 400);

	private static readonly MAX_NOTIFICATION_SOURCES = 10; // maximum number of notification sources to show in configure dropdown

	private readonly _onDidChangeVisibility = this._register(new Emitter<void>());
	readonly onDidChangeVisibility = this._onDidChangeVisibility.event;

	private notificationsCenterContainer: HTMLElement | undefined;
	private notificationsCenterHeader: HTMLElement | undefined;
	private notificationsCenterTitle: HTMLSpanElement | undefined;
	private notificationsList: NotificationsList | undefined;
	private _isVisible: boolean | undefined;
	private workbenchDimensions: Dimension | undefined;
	private readonly notificationsCenterVisibleContextKey;
	private clearAllAction: ClearAllNotificationsAction | undefined;
	private configureDoNotDisturbAction: ConfigureDoNotDisturbAction | undefined;

	constructor(
		private readonly container: HTMLElement,
		private readonly model: INotificationsModel,
		@IThemeService themeService: IThemeService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@INotificationService private readonly notificationService: INotificationService,
		@IAccessibilitySignalService private readonly accessibilitySignalService: IAccessibilitySignalService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService
	) {
		super(themeService);

		this.notificationsCenterVisibleContextKey = NotificationsCenterVisibleContext.bindTo(contextKeyService);

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.model.onDidChangeNotification(e => this.onDidChangeNotification(e)));
		this._register(this.layoutService.onDidLayoutMainContainer(dimension => this.layout(Dimension.lift(dimension))));
		this._register(this.notificationService.onDidChangeFilter(() => this.onDidChangeFilter()));
	}

	private onDidChangeFilter(): void {
		if (this.notificationService.getFilter() === NotificationsFilter.ERROR) {
			this.hide(); // hide the notification center when we have a error filter enabled
		}
	}

	get isVisible(): boolean {
		return !!this._isVisible;
	}

	show(): void {
		if (this._isVisible) {
			const notificationsList = assertReturnsDefined(this.notificationsList);

			// Make visible
			notificationsList.show();

			// Focus first
			notificationsList.focusFirst();

			return; // already visible
		}

		// Lazily create if showing for the first time
		if (!this.notificationsCenterContainer) {
			this.create();
		}

		// Title
		this.updateTitle();

		// Make visible
		const [notificationsList, notificationsCenterContainer] = assertReturnsAllDefined(this.notificationsList, this.notificationsCenterContainer);
		this._isVisible = true;
		notificationsCenterContainer.classList.add('visible');
		notificationsList.show();

		// Layout
		this.layout(this.workbenchDimensions);

		// Show all notifications that are present now
		notificationsList.updateNotificationsList(0, 0, this.model.notifications);

		// Focus first
		notificationsList.focusFirst();

		// Theming
		this.updateStyles();

		// Mark as visible
		this.model.notifications.forEach(notification => notification.updateVisibility(true));

		// Context Key
		this.notificationsCenterVisibleContextKey.set(true);

		// Event
		this._onDidChangeVisibility.fire();
	}

	private updateTitle(): void {
		const [notificationsCenterTitle, clearAllAction] = assertReturnsAllDefined(this.notificationsCenterTitle, this.clearAllAction);

		if (this.model.notifications.length === 0) {
			notificationsCenterTitle.textContent = localize('notificationsEmpty', "No new notifications");
			clearAllAction.enabled = false;
		} else {
			notificationsCenterTitle.textContent = localize('notifications', "Notifications");
			clearAllAction.enabled = this.model.notifications.some(notification => !notification.hasProgress);
		}
	}

	private create(): void {

		// Container
		this.notificationsCenterContainer = $('.notifications-center');

		// Header
		this.notificationsCenterHeader = $('.notifications-center-header');
		this.notificationsCenterContainer.appendChild(this.notificationsCenterHeader);

		// Header Title
		this.notificationsCenterTitle = $('span.notifications-center-header-title');
		this.notificationsCenterHeader.appendChild(this.notificationsCenterTitle);

		// Header Toolbar
		const toolbarContainer = $('.notifications-center-header-toolbar');
		this.notificationsCenterHeader.appendChild(toolbarContainer);

		const actionRunner = this._register(this.instantiationService.createInstance(NotificationActionRunner));

		const that = this;
		const notificationsToolBar = this._register(new ActionBar(toolbarContainer, {
			ariaLabel: localize('notificationsToolbar', "Notification Center Actions"),
			actionRunner,
			actionViewItemProvider: (action, options) => {
				if (action.id === ConfigureDoNotDisturbAction.ID) {
					return this._register(this.instantiationService.createInstance(DropdownMenuActionViewItem, action, {
						getActions() {
							const actions = [toAction({
								id: ToggleDoNotDisturbAction.ID,
								label: that.notificationService.getFilter() === NotificationsFilter.OFF ? localize('turnOnNotifications', "Enable Do Not Disturb Mode") : localize('turnOffNotifications', "Disable Do Not Disturb Mode"),
								run: () => that.notificationService.setFilter(that.notificationService.getFilter() === NotificationsFilter.OFF ? NotificationsFilter.ERROR : NotificationsFilter.OFF)
							})];

							const sortedFilters = that.notificationService.getFilters().sort((a, b) => a.label.localeCompare(b.label));
							for (const source of sortedFilters.slice(0, NotificationsCenter.MAX_NOTIFICATION_SOURCES)) {
								if (actions.length === 1) {
									actions.push(new Separator());
								}

								actions.push(toAction({
									id: `${ToggleDoNotDisturbAction.ID}.${source.id}`,
									label: source.label,
									checked: source.filter !== NotificationsFilter.ERROR,
									run: () => that.notificationService.setFilter({
										...source,
										filter: source.filter === NotificationsFilter.ERROR ? NotificationsFilter.OFF : NotificationsFilter.ERROR
									})
								}));
							}

							if (sortedFilters.length > NotificationsCenter.MAX_NOTIFICATION_SOURCES) {
								actions.push(new Separator());
								actions.push(that._register(that.instantiationService.createInstance(ToggleDoNotDisturbBySourceAction, ToggleDoNotDisturbBySourceAction.ID, localize('moreSources', "More…"))));
							}

							return actions;
						},
					}, this.contextMenuService, {
						...options,
						actionRunner,
						classNames: action.class,
						keybindingProvider: action => this.keybindingService.lookupKeybinding(action.id)
					}));
				}

				return undefined;
			}
		}));

		this.clearAllAction = this._register(this.instantiationService.createInstance(ClearAllNotificationsAction, ClearAllNotificationsAction.ID, ClearAllNotificationsAction.LABEL));
		notificationsToolBar.push(this.clearAllAction, { icon: true, label: false, keybinding: this.getKeybindingLabel(this.clearAllAction) });

		this.configureDoNotDisturbAction = this._register(this.instantiationService.createInstance(ConfigureDoNotDisturbAction, ConfigureDoNotDisturbAction.ID, ConfigureDoNotDisturbAction.LABEL));
		notificationsToolBar.push(this.configureDoNotDisturbAction, { icon: true, label: false });

		const hideAllAction = this._register(this.instantiationService.createInstance(HideNotificationsCenterAction, HideNotificationsCenterAction.ID, HideNotificationsCenterAction.LABEL));
		notificationsToolBar.push(hideAllAction, { icon: true, label: false, keybinding: this.getKeybindingLabel(hideAllAction) });

		// Notifications List
		this.notificationsList = this.instantiationService.createInstance(NotificationsList, this.notificationsCenterContainer, {
			widgetAriaLabel: localize('notificationsCenterWidgetAriaLabel', "Notifications Center")
		});
		this.container.appendChild(this.notificationsCenterContainer);
	}

	private getKeybindingLabel(action: IAction): string | null {
		const keybinding = this.keybindingService.lookupKeybinding(action.id);

		return keybinding ? keybinding.getLabel() : null;
	}

	private onDidChangeNotification(e: INotificationChangeEvent): void {
		if (!this._isVisible) {
			return; // only if visible
		}

		let focusEditor = false;

		// Update notifications list based on event kind
		const [notificationsList, notificationsCenterContainer] = assertReturnsAllDefined(this.notificationsList, this.notificationsCenterContainer);
		switch (e.kind) {
			case NotificationChangeType.ADD:
				notificationsList.updateNotificationsList(e.index, 0, [e.item]);
				e.item.updateVisibility(true);
				break;
			case NotificationChangeType.CHANGE:
				// Handle content changes
				// - actions: re-draw to properly show them
				// - message: update notification height unless collapsed
				switch (e.detail) {
					case NotificationViewItemContentChangeKind.ACTIONS:
						notificationsList.updateNotificationsList(e.index, 1, [e.item]);
						break;
					case NotificationViewItemContentChangeKind.MESSAGE:
						if (e.item.expanded) {
							notificationsList.updateNotificationHeight(e.item);
						}
						break;
				}
				break;
			case NotificationChangeType.EXPAND_COLLAPSE:
				// Re-draw entire item when expansion changes to reveal or hide details
				notificationsList.updateNotificationsList(e.index, 1, [e.item]);
				break;
			case NotificationChangeType.REMOVE:
				focusEditor = isAncestorOfActiveElement(notificationsCenterContainer);
				notificationsList.updateNotificationsList(e.index, 1);
				e.item.updateVisibility(false);
				break;
		}

		// Update title
		this.updateTitle();

		// Hide if no more notifications to show
		if (this.model.notifications.length === 0) {
			this.hide();

			// Restore focus to editor group if we had focus
			if (focusEditor) {
				this.editorGroupService.activeGroup.focus();
			}
		}
	}

	hide(): void {
		if (!this._isVisible || !this.notificationsCenterContainer || !this.notificationsList) {
			return; // already hidden
		}

		const focusEditor = isAncestorOfActiveElement(this.notificationsCenterContainer);

		// Hide
		this._isVisible = false;
		this.notificationsCenterContainer.classList.remove('visible');
		this.notificationsList.hide();

		// Mark as hidden
		this.model.notifications.forEach(notification => notification.updateVisibility(false));

		// Context Key
		this.notificationsCenterVisibleContextKey.set(false);

		// Event
		this._onDidChangeVisibility.fire();

		// Restore focus to editor group if we had focus
		if (focusEditor) {
			this.editorGroupService.activeGroup.focus();
		}
	}

	override updateStyles(): void {
		if (this.notificationsCenterContainer && this.notificationsCenterHeader) {
			const widgetShadowColor = this.getColor(widgetShadow);
			this.notificationsCenterContainer.style.boxShadow = widgetShadowColor ? `0 0 8px 2px ${widgetShadowColor}` : '';

			const borderColor = this.getColor(NOTIFICATIONS_CENTER_BORDER);
			this.notificationsCenterContainer.style.border = borderColor ? `1px solid ${borderColor}` : '';

			const headerForeground = this.getColor(NOTIFICATIONS_CENTER_HEADER_FOREGROUND);
			this.notificationsCenterHeader.style.color = headerForeground ?? '';

			const headerBackground = this.getColor(NOTIFICATIONS_CENTER_HEADER_BACKGROUND);
			this.notificationsCenterHeader.style.background = headerBackground ?? '';

		}
	}

	layout(dimension: Dimension | undefined): void {
		this.workbenchDimensions = dimension;

		if (this._isVisible && this.notificationsCenterContainer) {
			const maxWidth = NotificationsCenter.MAX_DIMENSIONS.width;
			const maxHeight = NotificationsCenter.MAX_DIMENSIONS.height;

			let availableWidth = maxWidth;
			let availableHeight = maxHeight;

			if (this.workbenchDimensions) {

				// Make sure notifications are not exceding available width
				availableWidth = this.workbenchDimensions.width;
				availableWidth -= (2 * 8); // adjust for paddings left and right

				// Make sure notifications are not exceeding available height
				availableHeight = this.workbenchDimensions.height - 35 /* header */;
				if (this.layoutService.isVisible(Parts.STATUSBAR_PART, mainWindow)) {
					availableHeight -= 22; // adjust for status bar
				}

				if (this.layoutService.isVisible(Parts.TITLEBAR_PART, mainWindow)) {
					availableHeight -= 22; // adjust for title bar
				}

				availableHeight -= (2 * 12); // adjust for paddings top and bottom
			}

			// Apply to list
			const notificationsList = assertReturnsDefined(this.notificationsList);
			notificationsList.layout(Math.min(maxWidth, availableWidth), Math.min(maxHeight, availableHeight));
		}
	}

	clearAll(): void {

		// Hide notifications center first
		this.hide();

		// Close all
		for (const notification of [...this.model.notifications] /* copy array since we modify it from closing */) {
			if (!notification.hasProgress) {
				notification.close();
			}
			this.accessibilitySignalService.playSignal(AccessibilitySignal.clear);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/notifications/notificationsCommands.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/notifications/notificationsCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { INotificationViewItem, isNotificationViewItem, NotificationsModel } from '../../../common/notifications.js';
import { MenuRegistry, MenuId } from '../../../../platform/actions/common/actions.js';
import { localize, localize2 } from '../../../../nls.js';
import { IListService, WorkbenchList } from '../../../../platform/list/browser/listService.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { NotificationFocusedContext, NotificationsCenterVisibleContext, NotificationsToastsVisibleContext } from '../../../common/contextkeys.js';
import { INotificationService, INotificationSourceFilter, NotificationsFilter } from '../../../../platform/notification/common/notification.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ActionRunner, IAction, WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification } from '../../../../base/common/actions.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';

// Center
export const SHOW_NOTIFICATIONS_CENTER = 'notifications.showList';
export const HIDE_NOTIFICATIONS_CENTER = 'notifications.hideList';
const TOGGLE_NOTIFICATIONS_CENTER = 'notifications.toggleList';

// Toasts
export const HIDE_NOTIFICATION_TOAST = 'notifications.hideToasts';
const FOCUS_NOTIFICATION_TOAST = 'notifications.focusToasts';
const FOCUS_NEXT_NOTIFICATION_TOAST = 'notifications.focusNextToast';
const FOCUS_PREVIOUS_NOTIFICATION_TOAST = 'notifications.focusPreviousToast';
const FOCUS_FIRST_NOTIFICATION_TOAST = 'notifications.focusFirstToast';
const FOCUS_LAST_NOTIFICATION_TOAST = 'notifications.focusLastToast';

// Notification
export const COLLAPSE_NOTIFICATION = 'notification.collapse';
export const EXPAND_NOTIFICATION = 'notification.expand';
export const ACCEPT_PRIMARY_ACTION_NOTIFICATION = 'notification.acceptPrimaryAction';
const TOGGLE_NOTIFICATION = 'notification.toggle';
export const CLEAR_NOTIFICATION = 'notification.clear';
export const CLEAR_ALL_NOTIFICATIONS = 'notifications.clearAll';
export const TOGGLE_DO_NOT_DISTURB_MODE = 'notifications.toggleDoNotDisturbMode';
export const TOGGLE_DO_NOT_DISTURB_MODE_BY_SOURCE = 'notifications.toggleDoNotDisturbModeBySource';

export interface INotificationsCenterController {
	readonly isVisible: boolean;

	show(): void;
	hide(): void;

	clearAll(): void;
}

export interface INotificationsToastController {
	focus(): void;
	focusNext(): void;
	focusPrevious(): void;
	focusFirst(): void;
	focusLast(): void;

	hide(): void;
}

export function getNotificationFromContext(listService: IListService, context?: unknown): INotificationViewItem | undefined {
	if (isNotificationViewItem(context)) {
		return context;
	}

	const list = listService.lastFocusedList;
	if (list instanceof WorkbenchList) {
		let element = list.getFocusedElements()[0];
		if (!isNotificationViewItem(element)) {
			if (list.isDOMFocused()) {
				// the notification list might have received focus
				// via keyboard and might not have a focused element.
				// in that case just return the first element
				// https://github.com/microsoft/vscode/issues/191705
				element = list.element(0);
			}
		}

		if (isNotificationViewItem(element)) {
			return element;
		}
	}

	return undefined;
}

export function registerNotificationCommands(center: INotificationsCenterController, toasts: INotificationsToastController, model: NotificationsModel): void {

	// Show Notifications Cneter
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: SHOW_NOTIFICATIONS_CENTER,
		weight: KeybindingWeight.WorkbenchContrib,
		primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyN),
		handler: () => {
			toasts.hide();
			center.show();
		}
	});

	// Hide Notifications Center
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: HIDE_NOTIFICATIONS_CENTER,
		weight: KeybindingWeight.WorkbenchContrib + 50,
		when: NotificationsCenterVisibleContext,
		primary: KeyCode.Escape,
		handler: () => center.hide()
	});

	// Toggle Notifications Center
	CommandsRegistry.registerCommand(TOGGLE_NOTIFICATIONS_CENTER, () => {
		if (center.isVisible) {
			center.hide();
		} else {
			toasts.hide();
			center.show();
		}
	});

	// Clear Notification
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: CLEAR_NOTIFICATION,
		weight: KeybindingWeight.WorkbenchContrib,
		when: NotificationFocusedContext,
		primary: KeyCode.Delete,
		mac: {
			primary: KeyMod.CtrlCmd | KeyCode.Backspace
		},
		handler: (accessor, args?) => {
			const accessibilitySignalService = accessor.get(IAccessibilitySignalService);
			const notification = getNotificationFromContext(accessor.get(IListService), args);
			if (notification && !notification.hasProgress) {
				notification.close();
				accessibilitySignalService.playSignal(AccessibilitySignal.clear);
			}
		}
	});

	// Expand Notification
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: EXPAND_NOTIFICATION,
		weight: KeybindingWeight.WorkbenchContrib,
		when: NotificationFocusedContext,
		primary: KeyCode.RightArrow,
		handler: (accessor, args?) => {
			const notification = getNotificationFromContext(accessor.get(IListService), args);
			notification?.expand();
		}
	});

	// Accept Primary Action
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: ACCEPT_PRIMARY_ACTION_NOTIFICATION,
		weight: KeybindingWeight.WorkbenchContrib + 1,
		when: ContextKeyExpr.or(NotificationFocusedContext, NotificationsToastsVisibleContext),
		primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyA,
		handler: (accessor) => {
			const actionRunner = accessor.get(IInstantiationService).createInstance(NotificationActionRunner);
			const notification = getNotificationFromContext(accessor.get(IListService)) || model.notifications.at(0);
			if (!notification) {
				return;
			}
			const primaryAction = notification.actions?.primary ? notification.actions.primary.at(0) : undefined;
			if (!primaryAction) {
				return;
			}
			actionRunner.run(primaryAction, notification);
			notification.close();
			actionRunner.dispose();
		}
	});

	// Collapse Notification
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: COLLAPSE_NOTIFICATION,
		weight: KeybindingWeight.WorkbenchContrib,
		when: NotificationFocusedContext,
		primary: KeyCode.LeftArrow,
		handler: (accessor, args?) => {
			const notification = getNotificationFromContext(accessor.get(IListService), args);
			notification?.collapse();
		}
	});

	// Toggle Notification
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: TOGGLE_NOTIFICATION,
		weight: KeybindingWeight.WorkbenchContrib,
		when: NotificationFocusedContext,
		primary: KeyCode.Space,
		secondary: [KeyCode.Enter],
		handler: accessor => {
			const notification = getNotificationFromContext(accessor.get(IListService));
			notification?.toggle();
		}
	});

	// Hide Toasts
	CommandsRegistry.registerCommand(HIDE_NOTIFICATION_TOAST, accessor => {
		toasts.hide();
	});

	KeybindingsRegistry.registerKeybindingRule({
		id: HIDE_NOTIFICATION_TOAST,
		weight: KeybindingWeight.WorkbenchContrib - 50, // lower when not focused (e.g. let editor suggest win over this command)
		when: NotificationsToastsVisibleContext,
		primary: KeyCode.Escape
	});

	KeybindingsRegistry.registerKeybindingRule({
		id: HIDE_NOTIFICATION_TOAST,
		weight: KeybindingWeight.WorkbenchContrib + 100, // higher when focused
		when: ContextKeyExpr.and(NotificationsToastsVisibleContext, NotificationFocusedContext),
		primary: KeyCode.Escape
	});

	// Focus Toasts
	CommandsRegistry.registerCommand(FOCUS_NOTIFICATION_TOAST, () => toasts.focus());

	// Focus Next Toast
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: FOCUS_NEXT_NOTIFICATION_TOAST,
		weight: KeybindingWeight.WorkbenchContrib,
		when: ContextKeyExpr.and(NotificationFocusedContext, NotificationsToastsVisibleContext),
		primary: KeyCode.DownArrow,
		handler: () => {
			toasts.focusNext();
		}
	});

	// Focus Previous Toast
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: FOCUS_PREVIOUS_NOTIFICATION_TOAST,
		weight: KeybindingWeight.WorkbenchContrib,
		when: ContextKeyExpr.and(NotificationFocusedContext, NotificationsToastsVisibleContext),
		primary: KeyCode.UpArrow,
		handler: () => {
			toasts.focusPrevious();
		}
	});

	// Focus First Toast
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: FOCUS_FIRST_NOTIFICATION_TOAST,
		weight: KeybindingWeight.WorkbenchContrib,
		when: ContextKeyExpr.and(NotificationFocusedContext, NotificationsToastsVisibleContext),
		primary: KeyCode.PageUp,
		secondary: [KeyCode.Home],
		handler: () => {
			toasts.focusFirst();
		}
	});

	// Focus Last Toast
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: FOCUS_LAST_NOTIFICATION_TOAST,
		weight: KeybindingWeight.WorkbenchContrib,
		when: ContextKeyExpr.and(NotificationFocusedContext, NotificationsToastsVisibleContext),
		primary: KeyCode.PageDown,
		secondary: [KeyCode.End],
		handler: () => {
			toasts.focusLast();
		}
	});

	// Clear All Notifications
	CommandsRegistry.registerCommand(CLEAR_ALL_NOTIFICATIONS, () => center.clearAll());

	// Toggle Do Not Disturb Mode
	CommandsRegistry.registerCommand(TOGGLE_DO_NOT_DISTURB_MODE, accessor => {
		const notificationService = accessor.get(INotificationService);

		notificationService.setFilter(notificationService.getFilter() === NotificationsFilter.ERROR ? NotificationsFilter.OFF : NotificationsFilter.ERROR);
	});

	// Configure Do Not Disturb by Source
	CommandsRegistry.registerCommand(TOGGLE_DO_NOT_DISTURB_MODE_BY_SOURCE, accessor => {
		const notificationService = accessor.get(INotificationService);
		const quickInputService = accessor.get(IQuickInputService);

		const sortedFilters = notificationService.getFilters().sort((a, b) => a.label.localeCompare(b.label));

		const disposables = new DisposableStore();
		const picker = disposables.add(quickInputService.createQuickPick<IQuickPickItem & INotificationSourceFilter>());

		picker.items = sortedFilters.map(source => ({
			id: source.id,
			label: source.label,
			tooltip: `${source.label} (${source.id})`,
			filter: source.filter
		}));

		picker.canSelectMany = true;
		picker.placeholder = localize('selectSources', "Select sources to enable all notifications from");
		picker.selectedItems = picker.items.filter(item => item.filter === NotificationsFilter.OFF);

		picker.show();

		disposables.add(picker.onDidAccept(async () => {
			for (const item of picker.items) {
				notificationService.setFilter({
					id: item.id,
					label: item.label,
					filter: picker.selectedItems.includes(item) ? NotificationsFilter.OFF : NotificationsFilter.ERROR
				});
			}

			picker.hide();
		}));

		disposables.add(picker.onDidHide(() => disposables.dispose()));
	});

	// Commands for Command Palette
	const category = localize2('notifications', 'Notifications');
	MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: SHOW_NOTIFICATIONS_CENTER, title: localize2('showNotifications', 'Show Notifications'), category } });
	MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: HIDE_NOTIFICATIONS_CENTER, title: localize2('hideNotifications', 'Hide Notifications'), category }, when: NotificationsCenterVisibleContext });
	MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: CLEAR_ALL_NOTIFICATIONS, title: localize2('clearAllNotifications', 'Clear All Notifications'), category } });
	MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: ACCEPT_PRIMARY_ACTION_NOTIFICATION, title: localize2('acceptNotificationPrimaryAction', 'Accept Notification Primary Action'), category } });
	MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: TOGGLE_DO_NOT_DISTURB_MODE, title: localize2('toggleDoNotDisturbMode', 'Toggle Do Not Disturb Mode'), category } });
	MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: TOGGLE_DO_NOT_DISTURB_MODE_BY_SOURCE, title: localize2('toggleDoNotDisturbModeBySource', 'Toggle Do Not Disturb Mode By Source...'), category } });
	MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command: { id: FOCUS_NOTIFICATION_TOAST, title: localize2('focusNotificationToasts', 'Focus Notification Toast'), category }, when: NotificationsToastsVisibleContext });
}


export class NotificationActionRunner extends ActionRunner {

	constructor(
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@INotificationService private readonly notificationService: INotificationService
	) {
		super();
	}

	protected override async runAction(action: IAction, context: unknown): Promise<void> {
		this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: action.id, from: 'message' });

		// Run and make sure to notify on any error again
		try {
			await super.runAction(action, context);
		} catch (error) {
			this.notificationService.error(error);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/notifications/notificationsList.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/notifications/notificationsList.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/notificationsList.css';
import { localize } from '../../../../nls.js';
import { $, getWindow, isAncestorOfActiveElement, trackFocus } from '../../../../base/browser/dom.js';
import { WorkbenchList } from '../../../../platform/list/browser/listService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IListAccessibilityProvider, IListOptions } from '../../../../base/browser/ui/list/listWidget.js';
import { NOTIFICATIONS_BACKGROUND } from '../../../common/theme.js';
import { INotificationViewItem } from '../../../common/notifications.js';
import { NotificationsListDelegate, NotificationRenderer } from './notificationsViewer.js';
import { CopyNotificationMessageAction } from './notificationsActions.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { assertReturnsAllDefined } from '../../../../base/common/types.js';
import { NotificationFocusedContext } from '../../../common/contextkeys.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { AriaRole } from '../../../../base/browser/ui/aria/aria.js';
import { NotificationActionRunner } from './notificationsCommands.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { withSeverityPrefix } from '../../../../platform/notification/common/notification.js';

export interface INotificationsListOptions extends IListOptions<INotificationViewItem> {
	readonly widgetAriaLabel?: string;
}

export class NotificationsList extends Disposable {

	private listContainer: HTMLElement | undefined;
	private list: WorkbenchList<INotificationViewItem> | undefined;
	private listDelegate: NotificationsListDelegate | undefined;
	private viewModel: INotificationViewItem[] = [];
	private isVisible: boolean | undefined;

	constructor(
		private readonly container: HTMLElement,
		private readonly options: INotificationsListOptions,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService
	) {
		super();
	}

	show(): void {
		if (this.isVisible) {
			return; // already visible
		}

		// Lazily create if showing for the first time
		if (!this.list) {
			this.createNotificationsList();
		}

		// Make visible
		this.isVisible = true;
	}

	private createNotificationsList(): void {

		// List Container
		this.listContainer = $('.notifications-list-container');

		const actionRunner = this._register(this.instantiationService.createInstance(NotificationActionRunner));

		// Notification Renderer
		const renderer = this.instantiationService.createInstance(NotificationRenderer, actionRunner);

		// List
		const listDelegate = this.listDelegate = new NotificationsListDelegate(this.listContainer);
		const options = this.options;
		const list = this.list = this._register(this.instantiationService.createInstance(
			WorkbenchList<INotificationViewItem>,
			'NotificationsList',
			this.listContainer,
			listDelegate,
			[renderer],
			{
				...options,
				setRowLineHeight: false,
				horizontalScrolling: false,
				overrideStyles: {
					listBackground: NOTIFICATIONS_BACKGROUND
				},
				accessibilityProvider: this.instantiationService.createInstance(NotificationAccessibilityProvider, options)
			}
		));

		// Context menu to copy message
		const copyAction = this._register(this.instantiationService.createInstance(CopyNotificationMessageAction, CopyNotificationMessageAction.ID, CopyNotificationMessageAction.LABEL));
		this._register((list.onContextMenu(e => {
			if (!e.element) {
				return;
			}

			this.contextMenuService.showContextMenu({
				getAnchor: () => e.anchor,
				getActions: () => [copyAction],
				getActionsContext: () => e.element,
				actionRunner
			});
		})));

		// Toggle on double click
		this._register((list.onMouseDblClick(event => (event.element as INotificationViewItem).toggle())));

		// Clear focus when DOM focus moves out
		// Use document.hasFocus() to not clear the focus when the entire window lost focus
		// This ensures that when the focus comes back, the notification is still focused
		const listFocusTracker = this._register(trackFocus(list.getHTMLElement()));
		this._register(listFocusTracker.onDidBlur(() => {
			if (getWindow(this.listContainer).document.hasFocus()) {
				list.setFocus([]);
			}
		}));

		// Context key
		NotificationFocusedContext.bindTo(list.contextKeyService);

		// Only allow for focus in notifications, as the
		// selection is too strong over the contents of
		// the notification
		this._register(list.onDidChangeSelection(e => {
			if (e.indexes.length > 0) {
				list.setSelection([]);
			}
		}));

		this.container.appendChild(this.listContainer);
	}

	updateNotificationsList(start: number, deleteCount: number, items: INotificationViewItem[] = []) {
		const [list, listContainer] = assertReturnsAllDefined(this.list, this.listContainer);
		const listHasDOMFocus = isAncestorOfActiveElement(listContainer);

		// Remember focus and relative top of that item
		const focusedIndex = list.getFocus()[0];
		const focusedItem = this.viewModel[focusedIndex];

		let focusRelativeTop: number | null = null;
		if (typeof focusedIndex === 'number') {
			focusRelativeTop = list.getRelativeTop(focusedIndex);
		}

		// Update view model
		this.viewModel.splice(start, deleteCount, ...items);

		// Update list
		list.splice(start, deleteCount, items);
		list.layout();

		// Hide if no more notifications to show
		if (this.viewModel.length === 0) {
			this.hide();
		}

		// Otherwise restore focus if we had
		else if (typeof focusedIndex === 'number') {
			let indexToFocus = 0;
			if (focusedItem) {
				let indexToFocusCandidate = this.viewModel.indexOf(focusedItem);
				if (indexToFocusCandidate === -1) {
					indexToFocusCandidate = focusedIndex - 1; // item could have been removed
				}

				if (indexToFocusCandidate < this.viewModel.length && indexToFocusCandidate >= 0) {
					indexToFocus = indexToFocusCandidate;
				}
			}

			if (typeof focusRelativeTop === 'number') {
				list.reveal(indexToFocus, focusRelativeTop);
			}

			list.setFocus([indexToFocus]);
		}

		// Restore DOM focus if we had focus before
		if (this.isVisible && listHasDOMFocus) {
			list.domFocus();
		}
	}

	updateNotificationHeight(item: INotificationViewItem): void {
		const index = this.viewModel.indexOf(item);
		if (index === -1) {
			return;
		}

		const [list, listDelegate] = assertReturnsAllDefined(this.list, this.listDelegate);
		list.updateElementHeight(index, listDelegate.getHeight(item));
		list.layout();
	}

	hide(): void {
		if (!this.isVisible || !this.list) {
			return; // already hidden
		}

		// Hide
		this.isVisible = false;

		// Clear list
		this.list.splice(0, this.viewModel.length);

		// Clear view model
		this.viewModel = [];
	}

	focusFirst(): void {
		if (!this.list) {
			return; // not created yet
		}

		this.list.focusFirst();
		this.list.domFocus();
	}

	hasFocus(): boolean {
		if (!this.listContainer) {
			return false; // not created yet
		}

		return isAncestorOfActiveElement(this.listContainer);
	}

	layout(width: number, maxHeight?: number): void {
		if (this.listContainer && this.list) {
			this.listContainer.style.width = `${width}px`;

			if (typeof maxHeight === 'number') {
				this.list.getHTMLElement().style.maxHeight = `${maxHeight}px`;
			}

			this.list.layout();
		}
	}

	override dispose(): void {
		this.hide();

		super.dispose();
	}
}

export class NotificationAccessibilityProvider implements IListAccessibilityProvider<INotificationViewItem> {

	constructor(
		private readonly _options: INotificationsListOptions,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IConfigurationService private readonly _configurationService: IConfigurationService
	) { }

	getAriaLabel(element: INotificationViewItem): string {
		let accessibleViewHint: string | undefined;
		const keybinding = this._keybindingService.lookupKeybinding('editor.action.accessibleView')?.getAriaLabel();
		if (this._configurationService.getValue('accessibility.verbosity.notification')) {
			accessibleViewHint = keybinding ? localize('notificationAccessibleViewHint', "Inspect the response in the accessible view with {0}", keybinding) : localize('notificationAccessibleViewHintNoKb', "Inspect the response in the accessible view via the command Open Accessible View which is currently not triggerable via keybinding");
		}

		if (!element.source) {
			return withSeverityPrefix(accessibleViewHint ? localize('notificationAriaLabelHint', "{0}, notification, {1}", element.message.raw, accessibleViewHint) : localize('notificationAriaLabel', "{0}, notification", element.message.raw), element.severity);
		}

		return withSeverityPrefix(accessibleViewHint ? localize('notificationWithSourceAriaLabelHint', "{0}, source: {1}, notification, {2}", element.message.raw, element.source, accessibleViewHint) : localize('notificationWithSourceAriaLabel', "{0}, source: {1}, notification", element.message.raw, element.source), element.severity);
	}

	getWidgetAriaLabel(): string {
		return this._options.widgetAriaLabel ?? localize('notificationsList', "Notifications List");
	}

	getRole(): AriaRole {
		return 'dialog'; // https://github.com/microsoft/vscode/issues/82728
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/notifications/notificationsStatus.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/notifications/notificationsStatus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INotificationsModel, INotificationChangeEvent, NotificationChangeType, IStatusMessageChangeEvent, StatusMessageChangeType, IStatusMessageViewItem } from '../../../common/notifications.js';
import { IStatusbarService, StatusbarAlignment, IStatusbarEntryAccessor, IStatusbarEntry } from '../../../services/statusbar/browser/statusbar.js';
import { Disposable, IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { HIDE_NOTIFICATIONS_CENTER, SHOW_NOTIFICATIONS_CENTER } from './notificationsCommands.js';
import { localize } from '../../../../nls.js';
import { INotificationService, NotificationsFilter } from '../../../../platform/notification/common/notification.js';

export class NotificationsStatus extends Disposable {

	private notificationsCenterStatusItem: IStatusbarEntryAccessor | undefined;
	private newNotificationsCount = 0;

	private currentStatusMessage: [IStatusMessageViewItem, IDisposable] | undefined;

	private isNotificationsCenterVisible: boolean = false;
	private isNotificationsToastsVisible: boolean = false;

	constructor(
		private readonly model: INotificationsModel,
		@IStatusbarService private readonly statusbarService: IStatusbarService,
		@INotificationService private readonly notificationService: INotificationService
	) {
		super();

		this.updateNotificationsCenterStatusItem();

		if (model.statusMessage) {
			this.doSetStatusMessage(model.statusMessage);
		}

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.model.onDidChangeNotification(e => this.onDidChangeNotification(e)));
		this._register(this.model.onDidChangeStatusMessage(e => this.onDidChangeStatusMessage(e)));
		this._register(this.notificationService.onDidChangeFilter(() => this.updateNotificationsCenterStatusItem()));
	}

	private onDidChangeNotification(e: INotificationChangeEvent): void {

		// Consider a notification as unread as long as it only
		// appeared as toast and not in the notification center
		if (!this.isNotificationsCenterVisible) {
			if (e.kind === NotificationChangeType.ADD) {
				this.newNotificationsCount++;
			} else if (e.kind === NotificationChangeType.REMOVE && this.newNotificationsCount > 0) {
				this.newNotificationsCount--;
			}
		}

		// Update in status bar
		this.updateNotificationsCenterStatusItem();
	}

	private updateNotificationsCenterStatusItem(): void {

		// Figure out how many notifications have progress only if neither
		// toasts are visible nor center is visible. In that case we still
		// want to give a hint to the user that something is running.
		let notificationsInProgress = 0;
		if (!this.isNotificationsCenterVisible && !this.isNotificationsToastsVisible) {
			for (const notification of this.model.notifications) {
				if (notification.hasProgress) {
					notificationsInProgress++;
				}
			}
		}

		// Show the status bar entry depending on do not disturb setting

		let statusProperties: IStatusbarEntry = {
			name: localize('status.notifications', "Notifications"),
			text: `${notificationsInProgress > 0 || this.newNotificationsCount > 0 ? '$(bell-dot)' : '$(bell)'}`,
			ariaLabel: localize('status.notifications', "Notifications"),
			command: this.isNotificationsCenterVisible ? HIDE_NOTIFICATIONS_CENTER : SHOW_NOTIFICATIONS_CENTER,
			tooltip: this.getTooltip(notificationsInProgress),
			showBeak: this.isNotificationsCenterVisible
		};

		if (this.notificationService.getFilter() === NotificationsFilter.ERROR) {
			statusProperties = {
				...statusProperties,
				text: `${notificationsInProgress > 0 || this.newNotificationsCount > 0 ? '$(bell-slash-dot)' : '$(bell-slash)'}`,
				ariaLabel: localize('status.doNotDisturb', "Do Not Disturb"),
				tooltip: localize('status.doNotDisturbTooltip', "Do Not Disturb Mode is Enabled")
			};
		}

		if (!this.notificationsCenterStatusItem) {
			this.notificationsCenterStatusItem = this.statusbarService.addEntry(
				statusProperties,
				'status.notifications',
				StatusbarAlignment.RIGHT,
				Number.NEGATIVE_INFINITY /* last entry */
			);
		} else {
			this.notificationsCenterStatusItem.update(statusProperties);
		}
	}

	private getTooltip(notificationsInProgress: number): string {
		if (this.isNotificationsCenterVisible) {
			return localize('hideNotifications', "Hide Notifications");
		}

		if (this.model.notifications.length === 0) {
			return localize('zeroNotifications', "No Notifications");
		}

		if (notificationsInProgress === 0) {
			if (this.newNotificationsCount === 0) {
				return localize('noNotifications', "No New Notifications");
			}

			if (this.newNotificationsCount === 1) {
				return localize('oneNotification', "1 New Notification");
			}

			return localize({ key: 'notifications', comment: ['{0} will be replaced by a number'] }, "{0} New Notifications", this.newNotificationsCount);
		}

		if (this.newNotificationsCount === 0) {
			return localize({ key: 'noNotificationsWithProgress', comment: ['{0} will be replaced by a number'] }, "No New Notifications ({0} in progress)", notificationsInProgress);
		}

		if (this.newNotificationsCount === 1) {
			return localize({ key: 'oneNotificationWithProgress', comment: ['{0} will be replaced by a number'] }, "1 New Notification ({0} in progress)", notificationsInProgress);
		}

		return localize({ key: 'notificationsWithProgress', comment: ['{0} and {1} will be replaced by a number'] }, "{0} New Notifications ({1} in progress)", this.newNotificationsCount, notificationsInProgress);
	}

	update(isCenterVisible: boolean, isToastsVisible: boolean): void {
		let updateNotificationsCenterStatusItem = false;

		if (this.isNotificationsCenterVisible !== isCenterVisible) {
			this.isNotificationsCenterVisible = isCenterVisible;
			this.newNotificationsCount = 0; // Showing the notification center resets the unread counter to 0
			updateNotificationsCenterStatusItem = true;
		}

		if (this.isNotificationsToastsVisible !== isToastsVisible) {
			this.isNotificationsToastsVisible = isToastsVisible;
			updateNotificationsCenterStatusItem = true;
		}

		// Update in status bar as needed
		if (updateNotificationsCenterStatusItem) {
			this.updateNotificationsCenterStatusItem();
		}
	}

	private onDidChangeStatusMessage(e: IStatusMessageChangeEvent): void {
		const statusItem = e.item;

		switch (e.kind) {

			// Show status notification
			case StatusMessageChangeType.ADD:
				this.doSetStatusMessage(statusItem);

				break;

			// Hide status notification (if its still the current one)
			case StatusMessageChangeType.REMOVE:
				if (this.currentStatusMessage && this.currentStatusMessage[0] === statusItem) {
					dispose(this.currentStatusMessage[1]);
					this.currentStatusMessage = undefined;
				}

				break;
		}
	}

	private doSetStatusMessage(item: IStatusMessageViewItem): void {
		const message = item.message;

		const showAfter = item.options && typeof item.options.showAfter === 'number' ? item.options.showAfter : 0;
		const hideAfter = item.options && typeof item.options.hideAfter === 'number' ? item.options.hideAfter : -1;

		// Dismiss any previous
		if (this.currentStatusMessage) {
			dispose(this.currentStatusMessage[1]);
		}

		// Create new
		let statusMessageEntry: IStatusbarEntryAccessor;
		let showHandle: Timeout | undefined = setTimeout(() => {
			statusMessageEntry = this.statusbarService.addEntry(
				{
					name: localize('status.message', "Status Message"),
					text: message,
					ariaLabel: message
				},
				'status.message',
				StatusbarAlignment.LEFT,
				Number.NEGATIVE_INFINITY /* last entry */
			);
			showHandle = undefined;
		}, showAfter);

		// Dispose function takes care of timeouts and actual entry
		let hideHandle: Timeout | undefined;
		const statusMessageDispose = {
			dispose: () => {
				if (showHandle) {
					clearTimeout(showHandle);
				}

				if (hideHandle) {
					clearTimeout(hideHandle);
				}

				statusMessageEntry?.dispose();
			}
		};

		if (hideAfter > 0) {
			hideHandle = setTimeout(() => statusMessageDispose.dispose(), hideAfter);
		}

		// Remember as current status message
		this.currentStatusMessage = [item, statusMessageDispose];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/notifications/notificationsToasts.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/notifications/notificationsToasts.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/notificationsToasts.css';
import { localize } from '../../../../nls.js';
import { INotificationsModel, NotificationChangeType, INotificationChangeEvent, INotificationViewItem, NotificationViewItemContentChangeKind } from '../../../common/notifications.js';
import { IDisposable, dispose, toDisposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { addDisposableListener, EventType, Dimension, scheduleAtNextAnimationFrame, isAncestorOfActiveElement, getWindow, $, isElementInBottomRightQuarter, isHTMLElement, isEditableElement, getActiveElement } from '../../../../base/browser/dom.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { NotificationsList } from './notificationsList.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { IWorkbenchLayoutService, Parts } from '../../../services/layout/browser/layoutService.js';
import { NOTIFICATIONS_TOAST_BORDER, NOTIFICATIONS_BACKGROUND } from '../../../common/theme.js';
import { IThemeService, Themable } from '../../../../platform/theme/common/themeService.js';
import { widgetShadow } from '../../../../platform/theme/common/colorRegistry.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { INotificationsToastController } from './notificationsCommands.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { Severity, NotificationsFilter, NotificationPriority, withSeverityPrefix } from '../../../../platform/notification/common/notification.js';
import { ScrollbarVisibility } from '../../../../base/common/scrollable.js';
import { ILifecycleService, LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IntervalCounter } from '../../../../base/common/async.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { NotificationsToastsVisibleContext } from '../../../common/contextkeys.js';
import { mainWindow } from '../../../../base/browser/window.js';

interface INotificationToast {
	readonly item: INotificationViewItem;
	readonly list: NotificationsList;
	readonly container: HTMLElement;
	readonly toast: HTMLElement;
}

enum ToastVisibility {
	HIDDEN_OR_VISIBLE,
	HIDDEN,
	VISIBLE
}

export class NotificationsToasts extends Themable implements INotificationsToastController {

	private static readonly MAX_WIDTH = 450;
	private static readonly MAX_NOTIFICATIONS = 3;

	private static readonly PURGE_TIMEOUT: { [severity: number]: number } = {
		[Severity.Info]: 10000,
		[Severity.Warning]: 12000,
		[Severity.Error]: 15000
	};

	private static readonly SPAM_PROTECTION = {
		// Count for the number of notifications over 800ms...
		interval: 800,
		// ...and ensure we are not showing more than MAX_NOTIFICATIONS
		limit: this.MAX_NOTIFICATIONS
	};

	private readonly _onDidChangeVisibility = this._register(new Emitter<void>());
	readonly onDidChangeVisibility = this._onDidChangeVisibility.event;

	private _isVisible = false;
	get isVisible(): boolean { return !!this._isVisible; }

	private notificationsToastsContainer: HTMLElement | undefined;
	private workbenchDimensions: Dimension | undefined;
	private isNotificationsCenterVisible: boolean | undefined;

	private readonly mapNotificationToToast = new Map<INotificationViewItem, INotificationToast>();
	private readonly mapNotificationToDisposable = new Map<INotificationViewItem, IDisposable>();

	private readonly notificationsToastsVisibleContextKey: IContextKey<boolean>;

	private readonly addedToastsIntervalCounter = new IntervalCounter(NotificationsToasts.SPAM_PROTECTION.interval);

	constructor(
		private readonly container: HTMLElement,
		private readonly model: INotificationsModel,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IThemeService themeService: IThemeService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IHostService private readonly hostService: IHostService
	) {
		super(themeService);

		this.notificationsToastsVisibleContextKey = NotificationsToastsVisibleContext.bindTo(contextKeyService);

		this.registerListeners();
	}

	private registerListeners(): void {

		// Layout
		this._register(this.layoutService.onDidLayoutMainContainer(dimension => this.layout(Dimension.lift(dimension))));

		// Delay some tasks until after we have restored
		// to reduce UI pressure from the startup phase
		this.lifecycleService.when(LifecyclePhase.Restored).then(() => {

			// Show toast for initial notifications if any
			this.model.notifications.forEach(notification => this.addToast(notification));

			// Update toasts on notification changes
			this._register(this.model.onDidChangeNotification(e => this.onDidChangeNotification(e)));
		});

		// Filter
		this._register(this.model.onDidChangeFilter(({ global, sources }) => {
			if (global === NotificationsFilter.ERROR) {
				this.hide();
			} else if (sources) {
				for (const [notification] of this.mapNotificationToToast) {
					if (typeof notification.sourceId === 'string' && sources.get(notification.sourceId) === NotificationsFilter.ERROR && notification.severity !== Severity.Error && notification.priority !== NotificationPriority.URGENT) {
						this.removeToast(notification);
					}
				}
			}
		}));
	}

	private onDidChangeNotification(e: INotificationChangeEvent): void {
		switch (e.kind) {
			case NotificationChangeType.ADD:
				return this.addToast(e.item);
			case NotificationChangeType.REMOVE:
				return this.removeToast(e.item);
		}
	}

	private addToast(item: INotificationViewItem): void {
		if (this.isNotificationsCenterVisible) {
			return; // do not show toasts while notification center is visible
		}

		if (item.priority === NotificationPriority.SILENT) {
			return; // do not show toasts for silenced notifications
		}

		if (item.priority === NotificationPriority.OPTIONAL) {
			const activeElement = getActiveElement();
			if (isHTMLElement(activeElement) && isEditableElement(activeElement) && isElementInBottomRightQuarter(activeElement, this.layoutService.mainContainer)) {
				return; // skip showing optional toast that potentially covers input fields
			}
		}

		// Optimization: it is possible that a lot of notifications are being
		// added in a very short time. To prevent this kind of spam, we protect
		// against showing too many notifications at once. Since they can always
		// be accessed from the notification center, a user can always get to
		// them later on.
		// (see also https://github.com/microsoft/vscode/issues/107935)
		if (this.addedToastsIntervalCounter.increment() > NotificationsToasts.SPAM_PROTECTION.limit) {
			return;
		}

		// Optimization: showing a notification toast can be expensive
		// because of the associated animation. If the renderer is busy
		// doing actual work, the animation can cause a lot of slowdown
		// As such we use `scheduleAtNextAnimationFrame` to push out
		// the toast until the renderer has time to process it.
		// (see also https://github.com/microsoft/vscode/issues/107935)
		const itemDisposables = new DisposableStore();
		this.mapNotificationToDisposable.set(item, itemDisposables);
		itemDisposables.add(scheduleAtNextAnimationFrame(getWindow(this.container), () => this.doAddToast(item, itemDisposables)));
	}

	private doAddToast(item: INotificationViewItem, itemDisposables: DisposableStore): void {

		// Lazily create toasts containers
		let notificationsToastsContainer = this.notificationsToastsContainer;
		if (!notificationsToastsContainer) {
			notificationsToastsContainer = this.notificationsToastsContainer = $('.notifications-toasts');

			this.container.appendChild(notificationsToastsContainer);
		}

		// Make Visible
		notificationsToastsContainer.classList.add('visible');

		// Container
		const notificationToastContainer = $('.notification-toast-container');

		const firstToast = notificationsToastsContainer.firstChild;
		if (firstToast) {
			notificationsToastsContainer.insertBefore(notificationToastContainer, firstToast); // always first
		} else {
			notificationsToastsContainer.appendChild(notificationToastContainer);
		}

		// Toast
		const notificationToast = $('.notification-toast');
		notificationToastContainer.appendChild(notificationToast);

		// Create toast with item and show
		const notificationList = this.instantiationService.createInstance(NotificationsList, notificationToast, {
			verticalScrollMode: ScrollbarVisibility.Hidden,
			widgetAriaLabel: (() => {
				if (!item.source) {
					return withSeverityPrefix(localize('notificationAriaLabel', "{0}, notification", item.message.raw), item.severity);
				}

				return withSeverityPrefix(localize('notificationWithSourceAriaLabel', "{0}, source: {1}, notification", item.message.raw, item.source), item.severity);
			})()
		});
		itemDisposables.add(notificationList);

		const toast: INotificationToast = { item, list: notificationList, container: notificationToastContainer, toast: notificationToast };
		this.mapNotificationToToast.set(item, toast);

		// When disposed, remove as visible
		itemDisposables.add(toDisposable(() => this.updateToastVisibility(toast, false)));

		// Make visible
		notificationList.show();

		// Layout lists
		const maxDimensions = this.computeMaxDimensions();
		this.layoutLists(maxDimensions.width);

		// Show notification
		notificationList.updateNotificationsList(0, 0, [item]);

		// Layout container: only after we show the notification to ensure that
		// the height computation takes the content of it into account!
		this.layoutContainer(maxDimensions.height);

		// Re-draw entire item when expansion changes to reveal or hide details
		itemDisposables.add(item.onDidChangeExpansion(() => {
			notificationList.updateNotificationsList(0, 1, [item]);
		}));

		// Handle content changes
		// - actions: re-draw to properly show them
		// - message: update notification height unless collapsed
		itemDisposables.add(item.onDidChangeContent(e => {
			switch (e.kind) {
				case NotificationViewItemContentChangeKind.ACTIONS:
					notificationList.updateNotificationsList(0, 1, [item]);
					break;
				case NotificationViewItemContentChangeKind.MESSAGE:
					if (item.expanded) {
						notificationList.updateNotificationHeight(item);
					}
					break;
			}
		}));

		// Remove when item gets closed
		Event.once(item.onDidClose)(() => {
			this.removeToast(item);
		});

		// Automatically purge non-sticky notifications
		this.purgeNotification(item, notificationToastContainer, notificationList, itemDisposables);

		// Theming
		this.updateStyles();

		// Context Key
		this.notificationsToastsVisibleContextKey.set(true);

		// Animate in
		notificationToast.classList.add('notification-fade-in');
		itemDisposables.add(addDisposableListener(notificationToast, 'transitionend', () => {
			notificationToast.classList.remove('notification-fade-in');
			notificationToast.classList.add('notification-fade-in-done');
		}));

		// Mark as visible
		item.updateVisibility(true);

		// Events
		if (!this._isVisible) {
			this._isVisible = true;
			this._onDidChangeVisibility.fire();
		}
	}

	private purgeNotification(item: INotificationViewItem, notificationToastContainer: HTMLElement, notificationList: NotificationsList, disposables: DisposableStore): void {

		// Track mouse over item
		let isMouseOverToast = false;
		disposables.add(addDisposableListener(notificationToastContainer, EventType.MOUSE_OVER, () => isMouseOverToast = true));
		disposables.add(addDisposableListener(notificationToastContainer, EventType.MOUSE_OUT, () => isMouseOverToast = false));

		// Install Timers to Purge Notification
		let purgeTimeoutHandle: Timeout;
		let listener: IDisposable;

		const hideAfterTimeout = () => {

			purgeTimeoutHandle = setTimeout(() => {

				// If the window does not have focus, we wait for the window to gain focus
				// again before triggering the timeout again. This prevents an issue where
				// focussing the window could immediately hide the notification because the
				// timeout was triggered again.
				if (!this.hostService.hasFocus) {
					if (!listener) {
						listener = this.hostService.onDidChangeFocus(focus => {
							if (focus) {
								hideAfterTimeout();
							}
						});
						disposables.add(listener);
					}
				}

				// Otherwise...
				else if (
					item.sticky ||								// never hide sticky notifications
					notificationList.hasFocus() ||				// never hide notifications with focus
					isMouseOverToast							// never hide notifications under mouse
				) {
					hideAfterTimeout();
				} else {
					this.removeToast(item);
				}
			}, NotificationsToasts.PURGE_TIMEOUT[item.severity]);
		};

		hideAfterTimeout();

		disposables.add(toDisposable(() => clearTimeout(purgeTimeoutHandle)));
	}

	private removeToast(item: INotificationViewItem): void {
		let focusEditor = false;

		// UI
		const notificationToast = this.mapNotificationToToast.get(item);
		if (notificationToast) {
			const toastHasDOMFocus = isAncestorOfActiveElement(notificationToast.container);
			if (toastHasDOMFocus) {
				focusEditor = !(this.focusNext() || this.focusPrevious()); // focus next if any, otherwise focus editor
			}

			this.mapNotificationToToast.delete(item);
		}

		// Disposables
		const notificationDisposables = this.mapNotificationToDisposable.get(item);
		if (notificationDisposables) {
			dispose(notificationDisposables);

			this.mapNotificationToDisposable.delete(item);
		}

		// Layout if we still have toasts
		if (this.mapNotificationToToast.size > 0) {
			this.layout(this.workbenchDimensions);
		}

		// Otherwise hide if no more toasts to show
		else {
			this.doHide();

			// Move focus back to editor group as needed
			if (focusEditor) {
				this.editorGroupService.activeGroup.focus();
			}
		}
	}

	private removeToasts(): void {

		// Toast
		this.mapNotificationToToast.clear();

		// Disposables
		this.mapNotificationToDisposable.forEach(disposable => dispose(disposable));
		this.mapNotificationToDisposable.clear();

		this.doHide();
	}

	private doHide(): void {
		this.notificationsToastsContainer?.classList.remove('visible');

		// Context Key
		this.notificationsToastsVisibleContextKey.set(false);

		// Events
		if (this._isVisible) {
			this._isVisible = false;
			this._onDidChangeVisibility.fire();
		}
	}

	hide(): void {
		const focusEditor = this.notificationsToastsContainer ? isAncestorOfActiveElement(this.notificationsToastsContainer) : false;

		this.removeToasts();

		if (focusEditor) {
			this.editorGroupService.activeGroup.focus();
		}
	}

	focus(): boolean {
		const toasts = this.getToasts(ToastVisibility.VISIBLE);
		if (toasts.length > 0) {
			toasts[0].list.focusFirst();

			return true;
		}

		return false;
	}

	focusNext(): boolean {
		const toasts = this.getToasts(ToastVisibility.VISIBLE);
		for (let i = 0; i < toasts.length; i++) {
			const toast = toasts[i];
			if (toast.list.hasFocus()) {
				const nextToast = toasts[i + 1];
				if (nextToast) {
					nextToast.list.focusFirst();

					return true;
				}

				break;
			}
		}

		return false;
	}

	focusPrevious(): boolean {
		const toasts = this.getToasts(ToastVisibility.VISIBLE);
		for (let i = 0; i < toasts.length; i++) {
			const toast = toasts[i];
			if (toast.list.hasFocus()) {
				const previousToast = toasts[i - 1];
				if (previousToast) {
					previousToast.list.focusFirst();

					return true;
				}

				break;
			}
		}

		return false;
	}

	focusFirst(): boolean {
		const toast = this.getToasts(ToastVisibility.VISIBLE)[0];
		if (toast) {
			toast.list.focusFirst();

			return true;
		}

		return false;
	}

	focusLast(): boolean {
		const toasts = this.getToasts(ToastVisibility.VISIBLE);
		if (toasts.length > 0) {
			toasts[toasts.length - 1].list.focusFirst();

			return true;
		}

		return false;
	}

	update(isCenterVisible: boolean): void {
		if (this.isNotificationsCenterVisible !== isCenterVisible) {
			this.isNotificationsCenterVisible = isCenterVisible;

			// Hide all toasts when the notificationcenter gets visible
			if (this.isNotificationsCenterVisible) {
				this.removeToasts();
			}
		}
	}

	override updateStyles(): void {
		this.mapNotificationToToast.forEach(({ toast }) => {
			const backgroundColor = this.getColor(NOTIFICATIONS_BACKGROUND);
			toast.style.background = backgroundColor ? backgroundColor : '';

			const widgetShadowColor = this.getColor(widgetShadow);
			toast.style.boxShadow = widgetShadowColor ? `0 0 8px 2px ${widgetShadowColor}` : '';

			const borderColor = this.getColor(NOTIFICATIONS_TOAST_BORDER);
			toast.style.border = borderColor ? `1px solid ${borderColor}` : '';
		});
	}

	private getToasts(state: ToastVisibility): INotificationToast[] {
		const notificationToasts: INotificationToast[] = [];

		this.mapNotificationToToast.forEach(toast => {
			switch (state) {
				case ToastVisibility.HIDDEN_OR_VISIBLE:
					notificationToasts.push(toast);
					break;
				case ToastVisibility.HIDDEN:
					if (!this.isToastInDOM(toast)) {
						notificationToasts.push(toast);
					}
					break;
				case ToastVisibility.VISIBLE:
					if (this.isToastInDOM(toast)) {
						notificationToasts.push(toast);
					}
					break;
			}
		});

		return notificationToasts.reverse(); // from newest to oldest
	}

	layout(dimension: Dimension | undefined): void {
		this.workbenchDimensions = dimension;

		const maxDimensions = this.computeMaxDimensions();

		// Hide toasts that exceed height
		if (maxDimensions.height) {
			this.layoutContainer(maxDimensions.height);
		}

		// Layout all lists of toasts
		this.layoutLists(maxDimensions.width);
	}

	private computeMaxDimensions(): Dimension {
		const maxWidth = NotificationsToasts.MAX_WIDTH;

		let availableWidth = maxWidth;
		let availableHeight: number | undefined;

		if (this.workbenchDimensions) {

			// Make sure notifications are not exceding available width
			availableWidth = this.workbenchDimensions.width;
			availableWidth -= (2 * 8); // adjust for paddings left and right

			// Make sure notifications are not exceeding available height
			availableHeight = this.workbenchDimensions.height;
			if (this.layoutService.isVisible(Parts.STATUSBAR_PART, mainWindow)) {
				availableHeight -= 22; // adjust for status bar
			}

			if (this.layoutService.isVisible(Parts.TITLEBAR_PART, mainWindow)) {
				availableHeight -= 22; // adjust for title bar
			}

			availableHeight -= (2 * 12); // adjust for paddings top and bottom
		}

		return new Dimension(Math.min(maxWidth, availableWidth), availableHeight ?? 0);
	}

	private layoutLists(width: number): void {
		this.mapNotificationToToast.forEach(({ list }) => list.layout(width));
	}

	private layoutContainer(heightToGive: number): void {

		// Allow the full height for 1 toast but adjust for multiple toasts
		// so that a stack of notifications does not exceed all the way up

		let singleToastHeightToGive = heightToGive;
		let multipleToastsHeightToGive = Math.round(heightToGive * 0.618);

		let visibleToasts = 0;
		for (const toast of this.getToasts(ToastVisibility.HIDDEN_OR_VISIBLE)) {

			// In order to measure the client height, the element cannot have display: none
			toast.container.style.opacity = '0';
			this.updateToastVisibility(toast, true);

			singleToastHeightToGive -= toast.container.offsetHeight;
			multipleToastsHeightToGive -= toast.container.offsetHeight;

			let makeVisible = false;
			if (visibleToasts === NotificationsToasts.MAX_NOTIFICATIONS) {
				makeVisible = false; // never show more than MAX_NOTIFICATIONS
			} else if ((visibleToasts === 0 && singleToastHeightToGive >= 0) || (visibleToasts > 0 && multipleToastsHeightToGive >= 0)) {
				makeVisible = true; // hide toast if available height is too little
			}

			// Hide or show toast based on context
			this.updateToastVisibility(toast, makeVisible);
			toast.container.style.opacity = '';

			if (makeVisible) {
				visibleToasts++;
			}
		}
	}

	private updateToastVisibility(toast: INotificationToast, visible: boolean): void {
		if (this.isToastInDOM(toast) === visible) {
			return;
		}

		// Update visibility in DOM
		const notificationsToastsContainer = assertReturnsDefined(this.notificationsToastsContainer);
		if (visible) {
			notificationsToastsContainer.appendChild(toast.container);
		} else {
			toast.container.remove();
		}

		// Update visibility in model
		toast.item.updateVisibility(visible);
	}

	private isToastInDOM(toast: INotificationToast): boolean {
		return !!toast.container.parentElement;
	}
}
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 424
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 424 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/browser/view/renderers/backLayerWebView.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/renderers/backLayerWebView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getWindow } from '../../../../../../base/browser/dom.js';
import { IMouseWheelEvent } from '../../../../../../base/browser/mouseEvent.js';
import { CodeWindow } from '../../../../../../base/browser/window.js';
import { WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../../../../base/common/actions.js';
import { coalesce } from '../../../../../../base/common/arrays.js';
import { DeferredPromise, runWhenGlobalIdle } from '../../../../../../base/common/async.js';
import { decodeBase64 } from '../../../../../../base/common/buffer.js';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { IDisposable } from '../../../../../../base/common/lifecycle.js';
import { getExtensionForMimeType, isTextStreamMime } from '../../../../../../base/common/mime.js';
import { FileAccess, Schemas, matchesScheme, matchesSomeScheme } from '../../../../../../base/common/network.js';
import { equals } from '../../../../../../base/common/objects.js';
import * as osPath from '../../../../../../base/common/path.js';
import { isMacintosh, isWeb } from '../../../../../../base/common/platform.js';
import { dirname, extname, isEqual, joinPath } from '../../../../../../base/common/resources.js';
import { URI } from '../../../../../../base/common/uri.js';
import * as UUID from '../../../../../../base/common/uuid.js';
import { TokenizationRegistry } from '../../../../../../editor/common/languages.js';
import { ILanguageService } from '../../../../../../editor/common/languages/language.js';
import { generateTokensCSSForColorMap } from '../../../../../../editor/common/languages/supports/tokenization.js';
import { tokenizeToString } from '../../../../../../editor/common/languages/textToHtmlTokenizer.js';
import * as nls from '../../../../../../nls.js';
import { MenuId } from '../../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../../platform/contextview/browser/contextView.js';
import { IFileDialogService } from '../../../../../../platform/dialogs/common/dialogs.js';
import { ITextEditorOptions, ITextEditorSelection } from '../../../../../../platform/editor/common/editor.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import { IOpenerService } from '../../../../../../platform/opener/common/opener.js';
import { IStorageService } from '../../../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../../../platform/telemetry/common/telemetry.js';
import { editorFindMatch, editorFindMatchHighlight } from '../../../../../../platform/theme/common/colorRegistry.js';
import { IThemeService, Themable } from '../../../../../../platform/theme/common/themeService.js';
import { IWorkspaceContextService } from '../../../../../../platform/workspace/common/workspace.js';
import { IWorkspaceTrustManagementService } from '../../../../../../platform/workspace/common/workspaceTrust.js';
import { EditorInput } from '../../../../../common/editor/editorInput.js';
import { CellEditState, ICellOutputViewModel, ICellViewModel, ICommonCellInfo, IDisplayOutputLayoutUpdateRequest, IDisplayOutputViewModel, IFocusNotebookCellOptions, IGenericCellViewModel, IInsetRenderOutput, INotebookEditorCreationOptions, INotebookWebviewMessage, RenderOutputType } from '../../notebookBrowser.js';
import { NOTEBOOK_WEBVIEW_BOUNDARY } from '../notebookCellList.js';
import { preloadsScriptStr } from './webviewPreloads.js';
import { transformWebviewThemeVars } from './webviewThemeMapping.js';
import { MarkupCellViewModel } from '../../viewModel/markupCellViewModel.js';
import { CellUri, ICellOutput, INotebookRendererInfo, RendererMessagingSpec } from '../../../common/notebookCommon.js';
import { INotebookKernel } from '../../../common/notebookKernelService.js';
import { INotebookLoggingService } from '../../../common/notebookLoggingService.js';
import { IScopedRendererMessaging } from '../../../common/notebookRendererMessagingService.js';
import { INotebookService } from '../../../common/notebookService.js';
import { IWebviewElement, IWebviewService, WebviewContentPurpose, WebviewOriginStore } from '../../../../webview/browser/webview.js';
import { WebviewWindowDragMonitor } from '../../../../webview/browser/webviewWindowDragMonitor.js';
import { asWebviewUri, webviewGenericCspSource } from '../../../../webview/common/webview.js';
import { IEditorGroup, IEditorGroupsService } from '../../../../../services/editor/common/editorGroupsService.js';
import { IWorkbenchEnvironmentService } from '../../../../../services/environment/common/environmentService.js';
import { IPathService } from '../../../../../services/path/common/pathService.js';
import { FromWebviewMessage, IAckOutputHeight, IClickedDataUrlMessage, ICodeBlockHighlightRequest, IContentWidgetTopRequest, IControllerPreload, ICreationContent, ICreationRequestMessage, IFindMatch, IMarkupCellInitialization, RendererMetadata, StaticPreloadMetadata, ToWebviewMessage } from './webviewMessages.js';
import { getOutputText, getOutputStreamText, TEXT_BASED_MIMETYPES } from '../../viewModel/cellOutputTextHelper.js';

const LINE_COLUMN_REGEX = /:([\d]+)(?::([\d]+))?$/;
const LineQueryRegex = /line=(\d+)$/;
const FRAGMENT_REGEX = /^(.*)#([^#]*)$/;

export interface ICachedInset<K extends ICommonCellInfo> {
	outputId: string;
	versionId: number;
	cellInfo: K;
	renderer?: INotebookRendererInfo;
	cachedCreation: ICreationRequestMessage;
	initialized?: boolean;
}

export interface IResolvedBackLayerWebview {
	webview: IWebviewElement;
}

/**
 * Notebook Editor Delegate for back layer webview
 */
export interface INotebookDelegateForWebview {
	readonly creationOptions: INotebookEditorCreationOptions;
	getCellById(cellId: string): IGenericCellViewModel | undefined;
	focusNotebookCell(cell: IGenericCellViewModel, focus: 'editor' | 'container' | 'output', options?: IFocusNotebookCellOptions): Promise<void>;
	toggleNotebookCellSelection(cell: IGenericCellViewModel, selectFromPrevious: boolean): void;
	getCellByInfo(cellInfo: ICommonCellInfo): IGenericCellViewModel;
	focusNextNotebookCell(cell: IGenericCellViewModel, focus: 'editor' | 'container' | 'output'): Promise<void>;
	updateOutputHeight(cellInfo: ICommonCellInfo, output: IDisplayOutputViewModel, height: number, isInit: boolean, source?: string): void;
	scheduleOutputHeightAck(cellInfo: ICommonCellInfo, outputId: string, height: number): void;
	updateMarkupCellHeight(cellId: string, height: number, isInit: boolean): void;
	setMarkupCellEditState(cellId: string, editState: CellEditState): void;
	didStartDragMarkupCell(cellId: string, event: { dragOffsetY: number }): void;
	didDragMarkupCell(cellId: string, event: { dragOffsetY: number }): void;
	didDropMarkupCell(cellId: string, event: { dragOffsetY: number; ctrlKey: boolean; altKey: boolean }): void;
	didEndDragMarkupCell(cellId: string): void;
	didResizeOutput(cellId: string): void;
	setScrollTop(scrollTop: number): void;
	triggerScroll(event: IMouseWheelEvent): void;
	updatePerformanceMetadata(cellId: string, executionId: string, duration: number, rendererId: string): void;
	didFocusOutputInputChange(inputFocused: boolean): void;
}

interface BacklayerWebviewOptions {
	readonly outputNodePadding: number;
	readonly outputNodeLeftPadding: number;
	readonly previewNodePadding: number;
	readonly markdownLeftMargin: number;
	readonly leftMargin: number;
	readonly rightMargin: number;
	readonly runGutter: number;
	readonly dragAndDropEnabled: boolean;
	readonly fontSize: number;
	readonly outputFontSize: number;
	readonly fontFamily: string;
	readonly outputFontFamily: string;
	readonly markupFontSize: number;
	readonly markdownLineHeight: number;
	readonly outputLineHeight: number;
	readonly outputScrolling: boolean;
	readonly outputWordWrap: boolean;
	readonly outputLineLimit: number;
	readonly outputLinkifyFilePaths: boolean;
	readonly minimalError: boolean;
	readonly markupFontFamily: string;
}


export class BackLayerWebView<T extends ICommonCellInfo> extends Themable {

	private static _originStore?: WebviewOriginStore;

	private static getOriginStore(storageService: IStorageService): WebviewOriginStore {
		this._originStore ??= new WebviewOriginStore('notebook.backlayerWebview.origins', storageService);
		return this._originStore;
	}

	element: HTMLElement;
	webview: IWebviewElement | undefined = undefined;
	insetMapping: Map<IDisplayOutputViewModel, ICachedInset<T>> = new Map();
	pendingWebviewIdleCreationRequest: Map<IDisplayOutputViewModel, IDisposable> = new Map();
	pendingWebviewIdleInsetMapping: Map<IDisplayOutputViewModel, ICachedInset<T>> = new Map();
	private reversedPendingWebviewIdleInsetMapping: Map<string, IDisplayOutputViewModel> = new Map();

	readonly markupPreviewMapping = new Map<string, IMarkupCellInitialization>();
	private hiddenInsetMapping: Set<IDisplayOutputViewModel> = new Set();
	private reversedInsetMapping: Map<string, IDisplayOutputViewModel> = new Map();
	private localResourceRootsCache: URI[] | undefined = undefined;
	private readonly _onMessage = this._register(new Emitter<INotebookWebviewMessage>());
	private readonly _preloadsCache = new Set<string>();
	public readonly onMessage: Event<INotebookWebviewMessage> = this._onMessage.event;
	private _disposed = false;
	private _currentKernel?: INotebookKernel;

	private firstInit = true;
	private initializeMarkupPromise?: { readonly requestId: string; readonly p: DeferredPromise<void>; readonly isFirstInit: boolean };

	private readonly nonce = UUID.generateUuid();

	constructor(
		public notebookEditor: INotebookDelegateForWebview,
		private readonly id: string,
		public readonly notebookViewType: string,
		public readonly documentUri: URI,
		private options: BacklayerWebviewOptions,
		private readonly rendererMessaging: IScopedRendererMessaging | undefined,
		@IWebviewService private readonly webviewService: IWebviewService,
		@IOpenerService private readonly openerService: IOpenerService,
		@INotebookService private readonly notebookService: INotebookService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IFileService private readonly fileService: IFileService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IStorageService private readonly storageService: IStorageService,
		@IPathService private readonly pathService: IPathService,
		@INotebookLoggingService private readonly notebookLogService: INotebookLoggingService,
		@IThemeService themeService: IThemeService,
		@ITelemetryService private readonly telemetryService: ITelemetryService
	) {
		super(themeService);

		this._logRendererDebugMessage('Creating backlayer webview for notebook');

		this.element = document.createElement('div');

		this.element.style.height = '1400px';
		this.element.style.position = 'absolute';

		if (rendererMessaging) {
			this._register(rendererMessaging);
			rendererMessaging.receiveMessageHandler = (rendererId, message) => {
				if (!this.webview || this._disposed) {
					return Promise.resolve(false);
				}

				this._sendMessageToWebview({
					__vscode_notebook_message: true,
					type: 'customRendererMessage',
					rendererId: rendererId,
					message: message
				});

				return Promise.resolve(true);
			};
		}

		this._register(workspaceTrustManagementService.onDidChangeTrust(e => {
			const baseUrl = this.asWebviewUri(this.getNotebookBaseUri(), undefined);
			const htmlContent = this.generateContent(baseUrl.toString());
			this.webview?.setHtml(htmlContent);
		}));

		this._register(TokenizationRegistry.onDidChange(() => {
			this._sendMessageToWebview({
				type: 'tokenizedStylesChanged',
				css: getTokenizationCss(),
			});
		}));
	}

	updateOptions(options: BacklayerWebviewOptions) {
		this.options = options;
		this._updateStyles();
		this._updateOptions();
	}

	private _logRendererDebugMessage(msg: string) {
		this.notebookLogService.debug('BacklayerWebview', `${this.documentUri} (${this.id}) - ${msg}`);
	}

	private _updateStyles() {
		this._sendMessageToWebview({
			type: 'notebookStyles',
			styles: this._generateStyles()
		});
	}

	private _updateOptions() {
		this._sendMessageToWebview({
			type: 'notebookOptions',
			options: {
				dragAndDropEnabled: this.options.dragAndDropEnabled
			},
			renderOptions: {
				lineLimit: this.options.outputLineLimit,
				outputScrolling: this.options.outputScrolling,
				outputWordWrap: this.options.outputWordWrap,
				linkifyFilePaths: this.options.outputLinkifyFilePaths,
				minimalError: this.options.minimalError
			}
		});
	}

	private _generateStyles() {
		return {
			'notebook-output-left-margin': `${this.options.leftMargin + this.options.runGutter}px`,
			'notebook-output-width': `calc(100% - ${this.options.leftMargin + this.options.rightMargin + this.options.runGutter}px)`,
			'notebook-output-node-padding': `${this.options.outputNodePadding}px`,
			'notebook-run-gutter': `${this.options.runGutter}px`,
			'notebook-preview-node-padding': `${this.options.previewNodePadding}px`,
			'notebook-markdown-left-margin': `${this.options.markdownLeftMargin}px`,
			'notebook-output-node-left-padding': `${this.options.outputNodeLeftPadding}px`,
			'notebook-markdown-min-height': `${this.options.previewNodePadding * 2}px`,
			'notebook-markup-font-size': typeof this.options.markupFontSize === 'number' && this.options.markupFontSize > 0 ? `${this.options.markupFontSize}px` : `calc(${this.options.fontSize}px * 1.2)`,
			'notebook-markdown-line-height': typeof this.options.markdownLineHeight === 'number' && this.options.markdownLineHeight > 0 ? `${this.options.markdownLineHeight}px` : `normal`,
			'notebook-cell-output-font-size': `${this.options.outputFontSize || this.options.fontSize}px`,
			'notebook-cell-output-line-height': `${this.options.outputLineHeight}px`,
			'notebook-cell-output-max-height': `${this.options.outputLineHeight * this.options.outputLineLimit + 2}px`,
			'notebook-cell-output-font-family': this.options.outputFontFamily || this.options.fontFamily,
			'notebook-cell-markup-empty-content': nls.localize('notebook.emptyMarkdownPlaceholder', "Empty markdown cell, double-click or press enter to edit."),
			'notebook-cell-renderer-not-found-error': nls.localize({
				key: 'notebook.error.rendererNotFound',
				comment: ['$0 is a placeholder for the mime type']
			}, "No renderer found for '$0'"),
			'notebook-cell-renderer-fallbacks-exhausted': nls.localize({
				key: 'notebook.error.rendererFallbacksExhausted',
				comment: ['$0 is a placeholder for the mime type']
			}, "Could not render content for '$0'"),
			'notebook-markup-font-family': this.options.markupFontFamily,
		};
	}

	private generateContent(baseUrl: string) {
		const renderersData = this.getRendererData();
		const preloadsData = this.getStaticPreloadsData();
		const renderOptions = {
			lineLimit: this.options.outputLineLimit,
			outputScrolling: this.options.outputScrolling,
			outputWordWrap: this.options.outputWordWrap,
			linkifyFilePaths: this.options.outputLinkifyFilePaths,
			minimalError: this.options.minimalError
		};
		const preloadScript = preloadsScriptStr(
			{
				...this.options,
				tokenizationCss: getTokenizationCss(),
			},
			{ dragAndDropEnabled: this.options.dragAndDropEnabled },
			renderOptions,
			renderersData,
			preloadsData,
			this.workspaceTrustManagementService.isWorkspaceTrusted(),
			this.nonce);

		const enableCsp = this.configurationService.getValue('notebook.experimental.enableCsp');
		const currentHighlight = this.getColor(editorFindMatch);
		const findMatchHighlight = this.getColor(editorFindMatchHighlight);
		return /* html */`
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<base href="${baseUrl}/" />
				${enableCsp ?
				`<meta http-equiv="Content-Security-Policy" content="
					default-src 'none';
					script-src ${webviewGenericCspSource} 'unsafe-inline' 'unsafe-eval';
					style-src ${webviewGenericCspSource} 'unsafe-inline';
					img-src ${webviewGenericCspSource} https: http: data:;
					font-src ${webviewGenericCspSource} https:;
					connect-src https:;
					child-src https: data:;
				">` : ''}
				<style nonce="${this.nonce}">
					::highlight(find-highlight) {
						background-color: var(--vscode-editor-findMatchBackground, ${findMatchHighlight});
					}

					::highlight(current-find-highlight) {
						background-color: var(--vscode-editor-findMatchHighlightBackground, ${currentHighlight});
					}

					#container .cell_container {
						width: 100%;
					}

					#container .output_container {
						width: 100%;
					}

					#container .cell_container.nb-insertHighlight div.output_container div.output {
						background-color: var(--vscode-diffEditor-insertedLineBackground, var(--vscode-diffEditor-insertedTextBackground));
					}

					#container > div > div > div.output {
						font-size: var(--notebook-cell-output-font-size);
						width: var(--notebook-output-width);
						margin-left: var(--notebook-output-left-margin);
						background-color: var(--theme-notebook-output-background);
						padding-top: var(--notebook-output-node-padding);
						padding-right: var(--notebook-output-node-padding);
						padding-bottom: var(--notebook-output-node-padding);
						padding-left: var(--notebook-output-node-left-padding);
						box-sizing: border-box;
						border-top: none;
					}

					/* markdown */
					#container div.preview {
						width: 100%;
						padding-right: var(--notebook-preview-node-padding);
						padding-left: var(--notebook-markdown-left-margin);
						padding-top: var(--notebook-preview-node-padding);
						padding-bottom: var(--notebook-preview-node-padding);

						box-sizing: border-box;
						white-space: nowrap;
						overflow: hidden;
						white-space: initial;

						font-size: var(--notebook-markup-font-size);
						line-height: var(--notebook-markdown-line-height);
						color: var(--theme-ui-foreground);
						font-family: var(--notebook-markup-font-family);
					}

					#container div.preview.draggable {
						user-select: none;
						-webkit-user-select: none;
						-ms-user-select: none;
						cursor: grab;
					}

					#container div.preview.selected {
						background: var(--theme-notebook-cell-selected-background);
					}

					#container div.preview.dragging {
						background-color: var(--theme-background);
						opacity: 0.5 !important;
					}

					.monaco-workbench.vs-dark .notebookOverlay .cell.markdown .latex img,
					.monaco-workbench.vs-dark .notebookOverlay .cell.markdown .latex-block img {
						filter: brightness(0) invert(1)
					}

					#container .markup > div.nb-symbolHighlight {
						background-color: var(--theme-notebook-symbol-highlight-background);
					}

					#container .markup > div.nb-insertHighlight {
						background-color: var(--vscode-diffEditor-insertedLineBackground, var(--vscode-diffEditor-insertedTextBackground));
					}

					#container .nb-symbolHighlight .output_container .output {
						background-color: var(--theme-notebook-symbol-highlight-background);
					}

					#container .markup > div.nb-multiCellHighlight {
						background-color: var(--theme-notebook-symbol-highlight-background);
					}

					#container .nb-multiCellHighlight .output_container .output {
						background-color: var(--theme-notebook-symbol-highlight-background);
					}

					#container .nb-chatGenerationHighlight .output_container .output {
						background-color: var(--vscode-notebook-selectedCellBackground);
					}

					#container > div.nb-cellDeleted .output_container {
						background-color: var(--theme-notebook-diff-removed-background);
					}

					#container > div.nb-cellAdded .output_container {
						background-color: var(--theme-notebook-diff-inserted-background);
					}

					#container > div > div:not(.preview) > div {
						overflow-x: auto;
					}

					#container .no-renderer-error {
						color: var(--vscode-editorError-foreground);
					}

					body {
						padding: 0px;
						height: 100%;
						width: 100%;
					}

					table, thead, tr, th, td, tbody {
						border: none;
						border-color: transparent;
						border-spacing: 0;
						border-collapse: collapse;
					}

					table, th, tr {
						vertical-align: middle;
						text-align: right;
					}

					thead {
						font-weight: bold;
						background-color: rgba(130, 130, 130, 0.16);
					}

					th, td {
						padding: 4px 8px;
					}

					tr:nth-child(even) {
						background-color: rgba(130, 130, 130, 0.08);
					}

					tbody th {
						font-weight: normal;
					}

					.find-match {
						background-color: var(--vscode-editor-findMatchHighlightBackground);
					}

					.current-find-match {
						background-color: var(--vscode-editor-findMatchBackground);
					}

					#_defaultColorPalatte {
						color: var(--vscode-editor-findMatchHighlightBackground);
						background-color: var(--vscode-editor-findMatchBackground);
					}
				</style>
			</head>
			<body style="overflow: hidden;">
				<div id='findStart' tabIndex=-1></div>
				<div id='container' class="widgetarea" style="position: absolute;width:100%;top: 0px"></div>
				<div id="_defaultColorPalatte"></div>
				<script type="module">${preloadScript}</script>
			</body>
		</html>`;
	}

	private getRendererData(): RendererMetadata[] {
		return this.notebookService.getRenderers().map((renderer): RendererMetadata => {
			const entrypoint = {
				extends: renderer.entrypoint.extends,
				path: this.asWebviewUri(renderer.entrypoint.path, renderer.extensionLocation).toString()
			};
			return {
				id: renderer.id,
				entrypoint,
				mimeTypes: renderer.mimeTypes,
				messaging: renderer.messaging !== RendererMessagingSpec.Never && !!this.rendererMessaging,
				isBuiltin: renderer.isBuiltin
			};
		});
	}

	private getStaticPreloadsData(): StaticPreloadMetadata[] {
		return Array.from(this.notebookService.getStaticPreloads(this.notebookViewType), preload => {
			return { entrypoint: this.asWebviewUri(preload.entrypoint, preload.extensionLocation).toString().toString() };
		});
	}

	private asWebviewUri(uri: URI, fromExtension: URI | undefined) {
		return asWebviewUri(uri, fromExtension?.scheme === Schemas.vscodeRemote ? { isRemote: true, authority: fromExtension.authority } : undefined);
	}

	postKernelMessage(message: any) {
		this._sendMessageToWebview({
			__vscode_notebook_message: true,
			type: 'customKernelMessage',
			message,
		});
	}

	private resolveOutputId(id: string): { cellInfo: T; output: ICellOutputViewModel } | undefined {
		const output = this.reversedInsetMapping.get(id);
		if (!output) {
			return;
		}

		const cellInfo = this.insetMapping.get(output)!.cellInfo;
		return { cellInfo, output };
	}

	isResolved(): this is IResolvedBackLayerWebview {
		return !!this.webview;
	}

	createWebview(targetWindow: CodeWindow): Promise<void> {
		const baseUrl = this.asWebviewUri(this.getNotebookBaseUri(), undefined);
		const htmlContent = this.generateContent(baseUrl.toString());
		return this._initialize(htmlContent, targetWindow);
	}

	private getNotebookBaseUri() {
		if (this.documentUri.scheme === Schemas.untitled) {
			const folder = this.workspaceContextService.getWorkspaceFolder(this.documentUri);
			if (folder) {
				return folder.uri;
			}

			const folders = this.workspaceContextService.getWorkspace().folders;
			if (folders.length) {
				return folders[0].uri;
			}
		}

		return dirname(this.documentUri);
	}

	private getBuiltinLocalResourceRoots(): URI[] {
		// Python notebooks assume that requirejs is a global.
		// For all other notebooks, they need to provide their own loader.
		if (!this.documentUri.path.toLowerCase().endsWith('.ipynb')) {
			return [];
		}

		if (isWeb) {
			return []; // script is inlined
		}

		return [
			dirname(FileAccess.asFileUri('vs/nls.js')),
		];
	}

	private _initialize(content: string, targetWindow: CodeWindow): Promise<void> {
		if (!getWindow(this.element).document.body.contains(this.element)) {
			throw new Error('Element is already detached from the DOM tree');
		}

		this.webview = this._createInset(this.webviewService, content);
		this.webview.mountTo(this.element, targetWindow);
		this._register(this.webview);

		this._register(new WebviewWindowDragMonitor(targetWindow, () => this.webview));

		const initializePromise = new DeferredPromise<void>();

		this._register(this.webview.onFatalError(e => {
			initializePromise.error(new Error(`Could not initialize webview: ${e.message}}`));
		}));

		this._register(this.webview.onMessage(async (message) => {
			const data: FromWebviewMessage | { readonly __vscode_notebook_message: undefined } = message.message;
			if (this._disposed) {
				return;
			}

			if (!data.__vscode_notebook_message) {
				return;
			}

			switch (data.type) {
				case 'initialized': {
					initializePromise.complete();
					this.initializeWebViewState();
					break;
				}
				case 'initializedMarkup': {
					if (this.initializeMarkupPromise?.requestId === data.requestId) {
						this.initializeMarkupPromise?.p.complete();
						this.initializeMarkupPromise = undefined;
					}
					break;
				}
				case 'dimension': {
					for (const update of data.updates) {
						const height = update.height;
						if (update.isOutput) {
							const resolvedResult = this.resolveOutputId(update.id);
							if (resolvedResult) {
								const { cellInfo, output } = resolvedResult;
								this.notebookEditor.updateOutputHeight(cellInfo, output, height, !!update.init, 'webview#dimension');
								this.notebookEditor.scheduleOutputHeightAck(cellInfo, update.id, height);
							} else if (update.init) {
								// might be idle render request's ack
								const outputRequest = this.reversedPendingWebviewIdleInsetMapping.get(update.id);
								if (outputRequest) {
									const inset = this.pendingWebviewIdleInsetMapping.get(outputRequest)!;

									// clear the pending mapping
									this.pendingWebviewIdleCreationRequest.delete(outputRequest);
									this.pendingWebviewIdleCreationRequest.delete(outputRequest);

									const cellInfo = inset.cellInfo;
									this.reversedInsetMapping.set(update.id, outputRequest);
									this.insetMapping.set(outputRequest, inset);
									this.notebookEditor.updateOutputHeight(cellInfo, outputRequest, height, !!update.init, 'webview#dimension');
									this.notebookEditor.scheduleOutputHeightAck(cellInfo, update.id, height);

								}

								this.reversedPendingWebviewIdleInsetMapping.delete(update.id);
							}

							{
								if (!update.init) {
									continue;
								}

								const output = this.reversedInsetMapping.get(update.id);

								if (!output) {
									continue;
								}

								const inset = this.insetMapping.get(output)!;
								inset.initialized = true;
							}
						} else {
							this.notebookEditor.updateMarkupCellHeight(update.id, height, !!update.init);
						}
					}
					break;
				}
				case 'mouseenter': {
					const resolvedResult = this.resolveOutputId(data.id);
					if (resolvedResult) {
						const latestCell = this.notebookEditor.getCellByInfo(resolvedResult.cellInfo);
						if (latestCell) {
							latestCell.outputIsHovered = true;
						}
					}
					break;
				}
				case 'mouseleave': {
					const resolvedResult = this.resolveOutputId(data.id);
					if (resolvedResult) {
						const latestCell = this.notebookEditor.getCellByInfo(resolvedResult.cellInfo);
						if (latestCell) {
							latestCell.outputIsHovered = false;
						}
					}
					break;
				}
				case 'outputFocus': {
					const resolvedResult = this.resolveOutputId(data.id);
					if (resolvedResult) {
						const latestCell = this.notebookEditor.getCellByInfo(resolvedResult.cellInfo);
						if (latestCell) {
							latestCell.outputIsFocused = true;
							this.notebookEditor.focusNotebookCell(latestCell, 'output', { outputId: resolvedResult.output.model.outputId, skipReveal: true, outputWebviewFocused: true });
						}
					}
					break;
				}
				case 'outputBlur': {
					const resolvedResult = this.resolveOutputId(data.id);
					if (resolvedResult) {
						const latestCell = this.notebookEditor.getCellByInfo(resolvedResult.cellInfo);
						if (latestCell) {
							latestCell.outputIsFocused = false;
							latestCell.inputInOutputIsFocused = false;
						}
					}
					break;
				}
				case 'scroll-ack': {
					// const date = new Date();
					// const top = data.data.top;
					// console.log('ack top ', top, ' version: ', data.version, ' - ', date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds());
					break;
				}
				case 'scroll-to-reveal': {
					this.notebookEditor.setScrollTop(data.scrollTop - NOTEBOOK_WEBVIEW_BOUNDARY);
					break;
				}
				case 'did-scroll-wheel': {
					this.notebookEditor.triggerScroll({
						...data.payload,
						preventDefault: () => { },
						stopPropagation: () => { }
					});
					break;
				}
				case 'focus-editor': {
					const cell = this.notebookEditor.getCellById(data.cellId);
					if (cell) {
						if (data.focusNext) {
							this.notebookEditor.focusNextNotebookCell(cell, 'editor');
						} else {
							await this.notebookEditor.focusNotebookCell(cell, 'editor');
						}
					}
					break;
				}
				case 'clicked-data-url': {
					this._onDidClickDataLink(data);
					break;
				}
				case 'clicked-link': {
					if (matchesScheme(data.href, Schemas.command)) {
						const uri = URI.parse(data.href);

						if (uri.path === 'workbench.action.openLargeOutput') {
							const outputId = uri.query;
							const group = this.editorGroupService.activeGroup;
							if (group) {
								if (group.activeEditor) {
									group.pinEditor(group.activeEditor);
								}
							}

							this.openerService.open(CellUri.generateCellOutputUriWithId(this.documentUri, outputId));
							return;
						}
						if (uri.path === 'cellOutput.enableScrolling') {
							const outputId = uri.query;
							const cell = this.reversedInsetMapping.get(outputId);

							if (cell) {
								this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>
									('workbenchActionExecuted', { id: 'notebook.cell.toggleOutputScrolling', from: 'inlineLink' });

								cell.cellViewModel.outputsViewModels.forEach((vm) => {
									if (vm.model.metadata) {
										vm.model.metadata['scrollable'] = true;
										vm.resetRenderer();
									}
								});
							}

							return;
						}

						// We allow a very limited set of commands
						this.openerService.open(data.href, {
							fromUserGesture: true,
							fromWorkspace: true,
							allowCommands: [
								'github-issues.authNow',
								'workbench.extensions.search',
								'workbench.action.openSettings',
								'_notebook.selectKernel',
								// TODO@rebornix explore open output channel with name command
								'jupyter.viewOutput',
								'jupyter.createPythonEnvAndSelectController',
							],
						});
						return;
					}

					if (matchesSomeScheme(data.href, Schemas.http, Schemas.https, Schemas.mailto)) {
						this.openerService.open(data.href, { fromUserGesture: true, fromWorkspace: true });
					} else if (matchesScheme(data.href, Schemas.vscodeNotebookCell)) {
						const uri = URI.parse(data.href);
						await this._handleNotebookCellResource(uri);
					} else if (!/^[\w\-]+:/.test(data.href)) {
						// Uri without scheme, such as a file path
						await this._handleResourceOpening(tryDecodeURIComponent(data.href));
					} else {
						// uri with scheme
						if (osPath.isAbsolute(data.href)) {
							this._openUri(URI.file(data.href));
						} else {
							this._openUri(URI.parse(data.href));
						}
					}
					break;
				}
				case 'customKernelMessage': {
					this._onMessage.fire({ message: data.message });
					break;
				}
				case 'customRendererMessage': {
					this.rendererMessaging?.postMessage(data.rendererId, data.message);
					break;
				}
				case 'clickMarkupCell': {
					const cell = this.notebookEditor.getCellById(data.cellId);
					if (cell) {
						if (data.shiftKey || (isMacintosh ? data.metaKey : data.ctrlKey)) {
							// Modify selection
							this.notebookEditor.toggleNotebookCellSelection(cell, /* fromPrevious */ data.shiftKey);
						} else {
							// Normal click
							await this.notebookEditor.focusNotebookCell(cell, 'container', { skipReveal: true });
						}
					}
					break;
				}
				case 'contextMenuMarkupCell': {
					const cell = this.notebookEditor.getCellById(data.cellId);
					if (cell) {
						// Focus the cell first
						await this.notebookEditor.focusNotebookCell(cell, 'container', { skipReveal: true });

						// Then show the context menu
						const webviewRect = this.element.getBoundingClientRect();
						this.contextMenuService.showContextMenu({
							menuId: MenuId.NotebookCellTitle,
							contextKeyService: this.contextKeyService,
							getAnchor: () => ({
								x: webviewRect.x + data.clientX,
								y: webviewRect.y + data.clientY
							})
						});
					}
					break;
				}
				case 'toggleMarkupPreview': {
					const cell = this.notebookEditor.getCellById(data.cellId);
					if (cell && !this.notebookEditor.creationOptions.isReadOnly) {
						this.notebookEditor.setMarkupCellEditState(data.cellId, CellEditState.Editing);
						await this.notebookEditor.focusNotebookCell(cell, 'editor', { skipReveal: true });
					}
					break;
				}
				case 'mouseEnterMarkupCell': {
					const cell = this.notebookEditor.getCellById(data.cellId);
					if (cell instanceof MarkupCellViewModel) {
						cell.cellIsHovered = true;
					}
					break;
				}
				case 'mouseLeaveMarkupCell': {
					const cell = this.notebookEditor.getCellById(data.cellId);
					if (cell instanceof MarkupCellViewModel) {
						cell.cellIsHovered = false;
					}
					break;
				}
				case 'cell-drag-start': {
					this.notebookEditor.didStartDragMarkupCell(data.cellId, data);
					break;
				}
				case 'cell-drag': {
					this.notebookEditor.didDragMarkupCell(data.cellId, data);
					break;
				}
				case 'cell-drop': {
					this.notebookEditor.didDropMarkupCell(data.cellId, {
						dragOffsetY: data.dragOffsetY,
						ctrlKey: data.ctrlKey,
						altKey: data.altKey,
					});
					break;
				}
				case 'cell-drag-end': {
					this.notebookEditor.didEndDragMarkupCell(data.cellId);
					break;
				}
				case 'renderedMarkup': {
					const cell = this.notebookEditor.getCellById(data.cellId);
					if (cell instanceof MarkupCellViewModel) {
						cell.renderedHtml = data.html;
					}

					this._handleHighlightCodeBlock(data.codeBlocks);
					break;
				}
				case 'renderedCellOutput': {
					this._handleHighlightCodeBlock(data.codeBlocks);
					break;
				}
				case 'outputResized': {
					this.notebookEditor.didResizeOutput(data.cellId);
					break;
				}
				case 'getOutputItem': {
					const resolvedResult = this.resolveOutputId(data.outputId);
					const output = resolvedResult?.output.model.outputs.find(output => output.mime === data.mime);

					this._sendMessageToWebview({
						type: 'returnOutputItem',
						requestId: data.requestId,
						output: output ? { mime: output.mime, valueBytes: output.data.buffer } : undefined,
					});
					break;
				}
				case 'logRendererDebugMessage': {
					this._logRendererDebugMessage(`${data.message}${data.data ? ' ' + JSON.stringify(data.data, null, 4) : ''}`);
					break;
				}
				case 'notebookPerformanceMessage': {
					this.notebookEditor.updatePerformanceMetadata(data.cellId, data.executionId, data.duration, data.rendererId);
					if (data.outputSize && data.rendererId === 'vscode.builtin-renderer') {
						this._sendPerformanceData(data.outputSize, data.duration);
					}
					break;
				}
				case 'outputInputFocus': {
					const resolvedResult = this.resolveOutputId(data.id);
					if (resolvedResult) {
						const latestCell = this.notebookEditor.getCellByInfo(resolvedResult.cellInfo);
						if (latestCell) {
							latestCell.inputInOutputIsFocused = data.inputFocused;
						}
					}
					this.notebookEditor.didFocusOutputInputChange(data.inputFocused);
				}
			}
		}));

		return initializePromise.p;
	}

	private _sendPerformanceData(outputSize: number, renderTime: number) {
		type NotebookOutputRenderClassification = {
			owner: 'amunger';
			comment: 'Track performance data for output rendering';
			outputSize: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Size of the output data buffer.'; isMeasurement: true };
			renderTime: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Time spent rendering output.'; isMeasurement: true };
		};

		type NotebookOutputRenderEvent = {
			outputSize: number;
			renderTime: number;
		};

		const telemetryData = {
			outputSize,
			renderTime
		};

		this.telemetryService.publicLog2<NotebookOutputRenderEvent, NotebookOutputRenderClassification>('NotebookCellOutputRender', telemetryData);
	}

	private _handleNotebookCellResource(uri: URI) {
		const notebookResource = uri.path.length > 0 ? uri : this.documentUri;

		const lineMatch = /(?:^|&)line=([^&]+)/.exec(uri.query);
		let editorOptions: ITextEditorOptions | undefined = undefined;
		if (lineMatch) {
			const parsedLineNumber = parseInt(lineMatch[1], 10);
			if (!isNaN(parsedLineNumber)) {
				const lineNumber = parsedLineNumber;

				editorOptions = {
					selection: { startLineNumber: lineNumber, startColumn: 1 }
				};
			}
		}

		const executionMatch = /(?:^|&)execution_count=([^&]+)/.exec(uri.query);
		if (executionMatch) {
			const executionCount = parseInt(executionMatch[1], 10);
			if (!isNaN(executionCount)) {
				const notebookModel = this.notebookService.getNotebookTextModel(notebookResource);
				// multiple cells with the same execution count can exist if the kernel is restarted
				// so look for the most recently added cell with the matching execution count.
				// Somewhat more likely to be correct in notebooks, an much more likely for the interactive window
				const cell = notebookModel?.cells.slice().reverse().find(cell => {
					return cell.internalMetadata.executionOrder === executionCount;
				});
				if (cell?.uri) {
					return this.openerService.open(cell.uri, {
						fromUserGesture: true,
						fromWorkspace: true,
						editorOptions: editorOptions
					});
				}
			}
		}

		// URLs built by the jupyter extension put the line query param in the fragment
		// They also have the cell fragment pre-calculated
		const fragmentLineMatch = /\?line=(\d+)$/.exec(uri.fragment);
		if (fragmentLineMatch) {
			const parsedLineNumber = parseInt(fragmentLineMatch[1], 10);
			if (!isNaN(parsedLineNumber)) {
				const lineNumber = parsedLineNumber + 1;
				const fragment = uri.fragment.substring(0, fragmentLineMatch.index);

				// open the uri with selection
				const editorOptions: ITextEditorOptions = {
					selection: { startLineNumber: lineNumber, startColumn: 1, endLineNumber: lineNumber, endColumn: 1 }
				};

				return this.openerService.open(notebookResource.with({ fragment }), {
					fromUserGesture: true,
					fromWorkspace: true,
					editorOptions: editorOptions
				});
			}
		}

		return this.openerService.open(notebookResource, { fromUserGesture: true, fromWorkspace: true });
	}

	private async _handleResourceOpening(href: string) {
		let linkToOpen: URI | undefined = undefined;
		let fragment: string | undefined = undefined;

		// Separate out the fragment so that the subsequent calls
		// to URI.joinPath() don't URL encode it. This allows opening
		// links with both paths and fragments.
		const hrefWithFragment = FRAGMENT_REGEX.exec(href);
		if (hrefWithFragment) {
			href = hrefWithFragment[1];
			fragment = hrefWithFragment[2];
		}

		if (href.startsWith('/')) {
			linkToOpen = await this.pathService.fileURI(href);
			const folders = this.workspaceContextService.getWorkspace().folders;
			if (folders.length) {
				linkToOpen = linkToOpen.with({
					scheme: folders[0].uri.scheme,
					authority: folders[0].uri.authority
				});
			}
		} else if (href.startsWith('~')) {
			const userHome = await this.pathService.userHome();
			if (userHome) {
				linkToOpen = URI.joinPath(userHome, href.substring(2));
			}
		} else {
			if (this.documentUri.scheme === Schemas.untitled) {
				const folders = this.workspaceContextService.getWorkspace().folders;
				if (!folders.length) {
					return;
				}
				linkToOpen = URI.joinPath(folders[0].uri, href);
			} else {
				// Resolve relative to notebook document
				linkToOpen = URI.joinPath(dirname(this.documentUri), href);
			}
		}

		if (linkToOpen) {
			// Re-attach fragment now that we have the full file path.
			if (fragment) {
				linkToOpen = linkToOpen.with({ fragment });
			}
			this._openUri(linkToOpen);
		}
	}

	private _openUri(uri: URI) {
		let lineNumber: number | undefined = undefined;
		let column: number | undefined = undefined;
		const lineCol = LINE_COLUMN_REGEX.exec(uri.path);
		if (lineCol) {
			uri = uri.with({
				path: uri.path.slice(0, lineCol.index),
				fragment: `L${lineCol[0].slice(1)}`
			});
			lineNumber = parseInt(lineCol[1], 10);
			column = parseInt(lineCol[2], 10);
		}

		//#region error renderer migration, remove once done
		const lineMatch = LineQueryRegex.exec(uri.query);
		if (lineMatch) {
			const parsedLineNumber = parseInt(lineMatch[1], 10);
			if (!isNaN(parsedLineNumber)) {
				lineNumber = parsedLineNumber + 1;
				column = 1;
				uri = uri.with({ fragment: `L${lineNumber}` });
			}
		}

		uri = uri.with({
			query: null
		});
		//#endregion

		let match: { group: IEditorGroup; editor: EditorInput } | undefined = undefined;

		for (const group of this.editorGroupService.groups) {
			const editorInput = group.editors.find(editor => editor.resource && isEqual(editor.resource, uri, true));
			if (editorInput) {
				match = { group, editor: editorInput };
				break;
			}
		}

		if (match) {
			const selection: ITextEditorSelection | undefined = lineNumber !== undefined && column !== undefined ? { startLineNumber: lineNumber, startColumn: column } : undefined;
			const textEditorOptions: ITextEditorOptions = { selection: selection };
			match.group.openEditor(match.editor, selection ? textEditorOptions : undefined);
		} else {
			this.openerService.open(uri, { fromUserGesture: true, fromWorkspace: true });
		}
	}

	private _handleHighlightCodeBlock(codeBlocks: ReadonlyArray<ICodeBlockHighlightRequest>) {
		for (const { id, value, lang } of codeBlocks) {
			// The language id may be a language aliases (e.g.js instead of javascript)
			const languageId = this.languageService.getLanguageIdByLanguageName(lang);
			if (!languageId) {
				continue;
			}

			tokenizeToString(this.languageService, value, languageId).then((html) => {
				if (this._disposed) {
					return;
				}
				this._sendMessageToWebview({
					type: 'tokenizedCodeBlock',
					html,
					codeBlockId: id
				});
			});
		}
	}
	private async _onDidClickDataLink(event: IClickedDataUrlMessage): Promise<void> {
		if (typeof event.data !== 'string') {
			return;
		}

		const [splitStart, splitData] = event.data.split(';base64,');
		if (!splitData || !splitStart) {
			return;
		}

		const defaultDir = extname(this.documentUri) === '.interactive' ?
			this.workspaceContextService.getWorkspace().folders[0]?.uri ?? await this.fileDialogService.defaultFilePath() :
			dirname(this.documentUri);
		let defaultName: string;
		if (event.downloadName) {
			defaultName = event.downloadName;
		} else {
			const mimeType = splitStart.replace(/^data:/, '');
			const candidateExtension = mimeType && getExtensionForMimeType(mimeType);
			defaultName = candidateExtension ? `download${candidateExtension}` : 'download';
		}

		const defaultUri = joinPath(defaultDir, defaultName);
		const newFileUri = await this.fileDialogService.showSaveDialog({
			defaultUri
		});
		if (!newFileUri) {
			return;
		}

		const buff = decodeBase64(splitData);
		await this.fileService.writeFile(newFileUri, buff);
		await this.openerService.open(newFileUri);
	}

	private _createInset(webviewService: IWebviewService, content: string) {
		this.localResourceRootsCache = this._getResourceRootsCache();
		const webview = webviewService.createWebviewElement({
			origin: BackLayerWebView.getOriginStore(this.storageService).getOrigin(this.notebookViewType, undefined),
			title: nls.localize('webview title', "Notebook webview content"),
			options: {
				purpose: WebviewContentPurpose.NotebookRenderer,
				enableFindWidget: false,
				transformCssVariables: transformWebviewThemeVars,
			},
			contentOptions: {
				allowMultipleAPIAcquire: true,
				allowScripts: true,
				localResourceRoots: this.localResourceRootsCache,
			},
			extension: undefined,
			providedViewType: 'notebook.output'
		});

		webview.setHtml(content);
		webview.setContextKeyService(this.contextKeyService);
		return webview;
	}

	private _getResourceRootsCache(): URI[] {
		const workspaceFolders = this.contextService.getWorkspace().folders.map(x => x.uri);
		const notebookDir = this.getNotebookBaseUri();
		return [
			this.notebookService.getNotebookProviderResourceRoots(),
			this.notebookService.getRenderers().map(x => dirname(x.entrypoint.path)),
			...Array.from(this.notebookService.getStaticPreloads(this.notebookViewType), x => [
				dirname(x.entrypoint),
				...x.localResourceRoots,
			]),
			workspaceFolders,
			notebookDir,
			this.getBuiltinLocalResourceRoots()
		].flat();
	}

	private initializeWebViewState() {
		this._preloadsCache.clear();
		if (this._currentKernel) {
			this._updatePreloadsFromKernel(this._currentKernel);
		}

		for (const [output, inset] of this.insetMapping.entries()) {
			this._sendMessageToWebview({ ...inset.cachedCreation, initiallyHidden: this.hiddenInsetMapping.has(output) });
		}

		if (this.initializeMarkupPromise?.isFirstInit) {
			// On first run the contents have already been initialized so we don't need to init them again
			// no op
		} else {
			const mdCells = [...this.markupPreviewMapping.values()];
			this.markupPreviewMapping.clear();
			this.initializeMarkup(mdCells);
		}

		this._updateStyles();
		this._updateOptions();
	}

	private shouldUpdateInset(cell: IGenericCellViewModel, output: ICellOutputViewModel, cellTop: number, outputOffset: number): boolean {
		if (this._disposed) {
			return false;
		}

		if ('isOutputCollapsed' in cell && (cell as ICellViewModel).isOutputCollapsed) {
			return false;
		}

		if (this.hiddenInsetMapping.has(output)) {
			return true;
		}

		const outputCache = this.insetMapping.get(output);
		if (!outputCache) {
			return false;
		}

		if (outputOffset === outputCache.cachedCreation.outputOffset && cellTop === outputCache.cachedCreation.cellTop) {
			return false;
		}

		return true;
	}

	ackHeight(updates: readonly IAckOutputHeight[]): void {
		this._sendMessageToWebview({
			type: 'ack-dimension',
			updates
		});
	}

	updateScrollTops(outputRequests: IDisplayOutputLayoutUpdateRequest[], markupPreviews: { id: string; top: number }[]) {
		if (this._disposed) {
			return;
		}

		const widgets = coalesce(outputRequests.map((request): IContentWidgetTopRequest | undefined => {
			const outputCache = this.insetMapping.get(request.output);
			if (!outputCache) {
				return;
			}

			if (!request.forceDisplay && !this.shouldUpdateInset(request.cell, request.output, request.cellTop, request.outputOffset)) {
				return;
			}

			const id = outputCache.outputId;
			outputCache.cachedCreation.cellTop = request.cellTop;
			outputCache.cachedCreation.outputOffset = request.outputOffset;
			this.hiddenInsetMapping.delete(request.output);

			return {
				cellId: request.cell.id,
				outputId: id,
				cellTop: request.cellTop,
				outputOffset: request.outputOffset,
				forceDisplay: request.forceDisplay,
			};
		}));

		if (!widgets.length && !markupPreviews.length) {
			return;
		}

		this._sendMessageToWebview({
			type: 'view-scroll',
			widgets: widgets,
			markupCells: markupPreviews,
		});
	}

	private async createMarkupPreview(initialization: IMarkupCellInitialization) {
		if (this._disposed) {
			return;
		}

		if (this.markupPreviewMapping.has(initialization.cellId)) {
			console.error('Trying to create markup preview that already exists');
			return;
		}

		this.markupPreviewMapping.set(initialization.cellId, initialization);
		this._sendMessageToWebview({
			type: 'createMarkupCell',
			cell: initialization
		});
	}

	async showMarkupPreview(newContent: IMarkupCellInitialization) {
		if (this._disposed) {
			return;
		}

		const entry = this.markupPreviewMapping.get(newContent.cellId);
		if (!entry) {
			return this.createMarkupPreview(newContent);
		}

		const sameContent = newContent.content === entry.content;
		const sameMetadata = (equals(newContent.metadata, entry.metadata));
		if (!sameContent || !sameMetadata || !entry.visible) {
			this._sendMessageToWebview({
				type: 'showMarkupCell',
				id: newContent.cellId,
				handle: newContent.cellHandle,
				// If the content has not changed, we still want to make sure the
				// preview is visible but don't need to send anything over
				content: sameContent ? undefined : newContent.content,
				top: newContent.offset,
				metadata: sameMetadata ? undefined : newContent.metadata
			});
		}
		entry.metadata = newContent.metadata;
		entry.content = newContent.content;
		entry.offset = newContent.offset;
		entry.visible = true;
	}

	async hideMarkupPreviews(cellIds: readonly string[]) {
		if (this._disposed) {
			return;
		}

		const cellsToHide: string[] = [];
		for (const cellId of cellIds) {
			const entry = this.markupPreviewMapping.get(cellId);
			if (entry) {
				if (entry.visible) {
					cellsToHide.push(cellId);
					entry.visible = false;
				}
			}
		}

		if (cellsToHide.length) {
			this._sendMessageToWebview({
				type: 'hideMarkupCells',
				ids: cellsToHide
			});
		}
	}

	async unhideMarkupPreviews(cellIds: readonly string[]) {
		if (this._disposed) {
			return;
		}

		const toUnhide: string[] = [];
		for (const cellId of cellIds) {
			const entry = this.markupPreviewMapping.get(cellId);
			if (entry) {
				if (!entry.visible) {
					entry.visible = true;
					toUnhide.push(cellId);
				}
			} else {
				console.error(`Trying to unhide a preview that does not exist: ${cellId}`);
			}
		}

		this._sendMessageToWebview({
			type: 'unhideMarkupCells',
			ids: toUnhide,
		});
	}

	async deleteMarkupPreviews(cellIds: readonly string[]) {
		if (this._disposed) {
			return;
		}

		for (const id of cellIds) {
			if (!this.markupPreviewMapping.has(id)) {
				console.error(`Trying to delete a preview that does not exist: ${id}`);
			}
			this.markupPreviewMapping.delete(id);
		}

		if (cellIds.length) {
			this._sendMessageToWebview({
				type: 'deleteMarkupCell',
				ids: cellIds
			});
		}
	}

	async updateMarkupPreviewSelections(selectedCellsIds: string[]) {
		if (this._disposed) {
			return;
		}

		this._sendMessageToWebview({
			type: 'updateSelectedMarkupCells',
			selectedCellIds: selectedCellsIds.filter(id => this.markupPreviewMapping.has(id)),
		});
	}

	async initializeMarkup(cells: readonly IMarkupCellInitialization[]): Promise<void> {
		if (this._disposed) {
			return;
		}

		this.initializeMarkupPromise?.p.complete();
		const requestId = UUID.generateUuid();
		this.initializeMarkupPromise = { p: new DeferredPromise(), requestId, isFirstInit: this.firstInit };

		this.firstInit = false;

		for (const cell of cells) {
			this.markupPreviewMapping.set(cell.cellId, cell);
		}

		this._sendMessageToWebview({
			type: 'initializeMarkup',
			cells,
			requestId,
		});

		return this.initializeMarkupPromise.p.p;
	}

	/**
	 * Validate if cached inset is out of date and require a rerender
	 * Note that it doesn't account for output content change.
	 */
	private _cachedInsetEqual(cachedInset: ICachedInset<T>, content: IInsetRenderOutput) {
		if (content.type === RenderOutputType.Extension) {
			// Use a new renderer
			return cachedInset.renderer?.id === content.renderer.id;
		} else {
			// The new renderer is the default HTML renderer
			return cachedInset.cachedCreation.type === 'html';
		}
	}

	requestCreateOutputWhenWebviewIdle(cellInfo: T, content: IInsetRenderOutput, cellTop: number, offset: number) {
		if (this._disposed) {
			return;
		}

		if (this.insetMapping.has(content.source)) {
			return;
		}

		if (this.pendingWebviewIdleCreationRequest.has(content.source)) {
			return;
		}

		if (this.pendingWebviewIdleInsetMapping.has(content.source)) {
			// handled in renderer process, waiting for webview to process it when idle
			return;
		}

		this.pendingWebviewIdleCreationRequest.set(content.source, runWhenGlobalIdle(() => {
			const { message, renderer, transfer: transferable } = this._createOutputCreationMessage(cellInfo, content, cellTop, offset, true, true);
			this._sendMessageToWebview(message, transferable);
			this.pendingWebviewIdleInsetMapping.set(content.source, { outputId: message.outputId, versionId: content.source.model.versionId, cellInfo: cellInfo, renderer, cachedCreation: message });
			this.reversedPendingWebviewIdleInsetMapping.set(message.outputId, content.source);
			this.pendingWebviewIdleCreationRequest.delete(content.source);
		}));
	}

	createOutput(cellInfo: T, content: IInsetRenderOutput, cellTop: number, offset: number): void {
		if (this._disposed) {
			return;
		}

		const cachedInset = this.insetMapping.get(content.source);

		// we now request to render the output immediately, so we can remove the pending request
		// dispose the pending request in renderer process if it exists
		this.pendingWebviewIdleCreationRequest.get(content.source)?.dispose();
		this.pendingWebviewIdleCreationRequest.delete(content.source);

		// if request has already been sent out, we then remove it from the pending mapping
		this.pendingWebviewIdleInsetMapping.delete(content.source);
		if (cachedInset) {
			this.reversedPendingWebviewIdleInsetMapping.delete(cachedInset.outputId);
		}

		if (cachedInset && this._cachedInsetEqual(cachedInset, content)) {
			this.hiddenInsetMapping.delete(content.source);
			this._sendMessageToWebview({
				type: 'showOutput',
				cellId: cachedInset.cellInfo.cellId,
				outputId: cachedInset.outputId,
				cellTop: cellTop,
				outputOffset: offset
			});
			return;
		}

		// create new output
		const { message, renderer, transfer: transferable } = this._createOutputCreationMessage(cellInfo, content, cellTop, offset, false, false);
		this._sendMessageToWebview(message, transferable);
		this.insetMapping.set(content.source, { outputId: message.outputId, versionId: content.source.model.versionId, cellInfo: cellInfo, renderer, cachedCreation: message });
		this.hiddenInsetMapping.delete(content.source);
		this.reversedInsetMapping.set(message.outputId, content.source);
	}

	private createMetadata(output: ICellOutput, mimeType: string) {
		if (mimeType.startsWith('image')) {
			const buffer = output.outputs.find(out => out.mime === 'text/plain')?.data.buffer;
			if (buffer?.length && buffer?.length > 0) {
				const altText = new TextDecoder().decode(buffer);
				return { ...output.metadata, vscode_altText: altText };
			}
		}
		return output.metadata;
	}

	private _createOutputCreationMessage(cellInfo: T, content: IInsetRenderOutput, cellTop: number, offset: number, createOnIdle: boolean, initiallyHidden: boolean): { readonly message: ICreationRequestMessage; readonly renderer: INotebookRendererInfo | undefined; transfer: readonly ArrayBuffer[] } {
		const messageBase = {
			type: 'html',
			executionId: cellInfo.executionId,
			cellId: cellInfo.cellId,
			cellTop: cellTop,
			outputOffset: offset,
			left: 0,
			requiredPreloads: [],
			createOnIdle: createOnIdle
		} as const;

		const transfer: ArrayBuffer[] = [];

		let message: ICreationRequestMessage;
		let renderer: INotebookRendererInfo | undefined;
		if (content.type === RenderOutputType.Extension) {
			const output = content.source.model;
			renderer = content.renderer;
			const first = output.outputs.find(op => op.mime === content.mimeType)!;
			const metadata = this.createMetadata(output, content.mimeType);
			const valueBytes = copyBufferIfNeeded(first.data.buffer, transfer);
			message = {
				...messageBase,
				outputId: output.outputId,
				rendererId: content.renderer.id,
				content: {
					type: RenderOutputType.Extension,
					outputId: output.outputId,
					metadata: metadata,
					output: {
						mime: first.mime,
						valueBytes,
					},
					allOutputs: output.outputs.map(output => ({ mime: output.mime })),
				},
				initiallyHidden: initiallyHidden
			};
		} else {
			message = {
				...messageBase,
				outputId: UUID.generateUuid(),
				content: {
					type: content.type,
					htmlContent: content.htmlContent,
				},
				initiallyHidden: initiallyHidden
			};
		}

		return {
			message,
			renderer,
			transfer,
		};
	}

	updateOutput(cellInfo: T, content: IInsetRenderOutput, cellTop: number, offset: number): void {
		if (this._disposed) {
			return;
		}

		if (!this.insetMapping.has(content.source)) {
			this.createOutput(cellInfo, content, cellTop, offset);
			return;
		}

		const outputCache = this.insetMapping.get(content.source)!;

		if (outputCache.versionId === content.source.model.versionId) {
			// already sent this output version to the renderer
			return;
		}

		this.hiddenInsetMapping.delete(content.source);
		let updatedContent: ICreationContent | undefined = undefined;

		const transfer: ArrayBuffer[] = [];
		if (content.type === RenderOutputType.Extension) {
			const output = content.source.model;
			const firstBuffer = output.outputs.find(op => op.mime === content.mimeType)!;
			const appenededData = output.appendedSinceVersion(outputCache.versionId, content.mimeType);
			const appended = appenededData ? { valueBytes: appenededData.buffer, previousVersion: outputCache.versionId } : undefined;

			const valueBytes = copyBufferIfNeeded(firstBuffer.data.buffer, transfer);
			updatedContent = {
				type: RenderOutputType.Extension,
				outputId: outputCache.outputId,
				metadata: output.metadata,
				output: {
					mime: content.mimeType,
					valueBytes,
					appended: appended
				},
				allOutputs: output.outputs.map(output => ({ mime: output.mime }))
			};
		}

		this._sendMessageToWebview({
			type: 'showOutput',
			cellId: outputCache.cellInfo.cellId,
			outputId: outputCache.outputId,
			cellTop: cellTop,
			outputOffset: offset,
			content: updatedContent
		}, transfer);

		outputCache.versionId = content.source.model.versionId;
		return;
	}

	async copyImage(output: ICellOutputViewModel): Promise<void> {
		// Collect text alternates from the same cell output
		const textAlternates: { mimeType: string; content: string }[] = [];
		const cellOutput = output.model;

		for (const outputItem of cellOutput.outputs) {
			if (TEXT_BASED_MIMETYPES.includes(outputItem.mime)) {
				const text = isTextStreamMime(outputItem.mime) ?
					getOutputStreamText(output).text :
					getOutputText(outputItem.mime, outputItem);
				textAlternates.push({
					mimeType: outputItem.mime,
					content: text
				});
			}
		}

		this._sendMessageToWebview({
			type: 'copyImage',
			outputId: output.model.outputId,
			altOutputId: output.model.alternativeOutputId,
			textAlternates: textAlternates.length > 0 ? textAlternates : undefined
		});
	}

	removeInsets(outputs: readonly ICellOutputViewModel[]): void {
		if (this._disposed) {
			return;
		}

		for (const output of outputs) {
			const outputCache = this.insetMapping.get(output);
			if (!outputCache) {
				continue;
			}

			const id = outputCache.outputId;

			this._sendMessageToWebview({
				type: 'clearOutput',
				rendererId: outputCache.cachedCreation.rendererId,
				cellUri: outputCache.cellInfo.cellUri.toString(),
				outputId: id,
				cellId: outputCache.cellInfo.cellId
			});
			this.insetMapping.delete(output);
			this.pendingWebviewIdleCreationRequest.get(output)?.dispose();
			this.pendingWebviewIdleCreationRequest.delete(output);
			this.pendingWebviewIdleInsetMapping.delete(output);
			this.reversedPendingWebviewIdleInsetMapping.delete(id);
			this.reversedInsetMapping.delete(id);
		}
	}

	hideInset(output: ICellOutputViewModel): void {
		if (this._disposed) {
			return;
		}

		const outputCache = this.insetMapping.get(output);
		if (!outputCache) {
			return;
		}

		this.hiddenInsetMapping.add(output);

		this._sendMessageToWebview({
			type: 'hideOutput',
			outputId: outputCache.outputId,
			cellId: outputCache.cellInfo.cellId,
		});
	}

	focusWebview() {
		if (this._disposed) {
			return;
		}

		this.webview?.focus();
	}

	selectOutputContents(cell: ICellViewModel) {
		if (this._disposed) {
			return;
		}
		const output = cell.outputsViewModels.find(o => o.model.outputId === cell.focusedOutputId);
		const outputId = output ? this.insetMapping.get(output)?.outputId : undefined;
		this._sendMessageToWebview({
			type: 'select-output-contents',
			cellOrOutputId: outputId || cell.id
		});
	}

	selectInputContents(cell: ICellViewModel) {
		if (this._disposed) {
			return;
		}
		const output = cell.outputsViewModels.find(o => o.model.outputId === cell.focusedOutputId);
		const outputId = output ? this.insetMapping.get(output)?.outputId : undefined;
		this._sendMessageToWebview({
			type: 'select-input-contents',
			cellOrOutputId: outputId || cell.id
		});
	}

	focusOutput(cellOrOutputId: string, alternateId: string | undefined, viewFocused: boolean) {
		if (this._disposed) {
			return;
		}

		if (!viewFocused) {
			this.webview?.focus();
		}

		this._sendMessageToWebview({
			type: 'focus-output',
			cellOrOutputId: cellOrOutputId,
			alternateId: alternateId
		});
	}

	blurOutput() {
		if (this._disposed) {
			return;
		}

		this._sendMessageToWebview({
			type: 'blur-output'
		});
	}

	async find(query: string, options: { wholeWord?: boolean; caseSensitive?: boolean; includeMarkup: boolean; includeOutput: boolean; shouldGetSearchPreviewInfo: boolean; ownerID: string; findIds: string[] }): Promise<IFindMatch[]> {
		if (query === '') {
			this._sendMessageToWebview({
				type: 'findStop',
				ownerID: options.ownerID
			});
			return [];
		}

		const p = new Promise<IFindMatch[]>(resolve => {
			const sub = this.webview?.onMessage(e => {
				if (e.message.type === 'didFind') {
					resolve(e.message.matches);
					sub?.dispose();
				}
			});
		});

		this._sendMessageToWebview({
			type: 'find',
			query: query,
			options
		});

		const ret = await p;
		return ret;
	}

	findStop(ownerID: string) {
		this._sendMessageToWebview({
			type: 'findStop',
			ownerID
		});
	}

	async findHighlightCurrent(index: number, ownerID: string): Promise<number> {
		const p = new Promise<number>(resolve => {
			const sub = this.webview?.onMessage(e => {
				if (e.message.type === 'didFindHighlightCurrent') {
					resolve(e.message.offset);
					sub?.dispose();
				}
			});
		});

		this._sendMessageToWebview({
			type: 'findHighlightCurrent',
			index,
			ownerID
		});

		const ret = await p;
		return ret;
	}

	async findUnHighlightCurrent(index: number, ownerID: string): Promise<void> {
		this._sendMessageToWebview({
			type: 'findUnHighlightCurrent',
			index,
			ownerID
		});
	}


	deltaCellOutputContainerClassNames(cellId: string, added: string[], removed: string[]) {
		this._sendMessageToWebview({
			type: 'decorations',
			cellId,
			addedClassNames: added,
			removedClassNames: removed
		});
	}

	deltaMarkupPreviewClassNames(cellId: string, added: string[], removed: string[]) {
		if (this.markupPreviewMapping.get(cellId)) {
			this._sendMessageToWebview({
				type: 'markupDecorations',
				cellId,
				addedClassNames: added,
				removedClassNames: removed
			});
		}
	}

	updateOutputRenderers() {
		if (!this.webview) {
			return;
		}

		const renderersData = this.getRendererData();
		this.localResourceRootsCache = this._getResourceRootsCache();
		const mixedResourceRoots = [
			...(this.localResourceRootsCache || []),
			...(this._currentKernel ? [this._currentKernel.localResourceRoot] : []),
		];

		this.webview.localResourcesRoot = mixedResourceRoots;
		this._sendMessageToWebview({
			type: 'updateRenderers',
			rendererData: renderersData
		});
	}

	async updateKernelPreloads(kernel: INotebookKernel | undefined) {
		if (this._disposed || kernel === this._currentKernel) {
			return;
		}

		const previousKernel = this._currentKernel;
		this._currentKernel = kernel;

		if (previousKernel && previousKernel.preloadUris.length > 0) {
			this.webview?.reload(); // preloads will be restored after reload
		} else if (kernel) {
			this._updatePreloadsFromKernel(kernel);
		}
	}

	private _updatePreloadsFromKernel(kernel: INotebookKernel) {
		const resources: IControllerPreload[] = [];
		for (const preload of kernel.preloadUris) {
			const uri = this.environmentService.isExtensionDevelopment && (preload.scheme === 'http' || preload.scheme === 'https')
				? preload : this.asWebviewUri(preload, undefined);

			if (!this._preloadsCache.has(uri.toString())) {
				resources.push({ uri: uri.toString(), originalUri: preload.toString() });
				this._preloadsCache.add(uri.toString());
			}
		}

		if (!resources.length) {
			return;
		}

		this._updatePreloads(resources);
	}

	private _updatePreloads(resources: IControllerPreload[]) {
		if (!this.webview) {
			return;
		}

		const mixedResourceRoots = [
			...(this.localResourceRootsCache || []),
			...(this._currentKernel ? [this._currentKernel.localResourceRoot] : []),
		];

		this.webview.localResourcesRoot = mixedResourceRoots;

		this._sendMessageToWebview({
			type: 'preload',
			resources: resources,
		});
	}

	private _sendMessageToWebview(message: ToWebviewMessage, transfer?: readonly ArrayBuffer[]) {
		if (this._disposed) {
			return;
		}

		this.webview?.postMessage(message, transfer);
	}

	override dispose() {
		this._disposed = true;
		this.webview?.dispose();
		this.webview = undefined;
		this.notebookEditor = null!;
		this.insetMapping.clear();
		this.pendingWebviewIdleCreationRequest.clear();
		super.dispose();
	}
}

function copyBufferIfNeeded(buffer: Uint8Array, transfer: ArrayBuffer[]): Uint8Array {
	if (buffer.byteLength === buffer.buffer.byteLength) {
		// No copy needed but we can't transfer either
		return buffer;
	} else {
		// The buffer is smaller than its backing array buffer.
		// Create a copy to avoid sending the entire array buffer.
		const valueBytes = new Uint8Array(buffer);
		transfer.push(valueBytes.buffer);
		return valueBytes;
	}
}

function getTokenizationCss() {
	const colorMap = TokenizationRegistry.getColorMap();
	const tokenizationCss = colorMap ? generateTokensCSSForColorMap(colorMap) : '';
	return tokenizationCss;
}

function tryDecodeURIComponent(uri: string) {
	try {
		return decodeURIComponent(uri);
	} catch {
		return uri;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/renderers/cellRenderer.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/renderers/cellRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { PixelRatio } from '../../../../../../base/browser/pixelRatio.js';
import * as DOM from '../../../../../../base/browser/dom.js';
import { FastDomNode } from '../../../../../../base/browser/fastDomNode.js';
import { IListElementRenderDetails, IListRenderer, IListVirtualDelegate } from '../../../../../../base/browser/ui/list/list.js';
import { Disposable, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../../../editor/browser/editorBrowser.js';
import { CodeEditorWidget } from '../../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IEditorOptions } from '../../../../../../editor/common/config/editorOptions.js';
import { createBareFontInfoFromRawSettings } from '../../../../../../editor/common/config/fontInfoFromSettings.js';
import { EditorContextKeys } from '../../../../../../editor/common/editorContextKeys.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../../../editor/common/languages/modesRegistry.js';
import { localize } from '../../../../../../nls.js';
import { IMenuService } from '../../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService, IScopedContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../../../platform/instantiation/common/serviceCollection.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { INotificationService } from '../../../../../../platform/notification/common/notification.js';
import { ICellViewModel, INotebookEditorDelegate } from '../../notebookBrowser.js';
import { CellPartsCollection } from '../cellPart.js';
import { CellChatPart } from '../cellParts/chat/cellChatPart.js';
import { CellComments } from '../cellParts/cellComments.js';
import { CellContextKeyPart } from '../cellParts/cellContextKeys.js';
import { CellDecorations } from '../cellParts/cellDecorations.js';
import { CellDragAndDropController, CellDragAndDropPart } from '../cellParts/cellDnd.js';
import { CodeCellDragImageRenderer } from '../cellParts/cellDragRenderer.js';
import { CellEditorOptions } from '../cellParts/cellEditorOptions.js';
import { CellExecutionPart } from '../cellParts/cellExecution.js';
import { CellFocusPart } from '../cellParts/cellFocus.js';
import { CellFocusIndicator } from '../cellParts/cellFocusIndicator.js';
import { CellProgressBar } from '../cellParts/cellProgressBar.js';
import { CellEditorStatusBar } from '../cellParts/cellStatusPart.js';
import { BetweenCellToolbar, CellTitleToolbarPart } from '../cellParts/cellToolbars.js';
import { CodeCell } from '../cellParts/codeCell.js';
import { RunToolbar } from '../cellParts/codeCellRunToolbar.js';
import { CollapsedCellInput } from '../cellParts/collapsedCellInput.js';
import { CollapsedCellOutput } from '../cellParts/collapsedCellOutput.js';
import { FoldedCellHint } from '../cellParts/foldedCellHint.js';
import { MarkupCell } from '../cellParts/markupCell.js';
import { CodeCellRenderTemplate, MarkdownCellRenderTemplate } from '../notebookRenderingCommon.js';
import { CodeCellViewModel } from '../../viewModel/codeCellViewModel.js';
import { MarkupCellViewModel } from '../../viewModel/markupCellViewModel.js';
import { CellViewModel } from '../../viewModel/notebookViewModelImpl.js';
import { CellKind } from '../../../common/notebookCommon.js';
import { INotebookExecutionStateService } from '../../../common/notebookExecutionStateService.js';
import { NotebookCellEditorPool } from '../notebookCellEditorPool.js';

const $ = DOM.$;

export class NotebookCellListDelegate extends Disposable implements IListVirtualDelegate<CellViewModel> {
	private readonly lineHeight: number;

	constructor(
		targetWindow: Window,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();

		const editorOptions = this.configurationService.getValue<IEditorOptions>('editor');
		this.lineHeight = createBareFontInfoFromRawSettings(editorOptions, PixelRatio.getInstance(targetWindow).value).lineHeight;
	}

	getHeight(element: CellViewModel): number {
		return element.getHeight(this.lineHeight);
	}

	getDynamicHeight(element: CellViewModel): number | null {
		return element.getDynamicHeight();
	}

	getTemplateId(element: CellViewModel): string {
		if (element.cellKind === CellKind.Markup) {
			return MarkupCellRenderer.TEMPLATE_ID;
		} else {
			return CodeCellRenderer.TEMPLATE_ID;
		}
	}
}

abstract class AbstractCellRenderer extends Disposable {
	protected readonly editorOptions: CellEditorOptions;

	constructor(
		protected readonly instantiationService: IInstantiationService,
		protected readonly notebookEditor: INotebookEditorDelegate,
		protected readonly contextMenuService: IContextMenuService,
		protected readonly menuService: IMenuService,
		configurationService: IConfigurationService,
		protected readonly keybindingService: IKeybindingService,
		protected readonly notificationService: INotificationService,
		protected readonly contextKeyServiceProvider: (container: HTMLElement) => IScopedContextKeyService,
		language: string,
		protected dndController: CellDragAndDropController | undefined
	) {
		super();
		this.editorOptions = this._register(new CellEditorOptions(this.notebookEditor.getBaseCellEditorOptions(language), this.notebookEditor.notebookOptions, configurationService));
	}

	override dispose() {
		super.dispose();
		this.dndController = undefined;
	}
}

export class MarkupCellRenderer extends AbstractCellRenderer implements IListRenderer<MarkupCellViewModel, MarkdownCellRenderTemplate> {
	static readonly TEMPLATE_ID = 'markdown_cell';

	private _notebookExecutionStateService: INotebookExecutionStateService;

	constructor(
		notebookEditor: INotebookEditorDelegate,
		dndController: CellDragAndDropController,
		private renderedEditors: Map<ICellViewModel, ICodeEditor>,
		contextKeyServiceProvider: (container: HTMLElement) => IScopedContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IMenuService menuService: IMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@INotificationService notificationService: INotificationService,
		@INotebookExecutionStateService notebookExecutionStateService: INotebookExecutionStateService
	) {
		super(instantiationService, notebookEditor, contextMenuService, menuService, configurationService, keybindingService, notificationService, contextKeyServiceProvider, 'markdown', dndController);
		this._notebookExecutionStateService = notebookExecutionStateService;
	}

	get templateId() {
		return MarkupCellRenderer.TEMPLATE_ID;
	}

	renderTemplate(rootContainer: HTMLElement): MarkdownCellRenderTemplate {
		rootContainer.classList.add('markdown-cell-row');
		const container = DOM.append(rootContainer, DOM.$('.cell-inner-container'));
		const templateDisposables = new DisposableStore();
		const contextKeyService = templateDisposables.add(this.contextKeyServiceProvider(container));
		const decorationContainer = DOM.append(rootContainer, $('.cell-decoration'));
		const titleToolbarContainer = DOM.append(container, $('.cell-title-toolbar'));

		const focusIndicatorTop = new FastDomNode(DOM.append(container, $('.cell-focus-indicator.cell-focus-indicator-top')));
		const focusIndicatorLeft = new FastDomNode(DOM.append(container, DOM.$('.cell-focus-indicator.cell-focus-indicator-side.cell-focus-indicator-left')));
		const foldingIndicator = DOM.append(focusIndicatorLeft.domNode, DOM.$('.notebook-folding-indicator'));
		const focusIndicatorRight = new FastDomNode(DOM.append(container, DOM.$('.cell-focus-indicator.cell-focus-indicator-side.cell-focus-indicator-right')));

		const codeInnerContent = DOM.append(container, $('.cell.code'));
		const editorPart = DOM.append(codeInnerContent, $('.cell-editor-part'));
		const cellChatPart = DOM.append(editorPart, $('.cell-chat-part'));
		const cellInputCollapsedContainer = DOM.append(codeInnerContent, $('.input-collapse-container'));
		cellInputCollapsedContainer.style.display = 'none';
		const editorContainer = DOM.append(editorPart, $('.cell-editor-container'));
		editorPart.style.display = 'none';
		const cellCommentPartContainer = DOM.append(container, $('.cell-comment-container'));
		const innerContent = DOM.append(container, $('.cell.markdown'));
		const bottomCellContainer = DOM.append(container, $('.cell-bottom-toolbar-container'));

		const scopedInstaService = templateDisposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyService])));
		const rootClassDelegate = {
			toggle: (className: string, force?: boolean) => container.classList.toggle(className, force)
		};
		const titleToolbar = templateDisposables.add(scopedInstaService.createInstance(
			CellTitleToolbarPart,
			titleToolbarContainer,
			rootClassDelegate,
			this.notebookEditor.creationOptions.menuIds.cellTitleToolbar,
			this.notebookEditor.creationOptions.menuIds.cellDeleteToolbar,
			this.notebookEditor));
		const focusIndicatorBottom = new FastDomNode(DOM.append(container, $('.cell-focus-indicator.cell-focus-indicator-bottom')));

		const cellParts = new CellPartsCollection(DOM.getWindow(rootContainer), [
			templateDisposables.add(scopedInstaService.createInstance(CellChatPart, this.notebookEditor, cellChatPart)),
			templateDisposables.add(scopedInstaService.createInstance(CellEditorStatusBar, this.notebookEditor, container, editorPart, undefined)),
			templateDisposables.add(new CellFocusIndicator(this.notebookEditor, titleToolbar, focusIndicatorTop, focusIndicatorLeft, focusIndicatorRight, focusIndicatorBottom)),
			templateDisposables.add(new FoldedCellHint(this.notebookEditor, DOM.append(container, $('.notebook-folded-hint')), this._notebookExecutionStateService)),
			templateDisposables.add(new CellDecorations(this.notebookEditor, rootContainer, decorationContainer)),
			templateDisposables.add(scopedInstaService.createInstance(CellComments, this.notebookEditor, cellCommentPartContainer)),
			templateDisposables.add(new CollapsedCellInput(this.notebookEditor, cellInputCollapsedContainer)),
			templateDisposables.add(new CellFocusPart(container, undefined, this.notebookEditor)),
			templateDisposables.add(new CellDragAndDropPart(container)),
			templateDisposables.add(scopedInstaService.createInstance(CellContextKeyPart, this.notebookEditor)),
		], [
			titleToolbar,
			templateDisposables.add(scopedInstaService.createInstance(BetweenCellToolbar, this.notebookEditor, titleToolbarContainer, bottomCellContainer))
		]);

		templateDisposables.add(cellParts);

		const templateData: MarkdownCellRenderTemplate = {
			rootContainer,
			cellInputCollapsedContainer,
			instantiationService: scopedInstaService,
			container,
			cellContainer: innerContent,
			editorPart,
			editorContainer,
			foldingIndicator,
			templateDisposables,
			elementDisposables: templateDisposables.add(new DisposableStore()),
			cellParts,
			toJSON: () => { return {}; }
		};

		return templateData;
	}

	renderElement(element: MarkupCellViewModel, index: number, templateData: MarkdownCellRenderTemplate, details?: IListElementRenderDetails): void {
		if (!this.notebookEditor.hasModel()) {
			throw new Error('The notebook editor is not attached with view model yet.');
		}

		templateData.currentRenderedCell = element;
		templateData.currentEditor = undefined;
		templateData.editorPart.style.display = 'none';
		templateData.cellContainer.innerText = '';

		if (details?.height === undefined) {
			return;
		}

		templateData.elementDisposables.add(templateData.instantiationService.createInstance(MarkupCell, this.notebookEditor, element, templateData, this.renderedEditors));
	}

	disposeTemplate(templateData: MarkdownCellRenderTemplate): void {
		templateData.templateDisposables.dispose();
	}

	disposeElement(_element: ICellViewModel, _index: number, templateData: MarkdownCellRenderTemplate): void {
		templateData.elementDisposables.clear();
	}
}

export class CodeCellRenderer extends AbstractCellRenderer implements IListRenderer<CodeCellViewModel, CodeCellRenderTemplate> {
	static readonly TEMPLATE_ID = 'code_cell';

	constructor(
		notebookEditor: INotebookEditorDelegate,
		private renderedEditors: Map<ICellViewModel, ICodeEditor>,
		private editorPool: NotebookCellEditorPool,
		dndController: CellDragAndDropController,
		contextKeyServiceProvider: (container: HTMLElement) => IScopedContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IMenuService menuService: IMenuService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@INotificationService notificationService: INotificationService,
	) {
		super(instantiationService, notebookEditor, contextMenuService, menuService, configurationService, keybindingService, notificationService, contextKeyServiceProvider, PLAINTEXT_LANGUAGE_ID, dndController);
	}

	get templateId() {
		return CodeCellRenderer.TEMPLATE_ID;
	}

	renderTemplate(rootContainer: HTMLElement): CodeCellRenderTemplate {
		rootContainer.classList.add('code-cell-row');
		const container = DOM.append(rootContainer, DOM.$('.cell-inner-container'));
		const templateDisposables = new DisposableStore();
		const contextKeyService = templateDisposables.add(this.contextKeyServiceProvider(container));
		const decorationContainer = DOM.append(rootContainer, $('.cell-decoration'));
		const focusIndicatorTop = new FastDomNode(DOM.append(container, $('.cell-focus-indicator.cell-focus-indicator-top')));
		const titleToolbarContainer = DOM.append(container, $('.cell-title-toolbar'));

		// This is also the drag handle
		const focusIndicatorLeft = new FastDomNode(DOM.append(container, DOM.$('.cell-focus-indicator.cell-focus-indicator-side.cell-focus-indicator-left')));
		const cellChatPart = DOM.append(container, $('.cell-chat-part'));
		const cellContainer = DOM.append(container, $('.cell.code'));
		const runButtonContainer = DOM.append(cellContainer, $('.run-button-container'));
		const cellInputCollapsedContainer = DOM.append(cellContainer, $('.input-collapse-container'));
		cellInputCollapsedContainer.style.display = 'none';
		const executionOrderLabel = DOM.append(focusIndicatorLeft.domNode, $('div.execution-count-label'));
		executionOrderLabel.title = localize('cellExecutionOrderCountLabel', 'Execution Order');
		const editorPart = DOM.append(cellContainer, $('.cell-editor-part'));
		const editorContainer = DOM.append(editorPart, $('.cell-editor-container'));
		const cellCommentPartContainer = DOM.append(container, $('.cell-comment-container'));

		// create a special context key service that set the inCompositeEditor-contextkey
		const editorContextKeyService = templateDisposables.add(this.contextKeyServiceProvider(editorPart));
		const editorInstaService = templateDisposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, editorContextKeyService])));
		EditorContextKeys.inCompositeEditor.bindTo(editorContextKeyService).set(true);

		const editor = editorInstaService.createInstance(CodeEditorWidget, editorContainer, {
			...this.editorOptions.getDefaultValue(),
			allowVariableLineHeights: false,
			dimension: {
				width: 0,
				height: 0
			},
			scrollbar: {
				vertical: 'hidden',
				horizontal: 'auto',
				handleMouseWheel: false,
				useShadows: false,
			},
		}, {
			contributions: this.notebookEditor.creationOptions.cellEditorContributions
		});

		templateDisposables.add(editor);

		const outputContainer = new FastDomNode(DOM.append(container, $('.output')));
		const cellOutputCollapsedContainer = DOM.append(outputContainer.domNode, $('.output-collapse-container'));
		const outputShowMoreContainer = new FastDomNode(DOM.append(container, $('.output-show-more-container')));
		const focusIndicatorRight = new FastDomNode(DOM.append(container, DOM.$('.cell-focus-indicator.cell-focus-indicator-side.cell-focus-indicator-right')));
		const focusSinkElement = DOM.append(container, $('.cell-editor-focus-sink'));
		focusSinkElement.setAttribute('tabindex', '0');
		const bottomCellToolbarContainer = DOM.append(container, $('.cell-bottom-toolbar-container'));
		const focusIndicatorBottom = new FastDomNode(DOM.append(container, $('.cell-focus-indicator.cell-focus-indicator-bottom')));

		const scopedInstaService = templateDisposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyService])));
		const rootClassDelegate = {
			toggle: (className: string, force?: boolean) => container.classList.toggle(className, force)
		};
		const titleToolbar = templateDisposables.add(scopedInstaService.createInstance(
			CellTitleToolbarPart,
			titleToolbarContainer,
			rootClassDelegate,
			this.notebookEditor.creationOptions.menuIds.cellTitleToolbar,
			this.notebookEditor.creationOptions.menuIds.cellDeleteToolbar,
			this.notebookEditor));

		const focusIndicatorPart = templateDisposables.add(new CellFocusIndicator(this.notebookEditor, titleToolbar, focusIndicatorTop, focusIndicatorLeft, focusIndicatorRight, focusIndicatorBottom));
		const contentParts = [
			focusIndicatorPart,
			templateDisposables.add(scopedInstaService.createInstance(CellChatPart, this.notebookEditor, cellChatPart)),
			templateDisposables.add(scopedInstaService.createInstance(CellEditorStatusBar, this.notebookEditor, container, editorPart, editor)),
			templateDisposables.add(scopedInstaService.createInstance(CellProgressBar, editorPart, cellInputCollapsedContainer)),
			templateDisposables.add(new CellDecorations(this.notebookEditor, rootContainer, decorationContainer)),
			templateDisposables.add(scopedInstaService.createInstance(CellComments, this.notebookEditor, cellCommentPartContainer)),
			templateDisposables.add(scopedInstaService.createInstance(CellExecutionPart, this.notebookEditor, executionOrderLabel)),
			templateDisposables.add(scopedInstaService.createInstance(CollapsedCellOutput, this.notebookEditor, cellOutputCollapsedContainer)),
			templateDisposables.add(new CollapsedCellInput(this.notebookEditor, cellInputCollapsedContainer)),
			templateDisposables.add(new CellFocusPart(container, focusSinkElement, this.notebookEditor)),
			templateDisposables.add(new CellDragAndDropPart(container)),
			templateDisposables.add(scopedInstaService.createInstance(CellContextKeyPart, this.notebookEditor)),
		];

		const { cellExecutePrimary, cellExecuteToolbar } = this.notebookEditor.creationOptions.menuIds;
		if (cellExecutePrimary && cellExecuteToolbar) {
			contentParts.push(templateDisposables.add(
				scopedInstaService.createInstance(RunToolbar, this.notebookEditor, contextKeyService, container, runButtonContainer, cellExecutePrimary, cellExecuteToolbar)
			));
		}

		const cellParts = new CellPartsCollection(DOM.getWindow(rootContainer), contentParts, [
			titleToolbar,
			templateDisposables.add(scopedInstaService.createInstance(BetweenCellToolbar, this.notebookEditor, titleToolbarContainer, bottomCellToolbarContainer))
		]);

		templateDisposables.add(cellParts);

		const templateData: CodeCellRenderTemplate = {
			rootContainer,
			editorPart,
			cellInputCollapsedContainer,
			cellOutputCollapsedContainer,
			instantiationService: scopedInstaService,
			container,
			cellContainer,
			focusSinkElement,
			outputContainer,
			outputShowMoreContainer,
			editor,
			templateDisposables,
			elementDisposables: templateDisposables.add(new DisposableStore()),
			cellParts,
			toJSON: () => { return {}; }
		};

		// focusIndicatorLeft covers the left margin area
		// code/outputFocusIndicator need to be registered as drag handlers so their click handlers don't take over
		const dragHandles = [focusIndicatorLeft.domNode, focusIndicatorPart.codeFocusIndicator.domNode, focusIndicatorPart.outputFocusIndicator.domNode];
		this.dndController?.registerDragHandle(templateData, rootContainer, dragHandles, () => new CodeCellDragImageRenderer().getDragImage(templateData, templateData.editor, 'code'));
		return templateData;
	}

	renderElement(element: CodeCellViewModel, index: number, templateData: CodeCellRenderTemplate, details?: IListElementRenderDetails): void {
		if (!this.notebookEditor.hasModel()) {
			throw new Error('The notebook editor is not attached with view model yet.');
		}

		templateData.currentRenderedCell = element;

		if (details?.height === undefined) {
			return;
		}

		templateData.outputContainer.domNode.innerText = '';
		templateData.outputContainer.domNode.appendChild(templateData.cellOutputCollapsedContainer);

		templateData.elementDisposables.add(templateData.instantiationService.createInstance(CodeCell, this.notebookEditor, element, templateData, this.editorPool));
		this.renderedEditors.set(element, templateData.editor);
	}

	disposeTemplate(templateData: CodeCellRenderTemplate): void {
		templateData.templateDisposables.dispose();
	}

	disposeElement(element: ICellViewModel, index: number, templateData: CodeCellRenderTemplate): void {
		templateData.elementDisposables.clear();
		this.renderedEditors.delete(element);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/renderers/webviewMessages.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/renderers/webviewMessages.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { RenderOutputType } from '../../notebookBrowser.js';
import type { PreloadOptions, RenderOptions } from './webviewPreloads.js';
import { NotebookCellMetadata } from '../../../common/notebookCommon.js';

interface BaseToWebviewMessage {
	readonly __vscode_notebook_message: true;
}

export interface WebviewInitialized extends BaseToWebviewMessage {
	readonly type: 'initialized';
}

export interface DimensionUpdate {
	readonly id: string;
	readonly init?: boolean;
	readonly height: number;
	readonly isOutput?: boolean;
}

export interface IDimensionMessage extends BaseToWebviewMessage {
	readonly type: 'dimension';
	readonly updates: readonly DimensionUpdate[];
}

export interface IMouseEnterMessage extends BaseToWebviewMessage {
	readonly type: 'mouseenter';
	readonly id: string;
}

export interface IMouseLeaveMessage extends BaseToWebviewMessage {
	readonly type: 'mouseleave';
	readonly id: string;
}

export interface IOutputFocusMessage extends BaseToWebviewMessage {
	readonly type: 'outputFocus';
	readonly id: string;
}

export interface IOutputBlurMessage extends BaseToWebviewMessage {
	readonly type: 'outputBlur';
	readonly id: string;
}

export interface IOutputInputFocusMessage extends BaseToWebviewMessage {
	readonly type: 'outputInputFocus';
	readonly inputFocused: boolean;
	readonly id: string;
}

export interface IScrollToRevealMessage extends BaseToWebviewMessage {
	readonly type: 'scroll-to-reveal';
	readonly scrollTop: number;
}

export interface IWheelMessage extends BaseToWebviewMessage {
	readonly type: 'did-scroll-wheel';
	readonly payload: any;
}

export interface IScrollAckMessage extends BaseToWebviewMessage {
	readonly type: 'scroll-ack';
	readonly data: { top: number };
	readonly version: number;
}

export interface IFocusEditorMessage extends BaseToWebviewMessage {
	readonly type: 'focus-editor';
	readonly cellId: string;
	readonly focusNext?: boolean;
}

export interface IClickedDataUrlMessage extends BaseToWebviewMessage {
	readonly type: 'clicked-data-url';
	readonly data: string | ArrayBuffer | null;
	readonly downloadName?: string;
}

export interface IClickMarkupCellMessage extends BaseToWebviewMessage {
	readonly type: 'clickMarkupCell';
	readonly cellId: string;
	readonly ctrlKey: boolean;
	readonly altKey: boolean;
	readonly metaKey: boolean;
	readonly shiftKey: boolean;
}

export interface IClickedLinkMessage extends BaseToWebviewMessage {
	readonly type: 'clicked-link';
	readonly href: string;
}

export interface IContextMenuMarkupCellMessage extends BaseToWebviewMessage {
	readonly type: 'contextMenuMarkupCell';
	readonly cellId: string;
	readonly clientX: number;
	readonly clientY: number;
}

export interface IMouseEnterMarkupCellMessage extends BaseToWebviewMessage {
	readonly type: 'mouseEnterMarkupCell';
	readonly cellId: string;
}

export interface IMouseLeaveMarkupCellMessage extends BaseToWebviewMessage {
	readonly type: 'mouseLeaveMarkupCell';
	readonly cellId: string;
}

export interface IToggleMarkupPreviewMessage extends BaseToWebviewMessage {
	readonly type: 'toggleMarkupPreview';
	readonly cellId: string;
}

export interface ICellDragStartMessage extends BaseToWebviewMessage {
	readonly type: 'cell-drag-start';
	readonly cellId: string;
	readonly dragOffsetY: number;
}

export interface ICellDragMessage extends BaseToWebviewMessage {
	readonly type: 'cell-drag';
	readonly cellId: string;
	readonly dragOffsetY: number;
}

export interface ICellDropMessage extends BaseToWebviewMessage {
	readonly type: 'cell-drop';
	readonly cellId: string;
	readonly ctrlKey: boolean;
	readonly altKey: boolean;
	readonly dragOffsetY: number;
}

export interface ICellDragEndMessage extends BaseToWebviewMessage {
	readonly type: 'cell-drag-end';
	readonly cellId: string;
}

export interface IInitializedMarkupMessage extends BaseToWebviewMessage {
	readonly type: 'initializedMarkup';
	readonly requestId: string;
}

export interface ICodeBlockHighlightRequest {
	readonly id: string;
	readonly value: string;
	readonly lang: string;
}

export interface IRenderedMarkupMessage extends BaseToWebviewMessage {
	readonly type: 'renderedMarkup';
	readonly cellId: string;
	readonly html: string;
	readonly codeBlocks: ReadonlyArray<ICodeBlockHighlightRequest>;
}

export interface IRenderedCellOutputMessage extends BaseToWebviewMessage {
	readonly type: 'renderedCellOutput';
	readonly codeBlocks: ReadonlyArray<ICodeBlockHighlightRequest>;
}

export interface IClearMessage {
	readonly type: 'clear';
}

export interface OutputItemEntry {
	readonly mime: string;
	readonly valueBytes: Uint8Array;
	readonly appended?: { valueBytes: Uint8Array; previousVersion: number };
}

export type ICreationContent =
	| { readonly type: RenderOutputType.Html; readonly htmlContent: string }
	| {
		readonly type: RenderOutputType.Extension;
		readonly outputId: string;
		readonly metadata: unknown;
		readonly output: OutputItemEntry;
		readonly allOutputs: ReadonlyArray<{ readonly mime: string }>;
	};

export interface ICreationRequestMessage {
	readonly type: 'html';
	readonly content: ICreationContent;
	readonly cellId: string;
	readonly outputId: string;
	cellTop: number;
	outputOffset: number;
	readonly left: number;
	readonly requiredPreloads: readonly IControllerPreload[];
	readonly initiallyHidden?: boolean;
	readonly rendererId?: string | undefined;
	readonly executionId?: string | undefined;
	readonly createOnIdle: boolean;
}

export interface IContentWidgetTopRequest {
	readonly cellId: string;
	readonly outputId: string;
	readonly cellTop: number;
	readonly outputOffset: number;
	readonly forceDisplay: boolean;
}

export interface IMarkupCellScrollTops {
	readonly id: string;
	readonly top: number;
}

export interface IViewScrollTopRequestMessage {
	readonly type: 'view-scroll';
	readonly widgets: readonly IContentWidgetTopRequest[];
	readonly markupCells: readonly IMarkupCellScrollTops[];
}

export interface IScrollRequestMessage {
	readonly type: 'scroll';
	readonly id: string;
	readonly top: number;
	readonly widgetTop?: number;
	readonly version: number;
}

export interface IClearOutputRequestMessage {
	readonly type: 'clearOutput';
	readonly cellId: string;
	readonly outputId: string;
	readonly cellUri: string;
	readonly rendererId: string | undefined;
}

export interface IHideOutputMessage {
	readonly type: 'hideOutput';
	readonly outputId: string;
	readonly cellId: string;
}

export interface IShowOutputMessage {
	readonly type: 'showOutput';
	readonly cellId: string;
	readonly outputId: string;
	readonly cellTop: number;
	readonly outputOffset: number;
	readonly content?: ICreationContent;
}

export interface ICopyImageMessage {
	readonly type: 'copyImage';
	readonly outputId: string;
	readonly altOutputId: string;
	readonly textAlternates?: { mimeType: string; content: string }[];
}

export interface IFocusOutputMessage {
	readonly type: 'focus-output';
	readonly cellOrOutputId: string;
	readonly alternateId?: string;
}

export interface IBlurOutputMessage {
	readonly type: 'blur-output';
}

export interface IAckOutputHeight {
	readonly cellId: string;
	readonly outputId: string;
	readonly height: number;
}

export interface IAckOutputHeightMessage {
	readonly type: 'ack-dimension';
	readonly updates: readonly IAckOutputHeight[];
}

export interface IControllerPreload {
	readonly originalUri: string;
	readonly uri: string;
}

export interface IUpdateControllerPreloadsMessage {
	readonly type: 'preload';
	readonly resources: readonly IControllerPreload[];
}

export interface RendererMetadata {
	readonly id: string;
	readonly entrypoint: { readonly extends: string | undefined; readonly path: string };
	readonly mimeTypes: readonly string[];
	readonly messaging: boolean;
	readonly isBuiltin: boolean;
}

export interface StaticPreloadMetadata {
	readonly entrypoint: string;
}

export interface IUpdateRenderersMessage {
	readonly type: 'updateRenderers';
	readonly rendererData: readonly RendererMetadata[];
}

export interface IUpdateDecorationsMessage {
	readonly type: 'decorations' | 'markupDecorations';
	readonly cellId: string;
	readonly addedClassNames: readonly string[];
	readonly removedClassNames: readonly string[];
}

export interface ICustomKernelMessage extends BaseToWebviewMessage {
	readonly type: 'customKernelMessage';
	readonly message: unknown;
}

export interface ICustomRendererMessage extends BaseToWebviewMessage {
	readonly type: 'customRendererMessage';
	readonly rendererId: string;
	readonly message: unknown;
}

export interface ICreateMarkupCellMessage {
	readonly type: 'createMarkupCell';
	readonly cell: IMarkupCellInitialization;
}

export interface IDeleteMarkupCellMessage {
	readonly type: 'deleteMarkupCell';
	readonly ids: readonly string[];
}

export interface IHideMarkupCellMessage {
	readonly type: 'hideMarkupCells';
	readonly ids: readonly string[];
}

export interface IUnhideMarkupCellMessage {
	readonly type: 'unhideMarkupCells';
	readonly ids: readonly string[];
}

export interface IShowMarkupCellMessage {
	readonly type: 'showMarkupCell';
	readonly id: string;
	readonly handle: number;
	readonly content: string | undefined;
	readonly top: number;
	readonly metadata: NotebookCellMetadata | undefined;
}

export interface IUpdateSelectedMarkupCellsMessage {
	readonly type: 'updateSelectedMarkupCells';
	readonly selectedCellIds: readonly string[];
}

export interface IMarkupCellInitialization {
	mime: string;
	cellId: string;
	cellHandle: number;
	content: string;
	offset: number;
	visible: boolean;
	metadata: NotebookCellMetadata;
}

export interface IInitializeMarkupCells {
	readonly type: 'initializeMarkup';
	readonly cells: readonly IMarkupCellInitialization[];
	readonly requestId: string;
}

export interface INotebookStylesMessage {
	readonly type: 'notebookStyles';
	readonly styles: {
		readonly [key: string]: string;
	};
}

export interface INotebookOptionsMessage {
	readonly type: 'notebookOptions';
	readonly options: PreloadOptions;
	readonly renderOptions: RenderOptions;
}

export interface ITokenizedCodeBlockMessage {
	readonly type: 'tokenizedCodeBlock';
	readonly codeBlockId: string;
	readonly html: string;
}

export interface ITokenizedStylesChangedMessage {
	readonly type: 'tokenizedStylesChanged';
	readonly css: string;
}

export interface IFindMessage {
	readonly type: 'find';
	readonly query: string;
	readonly options: { wholeWord?: boolean; caseSensitive?: boolean; includeMarkup: boolean; includeOutput: boolean; shouldGetSearchPreviewInfo: boolean; ownerID: string; findIds: string[] };
}


export interface IFindHighlightCurrentMessage {
	readonly type: 'findHighlightCurrent';
	readonly index: number;
	readonly ownerID: string;
}

export interface IFindUnHighlightCurrentMessage {
	readonly type: 'findUnHighlightCurrent';
	readonly index: number;
	readonly ownerID: string;
}

export interface IFindStopMessage {
	readonly type: 'findStop';
	readonly ownerID: string;
}

export interface ISearchPreviewInfo {
	line: string;
	range: {
		start: number;
		end: number;
	};
}

export interface IFindMatch {
	readonly type: 'preview' | 'output';
	readonly cellId: string;
	readonly id: string;
	readonly index: number;
	readonly searchPreviewInfo?: ISearchPreviewInfo;
}

export interface IDidFindMessage extends BaseToWebviewMessage {
	readonly type: 'didFind';
	readonly matches: IFindMatch[];
}

export interface IDidFindHighlightCurrentMessage extends BaseToWebviewMessage {
	readonly type: 'didFindHighlightCurrent';
	readonly offset: number;
}

export interface IOutputResizedMessage extends BaseToWebviewMessage {
	readonly type: 'outputResized';
	readonly cellId: string;
}

export interface IGetOutputItemMessage extends BaseToWebviewMessage {
	readonly type: 'getOutputItem';
	readonly requestId: number;
	readonly outputId: string;
	readonly mime: string;
}

export interface IReturnOutputItemMessage {
	readonly type: 'returnOutputItem';
	readonly requestId: number;
	readonly output: OutputItemEntry | undefined;
}

export interface ISelectOutputItemMessage {
	readonly type: 'select-output-contents';
	readonly cellOrOutputId: string;
}
export interface ISelectInputOutputItemMessage {
	readonly type: 'select-input-contents';
	readonly cellOrOutputId: string;
}

export interface ILogRendererDebugMessage extends BaseToWebviewMessage {
	readonly type: 'logRendererDebugMessage';
	readonly message: string;
	readonly data?: Record<string, string>;
}

export interface IPerformanceMessage extends BaseToWebviewMessage {
	readonly type: 'notebookPerformanceMessage';
	readonly executionId: string;
	readonly cellId: string;
	readonly duration: number;
	readonly rendererId: string;
	readonly outputSize?: number;
}


export type FromWebviewMessage = WebviewInitialized |
	IDimensionMessage |
	IMouseEnterMessage |
	IMouseLeaveMessage |
	IOutputFocusMessage |
	IOutputBlurMessage |
	IOutputInputFocusMessage |
	IScrollToRevealMessage |
	IWheelMessage |
	IScrollAckMessage |
	IFocusEditorMessage |
	ICustomKernelMessage |
	ICustomRendererMessage |
	IClickedDataUrlMessage |
	IClickMarkupCellMessage |
	IClickedLinkMessage |
	IContextMenuMarkupCellMessage |
	IMouseEnterMarkupCellMessage |
	IMouseLeaveMarkupCellMessage |
	IToggleMarkupPreviewMessage |
	ICellDragStartMessage |
	ICellDragMessage |
	ICellDropMessage |
	ICellDragEndMessage |
	IInitializedMarkupMessage |
	IRenderedMarkupMessage |
	IRenderedCellOutputMessage |
	IDidFindMessage |
	IDidFindHighlightCurrentMessage |
	IOutputResizedMessage |
	IGetOutputItemMessage |
	ILogRendererDebugMessage |
	IPerformanceMessage;

export type ToWebviewMessage = IClearMessage |
	IFocusOutputMessage |
	IBlurOutputMessage |
	IAckOutputHeightMessage |
	ICreationRequestMessage |
	IViewScrollTopRequestMessage |
	IScrollRequestMessage |
	IClearOutputRequestMessage |
	IHideOutputMessage |
	IShowOutputMessage |
	ICopyImageMessage |
	IUpdateControllerPreloadsMessage |
	IUpdateRenderersMessage |
	IUpdateDecorationsMessage |
	ICustomKernelMessage |
	ICustomRendererMessage |
	ICreateMarkupCellMessage |
	IDeleteMarkupCellMessage |
	IShowMarkupCellMessage |
	IHideMarkupCellMessage |
	IUnhideMarkupCellMessage |
	IUpdateSelectedMarkupCellsMessage |
	IInitializeMarkupCells |
	INotebookStylesMessage |
	INotebookOptionsMessage |
	ITokenizedCodeBlockMessage |
	ITokenizedStylesChangedMessage |
	IFindMessage |
	IFindHighlightCurrentMessage |
	IFindUnHighlightCurrentMessage |
	IFindStopMessage |
	IReturnOutputItemMessage |
	ISelectOutputItemMessage |
	ISelectInputOutputItemMessage;


export type AnyMessage = FromWebviewMessage | ToWebviewMessage;
```

--------------------------------------------------------------------------------

````

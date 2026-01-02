---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 354
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 354 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatToolInvocationPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatToolInvocationPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../../base/browser/dom.js';
import { Emitter } from '../../../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../../../base/common/lifecycle.js';
import { autorun } from '../../../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IMarkdownRenderer } from '../../../../../../platform/markdown/browser/markdownRenderer.js';
import { IChatToolInvocation, IChatToolInvocationSerialized } from '../../../common/chatService.js';
import { IChatRendererContent } from '../../../common/chatViewModel.js';
import { CodeBlockModelCollection } from '../../../common/codeBlockModelCollection.js';
import { isToolResultInputOutputDetails, isToolResultOutputDetails, ToolInvocationPresentation } from '../../../common/languageModelToolsService.js';
import { ChatTreeItem, IChatCodeBlockInfo } from '../../chat.js';
import { EditorPool } from '../chatContentCodePools.js';
import { IChatContentPart, IChatContentPartRenderContext } from '../chatContentParts.js';
import { CollapsibleListPool } from '../chatReferencesContentPart.js';
import { ExtensionsInstallConfirmationWidgetSubPart } from './chatExtensionsInstallToolSubPart.js';
import { ChatInputOutputMarkdownProgressPart } from './chatInputOutputMarkdownProgressPart.js';
import { ChatResultListSubPart } from './chatResultListSubPart.js';
import { ChatTerminalToolConfirmationSubPart } from './chatTerminalToolConfirmationSubPart.js';
import { ChatTerminalToolProgressPart } from './chatTerminalToolProgressPart.js';
import { ToolConfirmationSubPart } from './chatToolConfirmationSubPart.js';
import { BaseChatToolInvocationSubPart } from './chatToolInvocationSubPart.js';
import { ChatToolOutputSubPart } from './chatToolOutputPart.js';
import { ChatToolPostExecuteConfirmationPart } from './chatToolPostExecuteConfirmationPart.js';
import { ChatToolProgressSubPart } from './chatToolProgressPart.js';

export class ChatToolInvocationPart extends Disposable implements IChatContentPart {
	public readonly domNode: HTMLElement;

	private _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	public get codeblocks(): IChatCodeBlockInfo[] {
		return this.subPart?.codeblocks ?? [];
	}

	public get codeblocksPartId(): string | undefined {
		return this.subPart?.codeblocksPartId;
	}

	private subPart!: BaseChatToolInvocationSubPart;

	constructor(
		private readonly toolInvocation: IChatToolInvocation | IChatToolInvocationSerialized,
		private readonly context: IChatContentPartRenderContext,
		private readonly renderer: IMarkdownRenderer,
		private readonly listPool: CollapsibleListPool,
		private readonly editorPool: EditorPool,
		private readonly currentWidthDelegate: () => number,
		private readonly codeBlockModelCollection: CodeBlockModelCollection,
		private readonly announcedToolProgressKeys: Set<string> | undefined,
		private readonly codeBlockStartIndex: number,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		this.domNode = dom.$('.chat-tool-invocation-part');
		if (toolInvocation.fromSubAgent) {
			this.domNode.classList.add('from-sub-agent');
		}
		if (toolInvocation.presentation === 'hidden') {
			return;
		}

		if (toolInvocation.kind === 'toolInvocation') {
			const initialState = toolInvocation.state.get().type;
			this._register(autorun(reader => {
				if (toolInvocation.state.read(reader).type !== initialState) {
					render();
				}
			}));
		}

		// This part is a bit different, since IChatToolInvocation is not an immutable model object. So this part is able to rerender itself.
		// If this turns out to be a typical pattern, we could come up with a more reusable pattern, like telling the list to rerender an element
		// when the model changes, or trying to make the model immutable and swap out one content part for a new one based on user actions in the view.
		const partStore = this._register(new DisposableStore());
		const render = () => {
			dom.clearNode(this.domNode);
			partStore.clear();

			if (toolInvocation.presentation === ToolInvocationPresentation.HiddenAfterComplete && IChatToolInvocation.isComplete(toolInvocation)) {
				return;
			}

			this.subPart = partStore.add(this.createToolInvocationSubPart());
			this.domNode.appendChild(this.subPart.domNode);
			partStore.add(this.subPart.onDidChangeHeight(() => this._onDidChangeHeight.fire()));
			partStore.add(this.subPart.onNeedsRerender(render));

			this._onDidChangeHeight.fire();
		};
		render();
	}

	private createToolInvocationSubPart(): BaseChatToolInvocationSubPart {
		if (this.toolInvocation.kind === 'toolInvocation') {
			if (this.toolInvocation.toolSpecificData?.kind === 'extensions') {
				return this.instantiationService.createInstance(ExtensionsInstallConfirmationWidgetSubPart, this.toolInvocation, this.context);
			}
			const state = this.toolInvocation.state.get();
			if (state.type === IChatToolInvocation.StateKind.WaitingForConfirmation) {
				if (this.toolInvocation.toolSpecificData?.kind === 'terminal') {
					return this.instantiationService.createInstance(ChatTerminalToolConfirmationSubPart, this.toolInvocation, this.toolInvocation.toolSpecificData, this.context, this.renderer, this.editorPool, this.currentWidthDelegate, this.codeBlockModelCollection, this.codeBlockStartIndex);
				} else {
					return this.instantiationService.createInstance(ToolConfirmationSubPart, this.toolInvocation, this.context, this.renderer, this.editorPool, this.currentWidthDelegate, this.codeBlockModelCollection, this.codeBlockStartIndex);
				}
			}
			if (state.type === IChatToolInvocation.StateKind.WaitingForPostApproval) {
				return this.instantiationService.createInstance(ChatToolPostExecuteConfirmationPart, this.toolInvocation, this.context);
			}
		}

		if (this.toolInvocation.toolSpecificData?.kind === 'terminal') {
			return this.instantiationService.createInstance(ChatTerminalToolProgressPart, this.toolInvocation, this.toolInvocation.toolSpecificData, this.context, this.renderer, this.editorPool, this.currentWidthDelegate, this.codeBlockStartIndex, this.codeBlockModelCollection);
		}

		const resultDetails = IChatToolInvocation.resultDetails(this.toolInvocation);
		if (Array.isArray(resultDetails) && resultDetails.length) {
			return this.instantiationService.createInstance(ChatResultListSubPart, this.toolInvocation, this.context, this.toolInvocation.pastTenseMessage ?? this.toolInvocation.invocationMessage, resultDetails, this.listPool);
		}

		if (isToolResultOutputDetails(resultDetails)) {
			return this.instantiationService.createInstance(ChatToolOutputSubPart, this.toolInvocation, this.context);
		}

		if (isToolResultInputOutputDetails(resultDetails)) {
			return this.instantiationService.createInstance(
				ChatInputOutputMarkdownProgressPart,
				this.toolInvocation,
				this.context,
				this.codeBlockStartIndex,
				this.toolInvocation.pastTenseMessage ?? this.toolInvocation.invocationMessage,
				this.toolInvocation.originMessage,
				resultDetails.input,
				resultDetails.output,
				!!resultDetails.isError,
			);
		}

		if (this.toolInvocation.kind === 'toolInvocation' && this.toolInvocation.toolSpecificData?.kind === 'input' && !IChatToolInvocation.isComplete(this.toolInvocation)) {
			return this.instantiationService.createInstance(
				ChatInputOutputMarkdownProgressPart,
				this.toolInvocation,
				this.context,
				this.codeBlockStartIndex,
				this.toolInvocation.invocationMessage,
				this.toolInvocation.originMessage,
				typeof this.toolInvocation.toolSpecificData.rawInput === 'string' ? this.toolInvocation.toolSpecificData.rawInput : JSON.stringify(this.toolInvocation.toolSpecificData.rawInput, null, 2),
				undefined,
				false,
			);
		}

		return this.instantiationService.createInstance(ChatToolProgressSubPart, this.toolInvocation, this.context, this.renderer, this.announcedToolProgressKeys);
	}

	hasSameContent(other: IChatRendererContent, followingContent: IChatRendererContent[], element: ChatTreeItem): boolean {
		return (other.kind === 'toolInvocation' || other.kind === 'toolInvocationSerialized') && this.toolInvocation.toolCallId === other.toolCallId;
	}

	addDisposable(disposable: IDisposable): void {
		this._register(disposable);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatToolInvocationSubPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatToolInvocationSubPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../../base/common/codicons.js';
import { Emitter } from '../../../../../../base/common/event.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { IChatToolInvocation, IChatToolInvocationSerialized, ToolConfirmKind } from '../../../common/chatService.js';
import { IChatCodeBlockInfo } from '../../chat.js';

export abstract class BaseChatToolInvocationSubPart extends Disposable {
	protected static idPool = 0;
	public abstract readonly domNode: HTMLElement;

	protected _onNeedsRerender = this._register(new Emitter<void>());
	public readonly onNeedsRerender = this._onNeedsRerender.event;

	protected _onDidChangeHeight = this._register(new Emitter<void>());
	public readonly onDidChangeHeight = this._onDidChangeHeight.event;

	public abstract codeblocks: IChatCodeBlockInfo[];

	private readonly _codeBlocksPartId = 'tool-' + (BaseChatToolInvocationSubPart.idPool++);

	public get codeblocksPartId() {
		return this._codeBlocksPartId;
	}

	constructor(
		protected readonly toolInvocation: IChatToolInvocation | IChatToolInvocationSerialized,
	) {
		super();
	}

	protected getIcon() {
		const toolInvocation = this.toolInvocation;
		const confirmState = IChatToolInvocation.executionConfirmedOrDenied(toolInvocation);
		const isSkipped = confirmState?.type === ToolConfirmKind.Skipped;
		if (isSkipped) {
			return Codicon.circleSlash;
		}

		return confirmState?.type === ToolConfirmKind.Denied ?
			Codicon.error :
			IChatToolInvocation.isComplete(toolInvocation) ?
				Codicon.check : ThemeIcon.modify(Codicon.loading, 'spin');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatToolOutputPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatToolOutputPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../../base/browser/dom.js';
import { renderMarkdown } from '../../../../../../base/browser/markdownRenderer.js';
import { decodeBase64 } from '../../../../../../base/common/buffer.js';
import { CancellationTokenSource } from '../../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { generateUuid } from '../../../../../../base/common/uuid.js';
import { localize } from '../../../../../../nls.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IChatToolInvocation, IChatToolInvocationSerialized, IToolResultOutputDetailsSerialized } from '../../../common/chatService.js';
import { IChatViewModel } from '../../../common/chatViewModel.js';
import { IToolResultOutputDetails } from '../../../common/languageModelToolsService.js';
import { IChatCodeBlockInfo, IChatWidgetService } from '../../chat.js';
import { IChatOutputRendererService } from '../../chatOutputItemRenderer.js';
import { IChatContentPartRenderContext } from '../chatContentParts.js';
import { ChatProgressSubPart } from '../chatProgressContentPart.js';
import { BaseChatToolInvocationSubPart } from './chatToolInvocationSubPart.js';

interface OutputState {
	readonly webviewOrigin: string;
	height: number;
}

// TODO: see if we can reuse existing types instead of adding ChatToolOutputSubPart
export class ChatToolOutputSubPart extends BaseChatToolInvocationSubPart {

	/** Remembers cached state on re-render */
	private static readonly _cachedStates = new WeakMap<IChatViewModel | IChatToolInvocationSerialized, Map<string, OutputState>>();

	public readonly domNode: HTMLElement;

	public override readonly codeblocks: IChatCodeBlockInfo[] = [];

	private readonly _disposeCts = this._register(new CancellationTokenSource());

	constructor(
		toolInvocation: IChatToolInvocation | IChatToolInvocationSerialized,
		private readonly context: IChatContentPartRenderContext,
		@IChatOutputRendererService private readonly chatOutputItemRendererService: IChatOutputRendererService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super(toolInvocation);

		const details: IToolResultOutputDetails = toolInvocation.kind === 'toolInvocation'
			? IChatToolInvocation.resultDetails(toolInvocation) as IToolResultOutputDetails
			: {
				output: {
					type: 'data',
					mimeType: (toolInvocation.resultDetails as IToolResultOutputDetailsSerialized).output.mimeType,
					value: decodeBase64((toolInvocation.resultDetails as IToolResultOutputDetailsSerialized).output.base64Data),
				},
			};

		this.domNode = dom.$('div.tool-output-part');

		const titleEl = dom.$('.output-title');
		this.domNode.appendChild(titleEl);
		if (typeof toolInvocation.invocationMessage === 'string') {
			titleEl.textContent = toolInvocation.invocationMessage;
		} else {
			const md = this._register(renderMarkdown(toolInvocation.invocationMessage));
			titleEl.appendChild(md.element);
		}

		this.domNode.appendChild(this.createOutputPart(toolInvocation, details));
	}

	public override dispose(): void {
		this._disposeCts.dispose(true);
		super.dispose();
	}

	private createOutputPart(toolInvocation: IChatToolInvocation | IChatToolInvocationSerialized, details: IToolResultOutputDetails): HTMLElement {
		const vm = this.chatWidgetService.getWidgetBySessionResource(this.context.element.sessionResource)?.viewModel;

		const parent = dom.$('div.webview-output');
		parent.style.maxHeight = '80vh';

		let partState: OutputState = { height: 0, webviewOrigin: generateUuid() };
		if (vm) {
			let allStates = ChatToolOutputSubPart._cachedStates.get(vm);
			if (!allStates) {
				allStates = new Map<string, OutputState>();
				ChatToolOutputSubPart._cachedStates.set(vm, allStates);
			}

			const cachedState = allStates.get(toolInvocation.toolCallId);
			if (cachedState) {
				partState = cachedState;
			} else {
				allStates.set(toolInvocation.toolCallId, partState);
			}
		}

		if (partState.height) {
			parent.style.height = `${partState.height}px`;
		}

		const progressMessage = dom.$('span');
		progressMessage.textContent = localize('loading', 'Rendering tool output...');
		const progressPart = this._register(this.instantiationService.createInstance(ChatProgressSubPart, progressMessage, ThemeIcon.modify(Codicon.loading, 'spin'), undefined));
		parent.appendChild(progressPart.domNode);

		// TODO: we also need to show the tool output in the UI
		this.chatOutputItemRendererService.renderOutputPart(details.output.mimeType, details.output.value.buffer, parent, { origin: partState.webviewOrigin }, this._disposeCts.token).then((renderedItem) => {
			if (this._disposeCts.token.isCancellationRequested) {
				return;
			}

			this._register(renderedItem);

			progressPart.domNode.remove();

			this._onDidChangeHeight.fire();
			this._register(renderedItem.onDidChangeHeight(newHeight => {
				this._onDidChangeHeight.fire();
				partState.height = newHeight;
			}));

			this._register(renderedItem.webview.onDidWheel(e => {
				this.chatWidgetService.getWidgetBySessionResource(this.context.element.sessionResource)?.delegateScrollFromMouseWheelEvent({
					...e,
					preventDefault: () => { },
					stopPropagation: () => { }
				});
			}));

			// When the webview is disconnected from the DOM due to being hidden, we need to reload it when it is shown again.
			const widget = this.chatWidgetService.getWidgetBySessionResource(this.context.element.sessionResource);
			if (widget) {
				this._register(widget?.onDidShow(() => {
					renderedItem.reinitialize();
				}));
			}
		}, (error) => {
			console.error('Error rendering tool output:', error);

			const errorNode = dom.$('.output-error');

			const errorHeaderNode = dom.$('.output-error-header');
			dom.append(errorNode, errorHeaderNode);

			const iconElement = dom.$('div');
			iconElement.classList.add(...ThemeIcon.asClassNameArray(Codicon.error));
			errorHeaderNode.append(iconElement);

			const errorTitleNode = dom.$('.output-error-title');
			errorTitleNode.textContent = localize('chat.toolOutputError', "Error rendering the tool output");
			errorHeaderNode.append(errorTitleNode);

			const errorMessageNode = dom.$('.output-error-details');
			errorMessageNode.textContent = error?.message || String(error);
			errorNode.append(errorMessageNode);

			progressPart.domNode.replaceWith(errorNode);
		});

		return parent;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatToolPostExecuteConfirmationPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatToolPostExecuteConfirmationPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../../base/browser/dom.js';
import { Separator } from '../../../../../../base/common/actions.js';
import { getExtensionForMimeType } from '../../../../../../base/common/mime.js';
import { ILanguageService } from '../../../../../../editor/common/languages/language.js';
import { IModelService } from '../../../../../../editor/common/services/model.js';
import { localize } from '../../../../../../nls.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { ChatResponseResource } from '../../../common/chatModel.js';
import { IChatToolInvocation, ToolConfirmKind } from '../../../common/chatService.js';
import { ILanguageModelToolsConfirmationService } from '../../../common/languageModelToolsConfirmationService.js';
import { ILanguageModelToolsService, IToolResultDataPart, IToolResultPromptTsxPart, IToolResultTextPart, stringifyPromptTsxPart } from '../../../common/languageModelToolsService.js';
import { AcceptToolPostConfirmationActionId, SkipToolPostConfirmationActionId } from '../../actions/chatToolActions.js';
import { IChatCodeBlockInfo, IChatWidgetService } from '../../chat.js';
import { IChatContentPartRenderContext } from '../chatContentParts.js';
import { ChatCollapsibleIOPart } from '../chatToolInputOutputContentPart.js';
import { ChatToolOutputContentSubPart } from '../chatToolOutputContentSubPart.js';
import { AbstractToolConfirmationSubPart } from './abstractToolConfirmationSubPart.js';

export class ChatToolPostExecuteConfirmationPart extends AbstractToolConfirmationSubPart {
	private _codeblocks: IChatCodeBlockInfo[] = [];
	public get codeblocks(): IChatCodeBlockInfo[] {
		return this._codeblocks;
	}

	constructor(
		toolInvocation: IChatToolInvocation,
		context: IChatContentPartRenderContext,
		@IInstantiationService instantiationService: IInstantiationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IChatWidgetService chatWidgetService: IChatWidgetService,
		@ILanguageModelToolsService languageModelToolsService: ILanguageModelToolsService,
		@ILanguageModelToolsConfirmationService private readonly confirmationService: ILanguageModelToolsConfirmationService,
	) {
		super(toolInvocation, context, instantiationService, keybindingService, contextKeyService, chatWidgetService, languageModelToolsService);
		const subtitle = toolInvocation.pastTenseMessage || toolInvocation.invocationMessage;
		this.render({
			allowActionId: AcceptToolPostConfirmationActionId,
			skipActionId: SkipToolPostConfirmationActionId,
			allowLabel: localize('allow', "Allow"),
			skipLabel: localize('skip.post', 'Skip Results'),
			partType: 'chatToolPostConfirmation',
			subtitle: typeof subtitle === 'string' ? subtitle : subtitle?.value,
		});
	}

	protected createContentElement(): HTMLElement {
		if (this.toolInvocation.kind !== 'toolInvocation') {
			throw new Error('post-approval not supported for serialized data');
		}
		const state = this.toolInvocation.state.get();
		if (state.type !== IChatToolInvocation.StateKind.WaitingForPostApproval) {
			throw new Error('Tool invocation is not waiting for post-approval');
		}

		return this.createResultsDisplay(this.toolInvocation, state.contentForModel);
	}

	protected getTitle(): string {
		return localize('approveToolResult', "Approve Tool Result");
	}

	protected override additionalPrimaryActions() {
		const actions = super.additionalPrimaryActions();

		// Get actions from confirmation service
		const confirmActions = this.confirmationService.getPostConfirmActions({
			toolId: this.toolInvocation.toolId,
			source: this.toolInvocation.source,
			parameters: this.toolInvocation.parameters
		});

		for (const action of confirmActions) {
			if (action.divider) {
				actions.push(new Separator());
			}
			actions.push({
				label: action.label,
				tooltip: action.detail,
				data: async () => {
					const shouldConfirm = await action.select();
					if (shouldConfirm) {
						this.confirmWith(this.toolInvocation, { type: ToolConfirmKind.UserAction });
					}
				}
			});
		}

		return actions;
	}

	private createResultsDisplay(toolInvocation: IChatToolInvocation, contentForModel: (IToolResultPromptTsxPart | IToolResultTextPart | IToolResultDataPart)[]): HTMLElement {
		const container = dom.$('.tool-postconfirm-display');

		if (!contentForModel || contentForModel.length === 0) {
			container.textContent = localize('noResults', 'No results to display');
			return container;
		}

		const parts: ChatCollapsibleIOPart[] = [];

		for (const [i, part] of contentForModel.entries()) {
			if (part.kind === 'text') {
				// Display text parts
				const model = this._register(this.modelService.createModel(
					part.value,
					this.languageService.createById('plaintext'),
					undefined,
					true
				));

				parts.push({
					kind: 'code',
					title: part.title,
					textModel: model,
					languageId: model.getLanguageId(),
					options: {
						hideToolbar: true,
						reserveWidth: 19,
						maxHeightInLines: 13,
						verticalPadding: 5,
						editorOptions: { wordWrap: 'on', readOnly: true }
					},
					codeBlockInfo: {
						codeBlockIndex: i,
						codemapperUri: undefined,
						elementId: this.context.element.id,
						focus: () => { },
						ownerMarkdownPartId: this.codeblocksPartId,
						uri: model.uri,
						chatSessionResource: this.context.element.sessionResource,
						uriPromise: Promise.resolve(model.uri)
					}
				});
			} else if (part.kind === 'promptTsx') {
				// Display TSX parts as JSON-stringified
				const stringified = stringifyPromptTsxPart(part);
				const model = this._register(this.modelService.createModel(
					stringified,
					this.languageService.createById('json'),
					undefined,
					true
				));

				parts.push({
					kind: 'code',
					textModel: model,
					languageId: model.getLanguageId(),
					options: {
						hideToolbar: true,
						reserveWidth: 19,
						maxHeightInLines: 13,
						verticalPadding: 5,
						editorOptions: { wordWrap: 'on', readOnly: true }
					},
					codeBlockInfo: {
						codeBlockIndex: i,
						codemapperUri: undefined,
						elementId: this.context.element.id,
						focus: () => { },
						ownerMarkdownPartId: this.codeblocksPartId,
						uri: model.uri,
						chatSessionResource: this.context.element.sessionResource,
						uriPromise: Promise.resolve(model.uri)
					}
				});
			} else if (part.kind === 'data') {
				// Display data parts
				const mimeType = part.value.mimeType;
				const data = part.value.data;

				// Check if it's an image
				if (mimeType?.startsWith('image/')) {
					const permalinkBasename = getExtensionForMimeType(mimeType) ? `image${getExtensionForMimeType(mimeType)}` : 'image.bin';
					const permalinkUri = ChatResponseResource.createUri(this.context.element.sessionResource, toolInvocation.toolCallId, i, permalinkBasename);
					parts.push({ kind: 'data', value: data.buffer, mimeType, uri: permalinkUri, audience: part.audience });
				} else {
					// Try to display as UTF-8 text, otherwise base64
					const decoder = new TextDecoder('utf-8', { fatal: true });
					try {
						const text = decoder.decode(data.buffer);
						const model = this._register(this.modelService.createModel(
							text,
							this.languageService.createById('plaintext'),
							undefined,
							true
						));

						parts.push({
							kind: 'code',
							textModel: model,
							languageId: model.getLanguageId(),
							options: {
								hideToolbar: true,
								reserveWidth: 19,
								maxHeightInLines: 13,
								verticalPadding: 5,
								editorOptions: { wordWrap: 'on', readOnly: true }
							},
							codeBlockInfo: {
								codeBlockIndex: i,
								codemapperUri: undefined,
								elementId: this.context.element.id,
								focus: () => { },
								ownerMarkdownPartId: this.codeblocksPartId,
								uri: model.uri,
								chatSessionResource: this.context.element.sessionResource,
								uriPromise: Promise.resolve(model.uri)
							}
						});
					} catch {
						// Not valid UTF-8, show base64
						const base64 = data.toString();
						const model = this._register(this.modelService.createModel(
							base64,
							this.languageService.createById('plaintext'),
							undefined,
							true
						));

						parts.push({
							kind: 'code',
							textModel: model,
							languageId: model.getLanguageId(),
							options: {
								hideToolbar: true,
								reserveWidth: 19,
								maxHeightInLines: 13,
								verticalPadding: 5,
								editorOptions: { wordWrap: 'on', readOnly: true }
							},
							codeBlockInfo: {
								codeBlockIndex: i,
								codemapperUri: undefined,
								elementId: this.context.element.id,
								focus: () => { },
								ownerMarkdownPartId: this.codeblocksPartId,
								uri: model.uri,
								chatSessionResource: this.context.element.sessionResource,
								uriPromise: Promise.resolve(model.uri)
							}
						});
					}
				}
			}
		}

		if (parts.length > 0) {
			const outputSubPart = this._register(this.instantiationService.createInstance(
				ChatToolOutputContentSubPart,
				this.context,
				parts,
			));

			this._codeblocks.push(...outputSubPart.codeblocks);
			this._register(outputSubPart.onDidChangeHeight(() => this._onDidChangeHeight.fire()));
			outputSubPart.domNode.classList.add('tool-postconfirm-display');
			return outputSubPart.domNode;
		}

		container.textContent = localize('noDisplayableResults', 'No displayable results');
		return container;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatToolProgressPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/chatToolProgressPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../../base/browser/dom.js';
import { status } from '../../../../../../base/browser/ui/aria/aria.js';
import { IMarkdownString, MarkdownString } from '../../../../../../base/common/htmlContent.js';
import { autorun } from '../../../../../../base/common/observable.js';
import { IMarkdownRenderer } from '../../../../../../platform/markdown/browser/markdownRenderer.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IChatProgressMessage, IChatToolInvocation, IChatToolInvocationSerialized, ToolConfirmKind } from '../../../common/chatService.js';
import { AccessibilityWorkbenchSettingId } from '../../../../accessibility/browser/accessibilityConfiguration.js';
import { IChatCodeBlockInfo } from '../../chat.js';
import { IChatContentPartRenderContext } from '../chatContentParts.js';
import { ChatProgressContentPart } from '../chatProgressContentPart.js';
import { BaseChatToolInvocationSubPart } from './chatToolInvocationSubPart.js';

export class ChatToolProgressSubPart extends BaseChatToolInvocationSubPart {
	public readonly domNode: HTMLElement;

	public override readonly codeblocks: IChatCodeBlockInfo[] = [];

	constructor(
		toolInvocation: IChatToolInvocation | IChatToolInvocationSerialized,
		private readonly context: IChatContentPartRenderContext,
		private readonly renderer: IMarkdownRenderer,
		private readonly announcedToolProgressKeys: Set<string> | undefined,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super(toolInvocation);

		this.domNode = this.createProgressPart();
	}

	private createProgressPart(): HTMLElement {
		if (IChatToolInvocation.isComplete(this.toolInvocation) && this.toolIsConfirmed && this.toolInvocation.pastTenseMessage) {
			const key = this.getAnnouncementKey('complete');
			const completionContent = this.toolInvocation.pastTenseMessage ?? this.toolInvocation.invocationMessage;
			const shouldAnnounce = this.toolInvocation.kind === 'toolInvocation' && this.hasMeaningfulContent(completionContent) ? this.computeShouldAnnounce(key) : false;
			const part = this.renderProgressContent(completionContent, shouldAnnounce);
			this._register(part);
			return part.domNode;
		} else {
			const container = document.createElement('div');
			const progressObservable = this.toolInvocation.kind === 'toolInvocation' ? this.toolInvocation.state.map((s, r) => s.type === IChatToolInvocation.StateKind.Executing ? s.progress.read(r) : undefined) : undefined;
			this._register(autorun(reader => {
				const progress = progressObservable?.read(reader);
				const key = this.getAnnouncementKey('progress');
				const progressContent = progress?.message ?? this.toolInvocation.invocationMessage;
				const shouldAnnounce = this.toolInvocation.kind === 'toolInvocation' && this.hasMeaningfulContent(progressContent) ? this.computeShouldAnnounce(key) : false;
				const part = reader.store.add(this.renderProgressContent(progressContent, shouldAnnounce));
				dom.reset(container, part.domNode);
			}));
			return container;
		}
	}

	private get toolIsConfirmed() {
		const c = IChatToolInvocation.executionConfirmedOrDenied(this.toolInvocation);
		return !!c && c.type !== ToolConfirmKind.Denied;
	}

	private renderProgressContent(content: IMarkdownString | string, shouldAnnounce: boolean) {
		if (typeof content === 'string') {
			content = new MarkdownString().appendText(content);
		}

		const progressMessage: IChatProgressMessage = {
			kind: 'progressMessage',
			content
		};

		if (shouldAnnounce) {
			this.provideScreenReaderStatus(content);
		}

		return this.instantiationService.createInstance(ChatProgressContentPart, progressMessage, this.renderer, this.context, undefined, true, this.getIcon(), this.toolInvocation);
	}

	private getAnnouncementKey(kind: 'progress' | 'complete'): string {
		return `${kind}:${this.toolInvocation.toolCallId}`;
	}

	private computeShouldAnnounce(key: string): boolean {
		if (!this.announcedToolProgressKeys) {
			return false;
		}
		if (!this.configurationService.getValue(AccessibilityWorkbenchSettingId.VerboseChatProgressUpdates)) {
			return false;
		}
		if (this.announcedToolProgressKeys.has(key)) {
			return false;
		}
		this.announcedToolProgressKeys.add(key);
		return true;
	}

	private provideScreenReaderStatus(content: IMarkdownString | string): void {
		const message = typeof content === 'string' ? content : content.value;
		status(message);
	}

	private hasMeaningfulContent(content: IMarkdownString | string | undefined): boolean {
		if (!content) {
			return false;
		}

		const text = typeof content === 'string' ? content : content.value;
		return text.trim().length > 0;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditing.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditing.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isEqual } from '../../../../../base/common/resources.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { findDiffEditorContainingCodeEditor } from '../../../../../editor/browser/widget/diffEditor/commands.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IModifiedFileEntry } from '../../common/chatEditingService.js';

export function isTextDiffEditorForEntry(accessor: ServicesAccessor, entry: IModifiedFileEntry, editor: ICodeEditor) {
	const diffEditor = findDiffEditorContainingCodeEditor(accessor, editor);
	if (!diffEditor) {
		return false;
	}
	const originalModel = diffEditor.getOriginalEditor().getModel();
	const modifiedModel = diffEditor.getModifiedEditor().getModel();
	return isEqual(originalModel?.uri, entry.originalURI) && isEqual(modifiedModel?.uri, entry.modifiedURI);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { basename } from '../../../../../base/common/resources.js';
import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { isCodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { EditorContextKeys } from '../../../../../editor/common/editorContextKeys.js';
import { isLocation, Location } from '../../../../../editor/common/languages.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { ILanguageFeaturesService } from '../../../../../editor/common/services/languageFeatures.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, IAction2Options, MenuId, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { EditorActivation } from '../../../../../platform/editor/common/editor.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IEditorPane } from '../../../../common/editor.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IAgentSessionsService } from '../agentSessions/agentSessionsService.js';
import { isChatViewTitleActionContext } from '../../common/chatActions.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { applyingChatEditsFailedContextKey, CHAT_EDITING_MULTI_DIFF_SOURCE_RESOLVER_SCHEME, chatEditingResourceContextKey, chatEditingWidgetFileStateContextKey, decidedChatEditingResourceContextKey, hasAppliedChatEditsContextKey, hasUndecidedChatEditingResourceContextKey, IChatEditingService, IChatEditingSession, ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { IChatService } from '../../common/chatService.js';
import { isChatTreeItem, isRequestVM, isResponseVM } from '../../common/chatViewModel.js';
import { ChatAgentLocation, ChatConfiguration, ChatModeKind } from '../../common/constants.js';
import { CHAT_CATEGORY } from '../actions/chatActions.js';
import { ChatTreeItem, IChatWidget, IChatWidgetService } from '../chat.js';

export abstract class EditingSessionAction extends Action2 {

	constructor(opts: Readonly<IAction2Options>) {
		super({
			category: CHAT_CATEGORY,
			...opts
		});
	}

	run(accessor: ServicesAccessor, ...args: unknown[]) {
		const context = getEditingSessionContext(accessor, args);
		if (!context || !context.editingSession) {
			return;
		}

		return this.runEditingSessionAction(accessor, context.editingSession, context.chatWidget, ...args);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	abstract runEditingSessionAction(accessor: ServicesAccessor, editingSession: IChatEditingSession, chatWidget: IChatWidget, ...args: unknown[]): any;
}

/**
 * Resolve view title toolbar context. If none, return context from the lastFocusedWidget.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getEditingSessionContext(accessor: ServicesAccessor, args: any[]): { editingSession?: IChatEditingSession; chatWidget: IChatWidget } | undefined {
	const arg0 = args.at(0);
	const context = isChatViewTitleActionContext(arg0) ? arg0 : undefined;

	const chatWidgetService = accessor.get(IChatWidgetService);
	const chatEditingService = accessor.get(IChatEditingService);
	let chatWidget = context ? chatWidgetService.getWidgetBySessionResource(context.sessionResource) : undefined;
	if (!chatWidget) {
		chatWidget = chatWidgetService.lastFocusedWidget ?? chatWidgetService.getWidgetsByLocations(ChatAgentLocation.Chat).find(w => w.supportsChangingModes);
	}

	if (!chatWidget?.viewModel) {
		return;
	}

	const editingSession = chatEditingService.getEditingSession(chatWidget.viewModel.model.sessionResource);
	return { editingSession, chatWidget };
}


abstract class WorkingSetAction extends EditingSessionAction {

	runEditingSessionAction(accessor: ServicesAccessor, editingSession: IChatEditingSession, chatWidget: IChatWidget, ...args: unknown[]) {

		const uris: URI[] = [];
		if (URI.isUri(args[0])) {
			uris.push(args[0]);
		} else if (chatWidget) {
			uris.push(...chatWidget.input.selectedElements);
		}
		if (!uris.length) {
			return;
		}

		return this.runWorkingSetAction(accessor, editingSession, chatWidget, ...uris);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	abstract runWorkingSetAction(accessor: ServicesAccessor, editingSession: IChatEditingSession, chatWidget: IChatWidget | undefined, ...uris: URI[]): any;
}

registerAction2(class OpenFileInDiffAction extends WorkingSetAction {
	constructor() {
		super({
			id: 'chatEditing.openFileInDiff',
			title: localize2('open.fileInDiff', 'Open Changes in Diff Editor'),
			icon: Codicon.diffSingle,
			menu: [{
				id: MenuId.ChatEditingWidgetModifiedFilesToolbar,
				when: ContextKeyExpr.equals(chatEditingWidgetFileStateContextKey.key, ModifiedFileEntryState.Modified),
				order: 2,
				group: 'navigation'
			}],
		});
	}

	async runWorkingSetAction(accessor: ServicesAccessor, currentEditingSession: IChatEditingSession, _chatWidget: IChatWidget, ...uris: URI[]): Promise<void> {
		const editorService = accessor.get(IEditorService);


		for (const uri of uris) {

			let pane: IEditorPane | undefined = editorService.activeEditorPane;
			if (!pane) {
				pane = await editorService.openEditor({ resource: uri });
			}

			if (!pane) {
				return;
			}

			const editedFile = currentEditingSession.getEntry(uri);
			editedFile?.getEditorIntegration(pane).toggleDiff(undefined, true);
		}
	}
});

registerAction2(class AcceptAction extends WorkingSetAction {
	constructor() {
		super({
			id: 'chatEditing.acceptFile',
			title: localize2('accept.file', 'Keep'),
			icon: Codicon.check,
			menu: [{
				when: ContextKeyExpr.and(ContextKeyExpr.equals('resourceScheme', CHAT_EDITING_MULTI_DIFF_SOURCE_RESOLVER_SCHEME), ContextKeyExpr.notIn(chatEditingResourceContextKey.key, decidedChatEditingResourceContextKey.key)),
				id: MenuId.MultiDiffEditorFileToolbar,
				order: 0,
				group: 'navigation',
			}, {
				id: MenuId.ChatEditingWidgetModifiedFilesToolbar,
				when: ContextKeyExpr.equals(chatEditingWidgetFileStateContextKey.key, ModifiedFileEntryState.Modified),
				order: 0,
				group: 'navigation'
			}],
		});
	}

	async runWorkingSetAction(accessor: ServicesAccessor, currentEditingSession: IChatEditingSession, chatWidget: IChatWidget, ...uris: URI[]): Promise<void> {
		await currentEditingSession.accept(...uris);
	}
});

registerAction2(class DiscardAction extends WorkingSetAction {
	constructor() {
		super({
			id: 'chatEditing.discardFile',
			title: localize2('discard.file', 'Undo'),
			icon: Codicon.discard,
			menu: [{
				when: ContextKeyExpr.and(ContextKeyExpr.equals('resourceScheme', CHAT_EDITING_MULTI_DIFF_SOURCE_RESOLVER_SCHEME), ContextKeyExpr.notIn(chatEditingResourceContextKey.key, decidedChatEditingResourceContextKey.key)),
				id: MenuId.MultiDiffEditorFileToolbar,
				order: 2,
				group: 'navigation',
			}, {
				id: MenuId.ChatEditingWidgetModifiedFilesToolbar,
				when: ContextKeyExpr.equals(chatEditingWidgetFileStateContextKey.key, ModifiedFileEntryState.Modified),
				order: 1,
				group: 'navigation'
			}],
		});
	}

	async runWorkingSetAction(accessor: ServicesAccessor, currentEditingSession: IChatEditingSession, chatWidget: IChatWidget, ...uris: URI[]): Promise<void> {
		await currentEditingSession.reject(...uris);
	}
});

export class ChatEditingAcceptAllAction extends EditingSessionAction {

	constructor() {
		super({
			id: 'chatEditing.acceptAllFiles',
			title: localize('accept', 'Keep'),
			icon: Codicon.check,
			tooltip: localize('acceptAllEdits', 'Keep All Edits'),
			precondition: hasUndecidedChatEditingResourceContextKey,
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyCode.Enter,
				when: ContextKeyExpr.and(hasUndecidedChatEditingResourceContextKey, ChatContextKeys.inChatInput),
				weight: KeybindingWeight.WorkbenchContrib,
			},
			menu: [

				{
					id: MenuId.ChatEditingWidgetToolbar,
					group: 'navigation',
					order: 0,
					when: ContextKeyExpr.and(applyingChatEditsFailedContextKey.negate(), ContextKeyExpr.and(hasUndecidedChatEditingResourceContextKey))
				}
			]
		});
	}

	override async runEditingSessionAction(accessor: ServicesAccessor, editingSession: IChatEditingSession, chatWidget: IChatWidget, ...args: unknown[]) {
		await editingSession.accept();
	}
}
registerAction2(ChatEditingAcceptAllAction);

export class ChatEditingDiscardAllAction extends EditingSessionAction {

	constructor() {
		super({
			id: 'chatEditing.discardAllFiles',
			title: localize('discard', 'Undo'),
			icon: Codicon.discard,
			tooltip: localize('discardAllEdits', 'Undo All Edits'),
			precondition: hasUndecidedChatEditingResourceContextKey,
			menu: [
				{
					id: MenuId.ChatEditingWidgetToolbar,
					group: 'navigation',
					order: 1,
					when: ContextKeyExpr.and(applyingChatEditsFailedContextKey.negate(), hasUndecidedChatEditingResourceContextKey)
				}
			],
			keybinding: {
				when: ContextKeyExpr.and(hasUndecidedChatEditingResourceContextKey, ChatContextKeys.inChatInput, ChatContextKeys.inputHasText.negate()),
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.Backspace,
			},
		});
	}

	override async runEditingSessionAction(accessor: ServicesAccessor, editingSession: IChatEditingSession, chatWidget: IChatWidget, ...args: unknown[]) {
		await discardAllEditsWithConfirmation(accessor, editingSession);
	}
}
registerAction2(ChatEditingDiscardAllAction);

export async function discardAllEditsWithConfirmation(accessor: ServicesAccessor, currentEditingSession: IChatEditingSession): Promise<boolean> {

	const dialogService = accessor.get(IDialogService);

	// Ask for confirmation if there are any edits
	const entries = currentEditingSession.entries.get().filter(e => e.state.get() === ModifiedFileEntryState.Modified);
	if (entries.length > 0) {
		const confirmation = await dialogService.confirm({
			title: localize('chat.editing.discardAll.confirmation.title', "Undo all edits?"),
			message: entries.length === 1
				? localize('chat.editing.discardAll.confirmation.oneFile', "This will undo changes made in {0}. Do you want to proceed?", basename(entries[0].modifiedURI))
				: localize('chat.editing.discardAll.confirmation.manyFiles', "This will undo changes made in {0} files. Do you want to proceed?", entries.length),
			primaryButton: localize('chat.editing.discardAll.confirmation.primaryButton', "Yes"),
			type: 'info'
		});
		if (!confirmation.confirmed) {
			return false;
		}
	}

	await currentEditingSession.reject();
	return true;
}

export class ChatEditingShowChangesAction extends EditingSessionAction {
	static readonly ID = 'chatEditing.viewChanges';
	static readonly LABEL = localize('chatEditing.viewChanges', 'View All Edits');

	constructor() {
		super({
			id: ChatEditingShowChangesAction.ID,
			title: { value: ChatEditingShowChangesAction.LABEL, original: ChatEditingShowChangesAction.LABEL },
			tooltip: ChatEditingShowChangesAction.LABEL,
			f1: true,
			icon: Codicon.diffMultiple,
			precondition: hasUndecidedChatEditingResourceContextKey,
			menu: [
				{
					id: MenuId.ChatEditingWidgetToolbar,
					group: 'navigation',
					order: 4,
					when: ContextKeyExpr.and(applyingChatEditsFailedContextKey.negate(), ContextKeyExpr.and(hasAppliedChatEditsContextKey, hasUndecidedChatEditingResourceContextKey))
				}
			],
		});
	}

	override async runEditingSessionAction(accessor: ServicesAccessor, editingSession: IChatEditingSession, chatWidget: IChatWidget, ...args: unknown[]): Promise<void> {
		await editingSession.show();
	}
}
registerAction2(ChatEditingShowChangesAction);

export class ViewAllSessionChangesAction extends Action2 {
	static readonly ID = 'chatEditing.viewAllSessionChanges';

	constructor() {
		super({
			id: ViewAllSessionChangesAction.ID,
			title: localize2('chatEditing.viewAllSessionChanges', 'View All Changes'),
			icon: Codicon.diffMultiple,
			category: CHAT_CATEGORY,
			precondition: ChatContextKeys.hasAgentSessionChanges,
			menu: [
				{
					id: MenuId.ChatEditingSessionChangesToolbar,
					group: 'navigation',
					order: 10,
					when: ChatContextKeys.hasAgentSessionChanges
				}
			],
		});
	}

	override async run(accessor: ServicesAccessor, sessionResource?: URI): Promise<void> {
		const agentSessionsService = accessor.get(IAgentSessionsService);
		const commandService = accessor.get(ICommandService);
		if (!URI.isUri(sessionResource)) {
			return;
		}

		const session = agentSessionsService.getSession(sessionResource);
		const changes = session?.changes;
		if (!(changes instanceof Array)) {
			return;
		}

		const resources = changes
			.filter(d => d.originalUri)
			.map(d => ({ originalUri: d.originalUri!, modifiedUri: d.modifiedUri }));

		if (resources.length > 0) {
			await commandService.executeCommand('_workbench.openMultiDiffEditor', {
				multiDiffSourceUri: sessionResource.with({ scheme: sessionResource.scheme + '-worktree-changes' }),
				title: localize('chatEditing.allChanges.title', 'All Session Changes'),
				resources,
			});
		}
	}
}
registerAction2(ViewAllSessionChangesAction);

async function restoreSnapshotWithConfirmation(accessor: ServicesAccessor, item: ChatTreeItem): Promise<void> {
	const configurationService = accessor.get(IConfigurationService);
	const dialogService = accessor.get(IDialogService);
	const chatWidgetService = accessor.get(IChatWidgetService);
	const widget = chatWidgetService.getWidgetBySessionResource(item.sessionResource);
	const chatService = accessor.get(IChatService);
	const chatModel = chatService.getSession(item.sessionResource);
	if (!chatModel) {
		return;
	}

	const session = chatModel.editingSession;
	if (!session) {
		return;
	}

	const requestId = isRequestVM(item) ? item.id :
		isResponseVM(item) ? item.requestId : undefined;

	if (requestId) {
		const chatRequests = chatModel.getRequests();
		const itemIndex = chatRequests.findIndex(request => request.id === requestId);
		const editsToUndo = chatRequests.length - itemIndex;

		const requestsToRemove = chatRequests.slice(itemIndex);
		const requestIdsToRemove = new Set(requestsToRemove.map(request => request.id));
		const entriesModifiedInRequestsToRemove = session.entries.get().filter((entry) => requestIdsToRemove.has(entry.lastModifyingRequestId)) ?? [];
		const shouldPrompt = entriesModifiedInRequestsToRemove.length > 0 && configurationService.getValue('chat.editing.confirmEditRequestRemoval') === true;

		let message: string;
		if (editsToUndo === 1) {
			if (entriesModifiedInRequestsToRemove.length === 1) {
				message = localize('chat.removeLast.confirmation.message2', "This will remove your last request and undo the edits made to {0}. Do you want to proceed?", basename(entriesModifiedInRequestsToRemove[0].modifiedURI));
			} else {
				message = localize('chat.removeLast.confirmation.multipleEdits.message', "This will remove your last request and undo edits made to {0} files in your working set. Do you want to proceed?", entriesModifiedInRequestsToRemove.length);
			}
		} else {
			if (entriesModifiedInRequestsToRemove.length === 1) {
				message = localize('chat.remove.confirmation.message2', "This will remove all subsequent requests and undo edits made to {0}. Do you want to proceed?", basename(entriesModifiedInRequestsToRemove[0].modifiedURI));
			} else {
				message = localize('chat.remove.confirmation.multipleEdits.message', "This will remove all subsequent requests and undo edits made to {0} files in your working set. Do you want to proceed?", entriesModifiedInRequestsToRemove.length);
			}
		}

		const confirmation = shouldPrompt
			? await dialogService.confirm({
				title: editsToUndo === 1
					? localize('chat.removeLast.confirmation.title', "Do you want to undo your last edit?")
					: localize('chat.remove.confirmation.title', "Do you want to undo {0} edits?", editsToUndo),
				message: message,
				primaryButton: localize('chat.remove.confirmation.primaryButton', "Yes"),
				checkbox: { label: localize('chat.remove.confirmation.checkbox', "Don't ask again"), checked: false },
				type: 'info'
			})
			: { confirmed: true };

		if (!confirmation.confirmed) {
			widget?.viewModel?.model.setCheckpoint(undefined);
			return;
		}

		if (confirmation.checkboxChecked) {
			await configurationService.updateValue('chat.editing.confirmEditRequestRemoval', false);
		}

		// Restore the snapshot to what it was before the request(s) that we deleted
		const snapshotRequestId = chatRequests[itemIndex].id;
		await session.restoreSnapshot(snapshotRequestId, undefined);
	}
}

registerAction2(class RemoveAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.chat.undoEdits',
			title: localize2('chat.undoEdits.label', "Undo Requests"),
			f1: false,
			category: CHAT_CATEGORY,
			icon: Codicon.discard,
			keybinding: {
				primary: KeyCode.Delete,
				mac: {
					primary: KeyMod.CtrlCmd | KeyCode.Backspace,
				},
				when: ContextKeyExpr.and(ChatContextKeys.inChatSession, EditorContextKeys.textInputFocus.negate()),
				weight: KeybindingWeight.WorkbenchContrib,
			},
			menu: [
				{
					id: MenuId.ChatMessageTitle,
					group: 'navigation',
					order: 2,
					when: ContextKeyExpr.and(ContextKeyExpr.equals(`config.${ChatConfiguration.EditRequests}`, 'input').negate(), ContextKeyExpr.equals(`config.${ChatConfiguration.CheckpointsEnabled}`, false), ChatContextKeys.lockedToCodingAgent.negate()),
				}
			]
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		let item = args[0] as ChatTreeItem | undefined;
		const chatWidgetService = accessor.get(IChatWidgetService);
		const configurationService = accessor.get(IConfigurationService);
		const widget = (isChatTreeItem(item) && chatWidgetService.getWidgetBySessionResource(item.sessionResource)) || chatWidgetService.lastFocusedWidget;
		if (!isResponseVM(item) && !isRequestVM(item)) {
			item = widget?.getFocus();
		}

		if (!item) {
			return;
		}

		await restoreSnapshotWithConfirmation(accessor, item);

		if (isRequestVM(item) && configurationService.getValue('chat.undoRequests.restoreInput')) {
			widget?.focusInput();
			widget?.input.setValue(item.messageText, false);
		}
	}
});

registerAction2(class RestoreCheckpointAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.chat.restoreCheckpoint',
			title: localize2('chat.restoreCheckpoint.label', "Restore Checkpoint"),
			tooltip: localize2('chat.restoreCheckpoint.tooltip', "Restores workspace and chat to this point"),
			f1: false,
			category: CHAT_CATEGORY,
			keybinding: {
				primary: KeyCode.Delete,
				mac: {
					primary: KeyMod.CtrlCmd | KeyCode.Backspace,
				},
				when: ContextKeyExpr.and(ChatContextKeys.inChatSession, EditorContextKeys.textInputFocus.negate()),
				weight: KeybindingWeight.WorkbenchContrib,
			},
			menu: [
				{
					id: MenuId.ChatMessageCheckpoint,
					group: 'navigation',
					order: 2,
					when: ContextKeyExpr.and(ChatContextKeys.isRequest, ChatContextKeys.lockedToCodingAgent.negate())
				}
			]
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		let item = args[0] as ChatTreeItem | undefined;
		const chatWidgetService = accessor.get(IChatWidgetService);
		const widget = (isChatTreeItem(item) && chatWidgetService.getWidgetBySessionResource(item.sessionResource)) || chatWidgetService.lastFocusedWidget;
		if (!isResponseVM(item) && !isRequestVM(item)) {
			item = widget?.getFocus();
		}

		if (!item) {
			return;
		}

		if (isRequestVM(item)) {
			widget?.focusInput();
			widget?.input.setValue(item.messageText, false);
		}

		widget?.viewModel?.model.setCheckpoint(item.id);
		await restoreSnapshotWithConfirmation(accessor, item);
	}
});

registerAction2(class RestoreLastCheckpoint extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.chat.restoreLastCheckpoint',
			title: localize2('chat.restoreLastCheckpoint.label', "Restore to Last Checkpoint"),
			f1: false,
			category: CHAT_CATEGORY,
			icon: Codicon.discard,
			menu: [
				{
					id: MenuId.ChatMessageFooter,
					group: 'navigation',
					order: 1,
					when: ContextKeyExpr.and(ContextKeyExpr.in(ChatContextKeys.itemId.key, ChatContextKeys.lastItemId.key), ContextKeyExpr.equals(`config.${ChatConfiguration.CheckpointsEnabled}`, true), ChatContextKeys.lockedToCodingAgent.negate()),
				}
			]
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		let item = args[0] as ChatTreeItem | undefined;
		const chatWidgetService = accessor.get(IChatWidgetService);
		const chatService = accessor.get(IChatService);
		const widget = (isChatTreeItem(item) && chatWidgetService.getWidgetBySessionResource(item.sessionResource)) || chatWidgetService.lastFocusedWidget;
		if (!isResponseVM(item) && !isRequestVM(item)) {
			item = widget?.getFocus();
		}

		if (!item) {
			return;
		}

		const chatModel = chatService.getSession(item.sessionResource);
		if (!chatModel) {
			return;
		}

		const session = chatModel.editingSession;
		if (!session) {
			return;
		}

		await restoreSnapshotWithConfirmation(accessor, item);

		if (isResponseVM(item)) {
			widget?.viewModel?.model.setCheckpoint(item.requestId);
			const request = chatModel.getRequests().find(request => request.id === item.requestId);
			if (request) {
				widget?.focusInput();
				widget?.input.setValue(request.message.text, false);
			}
		}
	}
});

registerAction2(class EditAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.chat.editRequests',
			title: localize2('chat.editRequests.label', "Edit Request"),
			f1: false,
			category: CHAT_CATEGORY,
			icon: Codicon.edit,
			keybinding: {
				primary: KeyCode.Enter,
				when: ContextKeyExpr.and(ChatContextKeys.inChatSession, EditorContextKeys.textInputFocus.negate()),
				weight: KeybindingWeight.WorkbenchContrib,
			},
			menu: [
				{
					id: MenuId.ChatMessageTitle,
					group: 'navigation',
					order: 2,
					when: ContextKeyExpr.and(ContextKeyExpr.or(ContextKeyExpr.equals(`config.${ChatConfiguration.EditRequests}`, 'hover'), ContextKeyExpr.equals(`config.${ChatConfiguration.EditRequests}`, 'input')))
				}
			]
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]) {
		let item = args[0] as ChatTreeItem | undefined;
		const chatWidgetService = accessor.get(IChatWidgetService);
		const widget = (isChatTreeItem(item) && chatWidgetService.getWidgetBySessionResource(item.sessionResource)) || chatWidgetService.lastFocusedWidget;
		if (!isResponseVM(item) && !isRequestVM(item)) {
			item = widget?.getFocus();
		}

		if (!item) {
			return;
		}

		if (isRequestVM(item)) {
			widget?.startEditing(item.id);
		}
	}
});

export interface ChatEditingActionContext {
	readonly sessionResource: URI;
	readonly requestId: string;
	readonly uri: URI;
	readonly stopId: string | undefined;
}

registerAction2(class OpenWorkingSetHistoryAction extends Action2 {

	static readonly id = 'chat.openFileUpdatedBySnapshot';
	constructor() {
		super({
			id: OpenWorkingSetHistoryAction.id,
			title: localize('chat.openFileUpdatedBySnapshot.label', "Open File"),
			menu: [{
				id: MenuId.ChatEditingCodeBlockContext,
				group: 'navigation',
				order: 0,
			},]
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const context = args[0] as ChatEditingActionContext | undefined;
		if (!context?.sessionResource) {
			return;
		}

		const editorService = accessor.get(IEditorService);
		await editorService.openEditor({ resource: context.uri });
	}
});

registerAction2(class OpenWorkingSetHistoryAction extends Action2 {

	static readonly id = 'chat.openFileSnapshot';
	constructor() {
		super({
			id: OpenWorkingSetHistoryAction.id,
			title: localize('chat.openSnapshot.label', "Open File Snapshot"),
			menu: [{
				id: MenuId.ChatEditingCodeBlockContext,
				group: 'navigation',
				order: 1,
			},]
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const context = args[0] as ChatEditingActionContext | undefined;
		if (!context?.sessionResource) {
			return;
		}

		const chatService = accessor.get(IChatService);
		const chatEditingService = accessor.get(IChatEditingService);
		const editorService = accessor.get(IEditorService);

		const chatModel = chatService.getSession(context.sessionResource);
		if (!chatModel) {
			return;
		}

		const snapshot = chatEditingService.getEditingSession(chatModel.sessionResource)?.getSnapshotUri(context.requestId, context.uri, context.stopId);
		if (snapshot) {
			const editor = await editorService.openEditor({ resource: snapshot, label: localize('chatEditing.snapshot', '{0} (Snapshot)', basename(context.uri)), options: { activation: EditorActivation.ACTIVATE } });
			if (isCodeEditor(editor)) {
				editor.updateOptions({ readOnly: true });
			}
		}
	}
});

registerAction2(class ResolveSymbolsContextAction extends EditingSessionAction {
	constructor() {
		super({
			id: 'workbench.action.edits.addFilesFromReferences',
			title: localize2('addFilesFromReferences', "Add Files From References"),
			f1: false,
			category: CHAT_CATEGORY,
			menu: {
				id: MenuId.ChatInputSymbolAttachmentContext,
				group: 'navigation',
				order: 1,
				when: ContextKeyExpr.and(ChatContextKeys.chatModeKind.isEqualTo(ChatModeKind.Ask), EditorContextKeys.hasReferenceProvider)
			}
		});
	}

	override async runEditingSessionAction(accessor: ServicesAccessor, editingSession: IChatEditingSession, chatWidget: IChatWidget, ...args: unknown[]): Promise<void> {
		if (args.length === 0 || !isLocation(args[0])) {
			return;
		}

		const textModelService = accessor.get(ITextModelService);
		const languageFeaturesService = accessor.get(ILanguageFeaturesService);
		const symbol = args[0] as Location;

		const modelReference = await textModelService.createModelReference(symbol.uri);
		const textModel = modelReference.object.textEditorModel;
		if (!textModel) {
			return;
		}

		const position = new Position(symbol.range.startLineNumber, symbol.range.startColumn);

		const [references, definitions, implementations] = await Promise.all([
			this.getReferences(position, textModel, languageFeaturesService),
			this.getDefinitions(position, textModel, languageFeaturesService),
			this.getImplementations(position, textModel, languageFeaturesService)
		]);

		// Sort the references, definitions and implementations by
		// how important it is that they make it into the working set as it has limited size
		const attachments = [];
		for (const reference of [...definitions, ...implementations, ...references]) {
			attachments.push(chatWidget.attachmentModel.asFileVariableEntry(reference.uri));
		}

		chatWidget.attachmentModel.addContext(...attachments);
	}

	private async getReferences(position: Position, textModel: ITextModel, languageFeaturesService: ILanguageFeaturesService): Promise<Location[]> {
		const referenceProviders = languageFeaturesService.referenceProvider.all(textModel);

		const references = await Promise.all(referenceProviders.map(async (referenceProvider) => {
			return await referenceProvider.provideReferences(textModel, position, { includeDeclaration: true }, CancellationToken.None) ?? [];
		}));

		return references.flat();
	}

	private async getDefinitions(position: Position, textModel: ITextModel, languageFeaturesService: ILanguageFeaturesService): Promise<Location[]> {
		const definitionProviders = languageFeaturesService.definitionProvider.all(textModel);

		const definitions = await Promise.all(definitionProviders.map(async (definitionProvider) => {
			return await definitionProvider.provideDefinition(textModel, position, CancellationToken.None) ?? [];
		}));

		return definitions.flat();
	}

	private async getImplementations(position: Position, textModel: ITextModel, languageFeaturesService: ILanguageFeaturesService): Promise<Location[]> {
		const implementationProviders = languageFeaturesService.implementationProvider.all(textModel);

		const implementations = await Promise.all(implementationProviders.map(async (implementationProvider) => {
			return await implementationProvider.provideImplementation(textModel, position, CancellationToken.None) ?? [];
		}));

		return implementations.flat();
	}
});

export class ViewPreviousEditsAction extends EditingSessionAction {
	static readonly Id = 'chatEditing.viewPreviousEdits';
	static readonly Label = localize('chatEditing.viewPreviousEdits', 'View Previous Edits');

	constructor() {
		super({
			id: ViewPreviousEditsAction.Id,
			title: { value: ViewPreviousEditsAction.Label, original: ViewPreviousEditsAction.Label },
			tooltip: ViewPreviousEditsAction.Label,
			f1: true,
			icon: Codicon.diffMultiple,
			precondition: ContextKeyExpr.and(ChatContextKeys.enabled, hasUndecidedChatEditingResourceContextKey.negate()),
			menu: [
				{
					id: MenuId.ChatEditingWidgetToolbar,
					group: 'navigation',
					order: 4,
					when: ContextKeyExpr.and(applyingChatEditsFailedContextKey.negate(), ContextKeyExpr.and(hasAppliedChatEditsContextKey, hasUndecidedChatEditingResourceContextKey.negate()))
				}
			],
		});
	}

	override async runEditingSessionAction(accessor: ServicesAccessor, editingSession: IChatEditingSession, chatWidget: IChatWidget, ...args: unknown[]): Promise<void> {
		await editingSession.show(true);
	}
}
registerAction2(ViewPreviousEditsAction);

/**
 * Workbench command to explore accepting working set changes from an extension. Executing
 * the command will accept the changes for the provided resources across all edit sessions.
 */
CommandsRegistry.registerCommand('_chat.editSessions.accept', async (accessor: ServicesAccessor, resources: UriComponents[]) => {
	if (resources.length === 0) {
		return;
	}

	const uris = resources.map(resource => URI.revive(resource));
	const chatEditingService = accessor.get(IChatEditingService);
	for (const editingSession of chatEditingService.editingSessionsObs.get()) {
		await editingSession.accept(...uris);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingCheckpointTimeline.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingCheckpointTimeline.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../../base/common/buffer.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, IReader, ITransaction } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { IEditSessionDiffStats, IEditSessionEntryDiff } from '../../common/chatEditingService.js';
import { IChatRequestDisablement } from '../../common/chatModel.js';
import { FileOperation, IChatEditingTimelineState, IFileBaseline } from './chatEditingOperations.js';

/**
 * Interface for the new checkpoint-based timeline system
 */
export interface IChatEditingCheckpointTimeline {
	readonly requestDisablement: IObservable<IChatRequestDisablement[]>;
	readonly canUndo: IObservable<boolean>;
	readonly canRedo: IObservable<boolean>;

	// Checkpoint management
	createCheckpoint(requestId: string | undefined, undoStopId: string | undefined, label: string, description?: string): void;
	navigateToCheckpoint(checkpointId: string): Promise<void>;
	undoToLastCheckpoint(): Promise<void>;
	redoToNextCheckpoint(): Promise<void>;
	getCheckpointIdForRequest(requestId: string, undoStopId?: string): string | undefined;

	// Operation tracking
	recordFileOperation(operation: FileOperation): void;
	incrementEpoch(): number;

	// File baselines
	recordFileBaseline(baseline: IFileBaseline): void;
	hasFileBaseline(uri: URI, requestId: string): boolean;

	// State reconstruction
	getContentURIAtStop(requestId: string, fileURI: URI, stopId: string | undefined): URI;
	getContentAtStop(requestId: string, contentURI: URI, stopId: string | undefined): Promise<string | VSBuffer | undefined>;
	onDidChangeContentsAtStop(requestId: string, contentURI: URI, stopId: string | undefined, callback: (data: string) => void): IDisposable;

	// Persistence
	getStateForPersistence(): IChatEditingTimelineState;
	restoreFromState(state: IChatEditingTimelineState, tx: ITransaction): void;

	// Diffing
	getEntryDiffBetweenStops(uri: URI, requestId: string | undefined, stopId: string | undefined): IObservable<IEditSessionEntryDiff | undefined> | undefined;
	getEntryDiffBetweenRequests(uri: URI, startRequestId: string, stopRequestId: string): IObservable<IEditSessionEntryDiff | undefined>;
	getDiffsForFilesInRequest(requestId: string): IObservable<readonly IEditSessionEntryDiff[]>;
	getDiffsForFilesInSession(): IObservable<readonly IEditSessionEntryDiff[]>;
	getDiffForSession(): IObservable<IEditSessionDiffStats>;
	hasEditsInRequest(requestId: string, reader?: IReader): boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingCheckpointTimelineImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingCheckpointTimelineImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals as arraysEqual } from '../../../../../base/common/arrays.js';
import { findFirst, findLast, findLastIdx } from '../../../../../base/common/arraysFind.js';
import { assertNever } from '../../../../../base/common/assert.js';
import { ThrottledDelayer } from '../../../../../base/common/async.js';
import { Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { mapsStrictEqualIgnoreOrder, ResourceMap, ResourceSet } from '../../../../../base/common/map.js';
import { equals as objectsEqual } from '../../../../../base/common/objects.js';
import { constObservable, derived, derivedOpts, IObservable, IReader, ITransaction, ObservablePromise, observableSignalFromEvent, observableValue, observableValueOpts, transaction } from '../../../../../base/common/observable.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { isDefined, Mutable } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { TextEdit } from '../../../../../editor/common/languages.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { TextModel } from '../../../../../editor/common/model/textModel.js';
import { IEditorWorkerService } from '../../../../../editor/common/services/editorWorker.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { CellEditType, CellUri, INotebookTextModel } from '../../../notebook/common/notebookCommon.js';
import { INotebookEditorModelResolverService } from '../../../notebook/common/notebookEditorModelResolverService.js';
import { INotebookService } from '../../../notebook/common/notebookService.js';
import { emptySessionEntryDiff, IEditSessionDiffStats, IEditSessionEntryDiff, IModifiedEntryTelemetryInfo } from '../../common/chatEditingService.js';
import { IChatRequestDisablement } from '../../common/chatModel.js';
import { IChatEditingCheckpointTimeline } from './chatEditingCheckpointTimeline.js';
import { FileOperation, FileOperationType, IChatEditingTimelineState, ICheckpoint, IFileBaseline, IReconstructedFileExistsState, IReconstructedFileNotExistsState, IReconstructedFileState } from './chatEditingOperations.js';
import { ChatEditingSnapshotTextModelContentProvider } from './chatEditingTextModelContentProviders.js';
import { createSnapshot as createNotebookSnapshot, restoreSnapshot as restoreNotebookSnapshot } from './notebook/chatEditingModifiedNotebookSnapshot.js';

const START_REQUEST_EPOCH = '$$start';
const STOP_ID_EPOCH_PREFIX = '__epoch_';

type IReconstructedFileStateWithNotebook = IReconstructedFileNotExistsState | (Mutable<IReconstructedFileExistsState> & { notebook?: INotebookTextModel });

/**
 * A filesystem delegate used by the checkpointing timeline such that
 * navigating in the timeline tracks the changes as agent-initiated.
 */
export interface IChatEditingTimelineFsDelegate {
	/** Creates a file with initial content. */
	createFile: (uri: URI, initialContent: string) => Promise<unknown>;
	/** Delete a URI */
	deleteFile: (uri: URI) => Promise<void>;
	/** Rename a URI, retaining contents */
	renameFile: (fromUri: URI, toUri: URI) => Promise<void>;
	/** Set a URI contents, should create it if it does not already exist */
	setContents(uri: URI, content: string, telemetryInfo: IModifiedEntryTelemetryInfo): Promise<void>;
}

/**
 * Implementation of the checkpoint-based timeline system.
 *
 * Invariants:
 * - There is at most one checkpoint or operation per epoch
 * - _checkpoints and _operations are always sorted in ascending order by epoch
 * - _currentEpoch being equal to the epoch of an operation means that
 *   operation is _not_ currently applied
 */
export class ChatEditingCheckpointTimelineImpl implements IChatEditingCheckpointTimeline {

	private _epochCounter = 0;
	private readonly _checkpoints = observableValue<readonly ICheckpoint[]>(this, []);
	private readonly _currentEpoch = observableValue<number>(this, 0);
	private readonly _operations = observableValueOpts<FileOperation[]>({ equalsFn: () => false }, []); // mutable
	private readonly _fileBaselines = new Map<string, IFileBaseline>(); // key: `${uri}::${requestId}`
	private readonly _refCountedDiffs = new Map<string, IObservable<IEditSessionEntryDiff | undefined>>();

	/** Gets the checkpoint, if any, we can 'undo' to. */
	private readonly _willUndoToCheckpoint = derived(reader => {
		const currentEpoch = this._currentEpoch.read(reader);
		const checkpoints = this._checkpoints.read(reader);
		if (checkpoints.length < 2 || currentEpoch <= checkpoints[1].epoch) {
			return undefined;
		}

		const operations = this._operations.read(reader);

		// Undo either to right before the current request...
		const currentCheckpointIdx = findLastIdx(checkpoints, cp => cp.epoch < currentEpoch);
		const startOfRequest = currentCheckpointIdx === -1 ? undefined : findLast(checkpoints, cp => cp.undoStopId === undefined, currentCheckpointIdx);

		// Or to the checkpoint before the last operation in this request
		const previousOperation = findLast(operations, op => op.epoch < currentEpoch);
		const previousCheckpoint = previousOperation && findLast(checkpoints, cp => cp.epoch < previousOperation.epoch);

		if (!startOfRequest) {
			return previousCheckpoint;
		}
		if (!previousCheckpoint) {
			return startOfRequest;
		}

		// Special case: if we're undoing the first edit operation, undo the entire request
		if (!operations.some(op => op.epoch > startOfRequest.epoch && op.epoch < previousCheckpoint!.epoch)) {
			return startOfRequest;
		}

		return previousCheckpoint.epoch > startOfRequest.epoch ? previousCheckpoint : startOfRequest;
	});

	public readonly canUndo: IObservable<boolean> = this._willUndoToCheckpoint.map(cp => !!cp);


	/**
	 * Gets the epoch we'll redo this. Unlike undo this doesn't only use checkpoints
	 * because we could potentially redo to a 'tip' operation that's not checkpointed yet.
	 */
	private readonly _willRedoToEpoch = derived(reader => {
		const currentEpoch = this._currentEpoch.read(reader);
		const operations = this._operations.read(reader);
		const checkpoints = this._checkpoints.read(reader);
		const maxEncounteredEpoch = Math.max(operations.at(-1)?.epoch || 0, checkpoints.at(-1)?.epoch || 0);
		if (currentEpoch > maxEncounteredEpoch) {
			return undefined;
		}

		// Find the next edit operation that would be applied...
		const nextOperation = operations.find(op => op.epoch >= currentEpoch);
		const nextCheckpoint = nextOperation && checkpoints.find(op => op.epoch > nextOperation.epoch);

		// And figure out where we're going if we're navigating across request
		// 1. If there is no next request or if the next target checkpoint is in
		//    the next request, navigate there.
		// 2. Otherwise, navigate to the end of the next request.
		const currentCheckpoint = findLast(checkpoints, cp => cp.epoch < currentEpoch);
		if (currentCheckpoint && nextOperation && currentCheckpoint.requestId !== nextOperation.requestId) {
			const startOfNextRequestIdx = findLastIdx(checkpoints, (cp, i) =>
				cp.undoStopId === undefined && (checkpoints[i - 1]?.requestId === currentCheckpoint.requestId));
			const startOfNextRequest = startOfNextRequestIdx === -1 ? undefined : checkpoints[startOfNextRequestIdx];

			if (startOfNextRequest && nextOperation.requestId !== startOfNextRequest.requestId) {
				const requestAfterTheNext = findFirst(checkpoints, op => op.undoStopId === undefined, startOfNextRequestIdx + 1);
				if (requestAfterTheNext) {
					return requestAfterTheNext.epoch;
				}
			}
		}

		return Math.min(
			nextCheckpoint?.epoch || Infinity,
			(maxEncounteredEpoch + 1),
		);
	});

	public readonly canRedo: IObservable<boolean> = this._willRedoToEpoch.map(e => !!e);

	public readonly requestDisablement: IObservable<IChatRequestDisablement[]> = derivedOpts(
		{ equalsFn: (a, b) => arraysEqual(a, b, objectsEqual) },
		reader => {
			const currentEpoch = this._currentEpoch.read(reader);
			const operations = this._operations.read(reader);
			const checkpoints = this._checkpoints.read(reader);

			const maxEncounteredEpoch = Math.max(operations.at(-1)?.epoch || 0, checkpoints.at(-1)?.epoch || 0);
			if (currentEpoch > maxEncounteredEpoch) {
				return []; // common case -- nothing undone
			}

			const lastAppliedOperation = findLast(operations, op => op.epoch < currentEpoch)?.epoch || 0;
			const lastAppliedRequest = findLast(checkpoints, cp => cp.epoch < currentEpoch && cp.undoStopId === undefined)?.epoch || 0;
			const stopDisablingAtEpoch = Math.max(lastAppliedOperation, lastAppliedRequest);

			const disablement = new Map<string, string | undefined>();

			// Go through the checkpoints and disable any until the one that contains the last applied operation.
			// Subtle: the request will first make a checkpoint with an 'undefined' undo
			// stop, and in this loop we'll "automatically" disable the entire request when
			// we reach that checkpoint.
			for (let i = checkpoints.length - 1; i >= 0; i--) {
				const { undoStopId, requestId, epoch } = checkpoints[i];
				if (epoch <= stopDisablingAtEpoch) {
					break;
				}

				if (requestId) {
					disablement.set(requestId, undoStopId);
				}
			}

			return [...disablement].map(([requestId, afterUndoStop]): IChatRequestDisablement => ({ requestId, afterUndoStop }));
		});

	constructor(
		private readonly chatSessionResource: URI,
		private readonly _delegate: IChatEditingTimelineFsDelegate,
		@INotebookEditorModelResolverService private readonly _notebookEditorModelResolverService: INotebookEditorModelResolverService,
		@INotebookService private readonly _notebookService: INotebookService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IModelService private readonly _modelService: IModelService,
		@ITextModelService private readonly _textModelService: ITextModelService,
		@IEditorWorkerService private readonly _editorWorkerService: IEditorWorkerService,
		@IConfigurationService private readonly _configurationService: IConfigurationService
	) {
		this.createCheckpoint(undefined, undefined, 'Initial State', 'Starting point before any edits');
	}

	public createCheckpoint(requestId: string | undefined, undoStopId: string | undefined, label: string, description?: string): string {
		const existingCheckpoints = this._checkpoints.get();
		const existing = existingCheckpoints.find(c => c.undoStopId === undoStopId && c.requestId === requestId);
		if (existing) {
			return existing.checkpointId;
		}

		const { checkpoints, operations } = this._getVisibleOperationsAndCheckpoints();
		const checkpointId = generateUuid();
		const epoch = this.incrementEpoch();

		checkpoints.push({
			checkpointId,
			requestId,
			undoStopId,
			epoch,
			label,
			description
		});

		transaction(tx => {
			this._checkpoints.set(checkpoints, tx);
			this._operations.set(operations, tx);
			this._currentEpoch.set(epoch + 1, tx);
		});

		return checkpointId;
	}

	public async undoToLastCheckpoint(): Promise<void> {
		const checkpoint = this._willUndoToCheckpoint.get();
		if (checkpoint) {
			await this.navigateToCheckpoint(checkpoint.checkpointId);
		}
	}

	public async redoToNextCheckpoint(): Promise<void> {
		const targetEpoch = this._willRedoToEpoch.get();
		if (targetEpoch) {
			await this._navigateToEpoch(targetEpoch);
		}
	}

	public navigateToCheckpoint(checkpointId: string): Promise<void> {
		const targetCheckpoint = this._getCheckpoint(checkpointId);
		if (!targetCheckpoint) {
			throw new Error(`Checkpoint ${checkpointId} not found`);
		}

		if (targetCheckpoint.undoStopId === undefined) {
			// If we're navigating to the start of a request, we want to restore the file
			// to whatever baseline we captured, _not_ the result state from the prior request
			// because there may have been user changes in the meantime. But we still want
			// to set the epoch marking that checkpoint as having been undone (the second
			// arg below) so that disablement works and so it's discarded if appropriate later.
			return this._navigateToEpoch(targetCheckpoint.epoch + 1, targetCheckpoint.epoch);
		} else {
			return this._navigateToEpoch(targetCheckpoint.epoch + 1);
		}

	}

	public getContentURIAtStop(requestId: string, fileURI: URI, stopId: string | undefined): URI {
		return ChatEditingSnapshotTextModelContentProvider.getSnapshotFileURI(this.chatSessionResource, requestId, stopId, fileURI.path);
	}

	private async _navigateToEpoch(restoreToEpoch: number, navigateToEpoch = restoreToEpoch): Promise<void> {
		const currentEpoch = this._currentEpoch.get();
		if (currentEpoch !== restoreToEpoch) {
			const urisToRestore = await this._applyFileSystemOperations(currentEpoch, restoreToEpoch);

			// Reconstruct content for files affected by operations in the range
			await this._reconstructAllFileContents(restoreToEpoch, urisToRestore);
		}

		// Update current epoch
		this._currentEpoch.set(navigateToEpoch, undefined);
	}

	private _getCheckpoint(checkpointId: string): ICheckpoint | undefined {
		return this._checkpoints.get().find(c => c.checkpointId === checkpointId);
	}

	public incrementEpoch() {
		return this._epochCounter++;
	}

	public recordFileOperation(operation: FileOperation): void {
		const { currentEpoch, checkpoints, operations } = this._getVisibleOperationsAndCheckpoints();
		if (operation.epoch < currentEpoch) {
			throw new Error(`Cannot record operation at epoch ${operation.epoch} when current epoch is ${currentEpoch}`);
		}

		operations.push(operation);
		transaction(tx => {
			this._checkpoints.set(checkpoints, tx);
			this._operations.set(operations, tx);
			this._currentEpoch.set(operation.epoch + 1, tx);
		});
	}

	private _getVisibleOperationsAndCheckpoints() {
		const currentEpoch = this._currentEpoch.get();
		const checkpoints = this._checkpoints.get();
		const operations = this._operations.get();

		return {
			currentEpoch,
			checkpoints: checkpoints.filter(c => c.epoch < currentEpoch),
			operations: operations.filter(op => op.epoch < currentEpoch)
		};
	}

	public recordFileBaseline(baseline: IFileBaseline): void {
		const key = this._getBaselineKey(baseline.uri, baseline.requestId);
		this._fileBaselines.set(key, baseline);
	}

	private _getFileBaseline(uri: URI, requestId: string): IFileBaseline | undefined {
		const key = this._getBaselineKey(uri, requestId);
		return this._fileBaselines.get(key);
	}

	public hasFileBaseline(uri: URI, requestId: string): boolean {
		const key = this._getBaselineKey(uri, requestId);
		return this._fileBaselines.has(key) || this._operations.get().some(op =>
			op.type === FileOperationType.Create && op.requestId === requestId && isEqual(uri, op.uri));
	}

	public async getContentAtStop(requestId: string, contentURI: URI, stopId: string | undefined) {
		let toEpoch: number | undefined;
		if (stopId?.startsWith(STOP_ID_EPOCH_PREFIX)) {
			toEpoch = Number(stopId.slice(STOP_ID_EPOCH_PREFIX.length));
		} else {
			toEpoch = this._checkpoints.get().find(c => c.requestId === requestId && c.undoStopId === stopId)?.epoch;
		}

		// The content URI doesn't preserve the original scheme or authority. Look through
		// to find the operation that touched that path to get its actual URI
		const fileURI = this._getTimelineCanonicalUriForPath(contentURI);

		if (!toEpoch || !fileURI) {
			return '';
		}

		const baseline = await this._findBestBaselineForFile(fileURI, toEpoch, requestId);
		if (!baseline) {
			return '';
		}

		const operations = this._getFileOperationsInRange(fileURI, baseline.epoch, toEpoch);
		const replayed = await this._replayOperations(baseline, operations);
		return replayed.exists ? replayed.content : undefined;
	}

	private _getTimelineCanonicalUriForPath(contentURI: URI) {
		for (const it of [this._fileBaselines.values(), this._operations.get()]) {
			for (const thing of it) {
				if (thing.uri.path === contentURI.path) {
					return thing.uri;
				}
			}
		}

		return undefined;
	}

	/**
	 * Creates a callback that is invoked when data at the stop changes. This
	 * will not fire initially and may be debounced internally.
	 */
	public onDidChangeContentsAtStop(requestId: string, contentURI: URI, stopId: string | undefined, callback: (data: string) => void): IDisposable {
		// The only case where we have data that updates is if we have an epoch pointer that's
		// after our know epochs (e.g. pointing to the end file state after all operations).
		// If this isn't the case, abort.
		if (!stopId || !stopId.startsWith(STOP_ID_EPOCH_PREFIX)) {
			return Disposable.None;
		}

		const target = Number(stopId.slice(STOP_ID_EPOCH_PREFIX.length));
		if (target <= this._epochCounter) {
			return Disposable.None; // already finalized
		}

		const store = new DisposableStore();
		const scheduler = store.add(new ThrottledDelayer(500));

		store.add(Event.fromObservableLight(this._operations)(() => {
			scheduler.trigger(async () => {
				if (this._operations.get().at(-1)?.epoch! >= target) {
					store.dispose();
				}

				const content = await this.getContentAtStop(requestId, contentURI, stopId);
				if (content !== undefined) {
					callback(content);
				}
			});
		}));

		return store;
	}

	private _getCheckpointBeforeEpoch(epoch: number, reader?: IReader) {
		return findLast(this._checkpoints.read(reader), c => c.epoch <= epoch);
	}

	private async _reconstructFileState(uri: URI, targetEpoch: number): Promise<IReconstructedFileState> {
		const targetCheckpoint = this._getCheckpointBeforeEpoch(targetEpoch);
		if (!targetCheckpoint) {
			throw new Error(`Checkpoint for epoch ${targetEpoch} not found`);
		}

		// Find the most appropriate baseline for this file
		const baseline = await this._findBestBaselineForFile(uri, targetEpoch, targetCheckpoint.requestId || '');
		if (!baseline) {
			// File doesn't exist at this checkpoint
			return {
				exists: false,
				uri,
			};
		}

		// Get operations that affect this file from baseline to target checkpoint
		const operations = this._getFileOperationsInRange(uri, baseline.epoch, targetEpoch);

		// Replay operations to reconstruct state
		return this._replayOperations(baseline, operations);
	}

	public getStateForPersistence(): IChatEditingTimelineState {
		return {
			checkpoints: this._checkpoints.get(),
			currentEpoch: this._currentEpoch.get(),
			fileBaselines: [...this._fileBaselines],
			operations: this._operations.get(),
			epochCounter: this._epochCounter,
		};
	}

	public restoreFromState(state: IChatEditingTimelineState, tx: ITransaction): void {
		this._checkpoints.set(state.checkpoints, tx);
		this._currentEpoch.set(state.currentEpoch, tx);
		this._operations.set(state.operations.slice(), tx);
		this._epochCounter = state.epochCounter;

		this._fileBaselines.clear();
		for (const [key, baseline] of state.fileBaselines) {
			this._fileBaselines.set(key, baseline);
		}
	}

	public getCheckpointIdForRequest(requestId: string, undoStopId?: string): string | undefined {
		const checkpoints = this._checkpoints.get();
		return checkpoints.find(c => c.requestId === requestId && c.undoStopId === undoStopId)?.checkpointId;
	}

	private async _reconstructAllFileContents(targetEpoch: number, filesToReconstruct: ResourceSet): Promise<void> {
		await Promise.all(Array.from(filesToReconstruct).map(async uri => {
			const reconstructedState = await this._reconstructFileState(uri, targetEpoch);
			if (reconstructedState.exists) {
				await this._delegate.setContents(reconstructedState.uri, reconstructedState.content, reconstructedState.telemetryInfo);
			}
		}));
	}

	private _getBaselineKey(uri: URI, requestId: string): string {
		return `${uri.toString()}::${requestId}`;
	}

	private async _findBestBaselineForFile(uri: URI, epoch: number, requestId: string): Promise<IFileBaseline | undefined> {
		// First, iterate backwards through operations before the target checkpoint
		// to see if the file was created/re-created more recently than any baseline

		let currentRequestId = requestId;
		const operations = this._operations.get();
		for (let i = operations.length - 1; i >= 0; i--) {
			const operation = operations[i];
			if (operation.epoch > epoch) {
				continue;
			}

			// If the file was just created, use that as its updated baseline
			if (operation.type === FileOperationType.Create && isEqual(operation.uri, uri)) {
				return {
					uri: operation.uri,
					requestId: operation.requestId,
					content: operation.initialContent,
					epoch: operation.epoch,
					telemetryInfo: operation.telemetryInfo,
				};
			}

			// If the file was renamed to this URI, use its old contents as the baseline
			if (operation.type === FileOperationType.Rename && isEqual(operation.newUri, uri)) {
				const prev = await this._findBestBaselineForFile(operation.oldUri, operation.epoch, operation.requestId);
				if (!prev) {
					return undefined;
				}


				const operations = this._getFileOperationsInRange(operation.oldUri, prev.epoch, operation.epoch);
				const replayed = await this._replayOperations(prev, operations);
				return {
					uri: uri,
					epoch: operation.epoch,
					content: replayed.exists ? replayed.content : '',
					requestId: operation.requestId,
					telemetryInfo: prev.telemetryInfo,
					notebookViewType: replayed.exists ? replayed.notebookViewType : undefined,
				};
			}

			// When the request ID changes, check if we have a baseline for the current request
			if (currentRequestId && operation.requestId !== currentRequestId) {
				const baseline = this._getFileBaseline(uri, currentRequestId);
				if (baseline) {
					return baseline;
				}
			}

			currentRequestId = operation.requestId;
		}

		// Check the final request ID for a baseline
		return this._getFileBaseline(uri, currentRequestId);
	}

	private _getFileOperationsInRange(uri: URI, fromEpoch: number, toEpoch: number): readonly FileOperation[] {
		return this._operations.get().filter(op => {
			const cellUri = CellUri.parse(op.uri);
			return op.epoch >= fromEpoch &&
				op.epoch < toEpoch &&
				(isEqual(op.uri, uri) || (cellUri && isEqual(cellUri.notebook, uri)));
		}).sort((a, b) => a.epoch - b.epoch);
	}

	private async _replayOperations(baseline: IFileBaseline, operations: readonly FileOperation[]): Promise<IReconstructedFileState> {
		let currentState: IReconstructedFileStateWithNotebook = {
			exists: true,
			content: baseline.content,
			uri: baseline.uri,
			telemetryInfo: baseline.telemetryInfo,
		};

		if (baseline.notebookViewType) {
			currentState.notebook = await this._notebookEditorModelResolverService.createUntitledNotebookTextModel(baseline.notebookViewType);
			if (baseline.content) {
				restoreNotebookSnapshot(currentState.notebook, baseline.content);
			}
		}

		for (const operation of operations) {
			currentState = await this._applyOperationToState(currentState, operation, baseline.telemetryInfo);
		}

		if (currentState.exists && currentState.notebook) {
			const info = await this._notebookService.withNotebookDataProvider(currentState.notebook.viewType);
			currentState.content = createNotebookSnapshot(currentState.notebook, info.serializer.options, this._configurationService);
			currentState.notebook.dispose();
		}

		return currentState;
	}

	private async _applyOperationToState(state: IReconstructedFileStateWithNotebook, operation: FileOperation, telemetryInfo: IModifiedEntryTelemetryInfo): Promise<IReconstructedFileStateWithNotebook> {
		switch (operation.type) {
			case FileOperationType.Create: {
				if (state.exists && state.notebook) {
					state.notebook.dispose();
				}

				let notebook: INotebookTextModel | undefined;
				if (operation.notebookViewType) {
					notebook = await this._notebookEditorModelResolverService.createUntitledNotebookTextModel(operation.notebookViewType);
					if (operation.initialContent) {
						restoreNotebookSnapshot(notebook, operation.initialContent);
					}
				}

				return {
					exists: true,
					content: operation.initialContent,
					uri: operation.uri,
					telemetryInfo,
					notebookViewType: operation.notebookViewType,
					notebook,
				};
			}

			case FileOperationType.Delete:
				if (state.exists && state.notebook) {
					state.notebook.dispose();
				}

				return {
					exists: false,
					uri: operation.uri
				};

			case FileOperationType.Rename:
				return {
					...state,
					uri: operation.newUri
				};

			case FileOperationType.TextEdit: {
				if (!state.exists) {
					throw new Error('Cannot apply text edits to non-existent file');
				}

				const nbCell = operation.cellIndex !== undefined && state.notebook?.cells.at(operation.cellIndex);
				if (nbCell) {
					const newContent = this._applyTextEditsToContent(nbCell.getValue(), operation.edits);
					state.notebook!.applyEdits([{
						editType: CellEditType.Replace,
						index: operation.cellIndex,
						count: 1,
						cells: [{ cellKind: nbCell.cellKind, language: nbCell.language, mime: nbCell.language, source: newContent, outputs: nbCell.outputs }]
					}], true, undefined, () => undefined, undefined);
					return state;
				}

				// Apply text edits using a temporary text model
				return {
					...state,
					content: this._applyTextEditsToContent(state.content, operation.edits)
				};
			}
			case FileOperationType.NotebookEdit:
				if (!state.exists) {
					throw new Error('Cannot apply notebook edits to non-existent file');
				}
				if (!state.notebook) {
					throw new Error('Cannot apply notebook edits to non-notebook file');
				}

				state.notebook.applyEdits(operation.cellEdits.slice(), true, undefined, () => undefined, undefined);
				return state;

			default:
				assertNever(operation);
		}
	}

	private async _applyFileSystemOperations(fromEpoch: number, toEpoch: number): Promise<ResourceSet> {
		const isMovingForward = toEpoch > fromEpoch;
		const operations = this._operations.get().filter(op => {
			if (isMovingForward) {
				return op.epoch >= fromEpoch && op.epoch < toEpoch;
			} else {
				return op.epoch < fromEpoch && op.epoch >= toEpoch;
			}
		}).sort((a, b) => isMovingForward ? a.epoch - b.epoch : b.epoch - a.epoch);

		// Apply file system operations in the correct direction
		const urisToRestore = new ResourceSet();
		for (const operation of operations) {
			await this._applyFileSystemOperation(operation, isMovingForward, urisToRestore);
		}

		return urisToRestore;
	}

	private async _applyFileSystemOperation(operation: FileOperation, isMovingForward: boolean, urisToRestore: ResourceSet): Promise<void> {
		switch (operation.type) {
			case FileOperationType.Create:
				if (isMovingForward) {
					await this._delegate.createFile(operation.uri, operation.initialContent);
					urisToRestore.add(operation.uri);
				} else {
					await this._delegate.deleteFile(operation.uri);
					urisToRestore.delete(operation.uri);
				}
				break;

			case FileOperationType.Delete:
				if (isMovingForward) {
					await this._delegate.deleteFile(operation.uri);
					urisToRestore.delete(operation.uri);
				} else {
					await this._delegate.createFile(operation.uri, operation.finalContent);
					urisToRestore.add(operation.uri);
				}
				break;

			case FileOperationType.Rename:
				if (isMovingForward) {
					await this._delegate.renameFile(operation.oldUri, operation.newUri);
					urisToRestore.delete(operation.oldUri);
					urisToRestore.add(operation.newUri);
				} else {
					await this._delegate.renameFile(operation.newUri, operation.oldUri);
					urisToRestore.delete(operation.newUri);
					urisToRestore.add(operation.oldUri);
				}
				break;

			// Text and notebook edits don't affect file system structure
			case FileOperationType.TextEdit:
			case FileOperationType.NotebookEdit:
				urisToRestore.add(CellUri.parse(operation.uri)?.notebook ?? operation.uri);
				break;

			default:
				assertNever(operation);
		}
	}

	private _applyTextEditsToContent(content: string, edits: readonly TextEdit[]): string {
		// Use the example pattern provided by the user
		const makeModel = (uri: URI, contents: string) => this._instantiationService.createInstance(TextModel, contents, '', this._modelService.getCreationOptions('', uri, true), uri);

		// Create a temporary URI for the model
		const tempUri = URI.from({ scheme: 'temp', path: `/temp-${Date.now()}.txt` });
		const model = makeModel(tempUri, content);

		try {
			// Apply edits
			model.applyEdits(edits.map(edit => ({
				range: {
					startLineNumber: edit.range.startLineNumber,
					startColumn: edit.range.startColumn,
					endLineNumber: edit.range.endLineNumber,
					endColumn: edit.range.endColumn
				},
				text: edit.text
			})));

			return model.getValue();
		} finally {
			model.dispose();
		}
	}

	public getEntryDiffBetweenStops(uri: URI, requestId: string | undefined, stopId: string | undefined): IObservable<IEditSessionEntryDiff | undefined> {
		const epochs = derivedOpts<{ start: ICheckpoint; end: ICheckpoint | undefined }>({ equalsFn: (a, b) => a.start === b.start && a.end === b.end }, reader => {
			const checkpoints = this._checkpoints.read(reader);
			const startIndex = checkpoints.findIndex(c => c.requestId === requestId && c.undoStopId === stopId);
			return { start: checkpoints[startIndex], end: checkpoints[startIndex + 1] };
		});

		return this._getEntryDiffBetweenEpochs(uri, `s\0${requestId}\0${stopId}`, epochs);
	}

	/** Gets the epoch bounds of the request. If stopRequestId is undefined, gets ONLY the single request's bounds */
	private _getRequestEpochBounds(startRequestId: string, stopRequestId?: string): IObservable<{ start: ICheckpoint; end: ICheckpoint | undefined }> {
		return derivedOpts<{ start: ICheckpoint; end: ICheckpoint | undefined }>({ equalsFn: (a, b) => a.start === b.start && a.end === b.end }, reader => {
			const checkpoints = this._checkpoints.read(reader);
			const startIndex = checkpoints.findIndex(c => c.requestId === startRequestId);
			const start = startIndex === -1 ? checkpoints[0] : checkpoints[startIndex];

			let end: ICheckpoint | undefined;
			if (stopRequestId === undefined) {
				end = findFirst(checkpoints, c => c.requestId !== startRequestId, startIndex + 1);
			} else {
				end = checkpoints.find(c => c.requestId === stopRequestId)
					|| findFirst(checkpoints, c => c.requestId !== startRequestId, startIndex + 1)
					|| checkpoints[checkpoints.length - 1];
			}

			return { start, end };
		});
	}

	public getEntryDiffBetweenRequests(uri: URI, startRequestId: string, stopRequestId: string): IObservable<IEditSessionEntryDiff | undefined> {
		return this._getEntryDiffBetweenEpochs(uri, `r\0${startRequestId}\0${stopRequestId}`, this._getRequestEpochBounds(startRequestId, stopRequestId));
	}

	private _getEntryDiffBetweenEpochs(uri: URI, cacheKey: string, epochs: IObservable<{ start: ICheckpoint | undefined; end: ICheckpoint | undefined }>): IObservable<IEditSessionEntryDiff | undefined> {
		const key = `${uri.toString()}\0${cacheKey}`;
		let obs = this._refCountedDiffs.get(key);

		if (!obs) {
			obs = this._getEntryDiffBetweenEpochsInner(
				uri,
				epochs,
				() => this._refCountedDiffs.delete(key),
			);
			this._refCountedDiffs.set(key, obs);
		}

		return obs;
	}

	private _getEntryDiffBetweenEpochsInner(
		uri: URI,
		epochs: IObservable<{ start: ICheckpoint | undefined; end: ICheckpoint | undefined }>,
		onLastObserverRemoved: () => void,
	): IObservable<IEditSessionEntryDiff | undefined> {
		type ModelRefsValue = { refs: { model: ITextModel; onChange: IObservable<void> }[]; isFinal: boolean; error?: unknown };

		const modelRefsPromise = derived(this, (reader) => {
			const { start, end } = epochs.read(reader);
			if (!start) { return undefined; }

			const store = reader.store.add(new DisposableStore());
			const originalURI = this.getContentURIAtStop(start.requestId || START_REQUEST_EPOCH, uri, STOP_ID_EPOCH_PREFIX + start.epoch);
			const modifiedURI = this.getContentURIAtStop(end?.requestId || start.requestId || START_REQUEST_EPOCH, uri, STOP_ID_EPOCH_PREFIX + (end?.epoch || Number.MAX_SAFE_INTEGER));

			const promise: Promise<ModelRefsValue> = Promise.all([
				this._textModelService.createModelReference(originalURI),
				this._textModelService.createModelReference(modifiedURI),
			]).then(refs => {
				if (store.isDisposed) {
					refs.forEach(r => r.dispose());
				} else {
					refs.forEach(r => store.add(r));
				}

				return {
					refs: refs.map(r => ({
						model: r.object.textEditorModel,
						onChange: observableSignalFromEvent(this, r.object.textEditorModel.onDidChangeContent.bind(r.object.textEditorModel)),
					})),
					isFinal: !!end,
				};
			}).catch((error): ModelRefsValue => {
				return { refs: [], isFinal: true, error };
			});

			return {
				originalURI,
				modifiedURI,
				promise: new ObservablePromise(promise),
			};
		});

		const diff = derived(reader => {
			const modelsData = modelRefsPromise.read(reader);
			if (!modelsData) {
				return;
			}

			const { originalURI, modifiedURI, promise } = modelsData;
			const promiseData = promise?.promiseResult.read(reader);
			if (!promiseData?.data) {
				return { originalURI, modifiedURI, promise: undefined };
			}

			const { refs, isFinal, error } = promiseData.data;
			if (error) {
				return { originalURI, modifiedURI, promise: new ObservablePromise(Promise.resolve(emptySessionEntryDiff(originalURI, modifiedURI))) };
			}

			refs.forEach(m => m.onChange.read(reader)); // re-read when contents change

			return { originalURI, modifiedURI, promise: new ObservablePromise(this._computeDiff(originalURI, modifiedURI, !!isFinal)) };
		});

		return derivedOpts({ onLastObserverRemoved }, reader => {
			const result = diff.read(reader);
			if (!result) {
				return undefined;
			}

			const promised = result.promise?.promiseResult.read(reader);
			if (promised?.data) {
				return promised.data;
			}

			if (promised?.error) {
				return emptySessionEntryDiff(result.originalURI, result.modifiedURI);
			}

			return { ...emptySessionEntryDiff(result.originalURI, result.modifiedURI), isBusy: true };
		});
	}

	private _computeDiff(originalUri: URI, modifiedUri: URI, isFinal: boolean): Promise<IEditSessionEntryDiff> {
		return this._editorWorkerService.computeDiff(
			originalUri,
			modifiedUri,
			{ ignoreTrimWhitespace: false, computeMoves: false, maxComputationTimeMs: 3000 },
			'advanced'
		).then((diff): IEditSessionEntryDiff => {
			const entryDiff: IEditSessionEntryDiff = {
				originalURI: originalUri,
				modifiedURI: modifiedUri,
				identical: !!diff?.identical,
				isFinal,
				quitEarly: !diff || diff.quitEarly,
				added: 0,
				removed: 0,
				isBusy: false,
			};
			if (diff) {
				for (const change of diff.changes) {
					entryDiff.removed += change.original.endLineNumberExclusive - change.original.startLineNumber;
					entryDiff.added += change.modified.endLineNumberExclusive - change.modified.startLineNumber;
				}
			}
			return entryDiff;
		});
	}

	public hasEditsInRequest(requestId: string, reader?: IReader): boolean {
		for (const value of this._fileBaselines.values()) {
			if (value.requestId === requestId) {
				return true;
			}
		}

		for (const operation of this._operations.read(reader)) {
			if (operation.requestId === requestId) {
				return true;
			}
		}

		return false;
	}

	public getDiffsForFilesInRequest(requestId: string): IObservable<readonly IEditSessionEntryDiff[]> {
		const boundsObservable = this._getRequestEpochBounds(requestId);
		const startEpochs = derivedOpts<ResourceMap<number>>({ equalsFn: mapsStrictEqualIgnoreOrder }, reader => {
			const uris = new ResourceMap<number>();
			for (const value of this._fileBaselines.values()) {
				if (value.requestId === requestId) {
					uris.set(value.uri, value.epoch);
				}
			}

			const bounds = boundsObservable.read(reader);
			for (const operation of this._operations.read(reader)) {
				if (operation.epoch < bounds.start.epoch) {
					continue;
				}
				if (bounds.end && operation.epoch >= bounds.end.epoch) {
					break;
				}

				if (operation.type === FileOperationType.Create) {
					uris.set(operation.uri, 0);
				}
			}

			return uris;
		});


		return this._getDiffsForFilesAtEpochs(startEpochs, boundsObservable.map(b => b.end));
	}

	private _getDiffsForFilesAtEpochs(startEpochs: IObservable<ResourceMap<number>>, endCheckpointObs: IObservable<ICheckpoint | undefined>) {
		// URIs are never removed from the set and we never adjust baselines backwards
		// (history is immutable) so we can easily cache to avoid regenerating diffs when new files are added
		const prevDiffs = new ResourceMap<IObservable<IEditSessionEntryDiff | undefined>>();
		let prevEndCheckpoint: ICheckpoint | undefined = undefined;

		const perFileDiffs = derived(this, reader => {
			const checkpoints = this._checkpoints.read(reader);
			const firstCheckpoint = checkpoints[0];
			if (!firstCheckpoint) {
				return [];
			}

			const endCheckpoint = endCheckpointObs.read(reader);
			if (endCheckpoint !== prevEndCheckpoint) {
				prevDiffs.clear();
				prevEndCheckpoint = endCheckpoint;
			}

			const uris = startEpochs.read(reader);
			const diffs: IObservable<IEditSessionEntryDiff | undefined>[] = [];

			for (const [uri, epoch] of uris) {
				const obs = prevDiffs.get(uri) ?? this._getEntryDiffBetweenEpochs(uri, `e\0${epoch}\0${endCheckpoint?.epoch}`,
					constObservable({ start: checkpoints.findLast(cp => cp.epoch <= epoch) || firstCheckpoint, end: endCheckpoint }));
				prevDiffs.set(uri, obs);
				diffs.push(obs);
			}

			return diffs;
		});

		return perFileDiffs.map((diffs, reader) => {
			return diffs.flatMap(d => d.read(reader)).filter(isDefined);
		});
	}

	public getDiffsForFilesInSession(): IObservable<readonly IEditSessionEntryDiff[]> {
		const startEpochs = derivedOpts<ResourceMap<number>>({ equalsFn: mapsStrictEqualIgnoreOrder }, reader => {
			const uris = new ResourceMap<number>();
			for (const baseline of this._fileBaselines.values()) {
				uris.set(baseline.uri, Math.min(baseline.epoch, uris.get(baseline.uri) ?? Number.MAX_SAFE_INTEGER));
			}
			for (const operation of this._operations.read(reader)) {
				if (operation.type === FileOperationType.Create) {
					uris.set(operation.uri, 0);
				}
			}

			return uris;
		});

		return this._getDiffsForFilesAtEpochs(startEpochs, constObservable(undefined));
	}

	public getDiffForSession(): IObservable<IEditSessionDiffStats> {
		const fileDiffs = this.getDiffsForFilesInSession();
		return derived(reader => {
			const diffs = fileDiffs.read(reader);
			let added = 0;
			let removed = 0;
			for (const diff of diffs) {
				added += diff.added;
				removed += diff.removed;
			}
			return { added, removed };
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingCodeEditorIntegration.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingCodeEditorIntegration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../media/chatEditorController.css';

import { getTotalWidth } from '../../../../../base/browser/dom.js';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore, dispose, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, constObservable, derived, IObservable, observableFromEvent, observableValue } from '../../../../../base/common/observable.js';
import { basename, isEqual } from '../../../../../base/common/resources.js';
import { themeColorFromId } from '../../../../../base/common/themables.js';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition, IOverlayWidgetPositionCoordinates, IViewZone, MouseTargetType } from '../../../../../editor/browser/editorBrowser.js';
import { observableCodeEditor } from '../../../../../editor/browser/observableCodeEditor.js';
import { AccessibleDiffViewer, IAccessibleDiffViewerModel } from '../../../../../editor/browser/widget/diffEditor/components/accessibleDiffViewer.js';
import { LineSource, renderLines, RenderOptions } from '../../../../../editor/browser/widget/diffEditor/components/diffEditorViewZones/renderLines.js';
import { diffAddDecoration, diffDeleteDecoration, diffWholeLineAddDecoration } from '../../../../../editor/browser/widget/diffEditor/registrations.contribution.js';
import { EditorOption, IEditorOptions } from '../../../../../editor/common/config/editorOptions.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { LineRange } from '../../../../../editor/common/core/ranges/lineRange.js';
import { Selection } from '../../../../../editor/common/core/selection.js';
import { IDocumentDiff } from '../../../../../editor/common/diff/documentDiffProvider.js';
import { DetailedLineRangeMapping } from '../../../../../editor/common/diff/rangeMapping.js';
import { IEditorDecorationsCollection } from '../../../../../editor/common/editorCommon.js';
import { IModelDeltaDecoration, ITextModel, MinimapPosition, OverviewRulerLane, TrackedRangeStickiness } from '../../../../../editor/common/model.js';
import { ModelDecorationOptions } from '../../../../../editor/common/model/textModel.js';
import { InlineDecoration, InlineDecorationType } from '../../../../../editor/common/viewModel/inlineDecorations.js';
import { localize } from '../../../../../nls.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { HiddenItemStrategy, MenuWorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { TextEditorSelectionRevealType } from '../../../../../platform/editor/common/editor.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { EditorsOrder, IEditorIdentifier, isDiffEditorInput } from '../../../../common/editor.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { minimapGutterAddedBackground, minimapGutterDeletedBackground, minimapGutterModifiedBackground, overviewRulerAddedForeground, overviewRulerDeletedForeground, overviewRulerModifiedForeground } from '../../../scm/common/quickDiff.js';
import { IModifiedFileEntry, IModifiedFileEntryChangeHunk, IModifiedFileEntryEditorIntegration, ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { isTextDiffEditorForEntry } from './chatEditing.js';
import { ActionViewItem } from '../../../../../base/browser/ui/actionbar/actionViewItems.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ctxCursorInChangeRange } from './chatEditingEditorContextKeys.js';
import { LinkedList } from '../../../../../base/common/linkedList.js';

export interface IDocumentDiff2 extends IDocumentDiff {

	originalModel: ITextModel;
	modifiedModel: ITextModel;

	keep(changes: DetailedLineRangeMapping): Promise<boolean>;
	undo(changes: DetailedLineRangeMapping): Promise<boolean>;
}

class ObjectPool<T extends IDisposable> {

	private readonly _free = new LinkedList<T>();

	dispose(): void {
		dispose(this._free);
	}

	get(): T | undefined {
		return this._free.shift();
	}

	putBack(obj: T): void {
		this._free.push(obj);
	}

	get free(): Iterable<T> {
		return this._free;
	}
}

export class ChatEditingCodeEditorIntegration implements IModifiedFileEntryEditorIntegration {

	private static readonly _diffLineDecorationData = ModelDecorationOptions.register({ description: 'diff-line-decoration' });

	private readonly _currentIndex = observableValue(this, -1);
	readonly currentIndex: IObservable<number> = this._currentIndex;
	private readonly _store = new DisposableStore();

	private readonly _diffLineDecorations: IEditorDecorationsCollection;
	private readonly _diffVisualDecorations: IEditorDecorationsCollection;
	private readonly _diffHunksRenderStore = this._store.add(new DisposableStore());
	private readonly _diffHunkWidgetPool = this._store.add(new ObjectPool<DiffHunkWidget>());
	private readonly _diffHunkWidgets: DiffHunkWidget[] = [];
	private _viewZones: string[] = [];

	private readonly _accessibleDiffViewVisible = observableValue<boolean>(this, false);

	constructor(
		private readonly _entry: IModifiedFileEntry,
		private readonly _editor: ICodeEditor,
		documentDiffInfo: IObservable<IDocumentDiff2>,
		renderDiffImmediately: boolean,
		@IEditorService private readonly _editorService: IEditorService,
		@IAccessibilitySignalService private readonly _accessibilitySignalsService: IAccessibilitySignalService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		this._diffLineDecorations = _editor.createDecorationsCollection();
		const codeEditorObs = observableCodeEditor(_editor);

		this._diffLineDecorations = this._editor.createDecorationsCollection(); // tracks the line range w/o visuals (used for navigate)
		this._diffVisualDecorations = this._editor.createDecorationsCollection(); // tracks the real diff with character level inserts

		const enabledObs = derived(r => {
			if (!isEqual(codeEditorObs.model.read(r)?.uri, documentDiffInfo.read(r).modifiedModel.uri)) {
				return false;
			}
			if (this._editor.getOption(EditorOption.inDiffEditor) && !instantiationService.invokeFunction(isTextDiffEditorForEntry, _entry, this._editor)) {
				return false;
			}
			return true;
		});


		// update decorations
		this._store.add(autorun(r => {

			if (!enabledObs.read(r)) {
				this._diffLineDecorations.clear();
				return;
			}

			const data: IModelDeltaDecoration[] = [];
			const diff = documentDiffInfo.read(r);
			for (const diffEntry of diff.changes) {
				data.push({
					range: diffEntry.modified.toInclusiveRange() ?? new Range(diffEntry.modified.startLineNumber, 1, diffEntry.modified.startLineNumber, Number.MAX_SAFE_INTEGER),
					options: ChatEditingCodeEditorIntegration._diffLineDecorationData
				});
			}
			this._diffLineDecorations.set(data);
		}));

		// INIT current index when: enabled, not streaming anymore, once per request, and when having changes
		let lastModifyingRequestId: string | undefined;
		this._store.add(autorun(r => {

			if (enabledObs.read(r)
				&& !_entry.isCurrentlyBeingModifiedBy.read(r)
				&& lastModifyingRequestId !== _entry.lastModifyingRequestId
				&& !documentDiffInfo.read(r).identical
			) {
				lastModifyingRequestId = _entry.lastModifyingRequestId;
				const position = _editor.getPosition() ?? new Position(1, 1);
				const ranges = this._diffLineDecorations.getRanges();
				let initialIndex = ranges.findIndex(r => r.containsPosition(position));
				if (initialIndex < 0) {
					initialIndex = 0;
					for (; initialIndex < ranges.length - 1; initialIndex++) {
						const range = ranges[initialIndex];
						if (range.endLineNumber >= position.lineNumber) {
							break;
						}
					}
				}
				this._currentIndex.set(initialIndex, undefined);
				_editor.revealRange(ranges[initialIndex]);
			}
		}));

		// render diff decorations
		this._store.add(autorun(r => {

			if (!enabledObs.read(r)) {
				this._clearDiffRendering();
				return;
			}

			// done: render diff
			if (!_entry.isCurrentlyBeingModifiedBy.read(r) || renderDiffImmediately) {
				const isDiffEditor = this._editor.getOption(EditorOption.inDiffEditor);

				codeEditorObs.getOption(EditorOption.fontInfo).read(r);
				codeEditorObs.getOption(EditorOption.lineHeight).read(r);

				const reviewMode = _entry.reviewMode.read(r);
				const diff = documentDiffInfo.read(r);
				this._updateDiffRendering(diff, reviewMode, isDiffEditor);
			}
		}));

		const _ctxCursorInChangeRange = ctxCursorInChangeRange.bindTo(contextKeyService);

		// accessibility: signals while cursor changes
		// ctx: cursor in change range
		this._store.add(autorun(r => {
			const position = codeEditorObs.positions.read(r)?.at(0);
			if (!position || !enabledObs.read(r)) {
				_ctxCursorInChangeRange.reset();
				return;
			}

			const diff = documentDiffInfo.read(r);
			const changeAtCursor = diff.changes.find(m => m.modified.contains(position.lineNumber) || m.modified.isEmpty && m.modified.startLineNumber === position.lineNumber);

			_ctxCursorInChangeRange.set(!!changeAtCursor);

			if (changeAtCursor) {
				let signal: AccessibilitySignal;
				if (changeAtCursor.modified.isEmpty) {
					signal = AccessibilitySignal.diffLineDeleted;
				} else if (changeAtCursor.original.isEmpty) {
					signal = AccessibilitySignal.diffLineInserted;
				} else {
					signal = AccessibilitySignal.diffLineModified;
				}
				this._accessibilitySignalsService.playSignal(signal, { source: 'chatEditingEditor.cursorPositionChanged' });
			}
		}));

		// accessibility: diff view
		this._store.add(autorun(r => {

			const visible = this._accessibleDiffViewVisible.read(r);

			if (!visible || !enabledObs.read(r)) {
				return;
			}

			const accessibleDiffWidget = new AccessibleDiffViewContainer();
			_editor.addOverlayWidget(accessibleDiffWidget);
			r.store.add(toDisposable(() => _editor.removeOverlayWidget(accessibleDiffWidget)));

			r.store.add(instantiationService.createInstance(
				AccessibleDiffViewer,
				accessibleDiffWidget.getDomNode(),
				enabledObs,
				(visible, tx) => this._accessibleDiffViewVisible.set(visible, tx),
				constObservable(true),
				codeEditorObs.layoutInfo.map((v, r) => v.width),
				codeEditorObs.layoutInfo.map((v, r) => v.height),
				documentDiffInfo.map(diff => diff.changes.slice()),
				instantiationService.createInstance(AccessibleDiffViewerModel, documentDiffInfo, _editor),
			));
		}));


		// ---- readonly while streaming

		let actualOptions: IEditorOptions | undefined;

		const restoreActualOptions = () => {
			if (actualOptions !== undefined) {
				this._editor.updateOptions(actualOptions);
				actualOptions = undefined;
			}
		};

		this._store.add(toDisposable(restoreActualOptions));

		const renderAsBeingModified = derived(this, r => {
			return enabledObs.read(r) && Boolean(_entry.isCurrentlyBeingModifiedBy.read(r));
		});

		this._store.add(autorun(r => {
			const value = renderAsBeingModified.read(r);
			if (value) {

				actualOptions ??= {
					readOnly: this._editor.getOption(EditorOption.readOnly),
					stickyScroll: this._editor.getOption(EditorOption.stickyScroll),
					codeLens: this._editor.getOption(EditorOption.codeLens),
					guides: this._editor.getOption(EditorOption.guides)
				};

				this._editor.updateOptions({
					readOnly: true,
					stickyScroll: { enabled: false },
					codeLens: false,
					guides: { indentation: false, bracketPairs: false }
				});
			} else {
				restoreActualOptions();
			}
		}));
	}

	dispose(): void {
		this._clear();
		this._store.dispose();
	}

	private _clear() {
		this._diffLineDecorations.clear();
		this._clearDiffRendering();
		this._currentIndex.set(-1, undefined);
	}

	// ---- diff rendering logic

	private _clearDiffRendering() {
		this._editor.changeViewZones((viewZoneChangeAccessor) => {
			for (const id of this._viewZones) {
				viewZoneChangeAccessor.removeZone(id);
			}
		});
		this._viewZones = [];
		this._diffHunksRenderStore.clear();
		for (const widget of this._diffHunkWidgetPool.free) {
			widget.remove();
		}
		this._diffVisualDecorations.clear();
	}

	private _updateDiffRendering(diff: IDocumentDiff2, reviewMode: boolean, diffMode: boolean): void {

		const chatDiffAddDecoration = ModelDecorationOptions.createDynamic({
			...diffAddDecoration,
			stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
		});
		const chatDiffWholeLineAddDecoration = ModelDecorationOptions.createDynamic({
			...diffWholeLineAddDecoration,
			stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		});
		const createOverviewDecoration = (overviewRulerColor: string, minimapColor: string) => {
			return ModelDecorationOptions.createDynamic({
				description: 'chat-editing-decoration',
				overviewRuler: { color: themeColorFromId(overviewRulerColor), position: OverviewRulerLane.Left },
				minimap: { color: themeColorFromId(minimapColor), position: MinimapPosition.Gutter },
			});
		};
		const modifiedDecoration = createOverviewDecoration(overviewRulerModifiedForeground, minimapGutterModifiedBackground);
		const addedDecoration = createOverviewDecoration(overviewRulerAddedForeground, minimapGutterAddedBackground);
		const deletedDecoration = createOverviewDecoration(overviewRulerDeletedForeground, minimapGutterDeletedBackground);

		this._diffHunksRenderStore.clear();
		this._diffHunkWidgets.length = 0;
		const diffHunkDecorations: IModelDeltaDecoration[] = [];

		this._editor.changeViewZones((viewZoneChangeAccessor) => {
			for (const id of this._viewZones) {
				viewZoneChangeAccessor.removeZone(id);
			}
			this._viewZones = [];
			const modifiedVisualDecorations: IModelDeltaDecoration[] = [];
			const mightContainNonBasicASCII = diff.originalModel.mightContainNonBasicASCII();
			const mightContainRTL = diff.originalModel.mightContainRTL();
			const renderOptions = RenderOptions.fromEditor(this._editor);
			const editorLineCount = this._editor.getModel()?.getLineCount();

			for (const diffEntry of diff.changes) {

				const originalRange = diffEntry.original;
				diff.originalModel.tokenization.forceTokenization(Math.max(1, originalRange.endLineNumberExclusive - 1));
				const source = new LineSource(
					originalRange.mapToLineArray(l => diff.originalModel.tokenization.getLineTokens(l)),
					[],
					mightContainNonBasicASCII,
					mightContainRTL,
				);
				const decorations: InlineDecoration[] = [];

				if (reviewMode) {
					for (const i of diffEntry.innerChanges || []) {
						decorations.push(new InlineDecoration(
							i.originalRange.delta(-(diffEntry.original.startLineNumber - 1)),
							diffDeleteDecoration.className!,
							InlineDecorationType.Regular
						));

						// If the original range is empty, the start line number is 1 and the new range spans the entire file, don't draw an Added decoration
						if (!(i.originalRange.isEmpty() && i.originalRange.startLineNumber === 1 && i.modifiedRange.endLineNumber === editorLineCount) && !i.modifiedRange.isEmpty()) {
							modifiedVisualDecorations.push({
								range: i.modifiedRange, options: chatDiffAddDecoration
							});
						}
					}
				}

				// Render an added decoration but don't also render a deleted decoration for newly inserted content at the start of the file
				// Note, this is a workaround for the `LineRange.isEmpty()` in diffEntry.original being `false` for newly inserted content
				const isCreatedContent = decorations.length === 1 && decorations[0].range.isEmpty() && diffEntry.original.startLineNumber === 1;

				if (!diffEntry.modified.isEmpty) {
					modifiedVisualDecorations.push({
						range: diffEntry.modified.toInclusiveRange()!,
						options: chatDiffWholeLineAddDecoration
					});
				}

				if (diffEntry.original.isEmpty) {
					// insertion
					modifiedVisualDecorations.push({
						range: diffEntry.modified.toInclusiveRange()!,
						options: addedDecoration
					});
				} else if (diffEntry.modified.isEmpty) {
					// deletion
					modifiedVisualDecorations.push({
						range: new Range(diffEntry.modified.startLineNumber - 1, 1, diffEntry.modified.startLineNumber, 1),
						options: deletedDecoration
					});
				} else {
					// modification
					modifiedVisualDecorations.push({
						range: diffEntry.modified.toInclusiveRange()!,
						options: modifiedDecoration
					});
				}

				let extraLines = 0;
				if (reviewMode && !diffMode) {
					const domNode = document.createElement('div');
					domNode.className = 'chat-editing-original-zone view-lines line-delete monaco-mouse-cursor-text';
					const result = renderLines(source, renderOptions, decorations, domNode);
					extraLines = result.heightInLines;
					if (!isCreatedContent) {

						const viewZoneData: IViewZone = {
							afterLineNumber: diffEntry.modified.startLineNumber - 1,
							heightInLines: result.heightInLines,
							domNode,
							ordinal: 50000 + 2 // more than https://github.com/microsoft/vscode/blob/bf52a5cfb2c75a7327c9adeaefbddc06d529dcad/src/vs/workbench/contrib/inlineChat/browser/inlineChatZoneWidget.ts#L42
						};

						this._viewZones.push(viewZoneChangeAccessor.addZone(viewZoneData));
					}
				}

				if (reviewMode || diffMode) {

					// Add content widget for each diff change
					let widget = this._diffHunkWidgetPool.get();
					if (!widget) {
						// make a new one
						widget = this._editor.invokeWithinContext(accessor => {
							const instaService = accessor.get(IInstantiationService);
							return instaService.createInstance(DiffHunkWidget, this._editor, diff, diffEntry, this._editor.getModel()!.getVersionId(), isCreatedContent ? 0 : extraLines);
						});
					} else {
						widget.update(diff, diffEntry, this._editor.getModel()!.getVersionId(), isCreatedContent ? 0 : extraLines);
					}
					this._diffHunksRenderStore.add(toDisposable(() => {
						this._diffHunkWidgetPool.putBack(widget);
					}));

					widget.layout(diffEntry.modified.startLineNumber);

					this._diffHunkWidgets.push(widget);
					diffHunkDecorations.push({
						range: diffEntry.modified.toInclusiveRange() ?? new Range(diffEntry.modified.startLineNumber, 1, diffEntry.modified.startLineNumber, Number.MAX_SAFE_INTEGER),
						options: {
							description: 'diff-hunk-widget',
							stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
						}
					});
				}
			}

			this._diffVisualDecorations.set(!diffMode ? modifiedVisualDecorations : []);
		});

		const diffHunkDecoCollection = this._editor.createDecorationsCollection(diffHunkDecorations);

		this._diffHunksRenderStore.add(toDisposable(() => {
			diffHunkDecoCollection.clear();
		}));

		// HIDE pooled widgets that are not used
		for (const extraWidget of this._diffHunkWidgetPool.free) {
			extraWidget.remove();
		}

		const positionObs = observableFromEvent(this._editor.onDidChangeCursorPosition, _ => this._editor.getPosition());

		const activeWidgetIdx = derived(r => {
			const position = positionObs.read(r);
			if (!position) {
				return -1;
			}
			const idx = diffHunkDecoCollection.getRanges().findIndex(r => r.containsPosition(position));
			return idx;
		});
		const toggleWidget = (activeWidget: DiffHunkWidget | undefined) => {
			const positionIdx = activeWidgetIdx.get();
			for (let i = 0; i < this._diffHunkWidgets.length; i++) {
				const widget = this._diffHunkWidgets[i];
				widget.toggle(widget === activeWidget || i === positionIdx);
			}
		};

		this._diffHunksRenderStore.add(autorun(r => {
			// reveal when cursor inside
			const idx = activeWidgetIdx.read(r);
			const widget = this._diffHunkWidgets[idx];
			toggleWidget(widget);
		}));


		this._diffHunksRenderStore.add(this._editor.onMouseUp(e => {
			// set approximate position when clicking on view zone
			if (e.target.type === MouseTargetType.CONTENT_VIEW_ZONE) {
				const zone = e.target.detail;
				const idx = this._viewZones.findIndex(id => id === zone.viewZoneId);
				if (idx >= 0) {
					this._editor.setPosition(e.target.position);
					this._editor.focus();
				}
			}
		}));

		this._diffHunksRenderStore.add(this._editor.onMouseMove(e => {

			// reveal when hovering over
			if (e.target.type === MouseTargetType.OVERLAY_WIDGET) {
				const id = e.target.detail;
				const widget = this._diffHunkWidgets.find(w => w.getId() === id);
				toggleWidget(widget);

			} else if (e.target.type === MouseTargetType.CONTENT_VIEW_ZONE) {
				const zone = e.target.detail;
				const idx = this._viewZones.findIndex(id => id === zone.viewZoneId);
				toggleWidget(this._diffHunkWidgets[idx]);

			} else if (e.target.position) {
				const { position } = e.target;
				const idx = diffHunkDecoCollection.getRanges().findIndex(r => r.containsPosition(position));
				toggleWidget(this._diffHunkWidgets[idx]);

			} else {
				toggleWidget(undefined);
			}
		}));

		this._diffHunksRenderStore.add(Event.any(this._editor.onDidScrollChange, this._editor.onDidLayoutChange)(() => {
			for (let i = 0; i < this._diffHunkWidgets.length; i++) {
				const widget = this._diffHunkWidgets[i];
				const range = diffHunkDecoCollection.getRange(i);
				if (range) {
					widget.layout(range?.startLineNumber);
				} else {
					widget.dispose();
				}
			}
		}));
	}

	enableAccessibleDiffView(): void {
		this._accessibleDiffViewVisible.set(true, undefined);
	}

	// ---- navigation logic

	reveal(firstOrLast: boolean, preserveFocus?: boolean): void {

		const decorations = this._diffLineDecorations
			.getRanges()
			.sort((a, b) => Range.compareRangesUsingStarts(a, b));

		const index = firstOrLast ? 0 : decorations.length - 1;
		const range = decorations.at(index);
		if (range) {
			this._editor.setPosition(range.getStartPosition());
			this._editor.revealRange(range);
			if (!preserveFocus) {
				this._editor.focus();
			}
			this._currentIndex.set(index, undefined);
		}
	}

	next(wrap: boolean): boolean {
		return this._reveal(true, !wrap);
	}

	previous(wrap: boolean): boolean {
		return this._reveal(false, !wrap);
	}

	private _reveal(next: boolean, strict: boolean) {

		const position = this._editor.getPosition();
		if (!position) {
			this._currentIndex.set(-1, undefined);
			return false;
		}

		const decorations = this._diffLineDecorations
			.getRanges()
			.sort((a, b) => Range.compareRangesUsingStarts(a, b));

		if (decorations.length === 0) {
			this._currentIndex.set(-1, undefined);
			return false;
		}

		let newIndex: number = -1;
		for (let i = 0; i < decorations.length; i++) {
			const range = decorations[i];
			if (range.containsPosition(position)) {
				newIndex = i + (next ? 1 : -1);
				break;
			} else if (Position.isBefore(position, range.getStartPosition())) {
				newIndex = next ? i : i - 1;
				break;
			}
		}

		if (strict && (newIndex < 0 || newIndex >= decorations.length)) {
			// NO change
			return false;
		}

		newIndex = (newIndex + decorations.length) % decorations.length;

		this._currentIndex.set(newIndex, undefined);

		const targetRange = decorations[newIndex];
		const targetPosition = next ? targetRange.getStartPosition() : targetRange.getEndPosition();
		this._editor.setPosition(targetPosition);
		this._editor.revealPositionInCenter(targetRange.getStartPosition().delta(-1));
		this._editor.focus();

		return true;
	}

	// --- hunks

	private _findClosestWidget(): DiffHunkWidget | undefined {
		if (!this._editor.hasModel()) {
			return undefined;
		}
		const lineRelativeTop = this._editor.getTopForLineNumber(this._editor.getPosition().lineNumber) - this._editor.getScrollTop();
		let closestWidget: DiffHunkWidget | undefined;
		let closestDistance = Number.MAX_VALUE;

		for (const widget of this._diffHunkWidgets) {
			const widgetTop = (<IOverlayWidgetPositionCoordinates | undefined>widget.getPosition()?.preference)?.top;
			if (widgetTop !== undefined) {
				const distance = Math.abs(widgetTop - lineRelativeTop);
				if (distance < closestDistance) {
					closestDistance = distance;
					closestWidget = widget;
				}
			}
		}

		return closestWidget;
	}

	async rejectNearestChange(closestWidget?: IModifiedFileEntryChangeHunk): Promise<void> {
		closestWidget = closestWidget ?? this._findClosestWidget();
		if (closestWidget instanceof DiffHunkWidget) {
			await closestWidget.reject();
			this.next(true);
		}
	}

	async acceptNearestChange(closestWidget?: IModifiedFileEntryChangeHunk): Promise<void> {
		closestWidget = closestWidget ?? this._findClosestWidget();
		if (closestWidget instanceof DiffHunkWidget) {
			await closestWidget.accept();
			this.next(true);
		}
	}

	async toggleDiff(widget: IModifiedFileEntryChangeHunk | undefined, show?: boolean): Promise<void> {
		if (!this._editor.hasModel()) {
			return;
		}

		let selection = this._editor.getSelection();
		if (widget instanceof DiffHunkWidget) {
			const lineNumber = widget.getStartLineNumber();
			const position = lineNumber ? new Position(lineNumber, 1) : undefined;
			if (position && !selection.containsPosition(position)) {
				selection = Selection.fromPositions(position);
			}
		}

		const isDiffEditor = this._editor.getOption(EditorOption.inDiffEditor);

		// Use the 'show' argument to control the diff state if provided
		if (show !== undefined ? show : !isDiffEditor) {
			// Open DIFF editor
			const diffEditor = await this._editorService.openEditor({
				original: { resource: this._entry.originalURI },
				modified: { resource: this._entry.modifiedURI },
				options: { selection },
				label: localize('diff.generic', '{0} (changes from chat)', basename(this._entry.modifiedURI))
			});

			if (diffEditor && diffEditor.input) {
				diffEditor.getControl()?.setSelection(selection);
				const d = autorun(r => {
					const state = this._entry.state.read(r);
					if (state === ModifiedFileEntryState.Accepted || state === ModifiedFileEntryState.Rejected) {
						d.dispose();
						const editorIdents: IEditorIdentifier[] = [];
						for (const candidate of this._editorService.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE)) {
							if (isDiffEditorInput(candidate.editor)
								&& isEqual(candidate.editor.original.resource, this._entry.originalURI)
								&& isEqual(candidate.editor.modified.resource, this._entry.modifiedURI)
							) {
								editorIdents.push(candidate);
							}
						}

						this._editorService.closeEditors(editorIdents);
					}
				});
			}
		} else {
			// Open normal editor
			await this._editorService.openEditor({
				resource: this._entry.modifiedURI,
				options: {
					selection,
					selectionRevealType: TextEditorSelectionRevealType.NearTopIfOutsideViewport
				}
			});
		}
	}
}

class DiffHunkWidget implements IOverlayWidget, IModifiedFileEntryChangeHunk {

	private static _idPool = 0;
	private readonly _id: string = `diff-change-widget-${DiffHunkWidget._idPool++}`;

	private readonly _domNode: HTMLElement;
	private readonly _store = new DisposableStore();
	private _position: IOverlayWidgetPosition | undefined;
	private _lastStartLineNumber: number | undefined;
	private _removed: boolean = false;

	constructor(
		private readonly _editor: ICodeEditor,
		private _diffInfo: IDocumentDiff2,
		private _change: DetailedLineRangeMapping,
		private _versionId: number,
		private _lineDelta: number,
		@IInstantiationService instaService: IInstantiationService,
	) {
		this._domNode = document.createElement('div');
		this._domNode.className = 'chat-diff-change-content-widget';

		const toolbar = instaService.createInstance(MenuWorkbenchToolBar, this._domNode, MenuId.ChatEditingEditorHunk, {
			telemetrySource: 'chatEditingEditorHunk',
			hiddenItemStrategy: HiddenItemStrategy.NoHide,
			toolbarOptions: { primaryGroup: () => true, },
			menuOptions: {
				renderShortTitle: true,
				arg: this,
			},
			actionViewItemProvider: (action, options) => {
				if (!action.class) {
					return new class extends ActionViewItem {
						constructor() {
							super(undefined, action, { ...options, keybindingNotRenderedWithLabel: true /* hide keybinding for actions without icon */, icon: false, label: true });
						}
					};
				}
				return undefined;
			}
		});

		this._store.add(toolbar);
		this._store.add(toolbar.actionRunner.onWillRun(_ => _editor.focus()));
		this._editor.addOverlayWidget(this);
	}

	update(diffInfo: IDocumentDiff2, change: DetailedLineRangeMapping, versionId: number, lineDelta: number): void {
		this._diffInfo = diffInfo;
		this._change = change;
		this._versionId = versionId;
		this._lineDelta = lineDelta;
	}

	dispose(): void {
		this._store.dispose();
		this._editor.removeOverlayWidget(this);
		this._removed = true;
	}

	getId(): string {
		return this._id;
	}

	layout(startLineNumber: number): void {

		const lineHeight = this._editor.getOption(EditorOption.lineHeight);
		const { contentLeft, contentWidth, verticalScrollbarWidth } = this._editor.getLayoutInfo();
		const scrollTop = this._editor.getScrollTop();

		this._position = {
			stackOrdinal: 1,
			preference: {
				top: this._editor.getTopForLineNumber(startLineNumber) - scrollTop - (lineHeight * this._lineDelta),
				left: contentLeft + contentWidth - (2 * verticalScrollbarWidth + getTotalWidth(this._domNode))
			}
		};

		if (this._removed) {
			this._removed = false;
			this._editor.addOverlayWidget(this);
		} else {
			this._editor.layoutOverlayWidget(this);
		}
		this._lastStartLineNumber = startLineNumber;
	}

	remove(): void {
		this._editor.removeOverlayWidget(this);
		this._removed = true;
	}

	toggle(show: boolean) {
		this._domNode.classList.toggle('hover', show);
		if (this._lastStartLineNumber) {
			this.layout(this._lastStartLineNumber);
		}
	}

	getDomNode(): HTMLElement {
		return this._domNode;
	}

	getPosition(): IOverlayWidgetPosition | null {
		return this._position ?? null;
	}

	getStartLineNumber(): number | undefined {
		return this._lastStartLineNumber;
	}

	// ---

	async reject(): Promise<boolean> {
		if (this._versionId !== this._editor.getModel()?.getVersionId()) {
			return false;
		}
		return await this._diffInfo.undo(this._change);
	}

	async accept(): Promise<boolean> {
		if (this._versionId !== this._editor.getModel()?.getVersionId()) {
			return false;
		}
		return this._diffInfo.keep(this._change);
	}
}


class AccessibleDiffViewContainer implements IOverlayWidget {

	private readonly _domNode: HTMLElement;

	constructor() {
		this._domNode = document.createElement('div');
		this._domNode.className = 'accessible-diff-view';
		this._domNode.style.width = '100%';
		this._domNode.style.position = 'absolute';
	}

	getId(): string {
		return 'chatEdits.accessibleDiffView';
	}

	getDomNode(): HTMLElement {
		return this._domNode;
	}

	getPosition(): IOverlayWidgetPosition | null {
		return {
			preference: { top: 0, left: 0 },
			stackOrdinal: 1
		};
	}
}

class AccessibleDiffViewerModel implements IAccessibleDiffViewerModel {
	constructor(
		private readonly _documentDiffInfo: IObservable<IDocumentDiff2>,
		private readonly _editor: ICodeEditor,
	) { }

	getOriginalModel() {
		return this._documentDiffInfo.get().originalModel;
	}

	getOriginalOptions() {
		return this._editor.getOptions();
	}

	originalReveal(range: Range) {
		const changes = this._documentDiffInfo.get().changes;
		const idx = changes.findIndex(value => value.original.intersect(LineRange.fromRange(range)));
		if (idx >= 0) {
			range = changes[idx].modified.toInclusiveRange() ?? range;
		}
		this.modifiedReveal(range);
	}

	getModifiedModel() {
		return this._editor.getModel()!;
	}

	getModifiedOptions() {
		return this._editor.getOptions();
	}

	modifiedReveal(range: Range) {
		if (range) {
			this._editor.revealRange(range);
			this._editor.setSelection(range);
		}
		this._editor.focus();
	}

	modifiedSetSelection(range: Range) {
		this._editor.setSelection(range);
	}

	modifiedFocus() {
		this._editor.focus();
	}

	getModifiedPosition() {
		return this._editor.getPosition() ?? undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingEditorAccessibility.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingEditorAccessibility.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { autorun, observableFromEvent } from '../../../../../base/common/observable.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IChatEditingService } from '../../common/chatEditingService.js';

export class ChatEditingEditorAccessibility implements IWorkbenchContribution {

	static readonly ID = 'chat.edits.accessibilty';

	private readonly _store = new DisposableStore();

	constructor(
		@IChatEditingService chatEditingService: IChatEditingService,
		@IEditorService editorService: IEditorService,
		@IAccessibilitySignalService accessibilityService: IAccessibilitySignalService
	) {

		const activeUri = observableFromEvent(this, editorService.onDidActiveEditorChange, () => editorService.activeEditorPane?.input.resource);

		this._store.add(autorun(r => {

			const editor = activeUri.read(r);
			if (!editor) {
				return;
			}

			const entry = chatEditingService.editingSessionsObs.read(r).find(session => session.readEntry(editor, r));
			if (entry) {
				accessibilityService.playSignal(AccessibilitySignal.chatEditModifiedFile);
			}
		}));
	}

	dispose(): void {
		this._store.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingEditorActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingEditorActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Codicon } from '../../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { ServicesAccessor } from '../../../../../editor/browser/editorExtensions.js';
import { EditorContextKeys } from '../../../../../editor/common/editorContextKeys.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, IAction2Options, MenuId, MenuRegistry, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IListService } from '../../../../../platform/list/browser/listService.js';
import { resolveCommandsContext } from '../../../../browser/parts/editor/editorCommandsContext.js';
import { ActiveEditorContext } from '../../../../common/contextkeys.js';
import { EditorResourceAccessor, SideBySideEditor, TEXT_DIFF_EDITOR_ID } from '../../../../common/editor.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { ACTIVE_GROUP, IEditorService } from '../../../../services/editor/common/editorService.js';
import { MultiDiffEditorInput } from '../../../multiDiffEditor/browser/multiDiffEditorInput.js';
import { NOTEBOOK_CELL_LIST_FOCUSED, NOTEBOOK_EDITOR_FOCUSED } from '../../../notebook/common/notebookContextKeys.js';
import { ChatContextKeys } from '../../common/chatContextKeys.js';
import { CHAT_EDITING_MULTI_DIFF_SOURCE_RESOLVER_SCHEME, IChatEditingService, IChatEditingSession, IModifiedFileEntry, IModifiedFileEntryChangeHunk, IModifiedFileEntryEditorIntegration, ModifiedFileEntryState, parseChatMultiDiffUri } from '../../common/chatEditingService.js';
import { CHAT_CATEGORY } from '../actions/chatActions.js';
import { ctxCursorInChangeRange, ctxHasEditorModification, ctxIsCurrentlyBeingModified, ctxIsGlobalEditingSession, ctxReviewModeEnabled } from './chatEditingEditorContextKeys.js';


abstract class ChatEditingEditorAction extends Action2 {

	constructor(desc: Readonly<IAction2Options>) {
		super({
			category: CHAT_CATEGORY,
			...desc
		});
	}

	override async run(accessor: ServicesAccessor, ...args: unknown[]) {

		const instaService = accessor.get(IInstantiationService);
		const chatEditingService = accessor.get(IChatEditingService);
		const editorService = accessor.get(IEditorService);

		const uri = EditorResourceAccessor.getOriginalUri(editorService.activeEditorPane?.input, { supportSideBySide: SideBySideEditor.PRIMARY });

		if (!uri || !editorService.activeEditorPane) {
			return;
		}

		const session = chatEditingService.editingSessionsObs.get()
			.find(candidate => candidate.getEntry(uri));

		if (!session) {
			return;
		}

		const entry = session.getEntry(uri)!;
		const ctrl = entry.getEditorIntegration(editorService.activeEditorPane);

		return instaService.invokeFunction(this.runChatEditingCommand.bind(this), session, entry, ctrl, ...args);
	}

	abstract runChatEditingCommand(accessor: ServicesAccessor, session: IChatEditingSession, entry: IModifiedFileEntry, integration: IModifiedFileEntryEditorIntegration, ...args: unknown[]): Promise<void> | void;
}

abstract class NavigateAction extends ChatEditingEditorAction {

	constructor(readonly next: boolean) {
		super({
			id: next
				? 'chatEditor.action.navigateNext'
				: 'chatEditor.action.navigatePrevious',
			title: next
				? localize2('next', 'Go to Next Chat Edit')
				: localize2('prev', 'Go to Previous Chat Edit'),
			icon: next ? Codicon.arrowDown : Codicon.arrowUp,
			precondition: ContextKeyExpr.and(ChatContextKeys.enabled, ctxHasEditorModification),
			keybinding: {
				primary: next
					? KeyMod.Alt | KeyCode.F5
					: KeyMod.Alt | KeyMod.Shift | KeyCode.F5,
				weight: KeybindingWeight.WorkbenchContrib,
				when: ContextKeyExpr.and(
					ctxHasEditorModification,
					ContextKeyExpr.or(EditorContextKeys.focus, NOTEBOOK_CELL_LIST_FOCUSED)
				),
			},
			f1: true,
			menu: {
				id: MenuId.ChatEditingEditorContent,
				group: 'navigate',
				order: !next ? 2 : 3,
				when: ContextKeyExpr.and(ctxReviewModeEnabled, ctxHasEditorModification)
			}
		});
	}

	override async runChatEditingCommand(accessor: ServicesAccessor, session: IChatEditingSession, entry: IModifiedFileEntry, ctrl: IModifiedFileEntryEditorIntegration): Promise<void> {

		const instaService = accessor.get(IInstantiationService);

		const done = this.next
			? ctrl.next(false)
			: ctrl.previous(false);

		if (done) {
			return;
		}

		const didOpenNext = await instaService.invokeFunction(openNextOrPreviousChange, session, entry, this.next);
		if (didOpenNext) {
			return;
		}

		//ELSE: wrap inside the same file
		this.next
			? ctrl.next(true)
			: ctrl.previous(true);
	}
}

async function openNextOrPreviousChange(accessor: ServicesAccessor, session: IChatEditingSession, entry: IModifiedFileEntry, next: boolean) {

	const editorService = accessor.get(IEditorService);

	const entries = session.entries.get();
	let idx = entries.indexOf(entry);

	let newEntry: IModifiedFileEntry;
	while (true) {
		idx = (idx + (next ? 1 : -1) + entries.length) % entries.length;
		newEntry = entries[idx];
		if (newEntry.state.get() === ModifiedFileEntryState.Modified) {
			break;
		} else if (newEntry === entry) {
			return false;
		}
	}

	const pane = await editorService.openEditor({
		resource: newEntry.modifiedURI,
		options: {
			revealIfOpened: false,
			revealIfVisible: false,
		}
	}, ACTIVE_GROUP);

	if (!pane) {
		return false;
	}

	if (session.entries.get().includes(newEntry)) {
		// make sure newEntry is still valid!
		newEntry.getEditorIntegration(pane).reveal(next);
	}

	return true;
}

abstract class KeepOrUndoAction extends ChatEditingEditorAction {

	constructor(id: string, private _keep: boolean) {
		super({
			id,
			title: _keep
				? localize2('accept', 'Keep Chat Edits')
				: localize2('discard', 'Undo Chat Edits'),
			shortTitle: _keep
				? localize2('accept2', 'Keep')
				: localize2('discard2', 'Undo'),
			tooltip: _keep
				? localize2('accept3', 'Keep Chat Edits in this File')
				: localize2('discard3', 'Undo Chat Edits in this File'),
			precondition: ContextKeyExpr.and(ctxIsGlobalEditingSession, ctxHasEditorModification, ctxIsCurrentlyBeingModified.negate()),
			icon: _keep
				? Codicon.check
				: Codicon.discard,
			f1: true,
			keybinding: {
				when: ContextKeyExpr.or(EditorContextKeys.focus, NOTEBOOK_EDITOR_FOCUSED),
				weight: KeybindingWeight.WorkbenchContrib + 10, // win over new-window-action
				primary: _keep
					? KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyY
					: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyN,
			},
			menu: {
				id: MenuId.ChatEditingEditorContent,
				group: 'a_resolve',
				order: _keep ? 0 : 1,
				when: !_keep ? ctxReviewModeEnabled : undefined
			}
		});
	}

	override async runChatEditingCommand(accessor: ServicesAccessor, session: IChatEditingSession, entry: IModifiedFileEntry, _integration: IModifiedFileEntryEditorIntegration): Promise<void> {

		const instaService = accessor.get(IInstantiationService);

		if (this._keep) {
			session.accept(entry.modifiedURI);
		} else {
			session.reject(entry.modifiedURI);
		}

		await instaService.invokeFunction(openNextOrPreviousChange, session, entry, true);
	}
}

export class AcceptAction extends KeepOrUndoAction {

	static readonly ID = 'chatEditor.action.accept';

	constructor() {
		super(AcceptAction.ID, true);
	}
}

export class RejectAction extends KeepOrUndoAction {

	static readonly ID = 'chatEditor.action.reject';

	constructor() {
		super(RejectAction.ID, false);
	}
}

const acceptHunkId = 'chatEditor.action.acceptHunk';
const undoHunkId = 'chatEditor.action.undoHunk';
abstract class AcceptRejectHunkAction extends ChatEditingEditorAction {

	constructor(private readonly _accept: boolean) {
		super(
			{
				id: _accept ? acceptHunkId : undoHunkId,
				title: _accept ? localize2('acceptHunk', 'Keep this Change') : localize2('undo', 'Undo this Change'),
				shortTitle: _accept ? localize2('acceptHunkShort', 'Keep') : localize2('undoShort', 'Undo'),
				precondition: ContextKeyExpr.and(ctxHasEditorModification, ctxIsCurrentlyBeingModified.negate()),
				f1: true,
				keybinding: {
					when: ContextKeyExpr.and(ctxCursorInChangeRange, ContextKeyExpr.or(EditorContextKeys.focus, NOTEBOOK_CELL_LIST_FOCUSED)),
					weight: KeybindingWeight.WorkbenchContrib + 1,
					primary: _accept
						? KeyMod.CtrlCmd | KeyCode.KeyY
						: KeyMod.CtrlCmd | KeyCode.KeyN
				},
				menu: {
					id: MenuId.ChatEditingEditorHunk,
					order: 1
				}
			}
		);
	}

	override async runChatEditingCommand(accessor: ServicesAccessor, session: IChatEditingSession, entry: IModifiedFileEntry, ctrl: IModifiedFileEntryEditorIntegration, ...args: unknown[]): Promise<void> {

		const instaService = accessor.get(IInstantiationService);

		if (this._accept) {
			await ctrl.acceptNearestChange(args[0] as IModifiedFileEntryChangeHunk | undefined);
		} else {
			await ctrl.rejectNearestChange(args[0] as IModifiedFileEntryChangeHunk | undefined);
		}

		if (entry.changesCount.get() === 0) {
			// no more changes, move to next file
			await instaService.invokeFunction(openNextOrPreviousChange, session, entry, true);
		}
	}
}

export class AcceptHunkAction extends AcceptRejectHunkAction {

	static readonly ID = acceptHunkId;

	constructor() {
		super(true);
	}
}

export class RejectHunkAction extends AcceptRejectHunkAction {

	static readonly ID = undoHunkId;

	constructor() {
		super(false);
	}
}

class ToggleDiffAction extends ChatEditingEditorAction {
	constructor() {
		super({
			id: 'chatEditor.action.toggleDiff',
			title: localize2('diff', 'Toggle Diff Editor for Chat Edits'),
			category: CHAT_CATEGORY,
			toggled: {
				condition: ContextKeyExpr.or(EditorContextKeys.inDiffEditor, ActiveEditorContext.isEqualTo(TEXT_DIFF_EDITOR_ID))!,
				icon: Codicon.goToFile,
			},
			precondition: ContextKeyExpr.and(ctxHasEditorModification),
			icon: Codicon.diffSingle,
			keybinding: {
				when: EditorContextKeys.focus,
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Alt | KeyMod.Shift | KeyCode.F7,
			},
			menu: [{
				id: MenuId.ChatEditingEditorHunk,
				order: 10
			}, {
				id: MenuId.ChatEditingEditorContent,
				group: 'a_resolve',
				order: 2,
				when: ContextKeyExpr.and(ctxReviewModeEnabled)
			}]
		});
	}

	override runChatEditingCommand(_accessor: ServicesAccessor, _session: IChatEditingSession, _entry: IModifiedFileEntry, integration: IModifiedFileEntryEditorIntegration, ...args: unknown[]): Promise<void> | void {
		integration.toggleDiff(args[0] as IModifiedFileEntryChangeHunk | undefined);
	}
}

class ToggleAccessibleDiffViewAction extends ChatEditingEditorAction {
	constructor() {
		super({
			id: 'chatEditor.action.showAccessibleDiffView',
			title: localize2('accessibleDiff', 'Show Accessible Diff View for Chat Edits'),
			f1: true,
			precondition: ContextKeyExpr.and(ctxHasEditorModification, ctxIsCurrentlyBeingModified.negate()),
			keybinding: {
				when: EditorContextKeys.focus,
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyCode.F7,
			}
		});
	}

	override runChatEditingCommand(_accessor: ServicesAccessor, _session: IChatEditingSession, _entry: IModifiedFileEntry, integration: IModifiedFileEntryEditorIntegration): Promise<void> | void {
		integration.enableAccessibleDiffView();
	}
}

export class ReviewChangesAction extends ChatEditingEditorAction {

	constructor() {
		super({
			id: 'chatEditor.action.reviewChanges',
			title: localize2('review', "Review"),
			precondition: ContextKeyExpr.and(ctxHasEditorModification, ctxIsCurrentlyBeingModified.negate()),
			menu: [{
				id: MenuId.ChatEditingEditorContent,
				group: 'a_resolve',
				order: 3,
				when: ContextKeyExpr.and(ctxReviewModeEnabled.negate(), ctxIsCurrentlyBeingModified.negate()),
			}]
		});
	}

	override runChatEditingCommand(_accessor: ServicesAccessor, _session: IChatEditingSession, entry: IModifiedFileEntry, _integration: IModifiedFileEntryEditorIntegration, ..._args: unknown[]): void {
		entry.enableReviewModeUntilSettled();
	}
}

export class AcceptAllEditsAction extends ChatEditingEditorAction {

	static readonly ID = 'chatEditor.action.acceptAllEdits';

	constructor() {
		super({
			id: AcceptAllEditsAction.ID,
			title: localize2('acceptAllEdits', 'Keep All Chat Edits'),
			tooltip: localize2('acceptAllEditsTooltip', 'Keep All Chat Edits in this Session'),
			precondition: ContextKeyExpr.and(ctxHasEditorModification, ctxIsCurrentlyBeingModified.negate()),
			icon: Codicon.checkAll,
			f1: true,
			keybinding: {
				when: ContextKeyExpr.or(EditorContextKeys.focus, NOTEBOOK_EDITOR_FOCUSED),
				weight: KeybindingWeight.WorkbenchContrib + 10,
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyY,
			},
		});
	}

	override async runChatEditingCommand(_accessor: ServicesAccessor, session: IChatEditingSession, _entry: IModifiedFileEntry, _integration: IModifiedFileEntryEditorIntegration, ..._args: unknown[]): Promise<void> {
		await session.accept();
	}
}


// --- multi file diff

abstract class MultiDiffAcceptDiscardAction extends Action2 {

	constructor(readonly accept: boolean) {
		super({
			id: accept ? 'chatEditing.multidiff.acceptAllFiles' : 'chatEditing.multidiff.discardAllFiles',
			title: accept ? localize('accept4', 'Keep All Edits') : localize('discard4', 'Undo All Edits'),
			icon: accept ? Codicon.check : Codicon.discard,
			menu: {
				when: ContextKeyExpr.equals('resourceScheme', CHAT_EDITING_MULTI_DIFF_SOURCE_RESOLVER_SCHEME),
				id: MenuId.EditorTitle,
				order: accept ? 0 : 1,
				group: 'navigation',
			},
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const chatEditingService = accessor.get(IChatEditingService);
		const editorService = accessor.get(IEditorService);
		const editorGroupsService = accessor.get(IEditorGroupsService);
		const listService = accessor.get(IListService);

		const resolvedContext = resolveCommandsContext(args, editorService, editorGroupsService, listService);

		const groupContext = resolvedContext.groupedEditors[0];
		if (!groupContext) {
			return;
		}

		const editor = groupContext.editors[0];
		if (!(editor instanceof MultiDiffEditorInput) || !editor.resource) {
			return;
		}

		const { chatSessionResource } = parseChatMultiDiffUri(editor.resource);
		const session = chatEditingService.getEditingSession(chatSessionResource);
		if (session) {
			if (this.accept) {
				await session.accept();
			} else {
				await session.reject();
			}

			editorService.closeEditor({ editor, groupId: groupContext.group.id });
		}
	}
}


export function registerChatEditorActions() {
	registerAction2(class NextAction extends NavigateAction { constructor() { super(true); } });
	registerAction2(class PrevAction extends NavigateAction { constructor() { super(false); } });
	registerAction2(ReviewChangesAction);
	registerAction2(AcceptAction);
	registerAction2(RejectAction);
	registerAction2(AcceptAllEditsAction);
	registerAction2(AcceptHunkAction);
	registerAction2(RejectHunkAction);
	registerAction2(ToggleDiffAction);
	registerAction2(ToggleAccessibleDiffViewAction);

	registerAction2(class extends MultiDiffAcceptDiscardAction { constructor() { super(true); } });
	registerAction2(class extends MultiDiffAcceptDiscardAction { constructor() { super(false); } });

	MenuRegistry.appendMenuItem(MenuId.ChatEditingEditorContent, {
		command: {
			id: navigationBearingFakeActionId,
			title: localize('label', "Navigation Status"),
			precondition: ContextKeyExpr.false(),
		},
		group: 'navigate',
		order: -1,
		when: ContextKeyExpr.and(ctxReviewModeEnabled, ctxHasEditorModification),
	});
}

export const navigationBearingFakeActionId = 'chatEditor.navigation.bearings';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingEditorContextKeys.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingEditorContextKeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Event } from '../../../../../base/common/event.js';
import { DisposableMap, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { autorun, constObservable, derived, IObservable, observableFromEvent } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize } from '../../../../../nls.js';
import { IContextKey, RawContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../../common/editor.js';
import { IEditorGroup, IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { IInlineChatSessionService } from '../../../inlineChat/browser/inlineChatSessionService.js';
import { IChatEditingService, IChatEditingSession, IModifiedFileEntry, ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { IChatService } from '../../common/chatService.js';

export const ctxIsGlobalEditingSession = new RawContextKey<boolean>('chatEdits.isGlobalEditingSession', undefined, localize('chat.ctxEditSessionIsGlobal', "The current editor is part of the global edit session"));
export const ctxHasEditorModification = new RawContextKey<boolean>('chatEdits.hasEditorModifications', undefined, localize('chat.hasEditorModifications', "The current editor contains chat modifications"));
export const ctxIsCurrentlyBeingModified = new RawContextKey<boolean>('chatEdits.isCurrentlyBeingModified', undefined, localize('chat.isCurrentlyBeingModified', "The current editor is currently being modified"));
export const ctxReviewModeEnabled = new RawContextKey<boolean>('chatEdits.isReviewModeEnabled', true, localize('chat.ctxReviewModeEnabled', "Review mode for chat changes is enabled"));
export const ctxHasRequestInProgress = new RawContextKey<boolean>('chatEdits.isRequestInProgress', false, localize('chat.ctxHasRequestInProgress', "The current editor shows a file from an edit session which is still in progress"));
export const ctxRequestCount = new RawContextKey<number>('chatEdits.requestCount', 0, localize('chatEdits.requestCount', "The number of turns the editing session in this editor has"));
export const ctxCursorInChangeRange = new RawContextKey<boolean>('chatEdits.cursorInChangeRange', false, localize('chat.ctxCursorInChangeRange', "The cursor is inside a change range made by chat editing."));

export class ChatEditingEditorContextKeys implements IWorkbenchContribution {

	static readonly ID = 'chat.edits.editorContextKeys';

	private readonly _store = new DisposableStore();

	constructor(
		@IInstantiationService instaService: IInstantiationService,
		@IEditorGroupsService editorGroupsService: IEditorGroupsService,
	) {

		const editorGroupCtx = this._store.add(new DisposableMap<IEditorGroup>());

		const editorGroups = observableFromEvent(
			this,
			Event.any(editorGroupsService.onDidAddGroup, editorGroupsService.onDidRemoveGroup),
			() => editorGroupsService.groups);


		this._store.add(autorun(r => {

			const toDispose = new Set(editorGroupCtx.keys());

			for (const group of editorGroups.read(r)) {

				toDispose.delete(group);

				if (editorGroupCtx.has(group)) {
					continue;
				}

				editorGroupCtx.set(group, instaService.createInstance(ContextKeyGroup, group));
			}

			for (const item of toDispose) {
				editorGroupCtx.deleteAndDispose(item);
			}
		}));
	}

	dispose(): void {
		this._store.dispose();
	}
}


class ContextKeyGroup {

	private readonly _ctxIsGlobalEditingSession: IContextKey<boolean>;
	private readonly _ctxHasEditorModification: IContextKey<boolean>;
	private readonly _ctxHasRequestInProgress: IContextKey<boolean>;
	private readonly _ctxReviewModeEnabled: IContextKey<boolean>;
	private readonly _ctxIsCurrentlyBeingModified: IContextKey<boolean>;
	private readonly _ctxRequestCount: IContextKey<number>;

	private readonly _store = new DisposableStore();

	constructor(
		group: IEditorGroup,
		@IInlineChatSessionService inlineChatSessionService: IInlineChatSessionService,
		@IChatEditingService chatEditingService: IChatEditingService,
		@IChatService chatService: IChatService,
	) {
		this._ctxIsGlobalEditingSession = ctxIsGlobalEditingSession.bindTo(group.scopedContextKeyService);
		this._ctxHasEditorModification = ctxHasEditorModification.bindTo(group.scopedContextKeyService);
		this._ctxIsCurrentlyBeingModified = ctxIsCurrentlyBeingModified.bindTo(group.scopedContextKeyService);
		this._ctxHasRequestInProgress = ctxHasRequestInProgress.bindTo(group.scopedContextKeyService);
		this._ctxReviewModeEnabled = ctxReviewModeEnabled.bindTo(group.scopedContextKeyService);
		this._ctxRequestCount = ctxRequestCount.bindTo(group.scopedContextKeyService);

		const editorObs = observableFromEvent(this, group.onDidModelChange, () => group.activeEditor);
		const tupleObs = derived(r => {
			const editor = editorObs.read(r);
			const uri = EditorResourceAccessor.getOriginalUri(editor, { supportSideBySide: SideBySideEditor.PRIMARY });

			if (!uri) {
				this._reset();
				return;
			}

			return new ObservableEditorSession(uri, chatEditingService, inlineChatSessionService).value.read(r);
		});

		this._store.add(autorun(r => {
			const tuple = tupleObs.read(r);
			if (!tuple) {
				this._reset();
				return;
			}

			const { session, entry } = tuple;

			const chatModel = chatService.getSession(session.chatSessionResource);

			this._ctxHasEditorModification.set(entry?.state.read(r) === ModifiedFileEntryState.Modified);
			this._ctxIsGlobalEditingSession.set(session.isGlobalEditingSession);
			this._ctxReviewModeEnabled.set(entry ? entry.reviewMode.read(r) : false);
			this._ctxHasRequestInProgress.set(chatModel?.requestInProgress.read(r) ?? false);
			this._ctxIsCurrentlyBeingModified.set(!!entry?.isCurrentlyBeingModifiedBy.read(r));

			// number of requests
			const requestCount = chatModel
				? observableFromEvent(this, chatModel.onDidChange, () => chatModel.getRequests().length)
				: constObservable(0);

			this._ctxRequestCount.set(requestCount.read(r));
		}));
	}

	private _reset(): void {
		this._ctxIsGlobalEditingSession.reset();
		this._ctxHasEditorModification.reset();
		this._ctxHasRequestInProgress.reset();
		this._ctxReviewModeEnabled.reset();
		this._ctxRequestCount.reset();
	}

	dispose(): void {
		this._store.dispose();
		this._reset();
	}
}

export class ObservableEditorSession {

	readonly value: IObservable<undefined | { session: IChatEditingSession; entry: IModifiedFileEntry | undefined; isInlineChat: boolean }>;

	constructor(
		uri: URI,
		@IChatEditingService chatEditingService: IChatEditingService,
		@IInlineChatSessionService inlineChatService: IInlineChatSessionService
	) {

		const inlineSessionObs = observableFromEvent(this, inlineChatService.onDidChangeSessions, () => inlineChatService.getSession2(uri));

		const sessionObs = chatEditingService.editingSessionsObs.map((value, r) => {
			for (const session of value) {
				const entry = session.readEntry(uri, r);
				if (entry) {
					return { session, entry, isInlineChat: false };
				}
			}
			return undefined;
		});

		this.value = derived(r => {

			const inlineSession = inlineSessionObs.read(r);

			if (inlineSession) {
				return { session: inlineSession.editingSession, entry: inlineSession.editingSession.readEntry(uri, r), isInlineChat: true };
			}

			return sessionObs.read(r);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingEditorOverlay.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingEditorOverlay.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../media/chatEditingEditorOverlay.css';
import { combinedDisposable, Disposable, DisposableMap, DisposableStore, MutableDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, derived, derivedOpts, IObservable, observableFromEvent, observableFromEventOpts, observableSignalFromEvent, observableValue, transaction } from '../../../../../base/common/observable.js';
import { HiddenItemStrategy, MenuWorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IChatEditingService, IChatEditingSession, IModifiedFileEntry, ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { ActionViewItem } from '../../../../../base/browser/ui/actionbar/actionViewItems.js';
import { IActionRunner } from '../../../../../base/common/actions.js';
import { $, addDisposableGenericMouseMoveListener, append } from '../../../../../base/browser/dom.js';
import { assertType } from '../../../../../base/common/types.js';
import { localize } from '../../../../../nls.js';
import { AcceptAction, navigationBearingFakeActionId, RejectAction } from './chatEditingEditorActions.js';
import { IChatService } from '../../common/chatService.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { IEditorGroup, IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { EditorGroupView } from '../../../../browser/parts/editor/editorGroupView.js';
import { Event } from '../../../../../base/common/event.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../../common/editor.js';
import { IInlineChatSessionService } from '../../../inlineChat/browser/inlineChatSessionService.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { ObservableEditorSession } from './chatEditingEditorContextKeys.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { renderIcon } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import * as arrays from '../../../../../base/common/arrays.js';
import { renderAsPlaintext } from '../../../../../base/browser/markdownRenderer.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';

class ChatEditorOverlayWidget extends Disposable {

	private readonly _domNode: HTMLElement;
	private readonly _toolbarNode: HTMLElement;

	private readonly _showStore = this._store.add(new DisposableStore());

	private readonly _session = observableValue<IChatEditingSession | undefined>(this, undefined);
	private readonly _entry = observableValue<IModifiedFileEntry | undefined>(this, undefined);
	private readonly _isBusy: IObservable<boolean | undefined>;

	private readonly _navigationBearings = observableValue<{ changeCount: number; activeIdx: number; entriesCount: number }>(this, { changeCount: -1, activeIdx: -1, entriesCount: -1 });

	constructor(
		private readonly _editor: { focus(): void },
		@IChatService private readonly _chatService: IChatService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IInstantiationService private readonly _instaService: IInstantiationService,
	) {
		super();
		this._domNode = document.createElement('div');
		this._domNode.classList.add('chat-editor-overlay-widget');

		this._isBusy = derived(r => {
			const entry = this._entry.read(r);
			const session = this._session.read(r);
			return entry?.waitsForLastEdits.read(r) ?? !session?.isGlobalEditingSession; // aka inline chat
		});

		const requestMessage = derived(r => {

			const session = this._session.read(r);
			const chatModel = session?.chatSessionResource && this._chatService.getSession(session?.chatSessionResource);
			if (!session || !chatModel) {
				return undefined;
			}

			const response = this._entry.read(r)?.lastModifyingResponse.read(r);
			if (!response) {
				return { message: localize('working', "Working...") };
			}

			const lastPart = observableFromEventOpts({ equalsFn: arrays.equals }, response.onDidChange, () => response.response.value)
				.read(r)
				.filter(part => part.kind === 'progressMessage' || part.kind === 'toolInvocation')
				.at(-1);

			if (lastPart?.kind === 'toolInvocation') {
				return { message: lastPart.invocationMessage };

			} else if (lastPart?.kind === 'progressMessage') {
				return { message: lastPart.content };

			} else {
				return { message: localize('working', "Working...") };
			}
		});


		const progressNode = document.createElement('div');
		progressNode.classList.add('chat-editor-overlay-progress');
		append(progressNode, renderIcon(ThemeIcon.modify(Codicon.loading, 'spin')));
		const textProgress = append(progressNode, $('span.progress-message'));
		this._domNode.appendChild(progressNode);

		this._store.add(autorun(r => {
			const value = requestMessage.read(r);
			const busy = this._isBusy.read(r);

			this._domNode.classList.toggle('busy', busy);

			if (!busy || !value || this._session.read(r)?.isGlobalEditingSession) {
				textProgress.innerText = '';
			} else if (value) {
				textProgress.innerText = renderAsPlaintext(value.message);
			}
		}));

		this._toolbarNode = document.createElement('div');
		this._toolbarNode.classList.add('chat-editor-overlay-toolbar');

	}

	override dispose() {
		this.hide();
		super.dispose();
	}

	getDomNode(): HTMLElement {
		return this._domNode;
	}

	show(session: IChatEditingSession, entry: IModifiedFileEntry | undefined, indicies: { entryIndex: IObservable<number>; changeIndex: IObservable<number> }) {

		this._showStore.clear();

		transaction(tx => {
			this._session.set(session, tx);
			this._entry.set(entry, tx);
		});

		this._showStore.add(autorun(r => {

			const entryIndex = indicies.entryIndex.read(r);
			const changeIndex = indicies.changeIndex.read(r);

			const entries = session.entries.read(r);

			let activeIdx = entryIndex !== undefined && changeIndex !== undefined
				? changeIndex
				: -1;

			let totalChangesCount = 0;
			for (let i = 0; i < entries.length; i++) {
				const changesCount = entries[i].changesCount.read(r);
				totalChangesCount += changesCount;

				if (entryIndex !== undefined && i < entryIndex) {
					activeIdx += changesCount;
				}
			}

			this._navigationBearings.set({ changeCount: totalChangesCount, activeIdx, entriesCount: entries.length }, undefined);
		}));


		this._domNode.appendChild(this._toolbarNode);
		this._showStore.add(toDisposable(() => this._toolbarNode.remove()));

		this._showStore.add(this._instaService.createInstance(MenuWorkbenchToolBar, this._toolbarNode, MenuId.ChatEditingEditorContent, {
			telemetrySource: 'chatEditor.overlayToolbar',
			hiddenItemStrategy: HiddenItemStrategy.Ignore,
			toolbarOptions: {
				primaryGroup: () => true,
				useSeparatorsInPrimaryActions: true
			},
			menuOptions: { renderShortTitle: true },
			actionViewItemProvider: (action, options) => {
				const that = this;

				if (action.id === navigationBearingFakeActionId) {
					return new class extends ActionViewItem {

						constructor() {
							super(undefined, action, { ...options, icon: false, label: true, keybindingNotRenderedWithLabel: true });
						}

						override render(container: HTMLElement) {
							super.render(container);

							container.classList.add('label-item');

							this._store.add(autorun(r => {
								assertType(this.label);

								const { changeCount, activeIdx } = that._navigationBearings.read(r);

								if (changeCount > 0) {
									const n = activeIdx === -1 ? '1' : `${activeIdx + 1}`;
									this.label.innerText = localize('nOfM', "{0} of {1}", n, changeCount);
								} else {
									// allow-any-unicode-next-line
									this.label.innerText = localize('0Of0', "—");
								}

								this.updateTooltip();
							}));
						}

						protected override getTooltip(): string | undefined {
							const { changeCount, entriesCount } = that._navigationBearings.get();
							if (changeCount === -1 || entriesCount === -1) {
								return undefined;
							}
							let result: string | undefined;
							if (changeCount === 1 && entriesCount === 1) {
								result = localize('tooltip_11', "1 change in 1 file");
							} else if (changeCount === 1) {
								result = localize('tooltip_1n', "1 change in {0} files", entriesCount);
							} else if (entriesCount === 1) {
								result = localize('tooltip_n1', "{0} changes in 1 file", changeCount);
							} else {
								result = localize('tooltip_nm', "{0} changes in {1} files", changeCount, entriesCount);
							}
							if (!that._isBusy.get()) {
								return result;
							}
							return localize('tooltip_busy', "{0} - Working...", result);
						}
					};
				}

				if (action.id === AcceptAction.ID || action.id === RejectAction.ID) {
					return new class extends ActionViewItem {

						private readonly _reveal = this._store.add(new MutableDisposable());

						constructor() {
							super(undefined, action, { ...options, icon: false, label: true, keybindingNotRenderedWithLabel: true });
						}

						override render(container: HTMLElement): void {
							super.render(container);

							if (action.id === AcceptAction.ID) {

								const listener = this._store.add(new MutableDisposable());

								this._store.add(autorun(r => {

									assertType(this.label);
									assertType(this.element);

									const ctrl = that._entry.read(r)?.autoAcceptController.read(r);
									if (ctrl) {

										const r = -100 * (ctrl.remaining / ctrl.total);

										this.element.style.setProperty('--vscode-action-item-auto-timeout', `${r}%`);

										this.element.classList.toggle('auto', true);
										listener.value = addDisposableGenericMouseMoveListener(this.element, () => ctrl.cancel());
									} else {
										this.element.classList.toggle('auto', false);
										listener.clear();
									}
								}));
							}
						}

						override set actionRunner(actionRunner: IActionRunner) {
							super.actionRunner = actionRunner;
							this._reveal.value = actionRunner.onWillRun(_e => {
								that._editor.focus();
							});
						}

						override get actionRunner(): IActionRunner {
							return super.actionRunner;
						}

						protected override getTooltip(): string | undefined {
							const value = super.getTooltip();
							if (!value) {
								return value;
							}
							const kb = that._keybindingService.lookupKeybinding(this.action.id);
							if (!kb) {
								return value;
							}
							return localize('tooltip', "{0} ({1})", value, kb.getLabel());
						}
					};
				}

				return undefined;
			}
		}));

	}

	hide() {
		transaction(tx => {
			this._session.set(undefined, tx);
			this._entry.set(undefined, tx);
			this._navigationBearings.set({ changeCount: -1, activeIdx: -1, entriesCount: -1 }, tx);
		});
		this._showStore.clear();
	}
}

class ChatEditingOverlayController {

	private readonly _store = new DisposableStore();

	private readonly _domNode = document.createElement('div');

	constructor(
		container: HTMLElement,
		group: IEditorGroup,
		@IInstantiationService instaService: IInstantiationService,
		@IChatService chatService: IChatService,
		@IChatEditingService chatEditingService: IChatEditingService,
		@IInlineChatSessionService inlineChatService: IInlineChatSessionService
	) {

		this._domNode.classList.add('chat-editing-editor-overlay');
		this._domNode.style.position = 'absolute';
		this._domNode.style.bottom = `24px`;
		this._domNode.style.right = `24px`;
		this._domNode.style.zIndex = `100`;

		const widget = instaService.createInstance(ChatEditorOverlayWidget, group);
		this._domNode.appendChild(widget.getDomNode());
		this._store.add(toDisposable(() => this._domNode.remove()));
		this._store.add(widget);

		const show = () => {
			if (!container.contains(this._domNode)) {
				container.appendChild(this._domNode);
			}
		};

		const hide = () => {
			if (container.contains(this._domNode)) {
				widget.hide();
				this._domNode.remove();
			}
		};

		const activeEditorSignal = observableSignalFromEvent(this, Event.any(group.onDidActiveEditorChange, group.onDidModelChange));

		const activeUriObs = derivedOpts({ equalsFn: isEqual }, r => {

			activeEditorSignal.read(r); // signal

			const editor = group.activeEditorPane;
			const uri = EditorResourceAccessor.getOriginalUri(editor?.input, { supportSideBySide: SideBySideEditor.PRIMARY });

			return uri;
		});

		const sessionAndEntry = derived(r => {

			activeEditorSignal.read(r); // signal to ensure activeEditor and activeEditorPane don't go out of sync

			const uri = activeUriObs.read(r);
			if (!uri) {
				return undefined;
			}

			return new ObservableEditorSession(uri, chatEditingService, inlineChatService).value.read(r);
		});

		const isInProgress = derived(r => {

			const session = sessionAndEntry.read(r)?.session;
			if (!session) {
				return false;
			}

			const chatModel = chatService.getSession(session.chatSessionResource)!;
			return chatModel.requestInProgress.read(r);
		});

		this._store.add(autorun(r => {

			const data = sessionAndEntry.read(r);

			if (!data) {
				hide();
				return;
			}

			const { session, entry } = data;

			if (!session.isGlobalEditingSession) {
				// inline chat - no chat overlay unless hideOnRequest is on
				hide();
				return;
			}

			if (
				entry?.state.read(r) === ModifiedFileEntryState.Modified // any entry changing
				|| (!session.isGlobalEditingSession && isInProgress.read(r)) // inline chat request
			) {
				// any session with changes
				const editorPane = group.activeEditorPane;
				assertType(editorPane);

				const changeIndex = derived(r => entry
					? entry.getEditorIntegration(editorPane).currentIndex.read(r)
					: 0);

				const entryIndex = derived(r => entry
					? session.entries.read(r).indexOf(entry)
					: 0
				);

				widget.show(session, entry, { entryIndex, changeIndex });
				show();

			} else {
				// nothing
				hide();
			}
		}));
	}

	dispose(): void {
		this._store.dispose();
	}
}

export class ChatEditingEditorOverlay implements IWorkbenchContribution {

	static readonly ID = 'chat.edits.editorOverlay';

	private readonly _store = new DisposableStore();

	constructor(
		@IEditorGroupsService editorGroupsService: IEditorGroupsService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {

		const editorGroups = observableFromEvent(
			this,
			Event.any(editorGroupsService.onDidAddGroup, editorGroupsService.onDidRemoveGroup),
			() => editorGroupsService.groups
		);

		const overlayWidgets = new DisposableMap<IEditorGroup>();

		this._store.add(autorun(r => {

			const toDelete = new Set(overlayWidgets.keys());
			const groups = editorGroups.read(r);


			for (const group of groups) {

				if (!(group instanceof EditorGroupView)) {
					// TODO@jrieken better with https://github.com/microsoft/vscode/tree/ben/layout-group-container
					continue;
				}

				toDelete.delete(group); // we keep the widget for this group!

				if (!overlayWidgets.has(group)) {

					const scopedInstaService = instantiationService.createChild(
						new ServiceCollection([IContextKeyService, group.scopedContextKeyService])
					);

					const container = group.element;

					const ctrl = scopedInstaService.createInstance(ChatEditingOverlayController, container, group);
					overlayWidgets.set(group, combinedDisposable(ctrl, scopedInstaService));
				}
			}

			for (const group of toDelete) {
				overlayWidgets.deleteAndDispose(group);
			}
		}));
	}

	dispose(): void {
		this._store.dispose();
	}
}
```

--------------------------------------------------------------------------------

````

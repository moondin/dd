---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 346
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 346 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/chatListRenderer.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatListRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { renderFormattedText } from '../../../../base/browser/formattedTextRenderer.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { IActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { DropdownMenuActionViewItem, IDropdownMenuActionViewItemOptions } from '../../../../base/browser/ui/dropdown/dropdownActionViewItem.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IListElementRenderDetails, IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { ITreeNode, ITreeRenderer } from '../../../../base/browser/ui/tree/tree.js';
import { IAction } from '../../../../base/common/actions.js';
import { coalesce, distinct } from '../../../../base/common/arrays.js';
import { findLast } from '../../../../base/common/arraysFind.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { canceledName } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { FuzzyScore } from '../../../../base/common/filters.js';
import { IMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, IDisposable, dispose, thenIfNotDisposed, toDisposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { FileAccess, Schemas } from '../../../../base/common/network.js';
import { clamp } from '../../../../base/common/numbers.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IMenuEntryActionViewItemOptions, createActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { MenuWorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { MenuId, MenuItemAction } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IMarkdownRenderer } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { isDark } from '../../../../platform/theme/common/theme.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IChatEntitlementService } from '../../../services/chat/common/chatEntitlementService.js';
import { IWorkbenchIssueService } from '../../issue/common/issue.js';
import { CodiconActionViewItem } from '../../notebook/browser/view/cellParts/cellActionView.js';
import { annotateSpecialMarkdownContent } from '../common/annotations.js';
import { checkModeOption } from '../common/chat.js';
import { IChatAgentMetadata } from '../common/chatAgents.js';
import { ChatContextKeys } from '../common/chatContextKeys.js';
import { IChatTextEditGroup } from '../common/chatModel.js';
import { chatSubcommandLeader } from '../common/chatParserTypes.js';
import { ChatAgentVoteDirection, ChatAgentVoteDownReason, ChatErrorLevel, IChatConfirmation, IChatContentReference, IChatElicitationRequest, IChatElicitationRequestSerialized, IChatExtensionsContent, IChatFollowup, IChatMarkdownContent, IChatMcpServersStarting, IChatMultiDiffData, IChatPullRequestContent, IChatTask, IChatTaskSerialized, IChatThinkingPart, IChatToolInvocation, IChatToolInvocationSerialized, IChatTreeData, IChatUndoStop, isChatFollowup } from '../common/chatService.js';
import { localChatSessionType } from '../common/chatSessionsService.js';
import { getChatSessionType } from '../common/chatUri.js';
import { IChatRequestVariableEntry } from '../common/chatVariableEntries.js';
import { IChatChangesSummaryPart, IChatCodeCitations, IChatErrorDetailsPart, IChatReferences, IChatRendererContent, IChatRequestViewModel, IChatResponseViewModel, IChatViewModel, isRequestVM, isResponseVM } from '../common/chatViewModel.js';
import { getNWords } from '../common/chatWordCounter.js';
import { CodeBlockModelCollection } from '../common/codeBlockModelCollection.js';
import { ChatAgentLocation, ChatConfiguration, ChatModeKind, CollapsedToolsDisplayMode, ThinkingDisplayMode } from '../common/constants.js';
import { MarkUnhelpfulActionId } from './actions/chatTitleActions.js';
import { ChatTreeItem, IChatCodeBlockInfo, IChatFileTreeInfo, IChatListItemRendererOptions, IChatWidgetService } from './chat.js';
import { ChatAgentHover, getChatAgentHoverOptions } from './chatAgentHover.js';
import { ChatContentMarkdownRenderer } from './chatContentMarkdownRenderer.js';
import { ChatAgentCommandContentPart } from './chatContentParts/chatAgentCommandContentPart.js';
import { ChatAnonymousRateLimitedPart } from './chatContentParts/chatAnonymousRateLimitedPart.js';
import { ChatAttachmentsContentPart } from './chatContentParts/chatAttachmentsContentPart.js';
import { ChatCheckpointFileChangesSummaryContentPart } from './chatContentParts/chatChangesSummaryPart.js';
import { ChatCodeCitationContentPart } from './chatContentParts/chatCodeCitationContentPart.js';
import { ChatCommandButtonContentPart } from './chatContentParts/chatCommandContentPart.js';
import { ChatConfirmationContentPart } from './chatContentParts/chatConfirmationContentPart.js';
import { DiffEditorPool, EditorPool } from './chatContentParts/chatContentCodePools.js';
import { IChatContentPart, IChatContentPartRenderContext } from './chatContentParts/chatContentParts.js';
import { ChatElicitationContentPart } from './chatContentParts/chatElicitationContentPart.js';
import { ChatErrorConfirmationContentPart } from './chatContentParts/chatErrorConfirmationPart.js';
import { ChatErrorContentPart } from './chatContentParts/chatErrorContentPart.js';
import { ChatExtensionsContentPart } from './chatContentParts/chatExtensionsContentPart.js';
import { ChatMarkdownContentPart } from './chatContentParts/chatMarkdownContentPart.js';
import { ChatMcpServersInteractionContentPart } from './chatContentParts/chatMcpServersInteractionContentPart.js';
import { ChatMultiDiffContentPart } from './chatContentParts/chatMultiDiffContentPart.js';
import { ChatProgressContentPart, ChatWorkingProgressContentPart } from './chatContentParts/chatProgressContentPart.js';
import { ChatPullRequestContentPart } from './chatContentParts/chatPullRequestContentPart.js';
import { ChatQuotaExceededPart } from './chatContentParts/chatQuotaExceededPart.js';
import { ChatCollapsibleListContentPart, ChatUsedReferencesListContentPart, CollapsibleListPool } from './chatContentParts/chatReferencesContentPart.js';
import { ChatTaskContentPart } from './chatContentParts/chatTaskContentPart.js';
import { ChatTextEditContentPart } from './chatContentParts/chatTextEditContentPart.js';
import { ChatThinkingContentPart } from './chatContentParts/chatThinkingContentPart.js';
import { ChatTreeContentPart, TreePool } from './chatContentParts/chatTreeContentPart.js';
import './chatContentParts/media/chatMcpServersInteractionContent.css';
import { ChatToolInvocationPart } from './chatContentParts/toolInvocationParts/chatToolInvocationPart.js';
import { ChatMarkdownDecorationsRenderer } from './chatMarkdownDecorationsRenderer.js';
import { ChatEditorOptions } from './chatOptions.js';
import { ChatCodeBlockContentProvider, CodeBlockPart } from './codeBlockPart.js';

const $ = dom.$;

const COPILOT_USERNAME = 'GitHub Copilot';

export interface IChatListItemTemplate {
	currentElement?: ChatTreeItem;
	/**
	 * The parts that are currently rendered in the template. Note that these are purposely not added to elementDisposables-
	 * they are disposed in a separate cycle after diffing with the next content to render.
	 */
	renderedParts?: IChatContentPart[];
	readonly rowContainer: HTMLElement;
	readonly titleToolbar?: MenuWorkbenchToolBar;
	readonly header?: HTMLElement;
	readonly footerToolbar: MenuWorkbenchToolBar;
	readonly footerDetailsContainer: HTMLElement;
	readonly avatarContainer: HTMLElement;
	readonly username: HTMLElement;
	readonly detail: HTMLElement;
	readonly value: HTMLElement;
	readonly contextKeyService: IContextKeyService;
	readonly instantiationService: IInstantiationService;
	readonly templateDisposables: IDisposable;
	readonly elementDisposables: DisposableStore;
	readonly agentHover: ChatAgentHover;
	readonly requestHover: HTMLElement;
	readonly disabledOverlay: HTMLElement;
	readonly checkpointToolbar: MenuWorkbenchToolBar;
	readonly checkpointRestoreToolbar: MenuWorkbenchToolBar;
	readonly checkpointContainer: HTMLElement;
	readonly checkpointRestoreContainer: HTMLElement;
}

interface IItemHeightChangeParams {
	element: ChatTreeItem;
	height: number;
}

const forceVerboseLayoutTracing = false
	// || Boolean("TRUE") // causes a linter warning so that it cannot be pushed
	;

export interface IChatRendererDelegate {
	container: HTMLElement;
	getListLength(): number;
	currentChatMode(): ChatModeKind;

	readonly onDidScroll?: Event<void>;
}

const mostRecentResponseClassName = 'chat-most-recent-response';

export class ChatListItemRenderer extends Disposable implements ITreeRenderer<ChatTreeItem, FuzzyScore, IChatListItemTemplate> {
	static readonly ID = 'item';

	private readonly codeBlocksByResponseId = new Map<string, IChatCodeBlockInfo[]>();
	private readonly codeBlocksByEditorUri = new ResourceMap<IChatCodeBlockInfo>();

	private readonly fileTreesByResponseId = new Map<string, IChatFileTreeInfo[]>();
	private readonly focusedFileTreesByResponseId = new Map<string, number>();

	private readonly templateDataByRequestId = new Map<string, IChatListItemTemplate>();

	private readonly chatContentMarkdownRenderer: IMarkdownRenderer;
	private readonly markdownDecorationsRenderer: ChatMarkdownDecorationsRenderer;
	protected readonly _onDidClickFollowup = this._register(new Emitter<IChatFollowup>());
	readonly onDidClickFollowup: Event<IChatFollowup> = this._onDidClickFollowup.event;

	private readonly _onDidClickRerunWithAgentOrCommandDetection = new Emitter<{ readonly sessionResource: URI; readonly requestId: string }>();
	readonly onDidClickRerunWithAgentOrCommandDetection = this._onDidClickRerunWithAgentOrCommandDetection.event;


	private readonly _onDidClickRequest = this._register(new Emitter<IChatListItemTemplate>());
	readonly onDidClickRequest: Event<IChatListItemTemplate> = this._onDidClickRequest.event;

	private readonly _onDidRerender = this._register(new Emitter<IChatListItemTemplate>());
	readonly onDidRerender: Event<IChatListItemTemplate> = this._onDidRerender.event;

	private readonly _onDidDispose = this._register(new Emitter<IChatListItemTemplate>());
	readonly onDidDispose: Event<IChatListItemTemplate> = this._onDidDispose.event;

	private readonly _onDidFocusOutside = this._register(new Emitter<void>());
	readonly onDidFocusOutside: Event<void> = this._onDidFocusOutside.event;

	protected readonly _onDidChangeItemHeight = this._register(new Emitter<IItemHeightChangeParams>());
	readonly onDidChangeItemHeight: Event<IItemHeightChangeParams> = this._onDidChangeItemHeight.event;

	private readonly _editorPool: EditorPool;
	private readonly _toolEditorPool: EditorPool;
	private readonly _diffEditorPool: DiffEditorPool;
	private readonly _treePool: TreePool;
	private readonly _contentReferencesListPool: CollapsibleListPool;

	private _currentLayoutWidth: number = 0;
	private _isVisible = true;
	private _onDidChangeVisibility = this._register(new Emitter<boolean>());

	/**
	 * Tool invocations get their own so that the ChatViewModel doesn't overwrite it.
	 * TODO@roblourens shouldn't use the CodeBlockModelCollection at all
	 */
	private readonly _toolInvocationCodeBlockCollection: CodeBlockModelCollection;

	/**
	 * Prevents re-announcement of already rendered chat progress
	 * by screen readers
	 */
	private readonly _announcedToolProgressKeys = new Set<string>();

	constructor(
		editorOptions: ChatEditorOptions,
		private rendererOptions: IChatListItemRendererOptions,
		private readonly delegate: IChatRendererDelegate,
		private readonly codeBlockModelCollection: CodeBlockModelCollection,
		overflowWidgetsDomNode: HTMLElement | undefined,
		private viewModel: IChatViewModel | undefined,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IConfigurationService private readonly configService: IConfigurationService,
		@ILogService private readonly logService: ILogService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IThemeService private readonly themeService: IThemeService,
		@ICommandService private readonly commandService: ICommandService,
		@IHoverService private readonly hoverService: IHoverService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
		@IChatEntitlementService private readonly chatEntitlementService: IChatEntitlementService,
	) {
		super();

		this.chatContentMarkdownRenderer = this.instantiationService.createInstance(ChatContentMarkdownRenderer);
		this.markdownDecorationsRenderer = this.instantiationService.createInstance(ChatMarkdownDecorationsRenderer);
		this._editorPool = this._register(this.instantiationService.createInstance(EditorPool, editorOptions, delegate, overflowWidgetsDomNode, false));
		this._toolEditorPool = this._register(this.instantiationService.createInstance(EditorPool, editorOptions, delegate, overflowWidgetsDomNode, true));
		this._diffEditorPool = this._register(this.instantiationService.createInstance(DiffEditorPool, editorOptions, delegate, overflowWidgetsDomNode, false));
		this._treePool = this._register(this.instantiationService.createInstance(TreePool, this._onDidChangeVisibility.event));
		this._contentReferencesListPool = this._register(this.instantiationService.createInstance(CollapsibleListPool, this._onDidChangeVisibility.event, undefined, undefined));

		this._register(this.instantiationService.createInstance(ChatCodeBlockContentProvider));
		this._toolInvocationCodeBlockCollection = this._register(this.instantiationService.createInstance(CodeBlockModelCollection, 'tools'));
	}

	public updateOptions(options: IChatListItemRendererOptions): void {
		this.rendererOptions = { ...this.rendererOptions, ...options };
	}

	get templateId(): string {
		return ChatListItemRenderer.ID;
	}

	editorsInUse(): Iterable<CodeBlockPart> {
		return Iterable.concat(this._editorPool.inUse(), this._toolEditorPool.inUse());
	}

	private traceLayout(method: string, message: string) {
		if (forceVerboseLayoutTracing) {
			this.logService.info(`ChatListItemRenderer#${method}: ${message}`);
		} else {
			this.logService.trace(`ChatListItemRenderer#${method}: ${message}`);
		}
	}

	/**
	 * Compute a rate to render at in words/s.
	 */
	private getProgressiveRenderRate(element: IChatResponseViewModel): number {
		const enum Rate {
			Min = 5,
			Max = 2000,
		}

		const minAfterComplete = 80;

		const rate = element.contentUpdateTimings?.impliedWordLoadRate;
		if (element.isComplete) {
			if (typeof rate === 'number') {
				return clamp(rate, minAfterComplete, Rate.Max);
			} else {
				return minAfterComplete;
			}
		}

		if (typeof rate === 'number') {
			return clamp(rate, Rate.Min, Rate.Max);
		}

		return 8;
	}

	getCodeBlockInfosForResponse(response: IChatResponseViewModel): IChatCodeBlockInfo[] {
		const codeBlocks = this.codeBlocksByResponseId.get(response.id);
		return codeBlocks ?? [];
	}

	updateViewModel(viewModel: IChatViewModel | undefined): void {
		this.viewModel = viewModel;
		this._announcedToolProgressKeys.clear();

	}

	getCodeBlockInfoForEditor(uri: URI): IChatCodeBlockInfo | undefined {
		return this.codeBlocksByEditorUri.get(uri);
	}

	getFileTreeInfosForResponse(response: IChatResponseViewModel): IChatFileTreeInfo[] {
		const fileTrees = this.fileTreesByResponseId.get(response.id);
		return fileTrees ?? [];
	}

	getLastFocusedFileTreeForResponse(response: IChatResponseViewModel): IChatFileTreeInfo | undefined {
		const fileTrees = this.fileTreesByResponseId.get(response.id);
		const lastFocusedFileTreeIndex = this.focusedFileTreesByResponseId.get(response.id);
		if (fileTrees?.length && lastFocusedFileTreeIndex !== undefined && lastFocusedFileTreeIndex < fileTrees.length) {
			return fileTrees[lastFocusedFileTreeIndex];
		}
		return undefined;
	}

	getTemplateDataForRequestId(requestId?: string): IChatListItemTemplate | undefined {
		if (!requestId) {
			return undefined;
		}
		const templateData = this.templateDataByRequestId.get(requestId);
		if (templateData && templateData.currentElement?.id === requestId) {
			return templateData;
		}
		if (templateData) {
			this.templateDataByRequestId.delete(requestId);
		}
		return undefined;
	}

	setVisible(visible: boolean): void {
		this._isVisible = visible;
		this._onDidChangeVisibility.fire(visible);
	}

	layout(width: number): void {
		const newWidth = width - 40; // padding
		if (newWidth !== this._currentLayoutWidth) {
			this._currentLayoutWidth = newWidth;
			for (const editor of this._editorPool.inUse()) {
				editor.layout(this._currentLayoutWidth);
			}
			for (const toolEditor of this._toolEditorPool.inUse()) {
				toolEditor.layout(this._currentLayoutWidth);
			}
			for (const diffEditor of this._diffEditorPool.inUse()) {
				diffEditor.layout(this._currentLayoutWidth);
			}
		}
	}

	renderTemplate(container: HTMLElement): IChatListItemTemplate {
		const templateDisposables = new DisposableStore();
		const disabledOverlay = dom.append(container, $('.chat-row-disabled-overlay'));
		const rowContainer = dom.append(container, $('.interactive-item-container'));
		if (this.rendererOptions.renderStyle === 'compact') {
			rowContainer.classList.add('interactive-item-compact');
		}

		let headerParent = rowContainer;
		let valueParent = rowContainer;
		let detailContainerParent: HTMLElement | undefined;

		if (this.rendererOptions.renderStyle === 'minimal') {
			rowContainer.classList.add('interactive-item-compact');
			rowContainer.classList.add('minimal');
			// -----------------------------------------------------
			//  icon | details
			//       | references
			//       | value
			// -----------------------------------------------------
			const lhsContainer = dom.append(rowContainer, $('.column.left'));
			const rhsContainer = dom.append(rowContainer, $('.column.right'));

			headerParent = lhsContainer;
			detailContainerParent = rhsContainer;
			valueParent = rhsContainer;
		}

		const header = dom.append(headerParent, $('.header'));
		const contextKeyService = templateDisposables.add(this.contextKeyService.createScoped(rowContainer));
		const scopedInstantiationService = templateDisposables.add(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyService])));

		const requestHover = dom.append(rowContainer, $('.request-hover'));
		let titleToolbar: MenuWorkbenchToolBar | undefined;
		if (this.rendererOptions.noHeader) {
			header.classList.add('hidden');
		} else {
			titleToolbar = templateDisposables.add(scopedInstantiationService.createInstance(MenuWorkbenchToolBar, requestHover, MenuId.ChatMessageTitle, {
				menuOptions: {
					shouldForwardArgs: true
				},
				toolbarOptions: {
					shouldInlineSubmenu: submenu => submenu.actions.length <= 1
				},
			}));
		}
		this.hoverHidden(requestHover);

		const checkpointContainer = dom.append(rowContainer, $('.checkpoint-container'));
		const codiconContainer = dom.append(checkpointContainer, $('.codicon-container'));
		dom.append(codiconContainer, $('span.codicon.codicon-bookmark'));

		const checkpointToolbar = templateDisposables.add(scopedInstantiationService.createInstance(MenuWorkbenchToolBar, checkpointContainer, MenuId.ChatMessageCheckpoint, {
			actionViewItemProvider: (action, options) => {
				if (action instanceof MenuItemAction) {
					return this.instantiationService.createInstance(CodiconActionViewItem, action, { hoverDelegate: options.hoverDelegate });
				}
				return undefined;
			},
			renderDropdownAsChildElement: true,
			menuOptions: {
				shouldForwardArgs: true
			},
			toolbarOptions: {
				shouldInlineSubmenu: submenu => submenu.actions.length <= 1
			},
		}));

		dom.append(checkpointContainer, $('.checkpoint-divider'));

		const user = dom.append(header, $('.user'));
		const avatarContainer = dom.append(user, $('.avatar-container'));
		const username = dom.append(user, $('h3.username'));
		username.tabIndex = 0;
		const detailContainer = dom.append(detailContainerParent ?? user, $('span.detail-container'));
		const detail = dom.append(detailContainer, $('span.detail'));
		dom.append(detailContainer, $('span.chat-animated-ellipsis'));
		const value = dom.append(valueParent, $('.value'));
		const elementDisposables = new DisposableStore();

		const footerToolbarContainer = dom.append(rowContainer, $('.chat-footer-toolbar'));
		if (this.rendererOptions.noFooter) {
			footerToolbarContainer.classList.add('hidden');
		}

		const footerToolbar = templateDisposables.add(scopedInstantiationService.createInstance(MenuWorkbenchToolBar, footerToolbarContainer, MenuId.ChatMessageFooter, {
			eventDebounceDelay: 0,
			menuOptions: { shouldForwardArgs: true, renderShortTitle: true },
			toolbarOptions: { shouldInlineSubmenu: submenu => submenu.actions.length <= 1 },
			actionViewItemProvider: (action: IAction, options: IActionViewItemOptions) => {
				if (action instanceof MenuItemAction && action.item.id === MarkUnhelpfulActionId) {
					return scopedInstantiationService.createInstance(ChatVoteDownButton, action, options as IMenuEntryActionViewItemOptions);
				}
				return createActionViewItem(scopedInstantiationService, action, options);
			}
		}));

		// Insert the details container into the toolbar's internal element structure
		const footerDetailsContainer = dom.append(footerToolbar.getElement(), $('.chat-footer-details'));
		footerDetailsContainer.tabIndex = 0;

		const checkpointRestoreContainer = dom.append(rowContainer, $('.checkpoint-restore-container'));
		const codiconRestoreContainer = dom.append(checkpointRestoreContainer, $('.codicon-container'));
		dom.append(codiconRestoreContainer, $('span.codicon.codicon-bookmark'));
		const label = dom.append(checkpointRestoreContainer, $('span.checkpoint-label-text'));
		label.textContent = localize('checkpointRestore', 'Checkpoint Restored');
		const checkpointRestoreToolbar = templateDisposables.add(scopedInstantiationService.createInstance(MenuWorkbenchToolBar, checkpointRestoreContainer, MenuId.ChatMessageRestoreCheckpoint, {
			actionViewItemProvider: (action, options) => {
				if (action instanceof MenuItemAction) {
					return this.instantiationService.createInstance(CodiconActionViewItem, action, { hoverDelegate: options.hoverDelegate });
				}
				return undefined;
			},
			renderDropdownAsChildElement: true,
			menuOptions: {
				shouldForwardArgs: true
			},
			toolbarOptions: {
				shouldInlineSubmenu: submenu => submenu.actions.length <= 1
			},
		}));

		dom.append(checkpointRestoreContainer, $('.checkpoint-divider'));


		const agentHover = templateDisposables.add(this.instantiationService.createInstance(ChatAgentHover));
		const hoverContent = () => {
			if (isResponseVM(template.currentElement) && template.currentElement.agent && !template.currentElement.agent.isDefault) {
				agentHover.setAgent(template.currentElement.agent.id);
				return agentHover.domNode;
			}

			return undefined;
		};
		const hoverOptions = getChatAgentHoverOptions(() => isResponseVM(template.currentElement) ? template.currentElement.agent : undefined, this.commandService);
		templateDisposables.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('element'), user, hoverContent, hoverOptions));
		templateDisposables.add(dom.addDisposableListener(user, dom.EventType.KEY_DOWN, e => {
			const ev = new StandardKeyboardEvent(e);
			if (ev.equals(KeyCode.Space) || ev.equals(KeyCode.Enter)) {
				const content = hoverContent();
				if (content) {
					this.hoverService.showInstantHover({ content, target: user, trapFocus: true, actions: hoverOptions.actions }, true);
				}
			} else if (ev.equals(KeyCode.Escape)) {
				this.hoverService.hideHover();
			}
		}));
		const template: IChatListItemTemplate = { header, avatarContainer, requestHover, username, detail, value, rowContainer, elementDisposables, templateDisposables, contextKeyService, instantiationService: scopedInstantiationService, agentHover, titleToolbar, footerToolbar, footerDetailsContainer, disabledOverlay, checkpointToolbar, checkpointRestoreToolbar, checkpointContainer, checkpointRestoreContainer };

		templateDisposables.add(dom.addDisposableListener(disabledOverlay, dom.EventType.CLICK, e => {
			if (!this.viewModel?.editing) {
				return;
			}
			const current = template.currentElement;
			if (!current || current.id === this.viewModel.editing.id) {
				return;
			}

			if (disabledOverlay.classList.contains('disabled')) {
				e.preventDefault();
				e.stopPropagation();
				this._onDidFocusOutside.fire();
			}
		}));
		return template;
	}

	renderElement(node: ITreeNode<ChatTreeItem, FuzzyScore>, index: number, templateData: IChatListItemTemplate): void {
		this.renderChatTreeItem(node.element, index, templateData);
	}

	private clearRenderedParts(templateData: IChatListItemTemplate): void {
		if (templateData.renderedParts) {
			dispose(coalesce(templateData.renderedParts));
			templateData.renderedParts = undefined;
			dom.clearNode(templateData.value);
		}
	}

	renderChatTreeItem(element: ChatTreeItem, index: number, templateData: IChatListItemTemplate): void {
		if (templateData.currentElement && templateData.currentElement.id !== element.id) {
			this.traceLayout('renderChatTreeItem', `Rendering a different element into the template, index=${index}`);
			this.clearRenderedParts(templateData);

			const mappedTemplateData = this.templateDataByRequestId.get(templateData.currentElement.id);
			if (mappedTemplateData && (mappedTemplateData.currentElement?.id !== templateData.currentElement.id)) {
				this.templateDataByRequestId.delete(templateData.currentElement.id);
			}
		}

		templateData.currentElement = element;
		this.templateDataByRequestId.set(element.id, templateData);
		const kind = isRequestVM(element) ? 'request' :
			isResponseVM(element) ? 'response' :
				'welcome';
		this.traceLayout('renderElement', `${kind}, index=${index}`);

		ChatContextKeys.isResponse.bindTo(templateData.contextKeyService).set(isResponseVM(element));
		ChatContextKeys.itemId.bindTo(templateData.contextKeyService).set(element.id);
		ChatContextKeys.isRequest.bindTo(templateData.contextKeyService).set(isRequestVM(element));
		ChatContextKeys.responseDetectedAgentCommand.bindTo(templateData.contextKeyService).set(isResponseVM(element) && element.agentOrSlashCommandDetected);
		if (isResponseVM(element)) {
			ChatContextKeys.responseSupportsIssueReporting.bindTo(templateData.contextKeyService).set(!!element.agent?.metadata.supportIssueReporting);
			ChatContextKeys.responseVote.bindTo(templateData.contextKeyService).set(element.vote === ChatAgentVoteDirection.Up ? 'up' : element.vote === ChatAgentVoteDirection.Down ? 'down' : '');
		} else {
			ChatContextKeys.responseVote.bindTo(templateData.contextKeyService).set('');
		}

		if (templateData.titleToolbar) {
			templateData.titleToolbar.context = element;
		}
		templateData.footerToolbar.context = element;

		// Render result details in footer if available
		if (isResponseVM(element) && element.result?.details) {
			templateData.footerDetailsContainer.textContent = element.result.details;
			templateData.footerDetailsContainer.classList.remove('hidden');
		} else {
			templateData.footerDetailsContainer.classList.add('hidden');
		}

		ChatContextKeys.responseHasError.bindTo(templateData.contextKeyService).set(isResponseVM(element) && !!element.errorDetails);
		const isFiltered = !!(isResponseVM(element) && element.errorDetails?.responseIsFiltered);
		ChatContextKeys.responseIsFiltered.bindTo(templateData.contextKeyService).set(isFiltered);

		const location = this.chatWidgetService.getWidgetBySessionResource(element.sessionResource)?.location;
		templateData.rowContainer.classList.toggle('editing-session', location === ChatAgentLocation.Chat);
		templateData.rowContainer.classList.toggle('interactive-request', isRequestVM(element));
		templateData.rowContainer.classList.toggle('interactive-response', isResponseVM(element));
		const progressMessageAtBottomOfResponse = checkModeOption(this.delegate.currentChatMode(), this.rendererOptions.progressMessageAtBottomOfResponse);
		templateData.rowContainer.classList.toggle('show-detail-progress', isResponseVM(element) && !element.isComplete && !element.progressMessages.length && !progressMessageAtBottomOfResponse);
		if (!this.rendererOptions.noHeader) {
			this.renderAvatar(element, templateData);
		}

		templateData.username.textContent = element.username;
		templateData.username.classList.toggle('hidden', element.username === COPILOT_USERNAME);
		templateData.avatarContainer.classList.toggle('hidden', element.username === COPILOT_USERNAME);

		this.hoverHidden(templateData.requestHover);
		dom.clearNode(templateData.detail);
		if (isResponseVM(element)) {
			this.renderDetail(element, templateData);
		}

		templateData.checkpointToolbar.context = element;
		const checkpointEnabled = this.configService.getValue<boolean>(ChatConfiguration.CheckpointsEnabled)
			&& (this.rendererOptions.restorable ?? true);

		templateData.checkpointContainer.classList.toggle('hidden', isResponseVM(element) || !(checkpointEnabled));

		// Only show restore container when we have a checkpoint and not editing
		const shouldShowRestore = this.viewModel?.model.checkpoint && !this.viewModel?.editing && (index === this.delegate.getListLength() - 1);
		templateData.checkpointRestoreContainer.classList.toggle('hidden', !(shouldShowRestore && checkpointEnabled));

		const editing = element.id === this.viewModel?.editing?.id;
		const isInput = this.configService.getValue<string>('chat.editRequests') === 'input';

		templateData.disabledOverlay.classList.toggle('disabled', element.shouldBeBlocked && !editing && this.viewModel?.editing !== undefined);
		templateData.rowContainer.classList.toggle('editing', editing && !isInput);
		templateData.rowContainer.classList.toggle('editing-input', editing && isInput);
		templateData.requestHover.classList.toggle('editing', editing && isInput);
		templateData.requestHover.classList.toggle('hidden', (!!this.viewModel?.editing && !editing) || isResponseVM(element));
		templateData.requestHover.classList.toggle('expanded', this.configService.getValue<string>('chat.editRequests') === 'hover');
		templateData.requestHover.classList.toggle('checkpoints-enabled', checkpointEnabled);
		templateData.elementDisposables.add(dom.addStandardDisposableListener(templateData.rowContainer, dom.EventType.CLICK, (e) => {
			const current = templateData.currentElement;
			if (current && this.viewModel?.editing && current.id !== this.viewModel.editing.id) {
				e.stopPropagation();
				e.preventDefault();
				this._onDidFocusOutside.fire();
			}
		}));

		// Overlay click listener removed: overlay is non-interactive in cancel-on-any-row mode.

		// hack @joaomoreno
		templateData.rowContainer.parentElement?.parentElement?.parentElement?.classList.toggle('request', isRequestVM(element));
		templateData.rowContainer.classList.toggle(mostRecentResponseClassName, index === this.delegate.getListLength() - 1);
		templateData.rowContainer.classList.toggle('confirmation-message', isRequestVM(element) && !!element.confirmation);

		// TODO: @justschen decide if we want to hide the header for requests or not
		const shouldShowHeader = isResponseVM(element) && !this.rendererOptions.noHeader;
		templateData.header?.classList.toggle('header-disabled', !shouldShowHeader);

		if (isRequestVM(element) && element.confirmation) {
			this.renderConfirmationAction(element, templateData);
		}

		// Do a progressive render if
		// - This the last response in the list
		// - And it has some content
		// - And the response is not complete
		//   - Or, we previously started a progressive rendering of this element (if the element is complete, we will finish progressive rendering with a very fast rate)
		if (isResponseVM(element) && index === this.delegate.getListLength() - 1 && (!element.isComplete || element.renderData)) {
			this.traceLayout('renderElement', `start progressive render, index=${index}`);

			const timer = templateData.elementDisposables.add(new dom.WindowIntervalTimer());
			const runProgressiveRender = (initial?: boolean) => {
				try {
					if (this.doNextProgressiveRender(element, index, templateData, !!initial)) {
						timer.cancel();
					}
				} catch (err) {
					// Kill the timer if anything went wrong, avoid getting stuck in a nasty rendering loop.
					timer.cancel();
					this.logService.error(err);
				}
			};
			timer.cancelAndSet(runProgressiveRender, 50, dom.getWindow(templateData.rowContainer));
			runProgressiveRender(true);
		} else {
			if (isResponseVM(element)) {
				this.renderChatResponseBasic(element, index, templateData);
			} else if (isRequestVM(element)) {
				this.renderChatRequest(element, index, templateData);
			}
		}
	}

	private renderDetail(element: IChatResponseViewModel, templateData: IChatListItemTemplate): void {
		dom.clearNode(templateData.detail);

		if (element.agentOrSlashCommandDetected) {
			const msg = element.slashCommand ? localize('usedAgentSlashCommand', "used {0} [[(rerun without)]]", `${chatSubcommandLeader}${element.slashCommand.name}`) : localize('usedAgent', "[[(rerun without)]]");
			dom.reset(templateData.detail, renderFormattedText(msg, {
				actionHandler: {
					disposables: templateData.elementDisposables,
					callback: (content) => {
						this._onDidClickRerunWithAgentOrCommandDetection.fire(element);
					},
				}
			}, $('span.agentOrSlashCommandDetected')));

		} else if (this.rendererOptions.renderStyle !== 'minimal' && !element.isComplete && !checkModeOption(this.delegate.currentChatMode(), this.rendererOptions.progressMessageAtBottomOfResponse)) {
			templateData.detail.textContent = localize('working', "Working");
		}
	}

	private renderConfirmationAction(element: IChatRequestViewModel, templateData: IChatListItemTemplate) {
		dom.clearNode(templateData.detail);
		if (element.confirmation) {
			dom.append(templateData.detail, $('span.codicon.codicon-check', { 'aria-hidden': 'true' }));
			dom.append(templateData.detail, $('span.confirmation-text', undefined, localize('chatConfirmationAction', 'Selected "{0}"', element.confirmation)));
			templateData.header?.classList.remove('header-disabled');
			templateData.header?.classList.add('partially-disabled');
		}
	}

	private renderAvatar(element: ChatTreeItem, templateData: IChatListItemTemplate): void {
		const icon = isResponseVM(element) ?
			this.getAgentIcon(element.agent?.metadata) :
			(element.avatarIcon ?? Codicon.account);
		if (icon instanceof URI) {
			const avatarIcon = dom.$<HTMLImageElement>('img.icon');
			avatarIcon.src = FileAccess.uriToBrowserUri(icon).toString(true);
			templateData.avatarContainer.replaceChildren(dom.$('.avatar', undefined, avatarIcon));
		} else {
			const avatarIcon = dom.$(ThemeIcon.asCSSSelector(icon));
			templateData.avatarContainer.replaceChildren(dom.$('.avatar.codicon-avatar', undefined, avatarIcon));
		}
	}

	private getAgentIcon(agent: IChatAgentMetadata | undefined): URI | ThemeIcon {
		if (agent?.themeIcon) {
			return agent.themeIcon;
		} else if (agent?.iconDark && isDark(this.themeService.getColorTheme().type)) {
			return agent.iconDark;
		} else if (agent?.icon) {
			return agent.icon;
		} else {
			return Codicon.chatSparkle;
		}
	}

	private renderChatResponseBasic(element: IChatResponseViewModel, index: number, templateData: IChatListItemTemplate) {
		templateData.rowContainer.classList.toggle('chat-response-loading', (isResponseVM(element) && !element.isComplete));

		if (element.isCanceled) {
			const lastThinking = this.getLastThinkingPart(templateData.renderedParts);
			if (lastThinking?.domNode) {
				lastThinking.finalizeTitleIfDefault();
				lastThinking.markAsInactive();
			}
		}

		const content: IChatRendererContent[] = [];
		const isFiltered = !!element.errorDetails?.responseIsFiltered;
		if (!isFiltered) {
			// Always add the references to avoid shifting the content parts when a reference is added, and having to re-diff all the content.
			// The part will hide itself if the list is empty.
			content.push({ kind: 'references', references: element.contentReferences });
			content.push(...annotateSpecialMarkdownContent(element.response.value));
			if (element.codeCitations.length) {
				content.push({ kind: 'codeCitations', citations: element.codeCitations });
			}
		}

		if (element.model.response === element.model.entireResponse && element.errorDetails?.message && element.errorDetails.message !== canceledName) {
			content.push({ kind: 'errorDetails', errorDetails: element.errorDetails, isLast: index === this.delegate.getListLength() - 1 });
		}

		const fileChangesSummaryPart = this.getChatFileChangesSummaryPart(element);
		if (fileChangesSummaryPart) {
			content.push(fileChangesSummaryPart);
		}

		const diff = this.diff(templateData.renderedParts ?? [], content, element);
		this.renderChatContentDiff(diff, content, element, index, templateData);

		this.updateItemHeightOnRender(element, templateData);
	}

	private shouldShowWorkingProgress(element: IChatResponseViewModel, partsToRender: IChatRendererContent[], templateData: IChatListItemTemplate): boolean {
		if (element.agentOrSlashCommandDetected || this.rendererOptions.renderStyle === 'minimal' || element.isComplete || !checkModeOption(this.delegate.currentChatMode(), this.rendererOptions.progressMessageAtBottomOfResponse)) {
			return false;
		}

		// Show if no content, only "used references", ends with a complete tool call, or ends with complete text edits and there is no incomplete tool call (edits are still being applied some time after they are all generated)
		const lastPart = findLast(partsToRender, part => part.kind !== 'markdownContent' || part.content.value.trim().length > 0);

		const collapsedToolsMode = this.configService.getValue<CollapsedToolsDisplayMode>('chat.agent.thinking.collapsedTools');

		const lastThinking = this.getLastThinkingPart(templateData.renderedParts);

		if (lastThinking &&
			(collapsedToolsMode === CollapsedToolsDisplayMode.Always ||
				collapsedToolsMode === CollapsedToolsDisplayMode.WithThinking)) {
			if (!lastPart || lastPart.kind === 'thinking' || lastPart.kind === 'toolInvocation' || lastPart.kind === 'prepareToolInvocation' || lastPart.kind === 'textEditGroup' || lastPart.kind === 'notebookEditGroup') {
				return false;
			}
		}

		if (
			!lastPart ||
			lastPart.kind === 'references' ||
			((lastPart.kind === 'toolInvocation' || lastPart.kind === 'toolInvocationSerialized') && (IChatToolInvocation.isComplete(lastPart) || lastPart.presentation === 'hidden')) ||
			((lastPart.kind === 'textEditGroup' || lastPart.kind === 'notebookEditGroup') && lastPart.done && !partsToRender.some(part => part.kind === 'toolInvocation' && !IChatToolInvocation.isComplete(part))) ||
			(lastPart.kind === 'progressTask' && lastPart.deferred.isSettled) ||
			lastPart.kind === 'prepareToolInvocation' || lastPart.kind === 'mcpServersStarting'
		) {
			return true;
		}

		return false;
	}


	private getChatFileChangesSummaryPart(element: IChatResponseViewModel): IChatChangesSummaryPart | undefined {
		if (!this.shouldShowFileChangesSummary(element)) {
			return undefined;
		}
		if (!element.model.entireResponse.value.some(part => part.kind === 'textEditGroup' || part.kind === 'notebookEditGroup')) {
			return undefined;
		}

		return { kind: 'changesSummary', requestId: element.requestId, sessionResource: element.sessionResource };
	}

	private renderChatRequest(element: IChatRequestViewModel, index: number, templateData: IChatListItemTemplate) {
		templateData.rowContainer.classList.toggle('chat-response-loading', false);
		if (element.id === this.viewModel?.editing?.id) {
			this._onDidRerender.fire(templateData);
		}

		if (this.configService.getValue<string>('chat.editRequests') !== 'none' && this.rendererOptions.editable) {
			templateData.elementDisposables.add(dom.addDisposableListener(templateData.rowContainer, dom.EventType.KEY_DOWN, e => {
				const ev = new StandardKeyboardEvent(e);
				if (ev.equals(KeyCode.Space) || ev.equals(KeyCode.Enter)) {
					if (this.viewModel?.editing?.id !== element.id) {
						ev.preventDefault();
						ev.stopPropagation();
						this._onDidClickRequest.fire(templateData);
					}
				}
			}));
		}

		let content: IChatRendererContent[] = [];
		if (!element.confirmation) {
			const markdown = isChatFollowup(element.message) ?
				element.message.message :
				this.markdownDecorationsRenderer.convertParsedRequestToMarkdown(element.sessionResource, element.message);
			content = [{ content: new MarkdownString(markdown), kind: 'markdownContent' }];

			if (this.rendererOptions.renderStyle === 'minimal' && !element.isComplete) {
				templateData.value.classList.add('inline-progress');
				templateData.elementDisposables.add(toDisposable(() => templateData.value.classList.remove('inline-progress')));
				content.push({ content: new MarkdownString('<span></span>', { supportHtml: true }), kind: 'markdownContent' });
			} else {
				templateData.value.classList.remove('inline-progress');
			}
		}

		dom.clearNode(templateData.value);
		const parts: IChatContentPart[] = [];

		let inlineSlashCommandRendered = false;
		content.forEach((data, contentIndex) => {
			const context: IChatContentPartRenderContext = {
				element,
				elementIndex: index,
				contentIndex: contentIndex,
				content: content,
				preceedingContentParts: parts,
				container: templateData.rowContainer,
				editorPool: this._editorPool,
				diffEditorPool: this._diffEditorPool,
				codeBlockModelCollection: this.codeBlockModelCollection,
				currentWidth: () => this._currentLayoutWidth,
				get codeBlockStartIndex() {
					return context.preceedingContentParts.reduce((acc, part) => acc + (part.codeblocks?.length ?? 0), 0);
				},
			};
			const newPart = this.renderChatContentPart(data, templateData, context);
			if (newPart) {

				if (this.rendererOptions.renderDetectedCommandsWithRequest
					&& !inlineSlashCommandRendered
					&& element.agentOrSlashCommandDetected && element.slashCommand
					&& data.kind === 'markdownContent' // TODO this is fishy but I didn't find a better way to render on the same inline as the MD request part
				) {
					if (newPart.domNode) {
						newPart.domNode.style.display = 'inline-flex';
					}
					const cmdPart = this.instantiationService.createInstance(ChatAgentCommandContentPart, element.slashCommand, () => this._onDidClickRerunWithAgentOrCommandDetection.fire({ sessionResource: element.sessionResource, requestId: element.id }));
					templateData.value.appendChild(cmdPart.domNode);
					parts.push(cmdPart);
					inlineSlashCommandRendered = true;
				}

				if (newPart.domNode) {
					templateData.value.appendChild(newPart.domNode);
				}
				parts.push(newPart);
			}
		});

		if (templateData.renderedParts) {
			dispose(templateData.renderedParts);
		}
		templateData.renderedParts = parts;

		if (element.variables.length) {
			const newPart = this.renderAttachments(element.variables, element.contentReferences, templateData);
			if (newPart.domNode) {
				// p has a :last-child rule for margin
				templateData.value.appendChild(newPart.domNode);
			}
			templateData.elementDisposables.add(newPart);
		}

		this.updateItemHeightOnRender(element, templateData);
	}

	updateItemHeightOnRender(element: ChatTreeItem, templateData: IChatListItemTemplate) {
		const newHeight = templateData.rowContainer.offsetHeight;
		const fireEvent = !element.currentRenderedHeight || element.currentRenderedHeight !== newHeight;
		element.currentRenderedHeight = newHeight;
		if (fireEvent) {
			const disposable = templateData.elementDisposables.add(dom.scheduleAtNextAnimationFrame(dom.getWindow(templateData.value), () => {
				// Have to recompute the height here because codeblock rendering is currently async and it may have changed.
				// If it becomes properly sync, then this could be removed.
				element.currentRenderedHeight = templateData.rowContainer.offsetHeight;
				disposable.dispose();
				this._onDidChangeItemHeight.fire({ element, height: element.currentRenderedHeight });
			}));
		}
	}

	private updateItemHeight(templateData: IChatListItemTemplate): void {
		if (!templateData.currentElement) {
			return;
		}

		const newHeight = Math.max(templateData.rowContainer.offsetHeight, 1);
		templateData.currentElement.currentRenderedHeight = newHeight;
		this._onDidChangeItemHeight.fire({ element: templateData.currentElement, height: newHeight });
	}

	/**
	 *	@returns true if progressive rendering should be considered complete- the element's data is fully rendered or the view is not visible
	 */
	private doNextProgressiveRender(element: IChatResponseViewModel, index: number, templateData: IChatListItemTemplate, isInRenderElement: boolean): boolean {
		if (!this._isVisible) {
			return true;
		}

		if (element.isCanceled) {
			this.traceLayout('doNextProgressiveRender', `canceled, index=${index}`);
			element.renderData = undefined;
			this.renderChatResponseBasic(element, index, templateData);
			return true;
		}

		templateData.rowContainer.classList.toggle('chat-response-loading', true);
		this.traceLayout('doNextProgressiveRender', `START progressive render, index=${index}, renderData=${JSON.stringify(element.renderData)}`);
		const contentForThisTurn = this.getNextProgressiveRenderContent(element, templateData);
		const partsToRender = this.diff(templateData.renderedParts ?? [], contentForThisTurn.content, element);

		const contentIsAlreadyRendered = partsToRender.every(part => part === null);
		if (contentIsAlreadyRendered) {
			if (contentForThisTurn.moreContentAvailable) {
				// The content that we want to render in this turn is already rendered, but there is more content to render on the next tick
				this.traceLayout('doNextProgressiveRender', 'not rendering any new content this tick, but more available');
				return false;
			} else if (element.isComplete) {
				// All content is rendered, and response is done, so do a normal render
				this.traceLayout('doNextProgressiveRender', `END progressive render, index=${index} and clearing renderData, response is complete`);
				element.renderData = undefined;
				this.renderChatResponseBasic(element, index, templateData);
				return true;
			} else {
				// Nothing new to render, stop rendering until next model update
				this.traceLayout('doNextProgressiveRender', 'caught up with the stream- no new content to render');

				if (!templateData.renderedParts) {
					// First render? Initialize currentRenderedHeight. https://github.com/microsoft/vscode/issues/232096
					const height = templateData.rowContainer.offsetHeight;
					element.currentRenderedHeight = height;
				}

				return true;
			}
		}

		// Do an actual progressive render
		this.traceLayout('doNextProgressiveRender', `doing progressive render, ${partsToRender.length} parts to render`);
		this.renderChatContentDiff(partsToRender, contentForThisTurn.content, element, index, templateData);

		const height = templateData.rowContainer.offsetHeight;
		element.currentRenderedHeight = height;
		if (!isInRenderElement) {
			this._onDidChangeItemHeight.fire({ element, height });
		}

		return false;
	}

	private renderChatContentDiff(partsToRender: ReadonlyArray<IChatRendererContent | null>, contentForThisTurn: ReadonlyArray<IChatRendererContent>, element: IChatResponseViewModel, elementIndex: number, templateData: IChatListItemTemplate): void {
		const renderedParts = templateData.renderedParts ?? [];
		templateData.renderedParts = renderedParts;
		partsToRender.forEach((partToRender, contentIndex) => {
			if (!partToRender) {
				// null=no change
				return;
			}

			const alreadyRenderedPart = templateData.renderedParts?.[contentIndex];

			// keep existing thinking part instance during streaming and update it in place
			if (alreadyRenderedPart) {
				if (partToRender.kind === 'thinking' && alreadyRenderedPart instanceof ChatThinkingContentPart) {
					if (!Array.isArray(partToRender.value)) {
						alreadyRenderedPart.updateThinking(partToRender);
					}
					renderedParts[contentIndex] = alreadyRenderedPart;
					return;
				} else if (alreadyRenderedPart instanceof ChatThinkingContentPart && this.shouldPinPart(partToRender, element)) {
					// keep existing thinking part if we are pinning it (combining tool calls into it)
					renderedParts[contentIndex] = alreadyRenderedPart;
					return;
				}

				alreadyRenderedPart.dispose();
			}

			const preceedingContentParts = renderedParts.slice(0, contentIndex);
			const context: IChatContentPartRenderContext = {
				element,
				elementIndex: elementIndex,
				content: contentForThisTurn,
				preceedingContentParts,
				contentIndex: contentIndex,
				container: templateData.rowContainer,
				editorPool: this._editorPool,
				diffEditorPool: this._diffEditorPool,
				codeBlockModelCollection: this.codeBlockModelCollection,
				currentWidth: () => this._currentLayoutWidth,
				get codeBlockStartIndex() {
					return context.preceedingContentParts.reduce((acc, part) => acc + (part.codeblocks?.length ?? 0), 0);
				},
			};

			// combine tool invocations into thinking part if needed. render the tool, but do not replace the working spinner with the new part's dom node since it is already inside the thinking part.
			const lastThinking = this.getLastThinkingPart(renderedParts);
			if (lastThinking && (partToRender.kind === 'toolInvocation' || partToRender.kind === 'toolInvocationSerialized') && this.shouldPinPart(partToRender, element)) {
				const newPart = this.renderChatContentPart(partToRender, templateData, context);
				if (newPart) {
					renderedParts[contentIndex] = newPart;
					if (alreadyRenderedPart instanceof ChatWorkingProgressContentPart && alreadyRenderedPart?.domNode) {
						alreadyRenderedPart.domNode.remove();
					}
				}
				return;
			}

			const newPart = this.renderChatContentPart(partToRender, templateData, context);
			if (newPart) {
				renderedParts[contentIndex] = newPart;
				// Maybe the part can't be rendered in this context, but this shouldn't really happen
				try {
					if (alreadyRenderedPart?.domNode) {
						if (newPart.domNode) {
							alreadyRenderedPart.domNode.replaceWith(newPart.domNode);
						} else {
							alreadyRenderedPart.domNode.remove();
						}
					} else if (newPart.domNode && !newPart.domNode.parentElement) {
						// Only append if not already attached somewhere else (e.g. inside a thinking wrapper)
						templateData.value.appendChild(newPart.domNode);
					}

				} catch (err) {
					this.logService.error('ChatListItemRenderer#renderChatContentDiff: error replacing part', err);
				}
			} else {
				alreadyRenderedPart?.domNode?.remove();
			}
		});

		// Delete previously rendered parts that are removed
		for (let i = partsToRender.length; i < renderedParts.length; i++) {
			const part = renderedParts[i];
			if (part) {
				part.dispose();
				part.domNode?.remove();
				delete renderedParts[i];
			}
		}
	}

	/**
	 * Returns all content parts that should be rendered, and trimmed markdown content. We will diff this with the current rendered set.
	 */
	private getNextProgressiveRenderContent(element: IChatResponseViewModel, templateData: IChatListItemTemplate): { content: IChatRendererContent[]; moreContentAvailable: boolean } {
		const data = this.getDataForProgressiveRender(element);

		// An unregistered setting for development- skip the word counting and smoothing, just render content as it comes in
		const renderImmediately = this.configService.getValue<boolean>('chat.experimental.renderMarkdownImmediately') === true;

		const renderableResponse = annotateSpecialMarkdownContent(element.response.value);

		this.traceLayout('getNextProgressiveRenderContent', `Want to render ${data.numWordsToRender} at ${data.rate} words/s, counting...`);
		let numNeededWords = data.numWordsToRender;
		const partsToRender: IChatRendererContent[] = [];

		// Always add the references to avoid shifting the content parts when a reference is added, and having to re-diff all the content.
		// The part will hide itself if the list is empty.
		partsToRender.push({ kind: 'references', references: element.contentReferences });

		let moreContentAvailable = false;
		for (let i = 0; i < renderableResponse.length; i++) {
			const part = renderableResponse[i];
			if (part.kind === 'markdownContent' && !renderImmediately) {
				const wordCountResult = getNWords(part.content.value, numNeededWords);
				this.traceLayout('getNextProgressiveRenderContent', `  Chunk ${i}: Want to render ${numNeededWords} words and found ${wordCountResult.returnedWordCount} words. Total words in chunk: ${wordCountResult.totalWordCount}`);
				numNeededWords -= wordCountResult.returnedWordCount;

				if (wordCountResult.isFullString) {
					partsToRender.push(part);

					// Consumed full markdown chunk- need to ensure that all following non-markdown parts are rendered
					for (const nextPart of renderableResponse.slice(i + 1)) {
						if (nextPart.kind !== 'markdownContent') {
							i++;
							partsToRender.push(nextPart);
						} else {
							break;
						}
					}
				} else {
					// Only taking part of this markdown part
					moreContentAvailable = true;
					partsToRender.push({ ...part, content: new MarkdownString(wordCountResult.value, part.content) });
				}

				if (numNeededWords <= 0) {
					// Collected all words and following non-markdown parts if needed, done
					if (renderableResponse.slice(i + 1).some(part => part.kind === 'markdownContent')) {
						moreContentAvailable = true;
					}
					break;
				}
			} else {
				partsToRender.push(part);
			}
		}

		const lastWordCount = element.contentUpdateTimings?.lastWordCount ?? 0;
		const newRenderedWordCount = data.numWordsToRender - numNeededWords;
		const bufferWords = lastWordCount - newRenderedWordCount;
		this.traceLayout('getNextProgressiveRenderContent', `Want to render ${data.numWordsToRender} words. Rendering ${newRenderedWordCount} words. Buffer: ${bufferWords} words`);
		if (newRenderedWordCount > 0 && newRenderedWordCount !== element.renderData?.renderedWordCount) {
			// Only update lastRenderTime when we actually render new content
			element.renderData = { lastRenderTime: Date.now(), renderedWordCount: newRenderedWordCount, renderedParts: partsToRender };
		}

		if (this.shouldShowWorkingProgress(element, partsToRender, templateData)) {
			partsToRender.push({ kind: 'working' });
		}

		const fileChangesSummaryPart = this.getChatFileChangesSummaryPart(element);
		if (fileChangesSummaryPart) {
			partsToRender.push(fileChangesSummaryPart);
		}

		return { content: partsToRender, moreContentAvailable };
	}

	private shouldShowFileChangesSummary(element: IChatResponseViewModel): boolean {
		// Only show file changes summary for local sessions - background sessions already have their own file changes part
		const isLocalSession = getChatSessionType(element.sessionResource) === localChatSessionType;
		return element.isComplete && isLocalSession && this.configService.getValue<boolean>('chat.checkpoints.showFileChanges');
	}

	private getDataForProgressiveRender(element: IChatResponseViewModel) {
		const hasMarkdownParts = element.response.value.some(part => part.kind === 'markdownContent' && part.content.value.trim().length > 0);
		if (!element.isComplete && hasMarkdownParts && (element.contentUpdateTimings ? element.contentUpdateTimings.lastWordCount : 0) === 0) {
			/**
			 * None of the content parts in the ongoing response have been rendered yet,
			 * so we should render all existing parts without animation.
			 */
			return {
				numWordsToRender: Number.MAX_SAFE_INTEGER,
				rate: Number.MAX_SAFE_INTEGER
			};
		}

		const renderData = element.renderData ?? { lastRenderTime: 0, renderedWordCount: 0 };

		const rate = this.getProgressiveRenderRate(element);
		const numWordsToRender = renderData.lastRenderTime === 0 ?
			1 :
			renderData.renderedWordCount +
			// Additional words to render beyond what's already rendered
			Math.floor((Date.now() - renderData.lastRenderTime) / 1000 * rate);

		return {
			numWordsToRender,
			rate
		};
	}

	private diff(renderedParts: ReadonlyArray<IChatContentPart>, contentToRender: ReadonlyArray<IChatRendererContent>, element: ChatTreeItem): ReadonlyArray<IChatRendererContent | null> {
		const diff: (IChatRendererContent | null)[] = [];
		for (let i = 0; i < contentToRender.length; i++) {
			const content = contentToRender[i];
			const renderedPart = renderedParts[i];

			if (!renderedPart || !renderedPart.hasSameContent(content, contentToRender.slice(i + 1), element)) {
				diff.push(content);
			} else {
				// null -> no change
				diff.push(null);
			}
		}

		return diff;
	}

	// put thinking parts inside a pinned part. commented out for now.
	private shouldPinPart(part: IChatRendererContent, element?: IChatResponseViewModel): boolean {
		const collapsedToolsMode = this.configService.getValue<CollapsedToolsDisplayMode>('chat.agent.thinking.collapsedTools');

		if (collapsedToolsMode === CollapsedToolsDisplayMode.Off) {
			return false;
		}

		// Don't pin MCP tools
		const isMcpTool = (part.kind === 'toolInvocation' || part.kind === 'toolInvocationSerialized') && part.source.type === 'mcp';
		if (isMcpTool) {
			return false;
		}

		// Don't pin subagent tools and prepareToolInvocations
		const isSubagentTool = (part.kind === 'toolInvocation' || part.kind === 'toolInvocationSerialized') && (part.fromSubAgent || part.toolId === 'runSubagent');
		if (isSubagentTool) {
			return false;
		}

		// Don't pin terminal tools
		const isTerminalTool = (part.kind === 'toolInvocation' || part.kind === 'toolInvocationSerialized') && part.toolSpecificData?.kind === 'terminal';
		const isContributedTerminalToolInvocation = element
			&& (element.sessionResource.scheme !== Schemas.vscodeChatInput && element.sessionResource.scheme !== Schemas.vscodeLocalChatSession) // contributed sessions
			&& part.kind === 'toolInvocationSerialized' && part.toolSpecificData?.kind === 'terminal'; // contributed serialized terminal tool invocations data
		if (isTerminalTool && !isContributedTerminalToolInvocation) {
			return false;
		}

		if (part.kind === 'toolInvocation') {
			return !part.confirmationMessages;
		}

		if (part.kind === 'toolInvocationSerialized') {
			return true;
		}

		return part.kind === 'prepareToolInvocation';
	}

	private isCreateToolInvocationContent(content: IChatRendererContent | undefined): content is IChatToolInvocation | IChatToolInvocationSerialized {
		if (!content || (content.kind !== 'toolInvocation' && content.kind !== 'toolInvocationSerialized')) {
			return false;
		}

		const containsCreate = (value: string | IMarkdownString | undefined) => {
			if (!value) {
				return false;
			}
			const text = typeof value === 'string' ? value : value.value;
			return text.toLowerCase().includes('create');
		};

		if (containsCreate(content.invocationMessage) || containsCreate(content.pastTenseMessage)) {
			return true;
		}

		return content.toolId.toLowerCase().includes('create');
	}

	private getLastThinkingPart(renderedParts: ReadonlyArray<IChatContentPart> | undefined): ChatThinkingContentPart | undefined {
		if (!renderedParts || renderedParts.length === 0) {
			return undefined;
		}

		// Search backwards for the most recent active thinking part
		for (let i = renderedParts.length - 1; i >= 0; i--) {
			const part = renderedParts[i];
			if (part instanceof ChatThinkingContentPart && part.getIsActive()) {
				return part;
			}
		}

		return undefined;
	}

	private finalizeCurrentThinkingPart(context: IChatContentPartRenderContext, templateData: IChatListItemTemplate): void {
		const lastThinking = this.getLastThinkingPart(templateData.renderedParts);
		if (!lastThinking) {
			return;
		}
		const style = this.configService.getValue<ThinkingDisplayMode>('chat.agent.thinkingStyle');
		if (style === ThinkingDisplayMode.CollapsedPreview) {
			lastThinking.collapseContent();
		}
		lastThinking.finalizeTitleIfDefault();
		lastThinking.resetId();
		lastThinking.markAsInactive();
	}

	private renderChatContentPart(content: IChatRendererContent, templateData: IChatListItemTemplate, context: IChatContentPartRenderContext): IChatContentPart | undefined {
		try {
			const collapsedToolsMode = this.configService.getValue<CollapsedToolsDisplayMode>('chat.agent.thinking.collapsedTools');
			// if we get an empty thinking part, mark thinking as finished
			if (content.kind === 'thinking' && (Array.isArray(content.value) ? content.value.length === 0 : !content.value)) {
				const lastThinking = this.getLastThinkingPart(templateData.renderedParts);
				lastThinking?.resetId();
				return this.renderNoContent(other => content.kind === other.kind);
			}

			const lastRenderedPart = context.preceedingContentParts.length ? context.preceedingContentParts[context.preceedingContentParts.length - 1] : undefined;
			const previousContent = context.contentIndex > 0 ? context.content[context.contentIndex - 1] : undefined;

			// Special handling for "create" tool invocations- do not end thinking if previous part is a create tool invocation and config is set.
			const shouldKeepThinkingForCreateTool = collapsedToolsMode !== CollapsedToolsDisplayMode.Off && lastRenderedPart instanceof ChatToolInvocationPart && this.isCreateToolInvocationContent(previousContent);

			const lastThinking = this.getLastThinkingPart(templateData.renderedParts);
			const isResponseElement = isResponseVM(context.element);
			const isThinkingContent = content.kind === 'working' || content.kind === 'thinking';
			const isToolStreamingContent = isResponseElement && this.shouldPinPart(content, isResponseElement ? context.element : undefined);
			if (!shouldKeepThinkingForCreateTool && lastThinking && lastThinking.getIsActive()) {
				if (!isThinkingContent && !isToolStreamingContent) {
					const followsThinkingPart = previousContent?.kind === 'thinking' || previousContent?.kind === 'toolInvocation' || previousContent?.kind === 'prepareToolInvocation' || previousContent?.kind === 'toolInvocationSerialized';

					if (content.kind !== 'textEditGroup' && (context.element.isComplete || followsThinkingPart)) {
						this.finalizeCurrentThinkingPart(context, templateData);
					}
				}
			}

			// sometimes content is rendered out of order on re-renders so instead of looking at the current chat content part's
			// context and templateData, we have to look globally to find the active thinking part.
			if (context.element.isComplete && !isThinkingContent && !this.shouldPinPart(content, isResponseElement ? context.element : undefined)) {
				for (const templateData of this.templateDataByRequestId.values()) {
					if (templateData.renderedParts) {
						const lastThinking = this.getLastThinkingPart(templateData.renderedParts);
						if (content.kind !== 'textEditGroup' && lastThinking?.getIsActive()) {
							this.finalizeCurrentThinkingPart(context, templateData);
						}
					}
				}
			}

			if (content.kind === 'treeData') {
				return this.renderTreeData(content, templateData, context);
			} else if (content.kind === 'multiDiffData') {
				return this.renderMultiDiffData(content, templateData, context);
			} else if (content.kind === 'progressMessage') {
				return this.instantiationService.createInstance(ChatProgressContentPart, content, this.chatContentMarkdownRenderer, context, undefined, undefined, undefined, undefined);
			} else if (content.kind === 'working') {
				return this.instantiationService.createInstance(ChatWorkingProgressContentPart, content, this.chatContentMarkdownRenderer, context);
			} else if (content.kind === 'progressTask' || content.kind === 'progressTaskSerialized') {
				return this.renderProgressTask(content, templateData, context);
			} else if (content.kind === 'command') {
				return this.instantiationService.createInstance(ChatCommandButtonContentPart, content, context);
			} else if (content.kind === 'textEditGroup') {
				return this.renderTextEdit(context, content, templateData);
			} else if (content.kind === 'confirmation') {
				return this.renderConfirmation(context, content, templateData);
			} else if (content.kind === 'warning') {
				return this.instantiationService.createInstance(ChatErrorContentPart, ChatErrorLevel.Warning, content.content, content, this.chatContentMarkdownRenderer);
			} else if (content.kind === 'markdownContent') {
				return this.renderMarkdown(content, templateData, context);
			} else if (content.kind === 'references') {
				return this.renderContentReferencesListData(content, undefined, context, templateData);
			} else if (content.kind === 'codeCitations') {
				return this.renderCodeCitations(content, context, templateData);
			} else if (content.kind === 'toolInvocation' || content.kind === 'toolInvocationSerialized') {
				return this.renderToolInvocation(content, context, templateData);
			} else if (content.kind === 'extensions') {
				return this.renderExtensionsContent(content, context, templateData);
			} else if (content.kind === 'pullRequest') {
				return this.renderPullRequestContent(content, context, templateData);
			} else if (content.kind === 'undoStop') {
				return this.renderUndoStop(content);
			} else if (content.kind === 'errorDetails') {
				return this.renderChatErrorDetails(context, content, templateData);
			} else if (content.kind === 'elicitation2' || content.kind === 'elicitationSerialized') {
				return this.renderElicitation(context, content, templateData);
			} else if (content.kind === 'changesSummary') {
				return this.renderChangesSummary(content, context, templateData);
			} else if (content.kind === 'mcpServersStarting') {
				return this.renderMcpServersInteractionRequired(content, context, templateData);
			} else if (content.kind === 'thinking') {
				return this.renderThinkingPart(content, context, templateData);
			}

			return this.renderNoContent(other => content.kind === other.kind);
		} catch (err) {
			alert(`Chat error: ${toErrorMessage(err, false)}`);
			this.logService.error('ChatListItemRenderer#renderChatContentPart: error rendering content', toErrorMessage(err, true));
			const errorPart = this.instantiationService.createInstance(ChatErrorContentPart, ChatErrorLevel.Error, new MarkdownString(localize('renderFailMsg', "Failed to render content") + `: ${toErrorMessage(err, false)}`), content, this.chatContentMarkdownRenderer);
			return {
				dispose: () => errorPart.dispose(),
				domNode: errorPart.domNode,
				hasSameContent: (other => content.kind === other.kind),
			};
		}
	}

	override dispose(): void {
		this._announcedToolProgressKeys.clear();
		super.dispose();
	}


	private renderChatErrorDetails(context: IChatContentPartRenderContext, content: IChatErrorDetailsPart, templateData: IChatListItemTemplate): IChatContentPart {
		if (!isResponseVM(context.element)) {
			return this.renderNoContent(other => content.kind === other.kind);
		}

		const isLast = context.elementIndex === this.delegate.getListLength() - 1;
		if (content.errorDetails.isQuotaExceeded) {
			const renderedError = this.instantiationService.createInstance(ChatQuotaExceededPart, context.element, content, this.chatContentMarkdownRenderer);
			renderedError.addDisposable(renderedError.onDidChangeHeight(() => this.updateItemHeight(templateData)));
			return renderedError;
		} else if (content.errorDetails.isRateLimited && this.chatEntitlementService.anonymous) {
			const renderedError = this.instantiationService.createInstance(ChatAnonymousRateLimitedPart, content);
			return renderedError;
		} else if (content.errorDetails.confirmationButtons && isLast) {
			const level = content.errorDetails.level ?? ChatErrorLevel.Error;
			const errorConfirmation = this.instantiationService.createInstance(ChatErrorConfirmationContentPart, level, new MarkdownString(content.errorDetails.message), content, content.errorDetails.confirmationButtons, this.chatContentMarkdownRenderer, context);
			errorConfirmation.addDisposable(errorConfirmation.onDidChangeHeight(() => this.updateItemHeight(templateData)));
			return errorConfirmation;
		} else {
			const level = content.errorDetails.level ?? ChatErrorLevel.Error;
			return this.instantiationService.createInstance(ChatErrorContentPart, level, new MarkdownString(content.errorDetails.message), content, this.chatContentMarkdownRenderer);
		}
	}

	private renderUndoStop(content: IChatUndoStop) {
		return this.renderNoContent(other => other.kind === content.kind && other.id === content.id);
	}

	private renderNoContent(equals: (otherContent: IChatRendererContent) => boolean): IChatContentPart {
		return {
			dispose: () => { },
			domNode: undefined,
			hasSameContent: equals,
		};
	}

	private renderTreeData(content: IChatTreeData, templateData: IChatListItemTemplate, context: IChatContentPartRenderContext): IChatContentPart {
		const data = content.treeData;
		const treeDataIndex = context.preceedingContentParts.filter(part => part instanceof ChatTreeContentPart).length;
		const treePart = this.instantiationService.createInstance(ChatTreeContentPart, data, context.element, this._treePool, treeDataIndex);

		treePart.addDisposable(treePart.onDidChangeHeight(() => {
			this.updateItemHeight(templateData);
		}));

		if (isResponseVM(context.element)) {
			const fileTreeFocusInfo = {
				treeDataId: data.uri.toString(),
				treeIndex: treeDataIndex,
				focus() {
					treePart.domFocus();
				}
			};

			// TODO@roblourens there's got to be a better way to navigate trees
			treePart.addDisposable(treePart.onDidFocus(() => {
				this.focusedFileTreesByResponseId.set(context.element.id, fileTreeFocusInfo.treeIndex);
			}));

			const fileTrees = this.fileTreesByResponseId.get(context.element.id) ?? [];
			fileTrees.push(fileTreeFocusInfo);
			this.fileTreesByResponseId.set(context.element.id, distinct(fileTrees, (v) => v.treeDataId));
			treePart.addDisposable(toDisposable(() => this.fileTreesByResponseId.set(context.element.id, fileTrees.filter(v => v.treeDataId !== data.uri.toString()))));
		}

		return treePart;
	}

	private renderMultiDiffData(content: IChatMultiDiffData, templateData: IChatListItemTemplate, context: IChatContentPartRenderContext): IChatContentPart {
		const multiDiffPart = this.instantiationService.createInstance(ChatMultiDiffContentPart, content, context.element);
		multiDiffPart.addDisposable(multiDiffPart.onDidChangeHeight(() => {
			this.updateItemHeight(templateData);
		}));
		return multiDiffPart;
	}

	private renderContentReferencesListData(references: IChatReferences, labelOverride: string | undefined, context: IChatContentPartRenderContext, templateData: IChatListItemTemplate): ChatCollapsibleListContentPart {
		const referencesPart = this.instantiationService.createInstance(ChatUsedReferencesListContentPart, references.references, labelOverride, context, this._contentReferencesListPool, { expandedWhenEmptyResponse: checkModeOption(this.delegate.currentChatMode(), this.rendererOptions.referencesExpandedWhenEmptyResponse) });
		referencesPart.addDisposable(referencesPart.onDidChangeHeight(() => {
			this.updateItemHeight(templateData);
		}));

		return referencesPart;
	}

	private renderCodeCitations(citations: IChatCodeCitations, context: IChatContentPartRenderContext, templateData: IChatListItemTemplate): ChatCodeCitationContentPart {
		const citationsPart = this.instantiationService.createInstance(ChatCodeCitationContentPart, citations, context);
		return citationsPart;
	}

	private handleRenderedCodeblocks(element: ChatTreeItem, part: IChatContentPart, codeBlockStartIndex: number): void {
		if (!part.addDisposable || part.codeblocksPartId === undefined) {
			return;
		}

		const codeBlocksByResponseId = this.codeBlocksByResponseId.get(element.id) ?? [];
		this.codeBlocksByResponseId.set(element.id, codeBlocksByResponseId);
		part.addDisposable(toDisposable(() => {
			const codeBlocksByResponseId = this.codeBlocksByResponseId.get(element.id);
			if (codeBlocksByResponseId) {
				// Only delete if this is my code block
				part.codeblocks?.forEach((info, i) => {
					const codeblock = codeBlocksByResponseId[codeBlockStartIndex + i];
					if (codeblock?.ownerMarkdownPartId === part.codeblocksPartId) {
						delete codeBlocksByResponseId[codeBlockStartIndex + i];
					}
				});
			}
		}));

		part.codeblocks?.forEach((info, i) => {
			codeBlocksByResponseId[codeBlockStartIndex + i] = info;
			part.addDisposable!(thenIfNotDisposed(info.uriPromise, uri => {
				if (!uri) {
					return;
				}

				this.codeBlocksByEditorUri.set(uri, info);
				part.addDisposable!(toDisposable(() => {
					const codeblock = this.codeBlocksByEditorUri.get(uri);
					if (codeblock?.ownerMarkdownPartId === part.codeblocksPartId) {
						this.codeBlocksByEditorUri.delete(uri);
					}
				}));
			}));
		});

	}

	private renderToolInvocation(toolInvocation: IChatToolInvocation | IChatToolInvocationSerialized, context: IChatContentPartRenderContext, templateData: IChatListItemTemplate): IChatContentPart | undefined {
		const codeBlockStartIndex = context.codeBlockStartIndex;
		const part = this.instantiationService.createInstance(ChatToolInvocationPart, toolInvocation, context, this.chatContentMarkdownRenderer, this._contentReferencesListPool, this._toolEditorPool, () => this._currentLayoutWidth, this._toolInvocationCodeBlockCollection, this._announcedToolProgressKeys, codeBlockStartIndex);
		part.addDisposable(part.onDidChangeHeight(() => {
			this.updateItemHeight(templateData);
		}));
		this.handleRenderedCodeblocks(context.element, part, codeBlockStartIndex);

		// handling for when we want to put tool invocations inside a thinking part
		const collapsedToolsMode = this.configService.getValue<CollapsedToolsDisplayMode>('chat.agent.thinking.collapsedTools');
		if (isResponseVM(context.element) && collapsedToolsMode !== CollapsedToolsDisplayMode.Off) {

			// create thinking part if it doesn't exist yet
			const lastThinking = this.getLastThinkingPart(templateData.renderedParts);
			if (!lastThinking && part?.domNode && toolInvocation.presentation !== 'hidden' && this.shouldPinPart(toolInvocation, context.element) && collapsedToolsMode === CollapsedToolsDisplayMode.Always) {
				const thinkingPart = this.renderThinkingPart({
					kind: 'thinking',
				}, context, templateData);

				if (thinkingPart instanceof ChatThinkingContentPart) {
					thinkingPart.appendItem(part?.domNode, toolInvocation.toolId, toolInvocation);
					thinkingPart.addDisposable(part);
					thinkingPart.addDisposable(thinkingPart.onDidChangeHeight(() => {
						this.updateItemHeight(templateData);
					}));
				}

				return thinkingPart;
			}

			if (this.shouldPinPart(toolInvocation, context.element)) {
				if (lastThinking && part?.domNode && toolInvocation.presentation !== 'hidden') {
					lastThinking.appendItem(part?.domNode, toolInvocation.toolId, toolInvocation);
					lastThinking.addDisposable(part);
				}
			} else {
				this.finalizeCurrentThinkingPart(context, templateData);
			}
		}

		return part;
	}

	private renderExtensionsContent(extensionsContent: IChatExtensionsContent, context: IChatContentPartRenderContext, templateData: IChatListItemTemplate): IChatContentPart | undefined {
		const part = this.instantiationService.createInstance(ChatExtensionsContentPart, extensionsContent);
		part.addDisposable(part.onDidChangeHeight(() => this.updateItemHeight(templateData)));
		return part;
	}

	private renderPullRequestContent(pullRequestContent: IChatPullRequestContent, context: IChatContentPartRenderContext, templateData: IChatListItemTemplate): IChatContentPart | undefined {
		const part = this.instantiationService.createInstance(ChatPullRequestContentPart, pullRequestContent);
		part.addDisposable(part.onDidChangeHeight(() => this.updateItemHeight(templateData)));
		return part;
	}

	private renderProgressTask(task: IChatTask | IChatTaskSerialized, templateData: IChatListItemTemplate, context: IChatContentPartRenderContext): IChatContentPart | undefined {
		if (!isResponseVM(context.element)) {
			return;
		}

		const taskPart = this.instantiationService.createInstance(ChatTaskContentPart, task, this._contentReferencesListPool, this.chatContentMarkdownRenderer, context);
		taskPart.addDisposable(taskPart.onDidChangeHeight(() => {
			this.updateItemHeight(templateData);
		}));
		return taskPart;
	}


	private renderConfirmation(context: IChatContentPartRenderContext, confirmation: IChatConfirmation, templateData: IChatListItemTemplate): IChatContentPart {
		const part = this.instantiationService.createInstance(ChatConfirmationContentPart, confirmation, context);
		part.addDisposable(part.onDidChangeHeight(() => this.updateItemHeight(templateData)));
		return part;
	}

	private renderElicitation(context: IChatContentPartRenderContext, elicitation: IChatElicitationRequest | IChatElicitationRequestSerialized, templateData: IChatListItemTemplate): IChatContentPart {
		if (elicitation.kind === 'elicitationSerialized' ? elicitation.isHidden : elicitation.isHidden?.get()) {
			return this.renderNoContent(other => elicitation.kind === other.kind);
		}

		const part = this.instantiationService.createInstance(ChatElicitationContentPart, elicitation, context);
		part.addDisposable(part.onDidChangeHeight(() => this.updateItemHeight(templateData)));
		return part;
	}

	private renderChangesSummary(content: IChatChangesSummaryPart, context: IChatContentPartRenderContext, templateData: IChatListItemTemplate): IChatContentPart {
		const part = this.instantiationService.createInstance(ChatCheckpointFileChangesSummaryContentPart, content, context);
		part.addDisposable(part.onDidChangeHeight(() => { this.updateItemHeight(templateData); }));
		return part;
	}

	private renderAttachments(variables: IChatRequestVariableEntry[], contentReferences: ReadonlyArray<IChatContentReference> | undefined, templateData: IChatListItemTemplate) {
		return this.instantiationService.createInstance(ChatAttachmentsContentPart, {
			variables,
			contentReferences,
			domNode: undefined
		});
	}

	private renderTextEdit(context: IChatContentPartRenderContext, chatTextEdit: IChatTextEditGroup, templateData: IChatListItemTemplate): IChatContentPart {
		const textEditPart = this.instantiationService.createInstance(ChatTextEditContentPart, chatTextEdit, context, this.rendererOptions, this._diffEditorPool, this._currentLayoutWidth);
		textEditPart.addDisposable(textEditPart.onDidChangeHeight(() => {
			textEditPart.layout(this._currentLayoutWidth);
			this.updateItemHeight(templateData);
		}));

		return textEditPart;
	}

	private renderMarkdown(markdown: IChatMarkdownContent, templateData: IChatListItemTemplate, context: IChatContentPartRenderContext): IChatContentPart {
		this.finalizeCurrentThinkingPart(context, templateData);
		const element = context.element;
		const fillInIncompleteTokens = isResponseVM(element) && (!element.isComplete || element.isCanceled || element.errorDetails?.responseIsFiltered || element.errorDetails?.responseIsIncomplete || !!element.renderData);
		const codeBlockStartIndex = context.codeBlockStartIndex;
		const markdownPart = templateData.instantiationService.createInstance(ChatMarkdownContentPart, markdown, context, this._editorPool, fillInIncompleteTokens, codeBlockStartIndex, this.chatContentMarkdownRenderer, undefined, this._currentLayoutWidth, this.codeBlockModelCollection, {});
		if (isRequestVM(element)) {
			markdownPart.domNode.tabIndex = 0;
			if (this.configService.getValue<string>('chat.editRequests') === 'inline' && this.rendererOptions.editable) {
				markdownPart.domNode.classList.add('clickable');
				markdownPart.addDisposable(dom.addDisposableListener(markdownPart.domNode, dom.EventType.CLICK, (e: MouseEvent) => {
					if (this.viewModel?.editing?.id === element.id) {
						return;
					}

					// Don't handle clicks on links
					const clickedElement = e.target as HTMLElement;
					if (clickedElement.tagName === 'A') {
						return;
					}

					// Don't handle if there's a text selection in the window
					const selection = dom.getWindow(templateData.rowContainer).getSelection();
					if (selection && !selection.isCollapsed && selection.toString().length > 0) {
						return;
					}

					// Don't handle if there's a selection in code block
					const monacoEditor = dom.findParentWithClass(clickedElement, 'monaco-editor');
					if (monacoEditor) {
						const editorPart = Array.from(this.editorsInUse()).find(editor =>
							editor.element.contains(monacoEditor));

						if (editorPart?.editor.getSelection()?.isEmpty() === false) {
							return;
						}
					}

					e.preventDefault();
					e.stopPropagation();
					this._onDidClickRequest.fire(templateData);
				}));
				markdownPart.addDisposable(this.hoverService.setupManagedHover(getDefaultHoverDelegate('element'), markdownPart.domNode, localize('requestMarkdownPartTitle', "Click to Edit"), { trapFocus: true }));
			}
			markdownPart.addDisposable(dom.addDisposableListener(markdownPart.domNode, dom.EventType.FOCUS, () => {
				this.hoverVisible(templateData.requestHover);
			}));
			markdownPart.addDisposable(dom.addDisposableListener(markdownPart.domNode, dom.EventType.BLUR, () => {
				this.hoverHidden(templateData.requestHover);
			}));
		}

		markdownPart.addDisposable(markdownPart.onDidChangeHeight(() => {
			markdownPart.layout(this._currentLayoutWidth);
			this.updateItemHeight(templateData);
		}));

		this.handleRenderedCodeblocks(element, markdownPart, codeBlockStartIndex);

		return markdownPart;
	}

	renderThinkingPart(content: IChatThinkingPart, context: IChatContentPartRenderContext, templateData: IChatListItemTemplate): IChatContentPart {
		// TODO @justschen @karthiknadig: remove this when OSWE moves off commentary channel
		if (!content.id) {
			content.id = Date.now().toString();
		}

		// if array, we do a naive part by part rendering for now
		if (Array.isArray(content.value)) {
			if (content.value.length < 1) {
				const lastThinking = this.getLastThinkingPart(templateData.renderedParts);
				lastThinking?.finalizeTitleIfDefault();
				return this.renderNoContent(other => content.kind === other.kind);
			}
			let lastPart: IChatContentPart | undefined;
			for (const item of content.value) {
				if (item) {
					const lastThinkingPart = lastPart instanceof ChatThinkingContentPart && lastPart.getIsActive() ? lastPart : undefined;
					if (lastThinkingPart) {
						lastThinkingPart.setupThinkingContainer({ ...content, value: item }, context);
					} else {
						const itemContent = { ...content, value: item };
						const itemPart = templateData.instantiationService.createInstance(ChatThinkingContentPart, itemContent, context, this.chatContentMarkdownRenderer);
						itemPart.addDisposable(itemPart.onDidChangeHeight(() => this.updateItemHeight(templateData)));
						lastPart = itemPart;
					}
				}
			}
			return lastPart ?? this.renderNoContent(other => content.kind === other.kind);
			// non-array, handle case where we are currently thinking vs. starting a new thinking part
		} else {
			const lastActiveThinking = this.getLastThinkingPart(templateData.renderedParts);
			if (lastActiveThinking) {
				lastActiveThinking.setupThinkingContainer(content, context);
				return lastActiveThinking;
			} else {
				const part = templateData.instantiationService.createInstance(ChatThinkingContentPart, content, context, this.chatContentMarkdownRenderer);
				part.addDisposable(part.onDidChangeHeight(() => this.updateItemHeight(templateData)));
				return part;
			}

		}
	}

	disposeElement(node: ITreeNode<ChatTreeItem, FuzzyScore>, index: number, templateData: IChatListItemTemplate, details?: IListElementRenderDetails): void {
		this.traceLayout('disposeElement', `Disposing element, index=${index}`);
		templateData.elementDisposables.clear();

		if (templateData.currentElement && !this.viewModel?.editing) {
			this.templateDataByRequestId.delete(templateData.currentElement.id);
		}

		if (isRequestVM(node.element) && node.element.id === this.viewModel?.editing?.id && details?.onScroll) {
			this._onDidDispose.fire(templateData);
		}

		// Don't retain the toolbar context which includes chat viewmodels
		if (templateData.titleToolbar) {
			templateData.titleToolbar.context = undefined;
		}
		templateData.footerToolbar.context = undefined;
	}

	private renderMcpServersInteractionRequired(content: IChatMcpServersStarting, context: IChatContentPartRenderContext, templateData: IChatListItemTemplate): IChatContentPart {
		return this.instantiationService.createInstance(ChatMcpServersInteractionContentPart, content, context);
	}

	disposeTemplate(templateData: IChatListItemTemplate): void {
		templateData.templateDisposables.dispose();
	}

	private hoverVisible(requestHover: HTMLElement) {
		requestHover.style.opacity = '1';
	}

	private hoverHidden(requestHover: HTMLElement) {
		requestHover.style.opacity = '0';
	}

}

export class ChatListDelegate implements IListVirtualDelegate<ChatTreeItem> {
	constructor(
		private readonly defaultElementHeight: number,
		@ILogService private readonly logService: ILogService
	) { }

	private _traceLayout(method: string, message: string) {
		if (forceVerboseLayoutTracing) {
			this.logService.info(`ChatListDelegate#${method}: ${message}`);
		} else {
			this.logService.trace(`ChatListDelegate#${method}: ${message}`);
		}
	}

	getHeight(element: ChatTreeItem): number {
		const kind = isRequestVM(element) ? 'request' : 'response';
		const height = element.currentRenderedHeight ?? this.defaultElementHeight;
		this._traceLayout('getHeight', `${kind}, height=${height}`);
		return height;
	}

	getTemplateId(element: ChatTreeItem): string {
		return ChatListItemRenderer.ID;
	}

	hasDynamicHeight(element: ChatTreeItem): boolean {
		return true;
	}
}

const voteDownDetailLabels: Record<ChatAgentVoteDownReason, string> = {
	[ChatAgentVoteDownReason.IncorrectCode]: localize('incorrectCode', "Suggested incorrect code"),
	[ChatAgentVoteDownReason.DidNotFollowInstructions]: localize('didNotFollowInstructions', "Didn't follow instructions"),
	[ChatAgentVoteDownReason.MissingContext]: localize('missingContext', "Missing context"),
	[ChatAgentVoteDownReason.OffensiveOrUnsafe]: localize('offensiveOrUnsafe', "Offensive or unsafe"),
	[ChatAgentVoteDownReason.PoorlyWrittenOrFormatted]: localize('poorlyWrittenOrFormatted', "Poorly written or formatted"),
	[ChatAgentVoteDownReason.RefusedAValidRequest]: localize('refusedAValidRequest', "Refused a valid request"),
	[ChatAgentVoteDownReason.IncompleteCode]: localize('incompleteCode', "Incomplete code"),
	[ChatAgentVoteDownReason.WillReportIssue]: localize('reportIssue', "Report an issue"),
	[ChatAgentVoteDownReason.Other]: localize('other', "Other"),
};

export class ChatVoteDownButton extends DropdownMenuActionViewItem {
	constructor(
		action: IAction,
		options: IDropdownMenuActionViewItemOptions | undefined,
		@ICommandService private readonly commandService: ICommandService,
		@IWorkbenchIssueService private readonly issueService: IWorkbenchIssueService,
		@ILogService private readonly logService: ILogService,
		@IContextMenuService contextMenuService: IContextMenuService,
	) {
		super(action,
			{ getActions: () => this.getActions(), },
			contextMenuService,
			{
				...options,
				classNames: ThemeIcon.asClassNameArray(Codicon.thumbsdown),
			});
	}

	getActions(): readonly IAction[] {
		return [
			this.getVoteDownDetailAction(ChatAgentVoteDownReason.IncorrectCode),
			this.getVoteDownDetailAction(ChatAgentVoteDownReason.DidNotFollowInstructions),
			this.getVoteDownDetailAction(ChatAgentVoteDownReason.IncompleteCode),
			this.getVoteDownDetailAction(ChatAgentVoteDownReason.MissingContext),
			this.getVoteDownDetailAction(ChatAgentVoteDownReason.PoorlyWrittenOrFormatted),
			this.getVoteDownDetailAction(ChatAgentVoteDownReason.RefusedAValidRequest),
			this.getVoteDownDetailAction(ChatAgentVoteDownReason.OffensiveOrUnsafe),
			this.getVoteDownDetailAction(ChatAgentVoteDownReason.Other),
			{
				id: 'reportIssue',
				label: voteDownDetailLabels[ChatAgentVoteDownReason.WillReportIssue],
				tooltip: '',
				enabled: true,
				class: undefined,
				run: async (context: IChatResponseViewModel) => {
					if (!isResponseVM(context)) {
						this.logService.error('ChatVoteDownButton#run: invalid context');
						return;
					}

					await this.commandService.executeCommand(MarkUnhelpfulActionId, context, ChatAgentVoteDownReason.WillReportIssue);
					await this.issueService.openReporter({ extensionId: context.agent?.extensionId.value });
				}
			}
		];
	}

	override render(container: HTMLElement): void {
		super.render(container);

		this.element?.classList.toggle('checked', this.action.checked);
	}

	private getVoteDownDetailAction(reason: ChatAgentVoteDownReason): IAction {
		const label = voteDownDetailLabels[reason];
		return {
			id: MarkUnhelpfulActionId,
			label,
			tooltip: '',
			enabled: true,
			checked: (this._context as IChatResponseViewModel).voteDownReason === reason,
			class: undefined,
			run: async (context: IChatResponseViewModel) => {
				if (!isResponseVM(context)) {
					this.logService.error('ChatVoteDownButton#getVoteDownDetailAction: invalid context');
					return;
				}

				await this.commandService.executeCommand(MarkUnhelpfulActionId, context, reason);
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatMarkdownDecorationsRenderer.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatMarkdownDecorationsRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { asCssVariable } from '../../../../platform/theme/common/colorUtils.js';
import { contentRefUrl } from '../common/annotations.js';
import { getFullyQualifiedId, IChatAgentCommand, IChatAgentData, IChatAgentNameService, IChatAgentService } from '../common/chatAgents.js';
import { chatSlashCommandBackground, chatSlashCommandForeground } from '../common/chatColors.js';
import { chatAgentLeader, ChatRequestAgentPart, ChatRequestAgentSubcommandPart, ChatRequestDynamicVariablePart, ChatRequestSlashCommandPart, ChatRequestSlashPromptPart, ChatRequestTextPart, ChatRequestToolPart, chatSubcommandLeader, IParsedChatRequest, IParsedChatRequestPart } from '../common/chatParserTypes.js';
import { IChatMarkdownContent, IChatService } from '../common/chatService.js';
import { ILanguageModelToolsService } from '../common/languageModelToolsService.js';
import { IChatWidgetService } from './chat.js';
import { ChatAgentHover, getChatAgentHoverOptions } from './chatAgentHover.js';
import { IChatMarkdownAnchorService } from './chatContentParts/chatMarkdownAnchorService.js';
import { InlineAnchorWidget } from './chatInlineAnchorWidget.js';
import './media/chatInlineAnchorWidget.css';

/** For rendering slash commands, variables */
const decorationRefUrl = `http://_vscodedecoration_`;

/** For rendering agent decorations with hover */
const agentRefUrl = `http://_chatagent_`;

/** For rendering agent decorations with hover */
const agentSlashRefUrl = `http://_chatslash_`;

export function agentToMarkdown(agent: IChatAgentData, sessionResource: URI, isClickable: boolean, accessor: ServicesAccessor): string {
	const chatAgentNameService = accessor.get(IChatAgentNameService);
	const chatAgentService = accessor.get(IChatAgentService);

	const isAllowed = chatAgentNameService.getAgentNameRestriction(agent);
	let name = `${isAllowed ? agent.name : getFullyQualifiedId(agent)}`;
	const isDupe = isAllowed && chatAgentService.agentHasDupeName(agent.id);
	if (isDupe) {
		name += ` (${agent.publisherDisplayName})`;
	}

	const args: IAgentWidgetArgs = { agentId: agent.id, sessionResource, name, isClickable };
	return `[${agent.name}](${agentRefUrl}?${encodeURIComponent(JSON.stringify(args))})`;
}

interface IAgentWidgetArgs {
	sessionResource: URI;
	agentId: string;
	name: string;
	isClickable?: boolean;
}

export function agentSlashCommandToMarkdown(agent: IChatAgentData, command: IChatAgentCommand, sessionResource: URI): string {
	const text = `${chatSubcommandLeader}${command.name}`;
	const args: ISlashCommandWidgetArgs = { agentId: agent.id, command: command.name, sessionResource };
	return `[${text}](${agentSlashRefUrl}?${encodeURIComponent(JSON.stringify(args))})`;
}

interface ISlashCommandWidgetArgs {
	agentId: string;
	command: string;
	sessionResource: URI;
}

export interface IDecorationWidgetArgs {
	title?: string;
}

export class ChatMarkdownDecorationsRenderer {

	constructor(
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@ILogService private readonly logService: ILogService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IHoverService private readonly hoverService: IHoverService,
		@IChatService private readonly chatService: IChatService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
		@ICommandService private readonly commandService: ICommandService,
		@ILabelService private readonly labelService: ILabelService,
		@ILanguageModelToolsService private readonly toolsService: ILanguageModelToolsService,
		@IChatMarkdownAnchorService private readonly chatMarkdownAnchorService: IChatMarkdownAnchorService,
	) { }

	convertParsedRequestToMarkdown(sessionResource: URI, parsedRequest: IParsedChatRequest): string {
		let result = '';
		for (const part of parsedRequest.parts) {
			if (part instanceof ChatRequestTextPart) {
				result += part.text;
			} else if (part instanceof ChatRequestAgentPart) {
				result += this.instantiationService.invokeFunction(accessor => agentToMarkdown(part.agent, sessionResource, false, accessor));
			} else {
				result += this.genericDecorationToMarkdown(part);
			}
		}

		return result;
	}

	private genericDecorationToMarkdown(part: IParsedChatRequestPart): string {
		const uri = part instanceof ChatRequestDynamicVariablePart && part.data instanceof URI ?
			part.data :
			undefined;
		const title = uri ? this.labelService.getUriLabel(uri, { relative: true }) :
			part instanceof ChatRequestSlashCommandPart ? part.slashCommand.detail :
				part instanceof ChatRequestAgentSubcommandPart ? part.command.description :
					part instanceof ChatRequestSlashPromptPart ? part.name :
						part instanceof ChatRequestToolPart ? (this.toolsService.getTool(part.toolId)?.userDescription) :
							'';

		const args: IDecorationWidgetArgs = { title };
		const text = part.text;
		return `[${text}](${decorationRefUrl}?${encodeURIComponent(JSON.stringify(args))})`;
	}

	walkTreeAndAnnotateReferenceLinks(content: IChatMarkdownContent, element: HTMLElement): IDisposable {
		const store = new DisposableStore();
		// eslint-disable-next-line no-restricted-syntax
		element.querySelectorAll('a').forEach(a => {
			const href = a.getAttribute('data-href');
			if (href) {
				if (href.startsWith(agentRefUrl)) {
					let args: IAgentWidgetArgs | undefined;
					try {
						args = JSON.parse(decodeURIComponent(href.slice(agentRefUrl.length + 1)));
					} catch (e) {
						this.logService.error('Invalid chat widget render data JSON', toErrorMessage(e));
					}

					if (args) {
						a.replaceWith(this.renderAgentWidget(args, store));
					}
				} else if (href.startsWith(agentSlashRefUrl)) {
					let args: ISlashCommandWidgetArgs | undefined;
					try {
						args = JSON.parse(decodeURIComponent(href.slice(agentRefUrl.length + 1)));
					} catch (e) {
						this.logService.error('Invalid chat slash command render data JSON', toErrorMessage(e));
					}

					if (args) {
						a.replaceWith(this.renderSlashCommandWidget(a.textContent!, args, store));
					}
				} else if (href.startsWith(decorationRefUrl)) {
					let args: IDecorationWidgetArgs | undefined;
					try {
						args = JSON.parse(decodeURIComponent(href.slice(decorationRefUrl.length + 1)));
					} catch (e) { }

					a.replaceWith(this.renderResourceWidget(a.textContent!, args, store));
				} else if (href.startsWith(contentRefUrl)) {
					this.renderFileWidget(content, href, a, store);
				} else if (href.startsWith('command:')) {
					this.injectKeybindingHint(a, href, this.keybindingService);
				}
			}
		});

		return store;
	}

	private renderAgentWidget(args: IAgentWidgetArgs, store: DisposableStore): HTMLElement {
		const nameWithLeader = `${chatAgentLeader}${args.name}`;
		let container: HTMLElement;
		if (args.isClickable) {
			container = dom.$('span.chat-agent-widget');
			const button = store.add(new Button(container, {
				buttonBackground: asCssVariable(chatSlashCommandBackground),
				buttonForeground: asCssVariable(chatSlashCommandForeground),
				buttonHoverBackground: undefined
			}));
			button.label = nameWithLeader;
			store.add(button.onDidClick(() => {
				const agent = this.chatAgentService.getAgent(args.agentId);
				const widget = this.chatWidgetService.getWidgetBySessionResource(args.sessionResource) || this.chatWidgetService.lastFocusedWidget;
				if (!widget || !agent) {
					return;
				}

				this.chatService.sendRequest(widget.viewModel!.sessionResource, agent.metadata.sampleRequest ?? '',
					{
						location: widget.location,
						agentId: agent.id,
						userSelectedModelId: widget.input.currentLanguageModel,
						modeInfo: widget.input.currentModeInfo
					});
			}));
		} else {
			container = this.renderResourceWidget(nameWithLeader, undefined, store);
		}

		const agent = this.chatAgentService.getAgent(args.agentId);
		const hover: Lazy<ChatAgentHover> = new Lazy(() => store.add(this.instantiationService.createInstance(ChatAgentHover)));
		store.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('element'), container, () => {
			hover.value.setAgent(args.agentId);
			return hover.value.domNode;
		}, agent && getChatAgentHoverOptions(() => agent, this.commandService)));
		return container;
	}

	private renderSlashCommandWidget(name: string, args: ISlashCommandWidgetArgs, store: DisposableStore): HTMLElement {
		const container = dom.$('span.chat-agent-widget.chat-command-widget');
		const agent = this.chatAgentService.getAgent(args.agentId);
		const button = store.add(new Button(container, {
			buttonBackground: asCssVariable(chatSlashCommandBackground),
			buttonForeground: asCssVariable(chatSlashCommandForeground),
			buttonHoverBackground: undefined
		}));
		button.label = name;
		store.add(button.onDidClick(() => {
			const widget = this.chatWidgetService.getWidgetBySessionResource(args.sessionResource) || this.chatWidgetService.lastFocusedWidget;
			if (!widget || !agent) {
				return;
			}

			const command = agent.slashCommands.find(c => c.name === args.command);
			this.chatService.sendRequest(widget.viewModel!.sessionResource, command?.sampleRequest ?? '', {
				location: widget.location,
				agentId: agent.id,
				slashCommand: args.command,
				userSelectedModelId: widget.input.currentLanguageModel,
				modeInfo: widget.input.currentModeInfo
			});
		}));

		return container;
	}

	private renderFileWidget(content: IChatMarkdownContent, href: string, a: HTMLAnchorElement, store: DisposableStore): void {
		// TODO this can be a nicer FileLabel widget with an icon. Do a simple link for now.
		const fullUri = URI.parse(href);

		const data = content.inlineReferences?.[fullUri.path.slice(1)];
		if (!data) {
			this.logService.error('Invalid chat widget render data JSON');
			return;
		}

		const inlineAnchor = store.add(this.instantiationService.createInstance(InlineAnchorWidget, a, data));
		store.add(this.chatMarkdownAnchorService.register(inlineAnchor));
	}

	private renderResourceWidget(name: string, args: IDecorationWidgetArgs | undefined, store: DisposableStore): HTMLElement {
		const container = dom.$('span.chat-resource-widget');
		const alias = dom.$('span', undefined, name);
		if (args?.title) {
			store.add(this.hoverService.setupManagedHover(getDefaultHoverDelegate('element'), container, args.title));
		}

		container.appendChild(alias);
		return container;
	}


	private injectKeybindingHint(a: HTMLAnchorElement, href: string, keybindingService: IKeybindingService): void {
		const command = href.match(/command:([^\)]+)/)?.[1];
		if (command) {
			const kb = keybindingService.lookupKeybinding(command);
			if (kb) {
				const keybinding = kb.getLabel();
				if (keybinding) {
					a.textContent = `${a.textContent} (${keybinding})`;
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatOptions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatOptions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Color } from '../../../../base/common/color.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IBracketPairColorizationOptions, IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IViewDescriptorService } from '../../../common/views.js';

export interface IChatConfiguration {
	editor: {
		readonly fontSize: number;
		readonly fontFamily: string;
		readonly lineHeight: number;
		readonly fontWeight: string;
		readonly wordWrap: 'off' | 'on';
	};
}

export interface IChatEditorConfiguration {
	readonly foreground: Color | undefined;
	readonly inputEditor: IChatInputEditorOptions;
	readonly resultEditor: IChatResultEditorOptions;
}

export interface IChatInputEditorOptions {
	readonly backgroundColor: Color | undefined;
	readonly accessibilitySupport: string;
}

export interface IChatResultEditorOptions {
	readonly fontSize: number;
	readonly fontFamily: string | undefined;
	readonly lineHeight: number;
	readonly fontWeight: string;
	readonly backgroundColor: Color | undefined;
	readonly bracketPairColorization: IBracketPairColorizationOptions;
	readonly fontLigatures: boolean | string | undefined;
	readonly wordWrap: 'off' | 'on';

	// Bring these back if we make the editors editable
	// readonly cursorBlinking: string;
	// readonly accessibilitySupport: string;
}


export class ChatEditorOptions extends Disposable {
	private static readonly lineHeightEm = 1.4;

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	private _config!: IChatEditorConfiguration;
	public get configuration(): IChatEditorConfiguration {
		return this._config;
	}

	private static readonly relevantSettingIds = [
		'chat.editor.lineHeight',
		'chat.editor.fontSize',
		'chat.editor.fontFamily',
		'chat.editor.fontWeight',
		'chat.editor.wordWrap',
		'editor.cursorBlinking',
		'editor.fontLigatures',
		'editor.accessibilitySupport',
		'editor.bracketPairColorization.enabled',
		'editor.bracketPairColorization.independentColorPoolPerBracketType',
	];

	constructor(
		viewId: string | undefined,
		private readonly foreground: string,
		private readonly inputEditorBackgroundColor: string,
		private readonly resultEditorBackgroundColor: string,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IThemeService private readonly themeService: IThemeService,
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService
	) {
		super();

		this._register(this.themeService.onDidColorThemeChange(e => this.update()));
		this._register(this.viewDescriptorService.onDidChangeLocation(e => {
			if (e.views.some(v => v.id === viewId)) {
				this.update();
			}
		}));
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (ChatEditorOptions.relevantSettingIds.some(id => e.affectsConfiguration(id))) {
				this.update();
			}
		}));
		this.update();
	}

	private update() {
		const editorConfig = this.configurationService.getValue<IEditorOptions>('editor');

		// TODO shouldn't the setting keys be more specific?
		const chatEditorConfig = this.configurationService.getValue<IChatConfiguration>('chat')?.editor;
		const accessibilitySupport = this.configurationService.getValue<'auto' | 'off' | 'on'>('editor.accessibilitySupport');
		this._config = {
			foreground: this.themeService.getColorTheme().getColor(this.foreground),
			inputEditor: {
				backgroundColor: this.themeService.getColorTheme().getColor(this.inputEditorBackgroundColor),
				accessibilitySupport,
			},
			resultEditor: {
				backgroundColor: this.themeService.getColorTheme().getColor(this.resultEditorBackgroundColor),
				fontSize: chatEditorConfig.fontSize,
				fontFamily: chatEditorConfig.fontFamily === 'default' ? editorConfig.fontFamily : chatEditorConfig.fontFamily,
				fontWeight: chatEditorConfig.fontWeight,
				lineHeight: chatEditorConfig.lineHeight ? chatEditorConfig.lineHeight : ChatEditorOptions.lineHeightEm * chatEditorConfig.fontSize,
				bracketPairColorization: {
					enabled: this.configurationService.getValue<boolean>('editor.bracketPairColorization.enabled'),
					independentColorPoolPerBracketType: this.configurationService.getValue<boolean>('editor.bracketPairColorization.independentColorPoolPerBracketType'),
				},
				wordWrap: chatEditorConfig.wordWrap,
				fontLigatures: editorConfig.fontLigatures,
			}

		};
		this._onDidChange.fire();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatOutputItemRenderer.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatOutputItemRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getWindow } from '../../../../base/browser/dom.js';
import { raceCancellationError } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { matchesMimeType } from '../../../../base/common/dataTransfer.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IJSONSchema, TypeFromJsonSchema } from '../../../../base/common/jsonSchema.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { autorun } from '../../../../base/common/observable.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import * as nls from '../../../../nls.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IWebview, IWebviewService, WebviewContentPurpose } from '../../../contrib/webview/browser/webview.js';
import { IExtensionService, isProposedApiEnabled } from '../../../services/extensions/common/extensions.js';
import { ExtensionsRegistry, IExtensionPointUser } from '../../../services/extensions/common/extensionsRegistry.js';

export interface IChatOutputItemRenderer {
	renderOutputPart(mime: string, data: Uint8Array, webview: IWebview, token: CancellationToken): Promise<void>;
}

interface RegisterOptions {
	readonly extension?: {
		readonly id: ExtensionIdentifier;
		readonly location: URI;
	};
}

export const IChatOutputRendererService = createDecorator<IChatOutputRendererService>('chatOutputRendererService');

export interface IChatOutputRendererService {
	readonly _serviceBrand: undefined;

	registerRenderer(mime: string, renderer: IChatOutputItemRenderer, options: RegisterOptions): IDisposable;

	renderOutputPart(mime: string, data: Uint8Array, parent: HTMLElement, webviewOptions: RenderOutputPartWebviewOptions, token: CancellationToken): Promise<RenderedOutputPart>;
}

export interface RenderedOutputPart extends IDisposable {
	readonly onDidChangeHeight: Event<number>;
	readonly webview: IWebview;

	reinitialize(): void;
}

interface RenderOutputPartWebviewOptions {
	readonly origin?: string;
}


interface RendererEntry {
	readonly renderer: IChatOutputItemRenderer;
	readonly options: RegisterOptions;
}

export class ChatOutputRendererService extends Disposable implements IChatOutputRendererService {
	_serviceBrand: undefined;

	private readonly _contributions = new Map</*viewType*/ string, {
		readonly mimes: readonly string[];
	}>();

	private readonly _renderers = new Map</*viewType*/ string, RendererEntry>();

	constructor(
		@IWebviewService private readonly _webviewService: IWebviewService,
		@IExtensionService private readonly _extensionService: IExtensionService,
	) {
		super();

		this._register(chatOutputRenderContributionPoint.setHandler(extensions => {
			this.updateContributions(extensions);
		}));
	}

	registerRenderer(viewType: string, renderer: IChatOutputItemRenderer, options: RegisterOptions): IDisposable {
		this._renderers.set(viewType, { renderer, options });
		return {
			dispose: () => {
				this._renderers.delete(viewType);
			}
		};
	}

	async renderOutputPart(mime: string, data: Uint8Array, parent: HTMLElement, webviewOptions: RenderOutputPartWebviewOptions, token: CancellationToken): Promise<RenderedOutputPart> {
		const rendererData = await this.getRenderer(mime, token);
		if (token.isCancellationRequested) {
			throw new CancellationError();
		}

		if (!rendererData) {
			throw new Error(`No renderer registered found for mime type: ${mime}`);
		}

		const store = new DisposableStore();

		const webview = store.add(this._webviewService.createWebviewElement({
			title: '',
			origin: webviewOptions.origin ?? generateUuid(),
			options: {
				enableFindWidget: false,
				purpose: WebviewContentPurpose.ChatOutputItem,
				tryRestoreScrollPosition: false,
			},
			contentOptions: {},
			extension: rendererData.options.extension ? rendererData.options.extension : undefined,
		}));

		const onDidChangeHeight = store.add(new Emitter<number>());
		store.add(autorun(reader => {
			const height = reader.readObservable(webview.intrinsicContentSize);
			if (height) {
				onDidChangeHeight.fire(height.height);
				parent.style.height = `${height.height}px`;
			}
		}));

		webview.mountTo(parent, getWindow(parent));
		await rendererData.renderer.renderOutputPart(mime, data, webview, token);

		return {
			get webview() { return webview; },
			onDidChangeHeight: onDidChangeHeight.event,
			dispose: () => {
				store.dispose();
			},
			reinitialize: () => {
				webview.reinitializeAfterDismount();
			},
		};
	}

	private async getRenderer(mime: string, token: CancellationToken): Promise<RendererEntry | undefined> {
		await raceCancellationError(this._extensionService.whenInstalledExtensionsRegistered(), token);
		for (const [id, value] of this._contributions) {
			if (value.mimes.some(m => matchesMimeType(m, [mime]))) {
				await raceCancellationError(this._extensionService.activateByEvent(`onChatOutputRenderer:${id}`), token);
				const rendererData = this._renderers.get(id);
				if (rendererData) {
					return rendererData;
				}
			}
		}

		return undefined;
	}

	private updateContributions(extensions: readonly IExtensionPointUser<readonly IChatOutputRendererContribution[]>[]) {
		this._contributions.clear();
		for (const extension of extensions) {
			if (!isProposedApiEnabled(extension.description, 'chatOutputRenderer')) {
				continue;
			}

			for (const contribution of extension.value) {
				if (this._contributions.has(contribution.viewType)) {
					extension.collector.error(`Chat output renderer with view type '${contribution.viewType}' already registered`);
					continue;
				}

				this._contributions.set(contribution.viewType, {
					mimes: contribution.mimeTypes,
				});
			}
		}
	}
}

const chatOutputRendererContributionSchema = {
	type: 'object',
	additionalProperties: false,
	required: ['viewType', 'mimeTypes'],
	properties: {
		viewType: {
			type: 'string',
			description: nls.localize('chatOutputRenderer.viewType', 'Unique identifier for the renderer.'),
		},
		mimeTypes: {
			type: 'array',
			description: nls.localize('chatOutputRenderer.mimeTypes', 'MIME types that this renderer can handle'),
			items: {
				type: 'string'
			}
		}
	}
} as const satisfies IJSONSchema;

type IChatOutputRendererContribution = TypeFromJsonSchema<typeof chatOutputRendererContributionSchema>;

const chatOutputRenderContributionPoint = ExtensionsRegistry.registerExtensionPoint<IChatOutputRendererContribution[]>({
	extensionPoint: 'chatOutputRenderers',
	activationEventsGenerator: function* (contributions) {
		for (const contrib of contributions) {
			yield `onChatOutputRenderer:${contrib.viewType}`;
		}
	},
	jsonSchema: {
		description: nls.localize('vscode.extension.contributes.chatOutputRenderer', 'Contributes a renderer for specific MIME types in chat outputs'),
		type: 'array',
		items: chatOutputRendererContributionSchema,
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatParticipant.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatParticipant.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce, isNonEmptyArray } from '../../../../base/common/arrays.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { Event } from '../../../../base/common/event.js';
import { createCommandUri, MarkdownString } from '../../../../base/common/htmlContent.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableMap, DisposableStore } from '../../../../base/common/lifecycle.js';
import * as strings from '../../../../base/common/strings.js';
import { localize, localize2 } from '../../../../nls.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier, IExtensionManifest } from '../../../../platform/extensions/common/extensions.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IViewContainersRegistry, IViewDescriptor, IViewsRegistry, ViewContainer, ViewContainerLocation, Extensions as ViewExtensions } from '../../../common/views.js';
import { Extensions, IExtensionFeaturesRegistry, IExtensionFeatureTableRenderer, IRenderedData, IRowData, ITableData } from '../../../services/extensionManagement/common/extensionFeatures.js';
import { isProposedApiEnabled } from '../../../services/extensions/common/extensions.js';
import * as extensionsRegistry from '../../../services/extensions/common/extensionsRegistry.js';
import { showExtensionsWithIdsCommandId } from '../../extensions/browser/extensionsActions.js';
import { IExtension, IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { IChatAgentData, IChatAgentService } from '../common/chatAgents.js';
import { ChatContextKeys } from '../common/chatContextKeys.js';
import { IRawChatParticipantContribution } from '../common/chatParticipantContribTypes.js';
import { ChatAgentLocation, ChatModeKind } from '../common/constants.js';
import { ChatViewId, ChatViewContainerId } from './chat.js';
import { ChatViewPane } from './chatViewPane.js';

// --- Chat Container &  View Registration

const chatViewContainer: ViewContainer = Registry.as<IViewContainersRegistry>(ViewExtensions.ViewContainersRegistry).registerViewContainer({
	id: ChatViewContainerId,
	title: localize2('chat.viewContainer.label', "Chat"),
	icon: Codicon.chatSparkle,
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [ChatViewContainerId, { mergeViewWithContainerWhenSingleView: true }]),
	storageId: ChatViewContainerId,
	hideIfEmpty: true,
	order: 1,
}, ViewContainerLocation.AuxiliaryBar, { isDefault: true, doNotRegisterOpenCommand: true });

const chatViewDescriptor: IViewDescriptor = {
	id: ChatViewId,
	containerIcon: chatViewContainer.icon,
	containerTitle: chatViewContainer.title.value,
	singleViewPaneContainerTitle: chatViewContainer.title.value,
	name: localize2('chat.viewContainer.label', "Chat"),
	canToggleVisibility: false,
	canMoveView: true,
	openCommandActionDescriptor: {
		id: ChatViewContainerId,
		title: chatViewContainer.title,
		mnemonicTitle: localize({ key: 'miToggleChat', comment: ['&& denotes a mnemonic'] }, "&&Chat"),
		keybindings: {
			primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyI,
			mac: {
				primary: KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.KeyI
			}
		},
		order: 1
	},
	ctorDescriptor: new SyncDescriptor(ChatViewPane),
	when: ContextKeyExpr.or(
		ContextKeyExpr.or(
			ChatContextKeys.Setup.hidden,
			ChatContextKeys.Setup.disabled
		)?.negate(),
		ChatContextKeys.panelParticipantRegistered,
		ChatContextKeys.extensionInvalid
	)
};
Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry).registerViews([chatViewDescriptor], chatViewContainer);

const chatParticipantExtensionPoint = extensionsRegistry.ExtensionsRegistry.registerExtensionPoint<IRawChatParticipantContribution[]>({
	extensionPoint: 'chatParticipants',
	jsonSchema: {
		description: localize('vscode.extension.contributes.chatParticipant', 'Contributes a chat participant'),
		type: 'array',
		items: {
			additionalProperties: false,
			type: 'object',
			defaultSnippets: [{ body: { name: '', description: '' } }],
			required: ['name', 'id'],
			properties: {
				id: {
					description: localize('chatParticipantId', "A unique id for this chat participant."),
					type: 'string'
				},
				name: {
					description: localize('chatParticipantName', "User-facing name for this chat participant. The user will use '@' with this name to invoke the participant. Name must not contain whitespace."),
					type: 'string',
					pattern: '^[\\w-]+$'
				},
				fullName: {
					markdownDescription: localize('chatParticipantFullName', "The full name of this chat participant, which is shown as the label for responses coming from this participant. If not provided, {0} is used.", '`name`'),
					type: 'string'
				},
				description: {
					description: localize('chatParticipantDescription', "A description of this chat participant, shown in the UI."),
					type: 'string'
				},
				isSticky: {
					description: localize('chatCommandSticky', "Whether invoking the command puts the chat into a persistent mode, where the command is automatically added to the chat input for the next message."),
					type: 'boolean'
				},
				sampleRequest: {
					description: localize('chatSampleRequest', "When the user clicks this participant in `/help`, this text will be submitted to the participant."),
					type: 'string'
				},
				when: {
					description: localize('chatParticipantWhen', "A condition which must be true to enable this participant."),
					type: 'string'
				},
				disambiguation: {
					description: localize('chatParticipantDisambiguation', "Metadata to help with automatically routing user questions to this chat participant."),
					type: 'array',
					items: {
						additionalProperties: false,
						type: 'object',
						defaultSnippets: [{ body: { category: '', description: '', examples: [] } }],
						required: ['category', 'description', 'examples'],
						properties: {
							category: {
								markdownDescription: localize('chatParticipantDisambiguationCategory', "A detailed name for this category, e.g. `workspace_questions` or `web_questions`."),
								type: 'string'
							},
							description: {
								description: localize('chatParticipantDisambiguationDescription', "A detailed description of the kinds of questions that are suitable for this chat participant."),
								type: 'string'
							},
							examples: {
								description: localize('chatParticipantDisambiguationExamples', "A list of representative example questions that are suitable for this chat participant."),
								type: 'array'
							},
						}
					}
				},
				commands: {
					markdownDescription: localize('chatCommandsDescription', "Commands available for this chat participant, which the user can invoke with a `/`."),
					type: 'array',
					items: {
						additionalProperties: false,
						type: 'object',
						defaultSnippets: [{ body: { name: '', description: '' } }],
						required: ['name'],
						properties: {
							name: {
								description: localize('chatCommand', "A short name by which this command is referred to in the UI, e.g. `fix` or `explain` for commands that fix an issue or explain code. The name should be unique among the commands provided by this participant."),
								type: 'string'
							},
							description: {
								description: localize('chatCommandDescription', "A description of this command."),
								type: 'string'
							},
							when: {
								description: localize('chatCommandWhen', "A condition which must be true to enable this command."),
								type: 'string'
							},
							sampleRequest: {
								description: localize('chatCommandSampleRequest', "When the user clicks this command in `/help`, this text will be submitted to the participant."),
								type: 'string'
							},
							isSticky: {
								description: localize('chatCommandSticky', "Whether invoking the command puts the chat into a persistent mode, where the command is automatically added to the chat input for the next message."),
								type: 'boolean'
							},
							disambiguation: {
								description: localize('chatCommandDisambiguation', "Metadata to help with automatically routing user questions to this chat command."),
								type: 'array',
								items: {
									additionalProperties: false,
									type: 'object',
									defaultSnippets: [{ body: { category: '', description: '', examples: [] } }],
									required: ['category', 'description', 'examples'],
									properties: {
										category: {
											markdownDescription: localize('chatCommandDisambiguationCategory', "A detailed name for this category, e.g. `workspace_questions` or `web_questions`."),
											type: 'string'
										},
										description: {
											description: localize('chatCommandDisambiguationDescription', "A detailed description of the kinds of questions that are suitable for this chat command."),
											type: 'string'
										},
										examples: {
											description: localize('chatCommandDisambiguationExamples', "A list of representative example questions that are suitable for this chat command."),
											type: 'array'
										},
									}
								}
							}
						}
					}
				},
			}
		}
	},
	activationEventsGenerator: function* (contributions: readonly IRawChatParticipantContribution[]) {
		for (const contrib of contributions) {
			yield `onChatParticipant:${contrib.id}`;
		}
	},
});

export class ChatExtensionPointHandler implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.chatExtensionPointHandler';

	private _participantRegistrationDisposables = new DisposableMap<string>();

	constructor(
		@IChatAgentService private readonly _chatAgentService: IChatAgentService,
	) {
		this.handleAndRegisterChatExtensions();
	}

	private handleAndRegisterChatExtensions(): void {
		chatParticipantExtensionPoint.setHandler((extensions, delta) => {
			for (const extension of delta.added) {
				for (const providerDescriptor of extension.value) {
					if (!providerDescriptor.name?.match(/^[\w-]+$/)) {
						extension.collector.error(`Extension '${extension.description.identifier.value}' CANNOT register participant with invalid name: ${providerDescriptor.name}. Name must match /^[\\w-]+$/.`);
						continue;
					}

					if (providerDescriptor.fullName && strings.AmbiguousCharacters.getInstance(new Set()).containsAmbiguousCharacter(providerDescriptor.fullName)) {
						extension.collector.error(`Extension '${extension.description.identifier.value}' CANNOT register participant with fullName that contains ambiguous characters: ${providerDescriptor.fullName}.`);
						continue;
					}

					// Spaces are allowed but considered "invisible"
					if (providerDescriptor.fullName && strings.InvisibleCharacters.containsInvisibleCharacter(providerDescriptor.fullName.replace(/ /g, ''))) {
						extension.collector.error(`Extension '${extension.description.identifier.value}' CANNOT register participant with fullName that contains invisible characters: ${providerDescriptor.fullName}.`);
						continue;
					}

					if ((providerDescriptor.isDefault || providerDescriptor.modes) && !isProposedApiEnabled(extension.description, 'defaultChatParticipant')) {
						extension.collector.error(`Extension '${extension.description.identifier.value}' CANNOT use API proposal: defaultChatParticipant.`);
						continue;
					}

					if (providerDescriptor.locations && !isProposedApiEnabled(extension.description, 'chatParticipantAdditions')) {
						extension.collector.error(`Extension '${extension.description.identifier.value}' CANNOT use API proposal: chatParticipantAdditions.`);
						continue;
					}

					if (!providerDescriptor.id || !providerDescriptor.name) {
						extension.collector.error(`Extension '${extension.description.identifier.value}' CANNOT register participant without both id and name.`);
						continue;
					}

					const participantsDisambiguation: {
						category: string;
						description: string;
						examples: string[];
					}[] = [];

					if (providerDescriptor.disambiguation?.length) {
						participantsDisambiguation.push(...providerDescriptor.disambiguation.map((d) => ({
							...d, category: d.category ?? d.categoryName
						})));
					}

					try {
						const store = new DisposableStore();
						store.add(this._chatAgentService.registerAgent(
							providerDescriptor.id,
							{
								extensionId: extension.description.identifier,
								extensionVersion: extension.description.version,
								publisherDisplayName: extension.description.publisherDisplayName ?? extension.description.publisher, // May not be present in OSS
								extensionPublisherId: extension.description.publisher,
								extensionDisplayName: extension.description.displayName ?? extension.description.name,
								id: providerDescriptor.id,
								description: providerDescriptor.description,
								when: providerDescriptor.when,
								metadata: {
									isSticky: providerDescriptor.isSticky,
									sampleRequest: providerDescriptor.sampleRequest,
								},
								name: providerDescriptor.name,
								fullName: providerDescriptor.fullName,
								isDefault: providerDescriptor.isDefault,
								locations: isNonEmptyArray(providerDescriptor.locations) ?
									providerDescriptor.locations.map(ChatAgentLocation.fromRaw) :
									[ChatAgentLocation.Chat],
								modes: providerDescriptor.isDefault ? (providerDescriptor.modes ?? [ChatModeKind.Ask]) : [ChatModeKind.Agent, ChatModeKind.Ask, ChatModeKind.Edit],
								slashCommands: providerDescriptor.commands ?? [],
								disambiguation: coalesce(participantsDisambiguation.flat()),
							} satisfies IChatAgentData));

						this._participantRegistrationDisposables.set(
							getParticipantKey(extension.description.identifier, providerDescriptor.id),
							store
						);
					} catch (e) {
						extension.collector.error(`Failed to register participant ${providerDescriptor.id}: ${toErrorMessage(e, true)}`);
					}
				}
			}

			for (const extension of delta.removed) {
				for (const providerDescriptor of extension.value) {
					this._participantRegistrationDisposables.deleteAndDispose(getParticipantKey(extension.description.identifier, providerDescriptor.id));
				}
			}
		});
	}
}

function getParticipantKey(extensionId: ExtensionIdentifier, participantName: string): string {
	return `${extensionId.value}_${participantName}`;
}

export class ChatCompatibilityNotifier extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.chatCompatNotifier';

	private registeredWelcomeView = false;

	constructor(
		@IExtensionsWorkbenchService extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IProductService private readonly productService: IProductService,
	) {
		super();

		// It may be better to have some generic UI for this, for any extension that is incompatible,
		// but this is only enabled for Chat now and it needs to be obvious.
		const isInvalid = ChatContextKeys.extensionInvalid.bindTo(contextKeyService);
		this._register(Event.runAndSubscribe(
			extensionsWorkbenchService.onDidChangeExtensionsNotification,
			() => {
				const notification = extensionsWorkbenchService.getExtensionsNotification();
				const chatExtension = notification?.extensions.find(ext => ExtensionIdentifier.equals(ext.identifier.id, this.productService.defaultChatAgent?.chatExtensionId));
				if (chatExtension) {
					isInvalid.set(true);
					this.registerWelcomeView(chatExtension);
				} else {
					isInvalid.set(false);
				}
			}
		));
	}

	private registerWelcomeView(chatExtension: IExtension) {
		if (this.registeredWelcomeView) {
			return;
		}

		this.registeredWelcomeView = true;
		const showExtensionLabel = localize('showExtension', "Show Extension");
		const mainMessage = localize('chatFailErrorMessage', "Chat failed to load because the installed version of the Copilot Chat extension is not compatible with this version of {0}. Please ensure that the Copilot Chat extension is up to date.", this.productService.nameLong);
		const commandButton = `[${showExtensionLabel}](${createCommandUri(showExtensionsWithIdsCommandId, [this.productService.defaultChatAgent?.chatExtensionId])})`;
		const versionMessage = `Copilot Chat version: ${chatExtension.version}`;
		const viewsRegistry = Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry);
		this._register(viewsRegistry.registerViewWelcomeContent(ChatViewId, {
			content: [mainMessage, commandButton, versionMessage].join('\n\n'),
			when: ChatContextKeys.extensionInvalid,
		}));
	}
}

class ChatParticipantDataRenderer extends Disposable implements IExtensionFeatureTableRenderer {
	readonly type = 'table';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.chatParticipants;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const nonDefaultContributions = manifest.contributes?.chatParticipants?.filter(c => !c.isDefault) ?? [];
		if (!nonDefaultContributions.length) {
			return { data: { headers: [], rows: [] }, dispose: () => { } };
		}

		const headers = [
			localize('participantName', "Name"),
			localize('participantFullName', "Full Name"),
			localize('participantDescription', "Description"),
			localize('participantCommands', "Commands"),
		];

		const rows: IRowData[][] = nonDefaultContributions.map(d => {
			return [
				'@' + d.name,
				d.fullName,
				d.description ?? '-',
				d.commands?.length ? new MarkdownString(d.commands.map(c => `- /` + c.name).join('\n')) : '-'
			];
		});

		return {
			data: {
				headers,
				rows
			},
			dispose: () => { }
		};
	}
}

Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'chatParticipants',
	label: localize('chatParticipants', "Chat Participants"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(ChatParticipantDataRenderer),
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatPasteProviders.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatPasteProviders.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { createStringDataTransferItem, IDataTransferItem, IReadonlyVSDataTransfer, VSDataTransfer } from '../../../../base/common/dataTransfer.js';
import { HierarchicalKind } from '../../../../base/common/hierarchicalKind.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { revive } from '../../../../base/common/marshalling.js';
import { Mimes } from '../../../../base/common/mime.js';
import { Schemas } from '../../../../base/common/network.js';
import { basename, joinPath } from '../../../../base/common/resources.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { DocumentPasteContext, DocumentPasteEdit, DocumentPasteEditProvider, DocumentPasteEditsSession } from '../../../../editor/common/languages.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { localize } from '../../../../nls.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IExtensionService, isProposedApiEnabled } from '../../../services/extensions/common/extensions.js';
import { IChatRequestPasteVariableEntry, IChatRequestVariableEntry } from '../common/chatVariableEntries.js';
import { IChatVariablesService, IDynamicVariable } from '../common/chatVariables.js';
import { IChatWidgetService } from './chat.js';
import { ChatDynamicVariableModel } from './contrib/chatDynamicVariables.js';
import { cleanupOldImages, createFileForMedia, resizeImage } from './chatImageUtils.js';

const COPY_MIME_TYPES = 'application/vnd.code.additional-editor-data';

interface SerializedCopyData {
	readonly uri: UriComponents;
	readonly range: IRange;
}

export class PasteImageProvider implements DocumentPasteEditProvider {
	private readonly imagesFolder: URI;

	public readonly kind = new HierarchicalKind('chat.attach.image');
	public readonly providedPasteEditKinds = [this.kind];

	public readonly copyMimeTypes = [];
	public readonly pasteMimeTypes = ['image/*'];

	constructor(
		private readonly chatWidgetService: IChatWidgetService,
		private readonly extensionService: IExtensionService,
		@IFileService private readonly fileService: IFileService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@ILogService private readonly logService: ILogService,
	) {
		this.imagesFolder = joinPath(this.environmentService.workspaceStorageHome, 'vscode-chat-images');
		cleanupOldImages(this.fileService, this.logService, this.imagesFolder,);
	}

	async provideDocumentPasteEdits(model: ITextModel, ranges: readonly IRange[], dataTransfer: IReadonlyVSDataTransfer, context: DocumentPasteContext, token: CancellationToken): Promise<DocumentPasteEditsSession | undefined> {
		if (!this.extensionService.extensions.some(ext => isProposedApiEnabled(ext, 'chatReferenceBinaryData'))) {
			return;
		}

		const supportedMimeTypes = [
			'image/png',
			'image/jpeg',
			'image/jpg',
			'image/bmp',
			'image/gif',
			'image/tiff'
		];

		let mimeType: string | undefined;
		let imageItem: IDataTransferItem | undefined;

		// Find the first matching image type in the dataTransfer
		for (const type of supportedMimeTypes) {
			imageItem = dataTransfer.get(type);
			if (imageItem) {
				mimeType = type;
				break;
			}
		}

		if (!imageItem || !mimeType) {
			return;
		}
		const currClipboard = await imageItem.asFile()?.data();
		if (token.isCancellationRequested || !currClipboard) {
			return;
		}

		const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
		if (!widget) {
			return;
		}

		const attachedVariables = widget.attachmentModel.attachments;
		const displayName = localize('pastedImageName', 'Pasted Image');
		let tempDisplayName = displayName;

		for (let appendValue = 2; attachedVariables.some(attachment => attachment.name === tempDisplayName); appendValue++) {
			tempDisplayName = `${displayName} ${appendValue}`;
		}

		const fileReference = await createFileForMedia(this.fileService, this.imagesFolder, currClipboard, mimeType);
		if (token.isCancellationRequested || !fileReference) {
			return;
		}

		const scaledImageData = await resizeImage(currClipboard);
		if (token.isCancellationRequested || !scaledImageData) {
			return;
		}

		const scaledImageContext = await getImageAttachContext(scaledImageData, mimeType, token, tempDisplayName, fileReference);
		if (token.isCancellationRequested || !scaledImageContext) {
			return;
		}

		// Make sure to attach only new contexts
		const currentContextIds = widget.attachmentModel.getAttachmentIDs();
		if (currentContextIds.has(scaledImageContext.id)) {
			return;
		}

		const edit = createCustomPasteEdit(model, [scaledImageContext], mimeType, this.kind, localize('pastedImageAttachment', 'Pasted Image Attachment'), this.chatWidgetService);
		return createEditSession(edit);
	}
}

async function getImageAttachContext(data: Uint8Array, mimeType: string, token: CancellationToken, displayName: string, resource: URI): Promise<IChatRequestVariableEntry | undefined> {
	const imageHash = await imageToHash(data);
	if (token.isCancellationRequested) {
		return undefined;
	}

	return {
		kind: 'image',
		value: data,
		id: imageHash,
		name: displayName,
		icon: Codicon.fileMedia,
		mimeType,
		isPasted: true,
		references: [{ reference: resource, kind: 'reference' }]
	};
}

export async function imageToHash(data: Uint8Array): Promise<string> {
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function isImage(array: Uint8Array): boolean {
	if (array.length < 4) {
		return false;
	}

	// Magic numbers (identification bytes) for various image formats
	const identifier: { [key: string]: number[] } = {
		png: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
		jpeg: [0xFF, 0xD8, 0xFF],
		bmp: [0x42, 0x4D],
		gif: [0x47, 0x49, 0x46, 0x38],
		tiff: [0x49, 0x49, 0x2A, 0x00]
	};

	return Object.values(identifier).some((signature) =>
		signature.every((byte, index) => array[index] === byte)
	);
}

export class CopyTextProvider implements DocumentPasteEditProvider {
	public readonly providedPasteEditKinds = [];
	public readonly copyMimeTypes = [COPY_MIME_TYPES];
	public readonly pasteMimeTypes = [];

	async prepareDocumentPaste(model: ITextModel, ranges: readonly IRange[], dataTransfer: IReadonlyVSDataTransfer, token: CancellationToken): Promise<undefined | IReadonlyVSDataTransfer> {
		if (model.uri.scheme === Schemas.vscodeChatInput) {
			return;
		}

		const customDataTransfer = new VSDataTransfer();
		const data: SerializedCopyData = { range: ranges[0], uri: model.uri.toJSON() };
		customDataTransfer.append(COPY_MIME_TYPES, createStringDataTransferItem(JSON.stringify(data)));
		return customDataTransfer;
	}
}

class CopyAttachmentsProvider implements DocumentPasteEditProvider {

	static ATTACHMENT_MIME_TYPE = 'application/vnd.chat.attachment+json';

	public readonly kind = new HierarchicalKind('chat.attach.attachments');
	public readonly providedPasteEditKinds = [this.kind];

	public readonly copyMimeTypes = [CopyAttachmentsProvider.ATTACHMENT_MIME_TYPE];
	public readonly pasteMimeTypes = [CopyAttachmentsProvider.ATTACHMENT_MIME_TYPE];

	constructor(
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
		@IChatVariablesService private readonly chatVariableService: IChatVariablesService
	) { }

	async prepareDocumentPaste(model: ITextModel, _ranges: readonly IRange[], _dataTransfer: IReadonlyVSDataTransfer, _token: CancellationToken): Promise<undefined | IReadonlyVSDataTransfer> {

		const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
		if (!widget || !widget.viewModel) {
			return undefined;
		}

		const attachments = widget.attachmentModel.attachments;
		const dynamicVariables = this.chatVariableService.getDynamicVariables(widget.viewModel.sessionResource);

		if (attachments.length === 0 && dynamicVariables.length === 0) {
			return undefined;
		}

		const result = new VSDataTransfer();
		result.append(CopyAttachmentsProvider.ATTACHMENT_MIME_TYPE, createStringDataTransferItem(JSON.stringify({ attachments, dynamicVariables })));
		return result;
	}

	async provideDocumentPasteEdits(model: ITextModel, _ranges: readonly IRange[], dataTransfer: IReadonlyVSDataTransfer, _context: DocumentPasteContext, token: CancellationToken): Promise<DocumentPasteEditsSession | undefined> {

		const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
		if (!widget || !widget.viewModel) {
			return undefined;
		}

		const chatDynamicVariable = widget.getContrib<ChatDynamicVariableModel>(ChatDynamicVariableModel.ID);
		if (!chatDynamicVariable) {
			return undefined;
		}

		const text = dataTransfer.get(Mimes.text);
		const data = dataTransfer.get(CopyAttachmentsProvider.ATTACHMENT_MIME_TYPE);
		const rawData = await data?.asString();
		const textdata = await text?.asString();

		if (textdata === undefined || rawData === undefined) {
			return;
		}

		if (token.isCancellationRequested) {
			return;
		}

		let pastedData: { attachments: IChatRequestVariableEntry[]; dynamicVariables: IDynamicVariable[] } | undefined;
		try {
			pastedData = revive(JSON.parse(rawData));
		} catch {
			//
		}

		if (!Array.isArray(pastedData?.attachments) && !Array.isArray(pastedData?.dynamicVariables)) {
			return;
		}

		const edit: DocumentPasteEdit = {
			insertText: textdata,
			title: localize('pastedChatAttachments', 'Insert Prompt & Attachments'),
			kind: this.kind,
			handledMimeType: CopyAttachmentsProvider.ATTACHMENT_MIME_TYPE,
			additionalEdit: {
				edits: []
			}
		};

		edit.additionalEdit?.edits.push({
			resource: model.uri,
			redo: () => {
				widget.attachmentModel.addContext(...pastedData.attachments);
				for (const dynamicVariable of pastedData.dynamicVariables) {
					chatDynamicVariable?.addReference(dynamicVariable);
				}
				widget.refreshParsedInput();
			},
			undo: () => {
				widget.attachmentModel.delete(...pastedData.attachments.map(c => c.id));
				widget.refreshParsedInput();
			}
		});

		return createEditSession(edit);
	}
}

export class PasteTextProvider implements DocumentPasteEditProvider {

	public readonly kind = new HierarchicalKind('chat.attach.text');
	public readonly providedPasteEditKinds = [this.kind];

	public readonly copyMimeTypes = [];
	public readonly pasteMimeTypes = [COPY_MIME_TYPES];

	constructor(
		private readonly chatWidgetService: IChatWidgetService,
		private readonly modelService: IModelService
	) { }

	async provideDocumentPasteEdits(model: ITextModel, ranges: readonly IRange[], dataTransfer: IReadonlyVSDataTransfer, _context: DocumentPasteContext, token: CancellationToken): Promise<DocumentPasteEditsSession | undefined> {
		if (model.uri.scheme !== Schemas.vscodeChatInput) {
			return;
		}
		const text = dataTransfer.get(Mimes.text);
		const editorData = dataTransfer.get('vscode-editor-data');
		const additionalEditorData = dataTransfer.get(COPY_MIME_TYPES);

		if (!editorData || !text || !additionalEditorData) {
			return;
		}

		const textdata = await text.asString();
		const metadata = JSON.parse(await editorData.asString());
		const additionalData: SerializedCopyData = JSON.parse(await additionalEditorData.asString());

		const widget = this.chatWidgetService.getWidgetByInputUri(model.uri);
		if (!widget) {
			return;
		}

		const start = additionalData.range.startLineNumber;
		const end = additionalData.range.endLineNumber;
		if (start === end) {
			const textModel = this.modelService.getModel(URI.revive(additionalData.uri));
			if (!textModel) {
				return;
			}

			// If copied line text data is the entire line content, then we can paste it as a code attachment. Otherwise, we ignore and use default paste provider.
			const lineContent = textModel.getLineContent(start);
			if (lineContent !== textdata) {
				return;
			}
		}

		const copiedContext = getCopiedContext(textdata, URI.revive(additionalData.uri), metadata.mode, additionalData.range);

		if (token.isCancellationRequested || !copiedContext) {
			return;
		}

		const currentContextIds = widget.attachmentModel.getAttachmentIDs();
		if (currentContextIds.has(copiedContext.id)) {
			return;
		}

		const edit = createCustomPasteEdit(model, [copiedContext], Mimes.text, this.kind, localize('pastedCodeAttachment', 'Pasted Code Attachment'), this.chatWidgetService);
		edit.yieldTo = [{ kind: HierarchicalKind.Empty.append('text', 'plain') }];
		return createEditSession(edit);
	}
}

function getCopiedContext(code: string, file: URI, language: string, range: IRange): IChatRequestPasteVariableEntry {
	const fileName = basename(file);
	const start = range.startLineNumber;
	const end = range.endLineNumber;
	const resultText = `Copied Selection of Code: \n\n\n From the file: ${fileName} From lines ${start} to ${end} \n \`\`\`${code}\`\`\``;
	const pastedLines = start === end ? localize('pastedAttachment.oneLine', '1 line') : localize('pastedAttachment.multipleLines', '{0} lines', end + 1 - start);
	return {
		kind: 'paste',
		value: resultText,
		id: `${fileName}${start}${end}${range.startColumn}${range.endColumn}`,
		name: `${fileName} ${pastedLines}`,
		icon: Codicon.code,
		pastedLines,
		language,
		fileName: file.toString(),
		copiedFrom: {
			uri: file,
			range
		},
		code,
		references: [{
			reference: file,
			kind: 'reference'
		}]
	};
}

function createCustomPasteEdit(model: ITextModel, context: IChatRequestVariableEntry[], handledMimeType: string, kind: HierarchicalKind, title: string, chatWidgetService: IChatWidgetService): DocumentPasteEdit {

	const label = context.length === 1
		? context[0].name
		: localize('pastedAttachment.multiple', '{0} and {1} more', context[0].name, context.length - 1);

	const customEdit = {
		resource: model.uri,
		variable: context,
		undo: () => {
			const widget = chatWidgetService.getWidgetByInputUri(model.uri);
			if (!widget) {
				throw new Error('No widget found for undo');
			}
			widget.attachmentModel.delete(...context.map(c => c.id));
		},
		redo: () => {
			const widget = chatWidgetService.getWidgetByInputUri(model.uri);
			if (!widget) {
				throw new Error('No widget found for redo');
			}
			widget.attachmentModel.addContext(...context);
		},
		metadata: {
			needsConfirmation: false,
			label
		}
	};

	return {
		insertText: '',
		title,
		kind,
		handledMimeType,
		additionalEdit: {
			edits: [customEdit],
		}
	};
}

function createEditSession(edit: DocumentPasteEdit): DocumentPasteEditsSession {
	return {
		edits: [edit],
		dispose: () => { },
	};
}

export class ChatPasteProvidersFeature extends Disposable {
	constructor(
		@IInstantiationService instaService: IInstantiationService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IChatWidgetService chatWidgetService: IChatWidgetService,
		@IExtensionService extensionService: IExtensionService,
		@IFileService fileService: IFileService,
		@IModelService modelService: IModelService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@ILogService logService: ILogService,
	) {
		super();
		this._register(languageFeaturesService.documentPasteEditProvider.register({ scheme: Schemas.vscodeChatInput, pattern: '*', hasAccessToAllModels: true }, instaService.createInstance(CopyAttachmentsProvider)));
		this._register(languageFeaturesService.documentPasteEditProvider.register({ scheme: Schemas.vscodeChatInput, pattern: '*', hasAccessToAllModels: true }, new PasteImageProvider(chatWidgetService, extensionService, fileService, environmentService, logService)));
		this._register(languageFeaturesService.documentPasteEditProvider.register({ scheme: Schemas.vscodeChatInput, pattern: '*', hasAccessToAllModels: true }, new PasteTextProvider(chatWidgetService, modelService)));
		this._register(languageFeaturesService.documentPasteEditProvider.register('*', new CopyTextProvider()));
		this._register(languageFeaturesService.documentPasteEditProvider.register('*', new CopyTextProvider()));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatQuick.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatQuick.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { Orientation, Sash } from '../../../../base/browser/ui/sash/sash.js';
import { disposableTimeout } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { autorun } from '../../../../base/common/observable.js';
import { URI } from '../../../../base/common/uri.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { localize } from '../../../../nls.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import product from '../../../../platform/product/common/product.js';
import { IQuickInputService, IQuickWidget } from '../../../../platform/quickinput/common/quickInput.js';
import { editorBackground, inputBackground, quickInputBackground, quickInputForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { EDITOR_DRAG_AND_DROP_BACKGROUND } from '../../../common/theme.js';
import { IChatEntitlementService } from '../../../services/chat/common/chatEntitlementService.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { isCellTextEditOperationArray } from '../common/chatModel.js';
import { ChatMode } from '../common/chatModes.js';
import { IParsedChatRequest } from '../common/chatParserTypes.js';
import { IChatModelReference, IChatProgress, IChatService } from '../common/chatService.js';
import { ChatAgentLocation } from '../common/constants.js';
import { IChatWidgetService, IQuickChatOpenOptions, IQuickChatService } from './chat.js';
import { ChatWidget } from './chatWidget.js';

export class QuickChatService extends Disposable implements IQuickChatService {
	readonly _serviceBrand: undefined;

	private readonly _onDidClose = this._register(new Emitter<void>());
	get onDidClose() { return this._onDidClose.event; }

	private _input: IQuickWidget | undefined;
	// TODO@TylerLeonhardt: support multiple chat providers eventually
	private _currentChat: QuickChat | undefined;
	private _container: HTMLElement | undefined;

	constructor(
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IChatService private readonly chatService: IChatService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
	}

	get enabled(): boolean {
		return !!this.chatService.isEnabled(ChatAgentLocation.Chat);
	}

	get focused(): boolean {
		const widget = this._input?.widget as HTMLElement | undefined;
		if (!widget) {
			return false;
		}
		return dom.isAncestorOfActiveElement(widget);
	}

	get sessionResource(): URI | undefined {
		return this._input && this._currentChat?.sessionResource;
	}

	toggle(options?: IQuickChatOpenOptions): void {
		// If the input is already shown, hide it. This provides a toggle behavior of the quick
		// pick. This should not happen when there is a query.
		if (this.focused && !options?.query) {
			this.close();
		} else {
			this.open(options);
			// If this is a partial query, the value should be cleared when closed as otherwise it
			// would remain for the next time the quick chat is opened in any context.
			if (options?.isPartialQuery) {
				const disposable = this._store.add(Event.once(this.onDidClose)(() => {
					this._currentChat?.clearValue();
					this._store.delete(disposable);
				}));
			}
		}
	}

	open(options?: IQuickChatOpenOptions): void {
		if (this._input) {
			if (this._currentChat && options?.query) {
				this._currentChat.focus();
				this._currentChat.setValue(options.query, options.selection);
				if (!options.isPartialQuery) {
					this._currentChat.acceptInput();
				}
				return;
			}
			return this.focus();
		}

		const disposableStore = new DisposableStore();

		this._input = this.quickInputService.createQuickWidget();
		this._input.contextKey = 'chatInputVisible';
		this._input.ignoreFocusOut = true;
		disposableStore.add(this._input);

		this._container ??= dom.$('.interactive-session');
		this._input.widget = this._container;

		this._input.show();
		if (!this._currentChat) {
			this._currentChat = this.instantiationService.createInstance(QuickChat);

			// show needs to come after the quickpick is shown
			this._currentChat.render(this._container);
		} else {
			this._currentChat.show();
		}

		disposableStore.add(this._input.onDidHide(() => {
			disposableStore.dispose();
			this._currentChat!.hide();
			this._input = undefined;
			this._onDidClose.fire();
		}));

		this._currentChat.focus();

		if (options?.query) {
			this._currentChat.setValue(options.query, options.selection);
			if (!options.isPartialQuery) {
				this._currentChat.acceptInput();
			}
		}
	}
	focus(): void {
		this._currentChat?.focus();
	}
	close(): void {
		this._input?.dispose();
		this._input = undefined;
	}
	async openInChatView(): Promise<void> {
		await this._currentChat?.openChatView();
		this.close();
	}
}

class QuickChat extends Disposable {
	// TODO@TylerLeonhardt: be responsive to window size
	static DEFAULT_MIN_HEIGHT = 200;
	private static readonly DEFAULT_HEIGHT_OFFSET = 100;

	private widget!: ChatWidget;
	private sash!: Sash;
	private modelRef: IChatModelReference | undefined;
	private readonly maintainScrollTimer: MutableDisposable<IDisposable> = this._register(new MutableDisposable<IDisposable>());
	private _deferUpdatingDynamicLayout: boolean = false;

	public get sessionResource() {
		return this.modelRef?.object.sessionResource;
	}

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IChatService private readonly chatService: IChatService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
		@IChatEntitlementService private readonly chatEntitlementService: IChatEntitlementService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) {
		super();
	}

	private clear() {
		this.modelRef?.dispose();
		this.modelRef = undefined;
		this.updateModel();
		this.widget.inputEditor.setValue('');
		return Promise.resolve();
	}

	focus(selection?: Selection): void {
		if (this.widget) {
			this.widget.focusInput();
			const value = this.widget.inputEditor.getValue();
			if (value) {
				this.widget.inputEditor.setSelection(selection ?? {
					startLineNumber: 1,
					startColumn: 1,
					endLineNumber: 1,
					endColumn: value.length + 1
				});
			}
		}
	}

	hide(): void {
		this.widget.setVisible(false);
		// Maintain scroll position for a short time so that if the user re-shows the chat
		// the same scroll position will be used.
		this.maintainScrollTimer.value = disposableTimeout(() => {
			// At this point, clear this mutable disposable which will be our signal that
			// the timer has expired and we should stop maintaining scroll position
			this.maintainScrollTimer.clear();
		}, 30 * 1000); // 30 seconds
	}

	show(): void {
		this.widget.setVisible(true);
		// If the mutable disposable is set, then we are keeping the existing scroll position
		// so we should not update the layout.
		if (this._deferUpdatingDynamicLayout) {
			this._deferUpdatingDynamicLayout = false;
			this.widget.updateDynamicChatTreeItemLayout(2, this.maxHeight);
		}
		if (!this.maintainScrollTimer.value) {
			this.widget.layoutDynamicChatTreeItemMode();
		}
	}

	render(parent: HTMLElement): void {
		if (this.widget) {
			// NOTE: if this changes, we need to make sure disposables in this function are tracked differently.
			throw new Error('Cannot render quick chat twice');
		}
		const scopedInstantiationService = this._register(this.instantiationService.createChild(
			new ServiceCollection([
				IContextKeyService,
				this._register(this.contextKeyService.createScoped(parent))
			])
		));
		this.widget = this._register(
			scopedInstantiationService.createInstance(
				ChatWidget,
				ChatAgentLocation.Chat,
				{ isQuickChat: true },
				{
					autoScroll: true,
					renderInputOnTop: true,
					renderStyle: 'compact',
					menus: { inputSideToolbar: MenuId.ChatInputSide, telemetrySource: 'chatQuick' },
					enableImplicitContext: true,
					defaultMode: ChatMode.Ask,
					clear: () => this.clear(),
				},
				{
					listForeground: quickInputForeground,
					listBackground: quickInputBackground,
					overlayBackground: EDITOR_DRAG_AND_DROP_BACKGROUND,
					inputEditorBackground: inputBackground,
					resultEditorBackground: editorBackground
				}));
		this.widget.render(parent);
		this.widget.setVisible(true);
		this.widget.setDynamicChatTreeItemLayout(2, this.maxHeight);
		this.updateModel();
		this.sash = this._register(new Sash(parent, { getHorizontalSashTop: () => parent.offsetHeight }, { orientation: Orientation.HORIZONTAL }));
		this.setupDisclaimer(parent);
		this.registerListeners(parent);
	}

	private setupDisclaimer(parent: HTMLElement): void {
		const disclaimerElement = dom.append(parent, dom.$('.disclaimer.hidden'));
		const disposables = this._store.add(new DisposableStore());

		this._register(autorun(reader => {
			disposables.clear();
			dom.reset(disclaimerElement);

			const sentiment = this.chatEntitlementService.sentimentObs.read(reader);
			const anonymous = this.chatEntitlementService.anonymousObs.read(reader);
			const requestInProgress = this.chatService.requestInProgressObs.read(reader);

			const showDisclaimer = !sentiment.installed && anonymous && !requestInProgress;
			disclaimerElement.classList.toggle('hidden', !showDisclaimer);

			if (showDisclaimer) {
				const renderedMarkdown = disposables.add(this.markdownRendererService.render(new MarkdownString(localize({ key: 'termsDisclaimer', comment: ['{Locked="]({2})"}', '{Locked="]({3})"}'] }, "By continuing with {0} Copilot, you agree to {1}'s [Terms]({2}) and [Privacy Statement]({3})", product.defaultChatAgent?.provider?.default?.name ?? '', product.defaultChatAgent?.provider?.default?.name ?? '', product.defaultChatAgent?.termsStatementUrl ?? '', product.defaultChatAgent?.privacyStatementUrl ?? ''), { isTrusted: true })));
				disclaimerElement.appendChild(renderedMarkdown.element);
			}
		}));
	}

	private get maxHeight(): number {
		return this.layoutService.mainContainerDimension.height - QuickChat.DEFAULT_HEIGHT_OFFSET;
	}

	private registerListeners(parent: HTMLElement): void {
		this._register(this.layoutService.onDidLayoutMainContainer(() => {
			if (this.widget.visible) {
				this.widget.updateDynamicChatTreeItemLayout(2, this.maxHeight);
			} else {
				// If the chat is not visible, then we should defer updating the layout
				// because it relies on offsetHeight which only works correctly
				// when the chat is visible.
				this._deferUpdatingDynamicLayout = true;
			}
		}));
		this._register(this.widget.onDidChangeHeight((e) => this.sash.layout()));
		const width = parent.offsetWidth;
		this._register(this.sash.onDidStart(() => {
			this.widget.isDynamicChatTreeItemLayoutEnabled = false;
		}));
		this._register(this.sash.onDidChange((e) => {
			if (e.currentY < QuickChat.DEFAULT_MIN_HEIGHT || e.currentY > this.maxHeight) {
				return;
			}
			this.widget.layout(e.currentY, width);
			this.sash.layout();
		}));
		this._register(this.sash.onDidReset(() => {
			this.widget.isDynamicChatTreeItemLayoutEnabled = true;
			this.widget.layoutDynamicChatTreeItemMode();
		}));
	}

	async acceptInput() {
		return this.widget.acceptInput();
	}

	async openChatView(): Promise<void> {
		const widget = await this.chatWidgetService.revealWidget();
		const model = this.modelRef?.object;
		if (!widget?.viewModel || !model) {
			return;
		}

		for (const request of model.getRequests()) {
			if (request.response?.response.value || request.response?.result) {


				const message: IChatProgress[] = [];
				for (const item of request.response.response.value) {
					if (item.kind === 'textEditGroup') {
						for (const group of item.edits) {
							message.push({
								kind: 'textEdit',
								edits: group,
								uri: item.uri
							});
						}
					} else if (item.kind === 'notebookEditGroup') {
						for (const group of item.edits) {
							if (isCellTextEditOperationArray(group)) {
								message.push({
									kind: 'textEdit',
									edits: group.map(e => e.edit),
									uri: group[0].uri
								});
							} else {
								message.push({
									kind: 'notebookEdit',
									edits: group,
									uri: item.uri
								});
							}
						}
					} else {
						message.push(item);
					}
				}

				this.chatService.addCompleteRequest(widget.viewModel.sessionResource,
					request.message as IParsedChatRequest,
					request.variableData,
					request.attempt,
					{
						message,
						result: request.response.result,
						followups: request.response.followups
					});
			} else if (request.message) {

			}
		}

		const value = this.widget.getViewState();
		if (value) {
			widget.viewModel.model.inputModel.setState(value);
		}
		widget.focusInput();
	}

	setValue(value: string, selection?: Selection): void {
		this.widget.inputEditor.setValue(value);
		this.focus(selection);
	}

	clearValue(): void {
		this.widget.inputEditor.setValue('');
	}

	private updateModel(): void {
		this.modelRef ??= this.chatService.startSession(ChatAgentLocation.Chat, { disableBackgroundKeepAlive: true });
		const model = this.modelRef?.object;
		if (!model) {
			throw new Error('Could not start chat session');
		}

		this.modelRef.object.inputModel.setState({ inputText: '', selections: [] });
		this.widget.setModel(model);
	}

	override dispose(): void {
		this.modelRef?.dispose();
		this.modelRef = undefined;
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatResponseAccessibleView.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatResponseAccessibleView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { renderAsPlaintext } from '../../../../base/browser/markdownRenderer.js';
import { isMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { stripIcons } from '../../../../base/common/iconLabels.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { AccessibleViewProviderId, AccessibleViewType, IAccessibleViewContentProvider } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { migrateLegacyTerminalToolSpecificData } from '../common/chat.js';
import { ChatContextKeys } from '../common/chatContextKeys.js';
import { IChatToolInvocation } from '../common/chatService.js';
import { isResponseVM } from '../common/chatViewModel.js';
import { isToolResultInputOutputDetails, isToolResultOutputDetails, toolContentToA11yString } from '../common/languageModelToolsService.js';
import { ChatTreeItem, IChatWidget, IChatWidgetService } from './chat.js';

export class ChatResponseAccessibleView implements IAccessibleViewImplementation {
	readonly priority = 100;
	readonly name = 'panelChat';
	readonly type = AccessibleViewType.View;
	readonly when = ChatContextKeys.inChatSession;
	getProvider(accessor: ServicesAccessor) {
		const widgetService = accessor.get(IChatWidgetService);
		const widget = widgetService.lastFocusedWidget;
		if (!widget) {
			return;
		}
		const chatInputFocused = widget.hasInputFocus();
		if (chatInputFocused) {
			widget.focusResponseItem();
		}

		const verifiedWidget: IChatWidget = widget;
		const focusedItem = verifiedWidget.getFocus();
		if (!focusedItem) {
			return;
		}

		return new ChatResponseAccessibleProvider(verifiedWidget, focusedItem, chatInputFocused);
	}
}

class ChatResponseAccessibleProvider extends Disposable implements IAccessibleViewContentProvider {
	private _focusedItem: ChatTreeItem;
	constructor(
		private readonly _widget: IChatWidget,
		item: ChatTreeItem,
		private readonly _wasOpenedFromInput: boolean
	) {
		super();
		this._focusedItem = item;
	}

	readonly id = AccessibleViewProviderId.PanelChat;
	readonly verbositySettingKey = AccessibilityVerbositySettingId.Chat;
	readonly options = { type: AccessibleViewType.View };

	provideContent(): string {
		return this._getContent(this._focusedItem);
	}

	private _getContent(item: ChatTreeItem): string {
		let responseContent = isResponseVM(item) ? item.response.toString() : '';
		if (!responseContent && 'errorDetails' in item && item.errorDetails) {
			responseContent = item.errorDetails.message;
		}
		if (isResponseVM(item)) {
			item.response.value.filter(item => item.kind === 'elicitation2' || item.kind === 'elicitationSerialized').forEach(elicitation => {
				const title = elicitation.title;
				if (typeof title === 'string') {
					responseContent += `${title}\n`;
				} else if (isMarkdownString(title)) {
					responseContent += renderAsPlaintext(title, { includeCodeBlocksFences: true }) + '\n';
				}
				const message = elicitation.message;
				if (isMarkdownString(message)) {
					responseContent += renderAsPlaintext(message, { includeCodeBlocksFences: true });
				} else {
					responseContent += message;
				}
			});
			const toolInvocations = item.response.value.filter(item => item.kind === 'toolInvocation');
			for (const toolInvocation of toolInvocations) {
				const state = toolInvocation.state.get();
				if (toolInvocation.confirmationMessages?.title && state.type === IChatToolInvocation.StateKind.WaitingForConfirmation) {
					const title = typeof toolInvocation.confirmationMessages.title === 'string' ? toolInvocation.confirmationMessages.title : toolInvocation.confirmationMessages.title.value;
					const message = typeof toolInvocation.confirmationMessages.message === 'string' ? toolInvocation.confirmationMessages.message : stripIcons(renderAsPlaintext(toolInvocation.confirmationMessages.message!));
					let input = '';
					if (toolInvocation.toolSpecificData) {
						if (toolInvocation.toolSpecificData?.kind === 'terminal') {
							const terminalData = migrateLegacyTerminalToolSpecificData(toolInvocation.toolSpecificData);
							input = terminalData.commandLine.userEdited ?? terminalData.commandLine.toolEdited ?? terminalData.commandLine.original;
						} else {
							input = toolInvocation.toolSpecificData?.kind === 'extensions'
								? JSON.stringify(toolInvocation.toolSpecificData.extensions)
								: toolInvocation.toolSpecificData?.kind === 'todoList'
									? JSON.stringify(toolInvocation.toolSpecificData.todoList)
									: toolInvocation.toolSpecificData?.kind === 'pullRequest'
										? JSON.stringify(toolInvocation.toolSpecificData)
										: JSON.stringify(toolInvocation.toolSpecificData.rawInput);
						}
					}
					responseContent += `${title}`;
					if (input) {
						responseContent += `: ${input}`;
					}
					responseContent += `\n${message}\n`;
				} else if (state.type === IChatToolInvocation.StateKind.WaitingForPostApproval) {
					const postApprovalDetails = isToolResultInputOutputDetails(state.resultDetails)
						? state.resultDetails.input
						: isToolResultOutputDetails(state.resultDetails)
							? undefined
							: toolContentToA11yString(state.contentForModel);
					responseContent += localize('toolPostApprovalA11yView', "Approve results of {0}? Result: ", toolInvocation.toolId) + (postApprovalDetails ?? '') + '\n';
				} else {
					const resultDetails = IChatToolInvocation.resultDetails(toolInvocation);
					if (resultDetails && 'input' in resultDetails) {
						responseContent += '\n' + (resultDetails.isError ? 'Errored ' : 'Completed ');
						responseContent += `${`${typeof toolInvocation.invocationMessage === 'string' ? toolInvocation.invocationMessage : stripIcons(renderAsPlaintext(toolInvocation.invocationMessage))} with input: ${resultDetails.input}`}\n`;
					}
				}
			}

			const pastConfirmations = item.response.value.filter(item => item.kind === 'toolInvocationSerialized');
			for (const pastConfirmation of pastConfirmations) {
				if (pastConfirmation.isComplete && pastConfirmation.resultDetails && 'input' in pastConfirmation.resultDetails) {
					if (pastConfirmation.pastTenseMessage) {
						responseContent += `\n${`${typeof pastConfirmation.pastTenseMessage === 'string' ? pastConfirmation.pastTenseMessage : stripIcons(renderAsPlaintext(pastConfirmation.pastTenseMessage))} with input: ${pastConfirmation.resultDetails.input}`}\n`;
					}
				}
			}
		}
		return renderAsPlaintext(new MarkdownString(responseContent), { includeCodeBlocksFences: true });
	}

	onClose(): void {
		this._widget.reveal(this._focusedItem);
		if (this._wasOpenedFromInput) {
			this._widget.focusInput();
		} else {
			this._widget.focus(this._focusedItem);
		}
	}

	provideNextContent(): string | undefined {
		const next = this._widget.getSibling(this._focusedItem, 'next');
		if (next) {
			this._focusedItem = next;
			return this._getContent(next);
		}
		return;
	}

	providePreviousContent(): string | undefined {
		const previous = this._widget.getSibling(this._focusedItem, 'previous');
		if (previous) {
			this._focusedItem = previous;
			return this._getContent(previous);
		}
		return;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatSelectedTools.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatSelectedTools.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { derived, IObservable, ObservableMap } from '../../../../base/common/observable.js';
import { isObject } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ObservableMemento, observableMemento } from '../../../../platform/observable/common/observableMemento.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { UserSelectedTools } from '../common/chatAgents.js';
import { IChatMode } from '../common/chatModes.js';
import { ChatModeKind } from '../common/constants.js';
import { ILanguageModelToolsService, IToolAndToolSetEnablementMap, IToolData, ToolSet } from '../common/languageModelToolsService.js';
import { PromptsStorage } from '../common/promptSyntax/service/promptsService.js';
import { PromptFileRewriter } from './promptSyntax/promptFileRewriter.js';


type ToolEnablementStates = {
	readonly toolSets: ReadonlyMap<string, boolean>;
	readonly tools: ReadonlyMap<string, boolean>;
};

type StoredDataV2 = {
	readonly version: 2;
	readonly toolSetEntries: [string, boolean][];
	readonly toolEntries: [string, boolean][];
};

type StoredDataV1 = {
	readonly version: undefined;
	readonly disabledToolSets?: string[];
	readonly disabledTools?: string[];
};

namespace ToolEnablementStates {
	export function fromMap(map: IToolAndToolSetEnablementMap): ToolEnablementStates {
		const toolSets: Map<string, boolean> = new Map(), tools: Map<string, boolean> = new Map();
		for (const [entry, enabled] of map.entries()) {
			if (entry instanceof ToolSet) {
				toolSets.set(entry.id, enabled);
			} else {
				tools.set(entry.id, enabled);
			}
		}
		return { toolSets, tools };
	}

	function isStoredDataV1(data: StoredDataV1 | StoredDataV2 | undefined): data is StoredDataV1 {
		return isObject(data) && data.version === undefined
			&& (data.disabledTools === undefined || Array.isArray(data.disabledTools))
			&& (data.disabledToolSets === undefined || Array.isArray(data.disabledToolSets));
	}

	function isStoredDataV2(data: StoredDataV1 | StoredDataV2 | undefined): data is StoredDataV2 {
		return isObject(data) && data.version === 2 && Array.isArray(data.toolSetEntries) && Array.isArray(data.toolEntries);
	}

	export function fromStorage(storage: string): ToolEnablementStates {
		try {
			const parsed = JSON.parse(storage);
			if (isStoredDataV2(parsed)) {
				return { toolSets: new Map(parsed.toolSetEntries), tools: new Map(parsed.toolEntries) };
			} else if (isStoredDataV1(parsed)) {
				const toolSetEntries = parsed.disabledToolSets?.map(id => [id, false] as [string, boolean]);
				const toolEntries = parsed.disabledTools?.map(id => [id, false] as [string, boolean]);
				return { toolSets: new Map(toolSetEntries), tools: new Map(toolEntries) };
			}
		} catch {
			// ignore
		}
		// invalid data
		return { toolSets: new Map(), tools: new Map() };
	}

	export function toStorage(state: ToolEnablementStates): string {
		const storageData: StoredDataV2 = {
			version: 2,
			toolSetEntries: Array.from(state.toolSets.entries()),
			toolEntries: Array.from(state.tools.entries())
		};
		return JSON.stringify(storageData);
	}
}

export enum ToolsScope {
	Global,
	Session,
	Agent,
	Agent_ReadOnly,
}

export class ChatSelectedTools extends Disposable {

	private readonly _globalState: ObservableMemento<ToolEnablementStates>;

	private readonly _sessionStates = new ObservableMap<string, ToolEnablementStates | undefined>();

	constructor(
		private readonly _mode: IObservable<IChatMode>,
		@ILanguageModelToolsService private readonly _toolsService: ILanguageModelToolsService,
		@IStorageService _storageService: IStorageService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();

		const globalStateMemento = observableMemento<ToolEnablementStates>({
			key: 'chat/selectedTools',
			defaultValue: { toolSets: new Map(), tools: new Map() },
			fromStorage: ToolEnablementStates.fromStorage,
			toStorage: ToolEnablementStates.toStorage
		});

		this._globalState = this._store.add(globalStateMemento(StorageScope.PROFILE, StorageTarget.MACHINE, _storageService));
	}

	/**
	 * All tools and tool sets with their enabled state.
	 */
	public readonly entriesMap: IObservable<IToolAndToolSetEnablementMap> = derived(r => {
		const map = new Map<IToolData | ToolSet, boolean>();

		// look up the tools in the hierarchy: session > mode > global
		const currentMode = this._mode.read(r);
		let currentMap = this._sessionStates.observable.read(r).get(currentMode.id);
		if (!currentMap && currentMode.kind === ChatModeKind.Agent) {
			const modeTools = currentMode.customTools?.read(r);
			if (modeTools) {
				const target = currentMode.target?.read(r);
				currentMap = ToolEnablementStates.fromMap(this._toolsService.toToolAndToolSetEnablementMap(modeTools, target));
			}
		}
		if (!currentMap) {
			currentMap = this._globalState.read(r);
		}
		for (const tool of this._toolsService.toolsObservable.read(r)) {
			if (tool.canBeReferencedInPrompt) {
				map.set(tool, currentMap.tools.get(tool.id) !== false); // if unknown, it's enabled
			}
		}
		for (const toolSet of this._toolsService.toolSets.read(r)) {
			const toolSetEnabled = currentMap.toolSets.get(toolSet.id) !== false; // if unknown, it's enabled
			map.set(toolSet, toolSetEnabled);
			for (const tool of toolSet.getTools(r)) {
				map.set(tool, toolSetEnabled || currentMap.tools.get(tool.id) === true); // if unknown, use toolSetEnabled
			}
		}
		return map;
	});

	public readonly userSelectedTools: IObservable<UserSelectedTools> = derived(r => {
		// extract a map of tool ids
		const result: UserSelectedTools = {};
		const map = this.entriesMap.read(r);
		for (const [item, enabled] of map) {
			if (!(item instanceof ToolSet)) {
				result[item.id] = enabled;
			}
		}
		return result;
	});

	get entriesScope() {
		const mode = this._mode.get();
		if (this._sessionStates.has(mode.id)) {
			return ToolsScope.Session;
		}
		if (mode.kind === ChatModeKind.Agent && mode.customTools?.get() && mode.uri) {
			return mode.source?.storage !== PromptsStorage.extension ? ToolsScope.Agent : ToolsScope.Agent_ReadOnly;
		}
		return ToolsScope.Global;
	}

	get currentMode(): IChatMode {
		return this._mode.get();
	}

	resetSessionEnablementState() {
		const mode = this._mode.get();
		this._sessionStates.delete(mode.id);
	}

	set(enablementMap: IToolAndToolSetEnablementMap, sessionOnly: boolean): void {
		const mode = this._mode.get();
		if (sessionOnly || this._sessionStates.has(mode.id)) {
			this._sessionStates.set(mode.id, ToolEnablementStates.fromMap(enablementMap));
			return;
		}
		if (mode.kind === ChatModeKind.Agent && mode.customTools?.get() && mode.uri) {
			if (mode.source?.storage !== PromptsStorage.extension) {
				// apply directly to mode file.
				this.updateCustomModeTools(mode.uri.get(), enablementMap);
				return;
			} else {
				// can not write to extensions, store
				this._sessionStates.set(mode.id, ToolEnablementStates.fromMap(enablementMap));
				return;
			}
		}
		this._globalState.set(ToolEnablementStates.fromMap(enablementMap), undefined);
	}

	private async updateCustomModeTools(uri: URI, enablementMap: IToolAndToolSetEnablementMap): Promise<void> {
		await this._instantiationService.createInstance(PromptFileRewriter).openAndRewriteTools(uri, enablementMap, CancellationToken.None);
	}
}
```

--------------------------------------------------------------------------------

````

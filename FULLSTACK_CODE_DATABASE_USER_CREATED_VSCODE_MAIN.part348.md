---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 348
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 348 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/chatWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/chat.css';
import './media/chatAgentHover.css';
import './media/chatViewWelcome.css';
import * as dom from '../../../../base/browser/dom.js';
import { IMouseWheelEvent } from '../../../../base/browser/mouseEvent.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { ITreeContextMenuEvent, ITreeElement } from '../../../../base/browser/ui/tree/tree.js';
import { disposableTimeout, timeout } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { FuzzyScore } from '../../../../base/common/filters.js';
import { IMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable, thenIfNotDisposed } from '../../../../base/common/lifecycle.js';
import { ResourceSet } from '../../../../base/common/map.js';
import { Schemas } from '../../../../base/common/network.js';
import { filter } from '../../../../base/common/objects.js';
import { autorun, observableFromEvent, observableValue } from '../../../../base/common/observable.js';
import { basename, extUri, isEqual } from '../../../../base/common/resources.js';
import { MicrotaskDelay } from '../../../../base/common/symbols.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { OffsetRange } from '../../../../editor/common/core/ranges/offsetRange.js';
import { localize } from '../../../../nls.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ITextResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { WorkbenchObjectTree } from '../../../../platform/list/browser/listService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { bindContextKey } from '../../../../platform/observable/common/platformObservableUtils.js';
import product from '../../../../platform/product/common/product.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { buttonSecondaryBackground, buttonSecondaryForeground, buttonSecondaryHoverBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { asCssVariable } from '../../../../platform/theme/common/colorUtils.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { EditorResourceAccessor } from '../../../../workbench/common/editor.js';
import { IEditorService } from '../../../../workbench/services/editor/common/editorService.js';
import { IChatEntitlementService } from '../../../services/chat/common/chatEntitlementService.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { katexContainerClassName } from '../../markdown/common/markedKatexExtension.js';
import { checkModeOption } from '../common/chat.js';
import { IChatAgentAttachmentCapabilities, IChatAgentCommand, IChatAgentData, IChatAgentService } from '../common/chatAgents.js';
import { ChatContextKeys } from '../common/chatContextKeys.js';
import { applyingChatEditsFailedContextKey, decidedChatEditingResourceContextKey, hasAppliedChatEditsContextKey, hasUndecidedChatEditingResourceContextKey, IChatEditingService, IChatEditingSession, inChatEditingSessionContextKey, ModifiedFileEntryState } from '../common/chatEditingService.js';
import { IChatLayoutService } from '../common/chatLayoutService.js';
import { IChatModel, IChatModelInputState, IChatResponseModel } from '../common/chatModel.js';
import { ChatMode, IChatModeService } from '../common/chatModes.js';
import { chatAgentLeader, ChatRequestAgentPart, ChatRequestDynamicVariablePart, ChatRequestSlashPromptPart, ChatRequestToolPart, ChatRequestToolSetPart, chatSubcommandLeader, formatChatQuestion, IParsedChatRequest } from '../common/chatParserTypes.js';
import { ChatRequestParser } from '../common/chatRequestParser.js';
import { IChatLocationData, IChatSendRequestOptions, IChatService } from '../common/chatService.js';
import { IChatSessionsService } from '../common/chatSessionsService.js';
import { IChatSlashCommandService } from '../common/chatSlashCommands.js';
import { IChatTodoListService } from '../common/chatTodoListService.js';
import { ChatRequestVariableSet, IChatRequestVariableEntry, isPromptFileVariableEntry, isPromptTextVariableEntry, isWorkspaceVariableEntry, PromptFileVariableKind, toPromptFileVariableEntry } from '../common/chatVariableEntries.js';
import { ChatViewModel, IChatRequestViewModel, IChatResponseViewModel, isRequestVM, isResponseVM } from '../common/chatViewModel.js';
import { CodeBlockModelCollection } from '../common/codeBlockModelCollection.js';
import { ChatAgentLocation, ChatConfiguration, ChatModeKind } from '../common/constants.js';
import { ILanguageModelToolsService, ToolSet } from '../common/languageModelToolsService.js';
import { ComputeAutomaticInstructions } from '../common/promptSyntax/computeAutomaticInstructions.js';
import { PromptsConfig } from '../common/promptSyntax/config/config.js';
import { IHandOff, PromptHeader, Target } from '../common/promptSyntax/promptFileParser.js';
import { IPromptsService } from '../common/promptSyntax/service/promptsService.js';
import { handleModeSwitch } from './actions/chatActions.js';
import { ChatTreeItem, IChatAcceptInputOptions, IChatAccessibilityService, IChatCodeBlockInfo, IChatFileTreeInfo, IChatListItemRendererOptions, IChatWidget, IChatWidgetService, IChatWidgetViewContext, IChatWidgetViewModelChangeEvent, IChatWidgetViewOptions, isIChatResourceViewContext, isIChatViewViewContext } from './chat.js';
import { ChatAccessibilityProvider } from './chatAccessibilityProvider.js';
import { ChatAttachmentModel } from './chatAttachmentModel.js';
import { ChatSuggestNextWidget } from './chatContentParts/chatSuggestNextWidget.js';
import { ChatInputPart, IChatInputPartOptions, IChatInputStyles } from './chatInputPart.js';
import { ChatListDelegate, ChatListItemRenderer, IChatListItemTemplate, IChatRendererDelegate } from './chatListRenderer.js';
import { ChatEditorOptions } from './chatOptions.js';
import { ChatViewWelcomePart, IChatSuggestedPrompts, IChatViewWelcomeContent } from './viewsWelcome/chatViewWelcomeController.js';
import { IAgentSessionsService } from './agentSessions/agentSessionsService.js';

const $ = dom.$;

export interface IChatWidgetStyles extends IChatInputStyles {
	readonly inputEditorBackground: string;
	readonly resultEditorBackground: string;
}

export interface IChatWidgetContrib extends IDisposable {

	readonly id: string;

	/**
	 * A piece of state which is related to the input editor of the chat widget.
	 * Takes in the `contrib` object that will be saved in the {@link IChatModelInputState}.
	 */
	getInputState?(contrib: Record<string, unknown>): void;

	/**
	 * Called with the result of getInputState when navigating input history.
	 */
	setInputState?(contrib: Readonly<Record<string, unknown>>): void;
}

interface IChatRequestInputOptions {
	input: string;
	attachedContext: ChatRequestVariableSet;
}

export interface IChatWidgetLocationOptions {
	location: ChatAgentLocation;

	resolveData?(): IChatLocationData | undefined;
}

export function isQuickChat(widget: IChatWidget): boolean {
	return isIChatResourceViewContext(widget.viewContext) && Boolean(widget.viewContext.isQuickChat);
}

function isInlineChat(widget: IChatWidget): boolean {
	return isIChatResourceViewContext(widget.viewContext) && Boolean(widget.viewContext.isInlineChat);
}

type ChatHandoffClickEvent = {
	fromAgent: string;
	toAgent: string;
	hasPrompt: boolean;
	autoSend: boolean;
};

type ChatHandoffClickClassification = {
	owner: 'digitarald';
	comment: 'Event fired when a user clicks on a handoff prompt in the chat suggest-next widget';
	fromAgent: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The agent/mode the user was in before clicking the handoff' };
	toAgent: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The agent/mode specified in the handoff' };
	hasPrompt: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether the handoff includes a prompt' };
	autoSend: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether the handoff automatically submits the request' };
};

type ChatHandoffWidgetShownEvent = {
	agent: string;
	handoffCount: number;
};

type ChatHandoffWidgetShownClassification = {
	owner: 'digitarald';
	comment: 'Event fired when the suggest-next widget is shown with handoff prompts';
	agent: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The current agent/mode that has handoffs defined' };
	handoffCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Number of handoff options shown to the user' };
};

const supportsAllAttachments: Required<IChatAgentAttachmentCapabilities> = {
	supportsFileAttachments: true,
	supportsToolAttachments: true,
	supportsMCPAttachments: true,
	supportsImageAttachments: true,
	supportsSearchResultAttachments: true,
	supportsInstructionAttachments: true,
	supportsSourceControlAttachments: true,
	supportsProblemAttachments: true,
	supportsSymbolAttachments: true,
	supportsTerminalAttachments: true,
};

const DISCLAIMER = localize('chatDisclaimer', "AI responses may be inaccurate.");

export class ChatWidget extends Disposable implements IChatWidget {

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static readonly CONTRIBS: { new(...args: [IChatWidget, ...any]): IChatWidgetContrib }[] = [];

	private readonly _onDidSubmitAgent = this._register(new Emitter<{ agent: IChatAgentData; slashCommand?: IChatAgentCommand }>());
	readonly onDidSubmitAgent = this._onDidSubmitAgent.event;

	private _onDidChangeAgent = this._register(new Emitter<{ agent: IChatAgentData; slashCommand?: IChatAgentCommand }>());
	readonly onDidChangeAgent = this._onDidChangeAgent.event;

	private _onDidFocus = this._register(new Emitter<void>());
	readonly onDidFocus = this._onDidFocus.event;

	private _onDidChangeViewModel = this._register(new Emitter<IChatWidgetViewModelChangeEvent>());
	readonly onDidChangeViewModel = this._onDidChangeViewModel.event;

	private _onDidScroll = this._register(new Emitter<void>());
	readonly onDidScroll = this._onDidScroll.event;

	private _onDidAcceptInput = this._register(new Emitter<void>());
	readonly onDidAcceptInput = this._onDidAcceptInput.event;

	private _onDidHide = this._register(new Emitter<void>());
	readonly onDidHide = this._onDidHide.event;

	private _onDidShow = this._register(new Emitter<void>());
	readonly onDidShow = this._onDidShow.event;

	private _onDidChangeParsedInput = this._register(new Emitter<void>());
	readonly onDidChangeParsedInput = this._onDidChangeParsedInput.event;

	private readonly _onWillMaybeChangeHeight = new Emitter<void>();
	readonly onWillMaybeChangeHeight: Event<void> = this._onWillMaybeChangeHeight.event;

	private _onDidChangeHeight = this._register(new Emitter<number>());
	readonly onDidChangeHeight = this._onDidChangeHeight.event;

	private readonly _onDidChangeContentHeight = new Emitter<void>();
	readonly onDidChangeContentHeight: Event<void> = this._onDidChangeContentHeight.event;

	private _onDidChangeEmptyState = this._register(new Emitter<void>());
	readonly onDidChangeEmptyState = this._onDidChangeEmptyState.event;

	contribs: ReadonlyArray<IChatWidgetContrib> = [];

	private listContainer!: HTMLElement;
	private container!: HTMLElement;

	get domNode() { return this.container; }

	private tree!: WorkbenchObjectTree<ChatTreeItem, FuzzyScore>;
	private renderer!: ChatListItemRenderer;
	private readonly _codeBlockModelCollection: CodeBlockModelCollection;
	private lastItem: ChatTreeItem | undefined;

	private readonly visibilityTimeoutDisposable: MutableDisposable<IDisposable> = this._register(new MutableDisposable());

	private readonly inputPartDisposable: MutableDisposable<ChatInputPart> = this._register(new MutableDisposable());
	private readonly inlineInputPartDisposable: MutableDisposable<ChatInputPart> = this._register(new MutableDisposable());
	private inputContainer!: HTMLElement;
	private focusedInputDOM!: HTMLElement;
	private editorOptions!: ChatEditorOptions;

	private recentlyRestoredCheckpoint: boolean = false;

	private settingChangeCounter = 0;

	private welcomeMessageContainer!: HTMLElement;
	private readonly welcomePart: MutableDisposable<ChatViewWelcomePart> = this._register(new MutableDisposable());

	private readonly chatSuggestNextWidget: ChatSuggestNextWidget;

	private bodyDimension: dom.Dimension | undefined;
	private visibleChangeCount = 0;
	private requestInProgress: IContextKey<boolean>;
	private agentInInput: IContextKey<boolean>;
	private currentRequest: Promise<void> | undefined;

	private _visible = false;
	get visible() { return this._visible; }

	private previousTreeScrollHeight: number = 0;

	/**
	 * Whether the list is scroll-locked to the bottom. Initialize to true so that we can scroll to the bottom on first render.
	 * The initial render leads to a lot of `onDidChangeTreeContentHeight` as the renderer works out the real heights of rows.
	*/
	private scrollLock = true;

	private _instructionFilesCheckPromise: Promise<boolean> | undefined;
	private _instructionFilesExist: boolean | undefined;

	private _isRenderingWelcome = false;

	// Coding agent locking state
	private _lockedAgent?: {
		id: string;
		name: string;
		prefix: string;
		displayName: string;
	};
	private readonly _lockedToCodingAgentContextKey: IContextKey<boolean>;
	private readonly _agentSupportsAttachmentsContextKey: IContextKey<boolean>;
	private readonly _sessionIsEmptyContextKey: IContextKey<boolean>;
	private _attachmentCapabilities: IChatAgentAttachmentCapabilities = supportsAllAttachments;

	// Cache for prompt file descriptions to avoid async calls during rendering
	private readonly promptDescriptionsCache = new Map<string, string>();
	private readonly promptUriCache = new Map<string, URI>();
	private _isLoadingPromptDescriptions = false;

	private _mostRecentlyFocusedItemIndex: number = -1;

	private readonly viewModelDisposables = this._register(new DisposableStore());
	private _viewModel: ChatViewModel | undefined;

	private set viewModel(viewModel: ChatViewModel | undefined) {
		if (this._viewModel === viewModel) {
			return;
		}

		const previousSessionResource = this._viewModel?.sessionResource;
		this.viewModelDisposables.clear();

		this._viewModel = viewModel;
		if (viewModel) {
			this.viewModelDisposables.add(viewModel);
			this.logService.debug('ChatWidget#setViewModel: have viewModel');
		} else {
			this.logService.debug('ChatWidget#setViewModel: no viewModel');
		}

		this._onDidChangeViewModel.fire({ previousSessionResource, currentSessionResource: this._viewModel?.sessionResource });
	}

	get viewModel() {
		return this._viewModel;
	}

	private readonly _editingSession = observableValue<IChatEditingSession | undefined>(this, undefined);

	private parsedChatRequest: IParsedChatRequest | undefined;
	get parsedInput() {
		if (this.parsedChatRequest === undefined) {
			if (!this.viewModel) {
				return { text: '', parts: [] };
			}

			this.parsedChatRequest = this.instantiationService.createInstance(ChatRequestParser)
				.parseChatRequest(this.viewModel.sessionResource, this.getInput(), this.location, {
					selectedAgent: this._lastSelectedAgent,
					mode: this.input.currentModeKind,
					forcedAgent: this._lockedAgent?.id ? this.chatAgentService.getAgent(this._lockedAgent.id) : undefined
				});
			this._onDidChangeParsedInput.fire();
		}

		return this.parsedChatRequest;
	}

	get scopedContextKeyService(): IContextKeyService {
		return this.contextKeyService;
	}

	private readonly _location: IChatWidgetLocationOptions;
	get location() {
		return this._location.location;
	}

	readonly viewContext: IChatWidgetViewContext;

	get supportsChangingModes(): boolean {
		return !!this.viewOptions.supportsChangingModes;
	}

	get locationData() {
		return this._location.resolveData?.();
	}

	constructor(
		location: ChatAgentLocation | IChatWidgetLocationOptions,
		viewContext: IChatWidgetViewContext | undefined,
		private readonly viewOptions: IChatWidgetViewOptions,
		private readonly styles: IChatWidgetStyles,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
		@IEditorService private readonly editorService: IEditorService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IChatService private readonly chatService: IChatService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IChatAccessibilityService private readonly chatAccessibilityService: IChatAccessibilityService,
		@ILogService private readonly logService: ILogService,
		@IThemeService private readonly themeService: IThemeService,
		@IChatSlashCommandService private readonly chatSlashCommandService: IChatSlashCommandService,
		@IChatEditingService chatEditingService: IChatEditingService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IPromptsService private readonly promptsService: IPromptsService,
		@ILanguageModelToolsService private readonly toolsService: ILanguageModelToolsService,
		@IChatModeService private readonly chatModeService: IChatModeService,
		@IChatLayoutService private readonly chatLayoutService: IChatLayoutService,
		@IChatEntitlementService private readonly chatEntitlementService: IChatEntitlementService,
		@IChatSessionsService private readonly chatSessionsService: IChatSessionsService,
		@IAgentSessionsService private readonly agentSessionsService: IAgentSessionsService,
		@IChatTodoListService private readonly chatTodoListService: IChatTodoListService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService
	) {
		super();

		this._lockedToCodingAgentContextKey = ChatContextKeys.lockedToCodingAgent.bindTo(this.contextKeyService);
		this._agentSupportsAttachmentsContextKey = ChatContextKeys.agentSupportsAttachments.bindTo(this.contextKeyService);
		this._sessionIsEmptyContextKey = ChatContextKeys.chatSessionIsEmpty.bindTo(this.contextKeyService);

		this.viewContext = viewContext ?? {};

		const viewModelObs = observableFromEvent(this, this.onDidChangeViewModel, () => this.viewModel);

		if (typeof location === 'object') {
			this._location = location;
		} else {
			this._location = { location };
		}

		ChatContextKeys.inChatSession.bindTo(contextKeyService).set(true);
		ChatContextKeys.location.bindTo(contextKeyService).set(this._location.location);
		ChatContextKeys.inQuickChat.bindTo(contextKeyService).set(isQuickChat(this));
		this.agentInInput = ChatContextKeys.inputHasAgent.bindTo(contextKeyService);
		this.requestInProgress = ChatContextKeys.requestInProgress.bindTo(contextKeyService);

		this._register(this.chatEntitlementService.onDidChangeAnonymous(() => this.renderWelcomeViewContentIfNeeded()));

		this._register(bindContextKey(decidedChatEditingResourceContextKey, contextKeyService, (reader) => {
			const currentSession = this._editingSession.read(reader);
			if (!currentSession) {
				return;
			}
			const entries = currentSession.entries.read(reader);
			const decidedEntries = entries.filter(entry => entry.state.read(reader) !== ModifiedFileEntryState.Modified);
			return decidedEntries.map(entry => entry.entryId);
		}));
		this._register(bindContextKey(hasUndecidedChatEditingResourceContextKey, contextKeyService, (reader) => {
			const currentSession = this._editingSession.read(reader);
			const entries = currentSession?.entries.read(reader) ?? []; // using currentSession here
			const decidedEntries = entries.filter(entry => entry.state.read(reader) === ModifiedFileEntryState.Modified);
			return decidedEntries.length > 0;
		}));
		this._register(bindContextKey(hasAppliedChatEditsContextKey, contextKeyService, (reader) => {
			const currentSession = this._editingSession.read(reader);
			if (!currentSession) {
				return false;
			}
			const entries = currentSession.entries.read(reader);
			return entries.length > 0;
		}));
		this._register(bindContextKey(inChatEditingSessionContextKey, contextKeyService, (reader) => {
			return this._editingSession.read(reader) !== null;
		}));
		this._register(bindContextKey(ChatContextKeys.chatEditingCanUndo, contextKeyService, (r) => {
			return this._editingSession.read(r)?.canUndo.read(r) || false;
		}));
		this._register(bindContextKey(ChatContextKeys.chatEditingCanRedo, contextKeyService, (r) => {
			return this._editingSession.read(r)?.canRedo.read(r) || false;
		}));
		this._register(bindContextKey(applyingChatEditsFailedContextKey, contextKeyService, (r) => {
			const chatModel = viewModelObs.read(r)?.model;
			const editingSession = this._editingSession.read(r);
			if (!editingSession || !chatModel) {
				return false;
			}
			const lastResponse = observableFromEvent(this, chatModel.onDidChange, () => chatModel.getRequests().at(-1)?.response).read(r);
			return lastResponse?.result?.errorDetails && !lastResponse?.result?.errorDetails.responseIsIncomplete;
		}));

		this._codeBlockModelCollection = this._register(instantiationService.createInstance(CodeBlockModelCollection, undefined));
		this.chatSuggestNextWidget = this._register(this.instantiationService.createInstance(ChatSuggestNextWidget));

		this._register(this.configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('chat.renderRelatedFiles')) {
				this.input.renderChatRelatedFiles();
			}

			if (e.affectsConfiguration(ChatConfiguration.EditRequests) || e.affectsConfiguration(ChatConfiguration.CheckpointsEnabled)) {
				this.settingChangeCounter++;
				this.onDidChangeItems();
			}
		}));

		this._register(autorun(r => {
			const viewModel = viewModelObs.read(r);
			const sessions = chatEditingService.editingSessionsObs.read(r);

			const session = sessions.find(candidate => isEqual(candidate.chatSessionResource, viewModel?.sessionResource));
			this._editingSession.set(undefined, undefined);
			this.renderChatEditingSessionState(); // this is necessary to make sure we dispose previous buttons, etc.

			if (!session) {
				// none or for a different chat widget
				return;
			}

			const entries = session.entries.read(r);
			for (const entry of entries) {
				entry.state.read(r); // SIGNAL
			}

			this._editingSession.set(session, undefined);

			r.store.add(session.onDidDispose(() => {
				this._editingSession.set(undefined, undefined);
				this.renderChatEditingSessionState();
			}));
			r.store.add(this.onDidChangeParsedInput(() => {
				this.renderChatEditingSessionState();
			}));
			r.store.add(this.inputEditor.onDidChangeModelContent(() => {
				if (this.getInput() === '') {
					this.refreshParsedInput();
					this.renderChatEditingSessionState();
				}
			}));
			this.renderChatEditingSessionState();
		}));

		this._register(codeEditorService.registerCodeEditorOpenHandler(async (input: ITextResourceEditorInput, _source: ICodeEditor | null, _sideBySide?: boolean): Promise<ICodeEditor | null> => {
			const resource = input.resource;
			if (resource.scheme !== Schemas.vscodeChatCodeBlock) {
				return null;
			}

			const responseId = resource.path.split('/').at(1);
			if (!responseId) {
				return null;
			}

			const item = this.viewModel?.getItems().find(item => item.id === responseId);
			if (!item) {
				return null;
			}

			// TODO: needs to reveal the chat view

			this.reveal(item);

			await timeout(0); // wait for list to actually render

			for (const codeBlockPart of this.renderer.editorsInUse()) {
				if (extUri.isEqual(codeBlockPart.uri, resource, true)) {
					const editor = codeBlockPart.editor;

					let relativeTop = 0;
					const editorDomNode = editor.getDomNode();
					if (editorDomNode) {
						const row = dom.findParentWithClass(editorDomNode, 'monaco-list-row');
						if (row) {
							relativeTop = dom.getTopLeftOffset(editorDomNode).top - dom.getTopLeftOffset(row).top;
						}
					}

					if (input.options?.selection) {
						const editorSelectionTopOffset = editor.getTopForPosition(input.options.selection.startLineNumber, input.options.selection.startColumn);
						relativeTop += editorSelectionTopOffset;

						editor.focus();
						editor.setSelection({
							startLineNumber: input.options.selection.startLineNumber,
							startColumn: input.options.selection.startColumn,
							endLineNumber: input.options.selection.endLineNumber ?? input.options.selection.startLineNumber,
							endColumn: input.options.selection.endColumn ?? input.options.selection.startColumn
						});
					}

					this.reveal(item, relativeTop);

					return editor;
				}
			}
			return null;
		}));

		this._register(this.onDidChangeParsedInput(() => this.updateChatInputContext()));

		this._register(this.chatTodoListService.onDidUpdateTodos((sessionResource) => {
			if (isEqual(this.viewModel?.sessionResource, sessionResource)) {
				this.inputPart.renderChatTodoListWidget(sessionResource);
			}
		}));
	}

	private _lastSelectedAgent: IChatAgentData | undefined;
	set lastSelectedAgent(agent: IChatAgentData | undefined) {
		this.parsedChatRequest = undefined;
		this._lastSelectedAgent = agent;
		this._updateAgentCapabilitiesContextKeys(agent);
		this._onDidChangeParsedInput.fire();
	}

	get lastSelectedAgent(): IChatAgentData | undefined {
		return this._lastSelectedAgent;
	}

	private _updateAgentCapabilitiesContextKeys(agent: IChatAgentData | undefined): void {
		// Check if the agent has capabilities defined directly
		const capabilities = agent?.capabilities ?? (this._lockedAgent ? this.chatSessionsService.getCapabilitiesForSessionType(this._lockedAgent.id) : undefined);
		this._attachmentCapabilities = capabilities ?? supportsAllAttachments;

		const supportsAttachments = Object.keys(filter(this._attachmentCapabilities, (key, value) => value === true)).length > 0;
		this._agentSupportsAttachmentsContextKey.set(supportsAttachments);
	}

	get supportsFileReferences(): boolean {
		return !!this.viewOptions.supportsFileReferences;
	}

	get attachmentCapabilities(): IChatAgentAttachmentCapabilities {
		return this._attachmentCapabilities;
	}

	get input(): ChatInputPart {
		return this.viewModel?.editing && this.configurationService.getValue<string>('chat.editRequests') !== 'input' ? this.inlineInputPart : this.inputPart;
	}

	private get inputPart(): ChatInputPart {
		return this.inputPartDisposable.value!;
	}

	private get inlineInputPart(): ChatInputPart {
		return this.inlineInputPartDisposable.value!;
	}

	get inputEditor(): ICodeEditor {
		return this.input.inputEditor;
	}

	get contentHeight(): number {
		return this.input.contentHeight + this.tree.contentHeight + this.chatSuggestNextWidget.height;
	}

	get attachmentModel(): ChatAttachmentModel {
		return this.input.attachmentModel;
	}

	render(parent: HTMLElement): void {
		const viewId = isIChatViewViewContext(this.viewContext) ? this.viewContext.viewId : undefined;
		this.editorOptions = this._register(this.instantiationService.createInstance(ChatEditorOptions, viewId, this.styles.listForeground, this.styles.inputEditorBackground, this.styles.resultEditorBackground));
		const renderInputOnTop = this.viewOptions.renderInputOnTop ?? false;
		const renderFollowups = this.viewOptions.renderFollowups ?? !renderInputOnTop;
		const renderStyle = this.viewOptions.renderStyle;
		const renderInputToolbarBelowInput = this.viewOptions.renderInputToolbarBelowInput ?? false;

		this.container = dom.append(parent, $('.interactive-session'));
		this.welcomeMessageContainer = dom.append(this.container, $('.chat-welcome-view-container', { style: 'display: none' }));
		this._register(dom.addStandardDisposableListener(this.welcomeMessageContainer, dom.EventType.CLICK, () => this.focusInput()));

		this._register(this.chatSuggestNextWidget.onDidChangeHeight(() => {
			if (this.bodyDimension) {
				this.layout(this.bodyDimension.height, this.bodyDimension.width);
			}
		}));
		this._register(this.chatSuggestNextWidget.onDidSelectPrompt(({ handoff, agentId }) => {
			this.handleNextPromptSelection(handoff, agentId);
		}));

		if (renderInputOnTop) {
			this.createInput(this.container, { renderFollowups, renderStyle, renderInputToolbarBelowInput });
			this.listContainer = dom.append(this.container, $(`.interactive-list`));
		} else {
			this.listContainer = dom.append(this.container, $(`.interactive-list`));
			dom.append(this.container, this.chatSuggestNextWidget.domNode);
			this.createInput(this.container, { renderFollowups, renderStyle, renderInputToolbarBelowInput });
		}

		this.renderWelcomeViewContentIfNeeded();
		this.createList(this.listContainer, { editable: !isInlineChat(this) && !isQuickChat(this), ...this.viewOptions.rendererOptions, renderStyle });

		const scrollDownButton = this._register(new Button(this.listContainer, {
			supportIcons: true,
			buttonBackground: asCssVariable(buttonSecondaryBackground),
			buttonForeground: asCssVariable(buttonSecondaryForeground),
			buttonHoverBackground: asCssVariable(buttonSecondaryHoverBackground),
		}));
		scrollDownButton.element.classList.add('chat-scroll-down');
		scrollDownButton.label = `$(${Codicon.chevronDown.id})`;
		scrollDownButton.setTitle(localize('scrollDownButtonLabel', "Scroll down"));
		this._register(scrollDownButton.onDidClick(() => {
			this.scrollLock = true;
			this.scrollToEnd();
		}));

		// Update the font family and size
		this._register(autorun(reader => {
			const fontFamily = this.chatLayoutService.fontFamily.read(reader);
			const fontSize = this.chatLayoutService.fontSize.read(reader);

			this.container.style.setProperty('--vscode-chat-font-family', fontFamily);
			this.container.style.fontSize = `${fontSize}px`;

			if (this.visible) {
				this.tree.rerender();
			}
		}));

		this._register(Event.runAndSubscribe(this.editorOptions.onDidChange, () => this.onDidStyleChange()));

		// Do initial render
		if (this.viewModel) {
			this.onDidChangeItems();
			this.scrollToEnd();
		}

		this.contribs = ChatWidget.CONTRIBS.map(contrib => {
			try {
				return this._register(this.instantiationService.createInstance(contrib, this));
			} catch (err) {
				this.logService.error('Failed to instantiate chat widget contrib', toErrorMessage(err));
				return undefined;
			}
		}).filter(isDefined);

		this._register(this.chatWidgetService.register(this));

		const parsedInput = observableFromEvent(this.onDidChangeParsedInput, () => this.parsedInput);
		this._register(autorun(r => {
			const input = parsedInput.read(r);

			const newPromptAttachments = new Map<string, IChatRequestVariableEntry>();
			const oldPromptAttachments = new Set<string>();

			// get all attachments, know those that are prompt-referenced
			for (const attachment of this.attachmentModel.attachments) {
				if (attachment.range) {
					oldPromptAttachments.add(attachment.id);
				}
			}

			// update/insert prompt-referenced attachments
			for (const part of input.parts) {
				if (part instanceof ChatRequestToolPart || part instanceof ChatRequestToolSetPart || part instanceof ChatRequestDynamicVariablePart) {
					const entry = part.toVariableEntry();
					newPromptAttachments.set(entry.id, entry);
					oldPromptAttachments.delete(entry.id);
				}
			}

			this.attachmentModel.updateContext(oldPromptAttachments, newPromptAttachments.values());
		}));

		if (!this.focusedInputDOM) {
			this.focusedInputDOM = this.container.appendChild(dom.$('.focused-input-dom'));
		}
	}

	private scrollToEnd() {
		if (this.lastItem) {
			const offset = Math.max(this.lastItem.currentRenderedHeight ?? 0, 1e6);
			if (this.tree.hasElement(this.lastItem)) {
				this.tree.reveal(this.lastItem, offset);
			}
		}
	}

	focusInput(): void {
		this.input.focus();

		// Sometimes focusing the input part is not possible,
		// but we'd like to be the last focused chat widget,
		// so we emit an optimistic onDidFocus event nonetheless.
		this._onDidFocus.fire();
	}

	hasInputFocus(): boolean {
		return this.input.hasFocus();
	}

	refreshParsedInput() {
		if (!this.viewModel) {
			return;
		}
		this.parsedChatRequest = this.instantiationService.createInstance(ChatRequestParser).parseChatRequest(this.viewModel.sessionResource, this.getInput(), this.location, { selectedAgent: this._lastSelectedAgent, mode: this.input.currentModeKind });
		this._onDidChangeParsedInput.fire();
	}

	getSibling(item: ChatTreeItem, type: 'next' | 'previous'): ChatTreeItem | undefined {
		if (!isResponseVM(item)) {
			return;
		}
		const items = this.viewModel?.getItems();
		if (!items) {
			return;
		}
		const responseItems = items.filter(i => isResponseVM(i));
		const targetIndex = responseItems.indexOf(item);
		if (targetIndex === undefined) {
			return;
		}
		const indexToFocus = type === 'next' ? targetIndex + 1 : targetIndex - 1;
		if (indexToFocus < 0 || indexToFocus > responseItems.length - 1) {
			return;
		}
		return responseItems[indexToFocus];
	}

	async clear(): Promise<void> {
		this.logService.debug('ChatWidget#clear');
		if (this._dynamicMessageLayoutData) {
			this._dynamicMessageLayoutData.enabled = true;
		}

		if (this.viewModel?.editing) {
			this.finishedEditing();
		}

		if (this.viewModel) {
			this.viewModel.resetInputPlaceholder();
		}
		if (this._lockedAgent) {
			this.lockToCodingAgent(this._lockedAgent.name, this._lockedAgent.displayName, this._lockedAgent.id);
		} else {
			this.unlockFromCodingAgent();
		}

		this.inputPart.clearTodoListWidget(this.viewModel?.sessionResource, true);
		this.chatSuggestNextWidget.hide();
		await this.viewOptions.clear?.();
	}

	private onDidChangeItems(skipDynamicLayout?: boolean) {
		if (this._visible || !this.viewModel) {
			const treeItems = (this.viewModel?.getItems() ?? [])
				.map((item): ITreeElement<ChatTreeItem> => {
					return {
						element: item,
						collapsed: false,
						collapsible: false
					};
				});


			if (treeItems.length > 0) {
				this.updateChatViewVisibility();
			} else {
				this.renderWelcomeViewContentIfNeeded();
			}

			this._onWillMaybeChangeHeight.fire();

			this.lastItem = treeItems.at(-1)?.element;
			ChatContextKeys.lastItemId.bindTo(this.contextKeyService).set(this.lastItem ? [this.lastItem.id] : []);
			this.tree.setChildren(null, treeItems, {
				diffIdentityProvider: {
					getId: (element) => {
						return element.dataId +
							// Ensure re-rendering an element once slash commands are loaded, so the colorization can be applied.
							`${(isRequestVM(element)) /* && !!this.lastSlashCommands ? '_scLoaded' : '' */}` +
							// If a response is in the process of progressive rendering, we need to ensure that it will
							// be re-rendered so progressive rendering is restarted, even if the model wasn't updated.
							`${isResponseVM(element) && element.renderData ? `_${this.visibleChangeCount}` : ''}` +
							// Re-render once content references are loaded
							(isResponseVM(element) ? `_${element.contentReferences.length}` : '') +
							// Re-render if element becomes hidden due to undo/redo
							`_${element.shouldBeRemovedOnSend ? `${element.shouldBeRemovedOnSend.afterUndoStop || '1'}` : '0'}` +
							// Re-render if element becomes enabled/disabled due to checkpointing
							`_${element.shouldBeBlocked ? '1' : '0'}` +
							// Re-render if we have an element currently being edited
							`_${this.viewModel?.editing ? '1' : '0'}` +
							// Re-render if we have an element currently being checkpointed
							`_${this.viewModel?.model.checkpoint ? '1' : '0'}` +
							// Re-render all if invoked by setting change
							`_setting${this.settingChangeCounter || '0'}` +
							// Rerender request if we got new content references in the response
							// since this may change how we render the corresponding attachments in the request
							(isRequestVM(element) && element.contentReferences ? `_${element.contentReferences?.length}` : '');
					},
				}
			});

			if (!skipDynamicLayout && this._dynamicMessageLayoutData) {
				this.layoutDynamicChatTreeItemMode();
			}

			this.renderFollowups();
		}
	}

	/**
	 * Updates the DOM visibility of welcome view and chat list immediately
	 */
	private updateChatViewVisibility(): void {
		if (!this.viewModel) {
			return;
		}

		const numItems = this.viewModel.getItems().length;
		dom.setVisibility(numItems === 0, this.welcomeMessageContainer);
		dom.setVisibility(numItems !== 0, this.listContainer);

		this._onDidChangeEmptyState.fire();
	}

	isEmpty(): boolean {
		return (this.viewModel?.getItems().length ?? 0) === 0;
	}

	/**
	 * Renders the welcome view content when needed.
	 */
	private renderWelcomeViewContentIfNeeded() {
		if (this._isRenderingWelcome) {
			return;
		}

		this._isRenderingWelcome = true;
		try {
			if (this.viewOptions.renderStyle === 'compact' || this.viewOptions.renderStyle === 'minimal' || this.lifecycleService.willShutdown) {
				return;
			}

			const numItems = this.viewModel?.getItems().length ?? 0;
			if (!numItems) {
				const defaultAgent = this.chatAgentService.getDefaultAgent(this.location, this.input.currentModeKind);
				let additionalMessage: string | IMarkdownString | undefined;
				if (this.chatEntitlementService.anonymous && !this.chatEntitlementService.sentiment.installed) {
					const providers = product.defaultChatAgent.provider;
					additionalMessage = new MarkdownString(localize({ key: 'settings', comment: ['{Locked="]({2})"}', '{Locked="]({3})"}'] }, "By continuing with {0} Copilot, you agree to {1}'s [Terms]({2}) and [Privacy Statement]({3}).", providers.default.name, providers.default.name, product.defaultChatAgent.termsStatementUrl, product.defaultChatAgent.privacyStatementUrl), { isTrusted: true });
				} else {
					additionalMessage = defaultAgent?.metadata.additionalWelcomeMessage;
				}
				if (!additionalMessage && !this._lockedAgent) {
					additionalMessage = this._getGenerateInstructionsMessage();
				}
				const welcomeContent = this.getWelcomeViewContent(additionalMessage);
				if (!this.welcomePart.value || this.welcomePart.value.needsRerender(welcomeContent)) {
					dom.clearNode(this.welcomeMessageContainer);

					this.welcomePart.value = this.instantiationService.createInstance(
						ChatViewWelcomePart,
						welcomeContent,
						{
							location: this.location,
							isWidgetAgentWelcomeViewContent: this.input?.currentModeKind === ChatModeKind.Agent
						}
					);
					dom.append(this.welcomeMessageContainer, this.welcomePart.value.element);
				}
			}

			this.updateChatViewVisibility();
		} finally {
			this._isRenderingWelcome = false;
		}
	}

	private _getGenerateInstructionsMessage(): IMarkdownString {
		// Start checking for instruction files immediately if not already done
		if (!this._instructionFilesCheckPromise) {
			this._instructionFilesCheckPromise = this._checkForAgentInstructionFiles();
			// Use VS Code's idiomatic pattern for disposal-safe promise callbacks
			this._register(thenIfNotDisposed(this._instructionFilesCheckPromise, hasFiles => {
				this._instructionFilesExist = hasFiles;
				// Only re-render if the current view still doesn't have items and we're showing the welcome message
				const hasViewModelItems = this.viewModel?.getItems().length ?? 0;
				if (hasViewModelItems === 0) {
					this.renderWelcomeViewContentIfNeeded();
				}
			}));
		}

		// If we already know the result, use it
		if (this._instructionFilesExist === true) {
			// Don't show generate instructions message if files exist
			return new MarkdownString('');
		} else if (this._instructionFilesExist === false) {
			// Show generate instructions message if no files exist
			const generateInstructionsCommand = 'workbench.action.chat.generateInstructions';
			return new MarkdownString(localize(
				'chatWidget.instructions',
				"[Generate Agent Instructions]({0}) to onboard AI onto your codebase.",
				`command:${generateInstructionsCommand}`
			), { isTrusted: { enabledCommands: [generateInstructionsCommand] } });
		}

		// While checking, don't show the generate instructions message
		return new MarkdownString('');
	}

	/**
	 * Checks if any agent instruction files (.github/copilot-instructions.md or AGENTS.md) exist in the workspace.
	 * Used to determine whether to show the "Generate Agent Instructions" hint.
	 *
	 * @returns true if instruction files exist OR if instruction features are disabled (to hide the hint)
	 */
	private async _checkForAgentInstructionFiles(): Promise<boolean> {
		try {
			const useCopilotInstructionsFiles = this.configurationService.getValue(PromptsConfig.USE_COPILOT_INSTRUCTION_FILES);
			const useAgentMd = this.configurationService.getValue(PromptsConfig.USE_AGENT_MD);
			if (!useCopilotInstructionsFiles && !useAgentMd) {
				// If both settings are disabled, return true to hide the hint (since the features aren't enabled)
				return true;
			}
			return (
				(await this.promptsService.listCopilotInstructionsMDs(CancellationToken.None)).length > 0 ||
				// Note: only checking for AGENTS.md files at the root folder, not ones in subfolders.
				(await this.promptsService.listAgentMDs(CancellationToken.None, false)).length > 0
			);
		} catch (error) {
			// On error, assume no instruction files exist to be safe
			this.logService.warn('[ChatWidget] Error checking for instruction files:', error);
			return false;
		}
	}

	private getWelcomeViewContent(additionalMessage: string | IMarkdownString | undefined): IChatViewWelcomeContent {
		if (this.isLockedToCodingAgent) {
			// Check for provider-specific customizations from chat sessions service
			const providerIcon = this._lockedAgent ? this.chatSessionsService.getIconForSessionType(this._lockedAgent.id) : undefined;
			const providerTitle = this._lockedAgent ? this.chatSessionsService.getWelcomeTitleForSessionType(this._lockedAgent.id) : undefined;
			const providerMessage = this._lockedAgent ? this.chatSessionsService.getWelcomeMessageForSessionType(this._lockedAgent.id) : undefined;

			// Fallback to default messages if provider doesn't specify
			const message = providerMessage
				? new MarkdownString(providerMessage)
				: (this._lockedAgent?.prefix === '@copilot '
					? new MarkdownString(localize('copilotCodingAgentMessage', "This chat session will be forwarded to the {0} [coding agent]({1}) where work is completed in the background. ", this._lockedAgent.prefix, 'https://aka.ms/coding-agent-docs') + DISCLAIMER, { isTrusted: true })
					: new MarkdownString(localize('genericCodingAgentMessage', "This chat session will be forwarded to the {0} coding agent where work is completed in the background. ", this._lockedAgent?.prefix) + DISCLAIMER));

			return {
				title: providerTitle ?? localize('codingAgentTitle', "Delegate to {0}", this._lockedAgent?.prefix),
				message,
				icon: providerIcon ?? Codicon.sendToRemoteAgent,
				additionalMessage,
				useLargeIcon: !!providerIcon,
			};
		}

		let title: string;
		if (this.input.currentModeKind === ChatModeKind.Ask) {
			title = localize('chatDescription', "Ask about your code");
		} else if (this.input.currentModeKind === ChatModeKind.Edit) {
			title = localize('editsTitle', "Edit in context");
		} else {
			title = localize('agentTitle', "Build with Agent");
		}

		return {
			title,
			message: new MarkdownString(DISCLAIMER),
			icon: Codicon.chatSparkle,
			additionalMessage,
			suggestedPrompts: this.getPromptFileSuggestions()
		};
	}

	private getPromptFileSuggestions(): IChatSuggestedPrompts[] {

		// Use predefined suggestions for new users
		if (!this.chatEntitlementService.sentiment.installed) {
			const isEmpty = this.contextService.getWorkbenchState() === WorkbenchState.EMPTY;
			if (isEmpty) {
				return [
					{
						icon: Codicon.vscode,
						label: localize('chatWidget.suggestedPrompts.gettingStarted', "Ask @vscode"),
						prompt: localize('chatWidget.suggestedPrompts.gettingStartedPrompt', "@vscode How do I change the theme to light mode?"),
					},
					{
						icon: Codicon.newFolder,
						label: localize('chatWidget.suggestedPrompts.newProject', "Create Project"),
						prompt: localize('chatWidget.suggestedPrompts.newProjectPrompt', "Create a #new Hello World project in TypeScript"),
					}
				];
			} else {
				return [
					{
						icon: Codicon.debugAlt,
						label: localize('chatWidget.suggestedPrompts.buildWorkspace', "Build Workspace"),
						prompt: localize('chatWidget.suggestedPrompts.buildWorkspacePrompt', "How do I build this workspace?"),
					},
					{
						icon: Codicon.gear,
						label: localize('chatWidget.suggestedPrompts.findConfig', "Show Config"),
						prompt: localize('chatWidget.suggestedPrompts.findConfigPrompt', "Where is the configuration for this project defined?"),
					}
				];
			}
		}

		// Get the current workspace folder context if available
		const activeEditor = this.editorService.activeEditor;
		const resource = activeEditor ? EditorResourceAccessor.getOriginalUri(activeEditor) : undefined;

		// Get the prompt file suggestions configuration
		const suggestions = PromptsConfig.getPromptFilesRecommendationsValue(this.configurationService, resource);
		if (!suggestions) {
			return [];
		}

		const result: IChatSuggestedPrompts[] = [];
		const promptsToLoad: string[] = [];

		// First, collect all prompts that need loading (regardless of shouldInclude)
		for (const [promptName] of Object.entries(suggestions)) {
			const description = this.promptDescriptionsCache.get(promptName);
			if (description === undefined) {
				promptsToLoad.push(promptName);
			}
		}

		// If we have prompts to load, load them asynchronously and don't return anything yet
		// But only if we're not already loading to prevent infinite loop
		if (promptsToLoad.length > 0 && !this._isLoadingPromptDescriptions) {
			this.loadPromptDescriptions(promptsToLoad);
			return [];
		}

		// Now process the suggestions with loaded descriptions
		const promptsWithScores: { promptName: string; condition: boolean | string; score: number }[] = [];

		for (const [promptName, condition] of Object.entries(suggestions)) {
			let score = 0;

			// Handle boolean conditions
			if (typeof condition === 'boolean') {
				score = condition ? 1 : 0;
			}
			// Handle when clause conditions
			else if (typeof condition === 'string') {
				try {
					const whenClause = ContextKeyExpr.deserialize(condition);
					if (whenClause) {
						// Test against all open code editors
						const allEditors = this.codeEditorService.listCodeEditors();

						if (allEditors.length > 0) {
							// Count how many editors match the when clause
							score = allEditors.reduce((count, editor) => {
								try {
									const editorContext = this.contextKeyService.getContext(editor.getDomNode());
									return count + (whenClause.evaluate(editorContext) ? 1 : 0);
								} catch (error) {
									// Log error for this specific editor but continue with others
									this.logService.warn('Failed to evaluate when clause for editor:', error);
									return count;
								}
							}, 0);
						} else {
							// Fallback to global context if no editors are open
							score = this.contextKeyService.contextMatchesRules(whenClause) ? 1 : 0;
						}
					} else {
						score = 0;
					}
				} catch (error) {
					// Log the error but don't fail completely
					this.logService.warn('Failed to parse when clause for prompt file suggestion:', condition, error);
					score = 0;
				}
			}

			if (score > 0) {
				promptsWithScores.push({ promptName, condition, score });
			}
		}

		// Sort by score (descending) and take top 5
		promptsWithScores.sort((a, b) => b.score - a.score);
		const topPrompts = promptsWithScores.slice(0, 5);

		// Build the final result array
		for (const { promptName } of topPrompts) {
			const description = this.promptDescriptionsCache.get(promptName);
			const commandLabel = localize('chatWidget.promptFile.commandLabel', "{0}", promptName);
			const uri = this.promptUriCache.get(promptName);
			const descriptionText = description?.trim() ? description : undefined;
			result.push({
				icon: Codicon.run,
				label: commandLabel,
				description: descriptionText,
				prompt: `/${promptName} `,
				uri: uri
			});
		}

		return result;
	}

	private async loadPromptDescriptions(promptNames: string[]): Promise<void> {
		// Don't start loading if the widget is being disposed
		if (this._store.isDisposed) {
			return;
		}

		// Set loading guard to prevent infinite loop
		this._isLoadingPromptDescriptions = true;
		try {
			// Get all available prompt files with their metadata
			const promptCommands = await this.promptsService.getPromptSlashCommands(CancellationToken.None);

			let cacheUpdated = false;
			// Load descriptions only for the specified prompts
			for (const promptCommand of promptCommands) {
				if (promptNames.includes(promptCommand.name)) {
					const description = promptCommand.description;
					if (description) {
						this.promptDescriptionsCache.set(promptCommand.name, description);
						cacheUpdated = true;
					} else {
						// Set empty string to indicate we've checked this prompt
						this.promptDescriptionsCache.set(promptCommand.name, '');
						cacheUpdated = true;
					}
				}
			}

			// Fire event to trigger a re-render of the welcome view only if cache was updated
			if (cacheUpdated) {
				this.renderWelcomeViewContentIfNeeded();
			}
		} catch (error) {
			this.logService.warn('Failed to load specific prompt descriptions:', error);
		} finally {
			// Always clear the loading guard, even on error
			this._isLoadingPromptDescriptions = false;
		}
	}

	private async renderChatEditingSessionState() {
		if (!this.input) {
			return;
		}
		this.input.renderChatEditingSessionState(this._editingSession.get() ?? null);

		if (this.bodyDimension) {
			this.layout(this.bodyDimension.height, this.bodyDimension.width);
		}
	}

	private async renderFollowups(): Promise<void> {
		if (this.lastItem && isResponseVM(this.lastItem) && this.lastItem.isComplete) {
			this.input.renderFollowups(this.lastItem.replyFollowups, this.lastItem);
		} else {
			this.input.renderFollowups(undefined, undefined);
		}

		if (this.bodyDimension) {
			this.layout(this.bodyDimension.height, this.bodyDimension.width);
		}
	}

	private renderChatSuggestNextWidget(): void {
		if (this.lifecycleService.willShutdown) {
			return;
		}

		// Skip rendering in coding agent sessions
		if (this.isLockedToCodingAgent) {
			this.chatSuggestNextWidget.hide();
			return;
		}

		const items = this.viewModel?.getItems() ?? [];
		if (!items.length) {
			return;
		}

		const lastItem = items[items.length - 1];
		const lastResponseComplete = lastItem && isResponseVM(lastItem) && lastItem.isComplete;
		if (!lastResponseComplete) {
			return;
		}
		// Get the currently selected mode directly from the observable
		// Note: We use currentModeObs instead of currentModeKind because currentModeKind returns
		// the ChatModeKind enum (e.g., 'agent'), which doesn't distinguish between custom modes.
		// Custom modes all have kind='agent' but different IDs.
		const currentMode = this.input.currentModeObs.get();
		const handoffs = currentMode?.handOffs?.get();

		// Only show if: mode has handoffs AND chat has content AND not quick chat
		const shouldShow = currentMode && handoffs && handoffs.length > 0;

		if (shouldShow) {
			// Log telemetry only when widget transitions from hidden to visible
			const wasHidden = this.chatSuggestNextWidget.domNode.style.display === 'none';
			this.chatSuggestNextWidget.render(currentMode);

			if (wasHidden) {
				this.telemetryService.publicLog2<ChatHandoffWidgetShownEvent, ChatHandoffWidgetShownClassification>('chat.handoffWidgetShown', {
					agent: currentMode.id,
					handoffCount: handoffs.length
				});
			}
		} else {
			this.chatSuggestNextWidget.hide();
		}

		// Trigger layout update
		if (this.bodyDimension) {
			this.layout(this.bodyDimension.height, this.bodyDimension.width);
		}
	}

	private handleNextPromptSelection(handoff: IHandOff, agentId?: string): void {
		// Hide the widget after selection
		this.chatSuggestNextWidget.hide();

		const promptToUse = handoff.prompt;

		// Log telemetry
		const currentMode = this.input.currentModeObs.get();
		const fromAgent = currentMode?.id ?? '';
		this.telemetryService.publicLog2<ChatHandoffClickEvent, ChatHandoffClickClassification>('chat.handoffClicked', {
			fromAgent: fromAgent,
			toAgent: agentId || handoff.agent || '',
			hasPrompt: Boolean(promptToUse),
			autoSend: Boolean(handoff.send)
		});

		// If agentId is provided (from chevron dropdown), delegate to that chat session
		// Otherwise, switch to the handoff agent
		if (agentId) {
			// Delegate to chat session (e.g., @background or @cloud)
			this.input.setValue(`@${agentId} ${promptToUse}`, false);
			this.input.focus();
			// Auto-submit for delegated chat sessions
			this.acceptInput().catch(e => this.logService.error('Failed to handle handoff continueOn', e));
		} else if (handoff.agent) {
			// Regular handoff to specified agent
			this._switchToAgentByName(handoff.agent);
			// Insert the handoff prompt into the input
			this.input.setValue(promptToUse, false);
			this.input.focus();

			// Auto-submit if send flag is true
			if (handoff.send) {
				this.acceptInput();
			}
		}
	}

	async handleDelegationExitIfNeeded(sourceAgent: Pick<IChatAgentData, 'id' | 'name'> | undefined, targetAgent: IChatAgentData | undefined): Promise<void> {
		if (!this._shouldExitAfterDelegation(sourceAgent, targetAgent)) {
			return;
		}

		try {
			await this._handleDelegationExit();
		} catch (e) {
			this.logService.error('Failed to handle delegation exit', e);
		}
	}

	private _shouldExitAfterDelegation(sourceAgent: Pick<IChatAgentData, 'id' | 'name'> | undefined, targetAgent: IChatAgentData | undefined): boolean {
		if (!targetAgent) {
			// Undefined behavior
			return false;
		}

		if (!this.configurationService.getValue<boolean>(ChatConfiguration.ExitAfterDelegation)) {
			return false;
		}

		// Never exit if the source and target are the same (that means that you're providing a follow up, etc.)
		// NOTE: sourceAgent would be the chatWidget's 'lockedAgent'
		if (sourceAgent && sourceAgent.id === targetAgent.id) {
			return false;
		}

		if (!isIChatViewViewContext(this.viewContext)) {
			return false;
		}

		const contribution = this.chatSessionsService.getChatSessionContribution(targetAgent.id);
		if (!contribution) {
			return false;
		}

		if (contribution.canDelegate !== true) {
			return false;
		}

		return true;
	}

	/**
	 * Handles the exit of the panel chat when a delegation to another session occurs.
	 * Waits for the response to complete and any pending confirmations to be resolved,
	 * then clears the widget unless the final message is an error.
	 */
	private async _handleDelegationExit(): Promise<void> {
		const viewModel = this.viewModel;
		if (!viewModel) {
			return;
		}

		const parentSessionResource = viewModel.sessionResource;

		// Check if response is complete, not pending confirmation, and has no error
		const checkIfShouldClear = (): boolean => {
			const items = viewModel.getItems();
			const lastItem = items[items.length - 1];
			if (lastItem && isResponseVM(lastItem) && lastItem.model && lastItem.isComplete && !lastItem.model.isPendingConfirmation.get()) {
				const hasError = Boolean(lastItem.result?.errorDetails);
				return !hasError;
			}
			return false;
		};

		if (checkIfShouldClear()) {
			await this.clear();
			this.archiveLocalParentSession(parentSessionResource);
			return;
		}

		const shouldClear = await new Promise<boolean>(resolve => {
			const disposable = viewModel.onDidChange(() => {
				const result = checkIfShouldClear();
				if (result) {
					cleanup();
					resolve(true);
				}
			});
			const timeout = setTimeout(() => {
				cleanup();
				resolve(false);
			}, 30_000); // 30 second timeout
			const cleanup = () => {
				clearTimeout(timeout);
				disposable.dispose();
			};
		});

		if (shouldClear) {
			await this.clear();
			this.archiveLocalParentSession(parentSessionResource);
		}
	}

	private async archiveLocalParentSession(sessionResource: URI): Promise<void> {
		if (sessionResource.scheme !== Schemas.vscodeLocalChatSession) {
			return;
		}

		// Implicitly keep parent session's changes as they've now been delegated to the new agent.
		await this.chatService.getSession(sessionResource)?.editingSession?.accept();

		const session = this.agentSessionsService.getSession(sessionResource);
		session?.setArchived(true);
	}

	setVisible(visible: boolean): void {
		const wasVisible = this._visible;
		this._visible = visible;
		this.visibleChangeCount++;
		this.renderer.setVisible(visible);
		this.input.setVisible(visible);

		if (visible) {
			if (!wasVisible) {
				this.visibilityTimeoutDisposable.value = disposableTimeout(() => {
					// Progressive rendering paused while hidden, so start it up again.
					// Do it after a timeout because the container is not visible yet (it should be but offsetHeight returns 0 here)
					if (this._visible) {
						this.onDidChangeItems(true);
					}
				}, 0);

				this._register(dom.scheduleAtNextAnimationFrame(dom.getWindow(this.listContainer), () => {
					this._onDidShow.fire();
				}));
			}
		} else if (wasVisible) {
			this._onDidHide.fire();
		}
	}

	private createList(listContainer: HTMLElement, options: IChatListItemRendererOptions): void {
		const scopedInstantiationService = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.contextKeyService])));
		const delegate = scopedInstantiationService.createInstance(ChatListDelegate, this.viewOptions.defaultElementHeight ?? 200);
		const rendererDelegate: IChatRendererDelegate = {
			getListLength: () => this.tree.getNode(null).visibleChildrenCount,
			onDidScroll: this.onDidScroll,
			container: listContainer,
			currentChatMode: () => this.input.currentModeKind,
		};

		// Create a dom element to hold UI from editor widgets embedded in chat messages
		const overflowWidgetsContainer = document.createElement('div');
		overflowWidgetsContainer.classList.add('chat-overflow-widget-container', 'monaco-editor');
		listContainer.append(overflowWidgetsContainer);

		this.renderer = this._register(scopedInstantiationService.createInstance(
			ChatListItemRenderer,
			this.editorOptions,
			options,
			rendererDelegate,
			this._codeBlockModelCollection,
			overflowWidgetsContainer,
			this.viewModel,
		));

		this._register(this.renderer.onDidClickRequest(async item => {
			this.clickedRequest(item);
		}));

		this._register(this.renderer.onDidRerender(item => {
			if (isRequestVM(item.currentElement) && this.configurationService.getValue<string>('chat.editRequests') !== 'input') {
				if (!item.rowContainer.contains(this.inputContainer)) {
					item.rowContainer.appendChild(this.inputContainer);
				}
				this.input.focus();
			}
		}));

		this._register(this.renderer.onDidDispose((item) => {
			this.focusedInputDOM.appendChild(this.inputContainer);
			this.input.focus();
		}));

		this._register(this.renderer.onDidFocusOutside(() => {
			this.finishedEditing();
		}));

		this._register(this.renderer.onDidClickFollowup(item => {
			// is this used anymore?
			this.acceptInput(item.message);
		}));
		this._register(this.renderer.onDidClickRerunWithAgentOrCommandDetection(e => {
			const request = this.chatService.getSession(e.sessionResource)?.getRequests().find(candidate => candidate.id === e.requestId);
			if (request) {
				const options: IChatSendRequestOptions = {
					noCommandDetection: true,
					attempt: request.attempt + 1,
					location: this.location,
					userSelectedModelId: this.input.currentLanguageModel,
					modeInfo: this.input.currentModeInfo,
				};
				this.chatService.resendRequest(request, options).catch(e => this.logService.error('FAILED to rerun request', e));
			}
		}));

		this.tree = this._register(scopedInstantiationService.createInstance(
			WorkbenchObjectTree<ChatTreeItem, FuzzyScore>,
			'Chat',
			listContainer,
			delegate,
			[this.renderer],
			{
				identityProvider: { getId: (e: ChatTreeItem) => e.id },
				horizontalScrolling: false,
				alwaysConsumeMouseWheel: false,
				supportDynamicHeights: true,
				hideTwistiesOfChildlessElements: true,
				accessibilityProvider: this.instantiationService.createInstance(ChatAccessibilityProvider),
				keyboardNavigationLabelProvider: { getKeyboardNavigationLabel: (e: ChatTreeItem) => isRequestVM(e) ? e.message : isResponseVM(e) ? e.response.value : '' }, // TODO
				setRowLineHeight: false,
				filter: this.viewOptions.filter ? { filter: this.viewOptions.filter.bind(this.viewOptions), } : undefined,
				scrollToActiveElement: true,
				overrideStyles: {
					listFocusBackground: this.styles.listBackground,
					listInactiveFocusBackground: this.styles.listBackground,
					listActiveSelectionBackground: this.styles.listBackground,
					listFocusAndSelectionBackground: this.styles.listBackground,
					listInactiveSelectionBackground: this.styles.listBackground,
					listHoverBackground: this.styles.listBackground,
					listBackground: this.styles.listBackground,
					listFocusForeground: this.styles.listForeground,
					listHoverForeground: this.styles.listForeground,
					listInactiveFocusForeground: this.styles.listForeground,
					listInactiveSelectionForeground: this.styles.listForeground,
					listActiveSelectionForeground: this.styles.listForeground,
					listFocusAndSelectionForeground: this.styles.listForeground,
					listActiveSelectionIconForeground: undefined,
					listInactiveSelectionIconForeground: undefined,
				}
			}));

		this._register(this.tree.onDidChangeFocus(() => {
			const focused = this.tree.getFocus();
			if (focused && focused.length > 0) {
				const focusedItem = focused[0];
				const items = this.tree.getNode(null).children;
				const idx = items.findIndex(i => i.element === focusedItem);
				if (idx !== -1) {
					this._mostRecentlyFocusedItemIndex = idx;
				}
			}
		}));
		this._register(this.tree.onContextMenu(e => this.onContextMenu(e)));

		this._register(this.tree.onDidChangeContentHeight(() => {
			this.onDidChangeTreeContentHeight();
		}));
		this._register(this.renderer.onDidChangeItemHeight(e => {
			if (this.tree.hasElement(e.element) && this.visible) {
				this.tree.updateElementHeight(e.element, e.height);
			}
		}));
		this._register(this.tree.onDidFocus(() => {
			this._onDidFocus.fire();
		}));
		this._register(this.tree.onDidScroll(() => {
			this._onDidScroll.fire();

			const isScrolledDown = this.tree.scrollTop >= this.tree.scrollHeight - this.tree.renderHeight - 2;
			this.container.classList.toggle('show-scroll-down', !isScrolledDown && !this.scrollLock);
		}));
	}

	startEditing(requestId: string): void {
		const editedRequest = this.renderer.getTemplateDataForRequestId(requestId);
		if (editedRequest) {
			this.clickedRequest(editedRequest);
		}
	}

	private clickedRequest(item: IChatListItemTemplate) {

		const currentElement = item.currentElement;
		if (isRequestVM(currentElement) && !this.viewModel?.editing) {

			const requests = this.viewModel?.model.getRequests();
			if (!requests || !this.viewModel?.sessionResource) {
				return;
			}

			// this will only ever be true if we restored a checkpoint
			if (this.viewModel?.model.checkpoint) {
				this.recentlyRestoredCheckpoint = true;
			}

			this.viewModel?.model.setCheckpoint(currentElement.id);

			// set contexts and request to false
			const currentContext: IChatRequestVariableEntry[] = [];
			for (let i = requests.length - 1; i >= 0; i -= 1) {
				const request = requests[i];
				if (request.id === currentElement.id) {
					request.shouldBeBlocked = false; // unblocking just this request.
					if (request.attachedContext) {
						const context = request.attachedContext.filter(entry => !isWorkspaceVariableEntry(entry) && (!(isPromptFileVariableEntry(entry) || isPromptTextVariableEntry(entry)) || !entry.automaticallyAdded));
						currentContext.push(...context);
					}
				}
			}

			// set states
			this.viewModel?.setEditing(currentElement);
			if (item?.contextKeyService) {
				ChatContextKeys.currentlyEditing.bindTo(item.contextKeyService).set(true);
			}

			const isInput = this.configurationService.getValue<string>('chat.editRequests') === 'input';
			this.inputPart?.setEditing(!!this.viewModel?.editing && isInput);

			if (!isInput) {
				const rowContainer = item.rowContainer;
				this.inputContainer = dom.$('.chat-edit-input-container');
				rowContainer.appendChild(this.inputContainer);
				this.createInput(this.inputContainer);
				this.input.setChatMode(this.inputPart.currentModeKind);
			} else {
				this.inputPart.element.classList.add('editing');
			}

			this.inputPart.toggleChatInputOverlay(!isInput);
			if (currentContext.length > 0) {
				this.input.attachmentModel.addContext(...currentContext);
			}


			// rerenders
			this.inputPart.dnd.setDisabledOverlay(!isInput);
			this.input.renderAttachedContext();
			this.input.setValue(currentElement.messageText, false);
			this.renderer.updateItemHeightOnRender(currentElement, item);
			this.onDidChangeItems();
			this.input.inputEditor.focus();

			this._register(this.inputPart.onDidClickOverlay(() => {
				if (this.viewModel?.editing && this.configurationService.getValue<string>('chat.editRequests') !== 'input') {
					this.finishedEditing();
				}
			}));

			// listeners
			if (!isInput) {
				this._register(this.inlineInputPart.inputEditor.onDidChangeModelContent(() => {
					this.scrollToCurrentItem(currentElement);
				}));

				this._register(this.inlineInputPart.inputEditor.onDidChangeCursorSelection((e) => {
					this.scrollToCurrentItem(currentElement);
				}));
			}
		}

		type StartRequestEvent = { editRequestType: string };

		type StartRequestEventClassification = {
			owner: 'justschen';
			comment: 'Event used to gain insights into when edits are being pressed.';
			editRequestType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Current entry point for editing a request.' };
		};

		this.telemetryService.publicLog2<StartRequestEvent, StartRequestEventClassification>('chat.startEditingRequests', {
			editRequestType: this.configurationService.getValue<string>('chat.editRequests'),
		});
	}

	finishedEditing(completedEdit?: boolean): void {
		// reset states
		const editedRequest = this.renderer.getTemplateDataForRequestId(this.viewModel?.editing?.id);
		if (this.recentlyRestoredCheckpoint) {
			this.recentlyRestoredCheckpoint = false;
		} else {
			this.viewModel?.model.setCheckpoint(undefined);
		}
		this.inputPart.dnd.setDisabledOverlay(false);
		if (editedRequest?.contextKeyService) {
			ChatContextKeys.currentlyEditing.bindTo(editedRequest.contextKeyService).set(false);
		}

		const isInput = this.configurationService.getValue<string>('chat.editRequests') === 'input';

		if (!isInput) {
			this.inputPart.setChatMode(this.input.currentModeKind);
			const currentModel = this.input.selectedLanguageModel;
			if (currentModel) {
				this.inputPart.switchModel(currentModel.metadata);
			}

			this.inputPart?.toggleChatInputOverlay(false);
			try {
				if (editedRequest?.rowContainer?.contains(this.inputContainer)) {
					editedRequest.rowContainer.removeChild(this.inputContainer);
				} else if (this.inputContainer.parentElement) {
					this.inputContainer.parentElement.removeChild(this.inputContainer);
				}
			} catch (e) {
				this.logService.error('Error occurred while finishing editing:', e);
			}
			this.inputContainer = dom.$('.empty-chat-state');

			// only dispose if we know the input is not the bottom input object.
			this.input.dispose();
		}

		if (isInput) {
			this.inputPart.element.classList.remove('editing');
		}
		this.viewModel?.setEditing(undefined);

		this.inputPart?.setEditing(!!this.viewModel?.editing && isInput);

		this.onDidChangeItems();
		if (editedRequest?.currentElement) {
			this.renderer.updateItemHeightOnRender(editedRequest.currentElement, editedRequest);
		}

		type CancelRequestEditEvent = {
			editRequestType: string;
			editCanceled: boolean;
		};

		type CancelRequestEventEditClassification = {
			owner: 'justschen';
			editRequestType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Current entry point for editing a request.' };
			editCanceled: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates whether the edit was canceled.' };
			comment: 'Event used to gain insights into when edits are being canceled.';
		};

		this.telemetryService.publicLog2<CancelRequestEditEvent, CancelRequestEventEditClassification>('chat.editRequestsFinished', {
			editRequestType: this.configurationService.getValue<string>('chat.editRequests'),
			editCanceled: !completedEdit
		});

		this.inputPart.focus();
	}

	private scrollToCurrentItem(currentElement: IChatRequestViewModel): void {
		if (this.viewModel?.editing && currentElement) {
			const element = currentElement;
			if (!this.tree.hasElement(element)) {
				return;
			}
			const relativeTop = this.tree.getRelativeTop(element);
			if (relativeTop === null || relativeTop < 0 || relativeTop > 1) {
				this.tree.reveal(element, 0);
			}
		}
	}

	private onContextMenu(e: ITreeContextMenuEvent<ChatTreeItem | null>): void {
		e.browserEvent.preventDefault();
		e.browserEvent.stopPropagation();

		const selected = e.element;

		// Check if the context menu was opened on a KaTeX element
		const target = e.browserEvent.target as HTMLElement;
		const isKatexElement = target.closest(`.${katexContainerClassName}`) !== null;

		const scopedContextKeyService = this.contextKeyService.createOverlay([
			[ChatContextKeys.responseIsFiltered.key, isResponseVM(selected) && !!selected.errorDetails?.responseIsFiltered],
			[ChatContextKeys.isKatexMathElement.key, isKatexElement]
		]);
		this.contextMenuService.showContextMenu({
			menuId: MenuId.ChatContext,
			menuActionOptions: { shouldForwardArgs: true },
			contextKeyService: scopedContextKeyService,
			getAnchor: () => e.anchor,
			getActionsContext: () => selected,
		});
	}

	private onDidChangeTreeContentHeight(): void {
		// If the list was previously scrolled all the way down, ensure it stays scrolled down, if scroll lock is on
		if (this.tree.scrollHeight !== this.previousTreeScrollHeight) {
			const lastItem = this.viewModel?.getItems().at(-1);
			const lastResponseIsRendering = isResponseVM(lastItem) && lastItem.renderData;
			if (!lastResponseIsRendering || this.scrollLock) {
				// Due to rounding, the scrollTop + renderHeight will not exactly match the scrollHeight.
				// Consider the tree to be scrolled all the way down if it is within 2px of the bottom.
				const lastElementWasVisible = this.tree.scrollTop + this.tree.renderHeight >= this.previousTreeScrollHeight - 2;
				if (lastElementWasVisible) {
					this._register(dom.scheduleAtNextAnimationFrame(dom.getWindow(this.listContainer), () => {
						// Can't set scrollTop during this event listener, the list might overwrite the change

						this.scrollToEnd();
					}, 0));
				}
			}
		}

		// TODO@roblourens add `show-scroll-down` class when button should show
		// Show the button when content height changes, the list is not fully scrolled down, and (the latest response is currently rendering OR I haven't yet scrolled all the way down since the last response)
		// So for example it would not reappear if I scroll up and delete a message

		this.previousTreeScrollHeight = this.tree.scrollHeight;
		this._onDidChangeContentHeight.fire();
	}

	private getWidgetViewKindTag(): string {
		if (!this.viewContext) {
			return 'editor';
		} else if (isIChatViewViewContext(this.viewContext)) {
			return 'view';
		} else {
			return 'quick';
		}
	}

	private createInput(container: HTMLElement, options?: { renderFollowups: boolean; renderStyle?: 'compact' | 'minimal'; renderInputToolbarBelowInput?: boolean }): void {
		const commonConfig: IChatInputPartOptions = {
			renderFollowups: options?.renderFollowups ?? true,
			renderStyle: options?.renderStyle === 'minimal' ? 'compact' : options?.renderStyle,
			renderInputToolbarBelowInput: options?.renderInputToolbarBelowInput ?? false,
			menus: {
				executeToolbar: MenuId.ChatExecute,
				telemetrySource: 'chatWidget',
				...this.viewOptions.menus
			},
			editorOverflowWidgetsDomNode: this.viewOptions.editorOverflowWidgetsDomNode,
			enableImplicitContext: this.viewOptions.enableImplicitContext,
			renderWorkingSet: this.viewOptions.enableWorkingSet === 'explicit',
			supportsChangingModes: this.viewOptions.supportsChangingModes,
			dndContainer: this.viewOptions.dndContainer,
			widgetViewKindTag: this.getWidgetViewKindTag(),
			defaultMode: this.viewOptions.defaultMode
		};

		if (this.viewModel?.editing) {
			const editedRequest = this.renderer.getTemplateDataForRequestId(this.viewModel?.editing?.id);
			const scopedInstantiationService = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, editedRequest?.contextKeyService])));
			this.inlineInputPartDisposable.value = scopedInstantiationService.createInstance(ChatInputPart,
				this.location,
				commonConfig,
				this.styles,
				true
			);
		} else {
			this.inputPartDisposable.value = this.instantiationService.createInstance(ChatInputPart,
				this.location,
				commonConfig,
				this.styles,
				false
			);
		}

		this.input.render(container, '', this);

		this._register(this.input.onDidLoadInputState(() => {
			this.refreshParsedInput();
		}));
		this._register(this.input.onDidFocus(() => this._onDidFocus.fire()));
		this._register(this.input.onDidAcceptFollowup(e => {
			if (!this.viewModel) {
				return;
			}

			let msg = '';
			if (e.followup.agentId && e.followup.agentId !== this.chatAgentService.getDefaultAgent(this.location, this.input.currentModeKind)?.id) {
				const agent = this.chatAgentService.getAgent(e.followup.agentId);
				if (!agent) {
					return;
				}

				this.lastSelectedAgent = agent;
				msg = `${chatAgentLeader}${agent.name} `;
				if (e.followup.subCommand) {
					msg += `${chatSubcommandLeader}${e.followup.subCommand} `;
				}
			} else if (!e.followup.agentId && e.followup.subCommand && this.chatSlashCommandService.hasCommand(e.followup.subCommand)) {
				msg = `${chatSubcommandLeader}${e.followup.subCommand} `;
			}

			msg += e.followup.message;
			this.acceptInput(msg);

			if (!e.response) {
				// Followups can be shown by the welcome message, then there is no response associated.
				// At some point we probably want telemetry for these too.
				return;
			}

			this.chatService.notifyUserAction({
				sessionResource: this.viewModel.sessionResource,
				requestId: e.response.requestId,
				agentId: e.response.agent?.id,
				command: e.response.slashCommand?.name,
				result: e.response.result,
				action: {
					kind: 'followUp',
					followup: e.followup
				},
			});
		}));
		this._register(this.input.onDidChangeHeight(() => {
			const editedRequest = this.renderer.getTemplateDataForRequestId(this.viewModel?.editing?.id);
			if (isRequestVM(editedRequest?.currentElement) && this.viewModel?.editing) {
				this.renderer.updateItemHeightOnRender(editedRequest?.currentElement, editedRequest);
			}

			if (this.bodyDimension) {
				this.layout(this.bodyDimension.height, this.bodyDimension.width);
			}

			this._onDidChangeContentHeight.fire();
		}));
		this._register(this.inputEditor.onDidChangeModelContent(() => {
			this.parsedChatRequest = undefined;
			this.updateChatInputContext();
		}));
		this._register(this.chatAgentService.onDidChangeAgents(() => {
			this.parsedChatRequest = undefined;
			// Tools agent loads -> welcome content changes
			this.renderWelcomeViewContentIfNeeded();
		}));
		this._register(this.input.onDidChangeCurrentChatMode(() => {
			this.renderWelcomeViewContentIfNeeded();
			this.refreshParsedInput();
			this.renderFollowups();
			this.renderChatSuggestNextWidget();
		}));

		this._register(autorun(r => {
			const toolSetIds = new Set<string>();
			const toolIds = new Set<string>();
			for (const [entry, enabled] of this.input.selectedToolsModel.entriesMap.read(r)) {
				if (enabled) {
					if (entry instanceof ToolSet) {
						toolSetIds.add(entry.id);
					} else {
						toolIds.add(entry.id);
					}
				}
			}
			const disabledTools = this.input.attachmentModel.attachments
				.filter(a => a.kind === 'tool' && !toolIds.has(a.id) || a.kind === 'toolset' && !toolSetIds.has(a.id))
				.map(a => a.id);

			this.input.attachmentModel.updateContext(disabledTools, Iterable.empty());
			this.refreshParsedInput();
		}));
	}

	private onDidStyleChange(): void {
		this.container.style.setProperty('--vscode-interactive-result-editor-background-color', this.editorOptions.configuration.resultEditor.backgroundColor?.toString() ?? '');
		this.container.style.setProperty('--vscode-interactive-session-foreground', this.editorOptions.configuration.foreground?.toString() ?? '');
		this.container.style.setProperty('--vscode-chat-list-background', this.themeService.getColorTheme().getColor(this.styles.listBackground)?.toString() ?? '');
	}


	setModel(model: IChatModel | undefined): void {
		if (!this.container) {
			throw new Error('Call render() before setModel()');
		}

		if (!model) {
			this.viewModel = undefined;
			this.onDidChangeItems();
			return;
		}

		if (isEqual(model.sessionResource, this.viewModel?.sessionResource)) {
			return;
		}
		this.inputPart.clearTodoListWidget(model.sessionResource, false);
		this.chatSuggestNextWidget.hide();

		this._codeBlockModelCollection.clear();

		this.container.setAttribute('data-session-id', model.sessionId);
		this.viewModel = this.instantiationService.createInstance(ChatViewModel, model, this._codeBlockModelCollection);

		// Pass input model reference to input part for state syncing
		this.inputPart.setInputModel(model.inputModel, model.getRequests().length === 0);

		if (this._lockedAgent) {
			let placeholder = this.chatSessionsService.getInputPlaceholderForSessionType(this._lockedAgent.id);
			if (!placeholder) {
				placeholder = localize('chat.input.placeholder.lockedToAgent', "Chat with {0}", this._lockedAgent.id);
			}
			this.viewModel.setInputPlaceholder(placeholder);
			this.inputEditor.updateOptions({ placeholder });
		} else if (this.viewModel.inputPlaceholder) {
			this.inputEditor.updateOptions({ placeholder: this.viewModel.inputPlaceholder });
		}

		const renderImmediately = this.configurationService.getValue<boolean>('chat.experimental.renderMarkdownImmediately');
		const delay = renderImmediately ? MicrotaskDelay : 0;
		this.viewModelDisposables.add(Event.runAndSubscribe(Event.accumulate(this.viewModel.onDidChange, delay), (events => {
			if (!this.viewModel || this._store.isDisposed) {
				// See https://github.com/microsoft/vscode/issues/278969
				return;
			}

			this.requestInProgress.set(this.viewModel.model.requestInProgress.get());

			// Update the editor's placeholder text when it changes in the view model
			if (events?.some(e => e?.kind === 'changePlaceholder')) {
				this.inputEditor.updateOptions({ placeholder: this.viewModel.inputPlaceholder });
			}

			this.onDidChangeItems();
			if (events?.some(e => e?.kind === 'addRequest') && this.visible) {
				this.scrollToEnd();
			}
		})));
		this.viewModelDisposables.add(autorun(reader => {
			this._editingSession.read(reader); // re-render when the session changes
			this.renderChatEditingSessionState();
		}));
		this.viewModelDisposables.add(this.viewModel.onDidDisposeModel(() => {
			// Ensure that view state is saved here, because we will load it again when a new model is assigned
			if (this.viewModel?.editing) {
				this.finishedEditing();
			}
			// Disposes the viewmodel and listeners
			this.viewModel = undefined;
			this.onDidChangeItems();
		}));
		this._sessionIsEmptyContextKey.set(model.getRequests().length === 0);

		this.refreshParsedInput();
		this.viewModelDisposables.add(model.onDidChange((e) => {
			if (e.kind === 'setAgent') {
				this._onDidChangeAgent.fire({ agent: e.agent, slashCommand: e.command });
				// Update capabilities context keys when agent changes
				this._updateAgentCapabilitiesContextKeys(e.agent);
			}
			if (e.kind === 'addRequest') {
				this.inputPart.clearTodoListWidget(this.viewModel?.sessionResource, false);
				this._sessionIsEmptyContextKey.set(false);
			}
			// Hide widget on request removal
			if (e.kind === 'removeRequest') {
				this.inputPart.clearTodoListWidget(this.viewModel?.sessionResource, true);
				this.chatSuggestNextWidget.hide();
				this._sessionIsEmptyContextKey.set((this.viewModel?.model.getRequests().length ?? 0) === 0);
			}
			// Show next steps widget when response completes (not when request starts)
			if (e.kind === 'completedRequest') {
				const lastRequest = this.viewModel?.model.getRequests().at(-1);
				const wasCancelled = lastRequest?.response?.isCanceled ?? false;
				if (wasCancelled) {
					// Clear todo list when request is cancelled
					this.inputPart.clearTodoListWidget(this.viewModel?.sessionResource, true);
				}
				// Only show if response wasn't canceled
				this.renderChatSuggestNextWidget();
			}
		}));

		if (this.tree && this.visible) {
			this.onDidChangeItems();
			this.scrollToEnd();
		}

		this.renderer.updateViewModel(this.viewModel);
		this.updateChatInputContext();
		this.input.renderChatTodoListWidget(this.viewModel.sessionResource);
	}

	getFocus(): ChatTreeItem | undefined {
		return this.tree.getFocus()[0] ?? undefined;
	}

	reveal(item: ChatTreeItem, relativeTop?: number): void {
		this.tree.reveal(item, relativeTop);
	}

	focus(item: ChatTreeItem): void {
		const items = this.tree.getNode(null).children;
		const node = items.find(i => i.element?.id === item.id);
		if (!node) {
			return;
		}

		this._mostRecentlyFocusedItemIndex = items.indexOf(node);
		this.tree.setFocus([node.element]);
		this.tree.domFocus();
	}

	setInputPlaceholder(placeholder: string): void {
		this.viewModel?.setInputPlaceholder(placeholder);
	}

	resetInputPlaceholder(): void {
		this.viewModel?.resetInputPlaceholder();
	}

	setInput(value = ''): void {
		this.input.setValue(value, false);
		this.refreshParsedInput();
	}

	getInput(): string {
		return this.input.inputEditor.getValue();
	}

	getContrib<T extends IChatWidgetContrib>(id: string): T | undefined {
		return this.contribs.find(c => c.id === id) as T | undefined;
	}

	// Coding agent locking methods
	lockToCodingAgent(name: string, displayName: string, agentId: string): void {
		this._lockedAgent = {
			id: agentId,
			name,
			prefix: `@${name} `,
			displayName
		};
		this._lockedToCodingAgentContextKey.set(true);
		this.renderWelcomeViewContentIfNeeded();
		// Update capabilities for the locked agent
		const agent = this.chatAgentService.getAgent(agentId);
		this._updateAgentCapabilitiesContextKeys(agent);
		this.renderer.updateOptions({ restorable: false, editable: false, noFooter: true, progressMessageAtBottomOfResponse: true });
		if (this.visible) {
			this.tree.rerender();
		}
	}

	unlockFromCodingAgent(): void {
		// Clear all state related to locking
		this._lockedAgent = undefined;
		this._lockedToCodingAgentContextKey.set(false);
		this._updateAgentCapabilitiesContextKeys(undefined);

		// Explicitly update the DOM to reflect unlocked state
		this.renderWelcomeViewContentIfNeeded();

		// Reset to default placeholder
		if (this.viewModel) {
			this.viewModel.resetInputPlaceholder();
		}
		this.inputEditor.updateOptions({ placeholder: undefined });
		this.renderer.updateOptions({ restorable: true, editable: true, noFooter: false, progressMessageAtBottomOfResponse: mode => mode !== ChatModeKind.Ask });
		if (this.visible) {
			this.tree.rerender();
		}
	}

	get isLockedToCodingAgent(): boolean {
		return !!this._lockedAgent;
	}

	get lockedAgentId(): string | undefined {
		return this._lockedAgent?.id;
	}

	logInputHistory(): void {
		this.input.logInputHistory();
	}

	async acceptInput(query?: string, options?: IChatAcceptInputOptions): Promise<IChatResponseModel | undefined> {
		return this._acceptInput(query ? { query } : undefined, options);
	}

	async rerunLastRequest(): Promise<void> {
		if (!this.viewModel) {
			return;
		}

		const sessionResource = this.viewModel.sessionResource;
		const lastRequest = this.chatService.getSession(sessionResource)?.getRequests().at(-1);
		if (!lastRequest) {
			return;
		}

		const options: IChatSendRequestOptions = {
			attempt: lastRequest.attempt + 1,
			location: this.location,
			userSelectedModelId: this.input.currentLanguageModel
		};
		return await this.chatService.resendRequest(lastRequest, options);
	}

	private async _applyPromptFileIfSet(requestInput: IChatRequestInputOptions): Promise<void> {
		// first check if the input has a prompt slash command
		const agentSlashPromptPart = this.parsedInput.parts.find((r): r is ChatRequestSlashPromptPart => r instanceof ChatRequestSlashPromptPart);
		if (!agentSlashPromptPart) {
			return;
		}

		// need to resolve the slash command to get the prompt file
		const slashCommand = await this.promptsService.resolvePromptSlashCommand(agentSlashPromptPart.name, CancellationToken.None);
		if (!slashCommand) {
			return;
		}
		const parseResult = slashCommand.parsedPromptFile;
		// add the prompt file to the context
		const refs = parseResult.body?.variableReferences.map(({ name, offset }) => ({ name, range: new OffsetRange(offset, offset + name.length + 1) })) ?? [];
		const toolReferences = this.toolsService.toToolReferences(refs);
		requestInput.attachedContext.insertFirst(toPromptFileVariableEntry(parseResult.uri, PromptFileVariableKind.PromptFile, undefined, true, toolReferences));

		// remove the slash command from the input
		requestInput.input = this.parsedInput.parts.filter(part => !(part instanceof ChatRequestSlashPromptPart)).map(part => part.text).join('').trim();

		const input = requestInput.input.trim();
		requestInput.input = `Follow instructions in [${basename(parseResult.uri)}](${parseResult.uri.toString()}).`;
		if (input) {
			// if the input is not empty, append it to the prompt
			requestInput.input += `\n${input}`;
		}
		if (parseResult.header) {
			await this._applyPromptMetadata(parseResult.header, requestInput);
		}
	}

	private async _acceptInput(query: { query: string } | undefined, options?: IChatAcceptInputOptions): Promise<IChatResponseModel | undefined> {
		if (this.viewModel?.model.requestInProgress.get()) {
			return;
		}

		if (!query && this.input.generating) {
			// if the user submits the input and generation finishes quickly, just submit it for them
			const generatingAutoSubmitWindow = 500;
			const start = Date.now();
			await this.input.generating;
			if (Date.now() - start > generatingAutoSubmitWindow) {
				return;
			}
		}

		while (!this._viewModel && !this._store.isDisposed) {
			await Event.toPromise(this.onDidChangeViewModel, this._store);
		}

		if (!this.viewModel) {
			return;
		}

		this._onDidAcceptInput.fire();
		this.scrollLock = this.isLockedToCodingAgent || !!checkModeOption(this.input.currentModeKind, this.viewOptions.autoScroll);

		const editorValue = this.getInput();
		const requestInputs: IChatRequestInputOptions = {
			input: !query ? editorValue : query.query,
			attachedContext: options?.enableImplicitContext === false ? this.input.getAttachedContext(this.viewModel.sessionResource) : this.input.getAttachedAndImplicitContext(this.viewModel.sessionResource),
		};

		const isUserQuery = !query;

		if (this.viewModel?.editing) {
			this.finishedEditing(true);
			this.viewModel.model?.setCheckpoint(undefined);
		}

		// process the prompt command
		await this._applyPromptFileIfSet(requestInputs);
		await this._autoAttachInstructions(requestInputs);

		if (this.viewOptions.enableWorkingSet !== undefined && this.input.currentModeKind === ChatModeKind.Edit && !this.chatService.edits2Enabled) {
			const uniqueWorkingSetEntries = new ResourceSet(); // NOTE: this is used for bookkeeping so the UI can avoid rendering references in the UI that are already shown in the working set
			const editingSessionAttachedContext: ChatRequestVariableSet = requestInputs.attachedContext;

			// Collect file variables from previous requests before sending the request
			const previousRequests = this.viewModel.model.getRequests();
			for (const request of previousRequests) {
				for (const variable of request.variableData.variables) {
					if (URI.isUri(variable.value) && variable.kind === 'file') {
						const uri = variable.value;
						if (!uniqueWorkingSetEntries.has(uri)) {
							editingSessionAttachedContext.add(variable);
							uniqueWorkingSetEntries.add(variable.value);
						}
					}
				}
			}
			requestInputs.attachedContext = editingSessionAttachedContext;

			type ChatEditingWorkingSetClassification = {
				owner: 'joyceerhl';
				comment: 'Information about the working set size in a chat editing request';
				originalSize: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of files that the user tried to attach in their editing request.' };
				actualSize: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of files that were actually sent in their editing request.' };
			};
			type ChatEditingWorkingSetEvent = {
				originalSize: number;
				actualSize: number;
			};
			this.telemetryService.publicLog2<ChatEditingWorkingSetEvent, ChatEditingWorkingSetClassification>('chatEditing/workingSetSize', { originalSize: uniqueWorkingSetEntries.size, actualSize: uniqueWorkingSetEntries.size });
		}
		this.chatService.cancelCurrentRequestForSession(this.viewModel.sessionResource);
		if (this.currentRequest) {
			// We have to wait the current request to be properly cancelled so that it has a chance to update the model with its result metadata.
			// This is awkward, it's basically a limitation of the chat provider-based agent.
			await Promise.race([this.currentRequest, timeout(1000)]);
		}

		this.input.validateAgentMode();

		if (this.viewModel.model.checkpoint) {
			const requests = this.viewModel.model.getRequests();
			for (let i = requests.length - 1; i >= 0; i -= 1) {
				const request = requests[i];
				if (request.shouldBeBlocked) {
					this.chatService.removeRequest(this.viewModel.sessionResource, request.id);
				}
			}
		}
		if (this.viewModel.sessionResource) {
			this.chatAccessibilityService.acceptRequest(this._viewModel!.sessionResource);
		}

		const result = await this.chatService.sendRequest(this.viewModel.sessionResource, requestInputs.input, {
			userSelectedModelId: this.input.currentLanguageModel,
			location: this.location,
			locationData: this._location.resolveData?.(),
			parserContext: { selectedAgent: this._lastSelectedAgent, mode: this.input.currentModeKind },
			attachedContext: requestInputs.attachedContext.asArray(),
			noCommandDetection: options?.noCommandDetection,
			...this.getModeRequestOptions(),
			modeInfo: this.input.currentModeInfo,
			agentIdSilent: this._lockedAgent?.id,
		});

		if (!result) {
			this.chatAccessibilityService.disposeRequest(this.viewModel.sessionResource);
			return;
		}

		// visibility sync before we accept input to hide the welcome view
		this.updateChatViewVisibility();

		this.input.acceptInput(options?.storeToHistory ?? isUserQuery);
		this._onDidSubmitAgent.fire({ agent: result.agent, slashCommand: result.slashCommand });
		this.handleDelegationExitIfNeeded(this._lockedAgent, result.agent);
		this.currentRequest = result.responseCompletePromise.then(() => {
			const responses = this.viewModel?.getItems().filter(isResponseVM);
			const lastResponse = responses?.[responses.length - 1];
			this.chatAccessibilityService.acceptResponse(this, this.container, lastResponse, this.viewModel?.sessionResource, options?.isVoiceInput);
			if (lastResponse?.result?.nextQuestion) {
				const { prompt, participant, command } = lastResponse.result.nextQuestion;
				const question = formatChatQuestion(this.chatAgentService, this.location, prompt, participant, command);
				if (question) {
					this.input.setValue(question, false);
				}
			}
			this.currentRequest = undefined;
		});

		return result.responseCreatedPromise;
	}

	getModeRequestOptions(): Partial<IChatSendRequestOptions> {
		return {
			modeInfo: this.input.currentModeInfo,
			userSelectedTools: this.input.selectedToolsModel.userSelectedTools,
		};
	}

	getCodeBlockInfosForResponse(response: IChatResponseViewModel): IChatCodeBlockInfo[] {
		return this.renderer.getCodeBlockInfosForResponse(response);
	}

	getCodeBlockInfoForEditor(uri: URI): IChatCodeBlockInfo | undefined {
		return this.renderer.getCodeBlockInfoForEditor(uri);
	}

	getFileTreeInfosForResponse(response: IChatResponseViewModel): IChatFileTreeInfo[] {
		return this.renderer.getFileTreeInfosForResponse(response);
	}

	getLastFocusedFileTreeForResponse(response: IChatResponseViewModel): IChatFileTreeInfo | undefined {
		return this.renderer.getLastFocusedFileTreeForResponse(response);
	}

	focusResponseItem(lastFocused?: boolean): void {
		if (!this.viewModel) {
			return;
		}
		const items = this.tree.getNode(null).children;
		let item;
		if (lastFocused) {
			item = items[this._mostRecentlyFocusedItemIndex] ?? items[items.length - 1];
		} else {
			item = items[items.length - 1];
		}
		if (!item) {
			return;
		}

		this.tree.setFocus([item.element]);
		this.tree.domFocus();
	}

	layout(height: number, width: number): void {
		width = Math.min(width, this.viewOptions.renderStyle === 'minimal' ? width : 950); // no min width of inline chat

		const heightUpdated = this.bodyDimension && this.bodyDimension.height !== height;
		this.bodyDimension = new dom.Dimension(width, height);

		const layoutHeight = this._dynamicMessageLayoutData?.enabled ? this._dynamicMessageLayoutData.maxHeight : height;
		if (this.viewModel?.editing) {
			this.inlineInputPart?.layout(layoutHeight, width);
		}

		this.inputPart.layout(layoutHeight, width);

		const inputHeight = this.inputPart.inputPartHeight;
		const chatSuggestNextWidgetHeight = this.chatSuggestNextWidget.height;
		const lastElementVisible = this.tree.scrollTop + this.tree.renderHeight >= this.tree.scrollHeight - 2;
		const lastItem = this.viewModel?.getItems().at(-1);

		const contentHeight = Math.max(0, height - inputHeight - chatSuggestNextWidgetHeight);
		if (this.viewOptions.renderStyle === 'compact' || this.viewOptions.renderStyle === 'minimal') {
			this.listContainer.style.removeProperty('--chat-current-response-min-height');
		} else {
			this.listContainer.style.setProperty('--chat-current-response-min-height', contentHeight * .75 + 'px');
			if (heightUpdated && lastItem && this.visible && this.tree.hasElement(lastItem)) {
				this.tree.updateElementHeight(lastItem, undefined);
			}
		}
		this.tree.layout(contentHeight, width);

		this.welcomeMessageContainer.style.height = `${contentHeight}px`;

		this.renderer.layout(width);

		const lastResponseIsRendering = isResponseVM(lastItem) && lastItem.renderData;
		if (lastElementVisible && (!lastResponseIsRendering || checkModeOption(this.input.currentModeKind, this.viewOptions.autoScroll))) {
			this.scrollToEnd();
		}
		this.listContainer.style.height = `${contentHeight}px`;

		this._onDidChangeHeight.fire(height);
	}

	private _dynamicMessageLayoutData?: { numOfMessages: number; maxHeight: number; enabled: boolean };

	// An alternative to layout, this allows you to specify the number of ChatTreeItems
	// you want to show, and the max height of the container. It will then layout the
	// tree to show that many items.
	// TODO@TylerLeonhardt: This could use some refactoring to make it clear which layout strategy is being used
	setDynamicChatTreeItemLayout(numOfChatTreeItems: number, maxHeight: number) {
		this._dynamicMessageLayoutData = { numOfMessages: numOfChatTreeItems, maxHeight, enabled: true };
		this._register(this.renderer.onDidChangeItemHeight(() => this.layoutDynamicChatTreeItemMode()));

		const mutableDisposable = this._register(new MutableDisposable());
		this._register(this.tree.onDidScroll((e) => {
			// TODO@TylerLeonhardt this should probably just be disposed when this is disabled
			// and then set up again when it is enabled again
			if (!this._dynamicMessageLayoutData?.enabled) {
				return;
			}
			mutableDisposable.value = dom.scheduleAtNextAnimationFrame(dom.getWindow(this.listContainer), () => {
				if (!e.scrollTopChanged || e.heightChanged || e.scrollHeightChanged) {
					return;
				}
				const renderHeight = e.height;
				const diff = e.scrollHeight - renderHeight - e.scrollTop;
				if (diff === 0) {
					return;
				}

				const possibleMaxHeight = (this._dynamicMessageLayoutData?.maxHeight ?? maxHeight);
				const width = this.bodyDimension?.width ?? this.container.offsetWidth;
				this.input.layout(possibleMaxHeight, width);
				const inputPartHeight = this.input.inputPartHeight;
				const chatSuggestNextWidgetHeight = this.chatSuggestNextWidget.height;
				const newHeight = Math.min(renderHeight + diff, possibleMaxHeight - inputPartHeight - chatSuggestNextWidgetHeight);
				this.layout(newHeight + inputPartHeight + chatSuggestNextWidgetHeight, width);
			});
		}));
	}

	updateDynamicChatTreeItemLayout(numOfChatTreeItems: number, maxHeight: number) {
		this._dynamicMessageLayoutData = { numOfMessages: numOfChatTreeItems, maxHeight, enabled: true };
		let hasChanged = false;
		let height = this.bodyDimension!.height;
		let width = this.bodyDimension!.width;
		if (maxHeight < this.bodyDimension!.height) {
			height = maxHeight;
			hasChanged = true;
		}
		const containerWidth = this.container.offsetWidth;
		if (this.bodyDimension?.width !== containerWidth) {
			width = containerWidth;
			hasChanged = true;
		}
		if (hasChanged) {
			this.layout(height, width);
		}
	}

	get isDynamicChatTreeItemLayoutEnabled(): boolean {
		return this._dynamicMessageLayoutData?.enabled ?? false;
	}

	set isDynamicChatTreeItemLayoutEnabled(value: boolean) {
		if (!this._dynamicMessageLayoutData) {
			return;
		}
		this._dynamicMessageLayoutData.enabled = value;
	}

	layoutDynamicChatTreeItemMode(): void {
		if (!this.viewModel || !this._dynamicMessageLayoutData?.enabled) {
			return;
		}

		const width = this.bodyDimension?.width ?? this.container.offsetWidth;
		this.input.layout(this._dynamicMessageLayoutData.maxHeight, width);
		const inputHeight = this.input.inputPartHeight;
		const chatSuggestNextWidgetHeight = this.chatSuggestNextWidget.height;

		const totalMessages = this.viewModel.getItems();
		// grab the last N messages
		const messages = totalMessages.slice(-this._dynamicMessageLayoutData.numOfMessages);

		const needsRerender = messages.some(m => m.currentRenderedHeight === undefined);
		const listHeight = needsRerender
			? this._dynamicMessageLayoutData.maxHeight
			: messages.reduce((acc, message) => acc + message.currentRenderedHeight!, 0);

		this.layout(
			Math.min(
				// we add an additional 18px in order to show that there is scrollable content
				inputHeight + chatSuggestNextWidgetHeight + listHeight + (totalMessages.length > 2 ? 18 : 0),
				this._dynamicMessageLayoutData.maxHeight
			),
			width
		);

		if (needsRerender || !listHeight) {
			this.scrollToEnd();
		}
	}

	saveState(): void {
		// no-op
	}

	getViewState(): IChatModelInputState | undefined {
		return this.input.getCurrentInputState();
	}

	private updateChatInputContext() {
		const currentAgent = this.parsedInput.parts.find(part => part instanceof ChatRequestAgentPart);
		this.agentInInput.set(!!currentAgent);
	}

	private async _switchToAgentByName(agentName: string): Promise<void> {
		const currentAgent = this.input.currentModeObs.get();

		// switch to appropriate agent if needed
		if (agentName !== currentAgent.name.get()) {
			// Find the mode object to get its kind
			const agent = this.chatModeService.findModeByName(agentName);
			if (agent) {
				if (currentAgent.kind !== agent.kind) {
					const chatModeCheck = await this.instantiationService.invokeFunction(handleModeSwitch, currentAgent.kind, agent.kind, this.viewModel?.model.getRequests().length ?? 0, this.viewModel?.model);
					if (!chatModeCheck) {
						return;
					}

					if (chatModeCheck.needToClearSession) {
						await this.clear();
					}
				}
				this.input.setChatMode(agent.id);
			}
		}
	}

	private async _applyPromptMetadata({ agent, tools, model }: PromptHeader, requestInput: IChatRequestInputOptions): Promise<void> {

		if (tools !== undefined && !agent && this.input.currentModeKind !== ChatModeKind.Agent) {
			agent = ChatMode.Agent.name.get();
		}
		// switch to appropriate agent if needed
		if (agent) {
			this._switchToAgentByName(agent);
		}

		// if not tools to enable are present, we are done
		if (tools !== undefined && this.input.currentModeKind === ChatModeKind.Agent) {
			const enablementMap = this.toolsService.toToolAndToolSetEnablementMap(tools, Target.VSCode);
			this.input.selectedToolsModel.set(enablementMap, true);
		}

		if (model !== undefined) {
			this.input.switchModelByQualifiedName(model);
		}
	}

	/**
	 * Adds additional instructions to the context
	 * - instructions that have a 'applyTo' pattern that matches the current input
	 * - instructions referenced in the copilot settings 'copilot-instructions'
	 * - instructions referenced in an already included instruction file
	 */
	private async _autoAttachInstructions({ attachedContext }: IChatRequestInputOptions): Promise<void> {
		this.logService.debug(`ChatWidget#_autoAttachInstructions: prompt files are always enabled`);
		const enabledTools = this.input.currentModeKind === ChatModeKind.Agent ? this.input.selectedToolsModel.entriesMap.get() : undefined;

		const computer = this.instantiationService.createInstance(ComputeAutomaticInstructions, enabledTools);
		await computer.collect(attachedContext, CancellationToken.None);
	}

	delegateScrollFromMouseWheelEvent(browserEvent: IMouseWheelEvent): void {
		this.tree.delegateScrollFromMouseWheelEvent(browserEvent);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatWidgetService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatWidgetService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { raceCancellablePromises, timeout } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { combinedDisposable, Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';
import { ACTIVE_GROUP, IEditorService, type PreferredGroup } from '../../../../workbench/services/editor/common/editorService.js';
import { IEditorGroup, IEditorGroupsService, isEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IChatService } from '../common/chatService.js';
import { ChatAgentLocation } from '../common/constants.js';
import { ChatViewId, ChatViewPaneTarget, IChatWidget, IChatWidgetService, IQuickChatService, isIChatViewViewContext } from './chat.js';
import { ChatEditor, IChatEditorOptions } from './chatEditor.js';
import { ChatEditorInput } from './chatEditorInput.js';
import { ChatViewPane } from './chatViewPane.js';

export class ChatWidgetService extends Disposable implements IChatWidgetService {

	declare readonly _serviceBrand: undefined;

	private _widgets: IChatWidget[] = [];
	private _lastFocusedWidget: IChatWidget | undefined = undefined;

	private readonly _onDidAddWidget = this._register(new Emitter<IChatWidget>());
	readonly onDidAddWidget = this._onDidAddWidget.event;

	private readonly _onDidBackgroundSession = this._register(new Emitter<URI>());
	readonly onDidBackgroundSession = this._onDidBackgroundSession.event;

	constructor(
		@IEditorGroupsService private readonly editorGroupsService: IEditorGroupsService,
		@IViewsService private readonly viewsService: IViewsService,
		@IQuickChatService private readonly quickChatService: IQuickChatService,
		@ILayoutService private readonly layoutService: ILayoutService,
		@IEditorService private readonly editorService: IEditorService,
		@IChatService private readonly chatService: IChatService,
	) {
		super();
	}

	get lastFocusedWidget(): IChatWidget | undefined {
		return this._lastFocusedWidget;
	}

	getAllWidgets(): ReadonlyArray<IChatWidget> {
		return this._widgets;
	}

	getWidgetsByLocations(location: ChatAgentLocation): ReadonlyArray<IChatWidget> {
		return this._widgets.filter(w => w.location === location);
	}

	getWidgetByInputUri(uri: URI): IChatWidget | undefined {
		return this._widgets.find(w => isEqual(w.input.inputUri, uri));
	}

	getWidgetBySessionResource(sessionResource: URI): IChatWidget | undefined {
		return this._widgets.find(w => isEqual(w.viewModel?.sessionResource, sessionResource));
	}

	async revealWidget(preserveFocus?: boolean): Promise<IChatWidget | undefined> {
		const last = this.lastFocusedWidget;
		if (last && await this.reveal(last, preserveFocus)) {
			return last;
		}

		return (await this.viewsService.openView<ChatViewPane>(ChatViewId, !preserveFocus))?.widget;
	}

	async reveal(widget: IChatWidget, preserveFocus?: boolean): Promise<boolean> {
		if (widget.viewModel?.sessionResource) {
			const alreadyOpenWidget = await this.revealSessionIfAlreadyOpen(widget.viewModel.sessionResource, { preserveFocus });
			if (alreadyOpenWidget) {
				return true;
			}
		}

		if (isIChatViewViewContext(widget.viewContext)) {
			const view = await this.viewsService.openView(widget.viewContext.viewId, !preserveFocus);
			if (!preserveFocus) {
				view?.focus();
			}
			return !!view;
		}

		return false;
	}

	/**
	 * Reveal the session if already open, otherwise open it.
	 */
	openSession(sessionResource: URI, target?: typeof ChatViewPaneTarget): Promise<IChatWidget | undefined>;
	openSession(sessionResource: URI, target?: PreferredGroup, options?: IChatEditorOptions): Promise<IChatWidget | undefined>;
	async openSession(sessionResource: URI, target?: typeof ChatViewPaneTarget | PreferredGroup, options?: IChatEditorOptions): Promise<IChatWidget | undefined> {
		// Reveal if already open unless instructed otherwise
		if (typeof target === 'undefined' || options?.revealIfOpened) {
			const alreadyOpenWidget = await this.revealSessionIfAlreadyOpen(sessionResource, options);
			if (alreadyOpenWidget) {
				return alreadyOpenWidget;
			}
		} else {
			await this.prepareSessionForMove(sessionResource, target);
		}

		// Load this session in chat view
		if (target === ChatViewPaneTarget) {
			const chatView = await this.viewsService.openView<ChatViewPane>(ChatViewId, !options?.preserveFocus);
			if (chatView) {
				await chatView.loadSession(sessionResource);
				if (!options?.preserveFocus) {
					chatView.focusInput();
				}
			}
			return chatView?.widget;
		}

		// Open in chat editor
		const pane = await this.editorService.openEditor({
			resource: sessionResource,
			options: {
				...options,
				revealIfOpened: options?.revealIfOpened ?? true // always try to reveal if already opened unless explicitly told not to
			}
		}, target);
		return pane instanceof ChatEditor ? pane.widget : undefined;
	}

	private async revealSessionIfAlreadyOpen(sessionResource: URI, options?: IChatEditorOptions): Promise<IChatWidget | undefined> {
		// Already open in chat view?
		const chatView = this.viewsService.getViewWithId<ChatViewPane>(ChatViewId);
		if (chatView?.widget.viewModel?.sessionResource && isEqual(chatView.widget.viewModel.sessionResource, sessionResource)) {
			const view = await this.viewsService.openView(ChatViewId, !options?.preserveFocus);
			if (!options?.preserveFocus) {
				view?.focus();
			}
			return chatView.widget;
		}

		// Already open in an editor?
		const existingEditor = this.findExistingChatEditorByUri(sessionResource);
		if (existingEditor) {
			const existingEditorWindowId = existingEditor.group.windowId;

			// focus transfer to other documents is async. If we depend on the focus
			// being synchronously transferred in consuming code, this can fail, so
			// wait for it to propagate
			const isGroupActive = () => dom.getWindow(this.layoutService.activeContainer).vscodeWindowId === existingEditorWindowId;

			let ensureFocusTransfer: Promise<void> | undefined;
			if (!isGroupActive()) {
				ensureFocusTransfer = raceCancellablePromises([
					timeout(500),
					Event.toPromise(Event.once(Event.filter(this.layoutService.onDidChangeActiveContainer, isGroupActive))),
				]);
			}

			const pane = await existingEditor.group.openEditor(existingEditor.editor, options);
			await ensureFocusTransfer;
			return pane instanceof ChatEditor ? pane.widget : undefined;
		}

		// Already open in quick chat?
		if (isEqual(sessionResource, this.quickChatService.sessionResource)) {
			this.quickChatService.focus();
			return undefined;
		}

		return undefined;
	}

	private async prepareSessionForMove(sessionResource: URI, target: typeof ChatViewPaneTarget | PreferredGroup | undefined): Promise<void> {
		const existingWidget = this.getWidgetBySessionResource(sessionResource);
		if (existingWidget) {
			const existingEditor = isIChatViewViewContext(existingWidget.viewContext) ?
				undefined :
				this.findExistingChatEditorByUri(sessionResource);

			if (isIChatViewViewContext(existingWidget.viewContext) && target === ChatViewPaneTarget) {
				return;
			}

			if (!isIChatViewViewContext(existingWidget.viewContext) && target !== ChatViewPaneTarget && existingEditor && this.isSameEditorTarget(existingEditor.group.id, target)) {
				return;
			}

			if (existingEditor) {
				// widget.clear() on an editor leaves behind an empty chat editor
				await this.editorService.closeEditor({ editor: existingEditor.editor, groupId: existingEditor.group.id }, { preserveFocus: true });
			} else {
				await existingWidget.clear();
			}
		}
	}

	private findExistingChatEditorByUri(sessionUri: URI): { editor: ChatEditorInput; group: IEditorGroup } | undefined {
		for (const group of this.editorGroupsService.groups) {
			for (const editor of group.editors) {
				if (editor instanceof ChatEditorInput && isEqual(editor.sessionResource, sessionUri)) {
					return { editor, group };
				}
			}
		}
		return undefined;
	}

	private isSameEditorTarget(currentGroupId: number, target?: PreferredGroup): boolean {
		return typeof target === 'number' && target === currentGroupId ||
			target === ACTIVE_GROUP && this.editorGroupsService.activeGroup?.id === currentGroupId ||
			isEditorGroup(target) && target.id === currentGroupId;
	}

	private setLastFocusedWidget(widget: IChatWidget | undefined): void {
		if (widget === this._lastFocusedWidget) {
			return;
		}

		this._lastFocusedWidget = widget;
	}

	register(newWidget: IChatWidget): IDisposable {
		if (this._widgets.some(widget => widget === newWidget)) {
			throw new Error('Cannot register the same widget multiple times');
		}

		this._widgets.push(newWidget);
		this._onDidAddWidget.fire(newWidget);

		return combinedDisposable(
			newWidget.onDidFocus(() => this.setLastFocusedWidget(newWidget)),
			newWidget.onDidChangeViewModel(({ previousSessionResource, currentSessionResource }) => {
				if (!previousSessionResource || (currentSessionResource && isEqual(previousSessionResource, currentSessionResource))) {
					return;
				}

				// Timeout to ensure it wasn't just moving somewhere else
				void timeout(200).then(() => {
					if (!this.getWidgetBySessionResource(previousSessionResource) && this.chatService.getSession(previousSessionResource)) {
						this._onDidBackgroundSession.fire(previousSessionResource);
					}
				});
			}),
			toDisposable(() => this._widgets.splice(this._widgets.indexOf(newWidget), 1))
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatWindowNotifier.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatWindowNotifier.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable, DisposableResourceMap, DisposableStore } from '../../../../base/common/lifecycle.js';
import { autorunDelta, autorunIterableDelta } from '../../../../base/common/observable.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { FocusMode } from '../../../../platform/native/common/native.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IChatModel, IChatRequestNeedsInputInfo } from '../common/chatModel.js';
import { IChatService } from '../common/chatService.js';
import { IChatWidgetService } from './chat.js';

/**
 * Observes all live chat models and triggers OS notifications when any model
 * transitions to needing input (confirmation/elicitation).
 */
export class ChatWindowNotifier extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.chatWindowNotifier';

	private readonly _activeNotifications = this._register(new DisposableResourceMap());

	constructor(
		@IChatService private readonly _chatService: IChatService,
		@IChatWidgetService private readonly _chatWidgetService: IChatWidgetService,
		@IHostService private readonly _hostService: IHostService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();

		const modelTrackers = this._register(new DisposableResourceMap());

		this._register(autorunIterableDelta(
			reader => this._chatService.chatModels.read(reader),
			({ addedValues, removedValues }) => {
				for (const model of addedValues) {
					modelTrackers.set(model.sessionResource, this._trackModel(model));
				}
				for (const model of removedValues) {
					modelTrackers.deleteAndDispose(model.sessionResource);
				}
			}
		));
	}

	private _trackModel(model: IChatModel) {
		return autorunDelta(model.requestNeedsInput, ({ lastValue, newValue }) => {
			const currentNeedsInput = !!newValue;
			const previousNeedsInput = !!lastValue;

			// Only notify on transition from false -> true
			if (!previousNeedsInput && currentNeedsInput && newValue) {
				this._notifyIfNeeded(model.sessionResource, newValue);
			} else if (previousNeedsInput && !currentNeedsInput) {
				// Clear any active notification for this session when input is no longer needed
				this._clearNotification(model.sessionResource);
			}
		});
	}

	private async _notifyIfNeeded(sessionResource: URI, info: IChatRequestNeedsInputInfo): Promise<void> {
		// Check configuration
		if (!this._configurationService.getValue<boolean>('chat.notifyWindowOnConfirmation')) {
			return;
		}

		// Find the widget to determine the target window
		const widget = this._chatWidgetService.getWidgetBySessionResource(sessionResource);
		const targetWindow = widget ? dom.getWindow(widget.domNode) : mainWindow;

		// Only notify if window doesn't have focus
		if (targetWindow.document.hasFocus()) {
			return;
		}

		// Clear any existing notification for this session
		this._clearNotification(sessionResource);

		// Focus window in notify mode (flash taskbar/dock)
		await this._hostService.focus(targetWindow, { mode: FocusMode.Notify });

		// Create OS notification
		const notificationTitle = info.title ? localize('chatTitle', "Chat: {0}", info.title) : localize('chat.untitledChat', "Untitled Chat");
		const notification = await dom.triggerNotification(notificationTitle, {
			detail: info.detail ?? localize('notificationDetail', "Approval needed to continue.")
		});

		if (notification) {
			const disposables = new DisposableStore();

			this._activeNotifications.set(sessionResource, disposables);

			disposables.add(notification);

			// Handle notification click - focus window and reveal chat
			disposables.add(Event.once(notification.onClick)(async () => {
				await this._hostService.focus(targetWindow, { mode: FocusMode.Force });

				const widget = await this._chatWidgetService.openSession(sessionResource);
				widget?.focusInput();

				this._clearNotification(sessionResource);
			}));

			// Clear notification when window gains focus
			disposables.add(this._hostService.onDidChangeFocus(focus => {
				if (focus) {
					this._clearNotification(sessionResource);
				}
			}));
		}
	}

	private _clearNotification(sessionResource: URI): void {
		this._activeNotifications.deleteAndDispose(sessionResource);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/codeBlockContextProviderService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/codeBlockContextProviderService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeBlockActionContextProvider, IChatCodeBlockContextProviderService } from './chat.js';

export class ChatCodeBlockContextProviderService implements IChatCodeBlockContextProviderService {
	declare _serviceBrand: undefined;
	private readonly _providers = new Map<string, ICodeBlockActionContextProvider>();

	get providers(): ICodeBlockActionContextProvider[] {
		return [...this._providers.values()];
	}
	registerProvider(provider: ICodeBlockActionContextProvider, id: string): IDisposable {
		this._providers.set(id, provider);
		return toDisposable(() => this._providers.delete(id));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/codeBlockPart.css]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/codeBlockPart.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


.interactive-result-code-block {
	position: relative;
}

.interactive-result-code-block .interactive-result-code-block-toolbar {
	opacity: 0;
	pointer-events: none;
}

.interactive-result-code-block .interactive-result-code-block-toolbar > .monaco-action-bar,
.interactive-result-code-block .interactive-result-code-block-toolbar > .monaco-toolbar {
	position: absolute;
	top: -15px;
	height: 26px;
	line-height: 26px;
	background-color: var(--vscode-interactive-result-editor-background-color, var(--vscode-editor-background));
	border: 1px solid var(--vscode-chat-requestBorder);
	z-index: 100;
	max-width: 70%;
	text-overflow: ellipsis;
	overflow: hidden;
}

.interactive-result-code-block .interactive-result-code-block-toolbar > .monaco-action-bar {
	left: 0px
}

.interactive-result-code-block .interactive-result-code-block-toolbar > .monaco-toolbar {
	border-radius: 3px;
	right: 10px;
}

.interactive-result-code-block .monaco-toolbar .action-item {
	height: 24px;
	width: 24px;
	margin: 1px 2px;
}

.interactive-result-code-block .monaco-toolbar .action-item .codicon {
	margin: 1px;
}

.interactive-result-code-block:hover .interactive-result-code-block-toolbar,
.interactive-result-code-block .interactive-result-code-block-toolbar:focus-within,
.interactive-result-code-block.focused .interactive-result-code-block-toolbar {
	opacity: 1;
	border-radius: 2px;
	pointer-events: auto;
}

.interactive-result-code-block .interactive-result-code-block-toolbar.force-visibility {
	opacity: 1 !important;
	pointer-events: auto !important;
}

.interactive-item-container .value .rendered-markdown [data-code] {
	margin: 0 0 16px 0;
}

.interactive-session .interactive-request .interactive-result-code-block {
	border: 1px solid var(--vscode-chat-requestCodeBorder);
}

.interactive-session .interactive-response .interactive-result-code-block {
	border: 1px solid var(--vscode-input-border, transparent);
	background-color: var(--vscode-interactive-result-editor-background-color);
}

.interactive-result-code-block:has(.monaco-editor.focused) {
	border-color: var(--vscode-focusBorder, transparent);
}

.interactive-result-code-block,
.interactive-result-code-block .monaco-editor,
.interactive-result-code-block .monaco-editor .overflow-guard {
	border-radius: 4px;
}

.interactive-result-code-block .interactive-result-vulns {
	font-size: 0.9em;
	padding: 0px 8px 2px 8px;
}

.interactive-result-code-block .interactive-result-vulns-header {
	display: flex;
	height: 22px;
}

.interactive-result-code-block .interactive-result-vulns-header,
.interactive-result-code-block .interactive-result-vulns-list {
	opacity: 0.8;
}

.interactive-result-code-block .interactive-result-vulns-list {
	margin: 0px;
	padding-bottom: 3px;
	padding-left: 16px !important; /* Override markdown styles */
}

.interactive-result-code-block.chat-vulnerabilities-collapsed .interactive-result-vulns-list {
	display: none;
}

.interactive-result-code-block .interactive-result-vulns-list .chat-vuln-title {
	font-weight: bold;
}

.interactive-result-code-block.no-vulns .interactive-result-vulns {
	display: none;
}

.interactive-result-code-block .interactive-result-vulns-header .monaco-button {
	/* unset Button styles */
	display: inline-flex;
	width: 100%;
	border: none;
	padding: 0;
	text-align: initial;
	justify-content: initial;
	color: var(--vscode-foreground) !important; /* This is inside .rendered-markdown */
	user-select: none;
}

.interactive-result-code-block .interactive-result-vulns-header .monaco-text-button:focus {
	outline: none;
}

.interactive-result-code-block .interactive-result-vulns-header .monaco-text-button:focus-visible {
	outline: 1px solid var(--vscode-focusBorder);
}

/* compare code block */

.interactive-result-code-block.compare.no-diff .message {
	display: inherit;
}

.interactive-result-code-block.compare .message {
	display: none;
	padding: 6px;
}


.interactive-result-code-block.compare .message A {
	color: var(--vscode-textLink-foreground);
	cursor: pointer;
}

.interactive-result-code-block.compare .message A > CODE {
	color: var(--vscode-textLink-foreground);
}

.interactive-result-code-block.compare .interactive-result-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 3px;
	box-sizing: border-box;
	border-bottom: solid 1px var(--vscode-chat-requestBorder);
}

.interactive-result-code-block.compare.no-diff .interactive-result-header,
.interactive-result-code-block.compare.no-diff .interactive-result-editor {
	display: none;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/codeBlockPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/codeBlockPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './codeBlockPart.css';

import * as dom from '../../../../base/browser/dom.js';
import { renderFormattedText } from '../../../../base/browser/formattedTextRenderer.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { combinedDisposable, Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { isEqual } from '../../../../base/common/resources.js';
import { assertType } from '../../../../base/common/types.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { IEditorConstructionOptions } from '../../../../editor/browser/config/editorConfiguration.js';
import { IDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorExtensionsRegistry } from '../../../../editor/browser/editorExtensions.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { CodeEditorWidget, ICodeEditorWidgetOptions } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { DiffEditorWidget } from '../../../../editor/browser/widget/diffEditor/diffEditorWidget.js';
import { EditorOption, IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { EDITOR_FONT_DEFAULTS } from '../../../../editor/common/config/fontInfo.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { ScrollType } from '../../../../editor/common/editorCommon.js';
import { TextEdit } from '../../../../editor/common/languages.js';
import { EndOfLinePreference, ITextModel } from '../../../../editor/common/model.js';
import { TextModelText } from '../../../../editor/common/model/textModelText.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { DefaultModelSHA1Computer } from '../../../../editor/common/services/modelService.js';
import { ITextModelContentProvider, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { BracketMatchingController } from '../../../../editor/contrib/bracketMatching/browser/bracketMatching.js';
import { ColorDetector } from '../../../../editor/contrib/colorPicker/browser/colorDetector.js';
import { ContextMenuController } from '../../../../editor/contrib/contextmenu/browser/contextmenu.js';
import { GotoDefinitionAtPositionEditorContribution } from '../../../../editor/contrib/gotoSymbol/browser/link/goToDefinitionAtPosition.js';
import { ContentHoverController } from '../../../../editor/contrib/hover/browser/contentHoverController.js';
import { GlyphHoverController } from '../../../../editor/contrib/hover/browser/glyphHoverController.js';
import { LinkDetector } from '../../../../editor/contrib/links/browser/links.js';
import { MessageController } from '../../../../editor/contrib/message/browser/messageController.js';
import { ViewportSemanticTokensContribution } from '../../../../editor/contrib/semanticTokens/browser/viewportSemanticTokens.js';
import { SmartSelectController } from '../../../../editor/contrib/smartSelect/browser/smartSelect.js';
import { WordHighlighterContribution } from '../../../../editor/contrib/wordHighlighter/browser/wordHighlighter.js';
import { localize } from '../../../../nls.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { MenuWorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { FileKind } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { ResourceLabel } from '../../../browser/labels.js';
import { ResourceContextKey } from '../../../common/contextkeys.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { InspectEditorTokensController } from '../../codeEditor/browser/inspectEditorTokens/inspectEditorTokens.js';
import { MenuPreventer } from '../../codeEditor/browser/menuPreventer.js';
import { SelectionClipboardContributionID } from '../../codeEditor/browser/selectionClipboard.js';
import { getSimpleEditorOptions } from '../../codeEditor/browser/simpleEditorOptions.js';
import { IMarkdownVulnerability } from '../common/annotations.js';
import { ChatContextKeys } from '../common/chatContextKeys.js';
import { IChatResponseModel, IChatTextEditGroup } from '../common/chatModel.js';
import { IChatResponseViewModel, isRequestVM, isResponseVM } from '../common/chatViewModel.js';
import { ChatTreeItem } from './chat.js';
import { IChatRendererDelegate } from './chatListRenderer.js';
import { ChatEditorOptions } from './chatOptions.js';
import { emptyProgressRunner, IEditorProgressService } from '../../../../platform/progress/common/progress.js';
import { SuggestController } from '../../../../editor/contrib/suggest/browser/suggestController.js';
import { SnippetController2 } from '../../../../editor/contrib/snippet/browser/snippetController2.js';

const $ = dom.$;

export interface ICodeBlockData {
	readonly codeBlockIndex: number;
	readonly codeBlockPartIndex: number;
	readonly element: unknown;

	readonly textModel: Promise<ITextModel> | undefined;
	readonly languageId: string;

	readonly codemapperUri?: URI;
	readonly fromSubagent?: boolean;

	readonly vulns?: readonly IMarkdownVulnerability[];
	readonly range?: Range;

	readonly parentContextKeyService?: IContextKeyService;
	readonly renderOptions?: ICodeBlockRenderOptions;

	readonly chatSessionResource: URI;
}

/**
 * Special markdown code block language id used to render a local file.
 *
 * The text of the code path should be a {@link LocalFileCodeBlockData} json object.
 */
export const localFileLanguageId = 'vscode-local-file';


export function parseLocalFileData(text: string) {

	interface RawLocalFileCodeBlockData {
		readonly uri: UriComponents;
		readonly range?: IRange;
	}

	let data: RawLocalFileCodeBlockData;
	try {
		data = JSON.parse(text);
	} catch (e) {
		throw new Error('Could not parse code block local file data');
	}

	let uri: URI;
	try {
		uri = URI.revive(data?.uri);
	} catch (e) {
		throw new Error('Invalid code block local file data URI');
	}

	let range: IRange | undefined;
	if (data.range) {
		// Note that since this is coming from extensions, position are actually zero based and must be converted.
		range = new Range(data.range.startLineNumber + 1, data.range.startColumn + 1, data.range.endLineNumber + 1, data.range.endColumn + 1);
	}

	return { uri, range };
}

export interface ICodeBlockActionContext {
	readonly code: string;
	readonly codemapperUri?: URI;
	readonly languageId?: string;
	readonly codeBlockIndex: number;
	readonly element: unknown;

	readonly chatSessionResource: URI | undefined;
}

export interface ICodeBlockRenderOptions {
	hideToolbar?: boolean;
	verticalPadding?: number;
	reserveWidth?: number;
	editorOptions?: IEditorOptions;
	maxHeightInLines?: number;
}

const defaultCodeblockPadding = 10;
export class CodeBlockPart extends Disposable {
	protected readonly _onDidChangeContentHeight = this._register(new Emitter<void>());
	public readonly onDidChangeContentHeight = this._onDidChangeContentHeight.event;

	public readonly editor: CodeEditorWidget;
	protected readonly toolbar: MenuWorkbenchToolBar;
	private readonly contextKeyService: IContextKeyService;

	public readonly element: HTMLElement;

	private readonly vulnsButton: Button;
	private readonly vulnsListElement: HTMLElement;

	private currentCodeBlockData: ICodeBlockData | undefined;
	private currentScrollWidth = 0;

	private isDisposed = false;

	private resourceContextKey: ResourceContextKey;

	private get verticalPadding(): number {
		return this.currentCodeBlockData?.renderOptions?.verticalPadding ?? defaultCodeblockPadding;
	}

	constructor(
		private readonly editorOptions: ChatEditorOptions,
		readonly menuId: MenuId,
		delegate: IChatRendererDelegate,
		overflowWidgetsDomNode: HTMLElement | undefined,
		private readonly isSimpleWidget: boolean = false,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IModelService protected readonly modelService: IModelService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
	) {
		super();
		this.element = $('.interactive-result-code-block');

		this.resourceContextKey = this._register(instantiationService.createInstance(ResourceContextKey));
		this.contextKeyService = this._register(contextKeyService.createScoped(this.element));
		const scopedInstantiationService = this._register(instantiationService.createChild(new ServiceCollection([IContextKeyService, this.contextKeyService])));
		const editorElement = dom.append(this.element, $('.interactive-result-editor'));
		this.editor = this.createEditor(scopedInstantiationService, editorElement, {
			...getSimpleEditorOptions(this.configurationService),
			readOnly: true,
			lineNumbers: 'off',
			selectOnLineNumbers: true,
			scrollBeyondLastLine: false,
			lineDecorationsWidth: 8,
			dragAndDrop: false,
			padding: { top: this.verticalPadding, bottom: this.verticalPadding },
			mouseWheelZoom: false,
			scrollbar: {
				vertical: 'hidden',
				alwaysConsumeMouseWheel: false
			},
			definitionLinkOpensInPeek: false,
			gotoLocation: {
				multiple: 'goto',
				multipleDeclarations: 'goto',
				multipleDefinitions: 'goto',
				multipleImplementations: 'goto',
			},
			ariaLabel: localize('chat.codeBlockHelp', 'Code block'),
			overflowWidgetsDomNode,
			tabFocusMode: true,
			...this.getEditorOptionsFromConfig(),
		});

		const toolbarElement = dom.append(this.element, $('.interactive-result-code-block-toolbar'));
		const editorScopedService = this.editor.contextKeyService.createScoped(toolbarElement);
		const editorScopedInstantiationService = this._register(scopedInstantiationService.createChild(new ServiceCollection([IContextKeyService, editorScopedService])));
		this.toolbar = this._register(editorScopedInstantiationService.createInstance(MenuWorkbenchToolBar, toolbarElement, menuId, {
			menuOptions: {
				shouldForwardArgs: true
			}
		}));

		const vulnsContainer = dom.append(this.element, $('.interactive-result-vulns'));
		const vulnsHeaderElement = dom.append(vulnsContainer, $('.interactive-result-vulns-header', undefined));
		this.vulnsButton = this._register(new Button(vulnsHeaderElement, {
			buttonBackground: undefined,
			buttonBorder: undefined,
			buttonForeground: undefined,
			buttonHoverBackground: undefined,
			buttonSecondaryBackground: undefined,
			buttonSecondaryForeground: undefined,
			buttonSecondaryHoverBackground: undefined,
			buttonSeparator: undefined,
			supportIcons: true
		}));

		this.vulnsListElement = dom.append(vulnsContainer, $('ul.interactive-result-vulns-list'));

		this._register(this.vulnsButton.onDidClick(() => {
			const element = this.currentCodeBlockData!.element as IChatResponseViewModel;
			element.vulnerabilitiesListExpanded = !element.vulnerabilitiesListExpanded;
			this.vulnsButton.label = this.getVulnerabilitiesLabel();
			this.element.classList.toggle('chat-vulnerabilities-collapsed', !element.vulnerabilitiesListExpanded);
			this._onDidChangeContentHeight.fire();
			// this.updateAriaLabel(collapseButton.element, referencesLabel, element.usedReferencesExpanded);
		}));

		this._register(this.toolbar.onDidChangeDropdownVisibility(e => {
			toolbarElement.classList.toggle('force-visibility', e);
		}));

		this._configureForScreenReader();
		this._register(this.accessibilityService.onDidChangeScreenReaderOptimized(() => this._configureForScreenReader()));
		this._register(this.configurationService.onDidChangeConfiguration((e) => {
			if (e.affectedKeys.has(AccessibilityVerbositySettingId.Chat)) {
				this._configureForScreenReader();
			}
		}));

		this._register(this.editorOptions.onDidChange(() => {
			this.editor.updateOptions(this.getEditorOptionsFromConfig());
		}));

		this._register(this.editor.onDidScrollChange(e => {
			this.currentScrollWidth = e.scrollWidth;
		}));
		this._register(this.editor.onDidContentSizeChange(e => {
			if (e.contentHeightChanged) {
				this._onDidChangeContentHeight.fire();
			}
		}));
		this._register(this.editor.onDidBlurEditorWidget(() => {
			this.element.classList.remove('focused');
			WordHighlighterContribution.get(this.editor)?.stopHighlighting();
			this.clearWidgets();
		}));
		this._register(this.editor.onDidFocusEditorWidget(() => {
			this.element.classList.add('focused');
			WordHighlighterContribution.get(this.editor)?.restoreViewState(true);
		}));
		this._register(Event.any(
			this.editor.onDidChangeModel,
			this.editor.onDidChangeModelContent
		)(() => {
			if (this.currentCodeBlockData) {
				this.updateContexts(this.currentCodeBlockData);
			}
		}));

		// Parent list scrolled
		if (delegate.onDidScroll) {
			this._register(delegate.onDidScroll(e => {
				this.clearWidgets();
			}));
		}
	}

	override dispose() {
		this.isDisposed = true;
		super.dispose();
	}

	get uri(): URI | undefined {
		return this.editor.getModel()?.uri;
	}

	private createEditor(instantiationService: IInstantiationService, parent: HTMLElement, options: Readonly<IEditorConstructionOptions>): CodeEditorWidget {
		return this._register(instantiationService.createInstance(CodeEditorWidget, parent, options, {
			isSimpleWidget: this.isSimpleWidget,
			contributions: EditorExtensionsRegistry.getSomeEditorContributions([
				MenuPreventer.ID,
				SelectionClipboardContributionID,
				ContextMenuController.ID,

				WordHighlighterContribution.ID,
				ViewportSemanticTokensContribution.ID,
				BracketMatchingController.ID,
				SmartSelectController.ID,
				ContentHoverController.ID,
				GlyphHoverController.ID,
				MessageController.ID,
				GotoDefinitionAtPositionEditorContribution.ID,
				SuggestController.ID,
				SnippetController2.ID,
				ColorDetector.ID,
				LinkDetector.ID,

				InspectEditorTokensController.ID,
			])
		}));
	}

	focus(): void {
		this.editor.focus();
	}

	private updatePaddingForLayout() {
		// scrollWidth = "the width of the content that needs to be scrolled"
		// contentWidth = "the width of the area where content is displayed"
		const horizontalScrollbarVisible = this.currentScrollWidth > this.editor.getLayoutInfo().contentWidth;
		const scrollbarHeight = this.editor.getLayoutInfo().horizontalScrollbarHeight;
		const bottomPadding = horizontalScrollbarVisible ?
			Math.max(this.verticalPadding - scrollbarHeight, 2) :
			this.verticalPadding;
		this.editor.updateOptions({ padding: { top: this.verticalPadding, bottom: bottomPadding } });
	}

	private _configureForScreenReader(): void {
		const toolbarElt = this.toolbar.getElement();
		if (this.accessibilityService.isScreenReaderOptimized()) {
			toolbarElt.style.display = 'block';
		} else {
			toolbarElt.style.display = '';
		}
	}

	private getEditorOptionsFromConfig(): IEditorOptions {
		return {
			wordWrap: this.editorOptions.configuration.resultEditor.wordWrap,
			fontLigatures: this.editorOptions.configuration.resultEditor.fontLigatures,
			bracketPairColorization: this.editorOptions.configuration.resultEditor.bracketPairColorization,
			fontFamily: this.editorOptions.configuration.resultEditor.fontFamily === 'default' ?
				EDITOR_FONT_DEFAULTS.fontFamily :
				this.editorOptions.configuration.resultEditor.fontFamily,
			fontSize: this.editorOptions.configuration.resultEditor.fontSize,
			fontWeight: this.editorOptions.configuration.resultEditor.fontWeight,
			lineHeight: this.editorOptions.configuration.resultEditor.lineHeight,
			...this.currentCodeBlockData?.renderOptions?.editorOptions,
		};
	}

	layout(width: number): void {
		const contentHeight = this.getContentHeight();

		let height = contentHeight;
		if (this.currentCodeBlockData?.renderOptions?.maxHeightInLines) {
			height = Math.min(contentHeight, this.editor.getOption(EditorOption.lineHeight) * this.currentCodeBlockData?.renderOptions?.maxHeightInLines);
		}

		const editorBorder = 2;
		width = width - editorBorder - (this.currentCodeBlockData?.renderOptions?.reserveWidth ?? 0);
		this.editor.layout({ width: isRequestVM(this.currentCodeBlockData?.element) ? width * 0.9 : width, height });
		this.updatePaddingForLayout();
	}

	private getContentHeight() {
		if (this.currentCodeBlockData?.range) {
			const lineCount = this.currentCodeBlockData.range.endLineNumber - this.currentCodeBlockData.range.startLineNumber + 1;
			const lineHeight = this.editor.getOption(EditorOption.lineHeight);
			return lineCount * lineHeight;
		}
		return this.editor.getContentHeight();
	}

	async render(data: ICodeBlockData, width: number) {
		this.currentCodeBlockData = data;
		if (data.parentContextKeyService) {
			this.contextKeyService.updateParent(data.parentContextKeyService);
		}

		if (this.getEditorOptionsFromConfig().wordWrap === 'on') {
			// Initialize the editor with the new proper width so that getContentHeight
			// will be computed correctly in the next call to layout()
			this.layout(width);
		}

		const didUpdate = await this.updateEditor(data);
		if (!didUpdate || this.isDisposed || this.currentCodeBlockData !== data) {
			return;
		}

		this.editor.updateOptions({
			...this.getEditorOptionsFromConfig(),
		});
		if (!this.editor.getOption(EditorOption.ariaLabel)) {
			// Don't override the ariaLabel if it was set by the editor options
			this.editor.updateOptions({
				ariaLabel: localize('chat.codeBlockLabel', "Code block {0}", data.codeBlockIndex + 1),
			});
		}
		this.layout(width);
		this.toolbar.setAriaLabel(localize('chat.codeBlockToolbarLabel', "Code block {0}", data.codeBlockIndex + 1));
		if (data.renderOptions?.hideToolbar) {
			dom.hide(this.toolbar.getElement());
		} else {
			dom.show(this.toolbar.getElement());
		}

		if (data.vulns?.length && isResponseVM(data.element)) {
			dom.clearNode(this.vulnsListElement);
			this.element.classList.remove('no-vulns');
			this.element.classList.toggle('chat-vulnerabilities-collapsed', !data.element.vulnerabilitiesListExpanded);
			dom.append(this.vulnsListElement, ...data.vulns.map(v => $('li', undefined, $('span.chat-vuln-title', undefined, v.title), ' ' + v.description)));
			this.vulnsButton.label = this.getVulnerabilitiesLabel();
		} else {
			this.element.classList.add('no-vulns');
		}

		this._onDidChangeContentHeight.fire();
	}

	reset() {
		this.clearWidgets();
		this.currentCodeBlockData = undefined;
	}

	private clearWidgets() {
		ContentHoverController.get(this.editor)?.hideContentHover();
		GlyphHoverController.get(this.editor)?.hideGlyphHover();
	}

	private async updateEditor(data: ICodeBlockData): Promise<boolean> {
		const textModel = await data.textModel;
		if (this.isDisposed || this.currentCodeBlockData !== data || !textModel || textModel.isDisposed()) {
			return false;
		}

		this.editor.setModel(textModel);
		if (data.range) {
			this.editor.setSelection(data.range);
			this.editor.revealRangeInCenter(data.range, ScrollType.Immediate);
		}

		this.updateContexts(data);

		return true;
	}

	private getVulnerabilitiesLabel(): string {
		if (!this.currentCodeBlockData || !this.currentCodeBlockData.vulns) {
			return '';
		}

		const referencesLabel = this.currentCodeBlockData.vulns.length > 1 ?
			localize('vulnerabilitiesPlural', "{0} vulnerabilities", this.currentCodeBlockData.vulns.length) :
			localize('vulnerabilitiesSingular', "{0} vulnerability", 1);
		const icon = (element: IChatResponseViewModel) => element.vulnerabilitiesListExpanded ? Codicon.chevronDown : Codicon.chevronRight;
		return `${referencesLabel} $(${icon(this.currentCodeBlockData.element as IChatResponseViewModel).id})`;
	}

	private updateContexts(data: ICodeBlockData) {
		const textModel = this.editor.getModel();
		if (!textModel) {
			return;
		}

		this.toolbar.context = {
			code: textModel.getTextBuffer().getValueInRange(data.range ?? textModel.getFullModelRange(), EndOfLinePreference.TextDefined),
			codeBlockIndex: data.codeBlockIndex,
			element: data.element,
			languageId: textModel.getLanguageId(),
			codemapperUri: data.codemapperUri,
			chatSessionResource: data.chatSessionResource
		} satisfies ICodeBlockActionContext;
		this.resourceContextKey.set(textModel.uri);
	}
}

export class ChatCodeBlockContentProvider extends Disposable implements ITextModelContentProvider {

	constructor(
		@ITextModelService textModelService: ITextModelService,
		@IModelService private readonly _modelService: IModelService,
	) {
		super();
		this._register(textModelService.registerTextModelContentProvider(Schemas.vscodeChatCodeBlock, this));
	}

	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);
		if (existing) {
			return existing;
		}
		return this._modelService.createModel('', null, resource);
	}
}

//

export interface ICodeCompareBlockActionContext {
	readonly element: IChatResponseViewModel;
	readonly diffEditor: IDiffEditor;
	readonly edit: IChatTextEditGroup;
}

export interface ICodeCompareBlockDiffData {
	modified: ITextModel;
	original: ITextModel;
	originalSha1: string;
}

export interface ICodeCompareBlockData {
	readonly element: ChatTreeItem;

	readonly edit: IChatTextEditGroup;

	readonly diffData: Promise<ICodeCompareBlockDiffData | undefined>;

	readonly parentContextKeyService?: IContextKeyService;

	readonly horizontalPadding?: number;
	readonly isReadOnly?: boolean;
	// readonly hideToolbar?: boolean;
}


// long-lived object that sits in the DiffPool and that gets reused
export class CodeCompareBlockPart extends Disposable {
	protected readonly _onDidChangeContentHeight = this._register(new Emitter<void>());
	public readonly onDidChangeContentHeight = this._onDidChangeContentHeight.event;

	private readonly contextKeyService: IContextKeyService;
	private readonly diffEditor: DiffEditorWidget;
	private readonly resourceLabel: ResourceLabel;
	private readonly toolbar: MenuWorkbenchToolBar;
	readonly element: HTMLElement;
	private readonly messageElement: HTMLElement;
	private readonly editorHeader: HTMLElement;

	private readonly _lastDiffEditorViewModel = this._store.add(new MutableDisposable());
	private currentScrollWidth = 0;
	private currentHorizontalPadding = 0;

	constructor(
		private readonly options: ChatEditorOptions,
		readonly menuId: MenuId,
		delegate: IChatRendererDelegate,
		overflowWidgetsDomNode: HTMLElement | undefined,
		private readonly isSimpleWidget: boolean = false,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IModelService protected readonly modelService: IModelService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
		@ILabelService private readonly labelService: ILabelService,
		@IOpenerService private readonly openerService: IOpenerService,
	) {
		super();
		this.element = $('.interactive-result-code-block');
		this.element.classList.add('compare');

		this.messageElement = dom.append(this.element, $('.message'));
		this.messageElement.setAttribute('role', 'status');
		this.messageElement.tabIndex = 0;

		this.contextKeyService = this._register(contextKeyService.createScoped(this.element));
		const scopedInstantiationService = this._register(instantiationService.createChild(new ServiceCollection(
			[IContextKeyService, this.contextKeyService],
			[IEditorProgressService, new class implements IEditorProgressService {
				_serviceBrand: undefined;
				show(_total: unknown, _delay?: unknown) {
					return emptyProgressRunner;
				}
				async showWhile(promise: Promise<unknown>, _delay?: number): Promise<void> {
					await promise;
				}
			}],
		)));
		const editorHeader = this.editorHeader = dom.append(this.element, $('.interactive-result-header.show-file-icons'));
		const editorElement = dom.append(this.element, $('.interactive-result-editor'));
		this.diffEditor = this.createDiffEditor(scopedInstantiationService, editorElement, {
			...getSimpleEditorOptions(this.configurationService),
			lineNumbers: 'on',
			selectOnLineNumbers: true,
			scrollBeyondLastLine: false,
			lineDecorationsWidth: 12,
			dragAndDrop: false,
			padding: { top: defaultCodeblockPadding, bottom: defaultCodeblockPadding },
			mouseWheelZoom: false,
			scrollbar: {
				vertical: 'hidden',
				alwaysConsumeMouseWheel: false
			},
			definitionLinkOpensInPeek: false,
			gotoLocation: {
				multiple: 'goto',
				multipleDeclarations: 'goto',
				multipleDefinitions: 'goto',
				multipleImplementations: 'goto',
			},
			ariaLabel: localize('chat.codeBlockHelp', 'Code block'),
			overflowWidgetsDomNode,
			...this.getEditorOptionsFromConfig(),
		});

		this.resourceLabel = this._register(scopedInstantiationService.createInstance(ResourceLabel, editorHeader, { supportIcons: true }));

		const editorScopedService = this.diffEditor.getModifiedEditor().contextKeyService.createScoped(editorHeader);
		const editorScopedInstantiationService = this._register(scopedInstantiationService.createChild(new ServiceCollection([IContextKeyService, editorScopedService])));
		this.toolbar = this._register(editorScopedInstantiationService.createInstance(MenuWorkbenchToolBar, editorHeader, menuId, {
			menuOptions: {
				shouldForwardArgs: true
			}
		}));

		this._configureForScreenReader();
		this._register(this.accessibilityService.onDidChangeScreenReaderOptimized(() => this._configureForScreenReader()));
		this._register(this.configurationService.onDidChangeConfiguration((e) => {
			if (e.affectedKeys.has(AccessibilityVerbositySettingId.Chat)) {
				this._configureForScreenReader();
			}
		}));

		this._register(this.options.onDidChange(() => {
			this.diffEditor.updateOptions(this.getEditorOptionsFromConfig());
		}));

		this._register(this.diffEditor.getModifiedEditor().onDidScrollChange(e => {
			this.currentScrollWidth = e.scrollWidth;
		}));
		this._register(this.diffEditor.onDidContentSizeChange(e => {
			if (e.contentHeightChanged) {
				this._onDidChangeContentHeight.fire();
			}
		}));
		this._register(this.diffEditor.getModifiedEditor().onDidBlurEditorWidget(() => {
			this.element.classList.remove('focused');
			WordHighlighterContribution.get(this.diffEditor.getModifiedEditor())?.stopHighlighting();
			this.clearWidgets();
		}));
		this._register(this.diffEditor.getModifiedEditor().onDidFocusEditorWidget(() => {
			this.element.classList.add('focused');
			WordHighlighterContribution.get(this.diffEditor.getModifiedEditor())?.restoreViewState(true);
		}));


		// Parent list scrolled
		if (delegate.onDidScroll) {
			this._register(delegate.onDidScroll(e => {
				this.clearWidgets();
			}));
		}
	}

	get uri(): URI | undefined {
		return this.diffEditor.getModifiedEditor().getModel()?.uri;
	}

	private createDiffEditor(instantiationService: IInstantiationService, parent: HTMLElement, options: Readonly<IEditorConstructionOptions>): DiffEditorWidget {
		const widgetOptions: ICodeEditorWidgetOptions = {
			isSimpleWidget: this.isSimpleWidget,
			contributions: EditorExtensionsRegistry.getSomeEditorContributions([
				MenuPreventer.ID,
				SelectionClipboardContributionID,
				ContextMenuController.ID,

				WordHighlighterContribution.ID,
				ViewportSemanticTokensContribution.ID,
				BracketMatchingController.ID,
				SmartSelectController.ID,
				ContentHoverController.ID,
				GlyphHoverController.ID,
				GotoDefinitionAtPositionEditorContribution.ID,
			])
		};

		return this._register(instantiationService.createInstance(DiffEditorWidget, parent, {
			scrollbar: { useShadows: false, alwaysConsumeMouseWheel: false, ignoreHorizontalScrollbarInContentHeight: true, },
			renderMarginRevertIcon: false,
			diffCodeLens: false,
			scrollBeyondLastLine: false,
			stickyScroll: { enabled: false },
			originalAriaLabel: localize('original', 'Original'),
			modifiedAriaLabel: localize('modified', 'Modified'),
			diffAlgorithm: 'advanced',
			readOnly: false,
			isInEmbeddedEditor: true,
			useInlineViewWhenSpaceIsLimited: true,
			experimental: {
				useTrueInlineView: true,
			},
			renderSideBySideInlineBreakpoint: 300,
			renderOverviewRuler: false,
			compactMode: true,
			hideUnchangedRegions: { enabled: true, contextLineCount: 1 },
			renderGutterMenu: false,
			lineNumbersMinChars: 1,
			...options
		}, { originalEditor: widgetOptions, modifiedEditor: widgetOptions }));
	}

	focus(): void {
		this.diffEditor.focus();
	}

	private updatePaddingForLayout() {
		// scrollWidth = "the width of the content that needs to be scrolled"
		// contentWidth = "the width of the area where content is displayed"
		const horizontalScrollbarVisible = this.currentScrollWidth > this.diffEditor.getModifiedEditor().getLayoutInfo().contentWidth;
		const scrollbarHeight = this.diffEditor.getModifiedEditor().getLayoutInfo().horizontalScrollbarHeight;
		const bottomPadding = horizontalScrollbarVisible ?
			Math.max(defaultCodeblockPadding - scrollbarHeight, 2) :
			defaultCodeblockPadding;
		this.diffEditor.updateOptions({ padding: { top: defaultCodeblockPadding, bottom: bottomPadding } });
	}

	private _configureForScreenReader(): void {
		const toolbarElt = this.toolbar.getElement();
		if (this.accessibilityService.isScreenReaderOptimized()) {
			toolbarElt.style.display = 'block';
			toolbarElt.ariaLabel = localize('chat.codeBlock.toolbar', 'Code block toolbar');
		} else {
			toolbarElt.style.display = '';
		}
	}

	private getEditorOptionsFromConfig(): IEditorOptions {
		return {
			wordWrap: this.options.configuration.resultEditor.wordWrap,
			fontLigatures: this.options.configuration.resultEditor.fontLigatures,
			bracketPairColorization: this.options.configuration.resultEditor.bracketPairColorization,
			fontFamily: this.options.configuration.resultEditor.fontFamily === 'default' ?
				EDITOR_FONT_DEFAULTS.fontFamily :
				this.options.configuration.resultEditor.fontFamily,
			fontSize: this.options.configuration.resultEditor.fontSize,
			fontWeight: this.options.configuration.resultEditor.fontWeight,
			lineHeight: this.options.configuration.resultEditor.lineHeight,
		};
	}

	layout(width: number): void {
		const editorBorder = 2;

		const toolbar = dom.getTotalHeight(this.editorHeader);
		const content = this.diffEditor.getModel()
			? this.diffEditor.getContentHeight()
			: dom.getTotalHeight(this.messageElement);

		const dimension = new dom.Dimension(width - editorBorder - this.currentHorizontalPadding * 2, toolbar + content);
		this.element.style.height = `${dimension.height}px`;
		this.element.style.width = `${dimension.width}px`;
		this.diffEditor.layout(dimension.with(undefined, content - editorBorder));
		this.updatePaddingForLayout();
	}


	async render(data: ICodeCompareBlockData, width: number, token: CancellationToken) {
		this.currentHorizontalPadding = data.horizontalPadding || 0;

		if (data.parentContextKeyService) {
			this.contextKeyService.updateParent(data.parentContextKeyService);
		}

		if (this.options.configuration.resultEditor.wordWrap === 'on') {
			// Initialize the editor with the new proper width so that getContentHeight
			// will be computed correctly in the next call to layout()
			this.layout(width);
		}

		await this.updateEditor(data, token);

		this.layout(width);
		this.diffEditor.updateOptions({
			ariaLabel: localize('chat.compareCodeBlockLabel', "Code Edits"),
			readOnly: !!data.isReadOnly,
		});

		this.resourceLabel.element.setFile(data.edit.uri, {
			fileKind: FileKind.FILE,
			fileDecorations: { colors: true, badges: false }
		});

		this._onDidChangeContentHeight.fire();
	}

	reset() {
		this.clearWidgets();
	}

	private clearWidgets() {
		ContentHoverController.get(this.diffEditor.getOriginalEditor())?.hideContentHover();
		ContentHoverController.get(this.diffEditor.getModifiedEditor())?.hideContentHover();
		GlyphHoverController.get(this.diffEditor.getOriginalEditor())?.hideGlyphHover();
		GlyphHoverController.get(this.diffEditor.getModifiedEditor())?.hideGlyphHover();
	}

	private async updateEditor(data: ICodeCompareBlockData, token: CancellationToken): Promise<void> {

		if (!isResponseVM(data.element)) {
			return;
		}

		const isEditApplied = Boolean(data.edit.state?.applied ?? 0);

		ChatContextKeys.editApplied.bindTo(this.contextKeyService).set(isEditApplied);

		this.element.classList.toggle('no-diff', isEditApplied);

		if (isEditApplied) {
			assertType(data.edit.state?.applied);

			const uriLabel = this.labelService.getUriLabel(data.edit.uri, { relative: true, noPrefix: true });

			let template: string;
			if (data.edit.state.applied === 1) {
				template = localize('chat.edits.1', "Applied 1 change in [[``{0}``]]", uriLabel);
			} else if (data.edit.state.applied < 0) {
				template = localize('chat.edits.rejected', "Edits in [[``{0}``]] have been rejected", uriLabel);
			} else {
				template = localize('chat.edits.N', "Applied {0} changes in [[``{1}``]]", data.edit.state.applied, uriLabel);
			}

			const message = renderFormattedText(template, {
				renderCodeSegments: true,
				actionHandler: {
					callback: () => {
						this.openerService.open(data.edit.uri, { fromUserGesture: true, allowCommands: false });
					},
					disposables: this._store,
				}
			});

			dom.reset(this.messageElement, message);
		}

		const diffData = await data.diffData;

		if (!isEditApplied && diffData) {
			const viewModel = this.diffEditor.createViewModel({
				original: diffData.original,
				modified: diffData.modified
			});

			await viewModel.waitForDiff();

			if (token.isCancellationRequested) {
				return;
			}

			const listener = Event.any(diffData.original.onWillDispose, diffData.modified.onWillDispose)(() => {
				// this a bit weird and basically duplicates https://github.com/microsoft/vscode/blob/7cbcafcbcc88298cfdcd0238018fbbba8eb6853e/src/vs/editor/browser/widget/diffEditor/diffEditorWidget.ts#L328
				// which cannot call `setModel(null)` without first complaining
				this.diffEditor.setModel(null);
			});
			this.diffEditor.setModel(viewModel);
			this._lastDiffEditorViewModel.value = combinedDisposable(listener, viewModel);

		} else {
			this.diffEditor.setModel(null);
			this._lastDiffEditorViewModel.value = undefined;
			this._onDidChangeContentHeight.fire();
		}

		this.toolbar.context = {
			edit: data.edit,
			element: data.element,
			diffEditor: this.diffEditor,
		} satisfies ICodeCompareBlockActionContext;
	}
}

export class DefaultChatTextEditor {

	private readonly _sha1 = new DefaultModelSHA1Computer();

	constructor(
		@ITextModelService private readonly modelService: ITextModelService,
		@ICodeEditorService private readonly editorService: ICodeEditorService,
		@IDialogService private readonly dialogService: IDialogService,
	) { }

	async apply(response: IChatResponseModel | IChatResponseViewModel, item: IChatTextEditGroup, diffEditor: IDiffEditor | undefined): Promise<void> {

		if (!response.response.value.includes(item)) {
			// bogous item
			return;
		}

		if (item.state?.applied) {
			// already applied
			return;
		}

		if (!diffEditor) {
			for (const candidate of this.editorService.listDiffEditors()) {
				if (!candidate.getContainerDomNode().isConnected) {
					continue;
				}
				const model = candidate.getModel();
				if (!model || !isEqual(model.original.uri, item.uri) || model.modified.uri.scheme !== Schemas.vscodeChatCodeCompareBlock) {
					diffEditor = candidate;
					break;
				}
			}
		}

		const edits = diffEditor
			? await this._applyWithDiffEditor(diffEditor, item)
			: await this._apply(item);

		response.setEditApplied(item, edits);
	}

	private async _applyWithDiffEditor(diffEditor: IDiffEditor, item: IChatTextEditGroup) {
		const model = diffEditor.getModel();
		if (!model) {
			return 0;
		}

		const diff = diffEditor.getDiffComputationResult();
		if (!diff || diff.identical) {
			return 0;
		}


		if (!await this._checkSha1(model.original, item)) {
			return 0;
		}

		const modified = new TextModelText(model.modified);
		const edits = diff.changes2.map(i => i.toRangeMapping().toTextEdit(modified).toSingleEditOperation());

		model.original.pushStackElement();
		model.original.pushEditOperations(null, edits, () => null);
		model.original.pushStackElement();

		return edits.length;
	}

	private async _apply(item: IChatTextEditGroup) {
		const ref = await this.modelService.createModelReference(item.uri);
		try {

			if (!await this._checkSha1(ref.object.textEditorModel, item)) {
				return 0;
			}

			ref.object.textEditorModel.pushStackElement();
			let total = 0;
			for (const group of item.edits) {
				const edits = group.map(TextEdit.asEditOperation);
				ref.object.textEditorModel.pushEditOperations(null, edits, () => null);
				total += edits.length;
			}
			ref.object.textEditorModel.pushStackElement();
			return total;

		} finally {
			ref.dispose();
		}
	}

	private async _checkSha1(model: ITextModel, item: IChatTextEditGroup) {
		if (item.state?.sha1 && this._sha1.computeSHA1(model) && this._sha1.computeSHA1(model) !== item.state.sha1) {
			const result = await this.dialogService.confirm({
				message: localize('interactive.compare.apply.confirm', "The original file has been modified."),
				detail: localize('interactive.compare.apply.confirm.detail', "Do you want to apply the changes anyway?"),
			});

			if (!result.confirmed) {
				return false;
			}
		}
		return true;
	}

	discard(response: IChatResponseModel | IChatResponseViewModel, item: IChatTextEditGroup) {
		if (!response.response.value.includes(item)) {
			// bogous item
			return;
		}

		if (item.state?.applied) {
			// already applied
			return;
		}

		response.setEditApplied(item, -1);
	}


}
```

--------------------------------------------------------------------------------

````

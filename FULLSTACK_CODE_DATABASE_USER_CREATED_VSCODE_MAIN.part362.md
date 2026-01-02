---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 362
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 362 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/common/chatServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { BugIndicatingError, ErrorNoTelemetry } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Disposable, DisposableResourceMap, DisposableStore, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { revive } from '../../../../base/common/marshalling.js';
import { Schemas } from '../../../../base/common/network.js';
import { autorun, derived, IObservable } from '../../../../base/common/observable.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { OffsetRange } from '../../../../editor/common/core/ranges/offsetRange.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Progress } from '../../../../platform/progress/common/progress.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { InlineChatConfigKeys } from '../../inlineChat/common/inlineChat.js';
import { IMcpService } from '../../mcp/common/mcpTypes.js';
import { awaitStatsForSession } from './chat.js';
import { IChatAgentCommand, IChatAgentData, IChatAgentHistoryEntry, IChatAgentRequest, IChatAgentResult, IChatAgentService } from './chatAgents.js';
import { chatEditingSessionIsReady } from './chatEditingService.js';
import { ChatModel, ChatRequestModel, ChatRequestRemovalReason, IChatModel, IChatRequestModel, IChatRequestVariableData, IChatResponseModel, IExportableChatData, ISerializableChatData, ISerializableChatDataIn, ISerializableChatsData, normalizeSerializableChatData, toChatHistoryContent, updateRanges } from './chatModel.js';
import { ChatModelStore, IStartSessionProps } from './chatModelStore.js';
import { chatAgentLeader, ChatRequestAgentPart, ChatRequestAgentSubcommandPart, ChatRequestSlashCommandPart, ChatRequestTextPart, chatSubcommandLeader, getPromptText, IParsedChatRequest } from './chatParserTypes.js';
import { ChatRequestParser } from './chatRequestParser.js';
import { ChatMcpServersStarting, IChatCompleteResponse, IChatDetail, IChatFollowup, IChatModelReference, IChatProgress, IChatSendRequestData, IChatSendRequestOptions, IChatSendRequestResponseState, IChatService, IChatSessionContext, IChatSessionStartOptions, IChatTransferredSessionData, IChatUserActionEvent, ResponseModelState } from './chatService.js';
import { ChatRequestTelemetry, ChatServiceTelemetry } from './chatServiceTelemetry.js';
import { IChatSessionsService } from './chatSessionsService.js';
import { ChatSessionStore, IChatSessionEntryMetadata, IChatTransfer2 } from './chatSessionStore.js';
import { IChatSlashCommandService } from './chatSlashCommands.js';
import { IChatTransferService } from './chatTransferService.js';
import { LocalChatSessionUri } from './chatUri.js';
import { IChatRequestVariableEntry } from './chatVariableEntries.js';
import { ChatAgentLocation, ChatConfiguration, ChatModeKind } from './constants.js';
import { ChatMessageRole, IChatMessage } from './languageModels.js';
import { ILanguageModelToolsService } from './languageModelToolsService.js';

const serializedChatKey = 'interactive.sessions';

const TransferredGlobalChatKey = 'chat.workspaceTransfer';

const SESSION_TRANSFER_EXPIRATION_IN_MILLISECONDS = 1000 * 60;

class CancellableRequest implements IDisposable {
	constructor(
		public readonly cancellationTokenSource: CancellationTokenSource,
		public requestId: string | undefined,
		@ILanguageModelToolsService private readonly toolsService: ILanguageModelToolsService
	) { }

	dispose() {
		this.cancellationTokenSource.dispose();
	}

	cancel() {
		if (this.requestId) {
			this.toolsService.cancelToolCallsForRequest(this.requestId);
		}

		this.cancellationTokenSource.cancel();
	}
}

export class ChatService extends Disposable implements IChatService {
	declare _serviceBrand: undefined;

	private readonly _sessionModels: ChatModelStore;
	private readonly _pendingRequests = this._register(new DisposableResourceMap<CancellableRequest>());
	private _persistedSessions: ISerializableChatsData;
	private _saveModelsEnabled = true;

	private _transferredSessionData: IChatTransferredSessionData | undefined;
	public get transferredSessionData(): IChatTransferredSessionData | undefined {
		return this._transferredSessionData;
	}

	private readonly _onDidSubmitRequest = this._register(new Emitter<{ readonly chatSessionResource: URI }>());
	public readonly onDidSubmitRequest = this._onDidSubmitRequest.event;

	private readonly _onDidPerformUserAction = this._register(new Emitter<IChatUserActionEvent>());
	public readonly onDidPerformUserAction: Event<IChatUserActionEvent> = this._onDidPerformUserAction.event;

	private readonly _onDidDisposeSession = this._register(new Emitter<{ readonly sessionResource: URI[]; reason: 'cleared' }>());
	public readonly onDidDisposeSession = this._onDidDisposeSession.event;

	private readonly _sessionFollowupCancelTokens = this._register(new DisposableResourceMap<CancellationTokenSource>());
	private readonly _chatServiceTelemetry: ChatServiceTelemetry;
	private readonly _chatSessionStore: ChatSessionStore;

	readonly requestInProgressObs: IObservable<boolean>;

	readonly chatModels: IObservable<Iterable<IChatModel>>;

	/**
	 * For test use only
	 */
	setSaveModelsEnabled(enabled: boolean): void {
		this._saveModelsEnabled = enabled;
	}

	/**
	 * For test use only
	 */
	waitForModelDisposals(): Promise<void> {
		return this._sessionModels.waitForModelDisposals();
	}

	public get edits2Enabled(): boolean {
		return this.configurationService.getValue(ChatConfiguration.Edits2Enabled);
	}

	private get isEmptyWindow(): boolean {
		const workspace = this.workspaceContextService.getWorkspace();
		return !workspace.configuration && workspace.folders.length === 0;
	}

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@ILogService private readonly logService: ILogService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IChatSlashCommandService private readonly chatSlashCommandService: IChatSlashCommandService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IChatTransferService private readonly chatTransferService: IChatTransferService,
		@IChatSessionsService private readonly chatSessionService: IChatSessionsService,
		@IMcpService private readonly mcpService: IMcpService,
	) {
		super();

		this._sessionModels = this._register(instantiationService.createInstance(ChatModelStore, {
			createModel: (props: IStartSessionProps) => this._startSession(props),
			willDisposeModel: async (model: ChatModel) => {
				const localSessionId = LocalChatSessionUri.parseLocalSessionId(model.sessionResource);
				if (localSessionId && this.shouldStoreSession(model)) {
					// Always preserve sessions that have custom titles, even if empty
					if (model.getRequests().length === 0 && !model.customTitle) {
						await this._chatSessionStore.deleteSession(localSessionId);
					} else if (this._saveModelsEnabled) {
						await this._chatSessionStore.storeSessions([model]);
					}
				} else if (!localSessionId && model.getRequests().length > 0) {
					await this._chatSessionStore.storeSessionsMetadataOnly([model]);
				}
			}
		}));
		this._register(this._sessionModels.onDidDisposeModel(model => {
			this._onDidDisposeSession.fire({ sessionResource: [model.sessionResource], reason: 'cleared' });
		}));

		this._chatServiceTelemetry = this.instantiationService.createInstance(ChatServiceTelemetry);

		const sessionData = storageService.get(serializedChatKey, this.isEmptyWindow ? StorageScope.APPLICATION : StorageScope.WORKSPACE, '');
		if (sessionData) {
			this._persistedSessions = this.deserializeChats(sessionData);
			const countsForLog = Object.keys(this._persistedSessions).length;
			if (countsForLog > 0) {
				this.trace('constructor', `Restored ${countsForLog} persisted sessions`);
			}
		} else {
			this._persistedSessions = {};
		}

		const transferredData = this.getTransferredSessionData();
		const transferredChat = transferredData?.chat;
		if (transferredChat) {
			this.trace('constructor', `Transferred session ${transferredChat.sessionId}`);
			this._persistedSessions[transferredChat.sessionId] = transferredChat;
			this._transferredSessionData = {
				sessionId: transferredChat.sessionId,
				location: transferredData.location,
				inputState: transferredData.inputState
			};
		}

		this._chatSessionStore = this._register(this.instantiationService.createInstance(ChatSessionStore));
		this._chatSessionStore.migrateDataIfNeeded(() => this._persistedSessions);

		// When using file storage, populate _persistedSessions with session metadata from the index
		// This ensures that getPersistedSessionTitle() can find titles for inactive sessions
		this.initializePersistedSessionsFromFileStorage().then(() => {
			this.reviveSessionsWithEdits();
		});

		this._register(storageService.onWillSaveState(() => this.saveState()));

		this.chatModels = derived(this, reader => [...this._sessionModels.observable.read(reader).values()]);

		this.requestInProgressObs = derived(reader => {
			const models = this._sessionModels.observable.read(reader).values();
			return Iterable.some(models, model => model.requestInProgress.read(reader));
		});
	}

	public get editingSessions() {
		return [...this._sessionModels.values()].map(v => v.editingSession).filter(isDefined);
	}

	isEnabled(location: ChatAgentLocation): boolean {
		return this.chatAgentService.getContributedDefaultAgent(location) !== undefined;
	}

	private saveState(): void {
		if (!this._saveModelsEnabled) {
			return;
		}

		const liveLocalChats = Array.from(this._sessionModels.values())
			.filter(session => this.shouldStoreSession(session));

		this._chatSessionStore.storeSessions(liveLocalChats);

		const liveNonLocalChats = Array.from(this._sessionModels.values())
			.filter(session => !LocalChatSessionUri.parseLocalSessionId(session.sessionResource));
		this._chatSessionStore.storeSessionsMetadataOnly(liveNonLocalChats);
	}

	/**
	 * Only persist local sessions from chat that are not imported.
	 */
	private shouldStoreSession(session: ChatModel): boolean {
		if (!LocalChatSessionUri.parseLocalSessionId(session.sessionResource)) {
			return false;
		}
		return session.initialLocation === ChatAgentLocation.Chat && !session.isImported;
	}

	notifyUserAction(action: IChatUserActionEvent): void {
		this._chatServiceTelemetry.notifyUserAction(action);
		this._onDidPerformUserAction.fire(action);
		if (action.action.kind === 'chatEditingSessionAction') {
			const model = this._sessionModels.get(action.sessionResource);
			if (model) {
				model.notifyEditingAction(action.action);
			}
		}
	}

	async setChatSessionTitle(sessionResource: URI, title: string): Promise<void> {
		const model = this._sessionModels.get(sessionResource);
		if (model) {
			model.setCustomTitle(title);
		}

		// Update the title in the file storage
		const localSessionId = LocalChatSessionUri.parseLocalSessionId(sessionResource);
		if (localSessionId) {
			await this._chatSessionStore.setSessionTitle(localSessionId, title);
			// Trigger immediate save to ensure consistency
			this.saveState();
		}
	}

	private trace(method: string, message?: string): void {
		if (message) {
			this.logService.trace(`ChatService#${method}: ${message}`);
		} else {
			this.logService.trace(`ChatService#${method}`);
		}
	}

	private error(method: string, message: string): void {
		this.logService.error(`ChatService#${method} ${message}`);
	}

	private deserializeChats(sessionData: string): ISerializableChatsData {
		try {
			const arrayOfSessions: ISerializableChatDataIn[] = revive(JSON.parse(sessionData)); // Revive serialized URIs in session data
			if (!Array.isArray(arrayOfSessions)) {
				throw new Error('Expected array');
			}

			const sessions = arrayOfSessions.reduce<ISerializableChatsData>((acc, session) => {
				// Revive serialized markdown strings in response data
				for (const request of session.requests) {
					if (Array.isArray(request.response)) {
						request.response = request.response.map((response) => {
							if (typeof response === 'string') {
								return new MarkdownString(response);
							}
							return response;
						});
					} else if (typeof request.response === 'string') {
						request.response = [new MarkdownString(request.response)];
					}
				}

				acc[session.sessionId] = normalizeSerializableChatData(session);
				return acc;
			}, {});
			return sessions;
		} catch (err) {
			this.error('deserializeChats', `Malformed session data: ${err}. [${sessionData.substring(0, 20)}${sessionData.length > 20 ? '...' : ''}]`);
			return {};
		}
	}

	private getTransferredSessionData(): IChatTransfer2 | undefined {
		const data: IChatTransfer2[] = this.storageService.getObject(TransferredGlobalChatKey, StorageScope.PROFILE, []);
		const workspaceUri = this.workspaceContextService.getWorkspace().folders[0]?.uri;
		if (!workspaceUri) {
			return;
		}

		const thisWorkspace = workspaceUri.toString();
		const currentTime = Date.now();
		// Only use transferred data if it was created recently
		const transferred = data.find(item => URI.revive(item.toWorkspace).toString() === thisWorkspace && (currentTime - item.timestampInMilliseconds < SESSION_TRANSFER_EXPIRATION_IN_MILLISECONDS));
		// Keep data that isn't for the current workspace and that hasn't expired yet
		const filtered = data.filter(item => URI.revive(item.toWorkspace).toString() !== thisWorkspace && (currentTime - item.timestampInMilliseconds < SESSION_TRANSFER_EXPIRATION_IN_MILLISECONDS));
		this.storageService.store(TransferredGlobalChatKey, JSON.stringify(filtered), StorageScope.PROFILE, StorageTarget.MACHINE);
		return transferred;
	}

	/**
	 * todo@connor4312 This will be cleaned up with the globalization of edits.
	 */
	private async reviveSessionsWithEdits(): Promise<void> {
		await Promise.all(Object.values(this._persistedSessions).map(async session => {
			if (!session.hasPendingEdits) {
				return;
			}

			const sessionResource = LocalChatSessionUri.forSession(session.sessionId);
			const sessionRef = await this.getOrRestoreSession(sessionResource);
			if (sessionRef?.object.editingSession) {
				await chatEditingSessionIsReady(sessionRef.object.editingSession);
				// the session will hold a self-reference as long as there are modified files
				sessionRef.dispose();
			}
		}));
	}

	private async initializePersistedSessionsFromFileStorage(): Promise<void> {

		const index = await this._chatSessionStore.getIndex();
		const sessionIds = Object.keys(index);

		for (const sessionId of sessionIds) {
			const metadata = index[sessionId];
			if (metadata && !this._persistedSessions[sessionId]) {
				// Create a minimal session entry with the title information
				// This allows getPersistedSessionTitle() to find the title without loading the full session
				const minimalSession: ISerializableChatData = {
					version: 3,
					sessionId: sessionId,
					customTitle: metadata.title,
					creationDate: Date.now(), // Use current time as fallback
					lastMessageDate: metadata.lastMessageDate,
					initialLocation: metadata.initialLocation,
					requests: [], // Empty requests array - this is just for title lookup
					responderUsername: '',
					responderAvatarIconUri: undefined,
					hasPendingEdits: metadata.hasPendingEdits,
				};

				this._persistedSessions[sessionId] = minimalSession;
			}
		}
	}

	/**
	 * Returns an array of chat details for all persisted chat sessions that have at least one request.
	 * Chat sessions that have already been loaded into the chat view are excluded from the result.
	 * Imported chat sessions are also excluded from the result.
	 * TODO this is only used by the old "show chats" command which can be removed when the pre-agents view
	 * options are removed.
	 */
	async getLocalSessionHistory(): Promise<IChatDetail[]> {
		const liveSessionItems = await this.getLiveSessionItems();
		const historySessionItems = await this.getHistorySessionItems();

		return [...liveSessionItems, ...historySessionItems];
	}

	/**
	 * Returns an array of chat details for all local live chat sessions.
	 */
	async getLiveSessionItems(): Promise<IChatDetail[]> {
		return await Promise.all(Array.from(this._sessionModels.values())
			.filter(session => this.shouldBeInHistory(session))
			.map(async (session): Promise<IChatDetail> => {
				const title = session.title || localize('newChat', "New Chat");
				return {
					sessionResource: session.sessionResource,
					title,
					lastMessageDate: session.lastMessageDate,
					timing: session.timing,
					isActive: true,
					stats: await awaitStatsForSession(session),
					lastResponseState: session.lastRequest?.response?.state ?? ResponseModelState.Pending,
				};
			}));
	}

	/**
	 * Returns an array of chat details for all local chat sessions in history (not currently loaded).
	 */
	async getHistorySessionItems(): Promise<IChatDetail[]> {
		const index = await this._chatSessionStore.getIndex();
		return Object.values(index)
			.filter(entry => !entry.isExternal)
			.filter(entry => !this._sessionModels.has(LocalChatSessionUri.forSession(entry.sessionId)) && entry.initialLocation === ChatAgentLocation.Chat && !entry.isEmpty)
			.map((entry): IChatDetail => {
				const sessionResource = LocalChatSessionUri.forSession(entry.sessionId);
				return ({
					...entry,
					sessionResource,
					// TODO@roblourens- missing for old data- normalize inside the store
					timing: entry.timing ?? { startTime: entry.lastMessageDate },
					isActive: this._sessionModels.has(sessionResource),
					// TODO@roblourens- missing for old data- normalize inside the store
					lastResponseState: entry.lastResponseState ?? ResponseModelState.Complete,
				});
			});
	}

	async getMetadataForSession(sessionResource: URI): Promise<IChatDetail | undefined> {
		const index = await this._chatSessionStore.getIndex();
		const metadata: IChatSessionEntryMetadata | undefined = index[sessionResource.toString()];
		if (metadata) {
			return {
				...metadata,
				sessionResource,
				// TODO@roblourens- missing for old data- normalize inside the store
				timing: metadata.timing ?? { startTime: metadata.lastMessageDate },
				isActive: this._sessionModels.has(sessionResource),
				// TODO@roblourens- missing for old data- normalize inside the store
				lastResponseState: metadata.lastResponseState ?? ResponseModelState.Complete,
			};
		}

		return undefined;
	}

	private shouldBeInHistory(entry: ChatModel): boolean {
		return !entry.isImported && !!LocalChatSessionUri.parseLocalSessionId(entry.sessionResource) && entry.initialLocation === ChatAgentLocation.Chat;
	}

	async removeHistoryEntry(sessionResource: URI): Promise<void> {
		await this._chatSessionStore.deleteSession(this.toLocalSessionId(sessionResource));
		this._onDidDisposeSession.fire({ sessionResource: [sessionResource], reason: 'cleared' });
	}

	async clearAllHistoryEntries(): Promise<void> {
		await this._chatSessionStore.clearAllSessions();
	}

	startSession(location: ChatAgentLocation, options?: IChatSessionStartOptions): IChatModelReference {
		this.trace('startSession');
		const sessionId = generateUuid();
		const sessionResource = LocalChatSessionUri.forSession(sessionId);
		return this._sessionModels.acquireOrCreate({
			initialData: undefined,
			location,
			sessionResource,
			sessionId,
			canUseTools: options?.canUseTools ?? true,
			disableBackgroundKeepAlive: options?.disableBackgroundKeepAlive
		});
	}

	private _startSession(props: IStartSessionProps): ChatModel {
		const { initialData, location, sessionResource, sessionId, canUseTools, transferEditingSession, disableBackgroundKeepAlive, inputState } = props;
		const model = this.instantiationService.createInstance(ChatModel, initialData, { initialLocation: location, canUseTools, resource: sessionResource, sessionId, disableBackgroundKeepAlive, inputState });
		if (location === ChatAgentLocation.Chat) {
			model.startEditingSession(true, transferEditingSession);
		}

		this.initializeSession(model);
		return model;
	}

	private initializeSession(model: ChatModel): void {
		this.trace('initializeSession', `Initialize session ${model.sessionResource}`);

		// Activate the default extension provided agent but do not wait
		// for it to be ready so that the session can be used immediately
		// without having to wait for the agent to be ready.
		this.activateDefaultAgent(model.initialLocation).catch(e => this.logService.error(e));
	}

	async activateDefaultAgent(location: ChatAgentLocation): Promise<void> {
		await this.extensionService.whenInstalledExtensionsRegistered();

		const defaultAgentData = this.chatAgentService.getContributedDefaultAgent(location) ?? this.chatAgentService.getContributedDefaultAgent(ChatAgentLocation.Chat);
		if (!defaultAgentData) {
			throw new ErrorNoTelemetry('No default agent contributed');
		}

		// Await activation of the extension provided agent
		// Using `activateById` as workaround for the issue
		// https://github.com/microsoft/vscode/issues/250590
		if (!defaultAgentData.isCore) {
			await this.extensionService.activateById(defaultAgentData.extensionId, {
				activationEvent: `onChatParticipant:${defaultAgentData.id}`,
				extensionId: defaultAgentData.extensionId,
				startup: false
			});
		}

		const defaultAgent = this.chatAgentService.getActivatedAgents().find(agent => agent.id === defaultAgentData.id);
		if (!defaultAgent) {
			throw new ErrorNoTelemetry('No default agent registered');
		}
	}

	getSession(sessionResource: URI): IChatModel | undefined {
		return this._sessionModels.get(sessionResource);
	}

	getActiveSessionReference(sessionResource: URI): IChatModelReference | undefined {
		return this._sessionModels.acquireExisting(sessionResource);
	}

	async getOrRestoreSession(sessionResource: URI): Promise<IChatModelReference | undefined> {
		this.trace('getOrRestoreSession', `${sessionResource}`);
		const existingRef = this._sessionModels.acquireExisting(sessionResource);
		if (existingRef) {
			return existingRef;
		}

		const sessionId = LocalChatSessionUri.parseLocalSessionId(sessionResource);
		if (!sessionId) {
			throw new Error(`Cannot restore non-local session ${sessionResource}`);
		}

		let sessionData: ISerializableChatData | undefined;
		if (this.transferredSessionData?.sessionId === sessionId) {
			sessionData = revive(this._persistedSessions[sessionId]);
		} else {
			sessionData = revive(await this._chatSessionStore.readSession(sessionId));
		}

		if (!sessionData) {
			return undefined;
		}

		const sessionRef = this._sessionModels.acquireOrCreate({
			initialData: sessionData,
			location: sessionData.initialLocation ?? ChatAgentLocation.Chat,
			sessionResource,
			sessionId,
			canUseTools: true,
		});

		const isTransferred = this.transferredSessionData?.sessionId === sessionId;
		if (isTransferred) {
			this._transferredSessionData = undefined;
		}

		return sessionRef;
	}

	/**
	 * This is really just for migrating data from the edit session location to the panel.
	 */
	isPersistedSessionEmpty(sessionResource: URI): boolean {
		const sessionId = LocalChatSessionUri.parseLocalSessionId(sessionResource);
		if (!sessionId) {
			throw new Error(`Cannot restore non-local session ${sessionResource}`);
		}

		const session = this._persistedSessions[sessionId];
		if (session) {
			return session.requests.length === 0;
		}

		return this._chatSessionStore.isSessionEmpty(sessionId);
	}

	getPersistedSessionTitle(sessionResource: URI): string | undefined {
		const sessionId = LocalChatSessionUri.parseLocalSessionId(sessionResource);
		if (!sessionId) {
			return undefined;
		}

		// First check the memory cache (_persistedSessions)
		const session = this._persistedSessions[sessionId];
		if (session) {
			const title = session.customTitle || ChatModel.getDefaultTitle(session.requests);
			return title;
		}

		// Try to read directly from file storage index
		// This handles the case where getName() is called before initialization completes
		// Access the internal synchronous index method via reflection
		// This is a workaround for the timing issue where initialization hasn't completed
		// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
		const internalGetIndex = (this._chatSessionStore as any).internalGetIndex;
		if (typeof internalGetIndex === 'function') {
			const indexData = internalGetIndex.call(this._chatSessionStore);
			const metadata = indexData.entries[sessionId];
			if (metadata && metadata.title) {
				return metadata.title;
			}
		}

		return undefined;
	}

	loadSessionFromContent(data: IExportableChatData | ISerializableChatData): IChatModelReference | undefined {
		const sessionId = 'sessionId' in data && data.sessionId ? data.sessionId : generateUuid();
		const sessionResource = LocalChatSessionUri.forSession(sessionId);
		return this._sessionModels.acquireOrCreate({
			initialData: data,
			location: data.initialLocation ?? ChatAgentLocation.Chat,
			sessionResource,
			sessionId,
			canUseTools: true,
		});
	}

	async loadSessionForResource(chatSessionResource: URI, location: ChatAgentLocation, token: CancellationToken): Promise<IChatModelReference | undefined> {
		// TODO: Move this into a new ChatModelService

		if (chatSessionResource.scheme === Schemas.vscodeLocalChatSession) {
			return this.getOrRestoreSession(chatSessionResource);
		}

		const existingRef = this._sessionModels.acquireExisting(chatSessionResource);
		if (existingRef) {
			return existingRef;
		}

		const providedSession = await this.chatSessionService.getOrCreateChatSession(chatSessionResource, CancellationToken.None);
		const chatSessionType = chatSessionResource.scheme;

		// Contributed sessions do not use UI tools
		const modelRef = this._sessionModels.acquireOrCreate({
			initialData: undefined,
			location,
			sessionResource: chatSessionResource,
			canUseTools: false,
			transferEditingSession: providedSession.transferredState?.editingSession,
			inputState: providedSession.transferredState?.inputState,
		});

		modelRef.object.setContributedChatSession({
			chatSessionResource,
			chatSessionType,
			isUntitled: chatSessionResource.path.startsWith('/untitled-')  //TODO(jospicer)
		});

		const model = modelRef.object;
		const disposables = new DisposableStore();
		disposables.add(modelRef.object.onDidDispose(() => {
			disposables.dispose();
			providedSession.dispose();
		}));

		let lastRequest: ChatRequestModel | undefined;
		for (const message of providedSession.history) {
			if (message.type === 'request') {
				if (lastRequest) {
					lastRequest.response?.complete();
				}

				const requestText = message.prompt;

				const parsedRequest: IParsedChatRequest = {
					text: requestText,
					parts: [new ChatRequestTextPart(
						new OffsetRange(0, requestText.length),
						{ startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: requestText.length + 1 },
						requestText
					)]
				};
				const agent =
					message.participant
						? this.chatAgentService.getAgent(message.participant) // TODO(jospicer): Remove and always hardcode?
						: this.chatAgentService.getAgent(chatSessionType);
				lastRequest = model.addRequest(parsedRequest,
					message.variableData ?? { variables: [] },
					0, // attempt
					undefined,
					agent,
					undefined, // slashCommand
					undefined, // confirmation
					undefined, // locationData
					undefined, // attachments
					false, // Do not treat as requests completed, else edit pills won't show.
					undefined,
					undefined,
					message.id
				);
			} else {
				// response
				if (lastRequest) {
					for (const part of message.parts) {
						model.acceptResponseProgress(lastRequest, part);
					}
				}
			}
		}

		if (providedSession.isCompleteObs?.get()) {
			lastRequest?.response?.complete();
		}

		if (providedSession.progressObs && lastRequest && providedSession.interruptActiveResponseCallback) {
			const initialCancellationRequest = this.instantiationService.createInstance(CancellableRequest, new CancellationTokenSource(), undefined);
			this._pendingRequests.set(model.sessionResource, initialCancellationRequest);
			const cancellationListener = disposables.add(new MutableDisposable());

			const createCancellationListener = (token: CancellationToken) => {
				return token.onCancellationRequested(() => {
					providedSession.interruptActiveResponseCallback?.().then(userConfirmedInterruption => {
						if (!userConfirmedInterruption) {
							// User cancelled the interruption
							const newCancellationRequest = this.instantiationService.createInstance(CancellableRequest, new CancellationTokenSource(), undefined);
							this._pendingRequests.set(model.sessionResource, newCancellationRequest);
							cancellationListener.value = createCancellationListener(newCancellationRequest.cancellationTokenSource.token);
						}
					});
				});
			};

			cancellationListener.value = createCancellationListener(initialCancellationRequest.cancellationTokenSource.token);

			let lastProgressLength = 0;
			disposables.add(autorun(reader => {
				const progressArray = providedSession.progressObs?.read(reader) ?? [];
				const isComplete = providedSession.isCompleteObs?.read(reader) ?? false;

				// Process only new progress items
				if (progressArray.length > lastProgressLength) {
					const newProgress = progressArray.slice(lastProgressLength);
					for (const progress of newProgress) {
						model?.acceptResponseProgress(lastRequest, progress);
					}
					lastProgressLength = progressArray.length;
				}

				// Handle completion
				if (isComplete) {
					lastRequest.response?.complete();
					cancellationListener.clear();
				}
			}));
		} else {
			if (lastRequest && model.editingSession) {
				// wait for timeline to load so that a 'changes' part is added when the response completes
				await chatEditingSessionIsReady(model.editingSession);
				lastRequest.response?.complete();
			}
		}

		return modelRef;
	}

	getChatSessionFromInternalUri(sessionResource: URI): IChatSessionContext | undefined {
		const model = this._sessionModels.get(sessionResource);
		if (!model) {
			return;
		}
		const { contributedChatSession } = model;
		return contributedChatSession;
	}

	async resendRequest(request: IChatRequestModel, options?: IChatSendRequestOptions): Promise<void> {
		const model = this._sessionModels.get(request.session.sessionResource);
		if (!model && model !== request.session) {
			throw new Error(`Unknown session: ${request.session.sessionResource}`);
		}

		const cts = this._pendingRequests.get(request.session.sessionResource);
		if (cts) {
			this.trace('resendRequest', `Session ${request.session.sessionResource} already has a pending request, cancelling...`);
			cts.cancel();
		}

		const location = options?.location ?? model.initialLocation;
		const attempt = options?.attempt ?? 0;
		const enableCommandDetection = !options?.noCommandDetection;
		const defaultAgent = this.chatAgentService.getDefaultAgent(location, options?.modeInfo?.kind)!;

		model.removeRequest(request.id, ChatRequestRemovalReason.Resend);

		const resendOptions: IChatSendRequestOptions = {
			...options,
			locationData: request.locationData,
			attachedContext: request.attachedContext,
		};
		await this._sendRequestAsync(model, model.sessionResource, request.message, attempt, enableCommandDetection, defaultAgent, location, resendOptions).responseCompletePromise;
	}

	async sendRequest(sessionResource: URI, request: string, options?: IChatSendRequestOptions): Promise<IChatSendRequestData | undefined> {
		this.trace('sendRequest', `sessionResource: ${sessionResource.toString()}, message: ${request.substring(0, 20)}${request.length > 20 ? '[...]' : ''}}`);


		if (!request.trim() && !options?.slashCommand && !options?.agentId && !options?.agentIdSilent) {
			this.trace('sendRequest', 'Rejected empty message');
			return;
		}

		const model = this._sessionModels.get(sessionResource);
		if (!model) {
			throw new Error(`Unknown session: ${sessionResource}`);
		}

		if (this._pendingRequests.has(sessionResource)) {
			this.trace('sendRequest', `Session ${sessionResource} already has a pending request`);
			return;
		}

		const requests = model.getRequests();
		for (let i = requests.length - 1; i >= 0; i -= 1) {
			const request = requests[i];
			if (request.shouldBeRemovedOnSend) {
				if (request.shouldBeRemovedOnSend.afterUndoStop) {
					request.response?.finalizeUndoState();
				} else {
					await this.removeRequest(sessionResource, request.id);
				}
			}
		}

		const location = options?.location ?? model.initialLocation;
		const attempt = options?.attempt ?? 0;
		const defaultAgent = this.chatAgentService.getDefaultAgent(location, options?.modeInfo?.kind)!;

		const parsedRequest = this.parseChatRequest(sessionResource, request, location, options);
		const silentAgent = options?.agentIdSilent ? this.chatAgentService.getAgent(options.agentIdSilent) : undefined;
		const agent = silentAgent ?? parsedRequest.parts.find((r): r is ChatRequestAgentPart => r instanceof ChatRequestAgentPart)?.agent ?? defaultAgent;
		const agentSlashCommandPart = parsedRequest.parts.find((r): r is ChatRequestAgentSubcommandPart => r instanceof ChatRequestAgentSubcommandPart);

		// This method is only returning whether the request was accepted - don't block on the actual request
		return {
			...this._sendRequestAsync(model, sessionResource, parsedRequest, attempt, !options?.noCommandDetection, silentAgent ?? defaultAgent, location, options),
			agent,
			slashCommand: agentSlashCommandPart?.command,
		};
	}

	private parseChatRequest(sessionResource: URI, request: string, location: ChatAgentLocation, options: IChatSendRequestOptions | undefined): IParsedChatRequest {
		let parserContext = options?.parserContext;
		if (options?.agentId) {
			const agent = this.chatAgentService.getAgent(options.agentId);
			if (!agent) {
				throw new Error(`Unknown agent: ${options.agentId}`);
			}
			parserContext = { selectedAgent: agent, mode: options.modeInfo?.kind };
			const commandPart = options.slashCommand ? ` ${chatSubcommandLeader}${options.slashCommand}` : '';
			request = `${chatAgentLeader}${agent.name}${commandPart} ${request}`;
		}

		const parsedRequest = this.instantiationService.createInstance(ChatRequestParser).parseChatRequest(sessionResource, request, location, parserContext);
		return parsedRequest;
	}

	private refreshFollowupsCancellationToken(sessionResource: URI): CancellationToken {
		this._sessionFollowupCancelTokens.get(sessionResource)?.cancel();
		const newTokenSource = new CancellationTokenSource();
		this._sessionFollowupCancelTokens.set(sessionResource, newTokenSource);

		return newTokenSource.token;
	}

	private _sendRequestAsync(model: ChatModel, sessionResource: URI, parsedRequest: IParsedChatRequest, attempt: number, enableCommandDetection: boolean, defaultAgent: IChatAgentData, location: ChatAgentLocation, options?: IChatSendRequestOptions): IChatSendRequestResponseState {
		const followupsCancelToken = this.refreshFollowupsCancellationToken(sessionResource);
		let request: ChatRequestModel;
		const agentPart = 'kind' in parsedRequest ? undefined : parsedRequest.parts.find((r): r is ChatRequestAgentPart => r instanceof ChatRequestAgentPart);
		const agentSlashCommandPart = 'kind' in parsedRequest ? undefined : parsedRequest.parts.find((r): r is ChatRequestAgentSubcommandPart => r instanceof ChatRequestAgentSubcommandPart);
		const commandPart = 'kind' in parsedRequest ? undefined : parsedRequest.parts.find((r): r is ChatRequestSlashCommandPart => r instanceof ChatRequestSlashCommandPart);
		const requests = [...model.getRequests()];
		const requestTelemetry = this.instantiationService.createInstance(ChatRequestTelemetry, {
			agent: agentPart?.agent ?? defaultAgent,
			agentSlashCommandPart,
			commandPart,
			sessionId: model.sessionId,
			location: model.initialLocation,
			options,
			enableCommandDetection
		});

		let gotProgress = false;
		const requestType = commandPart ? 'slashCommand' : 'string';

		const responseCreated = new DeferredPromise<IChatResponseModel>();
		let responseCreatedComplete = false;
		function completeResponseCreated(): void {
			if (!responseCreatedComplete && request?.response) {
				responseCreated.complete(request.response);
				responseCreatedComplete = true;
			}
		}

		const store = new DisposableStore();
		const source = store.add(new CancellationTokenSource());
		const token = source.token;
		const sendRequestInternal = async () => {
			const progressCallback = (progress: IChatProgress[]) => {
				if (token.isCancellationRequested) {
					return;
				}

				gotProgress = true;

				for (let i = 0; i < progress.length; i++) {
					const isLast = i === progress.length - 1;
					const progressItem = progress[i];

					if (progressItem.kind === 'markdownContent') {
						this.trace('sendRequest', `Provider returned progress for session ${model.sessionResource}, ${progressItem.content.value.length} chars`);
					} else {
						this.trace('sendRequest', `Provider returned progress: ${JSON.stringify(progressItem)}`);
					}

					model.acceptResponseProgress(request, progressItem, !isLast);
				}
				completeResponseCreated();
			};

			let detectedAgent: IChatAgentData | undefined;
			let detectedCommand: IChatAgentCommand | undefined;

			const stopWatch = new StopWatch(false);
			store.add(token.onCancellationRequested(() => {
				this.trace('sendRequest', `Request for session ${model.sessionResource} was cancelled`);
				if (!request) {
					return;
				}

				requestTelemetry.complete({
					timeToFirstProgress: undefined,
					result: 'cancelled',
					// Normally timings happen inside the EH around the actual provider. For cancellation we can measure how long the user waited before cancelling
					totalTime: stopWatch.elapsed(),
					requestType,
					detectedAgent,
					request,
				});

				model.cancelRequest(request);
			}));

			try {
				let rawResult: IChatAgentResult | null | undefined;
				let agentOrCommandFollowups: Promise<IChatFollowup[] | undefined> | undefined = undefined;
				if (agentPart || (defaultAgent && !commandPart)) {
					const prepareChatAgentRequest = (agent: IChatAgentData, command?: IChatAgentCommand, enableCommandDetection?: boolean, chatRequest?: ChatRequestModel, isParticipantDetected?: boolean): IChatAgentRequest => {
						const initVariableData: IChatRequestVariableData = { variables: [] };
						request = chatRequest ?? model.addRequest(parsedRequest, initVariableData, attempt, options?.modeInfo, agent, command, options?.confirmation, options?.locationData, options?.attachedContext, undefined, options?.userSelectedModelId, options?.userSelectedTools?.get());

						let variableData: IChatRequestVariableData;
						let message: string;
						if (chatRequest) {
							variableData = chatRequest.variableData;
							message = getPromptText(request.message).message;
						} else {
							variableData = { variables: this.prepareContext(request.attachedContext) };
							model.updateRequest(request, variableData);

							const promptTextResult = getPromptText(request.message);
							variableData = updateRanges(variableData, promptTextResult.diff); // TODO bit of a hack
							message = promptTextResult.message;
						}

						const agentRequest: IChatAgentRequest = {
							sessionResource: model.sessionResource,
							requestId: request.id,
							agentId: agent.id,
							message,
							command: command?.name,
							variables: variableData,
							enableCommandDetection,
							isParticipantDetected,
							attempt,
							location,
							locationData: request.locationData,
							acceptedConfirmationData: options?.acceptedConfirmationData,
							rejectedConfirmationData: options?.rejectedConfirmationData,
							userSelectedModelId: options?.userSelectedModelId,
							userSelectedTools: options?.userSelectedTools?.get(),
							modeInstructions: options?.modeInfo?.modeInstructions,
							editedFileEvents: request.editedFileEvents,
						};

						let isInitialTools = true;

						store.add(autorun(reader => {
							const tools = options?.userSelectedTools?.read(reader);
							if (isInitialTools) {
								isInitialTools = false;
								return;
							}

							if (tools) {
								this.chatAgentService.setRequestTools(agent.id, request.id, tools);
								// in case the request has not been sent out yet:
								agentRequest.userSelectedTools = tools;
							}
						}));

						return agentRequest;
					};

					if (
						this.configurationService.getValue('chat.detectParticipant.enabled') !== false &&
						this.chatAgentService.hasChatParticipantDetectionProviders() &&
						!agentPart &&
						!commandPart &&
						!agentSlashCommandPart &&
						enableCommandDetection &&
						(location !== ChatAgentLocation.EditorInline || !this.configurationService.getValue(InlineChatConfigKeys.EnableV2)) &&
						options?.modeInfo?.kind !== ChatModeKind.Agent &&
						options?.modeInfo?.kind !== ChatModeKind.Edit &&
						!options?.agentIdSilent
					) {
						// We have no agent or command to scope history with, pass the full history to the participant detection provider
						const defaultAgentHistory = this.getHistoryEntriesFromModel(requests, location, defaultAgent.id);

						// Prepare the request object that we will send to the participant detection provider
						const chatAgentRequest = prepareChatAgentRequest(defaultAgent, undefined, enableCommandDetection, undefined, false);

						const result = await this.chatAgentService.detectAgentOrCommand(chatAgentRequest, defaultAgentHistory, { location }, token);
						if (result && this.chatAgentService.getAgent(result.agent.id)?.locations?.includes(location)) {
							// Update the response in the ChatModel to reflect the detected agent and command
							request.response?.setAgent(result.agent, result.command);
							detectedAgent = result.agent;
							detectedCommand = result.command;
						}
					}

					const agent = (detectedAgent ?? agentPart?.agent ?? defaultAgent)!;
					const command = detectedCommand ?? agentSlashCommandPart?.command;

					await this.extensionService.activateByEvent(`onChatParticipant:${agent.id}`);

					// Recompute history in case the agent or command changed
					const history = this.getHistoryEntriesFromModel(requests, location, agent.id);
					const requestProps = prepareChatAgentRequest(agent, command, enableCommandDetection, request /* Reuse the request object if we already created it for participant detection */, !!detectedAgent);
					this.generateInitialChatTitleIfNeeded(model, requestProps, defaultAgent, token);
					const pendingRequest = this._pendingRequests.get(sessionResource);
					if (pendingRequest && !pendingRequest.requestId) {
						pendingRequest.requestId = requestProps.requestId;
					}
					completeResponseCreated();

					// MCP autostart: only run for native VS Code sessions (sidebar, new editors) but not for extension contributed sessions that have inputType set.
					if (model.canUseTools) {
						const autostartResult = new ChatMcpServersStarting(this.mcpService.autostart(token));
						if (!autostartResult.isEmpty) {
							progressCallback([autostartResult]);
							await autostartResult.wait();
						}
					}

					const agentResult = await this.chatAgentService.invokeAgent(agent.id, requestProps, progressCallback, history, token);
					rawResult = agentResult;
					agentOrCommandFollowups = this.chatAgentService.getFollowups(agent.id, requestProps, agentResult, history, followupsCancelToken);
				} else if (commandPart && this.chatSlashCommandService.hasCommand(commandPart.slashCommand.command)) {
					if (commandPart.slashCommand.silent !== true) {
						request = model.addRequest(parsedRequest, { variables: [] }, attempt, options?.modeInfo);
						completeResponseCreated();
					}
					// contributed slash commands
					// TODO: spell this out in the UI
					const history: IChatMessage[] = [];
					for (const modelRequest of model.getRequests()) {
						if (!modelRequest.response) {
							continue;
						}
						history.push({ role: ChatMessageRole.User, content: [{ type: 'text', value: modelRequest.message.text }] });
						history.push({ role: ChatMessageRole.Assistant, content: [{ type: 'text', value: modelRequest.response.response.toString() }] });
					}
					const message = parsedRequest.text;
					const commandResult = await this.chatSlashCommandService.executeCommand(commandPart.slashCommand.command, message.substring(commandPart.slashCommand.command.length + 1).trimStart(), new Progress<IChatProgress>(p => {
						progressCallback([p]);
					}), history, location, model.sessionResource, token);
					agentOrCommandFollowups = Promise.resolve(commandResult?.followUp);
					rawResult = {};

				} else {
					throw new Error(`Cannot handle request`);
				}

				if (token.isCancellationRequested && !rawResult) {
					return;
				} else {
					if (!rawResult) {
						this.trace('sendRequest', `Provider returned no response for session ${model.sessionResource}`);
						rawResult = { errorDetails: { message: localize('emptyResponse', "Provider returned null response") } };
					}

					const result = rawResult.errorDetails?.responseIsFiltered ? 'filtered' :
						rawResult.errorDetails && gotProgress ? 'errorWithOutput' :
							rawResult.errorDetails ? 'error' :
								'success';

					requestTelemetry.complete({
						timeToFirstProgress: rawResult.timings?.firstProgress,
						totalTime: rawResult.timings?.totalElapsed,
						result,
						requestType,
						detectedAgent,
						request,
					});

					model.setResponse(request, rawResult);
					completeResponseCreated();
					this.trace('sendRequest', `Provider returned response for session ${model.sessionResource}`);

					request.response?.complete();
					if (agentOrCommandFollowups) {
						agentOrCommandFollowups.then(followups => {
							model.setFollowups(request, followups);
							const commandForTelemetry = agentSlashCommandPart ? agentSlashCommandPart.command.name : commandPart?.slashCommand.command;
							this._chatServiceTelemetry.retrievedFollowups(agentPart?.agent.id ?? '', commandForTelemetry, followups?.length ?? 0);
						});
					}
				}
			} catch (err) {
				this.logService.error(`Error while handling chat request: ${toErrorMessage(err, true)}`);
				requestTelemetry.complete({
					timeToFirstProgress: undefined,
					totalTime: undefined,
					result: 'error',
					requestType,
					detectedAgent,
					request,
				});
				if (request) {
					const rawResult: IChatAgentResult = { errorDetails: { message: err.message } };
					model.setResponse(request, rawResult);
					completeResponseCreated();
					request.response?.complete();
				}
			} finally {
				store.dispose();
			}
		};
		const rawResponsePromise = sendRequestInternal();
		// Note- requestId is not known at this point, assigned later
		this._pendingRequests.set(model.sessionResource, this.instantiationService.createInstance(CancellableRequest, source, undefined));
		rawResponsePromise.finally(() => {
			this._pendingRequests.deleteAndDispose(model.sessionResource);
		});
		this._onDidSubmitRequest.fire({ chatSessionResource: model.sessionResource });
		return {
			responseCreatedPromise: responseCreated.p,
			responseCompletePromise: rawResponsePromise,
		};
	}

	private generateInitialChatTitleIfNeeded(model: ChatModel, request: IChatAgentRequest, defaultAgent: IChatAgentData, token: CancellationToken): void {
		// Generate a title only for the first request, and only via the default agent.
		// Use a single-entry history based on the current request (no full chat history).
		if (model.getRequests().length !== 1 || model.customTitle) {
			return;
		}

		const singleEntryHistory: IChatAgentHistoryEntry[] = [{
			request,
			response: [],
			result: {}
		}];
		const generate = async () => {
			const title = await this.chatAgentService.getChatTitle(defaultAgent.id, singleEntryHistory, token);
			if (title && !model.customTitle) {
				model.setCustomTitle(title);
			}
		};
		void generate();
	}

	private prepareContext(attachedContextVariables: IChatRequestVariableEntry[] | undefined): IChatRequestVariableEntry[] {
		attachedContextVariables ??= [];

		// "reverse", high index first so that replacement is simple
		attachedContextVariables.sort((a, b) => {
			// If either range is undefined, sort it to the back
			if (!a.range && !b.range) {
				return 0; // Keep relative order if both ranges are undefined
			}
			if (!a.range) {
				return 1; // a goes after b
			}
			if (!b.range) {
				return -1; // a goes before b
			}
			return b.range.start - a.range.start;
		});

		return attachedContextVariables;
	}

	private getHistoryEntriesFromModel(requests: IChatRequestModel[], location: ChatAgentLocation, forAgentId: string): IChatAgentHistoryEntry[] {
		const history: IChatAgentHistoryEntry[] = [];
		const agent = this.chatAgentService.getAgent(forAgentId);
		for (const request of requests) {
			if (!request.response) {
				continue;
			}

			if (forAgentId !== request.response.agent?.id && !agent?.isDefault && !agent?.canAccessPreviousChatHistory) {
				// An agent only gets to see requests that were sent to this agent.
				// The default agent (the undefined case), or agents with 'canAccessPreviousChatHistory', get to see all of them.
				continue;
			}

			// Do not save to history inline completions
			if (location === ChatAgentLocation.EditorInline) {
				continue;
			}

			const promptTextResult = getPromptText(request.message);
			const historyRequest: IChatAgentRequest = {
				sessionResource: request.session.sessionResource,
				requestId: request.id,
				agentId: request.response.agent?.id ?? '',
				message: promptTextResult.message,
				command: request.response.slashCommand?.name,
				variables: updateRanges(request.variableData, promptTextResult.diff), // TODO bit of a hack
				location: ChatAgentLocation.Chat,
				editedFileEvents: request.editedFileEvents,
			};
			history.push({ request: historyRequest, response: toChatHistoryContent(request.response.response.value), result: request.response.result ?? {} });
		}

		return history;
	}

	async removeRequest(sessionResource: URI, requestId: string): Promise<void> {
		const model = this._sessionModels.get(sessionResource);
		if (!model) {
			throw new Error(`Unknown session: ${sessionResource}`);
		}

		const pendingRequest = this._pendingRequests.get(sessionResource);
		if (pendingRequest?.requestId === requestId) {
			pendingRequest.cancel();
			this._pendingRequests.deleteAndDispose(sessionResource);
		}

		model.removeRequest(requestId);
	}

	async adoptRequest(sessionResource: URI, request: IChatRequestModel) {
		if (!(request instanceof ChatRequestModel)) {
			throw new TypeError('Can only adopt requests of type ChatRequestModel');
		}
		const target = this._sessionModels.get(sessionResource);
		if (!target) {
			throw new Error(`Unknown session: ${sessionResource}`);
		}

		const oldOwner = request.session;
		target.adoptRequest(request);

		if (request.response && !request.response.isComplete) {
			const cts = this._pendingRequests.deleteAndLeak(oldOwner.sessionResource);
			if (cts) {
				cts.requestId = request.id;
				this._pendingRequests.set(target.sessionResource, cts);
			}
		}
	}

	async addCompleteRequest(sessionResource: URI, message: IParsedChatRequest | string, variableData: IChatRequestVariableData | undefined, attempt: number | undefined, response: IChatCompleteResponse): Promise<void> {
		this.trace('addCompleteRequest', `message: ${message}`);

		const model = this._sessionModels.get(sessionResource);
		if (!model) {
			throw new Error(`Unknown session: ${sessionResource}`);
		}

		const parsedRequest = typeof message === 'string' ?
			this.instantiationService.createInstance(ChatRequestParser).parseChatRequest(sessionResource, message) :
			message;
		const request = model.addRequest(parsedRequest, variableData || { variables: [] }, attempt ?? 0, undefined, undefined, undefined, undefined, undefined, undefined, true);
		if (typeof response.message === 'string') {
			// TODO is this possible?
			model.acceptResponseProgress(request, { content: new MarkdownString(response.message), kind: 'markdownContent' });
		} else {
			for (const part of response.message) {
				model.acceptResponseProgress(request, part, true);
			}
		}
		model.setResponse(request, response.result || {});
		if (response.followups !== undefined) {
			model.setFollowups(request, response.followups);
		}
		request.response?.complete();
	}

	cancelCurrentRequestForSession(sessionResource: URI): void {
		this.trace('cancelCurrentRequestForSession', `session: ${sessionResource}`);
		this._pendingRequests.get(sessionResource)?.cancel();
		this._pendingRequests.deleteAndDispose(sessionResource);
	}

	public hasSessions(): boolean {
		return this._chatSessionStore.hasSessions();
	}

	transferChatSession(transferredSessionData: IChatTransferredSessionData, toWorkspace: URI): void {
		const model = Iterable.find(this._sessionModels.values(), model => model.sessionId === transferredSessionData.sessionId);
		if (!model) {
			throw new Error(`Failed to transfer session. Unknown session ID: ${transferredSessionData.sessionId}`);
		}

		const existingRaw: IChatTransfer2[] = this.storageService.getObject(TransferredGlobalChatKey, StorageScope.PROFILE, []);
		existingRaw.push({
			chat: model.toJSON(),
			timestampInMilliseconds: Date.now(),
			toWorkspace: toWorkspace,
			inputState: transferredSessionData.inputState,
			location: transferredSessionData.location,
		});

		this.storageService.store(TransferredGlobalChatKey, JSON.stringify(existingRaw), StorageScope.PROFILE, StorageTarget.MACHINE);
		this.chatTransferService.addWorkspaceToTransferred(toWorkspace);
		this.trace('transferChatSession', `Transferred session ${model.sessionResource} to workspace ${toWorkspace.toString()}`);
	}

	getChatStorageFolder(): URI {
		return this._chatSessionStore.getChatStorageFolder();
	}

	logChatIndex(): void {
		this._chatSessionStore.logIndex();
	}

	setTitle(sessionResource: URI, title: string): void {
		this._sessionModels.get(sessionResource)?.setCustomTitle(title);
	}

	appendProgress(request: IChatRequestModel, progress: IChatProgress): void {
		const model = this._sessionModels.get(request.session.sessionResource);
		if (!(request instanceof ChatRequestModel)) {
			throw new BugIndicatingError('Can only append progress to requests of type ChatRequestModel');
		}

		model?.acceptResponseProgress(request, progress);
	}

	private toLocalSessionId(sessionResource: URI) {
		const localSessionId = LocalChatSessionUri.parseLocalSessionId(sessionResource);
		if (!localSessionId) {
			throw new Error(`Invalid local chat session resource: ${sessionResource}`);
		}
		return localSessionId;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatServiceTelemetry.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatServiceTelemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { isLocation } from '../../../../editor/common/languages.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IChatAgentData } from './chatAgents.js';
import { ChatRequestModel, IChatRequestVariableData } from './chatModel.js';
import { ChatRequestAgentSubcommandPart, ChatRequestSlashCommandPart } from './chatParserTypes.js';
import { ChatAgentVoteDirection, ChatCopyKind, IChatSendRequestOptions, IChatUserActionEvent } from './chatService.js';
import { isImageVariableEntry } from './chatVariableEntries.js';
import { ChatAgentLocation } from './constants.js';
import { ILanguageModelsService } from './languageModels.js';

type ChatVoteEvent = {
	direction: 'up' | 'down';
	agentId: string;
	command: string | undefined;
	reason: string | undefined;
};

type ChatVoteClassification = {
	direction: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the user voted up or down.' };
	agentId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the chat agent that this vote is for.' };
	command: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The name of the slash command that this vote is for.' };
	reason: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The reason selected by the user for voting down.' };
	owner: 'roblourens';
	comment: 'Provides insight into the performance of Chat agents.';
};

type ChatCopyEvent = {
	copyKind: 'action' | 'toolbar';
	agentId: string;
	command: string | undefined;
};

type ChatCopyClassification = {
	copyKind: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'How the copy was initiated.' };
	agentId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the chat agent that the copy acted on.' };
	command: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The name of the slash command the copy acted on.' };
	owner: 'roblourens';
	comment: 'Provides insight into the usage of Chat features.';
};

type ChatInsertEvent = {
	newFile: boolean;
	agentId: string;
	command: string | undefined;
};

type ChatInsertClassification = {
	newFile: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the code was inserted into a new untitled file.' };
	agentId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the chat agent that this insertion is for.' };
	command: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The name of the slash command that this insertion is for.' };
	owner: 'roblourens';
	comment: 'Provides insight into the usage of Chat features.';
};

type ChatApplyEvent = {
	newFile: boolean;
	agentId: string;
	command: string | undefined;
	codeMapper: string | undefined;
	editsProposed: boolean;
};

type ChatApplyClassification = {
	newFile: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the code was inserted into a new untitled file.' };
	agentId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the chat agent that this insertion is for.' };
	command: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The name of the slash command that this insertion is for.' };
	codeMapper: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The code mapper that wa used to compute the edit.' };
	editsProposed: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether there was a change proposed to the user.' };
	owner: 'aeschli';
	comment: 'Provides insight into the usage of Chat features.';
};

type ChatFollowupEvent = {
	agentId: string;
	command: string | undefined;
};

type ChatFollowupClassification = {
	agentId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the related chat agent.' };
	command: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The name of the related slash command.' };
	owner: 'roblourens';
	comment: 'Provides insight into the usage of Chat features.';
};

type ChatTerminalEvent = {
	languageId: string;
	agentId: string;
	command: string | undefined;
};

type ChatTerminalClassification = {
	languageId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The language of the code that was run in the terminal.' };
	agentId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the related chat agent.' };
	command: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The name of the related slash command.' };
	owner: 'roblourens';
	comment: 'Provides insight into the usage of Chat features.';
};

type ChatFollowupsRetrievedEvent = {
	agentId: string;
	command: string | undefined;
	numFollowups: number;
};

type ChatFollowupsRetrievedClassification = {
	agentId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the related chat agent.' };
	command: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The name of the related slash command.' };
	numFollowups: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of followup prompts returned by the agent.' };
	owner: 'roblourens';
	comment: 'Provides insight into the usage of Chat features.';
};

type ChatEditHunkEvent = {
	agentId: string;
	outcome: 'accepted' | 'rejected';
	lineCount: number;
	hasRemainingEdits: boolean;
};

type ChatEditHunkClassification = {
	agentId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the related chat agent.' };
	outcome: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The outcome of the edit hunk action.' };
	lineCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of lines in the relevant change.' };
	hasRemainingEdits: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether there are remaining edits in the file after this action.' };
	owner: 'roblourens';
	comment: 'Provides insight into the usage of Chat features.';
};

export type ChatProviderInvokedEvent = {
	timeToFirstProgress: number | undefined;
	totalTime: number | undefined;
	result: 'success' | 'error' | 'errorWithOutput' | 'cancelled' | 'filtered';
	requestType: 'string' | 'followup' | 'slashCommand';
	chatSessionId: string;
	agent: string;
	agentExtensionId: string | undefined;
	slashCommand: string | undefined;
	location: ChatAgentLocation;
	citations: number;
	numCodeBlocks: number;
	isParticipantDetected: boolean;
	enableCommandDetection: boolean;
	attachmentKinds: string[];
	model: string | undefined;
};

export type ChatProviderInvokedClassification = {
	timeToFirstProgress: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The time in milliseconds from invoking the provider to getting the first data.' };
	totalTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The total time it took to run the provider\'s `provideResponseWithProgress`.' };
	result: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether invoking the ChatProvider resulted in an error.' };
	requestType: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The type of request that the user made.' };
	chatSessionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'A random ID for the session.' };
	agent: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The type of agent used.' };
	agentExtensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The extension that contributed the agent.' };
	slashCommand?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The type of slashCommand used.' };
	location: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The location at which chat request was made.' };
	citations: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of public code citations that were returned with the response.' };
	numCodeBlocks: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The number of code blocks in the response.' };
	isParticipantDetected: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the participant was automatically detected.' };
	enableCommandDetection: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether participation detection was disabled for this invocation.' };
	attachmentKinds: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The types of variables/attachments that the user included with their query.' };
	model: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The model used to generate the response.' };
	owner: 'roblourens';
	comment: 'Provides insight into the performance of Chat agents.';
};

export class ChatServiceTelemetry {
	constructor(
		@ITelemetryService private readonly telemetryService: ITelemetryService,
	) { }

	notifyUserAction(action: IChatUserActionEvent): void {
		if (action.action.kind === 'vote') {
			this.telemetryService.publicLog2<ChatVoteEvent, ChatVoteClassification>('interactiveSessionVote', {
				direction: action.action.direction === ChatAgentVoteDirection.Up ? 'up' : 'down',
				agentId: action.agentId ?? '',
				command: action.command,
				reason: action.action.reason,
			});
		} else if (action.action.kind === 'copy') {
			this.telemetryService.publicLog2<ChatCopyEvent, ChatCopyClassification>('interactiveSessionCopy', {
				copyKind: action.action.copyKind === ChatCopyKind.Action ? 'action' : 'toolbar',
				agentId: action.agentId ?? '',
				command: action.command,
			});
		} else if (action.action.kind === 'insert') {
			this.telemetryService.publicLog2<ChatInsertEvent, ChatInsertClassification>('interactiveSessionInsert', {
				newFile: !!action.action.newFile,
				agentId: action.agentId ?? '',
				command: action.command,
			});
		} else if (action.action.kind === 'apply') {
			this.telemetryService.publicLog2<ChatApplyEvent, ChatApplyClassification>('interactiveSessionApply', {
				newFile: !!action.action.newFile,
				codeMapper: action.action.codeMapper,
				agentId: action.agentId ?? '',
				command: action.command,
				editsProposed: !!action.action.editsProposed,
			});
		} else if (action.action.kind === 'runInTerminal') {
			this.telemetryService.publicLog2<ChatTerminalEvent, ChatTerminalClassification>('interactiveSessionRunInTerminal', {
				languageId: action.action.languageId ?? '',
				agentId: action.agentId ?? '',
				command: action.command,
			});
		} else if (action.action.kind === 'followUp') {
			this.telemetryService.publicLog2<ChatFollowupEvent, ChatFollowupClassification>('chatFollowupClicked', {
				agentId: action.agentId ?? '',
				command: action.command,
			});
		} else if (action.action.kind === 'chatEditingHunkAction') {
			this.telemetryService.publicLog2<ChatEditHunkEvent, ChatEditHunkClassification>('chatEditHunk', {
				agentId: action.agentId ?? '',
				outcome: action.action.outcome,
				lineCount: action.action.lineCount,
				hasRemainingEdits: action.action.hasRemainingEdits,
			});
		}
	}

	retrievedFollowups(agentId: string, command: string | undefined, numFollowups: number): void {
		this.telemetryService.publicLog2<ChatFollowupsRetrievedEvent, ChatFollowupsRetrievedClassification>('chatFollowupsRetrieved', {
			agentId,
			command,
			numFollowups,
		});
	}
}

function getCodeBlocks(text: string): string[] {
	const lines = text.split('\n');
	const codeBlockLanguages: string[] = [];

	let codeBlockState: undefined | { readonly delimiter: string; readonly languageId: string };
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		if (codeBlockState) {
			if (new RegExp(`^\\s*${codeBlockState.delimiter}\\s*$`).test(line)) {
				codeBlockLanguages.push(codeBlockState.languageId);
				codeBlockState = undefined;
			}
		} else {
			const match = line.match(/^(\s*)(`{3,}|~{3,})(\w*)/);
			if (match) {
				codeBlockState = { delimiter: match[2], languageId: match[3] };
			}
		}
	}
	return codeBlockLanguages;
}

export class ChatRequestTelemetry {
	private isComplete = false;

	constructor(private readonly opts: {
		agent: IChatAgentData;
		agentSlashCommandPart: ChatRequestAgentSubcommandPart | undefined;
		commandPart: ChatRequestSlashCommandPart | undefined;
		sessionId: string;
		location: ChatAgentLocation;
		options: IChatSendRequestOptions | undefined;
		enableCommandDetection: boolean;
	},
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ILanguageModelsService private readonly languageModelsService: ILanguageModelsService
	) { }

	complete({ timeToFirstProgress, totalTime, result, requestType, request, detectedAgent }: {
		timeToFirstProgress: number | undefined;
		totalTime: number | undefined;
		result: ChatProviderInvokedEvent['result'];
		requestType: ChatProviderInvokedEvent['requestType'];
		// Should rearrange so these 2 can be in the constructor
		request: ChatRequestModel;
		detectedAgent: IChatAgentData | undefined;
	}) {
		if (this.isComplete) {
			return;
		}

		this.isComplete = true;
		this.telemetryService.publicLog2<ChatProviderInvokedEvent, ChatProviderInvokedClassification>('interactiveSessionProviderInvoked', {
			timeToFirstProgress,
			totalTime,
			result,
			requestType,
			agent: detectedAgent?.id ?? this.opts.agent.id,
			agentExtensionId: detectedAgent?.extensionId.value ?? this.opts.agent.extensionId.value,
			slashCommand: this.opts.agentSlashCommandPart ? this.opts.agentSlashCommandPart.command.name : this.opts.commandPart?.slashCommand.command,
			chatSessionId: this.opts.sessionId,
			enableCommandDetection: this.opts.enableCommandDetection,
			isParticipantDetected: !!detectedAgent,
			location: this.opts.location,
			citations: request.response?.codeCitations.length ?? 0,
			numCodeBlocks: getCodeBlocks(request.response?.response.toString() ?? '').length,
			attachmentKinds: this.attachmentKindsForTelemetry(request.variableData),
			model: this.resolveModelId(this.opts.options?.userSelectedModelId),
		});
	}

	private attachmentKindsForTelemetry(variableData: IChatRequestVariableData): string[] {
		// this shows why attachments still have to be cleaned up somewhat
		return variableData.variables.map(v => {
			if (v.kind === 'implicit') {
				return 'implicit';
			} else if (v.range) {
				// 'range' is range within the prompt text
				if (v.kind === 'tool') {
					return 'toolInPrompt';
				} else if (v.kind === 'toolset') {
					return 'toolsetInPrompt';
				} else {
					return 'fileInPrompt';
				}
			} else if (v.kind === 'command') {
				return 'command';
			} else if (v.kind === 'symbol') {
				return 'symbol';
			} else if (isImageVariableEntry(v)) {
				return 'image';
			} else if (v.kind === 'directory') {
				return 'directory';
			} else if (v.kind === 'tool') {
				return 'tool';
			} else if (v.kind === 'toolset') {
				return 'toolset';
			} else {
				if (URI.isUri(v.value)) {
					return 'file';
				} else if (isLocation(v.value)) {
					return 'location';
				} else {
					return 'otherAttachment';
				}
			}
		});
	}

	private resolveModelId(userSelectedModelId: string | undefined): string | undefined {
		return userSelectedModelId && this.languageModelsService.lookupLanguageModel(userSelectedModelId)?.id;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatSessionsService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatSessionsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable } from '../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IChatAgentAttachmentCapabilities, IChatAgentRequest } from './chatAgents.js';
import { IChatEditingSession } from './chatEditingService.js';
import { IChatModel, IChatRequestVariableData, ISerializableChatModelInputState } from './chatModel.js';
import { IChatProgress, IChatService } from './chatService.js';

export const enum ChatSessionStatus {
	Failed = 0,
	Completed = 1,
	InProgress = 2,
	NeedsInput = 3
}

export interface IChatSessionCommandContribution {
	name: string;
	description: string;
	when?: string;
}

export interface IChatSessionProviderOptionItem {
	id: string;
	name: string;
	description?: string;
	locked?: boolean;
	icon?: ThemeIcon;
	// [key: string]: any;
}

export interface IChatSessionProviderOptionGroup {
	id: string;
	name: string;
	description?: string;
	items: IChatSessionProviderOptionItem[];
}

export interface IChatSessionsExtensionPoint {
	readonly type: string;
	readonly name: string;
	readonly displayName: string;
	readonly description: string;
	readonly when?: string;
	readonly icon?: string | { light: string; dark: string };
	readonly order?: number;
	readonly alternativeIds?: string[];
	readonly welcomeTitle?: string;
	readonly welcomeMessage?: string;
	readonly welcomeTips?: string;
	readonly inputPlaceholder?: string;
	readonly capabilities?: IChatAgentAttachmentCapabilities;
	readonly commands?: IChatSessionCommandContribution[];
	readonly canDelegate?: boolean;
}
export interface IChatSessionItem {
	resource: URI;
	label: string;
	iconPath?: ThemeIcon;
	badge?: string | IMarkdownString;
	description?: string | IMarkdownString;
	status?: ChatSessionStatus;
	tooltip?: string | IMarkdownString;
	timing: {
		startTime: number;
		endTime?: number;
	};
	changes?: {
		files: number;
		insertions: number;
		deletions: number;
	} | readonly IChatSessionFileChange[];
	archived?: boolean;
}

export interface IChatSessionFileChange {
	modifiedUri: URI;
	originalUri?: URI;
	insertions: number;
	deletions: number;
}

export type IChatSessionHistoryItem = {
	id?: string;
	type: 'request';
	prompt: string;
	participant: string;
	command?: string;
	variableData?: IChatRequestVariableData;
} | {
	type: 'response';
	parts: IChatProgress[];
	participant: string;
};

/**
 * The session type used for local agent chat sessions.
 */
export const localChatSessionType = 'local';

export interface IChatSession extends IDisposable {
	readonly onWillDispose: Event<void>;

	readonly sessionResource: URI;

	readonly history: readonly IChatSessionHistoryItem[];

	/**
	 * Session options as key-value pairs. Keys correspond to option group IDs (e.g., 'models', 'subagents')
	 * and values are either the selected option item IDs (string) or full option items (for locked state).
	 */
	readonly options?: Record<string, string | IChatSessionProviderOptionItem>;

	readonly progressObs?: IObservable<IChatProgress[]>;
	readonly isCompleteObs?: IObservable<boolean>;
	readonly interruptActiveResponseCallback?: () => Promise<boolean>;

	/**
	 * Editing session transferred from a previously-untitled chat session in `onDidCommitChatSessionItem`.
	 */
	transferredState?: {
		editingSession: IChatEditingSession | undefined;
		inputState: ISerializableChatModelInputState | undefined;
	};

	requestHandler?: (
		request: IChatAgentRequest,
		progress: (progress: IChatProgress[]) => void,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		history: any[], // TODO: Nail down types
		token: CancellationToken
	) => Promise<void>;
}

export interface IChatSessionItemProvider {
	readonly chatSessionType: string;
	readonly onDidChangeChatSessionItems: Event<void>;
	provideChatSessionItems(token: CancellationToken): Promise<IChatSessionItem[]>;
}

export interface IChatSessionContentProvider {
	provideChatSessionContent(sessionResource: URI, token: CancellationToken): Promise<IChatSession>;
}

export type SessionOptionsChangedCallback = (sessionResource: URI, updates: ReadonlyArray<{
	optionId: string;
	value: string | IChatSessionProviderOptionItem;
}>) => Promise<void>;

export interface IChatSessionsService {
	readonly _serviceBrand: undefined;

	// #region Chat session item provider support
	readonly onDidChangeItemsProviders: Event<IChatSessionItemProvider>;
	readonly onDidChangeSessionItems: Event<string>;

	readonly onDidChangeAvailability: Event<void>;
	readonly onDidChangeInProgress: Event<void>;

	getChatSessionContribution(chatSessionType: string): IChatSessionsExtensionPoint | undefined;

	registerChatSessionItemProvider(provider: IChatSessionItemProvider): IDisposable;
	activateChatSessionItemProvider(chatSessionType: string): Promise<IChatSessionItemProvider | undefined>;
	getAllChatSessionItemProviders(): IChatSessionItemProvider[];

	getAllChatSessionContributions(): IChatSessionsExtensionPoint[];
	getIconForSessionType(chatSessionType: string): ThemeIcon | URI | undefined;
	getWelcomeTitleForSessionType(chatSessionType: string): string | undefined;
	getWelcomeMessageForSessionType(chatSessionType: string): string | undefined;
	getInputPlaceholderForSessionType(chatSessionType: string): string | undefined;

	/**
	 * Get the list of chat session items grouped by session type.
	 */
	getAllChatSessionItems(token: CancellationToken): Promise<Array<{ readonly chatSessionType: string; readonly items: IChatSessionItem[] }>>;

	reportInProgress(chatSessionType: string, count: number): void;
	getInProgress(): { displayName: string; count: number }[];

	// Notify providers about session items changes
	notifySessionItemsChanged(chatSessionType: string): void;
	// #endregion

	// #region Content provider support
	readonly onDidChangeContentProviderSchemes: Event<{ readonly added: string[]; readonly removed: string[] }>;

	getContentProviderSchemes(): string[];

	registerChatSessionContentProvider(scheme: string, provider: IChatSessionContentProvider): IDisposable;
	canResolveChatSession(sessionResource: URI): Promise<boolean>;
	getOrCreateChatSession(sessionResource: URI, token: CancellationToken): Promise<IChatSession>;

	hasAnySessionOptions(sessionResource: URI): boolean;
	getSessionOption(sessionResource: URI, optionId: string): string | IChatSessionProviderOptionItem | undefined;
	setSessionOption(sessionResource: URI, optionId: string, value: string | IChatSessionProviderOptionItem): boolean;

	/**
	 * Fired when options for a chat session change.
	 */
	onDidChangeSessionOptions: Event<URI>;

	/**
	 * Get the capabilities for a specific session type
	 */
	getCapabilitiesForSessionType(chatSessionType: string): IChatAgentAttachmentCapabilities | undefined;
	onDidChangeOptionGroups: Event<string>;

	getOptionGroupsForSessionType(chatSessionType: string): IChatSessionProviderOptionGroup[] | undefined;
	setOptionGroupsForSessionType(chatSessionType: string, handle: number, optionGroups?: IChatSessionProviderOptionGroup[]): void;
	setOptionsChangeCallback(callback: SessionOptionsChangedCallback): void;
	notifySessionOptionsChange(sessionResource: URI, updates: ReadonlyArray<{ optionId: string; value: string | IChatSessionProviderOptionItem }>): Promise<void>;

	registerChatModelChangeListeners(chatService: IChatService, chatSessionType: string, onChange: () => void): IDisposable;
	getInProgressSessionDescription(chatModel: IChatModel): string | undefined;
}

export function isSessionInProgressStatus(state: ChatSessionStatus): boolean {
	return state === ChatSessionStatus.InProgress || state === ChatSessionStatus.NeedsInput;
}

export const IChatSessionsService = createDecorator<IChatSessionsService>('chatSessionsService');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatSessionStore.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatSessionStore.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Sequencer } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { revive } from '../../../../base/common/marshalling.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { FileOperationResult, IFileService, toFileOperationResult } from '../../../../platform/files/common/files.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { awaitStatsForSession } from './chat.js';
import { ModifiedFileEntryState } from './chatEditingService.js';
import { ChatModel, IChatModelInputState, ISerializableChatData, ISerializableChatDataIn, ISerializableChatsData, normalizeSerializableChatData } from './chatModel.js';
import { IChatSessionStats, IChatSessionTiming, ResponseModelState } from './chatService.js';
import { LocalChatSessionUri } from './chatUri.js';
import { ChatAgentLocation } from './constants.js';

const maxPersistedSessions = 25;

const ChatIndexStorageKey = 'chat.ChatSessionStore.index';
// const ChatTransferIndexStorageKey = 'ChatSessionStore.transferIndex';

export class ChatSessionStore extends Disposable {
	private readonly storageRoot: URI;
	private readonly previousEmptyWindowStorageRoot: URI | undefined;
	// private readonly transferredSessionStorageRoot: URI;

	private readonly storeQueue = new Sequencer();

	private storeTask: Promise<void> | undefined;
	private shuttingDown = false;

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@ILogService private readonly logService: ILogService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IStorageService private readonly storageService: IStorageService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
	) {
		super();

		const workspace = this.workspaceContextService.getWorkspace();
		const isEmptyWindow = !workspace.configuration && workspace.folders.length === 0;
		const workspaceId = this.workspaceContextService.getWorkspace().id;
		this.storageRoot = isEmptyWindow ?
			joinPath(this.userDataProfilesService.defaultProfile.globalStorageHome, 'emptyWindowChatSessions') :
			joinPath(this.environmentService.workspaceStorageHome, workspaceId, 'chatSessions');

		this.previousEmptyWindowStorageRoot = isEmptyWindow ?
			joinPath(this.environmentService.workspaceStorageHome, 'no-workspace', 'chatSessions') :
			undefined;

		// TODO tmpdir
		// this.transferredSessionStorageRoot = joinPath(this.environmentService.workspaceStorageHome, 'transferredChatSessions');

		this._register(this.lifecycleService.onWillShutdown(e => {
			this.shuttingDown = true;
			if (!this.storeTask) {
				return;
			}

			e.join(this.storeTask, {
				id: 'join.chatSessionStore',
				label: localize('join.chatSessionStore', "Saving chat history")
			});
		}));
	}

	async storeSessions(sessions: ChatModel[]): Promise<void> {
		if (this.shuttingDown) {
			// Don't start this task if we missed the chance to block shutdown
			return;
		}

		try {
			this.storeTask = this.storeQueue.queue(async () => {
				try {
					await Promise.all(sessions.map(session => this.writeSession(session)));
					await this.trimEntries();
					await this.flushIndex();
				} catch (e) {
					this.reportError('storeSessions', 'Error storing chat sessions', e);
				}
			});
			await this.storeTask;
		} finally {
			this.storeTask = undefined;
		}
	}

	async storeSessionsMetadataOnly(sessions: ChatModel[]): Promise<void> {
		if (this.shuttingDown) {
			// Don't start this task if we missed the chance to block shutdown
			return;
		}

		try {
			this.storeTask = this.storeQueue.queue(async () => {
				try {
					await Promise.all(sessions.map(session => this.writeSessionMetadataOnly(session)));
					await this.flushIndex();
				} catch (e) {
					this.reportError('storeSessions', 'Error storing chat sessions', e);
				}
			});
			await this.storeTask;
		} finally {
			this.storeTask = undefined;
		}
	}

	// async storeTransferSession(transferData: IChatTransfer, session: ISerializableChatData): Promise<void> {
	// 	try {
	// 		const content = JSON.stringify(session, undefined, 2);
	// 		await this.fileService.writeFile(this.transferredSessionStorageRoot, VSBuffer.fromString(content));
	// 	} catch (e) {
	// 		this.reportError('sessionWrite', 'Error writing chat session', e);
	// 		return;
	// 	}

	// 	const index = this.getTransferredSessionIndex();
	// 	index[transferData.toWorkspace.toString()] = transferData;
	// 	try {
	// 		this.storageService.store(ChatTransferIndexStorageKey, index, StorageScope.PROFILE, StorageTarget.MACHINE);
	// 	} catch (e) {
	// 		this.reportError('storeTransferSession', 'Error storing chat transfer session', e);
	// 	}
	// }

	// private getTransferredSessionIndex(): IChatTransferIndex {
	// 	try {
	// 		const data: IChatTransferIndex = this.storageService.getObject(ChatTransferIndexStorageKey, StorageScope.PROFILE, {});
	// 		return data;
	// 	} catch (e) {
	// 		this.reportError('getTransferredSessionIndex', 'Error reading chat transfer index', e);
	// 		return {};
	// 	}
	// }

	private async writeSession(session: ChatModel | ISerializableChatData): Promise<void> {
		try {
			const index = this.internalGetIndex();
			const storageLocation = this.getStorageLocation(session.sessionId);
			const content = JSON.stringify(session, undefined, 2);
			await this.fileService.writeFile(storageLocation, VSBuffer.fromString(content));

			// Write succeeded, update index
			index.entries[session.sessionId] = await getSessionMetadata(session);
		} catch (e) {
			this.reportError('sessionWrite', 'Error writing chat session', e);
		}
	}

	private async writeSessionMetadataOnly(session: ChatModel): Promise<void> {
		// Only to be used for external sessions
		if (LocalChatSessionUri.parseLocalSessionId(session.sessionResource)) {
			return;
		}

		try {
			const index = this.internalGetIndex();

			// TODO get this class on sessionResource
			const externalSessionId = session.sessionResource.toString();
			index.entries[externalSessionId] = await getSessionMetadata(session);
		} catch (e) {
			this.reportError('sessionMetadataWrite', 'Error writing chat session metadata', e);
		}
	}

	private async flushIndex(): Promise<void> {
		const index = this.internalGetIndex();
		try {
			this.storageService.store(ChatIndexStorageKey, index, this.getIndexStorageScope(), StorageTarget.MACHINE);
		} catch (e) {
			// Only if JSON.stringify fails, AFAIK
			this.reportError('indexWrite', 'Error writing index', e);
		}
	}

	private getIndexStorageScope(): StorageScope {
		const workspace = this.workspaceContextService.getWorkspace();
		const isEmptyWindow = !workspace.configuration && workspace.folders.length === 0;
		return isEmptyWindow ? StorageScope.APPLICATION : StorageScope.WORKSPACE;
	}

	private async trimEntries(): Promise<void> {
		const index = this.internalGetIndex();
		const entries = Object.entries(index.entries)
			.filter(([_id, entry]) => !entry.isExternal)
			.sort((a, b) => b[1].lastMessageDate - a[1].lastMessageDate)
			.map(([id]) => id);

		if (entries.length > maxPersistedSessions) {
			const entriesToDelete = entries.slice(maxPersistedSessions);
			for (const entry of entriesToDelete) {
				delete index.entries[entry];
			}

			this.logService.trace(`ChatSessionStore: Trimmed ${entriesToDelete.length} old chat sessions from index`);
		}
	}

	private async internalDeleteSession(sessionId: string): Promise<void> {
		const index = this.internalGetIndex();
		if (!index.entries[sessionId]) {
			return;
		}

		const storageLocation = this.getStorageLocation(sessionId);
		try {
			await this.fileService.del(storageLocation);
		} catch (e) {
			if (toFileOperationResult(e) !== FileOperationResult.FILE_NOT_FOUND) {
				this.reportError('sessionDelete', 'Error deleting chat session', e);
			}
		} finally {
			delete index.entries[sessionId];
		}
	}

	hasSessions(): boolean {
		return Object.keys(this.internalGetIndex().entries).length > 0;
	}

	isSessionEmpty(sessionId: string): boolean {
		const index = this.internalGetIndex();
		return index.entries[sessionId]?.isEmpty ?? true;
	}

	async deleteSession(sessionId: string): Promise<void> {
		await this.storeQueue.queue(async () => {
			await this.internalDeleteSession(sessionId);
			await this.flushIndex();
		});
	}

	async clearAllSessions(): Promise<void> {
		await this.storeQueue.queue(async () => {
			const index = this.internalGetIndex();
			const entries = Object.keys(index.entries);
			this.logService.info(`ChatSessionStore: Clearing ${entries.length} chat sessions`);
			await Promise.all(entries.map(entry => this.internalDeleteSession(entry)));
			await this.flushIndex();
		});
	}

	public async setSessionTitle(sessionId: string, title: string): Promise<void> {
		await this.storeQueue.queue(async () => {
			const index = this.internalGetIndex();
			if (index.entries[sessionId]) {
				index.entries[sessionId].title = title;
			}
		});
	}

	private reportError(reasonForTelemetry: string, message: string, error?: Error): void {
		this.logService.error(`ChatSessionStore: ` + message, toErrorMessage(error));

		const fileOperationReason = error && toFileOperationResult(error);
		type ChatSessionStoreErrorData = {
			reason: string;
			fileOperationReason: number;
			// error: Error;
		};
		type ChatSessionStoreErrorClassification = {
			owner: 'roblourens';
			comment: 'Detect issues related to managing chat sessions';
			reason: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Info about the error that occurred' };
			fileOperationReason: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'An error code from the file service' };
			// error: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Info about the error that occurred' };
		};
		this.telemetryService.publicLog2<ChatSessionStoreErrorData, ChatSessionStoreErrorClassification>('chatSessionStoreError', {
			reason: reasonForTelemetry,
			fileOperationReason: fileOperationReason ?? -1
		});
	}

	private indexCache: IChatSessionIndexData | undefined;
	private internalGetIndex(): IChatSessionIndexData {
		if (this.indexCache) {
			return this.indexCache;
		}

		const data = this.storageService.get(ChatIndexStorageKey, this.getIndexStorageScope(), undefined);
		if (!data) {
			this.indexCache = { version: 1, entries: {} };
			return this.indexCache;
		}

		try {
			const index = JSON.parse(data) as unknown;
			if (isChatSessionIndex(index)) {
				// Success
				this.indexCache = index;
			} else {
				this.reportError('invalidIndexFormat', `Invalid index format: ${data}`);
				this.indexCache = { version: 1, entries: {} };
			}

			return this.indexCache;
		} catch (e) {
			// Only if JSON.parse fails
			this.reportError('invalidIndexJSON', `Index corrupt: ${data}`, e);
			this.indexCache = { version: 1, entries: {} };
			return this.indexCache;
		}
	}

	async getIndex(): Promise<IChatSessionIndex> {
		return this.storeQueue.queue(async () => {
			return this.internalGetIndex().entries;
		});
	}

	logIndex(): void {
		const data = this.storageService.get(ChatIndexStorageKey, this.getIndexStorageScope(), undefined);
		this.logService.info('ChatSessionStore index: ', data);
	}

	async migrateDataIfNeeded(getInitialData: () => ISerializableChatsData | undefined): Promise<void> {
		await this.storeQueue.queue(async () => {
			const data = this.storageService.get(ChatIndexStorageKey, this.getIndexStorageScope(), undefined);
			const needsMigrationFromStorageService = !data;
			if (needsMigrationFromStorageService) {
				const initialData = getInitialData();
				if (initialData) {
					await this.migrate(initialData);
				}
			}
		});
	}

	private async migrate(initialData: ISerializableChatsData): Promise<void> {
		const numSessions = Object.keys(initialData).length;
		this.logService.info(`ChatSessionStore: Migrating ${numSessions} chat sessions from storage service to file system`);

		await Promise.all(Object.values(initialData).map(async session => {
			await this.writeSession(session);
		}));

		await this.flushIndex();
	}

	public async readSession(sessionId: string): Promise<ISerializableChatData | undefined> {
		return await this.storeQueue.queue(async () => {
			let rawData: string | undefined;
			const storageLocation = this.getStorageLocation(sessionId);
			try {
				rawData = (await this.fileService.readFile(storageLocation)).value.toString();
			} catch (e) {
				this.reportError('sessionReadFile', `Error reading chat session file ${sessionId}`, e);

				if (toFileOperationResult(e) === FileOperationResult.FILE_NOT_FOUND && this.previousEmptyWindowStorageRoot) {
					rawData = await this.readSessionFromPreviousLocation(sessionId);
				}

				if (!rawData) {
					return undefined;
				}
			}

			try {
				// TODO Copied from ChatService.ts, cleanup
				const session: ISerializableChatDataIn = revive(JSON.parse(rawData)); // Revive serialized URIs in session data
				// Revive serialized markdown strings in response data
				for (const request of session.requests) {
					if (Array.isArray(request.response)) {
						request.response = request.response.map((response) => {
							if (typeof response === 'string') {
								return new MarkdownString(response);
							}
							return response;
						});
					} else if (typeof request.response === 'string') {
						request.response = [new MarkdownString(request.response)];
					}
				}

				return normalizeSerializableChatData(session);
			} catch (err) {
				this.reportError('malformedSession', `Malformed session data in ${storageLocation.fsPath}: [${rawData.substring(0, 20)}${rawData.length > 20 ? '...' : ''}]`, err);
				return undefined;
			}
		});
	}

	private async readSessionFromPreviousLocation(sessionId: string): Promise<string | undefined> {
		let rawData: string | undefined;

		if (this.previousEmptyWindowStorageRoot) {
			const storageLocation2 = joinPath(this.previousEmptyWindowStorageRoot, `${sessionId}.json`);
			try {
				rawData = (await this.fileService.readFile(storageLocation2)).value.toString();
				this.logService.info(`ChatSessionStore: Read chat session ${sessionId} from previous location`);
			} catch (e) {
				this.reportError('sessionReadFile', `Error reading chat session file ${sessionId} from previous location`, e);
				return undefined;
			}
		}

		return rawData;
	}

	private getStorageLocation(chatSessionId: string): URI {
		return joinPath(this.storageRoot, `${chatSessionId}.json`);
	}

	public getChatStorageFolder(): URI {
		return this.storageRoot;
	}
}

export interface IChatSessionEntryMetadata {
	sessionId: string;
	title: string;
	lastMessageDate: number;
	timing?: IChatSessionTiming;
	initialLocation?: ChatAgentLocation;
	hasPendingEdits?: boolean;
	stats?: IChatSessionStats;
	lastResponseState?: ResponseModelState;

	/**
	 * This only exists because the migrated data from the storage service had empty sessions persisted, and it's impossible to know which ones are
	 * currently in use. Now, `clearSession` deletes empty sessions, so old ones shouldn't take up space in the store anymore, but we still need to
	 * filter the old ones out of history.
	 */
	isEmpty?: boolean;

	/**
	 * Whether this session was loaded from an external provider (eg background/cloud sessions).
	 */
	isExternal?: boolean;
}

function isChatSessionEntryMetadata(obj: unknown): obj is IChatSessionEntryMetadata {
	return (
		!!obj &&
		typeof obj === 'object' &&
		typeof (obj as IChatSessionEntryMetadata).sessionId === 'string' &&
		typeof (obj as IChatSessionEntryMetadata).title === 'string' &&
		typeof (obj as IChatSessionEntryMetadata).lastMessageDate === 'number'
	);
}

export type IChatSessionIndex = Record<string, IChatSessionEntryMetadata>;

interface IChatSessionIndexData {
	version: 1;
	entries: IChatSessionIndex;
}

// TODO if we update the index version:
// Don't throw away index when moving backwards in VS Code version. Try to recover it. But this scenario is hard.
function isChatSessionIndex(data: unknown): data is IChatSessionIndexData {
	if (typeof data !== 'object' || data === null) {
		return false;
	}

	const index = data as IChatSessionIndexData;
	if (index.version !== 1) {
		return false;
	}

	if (typeof index.entries !== 'object' || index.entries === null) {
		return false;
	}

	for (const key in index.entries) {
		if (!isChatSessionEntryMetadata(index.entries[key])) {
			return false;
		}
	}

	return true;
}

async function getSessionMetadata(session: ChatModel | ISerializableChatData): Promise<IChatSessionEntryMetadata> {
	const title = session.customTitle || (session instanceof ChatModel ? session.title : undefined);

	let stats: IChatSessionStats | undefined;
	if (session instanceof ChatModel) {
		stats = await awaitStatsForSession(session);
	}

	const timing = session instanceof ChatModel ?
		session.timing :
		// session is only ISerializableChatData in the old pre-fs storage data migration scenario
		{
			startTime: session.creationDate,
			endTime: session.lastMessageDate
		};

	return {
		sessionId: session.sessionId,
		title: title || localize('newChat', "New Chat"),
		lastMessageDate: session.lastMessageDate,
		timing,
		initialLocation: session.initialLocation,
		hasPendingEdits: session instanceof ChatModel ? (session.editingSession?.entries.get().some(e => e.state.get() === ModifiedFileEntryState.Modified)) : false,
		isEmpty: session instanceof ChatModel ? session.getRequests().length === 0 : session.requests.length === 0,
		stats,
		isExternal: session instanceof ChatModel && !LocalChatSessionUri.parseLocalSessionId(session.sessionResource),
		lastResponseState: session instanceof ChatModel ?
			(session.lastRequest?.response?.state ?? ResponseModelState.Complete) :
			ResponseModelState.Complete
	};
}

export interface IChatTransfer {
	toWorkspace: URI;
	timestampInMilliseconds: number;
	inputState: IChatModelInputState | undefined;
	location: ChatAgentLocation;
}

export interface IChatTransfer2 extends IChatTransfer {
	chat: ISerializableChatData;
}

// type IChatTransferDto = Dto<IChatTransfer>;

/**
 * Map of destination workspace URI to chat transfer data
 */
// type IChatTransferIndex = Record<string, IChatTransferDto>;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatSlashCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatSlashCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IProgress } from '../../../../platform/progress/common/progress.js';
import { IChatMessage } from './languageModels.js';
import { IChatFollowup, IChatProgress, IChatResponseProgressFileTreeData } from './chatService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { ChatAgentLocation, ChatModeKind } from './constants.js';
import { URI } from '../../../../base/common/uri.js';

//#region slash service, commands etc

export interface IChatSlashData {
	command: string;
	detail: string;
	sortText?: string;
	/**
	 * Whether the command should execute as soon
	 * as it is entered. Defaults to `false`.
	 */
	executeImmediately?: boolean;

	/**
	 * Whether the command should be added as a request/response
	 * turn to the chat history. Defaults to `false`.
	 *
	 * For instance, the `/save` command opens an untitled document
	 * to the side hence does not contain any chatbot responses.
	 */
	silent?: boolean;

	locations: ChatAgentLocation[];
	modes?: ChatModeKind[];
}

export interface IChatSlashFragment {
	content: string | { treeData: IChatResponseProgressFileTreeData };
}
export type IChatSlashCallback = { (prompt: string, progress: IProgress<IChatProgress>, history: IChatMessage[], location: ChatAgentLocation, sessionResource: URI, token: CancellationToken): Promise<{ followUp: IChatFollowup[] } | void> };

export const IChatSlashCommandService = createDecorator<IChatSlashCommandService>('chatSlashCommandService');

/**
 * This currently only exists to drive /clear and /help
 */
export interface IChatSlashCommandService {
	_serviceBrand: undefined;
	readonly onDidChangeCommands: Event<void>;
	registerSlashCommand(data: IChatSlashData, command: IChatSlashCallback): IDisposable;
	executeCommand(id: string, prompt: string, progress: IProgress<IChatProgress>, history: IChatMessage[], location: ChatAgentLocation, sessionResource: URI, token: CancellationToken): Promise<{ followUp: IChatFollowup[] } | void>;
	getCommands(location: ChatAgentLocation, mode: ChatModeKind): Array<IChatSlashData>;
	hasCommand(id: string): boolean;
}

type Tuple = { data: IChatSlashData; command?: IChatSlashCallback };

export class ChatSlashCommandService extends Disposable implements IChatSlashCommandService {

	declare _serviceBrand: undefined;

	private readonly _commands = new Map<string, Tuple>();

	private readonly _onDidChangeCommands = this._register(new Emitter<void>());
	readonly onDidChangeCommands: Event<void> = this._onDidChangeCommands.event;

	constructor(@IExtensionService private readonly _extensionService: IExtensionService) {
		super();
	}

	override dispose(): void {
		super.dispose();
		this._commands.clear();
	}

	registerSlashCommand(data: IChatSlashData, command: IChatSlashCallback): IDisposable {
		if (this._commands.has(data.command)) {
			throw new Error(`Already registered a command with id ${data.command}}`);
		}

		this._commands.set(data.command, { data, command });
		this._onDidChangeCommands.fire();

		return toDisposable(() => {
			if (this._commands.delete(data.command)) {
				this._onDidChangeCommands.fire();
			}
		});
	}

	getCommands(location: ChatAgentLocation, mode: ChatModeKind): Array<IChatSlashData> {
		return Array
			.from(this._commands.values(), v => v.data)
			.filter(c => c.locations.includes(location) && (!c.modes || c.modes.includes(mode)));
	}

	hasCommand(id: string): boolean {
		return this._commands.has(id);
	}

	async executeCommand(id: string, prompt: string, progress: IProgress<IChatProgress>, history: IChatMessage[], location: ChatAgentLocation, sessionResource: URI, token: CancellationToken): Promise<{ followUp: IChatFollowup[] } | void> {
		const data = this._commands.get(id);
		if (!data) {
			throw new Error('No command with id ${id} NOT registered');
		}
		if (!data.command) {
			await this._extensionService.activateByEvent(`onSlash:${id}`);
		}
		if (!data.command) {
			throw new Error(`No command with id ${id} NOT resolved`);
		}

		return await data.command(prompt, progress, history, location, sessionResource, token);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatTodoListService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatTodoListService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Memento } from '../../../common/memento.js';
import { chatSessionResourceToId } from './chatUri.js';

export interface IChatTodo {
	id: number;
	title: string;
	description?: string;
	status: 'not-started' | 'in-progress' | 'completed';
}

export interface IChatTodoListStorage {
	getTodoList(sessionResource: URI): IChatTodo[];
	setTodoList(sessionResource: URI, todoList: IChatTodo[]): void;
}

export const IChatTodoListService = createDecorator<IChatTodoListService>('chatTodoListService');

export interface IChatTodoListService {
	readonly _serviceBrand: undefined;
	readonly onDidUpdateTodos: Event<URI>;
	getTodos(sessionResource: URI): IChatTodo[];
	setTodos(sessionResource: URI, todos: IChatTodo[]): void;
}

export class ChatTodoListStorage implements IChatTodoListStorage {
	private memento: Memento<Record<string, IChatTodo[]>>;

	constructor(@IStorageService storageService: IStorageService) {
		this.memento = new Memento('chat-todo-list', storageService);
	}

	private getSessionData(sessionResource: URI): IChatTodo[] {
		const storage = this.memento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		return storage[this.toKey(sessionResource)] || [];
	}

	private setSessionData(sessionResource: URI, todoList: IChatTodo[]): void {
		const storage = this.memento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		storage[this.toKey(sessionResource)] = todoList;
		this.memento.saveMemento();
	}

	getTodoList(sessionResource: URI): IChatTodo[] {
		return this.getSessionData(sessionResource);
	}

	setTodoList(sessionResource: URI, todoList: IChatTodo[]): void {
		this.setSessionData(sessionResource, todoList);
	}

	private toKey(sessionResource: URI): string {
		return chatSessionResourceToId(sessionResource);
	}
}

export class ChatTodoListService extends Disposable implements IChatTodoListService {
	declare readonly _serviceBrand: undefined;

	private readonly _onDidUpdateTodos = this._register(new Emitter<URI>());
	readonly onDidUpdateTodos = this._onDidUpdateTodos.event;

	private todoListStorage: IChatTodoListStorage;

	constructor(@IStorageService storageService: IStorageService) {
		super();
		this.todoListStorage = new ChatTodoListStorage(storageService);
	}

	getTodos(sessionResource: URI): IChatTodo[] {
		return this.todoListStorage.getTodoList(sessionResource);
	}

	setTodos(sessionResource: URI, todos: IChatTodo[]): void {
		this.todoListStorage.setTodoList(sessionResource, todos);
		this._onDidUpdateTodos.fire(sessionResource);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatTransferService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatTransferService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { areWorkspaceFoldersEmpty } from '../../../services/workspaces/common/workspaceUtils.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { URI } from '../../../../base/common/uri.js';

export const IChatTransferService = createDecorator<IChatTransferService>('chatTransferService');
const transferredWorkspacesKey = 'chat.transferedWorkspaces';

export interface IChatTransferService {
	readonly _serviceBrand: undefined;

	checkAndSetTransferredWorkspaceTrust(): Promise<void>;
	addWorkspaceToTransferred(workspace: URI): void;
}

export class ChatTransferService implements IChatTransferService {
	_serviceBrand: undefined;

	constructor(
		@IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
		@IStorageService private readonly storageService: IStorageService,
		@IFileService private readonly fileService: IFileService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService
	) { }

	deleteWorkspaceFromTransferredList(workspace: URI): void {
		const transferredWorkspaces = this.storageService.getObject<string[]>(transferredWorkspacesKey, StorageScope.PROFILE, []);
		const updatedWorkspaces = transferredWorkspaces.filter(uri => uri !== workspace.toString());
		this.storageService.store(transferredWorkspacesKey, updatedWorkspaces, StorageScope.PROFILE, StorageTarget.MACHINE);
	}

	addWorkspaceToTransferred(workspace: URI): void {
		const transferredWorkspaces = this.storageService.getObject<string[]>(transferredWorkspacesKey, StorageScope.PROFILE, []);
		transferredWorkspaces.push(workspace.toString());
		this.storageService.store(transferredWorkspacesKey, transferredWorkspaces, StorageScope.PROFILE, StorageTarget.MACHINE);
	}

	async checkAndSetTransferredWorkspaceTrust(): Promise<void> {
		const workspace = this.workspaceService.getWorkspace();
		const currentWorkspaceUri = workspace.folders[0]?.uri;
		if (!currentWorkspaceUri) {
			return;
		}
		if (this.isChatTransferredWorkspace(currentWorkspaceUri, this.storageService) && await areWorkspaceFoldersEmpty(workspace, this.fileService)) {
			await this.workspaceTrustManagementService.setWorkspaceTrust(true);
			this.deleteWorkspaceFromTransferredList(currentWorkspaceUri);
		}
	}

	isChatTransferredWorkspace(workspace: URI, storageService: IStorageService): boolean {
		if (!workspace) {
			return false;
		}
		const chatWorkspaceTransfer: URI[] = storageService.getObject(transferredWorkspacesKey, StorageScope.PROFILE, []);
		return chatWorkspaceTransfer.some(item => item.toString() === workspace.toString());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatUri.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatUri.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { encodeBase64, VSBuffer, decodeBase64 } from '../../../../base/common/buffer.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { localChatSessionType } from './chatSessionsService.js';

type ChatSessionIdentifier = {
	readonly chatSessionType: string;
	readonly sessionId: string;
};


export namespace LocalChatSessionUri {

	export const scheme = Schemas.vscodeLocalChatSession;

	export function forSession(sessionId: string): URI {
		const encodedId = encodeBase64(VSBuffer.wrap(new TextEncoder().encode(sessionId)), false, true);
		return URI.from({ scheme, authority: localChatSessionType, path: '/' + encodedId });
	}

	export function parseLocalSessionId(resource: URI): string | undefined {
		const parsed = parse(resource);
		return parsed?.chatSessionType === localChatSessionType ? parsed.sessionId : undefined;
	}

	function parse(resource: URI): ChatSessionIdentifier | undefined {
		if (resource.scheme !== scheme) {
			return undefined;
		}

		if (!resource.authority) {
			return undefined;
		}

		const parts = resource.path.split('/');
		if (parts.length !== 2) {
			return undefined;
		}

		const chatSessionType = resource.authority;
		const decodedSessionId = decodeBase64(parts[1]);
		return { chatSessionType, sessionId: new TextDecoder().decode(decodedSessionId.buffer) };
	}
}

/**
 * Converts a chat session resource URI to a string ID.
 *
 * This exists mainly for backwards compatibility with existing code that uses string IDs in telemetry and storage.
 */
export function chatSessionResourceToId(resource: URI): string {
	// If we have a local session, prefer using just the id part
	const localId = LocalChatSessionUri.parseLocalSessionId(resource);
	if (localId) {
		return localId;
	}

	return resource.toString();
}

/**
 * Extracts the chat session type from a resource URI.
 *
 * @param resource - The chat session resource URI
 * @returns The session type string. Returns `localChatSessionType` for local sessions
 *          (vscodeChatEditor and vscodeLocalChatSession schemes), or the scheme/authority
 *          for contributed sessions.
 */
export function getChatSessionType(resource: URI): string {
	if (resource.scheme === Schemas.vscodeChatEditor) {
		return localChatSessionType;
	}

	if (resource.scheme === LocalChatSessionUri.scheme) {
		return resource.authority || localChatSessionType;
	}

	return resource.scheme;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatUrlFetchingConfirmation.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatUrlFetchingConfirmation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IQuickInputButton, IQuickInputService, IQuickTreeItem } from '../../../../platform/quickinput/common/quickInput.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { ConfirmedReason, ToolConfirmKind } from './chatService.js';
import { ChatConfiguration } from './constants.js';
import {
	ILanguageModelToolConfirmationActions,
	ILanguageModelToolConfirmationContribution,
	ILanguageModelToolConfirmationContributionQuickTreeItem,
	ILanguageModelToolConfirmationRef
} from './languageModelToolsConfirmationService.js';
import { extractUrlPatterns, getPatternLabel, isUrlApproved, IUrlApprovalSettings } from './chatUrlFetchingPatterns.js';

const trashButton: IQuickInputButton = {
	iconClass: ThemeIcon.asClassName(Codicon.trash),
	tooltip: localize('delete', "Delete")
};

export class ChatUrlFetchingConfirmationContribution implements ILanguageModelToolConfirmationContribution {
	readonly canUseDefaultApprovals = false;

	constructor(
		private readonly _getURLS: (parameters: unknown) => string[] | undefined,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@IPreferencesService private readonly _preferencesService: IPreferencesService
	) { }

	getPreConfirmAction(ref: ILanguageModelToolConfirmationRef): ConfirmedReason | undefined {
		return this._checkApproval(ref, true);
	}

	getPostConfirmAction(ref: ILanguageModelToolConfirmationRef): ConfirmedReason | undefined {
		return this._checkApproval(ref, false);
	}

	private _checkApproval(ref: ILanguageModelToolConfirmationRef, checkRequest: boolean): ConfirmedReason | undefined {
		const urls = this._getURLS(ref.parameters);
		if (!urls || urls.length === 0) {
			return undefined;
		}

		const approvedUrls = this._getApprovedUrls();

		// Check if all URLs are approved
		const allApproved = urls.every(url => {
			try {
				const uri = URI.parse(url);
				return isUrlApproved(uri, approvedUrls, checkRequest);
			} catch {
				return false;
			}
		});

		if (allApproved) {
			return {
				type: ToolConfirmKind.Setting,
				id: ChatConfiguration.AutoApprovedUrls
			};
		}

		return undefined;
	}

	getPreConfirmActions(ref: ILanguageModelToolConfirmationRef): ILanguageModelToolConfirmationActions[] {
		return this._getConfirmActions(ref, true);
	}

	getPostConfirmActions(ref: ILanguageModelToolConfirmationRef): ILanguageModelToolConfirmationActions[] {
		return this._getConfirmActions(ref, false);
	}

	private _getConfirmActions(ref: ILanguageModelToolConfirmationRef, forRequest: boolean): ILanguageModelToolConfirmationActions[] {
		const urls = this._getURLS(ref.parameters);
		if (!urls || urls.length === 0) {
			return [];
		}

		//remove query strings
		const urlsWithoutQuery = urls.map(u => u.split('?')[0]);

		const actions: ILanguageModelToolConfirmationActions[] = [];

		// Get unique URLs (may have duplicates)
		const uniqueUrls = Array.from(new Set(urlsWithoutQuery)).map(u => URI.parse(u));

		// For each URL, get its patterns
		const urlPatterns = new ResourceMap<string[]>(uniqueUrls.map(u => [u, extractUrlPatterns(u)] as const));

		// If only one URL, show quick actions for specific patterns
		if (urlPatterns.size === 1) {
			const uri = uniqueUrls[0];
			const patterns = urlPatterns.get(uri)!;

			// Show top 2 most relevant patterns as quick actions
			const topPatterns = patterns.slice(0, 2);
			for (const pattern of topPatterns) {
				const patternLabel = getPatternLabel(uri, pattern);
				actions.push({
					label: forRequest
						? localize('approveRequestTo', "Allow requests to {0}", patternLabel)
						: localize('approveResponseFrom', "Allow responses from {0}", patternLabel),
					select: async () => {
						await this._approvePattern(pattern, forRequest, !forRequest);
						return true;
					}
				});
			}

			// "More options" action
			actions.push({
				label: localize('moreOptions', "Allow requests to..."),
				select: async () => {
					const result = await this._showMoreOptions(ref, [{ uri, patterns }], forRequest);
					return result;
				}
			});
		} else {
			// Multiple URLs - show "More options" only
			actions.push({
				label: localize('moreOptionsMultiple', "Configure URL Approvals..."),
				select: async () => {
					await this._showMoreOptions(ref, [...urlPatterns].map(([uri, patterns]) => ({ uri, patterns })), forRequest);
					return true;
				}
			});
		}

		return actions;
	}

	private async _showMoreOptions(ref: ILanguageModelToolConfirmationRef, urls: { uri: URI; patterns: string[] }[], forRequest: boolean): Promise<boolean> {
		interface IPatternTreeItem extends IQuickTreeItem {
			pattern: string;
			approvalType?: 'request' | 'response';
			children?: IPatternTreeItem[];
		}

		return new Promise<boolean>((resolve) => {
			const disposables = new DisposableStore();
			const quickTree = disposables.add(this._quickInputService.createQuickTree<IPatternTreeItem>());
			quickTree.ignoreFocusOut = true;
			quickTree.sortByLabel = false;
			quickTree.placeholder = localize('selectApproval', "Select URL pattern to approve");

			const treeItems: IPatternTreeItem[] = [];
			const approvedUrls = this._getApprovedUrls();
			const dedupedPatterns = new Set<string>();

			for (const { uri, patterns } of urls) {
				for (const pattern of patterns.slice().sort((a, b) => b.length - a.length)) {
					if (dedupedPatterns.has(pattern)) {
						continue;
					}
					dedupedPatterns.add(pattern);
					const settings = approvedUrls[pattern];
					const requestChecked = typeof settings === 'boolean' ? settings : (settings?.approveRequest ?? false);
					const responseChecked = typeof settings === 'boolean' ? settings : (settings?.approveResponse ?? false);

					treeItems.push({
						label: getPatternLabel(uri, pattern),
						pattern,
						checked: requestChecked && responseChecked ? true : (!requestChecked && !responseChecked ? false : 'mixed'),
						collapsed: true,
						children: [
							{
								label: localize('allowRequestsCheckbox', "Make requests without confirmation"),
								pattern,
								approvalType: 'request',
								checked: requestChecked
							},
							{
								label: localize('allowResponsesCheckbox', "Allow responses without confirmation"),
								pattern,
								approvalType: 'response',
								checked: responseChecked
							}
						],
					});
				}
			}

			quickTree.setItemTree(treeItems);

			const updateApprovals = () => {
				const current = { ...this._getApprovedUrls() };
				for (const item of quickTree.itemTree) {
					// root-level items

					const allowPre = item.children?.find(c => c.approvalType === 'request')?.checked;
					const allowPost = item.children?.find(c => c.approvalType === 'response')?.checked;

					if (allowPost && allowPre) {
						current[item.pattern] = true;
					} else if (!allowPost && !allowPre) {
						delete current[item.pattern];
					} else {
						current[item.pattern] = {
							approveRequest: !!allowPre || undefined,
							approveResponse: !!allowPost || undefined,
						};
					}
				}

				return this._configurationService.updateValue(ChatConfiguration.AutoApprovedUrls, current);
			};

			disposables.add(quickTree.onDidAccept(async () => {
				quickTree.busy = true;
				await updateApprovals();
				resolve(!!this._checkApproval(ref, forRequest));
				quickTree.hide();
			}));

			disposables.add(quickTree.onDidHide(() => {
				updateApprovals();
				disposables.dispose();
				resolve(false);
			}));

			quickTree.show();
		});
	}

	private async _approvePattern(pattern: string, approveRequest: boolean, approveResponse: boolean): Promise<void> {
		const approvedUrls = { ...this._getApprovedUrls() };

		// Create the approval settings
		let value: boolean | IUrlApprovalSettings;
		if (approveRequest === approveResponse) {
			value = approveRequest;
		} else {
			value = { approveRequest, approveResponse };
		}

		approvedUrls[pattern] = value;

		await this._configurationService.updateValue(
			ChatConfiguration.AutoApprovedUrls,
			approvedUrls
		);
	}

	getManageActions(): ILanguageModelToolConfirmationContributionQuickTreeItem[] {
		const approvedUrls = { ...this._getApprovedUrls() };
		const items: ILanguageModelToolConfirmationContributionQuickTreeItem[] = [];

		for (const [pattern, settings] of Object.entries(approvedUrls)) {
			const label = pattern;
			let description: string;

			if (typeof settings === 'boolean') {
				description = settings
					? localize('approveAll', "Approve all")
					: localize('denyAll', "Deny all");
			} else {
				const parts: string[] = [];
				if (settings.approveRequest) {
					parts.push(localize('requests', "requests"));
				}
				if (settings.approveResponse) {
					parts.push(localize('responses', "responses"));
				}
				description = parts.length > 0
					? localize('approves', "Approves {0}", parts.join(', '))
					: localize('noApprovals', "No approvals");
			}

			const item: ILanguageModelToolConfirmationContributionQuickTreeItem = {
				label,
				description,
				buttons: [trashButton],
				checked: true,
				onDidChangeChecked: (checked) => {
					if (checked) {
						approvedUrls[pattern] = settings;
					} else {
						delete approvedUrls[pattern];
					}

					this._configurationService.updateValue(ChatConfiguration.AutoApprovedUrls, approvedUrls);
				}
			};

			items.push(item);
		}

		items.push({
			pickable: false,
			label: localize('moreOptionsManage', "More Options..."),
			description: localize('openSettings', "Open settings"),
			onDidOpen: () => {
				this._preferencesService.openUserSettings({ query: ChatConfiguration.AutoApprovedUrls });
			}
		});

		return items;
	}

	async reset(): Promise<void> {
		await this._configurationService.updateValue(
			ChatConfiguration.AutoApprovedUrls,
			{}
		);
	}

	private _getApprovedUrls(): Readonly<Record<string, boolean | IUrlApprovalSettings>> {
		return this._configurationService.getValue<Record<string, boolean | IUrlApprovalSettings>>(
			ChatConfiguration.AutoApprovedUrls
		) || {};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatUrlFetchingPatterns.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatUrlFetchingPatterns.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { normalizeURL } from '../../url/common/trustedDomains.js';
import { testUrlMatchesGlob } from '../../url/common/urlGlob.js';

/**
 * Approval settings for a URL pattern
 */
export interface IUrlApprovalSettings {
	approveRequest?: boolean;
	approveResponse?: boolean;
}

/**
 * Extracts domain patterns from a URL for use in approval actions
 * @param url The URL to extract patterns from
 * @returns An array of patterns in order of specificity (most specific first)
 */
export function extractUrlPatterns(url: URI): string[] {
	const normalizedStr = normalizeURL(url);
	const normalized = URI.parse(normalizedStr);
	const patterns = new Set<string>();

	// Full URL (most specific)
	const fullUrl = normalized.toString(true);
	patterns.add(fullUrl);

	// Domain-only pattern (without trailing slash)
	const domainOnly = normalized.with({ path: '', query: '', fragment: '' }).toString(true);
	patterns.add(domainOnly);

	// Wildcard subdomain pattern (*.example.com)
	const authority = normalized.authority;
	const domainParts = authority.split('.');

	// Only add wildcard subdomain if there are at least 2 parts and it's not an IP
	const isIPv4 = domainParts.length === 4 && domainParts.every((segment: string) =>
		Number.isInteger(+segment));
	const isIPv6 = authority.includes(':') && authority.match(/^(\[)?[0-9a-fA-F:]+(\])?(?::\d+)?$/);
	const isIP = isIPv4 || isIPv6;

	// Only emit subdomain patterns if there are actually subdomains (more than 2 parts)
	if (!isIP && domainParts.length > 2) {
		// Create patterns by replacing each subdomain segment with *
		// For example, foo.bar.example.com -> *.bar.example.com, *.example.com
		for (let i = 0; i < domainParts.length - 2; i++) {
			const wildcardAuthority = '*.' + domainParts.slice(i + 1).join('.');
			const wildcardPattern = normalized.with({
				authority: wildcardAuthority,
				path: '',
				query: '',
				fragment: ''
			}).toString(true);
			patterns.add(wildcardPattern);
		}
	}

	// Path patterns (if there's a non-trivial path)
	const pathSegments = normalized.path.split('/').filter((s: string) => s.length > 0);
	if (pathSegments.length > 0) {
		// Add patterns for each path level with wildcard
		for (let i = pathSegments.length - 1; i >= 0; i--) {
			const pathPattern = pathSegments.slice(0, i).join('/');
			const urlWithPathPattern = normalized.with({
				path: (i > 0 ? '/' : '') + pathPattern,
				query: '',
				fragment: ''
			}).toString(true);
			patterns.add(urlWithPathPattern);
		}
	}

	return [...patterns].map(p => p.replace(/\/+$/, ''));
}

/**
 * Generates user-friendly labels for URL patterns to show in quick pick
 * @param url The original URL
 * @param pattern The pattern to generate a label for
 * @returns A user-friendly label describing what the pattern matches (without protocol)
 */
export function getPatternLabel(url: URI, pattern: string): string {
	let displayPattern = pattern;

	if (displayPattern.startsWith('https://')) {
		displayPattern = displayPattern.substring(8);
	} else if (displayPattern.startsWith('http://')) {
		displayPattern = displayPattern.substring(7);
	}

	return displayPattern.replace(/\/+$/, ''); // Remove trailing slashes
}

/**
 * Checks if a URL matches any approved pattern
 * @param url The URL to check
 * @param approvedUrls Map of approved URL patterns to their settings
 * @param checkRequest Whether to check request approval (true) or response approval (false)
 * @returns true if the URL is approved for the specified action
 */
export function isUrlApproved(
	url: URI,
	approvedUrls: Record<string, boolean | IUrlApprovalSettings>,
	checkRequest: boolean
): boolean {
	const normalizedUrlStr = normalizeURL(url);
	const normalizedUrl = URI.parse(normalizedUrlStr);

	for (const [pattern, settings] of Object.entries(approvedUrls)) {
		// Check if URL matches this pattern
		if (testUrlMatchesGlob(normalizedUrl, pattern)) {
			// Handle boolean settings
			if (typeof settings === 'boolean') {
				return settings;
			}

			// Handle granular settings
			if (checkRequest && settings.approveRequest !== undefined) {
				return settings.approveRequest;
			}

			if (!checkRequest && settings.approveResponse !== undefined) {
				return settings.approveResponse;
			}
		}
	}

	return false;
}

/**
 * Gets the most specific matching pattern for a URL
 * @param url The URL to find a matching pattern for
 * @param approvedUrls Map of approved URL patterns
 * @returns The most specific matching pattern, or undefined if none match
 */
export function getMatchingPattern(
	url: URI,
	approvedUrls: Record<string, boolean | IUrlApprovalSettings>
): string | undefined {
	const normalizedUrlStr = normalizeURL(url);
	const normalizedUrl = URI.parse(normalizedUrlStr);
	const patterns = extractUrlPatterns(url);

	// Check patterns in order of specificity (most specific first)
	for (const pattern of patterns) {
		for (const approvedPattern of Object.keys(approvedUrls)) {
			if (testUrlMatchesGlob(normalizedUrl, approvedPattern) && testUrlMatchesGlob(URI.parse(pattern), approvedPattern)) {
				return approvedPattern;
			}
		}
	}

	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatVariableEntries.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatVariableEntries.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { basename } from '../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { IOffsetRange } from '../../../../editor/common/core/ranges/offsetRange.js';
import { isLocation, Location, SymbolKind } from '../../../../editor/common/languages.js';
import { localize } from '../../../../nls.js';
import { MarkerSeverity, IMarker } from '../../../../platform/markers/common/markers.js';
import { ISCMHistoryItem } from '../../scm/common/history.js';
import { IChatContentReference } from './chatService.js';
import { IChatRequestVariableValue } from './chatVariables.js';
import { IToolData, ToolSet } from './languageModelToolsService.js';


interface IBaseChatRequestVariableEntry {
	readonly id: string;
	readonly fullName?: string;
	readonly icon?: ThemeIcon;
	readonly name: string;
	readonly modelDescription?: string;

	/**
	 * The offset-range in the prompt. This means this entry has been explicitly typed out
	 * by the user.
	 */
	readonly range?: IOffsetRange;
	readonly value: IChatRequestVariableValue;
	readonly references?: IChatContentReference[];

	omittedState?: OmittedState;
}

export interface IGenericChatRequestVariableEntry extends IBaseChatRequestVariableEntry {
	kind: 'generic';
}

export interface IChatRequestDirectoryEntry extends IBaseChatRequestVariableEntry {
	kind: 'directory';
}

export interface IChatRequestFileEntry extends IBaseChatRequestVariableEntry {
	kind: 'file';
}

export const enum OmittedState {
	NotOmitted,
	Partial,
	Full,
}

export interface IChatRequestToolEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'tool';
}

export interface IChatRequestToolSetEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'toolset';
	readonly value: IChatRequestToolEntry[];
}

export type ChatRequestToolReferenceEntry = IChatRequestToolEntry | IChatRequestToolSetEntry;

export interface StringChatContextValue {
	value?: string;
	name: string;
	modelDescription?: string;
	icon: ThemeIcon;
	uri: URI;
}

export interface IChatRequestImplicitVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'implicit';
	readonly isFile: true;
	readonly value: URI | Location | StringChatContextValue | undefined;
	readonly uri: URI | undefined;
	readonly isSelection: boolean;
	enabled: boolean;
}

export interface IChatRequestStringVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'string';
	readonly value: string | undefined;
	readonly modelDescription?: string;
	readonly icon: ThemeIcon;
	readonly uri: URI;
}

export interface IChatRequestWorkspaceVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'workspace';
	readonly value: string;
	readonly modelDescription?: string;
}


export interface IChatRequestPasteVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'paste';
	readonly code: string;
	readonly language: string;
	readonly pastedLines: string;

	// This is only used for old serialized data and should be removed once we no longer support it
	readonly fileName: string;

	// This is only undefined on old serialized data
	readonly copiedFrom: {
		readonly uri: URI;
		readonly range: IRange;
	} | undefined;
}

export interface ISymbolVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'symbol';
	readonly value: Location;
	readonly symbolKind: SymbolKind;
}

export interface ICommandResultVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'command';
}

export interface IImageVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'image';
	readonly isPasted?: boolean;
	readonly isURL?: boolean;
	readonly mimeType?: string;
}

export interface INotebookOutputVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'notebookOutput';
	readonly outputIndex?: number;
	readonly mimeType?: string;
}

export interface IDiagnosticVariableEntryFilterData {
	readonly owner?: string;
	readonly problemMessage?: string;
	readonly filterUri?: URI;
	readonly filterSeverity?: MarkerSeverity;
	readonly filterRange?: IRange;
}



export namespace IDiagnosticVariableEntryFilterData {
	export const icon = Codicon.error;

	export function fromMarker(marker: IMarker): IDiagnosticVariableEntryFilterData {
		return {
			filterUri: marker.resource,
			owner: marker.owner,
			problemMessage: marker.message,
			filterRange: { startLineNumber: marker.startLineNumber, endLineNumber: marker.endLineNumber, startColumn: marker.startColumn, endColumn: marker.endColumn }
		};
	}

	export function toEntry(data: IDiagnosticVariableEntryFilterData): IDiagnosticVariableEntry {
		return {
			id: id(data),
			name: label(data),
			icon,
			value: data,
			kind: 'diagnostic',
			...data,
		};
	}

	export function id(data: IDiagnosticVariableEntryFilterData) {
		return [data.filterUri, data.owner, data.filterSeverity, data.filterRange?.startLineNumber, data.filterRange?.startColumn].join(':');
	}

	export function label(data: IDiagnosticVariableEntryFilterData) {
		const enum TrimThreshold {
			MaxChars = 30,
			MaxSpaceLookback = 10,
		}
		if (data.problemMessage) {
			if (data.problemMessage.length < TrimThreshold.MaxChars) {
				return data.problemMessage;
			}

			// Trim the message, on a space if it would not lose too much
			// data (MaxSpaceLookback) or just blindly otherwise.
			const lastSpace = data.problemMessage.lastIndexOf(' ', TrimThreshold.MaxChars);
			if (lastSpace === -1 || lastSpace + TrimThreshold.MaxSpaceLookback < TrimThreshold.MaxChars) {
				return data.problemMessage.substring(0, TrimThreshold.MaxChars) + '…';
			}
			return data.problemMessage.substring(0, lastSpace) + '…';
		}
		let labelStr = localize('chat.attachment.problems.all', "All Problems");
		if (data.filterUri) {
			labelStr = localize('chat.attachment.problems.inFile', "Problems in {0}", basename(data.filterUri));
		}

		return labelStr;
	}
}

export interface IDiagnosticVariableEntry extends IBaseChatRequestVariableEntry, IDiagnosticVariableEntryFilterData {
	readonly kind: 'diagnostic';
}

export interface IElementVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'element';
}

export interface IPromptFileVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'promptFile';
	readonly value: URI;
	readonly isRoot: boolean;
	readonly originLabel?: string;
	readonly modelDescription: string;
	readonly automaticallyAdded: boolean;
	readonly toolReferences?: readonly ChatRequestToolReferenceEntry[];
}

export interface IPromptTextVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'promptText';
	readonly value: string;
	readonly settingId?: string;
	readonly modelDescription: string;
	readonly automaticallyAdded: boolean;
	readonly toolReferences?: readonly ChatRequestToolReferenceEntry[];
}

export interface ISCMHistoryItemVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'scmHistoryItem';
	readonly value: URI;
	readonly historyItem: ISCMHistoryItem;
}

export interface ISCMHistoryItemChangeVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'scmHistoryItemChange';
	readonly value: URI;
	readonly historyItem: ISCMHistoryItem;
}

export interface ISCMHistoryItemChangeRangeVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'scmHistoryItemChangeRange';
	readonly value: URI;
	readonly historyItemChangeStart: {
		readonly uri: URI;
		readonly historyItem: ISCMHistoryItem;
	};
	readonly historyItemChangeEnd: {
		readonly uri: URI;
		readonly historyItem: ISCMHistoryItem;
	};
}

export interface ITerminalVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'terminalCommand';
	readonly value: string;
	readonly resource: URI;
	readonly command: string;
	readonly output?: string;
	readonly exitCode?: number;
}

export interface IDebugVariableEntry extends IBaseChatRequestVariableEntry {
	readonly kind: 'debugVariable';
	readonly value: string;
	readonly expression: string;
	readonly type?: string;
}

export type IChatRequestVariableEntry = IGenericChatRequestVariableEntry | IChatRequestImplicitVariableEntry | IChatRequestPasteVariableEntry
	| ISymbolVariableEntry | ICommandResultVariableEntry | IDiagnosticVariableEntry | IImageVariableEntry
	| IChatRequestToolEntry | IChatRequestToolSetEntry
	| IChatRequestDirectoryEntry | IChatRequestFileEntry | INotebookOutputVariableEntry | IElementVariableEntry
	| IPromptFileVariableEntry | IPromptTextVariableEntry
	| ISCMHistoryItemVariableEntry | ISCMHistoryItemChangeVariableEntry | ISCMHistoryItemChangeRangeVariableEntry | ITerminalVariableEntry
	| IChatRequestStringVariableEntry | IChatRequestWorkspaceVariableEntry | IDebugVariableEntry;

export namespace IChatRequestVariableEntry {

	/**
	 * Returns URI of the passed variant entry. Return undefined if not found.
	 */
	export function toUri(entry: IChatRequestVariableEntry): URI | undefined {
		return URI.isUri(entry.value)
			? entry.value
			: isLocation(entry.value)
				? entry.value.uri
				: undefined;
	}
}


export function isImplicitVariableEntry(obj: IChatRequestVariableEntry): obj is IChatRequestImplicitVariableEntry {
	return obj.kind === 'implicit';
}

export function isStringVariableEntry(obj: IChatRequestVariableEntry): obj is IChatRequestStringVariableEntry {
	return obj.kind === 'string';
}

export function isTerminalVariableEntry(obj: IChatRequestVariableEntry): obj is ITerminalVariableEntry {
	return obj.kind === 'terminalCommand';
}

export function isDebugVariableEntry(obj: IChatRequestVariableEntry): obj is IDebugVariableEntry {
	return obj.kind === 'debugVariable';
}

export function isPasteVariableEntry(obj: IChatRequestVariableEntry): obj is IChatRequestPasteVariableEntry {
	return obj.kind === 'paste';
}

export function isWorkspaceVariableEntry(obj: IChatRequestVariableEntry): obj is IChatRequestWorkspaceVariableEntry {
	return obj.kind === 'workspace';
}

export function isImageVariableEntry(obj: IChatRequestVariableEntry): obj is IImageVariableEntry {
	return obj.kind === 'image';
}

export function isNotebookOutputVariableEntry(obj: IChatRequestVariableEntry): obj is INotebookOutputVariableEntry {
	return obj.kind === 'notebookOutput';
}

export function isElementVariableEntry(obj: IChatRequestVariableEntry): obj is IElementVariableEntry {
	return obj.kind === 'element';
}

export function isDiagnosticsVariableEntry(obj: IChatRequestVariableEntry): obj is IDiagnosticVariableEntry {
	return obj.kind === 'diagnostic';
}

export function isChatRequestFileEntry(obj: IChatRequestVariableEntry): obj is IChatRequestFileEntry {
	return obj.kind === 'file';
}

export function isPromptFileVariableEntry(obj: IChatRequestVariableEntry): obj is IPromptFileVariableEntry {
	return obj.kind === 'promptFile';
}

export function isPromptTextVariableEntry(obj: IChatRequestVariableEntry): obj is IPromptTextVariableEntry {
	return obj.kind === 'promptText';
}

export function isChatRequestVariableEntry(obj: unknown): obj is IChatRequestVariableEntry {
	const entry = obj as IChatRequestVariableEntry;
	return typeof entry === 'object' &&
		entry !== null &&
		typeof entry.id === 'string' &&
		typeof entry.name === 'string';
}

export function isSCMHistoryItemVariableEntry(obj: IChatRequestVariableEntry): obj is ISCMHistoryItemVariableEntry {
	return obj.kind === 'scmHistoryItem';
}

export function isSCMHistoryItemChangeVariableEntry(obj: IChatRequestVariableEntry): obj is ISCMHistoryItemChangeVariableEntry {
	return obj.kind === 'scmHistoryItemChange';
}

export function isSCMHistoryItemChangeRangeVariableEntry(obj: IChatRequestVariableEntry): obj is ISCMHistoryItemChangeRangeVariableEntry {
	return obj.kind === 'scmHistoryItemChangeRange';
}

export function isStringImplicitContextValue(value: unknown): value is StringChatContextValue {
	const asStringImplicitContextValue = value as Partial<StringChatContextValue>;
	return (
		typeof asStringImplicitContextValue === 'object' &&
		asStringImplicitContextValue !== null &&
		(typeof asStringImplicitContextValue.value === 'string' || typeof asStringImplicitContextValue.value === 'undefined') &&
		typeof asStringImplicitContextValue.name === 'string' &&
		ThemeIcon.isThemeIcon(asStringImplicitContextValue.icon) &&
		URI.isUri(asStringImplicitContextValue.uri)
	);
}

export enum PromptFileVariableKind {
	Instruction = 'vscode.prompt.instructions.root',
	InstructionReference = `vscode.prompt.instructions`,
	PromptFile = 'vscode.prompt.file'
}

/**
 * Utility to convert a {@link uri} to a chat variable entry.
 * The `id` of the chat variable can be one of the following:
 *
 * - `vscode.prompt.instructions__<URI>`: for all non-root prompt instructions references
 * - `vscode.prompt.instructions.root__<URI>`: for *root* prompt instructions references
 * - `vscode.prompt.file__<URI>`: for prompt file references
 *
 * @param uri A resource URI that points to a prompt instructions file.
 * @param kind The kind of the prompt file variable entry.
 */
export function toPromptFileVariableEntry(uri: URI, kind: PromptFileVariableKind, originLabel?: string, automaticallyAdded = false, toolReferences?: ChatRequestToolReferenceEntry[]): IPromptFileVariableEntry {
	//  `id` for all `prompt files` starts with the well-defined part that the copilot extension(or other chatbot) can rely on
	return {
		id: `${kind}__${uri.toString()}`,
		name: `prompt:${basename(uri)}`,
		value: uri,
		kind: 'promptFile',
		modelDescription: 'Prompt instructions file',
		isRoot: kind !== PromptFileVariableKind.InstructionReference,
		originLabel,
		toolReferences,
		automaticallyAdded
	};
}

export function toPromptTextVariableEntry(content: string, automaticallyAdded = false, toolReferences?: ChatRequestToolReferenceEntry[]): IPromptTextVariableEntry {
	return {
		id: `vscode.prompt.instructions.text`,
		name: `prompt:instructionsList`,
		value: content,
		kind: 'promptText',
		modelDescription: 'Prompt instructions list',
		automaticallyAdded,
		toolReferences
	};
}

export function toFileVariableEntry(uri: URI, range?: IRange): IChatRequestFileEntry {
	return {
		kind: 'file',
		value: range ? { uri, range } : uri,
		id: uri.toString() + (range?.toString() ?? ''),
		name: basename(uri),
	};
}

export function toToolVariableEntry(entry: IToolData, range?: IOffsetRange): IChatRequestToolEntry {
	return {
		kind: 'tool',
		id: entry.id,
		icon: ThemeIcon.isThemeIcon(entry.icon) ? entry.icon : undefined,
		name: entry.displayName,
		value: undefined,
		range
	};
}

export function toToolSetVariableEntry(entry: ToolSet, range?: IOffsetRange): IChatRequestToolSetEntry {
	return {
		kind: 'toolset',
		id: entry.id,
		icon: entry.icon,
		name: entry.referenceName,
		value: Array.from(entry.getTools()).map(t => toToolVariableEntry(t)),
		range
	};
}

export class ChatRequestVariableSet {
	private _ids = new Set<string>();
	private _entries: IChatRequestVariableEntry[] = [];

	constructor(entries?: IChatRequestVariableEntry[]) {
		if (entries) {
			this.add(...entries);
		}
	}

	public add(...entry: IChatRequestVariableEntry[]): void {
		for (const e of entry) {
			if (!this._ids.has(e.id)) {
				this._ids.add(e.id);
				this._entries.push(e);
			}
		}
	}

	public insertFirst(entry: IChatRequestVariableEntry): void {
		if (!this._ids.has(entry.id)) {
			this._ids.add(entry.id);
			this._entries.unshift(entry);
		}
	}

	public remove(entry: IChatRequestVariableEntry): void {
		this._ids.delete(entry.id);
		this._entries = this._entries.filter(e => e.id !== entry.id);
	}

	public has(entry: IChatRequestVariableEntry): boolean {
		return this._ids.has(entry.id);
	}

	public asArray(): IChatRequestVariableEntry[] {
		return this._entries.slice(0); // return a copy
	}

	public get length(): number {
		return this._entries.length;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatVariables.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatVariables.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { Location } from '../../../../editor/common/languages.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IChatModel } from './chatModel.js';
import { IChatContentReference, IChatProgressMessage } from './chatService.js';
import { IDiagnosticVariableEntryFilterData, StringChatContextValue } from './chatVariableEntries.js';
import { IToolAndToolSetEnablementMap } from './languageModelToolsService.js';

export interface IChatVariableData {
	id: string;
	name: string;
	icon?: ThemeIcon;
	fullName?: string;
	description: string;
	modelDescription?: string;
	canTakeArgument?: boolean;
}

export interface IChatRequestProblemsVariable {
	id: 'vscode.problems';
	filter: IDiagnosticVariableEntryFilterData;
}

export const isIChatRequestProblemsVariable = (obj: unknown): obj is IChatRequestProblemsVariable =>
	typeof obj === 'object' && obj !== null && 'id' in obj && (obj as IChatRequestProblemsVariable).id === 'vscode.problems';

export type IChatRequestVariableValue = string | URI | Location | Uint8Array | IChatRequestProblemsVariable | StringChatContextValue | unknown;

export type IChatVariableResolverProgress =
	| IChatContentReference
	| IChatProgressMessage;

export interface IChatVariableResolver {
	(messageText: string, arg: string | undefined, model: IChatModel, progress: (part: IChatVariableResolverProgress) => void, token: CancellationToken): Promise<IChatRequestVariableValue | undefined>;
}

export const IChatVariablesService = createDecorator<IChatVariablesService>('IChatVariablesService');

export interface IChatVariablesService {
	_serviceBrand: undefined;
	getDynamicVariables(sessionResource: URI): ReadonlyArray<IDynamicVariable>;
	getSelectedToolAndToolSets(sessionResource: URI): IToolAndToolSetEnablementMap;
}

export interface IDynamicVariable {
	range: IRange;
	id: string;
	fullName?: string;
	icon?: ThemeIcon;
	modelDescription?: string;
	isFile?: boolean;
	isDirectory?: boolean;
	data: IChatRequestVariableValue;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatViewModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatViewModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { hash } from '../../../../base/common/hash.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, dispose } from '../../../../base/common/lifecycle.js';
import * as marked from '../../../../base/common/marked/marked.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { annotateVulnerabilitiesInText } from './annotations.js';
import { getFullyQualifiedId, IChatAgentCommand, IChatAgentData, IChatAgentNameService, IChatAgentResult } from './chatAgents.js';
import { IChatModel, IChatProgressRenderableResponseContent, IChatRequestDisablement, IChatRequestModel, IChatResponseModel, IChatTextEditGroup, IResponse } from './chatModel.js';
import { IParsedChatRequest } from './chatParserTypes.js';
import { ChatAgentVoteDirection, ChatAgentVoteDownReason, IChatCodeCitation, IChatContentReference, IChatFollowup, IChatMcpServersStarting, IChatProgressMessage, IChatResponseErrorDetails, IChatTask, IChatUsedContext } from './chatService.js';
import { IChatRequestVariableEntry } from './chatVariableEntries.js';
import { countWords } from './chatWordCounter.js';
import { CodeBlockModelCollection } from './codeBlockModelCollection.js';
import { ChatStreamStatsTracker, IChatStreamStats } from './model/chatStreamStats.js';

export function isRequestVM(item: unknown): item is IChatRequestViewModel {
	return !!item && typeof item === 'object' && 'message' in item;
}

export function isResponseVM(item: unknown): item is IChatResponseViewModel {
	return !!item && typeof (item as IChatResponseViewModel).setVote !== 'undefined';
}

export function isChatTreeItem(item: unknown): item is IChatRequestViewModel | IChatResponseViewModel {
	return isRequestVM(item) || isResponseVM(item);
}

export function assertIsResponseVM(item: unknown): asserts item is IChatResponseViewModel {
	if (!isResponseVM(item)) {
		throw new Error('Expected item to be IChatResponseViewModel');
	}
}

export type IChatViewModelChangeEvent = IChatAddRequestEvent | IChangePlaceholderEvent | IChatSessionInitEvent | IChatSetHiddenEvent | IChatSetCheckpointEvent | null;

export interface IChatAddRequestEvent {
	kind: 'addRequest';
}

export interface IChangePlaceholderEvent {
	kind: 'changePlaceholder';
}

export interface IChatSessionInitEvent {
	kind: 'initialize';
}

export interface IChatSetHiddenEvent {
	kind: 'setHidden';
}

export interface IChatSetCheckpointEvent {
	kind: 'setCheckpoint';
}

export interface IChatViewModel {
	readonly model: IChatModel;
	readonly sessionResource: URI;
	readonly onDidDisposeModel: Event<void>;
	readonly onDidChange: Event<IChatViewModelChangeEvent>;
	readonly inputPlaceholder?: string;
	getItems(): (IChatRequestViewModel | IChatResponseViewModel)[];
	setInputPlaceholder(text: string): void;
	resetInputPlaceholder(): void;
	editing?: IChatRequestViewModel;
	setEditing(editing: IChatRequestViewModel): void;
}

export interface IChatRequestViewModel {
	readonly id: string;
	/** @deprecated */
	readonly sessionId: string;
	readonly sessionResource: URI;
	/** This ID updates every time the underlying data changes */
	readonly dataId: string;
	readonly username: string;
	readonly avatarIcon?: URI | ThemeIcon;
	readonly message: IParsedChatRequest | IChatFollowup;
	readonly messageText: string;
	readonly attempt: number;
	readonly variables: IChatRequestVariableEntry[];
	currentRenderedHeight: number | undefined;
	readonly contentReferences?: ReadonlyArray<IChatContentReference>;
	readonly confirmation?: string;
	readonly shouldBeRemovedOnSend: IChatRequestDisablement | undefined;
	readonly isComplete: boolean;
	readonly isCompleteAddedRequest: boolean;
	readonly slashCommand: IChatAgentCommand | undefined;
	readonly agentOrSlashCommandDetected: boolean;
	readonly shouldBeBlocked?: boolean;
	readonly modelId?: string;
}

export interface IChatResponseMarkdownRenderData {
	renderedWordCount: number;
	lastRenderTime: number;
	isFullyRendered: boolean;
	originalMarkdown: IMarkdownString;
}

export interface IChatResponseMarkdownRenderData2 {
	renderedWordCount: number;
	lastRenderTime: number;
	isFullyRendered: boolean;
	originalMarkdown: IMarkdownString;
}

export interface IChatProgressMessageRenderData {
	progressMessage: IChatProgressMessage;

	/**
	 * Indicates whether this is part of a group of progress messages that are at the end of the response.
	 * (Not whether this particular item is the very last one in the response).
	 * Need to re-render and add to partsToRender when this changes.
	 */
	isAtEndOfResponse: boolean;

	/**
	 * Whether this progress message the very last item in the response.
	 * Need to re-render to update spinner vs check when this changes.
	 */
	isLast: boolean;
}

export interface IChatTaskRenderData {
	task: IChatTask;
	isSettled: boolean;
	progressLength: number;
}

export interface IChatResponseRenderData {
	renderedParts: IChatRendererContent[];

	renderedWordCount: number;
	lastRenderTime: number;
}

/**
 * Content type for references used during rendering, not in the model
 */
export interface IChatReferences {
	references: ReadonlyArray<IChatContentReference>;
	kind: 'references';
}

/**
 * Content type for the "Working" progress message
 */
export interface IChatWorkingProgress {
	kind: 'working';
}


/**
 * Content type for citations used during rendering, not in the model
 */
export interface IChatCodeCitations {
	citations: ReadonlyArray<IChatCodeCitation>;
	kind: 'codeCitations';
}

export interface IChatErrorDetailsPart {
	kind: 'errorDetails';
	errorDetails: IChatResponseErrorDetails;
	isLast: boolean;
}

export interface IChatChangesSummaryPart {
	readonly kind: 'changesSummary';
	readonly requestId: string;
	readonly sessionResource: URI;
}

/**
 * Type for content parts rendered by IChatListRenderer (not necessarily in the model)
 */
export type IChatRendererContent = IChatProgressRenderableResponseContent | IChatReferences | IChatCodeCitations | IChatErrorDetailsPart | IChatChangesSummaryPart | IChatWorkingProgress | IChatMcpServersStarting;

export interface IChatResponseViewModel {
	readonly model: IChatResponseModel;
	readonly id: string;
	readonly session: IChatViewModel;
	/** @deprecated */
	readonly sessionId: string;
	readonly sessionResource: URI;
	/** This ID updates every time the underlying data changes */
	readonly dataId: string;
	/** The ID of the associated IChatRequestViewModel */
	readonly requestId: string;
	readonly username: string;
	readonly avatarIcon?: URI | ThemeIcon;
	readonly agent?: IChatAgentData;
	readonly slashCommand?: IChatAgentCommand;
	readonly agentOrSlashCommandDetected: boolean;
	readonly response: IResponse;
	readonly usedContext: IChatUsedContext | undefined;
	readonly contentReferences: ReadonlyArray<IChatContentReference>;
	readonly codeCitations: ReadonlyArray<IChatCodeCitation>;
	readonly progressMessages: ReadonlyArray<IChatProgressMessage>;
	readonly isComplete: boolean;
	readonly isCanceled: boolean;
	readonly isStale: boolean;
	readonly vote: ChatAgentVoteDirection | undefined;
	readonly voteDownReason: ChatAgentVoteDownReason | undefined;
	readonly replyFollowups?: IChatFollowup[];
	readonly errorDetails?: IChatResponseErrorDetails;
	readonly result?: IChatAgentResult;
	readonly contentUpdateTimings?: IChatStreamStats;
	readonly shouldBeRemovedOnSend: IChatRequestDisablement | undefined;
	readonly isCompleteAddedRequest: boolean;
	renderData?: IChatResponseRenderData;
	currentRenderedHeight: number | undefined;
	setVote(vote: ChatAgentVoteDirection): void;
	setVoteDownReason(reason: ChatAgentVoteDownReason | undefined): void;
	usedReferencesExpanded?: boolean;
	vulnerabilitiesListExpanded: boolean;
	setEditApplied(edit: IChatTextEditGroup, editCount: number): void;
	readonly shouldBeBlocked: boolean;
}

export class ChatViewModel extends Disposable implements IChatViewModel {

	private readonly _onDidDisposeModel = this._register(new Emitter<void>());
	readonly onDidDisposeModel = this._onDidDisposeModel.event;

	private readonly _onDidChange = this._register(new Emitter<IChatViewModelChangeEvent>());
	readonly onDidChange = this._onDidChange.event;

	private readonly _items: (ChatRequestViewModel | ChatResponseViewModel)[] = [];

	private _inputPlaceholder: string | undefined = undefined;
	get inputPlaceholder(): string | undefined {
		return this._inputPlaceholder;
	}

	get model(): IChatModel {
		return this._model;
	}

	setInputPlaceholder(text: string): void {
		this._inputPlaceholder = text;
		this._onDidChange.fire({ kind: 'changePlaceholder' });
	}

	resetInputPlaceholder(): void {
		this._inputPlaceholder = undefined;
		this._onDidChange.fire({ kind: 'changePlaceholder' });
	}

	get sessionResource(): URI {
		return this._model.sessionResource;
	}

	constructor(
		private readonly _model: IChatModel,
		public readonly codeBlockModelCollection: CodeBlockModelCollection,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		_model.getRequests().forEach((request, i) => {
			const requestModel = this.instantiationService.createInstance(ChatRequestViewModel, request);
			this._items.push(requestModel);
			this.updateCodeBlockTextModels(requestModel);

			if (request.response) {
				this.onAddResponse(request.response);
			}
		});

		this._register(_model.onDidDispose(() => this._onDidDisposeModel.fire()));
		this._register(_model.onDidChange(e => {
			if (e.kind === 'addRequest') {
				const requestModel = this.instantiationService.createInstance(ChatRequestViewModel, e.request);
				this._items.push(requestModel);
				this.updateCodeBlockTextModels(requestModel);

				if (e.request.response) {
					this.onAddResponse(e.request.response);
				}
			} else if (e.kind === 'addResponse') {
				this.onAddResponse(e.response);
			} else if (e.kind === 'removeRequest') {
				const requestIdx = this._items.findIndex(item => isRequestVM(item) && item.id === e.requestId);
				if (requestIdx >= 0) {
					this._items.splice(requestIdx, 1);
				}

				const responseIdx = e.responseId && this._items.findIndex(item => isResponseVM(item) && item.id === e.responseId);
				if (typeof responseIdx === 'number' && responseIdx >= 0) {
					const items = this._items.splice(responseIdx, 1);
					const item = items[0];
					if (item instanceof ChatResponseViewModel) {
						item.dispose();
					}
				}
			}

			const modelEventToVmEvent: IChatViewModelChangeEvent =
				e.kind === 'addRequest' ? { kind: 'addRequest' }
					: e.kind === 'initialize' ? { kind: 'initialize' }
						: e.kind === 'setHidden' ? { kind: 'setHidden' }
							: null;
			this._onDidChange.fire(modelEventToVmEvent);
		}));
	}

	private onAddResponse(responseModel: IChatResponseModel) {
		const response = this.instantiationService.createInstance(ChatResponseViewModel, responseModel, this);
		this._register(response.onDidChange(() => {
			if (response.isComplete) {
				this.updateCodeBlockTextModels(response);
			}
			return this._onDidChange.fire(null);
		}));
		this._items.push(response);
		this.updateCodeBlockTextModels(response);
	}

	getItems(): (IChatRequestViewModel | IChatResponseViewModel)[] {
		return this._items.filter((item) => !item.shouldBeRemovedOnSend || item.shouldBeRemovedOnSend.afterUndoStop);
	}


	private _editing: IChatRequestViewModel | undefined = undefined;
	get editing(): IChatRequestViewModel | undefined {
		return this._editing;
	}

	setEditing(editing: IChatRequestViewModel | undefined): void {
		if (this.editing && editing && this.editing.id === editing.id) {
			return; // already editing this request
		}

		this._editing = editing;
	}

	override dispose() {
		super.dispose();
		dispose(this._items.filter((item): item is ChatResponseViewModel => item instanceof ChatResponseViewModel));
	}

	updateCodeBlockTextModels(model: IChatRequestViewModel | IChatResponseViewModel) {
		let content: string;
		if (isRequestVM(model)) {
			content = model.messageText;
		} else {
			content = annotateVulnerabilitiesInText(model.response.value).map(x => x.content.value).join('');
		}

		let codeBlockIndex = 0;
		marked.walkTokens(marked.lexer(content), token => {
			if (token.type === 'code') {
				const lang = token.lang || '';
				const text = token.text;
				this.codeBlockModelCollection.update(this._model.sessionResource, model, codeBlockIndex++, { text, languageId: lang, isComplete: true });
			}
		});
	}
}

export class ChatRequestViewModel implements IChatRequestViewModel {
	get id() {
		return this._model.id;
	}

	get dataId() {
		return this.id + `_${hash(this.variables)}_${hash(this.isComplete)}`;
	}

	/** @deprecated */
	get sessionId() {
		return this._model.session.sessionId;
	}

	get sessionResource() {
		return this._model.session.sessionResource;
	}

	get username() {
		return 'User';
	}

	get avatarIcon(): ThemeIcon {
		return Codicon.account;
	}

	get message() {
		return this._model.message;
	}

	get messageText() {
		return this.message.text;
	}

	get attempt() {
		return this._model.attempt;
	}

	get variables() {
		return this._model.variableData.variables;
	}

	get contentReferences() {
		return this._model.response?.contentReferences;
	}

	get confirmation() {
		return this._model.confirmation;
	}

	get isComplete() {
		return this._model.response?.isComplete ?? false;
	}

	get isCompleteAddedRequest() {
		return this._model.isCompleteAddedRequest;
	}

	get shouldBeRemovedOnSend() {
		return this._model.shouldBeRemovedOnSend;
	}

	get shouldBeBlocked() {
		return this._model.shouldBeBlocked;
	}

	get slashCommand(): IChatAgentCommand | undefined {
		return this._model.response?.slashCommand;
	}

	get agentOrSlashCommandDetected(): boolean {
		return this._model.response?.agentOrSlashCommandDetected ?? false;
	}

	currentRenderedHeight: number | undefined;

	get modelId() {
		return this._model.modelId;
	}

	constructor(
		private readonly _model: IChatRequestModel,
	) { }
}

export class ChatResponseViewModel extends Disposable implements IChatResponseViewModel {
	private _modelChangeCount = 0;

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	get model() {
		return this._model;
	}

	get id() {
		return this._model.id;
	}

	get dataId() {
		return this._model.id +
			`_${this._modelChangeCount}` +
			(this.isLast ? '_last' : '');
	}

	/** @deprecated */
	get sessionId() {
		return this._model.session.sessionId;
	}

	get sessionResource(): URI {
		return this._model.session.sessionResource;
	}

	get username() {
		if (this.agent) {
			const isAllowed = this.chatAgentNameService.getAgentNameRestriction(this.agent);
			if (isAllowed) {
				return this.agent.fullName || this.agent.name;
			} else {
				return getFullyQualifiedId(this.agent);
			}
		}

		return this._model.username;
	}

	get avatarIcon() {
		return this._model.avatarIcon;
	}

	get agent() {
		return this._model.agent;
	}

	get slashCommand() {
		return this._model.slashCommand;
	}

	get agentOrSlashCommandDetected() {
		return this._model.agentOrSlashCommandDetected;
	}

	get response(): IResponse {
		return this._model.response;
	}

	get usedContext(): IChatUsedContext | undefined {
		return this._model.usedContext;
	}

	get contentReferences(): ReadonlyArray<IChatContentReference> {
		return this._model.contentReferences;
	}

	get codeCitations(): ReadonlyArray<IChatCodeCitation> {
		return this._model.codeCitations;
	}

	get progressMessages(): ReadonlyArray<IChatProgressMessage> {
		return this._model.progressMessages;
	}

	get isComplete() {
		return this._model.isComplete;
	}

	get isCanceled() {
		return this._model.isCanceled;
	}

	get shouldBeBlocked() {
		return this._model.shouldBeBlocked;
	}

	get shouldBeRemovedOnSend() {
		return this._model.shouldBeRemovedOnSend;
	}

	get isCompleteAddedRequest() {
		return this._model.isCompleteAddedRequest;
	}

	get replyFollowups() {
		return this._model.followups?.filter((f): f is IChatFollowup => f.kind === 'reply');
	}

	get result() {
		return this._model.result;
	}

	get errorDetails(): IChatResponseErrorDetails | undefined {
		return this.result?.errorDetails;
	}

	get vote() {
		return this._model.vote;
	}

	get voteDownReason() {
		return this._model.voteDownReason;
	}

	get requestId() {
		return this._model.requestId;
	}

	get isStale() {
		return this._model.isStale;
	}

	get isLast(): boolean {
		return this.session.getItems().at(-1) === this;
	}

	renderData: IChatResponseRenderData | undefined = undefined;
	currentRenderedHeight: number | undefined;

	private _usedReferencesExpanded: boolean | undefined;
	get usedReferencesExpanded(): boolean | undefined {
		if (typeof this._usedReferencesExpanded === 'boolean') {
			return this._usedReferencesExpanded;
		}

		return undefined;
	}

	set usedReferencesExpanded(v: boolean) {
		this._usedReferencesExpanded = v;
	}

	private _vulnerabilitiesListExpanded: boolean = false;
	get vulnerabilitiesListExpanded(): boolean {
		return this._vulnerabilitiesListExpanded;
	}

	set vulnerabilitiesListExpanded(v: boolean) {
		this._vulnerabilitiesListExpanded = v;
	}

	private readonly liveUpdateTracker: ChatStreamStatsTracker | undefined;

	get contentUpdateTimings(): IChatStreamStats | undefined {
		return this.liveUpdateTracker?.data;
	}

	constructor(
		private readonly _model: IChatResponseModel,
		public readonly session: IChatViewModel,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IChatAgentNameService private readonly chatAgentNameService: IChatAgentNameService,
	) {
		super();

		if (!_model.isComplete) {
			this.liveUpdateTracker = this.instantiationService.createInstance(ChatStreamStatsTracker);
		}

		this._register(_model.onDidChange(() => {
			if (this.liveUpdateTracker) {
				const wordCount = countWords(_model.entireResponse.getMarkdown());
				this.liveUpdateTracker.update({ totalWordCount: wordCount });
			}

			// new data -> new id, new content to render
			this._modelChangeCount++;

			this._onDidChange.fire();
		}));
	}

	setVote(vote: ChatAgentVoteDirection): void {
		this._modelChangeCount++;
		this._model.setVote(vote);
	}

	setVoteDownReason(reason: ChatAgentVoteDownReason | undefined): void {
		this._modelChangeCount++;
		this._model.setVoteDownReason(reason);
	}

	setEditApplied(edit: IChatTextEditGroup, editCount: number) {
		this._modelChangeCount++;
		this._model.setEditApplied(edit, editCount);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatWidgetHistoryService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatWidgetHistoryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals as arraysEqual } from '../../../../base/common/arrays.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Memento } from '../../../common/memento.js';
import { IChatModelInputState } from './chatModel.js';
import { CHAT_PROVIDER_ID } from './chatParticipantContribTypes.js';
import { IChatRequestVariableEntry } from './chatVariableEntries.js';
import { ChatAgentLocation, ChatModeKind } from './constants.js';

interface IChatHistoryEntry {
	text: string;
	state?: IChatInputState;
}

/** The collected input state for chat history entries */
interface IChatInputState {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
	chatContextAttachments?: ReadonlyArray<IChatRequestVariableEntry>;

	/**
	 * This should be a mode id (ChatMode | string).
	 * { id: string } is the old IChatMode. This is deprecated but may still be in persisted data.
	 */
	chatMode?: ChatModeKind | string | { id: string };
}

export const IChatWidgetHistoryService = createDecorator<IChatWidgetHistoryService>('IChatWidgetHistoryService');
export interface IChatWidgetHistoryService {
	_serviceBrand: undefined;

	readonly onDidChangeHistory: Event<ChatHistoryChange>;

	clearHistory(): void;
	getHistory(location: ChatAgentLocation): readonly IChatModelInputState[];
	append(location: ChatAgentLocation, history: IChatModelInputState): void;
}

interface IChatHistory {
	history?: { [providerId: string]: IChatModelInputState[] };
}

export type ChatHistoryChange = { kind: 'append'; entry: IChatModelInputState } | { kind: 'clear' };

export const ChatInputHistoryMaxEntries = 40;

export class ChatWidgetHistoryService extends Disposable implements IChatWidgetHistoryService {
	_serviceBrand: undefined;

	private memento: Memento<IChatHistory>;
	private viewState: IChatHistory;

	private readonly _onDidChangeHistory = this._register(new Emitter<ChatHistoryChange>());
	private changed = false;
	readonly onDidChangeHistory = this._onDidChangeHistory.event;

	constructor(
		@IStorageService storageService: IStorageService
	) {
		super();

		this.memento = new Memento<IChatHistory>('interactive-session', storageService);
		const loadedState = this.memento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		this.viewState = loadedState;

		this._register(storageService.onWillSaveState(() => {
			if (this.changed) {
				this.memento.saveMemento();
				this.changed = false;
			}
		}));
	}

	getHistory(location: ChatAgentLocation): IChatModelInputState[] {
		const key = this.getKey(location);
		const history = this.viewState.history?.[key] ?? [];
		return history.map(entry => this.migrateHistoryEntry(entry));
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private migrateHistoryEntry(entry: any): IChatModelInputState {
		// If it's already in the new format (has 'inputText' property), return as-is
		if (entry.inputText !== undefined) {
			return entry as IChatModelInputState;
		}

		// Otherwise, it's an old IChatHistoryEntry with 'text' and 'state' properties
		const oldEntry = entry as IChatHistoryEntry;
		const oldState = oldEntry.state ?? {};

		// Migrate chatMode to the new mode structure
		let modeId: string;
		let modeKind: ChatModeKind | undefined;
		if (oldState.chatMode) {
			if (typeof oldState.chatMode === 'string') {
				modeId = oldState.chatMode;
				modeKind = Object.values(ChatModeKind).includes(oldState.chatMode as ChatModeKind)
					? oldState.chatMode as ChatModeKind
					: undefined;
			} else if (typeof oldState.chatMode === 'object' && oldState.chatMode !== null) {
				// Old format: { id: string }
				const oldMode = oldState.chatMode as { id?: string };
				modeId = oldMode.id ?? ChatModeKind.Ask;
				modeKind = oldMode.id && Object.values(ChatModeKind).includes(oldMode.id as ChatModeKind)
					? oldMode.id as ChatModeKind
					: undefined;
			} else {
				modeId = ChatModeKind.Ask;
				modeKind = ChatModeKind.Ask;
			}
		} else {
			modeId = ChatModeKind.Ask;
			modeKind = ChatModeKind.Ask;
		}

		return {
			inputText: oldEntry.text ?? '',
			attachments: oldState.chatContextAttachments ?? [],
			mode: {
				id: modeId,
				kind: modeKind
			},
			contrib: oldEntry.state || {},
			selectedModel: undefined,
			selections: []
		};
	}

	private getKey(location: ChatAgentLocation): string {
		// Preserve history for panel by continuing to use the same old provider id. Use the location as a key for other chat locations.
		return location === ChatAgentLocation.Chat ? CHAT_PROVIDER_ID : location;
	}

	append(location: ChatAgentLocation, history: IChatModelInputState): void {
		this.viewState.history ??= {};

		const key = this.getKey(location);
		this.viewState.history[key] = this.getHistory(location).concat(history).slice(-ChatInputHistoryMaxEntries);
		this.changed = true;
		this._onDidChangeHistory.fire({ kind: 'append', entry: history });
	}

	clearHistory(): void {
		this.viewState.history = {};
		this.changed = true;
		this._onDidChangeHistory.fire({ kind: 'clear' });
	}
}

export class ChatHistoryNavigator extends Disposable {
	/**
	 * Index of our point in history. Goes 1 past the length of `_history`
	 */
	private _currentIndex: number;
	private _history: readonly IChatModelInputState[];
	private _overlay: (IChatModelInputState | undefined)[] = [];

	public get values() {
		return this.chatWidgetHistoryService.getHistory(this.location);
	}

	constructor(
		private readonly location: ChatAgentLocation,
		@IChatWidgetHistoryService private readonly chatWidgetHistoryService: IChatWidgetHistoryService
	) {
		super();
		this._history = this.chatWidgetHistoryService.getHistory(this.location);
		this._currentIndex = this._history.length;

		this._register(this.chatWidgetHistoryService.onDidChangeHistory(e => {
			if (e.kind === 'append') {
				const prevLength = this._history.length;
				this._history = this.chatWidgetHistoryService.getHistory(this.location);
				const newLength = this._history.length;

				// If this append operation adjusted all history entries back, move our index back too
				// if we weren't pointing to the end of the history.
				if (prevLength === newLength) {
					this._overlay.shift();
					if (this._currentIndex < this._history.length) {
						this._currentIndex = Math.max(this._currentIndex - 1, 0);
					}
				} else if (this._currentIndex === prevLength) {
					this._currentIndex = newLength;
				}
			} else if (e.kind === 'clear') {
				this._history = [];
				this._currentIndex = 0;
				this._overlay = [];
			}
		}));
	}

	public isAtEnd() {
		return this._currentIndex === Math.max(this._history.length, this._overlay.length);
	}

	public isAtStart() {
		return this._currentIndex === 0;
	}

	/**
	 * Replaces a history entry at the current index in this view of the history.
	 * Allows editing of old history entries while preventing accidental navigation
	 * from losing the edits.
	 */
	public overlay(entry: IChatModelInputState) {
		this._overlay[this._currentIndex] = entry;
	}

	public resetCursor() {
		this._currentIndex = this._history.length;
	}

	public previous() {
		this._currentIndex = Math.max(this._currentIndex - 1, 0);
		return this.current();
	}

	public next() {
		this._currentIndex = Math.min(this._currentIndex + 1, this._history.length);
		return this.current();
	}

	public current() {
		return this._overlay[this._currentIndex] ?? this._history[this._currentIndex];
	}

	/**
	 * Appends a new entry to the navigator. Resets the state back to the end
	 * and clears any overlayed entries.
	 */
	public append(entry: IChatModelInputState) {
		this._overlay = [];
		this._currentIndex = this._history.length;

		if (!entriesEqual(this._history.at(-1), entry)) {
			this.chatWidgetHistoryService.append(this.location, entry);
		}
	}
}

function entriesEqual(a: IChatModelInputState | undefined, b: IChatModelInputState | undefined): boolean {
	if (!a || !b) {
		return false;
	}

	if (a.inputText !== b.inputText) {
		return false;
	}

	if (!arraysEqual(a.attachments, b.attachments, (x, y) => x.id === y.id)) {
		return false;
	}

	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatWordCounter.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatWordCounter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as markedKatexExtension from '../../markdown/common/markedKatexExtension.js';

export interface IWordCountResult {
	value: string;
	returnedWordCount: number;
	totalWordCount: number;
	isFullString: boolean;
}

const r = String.raw;

/**
 * Matches `[text](link title?)` or `[text](<link> title?)`
 *
 * Taken from vscode-markdown-languageservice
 */
const linkPattern =
	r`(?<!\\)` + // Must not start with escape

	// text
	r`(!?\[` + // open prefix match -->
	/**/r`(?:` +
	/*****/r`[^\[\]\\]|` + // Non-bracket chars, or...
	/*****/r`\\.|` + // Escaped char, or...
	/*****/r`\[[^\[\]]*\]` + // Matched bracket pair
	/**/r`)*` +
	r`\])` + // <-- close prefix match

	// Destination
	r`(\(\s*)` + // Pre href
	/**/r`(` +
	/*****/r`[^\s\(\)<](?:[^\s\(\)]|\([^\s\(\)]*?\))*|` + // Link without whitespace, or...
	/*****/r`<(?:\\[<>]|[^<>])+>` + // In angle brackets
	/**/r`)` +

	// Title
	/**/r`\s*(?:"[^"]*"|'[^']*'|\([^\(\)]*\))?\s*` +
	r`\)`;

export function getNWords(str: string, numWordsToCount: number): IWordCountResult {
	// This regex matches each word and skips over whitespace and separators. A word is:
	// A markdown link
	// Inline math
	// One chinese character
	// One or more + - =, handled so that code like "a=1+2-3" is broken up better
	// One or more characters that aren't whitepace or any of the above
	const backtick = '`';

	const wordRegExp = new RegExp('(?:' + linkPattern + ')|(?:' + markedKatexExtension.mathInlineRegExp.source + r`)|\p{sc=Han}|=+|\++|-+|[^\s\|\p{sc=Han}|=|\+|\-|${backtick}]+`, 'gu');
	const allWordMatches = Array.from(str.matchAll(wordRegExp));

	const targetWords = allWordMatches.slice(0, numWordsToCount);

	const endIndex = numWordsToCount >= allWordMatches.length
		? str.length // Reached end of string
		: targetWords.length ? targetWords.at(-1)!.index + targetWords.at(-1)![0].length : 0;

	const value = str.substring(0, endIndex);
	return {
		value,
		returnedWordCount: targetWords.length === 0 ? (value.length ? 1 : 0) : targetWords.length,
		isFullString: endIndex >= str.length,
		totalWordCount: allWordMatches.length
	};
}

export function countWords(str: string): number {
	const result = getNWords(str, Number.MAX_SAFE_INTEGER);
	return result.returnedWordCount;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/codeBlockModelCollection.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/codeBlockModelCollection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { encodeBase64, VSBuffer } from '../../../../base/common/buffer.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Disposable, IReference } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { Range } from '../../../../editor/common/core/range.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../editor/common/languages/modesRegistry.js';
import { EndOfLinePreference, ITextModel } from '../../../../editor/common/model.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { extractCodeblockUrisFromText, extractVulnerabilitiesFromText, IMarkdownVulnerability } from './annotations.js';
import { IChatRequestViewModel, IChatResponseViewModel, isResponseVM } from './chatViewModel.js';


interface CodeBlockContent {
	readonly text: string;
	readonly languageId?: string;
	readonly isComplete: boolean;
}

export interface CodeBlockEntry {
	readonly model: Promise<ITextModel>;
	readonly vulns: readonly IMarkdownVulnerability[];
	readonly codemapperUri?: URI;
	readonly isEdit?: boolean;
}

export class CodeBlockModelCollection extends Disposable {

	private readonly _models = new Map<string, {
		model: Promise<IReference<IResolvedTextEditorModel>>;
		vulns: readonly IMarkdownVulnerability[];
		inLanguageId: string | undefined;
		codemapperUri?: URI;
		isEdit?: boolean;
	}>();

	/**
	 * Max number of models to keep in memory.
	 *
	 * Currently always maintains the most recently created models.
	 */
	private readonly maxModelCount = 100;

	constructor(
		private readonly tag: string | undefined,
		@ILanguageService private readonly languageService: ILanguageService,
		@ITextModelService private readonly textModelService: ITextModelService,
	) {
		super();

		this._register(this.languageService.onDidChange(async () => {
			for (const entry of this._models.values()) {
				if (!entry.inLanguageId) {
					continue;
				}

				const model = (await entry.model).object;
				const existingLanguageId = model.getLanguageId();
				if (!existingLanguageId || existingLanguageId === PLAINTEXT_LANGUAGE_ID) {
					this.trySetTextModelLanguage(entry.inLanguageId, model.textEditorModel);
				}
			}
		}));
	}

	public override dispose(): void {
		super.dispose();
		this.clear();
	}

	get(sessionResource: URI, chat: IChatRequestViewModel | IChatResponseViewModel, codeBlockIndex: number): CodeBlockEntry | undefined {
		const entry = this._models.get(this.getKey(sessionResource, chat, codeBlockIndex));
		if (!entry) {
			return;
		}
		return {
			model: entry.model.then(ref => ref.object.textEditorModel),
			vulns: entry.vulns,
			codemapperUri: entry.codemapperUri,
			isEdit: entry.isEdit,
		};
	}

	getOrCreate(sessionResource: URI, chat: IChatRequestViewModel | IChatResponseViewModel, codeBlockIndex: number): CodeBlockEntry {
		const existing = this.get(sessionResource, chat, codeBlockIndex);
		if (existing) {
			return existing;
		}

		const uri = this.getCodeBlockUri(sessionResource, chat, codeBlockIndex);
		const model = this.textModelService.createModelReference(uri);
		this._models.set(this.getKey(sessionResource, chat, codeBlockIndex), {
			model: model,
			vulns: [],
			inLanguageId: undefined,
			codemapperUri: undefined,
		});

		while (this._models.size > this.maxModelCount) {
			const first = Iterable.first(this._models.keys());
			if (!first) {
				break;
			}
			this.delete(first);
		}

		return { model: model.then(x => x.object.textEditorModel), vulns: [], codemapperUri: undefined };
	}

	private delete(key: string) {
		const entry = this._models.get(key);
		if (!entry) {
			return;
		}

		entry.model.then(ref => ref.dispose());
		this._models.delete(key);
	}

	clear(): void {
		this._models.forEach(async entry => await entry.model.then(ref => ref.dispose()));
		this._models.clear();
	}

	updateSync(sessionResource: URI, chat: IChatRequestViewModel | IChatResponseViewModel, codeBlockIndex: number, content: CodeBlockContent): CodeBlockEntry {
		const entry = this.getOrCreate(sessionResource, chat, codeBlockIndex);

		this.updateInternalCodeBlockEntry(content, sessionResource, chat, codeBlockIndex);

		return this.get(sessionResource, chat, codeBlockIndex) ?? entry;
	}

	markCodeBlockCompleted(sessionResource: URI, chat: IChatRequestViewModel | IChatResponseViewModel, codeBlockIndex: number): void {
		const entry = this._models.get(this.getKey(sessionResource, chat, codeBlockIndex));
		if (!entry) {
			return;
		}
		// TODO: fill this in once we've implemented https://github.com/microsoft/vscode/issues/232538
	}

	async update(sessionResource: URI, chat: IChatRequestViewModel | IChatResponseViewModel, codeBlockIndex: number, content: CodeBlockContent): Promise<CodeBlockEntry> {
		const entry = this.getOrCreate(sessionResource, chat, codeBlockIndex);

		const newText = this.updateInternalCodeBlockEntry(content, sessionResource, chat, codeBlockIndex);

		const textModel = await entry.model;
		if (!textModel || textModel.isDisposed()) {
			// Somehow we get an undefined textModel sometimes - #237782
			return entry;
		}

		if (content.languageId) {
			this.trySetTextModelLanguage(content.languageId, textModel);
		}

		const currentText = textModel.getValue(EndOfLinePreference.LF);
		if (newText === currentText) {
			return entry;
		}

		if (newText.startsWith(currentText)) {
			const text = newText.slice(currentText.length);
			const lastLine = textModel.getLineCount();
			const lastCol = textModel.getLineMaxColumn(lastLine);
			textModel.applyEdits([{ range: new Range(lastLine, lastCol, lastLine, lastCol), text }]);
		} else {
			// console.log(`Failed to optimize setText`);
			textModel.setValue(newText);
		}

		return entry;
	}

	private updateInternalCodeBlockEntry(content: CodeBlockContent, sessionResource: URI, chat: IChatResponseViewModel | IChatRequestViewModel, codeBlockIndex: number) {
		const entry = this._models.get(this.getKey(sessionResource, chat, codeBlockIndex));
		if (entry) {
			entry.inLanguageId = content.languageId;
		}

		const extractedVulns = extractVulnerabilitiesFromText(content.text);
		let newText = fixCodeText(extractedVulns.newText, content.languageId);
		if (entry) {
			entry.vulns = extractedVulns.vulnerabilities;
		}

		const codeblockUri = extractCodeblockUrisFromText(newText);
		if (codeblockUri) {
			if (entry) {
				entry.codemapperUri = codeblockUri.uri;
				entry.isEdit = codeblockUri.isEdit;
			}

			newText = codeblockUri.textWithoutResult;
		}

		if (content.isComplete) {
			this.markCodeBlockCompleted(sessionResource, chat, codeBlockIndex);
		}

		return newText;
	}

	private trySetTextModelLanguage(inLanguageId: string, textModel: ITextModel) {
		const vscodeLanguageId = this.languageService.getLanguageIdByLanguageName(inLanguageId);
		if (vscodeLanguageId && vscodeLanguageId !== textModel.getLanguageId()) {
			textModel.setLanguage(vscodeLanguageId);
		}
	}

	private getKey(sessionResource: URI, chat: IChatRequestViewModel | IChatResponseViewModel, index: number): string {
		return `${sessionResource.toString()}/${chat.id}/${index}`;
	}

	private getCodeBlockUri(sessionResource: URI, chat: IChatRequestViewModel | IChatResponseViewModel, index: number): URI {
		const metadata = this.getUriMetaData(chat);
		const indexPart = this.tag ? `${this.tag}-${index}` : `${index}`;
		const encodedSessionId = encodeBase64(VSBuffer.wrap(new TextEncoder().encode(sessionResource.toString())), false, true);
		return URI.from({
			scheme: Schemas.vscodeChatCodeBlock,
			authority: encodedSessionId,
			path: `/${chat.id}/${indexPart}`,
			fragment: metadata ? JSON.stringify(metadata) : undefined,
		});
	}

	private getUriMetaData(chat: IChatRequestViewModel | IChatResponseViewModel) {
		if (!isResponseVM(chat)) {
			return undefined;
		}

		return {
			references: chat.contentReferences.map(ref => {
				if (typeof ref.reference === 'string') {
					return;
				}

				const uriOrLocation = 'variableName' in ref.reference ?
					ref.reference.value :
					ref.reference;
				if (!uriOrLocation) {
					return;
				}

				if (URI.isUri(uriOrLocation)) {
					return {
						uri: uriOrLocation.toJSON()
					};
				}

				return {
					uri: uriOrLocation.uri.toJSON(),
					range: uriOrLocation.range,
				};
			})
		};
	}
}

function fixCodeText(text: string, languageId: string | undefined): string {
	if (languageId === 'php') {
		// <?php or short tag version <?
		if (!text.trim().startsWith('<?')) {
			return `<?php\n${text}`;
		}
	}

	return text;
}
```

--------------------------------------------------------------------------------

````

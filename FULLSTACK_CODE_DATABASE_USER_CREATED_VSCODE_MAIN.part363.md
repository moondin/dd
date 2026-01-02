---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 363
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 363 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/common/constants.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/constants.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../base/common/network.js';
import { IChatSessionsService } from './chatSessionsService.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';

export enum ChatConfiguration {
	AgentEnabled = 'chat.agent.enabled',
	Edits2Enabled = 'chat.edits2.enabled',
	ExtensionToolsEnabled = 'chat.extensionTools.enabled',
	EditRequests = 'chat.editRequests',
	GlobalAutoApprove = 'chat.tools.global.autoApprove',
	AutoApproveEdits = 'chat.tools.edits.autoApprove',
	AutoApprovedUrls = 'chat.tools.urls.autoApprove',
	EligibleForAutoApproval = 'chat.tools.eligibleForAutoApproval',
	EnableMath = 'chat.math.enabled',
	CheckpointsEnabled = 'chat.checkpoints.enabled',
	ThinkingStyle = 'chat.agent.thinkingStyle',
	ThinkingGenerateTitles = 'chat.agent.thinking.generateTitles',
	TodosShowWidget = 'chat.tools.todos.showWidget',
	NotifyWindowOnResponseReceived = 'chat.notifyWindowOnResponseReceived',
	ChatViewSessionsEnabled = 'chat.viewSessions.enabled',
	ChatViewSessionsOrientation = 'chat.viewSessions.orientation',
	ChatViewTitleEnabled = 'chat.viewTitle.enabled',
	ChatViewWelcomeEnabled = 'chat.viewWelcome.enabled',
	SubagentToolCustomAgents = 'chat.customAgentInSubagent.enabled',
	ShowCodeBlockProgressAnimation = 'chat.agent.codeBlockProgress',
	RestoreLastPanelSession = 'chat.restoreLastPanelSession',
	ExitAfterDelegation = 'chat.exitAfterDelegation',
	SuspendThrottling = 'chat.suspendThrottling',
}

/**
 * The "kind" of agents for custom agents.
 */
export enum ChatModeKind {
	Ask = 'ask',
	Edit = 'edit',
	Agent = 'agent'
}

export function validateChatMode(mode: unknown): ChatModeKind | undefined {
	switch (mode) {
		case ChatModeKind.Ask:
		case ChatModeKind.Edit:
		case ChatModeKind.Agent:
			return mode as ChatModeKind;
		default:
			return undefined;
	}
}

export function isChatMode(mode: unknown): mode is ChatModeKind {
	return !!validateChatMode(mode);
}

// Thinking display modes for pinned content
export enum ThinkingDisplayMode {
	Collapsed = 'collapsed',
	CollapsedPreview = 'collapsedPreview',
	FixedScrolling = 'fixedScrolling',
}

export enum CollapsedToolsDisplayMode {
	Off = 'off',
	WithThinking = 'withThinking',
	Always = 'always',
}

export type RawChatParticipantLocation = 'panel' | 'terminal' | 'notebook' | 'editing-session';

export enum ChatAgentLocation {
	/**
	 * This is chat, whether it's in the sidebar, a chat editor, or quick chat.
	 * Leaving the values alone as they are in stored data so we don't have to normalize them.
	 */
	Chat = 'panel',
	Terminal = 'terminal',
	Notebook = 'notebook',
	/**
	 * EditorInline means inline chat in a text editor.
	 */
	EditorInline = 'editor',
}

export namespace ChatAgentLocation {
	export function fromRaw(value: RawChatParticipantLocation | string): ChatAgentLocation {
		switch (value) {
			case 'panel': return ChatAgentLocation.Chat;
			case 'terminal': return ChatAgentLocation.Terminal;
			case 'notebook': return ChatAgentLocation.Notebook;
			case 'editor': return ChatAgentLocation.EditorInline;
		}
		return ChatAgentLocation.Chat;
	}
}

/**
 * List of file schemes that are always unsupported for use in chat
 */
const chatAlwaysUnsupportedFileSchemes = new Set([
	Schemas.vscodeChatEditor,
	Schemas.walkThrough,
	Schemas.vscodeLocalChatSession,
	Schemas.vscodeSettings,
	Schemas.webviewPanel,
	Schemas.vscodeUserData,
	Schemas.extension,
	'ccreq',
	'openai-codex', // Codex session custom editor scheme
]);

export function isSupportedChatFileScheme(accessor: ServicesAccessor, scheme: string): boolean {
	const chatService = accessor.get(IChatSessionsService);

	// Exclude schemes we always know are bad
	if (chatAlwaysUnsupportedFileSchemes.has(scheme)) {
		return false;
	}

	// Plus any schemes used by content providers
	if (chatService.getContentProviderSchemes().includes(scheme)) {
		return false;
	}

	// Everything else is supported
	return true;
}

export const MANAGE_CHAT_COMMAND_ID = 'workbench.action.chat.manage';
export const ChatEditorTitleMaxLength = 30;

export const CHAT_TERMINAL_OUTPUT_MAX_PREVIEW_LINES = 1000;
export const CONTEXT_MODELS_EDITOR = new RawContextKey<boolean>('inModelsEditor', false);
export const CONTEXT_MODELS_SEARCH_FOCUS = new RawContextKey<boolean>('inModelsSearch', false);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/ignoredFiles.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/ignoredFiles.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export interface ILanguageModelIgnoredFileProvider {
	isFileIgnored(uri: URI, token: CancellationToken): Promise<boolean>;
}

export const ILanguageModelIgnoredFilesService = createDecorator<ILanguageModelIgnoredFilesService>('languageModelIgnoredFilesService');
export interface ILanguageModelIgnoredFilesService {
	_serviceBrand: undefined;

	fileIsIgnored(uri: URI, token: CancellationToken): Promise<boolean>;
	registerIgnoredFileProvider(provider: ILanguageModelIgnoredFileProvider): IDisposable;
}

export class LanguageModelIgnoredFilesService implements ILanguageModelIgnoredFilesService {
	_serviceBrand: undefined;

	private readonly _providers = new Set<ILanguageModelIgnoredFileProvider>();

	async fileIsIgnored(uri: URI, token: CancellationToken): Promise<boolean> {
		// Just use the first provider
		const provider = this._providers.values().next().value;
		return provider ?
			provider.isFileIgnored(uri, token) :
			false;
	}

	registerIgnoredFileProvider(provider: ILanguageModelIgnoredFileProvider): IDisposable {
		this._providers.add(provider);
		return toDisposable(() => {
			this._providers.delete(provider);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/languageModels.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/languageModels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SequencerByKey } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { IJSONSchema, TypeFromJsonSchema } from '../../../../base/common/jsonSchema.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { isFalsyOrWhitespace } from '../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ChatEntitlement, IChatEntitlementService } from '../../../services/chat/common/chatEntitlementService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { ExtensionsRegistry } from '../../../services/extensions/common/extensionsRegistry.js';
import { ChatContextKeys } from './chatContextKeys.js';

export const enum ChatMessageRole {
	System,
	User,
	Assistant,
}

export enum LanguageModelPartAudience {
	Assistant = 0,
	User = 1,
	Extension = 2,
}

export interface IChatMessageTextPart {
	type: 'text';
	value: string;
	audience?: LanguageModelPartAudience[];
}

export interface IChatMessageImagePart {
	type: 'image_url';
	value: IChatImageURLPart;
}

export interface IChatMessageThinkingPart {
	type: 'thinking';
	value: string | string[];
	id?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	metadata?: { readonly [key: string]: any };
}

export interface IChatMessageDataPart {
	type: 'data';
	mimeType: string;
	data: VSBuffer;
	audience?: LanguageModelPartAudience[];
}

export interface IChatImageURLPart {
	/**
	 * The image's MIME type (e.g., "image/png", "image/jpeg").
	 */
	mimeType: ChatImageMimeType;

	/**
	 * The raw binary data of the image, encoded as a Uint8Array. Note: do not use base64 encoding. Maximum image size is 5MB.
	 */
	data: VSBuffer;
}

/**
 * Enum for supported image MIME types.
 */
export enum ChatImageMimeType {
	PNG = 'image/png',
	JPEG = 'image/jpeg',
	GIF = 'image/gif',
	WEBP = 'image/webp',
	BMP = 'image/bmp',
}

/**
 * Specifies the detail level of the image.
 */
export enum ImageDetailLevel {
	Low = 'low',
	High = 'high'
}


export interface IChatMessageToolResultPart {
	type: 'tool_result';
	toolCallId: string;
	value: (IChatResponseTextPart | IChatResponsePromptTsxPart | IChatResponseDataPart)[];
	isError?: boolean;
}

export type IChatMessagePart = IChatMessageTextPart | IChatMessageToolResultPart | IChatResponseToolUsePart | IChatMessageImagePart | IChatMessageDataPart | IChatMessageThinkingPart;

export interface IChatMessage {
	readonly name?: string | undefined;
	readonly role: ChatMessageRole;
	readonly content: IChatMessagePart[];
}

export interface IChatResponseTextPart {
	type: 'text';
	value: string;
	audience?: LanguageModelPartAudience[];
}

export interface IChatResponsePromptTsxPart {
	type: 'prompt_tsx';
	value: unknown;
}

export interface IChatResponseDataPart {
	type: 'data';
	mimeType: string;
	data: VSBuffer;
	audience?: LanguageModelPartAudience[];
}

export interface IChatResponseToolUsePart {
	type: 'tool_use';
	name: string;
	toolCallId: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parameters: any;
}

export interface IChatResponseThinkingPart {
	type: 'thinking';
	value: string | string[];
	id?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	metadata?: { readonly [key: string]: any };
}

export interface IChatResponsePullRequestPart {
	type: 'pullRequest';
	uri: URI;
	title: string;
	description: string;
	author: string;
	linkTag: string;
}

export type IChatResponsePart = IChatResponseTextPart | IChatResponseToolUsePart | IChatResponseDataPart | IChatResponseThinkingPart;

export type IExtendedChatResponsePart = IChatResponsePullRequestPart;

export interface ILanguageModelChatMetadata {
	readonly extension: ExtensionIdentifier;

	readonly name: string;
	readonly id: string;
	readonly vendor: string;
	readonly version: string;
	readonly tooltip?: string;
	readonly detail?: string;
	readonly family: string;
	readonly maxInputTokens: number;
	readonly maxOutputTokens: number;

	readonly isDefault?: boolean;
	readonly isUserSelectable?: boolean;
	readonly statusIcon?: ThemeIcon;
	readonly modelPickerCategory: { label: string; order: number } | undefined;
	readonly auth?: {
		readonly providerLabel: string;
		readonly accountLabel?: string;
	};
	readonly capabilities?: {
		readonly vision?: boolean;
		readonly toolCalling?: boolean;
		readonly agentMode?: boolean;
		readonly editTools?: ReadonlyArray<string>;
	};
}

export namespace ILanguageModelChatMetadata {
	export function suitableForAgentMode(metadata: ILanguageModelChatMetadata): boolean {
		const supportsToolsAgent = typeof metadata.capabilities?.agentMode === 'undefined' || metadata.capabilities.agentMode;
		return supportsToolsAgent && !!metadata.capabilities?.toolCalling;
	}

	export function asQualifiedName(metadata: ILanguageModelChatMetadata): string {
		return `${metadata.name} (${metadata.vendor})`;
	}

	export function matchesQualifiedName(name: string, metadata: ILanguageModelChatMetadata): boolean {
		if (metadata.vendor === 'copilot' && name === metadata.name) {
			return true;
		}
		return name === asQualifiedName(metadata);
	}
}

export interface ILanguageModelChatResponse {
	stream: AsyncIterable<IChatResponsePart | IChatResponsePart[]>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	result: Promise<any>;
}

export interface ILanguageModelChatProvider {
	readonly onDidChange: Event<void>;
	provideLanguageModelChatInfo(options: { silent: boolean }, token: CancellationToken): Promise<ILanguageModelChatMetadataAndIdentifier[]>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	sendChatRequest(modelId: string, messages: IChatMessage[], from: ExtensionIdentifier, options: { [name: string]: any }, token: CancellationToken): Promise<ILanguageModelChatResponse>;
	provideTokenCount(modelId: string, message: string | IChatMessage, token: CancellationToken): Promise<number>;
}

export interface ILanguageModelChat {
	metadata: ILanguageModelChatMetadata;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	sendChatRequest(messages: IChatMessage[], from: ExtensionIdentifier, options: { [name: string]: any }, token: CancellationToken): Promise<ILanguageModelChatResponse>;
	provideTokenCount(message: string | IChatMessage, token: CancellationToken): Promise<number>;
}

export interface ILanguageModelChatSelector {
	readonly name?: string;
	readonly id?: string;
	readonly vendor?: string;
	readonly version?: string;
	readonly family?: string;
	readonly tokens?: number;
	readonly extension?: ExtensionIdentifier;
}


export function isILanguageModelChatSelector(value: unknown): value is ILanguageModelChatSelector {
	if (typeof value !== 'object' || value === null) {
		return false;
	}
	const obj = value as Record<string, unknown>;
	return (
		(obj.name === undefined || typeof obj.name === 'string') &&
		(obj.id === undefined || typeof obj.id === 'string') &&
		(obj.vendor === undefined || typeof obj.vendor === 'string') &&
		(obj.version === undefined || typeof obj.version === 'string') &&
		(obj.family === undefined || typeof obj.family === 'string') &&
		(obj.tokens === undefined || typeof obj.tokens === 'number') &&
		(obj.extension === undefined || typeof obj.extension === 'object')
	);
}

export const ILanguageModelsService = createDecorator<ILanguageModelsService>('ILanguageModelsService');

export interface ILanguageModelChatMetadataAndIdentifier {
	metadata: ILanguageModelChatMetadata;
	identifier: string;
}

export interface ILanguageModelsService {

	readonly _serviceBrand: undefined;

	// TODO @lramos15 - Make this a richer event in the future. Right now it just indicates some change happened, but not what
	readonly onDidChangeLanguageModels: Event<string>;

	updateModelPickerPreference(modelIdentifier: string, showInModelPicker: boolean): void;

	getLanguageModelIds(): string[];

	getVendors(): IUserFriendlyLanguageModel[];

	lookupLanguageModel(modelId: string): ILanguageModelChatMetadata | undefined;

	/**
	 * Given a selector, returns a list of model identifiers
	 * @param selector The selector to lookup for language models. If the selector is empty, all language models are returned.
	 * @param allowPromptingUser If true the user may be prompted for things like API keys for us to select the model.
	 */
	selectLanguageModels(selector: ILanguageModelChatSelector, allowPromptingUser?: boolean): Promise<string[]>;

	registerLanguageModelProvider(vendor: string, provider: ILanguageModelChatProvider): IDisposable;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	sendChatRequest(modelId: string, from: ExtensionIdentifier, messages: IChatMessage[], options: { [name: string]: any }, token: CancellationToken): Promise<ILanguageModelChatResponse>;

	computeTokenLength(modelId: string, message: string | IChatMessage, token: CancellationToken): Promise<number>;
}

const languageModelChatProviderType = {
	type: 'object',
	required: ['vendor', 'displayName'],
	properties: {
		vendor: {
			type: 'string',
			description: localize('vscode.extension.contributes.languageModels.vendor', "A globally unique vendor of language model chat provider.")
		},
		displayName: {
			type: 'string',
			description: localize('vscode.extension.contributes.languageModels.displayName', "The display name of the language model chat provider.")
		},
		managementCommand: {
			type: 'string',
			description: localize('vscode.extension.contributes.languageModels.managementCommand', "A command to manage the language model chat provider, e.g. 'Manage Copilot models'. This is used in the chat model picker. If not provided, a gear icon is not rendered during vendor selection.")
		},
		when: {
			type: 'string',
			description: localize('vscode.extension.contributes.languageModels.when', "Condition which must be true to show this language model chat provider in the Manage Models list.")
		}
	}
} as const satisfies IJSONSchema;

export type IUserFriendlyLanguageModel = TypeFromJsonSchema<typeof languageModelChatProviderType>;

export const languageModelChatProviderExtensionPoint = ExtensionsRegistry.registerExtensionPoint<IUserFriendlyLanguageModel | IUserFriendlyLanguageModel[]>({
	extensionPoint: 'languageModelChatProviders',
	jsonSchema: {
		description: localize('vscode.extension.contributes.languageModelChatProviders', "Contribute language model chat providers of a specific vendor."),
		oneOf: [
			languageModelChatProviderType,
			{
				type: 'array',
				items: languageModelChatProviderType
			}
		]
	},
	activationEventsGenerator: function* (contribs: readonly IUserFriendlyLanguageModel[]) {
		for (const contrib of contribs) {
			yield `onLanguageModelChatProvider:${contrib.vendor}`;
		}
	}
});

export class LanguageModelsService implements ILanguageModelsService {

	readonly _serviceBrand: undefined;

	private readonly _store = new DisposableStore();

	private readonly _providers = new Map<string, ILanguageModelChatProvider>();
	private readonly _modelCache = new Map<string, ILanguageModelChatMetadata>();
	private readonly _vendors = new Map<string, IUserFriendlyLanguageModel>();
	private readonly _resolveLMSequencer = new SequencerByKey<string>();
	private _modelPickerUserPreferences: Record<string, boolean> = {};
	private readonly _hasUserSelectableModels: IContextKey<boolean>;
	private readonly _contextKeyService: IContextKeyService;
	private readonly _onLanguageModelChange = this._store.add(new Emitter<string>());
	readonly onDidChangeLanguageModels: Event<string> = this._onLanguageModelChange.event;

	constructor(
		@IExtensionService private readonly _extensionService: IExtensionService,
		@ILogService private readonly _logService: ILogService,
		@IStorageService private readonly _storageService: IStorageService,
		@IContextKeyService _contextKeyService: IContextKeyService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IChatEntitlementService private readonly _chatEntitlementService: IChatEntitlementService,
	) {
		this._hasUserSelectableModels = ChatContextKeys.languageModelsAreUserSelectable.bindTo(_contextKeyService);
		this._contextKeyService = _contextKeyService;
		this._modelPickerUserPreferences = this._storageService.getObject<Record<string, boolean>>('chatModelPickerPreferences', StorageScope.PROFILE, this._modelPickerUserPreferences);
		// TODO @lramos15 - Remove after a few releases, as this is just cleaning a bad storage state
		const entitlementChangeHandler = () => {
			if ((this._chatEntitlementService.entitlement === ChatEntitlement.Business || this._chatEntitlementService.entitlement === ChatEntitlement.Enterprise) && !this._chatEntitlementService.isInternal) {
				this._modelPickerUserPreferences = {};
				this._storageService.store('chatModelPickerPreferences', this._modelPickerUserPreferences, StorageScope.PROFILE, StorageTarget.USER);
			}
		};

		entitlementChangeHandler();
		this._store.add(this._chatEntitlementService.onDidChangeEntitlement(entitlementChangeHandler));

		this._store.add(this.onDidChangeLanguageModels(() => {
			this._hasUserSelectableModels.set(this._modelCache.size > 0 && Array.from(this._modelCache.values()).some(model => model.isUserSelectable));
		}));

		this._store.add(languageModelChatProviderExtensionPoint.setHandler((extensions) => {

			this._vendors.clear();

			for (const extension of extensions) {
				for (const item of Iterable.wrap(extension.value)) {
					if (this._vendors.has(item.vendor)) {
						extension.collector.error(localize('vscode.extension.contributes.languageModels.vendorAlreadyRegistered', "The vendor '{0}' is already registered and cannot be registered twice", item.vendor));
						continue;
					}
					if (isFalsyOrWhitespace(item.vendor)) {
						extension.collector.error(localize('vscode.extension.contributes.languageModels.emptyVendor', "The vendor field cannot be empty."));
						continue;
					}
					if (item.vendor.trim() !== item.vendor) {
						extension.collector.error(localize('vscode.extension.contributes.languageModels.whitespaceVendor', "The vendor field cannot start or end with whitespace."));
						continue;
					}
					this._vendors.set(item.vendor, item);
					// Have some models we want from this vendor, so activate the extension
					if (this._hasStoredModelForVendor(item.vendor)) {
						this._extensionService.activateByEvent(`onLanguageModelChatProvider:${item.vendor}`);
					}
				}
			}
			for (const [vendor, _] of this._providers) {
				if (!this._vendors.has(vendor)) {
					this._providers.delete(vendor);
				}
			}
		}));
	}

	private _hasStoredModelForVendor(vendor: string): boolean {
		return Object.keys(this._modelPickerUserPreferences).some(modelId => {
			return modelId.startsWith(vendor);
		});
	}

	dispose() {
		this._store.dispose();
		this._providers.clear();
	}

	updateModelPickerPreference(modelIdentifier: string, showInModelPicker: boolean): void {
		const model = this._modelCache.get(modelIdentifier);
		if (!model) {
			this._logService.warn(`[LM] Cannot update model picker preference for unknown model ${modelIdentifier}`);
			return;
		}

		this._modelPickerUserPreferences[modelIdentifier] = showInModelPicker;
		if (showInModelPicker === model.isUserSelectable) {
			delete this._modelPickerUserPreferences[modelIdentifier];
			this._storageService.store('chatModelPickerPreferences', this._modelPickerUserPreferences, StorageScope.PROFILE, StorageTarget.USER);
		} else if (model.isUserSelectable !== showInModelPicker) {
			this._storageService.store('chatModelPickerPreferences', this._modelPickerUserPreferences, StorageScope.PROFILE, StorageTarget.USER);
		}
		this._onLanguageModelChange.fire(model.vendor);
		this._logService.trace(`[LM] Updated model picker preference for ${modelIdentifier} to ${showInModelPicker}`);
	}

	getVendors(): IUserFriendlyLanguageModel[] {
		return Array.from(this._vendors.values()).filter(vendor => {
			if (!vendor.when) {
				return true; // No when clause means always visible
			}
			const whenClause = ContextKeyExpr.deserialize(vendor.when);
			return whenClause ? this._contextKeyService.contextMatchesRules(whenClause) : false;
		});
	}

	getLanguageModelIds(): string[] {
		return Array.from(this._modelCache.keys());
	}

	lookupLanguageModel(modelIdentifier: string): ILanguageModelChatMetadata | undefined {
		const model = this._modelCache.get(modelIdentifier);
		if (model && this._configurationService.getValue('chat.experimentalShowAllModels')) {
			return { ...model, isUserSelectable: true };
		}
		if (model && this._modelPickerUserPreferences[modelIdentifier] !== undefined) {
			return { ...model, isUserSelectable: this._modelPickerUserPreferences[modelIdentifier] };
		}
		return model;
	}

	private _clearModelCache(vendor: string): void {
		for (const [id, model] of this._modelCache.entries()) {
			if (model.vendor === vendor) {
				this._modelCache.delete(id);
			}
		}
	}

	private async _resolveLanguageModels(vendor: string, silent: boolean): Promise<void> {
		// Activate extensions before requesting to resolve the models
		await this._extensionService.activateByEvent(`onLanguageModelChatProvider:${vendor}`);
		const provider = this._providers.get(vendor);
		if (!provider) {
			this._logService.warn(`[LM] No provider registered for vendor ${vendor}`);
			return;
		}
		return this._resolveLMSequencer.queue(vendor, async () => {
			try {
				let modelsAndIdentifiers = await provider.provideLanguageModelChatInfo({ silent }, CancellationToken.None);
				// This is a bit of a hack, when prompting user if the provider returns any models that are user selectable then we only want to show those and not the entire model list
				if (!silent && modelsAndIdentifiers.some(m => m.metadata.isUserSelectable)) {
					modelsAndIdentifiers = modelsAndIdentifiers.filter(m => m.metadata.isUserSelectable || this._modelPickerUserPreferences[m.identifier] === true);
				}
				this._clearModelCache(vendor);
				for (const modelAndIdentifier of modelsAndIdentifiers) {
					if (this._modelCache.has(modelAndIdentifier.identifier)) {
						this._logService.warn(`[LM] Model ${modelAndIdentifier.identifier} is already registered. Skipping.`);
						continue;
					}
					this._modelCache.set(modelAndIdentifier.identifier, modelAndIdentifier.metadata);
				}
				this._logService.trace(`[LM] Resolved language models for vendor ${vendor}`, modelsAndIdentifiers);
			} catch (error) {
				this._logService.error(`[LM] Error resolving language models for vendor ${vendor}:`, error);
			}
			this._onLanguageModelChange.fire(vendor);
		});
	}

	async selectLanguageModels(selector: ILanguageModelChatSelector, allowPromptingUser?: boolean): Promise<string[]> {

		if (selector.vendor) {
			await this._resolveLanguageModels(selector.vendor, !allowPromptingUser);
		} else {
			const allVendors = Array.from(this._vendors.keys());
			await Promise.all(allVendors.map(vendor => this._resolveLanguageModels(vendor, !allowPromptingUser)));
		}

		const result: string[] = [];

		for (const [internalModelIdentifier, model] of this._modelCache) {
			if ((selector.vendor === undefined || model.vendor === selector.vendor)
				&& (selector.family === undefined || model.family === selector.family)
				&& (selector.version === undefined || model.version === selector.version)
				&& (selector.id === undefined || model.id === selector.id)) {
				result.push(internalModelIdentifier);
			}
		}

		this._logService.trace('[LM] selected language models', selector, result);

		return result;
	}

	registerLanguageModelProvider(vendor: string, provider: ILanguageModelChatProvider): IDisposable {
		this._logService.trace('[LM] registering language model provider', vendor, provider);

		if (!this._vendors.has(vendor)) {
			throw new Error(`Chat model provider uses UNKNOWN vendor ${vendor}.`);
		}
		if (this._providers.has(vendor)) {
			throw new Error(`Chat model provider for vendor ${vendor} is already registered.`);
		}

		this._providers.set(vendor, provider);

		if (this._hasStoredModelForVendor(vendor)) {
			this._resolveLanguageModels(vendor, true);
		}

		const modelChangeListener = provider.onDidChange(async () => {
			await this._resolveLanguageModels(vendor, true);
		});

		return toDisposable(() => {
			this._logService.trace('[LM] UNregistered language model provider', vendor);
			this._clearModelCache(vendor);
			this._providers.delete(vendor);
			modelChangeListener.dispose();
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async sendChatRequest(modelId: string, from: ExtensionIdentifier, messages: IChatMessage[], options: { [name: string]: any }, token: CancellationToken): Promise<ILanguageModelChatResponse> {
		const provider = this._providers.get(this._modelCache.get(modelId)?.vendor || '');
		if (!provider) {
			throw new Error(`Chat provider for model ${modelId} is not registered.`);
		}
		return provider.sendChatRequest(modelId, messages, from, options, token);
	}

	computeTokenLength(modelId: string, message: string | IChatMessage, token: CancellationToken): Promise<number> {
		const model = this._modelCache.get(modelId);
		if (!model) {
			throw new Error(`Chat model ${modelId} could not be found.`);
		}
		const provider = this._providers.get(model.vendor);
		if (!provider) {
			throw new Error(`Chat provider for model ${modelId} is not registered.`);
		}
		return provider.provideTokenCount(modelId, message, token);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/languageModelStats.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/languageModelStats.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { Extensions, IExtensionFeaturesManagementService, IExtensionFeaturesRegistry } from '../../../services/extensionManagement/common/extensionFeatures.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { localize } from '../../../../nls.js';
import { Codicon } from '../../../../base/common/codicons.js';

export const ILanguageModelStatsService = createDecorator<ILanguageModelStatsService>('ILanguageModelStatsService');

export interface ILanguageModelStatsService {
	readonly _serviceBrand: undefined;

	update(model: string, extensionId: ExtensionIdentifier, agent: string | undefined, tokenCount: number | undefined): Promise<void>;
}

export class LanguageModelStatsService extends Disposable implements ILanguageModelStatsService {

	declare _serviceBrand: undefined;

	constructor(
		@IExtensionFeaturesManagementService private readonly extensionFeaturesManagementService: IExtensionFeaturesManagementService,
		@IStorageService storageService: IStorageService,
	) {
		super();
		// TODO: @sandy081 - remove this code after a while
		for (const key in storageService.keys(StorageScope.APPLICATION, StorageTarget.USER)) {
			if (key.startsWith('languageModelStats.') || key.startsWith('languageModelAccess.')) {
				storageService.remove(key, StorageScope.APPLICATION);
			}
		}
	}

	async update(model: string, extensionId: ExtensionIdentifier, agent: string | undefined, tokenCount: number | undefined): Promise<void> {
		await this.extensionFeaturesManagementService.getAccess(extensionId, CopilotUsageExtensionFeatureId);
	}

}

export const CopilotUsageExtensionFeatureId = 'copilot';
Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: CopilotUsageExtensionFeatureId,
	label: localize('Language Models', "Copilot"),
	description: localize('languageModels', "Language models usage statistics of this extension."),
	icon: Codicon.copilot,
	access: {
		canToggle: false
	},
	accessDataLabel: localize('chat', "chat"),
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/languageModelToolsConfirmationService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/languageModelToolsConfirmationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputButton, IQuickTreeItem } from '../../../../platform/quickinput/common/quickInput.js';
import { ConfirmedReason } from './chatService.js';
import { IToolData, ToolDataSource } from './languageModelToolsService.js';

export interface ILanguageModelToolConfirmationActions {
	/** Label for the action */
	label: string;
	/** Action detail (e.g. tooltip) */
	detail?: string;
	/** Show a separator before this action */
	divider?: boolean;
	/** Selects this action. Resolves true if the action should be confirmed after selection */
	select(): Promise<boolean>;
}

export interface ILanguageModelToolConfirmationRef {
	toolId: string;
	source: ToolDataSource;
	parameters: unknown;
}

export interface ILanguageModelToolConfirmationActionProducer {
	getPreConfirmAction(ref: ILanguageModelToolConfirmationRef): ConfirmedReason | undefined;
	getPostConfirmAction(ref: ILanguageModelToolConfirmationRef): ConfirmedReason | undefined;

	/** Gets the selectable actions to take to memorize confirmation changes */
	getPreConfirmActions(ref: ILanguageModelToolConfirmationRef): ILanguageModelToolConfirmationActions[];
	getPostConfirmActions(ref: ILanguageModelToolConfirmationRef): ILanguageModelToolConfirmationActions[];
}

export interface ILanguageModelToolConfirmationContributionQuickTreeItem extends IQuickTreeItem {
	onDidTriggerItemButton?(button: IQuickInputButton): void;
	onDidChangeChecked?(checked: boolean): void;
	onDidOpen?(): void;
}

/**
 * Type that can be registered to provide more specific confirmation
 * actions for a specific tool.
 */
export type ILanguageModelToolConfirmationContribution = Partial<ILanguageModelToolConfirmationActionProducer> & {
	/**
	 * Gets items to be shown in the `manageConfirmationPreferences` quick tree.
	 * These are added under the tool's category.
	 */
	getManageActions?(): ILanguageModelToolConfirmationContributionQuickTreeItem[];

	/**
	 * Defaults to true. If false, the "Always Allow" options will not be shown
	 * and _only_ your custom manage actions will be shown.
	 */
	canUseDefaultApprovals?: boolean;

	/**
	 * Reset all confirmation settings for this tool.
	 */
	reset?(): void;
};

/**
 * Handles language model tool confirmation.
 *
 * - By default, all tools can have their confirmation preferences saved within
 *   a session, workspace, or globally.
 * - Tools with ToolDataSource from an extension or MCP can have that entire
 *   source's preference saved within a session, workspace, or globally.
 * - Contributable confirmations may also be registered for specific behaviors.
 *
 * Note: this interface MUST NOT depend in the ILanguageModelToolsService.
 * The ILanguageModelToolsService depends on this service instead in order to
 * call getPreConfirmAction/getPostConfirmAction.
 */
export interface ILanguageModelToolsConfirmationService extends ILanguageModelToolConfirmationActionProducer {
	readonly _serviceBrand: undefined;

	/** Opens an IQuickTree to let the user manage their preferences.  */
	manageConfirmationPreferences(tools: readonly IToolData[], options?: { defaultScope?: 'workspace' | 'profile' | 'session' }): void;

	/**
	 * Registers a contribution that provides more specific confirmation logic
	 * for a tool, in addition to the default confirmation handling.
	 */
	registerConfirmationContribution(toolName: string, contribution: ILanguageModelToolConfirmationContribution): IDisposable;

	/** Resets all tool and server confirmation preferences */
	resetToolAutoConfirmation(): void;
}

export const ILanguageModelToolsConfirmationService = createDecorator<ILanguageModelToolsConfirmationService>('ILanguageModelToolsConfirmationService');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/languageModelToolsService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/languageModelToolsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Separator } from '../../../../base/common/actions.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { derived, IObservable, IReader, ITransaction, ObservableSet } from '../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { Location } from '../../../../editor/common/languages.js';
import { localize } from '../../../../nls.js';
import { ContextKeyExpression } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { ByteSize } from '../../../../platform/files/common/files.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IProgress } from '../../../../platform/progress/common/progress.js';
import { UserSelectedTools } from './chatAgents.js';
import { IVariableReference } from './chatModes.js';
import { IChatExtensionsContent, IChatTodoListContent, IChatToolInputInvocationData, type IChatTerminalToolInvocationData } from './chatService.js';
import { ChatRequestToolReferenceEntry } from './chatVariableEntries.js';
import { LanguageModelPartAudience } from './languageModels.js';
import { PromptElementJSON, stringifyPromptElementJSON } from './tools/promptTsxTypes.js';

export interface IToolData {
	readonly id: string;
	readonly source: ToolDataSource;
	readonly toolReferenceName?: string;
	readonly legacyToolReferenceFullNames?: readonly string[];
	readonly icon?: { dark: URI; light?: URI } | ThemeIcon;
	readonly when?: ContextKeyExpression;
	readonly tags?: readonly string[];
	readonly displayName: string;
	readonly userDescription?: string;
	readonly modelDescription: string;
	readonly inputSchema?: IJSONSchema;
	readonly canBeReferencedInPrompt?: boolean;
	/**
	 * True if the tool runs in the (possibly remote) workspace, false if it runs
	 * on the host, undefined if known.
	 */
	readonly runsInWorkspace?: boolean;
	readonly alwaysDisplayInputOutput?: boolean;
	/** True if this tool might ask for pre-approval */
	readonly canRequestPreApproval?: boolean;
	/** True if this tool might ask for post-approval */
	readonly canRequestPostApproval?: boolean;
}

export interface IToolProgressStep {
	readonly message: string | IMarkdownString | undefined;
	/** 0-1 progress of the tool call */
	readonly progress?: number;
}

export type ToolProgress = IProgress<IToolProgressStep>;

export type ToolDataSource =
	| {
		type: 'extension';
		label: string;
		extensionId: ExtensionIdentifier;
	}
	| {
		type: 'mcp';
		label: string;
		serverLabel: string | undefined;
		instructions: string | undefined;
		collectionId: string;
		definitionId: string;
	}
	| {
		type: 'user';
		label: string;
		file: URI;
	}
	| {
		type: 'internal';
		label: string;
	} | {
		type: 'external';
		label: string;
	};

export namespace ToolDataSource {

	export const Internal: ToolDataSource = { type: 'internal', label: 'Built-In' };

	/** External tools may not be contributed or invoked, but may be invoked externally and described in an IChatToolInvocationSerialized */
	export const External: ToolDataSource = { type: 'external', label: 'External' };

	export function toKey(source: ToolDataSource): string {
		switch (source.type) {
			case 'extension': return `extension:${source.extensionId.value}`;
			case 'mcp': return `mcp:${source.collectionId}:${source.definitionId}`;
			case 'user': return `user:${source.file.toString()}`;
			case 'internal': return 'internal';
			case 'external': return 'external';
		}
	}

	export function equals(a: ToolDataSource, b: ToolDataSource): boolean {
		return toKey(a) === toKey(b);
	}

	export function classify(source: ToolDataSource): { readonly ordinal: number; readonly label: string } {
		if (source.type === 'internal') {
			return { ordinal: 1, label: localize('builtin', 'Built-In') };
		} else if (source.type === 'mcp') {
			return { ordinal: 2, label: source.label };
		} else if (source.type === 'user') {
			return { ordinal: 0, label: localize('user', 'User Defined') };
		} else {
			return { ordinal: 3, label: source.label };
		}
	}
}

export interface IToolInvocation {
	callId: string;
	toolId: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parameters: Record<string, any>;
	tokenBudget?: number;
	context: IToolInvocationContext | undefined;
	chatRequestId?: string;
	chatInteractionId?: string;
	/**
	 * Lets us add some nicer UI to toolcalls that came from a sub-agent, but in the long run, this should probably just be rendered in a similar way to thinking text + tool call groups
	 */
	fromSubAgent?: boolean;
	toolSpecificData?: IChatTerminalToolInvocationData | IChatToolInputInvocationData | IChatExtensionsContent | IChatTodoListContent;
	modelId?: string;
	userSelectedTools?: UserSelectedTools;
}

export interface IToolInvocationContext {
	/** @deprecated Use {@link sessionResource} instead */
	readonly sessionId: string;
	readonly sessionResource: URI;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isToolInvocationContext(obj: any): obj is IToolInvocationContext {
	return typeof obj === 'object' && typeof obj.sessionId === 'string' && URI.isUri(obj.sessionResource);
}

export interface IToolInvocationPreparationContext {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parameters: any;
	chatRequestId?: string;
	chatSessionId?: string;
	chatInteractionId?: string;
}

export type ToolInputOutputBase = {
	/** Mimetype of the value, optional */
	mimeType?: string;
	/** URI of the resource on the MCP server. */
	uri?: URI;
	/** If true, this part came in as a resource reference rather than direct data. */
	asResource?: boolean;
	/** Audience of the data part */
	audience?: LanguageModelPartAudience[];
};

export type ToolInputOutputEmbedded = ToolInputOutputBase & {
	type: 'embed';
	value: string;
	/** If true, value is text. If false or not given, value is base64 */
	isText?: boolean;
};

export type ToolInputOutputReference = ToolInputOutputBase & { type: 'ref'; uri: URI };

export interface IToolResultInputOutputDetails {
	readonly input: string;
	readonly output: (ToolInputOutputEmbedded | ToolInputOutputReference)[];
	readonly isError?: boolean;
}

export interface IToolResultOutputDetails {
	readonly output: { type: 'data'; mimeType: string; value: VSBuffer };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isToolResultInputOutputDetails(obj: any): obj is IToolResultInputOutputDetails {
	return typeof obj === 'object' && typeof obj?.input === 'string' && (typeof obj?.output === 'string' || Array.isArray(obj?.output));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isToolResultOutputDetails(obj: any): obj is IToolResultOutputDetails {
	return typeof obj === 'object' && typeof obj?.output === 'object' && typeof obj?.output?.mimeType === 'string' && obj?.output?.type === 'data';
}

export interface IToolResult {
	content: (IToolResultPromptTsxPart | IToolResultTextPart | IToolResultDataPart)[];
	toolResultMessage?: string | IMarkdownString;
	toolResultDetails?: Array<URI | Location> | IToolResultInputOutputDetails | IToolResultOutputDetails;
	toolResultError?: string;
	toolMetadata?: unknown;
	/** Whether to ask the user to confirm these tool results. Overrides {@link IToolConfirmationMessages.confirmResults}. */
	confirmResults?: boolean;
}

export function toolContentToA11yString(part: IToolResult['content']) {
	return part.map(p => {
		switch (p.kind) {
			case 'promptTsx':
				return stringifyPromptTsxPart(p);
			case 'text':
				return p.value;
			case 'data':
				return localize('toolResultDataPartA11y', "{0} of {1} binary data", ByteSize.formatSize(p.value.data.byteLength), p.value.mimeType || 'unknown');
		}
	}).join(', ');
}

export function toolResultHasBuffers(result: IToolResult): boolean {
	return result.content.some(part => part.kind === 'data');
}

export interface IToolResultPromptTsxPart {
	kind: 'promptTsx';
	value: unknown;
}

export function stringifyPromptTsxPart(part: IToolResultPromptTsxPart): string {
	return stringifyPromptElementJSON(part.value as PromptElementJSON);
}

export interface IToolResultTextPart {
	kind: 'text';
	value: string;
	audience?: LanguageModelPartAudience[];
	title?: string;
}

export interface IToolResultDataPart {
	kind: 'data';
	value: {
		mimeType: string;
		data: VSBuffer;
	};
	audience?: LanguageModelPartAudience[];
	title?: string;
}

export interface IToolConfirmationMessages {
	/** Title for the confirmation. If set, the user will be asked to confirm execution of the tool */
	title?: string | IMarkdownString;
	/** MUST be set if `title` is also set */
	message?: string | IMarkdownString;
	disclaimer?: string | IMarkdownString;
	allowAutoConfirm?: boolean;
	terminalCustomActions?: ToolConfirmationAction[];
	/** If true, confirmation will be requested after the tool executes and before results are sent to the model */
	confirmResults?: boolean;
}

export interface IToolConfirmationAction {
	label: string;
	disabled?: boolean;
	tooltip?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
}

export type ToolConfirmationAction = IToolConfirmationAction | Separator;

export enum ToolInvocationPresentation {
	Hidden = 'hidden',
	HiddenAfterComplete = 'hiddenAfterComplete'
}

export interface IPreparedToolInvocation {
	invocationMessage?: string | IMarkdownString;
	pastTenseMessage?: string | IMarkdownString;
	originMessage?: string | IMarkdownString;
	confirmationMessages?: IToolConfirmationMessages;
	presentation?: ToolInvocationPresentation;
	toolSpecificData?: IChatTerminalToolInvocationData | IChatToolInputInvocationData | IChatExtensionsContent | IChatTodoListContent;
}

export interface IToolImpl {
	invoke(invocation: IToolInvocation, countTokens: CountTokensCallback, progress: ToolProgress, token: CancellationToken): Promise<IToolResult>;
	prepareToolInvocation?(context: IToolInvocationPreparationContext, token: CancellationToken): Promise<IPreparedToolInvocation | undefined>;
}

export type IToolAndToolSetEnablementMap = ReadonlyMap<IToolData | ToolSet, boolean>;

export class ToolSet {

	protected readonly _tools = new ObservableSet<IToolData>();

	protected readonly _toolSets = new ObservableSet<ToolSet>();

	/**
	 * A homogenous tool set only contains tools from the same source as the tool set itself
	 */
	readonly isHomogenous: IObservable<boolean>;

	constructor(
		readonly id: string,
		readonly referenceName: string,
		readonly icon: ThemeIcon,
		readonly source: ToolDataSource,
		readonly description?: string,
		readonly legacyFullNames?: string[],
	) {

		this.isHomogenous = derived(r => {
			return !Iterable.some(this._tools.observable.read(r), tool => !ToolDataSource.equals(tool.source, this.source))
				&& !Iterable.some(this._toolSets.observable.read(r), toolSet => !ToolDataSource.equals(toolSet.source, this.source));
		});
	}

	addTool(data: IToolData, tx?: ITransaction): IDisposable {
		this._tools.add(data, tx);
		return toDisposable(() => {
			this._tools.delete(data);
		});
	}

	addToolSet(toolSet: ToolSet, tx?: ITransaction): IDisposable {
		if (toolSet === this) {
			return Disposable.None;
		}
		this._toolSets.add(toolSet, tx);
		return toDisposable(() => {
			this._toolSets.delete(toolSet);
		});
	}

	getTools(r?: IReader): Iterable<IToolData> {
		return Iterable.concat(
			this._tools.observable.read(r),
			...Iterable.map(this._toolSets.observable.read(r), toolSet => toolSet.getTools(r))
		);
	}
}


export const ILanguageModelToolsService = createDecorator<ILanguageModelToolsService>('ILanguageModelToolsService');

export type CountTokensCallback = (input: string, token: CancellationToken) => Promise<number>;

export interface ILanguageModelToolsService {
	_serviceBrand: undefined;
	readonly vscodeToolSet: ToolSet;
	readonly executeToolSet: ToolSet;
	readonly readToolSet: ToolSet;
	readonly onDidChangeTools: Event<void>;
	readonly onDidPrepareToolCallBecomeUnresponsive: Event<{ readonly sessionId: string; readonly toolData: IToolData }>;
	registerToolData(toolData: IToolData): IDisposable;
	registerToolImplementation(id: string, tool: IToolImpl): IDisposable;
	registerTool(toolData: IToolData, tool: IToolImpl): IDisposable;
	getTools(): Iterable<IToolData>;
	readonly toolsObservable: IObservable<readonly IToolData[]>;
	getTool(id: string): IToolData | undefined;
	getToolByName(name: string, includeDisabled?: boolean): IToolData | undefined;
	invokeTool(invocation: IToolInvocation, countTokens: CountTokensCallback, token: CancellationToken): Promise<IToolResult>;
	cancelToolCallsForRequest(requestId: string): void;
	/** Flush any pending tool updates to the extension hosts. */
	flushToolUpdates(): void;

	readonly toolSets: IObservable<Iterable<ToolSet>>;
	getToolSet(id: string): ToolSet | undefined;
	getToolSetByName(name: string): ToolSet | undefined;
	createToolSet(source: ToolDataSource, id: string, referenceName: string, options?: { icon?: ThemeIcon; description?: string; legacyFullNames?: string[] }): ToolSet & IDisposable;

	// tool names in prompt and agent files ('full reference names')
	getFullReferenceNames(): Iterable<string>;
	getFullReferenceName(tool: IToolData, toolSet?: ToolSet): string;
	getToolByFullReferenceName(fullReferenceName: string): IToolData | ToolSet | undefined;
	getDeprecatedFullReferenceNames(): Map<string, Set<string>>;

	toToolAndToolSetEnablementMap(fullReferenceNames: readonly string[], target: string | undefined): IToolAndToolSetEnablementMap;
	toFullReferenceNames(map: IToolAndToolSetEnablementMap): string[];
	toToolReferences(variableReferences: readonly IVariableReference[]): ChatRequestToolReferenceEntry[];
}

export function createToolInputUri(toolCallId: string): URI {
	return URI.from({ scheme: Schemas.inMemory, path: `/lm/tool/${toolCallId}/tool_input.json` });
}

export function createToolSchemaUri(toolOrId: IToolData | string): URI {
	if (typeof toolOrId !== 'string') {
		toolOrId = toolOrId.id;
	}
	return URI.from({ scheme: Schemas.vscode, authority: 'schemas', path: `/lm/tool/${toolOrId}` });
}

export namespace SpecedToolAliases {
	export const execute = 'execute';
	export const edit = 'edit';
	export const search = 'search';
	export const agent = 'agent';
	export const read = 'read';
	export const web = 'web';
	export const todo = 'todo';
}

export namespace VSCodeToolReference {
	export const runSubagent = 'runSubagent';
	export const vscode = 'vscode';

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/voiceChatService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/voiceChatService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { rtrim } from '../../../../base/common/strings.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IChatAgentService } from './chatAgents.js';
import { IChatModel } from './chatModel.js';
import { chatAgentLeader, chatSubcommandLeader } from './chatParserTypes.js';
import { ISpeechService, ISpeechToTextEvent, SpeechToTextStatus } from '../../speech/common/speechService.js';

export const IVoiceChatService = createDecorator<IVoiceChatService>('voiceChatService');

export interface IVoiceChatSessionOptions {
	readonly usesAgents?: boolean;
	readonly model?: IChatModel;
}

export interface IVoiceChatService {

	readonly _serviceBrand: undefined;

	/**
	 * Similar to `ISpeechService.createSpeechToTextSession`, but with
	 * support for agent prefixes and command prefixes. For example,
	 * if the user says "at workspace slash fix this problem", the result
	 * will be "@workspace /fix this problem".
	 */
	createVoiceChatSession(token: CancellationToken, options: IVoiceChatSessionOptions): Promise<IVoiceChatSession>;
}

export interface IVoiceChatTextEvent extends ISpeechToTextEvent {

	/**
	 * This property will be `true` when the text recognized
	 * so far only consists of agent prefixes (`@workspace`)
	 * and/or command prefixes (`@workspace /fix`).
	 */
	readonly waitingForInput?: boolean;
}

export interface IVoiceChatSession {
	readonly onDidChange: Event<IVoiceChatTextEvent>;
}

interface IPhraseValue {
	readonly agent: string;
	readonly command?: string;
}

enum PhraseTextType {
	AGENT = 1,
	COMMAND = 2,
	AGENT_AND_COMMAND = 3
}

export const VoiceChatInProgress = new RawContextKey<boolean>('voiceChatInProgress', false, { type: 'boolean', description: localize('voiceChatInProgress', "A speech-to-text session is in progress for chat.") });

export class VoiceChatService extends Disposable implements IVoiceChatService {

	readonly _serviceBrand: undefined;

	private static readonly AGENT_PREFIX = chatAgentLeader;
	private static readonly COMMAND_PREFIX = chatSubcommandLeader;

	private static readonly PHRASES_LOWER = {
		[this.AGENT_PREFIX]: 'at',
		[this.COMMAND_PREFIX]: 'slash'
	};

	private static readonly PHRASES_UPPER = {
		[this.AGENT_PREFIX]: 'At',
		[this.COMMAND_PREFIX]: 'Slash'
	};

	private static readonly CHAT_AGENT_ALIAS = new Map<string, string>([['vscode', 'code']]);

	private readonly voiceChatInProgress: IContextKey<boolean>;
	private activeVoiceChatSessions = 0;

	constructor(
		@ISpeechService private readonly speechService: ISpeechService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super();

		this.voiceChatInProgress = VoiceChatInProgress.bindTo(contextKeyService);
	}

	private createPhrases(model?: IChatModel): Map<string, IPhraseValue> {
		const phrases = new Map<string, IPhraseValue>();

		for (const agent of this.chatAgentService.getActivatedAgents()) {
			const agentPhrase = `${VoiceChatService.PHRASES_LOWER[VoiceChatService.AGENT_PREFIX]} ${VoiceChatService.CHAT_AGENT_ALIAS.get(agent.name) ?? agent.name}`.toLowerCase();
			phrases.set(agentPhrase, { agent: agent.name });

			for (const slashCommand of agent.slashCommands) {
				const slashCommandPhrase = `${VoiceChatService.PHRASES_LOWER[VoiceChatService.COMMAND_PREFIX]} ${slashCommand.name}`.toLowerCase();
				phrases.set(slashCommandPhrase, { agent: agent.name, command: slashCommand.name });

				const agentSlashCommandPhrase = `${agentPhrase} ${slashCommandPhrase}`.toLowerCase();
				phrases.set(agentSlashCommandPhrase, { agent: agent.name, command: slashCommand.name });
			}
		}

		return phrases;
	}

	private toText(value: IPhraseValue, type: PhraseTextType): string {
		switch (type) {
			case PhraseTextType.AGENT:
				return `${VoiceChatService.AGENT_PREFIX}${value.agent}`;
			case PhraseTextType.COMMAND:
				return `${VoiceChatService.COMMAND_PREFIX}${value.command}`;
			case PhraseTextType.AGENT_AND_COMMAND:
				return `${VoiceChatService.AGENT_PREFIX}${value.agent} ${VoiceChatService.COMMAND_PREFIX}${value.command}`;
		}
	}

	async createVoiceChatSession(token: CancellationToken, options: IVoiceChatSessionOptions): Promise<IVoiceChatSession> {
		const disposables = new DisposableStore();

		const onSessionStoppedOrCanceled = (dispose: boolean) => {
			this.activeVoiceChatSessions = Math.max(0, this.activeVoiceChatSessions - 1);
			if (this.activeVoiceChatSessions === 0) {
				this.voiceChatInProgress.reset();
			}

			if (dispose) {
				disposables.dispose();
			}
		};

		disposables.add(token.onCancellationRequested(() => onSessionStoppedOrCanceled(true)));

		let detectedAgent = false;
		let detectedSlashCommand = false;

		const emitter = disposables.add(new Emitter<IVoiceChatTextEvent>());
		const session = await this.speechService.createSpeechToTextSession(token, 'chat');

		if (token.isCancellationRequested) {
			onSessionStoppedOrCanceled(true);
		}

		const phrases = this.createPhrases(options.model);
		disposables.add(session.onDidChange(e => {
			switch (e.status) {
				case SpeechToTextStatus.Recognizing:
				case SpeechToTextStatus.Recognized: {
					let massagedEvent: IVoiceChatTextEvent = e;
					if (e.text) {
						const startsWithAgent = e.text.startsWith(VoiceChatService.PHRASES_UPPER[VoiceChatService.AGENT_PREFIX]) || e.text.startsWith(VoiceChatService.PHRASES_LOWER[VoiceChatService.AGENT_PREFIX]);
						const startsWithSlashCommand = e.text.startsWith(VoiceChatService.PHRASES_UPPER[VoiceChatService.COMMAND_PREFIX]) || e.text.startsWith(VoiceChatService.PHRASES_LOWER[VoiceChatService.COMMAND_PREFIX]);
						if (startsWithAgent || startsWithSlashCommand) {
							const originalWords = e.text.split(' ');
							let transformedWords: string[] | undefined;

							let waitingForInput = false;

							// Check for agent + slash command
							if (options.usesAgents && startsWithAgent && !detectedAgent && !detectedSlashCommand && originalWords.length >= 4) {
								const phrase = phrases.get(originalWords.slice(0, 4).map(word => this.normalizeWord(word)).join(' '));
								if (phrase) {
									transformedWords = [this.toText(phrase, PhraseTextType.AGENT_AND_COMMAND), ...originalWords.slice(4)];

									waitingForInput = originalWords.length === 4;

									if (e.status === SpeechToTextStatus.Recognized) {
										detectedAgent = true;
										detectedSlashCommand = true;
									}
								}
							}

							// Check for agent (if not done already)
							if (options.usesAgents && startsWithAgent && !detectedAgent && !transformedWords && originalWords.length >= 2) {
								const phrase = phrases.get(originalWords.slice(0, 2).map(word => this.normalizeWord(word)).join(' '));
								if (phrase) {
									transformedWords = [this.toText(phrase, PhraseTextType.AGENT), ...originalWords.slice(2)];

									waitingForInput = originalWords.length === 2;

									if (e.status === SpeechToTextStatus.Recognized) {
										detectedAgent = true;
									}
								}
							}

							// Check for slash command (if not done already)
							if (startsWithSlashCommand && !detectedSlashCommand && !transformedWords && originalWords.length >= 2) {
								const phrase = phrases.get(originalWords.slice(0, 2).map(word => this.normalizeWord(word)).join(' '));
								if (phrase) {
									transformedWords = [this.toText(phrase, options.usesAgents && !detectedAgent ?
										PhraseTextType.AGENT_AND_COMMAND : 	// rewrite `/fix` to `@workspace /foo` in this case
										PhraseTextType.COMMAND				// when we have not yet detected an agent before
									), ...originalWords.slice(2)];

									waitingForInput = originalWords.length === 2;

									if (e.status === SpeechToTextStatus.Recognized) {
										detectedSlashCommand = true;
									}
								}
							}

							massagedEvent = {
								status: e.status,
								text: (transformedWords ?? originalWords).join(' '),
								waitingForInput
							};
						}
					}
					emitter.fire(massagedEvent);
					break;
				}
				case SpeechToTextStatus.Started:
					this.activeVoiceChatSessions++;
					this.voiceChatInProgress.set(true);
					emitter.fire(e);
					break;
				case SpeechToTextStatus.Stopped:
					onSessionStoppedOrCanceled(false);
					emitter.fire(e);
					break;
				case SpeechToTextStatus.Error:
					emitter.fire(e);
					break;
			}
		}));

		return {
			onDidChange: emitter.event
		};
	}

	private normalizeWord(word: string): string {
		word = rtrim(word, '.');
		word = rtrim(word, ',');
		word = rtrim(word, '?');

		return word.toLowerCase();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/chatProgressTypes/chatToolInvocation.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/chatProgressTypes/chatToolInvocation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { encodeBase64 } from '../../../../../base/common/buffer.js';
import { IMarkdownString } from '../../../../../base/common/htmlContent.js';
import { IObservable, ISettableObservable, observableValue } from '../../../../../base/common/observable.js';
import { localize } from '../../../../../nls.js';
import { ConfirmedReason, IChatExtensionsContent, IChatTodoListContent, IChatToolInputInvocationData, IChatToolInvocation, IChatToolInvocationSerialized, ToolConfirmKind, type IChatTerminalToolInvocationData } from '../chatService.js';
import { IPreparedToolInvocation, isToolResultOutputDetails, IToolConfirmationMessages, IToolData, IToolProgressStep, IToolResult, ToolDataSource } from '../languageModelToolsService.js';

export class ChatToolInvocation implements IChatToolInvocation {
	public readonly kind: 'toolInvocation' = 'toolInvocation';

	public readonly invocationMessage: string | IMarkdownString;
	public readonly originMessage: string | IMarkdownString | undefined;
	public pastTenseMessage: string | IMarkdownString | undefined;
	public confirmationMessages: IToolConfirmationMessages | undefined;
	public readonly presentation: IPreparedToolInvocation['presentation'];
	public readonly toolId: string;
	public readonly source: ToolDataSource;
	public readonly fromSubAgent: boolean | undefined;
	public readonly parameters: unknown;
	public generatedTitle?: string;

	public readonly toolSpecificData?: IChatTerminalToolInvocationData | IChatToolInputInvocationData | IChatExtensionsContent | IChatTodoListContent;

	private readonly _progress = observableValue<{ message?: string | IMarkdownString; progress: number | undefined }>(this, { progress: 0 });
	private readonly _state: ISettableObservable<IChatToolInvocation.State>;

	public get state(): IObservable<IChatToolInvocation.State> {
		return this._state;
	}


	constructor(preparedInvocation: IPreparedToolInvocation | undefined, toolData: IToolData, public readonly toolCallId: string, fromSubAgent: boolean | undefined, parameters: unknown) {
		const defaultMessage = localize('toolInvocationMessage', "Using {0}", `"${toolData.displayName}"`);
		const invocationMessage = preparedInvocation?.invocationMessage ?? defaultMessage;
		this.invocationMessage = invocationMessage;
		this.pastTenseMessage = preparedInvocation?.pastTenseMessage;
		this.originMessage = preparedInvocation?.originMessage;
		this.confirmationMessages = preparedInvocation?.confirmationMessages;
		this.presentation = preparedInvocation?.presentation;
		this.toolSpecificData = preparedInvocation?.toolSpecificData;
		this.toolId = toolData.id;
		this.source = toolData.source;
		this.fromSubAgent = fromSubAgent;
		this.parameters = parameters;

		if (!this.confirmationMessages?.title) {
			this._state = observableValue(this, { type: IChatToolInvocation.StateKind.Executing, confirmed: { type: ToolConfirmKind.ConfirmationNotNeeded }, progress: this._progress });
		} else {
			this._state = observableValue(this, {
				type: IChatToolInvocation.StateKind.WaitingForConfirmation,
				confirm: reason => {
					if (reason.type === ToolConfirmKind.Denied || reason.type === ToolConfirmKind.Skipped) {
						this._state.set({ type: IChatToolInvocation.StateKind.Cancelled, reason: reason.type }, undefined);
					} else {
						this._state.set({ type: IChatToolInvocation.StateKind.Executing, confirmed: reason, progress: this._progress }, undefined);
					}
				}
			});
		}
	}

	private _setCompleted(result: IToolResult | undefined, postConfirmed?: ConfirmedReason | undefined) {
		if (postConfirmed && (postConfirmed.type === ToolConfirmKind.Denied || postConfirmed.type === ToolConfirmKind.Skipped)) {
			this._state.set({ type: IChatToolInvocation.StateKind.Cancelled, reason: postConfirmed.type }, undefined);
			return;
		}

		this._state.set({
			type: IChatToolInvocation.StateKind.Completed,
			confirmed: IChatToolInvocation.executionConfirmedOrDenied(this) || { type: ToolConfirmKind.ConfirmationNotNeeded },
			resultDetails: result?.toolResultDetails,
			postConfirmed,
			contentForModel: result?.content || [],
		}, undefined);
	}

	public didExecuteTool(result: IToolResult | undefined, final?: boolean): IChatToolInvocation.State {
		if (result?.toolResultMessage) {
			this.pastTenseMessage = result.toolResultMessage;
		} else if (this._progress.get().message) {
			this.pastTenseMessage = this._progress.get().message;
		}

		if (this.confirmationMessages?.confirmResults && !result?.toolResultError && result?.confirmResults !== false && !final) {
			this._state.set({
				type: IChatToolInvocation.StateKind.WaitingForPostApproval,
				confirmed: IChatToolInvocation.executionConfirmedOrDenied(this) || { type: ToolConfirmKind.ConfirmationNotNeeded },
				resultDetails: result?.toolResultDetails,
				contentForModel: result?.content || [],
				confirm: reason => this._setCompleted(result, reason),
			}, undefined);
		} else {
			this._setCompleted(result);
		}

		return this._state.get();
	}

	public acceptProgress(step: IToolProgressStep) {
		const prev = this._progress.get();
		this._progress.set({
			progress: step.progress || prev.progress || 0,
			message: step.message,
		}, undefined);
	}

	public toJSON(): IChatToolInvocationSerialized {
		// persist the serialized call as 'skipped' if we were waiting for postapproval
		const waitingForPostApproval = this.state.get().type === IChatToolInvocation.StateKind.WaitingForPostApproval;
		const details = waitingForPostApproval ? undefined : IChatToolInvocation.resultDetails(this);

		return {
			kind: 'toolInvocationSerialized',
			presentation: this.presentation,
			invocationMessage: this.invocationMessage,
			pastTenseMessage: this.pastTenseMessage,
			originMessage: this.originMessage,
			isConfirmed: waitingForPostApproval ? { type: ToolConfirmKind.Skipped } : IChatToolInvocation.executionConfirmedOrDenied(this),
			isComplete: true,
			source: this.source,
			resultDetails: isToolResultOutputDetails(details)
				? { output: { type: 'data', mimeType: details.output.mimeType, base64Data: encodeBase64(details.output.value) } }
				: details,
			toolSpecificData: this.toolSpecificData,
			toolCallId: this.toolCallId,
			toolId: this.toolId,
			fromSubAgent: this.fromSubAgent,
			generatedTitle: this.generatedTitle,
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/model/chatStreamStats.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/model/chatStreamStats.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogService } from '../../../../../platform/log/common/log.js';

export interface IChatStreamStats {
	impliedWordLoadRate: number;
	lastWordCount: number;
}

export interface IChatStreamStatsInternal extends IChatStreamStats {
	totalTime: number;
	lastUpdateTime: number;
	firstMarkdownTime: number | undefined;
	bootstrapActive: boolean;
	wordCountAtBootstrapExit: number | undefined;
	updatesWithNewWords: number;
}

export interface IChatStreamUpdate {
	totalWordCount: number;
}

const MIN_BOOTSTRAP_TOTAL_TIME = 250;
const LARGE_BOOTSTRAP_MIN_TOTAL_TIME = 500;
const MAX_INTERVAL_TIME = 250;
const LARGE_UPDATE_MAX_INTERVAL_TIME = 1000;
const WORDS_FOR_LARGE_CHUNK = 10;
const MIN_UPDATES_FOR_STABLE_RATE = 2;

/**
 * Estimates the loading rate of a chat response stream so that we can try to match the rendering rate to
 * the rate at which text is actually produced by the model. This can only be an estimate for various reasons-
 * reasoning summaries don't represent real generated tokens, we don't have full visibility into tool calls,
 * some model providers send text in large chunks rather than a steady stream, e.g. Gemini, we don't know about
 * latency between agent requests, etc.
 *
 * When the first text is received, we don't know how long it actually took to generate. So we apply an assumed
 * minimum time, until we have received enough data to make a stable estimate. This is the "bootstrap" phase.
 *
 * Since we don't have visibility into when the model started generated tool call args, or when the client was running
 * a tool, we ignore long pauses. The ignore period is longer for large chunks, since those naturally take longer
 * to generate anyway.
 *
 * After that, the word load rate is estimated using the words received since the end of the bootstrap phase.
 */
export class ChatStreamStatsTracker {
	private _data: IChatStreamStatsInternal;
	private _publicData: IChatStreamStats;

	constructor(
		@ILogService private readonly logService: ILogService
	) {
		const start = Date.now();
		this._data = {
			totalTime: 0,
			lastUpdateTime: start,
			impliedWordLoadRate: 0,
			lastWordCount: 0,
			firstMarkdownTime: undefined,
			bootstrapActive: true,
			wordCountAtBootstrapExit: undefined,
			updatesWithNewWords: 0
		};
		this._publicData = { impliedWordLoadRate: 0, lastWordCount: 0 };
	}

	get data(): IChatStreamStats {
		return this._publicData;
	}

	get internalData(): IChatStreamStatsInternal {
		return this._data;
	}

	update(totals: IChatStreamUpdate): IChatStreamStats | undefined {
		const { totalWordCount: wordCount } = totals;
		if (wordCount === this._data.lastWordCount) {
			this.trace('Update- no new words');
			return undefined;
		}

		const now = Date.now();
		const newWords = wordCount - this._data.lastWordCount;
		const hadNoWordsBeforeUpdate = this._data.lastWordCount === 0;
		let firstMarkdownTime = this._data.firstMarkdownTime;
		let wordCountAtBootstrapExit = this._data.wordCountAtBootstrapExit;
		if (typeof firstMarkdownTime !== 'number' && wordCount > 0) {
			firstMarkdownTime = now;
		}
		const updatesWithNewWords = this._data.updatesWithNewWords + 1;

		if (hadNoWordsBeforeUpdate) {
			this._data.lastUpdateTime = now;
		}

		const intervalCap = newWords > WORDS_FOR_LARGE_CHUNK ? LARGE_UPDATE_MAX_INTERVAL_TIME : MAX_INTERVAL_TIME;
		const timeDiff = Math.min(now - this._data.lastUpdateTime, intervalCap);
		let totalTime = this._data.totalTime + timeDiff;
		const minBootstrapTotalTime = hadNoWordsBeforeUpdate && wordCount > WORDS_FOR_LARGE_CHUNK ? LARGE_BOOTSTRAP_MIN_TOTAL_TIME : MIN_BOOTSTRAP_TOTAL_TIME;

		let bootstrapActive = this._data.bootstrapActive;
		if (bootstrapActive) {
			const stableStartTime = firstMarkdownTime;
			const hasStableData = typeof stableStartTime === 'number'
				&& updatesWithNewWords >= MIN_UPDATES_FOR_STABLE_RATE
				&& wordCount >= WORDS_FOR_LARGE_CHUNK;
			if (hasStableData) {
				bootstrapActive = false;
				totalTime = Math.max(now - stableStartTime, timeDiff);
				wordCountAtBootstrapExit = this._data.lastWordCount;
				this.trace('Has stable data');
			} else {
				totalTime = Math.max(totalTime, minBootstrapTotalTime);
			}
		}

		const wordsSinceBootstrap = typeof wordCountAtBootstrapExit === 'number' ? Math.max(wordCount - wordCountAtBootstrapExit, 0) : wordCount;
		const effectiveTime = totalTime;
		const effectiveWordCount = bootstrapActive ? wordCount : wordsSinceBootstrap;
		const impliedWordLoadRate = effectiveTime > 0 ? effectiveWordCount / (effectiveTime / 1000) : 0;
		this._data = {
			totalTime,
			lastUpdateTime: now,
			impliedWordLoadRate,
			lastWordCount: wordCount,
			firstMarkdownTime,
			bootstrapActive,
			wordCountAtBootstrapExit,
			updatesWithNewWords
		};
		this._publicData = {
			impliedWordLoadRate,
			lastWordCount: wordCount
		};

		const traceWords = bootstrapActive ? wordCount : wordsSinceBootstrap;
		this.trace(`Update- got ${traceWords} words over last ${totalTime}ms = ${impliedWordLoadRate} words/s`);
		return this._data;
	}

	private trace(message: string): void {
		this.logService.trace(`ChatStreamStatsTracker#update: ${message}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/modelPicker/modelPickerWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/modelPicker/modelPickerWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../nls.js';

export const DEFAULT_MODEL_PICKER_CATEGORY = { label: localize('chat.modelPicker.other', "Other Models"), order: Number.MAX_SAFE_INTEGER };
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/chatPromptFilesContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/chatPromptFilesContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../nls.js';
import { IWorkbenchContribution } from '../../../../common/contributions.js';
import * as extensionsRegistry from '../../../../services/extensions/common/extensionsRegistry.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { joinPath, isEqualOrParent } from '../../../../../base/common/resources.js';
import { IPromptsService } from './service/promptsService.js';
import { PromptsType } from './promptTypes.js';
import { DisposableMap } from '../../../../../base/common/lifecycle.js';

interface IRawChatFileContribution {
	readonly path: string;
	readonly name?: string;
	readonly description?: string;
}

type ChatContributionPoint = 'chatPromptFiles' | 'chatInstructions' | 'chatAgents';

function registerChatFilesExtensionPoint(point: ChatContributionPoint) {
	return extensionsRegistry.ExtensionsRegistry.registerExtensionPoint<IRawChatFileContribution[]>({
		extensionPoint: point,
		jsonSchema: {
			description: localize('chatContribution.schema.description', 'Contributes {0} for chat prompts.', point),
			type: 'array',
			items: {
				additionalProperties: false,
				type: 'object',
				defaultSnippets: [{
					body: {
						path: './relative/path/to/file.md',
					}
				}],
				required: ['path'],
				properties: {
					path: {
						description: localize('chatContribution.property.path', 'Path to the file relative to the extension root.'),
						type: 'string'
					},
					name: {
						description: localize('chatContribution.property.name', '(Optional) Name for this entry.'),
						deprecationMessage: localize('chatContribution.property.name.deprecated', 'Specify "name" in the prompt file itself instead.'),
						type: 'string'
					},
					description: {
						description: localize('chatContribution.property.description', '(Optional) Description of the entry.'),
						deprecationMessage: localize('chatContribution.property.description.deprecated', 'Specify "description" in the prompt file itself instead.'),
						type: 'string'
					}
				}
			}
		}
	});
}

const epPrompt = registerChatFilesExtensionPoint('chatPromptFiles');
const epInstructions = registerChatFilesExtensionPoint('chatInstructions');
const epAgents = registerChatFilesExtensionPoint('chatAgents');

function pointToType(contributionPoint: ChatContributionPoint): PromptsType {
	switch (contributionPoint) {
		case 'chatPromptFiles': return PromptsType.prompt;
		case 'chatInstructions': return PromptsType.instructions;
		case 'chatAgents': return PromptsType.agent;
	}
}

function key(extensionId: ExtensionIdentifier, type: PromptsType, path: string) {
	return `${extensionId.value}/${type}/${path}`;
}

export class ChatPromptFilesExtensionPointHandler implements IWorkbenchContribution {
	public static readonly ID = 'workbench.contrib.chatPromptFilesExtensionPointHandler';

	private readonly registrations = new DisposableMap<string>();

	constructor(
		@IPromptsService private readonly promptsService: IPromptsService,
	) {
		this.handle(epPrompt, 'chatPromptFiles');
		this.handle(epInstructions, 'chatInstructions');
		this.handle(epAgents, 'chatAgents');
	}

	private handle(extensionPoint: extensionsRegistry.IExtensionPoint<IRawChatFileContribution[]>, contributionPoint: ChatContributionPoint) {
		extensionPoint.setHandler((_extensions, delta) => {
			for (const ext of delta.added) {
				const type = pointToType(contributionPoint);
				for (const raw of ext.value) {
					if (!raw.path) {
						ext.collector.error(localize('extension.missing.path', "Extension '{0}' cannot register {1} entry without path.", ext.description.identifier.value, contributionPoint));
						continue;
					}
					const fileUri = joinPath(ext.description.extensionLocation, raw.path);
					if (!isEqualOrParent(fileUri, ext.description.extensionLocation)) {
						ext.collector.error(localize('extension.invalid.path', "Extension '{0}' {1} entry '{2}' resolves outside the extension.", ext.description.identifier.value, contributionPoint, raw.path));
						continue;
					}
					try {
						const d = this.promptsService.registerContributedFile(type, fileUri, ext.description, raw.name, raw.description);
						this.registrations.set(key(ext.description.identifier, type, raw.path), d);
					} catch (e) {
						const msg = e instanceof Error ? e.message : String(e);
						ext.collector.error(localize('extension.registration.failed', "Extension '{0}' {1}. Failed to register {2}: {3}", ext.description.identifier.value, contributionPoint, raw.path, msg));
					}
				}
			}
			for (const ext of delta.removed) {
				const type = pointToType(contributionPoint);
				for (const raw of ext.value) {
					this.registrations.deleteAndDispose(key(ext.description.identifier, type, raw.path));
				}
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/computeAutomaticInstructions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/computeAutomaticInstructions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { match, splitGlobAware } from '../../../../../base/common/glob.js';
import { ResourceMap, ResourceSet } from '../../../../../base/common/map.js';
import { Schemas } from '../../../../../base/common/network.js';
import { basename, dirname } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { ChatRequestVariableSet, IChatRequestVariableEntry, isPromptFileVariableEntry, toPromptFileVariableEntry, toPromptTextVariableEntry, PromptFileVariableKind, IPromptTextVariableEntry, ChatRequestToolReferenceEntry, toToolVariableEntry } from '../chatVariableEntries.js';
import { ILanguageModelToolsService, IToolAndToolSetEnablementMap, IToolData, VSCodeToolReference } from '../languageModelToolsService.js';
import { PromptsConfig } from './config/config.js';
import { isPromptOrInstructionsFile } from './config/promptFileLocations.js';
import { PromptsType } from './promptTypes.js';
import { ParsedPromptFile } from './promptFileParser.js';
import { IPromptPath, IPromptsService } from './service/promptsService.js';
import { OffsetRange } from '../../../../../editor/common/core/ranges/offsetRange.js';
import { ChatConfiguration } from '../constants.js';

export type InstructionsCollectionEvent = {
	applyingInstructionsCount: number;
	referencedInstructionsCount: number;
	agentInstructionsCount: number;
	listedInstructionsCount: number;
	totalInstructionsCount: number;
};
export function newInstructionsCollectionEvent(): InstructionsCollectionEvent {
	return { applyingInstructionsCount: 0, referencedInstructionsCount: 0, agentInstructionsCount: 0, listedInstructionsCount: 0, totalInstructionsCount: 0 };
}

type InstructionsCollectionClassification = {
	applyingInstructionsCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Number of instructions added via pattern matching.' };
	referencedInstructionsCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Number of instructions added via references from other instruction files.' };
	agentInstructionsCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Number of agent instructions added (copilot-instructions.md and agents.md).' };
	listedInstructionsCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Number of instruction patterns added.' };
	totalInstructionsCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Total number of instruction entries added to variables.' };
	owner: 'digitarald';
	comment: 'Tracks automatic instruction collection usage in chat prompt system.';
};

export class ComputeAutomaticInstructions {

	private _parseResults: ResourceMap<ParsedPromptFile> = new ResourceMap();

	constructor(
		private readonly _enabledTools: IToolAndToolSetEnablementMap | undefined,
		@IPromptsService private readonly _promptsService: IPromptsService,
		@ILogService public readonly _logService: ILogService,
		@ILabelService private readonly _labelService: ILabelService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly _workspaceService: IWorkspaceContextService,
		@IFileService private readonly _fileService: IFileService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ILanguageModelToolsService private readonly _languageModelToolsService: ILanguageModelToolsService,
	) {
	}

	private async _parseInstructionsFile(uri: URI, token: CancellationToken): Promise<ParsedPromptFile | undefined> {
		if (this._parseResults.has(uri)) {
			return this._parseResults.get(uri)!;
		}
		try {
			const result = await this._promptsService.parseNew(uri, token);
			this._parseResults.set(uri, result);
			return result;
		} catch (error) {
			this._logService.error(`[InstructionsContextComputer] Failed to parse instruction file: ${uri}`, error);
			return undefined;
		}

	}

	public async collect(variables: ChatRequestVariableSet, token: CancellationToken): Promise<void> {

		const instructionFiles = await this._promptsService.listPromptFiles(PromptsType.instructions, token);

		this._logService.trace(`[InstructionsContextComputer] ${instructionFiles.length} instruction files available.`);

		const telemetryEvent: InstructionsCollectionEvent = newInstructionsCollectionEvent();
		const context = this._getContext(variables);

		// find instructions where the `applyTo` matches the attached context
		await this.addApplyingInstructions(instructionFiles, context, variables, telemetryEvent, token);

		// add all instructions referenced by all instruction files that are in the context
		await this._addReferencedInstructions(variables, telemetryEvent, token);

		// get copilot instructions
		await this._addAgentInstructions(variables, telemetryEvent, token);

		const instructionsListVariable = await this._getInstructionsWithPatternsList(instructionFiles, variables, token);
		if (instructionsListVariable) {
			variables.add(instructionsListVariable);
			telemetryEvent.listedInstructionsCount++;
		}

		this.sendTelemetry(telemetryEvent);
	}

	private sendTelemetry(telemetryEvent: InstructionsCollectionEvent): void {
		// Emit telemetry
		telemetryEvent.totalInstructionsCount = telemetryEvent.agentInstructionsCount + telemetryEvent.referencedInstructionsCount + telemetryEvent.applyingInstructionsCount + telemetryEvent.listedInstructionsCount;
		this._telemetryService.publicLog2<InstructionsCollectionEvent, InstructionsCollectionClassification>('instructionsCollected', telemetryEvent);
	}

	/** public for testing */
	public async addApplyingInstructions(instructionFiles: readonly IPromptPath[], context: { files: ResourceSet; instructions: ResourceSet }, variables: ChatRequestVariableSet, telemetryEvent: InstructionsCollectionEvent, token: CancellationToken): Promise<void> {

		for (const { uri } of instructionFiles) {
			const parsedFile = await this._parseInstructionsFile(uri, token);
			if (!parsedFile) {
				this._logService.trace(`[InstructionsContextComputer] Unable to read: ${uri}`);
				continue;
			}

			const applyTo = parsedFile.header?.applyTo;

			if (!applyTo) {
				this._logService.trace(`[InstructionsContextComputer] No 'applyTo' found: ${uri}`);
				continue;
			}

			if (context.instructions.has(uri)) {
				// the instruction file is already part of the input or has already been processed
				this._logService.trace(`[InstructionsContextComputer] Skipping already processed instruction file: ${uri}`);
				continue;
			}

			const match = this._matches(context.files, applyTo);
			if (match) {
				this._logService.trace(`[InstructionsContextComputer] Match for ${uri} with ${match.pattern}${match.file ? ` for file ${match.file}` : ''}`);

				const reason = !match.file ?
					localize('instruction.file.reason.allFiles', 'Automatically attached as pattern is **') :
					localize('instruction.file.reason.specificFile', 'Automatically attached as pattern {0} matches {1}', applyTo, this._labelService.getUriLabel(match.file, { relative: true }));

				variables.add(toPromptFileVariableEntry(uri, PromptFileVariableKind.Instruction, reason, true));
				telemetryEvent.applyingInstructionsCount++;
			} else {
				this._logService.trace(`[InstructionsContextComputer] No match for ${uri} with ${applyTo}`);
			}
		}
	}

	private _getContext(attachedContext: ChatRequestVariableSet): { files: ResourceSet; instructions: ResourceSet } {
		const files = new ResourceSet();
		const instructions = new ResourceSet();
		for (const variable of attachedContext.asArray()) {
			if (isPromptFileVariableEntry(variable)) {
				instructions.add(variable.value);
			} else {
				const uri = IChatRequestVariableEntry.toUri(variable);
				if (uri) {
					files.add(uri);
				}
			}
		}

		return { files, instructions };
	}

	private async _addAgentInstructions(variables: ChatRequestVariableSet, telemetryEvent: InstructionsCollectionEvent, token: CancellationToken): Promise<void> {
		const useCopilotInstructionsFiles = this._configurationService.getValue(PromptsConfig.USE_COPILOT_INSTRUCTION_FILES);
		const useAgentMd = this._configurationService.getValue(PromptsConfig.USE_AGENT_MD);
		if (!useCopilotInstructionsFiles && !useAgentMd) {
			this._logService.trace(`[InstructionsContextComputer] No agent instructions files added (settings disabled).`);
			return;
		}

		const entries: ChatRequestVariableSet = new ChatRequestVariableSet();
		if (useCopilotInstructionsFiles) {
			const files: URI[] = await this._promptsService.listCopilotInstructionsMDs(token);
			for (const file of files) {
				entries.add(toPromptFileVariableEntry(file, PromptFileVariableKind.Instruction, localize('instruction.file.reason.copilot', 'Automatically attached as setting {0} is enabled', PromptsConfig.USE_COPILOT_INSTRUCTION_FILES), true));
				telemetryEvent.agentInstructionsCount++;
				this._logService.trace(`[InstructionsContextComputer] copilot-instruction.md files added: ${file.toString()}`);
			}
			await this._addReferencedInstructions(entries, telemetryEvent, token);
		}
		if (useAgentMd) {
			const files = await this._promptsService.listAgentMDs(token, false);
			for (const file of files) {
				entries.add(toPromptFileVariableEntry(file, PromptFileVariableKind.Instruction, localize('instruction.file.reason.agentsmd', 'Automatically attached as setting {0} is enabled', PromptsConfig.USE_AGENT_MD), true));
				telemetryEvent.agentInstructionsCount++;
				this._logService.trace(`[InstructionsContextComputer] AGENTS.md files added: ${file.toString()}`);
			}
		}
		for (const entry of entries.asArray()) {
			variables.add(entry);
		}
	}

	private _matches(files: ResourceSet, applyToPattern: string): { pattern: string; file?: URI } | undefined {
		const patterns = splitGlobAware(applyToPattern, ',');
		const patterMatches = (pattern: string): { pattern: string; file?: URI } | undefined => {
			pattern = pattern.trim();
			if (pattern.length === 0) {
				// if glob pattern is empty, skip it
				return undefined;
			}
			if (pattern === '**' || pattern === '**/*' || pattern === '*') {
				// if glob pattern is one of the special wildcard values,
				// add the instructions file event if no files are attached
				return { pattern };
			}
			if (!pattern.startsWith('/') && !pattern.startsWith('**/')) {
				// support relative glob patterns, e.g. `src/**/*.js`
				pattern = '**/' + pattern;
			}

			// match each attached file with each glob pattern and
			// add the instructions file if its rule matches the file
			for (const file of files) {
				// if the file is not a valid URI, skip it
				if (match(pattern, file.path, { ignoreCase: true })) {
					return { pattern, file }; // return the matched pattern and file URI
				}
			}
			return undefined;
		};
		for (const pattern of patterns) {
			const matchResult = patterMatches(pattern);
			if (matchResult) {
				return matchResult; // return the first matched pattern and file URI
			}
		}
		return undefined;
	}

	private _getTool(referenceName: string): { tool: IToolData; variable: string } | undefined {
		if (!this._enabledTools) {
			return undefined;
		}
		const tool = this._languageModelToolsService.getToolByName(referenceName);
		if (tool && this._enabledTools.get(tool)) {
			return { tool, variable: `#tool:${this._languageModelToolsService.getFullReferenceName(tool)}` };
		}
		return undefined;
	}

	private async _getInstructionsWithPatternsList(instructionFiles: readonly IPromptPath[], _existingVariables: ChatRequestVariableSet, token: CancellationToken): Promise<IPromptTextVariableEntry | undefined> {
		const readTool = this._getTool('readFile');
		const runSubagentTool = this._getTool(VSCodeToolReference.runSubagent);

		const entries: string[] = [];
		if (readTool) {

			const searchNestedAgentMd = this._configurationService.getValue(PromptsConfig.USE_NESTED_AGENT_MD);
			const agentsMdPromise = searchNestedAgentMd ? this._promptsService.findAgentMDsInWorkspace(token) : Promise.resolve([]);

			entries.push('<instructions>');
			entries.push('Here is a list of instruction files that contain rules for modifying or creating new code.');
			entries.push('These files are important for ensuring that the code is modified or created correctly.');
			entries.push('Please make sure to follow the rules specified in these files when working with the codebase.');
			entries.push(`If the file is not already available as attachment, use the ${readTool.variable} tool to acquire it.`);
			entries.push('Make sure to acquire the instructions before making any changes to the code.');
			let hasContent = false;
			for (const { uri } of instructionFiles) {
				const parsedFile = await this._parseInstructionsFile(uri, token);
				if (parsedFile) {
					entries.push('<instruction>');
					if (parsedFile.header) {
						const { description, applyTo } = parsedFile.header;
						if (description) {
							entries.push(`<description>${description}</description>`);
						}
						entries.push(`<file>${getFilePath(uri)}</file>`);
						if (applyTo) {
							entries.push(`<applyTo>${applyTo}</applyTo>`);
						}
					} else {
						entries.push(`<file>${getFilePath(uri)}</file>`);
					}
					entries.push('</instruction>');
					hasContent = true;
				}
			}

			const agentsMdFiles = await agentsMdPromise;
			for (const uri of agentsMdFiles) {
				if (uri) {
					const folderName = this._labelService.getUriLabel(dirname(uri), { relative: true });
					const description = folderName.trim().length === 0 ? localize('instruction.file.description.agentsmd.root', 'Instructions for the workspace') : localize('instruction.file.description.agentsmd.folder', 'Instructions for folder \'{0}\'', folderName);
					entries.push('<instruction>');
					entries.push(`<description>${description}</description>`);
					entries.push(`<file>${getFilePath(uri)}</file>`);
					entries.push('</instruction>');
					hasContent = true;
				}
			}

			if (!hasContent) {
				entries.length = 0; // clear entries
			} else {
				entries.push('</instructions>', '', ''); // add trailing newline
			}

			const agentSkills = await this._promptsService.findAgentSkills(token);
			if (agentSkills && agentSkills.length > 0) {
				entries.push('<skills>');
				entries.push('Here is a list of skills that contain domain specific knowledge on a variety of topics.');
				entries.push('Each skill comes with a description of the topic and a file path that contains the detailed instructions.');
				entries.push(`When a user asks you to perform a task that falls within the domain of a skill, use the ${readTool.variable} tool to acquire the full instructions from the file URI.`);
				for (const skill of agentSkills) {
					entries.push('<skill>');
					entries.push(`<name>${skill.name}</name>`);
					if (skill.description) {
						entries.push(`<description>${skill.description}</description>`);
					}
					entries.push(`<file>${getFilePath(skill.uri)}</file>`);
					entries.push('</skill>');
				}
				entries.push('</skills>', '', ''); // add trailing newline
			}
		}
		if (runSubagentTool) {
			const subagentToolCustomAgents = this._configurationService.getValue(ChatConfiguration.SubagentToolCustomAgents);
			if (subagentToolCustomAgents) {
				const agents = await this._promptsService.getCustomAgents(token);
				if (agents.length > 0) {
					entries.push('<agents>');
					entries.push('Here is a list of agents that can be used when running a subagent.');
					entries.push('Each agent has optionally a description with the agent\'s purpose and expertise. When asked to run a subagent, choose the most appropriate agent from this list.');
					entries.push(`Use the ${runSubagentTool.variable} tool with the agent name to run the subagent.`);
					for (const agent of agents) {
						if (agent.infer === false) {
							// skip agents that are not meant for subagent use
							continue;
						}
						entries.push('<agent>');
						entries.push(`<name>${agent.name}</name>`);
						if (agent.description) {
							entries.push(`<description>${agent.description}</description>`);
						}
						if (agent.argumentHint) {
							entries.push(`<argumentHint>${agent.argumentHint}</argumentHint>`);
						}
						entries.push('</agent>');
					}
					entries.push('</agents>', '', ''); // add trailing newline
				}
			}
		}
		if (entries.length === 0) {
			return undefined;
		}

		const content = entries.join('\n');
		const toolReferences: ChatRequestToolReferenceEntry[] = [];
		const collectToolReference = (tool: { tool: IToolData; variable: string } | undefined) => {
			if (tool) {
				let offset = content.indexOf(tool.variable);
				while (offset >= 0) {
					toolReferences.push(toToolVariableEntry(tool.tool, new OffsetRange(offset, offset + tool.variable.length)));
					offset = content.indexOf(tool.variable, offset + 1);
				}
			}
		};
		collectToolReference(readTool);
		collectToolReference(runSubagentTool);
		return toPromptTextVariableEntry(content, true, toolReferences);
	}

	private async _addReferencedInstructions(attachedContext: ChatRequestVariableSet, telemetryEvent: InstructionsCollectionEvent, token: CancellationToken): Promise<void> {
		const seen = new ResourceSet();
		const todo: URI[] = [];
		for (const variable of attachedContext.asArray()) {
			if (isPromptFileVariableEntry(variable)) {
				if (!seen.has(variable.value)) {
					todo.push(variable.value);
					seen.add(variable.value);
				}
			}
		}
		let next = todo.pop();
		while (next) {
			const result = await this._parseInstructionsFile(next, token);
			if (result && result.body) {
				const refsToCheck: { resource: URI }[] = [];
				for (const ref of result.body.fileReferences) {
					const url = result.body.resolveFilePath(ref.content);
					if (url && !seen.has(url) && (isPromptOrInstructionsFile(url) || this._workspaceService.getWorkspaceFolder(url) !== undefined)) {
						// only add references that are either prompt or instruction files or are part of the workspace
						refsToCheck.push({ resource: url });
						seen.add(url);
					}
				}
				if (refsToCheck.length > 0) {
					const stats = await this._fileService.resolveAll(refsToCheck);
					for (let i = 0; i < stats.length; i++) {
						const stat = stats[i];
						const uri = refsToCheck[i].resource;
						if (stat.success && stat.stat?.isFile) {
							if (isPromptOrInstructionsFile(uri)) {
								// only recursively parse instruction files
								todo.push(uri);
							}
							const reason = localize('instruction.file.reason.referenced', 'Referenced by {0}', basename(next));
							attachedContext.add(toPromptFileVariableEntry(uri, PromptFileVariableKind.InstructionReference, reason, true));
							telemetryEvent.referencedInstructionsCount++;
							this._logService.trace(`[InstructionsContextComputer] ${uri.toString()} added, referenced by ${next.toString()}`);
						}
					}
				}
			}
			next = todo.pop();
		}
	}
}


function getFilePath(uri: URI): string {
	if (uri.scheme === Schemas.file || uri.scheme === Schemas.vscodeRemote) {
		return uri.fsPath;
	}
	return uri.toString();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/promptFileContributions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/promptFileContributions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution } from '../../../../common/contributions.js';
import { PromptLinkProvider } from './languageProviders/promptLinkProvider.js';
import { PromptBodyAutocompletion } from './languageProviders/promptBodyAutocompletion.js';
import { PromptHeaderAutocompletion } from './languageProviders/promptHeaderAutocompletion.js';
import { PromptHoverProvider } from './languageProviders/promptHovers.js';
import { PromptHeaderDefinitionProvider } from './languageProviders/PromptHeaderDefinitionProvider.js';
import { PromptValidatorContribution } from './languageProviders/promptValidator.js';
import { PromptDocumentSemanticTokensProvider } from './languageProviders/promptDocumentSemanticTokensProvider.js';
import { PromptCodeActionProvider } from './languageProviders/promptCodeActions.js';
import { ILanguageFeaturesService } from '../../../../../editor/common/services/languageFeatures.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ALL_PROMPTS_LANGUAGE_SELECTOR } from './promptTypes.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';

export class PromptLanguageFeaturesProvider extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'chat.promptLanguageFeatures';

	constructor(
		@ILanguageFeaturesService languageService: ILanguageFeaturesService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();

		this._register(languageService.linkProvider.register(ALL_PROMPTS_LANGUAGE_SELECTOR, instantiationService.createInstance(PromptLinkProvider)));
		this._register(languageService.completionProvider.register(ALL_PROMPTS_LANGUAGE_SELECTOR, instantiationService.createInstance(PromptBodyAutocompletion)));
		this._register(languageService.completionProvider.register(ALL_PROMPTS_LANGUAGE_SELECTOR, instantiationService.createInstance(PromptHeaderAutocompletion)));
		this._register(languageService.hoverProvider.register(ALL_PROMPTS_LANGUAGE_SELECTOR, instantiationService.createInstance(PromptHoverProvider)));
		this._register(languageService.definitionProvider.register(ALL_PROMPTS_LANGUAGE_SELECTOR, instantiationService.createInstance(PromptHeaderDefinitionProvider)));
		this._register(languageService.documentSemanticTokensProvider.register(ALL_PROMPTS_LANGUAGE_SELECTOR, instantiationService.createInstance(PromptDocumentSemanticTokensProvider)));
		this._register(languageService.codeActionProvider.register(ALL_PROMPTS_LANGUAGE_SELECTOR, instantiationService.createInstance(PromptCodeActionProvider)));

		this._register(instantiationService.createInstance(PromptValidatorContribution));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/promptFileParser.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/promptFileParser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Iterable } from '../../../../../base/common/iterator.js';
import { dirname, joinPath } from '../../../../../base/common/resources.js';
import { splitLinesIncludeSeparators } from '../../../../../base/common/strings.js';
import { URI } from '../../../../../base/common/uri.js';
import { parse, YamlNode, YamlParseError, Position as YamlPosition } from '../../../../../base/common/yaml.js';
import { Range } from '../../../../../editor/common/core/range.js';

export class PromptFileParser {
	constructor() {
	}

	public parse(uri: URI, content: string): ParsedPromptFile {
		const linesWithEOL = splitLinesIncludeSeparators(content);
		if (linesWithEOL.length === 0) {
			return new ParsedPromptFile(uri, undefined, undefined);
		}
		let header: PromptHeader | undefined = undefined;
		let body: PromptBody | undefined = undefined;
		let bodyStartLine = 0;
		if (linesWithEOL[0].match(/^---[\s\r\n]*$/)) {
			let headerEndLine = linesWithEOL.findIndex((line, index) => index > 0 && line.match(/^---[\s\r\n]*$/));
			if (headerEndLine === -1) {
				headerEndLine = linesWithEOL.length;
				bodyStartLine = linesWithEOL.length;
			} else {
				bodyStartLine = headerEndLine + 1;
			}
			// range starts on the line after the ---, and ends at the beginning of the line that has the closing ---
			const range = new Range(2, 1, headerEndLine + 1, 1);
			header = new PromptHeader(range, linesWithEOL);
		}
		if (bodyStartLine < linesWithEOL.length) {
			// range starts  on the line after the ---, and ends at the beginning of line after the last line
			const range = new Range(bodyStartLine + 1, 1, linesWithEOL.length + 1, 1);
			body = new PromptBody(range, linesWithEOL, uri);
		}
		return new ParsedPromptFile(uri, header, body);
	}
}


export class ParsedPromptFile {
	constructor(public readonly uri: URI, public readonly header?: PromptHeader, public readonly body?: PromptBody) {
	}
}

export interface ParseError {
	readonly message: string;
	readonly range: Range;
	readonly code: string;
}

interface ParsedHeader {
	readonly node: YamlNode | undefined;
	readonly errors: ParseError[];
	readonly attributes: IHeaderAttribute[];
}

export namespace PromptHeaderAttributes {
	export const name = 'name';
	export const description = 'description';
	export const agent = 'agent';
	export const mode = 'mode';
	export const model = 'model';
	export const applyTo = 'applyTo';
	export const tools = 'tools';
	export const handOffs = 'handoffs';
	export const advancedOptions = 'advancedOptions';
	export const argumentHint = 'argument-hint';
	export const excludeAgent = 'excludeAgent';
	export const target = 'target';
	export const infer = 'infer';
}

export namespace GithubPromptHeaderAttributes {
	export const mcpServers = 'mcp-servers';
}

export enum Target {
	VSCode = 'vscode',
	GitHubCopilot = 'github-copilot'
}

export class PromptHeader {
	private _parsed: ParsedHeader | undefined;

	constructor(public readonly range: Range, private readonly linesWithEOL: string[]) {
	}

	private get _parsedHeader(): ParsedHeader {
		if (this._parsed === undefined) {
			const yamlErrors: YamlParseError[] = [];
			const lines = this.linesWithEOL.slice(this.range.startLineNumber - 1, this.range.endLineNumber - 1).join('');
			const node = parse(lines, yamlErrors);
			const attributes = [];
			const errors: ParseError[] = yamlErrors.map(err => ({ message: err.message, range: this.asRange(err), code: err.code }));
			if (node) {
				if (node.type !== 'object') {
					errors.push({ message: 'Invalid header, expecting <key: value> pairs', range: this.range, code: 'INVALID_YAML' });
				} else {
					for (const property of node.properties) {
						attributes.push({
							key: property.key.value,
							range: this.asRange({ start: property.key.start, end: property.value.end }),
							value: this.asValue(property.value)
						});
					}
				}
			}
			this._parsed = { node, attributes, errors };
		}
		return this._parsed;
	}

	private asRange({ start, end }: { start: YamlPosition; end: YamlPosition }): Range {
		return new Range(this.range.startLineNumber + start.line, start.character + 1, this.range.startLineNumber + end.line, end.character + 1);
	}

	private asValue(node: YamlNode): IValue {
		switch (node.type) {
			case 'string':
				return { type: 'string', value: node.value, range: this.asRange(node) };
			case 'number':
				return { type: 'number', value: node.value, range: this.asRange(node) };
			case 'boolean':
				return { type: 'boolean', value: node.value, range: this.asRange(node) };
			case 'null':
				return { type: 'null', value: node.value, range: this.asRange(node) };
			case 'array':
				return { type: 'array', items: node.items.map(item => this.asValue(item)), range: this.asRange(node) };
			case 'object': {
				const properties = node.properties.map(property => ({ key: this.asValue(property.key) as IStringValue, value: this.asValue(property.value) }));
				return { type: 'object', properties, range: this.asRange(node) };
			}
		}
	}

	public get attributes(): IHeaderAttribute[] {
		return this._parsedHeader.attributes;
	}

	public getAttribute(key: string): IHeaderAttribute | undefined {
		return this._parsedHeader.attributes.find(attr => attr.key === key);
	}

	public get errors(): ParseError[] {
		return this._parsedHeader.errors;
	}

	private getStringAttribute(key: string): string | undefined {
		const attribute = this._parsedHeader.attributes.find(attr => attr.key === key);
		if (attribute?.value.type === 'string') {
			return attribute.value.value;
		}
		return undefined;
	}

	private getBooleanAttribute(key: string): boolean | undefined {
		const attribute = this._parsedHeader.attributes.find(attr => attr.key === key);
		if (attribute?.value.type === 'boolean') {
			return attribute.value.value;
		}
		return undefined;
	}

	public get name(): string | undefined {
		return this.getStringAttribute(PromptHeaderAttributes.name);
	}

	public get description(): string | undefined {
		return this.getStringAttribute(PromptHeaderAttributes.description);
	}

	public get agent(): string | undefined {
		return this.getStringAttribute(PromptHeaderAttributes.agent) ?? this.getStringAttribute(PromptHeaderAttributes.mode);
	}

	public get model(): string | undefined {
		return this.getStringAttribute(PromptHeaderAttributes.model);
	}

	public get applyTo(): string | undefined {
		return this.getStringAttribute(PromptHeaderAttributes.applyTo);
	}

	public get argumentHint(): string | undefined {
		return this.getStringAttribute(PromptHeaderAttributes.argumentHint);
	}

	public get target(): string | undefined {
		return this.getStringAttribute(PromptHeaderAttributes.target);
	}

	public get infer(): boolean | undefined {
		return this.getBooleanAttribute(PromptHeaderAttributes.infer);
	}

	public get tools(): string[] | undefined {
		const toolsAttribute = this._parsedHeader.attributes.find(attr => attr.key === PromptHeaderAttributes.tools);
		if (!toolsAttribute) {
			return undefined;
		}
		if (toolsAttribute.value.type === 'array') {
			const tools: string[] = [];
			for (const item of toolsAttribute.value.items) {
				if (item.type === 'string' && item.value) {
					tools.push(item.value);
				}
			}
			return tools;
		} else if (toolsAttribute.value.type === 'object') {
			const tools: string[] = [];
			const collectLeafs = ({ key, value }: { key: IStringValue; value: IValue }) => {
				if (value.type === 'boolean') {
					tools.push(key.value);
				} else if (value.type === 'object') {
					value.properties.forEach(collectLeafs);
				}
			};
			toolsAttribute.value.properties.forEach(collectLeafs);
			return tools;
		}
		return undefined;
	}

	public get handOffs(): IHandOff[] | undefined {
		const handoffsAttribute = this._parsedHeader.attributes.find(attr => attr.key === PromptHeaderAttributes.handOffs);
		if (!handoffsAttribute) {
			return undefined;
		}
		if (handoffsAttribute.value.type === 'array') {
			// Array format: list of objects: { agent, label, prompt, send?, showContinueOn? }
			const handoffs: IHandOff[] = [];
			for (const item of handoffsAttribute.value.items) {
				if (item.type === 'object') {
					let agent: string | undefined;
					let label: string | undefined;
					let prompt: string | undefined;
					let send: boolean | undefined;
					let showContinueOn: boolean | undefined;
					for (const prop of item.properties) {
						if (prop.key.value === 'agent' && prop.value.type === 'string') {
							agent = prop.value.value;
						} else if (prop.key.value === 'label' && prop.value.type === 'string') {
							label = prop.value.value;
						} else if (prop.key.value === 'prompt' && prop.value.type === 'string') {
							prompt = prop.value.value;
						} else if (prop.key.value === 'send' && prop.value.type === 'boolean') {
							send = prop.value.value;
						} else if (prop.key.value === 'showContinueOn' && prop.value.type === 'boolean') {
							showContinueOn = prop.value.value;
						}
					}
					if (agent && label && prompt !== undefined) {
						const handoff: IHandOff = {
							agent,
							label,
							prompt,
							...(send !== undefined ? { send } : {}),
							...(showContinueOn !== undefined ? { showContinueOn } : {})
						};
						handoffs.push(handoff);
					}
				}
			}
			return handoffs;
		}
		return undefined;
	}
}

export interface IHandOff {
	readonly agent: string;
	readonly label: string;
	readonly prompt: string;
	readonly send?: boolean;
	readonly showContinueOn?: boolean; // treated exactly like send (optional boolean)
}

export interface IHeaderAttribute {
	readonly range: Range;
	readonly key: string;
	readonly value: IValue;
}

export interface IStringValue { readonly type: 'string'; readonly value: string; readonly range: Range }
export interface INumberValue { readonly type: 'number'; readonly value: number; readonly range: Range }
export interface INullValue { readonly type: 'null'; readonly value: null; readonly range: Range }
export interface IBooleanValue { readonly type: 'boolean'; readonly value: boolean; readonly range: Range }

export interface IArrayValue {
	readonly type: 'array';
	readonly items: readonly IValue[];
	readonly range: Range;
}

export interface IObjectValue {
	readonly type: 'object';
	readonly properties: { key: IStringValue; value: IValue }[];
	readonly range: Range;
}

export type IValue = IStringValue | INumberValue | IBooleanValue | IArrayValue | IObjectValue | INullValue;


interface ParsedBody {
	readonly fileReferences: readonly IBodyFileReference[];
	readonly variableReferences: readonly IBodyVariableReference[];
	readonly bodyOffset: number;
}

export class PromptBody {
	private _parsed: ParsedBody | undefined;

	constructor(public readonly range: Range, private readonly linesWithEOL: string[], public readonly uri: URI) {
	}

	public get fileReferences(): readonly IBodyFileReference[] {
		return this.getParsedBody().fileReferences;
	}

	public get variableReferences(): readonly IBodyVariableReference[] {
		return this.getParsedBody().variableReferences;
	}

	public get offset(): number {
		return this.getParsedBody().bodyOffset;
	}

	private getParsedBody(): ParsedBody {
		if (this._parsed === undefined) {
			const markdownLinkRanges: Range[] = [];
			const fileReferences: IBodyFileReference[] = [];
			const variableReferences: IBodyVariableReference[] = [];
			const bodyOffset = Iterable.reduce(Iterable.slice(this.linesWithEOL, 0, this.range.startLineNumber - 1), (len, line) => line.length + len, 0);
			for (let i = this.range.startLineNumber - 1, lineStartOffset = bodyOffset; i < this.range.endLineNumber - 1; i++) {
				const line = this.linesWithEOL[i];
				// Match markdown links: [text](link)
				const linkMatch = line.matchAll(/\[(.*?)\]\((.+?)\)/g);
				for (const match of linkMatch) {
					const linkEndOffset = match.index + match[0].length - 1; // before the parenthesis
					const linkStartOffset = match.index + match[0].length - match[2].length - 1;
					const range = new Range(i + 1, linkStartOffset + 1, i + 1, linkEndOffset + 1);
					fileReferences.push({ content: match[2], range, isMarkdownLink: true });
					markdownLinkRanges.push(new Range(i + 1, match.index + 1, i + 1, match.index + match[0].length + 1));
				}
				// Match #file:<filePath> and #tool:<toolName>
				// Regarding the <toolName> pattern below, see also the variableReg regex in chatRequestParser.ts.
				const reg = /#file:(?<filePath>[^\s#]+)|#tool:(?<toolName>[\w_\-\.\/]+)/gi;
				const matches = line.matchAll(reg);
				for (const match of matches) {
					const fullMatch = match[0];
					const fullRange = new Range(i + 1, match.index + 1, i + 1, match.index + fullMatch.length + 1);
					if (markdownLinkRanges.some(mdRange => Range.areIntersectingOrTouching(mdRange, fullRange))) {
						continue;
					}
					const contentMatch = match.groups?.['filePath'] || match.groups?.['toolName'];
					if (!contentMatch) {
						continue;
					}
					const startOffset = match.index + fullMatch.length - contentMatch.length;
					const endOffset = match.index + fullMatch.length;
					const range = new Range(i + 1, startOffset + 1, i + 1, endOffset + 1);
					if (match.groups?.['filePath']) {
						fileReferences.push({ content: match.groups?.['filePath'], range, isMarkdownLink: false });
					} else if (match.groups?.['toolName']) {
						variableReferences.push({ name: match.groups?.['toolName'], range, offset: lineStartOffset + match.index });
					}
				}
				lineStartOffset += line.length;
			}
			this._parsed = { fileReferences: fileReferences.sort((a, b) => Range.compareRangesUsingStarts(a.range, b.range)), variableReferences, bodyOffset };
		}
		return this._parsed;
	}

	public getContent(): string {
		return this.linesWithEOL.slice(this.range.startLineNumber - 1, this.range.endLineNumber - 1).join('');
	}

	public resolveFilePath(path: string): URI | undefined {
		try {
			if (path.startsWith('/')) {
				return this.uri.with({ path });
			} else if (path.match(/^[a-zA-Z]+:\//)) {
				return URI.parse(path);
			} else {
				const dirName = dirname(this.uri);
				return joinPath(dirName, path);
			}
		} catch {
			return undefined;
		}
	}
}

export interface IBodyFileReference {
	readonly content: string;
	readonly range: Range;
	readonly isMarkdownLink: boolean;
}

export interface IBodyVariableReference {
	readonly name: string;
	readonly range: Range;
	readonly offset: number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/promptTypes.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/promptTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageSelector } from '../../../../../editor/common/languageSelector.js';

/**
 * Documentation link for the reusable prompts feature.
 */
export const PROMPT_DOCUMENTATION_URL = 'https://aka.ms/vscode-ghcp-prompt-snippets';
export const INSTRUCTIONS_DOCUMENTATION_URL = 'https://aka.ms/vscode-ghcp-custom-instructions';
export const AGENT_DOCUMENTATION_URL = 'https://aka.ms/vscode-ghcp-custom-chat-modes'; // todo

/**
 * Language ID for the reusable prompt syntax.
 */
export const PROMPT_LANGUAGE_ID = 'prompt';

/**
 * Language ID for instructions syntax.
 */
export const INSTRUCTIONS_LANGUAGE_ID = 'instructions';

/**
 * Language ID for agent syntax.
 */
export const AGENT_LANGUAGE_ID = 'chatagent';

/**
 * Prompt and instructions files language selector.
 */
export const ALL_PROMPTS_LANGUAGE_SELECTOR: LanguageSelector = [PROMPT_LANGUAGE_ID, INSTRUCTIONS_LANGUAGE_ID, AGENT_LANGUAGE_ID];

/**
 * The language id for for a prompts type.
 */
export function getLanguageIdForPromptsType(type: PromptsType): string {
	switch (type) {
		case PromptsType.prompt:
			return PROMPT_LANGUAGE_ID;
		case PromptsType.instructions:
			return INSTRUCTIONS_LANGUAGE_ID;
		case PromptsType.agent:
			return AGENT_LANGUAGE_ID;
		default:
			throw new Error(`Unknown prompt type: ${type}`);
	}
}

export function getPromptsTypeForLanguageId(languageId: string): PromptsType | undefined {
	switch (languageId) {
		case PROMPT_LANGUAGE_ID:
			return PromptsType.prompt;
		case INSTRUCTIONS_LANGUAGE_ID:
			return PromptsType.instructions;
		case AGENT_LANGUAGE_ID:
			return PromptsType.agent;
		default:
			return undefined;
	}
}


/**
 * What the prompt is used for.
 */
export enum PromptsType {
	instructions = 'instructions',
	prompt = 'prompt',
	agent = 'agent'
}
export function isValidPromptType(type: string): type is PromptsType {
	return Object.values(PromptsType).includes(type as PromptsType);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/config/config.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/config/config.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { URI } from '../../../../../../base/common/uri.js';
import { PromptsType } from '../promptTypes.js';
import { INSTRUCTIONS_DEFAULT_SOURCE_FOLDER, PROMPT_DEFAULT_SOURCE_FOLDER, getPromptFileDefaultLocation } from './promptFileLocations.js';

/**
 * Configuration helper for the `reusable prompts` feature.
 * @see {@link PromptsConfig.PROMPT_LOCATIONS_KEY}, {@link PromptsConfig.INSTRUCTIONS_LOCATION_KEY}, {@link PromptsConfig.MODE_LOCATION_KEY}, or {@link PromptsConfig.PROMPT_FILES_SUGGEST_KEY}.
 *
 * ### Functions
 *
 * - {@link getLocationsValue} allows to current read configuration value
 * - {@link promptSourceFolders} gets list of source folders for prompt files
 * - {@link getPromptFilesRecommendationsValue} gets prompt file recommendation configuration
 *
 * ### File Paths Resolution
 *
 * We resolve only `*.prompt.md` files inside the resulting source folders. Relative paths are resolved
 * relative to:
 *
 * - the current workspace `root`, if applicable, in other words one of the workspace folders
 *   can be used as a prompt files source folder
 * - root of each top-level folder in the workspace (if there are multiple workspace folders)
 * - current root folder (if a single folder is open)
 *
 * ### Prompt File Suggestions
 *
 * The `chat.promptFilesRecommendations` setting allows configuring which prompt files to suggest in different contexts:
 *
 * ```json
 * {
 *   "chat.promptFilesRecommendations": {
 *     "plan": true,                            // Always suggest
 *     "new-page": "resourceExtname == .js",    // Suggest for JavaScript files
 *     "draft-blog": "resourceLangId == markdown", // Suggest for Markdown files
 *     "debug": false                           // Never suggest
 *   }
 * }
 * ```
 */
export namespace PromptsConfig {
	/**
	 * Configuration key for the locations of reusable prompt files.
	 */
	export const PROMPT_LOCATIONS_KEY = 'chat.promptFilesLocations';

	/**
	 * Configuration key for the locations of instructions files.
	 */
	export const INSTRUCTIONS_LOCATION_KEY = 'chat.instructionsFilesLocations';
	/**
	 * Configuration key for the locations of mode files.
	 */
	export const MODE_LOCATION_KEY = 'chat.modeFilesLocations';

	/**
	 * Configuration key for prompt file suggestions.
	 */
	export const PROMPT_FILES_SUGGEST_KEY = 'chat.promptFilesRecommendations';

	/**
	 * Configuration key for use of the copilot instructions file.
	 */
	export const USE_COPILOT_INSTRUCTION_FILES = 'github.copilot.chat.codeGeneration.useInstructionFiles';

	/**
	 * Configuration key for the AGENTS.md.
	 */
	export const USE_AGENT_MD = 'chat.useAgentsMdFile';

	/**
	 * Configuration key for nested AGENTS.md files.
	 */
	export const USE_NESTED_AGENT_MD = 'chat.useNestedAgentsMdFiles';

	/**
	 * Configuration key for agent skills usage.
	 */
	export const USE_AGENT_SKILLS = 'chat.useAgentSkills';

	/**
	 * Get value of the `reusable prompt locations` configuration setting.
	 * @see {@link PROMPT_LOCATIONS_CONFIG_KEY}, {@link INSTRUCTIONS_LOCATIONS_CONFIG_KEY}, {@link MODE_LOCATIONS_CONFIG_KEY}.
	 */
	export function getLocationsValue(configService: IConfigurationService, type: PromptsType): Record<string, boolean> | undefined {
		const key = getPromptFileLocationsConfigKey(type);
		const configValue = configService.getValue(key);

		if (configValue === undefined || configValue === null || Array.isArray(configValue)) {
			return undefined;
		}

		// note! this would be also true for `null` and `array`,
		// 		 but those cases are already handled above
		if (typeof configValue === 'object') {
			const paths: Record<string, boolean> = {};

			for (const [path, value] of Object.entries(configValue)) {
				const cleanPath = path.trim();
				const booleanValue = asBoolean(value);

				// if value can be mapped to a boolean, and the clean
				// path is not empty, add it to the map
				if ((booleanValue !== undefined) && cleanPath) {
					paths[cleanPath] = booleanValue;
				}
			}

			return paths;
		}

		return undefined;
	}

	/**
	 * Gets list of source folders for prompt files.
	 * Defaults to {@link PROMPT_DEFAULT_SOURCE_FOLDER}, {@link INSTRUCTIONS_DEFAULT_SOURCE_FOLDER} or {@link MODE_DEFAULT_SOURCE_FOLDER}.
	 */
	export function promptSourceFolders(configService: IConfigurationService, type: PromptsType): string[] {
		const value = getLocationsValue(configService, type);
		const defaultSourceFolder = getPromptFileDefaultLocation(type);

		// note! the `value &&` part handles the `undefined`, `null`, and `false` cases
		if (value && (typeof value === 'object')) {
			const paths: string[] = [];

			// if the default source folder is not explicitly disabled, add it
			if (value[defaultSourceFolder] !== false) {
				paths.push(defaultSourceFolder);
			}

			// copy all the enabled paths to the result list
			for (const [path, enabledValue] of Object.entries(value)) {
				// we already added the default source folder, so skip it
				if ((enabledValue === false) || (path === defaultSourceFolder)) {
					continue;
				}

				paths.push(path);
			}

			return paths;
		}

		// `undefined`, `null`, and `false` cases
		return [];
	}

	/**
	 * Get value of the prompt file recommendations configuration setting.
	 * @param configService Configuration service instance
	 * @param resource Optional resource URI to get workspace folder-specific settings
	 * @see {@link PROMPT_FILES_SUGGEST_KEY}.
	 */
	export function getPromptFilesRecommendationsValue(configService: IConfigurationService, resource?: URI): Record<string, boolean | string> | undefined {
		// Get the merged configuration value (VS Code automatically merges all levels: default → user → workspace → folder)
		const configValue = configService.getValue(PromptsConfig.PROMPT_FILES_SUGGEST_KEY, { resource });

		if (!configValue || typeof configValue !== 'object' || Array.isArray(configValue)) {
			return undefined;
		}

		const suggestions: Record<string, boolean | string> = {};

		for (const [promptName, value] of Object.entries(configValue)) {
			const cleanPromptName = promptName.trim();

			// Skip empty prompt names
			if (!cleanPromptName) {
				continue;
			}

			// Accept boolean values directly
			if (typeof value === 'boolean') {
				suggestions[cleanPromptName] = value;
				continue;
			}

			// Accept string values as when clauses
			if (typeof value === 'string') {
				const cleanValue = value.trim();
				if (cleanValue) {
					suggestions[cleanPromptName] = cleanValue;
				}
				continue;
			}

			// Convert other truthy/falsy values to boolean
			const booleanValue = asBoolean(value);
			if (booleanValue !== undefined) {
				suggestions[cleanPromptName] = booleanValue;
			}
		}

		// Return undefined if no valid suggestions were found
		return Object.keys(suggestions).length > 0 ? suggestions : undefined;
	}

}

export function getPromptFileLocationsConfigKey(type: PromptsType): string {
	switch (type) {
		case PromptsType.instructions:
			return PromptsConfig.INSTRUCTIONS_LOCATION_KEY;
		case PromptsType.prompt:
			return PromptsConfig.PROMPT_LOCATIONS_KEY;
		case PromptsType.agent:
			return PromptsConfig.MODE_LOCATION_KEY;
		default:
			throw new Error('Unknown prompt type');
	}
}

/**
 * Helper to parse an input value of `any` type into a boolean.
 *
 * @param value - input value to parse
 * @returns `true` if the value is the boolean `true` value or a string that can
 * 			be clearly mapped to a boolean (e.g., `"true"`, `"TRUE"`, `"FaLSe"`, etc.),
 * 			`undefined` for rest of the values
 */
export function asBoolean(value: unknown): boolean | undefined {
	if (typeof value === 'boolean') {
		return value;
	}

	if (typeof value === 'string') {
		const cleanValue = value.trim().toLowerCase();
		if (cleanValue === 'true') {
			return true;
		}

		if (cleanValue === 'false') {
			return false;
		}

		return undefined;
	}

	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/config/promptFileLocations.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/config/promptFileLocations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../../base/common/uri.js';
import { basename, dirname } from '../../../../../../base/common/path.js';
import { PromptsType } from '../promptTypes.js';

/**
 * File extension for the reusable prompt files.
 */
export const PROMPT_FILE_EXTENSION = '.prompt.md';

/**
 * File extension for the reusable instruction files.
 */
export const INSTRUCTION_FILE_EXTENSION = '.instructions.md';

/**
 * File extension for the modes files.
 */
export const LEGACY_MODE_FILE_EXTENSION = '.chatmode.md';

/**
 * File extension for the agent files.
 */
export const AGENT_FILE_EXTENSION = '.agent.md';

/**
 * Copilot custom instructions file name.
 */
export const COPILOT_CUSTOM_INSTRUCTIONS_FILENAME = 'copilot-instructions.md';


/**
 * Default reusable prompt files source folder.
 */
export const PROMPT_DEFAULT_SOURCE_FOLDER = '.github/prompts';

/**
 * Default reusable instructions files source folder.
 */
export const INSTRUCTIONS_DEFAULT_SOURCE_FOLDER = '.github/instructions';

/**
 * Default modes source folder.
 */
export const LEGACY_MODE_DEFAULT_SOURCE_FOLDER = '.github/chatmodes';

/**
 * Agents folder.
 */
export const AGENTS_SOURCE_FOLDER = '.github/agents';

/**
 * Default agent skills workspace source folders.
 */
export const DEFAULT_AGENT_SKILLS_WORKSPACE_FOLDERS = [
	'.github/skills',
	'.claude/skills'
] as const;

/**
 * Default agent skills user home source folders.
 */
export const DEFAULT_AGENT_SKILLS_USER_HOME_FOLDERS = [
	'.claude/skills'
] as const;

/**
 * Helper function to check if a file is directly in the .github/agents/ folder (not in subfolders).
 */
function isInAgentsFolder(fileUri: URI): boolean {
	const dir = dirname(fileUri.path);
	return dir.endsWith('/' + AGENTS_SOURCE_FOLDER) || dir === AGENTS_SOURCE_FOLDER;
}

/**
 * Gets the prompt file type from the provided path.
 */
export function getPromptFileType(fileUri: URI): PromptsType | undefined {
	const filename = basename(fileUri.path);

	if (filename.endsWith(PROMPT_FILE_EXTENSION)) {
		return PromptsType.prompt;
	}

	if (filename.endsWith(INSTRUCTION_FILE_EXTENSION) || (filename === COPILOT_CUSTOM_INSTRUCTIONS_FILENAME)) {
		return PromptsType.instructions;
	}

	if (filename.endsWith(LEGACY_MODE_FILE_EXTENSION) || filename.endsWith(AGENT_FILE_EXTENSION)) {
		return PromptsType.agent;
	}

	// Check if it's a .md file in the .github/agents/ folder
	if (filename.endsWith('.md') && isInAgentsFolder(fileUri)) {
		return PromptsType.agent;
	}

	return undefined;
}

/**
 * Check if provided URI points to a file that with prompt file extension.
 */
export function isPromptOrInstructionsFile(fileUri: URI): boolean {
	return getPromptFileType(fileUri) !== undefined;
}

export function getPromptFileExtension(type: PromptsType): string {
	switch (type) {
		case PromptsType.instructions:
			return INSTRUCTION_FILE_EXTENSION;
		case PromptsType.prompt:
			return PROMPT_FILE_EXTENSION;
		case PromptsType.agent:
			return AGENT_FILE_EXTENSION;
		default:
			throw new Error('Unknown prompt type');
	}
}

export function getPromptFileDefaultLocation(type: PromptsType): string {
	switch (type) {
		case PromptsType.instructions:
			return INSTRUCTIONS_DEFAULT_SOURCE_FOLDER;
		case PromptsType.prompt:
			return PROMPT_DEFAULT_SOURCE_FOLDER;
		case PromptsType.agent:
			return AGENTS_SOURCE_FOLDER;
		default:
			throw new Error('Unknown prompt type');
	}
}


/**
 * Gets clean prompt name without file extension.
 */
export function getCleanPromptName(fileUri: URI): string {
	const fileName = basename(fileUri.path);

	const extensions = [
		PROMPT_FILE_EXTENSION,
		INSTRUCTION_FILE_EXTENSION,
		LEGACY_MODE_FILE_EXTENSION,
		AGENT_FILE_EXTENSION,
	];

	for (const ext of extensions) {
		if (fileName.endsWith(ext)) {
			return basename(fileUri.path, ext);
		}
	}

	if (fileName === COPILOT_CUSTOM_INSTRUCTIONS_FILENAME) {
		return basename(fileUri.path, '.md');
	}

	// For .md files in .github/agents/ folder, treat them as agent files
	if (fileName.endsWith('.md') && isInAgentsFolder(fileUri)) {
		return basename(fileUri.path, '.md');
	}

	// because we now rely on the `prompt` language ID that can be explicitly
	// set for any document in the editor, any file can be a "prompt" file, so
	// to account for that, we return the full file name including the file
	// extension for all other cases
	return basename(fileUri.path);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/promptBodyAutocompletion.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/promptBodyAutocompletion.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { dirname, extUri } from '../../../../../../base/common/resources.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { getPromptsTypeForLanguageId, PromptsType } from '../promptTypes.js';
import { Position } from '../../../../../../editor/common/core/position.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { CompletionContext, CompletionItem, CompletionItemKind, CompletionItemProvider, CompletionList } from '../../../../../../editor/common/languages.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { CharCode } from '../../../../../../base/common/charCode.js';
import { getWordAtText } from '../../../../../../editor/common/core/wordHelper.js';
import { chatVariableLeader } from '../../chatParserTypes.js';
import { ILanguageModelToolsService } from '../../languageModelToolsService.js';

/**
 * Provides autocompletion for the variables inside prompt bodies.
 * - #file: paths to files and folders in the workspace
 * - # tool names
 */
export class PromptBodyAutocompletion implements CompletionItemProvider {
	/**
	 * Debug display name for this provider.
	 */
	public readonly _debugDisplayName: string = 'PromptBodyAutocompletion';

	/**
	 * List of trigger characters handled by this provider.
	 */
	public readonly triggerCharacters = [':', '.', '/', '\\'];

	constructor(
		@IFileService private readonly fileService: IFileService,
		@ILanguageModelToolsService private readonly languageModelToolsService: ILanguageModelToolsService,
	) {
	}

	/**
	 * The main function of this provider that calculates
	 * completion items based on the provided arguments.
	 */
	public async provideCompletionItems(model: ITextModel, position: Position, context: CompletionContext, token: CancellationToken): Promise<CompletionList | undefined> {
		const promptsType = getPromptsTypeForLanguageId(model.getLanguageId());
		if (!promptsType) {
			return undefined;
		}
		const reference = await this.findVariableReference(model, position, token);
		if (!reference) {
			return undefined;
		}
		const suggestions: CompletionItem[] = [];
		switch (reference.type) {
			case 'file':
				if (reference.contentRange.containsPosition(position)) {
					// inside the link range
					await this.collectFilePathCompletions(model, position, reference.contentRange, suggestions);
				} else {
					await this.collectDefaultCompletions(model, reference.range, promptsType, suggestions);
				}
				break;
			case 'tool':
				if (reference.contentRange.containsPosition(position)) {
					if (promptsType === PromptsType.agent || promptsType === PromptsType.prompt) {
						await this.collectToolCompletions(model, position, reference.contentRange, suggestions);
					}
				} else {
					await this.collectDefaultCompletions(model, reference.range, promptsType, suggestions);
				}
				break;
			default:
				await this.collectDefaultCompletions(model, reference.range, promptsType, suggestions);
		}
		return { suggestions };
	}

	private async collectToolCompletions(model: ITextModel, position: Position, toolRange: Range, suggestions: CompletionItem[]): Promise<void> {
		for (const toolName of this.languageModelToolsService.getFullReferenceNames()) {
			suggestions.push({
				label: toolName,
				kind: CompletionItemKind.Value,
				filterText: toolName,
				insertText: toolName,
				range: toolRange,
			});
		}
	}


	private async collectFilePathCompletions(model: ITextModel, position: Position, pathRange: Range, suggestions: CompletionItem[]): Promise<void> {
		const pathUntilPosition = model.getValueInRange(pathRange.setEndPosition(position.lineNumber, position.column));
		const pathSeparator = pathUntilPosition.includes('/') || !pathUntilPosition.includes('\\') ? '/' : '\\';
		let parentFolderPath: string;
		if (pathUntilPosition.match(/[^\/]\.\.$/i)) { // ends with `..`
			parentFolderPath = pathUntilPosition + pathSeparator;
		} else {
			let i = pathUntilPosition.length - 1;
			while (i >= 0 && ![CharCode.Slash, CharCode.Backslash].includes(pathUntilPosition.charCodeAt(i))) {
				i--;
			}
			parentFolderPath = pathUntilPosition.substring(0, i + 1); // the segment up to the `/` or `\` before the position
		}

		const retriggerCommand = { id: 'editor.action.triggerSuggest', title: 'Suggest' };

		try {
			const currentFolder = extUri.resolvePath(dirname(model.uri), parentFolderPath);
			const { children } = await this.fileService.resolve(currentFolder);
			if (children) {
				for (const child of children) {
					const insertText = (parentFolderPath || ('.' + pathSeparator)) + child.name;
					suggestions.push({
						label: child.name + (child.isDirectory ? pathSeparator : ''),
						kind: child.isDirectory ? CompletionItemKind.Folder : CompletionItemKind.File,
						range: pathRange,
						insertText: insertText + (child.isDirectory ? pathSeparator : ''),
						filterText: insertText,
						command: child.isDirectory ? retriggerCommand : undefined
					});
				}
			}
		} catch (e) {
			// ignore errors accessing the folder location
		}

		suggestions.push({
			label: '..',
			kind: CompletionItemKind.Folder,
			insertText: parentFolderPath + '..' + pathSeparator,
			range: pathRange,
			filterText: parentFolderPath + '..',
			command: retriggerCommand
		});
	}

	/**
	 * Finds a file reference that suites the provided `position`.
	 */
	private async findVariableReference(model: ITextModel, position: Position, token: CancellationToken): Promise<{ contentRange: Range; type: string; range: Range } | undefined> {
		if (model.getLineContent(1).trimEnd() === '---') {
			let i = 2;
			while (i <= model.getLineCount() && model.getLineContent(i).trimEnd() !== '---') {
				i++;
			}
			if (i >= position.lineNumber) {
				// inside front matter
				return undefined;
			}
		}

		const reg = new RegExp(`${chatVariableLeader}[^\\s#]*`, 'g');
		const varWord = getWordAtText(position.column, reg, model.getLineContent(position.lineNumber), 0);
		if (!varWord) {
			return undefined;
		}
		const range = new Range(position.lineNumber, varWord.startColumn + 1, position.lineNumber, varWord.endColumn);
		const nameMatch = varWord.word.match(/^#(\w+:)?/);
		if (nameMatch) {
			const contentCol = varWord.startColumn + nameMatch[0].length;
			if (nameMatch[1] === 'file:') {
				return { type: 'file', contentRange: new Range(position.lineNumber, contentCol, position.lineNumber, varWord.endColumn), range };
			} else if (nameMatch[1] === 'tool:') {
				return { type: 'tool', contentRange: new Range(position.lineNumber, contentCol, position.lineNumber, varWord.endColumn), range };
			}
		}
		return { type: '', contentRange: range, range };
	}

	private async collectDefaultCompletions(model: ITextModel, range: Range, promptFileType: PromptsType, suggestions: CompletionItem[]): Promise<void> {
		const labels = promptFileType === PromptsType.instructions ? ['file'] : ['file', 'tool'];
		labels.forEach(label => {
			suggestions.push({
				label: `${label}:`,
				kind: CompletionItemKind.Keyword,
				insertText: `${label}:`,
				range: range,
				command: { id: 'editor.action.triggerSuggest', title: 'Suggest' }
			});
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/promptCodeActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/promptCodeActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { CodeAction, CodeActionContext, CodeActionList, CodeActionProvider, IWorkspaceFileEdit, IWorkspaceTextEdit, TextEdit } from '../../../../../../editor/common/languages.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { localize } from '../../../../../../nls.js';
import { ILanguageModelToolsService } from '../../languageModelToolsService.js';
import { getPromptsTypeForLanguageId, PromptsType } from '../promptTypes.js';
import { IPromptsService } from '../service/promptsService.js';
import { ParsedPromptFile, PromptHeaderAttributes } from '../promptFileParser.js';
import { Selection } from '../../../../../../editor/common/core/selection.js';
import { Lazy } from '../../../../../../base/common/lazy.js';
import { LEGACY_MODE_FILE_EXTENSION } from '../config/promptFileLocations.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import { isGithubTarget, MARKERS_OWNER_ID } from './promptValidator.js';
import { IMarkerData, IMarkerService } from '../../../../../../platform/markers/common/markers.js';
import { CodeActionKind } from '../../../../../../editor/contrib/codeAction/common/types.js';

export class PromptCodeActionProvider implements CodeActionProvider {
	/**
	 * Debug display name for this provider.
	 */
	public readonly _debugDisplayName: string = 'PromptCodeActionProvider';

	constructor(
		@IPromptsService private readonly promptsService: IPromptsService,
		@ILanguageModelToolsService private readonly languageModelToolsService: ILanguageModelToolsService,
		@IFileService private readonly fileService: IFileService,
		@IMarkerService private readonly markerService: IMarkerService,
	) {
	}

	async provideCodeActions(model: ITextModel, range: Range | Selection, context: CodeActionContext, token: CancellationToken): Promise<CodeActionList | undefined> {
		const promptType = getPromptsTypeForLanguageId(model.getLanguageId());
		if (!promptType || promptType === PromptsType.instructions) {
			// if the model is not a prompt, we don't provide any code actions
			return undefined;
		}

		const result: CodeAction[] = [];

		const promptAST = this.promptsService.getParsedPromptFile(model);
		switch (promptType) {
			case PromptsType.agent:
				this.getUpdateToolsCodeActions(promptAST, promptType, model, range, result);
				await this.getMigrateModeFileCodeActions(model, result);
				break;
			case PromptsType.prompt:
				this.getUpdateModeCodeActions(promptAST, model, range, result);
				this.getUpdateToolsCodeActions(promptAST, promptType, model, range, result);
				break;
		}

		if (result.length === 0) {
			return undefined;
		}
		return {
			actions: result,
			dispose: () => { }
		};

	}

	private getMarkers(model: ITextModel, range: Range): IMarkerData[] {
		const markers = this.markerService.read({ resource: model.uri, owner: MARKERS_OWNER_ID });
		return markers.filter(marker => range.containsRange(marker));
	}

	private createCodeAction(model: ITextModel, range: Range, title: string, edits: Array<IWorkspaceTextEdit | IWorkspaceFileEdit>): CodeAction {
		return {
			title,
			edit: { edits },
			ranges: [range],
			diagnostics: this.getMarkers(model, range),
			kind: CodeActionKind.QuickFix.value
		};
	}

	private getUpdateModeCodeActions(promptFile: ParsedPromptFile, model: ITextModel, range: Range, result: CodeAction[]): void {
		const modeAttr = promptFile.header?.getAttribute(PromptHeaderAttributes.mode);
		if (!modeAttr?.range.containsRange(range)) {
			return;
		}
		const keyRange = new Range(modeAttr.range.startLineNumber, modeAttr.range.startColumn, modeAttr.range.startLineNumber, modeAttr.range.startColumn + modeAttr.key.length);
		result.push(this.createCodeAction(model, keyRange,
			localize('renameToAgent', "Rename to 'agent'"),
			[asWorkspaceTextEdit(model, { range: keyRange, text: 'agent' })]
		));
	}

	private async getMigrateModeFileCodeActions(model: ITextModel, result: CodeAction[]): Promise<void> {
		if (model.uri.path.endsWith(LEGACY_MODE_FILE_EXTENSION)) {
			const location = this.promptsService.getAgentFileURIFromModeFile(model.uri);
			if (location && await this.fileService.canMove(model.uri, location)) {
				const edit: IWorkspaceFileEdit = { oldResource: model.uri, newResource: location, options: { overwrite: false, copy: false } };
				result.push(this.createCodeAction(model, new Range(1, 1, 1, 4),
					localize('migrateToAgent', "Migrate to custom agent file"),
					[edit]
				));
			}
		}
	}

	private getUpdateToolsCodeActions(promptFile: ParsedPromptFile, promptType: PromptsType, model: ITextModel, range: Range, result: CodeAction[]): void {
		const toolsAttr = promptFile.header?.getAttribute(PromptHeaderAttributes.tools);
		if (toolsAttr?.value.type !== 'array' || !toolsAttr.value.range.containsRange(range)) {
			return;
		}
		if (isGithubTarget(promptType, promptFile.header?.target)) {
			// GitHub Copilot custom agents use a fixed set of tool names that are not deprecated
			return;
		}

		const values = toolsAttr.value.items;
		const deprecatedNames = new Lazy(() => this.languageModelToolsService.getDeprecatedFullReferenceNames());
		const edits: TextEdit[] = [];
		for (const item of values) {
			if (item.type !== 'string') {
				continue;
			}
			const newNames = deprecatedNames.value.get(item.value);
			if (newNames && newNames.size > 0) {
				const quote = model.getValueInRange(new Range(item.range.startLineNumber, item.range.startColumn, item.range.endLineNumber, item.range.startColumn + 1));

				if (newNames.size === 1) {
					const newName = Array.from(newNames)[0];
					const text = (quote === `'` || quote === '"') ? (quote + newName + quote) : newName;
					const edit = { range: item.range, text };
					edits.push(edit);

					if (item.range.containsRange(range)) {
						result.push(this.createCodeAction(model, item.range,
							localize('updateToolName', "Update to '{0}'", newName),
							[asWorkspaceTextEdit(model, edit)]
						));
					}
				} else {
					// Multiple new names - expand to include all of them
					const newNamesArray = Array.from(newNames).sort((a, b) => a.localeCompare(b));
					const separator = model.getValueInRange(new Range(item.range.startLineNumber, item.range.endColumn, item.range.endLineNumber, item.range.endColumn + 2));
					const useCommaSpace = separator.includes(',');
					const delimiterText = useCommaSpace ? ', ' : ',';

					const newNamesText = newNamesArray.map(name =>
						(quote === `'` || quote === '"') ? (quote + name + quote) : name
					).join(delimiterText);

					const edit = { range: item.range, text: newNamesText };
					edits.push(edit);

					if (item.range.containsRange(range)) {
						result.push(this.createCodeAction(model, item.range,
							localize('expandToolNames', "Expand to {0} tools", newNames.size),
							[asWorkspaceTextEdit(model, edit)]
						));
					}
				}
			}
		}

		if (edits.length && result.length === 0 || edits.length > 1) {
			result.push(
				this.createCodeAction(model, toolsAttr.value.range,
					localize('updateAllToolNames', "Update all tool names"),
					edits.map(edit => asWorkspaceTextEdit(model, edit))
				)
			);
		}
	}
}
function asWorkspaceTextEdit(model: ITextModel, textEdit: TextEdit): IWorkspaceTextEdit {
	return {
		versionId: model.getVersionId(),
		resource: model.uri,
		textEdit
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/promptDocumentSemanticTokensProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/promptDocumentSemanticTokensProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { DocumentSemanticTokensProvider, ProviderResult, SemanticTokens, SemanticTokensLegend } from '../../../../../../editor/common/languages.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { getPromptsTypeForLanguageId } from '../promptTypes.js';
import { IPromptsService } from '../service/promptsService.js';
import { isGithubTarget } from './promptValidator.js';

export class PromptDocumentSemanticTokensProvider implements DocumentSemanticTokensProvider {
	/**
	 * Debug display name for this provider.
	 */
	public readonly _debugDisplayName: string = 'PromptDocumentSemanticTokensProvider';

	constructor(
		@IPromptsService private readonly promptsService: IPromptsService,
	) {
	}

	provideDocumentSemanticTokens(model: ITextModel, lastResultId: string | null, token: CancellationToken): ProviderResult<SemanticTokens> {
		const promptType = getPromptsTypeForLanguageId(model.getLanguageId());
		if (!promptType) {
			// if the model is not a prompt, we don't provide any semantic tokens
			return undefined;
		}

		const promptAST = this.promptsService.getParsedPromptFile(model);
		if (!promptAST.body) {
			return undefined;
		}

		if (isGithubTarget(promptType, promptAST.header?.target)) {
			// In GitHub Copilot mode, we don't provide variable semantic tokens to tool references
			return undefined;
		}

		const variableReferences = promptAST.body.variableReferences;
		if (!variableReferences.length) {
			return undefined;
		}

		// Prepare semantic tokens data following the delta-encoded, 5-number tuple format:
		// [deltaLine, deltaStart, length, tokenType, tokenModifiers]
		// We expose a single token type 'variable' (index 0) and no modifiers (bitset 0).
		const data: number[] = [];
		let lastLine = 0;
		let lastChar = 0;

		// Ensure stable order (parser already produces them in order, but sort defensively)
		const ordered = [...variableReferences].sort((a, b) => a.range.startLineNumber === b.range.startLineNumber
			? a.range.startColumn - b.range.startColumn
			: a.range.startLineNumber - b.range.startLineNumber);

		for (const ref of ordered) {
			// Also include the '#tool:' prefix for syntax highlighting purposes, even if it's not originally part of the variable name itself.
			const extraCharCount = '#tool:'.length;
			const line = ref.range.startLineNumber - 1; // zero-based
			const char = ref.range.startColumn - extraCharCount - 1; // zero-based
			const length = ref.range.endColumn - ref.range.startColumn + extraCharCount;
			const deltaLine = line - lastLine;
			const deltaChar = deltaLine === 0 ? char - lastChar : char;
			data.push(deltaLine, deltaChar, length, 0 /* variable token type index */, 0 /* no modifiers */);
			lastLine = line;
			lastChar = char;
			if (token.isCancellationRequested) {
				break; // Return what we have so far if cancelled.
			}
		}

		return { data: new Uint32Array(data) };
	}

	getLegend(): SemanticTokensLegend {
		return { tokenTypes: ['variable'], tokenModifiers: [] };
	}

	releaseDocumentSemanticTokens(resultId: string | undefined): void {
		// No caching/result management needed for the simple, stateless implementation.
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/promptHeaderAutocompletion.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/promptHeaderAutocompletion.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { CharCode } from '../../../../../../base/common/charCode.js';
import { Position } from '../../../../../../editor/common/core/position.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { CompletionContext, CompletionItem, CompletionItemInsertTextRule, CompletionItemKind, CompletionItemProvider, CompletionList } from '../../../../../../editor/common/languages.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { ILanguageModelChatMetadata, ILanguageModelsService } from '../../languageModels.js';
import { ILanguageModelToolsService } from '../../languageModelToolsService.js';
import { IChatModeService } from '../../chatModes.js';
import { getPromptsTypeForLanguageId, PromptsType } from '../promptTypes.js';
import { IPromptsService } from '../service/promptsService.js';
import { Iterable } from '../../../../../../base/common/iterator.js';
import { PromptHeader, PromptHeaderAttributes } from '../promptFileParser.js';
import { getValidAttributeNames, isGithubTarget, knownGithubCopilotTools } from './promptValidator.js';
import { localize } from '../../../../../../nls.js';

export class PromptHeaderAutocompletion implements CompletionItemProvider {
	/**
	 * Debug display name for this provider.
	 */
	public readonly _debugDisplayName: string = 'PromptHeaderAutocompletion';

	/**
	 * List of trigger characters handled by this provider.
	 */
	public readonly triggerCharacters = [':'];

	constructor(
		@IPromptsService private readonly promptsService: IPromptsService,
		@ILanguageModelsService private readonly languageModelsService: ILanguageModelsService,
		@ILanguageModelToolsService private readonly languageModelToolsService: ILanguageModelToolsService,
		@IChatModeService private readonly chatModeService: IChatModeService,
	) {
	}

	/**
	 * The main function of this provider that calculates
	 * completion items based on the provided arguments.
	 */
	public async provideCompletionItems(
		model: ITextModel,
		position: Position,
		context: CompletionContext,
		token: CancellationToken,
	): Promise<CompletionList | undefined> {

		const promptType = getPromptsTypeForLanguageId(model.getLanguageId());
		if (!promptType) {
			// if the model is not a prompt, we don't provide any completions
			return undefined;
		}

		if (/^\s*$/.test(model.getValue())) {
			return {
				suggestions: [{
					label: localize('promptHeaderAutocompletion.addHeader', "Add Prompt Header"),
					kind: CompletionItemKind.Snippet,
					insertText: [
						`---`,
						`description: $1`,
						`---`,
						`$0`
					].join('\n'),
					insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
					range: model.getFullModelRange(),
				}]
			};
		}


		const parsedAST = this.promptsService.getParsedPromptFile(model);
		const header = parsedAST.header;
		if (!header) {
			return undefined;
		}

		const headerRange = parsedAST.header.range;
		if (position.lineNumber < headerRange.startLineNumber || position.lineNumber >= headerRange.endLineNumber) {
			// if the position is not inside the header, we don't provide any completions
			return undefined;
		}

		const lineText = model.getLineContent(position.lineNumber);
		const colonIndex = lineText.indexOf(':');
		const colonPosition = colonIndex !== -1 ? new Position(position.lineNumber, colonIndex + 1) : undefined;

		if (!colonPosition || position.isBeforeOrEqual(colonPosition)) {
			return this.provideAttributeNameCompletions(model, position, header, colonPosition, promptType);
		} else if (colonPosition && colonPosition.isBefore(position)) {
			return this.provideValueCompletions(model, position, header, colonPosition, promptType);
		}
		return undefined;
	}
	private async provideAttributeNameCompletions(
		model: ITextModel,
		position: Position,
		header: PromptHeader,
		colonPosition: Position | undefined,
		promptType: PromptsType,
	): Promise<CompletionList | undefined> {

		const suggestions: CompletionItem[] = [];

		const isGitHubTarget = isGithubTarget(promptType, header.target);
		const attributesToPropose = new Set(getValidAttributeNames(promptType, false, isGitHubTarget));
		for (const attr of header.attributes) {
			attributesToPropose.delete(attr.key);
		}
		const getInsertText = (key: string): string => {
			if (colonPosition) {
				return key;
			}
			const valueSuggestions = this.getValueSuggestions(promptType, key);
			if (valueSuggestions.length > 0) {
				return `${key}: \${0:${valueSuggestions[0]}}`;
			} else {
				return `${key}: \$0`;
			}
		};


		for (const attribute of attributesToPropose) {
			const item: CompletionItem = {
				label: attribute,
				kind: CompletionItemKind.Property,
				insertText: getInsertText(attribute),
				insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
				range: new Range(position.lineNumber, 1, position.lineNumber, !colonPosition ? model.getLineMaxColumn(position.lineNumber) : colonPosition.column),
			};
			suggestions.push(item);
		}

		return { suggestions };
	}

	private async provideValueCompletions(
		model: ITextModel,
		position: Position,
		header: PromptHeader,
		colonPosition: Position,
		promptType: PromptsType,
	): Promise<CompletionList | undefined> {

		const suggestions: CompletionItem[] = [];
		const lineContent = model.getLineContent(position.lineNumber);
		const attribute = lineContent.substring(0, colonPosition.column - 1).trim();

		const isGitHubTarget = isGithubTarget(promptType, header.target);
		if (!getValidAttributeNames(promptType, true, isGitHubTarget).includes(attribute)) {
			return undefined;
		}

		if (promptType === PromptsType.prompt || promptType === PromptsType.agent) {
			// if the position is inside the tools metadata, we provide tool name completions
			const result = this.provideToolCompletions(model, position, header, isGitHubTarget);
			if (result) {
				return result;
			}
		}

		const bracketIndex = lineContent.indexOf('[');
		if (bracketIndex !== -1 && bracketIndex <= position.column - 1) {
			// if the value is already inside a bracket, we don't provide value completions
			return undefined;
		}

		const whilespaceAfterColon = (lineContent.substring(colonPosition.column).match(/^\s*/)?.[0].length) ?? 0;
		const values = this.getValueSuggestions(promptType, attribute);
		for (const value of values) {
			const item: CompletionItem = {
				label: value,
				kind: CompletionItemKind.Value,
				insertText: whilespaceAfterColon === 0 ? ` ${value}` : value,
				range: new Range(position.lineNumber, colonPosition.column + whilespaceAfterColon + 1, position.lineNumber, model.getLineMaxColumn(position.lineNumber)),
			};
			suggestions.push(item);
		}
		if (attribute === PromptHeaderAttributes.handOffs && (promptType === PromptsType.agent)) {
			const value = [
				'',
				'  - label: Start Implementation',
				'    agent: agent',
				'    prompt: Implement the plan',
				'    send: true'
			].join('\n');
			const item: CompletionItem = {
				label: localize('promptHeaderAutocompletion.handoffsExample', "Handoff Example"),
				kind: CompletionItemKind.Value,
				insertText: whilespaceAfterColon === 0 ? ` ${value}` : value,
				range: new Range(position.lineNumber, colonPosition.column + whilespaceAfterColon + 1, position.lineNumber, model.getLineMaxColumn(position.lineNumber)),
			};
			suggestions.push(item);
		}
		return { suggestions };
	}

	private getValueSuggestions(promptType: string, attribute: string): string[] {
		switch (attribute) {
			case PromptHeaderAttributes.applyTo:
				if (promptType === PromptsType.instructions) {
					return [`'**'`, `'**/*.ts, **/*.js'`, `'**/*.php'`, `'**/*.py'`];
				}
				break;
			case PromptHeaderAttributes.agent:
			case PromptHeaderAttributes.mode:
				if (promptType === PromptsType.prompt) {
					// Get all available agents (builtin + custom)
					const agents = this.chatModeService.getModes();
					const suggestions: string[] = [];
					for (const agent of Iterable.concat(agents.builtin, agents.custom)) {
						suggestions.push(agent.name.get());
					}
					return suggestions;
				}
				break;
			case PromptHeaderAttributes.target:
				if (promptType === PromptsType.agent) {
					return ['vscode', 'github-copilot'];
				}
				break;
			case PromptHeaderAttributes.tools:
				if (promptType === PromptsType.prompt || promptType === PromptsType.agent) {
					return ['[]', `['search', 'edit', 'fetch']`];
				}
				break;
			case PromptHeaderAttributes.model:
				if (promptType === PromptsType.prompt || promptType === PromptsType.agent) {
					return this.getModelNames(promptType === PromptsType.agent);
				}
				break;
			case PromptHeaderAttributes.infer:
				if (promptType === PromptsType.agent) {
					return ['true', 'false'];
				}
				break;
		}
		return [];
	}

	private getModelNames(agentModeOnly: boolean): string[] {
		const result = [];
		for (const model of this.languageModelsService.getLanguageModelIds()) {
			const metadata = this.languageModelsService.lookupLanguageModel(model);
			if (metadata && metadata.isUserSelectable !== false) {
				if (!agentModeOnly || ILanguageModelChatMetadata.suitableForAgentMode(metadata)) {
					result.push(ILanguageModelChatMetadata.asQualifiedName(metadata));
				}
			}
		}
		return result;
	}

	private provideToolCompletions(model: ITextModel, position: Position, header: PromptHeader, isGitHubTarget: boolean): CompletionList | undefined {
		const toolsAttr = header.getAttribute(PromptHeaderAttributes.tools);
		if (!toolsAttr || toolsAttr.value.type !== 'array' || !toolsAttr.range.containsPosition(position)) {
			return undefined;
		}
		const getSuggestions = (toolRange: Range) => {
			const suggestions: CompletionItem[] = [];
			const toolNames = isGitHubTarget ? knownGithubCopilotTools : this.languageModelToolsService.getFullReferenceNames();
			for (const toolName of toolNames) {
				let insertText: string;
				if (!toolRange.isEmpty()) {
					const firstChar = model.getValueInRange(toolRange).charCodeAt(0);
					insertText = firstChar === CharCode.SingleQuote ? `'${toolName}'` : firstChar === CharCode.DoubleQuote ? `"${toolName}"` : toolName;
				} else {
					insertText = `'${toolName}'`;
				}
				suggestions.push({
					label: toolName,
					kind: CompletionItemKind.Value,
					filterText: insertText,
					insertText: insertText,
					range: toolRange,
				});
			}
			return { suggestions };
		};

		for (const toolNameNode of toolsAttr.value.items) {
			if (toolNameNode.range.containsPosition(position)) {
				// if the position is inside a tool range, we provide tool name completions
				return getSuggestions(toolNameNode.range);
			}
		}
		const prefix = model.getValueInRange(new Range(position.lineNumber, 1, position.lineNumber, position.column));
		if (prefix.match(/[,[]\s*$/)) {
			// if the position is after a comma or bracket
			return getSuggestions(new Range(position.lineNumber, position.column, position.lineNumber, position.column));
		}
		return undefined;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/PromptHeaderDefinitionProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/PromptHeaderDefinitionProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { Position } from '../../../../../../editor/common/core/position.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { Definition, DefinitionProvider } from '../../../../../../editor/common/languages.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { IChatModeService } from '../../chatModes.js';
import { getPromptsTypeForLanguageId } from '../promptTypes.js';
import { PromptHeaderAttributes } from '../promptFileParser.js';
import { IPromptsService } from '../service/promptsService.js';

export class PromptHeaderDefinitionProvider implements DefinitionProvider {
	/**
	 * Debug display name for this provider.
	 */
	public readonly _debugDisplayName: string = 'PromptHeaderDefinitionProvider';

	constructor(
		@IPromptsService private readonly promptsService: IPromptsService,
		@IChatModeService private readonly chatModeService: IChatModeService,
	) {
	}

	async provideDefinition(model: ITextModel, position: Position, token: CancellationToken): Promise<Definition | undefined> {
		const promptType = getPromptsTypeForLanguageId(model.getLanguageId());
		if (!promptType) {
			// if the model is not a prompt, we don't provide any definitions
			return undefined;
		}

		const promptAST = this.promptsService.getParsedPromptFile(model);
		const header = promptAST.header;
		if (!header) {
			return undefined;
		}

		const agentAttr = header.getAttribute(PromptHeaderAttributes.agent) ?? header.getAttribute(PromptHeaderAttributes.mode);
		if (agentAttr && agentAttr.value.type === 'string' && agentAttr.range.containsPosition(position)) {
			const agent = this.chatModeService.findModeByName(agentAttr.value.value);
			if (agent && agent.uri) {
				return {
					uri: agent.uri.get(),
					range: new Range(1, 1, 1, 1)
				};
			}
		}
		return undefined;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/promptHovers.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/promptHovers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { MarkdownString } from '../../../../../../base/common/htmlContent.js';
import { Position } from '../../../../../../editor/common/core/position.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { Hover, HoverContext, HoverProvider } from '../../../../../../editor/common/languages.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { localize } from '../../../../../../nls.js';
import { ILanguageModelChatMetadata, ILanguageModelsService } from '../../languageModels.js';
import { ILanguageModelToolsService, ToolSet } from '../../languageModelToolsService.js';
import { IChatModeService, isBuiltinChatMode } from '../../chatModes.js';
import { getPromptsTypeForLanguageId, PromptsType } from '../promptTypes.js';
import { IPromptsService } from '../service/promptsService.js';
import { IHeaderAttribute, PromptBody, PromptHeader, PromptHeaderAttributes } from '../promptFileParser.js';
import { isGithubTarget } from './promptValidator.js';

export class PromptHoverProvider implements HoverProvider {
	/**
	 * Debug display name for this provider.
	 */
	public readonly _debugDisplayName: string = 'PromptHoverProvider';

	constructor(
		@IPromptsService private readonly promptsService: IPromptsService,
		@ILanguageModelToolsService private readonly languageModelToolsService: ILanguageModelToolsService,
		@ILanguageModelsService private readonly languageModelsService: ILanguageModelsService,
		@IChatModeService private readonly chatModeService: IChatModeService,
	) {
	}

	private createHover(contents: string, range: Range): Hover {
		return {
			contents: [new MarkdownString(contents)],
			range
		};
	}

	public async provideHover(model: ITextModel, position: Position, token: CancellationToken, _context?: HoverContext): Promise<Hover | undefined> {

		const promptType = getPromptsTypeForLanguageId(model.getLanguageId());
		if (!promptType) {
			// if the model is not a prompt, we don't provide any hovers
			return undefined;
		}

		const promptAST = this.promptsService.getParsedPromptFile(model);
		if (promptAST.header?.range.containsPosition(position)) {
			return this.provideHeaderHover(position, promptType, promptAST.header);
		}
		if (promptAST.body?.range.containsPosition(position)) {
			return this.provideBodyHover(position, promptAST.body);
		}
		return undefined;
	}

	private async provideBodyHover(position: Position, body: PromptBody): Promise<Hover | undefined> {
		for (const ref of body.variableReferences) {
			if (ref.range.containsPosition(position)) {
				const toolName = ref.name;
				return this.getToolHoverByName(toolName, ref.range);
			}
		}
		return undefined;
	}

	private async provideHeaderHover(position: Position, promptType: PromptsType, header: PromptHeader): Promise<Hover | undefined> {
		if (promptType === PromptsType.instructions) {
			for (const attribute of header.attributes) {
				if (attribute.range.containsPosition(position)) {
					switch (attribute.key) {
						case PromptHeaderAttributes.name:
							return this.createHover(localize('promptHeader.instructions.name', 'The name of the instruction file as shown in the UI. If not set, the name is derived from the file name.'), attribute.range);
						case PromptHeaderAttributes.description:
							return this.createHover(localize('promptHeader.instructions.description', 'The description of the instruction file. It can be used to provide additional context or information about the instructions and is passed to the language model as part of the prompt.'), attribute.range);
						case PromptHeaderAttributes.applyTo:
							return this.createHover(localize('promptHeader.instructions.applyToRange', 'One or more glob pattern (separated by comma) that describe for which files the instructions apply to. Based on these patterns, the file is automatically included in the prompt, when the context contains a file that matches one or more of these patterns. Use `**` when you want this file to always be added.\nExample: `**/*.ts`, `**/*.js`, `client/**`'), attribute.range);
					}
				}
			}
		} else if (promptType === PromptsType.agent) {
			const isGitHubTarget = isGithubTarget(promptType, header.target);
			for (const attribute of header.attributes) {
				if (attribute.range.containsPosition(position)) {
					switch (attribute.key) {
						case PromptHeaderAttributes.name:
							return this.createHover(localize('promptHeader.agent.name', 'The name of the agent as shown in the UI.'), attribute.range);
						case PromptHeaderAttributes.description:
							return this.createHover(localize('promptHeader.agent.description', 'The description of the custom agent, what it does and when to use it.'), attribute.range);
						case PromptHeaderAttributes.argumentHint:
							return this.createHover(localize('promptHeader.agent.argumentHint', 'The argument-hint describes what inputs the custom agent expects or supports.'), attribute.range);
						case PromptHeaderAttributes.model:
							return this.getModelHover(attribute, attribute.range, localize('promptHeader.agent.model', 'Specify the model that runs this custom agent.'), isGitHubTarget);
						case PromptHeaderAttributes.tools:
							return this.getToolHover(attribute, position, localize('promptHeader.agent.tools', 'The set of tools that the custom agent has access to.'));
						case PromptHeaderAttributes.handOffs:
							return this.getHandsOffHover(attribute, position, isGitHubTarget);
						case PromptHeaderAttributes.target:
							return this.createHover(localize('promptHeader.agent.target', 'The target to which the header attributes like tools apply to. Possible values are `github-copilot` and `vscode`.'), attribute.range);
						case PromptHeaderAttributes.infer:
							return this.createHover(localize('promptHeader.agent.infer', 'Whether the agent can be used as a subagent.'), attribute.range);
					}
				}
			}
		} else {
			for (const attribute of header.attributes) {
				if (attribute.range.containsPosition(position)) {
					switch (attribute.key) {
						case PromptHeaderAttributes.name:
							return this.createHover(localize('promptHeader.prompt.name', 'The name of the prompt. This is also the name of the slash command that will run this prompt.'), attribute.range);
						case PromptHeaderAttributes.description:
							return this.createHover(localize('promptHeader.prompt.description', 'The description of the reusable prompt, what it does and when to use it.'), attribute.range);
						case PromptHeaderAttributes.argumentHint:
							return this.createHover(localize('promptHeader.prompt.argumentHint', 'The argument-hint describes what inputs the prompt expects or supports.'), attribute.range);
						case PromptHeaderAttributes.model:
							return this.getModelHover(attribute, attribute.range, localize('promptHeader.prompt.model', 'The model to use in this prompt.'), false);
						case PromptHeaderAttributes.tools:
							return this.getToolHover(attribute, position, localize('promptHeader.prompt.tools', 'The tools to use in this prompt.'));
						case PromptHeaderAttributes.agent:
						case PromptHeaderAttributes.mode:
							return this.getAgentHover(attribute, position);
					}
				}
			}
		}
		return undefined;
	}

	private getToolHover(node: IHeaderAttribute, position: Position, baseMessage: string): Hover | undefined {
		if (node.value.type === 'array') {
			for (const toolName of node.value.items) {
				if (toolName.type === 'string' && toolName.range.containsPosition(position)) {
					const description = this.getToolHoverByName(toolName.value, toolName.range);
					if (description) {
						return description;
					}
				}
			}
		}
		return this.createHover(baseMessage, node.range);
	}

	private getToolHoverByName(toolName: string, range: Range): Hover | undefined {
		const tool = this.languageModelToolsService.getToolByFullReferenceName(toolName);
		if (tool !== undefined) {
			if (tool instanceof ToolSet) {
				return this.getToolsetHover(tool, range);
			} else {
				return this.createHover(tool.userDescription ?? tool.modelDescription, range);
			}
		}
		return undefined;
	}

	private getToolsetHover(toolSet: ToolSet, range: Range): Hover | undefined {
		const lines: string[] = [];
		lines.push(localize('toolSetName', 'ToolSet: {0}\n\n', toolSet.referenceName));
		if (toolSet.description) {
			lines.push(toolSet.description);
		}
		for (const tool of toolSet.getTools()) {
			lines.push(`- ${tool.toolReferenceName ?? tool.displayName}`);
		}
		return this.createHover(lines.join('\n'), range);
	}

	private getModelHover(node: IHeaderAttribute, range: Range, baseMessage: string, isGitHubTarget: boolean): Hover | undefined {
		if (isGitHubTarget) {
			return this.createHover(baseMessage + '\n\n' + localize('promptHeader.agent.model.githubCopilot', 'Note: This attribute is not used when target is github-copilot.'), range);
		}
		if (node.value.type === 'string') {
			for (const id of this.languageModelsService.getLanguageModelIds()) {
				const meta = this.languageModelsService.lookupLanguageModel(id);
				if (meta && ILanguageModelChatMetadata.matchesQualifiedName(node.value.value, meta)) {
					const lines: string[] = [];
					lines.push(baseMessage + '\n');
					lines.push(localize('modelName', '- Name: {0}', meta.name));
					lines.push(localize('modelFamily', '- Family: {0}', meta.family));
					lines.push(localize('modelVendor', '- Vendor: {0}', meta.vendor));
					if (meta.tooltip) {
						lines.push('', '', meta.tooltip);
					}
					return this.createHover(lines.join('\n'), range);
				}
			}
		}
		return this.createHover(baseMessage, range);
	}

	private getAgentHover(agentAttribute: IHeaderAttribute, position: Position): Hover | undefined {
		const lines: string[] = [];
		const value = agentAttribute.value;
		if (value.type === 'string' && value.range.containsPosition(position)) {
			const agent = this.chatModeService.findModeByName(value.value);
			if (agent) {
				const description = agent.description.get() || (isBuiltinChatMode(agent) ? localize('promptHeader.prompt.agent.builtInDesc', 'Built-in agent') : localize('promptHeader.prompt.agent.customDesc', 'Custom agent'));
				lines.push(`\`${agent.name.get()}\`: ${description}`);
			}
		} else {
			const agents = this.chatModeService.getModes();
			lines.push(localize('promptHeader.prompt.agent.description', 'The agent to use when running this prompt.'));
			lines.push('');

			// Built-in agents
			lines.push(localize('promptHeader.prompt.agent.builtin', '**Built-in agents:**'));
			for (const agent of agents.builtin) {
				lines.push(`- \`${agent.name.get()}\`: ${agent.description.get() || agent.label.get()}`);
			}

			// Custom agents
			if (agents.custom.length > 0) {
				lines.push('');
				lines.push(localize('promptHeader.prompt.agent.custom', '**Custom agents:**'));
				for (const agent of agents.custom) {
					const description = agent.description.get();
					lines.push(`- \`${agent.name.get()}\`: ${description || localize('promptHeader.prompt.agent.customDesc', 'Custom agent')}`);
				}
			}
		}
		return this.createHover(lines.join('\n'), agentAttribute.range);
	}

	private getHandsOffHover(attribute: IHeaderAttribute, position: Position, isGitHubTarget: boolean): Hover | undefined {
		const handoffsBaseMessage = localize('promptHeader.agent.handoffs', 'Possible handoff actions when the agent has completed its task.');
		if (isGitHubTarget) {
			return this.createHover(handoffsBaseMessage + '\n\n' + localize('promptHeader.agent.handoffs.githubCopilot', 'Note: This attribute is not used when target is github-copilot.'), attribute.range);
		}
		return this.createHover(handoffsBaseMessage, attribute.range);

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/promptLinkProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/common/promptSyntax/languageProviders/promptLinkProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IPromptsService } from '../service/promptsService.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { ILink, ILinksList, LinkProvider } from '../../../../../../editor/common/languages.js';

/**
 * Provides link references for prompt files.
 */
export class PromptLinkProvider implements LinkProvider {
	constructor(
		@IPromptsService private readonly promptsService: IPromptsService,
	) {
	}

	/**
	 * Provide list of links for the provided text model.
	 */
	public async provideLinks(model: ITextModel, token: CancellationToken): Promise<ILinksList | undefined> {
		const promptAST = this.promptsService.getParsedPromptFile(model);
		if (!promptAST.body) {
			return;
		}
		const links: ILink[] = [];
		for (const ref of promptAST.body.fileReferences) {
			if (!ref.isMarkdownLink) {
				const url = promptAST.body.resolveFilePath(ref.content);
				if (url) {
					links.push({ range: ref.range, url });
				}
			}
		}
		return { links };
	}
}
```

--------------------------------------------------------------------------------

````

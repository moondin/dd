---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 408
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 408 of 552)

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

---[FILE: src/vs/workbench/contrib/mcp/common/mcpSamplingService.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpSamplingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { asArray } from '../../../../base/common/arrays.js';
import { mapFindFirst } from '../../../../base/common/arraysFind.js';
import { Sequencer } from '../../../../base/common/async.js';
import { decodeBase64 } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { isDefined } from '../../../../base/common/types.js';
import { localize } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ConfigurationTarget, getConfigValueInTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { ChatImageMimeType, ChatMessageRole, IChatMessage, IChatMessagePart, ILanguageModelsService } from '../../chat/common/languageModels.js';
import { McpCommandIds } from './mcpCommandIds.js';
import { IMcpServerSamplingConfiguration, mcpServerSamplingSection } from './mcpConfiguration.js';
import { McpSamplingLog } from './mcpSamplingLog.js';
import { IMcpSamplingService, IMcpServer, ISamplingOptions, ISamplingResult, McpError } from './mcpTypes.js';
import { MCP } from './modelContextProtocol.js';

const enum ModelMatch {
	UnsureAllowedDuringChat,
	UnsureAllowedOutsideChat,
	NotAllowed,
	NoMatchingModel,
}

export class McpSamplingService extends Disposable implements IMcpSamplingService {
	declare readonly _serviceBrand: undefined;

	private readonly _sessionSets = {
		allowedDuringChat: new Map<string, boolean>(),
		allowedOutsideChat: new Map<string, boolean>(),
	};

	private readonly _logs: McpSamplingLog;

	private readonly _modelSequencer = new Sequencer();

	constructor(
		@ILanguageModelsService private readonly _languageModelsService: ILanguageModelsService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IDialogService private readonly _dialogService: IDialogService,
		@INotificationService private readonly _notificationService: INotificationService,
		@ICommandService private readonly _commandService: ICommandService,
		@IInstantiationService instaService: IInstantiationService,
	) {
		super();
		this._logs = this._register(instaService.createInstance(McpSamplingLog));
	}

	async sample(opts: ISamplingOptions, token = CancellationToken.None): Promise<ISamplingResult> {
		const messages = opts.params.messages.map((message): IChatMessage | undefined => {
			const content: IChatMessagePart[] = asArray(message.content).map((part): IChatMessagePart | undefined => part.type === 'text'
				? { type: 'text', value: part.text }
				: part.type === 'image' || part.type === 'audio'
					? { type: 'image_url', value: { mimeType: part.mimeType as ChatImageMimeType, data: decodeBase64(part.data) } }
					: undefined
			).filter(isDefined);

			if (!content.length) {
				return undefined;
			}
			return {
				role: message.role === 'assistant' ? ChatMessageRole.Assistant : ChatMessageRole.User,
				content,
			};
		}).filter(isDefined);

		if (opts.params.systemPrompt) {
			messages.unshift({ role: ChatMessageRole.System, content: [{ type: 'text', value: opts.params.systemPrompt }] });
		}

		const model = await this._modelSequencer.queue(() => this._getMatchingModel(opts));
		// todo@connor4312: nullExtensionDescription.identifier -> undefined with API update
		const response = await this._languageModelsService.sendChatRequest(model, new ExtensionIdentifier('core'), messages, {}, token);

		let responseText = '';

		// MCP doesn't have a notion of a multi-part sampling response, so we only preserve text
		// Ref https://github.com/modelcontextprotocol/modelcontextprotocol/issues/91
		const streaming = (async () => {
			for await (const part of response.stream) {
				if (Array.isArray(part)) {
					for (const p of part) {
						if (p.type === 'text') {
							responseText += p.value;
						}
					}
				} else if (part.type === 'text') {
					responseText += part.value;
				}
			}
		})();

		try {
			await Promise.all([response.result, streaming]);
			this._logs.add(opts.server, opts.params.messages, responseText, model);
			return {
				sample: {
					model,
					content: { type: 'text', text: responseText },
					role: 'assistant', // it came from the model!
				},
			};
		} catch (err) {
			throw McpError.unknown(err);
		}
	}

	hasLogs(server: IMcpServer): boolean {
		return this._logs.has(server);
	}

	getLogText(server: IMcpServer): string {
		return this._logs.getAsText(server);
	}

	private async _getMatchingModel(opts: ISamplingOptions): Promise<string> {
		const model = await this._getMatchingModelInner(opts.server, opts.isDuringToolCall, opts.params.modelPreferences);

		if (model === ModelMatch.UnsureAllowedDuringChat) {
			const retry = await this._showContextual(
				opts.isDuringToolCall,
				localize('mcp.sampling.allowDuringChat.title', 'Allow MCP tools from "{0}" to make LLM requests?', opts.server.definition.label),
				localize('mcp.sampling.allowDuringChat.desc', 'The MCP server "{0}" has issued a request to make a language model call. Do you want to allow it to make requests during chat?', opts.server.definition.label),
				this.allowButtons(opts.server, 'allowedDuringChat')
			);
			if (retry) {
				return this._getMatchingModel(opts);
			}
			throw McpError.notAllowed();
		} else if (model === ModelMatch.UnsureAllowedOutsideChat) {
			const retry = await this._showContextual(
				opts.isDuringToolCall,
				localize('mcp.sampling.allowOutsideChat.title', 'Allow MCP server "{0}" to make LLM requests?', opts.server.definition.label),
				localize('mcp.sampling.allowOutsideChat.desc', 'The MCP server "{0}" has issued a request to make a language model call. Do you want to allow it to make requests, outside of tool calls during chat?', opts.server.definition.label),
				this.allowButtons(opts.server, 'allowedOutsideChat')
			);
			if (retry) {
				return this._getMatchingModel(opts);
			}
			throw McpError.notAllowed();
		} else if (model === ModelMatch.NotAllowed) {
			throw McpError.notAllowed();
		} else if (model === ModelMatch.NoMatchingModel) {
			const newlyPickedModels = opts.isDuringToolCall
				? await this._commandService.executeCommand<number>(McpCommandIds.ConfigureSamplingModels, opts.server)
				: await this._notify(
					localize('mcp.sampling.needsModels', 'MCP server "{0}" triggered a language model request, but it has no allowlisted models.', opts.server.definition.label),
					{
						[localize('configure', 'Configure')]: () => this._commandService.executeCommand<number>(McpCommandIds.ConfigureSamplingModels, opts.server),
						[localize('cancel', 'Cancel')]: () => Promise.resolve(undefined),
					}
				);
			if (newlyPickedModels) {
				return this._getMatchingModel(opts);
			}
			throw McpError.notAllowed();
		}

		return model;
	}

	private allowButtons(server: IMcpServer, key: 'allowedDuringChat' | 'allowedOutsideChat') {
		return {
			[localize('mcp.sampling.allow.inSession', 'Allow in this Session')]: async () => {
				this._sessionSets[key].set(server.definition.id, true);
				return true;
			},
			[localize('mcp.sampling.allow.always', 'Always')]: async () => {
				await this.updateConfig(server, c => c[key] = true);
				return true;
			},
			[localize('mcp.sampling.allow.notNow', 'Not Now')]: async () => {
				this._sessionSets[key].set(server.definition.id, false);
				return false;
			},
			[localize('mcp.sampling.allow.never', 'Never')]: async () => {
				await this.updateConfig(server, c => c[key] = false);
				return false;
			},
		};
	}

	private async _showContextual<T>(isDuringToolCall: boolean, title: string, message: string, buttons: Record<string, () => T>): Promise<Awaited<T> | undefined> {
		if (isDuringToolCall) {
			const result = await this._dialogService.prompt({
				type: 'question',
				title: title,
				message,
				buttons: Object.entries(buttons).map(([label, run]) => ({ label, run })),
			});
			return await result.result;
		} else {
			return await this._notify(message, buttons);
		}
	}

	private async _notify<T>(message: string, buttons: Record<string, () => T>): Promise<Awaited<T> | undefined> {
		return await new Promise<T | undefined>(resolve => {
			const handle = this._notificationService.prompt(
				Severity.Info,
				message,
				Object.entries(buttons).map(([label, action]) => ({
					label,
					run: () => resolve(action()),
				}))
			);
			Event.once(handle.onDidClose)(() => resolve(undefined));
		});
	}

	/**
	 * Gets the matching model for the MCP server in this context, or
	 * a reason why no model could be selected.
	 */
	private async _getMatchingModelInner(server: IMcpServer, isDuringToolCall: boolean, preferences: MCP.ModelPreferences | undefined): Promise<ModelMatch | string> {
		const config = this.getConfig(server);
		// 1. Ensure the server is allowed to sample in this context
		if (isDuringToolCall && !config.allowedDuringChat && !this._sessionSets.allowedDuringChat.has(server.definition.id)) {
			return config.allowedDuringChat === undefined ? ModelMatch.UnsureAllowedDuringChat : ModelMatch.NotAllowed;
		} else if (!isDuringToolCall && !config.allowedOutsideChat && !this._sessionSets.allowedOutsideChat.has(server.definition.id)) {
			return config.allowedOutsideChat === undefined ? ModelMatch.UnsureAllowedOutsideChat : ModelMatch.NotAllowed;
		}

		// 2. Get the configured models, or the default model(s)
		const foundModelIdsDeep = config.allowedModels?.filter(m => !!this._languageModelsService.lookupLanguageModel(m)) || this._languageModelsService.getLanguageModelIds().filter(m => this._languageModelsService.lookupLanguageModel(m)?.isDefault);

		const foundModelIds = foundModelIdsDeep.flat().sort((a, b) => b.length - a.length); // Sort by length to prefer most specific

		if (!foundModelIds.length) {
			return ModelMatch.NoMatchingModel;
		}

		// 3. If preferences are provided, try to match them from the allowed models
		if (preferences?.hints) {
			const found = mapFindFirst(preferences.hints, hint => foundModelIds.find(model => model.toLowerCase().includes(hint.name!.toLowerCase())));
			if (found) {
				return found;
			}
		}

		return foundModelIds[0]; // Return the first matching model
	}

	private _configKey(server: IMcpServer) {
		return `${server.collection.label}: ${server.definition.label}`;
	}

	public getConfig(server: IMcpServer): IMcpServerSamplingConfiguration {
		return this._getConfig(server).value || {};
	}

	/**
	 * _getConfig reads the sampling config reads the `{ server: data }` mapping
	 * from the appropriate config. We read from the most specific possible
	 * config up to the default configuration location that the MCP server itself
	 * is defined in. We don't go further because then workspace-specific servers
	 * would get in the user settings which is not meaningful and could lead
	 * to confusion.
	 *
	 * todo@connor4312: generalize this for other esttings when we have them
	 */
	private _getConfig(server: IMcpServer) {
		const def = server.readDefinitions().get();
		const mostSpecificConfig = ConfigurationTarget.MEMORY;
		const leastSpecificConfig = def.collection?.configTarget || ConfigurationTarget.USER;
		const key = this._configKey(server);
		const resource = def.collection?.presentation?.origin;

		const configValue = this._configurationService.inspect<Record<string, IMcpServerSamplingConfiguration>>(mcpServerSamplingSection, { resource });
		for (let target = mostSpecificConfig; target >= leastSpecificConfig; target--) {
			const mapping = getConfigValueInTarget(configValue, target);
			const config = mapping?.[key];
			if (config) {
				return { value: config, key, mapping, target, resource };
			}
		}

		return { value: undefined, mapping: getConfigValueInTarget(configValue, leastSpecificConfig), key, target: leastSpecificConfig, resource };
	}

	public async updateConfig(server: IMcpServer, mutate: (r: IMcpServerSamplingConfiguration) => unknown) {
		const { value, mapping, key, target, resource } = this._getConfig(server);

		const newConfig = { ...value };
		mutate(newConfig);

		await this._configurationService.updateValue(
			mcpServerSamplingSection,
			{ ...mapping, [key]: newConfig },
			{ resource },
			target,
		);
		return newConfig;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpServer.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AsyncIterableProducer, raceCancellationError, Sequencer } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Iterable } from '../../../../base/common/iterator.js';
import * as json from '../../../../base/common/json.js';
import { normalizeDriveLetter } from '../../../../base/common/labels.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { LRUCache } from '../../../../base/common/map.js';
import { Schemas } from '../../../../base/common/network.js';
import { mapValues } from '../../../../base/common/objects.js';
import { autorun, autorunSelfDisposable, derived, disposableObservableValue, IDerivedReader, IObservable, IReader, ITransaction, observableFromEvent, ObservablePromise, observableValue, transaction } from '../../../../base/common/observable.js';
import { basename } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { createURITransformer } from '../../../../base/common/uriTransformer.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { localize } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogger, ILoggerService } from '../../../../platform/log/common/log.js';
import { INotificationService, IPromptChoice, Severity } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IOutputService } from '../../../services/output/common/output.js';
import { ToolProgress } from '../../chat/common/languageModelToolsService.js';
import { mcpActivationEvent } from './mcpConfiguration.js';
import { McpDevModeServerAttache } from './mcpDevMode.js';
import { McpIcons, parseAndValidateMcpIcon, StoredMcpIcons } from './mcpIcons.js';
import { IMcpRegistry } from './mcpRegistryTypes.js';
import { McpServerRequestHandler } from './mcpServerRequestHandler.js';
import { McpTaskManager } from './mcpTaskManager.js';
import { ElicitationKind, extensionMcpCollectionPrefix, IMcpElicitationService, IMcpIcons, IMcpPrompt, IMcpPromptMessage, IMcpResource, IMcpResourceTemplate, IMcpSamplingService, IMcpServer, IMcpServerConnection, IMcpServerStartOpts, IMcpTool, IMcpToolCallContext, McpCapability, McpCollectionDefinition, McpCollectionReference, McpConnectionFailedError, McpConnectionState, McpDefinitionReference, mcpPromptReplaceSpecialChars, McpResourceURI, McpServerCacheState, McpServerDefinition, McpServerStaticToolAvailability, McpServerTransportType, McpToolName, MpcResponseError, UserInteractionRequiredError } from './mcpTypes.js';
import { MCP } from './modelContextProtocol.js';
import { UriTemplate } from './uriTemplate.js';

type ServerBootData = {
	supportsLogging: boolean;
	supportsPrompts: boolean;
	supportsResources: boolean;
	toolCount: number;
	serverName: string;
	serverVersion: string;
};
type ServerBootClassification = {
	owner: 'connor4312';
	comment: 'Details the capabilities of the MCP server';
	supportsLogging: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether the server supports logging' };
	supportsPrompts: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether the server supports prompts' };
	supportsResources: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether the server supports resource' };
	toolCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The number of tools the server advertises' };
	serverName: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The name of the MCP server' };
	serverVersion: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The version of the MCP server' };
};

type ElicitationTelemetryData = {
	serverName: string;
	serverVersion: string;
};

type ElicitationTelemetryClassification = {
	owner: 'connor4312';
	comment: 'Triggered when elictation is requested';
	serverName: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The name of the MCP server' };
	serverVersion: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The version of the MCP server' };
};

export type McpServerInstallData = {
	serverName: string;
	source: 'gallery' | 'local';
	scope: string;
	success: boolean;
	error?: string;
	hasInputs: boolean;
};

export type McpServerInstallClassification = {
	owner: 'connor4312';
	comment: 'MCP server installation event tracking';
	serverName: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The name of the MCP server being installed' };
	source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Installation source (gallery or local)' };
	scope: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Installation scope (user, workspace, etc.)' };
	success: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether installation succeeded' };
	error?: { classification: 'CallstackOrException'; purpose: 'FeatureInsight'; comment: 'Error message if installation failed' };
	hasInputs: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Whether the server requires input configuration' };
};

type ServerBootState = {
	state: string;
	time: number;
};
type ServerBootStateClassification = {
	owner: 'connor4312';
	comment: 'Details the capabilities of the MCP server';
	state: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The server outcome' };
	time: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Duration in milliseconds to reach that state' };
};

type StoredMcpPrompt = MCP.Prompt & { _icons: StoredMcpIcons };

interface IToolCacheEntry {
	readonly serverName: string | undefined;
	readonly serverInstructions: string | undefined;
	readonly serverIcons: StoredMcpIcons;

	readonly trustedAtNonce: string | undefined;

	readonly nonce: string | undefined;
	/** Cached tools so we can show what's available before it's started */
	readonly tools: readonly ValidatedMcpTool[];
	/** Cached prompts */
	readonly prompts: readonly StoredMcpPrompt[] | undefined;
	/** Cached capabilities */
	readonly capabilities: McpCapability | undefined;
}

const emptyToolEntry: IToolCacheEntry = {
	serverName: undefined,
	serverIcons: [],
	serverInstructions: undefined,
	trustedAtNonce: undefined,
	nonce: undefined,
	tools: [],
	prompts: undefined,
	capabilities: undefined,
};

interface IServerCacheEntry {
	readonly servers: readonly McpServerDefinition.Serialized[];
}

const toolInvalidCharRe = /[^a-z0-9_-]/gi;

export class McpServerMetadataCache extends Disposable {
	private didChange = false;
	private readonly cache = new LRUCache<string, IToolCacheEntry>(128);
	private readonly extensionServers = new Map</* collection ID */string, IServerCacheEntry>();

	constructor(
		scope: StorageScope,
		@IStorageService storageService: IStorageService,
	) {
		super();

		type StoredType = {
			extensionServers: [string, IServerCacheEntry][];
			serverTools: [string, IToolCacheEntry][];
		};

		const storageKey = 'mcpToolCache';
		this._register(storageService.onWillSaveState(() => {
			if (this.didChange) {
				storageService.store(storageKey, {
					extensionServers: [...this.extensionServers],
					serverTools: this.cache.toJSON(),
				} satisfies StoredType, scope, StorageTarget.MACHINE);
				this.didChange = false;
			}
		}));

		try {
			const cached: StoredType | undefined = storageService.getObject(storageKey, scope);
			this.extensionServers = new Map(cached?.extensionServers ?? []);
			cached?.serverTools?.forEach(([k, v]) => this.cache.set(k, v));
		} catch {
			// ignored
		}
	}

	/** Resets the cache for primitives and extension servers */
	reset() {
		this.cache.clear();
		this.extensionServers.clear();
		this.didChange = true;
	}

	/** Gets cached primitives for a server (used before a server is running) */
	get(definitionId: string) {
		return this.cache.get(definitionId);
	}

	/** Sets cached primitives for a server */
	store(definitionId: string, entry: Partial<IToolCacheEntry>): void {
		const prev = this.get(definitionId) || emptyToolEntry;
		this.cache.set(definitionId, { ...prev, ...entry });
		this.didChange = true;
	}

	/** Gets cached servers for a collection (used for extensions, before the extension activates) */
	getServers(collectionId: string) {
		return this.extensionServers.get(collectionId);
	}

	/** Sets cached servers for a collection */
	storeServers(collectionId: string, entry: IServerCacheEntry | undefined): void {
		if (entry) {
			this.extensionServers.set(collectionId, entry);
		} else {
			this.extensionServers.delete(collectionId);
		}
		this.didChange = true;
	}
}

type ValidatedMcpTool = MCP.Tool & {
	_icons: StoredMcpIcons;

	/**
	 * Tool name as published by the MCP server. This may
	 * be different than the one in {@link definition} due to name normalization
	 * in {@link McpServer._getValidatedTools}.
	 */
	serverToolName: string;
};

interface StoredServerMetadata {
	readonly serverName: string | undefined;
	readonly serverInstructions: string | undefined;
	readonly serverIcons: StoredMcpIcons | undefined;
}

interface ServerMetadata {
	readonly serverName: string | undefined;
	readonly serverInstructions: string | undefined;
	readonly icons: IMcpIcons;
}

class CachedPrimitive<T, C> {
	/**
	 * @param _definitionId Server definition ID
	 * @param _cache Metadata cache instance
	 * @param _fromStaticDefinition Static definition that came with the server.
	 * This should ONLY have a value if it should be used instead of whatever
	 * is currently in the cache.
	 * @param _fromCache Pull the value from the cache entry.
	 * @param _toT Transform the value to the observable type.
	 * @param defaultValue Default value if no cache entry.
	 */
	constructor(
		private readonly _definitionId: string,
		private readonly _cache: McpServerMetadataCache,
		private readonly _fromStaticDefinition: IObservable<C | undefined> | undefined,
		private readonly _fromCache: (entry: IToolCacheEntry) => C,
		private readonly _toT: (values: C, reader: IDerivedReader<void>) => T,
		private readonly defaultValue: C,
	) { }

	public get fromCache(): { nonce: string | undefined; data: C } | undefined {
		const c = this._cache.get(this._definitionId);
		return c ? { data: this._fromCache(c), nonce: c.nonce } : undefined;
	}

	public hasStaticDefinition(reader: IReader | undefined) {
		return !!this._fromStaticDefinition?.read(reader);
	}

	public readonly fromServerPromise = observableValue<ObservablePromise<{
		readonly data: C;
		readonly nonce: string | undefined;
	}> | undefined>(this, undefined);

	private readonly fromServer = derived(reader => this.fromServerPromise.read(reader)?.promiseResult.read(reader)?.data);

	public readonly value: IObservable<T> = derived(reader => {
		const serverTools = this.fromServer.read(reader);
		const definitions = serverTools?.data ?? this._fromStaticDefinition?.read(reader) ?? this.fromCache?.data ?? this.defaultValue;
		return this._toT(definitions, reader);
	});
}

export class McpServer extends Disposable implements IMcpServer {
	/** Shared task manager that survives reconnections */
	private readonly _taskManager = this._register(new McpTaskManager());

	/**
	 * Helper function to call the function on the handler once it's online. The
	 * connection started if it is not already.
	 */
	public static async callOn<R>(server: IMcpServer, fn: (handler: McpServerRequestHandler) => Promise<R>, token: CancellationToken = CancellationToken.None): Promise<R> {
		await server.start({ promptType: 'all-untrusted' }); // idempotent

		let ranOnce = false;
		let d: IDisposable;

		const callPromise = new Promise<R>((resolve, reject) => {

			d = autorun(reader => {
				const connection = server.connection.read(reader);
				if (!connection || ranOnce) {
					return;
				}

				const handler = connection.handler.read(reader);
				if (!handler) {
					const state = connection.state.read(reader);
					if (state.state === McpConnectionState.Kind.Error) {
						reject(new McpConnectionFailedError(`MCP server could not be started: ${state.message}`));
						return;
					} else if (state.state === McpConnectionState.Kind.Stopped) {
						reject(new McpConnectionFailedError('MCP server has stopped'));
						return;
					} else {
						// keep waiting for handler
						return;
					}
				}

				resolve(fn(handler));
				ranOnce = true; // aggressive prevent multiple racey calls, don't dispose because autorun is sync
			});
		});

		return raceCancellationError(callPromise, token).finally(() => d.dispose());
	}

	public readonly collection: McpCollectionReference;
	private readonly _connectionSequencer = new Sequencer();
	private readonly _connection = this._register(disposableObservableValue<IMcpServerConnection | undefined>(this, undefined));

	public readonly connection = this._connection;
	public readonly connectionState: IObservable<McpConnectionState> = derived(reader => this._connection.read(reader)?.state.read(reader) ?? { state: McpConnectionState.Kind.Stopped });


	private readonly _capabilities: CachedPrimitive<number | undefined, number | undefined>;
	public get capabilities() {
		return this._capabilities.value;
	}

	private readonly _tools: CachedPrimitive<readonly IMcpTool[], readonly ValidatedMcpTool[]>;
	public get tools() {
		return this._tools.value;
	}

	private readonly _prompts: CachedPrimitive<readonly IMcpPrompt[], readonly StoredMcpPrompt[]>;
	public get prompts() {
		return this._prompts.value;
	}

	private readonly _serverMetadata: CachedPrimitive<ServerMetadata, StoredServerMetadata | undefined>;
	public get serverMetadata() {
		return this._serverMetadata.value;
	}

	public get trustedAtNonce() {
		return this._primitiveCache.get(this.definition.id)?.trustedAtNonce;
	}

	public set trustedAtNonce(nonce: string | undefined) {
		this._primitiveCache.store(this.definition.id, { trustedAtNonce: nonce });
	}

	private readonly _fullDefinitions: IObservable<{
		server: McpServerDefinition | undefined;
		collection: McpCollectionDefinition | undefined;
	}>;

	public readonly cacheState = derived(reader => {
		const currentNonce = () => this._fullDefinitions.read(reader)?.server?.cacheNonce;
		const stateWhenServingFromCache = () => {
			if (this._tools.hasStaticDefinition(reader)) {
				return McpServerCacheState.Cached;
			}

			if (!this._tools.fromCache) {
				return McpServerCacheState.Unknown;
			}

			return currentNonce() === this._tools.fromCache.nonce ? McpServerCacheState.Cached : McpServerCacheState.Outdated;
		};

		const fromServer = this._tools.fromServerPromise.read(reader);
		const connectionState = this.connectionState.read(reader);
		const isIdle = McpConnectionState.canBeStarted(connectionState.state) || !fromServer;
		if (isIdle) {
			return stateWhenServingFromCache();
		}

		const fromServerResult = fromServer?.promiseResult.read(reader);
		if (!fromServerResult) {
			return this._tools.fromCache ? McpServerCacheState.RefreshingFromCached : McpServerCacheState.RefreshingFromUnknown;
		}

		if (fromServerResult.error) {
			return stateWhenServingFromCache();
		}

		return fromServerResult.data?.nonce === currentNonce() ? McpServerCacheState.Live : McpServerCacheState.Outdated;
	});

	private readonly _loggerId: string;
	private readonly _logger: ILogger;
	private _lastModeDebugged = false;
	/** Count of running tool calls, used to detect if sampling is during an LM call */
	public runningToolCalls = new Set<IMcpToolCallContext>();

	constructor(
		initialCollection: McpCollectionDefinition,
		public readonly definition: McpDefinitionReference,
		explicitRoots: URI[] | undefined,
		private readonly _requiresExtensionActivation: boolean | undefined,
		private readonly _primitiveCache: McpServerMetadataCache,
		toolPrefix: string,
		@IMcpRegistry private readonly _mcpRegistry: IMcpRegistry,
		@IWorkspaceContextService workspacesService: IWorkspaceContextService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@ILoggerService private readonly _loggerService: ILoggerService,
		@IOutputService private readonly _outputService: IOutputService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ICommandService private readonly _commandService: ICommandService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IOpenerService private readonly _openerService: IOpenerService,
		@IMcpSamplingService private readonly _samplingService: IMcpSamplingService,
		@IMcpElicitationService private readonly _elicitationService: IMcpElicitationService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
	) {
		super();

		this.collection = initialCollection;
		this._fullDefinitions = this._mcpRegistry.getServerDefinition(this.collection, this.definition);
		this._loggerId = `mcpServer.${definition.id}`;
		this._logger = this._register(_loggerService.createLogger(this._loggerId, { hidden: true, name: `MCP: ${definition.label}` }));

		const that = this;
		this._register(this._instantiationService.createInstance(McpDevModeServerAttache, this, { get lastModeDebugged() { return that._lastModeDebugged; } }));

		// If the logger is disposed but not deregistered, then the disposed instance
		// is reused and no-ops. todo@sandy081 this seems like a bug.
		this._register(toDisposable(() => _loggerService.deregisterLogger(this._loggerId)));

		// 1. Reflect workspaces into the MCP roots
		const workspaces = explicitRoots
			? observableValue(this, explicitRoots.map(uri => ({ uri, name: basename(uri) })))
			: observableFromEvent(
				this,
				workspacesService.onDidChangeWorkspaceFolders,
				() => workspacesService.getWorkspace().folders,
			);

		const uriTransformer = environmentService.remoteAuthority ? createURITransformer(environmentService.remoteAuthority) : undefined;

		this._register(autorun(reader => {
			const cnx = this._connection.read(reader)?.handler.read(reader);
			if (!cnx) {
				return;
			}

			cnx.roots = workspaces.read(reader)
				.filter(w => w.uri.authority === (initialCollection.remoteAuthority || ''))
				.map(w => {
					let uri = URI.from(uriTransformer?.transformIncoming(w.uri) ?? w.uri);
					if (uri.scheme === Schemas.file) { // #271812
						uri = URI.file(normalizeDriveLetter(uri.fsPath, true));
					}

					return { name: w.name, uri: uri.toString() };
				});
		}));

		// 2. Populate this.tools when we connect to a server.
		this._register(autorun(reader => {
			const cnx = this._connection.read(reader);
			const handler = cnx?.handler.read(reader);
			if (handler) {
				this._populateLiveData(handler, cnx?.definition.cacheNonce, reader.store);
			} else if (this._tools) {
				this.resetLiveData();
			}
		}));

		const staticMetadata = derived(reader => {
			const def = this._fullDefinitions.read(reader).server;
			return def && def.cacheNonce !== this._tools.fromCache?.nonce ? def.staticMetadata : undefined;
		});

		// 3. Publish tools
		this._tools = new CachedPrimitive<readonly IMcpTool[], readonly ValidatedMcpTool[]>(
			this.definition.id,
			this._primitiveCache,
			staticMetadata
				.map(m => {
					const tools = m?.tools?.filter(t => t.availability === McpServerStaticToolAvailability.Initial).map(t => t.definition);
					return tools?.length ? new ObservablePromise(this._getValidatedTools(tools)) : undefined;
				})
				.map((o, reader) => o?.promiseResult.read(reader)?.data),
			(entry) => entry.tools,
			(entry) => entry.map(def => this._instantiationService.createInstance(McpTool, this, toolPrefix, def)).sort((a, b) => a.compare(b)),
			[],
		);

		// 4. Publish prompts
		this._prompts = new CachedPrimitive<readonly IMcpPrompt[], readonly StoredMcpPrompt[]>(
			this.definition.id,
			this._primitiveCache,
			undefined,
			(entry) => entry.prompts || [],
			(entry) => entry.map(e => new McpPrompt(this, e)),
			[],
		);

		this._serverMetadata = new CachedPrimitive<ServerMetadata, StoredServerMetadata | undefined>(
			this.definition.id,
			this._primitiveCache,
			staticMetadata.map(m => m ? this._toStoredMetadata(m?.serverInfo, m?.instructions) : undefined),
			(entry) => ({ serverName: entry.serverName, serverInstructions: entry.serverInstructions, serverIcons: entry.serverIcons }),
			(entry) => ({ serverName: entry?.serverName, serverInstructions: entry?.serverInstructions, icons: McpIcons.fromStored(entry?.serverIcons) }),
			undefined,
		);

		this._capabilities = new CachedPrimitive<number | undefined, number | undefined>(
			this.definition.id,
			this._primitiveCache,
			staticMetadata.map(m => m?.capabilities !== undefined ? encodeCapabilities(m.capabilities) : undefined),
			(entry) => entry.capabilities,
			(entry) => entry,
			undefined,
		);
	}

	public readDefinitions(): IObservable<{ server: McpServerDefinition | undefined; collection: McpCollectionDefinition | undefined }> {
		return this._fullDefinitions;
	}

	public showOutput(preserveFocus?: boolean) {
		this._loggerService.setVisibility(this._loggerId, true);
		return this._outputService.showChannel(this._loggerId, preserveFocus);
	}

	public resources(token?: CancellationToken): AsyncIterable<IMcpResource[]> {
		const cts = new CancellationTokenSource(token);
		return new AsyncIterableProducer<IMcpResource[]>(async emitter => {
			await McpServer.callOn(this, async (handler) => {
				for await (const resource of handler.listResourcesIterable({}, cts.token)) {
					emitter.emitOne(resource.map(r => new McpResource(this, r, McpIcons.fromParsed(this._parseIcons(r)))));
					if (cts.token.isCancellationRequested) {
						return;
					}
				}
			});
		}, () => cts.dispose(true));
	}

	public resourceTemplates(token?: CancellationToken): Promise<IMcpResourceTemplate[]> {
		return McpServer.callOn(this, async (handler) => {
			const templates = await handler.listResourceTemplates({}, token);
			return templates.map(t => new McpResourceTemplate(this, t, McpIcons.fromParsed(this._parseIcons(t))));
		}, token);
	}

	public start({ interaction, autoTrustChanges, promptType, debug, errorOnUserInteraction }: IMcpServerStartOpts = {}): Promise<McpConnectionState> {
		interaction?.participants.set(this.definition.id, { s: 'unknown' });

		return this._connectionSequencer.queue<McpConnectionState>(async () => {
			const activationEvent = mcpActivationEvent(this.collection.id.slice(extensionMcpCollectionPrefix.length));
			if (this._requiresExtensionActivation && !this._extensionService.activationEventIsDone(activationEvent)) {
				await this._extensionService.activateByEvent(activationEvent);
				await Promise.all(this._mcpRegistry.delegates.get()
					.map(r => r.waitForInitialProviderPromises()));
				// This can happen if the server was created from a cached MCP server seen
				// from an extension, but then it wasn't registered when the extension activated.
				if (this._store.isDisposed) {
					return { state: McpConnectionState.Kind.Stopped };
				}
			}

			let connection = this._connection.get();
			if (connection && McpConnectionState.canBeStarted(connection.state.get().state)) {
				connection.dispose();
				connection = undefined;
				this._connection.set(connection, undefined);
			}

			if (!connection) {
				this._lastModeDebugged = !!debug;
				const that = this;
				connection = await this._mcpRegistry.resolveConnection({
					interaction,
					autoTrustChanges,
					promptType,
					trustNonceBearer: {
						get trustedAtNonce() { return that.trustedAtNonce; },
						set trustedAtNonce(nonce: string | undefined) { that.trustedAtNonce = nonce; }
					},
					logger: this._logger,
					collectionRef: this.collection,
					definitionRef: this.definition,
					debug,
					errorOnUserInteraction,
					taskManager: this._taskManager,
				});
				if (!connection) {
					return { state: McpConnectionState.Kind.Stopped };
				}

				if (this._store.isDisposed) {
					connection.dispose();
					return { state: McpConnectionState.Kind.Stopped };
				}

				this._connection.set(connection, undefined);

				if (connection.definition.devMode) {
					this.showOutput();
				}
			}

			const start = Date.now();
			let state = await connection.start({
				createMessageRequestHandler: (params, token) => this._samplingService.sample({
					isDuringToolCall: this.runningToolCalls.size > 0,
					server: this,
					params,
				}, token).then(r => r.sample),
				elicitationRequestHandler: async (req, token) => {
					const serverInfo = connection.handler.get()?.serverInfo;
					if (serverInfo) {
						this._telemetryService.publicLog2<ElicitationTelemetryData, ElicitationTelemetryClassification>('mcp.elicitationRequested', {
							serverName: serverInfo.name,
							serverVersion: serverInfo.version,
						});
					}

					const r = await this._elicitationService.elicit(this, Iterable.first(this.runningToolCalls), req, token || CancellationToken.None);
					r.dispose();
					return r.value;
				}
			});

			this._telemetryService.publicLog2<ServerBootState, ServerBootStateClassification>('mcp/serverBootState', {
				state: McpConnectionState.toKindString(state.state),
				time: Date.now() - start,
			});

			if (state.state === McpConnectionState.Kind.Error) {
				this.showInteractiveError(connection, state, debug);
			}

			// MCP servers that need auth can 'start' but will stop with an interaction-needed
			// error they first make a request. In this case, wait until the handler fully
			// initializes before resolving (throwing if it ends up needing auth)
			if (errorOnUserInteraction && state.state === McpConnectionState.Kind.Running) {
				let disposable: IDisposable;
				state = await new Promise<McpConnectionState>((resolve, reject) => {
					disposable = autorun(reader => {
						const handler = connection.handler.read(reader);
						if (handler) {
							resolve(state);
						}

						const s = connection.state.read(reader);
						if (s.state === McpConnectionState.Kind.Stopped && s.reason === 'needs-user-interaction') {
							reject(new UserInteractionRequiredError('auth'));
						}

						if (!McpConnectionState.isRunning(s)) {
							resolve(s);
						}
					});
				}).finally(() => disposable.dispose());
			}

			return state;
		}).finally(() => {
			interaction?.participants.set(this.definition.id, { s: 'resolved' });
		});
	}

	private showInteractiveError(cnx: IMcpServerConnection, error: McpConnectionState.Error, debug?: boolean) {
		if (error.code === 'ENOENT' && cnx.launchDefinition.type === McpServerTransportType.Stdio) {
			let docsLink: string | undefined;
			switch (cnx.launchDefinition.command) {
				case 'uvx':
					docsLink = `https://aka.ms/vscode-mcp-install/uvx`;
					break;
				case 'npx':
					docsLink = `https://aka.ms/vscode-mcp-install/npx`;
					break;
				case 'dnx':
					docsLink = `https://aka.ms/vscode-mcp-install/dnx`;
					break;
				case 'dotnet':
					docsLink = `https://aka.ms/vscode-mcp-install/dotnet`;
					break;
			}

			const options: IPromptChoice[] = [{
				label: localize('mcp.command.showOutput', "Show Output"),
				run: () => this.showOutput(),
			}];

			if (cnx.definition.devMode?.debug?.type === 'debugpy' && debug) {
				this._notificationService.prompt(Severity.Error, localize('mcpDebugPyHelp', 'The command "{0}" was not found. You can specify the path to debugpy in the `dev.debug.debugpyPath` option.', cnx.launchDefinition.command, cnx.definition.label), [...options, {
					label: localize('mcpViewDocs', 'View Docs'),
					run: () => this._openerService.open(URI.parse('https://aka.ms/vscode-mcp-install/debugpy')),
				}]);
				return;
			}

			if (docsLink) {
				options.push({
					label: localize('mcpServerInstall', 'Install {0}', cnx.launchDefinition.command),
					run: () => this._openerService.open(URI.parse(docsLink)),
				});
			}

			this._notificationService.prompt(Severity.Error, localize('mcpServerNotFound', 'The command "{0}" needed to run {1} was not found.', cnx.launchDefinition.command, cnx.definition.label), options);
		} else {
			this._notificationService.warn(localize('mcpServerError', 'The MCP server {0} could not be started: {1}', cnx.definition.label, error.message));
		}
	}

	public stop(): Promise<void> {
		return this._connection.get()?.stop() || Promise.resolve();
	}

	/** Waits for any ongoing tools to be refreshed before resolving. */
	public awaitToolRefresh() {
		return new Promise<void>(resolve => {
			autorunSelfDisposable(reader => {
				const promise = this._tools.fromServerPromise.read(reader);
				const result = promise?.promiseResult.read(reader);
				if (result) {
					resolve();
				}
			});
		});
	}

	private resetLiveData() {
		transaction(tx => {
			this._tools.fromServerPromise.set(undefined, tx);
			this._prompts.fromServerPromise.set(undefined, tx);
		});
	}

	private async _normalizeTool(originalTool: MCP.Tool): Promise<ValidatedMcpTool | { error: string[] }> {
		const tool: ValidatedMcpTool = {
			...originalTool,
			serverToolName: originalTool.name,
			_icons: this._parseIcons(originalTool),
		};
		if (!tool.description) {
			// Ensure a description is provided for each tool, #243919
			this._logger.warn(`Tool ${tool.name} does not have a description. Tools must be accurately described to be called`);
			tool.description = '<empty>';
		}

		if (toolInvalidCharRe.test(tool.name)) {
			this._logger.warn(`Tool ${JSON.stringify(tool.name)} is invalid. Tools names may only contain [a-z0-9_-]`);
			tool.name = tool.name.replace(toolInvalidCharRe, '_');
		}

		type JsonDiagnostic = { message: string; range: { line: number; character: number }[] };

		let diagnostics: JsonDiagnostic[] = [];
		const toolJson = JSON.stringify(tool.inputSchema);
		try {
			const schemaUri = URI.parse('https://json-schema.org/draft-07/schema');
			diagnostics = await this._commandService.executeCommand<JsonDiagnostic[]>('json.validate', schemaUri, toolJson) || [];
		} catch (e) {
			// ignored (error in json extension?);
		}

		if (!diagnostics.length) {
			return tool;
		}

		// because it's all one line from JSON.stringify, we can treat characters as offsets.
		const tree = json.parseTree(toolJson);
		const messages = diagnostics.map(d => {
			const node = json.findNodeAtOffset(tree, d.range[0].character);
			const path = node && `/${json.getNodePath(node).join('/')}`;
			return d.message + (path ? ` (at ${path})` : '');
		});

		return { error: messages };
	}

	private async _getValidatedTools(tools: MCP.Tool[]): Promise<ValidatedMcpTool[]> {
		let error = '';

		const validations = await Promise.all(tools.map(t => this._normalizeTool(t)));
		const validated: ValidatedMcpTool[] = [];
		for (const [i, result] of validations.entries()) {
			if ('error' in result) {
				error += localize('mcpBadSchema.tool', 'Tool `{0}` has invalid JSON parameters:', tools[i].name) + '\n';
				for (const message of result.error) {
					error += `\t- ${message}\n`;
				}
				error += `\t- Schema: ${JSON.stringify(tools[i].inputSchema)}\n\n`;
			} else {
				validated.push(result);
			}
		}

		if (error) {
			this._logger.warn(`${tools.length - validated.length} tools have invalid JSON schemas and will be omitted`);
			warnInvalidTools(this._instantiationService, this.definition.label, error);
		}

		return validated;
	}

	/**
	 * Parses incoming MCP icons and returns the resulting 'stored' record. Note
	 * that this requires an active MCP server connection since we validate
	 * against some of that connection's data. The icons may however be stored
	 * and rehydrated later.
	 */
	private _parseIcons(icons: MCP.Icons) {
		const cnx = this._connection.get();
		if (!cnx) {
			return [];
		}

		return parseAndValidateMcpIcon(icons, cnx.launchDefinition, this._logger);
	}

	private _setServerTools(nonce: string | undefined, toolsPromise: Promise<MCP.Tool[]>, tx: ITransaction | undefined) {
		const toolPromiseSafe = toolsPromise.then(async tools => {
			this._logger.info(`Discovered ${tools.length} tools`);
			const data = await this._getValidatedTools(tools);
			this._primitiveCache.store(this.definition.id, { tools: data, nonce });
			return { data, nonce };
		});
		this._tools.fromServerPromise.set(new ObservablePromise(toolPromiseSafe), tx);
		return toolPromiseSafe;
	}

	private _setServerPrompts(nonce: string | undefined, promptsPromise: Promise<MCP.Prompt[]>, tx: ITransaction | undefined) {
		const promptsPromiseSafe = promptsPromise.then((result): { data: StoredMcpPrompt[]; nonce: string | undefined } => {
			const data: StoredMcpPrompt[] = result.map(prompt => ({
				...prompt,
				_icons: this._parseIcons(prompt)
			}));
			this._primitiveCache.store(this.definition.id, { prompts: data, nonce });
			return { data, nonce };
		});

		this._prompts.fromServerPromise.set(new ObservablePromise(promptsPromiseSafe), tx);
		return promptsPromiseSafe;
	}

	private _toStoredMetadata(serverInfo?: MCP.Implementation, instructions?: string): StoredServerMetadata {
		return {
			serverName: serverInfo ? serverInfo.title || serverInfo.name : undefined,
			serverInstructions: instructions,
			serverIcons: serverInfo ? this._parseIcons(serverInfo) : undefined,
		};
	}

	private _setServerMetadata(
		nonce: string | undefined,
		{ serverInfo, instructions, capabilities }: { serverInfo: MCP.Implementation; instructions: string | undefined; capabilities: MCP.ServerCapabilities },
		tx: ITransaction | undefined,
	) {
		const serverMetadata: StoredServerMetadata = this._toStoredMetadata(serverInfo, instructions);
		this._serverMetadata.fromServerPromise.set(ObservablePromise.resolved({ nonce, data: serverMetadata }), tx);

		const capabilitiesEncoded = encodeCapabilities(capabilities);
		this._capabilities.fromServerPromise.set(ObservablePromise.resolved({ data: capabilitiesEncoded, nonce }), tx);
		this._primitiveCache.store(this.definition.id, { ...serverMetadata, nonce, capabilities: capabilitiesEncoded });
	}

	private _populateLiveData(handler: McpServerRequestHandler, cacheNonce: string | undefined, store: DisposableStore) {
		const cts = new CancellationTokenSource();
		store.add(toDisposable(() => cts.dispose(true)));

		const updateTools = (tx: ITransaction | undefined) => {
			const toolPromise = handler.capabilities.tools ? handler.listTools({}, cts.token) : Promise.resolve([]);
			return this._setServerTools(cacheNonce, toolPromise, tx);
		};

		const updatePrompts = (tx: ITransaction | undefined) => {
			const promptsPromise = handler.capabilities.prompts ? handler.listPrompts({}, cts.token) : Promise.resolve([]);
			return this._setServerPrompts(cacheNonce, promptsPromise, tx);
		};

		store.add(handler.onDidChangeToolList(() => {
			this._logger.info('Tool list changed, refreshing tools...');
			updateTools(undefined);
		}));

		store.add(handler.onDidChangePromptList(() => {
			this._logger.info('Prompts list changed, refreshing prompts...');
			updatePrompts(undefined);
		}));

		transaction(tx => {
			this._setServerMetadata(cacheNonce, { serverInfo: handler.serverInfo, instructions: handler.serverInstructions, capabilities: handler.capabilities }, tx);
			updatePrompts(tx);
			const toolUpdate = updateTools(tx);

			toolUpdate.then(tools => {
				this._telemetryService.publicLog2<ServerBootData, ServerBootClassification>('mcp/serverBoot', {
					supportsLogging: !!handler.capabilities.logging,
					supportsPrompts: !!handler.capabilities.prompts,
					supportsResources: !!handler.capabilities.resources,
					toolCount: tools.data.length,
					serverName: handler.serverInfo.name,
					serverVersion: handler.serverInfo.version,
				});
			});
		});
	}
}

class McpPrompt implements IMcpPrompt {
	readonly id: string;
	readonly name: string;
	readonly description?: string;
	readonly title?: string;
	readonly arguments: readonly MCP.PromptArgument[];
	readonly icons: IMcpIcons;

	constructor(
		private readonly _server: McpServer,
		private readonly _definition: StoredMcpPrompt,
	) {
		this.id = mcpPromptReplaceSpecialChars(this._server.definition.label + '.' + _definition.name);
		this.name = _definition.name;
		this.title = _definition.title;
		this.description = _definition.description;
		this.arguments = _definition.arguments || [];
		this.icons = McpIcons.fromStored(this._definition._icons);
	}

	async resolve(args: Record<string, string>, token?: CancellationToken): Promise<IMcpPromptMessage[]> {
		const result = await McpServer.callOn(this._server, h => h.getPrompt({ name: this._definition.name, arguments: args }, token), token);
		return result.messages;
	}

	async complete(argument: string, prefix: string, alreadyResolved: Record<string, string>, token?: CancellationToken): Promise<string[]> {
		const result = await McpServer.callOn(this._server, h => h.complete({
			ref: { type: 'ref/prompt', name: this._definition.name },
			argument: { name: argument, value: prefix },
			context: { arguments: alreadyResolved },
		}, token), token);
		return result.completion.values;
	}
}

function encodeCapabilities(cap: MCP.ServerCapabilities): McpCapability {
	let out = 0;
	if (cap.logging) { out |= McpCapability.Logging; }
	if (cap.completions) { out |= McpCapability.Completions; }
	if (cap.prompts) {
		out |= McpCapability.Prompts;
		if (cap.prompts.listChanged) {
			out |= McpCapability.PromptsListChanged;
		}
	}
	if (cap.resources) {
		out |= McpCapability.Resources;
		if (cap.resources.subscribe) {
			out |= McpCapability.ResourcesSubscribe;
		}
		if (cap.resources.listChanged) {
			out |= McpCapability.ResourcesListChanged;
		}
	}
	if (cap.tools) {
		out |= McpCapability.Tools;
		if (cap.tools.listChanged) {
			out |= McpCapability.ToolsListChanged;
		}
	}
	return out;
}

export class McpTool implements IMcpTool {

	readonly id: string;
	readonly referenceName: string;
	readonly icons: IMcpIcons;

	public get definition(): MCP.Tool { return this._definition; }

	constructor(
		private readonly _server: McpServer,
		idPrefix: string,
		private readonly _definition: ValidatedMcpTool,
		@IMcpElicitationService private readonly _elicitationService: IMcpElicitationService,
	) {
		this.referenceName = _definition.name.replaceAll('.', '_');
		this.id = (idPrefix + _definition.name).replaceAll('.', '_').slice(0, McpToolName.MaxLength);
		this.icons = McpIcons.fromStored(this._definition._icons);
	}

	async call(params: Record<string, unknown>, context?: IMcpToolCallContext, token?: CancellationToken): Promise<MCP.CallToolResult> {
		if (context) { this._server.runningToolCalls.add(context); }
		try {
			return await this._callWithProgress(params, undefined, context, token);
		} finally {
			if (context) { this._server.runningToolCalls.delete(context); }
		}
	}

	async callWithProgress(params: Record<string, unknown>, progress: ToolProgress, context?: IMcpToolCallContext, token?: CancellationToken): Promise<MCP.CallToolResult> {
		if (context) { this._server.runningToolCalls.add(context); }
		try {
			return await this._callWithProgress(params, progress, context, token);
		} finally {
			if (context) { this._server.runningToolCalls.delete(context); }
		}
	}

	_callWithProgress(params: Record<string, unknown>, progress: ToolProgress | undefined, context?: IMcpToolCallContext, token = CancellationToken.None, allowRetry = true): Promise<MCP.CallToolResult> {
		// serverToolName is always set now, but older cache entries (from 1.99-Insiders) may not have it.
		const name = this._definition.serverToolName ?? this._definition.name;
		const progressToken = progress ? generateUuid() : undefined;
		const store = new DisposableStore();

		return McpServer.callOn(this._server, async h => {
			if (progress) {
				store.add(h.onDidReceiveProgressNotification((e) => {
					if (e.params.progressToken === progressToken) {
						progress.report({
							message: e.params.message,
							progress: e.params.total !== undefined && e.params.progress !== undefined ? e.params.progress / e.params.total : undefined,
						});
					}
				}));
			}

			const meta: Record<string, unknown> = { progressToken };
			if (context?.chatSessionId) {
				meta['vscode.conversationId'] = context.chatSessionId;
			}
			if (context?.chatRequestId) {
				meta['vscode.requestId'] = context.chatRequestId;
			}

			const taskHint = this._definition.execution?.taskSupport;
			const serverSupportsTasksForTools = h.capabilities.tasks?.requests?.tools?.call !== undefined;
			const shouldUseTask = serverSupportsTasksForTools && (taskHint === 'required' || taskHint === 'optional');

			try {
				const result = await h.callTool({
					name,
					arguments: params,
					task: shouldUseTask ? {} : undefined,
					_meta: meta,
				}, token);

				// Wait for tools to refresh for dynamic servers (#261611)
				await this._server.awaitToolRefresh();
				return result;
			} catch (err) {
				// Handle URL elicitation required error
				if (err instanceof MpcResponseError && err.code === MCP.URL_ELICITATION_REQUIRED && allowRetry) {
					await this._handleElicitationErr(err, context, token);
					return this._callWithProgress(params, progress, context, token, false);
				}

				const state = this._server.connectionState.get();
				if (allowRetry && state.state === McpConnectionState.Kind.Error && state.shouldRetry) {
					return this._callWithProgress(params, progress, context, token, false);
				} else {
					throw err;
				}
			} finally {
				store.dispose();
			}
		}, token);
	}

	private async _handleElicitationErr(err: MpcResponseError, context: IMcpToolCallContext | undefined, token: CancellationToken) {
		const elicitations = (err.data as MCP.URLElicitationRequiredError['error']['data'])?.elicitations;
		if (Array.isArray(elicitations) && elicitations.length > 0) {
			for (const elicitation of elicitations) {
				const elicitResult = await this._elicitationService.elicit(this._server, context, elicitation, token);

				try {
					if (elicitResult.value.action !== 'accept') {
						throw err;
					}

					if (elicitResult.kind === ElicitationKind.URL) {
						await elicitResult.wait;
					}
				} finally {
					elicitResult.dispose();
				}
			}
		}
	}

	compare(other: IMcpTool): number {
		return this._definition.name.localeCompare(other.definition.name);
	}
}

function warnInvalidTools(instaService: IInstantiationService, serverName: string, errorText: string) {
	instaService.invokeFunction((accessor) => {
		const notificationService = accessor.get(INotificationService);
		const editorService = accessor.get(IEditorService);
		notificationService.notify({
			severity: Severity.Warning,
			message: localize('mcpBadSchema', 'MCP server `{0}` has tools with invalid parameters which will be omitted.', serverName),
			actions: {
				primary: [{
					class: undefined,
					enabled: true,
					id: 'mcpBadSchema.show',
					tooltip: '',
					label: localize('mcpBadSchema.show', 'Show'),
					run: () => {
						editorService.openEditor({
							resource: undefined,
							contents: errorText,
						});
					}
				}]
			}
		});
	});
}

class McpResource implements IMcpResource {
	readonly uri: URI;
	readonly mcpUri: string;
	readonly name: string;
	readonly description: string | undefined;
	readonly mimeType: string | undefined;
	readonly sizeInBytes: number | undefined;
	readonly title: string | undefined;

	constructor(
		server: McpServer,
		original: MCP.Resource,
		public readonly icons: IMcpIcons,
	) {
		this.mcpUri = original.uri;
		this.title = original.title;
		this.uri = McpResourceURI.fromServer(server.definition, original.uri);
		this.name = original.name;
		this.description = original.description;
		this.mimeType = original.mimeType;
		this.sizeInBytes = original.size;
	}
}

class McpResourceTemplate implements IMcpResourceTemplate {
	readonly name: string;
	readonly title?: string | undefined;
	readonly description?: string;
	readonly mimeType?: string;
	readonly template: UriTemplate;

	constructor(
		private readonly _server: McpServer,
		private readonly _definition: MCP.ResourceTemplate,
		public readonly icons: IMcpIcons,
	) {
		this.name = _definition.name;
		this.description = _definition.description;
		this.mimeType = _definition.mimeType;
		this.title = _definition.title;
		this.template = UriTemplate.parse(_definition.uriTemplate);
	}

	public resolveURI(vars: Record<string, unknown>): URI {
		const serverUri = this.template.resolve(vars);
		return McpResourceURI.fromServer(this._server.definition, serverUri);
	}

	async complete(templatePart: string, prefix: string, alreadyResolved: Record<string, string | string[]>, token?: CancellationToken): Promise<string[]> {
		const result = await McpServer.callOn(this._server, h => h.complete({
			ref: { type: 'ref/resource', uri: this._definition.uriTemplate },
			argument: { name: templatePart, value: prefix },
			context: {
				arguments: mapValues(alreadyResolved, v => Array.isArray(v) ? v.join('/') : v),
			},
		}, token), token);
		return result.completion.values;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpServerConnection.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpServerConnection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { Disposable, DisposableStore, IReference, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, IObservable, observableValue } from '../../../../base/common/observable.js';
import { localize } from '../../../../nls.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogger, log, LogLevel } from '../../../../platform/log/common/log.js';
import { IMcpHostDelegate, IMcpMessageTransport } from './mcpRegistryTypes.js';
import { McpServerRequestHandler } from './mcpServerRequestHandler.js';
import { McpTaskManager } from './mcpTaskManager.js';
import { IMcpClientMethods, IMcpServerConnection, McpCollectionDefinition, McpConnectionState, McpServerDefinition, McpServerLaunch } from './mcpTypes.js';

export class McpServerConnection extends Disposable implements IMcpServerConnection {
	private readonly _launch = this._register(new MutableDisposable<IReference<IMcpMessageTransport>>());
	private readonly _state = observableValue<McpConnectionState>('mcpServerState', { state: McpConnectionState.Kind.Stopped });
	private readonly _requestHandler = observableValue<McpServerRequestHandler | undefined>('mcpServerRequestHandler', undefined);

	public readonly state: IObservable<McpConnectionState> = this._state;
	public readonly handler: IObservable<McpServerRequestHandler | undefined> = this._requestHandler;

	constructor(
		private readonly _collection: McpCollectionDefinition,
		public readonly definition: McpServerDefinition,
		private readonly _delegate: IMcpHostDelegate,
		public readonly launchDefinition: McpServerLaunch,
		private readonly _logger: ILogger,
		private readonly _errorOnUserInteraction: boolean | undefined,
		private readonly _taskManager: McpTaskManager,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();
	}

	/** @inheritdoc */
	public async start(methods: IMcpClientMethods): Promise<McpConnectionState> {
		const currentState = this._state.get();
		if (!McpConnectionState.canBeStarted(currentState.state)) {
			return this._waitForState(McpConnectionState.Kind.Running, McpConnectionState.Kind.Error);
		}

		this._launch.value = undefined;
		this._state.set({ state: McpConnectionState.Kind.Starting }, undefined);
		this._logger.info(localize('mcpServer.starting', 'Starting server {0}', this.definition.label));

		try {
			const launch = this._delegate.start(this._collection, this.definition, this.launchDefinition, { errorOnUserInteraction: this._errorOnUserInteraction });
			this._launch.value = this.adoptLaunch(launch, methods);
			return this._waitForState(McpConnectionState.Kind.Running, McpConnectionState.Kind.Error);
		} catch (e) {
			const errorState: McpConnectionState = {
				state: McpConnectionState.Kind.Error,
				message: e instanceof Error ? e.message : String(e)
			};
			this._state.set(errorState, undefined);
			return errorState;
		}
	}

	private adoptLaunch(launch: IMcpMessageTransport, methods: IMcpClientMethods): IReference<IMcpMessageTransport> {
		const store = new DisposableStore();
		const cts = new CancellationTokenSource();

		store.add(toDisposable(() => cts.dispose(true)));
		store.add(launch);
		store.add(launch.onDidLog(({ level, message }) => {
			log(this._logger, level, message);
		}));

		let didStart = false;
		store.add(autorun(reader => {
			const state = launch.state.read(reader);
			this._state.set(state, undefined);
			this._logger.info(localize('mcpServer.state', 'Connection state: {0}', McpConnectionState.toString(state)));

			if (state.state === McpConnectionState.Kind.Running && !didStart) {
				didStart = true;
				McpServerRequestHandler.create(this._instantiationService, {
					...methods,
					launch,
					logger: this._logger,
					requestLogLevel: this.definition.devMode ? LogLevel.Info : LogLevel.Debug,
					taskManager: this._taskManager,
				}, cts.token).then(
					handler => {
						if (!store.isDisposed) {
							this._requestHandler.set(handler, undefined);
						} else {
							handler.dispose();
						}
					},
					err => {
						if (!store.isDisposed && McpConnectionState.isRunning(this._state.read(undefined))) {
							let message = err.message;
							if (err instanceof CancellationError) {
								message = 'Server exited before responding to `initialize` request.';
								this._logger.error(message);
							} else {
								this._logger.error(err);
							}
							this._state.set({ state: McpConnectionState.Kind.Error, message }, undefined);
						}
						store.dispose();
					},
				);
			}
		}));

		return { dispose: () => store.dispose(), object: launch };
	}

	public async stop(): Promise<void> {
		this._logger.info(localize('mcpServer.stopping', 'Stopping server {0}', this.definition.label));
		this._launch.value?.object.stop();
		await this._waitForState(McpConnectionState.Kind.Stopped, McpConnectionState.Kind.Error);
	}

	public override dispose(): void {
		this._requestHandler.get()?.dispose();
		super.dispose();
		this._state.set({ state: McpConnectionState.Kind.Stopped }, undefined);
	}

	private _waitForState(...kinds: McpConnectionState.Kind[]): Promise<McpConnectionState> {
		const current = this._state.get();
		if (kinds.includes(current.state)) {
			return Promise.resolve(current);
		}

		return new Promise(resolve => {
			const disposable = autorun(reader => {
				const state = this._state.read(reader);
				if (kinds.includes(state.state)) {
					disposable.dispose();
					resolve(state);
				}
			});
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpServerRequestHandler.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpServerRequestHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../../base/common/arrays.js';
import { assertNever, softAssertNever } from '../../../../base/common/assert.js';
import { DeferredPromise, disposableTimeout, IntervalTimer } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, ISettableObservable, ObservablePromise, observableValue, transaction } from '../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { canLog, ILogger, log, LogLevel } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IMcpMessageTransport } from './mcpRegistryTypes.js';
import { IMcpTaskInternal, McpTaskManager } from './mcpTaskManager.js';
import { IMcpClientMethods, McpConnectionState, McpError, MpcResponseError } from './mcpTypes.js';
import { isTaskResult } from './mcpTypesUtils.js';
import { MCP } from './modelContextProtocol.js';

/**
 * Maps request IDs to handlers.
 */
interface PendingRequest {
	promise: DeferredPromise<MCP.Result>;
}

export interface McpRoot {
	uri: string;
	name?: string;
}

export interface IMcpServerRequestHandlerOptions extends IMcpClientMethods {
	/** MCP message transport */
	launch: IMcpMessageTransport;
	/** Logger instance. */
	logger: ILogger;
	/** Log level MCP messages is logged at */
	requestLogLevel?: LogLevel;
	/** Task manager for server-side MCP tasks (shared across reconnections) */
	taskManager: McpTaskManager;
}

/**
 * Request handler for communicating with an MCP server.
 *
 * Handles sending requests and receiving responses, with automatic
 * handling of ping requests and typed client request methods.
 */
export class McpServerRequestHandler extends Disposable {
	private _nextRequestId = 1;
	private readonly _pendingRequests = new Map<MCP.RequestId, PendingRequest>();

	private _hasAnnouncedRoots = false;
	private _roots: MCP.Root[] = [];

	public set roots(roots: MCP.Root[]) {
		if (!equals(this._roots, roots)) {
			this._roots = roots;
			if (this._hasAnnouncedRoots) {
				this.sendNotification({ method: 'notifications/roots/list_changed' });
				this._hasAnnouncedRoots = false;
			}
		}
	}

	private _serverInit!: MCP.InitializeResult;
	public get capabilities(): MCP.ServerCapabilities {
		return this._serverInit.capabilities;
	}

	public get serverInfo(): MCP.Implementation {
		return this._serverInit.serverInfo;
	}

	public get serverInstructions(): string | undefined {
		return this._serverInit.instructions;
	}

	// Event emitters for server notifications
	private readonly _onDidReceiveCancelledNotification = this._register(new Emitter<MCP.CancelledNotification>());
	readonly onDidReceiveCancelledNotification = this._onDidReceiveCancelledNotification.event;

	private readonly _onDidReceiveProgressNotification = this._register(new Emitter<MCP.ProgressNotification>());
	readonly onDidReceiveProgressNotification = this._onDidReceiveProgressNotification.event;

	private readonly _onDidReceiveElicitationCompleteNotification = this._register(new Emitter<MCP.ElicitationCompleteNotification>());
	readonly onDidReceiveElicitationCompleteNotification = this._onDidReceiveElicitationCompleteNotification.event;

	private readonly _onDidChangeResourceList = this._register(new Emitter<void>());
	readonly onDidChangeResourceList = this._onDidChangeResourceList.event;

	private readonly _onDidUpdateResource = this._register(new Emitter<MCP.ResourceUpdatedNotification>());
	readonly onDidUpdateResource = this._onDidUpdateResource.event;

	private readonly _onDidChangeToolList = this._register(new Emitter<void>());
	readonly onDidChangeToolList = this._onDidChangeToolList.event;

	private readonly _onDidChangePromptList = this._register(new Emitter<void>());
	readonly onDidChangePromptList = this._onDidChangePromptList.event;

	/**
	 * Connects to the MCP server and does the initialization handshake.
	 * @throws MpcResponseError if the server fails to initialize.
	 */
	public static async create(instaService: IInstantiationService, opts: IMcpServerRequestHandlerOptions, token?: CancellationToken) {
		const mcp = new McpServerRequestHandler(opts);
		const store = new DisposableStore();
		try {
			const timer = store.add(new IntervalTimer());
			timer.cancelAndSet(() => {
				opts.logger.info('Waiting for server to respond to `initialize` request...');
			}, 5000);

			await instaService.invokeFunction(async accessor => {
				const productService = accessor.get(IProductService);
				const initialized = await mcp.sendRequest<MCP.InitializeRequest, MCP.InitializeResult>({
					method: 'initialize',
					params: {
						protocolVersion: MCP.LATEST_PROTOCOL_VERSION,
						capabilities: {
							roots: { listChanged: true },
							sampling: opts.createMessageRequestHandler ? {} : undefined,
							elicitation: opts.elicitationRequestHandler ? { form: {}, url: {} } : undefined,
							tasks: {
								list: {},
								cancel: {},
								requests: {
									sampling: opts.createMessageRequestHandler ? { createMessage: {} } : undefined,
									elicitation: opts.elicitationRequestHandler ? { create: {} } : undefined,
								},
							},
						},
						clientInfo: {
							name: productService.nameLong,
							version: productService.version,
						}
					}
				}, token);
				mcp._serverInit = initialized;
				mcp._sendLogLevelToServer(opts.logger.getLevel());

				mcp.sendNotification<MCP.InitializedNotification>({
					method: 'notifications/initialized'
				});
			});

			return mcp;
		} catch (e) {
			mcp.dispose();
			throw e;
		} finally {
			store.dispose();
		}
	}

	public readonly logger: ILogger;
	private readonly _launch: IMcpMessageTransport;
	private readonly _requestLogLevel: LogLevel;
	private readonly _createMessageRequestHandler: IMcpServerRequestHandlerOptions['createMessageRequestHandler'];
	private readonly _elicitationRequestHandler: IMcpServerRequestHandlerOptions['elicitationRequestHandler'];
	private readonly _taskManager: McpTaskManager;

	protected constructor({
		launch,
		logger,
		createMessageRequestHandler,
		elicitationRequestHandler,
		requestLogLevel = LogLevel.Debug,
		taskManager,
	}: IMcpServerRequestHandlerOptions) {
		super();
		this._launch = launch;
		this.logger = logger;
		this._requestLogLevel = requestLogLevel;
		this._createMessageRequestHandler = createMessageRequestHandler;
		this._elicitationRequestHandler = elicitationRequestHandler;
		this._taskManager = taskManager;

		// Attach this handler to the task manager
		this._taskManager.setHandler(this);
		this._register(this._taskManager.onDidUpdateTask(task => {
			this.send({
				jsonrpc: MCP.JSONRPC_VERSION,
				method: 'notifications/tasks/status',
				params: task
			} satisfies MCP.TaskStatusNotification);
		}));
		this._register(toDisposable(() => this._taskManager.setHandler(undefined)));

		this._register(launch.onDidReceiveMessage(message => this.handleMessage(message)));
		this._register(autorun(reader => {
			const state = launch.state.read(reader).state;
			// the handler will get disposed when the launch stops, but if we're still
			// create()'ing we need to make sure to cancel the initialize request.
			if (state === McpConnectionState.Kind.Error || state === McpConnectionState.Kind.Stopped) {
				this.cancelAllRequests();
			}
		}));

		// Listen for log level changes and forward them to the MCP server
		this._register(logger.onDidChangeLogLevel((logLevel) => {
			this._sendLogLevelToServer(logLevel);
		}));
	}

	/**
	 * Send a client request to the server and return the response.
	 *
	 * @param request The request to send
	 * @param token Cancellation token
	 * @param timeoutMs Optional timeout in milliseconds
	 * @returns A promise that resolves with the response
	 */
	private async sendRequest<T extends MCP.ClientRequest, R extends MCP.ServerResult>(
		request: Pick<T, 'params' | 'method'>,
		token: CancellationToken = CancellationToken.None
	): Promise<R> {
		if (this._store.isDisposed) {
			return Promise.reject(new CancellationError());
		}

		const id = this._nextRequestId++;

		// Create the full JSON-RPC request
		const jsonRpcRequest: MCP.JSONRPCRequest = {
			jsonrpc: MCP.JSONRPC_VERSION,
			id,
			...request
		};

		const promise = new DeferredPromise<MCP.ServerResult>();
		// Store the pending request
		this._pendingRequests.set(id, { promise });
		// Set up cancellation
		const cancelListener = token.onCancellationRequested(() => {
			if (!promise.isSettled) {
				this._pendingRequests.delete(id);
				this.sendNotification({ method: 'notifications/cancelled', params: { requestId: id } });
				promise.cancel();
			}
			cancelListener.dispose();
		});

		// Send the request
		this.send(jsonRpcRequest);
		const ret = promise.p.finally(() => {
			cancelListener.dispose();
			this._pendingRequests.delete(id);
		});

		return ret as Promise<R>;
	}

	private send(mcp: MCP.JSONRPCMessage) {
		if (canLog(this.logger.getLevel(), this._requestLogLevel)) { // avoid building the string if we don't need to
			log(this.logger, this._requestLogLevel, `[editor -> server] ${JSON.stringify(mcp)}`);
		}

		this._launch.send(mcp);
	}

	/**
	 * Handles paginated requests by making multiple requests until all items are retrieved.
	 *
	 * @param method The method name to call
	 * @param getItems Function to extract the array of items from a result
	 * @param initialParams Initial parameters
	 * @param token Cancellation token
	 * @returns Promise with all items combined
	 */
	private async *sendRequestPaginated<T extends MCP.PaginatedRequest & MCP.ClientRequest, R extends MCP.PaginatedResult, I>(method: T['method'], getItems: (result: R) => I[], initialParams?: Omit<T['params'], 'jsonrpc' | 'id'>, token: CancellationToken = CancellationToken.None): AsyncIterable<I[]> {
		let nextCursor: MCP.Cursor | undefined = undefined;

		do {
			const params: T['params'] = {
				...initialParams,
				cursor: nextCursor
			};

			const result: R = await this.sendRequest<T, R>({ method, params }, token);
			yield getItems(result);
			nextCursor = result.nextCursor;
		} while (nextCursor !== undefined && !token.isCancellationRequested);
	}

	private sendNotification<N extends MCP.ClientNotification>(notification: Omit<N, 'jsonrpc'>): void {
		this.send({ ...notification, jsonrpc: MCP.JSONRPC_VERSION });
	}

	/**
	 * Handle incoming messages from the server
	 */
	private handleMessage(message: MCP.JSONRPCMessage): void {
		if (canLog(this.logger.getLevel(), this._requestLogLevel)) { // avoid building the string if we don't need to
			log(this.logger, this._requestLogLevel, `[server -> editor] ${JSON.stringify(message)}`);
		}

		// Handle responses to our requests
		if ('id' in message) {
			if ('result' in message) {
				this.handleResult(message);
			} else if ('error' in message) {
				this.handleError(message);
			}
		}

		// Handle requests from the server
		if ('method' in message) {
			if ('id' in message) {
				this.handleServerRequest(message as MCP.JSONRPCRequest & MCP.ServerRequest);
			} else {
				this.handleServerNotification(message as MCP.JSONRPCNotification & MCP.ServerNotification);
			}
		}
	}

	/**
	 * Handle successful responses
	 */
	private handleResult(response: MCP.JSONRPCResponse): void {
		const request = this._pendingRequests.get(response.id);
		if (request) {
			this._pendingRequests.delete(response.id);
			request.promise.complete(response.result);
		}
	}

	/**
	 * Handle error responses
	 */
	private handleError(response: MCP.JSONRPCError): void {
		const request = this._pendingRequests.get(response.id);
		if (request) {
			this._pendingRequests.delete(response.id);
			request.promise.error(new MpcResponseError(response.error.message, response.error.code, response.error.data));
		}
	}

	/**
	 * Handle incoming server requests
	 */
	private async handleServerRequest(request: MCP.JSONRPCRequest & MCP.ServerRequest): Promise<void> {
		try {
			let response: MCP.Result | undefined;
			if (request.method === 'ping') {
				response = this.handlePing(request);
			} else if (request.method === 'roots/list') {
				response = this.handleRootsList(request);
			} else if (request.method === 'sampling/createMessage' && this._createMessageRequestHandler) {
				// Check if this is a task-augmented request
				if (request.params.task) {
					const taskResult = this._taskManager.createTask(
						request.params.task.ttl ?? null,
						(token) => this._createMessageRequestHandler!(request.params, token)
					);
					taskResult._meta ??= {};
					taskResult._meta['io.modelcontextprotocol/related-task'] = { taskId: taskResult.task.taskId };
					response = taskResult;
				} else {
					response = await this._createMessageRequestHandler(request.params);
				}
			} else if (request.method === 'elicitation/create' && this._elicitationRequestHandler) {
				// Check if this is a task-augmented request
				if (request.params.task) {
					const taskResult = this._taskManager.createTask(
						request.params.task.ttl ?? null,
						(token) => this._elicitationRequestHandler!(request.params, token)
					);
					taskResult._meta ??= {};
					taskResult._meta['io.modelcontextprotocol/related-task'] = { taskId: taskResult.task.taskId };
					response = taskResult;
				} else {
					response = await this._elicitationRequestHandler(request.params);
				}
			} else if (request.method === 'tasks/get') {
				response = this._taskManager.getTask(request.params.taskId);
			} else if (request.method === 'tasks/result') {
				response = await this._taskManager.getTaskResult(request.params.taskId);
			} else if (request.method === 'tasks/cancel') {
				response = this._taskManager.cancelTask(request.params.taskId);
			} else if (request.method === 'tasks/list') {
				response = this._taskManager.listTasks();
			} else {
				throw McpError.methodNotFound(request.method);
			}
			this.respondToRequest(request, response);
		} catch (e) {
			if (!(e instanceof McpError)) {
				this.logger.error(`Error handling request ${request.method}:`, e);
				e = McpError.unknown(e);
			}

			const errorResponse: MCP.JSONRPCError = {
				jsonrpc: MCP.JSONRPC_VERSION,
				id: request.id,
				error: {
					code: e.code,
					message: e.message,
					data: e.data,
				}
			};

			this.send(errorResponse);
		}
	}
	/**
	 * Handle incoming server notifications
	 */
	private handleServerNotification(request: MCP.JSONRPCNotification & MCP.ServerNotification): void {
		switch (request.method) {
			case 'notifications/message':
				return this.handleLoggingNotification(request);
			case 'notifications/cancelled':
				this._onDidReceiveCancelledNotification.fire(request);
				return this.handleCancelledNotification(request);
			case 'notifications/progress':
				this._onDidReceiveProgressNotification.fire(request);
				return;
			case 'notifications/resources/list_changed':
				this._onDidChangeResourceList.fire();
				return;
			case 'notifications/resources/updated':
				this._onDidUpdateResource.fire(request);
				return;
			case 'notifications/tools/list_changed':
				this._onDidChangeToolList.fire();
				return;
			case 'notifications/prompts/list_changed':
				this._onDidChangePromptList.fire();
				return;
			case 'notifications/elicitation/complete':
				this._onDidReceiveElicitationCompleteNotification.fire(request);
				return;
			case 'notifications/tasks/status':
				this._taskManager.getClientTask(request.params.taskId)?.onDidUpdateState(request.params);
				return;
			default:
				softAssertNever(request);
		}
	}

	private handleCancelledNotification(request: MCP.CancelledNotification): void {
		if (request.params.requestId) {
			const pendingRequest = this._pendingRequests.get(request.params.requestId);
			if (pendingRequest) {
				this._pendingRequests.delete(request.params.requestId);
				pendingRequest.promise.cancel();
			}
		}
	}

	private handleLoggingNotification(request: MCP.LoggingMessageNotification): void {
		let contents = typeof request.params.data === 'string' ? request.params.data : JSON.stringify(request.params.data);
		if (request.params.logger) {
			contents = `${request.params.logger}: ${contents}`;
		}

		switch (request.params?.level) {
			case 'debug':
				this.logger.debug(contents);
				break;
			case 'info':
			case 'notice':
				this.logger.info(contents);
				break;
			case 'warning':
				this.logger.warn(contents);
				break;
			case 'error':
			case 'critical':
			case 'alert':
			case 'emergency':
				this.logger.error(contents);
				break;
			default:
				this.logger.info(contents);
				break;
		}
	}

	/**
	 * Send a generic response to a request
	 */
	private respondToRequest(request: MCP.JSONRPCRequest, result: MCP.Result): void {
		const response: MCP.JSONRPCResponse = {
			jsonrpc: MCP.JSONRPC_VERSION,
			id: request.id,
			result
		};
		this.send(response);
	}

	/**
	 * Send a response to a ping request
	 */
	private handlePing(_request: MCP.PingRequest): {} {
		return {};
	}

	/**
	 * Send a response to a roots/list request
	 */
	private handleRootsList(_request: MCP.ListRootsRequest): MCP.ListRootsResult {
		this._hasAnnouncedRoots = true;
		return { roots: this._roots };
	}

	private cancelAllRequests() {
		this._pendingRequests.forEach(pending => pending.promise.cancel());
		this._pendingRequests.clear();
	}

	public override dispose(): void {
		this.cancelAllRequests();
		super.dispose();
	}

	/**
	 * Forwards log level changes to the MCP server if it supports logging
	 */
	private async _sendLogLevelToServer(logLevel: LogLevel): Promise<void> {
		try {
			// Only send if the server supports logging capabilities
			if (!this.capabilities.logging) {
				return;
			}

			await this.setLevel({ level: mapLogLevelToMcp(logLevel) });
		} catch (error) {
			this.logger.error(`Failed to set MCP server log level: ${error}`);
		}
	}

	/**
	 * Send an initialize request
	 */
	initialize(params: MCP.InitializeRequest['params'], token?: CancellationToken): Promise<MCP.InitializeResult> {
		return this.sendRequest<MCP.InitializeRequest, MCP.InitializeResult>({ method: 'initialize', params }, token);
	}

	/**
	 * List available resources
	 */
	listResources(params?: MCP.ListResourcesRequest['params'], token?: CancellationToken): Promise<MCP.Resource[]> {
		return Iterable.asyncToArrayFlat(this.listResourcesIterable(params, token));
	}

	/**
	 * List available resources (iterable)
	 */
	listResourcesIterable(params?: MCP.ListResourcesRequest['params'], token?: CancellationToken): AsyncIterable<MCP.Resource[]> {
		return this.sendRequestPaginated<MCP.ListResourcesRequest, MCP.ListResourcesResult, MCP.Resource>('resources/list', result => result.resources, params, token);
	}

	/**
	 * Read a specific resource
	 */
	readResource(params: MCP.ReadResourceRequest['params'], token?: CancellationToken): Promise<MCP.ReadResourceResult> {
		return this.sendRequest<MCP.ReadResourceRequest, MCP.ReadResourceResult>({ method: 'resources/read', params }, token);
	}

	/**
	 * List available resource templates
	 */
	listResourceTemplates(params?: MCP.ListResourceTemplatesRequest['params'], token?: CancellationToken): Promise<MCP.ResourceTemplate[]> {
		return Iterable.asyncToArrayFlat(this.sendRequestPaginated<MCP.ListResourceTemplatesRequest, MCP.ListResourceTemplatesResult, MCP.ResourceTemplate>('resources/templates/list', result => result.resourceTemplates, params, token));
	}

	/**
	 * Subscribe to resource updates
	 */
	subscribe(params: MCP.SubscribeRequest['params'], token?: CancellationToken): Promise<MCP.EmptyResult> {
		return this.sendRequest<MCP.SubscribeRequest, MCP.EmptyResult>({ method: 'resources/subscribe', params }, token);
	}

	/**
	 * Unsubscribe from resource updates
	 */
	unsubscribe(params: MCP.UnsubscribeRequest['params'], token?: CancellationToken): Promise<MCP.EmptyResult> {
		return this.sendRequest<MCP.UnsubscribeRequest, MCP.EmptyResult>({ method: 'resources/unsubscribe', params }, token);
	}

	/**
	 * List available prompts
	 */
	listPrompts(params?: MCP.ListPromptsRequest['params'], token?: CancellationToken): Promise<MCP.Prompt[]> {
		return Iterable.asyncToArrayFlat(this.sendRequestPaginated<MCP.ListPromptsRequest, MCP.ListPromptsResult, MCP.Prompt>('prompts/list', result => result.prompts, params, token));
	}

	/**
	 * Get a specific prompt
	 */
	getPrompt(params: MCP.GetPromptRequest['params'], token?: CancellationToken): Promise<MCP.GetPromptResult> {
		return this.sendRequest<MCP.GetPromptRequest, MCP.GetPromptResult>({ method: 'prompts/get', params }, token);
	}

	/**
	 * List available tools
	 */
	listTools(params?: MCP.ListToolsRequest['params'], token?: CancellationToken): Promise<MCP.Tool[]> {
		return Iterable.asyncToArrayFlat(this.sendRequestPaginated<MCP.ListToolsRequest, MCP.ListToolsResult, MCP.Tool>('tools/list', result => result.tools, params, token));
	}

	/**
	 * Call a specific tool. Supports tasks automatically if `task` is set on the request.
	 */
	async callTool(params: MCP.CallToolRequest['params'] & MCP.Request['params'], token?: CancellationToken): Promise<MCP.CallToolResult> {
		const response = await this.sendRequest<MCP.CallToolRequest, MCP.CallToolResult | MCP.CreateTaskResult>({ method: 'tools/call', params }, token);

		if (isTaskResult(response)) {
			const task = new McpTask<MCP.CallToolResult>(response.task, token);
			this._taskManager.adoptClientTask(task);
			task.setHandler(this);
			return task.result.finally(() => {
				this._taskManager.abandonClientTask(task.id);
			});
		}

		return response;

	}

	/**
	 * Set the logging level
	 */
	setLevel(params: MCP.SetLevelRequest['params'], token?: CancellationToken): Promise<MCP.EmptyResult> {
		return this.sendRequest<MCP.SetLevelRequest, MCP.EmptyResult>({ method: 'logging/setLevel', params }, token);
	}

	/**
	 * Find completions for an argument
	 */
	complete(params: MCP.CompleteRequest['params'], token?: CancellationToken): Promise<MCP.CompleteResult> {
		return this.sendRequest<MCP.CompleteRequest, MCP.CompleteResult>({ method: 'completion/complete', params }, token);
	}

	/**
	 * Get task status
	 */
	getTask(params: { taskId: string }, token?: CancellationToken): Promise<MCP.GetTaskResult> {
		return this.sendRequest<MCP.GetTaskRequest, MCP.GetTaskResult>({ method: 'tasks/get', params }, token);
	}

	/**
	 * Get task result
	 */
	getTaskResult(params: { taskId: string }, token?: CancellationToken): Promise<MCP.GetTaskPayloadResult> {
		return this.sendRequest<MCP.GetTaskPayloadRequest, MCP.GetTaskPayloadResult>({ method: 'tasks/result', params }, token);
	}

	/**
	 * Cancel a task
	 */
	cancelTask(params: { taskId: string }, token?: CancellationToken): Promise<MCP.CancelTaskResult> {
		return this.sendRequest<MCP.CancelTaskRequest, MCP.CancelTaskResult>({ method: 'tasks/cancel', params }, token);
	}

	/**
	 * List all tasks
	 */
	listTasks(params?: MCP.ListTasksRequest['params'], token?: CancellationToken): Promise<MCP.Task[]> {
		return Iterable.asyncToArrayFlat(
			this.sendRequestPaginated<MCP.ListTasksRequest, MCP.ListTasksResult, MCP.Task>(
				'tasks/list', result => result.tasks, params, token
			)
		);
	}
}

function isTaskInTerminalState(task: MCP.Task): boolean {
	return task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled';
}

/**
 * Implementation of a task that handles polling, status notifications, and handler reconnections. It implements the task polling loop internally and can also be
 * updated externally via `onDidUpdateState`, when notifications are received
 * for example.
 * @internal
 */
export class McpTask<T extends MCP.Result> extends Disposable implements IMcpTaskInternal {
	private readonly promise = new DeferredPromise<T>();

	public get result(): Promise<T> {
		return this.promise.p;
	}

	public get id() {
		return this._task.taskId;
	}

	private _lastTaskState: ISettableObservable<MCP.Task>;
	private _handler = observableValue<McpServerRequestHandler | undefined>('mcpTaskHandler', undefined);

	constructor(
		private readonly _task: MCP.Task,
		_token: CancellationToken = CancellationToken.None
	) {
		super();

		const expiresAt = _task.ttl ? (Date.now() + _task.ttl) : undefined;
		this._lastTaskState = observableValue('lastTaskState', this._task);

		const store = this._register(new DisposableStore());

		// Handle external cancellation token
		if (_token.isCancellationRequested) {
			this._lastTaskState.set({ ...this._task, status: 'cancelled' }, undefined);
		} else {
			store.add(_token.onCancellationRequested(() => {
				const current = this._lastTaskState.get();
				if (!isTaskInTerminalState(current)) {
					this._lastTaskState.set({ ...current, status: 'cancelled' }, undefined);
				}
			}));
		}

		// Handle TTL expiration with an explicit timeout
		if (expiresAt) {
			const ttlTimeout = expiresAt - Date.now();
			if (ttlTimeout <= 0) {
				this._lastTaskState.set({ ...this._task, status: 'cancelled', statusMessage: 'Task timed out.' }, undefined);
			} else {
				store.add(disposableTimeout(() => {
					const current = this._lastTaskState.get();
					if (!isTaskInTerminalState(current)) {
						this._lastTaskState.set({ ...current, status: 'cancelled', statusMessage: 'Task timed out.' }, undefined);
					}
				}, ttlTimeout));
			}
		}

		// A `tasks/result` call triggered by an input_required state.
		const inputRequiredLookup = observableValue<ObservablePromise<MCP.Task> | undefined>('activeResultLookup', undefined);

		// 1. Poll for task updates when the task isn't in a terminal state
		store.add(autorun(reader => {
			const current = this._lastTaskState.read(reader);
			if (isTaskInTerminalState(current)) {
				return;
			}

			// When a task goes into the input_required state, by spec we should call
			// `tasks/result` which can return an SSE stream of task updates. No need
			// to poll while such a lookup is going on, but once it resolves we should
			// clear and update our state.
			const lookup = inputRequiredLookup.read(reader);
			if (lookup) {
				const result = lookup.promiseResult.read(reader);
				return transaction(tx => {
					if (!result) {
						// still ongoing
					} else if (result.data) {
						inputRequiredLookup.set(undefined, tx);
						this._lastTaskState.set(result.data, tx);
					} else {
						inputRequiredLookup.set(undefined, tx);
						if (result.error instanceof McpError && result.error.code === MCP.INVALID_PARAMS) {
							this._lastTaskState.set({ ...current, status: 'cancelled' }, undefined);
						} else {
							// Maybe a connection error -- start polling again
							this._lastTaskState.set({ ...current, status: 'working' }, undefined);
						}
					}
				});
			}

			const handler = this._handler.read(reader);
			if (!handler) {
				return;
			}

			const pollInterval = _task.pollInterval ?? 2000;
			const cts = new CancellationTokenSource(_token);
			reader.store.add(toDisposable(() => cts.dispose(true)));
			reader.store.add(disposableTimeout(() => {
				handler.getTask({ taskId: current.taskId }, cts.token)
					.catch((e): MCP.Task | undefined => {
						if (e instanceof McpError && e.code === MCP.INVALID_PARAMS) {
							return { ...current, status: 'cancelled' };
						} else {
							return { ...current }; // errors are already logged, keep in current state
						}
					})
					.then(r => {
						if (r && !cts.token.isCancellationRequested) {
							this._lastTaskState.set(r, undefined);
						}
					});
			}, pollInterval));
		}));

		// 2. Get the result once it's available (or propagate errors). Trigger
		// input_required handling as needed. Only react when the status itself changes.
		const lastStatus = this._lastTaskState.map(task => task.status);
		store.add(autorun(reader => {
			const status = lastStatus.read(reader);
			if (status === 'failed') {
				const current = this._lastTaskState.read(undefined);
				this.promise.error(new Error(`Task ${current.taskId} failed: ${current.statusMessage ?? 'unknown error'}`));
				store.dispose();
			} else if (status === 'cancelled') {
				this.promise.cancel();
				store.dispose();
			} else if (status === 'input_required') {
				const handler = this._handler.read(reader);
				if (handler) {
					const current = this._lastTaskState.read(undefined);
					const cts = new CancellationTokenSource(_token);
					reader.store.add(toDisposable(() => cts.dispose(true)));
					inputRequiredLookup.set(new ObservablePromise<MCP.Task>(handler.getTask({ taskId: current.taskId }, cts.token)), undefined);
				}
			} else if (status === 'completed') {
				const handler = this._handler.read(reader);
				if (handler) {
					this.promise.settleWith(handler.getTaskResult({ taskId: _task.taskId }, _token) as Promise<T>);
					store.dispose();
				}
			} else if (status === 'working') {
				// no-op
			} else {
				softAssertNever(status);
			}
		}));
	}

	onDidUpdateState(task: MCP.Task) {
		this._lastTaskState.set(task, undefined);
	}

	setHandler(handler: McpServerRequestHandler | undefined): void {
		this._handler.set(handler, undefined);
	}
}

/**
 * Maps VSCode LogLevel to MCP LoggingLevel
 */
function mapLogLevelToMcp(logLevel: LogLevel): MCP.LoggingLevel {
	switch (logLevel) {
		case LogLevel.Trace:
			return 'debug'; // MCP doesn't have trace, use debug
		case LogLevel.Debug:
			return 'debug';
		case LogLevel.Info:
			return 'info';
		case LogLevel.Warning:
			return 'warning';
		case LogLevel.Error:
			return 'error';
		case LogLevel.Off:
			return 'emergency'; // MCP doesn't have off, use emergency
		default:
			return assertNever(logLevel); // Off and other levels are not supported
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpService.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, IObservable, ISettableObservable, observableValue, transaction } from '../../../../base/common/observable.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { mcpAutoStartConfig, McpAutoStartValue } from '../../../../platform/mcp/common/mcpManagement.js';
import { StorageScope } from '../../../../platform/storage/common/storage.js';
import { IMcpRegistry } from './mcpRegistryTypes.js';
import { McpServer, McpServerMetadataCache } from './mcpServer.js';
import { IAutostartResult, IMcpServer, IMcpService, McpCollectionDefinition, McpConnectionState, McpDefinitionReference, McpServerCacheState, McpServerDefinition, McpStartServerInteraction, McpToolName, UserInteractionRequiredError } from './mcpTypes.js';
import { startServerAndWaitForLiveTools } from './mcpTypesUtils.js';

type IMcpServerRec = { object: IMcpServer; toolPrefix: string };

export class McpService extends Disposable implements IMcpService {

	declare _serviceBrand: undefined;

	private readonly _currentAutoStarts = new Set<CancellationTokenSource>();
	private readonly _servers = observableValue<readonly IMcpServerRec[]>(this, []);
	public readonly servers: IObservable<readonly IMcpServer[]> = this._servers.map(servers => servers.map(s => s.object));

	public get lazyCollectionState() { return this._mcpRegistry.lazyCollectionState; }

	protected readonly userCache: McpServerMetadataCache;
	protected readonly workspaceCache: McpServerMetadataCache;

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IMcpRegistry private readonly _mcpRegistry: IMcpRegistry,
		@ILogService private readonly _logService: ILogService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();

		this.userCache = this._register(_instantiationService.createInstance(McpServerMetadataCache, StorageScope.PROFILE));
		this.workspaceCache = this._register(_instantiationService.createInstance(McpServerMetadataCache, StorageScope.WORKSPACE));

		const updateThrottle = this._store.add(new RunOnceScheduler(() => this.updateCollectedServers(), 500));

		// Throttle changes so that if a collection is changed, or a server is
		// unregistered/registered, we don't stop servers unnecessarily.
		this._register(autorun(reader => {
			for (const collection of this._mcpRegistry.collections.read(reader)) {
				collection.serverDefinitions.read(reader);
			}
			updateThrottle.schedule(500);
		}));
	}

	public cancelAutostart(): void {
		for (const cts of this._currentAutoStarts) {
			cts.cancel();
		}
	}

	public autostart(_token?: CancellationToken): IObservable<IAutostartResult> {
		const autoStartConfig = this.configurationService.getValue<McpAutoStartValue>(mcpAutoStartConfig);
		if (autoStartConfig === McpAutoStartValue.Never) {
			return observableValue<IAutostartResult>(this, IAutostartResult.Empty);
		}

		const state = observableValue<IAutostartResult>(this, { working: true, starting: [], serversRequiringInteraction: [] });
		const store = new DisposableStore();

		const cts = store.add(new CancellationTokenSource(_token));
		this._currentAutoStarts.add(cts);
		store.add(toDisposable(() => {
			this._currentAutoStarts.delete(cts);
		}));
		store.add(cts.token.onCancellationRequested(() => {
			state.set(IAutostartResult.Empty, undefined);
		}));

		this._autostart(autoStartConfig, state, cts.token)
			.catch(err => {
				this._logService.error('Error during MCP autostart:', err);
				state.set(IAutostartResult.Empty, undefined);
			})
			.finally(() => store.dispose());

		return state;
	}

	private async _autostart(autoStartConfig: McpAutoStartValue, state: ISettableObservable<IAutostartResult>, token: CancellationToken) {
		await this._activateCollections();

		if (token.isCancellationRequested) {
			return;
		}

		// don't try re-running errored servers, let the user choose if they want that
		const candidates = this.servers.get().filter(s => s.connectionState.get().state !== McpConnectionState.Kind.Error);

		let todo = new Set<IMcpServer>();
		if (autoStartConfig === McpAutoStartValue.OnlyNew) {
			todo = new Set(candidates.filter(s => s.cacheState.get() === McpServerCacheState.Unknown));
		} else if (autoStartConfig === McpAutoStartValue.NewAndOutdated) {
			todo = new Set(candidates.filter(s => {
				const c = s.cacheState.get();
				return c === McpServerCacheState.Unknown || c === McpServerCacheState.Outdated;
			}));
		}

		if (!todo.size) {
			state.set(IAutostartResult.Empty, undefined);
			return;
		}

		const interaction = new McpStartServerInteraction();
		const requiringInteraction: (McpDefinitionReference & { errorMessage?: string })[] = [];

		const update = () => state.set({
			working: todo.size > 0,
			starting: [...todo].map(t => t.definition),
			serversRequiringInteraction: requiringInteraction,
		}, undefined);

		update();

		await Promise.all([...todo].map(async (server, i) => {
			try {
				await startServerAndWaitForLiveTools(server, { interaction, errorOnUserInteraction: true }, token);
			} catch (error) {
				if (error instanceof UserInteractionRequiredError) {
					requiringInteraction.push({ id: server.definition.id, label: server.definition.label, errorMessage: error.message });
				}
			} finally {
				todo.delete(server);
				if (!token.isCancellationRequested) {
					update();
				}
			}
		}));
	}

	public resetCaches(): void {
		this.userCache.reset();
		this.workspaceCache.reset();
	}

	public resetTrust(): void {
		this.resetCaches(); // same difference now
	}

	public async activateCollections(): Promise<void> {
		await this._activateCollections();
	}

	private async _activateCollections() {
		const collections = await this._mcpRegistry.discoverCollections();
		this.updateCollectedServers();
		return new Set(collections.map(c => c.id));
	}

	public updateCollectedServers() {
		const prefixGenerator = new McpPrefixGenerator();
		const definitions = this._mcpRegistry.collections.get().flatMap(collectionDefinition =>
			collectionDefinition.serverDefinitions.get().map(serverDefinition => {
				const toolPrefix = prefixGenerator.generate(serverDefinition.label);
				return { serverDefinition, collectionDefinition, toolPrefix };
			})
		);

		const nextDefinitions = new Set(definitions);
		const currentServers = this._servers.get();
		const nextServers: IMcpServerRec[] = [];
		const pushMatch = (match: (typeof definitions)[0], rec: IMcpServerRec) => {
			nextDefinitions.delete(match);
			nextServers.push(rec);
			const connection = rec.object.connection.get();
			// if the definition was modified, stop the server; it'll be restarted again on-demand
			if (connection && !McpServerDefinition.equals(connection.definition, match.serverDefinition)) {
				rec.object.stop();
				this._logService.debug(`MCP server ${rec.object.definition.id} stopped because the definition changed`);
			}
		};

		// Transfer over any servers that are still valid.
		for (const server of currentServers) {
			const match = definitions.find(d => defsEqual(server.object, d) && server.toolPrefix === d.toolPrefix);
			if (match) {
				pushMatch(match, server);
			} else {
				server.object.dispose();
			}
		}

		// Create any new servers that are needed.
		for (const def of nextDefinitions) {
			const object = this._instantiationService.createInstance(
				McpServer,
				def.collectionDefinition,
				def.serverDefinition,
				def.serverDefinition.roots,
				!!def.collectionDefinition.lazy,
				def.collectionDefinition.scope === StorageScope.WORKSPACE ? this.workspaceCache : this.userCache,
				def.toolPrefix,
			);

			nextServers.push({ object, toolPrefix: def.toolPrefix });
		}

		transaction(tx => {
			this._servers.set(nextServers, tx);
		});
	}

	public override dispose(): void {
		this._servers.get().forEach(s => s.object.dispose());
		super.dispose();
	}
}

function defsEqual(server: IMcpServer, def: { serverDefinition: McpServerDefinition; collectionDefinition: McpCollectionDefinition }) {
	return server.collection.id === def.collectionDefinition.id && server.definition.id === def.serverDefinition.id;
}

// Helper class for generating unique MCP tool prefixes
class McpPrefixGenerator {
	private readonly seenPrefixes = new Set<string>();

	generate(label: string): string {
		const baseToolPrefix = McpToolName.Prefix + label.toLowerCase().replace(/[^a-z0-9_.-]+/g, '_').slice(0, McpToolName.MaxPrefixLen - McpToolName.Prefix.length - 1);
		let toolPrefix = baseToolPrefix + '_';
		for (let i = 2; this.seenPrefixes.has(toolPrefix); i++) {
			toolPrefix = baseToolPrefix + i + '_';
		}
		this.seenPrefixes.add(toolPrefix);
		return toolPrefix;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpTaskManager.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpTaskManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { disposableTimeout } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, DisposableMap, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import type { McpServerRequestHandler } from './mcpServerRequestHandler.js';
import { McpError } from './mcpTypes.js';
import { MCP } from './modelContextProtocol.js';

export interface IMcpTaskInternal extends IDisposable {
	readonly id: string;
	onDidUpdateState(task: MCP.Task): void;
	setHandler(handler: McpServerRequestHandler | undefined): void;
}

interface TaskEntry extends IDisposable {
	task: MCP.Task;
	result?: MCP.Result;
	error?: MCP.Error;
	cts: CancellationTokenSource;
	/** Time when the task was created (client time), used to calculate TTL expiration */
	createdAtTime: number;
	/** Promise that resolves when the task execution completes */
	executionPromise: Promise<void>;
}

/**
 * Manages in-memory task state for server-side MCP tasks (sampling and elicitation).
 * Also tracks client-side tasks to survive handler reconnections.
 * Lifecycle is tied to the McpServer instance.
 */
export class McpTaskManager extends Disposable {
	private readonly _serverTasks = this._register(new DisposableMap<string, TaskEntry>());
	private readonly _clientTasks = this._register(new DisposableMap<string, IMcpTaskInternal>());
	private readonly _onDidUpdateTask = this._register(new Emitter<MCP.Task>());
	public readonly onDidUpdateTask = this._onDidUpdateTask.event;

	/**
	 * Attach a new handler to this task manager.
	 * Updates all client tasks to use the new handler.
	 */
	setHandler(handler: McpServerRequestHandler | undefined): void {
		for (const task of this._clientTasks.values()) {
			task.setHandler(handler);
		}
	}

	/**
	 * Get a client task by ID for status notification handling.
	 */
	getClientTask(taskId: string): IMcpTaskInternal | undefined {
		return this._clientTasks.get(taskId);
	}

	/**
	 * Track a new client task.
	 */
	adoptClientTask(task: IMcpTaskInternal): void {
		this._clientTasks.set(task.id, task);
	}

	/**
	 * Untracks a client task.
	 */
	abandonClientTask(taskId: string): void {
		this._clientTasks.deleteAndDispose(taskId);
	}

	/**
	 * Create a new task and execute it asynchronously.
	 * Returns the task immediately while execution continues in the background.
	 */
	public createTask<TResult extends MCP.Result>(
		ttl: number | null,
		executor: (token: CancellationToken) => Promise<TResult>
	): MCP.CreateTaskResult {
		const taskId = generateUuid();
		const createdAt = new Date().toISOString();
		const createdAtTime = Date.now();

		const task: MCP.Task = {
			taskId,
			status: 'working',
			createdAt,
			ttl,
			pollInterval: 1000, // Suggest 1 second polling interval
		};

		const store = new DisposableStore();
		const cts = new CancellationTokenSource();
		store.add(toDisposable(() => cts.dispose(true)));

		const executionPromise = this._executeTask(taskId, executor, cts.token);

		// Delete the task after its TTL. Or, if no TTL is given, delete it shortly after the task completes.
		if (ttl) {
			store.add(disposableTimeout(() => this._serverTasks.deleteAndDispose(taskId), ttl));
		} else {
			executionPromise.finally(() => {
				const timeout = this._register(disposableTimeout(() => {
					this._serverTasks.deleteAndDispose(taskId);
					this._store.delete(timeout);
				}, 60_000));
			});
		}

		this._serverTasks.set(taskId, {
			task,
			cts,
			dispose: () => store.dispose(),
			createdAtTime,
			executionPromise,
		});

		return { task };
	}

	/**
	 * Execute a task asynchronously and update its state.
	 */
	private async _executeTask<TResult extends MCP.Result>(
		taskId: string,
		executor: (token: CancellationToken) => Promise<TResult>,
		token: CancellationToken
	): Promise<void> {
		try {
			const result = await executor(token);
			this._updateTaskStatus(taskId, 'completed', undefined, result);
		} catch (error) {
			if (error instanceof CancellationError) {
				this._updateTaskStatus(taskId, 'cancelled', 'Task was cancelled by the client');
			} else if (error instanceof McpError) {
				this._updateTaskStatus(taskId, 'failed', error.message, undefined, {
					code: error.code,
					message: error.message,
					data: error.data,
				});
			} else if (error instanceof Error) {
				this._updateTaskStatus(taskId, 'failed', error.message, undefined, {
					code: MCP.INTERNAL_ERROR,
					message: error.message,
				});
			} else {
				this._updateTaskStatus(taskId, 'failed', 'Unknown error', undefined, {
					code: MCP.INTERNAL_ERROR,
					message: 'Unknown error',
				});
			}
		}
	}

	/**
	 * Update task status and optionally store result or error.
	 */
	private _updateTaskStatus(
		taskId: string,
		status: MCP.TaskStatus,
		statusMessage?: string,
		result?: MCP.Result,
		error?: MCP.Error
	): void {
		const entry = this._serverTasks.get(taskId);
		if (!entry) {
			return;
		}

		entry.task.status = status;
		if (statusMessage !== undefined) {
			entry.task.statusMessage = statusMessage;
		}
		if (result !== undefined) {
			entry.result = result;
		}
		if (error !== undefined) {
			entry.error = error;
		}

		this._onDidUpdateTask.fire({ ...entry.task });
	}

	/**
	 * Get the current state of a task.
	 * Returns an error if the task doesn't exist or has expired.
	 */
	public getTask(taskId: string): MCP.GetTaskResult {
		const entry = this._serverTasks.get(taskId);
		if (!entry) {
			throw new McpError(MCP.INVALID_PARAMS, `Task not found: ${taskId}`);
		}

		return { ...entry.task };
	}

	/**
	 * Get the result of a completed task.
	 * Blocks until the task completes if it's still in progress.
	 */
	public async getTaskResult(taskId: string): Promise<MCP.GetTaskPayloadResult> {
		const entry = this._serverTasks.get(taskId);
		if (!entry) {
			throw new McpError(MCP.INVALID_PARAMS, `Task not found: ${taskId}`);
		}

		if (entry.task.status === 'working' || entry.task.status === 'input_required') {
			await entry.executionPromise;
		}

		// Refresh entry after waiting
		const updatedEntry = this._serverTasks.get(taskId);
		if (!updatedEntry) {
			throw new McpError(MCP.INVALID_PARAMS, `Task not found: ${taskId}`);
		}

		if (updatedEntry.error) {
			throw new McpError(updatedEntry.error.code, updatedEntry.error.message, updatedEntry.error.data);
		}

		if (!updatedEntry.result) {
			throw new McpError(MCP.INTERNAL_ERROR, 'Task completed but no result available');
		}

		return updatedEntry.result;
	}

	/**
	 * Cancel a task.
	 */
	public cancelTask(taskId: string): MCP.CancelTaskResult {
		const entry = this._serverTasks.get(taskId);
		if (!entry) {
			throw new McpError(MCP.INVALID_PARAMS, `Task not found: ${taskId}`);
		}

		// Check if already in terminal status
		if (entry.task.status === 'completed' || entry.task.status === 'failed' || entry.task.status === 'cancelled') {
			throw new McpError(MCP.INVALID_PARAMS, `Cannot cancel task in ${entry.task.status} status`);
		}

		entry.task.status = 'cancelled';
		entry.task.statusMessage = 'Task was cancelled by the client';
		entry.cts.cancel();

		return { ...entry.task };
	}

	/**
	 * List all tasks.
	 */
	public listTasks(): MCP.ListTasksResult {
		const tasks: MCP.Task[] = [];

		for (const entry of this._serverTasks.values()) {
			tasks.push({ ...entry.task });
		}

		return { tasks };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpTypes.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals as arraysEqual } from '../../../../base/common/arrays.js';
import { assertNever } from '../../../../base/common/assert.js';
import { decodeHex, encodeHex, VSBuffer } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { equals as objectsEqual } from '../../../../base/common/objects.js';
import { IObservable, ObservableMap } from '../../../../base/common/observable.js';
import { IIterativePager } from '../../../../base/common/paging.js';
import Severity from '../../../../base/common/severity.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { Location } from '../../../../editor/common/languages.js';
import { localize } from '../../../../nls.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { McpGalleryManifestStatus } from '../../../../platform/mcp/common/mcpGalleryManifest.js';
import { IGalleryMcpServer, IInstallableMcpServer, IGalleryMcpServerConfiguration, IQueryOptions } from '../../../../platform/mcp/common/mcpManagement.js';
import { IMcpDevModeConfig, IMcpServerConfiguration } from '../../../../platform/mcp/common/mcpPlatformTypes.js';
import { StorageScope } from '../../../../platform/storage/common/storage.js';
import { IWorkspaceFolder, IWorkspaceFolderData } from '../../../../platform/workspace/common/workspace.js';
import { IWorkbenchLocalMcpServer, IWorkbencMcpServerInstallOptions } from '../../../services/mcp/common/mcpWorkbenchManagementService.js';
import { ToolProgress } from '../../chat/common/languageModelToolsService.js';
import { IMcpServerSamplingConfiguration } from './mcpConfiguration.js';
import { McpServerRequestHandler } from './mcpServerRequestHandler.js';
import { MCP } from './modelContextProtocol.js';
import { UriTemplate } from './uriTemplate.js';

export const extensionMcpCollectionPrefix = 'ext.';

export function extensionPrefixedIdentifier(identifier: ExtensionIdentifier, id: string): string {
	return ExtensionIdentifier.toKey(identifier) + '/' + id;
}

/**
 * An McpCollection contains McpServers. There may be multiple collections for
 * different locations servers are discovered.
 */
export interface McpCollectionDefinition {
	/** Origin authority from which this collection was discovered. */
	readonly remoteAuthority: string | null;
	/** Globally-unique, stable ID for this definition */
	readonly id: string;
	/** Human-readable label for the definition */
	readonly label: string;
	/** Definitions this collection contains. */
	readonly serverDefinitions: IObservable<readonly McpServerDefinition[]>;
	/**
	 * Trust behavior of the servers. `Trusted` means it will run without a prompt, always.
	 * `TrustedOnNonce` means it will run without a prompt as long as the nonce matches.
	 */
	readonly trustBehavior: McpServerTrust.Kind.Trusted | McpServerTrust.Kind.TrustedOnNonce;
	/** Scope where associated collection info should be stored. */
	readonly scope: StorageScope;
	/** Configuration target where configuration related to this server should be stored. */
	readonly configTarget: ConfigurationTarget;

	/** Resolves a server definition. If present, always called before a server starts. */
	resolveServerLanch?(definition: McpServerDefinition): Promise<McpServerLaunch | undefined>;

	/** For lazy-loaded collections only: */
	readonly lazy?: {
		/** True if `serverDefinitions` were loaded from the cache */
		isCached: boolean;
		/** Triggers a load of the real server definition, which should be pushed to the IMcpRegistry. If not this definition will be removed. */
		load(): Promise<void>;
		/** Called after `load()` if the extension is not found. */
		removed?(): void;
	};

	readonly source?: IWorkbenchMcpServer | ExtensionIdentifier;

	readonly presentation?: {
		/** Sort order of the collection. */
		readonly order?: number;
		/** Place where this collection is configured, used in workspace trust prompts and "show config" */
		readonly origin?: URI;
	};
}

export const enum McpCollectionSortOrder {
	WorkspaceFolder = 0,
	Workspace = 100,
	User = 200,
	Extension = 300,
	Filesystem = 400,

	RemoteBoost = -50,
}

export namespace McpCollectionDefinition {
	export interface FromExtHost {
		readonly id: string;
		readonly label: string;
		readonly isTrustedByDefault: boolean;
		readonly scope: StorageScope;
		readonly canResolveLaunch: boolean;
		readonly extensionId: string;
		readonly configTarget: ConfigurationTarget;
	}

	export function equals(a: McpCollectionDefinition, b: McpCollectionDefinition): boolean {
		return a.id === b.id
			&& a.remoteAuthority === b.remoteAuthority
			&& a.label === b.label
			&& a.trustBehavior === b.trustBehavior;
	}
}

export interface McpServerDefinition {
	/** Globally-unique, stable ID for this definition */
	readonly id: string;
	/** Human-readable label for the definition */
	readonly label: string;
	/** Descriptor defining how the configuration should be launched. */
	readonly launch: McpServerLaunch;
	/** Explicit roots. If undefined, all workspace folders. */
	readonly roots?: URI[] | undefined;
	/** If set, allows configuration variables to be resolved in the {@link launch} with the given context */
	readonly variableReplacement?: McpServerDefinitionVariableReplacement;
	/** Nonce used for caching the server. Changing the nonce will indicate that tools need to be refreshed. */
	readonly cacheNonce: string;
	/** Dev mode configuration for the server */
	readonly devMode?: IMcpDevModeConfig;
	/** Static description of server tools/data, used to hydrate the cache. */
	readonly staticMetadata?: McpServerStaticMetadata;


	readonly presentation?: {
		/** Sort order of the definition. */
		readonly order?: number;
		/** Place where this server is configured, used in workspace trust prompts and "show config" */
		readonly origin?: Location;
	};
}

export const enum McpServerStaticToolAvailability {
	/** Tool is expected to be present as soon as the server is started. */
	Initial,
	/** Tool may be present later. */
	Dynamic,
}

export interface McpServerStaticMetadata {
	tools?: { availability: McpServerStaticToolAvailability; definition: MCP.Tool }[];
	instructions?: string;
	capabilities?: MCP.ServerCapabilities;
	serverInfo?: MCP.Implementation;
}

export namespace McpServerDefinition {
	export interface Serialized {
		readonly id: string;
		readonly label: string;
		readonly cacheNonce: string;
		readonly launch: McpServerLaunch.Serialized;
		readonly variableReplacement?: McpServerDefinitionVariableReplacement.Serialized;
		readonly staticMetadata?: McpServerStaticMetadata;
	}

	export function toSerialized(def: McpServerDefinition): McpServerDefinition.Serialized {
		return def;
	}

	export function fromSerialized(def: McpServerDefinition.Serialized): McpServerDefinition {
		return {
			id: def.id,
			label: def.label,
			cacheNonce: def.cacheNonce,
			staticMetadata: def.staticMetadata,
			launch: McpServerLaunch.fromSerialized(def.launch),
			variableReplacement: def.variableReplacement ? McpServerDefinitionVariableReplacement.fromSerialized(def.variableReplacement) : undefined,
		};
	}

	export function equals(a: McpServerDefinition, b: McpServerDefinition): boolean {
		return a.id === b.id
			&& a.label === b.label
			&& a.cacheNonce === b.cacheNonce
			&& arraysEqual(a.roots, b.roots, (a, b) => a.toString() === b.toString())
			&& objectsEqual(a.launch, b.launch)
			&& objectsEqual(a.presentation, b.presentation)
			&& objectsEqual(a.variableReplacement, b.variableReplacement)
			&& objectsEqual(a.devMode, b.devMode);
	}
}


export interface McpServerDefinitionVariableReplacement {
	section?: string; // e.g. 'mcp'
	folder?: IWorkspaceFolderData;
	target: ConfigurationTarget;
}

export namespace McpServerDefinitionVariableReplacement {
	export interface Serialized {
		target: ConfigurationTarget;
		section?: string;
		folder?: { name: string; index: number; uri: UriComponents };
	}

	export function toSerialized(def: McpServerDefinitionVariableReplacement): McpServerDefinitionVariableReplacement.Serialized {
		return def;
	}

	export function fromSerialized(def: McpServerDefinitionVariableReplacement.Serialized): McpServerDefinitionVariableReplacement {
		return {
			section: def.section,
			folder: def.folder ? { ...def.folder, uri: URI.revive(def.folder.uri) } : undefined,
			target: def.target,
		};
	}
}

/** An observable of the auto-starting servers. When 'starting' is empty, the operation is complete. */
export interface IAutostartResult {
	working: boolean;
	starting: McpDefinitionReference[];
	serversRequiringInteraction: Array<McpDefinitionReference & { errorMessage?: string }>;
}

export namespace IAutostartResult {
	export const Empty: IAutostartResult = { working: false, starting: [], serversRequiringInteraction: [] };
}

export interface IMcpService {
	_serviceBrand: undefined;
	readonly servers: IObservable<readonly IMcpServer[]>;

	/** Resets the cached tools. */
	resetCaches(): void;

	/** Resets trusted MCP servers. */
	resetTrust(): void;

	/** Set if there are extensions that register MCP servers that have never been activated. */
	readonly lazyCollectionState: IObservable<{ state: LazyCollectionState; collections: McpCollectionDefinition[] }>;

	/** Auto-starts pending servers based on user settings. */
	autostart(token?: CancellationToken): IObservable<IAutostartResult>;

	/** Cancels any current autostart @internal */
	cancelAutostart(): void;

	/** Activates extension-providing MCP servers that have not yet been discovered. */
	activateCollections(): Promise<void>;
}

export const enum LazyCollectionState {
	HasUnknown,
	LoadingUnknown,
	AllKnown,
}

export const IMcpService = createDecorator<IMcpService>('IMcpService');

export interface McpCollectionReference {
	id: string;
	label: string;
	presentation?: McpCollectionDefinition['presentation'];
}

export interface McpDefinitionReference {
	id: string;
	label: string;
}

export class McpStartServerInteraction {
	/** @internal */
	public readonly participants = new ObservableMap</* server definition ID */ string, { s: 'unknown' | 'resolved' } | { s: 'waiting'; definition: McpServerDefinition; collection: McpCollectionDefinition }>();
	choice?: Promise<string[] | undefined>;
}

export interface IMcpServerStartOpts {
	/**
	 * Automatically trust if changed. This should ONLY be set for afforances that
	 * ensure the user sees the config before it gets started (e.g. code lenses)
	 */
	autoTrustChanges?: boolean;
	/**
	 * When to trigger the trust prompt.
	 * - only-new: only prompt for servers that are not previously explicitly untrusted (default)
	 * - all-untrusted: prompt for all servers that are not trusted
	 * - never: don't prompt, fail silently when trying to start an untrusted server
	 */
	promptType?: 'only-new' | 'all-untrusted' | 'never';
	/** True if th servre should be launched with debugging. */
	debug?: boolean;
	/** Correlate multiple interactions such that any trust prompts are presented in combination. */
	interaction?: McpStartServerInteraction;
	/**
	 * If true, throw an error if any user interaction would be required during startup.
	 * This includes variable resolution, trust prompts, and authentication prompts.
	 */
	errorOnUserInteraction?: boolean;
}

export namespace McpServerTrust {
	export const enum Kind {
		/** The server is trusted */
		Trusted,
		/** The server is trusted as long as its nonce matches */
		TrustedOnNonce,
		/** The server trust was denied. */
		Untrusted,
		/** The server is not yet trusted or untrusted. */
		Unknown,
	}
}

export interface IMcpServer extends IDisposable {
	readonly collection: McpCollectionReference;
	readonly definition: McpDefinitionReference;
	readonly connection: IObservable<IMcpServerConnection | undefined>;
	readonly connectionState: IObservable<McpConnectionState>;
	readonly serverMetadata: IObservable<{
		serverName?: string;
		serverInstructions?: string;
		icons: IMcpIcons;
	} | undefined>;

	/**
	 * Full definition as it exists in the MCP registry. Unlike the references
	 * in `collection` and `definition`, this may change over time.
	 */
	readDefinitions(): IObservable<{ server: McpServerDefinition | undefined; collection: McpCollectionDefinition | undefined }>;

	showOutput(preserveFocus?: boolean): Promise<void>;
	/**
	 * Starts the server and returns its resulting state. One of:
	 * - Running, if all good
	 * - Error, if the server failed to start
	 * - Stopped, if the server was disposed or the user cancelled the launch
	 */
	start(opts?: IMcpServerStartOpts): Promise<McpConnectionState>;
	stop(): Promise<void>;

	readonly cacheState: IObservable<McpServerCacheState>;
	readonly tools: IObservable<readonly IMcpTool[]>;
	readonly prompts: IObservable<readonly IMcpPrompt[]>;
	readonly capabilities: IObservable<McpCapability | undefined>;

	/**
	 * Lists all resources on the server.
	 */
	resources(token?: CancellationToken): AsyncIterable<IMcpResource[]>;

	/**
	 * List resource templates on the server.
	 */
	resourceTemplates(token?: CancellationToken): Promise<IMcpResourceTemplate[]>;
}

/**
 * A representation of an MCP resource. The `uri` is namespaced to VS Code and
 * can be used in filesystem APIs.
 */
export interface IMcpResource {
	/** Identifier for the file in VS Code and operable with filesystem API */
	readonly uri: URI;
	/** Identifier of the file as given from the MCP server. */
	readonly mcpUri: string;
	readonly name: string;
	readonly title?: string;
	readonly description?: string;
	readonly mimeType?: string;
	readonly sizeInBytes?: number;
	readonly icons: IMcpIcons;
}

export interface IMcpResourceTemplate {
	readonly name: string;
	readonly title?: string;
	readonly description?: string;
	readonly mimeType?: string;
	readonly template: UriTemplate;
	readonly icons: IMcpIcons;

	/** Gets string completions for the given template part. */
	complete(templatePart: string, prefix: string, alreadyResolved: Record<string, string | string[]>, token: CancellationToken): Promise<string[]>;

	/** Gets the resolved URI from template parts. */
	resolveURI(vars: Record<string, unknown>): URI;
}

export const isMcpResourceTemplate = (obj: IMcpResource | IMcpResourceTemplate): obj is IMcpResourceTemplate => {
	return (obj as IMcpResourceTemplate).template !== undefined;
};
export const isMcpResource = (obj: IMcpResource | IMcpResourceTemplate): obj is IMcpResource => {
	return (obj as IMcpResource).mcpUri !== undefined;
};

export const enum McpServerCacheState {
	/** Tools have not been read before */
	Unknown,
	/** Tools were read from the cache */
	Cached,
	/** Tools were read from the cache or live, but they may be outdated. */
	Outdated,
	/** Tools are refreshing for the first time */
	RefreshingFromUnknown,
	/** Tools are refreshing and the current tools are cached */
	RefreshingFromCached,
	/** Tool state is live, server is connected */
	Live,
}

export interface IMcpPrompt {
	readonly id: string;
	readonly name: string;
	readonly title?: string;
	readonly description?: string;
	readonly arguments: readonly MCP.PromptArgument[];

	/** Gets string completions for the given prompt part. */
	complete(argument: string, prefix: string, alreadyResolved: Record<string, string>, token: CancellationToken): Promise<string[]>;

	resolve(args: Record<string, string | undefined>, token?: CancellationToken): Promise<IMcpPromptMessage[]>;
}

export const mcpPromptReplaceSpecialChars = (s: string) => s.replace(/[^a-z0-9_.-]/gi, '_');

export const mcpPromptPrefix = (definition: McpDefinitionReference) =>
	`/mcp.` + mcpPromptReplaceSpecialChars(definition.label);

export interface IMcpPromptMessage extends MCP.PromptMessage { }

export interface IMcpToolCallContext {
	chatSessionId?: string;
	chatRequestId?: string;
}

export interface IMcpTool {

	readonly id: string;
	/** Name for #referencing in chat */
	readonly referenceName: string;
	readonly icons: IMcpIcons;
	readonly definition: MCP.Tool;

	/**
	 * Calls a tool
	 * @throws {@link MpcResponseError} if the tool fails to execute
	 * @throws {@link McpConnectionFailedError} if the connection to the server fails
	 */
	call(params: Record<string, unknown>, context?: IMcpToolCallContext, token?: CancellationToken): Promise<MCP.CallToolResult>;

	/**
	 * Identical to {@link call}, but reports progress.
	 */
	callWithProgress(params: Record<string, unknown>, progress: ToolProgress, context?: IMcpToolCallContext, token?: CancellationToken): Promise<MCP.CallToolResult>;
}

export const enum McpServerTransportType {
	/** A command-line MCP server communicating over standard in/out */
	Stdio = 1 << 0,
	/** An MCP server that uses Server-Sent Events */
	HTTP = 1 << 1,
}

/**
 * MCP server launched on the command line which communicated over stdio.
 * https://spec.modelcontextprotocol.io/specification/2024-11-05/basic/transports/#stdio
 */
export interface McpServerTransportStdio {
	readonly type: McpServerTransportType.Stdio;
	readonly cwd: string | undefined;
	readonly command: string;
	readonly args: readonly string[];
	readonly env: Record<string, string | number | null>;
	readonly envFile: string | undefined;
}

export interface McpServerTransportHTTPAuthentication {
	/**
	 * Authentication provider ID to use to get a session for the initial MCP server connection.
	 */
	readonly providerId: string;
	/**
	 * Scopes to use to get a session for the initial MCP server connection.
	 */
	readonly scopes: string[];
}

/**
 * MCP server launched on the command line which communicated over SSE or Streamable HTTP.
 * https://spec.modelcontextprotocol.io/specification/2024-11-05/basic/transports/#http-with-sse
 * https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http
 */
export interface McpServerTransportHTTP {
	readonly type: McpServerTransportType.HTTP;
	readonly uri: URI;
	readonly headers: [string, string][];
	readonly authentication?: McpServerTransportHTTPAuthentication;
}

export type McpServerLaunch =
	| McpServerTransportStdio
	| McpServerTransportHTTP;

export namespace McpServerLaunch {
	export type Serialized =
		| { type: McpServerTransportType.HTTP; uri: UriComponents; headers: [string, string][]; authentication?: McpServerTransportHTTPAuthentication }
		| { type: McpServerTransportType.Stdio; cwd: string | undefined; command: string; args: readonly string[]; env: Record<string, string | number | null>; envFile: string | undefined };

	export function toSerialized(launch: McpServerLaunch): McpServerLaunch.Serialized {
		return launch;
	}

	export function fromSerialized(launch: McpServerLaunch.Serialized): McpServerLaunch {
		switch (launch.type) {
			case McpServerTransportType.HTTP:
				return { type: launch.type, uri: URI.revive(launch.uri), headers: launch.headers, authentication: launch.authentication };
			case McpServerTransportType.Stdio:
				return {
					type: launch.type,
					cwd: launch.cwd,
					command: launch.command,
					args: launch.args,
					env: launch.env,
					envFile: launch.envFile,
				};
		}
	}

	export async function hash(launch: McpServerLaunch): Promise<string> {
		const nonce = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(launch)));
		return encodeHex(VSBuffer.wrap(new Uint8Array(nonce)));
	}
}

/**
 * An instance that manages a connection to an MCP server. It can be started,
 * stopped, and restarted. Once started and in a running state, it will
 * eventually build a {@link IMcpServerConnection.handler}.
 */
export interface IMcpServerConnection extends IDisposable {
	readonly definition: McpServerDefinition;
	readonly state: IObservable<McpConnectionState>;
	readonly handler: IObservable<McpServerRequestHandler | undefined>;

	/**
	 * Resolved launch definition. Might not match the `definition.launch` due to
	 * resolution logic in extension-provided MCPs.
	 */
	readonly launchDefinition: McpServerLaunch;

	/**
	 * Starts the server if it's stopped. Returns a promise that resolves once
	 * server exits a 'starting' state.
	 */
	start(methods: IMcpClientMethods): Promise<McpConnectionState>;

	/**
	 * Stops the server.
	 */
	stop(): Promise<void>;
}

/** Client methods whose implementations are passed through the server connection. */
export interface IMcpClientMethods {
	/** Handler for `sampling/createMessage` */
	createMessageRequestHandler?(req: MCP.CreateMessageRequest['params'], token?: CancellationToken): Promise<MCP.CreateMessageResult>;
	/** Handler for `elicitation/create` */
	elicitationRequestHandler?(req: MCP.ElicitRequest['params'], token?: CancellationToken): Promise<MCP.ElicitResult>;
}

/**
 * McpConnectionState is the state of the underlying connection and is
 * communicated e.g. from the extension host to the renderer.
 */
export namespace McpConnectionState {
	export const enum Kind {
		Stopped,
		Starting,
		Running,
		Error,
	}

	export const toString = (s: McpConnectionState): string => {
		switch (s.state) {
			case Kind.Stopped:
				return localize('mcpstate.stopped', 'Stopped');
			case Kind.Starting:
				return localize('mcpstate.starting', 'Starting');
			case Kind.Running:
				return localize('mcpstate.running', 'Running');
			case Kind.Error:
				return localize('mcpstate.error', 'Error {0}', s.message);
			default:
				assertNever(s);
		}
	};

	export const toKindString = (s: McpConnectionState.Kind): string => {
		switch (s) {
			case Kind.Stopped:
				return 'stopped';
			case Kind.Starting:
				return 'starting';
			case Kind.Running:
				return 'running';
			case Kind.Error:
				return 'error';
			default:
				assertNever(s);
		}
	};

	/** Returns if the MCP state is one where starting a new server is valid */
	export const canBeStarted = (s: Kind) => s === Kind.Error || s === Kind.Stopped;

	/** Gets whether the state is a running state. */
	export const isRunning = (s: McpConnectionState) => !canBeStarted(s.state);

	export interface Stopped {
		readonly state: Kind.Stopped;
		readonly reason?: 'needs-user-interaction';
	}

	export interface Starting {
		readonly state: Kind.Starting;
	}

	export interface Running {
		readonly state: Kind.Running;
	}

	export interface Error {
		readonly state: Kind.Error;
		readonly code?: string;
		readonly shouldRetry?: boolean;
		readonly message: string;
	}
}

export type McpConnectionState =
	| McpConnectionState.Stopped
	| McpConnectionState.Starting
	| McpConnectionState.Running
	| McpConnectionState.Error;

export class MpcResponseError extends Error {
	constructor(message: string, public readonly code: number, public readonly data: unknown) {
		super(`MPC ${code}: ${message}`);
	}
}

export class McpConnectionFailedError extends Error { }

export class UserInteractionRequiredError extends Error {
	private static readonly prefix = 'User interaction required: ';

	public static is(error: Error): boolean {
		return error.message.startsWith(this.prefix);
	}

	constructor(public readonly reason: string) {
		super(`${UserInteractionRequiredError.prefix}${reason}`);
	}
}

export interface IMcpConfigPath {
	id: string;
	key: 'userLocalValue' | 'userRemoteValue' | 'workspaceValue' | 'workspaceFolderValue';
	label: string;
	scope: StorageScope;
	target: ConfigurationTarget;
	order: number;
	remoteAuthority?: string;
	uri: URI | undefined;
	section?: string[];
	workspaceFolder?: IWorkspaceFolder;
}

export interface IMcpServerContainer extends IDisposable {
	mcpServer: IWorkbenchMcpServer | null;
	update(): void;
}

export interface IMcpServerEditorOptions extends IEditorOptions {
	tab?: McpServerEditorTab;
	sideByside?: boolean;
}

export const enum McpServerEnablementState {
	Disabled,
	DisabledByAccess,
	Enabled,
}

export const enum McpServerInstallState {
	Installing,
	Installed,
	Uninstalling,
	Uninstalled
}

export const enum McpServerEditorTab {
	Readme = 'readme',
	Manifest = 'manifest',
	Configuration = 'configuration',
}

export type McpServerEnablementStatus = {
	readonly state: McpServerEnablementState;
	readonly message?: {
		readonly severity: Severity;
		readonly text: IMarkdownString;
	};
};

export interface IWorkbenchMcpServer {
	readonly gallery: IGalleryMcpServer | undefined;
	readonly local: IWorkbenchLocalMcpServer | undefined;
	readonly installable: IInstallableMcpServer | undefined;
	readonly installState: McpServerInstallState;
	readonly runtimeStatus: McpServerEnablementStatus | undefined;
	readonly id: string;
	readonly name: string;
	readonly label: string;
	readonly description: string;
	readonly icon?: {
		readonly dark: string;
		readonly light: string;
	};
	readonly codicon?: string;
	readonly publisherUrl?: string;
	readonly publisherDisplayName?: string;
	readonly starsCount?: number;
	readonly license?: string;
	readonly repository?: string;
	readonly config?: IMcpServerConfiguration | undefined;
	readonly readmeUrl?: URI;
	getReadme(token: CancellationToken): Promise<string>;
	getManifest(token: CancellationToken): Promise<IGalleryMcpServerConfiguration>;
}

export const IMcpWorkbenchService = createDecorator<IMcpWorkbenchService>('IMcpWorkbenchService');
export interface IMcpWorkbenchService {
	readonly _serviceBrand: undefined;
	readonly onChange: Event<IWorkbenchMcpServer | undefined>;
	readonly onReset: Event<void>;
	readonly local: readonly IWorkbenchMcpServer[];
	getEnabledLocalMcpServers(): IWorkbenchLocalMcpServer[];
	queryLocal(): Promise<IWorkbenchMcpServer[]>;
	queryGallery(options?: IQueryOptions, token?: CancellationToken): Promise<IIterativePager<IWorkbenchMcpServer>>;
	canInstall(mcpServer: IWorkbenchMcpServer): true | IMarkdownString;
	install(server: IWorkbenchMcpServer, installOptions?: IWorkbencMcpServerInstallOptions): Promise<IWorkbenchMcpServer>;
	uninstall(mcpServer: IWorkbenchMcpServer): Promise<void>;
	getMcpConfigPath(arg: IWorkbenchLocalMcpServer): IMcpConfigPath | undefined;
	getMcpConfigPath(arg: URI): Promise<IMcpConfigPath | undefined>;
	openSearch(searchValue: string, preserveFoucs?: boolean): Promise<void>;
	open(extension: IWorkbenchMcpServer | string, options?: IMcpServerEditorOptions): Promise<void>;
}

export class McpServerContainers extends Disposable {
	constructor(
		private readonly containers: IMcpServerContainer[],
		@IMcpWorkbenchService mcpWorkbenchService: IMcpWorkbenchService
	) {
		super();
		this._register(mcpWorkbenchService.onChange(this.update, this));
	}

	set mcpServer(extension: IWorkbenchMcpServer | null) {
		this.containers.forEach(c => c.mcpServer = extension);
	}

	update(server: IWorkbenchMcpServer | undefined): void {
		for (const container of this.containers) {
			if (server && container.mcpServer) {
				if (server.id === container.mcpServer.id) {
					container.mcpServer = server;
				}
			} else {
				container.update();
			}
		}
	}
}

export const McpServersGalleryStatusContext = new RawContextKey<string>('mcpServersGalleryStatus', McpGalleryManifestStatus.Unavailable);
export const HasInstalledMcpServersContext = new RawContextKey<boolean>('hasInstalledMcpServers', true);
export const InstalledMcpServersViewId = 'workbench.views.mcp.installed';

export namespace McpResourceURI {
	export const scheme = 'mcp-resource';

	// Random placeholder for empty authorities, otherwise they're represente as
	// `scheme//path/here` in the URI which would get normalized to `scheme/path/here`.
	const emptyAuthorityPlaceholder = 'dylo78gyp'; // chosen by a fair dice roll. Guaranteed to be random.

	export function fromServer(def: McpDefinitionReference, resourceURI: URI | string): URI {
		if (typeof resourceURI === 'string') {
			resourceURI = URI.parse(resourceURI);
		}
		return resourceURI.with({
			scheme,
			authority: encodeHex(VSBuffer.fromString(def.id)),
			path: ['', resourceURI.scheme, resourceURI.authority || emptyAuthorityPlaceholder].join('/') + resourceURI.path,
		});
	}

	export function toServer(uri: URI | string): { definitionId: string; resourceURL: URL } {
		if (typeof uri === 'string') {
			uri = URI.parse(uri);
		}
		if (uri.scheme !== scheme) {
			throw new Error(`Invalid MCP resource URI: ${uri.toString()}`);
		}
		const parts = uri.path.split('/');
		if (parts.length < 3) {
			throw new Error(`Invalid MCP resource URI: ${uri.toString()}`);
		}
		const [, serverScheme, authority, ...path] = parts;

		// URI cannot correctly stringify empty authorities (#250905) so we use URL instead to construct
		const url = new URL(`${serverScheme}://${authority.toLowerCase() === emptyAuthorityPlaceholder ? '' : authority}`);
		url.pathname = path.length ? ('/' + path.join('/')) : '';
		url.search = uri.query;
		url.hash = uri.fragment;

		return {
			definitionId: decodeHex(uri.authority).toString(),
			resourceURL: url,
		};
	}

}

/** Warning: this enum is cached in `mcpServer.ts` and all changes MUST only be additive. */
export const enum McpCapability {
	Logging = 1 << 0,
	Completions = 1 << 1,
	Prompts = 1 << 2,
	PromptsListChanged = 1 << 3,
	Resources = 1 << 4,
	ResourcesSubscribe = 1 << 5,
	ResourcesListChanged = 1 << 6,
	Tools = 1 << 7,
	ToolsListChanged = 1 << 8,
}

export interface ISamplingOptions {
	server: IMcpServer;
	isDuringToolCall: boolean;
	params: MCP.CreateMessageRequest['params'];
}

export interface ISamplingResult {
	sample: MCP.CreateMessageResult;
}

export interface IMcpSamplingService {
	_serviceBrand: undefined;

	sample(opts: ISamplingOptions, token?: CancellationToken): Promise<ISamplingResult>;

	/** Whether MCP sampling logs are available for this server */
	hasLogs(server: IMcpServer): boolean;
	/** Gets a text report of the MCP server's sampling usage */
	getLogText(server: IMcpServer): string;

	getConfig(server: IMcpServer): IMcpServerSamplingConfiguration;
	updateConfig(server: IMcpServer, mutate: (r: IMcpServerSamplingConfiguration) => unknown): Promise<IMcpServerSamplingConfiguration>;
}

export const IMcpSamplingService = createDecorator<IMcpSamplingService>('IMcpServerSampling');

export class McpError extends Error {
	public static methodNotFound(method: string) {
		return new McpError(MCP.METHOD_NOT_FOUND, `Method not found: ${method}`);
	}

	public static notAllowed() {
		return new McpError(-32000, 'The user has denied permission to call this method.');
	}

	public static unknown(e: Error) {
		const mcpError = new McpError(MCP.INTERNAL_ERROR, `Unknown error: ${e.stack}`);
		mcpError.cause = e;
		return mcpError;
	}

	constructor(
		public readonly code: number,
		message: string,
		public readonly data?: unknown
	) {
		super(message);
	}
}

export const enum McpToolName {
	Prefix = 'mcp_',
	MaxPrefixLen = 18,
	MaxLength = 64,
}


export interface IMcpElicitationService {
	_serviceBrand: undefined;

	/**
	 * Elicits a response from the user. The `context` is optional and can be used
	 * to provide additional information about the request.
	 *
	 * @param context Context for the elicitation, e.g. chat session ID.
	 * @param elicitation Request to elicit a response.
	 * @returns A promise that resolves to an {@link ElicitationResult}.
	 */
	elicit(server: IMcpServer, context: IMcpToolCallContext | undefined, elicitation: MCP.ElicitRequest['params'], token: CancellationToken): Promise<ElicitResult>;
}

export const enum ElicitationKind {
	Form,
	URL,
}

export interface IUrlModeElicitResult extends IDisposable {
	kind: ElicitationKind.URL;
	value: MCP.ElicitResult;
	/**
	 * Waits until the server tells us the elicitation is completed before resolving.
	 * Rejects with a CancellationError if the server stops before elicitation is
	 * complete, or if the token is cancelled.
	 */
	wait: Promise<void>;
}

export interface IFormModeElicitResult extends IDisposable {
	kind: ElicitationKind.Form;
	value: MCP.ElicitResult;
}

export type ElicitResult = IUrlModeElicitResult | IFormModeElicitResult;

export const IMcpElicitationService = createDecorator<IMcpElicitationService>('IMcpElicitationService');

export const McpToolResourceLinkMimeType = 'application/vnd.code.resource-link';

export interface IMcpToolResourceLinkContents {
	uri: UriComponents;
	underlyingMimeType?: string;
}

export interface IMcpIcons {
	/** Gets the image URI appropriate to the approximate display size */
	getUrl(size: number): { dark: URI; light?: URI } | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mcp/common/mcpTypesUtils.ts]---
Location: vscode-main/src/vs/workbench/contrib/mcp/common/mcpTypesUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { disposableTimeout, timeout } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { autorun, IReader } from '../../../../base/common/observable.js';
import { ToolDataSource } from '../../chat/common/languageModelToolsService.js';
import { IMcpServer, IMcpServerStartOpts, IMcpService, McpConnectionState, McpServerCacheState, McpServerTransportType } from './mcpTypes.js';
import { MCP } from './modelContextProtocol.js';


/**
 * Waits up to `timeout` for a server passing the filter to be discovered,
 * and then starts it.
 */
export function startServerByFilter(mcpService: IMcpService, filter: (s: IMcpServer) => boolean, timeout = 5000) {
	return new Promise<void>((resolve, reject) => {
		const store = new DisposableStore();
		store.add(autorun(reader => {
			const servers = mcpService.servers.read(reader);
			const server = servers.find(filter);

			if (server) {
				server.start({ promptType: 'all-untrusted' }).then(state => {
					if (state.state === McpConnectionState.Kind.Error) {
						server.showOutput();
					}
				});

				resolve();
				store.dispose();
			}
		}));

		store.add(disposableTimeout(() => {
			store.dispose();
			reject(new CancellationError());
		}, timeout));
	});
}

/**
 * Starts a server (if needed) and waits for its tools to be live. Returns
 * true/false whether this happened successfully.
 */
export async function startServerAndWaitForLiveTools(server: IMcpServer, opts?: IMcpServerStartOpts, token?: CancellationToken): Promise<boolean> {
	const r = await server.start(opts);

	const store = new DisposableStore();
	const ok = await new Promise<boolean>(resolve => {
		if (token?.isCancellationRequested || r.state === McpConnectionState.Kind.Error || r.state === McpConnectionState.Kind.Stopped) {
			return resolve(false);
		}

		if (token) {
			store.add(token.onCancellationRequested(() => {
				resolve(false);
			}));
		}

		store.add(autorun(reader => {
			const connState = server.connectionState.read(reader).state;
			if (connState === McpConnectionState.Kind.Error || connState === McpConnectionState.Kind.Stopped) {
				resolve(false); // some error, don't block the request
			}

			const toolState = server.cacheState.read(reader);
			if (toolState === McpServerCacheState.Live) {
				resolve(true); // got tools, all done
			}
		}));
	});

	if (ok) {
		await timeout(0); // let the tools register in the language model contribution
	}

	return ok;
}

export function mcpServerToSourceData(server: IMcpServer, reader?: IReader): ToolDataSource {
	const metadata = server.serverMetadata.read(reader);
	return {
		type: 'mcp',
		serverLabel: metadata?.serverName,
		instructions: metadata?.serverInstructions,
		label: server.definition.label,
		collectionId: server.collection.id,
		definitionId: server.definition.id
	};
}


/**
 * Validates whether the given HTTP or HTTPS resource is allowed for the specified MCP server.
 *
 * @param resource The URI of the resource to validate.
 * @param server The MCP server instance to validate against, or undefined.
 * @returns True if the resource request is valid for the server, false otherwise.
 */
export function canLoadMcpNetworkResourceDirectly(resource: URL, server: IMcpServer | undefined) {
	let isResourceRequestValid = false;
	if (resource.protocol === 'http:') {
		const launch = server?.connection.get()?.launchDefinition;
		if (launch && launch.type === McpServerTransportType.HTTP && launch.uri.authority.toLowerCase() === resource.host.toLowerCase()) {
			isResourceRequestValid = true;
		}
	} else if (resource.protocol === 'https:') {
		isResourceRequestValid = true;
	}
	return isResourceRequestValid;
}

export function isTaskResult(obj: MCP.Result | MCP.CreateTaskResult): obj is MCP.CreateTaskResult {
	return (obj as MCP.CreateTaskResult).task !== undefined;
}
```

--------------------------------------------------------------------------------

````

---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 347
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 347 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/chatSessions.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatSessions.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { sep } from '../../../../base/common/path.js';
import { raceCancellationError } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { combinedDisposable, Disposable, DisposableMap, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { Schemas } from '../../../../base/common/network.js';
import * as resources from '../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { localize, localize2 } from '../../../../nls.js';
import { Action2, IMenuService, MenuId, MenuItemAction, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IRelaxedExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { isDark } from '../../../../platform/theme/common/theme.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IExtensionService, isProposedApiEnabled } from '../../../services/extensions/common/extensions.js';
import { ExtensionsRegistry } from '../../../services/extensions/common/extensionsRegistry.js';
import { ChatEditorInput } from '../browser/chatEditorInput.js';
import { IChatAgentAttachmentCapabilities, IChatAgentData, IChatAgentService } from '../common/chatAgents.js';
import { ChatContextKeys } from '../common/chatContextKeys.js';
import { IChatSession, IChatSessionContentProvider, IChatSessionItem, IChatSessionItemProvider, IChatSessionProviderOptionGroup, IChatSessionProviderOptionItem, IChatSessionsExtensionPoint, IChatSessionsService, isSessionInProgressStatus, localChatSessionType, SessionOptionsChangedCallback } from '../common/chatSessionsService.js';
import { ChatAgentLocation, ChatModeKind } from '../common/constants.js';
import { CHAT_CATEGORY } from './actions/chatActions.js';
import { IChatEditorOptions } from './chatEditor.js';
import { IChatModel } from '../common/chatModel.js';
import { IChatService, IChatToolInvocation } from '../common/chatService.js';
import { autorun, autorunIterableDelta, observableSignalFromEvent } from '../../../../base/common/observable.js';
import { IChatRequestVariableEntry } from '../common/chatVariableEntries.js';
import { renderAsPlaintext } from '../../../../base/browser/markdownRenderer.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { ChatViewId } from './chat.js';
import { ChatViewPane } from './chatViewPane.js';

const extensionPoint = ExtensionsRegistry.registerExtensionPoint<IChatSessionsExtensionPoint[]>({
	extensionPoint: 'chatSessions',
	jsonSchema: {
		description: localize('chatSessionsExtPoint', 'Contributes chat session integrations to the chat widget.'),
		type: 'array',
		items: {
			type: 'object',
			additionalProperties: false,
			properties: {
				type: {
					description: localize('chatSessionsExtPoint.chatSessionType', 'Unique identifier for the type of chat session.'),
					type: 'string',
				},
				name: {
					description: localize('chatSessionsExtPoint.name', 'Name of the dynamically registered chat participant (eg: @agent). Must not contain whitespace.'),
					type: 'string',
					pattern: '^[\\w-]+$'
				},
				displayName: {
					description: localize('chatSessionsExtPoint.displayName', 'A longer name for this item which is used for display in menus.'),
					type: 'string',
				},
				description: {
					description: localize('chatSessionsExtPoint.description', 'Description of the chat session for use in menus and tooltips.'),
					type: 'string'
				},
				when: {
					description: localize('chatSessionsExtPoint.when', 'Condition which must be true to show this item.'),
					type: 'string'
				},
				icon: {
					description: localize('chatSessionsExtPoint.icon', 'Icon identifier (codicon ID) for the chat session editor tab. For example, "$(github)" or "$(cloud)".'),
					anyOf: [{
						type: 'string'
					},
					{
						type: 'object',
						properties: {
							light: {
								description: localize('icon.light', 'Icon path when a light theme is used'),
								type: 'string'
							},
							dark: {
								description: localize('icon.dark', 'Icon path when a dark theme is used'),
								type: 'string'
							}
						}
					}]
				},
				order: {
					description: localize('chatSessionsExtPoint.order', 'Order in which this item should be displayed.'),
					type: 'integer'
				},
				alternativeIds: {
					description: localize('chatSessionsExtPoint.alternativeIds', 'Alternative identifiers for backward compatibility.'),
					type: 'array',
					items: {
						type: 'string'
					}
				},
				welcomeTitle: {
					description: localize('chatSessionsExtPoint.welcomeTitle', 'Title text to display in the chat welcome view for this session type.'),
					type: 'string'
				},
				welcomeMessage: {
					description: localize('chatSessionsExtPoint.welcomeMessage', 'Message text (supports markdown) to display in the chat welcome view for this session type.'),
					type: 'string'
				},
				welcomeTips: {
					description: localize('chatSessionsExtPoint.welcomeTips', 'Tips text (supports markdown and theme icons) to display in the chat welcome view for this session type.'),
					type: 'string'
				},
				inputPlaceholder: {
					description: localize('chatSessionsExtPoint.inputPlaceholder', 'Placeholder text to display in the chat input box for this session type.'),
					type: 'string'
				},
				capabilities: {
					description: localize('chatSessionsExtPoint.capabilities', 'Optional capabilities for this chat session.'),
					type: 'object',
					additionalProperties: false,
					properties: {
						supportsFileAttachments: {
							description: localize('chatSessionsExtPoint.supportsFileAttachments', 'Whether this chat session supports attaching files or file references.'),
							type: 'boolean'
						},
						supportsToolAttachments: {
							description: localize('chatSessionsExtPoint.supportsToolAttachments', 'Whether this chat session supports attaching tools or tool references.'),
							type: 'boolean'
						},
						supportsMCPAttachments: {
							description: localize('chatSessionsExtPoint.supportsMCPAttachments', 'Whether this chat session supports attaching MCP resources.'),
							type: 'boolean'
						},
						supportsImageAttachments: {
							description: localize('chatSessionsExtPoint.supportsImageAttachments', 'Whether this chat session supports attaching images.'),
							type: 'boolean'
						},
						supportsSearchResultAttachments: {
							description: localize('chatSessionsExtPoint.supportsSearchResultAttachments', 'Whether this chat session supports attaching search results.'),
							type: 'boolean'
						},
						supportsInstructionAttachments: {
							description: localize('chatSessionsExtPoint.supportsInstructionAttachments', 'Whether this chat session supports attaching instructions.'),
							type: 'boolean'
						},
						supportsSourceControlAttachments: {
							description: localize('chatSessionsExtPoint.supportsSourceControlAttachments', 'Whether this chat session supports attaching source control changes.'),
							type: 'boolean'
						},
						supportsProblemAttachments: {
							description: localize('chatSessionsExtPoint.supportsProblemAttachments', 'Whether this chat session supports attaching problems.'),
							type: 'boolean'
						},
						supportsSymbolAttachments: {
							description: localize('chatSessionsExtPoint.supportsSymbolAttachments', 'Whether this chat session supports attaching symbols.'),
							type: 'boolean'
						}
					}
				},
				commands: {
					markdownDescription: localize('chatCommandsDescription', "Commands available for this chat session, which the user can invoke with a `/`."),
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
						}
					}
				},
				canDelegate: {
					description: localize('chatSessionsExtPoint.canDelegate', 'Whether delegation is supported. Default is false. Note that enabling this is experimental and may not be respected at all times.'),
					type: 'boolean',
					default: false
				}
			},
			required: ['type', 'name', 'displayName', 'description'],
		}
	},
	activationEventsGenerator: function* (contribs) {
		for (const contrib of contribs) {
			yield `onChatSession:${contrib.type}`;
		}
	}
});

class ContributedChatSessionData extends Disposable {

	private readonly _optionsCache: Map<string /* 'models' */, string | IChatSessionProviderOptionItem>;
	public getOption(optionId: string): string | IChatSessionProviderOptionItem | undefined {
		return this._optionsCache.get(optionId);
	}
	public setOption(optionId: string, value: string | IChatSessionProviderOptionItem): void {
		this._optionsCache.set(optionId, value);
	}

	constructor(
		readonly session: IChatSession,
		readonly chatSessionType: string,
		readonly resource: URI,
		readonly options: Record<string, string | IChatSessionProviderOptionItem> | undefined,
		private readonly onWillDispose: (resource: URI) => void
	) {
		super();

		this._optionsCache = new Map<string, string | IChatSessionProviderOptionItem>();
		if (options) {
			for (const [key, value] of Object.entries(options)) {
				this._optionsCache.set(key, value);
			}
		}

		this._register(this.session.onWillDispose(() => {
			this.onWillDispose(this.resource);
		}));
	}
}


export class ChatSessionsService extends Disposable implements IChatSessionsService {
	readonly _serviceBrand: undefined;

	private readonly _itemsProviders: Map</* type */ string, IChatSessionItemProvider> = new Map();

	private readonly _contributions: Map</* type */ string, { readonly contribution: IChatSessionsExtensionPoint; readonly extension: IRelaxedExtensionDescription }> = new Map();
	private readonly _contributionDisposables = this._register(new DisposableMap</* type */ string>());

	private readonly _contentProviders: Map</* scheme */ string, IChatSessionContentProvider> = new Map();
	private readonly _alternativeIdMap: Map</* alternativeId */ string, /* primaryType */ string> = new Map();
	private readonly _contextKeys = new Set<string>();

	private readonly _onDidChangeItemsProviders = this._register(new Emitter<IChatSessionItemProvider>());
	readonly onDidChangeItemsProviders: Event<IChatSessionItemProvider> = this._onDidChangeItemsProviders.event;

	private readonly _onDidChangeSessionItems = this._register(new Emitter<string>());
	readonly onDidChangeSessionItems: Event<string> = this._onDidChangeSessionItems.event;

	private readonly _onDidChangeAvailability = this._register(new Emitter<void>());
	readonly onDidChangeAvailability: Event<void> = this._onDidChangeAvailability.event;

	private readonly _onDidChangeInProgress = this._register(new Emitter<void>());
	public get onDidChangeInProgress() { return this._onDidChangeInProgress.event; }

	private readonly _onDidChangeContentProviderSchemes = this._register(new Emitter<{ readonly added: string[]; readonly removed: string[] }>());
	public get onDidChangeContentProviderSchemes() { return this._onDidChangeContentProviderSchemes.event; }
	private readonly _onDidChangeSessionOptions = this._register(new Emitter<URI>());
	public get onDidChangeSessionOptions() { return this._onDidChangeSessionOptions.event; }
	private readonly _onDidChangeOptionGroups = this._register(new Emitter<string>());
	public get onDidChangeOptionGroups() { return this._onDidChangeOptionGroups.event; }

	private readonly inProgressMap: Map<string, number> = new Map();
	private readonly _sessionTypeOptions: Map<string, IChatSessionProviderOptionGroup[]> = new Map();
	private readonly _sessionTypeIcons: Map<string, ThemeIcon | { light: URI; dark: URI }> = new Map();
	private readonly _sessionTypeWelcomeTitles: Map<string, string> = new Map();
	private readonly _sessionTypeWelcomeMessages: Map<string, string> = new Map();
	private readonly _sessionTypeWelcomeTips: Map<string, string> = new Map();
	private readonly _sessionTypeInputPlaceholders: Map<string, string> = new Map();

	private readonly _sessions = new ResourceMap<ContributedChatSessionData>();

	private readonly _hasCanDelegateProvidersKey: IContextKey<boolean>;

	constructor(
		@ILogService private readonly _logService: ILogService,
		@IChatAgentService private readonly _chatAgentService: IChatAgentService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IMenuService private readonly _menuService: IMenuService,
		@IThemeService private readonly _themeService: IThemeService,
		@ILabelService private readonly _labelService: ILabelService
	) {
		super();

		this._hasCanDelegateProvidersKey = ChatContextKeys.hasCanDelegateProviders.bindTo(this._contextKeyService);

		this._register(extensionPoint.setHandler(extensions => {
			for (const ext of extensions) {
				if (!isProposedApiEnabled(ext.description, 'chatSessionsProvider')) {
					continue;
				}
				if (!Array.isArray(ext.value)) {
					continue;
				}
				for (const contribution of ext.value) {
					this._register(this.registerContribution(contribution, ext.description));
				}
			}
		}));

		// Listen for context changes and re-evaluate contributions
		this._register(Event.filter(this._contextKeyService.onDidChangeContext, e => e.affectsSome(this._contextKeys))(() => {
			this._evaluateAvailability();
		}));

		this._register(this.onDidChangeSessionItems(chatSessionType => {
			this.updateInProgressStatus(chatSessionType).catch(error => {
				this._logService.warn(`Failed to update progress status for '${chatSessionType}':`, error);
			});
		}));

		this._register(this._labelService.registerFormatter({
			scheme: Schemas.copilotPr,
			formatting: {
				label: '${authority}${path}',
				separator: sep,
				stripPathStartingSeparator: true,
			}
		}));
	}

	public reportInProgress(chatSessionType: string, count: number): void {
		let displayName: string | undefined;

		if (chatSessionType === localChatSessionType) {
			displayName = 'Local Chat Agent';
		} else {
			displayName = this._contributions.get(chatSessionType)?.contribution.displayName;
		}

		if (displayName) {
			this.inProgressMap.set(displayName, count);
		}
		this._onDidChangeInProgress.fire();
	}

	public getInProgress(): { displayName: string; count: number }[] {
		return Array.from(this.inProgressMap.entries()).map(([displayName, count]) => ({ displayName, count }));
	}

	private async updateInProgressStatus(chatSessionType: string): Promise<void> {
		try {
			const items = await this.getChatSessionItems(chatSessionType, CancellationToken.None);
			const inProgress = items.filter(item => item.status && isSessionInProgressStatus(item.status));
			this.reportInProgress(chatSessionType, inProgress.length);
		} catch (error) {
			this._logService.warn(`Failed to update in-progress status for chat session type '${chatSessionType}':`, error);
		}
	}

	private registerContribution(contribution: IChatSessionsExtensionPoint, ext: IRelaxedExtensionDescription): IDisposable {
		if (this._contributions.has(contribution.type)) {
			return { dispose: () => { } };
		}

		// Track context keys from the when condition
		if (contribution.when) {
			const whenExpr = ContextKeyExpr.deserialize(contribution.when);
			if (whenExpr) {
				for (const key of whenExpr.keys()) {
					this._contextKeys.add(key);
				}
			}
		}

		this._contributions.set(contribution.type, { contribution, extension: ext });

		// Register alternative IDs if provided
		if (contribution.alternativeIds) {
			for (const altId of contribution.alternativeIds) {
				if (this._alternativeIdMap.has(altId)) {
					this._logService.warn(`Alternative ID '${altId}' is already mapped to '${this._alternativeIdMap.get(altId)}'. Remapping to '${contribution.type}'.`);
				}
				this._alternativeIdMap.set(altId, contribution.type);
			}
		}

		// Store icon mapping if provided
		let icon: ThemeIcon | { dark: URI; light: URI } | undefined;

		if (contribution.icon) {
			// Parse icon string - support ThemeIcon format or file path from extension
			if (typeof contribution.icon === 'string') {
				icon = contribution.icon.startsWith('$(') && contribution.icon.endsWith(')')
					? ThemeIcon.fromString(contribution.icon)
					: ThemeIcon.fromId(contribution.icon);
			} else {
				icon = {
					dark: resources.joinPath(ext.extensionLocation, contribution.icon.dark),
					light: resources.joinPath(ext.extensionLocation, contribution.icon.light)
				};
			}
		}

		if (icon) {
			this._sessionTypeIcons.set(contribution.type, icon);
		}

		// Store welcome title, message, tips, and input placeholder if provided
		if (contribution.welcomeTitle) {
			this._sessionTypeWelcomeTitles.set(contribution.type, contribution.welcomeTitle);
		}
		if (contribution.welcomeMessage) {
			this._sessionTypeWelcomeMessages.set(contribution.type, contribution.welcomeMessage);
		}
		if (contribution.welcomeTips) {
			this._sessionTypeWelcomeTips.set(contribution.type, contribution.welcomeTips);
		}
		if (contribution.inputPlaceholder) {
			this._sessionTypeInputPlaceholders.set(contribution.type, contribution.inputPlaceholder);
		}

		this._evaluateAvailability();

		return {
			dispose: () => {
				this._contributions.delete(contribution.type);
				// Remove alternative ID mappings
				if (contribution.alternativeIds) {
					for (const altId of contribution.alternativeIds) {
						if (this._alternativeIdMap.get(altId) === contribution.type) {
							this._alternativeIdMap.delete(altId);
						}
					}
				}
				this._sessionTypeIcons.delete(contribution.type);
				this._sessionTypeWelcomeTitles.delete(contribution.type);
				this._sessionTypeWelcomeMessages.delete(contribution.type);
				this._sessionTypeWelcomeTips.delete(contribution.type);
				this._sessionTypeInputPlaceholders.delete(contribution.type);
				this._contributionDisposables.deleteAndDispose(contribution.type);
				this._updateHasCanDelegateProvidersContextKey();
			}
		};
	}

	private _isContributionAvailable(contribution: IChatSessionsExtensionPoint): boolean {
		if (!contribution.when) {
			return true;
		}
		const whenExpr = ContextKeyExpr.deserialize(contribution.when);
		return !whenExpr || this._contextKeyService.contextMatchesRules(whenExpr);
	}

	/**
	 * Resolves a session type to its primary type, checking for alternative IDs.
	 * @param sessionType The session type or alternative ID to resolve
	 * @returns The primary session type, or undefined if not found or not available
	 */
	private _resolveToPrimaryType(sessionType: string): string | undefined {
		// Try to find the primary type first
		const contribution = this._contributions.get(sessionType)?.contribution;
		if (contribution) {
			// If the contribution is available, use it
			if (this._isContributionAvailable(contribution)) {
				return sessionType;
			}
			// If not available, fall through to check for alternatives
		}

		// Check if this is an alternative ID, or if the primary type is not available
		const primaryType = this._alternativeIdMap.get(sessionType);
		if (primaryType) {
			const altContribution = this._contributions.get(primaryType)?.contribution;
			if (altContribution && this._isContributionAvailable(altContribution)) {
				return primaryType;
			}
		}

		return undefined;
	}

	private _registerMenuItems(contribution: IChatSessionsExtensionPoint, extensionDescription: IRelaxedExtensionDescription): IDisposable {
		// If provider registers anything for the create submenu, let it fully control the creation
		const contextKeyService = this._contextKeyService.createOverlay([
			['chatSessionType', contribution.type]
		]);

		const rawMenuActions = this._menuService.getMenuActions(MenuId.AgentSessionsCreateSubMenu, contextKeyService);
		const menuActions = rawMenuActions.map(value => value[1]).flat();

		const disposables = new DisposableStore();

		// Mirror all create submenu actions into the global Chat New menu
		for (const action of menuActions) {
			if (action instanceof MenuItemAction) {
				disposables.add(MenuRegistry.appendMenuItem(MenuId.ChatNewMenu, {
					command: action.item,
					group: '4_externally_contributed',
				}));
			}
		}
		return {
			dispose: () => disposables.dispose()
		};
	}

	private _registerCommands(contribution: IChatSessionsExtensionPoint): IDisposable {
		return combinedDisposable(
			registerAction2(class OpenChatSessionAction extends Action2 {
				constructor() {
					super({
						id: `workbench.action.chat.openSessionWithPrompt.${contribution.type}`,
						title: localize2('interactiveSession.openSessionWithPrompt', "New {0} with Prompt", contribution.displayName),
						category: CHAT_CATEGORY,
						icon: Codicon.plus,
						f1: false,
						precondition: ChatContextKeys.enabled
					});
				}

				async run(accessor: ServicesAccessor, chatOptions?: { resource: UriComponents; prompt: string; attachedContext?: IChatRequestVariableEntry[] }): Promise<void> {
					const chatService = accessor.get(IChatService);
					const { type } = contribution;

					if (chatOptions) {
						const resource = URI.revive(chatOptions.resource);
						const ref = await chatService.loadSessionForResource(resource, ChatAgentLocation.Chat, CancellationToken.None);
						await chatService.sendRequest(resource, chatOptions.prompt, { agentIdSilent: type, attachedContext: chatOptions.attachedContext });
						ref?.dispose();
					}
				}
			}),
			// Creates a chat editor
			registerAction2(class OpenNewChatSessionEditorAction extends Action2 {
				constructor() {
					super({
						id: `workbench.action.chat.openNewSessionEditor.${contribution.type}`,
						title: localize2('interactiveSession.openNewSessionEditor', "New {0}", contribution.displayName),
						category: CHAT_CATEGORY,
						icon: Codicon.plus,
						f1: true,
						precondition: ChatContextKeys.enabled,
					});
				}

				async run(accessor: ServicesAccessor, chatOptions?: { prompt: string; attachedContext?: IChatRequestVariableEntry[] }): Promise<void> {
					const editorService = accessor.get(IEditorService);
					const logService = accessor.get(ILogService);
					const chatService = accessor.get(IChatService);
					const { type } = contribution;

					try {
						const options: IChatEditorOptions = {
							override: ChatEditorInput.EditorID,
							pinned: true,
							title: {
								fallback: localize('chatEditorContributionName', "{0}", contribution.displayName),
							}
						};
						const resource = URI.from({
							scheme: type,
							path: `/untitled-${generateUuid()}`,
						});
						await editorService.openEditor({ resource, options });
						if (chatOptions?.prompt) {
							await chatService.sendRequest(resource, chatOptions.prompt, { agentIdSilent: type, attachedContext: chatOptions.attachedContext });
						}
					} catch (e) {
						logService.error(`Failed to open new '${type}' chat session editor`, e);
					}
				}
			}),
			// New chat in sidebar chat (+ button)
			registerAction2(class OpenNewChatSessionSidebarAction extends Action2 {
				constructor() {
					super({
						id: `workbench.action.chat.openNewSessionSidebar.${contribution.type}`,
						title: localize2('interactiveSession.openNewSessionSidebar', "New {0}", contribution.displayName),
						category: CHAT_CATEGORY,
						icon: Codicon.plus,
						f1: false, // Hide from Command Palette
						precondition: ChatContextKeys.enabled,
						menu: {
							id: MenuId.ChatNewMenu,
							group: '3_new_special',
						}
					});
				}

				async run(accessor: ServicesAccessor, chatOptions?: { prompt: string; attachedContext?: IChatRequestVariableEntry[] }): Promise<void> {
					const viewsService = accessor.get(IViewsService);
					const logService = accessor.get(ILogService);
					const chatService = accessor.get(IChatService);
					const { type } = contribution;

					try {
						const resource = URI.from({
							scheme: type,
							path: `/untitled-${generateUuid()}`,
						});

						const view = await viewsService.openView(ChatViewId) as ChatViewPane;
						await view.loadSession(resource);
						if (chatOptions?.prompt) {
							await chatService.sendRequest(resource, chatOptions.prompt, { agentIdSilent: type, attachedContext: chatOptions.attachedContext });
						}
						view.focus();
					} catch (e) {
						logService.error(`Failed to open new '${type}' chat session in sidebar`, e);
					}
				}
			})
		);
	}

	private _evaluateAvailability(): void {
		let hasChanges = false;
		for (const { contribution, extension } of this._contributions.values()) {
			const isCurrentlyRegistered = this._contributionDisposables.has(contribution.type);
			const shouldBeRegistered = this._isContributionAvailable(contribution);
			if (isCurrentlyRegistered && !shouldBeRegistered) {
				// Disable the contribution by disposing its disposable store
				this._contributionDisposables.deleteAndDispose(contribution.type);

				// Also dispose any cached sessions for this contribution
				this._disposeSessionsForContribution(contribution.type);
				hasChanges = true;
			} else if (!isCurrentlyRegistered && shouldBeRegistered) {
				// Enable the contribution by registering it
				this._enableContribution(contribution, extension);
				hasChanges = true;
			}
		}
		if (hasChanges) {
			this._onDidChangeAvailability.fire();
			for (const provider of this._itemsProviders.values()) {
				this._onDidChangeItemsProviders.fire(provider);
			}
			for (const { contribution } of this._contributions.values()) {
				this._onDidChangeSessionItems.fire(contribution.type);
			}
		}
		this._updateHasCanDelegateProvidersContextKey();
	}

	private _enableContribution(contribution: IChatSessionsExtensionPoint, ext: IRelaxedExtensionDescription): void {
		const disposableStore = new DisposableStore();
		this._contributionDisposables.set(contribution.type, disposableStore);
		if (contribution.canDelegate) {
			disposableStore.add(this._registerAgent(contribution, ext));
			disposableStore.add(this._registerCommands(contribution));
		}
		disposableStore.add(this._registerMenuItems(contribution, ext));
	}

	private _disposeSessionsForContribution(contributionId: string): void {
		// Find and dispose all sessions that belong to this contribution
		const sessionsToDispose: URI[] = [];
		for (const [sessionResource, sessionData] of this._sessions) {
			if (sessionData.chatSessionType === contributionId) {
				sessionsToDispose.push(sessionResource);
			}
		}

		if (sessionsToDispose.length > 0) {
			this._logService.info(`Disposing ${sessionsToDispose.length} cached sessions for contribution '${contributionId}' due to when clause change`);
		}

		for (const sessionKey of sessionsToDispose) {
			const sessionData = this._sessions.get(sessionKey);
			if (sessionData) {
				sessionData.dispose(); // This will call _onWillDisposeSession and clean up
			}
		}
	}

	private _registerAgent(contribution: IChatSessionsExtensionPoint, ext: IRelaxedExtensionDescription): IDisposable {
		const { type: id, name, displayName, description } = contribution;
		const storedIcon = this._sessionTypeIcons.get(id);
		const icons = ThemeIcon.isThemeIcon(storedIcon)
			? { themeIcon: storedIcon, icon: undefined, iconDark: undefined }
			: storedIcon
				? { icon: storedIcon.light, iconDark: storedIcon.dark }
				: { themeIcon: Codicon.sendToRemoteAgent };

		const agentData: IChatAgentData = {
			id,
			name,
			fullName: displayName,
			description: description,
			isDefault: false,
			isCore: false,
			isDynamic: true,
			slashCommands: contribution.commands ?? [],
			locations: [ChatAgentLocation.Chat],
			modes: [ChatModeKind.Agent, ChatModeKind.Ask],
			disambiguation: [],
			metadata: {
				...icons,
			},
			capabilities: contribution.capabilities,
			canAccessPreviousChatHistory: true,
			extensionId: ext.identifier,
			extensionVersion: ext.version,
			extensionDisplayName: ext.displayName || ext.name,
			extensionPublisherId: ext.publisher,
		};

		return this._chatAgentService.registerAgent(id, agentData);
	}

	getAllChatSessionContributions(): IChatSessionsExtensionPoint[] {
		return Array.from(this._contributions.values(), x => x.contribution)
			.filter(contribution => this._isContributionAvailable(contribution));
	}

	private _updateHasCanDelegateProvidersContextKey(): void {
		const hasCanDelegate = this.getAllChatSessionContributions().filter(c => c.canDelegate);
		const canDelegateEnabled = hasCanDelegate.length > 0;
		this._logService.trace(`[ChatSessionsService] hasCanDelegateProvidersAvailable=${canDelegateEnabled} (${hasCanDelegate.map(c => c.type).join(', ')})`);
		this._hasCanDelegateProvidersKey.set(canDelegateEnabled);
	}

	getChatSessionContribution(chatSessionType: string): IChatSessionsExtensionPoint | undefined {
		const contribution = this._contributions.get(chatSessionType)?.contribution;
		if (!contribution) {
			return undefined;
		}

		return this._isContributionAvailable(contribution) ? contribution : undefined;
	}

	getAllChatSessionItemProviders(): IChatSessionItemProvider[] {
		return [...this._itemsProviders.values()].filter(provider => {
			// Check if the provider's corresponding contribution is available
			const contribution = this._contributions.get(provider.chatSessionType)?.contribution;
			return !contribution || this._isContributionAvailable(contribution);
		});
	}

	async activateChatSessionItemProvider(chatViewType: string): Promise<IChatSessionItemProvider | undefined> {
		await this._extensionService.whenInstalledExtensionsRegistered();
		const resolvedType = this._resolveToPrimaryType(chatViewType);
		if (resolvedType) {
			chatViewType = resolvedType;
		}

		const contribution = this._contributions.get(chatViewType)?.contribution;
		if (contribution && !this._isContributionAvailable(contribution)) {
			return undefined;
		}

		if (this._itemsProviders.has(chatViewType)) {
			return this._itemsProviders.get(chatViewType);
		}

		await this._extensionService.activateByEvent(`onChatSession:${chatViewType}`);

		return this._itemsProviders.get(chatViewType);
	}

	async canResolveChatSession(chatSessionResource: URI) {
		await this._extensionService.whenInstalledExtensionsRegistered();
		const resolvedType = this._resolveToPrimaryType(chatSessionResource.scheme) || chatSessionResource.scheme;
		const contribution = this._contributions.get(resolvedType)?.contribution;
		if (contribution && !this._isContributionAvailable(contribution)) {
			return false;
		}

		if (this._contentProviders.has(chatSessionResource.scheme)) {
			return true;
		}

		await this._extensionService.activateByEvent(`onChatSession:${chatSessionResource.scheme}`);
		return this._contentProviders.has(chatSessionResource.scheme);
	}

	async getAllChatSessionItems(token: CancellationToken): Promise<Array<{ readonly chatSessionType: string; readonly items: IChatSessionItem[] }>> {
		return Promise.all(Array.from(this.getAllChatSessionContributions(), async contrib => {
			return {
				chatSessionType: contrib.type,
				items: await this.getChatSessionItems(contrib.type, token)
			};
		}));
	}

	private async getChatSessionItems(chatSessionType: string, token: CancellationToken): Promise<IChatSessionItem[]> {
		if (!(await this.activateChatSessionItemProvider(chatSessionType))) {
			return [];
		}

		const resolvedType = this._resolveToPrimaryType(chatSessionType);
		if (resolvedType) {
			chatSessionType = resolvedType;
		}

		const provider = this._itemsProviders.get(chatSessionType);
		if (provider?.provideChatSessionItems) {
			const sessions = await provider.provideChatSessionItems(token);
			return sessions;
		}

		return [];
	}

	public registerChatSessionItemProvider(provider: IChatSessionItemProvider): IDisposable {
		const chatSessionType = provider.chatSessionType;
		this._itemsProviders.set(chatSessionType, provider);
		this._onDidChangeItemsProviders.fire(provider);

		const disposables = new DisposableStore();
		disposables.add(provider.onDidChangeChatSessionItems(() => {
			this._onDidChangeSessionItems.fire(chatSessionType);
		}));

		this.updateInProgressStatus(chatSessionType).catch(error => {
			this._logService.warn(`Failed to update initial progress status for '${chatSessionType}':`, error);
		});

		return {
			dispose: () => {
				disposables.dispose();

				const provider = this._itemsProviders.get(chatSessionType);
				if (provider) {
					this._itemsProviders.delete(chatSessionType);
					this._onDidChangeItemsProviders.fire(provider);
				}
			}
		};
	}

	registerChatSessionContentProvider(chatSessionType: string, provider: IChatSessionContentProvider): IDisposable {
		if (this._contentProviders.has(chatSessionType)) {
			throw new Error(`Content provider for ${chatSessionType} is already registered.`);
		}

		this._contentProviders.set(chatSessionType, provider);
		this._onDidChangeContentProviderSchemes.fire({ added: [chatSessionType], removed: [] });

		return {
			dispose: () => {
				this._contentProviders.delete(chatSessionType);

				this._onDidChangeContentProviderSchemes.fire({ added: [], removed: [chatSessionType] });

				// Remove all sessions that were created by this provider
				for (const [key, session] of this._sessions) {
					if (session.chatSessionType === chatSessionType) {
						session.dispose();
						this._sessions.delete(key);
					}
				}
			}
		};
	}

	public registerChatModelChangeListeners(
		chatService: IChatService,
		chatSessionType: string,
		onChange: () => void
	): IDisposable {
		const disposableStore = new DisposableStore();
		const chatModelsICareAbout = chatService.chatModels.map(models =>
			Array.from(models).filter((model: IChatModel) => model.sessionResource.scheme === chatSessionType)
		);

		const listeners = new ResourceMap<IDisposable>();
		const autoRunDisposable = autorunIterableDelta(
			reader => chatModelsICareAbout.read(reader),
			({ addedValues, removedValues }) => {
				removedValues.forEach((removed) => {
					const listener = listeners.get(removed.sessionResource);
					if (listener) {
						listeners.delete(removed.sessionResource);
						listener.dispose();
					}
				});
				addedValues.forEach((added) => {
					const requestChangeListener = added.lastRequestObs.map(last => last?.response && observableSignalFromEvent('chatSessions.modelRequestChangeListener', last.response.onDidChange));
					const modelChangeListener = observableSignalFromEvent('chatSessions.modelChangeListener', added.onDidChange);
					listeners.set(added.sessionResource, autorun(reader => {
						requestChangeListener.read(reader)?.read(reader);
						modelChangeListener.read(reader);
						onChange();
					}));
				});
			}
		);
		disposableStore.add(toDisposable(() => {
			for (const listener of listeners.values()) { listener.dispose(); }
		}));
		disposableStore.add(autoRunDisposable);
		return disposableStore;
	}


	public getInProgressSessionDescription(chatModel: IChatModel): string | undefined {
		const requests = chatModel.getRequests();
		if (requests.length === 0) {
			return undefined;
		}

		// Get the last request to check its response status
		const lastRequest = requests.at(-1);
		const response = lastRequest?.response;
		if (!response) {
			return undefined;
		}

		// If the response is complete, show Finished
		if (response.isComplete) {
			return undefined;
		}

		// Get the response parts to find tool invocations and progress messages
		const responseParts = response.response.value;
		let description: string | IMarkdownString | undefined = '';

		for (let i = responseParts.length - 1; i >= 0; i--) {
			const part = responseParts[i];
			if (description) {
				break;
			}

			if (part.kind === 'confirmation' && typeof part.message === 'string') {
				description = part.message;
			} else if (part.kind === 'toolInvocation') {
				const toolInvocation = part as IChatToolInvocation;
				const state = toolInvocation.state.get();
				description = toolInvocation.generatedTitle || toolInvocation.pastTenseMessage || toolInvocation.invocationMessage;
				if (state.type === IChatToolInvocation.StateKind.WaitingForConfirmation) {
					const confirmationTitle = toolInvocation.confirmationMessages?.title;
					const titleMessage = confirmationTitle && (typeof confirmationTitle === 'string'
						? confirmationTitle
						: confirmationTitle.value);
					const descriptionValue = typeof description === 'string' ? description : description.value;
					description = titleMessage ?? localize('chat.sessions.description.waitingForConfirmation', "Waiting for confirmation: {0}", descriptionValue);
				}
			} else if (part.kind === 'toolInvocationSerialized') {
				description = part.invocationMessage;
			} else if (part.kind === 'progressMessage') {
				description = part.content;
			} else if (part.kind === 'thinking') {
				description = localize('chat.sessions.description.thinking', 'Thinking...');
			}
		}

		return renderAsPlaintext(description, { useLinkFormatter: true });
	}

	public async getOrCreateChatSession(sessionResource: URI, token: CancellationToken): Promise<IChatSession> {
		const existingSessionData = this._sessions.get(sessionResource);
		if (existingSessionData) {
			return existingSessionData.session;
		}

		if (!(await raceCancellationError(this.canResolveChatSession(sessionResource), token))) {
			throw Error(`Can not find provider for ${sessionResource}`);
		}

		const resolvedType = this._resolveToPrimaryType(sessionResource.scheme) || sessionResource.scheme;
		const provider = this._contentProviders.get(resolvedType);
		if (!provider) {
			throw Error(`Can not find provider for ${sessionResource}`);
		}

		const session = await raceCancellationError(provider.provideChatSessionContent(sessionResource, token), token);
		const sessionData = new ContributedChatSessionData(session, sessionResource.scheme, sessionResource, session.options, resource => {
			sessionData.dispose();
			this._sessions.delete(resource);
		});

		this._sessions.set(sessionResource, sessionData);

		return session;
	}

	public hasAnySessionOptions(sessionResource: URI): boolean {
		const session = this._sessions.get(sessionResource);
		return !!session && !!session.options && Object.keys(session.options).length > 0;
	}

	public getSessionOption(sessionResource: URI, optionId: string): string | IChatSessionProviderOptionItem | undefined {
		const session = this._sessions.get(sessionResource);
		return session?.getOption(optionId);
	}

	public setSessionOption(sessionResource: URI, optionId: string, value: string | IChatSessionProviderOptionItem): boolean {
		const session = this._sessions.get(sessionResource);
		return !!session?.setOption(optionId, value);
	}

	public notifySessionItemsChanged(chatSessionType: string): void {
		this._onDidChangeSessionItems.fire(chatSessionType);
	}

	/**
	 * Store option groups for a session type
	 */
	public setOptionGroupsForSessionType(chatSessionType: string, handle: number, optionGroups?: IChatSessionProviderOptionGroup[]): void {
		if (optionGroups) {
			this._sessionTypeOptions.set(chatSessionType, optionGroups);
		} else {
			this._sessionTypeOptions.delete(chatSessionType);
		}
		this._onDidChangeOptionGroups.fire(chatSessionType);
	}

	/**
	 * Get available option groups for a session type
	 */
	public getOptionGroupsForSessionType(chatSessionType: string): IChatSessionProviderOptionGroup[] | undefined {
		return this._sessionTypeOptions.get(chatSessionType);
	}

	private _optionsChangeCallback?: SessionOptionsChangedCallback;

	/**
	 * Set the callback for notifying extensions about option changes
	 */
	public setOptionsChangeCallback(callback: SessionOptionsChangedCallback): void {
		this._optionsChangeCallback = callback;
	}

	/**
	 * Notify extension about option changes for a session
	 */
	public async notifySessionOptionsChange(sessionResource: URI, updates: ReadonlyArray<{ optionId: string; value: string | IChatSessionProviderOptionItem }>): Promise<void> {
		if (!updates.length) {
			return;
		}
		if (this._optionsChangeCallback) {
			await this._optionsChangeCallback(sessionResource, updates);
		}
		for (const u of updates) {
			this.setSessionOption(sessionResource, u.optionId, u.value);
		}
		this._onDidChangeSessionOptions.fire(sessionResource);
	}

	/**
	 * Get the icon for a specific session type
	 */
	public getIconForSessionType(chatSessionType: string): ThemeIcon | URI | undefined {
		const sessionTypeIcon = this._sessionTypeIcons.get(chatSessionType);

		if (ThemeIcon.isThemeIcon(sessionTypeIcon)) {
			return sessionTypeIcon;
		}

		if (isDark(this._themeService.getColorTheme().type)) {
			return sessionTypeIcon?.dark;
		} else {
			return sessionTypeIcon?.light;
		}
	}

	/**
	 * Get the welcome title for a specific session type
	 */
	public getWelcomeTitleForSessionType(chatSessionType: string): string | undefined {
		return this._sessionTypeWelcomeTitles.get(chatSessionType);
	}

	/**
	 * Get the welcome message for a specific session type
	 */
	public getWelcomeMessageForSessionType(chatSessionType: string): string | undefined {
		return this._sessionTypeWelcomeMessages.get(chatSessionType);
	}

	/**
	 * Get the input placeholder for a specific session type
	 */
	public getInputPlaceholderForSessionType(chatSessionType: string): string | undefined {
		return this._sessionTypeInputPlaceholders.get(chatSessionType);
	}

	/**
	 * Get the capabilities for a specific session type
	 */
	public getCapabilitiesForSessionType(chatSessionType: string): IChatAgentAttachmentCapabilities | undefined {
		const contribution = this._contributions.get(chatSessionType)?.contribution;
		return contribution?.capabilities;
	}

	public getContentProviderSchemes(): string[] {
		return Array.from(this._contentProviders.keys());
	}
}

registerSingleton(IChatSessionsService, ChatSessionsService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatStatusWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatStatusWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/chatStatusWidget.css';
import * as dom from '../../../../base/browser/dom.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { defaultButtonStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { ChatEntitlement, ChatEntitlementContextKeys, IChatEntitlementService } from '../../../services/chat/common/chatEntitlementService.js';
import { ChatInputPartWidgetsRegistry, IChatInputPartWidget } from './chatInputPartWidgets.js';
import { ChatContextKeys } from '../common/chatContextKeys.js';
import { CHAT_SETUP_ACTION_ID } from './actions/chatActions.js';

const $ = dom.$;

/**
 * Widget that displays a status message with an optional action button.
 * Only shown for free tier users when the setting is enabled (experiment controlled via onExP tag).
 */
export class ChatStatusWidget extends Disposable implements IChatInputPartWidget {

	static readonly ID = 'chatStatusWidget';

	readonly domNode: HTMLElement;

	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	readonly onDidChangeHeight: Event<void> = this._onDidChangeHeight.event;

	private messageElement: HTMLElement | undefined;
	private actionButton: Button | undefined;

	constructor(
		@IChatEntitlementService private readonly chatEntitlementService: IChatEntitlementService,
		@ICommandService private readonly commandService: ICommandService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();

		this.domNode = $('.chat-status-widget');
		this.domNode.style.display = 'none';
		this.initializeIfEnabled();
	}

	private initializeIfEnabled(): void {
		const enabledSku = this.configurationService.getValue<string | null>('chat.statusWidget.sku');
		if (enabledSku !== 'free' && enabledSku !== 'anonymous') {
			return;
		}

		const entitlement = this.chatEntitlementService.entitlement;
		const isAnonymous = this.chatEntitlementService.anonymous;

		if (enabledSku === 'anonymous' && isAnonymous) {
			this.createWidgetContent(enabledSku);
		} else if (enabledSku === 'free' && entitlement === ChatEntitlement.Free) {
			this.createWidgetContent(enabledSku);
		} else {
			return;
		}

		this.domNode.style.display = '';
		this._onDidChangeHeight.fire();
	}

	get height(): number {
		return this.domNode.style.display === 'none' ? 0 : this.domNode.offsetHeight;
	}

	private createWidgetContent(enabledSku: 'free' | 'anonymous'): void {
		const contentContainer = $('.chat-status-content');
		this.messageElement = $('.chat-status-message');
		contentContainer.appendChild(this.messageElement);

		const actionContainer = $('.chat-status-action');
		this.actionButton = this._register(new Button(actionContainer, {
			...defaultButtonStyles,
			supportIcons: true
		}));
		this.actionButton.element.classList.add('chat-status-button');

		if (enabledSku === 'anonymous') {
			const message = localize('chat.anonymousRateLimited.message', "You've reached the limit for chat messages. Try Copilot Pro for free.");
			const buttonLabel = localize('chat.anonymousRateLimited.signIn', "Sign In");
			this.messageElement.textContent = message;
			this.actionButton.label = buttonLabel;
			this.actionButton.element.ariaLabel = localize('chat.anonymousRateLimited.signIn.ariaLabel', "{0} {1}", message, buttonLabel);
		} else {
			const message = localize('chat.freeQuotaExceeded.message', "You've reached the limit for chat messages.");
			const buttonLabel = localize('chat.freeQuotaExceeded.upgrade', "Upgrade");
			this.messageElement.textContent = message;
			this.actionButton.label = buttonLabel;
			this.actionButton.element.ariaLabel = localize('chat.freeQuotaExceeded.upgrade.ariaLabel', "{0} {1}", message, buttonLabel);
		}

		this._register(this.actionButton.onDidClick(async () => {
			const commandId = this.chatEntitlementService.anonymous
				? CHAT_SETUP_ACTION_ID
				: 'workbench.action.chat.upgradePlan';
			await this.commandService.executeCommand(commandId);
		}));

		this.domNode.appendChild(contentContainer);
		this.domNode.appendChild(actionContainer);
	}
}

ChatInputPartWidgetsRegistry.register(
	ChatStatusWidget.ID,
	ChatStatusWidget,
	ContextKeyExpr.and(
		ChatContextKeys.chatQuotaExceeded,
		ChatContextKeys.chatSessionIsEmpty,
		ContextKeyExpr.or(
			ChatContextKeys.Entitlement.planFree,
			ChatEntitlementContextKeys.chatAnonymous
		)
	)
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatTerminalOutputAccessibleView.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatTerminalOutputAccessibleView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AccessibleContentProvider, AccessibleViewProviderId, AccessibleViewType } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { ChatContextKeys } from '../common/chatContextKeys.js';
import { ITerminalChatService } from '../../terminal/browser/terminal.js';

export class ChatTerminalOutputAccessibleView implements IAccessibleViewImplementation {
	readonly priority = 115;
	readonly name = 'chatTerminalOutput';
	readonly type = AccessibleViewType.View;
	readonly when = ChatContextKeys.inChatTerminalToolOutput;

	getProvider(accessor: ServicesAccessor) {
		const terminalChatService = accessor.get(ITerminalChatService);
		const part = terminalChatService.getFocusedProgressPart();
		if (!part) {
			return;
		}

		const content = part.getCommandAndOutputAsText();
		if (!content) {
			return;
		}

		return new AccessibleContentProvider(
			AccessibleViewProviderId.ChatTerminalOutput,
			{ type: AccessibleViewType.View, id: AccessibleViewProviderId.ChatTerminalOutput, language: 'text' },
			() => content,
			() => part.focusOutput(),
			AccessibilityVerbositySettingId.TerminalChatOutput
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatVariables.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatVariables.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IChatVariablesService, IDynamicVariable } from '../common/chatVariables.js';
import { IToolAndToolSetEnablementMap } from '../common/languageModelToolsService.js';
import { IChatWidgetService } from './chat.js';
import { ChatDynamicVariableModel } from './contrib/chatDynamicVariables.js';
import { Range } from '../../../../editor/common/core/range.js';
import { URI } from '../../../../base/common/uri.js';

export class ChatVariablesService implements IChatVariablesService {
	declare _serviceBrand: undefined;

	constructor(
		@IChatWidgetService private readonly chatWidgetService: IChatWidgetService,
	) { }

	getDynamicVariables(sessionResource: URI): ReadonlyArray<IDynamicVariable> {
		// This is slightly wrong... the parser pulls dynamic references from the input widget, but there is no guarantee that message came from the input here.
		// Need to ...
		// - Parser takes list of dynamic references (annoying)
		// - Or the parser is known to implicitly act on the input widget, and we need to call it before calling the chat service (maybe incompatible with the future, but easy)
		const widget = this.chatWidgetService.getWidgetBySessionResource(sessionResource);
		if (!widget || !widget.viewModel || !widget.supportsFileReferences) {
			return [];
		}

		const model = widget.getContrib<ChatDynamicVariableModel>(ChatDynamicVariableModel.ID);
		if (!model) {
			return [];
		}

		if (widget.input.attachmentModel.attachments.length > 0 && widget.viewModel.editing) {
			const references: IDynamicVariable[] = [];
			for (const attachment of widget.input.attachmentModel.attachments) {
				// If the attachment has a range, it is a dynamic variable
				if (attachment.range) {
					const referenceObj: IDynamicVariable = {
						id: attachment.id,
						fullName: attachment.name,
						modelDescription: attachment.modelDescription,
						range: new Range(1, attachment.range.start + 1, 1, attachment.range.endExclusive + 1),
						icon: attachment.icon,
						isFile: attachment.kind === 'file',
						isDirectory: attachment.kind === 'directory',
						data: attachment.value
					};
					references.push(referenceObj);
				}
			}

			return [...model.variables, ...references];
		}

		return model.variables;
	}

	getSelectedToolAndToolSets(sessionResource: URI): IToolAndToolSetEnablementMap {
		const widget = this.chatWidgetService.getWidgetBySessionResource(sessionResource);
		if (!widget) {
			return new Map();
		}
		return widget.input.selectedToolsModel.entriesMap.get();

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatViewPane.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatViewPane.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/chatViewPane.css';
import { $, addDisposableListener, append, EventHelper, EventType, getWindow, setVisibility } from '../../../../base/browser/dom.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { autorun, IReader } from '../../../../base/common/observable.js';
import { URI } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { MenuWorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { editorBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { ChatViewTitleControl } from './chatViewTitleControl.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IViewPaneOptions, ViewPane } from '../../../browser/parts/views/viewPane.js';
import { Memento } from '../../../common/memento.js';
import { SIDE_BAR_FOREGROUND } from '../../../common/theme.js';
import { IViewDescriptorService, ViewContainerLocation } from '../../../common/views.js';
import { ILifecycleService, StartupKind } from '../../../services/lifecycle/common/lifecycle.js';
import { IChatViewTitleActionContext } from '../common/chatActions.js';
import { IChatAgentService } from '../common/chatAgents.js';
import { ChatContextKeys } from '../common/chatContextKeys.js';
import { IChatModel, IChatModelInputState } from '../common/chatModel.js';
import { CHAT_PROVIDER_ID } from '../common/chatParticipantContribTypes.js';
import { IChatModelReference, IChatService } from '../common/chatService.js';
import { IChatSessionsService, localChatSessionType } from '../common/chatSessionsService.js';
import { LocalChatSessionUri, getChatSessionType } from '../common/chatUri.js';
import { ChatAgentLocation, ChatConfiguration, ChatModeKind } from '../common/constants.js';
import { AgentSessionsControl } from './agentSessions/agentSessionsControl.js';
import { AgentSessionsListDelegate } from './agentSessions/agentSessionsViewer.js';
import { ChatWidget } from './chatWidget.js';
import { ChatViewWelcomeController, IViewWelcomeDelegate } from './viewsWelcome/chatViewWelcomeController.js';
import { IWorkbenchLayoutService, LayoutSettings, Position } from '../../../services/layout/browser/layoutService.js';
import { AgentSessionsViewerOrientation, AgentSessionsViewerPosition } from './agentSessions/agentSessions.js';
import { Link } from '../../../../platform/opener/browser/link.js';
import { IProgressService } from '../../../../platform/progress/common/progress.js';
import { ChatViewId } from './chat.js';
import { disposableTimeout } from '../../../../base/common/async.js';
import { AgentSessionsFilter } from './agentSessions/agentSessionsFilter.js';
import { IAgentSessionsService } from './agentSessions/agentSessionsService.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { IAgentSession } from './agentSessions/agentSessionsModel.js';

interface IChatViewPaneState extends Partial<IChatModelInputState> {
	sessionId?: string;
}

type ChatViewPaneOpenedClassification = {
	owner: 'sbatten';
	comment: 'Event fired when the chat view pane is opened';
};

export class ChatViewPane extends ViewPane implements IViewWelcomeDelegate {

	private readonly memento: Memento<IChatViewPaneState>;
	private readonly viewState: IChatViewPaneState;

	private viewPaneContainer: HTMLElement | undefined;
	private readonly chatViewLocationContext: IContextKey<ViewContainerLocation>;

	private lastDimensions: { height: number; width: number } | undefined;
	private readonly lastDimensionsPerOrientation: Map<AgentSessionsViewerOrientation, { height: number; width: number }> = new Map();

	private welcomeController: ChatViewWelcomeController | undefined;

	private restoringSession: Promise<void> | undefined;
	private readonly modelRef = this._register(new MutableDisposable<IChatModelReference>());

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IStorageService private readonly storageService: IStorageService,
		@IChatService private readonly chatService: IChatService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@ILogService private readonly logService: ILogService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IChatSessionsService private readonly chatSessionsService: IChatSessionsService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IProgressService private readonly progressService: IProgressService,
		@IAgentSessionsService private readonly agentSessionsService: IAgentSessionsService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		// View state for the ViewPane is currently global per-provider basically,
		// but some other strictly per-model state will require a separate memento.
		this.memento = new Memento(`interactive-session-view-${CHAT_PROVIDER_ID}`, this.storageService);
		this.viewState = this.memento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		if (
			lifecycleService.startupKind !== StartupKind.ReloadedWindow &&
			this.configurationService.getValue<boolean>(ChatConfiguration.RestoreLastPanelSession) === false
		) {
			this.viewState.sessionId = undefined; // clear persisted session on fresh start
		}

		// Contextkeys
		this.chatViewLocationContext = ChatContextKeys.panelLocation.bindTo(contextKeyService);
		this.sessionsViewerLimitedContext = ChatContextKeys.agentSessionsViewerLimited.bindTo(contextKeyService);
		this.sessionsViewerOrientationContext = ChatContextKeys.agentSessionsViewerOrientation.bindTo(contextKeyService);
		this.sessionsViewerPositionContext = ChatContextKeys.agentSessionsViewerPosition.bindTo(contextKeyService);
		this.sessionsViewerVisibilityContext = ChatContextKeys.agentSessionsViewerVisible.bindTo(contextKeyService);

		this.updateContextKeys(false);

		this.registerListeners();
	}

	private updateContextKeys(fromEvent: boolean): void {
		const { position, location } = this.getViewPositionAndLocation();

		this.sessionsViewerLimitedContext.set(this.sessionsViewerLimited);
		this.chatViewLocationContext.set(location ?? ViewContainerLocation.AuxiliaryBar);
		this.sessionsViewerOrientationContext.set(this.sessionsViewerOrientation);
		this.sessionsViewerPositionContext.set(position === Position.RIGHT ? AgentSessionsViewerPosition.Right : AgentSessionsViewerPosition.Left);

		if (fromEvent && this.lastDimensions) {
			this.layoutBody(this.lastDimensions.height, this.lastDimensions.width);
		}
	}

	private getViewPositionAndLocation(): { position: Position; location: ViewContainerLocation } {
		const viewLocation = this.viewDescriptorService.getViewLocationById(this.id);
		const sideBarPosition = this.layoutService.getSideBarPosition();
		const panelPosition = this.layoutService.getPanelPosition();

		let sideSessionsOnRightPosition: boolean;
		switch (viewLocation) {
			case ViewContainerLocation.Sidebar:
				sideSessionsOnRightPosition = sideBarPosition === Position.RIGHT;
				break;
			case ViewContainerLocation.Panel:
				sideSessionsOnRightPosition = panelPosition !== Position.LEFT;
				break;
			default:
				sideSessionsOnRightPosition = sideBarPosition === Position.LEFT;
				break;
		}

		return {
			position: sideSessionsOnRightPosition ? Position.RIGHT : Position.LEFT,
			location: viewLocation ?? ViewContainerLocation.AuxiliaryBar
		};
	}

	private updateViewPaneClasses(fromEvent: boolean): void {
		const welcomeEnabled = this.configurationService.getValue<boolean>(ChatConfiguration.ChatViewWelcomeEnabled) !== false;
		this.viewPaneContainer?.classList.toggle('chat-view-welcome-enabled', welcomeEnabled);

		const activityBarLocationDefault = this.configurationService.getValue<string>(LayoutSettings.ACTIVITY_BAR_LOCATION) === 'default';
		this.viewPaneContainer?.classList.toggle('activity-bar-location-default', activityBarLocationDefault);
		this.viewPaneContainer?.classList.toggle('activity-bar-location-other', !activityBarLocationDefault);

		const { position, location } = this.getViewPositionAndLocation();

		this.viewPaneContainer?.classList.toggle('chat-view-location-auxiliarybar', location === ViewContainerLocation.AuxiliaryBar);
		this.viewPaneContainer?.classList.toggle('chat-view-location-sidebar', location === ViewContainerLocation.Sidebar);
		this.viewPaneContainer?.classList.toggle('chat-view-location-panel', location === ViewContainerLocation.Panel);

		this.viewPaneContainer?.classList.toggle('chat-view-position-left', position === Position.LEFT);
		this.viewPaneContainer?.classList.toggle('chat-view-position-right', position === Position.RIGHT);

		if (fromEvent && this.lastDimensions) {
			this.layoutBody(this.lastDimensions.height, this.lastDimensions.width);
		}
	}

	private registerListeners(): void {

		// Agent changes
		this._register(this.chatAgentService.onDidChangeAgents(() => this.onDidChangeAgents()));

		// Layout changes
		this._register(Event.any(
			Event.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration('workbench.sideBar.location')),
			this.layoutService.onDidChangePanelPosition,
			Event.filter(this.viewDescriptorService.onDidChangeContainerLocation, e => e.viewContainer === this.viewDescriptorService.getViewContainerByViewId(this.id))
		)(() => {
			this.updateContextKeys(false);
			this.updateViewPaneClasses(true /* layout here */);
		}));

		// Settings changes
		this._register(Event.filter(this.configurationService.onDidChangeConfiguration, e => {
			return e.affectsConfiguration(ChatConfiguration.ChatViewWelcomeEnabled) || e.affectsConfiguration(LayoutSettings.ACTIVITY_BAR_LOCATION);
		})(() => this.updateViewPaneClasses(true)));
	}

	private onDidChangeAgents(): void {
		if (this.chatAgentService.getDefaultAgent(ChatAgentLocation.Chat)) {
			if (!this._widget?.viewModel && !this.restoringSession) {
				const info = this.getTransferredOrPersistedSessionInfo();
				this.restoringSession =
					(info.sessionId ? this.chatService.getOrRestoreSession(LocalChatSessionUri.forSession(info.sessionId)) : Promise.resolve(undefined)).then(async modelRef => {
						if (!this._widget) {
							return; // renderBody has not been called yet
						}

						// The widget may be hidden at this point, because welcome views were allowed. Use setVisible to
						// avoid doing a render while the widget is hidden. This is changing the condition in `shouldShowWelcome`
						// so it should fire onDidChangeViewWelcomeState.
						const wasVisible = this._widget.visible;
						try {
							this._widget.setVisible(false);
							if (info.inputState && modelRef) {
								modelRef.object.inputModel.setState(info.inputState);
							}

							await this.showModel(modelRef);
						} finally {
							this._widget.setVisible(wasVisible);
						}
					});

				this.restoringSession.finally(() => this.restoringSession = undefined);
			}
		}

		this._onDidChangeViewWelcomeState.fire();
	}

	private getTransferredOrPersistedSessionInfo(): { sessionId?: string; inputState?: IChatModelInputState; mode?: ChatModeKind } {
		if (this.chatService.transferredSessionData?.location === ChatAgentLocation.Chat) {
			const sessionId = this.chatService.transferredSessionData.sessionId;
			return {
				sessionId,
				inputState: this.chatService.transferredSessionData.inputState,
			};
		}

		return { sessionId: this.viewState.sessionId };
	}

	protected override renderBody(parent: HTMLElement): void {
		super.renderBody(parent);

		this.telemetryService.publicLog2<{}, ChatViewPaneOpenedClassification>('chatViewPaneOpened');

		this.viewPaneContainer = parent;
		this.viewPaneContainer.classList.add('chat-viewpane');
		this.updateViewPaneClasses(false);

		this.createControls(parent);

		this.setupContextMenu(parent);

		this.applyModel();
	}

	private createControls(parent: HTMLElement): void {

		// Sessions Control
		const sessionsControl = this.createSessionsControl(parent);

		// Welcome Control (used to show chat specific extension provided welcome views via `chatViewsWelcome` contribution point)
		const welcomeController = this.welcomeController = this._register(this.instantiationService.createInstance(ChatViewWelcomeController, parent, this, ChatAgentLocation.Chat));

		// Chat Control
		const chatWidget = this.createChatControl(parent);

		// Controls Listeners
		this.registerControlsListeners(sessionsControl, chatWidget, welcomeController);

		// Update sessions control visibility when all controls are created
		this.updateSessionsControlVisibility();
	}

	//#region Sessions Control

	private static readonly SESSIONS_LIMIT = 3;
	private static readonly SESSIONS_SIDEBAR_WIDTH = 300;
	private static readonly SESSIONS_SIDEBAR_VIEW_MIN_WIDTH = 300 /* default chat width */ + this.SESSIONS_SIDEBAR_WIDTH;

	private sessionsContainer: HTMLElement | undefined;
	private sessionsTitleContainer: HTMLElement | undefined;
	private sessionsTitle: HTMLElement | undefined;
	private sessionsControlContainer: HTMLElement | undefined;
	private sessionsControl: AgentSessionsControl | undefined;
	private sessionsLinkContainer: HTMLElement | undefined;
	private sessionsLink: Link | undefined;
	private sessionsCount = 0;
	private sessionsViewerLimited = true;
	private sessionsViewerOrientation = AgentSessionsViewerOrientation.Stacked;
	private sessionsViewerOrientationConfiguration: 'stacked' | 'sideBySide' = 'sideBySide';
	private sessionsViewerOrientationContext: IContextKey<AgentSessionsViewerOrientation>;
	private sessionsViewerLimitedContext: IContextKey<boolean>;
	private sessionsViewerVisibilityContext: IContextKey<boolean>;
	private sessionsViewerPositionContext: IContextKey<AgentSessionsViewerPosition>;

	private createSessionsControl(parent: HTMLElement): AgentSessionsControl {
		const that = this;
		const sessionsContainer = this.sessionsContainer = parent.appendChild($('.agent-sessions-container'));

		// Sessions Title
		const sessionsTitleContainer = this.sessionsTitleContainer = append(sessionsContainer, $('.agent-sessions-title-container'));
		const sessionsTitle = this.sessionsTitle = append(sessionsTitleContainer, $('span.agent-sessions-title'));
		sessionsTitle.textContent = this.sessionsViewerLimited ? localize('recentSessions', "Recent Sessions") : localize('allSessions', "All Sessions");
		this._register(addDisposableListener(sessionsTitle, EventType.CLICK, () => {
			this.sessionsControl?.scrollToTop();
			this.sessionsControl?.focus();
		}));

		// Sessions Toolbar
		const sessionsToolbarContainer = append(sessionsTitleContainer, $('.agent-sessions-toolbar'));
		const sessionsToolbar = this._register(this.instantiationService.createInstance(MenuWorkbenchToolBar, sessionsToolbarContainer, MenuId.AgentSessionsToolbar, {
			menuOptions: { shouldForwardArgs: true }
		}));

		// Sessions Filter
		const sessionsFilter = this._register(this.instantiationService.createInstance(AgentSessionsFilter, {
			filterMenuId: MenuId.AgentSessionsViewerFilterSubMenu,
			limitResults: () => {
				return that.sessionsViewerLimited ? ChatViewPane.SESSIONS_LIMIT : undefined;
			},
			groupResults: () => {
				return !that.sessionsViewerLimited;
			},
			overrideExclude(session) {
				if (that.sessionsViewerLimited) {
					if (session.isArchived()) {
						return true; // exclude archived sessions when limited
					}

					return false;
				}

				return undefined; // leave up to the filter settings
			},
			notifyResults(count: number) {
				that.notifySessionsControlCountChanged(count);
			},
		}));
		this._register(Event.runAndSubscribe(sessionsFilter.onDidChange, () => {
			sessionsToolbarContainer.classList.toggle('filtered', !sessionsFilter.isDefault());
		}));

		// Sessions Control
		this.sessionsControlContainer = append(sessionsContainer, $('.agent-sessions-control-container'));
		const sessionsControl = this.sessionsControl = this._register(this.instantiationService.createInstance(AgentSessionsControl, this.sessionsControlContainer, {
			filter: sessionsFilter,
			overrideStyles: this.getLocationBasedColors().listOverrideStyles,
			getHoverPosition: () => {
				const { position } = this.getViewPositionAndLocation();
				return position === Position.RIGHT ? HoverPosition.LEFT : HoverPosition.RIGHT;
			},
			overrideCompare(sessionA: IAgentSession, sessionB: IAgentSession): number | undefined {

				// When limited where only few sessions show, sort unread sessions to the top
				if (that.sessionsViewerLimited) {
					const aIsUnread = !sessionA.isRead();
					const bIsUnread = !sessionB.isRead();

					if (aIsUnread && !bIsUnread) {
						return -1; // a (unread) comes before b (read)
					}
					if (!aIsUnread && bIsUnread) {
						return 1; // a (read) comes after b (unread)
					}
				}

				return undefined;
			}
		}));
		this._register(this.onDidChangeBodyVisibility(visible => sessionsControl.setVisible(visible)));

		sessionsToolbar.context = sessionsControl;

		// Link to Sessions View
		this.sessionsLinkContainer = append(sessionsContainer, $('.agent-sessions-link-container'));
		this.sessionsLink = this._register(this.instantiationService.createInstance(Link, this.sessionsLinkContainer, {
			label: this.sessionsViewerLimited ? localize('showAllSessions', "Show All Sessions") : localize('showRecentSessions', "Show Recent Sessions"),
			href: '',
		}, {
			opener: () => {
				this.sessionsViewerLimited = !this.sessionsViewerLimited;

				this.notifySessionsControlLimitedChanged(true);

				sessionsControl.focus();
			}
		}));

		// Deal with orientation configuration
		this._register(Event.runAndSubscribe(Event.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration(ChatConfiguration.ChatViewSessionsOrientation)), e => {
			const newSessionsViewerOrientationConfiguration = this.configurationService.getValue<'stacked' | 'sideBySide' | unknown>(ChatConfiguration.ChatViewSessionsOrientation);
			this.doUpdateConfiguredSessionsViewerOrientation(newSessionsViewerOrientationConfiguration, { updateConfiguration: false, layout: !!e });
		}));

		return sessionsControl;
	}

	getSessionsViewerOrientation(): AgentSessionsViewerOrientation {
		return this.sessionsViewerOrientation;
	}

	updateConfiguredSessionsViewerOrientation(orientation: 'stacked' | 'sideBySide' | unknown): void {
		return this.doUpdateConfiguredSessionsViewerOrientation(orientation, { updateConfiguration: true, layout: true });
	}

	private doUpdateConfiguredSessionsViewerOrientation(orientation: 'stacked' | 'sideBySide' | unknown, options: { updateConfiguration: boolean; layout: boolean }): void {
		const oldSessionsViewerOrientationConfiguration = this.sessionsViewerOrientationConfiguration;

		let validatedOrientation: 'stacked' | 'sideBySide';
		if (orientation === 'stacked' || orientation === 'sideBySide') {
			validatedOrientation = orientation;
		} else {
			validatedOrientation = 'sideBySide'; // default
		}
		this.sessionsViewerOrientationConfiguration = validatedOrientation;

		if (oldSessionsViewerOrientationConfiguration === this.sessionsViewerOrientationConfiguration) {
			return; // no change from our existing config
		}

		if (options.updateConfiguration) {
			this.configurationService.updateValue(ChatConfiguration.ChatViewSessionsOrientation, validatedOrientation);
		}

		if (options.layout && this.lastDimensions) {
			this.layoutBody(this.lastDimensions.height, this.lastDimensions.width);
		}
	}

	private notifySessionsControlLimitedChanged(triggerLayout: boolean): Promise<void> {
		this.sessionsViewerLimitedContext.set(this.sessionsViewerLimited);

		this.updateSessionsControlTitle();

		if (this.sessionsLink) {
			this.sessionsLink.link = {
				label: this.sessionsViewerLimited ? localize('showAllSessions', "Show All Sessions") : localize('showRecentSessions', "Show Recent Sessions"),
				href: ''
			};
		}

		const updatePromise = this.sessionsControl?.update();

		if (triggerLayout && this.lastDimensions) {
			this.layoutBody(this.lastDimensions.height, this.lastDimensions.width);
		}

		return updatePromise ?? Promise.resolve();
	}

	private notifySessionsControlCountChanged(newSessionsCount?: number): void {
		const countChanged = typeof newSessionsCount === 'number' && newSessionsCount !== this.sessionsCount;
		this.sessionsCount = newSessionsCount ?? this.sessionsCount;

		const { changed: visibilityChanged, visible } = this.updateSessionsControlVisibility();

		if (visibilityChanged || (countChanged && visible)) {
			if (this.lastDimensions) {
				this.layoutBody(this.lastDimensions.height, this.lastDimensions.width);
			}
		}
	}

	private updateSessionsControlTitle(): void {
		if (!this.sessionsTitle) {
			return;
		}

		if (this.sessionsViewerLimited) {
			this.sessionsTitle.textContent = localize('recentSessions', "Recent Sessions");
		} else {
			this.sessionsTitle.textContent = localize('sessions', "Sessions");
		}
	}

	private updateSessionsControlVisibility(): { changed: boolean; visible: boolean } {
		if (!this.sessionsContainer || !this.viewPaneContainer) {
			return { changed: false, visible: false };
		}

		let newSessionsContainerVisible: boolean;
		if (!this.configurationService.getValue<boolean>(ChatConfiguration.ChatViewSessionsEnabled)) {
			newSessionsContainerVisible = false; // disabled in settings
		} else {

			// Sessions control: stacked
			if (this.sessionsViewerOrientation === AgentSessionsViewerOrientation.Stacked) {
				newSessionsContainerVisible =
					(!this._widget || this._widget?.isEmpty()) &&				// chat widget empty
					!this.welcomeController?.isShowingWelcome.get() &&			// welcome not showing
					(this.sessionsCount > 0 || !this.sessionsViewerLimited);	// has sessions or is showing all sessions
			}

			// Sessions control: sidebar
			else {
				newSessionsContainerVisible =
					!this.welcomeController?.isShowingWelcome.get() &&													// welcome not showing
					!!this.lastDimensions && this.lastDimensions.width >= ChatViewPane.SESSIONS_SIDEBAR_VIEW_MIN_WIDTH;	// has sessions or is showing all sessions
			}
		}

		this.viewPaneContainer.classList.toggle('has-sessions-control', newSessionsContainerVisible);

		const sessionsContainerVisible = this.sessionsContainer.style.display !== 'none';
		setVisibility(newSessionsContainerVisible, this.sessionsContainer);
		this.sessionsViewerVisibilityContext.set(newSessionsContainerVisible);

		return {
			changed: sessionsContainerVisible !== newSessionsContainerVisible,
			visible: newSessionsContainerVisible
		};
	}

	getFocusedSessions(): IAgentSession[] {
		return this.sessionsControl?.getFocus() ?? [];
	}

	//#endregion

	//#region Chat Control

	private static readonly MIN_CHAT_WIDGET_HEIGHT = 120;

	private _widget!: ChatWidget;
	get widget(): ChatWidget { return this._widget; }

	private titleControl: ChatViewTitleControl | undefined;

	private createChatControl(parent: HTMLElement): ChatWidget {
		const chatControlsContainer = append(parent, $('.chat-controls-container'));

		const locationBasedColors = this.getLocationBasedColors();

		const editorOverflowWidgetsDomNode = this.layoutService.getContainer(getWindow(chatControlsContainer)).appendChild($('.chat-editor-overflow.monaco-editor'));
		this._register(toDisposable(() => editorOverflowWidgetsDomNode.remove()));

		// Chat Title
		this.createChatTitleControl(chatControlsContainer);

		// Chat Widget
		const scopedInstantiationService = this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService])));
		this._widget = this._register(scopedInstantiationService.createInstance(
			ChatWidget,
			ChatAgentLocation.Chat,
			{ viewId: this.id },
			{
				autoScroll: mode => mode !== ChatModeKind.Ask,
				renderFollowups: true,
				supportsFileReferences: true,
				clear: () => this.clear(),
				rendererOptions: {
					renderTextEditsAsSummary: (uri) => {
						return true;
					},
					referencesExpandedWhenEmptyResponse: false,
					progressMessageAtBottomOfResponse: mode => mode !== ChatModeKind.Ask,
				},
				editorOverflowWidgetsDomNode,
				enableImplicitContext: true,
				enableWorkingSet: 'explicit',
				supportsChangingModes: true,
			},
			{
				listForeground: SIDE_BAR_FOREGROUND,
				listBackground: locationBasedColors.background,
				overlayBackground: locationBasedColors.overlayBackground,
				inputEditorBackground: locationBasedColors.background,
				resultEditorBackground: editorBackground,
			}));
		this._widget.render(chatControlsContainer);

		const updateWidgetVisibility = (reader?: IReader) => this._widget.setVisible(this.isBodyVisible() && !this.welcomeController?.isShowingWelcome.read(reader));
		this._register(this.onDidChangeBodyVisibility(() => updateWidgetVisibility()));
		this._register(autorun(reader => updateWidgetVisibility(reader)));

		return this._widget;
	}

	private createChatTitleControl(parent: HTMLElement): void {
		this.titleControl = this._register(this.instantiationService.createInstance(ChatViewTitleControl,
			parent,
			{
				focusChat: () => this._widget.focusInput()
			}
		));

		this._register(this.titleControl.onDidChangeHeight(() => {
			if (this.lastDimensions) {
				this.layoutBody(this.lastDimensions.height, this.lastDimensions.width);
			}
		}));
	}

	//#endregion

	private registerControlsListeners(sessionsControl: AgentSessionsControl, chatWidget: ChatWidget, welcomeController: ChatViewWelcomeController): void {

		// Sessions control visibility is impacted by multiple things:
		// - chat widget being in empty state or showing a chat
		// - extensions provided welcome view showing or not
		// - configuration setting
		this._register(Event.any(
			chatWidget.onDidChangeEmptyState,
			Event.fromObservable(welcomeController.isShowingWelcome),
			Event.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration(ChatConfiguration.ChatViewSessionsEnabled))
		)(() => {
			if (this.sessionsViewerOrientation === AgentSessionsViewerOrientation.Stacked) {
				sessionsControl.clearFocus(); // improve visual appearance when switching visibility by clearing focus
			}
			this.notifySessionsControlCountChanged();
		}));

		// Track the active chat model and reveal it in the sessions control if side-by-side
		this._register(chatWidget.onDidChangeViewModel(() => {
			if (this.sessionsViewerOrientation === AgentSessionsViewerOrientation.Stacked) {
				return; // only reveal in side-by-side mode
			}

			const sessionResource = chatWidget.viewModel?.sessionResource;
			if (sessionResource) {
				sessionsControl.reveal(sessionResource);
			}
		}));
	}

	private setupContextMenu(parent: HTMLElement): void {
		this._register(addDisposableListener(parent, EventType.CONTEXT_MENU, e => {
			EventHelper.stop(e, true);

			this.contextMenuService.showContextMenu({
				menuId: MenuId.ChatWelcomeContext,
				contextKeyService: this.contextKeyService,
				getAnchor: () => new StandardMouseEvent(getWindow(parent), e)
			});
		}));
	}

	//#region Model Management

	private async applyModel(): Promise<void> {
		const info = this.getTransferredOrPersistedSessionInfo();
		const modelRef = info.sessionId ? await this.chatService.getOrRestoreSession(LocalChatSessionUri.forSession(info.sessionId)) : undefined;
		if (modelRef && info.inputState) {
			modelRef.object.inputModel.setState(info.inputState);
		}

		await this.showModel(modelRef);
	}

	private async showModel(modelRef?: IChatModelReference | undefined, startNewSession = true): Promise<IChatModel | undefined> {
		const oldModelResource = this.modelRef.value?.object.sessionResource;
		this.modelRef.value = undefined;

		let ref: IChatModelReference | undefined;
		if (startNewSession) {
			ref = modelRef ?? (this.chatService.transferredSessionData?.sessionId && this.chatService.transferredSessionData?.location === ChatAgentLocation.Chat
				? await this.chatService.getOrRestoreSession(LocalChatSessionUri.forSession(this.chatService.transferredSessionData.sessionId))
				: this.chatService.startSession(ChatAgentLocation.Chat));
			if (!ref) {
				throw new Error('Could not start chat session');
			}
		}

		this.modelRef.value = ref;
		const model = ref?.object;

		if (model) {
			await this.updateWidgetLockState(model.sessionResource); // Update widget lock state based on session type

			this.viewState.sessionId = model.sessionId; // remember as model to restore in view state
		}

		this._widget.setModel(model);

		// Update title control
		this.titleControl?.update(model);

		// Update the toolbar context with new sessionId
		this.updateActions();

		// Mark the old model as read when closing
		if (oldModelResource) {
			this.agentSessionsService.model.getSession(oldModelResource)?.setRead(true);
		}

		return model;
	}

	private async updateWidgetLockState(sessionResource: URI): Promise<void> {
		const sessionType = getChatSessionType(sessionResource);
		if (sessionType === localChatSessionType) {
			this._widget.unlockFromCodingAgent();
			return;
		}

		let canResolve = false;
		try {
			canResolve = await this.chatSessionsService.canResolveChatSession(sessionResource);
		} catch (error) {
			this.logService.warn(`Failed to resolve chat session '${sessionResource.toString()}' for locking`, error);
		}

		if (!canResolve) {
			this._widget.unlockFromCodingAgent();
			return;
		}

		const contribution = this.chatSessionsService.getChatSessionContribution(sessionType);
		if (contribution) {
			this._widget.lockToCodingAgent(contribution.name, contribution.displayName, contribution.type);
		} else {
			this._widget.unlockFromCodingAgent();
		}
	}

	private async clear(): Promise<void> {

		// Grab the widget's latest view state because it will be loaded back into the widget
		this.updateViewState();
		await this.showModel(undefined);

		// Update the toolbar context with new sessionId
		this.updateActions();
	}

	async loadSession(sessionResource: URI): Promise<IChatModel | undefined> {
		return this.progressService.withProgress({ location: ChatViewId, delay: 200 }, async () => {
			let queue: Promise<void> = Promise.resolve();

			// A delay here to avoid blinking because only Cloud sessions are slow, most others are fast
			const clearWidget = disposableTimeout(() => {
				// clear current model without starting a new one
				queue = this.showModel(undefined, false).then(() => { });
			}, 100);

			const sessionType = getChatSessionType(sessionResource);
			if (sessionType !== localChatSessionType) {
				await this.chatSessionsService.canResolveChatSession(sessionResource);
			}

			const newModelRef = await this.chatService.loadSessionForResource(sessionResource, ChatAgentLocation.Chat, CancellationToken.None);
			clearWidget.dispose();
			await queue;
			return this.showModel(newModelRef);
		});
	}

	//#endregion

	override focus(): void {
		super.focus();

		this.focusInput();
	}

	focusInput(): void {
		this._widget.focusInput();
	}

	focusSessions(): boolean {
		if (this.sessionsContainer?.style.display === 'none') {
			return false; // not visible
		}

		this.sessionsControl?.focus();

		return true;
	}

	//#region Layout

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);

		this.lastDimensions = { height, width };

		let remainingHeight = height;
		let remainingWidth = width;

		// Sessions Control
		const { heightReduction, widthReduction } = this.layoutSessionsControl(remainingHeight, remainingWidth);
		remainingHeight -= heightReduction;
		remainingWidth -= widthReduction;

		// Title Control
		remainingHeight -= this.titleControl?.getHeight() ?? 0;

		// Chat Widget
		this._widget.layout(remainingHeight, remainingWidth);

		// Remember last dimensions per orientation
		this.lastDimensionsPerOrientation.set(this.sessionsViewerOrientation, { height, width });
	}

	private layoutSessionsControl(height: number, width: number): { heightReduction: number; widthReduction: number } {
		let heightReduction = 0;
		let widthReduction = 0;

		if (!this.sessionsContainer || !this.sessionsControlContainer || !this.sessionsControl || !this.viewPaneContainer || !this.sessionsTitleContainer || !this.sessionsLinkContainer || !this.sessionsTitle || !this.sessionsLink) {
			return { heightReduction, widthReduction };
		}

		const oldSessionsViewerOrientation = this.sessionsViewerOrientation;
		let newSessionsViewerOrientation: AgentSessionsViewerOrientation;
		switch (this.sessionsViewerOrientationConfiguration) {
			// Stacked
			case 'stacked':
				newSessionsViewerOrientation = AgentSessionsViewerOrientation.Stacked;
				break;
			// Update orientation based on available width
			default:
				newSessionsViewerOrientation = width >= ChatViewPane.SESSIONS_SIDEBAR_VIEW_MIN_WIDTH ? AgentSessionsViewerOrientation.SideBySide : AgentSessionsViewerOrientation.Stacked;
		}

		this.sessionsViewerOrientation = newSessionsViewerOrientation;

		if (newSessionsViewerOrientation === AgentSessionsViewerOrientation.SideBySide) {
			this.viewPaneContainer.classList.toggle('sessions-control-orientation-sidebyside', true);
			this.viewPaneContainer.classList.toggle('sessions-control-orientation-stacked', false);
			this.sessionsViewerOrientationContext.set(AgentSessionsViewerOrientation.SideBySide);
		} else {
			this.viewPaneContainer.classList.toggle('sessions-control-orientation-sidebyside', false);
			this.viewPaneContainer.classList.toggle('sessions-control-orientation-stacked', true);
			this.sessionsViewerOrientationContext.set(AgentSessionsViewerOrientation.Stacked);
		}

		// Update limited state based on orientation change
		if (oldSessionsViewerOrientation !== this.sessionsViewerOrientation) {
			const oldSessionsViewerLimited = this.sessionsViewerLimited;
			this.sessionsViewerLimited = this.sessionsViewerOrientation === AgentSessionsViewerOrientation.Stacked;

			let updatePromise: Promise<void>;
			if (oldSessionsViewerLimited !== this.sessionsViewerLimited) {
				updatePromise = this.notifySessionsControlLimitedChanged(false /* already in layout */);
			} else {
				updatePromise = this.sessionsControl?.update(); // still need to update for section visibility
			}

			// Switching to side-by-side, reveal the current session after elements have loaded
			if (this.sessionsViewerOrientation === AgentSessionsViewerOrientation.SideBySide) {
				updatePromise.then(() => {
					const sessionResource = this._widget?.viewModel?.sessionResource;
					if (sessionResource) {
						this.sessionsControl?.reveal(sessionResource);
					}
				});
			}
		}

		// Ensure visibility is in sync before we layout
		const { visible: sessionsContainerVisible } = this.updateSessionsControlVisibility();
		if (!sessionsContainerVisible) {
			return { heightReduction: 0, widthReduction: 0 };
		}

		let availableSessionsHeight = height - this.sessionsTitleContainer.offsetHeight - this.sessionsLinkContainer.offsetHeight;
		if (this.sessionsViewerOrientation === AgentSessionsViewerOrientation.Stacked) {
			availableSessionsHeight -= ChatViewPane.MIN_CHAT_WIDGET_HEIGHT; // always reserve some space for chat input
		}

		// Show as sidebar
		if (this.sessionsViewerOrientation === AgentSessionsViewerOrientation.SideBySide) {
			this.sessionsControlContainer.style.height = `${availableSessionsHeight}px`;
			this.sessionsControlContainer.style.width = `${ChatViewPane.SESSIONS_SIDEBAR_WIDTH}px`;
			this.sessionsControl.layout(availableSessionsHeight, ChatViewPane.SESSIONS_SIDEBAR_WIDTH);

			heightReduction = 0; // side by side to chat widget
			widthReduction = this.sessionsContainer.offsetWidth;
		}

		// Show stacked (grows with the number of items displayed)
		else {
			let sessionsHeight: number;
			if (this.sessionsViewerLimited) {
				sessionsHeight = this.sessionsCount * AgentSessionsListDelegate.ITEM_HEIGHT;
			} else {
				sessionsHeight = (ChatViewPane.SESSIONS_LIMIT + 2 /* expand a bit to indicate more items */) * AgentSessionsListDelegate.ITEM_HEIGHT;
			}

			sessionsHeight = Math.min(availableSessionsHeight, sessionsHeight);

			this.sessionsControlContainer.style.height = `${sessionsHeight}px`;
			this.sessionsControlContainer.style.width = ``;
			this.sessionsControl.layout(sessionsHeight, width);

			heightReduction = this.sessionsContainer.offsetHeight;
			widthReduction = 0; // stacked on top of the chat widget
		}

		return { heightReduction, widthReduction };
	}

	getLastDimensions(orientation: AgentSessionsViewerOrientation): { height: number; width: number } | undefined {
		return this.lastDimensionsPerOrientation.get(orientation);
	}

	//#endregion

	override saveState(): void {

		// Don't do saveState when no widget, or no viewModel in which case
		// the state has not yet been restored - in that case the default
		// state would overwrite the real state
		if (this._widget?.viewModel) {
			this._widget.saveState();

			this.updateViewState();
			this.memento.saveMemento();
		}

		super.saveState();
	}

	private updateViewState(viewState?: IChatModelInputState): void {
		const newViewState = viewState ?? this._widget.getViewState();
		if (newViewState) {
			for (const [key, value] of Object.entries(newViewState)) {
				(this.viewState as Record<string, unknown>)[key] = value; // Assign all props to the memento so they get saved
			}
		}
	}

	override shouldShowWelcome(): boolean {
		const noPersistedSessions = !this.chatService.hasSessions();
		const hasCoreAgent = this.chatAgentService.getAgents().some(agent => agent.isCore && agent.locations.includes(ChatAgentLocation.Chat));
		const hasDefaultAgent = this.chatAgentService.getDefaultAgent(ChatAgentLocation.Chat) !== undefined; // only false when Hide AI Features has run and unregistered the setup agents
		const shouldShow = !hasCoreAgent && (!hasDefaultAgent || !this._widget?.viewModel && noPersistedSessions);

		this.logService.trace(`ChatViewPane#shouldShowWelcome() = ${shouldShow}: hasCoreAgent=${hasCoreAgent} hasDefaultAgent=${hasDefaultAgent} || noViewModel=${!this._widget?.viewModel} && noPersistedSessions=${noPersistedSessions}`);

		return !!shouldShow;
	}

	override getActionsContext(): IChatViewTitleActionContext | undefined {
		return this._widget?.viewModel ? {
			sessionResource: this._widget.viewModel.sessionResource,
			$mid: MarshalledId.ChatViewContext
		} : undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatViewTitleControl.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatViewTitleControl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/chatViewTitleControl.css';
import { addDisposableListener, EventType, h } from '../../../../base/browser/dom.js';
import { renderAsPlaintext } from '../../../../base/browser/markdownRenderer.js';
import { Gesture, EventType as TouchEventType } from '../../../../base/browser/touch.js';
import { Emitter } from '../../../../base/common/event.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { localize } from '../../../../nls.js';
import { HiddenItemStrategy, MenuWorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IChatViewTitleActionContext } from '../common/chatActions.js';
import { IChatModel } from '../common/chatModel.js';
import { ChatConfiguration } from '../common/constants.js';
import { AgentSessionProviders, getAgentSessionProviderIcon } from './agentSessions/agentSessions.js';
import { ActionViewItem, IActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { IAction } from '../../../../base/common/actions.js';
import { AgentSessionsPicker } from './agentSessions/agentSessionsPicker.js';

export interface IChatViewTitleDelegate {
	focusChat(): void;
}

export class ChatViewTitleControl extends Disposable {

	private static readonly DEFAULT_TITLE = localize('chat', "Chat");
	private static readonly PICK_AGENT_SESSION_ACTION_ID = 'workbench.action.chat.pickAgentSession';

	private readonly _onDidChangeHeight = this._register(new Emitter<void>());
	readonly onDidChangeHeight = this._onDidChangeHeight.event;

	private title: string | undefined = undefined;

	private titleContainer: HTMLElement | undefined;
	private titleLabel = this._register(new MutableDisposable<ChatViewTitleLabel>());

	private model: IChatModel | undefined;
	private modelDisposables = this._register(new MutableDisposable());

	private navigationToolbar?: MenuWorkbenchToolBar;
	private actionsToolbar?: MenuWorkbenchToolBar;

	private lastKnownHeight = 0;

	constructor(
		private readonly container: HTMLElement,
		private readonly delegate: IChatViewTitleDelegate,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		this.render(this.container);

		this.registerListeners();
		this.registerActions();
	}

	private registerListeners(): void {

		// Update on configuration changes
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(ChatConfiguration.ChatViewTitleEnabled)) {
				this.doUpdate();
			}
		}));
	}

	private registerActions(): void {
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: ChatViewTitleControl.PICK_AGENT_SESSION_ACTION_ID,
					title: localize('chat.pickAgentSession', "Pick Agent Session"),
					f1: false,
					menu: [{
						id: MenuId.ChatViewSessionTitleNavigationToolbar,
						group: 'navigation',
						order: 2
					}]
				});
			}

			async run(accessor: ServicesAccessor): Promise<void> {
				const instantiationService = accessor.get(IInstantiationService);

				const agentSessionsPicker = instantiationService.createInstance(AgentSessionsPicker);
				await agentSessionsPicker.pickAgentSession();
			}
		}));
	}

	private render(parent: HTMLElement): void {
		const elements = h('div.chat-view-title-container', [
			h('div.chat-view-title-navigation-toolbar@navigationToolbar'),
			h('span.chat-view-title-icon@icon'),
			h('div.chat-view-title-actions-toolbar@actionsToolbar'),
		]);

		// Toolbar on the left
		this.navigationToolbar = this._register(this.instantiationService.createInstance(MenuWorkbenchToolBar, elements.navigationToolbar, MenuId.ChatViewSessionTitleNavigationToolbar, {
			actionViewItemProvider: (action: IAction) => {
				if (action.id === ChatViewTitleControl.PICK_AGENT_SESSION_ACTION_ID) {
					this.titleLabel.value = new ChatViewTitleLabel(action);
					this.titleLabel.value.updateTitle(this.title ?? ChatViewTitleControl.DEFAULT_TITLE, this.getIcon());

					return this.titleLabel.value;
				}

				return undefined;
			},
			hiddenItemStrategy: HiddenItemStrategy.NoHide,
			menuOptions: { shouldForwardArgs: true }
		}));

		// Actions toolbar on the right
		this.actionsToolbar = this._register(this.instantiationService.createInstance(MenuWorkbenchToolBar, elements.actionsToolbar, MenuId.ChatViewSessionTitleToolbar, {
			menuOptions: { shouldForwardArgs: true },
			hiddenItemStrategy: HiddenItemStrategy.NoHide
		}));

		// Title controls
		this.titleContainer = elements.root;
		this._register(Gesture.addTarget(this.titleContainer));
		for (const eventType of [TouchEventType.Tap, EventType.CLICK]) {
			this._register(addDisposableListener(this.titleContainer, eventType, () => {
				this.delegate.focusChat();
			}));
		}

		parent.appendChild(this.titleContainer);
	}

	update(model: IChatModel | undefined): void {
		this.model = model;

		this.modelDisposables.value = model?.onDidChange(e => {
			if (e.kind === 'setCustomTitle' || e.kind === 'addRequest') {
				this.doUpdate();
			}
		});

		this.doUpdate();
	}

	private doUpdate(): void {
		const markdownTitle = new MarkdownString(this.model?.title ?? '');
		this.title = renderAsPlaintext(markdownTitle);

		this.updateTitle(this.title ?? ChatViewTitleControl.DEFAULT_TITLE);

		const context = this.model && {
			$mid: MarshalledId.ChatViewContext,
			sessionResource: this.model.sessionResource
		} satisfies IChatViewTitleActionContext;

		if (this.navigationToolbar) {
			this.navigationToolbar.context = context;
		}

		if (this.actionsToolbar) {
			this.actionsToolbar.context = context;
		}
	}

	private updateTitle(title: string): void {
		if (!this.titleContainer) {
			return;
		}

		this.titleContainer.classList.toggle('visible', this.shouldRender());
		this.titleLabel.value?.updateTitle(title, this.getIcon());

		const currentHeight = this.getHeight();
		if (currentHeight !== this.lastKnownHeight) {
			this.lastKnownHeight = currentHeight;

			this._onDidChangeHeight.fire();
		}
	}

	private getIcon(): ThemeIcon | undefined {
		const sessionType = this.model?.contributedChatSession?.chatSessionType;
		switch (sessionType) {
			case AgentSessionProviders.Background:
			case AgentSessionProviders.Cloud:
				return getAgentSessionProviderIcon(sessionType);
		}

		return undefined;
	}

	private shouldRender(): boolean {
		if (!this.isEnabled()) {
			return false; // title hidden via setting
		}

		return !!this.model?.title; // we need a chat showing and not being empty
	}

	private isEnabled(): boolean {
		return this.configurationService.getValue<boolean>(ChatConfiguration.ChatViewTitleEnabled) === true;
	}

	getHeight(): number {
		if (!this.titleContainer || this.titleContainer.style.display === 'none') {
			return 0;
		}

		return this.titleContainer.offsetHeight;
	}
}

class ChatViewTitleLabel extends ActionViewItem {

	private title: string | undefined;
	private icon: ThemeIcon | undefined;

	private titleLabel: HTMLSpanElement | undefined = undefined;
	private titleIcon: HTMLSpanElement | undefined = undefined;

	constructor(action: IAction, options?: IActionViewItemOptions) {
		super(null, action, { ...options, icon: false, label: true });
	}

	override render(container: HTMLElement): void {
		super.render(container);

		container.classList.add('chat-view-title-action-item');
		this.label?.classList.add('chat-view-title-label-container');

		this.titleIcon = this.label?.appendChild(h('span').root);
		this.titleLabel = this.label?.appendChild(h('span.chat-view-title-label').root);

		this.updateLabel();
		this.updateIcon();
	}

	updateTitle(title: string, icon: ThemeIcon | undefined): void {
		this.title = title;
		this.icon = icon;

		this.updateLabel();
		this.updateIcon();
	}

	protected override updateLabel(): void {
		if (!this.titleLabel) {
			return;
		}

		if (this.title) {
			this.titleLabel.textContent = this.title;
		} else {
			this.titleLabel.textContent = '';
		}
	}

	private updateIcon(): void {
		if (!this.titleIcon) {
			return;
		}

		if (this.icon) {
			this.titleIcon.className = ThemeIcon.asClassName(this.icon);
		} else {
			this.titleIcon.className = '';
		}
	}
}
```

--------------------------------------------------------------------------------

````
